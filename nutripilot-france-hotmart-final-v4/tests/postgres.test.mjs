import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Pool} from 'pg';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import net from 'node:net';
import path from 'node:path';
import {PostgresStore,postgresOptions,initializePostgresSchema,importLegacySnapshot} from '../ops/postgres-store.mjs';
import {createSharedBudget} from '../ops/shared-budget.mjs';
const url=process.env.TEST_DATABASE_URL;
const root=path.resolve(import.meta.dirname,'..');
const email='scale-test@example.invalid',hash=crypto.createHash('sha256').update(email).digest('hex');
const secret='synthetic-shared-storage-test-secret-12345';
const token=()=>{const p=Buffer.from(JSON.stringify({email,exp:Math.floor(Date.now()/1000)+3600})).toString('base64url');return p+'.'+crypto.createHmac('sha256',secret).update(p).digest('base64url');};
async function port(){const s=net.createServer();s.listen(0,'127.0.0.1');await once(s,'listening');const n=s.address().port;await new Promise(r=>s.close(r));return n;}
async function app(t,extra={}){
 const p=await port(),base='http://127.0.0.1:'+p;
 const child=spawn(process.execPath,['server.mjs'],{cwd:root,env:{...process.env,NODE_ENV:'test',PORT:String(p),APP_URL:base,STORAGE_BACKEND:'postgres',DATABASE_URL:url,DATABASE_TLS:'disabled',ACCESS_TOKEN_SECRET:secret,AI_ENABLED:'false',FX_URL:'http://127.0.0.1:1',REVENUECAT_WEBHOOK_AUTH:'synthetic-webhook',BACKUP_ENCRYPTION_KEY:'a'.repeat(64),...extra},stdio:['ignore','pipe','pipe']});
 let logs='';child.stdout.on('data',d=>{logs+=d});child.stderr.on('data',d=>{logs+=d});
 t.after(async()=>{if(child.exitCode===null){const done=once(child,'exit');child.kill();await done;}});
 for(let i=0;;i++){if(child.exitCode!==null)throw new Error('Application failed: '+logs);try{if((await fetch(base+'/api/health')).ok)break;}catch{}if(i>150)throw new Error('Application did not start: '+logs);await new Promise(r=>setTimeout(r,25));}
 return {base,async post(route,body,auth=true){return fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json',...(auth?{Authorization:'Bearer '+token()}: {})},body:JSON.stringify(body)});}};
}

test('PostgreSQL configuration rejects insecure production TLS and accidental URL overrides',()=>{
 assert.throws(()=>postgresOptions({DATABASE_URL:'postgres://host/db',NODE_ENV:'production',DATABASE_TLS:'disabled'}));
 assert.throws(()=>postgresOptions({DATABASE_URL:'postgres://host/db?sslmode=no-verify'}));
 assert.throws(()=>postgresOptions({DATABASE_URL:'postgres://host/db',DB_POOL_MAX:'10000'}));
 assert.equal(postgresOptions({DATABASE_URL:'postgres://host/db'}).ssl.rejectUnauthorized,true);
});

test('Real PostgreSQL: shared transactions, budgets, migration and two application processes',{skip:!url},async t=>{
 const opts=postgresOptions({DATABASE_URL:url,DATABASE_TLS:'disabled',NODE_ENV:'test',DB_POOL_MAX:'6'});
 const p1=new Pool(opts),p2=new Pool(opts),a=new PostgresStore(p1),b=new PostgresStore(p2);
 t.after(async()=>{await p1.end();await p2.end();});
 await initializePostgresSchema(p1);await a.checkSchema();
 const clear=()=>p1.query('TRUNCATE np_documents,np_rate_limits');
 await clear();
 await t.test('Independent pools do not lose concurrent updates, rollback preserves data',async()=>{
  await Promise.all(Array.from({length:100},(_,i)=>(i%2?a:b).mutate('legacy','count',{n:0},value=>{value.n++;return {value};})));
  assert.equal((await a.read('legacy','count',null)).n,100);
  await assert.rejects(a.mutate('legacy','count',{},value=>{value.n=0;throw new Error('rollback');}));
  assert.equal((await b.read('legacy','count',null)).n,100);
  assert.equal(await a.health(),true);assert.equal((await p1.query("SELECT count(*)::int n FROM np_documents WHERE kind='health'")).rows[0].n,0);
 });
 await t.test('A locked account does not lock another account',async()=>{
  let release,locked;const ready=new Promise(r=>{locked=r});
  const first=a.mutate('entitlement','one',{},async value=>{locked();await new Promise(r=>{release=r});return {value};});
  await ready;
  try{await Promise.race([b.mutate('entitlement','two',{},value=>({value})),new Promise((_,reject)=>{const x=setTimeout(()=>reject(new Error('unrelated account blocked')),1500);x.unref();})]);}finally{release();await first;}
 });
 await t.test('Rate limits are atomic across independent pools',async()=>{
  const r=await Promise.all(Array.from({length:40},(_,i)=>(i%2?a:b).rateLimit('one-shared-key',7,60000)));
  assert.equal(r.filter(Boolean).length,7);await p1.query('UPDATE np_rate_limits SET reset_at=0');assert.equal(await b.rateLimit('one-shared-key',7,60000),true);
  await p1.query('UPDATE np_rate_limits SET reset_at=0');await a.pruneRates();assert.equal((await p1.query('SELECT count(*)::int n FROM np_rate_limits')).rows[0].n,0);
 });
 await t.test('Global attempt and concurrent budgets cannot be multiplied by replicas',async()=>{
  await clear();const x=createSharedBudget(a,{daily:5,monthly:10}),y=createSharedBudget(b,{daily:5,monthly:10});
  const r1=await x.reserve(),r2=await y.reserve();await assert.rejects(x.reserve(),/occupé/);await r1();await r1();const r3=await y.reserve();await r2();await r3();
  for(let i=0;i<2;i++){const release=await x.reserve();await release();}await assert.rejects(y.reserve(),/limite/);
  assert.equal((await a.read('legacy','ai-usage.json',null)).daily,5);
 });
 await t.test('A crashed worker lease expires without resetting consumed attempts',async()=>{
  await clear();let now=Date.now();const x=createSharedBudget(a,{daily:5,concurrent:1,now:()=>now}),y=createSharedBudget(b,{daily:5,concurrent:1,now:()=>now});
  await x.reserve();await assert.rejects(y.reserve(),/occupé/);now+=300001;const release=await y.reserve();await release();assert.equal((await a.read('legacy','ai-usage.json',null)).daily,2);
 });
 await t.test('Offline import is atomic, validates input and never overwrites an existing destination',async()=>{
  await clear();const content=JSON.stringify({[email]:{status:'active',plan:'complete_annual',accessUntil:Date.now()+3600000}});
  const snapshot={entries:[{name:'entitlements.json',content},{name:'users/'+hash+'.json',content:JSON.stringify({profile:{name:'Synthetic'},meals:[]})}]};
  assert.equal((await importLegacySnapshot(a,snapshot)).records,2);assert.equal((await b.read('user',hash,null)).profile.name,'Synthetic');
  await assert.rejects(importLegacySnapshot(b,snapshot),/empty/);assert.equal((await a.read('user',hash,null)).profile.name,'Synthetic');
  await clear();await assert.rejects(importLegacySnapshot(a,{entries:[...snapshot.entries,{name:'../bad',content:'{}'}]}));assert.equal((await p1.query('SELECT count(*)::int n FROM np_documents')).rows[0].n,0);
  await importLegacySnapshot(a,snapshot);
 });
 await t.test('Two app processes share user state, one-time login, purchases and deletion',async t=>{
  let subscription={store:'app_store',original_purchase_date:new Date().toISOString(),expires_date:new Date(Date.now()+3600000).toISOString()};
  const {default:http}=await import('node:http');const provider=http.createServer((req,res)=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify({subscriber:{subscriptions:{np_complete_monthly:subscription}}}));});provider.listen(0,'127.0.0.1');await once(provider,'listening');t.after(async()=>{provider.closeAllConnections();await new Promise(r=>provider.close(r));});
  const extra={REVENUECAT_SECRET_KEY:'synthetic-secret',REVENUECAT_API_BASE:'http://127.0.0.1:'+provider.address().port};
  const one=await app(t,extra),two=await app(t,extra);
  let r=await one.post('/api/user/state',{state:{profile:{name:'Shared profile'},meals:[]}});assert.equal(r.status,200);
  const data=await(await fetch(two.base+'/api/user/state',{headers:{Authorization:'Bearer '+token()}})).json();assert.equal(data.state.profile.name,'Shared profile');
  const h=await(await fetch(two.base+'/api/health')).json();assert.equal(h.persistence.shared,true);assert.equal(h.backups.enabled,false);assert.equal(h.backups.requiresDatabaseBackup,true);
  await a.mutate('entitlement',email,null,value=>{value.codeHash=crypto.createHash('sha256').update('123456').digest('hex');value.codeExpiresAt=Date.now()+60000;value.codeAttempts=0;return {value};});
  const results=await Promise.all([one.post('/api/access/verify',{email,code:'123456'},false),two.post('/api/access/verify',{email,code:'123456'},false)]);assert.deepEqual(results.map(x=>x.status).sort(),[200,401]);
  const id='np-'+crypto.createHash('sha256').update('nutripilot:'+email).digest('hex').slice(0,32);
  r=await one.post('/api/iap/verify',{appUserId:id});assert.equal(r.status,200);assert.equal((await r.json()).premium,true);
  assert.equal((await(await two.post('/api/access/status',{token:token()})).json()).premium,true);
  subscription={...subscription,expires_date:new Date(Date.now()-1000).toISOString()};
  const hook=await fetch(two.base+'/api/revenuecat/webhook',{method:'POST',headers:{Authorization:'Bearer synthetic-webhook','Content-Type':'application/json'},body:JSON.stringify({event:{app_user_id:id}})});assert.equal(hook.status,200);
  assert.equal((await(await one.post('/api/access/status',{token:token()})).json()).premium,false);
  await a.mutate('legacy','waitlist.json',{},value=>{value[email]={plan:'test'};return {value};});
  const del=await fetch(one.base+'/api/account',{method:'DELETE',headers:{Authorization:'Bearer '+token()}});assert.equal(del.status,200);
  assert.equal(await b.read('entitlement',email,null),null);assert.equal(await b.read('user',hash,null),null);assert.equal((await b.read('legacy','waitlist.json',{}))[email],undefined);
  await assert.rejects(b.saveUser(email,hash,{meals:[]}),/access changed/);
 });
 await clear();
});

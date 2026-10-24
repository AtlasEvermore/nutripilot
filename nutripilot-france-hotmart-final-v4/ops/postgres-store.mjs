import crypto from 'node:crypto';
import fs from 'node:fs/promises';

const record = value => value && typeof value === 'object' && !Array.isArray(value);
const clone = value => value === undefined ? undefined : structuredClone(value);
export function postgresOptions(env = process.env) {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL required for PostgreSQL storage');
  let url;try { url = new URL(env.DATABASE_URL); } catch { throw new Error('Invalid database configuration'); }
  if (!url.hostname || !url.pathname || url.pathname==='/' || !['postgres:','postgresql:'].includes(url.protocol)) throw new Error('Invalid database protocol');
  // URL options must not silently replace the strict TLS configuration.
  for (const k of ['sslmode','sslcert','sslkey','sslrootcert']) if (url.searchParams.has(k)) throw new Error('Set database TLS using DATABASE_TLS and DATABASE_CA_FILE');
  const plain = env.DATABASE_TLS === 'disabled';
  if (plain && env.NODE_ENV === 'production') throw new Error('Production database TLS cannot be disabled');
  const max = Number(env.DB_POOL_MAX || 5);
  if (!Number.isSafeInteger(max) || max < 1 || max > 20) throw new Error('DB_POOL_MAX must be 1–20');
  return {connectionString:env.DATABASE_URL,max,connectionTimeoutMillis:5000,idleTimeoutMillis:30000,statement_timeout:5000,idle_in_transaction_session_timeout:10000,application_name:'nutripilot',ssl:plain?false:{rejectUnauthorized:true}};
}
export async function createPostgresStore(env = process.env) {
  const {Pool}=await import('pg');const options=postgresOptions(env);
  if(env.DATABASE_CA_FILE && options.ssl)options.ssl.ca=await fs.readFile(env.DATABASE_CA_FILE,'utf8');
  const pool=new Pool(options);pool.on('error',()=>console.error('[NutriPilot] Database connection unavailable.'));
  const store=new PostgresStore(pool);
  try { await store.checkSchema();if(!await store.read('migration','legacy-import',null))throw new Error('Data cutover not prepared'); } catch { await pool.end(); throw new Error('PostgreSQL schema unavailable; prepare it explicitly before switching storage'); }
  return store;
}
export async function initializePostgresSchema(pool) {
  const sql=await fs.readFile(new URL('./sql/001-shared-storage.sql',import.meta.url),'utf8');
  const c=await pool.connect();try {await c.query('BEGIN');await c.query(sql);await c.query('COMMIT');}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
}
export class PostgresStore {
  constructor(pool){this.pool=pool;}
  async checkSchema(){const r=await this.pool.query("SELECT version FROM np_schema WHERE module='core'");if(r.rows[0]?.version!==1)throw new Error('Unsupported database schema');}
  async transaction(work){const c=await this.pool.connect();try{await c.query('BEGIN');const value=await work(c);await c.query('COMMIT');return value;}catch(e){try{await c.query('ROLLBACK');}catch{}throw e;}finally{c.release();}}
  async lock(c,kind,key){await c.query('SELECT pg_advisory_xact_lock(hashtextextended($1,0))',[kind+':'+key]);}
  async read(kind,key,fallback,c=this.pool){const r=await c.query('SELECT value FROM np_documents WHERE kind=$1 AND key=$2',[kind,key]);if(!r.rows.length)return clone(fallback);const value=r.rows[0].value;if(!record(value))throw new Error('Invalid database record');return value;}
  async write(c,kind,key,value){
    if(value===null){await c.query('DELETE FROM np_documents WHERE kind=$1 AND key=$2',[kind,key]);return;}
    if(!record(value))throw new Error('Invalid database record');
    await c.query('INSERT INTO np_documents(kind,key,value) VALUES($1,$2,$3::jsonb) ON CONFLICT(kind,key) DO UPDATE SET value=EXCLUDED.value,updated_at=now()',[kind,key,JSON.stringify(value)]);
  }
  async mutate(kind,key,fallback,work){return this.transaction(async c=>{await this.lock(c,kind,key);const current=await this.read(kind,key,fallback,c);const next=await work(current);await this.write(c,kind,key,next.value);return next.result;});}
  async all(kind,ids){
    const r=ids?await this.pool.query("SELECT key,value FROM np_documents WHERE kind='entitlement' AND (value->'storeAccounts') ?| $1::text[]",[ids]):await this.pool.query('SELECT key,value FROM np_documents WHERE kind=$1',[kind]);
    return Object.fromEntries(r.rows.map(x=>[x.key,x.value]));
  }
  async page(kind,{limit=100,after=''}={}){
    limit=Math.max(1,Math.min(1000,Number(limit)||100));limit=Math.floor(limit);
    const r=await this.pool.query('SELECT key,value FROM np_documents WHERE kind=$1 AND key>$2 ORDER BY key LIMIT $3',[kind,after,limit+1]);
    const rows=r.rows.slice(0,limit);const count=await this.pool.query('SELECT count(*)::text n FROM np_documents WHERE kind=$1',[kind]);
    return {count:Number(count.rows[0].n),list:Object.fromEntries(rows.map(x=>[x.key,x.value])),next:r.rows.length>limit?rows.at(-1)?.key:null};
  }
  async saveUser(email,key,value){return this.transaction(async c=>{await this.lock(c,'entitlement',email);const entry=await this.read('entitlement',email,null,c);if(!entry || entry.status!=='active' || (entry.accessUntil && Number(entry.accessUntil)<Date.now()))throw Object.assign(new Error('Account access changed; sign in again'),{statusCode:401});await this.lock(c,'user',key);await this.write(c,'user',key,value);});}
  async deleteAccount(email){const hash=crypto.createHash('sha256').update(email).digest('hex');return this.transaction(async c=>{await this.lock(c,'entitlement',email);await this.lock(c,'user',hash);await this.lock(c,'waitlist',email);await this.write(c,'waitlist',email,null);await this.write(c,'user',hash,null);await this.write(c,'entitlement',email,null);});}
  async rateLimit(key,limit,windowMs){
    if(!Number.isSafeInteger(limit)||limit<1||!Number.isFinite(windowMs)||windowMs<=0)return false;
    const now=Date.now(),hashed=crypto.createHash('sha256').update(key).digest('hex');
    const r=await this.pool.query('INSERT INTO np_rate_limits(key,count,reset_at) VALUES($1,1,$2) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN np_rate_limits.reset_at<=$3 THEN 1 ELSE np_rate_limits.count+1 END,reset_at=CASE WHEN np_rate_limits.reset_at<=$3 THEN $2 ELSE np_rate_limits.reset_at END WHERE np_rate_limits.reset_at<=$3 OR np_rate_limits.count<$4 RETURNING count',[hashed,now+windowMs,now,limit]);return r.rows.length===1;
  }
  async pruneRates(){await this.pool.query('DELETE FROM np_rate_limits WHERE key IN (SELECT key FROM np_rate_limits WHERE reset_at<$1 LIMIT 5000)',[Date.now()]);await this.pool.query("DELETE FROM np_documents WHERE kind='auth-state' AND key IN (SELECT key FROM np_documents WHERE kind='auth-state' AND (value->>'expiresAt')::bigint<$1 LIMIT 5000)",[Date.now()]);}
  async health(){try {await this.transaction(async c=>{await c.query("INSERT INTO np_documents(kind,key,value) VALUES('health',$1,'{}')",[crypto.randomUUID()]);throw Object.assign(new Error('probe'),{probe:true});});}catch(e){if(e.probe)return true;return false;}return false;}
  async close(){await this.pool.end();}
}
// Offline-only import: validates every source before writing and refuses a nonempty destination.
// Never removes or changes the original files. The caller must establish a verified backup first.
export async function importLegacySnapshot(store,snapshot){
  const entries=[];let seen=new Set();
  for(const file of snapshot.entries || []){
    if(seen.has(file.name))throw new Error('Duplicate import entry');seen.add(file.name);
    const value=JSON.parse(file.content);if(!record(value))throw new Error('Invalid source record');
    if(file.sha256 && crypto.createHash('sha256').update(file.content).digest('hex')!==file.sha256)throw new Error('Source checksum mismatch');
    if(file.name==='entitlements.json'){for(const [key,v]of Object.entries(value)){if(!record(v))throw new Error('Invalid entitlement');entries.push(['entitlement',key,v]);}}
    else if(file.name==='waitlist.json'){for(const [key,v]of Object.entries(value)){if(!record(v))throw new Error('Invalid waitlist entry');entries.push(['waitlist',key,v]);}}
    else if(/^users\/[a-f0-9]{64}\.json$/.test(file.name))entries.push(['user',file.name.slice(6,-5),value]);
    else if(['free-scans.json','waitlist.json','funnel.json','last-webhook.json','ai-usage.json'].includes(file.name))entries.push(['legacy',file.name,value]);
    else throw new Error('Unexpected source entry');
  }
  if(!seen.has('entitlements.json'))throw new Error('Missing entitlements source');
  return store.transaction(async c=>{await store.lock(c,'migration','legacy');const r=await c.query('SELECT ((SELECT count(*) FROM np_documents)+(SELECT count(*) FROM np_rate_limits))::int AS n');if(r.rows[0].n)throw new Error('Destination must be empty');for(const [kind,key,value]of entries)await store.write(c,kind,key,value);await store.write(c,'migration','legacy-import',{completedAt:new Date().toISOString(),records:entries.length});return {records:entries.length};});
}

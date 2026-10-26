import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import net from 'node:net';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import vm from 'node:vm';
import { checkApplication } from '../ops/smoke.mjs';

const root = path.resolve(import.meta.dirname, '..');
const appSource = await fs.readFile(path.join(root, 'app.js'), 'utf8');
const secret = 'isolated-regression-tests-only-123456789';
const meal = { title: 'Arroz', foods: [{ name: 'Arroz cozido', grams: 100, kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 }], confidence: .8 };
const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aGTcAAAAASUVORK5CYII=';
async function freePort() {
  const s = net.createServer(); s.listen(0, '127.0.0.1'); await once(s, 'listening');
  const port = s.address().port; await new Promise(r => s.close(r)); return port;
}
async function fixture(t, { ai = true, globalLimit = 50, guests = true, enabled = true, store = false, storeReadKey = '', fxDelay = 0, fxFailure = false } = {}) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'np-regression-'));
  const requests = []; const storeRequests = []; let mode = 'meal'; let calls = 0; let fxCalls = 0; let subscriber = {subscriptions:{}};
  const provider = http.createServer(async (req, res) => {
    let raw = ''; for await (const part of req) raw += part;
    if (req.url === '/fx') {
      fxCalls++;if(fxDelay) await new Promise(resolve=>setTimeout(resolve,fxDelay));
      res.setHeader('Content-Type','application/json');res.statusCode=fxFailure?503:200;
      return res.end(JSON.stringify(fxFailure?{}:{rates:{USD:1,BRL:5}}));
    }
    const body = raw ? JSON.parse(raw) : {}; requests.push(body); calls++;
    res.setHeader('Content-Type', 'application/json');
    if (req.url.startsWith('/rc/')) {
      storeRequests.push({url:req.url,authorization:req.headers.authorization});
      if(mode === 'store-failure') { res.statusCode=503; return res.end('{}'); }
      return res.end(JSON.stringify({subscriber}));
    }
    if (mode === 'failure') { res.statusCode = 400; return res.end(JSON.stringify({ error: { message: 'provider-test-secret-must-not-leak' } })); }
    if (mode === 'quota') { res.statusCode = 429; return res.end(JSON.stringify({ error: { code: 'insufficient_quota', message: 'You have no credits remaining.' } })); }
    if (mode === 'retry' && calls === 1) { res.statusCode = 503; return res.end('{}'); }
    const result = mode === 'coach' ? 'Inclua uma fonte de proteína no jantar.' : mode === 'empty' ? '{}' : JSON.stringify(meal);
    res.end(JSON.stringify({ output: [{ content: [{ type: 'output_text', text: result }] }] }));
  });
  provider.listen(0, '127.0.0.1'); await once(provider, 'listening');
  const aiUrl = `http://127.0.0.1:${provider.address().port}`;
  await fs.writeFile(path.join(dir, 'entitlements.json'), JSON.stringify({ 'tester@example.invalid': { status: 'active', plan: 'premium', accessUntil: Date.now() + 86400000 } }));
  const port = await freePort(); const url = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ['server.mjs'], { cwd: root, env: {
    ...process.env, NODE_ENV: 'production', PORT: String(port), APP_URL: url, DATA_DIR: dir,
    ACCESS_TOKEN_SECRET: secret, OPENAI_API_KEY: ai ? 'test-key' : '', OPENAI_MODEL: ai ? 'test-model' : '',
    AI_ENABLED: String(enabled), AI_ALLOW_GUESTS: String(guests), AI_GLOBAL_MONTHLY_LIMIT: '500', AI_USER_DAILY_LIMIT: '10',
    OPENAI_BASE_URL: aiUrl, FX_URL: `${aiUrl}/fx`, FREE_SCANS: '3', AI_GLOBAL_DAILY_LIMIT: String(globalLimit),
    RESEND_API_KEY: '', REVENUECAT_READ_KEY: storeReadKey, REVENUECAT_SECRET_KEY: store ? 'test-store-secret' : '', REVENUECAT_WEBHOOK_AUTH: store ? 'test-hook-secret' : '', REVENUECAT_API_BASE: `${aiUrl}/rc`, ADMIN_KEY: 'isolated-test-admin-key',
  }, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = ''; child.stdout.on('data', x => { logs += x; }); child.stderr.on('data', x => { logs += x; });
  async function stop() {
    if (child.exitCode !== null || child.signalCode !== null) return;
    const ended = once(child, 'exit'); child.kill(); await ended;
  }
  t.after(async () => {
    await stop();
    provider.closeAllConnections(); await new Promise(r => provider.close(r));
    await fs.rm(dir, { recursive: true, force: true });
  });
  for (let n = 0; ; n++) {
    try { if ((await fetch(`${url}/api/health`)).ok) break; } catch {}
    if (n > 100) throw new Error(`Server did not start: ${logs}`);
    await new Promise(r => setTimeout(r, 20));
  }
  requests.length = 0; calls = 0;
  const payload = Buffer.from(JSON.stringify({ email: 'tester@example.invalid', exp: Math.floor(Date.now()/1000)+3600 })).toString('base64url');
  const token = `${payload}.${crypto.createHmac('sha256', secret).update(payload).digest('base64url')}`;
  return {
    url, dir, requests, storeRequests, token, stop,
    fxCalls() { return fxCalls; },
    subscriber(value) { subscriber = value; },
    mode(v) { mode = v; calls = 0; requests.length = 0; },
    async post(route, body, { premium = false } = {}) {
      const res = await fetch(url + route, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-NP-Device': 'regression-test-device', 'X-NP-Lang': 'pt', ...(premium ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
      return { status: res.status, data: res.status === 204 ? null : await res.json() };
    },
  };
}

test('Public assets, API validation, access control and state persistence', async t => {
  const f = await fixture(t);
  for (const file of ['/', '/app.js', '/i18n-launch.js', '/styles.css', '/food.js', '/exercises.js', '/sw.js', '/i18n/pt.js', '/vendor/barcode/barcode-detector.js', '/vendor/barcode/zxing_reader.wasm', ...['nutrition','recipes','scanner','training','menopause','nutrients','supplements','sleep','coach'].map(id => `/artwork/${id}.svg`)]) {
    const r = await fetch(f.url + file); assert.equal(r.status, 200, file); assert.ok((await r.arrayBuffer()).byteLength > 0, file);
    if (file.endsWith('.wasm')) assert.match(r.headers.get('content-type'), /application\/wasm/);
  }
  for (const route of ['/data/entitlements.json', '/server.mjs', '/auth.mjs', '/.env']) assert.equal((await fetch(f.url + route)).status, 404, route);
  for (const body of [null, [], 'bad']) assert.equal((await f.post('/api/analyze', body)).status, 400);
  assert.equal((await f.post('/api/analyze', {})).status, 400);
  assert.equal((await f.post('/api/analyze', { image: 'data:image/gif;base64,a' })).status, 400);
  assert.equal((await f.post('/api/coach', { message: 'Oi' })).status, 401);
  const state = { meals: [{ title: 'Test meal', day: '2026-10-23' }], profile: { name: 'Test' } };
  assert.equal((await f.post('/api/user/state', { state }, { premium: true })).status, 200);
  const saved = await (await fetch(f.url + '/api/user/state', { headers: { Authorization: `Bearer ${f.token}` } })).json();
  assert.equal(saved.state.meals[0].title, 'Test meal');
});

test('Photo analysis passes the image and language, computes totals and stops at the free limit', async t => {
  const f = await fixture(t);
  for (let i = 0; i < 3; i++) {
    const r = await f.post('/api/analyze', { image, mode: 'meal' });
    assert.equal(r.status, 200); assert.equal(r.data.total.kcal, 130); assert.equal(r.data.freeLeft, 2-i);
  }
  assert.equal((await f.post('/api/analyze', { image })).status, 402);
  const content = f.requests[0].input[0].content;
  assert.equal(content[1].image_url, image); assert.match(content[0].text, /português/);
});

test('Provider failure refunds BOTH device and network allowances, and does not expose internal errors', async t => {
  const f = await fixture(t); f.mode('failure');
  const r = await f.post('/api/analyze', { image });
  assert.equal(r.status, 502); assert.doesNotMatch(r.data.error, /secret/);
  const quota = JSON.parse(await fs.readFile(path.join(f.dir, 'free-scans.json'), 'utf8'));
  assert.equal(Object.values(quota.devices)[0], 0); assert.equal(Object.values(quota.ips)[0].count, 0);
  f.mode('meal'); assert.equal((await f.post('/api/analyze', { image })).data.freeLeft, 2);
});

test('Photo analysis never fabricates a meal when AI is missing or has no foods', async t => {
  const f = await fixture(t, { ai: false });
  assert.equal((await f.post('/api/analyze', { image })).status, 503);
  const g = await fixture(t); g.mode('empty');
  assert.equal((await g.post('/api/analyze', { image })).status, 502);
});

test('Transient provider failure retries and returns the actual meal', async t => {
  const f = await fixture(t); f.mode('retry');
  const r = await f.post('/api/analyze', { image });
  assert.equal(r.status, 200); assert.equal(f.requests.length, 2);
});

test('Coach returns answers, receives conversation history, and reports provider failure honestly', async t => {
  const f = await fixture(t); f.mode('coach');
  const r = await f.post('/api/coach', { message: 'E no jantar?', history: [{ role: 'user', text: 'Tenho arroz' }, { role: 'ai', text: 'Pode acompanhar legumes.' }] }, { premium: true });
  assert.equal(r.status, 200); assert.match(r.data.answer, /proteína/);
  assert.equal(f.requests[0].input[2].role, 'assistant');
  assert.equal(f.requests[0].input.at(-1).content, 'E no jantar?');
  f.mode('failure'); const failed = await f.post('/api/coach', { message: 'Oi' }, { premium: true });
  assert.equal(failed.status, 200); assert.equal(failed.data.offline, true); assert.equal(failed.data.answer, '');
});

test('A free scan counts once against the global AI allowance', async t => {
  const f = await fixture(t, { globalLimit: 2 });
  assert.equal((await f.post('/api/analyze', { image })).status, 200);
  assert.equal((await f.post('/api/analyze', { image })).status, 200);
  assert.equal((await f.post('/api/analyze', { image })).status, 429);
});

test('Closing or replacing the photo sheet during analysis leaves the new screen intact', async () => {
  let resolve; const pending = new Promise(r => { resolve = r; });
  const sheet = { loading: false }; const renders = []; const scans = [];
  const ctx = vm.createContext({ modal: sheet, state: { premium: true }, AbortController, setTimeout, clearTimeout,
    renderModal() { renders.push(ctx.modal); }, apiFetch: () => pending, pushScan: d => scans.push(d), track() {}, toast() {},
  });
  const start = appSource.indexOf('async function analyze(body) {'); const end = appSource.indexOf('\nfunction fileToData(', start);
  vm.runInContext(appSource.slice(start, end), ctx);
  const job = ctx.analyze({ image }); ctx.modal = { type: 'different' };
  resolve({ ok: true, status: 200, json: async () => meal }); await job;
  assert.equal(ctx.modal.type, 'different'); assert.equal(ctx.modal.result, undefined); assert.equal(renders.length, 1); assert.equal(scans.length, 1);
  const job2 = ctx.analyze({ image }); ctx.modal = null; await job2; // must not throw in finally
});

function coachClient() {
  let resolve; const pending = new Promise(r => { resolve = r; });
  const sent = [];
  const ctx = vm.createContext({
    state: { premium: true, coachUsesData: false, profile: { name: 'PRIVATE', diet: 'PRIVATE', dailyKcal: 1700 }, coach: [], weights: [{ weight: 99 }] },
    coachMode: 'nutrition', coachDraft: 'my question', coachRequestId: 0,
    $: () => ({ value: 'my question' }), saveState() {}, render() {}, track() {}, totals: () => ({ kcal: 0, protein: 0 }),
    coachContext: () => { throw new Error('must not collect personal context'); },
    apiFetch: (_url, options) => { sent.push(JSON.parse(options.body)); return pending; },
    setTimeout, clearTimeout, AbortController, navigator: { onLine: true }, AiConsentError: class extends Error {},
    L: x => x, localCoachAnswer: () => 'Local data only', toast() {},
  });
  const start = appSource.indexOf('let coachBusy = false;');
  const end = appSource.indexOf('\nfunction loadingHtml(', start);
  vm.runInContext(appSource.slice(start, end), ctx);
  return { ctx, sent, resolve };
}

test('Coach respects data opt-out, keeps a new draft while answering, and unlocks after a reply', async () => {
  const { ctx, sent, resolve } = coachClient();
  const job = ctx.sendCoach();
  assert.equal(ctx.coachDraft, '');
  assert.deepEqual(Object.keys(sent[0]).sort(), ['history', 'message', 'mode']);
  ctx.coachDraft = 'next question';
  resolve({ status: 200, ok: true, json: async () => ({ answer: 'Answer to first question' }) });
  await job;
  assert.equal(ctx.coachDraft, 'next question');
  assert.equal(ctx.state.coach.at(-1).text, 'Answer to first question');
  assert.equal(ctx.state.coach.filter(m => m.pending).length, 0);
});

test('An answer arriving after clearing the conversation does not resurrect deleted messages', async () => {
  const { ctx, resolve } = coachClient(); const job = ctx.sendCoach();
  ctx.coachRequestId++; ctx.state.coach = [];
  resolve({ status: 200, ok: true, json: async () => ({ answer: 'Old answer' }) });
  await job; assert.equal(ctx.state.coach.length, 0);
});

test('A missing image canvas rejects cleanly instead of leaving the upload stuck', async () => {
  const revoked = [];
  const ctx = vm.createContext({
    Image: class { constructor() { this.width = 100; this.height = 100; } set src(v) { this.onload(); } },
    URL: { createObjectURL: () => 'blob:test', revokeObjectURL: v => revoked.push(v) },
    document: { createElement: () => ({ getContext: () => null }) },
  });
  const start = appSource.indexOf('function fileToData('); const end = appSource.indexOf('\nfunction voiceInput(', start);
  vm.runInContext(appSource.slice(start, end), ctx);
  await assert.rejects(ctx.fileToData({}), /Impossible de lire/); assert.deepEqual(revoked, ['blob:test']);
});

test('Offline service worker never substitutes HTML for a missing script', async () => {
  const handlers = {}; let result;
  const html = new Response('<html>offline</html>');
  const ctx = vm.createContext({
    self: { addEventListener: (name, fn) => { handlers[name] = fn; } }, URL, Response, AbortController, setTimeout, clearTimeout,
    caches: { match: async req => req === '/index.html' ? html : undefined },
    fetch: async () => { throw new Error('offline'); },
  });
  vm.runInContext(await fs.readFile(path.join(root, 'sw.js'), 'utf8'), ctx);
  handlers.fetch({ request: { url: 'https://test.invalid/i18n/pt.js', method: 'GET', mode: 'cors' }, respondWith: p => { result = p; } });
  assert.equal((await result).type, 'error');
  handlers.fetch({ request: { url: 'https://test.invalid/', method: 'GET', mode: 'navigate' }, respondWith: p => { result = p; } });
  assert.equal(await (await result).text(), '<html>offline</html>');
});


test('Exhausted AI credit is not retried; the circuit pauses calls and refunds scans', async t => {
  const f = await fixture(t); f.mode('quota');
  assert.equal((await f.post('/api/analyze', { image })).status, 502);
  assert.equal(f.requests.length, 1);
  assert.equal((await f.post('/api/analyze', { image })).status, 503);
  assert.equal(f.requests.length, 1);
  const health = await (await fetch(f.url + '/api/health')).json();
  assert.equal(health.aiProvider.status, 'unavailable');
  assert.equal(health.backups.enabled, false);
  const quota = JSON.parse(await fs.readFile(path.join(f.dir, 'free-scans.json')));
  assert.equal(Object.values(quota.devices)[0], 0);
});

test('Corrupted purchases or user data fail without erasing or treating them as empty', async t => {
  const f = await fixture(t);
  await fs.writeFile(path.join(f.dir, 'entitlements.json'), '{broken');
  assert.equal((await f.post('/api/user/state', { state: {} }, { premium: true })).status, 500);
  assert.equal(await fs.readFile(path.join(f.dir, 'entitlements.json'), 'utf8'), '{broken');
  assert.equal((await fetch(f.url + '/api/health')).status, 503);
  await fs.writeFile(path.join(f.dir, 'entitlements.json'), JSON.stringify({ 'tester@example.invalid': { status: 'active' } }));
  const name = crypto.createHash('sha256').update('tester@example.invalid').digest('hex') + '.json';
  await fs.writeFile(path.join(f.dir, 'users', name), '{broken');
  assert.equal((await fetch(f.url + '/api/user/state', { headers: { Authorization: `Bearer ${f.token}` } })).status, 500);
  assert.equal((await f.post('/api/user/state', { state: {} }, { premium: true })).status, 500);
  assert.equal(await fs.readFile(path.join(f.dir, 'users', name), 'utf8'), '{broken');
  await fs.writeFile(path.join(f.dir, 'users', name), '[]');
  assert.equal((await fetch(f.url + '/api/user/state', { headers: { Authorization: `Bearer ${f.token}` } })).status, 500);
});


test('Release verification checks public routes and distinguishes unconfigured backup protection', async t => {
  const f = await fixture(t);
  const result = await checkApplication(f.url, { expectedVersion: '18.1.0' });
  assert.deepEqual(result.issues, []);
  const operational = await checkApplication(f.url, { expectedVersion: '18.1.0', operational: true });
  assert.ok(operational.issues.includes('Independent backup is not verified'));
  const wrong = await checkApplication(f.url, { expectedVersion: 'old-version' });
  assert.match(wrong.issues.join(' '), /expected old-version/);
});


test('Corrupt free allowances are preserved and never reset into new free AI usage', async t => {
  const f = await fixture(t);
  for (const corrupt of ['{broken', '[]', '{"devices":null,"ips":{}}', '{"devices":{"test":-1},"ips":{}}']) {
    await fs.writeFile(path.join(f.dir, 'free-scans.json'), corrupt);
    assert.equal((await f.post('/api/analyze', { image })).status, 500);
    assert.equal(await fs.readFile(path.join(f.dir, 'free-scans.json'), 'utf8'), corrupt);
    assert.equal(f.requests.length, 0);
  }
  await fs.writeFile(path.join(f.dir, 'free-scans.json'), '{"devices":{},"ips":{}}');
  assert.equal((await f.post('/api/analyze', { image })).status, 200);
});

test('Concurrent waitlist entries survive and malformed storage is not overwritten', async t => {
  const f = await fixture(t);
  const responses = await Promise.all(Array.from({length: 6}, (_, n) => f.post('/api/waitlist', {email: `lead${n}@example.invalid`, lang: 'pt'})));
  assert.ok(responses.every(r => r.status === 200));
  const file = path.join(f.dir, 'waitlist.json');
  assert.equal(Object.keys(JSON.parse(await fs.readFile(file))).length, 6);
  await fs.writeFile(file, '{broken');
  assert.equal((await f.post('/api/waitlist', {email: 'next@example.invalid'})).status, 500);
  assert.equal(await fs.readFile(file, 'utf8'), '{broken');
  await fs.writeFile(file, '{}');
  assert.equal((await f.post('/api/waitlist', {email: 'next@example.invalid'})).status, 200);
});

test('Funnel flushes serialize, preserve corrupted data and retry buffered events without duplication', async t => {
  const f = await fixture(t);
  const read = () => fetch(f.url + '/api/admin/funnel', {headers:{'x-admin-key':'isolated-test-admin-key'}});
  await Promise.all(Array.from({length: 20}, () => f.post('/api/event', {name:'PlansView',lang:'pt'})));
  const reads = await Promise.all([read(),read(),read()]);
  assert.ok(reads.every(r => r.status === 200));
  const counts = (await reads[2].json()).counts;
  assert.equal(Object.values(counts).reduce((a,b)=>a+b,0),20);
  const file = path.join(f.dir, 'funnel.json');
  await fs.writeFile(file, '{broken');
  await f.post('/api/event', {name:'PlansView',lang:'pt'});
  assert.equal((await read()).status,500);
  assert.equal(await fs.readFile(file,'utf8'),'{broken');
  await fs.writeFile(file, JSON.stringify(counts));
  assert.equal(Object.values((await (await read()).json()).counts).reduce((a,b)=>a+b,0),21);
  assert.equal(Object.values((await (await read()).json()).counts).reduce((a,b)=>a+b,0),21);
});

test('Web and authenticated account deletion both remove the owned waitlist entry and saved state', async t => {
  for (const web of [false,true]) {
    const f = await fixture(t);
    const email = 'tester@example.invalid';
    await f.post('/api/user/state', {state:{meals:[{title:'Private test meal'}]}}, {premium:true});
    await fs.writeFile(path.join(f.dir,'waitlist.json'), JSON.stringify({[email]:{lang:'pt'},'other@example.invalid':{lang:'fr'}}));
    const file = path.join(f.dir,'entitlements.json');
    const all = JSON.parse(await fs.readFile(file));
    Object.assign(all[email], {codeHash:crypto.createHash('sha256').update('123456').digest('hex'),codeExpiresAt:Date.now()+60000,codeAttempts:0});
    await fs.writeFile(file,JSON.stringify(all));
    const response = web
      ? await fetch(f.url+'/delete-account/confirm',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({email,code:'123456'})})
      : await fetch(f.url+'/api/account',{method:'DELETE',headers:{Authorization:`Bearer ${f.token}`}});
    assert.equal(response.status,200);
    assert.equal(JSON.parse(await fs.readFile(file))[email],undefined);
    assert.deepEqual(Object.keys(JSON.parse(await fs.readFile(path.join(f.dir,'waitlist.json')))),['other@example.invalid']);
    await assert.rejects(fs.stat(path.join(f.dir,'users',crypto.createHash('sha256').update(email).digest('hex')+'.json')),/ENOENT/);
  }
});

test('Graceful shutdown saves pending funnel events before exiting', async t => {
  const f = await fixture(t);
  await f.post('/api/event',{name:'PlansView',lang:'pt'});
  await f.stop();
  const counts = JSON.parse(await fs.readFile(path.join(f.dir,'funnel.json')));
  assert.equal(Object.values(counts).reduce((a,b)=>a+b,0),1);
});

test('Visitors cannot spend AI credits and public help works without any provider request', async t => {
 const f=await fixture(t,{guests:false});
 assert.equal((await f.post('/api/analyze',{image})).status,401);
 assert.equal((await f.post('/api/coach',{message:'Hello'})).status,401);
 const answer=await f.post('/api/support',{lang:'pt',messages:[{role:'user',text:'Como cancelar minha assinatura?'}]});
 assert.equal(answer.status,200);assert.equal(answer.data.source,'help-center');assert.match(answer.data.answer,/iPhone/);assert.doesNotMatch(answer.data.answer,/Hotmart/i);
 assert.equal(f.requests.length,0);
 const config=await(await fetch(f.url+'/api/config')).json();assert.equal(config.freeScans,0);assert.equal(config.aiPolicy.subscribersOnly,true);
 assert.equal((await f.post('/api/analyze',{image},{premium:true})).status,200);
 assert.equal(f.requests.length,1);
});

test('The kill switch and a zero global limit refuse paid requests before reaching the provider', async t => {
 for(const options of [{enabled:false},{globalLimit:0}]) {
  const f=await fixture(t,options);
  assert.equal((await f.post('/api/analyze',{image},{premium:true})).status,429);
  assert.equal(f.requests.length,0);
 }
});

test('A retry consumes the remaining persistent allowance and cannot exceed the daily cap', async t => {
 const f=await fixture(t,{globalLimit:1});f.mode('retry');
 assert.equal((await f.post('/api/analyze',{image})).status,429);
 assert.equal(f.requests.length,1);
 const usage=JSON.parse(await fs.readFile(path.join(f.dir,'ai-usage.json')));assert.equal(usage.daily,1);
});

test('Meal entry shows paid access, visible method choices and an inline recoverable error', () => {
 const ctx=vm.createContext({state:{premium:false,meals:[]},config:{ai:true,freeScans:0},modal:{tab:'photo',error:'Service unavailable'},L:x=>x,icon:()=>'',esc:String,recommendedTier:()=> 'complete',freeScanBanner:()=>'',canScan:()=>false,hasModule:()=>false,window:{},navigator:{},recentTab:()=>'',manualResults:()=>'',Billing:{trialDays:()=>0}});
 const a=appSource.indexOf('function addSheet() {'),b=appSource.indexOf('\nconst localFood',a);
 vm.runInContext(appSource.slice(a,b),ctx);
 const c=appSource.indexOf('function addTab(tab) {'),d=appSource.indexOf('\nfunction manualResults',c);
 vm.runInContext(appSource.slice(c,d),ctx);
 const html=ctx.addSheet();assert.match(html,/meal-methods/);assert.match(html,/role="alert"/);assert.match(html,/aria-pressed="true"/);assert.match(html,/data-mtab="manual"/);assert.doesNotMatch(html,/id="meal-image"/);
 ctx.modal.loading=true;assert.match(ctx.addSheet(),/data-close/);
 ctx.state.premium=true;ctx.config.ai=false;ctx.modal.loading=false;assert.match(ctx.addTab('photo'),/momentanément en pause/);
});

test('Browser visitors are never promised an unconfirmed store trial',()=>{
 const a=appSource.indexOf('const Billing = {'),b=appSource.indexOf('\n};',a)+3;
 const ctx=vm.createContext({nativePlatform:()=>false,window:{},config:{trialDays:7}});
 vm.runInContext(appSource.slice(a,b),ctx);
 assert.equal(vm.runInContext('Billing.trialDays()',ctx),0);
 assert.equal(vm.runInContext('Billing.trialFor({annual:{}},"annual")',ctx),0);
});

test('Only a verified account can validate its own store customer; missing expiry and other payment sources never grant access',async t=>{
 const f=await fixture(t,{store:true});const email='tester@example.invalid';const id='np-'+crypto.createHash('sha256').update('nutripilot:'+email).digest('hex').slice(0,32);
 const initial={ [email]:{status:'none'} };await fs.writeFile(path.join(f.dir,'entitlements.json'),JSON.stringify(initial));
 assert.equal((await f.post('/api/iap/verify',{appUserId:id})).status,401);
 assert.equal((await f.post('/api/iap/verify',{appUserId:'np-'+'a'.repeat(32)},{premium:true})).status,403);assert.equal(f.requests.length,0);
 const active={store:'app_store',expires_date:new Date(Date.now()+3600000).toISOString(),original_purchase_date:'2026-10-24T00:00:00Z'};
 for(const sub of [{...active,expires_date:null},{...active,store:'stripe'},{...active,refunded_at:new Date().toISOString()}]){
  f.subscriber({subscriptions:{np_complete_monthly:sub}});const r=await f.post('/api/iap/verify',{appUserId:id},{premium:true});assert.equal(r.status,200);assert.equal(r.data.premium,false);
 }
 f.subscriber({subscriptions:{np_complete_monthly:active}});const good=await f.post('/api/iap/verify',{appUserId:id},{premium:true});assert.equal(good.data.premium,true);assert.equal(good.data.plan,'complete_monthly');
 const saved=JSON.parse(await fs.readFile(path.join(f.dir,'entitlements.json')))[email];assert.equal(saved.accessUntil,Date.parse(active.expires_date));
 f.subscriber({subscriptions:{np_complete_monthly:{...active,expires_date:new Date(Date.now()-60000).toISOString()}}});assert.equal((await f.post('/api/iap/verify',{appUserId:id},{premium:true})).data.premium,false);
});

test('Removed web checkout and legacy payment routes cannot grant purchases or redirect to external payment',async t=>{
 const f=await fixture(t);assert.equal((await fetch(f.url+'/checkout?plan=complete&period=monthly',{redirect:'manual'})).status,404);
 const before=await fs.readFile(path.join(f.dir,'entitlements.json'),'utf8');assert.equal((await f.post('/api/hotmart/webhook',{event:'PURCHASE_APPROVED'},{premium:true})).status,404);assert.equal(await fs.readFile(path.join(f.dir,'entitlements.json'),'utf8'),before);
 const config=await(await fetch(f.url+'/api/config')).json();assert.equal(config.webCheckout,undefined);assert.equal(config.salesUrl,undefined);
});

test('Native storefront waits for confirmed products and never advertises a fallback trial',()=>{
 const a=appSource.indexOf('const Billing = {'),b=appSource.indexOf('\n};',a)+3;const ctx=vm.createContext({nativePlatform:()=>true,window:{},config:{trialDays:7},L:x=>x,appHeader:()=>'',bottom:()=>''});vm.runInContext(appSource.slice(a,b),ctx);
 const c=appSource.indexOf('function storeLoadingScreen() {'),d=appSource.indexOf('\nfunction ',appSource.indexOf('function paywall()',c)+20);
 vm.runInContext(appSource.slice(c,d),ctx);assert.equal(vm.runInContext('Billing.trialDays()',ctx),0);assert.equal(vm.runInContext('Billing.trialFor({annual:{}},"annual")',ctx),0);const html=vm.runInContext('paywall()',ctx);assert.match(html,/data-store-retry/);assert.doesNotMatch(html,/data-buy|7 jours|\$\d/);
});

test('Locked content does not invent a free trial, and incomplete store catalogs cannot display fallback prices',()=>{
 const ctx=vm.createContext({nativePlatform:()=>true,window:{NutriPilotNative:{purchase:()=>{},products:{month:{price:12}}}},config:{plans:[{tier:'complete',monthly:{storeId:'month'},annual:{storeId:'year'}}]},L:x=>x,icon:()=>'',esc:x=>x,recommendedTier:()=> 'complete',DEFAULT_PLANS:[]});
 const a=appSource.indexOf('const Billing = {'),b=appSource.indexOf('\n};',a)+3;vm.runInContext(appSource.slice(a,b),ctx);
 const c=appSource.indexOf('const sellable ='),d=appSource.indexOf('\n',c);vm.runInContext(appSource.slice(c,d),ctx);
 const e=appSource.indexOf('function trialPitch('),f=appSource.indexOf('function trialSheet()',e);vm.runInContext(appSource.slice(e,f),ctx);
 assert.equal(vm.runInContext('Billing.plans().length',ctx),0);
 const html=vm.runInContext('trialPitch()',ctx);assert.doesNotMatch(html,/gratuits|\b3\b|\b7\b/);assert.match(html,/Voir les formules/);
 ctx.window.NutriPilotNative.products.year={price:100};assert.equal(vm.runInContext('Billing.plans().length',ctx),1);
});


test('Concurrent health probes stay healthy and detect new corruption without a stale readiness cache',async t=>{
 const f=await fixture(t);
 const statuses=await Promise.all(Array.from({length:128},async()=> (await fetch(f.url+'/api/health')).status));
 assert.ok(statuses.every(x=>x===200));
 await fs.writeFile(path.join(f.dir,'entitlements.json'),'{broken');assert.equal((await fetch(f.url+'/api/health')).status,503);
 await fs.writeFile(path.join(f.dir,'entitlements.json'),'{}');assert.equal((await fetch(f.url+'/api/health')).status,200);
 const files=await fs.readdir(f.dir);assert.ok(files.every(name=>!name.startsWith('.health-')));
});

test('A cold exchange-rate cache shares concurrent fetches and backs off failures without blocking configuration',async t=>{
 const f=await fixture(t,{fxDelay:200});
 const configs=await Promise.all(Array.from({length:40},async()=>await(await fetch(f.url+'/api/config')).json()));
 assert.equal(f.fxCalls(),1);assert.ok(configs.every(x=>x.rates.BRL===5));
 const failed=await fixture(t,{fxFailure:true});
 const statuses=await Promise.all(Array.from({length:40},async()=> (await fetch(failed.url+'/api/config')).status));
 assert.ok(statuses.every(x=>x===200));assert.equal(failed.fxCalls(),1);
});

test('Concurrent autosaves cannot recreate user data after account deletion', async t => {
  const f = await fixture(t);
  const state = { profile: { name: 'Synthetic deletion race' }, notes: 'x'.repeat(600000) };
  const saves = Array.from({ length: 8 }, () => f.post('/api/user/state', { state }, { premium: true }));
  await new Promise(resolve => setTimeout(resolve, 10));
  const deletion = await fetch(f.url + '/api/account', { method: 'DELETE', headers: { Authorization: `Bearer ${f.token}` } });
  assert.equal(deletion.status, 200);
  const results = await Promise.all(saves);
  assert.ok(results.every(r => r.status === 200 || r.status === 401));
  const file = path.join(f.dir, 'users', crypto.createHash('sha256').update('tester@example.invalid').digest('hex') + '.json');
  await assert.rejects(fs.access(file), { code: 'ENOENT' });
});


test('Saved user data excludes client authentication credentials', async t => {
  const f = await fixture(t);
  const state = { profile: { name: 'Synthetic profile' }, accessToken: 'must-not-persist', accountToken: 'must-not-persist', premium: true, premiumEmail: 'must-not-persist' };
  assert.equal((await f.post('/api/user/state', { state }, { premium: true })).status, 200);
  const saved = await (await fetch(f.url + '/api/user/state', { headers: { Authorization: `Bearer ${f.token}` } })).json();
  for (const key of ['accessToken', 'accountToken', 'premium', 'premiumEmail']) assert.equal(Object.hasOwn(saved.state, key), false);
  assert.equal(saved.state.profile.name, state.profile.name);
});

test('A stalled uncached service-worker request always terminates', async () => {
  const handlers = {}, timers = new Map(); let next = 0, result, signal;
  const ctx = vm.createContext({
    self: { addEventListener: (name, fn) => { handlers[name] = fn; } }, URL, Response, AbortController,
    setTimeout: fn => { timers.set(++next, fn); return next; }, clearTimeout: id => timers.delete(id),
    caches: { match: async () => undefined },
    fetch: (_request, options) => { signal = options?.signal; return new Promise(() => {}); },
  });
  vm.runInContext(await fs.readFile(path.join(root, 'sw.js'), 'utf8'), ctx);
  handlers.fetch({ request: { url: 'https://test.invalid/i18n/new.js', method: 'GET', mode: 'cors' }, respondWith: p => { result = p; } });
  for (const fn of [...timers.values()]) fn();
  const response = await Promise.race([result, new Promise(resolve => setTimeout(() => resolve('hung'), 40))]);
  assert.notEqual(response, 'hung'); assert.equal(response.type, 'error'); assert.equal(signal.aborted, true);
});

test('Legal and account-deletion pages bypass the service-worker cache', async () => {
  const handlers = {};
  const ctx = vm.createContext({ self: { addEventListener: (name, fn) => { handlers[name] = fn; } }, URL, Response, AbortController, setTimeout, clearTimeout });
  vm.runInContext(await fs.readFile(path.join(root, 'sw.js'), 'utf8'), ctx);
  for (const route of ['/privacy', '/terms', '/delete-account', '/support']) {
    let intercepted = false;
    handlers.fetch({ request: { url: 'https://test.invalid' + route, method: 'GET', mode: 'navigate' }, respondWith: () => { intercepted = true; } });
    assert.equal(intercepted, false, route);
  }
});

test('Shell refresh survives a full cache and falls back on server failure', async () => {
  for (const status of [200, 503]) {
    const handlers = {}; let result, writes = 0;
    const ctx = vm.createContext({
      self: { addEventListener: (name, fn) => { handlers[name] = fn; } }, URL, Response, AbortController, setTimeout, clearTimeout,
      caches: { match: async () => new Response('saved shell'), open: async () => ({ put: async () => { writes++; throw new Error('cache full'); } }) },
      fetch: async () => new Response('fresh shell', { status }),
    });
    vm.runInContext(await fs.readFile(path.join(root, 'sw.js'), 'utf8'), ctx);
    handlers.fetch({ request: { url: 'https://test.invalid/app.js', method: 'GET', mode: 'cors' }, respondWith: p => { result = p; } });
    assert.equal(await (await result).text(), status === 200 ? 'fresh shell' : 'saved shell');
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(writes, status === 200 ? 1 : 0);
  }
});


test('Sync bounds oversized input and concurrent writes without losing a valid saved state', async t => {
  const f = await fixture(t);
  const tooLarge = await f.post('/api/user/state', { state: { notes: 'x'.repeat(2600000) } }, { premium: true });
  assert.equal(tooLarge.status, 413);
  const state = { profile: { name: 'Synthetic bounded sync' }, notes: 'x'.repeat(600000) };
  const writes = await Promise.all(Array.from({length:24}, () => f.post('/api/user/state', {state}, {premium:true})));
  assert.ok(writes.some(r=>r.status===429));assert.ok(writes.some(r=>r.status===200));assert.ok(writes.every(r=>r.status===200||r.status===429));
  const saved = await (await fetch(f.url + '/api/user/state', {headers:{Authorization:`Bearer ${f.token}`}})).json();
  assert.equal(saved.state.profile.name, state.profile.name);assert.equal(saved.state.notes.length, state.notes.length);
  assert.equal((await f.post('/api/user/state', {state:{profile:{name:'Recovered'}}}, {premium:true})).status,200);
});


test('Subscription status uses an explicit read key, with no administrative credential required',async t=>{
 const f=await fixture(t,{storeReadKey:'appl_synthetic_read_key'});
 const email='tester@example.invalid';const id='np-'+crypto.createHash('sha256').update('nutripilot:'+email).digest('hex').slice(0,32);
 f.subscriber({subscriptions:{np_complete_monthly:{store:'app_store',expires_date:new Date(Date.now()+3600000).toISOString()}}});
 const result=await f.post('/api/iap/verify',{appUserId:id},{premium:true});
 assert.equal(result.status,200);assert.equal(result.data.premium,true);
 assert.deepEqual(f.storeRequests,[{url:'/rc/v1/subscribers/'+id,authorization:'Bearer appl_synthetic_read_key'}]);
});

test('Webhook authentication and authoritative status resist forged events and preserve data on provider failure',async t=>{
 const f=await fixture(t,{store:true,storeReadKey:'appl_synthetic_read_key'});
 const email='tester@example.invalid',id='np-synthetic-hook';const file=path.join(f.dir,'entitlements.json');
 await fs.writeFile(file,JSON.stringify({[email]:{status:'none',storeAccounts:{[id]:{until:0,plans:[]}}}}));
 const original=await fs.readFile(file,'utf8');
 const hook=(auth,event)=>fetch(f.url+'/api/revenuecat/webhook',{method:'POST',headers:{'Content-Type':'application/json',...(auth?{Authorization:auth}:{})},body:JSON.stringify({event})});
 for(const auth of [null,'Bearer forged-token',f.token]) assert.equal((await hook(auth,{app_user_id:id})).status,401);
 assert.equal(await fs.readFile(file,'utf8'),original);assert.equal(f.storeRequests.length,0);
 assert.equal((await hook('Bearer test-hook-secret',{app_user_id:id,aliases:'bad'})).status,400);
 assert.equal((await hook('Bearer test-hook-secret',{app_user_id:'unlinked-customer',type:'INITIAL_PURCHASE'})).status,200);
 assert.equal(await fs.readFile(file,'utf8'),original);assert.equal(f.storeRequests.length,0);
 assert.equal((await hook('Bearer test-hook-secret',{app_user_id:id,type:'INITIAL_PURCHASE',expiration_at_ms:Date.now()+999999999})).status,200);
 assert.notEqual(JSON.parse(await fs.readFile(file,'utf8'))[email].status,'active');
 const sub={store:'app_store',expires_date:new Date(Date.now()+3600000).toISOString()};
 f.subscriber({subscriptions:{np_complete_monthly:sub}});
 assert.equal((await hook('Bearer test-hook-secret',{app_user_id:id,type:'RENEWAL'})).status,200);
 let saved=await fs.readFile(file,'utf8');assert.equal(JSON.parse(saved)[email].status,'active');
 assert.equal(f.storeRequests.at(-1).authorization,'Bearer appl_synthetic_read_key');
 f.mode('store-failure');assert.equal((await hook('Bearer test-hook-secret',{app_user_id:id,type:'EXPIRATION'})).status,502);
 assert.equal(await fs.readFile(file,'utf8'),saved);
 f.mode('meal');f.subscriber({subscriptions:{np_complete_monthly:{...sub,expires_date:new Date(Date.now()-60000).toISOString()}}});
 assert.equal((await hook('Bearer test-hook-secret',{app_user_id:id,type:'RENEWAL'})).status,200);
 assert.equal(JSON.parse(await fs.readFile(file,'utf8'))[email].status,'revoked');
});

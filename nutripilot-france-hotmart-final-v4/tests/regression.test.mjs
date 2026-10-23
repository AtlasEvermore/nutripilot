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
async function fixture(t, { ai = true, globalLimit = 0, hotmart = '' } = {}) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'np-regression-'));
  const requests = []; let mode = 'meal'; let calls = 0;
  const provider = http.createServer(async (req, res) => {
    let raw = ''; for await (const part of req) raw += part;
    const body = raw ? JSON.parse(raw) : {}; requests.push(body); calls++;
    res.setHeader('Content-Type', 'application/json');
    if (req.url === '/fx') return res.end(JSON.stringify({ rates: { USD: 1, BRL: 5 } }));
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
    OPENAI_BASE_URL: aiUrl, FX_URL: `${aiUrl}/fx`, FREE_SCANS: '3', AI_GLOBAL_DAILY_LIMIT: String(globalLimit),
    RESEND_API_KEY: '', REVENUECAT_SECRET_KEY: '', HOTMART_HOTTOK: hotmart,
  }, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = ''; child.stdout.on('data', x => { logs += x; }); child.stderr.on('data', x => { logs += x; });
  t.after(async () => {
    child.kill(); await once(child, 'exit').catch(() => {});
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
    url, dir, requests, token,
    mode(v) { mode = v; calls = 0; requests.length = 0; },
    async post(route, body, { premium = false } = {}) {
      const res = await fetch(url + route, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-NP-Device': 'regression-test-device', 'X-NP-Lang': 'pt', ...(premium ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
      return { status: res.status, data: await res.json() };
    },
  };
}

test('Public assets, API validation, access control and state persistence', async t => {
  const f = await fixture(t);
  for (const file of ['/', '/app.js', '/styles.css', '/food.js', '/exercises.js', '/sw.js', '/i18n/pt.js', '/vendor/barcode/barcode-detector.js', '/vendor/barcode/zxing_reader.wasm']) {
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
    self: { addEventListener: (name, fn) => { handlers[name] = fn; } }, URL, Response, setTimeout, clearTimeout,
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
});


test('Release verification checks public routes and distinguishes unconfigured backup protection', async t => {
  const f = await fixture(t);
  const result = await checkApplication(f.url, { expectedVersion: '18.0.2' });
  assert.deepEqual(result.issues, []);
  const operational = await checkApplication(f.url, { expectedVersion: '18.0.2', operational: true });
  assert.ok(operational.issues.includes('Independent backup is not verified'));
  const wrong = await checkApplication(f.url, { expectedVersion: 'old-version' });
  assert.match(wrong.issues.join(' '), /expected old-version/);
});


test('Hotmart authorization, purchase, duplicate, cancellation and refund preserve access rules', async t => {
  const f = await fixture(t, { hotmart: 'isolated-test-webhook-secret' });
  const payload = event => ({ event, data: { buyer: { email: 'tester@example.invalid' }, purchase: { transaction: 'TEST-ORDER', offer: { code: 'r3ueswug' } } } });
  const hook = async (event, authorized = true) => {
    const res = await fetch(f.url + '/api/hotmart/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(authorized ? { 'x-hotmart-hottok': 'isolated-test-webhook-secret' } : {}) }, body: JSON.stringify(payload(event)) });
    return { status: res.status, data: await res.json() };
  };
  const entitlements = async () => JSON.parse(await fs.readFile(path.join(f.dir, 'entitlements.json')))['tester@example.invalid'];
  assert.equal((await hook('PURCHASE_APPROVED', false)).status, 401);
  assert.equal((await hook('PURCHASE_APPROVED')).data.action, 'granted');
  const approved = await entitlements(); assert.equal(approved.status, 'active'); assert.equal(approved.plan, 'monthly');
  assert.equal((await hook('PURCHASE_APPROVED')).data.action, 'granted');
  assert.equal((await hook('SUBSCRIPTION_CANCELLATION')).data.action, 'cancel_at_period_end');
  assert.equal((await entitlements()).status, 'active');
  assert.equal((await hook('PURCHASE_REFUNDED')).data.action, 'revoked');
  assert.equal((await entitlements()).status, 'revoked');
  assert.equal((await f.post('/api/coach', { message: 'Oi' }, { premium: true })).status, 401);
});

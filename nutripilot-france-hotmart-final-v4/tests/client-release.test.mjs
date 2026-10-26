import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const source = await fs.readFile(new URL('../app.js', import.meta.url), 'utf8');
function load(ctx, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, name);
  vm.runInContext(source.slice(source.slice(start - 6, start) === 'async ' ? start - 6 : start, source.indexOf('\n}', start) + 2), ctx);
}
function syncContext() {
  const requests = [], timers = [];
  const ctx = vm.createContext({
    state: { premium: true, accessToken: 'test-only', premiumEmail: 'tester@example.invalid', updatedAt: '1', meals: ['first'] },
    navigator: { onLine: true }, AbortSignal,
    syncInFlight: null, syncRequested: false, syncStatus: 'saved', syncTimer: null,
    syncSafeState() { return JSON.parse(JSON.stringify(ctx.state)); },
    refreshSyncPill() {}, clearTimeout() {},
    setTimeout(fn, ms) { timers.push({ fn, ms }); return timers.length; },
    apiFetch(url, options) {
      return new Promise((resolve, reject) => requests.push({ url, body: JSON.parse(options.body), resolve, reject }));
    },
  });
  load(ctx, 'syncRemote');
  return { ctx, requests, timers };
}
const tick = () => new Promise(resolve => setImmediate(resolve));

test('Overlapping syncs serialize writes and drain the newest state before reporting saved', async () => {
  const { ctx, requests } = syncContext();
  const first = ctx.syncRemote();
  ctx.state.updatedAt = '2'; ctx.state.meals = ['latest'];
  assert.equal(ctx.syncRemote(), first);
  assert.equal(requests.length, 1, 'no overlapping POST');
  requests[0].resolve({ ok: true }); await tick();
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[1].body.state.meals, ['latest']);
  assert.equal(ctx.syncStatus, 'saving');
  requests[1].resolve({ ok: true }); await first;
  assert.equal(ctx.syncStatus, 'saved'); assert.equal(ctx.syncInFlight, null);
});

test('An edit made during an in-flight save is sent even before the debounce timer fires', async () => {
  const { ctx, requests } = syncContext(); const result = ctx.syncRemote();
  ctx.state.updatedAt = '2'; ctx.state.meals.push('edit');
  requests[0].resolve({ ok: true }); await tick();
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[1].body.state.meals, ['first', 'edit']);
  requests[1].resolve({ ok: true }); await result;
  assert.equal(ctx.syncStatus, 'saved');
});

test('Failed saves preserve local data and schedule one bounded retry; permanent rejection does not loop', async () => {
  for (const status of [429, 503, 401, 413]) {
    const { ctx, requests, timers } = syncContext(); const result = ctx.syncRemote();
    requests[0].resolve({ ok: false, status }); await result;
    assert.deepEqual(Array.from(ctx.state.meals), ['first']);
    assert.equal(ctx.syncStatus, status === 429 || status === 503 ? 'pending' : 'error');
    assert.equal(timers.length, status === 429 || status === 503 ? 1 : 0);
    if (timers.length) assert.equal(timers[0].ms, 30000);
  }
  const { ctx, requests, timers } = syncContext(); const result = ctx.syncRemote();
  requests[0].reject(new Error('offline')); await result;
  assert.equal(ctx.syncStatus, 'pending'); assert.equal(timers.length, 1);
});

test('A late save cannot mark a switched account saved or keep uploading after logout', async () => {
  const { ctx, requests, timers } = syncContext(); const result = ctx.syncRemote();
  ctx.state.premiumEmail = 'another@example.invalid'; ctx.state.accessToken = 'another-test-token';
  requests[0].resolve({ ok: true }); await result;
  assert.notEqual(ctx.syncStatus, 'saved'); assert.equal(requests.length, 1); assert.equal(timers.length, 0);
  ctx.state.premium = false; ctx.state.accessToken = '';
  await ctx.syncRemote(); assert.equal(requests.length, 1);
});

test('A requested save for the next account drains only after the old account request settles', async () => {
  const { ctx, requests } = syncContext(); const result = ctx.syncRemote();
  ctx.state.premiumEmail = 'another@example.invalid'; ctx.state.accessToken = 'another-test-token';
  ctx.state.meals = ['another account']; ctx.syncRemote();
  requests[0].resolve({ ok: true }); await tick();
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[1].body.state.meals, ['another account']);
  requests[1].resolve({ ok: true }); await result; assert.equal(ctx.syncStatus, 'saved');
});

test('A delayed API response cannot replace the current account token with an old session token', async () => {
  let finish; let saves = 0;
  const ctx = vm.createContext({
    state: { accessToken: 'first-session' }, aiGate: async () => {}, authHeaders: () => ({}),
    fetch: () => new Promise(resolve => { finish = resolve; }), saveState: () => saves++,
    Billing: { native: () => false },
  });
  load(ctx, 'takeFreshToken'); load(ctx, 'apiFetch');
  const pending = ctx.apiFetch('/api/user/state'); await tick();
  ctx.state.accessToken = 'new-account-session';
  finish({ status: 200, headers: { get: () => 'old-account-renewed-token' } }); await pending;
  assert.equal(ctx.state.accessToken, 'new-account-session'); assert.equal(saves, 0);
  ctx.takeFreshToken({ headers: { get: () => 'valid-renewed-session' } }, 'new-account-session');
  assert.equal(ctx.state.accessToken, 'valid-renewed-session'); assert.equal(saves, 1);
});

test('A delayed download cannot merge the previous account data into the current account', async () => {
  let finish; let merges = 0;
  const ctx = vm.createContext({
    state: { accessToken: 'first', premiumEmail: 'first@example.invalid', meals: ['local'] },
    fetch: () => new Promise(resolve => { finish = resolve; }), authHeaders: () => ({}),
    deepMerge(target, remote) { merges++; Object.assign(target, remote); return target; },
  });
  load(ctx, 'pullRemoteState'); const pending = ctx.pullRemoteState();
  ctx.state.accessToken = 'second'; ctx.state.premiumEmail = 'second@example.invalid';
  finish({ ok: true, json: async () => ({ state: { meals: ['first account private data'] } }) }); await pending;
  assert.deepEqual(Array.from(ctx.state.meals), ['local']); assert.equal(merges, 0);
});

function discoveryContext() {
  const ctx = vm.createContext({
    state: { premium: false }, config: {},
    L: (s, values = {}) => s.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? ''),
    esc: String, icon: () => '', modTitle: m => m.name, MV: () => ({ r: 300, c: 20, e: 100, p: 10 }),
    freeScansLeft: () => 0, appHeader: () => '', bottom: () => '', ownedModules: () => [], totals: () => ({ kcal: 0 }), memberCard: () => '',
    moduleById: id => ctx.MODULES.find(m => m.id === id),
    Billing: { plans() { throw new Error('Discovery must not query the storefront'); }, trialDays() { throw new Error('Trials belong in Plans'); } },
  });
  const start = source.indexOf('const MODULES = [');
  vm.runInContext(source.slice(start, source.indexOf('\n];', start) + 3) + '\nthis.MODULES = MODULES;', ctx);
  for (const name of ['moduleArtwork', 'modCard', 'moduleLockedScreen', 'revoHero', 'modsForMe', 'modulesScreen']) load(ctx, name);
  return ctx;
}

test('Every module has local artwork, a resource preview and no price, offer or purchase CTA', async () => {
  const ctx = discoveryContext();
  for (const m of ctx.MODULES) {
    const html = ctx.modCard(m, false);
    assert.match(html, new RegExp(`src="/artwork/${m.id}\\.svg"`));
    assert.match(html, new RegExp(`data-go="${m.route}"`));
    assert.doesNotMatch(html, /data-module-buy|data-buy|jours gratuits|\/ mois|Économisez|mod-price/);
    const locked = ctx.moduleLockedScreen(m.id);
    assert.match(locked, /Voir les formules/); assert.doesNotMatch(locked, /mod-price|jours gratuits/);
    const asset = await fs.readFile(new URL(`../artwork/${m.id}.svg`, import.meta.url), 'utf8');
    assert.match(asset, /viewBox="0 0 480 240"/);
    assert.doesNotMatch(asset, /<script|<image|href=|https?:\/\/(?!www.w3.org\/2000\/svg)/);
    assert.ok(Buffer.byteLength(asset) < 5000);
  }
  assert.doesNotMatch(ctx.revoHero(), /jours gratuits|\/ mois|Économisez/);
  assert.doesNotMatch(ctx.modulesScreen(), /jours gratuits|\/ mois|Économisez|kit-card/);
  assert.equal(ctx.moduleArtwork({ id: '../server.mjs' }), '');
});

test('The web store sheet never promises an unreleased store, a guessed price or a zero-day trial', () => {
  const ctx = vm.createContext({
    modal: { plan: 'complete', period: 'annual' }, config: {}, navigator: { userAgent: 'test browser' },
    L: s => s, icon: () => '', esc: String, findPlan: () => ({ tone: '', icon: '', label: 'Complete' }), planName: () => 'Complete',
  });
  load(ctx, 'storeSheet');
  const html = ctx.storeSheet();
  assert.match(html, /La publication dans les boutiques est en préparation/);
  assert.doesNotMatch(html, /href=|jours gratuits|est disponible sur|store-plan[^]*<em>/);
  ctx.config.appStoreUrl = 'https://apps.apple.com/confirmed-test-link';
  const ios = ctx.storeSheet();
  assert.match(ios, /href="https:\/\/apps.apple.com\/confirmed-test-link"/);
  assert.doesNotMatch(ios, /Google Play<\/b>|préparation/);
});

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
    AbortSignal,
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
    state: { premium: false }, config: {}, discoveryFilter: "all", constellationFocus: "nutrition",
    L: (s, values = {}) => s.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? ''),
    esc: String, icon: () => '', modTitle: m => m.name, MV: () => ({ r: 300, c: 20, e: 100, p: 10 }),
    freeScansLeft: () => 0, appHeader: () => '', bottom: () => '', ownedModules: () => [], totals: () => ({ kcal: 0 }), memberCard: () => '',
    moduleById: id => ctx.MODULES.find(m => m.id === id),
    Billing: { plans() { throw new Error('Discovery must not query the storefront'); }, trialDays() { throw new Error('Trials belong in Plans'); } },
  });
  const start = source.indexOf('const MODULES = [');
  vm.runInContext(source.slice(start, source.indexOf('\n];', start) + 3) + '\nthis.MODULES = MODULES;', ctx);
  ctx.APP_SHORT = Object.fromEntries(ctx.MODULES.map(m => [m.id, m.short || m.name]));
  for (const name of ['moduleArtwork', 'modCard', 'modulePreview', 'moduleLockedScreen', 'revoHero', 'modsForMe', 'discoveryCategory', 'constellationModule', 'constellationDetail', 'constellationMap', 'discoveryHero', 'discoveryFilters', 'appIcon', 'modulesScreen']) load(ctx, name);
  return ctx;
}

test('Every module has local artwork, a resource preview and no price, offer or purchase CTA', async () => {
  const ctx = discoveryContext();
  for (const m of ctx.MODULES) {
    const html = ctx.modCard(m, false);
    assert.match(html, new RegExp(`src="/artwork/${m.id}\\.(?:svg|webp)"`));
    assert.match(html, new RegExp(`data-go="${m.route}"`));
    assert.doesNotMatch(html, /data-module-buy|data-buy|jours gratuits|\/ mois|Économisez|mod-price/);
    const locked = ctx.moduleLockedScreen(m.id);
    assert.match(locked, /Voir les formules/); assert.doesNotMatch(locked, /mod-price|jours gratuits/);
    const src = html.match(/src="(\/artwork\/[^"\s]+)"/)[1];
    const asset = await fs.readFile(new URL(`..${src}`, import.meta.url));
    if (src.endsWith('.svg')) {
      assert.match(asset.toString(), /viewBox="0 0 480 240"/);
      assert.doesNotMatch(asset.toString(), /<script|<image|href=|https?:\/\/(?!www.w3.org\/2000\/svg)/);
      assert.ok(asset.length < 5000);
    } else {
      assert.equal(asset.subarray(0, 4).toString(), 'RIFF');
      assert.equal(asset.subarray(8, 12).toString(), 'WEBP');
      assert.ok(asset.length < 80000);
    }
  }
  assert.doesNotMatch(ctx.revoHero(), /jours gratuits|\/ mois|Économisez/);
  const apps = ctx.modulesScreen();
  assert.doesNotMatch(apps, /jours gratuits|\/ mois|Économisez|kit-card|mod-cards|revo-hero/);
  assert.equal((apps.match(/class="app-icon /g) || []).length, 9);
  for (const category of ['nourish','move','restore']) {
    ctx.discoveryFilter=category; const filtered=ctx.modulesScreen();
    const expected=ctx.MODULES.filter(m=>ctx.discoveryCategory(m.id)===category).length;
    assert.equal((filtered.match(/class="app-icon /g)||[]).length,expected);
    assert.match(filtered,new RegExp('data-discovery-filter="'+category+'" aria-pressed="true"'));
  }
  ctx.discoveryFilter='all';
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

test('Startup preserves saved credentials after temporary failures and clears them only on authoritative rejection', async () => {
  for (const mode of ['network', 'busy', 'rate', 'malformed', 'expired', 'revoked', 'active']) {
    const requests = [];
    const ctx = vm.createContext({
      state: { premium: true, accessToken: 'saved-test-session', subscriptionPlan: 'complete_annual', premiumEmail: 'test@example.invalid', profile: {}, lastOpen: '' },
      config: {}, location: { hash: '#app' }, route: 'app', navigator: {}, window: {}, AbortSignal,
      captureUtms() {}, nativeKitStart() {}, NativeBilling: { start() {} }, guardRoute() {},
      todayKey: () => '2026-10-26', saveState() {}, loadDict: async () => {}, lang: () => 'en',
      render() {}, startReminderLoop() {}, reviewMoment() {}, setTimeout() {},
      fetch: async (url, options = {}) => {
        requests.push({ url, options });
        if (url === '/api/config') return { ok: true, json: async () => ({ ai: false }) };
        if (mode === 'network') throw new TypeError('Temporary offline test');
        const status = { busy: 503, rate: 429, expired: 401 }[mode] || 200;
        return { ok: status === 200, status, json: async () => {
          if (mode === 'malformed') throw new SyntaxError('Incomplete response');
          return { premium: mode === 'active' };
        } };
      },
      apiFetch: async () => ({ ok: true, json: async () => ({ state: null }) }),
    });
    load(ctx, 'init'); await ctx.init();
    const rejected = ['expired', 'revoked'].includes(mode);
    assert.equal(ctx.state.accessToken, rejected ? '' : 'saved-test-session', mode);
    assert.equal(ctx.state.subscriptionPlan, rejected ? '' : 'complete_annual', mode);
    assert.equal(ctx.state.premium, mode === 'active', 'Unverified state does not grant paid access');
    assert.ok(requests.every(r => r.options.signal instanceof AbortSignal), 'Startup requests have a deadline');
  }
});

test('Hydration and imported daily totals remain finite and non-negative', () => {
  const ctx = vm.createContext({
    state: { water: {}, meals: [] }, todayKey: () => '2026-10-26',
    clamp: (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0)),
  });
  for (const name of ['waterToday', 'waterGoal', 'totals']) load(ctx, name);
  for (const value of [-200, 'broken', Infinity, 'Infinity']) {
    ctx.state.water['2026-10-26'] = value;
    assert.equal(ctx.waterToday(), 0);
  }
  ctx.state.water['2026-10-26'] = 1250; assert.equal(ctx.waterToday(), 1250);
  for (const value of [undefined, '', 0, NaN, 'broken', Infinity]) {
    ctx.state.waterGoal = value; assert.equal(ctx.waterGoal(), 2000);
  }
  ctx.state.waterGoal = 9000; assert.equal(ctx.waterGoal(), 5000);
  ctx.state.waterGoal = -500; assert.equal(ctx.waterGoal(), 1000);
  ctx.state.meals = [
    { day: '2026-10-26', total: { kcal: 300, protein: 20 } },
    { day: '2026-10-26', total: { kcal: -100, protein: 'not-a-number', carbs: Infinity } },
    { day: '2026-10-26', total: { kcal: '200', fat: 10 } },
    { day: '2026-10-25', total: { kcal: 999 } },
  ];
  const actual = JSON.parse(JSON.stringify(ctx.totals()));
  assert.deepEqual(actual, { kcal: 500, protein: 20, carbs: 0, fat: 10, fiber: 0 });
});

test('An incomplete store catalog shows recovery instead of a broken price comparison', () => {
  const ctx = vm.createContext({
    state: { premium: false }, nativePlatform: () => false, ownedModules: () => [],
    Billing: { plans: () => [] }, storeLoadingScreen: () => 'retry-the-store',
  });
  load(ctx, 'plansScreen'); assert.equal(ctx.plansScreen(), 'retry-the-store');
});

test('Local navigation searches translated accents, escapes unknown text and never writes account data',()=>{
 const ctx=discoveryContext();load(ctx,'esc');load(ctx,'commandEntries');load(ctx,'commandResults');
 const original=ctx.L;ctx.L=(s,v)=>original(s==='Nutrition'?'Nutrição':s,v);
 const before=JSON.stringify(ctx.state);
 assert.ok(ctx.commandEntries('NUTRICAO').some(e=>e.route==='program'));
 assert.equal(ctx.commandEntries('https://untrusted.invalid').length,0);
 const html=ctx.commandResults('<img src=x onerror=alert(1)>');
 assert.doesNotMatch(html,/<img|data-command-go=/);assert.match(html,/&lt;img/);
 assert.equal(JSON.stringify(ctx.state),before);
});

test('The mission interface reflects real catalog counts when its local focus changes',()=>{
 const ctx=discoveryContext();ctx.missionFocus='nutrition';ctx.SLEEP_NIGHTS=Array(7);ctx.fmt=String;load(ctx,'missionControl');
 for(const [focus,count] of [['nutrition',300],['training',100],['sleep',7]]){
  ctx.missionFocus=focus;const html=ctx.missionControl();
  assert.ok(html.includes(`<strong>${count}</strong>`));
  assert.ok(html.includes(`data-mission-focus="${focus}" aria-pressed="true"`));
  assert.doesNotMatch(html,/data-buy|data-choose-plan|data-module-buy|%/);
 }
});

test('Metric arrival never animates a health value through incorrect intermediate numbers',()=>{
 const values=[{textContent:'71,0',dataset:{count:'71.0'}},{textContent:'1.700',dataset:{count:'1700'}}];let animated=0;
 for(const el of values)el.classList={add(){animated++;}};
 const ctx=vm.createContext({window:{matchMedia:()=>({matches:false})},document:{querySelectorAll:()=>values}});
 load(ctx,'runMetricArrival');ctx.runMetricArrival();
 assert.deepEqual(values.map(el=>el.textContent),['71,0','1.700']);assert.equal(animated,2);
 ctx.window.matchMedia=()=>({matches:true});ctx.runMetricArrival();assert.equal(animated,2);
});


test('The constellation maps only real destinations and selection details never grant access or write health data',()=>{
 const ctx=discoveryContext();const before=JSON.stringify(ctx.state);
 const map=ctx.constellationMap();assert.equal((map.match(/data-atlas-select=/g)||[]).length,9);
 for(const m of ctx.MODULES){const detail=ctx.constellationDetail(m.id);assert.ok(detail.includes(`data-go="${m.route}"`));assert.doesNotMatch(detail,/data-buy|data-module-buy|%|mod-price/);}
 assert.equal(ctx.constellationModule('<img>').id,'nutrition');
 assert.equal(JSON.stringify(ctx.state),before);
 assert.match(ctx.constellationDetail('scanner'),/Analyses momentanément en pause/);
});


test('NEXUS adapts to recorded data, omits unavailable modules and never mutates its input',()=>{
 const ctx=vm.createContext({L:(s,v={})=>s.replace(/\{(\w+)\}/g,(_,k)=>v[k]??''),fmt:String});load(ctx,'routineSignals');
 const input={mealCount:0,waterMl:0,waterGoalMl:2000,trainingAvailable:true,trainingConfigured:true,trainingPlanned:true,trainingDone:false,sleepAvailable:true,sleepHours:0};const before=JSON.stringify(input);
 const signals=ctx.routineSignals(input);assert.equal(signals[0].id,'meals');assert.equal(signals.length,4);assert.match(signals.find(s=>s.id==='sleep').value,/Aucune nuit/);assert.equal(JSON.stringify(input),before);
 const complete=ctx.routineSignals({...input,mealCount:3,waterMl:2000,trainingDone:true,sleepHours:8});assert.equal(complete[0].id,'meals');assert.equal(complete.find(s=>s.id==='training').value,'Séance enregistrée');assert.equal(complete.find(s=>s.id==='sleep').value,'8 h');
 const restricted=ctx.routineSignals({...input,trainingAvailable:false,sleepAvailable:false});assert.equal(restricted.length,2);
 const invalid=ctx.routineSignals({...input,mealCount:Infinity,waterMl:-50,sleepHours:'broken'});assert.match(invalid.find(s=>s.id==='water').value,/^0 \/ 2000 ml$/);assert.ok(invalid.every(s=>!/[Nn]a[Nn]|Infinity|%/.test(s.value)));
});

import { test, expect } from '@playwright/test';

const routes = ['app', 'modules', 'program', 'recipes', 'shopping', 'training', 'menopause', 'scanner', 'nutrients', 'supplements', 'sleep', 'coach', 'progress', 'profile', 'goal', 'settings', 'support', 'plans'];
const seed = async (page, language = 'pt', session = {}) => page.addInitScript(({ language, session }) => {
  // Synthetic, unsigned guest state; this never grants access to a protected server endpoint.
  localStorage.setItem('nutripilot_v7', JSON.stringify({
    lang: language, basicsDone: true, helloSeen: true, onboarding: true,
    premium: false, accessToken: '', accountToken: '',
    profile: { name: 'Browser Test', age: 35, height: 170, weight: 70, target: 70, goal: 'maintain', sex: 'other', activity: 1.375, goalSet: true },
    ...session,
  }));
}, { language, session });

async function healthyScreen(page, route) {
  await page.goto(`/#${route}`);
  await expect(page.locator('#app')).not.toBeEmpty();
  await expect(page.locator('.error-state')).toHaveCount(0);
  expect(await page.evaluate(() => window.__npErrors || [])).toEqual([]);
  // Body overflow is hidden by design; inspect actual child bounds as well as scrollWidth.
  const overflow = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return [...document.querySelectorAll('#app .mobile-app, #app .screen, #app .app-head')]
      .some(el => { const r = el.getBoundingClientRect(); return r.left < -1 || r.right > width + 1; });
  });
  expect(overflow, `${route}: primary layout stays within the viewport`).toBe(false);
}

test('First launch selects a language and continues without a fabricated trial offer', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.locator('[data-lang="pt"]').click();
  await expect(page.locator('[data-lang="pt"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.welcome-cta [data-lang-ok]').click();
  await expect(page.locator('.hello-cta')).toBeVisible();
  await expect(page.locator('.hello-cta')).not.toContainText(/\d+\s+dias.*(?:teste|grátis)/i);
  expect(errors).toEqual([]);
});

for (const language of ['pt', 'en', 'fr', 'ar']) {
  test(`All main screens render in ${language} without a runtime error or primary layout overflow`, async ({ page }) => {
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await seed(page, language);
    for (const route of routes) await healthyScreen(page, route);
    await expect(page.locator('html')).toHaveAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    expect(errors).toEqual([]);
  });
}

test('Every module image loads and discovery leads to its own space before Plans', async ({ page }, testInfo) => {
  await seed(page);
  await page.goto('/#modules');
  const images = page.locator('.app-grid .module-art img');
  await expect(images).toHaveCount(9);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  await expect(page.locator('.mod-price, .kit-card, .launcher .mod-cards')).toHaveCount(0);
  await expect(page.locator('.launcher')).not.toContainText(/jours gratuits|dias grátis|\/\s*(?:mês|mois)|Économisez/i);
  await page.evaluate(() => window.scrollTo(0,0));
  await testInfo.attach('apps', { body: await page.screenshot({ animations: 'disabled' }), contentType: 'image/png' });
  await page.locator('.app-icon.m-nut').click();
  await expect(page.locator('.lock-overlay')).toBeVisible();
  await expect(page.locator('.locked-blur')).toBeEmpty();
  const previewImage=page.locator('.lock-overlay .story-visual img');
  await expect(previewImage).toBeVisible();
  await expect.poll(()=>previewImage.evaluate(el=>el.complete && el.naturalWidth>0)).toBe(true);
  await testInfo.attach('module-preview', { body: await page.screenshot({ animations: 'disabled' }), contentType: 'image/png' });
  await page.locator('.lock-overlay [data-module-buy]').click();
  await expect(page.locator('.plans-page')).toBeVisible();
  await expect(page.locator('[data-plans-tab="modules"]')).toHaveAttribute('aria-selected','true');
  await testInfo.attach('plans', { body: await page.screenshot({ animations: 'disabled' }), contentType: 'image/png' });
});

test('Protected APIs reject the synthetic guest regardless of local display state', async ({ page }) => {
  await seed(page);
  await page.goto('/#modules');
  const response = await page.request.post('/api/user/state', { data: { state: { meals: [{ title: 'synthetic' }] } } });
  expect(response.status()).toBe(401);
});

for (const status of [503, 401]) {
  test(`Startup handles access response ${status} without losing local data or granting unverified access`, async ({ page }) => {
    await seed(page, 'pt', { premium: true, accessToken: 'synthetic-invalid-session', subscriptionPlan: 'complete_annual' });
    await page.route('**/api/access/status', route => route.fulfill({ status, json: { error: 'synthetic response', premium: false } }));
    await page.goto('/#modules');
    await expect(page.locator('.launcher')).toBeVisible();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('nutripilot_v7')));
    expect(saved.accessToken).toBe(status === 401 ? '' : 'synthetic-invalid-session');
    expect(saved.premium).toBe(false);
    expect(saved.profile.name).toBe('Browser Test');
  });
}

test('Purpose filters narrow discovery without losing modules, keyboard focus or navigation', async ({page},testInfo) => {
  await seed(page);await page.goto('/#modules');
  for(const [category,count] of [['nourish',5],['move',2],['restore',2],['all',9]]) {
    const button=page.locator(`[data-discovery-filter="${category}"]`);
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed','true');
    await expect(button).toBeFocused();
    await expect(page.locator('.app-grid .app-icon')).toHaveCount(count);
    if(category==='move') {
      await expect(page.locator('.app-grid .m-train')).toBeVisible();
      await expect(page.locator('.app-grid .m-sleep')).toHaveCount(0);
    }
  }
  await page.locator('.discovery-library').scrollIntoViewIfNeeded();
  await testInfo.attach('module-journeys',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
  await page.goto('/#app');
  await testInfo.attach('today',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
});

test('Monthly choice stays monthly through comparison, selection and the confirmation page',async({page},testInfo)=>{
  await seed(page);await page.goto('/#plans');
  await page.locator('.plan-location > summary').click();
  await page.locator('[data-country]').selectOption('BR');
  await expect(page.locator('[data-country]')).toHaveValue('BR');
  await expect(page.locator('.plan-location')).toHaveAttribute('open','');
  await expect(page.locator('.plan-location > summary')).toContainText('BRL');
  await page.locator('[data-currency]').selectOption('USD');
  await expect(page.locator('.plan-location > summary')).toContainText('USD');
  await page.locator('.plan-location > summary').click();
  await page.locator('[data-period="monthly"]').click();
  await expect(page.locator('[data-period="monthly"]')).toHaveClass(/active/);
  await page.locator('[data-plans-tab="modules"]').click();
  await expect(page.locator('.plan-choice')).toHaveCount(6);
  await testInfo.attach('plan-comparison',{body:await page.screenshot({fullPage:true,animations:'disabled'}),contentType:'image/png'});
  await page.locator('.plan-choice[data-choose-plan="nutrition"]').click();
  await expect(page.locator('.pw-period[data-period="monthly"]')).toHaveAttribute('aria-checked','true');
  await expect(page.locator('.pw-period[data-period="annual"]')).toHaveAttribute('aria-checked','false');
  await testInfo.attach('plan-confirmation',{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
});

test('Journeys and plans adapt at narrow phone, large phone, tablet and desktop widths with motion reduced',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await seed(page);
  for(const width of [320,390,820,1440]) {
    await page.setViewportSize({width,height:900});
    for(const route of ['modules','plans']) {
      await healthyScreen(page,route);
      const overflow=await page.locator('.discovery-hero,.discovery-card,.discovery-filters,.plans-intro,.kit-row,.plan-choice,.plans-tabs').evaluateAll(els=>els.some(el=>{const r=el.getBoundingClientRect();return r.left < -1 || r.right > document.documentElement.clientWidth+1;}));
      expect(overflow,`${route} at ${width}`).toBe(false);
    }
  }
  await page.goto('/#modules');
  expect(await page.locator('.orbit-core').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});

async function actualCapture(page,testInfo,name){
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo({top:0,behavior:'instant'});});
  await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBe(0);
  const path=testInfo.outputPath(`${testInfo.project.name}-${name}.png`);
  await page.screenshot({path,animations:'disabled'});
  await testInfo.attach(name,{path,contentType:'image/png'});
}

test('Mission focus changes real catalog content and opens the corresponding module',async({page},testInfo)=>{
  await seed(page);await page.goto('/#app');
  await expect(page.locator('.mission-control')).toBeVisible();
  await actualCapture(page,testInfo,'main-nutrition');
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('nutripilot_v7')).profile);
  for(const id of ['training','sleep','nutrition']){
    const choice=page.locator(`[data-mission-focus="${id}"]`);await choice.click();
    await expect(choice).toHaveAttribute('aria-pressed','true');await expect(choice).toBeFocused();
    await expect(page.locator('.mission-control')).toHaveClass(new RegExp(`focus-${id}`));
    await expect(page.locator('.mission-reading strong')).not.toHaveText('');
  }
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nutripilot_v7')).profile)).toEqual(before);
  await page.locator('[data-mission-focus="training"]').click();
  await actualCapture(page,testInfo,'main-movement');
  await page.locator('.mission-launch [data-go="training"]').click();
  await expect(page).toHaveURL(/#training$/);await expect(page.locator('.lock-overlay')).toBeVisible();
});

test('Command navigation supports accents, keyboard selection, focus return and local-only access',async({page},testInfo)=>{
  await seed(page);await page.goto('/#modules');
  const opener=page.locator('.workspace-command');await opener.click();
  const input=page.locator('#command-search');await expect(input).toBeFocused();await expect(page.locator('#app')).toHaveAttribute('inert','');
  await input.fill('sono');await expect(page.locator('[data-command-go="sleep"]')).toBeVisible();
  await actualCapture(page,testInfo,'navigation-center');
  await input.press('Enter');await expect(page).toHaveURL(/#sleep$/);
  await expect(page.locator('#app')).not.toHaveAttribute('inert','');
  await page.locator('.workspace-command').click();await page.locator('#command-search').fill('no-result-7291');
  await expect(page.locator('[data-command-go]')).toHaveCount(0);
  await page.keyboard.press('Escape');await expect(page.locator('.workspace-command')).toBeFocused();
  await page.keyboard.press('Control+k');await expect(page.locator('#command-search')).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.locator('.modal-wrap :focus')).toHaveCount(1);
  await page.keyboard.press('Escape');await expect(page.locator('.command-sheet')).toHaveCount(0);
  expect((await page.request.post('/api/user/state',{data:{state:{meals:[]}}})).status()).toBe(401);
});

test('Authenticated UI workspaces render without granting a synthetic account server access',async({page},testInfo)=>{
  test.setTimeout(60000);
  // UI-only scenario: the identity response is simulated. No store purchase or valid server token exists.
  await seed(page,'pt',{premium:true,accessToken:'synthetic-interface-only',subscriptionPlan:'complete_annual',weights:[{day:'2026-10-20',value:72},{day:'2026-10-23',value:71.5},{day:'2026-10-26',value:71}]});
  await page.route('**/api/access/status',r=>r.fulfill({status:200,json:{premium:true,plan:'complete_annual',email:'interface@example.invalid'}}));
  await page.route('**/api/user/state',r=>r.fulfill({status:200,json:{state:null}}));
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const route of routes){
    await healthyScreen(page,route);
    if(['app','program','recipes','training','menopause','sleep','progress','profile','settings'].includes(route)){
      await expect(page.locator('.locked-blur')).toHaveCount(0);
      await actualCapture(page,testInfo,`workspace-${route}`);
    }
  }
  expect(errors).toEqual([]);
  expect((await page.request.post('/api/user/state',{data:{state:{meals:[]}}})).status()).toBe(401);
});


test('Atlas maps nine real modules with touch, keyboard and no profile mutation',async({page},testInfo)=>{
 await seed(page);await page.goto('/#modules');
 await expect(page.locator('[data-atlas-select]')).toHaveCount(9);
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('nutripilot_v7')).profile);
 const selected=page.locator('[data-atlas-select="nutrition"]');await selected.click();
 await selected.press('End');await expect(page.locator('[data-atlas-select="coach"]')).toBeFocused();
 await expect(page.locator('[data-atlas-select="coach"]')).toHaveAttribute('aria-pressed','true');
 await selected.focus();await selected.press('ArrowRight');
 await expect(page.locator('[data-atlas-select="recipes"]')).toBeFocused();
 await expect(page.locator('#constellation-detail [data-go="recipes"]')).toBeVisible();
 await page.locator('[data-atlas-select="training"]').click();
 await expect(page.locator('[data-atlas-path="training"]')).toHaveClass('on');
 await page.locator('.constellation').scrollIntoViewIfNeeded();
 const capture=testInfo.outputPath(`${testInfo.project.name}-atlas.png`);
 await page.screenshot({path:capture,animations:'disabled'});await testInfo.attach('atlas',{path:capture,contentType:'image/png'});
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nutripilot_v7')).profile)).toEqual(before);
 await expect(page).toHaveURL(/#modules$/);
 await page.locator('#constellation-detail [data-go="training"]').click();
 await expect(page).toHaveURL(/#training$/);await expect(page.locator('.lock-overlay')).toBeVisible();
});

test('Atlas stays inside narrow screens, respects reduced motion and reverses RTL arrow navigation',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await seed(page,'ar');await page.goto('/#modules');
 for(const width of [320,390,820,1440]){
  await page.setViewportSize({width,height:900});
  const outside=await page.locator('.constellation,.constellation-node,.constellation-copy>.btn').evaluateAll(els=>els.some(el=>{const r=el.getBoundingClientRect();return r.left < -1 || r.right>document.documentElement.clientWidth+1;}));
  expect(outside,`Atlas bounds at ${width}`).toBe(false);
 }
 const first=page.locator('[data-atlas-select="nutrition"]');await first.focus();await first.press('ArrowLeft');
 await expect(page.locator('[data-atlas-select="recipes"]')).toBeFocused();
 expect(await page.locator('.constellation-core').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 expect(await page.locator('.constellation-lines path.on').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});

test('NEXUS derives live actions from logs, explains them and preserves manual entry',async({page},testInfo)=>{
 await seed(page,'pt',{premium:true,accessToken:'synthetic-interface-only',subscriptionPlan:'complete_annual'});
 await page.route('**/api/access/status',r=>r.fulfill({status:200,json:{premium:true,plan:'complete_annual',email:'interface@example.invalid'}}));
 await page.route('**/api/user/state',r=>r.fulfill({status:200,json:{state:null}}));
 await page.goto('/#app');await expect(page.locator('.nexus-panel')).toBeVisible();
 await expect(page.locator('[data-signal-select]')).toHaveCount(4);
 await expect(page.locator('[data-signal-select="meals"]')).toHaveAttribute('aria-pressed','true');
 await actualCapture(page,testInfo,'nexus');
 await page.locator('.nexus-why summary').click();await expect(page.locator('.nexus-why p')).toContainText('refeições');
 await page.locator('[data-signal-action="meals"]').click();await expect(page.locator('#manual-search')).toBeVisible();
 await page.locator('.modal-wrap [data-close]').first().click();
 await page.locator('[data-signal-select="water"]').click();await page.locator('[data-signal-action="water"]').click();
 await expect(page.locator('.water-tile')).toBeInViewport();
 await page.locator('.water-actions [data-water="250"]').click();
 await expect(page.locator('[data-signal-select="water"] small')).toContainText('250');
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('nutripilot_v7')));expect(state.meals).toHaveLength(0);
 await page.locator('[data-signal-select="sleep"]').click();await expect(page.locator('#nexus-focus .nexus-detail p')).toContainText('Nenhuma noite');
 await page.locator('[data-signal-action="sleep"]').click();await expect(page).toHaveURL(/#sleep$/);await expect(page.locator('#sl-bed')).toBeVisible();
 expect((await page.request.post('/api/user/state',{data:{state:{meals:[]}}})).status()).toBe(401);
});

async function authenticatedUI(page,session={}){
 await seed(page,'pt',{premium:true,accessToken:'synthetic-interface-only',subscriptionPlan:'complete_annual',...session});
 await page.route('**/api/access/status',r=>r.fulfill({status:200,json:{premium:true,plan:'complete_annual',email:'interface@example.invalid'}}));
 await page.route('**/api/user/state',r=>r.fulfill({status:200,json:{state:null}}));
}

test('Local commands require explicit water confirmation, support undo and open contextual recipe search',async({page},testInfo)=>{
 await authenticatedUI(page);await page.goto('/#app');await page.locator('.workspace-command').click();
 let input=page.locator('#command-search');await input.fill('bebi 250 ml');await expect(page.locator('[data-command-intent]')).toContainText('250');
 expect(await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('nutripilot_v7')).water||{}).reduce((a,b)=>a+b,0))).toBe(0);
 await input.press('Enter');await expect(page.locator('.command-confirm')).toBeVisible();await expect(page.locator('[data-command-back]')).toBeFocused();
 await page.locator('[data-command-back]').click();await expect(page.locator('#command-search')).toBeFocused();
 await page.locator('#command-search').fill('bebi 250 ml');await page.locator('#command-search').press('Enter');
 const shot=testInfo.outputPath(`${testInfo.project.name}-local-command.png`);await page.screenshot({path:shot,animations:'disabled'});await testInfo.attach('local-command',{path:shot,contentType:'image/png'});
 await page.locator('[data-command-confirm]').click();await expect(page.locator('.command-confirm')).toHaveCount(0);
 expect(await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('nutripilot_v7')).water).reduce((a,b)=>a+b,0))).toBe(250);
 await page.locator('.np-undo button').click();expect(await page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('nutripilot_v7')).water))).toHaveLength(0);
 await page.locator('.workspace-command').click();await page.locator('#command-search').fill('receitas com frango');await page.locator('#command-search').press('Enter');
 await expect(page).toHaveURL(/#recipes$/);await expect(page.locator('#recipe-search')).toHaveValue('frango');
 await page.locator('.workspace-command').click();await page.locator('#command-search').fill('registrar refeição');await page.locator('#command-search').press('Enter');await expect(page.locator('#manual-search')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('.workspace-command')).toBeFocused();
});

test('Meal scenario previews preserve records until explicitly saving the simulated portion',async({page},testInfo)=>{
 await authenticatedUI(page);await page.goto('/#recipes');await page.locator('.recipe-grid [data-recipe-id]').first().click();
 await expect(page.locator('.scenario-panel')).toBeVisible();const base=Number((await page.locator('.recipe-hero-stats b').first().textContent()).replace(/\D/g,''));
 await page.locator('.scenario-panel summary').click();
 await page.locator('#scenario-factor').evaluate(el=>{el.value='1.5';el.dispatchEvent(new Event('input',{bubbles:true}));});
 await expect(page.locator('#scenario-portion')).toContainText('1,50');
 await expect(page.locator('.scenario-row').first()).not.toContainText('Meta 0');
 await expect(page.locator('.scenario-row').first()).toContainText(/Meta [1-9]/);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nutripilot_v7')).meals)).toHaveLength(0);
 await page.locator('.scenario-panel').scrollIntoViewIfNeeded();const shot=testInfo.outputPath(`${testInfo.project.name}-meal-scenario.png`);await page.screenshot({path:shot,animations:'disabled'});await testInfo.attach('meal-scenario',{path:shot,contentType:'image/png'});
 await page.locator('[data-scenario-add]').click();
 const meals=await page.evaluate(()=>JSON.parse(localStorage.getItem('nutripilot_v7')).meals);expect(meals).toHaveLength(1);expect(meals[0].total.kcal).toBe(Math.round(base*1.5));
});

test('PULSE explores real dated records and compares coverage without inventing missing activity',async({page},testInfo)=>{
 const today=new Date().toISOString().slice(0,10),yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);
 await authenticatedUI(page,{meals:[{id:'historical-test',day:yesterday,title:'Synthetic meal',total:{kcal:400,protein:25,carbs:40,fat:12,fiber:6}}],water:{[today]:500},sleepLog:{[today]:{bed:'23:00',wake:'07:00'}},workoutLog:[{day:yesterday,sessionId:'synthetic-test'}]});
 await page.goto('/#progress');await expect(page.locator('[data-history-day]')).toHaveCount(7);
 await page.locator(`[data-history-day="${today}"]`).click();await expect(page.locator('#history-detail')).toContainText('500 ml');await expect(page.locator('#history-detail')).toContainText('8,0 h');
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('nutripilot_v7')).profile);
 await page.locator(`[data-history-day="${yesterday}"]`).click();await expect(page.locator('#history-detail')).toContainText('1 refeição registrada');await expect(page.locator('#history-detail')).toContainText('Sem registro');
 await page.locator('.history-evidence summary').click();await expect(page.locator('.history-comparison strong').first()).toHaveText('1/7');
 await page.locator('.history-panel').scrollIntoViewIfNeeded();const shot=testInfo.outputPath(`${testInfo.project.name}-pulse-history.png`);await page.screenshot({path:shot,animations:'disabled'});await testInfo.attach('pulse-history',{path:shot,contentType:'image/png'});
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nutripilot_v7')).profile)).toEqual(before);await expect(page).toHaveURL(/#progress$/);
});

test('Every module subtab remains reachable and renders after the technology expansion',async({page})=>{
 test.setTimeout(120000);page.setDefaultTimeout(8000);await authenticatedUI(page);const errors=[];page.on('pageerror',e=>errors.push(e.message));let visited=0;
 for(const [id,route] of [['nutrition','program'],['recipes','recipes'],['training','training'],['menopause','menopause'],['nutrients','nutrients'],['supplements','supplements'],['sleep','sleep']]){
  await page.goto(`/#${route}`);await expect(page.locator('.mobile-app.quantum-workspace')).toHaveAttribute('data-workspace',id);await expect(page.locator(`.bottom-nav [data-app-tab^="${id}:"]:visible`).first()).toBeVisible();await expect(page.locator('.error-state')).toHaveCount(0);
  let keys;
  const more=page.locator(`.bottom-nav [data-app-more="${id}"]`);
  if(await more.isVisible()){await more.click();keys=await page.locator('.modal-wrap [data-app-tab]').evaluateAll(els=>els.map(e=>e.dataset.appTab));await page.locator('.modal-wrap [data-close]').first().click();}
  else keys=await page.locator('.bottom-nav [data-app-tab]:visible').evaluateAll(els=>els.map(e=>e.dataset.appTab));
  for(const key of keys){
   const direct=page.locator(`.bottom-nav [data-app-tab="${key}"]:visible`);
   if(await direct.count())await direct.click();else{await page.locator(`.bottom-nav [data-app-more="${id}"]`).click();await page.locator(`.modal-wrap [data-app-tab="${key}"]`).click();}
   await expect(page.locator('.error-state')).toHaveCount(0);await expect(page.locator('#app .screen')).not.toBeEmpty();
   const outside=await page.locator('#app .mobile-app,#app .screen,#app .app-head').evaluateAll(els=>els.some(el=>{const r=el.getBoundingClientRect();return r.left < -1 || r.right > document.documentElement.clientWidth+1;}));expect(outside,key).toBe(false);visited++;
  }
 }
 expect(visited).toBeGreaterThanOrEqual(37);expect(errors).toEqual([]);expect(await page.evaluate(()=>window.__npErrors || [])).toEqual([]);
});

test('Recipe sheets retain their close control, contain keyboard focus and return to the opener',async({page},testInfo)=>{
 await authenticatedUI(page);await page.goto('/#recipes');const opener=page.locator('.recipe-grid [data-recipe-id]').first();await opener.click();
 const close=page.locator('.modal-wrap .sheet-head [data-close]').first();await expect(close).toBeFocused();
 await page.keyboard.press('Shift+Tab');await expect(page.locator('.modal-wrap :focus')).toHaveCount(1);await page.keyboard.press('Tab');await expect(close).toBeFocused();
 await page.locator('[data-servings="1"]').click();await expect(page.locator('[data-servings="1"]')).toBeFocused();
 await page.locator('.scenario-panel summary').click();await page.locator('.modal-wrap .sheet').evaluate(el=>{el.scrollTop=el.scrollHeight;});
 await expect(close).toBeInViewport();const closeBounds=await close.boundingBox();expect(closeBounds.y).toBeGreaterThanOrEqual(0);
 const shot=testInfo.outputPath(`${testInfo.project.name}-recipe-sheet-final.png`);await page.screenshot({path:shot,animations:'disabled'});await testInfo.attach('recipe-sheet-final',{path:shot,contentType:'image/png'});
 await page.keyboard.press('Escape');await expect(page.locator('.modal-wrap')).toHaveCount(0);await expect(opener).toBeFocused();
 await page.goto('/#app');const menu=page.locator('[data-drawer]').first();await menu.click();await expect(page.locator('.drawer-wrap [data-drawer-close]')).toBeFocused();
 await page.keyboard.press('Shift+Tab');await expect(page.locator('.drawer-wrap :focus')).toHaveCount(1);await page.keyboard.press('Escape');await expect(page.locator('.drawer-wrap')).toHaveCount(0);await expect(menu).toBeFocused();
});

test('Paused services explain availability, preserve a coach draft and keep local tools accessible',async({page},testInfo)=>{
 await authenticatedUI(page);let providerRequests=0;page.on('request',r=>{if(/\/api\/(coach|compose|fridge|restaurant|smart-swap)$/.test(new URL(r.url()).pathname))providerRequests++;});
 await page.goto('/#coach');await expect(page.locator('.provider-availability')).toBeVisible();await expect(page.locator('[data-coach-send]')).toBeDisabled();
 await page.locator('#coach-input').fill('Rascunho local de teste');await page.locator('[data-coach-mode="training"]').click();await expect(page.locator('#coach-input')).toHaveValue('Rascunho local de teste');
 const shot=testInfo.outputPath(`${testInfo.project.name}-local-tools-final.png`);await page.screenshot({path:shot,animations:'disabled'});await testInfo.attach('local-tools-final',{path:shot,contentType:'image/png'});
 await page.locator('.provider-availability [data-open-command]').click();await page.keyboard.press('Escape');await expect(page.locator('.provider-availability [data-open-command]')).toBeFocused();
 await page.goto('/#planner');await expect(page.locator('.provider-availability')).toBeVisible();await expect(page.locator('[data-compose]')).toBeDisabled();
 await page.locator('.provider-availability [data-go="recipes"]').click();await expect(page.locator('#recipe-grid')).not.toBeEmpty();expect(providerRequests).toBe(0);
});

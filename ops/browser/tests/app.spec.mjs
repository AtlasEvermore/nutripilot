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

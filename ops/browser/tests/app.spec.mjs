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
  await testInfo.attach('apps', { body: await page.screenshot({ fullPage: true, animations: 'disabled' }), contentType: 'image/png' });
  await page.locator('.app-icon.m-nut').click();
  await expect(page.locator('.lock-overlay')).toBeVisible();
  await testInfo.attach('module-preview', { body: await page.screenshot({ animations: 'disabled' }), contentType: 'image/png' });
  await page.locator('.lock-overlay [data-module-buy]').click();
  await expect(page.locator('.plans-page')).toBeVisible();
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

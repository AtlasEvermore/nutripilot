import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const base = process.env.APP_CHECK_URL || 'http://127.0.0.1:3000';
const out = process.env.SCREENSHOTS_DIR || '/tmp/nutripilot-clean-browser';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const { name, width, height } of [
    { name: 'iphone-390', width: 390, height: 844 },
    { name: 'desktop-1280', width: 1280, height: 800 },
  ]) {
    // Browser contexts are fully isolated. No persistent cookies, cache, account
    // state, prior local storage, real user profiles, or paid service credentials.
    const context = await browser.newContext({
      viewport: { width, height },
      locale: 'pt-BR',
      colorScheme: 'light',
      serviceWorkers: 'block',
    });
    const page = await context.newPage();
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    await page.goto(base + '/#lang', { waitUntil: 'domcontentloaded' });
    await page.locator('[data-lang="pt"]').waitFor({ timeout: 15000 });
    assert.ok(await page.locator('[data-lang]').count() >= 10, 'Language selection must render');
    await page.screenshot({ path: join(out, name + '-language.png'), fullPage: true });
    await page.locator('[data-lang="pt"]').click();
    await page.locator('[data-lang-ok]').click();
    await page.locator('[data-hello-start]').waitFor({ timeout: 15000 });
    const welcome = await page.locator('.hello-cta').innerText();
    assert.doesNotMatch(welcome, /\b0\s+dias?\b/i, 'Never promise a zero-day trial');
    await page.screenshot({ path: join(out, name + '-welcome.png'), fullPage: true });
    const layout = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      app: document.querySelector('#app')?.textContent?.trim().length || 0,
      errors: window.__npErrors || [],
    }));
    assert.ok(layout.app > 100, name + ': UI must render');
    assert.ok(layout.width <= layout.viewport + 4, name + ': no horizontal overflow');
    assert.deepEqual(layout.errors, [], name + ': no application errors');
    assert.deepEqual(failures, [], name + ': no uncaught browser errors');
    await context.close();
  }
} finally {
  await browser.close();
}

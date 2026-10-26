import { defineConfig, devices } from '@playwright/test';
import os from 'node:os';
import path from 'node:path';

// These checks always start a private test process. They never target the deployed application.
const baseURL = 'http://127.0.0.1:4173';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile-chromium', use: { browserName: 'chromium', viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true } },
    { name: 'desktop-firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'node ../../nutripilot-france-hotmart-final-v4/server.mjs',
    url: `${baseURL}/api/health`,
    reuseExistingServer: false,
    timeout: 30_000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 },
    env: {
      NODE_ENV: 'production', PORT: '4173', APP_URL: baseURL,
      DATA_DIR: path.join(os.tmpdir(), `nutripilot-browser-${process.pid}`),
      ACCESS_TOKEN_SECRET: 'isolated-browser-test-secret-never-used-in-production',
      STORAGE_BACKEND: 'files', WEB_CONCURRENCY: '1',
      AI_ENABLED: 'false', AI_ALLOW_GUESTS: 'false', FREE_SCANS: '0',
      OPENAI_API_KEY: '', OPENAI_MODEL: '', RESEND_API_KEY: '', RESEND_FROM: '',
      REVENUECAT_READ_KEY: '', REVENUECAT_SECRET_KEY: '', REVENUECAT_WEBHOOK_AUTH: '',
      FX_URL: `${baseURL}/no-test-exchange-rates`, APP_REVISION: 'isolated-browser-check',
    },
  },
});

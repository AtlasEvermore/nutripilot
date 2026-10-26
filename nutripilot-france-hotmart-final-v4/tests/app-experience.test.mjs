import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = readFileSync(fileURLToPath(new URL('../app.js', import.meta.url)), 'utf8');
const slice = (start, end) => {
  const a = source.indexOf(start), b = source.indexOf(end, a + start.length);
  assert.ok(a !== -1 && b > a, 'Expected UI code block');
  return source.slice(a, b);
};

test('Apps launcher remains separate from purchase and pricing offers', () => {
  const apps = slice('function modulesScreen() {', '// Shown inside a module');
  assert.match(apps, /class="app-grid"/);
  assert.match(apps, /data-go="plans"/);
  assert.doesNotMatch(apps, /data-module-buy|class="mod-cards"|class="kit-card"/);
});

test('Only a real storefront trial is advertised', () => {
  const welcome = slice('function helloScreen() {', 'function basicsScreen() {');
  const plans = slice('function plansScreen() {', 'function ');
  assert.match(welcome, /Billing\.trialDays\(\) > 0/);
  assert.match(plans, /Billing\.trialDays\(\) > 0/);
  assert.doesNotMatch(plans, /jours gratuits, sans engagement\.', \{ n: 3 \}/);
});

test('Water counters reject negative or non-finite saved values', () => {
  const water = slice('function waterToday() {', 'function streak() {');
  assert.match(water, /Number\.isFinite\(value\)/);
  assert.match(water, /Math\.max\(0, value\)/);
});

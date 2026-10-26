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

test('Imported meal data cannot turn daily totals into NaN or negative calories', () => {
  const totals = slice('function totals(', 'function waterToday() {');
  assert.match(totals, /Number\.isFinite\(value\)/);
  assert.match(totals, /Math\.max\(0, value\)/);
});

test('Hydration entry and store catalog preserve defensive bounds', () => {
  const goal = slice('function waterGoal() {', 'function bottleSvg(');
  const plans = slice('function plansScreen() {', 'function ');
  assert.match(goal, /clamp\(value, 1000, 5000\)/);
  assert.match(plans, /if \(!kit\) return storeLoadingScreen\(\)/);
  assert.match(source, /state\.water\[k\] = clamp\(waterToday\(\) \+ 250, 0, 6000\)/);
});

test('Module previews link to Plans without showing monthly prices', () => {
  const preview = slice('function moduleLockedScreen(', 'function ');
  assert.doesNotMatch(preview, /class="mod-price"/);
  assert.match(preview, /data-go="plans"/);
});

test('Purchase initiation is not scattered across module showcases', () => {
  const occurrences = source.match(/data-module-buy=/g) || [];
  assert.equal(occurrences.length, 0);
});

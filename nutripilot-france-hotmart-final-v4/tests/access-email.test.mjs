import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { accessEmailContent } from '../ops/access-email.mjs';

test('Access emails cover every app language, preserve the code and support RTL', () => {
  for (const language of ['fr', 'pt', 'en', 'es', 'de', 'it', 'nl', 'pl', 'tr', 'ja', 'ko', 'zh', 'ar', 'id']) {
    const message = accessEmailContent('123456', language);
    assert.match(message.subject, /NutriPilot/);
    assert.match(message.text, /123456/);
    assert.match(message.html, new RegExp(`lang="${language}"`));
    assert.match(message.html, new RegExp(`dir="${language === 'ar' ? 'rtl' : 'ltr'}"`));
    assert.match(message.html, /<p dir="ltr"[^>]*>123456<\/p>/);
  }
  assert.match(accessEmailContent('123456', 'pt-BR').subject, /^Seu código de acesso/);
  assert.match(accessEmailContent('123456', 'EN_us').subject, /^Your access code/);
});

test('Unknown or hostile language values keep the legacy French fallback without injecting markup', () => {
  for (const language of [undefined, null, {}, ['pt'], '__proto__', 'constructor', '<img src=x onerror=alert(1)>']) {
    const message = accessEmailContent('123456', language);
    assert.match(message.subject, /^Votre code/);
    assert.doesNotMatch(message.html, /<img|onerror/);
  }
  const message = accessEmailContent('123456', 'pt', '<img src=x>\r\nInjected: header');
  assert.doesNotMatch(message.html, /<img/);
  assert.doesNotMatch(message.subject, /[\r\n]/);
  for (const code of ['12345', '1234567', '<b>123456</b>', null]) assert.throws(() => accessEmailContent(code, 'pt'));
});

test('Server forwards localized HTML and plain text to the mail provider without external calls', async () => {
  const source = await fs.readFile(new URL('../server.mjs', import.meta.url), 'utf8');
  const start = source.indexOf('async function sendAccessEmail(');
  const end = source.indexOf('\nasync function requestAccessCode', start);
  const messages = [];
  const context = vm.createContext({
    accessEmailContent, RESEND_API_KEY: 'synthetic-mail-test', RESEND_FROM: 'NutriPilot <test@example.invalid>', BRAND_NAME: 'NutriPilot',
    fetchJson: async (url, options) => { messages.push({url, body: JSON.parse(options.body)}); return {response: {ok: true}}; },
  });
  vm.runInContext(source.slice(start, end), context);
  assert.equal(await context.sendAccessEmail('owner@example.invalid', '123456', 'pt-BR'), true);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].url, 'https://api.resend.com/emails');
  assert.deepEqual(messages[0].body.to, ['owner@example.invalid']);
  assert.match(messages[0].body.subject, /^Seu código/);
  assert.match(messages[0].body.text, /15 minutos/);
  assert.match(messages[0].body.html, /lang="pt"/);
  context.RESEND_API_KEY = '';
  assert.equal(await context.sendAccessEmail('owner@example.invalid', '123456', 'pt'), false);
  assert.equal(messages.length, 1);
});

test('Both signup and returning-customer screens send the selected language', async () => {
  const source = await fs.readFile(new URL('../app.js', import.meta.url), 'utf8');
  const requests = [];
  const nodes = Object.fromEntries(['#acc-email', '#access-email', '#access-msg', '#code-area'].map(selector => [selector, {value: 'owner@example.invalid', style: {}}]));
  const context = vm.createContext({
    $: selector => nodes[selector], modal: {}, state: {}, lang: () => 'pt', L: value => value, esc: String,
    renderModal() {}, saveState() {}, toast() {},
    fetch: async (url, options) => { requests.push({url, body: JSON.parse(options.body)}); return {ok: true, json: async () => ({mailed: true})}; },
  });
  for (const [name, next] of [['accountSend', 'accountVerify'], ['requestCode', 'verifyCode']]) {
    const start = source.indexOf(`async function ${name}()`);
    const end = source.indexOf(`\nasync function ${next}()`, start);
    vm.runInContext(source.slice(start, end), context);
    await context[name]();
  }
  assert.equal(requests.length, 2);
  for (const request of requests) {
    assert.equal(request.url, '/api/access/request');
    assert.equal(request.body.lang, 'pt');
    assert.equal(request.body.email, 'owner@example.invalid');
  }
  assert.equal(requests[0].body.purpose, 'signup');
});

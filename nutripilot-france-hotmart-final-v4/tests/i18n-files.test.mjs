import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['en', 'es', 'pt', 'de', 'it', 'nl', 'pl', 'tr', 'ja', 'ko', 'zh', 'ar', 'id'];

test('i18n folder holds exactly one generated file per language', () => {
  const files = fs.readdirSync(path.join(root, 'i18n')).sort();
  assert.deepEqual(files, LANGS.map((c) => `${c}.js`).sort());
});

test('every dictionary entry maps language codes to plain strings', async () => {
  const { DICT } = await import(path.join(root, 'i18n.js'));
  for (const [fr, entry] of Object.entries(DICT)) {
    for (const [code, value] of Object.entries(entry)) {
      assert.ok(LANGS.includes(code), `unexpected language "${code}" in "${fr}"`);
      assert.equal(typeof value, 'string', `"${fr}" → ${code} is not text`);
    }
  }
});

test('generated language files match the master dictionary', async () => {
  const { DICT } = await import(path.join(root, 'i18n.js'));
  for (const code of LANGS) {
    const { default: out } = await import(path.join(root, 'i18n', `${code}.js`));
    const expected = Object.fromEntries(Object.entries(DICT).filter(([, e]) => e[code]).map(([fr, e]) => [fr, e[code]]));
    assert.deepEqual(out, expected, `i18n/${code}.js is stale; run npm run i18n`);
  }
});

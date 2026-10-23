import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { snapshot, encryptSnapshot, decryptSnapshot, restoreBackup, startBackups, uploadS3 } from '../ops/backup.mjs';
const key = crypto.randomBytes(32).toString('hex');
async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'np-backup-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const dir = path.join(root, 'data'); await fs.mkdir(path.join(dir, 'users'), { recursive: true });
  await fs.writeFile(path.join(dir, 'entitlements.json'), JSON.stringify({ 'test@example.invalid': { status: 'active' } }));
  const name = `${crypto.createHash('sha256').update('test@example.invalid').digest('hex')}.json`;
  await fs.writeFile(path.join(dir, 'users', name), JSON.stringify({ meals: [{ title: 'Private meal' }] }));
  return { root, dir, name };
}
test('Encrypted snapshot restores purchases and user state, excludes secrets, refuses overwrite', async t => {
  const f = await fixture(t); await fs.writeFile(path.join(f.dir, '.env'), 'PRIVATE_KEY=DO-NOT-BACK-UP');
  const value = await snapshot(f.dir); const buffer = encryptSnapshot(value, key);
  assert.equal(buffer.includes(Buffer.from('test@example.invalid')), false);
  assert.equal(buffer.includes(Buffer.from('Private meal')), false);
  assert.equal(decryptSnapshot(buffer, key).entries.length, 2);
  const target = path.join(f.root, 'restore'); await restoreBackup(buffer, key, target);
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(target, 'entitlements.json'))), { 'test@example.invalid': { status: 'active' } });
  assert.equal(JSON.parse(await fs.readFile(path.join(target, 'users', f.name))).meals[0].title, 'Private meal');
  await assert.rejects(restoreBackup(buffer, key, target), /EEXIST/);
  assert.equal((await fs.stat(path.join(target, 'entitlements.json'))).mode & 0o777, 0o600);
});
test('Tampering, wrong keys, path traversal and corrupt JSON are rejected before restore', async t => {
  const f = await fixture(t); const value = await snapshot(f.dir); const buffer = encryptSnapshot(value, key);
  const bad = Buffer.from(buffer); bad[bad.length - 1] ^= 1;
  assert.throws(() => decryptSnapshot(bad, key));
  assert.throws(() => decryptSnapshot(buffer, '0'.repeat(64)));
  const malicious = encryptSnapshot({ ...value, entries: [...value.entries, { name: '../escape', content: '{}', sha256: '' }] }, key);
  const target = path.join(f.root, 'should-not-exist');
  await assert.rejects(restoreBackup(malicious, key, target)); await assert.rejects(fs.stat(target), /ENOENT/);
  await fs.writeFile(path.join(f.dir, 'entitlements.json'), '{broken'); await assert.rejects(snapshot(f.dir));
});
test('Backups retain seven local archives and expose disabled/offsite status honestly', async t => {
  const f = await fixture(t); const disabled = startBackups(f.dir, {}); assert.equal(disabled.state.enabled, false); disabled.stop();
  const manager = startBackups(f.dir, { BACKUP_ENCRYPTION_KEY: key }); t.after(() => manager.stop());
  while (manager.state.running) await new Promise(r => setTimeout(r, 5));
  for (let i = 0; i < 8; i++) await manager.run();
  assert.equal((await fs.readdir(path.join(f.dir, 'backups'))).length, 7);
  assert.ok(manager.state.lastLocalAt); assert.equal(manager.state.offsiteConfigured, false); assert.equal(manager.state.lastOffsiteAt, null);
});
test('Offsite upload signs encrypted payload, refuses redirects and insecure endpoints', async t => {
  const original = globalThis.fetch; t.after(() => { globalThis.fetch = original; }); let request;
  globalThis.fetch = async (url, options) => { request = { url, options }; return { ok: true }; };
  const env = { BACKUP_S3_ENDPOINT: 'https://storage.example.invalid', BACKUP_S3_BUCKET: 'private-backups', BACKUP_S3_ACCESS_KEY: 'example', BACKUP_S3_SECRET_KEY: 'secret' };
  const data = Buffer.from('encrypted'); await uploadS3(data, 'backup.npbak', env, new Date('2026-10-23T12:00:00Z'));
  assert.match(request.options.headers.Authorization, /20261023\/us-east-1\/s3\/aws4_request/);
  assert.equal(request.options.redirect, 'error'); assert.equal(request.options.body, data);
  assert.equal(request.url.pathname, '/private-backups/nutripilot/backup.npbak');
  await assert.rejects(uploadS3(data, 'backup.npbak', { ...env, BACKUP_S3_ENDPOINT: 'http://storage.example.invalid' }));
});

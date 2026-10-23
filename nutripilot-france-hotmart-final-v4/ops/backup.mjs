import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';

const MAGIC = Buffer.from('NPBACKUP1');
const MAX = 128 * 1024 * 1024;
const rootFiles = new Set(['entitlements.json', 'free-scans.json', 'funnel.json', 'waitlist.json', 'last-webhook.json']);
const allowed = name => rootFiles.has(name) || /^users\/[a-f0-9]{64}\.json$/.test(name);
function keyBytes(key) {
  if (!/^[a-f0-9]{64}$/i.test(key || '')) throw new Error('BACKUP_ENCRYPTION_KEY must contain 64 hexadecimal characters');
  return Buffer.from(key, 'hex');
}
export async function snapshot(dataDir) {
  const entries = []; let bytes = 0;
  const names = (await fs.readdir(dataDir)).filter(n => rootFiles.has(n));
  try { for (const n of await fs.readdir(path.join(dataDir, 'users'))) if (!n.endsWith('.tmp')) names.push(`users/${n}`); }
  catch (e) { if (e.code !== 'ENOENT') throw e; }
  for (const name of names.sort()) {
    if (!allowed(name)) throw new Error('Unexpected file in users directory');
    const file = path.join(dataDir, name);
    const stat = await fs.lstat(file);
    if (!stat.isFile()) throw new Error('Backup refuses non-regular files');
    if (stat.size + bytes > MAX) throw new Error('Backup size limit exceeded');
    const content = await fs.readFile(file, 'utf8');
    bytes += Buffer.byteLength(content);
    if (bytes > MAX) throw new Error('Backup size limit exceeded');
    JSON.parse(content); // A corrupt live file must stop the backup, never replace a good copy.
    entries.push({ name, content, sha256: crypto.createHash('sha256').update(content).digest('hex') });
  }
  const entitlements = entries.find(e => e.name === 'entitlements.json');
  if (!entitlements) throw new Error('Missing entitlements.json');
  const value = JSON.parse(entitlements.content);
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('Invalid entitlements');
  return { format: 1, createdAt: new Date().toISOString(), entries };
}
export function encryptSnapshot(value, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBytes(key), iv);
  cipher.setAAD(MAGIC);
  const encrypted = Buffer.concat([cipher.update(gzipSync(Buffer.from(JSON.stringify(value)))), cipher.final()]);
  return Buffer.concat([MAGIC, iv, cipher.getAuthTag(), encrypted]);
}
export function decryptSnapshot(buffer, key) {
  if (!buffer.subarray(0, MAGIC.length).equals(MAGIC)) throw new Error('Invalid backup format');
  const offset = MAGIC.length;
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBytes(key), buffer.subarray(offset, offset + 12));
  decipher.setAAD(MAGIC); decipher.setAuthTag(buffer.subarray(offset + 12, offset + 28));
  const plain = Buffer.concat([decipher.update(buffer.subarray(offset + 28)), decipher.final()]);
  const value = JSON.parse(gunzipSync(plain, { maxOutputLength: MAX * 2 }).toString());
  if (value.format !== 1 || !Array.isArray(value.entries)) throw new Error('Invalid backup manifest');
  const seen = new Set();
  for (const entry of value.entries) {
    if (!allowed(entry.name) || seen.has(entry.name) || typeof entry.content !== 'string') throw new Error('Invalid backup entry');
    seen.add(entry.name);
    if (crypto.createHash('sha256').update(entry.content).digest('hex') !== entry.sha256) throw new Error('Backup integrity check failed');
    JSON.parse(entry.content);
  }
  const entitlements = value.entries.find(e => e.name === 'entitlements.json');
  if (!entitlements) throw new Error('Missing entitlements');
  const entitlementData = JSON.parse(entitlements.content);
  if (!entitlementData || Array.isArray(entitlementData) || typeof entitlementData !== 'object') throw new Error('Invalid entitlements');
  return value;
}
export async function restoreBackup(buffer, key, target) {
  const value = decryptSnapshot(buffer, key); // Verify the ENTIRE archive before writing anything.
  await fs.mkdir(path.dirname(path.resolve(target)), { recursive: true });
  await fs.mkdir(target, { mode: 0o700 }); // Refuse even an empty existing directory; no production overwrite.
  try {
    for (const entry of value.entries) {
      const file = path.join(target, entry.name);
      await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
      await fs.writeFile(file, entry.content, { flag: 'wx', mode: 0o600 });
    }
  } catch (e) { await fs.rm(target, { recursive: true, force: true }); throw e; }
  return { createdAt: value.createdAt, files: value.entries.length };
}
// AWS Signature V4 supports AWS S3 and compatible private storage, using path-style addressing.
export async function uploadS3(buffer, name, env = process.env, now = new Date()) {
  const endpoint = new URL(env.BACKUP_S3_ENDPOINT);
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) throw new Error('Backup endpoint must be plain HTTPS');
  const region = env.BACKUP_S3_REGION || 'us-east-1';
  const prefix = env.BACKUP_S3_PREFIX || 'nutripilot';
  const parts = [env.BACKUP_S3_BUCKET, ...prefix.split('/').filter(Boolean), name];
  if (parts.some(p => !p || p === '.' || p === '..')) throw new Error('Invalid backup object path');
  endpoint.pathname = endpoint.pathname.replace(/\/$/, '') + '/' + parts.map(p => encodeURIComponent(p).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())).join('/');
  const date = now.toISOString().replace(/[:-]|\.\d{3}/g, ''); const day = date.slice(0, 8);
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  const headers = { host: endpoint.host, 'x-amz-content-sha256': hash, 'x-amz-date': date };
  if (env.BACKUP_S3_SESSION_TOKEN) headers['x-amz-security-token'] = env.BACKUP_S3_SESSION_TOKEN;
  const names = Object.keys(headers).sort();
  const canonical = ['PUT', endpoint.pathname, '', names.map(n => `${n}:${headers[n]}\n`).join(''), names.join(';'), hash].join('\n');
  const scope = `${day}/${region}/s3/aws4_request`;
  const hmac = (key, data) => crypto.createHmac('sha256', key).update(data).digest();
  const signing = hmac(hmac(hmac(hmac('AWS4' + env.BACKUP_S3_SECRET_KEY, day), region), 's3'), 'aws4_request');
  const signature = hmac(signing, `AWS4-HMAC-SHA256\n${date}\n${scope}\n${crypto.createHash('sha256').update(canonical).digest('hex')}`).toString('hex');
  headers.Authorization = `AWS4-HMAC-SHA256 Credential=${env.BACKUP_S3_ACCESS_KEY}/${scope}, SignedHeaders=${names.join(';')}, Signature=${signature}`;
  const response = await fetch(endpoint, { method: 'PUT', headers, body: buffer, signal: AbortSignal.timeout(60000), redirect: 'error' });
  if (!response.ok) throw new Error(`Backup upload failed: HTTP ${response.status}`);
}
export function startBackups(dataDir, env = process.env) {
  const required = ['BACKUP_S3_ENDPOINT', 'BACKUP_S3_BUCKET', 'BACKUP_S3_ACCESS_KEY', 'BACKUP_S3_SECRET_KEY'];
  const state = { enabled: Boolean(env.BACKUP_ENCRYPTION_KEY), offsiteConfigured: required.every(k => Boolean(env[k])), lastLocalAt: null, lastOffsiteAt: null, lastErrorAt: null, running: false };
  let stopped = false;
  async function run() {
    if (!state.enabled || state.running || stopped) return;
    state.running = true;
    try {
      const value = await snapshot(dataDir); const buffer = encryptSnapshot(value, env.BACKUP_ENCRYPTION_KEY);
      decryptSnapshot(buffer, env.BACKUP_ENCRYPTION_KEY); // Check every new archive before retaining/uploading.
      const dir = path.join(dataDir, 'backups'); await fs.mkdir(dir, { recursive: true, mode: 0o700 });
      const name = `${value.createdAt.replace(/[:.]/g, '-')}-${crypto.randomBytes(4).toString('hex')}.npbak`;
      const budget = 64 * 1024 * 1024;
      if (buffer.length > budget) throw new Error('Encrypted archive exceeds local storage budget');
      const retained = (await fs.readdir(dir)).filter(n => /^\d{4}-.*\.npbak$/.test(n)).sort();
      const sizes = await Promise.all(retained.map(n => fs.stat(path.join(dir, n)).then(v => v.size)));
      let total = sizes.reduce((a, b) => a + b, 0);
      while (retained.length && (retained.length >= 7 || total + buffer.length > budget)) {
        await fs.unlink(path.join(dir, retained.shift())); total -= sizes.shift();
      }
      const capacity = await fs.statfs(dir);
      if (capacity.bavail * capacity.bsize < buffer.length + 32 * 1024 * 1024) throw new Error('Insufficient free space for backup');
      await fs.writeFile(path.join(dir, name), buffer, { flag: 'wx', mode: 0o600 });
      state.lastLocalAt = value.createdAt;
      if (state.offsiteConfigured) { await uploadS3(buffer, name, env); state.lastOffsiteAt = new Date().toISOString(); }
      state.lastErrorAt = null;
    } catch { state.lastErrorAt = new Date().toISOString(); console.error('[NutriPilot] Backup failed; inspect storage and backup configuration.'); }
    finally { state.running = false; }
  }
  const timer = setInterval(run, 6 * 60 * 60 * 1000); timer.unref();
  if (state.enabled) void run();
  return { state, run, stop() { stopped = true; clearInterval(timer); } };
}

// Uploads one signed IPA to App Store Connect with the official Build Upload API.
// Inputs (env): ASC_KEY_ID, ASC_ISSUER_ID, ASC_PRIVATE_KEY (.p8 text), IPA_PATH, IPA_SHA256, APP_ID, VERSION, BUILD.
// It never prints credentials. It refuses to upload when the file hash differs from the reviewed hash.
import crypto from 'node:crypto';
import fs from 'node:fs';
const e = k => { const v = process.env[k]; if (!v) throw new Error(`missing ${k}`); return v; };
const ipa = fs.readFileSync(e('IPA_PATH'));
const sha = crypto.createHash('sha256').update(ipa).digest('hex');
if (sha !== e('IPA_SHA256')) throw new Error(`IPA hash mismatch: ${sha}`);
const b64u = b => Buffer.from(b).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const head = b64u(JSON.stringify({ alg: 'ES256', kid: e('ASC_KEY_ID'), typ: 'JWT' }));
const body = b64u(JSON.stringify({ iss: e('ASC_ISSUER_ID'), iat: now, exp: now + 1100, aud: 'appstoreconnect-v1' }));
const sig = crypto.sign('sha256', Buffer.from(`${head}.${body}`), { key: e('ASC_PRIVATE_KEY'), dsaEncoding: 'ieee-p1363' });
const jwt = `${head}.${body}.${b64u(sig)}`;
const api = async (method, path, data) => {
  const r = await fetch(`https://api.appstoreconnect.apple.com/v1/${path}`, { method, headers: { authorization: `Bearer ${jwt}`, 'content-type': 'application/json' }, body: data ? JSON.stringify(data) : undefined });
  const t = await r.text(); if (!r.ok) throw new Error(`${method} ${path} -> ${r.status} ${t.slice(0, 800)}`);
  return t ? JSON.parse(t) : {};
};
// A failed earlier attempt leaves an unfinished upload for the same build: remove it so the build number can be reused.
const old = await api('GET', `apps/${e('APP_ID')}/buildUploads?limit=50`);
for (const u of old.data || []) {
  const a = u.attributes || {};
  if (a.cfBundleShortVersionString === e('VERSION') && a.cfBundleVersion === e('BUILD') && !/COMPLETE/.test(JSON.stringify(a.state))) {
    console.log(`removing unfinished upload ${u.id}`); await api('DELETE', `buildUploads/${u.id}`);
  }
}
const up = await api('POST', 'buildUploads', { data: { type: 'buildUploads', attributes: { cfBundleShortVersionString: e('VERSION'), cfBundleVersion: e('BUILD'), platform: 'IOS' }, relationships: { app: { data: { type: 'apps', id: e('APP_ID') } } } } });
const file = await api('POST', 'buildUploadFiles', { data: { type: 'buildUploadFiles', attributes: { fileName: 'NutriPilot.ipa', fileSize: ipa.length, uti: 'com.apple.ipa', assetType: 'ASSET' }, relationships: { buildUpload: { data: { type: 'buildUploads', id: up.data.id } } } } });
for (const op of file.data.attributes.uploadOperations) {
  const headers = Object.fromEntries((op.requestHeaders || []).map(h => [h.name, h.value]));
  let ok = false;
  for (let attempt = 1; attempt <= 5 && !ok; attempt++) {
    try {
      const r = await fetch(op.url, { method: op.method, headers, body: ipa.subarray(op.offset, op.offset + op.length), signal: AbortSignal.timeout(120000) });
      ok = r.ok; if (!ok) console.log(`part ${op.offset} attempt ${attempt} -> ${r.status}`);
    } catch (err) { console.log(`part ${op.offset} attempt ${attempt} -> ${err.name}`); }
    if (!ok) await new Promise(r => setTimeout(r, attempt * 10000));
  }
  if (!ok) throw new Error(`part upload failed at offset ${op.offset}`);
}
const md5 = crypto.createHash('md5').update(ipa).digest('hex');
await api('PATCH', `buildUploadFiles/${file.data.id}`, { data: { type: 'buildUploadFiles', id: file.data.id, attributes: { uploaded: true, sourceFileChecksums: { file: { hash: md5, algorithm: 'MD5' } } } } });
for (let i = 0; i < 40; i++) {
  const s = await api('GET', `buildUploads/${up.data.id}`);
  const st = s.data.attributes.state; console.log(`upload state: ${JSON.stringify(st)}`);
  if (/COMPLETE|FAILED|PROCESSING_COMPLETE/.test(JSON.stringify(st))) break;
  await new Promise(r => setTimeout(r, 15000));
}
console.log(`buildUpload ${up.data.id} sha256 ${sha}`);

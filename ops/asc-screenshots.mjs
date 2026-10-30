// Replaces App Store screenshots for one version with the files in SHOTS_DIR (iphone-<lang>-<n>.jpg, ipad-<lang>-<n>.jpg).
// Uses the App Store Connect API key from the protected environment. Never prints credentials.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
const e = k => { const v = process.env[k]; if (!v) throw new Error(`missing ${k}`); return v; };
const b64u = b => Buffer.from(b).toString('base64url');
const jwt = () => { const now = Math.floor(Date.now() / 1000); const h = b64u(JSON.stringify({ alg: 'ES256', kid: e('ASC_KEY_ID'), typ: 'JWT' })); const p = b64u(JSON.stringify({ iss: e('ASC_ISSUER_ID'), iat: now, exp: now + 1100, aud: 'appstoreconnect-v1' })); return `${h}.${p}.${b64u(crypto.sign('sha256', Buffer.from(`${h}.${p}`), { key: e('ASC_PRIVATE_KEY'), dsaEncoding: 'ieee-p1363' }))}`; };
let token = jwt(), tokenAt = Date.now();
const api = async (method, p, data) => {
  if (Date.now() - tokenAt > 15 * 60 * 1000) { token = jwt(); tokenAt = Date.now(); }
  const r = await fetch(`https://api.appstoreconnect.apple.com/v1/${p}`, { method, headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: data ? JSON.stringify(data) : undefined });
  const t = await r.text(); if (!r.ok) throw new Error(`${method} ${p} -> ${r.status} ${t.slice(0, 500)}`); return t ? JSON.parse(t) : {};
};
const dir = e('SHOTS_DIR'); const versionId = e('VERSION_ID');
const map = { en: ['en-US'], pt: ['pt-BR', 'pt-PT'], fr: ['fr-FR', 'fr-CA'], es: ['es-ES', 'es-MX'], de: ['de-DE'], it: ['it'] };
const kinds = [['iphone', 'APP_IPHONE_67'], ['ipad', 'APP_IPAD_PRO_3GEN_129']];
const locs = Object.fromEntries((await api('GET', `appStoreVersions/${versionId}/appStoreVersionLocalizations?limit=50`)).data.map(d => [d.attributes.locale, d.id]));
let uploaded = 0;
for (const [lang, locales] of Object.entries(map)) for (const locale of locales) {
  const locId = locs[locale]; if (!locId) throw new Error(`missing localization ${locale}`);
  const sets = (await api('GET', `appStoreVersionLocalizations/${locId}/appScreenshotSets?include=appScreenshots&limit=50`));
  for (const [kind, type] of kinds) {
    let set = sets.data.find(s => s.attributes.screenshotDisplayType === type);
    if (set) for (const sc of set.relationships?.appScreenshots?.data || []) await api('DELETE', `appScreenshots/${sc.id}`);
    else set = (await api('POST', 'appScreenshotSets', { data: { type: 'appScreenshotSets', attributes: { screenshotDisplayType: type }, relationships: { appStoreVersionLocalization: { data: { type: 'appStoreVersionLocalizations', id: locId } } } } })).data;
    for (let i = 1; i <= 6; i++) {
      const file = path.join(dir, `${kind}-${lang}-${i}.jpg`); const buf = fs.readFileSync(file);
      const res = (await api('POST', 'appScreenshots', { data: { type: 'appScreenshots', attributes: { fileName: path.basename(file), fileSize: buf.length }, relationships: { appScreenshotSet: { data: { type: 'appScreenshotSets', id: set.id } } } } })).data;
      for (const op of res.attributes.uploadOperations) { const headers = Object.fromEntries((op.requestHeaders || []).map(h => [h.name, h.value])); const r = await fetch(op.url, { method: op.method, headers, body: buf.subarray(op.offset, op.offset + op.length) }); if (!r.ok) throw new Error(`part ${r.status}`); }
      await api('PATCH', `appScreenshots/${res.id}`, { data: { type: 'appScreenshots', id: res.id, attributes: { uploaded: true, sourceFileChecksum: crypto.createHash('md5').update(buf).digest('hex') } } });
      uploaded++;
    }
  }
  console.log(`${locale}: done`);
}
console.log(`uploaded ${uploaded} screenshots`);

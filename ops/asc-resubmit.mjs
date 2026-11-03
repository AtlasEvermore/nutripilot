// Attaches the App Review screen recording, refreshes reviewer notes, submits the subscriptions
// and resubmits the existing review submission. Never prints credentials.
import crypto from 'node:crypto';
import fs from 'node:fs';
const e = k => { const v = process.env[k]; if (!v) throw new Error(`missing ${k}`); return v; };
const b64u = b => Buffer.from(b).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const head = b64u(JSON.stringify({ alg: 'ES256', kid: e('ASC_KEY_ID'), typ: 'JWT' }));
const body = b64u(JSON.stringify({ iss: e('ASC_ISSUER_ID'), iat: now, exp: now + 1100, aud: 'appstoreconnect-v1' }));
const sig = crypto.sign('sha256', Buffer.from(`${head}.${body}`), { key: e('ASC_PRIVATE_KEY'), dsaEncoding: 'ieee-p1363' });
const jwt = `${head}.${body}.${b64u(sig)}`;
const api = async (method, path, data, okStatuses = []) => {
  const r = await fetch(`https://api.appstoreconnect.apple.com/v1/${path}`, { method, headers: { authorization: `Bearer ${jwt}`, 'content-type': 'application/json' }, body: data ? JSON.stringify(data) : undefined });
  const t = await r.text();
  if (!r.ok && !okStatuses.includes(r.status)) throw new Error(`${method} ${path} -> ${r.status} ${t.slice(0, 900)}`);
  if (!r.ok) console.log(`${method} ${path} -> ${r.status} (accepted) ${t.slice(0, 300)}`);
  return t ? JSON.parse(t) : {};
};
const DETAIL = e('REVIEW_DETAIL_ID'), SUBMISSION = e('REVIEW_SUBMISSION_ID');
// 1. Recording.
const video = fs.readFileSync(e('VIDEO_PATH'));
const md5 = crypto.createHash('md5').update(video).digest('hex');
const existing = await api('GET', `appStoreReviewDetails/${DETAIL}/appStoreReviewAttachments`);
for (const a of existing.data || []) { console.log(`removing old attachment ${a.attributes?.fileName}`); await api('DELETE', `appStoreReviewAttachments/${a.id}`); }
const att = await api('POST', 'appStoreReviewAttachments', { data: { type: 'appStoreReviewAttachments', attributes: { fileName: 'NutriPilot-review-recording.mov', fileSize: video.length }, relationships: { appStoreReviewDetail: { data: { type: 'appStoreReviewDetails', id: DETAIL } } } } });
for (const op of att.data.attributes.uploadOperations) {
  const headers = Object.fromEntries((op.requestHeaders || []).map(h => [h.name, h.value]));
  let ok = false;
  for (let i = 1; i <= 5 && !ok; i++) {
    try { const r = await fetch(op.url, { method: op.method, headers, body: video.subarray(op.offset, op.offset + op.length), signal: AbortSignal.timeout(120000) }); ok = r.ok; if (!ok) console.log(`part ${op.offset} -> ${r.status}`); }
    catch (err) { console.log(`part ${op.offset} -> ${err.name}`); }
    if (!ok) await new Promise(r => setTimeout(r, i * 5000));
  }
  if (!ok) throw new Error(`upload part ${op.offset} failed`);
}
await api('PATCH', `appStoreReviewAttachments/${att.data.id}`, { data: { type: 'appStoreReviewAttachments', id: att.data.id, attributes: { uploaded: true, sourceFileChecksum: md5 } } });
for (let i = 0; i < 30; i++) {
  const s = await api('GET', `appStoreReviewAttachments/${att.data.id}`);
  const st = s.data.attributes.assetDeliveryState?.state; console.log(`attachment state ${st}`);
  if (st === 'COMPLETE') break; if (st === 'FAILED') throw new Error(JSON.stringify(s.data.attributes.assetDeliveryState));
  await new Promise(r => setTimeout(r, 5000));
}
// 2. Notes.
const notes = fs.readFileSync(e('NOTES_PATH'), 'utf8').trim();
await api('PATCH', `appStoreReviewDetails/${DETAIL}`, { data: { type: 'appStoreReviewDetails', id: DETAIL, attributes: { notes } } });
console.log(`notes updated (${notes.length} chars)`);
// 3. Subscriptions go with this version.
for (const id of e('SUBSCRIPTION_IDS').split(',')) {
  await api('POST', 'subscriptionSubmissions', { data: { type: 'subscriptionSubmissions', relationships: { subscription: { data: { type: 'subscriptions', id } } } } }, [409]);
  const s = await api('GET', `subscriptions/${id}`); console.log(`subscription ${id} state ${s.data.attributes.state}`);
}
// 4. Resubmit.
const sub = await api('GET', `reviewSubmissions/${SUBMISSION}?include=items`);
console.log(`submission state ${sub.data.attributes.state}; items ${(sub.included || []).map(i => i.attributes?.state).join(',')}`);
const res = await api('PATCH', `reviewSubmissions/${SUBMISSION}`, { data: { type: 'reviewSubmissions', id: SUBMISSION, attributes: { submitted: true } } });
console.log(`resubmitted: state ${res.data.attributes.state}`);

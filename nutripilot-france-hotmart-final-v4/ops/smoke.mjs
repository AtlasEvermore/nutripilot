import { pathToFileURL } from 'node:url';
export async function checkApplication(base, { expectedVersion, operational = false } = {}) {
  const issues = [];
  async function request(route) {
    const r = await fetch(new URL(route, base), { signal: AbortSignal.timeout(20000), redirect: 'error' });
    if (!r.ok) throw new Error(`${route}: HTTP ${r.status}`);
    return r;
  }
  let health;
  try {
    health = await (await request('/api/health')).json();
    if (!health.ok) issues.push('Health reports failure');
    if (expectedVersion && health.version !== expectedVersion) issues.push(`Published version is ${health.version || 'unknown'}; expected ${expectedVersion}`);
    if (health.persistence?.writable === false) issues.push('Data directory is not writable');
    if (operational) {
      if (!health.accessSecret || !health.email || !health.ai) issues.push('A required provider configuration is missing');
      if (health.aiProvider?.status === 'unavailable') issues.push('AI provider reported a failure; inspect billing and credentials');
      const b = health.backups;
      if (!b?.enabled || !b.offsiteConfigured || !b.lastOffsiteAt) issues.push('Independent backup is not verified');
      else if (Date.now() - Date.parse(b.lastOffsiteAt) > 8 * 3600000 || b.lastErrorAt) issues.push('Independent backup is stale or failing');
      if (health.persistence?.configured !== true) issues.push('Persistent data location is not configured');
    }
  } catch (e) { issues.push(e.message); }
  for (const route of ['/', '/app.js', '/styles.css', '/sw.js', '/i18n/pt.js', '/vendor/barcode/barcode-detector.js', '/vendor/barcode/zxing_reader.wasm', '/privacy', '/terms', '/support']) {
    try {
      const r = await request(route);
      if (route.endsWith('.js') && !/javascript/.test(r.headers.get('content-type') || '')) issues.push(`${route}: invalid script content type`);
      if (route.endsWith('.wasm') && !/application\/wasm/.test(r.headers.get('content-type') || '')) issues.push(`${route}: invalid WASM content type`);
      if ((await r.arrayBuffer()).byteLength === 0) issues.push(`${route}: empty response`);
    } catch (e) { issues.push(e.message); }
  }
  return { checkedAt: new Date().toISOString(), version: health?.version || null, issues };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await checkApplication(process.env.APP_CHECK_URL || 'https://app.atlasevermore.com', { expectedVersion: process.env.EXPECTED_VERSION || '18.0.2', operational: process.env.CHECK_OPERATIONAL === 'true' });
  console.log(JSON.stringify(result, null, 2));
  if (result.issues.length) process.exitCode = 1;
}

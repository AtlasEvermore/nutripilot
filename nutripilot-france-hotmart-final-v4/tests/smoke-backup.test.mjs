import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { checkApplication } from '../ops/smoke.mjs';

test('Operational monitoring rejects invalid, timezone-free, future and stale backup timestamps', async t => {
  let lastOffsiteAt;
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', req.url.endsWith('.wasm') ? 'application/wasm' : req.url.endsWith('.js') ? 'application/javascript' : 'application/json');
    res.end(req.url === '/api/health' ? JSON.stringify({
      ok: true, version: '18.1.0', accessSecret: true, email: true, ai: true,
      persistence: {configured: true, writable: true},
      backups: {enabled: true, offsiteConfigured: true, lastOffsiteAt},
    }) : 'synthetic asset');
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(async () => { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const value of ['not-a-date', true, {}, '2026-10-26T12:00:00', new Date(Date.now() + 3600000).toISOString(), new Date(Date.now() - 9 * 3600000).toISOString()]) {
    lastOffsiteAt = value;
    const result = await checkApplication(base, {operational: true});
    assert.ok(result.issues.includes('Independent backup is stale or failing'), String(value));
  }
  lastOffsiteAt = new Date().toISOString();
  assert.deepEqual((await checkApplication(base, {operational: true})).issues, []);
});

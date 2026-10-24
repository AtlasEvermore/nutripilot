import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateReadiness, requirementsFor } from './release-gate.mjs';
const tree = 'a'.repeat(40), now = Date.parse('2026-10-24T03:37:05Z');
function report(channels = ['web_hotmart']) {
  const value = { schemaVersion: 1, version: '18.0.2', applicationTree: tree, channels, gates: { prepare: {}, launch: {} } };
  for (const phase of ['prepare', 'launch']) for (const [id] of requirementsFor(phase, channels)) value.gates[phase][id] = { status: 'verified', verifiedAt: new Date(now).toISOString(), verifiedBy: 'release-operator', evidence: ['private-evidence:verified-check-001'] };
  return value;
}
test('A release passes only with verified, current evidence for every selected sales channel', () => {
  assert.equal(evaluateReadiness(report(), { applicationTree: tree, now }).ok, true);
  const value = report(); value.gates.prepare.independent_backup.status = 'pending';
  const r = evaluateReadiness(value, { applicationTree: tree, now });
  assert.equal(r.ok, false); assert.ok(r.blockers.some(s => s.includes('Backup')));
});
test('Code checks and post-deployment acceptance are separate phases', () => {
  const value = report(); value.gates.launch = {};
  assert.equal(evaluateReadiness(value, { applicationTree: tree, now }).ok, true);
  assert.equal(evaluateReadiness(value, { phase: 'launch', applicationTree: tree, now }).ok, false);
});
test('Old application evidence, stale backups and future attestations cannot approve a release', () => {
  assert.equal(evaluateReadiness(report(), { applicationTree: 'b'.repeat(40), now }).ok, false);
  const value = report(); value.gates.prepare.independent_backup.verifiedAt = new Date(now - 9 * 3600000).toISOString();
  assert.equal(evaluateReadiness(value, { applicationTree: tree, now }).ok, false);
  value.gates.prepare.independent_backup.verifiedAt = new Date(now + 3600000).toISOString();
  assert.equal(evaluateReadiness(value, { applicationTree: tree, now }).ok, false);
});
test('Native stores are mandatory only when that channel is selected', () => {
  const value = report(['ios']); delete value.gates.prepare.ios_configuration;
  assert.equal(evaluateReadiness(value, { applicationTree: tree, now }).ok, false);
  assert.equal(evaluateReadiness(report(['web_hotmart']), { applicationTree: tree, now }).ok, true);
});
test('Secrets, missing evidence and missing verification owners are rejected without echoing secrets', () => {
  const value = report(); const secret = 'sk-' + 'x'.repeat(45);
  value.gates.prepare.email_delivery.evidence = [secret];
  const r = evaluateReadiness(value, { applicationTree: tree, now });
  assert.equal(r.ok, false); assert.equal(JSON.stringify(r).includes(secret), false);
  value.gates.prepare.email_delivery.evidence = []; value.gates.prepare.email_delivery.verifiedBy = '';
  assert.equal(evaluateReadiness(value, { applicationTree: tree, now }).ok, false);
});
test('Malformed reports and invalid scopes fail closed', () => {
  assert.equal(evaluateReadiness(null, { applicationTree: tree, now }).ok, false);
  assert.equal(evaluateReadiness(report(), { phase: 'bypass', applicationTree: tree, now }).ok, false);
  const value = report(); value.channels = [];
  assert.equal(evaluateReadiness(value, { applicationTree: tree, now }).ok, false);
});

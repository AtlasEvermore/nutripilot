import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { evaluateReadiness, requirementsFor } from './release-gate.mjs';
const tree = 'a'.repeat(40), now = Date.parse('2026-10-24T03:37:05Z');
function report(channels = ['ios','android']) {
  const value = { schemaVersion: 1, version: '18.0.2', applicationTree: tree, nativeTree: tree, channels, gates: { prepare: {}, launch: {} } };
  for (const phase of ['prepare', 'launch']) for (const [id] of requirementsFor(phase, channels)) value.gates[phase][id] = { status: 'verified', verifiedAt: new Date(now).toISOString(), verifiedBy: 'release-operator', evidence: ['private-evidence:verified-check-001'] };
  return value;
}
test('A release passes only with verified, current evidence for every selected sales channel', () => {
  assert.equal(evaluateReadiness(report(), { applicationTree: tree, nativeTree: tree, now }).ok, true);
  const value = report(); value.gates.prepare.independent_backup.status = 'pending';
  const r = evaluateReadiness(value, { applicationTree: tree, nativeTree: tree, now });
  assert.equal(r.ok, false); assert.ok(r.blockers.some(s => s.includes('Backup')));
});
test('Code checks and post-deployment acceptance are separate phases', () => {
  const value = report(); value.gates.launch = {};
  assert.equal(evaluateReadiness(value, { applicationTree: tree, nativeTree: tree, now }).ok, true);
  assert.equal(evaluateReadiness(value, { phase: 'launch', applicationTree: tree, nativeTree: tree, now }).ok, false);
});
test('Old application evidence, stale backups and future attestations cannot approve a release', () => {
  assert.equal(evaluateReadiness(report(), { applicationTree: 'b'.repeat(40), nativeTree: tree, now }).ok, false);
  const value = report(); value.gates.prepare.independent_backup.verifiedAt = new Date(now - 9 * 3600000).toISOString();
  assert.equal(evaluateReadiness(value, { applicationTree: tree, nativeTree: tree, now }).ok, false);
  value.gates.prepare.independent_backup.verifiedAt = new Date(now + 3600000).toISOString();
  assert.equal(evaluateReadiness(value, { applicationTree: tree, nativeTree: tree, now }).ok, false);
});
test('Native stores are mandatory only when that channel is selected', () => {
  const value = report(['ios']); delete value.gates.prepare.ios_configuration;
  assert.equal(evaluateReadiness(value, { applicationTree: tree, nativeTree: tree, now }).ok, false);
  assert.equal(evaluateReadiness(report(['ios','android']), { applicationTree: tree, nativeTree: tree, now }).ok, true);
});
test('Secrets, missing evidence and missing verification owners are rejected without echoing secrets', () => {
  const value = report(); const secret = 'sk-' + 'x'.repeat(45);
  value.gates.prepare.email_delivery.evidence = [secret];
  const r = evaluateReadiness(value, { applicationTree: tree, nativeTree: tree, now });
  assert.equal(r.ok, false); assert.equal(JSON.stringify(r).includes(secret), false);
  value.gates.prepare.email_delivery.evidence = []; value.gates.prepare.email_delivery.verifiedBy = '';
  assert.equal(evaluateReadiness(value, { applicationTree: tree, nativeTree: tree, now }).ok, false);
});
test('Malformed reports and invalid scopes fail closed', () => {
  assert.equal(evaluateReadiness(null, { applicationTree: tree, nativeTree: tree, now }).ok, false);
  assert.equal(evaluateReadiness(report(), { phase: 'bypass', applicationTree: tree, nativeTree: tree, now }).ok, false);
  const value = report(); value.channels = [];
  assert.equal(evaluateReadiness(value, { applicationTree: tree, nativeTree: tree, now }).ok, false);
});

test('The deployment command rejects tracked and untracked code outside the approved Git revision', async t => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(),'np-release-git-'));
  t.after(()=>fs.rm(dir,{recursive:true,force:true}));
  const git = (...args) => execFileSync('git',args,{cwd:dir,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  await fs.mkdir(path.join(dir,'ops'));
  await fs.mkdir(path.join(dir,'release'));
  const app = path.join(dir,'nutripilot-france-hotmart-final-v4'); await fs.mkdir(app);
  await fs.mkdir(path.join(dir,'native'));await fs.writeFile(path.join(dir,'native/package.json'),JSON.stringify({version:'18.0.2'}));
  await fs.copyFile(new URL('./release-gate.mjs',import.meta.url),path.join(dir,'ops/release-gate.mjs'));
  await fs.writeFile(path.join(app,'package.json'),JSON.stringify({version:'18.0.2'}));
  await fs.writeFile(path.join(app,'app.js'),'// approved\n');
  git('init'); git('add','.'); git('-c','user.name=Test','-c','user.email=test@example.invalid','commit','-m','isolated fixture');
  const value = report(); value.applicationTree = git('rev-parse','HEAD:nutripilot-france-hotmart-final-v4');value.nativeTree = git('rev-parse','HEAD:native');
  for (const phase of Object.values(value.gates)) for (const item of Object.values(phase)) item.verifiedAt = new Date().toISOString();
  await fs.writeFile(path.join(dir,'release/readiness.json'),JSON.stringify(value));
  const check = () => spawnSync(process.execPath,[path.join(dir,'ops/release-gate.mjs'),'prepare'],{encoding:'utf8'});
  assert.equal(check().status,0);
  await fs.writeFile(path.join(app,'app.js'),'// changed after approval\n');
  assert.equal(check().status,1);
  git('restore','nutripilot-france-hotmart-final-v4/app.js');
  await fs.writeFile(path.join(app,'new.js'),'// never reviewed\n');
  assert.equal(check().status,1);
});

test('Store readiness requires matching native source and signed-artifact evidence',()=>{
 const value=report();assert.equal(evaluateReadiness(value,{applicationTree:tree,nativeTree:tree,now}).ok,true);
 assert.equal(evaluateReadiness(value,{applicationTree:tree,nativeTree:'b'.repeat(40),now}).ok,false);
 delete value.gates.prepare.ios_artifact;assert.equal(evaluateReadiness(value,{applicationTree:tree,nativeTree:tree,now}).ok,false);
});

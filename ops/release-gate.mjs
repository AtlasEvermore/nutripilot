import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const REQUIREMENTS = {
  prepare: [
    ['hosting_access', 'Railway liberado e hospedagem com continuidade confirmada', 24],
    ['independent_backup', 'Backup dos dados reais fora do Railway', 8],
    ['restore_drill', 'Restauração isolada dos dados reais testada', 720],
    ['new_credentials_stored', 'Novas credenciais salvas com escopo mínimo', 168],
    ['ai_billing_limits', 'Créditos, modelo e controles de despesa da IA verificados', 24],
    ['email_delivery', 'Entrega real de e-mail de acesso validada em conta autorizada', 48],
    ['legal_configuration', 'Identidade legal e políticas reais configuradas', 168],
    ['rollback_migration', 'Plano de retorno e compatibilidade V12 → candidata validados', 168],
    ['ci_gate_prepared', 'Espera pelos testes ativa ou incluída na implantação revisada', 24],
    ['expiry_alert', 'Aviso de vencimento das credenciais confirmado', 720],
  ],
  launch: [
    ['deployed_release', 'Versão, revisão e implantação SUCCESS conferidas', 24],
    ['credential_cutover', 'Processo em produção usando as novas credenciais', 24],
    ['photo_chat', 'Foto real e conversa com várias mensagens aprovadas', 24],
    ['login_sync', 'Login, persistência e sincronização reais aprovados', 24],
    ['old_credentials_revoked', 'Credenciais antigas revogadas após a troca validada', 24],
    ['offsite_schedule', 'Backup externo automático recente e recuperável confirmado', 24],
    ['monitoring_alert', 'Alerta operacional recebido e recuperação conferida', 168],
    ['ci_gate_active', 'Wait for CI confirmado ativo no Railway', 24],
    ['legal_pages', 'Páginas legais publicadas e conferidas', 24],
  ],
};
const channelRequirements = {
  ios: {
    prepare: [['ios_configuration', 'App Store: conta, produtos, assinatura e validação configurados', 168], ['ios_artifact', 'IPA assinado da candidata verificado', 24]],
    launch: [['ios_purchase', 'Compra e restauração iOS aprovadas no ambiente da loja', 24], ['ios_store_release', 'App Store: aprovação e disponibilidade da candidata confirmadas', 24]],
  },
  android: {
    prepare: [['android_configuration', 'Google Play: conta, produtos, assinatura e validação configurados', 168], ['android_artifact', 'AAB assinado da candidata verificado', 24]],
    launch: [['android_purchase', 'Compra e restauração Android aprovadas no ambiente da loja', 24], ['android_store_release', 'Google Play: aprovação e disponibilidade da candidata confirmadas', 24]],
  },
};
export function requirementsFor(phase, channels) {
  return [...(REQUIREMENTS[phase] || []), ...channels.flatMap(c => channelRequirements[c]?.[phase] || [])];
}
const secretPattern = /(?:sk-(?:proj-)?[A-Za-z0-9_-]{20,}|re_[A-Za-z0-9_-]{20,})/;
export function evaluateReadiness(report, { phase = 'prepare', applicationTree, nativeTree, now = Date.now() } = {}) {
  const blockers = [];
  if (!Object.hasOwn(REQUIREMENTS, phase)) return { ok: false, phase, blockers: ['Fase inválida; use prepare ou launch.'] };
  if (!report || report.schemaVersion !== 1) return { ok: false, phase, blockers: ['Manifesto de liberação ausente ou inválido.'] };
  if (!/^[a-f0-9]{40}$/.test(applicationTree || '') || report.applicationTree !== applicationTree) blockers.push('As evidências não correspondem à árvore Git da aplicação candidata.');
  if (!/^\d+\.\d+\.\d+$/.test(report.version || '')) blockers.push('Versão candidata inválida.');
  const channels = Array.isArray(report.channels) ? report.channels : [];
  if (!channels.length || channels.some(c => !Object.hasOwn(channelRequirements, c))) blockers.push('Canais de venda devem ser definidos explicitamente.');
  if (channels.some(c => c === 'ios' || c === 'android') && (!/^[a-f0-9]{40}$/.test(nativeTree || '') || report.nativeTree !== nativeTree)) blockers.push('As evidências não correspondem à árvore Git da aplicação nativa.');
  if (new Set(channels).size !== channels.length) blockers.push('Canais de venda duplicados.');
  for (const [id, label, maxHours] of requirementsFor(phase, channels)) {
    const record = report.gates?.[phase]?.[id];
    if (record?.status !== 'verified') { blockers.push(`${label}: pendente.`); continue; }
    const time = typeof record.verifiedAt === 'string' && /(?:Z|[+-]\d{2}:\d{2})$/.test(record.verifiedAt) ? Date.parse(record.verifiedAt) : NaN;
    if (!Number.isFinite(time) || time > now + 300000 || now - time > maxHours * 3600000) blockers.push(`${label}: verificação ausente, futura ou vencida.`);
    if (typeof record.verifiedBy !== 'string' || !record.verifiedBy.trim()) blockers.push(`${label}: responsável pela verificação ausente.`);
    if (!Array.isArray(record.evidence) || !record.evidence.length || record.evidence.some(e => typeof e !== 'string' || e.trim().length < 10)) blockers.push(`${label}: referência de evidência ausente.`);
    else if (record.evidence.some(e => secretPattern.test(e))) blockers.push(`${label}: evidência contém possível segredo; use somente uma referência sem credenciais.`);
  }
  return { ok: blockers.length === 0, phase, version: report.version, blockers };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    const report = JSON.parse(await fs.readFile(path.join(root, 'release/readiness.json'), 'utf8'));
    const applicationTree = execFileSync('git', ['rev-parse', 'HEAD:nutripilot-france-hotmart-final-v4'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    const source = await fs.readFile(path.join(root, 'nutripilot-france-hotmart-final-v4/package.json'), 'utf8');
    const nativeTree = report.channels?.some(c => c === 'ios' || c === 'android') ? execFileSync('git', ['rev-parse', 'HEAD:native'], { cwd: root, encoding: 'utf8', stdio:['ignore','pipe','pipe'] }).trim() : undefined;
    const result = evaluateReadiness(report, { phase: process.argv[2] || 'prepare', applicationTree, nativeTree });
    const dirty = execFileSync('git', ['status', '--porcelain', '--untracked-files=normal', '--', 'nutripilot-france-hotmart-final-v4', ...(nativeTree ? ['native'] : [])], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    if (dirty) { result.ok = false; result.blockers.push('A aplicação possui alterações fora da revisão Git validada; registre e valide a candidata exata.'); }
    if (JSON.parse(source).version !== report.version) { result.ok = false; result.blockers.push('A versão do pacote não corresponde ao manifesto.'); }
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exitCode = 1;
  } catch { console.error('Publicação bloqueada: não foi possível validar o manifesto e a árvore Git.'); process.exitCode = 1; }
}

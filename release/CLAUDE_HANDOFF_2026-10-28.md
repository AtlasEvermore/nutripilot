# Checkpoint — NutriPilot, 28/10/2026 (continuação do handoff de 27/10)

Leia antes: `release/CLAUDE_HANDOFF_2026-10-27.md` (branch/commit a3d70be), `AGENTS.md`, `release/PENDENCIAS_DEPLOY_2026-10-27.md`, `release/readiness.json`.

## Feito nesta sessão (com provas)
- PR #37 conferida: todos os checks verdes, incluindo `Native compilation` 40610293115 (ios + android) e `Server image` 40610293069 (regression + Clean browser acceptance). Estado `clean`.
- **PR #37 mesclada em main** (merge commit): `3476052294f4ae7f0a12d2798e6c920aa0f9dfec`. main era ancestral da candidata; árvores preservadas: aplicação `c1b99fd4fcd170dbff27d73b3af216002a36f1c5`, nativo `be0680febad4748045991bbcee2238dc8525824e` (iguais às evidências de readiness.json).
- `node ops/release-gate.mjs prepare` na candidata: falha pelos mesmos 4 grupos (backup recente, IA, configuração comercial iOS, IPA). Nada foi publicado, nenhum patch Railway aplicado, nada submetido à Apple.
- **Workflow "iOS signed artifact" disparado** para a revisão exata de main: execução `40612751598` (https://github.com/AtlasEvermore/nutripilot/actions/runs/40612751598), status `waiting` = aguardando aprovação do ambiente protegido `ios-signing`.

## Pendências e quem age
1. **IPA (proprietário):** em Settings › Secrets and variables › Actions › Variables, definir `IOS_SIGNING_APPROVED_REVISION` = `3476052294f4ae7f0a12d2798e6c920aa0f9dfec` (a etapa do workflow exige igualdade com o SHA). Depois aprovar a execução 40612751598 no ambiente `ios-signing`. Se a variável não estiver definida antes da aprovação, a execução falha na etapa "Require the separately approved signing revision"; então redisparar com a mesma revisão. Após sucesso: verificação independente de assinatura/árvore/validade e registro em readiness `ios_artifact`.
2. **IA (proprietário):** informar um teto mensal explícito em US$, financiar a conta do provedor (saldo observado zero) e configurar limite de gasto/alertas no painel. Registrar `ai_billing_limits` só após verificar modelo, saldo e limite reais. O servidor já tem trava própria (`AI_USER_DAILY_LIMIT`, `AI_GLOBAL_DAILY_LIMIT`).
3. **Apple (proprietário + decisões):** banco/acordo de apps pagos; **lista explícita de países iniciais** (a seleção de 175 foi rejeitada — não repetir); confirmação da declaração final de privacidade; contato/acesso de revisão; conferir a contagem de capturas antes de reenviar; produtos/entitlements e validação no servidor (RevenueCat: chaves e webhook no Railway). Registrar `ios_configuration`.
4. **Backup recente (por último, janela de 8 h):** com acesso ao console Railway/CLI autenticada, gerar nova cópia real, guardar fora do Railway, conferir hash, restaurar isoladamente. Nunca reapresentar a cópia de 27/10 11:55Z.

## Janelas que vencem
- `hosting_access` (24 h) vence ~2026-10-28T12:23Z; `ci_gate_prepared` (24 h) vence ~2026-10-28T23:48Z; `email_delivery` (48 h) vence ~2026-10-29T17:24Z. Renovar com prova real no dia do deploy; não marcar sem verificar.
- Sequência recomendada no dia: IA → Apple → IPA verificado → hosting/CI conferidos → backup novo + restore → `prepare` SUCCESS → aplicar patch Railway `9c88b850…` (STAGED, 18 alterações) uma única vez → SUCCESS/versão/revisão → testes reais → `launch`.

## Regras mantidas
Não comprar créditos sem orçamento explícito; não burlar travas; não reconectar auto deploy antes de `prepare` passar; preservar volume `/data` e plano de retorno; não declarar lançamento antes de `launch` e da disponibilidade real na App Store. iOS primeiro; Android adiado.

## Atualização 28/10 ~12:30Z
- Produção conferida: `/api/health` → V12.0.0, ready=false (inalterada).
- `IOS_SIGNING_APPROVED_REVISION` é variável do **ambiente** `ios-signing` (não do repositório) e ainda vale `5a4f67a1…`. A alteração para `3476052294f4ae7f0a12d2798e6c920aa0f9dfec` foi **recusada pela proteção de segurança do agente**: o proprietário precisa editá-la (Settings › Environments › ios-signing › Environment variables) e aprovar a execução 40612751598 (revisor obrigatório: AtlasEvermore). Os 3 segredos de assinatura existem no ambiente.
- No navegador do proprietário, Railway, App Store Connect e OpenAI estão **deslogados** (Railway exibe aviso de recuperação pós-incidente de 21/10). Login com senha é exclusivo do proprietário; depois o agente continua (somente leitura/configuração autorizada, sem colar chaves).
- Interruptor da IA já existe: `AI_ENABLED` (padrão false), `AI_ALLOW_GUESTS`, `AI_GLOBAL_DAILY_LIMIT`/`AI_GLOBAL_MONTHLY_LIMIT` (contagem de requisições, persistentes) e `AI_USER_DAILY_LIMIT`. O patch STAGED mantém IA desligada. Proprietário declarou orçamento de **US$100/dia** (tratar a IA por último). A OpenAI só oferece orçamento mensal por projeto; converter para limites de requisição exige o modelo real (`OPENAI_MODEL`) e medição de custo por chamada.
- **Congelamento do código:** qualquer mudança na árvore da aplicação invalida todas as evidências vinculadas (`applicationTree`), inclusive o e-mail real único. Melhorias visuais ficam para o ciclo seguinte ao lançamento.

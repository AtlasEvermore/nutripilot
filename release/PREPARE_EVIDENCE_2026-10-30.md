# Evidências de preparação — 29/30 out 2026 (sem segredos)

Coletadas pelo agente no navegador do proprietário, ~02:45Z de 30/10.

- **Hospedagem:** Railway Billing → plano Hobby ativo, cartão anexado. Produção `/api/health`: HTTP 200, V12.0.0, `/data` gravável, ready=false (esperado antes do deploy).
- **IA:** OpenAI Billing → saldo pré-pago US$5,00, recarga automática DESLIGADA (para em zero). Limite mensal da organização US$100 com alertas 80%/100%. Proprietário restringiu o projeto ao gpt-5-mini e ligou alerta de gasto. Patch Railway preparado: AI_ENABLED=true, OPENAI_MODEL=gpt-5-mini, chave nova (colada pelo proprietário), AI_ALLOW_GUESTS=false, FREE_SCANS=0 (iguais ao vivo), limites globais/usuário configurados.
- **Wait for CI:** patch 9c88b850 contém `source.checkSuites=true`. Main com árvores c1b99fd4/be0680fe passou regression, Clean browser acceptance e image (23:34–23:40Z de 29/10). "Mandatory production requirements" falha até o prepare passar em main (intencional).
- **iOS:** ver STORE_AVAILABILITY_2026-10-29.md (metadados, territórios, build 301 VALID vinculado, assinaturas prontas, privacidade publicada pelo proprietário em 29/10 ~23h43 BRT). RevenueCat: app App Store com chave IAP válida; chaves no patch.
- **Ainda pendentes:** backup real novo fora do Railway (8h) e e-mail real (48h, requer autorização do proprietário). O console de produção foi bloqueado para o agente pela revisão automática; o backup deve ser executado pelo proprietário ou com autorização explícita.

# Revisão técnica — 26/10/2026

## Correções

- E-mails de acesso seguem o idioma escolhido nas duas telas de autenticação. Há conteúdo nos 14 idiomas da aplicação, versão em texto simples e direção RTL para árabe. Requisições antigas ou idiomas desconhecidos preservam o padrão francês. Código, validade de 15 minutos e permissões não mudam.
- Conteúdo de marca é escapado no HTML e quebras de linha são removidas do assunto. Idioma inválido não injeta conteúdo.
- Monitoramento operacional rejeita datas de backup inválidas, sem fuso, vencidas ou futuras além da tolerância de cinco minutos. Uma data inválida não é evidência de upload recente.

## Verificações realizadas

- `npm run check` passou. Suíte local anterior à inclusão do teste adicional de monitoramento: 57 testes do aplicativo passaram, um teste de PostgreSQL foi omitido por ausência de banco local. O CI deve executar PostgreSQL real.
- Cinco verificações direcionadas de idioma, geração de e-mail, integração com os dois fluxos de interface e monitoramento passaram sem enviar mensagens nem consultar provedores reais.
- Oito testes da trava, três testes nativos e dez testes da rotina de assinatura passaram localmente. Isso não gera um IPA novo nem comprova compras ou aprovação da loja.
- Em 2026-10-26T12:00:33.596Z, a aplicação revisada iniciou contra uma nova restauração isolada dos cinco arquivos do snapshot real de 2026-10-26T02:18:56.327Z. Smoke das rotas públicas passou com versão 18.1.0. Após encerrar o processo, os cinco arquivos originais permaneceram byte a byte idênticos. Provedores pagos desativados; nenhum dado ou processo de produção alterado.
- Árvore da aplicação: `007eb3cff91004d4901a82a369e006494c3d30e7`. Shell nativo inalterado: `39d0f6ebdde9f52a715c46fc9b9de67c7538e24c`.

## Evidências externas parciais

- Captura do proprietário em 26/10 mostra os três formulários fiscais (Brasil, certificado de condição estrangeira e W-8BEN) como Ativo. DSA permanece Em revisão. Cadastro bancário ficou a cargo do proprietário após indisponibilidade na adesão ao câmbio do banco. Status Ativo não constitui análise independente da veracidade das declarações fiscais.
- Domínio de envio verificado e uma mensagem de acesso entregue à conta autorizada do proprietário, confirmada no painel Resend nesta data. Foi o processo antigo V12 que enviou; não comprova ativação da credencial substituta ou entrega no processo candidato. Não registrar código nem conteúdo da mensagem.
- Leitura do Railway continua mostrando V12 na implantação saudável anterior, sem nova implantação nem fila de versões intermediárias. Patch de 18 alterações permanece STAGED, incluindo Wait for CI; não aplicado.

## Decisão

Não publicar enquanto `prepare` falhar. Não registrar saldo, orçamento, configuração completa das lojas, entrega na candidata, backup recente ou identidade legal como verificados a partir dessas evidências parciais. O ensaio com uma restauração antiga não renova a idade do snapshot: é necessário novo backup real de até oito horas antes do corte. Não comprar créditos, iniciar builds pagos, trocar DNS/volume ou liberar Android.

## CI e imagem aprovados

- PR de correções: https://github.com/AtlasEvermore/nutripilot/pull/28, integrado como b9cba55832e25b785d8527af2b30bf6e25655ebb.
- CI https://github.com/AtlasEvermore/nutripilot/actions/runs/40320218323: 69 verificações do aplicativo (PostgreSQL real incluído), oito da trava, três nativas e dez da assinatura: 90 aprovadas, nenhuma omitida ou reprovada. Auditoria de dependências também passou.
- Imagem imutável `ghcr.io/atlasevermore/nutripilot@sha256:39176d98079808d9dabdda267f008df2c6c1aa78e11699af2deaab4cb4256b9c`, publicada no registro após smoke do container: versão 18.1.0, issues vazio. Isso não é deploy no Railway nem envio à App Store.
- Leitura direta do domínio em 2026-10-26T12:08:35.730Z confirmou V12.0.0; arquivos de código de barras da candidata ausentes na versão antiga (HTTP 404). Uma requisição do smoke expirou; isso não identifica a causa de uma indisponibilidade geral. A imagem candidata passou nessas rotas em ambiente isolado.
- O commit que acrescenta esta evidência altera apenas documentação/manifesto. As árvores da aplicação e do shell nativo permanecem as indicadas acima. Backup recente, orçamento, entrega no processo candidato, configuração legal completa e configuração da loja continuam pendentes; nenhuma trava foi dispensada.

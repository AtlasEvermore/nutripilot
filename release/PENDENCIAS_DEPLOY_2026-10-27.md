# NutriPilot — pendências comprovadas para publicação

A candidata é 18.1.0. A produção continua V12; não houve deploy nem submissão à App Store. O nome comercial não foi alterado nesta etapa. Android permanece adiado.

## Preparação concluída

- Correções de áreas seguras e orientações iOS, preço anual completo e retorno de foco em receitas; preservados Atlas, NEXUS, comandos locais, simulação e PULSE.
- 224 verificações aprovadas para a árvore c1b99fd4fcd170dbff27d73b3af216002a36f1c5; [execução da imagem](https://github.com/AtlasEvermore/nutripilot/actions/runs/40604040289).
- Compilação nativa final e capturas reais de iPhone, iPad e Duo externo aprovadas em [40606946022](https://github.com/AtlasEvermore/nutripilot/actions/runs/40606946022); 43 PNGs e dois painéis conferidos. A dobra/desdobra completa ainda precisa de validação.
- Imagem imutável pronta: `ghcr.io/atlasevermore/nutripilot@sha256:f277d0593238aeba8ae01e7bf9e13baa144685ee64dda03e39faabfcdb6bdd3f`. Construção, teste do contêiner e envio ao registro passaram. Isto não é publicação no Railway.
- Backup real independente preservado e restauração isolada repetida na árvore final, sem modificar os cinco arquivos originais. A data do backup continua 27/10 às 08h55 de São Paulo; sua janela de oito horas venceu.
- Configuração legal testada em processo isolado, com os dados já autorizados mantidos em sigilo. Um e-mail real de acesso foi entregue; o corpo com o código não foi aberto.
- Preços de referência salvos na Apple: US$29,99/mês e US$299,00/ano. Os exemplos localizados observados foram R$199,90/mês e R$1.999,90/ano. Não há assinaturas vendidas ou disponibilidade global ativada.

## Quatro grupos ainda bloqueiam prepare

| Pendência | Ação concreta |
| --- | --- |
| Backup recente | Gerar outra cópia dos dados reais, guardá-la fora do Railway, conferir hash e restaurar isoladamente. A cópia anterior não será apresentada como recente. O console deixou de responder nesta sessão; não há CLI autenticada disponível. |
| Serviço de inteligência | Definir orçamento operacional mensal explícito, acesso financiado ao modelo e limites de despesa/cotas verificados. O saldo observado era zero. A autorização para o preço de venda da assinatura não fornece um orçamento para comprar créditos. Nenhuma cobrança ou recarga ilimitada foi ativada. |
| Configuração comercial iOS | Concluir os itens da Apple abaixo e validar produtos/servidor. |
| IPA assinado correspondente | Revisão da fonte exata em main, aprovação do ambiente protegido, novo build assinado e verificação independente de assinatura/árvore/validade. IPA antigo não cobre a árvore nativa atual. |

## Apple: o que ainda precisa ser concluído

[Abrir informações comerciais e bancárias](https://appstoreconnect.apple.com/business).

O proprietário concluirá a conta bancária e o acordo de apps pagos. Formulários fiscais observados estavam ativos. Não foi inventado documento, número de conta ou telefone.

[Abrir a versão 18.1.0 em preparação](https://appstoreconnect.apple.com/apps/6826838334/distribution/ios/version/inflight).

- Selecionar especificamente os países iniciais de venda. A ativação dos 175 países não foi aplicada.
- Confirmar os envios das capturas nas galerias exigidas. Arquivos reais estão preparados; a última tentativa pelo navegador não retornou confirmação.
- Concluir contato para revisão e acesso demonstrativo apropriado; campos faltantes não foram inventados e credenciais persistentes não foram criadas.
- Finalizar configuração de todos os produtos/entitlements e validação de compras no servidor. Os dois preços salvos não equivalem a configuração comercial completa.
- Vincular o build assinado correto, fazer compra e restauração reais no ambiente da loja e obter a aprovação/disponibilidade pública.
- Revisar direitos do conteúdo e eventual pendência DSA; não foi feita atestação sem comprovação.

[Abrir privacidade do app](https://appstoreconnect.apple.com/apps/6826838334/distribution/privacy).

As categorias foram preparadas e salvas em rascunho. A publicação final contém declaração legal de veracidade/conformidade e atualização; exige confirmação no momento do envio. O endereço legal já autorizado foi preservado e não precisa ser autorizado novamente.

A compilação no SDK 27.1 e as capturas do display externo Duo não comprovam o ciclo nativo de dobrar/desdobrar. O display interno inativo/preto foi excluído das imagens aceitas.

## Depois de prepare passar

Aplicar a candidata uma única vez, preservar volume/dados, confirmar SUCCESS, versão/revisão e proteção Wait for CI ativa. Fazer testes reais de login/sincronização, inteligência, páginas legais públicas, alerta, compra/restauração iOS, corte/revogação coordenada de credenciais e rotina externa de backup. Executar também launch. Só então declarar lançamento.

[PR da candidata](https://github.com/AtlasEvermore/nutripilot/pull/37). Evidências detalhadas em FINAL_POLISH_2026-10-27.md, readiness.json e FINAL_IMAGE_2026-10-27.json.

A revisão automática rejeitou a ativação comercial em 175 países por falta de autorização específica para esse alcance e um segundo envio de e-mail por exceder o teste único autorizado. As ações foram interrompidas; não houve tentativa de contornar essas decisões.

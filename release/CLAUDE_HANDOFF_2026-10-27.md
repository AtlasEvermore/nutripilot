# Prompt de continuidade — NutriPilot existente

Continue diretamente o trabalho autorizado no repositório **AtlasEvermore/nutripilot**, infraestrutura **Railway**. Não recrie o projeto e não confunda com DentPilot. O proprietário tem pouco limite disponível e quer deixar apenas o mínimo necessário para continuar no Claude. Evite refazer código, testes ou imagens já comprovados. Execute o trabalho viável; não se limite a oferecer um plano.

## Primeiro: recuperar o estado real

1. Leia `AGENTS.md` e `release/FINAL_POLISH_2026-10-27.md`, `PENDENCIAS_DEPLOY_2026-10-27.md`, `readiness.json`, `FINAL_IMAGE_2026-10-27.json`, `FINAL_VISUAL_EVIDENCE_2026-10-27.json`, `FINAL_GATE_RESULT_2026-10-27.json` e `PRODUCTION_STATE_2026-10-27.json`.
2. Confira GitHub, PR e checks atuais antes de modificar algo. A branch candidata é `ops/final-polish-evidence-20261027` e a [PR #37 está pronta para revisão, ainda não mesclada](https://github.com/AtlasEvermore/nutripilot/pull/37).
3. Checkpoint da candidata: `4fd0053de50bad5458976353d1e52e39b8e7286a`, árvore raiz `1a194ef8adeec8e65c38e637096696e20b3974b3`. Aplicação **`c1b99fd4fcd170dbff27d73b3af216002a36f1c5`**; nativo **`be0680febad4748045991bbcee2238dc8525824e`**. O documento de continuidade fica em uma branch documental separada para não cancelar os checks que já estavam em execução.
4. PR #36 já mesclada em main: `8f5286abdad36e08766c5a12d7c77e732959bf9e`. Não volte a tratar essa revisão antiga como a candidata final.

## Concluído — não refazer sem motivo

- Preservados Atlas, NEXUS, comandos locais com confirmação/desfazer, simulação de porções e PULSE. Menus/janelas acessíveis, Escape e retorno de foco; serviços remotos pausados preservam rascunhos e oferecem ferramentas locais. Preços/ofertas ficam em Planos.
- Corrigidas áreas seguras assimétricas iOS, orientações/redimensionamento e retorno do foco para a receita que abriu a janela. O preço anual completo tem referência independente; a captura final mostra **US$299,00**, não US$299,90.
- **224 verificações**: 98 aplicação/PostgreSQL, 8 trava, 4 configuração nativa, 10 assinatura e 104 navegadores. Execuções aprovadas: `40604028724`, `40604040289`, `40606946074`.
- A execução **nativa `40606946022` passou integralmente**, SDK/Xcode 27.1, com capturas reais de iPhone, iPad e Duo externo da árvore final. O timeout anterior do orçamento combinado foi investigado: agora cada dispositivo tem passo limitado a 12 minutos e upload separado; o limite total continua 35 minutos e falhas continuam falhando o job. Não houve remoção de verificações.
- O commit documental `4fd0053` disparou novos checks automáticos: `40610293069` (Server image, evento PR) já passou; `40610293115` (Native compilation) ainda estava em execução na última leitura. Ele repete a mesma aplicação/nativo, sem mudança funcional. Confira o resultado, não invente sucesso nem reinicie desnecessariamente.
- **Imagem final construída, testada e enviada ao registro** em `40604040289`, fonte `fe8ef9ef4ec8316d98380bc54bcf1657ced404e8`, com as mesmas árvores de aplicação/nativo:
  `ghcr.io/atlasevermore/nutripilot@sha256:f277d0593238aeba8ae01e7bf9e13baa144685ee64dda03e39faabfcdb6bdd3f`.
  O gatilho temporário da branch de construção foi removido após o sucesso. A imagem pronta não representa um deploy.
- Restauração isolada da árvore final passou em `2026-10-27T23:43:19Z`: cinco hashes preservados e smoke 18.1.0 sem problemas. Configuração legal isolada também passou; isso não substitui conferir as páginas públicas após deploy.
- Um único e-mail real de acesso foi entregue e confirmado no Resend. Os executáveis server/auth permaneceram byte a byte iguais depois das correções frontend. Não mande outro teste por reflexo: a revisão automática bloqueou o segundo envio, e a evidência original manteve seu timestamp real.

## Imagens finais já entregues e salvas

São **43 PNGs reais + 2 painéis JPEG**, com dados sintéticos, sem mockups, segredos ou dados pessoais de produção. O ZIP tem 47 entradas com README/manifesto.

- Browser: execução `40604040289`, artefato `12780251947`, SHA256 do ZIP `103c748165424b874c66b356e77fb35d4de51db4060eccee6f6a1d54bb05cb26`.
- Nativo: execução `40606946022`, artefato combinado `12782680411`, SHA256 `1f2d480cdd5a444a409854a4f9bcaef91b1fb1da9de383614e05d51bf8cdac3b`.
- ZIP entregue `NutriPilot-capturas-finais-2026-10-27.zip`: SHA256 **`330481fee99edfdecfa3c923430443604fa6ece447f0d4295cfdfcc351bca6df`**. Imagens e ZIP estão salvos nos arquivos privados do proprietário. Valide a expiração dos artefatos GitHub antes de tentar recuperá-los.
- Dimensões nativas: iPhone 1206×2622; iPad 2064×2752; Duo externo 1398×2034. PNGs foram convertidos apenas para RGB, sem retocar a interface. O display interno preto/inativo foi excluído. **O ciclo nativo de abrir/dobrar ainda não foi validado.** A Apple orienta testar poses no Device Hub: https://developer.apple.com/videos/play/tech-talks/111461/.

Se o workspace persistir: repo `/workspace/scratch/4aebe4ca0871/nutripilot`; fotos `/workspace/scratch/3780656121e9/NutriPilot-final-real-2026-10-27`; pacote no diretório pai. Não dependa desses caminhos transitórios: o código/evidências estão no GitHub e os arquivos de entrega foram salvos separadamente.

## Estado operacional: NÃO lançado

Última leitura real de produção: `2026-10-28T00:40:18Z`, HTTP 200, **V12.0.0, ready=false**. Nenhuma implantação, patch Railway, reconexão automática ou submissão de binário à Apple foi feita. Não afirme publicação desta revisão.

Railway: projeto `53f1e860-0ea8-4144-8bec-6d93d096c5cb`; ambiente `782f73bb-f192-4308-bb26-4a48cae07f04`; serviço NutriPilot `c36f9e95-c32e-41f0-b026-44a8e90b21b3`. Branch de produção desconectada, volume original `/data`, uma réplica. Patch `9c88b850-a293-41fc-83ec-000d3cd03de9` continua **STAGED com 18 alterações**; Wait for CI preparado, ainda não aplicado. Preserve produção/dados.

`node ops/release-gate.mjs prepare` foi executado novamente e **falha por quatro grupos**:

1. **Backup recente:** cópia real criada em `2026-10-27T11:55:12.942Z`, cinco arquivos, SHA256 cifrado `6fd4b0ae4806262b102d1cc3582e05db461aeb650bceb64989865b257297468b`, retida independentemente com chave separada. A janela de oito horas venceu. Repetir o restore NÃO renova a data. Gerar nova cópia real quando houver acesso ao console, guardar fora do Railway, conferir hash e restaurar isoladamente. Nunca apresentar backup antigo como recente. O navegador deixou de responder e não havia CLI Railway autenticada para renovar a cópia.
2. **Inteligência:** acesso financiado/modelo/limites de gasto não comprovados. O saldo observado era zero; nenhum crédito ou plano foi comprado. Falta orçamento operacional explícito. Autorização sobre o preço de venda da assinatura não é orçamento para comprar créditos. Os “5%” mencionados pelo proprietário são o limite desta conversa, não autorização financeira.
3. **Configuração comercial iOS:** veja detalhes abaixo.
4. **IPA atual correspondente:** a árvore nativa mudou; o IPA histórico não cobre `be0680fe` e sua evidência venceu. Exige fonte exata revisada em main, aprovação do ambiente protegido, assinatura e verificação independente. Não burle guardas, não altere aprovações protegidas para fingir cobertura e não envie o diagnóstico de simulador como IPA de loja.

## Apple: trabalho já preparado e limites restantes

App ID `6826838334`, bundle `com.atlasevermore.nutripilot`, versão 18.1.0 em preparação, sem binário desta revisão enviado e sem submissão para revisão. [Versão](https://appstoreconnect.apple.com/apps/6826838334/distribution/ios/version/inflight), [Business/banco/acordos](https://appstoreconnect.apple.com/business), [Privacidade](https://appstoreconnect.apple.com/apps/6826838334/distribution/privacy).

- Preços salvos e autorizados: `np_complete_monthly` / Apple ID `6826844906`, US$29,99; `np_complete_annual` / `6826844951`, **US$299,00 exatos**. Exemplos Apple observados: R$199,90/mês e R$1.999,90/ano. Não houve venda/ativação global.
- Formulários fiscais observados ativos; questionário etário salvo com 18+ e dispositivo médico “Não”. Metadados da versão preparados; onze categorias de privacidade salvas em rascunho.
- Ainda faltam banco/acordo de apps pagos, países de venda, declaração final de privacidade, contato/acesso de revisão, configuração completa dos produtos/entitlements/validação, build assinado e compras/restauração reais no ambiente da loja. Direitos do conteúdo/DSA precisam de comprovação quando exigidos; não invente atestados.
- A seleção de **175 países foi rejeitada pela revisão automática e cancelada**, por faltar autorização específica desse alcance. Não tente novamente por outra rota; obtenha os países iniciais.
- A declaração final de privacidade é vinculante e precisa da confirmação obrigatória no momento da ação. A autorização sobre o **endereço legal já foi dada**; preserve os valores privados e não peça essa autorização de novo.
- O proprietário cuidará da conexão bancária Apple. Não invente número de conta, documento, telefone ou credenciais de revisão. Não crie acesso persistente sensível sem a confirmação exigida.
- O envio das capturas ao rascunho ficou **sem confirmação** após timeout do navegador; reabra e verifique a contagem antes de enviar novamente, evitando duplicação. Não trate tentativa como upload salvo.
- O nome comercial atual foi preservado. O proprietário quer discutir um sufixo mais forte depois; não espalhe novas traduções de “Dieta e Treino” nem invente outro nome agora. **iOS primeiro; Android adiado.**

## Continuação mínima e regras obrigatórias

As correções, imagem e fotos estão prontas. Priorize resolver/comprovar os quatro grupos operacionais, sem refatorações adicionais. Se ainda faltarem dados, reúna apenas as decisões indispensáveis: teto mensal do provedor e países de venda; banco/declarações/aprovação protegida exigem a participação apropriada do proprietário. A autorização geral para avançar/publicar persiste, dentro dessas regras.

Prefira conectores/CLI adequados. A sessão de navegador anterior ficou indisponível; pode funcionar em outra sessão. Não exporte todo o ambiente de segredos: a exportação ampla foi rejeitada; use acesso estritamente necessário, autorizado e privado. Nunca inclua chaves, endereço, contatos reais ou dados de saúde em relatórios/capturas.

**Execute prepare antes de qualquer deploy, promoção, DNS ou aplicação do patch. Não publique enquanto falhar. Não remova verificações, invente evidências ou reconecte auto deploy antecipadamente.** Depois de SUCCESS real, confira versão/revisão, persistência/login, legal público, inteligência e e-mail/alertas, compra/restauração iOS, corte/revogação coordenada de credenciais, backup externo recorrente e proteção CI efetivamente ativa. Preserve o plano de retorno sem apagar/reverter dados automaticamente. Só declare lançamento depois de `node ops/release-gate.mjs launch` também passar e da aprovação/disponibilidade real na App Store quando aplicável.

Informe o que realmente concluiu e os bloqueios restantes, com provas. Não prometa conclusão total nem deixe o usuário esperando sem um checkpoint copiável quando o limite da sessão se aproximar.

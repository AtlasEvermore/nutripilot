# NutriPilot 18.1.0 — revisão complementar de 26/10/2026

Base: main em 0a4f66f. Trabalho realizado no NutriPilot existente; nenhum projeto novo, alteração de plano, consumo pago, migração ou mudança em dados/produção.

## Correções implementadas

- Seis fotografias ilustrativas WebP já preparadas na revisão V18.2.0 foram recuperadas e integradas aos módulos correspondentes. Três módulos usam as ilustrações SVG locais; as nove ilustrações vetoriais continuam disponíveis. Apps é uma grade de aplicativos, sem o catálogo comercial ou hero de venda. Dimensões reservadas, carregamento diferido e nenhuma consulta a servidores externos de imagens. Proveniência em artwork/README.md.
- A descoberta dos módulos abre o respectivo espaço. Preços, comparação de combinações, ofertas e escolha de assinatura ficam em Planos e em sua confirmação de compra. Barreiras de acesso levam primeiro a Planos; o contexto do módulo selecionado é preservado no compositor. As telas iniciais, de perfil e módulos não anunciam ofertas introdutórias genéricas.
- A folha web deixa de afirmar que as duas lojas já estão disponíveis, de prometer zero dias grátis ou mostrar estimativas como cobrança confirmada. Mostra apenas links de lojas efetivamente configurados; ausência de links tem mensagem de preparação em todos os 14 idiomas. Produtos/preços e elegibilidade ainda precisam ser confirmados na loja antes da compra.
- Salvamentos de uma instância do cliente são serializados. Enquanto uma gravação termina, a versão mais recente espera e é enviada em seguida; erro transitório conserva os dados locais e programa nova tentativa, com espera máxima de rede por requisição. Isso não implementa resolução de conflitos entre aparelhos ou abas independentes.
- Uma resposta atrasada não pode substituir o token da conta atual pelo da sessão anterior. Um download iniciado na conta anterior não mistura seus dados com a conta seguinte. A fila de gravação também trata troca de conta e encerramento da sessão.
- Inicialização com prazos de rede: falhas temporárias não apagam a credencial salva. A interface não concede acesso pago sem confirmação; rejeição definitiva limpa a sessão.
- Contadores importados não propagam NaN, infinito ou valores negativos aos totais diários; metas e adição de água respeitam os limites existentes. Catálogo sem Kit confirmado oferece recuperação sem comparar preços ausentes. Corrigida também a promessa fixa de três dias grátis no subtítulo de Planos.
- Consolidado o comportamento da revisão anterior PR #30 sem reintroduzir seus textos comerciais fora de Planos. Cache do service worker incrementado para distribuir a interface atualizada.

## Verificações locais

- `npm run check`: sintaxe e geração das traduções aprovadas.
- `npm test`: 70 aprovados, nenhum reprovado, um teste de PostgreSQL real omitido por falta de banco local. Doze testes novos cobrem concorrência, respostas atrasadas, troca de conta, módulos e loja indisponível. A suíte existente também consulta os nove SVGs por HTTP.
- Oito testes da trava, três de configuração nativa e dez de verificação de assinatura passaram. Não foram gerados ou distribuídos novos artefatos nativos.
- `npm audit --omit=dev --audit-level=high`: nenhuma vulnerabilidade reportada.
- Processo candidato iniciado em diretório temporário com dados sintéticos, análises desligadas e sem credenciais externas: smoke retornou versão 18.1.0, issues vazio; nove imagens retornaram 200 e tipo SVG.
- CI 40403880811 aprovou os primeiros 28 testes reais em contextos novos de Chromium desktop/mobile, Firefox e WebKit mobile. Cobriu 18 rotas em português, inglês, francês e árabe, ausência de erros de renderização e de transbordamento do layout principal, imagens, navegação e rejeição de acesso de visitante. A consolidação final amplia a suíte para 36 testes incluindo falha temporária e rejeição da sessão; exige nova execução. Isso usa emulação móvel, não substitui aparelho real, compra sandbox, envio de e-mail nem revisão das lojas.
- Em 2026-10-26T21:31:20.838Z, nova restauração isolada do snapshot real de 2026-10-26T02:18:56.327Z: cinco arquivos, smoke da candidata 18.1.0 sem issues; todos os originais byte a byte idênticos após encerramento. Novas imagens responderam 200 e MIME correto. Snapshot não foi renovado e continua vencido para um corte em produção.

## Requisitos de loja conferidos nas fontes oficiais

Fontes consultadas em 26/10/2026; requisitos específicos devem ser rechecados no console antes do envio.

- Apple: política de privacidade acessível, exclusão de conta, proteção de dados de saúde e permissão explícita antes de compartilhar dados pessoais com terceiros, incluindo provedores de análise. A implementação existente tem fluxos e testes; confirmação de comportamento real e declarações do editor continua necessária. Fonte: https://developer.apple.com/app-store/review/guidelines/ (5.1.1, 5.1.2 e 5.1.3).
- Google: preencher Health apps declaration para os recursos efetivos de nutrição/peso, exercícios, sono e bem-estar. Formulário exigido também nas faixas de teste. Fonte: https://support.google.com/googleplay/android-developer/answer/14738291?hl=en .
- Google: confirmar exclusão pela interface e pela página externa, além das declarações correspondentes em Data safety. Fonte: https://support.google.com/googleplay/android-developer/answer/13327111?hl=en .

Preparação Android registrada sem ativar o canal, comprar serviços ou anunciar disponibilidade. iOS continua como canal de lançamento selecionado no manifesto.

## Publicação pendente

A trava `prepare` da revisão base retornou cinco pendências: snapshot real independente vencido (máximo oito horas), orçamento/modelo/limites das análises, entrega de acesso pela candidata, dados legais e configuração iOS completa. A aplicação revisada tem uma nova árvore Git: evidências vinculadas à árvore anterior não aprovam esta automaticamente. Renovar a prova de CI e registrar restauração/aceitação da candidata exata antes do corte.

Railway: projeto e serviço existentes identificados; 18 alterações continuam STAGED, incluindo Wait for CI. Nenhuma configuração, domínio, volume ou implantação foi alterada. A última tentativa exibida como FAILED não é prova de indisponibilidade da instância anterior.

Dados legais conhecidos já estão preparados em privado. É necessária a confirmação pendente do complemento/endereço e de sua divulgação, sem repetir dados pessoais neste repositório. Orçamento e acesso às configurações comerciais das lojas dependem do proprietário; backup recente e demais testes operacionais devem ser executados quando o corte puder prosseguir. Não há autorização para comprar créditos ou contratar planos.

`AGENTS.md` exige `prepare` aprovado antes do deploy e `launch` após a aceitação. Não remover verificações, marcar evidências pendentes como verificadas ou implantar em outro servidor para contornar a política. O objetivo de uma versão web atualizada e publicação nas lojas continua pendente; esta revisão entrega correções reais e verificadas do código.

## Identidade da candidata consolidada

Árvore da aplicação: `b0d36bea8f4d2a6143ff87c1b863363a92030177`. Shell nativo preservado: `39d0f6ebdde9f52a715c46fc9b9de67c7538e24c`.

O manifesto passa a identificar esta árvore. A restauração isolada usa o mesmo snapshot previamente ensaiado com V12 e comprova que a candidata lê os arquivos sem modificá-los; nenhum formato de armazenamento ou rotina de migração foi alterado nesta revisão. A evidência anterior de CI/imagem foi retirada da aprovação da nova candidata e permanece documentada no histórico. Registrar a nova execução aprovada e a imagem imutável após construção; não reaproveitar o digest da versão anterior como prova da nova.

As capturas da suíte de navegador usam somente dados fictícios e são anexadas ao relatório de CI para inspeção visual. Não são aprovação de compra, de loja ou de uso em aparelho físico.

A aceitação WebKit móvel identificou a barra inferior interceptando o botão de Planos numa prévia alta. O cartão agora limita a altura ao espaço disponível e permite rolagem interna; o clique real, sem força, continua obrigatório na suíte. Nova restauração da árvore final em 2026-10-26T21:38:22.536Z: cinco arquivos originais preservados byte a byte; smoke sem issues. A execução dos 36 testes deve ser aprovada após esta correção.

## Resultado final integrado

PR #31 integrado como `5e88a8a10b99820075268137eeecbbccdd0b9887`. PR #30 encerrado como substituído, com sua branch e histórico preservados. CI https://github.com/AtlasEvermore/nutripilot/actions/runs/40406707678 aprovado: 81 testes do aplicativo com PostgreSQL real, oito da trava, três nativos, dez de assinatura e 36 testes em navegadores novos: 138 aprovados. O clique móvel que falhava passou sem forçar eventos.

Imagem imutável aprovada após smoke do container: `ghcr.io/atlasevermore/nutripilot@sha256:eb54e95b43a4772afb5e5314455eef3d9498393480bb310ab88e7c7802ef276f`. Versão 18.1.0, revisão 5e88a8a, issues vazio. A imagem corresponde à árvore da aplicação indicada acima. Alterações posteriores somente na evidência e na captura do relatório não substituem esse digest por uma imagem não verificada. Capturas de CI incluem somente dados fictícios; as futuras capturas desativam animações durante a captura para evitar quadros de transição.

A verificação visual das capturas confirmou a grade de Apps com fotos, o acesso ao módulo e o cartão rolável acima da navegação móvel. Isso não equivale a teste em aparelho físico. Nenhuma implantação web ou publicação de loja foi executada. A trava de produção continua recusando: backup real recente, orçamento/modelo/limites, entrega de e-mail pela candidata, confirmação legal e configuração comercial iOS. A renovação da restauração não renova o snapshot antigo.

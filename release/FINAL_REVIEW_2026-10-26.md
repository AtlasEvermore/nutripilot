# NutriPilot 18.1.0 — revisão complementar de 26/10/2026

Base: main em 0a4f66f. Trabalho realizado no NutriPilot existente; nenhum projeto novo, alteração de plano, consumo pago, migração ou mudança em dados/produção.

## Correções implementadas

- Nove ilustrações SVG próprias e locais, uma para cada módulo, usadas nos cartões e na apresentação de módulos bloqueados. Dimensões reservadas, carregamento diferido e nenhuma consulta a servidores de imagens. Os nove arquivos somam menos de 13 KB sem compressão. Revisão visual feita por rasterização dos SVGs; isso não equivale à revisão visual do aplicativo num aparelho.
- A descoberta dos módulos abre o respectivo espaço. Preços, comparação de combinações, ofertas e escolha de assinatura ficam em Planos e em sua confirmação de compra. Barreiras de acesso levam primeiro a Planos; o contexto do módulo selecionado é preservado no compositor. As telas iniciais, de perfil e módulos não anunciam ofertas introdutórias genéricas.
- A folha web deixa de afirmar que as duas lojas já estão disponíveis, de prometer zero dias grátis ou mostrar estimativas como cobrança confirmada. Mostra apenas links de lojas efetivamente configurados; ausência de links tem mensagem de preparação em todos os 14 idiomas. Produtos/preços e elegibilidade ainda precisam ser confirmados na loja antes da compra.
- Salvamentos de uma instância do cliente são serializados. Enquanto uma gravação termina, a versão mais recente espera e é enviada em seguida; erro transitório conserva os dados locais e programa nova tentativa, com espera máxima de rede por requisição. Isso não implementa resolução de conflitos entre aparelhos ou abas independentes.
- Uma resposta atrasada não pode substituir o token da conta atual pelo da sessão anterior. Um download iniciado na conta anterior não mistura seus dados com a conta seguinte. A fila de gravação também trata troca de conta e encerramento da sessão.
- Cache do service worker incrementado para distribuir a interface atualizada.

## Verificações locais

- `npm run check`: sintaxe e geração das traduções aprovadas.
- `npm test`: 67 aprovados, nenhum reprovado, um teste de PostgreSQL real omitido por falta de banco local. Nove testes novos cobrem concorrência, respostas atrasadas, troca de conta, módulos e loja indisponível. A suíte existente também consulta os nove SVGs por HTTP.
- Oito testes da trava, três de configuração nativa e dez de verificação de assinatura passaram. Não foram gerados ou distribuídos novos artefatos nativos.
- `npm audit --omit=dev --audit-level=high`: nenhuma vulnerabilidade reportada.
- Processo candidato iniciado em diretório temporário com dados sintéticos, análises desligadas e sem credenciais externas: smoke retornou versão 18.1.0, issues vazio; nove imagens retornaram 200 e tipo SVG.
- O domínio público abriu em uma sessão de navegador limpa na seleção de idioma. O navegador remoto não alcança o localhost do ambiente de execução: a candidata não teve validação interativa completa em navegador/aparelho nesta sessão. Não contar os testes de VM ou a rasterização como E2E em navegador.

## Requisitos de loja conferidos nas fontes oficiais

Fontes consultadas em 26/10/2026; requisitos específicos devem ser rechecados no console antes do envio.

- Apple: política de privacidade acessível, exclusão de conta, proteção de dados de saúde e permissão explícita antes de compartilhar dados pessoais com terceiros, incluindo provedores de análise. A implementação existente tem fluxos e testes; confirmação de comportamento real e declarações do editor continua necessária. Fonte: https://developer.apple.com/app-store/review/guidelines/ (5.1.1, 5.1.2 e 5.1.3).
- Google: preencher Health apps declaration para os recursos efetivos de nutrição/peso, exercícios, sono e bem-estar. Formulário exigido também nas faixas de teste. Fonte: https://support.google.com/googleplay/android-developer/answer/14738291?hl=en .
- Google: confirmar exclusão pela interface e pela página externa, além das declarações correspondentes em Data safety. Fonte: https://support.google.com/googleplay/android-developer/answer/13327111?hl=en .

Preparação Android registrada sem ativar o canal, comprar serviços ou anunciar disponibilidade. iOS continua como canal de lançamento selecionado no manifesto.

## Publicação pendente

A trava `prepare` da revisão base retornou cinco pendências: snapshot real independente vencido (máximo oito horas), orçamento/modelo/limites das análises, entrega de acesso pela candidata, dados legais e configuração iOS completa. A aplicação revisada tem uma nova árvore Git: evidências vinculadas à árvore anterior não aprovam esta automaticamente. Renovar a prova de CI e revisar restauração/aceitação da candidata exata antes do corte.

Railway: projeto e serviço existentes identificados; 18 alterações continuam STAGED, incluindo Wait for CI. Nenhuma configuração, domínio, volume ou implantação foi alterada. A última tentativa exibida como FAILED não é prova de indisponibilidade da instância anterior.

Dados legais conhecidos já estão preparados em privado. É necessária a confirmação pendente do complemento/endereço e de sua divulgação, sem repetir dados pessoais neste repositório. Orçamento e acesso às configurações comerciais das lojas dependem do proprietário; backup recente e demais testes operacionais devem ser executados quando o corte puder prosseguir. Não há autorização para comprar créditos ou contratar planos.

`AGENTS.md` exige `prepare` aprovado antes do deploy e `launch` após a aceitação. Não remover verificações, marcar evidências pendentes como verificadas ou implantar em outro servidor para contornar a política. O objetivo de uma versão web atualizada e publicação nas lojas continua pendente; esta revisão entrega correções reais e verificadas do código.

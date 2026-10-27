# NutriPilot — Mission Control e espaços de uso diário

Nova rodada no projeto existente: página principal interativa com conteúdo real do catálogo; central local de navegação por nome, com filtro de acentos, teclado, restauração de foco e proteção contra texto injetado; apresentação própria e linguagem visual comum para os espaços internos, progresso, perfil, metas, configuração, scanner e diálogos. Preços/ofertas permanecem em Planos e confirmação.

A esfera da página principal é decorativa; o número central conta receitas, exercícios ou as noites existentes no guia. Nenhuma porcentagem de saúde, previsão ou resposta remota é inventada. A navegação e o foco não escrevem nos dados da conta nem chamam o provedor. Redução de movimento e aparelhos modestos continuam respeitados; os movimentos novos pausam com a página em segundo plano.

O painel diário do assinante destaca seus valores reais de calorias e macros. Com análises desligadas, sua ação principal abre o registro manual em vez de iniciar por uma análise indisponível; a escolha de outras formas permanece na folha de registro. Acesso, compra, assinatura e validação do servidor não mudam.

Validação local: sintaxe e testes de conteúdo/escape aprovados. CI deve validar as rotas de visitante e de uma sessão fictícia de interface; esta última simula a resposta de identidade para examinar os espaços internos, sem criar conta, assinar ou produzir token válido. Um pedido independente à API deve continuar recebendo 401. Capturas usarão apenas conteúdo fictício de teste.

Árvore inicial: 3a104654edaae50bb65f172877476a71770b6ee2. Evidências de CI e restauração reabertas. Backend, formato de dados e NativeTree preservados. Nenhuma implantação ou publicação é autorizada por este documento; seguir AGENTS.md.

## Correções identificadas na aceitação

A primeira execução aprovou 59/60 casos de navegador e identificou reflow de um controle da missão sob a navegação móvel no WebKit. A área de ações foi estabilizada e o foco agora confere a área útil antes de reposicionar um controle; o teste continua usando cliques reais sem força.

A inspeção das capturas também encontrou a animação legada de contagem mostrando peso/calorias intermediários. Os indicadores agora mantêm os valores exatos desde o primeiro quadro e recebem somente uma transição visual de chegada. Teste cobre integridade do texto e preferência de movimento reduzido. A sessão de teste usa peso fictício; não confundir as capturas com dados reais do proprietário.

Árvore refinada: 5676b18e570ea10beec634df5eea94e09791127b. Aguardar a aceitação final dessa revisão antes da integração.

## Resultado final integrado

PR #34 integrado como a00f95a841cd59a28e598d5594b8fcc4c4937f50. Execução em main: https://github.com/AtlasEvermore/nutripilot/actions/runs/40429441771 , 166 verificações aprovadas: 85 aplicativo com PostgreSQL real, oito trava, três configuração nativa, dez rotina de verificação de assinatura e 60 navegadores. Isso não gera ou revalida o IPA de loja. Sem vulnerabilidades reportadas. O caso de toque WebKit que falhava passou sem cliques forçados.

Imagem imutável: ghcr.io/atlasevermore/nutripilot@sha256:afe4c2203a8cf219c9c5ce719ca5fa4b6972623e8388203d407f4e7639515fd2 , smoke 18.1.0 sem issues. Árvore final da aplicação: 5676b18e570ea10beec634df5eea94e09791127b. NativeTree preservado.

Em 2026-10-27T00:51:43.498Z, a candidata iniciou contra nova restauração isolada do snapshot antigo de 2026-10-26T02:18:56.327Z: cinco arquivos, smoke aprovado, originais byte a byte idênticos após encerramento. Nenhum formato de dados ou backend modificado. O ensaio não renova a idade do backup.

Capturas reais finais examinadas: principal com Nutrição/Movimento, navegação, painel diário, plano alimentar, receitas, treino, sono, menopausa, progresso, perfil e configuração. Artefato: https://github.com/AtlasEvermore/nutripilot/actions/runs/40428912230/artifacts/12701157815 . A sessão fictícia de identidade serve somente para avaliar a interface; a API independente continua rejeitando acesso sem credencial válida. Não comprova assinatura comercial, testes em aparelho físico, aprovação de loja ou consumo remoto.

Nenhuma alteração em produção, dados, domínio, volume, segredos ou planos de cobrança. Nenhum crédito comprado ou nova imagem gerada. Respeitar as pendências e as duas fases de AGENTS.md; imagem construída não é site publicado.

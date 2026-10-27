# NutriPilot — experiência orbital

Refatoração da apresentação no projeto existente, sem alterar backend, dados, planos, valores comerciais ou contratos das lojas. Nenhuma implantação autorizada por esta revisão.

## Organização

Apps passa a apresentar a proposta com tipografia ampla, composição orbital e ações reais. Os nove módulos ficam organizados em Nutrir, Mover e Recuperar, com filtros locais que preservam foco de teclado e não consomem provedor remoto. Cada módulo continua com suas seções próprias. Sua apresentação explica o benefício e os recursos, substituindo a caixa genérica de acesso sobre fundo borrado. Recursos protegidos continuam protegidos pelo servidor.

Planos passa a separar introdução, período, Kit completo e comparação. Cada cartão é uma escolha explícita; detalhes de cálculo permanecem recolhidos. A seleção mensal agora é preservada até a confirmação, corrigindo a troca involuntária para anual. Nenhuma compra é feita apenas ao navegar ou escolher a apresentação do plano; confirmação e validação existentes permanecem. Valores/ofertas ficam em Planos e confirmação.

Profundidade azul-escura, verde cítrico e ciano; melhor hierarquia, espaçamento e legibilidade; movimentos apenas de transformação e com suporte a redução de movimento e aparelhos modestos. Imagens locais existentes reutilizadas. Sem compras de créditos ou geração de novas imagens. Novos textos traduzidos nos 14 idiomas, incluindo francês de origem.

## Verificação pendente de CI

Sintaxe e suíte local: 71 aprovados, um PostgreSQL real omitido por ausência de banco local. CI deve executar PostgreSQL e 48 verificações de navegador: rotas em quatro idiomas, filtros, escolha mensal, limites de layout entre 320 e 1440 pixels e redução de movimento. As capturas usam somente dados fictícios e serão examinadas antes da entrega. A revisão visual pode exigir ajustes; não tratar código escrito como aceitação concluída.

Árvore inicial da aplicação: b416428c0108319116af08b091f03711574125d4. Evidências de CI/restauração reabertas no manifesto. NativeTree preservado; nova árvore de interface não é publicação da loja. Respeitar AGENTS.md e as duas fases da trava.

## Ajustes após revisão visual

Planos traz o valor e a escolha antes do detalhamento, recolhe país/moeda sem perder o estado dos controles e remove o aviso redundante de bloqueio nessa rota. Entrar pela apresentação de um módulo mantém seu contexto e destaca a opção correspondente. A confirmação mostra o nome do plano escolhido; alternativas ficam sob demanda. A prévia agora usa uma estrutura vazia e a introdução do módulo, sem construir a tela restrita por trás: menos DOM e processamento ao explorar.

As duas rodadas anteriores passaram pela regressão real e pelos 48 casos de navegador. A árvore refinada final 12b6ca5c62cef4fa311941ca810a8c336099c7e9 exige a última execução e inspeção das suas capturas. Nenhum requisito operacional de publicação foi dispensado.

# Candidata consolidada 18.1.0 — lançamento controlado

Escopo vigente em 24/10/2026: App Store e Google Play. Nenhum checkout externo ou redirecionamento de pagamento. Rotas legadas de compra foram removidas; os registros existentes não foram apagados. Antes do corte, revisar permissões antigas e suporte aos clientes existentes sem conceder vendas externas novas.

O funil é: conhecer os recursos → escolher uma fórmula confirmada pela loja → confirmar e-mail → compra da loja → validação da conta e assinatura no servidor → uso e acompanhamento → gerenciamento/restauração pela loja. Sem produtos confirmados, exibir indisponibilidade e tentar novamente, sem preços ou teste grátis inventados.

## Proteção de consumo e dados

Análises desativadas por padrão (`AI_ENABLED=false`). Visitantes sem consumo pago por padrão (`AI_ALLOW_GUESTS=false`, `FREE_SCANS=0`). A API valida acesso; controles locais não concedem assinatura. Limites globais persistentes por dia/mês, por usuário e concorrência incluem as tentativas repetidas. São limites de requisições, não um teto financeiro exato; medir tokens e custos antes de definir oferta/orçamento. Não comprar créditos, alterar planos ou habilitar recarga automática sem orçamento.

Registro manual, cálculos, biblioteca e ajuda local não dependem de inferência. Nenhum novo prestador gratuito foi ativado: gratuidades podem ter limites e condições incompatíveis com dados de saúde. Saldo, modelo e autorização para testes reais ainda devem ser conferidos por último, conforme instrução do proprietário.

Fotos e mensagens exigem autorização explícita, identificando OpenAI e os dados enviados. Linguagem comercial usa análise de refeições, coach e plano personalizado. Não ocultar o prestador na privacidade nem falsificar declarações das lojas.

## O que a candidata verifica

Testes automatizados cobrem falhas de foto/chat, isolamento de conta, validade e fonte da assinatura, corrupção e persistência de dados, backup/restore sintético, limites de consumo e bloqueios de publicação. Eles não substituem backup dos dados reais, aparelhos físicos, entrega de e-mail, compra sandbox nem aprovação das lojas.

O doctor nativo falha se faltarem projetos, versão, número de build ou configurações. A geração e configuração dos dois projetos foram verificadas em cópia temporária. Não foram produzidos binários assinados. Codemagic está configurado apenas para gerar artefatos; não inicia ou distribui automaticamente.

## Publicação

Respeitar AGENTS.md, RELEASE_CHECKLIST.md e readiness.json. `prepare` exige evidências atuais e a árvore exata da aplicação e do shell nativo. Builds podem ser preparados antes; deploy/produção e distribuição ficam bloqueados até os requisitos reais passarem. O manifesto registra atestações e referências, não verifica sozinho assinatura ou aprovação nos sistemas externos.

A automação existente pode verificar a liberação e executar o deploy autorizado quando todos os requisitos passarem. Não há envio automático às lojas sem contas, artefatos e validação. Implantar somente a candidata consolidada mais recente; nunca publicar versões intermediárias em sequência.

## Preparação para múltiplas instâncias na 18.1.0

O backend PostgreSQL é opcional e usa transações, dados por conta, lista de interessados por pessoa, limites compartilhados e consumo único de códigos. O padrão continua em arquivos; nenhuma migração de produção foi executada. Seguir POSTGRES_CUTOVER.md antes de ativar, inclusive backup específico do banco e teste de carga. Não ampliar réplicas no modo de arquivos nem declarar capacidade mundial com base apenas nos testes de integração.

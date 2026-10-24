# NutriPilot 18.0.2 — estabilidade e capacidade de lançamento

## Correções verificadas em 24/10/2026

- Consultas concorrentes de configuração compartilham uma única busca de câmbio. Falhas externas têm espera de 60 segundos antes de nova tentativa; a configuração permanece disponível. Respostas HTTP inválidas e valores não finitos são rejeitados.
- Consultas concorrentes de saúde compartilham a verificação de dados em andamento. O arquivo de teste usa um identificador único. Não há cache temporal que esconda corrupção descoberta depois da resposta anterior.
- Controle de requisições mantém no máximo 10.000 identidades em memória. Ao atingir a capacidade, recusa novas identidades sem apagar os limites ativos de outras pessoas. A limpeza sob pressão ocorre no máximo uma vez por segundo; não há varredura completa a cada tentativa.
- A imagem instala sem scripts de dependências, auditoria remota ou consultas de financiamento durante a construção. Auditoria de segurança e aprovação de código são verificações separadas; não são substituídas por essa opção de build.

55 testes aprovados localmente: 44 do aplicativo e componentes operacionais, 8 da trava e 3 da configuração nativa. Os novos cenários incluem 128 consultas de saúde concorrentes, 40 configurações concorrentes e 20.000 tentativas de novas identidades com tabela de teste cheia. Testes locais são sintéticos; não equivalem a usuários simultâneos reais nem a ensaio de carga da infraestrutura Railway.

## Limites reais

O backend atual usa arquivos JSON e um único processo/volume. As filas de escrita e limites de consumo valem nesse processo. Não habilitar réplicas com cópias independentes de dados ou contadores: isso pode causar divergência de assinaturas e exceder limites de uso.

Antes de expansão horizontal, migrar assinaturas, estados e eventos que exigem consistência para armazenamento compartilhado transacional, com migração reversível ensaiada em cópia dos dados reais. Usar contadores atômicos compartilhados para limites e idempotência, limites de conexões e concorrência e fila para trabalho demorado. A escolha/provisão de serviços depende de orçamento autorizado; nenhum foi contratado nesta revisão.

Dimensionar com usuários simultâneos, requisições por segundo, tamanho dos estados, latência p95, taxa de erros e custo por assinante. Meta de receita não comprova capacidade técnica. Ensaiar a carga esperada e margem de segurança em ambiente isolado com dados sintéticos, sem chamadas pagas de análise. Registrar resultados e limites de operação antes de ampliar campanha.

## Condições para lançar

Continuam obrigatórios AGENTS.md, RELEASE_CHECKLIST.md e readiness.json. A liberação geral anunciada pelo Railway não substitui a retirada da mensagem de pausa específica do serviço. Backup independente dos dados reais, restauração, e-mail, identidade legal, configuração/assinatura dos aplicativos, testes de compra e aprovação das lojas ainda exigem evidência própria.

Uma imagem construída e testada é um artefato de publicação; não significa que o backend ou os aplicativos foram publicados. Manter o consumo protegido e o orçamento sob aprovação do proprietário.

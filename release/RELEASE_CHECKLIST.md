# NutriPilot — requisitos obrigatórios para publicar

Política de consumo, checkout e publicação condicional: [CONTROLLED_LAUNCH.md](CONTROLLED_LAUNCH.md).

Acompanhamento central: https://github.com/AtlasEvermore/nutripilot/issues/5

**Decisão atual: publicação bloqueada.** A preparação do código pode continuar; o site não deve ser declarado pronto enquanto as duas fases abaixo não forem comprovadas.

Escopo atual: App Store e Google Play, exclusivamente, com backend compartilhado. Publicar o backend não equivale a publicar nas lojas. Não inventar dados legais, contas, créditos, backups, artefatos assinados nem testes reais.

## Versões: preparada é diferente de publicada

| Estado observado | Situação |
|---|---|
| Produção | V12.0.0, implantação antiga ainda ativa |
| Candidata consolidada | V18.0.2, inclui as melhorias anteriores |
| Testes do código e da imagem | Aprovados antes desta trava operacional |
| Credenciais novas OpenAI e Resend | Guardadas na configuração; ainda não aplicadas ao processo antigo |
| Publicação automática pelo GitHub | Desativada; ambiente desconectado da branch |
| Wait for CI no Railway | Preparado em patch; ainda não confirmado ativo |
| Dados reais e recuperação independente | Sem evidência de backup externo/restauração concluídos |

A candidata deve ser obtida da revisão atual do GitHub, com imagem imutável por SHA/digest. Não implantar V13, V14… individualmente. Conferir o histórico e validar eventuais mudanças de formato antes do salto da V12.

Prioridade definida pelo proprietário: corrigir e proteger os dados primeiro; avaliar créditos/alternativas de IA por último, sem compras automáticas. A publicação será diretamente da candidata consolidada mais recente, mantendo as versões intermediárias apenas no histórico.

## Fase 1 — antes de implantar (`prepare`)

Todos os itens bloqueiam a publicação até existir evidência válida em `release/readiness.json`.

- [ ] **Acesso e continuidade da hospedagem:** Railway confirma liberação; confirmar duração/plano/saldo do serviço. Não presumir que upgrade resolve o bloqueio. Caso haja migração, servidor e domínio devem estar prontos e sob controle do proprietário.
- [ ] **Backup independente dos dados reais:** incluir permissões de compra e estados de usuários; criptografar; armazenar fora do Railway; guardar chave de recuperação em local independente. Uma cópia só no mesmo volume não atende este requisito.
- [ ] **Ensaio de restauração:** baixar o backup e recuperar em destino isolado; conferir contagens, permissões de compra e refeições. Medir tempo de recuperação. Não usar apenas os testes sintéticos como prova.
- [x] **Novas credenciais guardadas:** OpenAI limitada à Responses API; Resend limitada ao envio pelo domínio verificado. A gravação foi confirmada pelo Railway. Isso não prova a ativação no processo em produção nem conclui a revogação das antigas.
- [ ] **IA e despesas:** saldo positivo, modelo configurado, limites/alertas revisados e teste autorizado com a credencial nova. Definir orçamento com o proprietário. Não estimar quantidade de análises sem medir consumo real.
- [ ] **Entrega real de e-mail:** código de acesso chega a uma conta de teste autorizada; confirmar remetente, domínio, prazo e reenvio. Teste de permissão da chave não comprova entrega.
- [ ] **Dados legais e privacidade:** preencher dados reais da empresa, suporte e políticas; conferir exclusão/retensão de dados e consentimento do coach.
- [ ] **Retorno e compatibilidade:** selecionar revisão saudável, preservar dados, ensaiar leitura de estado anterior na candidata e documentar qualquer transformação. Rollback de imagem não restaura automaticamente dados.
- [x] **Trava de CI preparada:** patch Wait for CI revisado; testes e construção da imagem são necessários. Confirmar ativação efetiva após a primeira implantação dessa proteção.
- [x] **Vencimento da chave:** aviso de renovação preparado antes de 21/01/2027. Manter a validade sob acompanhamento após futuras trocas.
- [ ] **Configuração nativa:** contas de loja, RevenueCat, produtos e assinatura configurados; IPA/AAB assinados da revisão candidata com evidência.

## Como registrar a evidência

1. Executar a verificação real; não antecipar aprovação.
2. No item correspondente do manifesto, definir `status: verified`, data/hora ISO com fuso em `verifiedAt`, responsável em `verifiedBy` e uma ou mais referências em `evidence`.
3. Referências podem apontar para execução de CI, ticket, relatório privado ou comprovante de teste. Nunca colocar segredos ou dados de clientes no repositório público. A referência registra onde a prova está; a trava não consulta sozinha esses sistemas.
4. Confirmar a versão e `applicationTree` com `git rev-parse HEAD:nutripilot-france-hotmart-final-v4`. Conferir também `nativeTree` com `git rev-parse HEAD:native`. Mudança no código da aplicação invalida o vínculo da evidência; revisar o que precisa ser testado outra vez antes de atualizar o hash.
5. Executar `node ops/release-gate.mjs prepare`. Saída diferente de zero significa **não implantar**.

A trava também recusa código da aplicação alterado ou novo fora da revisão Git aprovada, evidência ausente, antiga, com data futura, sem responsável, com possível segredo ou vinculada a outra árvore da aplicação. Os prazos são por requisito: backup prévio de até 8 horas; restauração ensaiada em até 30 dias; acesso e saldo conferidos em até 24 horas.

## Ordem da implantação

1. Encerrar a Fase 1 e guardar a referência da última implantação saudável e do backup.
2. Conferir a candidata exata e os resultados dos testes. A imagem pronta deve corresponder à candidata aprovada.
3. Revisar todas as mudanças pendentes no Railway. Aplicar somente o conjunto autorizado, incluindo Wait for CI se ainda estiver preparado.
4. Aguardar SUCCESS. Não confundir pedido aceito, build iniciado ou imagem enviada com implantação concluída.
5. Conferir `/api/health`: versão, revisão, dados persistentes e integridade. Executar o smoke test da candidata.
6. Validar a nova autenticação com os provedores e encerrar as credenciais antigas. Fazer a transição antes de permitir consumo sem controle de chaves potencialmente expostas.
7. Executar a Fase 2. Se falhar, seguir o plano de retorno e investigar; não anunciar o lançamento como concluído.

## Fase 2 — aceitação após implantar (`launch`)

Estes itens são posteriores à implantação: exigi-los como pré-condição da primeira implantação criaria uma trava impossível de satisfazer.

- [ ] **Versão real:** implantação SUCCESS e versão/revisão exatas respondendo no domínio.
- [ ] **Credenciais aplicadas:** provar que o processo novo usa as credenciais substitutas.
- [ ] **Foto e chat reais:** foto reconhecida com revisão de dados; erro/repetição sem perda de análise gratuita; conversa com histórico; falha honesta sem resposta inventada.
- [ ] **Login e persistência:** e-mail chega; login funciona; dados persistem ao sair/entrar e sincronizam entre dispositivos; exclusão de conta validada em conta própria de teste.
- [ ] **Revogação coordenada:** encerrar chaves antigas somente com plano de continuidade e substitutas testadas; registrar a verificação sem publicar os valores.
- [ ] **Backup automático externo:** upload recente, retenção e recuperação conferidos; testar também falha/atraso e alerta. Backups locais sozinhos não atendem.
- [ ] **Alertas:** confirmar recebimento de incidente e recuperação. O workflow agendado não substitui teste de entrega da notificação.
- [ ] **CI ativa no Railway:** leitura de configuração confirma `source.checkSuites: true`.
- [ ] **Páginas legais:** conferir dados reais e rotas no domínio publicado.
- [ ] **Lojas:** compra, restauração, expiração e reembolso reais de teste em iOS/Android; aprovação e disponibilidade de cada loja confirmadas antes de anunciar.

Executar `node ops/release-gate.mjs launch` e guardar o resultado junto da implantação. Só depois marcar o lançamento como concluído.

## O que fica bloqueado agora

O manifesto começa com os itens não comprovados em `pending`. O workflow **Production release gate** deve falhar enquanto eles estiverem pendentes; isso é uma restrição intencional de publicação, não falha dos testes do aplicativo.

O GitHub continua permitindo revisão de código e construção/teste da imagem. A publicação automática no Railway foi desativada: o ambiente está desconectado da branch. Só reconectar após a Fase 1 passar e com Wait for CI revisado. A proteção de CI ainda precisa ser aplicada e confirmada; até lá, manter implantação manual com a verificação local obrigatória em `AGENTS.md`. Não há proteção contra um administrador que ignore deliberadamente as regras ou desative controles.

Novos segredos, dados de saúde e arquivos de backup nunca devem ser anexados à issue de liberação.

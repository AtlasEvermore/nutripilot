# NutriPilot 18.1.0 — armazenamento compartilhado opcional

Esta candidata acrescenta PostgreSQL. Não foi criado banco, alterado plano nem migrado dado de produção. O modo padrão continua `STORAGE_BACKEND=files`, com uma instância. Somente a candidata mais recente deve ser publicada; revisões intermediárias ficam no histórico.

## O que muda com PostgreSQL

- Assinaturas e códigos de acesso ficam em registros por conta. Operações concorrentes usam transações e bloqueio por registro; contas diferentes não disputam um único arquivo global.
- Estados dos usuários ficam em registros próprios. Gravação de estado e exclusão coordenam o bloqueio da conta para impedir recriação do estado depois da exclusão.
- Códigos de login e estados OAuth são consumidos uma vez entre instâncias. O webhook encontra contas de loja por índice, sem carregar toda a base de assinaturas.
- Limites de requisições e tentativas de análise passam a ser compartilhados e atômicos. As vagas de concorrência usam leases de cinco minutos para recuperação após interrupção de um processo. Tentativas já consumidas não são devolvidas ao encerrar a vaga.
- Contadores do funil são combinados em transação. Recursos legados de lista de interessados e análises gratuitas mantêm registros compartilhados serializados; isso preserva consistência, mas não representa capacidade ilimitada de escrita.
- O pool é limitado a cinco conexões por processo por padrão (máximo configurável 20), com espera/consultas limitadas. Dimensionar o total `réplicas × pool` conforme o banco e a carga. TLS com validação de certificado é obrigatório em produção; forneça CA confiável por arquivo quando necessário.
- O servidor não cria tabelas nem importa dados ao iniciar. Configuração de banco incompleta ou sem marcador de importação causa falha de inicialização; não há retorno silencioso para arquivos vazios.

## Sequência obrigatória antes de ativar

1. Cumprir AGENTS.md e a fase prepare. Obter backup criptografado independente dos dados reais e verificar sua restauração. Registrar evidência real, sem anexar segredos ou dados de saúde ao GitHub.
2. Escolher um banco privado sob controle do proprietário e orçamento autorizado. Não expor uma porta pública desnecessária; restringir permissões, TLS, retenção e acesso aos backups. Nenhuma contratação é automática.
3. Usar banco isolado para ensaiar primeiro. Preparar o schema explicitamente com `npm run database -- schema --apply`, fornecendo DATABASE_URL em ambiente seguro e DATABASE_CA_FILE quando necessário. Não usar parâmetros SSL na URL que substituam a validação.
4. Suspender gravações na origem para o corte e obter a cópia final. Importar o backup criptografado verificado com `npm run database -- import CAMINHO_BACKUP --apply --offline-backup-verified`, fornecendo BACKUP_KEY_FILE. Esse sinalizador é uma confirmação operacional, não prova automática de backup ou de paralisação da origem. O destino deve estar vazio. A importação é atômica, recusa caminhos inesperados e não apaga os arquivos originais.
5. Conferir contas, assinaturas, estados e contadores na cópia importada, incluindo compra/restauração, código de login, exclusão e reinício de processos. Nunca testar com cobranças ou análises pagas sem orçamento.
6. Configurar `STORAGE_BACKEND=postgres` somente depois da importação e dos testes. Executar prepare na revisão exata antes do deploy. Subir primeiro uma instância, confirmar versão, saúde, código, persistência e compras. A habilitação de PostgreSQL não resolve o bloqueio de deploy do Railway nem a aprovação das lojas.
7. Configurar e testar backup independente do PostgreSQL (por exemplo exportação compatível pelo provedor/pg_dump), criptografia, retenção, restauração e alerta. O backup de arquivos do aplicativo é desativado no modo PostgreSQL; o health informa `requiresDatabaseBackup:true`. Não apresentar uma cópia dos arquivos antigos como backup do banco novo. Antes de declarar pronto, a verificação operacional deve comprovar os backups do banco; a atual verificação automática recusa esse estado ainda não configurado.
8. Só então ampliar réplicas e tráfego após ensaio de carga com metas de usuários simultâneos, p95, taxa de erros e orçamento. Os testes com dois processos comprovam comportamentos específicos, não capacidade mundial ou meta de receita.

## Retorno

Preservar a origem, a revisão anterior e os backups. Depois que o banco novo receber gravações, voltar a arquivos antigos perderia essas alterações. Planejar e testar exportação/restauração compatível antes do corte; nunca alternar automaticamente a variável para `files` durante um incidente.

## Validação em CI

O workflow de código usa PostgreSQL 17 isolado, com dois pools e dois processos do aplicativo. Verifica concorrência de escrita, rollback, bloqueio por conta, limites compartilhados, vagas expiradas, importação, leitura entre processos, código de login usado uma vez, compra/webhook e exclusão. O banco de CI é descartável, com dados sintéticos e sem acesso à produção.

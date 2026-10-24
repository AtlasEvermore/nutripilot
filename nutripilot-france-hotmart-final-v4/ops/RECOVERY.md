# NutriPilot: operação e recuperação

## Estado verificado em 24/10/2026

A versão 18.0.1 foi integrada no GitHub e a imagem passou na CI. A candidata consolidada 18.0.2 inclui backups, proteção contra corrupção, diagnóstico, monitoramento e correções de concorrência. Não publicar versões intermediárias. O Railway ainda bloqueia novas publicações; a produção foi observada em 12.0.0. Não confundir código aprovado com implantação concluída.

O pedido de desbloqueio foi enviado ao suporte oficial. Não excluir o serviço, o domínio nem o volume `55b5791c-7889-4feb-bbac-992135e41252`, montado em `/data`.

`ACCESS_TOKEN_SECRET`, `OPENAI_API_KEY` e `RESEND_API_KEY` foram substituídos na configuração do Railway. As chaves de OpenAI e Resend têm escopo reduzido. O processo V12 em execução ainda não recebeu essas alterações; é necessário implantar, testar e encerrar as anteriores. A troca do Hottok da Hotmart permanece pendente. A criação de uma chave não revoga automaticamente a antiga. A IA retornou falta de créditos; não atribuir esse consumo ao incidente sem examinar o histórico do provedor.

## Credenciais e despesas

Para cada provedor, criar uma credencial substituta na conta correta, com o menor escopo disponível, guardar em um gerenciador de senhas, atualizar o Railway, implantar e testar. Em seguida revogar a antiga e conferir que já não funciona. Se houver uso indevido confirmado, priorizar a revogação imediata mesmo que cause indisponibilidade. Nunca colar chaves no chat, GitHub, logs ou chamados.

- OpenAI: revisar Usage, projetos e chaves; trocar a chave; configurar os controles de despesa disponíveis; verificar saldo e modelo. A assinatura ChatGPT não é crédito da API. Somente carregar saldo com valor explicitamente autorizado.
- Resend: revisar atividade e domínios; emitir chave restrita ao envio; testar entrega e login por código; revogar a antiga.
- Hotmart: coordenar a troca do Hottok no webhook e na aplicação; testar aprovação, duplicata, cancelamento e reembolso com eventos de teste. Não simular compra real de clientes.
- GitHub/Railway: revisar sessões, aplicativos, membros e alterações; ativar autenticação multifator e guardar códigos de recuperação. Não revogar a integração ativa sem alternativa de publicação.

## Backup independente

A interface atual do Railway informa que criar backups e agendamentos exige upgrade para Pro. Nenhum upgrade foi realizado. Não há confirmação de backup existente nessa interface.

O servidor novo cria um backup criptografado na inicialização e a cada 6 horas SE `BACKUP_ENCRYPTION_KEY` estiver configurada. Sem chave não cria cópias e o diagnóstico informa `enabled: false`. Confirma a gravação completa da nova cópia antes de remover as anteriores. Mantém até sete arquivos locais, com orçamento de 64 MiB e reserva de espaço livre; esses arquivos sozinhos NÃO protegem contra perda do provedor.

Configurar um bucket privado em conta independente do Railway com endpoint S3 compatível, acesso mínimo de gravação no prefixo `nutripilot/`, versionamento e política de retenção definida pelo responsável pelos dados. Os campos estão em `.env.example`. Armazenamento pode gerar cobrança; não provisionar sem verificar a conta e o custo. Uma credencial separada de leitura/recuperação deve ficar no gerenciador de senhas.

A chave de criptografia precisa de uma cópia independente no gerenciador de senhas. Perder essa chave torna os backups inutilizáveis. Não usar a chave das sessões como chave de backup.

```sh
node ops/backup-cli.mjs keygen /caminho/privado/nutripilot-backup.key
BACKUP_KEY_FILE=/caminho/privado/nutripilot-backup.key node ops/backup-cli.mjs create /copia-consistente-dos-dados /caminho/backup.npbak
BACKUP_KEY_FILE=/caminho/privado/nutripilot-backup.key node ops/backup-cli.mjs verify /caminho/backup.npbak
BACKUP_KEY_FILE=/caminho/privado/nutripilot-backup.key node ops/backup-cli.mjs restore /caminho/backup.npbak /caminho/novo-diretorio
```

Executar os comandos no diretório da aplicação. O destino da restauração deve ser novo: o comando recusa sobrescrever diretórios existentes. A integridade de todo o arquivo é validada antes de escrever. Backups incluem permissões de compra e estados de usuários, sem variáveis de ambiente. Guardar a configuração secreta separadamente.

Cada arquivo JSON é lido integralmente e precisa estar válido. A cópia não é uma transação conjunta entre vários arquivos: para migração definitiva, suspender gravações e gerar uma cópia final com o serviço parado. Limite atual de dados por snapshot: 128 MiB; se exceder, o backup falha visivelmente e deve ser substituído por uma solução de streaming/banco antes de aumentar a carga. A retenção pode cair abaixo de sete cópias para respeitar o orçamento local; o volume atual tem 500 MB. Monitorar capacidade; não aumentar automaticamente com cobrança.

A configuração só estará validada quando houver upload real, download com credencial independente e restauração em ambiente isolado, comparando compras e refeições. O teste automatizado usa dados sintéticos: não comprova um backup da produção.

## Monitoramento

`Production health` roda pelo GitHub Actions a cada 30 minutos, sujeito a atrasos/limites do GitHub. Abre uma única issue operacional e a fecha quando os testes recuperam. O proprietário deve habilitar notificações de Issues/Actions para receber avisos. Não existe garantia de alerta instantâneo nem um monitor independente do GitHub.

Verifica versão publicada, scripts, WASM, páginas legais, configuração de provedores, erros de IA já observados e backup externo recente. Não gasta crédito com chamada sintética de IA e não confirma entrega de e-mail. Estado `unchecked` significa IA ainda não testada naquele processo. Alertas de saldo devem ser configurados no próprio provedor. Falha de autenticação/crédito pausa chamadas de IA por 60 segundos, sem repetir cobrança impossível.

## Publicar e restaurar versão

1. Rodar `npm run check` e `npm test`. A CI impede publicar a imagem se esses testes falharem.
2. Usar imagem GHCR por SHA ou digest imutável. Guardar o identificador da última versão saudável.
3. Antes de trocar servidor/volume: copiar os dados e validar o backup.
4. Implantar e aguardar estado terminal SUCCESS no Railway. Conferir `/api/health`, versão e revisão. `node ops/smoke.mjs` faz a verificação pública.
5. Testar em conta própria: código de login e e-mail; texto e foto reais; código de barras; conversa de várias mensagens; persistência após sair/entrar; restauração de compra em ambiente de teste da loja/Hotmart; cancelamento/reembolso; exclusão de conta.
6. Se falhar, retornar à imagem saudável sem apagar volume nem sobrescrever dados. Rollback de imagem não é rollback de dados; mudanças futuras de formato exigem plano de migração próprio.

## Migrar para outra hospedagem

A imagem Docker é portátil; `compose.recovery.yml` prepara execução em host Docker existente com os dados restaurados, sem contratar uma plataforma nova. Exige Docker Compose atual, proxy HTTPS, controle do DNS e capacidade adequada. A porta é vinculada somente a localhost; o proxy publica HTTPS.

- Restaurar cópia em diretório novo no servidor alternativo e preencher `.env` fora do Git.
- Definir `NUTRIPILOT_IMAGE` com SHA/digest aprovado e `NUTRIPILOT_DATA_DIR` com caminho absoluto restaurado.
- Executar `docker compose -f compose.recovery.yml config --quiet` e `docker compose -f compose.recovery.yml up -d`.
- Testar o host alternativo antes de mudar DNS. Não executar dois servidores gravando cópias diferentes dos dados; não há replicação ativa entre eles.
- Suspender gravações na origem, restaurar cópia final, testar, apontar DNS, confirmar certificados e webhooks. Manter a origem preservada até a aceitação da migração.

Não foi feita migração real, mudança de DNS ou recuperação de dados reais. Essas etapas dependem de acesso autenticado ao volume, armazenamento independente e servidor de destino. Objetivo operacional proposto: cópia a cada 6 horas; tempo de recuperação só pode ser declarado depois de um ensaio real medido.

## Prioridade e acesso aos dados reais

Créditos e comparação de alternativas de IA ficam por último, conforme a orientação do proprietário. Nenhuma compra ou recarga foi autorizada. Isso não impede corrigir e testar o código com provedores simulados. A IA real continua dependendo de configuração e capacidade disponíveis.

O domínio confirmado no Railway é `app.atlasevermore.com`, com DNS propagado e certificado válido. O nome diferente informado por voz/texto não foi aplicado ao DNS. O teste pessoal do proprietário pode ser feito depois; a aceitação técnica em produção continua obrigatória antes de declarar a publicação concluída.

O painel Console foi consultado e informou `No running instances` / `Disconnected` para acesso remoto. A instalação alternativa do CLI falhou ao baixar o binário oficial por timeout de rede. Isso não comprova perda dos dados ou queda do site; apenas impede a exportação nesta sessão. O volume /data foi preservado. Nenhum backup real foi baixado ou enviado por e-mail.

Para exportar sem depender de uma nova implantação, usar uma sessão Railway CLI/SSH autenticada: a documentação oficial permite SFTP/SCP do volume em https://docs.railway.com/cli/ssh#copy-files-with-scp-and-sftp . Gerar uma cópia consistente, criptografar e baixar, depois ensaiar a restauração em diretório novo com o utilitário deste repositório. Não copiar segredos antigos do painel para obter acesso. Não publicar os dados no GitHub nem encaminhar dados de saúde sem criptografia.

Um ZIP do código é uma cópia do aplicativo e das instruções de recuperação; não contém refeições, usuários, permissões de compra nem credenciais da produção. Ele não deve ser usado como prova de backup dos dados reais.

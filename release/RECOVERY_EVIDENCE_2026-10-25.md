# Recuperação real renovada — 25/10/2026 (Brasília)

- Novo snapshot real de /data criado em 2026-10-26T02:18:56.327Z (25/10, 23:18 em Brasília), pela rotina restrita já existente no console autenticado do serviço.
- Cinco arquivos JSON de estado permitidos, sem variáveis de ambiente ou chaves de provedores. Duas leituras consecutivas idênticas; arquivos regulares, ausência de symlinks e limite de tamanho conferidos.
- NPBACKUP1, AES-256-GCM e gzip; 5430 bytes; SHA-256 22edd6a21dc2d15293cc40847fa37d19da957dfcf90c8fb1ce642b43554e04d8.
- Snapshot e chave transferidos separadamente pelo gerenciador de arquivos do console. Hash conferido fora do Railway; descriptografia autenticada e restauração de cinco arquivos concluídas.
- Candidata consolidada daddab15c145eb4a37144b033bb1cf607091e0eb, applicationTree 6f5d75bb5f4f0a02d5e08707f06ae27fe3ca0959: iniciou com a nova restauração isolada, health ok=true e versão 18.1.0; seis rotas públicas HTTP 200. Os cinco arquivos permaneceram byte a byte idênticos após encerrar a candidata. Nenhuma chamada paga ou alteração em produção.
- Pacote criptografado e chave guardados duravelmente em arquivos privados separados do proprietário. Não publicar referências de acesso, conteúdo de clientes ou chave no GitHub.

Esta cópia renova apenas o backup e seu ensaio de restauração. A validade máxima pré-deploy continua em oito horas; não equivale a backup automático recorrente. Preservar o volume e a referência V12 saudável conforme o plano anterior. A publicação continua sujeita às demais exigências do manifesto.

# Recuperação real verificada em 24/10/2026

O console do Railway voltou a apresentar Connected para a instância existente após o proprietário ativar Hobby. Isso não é prova de deploy da candidata. Produção segue V12, volume e domínio preservados.

## Backup e restauração

- Snapshot real de /data em 2026-10-24T23:00:42.822Z, cinco arquivos de estado permitidos, sem variáveis de ambiente nem chaves de provedores.
- Duas leituras completas consecutivas produziram conteúdo idêntico; nenhum arquivo de origem foi modificado. JSON, nomes permitidos, arquivos regulares e limite de tamanho validados.
- Arquivo NPBACKUP1, AES-256-GCM, gzip, 5428 bytes. SHA-256 c34839ca3767d46d780c3be2f212f2389a413ef95916a0f1397731b98f411a0a.
- Cópia baixada pela transferência segura do console para fora do Railway. Hash conferido no destino, descriptografia autenticada e restauração em diretório privado isolado; todos os conteúdos e hashes conferidos.
- Pacote criptografado e chave de recuperação salvos como arquivos privados separados do proprietário. Referências de acesso e conteúdo de clientes não são publicados aqui. Não incluir o backup no GitHub.

## Compatibilidade e retorno

- A candidata 18.1.0, revisão 78a73607b417667086614780fd61b7bb2dc016c8, iniciou com essa restauração e respondeu health HTTP 200, ok=true e armazenamento gravável. Nenhuma credencial externa fornecida; análises pagas desativadas.
- Todos os arquivos originais permaneceram byte a byte idênticos após encerramento normal da candidata. Modo files mantido; nenhuma migração PostgreSQL realizada.
- A revisão V12 fd3d9d8927f85adfe83fc31975f3878de73c580b também iniciou outra restauração isolada e respondeu health ok=true, versão 12.0.0, sem credenciais externas.
- Retorno operacional: preservar referência da implantação 2705400c-590b-4c47-bd81-4cd1759ab31b e seu volume; em falha da candidata, suspender alterações, investigar e selecionar a revisão anterior apenas após conferir compatibilidade dos dados mais recentes. Nunca restaurar dados automaticamente ou sobrescrever /data. O ensaio cobre a cópia atual, não alterações futuras.

## Limites desta evidência

Não comprova entrega de e-mail, uso dos novos segredos em produção, orçamento/modelo, identidade legal, compras nas lojas, assinatura de IPA/AAB nem aprovação de distribuição. Não configura backup externo recorrente. A trava prepare continua obrigatória; não publicar enquanto qualquer requisito falhar. Repetir o snapshot se expirar sua validade de oito horas antes da implantação.

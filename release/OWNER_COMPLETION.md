# NutriPilot — completar os dados do proprietário

## Já preparado

- Aplicativo: NutriPilot, candidata consolidada 18.1.0.
- Identificador nativo existente: com.atlasevermore.nutripilot. A disponibilidade/registro deste identificador ainda depende das contas das lojas.
- Backend: https://app.atlasevermore.com, porta 8080, volume /data, uma instância com arquivos; nenhum banco adicional provisionado.
- Contato conhecido do proprietário: rafabalves@hotmail.com. Conta Railway: rafabalves@gmail.com.
- Patch Railway 9c88b850-a293-41fc-83ec-000d3cd03de9: Wait for CI e variáveis de operação, contato e proteção preparados, sem aplicar nem implantar.
- Compras externas desativadas; análises pagas e uso por visitantes desativados, limites globais zero enquanto não existir orçamento autorizado. Isso não ativa foto/coach pagos nem comprova configuração de cobrança.
- Backup real independente, restauração e ensaio V12/candidata concluídos. Conferir validade do snapshot antes de publicar.

## Dados preparados em privado — confirmar, sem repetir o preenchimento

O nome legal conhecido e o endereço fornecido pelo proprietário já foram preparados nas variáveis privadas LEGAL_COMPANY_NAME e LEGAL_COMPANY_ADDRESS do patch Railway. Não reproduzir o endereço neste repositório. Em 26/10/2026, o proprietário confirmou os dados já fornecidos e autorizou seu uso público somente quando necessário. Usar exatamente os valores preparados em privado, sem acrescentar ou inferir complemento. Não solicitar novamente essa autorização. Evitar duplicação em configuração geral, telas comerciais e documentação pública; a configuração privada e as páginas legais ainda precisam de conferência operacional. Nenhum documento de identidade foi verificado por esse preenchimento.

O agente cuida da aplicação das configurações após as travas passarem. Não pedir ao proprietário para editar variáveis, certificados ou arquivos técnicos. Use owner-completion.env.example apenas como referência de campos; nunca envie o arquivo preenchido ao GitHub. Configuração preparada ainda não está aplicada ao processo V12.

## Completar diretamente nas plataformas

| Plataforma | O que o proprietário precisa fornecer/confirmar | O que ainda exige configuração técnica e testes |
|---|---|---|
| Apple Developer / App Store Connect | Tipo de conta adequado, nome legal, endereço, telefone e verificação exigida pela Apple; contratos e eventual pagamento apenas pelo proprietário | Registro do app, produtos reais, certificados/perfis e IPA assinado; compra/restauração em teste e revisão |
| Google Play Console | Tipo de conta adequado ao aplicativo, perfil de pagamentos e identidade/endereço verificáveis; documentos e contratos diretamente no Google | Registro do app, produtos reais, assinatura Android e AAB; testes, declarações de saúde/privacidade e revisão |
| RevenueCat | Conta/projeto sob controle do proprietário e conexão autorizada às lojas | Aplicativos, catálogo/entitlements, chaves públicas de cada plataforma, chave de servidor e webhook; validação/expiração/restauração testadas |
| Remetente de e-mail | Confirmar domínio/remetente e acesso à caixa de teste do proprietário | Envio real com a chave substituta e verificação de login; a integração atual só revela nomes de variáveis |

Não envie RG, CPF, foto de documento, cartão ou senha neste arquivo, no repositório ou em issue. Se uma plataforma pedir documento, use seu formulário oficial. Não basta preencher identidade para produzir assinatura, produtos e aprovação das lojas.

Referências oficiais consultadas em 24/10/2026:
- https://developer.apple.com/help/account/membership/identity-verification/
- https://developer.apple.com/help/account/membership/program-enrollment/
- https://support.google.com/googleplay/android-developer/answer/13628312?hl=pt-BR

## Compilação já concluída, acesso pessoal ainda necessário

Android e iOS foram compilados no workflow Native compilation, execução 40150909303: APK de depuração, AAB sem assinatura de distribuição e aplicativo iOS para simulador. São diagnósticos, não artefatos assinados de loja. Não é necessário contratar Codemagic para repetir esses testes.

A autenticação segura no RevenueCat não foi concluída; não criar conta nem repetir a solicitação recusada sem nova iniciativa do proprietário. As configurações de lojas e assinaturas continuam dependendo de acesso autorizado às contas. Não pedir senhas ou códigos no chat.

## Antes de aplicar

A publicação continua condicionada a AGENTS.md e ao manifesto readiness.json. Não marcar dados legais, entrega de e-mail, lojas, artefatos ou orçamento como verificados apenas por este guia existir. Executar prepare na candidata limpa; revisar o patch atual (18 mudanças observadas nesta revisão; conferir novamente antes de aplicar) e aplicar somente após todas as evidências exigidas. Não reconectar publicação automática nem ampliar recursos antes disso.

## Diretriz de consumo confirmada em 26/10/2026

O proprietário informou que não há orçamento garantido e delegou as escolhas operacionais. Isso não define um teto de gasto nem autoriza uma cobrança ilimitada. Manter AI_ENABLED=false, AI_ALLOW_GUESTS=false, limites globais diário/mensal iguais a zero e FREE_SCANS=0, sem comprar créditos, ativar recarga ou contratar serviços. Valores regravados no patch privado existente, sem implantar. Os recursos locais permanecem disponíveis; análise de fotos e coach remoto continuam indisponíveis. Não vender ou anunciar sua operação como concluída. A evidência de saldo/modelo/teste real continua pendente; a trava de lançamento não foi alterada.

O proprietário ficou responsável pela conexão bancária da Apple. Isso não comprova produtos, validação das assinaturas, contratos ativos, análise DSA ou disponibilidade da loja.

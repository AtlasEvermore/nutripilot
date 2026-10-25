# NutriPilot — completar os dados do proprietário

## Já preparado

- Aplicativo: NutriPilot, candidata consolidada 18.1.0.
- Identificador nativo existente: com.atlasevermore.nutripilot. A disponibilidade/registro deste identificador ainda depende das contas das lojas.
- Backend: https://app.atlasevermore.com, porta 8080, volume /data, uma instância com arquivos; nenhum banco adicional provisionado.
- Contato conhecido do proprietário: rafabalves@hotmail.com. Conta Railway: rafabalves@gmail.com.
- Patch Railway 9c88b850-a293-41fc-83ec-000d3cd03de9: Wait for CI e variáveis de operação, contato e proteção preparados, sem aplicar nem implantar.
- Compras externas desativadas; análises pagas e uso por visitantes desativados, limites globais zero enquanto não existir orçamento autorizado. Isso não ativa foto/coach pagos nem comprova configuração de cobrança.
- Backup real independente, restauração e ensaio V12/candidata concluídos. Conferir validade do snapshot antes de publicar.

## Preencher no Railway, em privado

Abra o serviço nutripilot → Variables. Complete LEGAL_COMPANY_NAME com o nome do responsável real e LEGAL_COMPANY_ADDRESS com o endereço completo real que você está autorizado a usar. O nome técnico da variável não obriga a possuir loja física. Não preencher com nome de fantasia ou endereço inventado para superar a trava.

O endereço informado pode ser usado nos textos legais publicados pelo aplicativo; confirme qual endereço pretende divulgar. Não deduzimos seu endereço a partir do e-mail e não temos um endereço confirmado.

Use owner-completion.env.example somente como lista de campos; não envie o arquivo preenchido ao GitHub. Não apague chaves existentes nem substitua valores por campos vazios. Configuração preparada não equivale a aplicação no processo V12.

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

## Antes de aplicar

A publicação continua condicionada a AGENTS.md e ao manifesto readiness.json. Não marcar dados legais, entrega de e-mail, lojas, artefatos ou orçamento como verificados apenas por este guia existir. Executar prepare na candidata limpa; revisar as 13 mudanças preparadas e aplicar somente após todas as evidências exigidas. Não reconectar publicação automática nem ampliar recursos antes disso.

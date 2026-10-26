# RevenueCat — validação de assinaturas no servidor

O servidor consulta apenas GET /v1/subscribers/{app_user_id}. A documentação oficial permite usar a chave pública SDK para essa consulta de estado: https://www.revenuecat.com/docs/customers/customer-info . Não criar uma chave administrativa V1 para esta finalidade.

## Configuração

- REVENUECAT_READ_KEY: chave SDK existente usada exclusivamente na consulta do servidor. Tem precedência sobre o nome legado REVENUECAT_SECRET_KEY, mantido apenas por compatibilidade.
- REVENUECAT_IOS_KEY: chave pública SDK fornecida ao aplicativo iOS.
- REVENUECAT_WEBHOOK_AUTH: segredo privado independente; o RevenueCat deve enviar Authorization: Bearer seguido desse valor. Não fornecer ao aplicativo cliente.

Os três parâmetros estão preparados no mesmo patch Railway, sem aplicar ou implantar. O webhook RevenueCat ainda não está criado/ativo: conectar somente após implantar e validar o endpoint atualizado. Não enviar eventos ao processo V12.

## Evidências realizadas em 25/10/2026 (Brasília)

- Consulta real ao RevenueCat com a chave SDK existente retornou HTTP 201 e CustomerInfo sem assinaturas para um identificador sintético exclusivo de configuração. Nenhum cliente real, pagamento ou compra foi utilizado. Isso verifica autenticação da API, não compra/restauração na App Store.
- Testes isolados verificam a nova variável sem segredo administrativo, sua precedência, compatibilidade legada, rejeição de tokens ausentes/falsos/de usuário, aliases inválidos, clientes não vinculados, recusa de acesso baseado no corpo de um evento, consulta autoritativa de renovação/expiração e preservação dos dados quando o provedor falha.
- A candidata leu uma restauração isolada do snapshot real de 24/10/2026 23:00:42Z: seis rotas HTTP 200 e os cinco arquivos permanecem byte a byte idênticos após encerrar o processo. Isso não renova a idade do snapshot nem modifica produção.

A publicação continua sujeita a AGENTS.md e ao manifesto de prontidão. Produtos, preços, compra/restauração reais, liberação da hospedagem e demais condições precisam de evidência própria.

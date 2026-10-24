# NutriPilot 18.1.0 — iPhone e Android

Candidata para App Store e Google Play. Compras digitais exclusivamente nas lojas; sem checkout externo. O backend em https://app.atlasevermore.com atende os dois aplicativos. Implantar o backend não publica os aplicativos nas lojas.

Uma conta com e-mail confirmado é necessária antes de comprar ou restaurar. O servidor valida a compra para o identificador da conta autenticada. Os preços e eventuais testes gratuitos vêm da loja; sem catálogo confirmado, a compra não é oferecida. Registro manual, biblioteca e ajuda local não fazem chamadas ao prestador de análise.

Antes de enviar fotos, mensagens e os dados de perfil necessários ao processamento, o aplicativo pede consentimento identificando OpenAI. A autorização pode ser retirada em Configurações › Análise personalizada. Não retirar informações verdadeiras da privacidade nem das declarações das lojas para mudar a linguagem comercial.

## Desenvolvimento e validação

Requisitos: Node 22+, ferramentas Android e Java compatíveis com o Capacitor instalado; Xcode em macOS para compilar iOS. Dependências resolvidas em package-lock.json; use npm ci.

```sh
cd native
npm ci
npx cap add android
npx cap add ios
npm run assets
npx cap sync
BUILD_NUMBER=1 npm run configure
BUILD_NUMBER=1 npm run doctor
npm test
```

O número 1 é apenas exemplo: use um número crescente confirmado no histórico das lojas. Para uma plataforma, passe --platform ios ou --platform android ao script configure-native.mjs. O doctor falha se projetos, permissões ou identidade de build estiverem ausentes; ele não verifica assinatura, compra real nem aprovação da loja.

Em 24/10/2026, a geração real dos dois projetos e a configuração foram verificadas em cópia temporária com build de exemplo. Nenhum IPA/AAB assinado ou envio à loja foi produzido nessa verificação. Os projetos são gerados pelo pipeline; não confundir fixtures dos testes com binários reais.

Codemagic está preparado para gerar artefatos assinados quando credenciais e orçamento forem disponibilizados. O arquivo não publica automaticamente nem inicia builds sozinho. As alterações remotas devem respeitar as regras de revisão das lojas; não existe autorização irrestrita para mudar todas as funcionalidades sem nova submissão.

Consulte store/GUIA-PUBLICACAO.md e ../release/RELEASE_CHECKLIST.md antes de distribuir.

# NutriPilot — app para iPhone e Android (Capacitor 8)

Esta pasta transforma o NutriPilot (servido em https://app.atlasevermore.com) nos apps da App Store e do Google Play.
O conteúdo vem do servidor: **toda atualização feita no site chega ao app sem nova versão**. Só mudanças nativas
(ícone, nome, permissões, plugins) pedem novo envio às lojas.

👉 **Passo a passo de publicação:** [`store/GUIA-PUBLICACAO.md`](store/GUIA-PUBLICACAO.md)
· Textos e respostas das lojas: [`store/app-store.md`](store/app-store.md), [`store/google-play.md`](store/google-play.md)
· Capturas de tela nos tamanhos exigidos: [`store/screenshots/`](store/screenshots/)

## Como funciona (v9)
- **Sem login, sem senha.** "Começar meus 3 dias grátis" abre a folha de pagamento da Apple (Face ID) ou do Google Play.
  O RevenueCat registra a compra; o servidor confirma (`/api/iap/verify`) e cria a conta sozinho, ligada à compra.
- Ao reabrir, reinstalar ou trocar de celular, o assinante é reconhecido automaticamente (ou com "Restaurar compras"),
  e o plano, refeições e progresso voltam do servidor.
- O teste grátis é a **oferta introdutória** de cada assinatura nas lojas. O app só anuncia o teste se a loja o oferecer.
- Antes do primeiro uso da IA (scanner, coach, planos), o app pede consentimento nomeando a OpenAI (regra 5.1.2(i) da Apple);
  dá para desligar em Configurações › Análise por IA.
- Recursos nativos: compras, notificações locais (água, refeições, treino, pesagem), vibração, câmera (foto e código de barras),
  folha de compartilhar (exportações e relatório da menopausa), botão voltar do Android, tela offline.

## Plugins (versões fixas no `package.json`)
Capacitor 8.5 (core, ios, android), app, haptics, local-notifications, filesystem, share, splash-screen, status-bar,
RevenueCat 13. Requisitos: **Node 22+**, Java 21, Xcode 26+. Android: minSdk 24, **targetSdk 36**. iOS: 15.0+ (Swift Package Manager).

## Gerar os projetos
```
cd native
npm install
npx cap add android
npx cap add ios          # pode rodar fora do Mac; compilar exige Mac ou Codemagic
npm run assets           # ícones e splash a partir de resources/
npm run sync             # sincroniza e aplica as configurações das lojas
npm run doctor           # confere se nada ficou faltando (sai com erro se faltar)
```
`scripts/configure-native.mjs` aplica (e o `--check` confere):
- iPhone: textos de permissão da câmera e da fototeca (sem eles o app fecha ao abrir a câmera), `ITSAppUsesNonExemptEncryption = NO`,
  retrato no iPhone, `arm64`, versão (`APP_VERSION`) e build (`BUILD_NUMBER`).
- Android: permissões de câmera e notificações, câmera opcional, ícone das notificações, `versionName`/`versionCode`.

**Sem Mac:** `codemagic.yaml` (na raiz) já tem os dois fluxos com tudo isso; falta só conectar as assinaturas de código no painel.

## Variáveis no Railway
`REVENUECAT_IOS_KEY`, `REVENUECAT_ANDROID_KEY`, `REVENUECAT_SECRET_KEY`, `REVENUECAT_WEBHOOK_AUTH`, `OPENAI_API_KEY`, `OPENAI_MODEL`,
`ACCESS_TOKEN_SECRET`, `LEGAL_COMPANY_NAME`, `LEGAL_COMPANY_ADDRESS`, `LEGAL_COMPANY_ID`, `SUPPORT_EMAIL`, `DATA_DIR=/data` (volume persistente).
Webhook do RevenueCat: `https://app.atlasevermore.com/api/revenuecat/webhook` com `Authorization` = `REVENUECAT_WEBHOOK_AUTH`.
`https://app.atlasevermore.com/api/health` deve mostrar `"ready": true` antes de enviar para revisão.

## Páginas públicas
Privacidade `/privacy` · Termos `/terms` · Suporte `/support` · Exclusão de conta `/delete-account`

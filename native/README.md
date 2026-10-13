# NutriPilot — app para iPhone e Android

Esta pasta transforma o NutriPilot (servido em https://app.atlasevermore.com) em apps da App Store e do Google Play com **Capacitor**. As assinaturas são vendidas pela Apple e pelo Google e controladas pelo **RevenueCat**. O servidor confirma cada compra antes de liberar o acesso.

O conteúdo do app vem do servidor: depois de publicado nas lojas, toda atualização feita no site chega ao app sem nova versão (só mudanças nativas pedem novo envio).

## 1. Contas necessárias
- Apple Developer Program (US$ 99/ano) — https://developer.apple.com/programs/
- Google Play Console (US$ 25, uma vez) — https://play.google.com/console
- RevenueCat (gratuito até um limite de faturamento) — https://app.revenuecat.com

## 2. Produtos nas lojas
Crie as assinaturas com **exatamente** estes IDs (lista completa e preços em `NutriPilot-produtos-lojas.csv`). Para começar, bastam 24:

| Plano | Mensal | Anual |
|---|---|---|
| Kit completo | np_complete_monthly | np_complete_annual |
| Corpo em forma | np_body_monthly | np_body_annual |
| Mulher 40+ | np_women40_monthly | np_women40_annual |
| Cozinha saudável | np_kitchen_monthly | np_kitchen_annual |
| Performance | np_performance_monthly | np_performance_annual |
| Bem-estar | np_wellness_monthly | np_wellness_annual |
| Nutrição | np_nutrition_monthly | np_nutrition_annual |
| Receitas | np_recipes_monthly | np_recipes_annual |
| Treino | np_training_monthly | np_training_annual |
| Menopausa 40+ | np_menopause_monthly | np_menopause_annual |
| Vitaminas | np_nutrients_monthly | np_nutrients_annual |
| Sono e estresse | np_sleep_monthly | np_sleep_annual |

- **App Store Connect:** um único grupo de assinaturas "NutriPilot" com todos os produtos; oferta introdutória "teste gratuito de 3 dias" em cada um; preço base em US$ e "preços de outros países automáticos".
- **Google Play:** uma assinatura por ID, com um plano base (mensal ou anual) e uma oferta de teste gratuito de 3 dias; preço em US$ e "converter preços".
- O app mostra só o que a loja vende: uma combinação montada que não exista na loja vira automaticamente o plano disponível mais barato que inclui os módulos escolhidos.

## 3. RevenueCat
1. Crie o projeto e adicione o app iOS (bundle `com.atlasevermore.nutripilot`) e o app Android (mesmo ID).
2. Conecte as lojas (chave da App Store Connect API e conta de serviço do Google Play) e importe os produtos.
3. No Railway, defina as variáveis:
   - `REVENUECAT_IOS_KEY` — chave pública do app iOS (começa com `appl_`)
   - `REVENUECAT_ANDROID_KEY` — chave pública do app Android (começa com `goog_`)
   - `REVENUECAT_SECRET_KEY` — chave secreta (API v1, começa com `sk_`)
   - `REVENUECAT_WEBHOOK_AUTH` — uma senha longa que você inventa
4. Em Integrations › Webhooks: URL `https://app.atlasevermore.com/api/revenuecat/webhook` e cabeçalho Authorization = o mesmo valor de `REVENUECAT_WEBHOOK_AUTH`.

## 4. Gerar os projetos nativos
Num computador com Node 20+ (Mac para iOS):
```
cd native
npm run setup          # instala Capacitor e RevenueCat (versões atuais)
npm run add:android
npm run add:ios        # só no Mac
npm run assets         # ícones e splash a partir de resources/
npm run sync
npm run android        # abre no Android Studio → Build › Generate Signed Bundle (.aab)
npm run ios            # abre no Xcode → Product › Archive → enviar para o App Store Connect
```
No Xcode, ative a capability **In-App Purchase**. No Android, a permissão de cobrança é adicionada pelo plugin do RevenueCat.

**Sem Mac:** use um serviço de build na nuvem (Codemagic, Ionic Appflow ou Capawesome Cloud). O arquivo `codemagic.yaml` desta pasta já tem os dois fluxos; falta só conectar as assinaturas de código no painel do serviço.

## 5. Páginas públicas (para as fichas das lojas)
- Privacidade: https://app.atlasevermore.com/privacy
- Termos: https://app.atlasevermore.com/terms
- Suporte: https://app.atlasevermore.com/support
- Exclusão de conta (Google Play): https://app.atlasevermore.com/delete-account

## 6. Conta para os revisores
Os revisores não conseguem ler a caixa de e-mail. Defina no Railway `REVIEW_EMAIL=review@atlasevermore.com` e `REVIEW_CODE` (6 dígitos) e informe os dois nas notas de revisão. Apague as variáveis depois da aprovação.

## 7. Antes de enviar para revisão
- `https://app.atlasevermore.com/api/health` deve mostrar `"ready": true` (inclui armazenamento persistente em `/data`, e-mail, IA, RevenueCat e dados legais).
- Teste a compra com uma conta de teste (Sandbox na Apple, "testadores de licença" no Google).
- Nas notas para o revisor da Apple, informe: o app não exige login para explorar; a assinatura pede só um e-mail confirmado por código; inclua um e-mail de teste com acesso ativo.

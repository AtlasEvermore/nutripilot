# NutriPilot — Guia de publicação (App Store + Google Play)

Ordem certa, do zero até "Pronto para venda". Os textos prontos para colar estão em
[`app-store.md`](app-store.md) e [`google-play.md`](google-play.md); as imagens em [`screenshots/`](screenshots/).

> **Importante:** o app é uma "casca" que carrega `https://app.atlasevermore.com`. Tudo o que muda no site
> chega ao app na hora, **sem nova versão nas lojas e sem custo**. Só mudanças nativas (ícone, nome,
> plugins, permissões) pedem novo envio.

---

## 0. Antes de tudo (servidor — Railway)

`https://app.atlasevermore.com/api/health` precisa mostrar `"ready": true`. Variáveis obrigatórias:

| Variável | Para quê |
|---|---|
| `ACCESS_TOKEN_SECRET` | sessões (≥ 24 caracteres aleatórios) |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | scanner, coach, planos |
| `REVENUECAT_IOS_KEY` (`appl_…`), `REVENUECAT_ANDROID_KEY` (`goog_…`) | compras no app |
| `REVENUECAT_SECRET_KEY` (`sk_…`), `REVENUECAT_WEBHOOK_AUTH` | o servidor confirma cada compra |
| `LEGAL_COMPANY_NAME`, `LEGAL_COMPANY_ADDRESS`, `LEGAL_COMPANY_ID` | aparecem na Política de Privacidade e nos Termos (Apple e Google exigem) |
| `SUPPORT_EMAIL` | página de suporte |
| `DATA_DIR=/data` + volume persistente no Railway | contas e compras não podem sumir num deploy |
| `RESEND_API_KEY` (ou SMTP) | e-mails de login (clientes antigos / web) |

**Não é mais preciso** configurar Sign in with Apple nem Google OAuth: o app não pede login.

---

## 1. Conta Google Play — leia primeiro (afeta o prazo)

- **Conta pessoal** (criada como pessoa física): o Google exige **teste fechado com pelo menos 12 testadores
  inscritos durante 14 dias seguidos** antes de liberar a produção. Comece **hoje**:
  Play Console › Testar › Teste fechado › criar faixa › adicionar e-mails (uma lista do Google Groups ajuda) ›
  enviar o primeiro `.aab`. Peça para os 12 abrirem o app pelo link de teste e mantê-lo instalado.
  Depois dos 14 dias: Painel › "Solicitar acesso à produção".
- **Conta de organização** (CNPJ + D-U-N-S): sem essa exigência; pode ir direto à produção.
- O Google também verifica a identidade e, para apps de saúde, pede a **Declaração de apps de saúde**.

## 2. Nome nas lojas

Já existem "NutriPilot AI" e "Nutripilot AI Pro Assistant" na App Store. Para não ter o nome recusado e
reduzir risco de marca, use **nome + descritor** (o ícone continua mostrando só "NutriPilot"):
- 🇫🇷 `NutriPilot : Nutrition & Sport` · 🇧🇷 `NutriPilot: Dieta e Treino` · 🇺🇸 `NutriPilot: Food & Fitness`

Se possível, registre a marca no INPI/EUIPO antes de investir em anúncios.

## 3. Criar os apps

**App Store Connect** › Apps › + › iOS · Nome (item 2) · idioma principal **Francês** · Bundle ID
`com.atlasevermore.nutripilot` (crie antes em developer.apple.com › Identifiers, com **In-App Purchase**) · SKU `nutripilot-ios`.

**Play Console** › Criar app · nome · idioma padrão **Francês (França)** · App · **Gratuito** (as assinaturas são compras no app).

## 4. Assinaturas (as duas lojas)

Comece com **poucos produtos**. O app mostra só o que existe na loja e cai automaticamente no plano mais barato que cobre o que a pessoa escolheu.

| Produto | ID (exato) | Preço base (US$) |
|---|---|---|
| Kit completo mensal | `np_complete_monthly` | 29,90 |
| Kit completo anual | `np_complete_annual` | 299,00 |
| Corpo em forma mensal / anual | `np_body_monthly` / `np_body_annual` | 14,90 / 149,00 |
| Mulher 40+ mensal / anual | `np_women40_monthly` / `np_women40_annual` | 13,90 / 139,00 |

Na Apple escolha o preço base em US$ e "preços automáticos" nos outros países (na França, US$ 29,90 vira cerca de 29,99 €;
no Brasil, cerca de R$ 149,90 — a loja arredonda para os seus degraus de preço). Depois, se quiser, acrescente os outros combos
(`np_kitchen_*` 9,90/99, `np_performance_*` 10,90/109, `np_wellness_*` 5,90/59) e os módulos avulsos — o app passa a mostrá-los sozinho.

- **Apple:** um grupo de assinaturas "NutriPilot" com todos; **só nos produtos anuais** (`*_annual`): Oferta introdutória → Grátis → **7 dias**; os mensais ficam **sem teste** (isso empurra para o plano anual, o mais valioso);
  preencha nome e descrição de exibição em FR/PT/EN e envie uma **captura de tela do paywall** (`screenshots/review/`).
  Os produtos precisam ser **enviados junto com a primeira versão** do app (seção "Compras no app" da versão).
- **Google:** Monetizar › Assinaturas › uma assinatura por ID › plano base (mensal ou anual, renovação automática) ›
  nos planos **anuais**, oferta "Teste sem custo" de **7 dias** para novos clientes; mensais sem oferta. (O Google só libera esta tela depois do primeiro `.aab` enviado.)
- O app lê a oferta da loja: se o teste grátis não estiver configurado, ele **não** promete teste grátis (regra 3.1.2 da Apple). O teste aparece só no período que realmente tem (ex.: "7 dias grátis" no anual, "Continuar · R$ X / mês" no mensal).

## 5. RevenueCat

1. Projeto "NutriPilot" › apps iOS e Android (`com.atlasevermore.nutripilot`).
2. Conecte a App Store (chave In-App Purchase da App Store Connect) e o Google Play (conta de serviço com acesso financeiro).
3. Products › importe os IDs acima. (Entitlements/Offerings não são necessários: o servidor lê as assinaturas diretamente.)
4. Integrations › Webhooks: `https://app.atlasevermore.com/api/revenuecat/webhook`, Authorization = `REVENUECAT_WEBHOOK_AUTH`.
5. Copie as chaves para o Railway (item 0).

## 6. Gerar os apps (Codemagic — sem Mac)

1. codemagic.io › conectar o repositório GitHub.
2. **Android:** Code signing › gere/upload a keystore com o nome `nutripilot_keystore` (**guarde uma cópia — sem ela nunca mais é possível atualizar o app**).
   Grupo de variáveis `google_play` com `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS`.
3. **iOS:** Integrations › App Store Connect › chave de API com o nome `NutriPilot ASC key`; ative "automatic code signing".
4. Rode `NutriPilot Android` e `NutriPilot iOS`. O fluxo já: instala Capacitor 8 (Node 22, Java 21, Xcode 26), gera ícones,
   aplica permissões de câmera/notificações, textos de privacidade do iPhone, versão e número de build, e **para com erro se
   faltar algo** (`configure-native.mjs --check`).
5. O `.ipa` vai para o TestFlight; o `.aab` para a faixa interna do Play (mude para teste fechado no Play Console).

Com Mac: `cd native && npm install && npx cap add ios && npx cap add android && npm run assets && npm run sync`.

## 6b. Medir as vendas dos anúncios (Meta / Instagram)

O pixel do site não funciona dentro do app. Para saber quais anúncios geram assinaturas:
1. **RevenueCat › Integrations › Meta Ads (Facebook)** → conecte a conta de anúncios e o **Pixel/Dataset** (Conversions API).
   O RevenueCat envia `StartTrial`, `Subscribe` e as renovações (com valor) direto do servidor — sem código no app.
2. **Meta Events Manager › Apps** → cadastre o app (ID da App Store e pacote `com.atlasevermore.nutripilot`) para usar campanhas de instalação.
3. **iPhone:** a atribuição por anúncio no iOS é limitada (privacidade da Apple). Para campanhas grandes, a próxima versão nativa pode
   incluir o SDK da Meta + a pergunta de rastreamento (ATT). Até lá, use campanhas de **site → app** ou meça por cupons/links UTM.
4. Se ativar o SDK da Meta no futuro: atualizar a Privacidade do app (Apple) e a Segurança dos dados (Google) para "Dados usados para rastreamento".

## 6c. Interruptores no Railway
- `TRIAL_DAYS=7`, `TRIAL_ON=annual` (o que o **site** mostra; no app vale o que está configurado na loja).
- `FREE_SCANS=3` — análises de prato grátis antes do paywall (contadas por aparelho no servidor; `0` desliga).

## 7. Fichas das lojas

Copie de `app-store.md` e `google-play.md`: textos, palavras-chave, classificação etária, privacidade (App Privacy / Segurança dos dados),
notas para o revisor. URLs:
- Privacidade: `https://app.atlasevermore.com/privacy` · Termos (EULA): `https://app.atlasevermore.com/terms`
- Suporte: `https://app.atlasevermore.com/support` · Exclusão de conta: `https://app.atlasevermore.com/delete-account`

**Apple – União Europeia (DSA):** App Store Connect › Business › declare o **status de comerciante (trader)**. Vendendo assinaturas
na França você é comerciante: endereço, telefone e e-mail ficam públicos na ficha. Sem isso o app não é distribuído na UE.

## 8. Testar antes de enviar

- iPhone: TestFlight › instalar › comprar com conta **Sandbox** (Configurações › App Store › Conta Sandbox).
- Android: faixa de teste › instalar › comprar com um e-mail cadastrado em "Testadores de licença".
- Roteiro de 5 minutos: abrir pela 1ª vez → idioma → questionário → 3 análises grátis do prato → "Seu plano está pronto" → **Começar meus 7 dias grátis** no anual (Face ID) → todas as apps abrem →
  scanner (aceitar a IA) → lembretes (aceitar notificações) → apagar o app, reinstalar → abre já como assinante → Configurações › Restaurar compras.

## 9. Enviar para revisão

- Apple: versão 1.0 › build do TestFlight › compras no app marcadas › notas do revisor (em `app-store.md`) › Enviar.
  Prazo típico: 24–48 h.
- Google: produção (ou teste fechado para conta pessoal) › lançamento › revisão em 1–7 dias.

## O que já está resolvido no código (v9)

| Exigência | Como está |
|---|---|
| Apple 3.1.1 / 3.1.2 — compra só pela loja, preço, período, teste, termos, restaurar | paywall nativo; sem links de compra externa no app; teste só aparece se a loja oferecer |
| Apple 5.1.1(v) / Google — excluir conta | Configurações › Excluir minha conta + página web |
| Apple 5.1.2(i) — dados para IA de terceiros | tela de consentimento nomeando a OpenAI antes do 1º uso; pode desligar em Configurações |
| Apple 4.2 — funcionalidade mínima (não ser "só um site") | compras nativas, notificações locais, vibração nativa, câmera, folha de compartilhar, tela offline |
| Câmera sem travar | textos de permissão no iPhone + permissão no Android |
| Android 15/16 tela cheia (edge-to-edge) e API alvo 36 | Capacitor 8 + áreas seguras no CSS |
| Botão voltar do Android | fecha janelas, volta telas, sai do app na tela inicial |
| Primeiro acesso sem erro | testado: web, iPhone e Android simulados, todas as 27 telas, compra, restaurar, reinstalar |
| Rastreamento | nenhum SDK de anúncios; sem ATT necessário |
| Conversão (v10) | questionário → "Seu plano está pronto" → planos; 3 análises grátis; planos com 2–3 opções; teste só no anual |
| Avaliações | pedido nativo de avaliação após uma vitória (7 dias seguidos ou dia dentro da meta), no máximo a cada 4 meses |
| Abertura rápida / offline | arquivos guardados no celular (ETag/304), service worker com limite de 2,5 s, App-Bound Domains no iPhone |
| Coach (v12) | conversa real em vários turnos; sessão renovada sozinha (sem "sessão expirada" no meio da conversa); sem internet ou com o serviço fora do ar, mostra o aviso + resposta com os dados do usuário + botão "Tentar de novo" |
| Copiloto "Meu dia agora" (v12) | início do assinante: próxima ação, refeições registradas/pendentes, "Minha rotina mudou", "Vou comer fora", "O que posso preparar com isso?", "Trocar esta refeição", "Registrar o que comi"; alternativas com prévia → aplicar → desfazer, histórico, lembretes do dia ajustados, metas nunca alteradas, resumo para o profissional |
| Estados de gravação (v12) | "Salvando", "Salvo", "Pendente de sincronização" (envia sozinho ao voltar a internet), "Não foi possível salvar"; ao reabrir o app, traz alterações feitas em outro aparelho |

# Hotmart — configuration NutriPilot

## 1) Plans créés
- NutriPilot Premium — Mensuel : 9,90 EUR / mois
- NutriPilot Premium — 3 Mois : 19,90 EUR / 3 mois
- NutriPilot Premium — Annuel : 39,90 EUR / an

## 2) Liens checkout
Dans `.env`, collez les liens directs de chaque plan :
```
HOTMART_CHECKOUT_MONTHLY=
HOTMART_CHECKOUT_QUARTERLY=
HOTMART_CHECKOUT_YEARLY=
```

## 3) Webhook
Dans Hotmart : Ferramentas > Webhook (API e notificações).
- Version : 2.0.0
- URL : `https://VOTRE-APP/api/hotmart/webhook`
- Événements à activer : Compra Aprovada, Compra Completa, Compra Cancelada, Compra Atrasada, Reembolso, Chargeback et Cancelamento de Assinatura.

Dans l'onglet d'authentification du Webhook, copiez le Hottok et placez-le dans :
```
HOTMART_HOTTOK=
```
Le serveur vérifie le header `X-HOTMART-HOTTOK`.

## 4) Accès
Après `PURCHASE_APPROVED` ou `PURCHASE_COMPLETE`, l'e-mail acheteur devient Premium. L'utilisateur demande un code d'accès avec le même e-mail utilisé au checkout.

## 5) E-mail d'accès
Pour envoyer le code automatiquement :
```
RESEND_API_KEY=
RESEND_FROM=NutriPilot <support@atlasevermore.com>
```

## 6) Test obligatoire
Avant publicité : achat test EUR -> webhook -> code -> Premium -> remboursement -> accès révoqué. Testez aussi mobile iOS/Android et desktop.


## Checkouts configurés dans cette version
- Mensuel — 9,90 € : `https://pay.hotmart.com/R107884011S?off=r3ueswug`
- 3 mois — 19,90 € : `https://pay.hotmart.com/R107884011S?off=xb98vzl6`
- Annuel — 39,90 € : `https://pay.hotmart.com/R107884011S?off=gatqnh54`

Les variables d’environnement peuvent toujours remplacer ces URLs si une offre change. Le webhook reconnaît également les codes d’offre `r3ueswug`, `xb98vzl6` et `gatqnh54` afin d’attribuer le bon plan.

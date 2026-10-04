# NutriPilot France — Hotmart-ready v3

PWA premium en français pour abonnement nutritionnel assisté par IA : analyse par photo, texte, code-barres, calories/macros, portions corrigibles, planification, coach, hydratation, progression, favoris et routines.

## Lancer en local
```bash
npm start
```
Puis ouvrez `http://localhost:3000`.

## Ce qui fonctionne
- Landing + onboarding personnalisé
- Calcul de point de départ calorique et macros
- Journal repas / eau / poids / tour de taille
- Photo, texte, dictée vocale, saisie manuelle, favoris
- Code-barres via Open Food Facts
- Portions modifiables avec recalcul
- Fourchette d'estimation et score de confiance
- « Quoi manger ensuite ? » + 3 suggestions
- Coach nutritionnel contextuel
- Analyse hebdomadaire / score de régularité
- Paywall mensuel / 3 mois / annuel
- Checkout Hotmart par URL de plan
- Webhook Hotmart V2 + validation Hottok
- Activation Premium par e-mail + code
- Révocation sur remboursement/chargeback/annulation de transaction
- Conservation de l'accès payé jusqu'à la prochaine échéance lors d'une annulation d'abonnement, quand la date est disponible
- PWA installable + cache de l'interface
- UTM + événements dataLayer / Meta Pixel
- Export / suppression des données locales

## Configuration
Les trois checkouts Hotmart sont déjà intégrés. Copiez `.env.example` vers `.env`, puis configurez surtout `HOTMART_HOTTOK`, `ACCESS_TOKEN_SECRET`, l’e-mail et l’IA. Lire `HOTMART_SETUP.md`.

## Important
Une photo seule ne pèse pas un aliment. NutriPilot présente donc des estimations, une fourchette et permet la correction des portions. Avant mise en production, finalisez identité légale, CGV/CGU, politique de confidentialité, cookies/analytics et fiscalité applicables.

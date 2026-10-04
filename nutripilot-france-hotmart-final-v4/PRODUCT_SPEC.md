# NutriPilot v2 — Product Spec

## Positionnement

Un assistant nutritionnel mobile-first qui réduit la friction du suivi et aide à prendre la prochaine décision alimentaire. Le produit ne promet pas de mesurer exactement les calories à partir d'une photo : il donne une estimation, une fourchette et rend les portions corrigibles.

## Cœur du produit

1. Photo → aliments + portions estimées + calories/macros + fourchette d'incertitude.
2. Texte / dictée → journalisation rapide.
3. Code-barres → base Open Food Facts.
4. Correction des grammes → recalcul immédiat.
5. « Quoi manger ensuite ? » → 3 options selon calories/macros restantes, envie, préférences et temps de cuisine.
6. Coach → questions contextuelles, sans diagnostic médical.
7. Favoris / routines → répétition en un geste.
8. Hydratation + poids + tour de taille + tendances.
9. Analyse 7 jours + score de régularité + badges.
10. PWA installable.

## Différenciation face à un tracker classique

- Ne montre pas une fausse précision visuelle : intervalle calorique + confiance.
- Conçu pour corriger rapidement une portion.
- Passe de « suivre ce que j'ai mangé » à « décider quoi manger ensuite ».
- Contextualise le coach avec l'objectif et la journée déjà consommée.
- Réduit les tâches répétitives avec favoris et routines.

## Monétisation

Paywall in-app avec 3 offres configurables en EUR. Les boutons redirigent vers les checkouts Hotmart exacts fournis par le vendeur. Premium est activé après preuve d'achat serveur (webhook + code e-mail), pas seulement grâce à une URL de retour.

## Événements marketing

- StartQuiz
- CompleteQuiz
- MealAnalyzed
- MealSaved
- MealComposerUsed
- BeginCheckout
- PremiumActivated

## Garde-fous

- 18+ dans ce MVP.
- Perte de poids sous IMC 18,5 : pas de déficit automatique.
- Déficit plafonné à 20% du TDEE dans le calcul de départ.
- Mention explicite que les valeurs sont des estimations générales.
- Cas médicaux, grossesse, traitement ou trouble alimentaire : renvoi vers professionnel de santé.

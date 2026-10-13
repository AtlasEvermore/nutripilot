// NutriPilot food library: nutrition per 100 g and recipes from several food cultures.
// Names are French source keys (translated through i18n.js). Macros are computed from ingredients.

// [kcal, protein, carbs, fat, fiber, aisle, kind]  aisle: P protéines, L légumes, F fruits, S féculents, D laitiers, X divers · kind: m viande, f poisson
export const INGREDIENTS = {
  'Algue nori': [35, 6, 5, 0.3, 0.4, 'X', ''],
  'Miso': [200, 12, 26, 6, 5, 'X', ''],
  'Gingembre': [80, 1.8, 18, 0.8, 2, 'L', ''],
  'Ail': [149, 6, 33, 0.5, 2, 'L', ''],
  'Hareng': [200, 18, 0, 14, 0, 'P', 'f'],
  'Fromage gouda': [356, 25, 2, 27, 0, 'D', ''],
  'Betterave cuite': [44, 1.7, 10, 0.2, 2, 'L', ''],
  'Chou kale': [49, 4.3, 9, 0.9, 4, 'L', ''],
  'Kéfir': [55, 3.5, 4, 3, 0, 'D', ''],
  'Lait demi-écrémé': [46, 3.4, 4.8, 1.5, 0, 'D', ''],
  'Tempeh': [195, 20, 8, 11, 5, 'P', ''],
  'Nouilles de blé cuites': [138, 4.5, 25, 2, 1.5, 'S', ''],
  'Huile de sésame': [884, 0, 0, 100, 0, 'X', ''],
  'Blanc de poulet': [110, 23, 0, 1.5, 0, 'P', 'm'],
  'Poulet grillé': [165, 31, 0, 3.6, 0, 'P', 'm'],
  'Dinde': [105, 24, 0, 1, 0, 'P', 'm'],
  'Steak haché 5%': [125, 21, 0, 5, 0, 'P', 'm'],
  'Bœuf (rumsteck)': [135, 22, 0, 5, 0, 'P', 'm'],
  'Jambon blanc': [110, 20, 1, 3, 0, 'P', 'm'],
  'Saucisse de volaille': [160, 15, 2, 10, 0, 'P', 'm'],
  'Saumon': [208, 20, 0, 13, 0, 'P', 'f'],
  'Cabillaud': [82, 18, 0, 0.7, 0, 'P', 'f'],
  'Thon au naturel': [116, 26, 0, 1, 0, 'P', 'f'],
  'Crevettes': [85, 20, 0, 0.5, 0, 'P', 'f'],
  'Sardines en boîte': [210, 24, 0, 12, 0, 'P', 'f'],
  'Œufs': [143, 12.6, 0.7, 9.5, 0, 'P', ''],
  'Tofu': [120, 13, 2, 7, 1, 'P', ''],
  'Lentilles cuites': [116, 9, 20, 0.4, 8, 'P', ''],
  'Pois chiches cuits': [140, 7.5, 21, 2.6, 7, 'P', ''],
  'Haricots noirs cuits': [132, 8.9, 23.7, 0.5, 8.7, 'P', ''],
  'Haricots rouges cuits': [127, 8.7, 22.8, 0.5, 6.4, 'P', ''],
  'Haricots blancs cuits': [139, 9.7, 25, 0.4, 6.3, 'P', ''],
  'Edamame': [121, 12, 9, 5, 5, 'P', ''],
  'Skyr': [63, 11, 4, 0.2, 0, 'D', ''],
  'Yaourt grec': [97, 9, 3.9, 5, 0, 'D', ''],
  'Yaourt nature': [60, 4, 5, 3, 0, 'D', ''],
  'Fromage blanc 0%': [48, 8, 4, 0.2, 0, 'D', ''],
  'Fromage frais léger': [150, 9, 5, 10, 0, 'D', ''],
  'Feta': [264, 14, 4, 21, 0, 'D', ''],
  'Mozzarella': [230, 18, 2, 17, 0, 'D', ''],
  'Parmesan': [400, 35, 0, 28, 0, 'D', ''],
  'Ricotta': [150, 9, 3, 11, 0, 'D', ''],
  'Boisson soja': [39, 3.3, 2.5, 1.8, 0.5, 'D', ''],
  'Lait de coco léger': [70, 0.7, 2, 6.5, 0, 'D', ''],
  'Riz cuit': [130, 2.7, 28, 0.3, 0.4, 'S', ''],
  'Riz complet cuit': [123, 2.7, 25.6, 1, 1.6, 'S', ''],
  'Pâtes complètes cuites': [149, 6, 29, 1.5, 4, 'S', ''],
  'Quinoa cuit': [120, 4.4, 21, 1.9, 2.8, 'S', ''],
  'Pommes de terre': [77, 2, 17, 0.1, 2.2, 'S', ''],
  'Patate douce cuite': [90, 2, 21, 0.2, 3.3, 'S', ''],
  'Pain complet': [247, 13, 41, 4.2, 7, 'S', ''],
  'Pain de seigle': [259, 8.5, 48, 3.3, 5.8, 'S', ''],
  'Pain burger': [265, 9, 49, 3.5, 2.5, 'S', ''],
  'Pain pita complet': [266, 9.8, 55, 1.7, 7, 'S', ''],
  'Chapati': [297, 11, 46, 7.5, 5, 'S', ''],
  'Flocons d’avoine': [372, 13, 60, 7, 10, 'S', ''],
  'Granola': [450, 10, 64, 17, 7, 'S', ''],
  'Tortilla de maïs': [218, 5.7, 44.6, 2.9, 6.3, 'S', ''],
  'Couscous cuit': [112, 3.8, 23, 0.2, 1.4, 'S', ''],
  'Boulgour cuit': [83, 3, 18.6, 0.2, 4.5, 'S', ''],
  'Nouilles de riz cuites': [108, 1.8, 24, 0.2, 1, 'S', ''],
  'Nouilles soba cuites': [99, 5, 21, 0.1, 1.5, 'S', ''],
  'Tapioca (fécule)': [340, 0.2, 85, 0.1, 0.9, 'S', ''],
  'Manioc cuit': [125, 1, 30, 0.3, 1.8, 'S', ''],
  'Polenta cuite': [70, 1.6, 15, 0.3, 0.8, 'S', ''],
  'Courgette': [17, 1.2, 3.1, 0.3, 1, 'L', ''],
  'Brocoli': [35, 2.4, 7.2, 0.4, 3.3, 'L', ''],
  'Tomates': [18, 0.9, 3.9, 0.2, 1.2, 'L', ''],
  'Concombre': [15, 0.7, 3.6, 0.1, 0.5, 'L', ''],
  'Carotte': [41, 0.9, 9.6, 0.2, 2.8, 'L', ''],
  'Épinards': [23, 2.9, 3.6, 0.4, 2.2, 'L', ''],
  'Haricots verts': [31, 1.8, 7, 0.2, 3.4, 'L', ''],
  'Poivron': [31, 1, 6, 0.3, 2.1, 'L', ''],
  'Champignons': [22, 3.1, 3.3, 0.3, 1, 'L', ''],
  'Oignon': [40, 1.1, 9.3, 0.1, 1.7, 'L', ''],
  'Salade': [15, 1.4, 2.9, 0.2, 1.3, 'L', ''],
  'Roquette': [25, 2.6, 3.7, 0.7, 1.6, 'L', ''],
  'Aubergine': [25, 1, 6, 0.2, 3, 'L', ''],
  'Chou blanc': [25, 1.3, 5.8, 0.1, 2.5, 'L', ''],
  'Petits pois': [81, 5.4, 14, 0.4, 5.7, 'L', ''],
  'Maïs doux': [86, 3.3, 19, 1.4, 2, 'L', ''],
  'Bok choy': [13, 1.5, 2.2, 0.2, 1, 'L', ''],
  'Kimchi': [15, 1.1, 2.4, 0.5, 1.6, 'L', ''],
  'Salsa tomate': [36, 1.5, 7, 0.2, 1.8, 'L', ''],
  'Banane': [89, 1.1, 23, 0.3, 2.6, 'F', ''],
  'Pomme': [52, 0.3, 14, 0.2, 2.4, 'F', ''],
  'Poire': [57, 0.4, 15, 0.1, 3.1, 'F', ''],
  'Fruits rouges': [45, 1, 10, 0.3, 4, 'F', ''],
  'Myrtilles': [57, 0.7, 14, 0.3, 2.4, 'F', ''],
  'Orange': [47, 0.9, 12, 0.1, 2.4, 'F', ''],
  'Mangue': [60, 0.8, 15, 0.4, 1.6, 'F', ''],
  'Papaye': [43, 0.5, 11, 0.3, 1.7, 'F', ''],
  'Pulpe d’açaí': [60, 1, 6, 4, 3, 'F', ''],
  'Dattes': [282, 2.5, 75, 0.4, 8, 'F', ''],
  'Avocat': [160, 2, 8.5, 14.7, 6.7, 'F', ''],
  'Citron': [29, 1.1, 9, 0.3, 2.8, 'F', ''],
  'Huile d’olive': [884, 0, 0, 100, 0, 'X', ''],
  'Amandes': [579, 21, 22, 50, 12.5, 'X', ''],
  'Noix': [654, 15, 14, 65, 6.7, 'X', ''],
  'Beurre de cacahuète': [588, 25, 20, 50, 6, 'X', ''],
  'Graines de chia': [486, 17, 42, 31, 34, 'X', ''],
  'Graines de sésame': [573, 18, 23, 50, 12, 'X', ''],
  'Houmous': [166, 8, 14, 10, 6, 'X', ''],
  'Olives': [145, 1, 4, 15, 3.3, 'X', ''],
  'Miel': [304, 0.3, 82, 0, 0.2, 'X', ''],
  'Cacao non sucré': [228, 20, 58, 14, 37, 'X', ''],
  'Sauce soja': [53, 8, 4.9, 0.6, 0.8, 'X', ''],
  'Sauce tomate': [29, 1.4, 5, 0.2, 1.5, 'X', ''],
  'Sauce yaourt': [90, 4, 5, 6, 0, 'D', ''],
  'Pâte de curry rouge': [120, 2, 12, 7, 4, 'X', ''],
  'Moutarde': [66, 4, 6, 3.5, 3, 'X', ''],
  'Herbes': [40, 3, 6, 0.8, 4, 'L', ''],
  'Épices': [300, 12, 55, 10, 30, 'X', ''],
};

export const AISLES = { P: 'Protéines', L: 'Légumes', F: 'Fruits', S: 'Féculents', D: 'Produits laitiers / alternatives', X: 'Divers' };

// Cuisine codes: fr française, br brésilienne, es espagnole, it italienne, de allemande & nordique,
// us américaine & britannique, mx mexicaine & latino, as asiatique, me méditerranée orientale & Turquie, in indienne
export const CUISINES = [
  ['fr', 'Française', '🇫🇷'], ['br', 'Brésilienne', '🇧🇷'], ['es', 'Espagnole', '🇪🇸'], ['it', 'Italienne', '🇮🇹'],
  ['de', 'Allemande & nordique', '🇩🇪'], ['us', 'Américaine & britannique', '🇺🇸'], ['mx', 'Mexicaine & latino', '🇲🇽'],
  ['as', 'Asiatique', '🥢'], ['me', 'Orientale', '🫓'], ['in', 'Indienne', '🇮🇳'],
  ['jp', 'Japonaise', '🇯🇵'], ['kr', 'Coréenne', '🇰🇷'], ['cn', 'Chinoise', '🇨🇳'], ['tr', 'Turque', '🇹🇷'], ['pl', 'Polonaise', '🇵🇱'], ['nl', 'Néerlandaise', '🇳🇱'], ['id', 'Indonésienne', '🇮🇩'],
];

// [id, cuisine, type (b petit-déjeuner, m repas, s collation), name, prep minutes, ingredients, steps]
const R = [
  ['fr-b1', 'fr', 'b', 'Tartines complètes, fromage blanc & fruits rouges', 8, [['Pain complet', 60], ['Fromage blanc 0%', 150], ['Fruits rouges', 100], ['Miel', 8]], ['Faites griller le pain.', 'Servez le fromage blanc avec les fruits rouges.', 'Ajoutez un filet de miel.']],
  ['fr-m1', 'fr', 'm', 'Ratatouille, œufs pochés & quinoa', 35, [['Courgette', 150], ['Aubergine', 120], ['Poivron', 80], ['Tomates', 120], ['Œufs', 120], ['Quinoa cuit', 120], ['Huile d’olive', 8]], ['Faites mijoter les légumes coupés en dés avec l’huile 25 minutes.', 'Pochez les œufs 3 minutes dans l’eau frémissante.', 'Servez sur le quinoa chaud.']],
  ['fr-m2', 'fr', 'm', 'Cabillaud, purée de patate douce & haricots verts', 25, [['Cabillaud', 160], ['Patate douce cuite', 200], ['Haricots verts', 150], ['Huile d’olive', 6]], ['Écrasez la patate douce en purée.', 'Cuisez le cabillaud à la poêle 4 minutes de chaque côté.', 'Servez avec les haricots verts vapeur.']],
  ['fr-m3', 'fr', 'm', 'Poulet basquaise léger & riz', 30, [['Blanc de poulet', 150], ['Poivron', 120], ['Tomates', 150], ['Oignon', 50], ['Riz cuit', 150], ['Huile d’olive', 8]], ['Faites dorer le poulet en morceaux.', 'Ajoutez oignon, poivrons et tomates, laissez mijoter 15 minutes.', 'Servez avec le riz.']],
  ['fr-s1', 'fr', 's', 'Fromage blanc, pomme & noix', 3, [['Fromage blanc 0%', 150], ['Pomme', 120], ['Noix', 10]], ['Coupez la pomme en dés.', 'Mélangez avec le fromage blanc.', 'Parsemez de noix concassées.']],

  ['br-b1', 'br', 'b', 'Tapioca aux œufs & fromage frais', 10, [['Tapioca (fécule)', 40], ['Œufs', 100], ['Fromage frais léger', 30], ['Tomates', 50]], ['Étalez la fécule dans une poêle chaude pour former une galette.', 'Brouillez les œufs à part.', 'Garnissez la galette d’œufs, de fromage frais et de tomate.']],
  ['br-b2', 'br', 'b', 'Bowl d’açaí protéiné, banane & granola', 5, [['Pulpe d’açaí', 150], ['Skyr', 100], ['Banane', 100], ['Granola', 30]], ['Mixez l’açaí avec le skyr et la moitié de la banane.', 'Versez dans un bol.', 'Ajoutez le reste de banane et le granola.']],
  ['br-m1', 'br', 'm', 'Riz, haricots noirs, poulet grillé & salade', 25, [['Riz cuit', 130], ['Haricots noirs cuits', 120], ['Blanc de poulet', 140], ['Salade', 60], ['Tomates', 80], ['Huile d’olive', 5]], ['Faites griller le poulet assaisonné.', 'Réchauffez les haricots avec un peu d’oignon et d’ail.', 'Servez avec le riz et la salade de tomates.']],
  ['br-m2', 'br', 'm', 'Moqueca de poisson légère & riz', 30, [['Cabillaud', 170], ['Lait de coco léger', 100], ['Tomates', 100], ['Poivron', 80], ['Oignon', 50], ['Riz cuit', 130], ['Herbes', 5]], ['Superposez oignon, tomates et poivron dans une cocotte.', 'Ajoutez le poisson et le lait de coco, cuisez 15 minutes à couvert.', 'Parsemez de coriandre et servez avec le riz.']],
  ['br-m3', 'br', 'm', 'Bœuf maigre, manioc & brocoli', 30, [['Bœuf (rumsteck)', 140], ['Manioc cuit', 150], ['Brocoli', 120], ['Oignon', 40], ['Huile d’olive', 6]], ['Faites dorer le manioc cuit à la poêle ou au four.', 'Saisissez le bœuf en lanières avec l’oignon.', 'Servez avec le brocoli vapeur.']],
  ['br-s1', 'br', 's', 'Yaourt, papaye & graines de chia', 3, [['Yaourt grec', 150], ['Papaye', 150], ['Graines de chia', 10]], ['Coupez la papaye.', 'Ajoutez-la au yaourt.', 'Parsemez de graines de chia.']],

  ['es-b1', 'es', 'b', 'Tostada tomate, huile d’olive & jambon', 6, [['Pain complet', 70], ['Tomates', 80], ['Huile d’olive', 6], ['Jambon blanc', 40]], ['Faites griller le pain.', 'Frottez-le de tomate râpée et d’un filet d’huile.', 'Ajoutez le jambon.']],
  ['es-m1', 'es', 'm', 'Paella légère aux crevettes', 30, [['Riz cuit', 160], ['Crevettes', 120], ['Petits pois', 60], ['Poivron', 80], ['Tomates', 60], ['Huile d’olive', 8], ['Épices', 2]], ['Faites revenir poivron et tomate avec le paprika et le safran.', 'Ajoutez le riz, les petits pois et un peu de bouillon.', 'Posez les crevettes dessus et cuisez 6 minutes.']],
  ['es-m2', 'es', 'm', 'Tortilla de pommes de terre au four & salade', 35, [['Œufs', 180], ['Pommes de terre', 200], ['Oignon', 60], ['Huile d’olive', 8], ['Salade', 80]], ['Cuisez pommes de terre et oignon en fines tranches à la poêle.', 'Mélangez avec les œufs battus.', 'Cuisez au four 15 minutes et servez avec la salade.']],
  ['es-m3', 'es', 'm', 'Gaspacho, poulet grillé & pois chiches', 15, [['Tomates', 250], ['Concombre', 100], ['Poivron', 60], ['Huile d’olive', 8], ['Blanc de poulet', 130], ['Pois chiches cuits', 100]], ['Mixez tomates, concombre, poivron et huile, puis réservez au frais.', 'Faites griller le poulet.', 'Servez le gaspacho avec le poulet et les pois chiches.']],
  ['es-m4', 'es', 'm', 'Lentilles à l’espagnole', 30, [['Lentilles cuites', 220], ['Carotte', 80], ['Poivron', 60], ['Oignon', 50], ['Saucisse de volaille', 60], ['Huile d’olive', 6]], ['Faites revenir oignon, carotte et poivron.', 'Ajoutez la saucisse en rondelles et le paprika.', 'Ajoutez les lentilles et mijotez 10 minutes.']],
  ['es-s1', 'es', 's', 'Yaourt grec, orange & amandes', 3, [['Yaourt grec', 150], ['Orange', 130], ['Amandes', 12]], ['Pelez l’orange à vif.', 'Ajoutez les quartiers au yaourt.', 'Parsemez d’amandes.']],

  ['it-b1', 'it', 'b', 'Ricotta, poire & miel sur pain complet', 6, [['Pain complet', 60], ['Ricotta', 80], ['Poire', 120], ['Miel', 6]], ['Faites griller le pain.', 'Tartinez de ricotta.', 'Ajoutez la poire en lamelles et le miel.']],
  ['it-m1', 'it', 'm', 'Pâtes complètes al pomodoro & thon', 15, [['Pâtes complètes cuites', 200], ['Sauce tomate', 120], ['Thon au naturel', 100], ['Huile d’olive', 6], ['Herbes', 4], ['Parmesan', 8]], ['Cuisez les pâtes al dente.', 'Chauffez la sauce tomate avec le thon émietté.', 'Mélangez, ajoutez basilic et parmesan.']],
  ['it-m2', 'it', 'm', 'Minestrone aux haricots blancs', 35, [['Courgette', 100], ['Carotte', 80], ['Tomates', 120], ['Haricots blancs cuits', 120], ['Pâtes complètes cuites', 80], ['Parmesan', 10], ['Huile d’olive', 6]], ['Faites revenir les légumes en dés.', 'Couvrez d’eau et laissez cuire 20 minutes.', 'Ajoutez haricots et pâtes, servez avec le parmesan.']],
  ['it-m3', 'it', 'm', 'Poulet piccata au citron, polenta & épinards', 25, [['Blanc de poulet', 150], ['Citron', 20], ['Polenta cuite', 200], ['Épinards', 120], ['Huile d’olive', 8]], ['Aplatissez le poulet et saisissez-le 3 minutes par face.', 'Déglacez avec le jus de citron.', 'Servez avec la polenta et les épinards poêlés.']],
  ['it-m4', 'it', 'm', 'Salade caprese, quinoa & roquette', 10, [['Mozzarella', 100], ['Tomates', 200], ['Quinoa cuit', 150], ['Roquette', 40], ['Huile d’olive', 6], ['Herbes', 4]], ['Tranchez tomates et mozzarella.', 'Disposez sur le quinoa et la roquette.', 'Assaisonnez d’huile d’olive et de basilic.']],
  ['it-s1', 'it', 's', 'Ricotta & fruits rouges', 2, [['Ricotta', 100], ['Fruits rouges', 120]], ['Versez la ricotta dans un bol.', 'Ajoutez les fruits rouges.', 'Dégustez frais.']],

  ['de-b1', 'de', 'b', 'Müesli au quark & pomme', 5, [['Fromage blanc 0%', 200], ['Flocons d’avoine', 40], ['Pomme', 120], ['Noix', 10]], ['Mélangez le quark et l’avoine.', 'Râpez la pomme par-dessus.', 'Ajoutez les noix.']],
  ['de-b2', 'de', 'b', 'Pain de seigle, œufs & concombre', 10, [['Pain de seigle', 70], ['Œufs', 100], ['Concombre', 80], ['Fromage frais léger', 20]], ['Cuisez les œufs durs 9 minutes.', 'Tartinez le pain de fromage frais.', 'Garnissez d’œufs et de concombre.']],
  ['de-m1', 'de', 'm', 'Escalope de dinde, pommes de terre & chou', 30, [['Dinde', 150], ['Pommes de terre', 220], ['Chou blanc', 150], ['Huile d’olive', 8], ['Moutarde', 10]], ['Faites cuire les pommes de terre à l’eau.', 'Poêlez le chou émincé 10 minutes.', 'Saisissez l’escalope et servez avec la moutarde.']],
  ['de-m2', 'de', 'm', 'Saumon, pommes de terre & concombre à l’aneth', 25, [['Saumon', 130], ['Pommes de terre', 200], ['Concombre', 150], ['Yaourt nature', 60], ['Herbes', 5]], ['Cuisez les pommes de terre.', 'Faites cuire le saumon au four 12 minutes.', 'Servez avec le concombre au yaourt et à l’aneth.']],
  ['de-m3', 'de', 'm', 'Lentilles, saucisse de volaille & carottes', 25, [['Lentilles cuites', 220], ['Saucisse de volaille', 80], ['Carotte', 100], ['Oignon', 40], ['Moutarde', 8]], ['Faites revenir oignon et carottes.', 'Ajoutez les lentilles et la saucisse en rondelles.', 'Mijotez 10 minutes, servez avec la moutarde.']],
  ['de-s1', 'de', 's', 'Quark, fruits rouges & cacao', 3, [['Fromage blanc 0%', 200], ['Fruits rouges', 100], ['Cacao non sucré', 5]], ['Mélangez le quark et le cacao.', 'Ajoutez les fruits rouges.', 'Servez frais.']],

  ['us-b1', 'us', 'b', 'Pancakes protéinés aux myrtilles', 15, [['Flocons d’avoine', 50], ['Œufs', 100], ['Banane', 60], ['Skyr', 60], ['Myrtilles', 80]], ['Mixez avoine, œufs, banane et skyr.', 'Cuisez de petits pancakes 2 minutes par face.', 'Servez avec les myrtilles.']],
  ['us-b2', 'us', 'b', 'Œufs brouillés, toast complet & avocat', 10, [['Œufs', 150], ['Pain complet', 50], ['Avocat', 50], ['Tomates', 80]], ['Brouillez les œufs à feu doux.', 'Faites griller le pain et écrasez l’avocat dessus.', 'Servez avec les tomates.']],
  ['us-m1', 'us', 'm', 'Bowl poulet cajun, patate douce & maïs', 25, [['Blanc de poulet', 150], ['Patate douce cuite', 180], ['Maïs doux', 60], ['Haricots noirs cuits', 60], ['Salade', 50], ['Sauce yaourt', 30], ['Épices', 3]], ['Frottez le poulet d’épices cajun et faites-le griller.', 'Rôtissez la patate douce en cubes.', 'Assemblez avec maïs, haricots, salade et sauce yaourt.']],
  ['us-m2', 'us', 'm', 'Chili aux haricots & riz complet', 35, [['Haricots rouges cuits', 200], ['Tomates', 200], ['Poivron', 80], ['Oignon', 50], ['Riz complet cuit', 130], ['Huile d’olive', 6], ['Épices', 3]], ['Faites revenir oignon et poivron avec les épices.', 'Ajoutez tomates et haricots, mijotez 20 minutes.', 'Servez avec le riz complet.']],
  ['us-m3', 'us', 'm', 'Burger de dinde maison & frites au four', 30, [['Dinde', 150], ['Pain burger', 70], ['Salade', 40], ['Tomates', 60], ['Pommes de terre', 150], ['Huile d’olive', 5]], ['Coupez les pommes de terre en frites et cuisez-les au four 25 minutes.', 'Formez et grillez le steak de dinde haché.', 'Montez le burger avec salade et tomate.']],
  ['us-s1', 'us', 's', 'Pomme & beurre de cacahuète', 2, [['Pomme', 150], ['Beurre de cacahuète', 15]], ['Coupez la pomme en quartiers.', 'Servez avec le beurre de cacahuète.', 'Idéal avant une séance.']],

  ['mx-b1', 'mx', 'b', 'Œufs à la ranchera, haricots & tortilla', 12, [['Œufs', 120], ['Tortilla de maïs', 50], ['Salsa tomate', 80], ['Haricots noirs cuits', 60], ['Avocat', 30]], ['Faites cuire les œufs au plat.', 'Réchauffez tortilla et haricots.', 'Servez avec salsa et avocat.']],
  ['mx-m1', 'mx', 'm', 'Tacos de poulet, salsa & avocat', 20, [['Blanc de poulet', 140], ['Tortilla de maïs', 80], ['Salsa tomate', 80], ['Avocat', 50], ['Oignon', 30], ['Salade', 40]], ['Faites griller le poulet épicé et émincez-le.', 'Chauffez les tortillas.', 'Garnissez de poulet, salsa, avocat, oignon et salade.']],
  ['mx-m2', 'mx', 'm', 'Bowl burrito, riz & haricots noirs', 20, [['Riz complet cuit', 140], ['Haricots noirs cuits', 120], ['Steak haché 5%', 100], ['Maïs doux', 50], ['Salsa tomate', 80], ['Salade', 50]], ['Faites revenir le bœuf haché avec cumin et paprika.', 'Réchauffez riz et haricots.', 'Assemblez le bol avec maïs, salsa et salade.']],
  ['mx-m3', 'mx', 'm', 'Ceviche de poisson & patate douce', 20, [['Cabillaud', 180], ['Citron', 60], ['Oignon', 40], ['Tomates', 80], ['Patate douce cuite', 150], ['Avocat', 40], ['Herbes', 5]], ['Coupez le poisson très frais en dés et couvrez de jus de citron 15 minutes.', 'Ajoutez oignon, tomate et coriandre.', 'Servez avec la patate douce et l’avocat.']],
  ['mx-s1', 'mx', 's', 'Yaourt, mangue & piment doux', 3, [['Yaourt grec', 150], ['Mangue', 120], ['Épices', 1]], ['Coupez la mangue.', 'Ajoutez-la au yaourt.', 'Saupoudrez d’un peu de piment doux et de citron.']],

  ['as-b1', 'as', 'b', 'Bol de riz, œuf mollet, épinards & sésame', 12, [['Riz cuit', 120], ['Œufs', 100], ['Épinards', 80], ['Sauce soja', 8], ['Graines de sésame', 4]], ['Cuisez les œufs 6 minutes.', 'Faites tomber les épinards à la poêle.', 'Servez sur le riz avec soja et sésame.']],
  ['as-b2', 'as', 'b', 'Smoothie bowl mangue & soja', 5, [['Mangue', 120], ['Boisson soja', 200], ['Flocons d’avoine', 30], ['Graines de chia', 8]], ['Mixez mangue, boisson soja et avoine.', 'Versez dans un bol.', 'Ajoutez les graines de chia.']],
  ['as-m1', 'as', 'm', 'Poke bowl saumon & edamame', 15, [['Saumon', 120], ['Riz cuit', 150], ['Edamame', 60], ['Concombre', 80], ['Carotte', 50], ['Sauce soja', 10], ['Graines de sésame', 4]], ['Coupez le saumon en dés et marinez-le avec le soja.', 'Disposez riz, légumes et edamame.', 'Ajoutez le saumon et le sésame.']],
  ['as-m2', 'as', 'm', 'Sauté de poulet, brocoli & nouilles de riz', 20, [['Blanc de poulet', 140], ['Nouilles de riz cuites', 160], ['Brocoli', 120], ['Poivron', 60], ['Sauce soja', 12], ['Huile d’olive', 6]], ['Saisissez le poulet émincé au wok.', 'Ajoutez brocoli et poivron, faites sauter 4 minutes.', 'Ajoutez les nouilles et la sauce soja.']],
  ['as-m3', 'as', 'm', 'Bibimbap au bœuf', 25, [['Bœuf (rumsteck)', 110], ['Riz cuit', 160], ['Épinards', 80], ['Carotte', 60], ['Œufs', 60], ['Kimchi', 50], ['Sauce soja', 8], ['Huile d’olive', 5]], ['Saisissez le bœuf mariné au soja.', 'Faites sauter épinards et carottes séparément.', 'Disposez sur le riz avec l’œuf et le kimchi.']],
  ['as-m4', 'as', 'm', 'Curry rouge thaï aux crevettes', 25, [['Crevettes', 150], ['Lait de coco léger', 120], ['Pâte de curry rouge', 15], ['Poivron', 80], ['Bok choy', 100], ['Riz cuit', 140]], ['Faites revenir la pâte de curry.', 'Ajoutez lait de coco, poivron et bok choy, cuisez 5 minutes.', 'Ajoutez les crevettes 3 minutes et servez avec le riz.']],
  ['as-m5', 'as', 'm', 'Tofu teriyaki, soba & légumes', 20, [['Tofu', 180], ['Nouilles soba cuites', 160], ['Bok choy', 100], ['Carotte', 60], ['Sauce soja', 12], ['Miel', 6], ['Graines de sésame', 4]], ['Dorez le tofu en cubes.', 'Ajoutez soja et miel pour laquer.', 'Servez avec les soba et les légumes sautés.']],
  ['as-s1', 'as', 's', 'Edamame & orange', 5, [['Edamame', 120], ['Orange', 120]], ['Faites cuire les edamame 4 minutes.', 'Salez légèrement.', 'Servez avec l’orange.']],

  ['me-b1', 'me', 'b', 'Chakchouka (œufs, tomates & poivrons)', 20, [['Œufs', 120], ['Tomates', 200], ['Poivron', 100], ['Oignon', 40], ['Huile d’olive', 6], ['Pain pita complet', 40], ['Épices', 2]], ['Faites compoter oignon, poivron et tomates avec le cumin.', 'Cassez les œufs dans la sauce et couvrez 6 minutes.', 'Servez avec le pain pita.']],
  ['me-b2', 'me', 'b', 'Petit-déjeuner turc léger', 8, [['Yaourt grec', 120], ['Œufs', 50], ['Concombre', 100], ['Tomates', 80], ['Olives', 20], ['Feta', 25], ['Pain pita complet', 50]], ['Cuisez l’œuf dur.', 'Disposez légumes, olives et feta.', 'Servez avec le yaourt et le pain.']],
  ['me-m1', 'me', 'm', 'Poulet shawarma, boulgour & taboulé', 25, [['Blanc de poulet', 150], ['Boulgour cuit', 150], ['Tomates', 80], ['Concombre', 80], ['Herbes', 15], ['Citron', 15], ['Sauce yaourt', 40], ['Épices', 3]], ['Marinez le poulet avec les épices shawarma et faites-le griller.', 'Mélangez boulgour, tomates, concombre, persil et citron.', 'Servez avec la sauce yaourt.']],
  ['me-m2', 'me', 'm', 'Falafels au four, houmous & salade', 35, [['Pois chiches cuits', 180], ['Oignon', 30], ['Herbes', 10], ['Huile d’olive', 8], ['Houmous', 40], ['Salade', 60], ['Tomates', 80]], ['Mixez pois chiches, oignon, herbes et cumin.', 'Formez des boulettes et cuisez au four 20 minutes.', 'Servez avec houmous et salade.']],
  ['me-m3', 'me', 'm', 'Kefta de bœuf, couscous & légumes rôtis', 30, [['Steak haché 5%', 140], ['Couscous cuit', 150], ['Courgette', 120], ['Carotte', 80], ['Huile d’olive', 6], ['Épices', 3]], ['Mélangez la viande avec épices et herbes, formez des keftas.', 'Rôtissez les légumes au four 20 minutes.', 'Grillez les keftas et servez avec le couscous.']],
  ['me-m4', 'me', 'm', 'Soupe de lentilles corail & citron', 30, [['Lentilles cuites', 250], ['Carotte', 80], ['Oignon', 50], ['Huile d’olive', 6], ['Citron', 15], ['Épices', 2], ['Pain pita complet', 40]], ['Faites revenir oignon et carotte avec le cumin.', 'Ajoutez les lentilles et de l’eau, cuisez 15 minutes puis mixez.', 'Servez avec citron et pain.']],
  ['me-s1', 'me', 's', 'Dattes & amandes', 1, [['Dattes', 30], ['Amandes', 15]], ['Dénoyautez les dattes.', 'Servez avec les amandes.', 'Parfait avec un thé.']],

  ['in-b1', 'in', 'b', 'Omelette masala & chapati', 12, [['Œufs', 120], ['Oignon', 30], ['Tomates', 50], ['Herbes', 5], ['Épices', 2], ['Chapati', 40], ['Huile d’olive', 4]], ['Battez les œufs avec oignon, tomate, coriandre et épices.', 'Cuisez l’omelette à feu moyen.', 'Servez avec le chapati.']],
  ['in-m1', 'in', 'm', 'Dal de lentilles, riz basmati & épinards', 30, [['Lentilles cuites', 220], ['Tomates', 80], ['Oignon', 40], ['Épinards', 80], ['Riz cuit', 130], ['Huile d’olive', 6], ['Épices', 3]], ['Faites revenir oignon et épices (curcuma, cumin).', 'Ajoutez tomates, lentilles et épinards, mijotez 10 minutes.', 'Servez avec le riz.']],
  ['in-m2', 'in', 'm', 'Poulet tikka au yaourt, riz & concombre', 30, [['Blanc de poulet', 150], ['Yaourt nature', 60], ['Épices', 4], ['Riz cuit', 140], ['Concombre', 80], ['Citron', 10]], ['Marinez le poulet dans le yaourt et les épices tikka.', 'Faites-le griller au four 15 minutes.', 'Servez avec riz et concombre citronné.']],
  ['in-m3', 'in', 'm', 'Chana masala & chapati', 25, [['Pois chiches cuits', 200], ['Tomates', 120], ['Oignon', 50], ['Huile d’olive', 6], ['Épices', 3], ['Chapati', 50], ['Yaourt nature', 50]], ['Faites revenir oignon et garam masala.', 'Ajoutez tomates et pois chiches, mijotez 15 minutes.', 'Servez avec chapati et yaourt.']],
  ['in-s1', 'in', 's', 'Lassi protéiné à la mangue', 3, [['Yaourt nature', 150], ['Skyr', 80], ['Mangue', 100]], ['Mixez tous les ingrédients.', 'Ajoutez une pincée de cardamome.', 'Servez bien frais.']],

  ['jp-b1', 'jp', 'b', 'Petit-déjeuner japonais : riz, saumon & soupe miso', 15, [['Riz cuit', 120], ['Saumon', 80], ['Miso', 15], ['Tofu', 50], ['Algue nori', 2], ['Épinards', 50]], ['Faites cuire le saumon à la poêle 4 minutes de chaque côté.', 'Délayez le miso dans de l’eau chaude avec le tofu et les épinards.', 'Servez avec le riz et la feuille de nori.']],
  ['jp-m1', 'jp', 'm', 'Bol de soba au poulet & légumes', 20, [['Nouilles soba cuites', 180], ['Blanc de poulet', 120], ['Brocoli', 100], ['Carotte', 60], ['Sauce soja', 15], ['Gingembre', 5]], ['Faites dorer le poulet émincé.', 'Ajoutez les légumes et le gingembre, faites sauter 4 minutes.', 'Mélangez avec les nouilles et la sauce soja.']],
  ['jp-m2', 'jp', 'm', 'Onigiri au thon & salade de concombre', 15, [['Riz cuit', 180], ['Thon au naturel', 80], ['Algue nori', 3], ['Concombre', 120], ['Graines de sésame', 5], ['Sauce soja', 8]], ['Mélangez le thon avec un peu de sauce soja.', 'Formez des boules de riz garnies de thon et entourez-les de nori.', 'Servez avec le concombre parsemé de sésame.']],
  ['jp-s1', 'jp', 's', 'Tofu frais, gingembre & sauce soja', 5, [['Tofu', 150], ['Gingembre', 3], ['Sauce soja', 8], ['Graines de sésame', 3]], ['Coupez le tofu en cubes.', 'Ajoutez le gingembre râpé et la sauce soja.', 'Parsemez de sésame.']],

  ['kr-b1', 'kr', 'b', 'Omelette roulée coréenne & riz', 15, [['Œufs', 150], ['Carotte', 40], ['Oignon', 20], ['Riz cuit', 100], ['Kimchi', 50]], ['Battez les œufs avec la carotte et l’oignon hachés.', 'Cuisez en fine omelette et roulez-la au fur et à mesure.', 'Servez avec le riz et le kimchi.']],
  ['kr-m1', 'kr', 'm', 'Ragoût de tofu au kimchi', 25, [['Tofu', 180], ['Kimchi', 120], ['Champignons', 80], ['Oignon', 40], ['Riz cuit', 120], ['Épices', 3]], ['Faites revenir l’oignon et le kimchi 3 minutes.', 'Ajoutez de l’eau, les champignons et le tofu, laissez mijoter 10 minutes.', 'Servez avec le riz.']],
  ['kr-m2', 'kr', 'm', 'Poulet bulgogi léger, riz & légumes', 25, [['Blanc de poulet', 150], ['Sauce soja', 15], ['Miel', 8], ['Ail', 5], ['Riz cuit', 150], ['Épinards', 80], ['Carotte', 60], ['Huile de sésame', 5]], ['Faites mariner le poulet émincé avec la sauce soja, le miel et l’ail.', 'Saisissez-le à la poêle 6 minutes.', 'Servez sur le riz avec les légumes sautés.']],
  ['kr-s1', 'kr', 's', 'Patate douce rôtie au sésame', 5, [['Patate douce cuite', 150], ['Graines de sésame', 3]], ['Réchauffez la patate douce au four.', 'Parsemez de sésame.', 'Dégustez tiède.']],

  ['cn-b1', 'cn', 'b', 'Congee de riz au poulet & gingembre', 25, [['Riz cuit', 150], ['Blanc de poulet', 80], ['Gingembre', 5], ['Œufs', 50], ['Bok choy', 60]], ['Faites mijoter le riz dans beaucoup d’eau jusqu’à obtenir une bouillie.', 'Ajoutez le poulet émincé, le gingembre et le bok choy, cuisez 8 minutes.', 'Servez avec un œuf mollet.']],
  ['cn-m1', 'cn', 'm', 'Tofu mapo léger & riz', 20, [['Tofu', 200], ['Steak haché 5%', 60], ['Épices', 3], ['Sauce soja', 10], ['Ail', 5], ['Riz cuit', 150], ['Petits pois', 60]], ['Faites revenir l’ail et la viande hachée.', 'Ajoutez le tofu en cubes, la sauce soja, les épices et un peu d’eau, laissez mijoter 6 minutes.', 'Servez avec le riz et les petits pois.']],
  ['cn-m2', 'cn', 'm', 'Crevettes sautées, légumes & nouilles', 20, [['Crevettes', 150], ['Nouilles de blé cuites', 160], ['Poivron', 80], ['Bok choy', 80], ['Sauce soja', 12], ['Gingembre', 4]], ['Faites sauter le gingembre et les crevettes 3 minutes.', 'Ajoutez les légumes, puis les nouilles.', 'Assaisonnez de sauce soja et servez.']],
  ['cn-s1', 'cn', 's', 'Edamame aux épices', 6, [['Edamame', 150], ['Épices', 2]], ['Faites cuire les edamame 4 minutes.', 'Égouttez et assaisonnez.', 'Dégustez tièdes.']],

  ['tr-b1', 'tr', 'b', 'Menemen (œufs, tomates & poivrons)', 15, [['Œufs', 120], ['Tomates', 150], ['Poivron', 80], ['Oignon', 30], ['Pain complet', 50], ['Huile d’olive', 5]], ['Faites revenir l’oignon et le poivron dans l’huile.', 'Ajoutez les tomates puis les œufs battus, remuez doucement.', 'Servez avec le pain.']],
  ['tr-m1', 'tr', 'm', 'Poulet mariné au four, boulgour & salade', 30, [['Blanc de poulet', 150], ['Sauce yaourt', 60], ['Boulgour cuit', 150], ['Tomates', 100], ['Concombre', 100], ['Épices', 3]], ['Faites mariner le poulet avec les épices et la moitié de la sauce yaourt.', 'Enfournez 20 minutes.', 'Servez avec le boulgour, la salade et le reste de sauce.']],
  ['tr-m2', 'tr', 'm', 'Aubergines farcies légères', 40, [['Aubergine', 250], ['Steak haché 5%', 100], ['Tomates', 120], ['Oignon', 50], ['Riz cuit', 100], ['Huile d’olive', 8]], ['Faites rôtir les aubergines ouvertes 15 minutes.', 'Faites revenir la viande avec l’oignon et les tomates.', 'Garnissez les aubergines, enfournez 15 minutes et servez avec le riz.']],
  ['tr-s1', 'tr', 's', 'Yaourt au concombre & herbes (cacık)', 5, [['Yaourt nature', 150], ['Concombre', 100], ['Herbes', 3]], ['Râpez le concombre.', 'Mélangez avec le yaourt et les herbes.', 'Servez frais.']],

  ['pl-b1', 'pl', 'b', 'Fromage frais aux herbes & pain de seigle', 5, [['Fromage blanc 0%', 150], ['Pain de seigle', 60], ['Concombre', 80], ['Herbes', 3]], ['Mélangez le fromage blanc avec les herbes.', 'Coupez le concombre en dés.', 'Servez avec le pain de seigle.']],
  ['pl-m1', 'pl', 'm', 'Soupe de betterave & œuf (barszcz)', 30, [['Betterave cuite', 200], ['Pommes de terre', 120], ['Carotte', 60], ['Oignon', 40], ['Œufs', 60], ['Yaourt nature', 50]], ['Faites cuire la carotte, l’oignon et les pommes de terre dans un bouillon 15 minutes.', 'Ajoutez la betterave râpée et laissez mijoter 5 minutes.', 'Servez avec un œuf dur et une cuillère de yaourt.']],
  ['pl-m2', 'pl', 'm', 'Poulet, pommes de terre & salade de chou', 30, [['Blanc de poulet', 150], ['Pommes de terre', 200], ['Chou blanc', 120], ['Carotte', 40], ['Yaourt nature', 40]], ['Faites cuire les pommes de terre.', 'Saisissez le poulet 5 minutes de chaque côté.', 'Mélangez le chou et la carotte râpés avec le yaourt et servez.']],
  ['pl-s1', 'pl', 's', 'Kéfir & pomme', 2, [['Kéfir', 250], ['Pomme', 120]], ['Coupez la pomme.', 'Servez avec le kéfir bien frais.', 'Ajoutez une pincée de cannelle si vous aimez.']],

  ['nl-b1', 'nl', 'b', 'Pain complet, gouda & crudités', 5, [['Pain complet', 70], ['Fromage gouda', 25], ['Concombre', 60], ['Tomates', 60]], ['Tranchez le pain.', 'Garnissez de gouda, de concombre et de tomate.', 'Servez avec un thé ou un verre d’eau.']],
  ['nl-m1', 'nl', 'm', 'Purée au chou kale & saucisse (stamppot)', 30, [['Pommes de terre', 220], ['Chou kale', 150], ['Saucisse de volaille', 100], ['Lait demi-écrémé', 50], ['Moutarde', 10]], ['Faites cuire les pommes de terre et le chou 20 minutes.', 'Écrasez avec le lait.', 'Servez avec la saucisse grillée et la moutarde.']],
  ['nl-m2', 'nl', 'm', 'Hareng, pommes de terre & haricots verts', 20, [['Hareng', 120], ['Pommes de terre', 200], ['Haricots verts', 150], ['Oignon', 20], ['Citron', 10]], ['Faites cuire les pommes de terre et les haricots verts.', 'Servez avec le hareng et l’oignon émincé.', 'Ajoutez un filet de citron.']],
  ['nl-s1', 'nl', 's', 'Skyr, fruits rouges & avoine', 3, [['Skyr', 150], ['Fruits rouges', 100], ['Flocons d’avoine', 20]], ['Versez le skyr dans un bol.', 'Ajoutez les fruits rouges.', 'Parsemez de flocons d’avoine.']],

  ['id-b1', 'id', 'b', 'Riz sauté léger aux œufs (nasi goreng)', 15, [['Riz cuit', 150], ['Œufs', 100], ['Petits pois', 40], ['Carotte', 40], ['Sauce soja', 10], ['Épices', 2]], ['Faites sauter la carotte et les petits pois 3 minutes.', 'Ajoutez le riz et la sauce soja, puis les œufs battus.', 'Remuez jusqu’à ce que les œufs soient cuits.']],
  ['id-m1', 'id', 'm', 'Gado-gado : légumes, tofu & sauce cacahuète', 25, [['Tofu', 150], ['Pommes de terre', 100], ['Haricots verts', 100], ['Chou blanc', 80], ['Œufs', 50], ['Beurre de cacahuète', 20], ['Sauce soja', 5]], ['Faites cuire les pommes de terre et les haricots verts.', 'Faites dorer le tofu.', 'Délayez le beurre de cacahuète avec de l’eau et la sauce soja, versez sur les légumes.']],
  ['id-m2', 'id', 'm', 'Poulet satay, riz & concombre', 25, [['Blanc de poulet', 150], ['Beurre de cacahuète', 15], ['Sauce soja', 10], ['Riz cuit', 150], ['Concombre', 100]], ['Faites mariner le poulet en cubes avec la sauce soja.', 'Grillez les brochettes 8 minutes.', 'Servez avec le riz, le concombre et une sauce au beurre de cacahuète allongée d’eau.']],
  ['id-s1', 'id', 's', 'Tempeh grillé & sauce soja', 10, [['Tempeh', 100], ['Sauce soja', 8]], ['Coupez le tempeh en tranches.', 'Faites-le griller 3 minutes de chaque côté.', 'Arrosez de sauce soja.']],
];

function macros(ingredients) {
  const t = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  for (const [name, grams] of ingredients) {
    const n = INGREDIENTS[name];
    if (!n) continue;
    t.kcal += n[0] * grams / 100; t.protein += n[1] * grams / 100; t.carbs += n[2] * grams / 100; t.fat += n[3] * grams / 100; t.fiber += n[4] * grams / 100;
  }
  return { kcal: Math.round(t.kcal), protein: Math.round(t.protein), carbs: Math.round(t.carbs), fat: Math.round(t.fat), fiber: Math.round(t.fiber) };
}

const TYPE_CATEGORY = { b: 'Petit-déjeuner', m: 'Déjeuner', s: 'Collation' };

export const WORLD_RECIPES = R.map(([id, cuisine, type, name, prep, ingredients, steps]) => {
  const kinds = new Set(ingredients.map(([n]) => INGREDIENTS[n]?.[6]).filter(Boolean));
  const m = macros(ingredients);
  const tags = [];
  if (!kinds.has('m') && !kinds.has('f')) tags.push('végétarien');
  if (kinds.has('f') && !kinds.has('m')) tags.push('poisson');
  if (m.protein >= 30) tags.push('protéiné');
  if (prep <= 15) tags.push('rapide');
  return { id, cuisine, type, name, category: TYPE_CATEGORY[type], prep: `${prep} min`, prepMin: prep, difficulty: prep <= 15 ? 'Facile' : 'Moyen', ingredients, steps, tags, meat: kinds.has('m'), fish: kinds.has('f'), ...m };
});

export function ingredientAisle(name) {
  const n = INGREDIENTS[name];
  return n ? AISLES[n[5]] : null;
}

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
  'Pâtes cuites': [158, 5.8, 31, 0.9, 1.8, 'S', ''],
  'Fraises': [32, 0.7, 7.7, 0.3, 2, 'F', ''],
  'Chocolat noir 70%': [598, 7.8, 46, 43, 11, 'X', ''],
  'Pâte à pizza': [266, 8, 50, 3.5, 2, 'S', ''],
  'Wakame': [45, 3, 9, 0.6, 0.5, 'L', ''],
  'Blancs d’œufs': [52, 10.9, 0.7, 0.2, 0, 'P', ''],
  'Butternut': [45, 1, 12, 0.1, 2, 'L', ''],
  'Tilapia': [96, 20, 0, 1.7, 0, 'P', 'f'],
  'Protéine whey': [380, 78, 8, 6, 0, 'D', ''],
  'Filet de porc': [121, 21, 0, 3.5, 0, 'P', 'm'],
  'Gochujang': [240, 5, 50, 2, 2, 'X', ''],
  'Chou-fleur': [25, 1.9, 5, 0.3, 2, 'L', ''],
  'Cottage': [98, 11.1, 3.4, 4.3, 0, 'D', ''],
  'Radis': [16, 0.7, 3.4, 0.1, 1.6, 'L', ''],
  'Daikon': [18, 0.6, 4.1, 0.1, 1.6, 'L', ''],
  'Pesto': [450, 5, 6, 45, 1, 'X', ''],
  'Galettes de riz': [387, 8, 81, 2.8, 4.2, 'S', ''],
  'Tortilla de blé': [310, 8, 52, 8, 3, 'S', ''],
  'Asperges': [20, 2.2, 3.9, 0.1, 2.1, 'L', ''],
  'Paneer': [321, 21, 3.6, 25, 0, 'D', ''],
  'Noix de cajou': [553, 18, 30, 44, 3.3, 'X', ''],
  'Truite': [141, 20, 0, 6.6, 0, 'P', 'f'],
  'Halloumi': [321, 21, 2, 25, 0, 'D', ''],
  'Graines de lin': [534, 18, 29, 42, 27, 'X', ''],
  'Maquereau': [205, 19, 0, 14, 0, 'P', 'f'],
  'Tahini': [595, 17, 21, 54, 9, 'X', ''],
  'Abricots secs': [241, 3.4, 63, 0.5, 7.3, 'F', ''],
  'Graines de courge': [559, 30, 11, 49, 6, 'X', ''],
  'Kiwi': [61, 1.1, 15, 0.5, 3, 'F', ''],
  'Ananas': [50, 0.5, 13, 0.1, 1.4, 'F', ''],
  'Sirop d’érable': [260, 0, 67, 0.1, 0, 'X', ''],
  'Pois cassés cuits': [118, 8.3, 21, 0.4, 8.3, 'P', ''],
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
  // Collections by goal: each recipe below was checked against the rule of every goal it lists (see GOAL_RULES).
  ['fr-lose1', 'fr', 'm', 'Velouté de courgette & cabillaud vapeur', 25, [['Cabillaud', 150], ['Courgette', 250], ['Pommes de terre', 100], ['Oignon', 40], ['Huile d’olive', 5], ['Herbes', 5]], ['Faites cuire courgette, pomme de terre et oignon 15 minutes dans un peu d’eau.', 'Mixez en velouté avec l’huile d’olive et les herbes.', 'Cuisez le cabillaud 8 minutes à la vapeur et servez-le sur le velouté.'], ['lose']],
  ['br-lose1', 'br', 'm', 'Poulet effiloché, haricots noirs & salade', 25, [['Blanc de poulet', 130], ['Haricots noirs cuits', 100], ['Salade', 80], ['Tomates', 100], ['Oignon', 30], ['Huile d’olive', 5]], ['Pochez le poulet 15 minutes puis effilochez-le à la fourchette.', 'Faites revenir l’oignon et ajoutez le poulet et les haricots.', 'Servez avec la salade et les tomates.'], ['lose']],
  ['it-lose1', 'it', 'm', 'Minestrone aux haricots blancs & parmesan', 35, [['Courgette', 120], ['Carotte', 80], ['Haricots blancs cuits', 120], ['Tomates', 150], ['Chou blanc', 80], ['Parmesan', 10], ['Huile d’olive', 5]], ['Coupez les légumes en dés et faites-les mijoter 25 minutes dans 400 ml d’eau.', 'Ajoutez les haricots blancs les 5 dernières minutes.', 'Servez avec un filet d’huile d’olive et le parmesan râpé.'], ['lose']],
  ['jp-lose1', 'jp', 'm', 'Soupe miso, tofu & wakame', 10, [['Miso', 20], ['Tofu', 150], ['Wakame', 10], ['Champignons', 60], ['Bok choy', 80]], ['Faites chauffer 400 ml d’eau sans la faire bouillir.', 'Ajoutez le tofu en dés, les champignons, le bok choy et le wakame 4 minutes.', 'Hors du feu, délayez le miso dans le bouillon.'], ['lose']],
  ['mx-lose1', 'mx', 'm', 'Bowl tex-mex dinde, haricots & salsa', 20, [['Dinde', 120], ['Haricots rouges cuits', 80], ['Maïs doux', 40], ['Salade', 60], ['Salsa tomate', 60], ['Avocat', 30]], ['Faites dorer la dinde en lamelles 6 minutes avec un peu d’épices.', 'Réchauffez les haricots et le maïs.', 'Dressez sur la salade avec la salsa et l’avocat.'], ['lose']],
  ['in-lose1', 'in', 'm', 'Dal de lentilles & épinards', 30, [['Lentilles cuites', 200], ['Épinards', 100], ['Tomates', 80], ['Oignon', 40], ['Épices', 3], ['Huile d’olive', 4]], ['Faites revenir l’oignon avec les épices (curcuma, cumin, gingembre).', 'Ajoutez tomates et lentilles et laissez mijoter 15 minutes.', 'Incorporez les épinards jusqu’à ce qu’ils fondent.'], ['lose', 'vegan']],
  ['kr-lose1', 'kr', 'm', 'Salade coréenne de poulet & kimchi', 15, [['Blanc de poulet', 120], ['Kimchi', 80], ['Concombre', 100], ['Carotte', 50], ['Graines de sésame', 4], ['Sauce soja', 8]], ['Pochez le poulet 12 minutes et coupez-le en lamelles.', 'Taillez le concombre et la carotte en bâtonnets.', 'Mélangez avec le kimchi, la sauce soja et le sésame.'], ['lose']],
  ['de-lose1', 'de', 'm', 'Hareng, pommes de terre vapeur & concombre', 20, [['Hareng', 100], ['Pommes de terre', 150], ['Concombre', 100], ['Yaourt nature', 40], ['Herbes', 5]], ['Cuisez les pommes de terre 15 minutes à la vapeur.', 'Mélangez le concombre en rondelles avec le yaourt et l’aneth.', 'Servez avec le hareng.'], ['lose']],
  ['us-lose1', 'us', 'b', 'Omelette de blancs, épinards & champignons', 10, [['Blancs d’œufs', 200], ['Œufs', 50], ['Épinards', 60], ['Champignons', 60], ['Pain complet', 30]], ['Faites tomber les épinards et les champignons 3 minutes à la poêle.', 'Versez les blancs battus avec l’œuf entier et laissez prendre.', 'Pliez l’omelette et servez avec le pain grillé.'], ['lose', 'cut']],
  ['me-lose1', 'me', 'm', 'Taboulé au poulet grillé', 20, [['Boulgour cuit', 120], ['Poulet grillé', 100], ['Tomates', 100], ['Concombre', 80], ['Herbes', 15], ['Citron', 20], ['Huile d’olive', 5]], ['Hachez finement le persil, la menthe, la tomate et le concombre.', 'Mélangez avec le boulgour, le jus de citron et l’huile.', 'Ajoutez le poulet grillé en tranches.'], ['lose', 'cut']],
  ['cn-lose1', 'cn', 'm', 'Sauté de crevettes & brocoli au gingembre', 15, [['Crevettes', 150], ['Brocoli', 200], ['Poivron', 60], ['Gingembre', 5], ['Sauce soja', 10], ['Huile de sésame', 4]], ['Faites sauter le brocoli et le poivron 4 minutes à feu vif.', 'Ajoutez les crevettes et le gingembre râpé 3 minutes.', 'Déglacez à la sauce soja et finissez avec l’huile de sésame.'], ['lose', 'cut']],
  ['fr-lose2', 'fr', 's', 'Crudités & houmous au skyr', 5, [['Carotte', 80], ['Concombre', 80], ['Poivron', 60], ['Houmous', 40], ['Skyr', 60]], ['Coupez les légumes en bâtonnets.', 'Mélangez le houmous avec le skyr.', 'Trempez les bâtonnets dans la sauce.'], ['lose']],
  ['pl-lose1', 'pl', 'm', 'Barszcz (soupe de betterave) & œufs', 30, [['Betterave cuite', 200], ['Chou blanc', 80], ['Carotte', 60], ['Œufs', 100], ['Yaourt nature', 40], ['Herbes', 5]], ['Faites mijoter betterave, chou et carotte 20 minutes dans 500 ml d’eau.', 'Cuisez les œufs 9 minutes.', 'Servez la soupe avec les œufs, le yaourt et l’aneth.'], ['lose']],
  ['tr-lose1', 'tr', 'm', 'Soupe de lentilles turque & yaourt', 25, [['Lentilles cuites', 180], ['Carotte', 60], ['Oignon', 40], ['Yaourt nature', 60], ['Épices', 2], ['Huile d’olive', 5]], ['Faites revenir l’oignon et la carotte avec le cumin et le paprika.', 'Ajoutez les lentilles et 300 ml d’eau, mijotez 15 minutes et mixez.', 'Servez avec le yaourt et un filet de citron.'], ['lose']],
  ['br-mus1', 'br', 'm', 'Assiette brésilienne : riz, haricots, bœuf & œuf', 30, [['Riz cuit', 200], ['Haricots noirs cuits', 120], ['Bœuf (rumsteck)', 150], ['Œufs', 50], ['Salade', 50], ['Huile d’olive', 8]], ['Saisissez le bœuf 3 minutes de chaque côté et laissez reposer.', 'Faites cuire l’œuf au plat.', 'Servez avec le riz, les haricots et la salade.'], ['muscle']],
  ['us-mus1', 'us', 'm', 'Burger de bœuf maison & patate douce rôtie', 30, [['Pain burger', 80], ['Steak haché 5%', 150], ['Mozzarella', 30], ['Salade', 30], ['Tomates', 50], ['Patate douce cuite', 200], ['Huile d’olive', 6]], ['Rôtissez la patate douce en frites 25 minutes à 200 °C avec l’huile.', 'Cuisez le steak 3 minutes par face et ajoutez la mozzarella.', 'Montez le burger avec salade et tomate.'], ['muscle']],
  ['it-mus1', 'it', 'm', 'Pâtes complètes bolognaise de bœuf', 30, [['Pâtes complètes cuites', 250], ['Steak haché 5%', 150], ['Sauce tomate', 150], ['Oignon', 40], ['Parmesan', 15], ['Huile d’olive', 6]], ['Faites revenir l’oignon puis la viande hachée 5 minutes.', 'Ajoutez la sauce tomate et laissez mijoter 15 minutes.', 'Mélangez aux pâtes et servez avec le parmesan.'], ['muscle']],
  ['in-mus1', 'in', 'm', 'Poulet tikka, riz basmati & yaourt', 35, [['Blanc de poulet', 180], ['Yaourt nature', 100], ['Riz cuit', 220], ['Épices', 5], ['Oignon', 40], ['Tomates', 80], ['Huile d’olive', 8]], ['Faites mariner le poulet dans le yaourt et les épices 15 minutes.', 'Grillez-le à la poêle 8 minutes puis ajoutez oignon et tomates.', 'Servez avec le riz basmati.'], ['muscle', 'post']],
  ['jp-mus1', 'jp', 'm', 'Bowl teriyaki de saumon, riz & edamame', 25, [['Saumon', 150], ['Riz cuit', 220], ['Edamame', 80], ['Sauce soja', 12], ['Miel', 8], ['Concombre', 60]], ['Mélangez sauce soja et miel pour la sauce teriyaki.', 'Faites dorer le saumon 4 minutes par face et laquez-le de sauce.', 'Servez sur le riz avec edamame et concombre.'], ['muscle']],
  ['mx-mus1', 'mx', 'm', 'Burrito bowl de bœuf, riz & haricots', 25, [['Bœuf (rumsteck)', 150], ['Riz cuit', 180], ['Haricots noirs cuits', 100], ['Maïs doux', 50], ['Avocat', 50], ['Salsa tomate', 60], ['Mozzarella', 20]], ['Saisissez le bœuf en lamelles avec cumin et paprika.', 'Réchauffez le riz, les haricots et le maïs.', 'Dressez le bol avec l’avocat, la salsa et le fromage.'], ['muscle']],
  ['fr-mus1', 'fr', 'b', 'Porridge protéiné banane & beurre de cacahuète', 10, [['Flocons d’avoine', 80], ['Lait demi-écrémé', 250], ['Protéine whey', 30], ['Banane', 120], ['Beurre de cacahuète', 20]], ['Faites cuire l’avoine dans le lait 5 minutes.', 'Hors du feu, incorporez la protéine.', 'Garnissez de banane et de beurre de cacahuète.'], ['muscle']],
  ['kr-mus1', 'kr', 'm', 'Bibimbap au bœuf & œuf', 30, [['Riz cuit', 220], ['Bœuf (rumsteck)', 130], ['Œufs', 50], ['Épinards', 80], ['Carotte', 60], ['Gochujang', 15], ['Huile de sésame', 5]], ['Faites sauter le bœuf en lamelles 3 minutes, puis les légumes séparément.', 'Cuisez l’œuf au plat.', 'Disposez tout sur le riz et servez avec le gochujang.'], ['muscle']],
  ['de-mus1', 'de', 'm', 'Filet de porc, purée & chou braisé', 30, [['Filet de porc', 180], ['Pommes de terre', 350], ['Lait demi-écrémé', 100], ['Chou blanc', 120], ['Moutarde', 10], ['Huile d’olive', 8]], ['Saisissez le filet de porc puis finissez 12 minutes au four à 180 °C.', 'Écrasez les pommes de terre cuites avec le lait chaud.', 'Faites braiser le chou 10 minutes et servez avec la moutarde.'], ['muscle']],
  ['me-mus1', 'me', 'm', 'Shawarma de poulet, pita & houmous', 25, [['Blanc de poulet', 170], ['Pain pita complet', 100], ['Houmous', 60], ['Tomates', 60], ['Concombre', 60], ['Sauce yaourt', 40], ['Épices', 3]], ['Faites mariner le poulet avec les épices shawarma et grillez-le 8 minutes.', 'Réchauffez la pita et tartinez-la de houmous.', 'Garnissez de poulet, crudités et sauce yaourt.'], ['muscle']],
  ['cn-mus1', 'cn', 'm', 'Nouilles sautées au bœuf & brocoli', 20, [['Nouilles de blé cuites', 250], ['Bœuf (rumsteck)', 150], ['Brocoli', 150], ['Sauce soja', 15], ['Huile de sésame', 8], ['Gingembre', 5]], ['Saisissez le bœuf en lamelles 2 minutes à feu vif.', 'Faites sauter le brocoli avec le gingembre 4 minutes.', 'Ajoutez les nouilles et la sauce soja et mélangez 2 minutes.'], ['muscle']],
  ['id-mus1', 'id', 'm', 'Nasi goreng au poulet & œuf', 25, [['Riz cuit', 250], ['Blanc de poulet', 140], ['Œufs', 50], ['Petits pois', 60], ['Sauce soja', 12], ['Huile d’olive', 10], ['Oignon', 40]], ['Faites revenir l’oignon et le poulet en dés 6 minutes.', 'Ajoutez le riz, les petits pois et la sauce soja et faites sauter 4 minutes.', 'Servez avec un œuf au plat.'], ['muscle']],
  ['es-mus1', 'es', 'm', 'Paëlla poulet & crevettes', 40, [['Riz cuit', 220], ['Blanc de poulet', 120], ['Crevettes', 100], ['Petits pois', 60], ['Poivron', 60], ['Tomates', 60], ['Huile d’olive', 10]], ['Faites dorer le poulet puis le poivron et la tomate.', 'Ajoutez le riz, le safran et un peu de bouillon, mijotez 10 minutes.', 'Ajoutez crevettes et petits pois les 5 dernières minutes.'], ['muscle', 'post']],
  ['nl-mus1', 'nl', 'm', 'Stamppot au chou kale & saucisse de volaille', 30, [['Pommes de terre', 350], ['Chou kale', 150], ['Saucisse de volaille', 150], ['Lait demi-écrémé', 80], ['Moutarde', 10]], ['Faites cuire les pommes de terre 15 minutes, ajoutez le chou les 5 dernières.', 'Écrasez avec le lait chaud.', 'Servez avec la saucisse grillée et la moutarde.'], ['muscle']],
  ['fr-cut1', 'fr', 'm', 'Blanc de poulet, haricots verts & riz complet', 20, [['Blanc de poulet', 180], ['Haricots verts', 200], ['Riz complet cuit', 100], ['Huile d’olive', 5], ['Herbes', 5]], ['Faites cuire le poulet à la poêle 6 minutes par face.', 'Cuisez les haricots verts 8 minutes à la vapeur.', 'Servez avec le riz complet et les herbes.'], ['cut']],
  ['br-cut1', 'br', 'm', 'Tilapia grillée, purée de potiron & salade', 20, [['Tilapia', 200], ['Butternut', 200], ['Salade', 80], ['Citron', 10], ['Huile d’olive', 5]], ['Cuisez le potiron 15 minutes et écrasez-le en purée.', 'Grillez le tilapia 3 minutes par face avec le citron.', 'Servez avec la salade.'], ['cut']],
  ['us-cut1', 'us', 'm', 'Salade de dinde, pomme & noix', 15, [['Dinde', 160], ['Salade', 100], ['Pomme', 100], ['Noix', 10], ['Yaourt grec', 60], ['Moutarde', 5]], ['Faites griller la dinde 5 minutes par face et coupez-la en lamelles.', 'Mélangez yaourt et moutarde pour la sauce.', 'Assemblez salade, pomme, noix et dinde.'], ['cut']],
  ['jp-cut1', 'jp', 'm', 'Salade de soba au thon & concombre', 15, [['Thon au naturel', 150], ['Nouilles soba cuites', 150], ['Concombre', 100], ['Sauce soja', 10], ['Graines de sésame', 4]], ['Rincez les soba cuites à l’eau froide.', 'Mélangez avec le concombre en julienne et le thon émietté.', 'Assaisonnez de sauce soja et de sésame.'], ['cut']],
  ['it-cut1', 'it', 'm', 'Dinde à la tomate, courgettes & parmesan', 20, [['Dinde', 180], ['Courgette', 200], ['Sauce tomate', 120], ['Parmesan', 10], ['Herbes', 3]], ['Faites dorer les escalopes de dinde 4 minutes par face.', 'Ajoutez courgettes et sauce tomate et mijotez 10 minutes.', 'Servez avec le parmesan et le basilic.'], ['cut', 'lowcarb']],
  ['kr-cut1', 'kr', 'm', 'Bœuf bulgogi léger, riz & bok choy', 20, [['Bœuf (rumsteck)', 150], ['Riz cuit', 120], ['Bok choy', 150], ['Sauce soja', 12], ['Gingembre', 5], ['Ail', 5]], ['Faites mariner le bœuf émincé avec sauce soja, ail et gingembre.', 'Saisissez-le 3 minutes à feu vif.', 'Servez avec le riz et le bok choy sauté.'], ['cut']],
  ['mx-cut1', 'mx', 'm', 'Fajitas de poulet sans tortilla', 20, [['Blanc de poulet', 170], ['Poivron', 150], ['Oignon', 60], ['Haricots noirs cuits', 80], ['Salsa tomate', 60], ['Épices', 3]], ['Faites sauter le poulet en lanières avec les épices 6 minutes.', 'Ajoutez poivrons et oignon 5 minutes.', 'Servez avec les haricots noirs et la salsa.'], ['cut']],
  ['in-cut1', 'in', 'm', 'Cabillaud tandoori, chou-fleur rôti & yaourt', 25, [['Cabillaud', 200], ['Chou-fleur', 200], ['Yaourt nature', 80], ['Épices', 4], ['Huile d’olive', 5]], ['Enrobez le cabillaud de yaourt et d’épices tandoori.', 'Rôtissez le chou-fleur 20 minutes à 200 °C avec l’huile.', 'Cuisez le poisson 10 minutes au four et servez ensemble.'], ['cut', 'lowcarb']],
  ['de-cut1', 'de', 'b', 'Skyr protéiné, avoine & myrtilles', 3, [['Skyr', 300], ['Flocons d’avoine', 30], ['Myrtilles', 80], ['Protéine whey', 15]], ['Mélangez le skyr et la protéine.', 'Ajoutez les flocons d’avoine.', 'Garnissez de myrtilles.'], ['cut']],
  ['me-cut1', 'me', 'm', 'Brochettes de poulet & salade fattouche', 20, [['Blanc de poulet', 180], ['Salade', 80], ['Tomates', 100], ['Concombre', 100], ['Pain pita complet', 25], ['Citron', 15], ['Huile d’olive', 5], ['Herbes', 5]], ['Grillez les brochettes de poulet 10 minutes.', 'Faites griller la pita et cassez-la en morceaux.', 'Mélangez légumes, pita, citron, huile et menthe.'], ['cut']],
  ['cn-cut1', 'cn', 'm', 'Poisson vapeur au gingembre, bok choy & riz', 20, [['Cabillaud', 200], ['Bok choy', 200], ['Riz cuit', 120], ['Gingembre', 8], ['Sauce soja', 10], ['Huile de sésame', 3]], ['Cuisez le poisson 10 minutes à la vapeur avec le gingembre en julienne.', 'Faites cuire le bok choy 3 minutes à la vapeur.', 'Arrosez de sauce soja et d’huile de sésame, servez avec le riz.'], ['cut']],
  ['pl-cut1', 'pl', 'b', 'Cottage aux herbes, pain de seigle & radis', 5, [['Cottage', 280], ['Concombre', 100], ['Radis', 60], ['Pain de seigle', 50], ['Herbes', 5]], ['Mélangez le cottage avec la ciboulette et l’aneth.', 'Tranchez radis et concombre.', 'Servez avec le pain de seigle.'], ['cut']],
  ['tr-cut1', 'tr', 'm', 'Köfte de dinde, boulgour & salade', 25, [['Dinde', 170], ['Boulgour cuit', 120], ['Salade', 60], ['Tomates', 80], ['Yaourt nature', 50], ['Épices', 3], ['Oignon', 30]], ['Mélangez la dinde hachée avec l’oignon râpé et les épices, formez des boulettes.', 'Grillez-les 10 minutes.', 'Servez avec le boulgour, la salade et le yaourt.'], ['cut']],
  ['fr-post1', 'fr', 'm', 'Poulet basquaise & riz', 30, [['Blanc de poulet', 150], ['Riz cuit', 180], ['Poivron', 120], ['Tomates', 120], ['Oignon', 40], ['Huile d’olive', 6]], ['Faites dorer le poulet en morceaux 5 minutes dans l’huile.', 'Ajoutez oignon, poivron et tomates et laissez mijoter 15 minutes.', 'Servez sur le riz chaud.'], ['post']],
  ['br-post1', 'br', 'm', 'Riz, feijão & bœuf grillé', 25, [['Bœuf (rumsteck)', 130], ['Riz cuit', 150], ['Haricots noirs cuits', 100], ['Salade', 50], ['Tomates', 80]], ['Grillez le bœuf 3 à 4 minutes de chaque côté puis tranchez-le.', 'Réchauffez les haricots noirs avec un peu d’ail.', 'Servez avec le riz, la salade et les tomates.'], ['post']],
  ['us-post1', 'us', 'b', 'Pancakes protéinés avoine & banane', 15, [['Flocons d’avoine', 60], ['Blancs d’œufs', 150], ['Banane', 100], ['Skyr', 100], ['Myrtilles', 50]], ['Mixez les flocons, les blancs d’œufs et la moitié de la banane.', 'Cuisez de petits pancakes 2 minutes de chaque côté dans une poêle antiadhésive.', 'Servez avec le skyr, le reste de banane et les myrtilles.'], ['post']],
  ['jp-post1', 'jp', 'm', 'Oyakodon : poulet, œuf & riz', 20, [['Blanc de poulet', 140], ['Œufs', 50], ['Riz cuit', 180], ['Oignon', 50], ['Sauce soja', 12]], ['Faites cuire l’oignon émincé 3 minutes dans 80 ml d’eau et la sauce soja.', 'Ajoutez le poulet en lamelles et laissez cuire 6 minutes.', 'Versez l’œuf battu, couvrez 1 minute et servez sur le riz.'], ['post']],
  ['it-post1', 'it', 'm', 'Pâtes au thon, tomates & roquette', 15, [['Pâtes cuites', 200], ['Thon au naturel', 120], ['Tomates', 150], ['Roquette', 40], ['Huile d’olive', 6]], ['Faites cuire les pâtes al dente.', 'Réchauffez les tomates coupées avec l’huile et le thon émietté.', 'Mélangez aux pâtes et ajoutez la roquette au moment de servir.'], ['post']],
  ['mx-post1', 'mx', 'm', 'Arroz con pollo', 30, [['Blanc de poulet', 140], ['Riz cuit', 160], ['Petits pois', 60], ['Poivron', 60], ['Salsa tomate', 80], ['Épices', 3]], ['Faites dorer le poulet en dés avec les épices.', 'Ajoutez poivron, petits pois et salsa et laissez cuire 8 minutes.', 'Incorporez le riz et réchauffez 3 minutes.'], ['post']],
  ['in-post1', 'in', 'm', 'Poulet tikka & riz basmati', 30, [['Blanc de poulet', 150], ['Yaourt nature', 80], ['Riz cuit', 170], ['Épices', 4], ['Oignon', 40], ['Tomates', 100]], ['Faites mariner le poulet dans le yaourt et les épices 10 minutes.', 'Grillez-le 8 minutes puis ajoutez oignon et tomates 5 minutes.', 'Servez avec le riz basmati.'], ['post']],
  ['kr-post1', 'kr', 'm', 'Japchae au bœuf', 25, [['Bœuf (rumsteck)', 120], ['Nouilles de riz cuites', 180], ['Épinards', 60], ['Carotte', 50], ['Champignons', 50], ['Sauce soja', 10], ['Huile de sésame', 4]], ['Saisissez le bœuf en lamelles 3 minutes puis réservez.', 'Faites sauter carotte, champignons et épinards 4 minutes.', 'Ajoutez nouilles, bœuf, sauce soja et huile de sésame et mélangez.'], ['post']],
  ['de-post1', 'de', 'b', 'Quark, flocons d’avoine & pomme', 5, [['Fromage blanc 0%', 250], ['Flocons d’avoine', 50], ['Pomme', 120], ['Miel', 10]], ['Versez le fromage blanc dans un bol.', 'Ajoutez les flocons d’avoine et la pomme râpée.', 'Terminez avec le miel.'], ['post']],
  ['nl-post1', 'nl', 'b', 'Tartines de seigle, cottage & jambon', 5, [['Pain de seigle', 90], ['Cottage', 150], ['Jambon blanc', 50], ['Concombre', 60]], ['Faites griller légèrement le pain de seigle.', 'Tartinez de cottage.', 'Garnissez de jambon et de rondelles de concombre.'], ['post']],
  ['me-post1', 'me', 'm', 'Poulet shish taouk & boulgour', 30, [['Blanc de poulet', 150], ['Boulgour cuit', 170], ['Sauce yaourt', 50], ['Tomates', 80], ['Concombre', 80], ['Épices', 3]], ['Faites mariner le poulet avec les épices et un peu de citron.', 'Grillez les brochettes 10 minutes en les retournant.', 'Servez avec le boulgour, les crudités et la sauce yaourt.'], ['post']],
  ['cn-post1', 'cn', 'm', 'Riz sauté aux crevettes & petits pois', 15, [['Crevettes', 150], ['Riz cuit', 180], ['Œufs', 50], ['Petits pois', 60], ['Sauce soja', 10], ['Huile de sésame', 5]], ['Brouillez l’œuf dans le wok chaud puis réservez.', 'Faites sauter les crevettes et les petits pois 3 minutes.', 'Ajoutez le riz, l’œuf et la sauce soja et faites sauter 2 minutes.'], ['post']],
  ['fr-pre1', 'fr', 's', 'Tartine complète, banane & fromage blanc', 5, [['Pain complet', 50], ['Banane', 100], ['Fromage blanc 0%', 100], ['Miel', 8]], ['Faites griller le pain.', 'Tartinez de fromage blanc.', 'Ajoutez la banane en rondelles et le miel.'], ['pre']],
  ['br-pre1', 'br', 's', 'Tapioca à la banane & cannelle', 10, [['Tapioca (fécule)', 40], ['Banane', 100], ['Fromage frais léger', 30], ['Épices', 1]], ['Étalez la fécule dans une poêle chaude sans matière grasse jusqu’à ce qu’elle prenne.', 'Garnissez de banane écrasée et de fromage frais.', 'Pliez en deux et saupoudrez de cannelle.'], ['pre']],
  ['jp-pre1', 'jp', 's', 'Onigiri au saumon', 15, [['Riz cuit', 180], ['Saumon', 40], ['Algue nori', 3], ['Sauce soja', 5]], ['Faites cuire le saumon 8 minutes puis émiettez-le.', 'Formez deux boules de riz en plaçant le saumon au centre.', 'Entourez d’une bande de nori.'], ['pre']],
  ['us-pre1', 'us', 'b', 'Porridge aux myrtilles & sirop d’érable', 8, [['Flocons d’avoine', 50], ['Lait demi-écrémé', 200], ['Myrtilles', 80], ['Sirop d’érable', 10]], ['Faites cuire les flocons dans le lait 4 minutes en remuant.', 'Ajoutez les myrtilles.', 'Terminez avec le sirop d’érable.'], ['pre']],
  ['it-pre1', 'it', 's', 'Bruschetta tomate & ricotta', 10, [['Pain complet', 80], ['Tomates', 120], ['Ricotta', 30], ['Herbes', 3]], ['Faites griller les tranches de pain.', 'Tartinez de ricotta.', 'Ajoutez les tomates en dés et le basilic.'], ['pre']],
  ['mx-pre1', 'mx', 's', 'Tortillas de maïs, haricots & salsa', 10, [['Tortilla de maïs', 60], ['Haricots noirs cuits', 80], ['Salsa tomate', 60]], ['Réchauffez les tortillas à la poêle 30 secondes de chaque côté.', 'Écrasez grossièrement les haricots chauds.', 'Garnissez les tortillas et ajoutez la salsa.'], ['pre']],
  ['in-pre1', 'in', 's', 'Lassi à la mangue', 5, [['Yaourt nature', 150], ['Mangue', 150], ['Dattes', 15], ['Épices', 1]], ['Coupez la mangue et dénoyautez les dattes.', 'Mixez avec le yaourt et une pincée de cardamome.', 'Servez bien frais.'], ['pre']],
  ['kr-pre1', 'kr', 's', 'Patate douce rôtie & skyr', 10, [['Patate douce cuite', 180], ['Skyr', 100], ['Graines de sésame', 3]], ['Réchauffez la patate douce rôtie coupée en morceaux.', 'Saupoudrez de sésame grillé.', 'Servez avec le skyr à côté.'], ['pre']],
  ['me-pre1', 'me', 's', 'Pita, houmous & dattes', 5, [['Pain pita complet', 60], ['Houmous', 30], ['Concombre', 80], ['Dattes', 20]], ['Réchauffez la pita.', 'Tartinez de houmous et ajoutez le concombre.', 'Servez avec les dattes.'], ['pre']],
  ['de-pre1', 'de', 's', 'Galettes de riz, cottage & fraises', 5, [['Galettes de riz', 30], ['Cottage', 100], ['Fraises', 150], ['Miel', 8]], ['Tartinez les galettes de riz de cottage.', 'Ajoutez les fraises en tranches.', 'Terminez avec un filet de miel.'], ['pre']],
  ['fr-lc1', 'fr', 'm', 'Omelette aux champignons & salade', 12, [['Œufs', 180], ['Champignons', 100], ['Salade', 60], ['Parmesan', 10], ['Huile d’olive', 5]], ['Faites sauter les champignons 4 minutes dans l’huile.', 'Versez les œufs battus avec le parmesan et cuisez 3 minutes.', 'Servez avec la salade.'], ['lowcarb']],
  ['br-lc1', 'br', 'm', 'Moqueca de poisson sans riz', 30, [['Cabillaud', 180], ['Lait de coco léger', 80], ['Tomates', 100], ['Poivron', 80], ['Oignon', 30], ['Herbes', 5]], ['Disposez oignon, tomates et poivron en couches dans une cocotte.', 'Ajoutez le poisson en morceaux et le lait de coco.', 'Laissez mijoter 15 minutes à couvert et parsemez de coriandre.'], ['lowcarb', 'lose']],
  ['it-lc1', 'it', 'm', 'Courgettes farcies au bœuf & mozzarella', 35, [['Courgette', 300], ['Steak haché 5%', 130], ['Sauce tomate', 60], ['Mozzarella', 30]], ['Coupez les courgettes en deux et creusez-les.', 'Faites revenir la viande avec la chair de courgette et la sauce tomate.', 'Garnissez, ajoutez la mozzarella et enfournez 20 minutes à 200 °C.'], ['lowcarb']],
  ['jp-lc1', 'jp', 'm', 'Bowl de saumon, concombre & edamame sans riz', 10, [['Saumon', 130], ['Concombre', 120], ['Edamame', 60], ['Daikon', 60], ['Wakame', 5], ['Sauce soja', 10]], ['Réhydratez le wakame 5 minutes dans l’eau froide.', 'Coupez le saumon cuit, le concombre et le daikon en dés.', 'Assemblez avec les edamame et la sauce soja.'], ['lowcarb']],
  ['us-lc1', 'us', 'm', 'Burger sans pain, salade & avocat', 15, [['Steak haché 5%', 150], ['Salade', 80], ['Tomates', 80], ['Avocat', 40], ['Fromage gouda', 20], ['Moutarde', 5]], ['Cuisez le steak 3 minutes de chaque côté et posez le fromage dessus.', 'Disposez de grandes feuilles de salade à la place du pain.', 'Garnissez de tomate, d’avocat et de moutarde.'], ['lowcarb']],
  ['kr-lc1', 'kr', 'm', 'Tofu braisé & bok choy', 15, [['Tofu', 250], ['Bok choy', 150], ['Sauce soja', 12], ['Gochujang', 8], ['Huile de sésame', 4], ['Ail', 5]], ['Faites dorer le tofu en tranches dans l’huile de sésame.', 'Ajoutez l’ail, la sauce soja, le gochujang et 50 ml d’eau et laissez réduire 5 minutes.', 'Faites sauter le bok choy 2 minutes et servez ensemble.'], ['lowcarb', 'vegan']],
  ['in-lc1', 'in', 'm', 'Paneer tikka & chou-fleur rôti', 30, [['Paneer', 100], ['Chou-fleur', 220], ['Yaourt nature', 40], ['Épices', 4]], ['Enrobez le paneer en cubes de yaourt et d’épices.', 'Étalez avec le chou-fleur en fleurettes sur une plaque.', 'Rôtissez 20 minutes à 220 °C.'], ['lowcarb']],
  ['cn-lc1', 'cn', 'm', 'Poulet sauté au brocoli & gingembre', 15, [['Blanc de poulet', 150], ['Brocoli', 200], ['Gingembre', 8], ['Sauce soja', 10], ['Huile de sésame', 5], ['Ail', 5]], ['Saisissez le poulet en lamelles 4 minutes au wok.', 'Ajoutez le brocoli, l’ail, le gingembre et 3 cuillères d’eau, et faites sauter 4 minutes.', 'Assaisonnez de sauce soja et d’huile de sésame.'], ['lowcarb', 'cut']],
  ['de-lc1', 'de', 'm', 'Filet de porc, chou braisé & moutarde', 25, [['Filet de porc', 150], ['Chou blanc', 200], ['Moutarde', 10], ['Huile d’olive', 6], ['Oignon', 30]], ['Faites dorer le filet de porc 12 minutes en le retournant.', 'Faites fondre l’oignon et le chou émincé 10 minutes à couvert.', 'Tranchez le porc et servez avec le chou et la moutarde.'], ['lowcarb', 'cut']],
  ['me-lc1', 'me', 'm', 'Salade d’halloumi grillé & œufs', 15, [['Halloumi', 70], ['Œufs', 100], ['Salade', 80], ['Tomates', 100], ['Concombre', 100], ['Herbes', 5]], ['Faites cuire les œufs 9 minutes puis écalez-les.', 'Grillez l’halloumi en tranches 2 minutes de chaque côté.', 'Servez sur la salade, les tomates et le concombre avec la menthe.'], ['lowcarb']],
  ['tr-lc1', 'tr', 'm', 'Menemen aux œufs & poivrons', 15, [['Œufs', 180], ['Poivron', 120], ['Tomates', 150], ['Oignon', 30], ['Feta', 30], ['Huile d’olive', 5]], ['Faites fondre l’oignon et le poivron 5 minutes dans l’huile.', 'Ajoutez les tomates et laissez compoter 5 minutes.', 'Cassez les œufs, remuez doucement et ajoutez la feta.'], ['lowcarb']],
  ['pl-lc1', 'pl', 'm', 'Truite au four, concombre & aneth', 25, [['Truite', 170], ['Concombre', 150], ['Yaourt grec', 50], ['Herbes', 5], ['Citron', 15]], ['Enfournez la truite avec le citron 15 minutes à 200 °C.', 'Mélangez le concombre en rondelles avec le yaourt et l’aneth.', 'Servez la truite avec la salade de concombre.'], ['lowcarb']],
  ['nl-lc1', 'nl', 'm', 'Hareng, œufs & radis', 12, [['Hareng', 100], ['Œufs', 100], ['Radis', 80], ['Salade', 50]], ['Faites cuire les œufs 9 minutes puis coupez-les en quartiers.', 'Émincez les radis.', 'Servez le hareng avec les œufs, les radis et la salade.'], ['lowcarb']],
  ['id-lc1', 'id', 'm', 'Tempeh sauté & haricots verts', 15, [['Tempeh', 130], ['Haricots verts', 90], ['Sauce soja', 10], ['Ail', 5], ['Huile de sésame', 4]], ['Coupez le tempeh en bâtonnets et faites-le dorer 5 minutes.', 'Ajoutez les haricots verts et l’ail et faites sauter 5 minutes.', 'Assaisonnez avec la sauce soja.'], ['lowcarb', 'vegan']],
  ['fr-meno1', 'fr', 'm', 'Salade de lentilles, feta & noix', 10, [['Lentilles cuites', 150], ['Feta', 40], ['Noix', 15], ['Roquette', 50], ['Tomates', 100], ['Huile d’olive', 5]], ['Rincez et égouttez les lentilles.', 'Ajoutez la roquette, les tomates et la feta émiettée.', 'Assaisonnez et parsemez de noix concassées.'], ['meno']],
  ['jp-meno1', 'jp', 'm', 'Tofu, edamame & riz complet', 15, [['Tofu', 150], ['Edamame', 80], ['Riz complet cuit', 120], ['Brocoli', 100], ['Sauce soja', 10], ['Graines de sésame', 4]], ['Faites dorer le tofu en cubes 5 minutes.', 'Cuisez le brocoli et les edamame 4 minutes à la vapeur.', 'Servez sur le riz avec la sauce soja et le sésame.'], ['meno', 'vegan']],
  ['me-meno1', 'me', 'm', 'Bowl de pois chiches, kale & tahini', 15, [['Pois chiches cuits', 150], ['Tahini', 15], ['Chou kale', 80], ['Yaourt grec', 100], ['Tomates', 80]], ['Faites rôtir les pois chiches 10 minutes à la poêle avec du cumin.', 'Massez le kale avec un peu de citron.', 'Servez avec les tomates, le yaourt et le tahini.'], ['meno']],
  ['it-meno1', 'it', 'm', 'Sardines, haricots blancs & tomates', 10, [['Sardines en boîte', 90], ['Haricots blancs cuits', 150], ['Tomates', 120], ['Roquette', 40], ['Huile d’olive', 4]], ['Égouttez les sardines et les haricots.', 'Mélangez avec les tomates et la roquette.', 'Arrosez d’huile d’olive et de citron.'], ['meno']],
  ['kr-meno1', 'kr', 'm', 'Soupe de tofu soyeux & kimchi', 20, [['Tofu', 200], ['Œufs', 50], ['Courgette', 100], ['Champignons', 80], ['Kimchi', 50], ['Gochujang', 10], ['Pois chiches cuits', 60]], ['Faites revenir le kimchi 2 minutes puis ajoutez 400 ml d’eau et le gochujang.', 'Ajoutez courgette, champignons, pois chiches et tofu et laissez cuire 8 minutes.', 'Cassez l’œuf dans la soupe et servez dès qu’il est pris.'], ['meno']],
  ['in-meno1', 'in', 'm', 'Palak paneer & pois chiches', 25, [['Paneer', 70], ['Épinards', 200], ['Pois chiches cuits', 100], ['Tomates', 80], ['Épices', 4]], ['Faites fondre les épinards puis mixez-les avec les épices.', 'Ajoutez les tomates et les pois chiches et laissez mijoter 8 minutes.', 'Ajoutez le paneer en dés et réchauffez 3 minutes.'], ['meno']],
  ['us-meno1', 'us', 'b', 'Overnight oats skyr, lin & fruits rouges', 5, [['Flocons d’avoine', 50], ['Skyr', 150], ['Graines de lin', 10], ['Fruits rouges', 100], ['Boisson soja', 100]], ['La veille, mélangez flocons, boisson soja, skyr et graines de lin moulues.', 'Laissez reposer une nuit au réfrigérateur.', 'Ajoutez les fruits rouges le matin.'], ['meno']],
  ['br-meno1', 'br', 'm', 'Saumon, quinoa & brocoli au sésame', 20, [['Saumon', 120], ['Quinoa cuit', 150], ['Brocoli', 150], ['Graines de sésame', 5]], ['Cuisez le saumon 12 minutes au four à 200 °C.', 'Faites cuire le brocoli 5 minutes à la vapeur.', 'Servez sur le quinoa et parsemez de sésame.'], ['meno']],
  ['cn-meno1', 'cn', 'm', 'Mapo tofu léger & brocoli', 20, [['Tofu', 200], ['Steak haché 5%', 50], ['Brocoli', 150], ['Riz complet cuit', 100], ['Sauce soja', 10], ['Ail', 5]], ['Faites revenir la viande avec l’ail 3 minutes.', 'Ajoutez le tofu en cubes, la sauce soja et 80 ml d’eau et laissez mijoter 5 minutes.', 'Servez avec le brocoli vapeur et le riz complet.'], ['meno']],
  ['de-meno1', 'de', 'b', 'Pain de seigle, cottage, radis & lin', 5, [['Pain de seigle', 70], ['Cottage', 150], ['Radis', 80], ['Graines de lin', 8]], ['Tartinez le pain de seigle de cottage.', 'Ajoutez les radis en fines rondelles.', 'Parsemez de graines de lin.'], ['meno']],
  ['tr-meno1', 'tr', 'm', 'Soupe de lentilles corail & yaourt', 30, [['Lentilles cuites', 200], ['Carotte', 80], ['Oignon', 40], ['Yaourt grec', 100], ['Épices', 3], ['Huile d’olive', 5]], ['Faites revenir l’oignon et la carotte avec le cumin.', 'Ajoutez les lentilles et 300 ml d’eau et laissez mijoter 15 minutes, puis mixez.', 'Servez avec le yaourt et un trait de citron.'], ['meno']],
  ['mx-meno1', 'mx', 'm', 'Enchiladas aux haricots noirs & épinards', 30, [['Tortilla de maïs', 60], ['Haricots noirs cuits', 150], ['Fromage frais léger', 40], ['Salsa tomate', 80], ['Épinards', 60], ['Yaourt grec', 50]], ['Faites fondre les épinards avec les haricots.', 'Garnissez les tortillas, roulez-les et nappez de salsa et de fromage frais.', 'Enfournez 15 minutes à 200 °C et servez avec le yaourt.'], ['meno']],
  ['fr-des1', 'fr', 's', 'Mousse au chocolat au skyr', 5, [['Skyr', 150], ['Cacao non sucré', 8], ['Chocolat noir 70%', 10], ['Miel', 8]], ['Faites fondre le chocolat 30 secondes au micro-ondes.', 'Fouettez le skyr avec le cacao, le miel et le chocolat fondu.', 'Laissez prendre 10 minutes au frais.'], ['dessert']],
  ['it-des1', 'it', 's', 'Tiramisu protéiné express', 10, [['Ricotta', 50], ['Skyr', 120], ['Galettes de riz', 10], ['Cacao non sucré', 5], ['Miel', 8]], ['Fouettez la ricotta, le skyr et le miel.', 'Émiettez la galette de riz imbibée de café froid au fond d’un verre.', 'Couvrez de crème et saupoudrez de cacao.'], ['dessert']],
  ['us-des1', 'us', 's', 'Cheesecake en verre au cottage & fraises', 10, [['Cottage', 150], ['Fraises', 120], ['Galettes de riz', 15], ['Miel', 8]], ['Mixez le cottage avec le miel jusqu’à obtenir une crème lisse.', 'Émiettez les galettes de riz au fond du verre.', 'Ajoutez la crème et les fraises.'], ['dessert']],
  ['br-des1', 'br', 's', 'Açaí bowl protéiné', 5, [['Pulpe d’açaí', 100], ['Banane', 60], ['Skyr', 100], ['Granola', 15]], ['Mixez la pulpe d’açaí surgelée avec la banane.', 'Versez sur le skyr.', 'Parsemez de granola.'], ['dessert']],
  ['jp-des1', 'jp', 's', 'Pudding soja, chia & mangue', 5, [['Boisson soja', 200], ['Graines de chia', 20], ['Mangue', 80]], ['Mélangez la boisson soja et les graines de chia.', 'Laissez gonfler au moins 2 heures au réfrigérateur.', 'Ajoutez la mangue en dés.'], ['dessert']],
  ['me-des1', 'me', 's', 'Yaourt grec, dattes & tahini', 5, [['Yaourt grec', 170], ['Dattes', 20], ['Tahini', 5]], ['Versez le yaourt dans un bol.', 'Ajoutez les dattes hachées.', 'Arrosez d’un filet de tahini.'], ['dessert']],
  ['de-des1', 'de', 's', 'Quark aux pommes & cannelle', 5, [['Fromage blanc 0%', 200], ['Pomme', 120], ['Amandes', 10], ['Épices', 2]], ['Râpez la pomme.', 'Mélangez-la au fromage blanc avec la cannelle.', 'Parsemez d’amandes effilées.'], ['dessert']],
  ['in-des1', 'in', 's', 'Shrikhand à la mangue', 5, [['Yaourt grec', 170], ['Mangue', 100], ['Épices', 1]], ['Fouettez le yaourt avec une pincée de cardamome.', 'Ajoutez la mangue en dés.', 'Servez bien frais.'], ['dessert']],
  ['nl-des1', 'nl', 's', 'Kwark, poire & cacao', 5, [['Fromage blanc 0%', 200], ['Poire', 120], ['Cacao non sucré', 5]], ['Coupez la poire en dés.', 'Mélangez le fromage blanc avec le cacao.', 'Ajoutez la poire.'], ['dessert']],
  ['kr-des1', 'kr', 's', 'Bingsu au yaourt & fruits', 10, [['Yaourt grec', 150], ['Fraises', 80], ['Kiwi', 70], ['Miel', 5]], ['Congelez le yaourt 1 heure puis grattez-le à la fourchette.', 'Disposez les fraises et le kiwi en morceaux.', 'Terminez avec le miel.'], ['dessert']],
  ['mx-des1', 'mx', 's', 'Banane rôtie, cottage & cannelle', 10, [['Banane', 100], ['Cottage', 120], ['Épices', 2], ['Miel', 5]], ['Coupez la banane en deux dans la longueur.', 'Faites-la dorer 2 minutes de chaque côté avec la cannelle.', 'Servez avec le cottage et le miel.'], ['dessert']],
  ['es-des1', 'es', 's', 'Yaourt, orange & amandes', 5, [['Yaourt grec', 170], ['Orange', 120], ['Amandes', 10]], ['Pelez l’orange à vif et coupez-la en segments.', 'Disposez-la sur le yaourt.', 'Parsemez d’amandes concassées.'], ['dessert']],
  ['pl-des1', 'pl', 's', 'Fromage blanc aux myrtilles', 5, [['Fromage blanc 0%', 200], ['Myrtilles', 100], ['Miel', 8]], ['Écrasez la moitié des myrtilles.', 'Mélangez-les au fromage blanc.', 'Ajoutez le reste des myrtilles et le miel.'], ['dessert']],
  ['fr-mp1', 'fr', 'm', 'Chili de dinde aux haricots rouges', 40, [['Dinde', 150], ['Haricots rouges cuits', 100], ['Tomates', 150], ['Poivron', 60], ['Oignon', 40], ['Riz complet cuit', 100], ['Épices', 3]], ['Faites dorer la dinde hachée avec l’oignon et les épices.', 'Ajoutez tomates, poivron et haricots et laissez mijoter 25 minutes.', 'Répartissez en boîtes avec le riz : se garde 4 jours au réfrigérateur.'], ['mealprep']],
  ['br-mp1', 'br', 'm', 'Escondidinho de poulet & manioc', 45, [['Blanc de poulet', 140], ['Manioc cuit', 150], ['Fromage frais léger', 30], ['Oignon', 30], ['Tomates', 60]], ['Pochez puis effilochez le poulet et faites-le revenir avec oignon et tomates.', 'Écrasez le manioc cuit en purée.', 'Montez en plat, gratinez 15 minutes : se garde 3 jours au réfrigérateur.'], ['mealprep']],
  ['it-mp1', 'it', 'm', 'Lasagnes légères bœuf & épinards', 60, [['Pâtes cuites', 120], ['Steak haché 5%', 130], ['Sauce tomate', 100], ['Épinards', 80], ['Ricotta', 50], ['Mozzarella', 20]], ['Faites revenir la viande puis ajoutez la sauce tomate 10 minutes.', 'Alternez pâtes, sauce, épinards et ricotta, puis la mozzarella.', 'Cuisez 30 minutes à 180 °C et coupez en parts : se garde 4 jours.'], ['mealprep']],
  ['in-mp1', 'in', 'm', 'Curry de poulet & pois chiches', 35, [['Blanc de poulet', 120], ['Pois chiches cuits', 100], ['Tomates', 120], ['Lait de coco léger', 60], ['Riz cuit', 120], ['Épices', 4]], ['Faites dorer le poulet en dés avec les épices.', 'Ajoutez tomates, pois chiches et lait de coco et laissez mijoter 20 minutes.', 'Répartissez avec le riz en boîtes : se garde 4 jours.'], ['mealprep']],
  ['mx-mp1', 'mx', 'm', 'Picadillo de bœuf, riz & haricots', 35, [['Steak haché 5%', 130], ['Riz cuit', 130], ['Haricots noirs cuits', 80], ['Poivron', 60], ['Salsa tomate', 60]], ['Faites revenir la viande et le poivron 6 minutes.', 'Ajoutez la salsa et les haricots et laissez mijoter 10 minutes.', 'Répartissez avec le riz en boîtes : se garde 4 jours.'], ['mealprep']],
  ['kr-mp1', 'kr', 'm', 'Porc bulgogi & riz', 30, [['Filet de porc', 150], ['Riz cuit', 150], ['Oignon', 40], ['Carotte', 50], ['Sauce soja', 12], ['Gochujang', 8], ['Huile de sésame', 4]], ['Faites mariner le porc émincé avec la sauce soja, le gochujang et l’huile de sésame.', 'Saisissez-le 5 minutes avec l’oignon et la carotte.', 'Répartissez avec le riz en boîtes : se garde 3 jours.'], ['mealprep']],
  ['cn-mp1', 'cn', 'm', 'Poulet kung pao & riz complet', 30, [['Blanc de poulet', 150], ['Riz complet cuit', 140], ['Poivron', 80], ['Courgette', 80], ['Noix de cajou', 10], ['Sauce soja', 10], ['Huile de sésame', 4]], ['Saisissez le poulet en dés 5 minutes au wok.', 'Ajoutez poivron et courgette 4 minutes, puis la sauce soja et les noix de cajou.', 'Répartissez avec le riz en boîtes : se garde 3 jours.'], ['mealprep']],
  ['us-mp1', 'us', 'm', 'Boulettes de dinde, patate douce & haricots verts', 40, [['Dinde', 150], ['Patate douce cuite', 180], ['Haricots verts', 120], ['Œufs', 25], ['Flocons d’avoine', 15], ['Épices', 3]], ['Mélangez la dinde hachée avec l’œuf, les flocons et les épices, puis formez des boulettes.', 'Enfournez-les 18 minutes à 200 °C avec la patate douce en cubes.', 'Ajoutez les haricots verts vapeur et répartissez : se garde 4 jours.'], ['mealprep']],
  ['me-mp1', 'me', 'm', 'Kefta de bœuf, boulgour & salade', 35, [['Steak haché 5%', 130], ['Boulgour cuit', 150], ['Tomates', 80], ['Concombre', 80], ['Sauce yaourt', 40], ['Herbes', 5]], ['Mélangez la viande avec les herbes et le cumin, puis formez des kefta.', 'Grillez-les 8 minutes en les retournant.', 'Répartissez avec le boulgour ; ajoutez crudités et sauce au moment de manger : se garde 4 jours.'], ['mealprep']],
  ['de-mp1', 'de', 'm', 'Goulasch de bœuf & pommes de terre', 75, [['Bœuf (rumsteck)', 140], ['Pommes de terre', 200], ['Poivron', 80], ['Oignon', 50], ['Sauce tomate', 60], ['Épices', 3]], ['Faites dorer le bœuf en cubes avec l’oignon et le paprika.', 'Ajoutez poivron, sauce tomate et 300 ml d’eau et laissez mijoter 50 minutes.', 'Ajoutez les pommes de terre 20 minutes avant la fin : se garde 4 jours.'], ['mealprep']],
  ['es-mp1', 'es', 'm', 'Lentilles à l’espagnole & saucisse de volaille', 35, [['Lentilles cuites', 200], ['Saucisse de volaille', 60], ['Carotte', 60], ['Poivron', 50], ['Oignon', 40], ['Épices', 2]], ['Faites revenir l’oignon, le poivron et la saucisse en rondelles avec le paprika.', 'Ajoutez la carotte, les lentilles et 200 ml d’eau et laissez mijoter 20 minutes.', 'Répartissez en boîtes : se garde 4 jours.'], ['mealprep']],
  ['id-mp1', 'id', 'm', 'Rendang léger de bœuf & riz', 60, [['Bœuf (rumsteck)', 130], ['Lait de coco léger', 60], ['Riz cuit', 150], ['Haricots verts', 100], ['Épices', 4]], ['Faites revenir le bœuf en cubes avec les épices.', 'Ajoutez le lait de coco et 200 ml d’eau et laissez mijoter 45 minutes jusqu’à réduction.', 'Répartissez avec le riz et les haricots verts : se garde 4 jours.'], ['mealprep']],
  ['tr-mp1', 'tr', 'm', 'Poulet & légumes au four, pilaf de boulgour', 40, [['Blanc de poulet', 150], ['Boulgour cuit', 150], ['Aubergine', 100], ['Poivron', 80], ['Yaourt nature', 60], ['Épices', 3]], ['Disposez le poulet et les légumes en morceaux sur une plaque avec les épices.', 'Rôtissez 25 minutes à 210 °C.', 'Répartissez avec le boulgour et le yaourt : se garde 4 jours.'], ['mealprep']],
  ['fr-veg1', 'fr', 'm', 'Ratatouille aux lentilles & quinoa', 35, [['Lentilles cuites', 150], ['Quinoa cuit', 100], ['Courgette', 120], ['Aubergine', 100], ['Tomates', 100], ['Huile d’olive', 6]], ['Faites mijoter courgette, aubergine et tomates avec l’huile 25 minutes.', 'Ajoutez les lentilles les 5 dernières minutes.', 'Servez sur le quinoa.'], ['vegan']],
  ['br-veg1', 'br', 'm', 'Feijoada végétale au tofu fumé', 35, [['Haricots noirs cuits', 200], ['Tofu', 100], ['Riz complet cuit', 120], ['Chou kale', 60], ['Oignon', 30], ['Orange', 60]], ['Faites dorer le tofu en dés avec l’oignon.', 'Ajoutez les haricots et 150 ml d’eau et laissez mijoter 20 minutes.', 'Servez avec le riz, le kale sauté et les quartiers d’orange.'], ['vegan']],
  ['it-veg1', 'it', 'm', 'Pâtes complètes, pois chiches & brocoli', 20, [['Pâtes complètes cuites', 170], ['Pois chiches cuits', 100], ['Brocoli', 120], ['Ail', 5], ['Huile d’olive', 6]], ['Faites cuire les pâtes et ajoutez le brocoli les 4 dernières minutes.', 'Faites dorer l’ail et les pois chiches dans l’huile.', 'Mélangez le tout.'], ['vegan']],
  ['jp-veg1', 'jp', 'm', 'Soba au tofu & edamame', 15, [['Nouilles soba cuites', 170], ['Tofu', 120], ['Edamame', 60], ['Concombre', 60], ['Sauce soja', 10], ['Graines de sésame', 4]], ['Faites cuire les soba puis rincez-les à l’eau froide.', 'Faites dorer le tofu en cubes.', 'Assemblez avec les edamame, le concombre, la sauce soja et le sésame.'], ['vegan']],
  ['in-veg1', 'in', 'm', 'Chana masala & riz complet', 30, [['Pois chiches cuits', 180], ['Tomates', 150], ['Oignon', 50], ['Épinards', 60], ['Riz complet cuit', 120], ['Épices', 4], ['Huile d’olive', 5]], ['Faites revenir l’oignon avec les épices.', 'Ajoutez tomates et pois chiches et laissez mijoter 15 minutes.', 'Incorporez les épinards et servez avec le riz.'], ['vegan']],
  ['mx-veg1', 'mx', 'm', 'Tacos de tempeh, haricots & avocat', 20, [['Tortilla de maïs', 60], ['Tempeh', 100], ['Haricots noirs cuits', 60], ['Salsa tomate', 60], ['Avocat', 40], ['Salade', 30]], ['Émiettez le tempeh et faites-le dorer avec les épices 6 minutes.', 'Réchauffez les tortillas et les haricots.', 'Garnissez avec salsa, avocat et salade.'], ['vegan']],
  ['me-veg1', 'me', 'm', 'Mujaddara : lentilles, boulgour & oignons', 30, [['Lentilles cuites', 180], ['Boulgour cuit', 100], ['Oignon', 80], ['Tomates', 80], ['Concombre', 80], ['Huile d’olive', 6]], ['Faites caraméliser l’oignon émincé dans l’huile 15 minutes.', 'Mélangez les lentilles et le boulgour chauds.', 'Couvrez d’oignons et servez avec tomates et concombre.'], ['vegan']],
  ['kr-veg1', 'kr', 'm', 'Bowl coréen au tofu & gochujang', 25, [['Tofu', 180], ['Riz cuit', 150], ['Épinards', 70], ['Carotte', 50], ['Champignons', 60], ['Gochujang', 12], ['Huile de sésame', 4]], ['Faites dorer le tofu en tranches.', 'Faites sauter séparément épinards, carotte et champignons.', 'Disposez sur le riz avec le gochujang dilué et l’huile de sésame.'], ['vegan']],
  ['cn-veg1', 'cn', 'm', 'Tofu sauté, bok choy & nouilles de riz', 15, [['Tofu', 180], ['Nouilles de riz cuites', 140], ['Bok choy', 120], ['Gingembre', 5], ['Sauce soja', 12], ['Huile de sésame', 4]], ['Faites dorer le tofu en cubes au wok.', 'Ajoutez le gingembre et le bok choy 3 minutes.', 'Incorporez les nouilles et la sauce soja et faites sauter 2 minutes.'], ['vegan']],
  ['de-veg1', 'de', 'm', 'Pommes de terre, tofu fumé & chou', 30, [['Tofu', 160], ['Pommes de terre', 200], ['Chou blanc', 150], ['Moutarde', 10], ['Huile d’olive', 5]], ['Faites cuire les pommes de terre 20 minutes.', 'Faites dorer le tofu et fondre le chou émincé dans l’huile.', 'Servez ensemble avec la moutarde.'], ['vegan']],
  ['id-veg1', 'id', 'm', 'Gado-gado au tempeh', 30, [['Tempeh', 120], ['Haricots verts', 80], ['Chou blanc', 80], ['Pommes de terre', 100], ['Concombre', 60], ['Beurre de cacahuète', 15]], ['Faites cuire les pommes de terre, puis blanchissez haricots verts et chou 3 minutes.', 'Faites dorer le tempeh en tranches.', 'Nappez de beurre de cacahuète détendu à l’eau chaude et au citron vert.'], ['vegan']],
  ['us-veg1', 'us', 'm', 'Bowl haricots noirs, patate douce & quinoa', 20, [['Haricots noirs cuits', 150], ['Patate douce cuite', 150], ['Quinoa cuit', 100], ['Avocat', 40], ['Salsa tomate', 50]], ['Rôtissez la patate douce en cubes 20 minutes à 210 °C.', 'Réchauffez les haricots et le quinoa.', 'Assemblez avec l’avocat et la salsa.'], ['vegan']],
  ['nl-veg1', 'nl', 'm', 'Soupe de pois cassés végétale', 40, [['Pois cassés cuits', 200], ['Carotte', 80], ['Pommes de terre', 120], ['Oignon', 40], ['Tofu', 80]], ['Faites revenir l’oignon et la carotte.', 'Ajoutez pois cassés, pommes de terre et 400 ml d’eau et laissez mijoter 25 minutes.', 'Ajoutez le tofu fumé en dés et réchauffez 5 minutes.'], ['vegan', 'meno']],
];

export function macros(ingredients) {
  const t = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  for (const [name, grams] of ingredients) {
    const n = INGREDIENTS[name];
    if (!n) continue;
    t.kcal += n[0] * grams / 100; t.protein += n[1] * grams / 100; t.carbs += n[2] * grams / 100; t.fat += n[3] * grams / 100; t.fiber += n[4] * grams / 100;
  }
  return { kcal: Math.round(t.kcal), protein: Math.round(t.protein), carbs: Math.round(t.carbs), fat: Math.round(t.fat), fiber: Math.round(t.fiber) };
}

// Values for one ingredient line (grams as weighed in the recipe).
export function ingredientMacros(name, grams) {
  const n = INGREDIENTS[name];
  if (!n) return null;
  return { kcal: n[0] * grams / 100, protein: n[1] * grams / 100, carbs: n[2] * grams / 100, fat: n[3] * grams / 100, fiber: n[4] * grams / 100 };
}

// Meat and fish are weighed raw: the protein shown is the protein of that raw weight.
// Names ending in "cuit(e)(s)" are weighed cooked.
const RAW = new Set(['Blanc de poulet', 'Dinde', 'Steak haché 5%', 'Bœuf (rumsteck)', 'Filet de porc', 'Saumon', 'Cabillaud', 'Tilapia', 'Truite', 'Maquereau', 'Crevettes']);
export function ingredientState(name) {
  if (RAW.has(name)) return 'cru';
  if (/cuite?s?\b/.test(name) || name === 'Pommes de terre' || name === 'Poulet grillé') return 'cuit';
  return '';
}

// Allergens per ingredient (the 14 regulated allergens that occur in this library).
const GLUTEN = /^(Pain |Pain$|Pâtes|Pâte à pizza|Couscous|Boulgour|Nouilles de blé|Nouilles soba|Chapati|Granola|Flocons d’avoine|Tortilla de blé|Sauce soja|Miso|Gochujang)/;
export const ALLERGENS = [
  ['gluten', 'Gluten', (n) => GLUTEN.test(n)],
  ['lactose', 'Lait / lactose', (n) => (INGREDIENTS[n]?.[5] === 'D' && !['Boisson soja', 'Lait de coco léger'].includes(n)) || n === 'Pesto'],
  ['egg', 'Œufs', (n) => n === 'Œufs' || n === 'Blancs d’œufs'],
  ['fish', 'Poisson', (n) => INGREDIENTS[n]?.[6] === 'f' && n !== 'Crevettes'],
  ['crust', 'Crustacés', (n) => n === 'Crevettes'],
  ['soy', 'Soja', (n) => ['Tofu', 'Tempeh', 'Edamame', 'Sauce soja', 'Boisson soja', 'Miso', 'Gochujang'].includes(n)],
  ['nuts', 'Fruits à coque', (n) => ['Amandes', 'Noix', 'Noix de cajou', 'Pesto'].includes(n)],
  ['peanut', 'Arachide', (n) => n === 'Beurre de cacahuète'],
  ['sesame', 'Sésame', (n) => ['Graines de sésame', 'Huile de sésame', 'Tahini', 'Houmous'].includes(n)],
  ['mustard', 'Moutarde', (n) => n === 'Moutarde'],
];

const CALCIUM = new Set(['Tofu', 'Tempeh', 'Edamame', 'Boisson soja', 'Sardines en boîte', 'Graines de sésame', 'Tahini', 'Amandes',
  'Chou kale', 'Brocoli', 'Haricots blancs cuits', 'Graines de lin', 'Paneer', 'Halloumi', 'Cottage', 'Pois chiches cuits']);
const ANIMAL = (n) => INGREDIENTS[n]?.[6] === 'm' || INGREDIENTS[n]?.[6] === 'f' || n === 'Miel' || n === 'Œufs' || n === 'Blancs d’œufs'
  || (INGREDIENTS[n]?.[5] === 'D' && !['Boisson soja', 'Lait de coco léger'].includes(n));
const hasCalcium = (ings) => ings.some(([n]) => CALCIUM.has(n) || (INGREDIENTS[n]?.[5] === 'D' && n !== 'Lait de coco léger'));

// One rule per goal, applied to the values of one portion. A recipe is listed under a goal only if it passes that rule.
export const GOAL_RULES = {
  lose: (r) => (r.type !== 's' && r.kcal <= 450 && (r.protein >= 20 || r.fiber >= 6)) || (r.type === 's' && r.kcal <= 200 && (r.protein >= 10 || r.fiber >= 5)),
  cut: (r) => r.protein >= 35 && r.kcal <= 500 && r.fat <= 15,
  muscle: (r) => r.kcal >= 550 && r.protein >= 35,
  meno: (r) => r.protein >= 20 && r.fiber >= 5 && hasCalcium(r.ingredients),
  post: (r) => r.protein >= 25 && r.carbs >= 40,
  pre: (r) => r.carbs >= 35 && r.fat <= 10 && r.kcal <= 450,
  lowcarb: (r) => r.carbs <= 20 && r.protein >= 20,
  dessert: (r) => r.type === 's' && r.kcal <= 300 && r.protein >= 10,
  mealprep: (r) => r.protein >= 25,
  vegan: (r) => r.vegan && r.protein >= 12,
};
// Goals given to recipes that were not written for one collection: at most two, most specific first.
// Desserts and batch cooking are only given to recipes written for them.
const AUTO_ORDER = ['lowcarb', 'meno', 'vegan', 'muscle', 'cut', 'pre', 'lose', 'post'];

// Adds computed nutrition, allergens, diet flags and goals to a recipe { id, type, prepMin, ingredients, goals? }.
export function enrichRecipe(r) {
  const m = macros(r.ingredients);
  const names = r.ingredients.map(([n]) => n);
  const kinds = new Set(names.map((n) => INGREDIENTS[n]?.[6]).filter(Boolean));
  const allergens = ALLERGENS.filter(([, , test]) => names.some(test)).map(([code]) => code);
  const out = { ...r, ...m, meat: kinds.has('m'), fish: kinds.has('f'), vegan: !names.some(ANIMAL), allergens, glutenFree: !allergens.includes('gluten'), lactoseFree: !allergens.includes('lactose') };
  const explicit = (r.goals || []).filter((g) => GOAL_RULES[g]?.(out));
  out.goals = explicit.length ? explicit : AUTO_ORDER.filter((g) => GOAL_RULES[g](out)).slice(0, 2);
  out.goalsWritten = explicit.length > 0;
  // Main protein source: the line that brings the most protein.
  let best = null;
  for (const [n, g] of r.ingredients) { const v = ingredientMacros(n, g); if (v && (!best || v.protein > best.protein)) best = { name: n, grams: g, protein: Math.round(v.protein) }; }
  out.mainProtein = best;
  return out;
}

const TYPE_CATEGORY = { b: 'Petit-déjeuner', m: 'Déjeuner', s: 'Collation' };

export const WORLD_RECIPES = R.map(([id, cuisine, type, name, prep, ingredients, steps, goals]) => {
  const r = enrichRecipe({ id, cuisine, type, name, category: TYPE_CATEGORY[type], prep: `${prep} min`, prepMin: prep, difficulty: prep <= 15 ? 'Facile' : 'Moyen', ingredients, steps, goals: goals || [] });
  const tags = [];
  if (!r.meat && !r.fish) tags.push('végétarien');
  if (r.fish && !r.meat) tags.push('poisson');
  if (r.protein >= 30) tags.push('protéiné');
  if (prep <= 15) tags.push('rapide');
  r.tags = tags;
  return r;
});

export function ingredientAisle(name) {
  const n = INGREDIENTS[name];
  return n ? AISLES[n[5]] : null;
}

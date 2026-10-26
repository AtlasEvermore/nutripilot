import { LAUNCH_DICT } from './i18n-launch.js';
import { WORLD_RECIPES, CUISINES, INGREDIENTS, ingredientAisle, enrichRecipe, ingredientMacros, ingredientState, ALLERGENS } from './food.js';
import { EXTRA_EXERCISES, EQUIPMENT, EQUIP_OF, moveSvg } from './exercises.js';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const clone = (value) => {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
};

const app = $('#app');
const toastEl = $('#toast');

let config = {
  brand: 'NutriPilot',
  ai: false,
  supportEmail: 'support@atlasevermore.com',
  locked: true,
  legal: {},
};

const curatedRecipes = [
  {
    id: 'poulet-citron',
    name: 'Poulet citron, riz & courgettes',
    category: 'Déjeuner',
    tags: ['protéiné', 'rapide'],
    prep: '22 min',
    difficulty: 'Facile',
    kcal: 508,
    protein: 47,
    carbs: 53,
    fat: 12,
    fiber: 7,
    ingredients: [
      ['Blanc de poulet', 150], ['Riz cuit', 150], ['Courgette', 220], ['Huile d’olive', 8], ['Citron', 30], ['Herbes', 4],
    ],
    steps: ['Coupez et assaisonnez le poulet.', 'Faites revenir le poulet et les courgettes.', 'Ajoutez le riz chaud puis terminez avec citron et herbes.'],
  },
  {
    id: 'saumon-provencal',
    name: 'Saumon provençal & pommes de terre',
    category: 'Dîner',
    tags: ['oméga-3', 'satiétant'],
    prep: '30 min',
    difficulty: 'Facile',
    kcal: 535,
    protein: 38,
    carbs: 47,
    fat: 20,
    fiber: 8,
    ingredients: [
      ['Saumon', 140], ['Pommes de terre', 220], ['Tomates', 180], ['Haricots verts', 180], ['Huile d’olive', 6],
    ],
    steps: ['Rôtissez les pommes de terre.', 'Ajoutez tomates et haricots verts.', 'Cuisez le saumon séparément puis assemblez.'],
  },
  {
    id: 'bowl-dinde',
    name: 'Bowl dinde, quinoa & légumes croquants',
    category: 'Déjeuner',
    tags: ['protéiné', 'meal-prep'],
    prep: '20 min',
    difficulty: 'Facile',
    kcal: 470,
    protein: 43,
    carbs: 49,
    fat: 11,
    fiber: 10,
    ingredients: [
      ['Dinde', 150], ['Quinoa cuit', 150], ['Carotte', 100], ['Concombre', 120], ['Tomates', 120], ['Yaourt nature', 60],
    ],
    steps: ['Cuisez la dinde.', 'Préparez les crudités.', 'Assemblez avec quinoa et sauce au yaourt.'],
  },
  {
    id: 'pasta-tonno',
    name: 'Pâtes tomate, thon & épinards',
    category: 'Dîner',
    tags: ['plaisir', 'rapide'],
    prep: '18 min',
    difficulty: 'Facile',
    kcal: 520,
    protein: 39,
    carbs: 67,
    fat: 10,
    fiber: 9,
    ingredients: [
      ['Pâtes cuites', 180], ['Thon au naturel', 120], ['Sauce tomate', 160], ['Épinards', 120], ['Parmesan', 10],
    ],
    steps: ['Réchauffez la sauce et les épinards.', 'Ajoutez le thon.', 'Mélangez avec les pâtes et terminez avec le parmesan.'],
  },
  {
    id: 'omelette-avocat',
    name: 'Omelette, avocat & tartine complète',
    category: 'Petit-déjeuner',
    tags: ['rapide', 'satiétant'],
    prep: '12 min',
    difficulty: 'Facile',
    kcal: 435,
    protein: 27,
    carbs: 30,
    fat: 23,
    fiber: 9,
    ingredients: [
      ['Œufs', 150], ['Pain complet', 60], ['Avocat', 60], ['Tomates', 120], ['Roquette', 30],
    ],
    steps: ['Préparez l’omelette.', 'Toastez le pain.', 'Servez avec avocat, tomate et roquette.'],
  },
  {
    id: 'skyr-fruits',
    name: 'Skyr, fruits rouges & avoine',
    category: 'Petit-déjeuner',
    tags: ['sans cuisson', 'protéiné'],
    prep: '5 min',
    difficulty: 'Très facile',
    kcal: 365,
    protein: 29,
    carbs: 48,
    fat: 7,
    fiber: 9,
    ingredients: [
      ['Skyr', 250], ['Flocons d’avoine', 45], ['Fraises', 120], ['Myrtilles', 60], ['Amandes', 10],
    ],
    steps: ['Versez le skyr.', 'Ajoutez avoine et fruits.', 'Terminez avec les amandes.'],
  },
  {
    id: 'lentilles-feta',
    name: 'Salade tiède lentilles, feta & légumes',
    category: 'Déjeuner',
    tags: ['végétarien', 'fibres'],
    prep: '15 min',
    difficulty: 'Facile',
    kcal: 455,
    protein: 25,
    carbs: 55,
    fat: 15,
    fiber: 17,
    ingredients: [
      ['Lentilles cuites', 210], ['Feta', 45], ['Tomates', 140], ['Concombre', 120], ['Carotte', 80], ['Huile d’olive', 6],
    ],
    steps: ['Réchauffez légèrement les lentilles.', 'Ajoutez les légumes.', 'Terminez avec feta et vinaigrette légère.'],
  },
  {
    id: 'tofu-curry',
    name: 'Tofu curry léger & riz',
    category: 'Dîner',
    tags: ['végétarien', 'réconfort'],
    prep: '25 min',
    difficulty: 'Facile',
    kcal: 495,
    protein: 29,
    carbs: 58,
    fat: 18,
    fiber: 10,
    ingredients: [
      ['Tofu', 170], ['Riz cuit', 150], ['Brocoli', 180], ['Carotte', 100], ['Lait de coco léger', 70], ['Épices', 4],
    ],
    steps: ['Dorez le tofu.', 'Ajoutez légumes, curry et lait de coco.', 'Servez avec le riz.'],
  },
  {
    id: 'crevettes-patate',
    name: 'Crevettes, patate douce & légumes',
    category: 'Dîner',
    tags: ['protéiné', 'coloré'],
    prep: '24 min',
    difficulty: 'Facile',
    kcal: 445,
    protein: 40,
    carbs: 51,
    fat: 10,
    fiber: 11,
    ingredients: [
      ['Crevettes', 170], ['Patate douce cuite', 220], ['Brocoli', 180], ['Poivron', 120], ['Huile d’olive', 7],
    ],
    steps: ['Rôtissez la patate douce et les légumes.', 'Saisissez les crevettes.', 'Assemblez et assaisonnez.'],
  },
  {
    id: 'burger-maison',
    name: 'Burger maison & potatoes au four',
    category: 'Repas plaisir',
    tags: ['plaisir', 'équilibré'],
    prep: '30 min',
    difficulty: 'Moyen',
    kcal: 610,
    protein: 42,
    carbs: 66,
    fat: 21,
    fiber: 9,
    ingredients: [
      ['Steak haché 5%', 130], ['Pain burger', 75], ['Pommes de terre', 220], ['Tomates', 80], ['Salade', 50], ['Sauce yaourt', 35],
    ],
    steps: ['Cuisez les potatoes au four.', 'Cuisez le steak.', 'Montez le burger avec crudités et sauce au yaourt.'],
  },
  {
    id: 'pizza-maison',
    name: 'Pizza maison protéinée & salade',
    category: 'Repas plaisir',
    tags: ['plaisir', 'partage'],
    prep: '28 min',
    difficulty: 'Moyen',
    kcal: 585,
    protein: 36,
    carbs: 66,
    fat: 19,
    fiber: 8,
    ingredients: [
      ['Pâte à pizza', 120], ['Sauce tomate', 100], ['Mozzarella', 65], ['Jambon blanc', 80], ['Champignons', 120], ['Salade', 100],
    ],
    steps: ['Étalez la pâte et la sauce.', 'Ajoutez garniture et mozzarella.', 'Cuisez puis servez avec une grande salade.'],
  },
  {
    id: 'choco-skyr',
    name: 'Bowl chocolat, skyr & banane',
    category: 'Collation',
    tags: ['sucré', 'protéiné'],
    prep: '5 min',
    difficulty: 'Très facile',
    kcal: 310,
    protein: 24,
    carbs: 39,
    fat: 8,
    fiber: 6,
    ingredients: [
      ['Skyr', 200], ['Banane', 90], ['Chocolat noir 70%', 12], ['Flocons d’avoine', 20], ['Amandes', 6],
    ],
    steps: ['Versez le skyr.', 'Ajoutez banane et avoine.', 'Terminez avec chocolat et amandes.'],
  },
];

// ---- Nutrition v3: world recipe library, instant 7-day plan, smart swaps ----------
const RECIPE_TYPE = { 'Petit-déjeuner': 'b', Collation: 's' };
const MEAT_RE = /(poulet|dinde|steak|jambon|boeuf|bœuf|porc|saucisse)/i;
const FISH_RE = /(saumon|thon|crevette|cabillaud|poisson|sardine)/i;
const ALL_RECIPES = [
  // Calories and macros are always computed from the ingredient grams, never typed by hand.
  ...curatedRecipes.map((r) => enrichRecipe({ ...r, cuisine: r.cuisine || 'fr', type: RECIPE_TYPE[r.category] || 'm', prepMin: Number.parseInt(r.prep, 10) || 20 })),
  ...WORLD_RECIPES,
];
const LANG_CUISINE = { fr: 'fr', pt: 'br', es: 'es', it: 'it', de: 'de', en: 'us', nl: 'nl', pl: 'pl', tr: 'tr', ar: 'me', ja: 'jp', ko: 'kr', zh: 'cn', id: 'id', hi: 'in' };
const CUISINE_FLAG = Object.fromEntries(CUISINES.map(([k, , f]) => [k, f]));
const SLOT_PLANS = {
  2: [['m', 'Déjeuner', 0.5], ['m', 'Dîner', 0.5]],
  3: [['b', 'Petit-déjeuner', 0.25], ['m', 'Déjeuner', 0.38], ['m', 'Dîner', 0.37]],
  4: [['b', 'Petit-déjeuner', 0.23], ['m', 'Déjeuner', 0.34], ['m', 'Dîner', 0.32], ['s', 'Collation', 0.11]],
};
const ALLERGY_RULES = [
  [/(lactose|lait|laitier|dairy|milk|leite|lacteo|lácteo|latte|milch|laktose)/i, (n) => INGREDIENTS[n]?.[5] === 'D' && !['Boisson soja', 'Lait de coco léger'].includes(n)],
  [/(gluten|ble|blé|wheat|trigo|grano|weizen|frumento)/i, (n) => /(pain|pâte|pates|couscous|boulgour|pita|chapati|avoine|granola|soba|pizza|burger)/i.test(n)],
  [/(arachide|cacahu|peanut|amendoim|erdnuss|arachidi|mani)/i, (n) => n === 'Beurre de cacahuète'],
  [/(noix|nuts|nozes|nueces|nusse|nüsse|guscio|amande|almond|amendoa|amêndoa|mandel|mandorl)/i, (n) => ['Amandes', 'Noix'].includes(n)],
  [/(poisson|fish|peixe|pescado|fisch|pesce)/i, (n) => INGREDIENTS[n]?.[6] === 'f' && n !== 'Crevettes'],
  [/(crustac|crevette|shrimp|camar|gamba|garnel|gamber|fruits de mer|seafood|mariscos|frutos do mar)/i, (n) => n === 'Crevettes'],
  [/(oeuf|œuf|egg|ovo|huevo|\bei\b|eier|uova|uovo)/i, (n) => n === 'Œufs' || n === 'Œuf'],
  [/(soja|soy)/i, (n) => ['Tofu', 'Edamame', 'Sauce soja', 'Boisson soja'].includes(n)],
  [/(sesame|sésame|gergelim|sesam)/i, (n) => ['Graines de sésame', 'Houmous'].includes(n)],
];
let recipeCuisine = 'all';
let recipeType = 'all';
let recipeFilter = 'all';
// Recipe collections by goal. Each one states its criterion: a single recipe does not make anyone
// lose weight or build muscle; it fits a goal through its calories and macros.
const RECIPE_GOALS = [
  { id: 'lose', ico: 'flame', tone: 'm-nut', name: 'Pour maigrir', rule: 'Repas de 450 kcal ou moins avec ≥ 20 g de protéines ou ≥ 6 g de fibres pour tenir jusqu’au repas suivant ; collations de 200 kcal ou moins.' },
  { id: 'cut', ico: 'scale', tone: 'm-coach', name: 'Sèche & définition', rule: '≥ 35 g de protéines pour 500 kcal maximum et ≤ 15 g de lipides : beaucoup de protéines, peu de calories.' },
  { id: 'muscle', ico: 'dumbbell', tone: 'm-train', name: 'Prise de muscle', rule: '≥ 550 kcal et ≥ 35 g de protéines par portion pour couvrir un surplus calorique.' },
  { id: 'meno', ico: 'flower', tone: 'm-meno', name: 'Ménopause 40+', rule: '≥ 20 g de protéines, ≥ 5 g de fibres et une source de calcium ou de soja à chaque portion.' },
  { id: 'post', ico: 'heart', tone: 'm-sup', name: 'Après l’entraînement', rule: '≥ 25 g de protéines et ≥ 40 g de glucides pour réparer le muscle et refaire les réserves.' },
  { id: 'pre', ico: 'sparkle', tone: 'm-kit', name: 'Avant l’entraînement', rule: '≥ 35 g de glucides, ≤ 10 g de lipides et 450 kcal maximum : de l’énergie facile à digérer.' },
  { id: 'lowcarb', ico: 'grid', tone: 'm-vit', name: 'Pauvres en glucides', rule: '≤ 20 g de glucides et ≥ 20 g de protéines par portion.' },
  { id: 'dessert', ico: 'star', tone: 'm-rec', name: 'Desserts protéinés', rule: 'Douceurs de 300 kcal ou moins avec ≥ 10 g de protéines.' },
  { id: 'mealprep', ico: 'calendar', tone: 'm-scan', name: 'À préparer à l’avance', rule: '≥ 25 g de protéines, se cuisinent en une fois et se gardent 3 à 4 jours au réfrigérateur.' },
  { id: 'vegan', ico: 'leaf', tone: 'm-sleep', name: '100 % végétal', rule: 'Sans viande, poisson, laitages, œufs ni miel, avec ≥ 12 g de protéines végétales.' },
  { id: 'quick', ico: 'timer', tone: 'm-rec', name: 'Prêtes en 15 min', rule: '15 minutes ou moins', attr: (r) => r.prepMin <= 15 },
  { id: 'veg', ico: 'leaf', tone: 'm-sleep', name: 'Végétariennes', rule: 'Sans viande ni poisson', attr: (r) => !r.meat && !r.fish },
].map((g) => ({ ...g, test: g.attr || ((r) => (r.goals || []).includes(g.id)) }));
const GOAL_BY_ID = Object.fromEntries(RECIPE_GOALS.map((g) => [g.id, g]));
// Regions group the cuisines so each country's recipes are easy to find.
const RECIPE_REGIONS = [
  ['eu', 'Europe', '🇪🇺', ['fr', 'es', 'it', 'de', 'pl', 'nl']],
  ['am', 'Amériques', '🌎', ['us', 'mx', 'br']],
  ['asia', 'Asie', '🌏', ['as', 'jp', 'kr', 'cn', 'id']],
  ['east', 'Orient & Inde', '🕌', ['me', 'tr', 'in']],
];
let recipeRegion = 'all';
let recipeGoal = '';
let recipeQuery = '';

function planCuisines() {
  const p = state.profile || {};
  if (Array.isArray(p.cuisines) && p.cuisines.length) return p.cuisines;
  const base = LANG_CUISINE[lang()] || 'fr';
  if (p.cuisine === 'med') return [...new Set([base, 'it', 'es', 'me'])];
  if (p.cuisine === 'world') return CUISINES.map((c) => c[0]);
  // Smaller national collections are completed with the closest food culture for variety.
  const NEAR = { jp: ['as'], kr: ['as'], cn: ['as'], id: ['as'], tr: ['me'], pl: ['de'], nl: ['de'], br: ['mx'] };
  return [base, ...(NEAR[base] || [])];
}

function recipeAllowed(r) {
  const p = state.profile || {};
  if (p.diet === 'vegetarian' && (r.meat || r.fish)) return false;
  if (p.diet === 'pescatarian' && r.meat) return false;
  const text = String(p.allergies || '').trim();
  if (!text) return true;
  const rules = ALLERGY_RULES.filter(([re]) => re.test(text)).map(([, fn]) => fn);
  const words = text.split(/[,;/\n]+/).map((x) => foldText(x.trim())).filter((x) => x.length >= 3);
  return !r.ingredients.some(([n]) => rules.some((fn) => fn(n)) || words.some((w) => foldText(n).includes(w) || foldText(L(n, null, false)).includes(w)));
}

function scaledMeal(r, target, label) {
  const f = clamp(target / Math.max(1, r.kcal), 0.6, 1.7);
  const g5 = (g) => Math.max(5, Math.round(g * f / 5) * 5);
  return {
    type: label, name: r.name, recipeId: r.id, local: true, cuisine: r.cuisine,
    kcal: Math.round(r.kcal * f), protein: Math.round(r.protein * f), carbs: Math.round(r.carbs * f), fat: Math.round(r.fat * f), fiber: Math.round(r.fiber * f),
    prep: r.prep, ingredients: r.ingredients.map(([n, g]) => ({ name: n, grams: g5(g) })),
  };
}

function rankRecipes(type, target, used = new Set(), cuisines = planCuisines(), exclude = '') {
  const p = state.profile || {};
  const pool = ALL_RECIPES.filter((r) => r.type === type && r.id !== exclude && recipeAllowed(r));
  const quick = p.cooking === '<15 min';
  const score = (r) => (cuisines.includes(r.cuisine) ? 3 : 0.7)
    * (used.has(r.id) ? 0.12 : 1)
    * (p.diet === 'high-protein' || p.track === 'muscle' ? 1 + (r.protein * 4) / Math.max(1, r.kcal) * 3 : 1)
    * (p.diet === 'mediterranean' && ['it', 'es', 'me', 'fr'].includes(r.cuisine) ? 1.4 : 1)
    * (quick && r.prepMin > 18 ? 0.35 : 1)
    * (1 - Math.min(0.5, Math.abs(r.kcal - target) / Math.max(target, 1) / 2))
    * (0.55 + Math.random() * 0.9);
  return pool.map((r) => [r, score(r)]).sort((a, b) => b[1] - a[1]).map(([r]) => r);
}

function buildLocalWeek() {
  const p = state.profile;
  const slots = SLOT_PLANS[p.mealsPerDay] || SLOT_PLANS[3];
  const cuisines = planCuisines();
  const used = new Set();
  return Array.from({ length: 7 }, (_, i) => ({
    date: addDays(i), day: '',
    meals: slots.map(([type, label, part]) => {
      const target = p.dailyKcal * part;
      const r = rankRecipes(type, target, used, cuisines)[0];
      if (!r) return null;
      used.add(r.id);
      return scaledMeal(r, target, label);
    }).filter(Boolean),
  }));
}

function planDayLabel(day, i) {
  if (day.date) return new Date(`${day.date}T12:00:00`).toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'short' });
  return L(day.day || `Jour ${i + 1}`);
}
function mealTypeCode(label) { return label === 'Petit-déjeuner' ? 'b' : label === 'Collation' ? 's' : 'm'; }

async function generateWeek(button) {
  if (button.dataset.generateWeek === 'ai') return generateWeekAI(button);
  state.weekPlan = buildLocalWeek();
  state.planSource = 'local';
  state.shoppingChecked = {};
  saveState();
  track('WeekPlanGenerated', { source: 'library' });
  render();
  toast('Votre semaine est prête ✓');
}

async function generateWeekAI(button) {
  button.disabled = true;
  const original = button.innerHTML;
  button.textContent = L('Création de votre semaine…');
  try {
    const p = state.profile;
    const cuisineNames = planCuisines().map((c) => CUISINES.find((x) => x[0] === c)?.[1] || c).join(', ');
    const response = await apiFetch('/api/week-plan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dailyKcal: p.dailyKcal, protein: p.protein, diet: p.diet, allergies: p.allergies, cooking: p.cooking, cuisine: cuisineNames, budget: p.budget, mealsPerDay: p.mealsPerDay, goal: p.goal }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    if (String(data.source || '').startsWith('fallback')) {
      state.weekPlan = buildLocalWeek();
      state.planSource = 'local';
    } else {
      state.weekPlan = (data.days || []).map((d, i) => ({ ...d, date: addDays(i) }));
      state.planSource = 'ai';
    }
    state.shoppingChecked = {};
    saveState();
    track('WeekPlanGenerated', { source: state.planSource });
    render();
    toast('Votre semaine est prête ✓');
  } catch {
    state.weekPlan = buildLocalWeek();
    state.planSource = 'local';
    saveState();
    render();
    toast('Votre semaine est prête ✓');
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
}

function cuisinePicker() {
  const chosen = planCuisines();
  return `<div class="cuisine-row">${CUISINES.map(([k, name, flag]) => `<button class="cuisine-chip ${chosen.includes(k) ? 'on' : ''}" data-plan-cuisine="${k}"><span>${flag}</span>${L(name)}</button>`).join('')}</div>`;
}

function weekPlanHtml() {
  const p = state.profile;
  return `<div class="week-plan">${state.weekPlan.map((day, dayIndex) => {
    const sum = (day.meals || []).reduce((acc, m) => { ['kcal', 'protein', 'carbs', 'fat'].forEach((k) => { acc[k] += Number(m[k] || 0); }); return acc; }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
    return `<details class="plan-day" ${dayIndex === 0 ? 'open' : ''}><summary><span class="pd-date">${esc(planDayLabel(day, dayIndex))}</span><span class="pd-kcal">${fmt(sum.kcal)} kcal</span><span class="pd-bar"><i style="width:${clamp(sum.kcal / Math.max(1, p.dailyKcal) * 100, 0, 100)}%"></i></span></summary>
      <div class="day-meals">${(day.meals || []).map((meal, mealIndex) => {
        const r = meal.recipeId ? ALL_RECIPES.find((x) => x.id === meal.recipeId) : null;
        return `<div class="plan-meal">
          <div class="plan-meal-top"><span class="pm-flag">${r ? CUISINE_FLAG[r.cuisine] || '🍽️' : '✨'}</span><div><small>${esc(L(meal.type))} · ${esc(L(meal.prep || ''))}</small><b>${esc(L(meal.name))}</b></div><span class="pill">${fmt(meal.kcal)} kcal</span></div>
          <div class="meal-macro-line"><span>P ${fmt(meal.protein)} g</span><span>G ${fmt(meal.carbs)} g</span><span>L ${fmt(meal.fat)} g</span><span>${L('Fibres')} ${fmt(meal.fiber)} g</span></div>
          <div class="inline-actions three"><button class="chip-btn" data-add-plan-meal data-day="${dayIndex}" data-meal="${mealIndex}">${icon('plus')} ${L('Journal')}</button><button class="chip-btn" data-plan-recipe data-day="${dayIndex}" data-meal="${mealIndex}">${icon('book')} ${L('Recette')}</button><button class="chip-btn" data-swap-plan data-day="${dayIndex}" data-meal="${mealIndex}">${icon('swap')} ${L('Remplacer')}</button></div>
        </div>`;
      }).join('')}</div></details>`;
  }).join('')}</div>`;
}

function localRecipeView(meal) {
  const r = ALL_RECIPES.find((x) => x.id === meal.recipeId);
  if (!r) return null;
  return { ...r, kcal: meal.kcal, protein: meal.protein, carbs: meal.carbs, fat: meal.fat, fiber: meal.fiber, ingredients: (meal.ingredients || []).map((i) => [i.name, i.grams]) };
}

function planSwapSheet() {
  const { dayIndex, mealIndex } = modal;
  const meal = state.weekPlan?.[dayIndex]?.meals?.[mealIndex];
  if (!meal) return '';
  const used = new Set((state.weekPlan || []).flatMap((d) => (d.meals || []).map((m) => m.recipeId)));
  const options = rankRecipes(mealTypeCode(meal.type), meal.kcal, used, planCuisines(), meal.recipeId).slice(0, 6);
  return `<div class="sheet-head"><div><span class="tag">${esc(L(meal.type))}</span><h2>${L('Remplacer ce repas')}</h2><div class="fine">${L('Même objectif calorique, adapté à vos préférences.')}</div></div><button class="icon-btn" data-close>×</button></div>
    <div class="swap-list">${options.map((r) => { const m = scaledMeal(r, meal.kcal, meal.type); return `<button class="swap-option" data-swap-choose="${esc(r.id)}"><span class="pm-flag">${CUISINE_FLAG[r.cuisine] || '🍽️'}</span><span><b>${esc(L(r.name))}</b><small>${fmt(m.kcal)} kcal · P ${fmt(m.protein)} g · ${esc(L(r.prep))}</small></span><span class="guide-arrow">${icon('swap')}</span></button>`; }).join('') || `<div class="empty">${L('Aucune alternative avec vos préférences actuelles.')}</div>`}</div>
    <button class="btn btn-ghost btn-wide" data-swap-ai>${icon('sparkle')} ${L('Autre envie ? Idées sur mesure')}</button>`;
}

function planPickSheet() {
  const r = ALL_RECIPES.find((x) => x.id === modal.recipeId);
  const has = state.weekPlan?.length;
  return `<div class="sheet-head"><div><span class="tag">${L('Plan 7 jours')}</span><h2>${L('Ajouter à mon plan')}</h2><div class="fine">${esc(L(r?.name || ''))}</div></div><button class="icon-btn" data-close>×</button></div>
    ${has ? '' : `<p class="screen-sub">${L('Votre plan sera créé automatiquement, puis la recette ajoutée au jour choisi.')}</p>`}
    <div class="day-pick-grid">${Array.from({ length: 7 }, (_, i) => { const d = addDays(i); return `<button class="day-pick" data-plan-pick-day="${i}"><small>${esc(new Date(`${d}T12:00:00`).toLocaleDateString(locale(), { weekday: 'short' }))}</small><b>${new Date(`${d}T12:00:00`).getDate()}</b></button>`; }).join('')}</div>`;
}

function addRecipeToPlan(recipeId, dayIndex) {
  const r = ALL_RECIPES.find((x) => x.id === recipeId);
  if (!r) return;
  if (!state.weekPlan?.length) state.weekPlan = buildLocalWeek();
  const day = state.weekPlan[dayIndex];
  const slots = SLOT_PLANS[state.profile.mealsPerDay] || SLOT_PLANS[3];
  const slot = slots.find(([type]) => type === r.type) || slots[slots.length - 1];
  const idx = day.meals.findIndex((m) => mealTypeCode(m.type) === r.type);
  const target = state.profile.dailyKcal * slot[2];
  const meal = scaledMeal(r, idx >= 0 ? day.meals[idx].kcal || target : target, idx >= 0 ? day.meals[idx].type : slot[1]);
  if (idx >= 0) day.meals[idx] = meal; else day.meals.push(meal);
  saveState();
  toast('Recette ajoutée à votre plan ✓');
}

function recipeList() {
  const favs = new Set(state.recipeFavorites || []);
  const q = foldText(recipeQuery);
  const region = RECIPE_REGIONS.find((x) => x[0] === recipeRegion);
  const goal = GOAL_BY_ID[recipeGoal];
  const list = ALL_RECIPES.filter((r) => (recipeCuisine === 'all' || r.cuisine === recipeCuisine)
    && (!region || region[3].includes(r.cuisine))
    && (recipeType === 'all' || r.type === recipeType)
    && (!goal || goal.test(r))
    && (recipeFilter === 'all' || (recipeFilter === 'quick' && r.prepMin <= 15) || (recipeFilter === 'protein' && r.protein >= 30) || (recipeFilter === 'veg' && !r.meat && !r.fish) || (recipeFilter === 'gf' && r.glutenFree) || (recipeFilter === 'lf' && r.lactoseFree) || (recipeFilter === 'fav' && favs.has(r.id)) || (recipeFilter === 'budget' && !r.fish && (r.ingredients || []).length <= 6) || (recipeFilter === 'fit' && recipeAllowed(r)))
    && (!q || foldText(L(r.name, null, false)).includes(q) || foldText(r.name).includes(q) || r.ingredients.some(([n]) => foldText(L(n, null, false)).includes(q))));
  if (!goal || goal.attr) return list;
  // Recipes written for this goal come first, then the ones that also meet its rule; the user's own cuisines lead.
  const mine = new Set(planCuisines());
  const rank = (r) => (r.goals[0] === goal.id ? (r.goalsWritten ? 0 : 2) : 4) + (mine.has(r.cuisine) ? 0 : 1);
  return list.map((r, i) => [r, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map(([r]) => r);
}
function goalBadge(r) {
  // Inside a collection the badge names the recipe's other use, so it never repeats the open filter.
  const g = GOAL_BY_ID[(r.goals || []).find((id) => id !== recipeGoal)];
  return g ? `<span class="rc-goal ${g.tone}">${icon(g.ico)}<span>${esc(L(g.name))}</span></span>` : '';
}

function recipeCardHtml(r) {
  const favs = new Set(state.recipeFavorites || []);
  return `<article class="recipe-card r-${r.type}" data-recipe-id="${esc(r.id)}" role="button" tabindex="0">
    <div class="recipe-card-top"><span class="rc-flag">${CUISINE_FLAG[r.cuisine] || '🍽️'}</span><span class="pill">${esc(L(r.category))}</span><button class="heart ${favs.has(r.id) ? 'active' : ''}" data-fav-recipe="${esc(r.id)}" aria-label="${L('Favori')}">${favs.has(r.id) ? '♥' : '♡'}</button></div>
    <h3>${esc(L(r.name))}</h3>
    ${goalBadge(r)}
    <div class="recipe-stats"><span><b>${fmt(r.kcal)}</b> kcal</span><span><b>${fmt(r.protein)}</b> g ${L('prot.')}</span><span>${icon('timer')} ${esc(L(r.prep))}</span></div>
  </article>`;
}
function recipeGridHtml() {
  const favs = new Set(state.recipeFavorites || []);
  const list = recipeList();
  return list.map((r) => `<article class="recipe-card r-${r.type}" data-recipe-id="${esc(r.id)}" role="button" tabindex="0">
    <div class="recipe-card-top"><span class="rc-flag">${CUISINE_FLAG[r.cuisine] || '🍽️'}</span><span class="pill">${esc(L(r.category))}</span><button class="heart ${favs.has(r.id) ? 'active' : ''}" data-fav-recipe="${esc(r.id)}" aria-label="${L('Favori')}">${favs.has(r.id) ? '♥' : '♡'}</button></div>
    <h3>${esc(L(r.name))}</h3>
    ${goalBadge(r)}
    <div class="recipe-stats"><span><b>${fmt(r.kcal)}</b> kcal</span><span><b>${fmt(r.protein)}</b> g ${L('prot.')}</span><span>${icon('timer')} ${esc(L(r.prep))}</span></div>
  </article>`).join('') || `<div class="empty">${L('Aucune recette dans ce filtre.')}</div>`;
}

let recipeView = 'explore';
function recipeTabs() {
  const tabs = [['explore', 'Explorer'], ['fav', 'Favoris'], ['made', 'Déjà préparées'], ['create', 'Créer avec mes ingrédients']];
  return `<div class="tab-scroll mod-tabs">${tabs.map(([k, label]) => `<button class="${recipeView === k ? 'active' : ''}" data-recipe-view="${k}">${L(label)}</button>`).join('')}</div>`;
}
function recipesScreen() {
  const types = [['all', 'Tout'], ['b', 'Petit-déjeuner'], ['m', 'Repas'], ['s', 'Collation']];
  const filters = [['all', 'Toutes'], ['fit', 'Adaptées à mon profil'], ['quick', 'Rapides'], ['protein', 'Protéinées'], ['veg', 'Végétariennes'], ['gf', 'Sans gluten'], ['lf', 'Sans lactose'], ['budget', 'Économiques']];
  const region = RECIPE_REGIONS.find((x) => x[0] === recipeRegion);
  const cuisines = region ? CUISINES.filter(([k]) => region[3].includes(k)) : CUISINES;
  const shown = recipeList().length;
  if (recipeView !== 'explore') {
    const t = totals(); const p = state.profile;
    const list = recipeView === 'fav' ? ALL_RECIPES.filter((r) => state.recipeFavorites.includes(r.id)) : recipeView === 'made' ? (state.recipesMade || []).map((x) => ALL_RECIPES.find((r) => r.id === x.id)).filter(Boolean) : [];
    const body = recipeView === 'create'
      ? `<p class="screen-sub">${L('Indiquez ce que vous avez sous la main : NutriPilot invente des recettes adaptées à votre objectif et à vos calories restantes.')}</p>${plannerPanel('fridge', Math.max(180, p.dailyKcal - t.kcal), Math.max(0, Math.round(p.protein - t.protein)))}`
      : list.length ? `<div class="recipe-grid">${list.map((r) => recipeCardHtml(r)).join('')}</div>` : `<div class="empty">${L(recipeView === 'fav' ? 'Touchez ♡ sur une recette pour la retrouver ici.' : 'Les recettes que vous ajoutez à votre journal apparaîtront ici.')}</div>`;
    return `<div class="mobile-app">${appHeader('Recettes')}<div class="screen">${recipeTabs()}${body}</div>${bottom('recipes')}</div>`;
  }
  return `<div class="mobile-app">
    ${appHeader('Recettes')}
    <div class="screen">
      ${recipeTabs()}
      <div class="recipes-hero"><b>${L('{n} recettes du monde entier', { n: ALL_RECIPES.length })}</b><span>${L('Pour maigrir, prendre du muscle, la ménopause ou manger mieux : grammes, calories et macros calculés pour chaque portion.')}</span></div>
      <div class="section-label"><h3>${L('Par objectif')}</h3>${recipeGoal ? `<button class="link-btn" data-recipe-goal="">${L('Tout voir')}</button>` : ''}</div>
      <div class="rg-row scroll">${RECIPE_GOALS.map((g) => `<button class="rg-card ${g.tone} ${recipeGoal === g.id ? 'on' : ''}" data-recipe-goal="${g.id}" aria-pressed="${recipeGoal === g.id}"><span class="mod-ico">${icon(g.ico)}</span><b>${L(g.name)}</b><em>${L('{n} recettes', { n: ALL_RECIPES.filter(g.test).length })}</em></button>`).join('')}</div>
      ${recipeGoal ? `<p class="rg-rule">${icon('check')}<span>${L(RECIPE_GOALS.find((g) => g.id === recipeGoal).rule)}</span></p>` : ''}
      <label class="search-box">${icon('search')}<input id="recipe-search" type="search" value="${esc(recipeQuery)}" placeholder="${L('Rechercher un plat ou un ingrédient')}"></label>
      <div class="section-label"><h3>${L('Par région')}</h3></div>
      <div class="region-row">${[['all', 'Monde', '🌍'], ...RECIPE_REGIONS].map(([k, name, flag]) => `<button class="region-chip ${recipeRegion === k ? 'on' : ''}" data-recipe-region="${k}" aria-pressed="${recipeRegion === k}"><span>${flag}</span>${L(name)}</button>`).join('')}</div>
      <div class="cuisine-row scroll"><button class="cuisine-chip ${recipeCuisine === 'all' ? 'on' : ''}" data-recipe-cuisine="all"><span>${region ? region[2] : '🌍'}</span>${L('Toutes')}</button>${cuisines.map(([k, name, flag]) => `<button class="cuisine-chip ${recipeCuisine === k ? 'on' : ''}" data-recipe-cuisine="${k}"><span>${flag}</span>${L(name)}</button>`).join('')}</div>
      <div class="segmented seg-4 slim">${types.map(([k, label]) => `<button class="${recipeType === k ? 'active' : ''}" data-recipe-type="${k}">${L(label)}</button>`).join('')}</div>
      <div class="chip-row">${filters.map(([k, label]) => `<button class="mini-choice ${recipeFilter === k ? 'selected' : ''}" data-recipe-filter="${k}">${L(label)}</button>`).join('')}</div>
      <p class="rg-count" id="recipe-count">${L('{n} recettes', { n: shown })}</p>
      <div id="recipe-grid" class="recipe-grid">${recipeGridHtml()}</div>
    </div>
    ${bottom('recipes')}
  </div>`;
}

// Why a recipe belongs to its collections, with its own numbers next to each goal's rule.
function recipeFitHtml(r) {
  const goals = (r.goals || []).map((id) => GOAL_BY_ID[id]).filter(Boolean);
  const allergens = ALLERGENS.filter(([code]) => (r.allergens || []).includes(code));
  const diet = [r.vegan ? '100 % végétal' : (!r.meat && !r.fish ? 'Végétarienne' : ''), r.glutenFree ? 'Sans gluten' : '', r.lactoseFree ? 'Sans lactose' : ''].filter(Boolean);
  return `<div class="recipe-fit">
    ${goals.length ? `<div class="rf-goals">${goals.map((g) => `<span class="rc-goal ${g.tone}">${icon(g.ico)}${esc(L(g.name))}</span>`).join('')}</div><p class="rf-why">${icon('check')}<span>${esc(L(goals[0].rule))}</span></p>` : ''}
    ${r.mainProtein ? `<p class="rf-prot">${L('Source principale de protéines : {g} g de {name} ({state}) apportent {p} g de protéines.', { g: fmt(r.mainProtein.grams), name: lang() === 'de' ? L(r.mainProtein.name) : L(r.mainProtein.name).toLocaleLowerCase(locale()), state: L(ingredientState(r.mainProtein.name) === 'cru' ? 'pesé cru' : ingredientState(r.mainProtein.name) === 'cuit' ? 'pesé cuit' : 'tel quel'), p: fmt(r.mainProtein.protein) })}</p>` : ''}
    <div class="rf-tags">${diet.map((d) => `<span class="rf-ok">${esc(L(d))}</span>`).join('')}${allergens.length ? `<span class="rf-label">${L('Allergènes :')}</span>${allergens.map(([, label]) => `<span class="rf-allergen">${esc(L(label))}</span>`).join('')}` : `<span class="rf-ok">${L('Sans allergène majeur')}</span>`}</div>
  </div>`;
}

// Ingredient lines with the grams and what those grams bring, so each protein figure can be checked.
function ingredientTableHtml(r, servings) {
  const rows = r.ingredients.map(([name, grams]) => ({ name, grams: grams * servings, v: ingredientMacros(name, grams * servings), state: ingredientState(name) }));
  const sum = rows.reduce((t, x) => ({ kcal: t.kcal + (x.v?.kcal || 0), protein: t.protein + (x.v?.protein || 0) }), { kcal: 0, protein: 0 });
  const one = (x) => (x >= 10 ? fmt(Math.round(x)) : Number((Math.round(x * 10) / 10).toFixed(1)).toLocaleString(locale(), { maximumFractionDigits: 1 }));
  return `<div class="ing-table" role="table">
    <div class="ing-row ing-head" role="row"><span role="columnheader">${L('Ingrédient')}</span><span role="columnheader">${L('Poids')}</span><span role="columnheader">kcal</span><span role="columnheader">${L('Prot.')}</span></div>
    ${rows.map((x) => `<div class="ing-row" role="row"><span role="cell">${esc(L(x.name))}${x.state ? `<small class="ing-state ${x.state}">${L(x.state)}</small>` : ''}</span><b role="cell">${fmt(x.grams)} g</b><span role="cell">${x.v ? fmt(Math.round(x.v.kcal)) : '–'}</span><span role="cell">${x.v ? `${one(x.v.protein)} g` : '–'}</span></div>`).join('')}
    <div class="ing-row ing-total" role="row"><span role="cell">${servings > 1 ? L('Total ({n} portions)', { n: servings }) : L('Total de la portion')}</span><b role="cell">${fmt(rows.reduce((t, x) => t + x.grams, 0))} g</b><span role="cell">${fmt(Math.round(sum.kcal))}</span><span role="cell">${fmt(Math.round(sum.protein))} g</span></div>
  </div>
  <p class="fine ing-note">${L('Viandes et poissons pesés crus, féculents et légumineuses pesés cuits. Valeurs calculées à partir des tables nutritionnelles de référence (CIQUAL, USDA) ; elles peuvent varier selon les marques.')}</p>`;
}

function recipeSheet(recipe) {
  const isFav = state.recipeFavorites.includes(recipe.id);
  const fromLib = ALL_RECIPES.some((x) => x.id === recipe.id);
  return `<div class="sheet-head"><div><span class="tag">${CUISINE_FLAG[recipe.cuisine] || ''} ${esc(L(recipe.category || 'RECETTE'))}</span><h2>${esc(L(recipe.name))}</h2></div><button class="icon-btn" data-close>×</button></div>
    <div class="recipe-hero-stats"><div><b>${fmt(recipe.kcal)}</b><span>kcal</span></div><div><b>${fmt(recipe.protein)}</b><span>${L('prot.')}</span></div><div><b>${fmt(recipe.carbs)}</b><span>${L('gluc.')}</span></div><div><b>${fmt(recipe.fat)}</b><span>${L('lip.')}</span></div><div><b>${esc(L(recipe.prep))}</b><span>${L('temps')}</span></div></div>
    ${recipeFitHtml(recipe)}
    <div class="section-label"><h3>${L('Ingrédients')}</h3><div class="stepper sm"><button data-servings="-1" aria-label="−">${icon('minus')}</button><b>${modal?.servings || 1}</b><button data-servings="1" aria-label="+">${icon('plus')}</button></div></div>
    <p class="fine serv-note">${L('Quantités pour {n} personne(s). Valeurs nutritionnelles par portion.', { n: modal?.servings || 1 })}</p>
    ${ingredientTableHtml(recipe, modal?.servings || 1)}
    <div class="section-label"><h3>${L('Préparation')}</h3></div>
    <ol class="steps-list">${recipe.steps.map((step) => `<li>${esc(L(step))}</li>`).join('')}</ol>
    <div class="modal-actions three">
      <button class="btn btn-ghost" data-fav-recipe="${esc(recipe.id)}">${isFav ? `♥ ${L('Favori')}` : `♡ ${L('Favori')}`}</button>
      ${fromLib ? `<button class="btn btn-ghost" data-plan-add-recipe="${esc(recipe.id)}">${icon('calendar')} ${L('Au plan')}</button>` : ''}
      <button class="btn btn-lime" data-add-curated="${esc(recipe.id)}" data-kcal="${recipe.kcal}">${L('Ajouter au journal →')}</button>
    </div>`;
}

function addCuratedRecipe(id, view = null) {
  const recipe = view || ALL_RECIPES.find((r) => r.id === id);
  if (!recipe) return;
  state.meals.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    day: todayKey(),
    type: recipe.category || mealTypeFromHour(),
    title: L(recipe.name),
    foods: recipe.ingredients.map(([name, grams]) => ({ name: L(name), grams, kcal: 0 })),
    total: { kcal: recipe.kcal, protein: recipe.protein, carbs: recipe.carbs, fat: recipe.fat, fiber: recipe.fiber },
    icon: '⌁',
    source: 'recipe',
  });
  state.recipesMade = [{ id: recipe.id, day: todayKey() }, ...(state.recipesMade || []).filter((x) => x.id !== recipe.id)].slice(0, 60);
  saveState();
  toast('Recette ajoutée au journal ✓');
  modal = null;
  document.querySelector('.modal-wrap')?.remove();
  render();
}

function planShopping() {
  const map = new Map();
  for (const day of state.weekPlan || []) {
    for (const meal of day.meals || []) {
      for (const raw of meal.ingredients || []) {
        const item = normalizeIngredient(raw);
        if (!item.name) continue;
        item.name = ({ Tomate: 'Tomates', 'Œuf': 'Œufs' })[item.name] || item.name;
        const key = foldText(item.name.trim());
        const previous = map.get(key) || { key, name: item.name, grams: 0, category: ingredientAisle(item.name) || shoppingCategory(item.name) };
        previous.grams += Number(item.grams || 0);
        map.set(key, previous);
      }
    }
  }
  for (const extra of state.shoppingExtra || []) {
    const key = `x-${foldText(extra)}`;
    map.set(key, { key, name: extra, grams: 0, category: 'Mes ajouts', custom: true });
  }
  const order = ['Mes ajouts', 'Protéines', 'Légumes', 'Fruits', 'Féculents', 'Produits laitiers / alternatives', 'Divers'];
  return [...map.values()].sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category) || L(a.name).localeCompare(L(b.name), locale()));
}

function shoppingListHtml(items = []) {
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.category)) groups.set(item.category, []);
    groups.get(item.category).push(item);
  }
  return [...groups.entries()].map(([category, list]) => `<div class="shopping-group"><h4>${esc(L(category))}<span>${list.filter((i) => state.shoppingChecked[i.key]).length}/${list.length}</span></h4>${list.map((item) => `<label class="${state.shoppingChecked[item.key] ? 'done' : ''}"><input type="checkbox" data-shop="${esc(item.key)}" ${state.shoppingChecked[item.key] ? 'checked' : ''}><span>${esc(L(item.name))}</span><b>${item.grams ? (item.grams >= 1000 ? `${fmt(item.grams / 1000, 1)} kg` : `${fmt(item.grams)} g`) : ''}</b>${item.custom ? `<button class="icon-btn sm" data-shop-remove="${esc(item.name)}" aria-label="${L('Retirer')}">×</button>` : ''}</label>`).join('')}</div>`).join('');
}

function shoppingScreen() {
  const shopping = planShopping();
  const done = shopping.filter((i) => state.shoppingChecked[i.key]).length;
  return `<div class="mobile-app">
    ${appHeader('Nutrition')}
    <div class="screen">
      ${programTabs('shopping')}
      ${state.weekPlan?.length ? `<div class="shop-hero"><div><small>${L('Liste de la semaine')}</small><b>${L('{n} articles', { n: shopping.length })}</b><span class="pd-bar light"><i style="width:${shopping.length ? Math.round(done / shopping.length * 100) : 0}%"></i></span><span class="fine">${L('{d} dans le panier', { d: done })}</span></div><div class="shop-actions"><button class="icon-btn" data-shop-share aria-label="${L('Partager')}">${icon('share')}</button><button class="icon-btn" data-shop-reset aria-label="${L('Tout décocher')}">↺</button></div></div>` : ''}
      <div class="shop-add"><input id="shop-extra" placeholder="${L('Ajouter un article (ex. café, éponges)')}"><button class="btn btn-primary" data-shop-add>${icon('plus')}</button></div>
      ${shopping.length
        ? `<div class="day-card shopping-list">${shoppingListHtml(shopping)}</div>`
        : `<div class="day-card empty-cta"><h3>${L('Votre liste arrive avec votre plan.')}</h3><p class="screen-sub">${L('Créez votre semaine : NutriPilot regroupe automatiquement les ingrédients par rayon.')}</p><button class="btn btn-primary btn-wide" data-generate-week>${L('Créer ma semaine')}</button></div>`}
    </div>
    ${bottom('program')}
  </div>`;
}

const defaultState = {
  onboarding: false,
  premium: false,
  premiumEmail: '',
  accessToken: '',
  subscriptionPlan: '',
  profile: {
    name: '',
    sex: 'female',
    age: '',
    height: '',
    weight: '',
    target: '',
    activity: 1.375,
    goal: 'lose',
    speed: 0.35,
    diet: 'balanced',
    allergies: '',
    mealsPerDay: 3,
    cooking: '15-30 min',
    challenge: 'portions',
    cuisine: 'france',
    budget: 'standard',
    dailyKcal: 1700,
    protein: 110,
    carbs: 190,
    fat: 55,
    fiber: 25,
  },
  meals: [],
  favorites: [],
  weekPlan: [],
  weekReview: null,
  shoppingChecked: {},
  water: {},
  weights: [],
  waist: [],
  checkins: {},
  coach: [],
  recipeFavorites: [],
  guidesRead: [],
  lang: '',
  basicsDone: false,
  helloSeen: false,
  focus: '',
  country: '',
  currency: '',
  basicsFilled: {},
  workoutLog: [],
  workoutProgram: '',
  trainingWeekdays: [],
  customPrograms: [],
  customExercises: [],
  exerciseSwaps: {},
  reminders: null,
  changes: [],
  dayTimes: {},
  cpDismissed: {},
  cpPatternsOff: false,
  waterGoal: 2000,
  menoLog: {},
  menoTasks: {},
  menoStart: '',
  menoFactors: {},
  scanHistory: [],
  supplements: [],
  sleepLog: {},
  hungerLog: [],
  routineDone: {},
  recipesMade: [],
  journeyStart: '',
  journeyHidden: false,
  welcomeBackSeen: '',
  measures: {},
  shoppingExtra: [],
  gridDraft: null,
  planSource: '',
  achievements: [],
  scanCount: 0,
  utms: {},
  lastOpen: '',
  updatedAt: '',
};

let state = loadState();
let route = location.hash.replace('#', '') || 'app';
let onboardingState = { step: 0, data: { ...state.profile } };
let modal = null;
let syncTimer = null;
let syncStatus = 'saved'; // saving | saved | pending | error — shown on "Mon jour maintenant"
let syncInFlight = null;
let syncRequested = false;
let pendingPlanSwap = null;

// Older versions pre-filled 70 kg → 62 kg for everyone: never show those as the person's numbers.
function migrateState(s) {
  if (Array.isArray(s.changes)) { const old = new Date(Date.now() - 35 * 86400000).toISOString().slice(0, 10); s.changes = s.changes.filter((c) => c && c.day >= old).slice(0, 60); }
  if (s.dayTimes && typeof s.dayTimes === 'object') { const old = new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10); s.dayTimes = Object.fromEntries(Object.entries(s.dayTimes).filter(([d]) => d >= old)); }
  if (Array.isArray(s.coach)) s.coach = s.coach.filter((m) => m && !m.pending && (m.text || '').trim() && m.text !== '…');
  const p = s.profile || {};
  if (!s.onboarding && !p.goalSet) {
    if (!s.basicsFilled?.weight && Number(p.weight) === 70) p.weight = '';
    if (!s.basicsFilled?.target) p.target = '';
    if (!s.basicsFilled?.age && [32, 35].includes(Number(p.age))) p.age = '';
    if (!s.basicsFilled?.height && Number(p.height) === 165) p.height = '';
    if (!s.basicsFilled?.weight) s.weights = [];
  }
  return s;
}
function loadState() {
  try {
    const raw = localStorage.getItem('nutripilot_v7') || localStorage.getItem('nutripilot_v3') || '{}';
    return migrateState(deepMerge(clone(defaultState), JSON.parse(raw)));
  } catch {
    return clone(defaultState);
  }
}

function deepMerge(target, source) {
  for (const key of Object.keys(source || {})) {
    if (['__proto__', 'prototype', 'constructor'].includes(key)) continue;
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && target[key] && typeof target[key] === 'object') {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Translations are split per language (i18n/<code>.js) so a phone only downloads its own language.
let DICT = {};
let DICT_EN = {};
let dictLang = 'fr';
const CORE_LANGS = ['en', 'es', 'pt', 'de', 'it'];
async function loadDict(code) {
  if (!code || code === 'fr') { DICT = {}; DICT_EN = {}; dictLang = 'fr'; return true; }
  if (dictLang === code) return true;
  try {
    const [own, en] = await Promise.all([
      import(`./i18n/${code}.js`),
      code !== 'en' && !CORE_LANGS.includes(code) ? import('./i18n/en.js') : Promise.resolve({ default: {} }),
    ]);
    DICT = own.default || {};
    DICT_EN = en.default || {};
    dictLang = code;
    return true;
  } catch { return false; /* offline before the language was cached */ }
}
// Warm the HTTP/service-worker cache so a tap on a language applies instantly.
const dictPrefetched = new Set();
function prefetchDict(code) {
  if (!code || code === 'fr' || dictPrefetched.has(code)) return;
  dictPrefetched.add(code);
  import(`./i18n/${code}.js`).catch(() => dictPrefetched.delete(code));
}
const LOCALES = { fr: 'fr-FR', en: 'en-GB', es: 'es-ES', pt: 'pt-BR', de: 'de-DE', it: 'it-IT', nl: 'nl-NL', pl: 'pl-PL', tr: 'tr-TR', ja: 'ja-JP', ko: 'ko-KR', zh: 'zh-CN', ar: 'ar-u-nu-latn', id: 'id-ID' };
function locale() {
  return LOCALES[state?.lang] || 'fr-FR';
}
// Translation: French source text is the key. Missing keys fall back to French.
const missingKeys = new Set();
// App Store 2.3.10 / Google Play: inside each store app, name only that store and platform
// ("App Store or Google Play" → "App Store" on iPhone, "Google Play" on Android). The web keeps both.
const STORE_PLATFORM = (() => { try { return window.Capacitor?.isNativePlatform?.() ? window.Capacitor.getPlatform() : ''; } catch { return ''; } })();
function storeScrub(text) {
  if (!STORE_PLATFORM || !text || typeof text !== 'string' || !/Google|Android|Apple|App Store|iPhone/.test(text)) return text;
  const ios = STORE_PLATFORM === 'ios';
  const pair = (a, b) => new RegExp(`(${a})\\s*(?:/|[^\\s,.;:!?()]{1,6})\\s*(${b})|(${b})\\s*(?:/|[^\\s,.;:!?()]{1,6})\\s*(${a})`, 'g');
  return text
    .replace(pair('App Store', 'Google Play'), ios ? 'App Store' : 'Google Play')
    .replace(pair('Apple', 'Google'), ios ? 'Apple' : 'Google')
    .replace(pair('iPhone', 'Android'), ios ? 'iPhone' : 'Android')
    .replace(pair('iOS', 'Android'), ios ? 'iOS' : 'Android');
}
function L(fr, vars, record = true) {
  const code = state?.lang || 'fr';
  let out = fr;
  if (code !== 'fr' && fr) {
    // Lines not translated yet fall back to English (newer languages), then French.
    const own = LAUNCH_DICT[fr]?.[code] || (dictLang === code ? DICT[fr] : '');
    const hit = own || LAUNCH_DICT[fr]?.en || DICT_EN[fr];
    if (hit) out = hit;
    else if (/ \+ | · /.test(fr)) out = fr.split(/( \+ | · )/).map((part) => (/^( \+ | · )$/.test(part) ? part : L(part, null, record))).join('');
    if (!own && !hit && record && !/ \+ | · /.test(fr)) missingKeys.add(fr);
  }
  if (vars) out = String(out).replace(/\{(\w+)\}/g, (match, key) => (vars[key] ?? match));
  // Live content numbers ({r} recipes, {c} cuisines, {e} exercises, {p} programmes) fill themselves in.
  if (/\{[rcep]\}/.test(String(out))) { const mv = MV(); out = String(out).replace(/\{([rcep])\}/g, (match, key) => mv[key] ?? match); }
  if (code === 'ar' && out) out = String(out).replace(/→/g, '←');
  return storeScrub(out);
}
window.__npMissing = () => [...missingKeys];
// Debug helper: touches every static text so translators can list them.
window.__npCollect = () => {
  const touch = (x) => (typeof x === 'string' && x ? L(x) : null);
  const sample = [{ goal: 'lose', weight: 80, target: 70, track: 'lose' }, { goal: 'gain', track: 'muscle', trainPlace: 'gym' }, { goal: 'maintain', track: 'eat' }];
  for (const step of onboardingSteps) {
    for (const d of sample) {
      ['title', 'sub', 'placeholder', 'unit'].forEach((k) => (typeof step[k] === 'function' ? step[k](d) : touch(step[k])));
      const opts = typeof step.opts === 'function' ? step.opts(d) : step.opts || [];
      opts.forEach((o) => { touch(o[1]); touch(o[2]); });
    }
    if (step.key === 'info-why') ['portions', 'ideas', 'snacking', 'consistency', 'restaurant', ''].forEach((c) => step.sub({ challenge: c }));
  }
  analyzingSteps.forEach(touch); Object.values(MOTIVATION_LINE).forEach(touch); PROGRAM_FEATURES.forEach(touch);
  DEFAULT_PLANS.forEach((x) => [x.label, x.sub, x.badge, ...x.features].forEach(touch));
  [...WORKOUT_PROGRAMS, ...MENO_PROGRAMS].forEach((x) => { [x.name, x.level, x.desc].forEach(touch); x.sessions.forEach((se) => { touch(se.name); touch(se.focus); se.ex.forEach((e) => touch(e[2])); }); });
  Object.values(EXERCISES).forEach((e) => [e.name, e.muscle, ...e.cues].forEach(touch));
  GUIDE_COLLECTIONS.forEach((c) => { touch(c.title); touch(c.sub); c.guides.forEach((g) => [g.title, g.intro, g.action, ...g.points].forEach(touch)); });
  TOUR.forEach((x) => { touch(x[1]); touch(x[2]); });
  COACH_STYLES.forEach((c) => { touch(c.name); touch(c.desc); });
  WORLD_RECIPES.forEach((r) => { [r.name, r.category, r.difficulty, ...r.steps].forEach(touch); });
  Object.values(APP_SHELL).forEach((x) => { const saved = [trainTab]; x.tabs().forEach(([, label, , sub]) => { touch(label); touch(sub); }); trainTab = saved[0]; }); Object.values(APP_SHORT).forEach(touch);
  RECIPE_GOALS.forEach((g) => { touch(g.name); touch(g.rule); }); RECIPE_REGIONS.forEach((x) => touch(x[1])); ALLERGENS.forEach((x) => touch(x[1]));
  ['Monde', 'Sans gluten', 'Sans lactose', 'Végétarienne', '100 % végétal', 'Sans allergène majeur', 'pesé cru', 'pesé cuit', 'tel quel', 'cru', 'cuit'].forEach(touch);
  Object.keys(INGREDIENTS).forEach(touch); CUISINES.forEach((c) => touch(c[1]));
  Object.values(EXERCISES).forEach((e) => [e.name, e.muscle, ...(e.cues || [])].forEach(touch)); Object.values(EQUIPMENT).forEach(touch);
  MEASURES.forEach((m) => touch(m[1])); BUNDLES.forEach((b) => [b.name, b.sub, b.tagline, b.badge].forEach(touch)); TQ.forEach(([, label, opts]) => { touch(label); opts.forEach((o) => touch(o[1])); }); PROGRAM_GROUPS.forEach((g) => touch(g[1])); SUPP_PRESETS.forEach((x) => { touch(x.name); touch(x.serving); x.ings.forEach((i) => touch(i[0])); }); SLEEP_FACTORS.forEach((x) => touch(x[1])); SOUNDS.forEach((x) => touch(x[1])); SLEEP_NIGHTS.forEach(([t, pts, a]) => { touch(t); pts.forEach(touch); touch(a); }); SLEEP_LESSONS.forEach(([t, x]) => { touch(t); touch(x); }); DAY_FOCUS.forEach((f) => touch(f[1])); FREE_MODULES.forEach((m) => touch(m.name)); ['Notez votre nuit chaque matin : en 3 jours, vous verrez vos premières tendances.', 'Vos nuits sont courtes : avancez votre coucher de 15 minutes cette semaine.', 'Journée chargée : 3 minutes de respiration avant le dîner aident à décrocher.', 'Belle régularité : gardez la même heure de lever, même le week-end.', 'Mon planning', 'Séance du jour', 'Débutant', 'Intermédiaire', 'Confirmé', 'Sur mesure'].forEach(touch); ['Calories', 'Protéines', 'Glucides', 'Lipides', 'Collation'].forEach(touch); DEFAULT_PLANS.forEach((x) => [x.label, x.sub, x.tagline, x.badge].forEach(touch));
  badgeList().forEach((b) => touch(b[1])); REPS_CHOICES.forEach(touch);
  ['Enregistrer un repas', 'Atteindre mon objectif d’eau', 'Atteindre 80 % de mes protéines', 'Faire ma séance du jour', 'Remplir mon journal ménopause', 'Faire mon check-in', 'Insuffisance pondérale', 'Corpulence normale', 'Surpoids', 'Obésité', 'Formules', 'Nos formules', 'Cours nutrition', 'Monter ma grille', 'Générateur intelligent', 'Importer', 'Choisissez vos jours et vos exercices, un par un.', 'Vos préférences, NutriPilot construit les séances.', 'Le programme de votre coach ou votre plan alimentaire.', 'Tout matériel', 'À la maison', 'Recettes du monde', 'Exercices animés', 'Espace Ménopause 40+', 'Cours', '{n} recettes', '{n} mouvements', 'Journal, programme, séances', 'Première leçon offerte', 'Repas', 'Tout', 'Adaptées à mon profil', 'Mes ajouts', 'Passer à cette formule', 'Choisir', 'Retour à l’accueil', 'Continuer à explorer', 'Mettre à jour ma grille', 'Enregistrer ma grille', 'Sur mesure', 'Ma grille', 'Séance {n}', 'Votre grille : {n} séances par semaine.', 'Monter', 'Retirer', 'Jour {n}'].forEach(touch);
  TRAIN_FOCUS.forEach((x) => touch(x[1])); EX_GROUPS.forEach(touch); BUILDER_GROUPS.forEach(touch);
  Object.values(LOCKED_COPY).forEach((x) => x.slice(0, 3).forEach(touch));
  MENO_SYMPTOMS.forEach((x) => touch(x[1])); MENO_LEVELS.forEach((x) => touch(x[1])); Object.values(MENO_STAGE).forEach(touch);
  MENO_WEEKS.forEach(([theme, list]) => { touch(theme); list.forEach(touch); });
  ['Kit complet', 'Nutrition', 'Entraînement', 'Ménopause 40+', 'Ménopause', 'Repos', 'Maison', 'Salle'].forEach(touch);
  FAQ.forEach((x) => { touch(x[0]); touch(x[1]); });
  curatedRecipes.forEach((r) => { [r.name, r.category, r.prep, r.difficulty, ...r.steps].forEach(touch); r.ingredients.forEach((i) => touch(i[0])); });
  // v13 modules
  MODULES.forEach((m) => [m.name, m.title, m.short, m.sub, ...m.features].forEach(touch));
  NUTRIENTS.forEach((n) => [n[1], n[5], ...n[6], n[7], n[8]].forEach(touch));
  SUPP_INFO.forEach((x) => [x[1], x[2], x[3], x[4]].forEach(touch));
  BREATHS.forEach((b) => [b[1], b[2]].forEach(touch)); RELAX.forEach((r) => { touch(r[1]); r[3].forEach(touch); });
  ROUTINE.forEach((r) => touch(r[1])); EMOTIONS.forEach((e) => touch(e[1])); FOOD_GROUPS.forEach((g) => touch(g[1]));
  COACH_TABS.forEach((c) => { touch(c[1]); c[3].forEach(touch); }); PF_TRACKS.forEach((x) => { touch(x[1]); touch(x[2]); });
  ['Inspirez', 'Expirez', 'Retenez', 'Bravo', 'Terminé', 'Extérieur', 'Vitamine B6', 'Caféine', 'Créatine', 'Autre', 'Moyenne', 'Modules', 'Découverte', 'Recettes', 'Compléments', 'Sommeil & stress', 'Vitamines & nutriments', 'Scanner'].forEach(touch);
  [['hot'], ['sleep'], ['afternoon'], ['evening'], ['morning']].forEach(() => {});
  ['Votre moment sensible approche', 'Vous avez le plus faim l’après-midi : prévoyez une collation protéinée vers 16 h (yaourt, fruit et quelques noix).', 'Le soir, votre moment sensible', 'Un dîner riche en protéines et en légumes, puis une tisane : les envies du soir diminuent souvent.', 'Un petit-déjeuner qui tient', 'Vous avez faim le matin : misez sur 20 à 30 g de protéines (œufs, skyr, fromage blanc) pour tenir jusqu’au déjeuner.', 'Bouffées de chaleur', 'Le soir, limitez alcool, plats très épicés et boissons chaudes : notez-les dans vos facteurs pour voir l’effet chez vous.', 'Pour mieux dormir', 'Dernière caféine avant 14 h, dîner léger et chambre fraîche : votre module Sommeil propose une relaxation guidée.', 'Objectif légumes', 'Ajoutez une portion de légumes au prochain repas : la moitié de l’assiette, c’est le bon repère.', 'Moins de sucre', 'Une envie de sucré ? Essayez un fruit avec un yaourt nature, ou la respiration SOS d’une minute.', 'Horaires décalés', 'Gardez vos repas à heures régulières par rapport à votre réveil, pas à l’horloge : c’est ce qui compte.'].forEach(touch);
  localFood.forEach((f) => touch(f[0]));
  ['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collation', 'Basse', 'Haute', 'RECETTE', 'Favori', 'Premier repas', '5 scans', 'Série 3 jours', 'Série 7 jours', 'Plan 7 jours', '3 recettes favorites', 'Que manger avec mes calories restantes ?', 'Je veux une pizza ce soir.', 'Comment augmenter mes protéines ?', 'Analyse ma semaine.', 'Photographier l’étiquette', 'Photographier mon repas', 'Cadrez les valeurs nutritionnelles et la portion.', 'Une photo donne une estimation. Vous pourrez corriger chaque quantité avant de l’enregistrer.', 'Photo', 'Texte / voix', 'Code-barres', 'Étiquette', 'Manuel', 'Favoris', 'Votre semaine est prête', 'Complet'].forEach(touch);
  return [...missingKeys];
};

function authHeaders(extra = {}) {
  const token = state.accessToken || (trialActive() ? state.accountToken : '');
  return { ...extra, 'X-NP-Lang': state?.lang || 'fr', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

// App Store 5.1.2(i) / GDPR: before the first photo or text goes to the AI provider, ask once, clearly,
// naming the provider and the data. The choice can be changed at any time in Settings.
const AI_PATHS = ['/api/copilot', '/api/analyze', '/api/supplement', '/api/compose', '/api/coach', '/api/week-plan', '/api/smart-swap', '/api/weekly-review', '/api/recipe', '/api/fridge', '/api/restaurant', '/api/import-plan'];
let aiConsentAsk = null;
function askAiConsent() {
  if (state.aiConsent === true) return Promise.resolve(true);
  if (aiConsentAsk) return aiConsentAsk;
  aiConsentAsk = new Promise((resolve) => {
    const wrap = document.createElement('div');
    wrap.className = 'consent-wrap';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.innerHTML = `<div class="consent-card" tabindex="-1">
      <span class="consent-ico">${icon('star')}</span>
      <h2>${L('Analyser vos photos et messages')}</h2>
      <p>${L('Avec votre accord, NutriPilot transmet à OpenAI, son prestataire d’analyse automatisée, les données nécessaires pour analyser vos repas, répondre à vos questions et préparer vos plans :')}</p>
      <ul>
        <li>${icon('camera')}<span>${L('les photos de repas et d’étiquettes que vous choisissez d’analyser')}</span></li>
        <li>${icon('coach')}<span>${L('le texte que vous écrivez ou dictez pour vos repas et vos échanges avec le coach')}</span></li>
        <li>${icon('user')}<span>${L('les repères de votre profil utiles au calcul : âge, sexe, poids, objectif, calories, préférences et allergies')}</span></li>
      </ul>
      <p class="fine">${L('Votre nom et votre e-mail ne sont pas ajoutés automatiquement. Évitez de saisir des informations identifiantes dans vos messages. Vous pouvez retirer votre accord dans Réglages.')}</p>
      <button class="btn btn-lime btn-wide btn-xl" data-ai-yes>${L('Autoriser l’analyse')}</button>
      <button class="btn btn-ghost btn-wide" data-ai-no>${L('Pas maintenant')}</button>
      <a class="link-btn center-fine" href="/privacy?lang=${lang()}" target="_blank" rel="noopener">${L('Politique de confidentialité')}</a>
    </div>`;
    const done = (ok) => {
      state.aiConsent = ok; state.aiConsentAt = new Date().toISOString(); saveState(false);
      track(ok ? 'AiConsentYes' : 'AiConsentNo');
      wrap.remove(); aiConsentAsk = null; resolve(ok);
    };
    // Consent must be a deliberate tap: ignore the key/tap that opened the screen (e.g. "Send" on the keyboard).
    const shownAt = Date.now();
    wrap.addEventListener('click', (e) => {
      if (Date.now() - shownAt < 600) return;
      if (e.target.closest('[data-ai-yes]')) done(true); else if (e.target.closest('[data-ai-no]')) done(false);
    });
    document.activeElement?.blur?.();
    document.body.append(wrap);
    wrap.querySelector('.consent-card')?.focus({ preventScroll: true });
  });
  return aiConsentAsk;
}
class AiConsentError extends Error {}
async function aiGate(url) {
  const path = String(url).split('?')[0];
  if (!AI_PATHS.includes(path)) return;
  if (config.ai === false) throw new AiConsentError(L('Analyses momentanément en pause'));
  if (await askAiConsent()) return;
  throw new AiConsentError(L('Analyse désactivée. Vous pouvez l’activer dans Réglages › Analyse personnalisée.'));
}
// Keeps the session alive: the server sends a fresh token on premium calls (sliding session), and an
// expired token on the phone is renewed from the store purchase before giving up.
function takeFreshToken(response, expectedToken = state.accessToken) {
  const fresh = response?.headers?.get?.('X-NP-Token');
  if (fresh && state.accessToken === expectedToken && fresh !== state.accessToken) { state.accessToken = fresh; saveState(false); }
}
async function apiFetch(url, options = {}) {
  await aiGate(url);
  let requestToken = state.accessToken;
  let response = await fetch(url, { ...options, headers: authHeaders(options.headers || {}) });
  takeFreshToken(response, requestToken);
  if (response.status === 401 && state.accessToken === requestToken && Billing.native() && !options._retried) {
    try {
      const data = await NativeBilling.verify();
      if (data?.premium && data.token && state.accessToken === requestToken) {
        state.accessToken = data.token; saveState(false);
        requestToken = state.accessToken;
        response = await fetch(url, { ...options, headers: authHeaders(options.headers || {}) });
        takeFreshToken(response, requestToken);
      }
    } catch { /* store unreachable: keep the 401 */ }
  }
  return response;
}

function syncSafeState() {
  const clean = clone(state);
  delete clean.accessToken;
  delete clean.accountToken;
  delete clean.premium;
  delete clean.premiumEmail;
  return clean;
}

function saveState(remote = true) {
  cpLinkPending();
  state.updatedAt = new Date().toISOString();
  try { localStorage.setItem('nutripilot_v7', JSON.stringify(state)); } catch { /* storage full or blocked: remote sync still runs */ }
  if (remote && state.premium && state.accessToken) {
    clearTimeout(syncTimer);
    syncStatus = navigator.onLine === false ? 'pending' : 'saving';
    try { refreshSyncPill(); } catch {}
    syncTimer = setTimeout(syncRemote, 900);
  }
}

// After an unlock on a new phone (restore, reinstall): bring back the plan, meals and progress saved on the server.
async function pullRemoteState() {
  if (!state.accessToken) return;
  const email = state.premiumEmail;
  try {
    const res = await fetch('/api/user/state', { headers: authHeaders() });
    const remote = await res.json();
    if (!res.ok || !remote.state || !state.accessToken || state.premiumEmail !== email) return;
    const localNewer = state.updatedAt && remote.state.updatedAt && String(state.updatedAt) > String(remote.state.updatedAt);
    if (localNewer && state.onboarding) return;
    const keep = { accessToken: state.accessToken, premium: true, premiumEmail: state.premiumEmail, subscriptionPlan: remote.plan || state.subscriptionPlan, aiConsent: state.aiConsent };
    state = deepMerge(state, remote.state);
    Object.assign(state, keep);
  } catch { /* offline: keep local */ }
}
function syncRemote() {
  syncRequested = true;
  if (syncInFlight) return syncInFlight;
  syncInFlight = (async () => {
    do {
      syncRequested = false;
      if (!state.premium || !state.accessToken) return;
      if (navigator.onLine === false) { syncStatus = 'pending'; break; }
      const token = state.accessToken;
      const email = state.premiumEmail;
      const snapshot = syncSafeState();
      syncStatus = 'saving';
      refreshSyncPill();
      try {
        const res = await apiFetch('/api/user/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: snapshot }),
          signal: AbortSignal.timeout(15000),
        });
        // Logging out or switching accounts while a save is pending must not mark the new account saved.
        if (!state.premium || !state.accessToken) return;
        if (state.premiumEmail !== email) { if (syncRequested) continue; return; }
        syncStatus = res.ok ? 'saved' : res.status >= 500 || res.status === 429 ? 'pending' : 'error';
        if (res.ok && state.updatedAt !== snapshot.updatedAt) syncRequested = true;
      } catch {
        if (!state.premium || !state.accessToken) return;
        if (state.accessToken !== token && state.premiumEmail !== email) { if (syncRequested) continue; return; }
        syncStatus = 'pending';
      }
      // Network/server failures retry later, preserving the newest local state.
      if (syncStatus !== 'saved') break;
    } while (syncRequested);
  })().finally(() => {
    syncInFlight = null;
    refreshSyncPill();
    if (syncStatus === 'pending' && state.premium && state.accessToken) {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(syncRemote, 30_000);
    }
  });
  return syncInFlight;
}
// Back online: send what is waiting. Back to the app: bring changes made on another device.
window.addEventListener('online', () => { if (state.premium && state.accessToken && syncStatus !== 'saved') syncRemote(); });
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState !== 'visible' || !state.premium || !state.accessToken || syncStatus === 'saving') return;
  const before = state.updatedAt;
  await pullRemoteState();
  if (state.updatedAt !== before && !modal) render();
});

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[char]));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function fmt(value, digits = 0) {
  return Number(value || 0).toLocaleString(locale(), { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

function todayKey(date = new Date()) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function addDays(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return todayKey(date);
}

function dateLabel(key) {
  return new Date(`${key}T12:00:00`).toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'short' });
}

function toast(message) {
  toastEl.textContent = L(message, null, false);
  toastEl.classList.add('show');
  clearTimeout(window.__nutriToastTimer);
  window.__nutriToastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

function track(name, params = {}) {
  const found = { MealAnalyzed: 'scan', MealSaved: 'scan', WeekPlanGenerated: 'plan', CoachAnswer: 'coach', WorkoutDone: 'workout', QuickWorkout: 'workout' }[name];
  if (found && typeof trialFound === 'function') trialFound(found);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  try { window.fbq?.('trackCustom', name, params); } catch {}
  if (FUNNEL.has(name)) {
    try {
      const body = JSON.stringify({ name, lang: lang(), detail: params.plan || params.focus || params.source || params.feature || params.from || '' });
      if (!navigator.sendBeacon?.('/api/event', new Blob([body], { type: 'application/json' }))) fetch('/api/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
    } catch { /* analytics must never break the app */ }
  }
}
const FUNNEL = new Set(['SelectLanguage', 'BasicsDone', 'SelectTrack', 'StartQuiz', 'CompleteQuiz', 'PlansView', 'PlanChosen', 'ViewPaywall', 'PaywallFromFeature', 'PaywallFromLesson', 'InitiateCheckout', 'Lead', 'PremiumActivated', 'MealSaved', 'SosOpen', 'MenoReport', 'WorkoutDone', 'WeekPlanGenerated', 'StartFunnel', 'SelectFocus', 'TrialStart', 'TrialEnded', 'TrialSignIn', 'CopilotAsk', 'CopilotApply', 'CopilotUndo', 'CopilotProSummary']);

function logo() {
  return `<div class="logo"><span class="logo-mark"></span>${esc(config.brand)}</div>`;
}

// Screens visited in this session, for the header back button.
const navStack = [];
const ROOT_ROUTES = ['app', 'modules', 'coach', 'progress', 'hub'];
function nav(next, { back = false } = {}) {
  if (next === 'lang' && route !== 'lang') langNext = route;
  if (!back && next !== route && !['lang', 'basics', 'saving', 'analyzing'].includes(route)) { navStack.push(route); if (navStack.length > 30) navStack.shift(); }
  route = next;
  closeDrawer(true);
  if (history.state?.npOverlay) history.replaceState(null, '', '#' + next);
  else location.hash = next;
  render();
  scrollTo(0, 0);
}

function captureUtms() {
  const params = new URLSearchParams(location.search);
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    if (params.get(key)) state.utms[key] = params.get(key);
  }
  if (params.get('paid') === '1') route = 'access';
  // Ad links open the app on one niche: ?foco=emagrecimento | menopausa | receitas | treino (any language).
  const f = focusFromSlug(params.get('foco') || params.get('focus') || params.get('f') || '');
  if (f) { state.focus = f; if (!state.profile.track || !state.basicsDone) state.profile.track = FOCI[f].track; selectedTier = ''; }
  saveState(false);
}

function totals(day = todayKey()) {
  return state.meals
    .filter((meal) => meal.day === day)
    .reduce((acc, meal) => {
      for (const key of ['kcal', 'protein', 'carbs', 'fat', 'fiber']) acc[key] += Number(meal.total?.[key] || 0);
      return acc;
    }, { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
}

function waterToday() {
  return Number(state.water[todayKey()] || 0);
}

function streak() {
  let count = 0;
  for (let i = 0; i < 365; i += 1) {
    const key = addDays(-i);
    if (state.meals.some((meal) => meal.day === key)) count += 1;
    else if (i === 0) continue;
    else break;
  }
  return count;
}

function scoreDay(day = todayKey()) {
  const t = totals(day);
  const p = state.profile;
  if (!t.kcal) return 0;
  const kcalScore = Math.max(0, 100 - Math.abs(t.kcal - p.dailyKcal) / p.dailyKcal * 100);
  const proteinScore = Math.min(100, t.protein / Math.max(1, p.protein) * 100);
  const fiberScore = Math.min(100, t.fiber / Math.max(1, p.fiber) * 100);
  return Math.round(kcalScore * 0.5 + proteinScore * 0.3 + fiberScore * 0.2);
}

function lastWeight() {
  return Number(state.weights.at(-1)?.value || state.profile.weight || 0);
}

function startWeight() {
  return Number(state.profile?.goalStart?.weight || state.weights[0]?.value || state.profile.weight || 0);
}

function progressPercent() {
  const start = startWeight();
  const current = lastWeight();
  const target = Number(state.profile.target || current);
  const total = Math.abs(start - target) || 1;
  return clamp(Math.abs(start - current) / total * 100, 0, 100);
}

function normalizeIngredient(item) {
  if (typeof item === 'string') return { name: item, grams: 0 };
  return { name: item?.name || '', grams: Number(item?.grams || 0) };
}

function foldText(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function shoppingCategory(name = '') {
  const value = foldText(name);
  if (/(poulet|dinde|boeuf|steak|jambon|saumon|thon|crevette|poisson|oeuf|tofu|lentille|pois chiche|proteine)/.test(value)) return 'Protéines';
  if (/(courgette|brocoli|tomate|carotte|concombre|salade|epinard|poivron|champignon|legume|roquette)/.test(value)) return 'Légumes';
  if (/(pomme|banane|fraise|myrtille|orange|fruit|citron|avocat)/.test(value)) return 'Fruits';
  if (/(riz|pate|quinoa|pomme de terre|patate douce|pain|avoine|feculent|pizza)/.test(value)) return 'Féculents';
  if (/(skyr|yaourt|fromage|feta|mozzarella|emmental|lait|laitier)/.test(value)) return 'Produits laitiers / alternatives';
  return 'Divers';
}

function mealTypeFromHour() {
  const hour = new Date().getHours();
  if (hour < 10) return 'Petit-déjeuner';
  if (hour < 14) return 'Déjeuner';
  if (hour < 18) return 'Collation';
  return 'Dîner';
}

const EXPLORE_ROUTES = ['app', 'hub', 'program', 'recipes', 'shopping', 'guides', 'training', 'progress', 'coach', 'planner', 'insights', 'tour', 'support', 'settings', 'onboarding', 'analyzing', 'plan', 'paywall', 'access', 'legal', 'lang', 'menopause', 'plans', 'goal', 'profile', 'modules', 'scanner', 'nutrients', 'supplements', 'sleep', 'diary', 'targets'];
let langNext = '';
function guardRoute() {
  if (!routeAllowed()) route = 'app';
  // Paying customers who log in on a new phone also choose their language first.
  if (!state.lang && !['lang', 'legal'].includes(route)) { langNext = route; route = 'lang'; return; }
  if (!state.premium) {
    if (['access', 'legal'].includes(route)) return;
    if (!state.basicsDone) {
      if (!state.helloSeen) { if (!['lang', 'hello'].includes(route)) route = 'hello'; return; }
      if (!['lang', 'basics', 'saving', 'hello'].includes(route)) route = 'basics';
      return;
    }
    if (route === 'upgrade') route = 'paywall';
    if (route === 'hub') route = 'app';
    if (route === 'plan' && !state.onboarding && !onboardingState.data.weight) route = 'app';
    if (!EXPLORE_ROUTES.includes(route)) route = 'app';
    return;
  }
  if (route === 'hub') route = 'app';
  if (!state.onboarding && !['onboarding', 'analyzing', 'plan', 'legal', 'lang', 'support', 'tour'].includes(route)) route = 'onboarding';
  if (state.onboarding && ['paywall', 'access', 'analyzing', 'basics', 'saving'].includes(route)) route = 'app';
}

function routeAllowed() {
  return ['hello', 'app', 'program', 'planner', 'recipes', 'shopping', 'guides', 'coach', 'insights', 'progress', 'settings', 'legal', 'onboarding', 'analyzing', 'plan', 'paywall', 'upgrade', 'access', 'training', 'lang', 'basics', 'saving', 'hub', 'tour', 'support', 'menopause', 'plans', 'goal', 'profile', 'modules', 'scanner', 'nutrients', 'supplements', 'sleep', 'diary', 'targets'].includes(route);
}

async function init() {
  captureUtms();
  let webAuth = null;
  if (location.hash.startsWith('#np-auth=')) {
    try { webAuth = JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(9).replace(/-/g, '+').replace(/_/g, '/'))))); } catch {}
    history.replaceState(null, '', `${location.pathname}#app`);
    route = 'app';
  }
  try {
    const response = await fetch('/api/config');
    if (response.ok) config = { ...config, ...await response.json() };
  } catch {}
  nativeKitStart();
  NativeBilling.start();

  let valid = false;
  if (state.accessToken) {
    try {
      const response = await fetch('/api/access/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: state.accessToken }),
      });
      const data = await response.json();
      if (response.ok && data.premium) {
        valid = true;
        state.premium = true;
        state.premiumEmail = data.email || state.premiumEmail;
        state.subscriptionPlan = data.plan || state.subscriptionPlan;
        try {
          const remoteResponse = await apiFetch('/api/user/state');
          const remote = await remoteResponse.json();
          // Keep edits made on this phone that were not synced yet (offline, closed too fast…).
          const localNewer = state.updatedAt && remote.state?.updatedAt && String(state.updatedAt) > String(remote.state.updatedAt);
          if (localNewer) setTimeout(syncRemote, 500);
          if (remoteResponse.ok && remote.state && !localNewer) {
            const keep = {
              accessToken: state.accessToken,
              premium: true,
              premiumEmail: state.premiumEmail,
              subscriptionPlan: remote.plan || state.subscriptionPlan,
            };
            state = deepMerge(state, remote.state);
            Object.assign(state, keep);
          }
        } catch {}
      }
    } catch {}
  }

  if (!valid) {
    state.premium = false;
    state.accessToken = '';
    state.subscriptionPlan = '';
  }
  if (valid && state.onboarding && ['access', 'plan', 'onboarding', 'paywall', 'welcome'].includes(route)) route = 'app';
  guardRoute();

  const today = todayKey();
  if (state.lastOpen && state.lastOpen !== today) awayDays = Math.round((new Date(`${today}T12:00:00`) - new Date(`${state.lastOpen}T12:00:00`)) / 86400000);
  state.lastOpen = today;
  saveState(false);
  await loadDict(lang());
  if (webAuth?.ok && webAuth.token) { completeSignIn(webAuth); if (state.premium) guardRoute(); }
  else if (webAuth) toast(L('Connexion annulée.'));
  if (state.accountToken && !state.premium) await syncTrial(false).catch(() => {});
  render();
  if ('serviceWorker' in navigator) {
    const hadController = Boolean(navigator.serviceWorker.controller);
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
    }).catch(() => {});
    // A new version took over: reload once so prices and screens are never stale.
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController && !reloaded) { reloaded = true; location.reload(); } });
  }
  startReminderLoop();
  setTimeout(() => reviewMoment(), 5000);
}

window.addEventListener('hashchange', () => {
  route = location.hash.replace('#', '') || 'app';
  closeDrawer(true);
  render();
});

// Phone back button closes the open sheet or menu instead of leaving the screen.
const overlayOpen = () => !!document.querySelector('.modal-wrap, .drawer-wrap');
new MutationObserver(() => {
  if (overlayOpen()) { if (!history.state?.npOverlay) history.pushState({ npOverlay: 1 }, '', location.href); return; }
  setTimeout(() => { if (!overlayOpen() && history.state?.npOverlay) history.back(); }, 0);
}).observe(document.body, { childList: true });
window.addEventListener('popstate', () => {
  if (!overlayOpen()) return;
  if (document.querySelector('.drawer-wrap')) closeDrawer();
  if (document.querySelector('.modal-wrap')) { const refresh = modal?.refresh; modal = null; document.querySelector('.modal-wrap')?.remove(); if (refresh) render(); }
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  window.deferredInstall = event;
});

const kgFmt = (value) => fmt(value, Number.isInteger(Number(value)) ? 0 : 1);
const onboardingSteps = [
  { key: 'name', title: 'Comment vous appelez-vous ?', sub: 'Votre programme sera fait pour vous, à votre nom.', type: 'text', placeholder: 'Votre prénom' },
  { key: 'goal', when: (d) => !['lose', 'menopause'].includes(d.track), title: 'Quel est votre objectif principal ?', sub: 'Votre programme sera construit autour de cette réponse.', type: 'options', opts: (d) => d.track === 'muscle' ? [['gain', 'Prendre du muscle', 'Gagner en force et en volume'], ['lose', 'Perdre du gras et me tonifier', 'Un corps plus sec et dessiné'], ['maintain', 'Me sculpter sans changer de poids', 'Recomposition corporelle']] : [['lose', 'Perdre du poids', 'Durablement, sans régime extrême'], ['maintain', 'Stabiliser mon poids', 'Mieux manger sans y penser'], ['gain', 'Prendre du poids', 'Avec une progression contrôlée']] },
  { key: 'motivation', title: 'Qu’est-ce qui compte le plus pour vous ?', sub: 'C’est ce que nous vous rappellerons les jours difficiles.', type: 'options', opts: [['confidence', 'Me sentir bien dans mon corps', 'Retrouver confiance en moi'], ['clothes', 'Rentrer à nouveau dans mes vêtements', 'Sans avoir à tout racheter'], ['energy', 'Avoir plus d’énergie', 'Fini les coups de fatigue'], ['health', 'Prendre soin de ma santé', 'Pour aujourd’hui et pour demain']] },
  { key: 'sex', when: (d) => d.track !== 'menopause', title: 'Vous êtes…', sub: 'Vos besoins énergétiques en dépendent.', type: 'options', opts: [['female', 'Une femme', ''], ['male', 'Un homme', ''], ['other', 'Je préfère ne pas répondre', 'Estimation intermédiaire']] },
  { key: 'age', title: 'Quel âge avez-vous ?', sub: 'Le métabolisme évolue avec l’âge : votre plan en tient compte.', type: 'number', min: 18, max: 90, unit: 'ans' },
  { key: 'menopause', when: (d) => d.track === 'menopause', title: 'Êtes-vous concernée par la ménopause ?', sub: 'Les changements hormonaux modifient le stockage des graisses : votre programme et vos guides s’y adaptent.', type: 'options', opts: [['peri', 'Oui, ça commence', 'Préménopause : cycles irréguliers, premiers symptômes'], ['post', 'Oui, je suis ménopausée', 'Depuis plus d’un an sans règles'], ['unsure', 'Je ne sais pas', 'Nous vous expliquons tout dans les guides'], ['no', 'Non, pas encore', '']] },
  { key: 'height', title: 'Quelle est votre taille ?', sub: 'En centimètres.', type: 'number', min: 130, max: 220, unit: 'cm' },
  { key: 'weight', title: 'Quel est votre poids actuel ?', sub: 'C’est votre point de départ. Personne d’autre ne le voit.', type: 'number', min: 35, max: 250, step: 0.1, unit: 'kg' },
  { key: 'target', when: (d) => d.goal !== 'maintain', title: 'Quel poids aimeriez-vous atteindre ?', sub: 'Choisissez un objectif qui vous ferait vraiment plaisir.', type: 'number', min: 35, max: 250, step: 0.1, unit: 'kg' },
  {
    key: 'info-target', type: 'info', icon: '✦',
    title: (d) => d.goal === 'lose' ? (d.name ? L('{name}, perdre {kg} kg est un objectif atteignable.', { name: d.name, kg: kgFmt(Math.abs(Number(d.weight) - Number(d.target))) }) : L('Perdre {kg} kg : c’est un objectif atteignable.', { kg: kgFmt(Math.abs(Number(d.weight) - Number(d.target))) })) : L(d.goal === 'gain' ? 'Prendre du muscle, ça se construit repas après repas.' : 'Votre objectif est noté.'),
    sub: (d) => L(d.goal === 'gain' ? 'NutriPilot ajuste vos calories et vos protéines à votre entraînement pour progresser sans prendre de gras inutile.' : 'NutriPilot ne vous demandera pas de tout supprimer. Il calcule un rythme qui respecte votre énergie, votre vie sociale et le plaisir de manger, puis vous guide repas après repas.'),
  },
  { key: 'event', title: 'Avez-vous une date en tête ?', sub: 'Un objectif daté aide à garder le cap.', type: 'options', opts: [['holidays', 'Les prochaines vacances', 'Me sentir bien à la plage'], ['event', 'Un événement important', 'Mariage, anniversaire, soirée…'], ['season', 'La nouvelle saison', 'Repartir sur de bonnes bases'], ['none', 'Pas de date précise', 'Je veux surtout que ça dure']] },
  { key: 'activity', title: 'À quoi ressemble votre semaine ?', sub: 'Choisissez l’option la plus proche de votre quotidien.', type: 'options', opts: [[1.2, 'Plutôt assise', 'Bureau, voiture, peu de sport'], [1.375, 'Un peu active', '1 à 3 séances ou longues marches'], [1.55, 'Active', '3 à 5 séances par semaine'], [1.725, 'Très active', 'Sport ou métier physique au quotidien']] },
  { key: 'speed', when: (d) => d.goal === 'lose', title: 'À quel rythme voulez-vous avancer ?', sub: 'Un rythme durable évite l’effet yo-yo.', type: 'options', opts: [[0.2, 'Tranquille', '≈ 0,2 kg / semaine · très facile à tenir'], [0.35, 'Régulier', '≈ 0,35 kg / semaine · recommandé'], [0.5, 'Soutenu', '≈ 0,5 kg / semaine · plus exigeant']] },
  { key: 'trainPlace', title: 'Voulez-vous un programme d’entraînement ?', sub: 'Le sport accélère les résultats et protège vos muscles. Il est inclus.', type: 'options', opts: (d) => [['gym', 'Oui, en salle de sport', 'Machines, haltères, barre'], ['home', 'Oui, à la maison', 'Sans matériel, 30 minutes'], ...(d.track === 'muscle' ? [] : [['none', 'Pas pour l’instant', 'Je me concentre sur l’alimentation']])] },
  { key: 'trainLevel', when: (d) => d.trainPlace && d.trainPlace !== 'none', title: 'Quel est votre niveau ?', sub: 'Vos séances partiront de là.', type: 'options', opts: [['beginner', 'Débutant(e)', 'Je découvre ou je reprends'], ['intermediate', 'Intermédiaire', 'Je m’entraîne depuis quelques mois'], ['advanced', 'Confirmé(e)', 'Plus d’un an de pratique régulière']] },
  { key: 'trainDays', when: (d) => d.trainPlace && d.trainPlace !== 'none', title: 'Combien de séances par semaine ?', sub: 'Mieux vaut moins de séances tenues que trop de séances abandonnées.', type: 'options', opts: [[2, '2 séances', 'L’essentiel'], [3, '3 séances', 'Recommandé'], [4, '4 séances ou plus', 'Pour progresser plus vite']] },
  { key: 'menoFocus', when: (d) => d.track === 'menopause', title: 'Qu’est-ce qui vous gêne le plus en ce moment ?', sub: 'Votre espace Ménopause commencera par ce point.', type: 'options', opts: [['hot', 'Les bouffées de chaleur', 'Et les sueurs nocturnes'], ['sleep', 'Le sommeil', 'Réveils, nuits courtes'], ['belly', 'Le ventre qui s’arrondit', 'Le poids qui change de place'], ['mood', 'L’humeur et le stress', 'Irritabilité, fringales'], ['joints', 'Les articulations', 'Raideurs, douleurs'], ['fatigue', 'La fatigue', 'Moins d’énergie']] },
  { key: 'muscleFocus', when: (d) => d.track === 'muscle', title: 'Quelle zone voulez-vous développer en priorité ?', sub: 'Votre programme mettra plus de volume sur cette zone.', type: 'options', opts: [['full', 'Tout le corps', 'Une silhouette équilibrée'], ['upper', 'Le haut du corps', 'Pectoraux, dos, épaules, bras'], ['lower', 'Le bas du corps', 'Jambes et fessiers']] },
  { key: 'sessionLength', when: (d) => d.trainPlace && d.trainPlace !== 'none', title: 'Combien de temps par séance ?', sub: 'Vos séances tiendront dans ce temps, échauffement compris.', type: 'options', opts: [[30, '30 minutes', 'Court et efficace'], [45, '45 minutes', 'Le bon équilibre'], [60, '60 minutes ou plus', 'Pour un travail complet']] },
  { key: 'eatFocus', when: (d) => d.track === 'eat', title: 'Qu’aimeriez-vous améliorer en premier ?', sub: 'Vos conseils du jour commenceront par là.', type: 'options', opts: [['energy', 'Mon énergie', 'Moins de coups de fatigue'], ['sugar', 'Moins de sucre', 'Grignotage, boissons sucrées'], ['veg', 'Plus de légumes', 'Et plus de fibres'], ['cook', 'Cuisiner plus', 'Moins de plats préparés'], ['digestion', 'Ma digestion', 'Ballonnements, confort']] },
  { key: 'hungerTime', title: 'À quel moment avez-vous le plus faim ?', sub: 'Votre plan placera une collation ou un repas plus copieux à ce moment-là.', type: 'options', opts: [['morning', 'Le matin', 'Je me réveille affamé(e)'], ['afternoon', 'L’après-midi', 'Le fameux creux de 16 h'], ['evening', 'Le soir', 'Après le dîner, devant un écran'], ['steady', 'Pas de moment précis', 'Ma faim est assez régulière']] },
  { key: 'schedule', title: 'À quoi ressemblent vos journées ?', sub: 'Les horaires de vos repas et rappels s’y adapteront.', type: 'options', opts: [['office', 'Horaires réguliers', 'Bureau, école, journée classique'], ['shift', 'Horaires décalés', 'Nuits, gardes, rotations'], ['home', 'À la maison', 'Horaires flexibles'], ['move', 'Toujours en déplacement', 'Repas souvent à l’extérieur']] },
  { key: 'tried', title: 'Qu’avez-vous déjà essayé ?', sub: 'Pour ne pas vous refaire vivre ce qui n’a pas marché.', type: 'options', opts: [['diets', 'Des régimes stricts', 'Et le poids est revenu'], ['apps', 'Des applis de comptage', 'Trop long, j’ai arrêté'], ['fasting', 'Le jeûne ou sauter des repas', 'Difficile à tenir'], ['nothing', 'Rien de structuré', 'C’est ma première vraie démarche']] },
  { key: 'challenge', title: 'Qu’est-ce qui vous fait le plus craquer ?', sub: 'Votre tableau de bord mettra l’accent sur ce point.', type: 'options', opts: [['portions', 'Les portions', 'Je ne sais pas combien manger'], ['ideas', 'Les idées de repas', 'Je mange toujours la même chose'], ['snacking', 'Le grignotage', 'Surtout le soir ou entre les repas'], ['consistency', 'La régularité', 'Je commence puis j’abandonne'], ['restaurant', 'Les repas à l’extérieur', 'Restaurant, apéro, repas de famille']] },
  {
    key: 'info-why', type: 'info', icon: '♡',
    title: (d) => d.name ? L('{name}, ce n’est pas un manque de volonté.', { name: d.name }) : L('Ce n’est pas un manque de volonté.'),
    sub: (d) => {
      const why = {
        portions: 'Sans repères, on mange au jugé. NutriPilot vous montre la bonne portion en une photo, à chaque repas.',
        ideas: 'Quand on ne sait pas quoi manger, on prend ce qui est rapide. NutriPilot vous propose votre prochain repas, adapté à votre journée.',
        snacking: 'Le grignotage vient souvent de repas pas assez rassasiants. Votre plan priorise les protéines et les fibres qui calent vraiment.',
        consistency: 'Les régimes trop stricts finissent par lâcher. NutriPilot ajuste le reste de la journée au lieu de tout interdire.',
        restaurant: 'Une sortie ne ruine rien. Décrivez votre restaurant ou prenez votre assiette en photo : NutriPilot rééquilibre la suite.',
      }[d.challenge];
      return L(why || 'Il vous manquait simplement un plan clair, repas après repas. C’est exactement ce que nous construisons maintenant.');
    },
  },
  { key: 'diet', title: 'Comment aimez-vous manger ?', sub: 'Vos recettes et suggestions suivront ce style.', type: 'options', opts: [['balanced', 'De tout', 'Aucune règle particulière'], ['mediterranean', 'Méditerranéen', 'Légumes, huile d’olive, poisson'], ['high-protein', 'Riche en protéines', 'Pour être rassasié(e) plus longtemps'], ['pescatarian', 'Pescétarien', 'Poisson, sans viande'], ['vegetarian', 'Végétarien', 'Sans viande ni poisson']] },
  { key: 'allergies', title: 'Des aliments à éviter ?', sub: 'Allergies, intolérances ou simplement ce que vous n’aimez pas. Laissez vide si rien.', type: 'text', optional: true, placeholder: 'Ex. arachides, lactose, champignons…' },
  { key: 'mealsPerDay', title: 'Combien de repas par jour ?', sub: 'Votre plan suivra votre rythme, pas l’inverse.', type: 'options', opts: [[2, '2 repas', 'Simple et efficace'], [3, '3 repas', 'Le classique'], [4, '3 repas + 1 collation', 'Pour éviter les fringales']] },
  { key: 'cooking', title: 'Combien de temps pour cuisiner ?', sub: 'Toutes vos recettes respecteront ce temps.', type: 'options', opts: [['<15 min', 'Moins de 15 min', 'Le plus rapide possible'], ['15-30 min', '15 à 30 min', 'Simple mais bon'], ['30-45 min', '30 à 45 min', 'J’aime cuisiner']] },
  { key: 'cuisine', title: 'Quelle cuisine vous fait envie ?', sub: 'Un plan qui donne envie, c’est un plan qu’on suit.', type: 'options', opts: () => { const c = CUISINES.find((x) => x[0] === (LANG_CUISINE[lang()] || 'fr')) || CUISINES[0]; return [['home', `${c[2]} ${L(c[1])}`, 'Les plats de chez moi, en version légère'], ['med', 'Méditerranéenne', 'Fraîche et ensoleillée'], ['world', 'Cuisine du monde', 'Les recettes de tous les pays'], ['simple', 'Très simple', 'Peu d’ingrédients']]; } },
  { key: 'budget', title: 'Quel budget pour vos courses ?', sub: 'Votre liste de courses sera adaptée.', type: 'options', opts: [['economy', 'Économique', 'Des produits simples'], ['standard', 'Standard', 'Équilibre prix et variété'], ['flexible', 'Flexible', 'Plus de liberté']] },
];
const stepText = (value, data) => (typeof value === 'function' ? value(data) : L(value || ''));
const stepVisible = (index, data = onboardingState.data) => {
  const step = onboardingSteps[index];
  if (!step) return false;
  if (onboardingState.skip?.includes(step.key) && data[step.key]) return false;
  return !step.when || step.when(data);
};
function moveStep(direction) {
  let index = onboardingState.step + direction;
  while (index >= 0 && index < onboardingSteps.length && !stepVisible(index)) index += direction;
  return index;
}

function onboardingInput(step) {
  const value = onboardingState.data[step.key] ?? '';
  if (step.type === 'options') {
    const opts = typeof step.opts === 'function' ? step.opts(onboardingState.data) : step.opts;
    return `<div class="options">${opts.map((option) => `
      <button class="option ${String(option[0]) === String(value) ? 'selected' : ''}" data-ob-value="${esc(option[0])}">
        <span>${esc(L(option[1]))}</span>${option[2] ? `<b>${esc(L(option[2]))}</b>` : ''}
      </button>`).join('')}</div>`;
  }
  if (step.type === 'number') {
    return `<div class="number-entry"><input class="input-big" id="ob-field" type="number" inputmode="decimal" min="${step.min}" max="${step.max}" step="${step.step || 1}" value="${esc(value)}"><span class="unit">${esc(L(step.unit))}</span></div>`;
  }
  return `<input class="input-big text-input-big" id="ob-field" type="text" placeholder="${esc(L(step.placeholder || ''))}" value="${esc(value)}">`;
}

function onboarding() {
  const step = onboardingSteps[onboardingState.step];
  const data = onboardingState.data;
  const percent = ((onboardingState.step + 1) / onboardingSteps.length) * 100;
  const isLast = onboardingState.step === onboardingSteps.length - 1;
  const body = step.type === 'info'
    ? `<div class="question info-step"><div class="info-icon">${esc(step.icon || '✦')}</div><h1>${esc(stepText(step.title, data))}</h1><p>${esc(stepText(step.sub, data))}</p></div>`
    : `<div class="question"><h1>${esc(stepText(step.title, data))}</h1><p>${esc(stepText(step.sub, data))}</p>${onboardingInput(step)}</div>`;
  return `<div class="onboard">
    <aside class="onboard-art">
      ${logo()}
      <div><span class="tag">${L('PROGRAMME PERSONNALISÉ')}</span><h2>${L('Votre objectif.')}<br>${L('Une direction concrète chaque jour.')}</h2></div>
      <div class="quote-card"><b>${L('Quelques questions. Un plan fait pour vous.')}</b><p>${L('Vos réponses servent uniquement à construire votre programme.')}</p></div>
    </aside>
    <main class="onboard-main">
      <div class="ob-top"><button class="back" data-ob-back ${onboardingState.step === 0 ? 'style="visibility:hidden"' : ''} aria-label="${L('Retour')}">←</button><div class="progress-steps"><i style="width:${percent}%"></i></div><small class="ob-percent">${Math.round(percent)} %</small>${langChip()}</div>
      ${body}
      <div class="nextbar"><button class="btn btn-primary btn-wide" data-ob-next>${isLast ? L('Créer mon programme') : L('Continuer')}</button></div>
    </main>
  </div>`;
}

// ---- Niches: one app, four entries (one per ad campaign) ----------------------------
const FOCI = {
  lose: { slugs: ['emagrecimento', 'emagrecer', 'perder-peso', 'perte-de-poids', 'maigrir', 'mincir', 'weight-loss', 'weightloss', 'lose', 'adelgazar', 'perder-peso', 'abnehmen', 'dimagrire', 'afvallen', 'odchudzanie', 'kilo-verme', 'diet', 'dieta'],
    track: 'lose', tier: 'body', tone: 'm-nut', ico: 'flame', mod: 'nutrition', kicker: 'Perte de poids',
    title: 'Mincir en mangeant ce que vous aimez.', sub: 'Vos calories calculées pour vous, des recettes pour maigrir, un scanner de repas et des séances guidées. Sans régime extrême.',
    points: [['scan', 'Photographiez votre assiette', 'Calories et macros en quelques secondes'], ['fork', 'Recettes pour maigrir', 'Rassasiantes, ≤ 450 kcal, de votre cuisine'], ['calendar', 'Plan 7 jours + courses', 'Ajusté à votre objectif, liste prête'], ['dumbbell', 'Séances qui brûlent', 'À la maison ou en salle, avec démonstrations']] },
  meno: { slugs: ['menopausa', 'menopause', 'ménopause', 'menopausia', 'menopauze', 'menopauza', 'menopoz', 'menopausa-40', 'women40', '40'],
    track: 'menopause', tier: 'women40', tone: 'm-meno', ico: 'flower', mod: 'menopause', kicker: 'Ménopause & 40+',
    title: 'La ménopause, avec un vrai plan.', sub: 'Journal des symptômes, alimentation adaptée, sommeil et renforcement musculaire pensés pour les femmes de 40 ans et plus.',
    points: [['flower', 'Journal des symptômes', 'Bouffées de chaleur, sommeil, humeur : voyez ce qui aide'], ['calendar', 'Programme de 8 semaines', 'Une étape par semaine, à votre rythme'], ['moon', 'Sommeil & stress', 'Sons, relaxations et programme de 7 nuits'], ['fork', 'Assiettes 40+', 'Protéines et fibres, sans privation']] },
  recipes: { slugs: ['receitas', 'receita', 'recettes', 'recipes', 'recetas', 'rezepte', 'ricette', 'recepten', 'przepisy', 'tarifler', 'cozinha', 'cuisine', 'kitchen'],
    track: 'eat', tier: 'kitchen', tone: 'm-rec', ico: 'fork', mod: 'recipes', kicker: 'Recettes',
    title: 'Des recettes pour chaque objectif.', sub: 'Pour maigrir, prendre du muscle, la ménopause, végétariennes ou prêtes en 15 minutes : chaque recette calculée en grammes, calories et macros.',
    points: [['flame', 'Pour maigrir', 'Rassasiantes et légères, critère affiché'], ['dumbbell', 'Prise de muscle', '30 g de protéines et plus par portion'], ['flower', 'Ménopause 40+', 'Riches en protéines et en fibres'], ['timer', 'Prêtes en 15 min', 'Courses automatiques et portions ajustables']] },
  training: { slugs: ['treino', 'treinos', 'academia', 'musculacao', 'entrainement', 'entraînement', 'training', 'workout', 'gym', 'entrenamiento', 'allenamento', 'trening', 'antrenman', 'fitness'],
    track: 'muscle', tier: 'body', tone: 'm-train', ico: 'dumbbell', mod: 'training', kicker: 'Entraînement',
    title: 'Votre entraînement, construit à votre façon.', sub: 'Choisissez vos jours et ce que vous travaillez chaque jour. Démonstrations animées, charges suivies et la nutrition qui suit.',
    points: [['calendar', 'Vos jours, vos muscles', 'Jambes 2 fois ? Haut du corps lundi ? Vous décidez'], ['dumbbell', 'Démonstrations animées', 'Chaque mouvement expliqué'], ['progress', 'Charges et records', 'Progression suggérée séance après séance'], ['fork', 'Nutrition sportive', 'Protéines et calories alignées sur vos séances']] },
};
function focusFromSlug(raw) {
  const v = String(raw || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (!v) return '';
  if (FOCI[v]) return v;
  return Object.keys(FOCI).find((k) => FOCI[k].slugs.some((x) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === v)) || '';
}
const TRACK_FOCUS = { lose: 'lose', menopause: 'meno', eat: 'recipes', muscle: 'training' };
const currentFocus = () => (FOCI[state.focus] ? state.focus : TRACK_FOCUS[state.profile?.track] || '');

const TRACKS = [
  ['lose', 'Perdre du poids', 'Mincir sans régime extrême', '🔥'],
  ['menopause', 'Ménopause & 40+', 'Retrouver un ventre plat après 40 ans', '🌸'],
  ['muscle', 'Prendre du muscle', 'Programme salle + nutrition sportive', '💪'],
  ['eat', 'Manger mieux', 'Plus d’énergie, sans prise de tête', '🥗'],
];

// ---- Langues ---------------------------------------------------------------
const LANGS = [
  ['fr', 'Français', '🇫🇷'], ['en', 'English', '🇬🇧'], ['es', 'Español', '🇪🇸'],
  ['pt', 'Português', '🇧🇷'], ['de', 'Deutsch', '🇩🇪'], ['it', 'Italiano', '🇮🇹'],
  ['nl', 'Nederlands', '🇳🇱'], ['pl', 'Polski', '🇵🇱'], ['tr', 'Türkçe', '🇹🇷'],
  ['ja', '日本語', '🇯🇵'], ['ko', '한국어', '🇰🇷'], ['zh', '中文', '🇨🇳'],
  ['ar', 'العربية', '🇸🇦'], ['id', 'Bahasa Indonesia', '🇮🇩'],
];
const I18N = {
  fr: {
    langTitle: 'Choisissez votre langue', langCta: 'Continuer',
    basicsTitle: 'Faisons connaissance', basicsSub: 'Quelques informations pour personnaliser NutriPilot. Vous pourrez les modifier à tout moment.',
    name: 'Prénom', age: 'Âge', weight: 'Poids approximatif', height: 'Taille', later: 'Je répondrai plus tard', basicsCta: 'Continuer',
    namePh: 'Votre prénom', needName: 'Indiquez votre prénom.', needAge: 'Indiquez un âge entre 18 et 90 ans.',
    saving: 'Enregistrement de vos préférences…', savingSub: 'Nous préparons votre espace : nutrition, entraînement et coach.',
    hello: 'Bonjour', hubSub: 'Que voulez-vous faire aujourd’hui ?', hubQuiz: 'Créer mon programme', hubQuizSub: 'Choisissez votre objectif : 2 minutes de questions, un plan fait pour vous.',
    hubExplore: 'Explorer NutriPilot', hubTour: 'Découvrir l’application', hubTourSub: 'Toutes les fonctions en 1 minute',
    hubSupport: 'Aide & support', hubSupportSub: 'Questions fréquentes et assistant',
    myProgram: 'Votre programme', seePlan: 'Voir mon plan', unlock: 'Débloquer', explore: 'Mode découverte', exploreSub: 'Débloquez votre formule pour tout utiliser.',
    tracks: [['Perdre du poids', 'Mincir sans régime extrême'], ['Ménopause & 40+', 'Retrouver un ventre plat après 40 ans'], ['Prendre du muscle', 'Programme salle + nutrition sportive'], ['Manger mieux', 'Plus d’énergie, sans prise de tête']],
    features: ['Scanner de repas en une photo', 'Plan de repas 7 jours', 'Recettes de chef minceur', 'Programmes salle & maison', 'Guides ménopause', 'Coach au quotidien', 'Suivi du poids et des mensurations', 'Liste de courses automatique', 'Mode restaurant et mode frigo', 'Nutritionnistes & coachs (bientôt)'],
    exploreTiles: [['recipes', 'Recettes'], ['training', 'Entraînements'], ['guides', 'Guides'], ['menopause', 'Ménopause 40+']],
  },
  en: {
    langTitle: 'Choose your language', langCta: 'Continue',
    basicsTitle: 'Let’s get to know you', basicsSub: 'A few details to personalise NutriPilot. You can change them at any time.',
    name: 'First name', age: 'Age', weight: 'Approximate weight', height: 'Height', later: 'I’ll answer later', basicsCta: 'Continue',
    namePh: 'Your first name', needName: 'Please enter your first name.', needAge: 'Please enter an age between 18 and 90.',
    saving: 'Saving your preferences…', savingSub: 'We’re preparing your space: nutrition, training and coach.',
    hello: 'Hello', hubSub: 'What would you like to do today?', hubQuiz: 'Create my programme', hubQuizSub: 'Pick your goal: 2 minutes of questions, a plan made for you.',
    hubExplore: 'Explore NutriPilot', hubTour: 'Discover the app', hubTourSub: 'Every feature in 1 minute',
    hubSupport: 'Help & support', hubSupportSub: 'FAQ and assistant',
    myProgram: 'Your programme', seePlan: 'See my plan', unlock: 'Unlock', explore: 'Preview mode', exploreSub: 'Unlock your plan to use everything.',
    tracks: [['Lose weight', 'Slim down without extreme dieting'], ['Menopause & 40+', 'A flatter belly after 40'], ['Build muscle', 'Gym programme + sports nutrition'], ['Eat better', 'More energy, no hassle']],
    features: ['Meal scanner in one photo', '7-day meal plan', 'Chef-made slimming recipes', 'Gym & home workouts', 'Menopause guides', 'Daily coach', 'Weight and measurement tracking', 'Automatic shopping list', 'Restaurant and fridge modes', 'Nutritionists & coaches (soon)'],
    exploreTiles: [['recipes', 'Recipes'], ['training', 'Workouts'], ['guides', 'Guides'], ['menopause', 'Menopause 40+']],
  },
  es: {
    langTitle: 'Elige tu idioma', langCta: 'Continuar',
    basicsTitle: 'Conozcámonos', basicsSub: 'Algunos datos para personalizar NutriPilot. Puedes cambiarlos cuando quieras.',
    name: 'Nombre', age: 'Edad', weight: 'Peso aproximado', height: 'Altura', later: 'Responderé más tarde', basicsCta: 'Continuar',
    namePh: 'Tu nombre', needName: 'Escribe tu nombre.', needAge: 'Indica una edad entre 18 y 90 años.',
    saving: 'Guardando tus preferencias…', savingSub: 'Preparamos tu espacio: nutrición, entrenamiento y coach.',
    hello: 'Hola', hubSub: '¿Qué quieres hacer hoy?', hubQuiz: 'Crear mi programa', hubQuizSub: 'Elige tu objetivo: 2 minutos de preguntas, un plan hecho para ti.',
    hubExplore: 'Explorar NutriPilot', hubTour: 'Descubrir la app', hubTourSub: 'Todas las funciones en 1 minuto',
    hubSupport: 'Ayuda y soporte', hubSupportSub: 'Preguntas frecuentes y asistente',
    myProgram: 'Tu programa', seePlan: 'Ver mi plan', unlock: 'Desbloquear', explore: 'Modo descubrimiento', exploreSub: 'Desbloquea tu plan para usarlo todo.',
    tracks: [['Perder peso', 'Adelgazar sin dietas extremas'], ['Menopausia y 40+', 'Un vientre más plano después de los 40'], ['Ganar músculo', 'Programa de gimnasio + nutrición deportiva'], ['Comer mejor', 'Más energía, sin complicaciones']],
    features: ['Escáner de comidas con una foto', 'Plan de comidas de 7 días', 'Recetas de chef para adelgazar', 'Entrenamientos en gimnasio y casa', 'Guías de menopausia', 'Coach diario', 'Seguimiento de peso y medidas', 'Lista de la compra automática', 'Modos restaurante y nevera', 'Nutricionistas y coaches (pronto)'],
    exploreTiles: [['recipes', 'Recetas'], ['training', 'Entrenamientos'], ['guides', 'Guías'], ['menopause', 'Menopausia 40+']],
  },
  pt: {
    langTitle: 'Escolha o seu idioma', langCta: 'Continuar',
    basicsTitle: 'Vamos nos conhecer', basicsSub: 'Algumas informações para personalizar o NutriPilot. Você pode alterá-las quando quiser.',
    name: 'Nome', age: 'Idade', weight: 'Peso aproximado', height: 'Altura', later: 'Responder depois', basicsCta: 'Continuar',
    namePh: 'Seu nome', needName: 'Informe o seu nome.', needAge: 'Informe uma idade entre 18 e 90 anos.',
    saving: 'Salvando suas preferências…', savingSub: 'Estamos preparando seu espaço: nutrição, treino e coach.',
    hello: 'Olá', hubSub: 'O que você quer fazer hoje?', hubQuiz: 'Criar meu programa', hubQuizSub: 'Escolha seu objetivo: 2 minutos de perguntas, um plano feito para você.',
    hubExplore: 'Explorar o NutriPilot', hubTour: 'Conhecer o app', hubTourSub: 'Todas as funções em 1 minuto',
    hubSupport: 'Ajuda e suporte', hubSupportSub: 'Perguntas frequentes e assistente',
    myProgram: 'Seu programa', seePlan: 'Ver meu plano', unlock: 'Desbloquear', explore: 'Modo descoberta', exploreSub: 'Desbloqueie seu plano para usar tudo.',
    tracks: [['Perder peso', 'Emagrecer sem dieta radical'], ['Menopausa e 40+', 'Barriga mais lisa depois dos 40'], ['Ganhar músculo', 'Treino de academia + nutrição esportiva'], ['Comer melhor', 'Mais energia, sem complicação']],
    features: ['Scanner de refeições com uma foto', 'Plano alimentar de 7 dias', 'Receitas de chef para emagrecer', 'Treinos na academia e em casa', 'Guias de menopausa', 'Coach diário', 'Acompanhamento de peso e medidas', 'Lista de compras automática', 'Modos restaurante e geladeira', 'Nutricionistas e coaches (em breve)'],
    exploreTiles: [['recipes', 'Receitas'], ['training', 'Treinos'], ['guides', 'Guias'], ['menopause', 'Menopausa 40+']],
  },
  de: {
    langTitle: 'Wähle deine Sprache', langCta: 'Weiter',
    basicsTitle: 'Lernen wir uns kennen', basicsSub: 'Ein paar Angaben, um NutriPilot zu personalisieren. Du kannst sie jederzeit ändern.',
    name: 'Vorname', age: 'Alter', weight: 'Ungefähres Gewicht', height: 'Größe', later: 'Später beantworten', basicsCta: 'Weiter',
    namePh: 'Dein Vorname', needName: 'Bitte gib deinen Vornamen ein.', needAge: 'Bitte gib ein Alter zwischen 18 und 90 ein.',
    saving: 'Deine Einstellungen werden gespeichert…', savingSub: 'Wir bereiten deinen Bereich vor: Ernährung, Training und Coach.',
    hello: 'Hallo', hubSub: 'Was möchtest du heute tun?', hubQuiz: 'Mein Programm erstellen', hubQuizSub: 'Wähle dein Ziel: 2 Minuten Fragen, ein Plan nur für dich.',
    hubExplore: 'NutriPilot entdecken', hubTour: 'Die App kennenlernen', hubTourSub: 'Alle Funktionen in 1 Minute',
    hubSupport: 'Hilfe & Support', hubSupportSub: 'Häufige Fragen und Assistent',
    myProgram: 'Dein Programm', seePlan: 'Meinen Plan ansehen', unlock: 'Freischalten', explore: 'Entdeckungsmodus', exploreSub: 'Schalte dein Abo frei, um alles zu nutzen.',
    tracks: [['Abnehmen', 'Ohne extreme Diät'], ['Wechseljahre & 40+', 'Ein flacherer Bauch nach 40'], ['Muskeln aufbauen', 'Gym-Programm + Sporternährung'], ['Besser essen', 'Mehr Energie, ganz einfach']],
    features: ['Mahlzeiten-Scanner per Foto', '7-Tage-Ernährungsplan', 'Leichte Rezepte vom Koch', 'Training im Gym & zu Hause', 'Wechseljahre-Ratgeber', 'Täglicher Coach', 'Gewicht & Maße verfolgen', 'Automatische Einkaufsliste', 'Restaurant- und Kühlschrank-Modus', 'Ernährungsberater & Coaches (bald)'],
    exploreTiles: [['recipes', 'Rezepte'], ['training', 'Workouts'], ['guides', 'Ratgeber'], ['menopause', 'Wechseljahre 40+']],
  },
  it: {
    langTitle: 'Scegli la tua lingua', langCta: 'Continua',
    basicsTitle: 'Conosciamoci', basicsSub: 'Qualche informazione per personalizzare NutriPilot. Puoi modificarle in qualsiasi momento.',
    name: 'Nome', age: 'Età', weight: 'Peso approssimativo', height: 'Altezza', later: 'Risponderò più tardi', basicsCta: 'Continua',
    namePh: 'Il tuo nome', needName: 'Inserisci il tuo nome.', needAge: 'Inserisci un’età tra 18 e 90 anni.',
    saving: 'Salvataggio delle tue preferenze…', savingSub: 'Stiamo preparando il tuo spazio: nutrizione, allenamento e coach.',
    hello: 'Ciao', hubSub: 'Cosa vuoi fare oggi?', hubQuiz: 'Crea il mio programma', hubQuizSub: 'Scegli il tuo obiettivo: 2 minuti di domande, un piano fatto per te.',
    hubExplore: 'Esplora NutriPilot', hubTour: 'Scopri l’app', hubTourSub: 'Tutte le funzioni in 1 minuto',
    hubSupport: 'Aiuto e supporto', hubSupportSub: 'Domande frequenti e assistente',
    myProgram: 'Il tuo programma', seePlan: 'Vedi il mio piano', unlock: 'Sblocca', explore: 'Modalità scoperta', exploreSub: 'Sblocca il tuo piano per usare tutto.',
    tracks: [['Perdere peso', 'Dimagrire senza diete estreme'], ['Menopausa e 40+', 'Una pancia più piatta dopo i 40'], ['Aumentare i muscoli', 'Programma palestra + nutrizione sportiva'], ['Mangiare meglio', 'Più energia, senza complicazioni']],
    features: ['Scanner dei pasti con una foto', 'Piano pasti di 7 giorni', 'Ricette dello chef per dimagrire', 'Allenamenti in palestra e a casa', 'Guide sulla menopausa', 'Coach quotidiano', 'Monitoraggio di peso e misure', 'Lista della spesa automatica', 'Modalità ristorante e frigo', 'Nutrizionisti e coach (presto)'],
    exploreTiles: [['recipes', 'Ricette'], ['training', 'Allenamenti'], ['guides', 'Guide'], ['menopause', 'Menopausa 40+']],
  },
  nl: {
    langTitle: 'Kies je taal', langCta: 'Doorgaan',
    basicsTitle: 'Laten we kennismaken', basicsSub: 'Een paar gegevens om NutriPilot persoonlijk te maken. Je kunt ze altijd wijzigen.',
    name: 'Voornaam', age: 'Leeftijd', weight: 'Geschat gewicht', height: 'Lengte', later: 'Ik antwoord later', basicsCta: 'Doorgaan',
    namePh: 'Je voornaam', needName: 'Vul je voornaam in.', needAge: 'Vul een leeftijd tussen 18 en 90 in.',
    saving: 'Je voorkeuren worden opgeslagen…', savingSub: 'We maken je ruimte klaar: voeding, training en coach.',
    hello: 'Hallo', hubSub: 'Wat wil je vandaag doen?', hubQuiz: 'Mijn programma maken', hubQuizSub: 'Kies je doel: 2 minuten vragen, een plan op maat.',
    hubExplore: 'NutriPilot verkennen', hubTour: 'De app ontdekken', hubTourSub: 'Alle functies in 1 minuut',
    hubSupport: 'Hulp & support', hubSupportSub: 'Veelgestelde vragen en assistent',
    myProgram: 'Jouw programma', seePlan: 'Mijn plan bekijken', unlock: 'Ontgrendelen', explore: 'Verkenmodus', exploreSub: 'Ontgrendel je abonnement om alles te gebruiken.',
    tracks: [['Afvallen', 'Slanker zonder extreem dieet'], ['Menopauze & 40+', 'Een plattere buik na je 40e'], ['Spieren opbouwen', 'Sportschoolprogramma + sportvoeding'], ['Beter eten', 'Meer energie, zonder gedoe']],
    features: ['Maaltijdscanner met één foto', 'Maaltijdplan voor 7 dagen', 'Lichte chef-recepten', 'Trainingen in de sportschool & thuis', 'Menopauzegidsen', 'Dagelijkse coach', 'Gewicht en maten bijhouden', 'Automatische boodschappenlijst', 'Restaurant- en koelkastmodus', 'Diëtisten & coaches (binnenkort)'],
    exploreTiles: [['recipes', 'Recepten'], ['training', 'Trainingen'], ['guides', 'Gidsen'], ['menopause', 'Menopauze 40+']],
  },
  pl: {
    langTitle: 'Wybierz język', langCta: 'Dalej',
    basicsTitle: 'Poznajmy się', basicsSub: 'Kilka informacji, by spersonalizować NutriPilot. Możesz je zmienić w każdej chwili.',
    name: 'Imię', age: 'Wiek', weight: 'Przybliżona waga', height: 'Wzrost', later: 'Odpowiem później', basicsCta: 'Dalej',
    namePh: 'Twoje imię', needName: 'Podaj swoje imię.', needAge: 'Podaj wiek od 18 do 90 lat.',
    saving: 'Zapisujemy twoje preferencje…', savingSub: 'Przygotowujemy twoją przestrzeń: żywienie, trening i coach.',
    hello: 'Cześć', hubSub: 'Co chcesz dziś zrobić?', hubQuiz: 'Stwórz mój program', hubQuizSub: 'Wybierz cel: 2 minuty pytań, plan stworzony dla ciebie.',
    hubExplore: 'Odkryj NutriPilot', hubTour: 'Poznaj aplikację', hubTourSub: 'Wszystkie funkcje w 1 minutę',
    hubSupport: 'Pomoc i wsparcie', hubSupportSub: 'Najczęstsze pytania i asystent',
    myProgram: 'Twój program', seePlan: 'Zobacz mój plan', unlock: 'Odblokuj', explore: 'Tryb podglądu', exploreSub: 'Odblokuj plan, aby korzystać ze wszystkiego.',
    tracks: [['Schudnąć', 'Bez skrajnych diet'], ['Menopauza i 40+', 'Płaski brzuch po 40.'], ['Zbudować mięśnie', 'Program na siłownię + żywienie sportowe'], ['Jeść lepiej', 'Więcej energii, bez kombinowania']],
    features: ['Skaner posiłków z jednego zdjęcia', 'Plan posiłków na 7 dni', 'Lekkie przepisy szefa kuchni', 'Treningi na siłowni i w domu', 'Poradniki o menopauzie', 'Codzienny coach', 'Śledzenie wagi i wymiarów', 'Automatyczna lista zakupów', 'Tryb restauracji i lodówki', 'Dietetycy i trenerzy (wkrótce)'],
    exploreTiles: [['recipes', 'Przepisy'], ['training', 'Treningi'], ['guides', 'Poradniki'], ['menopause', 'Menopauza 40+']],
  },
  tr: {
    langTitle: 'Dilini seç', langCta: 'Devam et',
    basicsTitle: 'Seni tanıyalım', basicsSub: 'NutriPilot’u kişiselleştirmek için birkaç bilgi. İstediğin zaman değiştirebilirsin.',
    name: 'Ad', age: 'Yaş', weight: 'Yaklaşık kilo', height: 'Boy', later: 'Sonra yanıtlayacağım', basicsCta: 'Devam et',
    namePh: 'Adın', needName: 'Lütfen adını gir.', needAge: 'Lütfen 18 ile 90 arasında bir yaş gir.',
    saving: 'Tercihlerin kaydediliyor…', savingSub: 'Alanını hazırlıyoruz: beslenme, antrenman ve koç.',
    hello: 'Merhaba', hubSub: 'Bugün ne yapmak istersin?', hubQuiz: 'Programımı oluştur', hubQuizSub: 'Hedefini seç: 2 dakikalık sorular, sana özel bir plan.',
    hubExplore: 'NutriPilot’u keşfet', hubTour: 'Uygulamayı tanı', hubTourSub: 'Tüm özellikler 1 dakikada',
    hubSupport: 'Yardım ve destek', hubSupportSub: 'Sık sorulan sorular ve asistan',
    myProgram: 'Programın', seePlan: 'Planımı gör', unlock: 'Kilidi aç', explore: 'Keşif modu', exploreSub: 'Her şeyi kullanmak için planının kilidini aç.',
    tracks: [['Kilo vermek', 'Aşırı diyet olmadan incel'], ['Menopoz ve 40+', '40 yaşından sonra daha düz bir karın'], ['Kas yapmak', 'Spor salonu programı + sporcu beslenmesi'], ['Daha iyi beslenmek', 'Daha fazla enerji, zahmetsiz']],
    features: ['Tek fotoğrafla yemek tarayıcı', '7 günlük yemek planı', 'Hafif şef tarifleri', 'Spor salonu ve ev antrenmanları', 'Menopoz rehberleri', 'Günlük koç', 'Kilo ve ölçü takibi', 'Otomatik alışveriş listesi', 'Restoran ve buzdolabı modu', 'Diyetisyenler ve koçlar (yakında)'],
    exploreTiles: [['recipes', 'Tarifler'], ['training', 'Antrenmanlar'], ['guides', 'Rehberler'], ['menopause', 'Menopoz 40+']],
  },
  ja: {
    langTitle: '言語を選択', langCta: '続ける',
    basicsTitle: 'まずは教えてください', basicsSub: 'NutriPilotをあなた向けにするための情報です。いつでも変更できます。',
    name: '名前', age: '年齢', weight: 'だいたいの体重', height: '身長', later: 'あとで答える', basicsCta: '続ける',
    namePh: 'お名前', needName: 'お名前を入力してください。', needAge: '18〜90歳の年齢を入力してください。',
    saving: '設定を保存しています…', savingSub: 'あなたのスペースを準備中：栄養、トレーニング、コーチ。',
    hello: 'こんにちは', hubSub: '今日は何をしますか？', hubQuiz: 'プログラムを作成', hubQuizSub: '目標を選ぶだけ。2分の質問で、あなた専用のプランを。',
    hubExplore: 'NutriPilotを見てみる', hubTour: 'アプリを知る', hubTourSub: '全機能を1分で',
    hubSupport: 'ヘルプ＆サポート', hubSupportSub: 'よくある質問とアシスタント',
    myProgram: 'あなたのプログラム', seePlan: 'プランを見る', unlock: 'ロック解除', explore: 'お試しモード', exploreSub: 'プランを解除するとすべて使えます。',
    tracks: [['体重を落とす', '極端な食事制限なしで'], ['更年期＆40代以上', '40歳からのおなか周りケア'], ['筋肉をつける', 'ジムプログラム＋スポーツ栄養'], ['食生活を整える', '無理なく、もっと元気に']],
    features: ['写真1枚で食事スキャン', '7日間の献立', 'シェフ考案のヘルシーレシピ', 'ジム＆自宅トレーニング', '更年期ガイド', '毎日のコーチ', '体重とサイズの記録', '自動買い物リスト', '外食モードと冷蔵庫モード', '管理栄養士＆コーチ（近日公開）'],
    exploreTiles: [['recipes', 'レシピ'], ['training', 'トレーニング'], ['guides', 'ガイド'], ['menopause', '更年期 40+']],
  },
  ko: {
    langTitle: '언어를 선택하세요', langCta: '계속',
    basicsTitle: '먼저 알려 주세요', basicsSub: 'NutriPilot을 맞춤화하기 위한 몇 가지 정보입니다. 언제든 바꿀 수 있어요.',
    name: '이름', age: '나이', weight: '대략적인 체중', height: '키', later: '나중에 답할게요', basicsCta: '계속',
    namePh: '이름', needName: '이름을 입력해 주세요.', needAge: '18세에서 90세 사이의 나이를 입력해 주세요.',
    saving: '설정을 저장하는 중…', savingSub: '나만의 공간을 준비하고 있어요: 영양, 운동, 코치.',
    hello: '안녕하세요', hubSub: '오늘은 무엇을 할까요?', hubQuiz: '내 프로그램 만들기', hubQuizSub: '목표를 고르세요. 2분 질문으로 나만의 플랜을.',
    hubExplore: 'NutriPilot 둘러보기', hubTour: '앱 알아보기', hubTourSub: '모든 기능을 1분 만에',
    hubSupport: '도움말 & 지원', hubSupportSub: '자주 묻는 질문과 어시스턴트',
    myProgram: '나의 프로그램', seePlan: '내 플랜 보기', unlock: '잠금 해제', explore: '둘러보기 모드', exploreSub: '플랜을 잠금 해제하면 모든 기능을 쓸 수 있어요.',
    tracks: [['체중 감량', '극단적인 다이어트 없이'], ['갱년기 & 40+', '40세 이후 납작한 배'], ['근육 키우기', '헬스장 프로그램 + 스포츠 영양'], ['더 잘 먹기', '부담 없이 더 많은 에너지']],
    features: ['사진 한 장으로 식사 스캔', '7일 식단', '셰프의 가벼운 레시피', '헬스장 & 홈 트레이닝', '갱년기 가이드', '매일 코치', '체중과 치수 기록', '자동 장보기 목록', '외식 모드와 냉장고 모드', '영양사 & 코치(곧 제공)'],
    exploreTiles: [['recipes', '레시피'], ['training', '운동'], ['guides', '가이드'], ['menopause', '갱년기 40+']],
  },
  zh: {
    langTitle: '选择语言', langCta: '继续',
    basicsTitle: '先认识一下你', basicsSub: '提供一些信息，让 NutriPilot 更懂你。随时可以修改。',
    name: '名字', age: '年龄', weight: '大致体重', height: '身高', later: '稍后再填', basicsCta: '继续',
    namePh: '你的名字', needName: '请输入你的名字。', needAge: '请输入 18 到 90 岁之间的年龄。',
    saving: '正在保存你的偏好…', savingSub: '正在准备你的空间：营养、训练和教练。',
    hello: '你好', hubSub: '今天想做什么？', hubQuiz: '创建我的计划', hubQuizSub: '选择目标：2 分钟答题，生成专属计划。',
    hubExplore: '探索 NutriPilot', hubTour: '了解应用', hubTourSub: '1 分钟看完全部功能',
    hubSupport: '帮助与支持', hubSupportSub: '常见问题和助手',
    myProgram: '你的计划', seePlan: '查看我的计划', unlock: '解锁', explore: '体验模式', exploreSub: '解锁方案即可使用全部功能。',
    tracks: [['减重', '不靠极端节食'], ['更年期与 40+', '40 岁后的平坦小腹'], ['增肌', '健身房计划 + 运动营养'], ['吃得更好', '更有活力，轻松无负担']],
    features: ['拍照即可扫描餐食', '7 天膳食计划', '大厨轻食食谱', '健身房与居家训练', '更年期指南', '每日教练', '体重与围度记录', '自动购物清单', '餐厅模式和冰箱模式', '营养师与教练（即将推出）'],
    exploreTiles: [['recipes', '食谱'], ['training', '训练'], ['guides', '指南'], ['menopause', '更年期 40+']],
  },
  ar: {
    langTitle: 'اختر لغتك', langCta: 'متابعة',
    basicsTitle: 'لنتعرّف عليك', basicsSub: 'بعض المعلومات لتخصيص NutriPilot. يمكنك تغييرها في أي وقت.',
    name: 'الاسم', age: 'العمر', weight: 'الوزن التقريبي', height: 'الطول', later: 'سأجيب لاحقًا', basicsCta: 'متابعة',
    namePh: 'اسمك', needName: 'يرجى إدخال اسمك.', needAge: 'يرجى إدخال عمر بين 18 و90 عامًا.',
    saving: 'جارٍ حفظ تفضيلاتك…', savingSub: 'نجهّز مساحتك: التغذية والتمرين والمدرب.',
    hello: 'مرحبًا', hubSub: 'ماذا تريد أن تفعل اليوم؟', hubQuiz: 'أنشئ برنامجي', hubQuizSub: 'اختر هدفك: أسئلة لمدة دقيقتين وخطة مصممة لك.',
    hubExplore: 'استكشف NutriPilot', hubTour: 'تعرّف على التطبيق', hubTourSub: 'كل الميزات في دقيقة واحدة',
    hubSupport: 'المساعدة والدعم', hubSupportSub: 'الأسئلة الشائعة والمساعد',
    myProgram: 'برنامجك', seePlan: 'عرض خطتي', unlock: 'فتح', explore: 'وضع الاستكشاف', exploreSub: 'افتح خطتك لاستخدام كل شيء.',
    tracks: [['خسارة الوزن', 'دون حمية قاسية'], ['سن اليأس و40+', 'بطن أكثر تسطحًا بعد الأربعين'], ['بناء العضلات', 'برنامج النادي + تغذية رياضية'], ['أكل أفضل', 'طاقة أكبر دون تعقيد']],
    features: ['ماسح الوجبات بصورة واحدة', 'خطة وجبات لـ 7 أيام', 'وصفات خفيفة من الطهاة', 'تمارين في النادي والمنزل', 'أدلة سن اليأس', 'مدرب يومي', 'تتبع الوزن والقياسات', 'قائمة تسوق تلقائية', 'وضع المطعم ووضع الثلاجة', 'أخصائيو تغذية ومدربون (قريبًا)'],
    exploreTiles: [['recipes', 'الوصفات'], ['training', 'التمارين'], ['guides', 'الأدلة'], ['menopause', 'سن اليأس 40+']],
  },
  id: {
    langTitle: 'Pilih bahasamu', langCta: 'Lanjut',
    basicsTitle: 'Kenalan dulu, yuk', basicsSub: 'Beberapa info untuk mempersonalisasi NutriPilot. Bisa diubah kapan saja.',
    name: 'Nama depan', age: 'Usia', weight: 'Perkiraan berat', height: 'Tinggi', later: 'Saya jawab nanti', basicsCta: 'Lanjut',
    namePh: 'Nama depanmu', needName: 'Masukkan nama depanmu.', needAge: 'Masukkan usia antara 18 dan 90.',
    saving: 'Menyimpan preferensimu…', savingSub: 'Kami menyiapkan ruangmu: nutrisi, latihan, dan pelatih.',
    hello: 'Halo', hubSub: 'Mau melakukan apa hari ini?', hubQuiz: 'Buat programku', hubQuizSub: 'Pilih tujuanmu: 2 menit pertanyaan, rencana khusus untukmu.',
    hubExplore: 'Jelajahi NutriPilot', hubTour: 'Kenali aplikasinya', hubTourSub: 'Semua fitur dalam 1 menit',
    hubSupport: 'Bantuan & dukungan', hubSupportSub: 'Pertanyaan umum dan asisten',
    myProgram: 'Programmu', seePlan: 'Lihat rencanaku', unlock: 'Buka', explore: 'Mode jelajah', exploreSub: 'Buka paketmu untuk memakai semuanya.',
    tracks: [['Menurunkan berat', 'Tanpa diet ekstrem'], ['Menopause & 40+', 'Perut lebih rata setelah 40'], ['Membentuk otot', 'Program gym + nutrisi olahraga'], ['Makan lebih baik', 'Lebih berenergi, tanpa ribet']],
    features: ['Pindai makanan dengan satu foto', 'Rencana makan 7 hari', 'Resep ringan dari koki', 'Latihan di gym & rumah', 'Panduan menopause', 'Pelatih harian', 'Pelacakan berat dan ukuran tubuh', 'Daftar belanja otomatis', 'Mode restoran dan kulkas', 'Ahli gizi & pelatih (segera)'],
    exploreTiles: [['recipes', 'Resep'], ['training', 'Latihan'], ['guides', 'Panduan'], ['menopause', 'Menopause 40+']],
  },
};
function lang() {
  return I18N[state.lang] ? state.lang : 'fr';
}
function t(key) {
  return I18N[lang()]?.[key] ?? I18N.fr[key] ?? key;
}
function detectLang() {
  const code = String(navigator.language || 'fr').slice(0, 2).toLowerCase();
  return I18N[code] ? code : 'en';
}

let pendingLang = '';
function langChip() {
  const cur = LANGS.find((x) => x[0] === lang()) || LANGS[0];
  return `<button class="lang-chip" data-go="lang" aria-label="${L('Langue')}"><span>${cur[2]}</span>${esc(cur[0].toUpperCase())}</button>`;
}
function langScreen() {
  const current = pendingLang || state.lang || detectLang();
  prefetchDict(current);
  return `<div class="welcome">
    <div class="welcome-inner">
      <div class="lang-top">${state.lang ? `<button class="back" data-lang-ok="${current}" aria-label="${L('Retour')}">${lang() === 'ar' ? '→' : '←'}</button>` : '<span></span>'}${logo()}<span></span></div>
      <div class="welcome-copy"><h1>${esc(I18N[current]?.langTitle || t('langTitle'))}</h1></div>
      <div class="lang-grid">${LANGS.map(([code, label, flag]) => `<button class="lang-card ${code === current ? 'selected' : ''}" data-lang="${code}" aria-pressed="${code === current}" lang="${code}"><span>${flag}</span><b>${label}</b></button>`).join('')}</div>
      <div class="welcome-cta"><button class="btn btn-lime btn-wide btn-xl" data-lang-ok="${current}">${esc(I18N[current]?.langCta || 'Continuer')}</button></div>
    </div>
  </div>`;
}

// ---- Showcase: 3D phone with the niche's real screens, floating cards that follow the finger / tilt ----
function showcase(focus) {
  const f = FOCI[focus] || null;
  const name = esc(state.profile?.name || '');
  const ring = (pct, big, small) => `<div class="sc-ring" style="--p:${pct}"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" class="sc-ring-bg"/><circle cx="60" cy="60" r="50" class="sc-ring-fg" pathLength="100"/></svg><span><b>${big}</b><small>${small}</small></span></div>`;
  const screens = {
    lose: `<div class="sc-top"><small>${L('Aujourd’hui')}</small><b>${name ? L('Bonjour {name}', { name }) : L('Ma journée')}</b></div>
      ${ring(68, '1 240', L('kcal restantes'))}
      <div class="sc-macros"><i style="--w:72%"><b>${L('Protéines')}</b></i><i style="--w:54%"><b>${L('Glucides')}</b></i><i style="--w:40%"><b>${L('Lipides')}</b></i></div>
      <div class="sc-meal">${icon('scan')}<span><b>${L('Bowl saumon & quinoa')}</b><small>520 kcal · 34 g ${L('prot.')}</small></span></div>`,
    meno: `<div class="sc-top"><small>${L('Ménopause 40+')}</small><b>${L('Semaine {n} sur 8', { n: 3 })}</b></div>
      <div class="sc-week">${[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `<i class="${n < 3 ? 'done' : n === 3 ? 'now' : ''}">${n}</i>`).join('')}</div>
      <div class="sc-sym">${[[L('Bouffées de chaleur'), 30], [L('Sommeil'), 78], [L('Énergie'), 64]].map(([l, v]) => `<div><span>${l}</span><i style="--w:${v}%"></i></div>`).join('')}</div>
      <div class="sc-meal">${icon('moon')}<span><b>${L('Relaxation du soir')}</b><small>8 min · ${L('Sommeil & stress')}</small></span></div>`,
    recipes: `<div class="sc-top"><small>${L('Recettes')}</small><b>${L('Pour maigrir')}</b></div>
      <div class="sc-chips"><i class="on">${L('Pour maigrir')}</i><i>${L('Prise de muscle')}</i><i>${L('15 min')}</i></div>
      <div class="sc-dish"><span class="sc-plate"><i></i><i></i><i></i></span><b>${L('Poulet citron, légumes rôtis')}</b><small>430 kcal · 38 g ${L('prot.')} · 25 min</small></div>
      <div class="sc-meal">${icon('list')}<span><b>${L('Liste de courses')}</b><small>${L('{n} ingrédients ajoutés', { n: 7 })}</small></span></div>`,
    training: `<div class="sc-top"><small>${L('Mon planning')}</small><b>${L('Jambes')} · ${esc(new Date(2026, 0, 7).toLocaleDateString(locale(), { weekday: 'long' }))}</b></div>
      <div class="sc-days">${[1, 0, 2, 0, 1, 0, 0].map((on, i) => `<i class="${on ? 'on' : ''}">${esc(new Date(2026, 0, 5 + i).toLocaleDateString(locale(), { weekday: 'narrow' }))}</i>`).join('')}</div>
      <div class="sc-ex">${exAnim('squat', 'sm')}<span><b>${L('Squat')}</b><small>4 × 10 · 40 kg</small></span></div>
      <div class="sc-meal">${icon('progress')}<span><b>${L('Nouveau record')}</b><small>+2,5 kg</small></span></div>`,
  };
  const k = f ? focus : 'lose';
  const chips = {
    lose: [['scan', L('Assiette scannée'), '520 kcal'], ['flame', L('Recette pour maigrir'), '≤ 450 kcal'], ['progress', L('Poids'), '−0,4 kg']],
    meno: [['flower', L('Symptômes'), L('en baisse')], ['moon', L('Sommeil'), '7 h 10'], ['dumbbell', L('Renforcement'), '20 min']],
    recipes: [['dumbbell', L('Prise de muscle'), '42 g prot.'], ['timer', L('Prête en'), '15 min'], ['leaf', L('Végétarienne'), '360 kcal']],
    training: [['calendar', L('Jambes'), '2 × / sem.'], ['timer', L('Repos'), '1:30'], ['fork', L('Après séance'), '35 g prot.']],
  }[k];
  return `<div class="sc-stage ${f ? f.tone : 'm-kit'}" data-tilt aria-hidden="true">
    <div class="sc-glow"></div>
    <div class="sc-phone"><div class="sc-notch"></div><div class="sc-screen">${screens[k]}</div></div>
    ${chips.map(([ico, a, b], i) => `<div class="sc-float f${i + 1}"><span class="mod-ico">${icon(ico)}</span><span><small>${a}</small><b>${b}</b></span></div>`).join('')}
  </div>`;
}
function helloScreen() {
  const fk = currentFocus();
  const f = FOCI[fk];
  const title = f ? f.title : 'Mincir, s’entraîner, bien manger et vivre la ménopause sereinement.';
  const sub = f ? f.sub : 'Une seule app pour la nutrition, les recettes, l’entraînement, la ménopause 40+ et le sommeil. Choisissez ce qui compte pour vous.';
  return `<div class="hello ${f ? f.tone : ''}">
    <div class="hello-top">${logo()}${loginLink('Se connecter')}</div>
    <div class="hello-copy">
      ${f ? `<span class="hello-kicker">${icon(f.ico)} ${L(f.kicker)}</span>` : ''}
      <h1>${L(title)}</h1>
      <p>${L(sub)}</p>
    </div>
    ${showcase(fk)}
    <div class="hello-pick" role="radiogroup" aria-label="${L('Votre objectif')}">${Object.entries(FOCI).map(([id, x]) => `<button class="${x.tone} ${fk === id ? 'on' : ''}" role="radio" aria-checked="${fk === id}" data-focus="${id}"><span class="mod-ico">${icon(x.ico)}</span>${L(x.kicker)}</button>`).join('')}</div>
    ${f ? `<ul class="hello-points">${f.points.map(([ico, a, b]) => `<li><span class="mod-ico">${icon(ico)}</span><span><b>${L(a)}</b><small>${L(b)}</small></span></li>`).join('')}</ul>` : ''}
    <div class="hello-cta">
      <button class="btn btn-lime btn-wide btn-xl" data-hello-start>${L('Créer mon plan gratuit')}</button>
      <p>${L('Nutrition, entraînement et bien-être, dans une seule app.')}</p>
    </div>
    <div class="hello-trust">${[['fork', `${ALL_RECIPES.length}`, L('recettes')], ['dumbbell', `${Object.keys(EXERCISES).length}`, L('exercices')], ['globe', `${LANGS.length}`, L('langues')]].map(([ico, n, l]) => `<div>${icon(ico)}<b>${n}</b><span>${l}</span></div>`).join('')}</div>
  </div>`;
}

function basicsScreen() {
  const d = state.profile || {};
  return `<div class="welcome light">
    <div class="welcome-inner">
      <div class="ob-top"><button class="back" data-go="hello" aria-label="←">←</button>${logo()}</div>
      <div class="welcome-copy"><h1>${esc(t('basicsTitle'))}</h1><p>${esc(t('basicsSub'))}</p></div>
      <div class="basics-form">
        <label class="field"><span>${esc(t('name'))}</span><input id="b-name" type="text" autocomplete="given-name" placeholder="${esc(t('namePh'))}" value="${esc(d.name || '')}"></label>
        <label class="field"><span>${esc(t('age'))}</span><div class="unit-input"><input id="b-age" type="number" inputmode="numeric" min="18" max="90" value="${esc(state.basicsFilled?.age ? d.age || '' : '')}"><i>${({ fr: 'ans', en: 'yrs', es: 'años', pt: 'anos', de: 'J.', it: 'anni', nl: 'jr', pl: 'lat', tr: 'yaş', ja: '歳', ko: '세', zh: '岁', ar: 'سنة', id: 'thn' })[lang()]}</i></div></label>
        <div class="basics-optional" id="b-optional">
          <label class="field"><span>${esc(t('weight'))}</span><div class="unit-input"><input id="b-weight" type="number" inputmode="decimal" min="35" max="250" step="0.1" value="${esc(state.basicsFilled?.weight ? d.weight || '' : '')}"><i>kg</i></div></label>
          <label class="field"><span>${esc(t('height'))}</span><div class="unit-input"><input id="b-height" type="number" inputmode="numeric" min="130" max="220" value="${esc(state.basicsFilled?.height ? d.height || '' : '')}"><i>cm</i></div></label>
        </div>
        ${locationPicker(true)}
        <label class="later-toggle"><input type="checkbox" id="b-later"> ${esc(t('later'))}</label>
      </div>
      <div class="welcome-cta"><button class="btn btn-primary btn-wide btn-xl" data-basics-ok>${esc(t('basicsCta'))}</button></div>
    </div>
  </div>`;
}

let savingTimer = null;
let savingIndex = 0;
function savingScreen() {
  const features = t('features').slice(0, 9); // last item announced a future service
  return `<div class="welcome saving">
    <div class="welcome-inner">
      ${logo()}
      <div class="saving-center">
        <div class="analyzing-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" class="ring-fg" style="stroke-dashoffset:${327 - 327 * Math.min(savingIndex, features.length) / features.length}"/></svg><b>${Math.round(Math.min(savingIndex, features.length) / features.length * 100)} %</b></div>
        <h1 class="analyzing-title">${esc(t('saving'))}</h1>
        <p class="saving-sub">${esc(t('savingSub'))}</p>
        <div class="feature-ticker">${features.map((f, i) => `<div class="${i < savingIndex ? 'done' : i === savingIndex ? 'current' : ''}"><span>${i < savingIndex ? '✓' : ''}</span>${esc(f)}</div>`).join('')}</div>
      </div>
    </div>
  </div>`;
}
// The questionnaire, starting from what the person already answered (name, age, weight, height are skipped).
function startQuiz(chosen) {
  const source = state.profile?.estimated
    ? Object.fromEntries(Object.entries(state.profile).filter(([k]) => state.basicsFilled?.[k]))
    : state.profile;
  const data = { ...source };
  if (chosen) {
    data.track = chosen;
    if (chosen === 'lose' || chosen === 'menopause') data.goal = 'lose';
    else if (chosen !== state.profile.track) delete data.goal;
    if (chosen === 'menopause') data.sex = 'female';
  }
  onboardingState = { step: 0, data, skip: Object.keys(state.basicsFilled || {}).filter((k) => state.basicsFilled[k]) };
  if (!stepVisible(0)) onboardingState.step = moveStep(1);
  state.onboarding = state.premium ? state.onboarding : false;
  track('SelectTrack', { track: chosen || '' });
  return nav('onboarding');
}
const FOCUS_TRACK = { lose: 'lose', meno: 'menopause', recipes: 'eat', training: 'muscle' };
function startSaving() {
  clearInterval(savingTimer);
  savingIndex = 0;
  savingTimer = setInterval(() => {
    savingIndex += 1;
    if (route !== 'saving') { clearInterval(savingTimer); savingTimer = null; return; }
    if (savingIndex > t('features').slice(0, 9).length) {
      clearInterval(savingTimer); savingTimer = null;
      state.basicsDone = true;
      saveState(false);
      // v10 — the path that converts: questionnaire → "your plan is ready" → plans (exploring stays one tap away).
      if (!state.premium && !state.onboarding) return startQuiz(FOCUS_TRACK[state.focus] || '');
      return nav('hub');
    }
    render();
  }, 380);
}


function exploreBanner() {
  if (fullAccess() || route === 'modules') return '';
  return `<button class="explore-banner" data-go="plans">${icon('lock')}<span><b>${esc(t('explore'))}</b>${esc(t('exploreSub'))}</span><em>${esc(t('unlock'))} →</em></button>`;
}

// ---- Découvrir l'application -----------------------------------------------
const TOUR = [
  ['scan', 'Scanner de repas', 'Prenez votre assiette en photo, écrivez ou dictez ce que vous mangez, scannez un code-barres ou une étiquette. NutriPilot estime calories, protéines, glucides, lipides, fibres et sel, et vous corrigez les grammes en un geste.', 'add'],
  ['home', 'Aujourd’hui', 'Votre tableau de bord : calories restantes, protéines, eau, check-in du jour et la prochaine décision à prendre.', 'app'],
  ['program', 'Plan de repas 7 jours', 'Un plan adapté à votre objectif, vos goûts, vos allergies, votre budget et votre temps de cuisine, avec la liste de courses rangée par rayon.', 'program'],
  ['star', 'Que manger ensuite ?', 'Vos calories et protéines restantes deviennent des idées de repas concrètes. Mode frigo : dites ce que vous avez. Mode restaurant : on vous aide à choisir.', 'planner'],
  ['dumbbell', 'Entraînement', 'Programmes en salle (développé couché, squat, presse, hip thrust…) ou à la maison, avec séries, répétitions, repos, conseils d’exécution et suivi des charges.', 'training'],
  ['coach', 'Coach', 'Posez vos questions à tout moment : il connaît vos repères et votre semaine.', 'coach'],
  ['progress', 'Progrès', 'Poids, tendance, mensurations, régularité, badges et bilan hebdomadaire avec 3 priorités pour la semaine suivante.', 'progress'],
  ['bell', 'Guides', 'Ménopause, premiers pas, restaurant, grignotage : des fiches courtes avec une action à faire le jour même.', 'guides'],
];
function tourScreen() {
  return `<div class="mobile-app">
    <div class="app-head"><div class="app-head-row"><button class="icon-btn" data-nav-back aria-label="${L('Retour')}">${icon('back')}</button><h2>${esc(t('hubTour'))}</h2><span></span></div></div>
    <div class="screen">
      <h1 class="screen-title">${L('Tout NutriPilot, en un coup d’œil.')}</h1>
      <div class="tour-list">${TOUR.map(([ico, title, text, r]) => `<div class="tour-card"><span class="tour-ico">${icon(ico)}</span><div><b>${esc(L(title))}</b><p>${esc(L(text))}</p><button class="link-btn" ${r === 'add' ? 'data-open-add' : `data-go="${r}"`}>${L('Essayer →')}</button></div></div>`).join('')}</div>
      <button class="btn btn-lime btn-wide btn-xl" data-go="app">${L('Créer mon programme')}</button>
    </div>
    ${bottom('')}
  </div>`;
}

// ---- Support ---------------------------------------------------------------
const FAQ = [
  ['Comment fonctionne l’essai gratuit ?', 'Quand la boutique propose un essai gratuit, sa durée est indiquée sur le bouton d’achat (par exemple 7 jours sur la formule annuelle), avec un accès complet. Aucun paiement pendant l’essai. L’abonnement démarre ensuite, sauf si vous annulez au moins 24 h avant la fin. Nous vous envoyons un rappel 2 jours avant.'],
  ['Comment annuler mon abonnement ?', 'iPhone : Réglages › votre nom › Abonnements › NutriPilot. Android : Play Store › votre profil › Paiements et abonnements › Abonnements. Supprimer l’application n’annule pas l’abonnement.'],
  ['Quelle différence entre les formules ?', 'Nutrition : scanner, plan de repas, recettes, courses, cours nutrition et coach. Entraînement : programmes salle et maison avec suivi des charges et cours musculation. Kit complet : tout NutriPilot, Académie incluse, au meilleur prix.'],
  ['Le scanner est-il précis ?', 'Une photo ne pèse pas un aliment : NutriPilot affiche des estimations. Vous pouvez corriger chaque quantité avant d’enregistrer. Le code-barres et l’étiquette donnent des valeurs plus précises.'],
  ['Puis-je utiliser NutriPilot avec un problème de santé ?', 'NutriPilot ne remplace pas un médecin ou un diététicien. En cas de grossesse, de maladie, de traitement ou de trouble du comportement alimentaire, demandez d’abord l’avis d’un professionnel. L’application est réservée aux adultes.'],
  ['Comment me faire rembourser ?', 'Les achats faits dans l’App Store ou Google Play sont remboursés par Apple ou Google, selon leurs conditions. Pour toute autre question de paiement, écrivez-nous.'],
  ['Mes données sont-elles protégées ?', 'Vos données servent uniquement à faire fonctionner votre programme. Vous pouvez les exporter ou les supprimer à tout moment depuis Réglages.'],
  ['Puis-je utiliser NutriPilot sur plusieurs appareils ?', 'Oui, connectez-vous avec le même compte sur votre téléphone, votre tablette ou votre ordinateur.'],
  ['Y aura-t-il des nutritionnistes et des coachs ?', 'Oui, c’est prévu : des professionnels diplômés rejoindront NutriPilot prochainement. Nous vous préviendrons dans l’application.'],
];
let supportMessages = [];
let supportLoading = false;
function supportScreen() {
  return `<div class="mobile-app">
    <div class="app-head"><div class="app-head-row"><button class="icon-btn" data-nav-back aria-label="${L('Retour')}">${icon('back')}</button><h2>${esc(t('hubSupport'))}</h2><span></span></div></div>
    <div class="screen">
      <h1 class="screen-title">${L('Comment pouvons-nous vous aider ?')}</h1>
      <button class="today-card support-cta" data-support-open>${icon('help')}<span><b>${L('Discuter avec l’assistant')}</b><small>${L('Réponse immédiate, 24 h/24')}</small></span><em>→</em></button>
      <div class="section-label"><h3>${L('Questions fréquentes')}</h3></div>
      <div class="session-list">${FAQ.map(([q, a]) => `<details class="ex-card faq"><summary><span class="ex-main"><b>${esc(L(q))}</b></span><span class="guide-arrow">+</span></summary><p>${esc(L(a))}</p></details>`).join('')}</div>
      <div class="day-card"><h3>${L('Écrire à l’équipe')}</h3><p class="screen-sub">${L('Nous répondons par e-mail, en général sous 24 h ouvrées.')}</p><a class="btn btn-ghost btn-wide" href="mailto:${esc(config.supportEmail)}">${esc(config.supportEmail)}</a></div>
    </div>
    ${bottom('')}
  </div>`;
}

function supportSheet() {
  const intro = L('Aide NutriPilot. Consultez les réponses sur la connexion, les abonnements et vos données.');
  return `<div class="sheet-head"><div><span class="tag">SUPPORT</span><h2>${L('Assistant NutriPilot')}</h2></div><button class="icon-btn" data-close>×</button></div>
    <div class="chat-log" id="support-log">
      <div class="bubble bot">${esc(intro)}</div>
      ${supportMessages.map((m) => `<div class="bubble ${m.role === 'user' ? 'me' : 'bot'}">${esc(m.text)}</div>`).join('')}
      ${supportLoading ? '<div class="bubble bot typing"><i></i><i></i><i></i></div>' : ''}
    </div>
    ${supportMessages.length ? '' : `<div class="quick-row">${FAQ.slice(0, 3).map(([q]) => `<button class="mini-choice" data-support-quick="${esc(L(q))}">${esc(L(q))}</button>`).join('')}</div>`}
    <div class="chat-input"><input id="support-input" type="text" maxlength="600" placeholder="${L('Votre question…')}" autocomplete="off"><button class="btn btn-primary" data-support-send>${L('Envoyer')}</button></div>
    <p class="fine center-fine">${L('Assistant automatique. Pour un problème de paiement : {email}', { email: esc(config.supportEmail) })}</p>`;
}

async function sendSupport(text) {
  const message = String(text || '').trim().slice(0, 600);
  if (!message || supportLoading) return;
  supportMessages.push({ role: 'user', text: message });
  supportLoading = true;
  renderModal();
  try {
    await aiGate('/api/support');
    const response = await fetch('/api/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: lang(), messages: supportMessages.slice(-8) }) });
    const data = await response.json();
    supportMessages.push({ role: 'assistant', text: response.ok ? data.answer : (data.error || L('Écrivez-nous à {email}.', { email: config.supportEmail })) });
  } catch {
    supportMessages.push({ role: 'assistant', text: L('Connexion impossible. Écrivez-nous à {email}.', { email: config.supportEmail }) });
  }
  supportLoading = false;
  renderModal();
  track('SupportMessage');
}

function supportBubble() {
  return `<button class="support-fab" data-support-open aria-label="${esc(t('hubSupport'))}">${icon('help')}</button>`;
}

const PREMIUM_ACTIONS = ['openAdd', 'addTab', 'generateWeek', 'weekReview', 'compose', 'fridge', 'restaurant', 'smartSwap', 'coachSend', 'quickCoach', 'swapPlan', 'planRecipe', 'addPlanMeal', 'saveProgress', 'recalibrate'];

const analyzingSteps = ['Analyse de votre profil', 'Calcul de vos besoins énergétiques', 'Choix de votre rythme', 'Sélection de vos recettes', 'Préparation de votre programme'];
let analyzingTimer = null;
let analyzingStep = 0;

function analyzing() {
  const done = Number(analyzingStep || 0);
  return `<div class="welcome analyzing">
    <div class="welcome-inner">
      ${logo()}
      <div class="analyzing-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" class="ring-fg" style="stroke-dashoffset:${327 - (327 * Math.min(done, analyzingSteps.length)) / analyzingSteps.length}"/></svg><b>${Math.round(Math.min(done, analyzingSteps.length) / analyzingSteps.length * 100)} %</b></div>
      <h1 class="analyzing-title">${onboardingState.data.name ? L('{name}, nous préparons votre programme…', { name: esc(onboardingState.data.name) }) : L('Nous préparons votre programme…')}</h1>
      <div class="analyzing-list">${analyzingSteps.map((label, index) => `<div class="${index < done ? 'done' : index === done ? 'current' : ''}"><span>${index < done ? '✓' : ''}</span>${esc(L(label))}</div>`).join('')}</div>
    </div>
  </div>`;
}

function startAnalyzing() {
  clearInterval(analyzingTimer);
  analyzingStep = 0;
  const stop = () => { clearInterval(analyzingTimer); analyzingTimer = null; };
  analyzingTimer = setInterval(() => {
    analyzingStep += 1;
    if (route !== 'analyzing') return stop();
    if (analyzingStep > analyzingSteps.length) {
      stop();
      return nav('plan');
    }
    render();
  }, 750);
}

function calculatePlan(data = onboardingState.data) {
  const p = { ...data };
  const age = Number(p.age);
  const weight = Number(p.weight);
  const height = Number(p.height);
  const base = 10 * weight + 6.25 * height - 5 * age;
  const sexOffset = p.sex === 'male' ? 5 : p.sex === 'female' ? -161 : -78;
  const bmr = base + sexOffset;
  const tdee = bmr * Number(p.activity || 1.375);
  let kcal = tdee;
  let warning = '';

  if (p.goal === 'lose') {
    const desiredDeficit = Number(p.speed || 0.35) * 7700 / 7;
    const cappedDeficit = Math.min(desiredDeficit, tdee * 0.2);
    kcal = tdee - cappedDeficit;
    const floor = p.sex === 'male' ? 1500 : p.sex === 'female' ? 1200 : 1300;
    if (kcal < floor) {
      kcal = floor;
      warning = 'NutriPilot a limité le déficit calculé. Si votre situation est particulière, demandez un avis professionnel.';
    }
  }
  if (p.goal === 'gain') kcal = tdee + Math.min(300, tdee * 0.12);

  const bmi = weight / ((height / 100) ** 2);
  if (age < 18) warning = 'Cette version est réservée aux adultes.';
  if (p.goal === 'lose' && bmi < 18.5) {
    kcal = tdee;
    warning = 'NutriPilot ne crée pas de déficit avec un IMC inférieur à 18,5. Parlez-en avec un professionnel adapté.';
  }

  kcal = Math.round(kcal / 10) * 10;

  // Les repères macro restent compatibles avec la cible énergétique, même pour
  // les profils avec un poids de départ élevé. Pour une perte de poids, la
  // protéine est basée sur un poids de référence raisonnable plutôt que sur le
  // poids actuel sans plafond.
  const targetWeight = Number(p.target || weight);
  const referenceWeight = p.goal === 'lose'
    ? Math.max(45, Math.min(weight, targetWeight > 0 ? targetWeight : weight))
    : Math.max(45, Math.min(weight, 120));

  const proteinDesired = referenceWeight * (p.goal === 'gain' ? 1.8 : 1.6);
  const protein = Math.round(clamp(Math.min(proteinDesired, kcal * 0.35 / 4), 65, 200));
  const fatDesired = referenceWeight * 0.8;
  const fat = Math.round(clamp(Math.min(fatDesired, kcal * 0.30 / 9), 40, 100));
  const carbs = Math.max(80, Math.round((kcal - protein * 4 - fat * 9) / 4));
  const fiber = Math.max(25, Math.round(kcal / 1000 * 14));

  return applyManualTargets({ ...p, bmr: Math.round(bmr), tdee: Math.round(tdee), bmi: +bmi.toFixed(1), dailyKcal: kcal, protein, carbs, fat, fiber, warning });
}

const ICONS = {
  back: '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
  trophy: '<path d="M8 4h8v4.5a4 4 0 0 1-8 0z"/><path d="M8 6H5.5a2.5 2.5 0 0 0 2.6 3.3M16 6h2.5a2.5 2.5 0 0 1-2.6 3.3M12 12.5V16M9 20h6M10 16h4v4h-4z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
  home: '<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/>',
  program: '<rect x="4.5" y="4.5" width="15" height="15" rx="3"/><path d="M8.5 9.5h7M8.5 12.5h7M8.5 15.5h4"/>',
  scan: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3.5"/>',
  coach: '<path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V16h0.5A2.5 2.5 0 0 1 5 13.5z"/><path d="M9 9.5h6M9 12h4"/>',
  progress: '<path d="M4 18 9.5 12.5l3.5 3.5L20 9"/><path d="M15 9h5v5"/>',
  check: '<path d="M5 12.5 10 17l9-10"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  bell: '<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  dumbbell: '<path d="M6.5 8v8M17.5 8v8M4 10v4M20 10v4M6.5 12h11"/>',
  help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.7"/><path d="M12 17h.01"/>',
  star: '<path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
  timer: '<circle cx="12" cy="13.5" r="7"/><path d="M12 10v3.5l2.2 1.6M9.5 3.5h5"/>',
  list: '<path d="M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01"/>',
  share: '<path d="M12 15V3.5M7.5 8 12 3.5 16.5 8"/><path d="M5 12.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6.5"/>',
  swap: '<path d="M7 4.5 3.5 8 7 11.5M3.5 8h13M17 12.5l3.5 3.5-3.5 3.5M20.5 16h-13"/>',
  camera: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.3l1.4-2h5.6l1.4 2h2.3A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.4"/>',
  drop: '<path d="M12 3.5c3.5 4.2 6 7.6 6 10.6a6 6 0 0 1-12 0c0-3 2.5-6.4 6-10.6z"/><path d="M9.5 14.5a2.6 2.6 0 0 0 2.5 2.5"/>',
  flame: '<path d="M12 21c3.9 0 6.5-2.6 6.5-6.2 0-3.4-2.4-5.6-4-8.3-.4 1.9-1.4 3-2.6 3.6.3-2.4-.6-5-2.9-7.1C9 6.5 5.5 9.4 5.5 14.4 5.5 18.4 8.1 21 12 21z"/>',
  calendar: '<rect x="4" y="5.5" width="16" height="14.5" rx="3"/><path d="M8 3.5v4M16 3.5v4M4 10h16"/>',
  book: '<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5z"/><path d="M5 20.5V5.5M9 7.5h6"/>',
  flower: '<circle cx="12" cy="10" r="2.4"/><path d="M12 7.6c0-2.6 3.6-2.6 3.6 0 2.6 0 2.6 3.6 0 3.6M12 7.6c0-2.6-3.6-2.6-3.6 0-2.6 0-2.6 3.6 0 3.6M15.6 11.2c0 2.6-3.6 2.6-3.6.2M8.4 11.2c0 2.6 3.6 2.6 3.6.2M12 12.4V21M12 17c-2-2.2-4.2-2.2-5-1"/>',
  scale: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 9.5a4 4 0 0 1 6 0M12 9.5l1.4-1.8"/>',
  user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M18 6l-1.6 1.6M7.6 16.4 6 18M18 18l-1.6-1.6M7.6 7.6 6 6"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.3 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.3-3.5-8.5s1.1-6.1 3.5-8.5z"/>',
  logout: '<path d="M14 4.5h3.5A2.5 2.5 0 0 1 20 7v10a2.5 2.5 0 0 1-2.5 2.5H14M10 16.5 5.5 12 10 7.5M5.5 12H15"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
  leaf: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19 13 11"/>',
  pill: '<rect x="3.5" y="8.5" width="17" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="m9.5 8.5 5 7"/>',
  moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  wave: '<path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/>',
  sparkle: '<path d="M12 3.5 13.8 10l6.7 2-6.7 2L12 20.5 10.2 14 3.5 12l6.7-2z"/>',
  fork: '<path d="M7 3.5v7a2 2 0 0 0 4 0v-7M9 10.5v10M16.5 20.5V3.5c-2 1-3 3.6-3 6.5v3h3"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
  flag: '<path d="M6 21V4M6 4.5h10l-2 3.5 2 3.5H6"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
  cart: '<path d="M3.5 4.5h2.2l2 10.5h9.6l2-7.5H7"/><circle cx="9.5" cy="19" r="1.3"/><circle cx="16.5" cy="19" r="1.3"/>',
};
function icon(name, cls = '') {
  if (name === 'chevron' || name === 'back') cls += ' flip-rtl';
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

function dateFr(date, withYear = false) {
  const opts = { day: 'numeric', month: 'long' };
  if (withYear || date.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric';
  return date.toLocaleDateString(locale(), opts);
}

function projection(p) {
  if (p.goal !== 'lose' || !p.speed) return null;
  const delta = Math.abs(Number(p.weight) - Number(p.target));
  const weeks = Math.max(1, Math.round(delta / Number(p.speed)));
  const end = new Date(Date.now() + weeks * 7 * 86400000);
  const firstWeeks = Math.min(4, weeks);
  const firstLoss = Math.min(delta, Number(p.speed) * firstWeeks);
  const firstDate = new Date(Date.now() + firstWeeks * 7 * 86400000);
  return { delta, weeks, end, firstLoss, firstDate, firstWeeks };
}

function projectionChart(p, proj) {
  const w = 320, h = 150, x0 = 18, x1 = 302, y0 = 26, y1 = 118;
  return `<svg class="proj-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Projection de votre poids">
    <defs><linearGradient id="projFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9f23d" stop-opacity=".45"/><stop offset="1" stop-color="#b9f23d" stop-opacity="0"/></linearGradient></defs>
    <path d="M${x0} ${y0} C ${x0 + 110} ${y0 + 10}, ${x1 - 120} ${y1}, ${x1} ${y1} L ${x1} ${h} L ${x0} ${h} Z" fill="url(#projFill)"/>
    <path class="proj-line" d="M${x0} ${y0} C ${x0 + 110} ${y0 + 10}, ${x1 - 120} ${y1}, ${x1} ${y1}" fill="none" stroke="#102419" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="${x0}" cy="${y0}" r="6" fill="#fff" stroke="#102419" stroke-width="3"/>
    <circle cx="${x1}" cy="${y1}" r="8" fill="#d7ff6a" stroke="#102419" stroke-width="3"/>
    <text x="${x0}" y="14" class="proj-label">${kgFmt(p.weight)} kg</text>
    <text x="${x1}" y="${y1 - 16}" text-anchor="end" class="proj-label strong">${kgFmt(p.target)} kg</text>
    <text x="${x0}" y="${h - 4}" class="proj-axis">${L('Aujourd’hui')}</text>
    <text x="${x1}" y="${h - 4}" text-anchor="end" class="proj-axis">${esc(dateFr(proj.end))}</text>
  </svg>`;
}

const MOTIVATION_LINE = {
  confidence: 'Vous retrouvez confiance en vous.',
  clothes: 'Vous rentrez à nouveau dans vos vêtements.',
  energy: 'Vous retrouvez votre énergie.',
  health: 'Vous prenez soin de votre santé.',
};

function planScreen() {
  const p = calculatePlan();
  const proj = projection(p);
  const cta = state.premium ? L('Entrer dans mon programme') : L('Débloquer mon programme');
  const vars = { name: esc(p.name || ''), target: `<span class="hl">${kgFmt(p.target)} kg</span>`, date: proj ? esc(dateFr(proj.end)) : '' };
  const title = proj
    ? L(p.name ? '{name}, vous pouvez atteindre {target} le {date}.' : 'Vous pouvez atteindre {target} le {date}.', vars)
    : L(p.name ? '{name}, votre programme est prêt.' : 'Votre programme est prêt.', vars);
  return `<div class="mobile-app no-nav">
    <div class="app-head"><div class="app-head-row">${logo()}${state.premium ? '<span class="pill premium-pill">Premium ✓</span>' : ''}</div></div>
    <div class="screen">
      <div class="program-ready"><span class="tag">${L('VOTRE PROGRAMME EST PRÊT')}</span>
      <h1 class="screen-title">${title}</h1>
      </div>
      ${proj ? `<div class="today-card proj-card">
        ${projectionChart(p, proj)}
        <div class="proj-milestone">${icon('check')}<span>${L('Premier cap : {loss} d’ici le {date}', { loss: `<b>−${kgFmt(Math.round(proj.firstLoss * 10) / 10)} kg</b>`, date: esc(dateFr(proj.firstDate)) })}</span></div>
        ${MOTIVATION_LINE[p.motivation] ? `<div class="proj-milestone">${icon('star')}<span>${esc(L(MOTIVATION_LINE[p.motivation]))}</span></div>` : ''}
        <div class="fine">${L('Estimation selon le rythme choisi (≈ {speed} kg / semaine). Chaque corps est différent : NutriPilot ajuste votre plan selon vos résultats réels.', { speed: fmt(p.speed, 2) })}</div>
      </div>` : ''}
      <div class="today-card goal-card">
        <small>${L('Votre repère quotidien')}</small>
        <div class="hero-number">${fmt(p.dailyKcal)} <span>kcal</span></div>
        <div class="macro-row-4">
          <div><small>${L('Protéines')}</small><b>${p.protein} g</b></div>
          <div><small>${L('Glucides')}</small><b>${p.carbs} g</b></div>
          <div><small>${L('Lipides')}</small><b>${p.fat} g</b></div>
          <div><small>${L('Fibres')}</small><b>${p.fiber} g</b></div>
        </div>
      </div>
      ${p.warning ? `<div class="warn"><b>${L('À noter.')}</b><br>${esc(L(p.warning))}</div>` : ''}
      <div class="section-label"><h3>${L('Ce que comprend votre programme')}</h3></div>
      <div class="benefits feature-list">${PROGRAM_FEATURES.map((x) => `<div class="benefit"><span class="check">✓</span><b>${esc(L(x))}</b></div>`).join('')}</div>
      <div class="sticky-cta"><button class="btn btn-lime btn-wide btn-xl" data-activate>${cta}</button>${state.premium ? '' : `<button class="link-btn center-fine plan-later" data-plan-later>${L('Explorer l’app d’abord')}</button>`}</div>
    </div>
  </div>`;
}

const PROGRAM_FEATURES = [
  'Plan alimentaire sur mesure et {r} recettes du monde',
  'Menus de 7 jours ajustés à vos calories et à vos protéines',
  'Coach sportif personnel et programme Ménopause 40+',
  'Scanner, coach 24 h/24, sommeil et vitamines',
  'Liste de courses générée automatiquement',
];

// ---- Billing ---------------------------------------------------------------
// Store builds (App Store / Google Play): the native shell exposes
// window.NutriPilotNative (RevenueCat) and handles the free trial.
// Web: subscriptions are taken in the iPhone / Android app (App Store / Google Play).
// ---- v13: modules --------------------------------------------------------------
// Each area of NutriPilot is a separate module with its own space, colour and subscription
// (3-day free trial in the iPhone and Android apps). The Complete kit unlocks every module.
// Today, Progress, Profile and Settings are free for everyone.
// v10 — every space sells an outcome, not a category: a strong title, a promise and concrete proof.
// {r} recipes · {c} cuisines · {e} exercises · {p} programmes are counted live from the app's content.
const MODULES = [
  { id: 'nutrition', name: 'Nutrition', title: 'Plan alimentaire sur mesure', short: 'Plan repas', sub: 'Votre plan repas complet, calculé pour votre corps et votre objectif.', icon: 'fork', route: 'program', tone: 'm-nut',
    features: ['Menus de 7 jours ajustés à vos calories et à vos protéines', 'Perte de poids, prise de muscle ou ménopause : le plan suit votre objectif', 'Cuisine de votre pays, allergies et goûts respectés', 'Liste de courses générée automatiquement'] },
  { id: 'recipes', name: 'Recettes', title: 'Recettes du monde entier', short: 'Recettes', sub: '{r} recettes de {c} cuisines, au gramme près.', icon: 'book', route: 'recipes', tone: 'm-rec',
    features: ['Française, brésilienne, japonaise, indienne, mexicaine… et bien plus', 'Portions recalculées pour votre objectif', 'Des variantes pour chaque situation : régimes, objectifs et goûts, personnalisées pour vous'] },
  { id: 'scanner', name: 'Scanner', title: 'Scanner de repas', short: 'Scanner', sub: 'Une photo, et votre repas est analysé.', icon: 'scan', route: 'scanner', tone: 'm-scan', free: true,
    features: ['Calories et macros en quelques secondes', 'Code-barres, étiquettes et allergènes', 'Portions corrigées en un geste'] },
  { id: 'training', name: 'Entraînement', title: 'Coach sportif personnel', short: 'Entraînement', sub: 'Un programme d’entraînement construit pour vous.', icon: 'dumbbell', route: 'training', tone: 'm-train',
    features: ['{e} exercices animés, en salle ou à la maison', '{p} programmes, du débutant au confirmé', 'Charges, repos et records suivis automatiquement'] },
  { id: 'menopause', name: 'Ménopause 40+', title: 'Programme Ménopause 40+', short: 'Ménopause 40+', sub: 'Le programme complet pour vivre la (pré)ménopause sereinement.', icon: 'flower', route: 'menopause', tone: 'm-meno',
    features: ['Programme guidé de 8 semaines', 'Alimentation, force, os et sommeil adaptés', 'Journal des symptômes et rapport pour votre médecin'] },
  { id: 'nutrients', name: 'Vitamines & nutriments', title: 'Vitamines & minéraux', short: 'Vitamines', sub: 'Sachez ce qui manque dans votre assiette.', icon: 'leaf', route: 'nutrients', tone: 'm-vit',
    features: ['Lacunes possibles repérées dans votre journal', 'Les aliments les plus riches pour chaque nutriment', 'Repères clairs et précautions'] },
  { id: 'supplements', name: 'Compléments', title: 'Compléments sous contrôle', short: 'Compléments', sub: 'Vos compléments, sans doublon ni excès.', icon: 'pill', route: 'supplements', tone: 'm-sup', free: true,
    features: ['Scanner d’étiquette de complément', 'Alerte en cas d’ingrédient en double', 'Niveau de preuve et précautions'] },
  { id: 'sleep', name: 'Sommeil & stress', title: 'Sommeil & anti-stress', short: 'Sommeil', sub: 'Mieux dormir et reprendre le contrôle des envies.', icon: 'moon', route: 'sleep', tone: 'm-sleep',
    features: ['Respirations guidées à voix haute', 'Journal du sommeil et des envies de manger', 'Bouton SOS fringales'] },
  { id: 'coach', name: 'Coach', title: 'Coach 24 h/24', short: 'Coach', sub: 'Une réponse adaptée à votre journée, à toute heure.', icon: 'coach', route: 'coach', tone: 'm-coach', free: true,
    features: ['Nutrition, entraînement et recettes', 'Explique chaque conseil', 'Limites claires sur les questions médicales'] },
];
// Live numbers used in the copy above.
function MV() {
  return { n: CUISINES.length, c: CUISINES.length, r: ALL_RECIPES.length, e: Object.keys(EXERCISES).length, p: allPrograms().filter((x) => !x.custom).length };
}
const modTitle = (m) => L(m.title || m.name);
// Local, language-neutral artwork: no external image requests or layout shifts.
function moduleArtwork(m) {
  if (!MODULES.some((item) => item.id === m.id)) return '';
  return `<div class="module-art" aria-hidden="true"><img src="/artwork/${m.id}.svg" width="480" height="240" alt="" loading="lazy" decoding="async"></div>`;
}
const MODULE_ROUTES = {
  program: 'nutrition', diary: 'nutrition', targets: 'nutrition', shopping: 'nutrition', planner: 'nutrition', guides: 'nutrition', insights: 'nutrition',
  recipes: 'recipes', scanner: 'scanner', training: 'training', menopause: 'menopause',
  nutrients: 'nutrients', supplements: 'supplements', sleep: 'sleep', coach: 'coach',
};
const moduleById = (id) => MODULES.find((m) => m.id === id);
const moduleForRoute = (r = route) => moduleById(MODULE_ROUTES[r]);

// ---- Store billing inside the iPhone / Android app (Capacitor + RevenueCat) ----------------
// The web app is loaded in the native shell; when RevenueCat is present, purchases go through
// Apple / Google and the server confirms them (/api/iap/verify) before unlocking anything.
const NativeBilling = {
  started: false,
  pending: null,
  products: {},
  plugin() {
    const cap = window.Capacitor;
    if (!cap?.isNativePlatform?.()) return null;
    return cap.Plugins?.Purchases || (cap.registerPlugin ? cap.registerPlugin('Purchases') : null);
  },
  platform() { return window.Capacitor?.getPlatform?.() || ''; },
  async appUserIdFor(email) {
    const data = new TextEncoder().encode(`nutripilot:${email.toLowerCase()}`);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return 'np-' + [...new Uint8Array(hash)].slice(0, 16).map((b) => b.toString(16).padStart(2, '0')).join('');
  },
  token() { return state.accessToken || state.accountToken || ''; },
  // Free-trial length as configured in App Store Connect / Play Console (introductory offer at 0).
  introDays(intro) {
    if (!intro || Number(intro.price) !== 0) return 0;
    const unit = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365 };
    return Number(intro.periodNumberOfUnits || intro.cycles || 1) * (unit[String(intro.periodUnit || '').toUpperCase()] || 1);
  },
  trialDays() {
    const days = Object.values(this.products).map((p) => this.introDays(p.intro)).filter(Boolean);
    return days.length ? Math.max(...days) : 0;
  },
  email() { const e = state.premiumEmail || state.accountEmail || ''; return e.includes('@') ? e : ''; },
  async start() {
    if (this.started) return;
    const P = this.plugin();
    const key = this.platform() === 'ios' ? config.revenuecat?.ios : config.revenuecat?.android;
    if (!P || !key) return;
    this.started = true;
    try {
      await P.configure({ apiKey: key });
      if (this.email() && this.token()) await P.logIn({ appUserID: await this.appUserIdFor(this.email()) });
      // Revalidate purchases only for a previously verified NutriPilot account.
      if (this.email() && this.token()) this.silentCheck();
      P.addCustomerInfoUpdateListener?.(() => { if (this.email() && this.token()) this.silentCheck(); });
      const ids = [...new Set(storeCatalog().map((x) => x.id))];
      const res = await P.getProducts({ productIdentifiers: ids, type: 'SUBSCRIPTION' }).catch(() => P.getProducts({ productIdentifiers: ids }));
      const list = res?.products || [];
      for (const prod of list) {
        const base = String(prod.identifier || '').split(':')[0];
        this.products[base] = { price: Number(prod.price), priceString: prod.priceString, currency: prod.currencyCode, raw: prod, intro: prod.introPrice || null };
      }
      window.NutriPilotNative = Object.assign(window.NutriPilotNative || {}, {
        store: this.platform() === 'ios' ? 'App Store' : 'Google Play',
        currency: list[0]?.currencyCode || '',
        products: this.products,
        purchase: (storeId, intent) => this.purchase(storeId, intent),
        restore: () => this.restore(),
        trialDays: this.trialDays(),
      });
      render();
    } catch (error) { console.error('billing start', error); this.started = false; }
  },
  async silentCheck() {
    try {
      const data = await this.verify();
      if (data?.premium && data.token) {
        Object.assign(state, { premium: true, accessToken: data.token, subscriptionPlan: data.plan || state.subscriptionPlan, premiumEmail: data.email || state.premiumEmail });
        await pullRemoteState();
        saveState(false);
        nav(state.onboarding ? 'app' : 'onboarding');
      } else if (data?.premium === false) {
        Object.assign(state, {premium:false,accessToken:'',subscriptionPlan:''});
        saveState(false); render();
      }
    } catch { /* Offline validation does not erase account data. */ }
  },
  // Verify the account before linking a store purchase; public customer IDs are not authentication.
  needAccount(intent) {
    if (this.token() && this.email()) return false;
    this.pending = intent || null;
    modal = { type: 'account', step: 'email', email: state.accountEmail || '' };
    renderModal();
    return true;
  },
  async verify() {
    const P = this.plugin();
    const { appUserID } = await P.getAppUserID();
    const headers = { 'Content-Type': 'application/json' };
    if (this.token()) headers.Authorization = `Bearer ${this.token()}`;
    const response = await fetch('/api/iap/verify', { method: 'POST', headers, body: JSON.stringify({ appUserId: appUserID }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Vérification de l’achat impossible pour le moment. Réessayez.');
    return data;
  },
  async purchase(storeId, intent) {
    if (this.needAccount(intent)) return null;
    const P = this.plugin();
    const product = this.products[storeId]?.raw;
    if (!product) throw new Error(L('Cette formule n’est pas encore disponible dans la boutique.'));
    if (this.email()) await P.logIn({ appUserID: await this.appUserIdFor(this.email()) });
    try {
      await P.purchaseStoreProduct({ product });
    } catch (error) {
      if (error?.userCancelled || /cancel/i.test(String(error?.code || error?.message || ''))) return null;
      throw error;
    }
    let data = await this.verify();
    // The store can take a few seconds to report a new purchase: try again before giving up.
    for (let i = 0; i < 3 && !data.premium; i++) { await new Promise((r) => setTimeout(r, 2000)); data = await this.verify(); }
    if (!data.premium) { toast(L('Paiement reçu, confirmation en cours. Touchez « Restaurer mes achats » dans un instant.')); return null; }
    return { token: data.token, email: data.email, plan: data.plan };
  },
  async restore() {
    if (this.needAccount({action:'restore'})) return null;
    const P = this.plugin();
    if (this.email()) await P.logIn({ appUserID: await this.appUserIdFor(this.email()) });
    await P.restorePurchases();
    const data = await this.verify();
    return data.premium ? { token: data.token, email: data.email, plan: data.plan } : null;
  },
};
// ---- Native kit (iPhone / Android app): haptics, local notifications, files -------------------
const capPlugin = (name) => (window.Capacitor?.isNativePlatform?.() ? window.Capacitor.Plugins?.[name] || null : null);
function haptic(kind = 'light') {
  const H = capPlugin('Haptics');
  try {
    if (H) {
      if (kind === 'success' || kind === 'warning') return H.notification({ type: kind.toUpperCase() }).catch(() => {});
      return H.impact({ style: kind === 'heavy' ? 'HEAVY' : kind === 'medium' ? 'MEDIUM' : 'LIGHT' }).catch(() => {});
    }
    navigator.vibrate?.(kind === 'success' ? [30, 40, 30] : kind === 'heavy' ? 60 : 20);
  } catch { /* optional */ }
}
const NOTIF_BASE = 7000;
async function scheduleNativeReminders(r) {
  const N = capPlugin('LocalNotifications');
  if (!N) return false;
  const pending = await N.getPending().catch(() => ({ notifications: [] }));
  const ours = (pending.notifications || []).filter((n) => n.id >= NOTIF_BASE && n.id < NOTIF_BASE + 1000).map((n) => ({ id: n.id }));
  if (ours.length) await N.cancel({ notifications: ours }).catch(() => {});
  if (!Object.values(r).some((x) => x.on)) return true;
  let perm = await N.checkPermissions().catch(() => ({ display: 'prompt' }));
  if (perm.display !== 'granted') perm = await N.requestPermissions().catch(() => ({ display: 'denied' }));
  if (perm.display !== 'granted') { toast(L('Les notifications sont bloquées dans les réglages de votre appareil. Autorisez-les pour recevoir les rappels.')); return true; }
  const list = [];
  let id = NOTIF_BASE;
  const at = (hm) => { const [h, m] = String(hm || '08:00').split(':').map(Number); return { hour: h || 0, minute: m || 0 }; };
  const add = (body, on, when) => list.push({ id: id++, title: 'NutriPilot', body, schedule: when ? { at: when, allowWhileIdle: false } : { on, allowWhileIdle: false } });
  if (r.water.on) for (let t = r.water.from * 60; t < r.water.to * 60 && list.length < 20; t += Number(r.water.every || 120)) add(L('Un verre d’eau ? Pensez à vous hydrater.'), { hour: Math.floor(t / 60), minute: t % 60 });
  // Meals and workouts: one notification per day for the next 7 days, so a change made for today
  // (late, eating out, training moved) moves today's reminder only. Rescheduled at each app start.
  const nowTs = Date.now();
  for (let d = 0; d < 7; d += 1) {
    const day = addDays(d);
    const dayAt = (hm) => { const [h, m] = String(hm).split(':').map(Number); const x = new Date(`${day}T12:00:00`); x.setHours(h || 0, m || 0, 0, 0); return x; };
    if (r.meals.on) {
      const plan = (state.weekPlan || []).find((x) => x.date === day);
      const items = plan?.meals?.length ? plan.meals.map((m, i) => [m.type, cpTimes(day)[i], state.dayTimes?.[day]?.status?.[i]]) : r.meals.times.map((tm, i) => [['Petit-déjeuner', 'Déjeuner', 'Dîner'][i], tm, '']);
      items.forEach(([type, tm, st]) => { const when = dayAt(tm); if (st !== 'skipped' && when.getTime() > nowTs + 60_000) add(L('C’est l’heure de votre {meal}. Scannez-le en une photo.', { meal: L(type).toLowerCase() }), undefined, when); });
    }
    if (r.workout.on && trainingDays().map(Number).includes(new Date(`${day}T12:00:00`).getDay())) { const when = dayAt(cpWorkoutTime(day)); if (when.getTime() > nowTs + 60_000) add(L('C’est jour d’entraînement. Votre séance vous attend.'), undefined, when); }
  }
  if (r.weigh.on) add(L('C’est le jour de la pesée. Notez votre poids pour suivre la tendance.'), { weekday: Number(r.weigh.day) + 1, ...at(r.weigh.time) });
  await N.schedule({ notifications: list });
  return true;
}
// Saves a file the person exported: share sheet in the app (Files, Mail, WhatsApp…), download on the web.
async function saveFile(content, name, type) {
  const FS = capPlugin('Filesystem'); const SH = capPlugin('Share');
  if (FS && SH) {
    try {
      const w = await FS.writeFile({ path: name, data: content, directory: 'CACHE', encoding: 'utf8' });
      await SH.share({ title: name, files: [w.uri] });
      return;
    } catch (error) { if (/cancel/i.test(String(error?.message || ''))) return; }
  }
  const file = new File([content], name, { type });
  if (window.Capacitor?.isNativePlatform?.() && navigator.canShare?.({ files: [file] })) { try { await navigator.share({ files: [file], title: name }); return; } catch { return; } }
  const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 30_000);
}
function nativeKitStart() {
  const plat = nativePlatform();
  if (!plat) return;
  document.documentElement.classList.add(`cap-${plat}`);
  window.NutriPilotNative = Object.assign(window.NutriPilotNative || {}, { scheduleReminders: scheduleNativeReminders });
  // Space theme: light status bar text on the dark app (no new store build needed).
  try { capPlugin('StatusBar')?.setStyle?.({ style: 'DARK' }); capPlugin('StatusBar')?.setBackgroundColor?.({ color: '#04080A' }); } catch {}
  // Day-by-day reminders are planned 7 days ahead: refresh them at each start (no permission prompt here).
  setTimeout(async () => { try { const perm = await capPlugin('LocalNotifications')?.checkPermissions(); if (perm?.display === 'granted') cpRescheduleReminders(); } catch {} }, 3000);
  // Android hardware back: close the open sheet first, then go back, then leave the app from the home screen.
  capPlugin('App')?.addListener?.('backButton', ({ canGoBack }) => {
    if (overlayOpen()) return history.back();
    if (canGoBack && !ROOT_ROUTES.includes(route)) return history.back();
    if (route !== 'app') return nav('app');
    capPlugin('App').exitApp?.();
  });
  capPlugin('SplashScreen')?.hide?.().catch?.(() => {});
}
// Native store review ("Enjoying NutriPilot?"), only right after a win, at most every 4 months.
// Apple and Google decide whether the sheet really shows (max 3 times a year on iPhone).
function reviewMoment(force = '') {
  const R = capPlugin('InAppReview');
  if (!R || !state.premium) return;
  const last = Date.parse(state.reviewAskedAt || 0) || 0;
  if (Date.now() - last < 120 * 86400000) return;
  const t = totals(); const goal = Number(state.profile?.dailyKcal || 0);
  const mealsToday = state.meals.filter((m) => m.day === todayKey()).length;
  const win = force || (streak() >= 7 ? 'streak7' : mealsToday >= 3 && goal && Math.abs(t.kcal - goal) <= goal * 0.1 ? 'dayOnTarget' : '');
  if (!win) return;
  state.reviewAskedAt = new Date().toISOString(); saveState(false);
  track('ReviewAsked', { moment: win });
  setTimeout(() => R.requestReview?.().catch?.(() => {}), 1200);
}
// In the store app, legal / support pages open in a sheet inside the app (no dead "new tab" links).
document.addEventListener('click', (event) => {
  const a = event.target.closest?.('a[href^="/privacy"], a[href^="/terms"], a[href^="/support"], a[href^="/delete-account"]');
  if (!a || !window.Capacitor?.isNativePlatform?.()) return;
  event.preventDefault();
  modal = { type: 'page', src: a.getAttribute('href') };
  renderModal();
}, true);
document.addEventListener('change', async (event) => {
  const t = event.target;
  if (t?.matches?.('[data-cp-patterns-toggle]')) { state.cpPatternsOff = !t.checked; saveState(); return; }
  if (!t?.matches?.('[data-ai-toggle]')) return;
  if (t.checked) { state.aiConsent = null; t.checked = await askAiConsent(); }
  else { state.aiConsent = false; state.aiConsentAt = new Date().toISOString(); saveState(false); toast(L('Analyse personnalisée désactivée.')); }
});
function pageSheet() {
  return `<div class="sheet-head"><span></span><button class="icon-btn" data-close aria-label="${L('Fermer')}">${icon('close')}</button></div>
    <iframe class="page-frame" src="${esc(modal.src)}" title="${esc(modal.src.split('?')[0].slice(1))}"></iframe>`;
}
// Store subscription settings, opened from Settings › Manage my subscription.
function manageSubscriptionUrl() {
  const store = window.NutriPilotNative?.store || (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent) ? 'App Store' : 'Google Play');
  return store === 'App Store' ? 'https://apps.apple.com/account/subscriptions' : 'https://play.google.com/store/account/subscriptions';
}
// Account sheet: confirm an e-mail with a 6-digit code before buying in the app.
function accountSheet() {
  const step = modal.step || 'email';
  return `<div class="sheet-head"><h2>${L('Votre compte NutriPilot')}</h2><button class="icon-btn" data-close aria-label="${L('Fermer')}">${icon('close')}</button></div>
    <p class="screen-sub">${L('Votre abonnement sera lié à cet e-mail : vous retrouvez votre plan et votre historique sur n’importe quel téléphone.')}</p>
    <div class="field"><label for="acc-email">${L('E-mail')}</label><input id="acc-email" type="email" autocomplete="email" inputmode="email" value="${esc(modal.email || '')}" ${step === 'code' ? 'readonly' : ''}></div>
    ${step === 'code' ? `<div class="field"><label for="acc-code">${L('Code à 6 chiffres')}</label><input id="acc-code" class="code-input" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="000000"></div>
      <button class="btn btn-lime btn-wide" data-acc-verify>${L('Confirmer et continuer')}</button>
      <button class="link-btn center-fine" data-acc-back>${L('Changer d’e-mail')}</button>`
    : `<button class="btn btn-primary btn-wide" data-acc-send>${L('Recevoir mon code')}</button>`}
    ${modal.msg ? `<div class="warn ${modal.ok ? 'success' : ''}">${esc(modal.msg)}</div>` : ''}
    <p class="fine center-fine">${L('En continuant, vous acceptez les <a href="{terms}" target="_blank" rel="noopener">conditions d’utilisation</a> et la <a href="{privacy}" target="_blank" rel="noopener">politique de confidentialité</a>.', { terms: `/terms?lang=${lang()}`, privacy: `/privacy?lang=${lang()}` })}</p>`;
}
async function accountSend() {
  const email = ($('#acc-email')?.value || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { modal.msg = L('Saisissez un e-mail valide.'); modal.ok = false; return renderModal(); }
  modal.email = email; modal.msg = L('Envoi…'); renderModal();
  try {
    const response = await fetch('/api/access/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, purpose: 'signup', lang: lang() }) });
    const data = await response.json();
    if (!response.ok) throw new Error(L(data.error || ''));
    modal.step = 'code'; modal.ok = true;
    modal.msg = data.devCode ? `${L('Code envoyé.')} (${data.devCode})` : L('Code envoyé. Consultez votre boîte e-mail et vos spams.');
  } catch (error) { modal.ok = false; modal.msg = error.message || L('Réessayez dans un instant.'); }
  renderModal();
}
async function accountVerify() {
  const code = ($('#acc-code')?.value || '').trim();
  if (!/^\d{6}$/.test(code)) { modal.msg = L('Saisissez le code à 6 chiffres.'); modal.ok = false; return renderModal(); }
  try {
    const response = await fetch('/api/access/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: modal.email, code }) });
    const data = await response.json();
    if (!response.ok) throw new Error(L(data.error || ''));
    state.accountEmail = modal.email;
    state.accountToken = data.token;
    if (!data.premium) { state.premium = false; state.accessToken = ''; state.premiumEmail = modal.email; }
    if (data.premium) { state.premium = true; state.accessToken = data.token; state.premiumEmail = modal.email; state.subscriptionPlan = data.plan || state.subscriptionPlan; }
    saveState(false);
    modal = null; document.querySelector('.modal-wrap')?.remove();
    track('Lead', { source: 'account' });
    if (data.premium) { toast(L('Accès Premium activé ✓')); return nav(state.onboarding ? 'app' : 'onboarding'); }
    if (afterSignIn === 'trial') { afterSignIn = ''; return beginTrial(); }
    const intent = NativeBilling.pending; NativeBilling.pending = null;
    if (intent?.action === 'restore') return Billing.restore().catch(e => toast(e?.message || L('Réessayez dans un instant.')));
    if (intent) { const plan = findPlan(intent.tier); if (plan) return Billing.purchase(plan, intent.period).catch((e) => toast(e?.message || L('Paiement interrompu.'))); }
    render();
  } catch (error) { modal.msg = error.message; modal.ok = false; renderModal(); }
}

// ---- Pricing -------------------------------------------------------------------
// Prices are set in US dollars and converted exactly (day's rate) to the buyer's currency.
// Rules (checked for every currency by the QA script):
// - every plan on sale except the kit costs at most half of the kit, so any two plans together never cost more than the kit;
// - a combination = its modules' sum − 15 %, rounded down to ,90; the kit saves 21 %, so no way of buying the
//   modules in parts is ever cheaper than the kit;
// - adding a module always costs more; when a combination would reach the kit, the kit is offered instead.
// Annual = exactly 10 × monthly (2 months free), in every currency.
const r2 = (v) => Math.round(v * 100) / 100;
const MONTHLY_PRICE = { nutrition: 7.99, recipes: 3.99, training: 9.99, menopause: 8.99, nutrients: 2.99, sleep: 3.99 };
const KIT_MONTHLY = 29.9;
const COMBO_OFF = { 2: 0.15, 3: 0.15, 4: 0.15, 5: 0.15 };
const annualOf = (monthly) => r2(monthly * 10);
const PAID_MODULES = MODULES.filter((m) => !m.free);
const FREE_MODULES = MODULES.filter((m) => m.free);
const PAID_IDS = PAID_MODULES.map((m) => m.id);
// Short codes keep combination product ids short in the stores: np_mix_rt_monthly = Training + Recipes.
const MOD_CODE = { nutrition: 'n', recipes: 'r', training: 't', menopause: 'm', nutrients: 'v', sleep: 's' };
const CODE_MOD = Object.fromEntries(Object.entries(MOD_CODE).map(([k, v]) => [v, k]));
const sortMods = (mods) => PAID_IDS.filter((id) => mods.includes(id));
const comboMemo = new Map();
function comboMonthly(mods) {
  const list = sortMods(mods);
  const key = list.join();
  if (comboMemo.has(key)) return comboMemo.get(key);
  let price;
  if (list.length === 1) price = MONTHLY_PRICE[list[0]];
  else if (list.length >= PAID_IDS.length) price = KIT_MONTHLY;
  else {
    const sum = list.reduce((t, id) => t + MONTHLY_PRICE[id], 0);
    price = r2(Math.floor(sum * (1 - (COMBO_OFF[list.length] || 0.15)) - 0.9) + 0.9);
    // Always more than any smaller selection inside it.
    const floor = Math.max(...list.map((id) => comboMonthly(list.filter((x) => x !== id))));
    if (price <= floor) { const up = Math.floor(floor) + 0.9; price = r2(up > floor + 1e-9 ? up : up + 1); }
    if (price >= KIT_MONTHLY - 1) price = KIT_MONTHLY;
  }
  comboMemo.set(key, price);
  return price;
}
const MODULE_PRICES = Object.fromEntries([...PAID_IDS.map((id) => [id, [MONTHLY_PRICE[id], annualOf(MONTHLY_PRICE[id])]]), ['complete', [KIT_MONTHLY, annualOf(KIT_MONTHLY)]]]);
// Themed combinations, priced with the same rule as any combination the person composes.
const BUNDLES = [
  { id: 'body', name: 'Corps en forme', sub: 'Entraînement + Nutrition', tagline: 'Perdre du gras et prendre du muscle, repas et séances accordés.', icon: 'dumbbell', tone: 'm-train', modules: ['training', 'nutrition'], badge: 'Le plus choisi' },
  { id: 'women40', name: 'Femme 40+', sub: 'Ménopause + Nutrition', tagline: 'La (pré)ménopause et une alimentation adaptée après 40 ans.', icon: 'flower', tone: 'm-meno', modules: ['menopause', 'nutrition'], badge: 'Spécial 40+' },
  { id: 'kitchen', name: 'Cuisine saine', sub: 'Nutrition + Recettes', tagline: 'Bien manger chaque jour, sans y passer des heures.', icon: 'fork', tone: 'm-rec', modules: ['nutrition', 'recipes'] },
  { id: 'performance', name: 'Performance', sub: 'Entraînement + Vitamines', tagline: 'S’entraîner fort et suivre vos vitamines et minéraux pour bien récupérer.', icon: 'heart', tone: 'm-sup', modules: ['training', 'nutrients'] },
  { id: 'wellness', name: 'Bien-être', sub: 'Sommeil + Vitamines', tagline: 'Mieux dormir, moins de stress, compléments sous contrôle.', icon: 'moon', tone: 'm-sleep', modules: ['sleep', 'nutrients'] },
].map((b) => ({ ...b, price: [comboMonthly(b.modules), annualOf(comboMonthly(b.modules))] }));
const bundleById = (id) => BUNDLES.find((b) => b.id === id);
const DEFAULT_PLANS = [
  { tier: 'complete', kind: 'complete', label: 'Kit complet', sub: 'Tous les modules NutriPilot', tagline: 'Tout NutriPilot, sans limite.', icon: 'star', tone: 'm-kit', badge: 'Meilleure offre', modules: MODULES.map((m) => m.id),
    features: ['Les 9 espaces NutriPilot, sans limite', 'Plan alimentaire sur mesure et {r} recettes du monde', 'Coach sportif personnel et programme Ménopause 40+', 'Scanner, coach 24 h/24, sommeil et vitamines'],
    monthly: { price: MODULE_PRICES.complete[0], storeId: 'np_complete_monthly' }, annual: { price: MODULE_PRICES.complete[1], storeId: 'np_complete_annual' } },
  ...BUNDLES.map((b) => ({ tier: b.id, kind: 'bundle', label: b.name, sub: b.sub, tagline: b.tagline, icon: b.icon, tone: b.tone, badge: b.badge, modules: b.modules,
    features: [...b.modules.map((id) => moduleById(id).title), 'Scanner, Compléments et Coach offerts'],
    monthly: { price: b.price[0], storeId: `np_${b.id}_monthly` }, annual: { price: b.price[1], storeId: `np_${b.id}_annual` } })),
  ...PAID_MODULES.map((m) => ({ tier: m.id, kind: 'module', label: m.name, sub: m.sub, tagline: m.sub, icon: m.icon, tone: m.tone, modules: [m.id], features: [...m.features.slice(0, 3), 'Scanner, Compléments et Coach offerts'],
    monthly: { price: MODULE_PRICES[m.id][0], storeId: `np_${m.id}_monthly` }, annual: { price: MODULE_PRICES[m.id][1], storeId: `np_${m.id}_annual` } })),
];
// Price of buying these modules one by one, for the same billing period.
function separatePrice(modules, period) {
  const i = period === 'annual' ? 1 : 0;
  return r2(modules.reduce((sum, id) => sum + (MODULE_PRICES[id]?.[i] || 0), 0));
}
// What the same access would cost without any discount: modules bought one by one, paid monthly.
// In the buyer's currency: modules bought one by one, paid monthly.
function refPrice(plan, period, cur = currency()) {
  if (!plan) return 0;
  const mods = plan.kind === 'module' ? [plan] : sortMods(plan.modules || []).map((id) => DEFAULT_PLANS.find((p) => p.tier === id));
  const monthly = mods.reduce((t, m) => t + lp(m, 'monthly', cur), 0);
  return r2(period === 'annual' ? monthly * 12 : monthly);
}
function saveAmount(plan, period, cur = currency()) { if (!plan) return 0; return Math.max(0, r2(refPrice(plan, period, cur) - lp(plan, period, cur))); }
function planSaving(plan, period) {
  if (!plan) return 0;
  const ref = refPrice(plan, period);
  return ref ? Math.max(0, Math.round((1 - lp(plan, period) / ref) * 100)) : 0;
}
// "Compose my plan": any set of modules becomes one subscription at the combination price.
function customPlan(parts) {
  const mods = sortMods(parts.flatMap((t) => (MOD_CODE[t] ? [t] : bundleById(t)?.modules || (t === 'complete' ? PAID_IDS : []))));
  if (!mods.length) return null;
  const plans = DEFAULT_PLANS;
  if (mods.length === 1) return plans.find((p) => p.tier === mods[0]);
  if (mods.length === PAID_IDS.length || comboMonthly(mods) >= KIT_MONTHLY) return plans.find((p) => p.tier === 'complete');
  const same = plans.find((p) => p.kind === 'bundle' && sortMods(p.modules).join() === mods.join());
  if (same) return same;
  const code = mods.map((id) => MOD_CODE[id]).join('');
  const m = comboMonthly(mods);
  return { tier: 'mix_' + code, kind: 'custom', parts: mods, label: '', sub: 'Ma sélection', icon: 'grid', tone: 'm-kit', modules: mods, features: [...mods.map((id) => moduleById(id).title), 'Scanner, Compléments et Coach offerts'],
    monthly: { price: m, storeId: `np_mix_${code}_monthly` }, annual: { price: annualOf(m), storeId: `np_mix_${code}_annual` } };
}
const modsFromMix = (tier) => String(tier).replace(/^mix_/, '').split('').map((c) => CODE_MOD[c]).filter(Boolean);
// The plan for exactly the chosen modules (a module, a themed combination, a composed one or the kit).
// In the store app, only plans created in App Store Connect / Play Console can be sold: when the exact
// selection has no product, offer the cheapest available plan that contains every chosen module.
const sellable = (plan) => !nativePlatform() || (Billing.native() && Number.isFinite(window.NutriPilotNative?.products?.[plan?.monthly?.storeId]?.price));
function bestOffer(modules) {
  if (!modules.length) return null;
  const exact = customPlan(modules);
  if (sellable(exact)) return exact;
  const covering = DEFAULT_PLANS.filter((p) => modules.every((id) => p.modules.includes(id)) && sellable(p));
  return covering.sort((a, b) => a.monthly.price - b.monthly.price)[0] || exact;
}
// Every product to create in App Store Connect / Google Play Console.
function storeCatalog() {
  const out = [];
  for (let mask = 1; mask < 1 << PAID_IDS.length; mask++) {
    const mods = PAID_IDS.filter((_, i) => mask & (1 << i));
    const p = customPlan(mods);
    if (!out.some((x) => x.tier === p.tier)) out.push(p);
  }
  return out.flatMap((p) => ['monthly', 'annual'].map((k) => ({ id: p[k].storeId, name: planName(p), modules: sortMods(p.modules).length, period: k, price: p[k].price,
    local: Object.fromEntries(['BRL', 'EUR', 'GBP', 'MXN', 'JPY'].map((c) => [c, lp(p, k, c)])) })));
}
function recommendedTier() {
  const track = state.profile?.track;
  return track === 'menopause' ? 'women40' : track === 'muscle' ? 'body' : track === 'eat' ? 'kitchen' : track === 'lose' ? 'body' : 'complete';
}
function findPlan(tier) {
  if (String(tier).startsWith('custom:')) return customPlan(String(tier).slice(7).split('+'));
  if (/^mix_[a-z]+$/.test(String(tier))) return customPlan(modsFromMix(tier));
  return Billing.plans().find((x) => x.tier === tier);
}
let selectedTier = '';
let selectedPeriod = 'annual';

// Owned modules come from the subscription ids, e.g. "training_monthly,recipes_annual".
// Legacy single plans keep what they used to include; unknown ids (older customers) keep full access.
const LEGACY_PLAN_MODULES = { nutrition: ['nutrition', 'recipes', 'scanner'], training: ['training', 'scanner'], menopause: ['menopause', 'nutrition', 'recipes', 'scanner'] };
function ownedModules() {
  if (!state.premium) return trialActive() ? MODULES.map((m) => m.id) : [];
  const ids = String(state.subscriptionPlan || '').split(',').map((x) => x.trim()).filter(Boolean);
  const all = MODULES.map((m) => m.id);
  if (!ids.length) return all;
  const set = new Set();
  for (const id of ids) {
    const tier = id.replace(/_(monthly|annual|yearly|trial)$/, '');
    if (bundleById(tier)) { bundleById(tier).modules.forEach((x) => set.add(x)); continue; }
    if (/^mix_[a-z]+$/.test(tier)) { modsFromMix(tier).forEach((x) => set.add(x)); continue; }
    if (tier === 'complete' || !(moduleById(tier) || LEGACY_PLAN_MODULES[tier])) { all.forEach((x) => set.add(x)); continue; }
    const legacy = !/(recipes|scanner|nutrients|supplements|sleep|coach|body|women40|kitchen|performance|wellness|mix_)/.test(String(state.subscriptionPlan)) && LEGACY_PLAN_MODULES[tier];
    (legacy || [tier]).forEach((x) => set.add(x));
  }
  // Scanner, Supplements and the Coach come free with any paid plan.
  if (set.size) FREE_MODULES.forEach((m) => set.add(m.id));
  return [...set];
}
function planTier(planId = state.subscriptionPlan) {
  const owned = ownedModules();
  if (!state.premium || PAID_MODULES.every((m) => owned.includes(m.id))) return 'complete';
  const id = String(planId || '');
  const first = id.split(',')[0].replace(/_(monthly|annual|yearly|trial)$/, '');
  return moduleById(first) ? first : 'complete';
}
function hasModule(id) { return ownedModules().includes(id); }
function planLabel() {
  const owned = ownedModules();
  if (owned.length && PAID_MODULES.every((m) => owned.includes(m.id))) return L('Kit complet');
  return PAID_MODULES.filter((m) => owned.includes(m.id)).map((m) => L(m.name)).join(' + ') || L('Découverte');
}
// ---- No timed trial (v9+): the free trial is the store's own offer (App Store / Google Play) ----
function trialActive() { return false; }
function trialEnded() { return false; }
function fullAccess() { return Boolean(state.premium); }
// Anonymous id of this install (no personal data): counts the free analyses on the server.
function deviceId() {
  try { let id = localStorage.getItem('np_device'); if (!id) { id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`; localStorage.setItem('np_device', id); } return id; } catch { return `tmp-${Date.now().toString(16)}`; }
}
// v10 — visitors get a few free meal analyses (counted by the server) before the plans.
const freeScanLimit = () => Math.max(0, Number(config.freeScans ?? 0) || 0);
function freeScansLeft() { return state.premium ? Infinity : Math.max(0, freeScanLimit() - Number(state.freeScansUsed || 0)); }
const canScan = () => fullAccess() || freeScansLeft() > 0;
function freeScanBanner() {
  if (state.premium && config.ai !== false) return '';
  if (!freeScanLimit()) return `<div class="free-scan access-note"><span>${icon('lock')}</span><p><b>${L(state.premium ? 'Analyses momentanément en pause' : 'Analyses réservées aux abonnés')}</b><small>${L('Code-barres et saisie manuelle toujours disponibles.')}</small></p></div>`;
  const left = freeScansLeft();
  return `<div class="free-scan ${left ? '' : 'out'}"><span>${icon(left ? 'scan' : 'lock')}</span><p><b>${left ? L('{n} analyses gratuites restantes', { n: left }) : L('Analyses gratuites utilisées')}</b><small>${left ? L('Photographiez votre assiette : calories et macros en quelques secondes. Le code-barres est gratuit et illimité.') : L('Les analyses de votre formule sont soumises aux limites d’utilisation. Le code-barres et la saisie manuelle restent disponibles.')}</small></p>${left ? '' : `<button class="btn btn-lime" data-module-buy="${esc(recommendedTier())}">${L('Voir les formules')}</button>`}</div>`;
}
function freeScansOut() {
  track('FreeScansOut');
  selectedTier = recommendedTier();
  modal = null; document.querySelector('.modal-wrap')?.remove();
  toast(L('Vos analyses gratuites sont utilisées. Choisissez une formule pour continuer.'));
  return nav('plans');
}
function trialFound() { /* the guided timed tour is gone */ }
function trialClock() { document.getElementById('trial-bar')?.remove(); document.body.classList.remove('has-trial'); }
function syncTrial() { return Promise.resolve(null); }
// "Try for free" anywhere → the plans screen, where one tap opens the store sheet.
function beginTrial() {
  if (state.premium) return nav('app');
  modal = null; document.querySelector('.modal-wrap')?.remove();
  selectedTier = selectedTier || recommendedTier();
  return nav('plans');
}
function goTrialStep(go) {
  modal = null; document.querySelector('.modal-wrap')?.remove();
  return go === 'add' ? openAdd('photo') : nav(go);
}
let afterSignIn = '';
// Signed in with Apple, Google or the e-mail code.
function completeSignIn(data) {
  state.accountEmail = data.email || state.accountEmail;
  state.accountToken = data.token || state.accountToken;
  if (data.premium) { state.premium = true; state.accessToken = data.token; state.premiumEmail = data.email; state.subscriptionPlan = data.plan || state.subscriptionPlan; }
  saveState(false);
  track('TrialSignIn', { source: data.provider || 'email' });
  modal = null; document.querySelector('.modal-wrap')?.remove();
  if (data.premium) { toast(L('Accès Premium activé ✓')); return nav(state.onboarding ? 'app' : 'onboarding'); }
  const next = afterSignIn || (() => { try { return sessionStorage.getItem('np_after_signin') || ''; } catch { return ''; } })();
  afterSignIn = ''; try { sessionStorage.removeItem('np_after_signin'); } catch {}
  if (next === 'trial') return beginTrial();
  render();
}
// In the store app the subscription follows the Apple ID / Google account: "already a customer" = one-tap restore.
function loginLink(label = 'Déjà client ? Se connecter', cls = 'link-btn') {
  return Billing.native() ? `<button class="${cls}" data-restore>${L('Restaurer mes achats')}</button>` : `<button class="${cls}" data-go="access">${L(label)}</button>`;
}
const nativePlatform = () => (window.Capacitor?.isNativePlatform?.() ? window.Capacitor.getPlatform?.() : '');
function signInOptions() {
  const a = config.auth || {};
  const plat = nativePlatform();
  const apple = a.apple && (plat === 'ios' ? Boolean(window.Capacitor?.Plugins?.SignInWithApple) : !plat && a.appleWeb);
  // iPhone: Apple + e-mail · Android: Google + e-mail · web: both when configured.
  const google = a.google && (plat === 'android' ? Boolean(window.Capacitor?.Plugins?.GoogleAuth) : !plat && a.googleWeb);
  return { apple, google };
}
async function signInWith(provider) {
  const plat = nativePlatform();
  try {
    if (!plat) {
      try { sessionStorage.setItem('np_after_signin', afterSignIn || ''); } catch {}
      location.href = `/auth/${provider}/start`;
      return;
    }
    const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36);
    let idToken = '';
    if (provider === 'apple') {
      const r = await window.Capacitor.Plugins.SignInWithApple.authorize({ clientId: config.auth.appleClientId, redirectURI: `${location.origin}/auth/apple/callback`, scopes: 'email name', state: nonce, nonce });
      idToken = r?.response?.identityToken || '';
    } else {
      const G = window.Capacitor.Plugins.GoogleAuth;
      await G.initialize?.({ clientId: config.auth.googleClientId, scopes: ['profile', 'email'], grantOfflineAccess: false }).catch(() => {});
      const u = await G.signIn();
      idToken = u?.authentication?.idToken || u?.idToken || '';
    }
    if (!idToken) throw new Error(L('Connexion annulée.'));
    const res = await fetch(`/api/auth/${provider}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken, nonce }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(L(data.error || 'Connexion refusée. Réessayez.'));
    completeSignIn({ ...data, provider });
  } catch (error) {
    if (/cancel|1001|12501/i.test(String(error?.message || error?.code || ''))) return;
    toast(error.message || L('Connexion refusée. Réessayez.'));
  }
}
const APPLE_LOGO = '<svg viewBox="0 0 24 24" aria-hidden="true" class="ico"><path fill="currentColor" d="M16.37 12.6c-.02-2.16 1.77-3.2 1.85-3.25-1.01-1.47-2.58-1.67-3.13-1.7-1.33-.13-2.6.79-3.28.79-.68 0-1.72-.77-2.83-.75-1.45.02-2.8.85-3.55 2.15-1.52 2.63-.39 6.52 1.09 8.66.72 1.04 1.58 2.22 2.71 2.17 1.09-.04 1.5-.7 2.82-.7 1.31 0 1.69.7 2.83.68 1.17-.02 1.91-1.06 2.62-2.11.83-1.21 1.17-2.38 1.19-2.44-.03-.01-2.28-.88-2.32-3.48zM14.21 6.27c.6-.73 1.01-1.74.9-2.75-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.67-.92 2.66.97.08 1.96-.49 2.56-1.22z"/></svg>';
const GOOGLE_LOGO = '<svg viewBox="0 0 24 24" aria-hidden="true" class="ico"><path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.29h5.9a5.04 5.04 0 0 1-2.19 3.31v2.75h3.54c2.07-1.91 3.25-4.72 3.25-8.08z"/><path fill="#34A853" d="M12 23c2.96 0 5.45-.98 7.26-2.65l-3.54-2.75c-.98.66-2.24 1.05-3.72 1.05-2.86 0-5.28-1.93-6.15-4.53H2.2v2.84A10.99 10.99 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.85 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.45.35-2.12V7.04H2.2A11 11 0 0 0 1 12c0 1.78.43 3.46 1.2 4.96l3.65-2.84z"/><path fill="#EA4335" d="M12 5.38c1.61 0 3.06.55 4.2 1.64l3.14-3.14C17.45 2.09 14.96 1 12 1 7.7 1 3.99 3.47 2.2 7.04l3.65 2.84C6.72 7.3 9.14 5.38 12 5.38z"/></svg>';
function signInSheet() {
  const o = signInOptions();
  return `<div class="sheet-head"><div><span class="tag">${L('Votre compte NutriPilot')}</span><h2>${L('Se connecter')}</h2></div><button class="icon-btn" data-close aria-label="${L('Fermer')}">${icon('close')}</button></div>
    <p class="screen-sub">${L('Votre compte garde votre profil et votre progression. Aucun paiement maintenant.')}</p>
    <div class="signin-list">
      ${o.apple ? `<button class="signin-btn apple" data-signin="apple">${APPLE_LOGO}<span>${L('Continuer avec Apple')}</span></button>` : ''}
      ${o.google ? `<button class="signin-btn google" data-signin="google">${GOOGLE_LOGO}<span>${L('Continuer avec Google')}</span></button>` : ''}
      <button class="signin-btn email" data-signin="email">${icon('user')}<span>${L('Continuer avec mon e-mail')}</span></button>
    </div>
    <p class="fine center-fine">${L('En continuant, vous acceptez les <a href="{terms}" target="_blank" rel="noopener">conditions d’utilisation</a> et la <a href="{privacy}" target="_blank" rel="noopener">politique de confidentialité</a>.', { terms: `/terms?lang=${lang()}`, privacy: `/privacy?lang=${lang()}` })}</p>`;
}
// The box that explains the free minutes, used on the home screen, in the sheets and on locked apps.
function trialPitch(kind = 'card', tier = '') {
  return `<div class="trial-box ${kind}"><span class="trial-ico">${icon('star')}</span>
    <h3>${L('Cette partie est réservée aux abonnés')}</h3>
    <p>${L('Consultez les prix et les offres disponibles dans votre boutique avant de choisir votre formule.')}</p>
    <button class="btn btn-lime btn-wide" data-module-buy="${esc(tier || recommendedTier())}">${L('Voir les formules')}</button></div>`;
}
function trialSheet() {
  return `<div class="sheet-head"><div><span class="tag">${L('Formules')}</span><h2>${L('Cette partie est réservée aux abonnés')}</h2></div><button class="icon-btn" data-close aria-label="${L('Fermer')}">${icon('close')}</button></div>
    ${trialPitch('sheet')}`;
}
// Locked app: the real screen stays visible behind a blur, with the trial box on top.
function lockOverlay(m) {
  return `<div class="lock-overlay" role="dialog" aria-label="${esc(L(m.name))}"><div class="lock-card ${m.tone}"><span class="mod-ico">${icon(m.icon)}</span><b>${L(m.name)}</b>${trialPitch('overlay', m.id)}</div></div>`;
}

function hasFeature(feature) {
  if (!state.premium) return trialActive();
  if (feature === 'coach') return ownedModules().length > 0;
  return hasModule(feature);
}
// "Free with any plan" strip: Scanner, Supplements and Coach.
function freeBanner(compact = false) {
  return `<div class="free-banner ${compact ? 'compact' : ''}"><span class="fb-icons">${FREE_MODULES.map((m) => `<i class="${m.tone}">${icon(m.icon)}</i>`).join('')}</span><span><b>${L('Offerts avec toute formule')}</b><small>${FREE_MODULES.map((m) => L(m.name)).join(' · ')}</small></span></div>`;
}
function moduleStatus(id) {
  if (hasModule(id)) return 'owned';
  return state.premium ? 'add' : 'preview';
}
function moduleBadge(id) {
  const s = moduleStatus(id);
  if (s === 'owned') return `<span class="mod-badge owned">${icon('check')}${L('Activé')}</span>`;

  return `<span class="mod-badge">${L('Découvrir')}</span>`;
}
// Coloured strip at the top of every module page: identity, status and a clear next step.
function moduleBar(id) {
  const m = moduleById(id);
  if (!m) return '';
  const owned = hasModule(id);
  return `<div class="mod-bar ${m.tone}"><span class="mod-ico">${icon(m.icon)}</span><span class="mod-name"><b>${modTitle(m)}</b><small>${owned ? L('Module activé') : L('Aperçu du module')}</small></span>${owned ? `<button class="mod-all" data-go="modules">${L('Apps')}</button>` : m.free ? `<button class="mod-cta" data-go="plans">${L('Voir les formules')}</button>` : `<button class="mod-cta" data-module-buy="${m.id}">${L('Voir les formules')}</button>`}</div>`;
}
// ---- App complex: each module opens as its own app --------------------------------
// An owned module gets its own header identity and its own tab bar (3 main sections + "More"),
// so every screen shows one thing at a time. "Apps" goes back to the launcher.
const APP_SHELL = {
  nutrition: { route: 'program', get: () => route, set: (k) => nav(k), tabs: () => [['program', 'Plan 7 jours', 'calendar', 'Vos repas de la semaine, ajustés à vos calories'], ['diary', 'Journal', 'list', 'Ce que vous avez mangé, jour et semaine'], ['shopping', 'Courses', 'check', 'La liste générée depuis votre plan'], ['targets', 'Objectifs', 'scale', 'Calories, protéines, glucides et lipides'], ['planner', 'Hors maison', 'sparkle', '« Que manger ensuite ? », restaurant et voyages'], ['guides', 'Leçons', 'book', 'Cours courts de nutrition']] },
  recipes: { route: 'recipes', get: () => recipeView, set: (k) => { recipeView = k; }, tabs: () => [['explore', 'Explorer', 'search', 'Par objectif, région et ingrédient'], ['fav', 'Favoris', 'heart', 'Les recettes que vous avez gardées'], ['create', 'Créer avec mes ingrédients', 'sparkle', 'Des recettes avec ce que vous avez'], ['made', 'Déjà préparées', 'check', 'Les recettes ajoutées à votre journal']] },
  training: { route: 'training', get: () => trainTab, set: (k) => { trainTab = k; }, tabs: () => [hasTrainingPlan() ? ['mine', 'Ma semaine', 'calendar', 'Vos séances de la semaine'] : ['plan', 'Planifier', 'calendar', 'Vos jours, votre objectif, votre niveau'], ['programs', 'Programmes', 'list', 'Tous les programmes prêts à suivre'], ['library', 'Exercices', 'dumbbell', 'Plus de 100 mouvements animés'], ...(hasTrainingPlan() ? [['plan', 'Planifier', 'calendar', 'Changer vos jours et votre objectif']] : []), ['create', 'Créer', 'plus', 'Votre propre programme, exercice par exercice'], ['history', 'Historique', 'progress', 'Séances faites et charges'], ['lessons', 'Leçons', 'book', 'Technique, progression et récupération']] },
  menopause: { route: 'menopause', get: () => menoTab, set: (k) => { menoTab = k; }, tabs: () => [['today', 'Aujourd’hui', 'flower', 'Journal des symptômes du jour'], ['program', 'Programme', 'calendar', '8 semaines guidées'], ['workouts', 'Séances', 'dumbbell', 'Force, os et équilibre'], ['lessons', 'Cours', 'book', 'Comprendre chaque étape']] },
  nutrients: { route: 'nutrients', get: () => nutrientTab, set: (k) => { nutrientTab = k; }, tabs: () => [['guide', 'Guide', 'leaf', 'Rôle de chaque vitamine et minéral'], ['sources', 'Sources', 'fork', 'Les aliments les plus riches'], ['gaps', 'Mon journal', 'list', 'Ce qui manque peut-être dans vos repas']] },
  supplements: { route: 'supplements', get: () => suppTab, set: (k) => { suppTab = k; suppDraft = null; }, tabs: () => [['mine', 'Mes compléments', 'pill', 'Vos compléments et doses déclarées'], ['scan', 'Scanner', 'camera', 'Lire une étiquette de complément'], ['alerts', 'Alertes', 'bell', 'Ingrédients en double et précautions'], ['info', 'Fiches', 'book', 'Niveau de preuve et précautions']] },
  sleep: { route: 'sleep', get: () => sleepTab, set: (k) => { sleepTab = k; }, tabs: () => [['today', 'Aujourd’hui', 'moon', 'Votre nuit et votre journée'], ['sleep', 'Journal', 'list', 'Notez chaque nuit'], ['relax', 'Respirer', 'wave', 'Respirations et relaxations guidées'], ['sounds', 'Sons apaisants', 'drop', 'Pluie, vagues, feu…'], ['program', 'Programme 7 nuits', 'calendar', 'Une étape par nuit'], ['mind', 'Stress & pensées', 'book', 'Vider sa tête avant de dormir'], ['hunger', 'Faim ou envie ?', 'fork', 'Reconnaître une envie de manger'], ['routine', 'Rituel du soir', 'check', 'Les gestes qui aident à s’endormir'], ['learn', 'Leçons', 'book', 'Comprendre le sommeil'], ['restart', 'Reprendre la routine', 'sparkle', 'Après un écart, sans tout recommencer']] },
};
// The module shown as an app: modules the person owns, and every module for visitors (preview, with the unlock bar).
function appShellId(r = route) {
  const m = moduleForRoute(r);
  return m && APP_SHELL[m.id] && (!state.premium || hasModule(m.id)) ? m.id : '';
}
function openAppTab(id, key) {
  const shell = APP_SHELL[id];
  if (!shell) return;
  if (id === 'nutrition') return nav(key);
  shell.set(key);
  if (route !== shell.route) return nav(shell.route);
  render();
  window.scrollTo({ top: 0 });
}
function appTabBar(id) {
  const shell = APP_SHELL[id];
  const tabs = shell.tabs();
  const cur = shell.get();
  const main = tabs.slice(0, 3);
  const more = tabs.slice(3);
  const moreActive = more.some(([k]) => k === cur);
  const btn = (k, label, ico, extra = '') => `<button class="nav-btn ${extra} ${k === cur ? 'active' : ''}" data-app-tab="${id}:${k}" aria-current="${k === cur ? 'page' : 'false'}"><span>${icon(ico)}</span>${L(label)}</button>`;
  return `<nav class="bottom-nav app-nav ${moduleById(id).tone}" aria-label="${esc(L(moduleById(id).name))}">
    <span class="rail-brand" aria-hidden="true">${logo()}<small>${esc(L(moduleById(id).name))}</small></span>
    <button class="nav-btn apps-btn" data-go="modules" aria-label="${L('Toutes mes apps')}"><span>${icon('grid')}</span>${L('Apps')}</button>
    ${main.map(([k, label, ico]) => btn(k, label, ico)).join('')}
    ${more.length ? `<button class="nav-btn more-btn ${moreActive ? 'active' : ''}" data-app-more="${id}"><span>${icon('menu')}</span>${L('Plus')}</button>` : ''}
    ${more.map(([k, label, ico]) => btn(k, label, ico, 'rail-only')).join('')}
  </nav>`;
}
function appMoreSheet(id) {
  const m = moduleById(id);
  const shell = APP_SHELL[id];
  const cur = shell.get();
  return `<div class="sheet-head"><div><span class="tag">${esc(L(m.name))}</span><h2>${L('Toutes les rubriques')}</h2></div><button class="icon-btn" data-close aria-label="${L('Fermer')}">×</button></div>
    <div class="app-more ${m.tone}">${shell.tabs().map(([k, label, ico, sub]) => `<button class="am-row ${k === cur ? 'on' : ''}" data-app-tab="${id}:${k}"><span class="mod-ico">${icon(ico)}</span><span><b>${L(label)}</b><small>${L(sub)}</small></span>${icon('chevron')}</button>`).join('')}</div>`;
}
function appHead(id, titleHtml) {
  const m = moduleById(id);
  return `<header class="app-head app-head-mod ${m.tone}"><div class="app-head-row">
    <div class="head-left"><button class="icon-btn apps-ico" data-go="modules" aria-label="${L('Toutes mes apps')}">${icon('grid')}</button></div>
    <div class="head-titles"><small class="head-app"><span class="mod-ico">${icon(m.icon)}</span>NutriPilot</small><h2>${titleHtml}</h2></div>
    <div class="head-actions"><button class="icon-btn scan-btn" data-open-add aria-label="${L('Scanner un repas')}">${icon('scan')}</button><button class="icon-btn coach-btn" data-go="coach" aria-label="${L('Coach')}">${icon('coach')}</button></div>
  </div></header>`;
}
function globalSearch(q) {
  q = q.trim().toLowerCase();
  if (q.length < 2) return '';
  const hit = (txt) => String(txt || '').toLowerCase().includes(q) || L(String(txt || ''), null, false).toLowerCase().includes(q);
  const recipes = ALL_RECIPES.filter((r) => hit(r.name) || r.ingredients.some((i) => hit(i[0]))).slice(0, 5);
  const ex = Object.entries(EXERCISES).filter(([, e]) => hit(e.name) || hit(e.muscle)).slice(0, 5);
  const nut = NUTRIENTS.filter((n) => hit(n[1])).slice(0, 4);
  const lessons = GUIDE_COLLECTIONS.flatMap((c) => c.guides).filter((g) => hit(g.title)).slice(0, 4);
  const group = (title, items) => items.length ? `<div class="gs-group"><small>${L(title)}</small>${items.join('')}</div>` : '';
  const out = group('Recettes', recipes.map((r) => `<button class="gs-item" data-recipe-id="${esc(r.id)}">${CUISINE_FLAG[r.cuisine] || '🍽️'} <span>${esc(L(r.name))}</span><em>${fmt(r.kcal)} kcal</em></button>`))
    + group('Exercices', ex.map(([id, e]) => `<button class="gs-item" data-exercise="${esc(id)}">${icon('dumbbell')} <span>${esc(L(e.name))}</span><em>${esc(L(e.muscle))}</em></button>`))
    + group('Vitamines & nutriments', nut.map((n) => `<button class="gs-item" data-go-nutrient="${n[0]}">${icon('leaf')} <span>${esc(L(n[1]))}</span></button>`))
    + group('Leçons', lessons.map((g) => `<button class="gs-item" data-guide="${esc(g.id)}">${icon('book')} <span>${esc(L(g.title))}</span></button>`));
  return out ? `<div class="gs-box">${out}</div>` : `<div class="gs-box"><p class="fine">${L('Aucun résultat pour « {q} ».', { q: esc(q) })}</p></div>`;
}
// VIP member card: subscribers' plan, unlocked modules and membership date, with 3D depth.
function memberCard() {
  if (!state.premium) return '';
  if (!state.memberSince) { state.memberSince = todayKey(); saveState(false); }
  const owned = ownedModules();
  const all = PAID_MODULES.every((m) => owned.includes(m.id));
  return `<div class="vip-wrap" data-tilt><div class="vip-card ${all ? 'gold' : ''}">
    <div class="vip-row">${logo()}<span class="vip-badge">${icon('star')} ${L(all ? 'Membre VIP' : 'Membre')}</span></div>
    <div class="vip-name"><small>${L('Carte membre')}</small><b>${esc(state.profile?.name || L('Membre NutriPilot'))}</b></div>
    <div class="vip-mods">${MODULES.filter((m) => owned.includes(m.id)).map((m) => `<span class="mod-ico ${m.tone}" title="${esc(L(m.name))}">${icon(m.icon)}</span>`).join('')}</div>
    <div class="vip-row vip-foot"><span><small>${L('Formule')}</small><b>${esc(planLabel())}</b></span><span><small>${L('Depuis')}</small><b>${esc(dateFr(new Date(`${state.memberSince}T12:00:00`), true))}</b></span></div>
    <i class="vip-shine"></i>
  </div></div>`;
}
// Launcher: every module is an app on a home screen. The person's apps first, the others to discover.
const APP_SHORT = Object.fromEntries(MODULES.map((m) => [m.id, m.short || m.name]));
function appIcon(m, owned) {
  const lock = !owned && !m.free;
  return `<button class="app-icon ${m.tone} ${lock ? 'locked' : ''}" data-go="${m.route}" aria-label="${esc(L(m.name))}${lock ? ` · ${esc(L('Aperçu'))}` : ''}">
    <span class="ai-tile">${icon(m.icon)}${lock ? `<em class="ai-lock">${icon('lock')}</em>` : ''}</span><b>${L(APP_SHORT[m.id] || m.name)}</b></button>`;
}
// v10 · "Révolutionnaire" showcase: what NutriPilot delivers, with live proof numbers.
function revoHero() {
  const v = MV();
  return `<section class="revo-hero">
    <span class="revo-kicker">${icon('star')}${L('Révolutionnaire')}</span>
    <h1>${L('Le programme santé complet, dans une seule app.')}</h1>
    <p>${L('Plan alimentaire individuel, recettes du monde, entraînement, ménopause 40+ et sommeil : tout s’adapte à votre objectif — perdre du poids, prendre du muscle ou vivre la ménopause sereinement.')}</p>
    <div class="revo-stats"><div><b>${v.r}</b><span>${L('recettes')}</span></div><div><b>${v.c}</b><span>${L('cuisines du monde')}</span></div><div><b>${v.e}</b><span>${L('exercices')}</span></div><div><b>${v.p}</b><span>${L('programmes')}</span></div></div>
    ${state.premium ? '' : `<button class="btn btn-lime btn-wide btn-xl" data-go="plans">${L('Voir les formules')}</button>
    ${freeScansLeft() > 0 ? `<button class="btn btn-glass btn-wide" data-open-add>${icon('scan')} ${L('Analyser mon repas gratuitement')}</button>` : ''}
    `}
  </section>`;
}
// One space of NutriPilot, sold by its outcome: title, promise, proof, status and the next step.
function modCard(m, owned) {
  const open = owned || (m.free && state.premium);
  const status = open ? `<span class="mc-status on">${icon('check')}${L('Activé')}</span>`
    : `<span class="mc-status">${L('Aperçu')}</span>`;
  const cta = `<button class="mc-cta" data-go="${m.route}">${L(open ? 'Ouvrir' : 'Découvrir')}${icon('chevron')}</button>`;
  return `<article class="mod-card ${m.tone}">
    ${moduleArtwork(m)}
    <button class="mc-top" data-go="${m.route}" aria-label="${esc(modTitle(m))}"><span class="mc-ico">${icon(m.icon)}</span>${status}</button>
    <h3>${modTitle(m)}</h3>
    <p>${L(m.sub)}</p>
    <ul>${m.features.slice(0, 3).map((f) => `<li>${icon('check')}<span>${L(f)}</span></li>`).join('')}</ul>
    ${cta}
  </article>`;
}
// The spaces in the order that matters for this person (her goal first).
function modsForMe() {
  const order = ['nutrition', 'recipes', 'training', 'menopause', 'scanner', 'coach', 'sleep', 'nutrients', 'supplements'];
  const first = state.profile?.track === 'menopause' ? 'menopause' : state.profile?.track === 'muscle' ? 'training' : '';
  return order.map(moduleById).filter(Boolean).sort((a, b) => (b.id === first) - (a.id === first));
}
function modulesScreen() {
  const owned = ownedModules();
  const mine = MODULES.filter((m) => owned.includes(m.id) || (m.free && state.premium));
  const t = totals(); const p = state.profile || {};
  const left = Math.max(0, (p.dailyKcal || 0) - t.kcal);
  return `<div class="mobile-app launcher">
    ${appHeader('Mes apps')}
    <div class="screen">
      ${state.premium ? `<button class="today-strip" data-go="app"><span class="ts-ico">${icon('home')}</span><span><small>${L('Aujourd’hui')}</small><b>${L('{n} kcal restantes', { n: fmt(left) })}</b></span><span class="ts-meta">${icon('drop')}${fmt(waterToday() / 1000, 1)} L<i></i>${icon('flame')}${L('{n} j', { n: streak() })}</span></button>` : ''}
      <label class="search-box">${icon('search')}<input id="global-search" type="search" placeholder="${L('Rechercher une recette, un exercice, un nutriment…')}" autocomplete="off"></label>
      <div id="gs-results"></div>
      ${state.premium ? '' : revoHero()}
      ${mine.length ? `<div class="section-label"><h3>${L('Accès rapide')}</h3></div><div class="app-grid">${mine.map((m) => appIcon(m, true)).join('')}</div>` : ''}
      <div class="section-label"><h3>${L(state.premium ? 'Tous vos espaces' : 'Tout ce qui est inclus')}</h3><button class="link-btn" data-go="plans">${L('Formules')}</button></div>
      <div class="mod-cards">${modsForMe().map((m) => modCard(m, owned.includes(m.id))).join('')}</div>
      ${memberCard()}
      <div class="section-label"><h3>${L('Inclus pour tous')}</h3></div>
      <div class="free-row"><button data-go="app">${icon('home')}<span>${L('Aujourd’hui')}</span></button><button data-go="progress">${icon('progress')}<span>${L('Progrès')}</span></button><button data-open-goal>${icon('scale')}<span>${L('Objectif')}</span></button><button data-open-profile>${icon('user')}<span>${L('Profil')}</span></button></div>
      <button class="plans-link" data-go="plans">${icon('star')}<span><b>${L('Nos formules')}</b><small>${L('Modules, combinaisons et Kit complet')}</small></span>${icon('chevron')}</button>
    </div>
    ${bottom('modules')}
  </div>`;
}
// Shown inside a module the person does not have yet (paid users adding a module).
function moduleLockedScreen(id) {
  const m = moduleById(id) || MODULES[0];
  return `<div class="mobile-app">
    ${appHeader(m.name)}
    <div class="screen">
      <section class="mod-hero ${m.tone}">${moduleArtwork(m)}<span class="mod-ico big">${icon(m.icon)}</span><h1>${modTitle(m)}</h1><p>${L(m.sub, MV())}</p>
        <ul>${m.features.map((f) => `<li>${icon('check')}<span>${L(f, MV())}</span></li>`).join('')}</ul>
        <button class="btn btn-lime btn-wide btn-xl" data-module-buy="${m.id}">${L('Voir les formules')}</button>
      </section>
    </div>
    ${bottom('modules')}
  </div>`;
}

const Billing = {
  native() { return Boolean(window.NutriPilotNative?.purchase); },
  store() { return window.NutriPilotNative?.store || 'App Store / Google Play'; },
  plans() {
    const all = Array.isArray(config.plans) && config.plans.length ? config.plans : DEFAULT_PLANS;
    // In the store app, list only what the store actually sells.
    if (!nativePlatform()) return all;
    return all.filter((p) => sellable(p) && (!p.annual || sellable({monthly:p.annual})));
  },
  trialDays() {
    // In the store app, show a free trial only if the store really offers one (App Store 3.1.2).
    if (!nativePlatform()) return 0;
    if (this.native() && Object.keys(window.NutriPilotNative?.products || {}).length) return Number(window.NutriPilotNative.trialDays || 0);
    return 0;
  },
  // Trial of one exact product (e.g. 7 days on the annual plan only, none on the monthly).
  trialFor(plan, period) {
    if (!nativePlatform()) return 0;
    if (!plan?.[period]) return 0;
    if (this.native() && Object.keys(window.NutriPilotNative?.products || {}).length) return NativeBilling.introDays(window.NutriPilotNative.products[plan[period].storeId]?.intro);
    return 0;
  },
  async purchase(plan, period) {
    const option = plan[period];
    const id = `${plan.tier}_${period}`;
    track('InitiateCheckout', { plan: id, value: lp(plan, period), currency: currency() });
    if (this.native()) {
      // Every plan, composed ones included, is a single store subscription, confirmed by the server.
      const result = await window.NutriPilotNative.purchase(option.storeId, { tier: plan.tier, period });
      if (!result?.token) return;
      state.premium = true;
      state.accessToken = result.token;
      state.premiumEmail = result.email || state.premiumEmail;
      state.subscriptionPlan = result.plan || `${plan.tier}_${period}`;
      saveState();
      haptic('success');
      const trialLen = this.trialFor(plan, period);
      const N = capPlugin('LocalNotifications');
      if (trialLen > 2 && N) {
        N.requestPermissions().then(() => N.schedule({ notifications: [{ id: NOTIF_BASE + 900, title: 'NutriPilot', body: L('Votre essai gratuit se termine dans 2 jours. Rien à faire pour continuer ; pour annuler, passez par les réglages de votre compte {store}.', { store: this.store() }), schedule: { at: new Date(Date.now() + (trialLen - 2) * 86400000) } }] })).catch(() => {});
      }
      track('StartTrial', { plan: id });
      celebrate();
      toast(L('Formule activée ✓'));
      return nav(state.onboarding ? 'app' : 'onboarding');
    }
    if (nativePlatform()) {
      // Inside the app but the store did not answer yet (offline, slow network): retry, never a dead end.
      NativeBilling.started = false; await NativeBilling.start();
      if (this.native()) return this.purchase(plan, period);
      return toast(L('La boutique ne répond pas. Vérifiez votre connexion et réessayez.'));
    }
    // Browser visitors are directed to the native app, without an external checkout.
    modal = { type: 'store', plan: plan.tier, period };
    return renderModal();
  },
  async restore() {
    if ((!this.native() || !window.NutriPilotNative.restore) && nativePlatform()) { NativeBilling.started = false; await NativeBilling.start(); }
    if (!this.native() || !window.NutriPilotNative.restore) return nativePlatform() ? toast(L('La boutique ne répond pas. Vérifiez votre connexion et réessayez.')) : nav('access');
    let result = null;
    try { result = await window.NutriPilotNative.restore(); } catch (error) { return toast(error?.message || L('Réessayez dans un instant.')); }
    if (result?.token) {
      state.premium = true;
      state.accessToken = result.token;
      state.subscriptionPlan = result.plan || state.subscriptionPlan;
      await pullRemoteState();
      saveState();
      haptic('success'); toast(L('Achats restaurés ✓'));
      return nav(state.onboarding ? 'app' : 'onboarding');
    }
    if (NativeBilling.pending?.action === 'restore') return;
    toast(L('Aucun abonnement actif trouvé.'));
  },
};

// ---- Currency: every price is set in USD (base) and converted at today's rate to the buyer's currency ----
// In the iPhone / Android app the store's own localized price wins (window.NutriPilotNative.products).
// On the web: today's exchange rate from the server (config.rates, per 1 USD), else the fallback below,
// rounded like store price points (x,49 / x,99; whole numbers for currencies without cents).
const BASE_CURRENCY = 'USD';
// Units of each currency per 1 USD, 12 Oct 2026 (fallback only; the server refreshes real rates every 12 h).
const FALLBACK_RATES = {
  BRL: 4.99, USD: 1, EUR: 0.8937, GBP: 0.7555, CAD: 1.389, AUD: 1.555, NZD: 1.722, CHF: 0.8333, JPY: 158.6, KRW: 1389, INR: 95.81, IDR: 17900, MXN: 18.32, ARS: 1167, CLP: 955.6, COP: 4083, PEN: 3.722,
  UYU: 40.55, PYG: 7779, BOB: 6.946, TRY: 41.11, PLN: 3.833, SEK: 9.721, NOK: 10.28, DKK: 6.667, CZK: 22.78, HUF: 350, RON: 4.445, BGN: 1.722, ZAR: 18.05, AED: 3.667, SAR: 3.778, QAR: 3.667,
  EGP: 48.89, MAD: 9.167, ILS: 3.667, THB: 32.78, VND: 26110, PHP: 57.24, MYR: 4.278, SGD: 1.278, HKD: 7.779, TWD: 31.11, NGN: 1500, KES: 127.8, PKR: 277.8, BDT: 119.5, UAH: 41.11, KZT: 511, GEL: 2.722, RSD: 104.4,
};
const ZERO_DEC = ['JPY', 'KRW', 'IDR', 'CLP', 'COP', 'PYG', 'VND', 'HUF', 'ARS', 'NGN', 'KES', 'PKR', 'TWD', 'KZT', 'UGX', 'TZS', 'BDT', 'RSD', 'ISK'];
const CUR_NAMES = { BRL: 'Real', USD: 'US Dollar', EUR: 'Euro', GBP: 'Pound', CAD: 'Canadian Dollar', AUD: 'Australian Dollar', NZD: 'NZ Dollar', CHF: 'Franc suisse', JPY: '日本円', KRW: '원', INR: 'Rupee', IDR: 'Rupiah', MXN: 'Peso MX', ARS: 'Peso AR', CLP: 'Peso CL', COP: 'Peso CO', PEN: 'Sol', UYU: 'Peso UY', PYG: 'Guaraní', BOB: 'Boliviano', TRY: 'Lira', PLN: 'Złoty', SEK: 'Krona SE', NOK: 'Krone NO', DKK: 'Krone DK', CZK: 'Koruna', HUF: 'Forint', RON: 'Leu', BGN: 'Lev', ZAR: 'Rand', AED: 'Dirham AE', SAR: 'Riyal SA', QAR: 'Riyal QA', EGP: 'Pound EG', MAD: 'Dirham MA', ILS: 'Shekel', THB: 'Baht', VND: 'Đồng', PHP: 'Peso PH', MYR: 'Ringgit', SGD: 'Dollar SG', HKD: 'Dollar HK', TWD: 'Dollar TW', NGN: 'Naira', KES: 'Shilling KE', PKR: 'Rupee PK', BDT: 'Taka', UAH: 'Hryvnia', KZT: 'Tenge', GEL: 'Lari', RSD: 'Dinar' };
// Country → currency (store price currency).
const CC_CUR = { BR: 'BRL', US: 'USD', PR: 'USD', EC: 'USD', SV: 'USD', PA: 'USD', GB: 'GBP', GG: 'GBP', JE: 'GBP', IM: 'GBP', CA: 'CAD', AU: 'AUD', NZ: 'NZD', CH: 'CHF', LI: 'CHF', JP: 'JPY', KR: 'KRW', IN: 'INR', ID: 'IDR', MX: 'MXN', AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN', UY: 'UYU', PY: 'PYG', BO: 'BOB',
  TR: 'TRY', PL: 'PLN', SE: 'SEK', NO: 'NOK', DK: 'DKK', CZ: 'CZK', HU: 'HUF', RO: 'RON', BG: 'BGN', ZA: 'ZAR', AE: 'AED', SA: 'SAR', QA: 'QAR', EG: 'EGP', MA: 'MAD', IL: 'ILS', TH: 'THB', VN: 'VND', PH: 'PHP', MY: 'MYR', SG: 'SGD', HK: 'HKD', TW: 'TWD', NG: 'NGN', KE: 'KES', PK: 'PKR', BD: 'BDT', UA: 'UAH', KZ: 'KZT', GE: 'GEL', RS: 'RSD' };
const EURO_ZONE = ['AT', 'BE', 'CY', 'DE', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PT', 'SI', 'SK', 'MC', 'AD', 'SM', 'VA', 'ME', 'XK', 'GP', 'MQ', 'GF', 'RE', 'YT', 'PM', 'BL', 'MF'];
EURO_ZONE.forEach((c) => { CC_CUR[c] = 'EUR'; });
// Time zone → country, for the browser (no location permission needed).
const TZ_CC = {
  'America/Sao_Paulo': 'BR', 'America/Fortaleza': 'BR', 'America/Recife': 'BR', 'America/Bahia': 'BR', 'America/Belem': 'BR', 'America/Maceio': 'BR', 'America/Manaus': 'BR', 'America/Cuiaba': 'BR', 'America/Campo_Grande': 'BR', 'America/Porto_Velho': 'BR', 'America/Boa_Vista': 'BR', 'America/Rio_Branco': 'BR', 'America/Araguaina': 'BR', 'America/Santarem': 'BR', 'America/Noronha': 'BR', 'America/Eirunepe': 'BR',
  'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA', 'America/Winnipeg': 'CA', 'America/Halifax': 'CA', 'America/St_Johns': 'CA', 'America/Regina': 'CA', 'America/Montreal': 'CA',
  'America/Mexico_City': 'MX', 'America/Monterrey': 'MX', 'America/Cancun': 'MX', 'America/Tijuana': 'MX', 'America/Merida': 'MX', 'America/Chihuahua': 'MX', 'America/Hermosillo': 'MX', 'America/Mazatlan': 'MX',
  'America/Argentina/Buenos_Aires': 'AR', 'America/Buenos_Aires': 'AR', 'America/Argentina/Cordoba': 'AR', 'America/Argentina/Mendoza': 'AR', 'America/Santiago': 'CL', 'America/Bogota': 'CO', 'America/Lima': 'PE', 'America/Montevideo': 'UY', 'America/Asuncion': 'PY', 'America/La_Paz': 'BO', 'America/Guayaquil': 'EC', 'America/Panama': 'PA', 'America/El_Salvador': 'SV', 'America/Puerto_Rico': 'PR',
  'Europe/London': 'GB', 'Europe/Guernsey': 'GB', 'Europe/Jersey': 'GB', 'Europe/Isle_of_Man': 'GB', 'Europe/Zurich': 'CH', 'Europe/Vaduz': 'LI', 'Europe/Istanbul': 'TR', 'Europe/Warsaw': 'PL', 'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO', 'Europe/Copenhagen': 'DK', 'Europe/Prague': 'CZ', 'Europe/Budapest': 'HU', 'Europe/Bucharest': 'RO', 'Europe/Sofia': 'BG', 'Europe/Kiev': 'UA', 'Europe/Kyiv': 'UA', 'Europe/Belgrade': 'RS',
  'Europe/Paris': 'FR', 'Europe/Berlin': 'DE', 'Europe/Madrid': 'ES', 'Europe/Rome': 'IT', 'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE', 'Europe/Vienna': 'AT', 'Europe/Lisbon': 'PT', 'Atlantic/Madeira': 'PT', 'Atlantic/Azores': 'PT', 'Atlantic/Canary': 'ES', 'Europe/Dublin': 'IE', 'Europe/Helsinki': 'FI', 'Europe/Athens': 'GR', 'Europe/Luxembourg': 'LU', 'Europe/Monaco': 'MC', 'Europe/Andorra': 'AD', 'Europe/Tallinn': 'EE', 'Europe/Riga': 'LV', 'Europe/Vilnius': 'LT', 'Europe/Bratislava': 'SK', 'Europe/Ljubljana': 'SI', 'Europe/Zagreb': 'HR', 'Europe/Malta': 'MT', 'Asia/Nicosia': 'CY', 'Europe/Podgorica': 'ME', 'America/Guadeloupe': 'GP', 'America/Martinique': 'MQ', 'America/Cayenne': 'GF', 'Indian/Reunion': 'RE', 'Indian/Mayotte': 'YT',
  'Asia/Tokyo': 'JP', 'Asia/Seoul': 'KR', 'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Asia/Jakarta': 'ID', 'Asia/Makassar': 'ID', 'Asia/Jayapura': 'ID', 'Asia/Pontianak': 'ID', 'Asia/Bangkok': 'TH', 'Asia/Ho_Chi_Minh': 'VN', 'Asia/Saigon': 'VN', 'Asia/Manila': 'PH', 'Asia/Kuala_Lumpur': 'MY', 'Asia/Singapore': 'SG', 'Asia/Hong_Kong': 'HK', 'Asia/Taipei': 'TW', 'Asia/Karachi': 'PK', 'Asia/Dhaka': 'BD', 'Asia/Almaty': 'KZ', 'Asia/Tbilisi': 'GE',
  'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA', 'Asia/Qatar': 'QA', 'Asia/Jerusalem': 'IL', 'Asia/Tel_Aviv': 'IL', 'Africa/Cairo': 'EG', 'Africa/Casablanca': 'MA', 'Africa/Johannesburg': 'ZA', 'Africa/Lagos': 'NG', 'Africa/Nairobi': 'KE',
  'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Brisbane': 'AU', 'Australia/Perth': 'AU', 'Australia/Adelaide': 'AU', 'Australia/Hobart': 'AU', 'Australia/Darwin': 'AU', 'Pacific/Auckland': 'NZ', 'Pacific/Honolulu': 'US',
};
function countryCurrency(cc) { return CC_CUR[String(cc || '').toUpperCase()] || ''; }
function detectCountry() {
  let tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch {}
  if (TZ_CC[tz]) return TZ_CC[tz];
  if (/^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Boise|Juneau|Sitka|Nome|Adak|Metlakatla|Yakutat|Menominee|Indiana\/.+|Kentucky\/.+|North_Dakota\/.+)$/.test(tz)) return 'US';
  for (const l of navigator.languages || [navigator.language || '']) { const cc = String(l).split('-')[1]; if (countryCurrency(cc)) return cc.toUpperCase(); }
  return '';
}
function buyerCountry() { return [state?.country, config.country, detectCountry()].find((c) => countryCurrency(c)) || 'US'; }
function detectCurrency() { return countryCurrency(buyerCountry()) || 'USD'; }
function rates() { return config.rates && typeof config.rates === 'object' && config.ratesBase === 'USD' ? { ...FALLBACK_RATES, ...config.rates, USD: 1 } : FALLBACK_RATES; }
function currency() {
  const native = window.NutriPilotNative?.currency;
  if (native) return native;
  return state?.currency && rates()[state.currency] ? state.currency : detectCurrency();
}
// Exact conversion: the dollar price × today's rate, to the cent (whole units for currencies without cents).
const roundCur = (v, cur) => (ZERO_DEC.includes(cur) ? Math.round(v) : r2(v));
function localPrice(basePrice, storeId = '', cur = currency()) {
  const store = storeId && window.NutriPilotNative?.products?.[storeId];
  if (store && Number.isFinite(Number(store.price))) return Number(store.price);
  return roundCur(basePrice * (rates()[cur] || 1), cur);
}
// Price of a plan in the buyer's currency. The store's own price wins in the iPhone / Android app.
// Annual = exactly 10 × the local monthly price, so the 2 free months add up in every currency.
function lp(plan, period, cur = currency()) {
  const store = window.NutriPilotNative?.products?.[plan[period].storeId];
  if (store && Number.isFinite(Number(store.price))) return Number(store.price);
  const monthly = localPrice(plan.monthly.price, '', cur);
  return period === 'annual' ? roundCur(monthly * 10, cur) : monthly;
}
function money(value, cur = currency()) {
  try {
    return new Intl.NumberFormat(locale(), { style: 'currency', currency: cur, currencyDisplay: 'narrowSymbol', minimumFractionDigits: ZERO_DEC.includes(cur) ? 0 : 2, maximumFractionDigits: ZERO_DEC.includes(cur) ? 0 : 2 }).format(Number(value));
  } catch { return `${cur} ${Number(value).toFixed(2)}`; }
}
const euro = money;
// Read-only pricing hook for QA and for the store setup list.
window.__npPricing = { rate: (c) => rates()[c], zero: (c) => ZERO_DEC.includes(c), usd: (mods) => customPlan(mods).monthly.price, currency: () => currency(), money: (v, c) => money(v, c), catalog: () => storeCatalog(), local: (v, c) => localPrice(v, '', c), currencies: () => Object.keys(rates()).filter((k) => CUR_NAMES[k]), combo: (mods, period, c) => lp(customPlan(mods), period, c),
  plans: (c) => DEFAULT_PLANS.map((p) => ({ tier: p.tier, monthly: lp(p, 'monthly', c), annual: lp(p, 'annual', c), save: planSaving(p, 'monthly'), ref: refPrice(p, 'monthly', c) })) };
// Country (auto-detected) sets the currency; the person can change the country or pay in another currency.
const flagOf = (cc) => String.fromCodePoint(...[...cc.toUpperCase()].map((ch) => 127397 + ch.charCodeAt(0)));
function countryName(cc) { try { return new Intl.DisplayNames([locale()], { type: 'region' }).of(cc) || cc; } catch { return cc; } }
function locationPicker(compact = false) {
  if (window.NutriPilotNative?.currency) return '';
  const cc = buyerCountry();
  const cur = currency();
  const local = countryCurrency(cc) || 'USD';
  const countries = Object.keys(CC_CUR).map((c) => [c, countryName(c)]).sort((a, b) => a[1].localeCompare(b[1], locale()));
  const intl = ['USD', 'EUR', 'GBP'].filter((c) => c !== local);
  const others = Object.keys(rates()).filter((k) => CUR_NAMES[k] && k !== local && !intl.includes(k)).sort();
  const opt = (k, label) => `<option value="${k}" ${state.currency === k ? 'selected' : ''}>${esc(label)}</option>`;
  const rate = rates()[cur];
  return `<div class="loc-pick ${compact ? 'compact' : ''}">
    <label><span>${L('Pays')}</span><select data-country aria-label="${L('Pays')}">${countries.map(([c, n]) => `<option value="${c}" ${c === cc ? 'selected' : ''}>${flagOf(c)} ${esc(n)}</option>`).join('')}</select></label>
    <label><span>${L('Devise de paiement')}</span><select data-currency aria-label="${L('Devise de paiement')}">
      <option value="" ${state.currency ? '' : 'selected'}>${esc(`${L('Locale')} · ${local} (${CUR_NAMES[local] || local})`)}</option>
      <optgroup label="${L('Internationales')}">${intl.map((k) => opt(k, `${k} · ${CUR_NAMES[k]}`)).join('')}</optgroup>
      <optgroup label="${L('Autres devises')}">${others.map((k) => opt(k, `${k} · ${CUR_NAMES[k]}`)).join('')}</optgroup>
    </select></label>
    ${cur !== BASE_CURRENCY && rate ? `<p class="loc-rate">${L('Prix fixés en dollar et convertis au taux du jour : 1 US$ = {r}', { r: money(rate, cur) })}</p>` : ''}
  </div>`;
}
// Final price as charged: "R$ 149,90 / an" — never a per-month equivalent on its own.
const unitOf = (period) => (period === 'annual' ? L('/ an') : L('/ mois'));
function finalPrice(plan, period) { return `${money(lp(plan, period))} ${unitOf(period)}`; }
// Small comparison line: crossed reference price + the amount saved.
function compareHtml(plan, period) {
  const save = saveAmount(plan, period);
  if (save < (ZERO_DEC.includes(currency()) ? 1 : 0.1)) return period === 'annual' ? `<i class="cmpx">${L('soit {p} / mois', { p: money(lp(plan, 'annual') / 12) })}</i>` : '';
  return `<i class="cmpx"><s>${money(refPrice(plan, period))}</s> ${L('économisez {p}', { p: money(save) })}</i>`;
}


function waitlistMode(option) {
  return !Billing.native() && !option?.offer;
}

async function joinWaitlist() {
  const email = $('#waitlist-email')?.value.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast('Saisissez un e-mail valide.');
  try {
    const response = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, lang: lang(), plan: `${selectedTier || defaultTier()}_${selectedPeriod}`, track: state.profile?.track || '', utms: state.utms || {} }) });
    if (!response.ok) throw new Error((await response.json()).error);
    state.waitlistEmail = email;
    saveState(false);
    track('Lead', { plan: `${selectedTier || defaultTier()}_${selectedPeriod}` });
    toast('C’est noté ! Nous vous préviendrons au lancement ✓');
    render();
  } catch (error) {
    toast(error?.message || 'Réessayez dans un instant.');
  }
}

function defaultTier() {
  return selectedTier && findPlan(selectedTier) ? selectedTier : recommendedTier();
}
// One selectable plan row (paywall).
function planOptionHtml(x, current) {
  const o = x[selectedPeriod];
  const reco = x.tier === recommendedTier() && state.onboarding;
  return `<button class="plan-option ${x.tone || ''} ${x.tier === current ? 'selected' : ''}" role="radio" aria-checked="${x.tier === current}" data-tier="${esc(x.tier)}">
    ${reco ? `<span class="plan-badge reco">${esc(L('Recommandé pour vous'))}</span>` : x.badge ? `<span class="plan-badge">${esc(L(x.badge))}</span>` : ''}
    <span class="plan-radio"></span>
    <span class="plan-main"><b>${esc(planName(x))}</b><small>${esc(x.kind === 'bundle' ? x.modules.map((id) => L(moduleById(id).name)).join(' · ') : L(x.sub))}</small>
      ${x.kind !== 'custom' && x.tier === current ? `<span class="plan-feats">${x.features.slice(0, 3).map((f) => `<i>✓ ${esc(L(f, MV()))}</i>`).join('')}</span>` : ''}</span>
    <span class="plan-per"><b>${money(lp(x, selectedPeriod))}</b><small>${unitOf(selectedPeriod)}</small>${compareHtml(x, selectedPeriod)}</span>
  </button>`;
}

// v10 paywall: one decision. The plan that fits her (and the Kit), then Annual (highlighted) or Monthly.
// Everything else lives behind "See all plans".
// v11 — what the person pays for: every space of the chosen plan with what it delivers,
// what is only in the Complete kit (for combos), and what every subscriber gets on top.
const ALSO_INCLUDED = [['list', 'Liste de courses automatique'], ['progress', 'Suivi du poids et des mensurations'], ['bell', 'Rappels repas, eau et séances'], ['camera', 'Photos de progrès privées'], ['fork', 'Modes restaurant et frigo'], ['user', 'Synchronisé sur tous vos appareils'], ['star', '14 langues · sans publicité']];
function includedHtml(plan) {
  const mods = new Set(plan?.modules || []);
  const paid = PAID_MODULES.length && plan ? PAID_MODULES.filter((m) => mods.has(m.id)) : [];
  const free = FREE_MODULES;
  const missing = PAID_MODULES.filter((m) => !mods.has(m.id));
  const tile = (m, kind) => `<div class="inc-tile ${m.tone} ${kind}">
      <span class="inc-ico">${icon(m.icon)}</span>
      <div><b>${modTitle(m)}</b>${kind === 'off' ? `<small>${L('Disponible dans le Kit complet')}</small>` : `<ul>${m.features.slice(0, 2).map((f) => `<li>${L(f)}</li>`).join('')}</ul>`}</div>
      <em>${kind === 'off' ? icon('lock') : kind === 'free' ? L('Offert') : icon('check')}</em>
    </div>`;
  return `<section class="pw-inc">
    <div class="pw-inc-head"><h2>${L('Ce que comprend {plan}', { plan: esc(planName(plan)) })}</h2><span>${L('{n} espaces inclus', { n: paid.length + free.length })}</span></div>
    <div class="inc-grid">${paid.map((m) => tile(m, 'on')).join('')}${free.map((m) => tile(m, 'free')).join('')}</div>
    ${missing.length ? `<div class="pw-inc-head off"><h3>${L('Pas inclus dans cette formule')}</h3></div><div class="inc-grid">${missing.map((m) => tile(m, 'off')).join('')}</div>
      <button class="btn btn-ghost btn-wide pw-to-kit" data-tier="complete">${icon('star')} ${L('Passer au Kit complet')}</button>` : ''}
    <h3 class="pw-also-t">${L('Et aussi, pour tous les abonnés')}</h3>
    <div class="pw-also">${ALSO_INCLUDED.map(([ic, t]) => `<span>${icon(ic)}${L(t)}</span>`).join('')}</div>
  </section>`;
}
function storeLoadingScreen() {
  return `<div class="mobile-app">${appHeader('Formules')}<div class="screen"><div class="day-card" role="status"><h2>${L('La boutique est momentanément indisponible.')}</h2><p>${L('Réessayez pour afficher les prix et les offres confirmés par votre boutique.')}</p><button class="btn btn-primary btn-wide" data-store-retry>${L('Réessayer')}</button><button class="btn btn-ghost btn-wide" data-restore>${L('Restaurer mes achats')}</button></div></div>${bottom('')}</div>`;
}
function storeReady() { return Billing.native() && Billing.plans().length > 0; }
function paywall() {
  if (nativePlatform() && !storeReady()) return storeLoadingScreen();
  const p = state.profile || {};
  const plans = Billing.plans();
  const plan = findPlan(defaultTier()) || plans[0];
  const kit = plans.find((x) => x.tier === 'complete');
  const reco = findPlan(recommendedTier());
  const choices = [reco, kit].filter((x, i, a) => x && a.findIndex((y) => y?.tier === x.tier) === i);
  if (!choices.some((x) => x.tier === plan.tier)) choices.unshift(plan);
  const periods = ['annual', 'monthly'].filter((k) => plan[k] && sellable({ monthly: plan[k] }));
  if (!periods.includes(selectedPeriod)) selectedPeriod = periods[0] || 'annual';
  const trial = Billing.trialFor(plan, selectedPeriod);
  const periodLabel = selectedPeriod === 'annual' ? L('an') : L('mois');
  const proj = (state.onboarding || p.goalSet || state.basicsFilled?.target) && p.weight && p.target ? projection(p) : null;
  const price = money(lp(plan, selectedPeriod));
  const terms = trial
    ? L('{days} jours gratuits, puis {price} / {period}. Renouvellement automatique, annulable à tout moment dans les réglages de votre compte {store}, au moins 24 h avant la fin de l’essai ou de la période en cours.', { days: trial, price, period: periodLabel, store: esc(Billing.store()) })
    : L('{price} / {period}. Renouvellement automatique, annulable à tout moment.', { price, period: periodLabel });
  const periodCard = (k) => {
    const t = Billing.trialFor(plan, k);
    const on = selectedPeriod === k;
    const annual = k === 'annual';
    return `<button class="pw-period ${on ? 'on' : ''} ${annual ? 'best' : ''}" role="radio" aria-checked="${on}" data-period="${k}">
      ${annual ? `<span class="pwp-badge">${L('Annuel')}</span>` : ''}
      <span class="pwp-radio"></span>
      <span class="pwp-main"><b>${L(annual ? 'Annuel' : 'Mensuel')}</b>${t ? `<em>${L('{n} jours gratuits', { n: t })}</em>` : ''}</span>
      <span class="pwp-price"><b>${money(lp(plan, k))}</b><small>${unitOf(k)}</small>${annual ? `<i>${L('soit {p} / mois', { p: money(lp(plan, 'annual') / 12) })}</i>` : ''}</span>
    </button>`;
  };
  return `<div class="mobile-app no-nav paywall pw2">
    <div class="app-head"><div class="app-head-row"><button class="icon-btn" data-nav-back aria-label="${L('Retour')}">${icon('back')}</button>${logo()}${loginLink('Se connecter')}</div></div>
    <div class="screen">
      <span class="revo-kicker">${icon('star')}${L('Révolutionnaire')}</span>
      <h1 class="screen-title">${p.name ? L('{name}, débloquez votre programme complet.', { name: esc(p.name) }) : L('Débloquez votre programme complet.')}</h1>
      ${proj ? `<div class="pw-goal">${icon('progress')}<span>${L('Objectif {target} · estimé le {date}', { target: `<b>${kgFmt(p.target)} kg</b>`, date: `<b>${esc(dateFr(proj.end))}</b>` })}</span></div>` : ''}
      ${choices.length > 1 ? `<div class="pw-plans" role="radiogroup">${choices.map((x) => `<button class="pw-plan ${x.tone || ''} ${x.tier === plan.tier ? 'on' : ''}" role="radio" aria-checked="${x.tier === plan.tier}" data-tier="${esc(x.tier)}"><small>${L(x.tier === 'complete' ? 'Tout inclus' : 'Recommandé pour vous')}</small><b>${esc(planName(x))}</b><span class="pwp-mods">${MODULES.filter((m) => x.modules.includes(m.id) || m.free).map((m) => `<i class="${m.tone}" title="${esc(modTitle(m))}">${icon(m.icon)}</i>`).join('')}</span><em>${L('{n} espaces inclus', { n: MODULES.filter((m) => x.modules.includes(m.id) || m.free).length })}</em></button>`).join('')}</div>` : `<div class="pw-plan-one"><b>${esc(planName(plan))}</b><small>${esc(L(plan.sub))}</small></div>`}
      <div class="pw-periods" role="radiogroup">${periods.map(periodCard).join('')}</div>
      <p class="fine">${L('Les analyses de votre formule sont soumises aux limites d’utilisation. Le code-barres et la saisie manuelle restent disponibles.')}</p><button class="btn btn-lime btn-wide btn-xl pw-cta-top" data-buy>${trial ? L('Commencer mes {n} jours gratuits', { n: trial }) : L('Continuer · {price} / {period}', { price, period: periodLabel })}</button>
      <div class="pw-trust">
        <span>${icon('lock')}${L('Paiement sécurisé par l’App Store / Google Play')}</span>
        <span>${icon('check')}${L('Annulable en un geste, sans engagement')}</span>
        ${trial ? `<span>${icon('bell')}${L('Rappel 2 jours avant la fin de l’essai')}</span>` : ''}
      </div>
      ${includedHtml(plan)}
      ${trial ? `<div class="trial-timeline">
        <div><span class="tl-dot on">${icon('lock')}</span><p><b>${L('Aujourd’hui')}</b>${L('Accès complet à votre formule. Aucun paiement maintenant.')}</p></div>
        <div><span class="tl-dot">${icon('bell')}</span><p><b>${L('Jour {n}', { n: Math.max(1, trial - 1) })}</b>${L('Annulez quand vous voulez depuis votre compte App Store ou Google Play, sans frais pendant l’essai.')}</p></div>
        <div><span class="tl-dot">${icon('star')}</span><p><b>${L('Jour {n}', { n: trial })}</b>${L('Début de l’abonnement, sauf si vous annulez avant.')}</p></div>
      </div>` : ''}
      <div class="sticky-cta">
        <button class="btn btn-lime btn-wide btn-xl" data-buy>${trial ? L('Commencer mes {n} jours gratuits', { n: trial }) : L('Continuer · {price} / {period}', { price, period: periodLabel })}</button>
        <p class="pw-terms">${terms}</p>
        <p class="pw-legal"><a href="/terms?lang=${lang()}" target="_blank" rel="noopener">${L('Conditions d’utilisation')}</a> · <a href="/privacy?lang=${lang()}" target="_blank" rel="noopener">${L('Politique de confidentialité')}</a></p>
      </div>
      <div class="pw-links">
        ${Billing.native() ? `<button class="link-btn" data-restore>${L('Restaurer mes achats')}</button>` : `<button class="link-btn" data-go="access">${L('Déjà client ? Se connecter')}</button>`}
        <button class="link-btn" data-go="plans">${L('Voir toutes les formules')}</button>
        <button class="link-btn" data-support-open>${L('Une question ? Parler au support')}</button>
        <button class="link-btn" data-go="app">${L('Plus tard, continuer à explorer')}</button>
      </div>
      ${Billing.native() ? '' : `<details class="pw-country"><summary>${L('Pays et devise')}</summary>${locationPicker()}</details>`}
    </div>
    <div class="pw-bar"><span><b>${esc(planName(plan))}</b><small>${trial ? L('{n} jours gratuits, puis {price} / {period}', { n: trial, price, period: periodLabel }) : `${price} ${unitOf(selectedPeriod)}`}</small></span><button class="btn btn-lime" data-buy>${trial ? L('Commencer') : L('Continuer')}</button></div>
  </div>`;
}

const LOCKED_COPY = {
  training: ['Entraînement', 'Ajoutez l’entraînement à votre programme', 'Plus de 10 programmes salle et maison, agenda de la semaine, bibliothèque d’exercices et suivi des charges.', 'training'],
  nutrition: ['Nutrition', 'Ajoutez la nutrition à votre programme', 'Plan de repas 7 jours, recettes de chef, liste de courses et « Que manger ensuite ? ».', 'program'],
  menopause: ['Ménopause', 'Ajoutez l’espace Ménopause 40+', 'Journal des symptômes, alimentation adaptée, séances force et équilibre, programme guidé de 8 semaines.', 'menopause'],
};
function lockedScreen(feature) {
  const [title, heading, text, tab] = LOCKED_COPY[feature] || LOCKED_COPY.nutrition;
  return `<div class="mobile-app">
    ${appHeader(title)}
    <div class="screen">
      <div class="today-card locked-card">${icon('lock')}
        <h2>${L(heading)}</h2>
        <p>${L(text)}</p>
        <button class="btn btn-lime btn-wide" data-upgrade="${feature === 'menopause' ? 'menopause' : 'complete'}">${L(feature === 'menopause' ? 'Découvrir la formule Ménopause' : 'Passer au Kit complet')}</button>
      </div>
    </div>
    ${bottom(tab)}
  </div>`;
}

function appHeader(title) {
  const showBack = !ROOT_ROUTES.includes(route);
  return `<header class="app-head"><div class="app-head-row">
    <div class="head-left">${showBack ? `<button class="icon-btn back-btn" data-nav-back aria-label="${L('Retour')}">${icon('back')}</button>` : ''}<button class="icon-btn menu-btn" data-drawer aria-label="${L('Menu')}">${icon('menu')}</button></div>
    <div class="head-titles"><small class="head-date">${new Date().toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' })}</small><h2>${esc(L(title, null, !/👋/.test(title)))}</h2></div>
    <div class="head-actions"><button class="icon-btn coach-btn" data-go="coach" aria-label="${L('Coach')}">${icon('coach')}</button></div>
  </div></header>${exploreBanner()}`;
}

// ---- Side drawer -----------------------------------------------------------
function drawerHtml() {
  const p = state.profile || {};
  const initials = (p.name || 'NP').trim().split(/\s+/).map((x) => x[0]).join('').slice(0, 2).toUpperCase();
  const tierLabel = state.premium ? planLabel() : t('explore');
  const item = (r, ico, label, extra = '') => `<button class="drawer-item ${route === r ? 'active' : ''}" ${r === 'add' ? 'data-open-add' : r === 'reminders' ? 'data-reminders' : `data-go="${r}"`} ${extra}>${icon(ico)}<span>${L(label)}</span></button>`;
  return `<div class="drawer-wrap">
    <aside class="drawer" role="dialog" aria-label="${L('Menu')}">
      <div class="drawer-head">
        <button class="avatar" data-go="profile" aria-label="${L('Mon profil')}">${esc(initials)}</button>
        <div><b>${esc(p.name || 'NutriPilot')}</b><small>${esc(tierLabel)}</small></div>
        <button class="icon-btn" data-drawer-close aria-label="${L('Fermer')}">${icon('close')}</button>
      </div>
      <div class="drawer-stats"><div>${icon('flame')}<b>${streak()}</b><small>${L('jours de suite')}</small></div><div>${icon('scale')}<b>${weightKnown() ? fmt(lastWeight(), 1) : '—'}</b><small>kg</small></div><div>${icon('drop')}<b>${fmt(waterToday() / 1000, 1)}</b><small>L</small></div></div>
      <nav class="drawer-nav">
        <small>${L('Essentiel')}</small>
        ${item('app', 'home', 'Aujourd’hui')}
        ${item('progress', 'progress', 'Progrès')}
        ${item('goal', 'scale', 'Mon objectif de poids')}
        ${item('profile', 'user', 'Mon profil')}
        ${item('plans', 'star', 'Nos formules')}
        <small>${L('Modules')}</small>
        ${MODULES.map((m) => `<button class="drawer-item ${moduleForRoute()?.id === m.id ? 'active' : ''}" data-go="${m.route}">${icon(m.icon)}<span>${L(m.name)}</span>${state.premium && !hasModule(m.id) ? `<em class="dr-lock">${icon('lock')}</em>` : ''}</button>`).join('')}
        ${item('modules', 'grid', 'Tous les modules')}
        <small>${L('Outils')}</small>
        ${item('add', 'scan', 'Scanner un repas')}
        ${item('planner', 'sparkle', 'Que manger ensuite ?')}
        ${item('reminders', 'bell', 'Rappels')}
        <small>${L('Aide')}</small>
        ${item('support', 'help', 'Aide & support')}
        ${item('tour', 'star', 'Découvrir l’application')}
        ${item('settings', 'settings', 'Réglages')}
        ${item('lang', 'globe', 'Langue')}
      </nav>
      ${state.premium ? '' : `<button class="btn btn-lime btn-wide" data-go="plans">${esc(t('unlock'))}</button>`}
      <p class="drawer-foot">NutriPilot · ${esc(config.supportEmail)}</p>
    </aside>
  </div>`;
}

function openDrawer() {
  closeDrawer(true);
  const wrap = document.createElement('div');
  wrap.innerHTML = drawerHtml();
  const el = wrap.firstElementChild;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('open'));
  el.addEventListener('click', (event) => {
    const btn = event.target.closest('button');
    if (event.target === el || (btn && btn.dataset.drawerClose !== undefined)) return closeDrawer();
    if (!btn) return;
    closeDrawer(true);
    if (btn.dataset.openAdd !== undefined) return openAdd(canScan() ? 'photo' : 'barcode');
    if (btn.dataset.reminders !== undefined) { modal = { type: 'reminders' }; return renderModal(); }
    if (btn.dataset.go) return nav(btn.dataset.go);
  });
  document.addEventListener('keydown', drawerEsc);
}
function drawerEsc(event) { if (event.key === 'Escape') closeDrawer(); }
function closeDrawer(instant = false) {
  const el = document.querySelector('.drawer-wrap');
  document.removeEventListener('keydown', drawerEsc);
  if (!el) return;
  if (instant) return el.remove();
  el.classList.remove('open');
  setTimeout(() => el.remove(), 260);
}

function menoFocus() {
  const p = state.profile || {};
  if (state.premium) return hasFeature('menopause') && (planTier() === 'menopause' || p.track === 'menopause');
  return p.track === 'menopause';
}

function bottom(active) {
  const tabs = [
    ['app', 'home', 'Aujourd’hui'],
    ['modules', 'grid', 'Apps'],
    ['add', 'scan', 'Scanner'],
    state.premium ? ['coach', 'coach', 'Coach'] : ['plans', 'star', 'Formules'],
    ['progress', 'progress', 'Progrès'],
  ];
  const mod = MODULE_ROUTES[active];
  if (mod && !['coach'].includes(active)) active = 'modules';
  return `<nav class="bottom-nav"><span class="rail-brand" aria-hidden="true">${logo()}</span>${tabs.map(([r, ico, label]) => `<button class="nav-btn ${r === active ? 'active' : ''} ${r === 'add' ? 'center' : ''}" ${r === 'add' ? 'data-open-add' : `data-go="${r}"`} aria-label="${L(label)}"><span>${icon(ico)}</span>${L(label)}</button>`).join('')}</nav>`;
}

function macroStat(name, value, target) {
  const percent = clamp(value / Math.max(1, target) * 100, 0, 100);
  return `<div><div class="small-stat"><span>${esc(L(name))}</span><b>${fmt(value, 1)} / ${fmt(target)} g</b></div><div class="progress"><i style="width:${percent}%"></i></div></div>`;
}

function mealsHtml(meals) {
  if (!meals.length) return `<div class="empty">${L('Aucun repas enregistré aujourd’hui.')}<br><b>${L('Photo, texte, code-barres, recette ou favori : utilisez le moyen le plus rapide.')}</b></div>`;
  return `<div class="meal-list">${meals.map((meal) => `<button class="meal" data-meal="${esc(meal.id)}"><span class="meal-ico">${meal.icon || '🍽️'}</span><span><b>${esc(meal.title)}</b><small>${esc(L(meal.type || ''))}${meal.total?.protein ? ` · ${fmt(meal.total.protein)} g prot.` : ''}</small></span><b>${fmt(meal.total?.kcal)} kcal</b></button>`).join('')}</div>`;
}

// One personal tip based on the questionnaire answers (hunger time, focus), then the day's numbers.
function personalTip(p) {
  const h = new Date().getHours();
  if (p.hungerTime === 'afternoon' && h >= 13 && h < 17) return ['Votre moment sensible approche', 'Vous avez le plus faim l’après-midi : prévoyez une collation protéinée vers 16 h (yaourt, fruit et quelques noix).'];
  if (p.hungerTime === 'evening' && h >= 17) return ['Le soir, votre moment sensible', 'Un dîner riche en protéines et en légumes, puis une tisane : les envies du soir diminuent souvent.'];
  if (p.hungerTime === 'morning' && h < 11) return ['Un petit-déjeuner qui tient', 'Vous avez faim le matin : misez sur 20 à 30 g de protéines (œufs, skyr, fromage blanc) pour tenir jusqu’au déjeuner.'];
  if (p.track === 'menopause' && p.menoFocus === 'hot' && h >= 16) return ['Bouffées de chaleur', 'Le soir, limitez alcool, plats très épicés et boissons chaudes : notez-les dans vos facteurs pour voir l’effet chez vous.'];
  if (p.track === 'menopause' && p.menoFocus === 'sleep' && h >= 18) return ['Pour mieux dormir', 'Dernière caféine avant 14 h, dîner léger et chambre fraîche : votre module Sommeil propose une relaxation guidée.'];
  if (p.eatFocus === 'veg') return ['Objectif légumes', 'Ajoutez une portion de légumes au prochain repas : la moitié de l’assiette, c’est le bon repère.'];
  if (p.eatFocus === 'sugar' && h >= 15) return ['Moins de sucre', 'Une envie de sucré ? Essayez un fruit avec un yaourt nature, ou la respiration SOS d’une minute.'];
  if (p.schedule === 'shift') return ['Horaires décalés', 'Gardez vos repas à heures régulières par rapport à votre réveil, pas à l’horloge : c’est ce qui compte.'];
  return null;
}
function dashboardInsight(t, p) {
  const tip = personalTip(p);
  const tipHtml = tip ? `<div class="insight tip-insight"><strong>${L(tip[0])}</strong>${L(tip[1])}</div>` : '';
  if (!t.kcal) return tipHtml || `<div class="insight"><strong>${L('Commencez par votre prochain repas.')}</strong>${L('Scannez, vérifiez les grammes, puis laissez NutriPilot adapter le reste de la journée.')}</div>`;
  const left = p.dailyKcal - t.kcal;
  const proteinLeft = p.protein - t.protein;
  let main;
  if (left < 0) main = `<div class="insight"><strong>${L('Une journée ne décide pas de votre progression.')}</strong>${L('Vous avez dépassé votre repère d’environ {n} kcal. Reprenez simplement votre structure habituelle au prochain repas.', { n: fmt(Math.abs(left)) })}</div>`;
  else if (proteinLeft > 35) main = `<div class="insight"><strong>${L('Priorité utile : protéines.')}</strong>${L('Il vous reste environ {n} g pour atteindre votre repère. « Que manger ensuite ? » peut proposer trois options adaptées.', { n: fmt(proteinLeft) })}</div>`;
  else main = `<div class="insight"><strong>${L('Vous êtes bien cadré aujourd’hui.')}</strong>${L('Il reste environ {n} kcal. Utilisez le plan ou composez votre prochain repas selon votre envie.', { n: fmt(left) })}</div>`;
  return tipHtml + main;
}

function ringArc(r, value, max, cls, width) {
  const c = 2 * Math.PI * r;
  const pct = clamp(value / Math.max(1, max), 0, 1);
  return `<circle class="ring-track ${cls}" r="${r}" cx="110" cy="110" stroke-width="${width}"/><circle class="ring-val ${cls}" r="${r}" cx="110" cy="110" stroke-width="${width}" stroke-dasharray="${c.toFixed(1)}" style="--off:${(c * (1 - pct)).toFixed(1)};--full:${c.toFixed(1)}"/>`;
}

function waterGoal() {
  return Number(state.waterGoal || 2000);
}

function bottleSvg(percent) {
  const level = 100 - clamp(percent, 0, 100);
  return `<svg class="bottle" viewBox="0 0 80 150" aria-hidden="true">
    <defs><clipPath id="bottleClip"><path d="M28 6h24v14c0 4 12 8 12 22v94a8 8 0 0 1-8 8H24a8 8 0 0 1-8-8V42c0-14 12-18 12-22z"/></clipPath></defs>
    <g clip-path="url(#bottleClip)">
      <rect x="0" y="0" width="80" height="150" class="bottle-bg"/>
      <g class="bottle-fill" style="transform:translateY(${(level * 1.5).toFixed(1)}px)">
        <path class="wave w1" d="M0 6 Q20 0 40 6 T80 6 T120 6 T160 6 V160 H0 Z"/>
        <path class="wave w2" d="M0 8 Q20 2 40 8 T80 8 T120 8 T160 8 V160 H0 Z"/>
      </g>
    </g>
    <path class="bottle-line" d="M28 6h24v14c0 4 12 8 12 22v94a8 8 0 0 1-8 8H24a8 8 0 0 1-8-8V42c0-14 12-18 12-22z"/>
  </svg>`;
}

// ---- v10 screens: today, progress, plans, hub ---------------------------------
function macroMeter(label, cls, value, target) {
  const pct = clamp(value / Math.max(1, target) * 100, 0, 100);
  return `<div class="macro-meter"><span class="mm-label"><i class="dot ${cls}"></i>${L(label)}</span><b>${fmt(value)} g</b><span class="mm-bar ${cls}"><i style="width:${pct}%"></i></span></div>`;
}

function weekDots() {
  const p = state.profile;
  const start = new Date();
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return `<div class="week-dots">${Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const key = todayKey(d);
    const kcal = totals(key).kcal;
    const pct = clamp(kcal / Math.max(1, p.dailyKcal), 0, 1);
    const c = 2 * Math.PI * 13;
    const isToday = key === todayKey();
    const future = key > todayKey();
    return `<div class="wd-dot ${isToday ? 'today' : ''} ${future ? 'future' : ''}"><small>${esc(d.toLocaleDateString(locale(), { weekday: 'narrow' }))}</small><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" class="wdt"/><circle cx="16" cy="16" r="13" class="wdv" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - pct)).toFixed(1)}"/></svg><b>${d.getDate()}</b></div>`;
  }).join('')}</div>`;
}

function missionList() {
  const t = totals();
  const p = state.profile;
  const list = [
    ['fork', 'Enregistrer un repas', state.meals.some((m) => m.day === todayKey()), 'add'],
    ['drop', 'Atteindre mon objectif d’eau', waterToday() >= waterGoal(), 'water'],
    ['sparkle', 'Atteindre 80 % de mes protéines', t.protein >= p.protein * 0.8, 'planner'],
  ];
  if (hasFeature('training') && todaySession()) list.push(['dumbbell', 'Faire ma séance du jour', doneOn(todayKey()), 'training']);
  if (hasFeature('menopause') && (p.track === 'menopause' || (p.menopause && p.menopause !== 'no'))) list.push(['flower', 'Remplir mon journal ménopause', Boolean(state.menoLog?.[todayKey()] && Object.keys(state.menoLog[todayKey()]).length), 'menopause']);
  list.push(['check', 'Faire mon check-in', Boolean(state.checkins[todayKey()]?.energy), 'checkin']);
  return list;
}
function missionsDone() { const list = missionList(); return [list.filter((x) => x[2]).length, list.length]; }
function dailyMissions() {
  const list = missionList();
  const done = list.filter((x) => x[2]).length;
  const c = 2 * Math.PI * 20;
  return `<section class="missions">
    <div class="missions-head"><svg viewBox="0 0 48 48" class="mi-ring"><circle cx="24" cy="24" r="20" class="mit"/><circle cx="24" cy="24" r="20" class="miv" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - done / list.length)).toFixed(1)}"/><text x="24" y="28" text-anchor="middle">${done}/${list.length}</text></svg><div><b>${L('Missions du jour')}</b><small>${done === list.length ? L('Journée parfaite. Bravo !') : L('Petites actions, gros résultats.')}</small></div></div>
    <div class="mission-list">${list.map(([ico, label, ok, go]) => `<button class="mission ${ok ? 'ok' : ''}" ${go === 'add' ? 'data-open-add' : go === 'water' ? 'data-water="250"' : go === 'checkin' ? 'data-scroll="checkin"' : `data-go="${go}"`}><span class="mi-ico">${ok ? icon('check') : icon(ico)}</span><span>${L(label)}</span></button>`).join('')}</div>
  </section>`;
}

function recipeIdeas() {
  const type = new Date().getHours() < 10 ? 'b' : new Date().getHours() >= 15 && new Date().getHours() < 18 ? 's' : 'm';
  const left = Math.max(250, state.profile.dailyKcal - totals().kcal);
  const ideas = rankRecipes(type, Math.min(left, state.profile.dailyKcal * 0.38)).slice(0, 6);
  if (!ideas.length) return '';
  return `<div class="section-label"><h3>${L('Idées pour vous')}</h3><button class="link-btn" data-go="recipes">${L('Voir tout →')}</button></div>
    <div class="idea-strip">${ideas.map((r) => `<button class="idea-card r-${r.type}" data-recipe-id="${esc(r.id)}"><span class="rc-flag">${CUISINE_FLAG[r.cuisine] || '🍽️'}</span><b>${esc(L(r.name))}</b><small>${fmt(r.kcal)} kcal · ${fmt(r.protein)} g ${L('prot.')}</small></button>`).join('')}</div>`;
}

// v11 — activation journey, welcome back, SOS, training-day tip
let awayDays = 0;
const JOURNEY = [
  ['fork', 'Enregistrer mon premier repas', 'Une photo suffit, vous ajustez ensuite.', () => state.meals.length > 0, 'add'],
  ['drop', 'Activer les rappels d’eau', 'Un petit signal, aux heures que vous choisissez.', () => Boolean(state.reminders?.water?.on) || Object.keys(state.water || {}).length >= 2, 'reminders'],
  ['calendar', 'Générer mon plan 7 jours', 'Adapté à votre cuisine et vos goûts.', () => (state.weekPlan || []).length > 0, 'program'],
  ['scale', 'Noter mon poids ou mes mesures', 'Votre point de départ, pour voir le chemin.', () => (state.weights || []).length > 1 || Object.keys(state.measures || {}).length > 0, 'progress'],
  ['dumbbell', 'Découvrir une séance', 'Exercices animés, à la maison ou en salle.', () => (state.workoutLog || []).length > 0 || (state.customPrograms || []).length > 0, 'training'],
  ['book', 'Lire une leçon de 3 minutes', 'Les bases qui font la différence.', () => (state.guidesRead || []).length > 0, 'guides'],
  ['check', 'Faire mon premier bilan', 'Un check-in rapide : faim et énergie.', () => Object.keys(state.checkins || {}).length > 0, 'checkin'],
];
function journeyCard() {
  if (!state.premium || state.journeyHidden) return '';
  if (!state.journeyStart) { state.journeyStart = state.meals.length > 20 ? '' : todayKey(); if (!state.journeyStart) { state.journeyHidden = true; } saveState(false); if (state.journeyHidden) return ''; }
  const day = Math.floor((new Date(`${todayKey()}T12:00:00`) - new Date(`${state.journeyStart}T12:00:00`)) / 86400000) + 1;
  const steps = JOURNEY.map(([ico, title, sub, ok, go]) => ({ ico, title, sub, ok: ok(), go }));
  const done = steps.filter((x) => x.ok).length;
  if (day > 10 || done === steps.length) return '';
  const next = steps.find((x) => !x.ok);
  const action = next.go === 'add' ? 'data-open-add' : next.go === 'reminders' ? 'data-reminders' : next.go === 'checkin' ? 'data-scroll="checkin"' : `data-go="${next.go}"`;
  return `<section class="journey" aria-label="${L('Vos 7 premiers jours')}">
    <div class="journey-head"><div><small>${L('Vos 7 premiers jours · jour {n}', { n: Math.min(day, 7) })}</small><h3>${L('{d} sur {t} étapes', { d: done, t: steps.length })}</h3></div><button class="icon-btn ghost-x" data-journey-hide aria-label="${L('Masquer')}">${icon('close')}</button></div>
    <div class="journey-track">${steps.map((x) => `<i class="${x.ok ? 'ok' : x === next ? 'now' : ''}"></i>`).join('')}</div>
    <button class="journey-next" ${action}><span class="jn-ico">${icon(next.ico)}</span><span><b>${L(next.title)}</b><small>${L(next.sub)}</small></span>${icon('chevron')}</button>
  </section>`;
}
function welcomeBackCard() {
  if (!state.premium || awayDays < 3 || state.welcomeBackSeen === todayKey() || state.meals.some((m) => m.day === todayKey())) return '';
  const name = state.profile?.name;
  return `<section class="welcome-back">
    <div><h3>${name ? L('Content de vous revoir, {name}', { name: esc(name) }) : L('Content de vous revoir')}</h3>
    <p>${L('Rien à rattraper : on repart d’aujourd’hui, simplement. Un repas noté suffit pour reprendre le fil.')}</p></div>
    <div class="wb-actions"><button class="btn btn-lime" data-open-add>${icon('scan')}<span>${L('Noter un repas')}</span></button><button class="btn btn-ghost" data-welcome-ok>${L('Plus tard')}</button></div>
  </section>`;
}
function sosCard() {
  return `<button class="sos-card" data-sos><span class="sos-ico">${icon('sparkle')}</span><span><b>${L('Envie de grignoter ou besoin d’une pause ?')}</b><small>${L('1 minute de respiration guidée, puis on décide ensemble.')}</small></span>${icon('chevron')}</button>`;
}
function sosSheet() {
  const snacks = rankRecipes('s', 250).slice(0, 3);
  return `<div class="sheet-head"><div><h2>${L('Une minute pour vous')}</h2><p class="fine">${L('Suivez le cercle : inspirez quand il grandit, expirez quand il diminue.')}</p></div><button class="icon-btn" data-close aria-label="${L('Fermer')}">×</button></div>
    <div class="breath" role="img" aria-label="${L('Respiration guidée : inspirez 4 secondes, expirez 6 secondes')}"><div class="breath-ring"></div><div class="breath-core"><span class="b-in">${L('Inspirez')}</span><span class="b-out">${L('Expirez')}</span></div></div>
    <div class="sos-steps">
      <div><b>1</b><span>${L('Buvez un grand verre d’eau.')}</span></div>
      <div><b>2</b><span>${L('Demandez-vous : faim du ventre, ou fatigue, stress, ennui ?')}</span></div>
      <div><b>3</b><span>${L('Si c’est la faim, mangez sans culpabilité : une collation qui tient au corps aide à retrouver le calme.')}</span></div>
    </div>
    ${snacks.length ? `<div class="section-label"><h3>${L('Collations qui calent')}</h3></div><div class="manual-list">${snacks.map((r) => `<button class="manual-item" data-recipe-id="${esc(r.id)}"><span><b>${esc(L(r.name))}</b><small>${fmt(r.kcal)} kcal · ${fmt(r.protein)} g ${L('protéines')}</small></span>${icon('chevron')}</button>`).join('')}</div>` : ''}
    <button class="btn btn-ghost btn-wide sos-water" data-sos-water>${icon('drop')}<span>${L('J’ai bu un verre d’eau (+250 ml)')}</span></button>`;
}
function trainingDayTip(session) {
  if (!session) return '';
  return `<div class="tip-line">${icon('fork')}<span>${L('Jour d’entraînement : prévoyez une source de protéines dans le repas qui suit la séance et buvez un peu plus d’eau.')}</span></div>`;
}
function recentMeals() {
  const seen = new Set();
  return state.meals.slice().sort((a, b) => (b.day + b.id).localeCompare(a.day + a.id)).filter((m) => {
    const k = (m.title || '').trim().toLowerCase();
    if (!k || seen.has(k) || !m.total) return false;
    seen.add(k); return true;
  }).slice(0, 15);
}
function recentTab() {
  const y = state.meals.filter((m) => m.day === addDays(-1));
  const kcal = y.reduce((a, m) => a + Number(m.total?.kcal || 0), 0);
  const list = recentMeals();
  if (!list.length && !y.length) return `<div class="empty">${L('Vos repas récents apparaîtront ici pour les ajouter en un geste.')}</div>`;
  return `${y.length ? `<button class="copy-day" data-copy-yesterday><span>${icon('swap')}</span><span><b>${L('Reprendre la journée d’hier')}</b><small>${L('{n} repas · {k} kcal', { n: y.length, k: fmt(kcal) })}</small></span>${icon('plus')}</button>` : ''}
    <div class="manual-list">${list.map((m) => `<div class="recent-row"><button class="manual-item" data-recent-edit="${esc(m.id)}"><span><b>${esc(m.title)}</b><small>${L(m.type || '')} · ${fmt(m.total.kcal)} kcal · P ${fmt(m.total.protein)} g</small></span></button><button class="recent-add" data-recent-add="${esc(m.id)}" aria-label="${L('Ajouter aujourd’hui')}">${icon('plus')}</button></div>`).join('')}</div>`;
}
function relogMeal(m, type) {
  state.meals.push({ ...clone(m), id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, day: todayKey(), type: type || m.type || mealTypeFromHour() });
}

// Today in three tabs: the day's numbers, the day's missions, and suggestions. Nothing removed, one view at a time.
let todayTab = 'summary';
function todayTabsHtml() {
  const done = missionsDone();
  const tabs = [['summary', 'Résumé', ''], ['missions', 'Missions', `${done[0]}/${done[1]}`], ['foryou', 'Pour vous', '']];
  return `<div class="today-tabs" role="tablist">${tabs.map(([k, label, badge]) => `<button role="tab" aria-selected="${todayTab === k}" class="${todayTab === k ? 'active' : ''}" data-today-tab="${k}">${L(label)}${badge ? `<em>${badge}</em>` : ''}</button>`).join('')}</div>`;
}
function dashboard() {
  const t = totals();
  const p = state.profile;
  const left = Math.max(0, p.dailyKcal - t.kcal);
  const over = Math.max(0, t.kcal - p.dailyKcal);
  const water = waterToday();
  const wGoal = waterGoal();
  const current = lastWeight();
  const target = Number(p.target || current);
  const progress = progressPercent();
  const todayMeals = state.meals.filter((meal) => meal.day === todayKey()).slice().reverse();
  const checkin = state.checkins[todayKey()] || {};
  const todayPlan = (state.weekPlan || []).find((d) => d.date === todayKey()) || (state.weekPlan?.[0]?.date ? null : state.weekPlan?.[0]);
  const dayPlan = todayPlan?.meals || [];
  const animate = !window.__npTodayAnimated;
  window.__npTodayAnimated = true;
  const rem = state.reminders?.water?.on;
  const meno = hasFeature('menopause') && (p.track === 'menopause' || (p.menopause && p.menopause !== 'no'));
  const session = hasFeature('training') ? todaySession() : null;
  const sideCard = meno
    ? `<button class="mini-card meno-mini" data-go="menopause">${icon('flower')}<b>${L('Ménopause')}</b><small>${state.menoLog?.[todayKey()] ? L('Journal rempli ✓') : L('Noter mes symptômes')}</small></button>`
    : hasFeature('training')
      ? `<button class="mini-card train-mini" data-go="training">${icon('dumbbell')}<b>${esc(L(hasTrainingPlan() ? session?.name || 'Repos' : 'Mon entraînement'))}</b><small>${hasTrainingPlan() ? L('{n}/{total} cette semaine', { n: weekWorkouts(), total: trainingDays().length }) : L('Choisir comment m’entraîner')}</small></button>`
      : `<button class="mini-card" data-go="recipes">${icon('fork')}<b>${L('Recettes')}</b><small>${L('{n} idées', { n: ALL_RECIPES.length })}</small></button>`;

  return `<div class="mobile-app today ${animate ? 'animate' : ''}">
    ${appHeader(p.name ? L('Bonjour {name} 👋', { name: p.name }) : L('Bonjour 👋'))}
    <div class="screen">
      ${weekDots()}
      ${todayTabsHtml()}
      ${todayTab === 'summary' ? `
      ${myDayCard()}
      ${welcomeBackCard()}
      <section class="hero-ring-card">
        <div class="ring-wrap">
          <svg class="day-ring" viewBox="0 0 220 220" role="img" aria-label="${L('{n} kcal restantes', { n: fmt(left) })}">
            ${ringArc(98, t.kcal, p.dailyKcal, 'kcal', 14)}
            ${ringArc(78, t.protein, p.protein, 'prot', 7)}
            ${ringArc(66, t.carbs, p.carbs, 'carb', 7)}
            ${ringArc(54, t.fat, p.fat, 'fat', 7)}
          </svg>
          <div class="ring-center"><strong data-count="${over ? over : left}">${fmt(over ? over : left)}</strong><small>${L(over ? 'kcal au-dessus' : 'kcal restantes')}</small></div>
        </div>
        <div class="ring-side">
          <div class="eaten"><small>${L('Mangé')}</small><b><span data-count="${t.kcal}">${fmt(t.kcal)}</span> kcal</b></div>
          ${macroMeter('Protéines', 'prot', t.protein, p.protein)}
          ${macroMeter('Glucides', 'carb', t.carbs, p.carbs)}
          ${macroMeter('Lipides', 'fat', t.fat, p.fat)}
        </div>
        <button class="btn btn-lime btn-wide scan-main" data-add-tab="photo">${icon('scan')}<span>${L('Scanner mon repas')}</span></button>
      </section>

      <div class="duo">
        <section class="water-tile">
          ${bottleSvg(water / wGoal * 100)}
          <div class="water-info">
            <small>${L('Hydratation')}</small>
            <b><span data-count="${water}">${fmt(water)}</span> ml</b>
            <span class="mm-bar water"><i style="width:${clamp(water / wGoal * 100, 0, 100)}%"></i></span>
            <div class="water-actions"><button data-water="-250" aria-label="−250 ml">${icon('minus')}</button><button data-water="250">+250</button><button data-water="500">+500</button></div>
            <button class="remind-chip ${rem ? 'on' : ''}" data-reminders>${icon('bell')}<span>${rem ? L('Rappels activés') : L('Activer les rappels')}</span></button>
          </div>
        </section>
        <div class="duo-col">
          ${goalSet() ? `<button class="mini-card" data-open-goal>${icon('scale')}<b>${fmt(current, 1)} <span class="mc-arrow flip-rtl">→</span> ${fmt(target, 1)} kg</b><small>${goalKind(current, target) === 'maintain' ? L('Objectif atteint : on stabilise') : L('{w} kg jusqu’à l’objectif', { w: fmt(Math.abs(current - target), 1) })}</small><span class="mini-bar"><i style="width:${progress}%"></i></span></button>` : `<button class="mini-card goal-cta" data-open-goal>${icon('scale')}<b>${L('Mon objectif')}</b><small>${L('Choisir mon poids de départ et mon poids cible')}</small></button>`}
          ${sideCard}
        </div>
      </div>

      ${journeyCard()}
      ` : ''}
      ${todayTab === 'missions' ? `
      ${dailyMissions()}
      ${sosCard()}
      ` : ''}
      ${todayTab === 'foryou' ? `
      <div class="quick-grid">
        <button data-go="planner">${icon('sparkle')}<span>${L('Que manger ensuite ?')}</span></button>
        <button data-go="program">${icon('calendar')}<span>${L('Plan 7 jours')}</span></button>
        <button data-go="recipes">${icon('fork')}<span>${L('Recettes')}</span></button>
        <button data-go="coach">${icon('coach')}<span>${L('Coach')}</span></button>
      </div>
      ` : ''}
      ${todayTab === 'summary' ? `
      ${session ? `<button class="today-train" data-session="${esc(session.id)}" data-program="${esc(currentProgram().id)}">${exAnim(session.ex[0][0], 'sm')}<span><small>${L('Séance du jour')}</small><b>${esc(L(session.name))}</b><em>${esc(L(session.focus))} · ${L('{n} exercices', { n: session.ex.length })}</em></span><span class="tt-go">${doneOn(todayKey()) ? icon('check') : icon('chevron')}</span></button>${trainingDayTip(session)}` : ''}

      ` : ''}
      ${todayTab === 'foryou' ? `
      ${dayPlan.length ? `<div class="section-label"><h3>${L('Votre plan aujourd’hui')}</h3><button class="link-btn" data-go="program">${L('7 jours →')}</button></div><div class="plan-today">${dayPlan.map((meal) => { const idx = state.weekPlan.indexOf(todayPlan); const mi = dayPlan.indexOf(meal); return `<div class="pt-row"><span class="pm-flag">${CUISINE_FLAG[meal.cuisine] || '🍽️'}</span><span><small>${esc(L(meal.type))}</small><b>${esc(L(meal.name))}</b></span><button class="pill pill-button" data-add-plan-meal data-day="${idx}" data-meal="${mi}">${fmt(meal.kcal)} kcal ${icon('plus')}</button></div>`; }).join('')}</div>` : `<button class="cta-card" data-go="program">${icon('calendar')}<span><b>${L('Créez votre plan de la semaine')}</b><small>${L('Repas, recettes et liste de courses en un clic.')}</small></span>${icon('chevron')}</button>`}

      ${recipeIdeas()}
      ` : ''}
      ${todayTab === 'summary' ? `

      <div class="section-label"><h3>${L('Repas aujourd’hui')}</h3><span class="streak">${icon('flame')} ${L('{n} j', { n: streak() })}</span></div>
      ${mealsHtml(todayMeals)}
      <div class="section-label"><h3>${L('Votre prochaine décision')}</h3></div>
      ${dashboardInsight(t, p)}

      ` : ''}
      ${todayTab === 'missions' ? `
      <div class="section-label" id="checkin"><h3>${L('Check-in rapide')}</h3><span class="fine">${L('aide le bilan hebdo')}</span></div>
      <div class="checkin-card">
        <div><b>${L('Faim')}</b><div class="checkin-buttons">${[['low','Faible'],['normal','Normale'],['high','Forte']].map(([v,l]) => `<button class="mini-choice ${checkin.hunger === v ? 'selected' : ''}" data-checkin="hunger" data-value="${v}">${L(l)}</button>`).join('')}</div></div>
        <div><b>${L('Énergie')}</b><div class="checkin-buttons">${[['low','Basse'],['normal','OK'],['high','Haute']].map(([v,l]) => `<button class="mini-choice ${checkin.energy === v ? 'selected' : ''}" data-checkin="energy" data-value="${v}">${L(l)}</button>`).join('')}</div></div>
        <div><b>${L('Sommeil')}</b><div class="checkin-buttons">${[['bad','Mauvais'],['ok','Correct'],['good','Bon']].map(([v,l]) => `<button class="mini-choice ${checkin.sleep === v ? 'selected' : ''}" data-checkin="sleep" data-value="${v}">${L(l)}</button>`).join('')}</div></div>
      </div>
      ` : ''}
    </div>
    ${bottom('app')}
  </div>`;
}

// ---- Progress -----------------------------------------------------------------
let progressRange = 90;
const MEASURES = [['waist', 'Tour de taille'], ['hips', 'Hanches'], ['chest', 'Poitrine'], ['arm', 'Bras'], ['thigh', 'Cuisse']];

function measureSeries(key) {
  if (key === 'waist') return state.waist || [];
  return Object.entries(state.measures || {}).filter(([, v]) => v?.[key]).map(([day, v]) => ({ day, value: v[key] })).sort((a, b) => a.day.localeCompare(b.day));
}

function weightChart(series, target) {
  if (!series.length) return '';
  const w = 340, h = 190, x0 = 34, x1 = 326, y0 = 18, y1 = 158;
  const vals = series.map((v) => Number(v.value));
  const min = Math.min(...vals, target) - 0.6;
  const max = Math.max(...vals, target) + 0.6;
  const t0 = new Date(`${series[0].day}T12:00:00`).getTime();
  const t1 = Math.max(t0 + 86400000, new Date(`${series.at(-1).day}T12:00:00`).getTime());
  const X = (d) => x0 + (new Date(`${d}T12:00:00`).getTime() - t0) / (t1 - t0) * (x1 - x0);
  const Y = (v) => y1 - (v - min) / Math.max(0.5, max - min) * (y1 - y0);
  const pts = series.map((v) => [X(v.day), Y(Number(v.value))]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L ${pts.at(-1)[0].toFixed(1)} ${y1} L ${pts[0][0].toFixed(1)} ${y1} Z`;
  const ty = Y(target);
  const ticks = [max - 0.6, (max + min) / 2, min + 0.6];
  return `<svg class="wchart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${L('Courbe de poids')}">
    <defs><linearGradient id="wfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--lime2)" stop-opacity=".5"/><stop offset="1" stop-color="var(--lime2)" stop-opacity="0"/></linearGradient></defs>
    ${ticks.map((v) => `<line x1="${x0}" x2="${x1}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" class="wgrid"/><text x="${x0 - 6}" y="${(Y(v) + 4).toFixed(1)}" text-anchor="end" class="wtick">${fmt(v, 1)}</text>`).join('')}
    <line x1="${x0}" x2="${x1}" y1="${ty.toFixed(1)}" y2="${ty.toFixed(1)}" class="wgoal"/><text x="${x1}" y="${(ty - 6).toFixed(1)}" text-anchor="end" class="wgoal-t">${L('Objectif')} ${fmt(target, 1)}</text>
    <path d="${area}" fill="url(#wfill)"/><path d="${line}" class="wline"/>
    ${pts.map((p, i) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i === pts.length - 1 ? 6 : 3.5}" class="${i === pts.length - 1 ? 'wlast' : 'wpt'}"/>`).join('')}
    <text x="${x0}" y="${h - 6}" class="wtick">${esc(new Date(`${series[0].day}T12:00:00`).toLocaleDateString(locale(), { day: 'numeric', month: 'short' }))}</text>
    <text x="${x1}" y="${h - 6}" text-anchor="end" class="wtick">${esc(new Date(`${series.at(-1).day}T12:00:00`).toLocaleDateString(locale(), { day: 'numeric', month: 'short' }))}</text>
  </svg>`;
}

function barChart(items, target, unit, cls = '') {
  const max = Math.max(target || 0, ...items.map((x) => x.value), 1) * 1.1;
  return `<div class="bars ${cls}">${target ? `<span class="bars-target" style="bottom:${(target / max * 100).toFixed(1)}%"><em>${fmt(target)} ${unit}</em></span>` : ''}${items.map((x) => `<div class="bar-col ${x.today ? 'today' : ''}"><span class="bar" style="height:${Math.max(2, x.value / max * 100).toFixed(1)}%"><em>${x.value ? fmt(x.value) : ''}</em></span><small>${esc(x.label)}</small></div>`).join('')}</div>`;
}

function personalRecords() {
  const best = {};
  for (const w of state.workoutLog || []) for (const [id, kg] of Object.entries(w.loads || {})) if (kg > (best[id]?.kg || 0)) best[id] = { kg, day: w.day };
  return Object.entries(best).sort((a, b) => b[1].kg - a[1].kg).slice(0, 6);
}

function badgeList() {
  const workouts = (state.workoutLog || []).length;
  const lost = startWeight() - lastWeight();
  const waterDays = Object.entries(state.water || {}).filter(([, v]) => v >= waterGoal()).length;
  return [
    ['🥇', 'Premier repas', state.meals.length >= 1],
    ['🔥', 'Série 3 jours', streak() >= 3],
    ['🏆', 'Série 7 jours', streak() >= 7],
    ['👑', 'Série 30 jours', streak() >= 30],
    ['📸', '5 scans', state.scanCount >= 5],
    ['🗓️', 'Plan 7 jours', (state.weekPlan || []).length >= 7],
    ['💧', 'Hydratation 7 jours', waterDays >= 7],
    ['💪', 'Première séance', workouts >= 1],
    ['🏋️', '10 séances', workouts >= 10],
    ['🚀', '50 séances', workouts >= 50],
    ['📉', '−1 kg', state.profile.goal === 'lose' && lost >= 1],
    ['🎯', '−5 kg', state.profile.goal === 'lose' && lost >= 5],
    ['♡', '3 recettes favorites', (state.recipeFavorites || []).length >= 3],
    ['🍽️', '50 repas suivis', state.meals.length >= 50],
  ];
}
function achievements() {
  return `<div class="achievement-grid">${badgeList().map(([ico, label, unlocked]) => `<div class="achievement ${unlocked ? '' : 'locked'}"><span>${ico}</span><b>${esc(L(label))}</b></div>`).join('')}</div>`;
}

function periodCompare() {
  const range = (from, to) => {
    const w = (state.weights || []).filter((x) => x.day >= from && x.day <= to).map((x) => Number(x.value));
    const days = []; for (let i = 0; ; i += 1) { const d = new Date(`${from}T12:00:00`); d.setDate(d.getDate() + i); const k = todayKey(d); if (k > to) break; days.push(k); }
    const kc = days.map((d) => totals(d).kcal).filter(Boolean);
    const sl = days.map((d) => sleepDuration(state.sleepLog?.[d])).filter(Boolean);
    return { weight: w.length ? w.reduce((a, b) => a + b, 0) / w.length : null, kcal: kc.length ? kc.reduce((a, b) => a + b, 0) / kc.length : null, workouts: (state.workoutLog || []).filter((x) => x.day >= from && x.day <= to).length, logged: kc.length, sleep: sl.length ? sl.reduce((a, b) => a + b, 0) / sl.length : null };
  };
  const now = range(addDays(-29), todayKey());
  const prev = range(addDays(-59), addDays(-30));
  const row = (label, a, b, unit, digits = 0, goodDown = false) => { const diff = a != null && b != null ? a - b : null; const good = diff == null || Math.abs(diff) < 0.05 ? '' : (diff < 0) === goodDown ? 'good' : 'neutral'; return `<div class="pc-row"><span>${L(label)}</span><b>${a != null ? `${fmt(a, digits)} ${unit}` : '—'}</b><em class="${good}">${diff != null && Math.abs(diff) >= 0.05 ? `${diff > 0 ? '+' : '−'}${fmt(Math.abs(diff), digits)}` : '='}</em></div>`; };
  return `<div class="section-label"><h3>${L('30 derniers jours vs les 30 précédents')}</h3></div>
    <div class="pc-card">${row('Poids moyen', now.weight, prev.weight, 'kg', 1, state.profile.goal === 'lose')}${row('Calories moyennes', now.kcal, prev.kcal, 'kcal')}${row('Jours notés', now.logged, prev.logged, '', 0)}${row('Séances', now.workouts, prev.workouts, '', 0)}${row('Sommeil moyen', now.sleep, prev.sleep, 'h', 1)}</div>`;
}
function progressScreen() {
  if (!weightKnown()) {
    return `<div class="mobile-app">${appHeader('Progrès')}<div class="screen">
      <section class="gp-empty">${icon('scale')}<h2>${L('Commençons par votre objectif')}</h2><p>${L('Indiquez votre poids actuel et le poids que vous voulez atteindre : NutriPilot calcule le chemin, la date estimée et vos repères du jour.')}</p><button class="btn btn-lime btn-wide btn-xl" data-open-goal>${L('Définir mon objectif')}</button></section>
    </div>${bottom('progress')}</div>`;
  }
  if (!state.weights.length) state.weights = [{ day: todayKey(), value: Number(state.profile.weight) }];
  const p = state.profile;
  const cutoff = progressRange ? addDays(-progressRange) : '0000';
  const series = state.weights.filter((x) => x.day >= cutoff);
  const start = startWeight();
  const end = lastWeight();
  const target = Number(p.target || end);
  const pct = progressPercent();
  const change = end - start;
  const h = Number(p.height || 0) / 100;
  const bmi = h ? end / (h * h) : 0;
  const bmiLabel = !bmi ? '' : bmi < 18.5 ? 'Insuffisance pondérale' : bmi < 25 ? 'Corpulence normale' : bmi < 30 ? 'Surpoids' : 'Obésité';
  const recent = state.weights.filter((x) => x.day >= addDays(-28));
  const rate = recent.length >= 2 ? (Number(recent.at(-1).value) - Number(recent[0].value)) / Math.max(1, (new Date(recent.at(-1).day) - new Date(recent[0].day)) / 604800000) : 0;
  const toGo = target - end;
  const weeksLeft = rate && Math.sign(rate) === Math.sign(toGo) ? Math.abs(toGo / rate) : null;
  const eta = weeksLeft && weeksLeft < 150 ? new Date(Date.now() + weeksLeft * 604800000) : (projection(p)?.end || null);
  const data = weeklyData();
  const logged = data.filter((x) => x.kcal > 0);
  const avgKcal = logged.length ? Math.round(logged.reduce((s, x) => s + x.kcal, 0) / logged.length) : 0;
  const avgProt = logged.length ? Math.round(logged.reduce((s, x) => s + x.protein, 0) / logged.length) : 0;
  const avgWater = Math.round(data.reduce((s, x) => s + x.water, 0) / 7);
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const from = new Date(); from.setDate(from.getDate() - ((from.getDay() + 6) % 7) - (7 - i) * 7);
    const fromKey = todayKey(from); const to = new Date(from); to.setDate(from.getDate() + 6); const toKey = todayKey(to);
    return { label: from.toLocaleDateString(locale(), { day: 'numeric', month: 'numeric' }), value: new Set((state.workoutLog || []).filter((w) => w.day >= fromKey && w.day <= toKey).map((w) => w.day)).size, today: i === 7 };
  });
  const prs = personalRecords();
  const badges = badgeList();
  return `<div class="mobile-app">
    ${appHeader('Progrès')}
    <div class="screen">
      <section class="prog-hero">
        <div class="ph-main"><small>${L('Poids actuel')}</small><b><span data-count="${end}">${fmt(end, 1)}</span> kg</b><span class="ph-delta ${change <= 0 ? 'down' : 'up'}">${change <= 0 ? '↓' : '↑'} ${fmt(Math.abs(change), 1)} kg ${L('depuis le début')}</span></div>
        <div class="ph-goal"><div class="ph-track"><i style="width:${pct}%"></i><span style="left:${pct}%"></span></div><div class="ph-ends"><span>${L('Départ')} ${fmt(start, 1)} kg</span><span>${Math.round(pct)} %</span><span>${L('Objectif')} ${fmt(target, 1)} kg</span></div></div>
        <button class="ph-edit" data-open-goal>${icon('scale')}<span>${goalSet() ? L('Modifier mon objectif') : L('Définir mon objectif')}</span></button>
        <div class="ph-stats"><div><small>${L('Restant')}</small><b>${fmt(Math.abs(toGo), 1)} kg</b></div><div><small>${L('Rythme')}</small><b>${rate ? `${rate > 0 ? '+' : ''}${fmt(rate, 2)} kg/${L('sem.')}` : '—'}</b></div><div><small>${L('Arrivée estimée')}</small><b>${eta ? esc(dateFr(eta)) : '—'}</b></div></div>
      </section>

      <div class="section-label"><h3>${L('Courbe de poids')}</h3><div class="range-chips">${[[30, '1 M'], [90, '3 M'], [0, L('Tout')]].map(([d, l]) => `<button class="${progressRange === d ? 'on' : ''}" data-prog-range="${d}">${l}</button>`).join('')}</div></div>
      <div class="chart-card">${weightChart(series.length ? series : state.weights.slice(-1), target)}</div>

      <section class="log-card">
        <div class="log-weight"><button class="icon-btn" data-weight-step="-0.1" aria-label="−">${icon('minus')}</button><label><input id="weight-now" type="number" step=".1" min="30" max="300" inputmode="decimal" value="${String(Math.round(end * 10) / 10)}"><span>kg</span></label><button class="icon-btn" data-weight-step="0.1" aria-label="+">${icon('plus')}</button></div>
        <details class="measure-box"><summary>${icon('scale')} ${L('Ajouter des mensurations')}</summary><div class="measure-grid">${MEASURES.map(([k, label]) => `<label>${L(label)}<input type="number" step=".5" min="10" max="250" inputmode="decimal" data-measure="${k}" placeholder="cm"></label>`).join('')}</div></details>
        <button class="btn btn-primary btn-wide" data-save-progress>${L('Enregistrer ma pesée')}</button>
      </section>

      <div class="stat-grid">
        <div class="stat"><small>${L('IMC')}</small><b>${bmi ? fmt(bmi, 1) : '—'}</b><em>${esc(L(bmiLabel))}</em></div>
        <div class="stat"><small>${L('Série')}</small><b>${streak()} ${L('j')}</b><em>${L('jours suivis d’affilée')}</em></div>
        <div class="stat"><small>${L('Calories moy.')}</small><b>${avgKcal ? fmt(avgKcal) : '—'}</b><em>${L('sur 7 jours · objectif {n}', { n: fmt(p.dailyKcal) })}</em></div>
        <div class="stat"><small>${L('Protéines moy.')}</small><b>${avgProt ? `${fmt(avgProt)} g` : '—'}</b><em>${L('objectif {n} g', { n: p.protein })}</em></div>
        <div class="stat"><small>${L('Eau moy.')}</small><b>${fmt(avgWater / 1000, 1)} L</b><em>${L('par jour')}</em></div>
        <div class="stat"><small>${L('Séances')}</small><b>${(state.workoutLog || []).filter((w) => w.day >= addDays(-30)).length}</b><em>${L('30 derniers jours')}</em></div>
      </div>

      ${periodCompare()}
      <div class="section-label"><h3>${L('Calories, 7 derniers jours')}</h3></div>
      <div class="chart-card">${barChart(data.map((d) => ({ label: new Date(`${d.day}T12:00:00`).toLocaleDateString(locale(), { weekday: 'narrow' }), value: d.kcal, today: d.day === todayKey() })), p.dailyKcal, 'kcal')}</div>

      ${hasFeature('training') || (state.workoutLog || []).length ? `<div class="section-label"><h3>${L('Séances par semaine')}</h3></div><div class="chart-card">${barChart(weeks, trainingDays().length, '', 'train')}</div>
      ${prs.length ? `<div class="section-label"><h3>${L('Records personnels')}</h3></div><div class="pr-list">${prs.map(([id, r]) => `<button class="pr" data-exercise="${esc(id)}">${EXERCISES[id] ? exAnim(id, 'xs') : ''}<span><b>${esc(L(exName(id)))}</b><small>${esc(dateLabel(r.day))}</small></span><em>${fmt(r.kg, 1)} kg</em></button>`).join('')}</div>` : ''}` : ''}

      <div class="section-label"><h3>${L('Mensurations')}</h3></div>
      <div class="measure-table">${MEASURES.map(([k, label]) => { const s = measureSeries(k); const first = s[0]?.value; const last = s.at(-1)?.value; return `<div><span>${L(label)}</span><b>${last ? `${fmt(last, 1)} cm` : '—'}</b><em class="${last && first && last - first < 0 ? 'down' : ''}">${last && first && s.length > 1 ? `${last - first > 0 ? '+' : ''}${fmt(last - first, 1)} cm` : ''}</em></div>`; }).join('')}</div>

      <div class="section-label"><h3>${L('Photos de progression')}</h3><span class="fine">${L('Restent sur cet appareil')}</span></div>
      <div id="photo-strip" class="photo-strip"><label class="photo-add">${icon('camera')}<span>${L('Ajouter')}</span><input type="file" accept="image/*" id="progress-photo" hidden></label></div>

      <div class="section-label"><h3>${L('Badges')}</h3><span class="fine">${badges.filter((b) => b[2]).length}/${badges.length}</span></div>
      ${achievements()}
      <div class="insight"><strong>${L('Ne corrigez pas votre alimentation sur une seule pesée.')}</strong>${L('Eau, sel, digestion, sommeil et cycle peuvent déplacer le poids sans refléter une variation équivalente de masse grasse.')}</div>
    </div>
    ${bottom('progress')}
  </div>`;
}

// Progress photos: stored only in this browser (IndexedDB), never synced.
const PhotoStore = {
  db: null,
  async open() {
    if (this.db) return this.db;
    this.db = await new Promise((resolve, reject) => {
      const req = indexedDB.open('nutripilot-photos', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('photos', { keyPath: 'id' });
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return this.db;
  },
  async all() {
    try {
      const db = await this.open();
      return await new Promise((resolve) => { const r = db.transaction('photos').objectStore('photos').getAll(); r.onsuccess = () => resolve(r.result || []); r.onerror = () => resolve([]); });
    } catch { return []; }
  },
  async add(blob) {
    const db = await this.open();
    const item = { id: `${Date.now()}`, day: todayKey(), blob };
    await new Promise((resolve, reject) => { const tx = db.transaction('photos', 'readwrite'); tx.objectStore('photos').put(item); tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); });
  },
  async remove(id) {
    const db = await this.open();
    await new Promise((resolve) => { const tx = db.transaction('photos', 'readwrite'); tx.objectStore('photos').delete(id); tx.oncomplete = resolve; tx.onerror = resolve; });
  },
};

async function renderPhotos() {
  const strip = $('#photo-strip');
  if (!strip) return;
  const photos = (await PhotoStore.all()).sort((a, b) => a.id.localeCompare(b.id));
  strip.querySelectorAll('.photo').forEach((x) => x.remove());
  photos.forEach((ph) => {
    const url = URL.createObjectURL(ph.blob);
    const el = document.createElement('div');
    el.className = 'photo';
    el.innerHTML = `<img src="${url}" alt=""><small>${esc(new Date(`${ph.day}T12:00:00`).toLocaleDateString(locale(), { day: 'numeric', month: 'short' }))}</small><button aria-label="${L('Retirer')}" data-photo-remove="${ph.id}">×</button>`;
    strip.insertBefore(el, strip.querySelector('.photo-add'));
  });
  $('#progress-photo')?.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const blob = await compressImage(file, 900);
    await PhotoStore.add(blob);
    toast('Photo ajoutée ✓');
    renderPhotos();
  }, { once: true });
}

async function compressImage(file, maxSide) {
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * k); canvas.height = Math.round(bmp.height * k);
    canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve) => canvas.toBlob((b) => resolve(b || file), 'image/jpeg', 0.82));
  } catch { return file; }
}

// ---- Plans page ---------------------------------------------------------------
// Complete kit on top, then themed bundles, single modules and a "compose my plan" builder.
let plansTab = 'bundles';
let buildSel = null;
function planName(x) {
  return x.kind === 'custom' ? x.parts.map((t) => L(moduleById(t)?.name || findPlan(t)?.label || t)).join(' + ') : L(x.label);
}
// Short module names next to their icons, so a plan's contents read at a glance.
const MOD_SHORT = { nutrition: 'Nutrition', recipes: 'Recettes', training: 'Entraînement', menopause: 'Ménopause', nutrients: 'Vitamines', sleep: 'Sommeil', scanner: 'Scanner', supplements: 'Compléments', coach: 'Coach' };
function modChips(mods, small = false) {
  const paid = mods.filter((id) => !moduleById(id)?.free);
  return `<span class="mchips ${small ? 'small' : ''}">${paid.map((id) => { const m = moduleById(id); return `<span class="mchip ${m.tone}">${icon(m.icon)}<i>${esc(L(small ? MOD_SHORT[id] || m.name : m.name))}</i></span>`; }).join('')}</span>${small && paid.length ? `<em class="pl-free">${icon('check')} ${L('Scanner, Compléments et Coach offerts')}</em>` : ''}`;
}
function priceBlock(x, period = selectedPeriod) {
  return `<div class="pp-price"><b>${money(lp(x, period))}</b><small>${unitOf(period)}</small>${compareHtml(x, period)}</div>`;
}
function viewModulePlans(tier) {
  selectedTier = tier;
  const plan = findPlan(tier) || findPlan(recommendedTier());
  buildSel = plan ? [...plan.modules] : null;
  track('ViewPlans', { module: tier });
  return nav('plans');
}
function choosePlanBtn(x, mine) {
  if (mine) return `<span class="pc-mine">${icon('check')} ${L('Votre formule')}</span>`;
  return `<button class="btn ${x.kind === 'complete' ? 'btn-lime' : 'btn-primary'}" data-choose-plan="${esc(x.tier)}">${L('Choisir')}</button>`;
}
function plansScreen() {
  if (nativePlatform() && !storeReady()) return storeLoadingScreen();
  const plans = Billing.plans();
  const owned = ownedModules();
  const ownsAll = state.premium && PAID_MODULES.every((m) => owned.includes(m.id));
  const kit = plans.find((x) => x.kind === 'complete');
  const bundles = plans.filter((x) => x.kind === 'bundle');
  const mods = plans.filter((x) => x.kind === 'module');
  const isMine = (x) => state.premium && x.modules.every((id) => owned.includes(id));
  if (!buildSel) buildSel = [...(findPlan(recommendedTier())?.modules || ['nutrition', 'training'])];
  const best = bestOffer(buildSel);
  const per = (v) => money(v);
  const unit = unitOf(selectedPeriod);
  const reco = recommendedTier();
  const tab = (id, label) => `<button class="${plansTab === id ? 'active' : ''}" data-plans-tab="${id}" role="tab" aria-selected="${plansTab === id}">${L(label)}</button>`;
  // One compact, fully tappable row per plan.
  const row = (x) => {
    const mine = isMine(x);
    const save = planSaving(x, selectedPeriod);
    return `<button class="pl-row ${x.tone} ${mine ? 'mine' : ''}" ${mine ? 'disabled' : `data-choose-plan="${esc(x.tier)}"`}>
      <span class="mod-ico">${icon(x.icon)}</span>
      <span class="pl-txt"><b>${esc(L(x.label))}${x.tier === reco && !mine ? ` <i class="pl-reco">${L('Recommandé')}</i>` : ''}</b>${x.kind === 'module' ? `<small>${esc(L(x.sub))}</small>` : modChips(x.modules, true)}${kit && !mine && !ownsAll ? `<em class="pl-kitup">${L('Tous les modules : Kit complet pour {p} de plus', { p: per(r2(lp(kit, selectedPeriod) - lp(x, selectedPeriod))) })}</em>` : ''}</span>
      <span class="pl-price">${mine ? `<em class="pl-mine">${icon('check')} ${L('Activé')}</em>` : `<b>${per(lp(x, selectedPeriod))}</b><small>${unit}</small>${compareHtml(x, selectedPeriod)}`}</span>
    </button>`;
  };
  const oneOf = `<p class="pl-oneof">${icon('check')}<span>${L('Chaque option est un abonnement à part : choisissez-en une. Pour tout avoir, le Kit complet coûte {p}.', { p: `${per(lp(kit, selectedPeriod))} ${unit}` })}</span></p>`;
  const body = plansTab === 'modules'
    ? `${oneOf}<div class="pl-list">${mods.map(row).join('')}</div>`
    : plansTab === 'builder'
      ? `<div class="bd-grid">${PAID_MODULES.map((m) => `<button class="bd-mod ${m.tone} ${buildSel.includes(m.id) ? 'on' : ''}" data-build-mod="${m.id}" aria-pressed="${buildSel.includes(m.id)}"><span class="mod-ico">${icon(m.icon)}</span><b>${esc(L(m.name))}</b><i class="bd-check">${icon('check')}</i></button>`).join('')}</div>
        ${best ? `<div class="bd-best compact"><small>${L('Le prix de votre sélection')}</small><b>${esc(planName(best))}</b>
          <div class="bd-price"><b>${per(lp(best, selectedPeriod))}</b><small>${unit}</small>${compareHtml(best, selectedPeriod)}</div>
          ${best.kind === 'complete' && buildSel.length < PAID_IDS.length ? `<p class="bd-up">${L('Pour ce prix, le Kit complet vous donne tous les modules : c’est la meilleure option pour votre sélection.')}</p>` : ''}
          ${best.kind !== 'complete' && kit ? `<p class="bd-up">${L('Pour {p} de plus, prenez le Kit complet : les 9 modules.', { p: `${per(r2(lp(kit, selectedPeriod) - lp(best, selectedPeriod)))} ${unit}` })}</p>` : ''}
          <button class="btn btn-lime btn-wide" data-choose-plan="${esc(best.tier)}">${L('Choisir cette formule')}</button></div>` : `<div class="empty">${L('Choisissez au moins un module.')}</div>`}`
      : `${oneOf}<div class="pl-list">${bundles.map(row).join('')}</div>`;
  return `<div class="mobile-app plans-page">
    ${appHeader('Nos formules')}
    <div class="screen">
      <p class="pl-sub">${L('Un module, une combinaison ou tout. {n} jours gratuits, sans engagement.', { n: 3 })}</p>
      ${state.premium ? `<div class="ph-mine">${icon('check')} <span>${L('Votre formule')} : <b>${esc(planLabel())}</b></span></div>` : ''}
      ${freeBanner(true)}
      ${locationPicker()}
      <div class="period-toggle slim" role="tablist">
        <button class="${selectedPeriod === 'annual' ? 'active' : ''}" data-period="annual">${L('Annuel')}</button>
        <button class="${selectedPeriod === 'monthly' ? 'active' : ''}" data-period="monthly">${L('Mensuel')}</button>
      </div>
      ${kit ? `<button class="kit-row" ${ownsAll ? 'disabled' : `data-choose-plan="complete"`}>
        <span class="kr-txt"><small>${L('Kit complet')} · ${esc(L(kit.badge))}</small><b>${L('Les 9 modules et le coach')}</b></span>
        <span class="kr-price">${ownsAll ? `<em>${icon('check')} ${L('Activé')}</em>` : `<s>${per(refPrice(kit, selectedPeriod))}</s><b>${per(lp(kit, selectedPeriod))}</b><small>${unit}</small>`}</span>
      </button>` : ''}
      <div class="plans-tabs" role="tablist">${tab('bundles', 'Combinaisons')}${tab('modules', 'Modules')}${tab('builder', 'Composer')}</div>
      ${body}
      <details class="pl-more"><summary>${L('Le calcul de chaque formule')}</summary>
        <p class="pt-note">${L('Chaque formule coûte moins que ses modules achetés un par un. Plus vous en prenez, plus la remise augmente : 15 % pour 2, 20 % pour 3, 25 % pour 4. Le Kit complet réunit tout pour moins cher que trois grands modules.')}</p>
        <div class="price-table" role="table">
          <div class="pt-row head" role="row"><span>${L('Formule')}</span><span>${L('Séparément')}</span><span>${L('Prix')}</span><span>${L('Économie')}</span></div>
          ${[kit, ...bundles, ...mods].map((x) => { const ref = refPrice(x, selectedPeriod); const pr = lp(x, selectedPeriod); return `<div class="pt-row ${x.kind}" role="row"><span><b>${esc(L(x.label))}</b><small>${x.kind === 'module' ? esc(L(x.sub)) : sortMods(x.modules).map((id) => `${L(MOD_SHORT[id])} ${money(lp(DEFAULT_PLANS.find((p) => p.tier === id), selectedPeriod))}`).join(' + ')}</small></span><span>${x.kind === 'module' && selectedPeriod === 'monthly' ? '—' : `<s>${money(ref)}</s>`}</span><span><b>${money(pr)}</b></span><span>${ref - pr >= 0.01 ? `−${money(r2(ref - pr))}` : '—'}</span></div>`; }).join('')}
          <p class="pt-foot">${selectedPeriod === 'annual' ? L('Prix par an. « Séparément » = 12 mois de chaque module au prix mensuel ; l’annuel offre 2 mois.') : L('Prix par mois.')} ${L('Scanner, Compléments et Coach offerts')}.</p>
        </div>
      </details>
      <details class="pl-more"><summary>${L('Comparer les formules')}</summary>
        <div class="cmp2" role="table">
          <div class="cmp2-row head" role="row"><span></span>${[kit, ...bundles].map((x) => `<b class="${x.tone}" title="${esc(L(x.label))}">${icon(x.icon)}</b>`).join('')}</div>
          ${MODULES.map((m) => `<div class="cmp2-row" role="row"><span>${esc(L(m.name))}${m.free ? ` <i class="free-tag">${L('offert')}</i>` : ''}</span>${[kit, ...bundles].map((x) => `<i class="${x.modules.includes(m.id) || m.free ? 'yes' : 'no'}">${x.modules.includes(m.id) || m.free ? icon('check') : '–'}</i>`).join('')}</div>`).join('')}
          <div class="cmp2-legend">${[kit, ...bundles].map((x) => `<span><b class="${x.tone}">${icon(x.icon)}</b>${esc(L(x.label))}</span>`).join('')}</div>
        </div>
      </details>
      <details class="pl-more"><summary>${L('Questions fréquentes')}</summary>
        <div class="plans-faq">
          <p><b>${L('Comment fonctionne l’essai gratuit ?')}</b> ${L('Quand la boutique propose un essai gratuit (par exemple 7 jours sur la formule annuelle), sa durée est indiquée sur le bouton. Vous pouvez annuler avant la fin de l’essai sans rien payer.')}</p>
          <p><b>${L('Puis-je combiner plusieurs modules ?')}</b> ${L('Oui. Chaque module s’ajoute à votre abonnement. Si une combinaison ou le Kit complet revient moins cher, NutriPilot vous le propose dans « Composer ».')}</p>
          <p><b>${L('Puis-je changer de formule ?')}</b> ${L('Oui, à tout moment depuis les réglages de votre compte App Store ou Google Play.')}</p>
          <p><b>${L('Le coach est-il inclus ?')}</b> ${L('Oui, le coach répond dans chaque module que vous avez activé.')}</p>
        </div>
      </details>
      ${state.premium ? '' : loginLink(undefined, 'link-btn center-fine pl-login')}
    </div>
    ${bottom('plans')}
  </div>`;
}

// ---- Hub (explorers) ----------------------------------------------------------
// ==========================================================================================
// v12 · MISSION CONTROL — the visitor home. It does not list plans: it shows NutriPilot already
// working for this person (daily target, today's menu from real recipes, today's workout from the
// programme recommended for her, a live scanner demo, projection), with one clear next step.
let missionMenu = null;
function missionDay(p) {
  const key = `${p.dailyKcal}|${p.diet}|${p.track}|${lang()}`;
  if (missionMenu?.key === key) return missionMenu.meals;
  const used = new Set();
  const meals = (SLOT_PLANS[3]).map(([type, label, part]) => {
    const target = Number(p.dailyKcal || 1700) * part;
    const r = rankRecipes(type, target, used)[0];
    if (!r) return null;
    used.add(r.id);
    return scaledMeal(r, target, label);
  }).filter(Boolean);
  missionMenu = { key, meals };
  return meals;
}
function orbitGauge(p) {
  const kcal = Number(p.dailyKcal || 1700);
  const ring = (r, frac, cls, delay) => { const c = 2 * Math.PI * r; return `<circle class="og-track" cx="120" cy="120" r="${r}"/><circle class="og-arc ${cls}" cx="120" cy="120" r="${r}" style="--c:${c.toFixed(1)};--o:${(c * (1 - frac)).toFixed(1)};animation-delay:${delay}s"/>`; };
  return `<div class="orbit">
    <svg viewBox="0 0 240 240" aria-hidden="true">
      <defs><linearGradient id="og1" x1="0" x2="1"><stop offset="0" stop-color="#C9FF3B"/><stop offset="1" stop-color="#18E08A"/></linearGradient>
      <linearGradient id="og2" x1="0" x2="1"><stop offset="0" stop-color="#16C6F0"/><stop offset="1" stop-color="#7D5CFF"/></linearGradient>
      <linearGradient id="og3" x1="0" x2="1"><stop offset="0" stop-color="#FFB547"/><stop offset="1" stop-color="#FF6B8B"/></linearGradient></defs>
      ${ring(104, 0.86, 'a1', 0.1)}${ring(86, 0.72, 'a2', 0.35)}${ring(68, 0.58, 'a3', 0.6)}
      <g class="og-spin"><circle cx="120" cy="10" r="3.5" fill="#C9FF3B"/><circle cx="230" cy="120" r="2.5" fill="#16C6F0"/></g>
      <g class="og-spin rev"><circle cx="120" cy="214" r="2.5" fill="#7D5CFF"/></g>
    </svg>
    <div class="og-core"><small>${L('Votre repère')}</small><b data-count="${kcal}">${fmt(kcal)}</b><span>${L('kcal / jour')}</span></div>
    <span class="og-sat s1"><i></i>${L('Protéines')} <b>${fmt(p.protein || 110)} g</b></span>
    <span class="og-sat s2"><i></i>${L('Glucides')} <b>${fmt(p.carbs || 180)} g</b></span>
    <span class="og-sat s3"><i></i>${L('Lipides')} <b>${fmt(p.fat || 55)} g</b></span>
  </div>`;
}
// ---- v13 Aura: light, touch and motion layer -------------------------------------------------------
// Ripples where the finger lands, a light that follows the pointer on cards, sections that appear as
// you scroll. Everything is skipped with "reduce motion", and continuous effects stop on modest phones.
const AURA_REDUCED = matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const AURA_LITE = AURA_REDUCED || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 3);
document.documentElement.classList.add('aura', 'cosmos', ...(AURA_LITE ? ['aura-lite'] : []));
const AURA_TAP = '.btn, .md-act, .cp-chip, .nav-btn, .mx-meal, .icon-btn, .mt-chips button, .chip-retry, .app-icon, .mini-card, .plan-option';
document.addEventListener('pointerdown', (event) => {
  if (AURA_REDUCED) return;
  const el = event.target.closest?.(AURA_TAP);
  if (!el || el.disabled) return;
  const r = el.getBoundingClientRect();
  const dot = document.createElement('span');
  dot.className = 'aura-ripple';
  const size = Math.max(r.width, r.height) * 2.2;
  dot.style.cssText = `width:${size}px;height:${size}px;left:${event.clientX - r.left - size / 2}px;top:${event.clientY - r.top - size / 2}px`;
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  el.classList.add('aura-host');
  el.appendChild(dot);
  setTimeout(() => dot.remove(), 650);
}, { passive: true });
if (!AURA_LITE && matchMedia?.('(pointer: fine)').matches) {
  document.addEventListener('pointermove', (event) => {
    const card = event.target.closest?.('.myday, .mx-card, .hero-ring-card, .cp-option, .aura-spot');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--sx', `${event.clientX - r.left}px`);
    card.style.setProperty('--sy', `${event.clientY - r.top}px`);
  }, { passive: true });
}
let auraObserver = null;
function auraAfterRender() {
  if (AURA_REDUCED || !('IntersectionObserver' in window)) return;
  auraObserver?.disconnect();
  auraObserver = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('aura-in'); auraObserver.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.mx-card, .mx-tracks, .mx-final, .aura-demo, .aura-tech').forEach((el, i) => { if (el.getBoundingClientRect().top > innerHeight * 0.9) { el.classList.add('aura-pre'); el.style.setProperty('--d', `${(i % 3) * 60}ms`); auraObserver.observe(el); } });
}
// Live, honest demo of the copilot for people who haven't subscribed yet: it replays what the real
// feature does with the person's own plan (no invented results).
function copilotDemo(meals) {
  const lunch = meals.find((m) => m.type === 'Déjeuner') || meals[1] || meals[0];
  if (!lunch) return '';
  return `<section class="mx-card aura-demo" aria-label="${L('Copilote en direct')}">
    <div class="mx-title"><span class="mx-ico m-coach">${icon('sparkle')}</span><div><small>${L('Copilote en direct')}</small><h2>${L('Votre journée change. Votre plan suit.')}</h2></div><em>${L('Exclusif')}</em></div>
    <div class="ad-stage" aria-hidden="true">
      <div class="ad-msg">${L('Je suis parti en retard, je déjeune au restaurant et je m’entraîne ce soir.')}</div>
      <div class="ad-scan"><i></i><span>${L('Analyse de votre journée…')}</span></div>
      <div class="ad-res">
        <div class="ad-row"><b>${L('Déjeuner')}</b><span>${esc(L(lunch.name))}</span><em>→ ${L('Repas au restaurant')} · ≈ ${fmt(lunch.kcal)} kcal</em></div>
        <div class="ad-row"><b>${L('Séance')}</b><span>18:00</span><em>→ 19:30</em></div>
        <div class="ad-row"><b>${L('Rappels')}</b><span>${L('Les rappels d’aujourd’hui suivent les nouveaux horaires.')}</span></div>
        <div class="ad-ok">${icon('check')} ${L('Appliqué')} · ${L('Annuler')}</div>
      </div>
    </div>
    <p class="ad-note">${L('Vous choisissez, NutriPilot réorganise : repas, horaires et rappels. Vos objectifs ne bougent pas, et tout s’annule en un geste.')}</p>
  </section>
  <section class="aura-tech" aria-label="${L('Technologie NutriPilot')}">
    <small>${L('Technologie NutriPilot')}</small>
    <div class="at-grid">${[['camera', 'Vision par photo', 'Calories et macros d’une assiette'], ['scan', 'Code-barres', 'Millions de produits'], ['sparkle', 'Copilote de routine', 'Réorganise votre journée'], ['bell', 'Rappels intelligents', 'Suivent vos horaires du jour'], ['globe', '{n} langues', 'Et la cuisine de votre pays'], ['drop', 'Hors ligne', 'Votre plan reste disponible']].map(([ic, ti, sub]) => `<div class="at-item">${icon(ic)}<b>${L(ti, { n: LANGS.length })}</b><span>${L(sub)}</span></div>`).join('')}</div>
  </section>`;
}
function missionScreen() {
  const p = state.profile || {};
  const proj = p.goalSet && p.weight && p.target && Number(p.target) !== Number(p.weight) ? projection(p) : null;
  const meals = missionDay(p);
  const total = meals.reduce((t, m) => ({ kcal: t.kcal + m.kcal, protein: t.protein + m.protein }), { kcal: 0, protein: 0 });
  const prog = findProgram(recommendedProgramId(p)) || WORKOUT_PROGRAMS[0];
  const session = prog?.sessions?.[0];
  const exs = (session?.ex || []).slice(0, 4);
  const v = MV();
  const left = freeScansLeft();
  const tracks = t('tracks');
  const name = p.name ? esc(p.name) : '';
  return `<div class="mobile-app space">
    <div class="space-bg" aria-hidden="true"><i class="st s1"></i><i class="st s2"></i><i class="st s3"></i><i class="blob b1"></i><i class="blob b2"></i><i class="blob b3"></i></div>
    <header class="app-head mx-head"><div class="app-head-row"><button class="icon-btn menu-btn" data-drawer aria-label="${L('Menu')}">${icon('menu')}</button>${logo()}<div class="head-actions"><button class="icon-btn" data-go="lang" aria-label="Language">${(LANGS.find((x) => x[0] === lang()) || [])[2] || '🌐'}</button></div></div></header>
    <div class="screen mx">
      <section class="mx-hero">
        <div class="mx-statusbar"><span class="revo-kicker">${icon('star')}${L('Révolutionnaire')}</span><span class="mx-live"><i></i>${L('Système NutriPilot · en ligne')}</span></div>
        <h1>${name ? L('{name}, votre programme est calibré.', { name }) : L('Votre corps. Votre plan. Calculé au gramme près.')}</h1>
        <p>${L('Plan alimentaire, entraînement, sommeil et suivi : un seul système qui s’ajuste à vous chaque jour.')}</p>
        ${orbitGauge(p)}
        <div class="mx-metrics">
          ${proj ? `<div><small>${L('Objectif')}</small><b>${kgFmt(p.target)} kg</b><span>${esc(dateFr(proj.end))}</span></div>` : `<div><small>${L('Objectif')}</small><b>${L('Sur mesure')}</b><span>${L('selon votre profil')}</span></div>`}
          <div><small>${L('Recettes')}</small><b data-count="${v.r}">${v.r}</b><span>${L('{c} cuisines', { c: v.c })}</span></div>
          <div><small>${L('Exercices')}</small><b data-count="${v.e}">${v.e}</b><span>${L('{p} programmes', { p: v.p })}</span></div>
        </div>
        <button class="btn btn-lime btn-wide btn-xl mx-cta" data-module-buy="${esc(recommendedTier())}">${L('Voir les formules')}</button>
        ${left > 0 ? `<button class="btn btn-glass btn-wide" data-open-add>${icon('scan')} ${L('Analyser mon repas gratuitement')}<em class="fs-count">${L('{n} offertes', { n: left })}</em></button>` : `<button class="btn btn-glass btn-wide" data-open-add>${icon('scan')} ${L('Scanner un code-barres')}<em class="fs-count">${L('Gratuit')}</em></button>`}
      </section>

      <section class="mx-card mx-menu">
        <div class="mx-title"><span class="mx-ico m-nut">${icon('fork')}</span><div><small>${L('Plan alimentaire sur mesure')}</small><h2>${L('Votre menu d’aujourd’hui')}</h2></div><em>${L('Calculé pour vous')}</em></div>
        <div class="mx-meals">${meals.map((m) => `<button class="mx-meal" data-recipe-id="${esc(m.recipeId)}"><span class="mm-flag">${CUISINE_FLAG[m.cuisine] || '🍽️'}</span><span class="mm-txt"><small>${L(m.type)}</small><b>${esc(L(m.name))}</b></span><span class="mm-kcal"><b>${fmt(m.kcal)}</b><small>kcal · ${m.protein} g P</small></span></button>`).join('')}</div>
        <div class="mx-sum">${icon('check')}<span>${L('{k} kcal et {p} g de protéines : exactement votre repère, avec la cuisine que vous aimez.', { k: fmt(total.kcal), p: total.protein })}</span></div>
      </section>

      ${session ? `<section class="mx-card mx-train">
        <div class="mx-title"><span class="mx-ico m-train">${icon('dumbbell')}</span><div><small>${L('Coach sportif personnel')}</small><h2>${L('Votre séance du jour')}</h2></div><em>${esc(L(prog.name))}</em></div>
        <div class="mt-body">
          <div class="mt-anim">${exAnim(exs[0]?.[0] || 'squat')}</div>
          <ol class="mt-list">${exs.map(([id, sets, reps]) => `<li><b>${esc(exName(id))}</b><span>${sets} × ${esc(L(String(reps)))}</span></li>`).join('')}</ol>
        </div>
      </section>` : ''}

      ${copilotDemo(meals)}

      <section class="mx-card mx-scan">
        <div class="mx-title"><span class="mx-ico m-scan">${icon('scan')}</span><div><small>${L('Scanner de repas')}</small><h2>${L('Une photo. Les calories en secondes.')}</h2></div></div>
        <div class="scan-demo" aria-hidden="true">
          <div class="sd-frame"><span class="sd-plate">🥗</span><i class="sd-line"></i><b class="c1"></b><b class="c2"></b><b class="c3"></b><b class="c4"></b></div>
          <div class="sd-out"><span class="sd-chip k">520 kcal</span><span class="sd-chip">${L('Protéines')} 38 g</span><span class="sd-chip">${L('Glucides')} 41 g</span><span class="sd-chip">${L('Lipides')} 19 g</span></div>
        </div>
        <button class="btn btn-glass btn-wide" data-open-add>${icon('camera')} ${left > 0 ? L('Essayer maintenant · {n} offertes', { n: left }) : L('Scanner un code-barres')}</button>
      </section>

      <section class="mx-card mx-grid">
        ${[['flower', 'm-meno', 'Programme Ménopause 40+', '8 semaines guidées'], ['moon', 'm-sleep', 'Sommeil & anti-stress', 'Respirations guidées'], ['leaf', 'm-vit', 'Vitamines & minéraux', 'Ce qui manque à votre assiette'], ['coach', 'm-coach', 'Coach 24 h/24', 'Une réponse à toute heure']].map(([ic, tone, ti, sub]) => `<div class="mg-item ${tone}"><span class="mx-ico ${tone}">${icon(ic)}</span><b>${L(ti)}</b><small>${L(sub)}</small></div>`).join('')}
      </section>

      <section class="mx-tracks">
        <h2>${L('Calibrez NutriPilot sur votre objectif')}</h2>
        <div class="mt-chips">${TRACKS.map(([id, , , emoji], i) => `<button data-track="${id}"><span>${emoji}</span>${esc(tracks[i][0])}</button>`).join('')}</div>
      </section>

      <section class="mx-final">
        <h2>${L('Tout NutriPilot travaille pour vous dès aujourd’hui.')}</h2>
        <button class="btn btn-lime btn-wide btn-xl" data-module-buy="${esc(recommendedTier())}">${L('Voir les formules')}</button>

        <div class="mx-links"><button class="link-btn" data-go="plans">${L('Comparer les formules')}</button>${loginLink(undefined, 'link-btn')}</div>
      </section>
    </div>
    ${bottom('app')}
  </div>`;
}
// ---- Copilot: "Mon jour maintenant" ------------------------------------------------------------
// The person says what changed (late, eating out, training moved, skipped meal, missing ingredient,
// hunger). NutriPilot reads today's plan and records, asks what is missing, proposes alternatives with
// a preview, applies only the chosen one, keeps a history and lets the latest change be undone.
// Daily targets and anything set by a professional are never changed here.
const CP_SLOT_TIME = { 'Petit-déjeuner': 0, 'Déjeuner': 1, 'Dîner': 2 };
const CP_MEAL_LABEL = { b: 'Petit-déjeuner', m: 'Repas', s: 'Collation' };
let cpPending = null; // { slot, since }: links the next meal the person logs to a slot of today's plan
let cpUndoTimer = null;
function cpDayIndex(day = todayKey()) { return (state.weekPlan || []).findIndex((d) => d.date === day); }
function cpPlan(day = todayKey()) { const i = cpDayIndex(day); return i >= 0 ? state.weekPlan[i] : null; }
function hmToMin(hm) { const [h, m] = String(hm || '0:0').split(':').map(Number); return (h || 0) * 60 + (m || 0); }
function minToHm(n) { const v = clamp(Math.round(n / 15) * 15, 0, 23 * 60 + 45); return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`; }
function nowMin() { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
function cpDefaultTime(meal) { const r = reminders(); return meal.type in CP_SLOT_TIME ? r.meals.times[CP_SLOT_TIME[meal.type]] : '16:00'; }
function cpTimesFrom(meals, times = {}) { return (meals || []).map((m, i) => times[i] || cpDefaultTime(m)); }
function cpTimes(day = todayKey()) { return cpTimesFrom(cpPlan(day)?.meals, state.dayTimes?.[day]?.meals); }
function cpWorkoutTime(day = todayKey()) { return state.dayTimes?.[day]?.workout || reminders().workout.time; }
function cpLogged(i, day = todayKey()) {
  const m = cpPlan(day)?.meals?.[i];
  return state.meals.find((x) => x.day === day && (x.planSlot === i || (x.planSlot == null && m && x.source === 'week-plan' && x.title === m.name)));
}
function cpStatus(i, day = todayKey()) { return cpLogged(i, day) ? 'done' : state.dayTimes?.[day]?.status?.[i] || 'pending'; }
function cpRows(day = todayKey()) {
  const plan = cpPlan(day);
  const times = cpTimes(day);
  return (plan?.meals || []).map((meal, i) => ({ i, meal, time: times[i], status: cpStatus(i, day) })).sort((a, b) => hmToMin(a.time) - hmToMin(b.time));
}
function cpNext(rows = cpRows()) { return rows.find((r) => r.status === 'pending' || r.status === 'out') || null; }
function cpMealName(meal) { return meal.restaurant ? L('Repas au restaurant') : L(meal.name); }
function cpTypeLabel(meal) { return L(meal.type || 'Repas'); }

// What the person tells NutriPilot, turned into events. Works offline; the server can refine it.
function cpParse(text) {
  const low = foldText(String(text || ''));
  const ev = [];
  const slotWord = () => (/almoc|almuerz|lunch|dejeuner|pranzo|mittag/.test(low) ? 'Déjeuner' : /jant|dinner|diner|cena|abend|souper/.test(low) ? 'Dîner' : /cafe da manha|breakfast|petit-dej|petit dej|desayun|colazion|fruhst/.test(low) ? 'Petit-déjeuner' : /lanche|snack|collation|merienda|goute/.test(low) ? 'Collation' : '');
  const timeWord = () => {
    const m = low.match(/\b(\d{1,2})\s*(?:h|:|hrs?|horas?)\s*(\d{2})?\b/);
    if (m && +m[1] < 24) return minToHm(+m[1] * 60 + (+m[2] || 0));
    if (/noite|night|evening|soir|noche|sera|abend/.test(low)) return '19:30';
    if (/manha|morning|matin|manana|mattin|morgen/.test(low)) return '07:00';
    if (/tarde|afternoon|apres-midi|pomeriggio|nachmittag/.test(low)) return '17:00';
    return '';
  };
  if (/atras|late|retard|tard|corrid|sem tempo|pressa|hurry|apress|en retard|verspat/.test(low)) ev.push({ type: 'late', minutes: 60 });
  if (/restaur|comer fora|almocar fora|jantar fora|eat out|eating out|fora de casa|viag|travel|voyage|resto\b|comer en la calle|fuera de casa|au resto|dehors/.test(low)) ev.push({ type: 'out', slot: slotWord() });
  if (/trein|treino|academia|workout|gym|entrain|seance|sport|musculac|corrida|correr/.test(low)) ev.push({ type: 'train', time: timeWord() });
  if (/pulei|nao comi|skipp|saute|perdi o|sem almocar|sem cafe|sem jantar|no comi|salte/.test(low)) ev.push({ type: 'skip', slot: slotWord() });
  if (/nao tenho|acabou|falt|don.?t have|ran out|pas de |plus de |no tengo|se acabo|manca/.test(low)) ev.push({ type: 'missing', slot: slotWord() });
  if (/sem fome|pouca fome|not hungry|pas faim|sin hambre|nao estou com fome/.test(low)) ev.push({ type: 'lessHungry' });
  else if (/fome|faim|hungry|hambre|fame\b|hunger/.test(low)) ev.push({ type: 'hungry' });
  return ev;
}
// Asks for a professional when the message is about health rather than routine.
function cpClinical(text) {
  return /dor\b|dores|nause|nausea|vomit|tontur|desmai|dizz|faint|gravid|pregnan|enceinte|embaraz|remedio|medicament|medication|insulin|diabet|glicem|glycem|pressao|tension|alergi.*rea|reacao|febre|fever|fievre|sangue|blood|saign|compuls|binge|purg/.test(foldText(String(text || '')));
}
function cpMergeEvents(list) {
  const out = [];
  for (const e of list) { if (!out.some((x) => x.type === e.type)) out.push({ ...e }); else Object.assign(out.find((x) => x.type === e.type), Object.fromEntries(Object.entries(e).filter(([, v]) => v))); }
  return out;
}
function cpSlotIndex(slotType) {
  const rows = cpRows();
  if (slotType) { const r = rows.find((x) => x.meal.type === slotType && x.status !== 'done'); if (r) return r.i; }
  return cpNext(rows)?.i ?? -1;
}
// Information the copilot still needs before proposing something precise.
function cpMissing(events) {
  const miss = [];
  for (const e of events) {
    if (['out', 'skip', 'missing'].includes(e.type) && (e.slotIndex == null || e.slotIndex < 0)) miss.push({ ev: e.type, field: 'slotIndex' });
    if (e.type === 'train' && !e.time) miss.push({ ev: 'train', field: 'time' });
  }
  return miss;
}

function cpDraft() {
  const day = todayKey();
  const plan = cpPlan(day);
  const dt = state.dayTimes?.[day] || {};
  return { meals: clone(plan?.meals || []), times: { ...(dt.meals || {}) }, status: { ...(dt.status || {}) }, workout: dt.workout || '' };
}
function cpEnsureTimes(d) { cpTimesFrom(d.meals, d.times).forEach((tm, i) => { d.times[i] = tm; }); return d; }

// Builds the alternatives. Values come from NutriPilot's recipe library (grams, kcal, macros);
// a restaurant meal keeps the planned budget as a guide, never an invented measurement.
function cpOptions(events) {
  const day = todayKey();
  const base = cpEnsureTimes(cpDraft());
  const notes = [];
  const now = nowMin();
  const shared = (d) => {
    for (const e of events) {
      if (e.type === 'late') {
        d.meals.forEach((m, i) => { if (cpStatus(i) !== 'done' && d.status[i] !== 'skipped' && hmToMin(d.times[i]) >= now - 60) d.times[i] = minToHm(Math.max(hmToMin(d.times[i]) + Number(e.minutes || 60), now + 15)); });
      }
      if (e.type === 'train' && e.time) {
        d.workout = e.time;
        const tw = hmToMin(e.time);
        const snack = d.meals.findIndex((m, i) => m.type === 'Collation' && cpStatus(i) !== 'done');
        if (snack >= 0 && tw - 90 > now) d.times[snack] = minToHm(tw - 90);
        const dinner = d.meals.findIndex((m, i) => m.type === 'Dîner' && cpStatus(i) !== 'done');
        if (dinner >= 0 && hmToMin(d.times[dinner]) < tw + 75 && hmToMin(d.times[dinner]) > tw - 120) d.times[dinner] = minToHm(Math.min(tw + 75, 22 * 60 + 30));
      }
    }
    return d;
  };
  const why = [];
  if (events.some((e) => e.type === 'late')) why.push(L('Les horaires suivants sont décalés pour garder un intervalle normal entre les repas.'));
  if (events.some((e) => e.type === 'train' && e.time)) why.push(L('Collation environ 1 h 30 avant la séance et dîner après, pour avoir de l’énergie sans manger juste avant.'));
  const choice = events.find((e) => ['out', 'missing', 'skip', 'hungry', 'lessHungry'].includes(e.type));
  const options = [];
  const opt = (id, title, reason, mutate, extra = {}) => { const d = shared(clone(base)); mutate?.(d); options.push({ id, title, why: [reason, ...why].filter(Boolean), after: d, ...extra }); };
  const used = new Set((state.weekPlan || []).flatMap((x) => (x.meals || []).map((m) => m.recipeId)));
  if (choice?.type === 'out' && choice.slotIndex >= 0) {
    const i = choice.slotIndex; const m = base.meals[i];
    opt('out-plate', L('Au restaurant : assiette équilibrée'), L('Même repère que votre {meal} (≈ {k} kcal) : une protéine grillée ou rôtie, des légumes et une portion de féculents. Vous enregistrez le vrai plat avec le scanner.', { meal: cpTypeLabel(m).toLowerCase(), k: fmt(m.kcal) }), (d) => {
      d.meals[i] = { type: m.type, name: 'Repas au restaurant', restaurant: true, kcal: m.kcal, protein: m.protein, carbs: m.carbs, fat: m.fat, fiber: m.fiber, guide: true, prep: '' }; d.status[i] = 'out';
    }, { restaurant: true });
    const quick = rankRecipes(mealTypeCode(m.type), m.kcal, used, planCuisines(), m.recipeId).filter((r) => (r.prepMin || 30) <= 12)[0];
    if (quick) opt('out-quick', L('Emporter un repas rapide : {name}', { name: L(quick.name) }), L('Prêt en {p}, même repère calorique, à préparer avant de partir.', { p: L(quick.prep) }), (d) => { d.meals[i] = scaledMeal(quick, m.kcal, m.type); });
    opt('keep', L('Garder le plan, seulement les horaires'), L('Rien ne change dans le menu : NutriPilot ajuste seulement les heures et les rappels.'), null);
  } else if (choice?.type === 'missing' && choice.slotIndex >= 0) {
    const i = choice.slotIndex; const m = base.meals[i];
    rankRecipes(mealTypeCode(m.type), m.kcal, used, planCuisines(), m.recipeId).slice(0, 3).forEach((r, k) => {
      const nm = scaledMeal(r, m.kcal, m.type);
      opt(`swap-${k}`, L('Remplacer par {name}', { name: L(r.name) }), L('Même repère calorique ({k} kcal), avec d’autres ingrédients : {ing}.', { k: fmt(nm.kcal), ing: nm.ingredients.slice(0, 5).map((x) => `${L(x.name)} ${x.grams} g`).join(', ') }), (d) => { d.meals[i] = nm; });
    });
  } else if (choice?.type === 'skip' && choice.slotIndex >= 0) {
    const i = choice.slotIndex; const m = base.meals[i];
    opt('skip-normal', L('Continuer la journée normalement'), L('Le repas suivant reste tel quel. Pas besoin de compenser : ni jeûne, ni restriction, ni sport en plus.'), (d) => { d.status[i] = 'skipped'; });
    const snack = rankRecipes('s', Math.min(250, Math.round(m.kcal * 0.5)), used, planCuisines())[0];
    if (snack) opt('skip-snack', L('Ajouter une collation si la faim arrive : {name}', { name: L(snack.name) }), L('Une petite collation évite d’arriver affamé(e) au prochain repas. Vos objectifs du jour ne changent pas.'), (d) => { d.status[i] = 'skipped'; d.meals.push(scaledMeal(snack, Math.min(250, Math.round(m.kcal * 0.5)), 'Collation')); d.times[d.meals.length - 1] = minToHm(now + 30); });
  } else if (choice?.type === 'hungry' || choice?.type === 'lessHungry') {
    const nx = cpNext(); const i = nx ? nx.i : -1;
    if (i >= 0 && choice.type === 'hungry') {
      const m = base.meals[i];
      const pool = ALL_RECIPES.filter((r) => r.type === mealTypeCode(m.type) && r.id !== m.recipeId && recipeAllowed(r)).sort((a, b) => ((b.protein * 4 + b.fiber * 6) / b.kcal) - ((a.protein * 4 + a.fiber * 6) / a.kcal));
      const r = pool[0];
      if (r) { const nm = scaledMeal(r, m.kcal, m.type); opt('hungry-swap', L('{meal} plus rassasiant : {name}', { meal: cpTypeLabel(m), name: L(r.name) }), L('Plus de protéines et de fibres pour les mêmes calories ({p} g de protéines, {f} g de fibres) : cela tient plus longtemps.', { p: fmt(nm.protein), f: fmt(nm.fiber) }), (d) => { d.meals[i] = nm; }); }
      opt('hungry-early', L('Avancer le {meal} de 30 minutes', { meal: cpTypeLabel(m).toLowerCase() }), L('Manger un peu plus tôt quand la faim est là est plus simple que de tenir jusqu’à l’heure prévue.'), (d) => { d.times[i] = minToHm(Math.max(now + 10, hmToMin(d.times[i]) - 30)); });
    } else if (i >= 0) {
      const m = base.meals[i];
      opt('later', L('Décaler le {meal} d’une heure', { meal: cpTypeLabel(m).toLowerCase() }), L('Mangez quand la faim revient : le menu reste le même.'), (d) => { d.times[i] = minToHm(hmToMin(d.times[i]) + 60); });
    }
  }
  if (!options.length) opt('apply', events.length ? L('Réorganiser ma journée') : L('Garder ma journée telle quelle'), '', null);
  // Drop alternatives that change nothing.
  const before = cpEnsureTimes(cpDraft());
  return options.filter((o) => cpDiff(before, o.after).length || o.id === 'apply').map((o) => ({ ...o, lines: cpDiff(before, o.after) }));
}

function cpDiff(a, b) {
  const lines = [];
  const p = state.profile || {};
  b.meals.forEach((m, i) => {
    const o = a.meals[i];
    if (!o) { lines.push(['plus', L('Ajout : {type} · {name} ({k} kcal) à {t}', { type: cpTypeLabel(m), name: cpMealName(m), k: fmt(m.kcal), t: b.times[i] })]); return; }
    if (o.name !== m.name || o.restaurant !== m.restaurant) lines.push(['swap', L('{type} : {a} → {b}', { type: cpTypeLabel(m), a: cpMealName(o), b: cpMealName(m) }) + (m.restaurant ? ` · ${L('repère ≈ {k} kcal', { k: fmt(m.kcal) })}` : ` · ${fmt(o.kcal)} → ${fmt(m.kcal)} kcal`)]);
    if ((a.times[i] || '') !== (b.times[i] || '')) lines.push(['clock', L('{type} : {a} → {b}', { type: cpTypeLabel(m), a: a.times[i], b: b.times[i] })]);
    if ((a.status[i] || '') !== (b.status[i] || '')) lines.push(['flag', b.status[i] === 'skipped' ? L('{type} marqué comme non pris', { type: cpTypeLabel(m) }) : b.status[i] === 'out' ? L('{type} marqué « hors de chez moi »', { type: cpTypeLabel(m) }) : L('{type} remis comme prévu', { type: cpTypeLabel(m) })]);
  });
  if ((a.workout || '') !== (b.workout || '') && b.workout) lines.push(['dumbbell', L('Séance : {a} → {b}', { a: a.workout || cpWorkoutTime(), b: b.workout })]);
  if (lines.length) {
    const r = reminders();
    if (r.meals.on || r.workout.on) lines.push(['bell', L('Les rappels d’aujourd’hui suivent les nouveaux horaires.')]);
    if (p.dailyKcal) lines.push(['target', L('Vos objectifs du jour ne changent pas ({k} kcal · {p} g de protéines).', { k: fmt(p.dailyKcal), p: fmt(p.protein) })]);
  }
  return lines;
}

function cpApply(option, meta = {}) {
  const day = todayKey();
  const di = cpDayIndex(day);
  if (di < 0) return;
  const before = cpDraft();
  const after = clone(option.after);
  const change = { id: `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString(), day, title: option.title, why: option.why || [], lines: option.lines || [], source: meta.source || 'copilot', kind: meta.kind || 'replan', note: meta.note || '', before, after, undone: false };
  state.weekPlan[di].meals = after.meals;
  state.dayTimes = { ...(state.dayTimes || {}), [day]: { meals: after.times, status: after.status, workout: after.workout } };
  state.changes = [change, ...(state.changes || [])].slice(0, 60);
  saveState();
  cpRescheduleReminders();
  track('CopilotApply', { source: option.id || meta.kind });
  haptic('success');
  render();
  cpUndoBar(L('Modification appliquée'), change.id);
  return change;
}
function cpLatest(day = todayKey()) { return (state.changes || []).find((c) => c.day === day && !c.undone); }
function cpUndo(id) {
  const c = (state.changes || []).find((x) => x.id === id);
  if (!c || c.undone) return;
  if (cpLatest(c.day)?.id !== c.id) return toast(L('Annulez d’abord la modification la plus récente.'));
  const di = cpDayIndex(c.day);
  if (di >= 0) state.weekPlan[di].meals = clone(c.before.meals);
  state.dayTimes = { ...(state.dayTimes || {}), [c.day]: { meals: c.before.times, status: c.before.status, workout: c.before.workout } };
  c.undone = true; c.undoneAt = new Date().toISOString();
  saveState();
  cpRescheduleReminders();
  track('CopilotUndo', { source: c.kind });
  render();
  toast(L('Modification annulée ✓'));
}
function cpUndoBar(text, changeId = '', mealId = '') {
  document.querySelector('.np-undo')?.remove();
  const bar = document.createElement('div');
  bar.className = 'np-undo';
  bar.setAttribute('role', 'status');
  bar.innerHTML = `<span>${icon('check')} ${esc(text)}</span><button type="button">${L('Annuler')}</button>`;
  bar.querySelector('button').onclick = () => {
    bar.remove();
    if (changeId) cpUndo(changeId);
    if (mealId) { state.meals = state.meals.filter((m) => m.id !== mealId); saveState(); render(); toast(L('Enregistrement annulé ✓')); }
  };
  document.body.appendChild(bar);
  clearTimeout(cpUndoTimer);
  cpUndoTimer = setTimeout(() => bar.remove(), 7000);
}
function cpRescheduleReminders() {
  const r = reminders();
  if (window.NutriPilotNative?.scheduleReminders && Object.values(r).some((x) => x.on)) window.NutriPilotNative.scheduleReminders(r).catch(() => {});
}
// Logs a planned meal "as planned", linked to its slot.
function cpLogPlanned(i) {
  const meal = cpPlan()?.meals?.[i];
  if (!meal || cpLogged(i)) return;
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  state.meals.push({ id, day: todayKey(), type: meal.type, title: meal.name, planSlot: i, foods: (meal.ingredients || []).map((raw) => { const x = normalizeIngredient(raw); return { name: x.name, grams: x.grams, kcal: 0 }; }), total: { kcal: Number(meal.kcal || 0), protein: Number(meal.protein || 0), carbs: Number(meal.carbs || 0), fat: Number(meal.fat || 0), fiber: Number(meal.fiber || 0) }, icon: '▦', source: 'week-plan' });
  saveState();
  track('MealSaved', { source: 'copilot-planned' });
  haptic('success');
  render();
  sparkBurst(document.querySelector('.ds-ring'));
  cpUndoBar(L('{meal} enregistré', { meal: cpTypeLabel(meal) }), '', id);
}
// Meals saved from the scanner right after "I ate something else" are linked to that slot.
function cpLinkPending() {
  if (!cpPending) return;
  if (Date.now() - cpPending.since > 20 * 60 * 1000) { cpPending = null; return; }
  const m = state.meals.find((x) => x.day === todayKey() && x.planSlot == null && Number(String(x.id).split('-')[0]) >= cpPending.since);
  if (m) { m.planSlot = cpPending.slot; cpPending = null; }
}

// Repeated behaviour seen in the app (never a health inference), offered as a suggestion that can be declined.
function cpPattern() {
  if (state.cpPatternsOff) return null;
  const since = addDays(-21);
  const counts = {};
  (state.changes || []).filter((c) => c.day >= since && !c.undone && ['swap', 'replan'].includes(c.kind)).forEach((c) => {
    c.before.meals.forEach((m, i) => { const n = c.after.meals[i]; if (n && n.name !== m.name) counts[m.type] = (counts[m.type] || 0) + 1; });
  });
  const [type, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [];
  if (!type || n < 3) return null;
  const dismissed = state.cpDismissed?.[type];
  if (dismissed && Date.now() - dismissed < 14 * 86400000) return null;
  const slot = cpRows().find((r) => r.meal.type === type && r.status !== 'done');
  return { type, n, slot: slot ? slot.i : -1 };
}

function cpSyncLabel() {
  if (!state.premium || !state.accessToken) return ['local', L('Enregistré sur cet appareil')];
  return { saving: ['saving', L('Enregistrement…')], pending: ['pending', L('En attente de synchronisation')], error: ['error', L('Impossible d’enregistrer')], saved: ['saved', L('Enregistré')] }[syncStatus] || ['saved', L('Enregistré')];
}
function syncPillHtml() { const [k, label] = cpSyncLabel(); return `<span class="sync-pill ${k}" role="status">${k === 'saving' ? '<i class="sp-dot"></i>' : icon(k === 'error' ? 'info' : k === 'pending' ? 'clock' : 'check')}${esc(label)}</span>`; }
function refreshSyncPill() { document.querySelectorAll('.sync-pill').forEach((el) => { el.outerHTML = syncPillHtml(); }); }

const CP_ACTIONS = [
  ['changed', 'clock', 'Ma routine a changé'],
  ['out', 'fork', 'Je mange dehors'],
  ['fridge', 'book', 'Que cuisiner avec ce que j’ai ?'],
  ['swap', 'swap', 'Remplacer ce repas'],
  ['log', 'plus', 'Enregistrer ce que j’ai mangé'],
];
// Day score (0–100) built only from what the person did today against their own plan: meals logged,
// protein, water and the planned workout. It never judges food; it shows the next action that moves it.
function dayScore() {
  const p = state.profile || {};
  const rows = cpRows();
  const t = totals();
  const parts = [];
  if (rows.length) { const due = rows.filter((r) => hmToMin(r.time) <= nowMin() + 30); const n = Math.max(1, due.length); parts.push(['meals', 40, Math.min(1, rows.filter((r) => r.status === 'done').length / n)]); }
  if (p.protein) parts.push(['protein', 20, Math.min(1, t.protein / p.protein)]);
  parts.push(['water', 20, Math.min(1, waterToday() / Math.max(1, waterGoal()))]);
  if (hasFeature('training') && todaySession()) parts.push(['workout', 20, doneOn(todayKey()) ? 1 : 0]);
  const total = parts.reduce((a, [, w]) => a + w, 0) || 1;
  const score = Math.round(parts.reduce((a, [, w, v]) => a + w * v, 0) / total * 100);
  const gap = parts.map(([k, w, v]) => [k, Math.round(w * (1 - v) / total * 100)]).sort((a, b) => b[1] - a[1])[0];
  const next = rows.length ? cpNext(rows) : null;
  const tip = !gap || gap[1] < 3 ? L('Journée au top. Continuez comme ça.')
    : gap[0] === 'meals' ? L('Enregistrez votre {meal} : +{n} points', { meal: next ? cpTypeLabel(next.meal).toLowerCase() : L('repas'), n: gap[1] })
    : gap[0] === 'water' ? L('Un verre d’eau maintenant : jusqu’à +{n} points', { n: gap[1] })
    : gap[0] === 'protein' ? L('Une source de protéines au prochain repas : jusqu’à +{n} points', { n: gap[1] })
    : L('Faites votre séance du jour : +{n} points', { n: gap[1] });
  return { score, tip };
}
function scoreRing(score) {
  const c = 2 * Math.PI * 26;
  return `<div class="ds-ring" role="img" aria-label="${L('Score du jour : {n} sur 100', { n: score })}"><svg viewBox="0 0 64 64"><defs><linearGradient id="dsg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#C9FF3B"/><stop offset=".6" stop-color="#7DF9C2"/><stop offset="1" stop-color="#16C6F0"/></linearGradient></defs><circle cx="32" cy="32" r="26" class="ds-t"/><circle cx="32" cy="32" r="26" class="ds-v" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - score / 100)).toFixed(1)}"/></svg><b>${score}</b></div>`;
}
// Small celebration (light particles + haptic) when something is completed.
function sparkBurst(anchor) {
  haptic('success');
  if (AURA_REDUCED) return;
  const r = anchor?.getBoundingClientRect?.() || { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  const box = document.createElement('div');
  box.className = 'np-burst';
  box.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px`;
  box.innerHTML = Array.from({ length: 14 }, (_, i) => `<i style="--a:${i * 360 / 14}deg;--d:${40 + (i % 3) * 18}px;--c:${['#C9FF3B', '#7DF9C2', '#16C6F0', '#fff'][i % 4]}"></i>`).join('');
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 900);
}
function myDayCard() {
  const p = state.profile || {};
  const plan = cpPlan();
  const rows = cpRows();
  const next = cpNext(rows);
  const t = totals();
  const left = Math.max(0, Math.round((p.dailyKcal || 0) - t.kcal));
  const done = rows.filter((r) => r.status === 'done').length;
  const changes = (state.changes || []).filter((c) => c.day === todayKey()).slice(0, 2);
  const latest = cpLatest();
  const pat = cpPattern();
  const statusTag = (s) => ({ done: [L('Enregistré'), 'ok'], skipped: [L('Non pris'), 'mute'], out: [L('Hors de chez moi'), 'warn'], pending: [L('À venir'), 'soft'] }[s]);
  const nextHtml = next
    ? `<div class="md-next"><small>${hmToMin(next.time) < nowMin() - 30 ? L('Pas encore enregistré · prévu à {t}', { t: next.time }) : L('Prochaine étape · {t}', { t: next.time })}</small>
        <b>${esc(L('{type} : {name}', { type: cpTypeLabel(next.meal), name: cpMealName(next.meal) }))}</b>
        <span class="fine">${next.meal.restaurant ? L('Repère ≈ {k} kcal · protéine + légumes + 1 portion de féculents', { k: fmt(next.meal.kcal) }) : `${fmt(next.meal.kcal)} kcal · P ${fmt(next.meal.protein)} g`}</span>
        <div class="md-next-actions">${next.meal.restaurant ? '' : `<button class="btn btn-lime" data-cp-log="${next.i}">${icon('check')} ${L('Mangé comme prévu')}</button>`}<button class="btn btn-ghost" data-cp-other="${next.i}">${icon('scan')} ${L('J’ai mangé autre chose')}</button></div></div>`
    : plan ? `<div class="md-next"><small>${L('Journée bouclée')}</small><b>${L('Tous les repas prévus sont enregistrés.')}</b><span class="fine">${L('Il vous reste environ {k} kcal aujourd’hui.', { k: fmt(left) })}</span></div>` : '';
  return `<section class="myday" aria-labelledby="myday-h">
    <div class="md-head"><h2 id="myday-h">${L('Mon jour maintenant')}</h2>${syncPillHtml()}</div>
    ${plan ? (() => { const ds = dayScore(); return `<div class="md-score">${scoreRing(ds.score)}<span><small>${L('Score du jour')}</small><b>${esc(ds.tip)}</b></span></div>`; })() : ''}
    ${plan ? `${nextHtml}
    <ol class="md-timeline">${rows.map((r) => { const [lab, tone] = statusTag(r.status); return `<li class="${r.status}"><time>${r.time}</time><span><b>${esc(cpTypeLabel(r.meal))}</b><small>${esc(cpMealName(r.meal))}</small></span><em class="md-tag ${tone}">${lab}</em></li>`; }).join('')}${hasFeature('training') && todaySession() ? `<li class="train"><time>${cpWorkoutTime()}</time><span><b>${L('Séance')}</b><small>${esc(L(todaySession().name))}</small></span><em class="md-tag ${doneOn(todayKey()) ? 'ok' : 'soft'}">${doneOn(todayKey()) ? L('Faite') : L('À venir')}</em></li>` : ''}</ol>
    <div class="fine md-sum">${L('{d}/{n} repas enregistrés · il reste environ {k} kcal', { d: done, n: rows.length, k: fmt(left) })}</div>`
    : `<div class="md-next"><small>${L('Pas encore de plan pour aujourd’hui')}</small><b>${L('Créez votre plan du jour pour que NutriPilot puisse vous guider.')}</b><div class="md-next-actions"><button class="btn btn-lime" data-cp-plan>${icon('calendar')} ${L('Créer mon plan')}</button></div></div>`}
    <div class="md-actions">${CP_ACTIONS.map(([k, ico, label]) => `<button class="md-act" data-cp-act="${k}">${icon(ico)}<span>${L(label)}</span></button>`).join('')}</div>
    ${changes.length ? `<div class="md-changes"><small>${L('Changements aujourd’hui')}</small>${changes.map((c) => `<div class="md-change ${c.undone ? 'undone' : ''}"><span class="md-badge applied">${c.undone ? L('Annulé') : L('Appliqué')} · ${new Date(c.at).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' })}</span><b>${esc(c.title)}</b>${!c.undone && latest?.id === c.id ? `<button class="link-btn" data-cp-undo="${c.id}">${L('Annuler')}</button>` : ''}</div>`).join('')}<button class="link-btn" data-cp-history>${L('Historique')}</button></div>` : ''}
    ${pat ? `<div class="md-pattern"><span class="md-badge suggest">${L('Suggestion')}</span><b>${L('Ces 3 dernières semaines, vous avez remplacé votre {meal} {n} fois. Voulez-vous une option plus pratique ?', { meal: L(pat.type).toLowerCase(), n: pat.n })}</b><small>${L('Pourquoi : d’après vos remplacements enregistrés dans l’app. Rien n’est déduit sur votre santé.')}</small><div class="md-next-actions">${pat.slot >= 0 ? `<button class="btn btn-ghost" data-cp-swap="${pat.slot}">${L('Voir des options')}</button>` : ''}<button class="link-btn" data-cp-dismiss="${esc(pat.type)}">${L('Pas maintenant')}</button><button class="link-btn" data-cp-patterns-off>${L('Désactiver ces suggestions')}</button></div></div>` : ''}
  </section>`;
}

const CP_CHIPS = [
  ['late', 'clock', 'Je suis en retard'],
  ['out', 'fork', 'Je mange dehors'],
  ['train', 'dumbbell', 'Ma séance change d’heure'],
  ['skip', 'minus', 'J’ai sauté un repas'],
  ['missing', 'cart', 'Il me manque un ingrédient'],
  ['hungry', 'flame', 'J’ai plus faim que prévu'],
  ['lessHungry', 'moon', 'Je n’ai pas faim'],
];
function cpOpen(preset = []) {
  if (!cpPlan()) { state.weekPlan = buildLocalWeek(); state.planSource = 'local'; saveState(); }
  modal = { type: 'copilot', step: 'ask', text: '', picked: preset, events: [] };
  renderModal();
}
function cpContextHtml() {
  const p = state.profile || {};
  const rows = cpRows();
  const t = totals();
  const session = hasFeature('training') ? todaySession() : null;
  return `<div class="cp-context"><small>${L('Ce que NutriPilot prend en compte')}</small><ul>
    <li>${L('Plan d’aujourd’hui : {n} repas, objectif {k} kcal', { n: rows.length, k: fmt(p.dailyKcal) })}</li>
    <li>${L('Déjà enregistré : {d} repas, {k} kcal', { d: rows.filter((r) => r.status === 'done').length, k: fmt(t.kcal) })}</li>
    ${session ? `<li>${L('Séance prévue à {t} : {name}', { t: cpWorkoutTime(), name: L(session.name) })}</li>` : ''}
    ${p.allergies ? `<li>${L('Allergies et exclusions respectées : {a}', { a: esc(p.allergies) })}</li>` : ''}
  </ul></div>`;
}
function copilotSheet() {
  const m = modal;
  if (m.step === 'ask') {
    return `<div class="sheet-head"><div><span class="tag">${L('Copilote')}</span><h2>${L('Qu’est-ce qui a changé ?')}</h2><div class="fine">${L('Rien n’est modifié avant votre choix.')}</div></div><button class="icon-btn" data-close aria-label="${L('Fermer')}">×</button></div>
      ${cpContextHtml()}
      <div class="cp-chips">${CP_CHIPS.map(([k, ico, label]) => `<button class="cp-chip ${m.picked.includes(k) ? 'on' : ''}" data-cp-chip="${k}" aria-pressed="${m.picked.includes(k)}">${icon(ico)} ${L(label)}</button>`).join('')}</div>
      <div class="field"><label for="cp-text">${L('Ou racontez avec vos mots')}</label><textarea class="textarea compact" id="cp-text" maxlength="500" placeholder="${L('Ex. Je suis parti en retard, je déjeune au restaurant et je ne m’entraîne que ce soir.')}">${esc(m.text || '')}</textarea></div>
      <button class="btn btn-primary btn-wide" data-cp-go>${L('Voir mes options')}</button>`;
  }
  const rows = cpRows();
  const miss = cpMissing(m.events);
  const slotPick = (ev) => `<div class="cp-q"><b>${ev === 'out' ? L('Quel repas sera hors de chez vous ?') : ev === 'skip' ? L('Quel repas n’a pas été pris ?') : L('Pour quel repas manque-t-il un ingrédient ?')}</b><div class="cp-chips">${rows.filter((r) => r.status !== 'done').map((r) => `<button class="cp-chip ${m.events.find((e) => e.type === ev)?.slotIndex === r.i ? 'on' : ''}" data-cp-slot="${ev}:${r.i}">${esc(cpTypeLabel(r.meal))} · ${r.time}</button>`).join('')}</div></div>`;
  const ev = (type) => m.events.find((e) => e.type === type);
  const questions = [
    ...['out', 'skip', 'missing'].filter((k) => ev(k)).map(slotPick),
    ev('train') ? `<div class="cp-q"><b>${L('À quelle heure sera la séance ?')}</b><div class="cp-chips">${['07:00', '12:00', '17:00', '18:30', '19:30', '20:30'].map((tm) => `<button class="cp-chip ${ev('train').time === tm ? 'on' : ''}" data-cp-train="${tm}">${tm}</button>`).join('')}</div></div>` : '',
    ev('late') ? `<div class="cp-q"><b>${L('Combien de retard ?')}</b><div class="cp-chips">${[30, 60, 90, 120].map((n) => `<button class="cp-chip ${ev('late').minutes === n ? 'on' : ''}" data-cp-late="${n}">${{ 30: '30 min', 60: '1 h', 90: '1 h 30', 120: '2 h' }[n]}</button>`).join('')}</div></div>` : '',
  ].join('');
  const options = miss.length ? [] : cpOptions(m.events);
  m.options = options;
  return `<div class="sheet-head"><div><span class="tag">${L('Copilote')}</span><h2>${L('Vos options')}</h2><div class="fine">${L('Suggestions : rien n’est encore modifié.')}</div></div><button class="icon-btn" data-close aria-label="${L('Fermer')}">×</button></div>
    ${m.clinical ? `<div class="cp-clinical">${icon('info')}<span><b>${L('Cela mérite l’avis d’un professionnel de santé.')}</b><small>${L('NutriPilot ne pose pas de diagnostic. Préparez un résumé à lui envoyer ; en cas d’urgence, appelez les services d’urgence.')}</small></span></div>` : ''}
    ${questions ? `<div class="cp-questions">${miss.length ? `<small class="cp-missing">${L('Il manque une information pour vous proposer quelque chose de précis :')}</small>` : ''}${questions}</div>` : ''}
    ${options.map((o, k) => `<article class="cp-option"><span class="md-badge suggest">${L('Suggestion')}</span><h3>${esc(o.title)}</h3>${o.why.filter(Boolean).map((w) => `<p class="cp-why">${esc(w)}</p>`).join('')}
      ${o.lines.length ? `<ul class="cp-diff">${o.lines.map(([ico, txt]) => `<li>${icon(ico === 'swap' ? 'swap' : ico === 'clock' ? 'clock' : ico === 'dumbbell' ? 'dumbbell' : ico === 'bell' ? 'bell' : ico === 'target' ? 'target' : ico === 'plus' ? 'plus' : 'flag')}<span>${esc(txt)}</span></li>`).join('')}</ul>` : `<p class="fine">${L('Aucun changement nécessaire dans votre plan.')}</p>`}
      ${o.restaurant ? `<button class="link-btn" data-cp-menu>${L('J’ai la carte : choisir mon plat avec le mode restaurant →')}</button><p class="fine">${L('NutriPilot ne peut pas garantir l’absence d’allergènes d’après une carte ou une photo : demandez toujours au restaurant.')}</p>` : ''}
      <button class="btn ${k ? 'btn-ghost' : 'btn-primary'} btn-wide" data-cp-apply="${k}" ${o.lines.length ? '' : 'disabled'}>${L('Appliquer cette option')}</button></article>`).join('')}
    ${!miss.length && !options.length ? `<p class="fine">${L('Aucune option pour le moment.')}</p>` : ''}
    <div class="cp-foot"><button class="link-btn" data-cp-back>← ${L('Modifier')}</button><button class="link-btn" data-cp-pro>${icon('share')} ${L('Préparer un message pour mon professionnel')}</button></div>`;
}
function cpHistorySheet() {
  const list = (state.changes || []).slice(0, 30);
  return `<div class="sheet-head"><div><span class="tag">${L('Copilote')}</span><h2>${L('Historique des changements')}</h2></div><button class="icon-btn" data-close aria-label="${L('Fermer')}">×</button></div>
    ${list.length ? `<div class="cp-hist">${list.map((c) => `<article class="md-change ${c.undone ? 'undone' : ''}"><span class="md-badge applied">${c.undone ? L('Annulé') : L('Appliqué')} · ${new Date(c.at).toLocaleString(locale(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span><b>${esc(c.title)}</b>${c.note ? `<small class="md-user">${L('Votre message')} : « ${esc(c.note)} »</small>` : ''}${(c.lines || []).length ? `<ul class="cp-diff small">${c.lines.slice(0, 5).map(([, txt]) => `<li><span>${esc(txt)}</span></li>`).join('')}</ul>` : ''}${!c.undone && cpLatest(c.day)?.id === c.id && c.day === todayKey() ? `<button class="link-btn" data-cp-undo="${c.id}">${L('Annuler')}</button>` : ''}</article>`).join('')}</div>` : `<p class="fine">${L('Aucun changement pour le moment.')}</p>`}`;
}
// A summary the person sends to their dietitian/doctor. Clearly separates their own records from automatic suggestions.
function cpProSummary() {
  const p = state.profile || {};
  const since = addDays(-7);
  const lines = [];
  lines.push(`NutriPilot — ${L('Résumé pour mon professionnel')} (${new Date().toLocaleDateString(locale())})`);
  lines.push('');
  lines.push(`${L('Objectifs saisis dans l’app')} : ${fmt(p.dailyKcal)} kcal · ${fmt(p.protein)} g ${L('protéines')}${p.allergies ? ` · ${L('Allergies')} : ${p.allergies}` : ''}`);
  lines.push('');
  lines.push(`[${L('Mes enregistrements')}]`);
  const days = [...new Set(state.meals.filter((m) => m.day >= since).map((m) => m.day))].sort();
  days.forEach((d) => { const ms = state.meals.filter((m) => m.day === d); lines.push(`${d} : ${ms.map((m) => `${L(m.type || '')} ${m.title} (${Math.round(m.total?.kcal || 0)} kcal)`).join(' ; ')}`); });
  if (!days.length) lines.push(L('Aucun repas enregistré cette semaine.'));
  const notes = (state.changes || []).filter((c) => c.day >= since && c.note).map((c) => `${c.day} : « ${c.note} »`);
  if (notes.length) { lines.push(''); lines.push(`[${L('Ce que j’ai signalé')}]`); lines.push(...notes); }
  const applied = (state.changes || []).filter((c) => c.day >= since);
  if (applied.length) { lines.push(''); lines.push(`[${L('Ajustements suggérés automatiquement par NutriPilot')}]`); applied.forEach((c) => lines.push(`${c.day} : ${c.title}${c.undone ? ` (${L('annulé')})` : ''}`)); }
  lines.push('');
  lines.push(L('Ces ajustements sont des suggestions de l’application, pas une prescription. Merci de me dire ce qui est adapté pour moi.'));
  return lines.join('\n');
}
async function cpShareText(text) {
  const SH = capPlugin('Share');
  try {
    if (SH) { await SH.share({ title: 'NutriPilot', text }); return; }
    if (navigator.share) { await navigator.share({ title: 'NutriPilot', text }); return; }
  } catch (error) { if (/cancel|abort/i.test(String(error?.message || error?.name || ''))) return; }
  try { await navigator.clipboard.writeText(text); toast(L('Résumé copié : collez-le dans votre message ✓')); } catch { saveFile(text, 'nutripilot-resume.txt', 'text/plain'); }
}
async function cpAnalyze() {
  const m = modal;
  const text = ($('#cp-text')?.value || '').trim();
  m.text = text;
  let events = m.picked.map((type) => ({ type, ...(type === 'late' ? { minutes: 60 } : {}) }));
  if (text) {
    events = cpMergeEvents([...events, ...cpParse(text)]);
    m.clinical = cpClinical(text);
    // The server understands free text better; the local reading is kept if it's unreachable.
    if (state.premium && state.aiConsent === true && navigator.onLine) {
      const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 9000);
      try {
        const res = await apiFetch('/api/copilot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl.signal, body: JSON.stringify({ text, meals: cpRows().map((r) => ({ type: r.meal.type, time: r.time, status: r.status })) }) });
        const data = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(data.events)) events = cpMergeEvents([...events, ...data.events.filter((e) => CP_CHIPS.some(([k]) => k === e.type))]);
        if (data.clinical) m.clinical = true;
      } catch { /* offline: local reading */ } finally { clearTimeout(timer); }
    }
  }
  if (!events.length && !m.clinical) return toast(L('Choisissez ce qui a changé ou écrivez-le.'));
  events.forEach((e) => { if (['out', 'skip', 'missing'].includes(e.type)) e.slotIndex = cpSlotIndex(e.slot); });
  m.events = events;
  m.step = 'options';
  track('CopilotAsk', { source: events.map((e) => e.type).join(',') });
  renderModal();
}
function copilotClick(button, root) {
  const d = button.dataset;
  if (d.cpChip) { const k = d.cpChip; modal.text = $('#cp-text')?.value || modal.text; modal.picked = modal.picked.includes(k) ? modal.picked.filter((x) => x !== k) : [...modal.picked.filter((x) => !(k === 'hungry' && x === 'lessHungry') && !(k === 'lessHungry' && x === 'hungry')), k]; renderModal(); return true; }
  if (d.cpGo !== undefined) { cpAnalyze(); return true; }
  if (d.cpBack !== undefined) { modal.step = 'ask'; renderModal(); return true; }
  if (d.cpSlot) { const [ev, i] = d.cpSlot.split(':'); const e = modal.events.find((x) => x.type === ev); if (e) e.slotIndex = Number(i); renderModal(); return true; }
  if (d.cpTrain) { const e = modal.events.find((x) => x.type === 'train'); if (e) e.time = d.cpTrain; renderModal(); return true; }
  if (d.cpLate) { const e = modal.events.find((x) => x.type === 'late'); if (e) e.minutes = Number(d.cpLate); renderModal(); return true; }
  if (d.cpApply !== undefined) {
    if (button.disabled) return true;
    button.disabled = true;
    const o = modal.options?.[Number(d.cpApply)];
    const note = modal.text || '';
    modal = null; root?.remove();
    if (o) cpApply(o, { note });
    return true;
  }
  if (d.cpMenu !== undefined) { modal = null; root?.remove(); nav('planner'); setTimeout(() => $('[data-planner-mode="restaurant"]')?.click(), 0); return true; }
  if (d.cpPro !== undefined) { cpShareText(cpProSummary()); track('CopilotProSummary', {}); return true; }
  return false;
}
function myDayClick(button) {
  const d = button.dataset;
  if (d.cpAct) {
    const k = d.cpAct;
    if (k === 'changed') { cpOpen([]); return true; }
    if (k === 'out') { cpOpen(['out']); return true; }
    if (k === 'fridge') { nav('planner'); setTimeout(() => $('[data-planner-mode="fridge"]')?.click(), 0); return true; }
    if (k === 'swap') { const nx = cpNext(); if (!nx) { toast(L('Aucun repas à venir aujourd’hui.')); return true; } modal = { type: 'plan-swap', dayIndex: cpDayIndex(), mealIndex: nx.i }; renderModal(); return true; }
    if (k === 'log') { const nx = cpNext(); if (nx) cpPending = { slot: nx.i, since: Date.now() }; openAdd(state.meals.length >= 2 ? 'recent' : 'photo'); return true; }
  }
  if (d.cpLog !== undefined) { cpLogPlanned(Number(d.cpLog)); return true; }
  if (d.cpOther !== undefined) { cpPending = { slot: Number(d.cpOther), since: Date.now() }; openAdd('photo'); return true; }
  if (d.cpSwap !== undefined) { modal = { type: 'plan-swap', dayIndex: cpDayIndex(), mealIndex: Number(d.cpSwap) }; renderModal(); return true; }
  if (d.cpUndo) { cpUndo(d.cpUndo); return true; }
  if (d.cpHistory !== undefined) { modal = { type: 'cp-history' }; renderModal(); return true; }
  if (d.cpPlan !== undefined) { state.weekPlan = buildLocalWeek(); state.planSource = 'local'; saveState(); render(); toast(L('Votre plan du jour est prêt ✓')); return true; }
  if (d.cpDismiss) { state.cpDismissed = { ...(state.cpDismissed || {}), [d.cpDismiss]: Date.now() }; saveState(); render(); return true; }
  if (d.cpPatternsOff !== undefined) { state.cpPatternsOff = true; saveState(); render(); toast(L('Suggestions désactivées. Réactivez-les dans Réglages.')); return true; }
  return false;
}

function hubScreen() {
  const p = state.profile || {};
  const tracks = t('tracks');
  const hasPlan = state.onboarding && p.dailyKcal;
  const proj = hasPlan ? projection(p) : null;
  const plans = Billing.plans();
  const explore = [['recipes', 'fork', 'Recettes par objectif', '{n} recettes', ALL_RECIPES.length], ['training', 'dumbbell', 'Exercices animés', '{n} mouvements', Object.keys(EXERCISES).length], ['menopause', 'flower', 'Espace Ménopause 40+', 'Journal, programme, séances', 0], ['guides', 'book', 'Cours', 'Première leçon offerte', 0]];
  const fFirst = { recipes: 'recipes', training: 'training', meno: 'menopause' }[currentFocus()];
  if (fFirst) explore.sort((a, b) => (b[0] === fFirst) - (a[0] === fFirst));
  const trialBox = '';
  return `<div class="mobile-app hub">
    <header class="app-head"><div class="app-head-row"><button class="icon-btn menu-btn" data-drawer aria-label="${L('Menu')}">${icon('menu')}</button>${logo()}<div class="head-actions"><button class="icon-btn" data-go="lang" aria-label="Language">${LANGS.find((x) => x[0] === lang())?.[2] || '🌐'}</button></div></div></header>
    <div class="screen">
      ${trialBox}
      <section class="hub-hero">
        <span class="revo-kicker">${icon('star')}${L('Révolutionnaire')}</span>
        <small>${esc(t('hello'))}${p.name ? ` ${esc(p.name)}` : ''} 👋</small>
        ${FOCI[currentFocus()] ? `<span class="hello-kicker ${FOCI[currentFocus()].tone}">${icon(FOCI[currentFocus()].ico)} ${L(FOCI[currentFocus()].kicker)}</span>` : ''}
        <h1>${L(FOCI[currentFocus()]?.title || 'Nutrition, entraînement et bien-être, dans une seule app.')}</h1>
        <div class="hh-stats"><div><b>${ALL_RECIPES.length}</b><span>${L('recettes')}</span></div><div><b>${Object.keys(EXERCISES).length}</b><span>${L('exercices')}</span></div><div><b>${allPrograms().filter((x) => !x.custom).length}</b><span>${L('programmes')}</span></div><div><b>${LANGS.length}</b><span>${L('langues')}</span></div></div>
        ${!state.premium && freeScansLeft() > 0 ? `<button class="btn btn-glass btn-wide" data-open-add>${icon('scan')} ${L('Analyser mon repas gratuitement')}<em class="fs-count">${L('{n} offertes', { n: freeScansLeft() })}</em></button>` : ''}
        ${FOCI[currentFocus()] ? `<button class="btn btn-lime btn-wide" data-module-buy="${FOCI[currentFocus()].tier}">${L('Voir les formules')}</button><button class="link-btn hub-all" data-go="plans">${L('Voir les formules')}</button>` : `<button class="btn btn-lime btn-wide" data-go="plans">${L('Voir les formules')}</button>`}
      </section>
      ${hasPlan ? `<button class="today-card hub-plan" data-go="plan"><small>${esc(t('myProgram'))}</small><b>${fmt(p.dailyKcal)} kcal · ${p.protein} g prot.</b>${proj ? `<span>${kgFmt(p.weight)} → ${kgFmt(p.target)} kg · ${esc(dateFr(proj.end))}</span>` : ''}<em>${esc(t('seePlan'))} →</em></button>` : ''}

      <div class="hub-me">
        <button data-open-profile>${icon('user')}<span><small>${L('Mon profil')}</small><b>${esc(p.name || L('Compléter'))}${p.track ? ` · ${esc(L((PF_TRACKS.find((x) => x[0] === p.track) || [])[1] || ''))}` : ''}</b></span>${icon('chevron')}</button>
        <button data-open-goal>${icon('scale')}<span><small>${L('Objectif de poids')}</small><b>${goalSet() ? `${fmt(lastWeight(), 1)} → ${fmt(p.target, 1)} kg` : L('Définir mon objectif')}</b></span>${icon('chevron')}</button>
      </div>
      <div class="section-label"><h3>${L('Tout ce qui est inclus')}</h3></div>
      <p class="screen-sub guide-sub">${L('Un plan complet et individuel pour votre objectif — pas une simple appli de calories.')}</p>
      <div class="mod-cards">${modsForMe().map((m) => modCard(m, hasModule(m.id))).join('')}</div>
      <button class="plans-link" data-go="plans">${icon('star')}<span><b>${L('Nos formules')}</b><small>${L('Modules, combinaisons et Kit complet')}</small></span>${icon('chevron')}</button>

      <div class="section-label"><h3>${esc(t('hubQuiz'))}</h3></div>
      <p class="screen-sub guide-sub">${esc(t('hubQuizSub'))}</p>
      <div class="track-list light">${TRACKS.map(([id, , , emoji], i) => `<button class="track-card" data-track="${id}"><span class="track-emoji">${emoji}</span><span><b>${esc(tracks[i][0])}</b><small>${esc(tracks[i][1])}</small></span><span class="guide-arrow">→</span></button>`).join('')}</div>

      <div class="section-label"><h3>${esc(t('hubExplore'))}</h3></div>
      <div class="explore-big">${explore.map(([r, ico, title, sub, n]) => `<button class="xb-card xb-${r}" data-go="${r}">${r === 'training' ? exAnim('squat', 'sm') : `<span class="xb-ico">${icon(ico)}</span>`}<b>${L(title)}</b><small>${L(sub, { n })}</small></button>`).join('')}</div>

      <button class="guide-card hub-link" data-go="tour"><span class="guide-check">${icon('star')}</span><span><b>${esc(t('hubTour'))}</b><small>${esc(t('hubTourSub'))}</small></span><span class="guide-arrow">→</span></button>
      <button class="guide-card hub-link" data-go="support"><span class="guide-check">${icon('help')}</span><span><b>${esc(t('hubSupport'))}</b><small>${esc(t('hubSupportSub'))}</small></span><span class="guide-arrow">→</span></button>
      ${loginLink(undefined, 'link-btn center-link')}
    </div>
    ${bottom('app')}
  </div>`;
}

// 3D depth on showcases and the member card: follows the finger / mouse, and the phone's tilt when allowed.
let tiltBound = false;
function bindTilt() {
  if (tiltBound || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  tiltBound = true;
  const apply = (x, y) => document.querySelectorAll('[data-tilt]').forEach((el) => { el.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`); el.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`); });
  window.addEventListener('pointermove', (e) => {
    const el = e.target.closest?.('[data-tilt]'); if (!el) return;
    const r = el.getBoundingClientRect();
    apply(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
  }, { passive: true });
  window.addEventListener('pointerleave', () => apply(0, 0));
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return;
    apply(Math.max(-1, Math.min(1, e.gamma / 30)), Math.max(-1, Math.min(1, (e.beta - 45) / 30)));
  }, { passive: true });
}
function runCountUps() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count || 0);
    if (!target) return;
    const start = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - start) / 900);
      const dec = (String(el.dataset.count).split('.')[1] || '').length;
      el.textContent = fmt(target * (1 - Math.pow(1 - k, 3)), Math.min(1, dec));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

// Small celebration for real achievements (session done, goal saved, programme finished…).
function celebrate() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const box = document.createElement('div');
  box.className = 'confetti';
  box.setAttribute('aria-hidden', 'true');
  const colors = ['#d7ff6a', '#102419', '#3546a6', '#a2456f', '#b5532f', '#0b6e6e', '#9a6a00'];
  box.innerHTML = Array.from({ length: 26 }, (_, i) => `<i style="--x:${Math.round((Math.random() - 0.5) * 340)}px;--y:${Math.round(-180 - Math.random() * 260)}px;--r:${Math.round(Math.random() * 720 - 360)}deg;--d:${(0.9 + Math.random() * 0.7).toFixed(2)}s;background:${colors[i % colors.length]}"></i>`).join('');
  document.body.appendChild(box);
  haptic('success');
  setTimeout(() => box.remove(), 1800);
}

// ---- Reminders --------------------------------------------------------------
const DEFAULT_REMINDERS = { water: { on: false, every: 120, from: 8, to: 21 }, meals: { on: false, times: ['08:00', '12:30', '19:30'] }, workout: { on: false, time: '18:00' }, weigh: { on: false, day: 1, time: '08:00' } };
function reminders() {
  return deepMerge(clone(DEFAULT_REMINDERS), state.reminders || {});
}

function remindersSheet() {
  const r = reminders();
  const hours = Array.from({ length: 24 }, (_, h) => h);
  const opt = (value, current, label) => `<option value="${value}" ${String(value) === String(current) ? 'selected' : ''}>${label}</option>`;
  const perm = 'Notification' in window ? Notification.permission : 'unsupported';
  return `<div class="sheet-head"><div><span class="tag">${L('Rappels')}</span><h2>${L('Restez sur la bonne voie')}</h2></div><button class="icon-btn" data-close>×</button></div>
    <div class="rem-list">
      <label class="rem-row"><span>${icon('drop')}<b>${L('Boire de l’eau')}</b><small>${L('Un rappel régulier pendant la journée')}</small></span><input type="checkbox" class="switch" data-rem="water" ${r.water.on ? 'checked' : ''}></label>
      <div class="rem-detail"><label>${L('Toutes les')}<select data-rem-field="water.every">${[60, 90, 120, 180].map((m) => opt(m, r.water.every, m % 60 ? `${Math.floor(m / 60)} h ${m % 60}` : `${m / 60} h`)).join('')}</select></label>
        <label>${L('De')}<select data-rem-field="water.from">${hours.map((h) => opt(h, r.water.from, `${h} h`)).join('')}</select></label>
        <label>${L('À')}<select data-rem-field="water.to">${hours.map((h) => opt(h, r.water.to, `${h} h`)).join('')}</select></label>
        <label>${L('Objectif')}<select data-water-goal>${[1500, 1750, 2000, 2250, 2500, 3000].map((ml) => opt(ml, waterGoal(), `${fmt(ml)} ml`)).join('')}</select></label></div>
      <label class="rem-row"><span>${icon('fork')}<b>${L('Repas')}</b><small>${L('Petit-déjeuner, déjeuner et dîner')}</small></span><input type="checkbox" class="switch" data-rem="meals" ${r.meals.on ? 'checked' : ''}></label>
      <div class="rem-detail">${r.meals.times.map((tm, i) => `<label>${L(['Petit-déjeuner', 'Déjeuner', 'Dîner'][i])}<input type="time" value="${tm}" data-rem-field="meals.times.${i}"></label>`).join('')}</div>
      <label class="rem-row"><span>${icon('dumbbell')}<b>${L('Séance du jour')}</b><small>${L('Les jours d’entraînement de votre agenda')}</small></span><input type="checkbox" class="switch" data-rem="workout" ${r.workout.on ? 'checked' : ''}></label>
      <div class="rem-detail"><label>${L('Heure')}<input type="time" value="${r.workout.time}" data-rem-field="workout.time"></label></div>
      <label class="rem-row"><span>${icon('scale')}<b>${L('Pesée de la semaine')}</b><small>${L('Pour suivre la tendance')}</small></span><input type="checkbox" class="switch" data-rem="weigh" ${r.weigh.on ? 'checked' : ''}></label>
    </div>
    ${perm === 'denied' ? `<div class="warn">${L('Les notifications sont bloquées dans les réglages de votre appareil. Autorisez-les pour recevoir les rappels.')}</div>` : ''}
    <p class="fine">${L('Dans l’application iPhone et Android, les rappels arrivent même application fermée. Sur le web, ils s’affichent quand NutriPilot est ouvert ou installé sur l’écran d’accueil.')}</p>
    <button class="btn btn-primary btn-wide" data-save-reminders>${L('Enregistrer mes rappels')}</button>`;
}

function setPath(obj, pathStr, value) {
  const parts = pathStr.split('.');
  let cur = obj;
  parts.slice(0, -1).forEach((k) => { cur[k] = cur[k] ?? {}; cur = cur[k]; });
  cur[parts.at(-1)] = value;
}

async function saveReminders(root) {
  const r = reminders();
  $$('[data-rem]', root).forEach((el) => { r[el.dataset.rem].on = el.checked; });
  $$('[data-rem-field]', root).forEach((el) => {
    const v = el.type === 'time' ? el.value : Number(el.value);
    setPath(r, el.dataset.remField, v);
  });
  const goal = $('[data-water-goal]', root);
  if (goal) state.waterGoal = Number(goal.value);
  state.reminders = r;
  saveState();
  const anyOn = Object.values(r).some((x) => x.on);
  if (window.NutriPilotNative?.scheduleReminders) {
    await window.NutriPilotNative.scheduleReminders(r).catch(() => {});
  } else if (anyOn && 'Notification' in window && Notification.permission === 'default') {
    try { await Notification.requestPermission(); } catch {}
  }
  track('RemindersSaved', { water: r.water.on, meals: r.meals.on, workout: r.workout.on });
  haptic('success');
  toast(L('Rappels enregistrés ✓'));
}

let reminderTimer = null;
function startReminderLoop() {
  clearInterval(reminderTimer);
  reminderTimer = setInterval(checkReminders, 60 * 1000);
}
function notify(title, body) {
  const show = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker?.ready.then((reg) => reg.showNotification(title, { body, icon: '/icon-192.png', badge: '/icon-192.png', tag: title })).catch(() => toast(body));
    } else {
      toast(body);
    }
  };
  show();
}
function checkReminders() {
  if (!state.premium || window.NutriPilotNative?.scheduleReminders) return;
  const r = reminders();
  const now = new Date();
  const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const fired = state.remindersFired || {};
  const once = (key, fn) => { if (fired[key]) return; fired[key] = Date.now(); fn(); };
  const today = todayKey();
  if (r.water.on && now.getHours() >= r.water.from && now.getHours() < r.water.to && waterToday() < waterGoal()) {
    const slot = Math.floor((now.getHours() * 60 + now.getMinutes()) / r.water.every);
    once(`w-${today}-${slot}`, () => notify('NutriPilot', L('Un verre d’eau ? Il vous reste {n} ml pour aujourd’hui.', { n: fmt(waterGoal() - waterToday()) })));
  }
  const plan = cpPlan();
  if (r.meals.on) (plan?.meals?.length ? plan.meals.map((m, i) => [m.type, cpTimes()[i], i]) : r.meals.times.map((tm, i) => [['Petit-déjeuner', 'Déjeuner', 'Dîner'][i], tm, i])).forEach(([type, tm, i]) => { if (tm === hm && cpStatus(i) === 'pending') once(`m-${today}-${i}`, () => notify('NutriPilot', L('C’est l’heure de votre {meal}. Scannez-le en une photo.', { meal: L(type).toLowerCase() }))); });
  if (r.workout.on && cpWorkoutTime() === hm && todaySession()) once(`t-${today}`, () => notify('NutriPilot', L('Séance du jour : {name}. On y va ?', { name: L(todaySession().name) })));
  if (r.weigh.on && now.getDay() === r.weigh.day && r.weigh.time === hm) once(`p-${today}`, () => notify('NutriPilot', L('C’est le jour de la pesée. Notez votre poids pour suivre la tendance.')));
  state.remindersFired = Object.fromEntries(Object.entries(fired).filter(([, ts]) => Date.now() - ts < 2 * 86400000));
  saveState(false);
}




function weeklyReviewHtml() {
  const review = state.weekReview || {};
  return `<div class="day-card weekly-review"><h3>${esc(review.headline || 'Votre semaine')}</h3>${review.wins?.length ? `<div class="review-block"><b>${L('Ce qui fonctionne')}</b>${review.wins.map((x) => `<p>✓ ${esc(x)}</p>`).join('')}</div>` : ''}${review.focus?.length ? `<div class="review-block"><b>${L('Priorités')}</b>${review.focus.map((x) => `<p>→ ${esc(x)}</p>`).join('')}</div>` : ''}${review.nextWeek ? `<div class="insight"><strong>${L('Prochaine semaine')}</strong>${esc(review.nextWeek)}</div>` : ''}</div>`;
}

function program() {
  const p = state.profile;
  const delta = Math.abs(Number(lastWeight()) - Number(p.target));
  const weeks = p.goal === 'lose' && p.speed ? Math.max(1, Math.round(delta / Number(p.speed))) : null;
  const shopping = planShopping();
  return `<div class="mobile-app">
    ${appHeader('Nutrition')}
    <div class="screen">
      ${programTabs('program')}

      <div class="today-card nut-goal-card">
        <div class="today-top"><div><small>${L('Poids actuel → objectif')}</small><h2>${goalSet() ? `${fmt(lastWeight(), 1)} kg → ${fmt(p.target, 1)} kg` : L('Définir mon objectif')}</h2></div><button class="pill dark-pill" data-open-goal>${goalSet() ? (weeks ? L('≈ {n} semaines', { n: weeks }) : L('Modifier')) : L('Définir')}</button></div>
        <div class="macro-row-4 program-macros"><div><small>${L('Calories')}</small><b>${fmt(p.dailyKcal)}</b></div><div><small>${L('Protéines')}</small><b>${p.protein} g</b></div><div><small>${L('Fibres')}</small><b>${p.fiber} g</b></div><div><small>${L('Repas')}</small><b>${p.mealsPerDay}/j</b></div></div>
        ${Math.abs(Number(lastWeight()) - Number(p.weight || lastWeight())) >= 1.5 ? `<div class="recalibrate-box"><span>${L('Votre poids a évolué depuis le dernier calcul.')}</span><button class="link-btn" data-recalibrate>${L('Actualiser mes repères →')}</button></div>` : ''}
      </div>

      <div class="section-label"><h3>${L('Votre système')}</h3></div>
      <div class="roadmap-grid"><div><span>1</span><b>${L('Mesurer')}</b><small>${L('Scanner et corriger')}</small></div><div><span>2</span><b>${L('Décider')}</b><small>${L('Adapter le prochain repas')}</small></div><div><span>3</span><b>${L('Répéter')}</b><small>${L('Suivre la tendance')}</small></div></div>

      <div class="section-label"><h3>${L('Plan alimentaire 7 jours')}</h3><span class="fine">${L('adapté à vos préférences')}</span></div>
      ${state.weekPlan?.length ? weekPlanHtml() : `<div class="day-card"><h3>${L('Créez votre première semaine.')}</h3><p class="screen-sub">${L('NutriPilot utilise votre objectif, calories, protéines, préférences, allergies, budget et temps de cuisine.')}</p><button class="btn btn-primary btn-wide" data-generate-week>${L('Créer mon plan 7 jours →')}</button></div>`}
      ${state.weekPlan?.length ? `<button class="btn btn-ghost btn-wide" data-generate-week>${L('↻ Régénérer ma semaine')}</button>` : ''}

      <div class="section-label"><h3>${L('Recettes NutriPilot')}</h3><button class="link-btn" data-go="recipes">${L('Voir tout →')}</button></div>
      <div class="recipe-strip">${curatedRecipes.slice(0, 4).map(recipeMiniCard).join('')}</div>


      <div class="section-label"><h3>${L('Bilan hebdomadaire')}</h3><span class="fine">${L('vos données → 3 priorités')}</span></div>
      ${state.weekReview ? weeklyReviewHtml() : `<button class="btn btn-ghost btn-wide" data-week-review>${L('Analyser mes 7 derniers jours →')}</button>`}
    </div>
    ${bottom('program')}
  </div>`;
}

// ---- Guides ----------------------------------------------------------------
const GUIDE_COLLECTIONS = [
  {
    id: 'menopause', tier: 'nutrition', level: 'Cours',
    title: 'Ménopause & minceur',
    sub: 'Comprendre ce qui change après 40 ans et adapter votre assiette.',
    guides: [
      {
        id: 'meno-changes', title: 'Pourquoi le ventre change à la (pré)ménopause', time: '4 min',
        intro: 'La baisse progressive des œstrogènes modifie la façon dont le corps stocke les graisses : elles se placent plus volontiers autour de la taille. Ce n’est ni un manque de volonté ni une fatalité.',
        points: [
          'Le métabolisme de base baisse un peu avec l’âge, surtout parce que l’on perd du muscle.',
          'Le sommeil plus léger et les bouffées de chaleur augmentent souvent la fatigue… et les envies de sucré.',
          'Les mêmes habitudes qu’à 30 ans peuvent donc faire prendre du poids aujourd’hui : il faut ajuster, pas se priver.',
        ],
        action: 'Gardez votre repère calorique NutriPilot et visez la protéine à chaque repas : c’est le levier n°1 après 40 ans.',
      },
      {
        id: 'meno-protein', title: 'Protéines et muscle : votre meilleur allié', time: '3 min',
        intro: 'Préserver le muscle aide à garder un métabolisme actif, une silhouette tonique et des os solides.',
        points: [
          'Répartissez les protéines sur la journée : œufs, skyr ou fromage blanc le matin, poisson, volaille, légumineuses ou tofu ensuite.',
          'Associez-les à une activité de renforcement 2 à 3 fois par semaine (marche rapide, pilates, poids du corps, salle).',
          'Une assiette riche en protéines et en fibres cale plus longtemps et limite le grignotage.',
        ],
        action: 'Regardez votre jauge « Protéines » sur l’écran Aujourd’hui et complétez-la au dîner si besoin.',
      },
      {
        id: 'meno-sleep', title: 'Sommeil, bouffées de chaleur et fringales du soir', time: '3 min',
        intro: 'Une mauvaise nuit augmente la faim le lendemain. Quelques ajustements peuvent aider.',
        points: [
          'Chez certaines femmes, l’alcool, la caféine en fin de journée et les plats très épicés accentuent les bouffées de chaleur : observez ce qui vous concerne.',
          'Un dîner complet (protéines + légumes + féculents en portion adaptée) évite les réveils affamés.',
          'Une chambre fraîche et des horaires réguliers favorisent un sommeil plus réparateur.',
        ],
        action: 'Notez votre sommeil dans le check-in du jour : le coach en tiendra compte.',
      },
      {
        id: 'meno-bones', title: 'Calcium, vitamine D et os solides', time: '3 min',
        intro: 'Après la ménopause, la densité osseuse diminue plus vite. L’alimentation et le mouvement participent à la protéger.',
        points: [
          'Sources de calcium : produits laitiers, sardines avec arêtes, amandes, certaines eaux minérales riches en calcium, légumes verts.',
          'La vitamine D vient surtout du soleil et de quelques aliments (poissons gras, œufs). Votre médecin peut vérifier votre taux.',
          'Les activités en charge (marche, renforcement) stimulent l’os.',
        ],
        action: 'Ajoutez une portion de produit laitier ou une alternative enrichie à l’un de vos repas.',
      },
      {
        id: 'meno-doctor', title: 'Quand en parler à un professionnel', time: '2 min',
        intro: 'NutriPilot vous aide au quotidien, mais ne remplace pas un suivi médical.',
        points: [
          'Consultez si les symptômes (bouffées de chaleur, sommeil, humeur) pèsent sur votre quotidien : des solutions existent, dont le traitement hormonal à discuter avec votre médecin.',
          'Demandez un avis en cas de prise de poids rapide et inexpliquée, de fatigue persistante ou de saignements inhabituels.',
          'Si vous suivez un traitement ou avez une maladie chronique, validez votre objectif avec votre médecin.',
        ],
        action: 'Exportez vos données depuis Réglages pour les montrer à votre médecin ou diététicien.',
      },
    ],
  },
  {
    id: 'basics', tier: 'all', level: 'Cours',
    title: 'Bien démarrer',
    sub: 'Les réflexes qui font la différence la première semaine.',
    guides: [
      {
        id: 'start-week1', title: 'Votre première semaine avec NutriPilot', time: '3 min',
        intro: 'Le but de la semaine 1 n’est pas d’être parfait, mais de voir clair.',
        points: [
          'Scannez tous vos repas, même les écarts : ce sont les données réelles qui guident votre plan.',
          'Pesez-vous 2 ou 3 fois par semaine, le matin, et regardez la tendance plutôt que le chiffre du jour.',
          'Utilisez « Que manger ensuite ? » quand vous hésitez : le repas suivant rattrape la journée.',
        ],
        action: 'Objectif du jour : scanner 2 repas.',
      },
      {
        id: 'start-restaurant', title: 'Restaurant, apéro et repas de famille', time: '3 min',
        intro: 'Une sortie ne ruine jamais un programme. Ce qui compte, c’est la suite.',
        points: [
          'Choisissez une base protéinée (poisson, viande grillée, plat du jour avec légumes) et partagez le dessert si vous en avez envie.',
          'À l’apéro, privilégiez les crudités, olives, chips de légumes et alternez avec de l’eau pétillante.',
          'Le lendemain, pas de punition : revenez simplement à votre plan.',
        ],
        action: 'Avant de sortir, utilisez le mode Restaurant dans « Que manger ensuite ? ».',
      },
      {
        id: 'start-snacking', title: 'Stopper le grignotage du soir', time: '3 min',
        intro: 'Le grignotage vient souvent de journées où l’on a trop peu mangé de protéines et de fibres.',
        points: [
          'Un petit-déjeuner et un déjeuner rassasiants réduisent les envies de 18 h.',
          'Prévoyez une collation simple (fruit + yaourt, poignée d’amandes) plutôt que de résister jusqu’à craquer.',
          'Brossez-vous les dents après le dîner : un signal simple de fin de journée.',
        ],
        action: 'Si vous avez faim le soir, demandez au coach une collation adaptée à vos calories restantes.',
      },
    ],
  },
  {
    id: 'weightloss', tier: 'nutrition', level: 'Cours',
    title: 'Les fondamentaux de la perte de poids',
    sub: 'Comprendre ce qui fait vraiment bouger la balance, sans régime extrême.',
    guides: [
      {
        id: 'wl-deficit', title: 'Le déficit calorique, simplement', time: '4 min',
        intro: 'On perd du poids quand on dépense un peu plus d’énergie que ce que l’on mange, de façon régulière. Le secret n’est pas de manger le moins possible, mais un peu moins, longtemps.',
        points: [
          'Un déficit modéré se tient sur la durée, protège vos muscles et votre énergie, et limite l’effet yo-yo.',
          'Votre repère calorique NutriPilot est une estimation de départ : il s’ajuste avec votre poids réel.',
          'Une journée au-dessus ne compte pas : c’est la moyenne de la semaine qui fait le résultat.',
        ],
        action: 'Regardez votre moyenne des 7 derniers jours dans Progrès plutôt que le chiffre d’une seule journée.',
      },
      {
        id: 'wl-protein', title: 'Les protéines, votre alliée satiété', time: '3 min',
        intro: 'Les protéines calent plus longtemps que la plupart des aliments et aident à garder vos muscles pendant la perte de poids.',
        points: [
          'Visez une source de protéines à chaque repas : œufs, poisson, volaille, viande maigre, laitages, légumineuses, tofu.',
          'Un petit-déjeuner protéiné réduit souvent les fringales de fin de matinée.',
          'Votre objectif de protéines est indiqué chaque jour sur l’écran Aujourd’hui.',
        ],
        action: 'Ajoutez une portion de protéines à votre prochain repas et scannez-le.',
      },
      {
        id: 'wl-volume', title: 'Fibres et volume : manger plus, pour moins de calories', time: '3 min',
        intro: 'Les légumes, les fruits et les céréales complètes apportent du volume et des fibres pour peu de calories.',
        points: [
          'Remplir la moitié de l’assiette de légumes permet de manger à sa faim tout en réduisant les calories.',
          'Les fibres ralentissent la digestion et aident à rester rassasié(e).',
          'Une soupe ou une salade en entrée diminue souvent la quantité mangée ensuite.',
        ],
        action: 'Ajoutez une portion de légumes à votre déjeuner ou à votre dîner aujourd’hui.',
      },
      {
        id: 'wl-label', title: 'Lire une étiquette en 30 secondes', time: '3 min',
        intro: 'L’étiquette dit tout, à condition de regarder les bonnes lignes.',
        points: [
          'Regardez d’abord la portion réelle que vous allez manger, pas seulement les valeurs pour 100 g.',
          'Comparez calories, protéines, sucres et sel entre deux produits similaires.',
          'Une liste d’ingrédients courte et compréhensible est souvent bon signe.',
        ],
        action: 'Scannez le code-barres d’un produit de votre placard et comparez-le avec une alternative.',
      },
      {
        id: 'wl-plateau', title: 'Plateau : quand la balance ne bouge plus', time: '4 min',
        intro: 'Un plateau de quelques jours est normal : l’eau, le sel, le sommeil ou le cycle font varier le poids.',
        points: [
          'Attendez 2 à 3 semaines de tendance stable avant de conclure à un vrai plateau.',
          'Vérifiez les portions : avec le temps, elles ont tendance à grandir sans qu’on s’en rende compte.',
          'Ajoutez du mouvement au quotidien (marche, escaliers) avant de réduire encore les calories.',
        ],
        action: 'Mettez à jour votre poids dans Progrès, puis utilisez « Actualiser mes repères » si votre poids a changé.',
      },
    ],
  },
  {
    id: 'strength', tier: 'training', level: 'Cours',
    title: 'Musculation : bien débuter',
    sub: 'Les règles simples pour progresser en salle ou à la maison, sans se blesser.',
    guides: [
      {
        id: 'st-progress', title: 'Comment on progresse : la surcharge progressive', time: '3 min',
        intro: 'Le muscle progresse quand on lui demande un peu plus, petit à petit : une répétition de plus, un peu plus de charge ou une meilleure exécution.',
        points: [
          'Notez vos charges à chaque séance : NutriPilot vous les rappelle la fois suivante.',
          'Quand vous atteignez le haut de la fourchette de répétitions sur toutes les séries, augmentez légèrement la charge.',
          'La régularité sur plusieurs semaines compte plus qu’une séance parfaite.',
        ],
        action: 'Pendant votre prochaine séance, enregistrez la charge de chaque exercice.',
      },
      {
        id: 'st-warmup', title: 'Bien s’échauffer en 7 minutes', time: '2 min',
        intro: 'Un bon échauffement prépare les articulations et améliore la qualité des premières séries.',
        points: [
          '3 à 5 minutes de cardio léger : vélo, rameur, marche rapide ou corde à sauter.',
          'Quelques mouvements articulaires : épaules, hanches, chevilles.',
          '1 ou 2 séries légères du premier exercice avant les séries de travail.',
        ],
        action: 'Faites cet échauffement avant votre prochaine séance.',
      },
      {
        id: 'st-load', title: 'Choisir la bonne charge', time: '3 min',
        intro: 'La bonne charge est celle qui vous laisse 1 à 2 répétitions « en réserve » à la fin de la série, avec une technique propre.',
        points: [
          'Si la technique se dégrade, la charge est trop lourde.',
          'Si vous pourriez faire 5 répétitions de plus, augmentez la charge.',
          'Commencez léger la première semaine pour apprendre les mouvements.',
        ],
        action: 'Ouvrez une séance et lisez les conseils d’exécution de chaque exercice.',
      },
      {
        id: 'st-recovery', title: 'Récupération, sommeil et alimentation', time: '3 min',
        intro: 'Le muscle se construit pendant la récupération, pas pendant la séance.',
        points: [
          'Gardez au moins un jour de repos entre deux séances qui travaillent les mêmes muscles.',
          'Le sommeil compte autant que l’entraînement pour progresser.',
          'Des protéines réparties dans la journée soutiennent la récupération.',
        ],
        action: 'Vérifiez que votre objectif de protéines est atteint les jours d’entraînement.',
      },
      {
        id: 'st-safety', title: 'La technique avant la charge', time: '3 min',
        intro: 'La plupart des blessures viennent d’une charge trop lourde ou d’un mouvement mal maîtrisé.',
        points: [
          'Contrôlez la descente de chaque répétition, sans à-coups.',
          'Gardez le dos neutre sur les squats, soulevés de terre et rowings.',
          'Une douleur vive ou articulaire est un signal d’arrêt : demandez un avis professionnel si elle persiste.',
        ],
        action: 'Filmez une série avec votre téléphone pour vérifier votre technique.',
      },
    ],
  },
];

function allGuides() {
  return GUIDE_COLLECTIONS.flatMap((c) => c.guides.map((g, index) => ({ ...g, collection: c.id, index, total: c.guides.length, tier: c.tier })));
}

function openLesson(id) {
  const guide = allGuides().find((g) => g.id === id);
  if (!guide) return;
  const access = lessonAccess(guide);
  modal = null;
  if (access === 'paywall') { track('PaywallFromLesson', { lesson: guide.id }); modal = { type: 'trial' }; return renderModal(); }
  if (access === 'upgrade') { selectedTier = 'complete'; return nav('upgrade'); }
  state.guidesRead = [...new Set([...(state.guidesRead || []), guide.id])];
  saveState();
  render();
  modal = { type: 'guide', guide };
  return renderModal();
}

function lessonAccess(guide) {
  if (!fullAccess()) return 'paywall';
  if (guide.tier === 'all' || hasFeature(guide.tier) || (guide.tier === 'nutrition' && hasFeature('menopause'))) return 'open';
  return 'upgrade';
}

function programTabs(active) {
  const tabs = [['program', 'Plan 7 jours'], ['diary', 'Journal'], ['targets', 'Objectifs'], ['shopping', 'Courses'], ['planner', 'Hors maison'], ['guides', 'Leçons']];
  return `<div class="tab-scroll mod-tabs" role="tablist">${tabs.map(([r, label]) => `<button role="tab" aria-selected="${r === active}" class="${r === active ? 'active' : ''}" data-go="${r}">${L(label)}</button>`).join('')}</div>`;
}

function guidesScreen() {
  const p = state.profile || {};
  const read = new Set(state.guidesRead || []);
  const priority = { menopause: p.track === 'menopause' || (p.menopause && p.menopause !== 'no') ? 0 : 3, weightloss: ['lose', 'menopause', 'eat'].includes(p.track) ? 1 : 2, strength: p.track === 'muscle' ? 0 : 2, basics: 1 };
  const academy = GUIDE_COLLECTIONS.filter((c) => !['menopause', 'strength', 'movement'].includes(c.id));
  const courses = [...academy].sort((a, b) => (priority[a.id] ?? 5) - (priority[b.id] ?? 5));
  const lessons = allGuides().filter((g) => !['menopause', 'strength', 'movement'].includes(g.collection));
  const done = lessons.filter((g) => read.has(g.id)).length;
  return `<div class="mobile-app">
    ${appHeader('Nutrition')}
    <div class="screen">
      ${programTabs('guides')}
      <div class="today-card academy-hero"><small>${L('COURS NUTRITION')}</small><h2>${L('{n} cours · {total} leçons courtes', { n: academy.length, total: lessons.length })}</h2><div class="progress"><i style="width:${Math.round(done / Math.max(1, lessons.length) * 100)}%"></i></div><span>${L('{n}/{total} leçons terminées', { n: done, total: lessons.length })}</span></div>
      ${courses.map((c) => courseCardHtml(c, read)).join('')}
      <div class="fine center-fine">${L('Contenus d’information générale. Ils ne remplacent pas l’avis d’un médecin.')}</div>
    </div>
    ${bottom('program')}
  </div>`;
}

function guideSheet(guide) {
  return `<div class="sheet-head"><div><span class="tag">${L('Leçon {n}/{total}', { n: (guide.index ?? 0) + 1, total: guide.total || 1 })} · ${esc(guide.time)}</span><h2>${esc(L(guide.title))}</h2></div><button class="icon-btn" data-close>×</button></div>
    ${guide.demo && EXERCISES[guide.demo] ? `<div class="ex-demo">${moveSvg(guide.demo, { equip: exEquip(guide.demo) })}</div>` : ''}
    <p class="guide-intro">${esc(L(guide.intro))}</p>
    <ul class="guide-points">${guide.points.map((x) => `<li>${esc(L(x))}</li>`).join('')}</ul>
    <div class="warn success"><b>${L('À faire aujourd’hui')}</b><br>${esc(L(guide.action))}</div>
    ${(() => {
      const next = allGuides().find((g) => g.collection === guide.collection && g.index === guide.index + 1);
      return next ? `<button class="btn btn-primary btn-wide" data-guide="${esc(next.id)}">${L('Leçon suivante : {title} →', { title: esc(L(next.title)) })}</button>` : `<button class="btn btn-primary btn-wide" data-close>${L('J’ai compris')}</button>`;
    })()}`;
}


// ---- Entraînement ----------------------------------------------------------
const EXERCISES = {
  'bench': { name: 'Développé couché (barre)', muscle: 'Pectoraux', cues: ['Omoplates serrées et basses, pieds bien ancrés au sol.', 'Descendez la barre au bas des pectoraux, coudes à environ 45° du corps.', 'Poussez en expirant, sans décoller les fesses du banc.'] },
  'incline-db': { name: 'Développé incliné haltères', muscle: 'Haut des pectoraux', cues: ['Banc incliné à 30°.', 'Descendez lentement jusqu’à sentir l’étirement des pectoraux.', 'Remontez en rapprochant les haltères sans les cogner.'] },
  'cable-fly': { name: 'Écarté à la poulie', muscle: 'Pectoraux', cues: ['Coudes légèrement fléchis et fixes.', 'Ramenez les mains devant la poitrine en contractant.', 'Revenez lentement en contrôlant l’ouverture.'] },
  'dips': { name: 'Dips (ou dips assistés)', muscle: 'Pectoraux, triceps', cues: ['Buste légèrement penché vers l’avant.', 'Descendez jusqu’à ce que les bras soient parallèles au sol.', 'Utilisez la machine d’assistance si besoin.'] },
  'ohp': { name: 'Développé militaire haltères', muscle: 'Épaules', cues: ['Gainage serré, dos droit.', 'Poussez les haltères au-dessus de la tête sans cambrer.', 'Redescendez à hauteur des oreilles.'] },
  'lateral': { name: 'Élévations latérales', muscle: 'Épaules', cues: ['Charge légère, mouvement contrôlé.', 'Montez les bras jusqu’à l’horizontale, coudes légèrement fléchis.', 'Évitez de balancer le buste.'] },
  'triceps': { name: 'Extension triceps à la poulie', muscle: 'Triceps', cues: ['Coudes collés au corps.', 'Tendez complètement les bras en bas.', 'Remontez lentement.'] },
  'lat-pulldown': { name: 'Tirage vertical', muscle: 'Dos (grand dorsal)', cues: ['Poitrine sortie, légère inclinaison arrière.', 'Tirez la barre vers le haut de la poitrine avec les coudes.', 'Remontez en contrôlant l’étirement.'] },
  'row': { name: 'Rowing barre ou haltère', muscle: 'Dos', cues: ['Dos plat, buste incliné vers l’avant.', 'Tirez vers le nombril en serrant les omoplates.', 'Ne tirez pas avec le bas du dos.'] },
  'seated-row': { name: 'Tirage horizontal assis', muscle: 'Dos', cues: ['Buste droit et immobile.', 'Tirez la poignée vers le ventre, coudes près du corps.', 'Relâchez lentement vers l’avant.'] },
  'curl': { name: 'Curl biceps haltères', muscle: 'Biceps', cues: ['Coudes fixes le long du corps.', 'Montez sans balancer le buste.', 'Descendez en 2 à 3 secondes.'] },
  'squat': { name: 'Squat (barre ou goblet)', muscle: 'Quadriceps, fessiers', cues: ['Pieds largeur d’épaules, pointes légèrement ouvertes.', 'Descendez en poussant les fesses en arrière, genoux dans l’axe des pieds.', 'Dos neutre, remontez en poussant dans les talons.'] },
  'leg-press': { name: 'Presse à cuisses', muscle: 'Quadriceps, fessiers', cues: ['Bas du dos collé au dossier.', 'Descendez jusqu’à environ 90° aux genoux.', 'Ne verrouillez pas complètement les genoux en haut.'] },
  'leg-ext': { name: 'Leg extension', muscle: 'Quadriceps', cues: ['Réglez l’axe de la machine au niveau des genoux.', 'Tendez les jambes et marquez une pause en haut.', 'Redescendez lentement.'] },
  'lunge': { name: 'Fentes marchées', muscle: 'Quadriceps, fessiers', cues: ['Grand pas en avant, buste droit.', 'Le genou arrière descend près du sol.', 'Poussez sur le talon avant pour avancer.'] },
  'rdl': { name: 'Soulevé de terre jambes tendues', muscle: 'Ischio-jambiers, fessiers', cues: ['Genoux légèrement fléchis, dos bien plat.', 'Descendez la barre le long des jambes en poussant les hanches en arrière.', 'Remontez en contractant les fessiers.'] },
  'leg-curl': { name: 'Leg curl', muscle: 'Ischio-jambiers', cues: ['Hanches bien plaquées.', 'Fléchissez les jambes complètement.', 'Revenez lentement.'] },
  'hip-thrust': { name: 'Hip thrust', muscle: 'Fessiers', cues: ['Haut du dos sur le banc, barre sur les hanches (avec protection).', 'Montez jusqu’à aligner épaules, hanches et genoux.', 'Serrez fort les fessiers 1 seconde en haut.'] },
  'abduction': { name: 'Abduction à la machine', muscle: 'Moyen fessier', cues: ['Buste légèrement penché vers l’avant.', 'Écartez les jambes en contrôlant.', 'Revenez sans laisser les poids se toucher.'] },
  'calf': { name: 'Mollets debout', muscle: 'Mollets', cues: ['Montez sur la pointe des pieds le plus haut possible.', 'Pause en haut, descente lente.', 'Amplitude complète.'] },
  'plank': { name: 'Gainage (planche)', muscle: 'Abdominaux', cues: ['Coudes sous les épaules.', 'Corps aligné, fessiers serrés.', 'Respirez calmement.'] },
  'pushup': { name: 'Pompes (sur genoux si besoin)', muscle: 'Pectoraux, triceps', cues: ['Mains un peu plus larges que les épaules.', 'Corps gainé du début à la fin.', 'Poitrine près du sol, puis poussez.'] },
  'bw-squat': { name: 'Squat au poids du corps', muscle: 'Quadriceps, fessiers', cues: ['Bras tendus devant pour l’équilibre.', 'Descendez en gardant les talons au sol.', 'Remontez en expirant.'] },
  'glute-bridge': { name: 'Pont fessier', muscle: 'Fessiers', cues: ['Allongé(e), pieds proches des fesses.', 'Montez le bassin en serrant les fessiers.', 'Redescendez lentement.'] },
  'split-squat': { name: 'Fente bulgare (chaise)', muscle: 'Quadriceps, fessiers', cues: ['Pied arrière posé sur une chaise stable.', 'Descendez verticalement.', 'Poussez dans le talon avant.'] },
  'superman': { name: 'Superman', muscle: 'Bas du dos', cues: ['Allongé(e) sur le ventre.', 'Levez bras et jambes quelques centimètres.', 'Tenez 2 secondes, redescendez.'] },
  'mountain': { name: 'Mountain climbers', muscle: 'Cardio, abdominaux', cues: ['Position de pompe, dos plat.', 'Ramenez les genoux vers la poitrine en alternant.', 'Rythme régulier.'] },
};

const WORKOUT_PROGRAMS = [
  {
    id: 'gym-full-3', name: 'Full body · salle', level: 'Débutant', place: 'gym', days: 3,
    desc: 'Tout le corps à chaque séance, 3 fois par semaine. Idéal pour démarrer ou reprendre.',
    sessions: [
      { id: 'A', name: 'Séance A', focus: 'Pectoraux · Jambes · Dos', ex: [['squat', 3, '8–10', 120], ['bench', 3, '8–10', 120], ['lat-pulldown', 3, '10–12', 90], ['rdl', 3, '10', 90], ['lateral', 2, '12–15', 60], ['plank', 3, '30 s', 45]] },
      { id: 'B', name: 'Séance B', focus: 'Jambes · Épaules · Dos', ex: [['leg-press', 3, '10–12', 120], ['ohp', 3, '8–10', 90], ['seated-row', 3, '10–12', 90], ['hip-thrust', 3, '10–12', 90], ['curl', 2, '12', 60], ['triceps', 2, '12', 60]] },
      { id: 'C', name: 'Séance C', focus: 'Pectoraux · Quadriceps · Fessiers', ex: [['incline-db', 3, '10', 90], ['lunge', 3, '10 / jambe', 90], ['row', 3, '10', 90], ['leg-ext', 3, '12–15', 60], ['leg-curl', 3, '12', 60], ['calf', 3, '15', 45]] },
    ],
  },
  {
    id: 'gym-upper-lower-4', name: 'Haut / Bas · salle', level: 'Intermédiaire', place: 'gym', days: 4,
    desc: '4 séances : 2 haut du corps, 2 bas du corps. Plus de volume pour progresser.',
    sessions: [
      { id: 'U1', name: 'Haut du corps 1', focus: 'Pectoraux · Dos · Bras', ex: [['bench', 4, '6–8', 150], ['row', 4, '8', 120], ['incline-db', 3, '10', 90], ['lat-pulldown', 3, '10', 90], ['lateral', 3, '12–15', 60], ['triceps', 3, '12', 60]] },
      { id: 'L1', name: 'Bas du corps 1', focus: 'Quadriceps · Fessiers', ex: [['squat', 4, '6–8', 150], ['leg-press', 3, '10–12', 120], ['leg-ext', 3, '12–15', 60], ['leg-curl', 3, '12', 60], ['calf', 4, '12–15', 45], ['plank', 3, '40 s', 45]] },
      { id: 'U2', name: 'Haut du corps 2', focus: 'Épaules · Dos · Pectoraux', ex: [['ohp', 4, '8', 120], ['seated-row', 3, '10', 90], ['dips', 3, '8–10', 90], ['cable-fly', 3, '12–15', 60], ['curl', 3, '10–12', 60], ['lateral', 2, '15', 45]] },
      { id: 'L2', name: 'Bas du corps 2', focus: 'Ischios · Fessiers', ex: [['rdl', 4, '8', 120], ['hip-thrust', 4, '8–10', 120], ['lunge', 3, '10 / jambe', 90], ['abduction', 3, '15', 60], ['leg-curl', 3, '12', 60], ['calf', 3, '15', 45]] },
    ],
  },
  {
    id: 'gym-glutes-3', name: 'Fessiers & jambes · salle', level: 'Tous niveaux', place: 'gym', days: 3,
    desc: 'Priorité au bas du corps et aux fessiers, avec une séance haut du corps pour l’équilibre.',
    sessions: [
      { id: 'G1', name: 'Fessiers & quadriceps', focus: 'Fessiers · Quadriceps', ex: [['hip-thrust', 4, '8–10', 120], ['squat', 3, '8–10', 120], ['leg-ext', 3, '12–15', 60], ['abduction', 3, '15–20', 60], ['plank', 3, '30 s', 45]] },
      { id: 'G2', name: 'Haut du corps', focus: 'Dos · Épaules · Pectoraux', ex: [['lat-pulldown', 3, '10–12', 90], ['incline-db', 3, '10', 90], ['seated-row', 3, '12', 90], ['lateral', 3, '15', 60], ['triceps', 2, '12', 60]] },
      { id: 'G3', name: 'Fessiers & ischios', focus: 'Fessiers · Ischio-jambiers', ex: [['rdl', 4, '8–10', 120], ['lunge', 3, '10 / jambe', 90], ['leg-curl', 3, '12', 60], ['glute-bridge', 3, '15', 60], ['calf', 3, '15', 45]] },
    ],
  },
  {
    id: 'home-full-3', name: 'Maison sans matériel', level: 'Débutant', place: 'home', days: 3,
    desc: '30 minutes, sans matériel, dans votre salon. Parfait pour s’y mettre en douceur.',
    sessions: [
      { id: 'H1', name: 'Corps entier 1', focus: 'Jambes · Pectoraux · Gainage', ex: [['bw-squat', 3, '15', 60], ['pushup', 3, '8–12', 60], ['glute-bridge', 3, '15', 45], ['plank', 3, '30 s', 45], ['mountain', 3, '30 s', 45]] },
      { id: 'H2', name: 'Corps entier 2', focus: 'Fessiers · Dos · Cardio', ex: [['split-squat', 3, '10 / jambe', 60], ['superman', 3, '12', 45], ['glute-bridge', 3, '20', 45], ['pushup', 3, '8–12', 60], ['mountain', 3, '40 s', 45]] },
      { id: 'H3', name: 'Corps entier 3', focus: 'Jambes · Gainage', ex: [['bw-squat', 4, '20', 60], ['lunge', 3, '10 / jambe', 60], ['plank', 3, '40 s', 45], ['superman', 3, '12', 45], ['mountain', 3, '30 s', 45]] },
    ],
  },
];

// ---- Training v2: library, styles, programs, builder, import, agenda ---------
Object.assign(EXERCISES, {
  'pullup': { name: 'Tractions (ou tractions assistées)', muscle: 'Dos, biceps', cues: ['Prise un peu plus large que les épaules.', 'Tirez la poitrine vers la barre en serrant les omoplates.', 'Utilisez un élastique ou la machine d’assistance si besoin.'] },
  'face-pull': { name: 'Face pull à la poulie', muscle: 'Arrière d’épaules', cues: ['Poulie à hauteur du visage, corde en main.', 'Tirez vers le front en écartant les mains.', 'Gardez les coudes hauts et contrôlez le retour.'] },
  'reverse-fly': { name: 'Oiseau haltères', muscle: 'Arrière d’épaules, haut du dos', home: true, cues: ['Buste penché, dos plat.', 'Écartez les bras jusqu’à l’horizontale.', 'Charge légère, mouvement lent.'] },
  'hammer-curl': { name: 'Curl marteau', muscle: 'Biceps, avant-bras', home: true, cues: ['Paumes face à face.', 'Montez sans bouger les coudes.', 'Descendez lentement.'] },
  'overhead-ext': { name: 'Extension triceps au-dessus de la tête', muscle: 'Triceps', home: true, cues: ['Haltère tenu à deux mains derrière la tête.', 'Coudes pointés vers le haut.', 'Tendez les bras sans cambrer.'] },
  'chest-press': { name: 'Presse pectorale (machine)', muscle: 'Pectoraux', cues: ['Réglez les poignées à hauteur de poitrine.', 'Poussez sans verrouiller les coudes.', 'Revenez lentement.'] },
  'floor-press': { name: 'Développé au sol haltères', muscle: 'Pectoraux, triceps', home: true, cues: ['Allongé(e) au sol, genoux fléchis.', 'Descendez jusqu’à ce que les coudes touchent le sol.', 'Poussez en expirant.'] },
  'leg-raise': { name: 'Relevés de jambes allongé(e)', muscle: 'Abdominaux', home: true, cues: ['Bas du dos plaqué au sol.', 'Montez les jambes en contrôlant.', 'Redescendez sans toucher le sol.'] },
  'dead-bug': { name: 'Dead bug', muscle: 'Abdominaux profonds', home: true, cues: ['Dos plaqué au sol, bras vers le plafond.', 'Allongez bras et jambe opposés.', 'Expirez à chaque extension.'] },
  'bird-dog': { name: 'Bird dog', muscle: 'Gainage, bas du dos', home: true, cues: ['À quatre pattes, dos plat.', 'Tendez bras et jambe opposés.', 'Tenez 2 secondes sans tourner le bassin.'] },
  'step-up': { name: 'Montées sur banc ou marche', muscle: 'Quadriceps, fessiers', home: true, cues: ['Posez tout le pied sur la marche.', 'Montez en poussant sur la jambe d’appui.', 'Redescendez lentement.'] },
  'farmer-walk': { name: 'Marche du fermier', muscle: 'Prise, gainage, épaules', home: true, cues: ['Une charge lourde dans chaque main.', 'Épaules basses, buste droit.', 'Marchez à petits pas réguliers.'] },
  'wall-sit': { name: 'Chaise contre le mur', muscle: 'Quadriceps', home: true, cues: ['Dos plaqué au mur, genoux à 90°.', 'Poids du corps sur les talons.', 'Respirez calmement.'] },
  'balance': { name: 'Équilibre sur une jambe', muscle: 'Équilibre, chevilles', home: true, cues: ['Tenez-vous près d’un mur ou d’une chaise.', 'Levez un pied et gardez le bassin droit.', 'Changez de jambe.'] },
  'brisk-walk': { name: 'Marche rapide', muscle: 'Cardio', home: true, cues: ['Un rythme où vous pouvez parler mais pas chanter.', 'Balancez les bras.', 'Augmentez la durée progressivement.'] },
  'cat-cow': { name: 'Chat-vache', muscle: 'Mobilité du dos', home: true, cues: ['À quatre pattes.', 'Arrondissez puis creusez doucement le dos.', 'Suivez le rythme de votre respiration.'] },
  'hip-opener': { name: 'Ouverture de hanches (fente basse)', muscle: 'Mobilité des hanches', home: true, cues: ['Genou arrière au sol, sur un coussin.', 'Avancez doucement le bassin.', 'Tenez sans douleur.'] },
  'goblet-squat': { name: 'Squat goblet', muscle: 'Quadriceps, fessiers', home: true, cues: ['Haltère tenu contre la poitrine.', 'Descendez entre les genoux, dos droit.', 'Remontez en poussant dans les talons.'] },
  'jumping': { name: 'Corde à sauter ou jumping jacks', muscle: 'Cardio', home: true, cues: ['Restez sur l’avant du pied.', 'Rythme régulier.', 'Faites des pauses si besoin.'] },
});
['pushup', 'bw-squat', 'glute-bridge', 'split-squat', 'superman', 'mountain', 'plank', 'lunge', 'row', 'ohp', 'lateral', 'curl', 'rdl', 'calf'].forEach((id) => { EXERCISES[id].home = true; });
Object.assign(EXERCISES, EXTRA_EXERCISES);

const EX_GROUPS = ['Pectoraux', 'Dos', 'Épaules', 'Bras', 'Jambes', 'Fessiers', 'Abdos & gainage', 'Cardio', 'Mobilité & équilibre'];
const EX_GROUP_OF = {
  bench: 'Pectoraux', 'incline-db': 'Pectoraux', 'cable-fly': 'Pectoraux', dips: 'Pectoraux', pushup: 'Pectoraux', 'chest-press': 'Pectoraux', 'floor-press': 'Pectoraux',
  'lat-pulldown': 'Dos', row: 'Dos', 'seated-row': 'Dos', pullup: 'Dos', superman: 'Dos',
  ohp: 'Épaules', lateral: 'Épaules', 'face-pull': 'Épaules', 'reverse-fly': 'Épaules',
  curl: 'Bras', 'hammer-curl': 'Bras', triceps: 'Bras', 'overhead-ext': 'Bras',
  squat: 'Jambes', 'leg-press': 'Jambes', 'leg-ext': 'Jambes', lunge: 'Jambes', 'bw-squat': 'Jambes', 'split-squat': 'Jambes', 'goblet-squat': 'Jambes', 'step-up': 'Jambes', 'wall-sit': 'Jambes', calf: 'Jambes', 'leg-curl': 'Jambes', rdl: 'Fessiers',
  'hip-thrust': 'Fessiers', abduction: 'Fessiers', 'glute-bridge': 'Fessiers',
  plank: 'Abdos & gainage', 'dead-bug': 'Abdos & gainage', 'leg-raise': 'Abdos & gainage', 'bird-dog': 'Abdos & gainage', 'farmer-walk': 'Abdos & gainage',
  mountain: 'Cardio', 'brisk-walk': 'Cardio', jumping: 'Cardio',
  balance: 'Mobilité & équilibre', 'cat-cow': 'Mobilité & équilibre', 'hip-opener': 'Mobilité & équilibre',
};
function exGroup(id) { return EXERCISES[id]?.group || EX_GROUP_OF[id] || 'Abdos & gainage'; }
function exName(id) { return EXERCISES[id]?.name || (state.customExercises || {})[id]?.name || id; }

const COACH_STYLES = [
  { id: 'hypertrophy', name: 'Hypertrophie', desc: 'Volume modéré à élevé, 8 à 12 répétitions, 60 à 90 s de repos. Pour prendre du muscle.', reps: '8–12', sets: 3, rest: 75 },
  { id: 'strength', name: 'Force', desc: 'Charges lourdes, 4 à 6 répétitions, repos longs. Pour devenir plus fort(e).', reps: '4–6', sets: 4, rest: 150 },
  { id: 'athletic', name: 'Athlétique', desc: 'Mouvements complets et rythme soutenu. Pour être en forme, tonique et dynamique.', reps: '8–10', sets: 3, rest: 60 },
  { id: 'fatloss', name: 'Perte de gras', desc: 'Circuits, peu de repos, 12 à 15 répétitions. Pour dépenser plus et se tonifier.', reps: '12–15', sets: 3, rest: 40 },
  { id: 'glutes', name: 'Fessiers', desc: 'Priorité aux fessiers et aux jambes, avec contraction et contrôle.', reps: '10–15', sets: 4, rest: 60 },
  { id: 'gentle', name: 'Douceur & mobilité', desc: 'Renforcement en douceur, gainage, équilibre et mobilité.', reps: '10–12', sets: 2, rest: 45 },
];

const TRAIN_FOCUS = [['all', 'Tous'], ['cardio', 'Cardio & HIIT'], ['fat', 'Perdre du gras'], ['muscle', 'Prendre du muscle'], ['upper', 'Haut du corps'], ['lower', 'Bas du corps'], ['glutes', 'Fessiers'], ['strength', 'Force'], ['home', 'À la maison'], ['fitness', 'Remise en forme']];

WORKOUT_PROGRAMS.push(
  { id: 'hiit-15', name: 'HIIT 15 minutes', level: 'Intermédiaire', place: 'home', days: 3, style: 'fatloss', cardio: true, desc: 'Intervalles courts et intenses, sans matériel. 40 secondes d’effort, 20 secondes de récupération.',
    sessions: [
      { id: 'A', name: 'HIIT A', focus: 'Cardio · Jambes · Gainage', ex: [['jumping', 3, '40 s', 20], ['mountain', 3, '40 s', 20], ['jump-squat', 3, '30 s', 30], ['plank', 3, '40 s', 20]] },
      { id: 'B', name: 'HIIT B', focus: 'Cardio · Haut du corps', ex: [['burpees', 3, '30 s', 30], ['pushup', 3, '30 s', 30], ['mountain', 3, '40 s', 20], ['bicycle', 3, '40 s', 20]] },
      { id: 'C', name: 'HIIT C', focus: 'Cardio · Fessiers', ex: [['jump-squat', 3, '30 s', 30], ['reverse-lunge', 3, '40 s', 20], ['glute-bridge', 3, '40 s', 20], ['jumping', 3, '40 s', 20]] },
    ] },
  { id: 'low-impact-3', name: 'Faible impact · maison', level: 'Débutant', place: 'home', days: 3, style: 'gentle', cardio: true, desc: 'Sans saut, doux pour les articulations : idéal pour reprendre, en cas de surpoids ou de douleurs.',
    sessions: [
      { id: 'A', name: 'Doux A', focus: 'Jambes · Cardio léger', ex: [['brisk-walk', 1, '10 min', 60], ['step-up', 3, '10 / jambe', 60], ['wall-sit', 3, '30 s', 45], ['glute-bridge', 3, '12', 45]] },
      { id: 'B', name: 'Doux B', focus: 'Haut du corps · Gainage', ex: [['incline-pushup', 3, '10', 60], ['band-row', 3, '12', 60], ['side-plank', 2, '20 s', 30], ['brisk-walk', 1, '10 min', 60]] },
      { id: 'C', name: 'Doux C', focus: 'Corps entier', ex: [['bw-squat', 3, '12', 60], ['step-up', 3, '10 / jambe', 60], ['superman', 3, '10', 45], ['brisk-walk', 1, '15 min', 60]] },
    ] },
  { id: 'outdoor-3', name: 'Extérieur · parc', level: 'Débutant', place: 'outdoor', days: 3, style: 'athletic', cardio: true, desc: 'Marche rapide, escaliers et exercices au poids du corps, dehors.',
    sessions: [
      { id: 'A', name: 'Parc A', focus: 'Cardio · Jambes', ex: [['brisk-walk', 1, '15 min', 60], ['stairs', 4, '1 min', 60], ['step-up', 3, '12 / jambe', 60], ['bw-squat', 3, '15', 45]] },
      { id: 'B', name: 'Parc B', focus: 'Haut du corps · Cardio', ex: [['brisk-walk', 1, '10 min', 60], ['incline-pushup', 3, '12', 60], ['bench-dips', 3, '10', 60], ['jumping', 3, '40 s', 30]] },
      { id: 'C', name: 'Parc C', focus: 'Endurance', ex: [['brisk-walk', 1, '30 min', 0], ['plank', 3, '30 s', 30]] },
    ] },
  { id: 'cardio-gym-3', name: 'Cardio · salle', level: 'Débutant', place: 'gym', days: 3, style: 'athletic', cardio: true, desc: 'Machines cardio variées pour progresser en endurance sans s’ennuyer.',
    sessions: [
      { id: 'A', name: 'Cardio A', focus: 'Endurance', ex: [['treadmill', 1, '20 min', 60], ['bike', 1, '15 min', 60], ['plank', 3, '30 s', 30]] },
      { id: 'B', name: 'Cardio B', focus: 'Intervalles', ex: [['rower', 6, '1 min', 60], ['elliptical', 1, '15 min', 60], ['side-plank', 2, '20 s', 30]] },
      { id: 'C', name: 'Cardio C', focus: 'Endurance', ex: [['elliptical', 1, '20 min', 60], ['stairs', 1, '10 min', 60]] },
    ] },
);
WORKOUT_PROGRAMS.forEach((p) => {
  p.focus = p.cardio ? ['cardio', 'fat', 'fitness', ...(p.place === 'home' ? ['home'] : [])] : p.focus || ({ 'gym-full-3': ['fitness', 'fat', 'muscle'], 'gym-upper-lower-4': ['muscle', 'upper', 'lower'], 'gym-glutes-3': ['glutes', 'lower'], 'home-full-3': ['home', 'fitness', 'fat'] })[p.id] || [];
  p.style = ({ 'gym-full-3': 'athletic', 'gym-upper-lower-4': 'hypertrophy', 'gym-glutes-3': 'glutes', 'home-full-3': 'fatloss' })[p.id] || 'athletic';
});
WORKOUT_PROGRAMS.push(
  {
    id: 'gym-beginner-2', name: 'Débutant 2 jours · salle', level: 'Débutant', place: 'gym', days: 2, focus: ['fitness', 'fat'], style: 'athletic',
    desc: 'Deux séances complètes par semaine pour prendre de bonnes habitudes, sans y passer sa vie.',
    sessions: [
      { id: 'D1', name: 'Corps entier A', focus: 'Jambes · Pectoraux · Dos', ex: [['leg-press', 3, '10–12', 90], ['chest-press', 3, '10–12', 90], ['lat-pulldown', 3, '10–12', 90], ['hip-thrust', 2, '12', 60], ['plank', 3, '30 s', 45]] },
      { id: 'D2', name: 'Corps entier B', focus: 'Jambes · Dos · Épaules', ex: [['goblet-squat', 3, '10', 90], ['seated-row', 3, '12', 90], ['ohp', 2, '10', 90], ['leg-curl', 2, '12', 60], ['dead-bug', 3, '10', 45]] },
    ],
  },
  {
    id: 'gym-ppl', name: 'Push / Pull / Legs · salle', level: 'Intermédiaire', place: 'gym', days: 3, focus: ['muscle', 'upper', 'lower', 'strength'], style: 'hypertrophy',
    desc: 'Pousser, tirer, jambes : le grand classique pour prendre du muscle. Faites-le 3 ou 6 fois par semaine.',
    sessions: [
      { id: 'PU', name: 'Push', focus: 'Pectoraux · Épaules · Triceps', ex: [['bench', 4, '6–8', 150], ['incline-db', 3, '8–10', 90], ['ohp', 3, '8–10', 90], ['lateral', 3, '12–15', 60], ['triceps', 3, '10–12', 60], ['dips', 2, '8–10', 90]] },
      { id: 'PL', name: 'Pull', focus: 'Dos · Biceps · Arrière d’épaules', ex: [['pullup', 4, '6–8', 120], ['row', 3, '8–10', 90], ['seated-row', 3, '10–12', 90], ['face-pull', 3, '15', 60], ['curl', 3, '10–12', 60], ['hammer-curl', 2, '12', 60]] },
      { id: 'LG', name: 'Legs', focus: 'Quadriceps · Ischios · Mollets', ex: [['squat', 4, '6–8', 150], ['rdl', 3, '8–10', 120], ['leg-press', 3, '10–12', 90], ['leg-curl', 3, '12', 60], ['calf', 4, '12–15', 45], ['leg-raise', 3, '12', 45]] },
    ],
  },
  {
    id: 'gym-upper-focus', name: 'Haut du corps & bras · salle', level: 'Intermédiaire', place: 'gym', days: 4, focus: ['upper', 'muscle'], style: 'hypertrophy',
    desc: 'Trois séances haut du corps (pectoraux, dos, épaules, bras) et une séance jambes pour l’équilibre.',
    sessions: [
      { id: 'UA', name: 'Haut du corps A', focus: 'Pectoraux · Dos', ex: [['bench', 4, '6–8', 120], ['row', 4, '8–10', 90], ['incline-db', 3, '10', 90], ['lat-pulldown', 3, '10–12', 90], ['curl', 3, '10–12', 60], ['triceps', 3, '12', 60]] },
      { id: 'LA', name: 'Jambes', focus: 'Quadriceps · Ischios · Fessiers', ex: [['squat', 4, '6–8', 150], ['rdl', 3, '8–10', 120], ['leg-ext', 3, '12–15', 60], ['leg-curl', 3, '12', 60], ['calf', 3, '15', 45]] },
      { id: 'UB', name: 'Haut du corps B', focus: 'Épaules · Dos · Pectoraux', ex: [['ohp', 4, '8', 120], ['pullup', 3, '6–8', 120], ['chest-press', 3, '10–12', 90], ['face-pull', 3, '15', 60], ['lateral', 3, '15', 45]] },
      { id: 'AR', name: 'Bras & épaules', focus: 'Biceps · Triceps · Épaules', ex: [['lateral', 4, '15', 45], ['reverse-fly', 3, '15', 45], ['curl', 3, '10–12', 60], ['overhead-ext', 3, '12', 60], ['hammer-curl', 3, '12', 60], ['triceps', 3, '12–15', 45]] },
    ],
  },
  {
    id: 'gym-strength-3', name: 'Force · salle', level: 'Confirmé', place: 'gym', days: 3, focus: ['strength', 'muscle'], style: 'strength',
    desc: 'Les grands mouvements en séries lourdes, en alternant deux séances. Ajoutez un peu de charge chaque semaine.',
    sessions: [
      { id: 'FA', name: 'Force A', focus: 'Squat · Développé couché · Rowing', ex: [['squat', 5, '5', 180], ['bench', 5, '5', 180], ['row', 5, '5', 150], ['plank', 3, '45 s', 60]] },
      { id: 'FB', name: 'Force B', focus: 'Squat · Développé militaire · Soulevé', ex: [['squat', 5, '5', 180], ['ohp', 5, '5', 150], ['rdl', 3, '5', 180], ['pullup', 3, '6–8', 120]] },
    ],
  },
  {
    id: 'home-db-4', name: 'Maison avec haltères', level: 'Intermédiaire', place: 'home', days: 4, focus: ['home', 'muscle', 'fat'], style: 'athletic',
    desc: 'Deux haltères suffisent : haut et bas du corps en alternance, 4 fois par semaine.',
    sessions: [
      { id: 'HH1', name: 'Haut du corps 1', focus: 'Pectoraux · Dos · Bras', ex: [['floor-press', 4, '10–12', 75], ['row', 4, '10–12', 75], ['ohp', 3, '10', 75], ['curl', 3, '12', 45], ['overhead-ext', 3, '12', 45]] },
      { id: 'HB1', name: 'Bas du corps 1', focus: 'Jambes · Fessiers', ex: [['goblet-squat', 4, '12', 75], ['rdl', 3, '10–12', 75], ['lunge', 3, '10 / jambe', 60], ['glute-bridge', 3, '15', 45], ['calf', 3, '15', 45]] },
      { id: 'HH2', name: 'Haut du corps 2', focus: 'Épaules · Pectoraux · Gainage', ex: [['pushup', 4, '8–12', 60], ['reverse-fly', 3, '15', 45], ['lateral', 3, '15', 45], ['hammer-curl', 3, '12', 45], ['plank', 3, '40 s', 45]] },
      { id: 'HB2', name: 'Bas du corps 2', focus: 'Fessiers · Quadriceps', ex: [['split-squat', 3, '10 / jambe', 60], ['step-up', 3, '10 / jambe', 60], ['wall-sit', 3, '40 s', 45], ['glute-bridge', 3, '20', 45], ['dead-bug', 3, '10', 45]] },
    ],
  },
  {
    id: 'home-burn-3', name: 'Brûle-graisses maison', level: 'Débutant', place: 'home', days: 3, focus: ['home', 'fat', 'fitness'], style: 'fatloss',
    desc: 'Circuits de 25 minutes sans matériel pour dépenser plus et gagner en souffle.',
    sessions: [
      { id: 'B1', name: 'Circuit 1', focus: 'Cardio · Jambes · Gainage', ex: [['jumping', 4, '40 s', 20], ['bw-squat', 4, '15', 20], ['mountain', 4, '30 s', 20], ['plank', 4, '30 s', 40]] },
      { id: 'B2', name: 'Circuit 2', focus: 'Haut du corps · Cardio', ex: [['pushup', 4, '10', 20], ['jumping', 4, '40 s', 20], ['superman', 4, '12', 20], ['dead-bug', 4, '10', 40]] },
      { id: 'B3', name: 'Circuit 3', focus: 'Fessiers · Cardio', ex: [['lunge', 4, '10 / jambe', 20], ['glute-bridge', 4, '15', 20], ['mountain', 4, '30 s', 20], ['brisk-walk', 1, '15 min', 0]] },
    ],
  },
);

const MENO_PROGRAMS = [
  {
    id: 'meno-home', name: 'Force & os · maison', level: 'Tous niveaux', place: 'home', days: 3, focus: ['menopause'], style: 'gentle', meno: true,
    desc: 'Renforcement musculaire et exercices en charge pour protéger les muscles et les os, à la maison.',
    sessions: [
      { id: 'MH1', name: 'Force bas du corps', focus: 'Jambes · Fessiers · Équilibre', ex: [['goblet-squat', 3, '10–12', 75], ['step-up', 3, '8 / jambe', 60], ['glute-bridge', 3, '12–15', 45], ['balance', 3, '30 s / jambe', 30], ['bird-dog', 2, '10', 30]] },
      { id: 'MH2', name: 'Force haut du corps', focus: 'Dos · Pectoraux · Épaules', ex: [['row', 3, '10–12', 60], ['floor-press', 3, '10–12', 60], ['ohp', 3, '10', 60], ['farmer-walk', 3, '40 s', 45], ['dead-bug', 2, '10', 30]] },
      { id: 'MH3', name: 'Corps entier & marche', focus: 'Corps entier · Cardio', ex: [['bw-squat', 3, '12', 45], ['pushup', 3, '8–10', 45], ['superman', 3, '12', 30], ['brisk-walk', 1, '20 min', 0]] },
    ],
  },
  {
    id: 'meno-gym', name: 'Force & os · salle', level: 'Tous niveaux', place: 'gym', days: 3, focus: ['menopause'], style: 'strength', meno: true,
    desc: 'Séances en salle avec charges progressives : la meilleure stratégie pour la densité osseuse et le métabolisme.',
    sessions: [
      { id: 'MG1', name: 'Bas du corps', focus: 'Jambes · Fessiers', ex: [['leg-press', 3, '8–10', 90], ['rdl', 3, '8–10', 90], ['hip-thrust', 3, '10', 75], ['calf', 3, '12', 45], ['balance', 2, '30 s / jambe', 30]] },
      { id: 'MG2', name: 'Haut du corps', focus: 'Dos · Pectoraux · Épaules', ex: [['lat-pulldown', 3, '8–10', 90], ['chest-press', 3, '8–10', 90], ['seated-row', 3, '10', 75], ['lateral', 2, '12–15', 45], ['plank', 3, '30 s', 30]] },
      { id: 'MG3', name: 'Corps entier', focus: 'Corps entier', ex: [['goblet-squat', 3, '10', 75], ['row', 3, '10', 75], ['step-up', 3, '8 / jambe', 60], ['farmer-walk', 3, '40 s', 45]] },
    ],
  },
  {
    id: 'meno-gentle', name: 'Mobilité, équilibre & marche', level: 'Débutant', place: 'home', days: 3, focus: ['menopause'], style: 'gentle', meno: true,
    desc: 'Pour reprendre en douceur : mobilité, équilibre, gainage et marche active.',
    sessions: [
      { id: 'MD1', name: 'Mobilité & équilibre', focus: 'Mobilité · Équilibre', ex: [['cat-cow', 2, '10', 20], ['hip-opener', 2, '30 s / jambe', 20], ['balance', 3, '30 s / jambe', 30], ['bird-dog', 2, '10', 30]] },
      { id: 'MD2', name: 'Marche active', focus: 'Cardio', ex: [['brisk-walk', 1, '30 min', 0]] },
      { id: 'MD3', name: 'Renforcement doux', focus: 'Jambes · Gainage', ex: [['wall-sit', 3, '30 s', 45], ['glute-bridge', 3, '12', 30], ['dead-bug', 2, '10', 30], ['balance', 2, '30 s / jambe', 30]] },
    ],
  },
];

function allPrograms() {
  return [...WORKOUT_PROGRAMS, ...MENO_PROGRAMS, ...(state.customPrograms || []), ...(state.quickProgram ? [state.quickProgram] : [])];
}
function findProgram(id) { return allPrograms().find((x) => x.id === id); }

function recommendedProgramId(p = state.profile || {}) {
  if (p.track === 'menopause') return p.trainPlace === 'gym' ? 'meno-gym' : 'meno-home';
  if (p.trainPlace === 'home') return Number(p.trainDays) >= 4 ? 'home-db-4' : p.goal === 'lose' ? 'home-burn-3' : 'home-full-3';
  if (p.trainPlace === 'gym') {
    if (p.muscleFocus === 'lower' && p.trainLevel !== 'advanced') return 'gym-glutes-3';
    if (p.muscleFocus === 'upper' && p.trainLevel !== 'beginner') return 'gym-upper-focus';
    if (p.trainLevel === 'beginner' && Number(p.trainDays) <= 2) return 'gym-beginner-2';
    if (p.trainLevel === 'advanced' && p.goal === 'gain') return 'gym-strength-3';
    if (Number(p.trainDays) >= 4 && p.trainLevel !== 'beginner') return p.goal === 'gain' ? 'gym-upper-focus' : 'gym-upper-lower-4';
    if (p.sex === 'female' && p.track !== 'muscle') return 'gym-glutes-3';
    return p.goal === 'gain' && p.trainLevel !== 'beginner' ? 'gym-ppl' : 'gym-full-3';
  }
  return 'home-full-3';
}

function currentProgram() {
  return findProgram(state.workoutProgram) || findProgram(recommendedProgramId()) || WORKOUT_PROGRAMS[0];
}

const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DEFAULT_DAYS = { 1: [3], 2: [1, 4], 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 5, 6], 6: [1, 2, 3, 4, 5, 6], 7: [1, 2, 3, 4, 5, 6, 0] };
function trainingDays() {
  const days = Array.isArray(state.trainingWeekdays) && state.trainingWeekdays.length ? state.trainingWeekdays : DEFAULT_DAYS[currentProgram().days] || DEFAULT_DAYS[3];
  return WEEKDAY_ORDER.filter((d) => days.includes(d));
}
function sessionForWeekday(weekday, program = currentProgram()) {
  const days = trainingDays();
  const idx = days.indexOf(weekday);
  if (idx < 0) return null;
  return program.sessions[idx % program.sessions.length];
}
function todaySession() { return hasTrainingPlan() ? sessionForWeekday(new Date().getDay()) : null; }
function weekStartKey() {
  const d = new Date();
  const diff = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diff);
  return todayKey(d);
}
function dateForWeekday(weekday) {
  const d = new Date();
  const diff = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diff + WEEKDAY_ORDER.indexOf(weekday));
  return d;
}
function doneOn(dayKey) { return (state.workoutLog || []).some((x) => x.day === dayKey); }

function nextSession(program = currentProgram()) {
  return todaySession() || program.sessions[(state.workoutLog || []).filter((x) => x.programId === program.id).length % program.sessions.length];
}

// Automatic progression: the same load completed in the last two sessions → suggest a small increase.
function suggestedLoad(exerciseId) {
  const loads = [...(state.workoutLog || [])].reverse().map((e) => Number(e.loads?.[exerciseId] || 0)).filter(Boolean).slice(0, 2);
  if (loads.length < 2 || loads[0] !== loads[1]) return 0;
  const lower = /(squat|leg|deadlift|rdl|hip|lunge|calf|press-jambe)/.test(exerciseId);
  return loads[0] + (lower ? 5 : 2.5);
}
function lastLoad(exerciseId) {
  const log = [...(state.workoutLog || [])].reverse();
  for (const entry of log) {
    const value = entry.loads?.[exerciseId];
    if (value) return value;
  }
  return '';
}

function weekWorkouts() {
  const start = weekStartKey();
  return new Set((state.workoutLog || []).filter((x) => x.day >= start).map((x) => x.day)).size;
}

function sessionExercises(program, session) {
  const swaps = state.exerciseSwaps?.[program.id]?.[session.id] || {};
  return session.ex.map((e, i) => (swaps[i] ? [swaps[i], ...e.slice(1)] : e));
}

function alternativesFor(exId, place) {
  const group = exGroup(exId);
  return Object.keys(EXERCISES).filter((id) => id !== exId && exGroup(id) === group && (place !== 'home' || EXERCISES[id].home));
}

let trainTab = 'mine';
let trainFocus = 'all';
let libGroup = 'all';
let builder = null;

function weekStrip() {
  const program = currentProgram();
  const todayWd = new Date().getDay();
  return `<div class="week-strip">${WEEKDAY_ORDER.map((wd) => {
    const s = sessionForWeekday(wd, program);
    const date = dateForWeekday(wd);
    const key = todayKey(date);
    const label = date.toLocaleDateString(locale(), { weekday: 'short' }).replace('.', '');
    return `<button class="wday ${wd === todayWd ? 'today' : ''} ${s ? 'train' : 'rest'} ${doneOn(key) ? 'done' : ''}" ${s ? `data-session="${esc(s.id)}" data-program="${esc(program.id)}"` : 'disabled'}><small>${esc(label)}</small><b>${date.getDate()}</b><i>${doneOn(key) ? '✓' : s ? esc(s.id) : '·'}</i></button>`;
  }).join('')}</div>`;
}

function hasTrainingPlan() { return Boolean(state.workoutProgram && findProgram(state.workoutProgram)); }
// ---- Training v4: quick quiz → matching programmes ------------------------------
const TQ = [
  ['goal', 'Votre objectif', [['fat', 'Perdre du gras', 'flame'], ['muscle', 'Prendre du muscle', 'dumbbell'], ['strength', 'Devenir plus fort(e)', 'trophy'], ['fitness', 'Remise en forme', 'heart'], ['gentle', 'Reprendre en douceur', 'leaf']]],
  ['place', 'Où vous entraînez-vous ?', [['gym', 'Salle de sport', 'dumbbell'], ['home', 'À la maison', 'home'], ['outdoor', 'Dehors', 'sun']]],
  ['level', 'Votre niveau', [['beginner', 'Débutant', ''], ['intermediate', 'Intermédiaire', ''], ['advanced', 'Confirmé', '']]],
  ['days', 'Jours par semaine', [['2', '2', ''], ['3', '3', ''], ['4', '4', ''], ['5', '5+', '']]],
  ['time', 'Temps par séance', [['20', '15–20 min', ''], ['30', '30 min', ''], ['45', '45 min', ''], ['60', '60 min +', '']]],
];
function trainQuiz() {
  const p = state.profile || {};
  const d = {
    goal: p.track === 'menopause' ? 'gentle' : p.track === 'muscle' ? 'muscle' : p.goal === 'lose' ? 'fat' : 'fitness',
    place: p.trainPlace === 'home' ? 'home' : p.trainPlace === 'outdoor' ? 'outdoor' : 'gym',
    level: ['beginner', 'intermediate', 'advanced'].includes(p.trainLevel) ? p.trainLevel : 'beginner',
    days: String(Math.min(5, Math.max(2, Number(p.trainDays) || 3))),
    time: String([20, 30, 45, 60].find((n) => n >= Number(p.sessionLength || 45)) || 45),
  };
  return { ...d, ...(state.trainQuiz || {}) };
}
const PROGRAM_GROUPS = [
  ['gym', 'Salle de sport · muscle & force', 'dumbbell'],
  ['glutes', 'Fessiers & bas du corps', 'flame'],
  ['home', 'À la maison', 'home'],
  ['cardio', 'Cardio & HIIT', 'heart'],
  ['gentle', 'Faible impact & plein air', 'leaf'],
  ['meno', 'Ménopause 40+ · force & os', 'flower'],
  ['custom', 'Mes programmes', 'user'],
];
function programGroup(x) {
  if (x.custom) return 'custom';
  if ((x.focus || []).includes('menopause') || /^meno-/.test(x.id)) return 'meno';
  if (x.style === 'gentle' || x.place === 'outdoor') return 'gentle';
  if (x.cardio) return 'cardio';
  if ((x.focus || []).includes('glutes')) return 'glutes';
  return x.place === 'home' ? 'home' : 'gym';
}
const LEVEL_KEY = { 'Débutant': 'beginner', 'Intermédiaire': 'intermediate', 'Confirmé': 'advanced', 'Tous niveaux': 'all' };
function programMatch(x, q) {
  const f = x.focus || [];
  const g = programGroup(x);
  let score = 0;
  const why = [];
  const placeOk = x.place === q.place || (q.place === 'outdoor' && x.place === 'home' && !x.cardio && x.style === 'gentle');
  if (x.place === q.place) { score += 35; why.push(q.place === 'gym' ? 'Salle' : q.place === 'home' ? 'Maison' : 'Extérieur'); } else if (placeOk || (q.place === 'outdoor' && x.place === 'home')) score += 15; else score -= 25;
  const goalOk = {
    fat: f.includes('fat') || x.cardio || x.style === 'fatloss',
    muscle: f.includes('muscle') || x.style === 'hypertrophy' || g === 'glutes',
    strength: f.includes('strength') || x.style === 'strength',
    fitness: f.includes('fitness') || x.cardio || g === 'home',
    gentle: g === 'gentle' || g === 'meno' || x.style === 'gentle',
  }[q.goal];
  if (goalOk) { score += 30; why.push(TQ[0][2].find((o) => o[0] === q.goal)[1]); }
  const lv = LEVEL_KEY[x.level] || 'all';
  if (lv === q.level || lv === 'all') { score += 15; why.push(x.level); } else if (q.level === 'beginner' && lv === 'advanced') score -= 25; else if (q.level === 'advanced' && lv === 'beginner') score -= 5; else score += 5;
  const days = Number(x.days || x.sessions.length);
  score += Math.max(0, 12 - 5 * Math.abs(days - Number(q.days)));
  if (Math.abs(days - Number(q.days)) <= 1) why.push(L('{n} j / sem.', { n: days }));
  const t = Number(q.time);
  if (t <= 20 && (x.id === 'hiit-15' || x.cardio)) score += 8;
  if (t >= 60 && (x.style === 'strength' || x.style === 'hypertrophy')) score += 5;
  if (state.profile?.track === 'menopause' && g === 'meno') score += 10;
  return { score: Math.max(5, Math.min(99, Math.round(score))), why };
}
// ---- Training v5: the person picks real weekdays and what to train each day ----------------
const DAY_FOCUS = [
  ['full', 'Corps entier', ['Jambes', 'Pectoraux', 'Dos', 'Fessiers', 'Épaules', 'Abdos & gainage']],
  ['upper', 'Haut du corps', ['Pectoraux', 'Dos', 'Épaules', 'Bras', 'Pectoraux', 'Dos']],
  ['lower', 'Bas du corps', ['Jambes', 'Fessiers', 'Jambes', 'Fessiers', 'Abdos & gainage']],
  ['legs', 'Jambes', ['Jambes', 'Jambes', 'Fessiers', 'Jambes', 'Jambes']],
  ['glutes', 'Fessiers', ['Fessiers', 'Fessiers', 'Jambes', 'Fessiers', 'Fessiers']],
  ['chest', 'Pectoraux', ['Pectoraux', 'Pectoraux', 'Épaules', 'Bras', 'Pectoraux']],
  ['back', 'Dos', ['Dos', 'Dos', 'Bras', 'Épaules', 'Dos']],
  ['shoulders', 'Épaules', ['Épaules', 'Épaules', 'Bras', 'Épaules', 'Abdos & gainage']],
  ['arms', 'Bras', ['Bras', 'Bras', 'Bras', 'Épaules', 'Bras']],
  ['push', 'Poussée (pecs, épaules, triceps)', ['Pectoraux', 'Épaules', 'Pectoraux', 'Bras', 'Épaules']],
  ['pull', 'Tirage (dos, biceps)', ['Dos', 'Dos', 'Bras', 'Épaules', 'Dos']],
  ['core', 'Abdos & gainage', ['Abdos & gainage', 'Abdos & gainage', 'Abdos & gainage', 'Mobilité & équilibre']],
  ['cardio', 'Cardio & HIIT', ['Cardio', 'Cardio', 'Abdos & gainage', 'Cardio', 'Jambes']],
  ['mobility', 'Mobilité & équilibre', ['Mobilité & équilibre', 'Mobilité & équilibre', 'Abdos & gainage', 'Mobilité & équilibre']],
];
const focusById = (id) => DAY_FOCUS.find((f) => f[0] === id) || DAY_FOCUS[0];
let trainMode = 'plan';
let todayFocus = null;
// Default split for N days, adapted to the goal; the person can change every day.
function suggestSplit(n, goal) {
  const g = goal || trainQuiz().goal;
  const glutes = g === 'gentle' ? false : state.profile?.sex === 'female' || state.profile?.muscleFocus === 'lower';
  const table = {
    1: ['full'],
    2: g === 'muscle' || g === 'strength' ? ['upper', 'lower'] : ['full', 'full'],
    3: g === 'muscle' || g === 'strength' ? (glutes ? ['lower', 'upper', 'glutes'] : ['push', 'pull', 'legs']) : g === 'gentle' ? ['full', 'mobility', 'full'] : glutes ? ['lower', 'upper', 'glutes'] : ['full', 'cardio', 'full'],
    4: glutes ? ['lower', 'upper', 'glutes', 'upper'] : ['upper', 'lower', 'upper', 'lower'],
    5: glutes ? ['legs', 'upper', 'glutes', 'push', 'lower'] : ['push', 'pull', 'legs', 'upper', 'lower'],
    6: ['push', 'pull', 'legs', 'push', 'pull', 'legs'],
    7: ['push', 'pull', 'legs', 'upper', 'lower', 'cardio', 'mobility'],
  };
  return table[Math.max(1, Math.min(7, n))] || table[3];
}
function trainPlan() {
  const tp = state.trainPlan || {};
  const days = Array.isArray(tp.days) ? WEEKDAY_ORDER.filter((d) => tp.days.includes(d)) : [];
  return { days, focus: tp.focus || {}, edited: tp.edited || {} };
}
// Days the person set by hand keep their choice; the others follow the suggested split.
function setPlanDays(days) {
  const ordered = WEEKDAY_ORDER.filter((d) => days.includes(d));
  const { focus: old, edited } = trainPlan();
  const split = suggestSplit(ordered.length);
  const focus = {};
  ordered.forEach((wd, i) => { focus[wd] = edited[wd] ? old[wd] : split[i]; });
  state.trainPlan = { days: ordered, focus, edited: Object.fromEntries(Object.entries(edited).filter(([wd]) => ordered.includes(Number(wd)))) };
}
function styleForGoal(goal, focusIds = []) {
  const id = goal === 'muscle' ? 'hypertrophy' : goal === 'strength' ? 'strength' : goal === 'fat' ? 'fatloss' : goal === 'gentle' ? 'gentle' : 'athletic';
  const s = COACH_STYLES.find((c) => c.id === (focusIds.every((f) => f === 'glutes') && focusIds.length ? 'glutes' : id)) || COACH_STYLES[0];
  return s;
}
// Builds one session from a focus: exercises from the library, filtered by place, sets by level.
function buildFocusSession(focusIds, opts, sid, usage = {}) {
  const q = opts;
  const style = styleForGoal(q.goal, focusIds);
  const per = { 20: 4, 30: 4, 45: 5, 60: 6 }[q.time] || 5;
  const groups = focusIds.flatMap((f) => focusById(f)[2]);
  const homeOnly = q.place !== 'gym';
  const pool = (g) => Object.keys(EXERCISES).filter((id) => exGroup(id) === g && (!homeOnly || EXERCISES[id].home));
  const levelAdj = q.level === 'beginner' ? -1 : q.level === 'advanced' ? 1 : 0;
  const ex = [];
  let guard = 0;
  while (ex.length < per && guard < 60) {
    const g = groups[guard % groups.length];
    const list = pool(g);
    if (list.length) {
      usage[g] = usage[g] || 0;
      for (let k = 0; k < list.length; k += 1) {
        const id = list[(usage[g] + k) % list.length];
        if (!ex.some((e) => e[0] === id)) {
          usage[g] += k + 1;
          const cardio = g === 'Cardio';
          const mob = g === 'Mobilité & équilibre';
          ex.push([id, cardio || mob ? Math.max(1, 2 + levelAdj) : Math.max(2, style.sets + levelAdj), cardio ? (id === 'brisk-walk' ? '15 min' : '40 s') : mob ? '30 s' : style.reps, cardio ? 20 : mob ? 20 : style.rest]);
          break;
        }
      }
    }
    guard += 1;
  }
  return { id: sid, name: focusIds.map((f) => focusById(f)[1]).join(' + '), focus: [...new Set(groups)].slice(0, 4).join(' · '), ex };
}
function buildPlanProgram() {
  const q = trainQuiz();
  const { days, focus } = trainPlan();
  const usage = {};
  const sessions = days.map((wd, i) => buildFocusSession([focus[wd] || 'full'], q, `S${i + 1}`, usage));
  const levelName = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Confirmé' }[q.level] || 'Sur mesure';
  return { id: `plan-${Date.now()}`, name: 'Mon planning', level: levelName, place: q.place === 'gym' ? 'gym' : q.place === 'outdoor' ? 'outdoor' : 'home', days: days.length, focus: ['custom'], style: styleForGoal(q.goal).id, custom: true, fromPlanner: true,
    desc: days.map((wd) => `${dateForWeekday(wd).toLocaleDateString(locale(), { weekday: 'short' }).replace('.', '')} : ${L(focusById(focus[wd])[1])}`).join(' · '), sessions };
}
function splitSummary() {
  const { days, focus } = trainPlan();
  const count = {};
  days.forEach((wd) => { const f = focus[wd] || 'full'; count[f] = (count[f] || 0) + 1; });
  return Object.entries(count).map(([f, n]) => `${L(focusById(f)[1])} ${n}×`).join(' · ');
}
function trainingPlanner() {
  const q = trainQuiz();
  const { days, focus } = trainPlan();
  const planned = hasTrainingPlan();
  const wdLabel = (wd, long = false) => esc(dateForWeekday(wd).toLocaleDateString(locale(), { weekday: long ? 'long' : 'short' }).replace('.', ''));
  const chips = (key, opts) => `<div class="tq-opts">${opts.map(([v, txt, ico]) => `<button class="${q[key] === v ? 'on' : ''}" data-tq="${key}:${v}">${ico ? icon(ico) : ''}${L(txt)}</button>`).join('')}</div>`;
  const modes = `<div class="tp-modes" role="tablist">
      <button class="${trainMode === 'plan' ? 'on' : ''}" data-train-mode="plan" role="tab" aria-selected="${trainMode === 'plan'}">${icon('calendar')}<span><b>${L('Suivre un planning')}</b><small>${L('Mes jours, ce que je travaille chaque jour')}</small></span></button>
      <button class="${trainMode === 'today' ? 'on' : ''}" data-train-mode="today" role="tab" aria-selected="${trainMode === 'today'}">${icon('flame')}<span><b>${L('M’entraîner maintenant')}</b><small>${L('Je choisis ce que je travaille aujourd’hui')}</small></span></button>
    </div>`;
  if (trainMode === 'today') {
    const sel = todayFocus || [];
    const plannedToday = planned ? todaySession() : null;
    return `${modes}
      <section class="tq">
        <div class="tq-q"><span class="tq-n">1</span><div><b>${L('Que voulez-vous travailler aujourd’hui ?')}</b><div class="tq-opts">${DAY_FOCUS.map(([id, label]) => `<button class="${sel.includes(id) ? 'on' : ''}" data-today-focus="${id}">${L(label)}</button>`).join('')}</div></div></div>
        <div class="tq-q"><span class="tq-n">2</span><div><b>${L('Temps disponible')}</b>${chips('time', TQ[4][2])}</div></div>
        <div class="tq-q"><span class="tq-n">3</span><div><b>${L('Où ?')}</b>${chips('place', TQ[1][2])}</div></div>
      </section>
      <button class="btn btn-lime btn-wide btn-xl" data-today-build ${sel.length ? '' : 'disabled'}>${icon('flame')} ${sel.length ? L('Créer ma séance du jour') : L('Choisissez au moins une zone')}</button>
      ${plannedToday ? `<button class="tp-follow" data-session="${esc(plannedToday.id)}" data-program="${esc(currentProgram().id)}">${icon('calendar')}<span><small>${L('Ou suivre mon planning')}</small><b>${esc(L(plannedToday.name))}</b></span>${icon('chevron')}</button>` : ''}`;
  }
  const ranked = [...WORKOUT_PROGRAMS, ...MENO_PROGRAMS].map((x) => ({ x, ...programMatch(x, { ...q, days: String(days.length || 3) }) })).sort((a, b) => b.score - a.score).slice(0, 3);
  return `${modes}
    <section class="tq">
      <div class="tq-q"><span class="tq-n">1</span><div><b>${L('Quels jours vous entraînez-vous ?')}</b>
        <div class="day-picker big">${WEEKDAY_ORDER.map((wd) => `<button class="${days.includes(wd) ? 'on' : ''}" data-plan-day="${wd}" aria-pressed="${days.includes(wd)}">${wdLabel(wd)}</button>`).join('')}</div>
        <small class="tp-count">${days.length ? L('{n} jours par semaine', { n: days.length }) : L('Touchez vos jours d’entraînement')}</small></div></div>
      ${days.length ? `<div class="tq-q"><span class="tq-n">2</span><div><b>${L('Que travaillez-vous chaque jour ?')}</b>
        <div class="tp-days">${days.map((wd) => `<label class="tp-day"><span>${wdLabel(wd, true)}</span><select data-plan-focus="${wd}">${DAY_FOCUS.map(([id, label]) => `<option value="${id}" ${focus[wd] === id ? 'selected' : ''}>${esc(L(label))}</option>`).join('')}</select></label>`).join('')}</div>
        <div class="tp-sum"><span>${icon('check')} ${esc(splitSummary())}</span><button class="link-btn" data-plan-suggest>${L('Suggestion automatique')}</button></div></div></div>` : ''}
      <div class="tq-q"><span class="tq-n">${days.length ? 3 : 2}</span><div><b>${L('Votre objectif')}</b>${chips('goal', TQ[0][2])}</div></div>
      <div class="tq-q"><span class="tq-n">${days.length ? 4 : 3}</span><div><b>${L('Où et à quel niveau ?')}</b>${chips('place', TQ[1][2])}${chips('level', TQ[2][2])}</div></div>
      <div class="tq-q"><span class="tq-n">${days.length ? 5 : 4}</span><div><b>${L('Temps par séance')}</b>${chips('time', TQ[4][2])}</div></div>
    </section>
    <button class="btn btn-lime btn-wide btn-xl" data-plan-build ${days.length ? '' : 'disabled'}>${icon('sparkle')} ${days.length ? L('Créer mon programme ({n} séances)', { n: days.length }) : L('Choisissez au moins un jour')}</button>
    <p class="fine center-fine">${L('Chaque séance est construite avec les exercices de la bibliothèque, adaptés à votre lieu et à votre niveau. Tout reste modifiable.')}</p>
    <div class="section-label"><h3>${L('Ou un programme prêt, sur vos jours')}</h3></div>
    <div class="tq-alt">${ranked.map((r) => `<div class="tq-alt-card"><span class="tq-mini-score">${r.score}%</span><span><b>${esc(L(r.x.name))}</b><small>${esc(L(r.x.level))} · ${L('{n} séances différentes', { n: r.x.sessions.length })}</small></span>${r.x.id === (planned ? currentProgram().id : '') ? '<em>✓</em>' : `<button class="btn btn-primary" data-workout-program="${esc(r.x.id)}">${L('Choisir')}</button>`}</div>`).join('')}</div>
    <button class="btn btn-ghost btn-wide" data-train-tab="programs">${icon('list')} ${L('Voir tous les programmes ({n})', { n: allPrograms().filter((x) => !x.quick).length })}</button>`;
}
function trainingQuiz() {
  const q = trainQuiz();
  const ranked = [...WORKOUT_PROGRAMS, ...MENO_PROGRAMS].map((x) => ({ x, ...programMatch(x, q) })).sort((a, b) => b.score - a.score);
  const [top, ...rest] = ranked;
  const current = hasTrainingPlan() ? currentProgram() : {};
  const opt = (attr, ico, title, sub) => `<button class="ts-opt" ${attr}>${icon(ico)}<span><b>${L(title)}</b><small>${L(sub)}</small></span>${icon('chevron')}</button>`;
  return `<section class="tq">
      <div class="tq-head"><h2>${L('Trouvons votre programme')}</h2><p>${L('5 réponses, les résultats changent à chaque choix. Rien n’est créé sans votre accord.')}</p></div>
      ${TQ.map(([key, label, opts], i) => `<div class="tq-q"><span class="tq-n">${i + 1}</span><div><b>${L(label)}</b><div class="tq-opts" role="radiogroup">${opts.map(([v, txt, ico]) => `<button class="${q[key] === v ? 'on' : ''}" role="radio" aria-checked="${q[key] === v}" data-tq="${key}:${v}">${ico ? icon(ico) : ''}${L(txt)}</button>`).join('')}</div></div></div>`).join('')}
    </section>
    <div class="section-label"><h3>${L('Votre meilleur choix')}</h3><span class="fine">${L('{n} programmes comparés', { n: ranked.length })}</span></div>
    <article class="tq-top">
      <div class="tq-score"><b>${top.score}%</b><small>${L('compatible')}</small></div>
      <small class="tq-group">${icon((PROGRAM_GROUPS.find((g) => g[0] === programGroup(top.x)) || PROGRAM_GROUPS[0])[2])} ${L((PROGRAM_GROUPS.find((g) => g[0] === programGroup(top.x)) || PROGRAM_GROUPS[0])[1])}</small>
      <h3>${esc(L(top.x.name))}</h3><p>${esc(L(top.x.desc || ''))}</p>
      <div class="tq-why">${top.why.map((w) => `<span>${icon('check')}${esc(L(w, null, false))}</span>`).join('')}</div>
      <div class="ts-sessions">${top.x.sessions.map((se) => `<button data-session="${esc(se.id)}" data-program="${esc(top.x.id)}"><b>${esc(L(se.name))}</b><small>${esc(L(se.focus))} · ${L('{n} exercices', { n: se.ex.length })}</small></button>`).join('')}</div>
      ${top.x.id === current.id ? `<span class="pc-current">✓ ${L('Programme actuel')}</span>` : `<button class="btn btn-lime btn-wide btn-xl" data-workout-program="${esc(top.x.id)}">${L('Commencer ce programme')}</button>`}
    </article>
    <div class="section-label"><h3>${L('Aussi adaptés à vous')}</h3></div>
    <div class="tq-alt">${rest.slice(0, 3).map((r) => `<div class="tq-alt-card"><span class="tq-mini-score">${r.score}%</span><span><b>${esc(L(r.x.name))}</b><small>${esc(L(r.x.level))} · ${L('{n} j / sem.', { n: r.x.days || r.x.sessions.length })}</small></span>${r.x.id === current.id ? `<em>✓</em>` : `<button class="btn btn-primary" data-workout-program="${esc(r.x.id)}">${L('Choisir')}</button>`}</div>`).join('')}</div>
    <button class="btn btn-ghost btn-wide" data-train-tab="programs">${icon('list')} ${L('Voir tous les programmes ({n})', { n: allPrograms().length })}</button>
    <div class="section-label"><h3>${L('Ou créez le vôtre')}</h3></div>
    <div class="ts-list">
      ${opt('data-train-create="grid"', 'calendar', 'Construire ma grille', 'Je choisis mes jours et mes exercices un par un')}
      ${opt('data-train-create="auto"', 'sparkle', 'Programme sur mesure', 'Je donne mes préférences, NutriPilot crée les séances')}
      ${opt('data-train-create="import"', 'book', 'Importer le programme de mon coach', 'Je colle mon programme, il devient mon agenda')}
    </div>`;
}
function trainingHistory() {
  const log = (state.workoutLog || []).slice().sort((a, b) => String(b.day).localeCompare(String(a.day)));
  const last30 = log.filter((w) => w.day >= addDays(-30));
  const weeks = Array.from({ length: 8 }, (_, i) => { const from = addDays(-(7 * (8 - i)) + 1); const to = addDays(-(7 * (7 - i))); return log.filter((w) => w.day >= from && w.day <= to).length; });
  const volume = (w) => Object.entries(w.loads || {}).reduce((sum, [id, kg]) => { const ex = (findProgram(w.programId)?.sessions.find((x) => x.id === w.sessionId)?.ex || []).find((e) => e[0] === id); const reps = parseInt(String(ex?.[2] || '10'), 10) || 10; return sum + Number(kg || 0) * Number(ex?.[1] || 3) * reps; }, 0);
  const prs = personalRecords();
  return `<div class="stat-grid">
      <div class="stat"><small>${L('Séances')}</small><b>${last30.length}</b><em>${L('30 derniers jours')}</em></div>
      <div class="stat"><small>${L('Série')}</small><b>${weekWorkouts()}/${trainingDays().length}</b><em>${L('cette semaine')}</em></div>
      <div class="stat"><small>${L('Volume estimé')}</small><b>${fmt(last30.reduce((s, w) => s + volume(w), 0) / 1000, 1)} t</b><em>${L('30 derniers jours')}</em></div>
      <div class="stat"><small>${L('Records')}</small><b>${prs.length}</b><em>${L('exercices suivis')}</em></div>
    </div>
    <div class="section-label"><h3>${L('Séances par semaine')}</h3></div>
    <div class="chart-card">${barChart(weeks.map((v, i) => ({ label: `S${i + 1}`, value: v, today: i === 7 })), Math.max(1, trainingDays().length), '', 'train')}</div>
    ${prs.length ? `<div class="section-label"><h3>${L('Records personnels')}</h3></div><div class="pr-list">${prs.slice(0, 8).map(([id, r]) => `<button class="pr" data-exercise="${esc(id)}">${EXERCISES[id] ? exAnim(id, 'xs') : ''}<span><b>${esc(L(exName(id)))}</b><small>${esc(dateLabel(r.day))}</small></span><em>${fmt(r.kg, 1)} kg</em></button>`).join('')}</div>` : ''}
    <div class="section-label"><h3>${L('Séances terminées')}</h3></div>
    ${log.length ? `<div class="nutrition-detail">${log.slice(0, 20).map((w) => { const pr = findProgram(w.programId); const se = pr?.sessions.find((x) => x.id === w.sessionId); return `<div><span>${esc(dateLabel(w.day))} · ${esc(L(se?.name || pr?.name || 'Séance'))}</span><b>${Object.keys(w.loads || {}).length ? L('{n} charges', { n: Object.keys(w.loads).length }) : '✓'}</b></div>`; }).join('')}</div>` : `<div class="empty">${L('Terminez votre première séance : elle apparaîtra ici avec vos charges.')}</div>`}`;
}
function trainingScreen() {
  const planned = hasTrainingPlan();
  const program = currentProgram();
  const today = planned ? todaySession() : null;
  // Order: choose (quiz) or my week first, then every programme, tools, and lessons last.
  if (trainTab === 'cardio') { trainTab = 'programs'; trainGroup = 'cardio'; }
  if (trainTab === 'quiz') trainTab = 'plan';
  if (trainTab === 'mine' && !planned) trainTab = 'plan';
  const tabs = [...(planned ? [['mine', 'Ma semaine']] : []), ['plan', planned ? 'Planifier / s’entraîner' : 'Planifier mes séances'], ['programs', 'Tous les programmes'], ['create', 'Créer'], ['library', 'Exercices'], ['history', 'Historique'], ['lessons', 'Leçons']];
  let body = '';
  if (trainTab === 'mine') body = trainingMine(program);
  else if (trainTab === 'plan') body = trainingPlanner();
  else if (trainTab === 'history') body = trainingHistory();
  else if (trainTab === 'programs') body = trainingPrograms(program);
  else if (trainTab === 'create') body = trainingCreate();
  else if (trainTab === 'lessons') body = trainingLessons();
  else body = trainingLibrary();
  return `<div class="mobile-app">
    ${appHeader('Entraînement')}
    <div class="screen">
      ${planned ? `<section class="train-hero">
        <div class="train-hero-top"><div><small>${L('Aujourd’hui')}</small><h2>${today ? esc(L(today.name)) : L('Jour de repos')}</h2><span>${today ? esc(L(today.focus)) : L('Récupération, marche ou mobilité')}</span></div><span class="train-count"><b>${weekWorkouts()}</b>/${trainingDays().length}</span></div>
        ${weekStrip()}
        ${today ? `<button class="btn btn-lime btn-wide" data-session="${esc(today.id)}" data-program="${esc(program.id)}">${L('Commencer la séance')}</button>` : `<button class="btn btn-ghost-dark btn-wide" data-session="${esc(nextSession(program).id)}" data-program="${esc(program.id)}">${L('Faire quand même : {name}', { name: esc(L(nextSession(program).name)) })}</button>`}
      </section>` : ''}
      <div class="tab-scroll mod-tabs">${tabs.map(([k, label]) => `<button class="${trainTab === k ? 'active' : ''}" data-train-tab="${k}">${L(label)}</button>`).join('')}</div>
      ${body}
    </div>
    ${bottom('training')}
  </div>`;
}

function trainingMine(program) {
  const days = trainingDays();
  return `
    <div class="program-banner">
      <div><small>${esc(L(program.level))} · ${L(program.place === 'home' ? 'Maison' : 'Salle')}</small><h3>${esc(L(program.name))}</h3><p>${esc(L(program.desc))}</p></div>
      <button class="link-btn" data-train-tab="programs">${L('Changer')}</button>
    </div>
    <div class="section-label"><h3>${L('Mes jours d’entraînement')}</h3><span class="fine">${L('{n} par semaine', { n: days.length })}</span></div>
    <div class="day-picker">${WEEKDAY_ORDER.map((wd) => `<button class="${days.includes(wd) ? 'on' : ''}" data-train-day="${wd}">${esc(dateForWeekday(wd).toLocaleDateString(locale(), { weekday: 'short' }).replace('.', ''))}</button>`).join('')}</div>
    <p class="fine">${L('Les séances du programme se répartissent automatiquement sur les jours choisis.')}</p>
    <div class="section-label"><h3>${L('Séances du programme')}</h3></div>
    <div class="guide-list">${program.sessions.map((s) => `<button class="guide-card" data-session="${esc(s.id)}" data-program="${esc(program.id)}"><span class="guide-check">${esc(s.id)}</span><span><b>${esc(L(s.name))}</b><small>${esc(L(s.focus))} · ${L('{n} exercices', { n: s.ex.length })}</small></span><span class="guide-arrow">→</span></button>`).join('')}</div>
    <button class="guide-card hub-link" data-guide="st-progress"><span class="guide-check">${icon('book')}</span><span><b>${L('Cours : Musculation, bien débuter')}</b><small>${L('5 leçons courtes pour progresser sans se blesser')}</small></span><span class="guide-arrow">→</span></button>
    <div class="fine center-fine">${L('Échauffez-vous 5 à 10 minutes avant chaque séance. Choisissez une charge qui vous laisse 1 à 2 répétitions en réserve. Arrêtez en cas de douleur et demandez un avis médical si vous avez un problème de santé.')}</div>`;
}

function programCard(x, current) {
  const style = COACH_STYLES.find((c) => c.id === x.style);
  return `<article class="program-card ${x.id === current.id ? 'current' : ''}">
    <div class="pc-top"><span class="pill">${esc(L(x.level))}</span><span class="pill">${L('{n} j / sem.', { n: x.days || x.sessions.length })}</span><span class="pill">${L(x.place === 'home' ? 'Maison' : x.place === 'outdoor' ? 'Extérieur' : 'Salle')}</span></div>
    <h3>${esc(L(x.name))}</h3>
    ${style ? `<small class="pc-style">${L('Style {name}', { name: esc(L(style.name)) })}</small>` : ''}
    <p>${esc(L(x.desc || ''))}</p>
    ${x.id === current.id ? `<span class="pc-current">✓ ${L('Programme actuel')}</span>` : `<button class="btn btn-primary btn-wide" data-workout-program="${esc(x.id)}">${L('Choisir ce programme')}</button>`}
  </article>`;
}

let trainGroup = 'all';
let trainPlace = 'all';
function programRow(x, current, reco) {
  const isCur = x.id === current.id;
  return `<article class="pr-card ${isCur ? 'current' : ''}">
    <div class="pr-main">
      <div class="pc-top">${x.id === reco ? `<span class="pill reco">${icon('star')} ${L('Recommandé')}</span>` : ''}<span class="pill">${esc(L(x.level))}</span><span class="pill">${L('{n} j / sem.', { n: x.days || x.sessions.length })}</span><span class="pill">${L(x.place === 'home' ? 'Maison' : x.place === 'outdoor' ? 'Extérieur' : 'Salle')}</span></div>
      <h3>${esc(L(x.name))}</h3>
      ${x.desc ? `<p>${esc(L(x.desc))}</p>` : ''}
    </div>
    <details><summary>${L('Voir les {n} séances', { n: x.sessions.length })}</summary>
      <div class="ts-sessions">${x.sessions.map((se) => `<button data-session="${esc(se.id)}" data-program="${esc(x.id)}"><b>${esc(L(se.name))}</b><small>${esc(L(se.focus))} · ${L('{n} exercices', { n: se.ex.length })}</small></button>`).join('')}</div>
    </details>
    ${isCur ? `<span class="pc-current">✓ ${L('Programme actuel')}</span>` : `<button class="btn btn-primary btn-wide" data-workout-program="${esc(x.id)}">${L('Choisir ce programme')}</button>`}
  </article>`;
}
let tqOpen = null;
function trainingPrograms(current) {
  const reco = recommendedProgramId();
  const all = allPrograms().filter((x) => !x.quick && (trainPlace === 'all' || x.place === trainPlace));
  const groups = PROGRAM_GROUPS.map(([id, label, ico]) => [id, label, ico, all.filter((x) => programGroup(x) === id)]).filter((g) => g[3].length);
  const shown = trainGroup === 'all' ? groups : groups.filter((g) => g[0] === trainGroup);
  const qOpen = tqOpen ?? !hasTrainingPlan();
  return `
    <details class="tq-fold" ${qOpen ? 'open' : ''}><summary data-tq-fold>${icon('sparkle')}<b>${L('Trouver mon programme')}</b>${icon('chevron')}</summary>${trainingQuiz()}</details>
    <div class="pg-filter">
      <div class="chip-row">${[['all', 'Partout'], ['gym', 'Salle'], ['home', 'Maison'], ['outdoor', 'Extérieur']].map(([k, label]) => `<button class="mini-choice ${trainPlace === k ? 'selected' : ''}" data-train-place="${k}">${L(label)}</button>`).join('')}</div>
      <div class="pg-cats">${[['all', 'Toutes les catégories', 'grid', all.length], ...groups.map((g) => [g[0], g[1], g[2], g[3].length])].map(([k, label, ico, n]) => `<button class="pg-cat ${trainGroup === k ? 'on' : ''}" data-train-group="${k}">${icon(ico)}<span>${L(label)}</span><em>${n}</em></button>`).join('')}</div>
    </div>
    ${shown.map(([id, label, ico, list]) => `<section class="pg-section" id="pg-${id}">
      <div class="section-label"><h3>${icon(ico)} ${L(label)}</h3><span class="fine">${list.length}</span></div>
      ${id === 'cardio' ? `<p class="fine">${L('L’OMS recommande 150 à 300 minutes d’activité modérée par semaine, ou 75 à 150 minutes d’activité intense, plus 2 séances de renforcement.')}</p>` : ''}
      <div class="program-list">${list.sort((a, b) => (b.id === reco) - (a.id === reco)).map((x) => programRow(x, current, reco)).join('')}</div>
    </section>`).join('') || `<div class="empty">${L('Aucun programme pour ce filtre.')}</div>`}
    <div class="section-label"><h3>${L('Styles de coaching')}</h3></div>
    <p class="screen-sub">${L('Chaque style correspond à une méthode d’entraînement. Choisissez-en un dans « Créer » pour générer un programme sur mesure.')}</p>
    <div class="style-grid">${COACH_STYLES.map((c) => `<button class="style-card" data-builder-style="${c.id}"><b>${esc(L(c.name))}</b><small>${esc(L(c.desc))}</small></button>`).join('')}</div>`;
}

const BUILDER_GROUPS = ['Jambes', 'Fessiers', 'Pectoraux', 'Dos', 'Épaules', 'Bras', 'Abdos & gainage', 'Cardio'];
function defaultBuilder() {
  const p = state.profile || {};
  return {
    days: trainingDays().slice(),
    place: p.trainPlace === 'home' ? 'home' : 'gym',
    duration: 45,
    style: p.track === 'muscle' ? 'hypertrophy' : p.goal === 'lose' ? 'fatloss' : 'athletic',
    freq: { Jambes: 2, Fessiers: p.sex === 'female' ? 2 : 1, Pectoraux: 2, Dos: 2, Épaules: 1, Bras: 1, 'Abdos & gainage': 2, Cardio: p.goal === 'lose' ? 2 : 0 },
  };
}

// ---- Training v3: library with animated demos, grid builder, lessons ------------
let libEquip = 'all';
let libQuery = '';
let createMode = 'grid';
let pickerState = null;
let restTimer = null;

function confirmSoft(button) {
  if (button.dataset.armed) return true;
  button.dataset.armed = '1';
  toast('Touchez encore pour retirer ce jour et ses exercices.');
  setTimeout(() => { delete button.dataset.armed; }, 2500);
  return false;
}
function exEquip(id) { return EXERCISES[id]?.equip || EQUIP_OF[id] || 'bw'; }
function exAnim(id, cls = '') { return `<span class="ex-anim ${cls}">${moveSvg(id, { equip: exEquip(id) })}</span>`; }
const REPS_CHOICES = ['5', '6–8', '8–10', '8–12', '10–12', '12–15', '15–20', '30 s', '45 s', '60 s', '10 min', '20 min'];

function libraryList(group, equip, query) {
  const q = foldText(query || '');
  return Object.keys(EXERCISES).filter((id) => (group === 'all' || exGroup(id) === group)
    && (equip === 'all' || exEquip(id) === equip || (equip === 'home' && EXERCISES[id].home))
    && (!q || foldText(L(EXERCISES[id].name, null, false)).includes(q) || foldText(EXERCISES[id].name).includes(q) || foldText(L(EXERCISES[id].muscle || '', null, false)).includes(q)));
}

function exCardHtml(id, attrs = `data-exercise="${esc(id)}"`, extra = '') {
  const ex = EXERCISES[id];
  return `<button class="lib-card" ${attrs}>${exAnim(id)}<span class="lib-info"><b>${esc(L(ex.name))}</b><small>${esc(L(ex.muscle || ''))}</small><span class="lib-tags"><i>${esc(L(EQUIPMENT[exEquip(id)] || ''))}</i>${ex.home ? `<i class="home">${L('Maison')}</i>` : ''}</span></span>${extra}</button>`;
}

function trainingLibrary() {
  const groups = [['all', 'Tous'], ...EX_GROUPS.map((g) => [g, g])];
  const equips = [['all', 'Tout matériel'], ['home', 'À la maison'], ...Object.entries(EQUIPMENT)];
  const list = libraryList(libGroup, libEquip, libQuery);
  return `
    <label class="search-box">${icon('search')}<input id="lib-search" type="search" value="${esc(libQuery)}" placeholder="${L('Rechercher un exercice ou un muscle')}"></label>
    <div class="chip-row">${groups.map(([k, label]) => `<button class="mini-choice ${libGroup === k ? 'selected' : ''}" data-lib-group="${esc(k)}">${L(label)}</button>`).join('')}</div>
    <div class="chip-row">${equips.map(([k, label]) => `<button class="mini-choice ghost ${libEquip === k ? 'selected' : ''}" data-lib-equip="${esc(k)}">${L(label)}</button>`).join('')}</div>
    <div class="section-label"><h3>${L('{n} exercices', { n: list.length })}</h3><span class="fine">${L('Touchez pour voir le mouvement')}</span></div>
    <div id="lib-grid" class="lib-grid">${list.map((id) => exCardHtml(id)).join('') || `<div class="empty">${L('Aucun exercice pour ce filtre.')}</div>`}</div>`;
}

function exerciseSheet(id) {
  const ex = EXERCISES[id];
  const used = allPrograms().filter((p) => p.sessions.some((s) => s.ex.some((e) => e[0] === id)));
  const history = (state.workoutLog || []).filter((w) => w.loads?.[id]).slice(-6);
  return `<div class="sheet-head"><div><span class="tag">${esc(L(exGroup(id)))}</span><h2>${esc(L(ex.name))}</h2><div class="fine">${esc(L(ex.muscle))} · ${esc(L(EQUIPMENT[exEquip(id)] || ''))}</div></div><button class="icon-btn" data-close>×</button></div>
    <div class="ex-demo">${moveSvg(id, { equip: exEquip(id) })}<span class="demo-badge">${L('Démonstration animée')}</span></div>
    <div class="section-label"><h3>${L('Exécution')}</h3></div>
    <ol class="steps-list">${(ex.cues || []).map((c) => `<li>${esc(L(c))}</li>`).join('')}</ol>
    <div class="ex-reco">
      <div><b>${L('Force')}</b><small>4 × 4–6 · ${L('repos {t}', { t: '2–3 min' })}</small></div>
      <div><b>${L('Muscle')}</b><small>3 × 8–12 · ${L('repos {t}', { t: '60–90 s' })}</small></div>
      <div><b>${L('Endurance')}</b><small>2 × 15–20 · ${L('repos {t}', { t: '30–45 s' })}</small></div>
    </div>
    ${history.length ? `<div class="section-label"><h3>${L('Vos charges')}</h3></div><div class="load-history">${history.map((w) => `<span><b>${fmt(w.loads[id], 1)} kg</b><small>${esc(dateLabel(w.day))}</small></span>`).join('')}</div>` : lastLoad(id) ? `<div class="warn success">${L('Dernière charge : {n} kg', { n: lastLoad(id) })}</div>` : ''}
    ${used.length ? `<div class="section-label"><h3>${L('Dans les programmes')}</h3></div><div class="chip-row wrap">${used.slice(0, 6).map((p) => `<span class="pill">${esc(L(p.name))}</span>`).join('')}</div>` : ''}
    <div class="modal-actions"><button class="btn btn-ghost" data-close>${L('Fermer')}</button><button class="btn btn-lime" data-grid-add-ex="${esc(id)}">${icon('plus')} ${L('Ajouter à ma grille')}</button></div>`;
}

function restLabel(rest) {
  if (!rest) return '';
  return L('repos {t}', { t: rest >= 60 ? (rest % 60 ? `${Math.floor(rest / 60)} min ${String(rest % 60).padStart(2, '0')}` : `${rest / 60} min`) : `${rest} s` });
}

function sessionSheet(sessionId, programId) {
  const program = findProgram(programId) || currentProgram();
  const session = program.sessions.find((x) => x.id === sessionId) || program.sessions[0];
  const exs = sessionExercises(program, session);
  const totalSets = exs.reduce((s, e) => s + Number(e[1] || 0), 0);
  const minutes = Math.round(exs.reduce((s, e) => s + Number(e[1] || 0) * (45 + Number(e[3] || 60)), 0) / 60);
  return `<div class="sheet-head"><div><span class="tag">${esc(L(program.name))}</span><h2>${esc(L(session.name))}</h2><div class="fine">${esc(L(session.focus))}</div></div><button class="icon-btn" data-close>×</button></div>
    <div class="session-meta"><span>${icon('dumbbell')} ${L('{n} exercices', { n: exs.length })}</span><span>${icon('list')} ${L('{n} séries', { n: totalSets })}</span><span>${icon('timer')} ≈ ${minutes} min</span></div>
    <div class="session-list">${exs.map(([id, sets, reps, rest], index) => {
      const ex = EXERCISES[id] || { name: exName(id), muscle: '', cues: [] };
      return `<details class="ex-card" ${index === 0 ? 'open' : ''}>
        <summary>${EXERCISES[id] ? exAnim(id, 'sm') : `<span class="ex-num">${index + 1}</span>`}<span class="ex-main"><b>${esc(L(ex.name))}</b><small>${sets} × ${esc(L(reps))}${rest ? ` · ${restLabel(rest)}` : ''}</small></span><span class="ex-chev">${icon('chevron')}</span></summary>
        ${EXERCISES[id] ? `<div class="ex-demo sm">${moveSvg(id, { equip: exEquip(id) })}</div>` : ''}
        ${(ex.cues || []).length ? `<ul class="guide-points">${ex.cues.map((c) => `<li>${esc(L(c))}</li>`).join('')}</ul>` : ''}
        <div class="set-dots">${Array.from({ length: Number(sets) || 1 }, (_, s) => `<button class="set-dot" data-set-dot="${esc(id)}-${s}" aria-label="${L('Série {n}', { n: s + 1 })}">${s + 1}</button>`).join('')}</div>
        <div class="ex-actions">
          <label class="ex-load">${L('Charge utilisée (kg)')} <input type="number" inputmode="decimal" min="0" step="0.5" data-load="${esc(id)}" value="${esc(lastLoad(id))}" placeholder="—"></label>${suggestedLoad(id) ? `<small class="prog-hint">${icon('progress')} ${L('Progression suggérée : {n} kg si toutes vos répétitions passent.', { n: fmt(suggestedLoad(id), 1) })}</small>` : ''}
          ${rest ? `<button class="chip-btn" data-rest="${Number(rest)}">${icon('timer')} ${L('Repos')}</button>` : ''}
          ${EXERCISES[id] ? `<button class="chip-btn" data-swap-ex="${index}" data-program="${esc(program.id)}" data-session-id="${esc(session.id)}">${L('Remplacer l’exercice')}</button>` : ''}
        </div>
      </details>`;
    }).join('')}</div>
    <button class="btn btn-primary btn-wide" data-finish-session="${esc(session.id)}" data-program="${esc(program.id)}">✓ ${L('Terminer la séance')}</button>`;
}

function startRest(seconds) {
  clearInterval(restTimer?.id);
  document.querySelector('.rest-pill')?.remove();
  const el = document.createElement('div');
  el.className = 'rest-pill';
  document.body.appendChild(el);
  const end = Date.now() + seconds * 1000;
  const tick = () => {
    const left = Math.max(0, Math.round((end - Date.now()) / 1000));
    el.innerHTML = `${icon('timer')}<b>${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}</b><span>${L('Repos')}</span><button aria-label="${L('Fermer')}">×</button><i style="width:${(1 - left / seconds) * 100}%"></i>`;
    el.querySelector('button').onclick = () => { clearInterval(restTimer.id); el.remove(); };
    if (left <= 0) {
      clearInterval(restTimer.id);
      haptic('warning');
      el.classList.add('done');
      el.querySelector('span').textContent = L('C’est reparti !');
      setTimeout(() => el.remove(), 2500);
    }
  };
  restTimer = { id: setInterval(tick, 250) };
  tick();
}

// ---- Grid builder (manual weekly schedule) ------------------------------------
function gridDraft() {
  if (!state.gridDraft) state.gridDraft = { name: '', days: [] };
  return state.gridDraft;
}
function gridFromProgram(program) {
  const days = trainingDays();
  const wds = program.sessions.map((_, i) => days[i] ?? WEEKDAY_ORDER[(i * 2) % 7]);
  state.gridDraft = {
    name: L(program.name),
    days: program.sessions.map((s, i) => ({ wd: wds[i], name: L(s.name), ex: sessionExercises(program, s).map((e) => [...e]) })).sort((a, b) => WEEKDAY_ORDER.indexOf(a.wd) - WEEKDAY_ORDER.indexOf(b.wd)),
    editing: program.custom ? program.id : '',
  };
}

function trainingCreate() {
  const modes = [['grid', 'calendar', 'Monter ma grille', 'Choisissez vos jours et vos exercices, un par un.'], ['auto', 'sparkle', 'Générateur intelligent', 'Vos préférences, NutriPilot construit les séances.'], ['import', 'book', 'Importer', 'Le programme de votre coach ou votre plan alimentaire.']];
  return `<div class="mode-cards">${modes.map(([k, ico, title, sub]) => `<button class="mode-card ${createMode === k ? 'on' : ''}" data-create-mode="${k}">${icon(ico)}<b>${L(title)}</b><small>${L(sub)}</small></button>`).join('')}</div>
    ${createMode === 'grid' ? gridBuilderHtml() : createMode === 'auto' ? trainingAutoBuilder() : trainingImport()}`;
}

function gridBuilderHtml() {
  const g = gridDraft();
  const used = new Set(g.days.map((d) => d.wd));
  const templates = [...WORKOUT_PROGRAMS, ...(state.customPrograms || [])];
  return `<section class="create-card grid-card">
      <h3>${icon('calendar')} ${L('Ma grille d’entraînement')}</h3>
      <p class="screen-sub">${L('Touchez les jours où vous vous entraînez, puis ajoutez les exercices de chaque séance. Toute la bibliothèque est disponible, avec la démonstration de chaque mouvement.')}</p>
      <input class="text-input" id="grid-name" value="${esc(g.name)}" placeholder="${L('Nom de ma grille (ex. Ma routine 4 jours)')}">
      <div class="field-label">${L('Jours d’entraînement')}</div>
      <div class="day-picker">${WEEKDAY_ORDER.map((wd) => `<button class="${used.has(wd) ? 'on' : ''}" data-grid-day="${wd}">${esc(dateForWeekday(wd).toLocaleDateString(locale(), { weekday: 'short' }).replace('.', ''))}</button>`).join('')}</div>
      <div class="field-label">${L('Partir d’un modèle')}</div>
      <div class="chip-row">${templates.map((p) => `<button class="mini-choice ghost" data-grid-template="${esc(p.id)}">${esc(L(p.name))}</button>`).join('')}</div>
    </section>
    ${g.days.length ? g.days.map((d, di) => `<section class="grid-day">
      <div class="grid-day-head"><span class="wd">${esc(dateForWeekday(d.wd).toLocaleDateString(locale(), { weekday: 'long' }))}</span><input class="text-input slim" data-grid-session-name="${di}" value="${esc(d.name)}" placeholder="${L('Nom de la séance')}"></div>
      ${d.ex.length ? `<div class="grid-ex-list">${d.ex.map(([id, sets, reps], ei) => `<div class="grid-ex">
        <button class="grid-ex-main" data-exercise="${esc(id)}">${EXERCISES[id] ? exAnim(id, 'xs') : ''}<span><b>${esc(L(exName(id)))}</b><small>${esc(L(exGroup(id)))}</small></span></button>
        <div class="grid-ex-ctrl">
          <div class="stepper sm"><button data-grid-sets="${di}:${ei}" data-delta="-1" aria-label="−">${icon('minus')}</button><b>${sets}×</b><button data-grid-sets="${di}:${ei}" data-delta="1" aria-label="+">${icon('plus')}</button></div>
          <select data-grid-reps="${di}:${ei}">${REPS_CHOICES.map((r) => `<option value="${r}" ${String(reps) === r ? 'selected' : ''}>${esc(L(r))}</option>`).join('')}${REPS_CHOICES.includes(String(reps)) ? '' : `<option selected value="${esc(reps)}">${esc(L(String(reps)))}</option>`}</select>
          <button class="icon-btn sm" data-grid-move="${di}:${ei}" data-delta="-1" aria-label="${L('Monter')}" ${ei === 0 ? 'disabled' : ''}>↑</button>
          <button class="icon-btn sm" data-grid-remove="${di}:${ei}" aria-label="${L('Retirer')}">${icon('close')}</button>
        </div>
      </div>`).join('')}</div>` : `<div class="empty slim">${L('Aucun exercice pour l’instant.')}</div>`}
      <button class="btn btn-ghost btn-wide" data-grid-pick="${di}">${icon('plus')} ${L('Ajouter un exercice')}</button>
    </section>`).join('') : `<div class="empty">${L('Choisissez au moins un jour pour commencer votre grille.')}</div>`}
    ${g.days.length ? `<button class="btn btn-lime btn-wide btn-xl" data-grid-save>${L(g.editing ? 'Mettre à jour ma grille' : 'Enregistrer ma grille')}</button>` : ''}`;
}

function exPickerSheet() {
  const ps = pickerState;
  const groups = [['all', 'Tous'], ...EX_GROUPS.map((g) => [g, g])];
  const list = libraryList(ps.group, ps.equip, ps.query);
  const day = gridDraft().days[ps.day];
  return `<div class="sheet-head"><div><span class="tag">${esc(day ? dateForWeekday(day.wd).toLocaleDateString(locale(), { weekday: 'long' }) : '')}</span><h2>${L('Ajouter un exercice')}</h2><div class="fine">${L('{n} dans cette séance', { n: day?.ex.length || 0 })}</div></div><button class="icon-btn" data-close>×</button></div>
    <label class="search-box">${icon('search')}<input id="picker-search" type="search" value="${esc(ps.query)}" placeholder="${L('Rechercher un exercice ou un muscle')}"></label>
    <div class="chip-row">${groups.map(([k, label]) => `<button class="mini-choice ${ps.group === k ? 'selected' : ''}" data-pick-group="${esc(k)}">${L(label)}</button>`).join('')}</div>
    <div class="chip-row">${[['all', 'Tout matériel'], ['home', 'À la maison'], ...Object.entries(EQUIPMENT)].map(([k, label]) => `<button class="mini-choice ghost ${ps.equip === k ? 'selected' : ''}" data-pick-equip="${esc(k)}">${L(label)}</button>`).join('')}</div>
    <div id="picker-grid" class="lib-grid">${pickerGridHtml(list, day)}</div>
    <button class="btn btn-primary btn-wide sticky-bottom" data-close>${L('Terminé')}</button>`;
}
function pickerGridHtml(list, day) {
  const inDay = new Set((day?.ex || []).map((e) => e[0]));
  return list.map((id) => exCardHtml(id, `data-pick-ex="${esc(id)}"`, `<span class="pick-mark ${inDay.has(id) ? 'on' : ''}">${inDay.has(id) ? icon('check') : icon('plus')}</span>`)).join('') || `<div class="empty">${L('Aucun exercice pour ce filtre.')}</div>`;
}

function defaultSetsFor(id) {
  if (exGroup(id) === 'Cardio') return [1, exEquip(id) === 'cardio' ? '20 min' : '45 s', 0];
  if (exGroup(id) === 'Mobilité & équilibre') return [2, '30 s', 30];
  if (['Jambes', 'Pectoraux', 'Dos', 'Fessiers'].includes(exGroup(id)) && ['bar', 'machine'].includes(exEquip(id))) return [4, '8–10', 120];
  return [3, '10–12', 75];
}

function saveGrid() {
  const g = gridDraft();
  const name = ($('#grid-name')?.value || g.name || '').trim() || L('Ma grille');
  const days = g.days.filter((d) => d.ex.length);
  if (!days.length) return toast('Ajoutez au moins un exercice.');
  const id = g.editing || `grid-${Date.now().toString(36)}`;
  const program = {
    id, custom: true, grid: true, name, level: 'Sur mesure', place: days.every((d) => d.ex.every(([x]) => EXERCISES[x]?.home)) ? 'home' : 'gym', days: days.length, focus: [], style: '',
    desc: L('Votre grille : {n} séances par semaine.', { n: days.length }),
    sessions: days.map((d, i) => ({ id: `G${i + 1}`, name: d.name || L('Séance {n}', { n: i + 1 }), focus: [...new Set(d.ex.map(([x]) => L(exGroup(x))))].slice(0, 3).join(' · '), ex: d.ex.map((e) => [...e]) })),
  };
  state.customPrograms = [...(state.customPrograms || []).filter((p) => p.id !== id), program];
  state.workoutProgram = id;
  state.trainingWeekdays = days.map((d) => d.wd);
  state.gridDraft = { ...g, editing: id, name };
  if (state.exerciseSwaps) delete state.exerciseSwaps[id];
  saveState();
  trainTab = 'mine';
  toast('Votre programme est prêt ✓');
  render();
}

function trainingAutoBuilder() {
  builder = builder || defaultBuilder();
  const b = builder;
  return `<section class="create-card">
      <h3>${icon('sparkle')} ${L('Créer mon programme sur mesure')}</h3>
      <p class="screen-sub">${L('Choisissez vos jours, votre lieu, votre style et combien de fois par semaine travailler chaque zone. NutriPilot construit les séances.')}</p>
      <div class="field-label">${L('Jours d’entraînement')}</div>
      <div class="day-picker">${WEEKDAY_ORDER.map((wd) => `<button class="${b.days.includes(wd) ? 'on' : ''}" data-b-day="${wd}">${esc(dateForWeekday(wd).toLocaleDateString(locale(), { weekday: 'short' }).replace('.', ''))}</button>`).join('')}</div>
      <div class="field-label">${L('Lieu')}</div>
      <div class="chip-row">${[['gym', 'Salle de sport'], ['home', 'Maison']].map(([k, l]) => `<button class="mini-choice ${b.place === k ? 'selected' : ''}" data-b-place="${k}">${L(l)}</button>`).join('')}</div>
      <div class="field-label">${L('Durée d’une séance')}</div>
      <div class="chip-row">${[30, 45, 60, 75].map((m) => `<button class="mini-choice ${b.duration === m ? 'selected' : ''}" data-b-duration="${m}">${m} min</button>`).join('')}</div>
      <div class="field-label">${L('Style de coaching')}</div>
      <div class="chip-row">${COACH_STYLES.map((c) => `<button class="mini-choice ${b.style === c.id ? 'selected' : ''}" data-b-style="${c.id}">${L(c.name)}</button>`).join('')}</div>
      <div class="field-label">${L('Fréquence par zone (fois par semaine)')}</div>
      <div class="freq-list">${BUILDER_GROUPS.map((g) => `<div class="freq-row"><span>${L(g)}</span><div class="stepper"><button data-b-freq="${esc(g)}" data-delta="-1" aria-label="−">${icon('minus')}</button><b>${b.freq[g] || 0}×</b><button data-b-freq="${esc(g)}" data-delta="1" aria-label="+">${icon('plus')}</button></div></div>`).join('')}</div>
      <button class="btn btn-lime btn-wide btn-xl" data-build-program>${L('Générer mon programme')}</button>
    </section>`;
}

function trainingImport() {
  return `<section class="create-card">
      <h3>${icon('book')} ${L('Importer mon programme')}</h3>
      <p class="screen-sub">${L('Vous suivez déjà le programme de votre coach ou le vôtre ? Collez-le ici, tel quel. NutriPilot le transforme en séances avec agenda et suivi des charges.')}</p>
      <textarea id="import-training" rows="6" placeholder="${L('Ex. Lundi : squat 4x8, presse 3x12, leg curl 3x12. Mercredi : développé couché 4x8, rowing 4x10…')}"></textarea>
      <button class="btn btn-primary btn-wide" data-import-plan="training">${L('Importer en séances')}</button>
    </section>
    <section class="create-card">
      <h3>${icon('fork')} ${L('Importer mon plan alimentaire')}</h3>
      <p class="screen-sub">${L('Vous avez déjà un plan de votre diététicien(ne) ? Collez-le : il devient votre plan de repas, avec liste de courses.')}</p>
      <textarea id="import-nutrition" rows="5" placeholder="${L('Ex. Petit-déjeuner : 2 œufs, pain complet… Déjeuner : poulet 150 g, riz 120 g, légumes…')}"></textarea>
      <button class="btn btn-primary btn-wide" data-import-plan="nutrition">${L('Importer mon plan')}</button>
    </section>`;
}

function trainingLessons() {
  const read = new Set(state.guidesRead || []);
  const cols = GUIDE_COLLECTIONS.filter((c) => ['movement', 'strength'].includes(c.id));
  return cols.map((c) => courseCardHtml(c, read)).join('')
    + `<div class="fine center-fine">${L('Échauffez-vous 5 à 10 minutes avant chaque séance. Choisissez une charge qui vous laisse 1 à 2 répétitions en réserve. Arrêtez en cas de douleur et demandez un avis médical si vous avez un problème de santé.')}</div>`;
}

function courseCardHtml(c, read = new Set(state.guidesRead || [])) {
  const cDone = c.guides.filter((g) => read.has(g.id)).length;
  return `<div class="course-card">
    <div class="course-head"><div><span class="tag">${esc(L(c.level || 'Cours'))}</span><h3>${esc(L(c.title))}</h3><p>${esc(L(c.sub))}</p></div><span class="course-count">${cDone}/${c.guides.length}</span></div>
    <div class="progress"><i style="width:${Math.round(cDone / c.guides.length * 100)}%"></i></div>
    <div class="guide-list">${c.guides.map((g, index) => {
      const access = lessonAccess({ ...g, index, tier: c.tier });
      const locked = access === 'paywall' || access === 'upgrade';
      return `<button class="guide-card ${read.has(g.id) ? 'read' : ''} ${locked ? 'locked' : ''}" data-guide="${esc(g.id)}">${g.demo && EXERCISES[g.demo] ? exAnim(g.demo, 'xs') : `<span class="guide-check">${read.has(g.id) ? icon('check') : locked ? icon('lock') : index + 1}</span>`}<span><b>${esc(L(g.title))}</b><small>${L('{time} de lecture', { time: g.time })}${access === 'free' ? ` · ${L('Leçon gratuite')}` : ''}</small></span><span class="guide-arrow">${read.has(g.id) ? icon('check') : locked ? icon('lock') : '→'}</span></button>`;
    }).join('')}</div>
  </div>`;
}

GUIDE_COLLECTIONS.push({
  id: 'movement', tier: 'training', level: 'Cours', title: 'Technique des mouvements', sub: 'Les gestes de base de la musculation, expliqués et animés.',
  guides: [
    { id: 'mv-brace', demo: 'plank', title: 'Respiration et gainage', time: '2 min', intro: 'Un tronc solide protège le dos et rend chaque mouvement plus fort.', points: ['Inspirez par le ventre avant l’effort, comme pour gonfler une ceinture.', 'Serrez les abdominaux comme si quelqu’un allait vous pousser.', 'Soufflez pendant la phase la plus difficile du mouvement.'], action: 'Faites 3 gainages de 30 secondes en respirant calmement.' },
    { id: 'mv-squat', demo: 'goblet-squat', title: 'Bien squatter', time: '3 min', intro: 'Le squat est le roi des exercices pour les jambes et les fessiers.', points: ['Pieds largeur d’épaules, pointes légèrement ouvertes.', 'Descendez en poussant les hanches en arrière, genoux dans l’axe des pieds.', 'Gardez les talons au sol et le dos neutre, remontez en poussant le sol.'], action: 'Faites 2 séries de 10 squats goblet légers en vous filmant de profil.' },
    { id: 'mv-hinge', demo: 'rdl', title: 'La charnière de hanche', time: '3 min', intro: 'Savoir plier aux hanches, c’est la base du soulevé de terre et d’un dos en bonne santé.', points: ['Genoux souples, poussez les fesses vers le mur derrière vous.', 'La barre ou les haltères glissent le long des jambes.', 'Le dos reste plat : arrêtez la descente quand il commence à s’arrondir.'], action: 'Entraînez le geste avec un bâton le long du dos : tête, haut du dos et bassin restent en contact.' },
    { id: 'mv-push', demo: 'bench', title: 'Pousser sans douleur d’épaule', time: '2 min', intro: 'Développés et pompes demandent des épaules stables.', points: ['Serrez les omoplates et descendez-les vers les poches arrière.', 'Coudes à environ 45° du corps, pas à 90°.', 'Contrôlez la descente en 2 secondes.'], action: 'Faites 2 séries de pompes inclinées en gardant les coudes à 45°.' },
    { id: 'mv-pull', demo: 'lat-pulldown', title: 'Tirer avec le dos, pas avec les bras', time: '2 min', intro: 'Pour un dos large et une posture droite, le mouvement part des omoplates.', points: ['Commencez chaque tirage en abaissant et rapprochant les omoplates.', 'Pensez à amener les coudes vers les hanches.', 'Gardez la poitrine haute, sans balancer.'], action: 'Sur votre prochain tirage, marquez une pause d’une seconde en fin de mouvement.' },
    { id: 'mv-warmup', demo: 'jumping', title: 'L’échauffement en 6 minutes', time: '2 min', intro: 'Un bon échauffement améliore la performance et limite les blessures.', points: ['2 minutes de cardio léger pour monter la température.', '2 minutes de mobilité : hanches, épaules, chevilles.', '2 séries légères du premier exercice de la séance.'], action: 'Utilisez cette routine avant votre prochaine séance.' },
  ],
});




function buildCustomProgram(b) {
  const style = COACH_STYLES.find((c) => c.id === b.style) || COACH_STYLES[0];
  const days = WEEKDAY_ORDER.filter((d) => b.days.includes(d));
  const n = Math.max(1, days.length);
  const perSession = { 30: 4, 45: 5, 60: 6, 75: 7 }[b.duration] || 5;
  const slots = [];
  BUILDER_GROUPS.forEach((g) => { for (let i = 0; i < (b.freq[g] || 0); i += 1) slots.push(g); });
  const daysGroups = Array.from({ length: n }, () => []);
  slots.sort((a, c) => BUILDER_GROUPS.indexOf(a) - BUILDER_GROUPS.indexOf(c));
  let cursor = 0;
  slots.forEach((g) => {
    for (let tries = 0; tries < n; tries += 1) {
      const d = (cursor + tries) % n;
      if (!daysGroups[d].includes(g)) { daysGroups[d].push(g); cursor = d + 1; return; }
    }
    daysGroups[cursor % n].push(g); cursor += 1;
  });
  const pools = {};
  const usage = {};
  const pick = (g) => {
    pools[g] = pools[g] || Object.keys(EXERCISES).filter((id) => exGroup(id) === g && (b.place !== 'home' || EXERCISES[id].home));
    const list = pools[g];
    if (!list.length) return null;
    usage[g] = (usage[g] || 0) + 1;
    return list[(usage[g] - 1) % list.length];
  };
  const big = ['Jambes', 'Fessiers', 'Pectoraux', 'Dos'];
  const sessions = daysGroups.map((groups, i) => {
    const order = groups.length ? groups : ['Abdos & gainage'];
    const ex = [];
    let guard = 0;
    while (ex.length < perSession && guard < 40) {
      const g = order[guard % order.length];
      const id = pick(g);
      if (id && !ex.some((e) => e[0] === id)) {
        const cardio = g === 'Cardio';
        const isBig = big.includes(g) && ex.filter((e) => exGroup(e[0]) === g).length === 0;
        ex.push([id, cardio ? 1 : style.sets + (isBig && style.id !== 'gentle' ? 1 : 0), cardio ? (id === 'brisk-walk' ? '20 min' : '40 s') : style.reps, cardio ? 0 : style.rest]);
      }
      guard += 1;
      if (!big.includes(g) && ex.filter((e) => exGroup(e[0]) === g).length >= 2 && order.length > 1) order.push(order.shift());
    }
    return { id: `S${i + 1}`, name: order.slice(0, 2).join(' & '), focus: order.join(' · '), ex };
  });
  return {
    id: `custom-${Date.now()}`, name: 'Mon programme sur mesure', level: 'Sur mesure', place: b.place, days: n, focus: ['custom'], style: style.id, custom: true,
    desc: `${L('Style {name}', { name: L(style.name) })} · ${b.duration} min`, sessions,
  };
}

function parseTrainingText(text) {
  const lines = String(text || '').split(/\n|;/).map((x) => x.trim()).filter(Boolean);
  const sessions = [];
  let cur = null;
  const dayRe = /^(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|monday|tuesday|wednesday|thursday|friday|saturday|sunday|lunes|martes|miércoles|jueves|viernes|sábado|domingo|segunda|terça|quarta|quinta|sexta|sábado|domingo|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|lunedì|martedì|mercoledì|giovedì|venerdì|sabato|domenica|jour|day|día|dia|tag|giorno|séance|seance|session|treino|training|entreno|allenamento)\b/i;
  const exRe = /(.+?)\s*[:\-–]?\s*(\d+)\s*[x×*]\s*(\d+(?:\s*[-–]\s*\d+)?)/i;
  for (const raw of lines) {
    const parts = raw.split(/,(?![^(]*\))/).map((x) => x.trim()).filter(Boolean);
    for (const part of parts) {
      const head = part.split(':')[0];
      if (dayRe.test(head) && (!exRe.test(part) || part.indexOf(':') > -1)) {
        cur = { id: `I${sessions.length + 1}`, name: head.trim().slice(0, 40), focus: '', ex: [] };
        sessions.push(cur);
        const rest = part.split(':').slice(1).join(':');
        if (!rest.trim()) continue;
        const m0 = rest.match(exRe);
        if (m0) cur.ex.push(matchExercise(m0[1], Number(m0[2]), m0[3]));
        continue;
      }
      const m = part.match(exRe);
      if (m) {
        if (!cur) { cur = { id: `I${sessions.length + 1}`, name: 'Séance 1', focus: '', ex: [] }; sessions.push(cur); }
        cur.ex.push(matchExercise(m[1], Number(m[2]), m[3]));
      }
    }
  }
  return sessions.filter((s) => s.ex.length);
}

function matchExercise(name, sets, reps) {
  const clean = String(name).replace(/^[\s\-•*]+/, '').trim();
  const lower = foldText(clean);
  const hit = Object.keys(EXERCISES).find((id) => {
    const n = foldText(EXERCISES[id].name);
    const short = n.split(/[(:]/)[0].trim();
    return lower.includes(short) || short.includes(lower);
  });
  if (hit) return [hit, sets, String(reps).replace(/\s/g, ''), 90];
  const key = `custom-ex-${foldText(clean).replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`;
  state.customExercises = { ...(state.customExercises || {}), [key]: { name: clean.slice(0, 60) } };
  return [key, sets, String(reps).replace(/\s/g, ''), 90];
}

async function importPlan(kind, button) {
  const text = $(kind === 'training' ? '#import-training' : '#import-nutrition')?.value.trim();
  if (!text || text.length < 10) return toast('Collez votre programme pour l’importer.');
  button.disabled = true;
  const label = button.textContent;
  button.textContent = L('Analyse en cours…');
  try {
    let result = null;
    try {
      const response = await apiFetch('/api/import-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind, text, library: Object.values(EXERCISES).map((e) => e.name), place: builder?.place || state.profile?.trainPlace || 'gym', profile: { dailyKcal: state.profile.dailyKcal, protein: state.profile.protein } }) });
      if (response.ok) result = await response.json();
    } catch {}
    if (kind === 'training') {
      let sessions = result?.sessions?.length ? result.sessions.map((s, i) => ({ id: `I${i + 1}`, name: String(s.name || `Séance ${i + 1}`).slice(0, 50), focus: String(s.focus || '').slice(0, 80), ex: (s.exercises || []).slice(0, 12).map((e) => matchExercise(e.name || '', Number(e.sets) || 3, e.reps || '10')) })).filter((s) => s.ex.length) : [];
      if (!sessions.length) sessions = parseTrainingText(text);
      if (!sessions.length) throw new Error(L('Nous n’avons pas reconnu d’exercices. Écrivez par exemple « Squat 4x10 ».'));
      const program = { id: `custom-${Date.now()}`, name: result?.name ? String(result.name).slice(0, 60) : 'Mon programme importé', level: 'Sur mesure', place: 'gym', days: sessions.length, focus: ['custom'], style: 'athletic', custom: true, desc: L('Importé depuis votre programme'), sessions };
      state.customPrograms = [...(state.customPrograms || []), program].slice(-12);
      state.workoutProgram = program.id;
      if (!state.trainingWeekdays?.length || state.trainingWeekdays.length !== sessions.length) state.trainingWeekdays = DEFAULT_DAYS[Math.min(7, sessions.length)];
      saveState();
      trainTab = 'mine';
      toast('Programme importé ✓');
      return render();
    }
    if (!result?.days?.length) throw new Error(L('L’import du plan alimentaire nécessite l’assistant. Réessayez dans un instant.'));
    state.weekPlan = result.days;
    state.shoppingChecked = {};
    saveState();
    toast('Plan alimentaire importé ✓');
    return nav('program');
  } catch (error) {
    toast(error.message || 'Réessayez dans un instant.');
  } finally {
    button.disabled = false;
    button.textContent = label;
  }
}

// ---- Ménopause 40+ space ------------------------------------------------------
const MENO_SYMPTOMS = [
  ['hot', 'Bouffées de chaleur'], ['night', 'Sueurs nocturnes'], ['sleep', 'Troubles du sommeil'], ['mood', 'Humeur, irritabilité'],
  ['fatigue', 'Fatigue'], ['cravings', 'Fringales'], ['joints', 'Douleurs articulaires'], ['bloating', 'Ballonnements'],
];
const MENO_LEVELS = [[0, 'Aucun'], [1, 'Léger'], [2, 'Moyen'], [3, 'Fort']];
const MENO_STAGE = { peri: 'Préménopause', post: 'Ménopause', unsure: 'À préciser', no: 'Avant la ménopause' };

const MENO_WEEKS = [
  ['Comprendre et observer', ['Remplir le journal des symptômes 5 jours', 'Lire « Pourquoi le ventre change »', 'Noter votre poids et votre tour de taille']],
  ['Des protéines à chaque repas', ['Atteindre votre objectif de protéines 4 jours', 'Ajouter une protéine au petit-déjeuner', 'Lire « Protéines et muscle »']],
  ['Bouger en force', ['Faire 2 séances force et os', 'Marcher 30 minutes 3 fois', 'Enregistrer vos charges']],
  ['Sommeil et soirées', ['Prendre un dîner complet 5 soirs', 'Noter votre sommeil 5 jours', 'Lire « Sommeil, bouffées de chaleur et fringales »']],
  ['Des os solides', ['3 portions de calcium par jour, 4 jours', 'Une séance avec charges ou en charge', 'Lire « Calcium, vitamine D et os solides »']],
  ['Apaiser les bouffées de chaleur', ['Repérer vos déclencheurs dans le journal', 'Observer l’effet de la caféine tardive et de l’alcool', 'Garder une chambre fraîche la nuit']],
  ['Humeur et grignotage émotionnel', ['Lire « Humeur, stress et grignotage »', 'Faire 3 pauses respiratoires dans la semaine', 'Prévoir une collation pour l’après-midi']],
  ['Faire le bilan', ['Comparer votre journal de la semaine 1 et de la semaine 8', 'Préparer vos questions pour votre médecin', 'Choisir vos 3 objectifs pour la suite']],
];

GUIDE_COLLECTIONS.find((c) => c.id === 'menopause').tier = 'menopause';
GUIDE_COLLECTIONS.find((c) => c.id === 'menopause').guides.push(
  {
    id: 'meno-mood', title: 'Humeur, stress et grignotage', time: '3 min',
    intro: 'Les variations hormonales peuvent rendre l’humeur plus fragile, et le stress pousse souvent vers le sucré.',
    points: [
      'Repérez les moments où vous grignotez sans faim : fatigue, ennui, tension.',
      'Une pause de 3 respirations lentes avant d’ouvrir le placard aide à choisir plutôt que subir.',
      'Si la tristesse, l’anxiété ou l’irritabilité durent, parlez-en à votre médecin : un accompagnement existe.',
    ],
    action: 'Notez votre humeur dans le journal aujourd’hui et prévoyez une collation pour l’après-midi.',
  },
  {
    id: 'meno-walk', title: 'Le pouvoir de la marche', time: '2 min',
    intro: 'La marche active est simple, gratuite et utile pour le cœur, l’humeur, le sommeil et les os.',
    points: [
      'Visez 30 minutes la plupart des jours, à un rythme où vous pouvez parler mais pas chanter.',
      'Ajoutez des côtes ou des escaliers pour plus d’effet.',
      'Associez la marche à 2 séances de renforcement par semaine.',
    ],
    action: 'Programmez une marche de 30 minutes dans votre journée.',
  },
);

let menoTab = 'today';
let menoOpenWeek = null;

function menoStage() {
  return MENO_STAGE[state.profile?.menopause] || MENO_STAGE.unsure;
}
function menoWeek() {
  if (!state.menoStart) return 0;
  const days = Math.floor((Date.now() - new Date(`${state.menoStart}T00:00:00`).getTime()) / 86400000);
  return clamp(Math.floor(days / 7), 0, MENO_WEEKS.length - 1);
}
function menoAvg(key, fromOffset, toOffset) {
  const values = [];
  for (let i = fromOffset; i < toOffset; i += 1) {
    const v = state.menoLog?.[addDays(-i)]?.[key];
    if (v !== undefined) values.push(Number(v));
  }
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}

function menoInsight() {
  const lines = [];
  MENO_SYMPTOMS.forEach(([key, label]) => {
    const now = menoAvg(key, 0, 7);
    const before = menoAvg(key, 7, 14);
    if (now !== null && before !== null && Math.abs(now - before) >= 0.5) {
      lines.push(L(now < before ? '{s} : en baisse par rapport à la semaine dernière.' : '{s} : en hausse par rapport à la semaine dernière.', { s: L(label) }));
    }
  });
  const days = Object.keys(state.menoLog || {}).length;
  if (!lines.length) return days < 3 ? L('Remplissez le journal quelques jours : vos tendances apparaîtront ici.') : L('Vos symptômes sont stables cette semaine. Continuez à noter : la tendance compte plus qu’un jour isolé.');
  return lines.slice(0, 3).join(' ');
}

function menopauseScreen() {
  if (state.premium && !state.menoStart) { state.menoStart = todayKey(); saveState(false); }
  const tabs = [['today', 'Aujourd’hui'], ['program', 'Programme'], ['workouts', 'Séances'], ['lessons', 'Cours']];
  const week = menoWeek();
  const done = Object.values(state.menoTasks || {}).flat().filter(Boolean).length;
  let body = '';
  if (menoTab === 'today') body = menoToday();
  else if (menoTab === 'program') body = menoProgram(week);
  else if (menoTab === 'workouts') body = menoWorkouts();
  else body = menoLessons();
  return `<div class="mobile-app meno">
    ${appHeader('Ménopause 40+')}
    <div class="screen">
      <section class="meno-hero">
        <div><small>${esc(L(menoStage()))}</small><h2>${L('Votre espace Ménopause')}</h2><p>${L('Semaine {n} sur 8 · Actions faites : {d}', { n: week + 1, d: done })}</p></div>
        <span class="meno-badge">${icon('flower')}</span>
        <div class="meno-weeks">${MENO_WEEKS.map((_, i) => `<i class="${i < week ? 'past' : i === week ? 'now' : ''}"></i>`).join('')}</div>
      </section>
      <div class="segmented seg-4 mod-tabs">${tabs.map(([k, label]) => `<button class="${menoTab === k ? 'active' : ''}" data-meno-tab="${k}">${L(label)}</button>`).join('')}</div>
      ${body}
      <div class="fine center-fine">${L('Contenus d’information générale. Ils ne remplacent pas l’avis d’un médecin.')}</div>
    </div>
    ${bottom('menopause')}
  </div>`;
}

// v11 — menopause factors, 30-day evolution, printable report
const MENO_FACTORS = [['caffeine', 'Caféine', '☕'], ['alcohol', 'Alcool', '🍷'], ['spicy', 'Plat épicé', '🌶️'], ['stress', 'Stress', '⚡'], ['heat', 'Chaleur', '☀️'], ['badsleep', 'Nuit courte', '🌙'], ['active', 'Activité physique', '🏃']];
let menoChartKey = '';
let menoRange = 30;
function menoScore(day) {
  const log = state.menoLog?.[day];
  if (!log || !Object.keys(log).length) return null;
  const v = Object.values(log).map(Number);
  return v.reduce((a, b) => a + b, 0) / v.length;
}
function menoValue(day, key) {
  if (key === 'all') return menoScore(day);
  const v = state.menoLog?.[day]?.[key];
  return v === undefined ? null : Number(v);
}
function menoChartHtml() {
  if (!menoChartKey) menoChartKey = ({ hot: 'hot', sleep: 'sleep', mood: 'mood', joints: 'joints', fatigue: 'fatigue', belly: 'all' })[state.profile?.menoFocus] || 'hot';
  const days = Array.from({ length: menoRange }, (_, i) => addDays(-(menoRange - 1 - i)));
  const W = 320, H = 120, padL = 22, padB = 18;
  const step = (W - padL - 6) / Math.max(1, days.length - 1);
  const pts = days.map((d, i) => [padL + i * step, menoValue(d, menoChartKey)]);
  const y = (v) => 6 + (H - padB - 6) * (1 - v / 3);
  const segs = [];
  let cur = [];
  pts.forEach(([x, v]) => { if (v === null) { if (cur.length) segs.push(cur); cur = []; } else cur.push(`${x.toFixed(1)},${y(v).toFixed(1)}`); });
  if (cur.length) segs.push(cur);
  const logged = pts.filter(([, v]) => v !== null).length;
  const factorRow = days.map((d, i) => { const f = state.menoFactors?.[d] || {}; const n = Object.keys(f).filter((k) => k !== 'active').length; return n ? `<circle cx="${(padL + i * step).toFixed(1)}" cy="${H - 5}" r="${Math.min(4, 1.6 + n * 0.8)}" class="mf-dot"/>` : ''; }).join('');
  const grid = [0, 1, 2, 3].map((v) => `<line x1="${padL}" x2="${W - 4}" y1="${y(v)}" y2="${y(v)}" class="mc-grid"/><text x="2" y="${y(v) + 3}" class="mc-ax">${v}</text>`).join('');
  const keys = [['all', 'Moyenne'], ...MENO_SYMPTOMS];
  return `<div class="section-label"><h3>${L('Évolution')}</h3><div class="mini-seg">${[14, 30, 90].map((n) => `<button class="${menoRange === n ? 'active' : ''}" data-meno-range="${n}">${L('{n} j', { n })}</button>`).join('')}</div></div>
    <div class="meno-chart-card">
      <div class="chip-row h-scroll">${keys.map(([k, label]) => `<button class="chip-btn ${menoChartKey === k ? 'active' : ''}" data-meno-chart="${k}">${L(label)}</button>`).join('')}</div>
      ${logged < 2 ? `<div class="empty small-empty">${L('Notez vos symptômes au moins 2 jours pour voir la courbe.')}</div>` : `<svg viewBox="0 0 ${W} ${H}" class="meno-chart" role="img" aria-label="${L('Évolution')}">${grid}${segs.map((sg) => sg.length > 1 ? `<polyline points="${sg.join(' ')}" class="mc-line"/>` : `<circle cx="${sg[0].split(',')[0]}" cy="${sg[0].split(',')[1]}" r="3" class="mc-pt"/>`).join('')}${factorRow}</svg>
      <div class="mc-legend"><span><i class="lg-line"></i>${L('0 = aucun · 3 = fort')}</span><span><i class="lg-dot"></i>${L('jour avec facteurs notés')}</span></div>`}
    </div>`;
}
function menoFactorInsight() {
  const days = Object.keys(state.menoLog || {});
  const out = [];
  MENO_FACTORS.forEach(([fk, flabel]) => {
    MENO_SYMPTOMS.forEach(([sk, slabel]) => {
      const withF = [], without = [];
      days.forEach((d) => { const v = state.menoLog[d]?.[sk]; if (v === undefined) return; (state.menoFactors?.[d]?.[fk] ? withF : without).push(Number(v)); });
      if (withF.length < 3 || without.length < 3) return;
      const a = withF.reduce((x, z) => x + z, 0) / withF.length;
      const b = without.reduce((x, z) => x + z, 0) / without.length;
      if (Math.abs(a - b) < 0.6) return;
      out.push({ fk, diff: Math.abs(a - b), text: `${a > b ? '↑' : '↓'} ` + L('{s} — jours avec « {f} » : {a} en moyenne, contre {b} les autres jours.', { f: L(flabel), s: L(slabel), a: fmt(a, 1), b: fmt(b, 1) }) });
    });
  });
  out.sort((x, z) => z.diff - x.diff);
  const picked = [];
  out.forEach((o) => { if (picked.length < 3 && picked.filter((p) => p.fk === o.fk).length < 2) picked.push(o); });
  if (!picked.length) return `<div class="insight meno-insight"><strong>${L('Vos déclencheurs possibles')}</strong>${L('Notez vos facteurs quelques jours (au moins 3 avec et 3 sans) : NutriPilot vous montrera les liens qui ressortent pour vous.')}</div>`;
  return `<div class="insight meno-insight"><strong>${L('Vos déclencheurs possibles')}</strong>${picked.map((o) => esc(o.text)).join('<br>')}<div class="fine">${L('Observation personnelle à partir de vos notes, pas un diagnostic. Parlez-en à votre médecin si besoin.')}</div></div>`;
}
function menoFactorsHtml() {
  const f = state.menoFactors?.[todayKey()] || {};
  return `<div class="section-label"><h3>${L('Facteurs du jour')}</h3><span class="fine">${L('facultatif')}</span></div>
    <div class="factor-grid">${MENO_FACTORS.map(([key, label, emo]) => `<button class="factor ${f[key] ? 'on' : ''}" data-meno-factor="${key}" aria-pressed="${f[key] ? 'true' : 'false'}"><span aria-hidden="true">${emo}</span>${L(label)}</button>`).join('')}</div>`;
}
function menoReportHtml() {
  const days = Array.from({ length: 30 }, (_, i) => addDays(-(29 - i)));
  const logged = days.filter((d) => state.menoLog?.[d] && Object.keys(state.menoLog[d]).length);
  const avg = (key, list) => { const v = list.map((d) => state.menoLog[d]?.[key]).filter((x) => x !== undefined).map(Number); return v.length ? fmt(v.reduce((a, b) => a + b, 0) / v.length, 1) : '–'; };
  const first = logged.slice(0, Math.ceil(logged.length / 2)), second = logged.slice(Math.ceil(logged.length / 2));
  const factorCount = MENO_FACTORS.map(([k, label]) => [label, days.filter((d) => state.menoFactors?.[d]?.[k]).length]).filter(([, n]) => n);
  const p = state.profile || {};
  const cell = (v) => v === undefined ? '' : `<td class="l${v}">${v}</td>`;
  return `<!doctype html><html lang="${lang()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${L('Journal ménopause')} — NutriPilot</title>
<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#102419;margin:24px;max-width:900px}h1{font-size:22px;margin:0}h2{font-size:15px;margin:22px 0 8px}p,li{font-size:13px;line-height:1.5}table{border-collapse:collapse;width:100%;font-size:11px}th,td{border:1px solid #dfe3da;padding:4px;text-align:center}th{background:#f2f4ee}td.l0{background:#fff}td.l1{background:#eef7d8}td.l2{background:#ffe9b8}td.l3{background:#ffc9b8}.meta{color:#5b6b60;font-size:12px}.btn{display:inline-block;margin:12px 0;padding:10px 16px;border-radius:12px;background:#102419;color:#fff;border:0;font-weight:700}@media print{.btn{display:none}body{margin:10mm}}</style></head><body>
<button class="btn" onclick="print()">${L('Imprimer / enregistrer en PDF')}</button>
<h1>${L('Journal ménopause — 30 derniers jours')}</h1>
<p class="meta">${esc(p.name || '')} · ${L('Généré le {d}', { d: dateFr(new Date(), true) })} · ${L('{n} jours renseignés', { n: logged.length })} · ${L('Échelle : 0 = aucun, 1 = léger, 2 = moyen, 3 = fort')}</p>
<h2>${L('Moyennes')}</h2>
<table><tr><th>${L('Symptôme')}</th><th>${L('30 jours')}</th><th>${L('1re moitié')}</th><th>${L('2e moitié')}</th></tr>${MENO_SYMPTOMS.map(([k, label]) => `<tr><td style="text-align:left">${L(label)}</td><td>${avg(k, logged)}</td><td>${avg(k, first)}</td><td>${avg(k, second)}</td></tr>`).join('')}</table>
${factorCount.length ? `<h2>${L('Facteurs notés')}</h2><p>${factorCount.map(([label, n]) => `${L(label)} : ${L('{n} j', { n })}`).join(' · ')}</p>` : ''}
<h2>${L('Détail par jour')}</h2>
<div style="overflow-x:auto"><table><tr><th>${L('Date')}</th>${MENO_SYMPTOMS.map(([, label]) => `<th>${L(label)}</th>`).join('')}</tr>${logged.map((d) => `<tr><td style="white-space:nowrap">${new Date(`${d}T12:00:00`).toLocaleDateString(locale(), { day: '2-digit', month: '2-digit' })}</td>${MENO_SYMPTOMS.map(([k]) => cell(state.menoLog[d]?.[k]) || '<td></td>').join('')}</tr>`).join('')}</table></div>
<p class="meta">${L('Document établi à partir de vos propres notes dans NutriPilot. Il ne constitue pas un diagnostic et ne remplace pas l’avis d’un professionnel de santé.')}</p>
</body></html>`;
}
function openMenoReport() {
  if (nativePlatform()) { track('MenoReport'); return saveFile(menoReportHtml(), 'rapport-menopause.html', 'text/html'); }
  const blob = new Blob([menoReportHtml()], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) { const a = document.createElement('a'); a.href = url; a.download = 'rapport-menopause.html'; a.click(); }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  track('MenoReport');
}

function menoToday() {
  const log = state.menoLog?.[todayKey()] || {};
  const p = state.profile || {};
  const bars = (key) => Array.from({ length: 7 }, (_, i) => {
    const v = state.menoLog?.[addDays(-(6 - i))]?.[key];
    return `<i style="height:${v === undefined ? 4 : 6 + Number(v) * 10}px" class="${v === undefined ? 'nil' : `l${v}`}"></i>`;
  }).join('');
  return `
    <div class="section-label"><h3>${L('Journal du jour')}</h3><span class="fine">${Object.keys(log).length}/${MENO_SYMPTOMS.length}</span></div>
    <div class="symptom-list">${MENO_SYMPTOMS.map(([key, label]) => `<div class="symptom-row">
      <div class="symptom-head"><b>${L(label)}</b><span class="spark">${bars(key)}</span></div>
      <div class="level-row">${MENO_LEVELS.map(([v, l]) => `<button class="${Number(log[key]) === v && log[key] !== undefined ? 'on l' + v : ''}" data-meno-log="${key}" data-value="${v}">${L(l)}</button>`).join('')}</div>
    </div>`).join('')}</div>
    ${menoFactorsHtml()}
    <div class="insight meno-insight"><strong>${L('Vos tendances')}</strong>${esc(menoInsight())}</div>
    ${menoChartHtml()}
    ${menoFactorInsight()}
    <div class="report-row"><button class="btn btn-primary" data-meno-report>${icon('book')}<span>${L('Rapport pour mon médecin')}</span></button><button class="btn btn-ghost" data-export="meno">${L('Export CSV')}</button></div>
    <div class="section-label"><h3>${L('Vos repères du jour')}</h3></div>
    <div class="meno-targets">
      <div>${icon('fork')}<b>${L('{n} g de protéines', { n: p.protein || 100 })}</b><small>${L('Une source à chaque repas')}</small></div>
      <div>${icon('drop')}<b>${L('3 portions de calcium')}</b><small>${L('Laitages ou boissons enrichies, sardines, amandes')}</small></div>
      <div>${icon('dumbbell')}<b>${L('Bouger 30 minutes')}</b><small>${L('Marche active ou séance force')}</small></div>
      <div>${icon('sparkle')}<b>${L('{n} g de fibres', { n: p.fiber || 25 })}</b><small>${L('Légumes, fruits, céréales complètes')}</small></div>
    </div>
    <div class="section-label"><h3>${L('L’assiette ménopause')}</h3></div>
    <div class="day-card meno-plate">
      <div class="plate"><span class="q veg">${L('Légumes')}</span><span class="q prot">${L('Protéines')}</span><span class="q carb">${L('Féculents complets')}</span><span class="q fat">${L('Bonnes graisses')}</span></div>
      <p class="screen-sub">${L('La moitié de l’assiette en légumes, un quart de protéines, un quart de féculents complets, et une petite part de bonnes graisses (huile d’olive, noix).')}</p>
      <button class="btn btn-ghost btn-wide" data-go="recipes">${L('Voir les recettes adaptées')}</button>
    </div>
`;
}

function menoProgram(week) {
  const tasks = state.menoTasks || {};
  return `<div class="meno-program">${MENO_WEEKS.map(([theme, list], i) => `
    <details class="week-card ${i === week ? 'now' : i < week ? 'past' : ''}" ${i === (menoOpenWeek ?? week) ? 'open' : ''}>
      <summary><span class="wk">${L('Semaine {n}', { n: i + 1 })}</span><b>${L(theme)}</b><small>${(tasks[i] || []).filter(Boolean).length}/${list.length}</small></summary>
      <div class="task-list">${list.map((task, j) => `<button class="task ${tasks[i]?.[j] ? 'done' : ''}" data-meno-task="${i}" data-task="${j}"><span>${tasks[i]?.[j] ? icon('check') : ''}</span>${L(task)}</button>`).join('')}</div>
    </details>`).join('')}</div>`;
}

function menoWorkouts() {
  const current = currentProgram();
  return `<p class="screen-sub">${L('Le renforcement musculaire et les exercices en charge aident à préserver les muscles et les os. Choisissez votre formule, 3 séances par semaine.')}</p>
    ${MENO_PROGRAMS.map((x) => `<article class="program-card ${x.id === current.id ? 'current' : ''}">
      <div class="pc-top"><span class="pill">${esc(L(x.level))}</span><span class="pill">${L(x.place === 'home' ? 'Maison' : 'Salle')}</span></div>
      <h3>${esc(L(x.name))}</h3><p>${esc(L(x.desc))}</p>
      <div class="guide-list">${x.sessions.map((s) => `<button class="guide-card" data-session="${esc(s.id)}" data-program="${esc(x.id)}"><span class="guide-check">${esc(s.id.slice(-1))}</span><span><b>${esc(L(s.name))}</b><small>${esc(L(s.focus))}</small></span><span class="guide-arrow">→</span></button>`).join('')}</div>
      ${x.id === current.id ? `<span class="pc-current">✓ ${L('Programme actuel')}</span>` : `<button class="btn btn-primary btn-wide" data-workout-program="${esc(x.id)}">${L('En faire mon programme')}</button>`}
    </article>`).join('')}`;
}

function menoLessons() {
  const c = GUIDE_COLLECTIONS.find((x) => x.id === 'menopause');
  const read = new Set(state.guidesRead || []);
  return `<div class="course-card">
    <div class="course-head"><div><h3>${esc(L(c.title))}</h3><p>${esc(L(c.sub))}</p></div><span class="course-count">${c.guides.filter((g) => read.has(g.id)).length}/${c.guides.length}</span></div>
    <div class="guide-list">${c.guides.map((g, index) => {
      const access = lessonAccess({ ...g, index, tier: c.tier });
      const locked = access === 'paywall' || access === 'upgrade';
      return `<button class="guide-card ${read.has(g.id) ? 'read' : ''} ${locked ? 'locked' : ''}" data-guide="${esc(g.id)}"><span class="guide-check">${read.has(g.id) ? icon('check') : locked ? icon('lock') : index + 1}</span><span><b>${esc(L(g.title))}</b><small>${L('{time} de lecture', { time: g.time })}${access === 'free' ? ` · ${L('Leçon gratuite')}` : ''}</small></span><span class="guide-arrow">→</span></button>`;
    }).join('')}</div>
  </div>`;
}

function recipeMiniCard(recipe) {
  return `<button class="recipe-mini" data-recipe-id="${esc(recipe.id)}"><span>${esc(L(recipe.category))}</span><b>${esc(L(recipe.name))}</b><small>${recipe.kcal} kcal · ${recipe.protein} g ${L('prot.')} · ${esc(L(recipe.prep))}</small></button>`;
}



function planner() {
  const t = totals();
  const p = state.profile;
  const left = Math.max(180, p.dailyKcal - t.kcal);
  const proteinLeft = Math.max(0, Math.round(p.protein - t.protein));
  const fiberLeft = Math.max(0, Math.round(p.fiber - t.fiber));
  return `<div class="mobile-app">
    ${appHeader('Nutrition')}
    <div class="screen">
      ${programTabs('planner')}
      <h1 class="screen-title">${L('Que manger ensuite ?')}</h1>
      <p class="screen-sub">${L('Votre journée réelle devient le point de départ. Gardez vos envies et adaptez le reste.')}</p>
      <div class="compose-card"><small>${L('Budget restant estimé')}</small><div class="compose-number">${fmt(left)} kcal</div><div class="compose-meta">${L('≈ {p} g protéines · {f} g fibres restantes', { p: proteinLeft, f: fiberLeft })}</div></div>

      <div class="planner-mode-grid">
        <button class="planner-mode active" data-planner-mode="next"><span>✦</span><b>${L('Prochain repas')}</b><small>${L('3 options adaptées')}</small></button>
        <button class="planner-mode" data-planner-mode="fridge"><span>⌂</span><b>${L('Mon frigo')}</b><small>${L('Utiliser ce que j’ai')}</small></button>
        <button class="planner-mode" data-planner-mode="restaurant"><span>◌</span><b>${L('Restaurant')}</b><small>${L('Choisir sans deviner')}</small></button>
        <button class="planner-mode" data-planner-mode="pleasure"><span>♡</span><b>${L('Repas plaisir')}</b><small>${L('Garder l’envie')}</small></button>
      </div>

      <div id="planner-panel">${plannerPanel('next', left, proteinLeft)}</div>
    </div>
    ${bottom('planner')}
  </div>`;
}

function plannerPanel(mode, left, proteinLeft) {
  const p = state.profile;
  if (mode === 'fridge') return `<div class="day-card planner-panel"><h3>${L('Que pouvez-vous cuisiner avec ce que vous avez ?')}</h3><p class="screen-sub">${L('Listez quelques ingrédients. NutriPilot cherchera à utiliser en priorité ce qui est déjà chez vous.')}</p><div class="field"><label>${L('Dans mon frigo / placard')}</label><textarea class="textarea compact" id="fridge-input" placeholder="${L('Ex. poulet, courgettes, riz, tomates, yaourt…')}"></textarea></div><button class="btn btn-primary btn-wide" data-fridge data-remaining="${left}">${L('Créer 3 repas avec ça →')}</button><div id="fridge-results"></div></div>`;
  if (mode === 'restaurant') return `<div class="day-card planner-panel"><h3>${L('Je mange à l’extérieur.')}</h3><p class="screen-sub">${L('Indiquez le type de restaurant, une enseigne ou le plat qui vous tente. Sans données officielles, NutriPilot ne prétend pas connaître les calories exactes.')}</p><div class="field"><label>${L('Où / quoi ?')}</label><input id="restaurant-input" placeholder="${L('Ex. restaurant italien, burger, sushi…')}"></div><button class="btn btn-primary btn-wide" data-restaurant data-remaining="${left}">${L('M’aider à choisir →')}</button><div id="restaurant-results"></div></div>`;
  if (mode === 'pleasure') return `<div class="day-card planner-panel"><h3>${L('Gardez le repas que vous voulez.')}</h3><p class="screen-sub">${L('NutriPilot propose des adaptations possibles sans transformer un repas plaisir en punition.')}</p><div class="field"><label>${L('Repas à adapter')}</label><input id="swap-meal" placeholder="${L('Ex. pizza 4 fromages, burger-frites…')}"></div><button class="btn btn-primary btn-wide" data-smart-swap data-remaining="${left}">${L('Adapter ce repas à ma journée →')}</button><div id="swap-results"></div></div>`;
  return `<div class="day-card planner-panel"><div class="field"><label>${L('Une envie particulière ?')}</label><input id="craving" placeholder="${L('Ex. pâtes, burger, quelque chose de frais…')}"></div><div class="field"><label>${L('Style')}</label><select id="preference"><option value="${esc(p.diet)}">${L('Ma préférence habituelle')}</option><option value="protein">${L('Riche en protéines')}</option><option value="quick">${L('Rapide')}</option><option value="vegetarian">${L('Végétarien')}</option><option value="light">${L('Léger')}</option></select></div><button class="btn btn-primary btn-wide" data-compose data-remaining="${left}" data-protein-left="${proteinLeft}">${L('Générer 3 options adaptées →')}</button><div id="compose-results"></div></div>`;
}

function suggestionHtml(options = []) {
  return `<div class="suggestion-list">${options.map((s) => `<article class="suggestion"><div class="suggestion-top"><h3>${esc(s.name)}</h3><span class="pill">${fmt(s.kcal)} kcal</span></div><p>${esc(s.why || s.tip || '')}</p>${s.ingredients?.length ? `<div class="ingredients">${s.ingredients.map((x) => `<span class="chip">${esc(typeof x === 'string' ? x : x.name)}</span>`).join('')}</div>` : ''}<div class="nutrition-line"><div><b>${fmt(s.kcal)}</b>kcal</div><div><b>${fmt(s.protein)}</b>${L('prot.')}</div><div><b>${fmt(s.carbs)}</b>${L('gluc.')}</div><div><b>${fmt(s.fiber)}</b>${L('fibres')}</div></div>${s.prep ? `<div class="fine prep-line">⏱ ${esc(s.prep)}</div>` : ''}<button class="btn btn-ghost btn-wide" data-add-suggestion='${esc(JSON.stringify(s))}'>${L('Ajouter au journal')}</button></article>`).join('')}</div>`;
}

const COACH_TABS = [
  ['nutrition', 'Nutrition', 'fork', ['Que manger avec mes calories restantes ?', 'Comment augmenter mes protéines ?', 'Je mange au restaurant ce soir.', 'Analyse ma semaine.']],
  ['training', 'Entraînement', 'dumbbell', ['Quelle séance faire aujourd’hui ?', 'Comment progresser sur mes charges ?', 'J’ai des courbatures, je m’entraîne ?', 'Comment bien faire un squat ?']],
  ['recipes', 'Recettes', 'book', ['Une recette rapide avec ce que j’ai.', 'Par quoi remplacer la crème ?', 'Un dîner léger de chez moi.', 'Des collations protéinées.']],
  ['scanner', 'Scanner', 'scan', ['Explique mon dernier scan.', 'Comment lire une étiquette ?', 'Ce produit est-il un bon choix ?', 'C’est quoi un additif ?']],
  ['wellbeing', 'Bien-être', 'moon', ['J’ai envie de grignoter le soir.', 'Je dors mal, que changer ?', 'Je suis stressé(e), une idée ?', 'Je reprends après une pause.']],
  ['menopause', 'Ménopause', 'flower', ['Que manger contre les bouffées de chaleur ?', 'Pourquoi mon ventre change ?', 'Quels exercices pour mes os ?', 'Analyse mon journal.']],
];
let coachMode = '';
let coachDraft = '';
let coachRequestId = 0;
function coachContext() {
  if (state.coachUsesData === false) return {};
  const p = state.profile || {};
  const t = totals();
  const prog = hasTrainingPlan() ? currentProgram() : null;
  const sleepDays = Object.entries(state.sleepLog || {}).filter(([d]) => d >= addDays(-7));
  const meno = Object.entries(state.menoLog || {}).filter(([d]) => d >= addDays(-7));
  return {
    profile: { name: p.name || '', track: p.track || '', goal: p.goal, age: p.age, sex: p.sex, weightNow: weightKnown() ? lastWeight() : null, target: goalSet() ? p.target : null, activity: p.activity, diet: p.diet, allergies: p.allergies, cuisine: CUISINES.find((c) => c[0] === (LANG_CUISINE[lang()] || 'fr'))?.[1] || '', country_language: lang(), hungerTime: p.hungerTime || '', schedule: p.schedule || '', focus: p.menoFocus || p.muscleFocus || p.eatFocus || '', trainPlace: p.trainPlace || '', level: p.trainLevel || '' },
    today: { kcal: t.kcal, protein: t.protein, targetKcal: p.dailyKcal, targetProtein: p.protein, water: waterToday(), hour: new Date().getHours() },
    recentMeals: state.meals.slice(-8).reverse().map((m) => `${m.day} ${m.type || ''}: ${m.title} (${Math.round(m.total?.kcal || 0)} kcal, ${Math.round(m.total?.protein || 0)} g prot.)`),
    training: prog ? { program: prog.name, today: todaySession()?.name || 'repos', lastWorkouts: (state.workoutLog || []).slice(-5).map((w) => ({ day: w.day, session: w.sessionId, loads: w.loads })) } : null,
    lastScan: state.scanHistory?.[0] ? { title: state.scanHistory[0].title, total: state.scanHistory[0].total, per100: state.scanHistory[0].per100, allergens: state.scanHistory[0].product?.allergens, additives: state.scanHistory[0].product?.additives, nutriscore: state.scanHistory[0].product?.nutriscore } : null,
    menopause: meno.length ? { days: meno.length, focus: p.menoFocus || '', avg: Object.fromEntries(MENO_SYMPTOMS.map(([k]) => [k, menoAvg(k, 0, 7)])) } : null,
    sleep: sleepDays.length ? { nights: sleepDays.length, avgHours: +(sleepDays.reduce((s2, [, e]) => s2 + sleepDuration(e), 0) / sleepDays.length).toFixed(1) } : null,
    supplements: (state.supplements || []).filter((x) => !x.paused).map((x) => x.name),
  };
}
// Answer built from the person's own data, used when the coach service can't be reached: never an error in the chat.
function localCoachAnswer(message, mode) {
  const p = state.profile || {};
  const t = totals();
  const name = p.name ? `${p.name}, ` : '';
  const low = String(message).toLowerCase();
  const lines = [];
  const kcalLeft = Math.max(0, Math.round((p.dailyKcal || 0) - t.kcal));
  const protLeft = Math.max(0, Math.round((p.protein || 0) - t.protein));
  const recipeIdeas = (n) => ALL_RECIPES.filter((r) => recipeAllowed(r) && (!kcalLeft || r.kcal <= kcalLeft + 80)).sort((a, b) => (b.protein / b.kcal) - (a.protein / a.kcal)).slice(0, n);
  const lazy = /pregui|flemme|motiv|lazy|pereza|ganas|keine lust|voglia|zin|nie chce|üşen|やる気|귀찮|懒|كسل|malas/.test(low);
  // Answer the question that was asked, even offline.
  const restaurant = /restau|resto|fora|comer fora|eating out|dîner dehors|afuera|außer haus|fuori|uit eten|na mieście|dışarıda|外食|외식|外出吃|مطعم|di luar/.test(low);
  const hungry = /fome|faim|hungry|hambre|hunger|fame|honger|głod|aç|お腹|배고|饿|جوع|lapar|grignot|lanche|snack|beliscar/.test(low);
  const protein = /prot[eé]in|protéine|białk|タンパク|단백|蛋白|بروتين/.test(low);
  if (mode !== 'training' && !lazy && (restaurant || hungry || protein)) {
    if (p.dailyKcal) lines.push(name + L('il vous reste environ {kcal} kcal et {p} g de protéines aujourd’hui.', { kcal: fmt(kcalLeft), p: protLeft }));
    if (restaurant) {
      lines.push(L('Au restaurant : choisissez une source de protéines grillée ou rôtie (poisson, poulet, viande, œufs, tofu) avec des légumes.'));
      lines.push(L('Accompagnement : une portion de féculents de la taille de votre poing ; sauces et fritures à part si possible.'));
      lines.push(L('Vous pouvez photographier le plat avec le scanner pour l’enregistrer en quelques secondes.'));
    } else if (protein) {
      lines.push(L('Ajoutez une source de protéines à chaque repas : œufs, yaourt grec, fromage blanc, poulet, poisson, tofu, légumineuses.'));
      recipeIdeas(1).forEach((r) => lines.push(L('Idée adaptée : {recipe} ({kcal} kcal, {p} g de protéines).', { recipe: L(r.name), kcal: fmt(r.kcal), p: Math.round(r.protein) })));
    } else {
      lines.push(L('Une collation qui tient : un yaourt ou fromage blanc avec un fruit, ou une poignée d’oléagineux.'));
      lines.push(L('Buvez un verre d’eau d’abord : la soif ressemble parfois à la faim.'));
    }
    return lines.map((x, i) => (i ? `• ${x}` : x)).join('\n');
  }
  if (mode === 'training' || lazy) {
    const s = todaySession();
    if (lazy) lines.push(name + L('commencez petit : mettez votre tenue et faites seulement l’échauffement (5 minutes). Si l’envie revient, continuez ; sinon, c’est déjà une victoire.'));
    if (s) lines.push(L('Séance prévue aujourd’hui : {name} ({focus}).', { name: L(s.name), focus: L(s.focus) }));
    else if (hasTrainingPlan()) lines.push(L('Aujourd’hui est un jour de repos : 20 à 30 minutes de marche suffisent.'));
    else lines.push(L('Vous n’avez pas encore de programme : le quiz « Trouver mon programme » vous en propose un en 1 minute.'));
    lines.push(L('Une séance courte vaut mieux qu’aucune séance : 15 minutes aujourd’hui comptent.'));
  } else if (mode === 'scanner') {
    const sc = state.scanHistory?.[0];
    lines.push(sc ? L('Votre dernier scan : {name}, environ {kcal} kcal.', { name: sc.title, kcal: fmt(sc.total?.kcal || sc.per100?.kcal || 0) }) : L('Scannez un code-barres, une étiquette ou une photo : vous verrez calories, macros, allergènes et additifs.'));
    lines.push(L('Comparez toujours pour 100 g, puis regardez la portion que vous mangez vraiment.'));
  } else if (mode === 'wellbeing') {
    lines.push(L('Essayez la respiration 4-7-8 dans Sommeil & stress : une minute suffit pour faire baisser la tension.'));
    lines.push(L('Pour mieux dormir : dernière caféine avant 14 h et écrans éteints 30 minutes avant le coucher.'));
    lines.push(L('Envie de grignoter ? Notez si c’est de la faim ou une envie : cela aide à choisir la bonne réponse.'));
  } else if (mode === 'menopause') {
    lines.push(L('Pour les bouffées de chaleur, notez vos facteurs (alcool, épices, boissons chaudes) dans votre journal : vous verrez ce qui joue chez vous.'));
    lines.push(L('Deux séances de renforcement par semaine aident à protéger les os et les muscles.'));
    lines.push(L('Visez des protéines à chaque repas et une source de calcium par jour.'));
  } else {
    if (p.dailyKcal) lines.push(name + L('il vous reste environ {kcal} kcal et {p} g de protéines aujourd’hui.', { kcal: fmt(kcalLeft), p: protLeft }));
    recipeIdeas(mode === 'recipes' ? 2 : 1).forEach((r) => lines.push(L('Idée adaptée : {recipe} ({kcal} kcal, {p} g de protéines).', { recipe: L(r.name), kcal: fmt(r.kcal), p: Math.round(r.protein) })));
    lines.push(L('Remplissez la moitié de l’assiette de légumes et ajoutez une source de protéines.'));
  }
  return lines.map((x, i) => (i ? `• ${x}` : x)).join('\n');
}
function coachText(text) {
  return esc(text).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
}
function coachScreen() {
  const p = state.profile;
  if (!coachMode) coachMode = p.track === 'menopause' ? 'menopause' : p.track === 'muscle' ? 'training' : 'nutrition';
  const tab = COACH_TABS.find((x) => x[0] === coachMode) || COACH_TABS[0];
  const msgs = state.coach.slice(-18);
  return `<div class="mobile-app">
    ${appHeader('Coach')}
    <div class="screen coach-screen">
      <div class="tab-scroll mod-tabs coach-modes">${COACH_TABS.map(([k, label, ico]) => `<button class="${coachMode === k ? 'active' : ''}" data-coach-mode="${k}">${icon(ico)} ${L(label)}</button>`).join('')}</div>
      <div class="quick-prompts">${tab[3].map((q) => `<button data-quick-coach="${esc(L(q))}">${esc(L(q))}</button>`).join('')}</div>
      <div class="chat" id="chat" aria-live="polite">${msgs.length ? msgs.map((m, i) => m.pending ? `<div class="bubble ai typing" role="status" aria-label="${L('Le coach écrit…')}"><i></i><i></i><i></i></div>` : `<div class="bubble ${m.role === 'user' ? 'user' : 'ai'}${m.kind ? ' note' : ''}">${coachText(m.text)}${m.kind === 'local' && m.q ? `<button class="chip-retry" data-coach-retry="${state.coach.length - msgs.length + i}">↻ ${L('Réessayer')}</button>` : ''}${m.kind === 'auth' ? (Billing.native() ? `<button class="chip-retry" data-restore>${L('Restaurer mes achats')}</button>` : `<button class="chip-retry" data-go="access">${L('Se connecter')}</button>`) : ''}${m.role !== 'user' && !m.kind && i === msgs.length - 1 && state.premium ? `<span class="fb"><button data-coach-fb="up" aria-label="${L('Utile')}">👍</button><button data-coach-fb="down" aria-label="${L('Pas adapté')}">👎</button></span>` : ''}</div>`).join('') : `<div class="bubble ai">${L('Bonjour {name} 👋 Je connais votre objectif, votre journée et vos préférences. Posez votre question ou choisissez une idée ci-dessus.', { name: esc(p.name || '') })}</div>`}</div>
      <div class="chatbar"><input id="coach-input" value="${esc(coachDraft)}" placeholder="${L('Posez votre question…')}" enterkeyhint="send"><button class="btn btn-primary" data-coach-send ${coachBusy ? 'disabled' : ''} aria-label="${L('Envoyer')}"><span class="flip-rtl">→</span></button></div>
      <div class="coach-ctl"><label><input type="checkbox" id="coach-data" ${state.coachUsesData === false ? '' : 'checked'}> ${L('Utiliser mes données (repas, séances, sommeil) pour personnaliser')}</label>${state.coach.length ? `<button class="link-btn" data-coach-clear>${L('Effacer la conversation')}</button>` : ''}</div>
      <div class="fine">${L('Réponses générées automatiquement : elles peuvent contenir des erreurs. Le coach ne pose pas de diagnostic et ne prescrit ni médicament ni hormone. En cas de symptôme ou de question médicale, consultez un professionnel.')}</div>
    </div>
    ${bottom('coach')}
  </div>`;
}

function weeklyData() {
  return [...Array(7)].map((_, i) => {
    const day = addDays(i - 6);
    return { day, ...totals(day), water: Number(state.water[day] || 0), checkin: state.checkins[day] || {} };
  });
}

function insights() {
  const data = weeklyData();
  const p = state.profile;
  const logged = data.filter((x) => x.kcal > 0);
  const avg = logged.length ? Math.round(logged.reduce((sum, x) => sum + x.kcal, 0) / logged.length) : 0;
  const avgProtein = logged.length ? Math.round(logged.reduce((sum, x) => sum + x.protein, 0) / logged.length) : 0;
  const adherence = logged.length ? Math.round(logged.filter((x) => Math.abs(x.kcal - p.dailyKcal) <= p.dailyKcal * 0.15).length / logged.length * 100) : 0;
  return `<div class="mobile-app">
    ${appHeader('Analyse')}
    <div class="screen">
      <span class="tag">${L('7 DERNIERS JOURS')}</span>
      <h1 class="screen-title">${L('La tendance, pas la perfection.')}</h1>
      <div class="kpi-grid"><div class="kpi"><small>${L('Moyenne')}</small><b>${fmt(avg)} kcal</b></div><div class="kpi"><small>${L('Protéines moy.')}</small><b>${fmt(avgProtein)} g</b></div><div class="kpi"><small>${L('Jours suivis')}</small><b>${logged.length}/7</b></div><div class="kpi"><small>${L('Régularité')}</small><b>${adherence}%</b></div></div>
      <div class="section-label"><h3>${L('Votre semaine')}</h3></div>
      ${data.map((d) => `<div class="day-card"><div class="day-top"><div><b>${dateLabel(d.day)}</b><div class="fine">${fmt(d.protein)} g prot. · ${fmt(d.fiber)} g fibres · ${fmt(d.water)} ml</div></div><b>${fmt(d.kcal)} kcal</b></div><div class="mini-bar"><i style="width:${clamp(d.kcal / Math.max(1, p.dailyKcal) * 100, 0, 100)}%"></i></div></div>`).join('')}
      <div class="section-label"><h3>${L('Lecture simple')}</h3></div>${weeklyInsight(data, p)}
      <button class="btn btn-primary btn-wide" data-week-review>${L('Créer mon bilan de la semaine →')}</button>
      ${state.weekReview ? `<div style="margin-top:12px">${weeklyReviewHtml()}</div>` : ''}
      <div class="section-label"><h3>${L('Badges')}</h3></div>${achievements()}
    </div>
    ${bottom('')}
  </div>`;
}

function weeklyInsight(data, p) {
  const logged = data.filter((x) => x.kcal);
  if (logged.length < 2) return `<div class="insight"><strong>${L('Encore un peu de données.')}</strong>${L('Avec 2–3 jours suivis, NutriPilot commencera à distinguer des tendances utiles.')}</div>`;
  const proteinDays = logged.filter((x) => x.protein >= p.protein * 0.85).length;
  const fiberDays = logged.filter((x) => x.fiber >= p.fiber * 0.8).length;
  return `<div class="insight"><strong>${L(proteinDays >= logged.length / 2 ? 'Votre structure protéique prend forme.' : 'La protéine est votre levier le plus clair.')}</strong>${L('{p}/{n} jours proches du repère protéines · {f}/{n} jours proches du repère fibres. Utilisez ces tendances pour simplifier la prochaine semaine.', { p: proteinDays, f: fiberDays, n: logged.length })}</div>`;
}


function chartPoints(values) {
  if (!values.length) return [];
  const min = Math.min(...values.map((v) => Number(v.value))) - 0.8;
  const max = Math.max(...values.map((v) => Number(v.value))) + 0.8;
  const range = Math.max(0.5, max - min);
  return values.map((v, i) => ({ x: 20 + i * (300 / Math.max(1, values.length - 1)), y: 155 - (Number(v.value) - min) / range * 125 }));
}


// ---- v13: weight goal planner & profile editor ------------------------------
let goalDraft = null;
let goalReturn = 'progress';
let profileDraft = null;
const round1 = (x) => Math.round(Number(x) * 10) / 10;
function weightKnown() {
  const p = state.profile || {};
  return Boolean((state.onboarding && !p.estimated) || state.basicsFilled?.weight || p.goalSet || (state.weights || []).length);
}
function goalSet() {
  const p = state.profile || {};
  return Boolean(p.goalSet || (state.onboarding && !p.estimated && Number(p.target)));
}
function goalKind(weight, target) {
  const diff = Number(target) - Number(weight);
  return Math.abs(diff) < 0.5 ? 'maintain' : diff < 0 ? 'lose' : 'gain';
}
function healthyRange(heightCm) {
  const h = Number(heightCm) / 100;
  return h > 1.2 ? [round1(18.5 * h * h), round1(24.9 * h * h)] : null;
}
function goalWeeks(weight, target, speed) {
  const delta = Math.abs(Number(target) - Number(weight));
  const kind = goalKind(weight, target);
  if (kind === 'maintain') return 0;
  return Math.max(1, Math.round(delta / (kind === 'lose' ? Number(speed || 0.35) : 0.25)));
}
function initGoalDraft() {
  const p = state.profile || {};
  const w = weightKnown() ? round1(lastWeight() || p.weight) : '';
  goalDraft = { weight: w || '', target: goalSet() ? round1(p.target) : (w ? round1(w - 5) : ''), speed: Number(p.speed) || 0.35, height: (state.basicsFilled?.height || state.onboarding) ? Number(p.height) || '' : '' };
}
function openGoal(from) {
  goalReturn = from || route;
  initGoalDraft();
  nav('goal');
}
function goalScreen() {
  if (!goalDraft) initGoalDraft();
  const d = goalDraft;
  const ready = Number(d.weight) >= 35 && Number(d.target) >= 35;
  const kind = ready ? goalKind(d.weight, d.target) : 'maintain';
  const diff = ready ? round1(d.target - d.weight) : 0;
  const range = healthyRange(d.height);
  const h = Number(d.height) / 100;
  const targetBmi = h ? Number(d.target) / (h * h) : 0;
  const tooLow = kind === 'lose' && targetBmi && targetBmi < 18.5;
  const plan = ready ? calculatePlan({ ...state.profile, weight: Number(d.weight), target: Number(d.target), goal: kind, speed: d.speed, height: Number(d.height) || state.profile.height || 165 }) : null;
  const weeks = ready ? goalWeeks(d.weight, d.target, d.speed) : 0;
  const eta = weeks ? new Date(Date.now() + weeks * 604800000) : null;
  const stepper = (key, label, cls = '') => `<div class="gp-col ${cls}"><small>${L(label)}</small>
      <div class="gp-num"><button class="gp-step" data-goal-step="${key}:-0.5" aria-label="−0,5 kg">${icon('minus')}</button>
      <label><input id="goal-${key}" type="number" inputmode="decimal" step="0.1" min="35" max="250" value="${d[key] === '' ? '' : d[key]}" placeholder="—" aria-label="${L(label)}"><span>kg</span></label>
      <button class="gp-step" data-goal-step="${key}:0.5" aria-label="+0,5 kg">${icon('plus')}</button></div></div>`;
  const quick = ready ? [[-3, '−3 kg'], [-5, '−5 kg'], [-10, '−10 kg'], [0, L('Maintenir')], [3, '+3 kg']] : [];
  const paces = [[0.25, 'Tranquille', 'Très facile à tenir'], [0.35, 'Régulier', 'Recommandé'], [0.5, 'Soutenu', 'Plus exigeant']];
  return `<div class="mobile-app">
    <div class="app-head"><div class="app-head-row"><button class="icon-btn" data-goal-back aria-label="${L('Retour')}">${icon('back')}</button><h2>${L('Mon objectif de poids')}</h2><span></span></div></div>
    <div class="screen gp">
      <p class="screen-sub">${L('Choisissez votre poids actuel et le poids que vous voulez atteindre. Tout votre plan s’adapte immédiatement.')}</p>
      <section class="gp-card">
        <div class="gp-pair">
          ${stepper('weight', 'Aujourd’hui')}
          <div class="gp-mid"><span class="gp-arrow flip-rtl">→</span><b id="goal-diff" class="gp-diff ${kind}">${ready ? (diff > 0 ? '+' : diff < 0 ? '−' : '') + fmt(Math.abs(diff), 1) + ' kg' : '—'}</b></div>
          ${stepper('target', 'Mon objectif', 'target')}
        </div>
        ${ready ? `<input class="gp-range" id="goal-range" type="range" min="${Math.max(35, Math.floor(d.weight - 40))}" max="${Math.min(250, Math.ceil(d.weight + 25))}" step="0.5" value="${d.target}" aria-label="${L('Mon objectif')}">` : ''}
        <div class="gp-quick">${quick.map(([n, label]) => `<button class="mini-choice ${round1(d.target - d.weight) === n ? 'selected' : ''}" data-goal-quick="${n}">${label}</button>`).join('')}</div>
        ${range ? `<p class="gp-hint">${icon('sparkle')}<span>${L('Repère santé pour {h} cm : {a} à {b} kg (IMC 18,5 à 24,9). C’est une indication générale, pas une obligation.', { h: fmt(d.height), a: fmt(range[0], 1), b: fmt(range[1], 1) })}</span></p>` : `<label class="gp-height">${L('Votre taille')} <input id="goal-height" type="number" inputmode="numeric" min="130" max="220" placeholder="cm"></label>`}
      </section>
      ${tooLow ? `<div class="warn">${L('Cet objectif correspond à un IMC inférieur à 18,5. NutriPilot ne propose pas de perte de poids en dessous de ce repère : choisissez un objectif plus haut ou parlez-en à un professionnel.')}</div>` : ''}
      ${kind === 'lose' && !tooLow ? `<div class="section-label"><h3>${L('Votre rythme')}</h3></div>
        <div class="gp-paces">${paces.map(([v, name, sub]) => { const w = goalWeeks(d.weight, d.target, v); return `<button class="gp-pace ${Number(d.speed) === v ? 'on' : ''}" data-goal-speed="${v}"><b>${L(name)}</b><small>≈ ${fmt(v, 2)} kg / ${L('sem.')}</small><em>${L(sub)}</em><span>${esc(new Date(Date.now() + w * 604800000).toLocaleDateString(locale(), { day: 'numeric', month: 'short', year: 'numeric' }))}</span></button>`; }).join('')}</div>` : ''}
      ${plan && !tooLow ? `<section class="gp-result">
        <div><small>${L('Calories par jour')}</small><b>${fmt(plan.dailyKcal)}</b><em>kcal</em></div>
        <div><small>${L('Protéines')}</small><b>${plan.protein}</b><em>g</em></div>
        <div><small>${kind === 'maintain' ? L('Objectif') : L('Arrivée estimée')}</small><b class="gp-date">${kind === 'maintain' ? L('Stabiliser') : eta ? esc(dateFr(eta)) : '—'}</b><em>${weeks ? L('≈ {n} semaines', { n: weeks }) : ''}</em></div>
      </section>
      <p class="fine center-fine">${L('Estimation : le corps ne suit pas une ligne droite. NutriPilot ajuste votre plan selon vos pesées réelles.')}</p>` : ''}
      <button class="btn btn-primary btn-wide btn-xl" data-goal-save ${!ready || tooLow ? 'disabled' : ''}>${L('Enregistrer mon objectif')}</button>
    </div>
  </div>`;
}
function saveGoal() {
  const d = goalDraft;
  if (!d) return;
  const weight = round1(d.weight); const target = round1(d.target);
  if (!(weight >= 35 && weight <= 250 && target >= 35 && target <= 250)) return toast(L('Valeur attendue entre {min} et {max}.', { min: 35, max: 250 }));
  const goal = goalKind(weight, target);
  const prev = state.profile || {};
  const next = calculatePlan({ ...prev, weight, target: goal === 'maintain' ? weight : target, goal, speed: d.speed, height: Number(d.height) || prev.height });
  state.profile = { ...next, estimated: prev.estimated && !state.onboarding ? true : false, goalSet: true, goalStart: { weight, day: todayKey() } };
  state.basicsFilled = { ...(state.basicsFilled || {}), weight: true, target: true, ...(d.height ? { height: true } : {}) };
  const today = todayKey();
  state.weights = (state.weights || []).filter((x) => x.day !== today);
  state.weights.push({ day: today, value: weight });
  saveState();
  track('GoalSaved', { source: goal });
  goalDraft = null;
  toast(L('Objectif enregistré ✓')); celebrate();
  return nav(goalReturn && goalReturn !== 'goal' ? goalReturn : 'progress');
}

// Profile & focus editor: every answer of the questionnaire can be changed here.
const PF_TRACKS = [['lose', 'Perdre du poids', 'Mincir sans régime extrême', 'flame'], ['menopause', 'Ménopause & 40+', 'Hormones, sommeil, ventre', 'flower'], ['muscle', 'Prendre du muscle', 'Force et silhouette', 'dumbbell'], ['eat', 'Manger mieux', 'Énergie et santé au quotidien', 'fork']];
function openProfile() {
  profileDraft = clone(state.profile || {});
  if (!state.basicsFilled?.age && state.profile?.estimated) profileDraft.age = '';
  if (!weightKnown()) profileDraft.weight = '';
  nav('profile');
}
function pfChips(key, opts, numeric = false) {
  const cur = profileDraft[key];
  return `<div class="pf-chips">${opts.map(([v, label, sub]) => `<button class="pf-chip ${String(cur) === String(v) ? 'on' : ''}" data-pf="${key}" data-pf-value="${esc(String(v))}" ${numeric ? 'data-pf-num' : ''}><b>${L(label)}</b>${sub ? `<small>${L(sub)}</small>` : ''}</button>`).join('')}</div>`;
}
let pfOpen = new Set();
// Profile card: who the person is, the numbers NutriPilot calculated, and the plan prepared for them.
function profileHero() {
  const p = state.profile || {};
  const initials = (p.name || 'NP').trim().split(/\s+/).map((x) => x[0]).join('').slice(0, 2).toUpperCase();
  const tr = PF_TRACKS.find((x) => x[0] === p.track) || PF_TRACKS[0];
  const tone = { lose: 'm-nut', menopause: 'm-meno', muscle: 'm-train', eat: 'm-rec' }[tr[0]] || 'm-kit';
  const w = weightKnown() ? lastWeight() : Number(p.weight) || 0;
  const proj = goalSet() ? projection({ ...p, weight: w }) : null;
  const fits = ALL_RECIPES.filter((r) => recipeAllowed(r)).length;
  const place = { gym: 'en salle', home: 'à la maison' }[p.trainPlace];
  const plan = [
    ['calendar', L('Plan de repas 7 jours à {n} kcal par jour', { n: fmt(p.dailyKcal || 0) }), 'nutrition'],
    ['book', L('{n} recettes adaptées à votre profil', { n: fits }), 'recipes'],
    ...(place ? [['dumbbell', L('Programme d’entraînement {place}, {n} séances par semaine', { place: L(place), n: p.trainDays || 3 }), 'training']] : []),
    ...(p.track === 'menopause' ? [['flower', L('Espace Ménopause 40+ : journal et programme de 8 semaines'), 'menopause']] : []),
    ['coach', L('Coach, scanner de repas et suivi des progrès'), 'coach'],
  ];
  const owned = (id) => state.premium && (id === 'coach' || hasModule(id));
  return `<section class="pf-hero ${tone}">
    <div class="pf-id">
      <span class="pf-avatar"><b>${esc(initials)}</b></span>
      <div><h1>${esc(p.name || L('Votre profil'))}</h1>
        <p>${[p.age ? L('{n} ans', { n: p.age }) : '', p.height ? `${fmt(p.height)} cm` : '', w ? `${fmt(w, 1)} kg` : ''].filter(Boolean).join(' · ')}</p>
        <span class="pf-focus">${icon(tr[3])}${L(tr[1])}</span></div>
      ${state.premium ? `<span class="pf-member">${icon('star')}${esc(planLabel())}</span>` : ''}
    </div>
    <div class="pf-stats">
      <div><b>${fmt(p.dailyKcal || 0)}</b><small>${L('kcal par jour')}</small></div>
      <div><b>${fmt(p.protein || 0)} g</b><small>${L('protéines')}</small></div>
      <div><b>${fmt(waterGoal() / 1000, 1)} L</b><small>${L('d’eau')}</small></div>
      <div><b>${goalSet() ? `${fmt(p.target, 1)} kg` : '—'}</b><small>${proj ? L('vers le {date}', { date: dateFr(proj.end) }) : L('objectif')}</small></div>
    </div>
    <div class="pf-plan">
      <h2>${L('Votre plan NutriPilot')}</h2>
      <ul>${plan.map(([ico, text, id]) => `<li class="${owned(id) ? 'ok' : ''}"><span class="pp-ico">${icon(ico)}</span><span>${esc(text)}</span>${owned(id) ? icon('check') : icon('lock')}</li>`).join('')}</ul>
      ${state.premium ? `<button class="btn btn-lime btn-wide" data-go="app">${L('Voir ma journée')}</button>` : `<button class="btn btn-lime btn-wide btn-xl" data-module-buy="${recommendedTier()}">${L('Voir les formules')}</button>`}
    </div>
  </section>`;
}
function profileScreen() {
  if (!profileDraft) profileDraft = clone(state.profile || {});
  const d = profileDraft;
  const base = LANG_CUISINE[lang()] || 'fr';
  const home = CUISINES.find((c) => c[0] === base);
  // Answers are grouped in folding sections, so the profile reads as a card, not as a long form.
  let secN = 0;
  const section = (title, body, sub = '', summary = '') => { const k = `s${secN++}`; return `<details class="pf-sec" data-pf-sec="${k}" ${pfOpen.has(k) ? 'open' : ''}><summary><span><h3>${L(title)}</h3>${summary || sub ? `<small>${summary || L(sub)}</small>` : ''}</span>${icon('chevron')}</summary><div class="pf-body">${body}</div></details>`; };
  const trackRow = PF_TRACKS.find((x) => x[0] === d.track);
  return `<div class="mobile-app">
    <div class="app-head"><div class="app-head-row"><button class="icon-btn" data-nav-back aria-label="${L('Retour')}">${icon('back')}</button><h2>${L('Mon profil')}</h2><span></span></div></div>
    <div class="screen pf">
      ${profileHero()}
      <button class="pf-goal" data-open-goal>${icon('scale')}<span><small>${L('Objectif de poids')}</small><b>${goalSet() ? `${fmt(lastWeight(), 1)} → ${fmt(state.profile.target, 1)} kg` : L('Définir mon objectif')}</b></span>${icon('chevron')}</button>
      <div class="section-label pf-answers"><h3>${L('Mes réponses')}</h3></div>
      <p class="fine pf-note">${L('Modifiez n’importe quelle réponse : votre plan, vos recettes et vos séances sont recalculés dès que vous enregistrez.')}</p>
      ${section('Vous', `<div class="pf-grid">
        <label class="pf-field wide"><span>${L('Prénom')}</span><input id="pf-name" type="text" autocomplete="given-name" maxlength="40" value="${esc(d.name || '')}" placeholder="${L('Votre prénom')}"></label>
        <label class="pf-field"><span>${L('Âge')}</span><input id="pf-age" type="number" inputmode="numeric" min="18" max="90" value="${esc(d.age || '')}"></label>
        <label class="pf-field"><span>${L('Taille')} (cm)</span><input id="pf-height" type="number" inputmode="numeric" min="130" max="220" value="${esc(d.height || '')}"></label>
      </div>
      ${pfChips('sex', [['female', 'Une femme'], ['male', 'Un homme'], ['other', 'Je préfère ne pas répondre']])}`, '', [d.name, d.age ? L('{n} ans', { n: d.age }) : '', d.height ? `${d.height} cm` : ''].filter(Boolean).map(esc).join(' · '))}
      ${section('Mon focus', `<div class="pf-tracks">${PF_TRACKS.map(([v, label, sub, ico]) => `<button class="pf-track ${d.track === v ? 'on' : ''}" data-pf="track" data-pf-value="${v}">${icon(ico)}<b>${L(label)}</b><small>${L(sub)}</small></button>`).join('')}</div>
        ${d.track === 'menopause' ? `${pfChips('menopause', [['peri', 'Préménopause'], ['post', 'Ménopause'], ['unsure', 'À préciser']])}<h4>${L('Ce qui me gêne le plus')}</h4>${pfChips('menoFocus', [['hot', 'Les bouffées de chaleur'], ['sleep', 'Le sommeil'], ['belly', 'Le ventre qui s’arrondit'], ['mood', 'L’humeur et le stress'], ['joints', 'Les articulations'], ['fatigue', 'La fatigue']])}` : ''}
        ${d.track === 'muscle' ? `<h4>${L('Zone prioritaire')}</h4>${pfChips('muscleFocus', [['full', 'Tout le corps'], ['upper', 'Le haut du corps'], ['lower', 'Le bas du corps']])}` : ''}
        ${d.track === 'eat' ? `<h4>${L('Ce que je veux améliorer')}</h4>${pfChips('eatFocus', [['energy', 'Mon énergie'], ['sugar', 'Moins de sucre'], ['veg', 'Plus de légumes'], ['cook', 'Cuisiner plus'], ['digestion', 'Ma digestion']])}` : ''}`, 'Ce qui guide vos conseils, vos recettes et vos séances.', trackRow ? L(trackRow[1]) : '')}
      ${section('Mon quotidien', `<h4>${L('Moment où j’ai le plus faim')}</h4>${pfChips('hungerTime', [['morning', 'Le matin'], ['afternoon', 'L’après-midi'], ['evening', 'Le soir'], ['steady', 'Pas de moment précis']])}<h4>${L('Mes journées')}</h4>${pfChips('schedule', [['office', 'Horaires réguliers'], ['shift', 'Horaires décalés'], ['home', 'À la maison'], ['move', 'Toujours en déplacement']])}`)}
      ${section('Activité au quotidien', pfChips('activity', [[1.2, 'Plutôt assise', 'Bureau, voiture, peu de sport'], [1.375, 'Un peu active', '1 à 3 séances ou longues marches'], [1.55, 'Active', '3 à 5 séances par semaine'], [1.725, 'Très active', 'Sport ou métier physique au quotidien']], true))}
      ${section('Alimentation', `${pfChips('diet', [['balanced', 'De tout'], ['mediterranean', 'Méditerranéen'], ['high-protein', 'Riche en protéines'], ['pescatarian', 'Pescétarien'], ['vegetarian', 'Végétarien']])}
        <label class="pf-field wide"><span>${L('Aliments à éviter')}</span><input id="pf-allergies" type="text" maxlength="120" value="${esc(d.allergies && d.allergies !== 'Aucun' ? d.allergies : '')}" placeholder="${L('Ex. arachides, lactose, champignons…')}"></label>
        <h4>${L('Repas par jour')}</h4>${pfChips('mealsPerDay', [[2, '2 repas'], [3, '3 repas'], [4, '3 repas + 1 collation']], true)}
        <h4>${L('Temps pour cuisiner')}</h4>${pfChips('cooking', [['<15 min', 'Moins de 15 min'], ['15-30 min', '15 à 30 min'], ['30-45 min', '30 à 45 min']])}
        <h4>${L('Cuisine préférée')}</h4>${pfChips('cuisine', [['home', `${home?.[2] || ''} ${L(home?.[1] || 'Française')}`], ['med', 'Méditerranéenne'], ['world', 'Cuisine du monde'], ['simple', 'Très simple']])}
        <h4>${L('Budget courses')}</h4>${pfChips('budget', [['economy', 'Économique'], ['standard', 'Standard'], ['flexible', 'Flexible']])}`)}
      ${section('Entraînement', `${pfChips('trainPlace', [['gym', 'En salle de sport'], ['home', 'À la maison'], ['none', 'Pas pour l’instant']])}
        ${d.trainPlace && d.trainPlace !== 'none' ? `<h4>${L('Durée des séances')}</h4>${pfChips('sessionLength', [[30, '30 minutes'], [45, '45 minutes'], [60, '60 minutes ou plus']], true)}<h4>${L('Niveau')}</h4>${pfChips('trainLevel', [['beginner', 'Débutant(e)'], ['intermediate', 'Intermédiaire'], ['advanced', 'Confirmé(e)']])}<h4>${L('Séances par semaine')}</h4>${pfChips('trainDays', [[2, '2 séances'], [3, '3 séances'], [4, '4 séances ou plus']], true)}` : ''}`)}
      <div class="pf-save"><button class="btn btn-primary btn-wide btn-xl" data-pf-save>${L('Enregistrer mon profil')}</button></div>
    </div>
  </div>`;
}
function readProfileInputs() {
  const v = (id) => document.getElementById(id)?.value;
  if (v('pf-name') !== undefined) profileDraft.name = String(v('pf-name')).trim().slice(0, 40);
  if (v('pf-age') !== undefined) profileDraft.age = v('pf-age') === '' ? '' : Number(v('pf-age'));
  if (v('pf-height') !== undefined) profileDraft.height = v('pf-height') === '' ? '' : Number(v('pf-height'));
  if (v('pf-allergies') !== undefined) profileDraft.allergies = String(v('pf-allergies')).trim() || 'Aucun';
}
function saveProfile() {
  readProfileInputs();
  const d = profileDraft;
  if (!d.name) return toast(t('needName'));
  if (!(Number(d.age) >= 18 && Number(d.age) <= 90)) return toast(t('needAge'));
  if (d.height !== '' && !(Number(d.height) >= 130 && Number(d.height) <= 220)) return toast(L('Valeur attendue entre {min} et {max}.', { min: 130, max: 220 }));
  if (d.track === 'menopause') d.sex = 'female';
  const prev = state.profile || {};
  const weight = Number(prev.weight) || 70;
  const target = goalSet() ? Number(prev.target) : weight;
  const goal = goalKind(weight, target);
  const changedTrack = d.track !== prev.track;
  state.profile = { ...calculatePlan({ ...prev, ...d, weight, target, goal, height: Number(d.height) || prev.height || 165 }), estimated: Boolean(prev.estimated && !state.onboarding), goalSet: prev.goalSet, goalStart: prev.goalStart };
  state.basicsFilled = { ...(state.basicsFilled || {}), name: true, age: true, ...(d.height ? { height: true } : {}) };
  if (changedTrack || d.trainPlace !== prev.trainPlace || d.trainLevel !== prev.trainLevel || d.trainDays !== prev.trainDays) { state.workoutProgram = state.workoutProgram && changedTrack ? '' : state.workoutProgram; }
  if (Array.isArray(state.profile.cuisines) && d.cuisine !== prev.cuisine) state.profile.cuisines = [];
  saveState();
  track('ProfileSaved', { source: d.track || '' });
  profileDraft = null;
  toast(L('Profil mis à jour ✓'));
  return nav('app');
}

// ---- v13: Scanner module ---------------------------------------------------------
let scanCompare = [];
function pushScan(data, mode) {
  if (!data?.total) return;
  const per100 = data.source === 'openfoodfacts' ? data.foods?.[0] : null;
  state.scanHistory = [{ id: `${Date.now()}`, at: new Date().toISOString(), mode, title: data.title || '', source: data.source || '', total: clone(data.total), per100: per100 ? { kcal: per100.kcal, protein: per100.protein, carbs: per100.carbs, sugar: per100.sugar, fat: per100.fat, satFat: per100.satFat, fiber: per100.fiber, salt: per100.salt } : null, product: data.product || null, image: data.image || '' }, ...(state.scanHistory || [])].slice(0, 60);
  saveState(false);
}
function allergenChips(product) {
  if (!product) return '';
  const a = product.allergens || [];
  const tr = product.traces || [];
  const add = product.additives || [];
  return `<div class="scan-facts">
    ${a.length ? `<div class="sf-row warn-row"><b>${L('Allergènes déclarés')}</b><span>${a.map((x) => `<i>${esc(x.replace(/-/g, ' '))}</i>`).join('')}</span></div>` : `<div class="sf-row"><b>${L('Allergènes déclarés')}</b><span>${L('Aucun indiqué')}</span></div>`}
    ${tr.length ? `<div class="sf-row"><b>${L('Traces possibles')}</b><span>${tr.map((x) => `<i>${esc(x.replace(/-/g, ' '))}</i>`).join('')}</span></div>` : ''}
    <div class="sf-row"><b>${L('Additifs')}</b><span>${add.length ? add.map((x) => `<i>${esc(x)}</i>`).join('') : L('Aucun indiqué')}</span></div>
    ${product.nutriscore ? `<div class="sf-row"><b>Nutri-Score</b><span class="ns ns-${product.nutriscore}">${product.nutriscore.toUpperCase()}</span></div>` : ''}
    ${product.ingredients ? `<details class="sf-ing"><summary>${L('Liste des ingrédients')}</summary><p>${esc(product.ingredients)}</p></details>` : ''}
    <p class="fine">${L('Informations déclarées par le fabricant (Open Food Facts). Vérifiez toujours l’emballage en cas d’allergie.')}</p>
  </div>`;
}
function compareTable(a, b) {
  const rows = [['kcal', 'Calories', 'kcal', -1], ['protein', 'Protéines', 'g', 1], ['fiber', 'Fibres', 'g', 1], ['sugar', 'Sucres', 'g', -1], ['satFat', 'Graisses saturées', 'g', -1], ['salt', 'Sel', 'g', -1]];
  const cell = (x, y, dir) => { if (x == null) return '<td>—</td>'; const better = y != null && (dir > 0 ? x > y : x < y); return `<td class="${better ? 'better' : ''}">${fmt(x, 1)}</td>`; };
  return `<table class="cmp-table"><thead><tr><th>${L('Pour 100 g')}</th><th>${esc(a.title)}</th><th>${esc(b.title)}</th></tr></thead><tbody>${rows.map(([k, label, unit, dir]) => `<tr><th>${L(label)} <small>${unit}</small></th>${cell(a.per100[k], b.per100[k], dir)}${cell(b.per100[k], a.per100[k], dir)}</tr>`).join('')}</tbody></table>
    <p class="fine">${L('En vert : la valeur la plus intéressante pour chaque ligne. Comparez aussi le prix, le goût et la portion réellement consommée.')}</p>`;
}
function scannerScreen() {
  const hist = state.scanHistory || [];
  const comparable = hist.filter((x) => x.per100);
  const picked = scanCompare.map((id) => hist.find((x) => x.id === id)).filter(Boolean);
  const tiles = [['photo', 'camera', 'Photo du repas', 'Calories et macros estimées en quelques secondes'], ['barcode', 'list', 'Code-barres', 'Produits emballés, allergènes et additifs'], ['label', 'book', 'Étiquette', 'Lecture du tableau nutritionnel'], ['text', 'coach', 'Texte ou voix', 'Décrivez ce que vous avez mangé'], ['manual', 'search', 'Recherche', 'Si la photo ou le code ne marche pas']];
  return `<div class="mobile-app">
    ${appHeader('Scanner')}
    <div class="screen">
      <div class="scan-tiles">${tiles.map(([k, ico, title, sub], i) => `<button class="scan-tile ${i === 0 ? 'main' : ''}" data-add-tab="${k}">${icon(ico)}<b>${L(title)}</b><small>${L(sub)}</small></button>`).join('')}</div>
      <div class="section-label"><h3>${L('Comparer deux produits')}</h3><span class="fine">${picked.length}/2</span></div>
      ${picked.length === 2 ? compareTable(picked[0], picked[1]) : `<p class="fine">${comparable.length ? L('Touchez deux produits scannés par code-barres ci-dessous pour les comparer.') : L('Scannez au moins deux produits par code-barres pour les comparer.')}</p>`}
      <div class="section-label"><h3>${L('Historique des scans')}</h3>${hist.length ? `<button class="link-btn" data-scan-clear>${L('Effacer')}</button>` : ''}</div>
      ${hist.length ? `<div class="scan-hist">${hist.slice(0, 30).map((x) => `<div class="sh-row ${scanCompare.includes(x.id) ? 'picked' : ''}">
        <button class="sh-main" data-scan-open="${esc(x.id)}">${x.image ? `<img src="${esc(x.image)}" alt="" loading="lazy">` : `<span class="sh-ico">${icon(x.mode === 'barcode' ? 'list' : x.mode === 'label' ? 'book' : 'camera')}</span>`}<span><b>${esc(x.title)}</b><small>${esc(new Date(x.at).toLocaleDateString(locale(), { day: 'numeric', month: 'short' }))} · ${fmt(x.total.kcal)} kcal${x.product?.allergens?.length ? ` · ⚠ ${x.product.allergens.length}` : ''}</small></span></button>
        ${x.per100 ? `<button class="sh-cmp" data-scan-compare="${esc(x.id)}" aria-pressed="${scanCompare.includes(x.id)}">${scanCompare.includes(x.id) ? icon('check') : L('Comparer')}</button>` : ''}
      </div>`).join('')}</div>` : `<div class="empty">${L('Vos scans apparaîtront ici, avec leurs allergènes et leurs valeurs.')}</div>`}
    </div>
    ${bottom('scanner')}
  </div>`;
}
function scanSheet(item) {
  return `<div class="sheet-head"><div><h2>${esc(item.title)}</h2><p class="fine">${esc(new Date(item.at).toLocaleString(locale(), { dateStyle: 'medium', timeStyle: 'short' }))}</p></div><button class="icon-btn" data-close aria-label="${L('Fermer')}">×</button></div>
    <div class="result-total compact-total"><div><small>${item.per100 ? L('Pour 100 g') : L('Estimation centrale')}</small><strong>${fmt(item.total.kcal)}</strong> kcal</div>
    <div class="result-macros"><span><b>${fmt(item.total.protein, 1)}</b>${L('prot.')}</span><span><b>${fmt(item.total.carbs, 1)}</b>${L('gluc.')}</span><span><b>${fmt(item.total.fat, 1)}</b>${L('lip.')}</span><span><b>${fmt(item.total.fiber, 1)}</b>${L('fibres')}</span></div></div>
    ${allergenChips(item.product)}
    <button class="btn btn-lime btn-wide" data-scan-log="${esc(item.id)}">${L('Ajouter au journal →')}</button>`;
}

// ---- v13: Vitamins & nutrients module ------------------------------------------------
// Reference values: EU nutrient reference values (NRV) for adults; upper levels from EFSA.
const NUTRIENTS = [
  ['protein', 'Protéines', 'macro', '', 'g', 'Construisent et réparent les muscles, la peau et les tissus ; elles rassasient.', ['Poulet (150 g) · 46 g', 'Lentilles cuites (200 g) · 18 g', 'Skyr (150 g) · 16 g', 'Œufs (2) · 13 g', 'Tofu (100 g) · 13 g', 'Saumon (120 g) · 25 g'], 'Votre objectif personnel est calculé dans votre plan.', ''],
  ['fiber', 'Fibres', 'macro', 25, 'g', 'Nourrissent le microbiote, ralentissent la digestion et aident au transit et à la satiété.', ['Lentilles cuites (200 g) · 16 g', 'Framboises (125 g) · 8 g', 'Pain complet (2 tranches) · 5 g', 'Flocons d’avoine (40 g) · 4 g', 'Brocoli (150 g) · 4 g', 'Pomme (1) · 4 g'], 'Augmentez progressivement et buvez suffisamment.', ''],
  ['omega3', 'Oméga-3', 'macro', '', 'g', 'Acides gras utiles au cœur, au cerveau et à la vision.', ['Saumon (120 g) · 2,5 g', 'Sardines (100 g) · 1,5 g', 'Maquereau (100 g) · 2,5 g', 'Noix (30 g) · 2,7 g (ALA)', 'Graines de chia (15 g) · 2,5 g (ALA)', 'Graines de lin moulues (10 g) · 2,3 g (ALA)'], 'Deux portions de poisson par semaine dont un poisson gras sont souvent recommandées.', ''],
  ['vitA', 'Vitamine A', 'vit', 800, 'µg', 'Vision, peau et défenses immunitaires.', ['Patate douce (150 g)', 'Carotte (100 g)', 'Épinards (100 g)', 'Courge (150 g)', 'Œufs', 'Foie (à limiter)'], 'Les formes végétales (bêta-carotène) ne posent pas de risque d’excès.', 'Limite de sécurité EFSA : 3 000 µg par jour (vitamine A préformée).'],
  ['vitC', 'Vitamine C', 'vit', 80, 'mg', 'Défenses, cicatrisation et absorption du fer végétal.', ['Poivron rouge (100 g) · 140 mg', 'Kiwi (1) · 70 mg', 'Orange (1) · 70 mg', 'Brocoli (150 g) · 90 mg', 'Fraises (150 g) · 90 mg', 'Chou (100 g) · 40 mg'], 'Fragile à la chaleur : profitez de fruits et légumes crus.', ''],
  ['vitD', 'Vitamine D', 'vit', 5, 'µg', 'Os, muscles et immunité ; produite par la peau au soleil.', ['Saumon (120 g) · 10 µg', 'Sardines (100 g) · 5 µg', 'Œufs (2) · 2 µg', 'Boissons et yaourts enrichis', 'Champignons exposés aux UV', 'Thon (100 g) · 4 µg'], 'Les besoins varient selon le soleil, la peau et l’âge : le dosage sanguin se décide avec un médecin.', 'Limite de sécurité EFSA : 100 µg par jour.'],
  ['vitE', 'Vitamine E', 'vit', 12, 'mg', 'Antioxydant qui protège les cellules.', ['Amandes (30 g) · 8 mg', 'Graines de tournesol (20 g) · 7 mg', 'Huile de colza (1 c. à s.) · 2 mg', 'Avocat (1/2) · 2 mg', 'Épinards (100 g) · 2 mg', 'Noisettes (30 g) · 4 mg'], '', 'Limite de sécurité EFSA : 300 mg par jour.'],
  ['vitK', 'Vitamine K', 'vit', 75, 'µg', 'Coagulation et santé des os.', ['Chou kale (50 g)', 'Épinards (100 g)', 'Brocoli (150 g)', 'Persil', 'Choux de Bruxelles', 'Natto'], 'Si vous prenez un anticoagulant, gardez des apports réguliers et parlez-en à votre médecin.', ''],
  ['b9', 'Vitamine B9 (folates)', 'vit', 200, 'µg', 'Renouvellement des cellules ; essentielle avant et pendant la grossesse.', ['Lentilles cuites (200 g)', 'Épinards (100 g)', 'Pois chiches (200 g)', 'Asperges', 'Avocat', 'Brocoli'], '', 'Limite de sécurité EFSA : 1 000 µg par jour d’acide folique ajouté.'],
  ['b12', 'Vitamine B12', 'vit', 2.5, 'µg', 'Nerfs et globules rouges ; présente seulement dans les produits animaux.', ['Sardines (100 g) · 9 µg', 'Saumon (120 g) · 4 µg', 'Bœuf (120 g) · 2,5 µg', 'Œufs (2) · 1 µg', 'Yaourt (150 g) · 0,6 µg', 'Aliments enrichis'], 'En alimentation végétalienne, un complément est nécessaire : demandez conseil à un professionnel.', ''],
  ['calcium', 'Calcium', 'min', 800, 'mg', 'Os et dents, contraction musculaire.', ['Yaourt (150 g) · 200 mg', 'Emmental (30 g) · 300 mg', 'Lait (250 ml) · 300 mg', 'Boisson végétale enrichie (250 ml) · 300 mg', 'Sardines avec arêtes (100 g) · 380 mg', 'Tofu au calcium (100 g) · 350 mg'], 'Surtout important après 50 ans et à la ménopause.', 'Limite de sécurité EFSA : 2 500 mg par jour.'],
  ['iron', 'Fer', 'min', 14, 'mg', 'Transport de l’oxygène ; un manque fatigue.', ['Lentilles cuites (200 g) · 6 mg', 'Bœuf (120 g) · 3 mg', 'Pois chiches (200 g) · 4 mg', 'Épinards cuits (150 g) · 4 mg', 'Moules (100 g) · 4 mg', 'Tofu (100 g) · 3 mg'], 'Associez les sources végétales à de la vitamine C ; le thé et le café au repas réduisent l’absorption.', 'Ne prenez pas de fer sans avis médical : l’excès est toxique (niveau sûr EFSA : 40 mg par jour).'],
  ['magnesium', 'Magnésium', 'min', 375, 'mg', 'Muscles, nerfs, énergie et sommeil.', ['Graines de courge (30 g) · 160 mg', 'Amandes (30 g) · 80 mg', 'Chocolat noir 70 % (20 g) · 45 mg', 'Haricots noirs (200 g) · 120 mg', 'Épinards (100 g) · 80 mg', 'Riz complet (150 g) · 65 mg'], '', 'Limite de sécurité EFSA : 250 mg par jour sous forme de complément.'],
  ['zinc', 'Zinc', 'min', 10, 'mg', 'Immunité, cicatrisation, peau et cheveux.', ['Huîtres (6) · 30 mg', 'Bœuf (120 g) · 6 mg', 'Graines de courge (30 g) · 2 mg', 'Lentilles (200 g) · 2,5 mg', 'Fromage (30 g) · 1 mg', 'Noix de cajou (30 g) · 1,6 mg'], '', 'Limite de sécurité EFSA : 25 mg par jour.'],
  ['potassium', 'Potassium', 'min', 2000, 'mg', 'Tension artérielle, cœur et muscles.', ['Pomme de terre (200 g) · 800 mg', 'Banane (1) · 420 mg', 'Haricots blancs (200 g) · 700 mg', 'Épinards (100 g) · 550 mg', 'Avocat (1/2) · 490 mg', 'Yaourt (150 g) · 250 mg'], 'En cas de maladie rénale, suivez les conseils de votre médecin.', ''],
  ['iodine', 'Iode', 'min', 150, 'µg', 'Hormones thyroïdiennes.', ['Cabillaud (150 g) · 150 µg', 'Sel iodé (1 g) · 20 µg', 'Lait (250 ml) · 50 µg', 'Yaourt (150 g) · 40 µg', 'Œufs (2) · 50 µg', 'Algues (très variable)'], '', 'Limite de sécurité EFSA : 600 µg par jour ; prudence avec les algues.'],
  ['selenium', 'Sélénium', 'min', 55, 'µg', 'Antioxydant, thyroïde.', ['Noix du Brésil (1) · 50–90 µg', 'Thon (100 g) · 80 µg', 'Sardines (100 g) · 45 µg', 'Œufs (2) · 30 µg', 'Poulet (150 g) · 30 µg', 'Lentilles (200 g) · 6 µg'], '', 'Limite de sécurité EFSA : 255 µg par jour : une ou deux noix du Brésil suffisent.'],
];
const SUPP_UL = { vitA: [3000, 'µg'], vitD: [100, 'µg'], vitE: [300, 'mg'], b6: [12, 'mg'], b9: [1000, 'µg'], calcium: [2500, 'mg'], magnesium: [250, 'mg'], zinc: [25, 'mg'], iodine: [600, 'µg'], selenium: [255, 'µg'], iron: [40, 'mg'], caffeine: [400, 'mg'] };
// Food groups found in logged meals (estimation from names, several languages).
const FOOD_GROUPS = [
  ['dairy', 'Laitages', /(yaourt|yogh?urt|iogurte|joghurt|skyr|lait|milk|leche|leite|milch|latte|fromage|cheese|queso|queijo|käse|formaggio|kwark|quark|ricotta|feta|mozzarella|kefir|melk|kaas|süt|peynir|ヨーグルト|チーズ|우유|치즈|요거트|奶|酪|حليب|زبادي|جبن|susu|keju)/i, ['calcium', 'b12', 'iodine']],
  ['fish', 'Poissons', /(poisson|fish|pescado|peixe|fisch|pesce|saumon|salmon|salmão|lachs|salmone|thon|tuna|atún|atum|thunfisch|tonno|sardin|maquereau|mackerel|cabillaud|cod|bacalhau|merlu|crevette|prawn|shrimp|gamba|camarão|garnele|moules|mussel|vis|zalm|balık|somon|魚|鮭|サーモン|생선|연어|鱼|三文鱼|سمك|سلمون|ikan|udang)/i, ['omega3', 'vitD', 'iodine', 'selenium']],
  ['meatEggs', 'Viandes & œufs', /(poulet|chicken|pollo|frango|hähnchen|huhn|bœuf|boeuf|beef|ternera|carne|rind|manzo|dinde|turkey|pavo|peru|pute|tacchino|porc|pork|cerdo|porco|schwein|maiale|œuf|oeuf|egg|huevo|ovo|\bei\b|uovo|kip|tavuk|yumurta|et\b|鶏|卵|牛|닭|달걀|계란|소고기|鸡|蛋|牛肉|دجاج|بيض|لحم|ayam|telur|daging)/i, ['b12', 'iron', 'zinc', 'protein']],
  ['legumes', 'Légumineuses', /(lentille|lentil|lenteja|lentilha|linse|lenticch|pois chiche|chickpea|garbanzo|grão|kichererbse|cece|haricot|bean|frijol|judía|feijão|bohne|fagiol|tofu|edamame|soja|soy|hummus|houmous|dal\b|mercimek|nohut|fasulye|豆|콩|두부|بقول|عدس|حمص|kacang|tempe|tahu)/i, ['fiber', 'iron', 'b9', 'magnesium']],
  ['veg', 'Légumes', /(légume|legume|vegetable|verdura|hortaliça|gemüse|verdur|salade|salad|ensalada|salada|salat|insalat|brocoli|broccoli|épinard|spinach|espinaca|espinafre|spinat|spinaci|carotte|carrot|zanahoria|cenoura|karotte|carot|courgette|zucchini|tomate|tomato|pomodor|poivron|pepper|pimiento|pimentão|paprika|chou|cabbage|kale|aubergine|eggplant|groente|sebze|野菜|채소|蔬菜|خضار|sayur)/i, ['vitC', 'b9', 'vitK', 'potassium', 'fiber']],
  ['fruit', 'Fruits', /(fruit|fruta|frucht|obst|frutta|pomme|apple|manzana|maçã|apfel|mela|banane|banana|orange|naranja|laranja|kiwi|fraise|strawberr|fresa|morango|erdbeer|fragol|baie|berr|mango|mangue|papaya|poire|pear|pera|birne|raisin|grape|uva|traube|fruit|meyve|elma|果物|과일|水果|فاكهة|buah)/i, ['vitC', 'potassium', 'fiber']],
  ['wholegrain', 'Céréales complètes', /(complet|whole|integral|vollkorn|avoine|oat|avena|aveia|hafer|quinoa|riz brun|brown rice|arroz integral|sarrasin|buckwheat|seigle|rye|centeno|centeio|roggen|segale|boulgour|bulgur|volkoren|tam buğday|yulaf|玄米|オートミール|현미|귀리|糙米|燕麦|شوفان|أسمر|gandum)/i, ['fiber', 'magnesium', 'iron']],
  ['nuts', 'Fruits à coque & graines', /(noix|nut|nuez|noz|nuss|noce|amande|almond|almendra|amêndoa|mandel|mandorl|noisette|hazelnut|graine|seed|semilla|semente|samen|semi|chia|lin|flax|courge|pumpkin|sésame|sesame|cacahu|peanut|pistach|ceviz|badem|fındık|ナッツ|견과|坚果|مكسرات|kacang)/i, ['vitE', 'magnesium', 'omega3']],
];
let nutrientTab = 'guide';
let nutrientOpen = '';
function nutrientName(key) { const n = NUTRIENTS.find((x) => x[0] === key); return n ? L(n[1]) : key; }
function foodGroupDays(days = 7) {
  const out = Object.fromEntries(FOOD_GROUPS.map(([k]) => [k, new Set()]));
  const from = addDays(-(days - 1));
  const logged = new Set();
  for (const m of state.meals || []) {
    if (m.day < from) continue;
    logged.add(m.day);
    const text = [m.title, ...(m.foods || []).map((f) => f.name)].join(' ');
    for (const [k, , re] of FOOD_GROUPS) if (re.test(text)) out[k].add(m.day);
  }
  return { logged: logged.size, groups: out };
}
function nutrientsScreen() {
  const tabs = [['guide', 'Guide'], ['sources', 'Meilleures sources'], ['gaps', 'Mon journal']];
  let body = '';
  if (nutrientTab === 'guide') {
    const sec = (type, title) => `<div class="section-label"><h3>${L(title)}</h3></div><div class="nut-list">${NUTRIENTS.filter((n) => n[2] === type).map((n) => `<button class="nut-card ${nutrientOpen === n[0] ? 'open' : ''}" data-nutrient="${n[0]}"><span class="nut-head"><b>${L(n[1])}</b>${n[3] ? `<small>${L('Repère adulte : {v} {u} / jour', { v: fmt(n[3], n[3] < 10 ? 1 : 0), u: n[4] })}</small>` : ''}</span><span class="nut-role">${L(n[5])}</span>${nutrientOpen === n[0] ? `<span class="nut-more"><em>${L('Où le trouver')}</em>${n[6].map((x) => `<i>${esc(L(x))}</i>`).join('')}${n[7] ? `<em>${L('Bon à savoir')}</em><i>${L(n[7])}</i>` : ''}${n[8] ? `<em>${L('Sécurité')}</em><i class="nut-ul">${L(n[8])}</i>` : ''}</span>` : ''}</button>`).join('')}</div>`;
    body = `${sec('macro', 'Macronutriments utiles')}${sec('vit', 'Vitamines')}${sec('min', 'Minéraux')}
      <p class="fine center-fine">${L('Repères adultes : valeurs nutritionnelles de référence de l’Union européenne. Les besoins varient selon l’âge, la grossesse et la santé.')}</p>`;
  } else if (nutrientTab === 'sources') {
    const pick = nutrientOpen && NUTRIENTS.find((n) => n[0] === nutrientOpen) ? nutrientOpen : 'calcium';
    const n = NUTRIENTS.find((x) => x[0] === pick);
    body = `<p class="screen-sub">${L('Choisissez un nutriment pour voir les aliments qui en apportent le plus, par portion courante.')}</p>
      <div class="chip-row wrap">${NUTRIENTS.map((x) => `<button class="mini-choice ${x[0] === pick ? 'selected' : ''}" data-nutrient-src="${x[0]}">${L(x[1])}</button>`).join('')}</div>
      <div class="src-card"><h3>${L(n[1])}</h3><p class="fine">${L(n[5])}</p><ol>${n[6].map((x) => `<li>${esc(L(x))}</li>`).join('')}</ol>${n[7] ? `<p class="fine">${L(n[7])}</p>` : ''}</div>`;
  } else {
    const { logged, groups } = foodGroupDays(7);
    const missing = FOOD_GROUPS.filter(([k]) => groups[k].size <= 1);
    body = logged < 3
      ? `<div class="empty">${L('Notez vos repas au moins 3 jours cette semaine : NutriPilot repérera les groupes d’aliments peu présents.')}<br><br><button class="btn btn-lime" data-open-add>${L('Ajouter un repas')}</button></div>`
      : `<p class="screen-sub">${L('Sur vos {n} jours notés cette semaine, voici la présence de chaque groupe d’aliments.', { n: logged })}</p>
        <div class="fg-list">${FOOD_GROUPS.map(([k, label, , nut]) => { const d = groups[k].size; return `<div class="fg-row ${d <= 1 ? 'low' : ''}"><span><b>${L(label)}</b><small>${nut.map(nutrientName).join(' · ')}</small></span><span class="fg-bar"><i style="width:${Math.min(100, d / Math.max(1, logged) * 100)}%"></i></span><em>${L('{d}/{n} j', { d, n: logged })}</em></div>`; }).join('')}</div>
        ${missing.length ? `<div class="insight"><strong>${L('À ajouter plus souvent')}</strong>${missing.map(([, label, , nut]) => esc(L('{g} : pour {n}.', { g: L(label), n: nut.map(nutrientName).join(', ') }))).join('<br>')}</div>` : `<div class="insight"><strong>${L('Belle variété cette semaine')}</strong>${L('Tous les grands groupes d’aliments sont présents dans votre journal.')}</div>`}
        <p class="fine">${L('Estimation à partir des noms de vos repas : ce n’est pas une analyse de laboratoire ni un diagnostic de carence. En cas de fatigue ou de doute, parlez-en à un professionnel de santé.')}</p>`;
  }
  return `<div class="mobile-app">
    ${appHeader('Vitamines & nutriments')}
    <div class="screen">
      <div class="tab-scroll mod-tabs">${tabs.map(([k, label]) => `<button class="${nutrientTab === k ? 'active' : ''}" data-nutrient-tab="${k}">${L(label)}</button>`).join('')}</div>
      ${body}
    </div>
    ${bottom('nutrients')}
  </div>`;
}

// ---- v13: Supplements module ----------------------------------------------------------
const SUPP_INFO = [
  ['creatine', 'Créatine', 'Solide', 'Améliore la force et la performance sur les efforts courts et intenses, surtout avec un entraînement de musculation.', 'Bien étudiée chez l’adulte en bonne santé. Demandez un avis médical en cas de maladie rénale.'],
  ['protein', 'Protéine en poudre (whey, végétale)', 'Solide', 'Pratique pour atteindre son objectif de protéines ; n’apporte rien de plus que des aliments riches en protéines.', 'Vérifiez les allergènes (lait, soja) et la teneur en sucre.'],
  ['vitD', 'Vitamine D', 'Modérée', 'Utile en cas d’apport faible ou de peu d’exposition au soleil, notamment l’hiver et après 50 ans.', 'Ne dépassez pas 100 µg par jour sans avis médical. Le dosage sanguin se décide avec un médecin.'],
  ['omega3', 'Oméga-3 (huile de poisson)', 'Modérée', 'Peut aider à atteindre les apports si l’on mange peu de poisson gras ; les effets sur le cœur sont discutés.', 'Prudence avec les anticoagulants et avant une opération : parlez-en à votre médecin.'],
  ['magnesium', 'Magnésium', 'Limitée', 'Utile si l’alimentation en apporte peu ; les effets sur le sommeil et les crampes sont peu démontrés.', 'Au-delà de 250 mg par jour en complément : troubles digestifs possibles. Prudence en cas de maladie rénale.'],
  ['iron', 'Fer', 'Solide si carence', 'Corrige une carence confirmée par une prise de sang.', 'À ne prendre que sur avis médical : l’excès de fer est toxique. Tenir hors de portée des enfants.'],
  ['b12', 'Vitamine B12', 'Solide', 'Indispensable en alimentation végétalienne et souvent utile après 50 ans.', 'Bien tolérée. Les besoins exacts se discutent avec un professionnel.'],
  ['collagen', 'Collagène', 'Limitée', 'Quelques études sur la peau et les articulations, de qualité variable.', 'C’est une protéine incomplète : elle ne remplace pas les autres sources de protéines.'],
  ['melatonin', 'Mélatonine', 'Modérée', 'Aide à décaler l’endormissement (décalage horaire, horaires tardifs).', 'Statut différent selon les pays ; à éviter avec certains médicaments. Demandez conseil à un pharmacien.'],
  ['caffeine', 'Caféine', 'Solide', 'Améliore la vigilance et la performance d’endurance.', 'Jusqu’à 400 mg par jour pour un adulte selon l’EFSA, 200 mg maximum en une prise. Évitez-la l’après-midi si vous dormez mal.'],
  ['multi', 'Multivitamines', 'Limitée', 'Peu utiles si l’alimentation est variée ; peuvent aider en cas de régime très restreint.', 'Additionnez les doses avec vos autres compléments pour éviter les doublons.'],
  ['probiotics', 'Probiotiques', 'Limitée', 'Effets qui dépendent de la souche et de la situation (par exemple après des antibiotiques).', 'Demandez conseil en cas de système immunitaire fragile.'],
];
let suppTab = 'mine';
let suppImage = '';
let suppDraft = null;
function suppTotals() {
  const totals = {};
  for (const s of state.supplements || []) {
    if (s.paused) continue;
    const perDay = Number(s.perDay || 1);
    for (const ing of s.ingredients || []) {
      if (!ing.key || ing.key === 'other' || ing.amount == null) continue;
      let amount = Number(ing.amount) * perDay;
      let unit = ing.unit;
      if (unit === 'UI' && ing.key === 'vitD') { amount = amount / 40; unit = 'µg'; }
      if (unit === 'g') { amount *= 1000; unit = 'mg'; }
      if (unit === 'mg' && SUPP_UL[ing.key]?.[1] === 'µg') { amount *= 1000; unit = 'µg'; }
      const t = totals[ing.key] ||= { amount: 0, unit, products: [] };
      t.amount += amount; t.products.push(s.name);
    }
  }
  return totals;
}
function suppAlerts() {
  const totals = suppTotals();
  const out = [];
  for (const [key, t] of Object.entries(totals)) {
    const names = [...new Set(t.products)];
    if (names.length > 1) out.push(['dup', L('{n} se trouve dans plusieurs produits : {p}.', { n: nutrientName(key), p: names.join(', ') })]);
    const ul = SUPP_UL[key];
    if (ul && t.unit === ul[1] && t.amount > ul[0]) out.push(['ul', L('{n} : environ {a} {u} par jour avec vos compléments, au-dessus du repère de sécurité ({l} {u}). Parlez-en à un professionnel avant de continuer.', { n: nutrientName(key), a: fmt(t.amount, 0), u: ul[1], l: fmt(ul[0]) })]);
  }
  return out;
}
// Quick-add catalogue: typical values per serving, editable before saving (check your own label).
const SUPP_PRESETS = [
  { id: 'whey', name: 'Whey protéine', serving: '30 g', icon: 'dumbbell', ings: [['Protéines', 24, 'g', 'protein']], macros: { kcal: 120, protein: 24, carbs: 3, fat: 1.5 } },
  { id: 'whey-iso', name: 'Whey isolate', serving: '30 g', icon: 'dumbbell', ings: [['Protéines', 27, 'g', 'protein']], macros: { kcal: 110, protein: 27, carbs: 1, fat: 0.5 } },
  { id: 'plant', name: 'Protéine végétale', serving: '30 g', icon: 'leaf', ings: [['Protéines', 21, 'g', 'protein']], macros: { kcal: 115, protein: 21, carbs: 3, fat: 2 } },
  { id: 'creatine', name: 'Créatine monohydrate', serving: '3 g', icon: 'flame', ings: [['Créatine', 3, 'g', 'creatine']] },
  { id: 'vitd', name: 'Vitamine D3', serving: '1 gélule', icon: 'sun', ings: [['Vitamine D3', 25, 'µg', 'vitD']] },
  { id: 'omega3', name: 'Oméga-3', serving: '1 g', icon: 'drop', ings: [['EPA + DHA', 300, 'mg', 'omega3']] },
  { id: 'magnesium', name: 'Magnésium', serving: '1 comprimé', icon: 'moon', ings: [['Magnésium', 100, 'mg', 'magnesium']] },
  { id: 'multi', name: 'Multivitamines', serving: '1 comprimé', icon: 'pill', ings: [['Vitamine C', 80, 'mg', 'vitC'], ['Vitamine D', 5, 'µg', 'vitD'], ['Vitamine E', 12, 'mg', 'vitE'], ['Vitamine B9 (folates)', 200, 'µg', 'b9'], ['Vitamine B12', 2.5, 'µg', 'b12'], ['Zinc', 5, 'mg', 'zinc']] },
  { id: 'b12', name: 'Vitamine B12', serving: '1 comprimé', icon: 'pill', ings: [['Vitamine B12', 25, 'µg', 'b12']] },
  { id: 'collagen', name: 'Collagène', serving: '10 g', icon: 'heart', ings: [['Collagène', 10, 'g', 'other']], macros: { kcal: 36, protein: 9, carbs: 0, fat: 0 } },
  { id: 'preworkout', name: 'Pré-entraînement', serving: '1 dose', icon: 'flame', ings: [['Caféine', 200, 'mg', 'caffeine']] },
  { id: 'iron', name: 'Fer', serving: '1 comprimé', icon: 'pill', ings: [['Fer', 14, 'mg', 'iron']] },
];
function presetDraft(id) {
  const p = SUPP_PRESETS.find((x) => x.id === id);
  if (!p) return null;
  return { name: `${L(p.name)} (${L(p.serving)})`, brand: '', perDay: 1, preset: p.id, ingredients: p.ings.map(([name, amount, unit, key]) => ({ name: L(name), amount, unit, key })), macros: p.macros ? { ...p.macros } : null, warnings: [] };
}
function suppKey(i) { const x = state.supplements?.[i]; if (x && !x.id) x.id = `s${Date.now().toString(36)}${i}`; return x?.id || `i${i}`; }
function suppTakenToday(i) { return Boolean(state.suppTaken?.[todayKey()]?.[suppKey(i)]); }
function suppForm(d) {
  return `<div class="supp-form">
    <label class="pf-field wide"><span>${L('Nom du produit')}</span><input id="sp-name" maxlength="100" value="${esc(d.name || '')}"></label>
    <div class="pf-grid"><label class="pf-field"><span>${L('Marque')}</span><input id="sp-brand" maxlength="80" value="${esc(d.brand || '')}"></label><label class="pf-field"><span>${L('Prises par jour')}</span><input id="sp-perday" type="number" min="0.5" max="6" step="0.5" value="${esc(d.perDay || 1)}"></label></div>
    <h4>${L('Ingrédients déclarés (par prise)')}</h4>
    <div class="sp-ings">${(d.ingredients || []).map((x, i) => `<div class="sp-ing"><span><b>${esc(x.name)}</b><small>${x.amount != null ? `${fmt(x.amount, 2)} ${esc(x.unit)}` : L('quantité non lue')}</small></span><button class="icon-btn" data-sp-ing-del="${i}" aria-label="${L('Retirer')}">${icon('close')}</button></div>`).join('') || `<p class="fine">${L('Aucun ingrédient pour l’instant.')}</p>`}</div>
    <div class="sp-add"><input id="sp-ing-name" placeholder="${L('Ex. Vitamine D3')}"><input id="sp-ing-amount" type="number" step="any" placeholder="25"><select id="sp-ing-unit">${['mg', 'µg', 'g', 'UI'].map((u) => `<option>${u}</option>`).join('')}</select><select id="sp-ing-key">${[...NUTRIENTS.filter((n) => n[2] !== 'macro' || n[0] === 'omega3'), ['b6', 'Vitamine B6'], ['caffeine', 'Caféine'], ['creatine', 'Créatine'], ['other', 'Autre']].map((n) => `<option value="${n[0]}">${L(n[1])}</option>`).join('')}</select><button class="btn btn-ghost" data-sp-ing-add>${icon('plus')}</button></div>
    <details class="sp-macros" ${d.macros ? 'open' : ''}><summary>${L('Valeurs nutritionnelles par prise (protéines en poudre, shakes)')}</summary>
      <div class="pf-grid four">${[['kcal', 'Calories', 'kcal'], ['protein', 'Protéines', 'g'], ['carbs', 'Glucides', 'g'], ['fat', 'Lipides', 'g']].map(([k, label, u]) => `<label class="pf-field"><span>${L(label)} (${u})</span><input id="sp-m-${k}" type="number" min="0" step="any" value="${d.macros?.[k] ?? ''}"></label>`).join('')}</div>
      <p class="fine">${L('Renseignées, elles permettent d’ajouter la prise à votre journal alimentaire en un geste.')}</p>
    </details>
    ${d.warnings?.length ? `<div class="warn"><b>${L('Mentions de l’étiquette')}</b><br>${d.warnings.map(esc).join('<br>')}</div>` : ''}
    <div class="modal-actions"><button class="btn btn-ghost" data-sp-cancel>${L('Annuler')}</button><button class="btn btn-primary" data-sp-save>${L('Enregistrer')}</button></div>
  </div>`;
}
function supplementsScreen() {
  const tabs = [['mine', 'Mes compléments'], ['scan', 'Scanner une étiquette'], ['alerts', 'Alertes'], ['info', 'Fiches']];
  const list = state.supplements || [];
  let body = '';
  if (suppDraft) body = suppForm(suppDraft);
  else if (suppTab === 'mine') {
    const active = list.map((x, i) => [x, i]).filter(([x]) => !x.paused);
    const taken = active.filter(([, i]) => suppTakenToday(i)).length;
    const protToday = state.meals.filter((m) => m.day === todayKey() && m.source === 'supplement').reduce((sum, m) => sum + Number(m.total?.protein || 0), 0);
    body = `${active.length ? `<div class="supp-today"><div><small>${L('Aujourd’hui')}</small><b>${L('{n} sur {t} pris', { n: taken, t: active.length })}</b></div><span class="supp-ring" style="--p:${Math.round(taken / active.length * 100)}%"><i>${Math.round(taken / active.length * 100)}%</i></span>${protToday ? `<em>${icon('dumbbell')} ${L('{n} g de protéines ajoutées au journal', { n: fmt(protToday) })}</em>` : ''}</div>` : ''}
      ${list.length ? `<div class="supp-list">${list.map((x, i) => { const done = suppTakenToday(i); const per = x.macros?.protein ? L('{p} g de protéines · {k} kcal par prise', { p: fmt(x.macros.protein, 1), k: fmt(x.macros.kcal || 0) }) : L('{n} ingrédients', { n: (x.ingredients || []).length }); return `<div class="supp-card ${x.paused ? 'paused' : ''} ${done ? 'done' : ''}">
          <button class="supp-check" data-sp-take="${i}" ${x.paused ? 'disabled' : ''} aria-pressed="${done}" aria-label="${L('Pris aujourd’hui')}">${icon('check')}</button>
          <span class="supp-main"><b>${esc(x.name)}</b><small>${esc(x.brand || '')}${x.brand ? ' · ' : ''}${L('{n} par jour', { n: fmt(x.perDay || 1, 1) })} · ${per}</small>
            ${x.macros?.protein && !x.paused ? `<button class="supp-log" data-sp-log="${i}">${icon('plus')} ${L('Ajouter un shake au journal')}</button>` : ''}</span>
          <span class="supp-actions"><button class="link-btn" data-sp-edit="${i}">${L('Modifier')}</button><button class="link-btn" data-sp-pause="${i}">${x.paused ? L('Reprendre') : L('Pause')}</button></span></div>`; }).join('')}</div>` : `<div class="empty">${L('Ajoutez vos compléments pour repérer les doublons et les doses élevées.')}</div>`}
      <div class="section-label"><h3>${L('Ajouter rapidement')}</h3><span class="fine">${L('valeurs courantes, modifiables')}</span></div>
      <div class="sp-presets">${SUPP_PRESETS.map((p) => `<button class="sp-preset" data-sp-preset="${p.id}">${icon(p.icon)}<span><b>${esc(L(p.name))}</b><small>${esc(L(p.serving))}${p.macros ? ` · ${fmt(p.macros.protein)} g ${L('prot.')}` : ''}</small></span></button>`).join('')}</div>
      <div class="settings-two"><button class="btn btn-lime" data-supp-tab="scan">${icon('camera')}<span>${L('Scanner l’étiquette')}</span></button><button class="btn btn-ghost" data-sp-new>${icon('plus')}<span>${L('Saisir à la main')}</span></button></div>`;
  } else if (suppTab === 'scan') {
    body = `<label class="upload"><input id="supp-image" type="file" accept="image/*" capture="environment"><div class="camera-ico">📷</div><h3>${L('Photographier l’étiquette')}</h3><p class="fine">${L('Cadrez la liste des ingrédients et le tableau des quantités.')}</p></label>
      <div class="field"><label>${L('Ou collez le texte de l’étiquette')}</label><textarea class="textarea compact" id="supp-text" placeholder="${L('Ex. Vitamine D3 25 µg, Magnésium 100 mg…')}"></textarea></div>
      <button class="btn btn-primary btn-wide" data-supp-read>${L('Lire l’étiquette')}</button>
      <p class="fine">${L('NutriPilot recopie ce qui est déclaré sur l’étiquette. Vérifiez chaque ligne avant d’enregistrer.')}</p>`;
  } else if (suppTab === 'alerts') {
    const alerts = suppAlerts();
    const totals = suppTotals();
    body = `${alerts.length ? `<div class="alert-list">${alerts.map(([k, txt]) => `<div class="alert-row ${k}">${icon(k === 'ul' ? 'bell' : 'swap')}<span>${esc(txt)}</span></div>`).join('')}</div>` : `<div class="insight"><strong>${L('Aucune alerte')}</strong>${list.length ? L('Pas de doublon ni de dose au-dessus des repères de sécurité dans vos compléments enregistrés.') : L('Ajoutez vos compléments pour activer les alertes.')}</div>`}
      ${Object.keys(totals).length ? `<div class="section-label"><h3>${L('Total par jour avec vos compléments')}</h3></div><div class="nutrition-detail">${Object.entries(totals).map(([k, t]) => `<div><span>${esc(nutrientName(k))}</span><b>${fmt(t.amount, t.amount < 10 ? 1 : 0)} ${esc(t.unit)}</b></div>`).join('')}</div>` : ''}
      <p class="fine">${L('Les alertes se basent sur les quantités déclarées et les limites de sécurité européennes (EFSA). Elles ne remplacent pas l’avis d’un médecin ou d’un pharmacien, surtout si vous prenez des médicaments, êtes enceinte ou allaitez.')}</p>`;
  } else {
    body = `<div class="supp-info">${SUPP_INFO.map(([k, name, ev, use, caution]) => `<details class="si-card"><summary><b>${L(name)}</b><span class="ev ev-${ev === 'Solide' || ev === 'Solide si carence' ? 'hi' : ev === 'Modérée' ? 'mid' : 'lo'}">${L('Preuves : {e}', { e: L(ev) })}</span></summary><p>${L(use)}</p><p class="si-caution">${icon('bell')}<span>${L(caution)}</span></p></details>`).join('')}</div>
      <p class="fine center-fine">${L('Fiches d’information générale. NutriPilot ne recommande aucun complément ni aucune dose.')}</p>`;
  }
  return `<div class="mobile-app">
    ${appHeader('Compléments')}
    <div class="screen">
      ${suppDraft ? '' : `<div class="tab-scroll mod-tabs">${tabs.map(([k, label]) => `<button class="${suppTab === k ? 'active' : ''}" data-supp-tab="${k}">${L(label)}</button>`).join('')}</div>`}
      ${body}
    </div>
    ${bottom('supplements')}
  </div>`;
}
function readSuppForm() {
  if (!suppDraft) return;
  const v = (id) => document.getElementById(id)?.value;
  if (v('sp-name') !== undefined) suppDraft.name = String(v('sp-name')).trim().slice(0, 100);
  if (v('sp-brand') !== undefined) suppDraft.brand = String(v('sp-brand')).trim().slice(0, 80);
  if (v('sp-m-protein') !== undefined) {
    const m = Object.fromEntries(['kcal', 'protein', 'carbs', 'fat'].map((k) => [k, v(`sp-m-${k}`) === '' ? null : Math.max(0, Number(v(`sp-m-${k}`)) || 0)]));
    suppDraft.macros = m.kcal != null || m.protein != null ? { kcal: m.kcal || 0, protein: m.protein || 0, carbs: m.carbs || 0, fat: m.fat || 0 } : null;
  }
  if (v('sp-perday') !== undefined) suppDraft.perDay = clamp(Number(v('sp-perday')) || 1, 0.5, 6);
}

// ---- v13: Sleep, stress & eating behaviour ---------------------------------------------
let sleepTab = 'today';
let relaxRun = null;
const BREATHS = [
  ['coherence', 'Cohérence 5-5', 'Inspirez 5 s, expirez 5 s. Calme le rythme du cœur.', [['in', 5], ['out', 5]]],
  ['478', 'Respiration 4-7-8', 'Pour s’endormir : inspirez 4 s, retenez 7 s, expirez 8 s.', [['in', 4], ['hold', 7], ['out', 8]]],
  ['box', 'Respiration carrée', 'Inspirez, retenez, expirez, retenez : 4 s chacun.', [['in', 4], ['hold', 4], ['out', 4], ['hold', 4]]],
];
const RELAX = [
  ['scan', 'Détente du corps', 3, ['Installez-vous confortablement et fermez les yeux si vous le souhaitez.', 'Respirez lentement par le nez.', 'Relâchez votre front, vos sourcils et votre mâchoire.', 'Laissez vos épaules descendre, loin des oreilles.', 'Sentez vos bras devenir lourds et détendus.', 'Votre ventre se soulève à l’inspiration et redescend à l’expiration.', 'Relâchez le bas du dos et les hanches.', 'Vos jambes et vos pieds deviennent lourds.', 'Observez votre corps entier, détendu, sans rien changer.', 'Prenez encore trois respirations lentes.', 'Quand vous êtes prête ou prêt, ouvrez doucement les yeux.']],
  ['night', 'Préparer le sommeil', 5, ['Éteignez les écrans et baissez la lumière.', 'Allongez-vous et posez une main sur votre ventre.', 'Inspirez en comptant jusqu’à quatre.', 'Expirez lentement en comptant jusqu’à six.', 'Pensez à trois choses simples qui se sont bien passées aujourd’hui.', 'Si une pensée revient, notez-la mentalement pour demain, puis revenez au souffle.', 'Imaginez un endroit calme où vous vous sentez en sécurité.', 'Remarquez les sons, la température, la lumière douce de cet endroit.', 'Laissez votre respiration devenir de plus en plus lente.', 'Il n’y a rien d’autre à faire maintenant que vous reposer.']],
  ['reset', 'Pause anti-stress', 2, ['Posez les deux pieds au sol.', 'Nommez cinq choses que vous voyez autour de vous.', 'Quatre choses que vous pouvez toucher.', 'Trois sons que vous entendez.', 'Inspirez profondément, puis soufflez longuement par la bouche.', 'Encore une fois, plus lentement.', 'Demandez-vous : de quoi ai-je besoin, là, maintenant ?', 'Choisissez une petite action pour les dix prochaines minutes.']],
];
RELAX.push(
  ['wake', 'Réveillé(e) la nuit', 4, ['Ne regardez pas l’heure : elle relance le stress.', 'Allongé(e) sur le dos, posez les mains sur le ventre.', 'Inspirez par le nez en gonflant doucement le ventre.', 'Expirez lentement, un peu plus longtemps que l’inspiration.', 'Imaginez un escalier : à chaque expiration, vous descendez d’une marche.', 'Si une pensée arrive, dites-lui « plus tard » et revenez au souffle.', 'Relâchez la langue, la mâchoire et le front.', 'Laissez le corps s’enfoncer dans le matelas.', 'Si vous êtes toujours éveillé(e) dans 20 minutes, levez-vous, lumière douce, puis revenez quand le sommeil arrive.']],
  ['gratitude', 'Gratitude du soir', 3, ['Asseyez-vous ou allongez-vous confortablement.', 'Repensez à un moment agréable de votre journée, même tout petit.', 'Revivez-le : où étiez-vous, qu’avez-vous ressenti ?', 'Pensez à une personne qui a compté pour vous aujourd’hui.', 'Remerciez-vous pour une chose que vous avez faite.', 'Respirez lentement trois fois en gardant ces images.', 'Demain est un nouveau jour : il n’y a rien d’autre à faire ce soir.']],
  ['anxiety', 'Apaiser l’anxiété', 4, ['Posez une main sur la poitrine, une main sur le ventre.', 'Remarquez simplement votre respiration, sans la changer.', 'Maintenant, ralentissez l’expiration : comptez jusqu’à six.', 'Dites-vous : « C’est désagréable, mais je suis en sécurité. »', 'Desserrez les poings, laissez tomber les épaules.', 'Nommez ce que vous ressentez : peur, colère, fatigue… Nommer apaise.', 'Encore trois respirations lentes, l’expiration plus longue.', 'Choisissez une petite chose douce à faire maintenant.']],
);
const ROUTINE = [['screens', 'Écrans éteints 30 minutes avant le coucher'], ['light', 'Lumière douce le soir'], ['cool', 'Chambre fraîche et aérée'], ['caffeine', 'Pas de caféine après 14 h'], ['dinner', 'Dîner léger au moins 2 h avant le coucher'], ['breath', '3 minutes de respiration'], ['same', 'Coucher à heure régulière']];
const EMOTIONS = [['stress', 'Stress'], ['bored', 'Ennui'], ['tired', 'Fatigue'], ['sad', 'Tristesse'], ['happy', 'Joie / fête'], ['social', 'Entourage'], ['habit', 'Habitude']];
function sleepDuration(e) {
  if (!e?.bed || !e?.wake) return 0;
  const [bh, bm] = e.bed.split(':').map(Number); const [wh, wm] = e.wake.split(':').map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm); if (mins <= 0) mins += 1440;
  return mins / 60;
}
function speak(text) {
  try {
    if (!('speechSynthesis' in window) || state.relaxVoice === false) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LOCALES[lang()]?.replace('-u-nu-latn', '') || 'fr-FR';
    u.rate = 0.88; u.pitch = 1;
    speechSynthesis.speak(u);
  } catch { /* voice is optional */ }
}
function stopRelax() {
  if (relaxRun?.timer) clearTimeout(relaxRun.timer);
  relaxRun = null;
  try { speechSynthesis.cancel(); } catch { /* ignore */ }
}
function runBreath(id) {
  stopRelax();
  const b = BREATHS.find((x) => x[0] === id);
  relaxRun = { kind: 'breath', id, step: 0, cycles: 0 };
  const words = { in: 'Inspirez', out: 'Expirez', hold: 'Retenez' };
  const tick = () => {
    if (!relaxRun || relaxRun.id !== id) return;
    const [phase, secs] = b[3][relaxRun.step % b[3].length];
    const el = document.getElementById('breath-live');
    if (!el) return stopRelax();
    el.className = `breath-live ${phase}`;
    el.style.setProperty('--d', `${secs}s`);
    el.querySelector('b').textContent = L(words[phase]);
    el.querySelector('small').textContent = `${secs} s`;
    speak(L(words[phase]));
    relaxRun.step += 1;
    if (relaxRun.step % b[3].length === 0) relaxRun.cycles += 1;
    if (relaxRun.cycles >= 8) { el.querySelector('b').textContent = L('Bravo'); speak(L('Bravo')); relaxRun = null; return; }
    relaxRun.timer = setTimeout(tick, secs * 1000);
  };
  setTimeout(tick, 60);
}
function runRelax(id) {
  stopRelax();
  const r = RELAX.find((x) => x[0] === id);
  relaxRun = { kind: 'relax', id, step: 0 };
  const per = Math.max(9000, r[2] * 60000 / r[3].length);
  const tick = () => {
    if (!relaxRun || relaxRun.id !== id) return;
    const el = document.getElementById('relax-live');
    if (!el) return stopRelax();
    const line = r[3][relaxRun.step];
    if (!line) { el.innerHTML = `<b>${L('Terminé')}</b>`; relaxRun = null; return; }
    el.innerHTML = `<small>${relaxRun.step + 1}/${r[3].length}</small><b>${esc(L(line))}</b>`;
    speak(L(line));
    relaxRun.step += 1;
    relaxRun.timer = setTimeout(tick, per);
  };
  setTimeout(tick, 60);
}
// ---- v16: Sleep & stress platform ------------------------------------------------------
const SLEEP_FACTORS = [['caffeine', 'Caféine après 14 h', 'drop'], ['alcohol', 'Alcool', 'moon'], ['screens', 'Écrans au lit', 'scan'], ['lateMeal', 'Dîner tardif', 'fork'], ['lateSport', 'Sport le soir', 'dumbbell'], ['stress', 'Journée stressante', 'bell'], ['nap', 'Sieste', 'sun']];
const SOUNDS = [['rain', 'Pluie', 'drop'], ['waves', 'Vagues', 'heart'], ['fire', 'Feu de cheminée', 'flame'], ['brown', 'Bruit brun', 'moon'], ['pink', 'Bruit rose', 'leaf'], ['white', 'Bruit blanc', 'star']];
const SLEEP_NIGHTS = [
  ['Fixez votre heure de lever', ['Se lever à la même heure, même le week-end, règle l’horloge interne.', 'Choisissez une heure tenable 7 jours sur 7.', 'Le soir, couchez-vous quand vous avez sommeil, pas avant.'], 'Réglez une alarme de lever identique pour toute la semaine.'],
  ['La lumière, votre meilleur réglage', ['La lumière du matin avance l’endormissement du soir.', 'Le soir, la lumière vive et les écrans retardent la mélatonine.', '10 minutes dehors le matin suffisent, même par temps gris.'], 'Demain matin : 10 minutes de lumière naturelle dans l’heure qui suit le lever.'],
  ['Caféine, alcool et dîner', ['La caféine agit 6 à 8 heures : la dernière tasse avant 14 h.', 'L’alcool endort mais fragmente la seconde moitié de la nuit.', 'Un dîner léger 2 à 3 heures avant le coucher facilite le sommeil.'], 'Ce soir : pas de caféine après 14 h et dîner au moins 2 h avant le coucher.'],
  ['Une chambre faite pour dormir', ['Fraîche (autour de 18 °C), sombre et calme.', 'Le lit sert à dormir : évitez d’y travailler ou d’y scroller.', 'Un bruit de fond régulier masque les bruits soudains.'], 'Ce soir : chambre aérée, téléphone hors du lit et un son apaisant si besoin.'],
  ['Vider sa tête avant de dormir', ['Les pensées qui tournent retardent l’endormissement.', 'Les écrire sur papier ou dans l’app les « range » pour demain.', 'Associez chaque souci à une petite action concrète.'], 'Ce soir : 5 minutes dans « Stress & pensées » avant d’éteindre.'],
  ['Si le sommeil ne vient pas', ['Rester au lit éveillé(e) associe le lit à l’agitation.', 'Au bout d’environ 20 minutes, levez-vous dans une lumière douce.', 'Revenez au lit quand les paupières sont lourdes.'], 'Ce soir, si vous ne dormez pas : la relaxation « Réveillé(e) la nuit », puis la règle des 20 minutes.'],
  ['Votre routine durable', ['Gardez les 2 ou 3 habitudes qui ont le plus aidé.', 'Une semaine imparfaite n’annule rien : la régularité gagne.', 'Si les nuits restent difficiles plus de 3 mois, parlez-en à un médecin.'], 'Choisissez vos 3 habitudes dans « Rituel du soir » et gardez-les.'],
];
const SLEEP_LESSONS = [
  ['Les cycles du sommeil', 'Une nuit compte 4 à 6 cycles d’environ 90 minutes, alternant sommeil léger, profond et paradoxal (rêves). Le sommeil profond domine en début de nuit, les rêves en fin de nuit : se coucher très tard ou se lever trop tôt prive surtout de l’un ou de l’autre.'],
  ['L’horloge interne', 'Le rythme circadien suit la lumière. Une heure de lever fixe et la lumière du matin le stabilisent ; les écrans et la lumière vive le soir le décalent vers plus tard.'],
  ['Sieste : la bonne dose', 'Une sieste de 10 à 20 minutes avant 15 h recharge sans gêner la nuit. Au-delà de 30 minutes, on entre en sommeil profond et le réveil est pâteux.'],
  ['Stress et cortisol', 'Le stress élève le cortisol et l’éveil. La respiration lente, avec une expiration plus longue que l’inspiration, active le système parasympathique qui calme le corps.'],
  ['Sommeil et appétit', 'Après une nuit courte, la faim et l’envie de sucre augmentent. Mieux dormir aide donc aussi à mieux manger et à atteindre un objectif de poids.'],
  ['Ménopause et nuits', 'Bouffées de chaleur et sueurs nocturnes fragmentent le sommeil. Chambre fraîche, vêtements légers, alcool limité et suivi des facteurs aident ; parlez à un médecin si cela vous gêne beaucoup.'],
];
// Sleep score 0–100 from duration, felt quality and night wakings (an indication, not a measure).
function sleepScore(e) {
  const h = sleepDuration(e);
  if (!h) return 0;
  const dur = h >= 7 && h <= 9 ? 50 : h < 7 ? Math.max(0, 50 - (7 - h) * 16) : Math.max(25, 50 - (h - 9) * 12);
  const q = e.quality ? (Number(e.quality) / 5) * 30 : 18;
  const w = e.wakeups === undefined ? 14 : [20, 14, 8, 3][Math.min(3, Number(e.wakeups))];
  return Math.round(dur + q + w);
}
function lastNight() {
  for (let i = 0; i < 2; i += 1) { const d = addDays(-i); if (state.sleepLog?.[d] && sleepDuration(state.sleepLog[d])) return [d, state.sleepLog[d]]; }
  return [null, null];
}
function factorInsights() {
  const entries = Object.entries(state.sleepLog || {}).filter(([, e]) => sleepDuration(e)).slice(-30);
  const out = [];
  for (const [k, label] of SLEEP_FACTORS) {
    const withF = entries.filter(([, e]) => (e.factors || []).includes(k)).map(([, e]) => sleepDuration(e));
    const without = entries.filter(([, e]) => !(e.factors || []).includes(k)).map(([, e]) => sleepDuration(e));
    if (withF.length >= 2 && without.length >= 2) {
      const diff = withF.reduce((a, b) => a + b, 0) / withF.length - without.reduce((a, b) => a + b, 0) / without.length;
      if (Math.abs(diff) >= 0.3) out.push([label, diff]);
    }
  }
  return out.sort((a, b) => a[1] - b[1]);
}
// Calming sounds generated on the phone (no download, works offline).
const SleepAudio = {
  ctx: null, nodes: [], timers: [], current: '', endsAt: 0, volume: 0.6, master: null,
  noise(type) {
    const ctx = this.ctx; const len = ctx.sampleRate * 4; const buf = ctx.createBuffer(1, len, ctx.sampleRate); const d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
    for (let i = 0; i < len; i += 1) {
      const w = Math.random() * 2 - 1;
      if (type === 'white') d[i] = w * 0.35;
      else if (type === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
      else { b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898; d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.09; b6 = w * 0.115926; }
    }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; return src;
  },
  play(id, minutes) {
    this.stop(true);
    try { this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)(); } catch { return toast('Son indisponible sur cet appareil.'); }
    const ctx = this.ctx; ctx.resume?.();
    const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination); this.master = master;
    master.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 2);
    const add = (n) => { this.nodes.push(n); return n; };
    if (['white', 'pink', 'brown'].includes(id)) { const n = add(this.noise(id)); n.connect(master); n.start(); }
    if (id === 'rain') {
      const n = add(this.noise('pink')); const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 400; const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6000; n.connect(hp).connect(lp).connect(master); n.start();
      const drops = add(this.noise('white')); const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2500; bp.Q.value = 3; const g = ctx.createGain(); g.gain.value = 0; drops.connect(bp).connect(g).connect(master); drops.start();
      this.timers.push(setInterval(() => { const t = ctx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.25 * Math.random(), t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05 + Math.random() * 0.08); }, 70));
    }
    if (id === 'waves') {
      const n = add(this.noise('brown')); const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; const g = ctx.createGain(); g.gain.value = 0.5;
      const lfo = add(ctx.createOscillator()); lfo.frequency.value = 0.09; const depth = ctx.createGain(); depth.gain.value = 0.45; lfo.connect(depth).connect(g.gain);
      n.connect(lp).connect(g).connect(master); n.start(); lfo.start();
    }
    if (id === 'fire') {
      const n = add(this.noise('brown')); const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500; n.connect(lp).connect(master); n.start();
      const c = add(this.noise('white')); const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1800; const g = ctx.createGain(); g.gain.value = 0; c.connect(hp).connect(g).connect(master); c.start();
      this.timers.push(setInterval(() => { if (Math.random() < 0.35) { const t = ctx.currentTime; g.gain.setValueAtTime(0.5 * Math.random(), t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.03); } }, 90));
    }
    this.current = id;
    this.endsAt = minutes ? Date.now() + minutes * 60000 : 0;
    if (minutes) this.timers.push(setTimeout(() => this.stop(), minutes * 60000));
    track('SleepSound', { id, minutes: minutes || 0 });
  },
  setVolume(v) { this.volume = v; if (this.master && this.ctx) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1); },
  stop(immediate = false) {
    this.timers.forEach((t) => { clearInterval(t); clearTimeout(t); }); this.timers = [];
    const nodes = this.nodes; const master = this.master; this.nodes = []; this.master = null;
    const end = () => { nodes.forEach((n) => { try { n.stop?.(); n.disconnect(); } catch { /* already stopped */ } }); try { master?.disconnect(); } catch { /* ignore */ } };
    if (master && this.ctx && !immediate) { master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.8); setTimeout(end, 3000); } else end();
    this.current = ''; this.endsAt = 0;
    if (route === 'sleep' && sleepTab === 'sounds') render();
  },
};
let napTimer = null;
// Soft wake-up chime (Web Audio).
function chime() {
  try {
    const ctx = SleepAudio.ctx || (SleepAudio.ctx = new (window.AudioContext || window.webkitAudioContext)());
    [523.25, 659.25, 783.99].forEach((f, i) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.frequency.value = f; o.type = 'sine'; g.gain.setValueAtTime(0, ctx.currentTime + i * 0.35); g.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.35 + 0.05); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.35 + 1.4); o.connect(g).connect(ctx.destination); o.start(ctx.currentTime + i * 0.35); o.stop(ctx.currentTime + i * 0.35 + 1.5); });
  } catch { /* sound optional */ }
}
function sleepTabBody() {
  const today = todayKey();
  if (sleepTab === 'today') {
    const [d, e] = lastNight();
    const score = e ? sleepScore(e) : 0;
    const week = Array.from({ length: 7 }, (_, i) => state.sleepLog?.[addDays(-i)]).filter((x) => sleepDuration(x));
    const avg = week.length ? week.reduce((a, x) => a + sleepDuration(x), 0) / week.length : 0;
    const stress = state.stressLog?.[today];
    const stressDays = Array.from({ length: 14 }, (_, i) => addDays(-(13 - i)));
    const night = Math.min(7, Object.keys(state.sleepProgram?.done || {}).length + 1);
    const tip = !week.length ? 'Notez votre nuit chaque matin : en 3 jours, vous verrez vos premières tendances.'
      : avg < 6.5 ? 'Vos nuits sont courtes : avancez votre coucher de 15 minutes cette semaine.'
      : stress >= 4 ? 'Journée chargée : 3 minutes de respiration avant le dîner aident à décrocher.'
      : 'Belle régularité : gardez la même heure de lever, même le week-end.';
    return `<section class="sl-hero">
        <div class="sl-score" style="--p:${score}%"><b data-count="${score}">${score || '—'}</b><small>${L('score sommeil')}</small></div>
        <div class="sl-hero-txt"><small>${d ? L('Dernière nuit') : L('Aujourd’hui')}</small><b>${e ? `${fmt(sleepDuration(e), 1)} h` : L('Pas encore de nuit notée')}</b>
          <span>${avg ? L('Moyenne 7 nuits : {h}', { h: `${fmt(avg, 1)} h` }) : L('Notez votre première nuit')}</span>
          <button class="btn btn-lime" data-sleep-tab="sleep">${e && d === today ? L('Modifier ma nuit') : L('Noter ma nuit')}</button></div>
      </section>
      <section class="sl-card"><h3>${L('Votre niveau de stress aujourd’hui')}</h3>
        <div class="q-row stress">${[1, 2, 3, 4, 5].map((v) => `<button class="${stress === v ? 'on' : ''}" data-stress="${v}" aria-label="${v}">${['😌', '🙂', '😐', '😟', '😣'][v - 1]}</button>`).join('')}</div>
        <div class="stress-chart">${stressDays.map((x) => { const v = state.stressLog?.[x] || 0; return `<i class="${v >= 4 ? 'hi' : ''}" style="height:${v * 20}%" title="${x}"></i>`; }).join('')}</div>
        <small class="fine">${L('14 derniers jours')}</small></section>
      <div class="sl-quick">
        <button data-sleep-tab="sounds">${icon('moon')}<b>${L('Sons apaisants')}</b><small>${SleepAudio.current ? L('En cours') : L('Pluie, vagues, feu…')}</small></button>
        <button data-breath-now="478">${icon('heart')}<b>${L('Respirer 1 minute')}</b><small>${L('Respiration 4-7-8')}</small></button>
        <button data-sleep-tab="program">${icon('calendar')}<b>${L('Programme 7 nuits')}</b><small>${L('Nuit {n} sur 7', { n: night })}</small></button>
        <button data-sleep-tab="mind">${icon('book')}<b>${L('Vider ma tête')}</b><small>${L('Stress & pensées')}</small></button>
      </div>
      <div class="insight"><strong>${L('Conseil du jour')}</strong>${L(tip)}</div>`;
  }
  if (sleepTab === 'sleep') {
    const e = state.sleepLog?.[today] || {};
    const days = Array.from({ length: 14 }, (_, i) => addDays(-(13 - i)));
    const vals = days.map((x) => ({ d: x, h: sleepDuration(state.sleepLog?.[x]) }));
    const logged = vals.filter((v) => v.h);
    const avg = logged.length ? logged.reduce((a, v) => a + v.h, 0) / logged.length : 0;
    const ins = factorInsights();
    return `<section class="sl-card"><h3>${L('Ma nuit dernière')}</h3>
      <div class="pf-grid"><label class="pf-field"><span>${L('Couché(e) à')}</span><input id="sl-bed" type="time" value="${esc(e.bed || '23:00')}"></label><label class="pf-field"><span>${L('Levé(e) à')}</span><input id="sl-wake" type="time" value="${esc(e.wake || '07:00')}"></label></div>
      <h4>${L('Qualité ressentie')}</h4><div class="q-row">${[1, 2, 3, 4, 5].map((q) => `<button class="${Number(e.quality) === q ? 'on' : ''}" data-sl-q="${q}">${['😫', '😕', '😐', '🙂', '😴'][q - 1]}</button>`).join('')}</div>
      <h4>${L('Réveils dans la nuit')}</h4><div class="pf-chips">${[[0, 'Aucun'], [1, '1'], [2, '2'], [3, '3 ou plus']].map(([v, l]) => `<button class="pf-chip ${Number(e.wakeups) === v && e.wakeups !== undefined ? 'on' : ''}" data-sl-w="${v}"><b>${L(l)}</b></button>`).join('')}</div>
      <h4>${L('Hier, il y a eu…')}</h4><div class="pf-chips">${SLEEP_FACTORS.map(([k, l, ico]) => `<button class="pf-chip ${(e.factors || []).includes(k) ? 'on' : ''}" data-sl-factor="${k}">${icon(ico)}<b>${L(l)}</b></button>`).join('')}</div>
      <button class="btn btn-primary btn-wide" data-sl-save>${L('Enregistrer ma nuit')}</button></section>
      <div class="section-label"><h3>${L('14 dernières nuits')}</h3><span class="fine">${avg ? L('Moyenne {h}', { h: `${fmt(avg, 1)} h` }) : ''}</span></div>
      <div class="chart-card sl-chart">${vals.map((v) => `<div class="slc"><i style="height:${Math.min(100, v.h / 10 * 100)}%" class="${v.h && v.h < 6 ? 'short' : ''}"></i><span>${new Date(`${v.d}T12:00:00`).toLocaleDateString(locale(), { weekday: 'narrow' })}</span></div>`).join('')}</div>
      ${ins.length ? `<div class="insight"><strong>${L('Ce qui joue sur vos nuits')}</strong>${ins.map(([l, diff]) => esc(L('{f} : {d} h en moyenne', { f: L(l), d: `${diff > 0 ? '+' : '−'}${fmt(Math.abs(diff), 1)}` }))).join('<br>')}</div>` : `<p class="fine">${L('Cochez les facteurs de la veille : après quelques nuits, NutriPilot vous montre ce qui raccourcit ou allonge votre sommeil.')}</p>`}
      <div class="insight"><strong>${L('Repère')}</strong>${L('La plupart des adultes ont besoin de 7 à 9 heures. La régularité des horaires compte autant que la durée.')}</div>
      <p class="fine">${L('Si vous ronflez fort, vous réveillez en suffoquant ou restez épuisé(e) malgré des nuits complètes, parlez-en à un médecin.')}</p>`;
  }
  if (sleepTab === 'sounds') {
    const cur = SleepAudio.current;
    const left = SleepAudio.endsAt ? Math.max(0, Math.round((SleepAudio.endsAt - Date.now()) / 60000)) : 0;
    return `<p class="screen-sub">${L('Des sons générés sur votre téléphone, sans téléchargement, avec arrêt progressif.')}</p>
      <div class="snd-grid">${SOUNDS.map(([id, name, ico]) => `<button class="snd ${cur === id ? 'on' : ''}" data-sound="${id}" aria-pressed="${cur === id}">${icon(ico)}<b>${L(name)}</b>${cur === id ? '<span class="eq"><i></i><i></i><i></i></span>' : ''}</button>`).join('')}</div>
      <div class="snd-ctrl">
        <label>${icon('moon')}<input id="snd-vol" type="range" min="0" max="1" step="0.05" value="${SleepAudio.volume}" aria-label="${L('Volume')}"></label>
        <div class="chip-row">${[[15, '15 min'], [30, '30 min'], [60, '1 h'], [0, '∞']].map(([m, l]) => `<button class="mini-choice ${(state.soundMinutes ?? 30) === m ? 'selected' : ''}" data-sound-timer="${m}">${l}</button>`).join('')}</div>
        ${cur ? `<button class="btn btn-ghost btn-wide" data-sound-stop>${L('Arrêter le son')}${left ? ` · ${L('{n} min restantes', { n: left })}` : ''}</button>` : ''}
      </div>
      <section class="sl-card nap"><h3>${icon('sun')} ${L('Sieste flash')}</h3><p class="fine">${L('10 à 20 minutes avant 15 h : de l’énergie sans gêner la nuit. Un son doux et une vibration vous réveillent.')}</p>
        <div class="chip-row">${[10, 15, 20].map((m) => `<button class="mini-choice ${napTimer?.minutes === m ? 'selected' : ''}" data-nap="${m}">${m} min</button>`).join('')}${napTimer ? `<button class="mini-choice" data-nap="0">${L('Arrêter')}</button>` : ''}</div>
        ${napTimer ? `<p class="nap-left">${L('Réveil à {t}', { t: new Date(napTimer.end).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' }) })}</p>` : ''}</section>`;
  }
  if (sleepTab === 'relax') {
    const running = relaxRun;
    return `<div class="section-label"><h3>${L('Respirations guidées')}</h3><label class="voice-toggle"><input type="checkbox" id="relax-voice" ${state.relaxVoice === false ? '' : 'checked'}> ${L('Voix')}</label></div>
      <div id="breath-live" class="breath-live"><b>${L('Choisissez une respiration')}</b><small></small></div>
      <div class="br-list">${BREATHS.map(([id, name, sub]) => `<button class="br-card ${running?.id === id ? 'on' : ''}" data-breath="${id}"><b>${L(name)}</b><small>${L(sub)}</small></button>`).join('')}</div>
      <div class="section-label"><h3>${L('Relaxations guidées')}</h3></div>
      <div id="relax-live" class="relax-live"><b>${L('Une voix vous guide pas à pas, dans votre langue.')}</b></div>
      <div class="br-list">${RELAX.map(([id, name, min]) => `<button class="br-card" data-relax="${id}"><b>${L(name)}</b><small>${L('{n} min', { n: min })}</small></button>`).join('')}</div>
      <button class="btn btn-ghost btn-wide" data-relax-stop>${L('Arrêter')}</button>`;
  }
  if (sleepTab === 'program') {
    const done = state.sleepProgram?.done || {};
    const next = SLEEP_NIGHTS.findIndex((_, i) => !done[i + 1]);
    return `<section class="sl-prog-head"><b>${L('Programme 7 nuits')}</b><small>${L('Une habitude par soir, expliquée simplement. Basé sur les recommandations de thérapie comportementale du sommeil.')}</small>
        <div class="progress"><i style="width:${Object.keys(done).length / 7 * 100}%"></i></div><span class="fine">${L('{n} sur {t}', { n: Object.keys(done).length, t: 7 })}</span></section>
      <div class="night-list">${SLEEP_NIGHTS.map(([title, points, action], i) => { const n = i + 1; const isDone = done[n]; const open = i === next || (next === -1 && i === 6); const locked = next !== -1 && i > next; return `<details class="night ${isDone ? 'done' : ''} ${locked ? 'locked' : ''}" ${open ? 'open' : ''}>
        <summary><span class="night-n">${isDone ? icon('check') : n}</span><b>${L(title)}</b>${locked ? icon('lock') : ''}</summary>
        ${locked ? `<p class="fine">${L('Terminez la nuit précédente pour débloquer celle-ci.')}</p>` : `<ul>${points.map((x) => `<li>${L(x)}</li>`).join('')}</ul><div class="night-action">${icon('star')}<span><small>${L('Ce soir')}</small>${L(action)}</span></div>
        ${isDone ? `<span class="pc-current">✓ ${L('Fait')}</span>` : `<button class="btn btn-primary btn-wide" data-night-done="${n}">${L('C’est fait pour ce soir')}</button>`}`}
      </details>`; }).join('')}</div>`;
  }
  if (sleepTab === 'mind') {
    const worries = (state.worries || []).slice(0, 8);
    return `<section class="sl-card"><h3>${L('Vider ma tête')}</h3><p class="fine">${L('Écrivez ce qui vous préoccupe, puis une seule petite action pour demain. Votre cerveau peut lâcher prise : c’est noté.')}</p>
        <textarea class="textarea compact" id="worry-text" maxlength="400" placeholder="${L('Ce qui me préoccupe…')}"></textarea>
        <input class="text-input" id="worry-action" maxlength="160" placeholder="${L('Une petite action pour demain')}">
        <button class="btn btn-primary btn-wide" data-worry-save>${L('Ranger pour demain')}</button></section>
      ${worries.length ? `<div class="section-label"><h3>${L('Mes notes')}</h3></div><div class="worry-list">${worries.map((w, i) => `<div class="worry ${w.done ? 'done' : ''}"><small>${esc(new Date(w.at).toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'short' }))}</small><p>${esc(w.text)}</p>${w.action ? `<button class="worry-act" data-worry-done="${i}">${w.done ? icon('check') : icon('star')} ${esc(w.action)}</button>` : ''}</div>`).join('')}</div>` : ''}
      <div class="sl-quick two"><button data-relax-now="anxiety">${icon('heart')}<b>${L('Apaiser l’anxiété')}</b><small>${L('{n} min', { n: 4 })}</small></button><button data-relax-now="reset">${icon('leaf')}<b>${L('Pause anti-stress')}</b><small>${L('{n} min', { n: 2 })}</small></button></div>
      <p class="fine">${L('Si le stress ou l’anxiété durent et pèsent sur votre quotidien, un professionnel de santé peut vous aider. En cas de détresse, contactez les services d’urgence.')}</p>`;
  }
  if (sleepTab === 'learn') {
    return `<div class="lesson-list">${SLEEP_LESSONS.map(([title, text], i) => `<details class="si-card" ${i === 0 ? 'open' : ''}><summary><b>${L(title)}</b></summary><p>${L(text)}</p></details>`).join('')}</div>`;
  }
  return null;
}
function sleepScreen() {
  const tabs = [['today', 'Aujourd’hui'], ['sleep', 'Journal du sommeil'], ['sounds', 'Sons apaisants'], ['relax', 'Respirer & se détendre'], ['program', 'Programme 7 nuits'], ['mind', 'Stress & pensées'], ['hunger', 'Faim ou envie ?'], ['routine', 'Rituel du soir'], ['learn', 'Leçons'], ['restart', 'Reprendre la routine']];
  const today = todayKey();
  let body = sleepTabBody();
  if (body === null && sleepTab === 'hunger') {

    const log = (state.hungerLog || []).slice(0, 12);
    const week = (state.hungerLog || []).filter((x) => x.day >= addDays(-6) && x.kind === 'craving');
    const byEmotion = EMOTIONS.map(([k, label]) => [label, week.filter((x) => x.emotion === k).length]).filter(([, n]) => n).sort((a, b) => b[1] - a[1]);
    body = `<section class="sl-card"><h3>${L('Là, maintenant, c’est plutôt…')}</h3>
      <div class="hk-row"><button class="hk ${state.hungerDraft?.kind === 'physical' ? 'on' : ''}" data-hk="physical"><b>${L('De la faim')}</b><small>${L('Elle monte doucement, le ventre gargouille, n’importe quel aliment conviendrait.')}</small></button><button class="hk ${state.hungerDraft?.kind === 'craving' ? 'on' : ''}" data-hk="craving"><b>${L('Une envie')}</b><small>${L('Soudaine, pour un aliment précis, souvent liée à une émotion.')}</small></button></div>
      ${state.hungerDraft?.kind === 'craving' ? `<h4>${L('Qu’est-ce qui se passe ?')}</h4><div class="pf-chips">${EMOTIONS.map(([k, l]) => `<button class="pf-chip ${state.hungerDraft.emotion === k ? 'on' : ''}" data-hk-em="${k}"><b>${L(l)}</b></button>`).join('')}</div>` : ''}
      <h4>${L('Intensité')}</h4><div class="q-row">${[1, 2, 3, 4, 5].map((q) => `<button class="${Number(state.hungerDraft?.level) === q ? 'on' : ''}" data-hk-lv="${q}">${q}</button>`).join('')}</div>
      <div class="settings-two"><button class="btn btn-ghost" data-sos>${icon('sparkle')}<span>${L('SOS')}</span></button><button class="btn btn-primary" data-hk-save>${L('Noter')}</button></div></section>
      ${byEmotion.length ? `<div class="insight"><strong>${L('Vos envies cette semaine')}</strong>${byEmotion.map(([l, n]) => `${esc(L(l))} : ${n}`).join(' · ')}</div>` : ''}
      ${log.length ? `<div class="section-label"><h3>${L('Derniers moments notés')}</h3></div><div class="nutrition-detail">${log.map((x) => `<div><span>${esc(new Date(x.at).toLocaleString(locale(), { weekday: 'short', hour: '2-digit', minute: '2-digit' }))} · ${x.kind === 'physical' ? L('De la faim') : L('Une envie')}${x.emotion ? ` · ${esc(L((EMOTIONS.find((e) => e[0] === x.emotion) || [])[1] || ''))}` : ''}</span><b>${x.level || ''}/5</b></div>`).join('')}</div>` : ''}
      <p class="fine">${L('Aucune envie n’est un échec. Noter aide à comprendre ce qui se passe, sans se juger.')}</p>`;
  } else if (sleepTab === 'routine') {
    const done = state.routineDone?.[today] || {};
    const n = Object.values(done).filter(Boolean).length;
    body = `<p class="screen-sub">${L('Cochez ce que vous faites ce soir. De petites habitudes régulières aident à mieux dormir.')}</p>
      <div class="task-list rt-list">${ROUTINE.map(([k, label]) => `<button class="task ${done[k] ? 'done' : ''}" data-rt="${k}"><span>${done[k] ? icon('check') : ''}</span>${L(label)}</button>`).join('')}</div>
      <p class="fine center-fine">${L('{n} sur {t} ce soir', { n, t: ROUTINE.length })}</p>`;
  } else if (body === null) {
    body = `<section class="sl-card"><h3>${L('Reprendre, sans tout recommencer')}</h3>
      <ol class="restart-list"><li>${L('Pas de rattrapage : on ne compense pas les jours passés en mangeant moins.')}</li><li>${L('Choisissez une seule action pour aujourd’hui : noter un repas, boire de l’eau ou marcher 10 minutes.')}</li><li>${L('Préparez le prochain repas, pas toute la semaine.')}</li><li>${L('Revenez à vos horaires de sommeil habituels dès ce soir.')}</li><li>${L('Regardez la tendance sur plusieurs semaines, pas un seul jour.')}</li></ol>
      <div class="settings-two"><button class="btn btn-lime" data-open-add>${icon('scan')}<span>${L('Noter un repas')}</span></button><button class="btn btn-ghost" data-go="planner">${icon('sparkle')}<span>${L('Que manger ensuite ?')}</span></button></div></section>`;
  }
  return `<div class="mobile-app">
    ${appHeader('Sommeil & stress')}
    <div class="screen">
      <div class="tab-scroll mod-tabs">${tabs.map(([k, label]) => `<button class="${sleepTab === k ? 'active' : ''}" data-sleep-tab="${k}">${L(label)}</button>`).join('')}</div>
      ${SleepAudio.current && sleepTab !== 'sounds' ? `<button class="now-playing" data-sleep-tab="sounds"><span class="eq"><i></i><i></i><i></i></span>${L((SOUNDS.find((x) => x[0] === SleepAudio.current) || [])[1] || '')}<em>${L('Arrêter')}</em></button>` : ''}
      ${body}
    </div>
    ${bottom('sleep')}
  </div>`;
}

// ---- v13: Nutrition journal and adjustable targets ------------------------------------------
let diaryDay = '';
let diaryView = 'day';
function diaryScreen() {
  const day = diaryDay || todayKey();
  const p = state.profile;
  const t = totals(day);
  const meals = state.meals.filter((m) => m.day === day);
  const types = ['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collation'];
  const bar = (label, v, goal, unit) => `<div class="dj-bar"><span>${L(label)}</span><b>${fmt(v)} <small>/ ${fmt(goal)} ${unit}</small></b><i><em style="width:${clamp(v / Math.max(1, goal) * 100, 0, 100)}%"></em></i></div>`;
  const week = Array.from({ length: 7 }, (_, i) => addDays(-(6 - i))).map((d) => ({ d, ...totals(d), n: state.meals.filter((m) => m.day === d).length }));
  const wk = week.filter((x) => x.n);
  const avg = (k) => wk.length ? wk.reduce((s, x) => s + x[k], 0) / wk.length : 0;
  return `<div class="mobile-app">
    ${appHeader('Nutrition')}
    <div class="screen">
      ${programTabs('diary')}
      <div class="segmented"><button class="${diaryView === 'day' ? 'active' : ''}" data-diary-view="day">${L('Jour')}</button><button class="${diaryView === 'week' ? 'active' : ''}" data-diary-view="week">${L('Semaine')}</button></div>
      ${diaryView === 'day' ? `
      <div class="dj-nav"><button class="icon-btn" data-diary-shift="-1" aria-label="${L('Jour précédent')}"><span class="flip-rtl">←</span></button><b>${esc(day === todayKey() ? L('Aujourd’hui') : new Date(`${day}T12:00:00`).toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' }))}</b><button class="icon-btn" data-diary-shift="1" ${day >= todayKey() ? 'disabled' : ''} aria-label="${L('Jour suivant')}"><span class="flip-rtl">→</span></button></div>
      <section class="dj-card">${bar('Calories', t.kcal, p.dailyKcal, 'kcal')}${bar('Protéines', t.protein, p.protein, 'g')}${bar('Glucides', t.carbs, p.carbs, 'g')}${bar('Lipides', t.fat, p.fat, 'g')}${bar('Fibres', t.fiber, p.fiber, 'g')}${bar('Eau', Number(state.water?.[day] || 0), waterGoal(), 'ml')}</section>
      ${types.map((type) => { const list = meals.filter((m) => (m.type || '') === type); return `<div class="section-label"><h3>${L(type)}</h3><span class="fine">${fmt(list.reduce((s, m) => s + Number(m.total?.kcal || 0), 0))} kcal</span></div>${list.length ? mealsHtml(list) : `<button class="dj-add" data-open-add>${icon('plus')}<span>${L('Ajouter')}</span></button>`}`; }).join('')}
      ` : `
      <section class="dj-card"><div class="dj-week">${week.map((x) => `<div class="${x.d === todayKey() ? 'today' : ''}"><span>${new Date(`${x.d}T12:00:00`).toLocaleDateString(locale(), { weekday: 'short' })}</span><i style="height:${clamp(x.kcal / Math.max(1, p.dailyKcal) * 100, 2, 130)}%" class="${x.kcal > p.dailyKcal * 1.1 ? 'over' : ''}"></i><b>${x.n ? fmt(x.kcal) : '—'}</b></div>`).join('')}</div></section>
      <div class="stat-grid"><div class="stat"><small>${L('Calories moy.')}</small><b>${wk.length ? fmt(avg('kcal')) : '—'}</b><em>${L('objectif {n}', { n: fmt(p.dailyKcal) })}</em></div><div class="stat"><small>${L('Protéines moy.')}</small><b>${wk.length ? `${fmt(avg('protein'))} g` : '—'}</b><em>${L('objectif {n} g', { n: p.protein })}</em></div><div class="stat"><small>${L('Fibres moy.')}</small><b>${wk.length ? `${fmt(avg('fiber'))} g` : '—'}</b><em>${L('objectif {n} g', { n: p.fiber })}</em></div><div class="stat"><small>${L('Jours notés')}</small><b>${wk.length}/7</b><em>${L('cette semaine')}</em></div></div>
      <p class="fine">${L('La moyenne de la semaine compte plus qu’une journée isolée.')}</p>`}
    </div>
    ${bottom('diary')}
  </div>`;
}
function targetsScreen() {
  const p = state.profile;
  const auto = calculatePlan({ ...p, manualTargets: null });
  const field = (key, label, unit, v, a) => `<label class="tg-row"><span><b>${L(label)}</b><small>${L('Calcul automatique : {v} {u}', { v: fmt(a), u: unit })}</small></span><span class="tg-in"><input id="tg-${key}" type="number" inputmode="numeric" value="${Math.round(v)}"><em>${unit}</em></span></label>`;
  return `<div class="mobile-app">
    ${appHeader('Nutrition')}
    <div class="screen">
      ${programTabs('targets')}
      <p class="screen-sub">${L('Vos objectifs sont calculés selon votre profil. Vous pouvez les ajuster, par exemple sur les conseils d’un(e) diététicien(ne).')}</p>
      <section class="dj-card">
        ${field('kcal', 'Calories', 'kcal', p.dailyKcal, auto.dailyKcal)}
        ${field('protein', 'Protéines', 'g', p.protein, auto.protein)}
        ${field('carbs', 'Glucides', 'g', p.carbs, auto.carbs)}
        ${field('fat', 'Lipides', 'g', p.fat, auto.fat)}
        ${field('fiber', 'Fibres', 'g', p.fiber, auto.fiber)}
        ${field('water', 'Eau', 'ml', waterGoal(), 2000)}
      </section>
      ${p.manualTargets ? `<p class="fine">${L('Objectifs personnalisés actifs.')}</p>` : ''}
      <div class="settings-two"><button class="btn btn-ghost" data-tg-auto>${L('Revenir au calcul')}</button><button class="btn btn-primary" data-tg-save>${L('Enregistrer')}</button></div>
      <p class="fine">${L('NutriPilot ne descend pas sous 1 200 kcal par jour pour une femme et 1 500 kcal pour un homme.')}</p>
    </div>
    ${bottom('targets')}
  </div>`;
}
function applyManualTargets(profile) {
  const m = profile?.manualTargets;
  if (!m) return profile;
  return { ...profile, dailyKcal: m.kcal ?? profile.dailyKcal, protein: m.protein ?? profile.protein, carbs: m.carbs ?? profile.carbs, fat: m.fat ?? profile.fat, fiber: m.fiber ?? profile.fiber };
}

function settings() {
  return `<div class="mobile-app">
    <div class="app-head"><div class="app-head-row"><button class="icon-btn" data-nav-back aria-label="${L('Retour')}">${icon('back')}</button><h2>${L('Réglages')}</h2><span></span></div></div>
    <div class="screen">
      ${state.premium ? '' : `<button class="explore-banner" data-go="plans">${icon('lock')}<span><b>${esc(t('explore'))}</b>${esc(t('exploreSub'))}</span><em>${esc(t('unlock'))} →</em></button>${Billing.native() ? `<button class="btn btn-ghost btn-wide" data-restore>${icon('user')} ${L('Restaurer mes achats')}</button>` : `<button class="btn btn-ghost btn-wide" data-go="access">${icon('user')} ${L('Déjà client ? Se connecter')}</button>`}`}
      <button class="btn btn-ghost btn-wide" data-go="lang">${icon('globe')} ${L('Langue')} · ${esc(LANGS.find((x) => x[0] === lang())?.[1] || 'Français')}</button>
      ${memberCard()}
      <div class="success warn" ${state.premium ? '' : 'hidden'}><b>${L('NutriPilot Premium actif ✓')}</b><br>${esc(state.premiumEmail || L('Accès activé'))}</div>
      <div class="kpi settings-goal"><small>${L('Votre objectif quotidien')}</small><b>${fmt(state.profile.dailyKcal)} kcal</b><div class="fine">P ${state.profile.protein} g · G ${state.profile.carbs} g · L ${state.profile.fat} g · Fibres ${state.profile.fiber} g</div></div>
      <div class="settings-two"><button class="btn btn-primary" data-open-profile>${icon('user')}<span>${L('Mon profil')}</span></button><button class="btn btn-lime" data-open-goal>${icon('scale')}<span>${L('Mon objectif')}</span></button></div>
      <button class="btn btn-ghost btn-wide" data-start>${L('Refaire le questionnaire complet')}</button>
      <div class="section-label"><h3>${L('Abonnement')}</h3></div>
      ${state.premium ? `<a class="btn btn-ghost btn-wide" href="${esc(manageSubscriptionUrl())}" ${window.Capacitor?.isNativePlatform?.() ? '' : 'target="_blank" rel="noopener"'}>${L('Gérer mon abonnement')}</a>` : ''}
      ${Billing.native() ? `<button class="btn btn-ghost btn-wide" data-restore>${L('Restaurer mes achats')}</button>` : ''}
      <div class="fine center-fine">${L('Formule actuelle : {plan}', { plan: esc(planLabel()) })}</div>
      <button class="btn ${planTier() !== 'complete' ? 'btn-lime' : 'btn-ghost'} btn-wide" data-go="plans">${L('Voir les formules')}</button>
      <div class="section-label"><h3>${L('Données & appareil')}</h3></div>
      <label class="rem-row"><span>${icon('sparkle')}<b>${L('Suggestions d’après ma routine')}</b><small>${L('Repère les repas que vous remplacez souvent pour proposer des options plus pratiques')}</small></span><input type="checkbox" class="switch" data-cp-patterns-toggle ${state.cpPatternsOff ? '' : 'checked'}></label>
      <label class="rem-row ai-row"><span>${icon('star')}<b>${L('Analyse personnalisée')}</b><small>${L('Gérez le traitement de vos photos et messages.')}</small></span><input type="checkbox" class="switch" data-ai-toggle ${state.aiConsent === true ? 'checked' : ''}></label>
      <button class="btn btn-ghost btn-wide" data-export>${L('Exporter mes données (.json)')}</button>
      ${window.Capacitor?.isNativePlatform?.() ? '' : `<button class="btn btn-ghost btn-wide" data-install>${L('Ajouter NutriPilot à l’écran d’accueil')}</button>`}
      <button class="btn btn-ghost btn-wide" data-go="support">${L('Aide & support')}</button>
      <button class="btn btn-ghost btn-wide" data-go="tour">${L('Découvrir l’application')}</button>
      <button class="btn btn-ghost btn-wide" data-go="legal">${L('Confidentialité & informations')}</button>
      <button class="btn btn-ghost btn-wide" data-logout>${L('Se déconnecter')}</button>
      <button class="btn btn-danger-soft btn-wide" data-delete-data>${L('Supprimer mes données NutriPilot')}</button>
      ${state.accessToken || state.accountToken ? `<button class="btn btn-danger-soft btn-wide" data-delete-account>${L('Supprimer mon compte')}</button>` : ''}
      <div class="fine center-fine">${L('La suppression du compte ou des données ne résilie pas l’abonnement : annulez-le dans les réglages de votre compte App Store ou Google Play.')}</div>
      <div class="fine center-fine legal-links"><a href="/terms?lang=${lang()}" target="_blank" rel="noopener">${L('Conditions d’utilisation')}</a> · <a href="/privacy?lang=${lang()}" target="_blank" rel="noopener">${L('Politique de confidentialité')}</a></div>
    </div>
  </div>`;
}

function legal() {
  const legalInfo = config.legal || {};
  return `<div class="mobile-app"><div class="app-head"><div class="app-head-row"><button class="icon-btn" data-nav-back aria-label="${L('Retour')}">${icon('back')}</button><h2>${L('Informations')}</h2><span></span></div></div><div class="screen"><h1 class="screen-title">${L('Transparence')}</h1><div class="legal-docs"><a class="btn btn-ghost btn-wide" href="/privacy?lang=${lang()}" target="_blank" rel="noopener">${L('Politique de confidentialité')}</a><a class="btn btn-ghost btn-wide" href="/terms?lang=${lang()}" target="_blank" rel="noopener">${L('Conditions d’utilisation')}</a></div><div class="day-card"><h3>${L('Nature du service')}</h3><p class="screen-sub">${L('{brand} est un outil général de suivi nutritionnel et de bien-être. Les calories, grammes, portions et macros restent des estimations lorsqu’ils ne proviennent pas de données mesurées.', { brand: esc(config.brand) })}</p></div><div class="day-card"><h3>${L('Scanner photo')}</h3><p class="screen-sub">${L('Une photo ne pèse pas un aliment. NutriPilot affiche des estimations et vous permet de corriger les grammes avant enregistrement.')}</p></div><div class="day-card"><h3>${L('Vos données')}</h3><p class="screen-sub">${L('Vos repas, mesures et journaux servent uniquement à votre suivi. Les photos de progression restent sur votre appareil. Pour améliorer l’application, nous comptons de façon anonyme quelques étapes (par exemple « page des formules vue »), sans identifiant ni contenu personnel.')}</p></div><div class="day-card"><h3>${L('Limites des estimations')}</h3><p class="screen-sub">${L('Les analyses et les réponses du coach sont automatisées et peuvent contenir des erreurs. Elles ne constituent pas un diagnostic ni une prescription.')}</p></div><div class="day-card"><h3>${L('Abonnement')}</h3><p class="screen-sub">${L('La durée, le prix, le renouvellement et les conditions d’annulation sont présentés avant tout paiement.')}</p></div><div class="day-card"><h3>${L('Éditeur')}</h3><p class="screen-sub"><b>${esc(legalInfo.company || L('À compléter'))}</b><br>${esc(legalInfo.address || L('Adresse à compléter'))}<br>${esc(legalInfo.id || L('Identifiant à compléter'))}<br>${L('Support : {email}', { email: esc(config.supportEmail) })}</p></div></div></div>`;
}

// Login for existing customers only (no marketing "private area"): reached from "Already a customer?".
function access() {
  return `<div class="mobile-app access-shell no-nav">
    <div class="app-head"><div class="app-head-row"><button class="icon-btn" data-nav-back aria-label="${L('Retour')}">${icon('back')}</button><h2>${L('Se connecter')}</h2>${langChip()}</div></div>
    <div class="screen">
      <div class="access-card login-card">
        <p class="screen-sub">${L('Déjà client ? Recevez un code à 6 chiffres sur l’e-mail de votre achat.')}</p>
        <div class="field"><label for="access-email">${L('E-mail')}</label><input id="access-email" type="email" autocomplete="email" placeholder="${L('vous@exemple.fr')}" value="${esc(state.premiumEmail || '')}"></div>
        <button class="btn btn-primary btn-wide" data-request-code>${L('Recevoir mon code')}</button>
        <div id="code-area" style="display:none"><div class="field"><label for="access-code">${L('Code à 6 chiffres')}</label><input id="access-code" class="code-input" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="000000"></div><button class="btn btn-lime btn-wide" data-verify-code>${L('Se connecter')}</button></div>
        <div id="access-msg"></div>
        ${Billing.native() ? `<button class="link-btn center-fine" data-restore>${L('Restaurer mes achats')}</button>` : ''}
      </div>
      <p class="fine center-fine">${L('Besoin d’aide ?')} ${esc(config.supportEmail)}</p>
    </div>
  </div>`;
}

// Web visitors subscribe in the store app (trial and payment are handled by Apple / Google).
function storeSheet() {
  const plan = findPlan(modal.plan) || findPlan('complete');
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const android = /Android/i.test(navigator.userAgent);
  const btn = (url, label, sub, ico) => `<a class="store-btn ${url ? '' : 'off'}" ${url ? `href="${esc(url)}" target="_blank" rel="noopener"` : 'aria-disabled="true"'}>${ico}<span><small>${L(sub)}</small><b>${label}</b></span></a>`;
  const apple = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.4-.9-2.4-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z"/></svg>';
  const play = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 2.8v18.4c0 .4.4.6.7.4l10.2-9.2c.2-.2.2-.6 0-.8L4.7 2.4c-.3-.2-.7 0-.7.4zm12.4 7.6 2.7-2.4c.3-.3.2-.7-.1-.9L7.2 1.2l9.2 9.2zm0 3.2-9.2 9.2 11.8-5.9c.3-.2.4-.6.1-.9l-2.7-2.4z"/></svg>';
  return `<div class="sheet-head"><h2>${L('Abonnez-vous dans l’application')}</h2><button class="icon-btn" data-close aria-label="${L('Fermer')}">${icon('close')}</button></div>
    <p class="screen-sub">${L('Consultez les prix et les offres disponibles dans votre boutique avant de choisir votre formule.')}</p>
    <div class="store-plan"><span class="mod-ico ${plan.tone}">${icon(plan.icon)}</span><span><small>${L('Formule choisie')}</small><b>${esc(planName(plan))}</b></span></div>
    ${!config.appStoreUrl && !config.playStoreUrl ? `<p class="fine center-fine">${L('La publication dans les boutiques est en préparation.')}</p>` : ''}
    <div class="store-btns">${[...(config.appStoreUrl ? [btn(config.appStoreUrl, 'App Store', 'Télécharger sur', apple)] : []), ...(config.playStoreUrl ? [btn(config.playStoreUrl, 'Google Play', 'Disponible sur', play)] : [])].sort((x) => (android && x.includes('Google') ? -1 : ios && x.includes('App Store') ? -1 : 0)).join('')}</div>
    <p class="fine center-fine">${L('Votre abonnement suit votre identifiant Apple ou Google : sur un nouvel appareil, touchez « Restaurer mes achats ».')}</p>`;
}

function openAdd(tab = 'photo') {
  modal = { type: 'add', tab, result: null, loading: false, mealType: mealTypeFromHour() };
  renderModal();
}

function renderModal() {
  stopBarcodeCamera();
  document.querySelector('.modal-wrap')?.remove();
  if (!modal) return;
  // Recipes, exercises and lessons opened from anywhere stay locked outside the free minutes.
  if (!fullAccess() && ['recipe', 'exercise', 'guide', 'lesson'].includes(modal.type) && !modal.recipe?.custom) modal = { type: 'trial' };
  if (trialActive()) { if (modal.type === 'recipe') trialFound('recipe'); if (['session', 'exercise'].includes(modal.type)) trialFound('workout'); }
  const wrap = document.createElement('div');
  wrap.className = 'modal-wrap';
  wrap.innerHTML = `<div class="sheet"><div class="sheet-grip"></div>${modal.type === 'meal' ? mealSheet(modal.meal) : modal.type === 'signin' ? signInSheet() : ['trial', 'trial-started', 'trial-ended', 'trial-guide', 'trial-5min'].includes(modal.type) ? trialSheet(modal.type) : modal.type === 'recipe' ? recipeSheet(modal.recipe) : modal.type === 'appmore' ? appMoreSheet(modal.app) : modal.type === 'ex-picker' ? exPickerSheet() : modal.type === 'plan-swap' ? planSwapSheet() : modal.type === 'plan-pick' ? planPickSheet() : modal.type === 'plan-recipe' ? planRecipeSheet() : modal.type === 'guide' ? guideSheet(modal.guide) : modal.type === 'session' ? sessionSheet(modal.sessionId, modal.programId) : modal.type === 'exercise' ? exerciseSheet(modal.id) : modal.type === 'support' ? supportSheet() : modal.type === 'reminders' ? remindersSheet() : modal.type === 'sos' ? sosSheet() : modal.type === 'scan' ? scanSheet(modal.item) : modal.type === 'account' ? accountSheet() : modal.type === 'page' ? pageSheet() : modal.type === 'store' ? storeSheet() : modal.type === 'copilot' ? copilotSheet() : modal.type === 'cp-history' ? cpHistorySheet() : addSheet()}</div>`;
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-modal', 'true');
  document.body.appendChild(wrap);
  a11yPass(wrap);
  bindModal(wrap);
  if (modal.type === 'ex-picker') {
    $('#picker-search', wrap)?.addEventListener('input', (event) => {
      pickerState.query = event.target.value;
      $('#picker-grid', wrap).innerHTML = pickerGridHtml(libraryList(pickerState.group, pickerState.equip, pickerState.query), gridDraft().days[pickerState.day]);
    });
  }
  if (modal.type === 'support') {
    const log = $('#support-log', wrap);
    if (log) log.scrollTop = log.scrollHeight;
    const input = $('#support-input', wrap);
    input?.addEventListener('keydown', (event) => { if (event.key === 'Enter') sendSupport(input.value); });
    if (!supportLoading) input?.focus();
  }
}

function addSheet() {
  if (modal.loading) return `<div class="sheet-head"><h2>${L('Analyse en cours…')}</h2><button class="icon-btn" data-close aria-label="${L('Fermer')}">×</button></div><div class="loader" role="status" aria-live="polite"><div class="loader-dots"><i></i><i></i><i></i></div><p>${L('NutriPilot identifie les aliments, estime les portions et prépare les données modifiables.')}</p></div>`;
  if (modal.result) return resultSheet(modal.result);
  const tabs = [...(state.meals.length ? [['recent', 'Récents']] : []), ['photo','Photo'],['text','Texte / voix'],['barcode','Code-barres'],['label','Étiquette'],['manual','Manuel'],['favorites','Favoris']].map(([k, v]) => [k, L(v)]);
  return `<div class="sheet-head"><div><span class="tag">${L('AJOUTER UN REPAS')}</span><h2>${L('Choisissez la méthode.')}</h2></div><button class="icon-btn" data-close>×</button></div>${freeScanBanner()}${modal.error ? `<div class="analysis-error" role="alert"><strong>${esc(L(modal.error))}</strong><small>${L('Réessayez ou choisissez une autre méthode.')}</small></div>` : ''}<div class="meal-methods" role="group" aria-label="${L('Choisissez la méthode.')}">${tabs.map(([key, label]) => `<button type="button" class="tab ${modal.tab === key ? 'active' : ''}" aria-pressed="${modal.tab === key}" data-mtab="${key}">${label}</button>`).join('')}</div><div class="meal-method-content">${addTab(modal.tab)}</div>`;
}

const localFood = [
  ['Œuf',143,12.6,.7,9.5,0], ['Pain complet',247,13,41,4.2,7], ['Avocat',160,2,8.5,14.7,6.7], ['Poulet grillé',165,31,0,3.6,0], ['Riz cuit',130,2.7,28,.3,.4], ['Pâtes cuites',158,5.8,31,.9,1.8], ['Saumon',208,20,0,13,0], ['Thon au naturel',116,26,0,1,0], ['Skyr',63,11,4,.2,0], ['Yaourt grec',97,9,3.9,5,0], ['Banane',89,1.1,23,.3,2.6], ['Pomme',52,.3,14,.2,2.4], ['Lentilles cuites',116,9,20,.4,8], ['Quinoa cuit',120,4.4,21,1.9,2.8], ['Brocoli',35,2.4,7.2,.4,3.3], ['Patate douce cuite',90,2,21,.2,3.3],
];

let bcStream = null;
// iPhone (and some Android WebViews) have no built-in BarcodeDetector: load the bundled ZXing reader once.
let bcReader = null;
async function barcodeDetector() {
  const formats = ['ean_13', 'ean_8', 'upc_a', 'upc_e'];
  if ('BarcodeDetector' in window) { try { const ok = await window.BarcodeDetector.getSupportedFormats?.(); if (!ok || formats.some((f) => ok.includes(f))) return new window.BarcodeDetector({ formats }); } catch { /* fall back */ } }
  if (!bcReader) {
    bcReader = new Promise((resolve, reject) => {
      const sc = document.createElement('script');
      sc.src = '/vendor/barcode/barcode-detector.js';
      sc.onload = () => { const api = window.BarcodeDetectionAPI; api.prepareZXingModule?.({ overrides: { locateFile: (p) => `/vendor/barcode/${p}` } }); resolve(api); };
      sc.onerror = () => { bcReader = null; reject(new Error('reader')); };
      document.head.append(sc);
    });
  }
  const api = await bcReader;
  return new api.BarcodeDetector({ formats });
}
function stopBarcodeCamera() { try { bcStream?.getTracks().forEach((t) => t.stop()); } catch { /* ignore */ } bcStream = null; }
async function startBarcodeCamera(root) {
  const box = $('#bc-cam', root); const video = $('#bc-video', root);
  if (!box || !video) return;
  try {
    const detector = await barcodeDetector();
    bcStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = bcStream; box.hidden = false; await video.play();
    const scanLoop = async () => {
      if (!bcStream || !document.body.contains(video)) return stopBarcodeCamera();
      try {
        const codes = await detector.detect(video);
        if (codes[0]?.rawValue) { stopBarcodeCamera(); box.hidden = true; $('#barcode', root).value = codes[0].rawValue; haptic('medium'); return $('[data-barcode]', root)?.click(); }
      } catch { /* keep trying */ }
      setTimeout(scanLoop, 250);
    };
    scanLoop();
  } catch { stopBarcodeCamera(); toast('Caméra indisponible : saisissez le code à la main.'); }
}
function addTab(tab) {
  if (tab === 'recent') return recentTab();
  if (['photo','text','label'].includes(tab) && (!canScan() || config.ai === false)) return `<div class="ai-access-card">${icon('lock')}<h3>${L(state.premium ? 'Analyses momentanément en pause' : 'Analyses réservées aux abonnés')}</h3><p>${L('Code-barres et saisie manuelle toujours disponibles.')}</p><div class="access-actions"><button class="btn btn-primary" data-mtab="manual">${L('Manuel')}</button><button class="btn btn-ghost" data-mtab="barcode">${L('Code-barres')}</button>${!state.premium ? `<button class="btn btn-lime" data-module-buy="${esc(recommendedTier())}">${L('Voir les formules')}</button>` : ''}</div></div>`;
  if (state.premium && !hasModule('scanner') && ['photo', 'label'].includes(tab)) {
    return `<div class="mod-upsell m-scan">${icon('scan')}<b>${L('Disponible avec le module Scanner')}</b><p>${L('Photo du repas, code-barres, étiquette, allergènes et comparaison de produits.')}</p><button class="btn btn-lime" data-module-buy="scanner">${L('Voir les formules')}</button></div>`;
  }
  if (tab === 'photo' || tab === 'label') return `<label class="upload"><input id="meal-image" type="file" accept="image/*" capture="environment"><div class="camera-ico">${tab === 'label' ? '▤' : '📸'}</div><h3>${L(tab === 'label' ? 'Photographier l’étiquette' : 'Photographier mon repas')}</h3><p>${L(tab === 'label' ? 'Cadrez les valeurs nutritionnelles et la portion.' : 'Une photo donne une estimation. Vous pourrez corriger chaque quantité avant de l’enregistrer.')}</p><span class="btn btn-primary">${L('Choisir une photo')}</span></label>`;
  if (tab === 'text') return `<div class="field"><label>${L('Décrivez votre repas')}</label><textarea class="textarea" id="meal-text" placeholder="${L('Ex. 150 g de poulet, 120 g de riz, courgettes et 1 c. à café d’huile d’olive')}"></textarea></div><div class="inline-actions"><button class="voice-btn" data-voice ${window.SpeechRecognition || window.webkitSpeechRecognition ? '' : 'hidden'}>${L('🎙 Dicter')}</button><button class="btn btn-primary" data-analyze-text>${L('Analyser →')}</button></div>`;
  if (tab === 'barcode') return `<div class="day-card"><h3>${L('Produit emballé')}</h3><p class="screen-sub">${L('Entrez les 8 à 14 chiffres du code-barres. Les données disponibles proviennent d’Open Food Facts et restent à vérifier sur l’emballage.')}</p>${navigator.mediaDevices?.getUserMedia ? `<button class="btn btn-lime btn-wide" data-barcode-cam>${icon('camera')} ${L('Scanner avec la caméra')}</button><div id="bc-cam" class="bc-cam" hidden><video id="bc-video" playsinline muted></video><span>${L('Placez le code-barres dans le cadre')}</span></div>` : ''}<div class="field"><label>${L('Code-barres')}</label><input id="barcode" inputmode="numeric" placeholder="${L('Ex. 3017620422003')}"></div><button class="btn btn-primary btn-wide" data-barcode>${L('Rechercher →')}</button></div>`;
  if (tab === 'manual') return `<div class="field"><label>${L('Rechercher un aliment')}</label><input id="manual-search" placeholder="${L('Ex. poulet, riz, skyr…')}"></div><div id="manual-list" class="manual-list">${manualResults('')}</div>`;
  if (tab === 'favorites') return state.favorites.length ? `<div class="manual-list">${state.favorites.map((fav, i) => `<button class="manual-item" data-fav="${i}"><span><b>${esc(fav.title)}</b><small>${fmt(fav.total?.kcal)} kcal</small></span><b>→</b></button>`).join('')}</div>` : `<div class="empty">${L('Aucun favori. Enregistrez un repas analysé comme favori pour le retrouver ici.')}</div>`;
  return '';
}

function manualResults(query = '') {
  const q = query.trim().toLowerCase();
  return localFood.filter((x) => !q || `${x[0]} ${L(x[0])}`.toLowerCase().includes(q)).slice(0, 12).map((food) => `<button class="manual-item" data-manual='${esc(JSON.stringify([L(food[0]), ...food.slice(1)]))}'><span><b>${esc(L(food[0]))}</b><small>${food[1]} kcal / 100 g</small></span><b>＋</b></button>`).join('');
}

function foodEdit(food, index) {
  const grams = Number(food.grams || 100);
  return `<div class="food-edit" data-fi="${index}" data-baseg="${grams}" data-k="${Number(food.kcal || 0)}" data-p="${Number(food.protein || 0)}" data-c="${Number(food.carbs || 0)}" data-f="${Number(food.fat || 0)}" data-fi-val="${Number(food.fiber || 0)}" data-sugar="${food.sugar == null ? '' : Number(food.sugar)}" data-sat="${food.satFat == null ? '' : Number(food.satFat)}" data-salt="${food.salt == null ? '' : Number(food.salt)}"><div class="food-edit-top"><div><b>${esc(food.name)}</b><small>${Math.round((food.confidence || 0.7) * 100)}% confiance</small></div><label><input type="number" min="1" max="3000" step="1" value="${grams}" data-grams> g</label></div><div class="food-macros"><span class="chip" data-item-kcal>${fmt(food.kcal)} kcal</span><span class="chip" data-item-protein>P ${fmt(food.protein, 1)} g</span><span class="chip" data-item-carbs>G ${fmt(food.carbs, 1)} g</span><span class="chip" data-item-fat>L ${fmt(food.fat, 1)} g</span><span class="chip" data-item-fiber>Fibres ${fmt(food.fiber, 1)} g</span></div></div>`;
}

function resultSheet(result) {
  const range = result.range || { min: Math.round(result.total.kcal * 0.9), max: Math.round(result.total.kcal * 1.1) };
  return `<div class="sheet-head"><div><span class="confidence">${L('≈ {n} % de confiance', { n: Math.round((result.confidence || 0.7) * 100) })}</span><h2>${esc(result.title || L('Repas analysé'))}</h2></div><button class="icon-btn" data-close>×</button></div>
    <div class="result-total"><div><small>${L('Estimation centrale')}</small><strong id="result-kcal">${fmt(result.total.kcal)}</strong> kcal<div class="range">${L('Fourchette initiale ≈ {a}–{b} kcal', { a: fmt(range.min), b: fmt(range.max) })}</div></div><div class="result-macros"><span><b id="result-p">${fmt(result.total.protein, 1)}</b>${L('P')}</span><span><b id="result-c">${fmt(result.total.carbs, 1)}</b>${L('G')}</span><span><b id="result-f">${fmt(result.total.fat, 1)}</b>${L('L')}</span><span><b id="result-fi">${fmt(result.total.fiber, 1)}</b>${L('Fibres')}</span></div></div>
    <div class="extended-nutrition" id="extended-nutrition">${extendedNutritionHtml(result.total)}</div>
    <div class="field"><label>${L('Type de repas')}</label><select id="meal-type">${['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collation'].map((type) => `<option value="${type}" ${modal.mealType === type ? 'selected' : ''}>${L(type)}</option>`).join('')}</select></div>
    <div class="section-label"><h3>${L('Vérifiez les portions')}</h3><span class="fine">${L('modifiable avant enregistrement')}</span></div>
    <div id="food-edits">${(result.foods || []).map(foodEdit).join('')}</div>
    ${result.assumptions?.length ? `<div class="warn"><b>${L('Hypothèses de l’analyse')}</b><br>${result.assumptions.map((a) => esc(L(a))).join('<br>')}</div>` : ''}
    ${result.note ? `<div class="fine note-line">${esc(L(result.note))}</div>` : ''}
    ${result.product ? allergenChips(result.product) : ''}
    <div class="modal-actions"><button class="btn btn-ghost" data-save-favorite>${L('♡ Favori')}</button><button class="btn btn-lime" data-save-result>${L('Ajouter au journal →')}</button></div>`;
}

function extendedNutritionHtml(total) {
  const items = [];
  if (total.sugar != null) items.push(['Sucres', `${fmt(total.sugar, 1)} g`]);
  if (total.satFat != null) items.push(['Graisses saturées', `${fmt(total.satFat, 1)} g`]);
  if (total.salt != null) items.push(['Sel', `${fmt(total.salt, 2)} g`]);
  return items.length ? `<div class="nutrition-detail">${items.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>` : `<div class="fine">${L('Les valeurs avancées sont affichées lorsqu’elles sont suffisamment disponibles ou lisibles.')}</div>`;
}

function recalcResult(root) {
  const result = modal.result;
  const total = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: null, satFat: null, salt: null };
  $$('[data-fi]', root).forEach((el) => {
    const index = Number(el.dataset.fi);
    const baseGrams = Number(el.dataset.baseg || 100);
    const grams = clamp(Number($('[data-grams]', el)?.value || baseGrams), 1, 3000);
    const factor = grams / Math.max(1, baseGrams);
    const food = result.foods[index];
    food.grams = grams;
    for (const [key, dataKey] of [['kcal','k'],['protein','p'],['carbs','c'],['fat','f'],['fiber','fiVal']]) {
      const value = Number(el.dataset[dataKey] || 0) * factor;
      food[key] = key === 'kcal' ? Math.round(value) : +value.toFixed(1);
      total[key] += food[key];
    }
    for (const [key, dataKey] of [['sugar','sugar'],['satFat','sat'],['salt','salt']]) {
      if (el.dataset[dataKey] !== '') {
        const value = Number(el.dataset[dataKey] || 0) * factor;
        food[key] = key === 'salt' ? +value.toFixed(2) : +value.toFixed(1);
        total[key] = (total[key] ?? 0) + food[key];
      }
    }
    $('[data-item-kcal]', el).textContent = `${fmt(food.kcal)} kcal`;
    $('[data-item-protein]', el).textContent = `P ${fmt(food.protein, 1)} g`;
    $('[data-item-carbs]', el).textContent = `G ${fmt(food.carbs, 1)} g`;
    $('[data-item-fat]', el).textContent = `L ${fmt(food.fat, 1)} g`;
    $('[data-item-fiber]', el).textContent = `Fibres ${fmt(food.fiber, 1)} g`;
  });
  total.kcal = Math.round(total.kcal);
  for (const key of ['protein','carbs','fat','fiber','sugar','satFat']) if (total[key] != null) total[key] = +Number(total[key]).toFixed(1);
  if (total.salt != null) total.salt = +Number(total.salt).toFixed(2);
  result.total = total;
  $('#result-kcal', root).textContent = fmt(total.kcal);
  $('#result-p', root).textContent = fmt(total.protein, 1);
  $('#result-c', root).textContent = fmt(total.carbs, 1);
  $('#result-f', root).textContent = fmt(total.fat, 1);
  $('#result-fi', root).textContent = fmt(total.fiber, 1);
  $('#extended-nutrition', root).innerHTML = extendedNutritionHtml(total);
}

function mealSheet(meal) {
  const advanced = extendedNutritionHtml(meal.total || {});
  const totalWeight = (meal.foods || []).reduce((sum, food) => sum + Number(food.grams || 0), 0);
  return `<div class="sheet-head"><div><span class="tag">${esc(meal.type || 'REPAS')}</span><h2>${esc(meal.title)}</h2><div class="fine">${dateLabel(meal.day)}</div></div><button class="icon-btn" data-close>×</button></div><div class="result-total compact-total"><strong>${fmt(meal.total?.kcal)}</strong> kcal<div class="result-macros"><span><b>${fmt(meal.total?.protein, 1)}</b>${L('P')}</span><span><b>${fmt(meal.total?.carbs, 1)}</b>${L('G')}</span><span><b>${fmt(meal.total?.fat, 1)}</b>${L('L')}</span><span><b>${fmt(meal.total?.fiber, 1)}</b>${L('Fibres')}</span></div>${totalWeight ? `<div class="fine result-weight">≈ ${fmt(totalWeight)} g enregistrés au total</div>` : ''}</div><div class="extended-nutrition">${advanced}</div><div class="meal-detail-list">${(meal.foods || []).map((food) => `<div><span>${esc(food.name)}${food.grams ? ` · ${fmt(food.grams)} g` : ''}</span><b>${fmt(food.kcal)} kcal</b></div>`).join('')}</div><button class="btn btn-danger-soft btn-wide" data-delete-meal="${esc(meal.id)}">${L('Supprimer du journal')}</button>`;
}


function planRecipeSheet() {
  if (modal.loading) return `<div class="loader"><div class="loader-dots"><i></i><i></i><i></i></div><h3>${L('Création de la recette…')}</h3></div>`;
  if (modal.error) return `<div class="sheet-head"><h2>${L('Recette')}</h2><button class="icon-btn" data-close>×</button></div><div class="warn">${esc(modal.error)}</div>`;
  const recipe = modal.recipe;
  if (!recipe) return `<div class="loader">${L('Préparation…')}</div>`;
  return `<div class="sheet-head"><div><span class="tag">${L('RECETTE ADAPTÉE')}</span><h2>${esc(recipe.name)}</h2></div><button class="icon-btn" data-close>×</button></div><div class="recipe-hero-stats"><div><b>${fmt(recipe.kcal)}</b><span>kcal</span></div><div><b>${fmt(recipe.protein)}</b><span>${L('prot.')}</span></div><div><b>${fmt(recipe.fiber)}</b><span>${L('fibres')}</span></div><div><b>${esc(L(recipe.prep))}</b><span>${L('temps')}</span></div></div><div class="section-label"><h3>${L('Ingrédients')}</h3></div><div class="ingredient-table">${(recipe.ingredients || []).map((item) => `<div><span>${esc(item.name)}</span><b>${item.grams ? `${fmt(item.grams)} g` : ''}</b></div>`).join('')}</div><div class="section-label"><h3>${L('Préparation')}</h3></div><ol class="steps-list">${(recipe.steps || []).map((step) => `<li>${esc(step)}</li>`).join('')}</ol>${recipe.tips?.length ? `<div class="insight"><strong>${L('Astuce')}</strong>${recipe.tips.map(esc).join(' · ')}</div>` : ''}`;
}

async function analyze(body) {
  const target = modal;
  if (!target || target.loading) return;
  target.loading = true;
  target.error = '';
  renderModal();
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 60_000);
  try {
    if (!state.premium && !canScan()) { target.loading = false; if (modal === target) freeScansOut(); return; }
    const response = await apiFetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(state.premium ? {} : { 'X-NP-Device': deviceId() }) }, body: JSON.stringify(body), signal: ctl.signal });
    const data = await response.json();
    if (Number.isFinite(Number(data.freeLeft))) { state.freeScansUsed = Math.max(0, freeScanLimit() - Number(data.freeLeft)); saveState(false); }
    if (response.status === 402 || data.code === 'free_limit') { target.loading = false; if (modal === target) freeScansOut(); return; }
    if (!response.ok) throw new Error(data.error || 'L’analyse est temporairement indisponible.');
    target.result = data;
    pushScan(data, body.mode || (body.image ? 'photo' : 'text'));
    track('MealAnalyzed', { source: data.source || 'unknown' });
  } catch (error) {
    target.error = error.name === 'AbortError' ? 'L’analyse est temporairement indisponible.' : error.message;
    if (modal === target) toast(L(target.error));
  } finally {
    clearTimeout(timer);
    target.loading = false;
    if (modal === target) renderModal();
  }
}

function fileToData(file, max = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      try {
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext('2d');
        if (!context || !canvas.width || !canvas.height) throw new Error('Impossible de lire cette image.');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL('image/jpeg', quality);
        if (!data.startsWith('data:image/jpeg;base64,')) throw new Error('Impossible de lire cette image.');
        resolve(data);
      } catch (error) {
        reject(new Error('Impossible de lire cette image.'));
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Impossible de lire cette image.')); };
    image.src = url;
  });
}

function voiceInput(button, root) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) return toast('Dictée vocale indisponible sur ce navigateur.');
  const recognition = new Recognition();
  recognition.lang = locale();
  recognition.interimResults = false;
  button.classList.add('active');
  button.textContent = '● Écoute…';
  recognition.onresult = (event) => { $('#meal-text', root).value = event.results[0][0].transcript || ''; };
  recognition.onerror = () => toast('Impossible d’utiliser le micro.');
  recognition.onend = () => { button.classList.remove('active'); button.textContent = '🎙 Dicter'; };
  recognition.start();
}


async function doCompose(button) {
  const box = $('#compose-results');
  box.innerHTML = loadingHtml('Création des options…');
  try {
    const t = totals();
    const p = state.profile;
    const todayMeals = state.meals.filter((meal) => meal.day === todayKey()).map((meal) => ({ type: meal.type, title: meal.title, kcal: meal.total?.kcal || 0 }));
    const response = await apiFetch('/api/compose', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remaining: Number(button.dataset.remaining), proteinLeft: Number(button.dataset.proteinLeft), carbsLeft: Math.max(0, p.carbs - t.carbs), fatLeft: Math.max(0, p.fat - t.fat), fiberLeft: Math.max(0, p.fiber - t.fiber), hour: new Date().getHours(), todayMeals, craving: $('#craving')?.value || '', preference: $('#preference')?.value || p.diet, avoid: p.allergies, cooking: p.cooking }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    box.innerHTML = suggestionHtml(data.options || []);
    track('MealComposerUsed');
  } catch (error) {
    box.innerHTML = `<div class="warn">${esc(L(error.message || ''))}</div>`;
  }
}

async function doFridge(button) {
  const box = $('#fridge-results');
  box.innerHTML = loadingHtml('Ouverture du frigo…');
  try {
    const response = await apiFetch('/api/fridge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ingredients: $('#fridge-input')?.value || '', remaining: Number(button.dataset.remaining), diet: state.profile.diet, allergies: state.profile.allergies }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    box.innerHTML = suggestionHtml(data.options || []);
    track('FridgeModeUsed');
  } catch (error) { box.innerHTML = `<div class="warn">${esc(L(error.message || ''))}</div>`; }
}

async function doRestaurant(button) {
  const box = $('#restaurant-results');
  box.innerHTML = loadingHtml('Préparation de vos options…');
  try {
    const response = await apiFetch('/api/restaurant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ context: $('#restaurant-input')?.value || '', remaining: Number(button.dataset.remaining), diet: state.profile.diet, allergies: state.profile.allergies }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    box.innerHTML = `<div class="suggestion-list"><div class="insight"><strong>${esc(data.headline || 'Au restaurant')}</strong>${L('Choisissez une stratégie qui vous paraît naturelle.')}</div>${(data.options || []).map((x) => `<article class="suggestion"><h3>${esc(x.choice)}</h3><p>${esc(x.why)}</p><div class="fine">${esc(x.tip)}</div></article>`).join('')}</div>`;
    track('RestaurantModeUsed');
  } catch (error) { box.innerHTML = `<div class="warn">${esc(L(error.message || ''))}</div>`; }
}

async function doSmartSwap(button) {
  const meal = $('#swap-meal')?.value.trim();
  if (!meal) return toast('Indiquez le repas que vous voulez garder.');
  const box = $('#swap-results');
  box.innerHTML = loadingHtml('Adaptation…');
  try {
    const response = await apiFetch('/api/smart-swap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ meal, remaining: Number(button.dataset.remaining || 500) }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    const options = data.options || [];
    if (pendingPlanSwap) pendingPlanSwap.options = options;
    box.innerHTML = `<div class="suggestion-list">${options.map((x, index) => `<article class="suggestion"><div class="suggestion-top"><h3>${esc(x.name)}</h3><span class="pill">${fmt(x.kcal)} kcal</span></div><p>${esc(x.tip || '')}</p>${x.ingredients?.length ? `<div class="ingredients">${x.ingredients.map((i) => `<span class="chip">${esc(typeof i === 'string' ? i : i.name)}${typeof i === 'object' && i.grams ? ` · ${fmt(i.grams)} g` : ''}</span>`).join('')}</div>` : ''}<div class="nutrition-line"><div><b>${fmt(x.kcal)}</b>kcal</div><div><b>${fmt(x.protein)}</b>${L('prot.')}</div><div><b>${fmt(x.carbs)}</b>${L('gluc.')}</div><div><b>${fmt(x.fiber)}</b>${L('fibres')}</div></div>${pendingPlanSwap ? `<button class="btn btn-lime btn-wide" data-replace-option="${index}">${L('Remplacer dans mon plan →')}</button>` : `<button class="btn btn-ghost btn-wide" data-add-suggestion='${esc(JSON.stringify(x))}'>${L('Ajouter au journal')}</button>`}</article>`).join('')}</div>`;
  } catch (error) { box.innerHTML = `<div class="warn">${esc(L(error.message || ''))}</div>`; }
}

async function generateWeeklyReview(button) {
  button.disabled = true;
  const original = button.textContent;
  button.textContent = 'Analyse de la semaine…';
  try {
    const p = state.profile;
    const response = await apiFetch('/api/weekly-review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ goal: p.goal, dailyKcal: p.dailyKcal, protein: p.protein, days: weeklyData(), checkins: Object.entries(state.checkins).slice(-7), weightTrend: state.weights.slice(-12) }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    state.weekReview = data;
    saveState();
    track('WeeklyReviewGenerated');
    render();
  } catch (error) {
    toast(error.message);
    button.disabled = false;
    button.textContent = original;
  }
}

let coachBusy = false;
function coachScroll() { setTimeout(() => { const chat = $('#chat'); if (chat) chat.scrollTop = chat.scrollHeight; }, 0); }
async function sendCoach(prefill = '', { retryOf = null } = {}) {
  const input = $('#coach-input');
  const message = (prefill || input?.value || '').trim();
  if (!message || coachBusy) return;
  coachBusy = true;
  const requestId = ++coachRequestId;
  if (!prefill) coachDraft = '';
  if (retryOf != null) state.coach = state.coach.filter((m, i) => i !== retryOf);
  else state.coach.push({ role: 'user', text: message });
  if (state.coach.length > 40) state.coach = state.coach.slice(-40);
  state.coach.push({ role: 'ai', text: '', pending: true });
  saveState(false);
  render();
  coachScroll();
  const finish = (entry) => { if (requestId !== coachRequestId) return; coachBusy = false; state.coach = state.coach.filter((m) => !m.pending); state.coach.push({ role: 'ai', ...entry }); saveState(); render(); coachScroll(); };
  const t = totals();
  const p = state.profile;
  // Only real coach answers go back as history (not offline notes), so the conversation stays coherent.
  const history = state.coach.filter((m) => !m.pending && !m.kind).slice(-11, -1).map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', text: m.text }));
  const personal = state.coachUsesData === false ? {} : { context: coachContext(), goal: p.goal, dailyKcal: p.dailyKcal, remaining: Math.max(0, p.dailyKcal - t.kcal), proteinLeft: Math.max(0, p.protein - t.protein), diet: p.diet, allergies: p.allergies, week: weeklyData().map((d) => ({ day: d.day, kcal: d.kcal, protein: d.protein })), weightTrend: (state.weights || []).slice(-12) };
  const body = JSON.stringify({ message, mode: coachMode || 'nutrition', history, ...personal });
  let status = 0;
  let data = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 65_000);
    try {
      const response = await apiFetch('/api/coach', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, signal: ctl.signal });
      status = response.status;
      data = await response.json().catch(() => ({}));
      clearTimeout(timer);
      if (response.ok && data.answer) break;
      if (response.ok || status === 401 || status === 402 || status === 429 || status === 400) break;
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof AiConsentError) { if (requestId !== coachRequestId) return; coachBusy = false; state.coach = state.coach.filter((m) => !m.pending); saveState(false); render(); return toast(error.message); }
      status = 0;
    }
    if (attempt === 0) await new Promise((r) => setTimeout(r, 1200));
  }
  if (requestId !== coachRequestId) return;
  if (data?.answer) { finish({ text: data.answer }); return track('CoachAnswer', { source: coachMode }); }
  track('CoachAnswer', { source: coachMode, local: true, status });
  if (status === 401 || status === 402) return finish({ kind: 'auth', text: L('Votre session a expiré. Reconnectez-vous pour continuer avec le coach : vos données restent sur votre téléphone.') });
  if (status === 429) return finish({ kind: 'local', q: message, text: L('Beaucoup de questions en peu de temps : réessayez dans quelques minutes.') });
  const why = status === 0 || !navigator.onLine ? L('Pas de connexion internet pour le moment.') : L('Le coach est momentanément indisponible.');
  finish({ kind: 'local', q: message, text: `${why} ${L('En attendant, voici une réponse à partir de vos données :')}\n${localCoachAnswer(message, coachMode)}` });
}

function loadingHtml(label) {
  return `<div class="loader"><div class="loader-dots"><i></i><i></i><i></i></div>${esc(label)}</div>`;
}

async function requestCode() {
  const email = $('#access-email')?.value.trim().toLowerCase();
  const message = $('#access-msg');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast('Saisissez un e-mail valide.');
  message.innerHTML = `<div class="fine loading-line">${L('Vérification de votre achat…')}</div>`;
  try {
    const response = await fetch('/api/access/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, lang: lang() }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    state.premiumEmail = email;
    saveState(false);
    $('#code-area').style.display = 'block';
    message.innerHTML = `<div class="warn success"><b>${L('Code envoyé.')}</b><br>${data.mailed ? 'Consultez votre boîte e-mail et vos spams.' : ''}${data.devCode ? ` Code de développement : <b>${esc(data.devCode)}</b>` : ''}</div>`;
  } catch (error) {
    message.innerHTML = `<div class="warn">${esc(L(error.message || ''))}</div>`;
  }
}

async function verifyCode() {
  const email = $('#access-email')?.value.trim().toLowerCase();
  const code = $('#access-code')?.value.trim();
  if (!/^\d{6}$/.test(code || '')) return toast('Saisissez le code à 6 chiffres.');
  try {
    const response = await fetch('/api/access/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    if (!data.premium) {
      state.accountEmail = email; state.accountToken = data.token || ''; saveState(false);
      return toast(L('Aucun abonnement actif trouvé.'));
    }
    state.premium = true;
    state.premiumEmail = email;
    state.accessToken = data.token || '';
    state.subscriptionPlan = data.plan || '';
    saveState();
    track('PremiumActivated');
    toast('Accès Premium activé ✓');
    nav(state.onboarding ? 'app' : 'onboarding');
  } catch (error) {
    toast(error.message);
  }
}

async function openPlanRecipe(dayIndex, mealIndex) {
  const meal = state.weekPlan?.[dayIndex]?.meals?.[mealIndex];
  if (!meal) return;
  const view = meal.recipeId ? localRecipeView(meal) : null;
  if (view) { modal = { type: 'recipe', recipe: view }; return renderModal(); }
  modal = { type: 'plan-recipe', loading: true, recipe: null, error: '' };
  renderModal();
  try {
    const response = await apiFetch('/api/recipe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: meal.name, kcal: meal.kcal, diet: state.profile.diet, allergies: state.profile.allergies, cooking: state.profile.cooking }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    modal.loading = false;
    modal.recipe = data;
    renderModal();
  } catch (error) {
    modal.loading = false;
    modal.error = L(error.message || '');
    renderModal();
  }
}


function toggleRecipeFavorite(id) {
  const set = new Set(state.recipeFavorites || []);
  if (set.has(id)) set.delete(id); else set.add(id);
  state.recipeFavorites = [...set];
  saveState();
}

// Explorers who have not done a quiz still get coherent figures to browse the app.
function ensureProfileDefaults() {
  if (state.onboarding || state.profile?.dailyKcal && !state.profile.estimated) return;
  const base = { goal: 'maintain', sex: 'other', activity: 1.375, mealsPerDay: 3, diet: 'balanced', allergies: 'Aucun', cooking: '15-30 min', cuisine: 'france', budget: 'standard', age: 35, weight: 70, height: 168 };
  const merged = { ...base, ...Object.fromEntries(Object.entries(state.profile || {}).filter(([, v]) => v !== '' && v != null)) };
  if (!merged.target) merged.target = merged.weight;
  state.profile = { ...calculatePlan(merged), estimated: true };
}

function render() {
  document.querySelector('.modal-wrap')?.remove();
  if (route !== 'sleep' && relaxRun) stopRelax();
  stopBarcodeCamera();
  guardRoute();
  ensureProfileDefaults();

  let html;
  try {
  if (route === 'lang') html = langScreen();
  else if (route === 'hello') html = helloScreen();
  else if (route === 'basics') html = basicsScreen();
  else if (route === 'saving') html = savingScreen();
  else if (route === 'tour') html = tourScreen();
  else if (route === 'support') html = supportScreen();
  else if (route === 'app' && !fullAccess()) html = missionScreen();
  else if (route === 'onboarding') html = onboarding();
  else if (route === 'analyzing') html = analyzing();
  else if (route === 'paywall' || route === 'upgrade') html = paywall();
  else if (state.premium && moduleForRoute() && !hasModule(moduleForRoute().id)) html = moduleLockedScreen(moduleForRoute().id);
  else if (route === 'modules') html = modulesScreen();
  else if (route === 'training') html = trainingScreen();
  else if (route === 'menopause') html = menopauseScreen();
  else if (route === 'scanner') html = scannerScreen();
  else if (route === 'nutrients') html = nutrientsScreen();
  else if (route === 'supplements') html = supplementsScreen();
  else if (route === 'sleep') html = sleepScreen();
  else if (route === 'diary') html = diaryScreen();
  else if (route === 'targets') html = targetsScreen();
  else if (route === 'shopping') html = shoppingScreen();
  else if (route === 'guides') html = guidesScreen();
  else if (route === 'plan') html = planScreen();
  else if (route === 'app') html = dashboard();
  else if (route === 'program') html = program();
  else if (route === 'planner') html = planner();
  else if (route === 'recipes') html = recipesScreen();
  else if (route === 'coach') html = coachScreen();
  else if (route === 'insights') html = insights();
  else if (route === 'progress') html = progressScreen();
  else if (route === 'plans') html = plansScreen();
  else if (route === 'goal') html = goalScreen();
  else if (route === 'profile') html = profileScreen();
  else if (route === 'settings') html = settings();
  else if (route === 'legal') html = legal();
  else html = access();
  } catch (err) {
    (window.__npErrors ||= []).push(String(err?.stack || err));
    console.warn('[NutriPilot] render', err);
    html = `<main class="screen app-screen"><section class="error-state"><div class="error-ico">${icon('sparkle')}</div><h1>${L('Cet écran n’a pas pu s’afficher')}</h1><p>${L('Vos données sont intactes. Revenez à l’accueil ou réessayez.')}</p><div class="error-actions"><button class="btn" data-retry-render>${L('Réessayer')}</button><button class="btn btn-ghost" data-go="app">${L('Accueil')}</button></div></section></main>`;
  }
  const modHere = moduleForRoute();
  const shellId = appShellId();
  if (shellId && html.includes('</header>')) {
    const title = (html.match(/<h2>([\s\S]*?)<\/h2>/) || [])[1] || '';
    html = html.replace(/<header class="app-head">[\s\S]*?<\/header>(<button class="explore-banner"[\s\S]*?<\/button>)?/, () => appHead(shellId, title))
      .replace(/<nav class="bottom-nav">[\s\S]*?<\/nav>/, () => appTabBar(shellId))
      .replace('<div class="mobile-app', '<div class="in-app mobile-app');
  } else if (modHere && html.includes('</header>')) html = html.replace(/<\/header>(<button class="explore-banner"[\s\S]*?<\/button>)?/, `</header>${moduleBar(modHere.id)}`);
  // Visitors without free minutes left see each app behind a blur, with the trial box on top.
  const locked = !fullAccess() && modHere && !['plans', 'paywall', 'upgrade'].includes(route) && modHere.id !== 'scanner';
  if (locked) html = html.replace('<div class="screen', '<div inert aria-hidden="true" class="locked-blur screen').replace('<div class="in-app mobile-app', '<div class="in-app locked-app mobile-app') + lockOverlay(modHere);
  const noFab = state.premium || locked || ['hello', 'goal', 'profile', 'lang', 'basics', 'saving', 'analyzing', 'onboarding', 'support', 'plan', 'paywall', 'upgrade'].includes(route);
  app.innerHTML = html + (noFab ? '' : supportBubble());
  // Paywall: the floating "Start" bar appears only once the main button has scrolled out of view.
  const pwTop = $('.pw-cta-top'); const pwBar = $('.pw-bar');
  if (pwTop && pwBar && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => pwBar.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0)).observe(pwTop);
  else pwBar?.classList.add('show');
  a11yPass(app);
  const entered = window.__npLastRoute !== route;
  if (entered) {
    if (route === 'plans') track('PlansView', { from: window.__npLastRoute || 'direct' });
    if (window.__npLastRoute) app.firstElementChild?.classList.add('route-in');
    window.__npLastRoute = route;
  }
  document.documentElement.lang = lang();
  document.documentElement.dir = lang() === 'ar' ? 'rtl' : 'ltr';
  bind();
  auraAfterRender();
  if (route === 'analyzing' && !analyzingTimer) startAnalyzing();
  if (entered || (route === 'app' && !window.__npCounted)) { runCountUps(); window.__npCounted = true; }
  if (document.querySelector('[data-tilt]')) bindTilt();
  if (route === 'progress') renderPhotos();
  if (route === 'saving' && !savingTimer) startSaving();
  if (route === 'menopause' && trialActive()) trialFound('meno');
  trialClock();
}

// Gives every icon-only button an accessible name.
function a11yPass(root) {
  root.querySelectorAll('button:not([aria-label])').forEach((b) => {
    if (b.textContent.replace(/[×→←+−\s]/g, '').trim()) return;
    const d = b.dataset;
    const name = d.close !== undefined ? 'Fermer' : d.drawer !== undefined ? 'Menu' : d.go === 'coach' ? 'Coach' : d.water ? `${d.water} ml` : d.openAdd !== undefined ? 'Ajouter un repas' : d.reminders !== undefined ? 'Rappels' : b.title || '';
    if (name) b.setAttribute('aria-label', /ml$/.test(name) ? name : L(name));
  });
}

function bind() {
  app.querySelectorAll('details[data-pf-sec]').forEach((el) => el.addEventListener('toggle', () => { if (el.open) pfOpen.add(el.dataset.pfSec); else pfOpen.delete(el.dataset.pfSec); }));
  app.onchange = (event) => {
    const el = event.target;
    if (el.matches('[data-currency]')) { state.currency = rates()[el.value] ? el.value : ''; saveState(); track('SelectCurrency', { source: state.currency || 'auto' }); return render(); }
    if (el.matches('[data-country]')) { state.country = CC_CUR[el.value] ? el.value : ''; state.currency = ''; saveState(); return render(); }
    if (el.matches('[data-plan-focus]')) {
      const tp = trainPlan();
      state.trainPlan = { days: tp.days, focus: { ...tp.focus, [el.dataset.planFocus]: el.value }, edited: { ...tp.edited, [el.dataset.planFocus]: true } };
      saveState(); const y = scrollY; render(); scrollTo(0, y); return;
    }
    if (el.matches('[data-shop]')) {
      state.shoppingChecked[el.dataset.shop] = el.checked;
      saveState();
    }
    if (route === 'goal' && ['goal-weight', 'goal-target', 'goal-range', 'goal-height'].includes(el.id)) {
      const key = el.id === 'goal-range' ? 'target' : el.id.slice(5);
      const v = Number(String(el.value).replace(',', '.'));
      if (v) goalDraft[key] = key === 'height' ? Math.round(clamp(v, 130, 220)) : round1(clamp(v, 35, 250));
      if (key === 'weight' && v && !Number(goalDraft.target)) goalDraft.target = goalDraft.weight;
      const y = scrollY; render(); scrollTo(0, y);
    }
  };
  app.oninput = (event) => {
    if (event.target.id === 'snd-vol') { SleepAudio.setVolume(Number(event.target.value)); return; }
    const el = event.target;
    if (el.id === 'coach-input') coachDraft = el.value;
    if (el.id === 'goal-range' && goalDraft) {
      goalDraft.target = Number(el.value);
      const t = $('#goal-target'); if (t) t.value = goalDraft.target;
      const diff = round1(goalDraft.target - goalDraft.weight);
      const out = $('#goal-diff'); if (out) out.textContent = `${diff > 0 ? '+' : diff < 0 ? '−' : ''}${fmt(Math.abs(diff), 1)} kg`;
    }
    if (el.id === 'lib-search') { libQuery = el.value; const grid = $('#lib-grid'); if (grid) grid.innerHTML = libraryList(libGroup, libEquip, libQuery).map((id) => exCardHtml(id)).join('') || `<div class="empty">${L('Aucun exercice pour ce filtre.')}</div>`; }
    if (el.id === 'global-search') { const box = $('#gs-results'); if (box) box.innerHTML = globalSearch(el.value); }
    if (el.id === 'recipe-search') { recipeQuery = el.value; const grid = $('#recipe-grid'); if (grid) grid.innerHTML = recipeGridHtml(); const count = $('#recipe-count'); if (count) count.textContent = L('{n} recettes', { n: recipeList().length }); }
    if (el.id === 'grid-name') gridDraft().name = el.value;
    if (el.dataset.gridSessionName !== undefined) gridDraft().days[Number(el.dataset.gridSessionName)].name = el.value;
    if (el.dataset.gridReps !== undefined) { const [d, e] = el.dataset.gridReps.split(':').map(Number); gridDraft().days[d].ex[e][2] = el.value; }
    if (el.id === 'grid-name' || el.dataset.gridSessionName !== undefined || el.dataset.gridReps !== undefined) saveState(false);
  };
  app.onclick = async (event) => {
    const fold = event.target.closest('[data-tq-fold]');
    if (fold) { tqOpen = !fold.parentElement.open; return; }
    const button = event.target.closest('button, [role="button"]');
    if (!button) return;

    const freeScanTap = button.dataset.openAdd !== undefined || ['photo', 'text', 'label', 'recent', 'barcode'].includes(button.dataset.addTab);
    if (!fullAccess() && !freeScanTap && PREMIUM_ACTIONS.some((key) => button.dataset[key] !== undefined)) {
      track('PaywallFromFeature', { feature: PREMIUM_ACTIONS.find((key) => button.dataset[key] !== undefined) });
      selectedTier = moduleForRoute()?.id || (button.dataset.openAdd !== undefined || button.dataset.addTab ? 'scanner' : 'complete');
      modal = { type: 'trial' }; return renderModal();
    }
    if (button.dataset.drawer !== undefined) return openDrawer();
    if (myDayClick(button)) return;
    if (button.dataset.navBack !== undefined) {
      let prev = navStack.pop();
      while (prev && (prev === route || ['lang', 'basics', 'saving', 'analyzing'].includes(prev))) prev = navStack.pop();
      return nav(prev || (state.premium || state.basicsDone ? 'app' : 'lang'), { back: true });
    }
    if (button.dataset.reminders !== undefined) { modal = { type: 'reminders' }; return renderModal(); }
    if (button.dataset.supportOpen !== undefined) {
      modal = { type: 'support' };
      return renderModal();
    }
    if (button.dataset.lang) {
      // Applies immediately: the whole screen switches language on the tap.
      const code = button.dataset.lang;
      pendingLang = code;
      document.querySelectorAll('[data-lang]').forEach((x) => { x.classList.toggle('selected', x === button); x.setAttribute('aria-pressed', String(x === button)); });
      document.querySelectorAll('[data-lang-ok]').forEach((x) => x.setAttribute('data-lang-ok', code));
      const ok = await loadDict(code);
      if (pendingLang !== code) return; // another language was tapped meanwhile
      if (!ok) { pendingLang = ''; return toast('Connexion nécessaire pour télécharger cette langue.'); }
      state.lang = code;
      saveState();
      track('SelectLanguage', { lang: code });
      return render();
    }
    if (button.dataset.langOk) {
      // The last tapped language wins, even if its file is still downloading.
      const code = pendingLang || button.dataset.langOk;
      button.disabled = true;
      if (state.lang !== code) {
        if (!(await loadDict(code))) { button.disabled = false; return toast('Connexion nécessaire pour télécharger cette langue.'); }
        state.lang = code;
        saveState();
        track('SelectLanguage', { lang: code });
      }
      pendingLang = '';
      const next = langNext && !['lang', 'basics', 'saving'].includes(langNext) ? langNext : '';
      langNext = '';
      if (state.premium) return nav(next || (state.onboarding ? 'app' : 'onboarding'));
      if (next === 'access') return nav('access');
      return nav(state.basicsDone ? (next || 'app') : state.helloSeen ? 'basics' : 'hello');
    }
    if (button.dataset.focus) {
      state.focus = button.dataset.focus;
      state.profile.track = FOCI[state.focus].track;
      selectedTier = '';
      saveState(false);
      track('SelectFocus', { focus: state.focus });
      return render();
    }
    if (button.dataset.helloStart !== undefined) {
      state.helloSeen = true;
      if (FOCI[state.focus]) state.profile.track = FOCI[state.focus].track;
      saveState(false);
      track('StartFunnel', { focus: state.focus || 'all' });
      return nav('basics');
    }
    if (button.dataset.basicsOk !== undefined) {
      const name = $('#b-name').value.trim().slice(0, 40);
      const age = Number($('#b-age').value);
      const later = $('#b-later').checked;
      const weight = Number(String($('#b-weight').value).replace(',', '.'));
      const height = Number($('#b-height').value);
      if (!name) return toast(t('needName'));
      if (!(age >= 18 && age <= 90)) return toast(t('needAge'));
      state.profile = { ...state.profile, name, age };
      state.basicsFilled = { name: true, age: true };
      if (!later && weight >= 35 && weight <= 250) { state.profile.weight = weight; state.basicsFilled.weight = true; }
      if (!later && height >= 130 && height <= 220) { state.profile.height = height; state.basicsFilled.height = true; }
      saveState(false);
      track('BasicsDone');
      return nav('saving');
    }

    if (button.dataset.retryRender !== undefined) return render();
    if (button.dataset.coachMode) { coachMode = button.dataset.coachMode; return render(); }
    if (button.dataset.coachRetry !== undefined) { const i = +button.dataset.coachRetry; const m = state.coach[i]; if (m?.q) return sendCoach(m.q, { retryOf: i }); return; }
    if (button.dataset.coachClear !== undefined) { if (!confirmSoft(button)) return; coachRequestId += 1; coachBusy = false; coachDraft = ''; state.coach = []; saveState(); return render(); }
    if (button.dataset.coachFb) {
      track('CoachFeedback', { source: button.dataset.coachFb });
      if (button.dataset.coachFb === 'up') { button.parentElement.innerHTML = `<small>${L('Merci !')}</small>`; return; }
      return sendCoach(L('Cette réponse ne me convient pas. Propose une alternative plus adaptée à ma situation.'));
    }
    if (button.dataset.goNutrient) { nutrientTab = 'guide'; nutrientOpen = button.dataset.goNutrient; return nav('nutrients'); }
    if (button.dataset.appTab) { const [id, key] = button.dataset.appTab.split(':'); return openAppTab(id, key); }
    if (button.dataset.todayTab) { todayTab = button.dataset.todayTab; return render(); }
    if (button.dataset.trialStart !== undefined) return beginTrial();
    if (button.dataset.appMore) { modal = { type: 'appmore', app: button.dataset.appMore }; return renderModal(); }
    if (button.dataset.recipeView) { recipeView = button.dataset.recipeView; return render(); }
    // Scanner module
    if (button.dataset.scanOpen) { const item = (state.scanHistory || []).find((x) => x.id === button.dataset.scanOpen); if (item) { modal = { type: 'scan', item }; renderModal(); } return; }
    if (button.dataset.scanCompare) { const id = button.dataset.scanCompare; scanCompare = scanCompare.includes(id) ? scanCompare.filter((x) => x !== id) : [...scanCompare, id].slice(-2); return render(); }
    if (button.dataset.scanClear !== undefined) { if (!confirmSoft(button)) return; state.scanHistory = []; scanCompare = []; saveState(false); return render(); }
    // Vitamins & nutrients
    if (button.dataset.nutrientTab) { nutrientTab = button.dataset.nutrientTab; return render(); }
    if (button.dataset.nutrient) { nutrientOpen = nutrientOpen === button.dataset.nutrient ? '' : button.dataset.nutrient; const y = scrollY; render(); scrollTo(0, y); return; }
    if (button.dataset.nutrientSrc) { nutrientOpen = button.dataset.nutrientSrc; return render(); }
    // Supplements
    if (button.dataset.suppTab) { suppTab = button.dataset.suppTab; suppDraft = null; return render(); }
    if (button.dataset.spNew !== undefined) { if (!fullAccess()) return nav('plans'); suppDraft = { name: '', brand: '', perDay: 1, ingredients: [], warnings: [] }; return render(); }
    if (button.dataset.spEdit !== undefined) { suppDraft = { ...clone(state.supplements[Number(button.dataset.spEdit)]), index: Number(button.dataset.spEdit) }; return render(); }
    if (button.dataset.spPause !== undefined) { const x = state.supplements[Number(button.dataset.spPause)]; if (x) { x.paused = !x.paused; saveState(); } return render(); }
    if (button.dataset.spCancel !== undefined) { suppDraft = null; return render(); }
    if (button.dataset.spPreset) { if (!fullAccess()) return nav('plans'); suppDraft = presetDraft(button.dataset.spPreset); return render(); }
    if (button.dataset.spTake !== undefined) {
      const i = Number(button.dataset.spTake); const d = todayKey();
      state.suppTaken = state.suppTaken || {};
      // keep only the last 60 days
      for (const k of Object.keys(state.suppTaken)) if (k < addDays(-60)) delete state.suppTaken[k];
      const day = state.suppTaken[d] = state.suppTaken[d] || {};
      const key = suppKey(i);
      if (day[key]) delete day[key]; else day[key] = true;
      saveState(); const y = scrollY; render(); scrollTo(0, y); return;
    }
    if (button.dataset.spLog !== undefined) {
      const x = state.supplements[Number(button.dataset.spLog)];
      if (!x?.macros) return;
      state.meals.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, day: todayKey(), type: 'Collation', title: x.name, foods: [{ name: x.name, grams: 0, kcal: Number(x.macros.kcal || 0) }], total: { kcal: Number(x.macros.kcal || 0), protein: Number(x.macros.protein || 0), carbs: Number(x.macros.carbs || 0), fat: Number(x.macros.fat || 0), fiber: 0 }, icon: '🥤', source: 'supplement' });
      state.suppTaken = state.suppTaken || {}; (state.suppTaken[todayKey()] = state.suppTaken[todayKey()] || {})[suppKey(Number(button.dataset.spLog))] = true;
      saveState(); toast(L('Ajouté au journal : +{p} g de protéines ✓', { p: fmt(x.macros.protein, 1) })); const y = scrollY; render(); scrollTo(0, y); return;
    }
    if (button.dataset.spIngDel !== undefined) { readSuppForm(); suppDraft.ingredients.splice(Number(button.dataset.spIngDel), 1); return render(); }
    if (button.dataset.spIngAdd !== undefined) {
      readSuppForm();
      const name = $('#sp-ing-name')?.value.trim();
      if (!name) return toast('Indiquez le nom de l’ingrédient.');
      const amount = $('#sp-ing-amount')?.value;
      suppDraft.ingredients.push({ name: name.slice(0, 80), amount: amount === '' ? null : Number(amount), unit: $('#sp-ing-unit')?.value || 'mg', key: $('#sp-ing-key')?.value || 'other' });
      return render();
    }
    if (button.dataset.spSave !== undefined) {
      readSuppForm();
      if (!suppDraft.name) return toast('Indiquez le nom du produit.');
      const { index, ...item } = suppDraft;
      item.id = item.id || `s${Date.now().toString(36)}`;
      state.supplements = state.supplements || [];
      if (index !== undefined) state.supplements[index] = item; else state.supplements.unshift(item);
      saveState(); suppDraft = null; suppTab = 'mine';
      const alerts = suppAlerts();
      toast(alerts.length ? L('{n} alerte(s) à consulter', { n: alerts.length }) : 'Complément enregistré ✓');
      track('SupplementSaved', { preset: item.preset || 'custom' });
      return render();
    }
    if (button.dataset.suppRead !== undefined) {
      if (!fullAccess()) return nav('plans');
      const text = $('#supp-text')?.value.trim() || '';
      if (!text && !suppImage) return toast('Ajoutez une photo ou le texte de l’étiquette.');
      button.disabled = true; button.textContent = L('Lecture en cours…');
      try {
        const response = await apiFetch('/api/supplement', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, image: suppImage || '' }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        suppImage = '';
        suppDraft = { name: data.name, brand: data.brand, perDay: 1, ingredients: data.ingredients || [], warnings: data.warnings || [] };
        return render();
      } catch (error) { toast(error.message || 'Réessayez dans un instant.'); button.disabled = false; button.textContent = L('Lire l’étiquette'); }
      return;
    }
    // Sleep & stress
    if (button.dataset.sleepTab) { sleepTab = button.dataset.sleepTab; return render(); }
    if (button.dataset.stress) { state.stressLog = state.stressLog || {}; state.stressLog[todayKey()] = Number(button.dataset.stress); saveState(); const y = scrollY; render(); scrollTo(0, y); return; }
    if (button.dataset.slFactor) {
      const d = todayKey(); state.sleepLog = state.sleepLog || {};
      const e = state.sleepLog[d] = { ...(state.sleepLog[d] || {}), bed: $('#sl-bed')?.value || state.sleepLog[d]?.bed, wake: $('#sl-wake')?.value || state.sleepLog[d]?.wake };
      const f = new Set(e.factors || []); f.has(button.dataset.slFactor) ? f.delete(button.dataset.slFactor) : f.add(button.dataset.slFactor); e.factors = [...f];
      saveState(false); const y = scrollY; render(); scrollTo(0, y); return;
    }
    if (button.dataset.sound) {
      if (SleepAudio.current === button.dataset.sound) { SleepAudio.stop(); return; }
      SleepAudio.play(button.dataset.sound, state.soundMinutes ?? 30); return render();
    }
    if (button.dataset.soundTimer !== undefined) {
      state.soundMinutes = Number(button.dataset.soundTimer); saveState(false);
      if (SleepAudio.current) SleepAudio.play(SleepAudio.current, state.soundMinutes);
      return render();
    }
    if (button.dataset.soundStop !== undefined) { SleepAudio.stop(); return render(); }
    if (button.dataset.nap !== undefined) {
      const m = Number(button.dataset.nap);
      if (napTimer) { clearTimeout(napTimer.id); napTimer = null; }
      if (m) {
        const end = Date.now() + m * 60000;
        napTimer = { minutes: m, end, id: setTimeout(() => { napTimer = null; haptic('warning'); chime(); toast('Fin de la sieste ✓'); if (route === 'sleep') render(); }, m * 60000) };
        track('NapTimer', { minutes: m });
      }
      return render();
    }
    if (button.dataset.nightDone) {
      state.sleepProgram = state.sleepProgram || { start: todayKey(), done: {} };
      state.sleepProgram.done[button.dataset.nightDone] = todayKey();
      saveState(); toast(Object.keys(state.sleepProgram.done).length >= 7 ? 'Programme terminé, bravo ! 🌙' : 'Bravo, à demain soir ✓'); celebrate();
      return render();
    }
    if (button.dataset.worrySave !== undefined) {
      const text = $('#worry-text')?.value.trim(); const action = $('#worry-action')?.value.trim();
      if (!text) return toast('Écrivez d’abord ce qui vous préoccupe.');
      state.worries = [{ at: new Date().toISOString(), text: text.slice(0, 400), action: (action || '').slice(0, 160), done: false }, ...(state.worries || [])].slice(0, 30);
      saveState(); toast('C’est rangé pour demain ✓'); return render();
    }
    if (button.dataset.worryDone !== undefined) { const w = state.worries?.[Number(button.dataset.worryDone)]; if (w) { w.done = !w.done; saveState(); } return render(); }
    if (button.dataset.breathNow) { sleepTab = 'relax'; render(); runBreath(button.dataset.breathNow); return; }
    if (button.dataset.relaxNow) { sleepTab = 'relax'; render(); runRelax(button.dataset.relaxNow); return; }
    if (button.dataset.slQ) { const d = todayKey(); state.sleepLog = state.sleepLog || {}; state.sleepLog[d] = { ...(state.sleepLog[d] || {}), bed: $('#sl-bed')?.value, wake: $('#sl-wake')?.value, quality: Number(button.dataset.slQ) }; saveState(false); return render(); }
    if (button.dataset.slW !== undefined) { const d = todayKey(); state.sleepLog = state.sleepLog || {}; state.sleepLog[d] = { ...(state.sleepLog[d] || {}), bed: $('#sl-bed')?.value, wake: $('#sl-wake')?.value, wakeups: Number(button.dataset.slW) }; saveState(false); return render(); }
    if (button.dataset.slSave !== undefined) {
      const d = todayKey(); state.sleepLog = state.sleepLog || {};
      state.sleepLog[d] = { ...(state.sleepLog[d] || {}), bed: $('#sl-bed')?.value || '23:00', wake: $('#sl-wake')?.value || '07:00' };
      saveState(); toast(L('Nuit enregistrée : {h}', { h: `${fmt(sleepDuration(state.sleepLog[d]), 1)} h` })); return render();
    }
    if (button.dataset.breath) { runBreath(button.dataset.breath); return; }
    if (button.dataset.relax) { runRelax(button.dataset.relax); return; }
    if (button.dataset.relaxStop !== undefined) { stopRelax(); return render(); }
    if (button.dataset.hk) { state.hungerDraft = { ...(state.hungerDraft || {}), kind: button.dataset.hk }; if (button.dataset.hk === 'physical') delete state.hungerDraft.emotion; return render(); }
    if (button.dataset.hkEm) { state.hungerDraft = { ...(state.hungerDraft || {}), emotion: button.dataset.hkEm }; return render(); }
    if (button.dataset.hkLv) { state.hungerDraft = { ...(state.hungerDraft || {}), level: Number(button.dataset.hkLv) }; return render(); }
    if (button.dataset.hkSave !== undefined) {
      const h = state.hungerDraft || {};
      if (!h.kind) return toast('Choisissez faim ou envie.');
      state.hungerLog = [{ at: new Date().toISOString(), day: todayKey(), kind: h.kind, emotion: h.emotion || '', level: h.level || 0 }, ...(state.hungerLog || [])].slice(0, 200);
      state.hungerDraft = null; saveState();
      toast(h.kind === 'physical' ? 'Noté. Une collation qui cale peut aider ✓' : 'Noté. Une minute de respiration peut aider ✓');
      return render();
    }
    if (button.dataset.rt) { const d = todayKey(); state.routineDone = state.routineDone || {}; state.routineDone[d] = { ...(state.routineDone[d] || {}), [button.dataset.rt]: !state.routineDone[d]?.[button.dataset.rt] }; saveState(false); return render(); }
    // Nutrition journal & targets
    if (button.dataset.diaryView) { diaryView = button.dataset.diaryView; return render(); }
    if (button.dataset.diaryShift) { const base = new Date(`${diaryDay || todayKey()}T12:00:00`); base.setDate(base.getDate() + Number(button.dataset.diaryShift)); const k = todayKey(base); diaryDay = k > todayKey() ? todayKey() : k; return render(); }
    if (button.dataset.tgSave !== undefined) {
      const v = (k) => Number($(`#tg-${k}`)?.value || 0);
      const floor = state.profile.sex === 'male' ? 1500 : 1200;
      const kcal = Math.round(clamp(v('kcal'), floor, 5000));
      if (v('kcal') < floor) toast(L('Minimum {n} kcal pour rester en sécurité.', { n: floor }));
      state.profile.manualTargets = { kcal, protein: Math.round(clamp(v('protein'), 30, 300)), carbs: Math.round(clamp(v('carbs'), 30, 700)), fat: Math.round(clamp(v('fat'), 20, 250)), fiber: Math.round(clamp(v('fiber'), 10, 80)) };
      state.profile = applyManualTargets(state.profile);
      state.waterGoal = Math.round(clamp(v('water'), 1000, 5000));
      saveState(); toast('Objectifs enregistrés ✓'); return render();
    }
    if (button.dataset.tgAuto !== undefined) { state.profile = calculatePlan({ ...state.profile, manualTargets: null }); delete state.profile.manualTargets; saveState(); toast('Calcul automatique rétabli ✓'); return render(); }

    if (button.dataset.moduleBuy) return viewModulePlans(button.dataset.moduleBuy);
    if (button.dataset.openGoal !== undefined) return openGoal(route === 'goal' ? 'progress' : route);
    if (button.dataset.openProfile !== undefined) return openProfile();
    if (button.dataset.goalBack !== undefined) { goalDraft = null; return nav(goalReturn && goalReturn !== 'goal' ? goalReturn : 'progress'); }
    if (button.dataset.goalStep) {
      const [key, delta] = button.dataset.goalStep.split(':');
      const base = Number(goalDraft[key]) || Number(goalDraft.weight) || 70;
      goalDraft[key] = round1(clamp(base + Number(delta), 35, 250));
      if (key === 'weight' && !Number(goalDraft.target)) goalDraft.target = goalDraft.weight;
      return render();
    }
    if (button.dataset.goalQuick !== undefined) { goalDraft.target = round1(clamp(Number(goalDraft.weight) + Number(button.dataset.goalQuick), 35, 250)); return render(); }
    if (button.dataset.goalSpeed) { goalDraft.speed = Number(button.dataset.goalSpeed); return render(); }
    if (button.dataset.goalSave !== undefined) return saveGoal();
    if (button.dataset.pf) {
      readProfileInputs();
      const raw = button.dataset.pfValue;
      profileDraft[button.dataset.pf] = button.dataset.pfNum !== undefined ? Number(raw) : raw;
      const y = scrollY; render(); scrollTo(0, y);
      return;
    }
    if (button.dataset.pfSave !== undefined) return saveProfile();
    if (button.dataset.go) {
      pendingPlanSwap = null;
      return nav(button.dataset.go);
    }
    if (button.dataset.start !== undefined) {
      onboardingState = { step: 0, data: state.profile?.estimated ? {} : { ...state.profile } };
      if (!state.premium) state.onboarding = false;
      track('StartQuiz');
      return nav('onboarding');
    }
    if (button.dataset.obValue !== undefined) {
      const step = onboardingSteps[onboardingState.step];
      let value = button.dataset.obValue;
      if (['activity', 'speed', 'mealsPerDay', 'trainDays', 'sessionLength'].includes(step.key)) value = Number(value);
      onboardingState.data[step.key] = value;
      return render();
    }
    if (button.dataset.obBack !== undefined) {
      onboardingState.step = Math.max(0, moveStep(-1));
      return render();
    }
    if (button.dataset.obNext !== undefined) {
      const step = onboardingSteps[onboardingState.step];
      const field = $('#ob-field');
      if (step.type === 'info') {
        onboardingState.step = moveStep(1);
        return render();
      }
      if (field && step.optional && !field.value.trim()) {
        onboardingState.data[step.key] = 'Aucun';
      } else if (field) {
        let value = field.value.trim();
        if (step.type === 'number') value = field.value.trim() === '' ? NaN : Number(value.replace(',', '.'));
        if (value === '' || Number.isNaN(value)) return toast('Complétez cette étape.');
        if ((step.min != null && value < step.min) || (step.max != null && value > step.max)) return toast(L('Valeur attendue entre {min} et {max}.', { min: step.min, max: step.max }));
        onboardingState.data[step.key] = value;
      }
      if (onboardingState.data[step.key] === undefined || onboardingState.data[step.key] === '') return toast('Choisissez une option.');
      if (step.key === 'target') {
        const current = Number(onboardingState.data.weight);
        const target = Number(onboardingState.data.target);
        if (onboardingState.data.goal === 'lose' && target >= current) return toast('Pour perdre du poids, choisissez un objectif inférieur au poids actuel.');
        if (onboardingState.data.goal === 'gain' && target <= current) return toast('Pour prendre du poids, choisissez un objectif supérieur au poids actuel.');
      }
      const next = moveStep(1);
      if (next < onboardingSteps.length) {
        onboardingState.step = next;
        track('QuizStep', { step: step.key });
        return render();
      }
      if (onboardingState.data.goal === 'maintain') onboardingState.data.target = onboardingState.data.weight;
      state.workoutProgram = '';
      track('CompleteQuiz', { track: onboardingState.data.track || '' });
      return nav('analyzing');
    }
    if (button.dataset.planLater !== undefined) {
      // Keep the plan she just built, then let her look around before choosing.
      state.profile = { ...calculatePlan(), estimated: false, goalSet: true };
      state.basicsFilled = { ...(state.basicsFilled || {}), name: true, age: true, weight: true, height: true, target: true };
      saveState(false);
      track('PlanLater');
      return nav('hub');
    }
    if (button.dataset.activate !== undefined) {
      selectedTier = ''; // the paywall opens on the plan recommended for this person's goal
      state.profile = { ...calculatePlan(), estimated: false };
      if (state.profile.warning && Number(state.profile.age) < 18) return toast('Cette version est réservée aux adultes.');
      state.onboarding = true;
      state.profile.goalSet = true;
      state.profile.goalStart = { weight: Number(state.profile.weight), day: todayKey() };
      state.basicsFilled = { ...(state.basicsFilled || {}), name: true, age: true, weight: true, height: true, target: true };
      state.weights = (state.weights || []).filter((x) => x.day !== todayKey());
      state.weights.push({ day: todayKey(), value: Number(state.profile.weight) });
      saveState();
      if (!state.premium) {
        track('ViewPlans');
        return nav('plans');
      }
      return nav('app');
    }
    if (button.dataset.tier) {
      selectedTier = button.dataset.tier;
      return render();
    }
    if (button.dataset.period) {
      selectedPeriod = button.dataset.period;
      return render();
    }
    if (button.dataset.upgrade !== undefined) {
      selectedTier = button.dataset.upgrade || 'complete';
      return nav('upgrade');
    }
    if (button.dataset.buy !== undefined) {
      const plan = findPlan(defaultTier()) || Billing.plans()[0];
      button.disabled = true;
      try { await Billing.purchase(plan, selectedPeriod); } catch (error) { toast(error?.message || 'Paiement interrompu.'); }
      button.disabled = false;
      return;
    }
    if (button.dataset.storeRetry !== undefined) { NativeBilling.started = false; await NativeBilling.start(); return render(); }
    if (button.dataset.restore !== undefined) return Billing.restore();
    if (button.dataset.waitlist !== undefined) return joinWaitlist();
    if (button.dataset.guide) return openLesson(button.dataset.guide);
    if (button.dataset.session) {
      modal = { type: 'session', sessionId: button.dataset.session, programId: button.dataset.program || currentProgram().id };
      return renderModal();
    }
    if (button.dataset.trainTab) { trainTab = button.dataset.trainTab; return render(); }
    if (button.dataset.trainMode) { trainMode = button.dataset.trainMode; return render(); }
    if (button.dataset.planDay) {
      const wd = Number(button.dataset.planDay);
      const days = trainPlan().days;
      setPlanDays(days.includes(wd) ? days.filter((d) => d !== wd) : [...days, wd]);
      saveState(); const y = scrollY; render(); scrollTo(0, y); return;
    }
    if (button.dataset.planSuggest !== undefined) {
      const { days } = trainPlan(); const split = suggestSplit(days.length);
      state.trainPlan = { days, focus: Object.fromEntries(days.map((wd, i) => [wd, split[i]])), edited: {} };
      saveState(); const y = scrollY; render(); scrollTo(0, y); return;
    }
    if (button.dataset.planBuild !== undefined) {
      if (!trainPlan().days.length) return toast('Choisissez au moins un jour.');
      const program = buildPlanProgram();
      state.customPrograms = [...(state.customPrograms || []).filter((x) => !x.fromPlanner), program].slice(-12);
      state.workoutProgram = program.id;
      state.trainingWeekdays = trainPlan().days.slice();
      saveState(); trainTab = 'mine';
      track('ProgramBuilt', { source: 'planner', days: program.days });
      toast(L('Votre programme est prêt ✓')); scrollTo(0, 0); render(); celebrate(); return;
    }
    if (button.dataset.todayFocus) {
      const id = button.dataset.todayFocus; const sel = todayFocus || [];
      todayFocus = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id].slice(-3);
      const y = scrollY; render(); scrollTo(0, y); return;
    }
    if (button.dataset.todayBuild !== undefined) {
      if (!todayFocus?.length) return toast('Choisissez au moins une zone');
      const q = trainQuiz();
      const session = buildFocusSession(todayFocus, q, 'T1');
      state.quickProgram = { id: 'quick', quick: true, custom: true, name: 'Séance du jour', level: 'Sur mesure', place: q.place === 'gym' ? 'gym' : 'home', days: 1, focus: ['custom'], style: styleForGoal(q.goal).id, desc: '', sessions: [session] };
      saveState(false);
      track('QuickWorkout', { focus: todayFocus.join('+') });
      modal = { type: 'session', sessionId: 'T1', programId: 'quick' };
      return renderModal();
    }
    if (button.dataset.tq) { tqOpen = true; const [k, v] = button.dataset.tq.split(':'); state.trainQuiz = { ...trainQuiz(), [k]: v }; saveState(); return render(); }
    if (button.dataset.trainGroup) { trainGroup = button.dataset.trainGroup; return render(); }
    if (button.dataset.trainPlace) { trainPlace = button.dataset.trainPlace; trainGroup = 'all'; return render(); }
    if (button.dataset.menoTab) { menoTab = button.dataset.menoTab; return render(); }
    if (button.dataset.menoChart) { menoChartKey = button.dataset.menoChart; return render(); }
    if (button.dataset.menoRange) { menoRange = Number(button.dataset.menoRange); return render(); }
    if (button.dataset.menoReport !== undefined) return openMenoReport();
    if (button.dataset.menoFactor) {
      if (!fullAccess()) { nav('plans'); return; }
      const day = todayKey();
      state.menoFactors = state.menoFactors || {};
      const f = { ...(state.menoFactors[day] || {}) };
      if (f[button.dataset.menoFactor]) delete f[button.dataset.menoFactor]; else f[button.dataset.menoFactor] = 1;
      state.menoFactors[day] = f;
      saveState();
      return render();
    }
    if (button.dataset.menoLog) {
      if (!fullAccess()) { nav('plans'); return; }
      const day = todayKey();
      state.menoLog = state.menoLog || {};
      state.menoLog[day] = { ...(state.menoLog[day] || {}) };
      const v = Number(button.dataset.value);
      if (state.menoLog[day][button.dataset.menoLog] === v) delete state.menoLog[day][button.dataset.menoLog];
      else state.menoLog[day][button.dataset.menoLog] = v;
      if (Object.keys(state.menoLog[day]).length === MENO_SYMPTOMS.length) toast('Journal du jour complet ✓');
      saveState();
      return render();
    }
    if (button.dataset.menoTask !== undefined) {
      if (!fullAccess()) { nav('plans'); return; }
      const i = Number(button.dataset.menoTask); const j = Number(button.dataset.task); menoOpenWeek = i;
      state.menoTasks = state.menoTasks || {};
      const list = [...(state.menoTasks[i] || [])];
      list[j] = !list[j];
      state.menoTasks[i] = list;
      if (list[j]) toast('Action validée ✓');
      saveState();
      return render();
    }
    if (button.dataset.libEquip) { libEquip = button.dataset.libEquip; return render(); }
    if (button.dataset.createMode) { createMode = button.dataset.createMode; return render(); }
    if (button.dataset.trainCreate) { trainTab = 'create'; createMode = button.dataset.trainCreate; return render(); }
    if (button.dataset.gridDay) {
      const g = gridDraft(); const wd = Number(button.dataset.gridDay);
      const idx = g.days.findIndex((d) => d.wd === wd);
      if (idx >= 0) { if (g.days[idx].ex.length && !confirmSoft(button)) return; g.days.splice(idx, 1); }
      else { g.days.push({ wd, name: '', ex: [] }); g.days.sort((a, b) => WEEKDAY_ORDER.indexOf(a.wd) - WEEKDAY_ORDER.indexOf(b.wd)); g.days.forEach((d, i) => { if (!d.name) d.name = L('Séance {n}', { n: String.fromCharCode(65 + i) }); }); }
      saveState(false); return render();
    }
    if (button.dataset.gridTemplate) { const prog = findProgram(button.dataset.gridTemplate); if (prog) { gridFromProgram(prog); saveState(false); toast('Modèle chargé : modifiez-le librement.'); } return render(); }
    if (button.dataset.gridSets) { const [d, e] = button.dataset.gridSets.split(':').map(Number); const row = gridDraft().days[d].ex[e]; row[1] = clamp(Number(row[1]) + Number(button.dataset.delta), 1, 10); saveState(false); return render(); }
    if (button.dataset.gridMove) { const [d, e] = button.dataset.gridMove.split(':').map(Number); const list = gridDraft().days[d].ex; if (e > 0) [list[e - 1], list[e]] = [list[e], list[e - 1]]; saveState(false); return render(); }
    if (button.dataset.gridRemove) { const [d, e] = button.dataset.gridRemove.split(':').map(Number); gridDraft().days[d].ex.splice(e, 1); saveState(false); return render(); }
    if (button.dataset.gridPick !== undefined) { pickerState = { day: Number(button.dataset.gridPick), group: 'all', equip: 'all', query: '' }; modal = { type: 'ex-picker' }; return renderModal(); }
    if (button.dataset.gridSave !== undefined) { if (!fullAccess()) return nav('plans'); return saveGrid(); }
    if (button.dataset.recipeCuisine) { recipeCuisine = button.dataset.recipeCuisine; return render(); }
    if (button.dataset.recipeRegion) { recipeRegion = button.dataset.recipeRegion; recipeCuisine = 'all'; return render(); }
    if (button.dataset.recipeType) { recipeType = button.dataset.recipeType; return render(); }
    if (button.dataset.planCuisine) {
      const set = new Set(planCuisines()); const k = button.dataset.planCuisine;
      if (set.has(k) && set.size > 1) set.delete(k); else set.add(k);
      state.profile.cuisines = [...set]; saveState(); return render();
    }
    if (button.dataset.plansTab) { plansTab = button.dataset.plansTab; track('PlansTab', { tab: plansTab }); return render(); }
    if (button.dataset.buildMod) {
      const id = button.dataset.buildMod;
      buildSel = buildSel.includes(id) ? buildSel.filter((x) => x !== id) : [...buildSel, id];
      return render();
    }
    if (button.dataset.goBuilder !== undefined) { plansTab = 'builder'; buildSel = [...(findPlan(defaultTier())?.modules || [])]; return nav('plans'); }
    if (button.dataset.choosePlan) { selectedTier = button.dataset.choosePlan; selectedPeriod = 'annual'; track('PlanChosen', { plan: selectedTier }); return nav(state.premium ? 'upgrade' : 'paywall'); }
    if (button.dataset.scroll) {
      const id = button.dataset.scroll;
      if (id === 'checkin' && !document.getElementById(id)) { todayTab = 'missions'; render(); }
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (button.dataset.progRange !== undefined) { progressRange = Number(button.dataset.progRange); return render(); }
    if (button.dataset.weightStep) { const input = $('#weight-now'); if (input) input.value = (Math.round((Number(input.value || lastWeight()) + Number(button.dataset.weightStep)) * 10) / 10).toFixed(1); return; }
    if (button.dataset.photoRemove) { await PhotoStore.remove(button.dataset.photoRemove); return renderPhotos(); }
    if (button.dataset.shopAdd !== undefined) { const input = $('#shop-extra'); const v = input?.value.trim(); if (!v) return; state.shoppingExtra = [...new Set([...(state.shoppingExtra || []), v.slice(0, 60)])]; saveState(); return render(); }
    if (button.dataset.shopRemove) { event.preventDefault(); state.shoppingExtra = (state.shoppingExtra || []).filter((x) => x !== button.dataset.shopRemove); saveState(); return render(); }
    if (button.dataset.shopReset !== undefined) { state.shoppingChecked = {}; saveState(); return render(); }
    if (button.dataset.shopShare !== undefined) {
      const items = planShopping().filter((i) => !state.shoppingChecked[i.key]);
      const text = `${L('Liste de courses NutriPilot')}\n${items.map((i) => `• ${L(i.name)}${i.grams ? ` – ${i.grams >= 1000 ? `${fmt(i.grams / 1000, 1)} kg` : `${fmt(i.grams)} g`}` : ''}`).join('\n')}`;
      try { if (navigator.share) await navigator.share({ text }); else { await navigator.clipboard.writeText(text); toast('Liste copiée ✓'); } } catch {}
      return;
    }
    if (button.dataset.planAddRecipe) { if (!fullAccess()) return nav('plans'); modal = { type: 'plan-pick', recipeId: button.dataset.planAddRecipe }; return renderModal(); }
    if (button.dataset.trainFocus) { trainFocus = button.dataset.trainFocus; return render(); }
    if (button.dataset.libGroup) { libGroup = button.dataset.libGroup; return render(); }
    if (button.dataset.exercise) { modal = { type: 'exercise', id: button.dataset.exercise }; return renderModal(); }
    if (button.dataset.trainDay) {
      const wd = Number(button.dataset.trainDay);
      const days = trainingDays();
      const next = days.includes(wd) ? days.filter((d) => d !== wd) : [...days, wd];
      if (!next.length) return toast('Gardez au moins un jour d’entraînement.');
      state.trainingWeekdays = next;
      saveState();
      return render();
    }
    if (button.dataset.builderStyle) { builder = builder || defaultBuilder(); builder.style = button.dataset.builderStyle; trainTab = 'create'; return render(); }
    if (button.dataset.bDay) {
      builder = builder || defaultBuilder();
      const wd = Number(button.dataset.bDay);
      builder.days = builder.days.includes(wd) ? builder.days.filter((d) => d !== wd) : [...builder.days, wd];
      return render();
    }
    if (button.dataset.bPlace) { builder.place = button.dataset.bPlace; return render(); }
    if (button.dataset.bDuration) { builder.duration = Number(button.dataset.bDuration); return render(); }
    if (button.dataset.bStyle) { builder.style = button.dataset.bStyle; return render(); }
    if (button.dataset.bFreq) { const g = button.dataset.bFreq; builder.freq[g] = clamp((builder.freq[g] || 0) + Number(button.dataset.delta), 0, 3); return render(); }
    if (button.dataset.buildProgram !== undefined) {
      if (!builder.days.length) return toast('Choisissez au moins un jour.');
      if (!Object.values(builder.freq).some((n) => n > 0)) return toast('Choisissez au moins une zone à travailler.');
      const program = buildCustomProgram(builder);
      state.customPrograms = [...(state.customPrograms || []), program].slice(-12);
      state.workoutProgram = program.id;
      state.trainingWeekdays = builder.days.slice();
      saveState();
      trainTab = 'mine';
      track('ProgramBuilt', { style: builder.style, days: builder.days.length });
      toast('Votre programme est prêt ✓');
      return render();
    }
    if (button.dataset.importPlan) {
      if (!fullAccess()) return nav('plans');
      return importPlan(button.dataset.importPlan, button);
    }
    if (button.dataset.workoutProgram) {
      state.workoutProgram = button.dataset.workoutProgram;
      const chosen = findProgram(state.workoutProgram);
      // The programme follows the days the person chose; without a choice, a default spread.
      if (trainPlan().days.length) state.trainingWeekdays = trainPlan().days.slice();
      else if (chosen && trainingDays().length !== (chosen.days || chosen.sessions.length)) state.trainingWeekdays = DEFAULT_DAYS[chosen.days || chosen.sessions.length] || state.trainingWeekdays;
      toast(L('Programme choisi ✓'));
      trainTab = 'mine';
      saveState();
      return render();
    }
    if (button.dataset.track) return startQuiz(button.dataset.track);

    if (button.dataset.openAdd !== undefined) return openAdd(state.meals.length >= 2 ? 'recent' : canScan() ? 'photo' : 'barcode');
    if (button.dataset.addTab) return openAdd(button.dataset.addTab);
    if (button.dataset.water) {
      const key = todayKey();
      state.water[key] = clamp(Number(state.water[key] || 0) + Number(button.dataset.water), 0, 6000);
      if (Number(button.dataset.water) > 0 && state.water[key] >= waterGoal() && state.water[key] - Number(button.dataset.water) < waterGoal()) toast('Objectif d’hydratation atteint 💧');
      saveState();
      return render();
    }
    if (button.dataset.checkin) {
      state.checkins[todayKey()] = { ...(state.checkins[todayKey()] || {}), [button.dataset.checkin]: button.dataset.value };
      saveState();
      return render();
    }
    if (button.dataset.meal && button.dataset.day === undefined) {
      const meal = state.meals.find((x) => String(x.id) === String(button.dataset.meal));
      if (meal) { modal = { type: 'meal', meal }; renderModal(); }
      return;
    }
    if (button.dataset.generateWeek !== undefined) return generateWeek(button);
    if (button.dataset.weekReview !== undefined) return generateWeeklyReview(button);
    if (button.dataset.addPlanMeal !== undefined) {
      const day = state.weekPlan[Number(button.dataset.day)];
      const meal = day?.meals?.[Number(button.dataset.meal)];
      if (meal) {
        state.meals.push({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          day: todayKey(),
          type: meal.type,
          title: meal.name,
          foods: (meal.ingredients || []).map((raw) => { const x = normalizeIngredient(raw); return { name: x.name, grams: x.grams, kcal: 0 }; }),
          total: { kcal: Number(meal.kcal || 0), protein: Number(meal.protein || 0), carbs: Number(meal.carbs || 0), fat: Number(meal.fat || 0), fiber: Number(meal.fiber || 0) },
          icon: '▦',
          source: 'week-plan',
        });
        saveState();
        toast('Repas ajouté au journal ✓'); reviewMoment();
        return render();
      }
    }
    if (button.dataset.planRecipe !== undefined) return openPlanRecipe(Number(button.dataset.day), Number(button.dataset.meal));
    if (button.dataset.swapPlan !== undefined) {
      const dayIndex = Number(button.dataset.day);
      const mealIndex = Number(button.dataset.meal);
      const meal = state.weekPlan?.[dayIndex]?.meals?.[mealIndex];
      if (meal && !button.dataset.swapAi) { modal = { type: 'plan-swap', dayIndex, mealIndex }; return renderModal(); }
      if (meal) {
        pendingPlanSwap = { dayIndex, mealIndex, options: [] };
        nav('planner');
        setTimeout(() => {
          const mode = $('[data-planner-mode="pleasure"]');
          mode?.click();
          setTimeout(() => { const input = $('#swap-meal'); if (input) input.value = meal.name; }, 0);
        }, 0);
      }
      return;
    }

    if (button.dataset.plannerMode) {
      if (button.dataset.plannerMode !== 'pleasure') pendingPlanSwap = null;
      $$('.planner-mode').forEach((x) => x.classList.remove('active'));
      button.classList.add('active');
      const t = totals();
      const left = Math.max(180, state.profile.dailyKcal - t.kcal);
      const proteinLeft = Math.max(0, Math.round(state.profile.protein - t.protein));
      $('#planner-panel').innerHTML = plannerPanel(button.dataset.plannerMode, left, proteinLeft);
      return;
    }
    if (button.dataset.compose !== undefined) return doCompose(button);
    if (button.dataset.fridge !== undefined) return doFridge(button);
    if (button.dataset.restaurant !== undefined) return doRestaurant(button);
    if (button.dataset.smartSwap !== undefined) return doSmartSwap(button);
    if (button.dataset.replaceOption !== undefined) {
      const option = pendingPlanSwap?.options?.[Number(button.dataset.replaceOption)];
      const target = pendingPlanSwap && state.weekPlan?.[pendingPlanSwap.dayIndex]?.meals?.[pendingPlanSwap.mealIndex];
      if (!option || !target) return toast('Remplacement indisponible. Réessayez.');
      state.weekPlan[pendingPlanSwap.dayIndex].meals[pendingPlanSwap.mealIndex] = { ...option, type: target.type };
      pendingPlanSwap = null;
      saveState();
      toast('Repas remplacé · liste de courses actualisée ✓');
      return nav('program');
    }
    if (button.dataset.addSuggestion) {
      const s = JSON.parse(button.dataset.addSuggestion);
      state.meals.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, day: todayKey(), type: mealTypeFromHour(), title: s.name, foods: (s.ingredients || []).map((x) => ({ name: typeof x === 'string' ? x : x.name, grams: 0, kcal: 0 })), total: { kcal: Number(s.kcal || 0), protein: Number(s.protein || 0), carbs: Number(s.carbs || 0), fat: Number(s.fat || 0), fiber: Number(s.fiber || 0) }, icon: '✦', source: 'planner' });
      saveState();
      toast('Repas ajouté ✓'); reviewMoment();
      return render();
    }

    if (button.dataset.journeyHide !== undefined) { state.journeyHidden = true; saveState(); toast('Vous retrouverez tout dans le menu.'); return render(); }
    if (button.dataset.welcomeOk !== undefined) { state.welcomeBackSeen = todayKey(); saveState(false); return render(); }
    if (button.dataset.sos !== undefined) { track('SosOpen'); modal = { type: 'sos' }; return renderModal(); }
    if (button.dataset.recipeId && !event.target.closest('[data-fav-recipe]')) {
      const recipe = ALL_RECIPES.find((r) => r.id === button.dataset.recipeId);
      if (recipe) { modal = { type: 'recipe', recipe }; renderModal(); }
      return;
    }
    if (button.dataset.favRecipe) {
      toggleRecipeFavorite(button.dataset.favRecipe);
      if (route === 'recipes') { const grid = $('#recipe-grid'); if (grid) grid.innerHTML = recipeGridHtml(); }
      else render();
      return;
    }
    if (button.dataset.recipeGoal !== undefined) { recipeGoal = recipeGoal === button.dataset.recipeGoal ? '' : button.dataset.recipeGoal; recipeView = 'explore'; render(); requestAnimationFrame(() => { const card = document.querySelector('.rg-card.on'); const row = card?.parentElement; if (card && row) { const c = card.getBoundingClientRect(); const w = row.getBoundingClientRect(); row.scrollBy({ left: c.left - w.left - (w.width - c.width) / 2, behavior: 'instant' }); } }); return; }
    if (button.dataset.recipeFilter) { recipeFilter = button.dataset.recipeFilter; return render(); }

    if (button.dataset.quickCoach) return sendCoach(button.dataset.quickCoach);
    if (button.dataset.coachSend !== undefined) return sendCoach();

    if (button.dataset.recalibrate !== undefined) {
      const currentWeight = lastWeight();
      state.profile = calculatePlan({ ...state.profile, weight: currentWeight });
      saveState();
      toast('Vos repères ont été actualisés ✓');
      return render();
    }

    if (button.dataset.saveProgress !== undefined) {
      const weight = Number($('#weight-now')?.value);
      const waist = Number($('#waist-now')?.value || 0);
      if (!weight || weight < 30 || weight > 300) return toast('Poids invalide.');
      state.profile.weight = weight;
      const today = todayKey();
      state.weights = state.weights.filter((x) => x.day !== today);
      state.weights.push({ day: today, value: weight });
      if (waist >= 40 && waist <= 200) {
        state.waist = state.waist.filter((x) => x.day !== today);
        state.waist.push({ day: today, value: waist });
      }
      const m = {};
      $$('[data-measure]').forEach((el) => { const v = Number(el.value); if (v >= 10 && v <= 250) m[el.dataset.measure] = v; });
      if (m.waist) { state.waist = state.waist.filter((x) => x.day !== today); state.waist.push({ day: today, value: m.waist }); }
      if (Object.keys(m).length) state.measures = { ...(state.measures || {}), [today]: { ...(state.measures?.[today] || {}), ...m } };
      saveState();
      toast('Progression enregistrée ✓');
      return render();
    }

    if (button.dataset.requestCode !== undefined) return requestCode();
    if (button.dataset.verifyCode !== undefined) return verifyCode();
    if (button.dataset.logout !== undefined) {
      state.premium = false;
      state.accessToken = '';
      state.premiumEmail = '';
      state.subscriptionPlan = '';
      saveState(false);
      return nav('app');
    }
    if (button.dataset.export === 'meno') {
      const keys = Object.keys(state.menoLog || {}).sort();
      const rows = [[L('Date'), ...MENO_SYMPTOMS.map(([, label]) => L(label))].join(';')];
      keys.forEach((k) => rows.push([k, ...MENO_SYMPTOMS.map(([key]) => state.menoLog[k]?.[key] ?? '')].join(';')));
      rows.push('', L('Échelle : 0 = aucun, 1 = léger, 2 = moyen, 3 = fort'));
      await saveFile('\ufeff' + rows.join('\n'), 'journal-menopause.csv', 'text/csv');
      return;
    }
    if (button.dataset.export !== undefined) {
      await saveFile(JSON.stringify(syncSafeState(), null, 2), 'nutripilot-donnees.json', 'application/json');
      return;
    }
    if (button.dataset.install !== undefined) {
      if (window.deferredInstall) { window.deferredInstall.prompt(); await window.deferredInstall.userChoice; }
      else toast('Utilisez « Ajouter à l’écran d’accueil » dans votre navigateur.');
      return;
    }
    if (button.dataset.deleteAccount !== undefined) {
      if (!confirm(L('Supprimer définitivement votre compte et toutes vos données ? L’abonnement App Store ou Google Play n’est pas résilié automatiquement : annulez-le dans les réglages de la boutique.'))) return;
      try {
        const response = await fetch('/api/account', { method: 'DELETE', headers: { Authorization: `Bearer ${state.accessToken || state.accountToken}` } });
        if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || '');
      } catch (error) { return toast(L(error.message || 'Réessayez dans un instant.')); }
      const keepLang = state.lang;
      state = clone(defaultState);
      state.lang = keepLang;
      localStorage.setItem('nutripilot_v7', JSON.stringify(state));
      toast(L('Compte supprimé.'));
      return nav('hello');
    }
    if (button.dataset.deleteData !== undefined) {
      if (!confirm(L('Supprimer votre journal, votre programme et vos données NutriPilot ? Votre abonnement n’est pas résilié.'))) return;
      try {
        if (state.accessToken) await apiFetch('/api/user/state', { method: 'DELETE' });
      } catch {}
      const auth = { premium: state.premium, premiumEmail: state.premiumEmail, accessToken: state.accessToken, subscriptionPlan: state.subscriptionPlan };
      state = clone(defaultState);
      Object.assign(state, auth);
      localStorage.setItem('nutripilot_v7', JSON.stringify(state));
      toast('Données supprimées.');
      return nav('onboarding');
    }
  };


  const suppFile = $('#supp-image');
  if (suppFile) suppFile.onchange = async () => {
    const f = suppFile.files?.[0];
    if (!f) return;
    try { suppImage = await fileToData(f, 1600, 0.85); toast('Photo prête : touchez « Lire l’étiquette »'); } catch { toast('Image illisible.'); }
  };
  const coachData = $('#coach-data');
  if (coachData) coachData.onchange = () => { state.coachUsesData = coachData.checked; saveState(false); };
  const voice = $('#relax-voice');
  if (voice) voice.onchange = () => { state.relaxVoice = voice.checked; saveState(false); if (!voice.checked) try { speechSynthesis.cancel(); } catch {} };
  const coachInput = $('#coach-input');
  if (coachInput) coachInput.onkeydown = (event) => { if (event.key === 'Enter') $('[data-coach-send]')?.click(); };
}

function bindModal(root) {
  root.onclick = async (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (modal?.type === 'copilot' && copilotClick(button, root)) return;
    if (button.dataset.cpUndo) { modal = null; root.remove(); return cpUndo(button.dataset.cpUndo); }

    if (button.dataset.appTab) { const [id, key] = button.dataset.appTab.split(':'); modal = null; root.remove(); return openAppTab(id, key); }
    if (button.dataset.trialStart !== undefined) { modal = null; root.remove(); return beginTrial(); }
    if (button.dataset.trialGo !== undefined) { modal = null; root.remove(); return nav('modules'); }
    if (button.dataset.trialStep) { root.remove(); return goTrialStep(button.dataset.trialStep); }
    if (button.dataset.signin) {
      if (button.dataset.signin === 'email') { modal = { type: 'account', step: 'email', email: state.accountEmail || '' }; return renderModal(); }
      return signInWith(button.dataset.signin);
    }
    if (button.dataset.close !== undefined) {
      const refresh = modal?.refresh;
      modal = null;
      root.remove();
      if (refresh) render();
      return;
    }
    if (button.dataset.accSend !== undefined) return accountSend();
    if (button.dataset.accVerify !== undefined) return accountVerify();
    if (button.dataset.accBack !== undefined) { modal.step = 'email'; modal.msg = ''; return renderModal(); }
    if (button.dataset.guide) { root.remove(); return openLesson(button.dataset.guide); }
    if (button.dataset.moduleBuy) { modal = null; root.remove(); return viewModulePlans(button.dataset.moduleBuy); }
    if (button.dataset.barcodeCam !== undefined) return startBarcodeCamera(root);
    if (button.dataset.servings) { modal.servings = clamp((modal.servings || 1) + Number(button.dataset.servings), 1, 12); return renderModal(); }
    if (button.dataset.scanLog) {
      const item = (state.scanHistory || []).find((x) => x.id === button.dataset.scanLog);
      if (!item) return;
      const base = item.per100 ? { name: item.title, grams: 100, ...item.per100 } : { name: item.title, grams: 100, ...item.total };
      modal = { type: 'add', tab: 'photo', loading: false, mealType: mealTypeFromHour(), result: { title: item.title, foods: [base], total: clone(item.total), confidence: 0.9, source: item.source || 'scan', product: item.product } };
      return renderModal();
    }
    if (button.dataset.recipeId && modal?.type === 'sos') { const recipe = ALL_RECIPES.find((r) => r.id === button.dataset.recipeId); if (recipe) { modal = { type: 'recipe', recipe }; renderModal(); } return; }
    if (button.dataset.sosWater !== undefined) { const k = todayKey(); state.water[k] = Number(state.water[k] || 0) + 250; saveState(); modal = null; root.remove(); render(); return toast('+250 ml ✓'); }
    if (button.dataset.copyYesterday !== undefined) {
      const y = state.meals.filter((m) => m.day === addDays(-1));
      y.forEach((m) => relogMeal(m));
      saveState(); track('MealSaved', { source: 'copy-day', n: y.length });
      modal = null; root.remove(); render();
      return toast(L('{n} repas ajoutés ✓', { n: y.length }));
    }
    if (button.dataset.recentAdd) {
      const m = state.meals.find((x) => String(x.id) === button.dataset.recentAdd);
      if (!m) return;
      relogMeal(m, mealTypeFromHour());
      saveState(); track('MealSaved', { source: 'recent', kcal: m.total?.kcal });
      button.classList.add('done'); button.innerHTML = icon('check'); button.disabled = true;
      modal.refresh = true;
      return (toast('Repas ajouté ✓'), reviewMoment());
    }
    if (button.dataset.recentEdit) {
      const m = state.meals.find((x) => String(x.id) === button.dataset.recentEdit);
      if (!m) return;
      modal.result = { title: m.title, foods: clone(m.foods || [{ name: m.title, grams: 100, ...m.total }]), total: clone(m.total), confidence: 0.95, source: m.source || 'manual' };
      modal.mealType = m.type || modal.mealType;
      return renderModal();
    }
    if (button.dataset.saveReminders !== undefined) { await saveReminders(root); modal = null; root.remove(); return render(); }
    if (button.dataset.supportSend !== undefined) return sendSupport($('#support-input', root)?.value);
    if (button.dataset.supportQuick) return sendSupport(button.dataset.supportQuick);
    if (button.dataset.swapEx !== undefined) {
      if (!fullAccess()) { modal = null; root.remove(); return nav('plans'); }
      const program = findProgram(button.dataset.program);
      const session = program?.sessions.find((x) => x.id === button.dataset.sessionId);
      if (!program || !session) return;
      const idx = Number(button.dataset.swapEx);
      const currentId = sessionExercises(program, session)[idx][0];
      const options = alternativesFor(currentId, program.place);
      if (!options.length) return toast('Pas d’alternative pour cet exercice.');
      const originalId = session.ex[idx][0];
      const cycle = [originalId, ...alternativesFor(originalId, program.place)];
      const next = cycle[(cycle.indexOf(currentId) + 1) % cycle.length];
      state.exerciseSwaps = state.exerciseSwaps || {};
      state.exerciseSwaps[program.id] = state.exerciseSwaps[program.id] || {};
      state.exerciseSwaps[program.id][session.id] = { ...(state.exerciseSwaps[program.id][session.id] || {}), [idx]: next === originalId ? undefined : next };
      saveState();
      toast(L('Remplacé par : {name}', { name: L(exName(next)) }));
      return renderModal();
    }
    if (button.dataset.finishSession && !fullAccess()) {
      modal = null;
      root.remove();
      return nav('plans');
    }
    if (button.dataset.finishSession) {
      const loads = {};
      $$('[data-load]', root).forEach((input) => { if (input.value) loads[input.dataset.load] = Number(input.value); });
      const programId = button.dataset.program || currentProgram().id;
      state.workoutLog = [...(state.workoutLog || []), { at: new Date().toISOString(), day: todayKey(), programId, sessionId: button.dataset.finishSession, loads }].slice(-300);
      saveState();
      track('WorkoutDone', { program: programId });
      modal = null;
      root.remove();
      toast('Séance enregistrée. Bravo ! 💪'); celebrate();
      return render();
    }
    if (button.dataset.mtab) {
      modal.tab = button.dataset.mtab;
      modal.result = null;
      return renderModal();
    }
    if (button.dataset.analyzeText !== undefined) {
      const text = $('#meal-text', root)?.value.trim();
      if (!text) return toast('Décrivez le repas.');
      return analyze({ text, mode: 'meal' });
    }
    if (button.dataset.barcode !== undefined) {
      const code = $('#barcode', root)?.value.trim();
      if (!code) return toast('Entrez le code-barres.');
      modal.loading = true;
      renderModal();
      try {
        const response = await apiFetch(`/api/barcode?code=${encodeURIComponent(code)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        modal.loading = false;
        modal.result = data;
        pushScan(data, 'barcode');
        renderModal();
      } catch (error) {
        modal.loading = false;
        modal.result = null;
        renderModal();
        toast(error.message);
      }
      return;
    }
    if (button.dataset.voice !== undefined) return voiceInput(button, root);
    if (button.dataset.manual) {
      const food = JSON.parse(button.dataset.manual);
      modal.result = { title: food[0], foods: [{ name: food[0], grams: 100, kcal: food[1], protein: food[2], carbs: food[3], fat: food[4], fiber: food[5], sugar: null, satFat: null, salt: null, confidence: 0.98 }], total: { kcal: food[1], protein: food[2], carbs: food[3], fat: food[4], fiber: food[5], sugar: null, satFat: null, salt: null }, confidence: 0.98, range: { min: Math.round(food[1] * 0.98), max: Math.round(food[1] * 1.02) }, assumptions: ['Valeurs indicatives pour 100 g.'], note: 'Ajustez la quantité réellement consommée.', source: 'manual' };
      return renderModal();
    }
    if (button.dataset.fav !== undefined) {
      modal.result = clone(state.favorites[Number(button.dataset.fav)]);
      return renderModal();
    }
    if (button.dataset.saveFavorite !== undefined) {
      if (!modal.result) return;
      state.favorites.unshift(clone(modal.result));
      state.favorites = state.favorites.slice(0, 40);
      saveState();
      return toast('Ajouté aux favoris ♡');
    }
    if (button.dataset.saveResult !== undefined) {
      recalcResult(root);
      const result = modal.result;
      const mealType = $('#meal-type', root)?.value || mealTypeFromHour();
      state.meals.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, day: todayKey(), type: mealType, title: result.title || 'Repas', foods: clone(result.foods), total: clone(result.total), icon: result.source === 'openfoodfacts' ? '▤' : result.source === 'manual' ? '✎' : '📸', source: result.source || 'unknown' });
      if (['ai', 'fallback'].includes(result.source)) state.scanCount += 1;
      saveState();
      track('MealSaved', { source: result.source || 'unknown', kcal: result.total.kcal });
      modal = null;
      root.remove();
      render();
      return (toast('Repas ajouté ✓'), reviewMoment());
    }
    if (button.dataset.deleteMeal) {
      state.meals = state.meals.filter((meal) => String(meal.id) !== String(button.dataset.deleteMeal));
      saveState();
      modal = null;
      root.remove();
      render();
      return toast('Repas supprimé');
    }
    if (button.dataset.favRecipe) {
      toggleRecipeFavorite(button.dataset.favRecipe);
      if (route === 'recipes') { const grid = $('#recipe-grid'); if (grid) grid.innerHTML = recipeGridHtml(); }
      if (modal?.type === 'recipe') renderModal();
      return;
    }
    if (button.dataset.addCurated) return addCuratedRecipe(button.dataset.addCurated, modal?.type === 'recipe' && modal.recipe?.id === button.dataset.addCurated ? modal.recipe : null);
    if (button.dataset.planAddRecipe) { if (!fullAccess()) { modal = null; root.remove(); return nav('plans'); } modal = { type: 'plan-pick', recipeId: button.dataset.planAddRecipe }; return renderModal(); }
    if (button.dataset.planPickDay !== undefined) { addRecipeToPlan(modal.recipeId, Number(button.dataset.planPickDay)); modal = null; root.remove(); return render(); }
    if (button.dataset.swapChoose) {
      const { dayIndex, mealIndex } = modal;
      const meal = state.weekPlan[dayIndex].meals[mealIndex];
      const r = ALL_RECIPES.find((x) => x.id === button.dataset.swapChoose);
      const nm = scaledMeal(r, meal.kcal, meal.type);
      modal = null; root.remove();
      if (state.weekPlan[dayIndex].date === todayKey()) {
        const after = cpEnsureTimes(cpDraft()); after.meals[mealIndex] = nm;
        const before = cpEnsureTimes(cpDraft());
        return cpApply({ id: 'swap', title: L('{type} : {name}', { type: L(meal.type), name: L(r.name) }), why: [], after, lines: cpDiff(before, after) }, { kind: 'swap', source: 'user' });
      }
      const before = { meals: clone(state.weekPlan[dayIndex].meals), times: {}, status: {}, workout: '' };
      state.weekPlan[dayIndex].meals[mealIndex] = nm;
      state.changes = [{ id: `c${Date.now().toString(36)}`, at: new Date().toISOString(), day: state.weekPlan[dayIndex].date || '', title: L('{type} : {name}', { type: L(meal.type), name: L(r.name) }), kind: 'swap', source: 'user', before, after: { meals: clone(state.weekPlan[dayIndex].meals), times: {}, status: {}, workout: '' }, lines: [], undone: false }, ...(state.changes || [])].slice(0, 60);
      saveState(); toast('Repas remplacé ✓'); return render();
    }
    if (button.dataset.swapAi !== undefined) {
      const { dayIndex, mealIndex } = modal; modal = null; root.remove();
      const meal = state.weekPlan[dayIndex].meals[mealIndex];
      pendingPlanSwap = { dayIndex, mealIndex, options: [] };
      nav('planner');
      setTimeout(() => { $('[data-planner-mode="pleasure"]')?.click(); setTimeout(() => { const input = $('#swap-meal'); if (input) input.value = L(meal.name); }, 0); }, 0);
      return;
    }
    if (button.dataset.pickGroup) { pickerState.group = button.dataset.pickGroup; return renderModal(); }
    if (button.dataset.pickEquip) { pickerState.equip = button.dataset.pickEquip; return renderModal(); }
    if (button.dataset.pickEx) {
      const day = gridDraft().days[pickerState.day];
      const id = button.dataset.pickEx;
      const at = day.ex.findIndex((e) => e[0] === id);
      if (at >= 0) day.ex.splice(at, 1); else day.ex.push([id, ...defaultSetsFor(id)]);
      saveState(false);
      $('#picker-grid', root).innerHTML = pickerGridHtml(libraryList(pickerState.group, pickerState.equip, pickerState.query), day);
      const fine = root.querySelector('.sheet-head .fine'); if (fine) fine.textContent = L('{n} dans cette séance', { n: day.ex.length });
      modal.refresh = true;
      return;
    }
    if (button.dataset.gridAddEx) {
      const g = gridDraft();
      if (!g.days.length) { g.days.push({ wd: WEEKDAY_ORDER[0], name: L('Séance {n}', { n: 'A' }), ex: [] }); }
      const day = g.days[g.days.length - 1];
      if (!day.ex.some((e) => e[0] === button.dataset.gridAddEx)) day.ex.push([button.dataset.gridAddEx, ...defaultSetsFor(button.dataset.gridAddEx)]);
      saveState(false); modal = null; root.remove(); trainTab = 'create'; createMode = 'grid'; toast('Ajouté à votre grille ✓');
      return nav('training');
    }
    if (button.dataset.rest) return startRest(Number(button.dataset.rest));
    if (button.dataset.setDot) { button.classList.toggle('done'); haptic('light'); return; }
  };

  root.oninput = (event) => {
    if (event.target.matches('[data-grams]')) recalcResult(root);
    if (event.target.id === 'manual-search') $('#manual-list', root).innerHTML = manualResults(event.target.value);
  };

  const file = $('#meal-image', root);
  if (file) {
    file.onchange = async () => {
      const selected = file.files?.[0];
      if (!selected) return;
      if (!/^image\/(?:jpeg|png|webp)$/i.test(selected.type || '')) return toast('Utilisez une image JPEG, PNG ou WebP.');
      if (selected.size > 7_000_000) return toast('Image trop lourde (7 Mo max).');
      const target = modal;
      const mode = target?.tab === 'label' ? 'label' : 'meal';
      try {
        const image = await fileToData(selected, 1600, 0.82);
        if (modal !== target) return;
        await analyze({ image, mode });
      } catch (error) { toast(error.message); }
    };
  }
}

let lastErrorToast = 0;
function softFail(err) {
  (window.__npErrors ||= []).push(String(err?.stack || err?.message || err));
  console.warn('[NutriPilot]', err);
  if (Date.now() - lastErrorToast < 4000) return;
  lastErrorToast = Date.now();
  try { toast(L('Petit souci technique, réessayez. Vos données sont sauvegardées.')); } catch { /* ignore */ }
}
window.addEventListener('error', (e) => { if (e.error) softFail(e.error); });
window.addEventListener('unhandledrejection', (e) => softFail(e.reason));

init();

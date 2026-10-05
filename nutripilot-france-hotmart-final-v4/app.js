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
  salesUrl: 'https://atlasevermore.com/#tarifs',
  manageSubscriptionUrl: 'https://consumer.hotmart.com/',
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
      ['Dinde', 150], ['Quinoa cuit', 150], ['Carotte', 100], ['Concombre', 120], ['Tomate', 120], ['Yaourt nature', 60],
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
      ['Œufs', 150], ['Pain complet', 60], ['Avocat', 60], ['Tomate', 120], ['Roquette', 30],
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
      ['Lentilles cuites', 210], ['Feta', 45], ['Tomate', 140], ['Concombre', 120], ['Carotte', 80], ['Huile d’olive', 6],
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
      ['Tofu', 170], ['Riz cuit', 150], ['Brocoli', 180], ['Carotte', 100], ['Lait de coco léger', 70], ['Curry', 4],
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
      ['Steak haché 5%', 130], ['Pain burger', 75], ['Pommes de terre', 220], ['Tomate', 80], ['Salade', 50], ['Sauce yaourt', 35],
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

const defaultState = {
  onboarding: false,
  premium: false,
  premiumEmail: '',
  accessToken: '',
  subscriptionPlan: '',
  profile: {
    name: '',
    sex: 'female',
    age: 32,
    height: 165,
    weight: 70,
    target: 62,
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
let pendingPlanSwap = null;

function loadState() {
  try {
    const raw = localStorage.getItem('nutripilot_v7') || localStorage.getItem('nutripilot_v3') || '{}';
    return deepMerge(clone(defaultState), JSON.parse(raw));
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

function authHeaders(extra = {}) {
  return { ...extra, ...(state.accessToken ? { Authorization: `Bearer ${state.accessToken}` } : {}) };
}

async function apiFetch(url, options = {}) {
  return fetch(url, { ...options, headers: authHeaders(options.headers || {}) });
}

function syncSafeState() {
  const clean = clone(state);
  delete clean.accessToken;
  delete clean.premium;
  delete clean.premiumEmail;
  return clean;
}

function saveState(remote = true) {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem('nutripilot_v7', JSON.stringify(state));
  if (remote && state.premium && state.accessToken) {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncRemote, 900);
  }
}

async function syncRemote() {
  try {
    await apiFetch('/api/user/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: syncSafeState() }),
    });
  } catch {}
}

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[char]));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function fmt(value, digits = 0) {
  return Number(value || 0).toLocaleString('fr-FR', { maximumFractionDigits: digits, minimumFractionDigits: digits });
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
  return new Date(`${key}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });
}

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(window.__nutriToastTimer);
  window.__nutriToastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

function track(name, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  try { window.fbq?.('trackCustom', name, params); } catch {}
}

function logo() {
  return `<div class="logo"><span class="logo-mark"></span>${esc(config.brand)}</div>`;
}

function nav(next) {
  route = next;
  location.hash = next;
  render();
  scrollTo(0, 0);
}

function captureUtms() {
  const params = new URLSearchParams(location.search);
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    if (params.get(key)) state.utms[key] = params.get(key);
  }
  if (params.get('paid') === '1') route = 'access';
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
  return Number(state.weights[0]?.value || state.profile.weight || 0);
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

function routeAllowed() {
  return ['app', 'program', 'planner', 'recipes', 'coach', 'insights', 'progress', 'settings', 'legal', 'onboarding', 'plan', 'access'].includes(route);
}

async function init() {
  captureUtms();
  try {
    const response = await fetch('/api/config');
    if (response.ok) config = { ...config, ...await response.json() };
  } catch {}

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
          if (remoteResponse.ok && remote.state) {
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
    route = 'access';
  } else if (!state.onboarding) {
    route = 'onboarding';
  } else if (!routeAllowed() || route === 'access' || route === 'plan' || route === 'onboarding') {
    route = 'app';
  }

  saveState(false);
  render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
}

window.addEventListener('hashchange', () => {
  route = location.hash.replace('#', '') || 'app';
  if (!state.premium && !['access', 'legal'].includes(route)) route = 'access';
  if (state.premium && !state.onboarding && !['onboarding', 'plan', 'legal', 'access'].includes(route)) route = 'onboarding';
  if (!routeAllowed()) route = state.premium ? 'app' : 'access';
  render();
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  window.deferredInstall = event;
});

const onboardingSteps = [
  { key: 'goal', title: 'Quel est votre objectif principal ?', sub: 'NutriPilot adapte vos repères à cet objectif.', type: 'options', opts: [['lose', 'Perdre du poids', 'Progressivement et sans régime extrême'], ['maintain', 'Stabiliser mon poids', 'Mieux structurer mon alimentation'], ['gain', 'Prendre du poids', 'Avec une progression contrôlée']] },
  { key: 'sex', title: 'Quel sexe utiliser pour le calcul énergétique ?', sub: 'La formule énergétique de départ utilise ce paramètre biologique.', type: 'options', opts: [['female', 'Femme', 'Formule féminine'], ['male', 'Homme', 'Formule masculine'], ['other', 'Autre / préfère ne pas dire', 'Estimation intermédiaire']] },
  { key: 'age', title: 'Quel âge avez-vous ?', sub: 'NutriPilot est destiné aux adultes.', type: 'number', min: 18, max: 90, unit: 'ans' },
  { key: 'height', title: 'Quelle est votre taille ?', sub: 'En centimètres.', type: 'number', min: 130, max: 220, unit: 'cm' },
  { key: 'weight', title: 'Quel est votre poids actuel ?', sub: 'Vous pourrez le mettre à jour dans Progrès.', type: 'number', min: 35, max: 250, step: 0.1, unit: 'kg' },
  { key: 'target', title: 'Quel poids souhaitez-vous atteindre ?', sub: 'Choisissez un objectif cohérent avec votre direction.', type: 'number', min: 35, max: 250, step: 0.1, unit: 'kg' },
  { key: 'activity', title: 'À quoi ressemble votre activité ?', sub: 'Choisissez l’option la plus proche de votre semaine habituelle.', type: 'options', opts: [[1.2, 'Plutôt sédentaire', 'Peu d’activité structurée'], [1.375, 'Légèrement actif', '1–3 séances / semaine'], [1.55, 'Actif', '3–5 séances / semaine'], [1.725, 'Très actif', 'Activité fréquente']] },
  { key: 'speed', title: 'Quel rythme vous semble durable ?', sub: 'Pour la perte de poids, nous limitons les déficits agressifs.', type: 'options', opts: [[0.2, 'Très progressif', '≈ 0,2 kg / semaine'], [0.35, 'Progressif', '≈ 0,35 kg / semaine'], [0.5, 'Soutenu mais raisonnable', '≈ 0,5 kg / semaine']] },
  { key: 'diet', title: 'Quel style alimentaire vous convient ?', sub: 'Cela personnalise recettes et suggestions.', type: 'options', opts: [['balanced', 'Équilibré', 'Aucune règle spécifique'], ['vegetarian', 'Végétarien', 'Sans viande ni poisson'], ['pescatarian', 'Pescétarien', 'Poisson, sans viande'], ['mediterranean', 'Méditerranéen', 'Légumes, légumineuses, poisson'], ['high-protein', 'Riche en protéines', 'Priorité à la satiété']] },
  { key: 'allergies', title: 'Y a-t-il des aliments à éviter ?', sub: 'Allergies, intolérances ou préférences. Vérifiez toujours les étiquettes.', type: 'text', placeholder: 'Ex. arachides, lactose…' },
  { key: 'mealsPerDay', title: 'Combien de repas vous conviennent ?', sub: 'Le plan 7 jours suivra ce rythme.', type: 'options', opts: [[2, '2 repas', 'Très simple'], [3, '3 repas', 'Classique'], [4, '3 repas + collation', 'Plus flexible']] },
  { key: 'cooking', title: 'Combien de temps voulez-vous cuisiner ?', sub: 'Les recettes respecteront votre quotidien.', type: 'options', opts: [['<15 min', 'Moins de 15 min', 'Très rapide'], ['15-30 min', '15 à 30 min', 'Équilibre pratique'], ['30-45 min', '30 à 45 min', 'J’aime cuisiner']] },
  { key: 'challenge', title: 'Qu’est-ce qui vous bloque le plus ?', sub: 'Le tableau de bord mettra l’accent sur ce point.', type: 'options', opts: [['portions', 'Les portions', 'Je ne sais pas combien manger'], ['ideas', 'Les idées de repas', 'Je manque d’inspiration'], ['snacking', 'Les grignotages', 'Je perds le fil entre les repas'], ['consistency', 'La régularité', 'Je commence puis j’abandonne'], ['restaurant', 'Les repas à l’extérieur', 'Je ne sais pas quoi choisir']] },
  { key: 'cuisine', title: 'Quelles cuisines aimez-vous ?', sub: 'Votre plan doit donner envie d’être suivi.', type: 'options', opts: [['france', 'Française & familiale', 'Simple et accessible'], ['med', 'Méditerranéenne', 'Fraîche et colorée'], ['world', 'Cuisine du monde', 'Variété maximale'], ['simple', 'Très simple', 'Peu d’ingrédients']] },
  { key: 'budget', title: 'Quel budget cuisine vous convient ?', sub: 'Nous adaptons les idées au panier.', type: 'options', opts: [['economy', 'Économique', 'Produits simples'], ['standard', 'Standard', 'Équilibre prix / variété'], ['flexible', 'Flexible', 'Plus de liberté']] },
  { key: 'name', title: 'Comment devons-nous vous appeler ?', sub: 'Dernière étape.', type: 'text', placeholder: 'Votre prénom' },
];

function onboardingInput(step) {
  const value = onboardingState.data[step.key] ?? '';
  if (step.type === 'options') {
    return `<div class="options">${step.opts.map((option) => `
      <button class="option ${String(option[0]) === String(value) ? 'selected' : ''}" data-ob-value="${esc(option[0])}">
        <span>${esc(option[1])}</span><b>${esc(option[2])}</b>
      </button>`).join('')}</div>`;
  }
  if (step.type === 'number') {
    return `<div class="number-entry"><input class="input-big" id="ob-field" type="number" min="${step.min}" max="${step.max}" step="${step.step || 1}" value="${esc(value)}"><span class="unit">${esc(step.unit)}</span></div>`;
  }
  return `<input class="input-big text-input-big" id="ob-field" type="text" placeholder="${esc(step.placeholder || '')}" value="${esc(value)}">`;
}

function onboarding() {
  const step = onboardingSteps[onboardingState.step];
  const percent = ((onboardingState.step + 1) / onboardingSteps.length) * 100;
  return `<div class="onboard">
    <aside class="onboard-art">
      ${logo()}
      <div><span class="tag">PROGRAMME PERSONNALISÉ</span><h2>Votre objectif de poids.<br>Une direction concrète chaque jour.</h2></div>
      <div class="quote-card"><b>Simple devant. Puissant derrière.</b><p>Votre plan, vos repas, vos calories, votre progression et vos prochaines décisions restent connectés.</p></div>
    </aside>
    <main class="onboard-main">
      <div>${logo()}<div class="progress-steps"><i style="width:${percent}%"></i></div></div>
      <div class="question"><small>ÉTAPE ${onboardingState.step + 1} / ${onboardingSteps.length}</small><h1>${esc(step.title)}</h1><p>${esc(step.sub)}</p>${onboardingInput(step)}</div>
      <div class="nextbar"><button class="back" data-ob-back ${onboardingState.step === 0 ? 'style="visibility:hidden"' : ''}>← Retour</button><button class="btn btn-primary" data-ob-next>${onboardingState.step === onboardingSteps.length - 1 ? 'Créer mon programme' : 'Continuer →'}</button></div>
    </main>
  </div>`;
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

  return { ...p, bmr: Math.round(bmr), tdee: Math.round(tdee), bmi: +bmi.toFixed(1), dailyKcal: kcal, protein, carbs, fat, fiber, warning };
}

function planScreen() {
  const p = calculatePlan();
  const delta = Math.abs(Number(p.weight) - Number(p.target));
  const weeks = p.goal === 'lose' && p.speed ? Math.max(1, Math.round(delta / Number(p.speed))) : null;
  return `<div class="mobile-app">
    <div class="app-head"><div class="app-head-row">${logo()}<span class="pill premium-pill">Premium actif ✓</span></div></div>
    <div class="screen">
      <div class="program-ready"><span class="tag">VOTRE PROGRAMME</span><h1 class="screen-title">${esc(p.name || 'Votre plan')}, votre direction est prête.</h1><p class="screen-sub">Des repères indicatifs, personnalisables et conçus pour une progression raisonnable.</p></div>
      <div class="today-card goal-card">
        <small>Objectif énergétique quotidien estimé</small>
        <div class="hero-number">${fmt(p.dailyKcal)} <span>kcal</span></div>
        <div class="macro-row-4">
          <div><small>Protéines</small><b>${p.protein} g</b></div>
          <div><small>Glucides</small><b>${p.carbs} g</b></div>
          <div><small>Lipides</small><b>${p.fat} g</b></div>
          <div><small>Fibres</small><b>${p.fiber} g</b></div>
        </div>
        ${weeks ? `<div class="goal-note"><b>${fmt(delta, 1)} kg</b> entre votre point de départ et votre objectif · rythme choisi ≈ ${fmt(p.speed, 2)} kg/semaine.</div>` : ''}
      </div>
      ${p.warning ? `<div class="warn"><b>À noter.</b><br>${esc(p.warning)}</div>` : `<div class="success warn"><b>Votre programme reste flexible.</b><br>NutriPilot ajuste vos décisions, pas votre valeur. Corrigez les portions, gardez vos repas plaisir et regardez la tendance.</div>`}
      <div class="benefits feature-list">${['Scanner photo + texte + code-barres + étiquette', 'Plan alimentaire 7 jours + liste de courses', 'Recettes détaillées avec grammes et macros', '« Que manger ensuite ? » + mode frigo + restaurant', 'Coach IA contextualisé à votre vraie semaine', 'Poids, mensurations, bilan hebdomadaire et habitudes'].map((x) => `<div class="benefit"><span class="check">✓</span><b>${x}</b></div>`).join('')}</div>
      <button class="btn btn-lime btn-wide" data-activate>Entrer dans mon programme →</button>
    </div>
  </div>`;
}

function appHeader(title) {
  return `<div class="app-head"><div class="app-head-row"><div><div class="head-logo">${logo()}</div><small class="head-date">${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</small><h2>${esc(title)}</h2></div><div class="head-actions"><span class="pill premium-pill">Premium ✓</span><button class="icon-btn" data-go="settings" aria-label="Réglages">⚙</button></div></div></div>`;
}

function bottom(active) {
  const tabs = [
    ['app', '⌂', 'Aujourd’hui'],
    ['program', '◈', 'Programme'],
    ['add', '＋', 'Scanner'],
    ['coach', '✦', 'Coach'],
    ['progress', '↗', 'Progrès'],
  ];
  return `<nav class="bottom-nav">${tabs.map(([r, icon, label]) => `<button class="nav-btn ${r === active ? 'active' : ''} ${r === 'add' ? 'center' : ''}" ${r === 'add' ? 'data-open-add' : `data-go="${r}"`}><span>${icon}</span>${label}</button>`).join('')}</nav>`;
}

function macroStat(name, value, target) {
  const percent = clamp(value / Math.max(1, target) * 100, 0, 100);
  return `<div><div class="small-stat"><span>${esc(name)}</span><b>${fmt(value, 1)} / ${fmt(target)} g</b></div><div class="progress"><i style="width:${percent}%"></i></div></div>`;
}

function mealsHtml(meals) {
  if (!meals.length) return `<div class="empty">Aucun repas enregistré aujourd’hui.<br><b>Photo, texte, code-barres, recette ou favori : utilisez le moyen le plus rapide.</b></div>`;
  return `<div class="meal-list">${meals.map((meal) => `<button class="meal" data-meal="${esc(meal.id)}"><span class="meal-ico">${meal.icon || '🍽️'}</span><span><b>${esc(meal.title)}</b><small>${esc(meal.type || '')}${meal.total?.protein ? ` · ${fmt(meal.total.protein)} g prot.` : ''}</small></span><b>${fmt(meal.total?.kcal)} kcal</b></button>`).join('')}</div>`;
}

function dashboardInsight(t, p) {
  if (!t.kcal) return `<div class="insight"><strong>Commencez par votre prochain repas.</strong>Scannez, vérifiez les grammes, puis laissez NutriPilot adapter le reste de la journée.</div>`;
  const left = p.dailyKcal - t.kcal;
  const proteinLeft = p.protein - t.protein;
  if (left < 0) return `<div class="insight"><strong>Une journée ne décide pas de votre progression.</strong>Vous avez dépassé votre repère d’environ ${fmt(Math.abs(left))} kcal. Reprenez simplement votre structure habituelle au prochain repas.</div>`;
  if (proteinLeft > 35) return `<div class="insight"><strong>Priorité utile : protéines.</strong>Il vous reste environ ${fmt(proteinLeft)} g pour atteindre votre repère. « Que manger ensuite ? » peut proposer trois options adaptées.</div>`;
  return `<div class="insight"><strong>Vous êtes bien cadré aujourd’hui.</strong>Il reste environ ${fmt(left)} kcal. Utilisez le plan ou composez votre prochain repas selon votre envie.</div>`;
}

function dashboard() {
  const t = totals();
  const p = state.profile;
  const left = Math.max(0, p.dailyKcal - t.kcal);
  const percent = clamp(t.kcal / Math.max(1, p.dailyKcal) * 100, 0, 100);
  const water = waterToday();
  const current = lastWeight();
  const target = Number(p.target || current);
  const progress = progressPercent();
  const todayMeals = state.meals.filter((meal) => meal.day === todayKey()).slice().reverse();
  const checkin = state.checkins[todayKey()] || {};
  const dayPlan = state.weekPlan?.[0]?.meals || [];

  return `<div class="mobile-app">
    ${appHeader(`Bonjour ${p.name || ''} 👋`)}
    <div class="screen">
      <div class="today-card journey-card">
        <div class="today-top"><div><span class="tag dark-tag">OBJECTIF DE POIDS</span><h2>${fmt(current, 1)} kg <span>→</span> ${fmt(target, 1)} kg</h2></div><span class="pill dark-pill">${Math.round(progress)}%</span></div>
        <div class="journey-line"><i style="width:${progress}%"></i></div>
        <div class="journey-meta"><span>Départ ${fmt(startWeight(), 1)} kg</span><span>${fmt(Math.abs(current - target), 1)} kg jusqu’à l’objectif</span></div>
      </div>

      <button class="btn btn-lime btn-wide scan-main" data-add-tab="photo">📸 Scanner mon repas — analyse IA</button>

      <div class="today-card calories-card">
        <div class="today-top"><b>Aujourd’hui</b><span class="pill dark-pill">${fmt(left)} kcal restantes</span></div>
        <div class="today-main">
          <div class="big-ring" style="--p:${percent}%"><div><strong>${fmt(t.kcal)}</strong><small>/ ${fmt(p.dailyKcal)} kcal</small></div></div>
          <div class="small-stats">${macroStat('Protéines', t.protein, p.protein)}${macroStat('Glucides', t.carbs, p.carbs)}${macroStat('Lipides', t.fat, p.fat)}${macroStat('Fibres', t.fiber, p.fiber)}</div>
        </div>
      </div>

      <div class="action-grid">
        <button class="action-card primary" data-go="planner"><span class="aico">✦</span><b>Que manger ensuite ?</b><small>${fmt(left)} kcal à organiser</small></button>
        <button class="action-card" data-go="program"><span class="aico">▦</span><b>Plan 7 jours</b><small>${state.weekPlan.length ? 'Votre semaine est prête' : 'Créer ma semaine'}</small></button>
        <button class="action-card" data-go="recipes"><span class="aico">⌁</span><b>Recettes</b><small>${curatedRecipes.length} idées détaillées</small></button>
        <button class="action-card" data-go="insights"><span class="aico">↗</span><b>Analyse semaine</b><small>Score ${scoreDay()}/100</small></button>
      </div>

      <div class="section-label"><h3>Votre prochaine décision</h3><button class="link-btn" data-go="planner">Ouvrir →</button></div>
      ${dashboardInsight(t, p)}

      ${dayPlan.length ? `<div class="section-label"><h3>Repères de votre plan</h3><button class="link-btn" data-go="program">7 jours →</button></div><div class="day-card">${dayPlan.slice(0, 3).map((meal, index) => `<div class="plan-preview"><span><b>${esc(meal.type)}</b><small>${esc(meal.name)}</small></span><button class="pill pill-button" data-add-plan-meal data-day="0" data-meal="${index}">${fmt(meal.kcal)} kcal +</button></div>`).join('')}</div>` : ''}

      <div class="section-label"><h3>Repas aujourd’hui</h3><span class="streak">🔥 ${streak()} j</span></div>
      ${mealsHtml(todayMeals)}

      <div class="section-label"><h3>Hydratation</h3><span class="fine">repère pratique 2 L</span></div>
      <div class="water-card"><div class="water-row"><div><b>💧 ${fmt(water)} ml</b><div class="fine">Aujourd’hui</div></div><div class="water-actions"><button data-water="250">+250</button><button data-water="500">+500</button></div></div><div class="mini-bar"><i style="width:${clamp(water / 2000 * 100, 0, 100)}%"></i></div></div>

      <div class="section-label"><h3>Check-in rapide</h3><span class="fine">aide le bilan hebdo</span></div>
      <div class="checkin-card">
        <div><b>Faim</b><div class="checkin-buttons">${[['low','Faible'],['normal','Normale'],['high','Forte']].map(([v,l]) => `<button class="mini-choice ${checkin.hunger === v ? 'selected' : ''}" data-checkin="hunger" data-value="${v}">${l}</button>`).join('')}</div></div>
        <div><b>Énergie</b><div class="checkin-buttons">${[['low','Basse'],['normal','OK'],['high','Haute']].map(([v,l]) => `<button class="mini-choice ${checkin.energy === v ? 'selected' : ''}" data-checkin="energy" data-value="${v}">${l}</button>`).join('')}</div></div>
      </div>
    </div>
    ${bottom('app')}
  </div>`;
}

function planShopping() {
  const map = new Map();
  for (const day of state.weekPlan || []) {
    for (const meal of day.meals || []) {
      for (const raw of meal.ingredients || []) {
        const item = normalizeIngredient(raw);
        if (!item.name) continue;
        const key = foldText(item.name.trim());
        const previous = map.get(key) || { key, name: item.name, grams: 0, category: shoppingCategory(item.name) };
        previous.grams += Number(item.grams || 0);
        map.set(key, previous);
      }
    }
  }
  const order = ['Protéines', 'Légumes', 'Fruits', 'Féculents', 'Produits laitiers / alternatives', 'Divers'];
  return [...map.values()].sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category) || a.name.localeCompare(b.name, 'fr'));
}

function shoppingListHtml(items = []) {
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.category)) groups.set(item.category, []);
    groups.get(item.category).push(item);
  }
  return [...groups.entries()].map(([category, list]) => `<div class="shopping-group"><h4>${esc(category)}</h4>${list.map((item) => `<label><input type="checkbox" data-shop="${esc(item.key)}" ${state.shoppingChecked[item.key] ? 'checked' : ''}><span>${esc(item.name)}</span><b>${item.grams ? `${fmt(item.grams)} g` : ''}</b></label>`).join('')}</div>`).join('');
}

function weekPlanHtml() {
  return `<div class="week-plan">${state.weekPlan.map((day, dayIndex) => {
    const dayKcal = (day.meals || []).reduce((sum, meal) => sum + Number(meal.kcal || 0), 0);
    return `<details class="day-card" ${dayIndex === 0 ? 'open' : ''}><summary>${esc(day.day)} <span>${fmt(dayKcal)} kcal</span></summary><div class="day-meals">${(day.meals || []).map((meal, mealIndex) => `
      <div class="plan-meal">
        <div class="plan-meal-top"><div><b>${esc(meal.type)}</b><small>${esc(meal.name)}</small></div><span class="pill">${fmt(meal.kcal)} kcal</span></div>
        <div class="meal-macro-line"><span>P ${fmt(meal.protein)} g</span><span>G ${fmt(meal.carbs)} g</span><span>L ${fmt(meal.fat)} g</span><span>Fibres ${fmt(meal.fiber)} g</span></div>
        ${meal.ingredients?.length ? `<div class="ingredient-preview">${meal.ingredients.slice(0, 5).map((x) => { const i = normalizeIngredient(x); return `<span>${esc(i.name)}${i.grams ? ` ${fmt(i.grams)} g` : ''}</span>`; }).join('')}</div>` : ''}
        <div class="inline-actions"><button class="link-btn" data-add-plan-meal data-day="${dayIndex}" data-meal="${mealIndex}">＋ Journal</button><button class="link-btn" data-plan-recipe data-day="${dayIndex}" data-meal="${mealIndex}">Voir recette</button><button class="link-btn" data-swap-plan data-day="${dayIndex}" data-meal="${mealIndex}">Remplacer</button></div>
      </div>`).join('')}</div></details>`;
  }).join('')}</div>`;
}

function weeklyReviewHtml() {
  const review = state.weekReview || {};
  return `<div class="day-card weekly-review"><h3>${esc(review.headline || 'Votre semaine')}</h3>${review.wins?.length ? `<div class="review-block"><b>Ce qui fonctionne</b>${review.wins.map((x) => `<p>✓ ${esc(x)}</p>`).join('')}</div>` : ''}${review.focus?.length ? `<div class="review-block"><b>Priorités</b>${review.focus.map((x) => `<p>→ ${esc(x)}</p>`).join('')}</div>` : ''}${review.nextWeek ? `<div class="insight"><strong>Prochaine semaine</strong>${esc(review.nextWeek)}</div>` : ''}</div>`;
}

function program() {
  const p = state.profile;
  const delta = Math.abs(Number(lastWeight()) - Number(p.target));
  const weeks = p.goal === 'lose' && p.speed ? Math.max(1, Math.round(delta / Number(p.speed))) : null;
  const shopping = planShopping();
  return `<div class="mobile-app">
    ${appHeader('Mon programme')}
    <div class="screen">
      <span class="tag">DIRECTION PERSONNALISÉE</span>
      <h1 class="screen-title">Votre feuille de route.</h1>
      <p class="screen-sub">Objectif de poids, plan alimentaire, recettes, liste de courses et ajustements quotidiens réunis au même endroit.</p>

      <div class="today-card program-card">
        <div class="today-top"><div><small>Poids actuel → objectif</small><h2>${fmt(lastWeight(), 1)} kg → ${fmt(p.target, 1)} kg</h2></div><span class="pill dark-pill">${weeks ? `≈ ${weeks} sem.` : 'Flexible'}</span></div>
        <div class="macro-row-4 program-macros"><div><small>Calories</small><b>${fmt(p.dailyKcal)}</b></div><div><small>Protéines</small><b>${p.protein} g</b></div><div><small>Fibres</small><b>${p.fiber} g</b></div><div><small>Repas</small><b>${p.mealsPerDay}/j</b></div></div>
        ${Math.abs(Number(lastWeight()) - Number(p.weight || lastWeight())) >= 1.5 ? `<div class="recalibrate-box"><span>Votre poids a évolué depuis le dernier calcul.</span><button class="link-btn" data-recalibrate>Actualiser mes repères →</button></div>` : ''}
      </div>

      <div class="section-label"><h3>Votre système</h3></div>
      <div class="roadmap-grid"><div><span>1</span><b>Mesurer</b><small>Scanner et corriger</small></div><div><span>2</span><b>Décider</b><small>Adapter le prochain repas</small></div><div><span>3</span><b>Répéter</b><small>Suivre la tendance</small></div></div>

      <div class="section-label"><h3>Plan alimentaire 7 jours</h3><span class="fine">adapté à vos préférences</span></div>
      ${state.weekPlan?.length ? weekPlanHtml() : `<div class="day-card"><h3>Créez votre première semaine.</h3><p class="screen-sub">NutriPilot utilise votre objectif, calories, protéines, préférences, allergies, budget et temps de cuisine.</p><button class="btn btn-primary btn-wide" data-generate-week>Créer mon plan 7 jours →</button></div>`}
      ${state.weekPlan?.length ? `<button class="btn btn-ghost btn-wide" data-generate-week>↻ Régénérer ma semaine</button>` : ''}

      <div class="section-label"><h3>Recettes NutriPilot</h3><button class="link-btn" data-go="recipes">Voir tout →</button></div>
      <div class="recipe-strip">${curatedRecipes.slice(0, 4).map(recipeMiniCard).join('')}</div>

      ${shopping.length ? `<div class="section-label"><h3>Liste de courses</h3><span class="fine">${shopping.length} ingrédients</span></div><div class="day-card shopping-list">${shoppingListHtml(shopping)}</div>` : ''}

      <div class="section-label"><h3>Bilan hebdomadaire</h3><span class="fine">vos données → 3 priorités</span></div>
      ${state.weekReview ? weeklyReviewHtml() : `<button class="btn btn-ghost btn-wide" data-week-review>Analyser mes 7 derniers jours →</button>`}
    </div>
    ${bottom('program')}
  </div>`;
}

function recipeMiniCard(recipe) {
  return `<button class="recipe-mini" data-recipe-id="${esc(recipe.id)}"><span>${esc(recipe.category)}</span><b>${esc(recipe.name)}</b><small>${recipe.kcal} kcal · ${recipe.protein} g prot. · ${esc(recipe.prep)}</small></button>`;
}

function recipesScreen() {
  const favoriteSet = new Set(state.recipeFavorites || []);
  return `<div class="mobile-app">
    ${appHeader('Recettes')}
    <div class="screen">
      <span class="tag">BIBLIOTHÈQUE NUTRIPILOT</span>
      <h1 class="screen-title">Des repas qui donnent envie d’être suivis.</h1>
      <p class="screen-sub">Recettes avec grammes, calories, macros, fibres et préparation. Ajustez ensuite les portions selon votre journée.</p>
      <div class="recipe-filter-row"><button class="mini-choice selected" data-recipe-filter="all">Toutes</button><button class="mini-choice" data-recipe-filter="quick">Rapides</button><button class="mini-choice" data-recipe-filter="protein">Protéinées</button><button class="mini-choice" data-recipe-filter="veg">Végétariennes</button><button class="mini-choice" data-recipe-filter="fav">Favoris</button></div>
      <div id="recipe-grid" class="recipe-grid">${recipeGridHtml('all', favoriteSet)}</div>
    </div>
    ${bottom('program')}
  </div>`;
}

function recipeGridHtml(filter = 'all', favoriteSet = new Set()) {
  let list = curatedRecipes.slice();
  if (filter === 'quick') list = list.filter((r) => Number.parseInt(r.prep) <= 18);
  if (filter === 'protein') list = list.filter((r) => r.protein >= 35);
  if (filter === 'veg') list = list.filter((r) => r.tags.includes('végétarien'));
  if (filter === 'fav') list = list.filter((r) => favoriteSet.has(r.id));
  return list.map((r) => `<article class="recipe-card"><div class="recipe-card-top"><span class="pill">${esc(r.category)}</span><button class="heart ${favoriteSet.has(r.id) ? 'active' : ''}" data-fav-recipe="${esc(r.id)}">♡</button></div><h3>${esc(r.name)}</h3><div class="recipe-stats"><span>${r.kcal} kcal</span><span>${r.protein} g prot.</span><span>${r.fiber} g fibres</span></div><small>${esc(r.prep)} · ${esc(r.difficulty)}</small><button class="btn btn-ghost btn-wide" data-recipe-id="${esc(r.id)}">Voir la recette</button></article>`).join('') || `<div class="empty">Aucune recette dans ce filtre.</div>`;
}

function planner() {
  const t = totals();
  const p = state.profile;
  const left = Math.max(180, p.dailyKcal - t.kcal);
  const proteinLeft = Math.max(0, Math.round(p.protein - t.protein));
  const fiberLeft = Math.max(0, Math.round(p.fiber - t.fiber));
  return `<div class="mobile-app">
    ${appHeader('Prochain repas')}
    <div class="screen">
      <span class="tag">DÉCISION INTELLIGENTE</span>
      <h1 class="screen-title">Que manger ensuite ?</h1>
      <p class="screen-sub">Votre journée réelle devient le point de départ. Gardez vos envies et adaptez le reste.</p>
      <div class="compose-card"><small>Budget restant estimé</small><div class="compose-number">${fmt(left)} kcal</div><div class="compose-meta">≈ ${proteinLeft} g protéines · ${fiberLeft} g fibres restantes</div></div>

      <div class="planner-mode-grid">
        <button class="planner-mode active" data-planner-mode="next"><span>✦</span><b>Prochain repas</b><small>3 options adaptées</small></button>
        <button class="planner-mode" data-planner-mode="fridge"><span>⌂</span><b>Mon frigo</b><small>Utiliser ce que j’ai</small></button>
        <button class="planner-mode" data-planner-mode="restaurant"><span>◌</span><b>Restaurant</b><small>Choisir sans deviner</small></button>
        <button class="planner-mode" data-planner-mode="pleasure"><span>♡</span><b>Repas plaisir</b><small>Garder l’envie</small></button>
      </div>

      <div id="planner-panel">${plannerPanel('next', left, proteinLeft)}</div>
    </div>
    ${bottom('')}
  </div>`;
}

function plannerPanel(mode, left, proteinLeft) {
  const p = state.profile;
  if (mode === 'fridge') return `<div class="day-card planner-panel"><h3>Que pouvez-vous cuisiner avec ce que vous avez ?</h3><p class="screen-sub">Listez quelques ingrédients. NutriPilot cherchera à utiliser en priorité ce qui est déjà chez vous.</p><div class="field"><label>Dans mon frigo / placard</label><textarea class="textarea compact" id="fridge-input" placeholder="Ex. poulet, courgettes, riz, tomates, yaourt…"></textarea></div><button class="btn btn-primary btn-wide" data-fridge data-remaining="${left}">Créer 3 repas avec ça →</button><div id="fridge-results"></div></div>`;
  if (mode === 'restaurant') return `<div class="day-card planner-panel"><h3>Je mange à l’extérieur.</h3><p class="screen-sub">Indiquez le type de restaurant, une enseigne ou le plat qui vous tente. Sans données officielles, NutriPilot ne prétend pas connaître les calories exactes.</p><div class="field"><label>Où / quoi ?</label><input id="restaurant-input" placeholder="Ex. restaurant italien, burger, sushi…"></div><button class="btn btn-primary btn-wide" data-restaurant data-remaining="${left}">M’aider à choisir →</button><div id="restaurant-results"></div></div>`;
  if (mode === 'pleasure') return `<div class="day-card planner-panel"><h3>Gardez le repas que vous voulez.</h3><p class="screen-sub">NutriPilot propose des adaptations possibles sans transformer un repas plaisir en punition.</p><div class="field"><label>Repas à adapter</label><input id="swap-meal" placeholder="Ex. pizza 4 fromages, burger-frites…"></div><button class="btn btn-primary btn-wide" data-smart-swap data-remaining="${left}">Adapter ce repas à ma journée →</button><div id="swap-results"></div></div>`;
  return `<div class="day-card planner-panel"><div class="field"><label>Une envie particulière ?</label><input id="craving" placeholder="Ex. pâtes, burger, quelque chose de frais…"></div><div class="field"><label>Style</label><select id="preference"><option value="${esc(p.diet)}">Ma préférence habituelle</option><option value="protein">Riche en protéines</option><option value="quick">Rapide</option><option value="vegetarian">Végétarien</option><option value="light">Léger</option></select></div><button class="btn btn-primary btn-wide" data-compose data-remaining="${left}" data-protein-left="${proteinLeft}">Générer 3 options adaptées →</button><div id="compose-results"></div></div>`;
}

function suggestionHtml(options = []) {
  return `<div class="suggestion-list">${options.map((s) => `<article class="suggestion"><div class="suggestion-top"><h3>${esc(s.name)}</h3><span class="pill">${fmt(s.kcal)} kcal</span></div><p>${esc(s.why || s.tip || '')}</p>${s.ingredients?.length ? `<div class="ingredients">${s.ingredients.map((x) => `<span class="chip">${esc(typeof x === 'string' ? x : x.name)}</span>`).join('')}</div>` : ''}<div class="nutrition-line"><div><b>${fmt(s.kcal)}</b>kcal</div><div><b>${fmt(s.protein)}</b>prot.</div><div><b>${fmt(s.carbs)}</b>gluc.</div><div><b>${fmt(s.fiber)}</b>fibres</div></div>${s.prep ? `<div class="fine prep-line">⏱ ${esc(s.prep)}</div>` : ''}<button class="btn btn-ghost btn-wide" data-add-suggestion='${esc(JSON.stringify(s))}'>Ajouter au journal</button></article>`).join('')}</div>`;
}

function coachScreen() {
  const p = state.profile;
  const quick = ['Que manger avec mes calories restantes ?', 'Je veux une pizza ce soir.', 'Comment augmenter mes protéines ?', 'Analyse ma semaine.'];
  return `<div class="mobile-app">
    ${appHeader('Coach')}
    <div class="screen">
      <span class="tag">COACH CONTEXTUEL</span>
      <h1 class="screen-title">Il connaît votre journée.</h1>
      <p class="screen-sub">NutriPilot utilise vos repères, vos repas récents et votre progression pour répondre avec contexte.</p>
      <div class="quick-prompts">${quick.map((q) => `<button data-quick-coach="${esc(q)}">${esc(q)}</button>`).join('')}</div>
      <div class="chat" id="chat">${state.coach.length ? state.coach.slice(-18).map((m) => `<div class="bubble ${m.role === 'user' ? 'user' : 'ai'}">${esc(m.text)}</div>`).join('') : `<div class="bubble ai">Bonjour ${esc(p.name || '')} 👋 Je peux relier votre objectif, vos repas et ce qu’il vous reste aujourd’hui.</div>`}</div>
      <div class="chatbar"><input id="coach-input" placeholder="Posez votre question…"><button class="btn btn-primary" data-coach-send>→</button></div>
      <div class="fine">Conseils généraux uniquement. Une situation médicale, grossesse, trouble alimentaire, traitement ou symptôme nécessite un professionnel adapté.</div>
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
      <span class="tag">7 DERNIERS JOURS</span>
      <h1 class="screen-title">La tendance, pas la perfection.</h1>
      <div class="kpi-grid"><div class="kpi"><small>Moyenne</small><b>${fmt(avg)} kcal</b></div><div class="kpi"><small>Protéines moy.</small><b>${fmt(avgProtein)} g</b></div><div class="kpi"><small>Jours suivis</small><b>${logged.length}/7</b></div><div class="kpi"><small>Régularité</small><b>${adherence}%</b></div></div>
      <div class="section-label"><h3>Votre semaine</h3></div>
      ${data.map((d) => `<div class="day-card"><div class="day-top"><div><b>${dateLabel(d.day)}</b><div class="fine">${fmt(d.protein)} g prot. · ${fmt(d.fiber)} g fibres · ${fmt(d.water)} ml</div></div><b>${fmt(d.kcal)} kcal</b></div><div class="mini-bar"><i style="width:${clamp(d.kcal / Math.max(1, p.dailyKcal) * 100, 0, 100)}%"></i></div></div>`).join('')}
      <div class="section-label"><h3>Lecture simple</h3></div>${weeklyInsight(data, p)}
      <button class="btn btn-primary btn-wide" data-week-review>Créer mon bilan IA →</button>
      ${state.weekReview ? `<div style="margin-top:12px">${weeklyReviewHtml()}</div>` : ''}
      <div class="section-label"><h3>Badges</h3></div>${achievements()}
    </div>
    ${bottom('')}
  </div>`;
}

function weeklyInsight(data, p) {
  const logged = data.filter((x) => x.kcal);
  if (logged.length < 2) return `<div class="insight"><strong>Encore un peu de données.</strong>Avec 2–3 jours suivis, NutriPilot commencera à distinguer des tendances utiles.</div>`;
  const proteinDays = logged.filter((x) => x.protein >= p.protein * 0.85).length;
  const fiberDays = logged.filter((x) => x.fiber >= p.fiber * 0.8).length;
  return `<div class="insight"><strong>${proteinDays >= logged.length / 2 ? 'Votre structure protéique prend forme.' : 'La protéine est votre levier le plus clair.'}</strong>${proteinDays}/${logged.length} jours proches du repère protéines · ${fiberDays}/${logged.length} jours proches du repère fibres. Utilisez ces tendances pour simplifier la prochaine semaine.</div>`;
}

function achievements() {
  const values = [
    ['🥇', 'Premier repas', state.meals.length >= 1],
    ['📸', '5 scans', state.scanCount >= 5],
    ['🔥', 'Série 3 jours', streak() >= 3],
    ['🏆', 'Série 7 jours', streak() >= 7],
    ['🗓️', 'Plan 7 jours', state.weekPlan.length >= 7],
    ['♡', '3 recettes favorites', state.recipeFavorites.length >= 3],
  ];
  return `<div class="achievement-grid">${values.map(([icon, label, unlocked]) => `<div class="achievement ${unlocked ? '' : 'locked'}"><span>${icon}</span><b>${label}</b></div>`).join('')}</div>`;
}

function chartPoints(values) {
  if (!values.length) return [];
  const min = Math.min(...values.map((v) => Number(v.value))) - 0.8;
  const max = Math.max(...values.map((v) => Number(v.value))) + 0.8;
  const range = Math.max(0.5, max - min);
  return values.map((v, i) => ({ x: 20 + i * (300 / Math.max(1, values.length - 1)), y: 155 - (Number(v.value) - min) / range * 125 }));
}

function progressScreen() {
  if (!state.weights.length) state.weights = [{ day: todayKey(), value: Number(state.profile.weight) }];
  const values = state.weights.slice(-16);
  const points = chartPoints(values);
  const start = Number(values[0]?.value || 0);
  const end = Number(values.at(-1)?.value || 0);
  const target = Number(state.profile.target || end);
  const remaining = Math.abs(end - target);
  const waistStart = Number(state.waist[0]?.value || 0);
  const waistEnd = Number(state.waist.at(-1)?.value || 0);
  const recentCutoff = addDays(-6);
  const recentWeights = values.filter((item) => String(item.day || '') >= recentCutoff);
  const weeklyAverage = recentWeights.length ? recentWeights.reduce((sum, item) => sum + Number(item.value || 0), 0) / recentWeights.length : end;
  return `<div class="mobile-app">
    ${appHeader('Progression')}
    <div class="screen">
      <span class="tag">VOTRE TRAJECTOIRE</span>
      <h1 class="screen-title">Regardez la tendance.</h1>
      <p class="screen-sub">Une mesure isolée bouge. Votre trajectoire sur plusieurs semaines raconte davantage.</p>
      <div class="progress-hero"><div><small>Poids actuel</small><b>${fmt(end, 1)} kg</b></div><div><small>Objectif</small><b>${fmt(target, 1)} kg</b></div><div><small>Restant</small><b>${fmt(remaining, 1)} kg</b></div></div>
      <div class="chart"><svg viewBox="0 0 340 180" preserveAspectRatio="none"><path d="${points.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ')}"></path>${points.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="5"></circle>`).join('')}</svg></div>
      <div class="kpi-grid"><div class="kpi"><small>Évolution enregistrée</small><b>${end - start > 0 ? '+' : ''}${fmt(end - start, 1)} kg</b></div><div class="kpi"><small>Moyenne 7 jours</small><b>${fmt(weeklyAverage, 1)} kg</b></div><div class="kpi"><small>Tour de taille</small><b>${waistEnd ? `${waistEnd - waistStart > 0 ? '+' : ''}${fmt(waistEnd - waistStart, 1)} cm` : '—'}</b></div></div>
      <div class="day-card"><h3>Ajouter une mesure</h3><div class="field"><label>Poids aujourd’hui</label><input id="weight-now" type="number" step=".1" min="30" max="300" value="${fmt(end, 1).replace(',', '.')}"></div><div class="field"><label>Tour de taille (optionnel)</label><input id="waist-now" type="number" step=".1" min="40" max="200" placeholder="cm"></div><button class="btn btn-primary btn-wide" data-save-progress>Enregistrer</button></div>
      <div class="insight"><strong>Ne corrigez pas votre alimentation sur une seule pesée.</strong>Eau, sel, digestion, sommeil et cycle peuvent déplacer le poids sans refléter une variation équivalente de masse grasse.</div>
    </div>
    ${bottom('progress')}
  </div>`;
}

function settings() {
  return `<div class="mobile-app">
    <div class="app-head"><div class="app-head-row"><button class="icon-btn" data-go="app">←</button><h2>Réglages</h2><span></span></div></div>
    <div class="screen">
      <div class="success warn"><b>NutriPilot Premium actif ✓</b><br>${esc(state.premiumEmail || 'Accès activé')} ${state.subscriptionPlan ? `· formule ${esc(state.subscriptionPlan)}` : ''}</div>
      <div class="kpi settings-goal"><small>Votre objectif quotidien</small><b>${fmt(state.profile.dailyKcal)} kcal</b><div class="fine">P ${state.profile.protein} g · G ${state.profile.carbs} g · L ${state.profile.fat} g · Fibres ${state.profile.fiber} g</div></div>
      <button class="btn btn-primary btn-wide" data-start>🎯 Recalculer mon programme</button>
      <div class="section-label"><h3>Abonnement</h3></div>
      ${config.manageSubscriptionUrl ? `<a class="btn btn-ghost btn-wide" href="${esc(config.manageSubscriptionUrl)}" target="_blank" rel="noopener">Gérer mon abonnement Hotmart</a>` : ''}
      <div class="section-label"><h3>Données & appareil</h3></div>
      <button class="btn btn-ghost btn-wide" data-export>Exporter mes données (.json)</button>
      <button class="btn btn-ghost btn-wide" data-install>Ajouter NutriPilot à l’écran d’accueil</button>
      <button class="btn btn-ghost btn-wide" data-go="legal">Confidentialité & informations</button>
      <button class="btn btn-ghost btn-wide" data-logout>Se déconnecter</button>
      <button class="btn btn-danger-soft btn-wide" data-delete-data>Supprimer mes données NutriPilot</button>
      <div class="fine center-fine">La suppression des données NutriPilot ne résilie pas votre abonnement Hotmart.</div>
    </div>
  </div>`;
}

function legal() {
  const legalInfo = config.legal || {};
  return `<div class="mobile-app"><div class="app-head"><div class="app-head-row"><button class="icon-btn" data-go="${state.premium ? 'settings' : 'access'}">←</button><h2>Informations</h2><span></span></div></div><div class="screen"><h1 class="screen-title">Transparence</h1><div class="day-card"><h3>Nature du service</h3><p class="screen-sub">${esc(config.brand)} est un outil général de suivi nutritionnel et de bien-être. Les calories, grammes, portions et macros restent des estimations lorsqu’ils ne proviennent pas de données mesurées.</p></div><div class="day-card"><h3>Scanner photo</h3><p class="screen-sub">Une photo ne pèse pas un aliment. NutriPilot affiche des estimations et vous permet de corriger les grammes avant enregistrement.</p></div><div class="day-card"><h3>Abonnement</h3><p class="screen-sub">La durée, le prix, le renouvellement, les taxes et les conditions d’annulation sont présentés sur le checkout Hotmart.</p></div><div class="day-card"><h3>Éditeur</h3><p class="screen-sub"><b>${esc(legalInfo.company || 'À compléter')}</b><br>${esc(legalInfo.address || 'Adresse à compléter')}<br>${esc(legalInfo.id || 'Identifiant à compléter')}<br>Support : ${esc(config.supportEmail)}</p></div></div></div>`;
}

function access() {
  return `<div class="mobile-app access-shell">
    <div class="app-head"><div class="app-head-row">${logo()}<span class="pill">Espace privé</span></div></div>
    <div class="screen">
      <div class="access-hero"><span class="tag">NUTRIPILOT PREMIUM</span><h1>Votre programme est réservé aux clients.</h1><p>Utilisez l’e-mail de votre achat Hotmart pour recevoir votre code d’accès sécurisé.</p></div>
      <div class="access-benefits"><div>📸 <b>Scanner IA</b><span>photo, texte, étiquette et code-barres</span></div><div>▦ <b>Plan personnalisé</b><span>7 jours, recettes et liste de courses</span></div><div>✦ <b>Décisions intelligentes</b><span>prochain repas, frigo, restaurant, coach</span></div><div>↗ <b>Progression</b><span>poids, tendances et bilan hebdomadaire</span></div></div>
      <div class="access-card"><h3>Déverrouiller mon accès</h3><div class="field"><label>E-mail utilisé lors de l’achat</label><input id="access-email" type="email" autocomplete="email" placeholder="vous@exemple.fr" value="${esc(state.premiumEmail || '')}"></div><button class="btn btn-primary btn-wide" data-request-code>Recevoir mon code sécurisé</button><div id="code-area" style="display:none"><div class="field"><label>Code à 6 chiffres</label><input id="access-code" class="code-input" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="000000"></div><button class="btn btn-lime btn-wide" data-verify-code>Entrer dans NutriPilot →</button></div><div id="access-msg"></div></div>
      <div class="fine center-fine">Vous n’avez pas encore NutriPilot ?</div>
      <a class="btn btn-ghost btn-wide" href="${esc(config.salesUrl || 'https://atlasevermore.com/#tarifs')}">Découvrir le programme →</a>
      <div class="warn"><b>Besoin d’aide ?</b><br>${esc(config.supportEmail)}</div>
    </div>
  </div>`;
}

function openAdd(tab = 'photo') {
  modal = { type: 'add', tab, result: null, loading: false, mealType: mealTypeFromHour() };
  renderModal();
}

function renderModal() {
  document.querySelector('.modal-wrap')?.remove();
  if (!modal) return;
  const wrap = document.createElement('div');
  wrap.className = 'modal-wrap';
  wrap.innerHTML = `<div class="sheet"><div class="sheet-grip"></div>${modal.type === 'meal' ? mealSheet(modal.meal) : modal.type === 'recipe' ? recipeSheet(modal.recipe) : modal.type === 'plan-recipe' ? planRecipeSheet() : addSheet()}</div>`;
  document.body.appendChild(wrap);
  bindModal(wrap);
}

function addSheet() {
  if (modal.loading) return `<div class="loader"><div class="loader-dots"><i></i><i></i><i></i></div><h3>Analyse en cours…</h3><p>NutriPilot identifie les aliments, estime les portions et prépare les données modifiables.</p></div>`;
  if (modal.result) return resultSheet(modal.result);
  const tabs = [['photo','Photo'],['text','Texte / voix'],['barcode','Code-barres'],['label','Étiquette'],['manual','Manuel'],['favorites','Favoris']];
  return `<div class="sheet-head"><div><span class="tag">AJOUTER UN REPAS</span><h2>Choisissez la méthode.</h2></div><button class="icon-btn" data-close>×</button></div><div class="tabs">${tabs.map(([key, label]) => `<button class="tab ${modal.tab === key ? 'active' : ''}" data-mtab="${key}">${label}</button>`).join('')}</div>${addTab(modal.tab)}`;
}

const localFood = [
  ['Œuf',143,12.6,.7,9.5,0], ['Pain complet',247,13,41,4.2,7], ['Avocat',160,2,8.5,14.7,6.7], ['Poulet grillé',165,31,0,3.6,0], ['Riz cuit',130,2.7,28,.3,.4], ['Pâtes cuites',158,5.8,31,.9,1.8], ['Saumon',208,20,0,13,0], ['Thon au naturel',116,26,0,1,0], ['Skyr',63,11,4,.2,0], ['Yaourt grec',97,9,3.9,5,0], ['Banane',89,1.1,23,.3,2.6], ['Pomme',52,.3,14,.2,2.4], ['Lentilles cuites',116,9,20,.4,8], ['Quinoa cuit',120,4.4,21,1.9,2.8], ['Brocoli',35,2.4,7.2,.4,3.3], ['Patate douce cuite',90,2,21,.2,3.3],
];

function addTab(tab) {
  if (tab === 'photo' || tab === 'label') return `<label class="upload"><input id="meal-image" type="file" accept="image/*" capture="environment"><div class="camera-ico">${tab === 'label' ? '▤' : '📸'}</div><h3>${tab === 'label' ? 'Photographier l’étiquette' : 'Photographier mon repas'}</h3><p>${tab === 'label' ? 'Cadrez les valeurs nutritionnelles et la portion.' : 'Une photo donne une estimation. Vous pourrez corriger chaque quantité avant de l’enregistrer.'}</p><span class="btn btn-primary">Choisir une photo</span></label>`;
  if (tab === 'text') return `<div class="field"><label>Décrivez votre repas</label><textarea class="textarea" id="meal-text" placeholder="Ex. 150 g de poulet, 120 g de riz, courgettes et 1 c. à café d’huile d’olive"></textarea></div><div class="inline-actions"><button class="voice-btn" data-voice>🎙 Dicter</button><button class="btn btn-primary" data-analyze-text>Analyser →</button></div>`;
  if (tab === 'barcode') return `<div class="day-card"><h3>Produit emballé</h3><p class="screen-sub">Entrez les 8 à 14 chiffres du code-barres. Les données disponibles proviennent d’Open Food Facts et restent à vérifier sur l’emballage.</p><div class="field"><label>Code-barres</label><input id="barcode" inputmode="numeric" placeholder="Ex. 3017620422003"></div><button class="btn btn-primary btn-wide" data-barcode>Rechercher →</button></div>`;
  if (tab === 'manual') return `<div class="field"><label>Rechercher un aliment</label><input id="manual-search" placeholder="Ex. poulet, riz, skyr…"></div><div id="manual-list" class="manual-list">${manualResults('')}</div>`;
  if (tab === 'favorites') return state.favorites.length ? `<div class="manual-list">${state.favorites.map((fav, i) => `<button class="manual-item" data-fav="${i}"><span><b>${esc(fav.title)}</b><small>${fmt(fav.total?.kcal)} kcal</small></span><b>→</b></button>`).join('')}</div>` : `<div class="empty">Aucun favori. Enregistrez un repas analysé comme favori pour le retrouver ici.</div>`;
  return '';
}

function manualResults(query = '') {
  const q = query.trim().toLowerCase();
  return localFood.filter((x) => !q || x[0].toLowerCase().includes(q)).slice(0, 12).map((food) => `<button class="manual-item" data-manual='${esc(JSON.stringify(food))}'><span><b>${esc(food[0])}</b><small>${food[1]} kcal / 100 g</small></span><b>＋</b></button>`).join('');
}

function foodEdit(food, index) {
  const grams = Number(food.grams || 100);
  return `<div class="food-edit" data-fi="${index}" data-baseg="${grams}" data-k="${Number(food.kcal || 0)}" data-p="${Number(food.protein || 0)}" data-c="${Number(food.carbs || 0)}" data-f="${Number(food.fat || 0)}" data-fi-val="${Number(food.fiber || 0)}" data-sugar="${food.sugar == null ? '' : Number(food.sugar)}" data-sat="${food.satFat == null ? '' : Number(food.satFat)}" data-salt="${food.salt == null ? '' : Number(food.salt)}"><div class="food-edit-top"><div><b>${esc(food.name)}</b><small>${Math.round((food.confidence || 0.7) * 100)}% confiance</small></div><label><input type="number" min="1" max="3000" step="1" value="${grams}" data-grams> g</label></div><div class="food-macros"><span class="chip" data-item-kcal>${fmt(food.kcal)} kcal</span><span class="chip" data-item-protein>P ${fmt(food.protein, 1)} g</span><span class="chip" data-item-carbs>G ${fmt(food.carbs, 1)} g</span><span class="chip" data-item-fat>L ${fmt(food.fat, 1)} g</span><span class="chip" data-item-fiber>Fibres ${fmt(food.fiber, 1)} g</span></div></div>`;
}

function resultSheet(result) {
  const range = result.range || { min: Math.round(result.total.kcal * 0.9), max: Math.round(result.total.kcal * 1.1) };
  return `<div class="sheet-head"><div><span class="confidence">≈ ${Math.round((result.confidence || 0.7) * 100)}% confiance</span><h2>${esc(result.title || 'Repas analysé')}</h2></div><button class="icon-btn" data-close>×</button></div>
    <div class="result-total"><div><small>Estimation centrale</small><strong id="result-kcal">${fmt(result.total.kcal)}</strong> kcal<div class="range">Fourchette initiale ≈ ${fmt(range.min)}–${fmt(range.max)} kcal</div></div><div class="result-macros"><span><b id="result-p">${fmt(result.total.protein, 1)}</b>P</span><span><b id="result-c">${fmt(result.total.carbs, 1)}</b>G</span><span><b id="result-f">${fmt(result.total.fat, 1)}</b>L</span><span><b id="result-fi">${fmt(result.total.fiber, 1)}</b>Fibres</span></div></div>
    <div class="extended-nutrition" id="extended-nutrition">${extendedNutritionHtml(result.total)}</div>
    <div class="field"><label>Type de repas</label><select id="meal-type"><option ${modal.mealType === 'Petit-déjeuner' ? 'selected' : ''}>Petit-déjeuner</option><option ${modal.mealType === 'Déjeuner' ? 'selected' : ''}>Déjeuner</option><option ${modal.mealType === 'Dîner' ? 'selected' : ''}>Dîner</option><option ${modal.mealType === 'Collation' ? 'selected' : ''}>Collation</option></select></div>
    <div class="section-label"><h3>Vérifiez les portions</h3><span class="fine">modifiable avant enregistrement</span></div>
    <div id="food-edits">${(result.foods || []).map(foodEdit).join('')}</div>
    ${result.assumptions?.length ? `<div class="warn"><b>Hypothèses de l’analyse</b><br>${result.assumptions.map(esc).join('<br>')}</div>` : ''}
    ${result.note ? `<div class="fine note-line">${esc(result.note)}</div>` : ''}
    <div class="modal-actions"><button class="btn btn-ghost" data-save-favorite>♡ Favori</button><button class="btn btn-lime" data-save-result>Ajouter au journal →</button></div>`;
}

function extendedNutritionHtml(total) {
  const items = [];
  if (total.sugar != null) items.push(['Sucres', `${fmt(total.sugar, 1)} g`]);
  if (total.satFat != null) items.push(['Graisses saturées', `${fmt(total.satFat, 1)} g`]);
  if (total.salt != null) items.push(['Sel', `${fmt(total.salt, 2)} g`]);
  return items.length ? `<div class="nutrition-detail">${items.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>` : `<div class="fine">Les valeurs avancées sont affichées lorsqu’elles sont suffisamment disponibles ou lisibles.</div>`;
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
  return `<div class="sheet-head"><div><span class="tag">${esc(meal.type || 'REPAS')}</span><h2>${esc(meal.title)}</h2><div class="fine">${dateLabel(meal.day)}</div></div><button class="icon-btn" data-close>×</button></div><div class="result-total compact-total"><strong>${fmt(meal.total?.kcal)}</strong> kcal<div class="result-macros"><span><b>${fmt(meal.total?.protein, 1)}</b>P</span><span><b>${fmt(meal.total?.carbs, 1)}</b>G</span><span><b>${fmt(meal.total?.fat, 1)}</b>L</span><span><b>${fmt(meal.total?.fiber, 1)}</b>Fibres</span></div>${totalWeight ? `<div class="fine result-weight">≈ ${fmt(totalWeight)} g enregistrés au total</div>` : ''}</div><div class="extended-nutrition">${advanced}</div><div class="meal-detail-list">${(meal.foods || []).map((food) => `<div><span>${esc(food.name)}${food.grams ? ` · ${fmt(food.grams)} g` : ''}</span><b>${fmt(food.kcal)} kcal</b></div>`).join('')}</div><button class="btn btn-danger-soft btn-wide" data-delete-meal="${esc(meal.id)}">Supprimer du journal</button>`;
}

function recipeSheet(recipe) {
  const isFav = state.recipeFavorites.includes(recipe.id);
  return `<div class="sheet-head"><div><span class="tag">${esc(recipe.category || 'RECETTE')}</span><h2>${esc(recipe.name)}</h2></div><button class="icon-btn" data-close>×</button></div><div class="recipe-hero-stats"><div><b>${fmt(recipe.kcal)}</b><span>kcal</span></div><div><b>${fmt(recipe.protein)}</b><span>prot.</span></div><div><b>${fmt(recipe.fiber)}</b><span>fibres</span></div><div><b>${esc(recipe.prep)}</b><span>temps</span></div></div><div class="section-label"><h3>Ingrédients</h3><span class="fine">1 portion</span></div><div class="ingredient-table">${recipe.ingredients.map((item) => `<div><span>${esc(item[0])}</span><b>${fmt(item[1])} g</b></div>`).join('')}</div><div class="section-label"><h3>Préparation</h3></div><ol class="steps-list">${recipe.steps.map((step) => `<li>${esc(step)}</li>`).join('')}</ol><div class="modal-actions"><button class="btn btn-ghost" data-fav-recipe="${esc(recipe.id)}">${isFav ? '♥ Favori' : '♡ Favori'}</button><button class="btn btn-lime" data-add-curated="${esc(recipe.id)}">Ajouter au journal →</button></div>`;
}

function planRecipeSheet() {
  if (modal.loading) return `<div class="loader"><div class="loader-dots"><i></i><i></i><i></i></div><h3>Création de la recette…</h3></div>`;
  if (modal.error) return `<div class="sheet-head"><h2>Recette</h2><button class="icon-btn" data-close>×</button></div><div class="warn">${esc(modal.error)}</div>`;
  const recipe = modal.recipe;
  if (!recipe) return `<div class="loader">Préparation…</div>`;
  return `<div class="sheet-head"><div><span class="tag">RECETTE ADAPTÉE</span><h2>${esc(recipe.name)}</h2></div><button class="icon-btn" data-close>×</button></div><div class="recipe-hero-stats"><div><b>${fmt(recipe.kcal)}</b><span>kcal</span></div><div><b>${fmt(recipe.protein)}</b><span>prot.</span></div><div><b>${fmt(recipe.fiber)}</b><span>fibres</span></div><div><b>${esc(recipe.prep)}</b><span>temps</span></div></div><div class="section-label"><h3>Ingrédients</h3></div><div class="ingredient-table">${(recipe.ingredients || []).map((item) => `<div><span>${esc(item.name)}</span><b>${item.grams ? `${fmt(item.grams)} g` : ''}</b></div>`).join('')}</div><div class="section-label"><h3>Préparation</h3></div><ol class="steps-list">${(recipe.steps || []).map((step) => `<li>${esc(step)}</li>`).join('')}</ol>${recipe.tips?.length ? `<div class="insight"><strong>Astuce</strong>${recipe.tips.map(esc).join(' · ')}</div>` : ''}`;
}

async function analyze(body) {
  modal.loading = true;
  renderModal();
  try {
    const response = await apiFetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    modal.loading = false;
    modal.result = data;
    renderModal();
    track('MealAnalyzed', { source: data.source || 'unknown' });
  } catch (error) {
    modal.loading = false;
    renderModal();
    toast(error.message);
  }
}

function fileToData(file, max = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Impossible de lire cette image.')); };
    image.src = url;
  });
}

function voiceInput(button, root) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) return toast('Dictée vocale indisponible sur ce navigateur.');
  const recognition = new Recognition();
  recognition.lang = 'fr-FR';
  recognition.interimResults = false;
  button.classList.add('active');
  button.textContent = '● Écoute…';
  recognition.onresult = (event) => { $('#meal-text', root).value = event.results[0][0].transcript || ''; };
  recognition.onerror = () => toast('Impossible d’utiliser le micro.');
  recognition.onend = () => { button.classList.remove('active'); button.textContent = '🎙 Dicter'; };
  recognition.start();
}

async function generateWeek(button) {
  button.disabled = true;
  const original = button.textContent;
  button.textContent = 'Création de votre semaine…';
  try {
    const p = state.profile;
    const response = await apiFetch('/api/week-plan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dailyKcal: p.dailyKcal, protein: p.protein, diet: p.diet, allergies: p.allergies, cooking: p.cooking, cuisine: p.cuisine, budget: p.budget, mealsPerDay: p.mealsPerDay }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    state.weekPlan = data.days || [];
    state.shoppingChecked = {};
    saveState();
    track('WeekPlanGenerated');
    render();
    toast('Votre semaine est prête ✓');
  } catch (error) {
    toast(error.message);
    button.disabled = false;
    button.textContent = original;
  }
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
    box.innerHTML = `<div class="warn">${esc(error.message)}</div>`;
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
  } catch (error) { box.innerHTML = `<div class="warn">${esc(error.message)}</div>`; }
}

async function doRestaurant(button) {
  const box = $('#restaurant-results');
  box.innerHTML = loadingHtml('Préparation de vos options…');
  try {
    const response = await apiFetch('/api/restaurant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ context: $('#restaurant-input')?.value || '', remaining: Number(button.dataset.remaining), diet: state.profile.diet, allergies: state.profile.allergies }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    box.innerHTML = `<div class="suggestion-list"><div class="insight"><strong>${esc(data.headline || 'Au restaurant')}</strong>Choisissez une stratégie qui vous paraît naturelle.</div>${(data.options || []).map((x) => `<article class="suggestion"><h3>${esc(x.choice)}</h3><p>${esc(x.why)}</p><div class="fine">${esc(x.tip)}</div></article>`).join('')}</div>`;
    track('RestaurantModeUsed');
  } catch (error) { box.innerHTML = `<div class="warn">${esc(error.message)}</div>`; }
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
    box.innerHTML = `<div class="suggestion-list">${options.map((x, index) => `<article class="suggestion"><div class="suggestion-top"><h3>${esc(x.name)}</h3><span class="pill">${fmt(x.kcal)} kcal</span></div><p>${esc(x.tip || '')}</p>${x.ingredients?.length ? `<div class="ingredients">${x.ingredients.map((i) => `<span class="chip">${esc(typeof i === 'string' ? i : i.name)}${typeof i === 'object' && i.grams ? ` · ${fmt(i.grams)} g` : ''}</span>`).join('')}</div>` : ''}<div class="nutrition-line"><div><b>${fmt(x.kcal)}</b>kcal</div><div><b>${fmt(x.protein)}</b>prot.</div><div><b>${fmt(x.carbs)}</b>gluc.</div><div><b>${fmt(x.fiber)}</b>fibres</div></div>${pendingPlanSwap ? `<button class="btn btn-lime btn-wide" data-replace-option="${index}">Remplacer dans mon plan →</button>` : `<button class="btn btn-ghost btn-wide" data-add-suggestion='${esc(JSON.stringify(x))}'>Ajouter au journal</button>`}</article>`).join('')}</div>`;
  } catch (error) { box.innerHTML = `<div class="warn">${esc(error.message)}</div>`; }
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

async function sendCoach(prefill = '') {
  const input = $('#coach-input');
  const message = (prefill || input?.value || '').trim();
  if (!message) return;
  state.coach.push({ role: 'user', text: message });
  if (state.coach.length > 40) state.coach = state.coach.slice(-40);
  saveState();
  render();
  try {
    const t = totals();
    const p = state.profile;
    const response = await apiFetch('/api/coach', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, goal: p.goal, dailyKcal: p.dailyKcal, remaining: Math.max(0, p.dailyKcal - t.kcal), proteinLeft: Math.max(0, p.protein - t.protein), diet: p.diet, allergies: p.allergies, week: weeklyData(), weightTrend: state.weights.slice(-12), planSummary: state.weekPlan.slice(0, 2) }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    state.coach.push({ role: 'ai', text: data.answer || 'Je n’ai pas pu formuler de réponse.' });
    saveState();
    render();
    setTimeout(() => { const chat = $('#chat'); if (chat) chat.scrollTop = chat.scrollHeight; }, 0);
  } catch (error) {
    state.coach.push({ role: 'ai', text: `Je n’ai pas pu répondre : ${error.message}` });
    saveState();
    render();
  }
}

function loadingHtml(label) {
  return `<div class="loader"><div class="loader-dots"><i></i><i></i><i></i></div>${esc(label)}</div>`;
}

async function requestCode() {
  const email = $('#access-email')?.value.trim().toLowerCase();
  const message = $('#access-msg');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast('Saisissez un e-mail valide.');
  message.innerHTML = '<div class="fine loading-line">Vérification de votre achat…</div>';
  try {
    const response = await fetch('/api/access/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    state.premiumEmail = email;
    saveState(false);
    $('#code-area').style.display = 'block';
    message.innerHTML = `<div class="warn success"><b>Code envoyé.</b><br>${data.mailed ? 'Consultez votre boîte e-mail et vos spams.' : ''}${data.devCode ? ` Code de développement : <b>${esc(data.devCode)}</b>` : ''}</div>`;
  } catch (error) {
    message.innerHTML = `<div class="warn">${esc(error.message)}</div>`;
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
    modal.error = error.message;
    renderModal();
  }
}

function addCuratedRecipe(id) {
  const recipe = curatedRecipes.find((r) => r.id === id);
  if (!recipe) return;
  state.meals.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    day: todayKey(),
    type: recipe.category,
    title: recipe.name,
    foods: recipe.ingredients.map(([name, grams]) => ({ name, grams, kcal: 0 })),
    total: { kcal: recipe.kcal, protein: recipe.protein, carbs: recipe.carbs, fat: recipe.fat, fiber: recipe.fiber },
    icon: '⌁',
    source: 'recipe',
  });
  saveState();
  toast('Recette ajoutée au journal ✓');
  modal = null;
  document.querySelector('.modal-wrap')?.remove();
  render();
}

function toggleRecipeFavorite(id) {
  const set = new Set(state.recipeFavorites || []);
  if (set.has(id)) set.delete(id); else set.add(id);
  state.recipeFavorites = [...set];
  saveState();
}

function render() {
  document.querySelector('.modal-wrap')?.remove();
  if (!state.premium && !['access', 'legal'].includes(route)) route = 'access';
  if (state.premium && !state.onboarding && !['onboarding', 'plan', 'access', 'legal'].includes(route)) route = 'onboarding';

  let html;
  if (route === 'onboarding') html = onboarding();
  else if (route === 'plan') html = planScreen();
  else if (route === 'app') html = dashboard();
  else if (route === 'program') html = program();
  else if (route === 'planner') html = planner();
  else if (route === 'recipes') html = recipesScreen();
  else if (route === 'coach') html = coachScreen();
  else if (route === 'insights') html = insights();
  else if (route === 'progress') html = progressScreen();
  else if (route === 'settings') html = settings();
  else if (route === 'legal') html = legal();
  else html = access();
  app.innerHTML = html;
  bind();
}

function bind() {
  app.onclick = async (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    if (button.dataset.go) {
      pendingPlanSwap = null;
      return nav(button.dataset.go);
    }
    if (button.dataset.start !== undefined) {
      onboardingState = { step: 0, data: { ...state.profile } };
      track('StartQuiz');
      return nav('onboarding');
    }
    if (button.dataset.obValue !== undefined) {
      const step = onboardingSteps[onboardingState.step];
      let value = button.dataset.obValue;
      if (['activity', 'speed', 'mealsPerDay'].includes(step.key)) value = Number(value);
      onboardingState.data[step.key] = value;
      return render();
    }
    if (button.dataset.obBack !== undefined) {
      onboardingState.step = Math.max(0, onboardingState.step - 1);
      return render();
    }
    if (button.dataset.obNext !== undefined) {
      const step = onboardingSteps[onboardingState.step];
      const field = $('#ob-field');
      if (field) {
        let value = field.value.trim();
        if (step.type === 'number') value = Number(value);
        if (value === '' || Number.isNaN(value)) return toast('Complétez cette étape.');
        if ((step.min != null && value < step.min) || (step.max != null && value > step.max)) return toast(`Valeur attendue entre ${step.min} et ${step.max}.`);
        onboardingState.data[step.key] = value;
      }
      if (onboardingState.data[step.key] === undefined || onboardingState.data[step.key] === '') return toast('Choisissez une option.');
      if (step.key === 'target') {
        const current = Number(onboardingState.data.weight);
        const target = Number(onboardingState.data.target);
        if (onboardingState.data.goal === 'lose' && target >= current) return toast('Pour perdre du poids, choisissez un objectif inférieur au poids actuel.');
        if (onboardingState.data.goal === 'gain' && target <= current) return toast('Pour prendre du poids, choisissez un objectif supérieur au poids actuel.');
      }
      if (onboardingState.step < onboardingSteps.length - 1) {
        onboardingState.step += 1;
        return render();
      }
      track('CompleteQuiz');
      return nav('plan');
    }
    if (button.dataset.activate !== undefined) {
      state.profile = calculatePlan();
      if (state.profile.warning && Number(state.profile.age) < 18) return toast('Cette version est réservée aux adultes.');
      state.onboarding = true;
      if (!state.weights.length) state.weights = [{ day: todayKey(), value: Number(state.profile.weight) }];
      saveState();
      return nav('app');
    }

    if (button.dataset.openAdd !== undefined) return openAdd('photo');
    if (button.dataset.addTab) return openAdd(button.dataset.addTab);
    if (button.dataset.water) {
      const key = todayKey();
      state.water[key] = clamp(Number(state.water[key] || 0) + Number(button.dataset.water), 0, 6000);
      saveState();
      return render();
    }
    if (button.dataset.checkin) {
      state.checkins[todayKey()] = { ...(state.checkins[todayKey()] || {}), [button.dataset.checkin]: button.dataset.value };
      saveState();
      return render();
    }
    if (button.dataset.meal) {
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
        toast('Repas ajouté au journal ✓');
        return render();
      }
    }
    if (button.dataset.planRecipe !== undefined) return openPlanRecipe(Number(button.dataset.day), Number(button.dataset.meal));
    if (button.dataset.swapPlan !== undefined) {
      const dayIndex = Number(button.dataset.day);
      const mealIndex = Number(button.dataset.meal);
      const meal = state.weekPlan?.[dayIndex]?.meals?.[mealIndex];
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
      toast('Repas ajouté ✓');
      return render();
    }

    if (button.dataset.recipeId) {
      const recipe = curatedRecipes.find((r) => r.id === button.dataset.recipeId);
      if (recipe) { modal = { type: 'recipe', recipe }; renderModal(); }
      return;
    }
    if (button.dataset.favRecipe) {
      toggleRecipeFavorite(button.dataset.favRecipe);
      if (route === 'recipes') {
        const selected = $('.mini-choice[data-recipe-filter].selected')?.dataset.recipeFilter || 'all';
        $('#recipe-grid').innerHTML = recipeGridHtml(selected, new Set(state.recipeFavorites));
        button.classList.toggle('active', state.recipeFavorites.includes(button.dataset.favRecipe));
      }
      return;
    }
    if (button.dataset.recipeFilter) {
      $$('.mini-choice[data-recipe-filter]').forEach((x) => x.classList.remove('selected'));
      button.classList.add('selected');
      $('#recipe-grid').innerHTML = recipeGridHtml(button.dataset.recipeFilter, new Set(state.recipeFavorites));
      return;
    }

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
      route = 'access';
      location.hash = 'access';
      return render();
    }
    if (button.dataset.export !== undefined) {
      const blob = new Blob([JSON.stringify(syncSafeState(), null, 2)], { type: 'application/json' });
      const anchor = document.createElement('a');
      anchor.href = URL.createObjectURL(blob);
      anchor.download = 'nutripilot-donnees.json';
      anchor.click();
      URL.revokeObjectURL(anchor.href);
      return;
    }
    if (button.dataset.install !== undefined) {
      if (window.deferredInstall) { window.deferredInstall.prompt(); await window.deferredInstall.userChoice; }
      else toast('Utilisez « Ajouter à l’écran d’accueil » dans votre navigateur.');
      return;
    }
    if (button.dataset.deleteData !== undefined) {
      if (!confirm('Supprimer votre journal, votre programme et vos données NutriPilot ? Cette action ne résilie pas Hotmart.')) return;
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

  app.onchange = (event) => {
    if (event.target.matches('[data-shop]')) {
      state.shoppingChecked[event.target.dataset.shop] = event.target.checked;
      saveState();
    }
  };

  const coachInput = $('#coach-input');
  if (coachInput) coachInput.onkeydown = (event) => { if (event.key === 'Enter') $('[data-coach-send]')?.click(); };
}

function bindModal(root) {
  root.onclick = async (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    if (button.dataset.close !== undefined) {
      modal = null;
      root.remove();
      return;
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
      return toast('Repas ajouté ✓');
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
      const recipe = curatedRecipes.find((r) => r.id === button.dataset.favRecipe);
      if (recipe) { modal = { type: 'recipe', recipe }; renderModal(); }
      return;
    }
    if (button.dataset.addCurated) return addCuratedRecipe(button.dataset.addCurated);
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
      try {
        const image = await fileToData(selected, 1600, 0.82);
        await analyze({ image, mode: modal.tab === 'label' ? 'label' : 'meal' });
      } catch (error) { toast(error.message); }
    };
  }
}

init();

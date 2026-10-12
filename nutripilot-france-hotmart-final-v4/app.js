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
  guidesRead: [],
  lang: '',
  basicsDone: false,
  basicsFilled: {},
  workoutLog: [],
  workoutProgram: '',
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

const EXPLORE_ROUTES = ['app', 'hub', 'program', 'recipes', 'shopping', 'guides', 'training', 'progress', 'coach', 'planner', 'insights', 'tour', 'support', 'settings', 'onboarding', 'analyzing', 'plan', 'paywall', 'access', 'legal', 'lang'];
function guardRoute() {
  if (!routeAllowed()) route = 'app';
  if (!state.premium) {
    if (['access', 'legal'].includes(route)) return;
    if (!state.lang) { route = 'lang'; return; }
    if (!state.basicsDone) { if (!['lang', 'basics', 'saving'].includes(route)) route = 'basics'; return; }
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
  return ['app', 'program', 'planner', 'recipes', 'shopping', 'guides', 'coach', 'insights', 'progress', 'settings', 'legal', 'onboarding', 'analyzing', 'plan', 'paywall', 'upgrade', 'access', 'training', 'lang', 'basics', 'saving', 'hub', 'tour', 'support'].includes(route);
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
  }
  if (valid && state.onboarding && ['access', 'plan', 'onboarding', 'paywall', 'welcome'].includes(route)) route = 'app';
  guardRoute();

  saveState(false);
  render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
}

window.addEventListener('hashchange', () => {
  route = location.hash.replace('#', '') || 'app';
  render();
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  window.deferredInstall = event;
});

const kgFmt = (value) => fmt(value, Number.isInteger(Number(value)) ? 0 : 1);
const onboardingSteps = [
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
    title: (d) => d.goal === 'lose' ? `Perdre ${kgFmt(Math.abs(Number(d.weight) - Number(d.target)))} kg : c’est un objectif atteignable.` : d.goal === 'gain' ? 'Prendre du muscle, ça se construit repas après repas.' : 'Votre objectif est noté.',
    sub: (d) => d.goal === 'gain' ? 'NutriPilot ajuste vos calories et vos protéines à votre entraînement pour progresser sans prendre de gras inutile.' : 'NutriPilot ne vous demandera pas de tout supprimer. Il calcule un rythme qui respecte votre énergie, votre vie sociale et le plaisir de manger, puis vous guide repas après repas.',
  },
  { key: 'event', title: 'Avez-vous une date en tête ?', sub: 'Un objectif daté aide à garder le cap.', type: 'options', opts: [['holidays', 'Les prochaines vacances', 'Me sentir bien à la plage'], ['event', 'Un événement important', 'Mariage, anniversaire, soirée…'], ['season', 'La nouvelle saison', 'Repartir sur de bonnes bases'], ['none', 'Pas de date précise', 'Je veux surtout que ça dure']] },
  { key: 'activity', title: 'À quoi ressemble votre semaine ?', sub: 'Choisissez l’option la plus proche de votre quotidien.', type: 'options', opts: [[1.2, 'Plutôt assise', 'Bureau, voiture, peu de sport'], [1.375, 'Un peu active', '1 à 3 séances ou longues marches'], [1.55, 'Active', '3 à 5 séances par semaine'], [1.725, 'Très active', 'Sport ou métier physique au quotidien']] },
  { key: 'speed', when: (d) => d.goal === 'lose', title: 'À quel rythme voulez-vous avancer ?', sub: 'Un rythme durable évite l’effet yo-yo.', type: 'options', opts: [[0.2, 'Tranquille', '≈ 0,2 kg / semaine · très facile à tenir'], [0.35, 'Régulier', '≈ 0,35 kg / semaine · recommandé'], [0.5, 'Soutenu', '≈ 0,5 kg / semaine · plus exigeant']] },
  { key: 'trainPlace', title: 'Voulez-vous un programme d’entraînement ?', sub: 'Le sport accélère les résultats et protège vos muscles. Il est inclus.', type: 'options', opts: (d) => [['gym', 'Oui, en salle de sport', 'Machines, haltères, barre'], ['home', 'Oui, à la maison', 'Sans matériel, 30 minutes'], ...(d.track === 'muscle' ? [] : [['none', 'Pas pour l’instant', 'Je me concentre sur l’alimentation']])] },
  { key: 'trainLevel', when: (d) => d.trainPlace && d.trainPlace !== 'none', title: 'Quel est votre niveau ?', sub: 'Vos séances partiront de là.', type: 'options', opts: [['beginner', 'Débutant(e)', 'Je découvre ou je reprends'], ['intermediate', 'Intermédiaire', 'Je m’entraîne depuis quelques mois'], ['advanced', 'Confirmé(e)', 'Plus d’un an de pratique régulière']] },
  { key: 'trainDays', when: (d) => d.trainPlace && d.trainPlace !== 'none', title: 'Combien de séances par semaine ?', sub: 'Mieux vaut moins de séances tenues que trop de séances abandonnées.', type: 'options', opts: [[2, '2 séances', 'L’essentiel'], [3, '3 séances', 'Recommandé'], [4, '4 séances ou plus', 'Pour progresser plus vite']] },
  { key: 'tried', title: 'Qu’avez-vous déjà essayé ?', sub: 'Pour ne pas vous refaire vivre ce qui n’a pas marché.', type: 'options', opts: [['diets', 'Des régimes stricts', 'Et le poids est revenu'], ['apps', 'Des applis de comptage', 'Trop long, j’ai arrêté'], ['fasting', 'Le jeûne ou sauter des repas', 'Difficile à tenir'], ['nothing', 'Rien de structuré', 'C’est ma première vraie démarche']] },
  { key: 'challenge', title: 'Qu’est-ce qui vous fait le plus craquer ?', sub: 'Votre tableau de bord mettra l’accent sur ce point.', type: 'options', opts: [['portions', 'Les portions', 'Je ne sais pas combien manger'], ['ideas', 'Les idées de repas', 'Je mange toujours la même chose'], ['snacking', 'Le grignotage', 'Surtout le soir ou entre les repas'], ['consistency', 'La régularité', 'Je commence puis j’abandonne'], ['restaurant', 'Les repas à l’extérieur', 'Restaurant, apéro, repas de famille']] },
  {
    key: 'info-why', type: 'info', icon: '♡',
    title: () => 'Ce n’est pas un manque de volonté.',
    sub: (d) => ({
      portions: 'Sans repères, on mange au jugé. NutriPilot vous montre la bonne portion en une photo, à chaque repas.',
      ideas: 'Quand on ne sait pas quoi manger, on prend ce qui est rapide. NutriPilot vous propose votre prochain repas, adapté à votre journée.',
      snacking: 'Le grignotage vient souvent de repas pas assez rassasiants. Votre plan priorise les protéines et les fibres qui calent vraiment.',
      consistency: 'Les régimes trop stricts finissent par lâcher. NutriPilot ajuste le reste de la journée au lieu de tout interdire.',
      restaurant: 'Une sortie ne ruine rien. Décrivez votre restaurant ou prenez votre assiette en photo : NutriPilot rééquilibre la suite.',
    })[d.challenge] || 'Il vous manquait simplement un plan clair, repas après repas. C’est exactement ce que nous construisons maintenant.',
  },
  { key: 'diet', title: 'Comment aimez-vous manger ?', sub: 'Vos recettes et suggestions suivront ce style.', type: 'options', opts: [['balanced', 'De tout', 'Aucune règle particulière'], ['mediterranean', 'Méditerranéen', 'Légumes, huile d’olive, poisson'], ['high-protein', 'Riche en protéines', 'Pour être rassasié(e) plus longtemps'], ['pescatarian', 'Pescétarien', 'Poisson, sans viande'], ['vegetarian', 'Végétarien', 'Sans viande ni poisson']] },
  { key: 'allergies', title: 'Des aliments à éviter ?', sub: 'Allergies, intolérances ou simplement ce que vous n’aimez pas. Laissez vide si rien.', type: 'text', optional: true, placeholder: 'Ex. arachides, lactose, champignons…' },
  { key: 'mealsPerDay', title: 'Combien de repas par jour ?', sub: 'Votre plan suivra votre rythme, pas l’inverse.', type: 'options', opts: [[2, '2 repas', 'Simple et efficace'], [3, '3 repas', 'Le classique'], [4, '3 repas + 1 collation', 'Pour éviter les fringales']] },
  { key: 'cooking', title: 'Combien de temps pour cuisiner ?', sub: 'Toutes vos recettes respecteront ce temps.', type: 'options', opts: [['<15 min', 'Moins de 15 min', 'Le plus rapide possible'], ['15-30 min', '15 à 30 min', 'Simple mais bon'], ['30-45 min', '30 à 45 min', 'J’aime cuisiner']] },
  { key: 'cuisine', title: 'Quelle cuisine vous fait envie ?', sub: 'Un plan qui donne envie, c’est un plan qu’on suit.', type: 'options', opts: [['france', 'Française & familiale', 'Les bons classiques, version légère'], ['med', 'Méditerranéenne', 'Fraîche et ensoleillée'], ['world', 'Cuisine du monde', 'Asie, Orient, Amériques…'], ['simple', 'Très simple', 'Peu d’ingrédients']] },
  { key: 'budget', title: 'Quel budget pour vos courses ?', sub: 'Votre liste de courses sera adaptée.', type: 'options', opts: [['economy', 'Économique', 'Des produits simples'], ['standard', 'Standard', 'Équilibre prix et variété'], ['flexible', 'Flexible', 'Plus de liberté']] },
  { key: 'name', title: 'Dernière question : votre prénom ?', sub: 'Pour personnaliser votre programme.', type: 'text', placeholder: 'Votre prénom' },
];
const stepText = (value, data) => (typeof value === 'function' ? value(data) : value || '');
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
        <span>${esc(option[1])}</span>${option[2] ? `<b>${esc(option[2])}</b>` : ''}
      </button>`).join('')}</div>`;
  }
  if (step.type === 'number') {
    return `<div class="number-entry"><input class="input-big" id="ob-field" type="number" inputmode="decimal" min="${step.min}" max="${step.max}" step="${step.step || 1}" value="${esc(value)}"><span class="unit">${esc(step.unit)}</span></div>`;
  }
  return `<input class="input-big text-input-big" id="ob-field" type="text" placeholder="${esc(step.placeholder || '')}" value="${esc(value)}">`;
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
      <div><span class="tag">PROGRAMME PERSONNALISÉ</span><h2>Votre objectif de poids.<br>Une direction concrète chaque jour.</h2></div>
      <div class="quote-card"><b>Quelques questions. Un plan fait pour vous.</b><p>Vos réponses servent uniquement à construire votre programme.</p></div>
    </aside>
    <main class="onboard-main">
      <div class="ob-top"><button class="back" data-ob-back ${onboardingState.step === 0 ? 'style="visibility:hidden"' : ''} aria-label="Retour">←</button><div class="progress-steps"><i style="width:${percent}%"></i></div><small class="ob-percent">${Math.round(percent)} %</small></div>
      ${body}
      <div class="nextbar"><button class="btn btn-primary btn-wide" data-ob-next>${isLast ? 'Créer mon programme' : 'Continuer'}</button></div>
    </main>
  </div>`;
}

const TRACKS = [
  ['lose', 'Perdre du poids', 'Mincir sans régime extrême', '🔥'],
  ['menopause', 'Ménopause & 40+', 'Retrouver un ventre plat après 40 ans', '🌸'],
  ['muscle', 'Prendre du muscle', 'Programme salle + nutrition sportive', '💪'],
  ['eat', 'Manger mieux', 'Plus d’énergie, sans prise de tête', '🥗'],
];

// ---- Langues ---------------------------------------------------------------
const LANGS = [
  ['fr', 'Français', '🇫🇷'], ['en', 'English', '🇬🇧'], ['es', 'Español', '🇪🇸'],
  ['pt', 'Português', '🇵🇹'], ['de', 'Deutsch', '🇩🇪'], ['it', 'Italiano', '🇮🇹'],
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
    exploreTiles: [['recipes', 'Recettes'], ['training', 'Entraînements'], ['guides', 'Guides'], ['tour', 'Fonctions']],
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
    exploreTiles: [['recipes', 'Recipes'], ['training', 'Workouts'], ['guides', 'Guides'], ['tour', 'Features']],
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
    exploreTiles: [['recipes', 'Recetas'], ['training', 'Entrenamientos'], ['guides', 'Guías'], ['tour', 'Funciones']],
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
    exploreTiles: [['recipes', 'Receitas'], ['training', 'Treinos'], ['guides', 'Guias'], ['tour', 'Funções']],
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
    exploreTiles: [['recipes', 'Rezepte'], ['training', 'Workouts'], ['guides', 'Ratgeber'], ['tour', 'Funktionen']],
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
    exploreTiles: [['recipes', 'Ricette'], ['training', 'Allenamenti'], ['guides', 'Guide'], ['tour', 'Funzioni']],
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
function langScreen() {
  const current = pendingLang || state.lang || detectLang();
  return `<div class="welcome">
    <div class="welcome-inner">
      ${logo()}
      <div class="welcome-copy"><h1>${esc(I18N[current]?.langTitle || t('langTitle'))}</h1></div>
      <div class="lang-grid">${LANGS.map(([code, label, flag]) => `<button class="lang-card ${code === current ? 'selected' : ''}" data-lang="${code}"><span>${flag}</span><b>${label}</b></button>`).join('')}</div>
      <div class="welcome-cta"><button class="btn btn-lime btn-wide btn-xl" data-lang-ok="${current}">${esc(I18N[current]?.langCta || 'Continuer')}</button></div>
    </div>
  </div>`;
}

function basicsScreen() {
  const d = state.profile || {};
  return `<div class="welcome light">
    <div class="welcome-inner">
      <div class="ob-top"><button class="back" data-go="lang" aria-label="←">←</button>${logo()}</div>
      <div class="welcome-copy"><h1>${esc(t('basicsTitle'))}</h1><p>${esc(t('basicsSub'))}</p></div>
      <div class="basics-form">
        <label class="field"><span>${esc(t('name'))}</span><input id="b-name" type="text" autocomplete="given-name" placeholder="${esc(t('namePh'))}" value="${esc(d.name || '')}"></label>
        <label class="field"><span>${esc(t('age'))}</span><div class="unit-input"><input id="b-age" type="number" inputmode="numeric" min="18" max="90" value="${esc(d.age || '')}"><i>${({ fr: 'ans', en: 'yrs', es: 'años', pt: 'anos', de: 'J.', it: 'anni' })[lang()]}</i></div></label>
        <div class="basics-optional" id="b-optional">
          <label class="field"><span>${esc(t('weight'))}</span><div class="unit-input"><input id="b-weight" type="number" inputmode="decimal" min="35" max="250" step="0.1" value="${esc(d.weight || '')}"><i>kg</i></div></label>
          <label class="field"><span>${esc(t('height'))}</span><div class="unit-input"><input id="b-height" type="number" inputmode="numeric" min="130" max="220" value="${esc(d.height || '')}"><i>cm</i></div></label>
        </div>
        <label class="later-toggle"><input type="checkbox" id="b-later"> ${esc(t('later'))}</label>
      </div>
      <div class="welcome-cta"><button class="btn btn-primary btn-wide btn-xl" data-basics-ok>${esc(t('basicsCta'))}</button></div>
    </div>
  </div>`;
}

let savingTimer = null;
let savingIndex = 0;
function savingScreen() {
  const features = t('features');
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
function startSaving() {
  clearInterval(savingTimer);
  savingIndex = 0;
  savingTimer = setInterval(() => {
    savingIndex += 1;
    if (route !== 'saving') { clearInterval(savingTimer); savingTimer = null; return; }
    if (savingIndex > t('features').length) {
      clearInterval(savingTimer); savingTimer = null;
      state.basicsDone = true;
      saveState(false);
      return nav('hub');
    }
    render();
  }, 380);
}

function hubScreen() {
  const p = state.profile || {};
  const tracks = t('tracks');
  const hasPlan = state.onboarding && p.dailyKcal;
  const proj = hasPlan ? projection(p) : null;
  return `<div class="mobile-app">
    <div class="app-head"><div class="app-head-row">${logo()}<div class="head-actions"><button class="icon-btn" data-go="lang" aria-label="Language">${LANGS.find((x) => x[0] === lang())?.[2] || '🌐'}</button>${state.premium ? '' : `<button class="btn btn-lime btn-small" data-go="paywall">${esc(t('unlock'))}</button>`}</div></div></div>
    <div class="screen">
      <h1 class="screen-title">${esc(t('hello'))}${p.name ? ` ${esc(p.name)}` : ''} 👋</h1>
      <p class="screen-sub">${esc(t('hubSub'))}</p>
      ${hasPlan ? `<button class="today-card hub-plan" data-go="plan"><small>${esc(t('myProgram'))}</small><b>${fmt(p.dailyKcal)} kcal · ${p.protein} g prot.</b>${proj ? `<span>${kgFmt(p.weight)} → ${kgFmt(p.target)} kg · ${esc(dateFr(proj.end))}</span>` : ''}<em>${esc(t('seePlan'))} →</em></button>` : ''}
      <div class="section-label"><h3>${esc(t('hubQuiz'))}</h3></div>
      <p class="screen-sub guide-sub">${esc(t('hubQuizSub'))}</p>
      <div class="track-list light">${TRACKS.map(([id, , , emoji], i) => `<button class="track-card" data-track="${id}"><span class="track-emoji">${emoji}</span><span><b>${esc(tracks[i][0])}</b><small>${esc(tracks[i][1])}</small></span><span class="guide-arrow">→</span></button>`).join('')}</div>
      <div class="section-label"><h3>${esc(t('hubExplore'))}</h3></div>
      <div class="explore-grid">${t('exploreTiles').map(([r, label]) => `<button class="explore-tile" data-go="${r}">${icon(r === 'recipes' ? 'program' : r === 'training' ? 'dumbbell' : r === 'guides' ? 'star' : 'scan')}<b>${esc(label)}</b></button>`).join('')}</div>
      <button class="guide-card hub-link" data-go="tour"><span class="guide-check">${icon('star')}</span><span><b>${esc(t('hubTour'))}</b><small>${esc(t('hubTourSub'))}</small></span><span class="guide-arrow">→</span></button>
      <button class="guide-card hub-link" data-go="support"><span class="guide-check">${icon('help')}</span><span><b>${esc(t('hubSupport'))}</b><small>${esc(t('hubSupportSub'))}</small></span><span class="guide-arrow">→</span></button>
    </div>
    ${bottom('app')}
  </div>`;
}

function exploreBanner() {
  if (state.premium) return '';
  return `<button class="explore-banner" data-go="paywall">${icon('lock')}<span><b>${esc(t('explore'))}</b>${esc(t('exploreSub'))}</span><em>${esc(t('unlock'))} →</em></button>`;
}

// ---- Découvrir l'application -----------------------------------------------
const TOUR = [
  ['scan', 'Scanner de repas', 'Prenez votre assiette en photo, écrivez ou dictez ce que vous mangez, scannez un code-barres ou une étiquette. NutriPilot estime calories, protéines, glucides, lipides, fibres et sel, et vous corrigez les grammes en un geste.', 'add'],
  ['home', 'Aujourd’hui', 'Votre tableau de bord : calories restantes, protéines, eau, check-in du jour et la prochaine décision à prendre.', 'app'],
  ['program', 'Plan de repas 7 jours', 'Un plan adapté à votre objectif, vos goûts, vos allergies, votre budget et votre temps de cuisine, avec la liste de courses rangée par rayon.', 'program'],
  ['star', 'Que manger ensuite ?', 'Vos calories et protéines restantes deviennent des idées de repas concrètes. Mode frigo : dites ce que vous avez. Mode restaurant : on vous aide à choisir.', 'planner'],
  ['dumbbell', 'Entraînement', 'Programmes en salle (développé couché, squat, presse, hip thrust…) ou à la maison, avec séries, répétitions, repos, conseils d’exécution et suivi des charges.', 'training'],
  ['coach', 'Coach', 'Posez vos questions à tout moment : il connaît vos repères et votre semaine. Bientôt : des nutritionnistes et coachs diplômés.', 'coach'],
  ['progress', 'Progrès', 'Poids, tendance, mensurations, régularité, badges et bilan hebdomadaire avec 3 priorités pour la semaine suivante.', 'progress'],
  ['bell', 'Guides', 'Ménopause, premiers pas, restaurant, grignotage : des fiches courtes avec une action à faire le jour même.', 'guides'],
];
function tourScreen() {
  return `<div class="mobile-app">
    <div class="app-head"><div class="app-head-row"><button class="icon-btn" data-go="app">←</button><h2>${esc(t('hubTour'))}</h2><span></span></div></div>
    <div class="screen">
      <h1 class="screen-title">Tout NutriPilot, en un coup d’œil.</h1>
      <div class="tour-list">${TOUR.map(([ico, title, text, r]) => `<div class="tour-card"><span class="tour-ico">${icon(ico)}</span><div><b>${esc(title)}</b><p>${esc(text)}</p><button class="link-btn" ${r === 'add' ? 'data-open-add' : `data-go="${r}"`}>Essayer →</button></div></div>`).join('')}</div>
      <button class="btn btn-lime btn-wide btn-xl" data-go="app">Créer mon programme</button>
    </div>
    ${bottom('')}
  </div>`;
}

// ---- Support ---------------------------------------------------------------
const FAQ = [
  ['Comment fonctionne l’essai gratuit ?', 'Dans les applications iPhone et Android, vous profitez de 3 jours gratuits avec un accès complet à votre formule. Aucun paiement pendant l’essai. L’abonnement démarre ensuite, sauf si vous annulez au moins 24 h avant la fin. Nous vous envoyons un rappel avant.'],
  ['Comment annuler mon abonnement ?', 'iPhone : Réglages › votre nom › Abonnements › NutriPilot. Android : Play Store › votre profil › Paiements et abonnements › Abonnements. Supprimer l’application n’annule pas l’abonnement.'],
  ['Quelle différence entre les formules ?', 'Nutrition : scanner, plan de repas, recettes, courses, guides et coach. Entraînement : programmes salle et maison avec suivi des charges. Complète : tout NutriPilot, au meilleur prix.'],
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
    <div class="app-head"><div class="app-head-row"><button class="icon-btn" data-go="app">←</button><h2>${esc(t('hubSupport'))}</h2><span></span></div></div>
    <div class="screen">
      <h1 class="screen-title">Comment pouvons-nous vous aider ?</h1>
      <button class="today-card support-cta" data-support-open>${icon('coach')}<span><b>Discuter avec l’assistant</b><small>Réponse immédiate, 24 h/24</small></span><em>→</em></button>
      <div class="section-label"><h3>Questions fréquentes</h3></div>
      <div class="session-list">${FAQ.map(([q, a]) => `<details class="ex-card faq"><summary><span class="ex-main"><b>${esc(q)}</b></span><span class="guide-arrow">+</span></summary><p>${esc(a)}</p></details>`).join('')}</div>
      <div class="day-card"><h3>Écrire à l’équipe</h3><p class="screen-sub">Nous répondons par e-mail, en général sous 24 h ouvrées.</p><a class="btn btn-ghost btn-wide" href="mailto:${esc(config.supportEmail)}">${esc(config.supportEmail)}</a></div>
    </div>
    ${bottom('')}
  </div>`;
}

function supportSheet() {
  const intro = 'Bonjour 👋 Je suis l’assistant NutriPilot. Posez-moi votre question sur l’application, les formules, l’essai ou votre compte.';
  return `<div class="sheet-head"><div><span class="tag">SUPPORT</span><h2>Assistant NutriPilot</h2></div><button class="icon-btn" data-close>×</button></div>
    <div class="chat-log" id="support-log">
      <div class="bubble bot">${esc(intro)}</div>
      ${supportMessages.map((m) => `<div class="bubble ${m.role === 'user' ? 'me' : 'bot'}">${esc(m.text)}</div>`).join('')}
      ${supportLoading ? '<div class="bubble bot typing"><i></i><i></i><i></i></div>' : ''}
    </div>
    ${supportMessages.length ? '' : `<div class="quick-row">${FAQ.slice(0, 3).map(([q]) => `<button class="mini-choice" data-support-quick="${esc(q)}">${esc(q)}</button>`).join('')}</div>`}
    <div class="chat-input"><input id="support-input" type="text" maxlength="600" placeholder="Votre question…" autocomplete="off"><button class="btn btn-primary" data-support-send>Envoyer</button></div>
    <p class="fine center-fine">Assistant automatique. Pour un problème de paiement : ${esc(config.supportEmail)}</p>`;
}

async function sendSupport(text) {
  const message = String(text || '').trim().slice(0, 600);
  if (!message || supportLoading) return;
  supportMessages.push({ role: 'user', text: message });
  supportLoading = true;
  renderModal();
  try {
    const response = await fetch('/api/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: lang(), messages: supportMessages.slice(-8) }) });
    const data = await response.json();
    supportMessages.push({ role: 'assistant', text: response.ok ? data.answer : (data.error || `Écrivez-nous à ${config.supportEmail}.`) });
  } catch {
    supportMessages.push({ role: 'assistant', text: `Connexion impossible. Écrivez-nous à ${config.supportEmail}.` });
  }
  supportLoading = false;
  renderModal();
  track('SupportMessage');
}

function supportBubble() {
  return `<button class="support-fab" data-support-open aria-label="Aide & support">${icon('help')}</button>`;
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
      <h1 class="analyzing-title">${esc(onboardingState.data.name || '')}${onboardingState.data.name ? ', nous' : 'Nous'} préparons votre programme…</h1>
      <div class="analyzing-list">${analyzingSteps.map((label, index) => `<div class="${index < done ? 'done' : index === done ? 'current' : ''}"><span>${index < done ? '✓' : ''}</span>${esc(label)}</div>`).join('')}</div>
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

  return { ...p, bmr: Math.round(bmr), tdee: Math.round(tdee), bmi: +bmi.toFixed(1), dailyKcal: kcal, protein, carbs, fat, fiber, warning };
}

const ICONS = {
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
};
function icon(name, cls = '') {
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

function dateFr(date, withYear = false) {
  const opts = { day: 'numeric', month: 'long' };
  if (withYear || date.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric';
  return date.toLocaleDateString('fr-FR', opts);
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
    <text x="${x0}" y="${h - 4}" class="proj-axis">Aujourd’hui</text>
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
  const name = p.name ? `${esc(p.name)}, ` : '';
  const cta = state.premium ? 'Entrer dans mon programme' : 'Débloquer mon programme';
  return `<div class="mobile-app no-nav">
    <div class="app-head"><div class="app-head-row">${logo()}${state.premium ? '<span class="pill premium-pill">Premium ✓</span>' : ''}</div></div>
    <div class="screen">
      <div class="program-ready"><span class="tag">VOTRE PROGRAMME EST PRÊT</span>
      ${proj
        ? `<h1 class="screen-title">${name}vous pouvez atteindre <span class="hl">${kgFmt(p.target)} kg</span> le ${esc(dateFr(proj.end))}.</h1>`
        : `<h1 class="screen-title">${name}votre programme est prêt.</h1>`}
      </div>
      ${proj ? `<div class="today-card proj-card">
        ${projectionChart(p, proj)}
        <div class="proj-milestone">${icon('check')}<span>Premier cap : <b>−${kgFmt(Math.round(proj.firstLoss * 10) / 10)} kg</b> d’ici le ${esc(dateFr(proj.firstDate))}</span></div>
        ${MOTIVATION_LINE[p.motivation] ? `<div class="proj-milestone">${icon('star')}<span>${esc(MOTIVATION_LINE[p.motivation])}</span></div>` : ''}
        <div class="fine">Estimation selon le rythme choisi (≈ ${fmt(p.speed, 2)} kg / semaine). Chaque corps est différent : NutriPilot ajuste votre plan selon vos résultats réels.</div>
      </div>` : ''}
      <div class="today-card goal-card">
        <small>Votre repère quotidien</small>
        <div class="hero-number">${fmt(p.dailyKcal)} <span>kcal</span></div>
        <div class="macro-row-4">
          <div><small>Protéines</small><b>${p.protein} g</b></div>
          <div><small>Glucides</small><b>${p.carbs} g</b></div>
          <div><small>Lipides</small><b>${p.fat} g</b></div>
          <div><small>Fibres</small><b>${p.fiber} g</b></div>
        </div>
      </div>
      ${p.warning ? `<div class="warn"><b>À noter.</b><br>${esc(p.warning)}</div>` : ''}
      <div class="section-label"><h3>Ce que comprend votre programme</h3></div>
      <div class="benefits feature-list">${PROGRAM_FEATURES.map((x) => `<div class="benefit"><span class="check">✓</span><b>${esc(x)}</b></div>`).join('')}</div>
      <div class="sticky-cta"><button class="btn btn-lime btn-wide btn-xl" data-activate>${cta}</button></div>
    </div>
  </div>`;
}

const PROGRAM_FEATURES = [
  'Scanner de repas : photo, texte, code-barres et étiquette',
  'Plan de repas 7 jours + liste de courses',
  'Recettes simples avec grammes et calories',
  '« Que manger ensuite ? », mode frigo et mode restaurant',
  'Coach qui ajuste votre journée, sans culpabilité',
  'Suivi du poids, des mensurations et bilan de la semaine',
];

// ---- Billing ---------------------------------------------------------------
// Store builds (App Store / Google Play): the native shell exposes
// window.NutriPilotNative (RevenueCat) and handles the free trial.
// Web: only plans with a Hotmart `offer` can be bought (legacy).
const DEFAULT_PLANS = [
  {
    tier: 'complete', label: 'Complet', sub: 'Nutrition + Entraînement', badge: 'Le plus choisi',
    features: ['Tout le programme Nutrition', 'Tous les programmes d’entraînement', 'Coach NutriPilot au quotidien'],
    monthly: { price: 19.99, storeId: 'np_complete_monthly' }, annual: { price: 79.99, storeId: 'np_complete_annual' },
  },
  {
    tier: 'nutrition', label: 'Nutrition', sub: 'Mincir et mieux manger',
    features: ['Scanner de repas', 'Plan de repas, recettes et courses', 'Guides (ménopause incluse) et coach'],
    monthly: { price: 14.99, storeId: 'np_nutrition_monthly' }, annual: { price: 59.99, storeId: 'np_nutrition_annual' },
  },
  {
    tier: 'training', label: 'Entraînement', sub: 'Salle ou maison',
    features: ['Programmes salle et maison', 'Exercices détaillés et suivi des charges', 'Repères caloriques et protéines'],
    monthly: { price: 12.99, storeId: 'np_training_monthly' }, annual: { price: 49.99, storeId: 'np_training_annual' },
  },
];
let selectedTier = '';
let selectedPeriod = 'annual';

function planTier(planId = state.subscriptionPlan) {
  const id = String(planId || '');
  if (id.includes('nutrition')) return 'nutrition';
  if (id.includes('training')) return 'training';
  return 'complete'; // complete plans and legacy Hotmart customers keep full access
}
function hasFeature(feature) {
  const tier = planTier();
  if (tier === 'complete') return true;
  if (feature === 'training') return tier === 'training';
  if (feature === 'nutrition') return tier === 'nutrition';
  return true;
}

const Billing = {
  native() { return Boolean(window.NutriPilotNative?.purchase); },
  store() { return window.NutriPilotNative?.store || 'App Store / Google Play'; },
  plans() { return (Array.isArray(config.plans) && config.plans.length ? config.plans : DEFAULT_PLANS); },
  trialDays() { return this.native() ? Number(config.trialDays || 3) : 0; },
  async purchase(plan, period) {
    const option = plan[period];
    const id = `${plan.tier}_${period}`;
    track('InitiateCheckout', { plan: id, value: option.price, currency: 'EUR' });
    if (this.native()) {
      const result = await window.NutriPilotNative.purchase(option.storeId);
      if (result?.token) {
        state.premium = true;
        state.accessToken = result.token;
        state.premiumEmail = result.email || state.premiumEmail;
        state.subscriptionPlan = id;
        saveState();
        track('StartTrial', { plan: id });
        return nav('app');
      }
      return;
    }
    if (!option.offer) return toast('Cette formule sera disponible dans l’application iPhone et Android.');
    const url = new URL(config.checkoutUrl || 'https://pay.hotmart.com/R107884011S');
    url.searchParams.set('off', option.offer);
    for (const [key, value] of Object.entries(state.utms || {})) if (value) url.searchParams.set(key, value);
    location.href = url.toString();
  },
  async restore() {
    if (!this.native() || !window.NutriPilotNative.restore) return nav('access');
    const result = await window.NutriPilotNative.restore();
    if (result?.token) {
      state.premium = true;
      state.accessToken = result.token;
      state.subscriptionPlan = result.plan || state.subscriptionPlan;
      saveState();
      return nav(state.onboarding ? 'app' : 'onboarding');
    }
    toast('Aucun abonnement actif trouvé.');
  },
};

function euro(value) {
  return `${Number(value).toFixed(2).replace('.', ',')} €`;
}

function defaultTier() {
  return 'complete';
}

function paywall() {
  const p = state.profile || {};
  const plans = Billing.plans();
  const plan = plans.find((x) => x.tier === (selectedTier || defaultTier())) || plans[0];
  const option = plan[selectedPeriod];
  const periodLabel = selectedPeriod === 'annual' ? 'an' : 'mois';
  const trial = Billing.trialDays();
  const proj = projection(p);
  const terms = trial
    ? `${trial} jours gratuits, puis ${euro(option.price)} / ${periodLabel}. Renouvellement automatique, annulable à tout moment dans les réglages de votre compte ${esc(Billing.store())}, au moins 24 h avant la fin de l’essai ou de la période en cours.`
    : `${euro(option.price)} / ${periodLabel}. Renouvellement automatique, annulable à tout moment.`;
  return `<div class="mobile-app no-nav paywall">
    <div class="app-head"><div class="app-head-row">${logo()}<button class="link-btn" data-go="access">Se connecter</button></div></div>
    <div class="screen">
      <h1 class="screen-title">${p.name ? `${esc(p.name)}, c` : 'C'}hoisissez votre formule.</h1>
      ${proj ? `<div class="pw-goal">${icon('progress')}<span>Objectif <b>${kgFmt(p.target)} kg</b> · estimé le <b>${esc(dateFr(proj.end))}</b></span></div>` : ''}
      <div class="period-toggle" role="tablist">
        <button class="${selectedPeriod === 'annual' ? 'active' : ''}" data-period="annual">Annuel <span>jusqu’à −${Math.max(...plans.map((x) => Math.round((1 - x.annual.price / (x.monthly.price * 12)) * 100)))} %</span></button>
        <button class="${selectedPeriod === 'monthly' ? 'active' : ''}" data-period="monthly">Mensuel</button>
      </div>
      <div class="plan-list" role="radiogroup">
        ${plans.map((x) => {
          const o = x[selectedPeriod];
          const perMonth = selectedPeriod === 'annual' ? o.price / 12 : o.price;
          const saving = selectedPeriod === 'annual' ? Math.round((1 - o.price / (x.monthly.price * 12)) * 100) : 0;
          return `<button class="plan-option ${x.tier === plan.tier ? 'selected' : ''}" role="radio" aria-checked="${x.tier === plan.tier}" data-tier="${esc(x.tier)}">
            ${x.badge ? `<span class="plan-badge">${esc(x.badge)}</span>` : ''}
            <span class="plan-radio"></span>
            <span class="plan-main"><b>${esc(x.label)}</b><small>${esc(x.sub)}</small>
              <span class="plan-feats">${x.features.map((f) => `<i>✓ ${esc(f)}</i>`).join('')}</span></span>
            <span class="plan-per"><b>${euro(perMonth)}</b><small>/ mois</small>${saving > 0 ? `<em>−${saving} %</em>` : ''}</span>
          </button>`;
        }).join('')}
      </div>
      ${trial ? `<div class="trial-timeline">
        <div><span class="tl-dot on">${icon('lock')}</span><p><b>Aujourd’hui</b>Accès complet à votre formule. Aucun paiement maintenant.</p></div>
        <div><span class="tl-dot">${icon('bell')}</span><p><b>Jour ${Math.max(1, trial - 1)}</b>Nous vous envoyons un rappel avant la fin de l’essai.</p></div>
        <div><span class="tl-dot">${icon('star')}</span><p><b>Jour ${trial}</b>Début de l’abonnement, sauf si vous annulez avant.</p></div>
      </div>` : ''}
      <div class="sticky-cta">
        <button class="btn btn-lime btn-wide btn-xl" data-buy>${trial ? `Commencer mes ${trial} jours gratuits` : `Continuer · ${euro(option.price)} / ${periodLabel}`}</button>
        <p class="pw-terms">${selectedPeriod === 'annual' && !trial ? `Soit ${euro(option.price / 12)} / mois, facturé ${euro(option.price)} par an. Renouvellement automatique, annulable à tout moment.` : terms}</p>
      </div>
      <div class="pw-soon">${icon('coach')}<span><b>Bientôt dans votre abonnement</b>Des nutritionnistes et coachs diplômés pour vous accompagner.</span></div>
      <div class="pw-links">
        ${Billing.native() ? '<button class="link-btn" data-restore>Restaurer mes achats</button>' : '<button class="link-btn" data-go="access">Déjà client ? Se connecter</button>'}
        <button class="link-btn" data-support-open>Une question ? Parler au support</button>
        <button class="link-btn" data-go="legal">Conditions & confidentialité</button>
        <button class="link-btn" data-go="app">Plus tard, continuer à explorer</button>
      </div>
    </div>
  </div>`;
}

function lockedScreen(feature) {
  const isTraining = feature === 'training';
  return `<div class="mobile-app">
    ${appHeader(isTraining ? 'Entraînement' : 'Nutrition')}
    <div class="screen">
      <div class="today-card locked-card">${icon('lock')}
        <h2>${isTraining ? 'Ajoutez l’entraînement à votre programme' : 'Ajoutez la nutrition à votre programme'}</h2>
        <p>${isTraining ? 'Programmes salle et maison, exercices détaillés et suivi de vos charges.' : 'Scanner de repas, plan de 7 jours, recettes, liste de courses et guides.'}</p>
        <button class="btn btn-lime btn-wide" data-upgrade>Passer à la formule Complète</button>
      </div>
    </div>
    ${bottom(isTraining ? 'training' : 'program')}
  </div>`;
}

function appHeader(title) {
  return `<div class="app-head"><div class="app-head-row"><div><div class="head-logo">${logo()}</div><small class="head-date">${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</small><h2>${esc(title)}</h2></div><div class="head-actions"><button class="icon-btn coach-btn" data-go="coach" aria-label="Coach">${icon('coach')}</button><button class="icon-btn" data-go="settings" aria-label="Réglages">⚙</button></div></div></div>${exploreBanner()}`;
}

function bottom(active) {
  const tabs = [
    ['app', 'home', 'Aujourd’hui'],
    ['program', 'program', 'Nutrition'],
    ['add', 'scan', 'Scanner'],
    ['training', 'dumbbell', 'Sport'],
    ['progress', 'progress', 'Progrès'],
  ];
  return `<nav class="bottom-nav">${tabs.map(([r, ico, label]) => `<button class="nav-btn ${r === active ? 'active' : ''} ${r === 'add' ? 'center' : ''}" ${r === 'add' ? 'data-open-add' : `data-go="${r}"`} aria-label="${label}"><span>${icon(ico)}</span>${label}</button>`).join('')}</nav>`;
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
        ${hasFeature('training') ? `<button class="action-card" data-go="training"><span class="aico">${icon('dumbbell')}</span><b>Séance du jour</b><small>${esc(nextSession().name)} · ${weekWorkouts()}/${currentProgram().days} cette semaine</small></button>` : `<button class="action-card" data-go="recipes"><span class="aico">⌁</span><b>Recettes</b><small>${curatedRecipes.length} idées détaillées</small></button>`}
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
    ${appHeader('Nutrition')}
    <div class="screen">
      ${programTabs('program')}

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


      <div class="section-label"><h3>Bilan hebdomadaire</h3><span class="fine">vos données → 3 priorités</span></div>
      ${state.weekReview ? weeklyReviewHtml() : `<button class="btn btn-ghost btn-wide" data-week-review>Analyser mes 7 derniers jours →</button>`}
    </div>
    ${bottom('program')}
  </div>`;
}

// ---- Guides ----------------------------------------------------------------
const GUIDE_COLLECTIONS = [
  {
    id: 'menopause',
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
    id: 'basics',
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
];

function allGuides() {
  return GUIDE_COLLECTIONS.flatMap((c) => c.guides.map((g) => ({ ...g, collection: c.id })));
}

function programTabs(active) {
  const tabs = [['program', 'Mon plan'], ['recipes', 'Recettes'], ['shopping', 'Courses'], ['guides', 'Guides']];
  return `<div class="segmented" role="tablist">${tabs.map(([r, label]) => `<button role="tab" aria-selected="${r === active}" class="${r === active ? 'active' : ''}" data-go="${r}">${label}</button>`).join('')}</div>`;
}

function guidesScreen() {
  const p = state.profile || {};
  const meno = p.menopause && p.menopause !== 'no';
  const order = meno ? GUIDE_COLLECTIONS : [...GUIDE_COLLECTIONS].reverse();
  const read = new Set(state.guidesRead || []);
  return `<div class="mobile-app">
    ${appHeader('Nutrition')}
    <div class="screen">
      ${programTabs('guides')}
      ${order.map((c) => `
        <div class="section-label"><h3>${esc(c.title)}</h3><span class="fine">${c.guides.filter((g) => read.has(g.id)).length}/${c.guides.length} lus</span></div>
        <p class="screen-sub guide-sub">${esc(c.sub)}</p>
        <div class="guide-list">${c.guides.map((g) => `<button class="guide-card ${read.has(g.id) ? 'read' : ''}" data-guide="${esc(g.id)}"><span class="guide-check">${read.has(g.id) ? icon('check') : ''}</span><span><b>${esc(g.title)}</b><small>${esc(g.time)} de lecture</small></span><span class="guide-arrow">→</span></button>`).join('')}</div>`).join('')}
      <div class="fine center-fine">Contenus d’information générale. Ils ne remplacent pas l’avis d’un médecin.</div>
    </div>
    ${bottom('program')}
  </div>`;
}

function guideSheet(guide) {
  return `<div class="sheet-head"><div><span class="tag">GUIDE · ${esc(guide.time)}</span><h2>${esc(guide.title)}</h2></div><button class="icon-btn" data-close>×</button></div>
    <p class="guide-intro">${esc(guide.intro)}</p>
    <ul class="guide-points">${guide.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <div class="warn success"><b>À faire aujourd’hui</b><br>${esc(guide.action)}</div>
    <button class="btn btn-primary btn-wide" data-close>J’ai compris</button>`;
}

function shoppingScreen() {
  const shopping = planShopping();
  return `<div class="mobile-app">
    ${appHeader('Nutrition')}
    <div class="screen">
      ${programTabs('shopping')}
      ${shopping.length
        ? `<div class="section-label"><h3>Liste de la semaine</h3><span class="fine">${shopping.length} ingrédients</span></div><div class="day-card shopping-list">${shoppingListHtml(shopping)}</div>`
        : `<div class="day-card"><h3>Votre liste arrive avec votre plan.</h3><p class="screen-sub">Générez votre plan de 7 jours : NutriPilot regroupe automatiquement les ingrédients par rayon.</p><button class="btn btn-primary btn-wide" data-generate-week>Créer ma semaine</button></div>`}
    </div>
    ${bottom('program')}
  </div>`;
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

function recommendedProgramId(p = state.profile || {}) {
  if (p.trainPlace === 'home') return 'home-full-3';
  if (p.trainPlace === 'gym') {
    if (Number(p.trainDays) >= 4 && p.trainLevel !== 'beginner') return 'gym-upper-lower-4';
    if (p.sex === 'female' && p.track !== 'muscle') return 'gym-glutes-3';
    return 'gym-full-3';
  }
  return 'home-full-3';
}

function currentProgram() {
  return WORKOUT_PROGRAMS.find((x) => x.id === (state.workoutProgram || recommendedProgramId())) || WORKOUT_PROGRAMS[0];
}

function nextSession(program = currentProgram()) {
  const done = (state.workoutLog || []).filter((x) => x.programId === program.id).length;
  return program.sessions[done % program.sessions.length];
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
  const since = Date.now() - 7 * 86400000;
  return (state.workoutLog || []).filter((x) => new Date(x.at).getTime() >= since).length;
}

function trainingScreen() {
  const program = currentProgram();
  const next = nextSession(program);
  const week = weekWorkouts();
  return `<div class="mobile-app">
    ${appHeader('Entraînement')}
    <div class="screen">
      <div class="today-card train-card">
        <small>${esc(program.level)} · ${program.days} séances / semaine</small>
        <h2>${esc(program.name)}</h2>
        <div class="train-week">${Array.from({ length: program.days }, (_, i) => `<i class="${i < week ? 'on' : ''}"></i>`).join('')}<span>${Math.min(week, program.days)}/${program.days} cette semaine</span></div>
        <button class="btn btn-lime btn-wide" data-session="${esc(next.id)}">Commencer : ${esc(next.name)} →</button>
      </div>
      <div class="section-label"><h3>Séances du programme</h3></div>
      <div class="guide-list">${program.sessions.map((s) => `<button class="guide-card" data-session="${esc(s.id)}"><span class="guide-check">${esc(s.id)}</span><span><b>${esc(s.name)}</b><small>${esc(s.focus)} · ${s.ex.length} exercices</small></span><span class="guide-arrow">→</span></button>`).join('')}</div>
      <div class="section-label"><h3>Changer de programme</h3></div>
      <div class="program-switch">${WORKOUT_PROGRAMS.map((x) => `<button class="mini-choice ${x.id === program.id ? 'selected' : ''}" data-workout-program="${esc(x.id)}">${esc(x.name)}</button>`).join('')}</div>
      <p class="screen-sub">${esc(program.desc)}</p>
      <div class="fine center-fine">Échauffez-vous 5 à 10 minutes avant chaque séance. Choisissez une charge qui vous laisse 1 à 2 répétitions en réserve. Arrêtez en cas de douleur et demandez un avis médical si vous avez un problème de santé.</div>
    </div>
    ${bottom('training')}
  </div>`;
}

function sessionSheet(sessionId) {
  const program = currentProgram();
  const session = program.sessions.find((x) => x.id === sessionId) || program.sessions[0];
  return `<div class="sheet-head"><div><span class="tag">${esc(program.name.toUpperCase())}</span><h2>${esc(session.name)}</h2><div class="fine">${esc(session.focus)}</div></div><button class="icon-btn" data-close>×</button></div>
    <div class="session-list">${session.ex.map(([id, sets, reps, rest], index) => {
      const ex = EXERCISES[id];
      return `<details class="ex-card">
        <summary><span class="ex-num">${index + 1}</span><span class="ex-main"><b>${esc(ex.name)}</b><small>${sets} × ${esc(reps)} · repos ${rest >= 60 ? `${Math.round(rest / 60 * 10) / 10} min`.replace('.', ',') : `${rest} s`} · ${esc(ex.muscle)}</small></span></summary>
        <ul class="guide-points">${ex.cues.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
        <label class="ex-load">Charge utilisée (kg) <input type="number" inputmode="decimal" min="0" step="0.5" data-load="${esc(id)}" value="${esc(lastLoad(id))}" placeholder="—"></label>
      </details>`;
    }).join('')}</div>
    <button class="btn btn-primary btn-wide" data-finish-session="${esc(session.id)}">✓ Terminer la séance</button>`;
}

function recipeMiniCard(recipe) {
  return `<button class="recipe-mini" data-recipe-id="${esc(recipe.id)}"><span>${esc(recipe.category)}</span><b>${esc(recipe.name)}</b><small>${recipe.kcal} kcal · ${recipe.protein} g prot. · ${esc(recipe.prep)}</small></button>`;
}

function recipesScreen() {
  const favoriteSet = new Set(state.recipeFavorites || []);
  return `<div class="mobile-app">
    ${appHeader('Nutrition')}
    <div class="screen">
      ${programTabs('recipes')}
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
      <div class="pw-soon">${icon('coach')}<span><b>Bientôt</b>Des nutritionnistes et coachs diplômés rejoindront NutriPilot pour vous accompagner.</span></div>
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
      ${state.premium ? '' : `<button class="explore-banner" data-go="paywall">${icon('lock')}<span><b>${esc(t('explore'))}</b>${esc(t('exploreSub'))}</span><em>${esc(t('unlock'))} →</em></button>`}
      <button class="btn btn-ghost btn-wide" data-go="lang">🌐 Langue · ${esc(LANGS.find((x) => x[0] === lang())?.[1] || 'Français')}</button>
      <div class="success warn" ${state.premium ? '' : 'hidden'}><b>NutriPilot Premium actif ✓</b><br>${esc(state.premiumEmail || 'Accès activé')} ${state.subscriptionPlan ? `· formule ${esc(state.subscriptionPlan)}` : ''}</div>
      <div class="kpi settings-goal"><small>Votre objectif quotidien</small><b>${fmt(state.profile.dailyKcal)} kcal</b><div class="fine">P ${state.profile.protein} g · G ${state.profile.carbs} g · L ${state.profile.fat} g · Fibres ${state.profile.fiber} g</div></div>
      <button class="btn btn-primary btn-wide" data-start>🎯 Recalculer mon programme</button>
      <div class="section-label"><h3>Abonnement</h3></div>
      ${config.manageSubscriptionUrl ? `<a class="btn btn-ghost btn-wide" href="${esc(config.manageSubscriptionUrl)}" target="_blank" rel="noopener">Gérer mon abonnement</a>` : ''}
      <div class="fine center-fine">Formule actuelle : ${esc(({ complete: 'Complète', nutrition: 'Nutrition', training: 'Entraînement' })[planTier()])}</div>
      ${planTier() !== 'complete' ? '<button class="btn btn-lime btn-wide" data-upgrade>Passer à la formule Complète</button>' : ''}
      <div class="section-label"><h3>Données & appareil</h3></div>
      <button class="btn btn-ghost btn-wide" data-export>Exporter mes données (.json)</button>
      <button class="btn btn-ghost btn-wide" data-install>Ajouter NutriPilot à l’écran d’accueil</button>
      <button class="btn btn-ghost btn-wide" data-go="support">Aide & support</button>
      <button class="btn btn-ghost btn-wide" data-go="tour">Découvrir l’application</button>
      <button class="btn btn-ghost btn-wide" data-go="legal">Confidentialité & informations</button>
      <button class="btn btn-ghost btn-wide" data-logout>Se déconnecter</button>
      <button class="btn btn-danger-soft btn-wide" data-delete-data>Supprimer mes données NutriPilot</button>
      <div class="fine center-fine">La suppression des données NutriPilot ne résilie pas votre abonnement : gérez-le depuis votre compte.</div>
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
  wrap.innerHTML = `<div class="sheet"><div class="sheet-grip"></div>${modal.type === 'meal' ? mealSheet(modal.meal) : modal.type === 'recipe' ? recipeSheet(modal.recipe) : modal.type === 'plan-recipe' ? planRecipeSheet() : modal.type === 'guide' ? guideSheet(modal.guide) : modal.type === 'session' ? sessionSheet(modal.sessionId) : modal.type === 'support' ? supportSheet() : addSheet()}</div>`;
  document.body.appendChild(wrap);
  bindModal(wrap);
  if (modal.type === 'support') {
    const log = $('#support-log', wrap);
    if (log) log.scrollTop = log.scrollHeight;
    const input = $('#support-input', wrap);
    input?.addEventListener('keydown', (event) => { if (event.key === 'Enter') sendSupport(input.value); });
    if (!supportLoading) input?.focus();
  }
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
  guardRoute();
  ensureProfileDefaults();

  let html;
  if (route === 'lang') html = langScreen();
  else if (route === 'basics') html = basicsScreen();
  else if (route === 'saving') html = savingScreen();
  else if (route === 'tour') html = tourScreen();
  else if (route === 'support') html = supportScreen();
  else if (route === 'app' && !state.premium) html = hubScreen();
  else if (route === 'onboarding') html = onboarding();
  else if (route === 'analyzing') html = analyzing();
  else if (route === 'paywall' || route === 'upgrade') html = paywall();
  else if (route === 'training') html = hasFeature('training') ? trainingScreen() : lockedScreen('training');
  else if (['program', 'recipes', 'shopping', 'planner'].includes(route) && !hasFeature('nutrition')) html = lockedScreen('nutrition');
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
  else if (route === 'settings') html = settings();
  else if (route === 'legal') html = legal();
  else html = access();
  const noFab = ['lang', 'basics', 'saving', 'analyzing', 'onboarding', 'support', 'plan', 'paywall', 'upgrade'].includes(route);
  app.innerHTML = html + (noFab ? '' : supportBubble());
  document.documentElement.lang = lang();
  bind();
  if (route === 'analyzing' && !analyzingTimer) startAnalyzing();
  if (route === 'saving' && !savingTimer) startSaving();
}

function bind() {
  app.onclick = async (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    if (!state.premium && PREMIUM_ACTIONS.some((key) => button.dataset[key] !== undefined)) {
      track('PaywallFromFeature', { feature: PREMIUM_ACTIONS.find((key) => button.dataset[key] !== undefined) });
      return nav('paywall');
    }
    if (button.dataset.supportOpen !== undefined) {
      modal = { type: 'support' };
      return renderModal();
    }
    if (button.dataset.lang) {
      pendingLang = button.dataset.lang;
      return render();
    }
    if (button.dataset.langOk) {
      state.lang = button.dataset.langOk;
      pendingLang = '';
      saveState();
      track('SelectLanguage', { lang: state.lang });
      return nav(state.basicsDone || state.premium ? 'app' : 'basics');
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
      if (['activity', 'speed', 'mealsPerDay', 'trainDays'].includes(step.key)) value = Number(value);
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
    if (button.dataset.activate !== undefined) {
      state.profile = { ...calculatePlan(), estimated: false };
      if (state.profile.warning && Number(state.profile.age) < 18) return toast('Cette version est réservée aux adultes.');
      state.onboarding = true;
      if (!state.weights.length) state.weights = [{ day: todayKey(), value: Number(state.profile.weight) }];
      saveState();
      if (!state.premium) {
        track('ViewPaywall');
        return nav('paywall');
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
      selectedTier = 'complete';
      return nav('upgrade');
    }
    if (button.dataset.buy !== undefined) {
      const plan = Billing.plans().find((x) => x.tier === (selectedTier || defaultTier())) || Billing.plans()[0];
      button.disabled = true;
      try { await Billing.purchase(plan, selectedPeriod); } catch (error) { toast(error?.message || 'Paiement interrompu.'); }
      button.disabled = false;
      return;
    }
    if (button.dataset.restore !== undefined) return Billing.restore();
    if (button.dataset.guide) {
      const guide = allGuides().find((g) => g.id === button.dataset.guide);
      if (!guide) return;
      state.guidesRead = [...new Set([...(state.guidesRead || []), guide.id])];
      saveState();
      render();
      modal = { type: 'guide', guide };
      return renderModal();
    }
    if (button.dataset.session) {
      modal = { type: 'session', sessionId: button.dataset.session };
      return renderModal();
    }
    if (button.dataset.workoutProgram) {
      state.workoutProgram = button.dataset.workoutProgram;
      saveState();
      return render();
    }
    if (button.dataset.track) {
      const chosen = button.dataset.track;
      const source = state.profile?.estimated
        ? Object.fromEntries(Object.entries(state.profile).filter(([k]) => state.basicsFilled?.[k]))
        : state.profile;
      const data = { ...source, track: chosen };
      if (chosen === 'lose' || chosen === 'menopause') data.goal = 'lose';
      else if (chosen !== state.profile.track) delete data.goal;
      if (chosen === 'menopause') data.sex = 'female';
      onboardingState = { step: 0, data, skip: Object.keys(state.basicsFilled || {}).filter((k) => state.basicsFilled[k]) };
      if (!stepVisible(0)) onboardingState.step = moveStep(1);
      state.onboarding = state.premium ? state.onboarding : false;
      track('SelectTrack', { track: chosen });
      return nav('onboarding');
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
    if (button.dataset.supportSend !== undefined) return sendSupport($('#support-input', root)?.value);
    if (button.dataset.supportQuick) return sendSupport(button.dataset.supportQuick);
    if (button.dataset.finishSession && !state.premium) {
      modal = null;
      root.remove();
      return nav('paywall');
    }
    if (button.dataset.finishSession) {
      const loads = {};
      $$('[data-load]', root).forEach((input) => { if (input.value) loads[input.dataset.load] = Number(input.value); });
      state.workoutLog = [...(state.workoutLog || []), { at: new Date().toISOString(), day: todayKey(), programId: currentProgram().id, sessionId: button.dataset.finishSession, loads }].slice(-300);
      saveState();
      track('WorkoutDone', { program: currentProgram().id });
      modal = null;
      root.remove();
      toast('Séance enregistrée. Bravo ! 💪');
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

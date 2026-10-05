import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
const BRAND_NAME = process.env.BRAND_NAME || 'NutriPilot';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM = process.env.RESEND_FROM || '';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@atlasevermore.com';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || (process.env.NODE_ENV === 'development' ? 'dev-only-change-me' : '');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const USERS_DIR = path.join(DATA_DIR, 'users');
const ENTITLEMENTS_FILE = path.join(DATA_DIR, 'entitlements.json');
const LAST_WEBHOOK_FILE = path.join(DATA_DIR, 'last-webhook.json');
const MAX_JSON_BYTES = 14_000_000;
const USER_STATE_LIMIT = 2_500_000;
const MAX_RATE_BUCKETS = 10_000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

const HOTMART_OFFER_TO_PLAN = {
  r3ueswug: 'monthly',
  xb98vzl6: 'quarterly',
  gatqnh54: 'yearly',
};

const APPROVED_EVENTS = new Set(['PURCHASE_APPROVED', 'PURCHASE_COMPLETE']);
const REVOKED_EVENTS = new Set(['PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'PURCHASE_CANCELED', 'PURCHASE_EXPIRED']);

const STATIC_FILES = new Set([
  '/index.html',
  '/app.js',
  '/styles.css',
  '/sw.js',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/product-cover-600x600.png',
]);

const rateBuckets = new Map();
let entitlementQueue = Promise.resolve();
let lastRateSweep = 0;

function securityHeaders(type = 'application/json; charset=utf-8') {
  const cache = type.includes('text/html') || type.includes('javascript') || type.includes('css') || type.includes('json')
    ? 'no-cache, no-store, must-revalidate'
    : 'public, max-age=86400';
  return {
    'Content-Type': type,
    'Cache-Control': cache,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(self), microphone=(self), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; media-src 'self' blob: data:; font-src 'self' data:; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://pay.hotmart.com",
  };
}

function send(res, status, body, type) {
  const t = type || 'application/json; charset=utf-8';
  res.writeHead(status, securityHeaders(t));
  res.end(Buffer.isBuffer(body) ? body : (typeof body === 'string' ? body : JSON.stringify(body)));
}

function clientIp(req) {
  const fwd = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return fwd || req.socket?.remoteAddress || 'unknown';
}

function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  if (now - lastRateSweep > 5 * 60 * 1000 || rateBuckets.size > MAX_RATE_BUCKETS) {
    for (const [bucketKey, bucket] of rateBuckets) {
      if (now > bucket.resetAt) rateBuckets.delete(bucketKey);
    }
    lastRateSweep = now;
  }
  const previous = rateBuckets.get(key);
  if (!previous || now > previous.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (previous.count >= limit) return false;
  previous.count += 1;
  return true;
}

async function readRaw(req, limit = MAX_JSON_BYTES) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > limit) {
      const error = new Error('Payload trop volumineux');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function readJson(req) {
  const raw = await readRaw(req);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    const e = new Error('JSON invalide');
    e.statusCode = 400;
    throw e;
  }
}

function safeEmail(value = '') {
  const email = String(value).trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

function safeText(value = '', max = 1000) {
  return String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
}

function finiteNumber(value, fallback = 0, min = -Infinity, max = Infinity) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function publicError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeTimestamp(value) {
  const raw = value == null ? '' : String(value).trim();
  let n = Number(raw || 0);
  if ((!Number.isFinite(n) || n <= 0) && raw) n = Date.parse(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n < 1_000_000_000_000 ? n * 1000 : n;
}

function deepFind(obj, keyNames) {
  const keys = new Set(keyNames.map((x) => x.toLowerCase()));
  const seen = new Set();
  function walk(x) {
    if (!x || typeof x !== 'object' || seen.has(x)) return null;
    seen.add(x);
    for (const [k, v] of Object.entries(x)) {
      if (keys.has(k.toLowerCase()) && typeof v === 'string' && v.trim()) return v.trim();
    }
    for (const v of Object.values(x)) {
      const got = walk(v);
      if (got) return got;
    }
    return null;
  }
  return walk(obj);
}

async function ensureData() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(USERS_DIR, { recursive: true });
  try {
    await fs.access(ENTITLEMENTS_FILE);
  } catch {
    await atomicWriteJson(ENTITLEMENTS_FILE, {});
  }
}

async function atomicWriteJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmp, file);
}

async function loadEntitlements() {
  await ensureData();
  try {
    return JSON.parse(await fs.readFile(ENTITLEMENTS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

async function mutateEntitlements(fn) {
  const job = entitlementQueue.then(async () => {
    const data = await loadEntitlements();
    const result = await fn(data);
    await atomicWriteJson(ENTITLEMENTS_FILE, data);
    return result;
  });
  entitlementQueue = job.catch(() => {});
  return job;
}

function safeTokenEqual(a, b) {
  const aa = Buffer.from(String(a || ''));
  const bb = Buffer.from(String(b || ''));
  return aa.length === bb.length && aa.length > 0 && crypto.timingSafeEqual(aa, bb);
}

function verifyHotmartWebhook(req) {
  const secret = process.env.HOTMART_HOTTOK || '';
  const allowUnsigned = String(process.env.HOTMART_WEBHOOK_ALLOW_UNSIGNED || 'false').toLowerCase() === 'true';
  if (!secret) return allowUnsigned;
  const received = String(req.headers['x-hotmart-hottok'] || '').trim();
  return safeTokenEqual(received, secret);
}

function eventName(payload) {
  return safeText(payload?.event || deepFind(payload, ['event', 'event_name', 'type']) || '', 120).toUpperCase();
}

function buyerEmail(payload) {
  return safeEmail(
    payload?.data?.buyer?.email ||
    payload?.data?.subscriber?.email ||
    deepFind(payload, ['buyer_email', 'customer_email', 'payer_email', 'subscriber_email', 'user_email', 'email']) || ''
  );
}

function orderId(payload) {
  return safeText(
    payload?.data?.purchase?.transaction ||
    payload?.id ||
    deepFind(payload, ['transaction', 'order_id', 'transaction_id', 'purchase_id', 'subscription_id']) || '',
    160
  );
}

function subscriptionCode(payload) {
  return safeText(
    payload?.data?.subscription?.subscriber?.code ||
    payload?.data?.subscriber_code ||
    deepFind(payload, ['subscriber_code']) || '',
    120
  );
}

function planFrom(payload) {
  const offerCode = safeText(
    payload?.data?.purchase?.offer?.code ||
    payload?.data?.offer?.code ||
    deepFind(payload, ['offer_code', 'offerCode']) || '',
    80
  ).toLowerCase();
  if (HOTMART_OFFER_TO_PLAN[offerCode]) return HOTMART_OFFER_TO_PLAN[offerCode];

  const raw = safeText(
    payload?.data?.subscription?.plan?.name ||
    payload?.data?.purchase?.offer?.name ||
    deepFind(payload, ['plan', 'offer', 'product_name', 'plan_name']) || '',
    200
  ).toLowerCase();

  if (raw.includes('year') || raw.includes('annuel') || raw.includes('annual')) return 'yearly';
  if (raw.includes('3 mois') || raw.includes('quarter') || raw.includes('trimes')) return 'quarterly';
  if (raw.includes('month') || raw.includes('mensuel') || raw.includes('mens')) return 'monthly';
  return 'premium';
}

function planPeriodEnd(fromMs, plan = 'premium') {
  const date = new Date(Number(fromMs) || Date.now());
  if (Number.isNaN(date.getTime())) return 0;
  if (plan === 'yearly') date.setFullYear(date.getFullYear() + 1);
  else if (plan === 'quarterly') date.setMonth(date.getMonth() + 3);
  else date.setMonth(date.getMonth() + 1);
  return date.getTime();
}

function purchaseTimestamp(payload) {
  return normalizeTimestamp(
    payload?.data?.purchase?.approved_date ||
    payload?.data?.purchase?.order_date ||
    payload?.data?.purchase?.date ||
    deepFind(payload, ['approved_date', 'order_date', 'purchase_date']) ||
    0
  );
}

function nextChargeFromHotmart(payload) {
  return normalizeTimestamp(
    payload?.data?.purchase?.date_next_charge ||
    payload?.data?.subscription?.date_next_charge ||
    deepFind(payload, ['date_next_charge', 'next_charge_date']) ||
    0
  );
}

function accessUntilFromHotmart(payload, plan = 'premium') {
  const nextCharge = nextChargeFromHotmart(payload);
  if (nextCharge) return nextCharge;
  return planPeriodEnd(purchaseTimestamp(payload) || Date.now(), plan);
}

const foods = [
  { n: 'Œuf', k: 143, p: 12.6, c: 0.7, f: 9.5, fi: 0 },
  { n: 'Pain complet', k: 247, p: 13, c: 41, f: 4.2, fi: 7 },
  { n: 'Avocat', k: 160, p: 2, c: 8.5, f: 14.7, fi: 6.7 },
  { n: 'Poulet grillé', k: 165, p: 31, c: 0, f: 3.6, fi: 0 },
  { n: 'Riz cuit', k: 130, p: 2.7, c: 28, f: 0.3, fi: 0.4 },
  { n: 'Pâtes cuites', k: 158, p: 5.8, c: 31, f: 0.9, fi: 1.8 },
  { n: 'Saumon', k: 208, p: 20, c: 0, f: 13, fi: 0 },
  { n: 'Thon au naturel', k: 116, p: 26, c: 0, f: 1, fi: 0 },
  { n: 'Yaourt grec', k: 97, p: 9, c: 3.9, f: 5, fi: 0 },
  { n: 'Fromage blanc 0%', k: 46, p: 8, c: 4, f: 0.2, fi: 0 },
  { n: 'Banane', k: 89, p: 1.1, c: 23, f: 0.3, fi: 2.6 },
  { n: 'Pomme', k: 52, p: 0.3, c: 14, f: 0.2, fi: 2.4 },
  { n: 'Pizza margherita', k: 266, p: 11, c: 33, f: 10, fi: 2.3 },
  { n: 'Steak haché 5%', k: 137, p: 21, c: 0, f: 5, fi: 0 },
  { n: 'Tofu', k: 144, p: 17, c: 2.8, f: 8.7, fi: 2.3 },
  { n: 'Lentilles cuites', k: 116, p: 9, c: 20, f: 0.4, fi: 8 },
  { n: 'Pois chiches cuits', k: 164, p: 8.9, c: 27, f: 2.6, fi: 7.6 },
  { n: 'Quinoa cuit', k: 120, p: 4.4, c: 21, f: 1.9, fi: 2.8 },
  { n: 'Brocoli', k: 35, p: 2.4, c: 7.2, f: 0.4, fi: 3.3 },
  { n: 'Courgette', k: 17, p: 1.2, c: 3.1, f: 0.3, fi: 1 },
  { n: 'Tomate', k: 18, p: 0.9, c: 3.9, f: 0.2, fi: 1.2 },
  { n: 'Carotte', k: 41, p: 0.9, c: 10, f: 0.2, fi: 2.8 },
  { n: 'Flocons d’avoine', k: 389, p: 16.9, c: 66.3, f: 6.9, fi: 10.6 },
  { n: 'Amandes', k: 579, p: 21, c: 22, f: 50, fi: 12.5 },
  { n: 'Huile d’olive', k: 884, p: 0, c: 0, f: 100, fi: 0 },
  { n: 'Emmental', k: 380, p: 28, c: 0.5, f: 29, fi: 0 },
  { n: 'Mozzarella', k: 280, p: 28, c: 3.1, f: 17, fi: 0 },
  { n: 'Jambon blanc', k: 116, p: 20, c: 1, f: 4, fi: 0 },
  { n: 'Dinde', k: 135, p: 30, c: 0, f: 1.5, fi: 0 },
  { n: 'Crevettes', k: 99, p: 24, c: 0.2, f: 0.3, fi: 0 },
  { n: 'Patate douce cuite', k: 90, p: 2, c: 21, f: 0.2, fi: 3.3 },
  { n: 'Pomme de terre cuite', k: 87, p: 1.9, c: 20, f: 0.1, fi: 1.8 },
  { n: 'Fraises', k: 32, p: 0.7, c: 7.7, f: 0.3, fi: 2 },
  { n: 'Myrtilles', k: 57, p: 0.7, c: 14.5, f: 0.3, fi: 2.4 },
  { n: 'Orange', k: 47, p: 0.9, c: 12, f: 0.1, fi: 2.4 },
  { n: 'Baguette', k: 270, p: 9, c: 57, f: 1, fi: 2.7 },
  { n: 'Skyr', k: 63, p: 11, c: 4, f: 0.2, fi: 0 },
];

function normalizeText(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function localAnalyze(text = '') {
  const low = normalizeText(text);
  const found = [];
  for (const food of foods) {
    const key = normalizeText(food.n).split(' ')[0];
    if (!low.includes(key)) continue;
    let grams = 100;
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const before = low.match(new RegExp(`(\\d{1,4})\\s?g\\s*(?:de|du|des|d')?\\s*${escaped}`, 'i'));
    const after = low.match(new RegExp(`${escaped}\\s*(?:[:=-]?\\s*)?(\\d{1,4})\\s?g`, 'i'));
    if (before || after) grams = finiteNumber((before && before[1]) || (after && after[1]), 100, 1, 2000);
    else if (key === 'oeuf') {
      const count = low.match(/(\d{1,2})\s*(?:oeuf|oeufs)/);
      grams = count ? Number(count[1]) * 50 : 100;
    }
    const q = grams / 100;
    found.push({
      name: food.n,
      grams,
      kcal: Math.round(food.k * q),
      protein: +(food.p * q).toFixed(1),
      carbs: +(food.c * q).toFixed(1),
      fat: +(food.f * q).toFixed(1),
      fiber: +(food.fi * q).toFixed(1),
      sugar: null,
      satFat: null,
      salt: null,
      confidence: 0.68,
    });
  }
  if (!found.length) {
    found.push({
      name: text || 'Repas à confirmer',
      grams: 300,
      kcal: 420,
      protein: 24,
      carbs: 44,
      fat: 16,
      fiber: 6,
      sugar: null,
      satFat: null,
      salt: null,
      confidence: 0.35,
    });
  }
  return normalizeAnalysis({
    title: text ? 'Repas analysé' : 'Photo à confirmer',
    foods: found,
    confidence: Math.min(...found.map((x) => x.confidence)),
    assumptions: ['Valeurs nutritionnelles indicatives. Ajustez les quantités réellement consommées.'],
    note: 'Les grammes issus d’une photo restent une estimation. Corrigez-les avant d’enregistrer.',
    source: 'fallback',
  });
}

function normalizeFood(item = {}) {
  return {
    name: safeText(item.name || 'Aliment', 120),
    grams: finiteNumber(item.grams, 100, 1, 3000),
    kcal: Math.round(finiteNumber(item.kcal, 0, 0, 6000)),
    protein: +finiteNumber(item.protein, 0, 0, 500).toFixed(1),
    carbs: +finiteNumber(item.carbs, 0, 0, 1000).toFixed(1),
    fat: +finiteNumber(item.fat, 0, 0, 500).toFixed(1),
    fiber: +finiteNumber(item.fiber, 0, 0, 200).toFixed(1),
    sugar: item.sugar == null ? null : +finiteNumber(item.sugar, 0, 0, 500).toFixed(1),
    satFat: item.satFat == null ? null : +finiteNumber(item.satFat, 0, 0, 300).toFixed(1),
    salt: item.salt == null ? null : +finiteNumber(item.salt, 0, 0, 100).toFixed(2),
    confidence: +finiteNumber(item.confidence, 0.65, 0, 1).toFixed(2),
  };
}

function nutrientTotals(foodsList) {
  const total = foodsList.reduce((acc, f) => {
    for (const key of ['kcal', 'protein', 'carbs', 'fat', 'fiber']) acc[key] += Number(f[key] || 0);
    for (const key of ['sugar', 'satFat', 'salt']) {
      if (f[key] != null) {
        acc[key] = (acc[key] ?? 0) + Number(f[key] || 0);
      }
    }
    return acc;
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: null, satFat: null, salt: null });
  total.kcal = Math.round(total.kcal);
  for (const key of ['protein', 'carbs', 'fat', 'fiber']) total[key] = +total[key].toFixed(1);
  for (const key of ['sugar', 'satFat']) if (total[key] != null) total[key] = +total[key].toFixed(1);
  if (total.salt != null) total.salt = +total.salt.toFixed(2);
  return total;
}

function normalizeAnalysis(raw = {}) {
  const foodsList = Array.isArray(raw.foods) && raw.foods.length ? raw.foods.slice(0, 20).map(normalizeFood) : [normalizeFood({})];
  const total = nutrientTotals(foodsList);
  const confidence = +finiteNumber(raw.confidence, Math.min(...foodsList.map((x) => x.confidence)), 0, 1).toFixed(2);
  const baseMin = Math.round(total.kcal * (confidence >= 0.85 ? 0.93 : 0.85));
  const baseMax = Math.round(total.kcal * (confidence >= 0.85 ? 1.07 : 1.18));
  return {
    title: safeText(raw.title || 'Repas analysé', 120),
    foods: foodsList,
    total,
    confidence,
    range: {
      min: Math.max(0, Math.round(finiteNumber(raw?.range?.min, baseMin, 0, 10000))),
      max: Math.max(0, Math.round(finiteNumber(raw?.range?.max, baseMax, 0, 10000))),
    },
    assumptions: Array.isArray(raw.assumptions) ? raw.assumptions.slice(0, 8).map((x) => safeText(x, 240)) : [],
    note: safeText(raw.note || 'Ajustez les portions si nécessaire.', 500),
    source: safeText(raw.source || 'ai', 40),
  };
}

function outputText(data) {
  if (typeof data?.output_text === 'string') return data.output_text;
  const out = [];
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === 'string') out.push(content.text);
    }
  }
  return out.join('\n');
}

function parseJson(text = '') {
  try {
    return JSON.parse(text);
  } catch {}
  const match = String(text).match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Réponse IA illisible');
  return JSON.parse(match[0]);
}

async function fetchJson(url, options = {}, timeoutMs = 25_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const data = await response.json().catch(() => ({}));
    return { response, data };
  } finally {
    clearTimeout(timer);
  }
}

async function callAI(input, max = 1600) {
  if (!OPENAI_API_KEY || !OPENAI_MODEL) throw new Error('IA non configurée');
  const { response, data } = await fetchJson('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: OPENAI_MODEL, input, max_output_tokens: max }),
  }, 45_000);
  if (!response.ok) {
    const error = publicError('Le service IA est temporairement indisponible.', 502);
    error.internalMessage = safeText(data?.error?.message || `OpenAI HTTP ${response.status}`, 500);
    throw error;
  }
  try {
    return parseJson(outputText(data));
  } catch (cause) {
    const error = publicError('La réponse IA n’a pas pu être interprétée. Réessayez.', 502);
    error.cause = cause;
    throw error;
  }
}

async function aiAnalyze({ text = '', image = '', mode = 'meal' }) {
  const imageValue = String(image || '');
  if (imageValue && !/^data:image\/(?:jpeg|png|webp);base64,/i.test(imageValue)) {
    throw publicError('Format d’image non pris en charge.');
  }
  if (imageValue.length > 10_500_000) throw publicError('Image trop volumineuse.', 413);
  if (!OPENAI_API_KEY || !OPENAI_MODEL) return localAnalyze(text);
  const prompt = `Tu es le moteur d'analyse alimentaire de NutriPilot, application française de suivi de perte de poids. Mode: ${safeText(mode, 30)}.
Analyse avec prudence. Une photo ne permet jamais de peser précisément un aliment: estime les grammes, donne une incertitude réaliste et rappelle que l'utilisateur peut corriger.
Retourne UNIQUEMENT un JSON valide au format:
{"title":"...","foods":[{"name":"...","grams":120,"kcal":200,"protein":10,"carbs":20,"fat":8,"fiber":3,"sugar":4,"satFat":2,"salt":0.6,"confidence":0.75}],"confidence":0.75,"range":{"min":170,"max":240},"assumptions":["..."],"note":"..."}.
Pour une étiquette nutritionnelle, lis en priorité les valeurs visibles. Pour une photo de repas, sucre/graisses saturées/sel peuvent être null si trop incertains.
Texte utilisateur: ${safeText(text || '(aucun)', 2000)}`;
  const content = [{ type: 'input_text', text: prompt }];
  if (imageValue) content.push({ type: 'input_image', image_url: imageValue, detail: 'high' });
  const raw = await callAI([{ role: 'user', content }], 2200);
  return normalizeAnalysis({ ...raw, source: 'ai' });
}

function normalizeOption(x = {}) {
  return {
    name: safeText(x.name || 'Suggestion', 120),
    kcal: Math.round(finiteNumber(x.kcal, 450, 100, 1800)),
    protein: +finiteNumber(x.protein, 25, 0, 200).toFixed(1),
    carbs: +finiteNumber(x.carbs, 40, 0, 300).toFixed(1),
    fat: +finiteNumber(x.fat, 15, 0, 150).toFixed(1),
    fiber: +finiteNumber(x.fiber, 7, 0, 80).toFixed(1),
    prep: safeText(x.prep || '15 min', 40),
    ingredients: Array.isArray(x.ingredients) ? x.ingredients.slice(0, 14).map((i) => safeText(typeof i === 'string' ? i : i?.name || '', 100)).filter(Boolean) : [],
    why: safeText(x.why || x.tip || '', 360),
  };
}

async function compose(body) {
  const remaining = finiteNumber(body.remaining, 500, 180, 1800);
  const proteinLeft = finiteNumber(body.proteinLeft, 30, 0, 220);
  const carbsLeft = finiteNumber(body.carbsLeft, 45, 0, 350);
  const fatLeft = finiteNumber(body.fatLeft, 15, 0, 160);
  const fiberLeft = finiteNumber(body.fiberLeft, 8, 0, 80);
  const hour = Math.round(finiteNumber(body.hour, 12, 0, 23));
  const todayMeals = Array.isArray(body.todayMeals)
    ? body.todayMeals.slice(-8).map((meal) => ({
      type: safeText(meal?.type, 50),
      title: safeText(meal?.title, 100),
      kcal: Math.round(finiteNumber(meal?.kcal, 0, 0, 3000)),
    }))
    : [];
  if (!OPENAI_API_KEY || !OPENAI_MODEL) {
    return {
      source: 'fallback',
      options: [
        { name: 'Assiette méditerranéenne', kcal: Math.min(remaining, 480), protein: Math.min(proteinLeft || 38, 42), carbs: 46, fat: 15, fiber: 9, prep: '15 min', ingredients: ['Poulet ou tofu', 'Pommes de terre', 'Courgettes', 'Tomates', 'Yaourt citronné'], why: 'Bon volume, protéines et fibres.' },
        { name: 'Pâtes plaisir équilibrées', kcal: Math.min(remaining, 520), protein: 34, carbs: 62, fat: 12, fiber: 8, prep: '15 min', ingredients: ['Pâtes', 'Thon ou lentilles', 'Sauce tomate', 'Épinards'], why: 'Garde l’envie avec une portion cadrée.' },
        { name: 'Bol frais express', kcal: Math.min(remaining, 440), protein: 30, carbs: 48, fat: 13, fiber: 11, prep: '10 min', ingredients: ['Riz ou quinoa', 'Saumon ou tofu', 'Concombre', 'Carotte'], why: 'Simple, rassasiant et adaptable.' },
      ].map(normalizeOption),
    };
  }
  const input = `Crée 3 repas réalistes en France, adaptés à une perte de poids progressive, sans restriction extrême.
Repère restant: environ ${Math.round(remaining)} kcal, ${Math.round(proteinLeft)} g protéines, ${Math.round(carbsLeft)} g glucides, ${Math.round(fatLeft)} g lipides et ${Math.round(fiberLeft)} g fibres. Heure locale: ${hour} h.
Repas déjà enregistrés aujourd’hui: ${safeText(JSON.stringify(todayMeals), 1600) || 'aucun'}.
Préférence: ${safeText(body.preference || 'aucune', 120)}. Envie: ${safeText(body.craving || 'libre', 200)}. Allergies/à éviter: ${safeText(body.avoid || 'aucun', 240)}. Temps: ${safeText(body.cooking || 'libre', 80)}.
Évite de répéter inutilement les mêmes aliments et adapte le type de repas à l’heure et aux repas déjà pris.
Retourne UNIQUEMENT JSON: {"options":[{"name":"...","kcal":450,"protein":30,"carbs":45,"fat":15,"fiber":8,"prep":"15 min","ingredients":["..."],"why":"..."}]}.`;
  const raw = await callAI(input, 1500);
  return { source: 'ai', options: (raw.options || []).slice(0, 3).map(normalizeOption) };
}

async function coach(body) {
  const context = JSON.stringify({
    goal: safeText(body.goal, 40),
    dailyKcal: finiteNumber(body.dailyKcal, 1700, 1000, 5000),
    remaining: finiteNumber(body.remaining, 0, 0, 5000),
    proteinLeft: finiteNumber(body.proteinLeft, 0, 0, 300),
    diet: safeText(body.diet, 80),
    allergies: safeText(body.allergies, 240),
    week: Array.isArray(body.week) ? body.week.slice(-7) : [],
    weightTrend: Array.isArray(body.weightTrend) ? body.weightTrend.slice(-12) : [],
    planSummary: Array.isArray(body.planSummary) ? body.planSummary.slice(0, 8) : [],
  }).slice(0, 14_000);

  if (!OPENAI_API_KEY || !OPENAI_MODEL) {
    return { answer: 'Je peux vous aider à transformer votre objectif du jour en choix concrets. Utilisez « Que manger ensuite ? », votre plan 7 jours ou le scanner pour partir de données réelles.' };
  }

  const input = `Tu es le coach nutritionnel de NutriPilot. Réponds en français, de façon concrète, bienveillante et courte. Tu aides à la perte de poids progressive et à la régularité, sans diagnostic, prescription médicale, culpabilisation ni restriction extrême.
Contexte utilisateur: ${context}
Question: ${safeText(body.message, 1200)}
Si la question concerne grossesse, trouble alimentaire, maladie, traitement, symptômes ou situation médicale, recommande un professionnel de santé approprié.
Retourne UNIQUEMENT JSON: {"answer":"..."}.`;
  const raw = await callAI(input, 900);
  return { answer: safeText(raw.answer || '', 1600) };
}

function normalizeIngredient(x) {
  if (typeof x === 'string') return { name: safeText(x, 100), grams: 0 };
  return { name: safeText(x?.name || '', 100), grams: Math.round(finiteNumber(x?.grams, 0, 0, 3000)) };
}

function normalizePlanMeal(x = {}) {
  return {
    type: safeText(x.type || 'Repas', 60),
    name: safeText(x.name || 'Repas', 120),
    kcal: Math.round(finiteNumber(x.kcal, 400, 100, 1800)),
    protein: +finiteNumber(x.protein, 25, 0, 180).toFixed(1),
    carbs: +finiteNumber(x.carbs, 40, 0, 300).toFixed(1),
    fat: +finiteNumber(x.fat, 15, 0, 150).toFixed(1),
    fiber: +finiteNumber(x.fiber, 6, 0, 80).toFixed(1),
    ingredients: Array.isArray(x.ingredients) ? x.ingredients.slice(0, 18).map(normalizeIngredient).filter((i) => i.name) : [],
    prep: safeText(x.prep || '15 min', 40),
  };
}

async function weekPlan(body) {
  const kcal = finiteNumber(body.dailyKcal, 1700, 1200, 3200);
  const protein = finiteNumber(body.protein, 110, 60, 220);
  const diet = safeText(body.diet || 'balanced', 80);
  const allergies = safeText(body.allergies || 'aucune', 240);
  const cooking = safeText(body.cooking || '15-30 min', 80);
  const cuisine = safeText(body.cuisine || 'variée', 80);
  const budget = safeText(body.budget || 'standard', 80);
  const mealsPerDay = Math.round(finiteNumber(body.mealsPerDay, 3, 2, 4));
  const names = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const bases = [
    ['Skyr, avoine et fruits rouges', 'Poulet citron, quinoa et légumes', 'Saumon, pommes de terre et brocoli', 'Pomme et amandes'],
    ['Omelette, pain complet et fruit', 'Bowl thon, riz et crudités', 'Dinde, patate douce et courgettes', 'Yaourt grec'],
    ['Fromage blanc, banane et avoine', 'Pâtes tomate, thon et épinards', 'Poulet, légumes rôtis et riz', 'Fruit et skyr'],
    ['Œufs, avocat et pain complet', 'Lentilles, légumes et feta', 'Saumon, quinoa et salade', 'Yaourt et fruits'],
    ['Skyr, avoine et pomme', 'Poulet méditerranéen et pommes de terre', 'Pâtes bolognaise légère', 'Amandes et fruit'],
    ['Omelette et tartine complète', 'Bowl saumon avocat', 'Pizza maison équilibrée et salade', 'Fromage blanc'],
    ['Porridge protéiné', 'Poulet rôti, riz et légumes', 'Soupe et tartines protéinées', 'Fruit et yaourt'],
  ];
  const structures = {
    2: { indexes: [1, 2], parts: [0.50, 0.50], types: ['Déjeuner', 'Dîner'] },
    3: { indexes: [0, 1, 2], parts: [0.25, 0.38, 0.37], types: ['Petit-déjeuner', 'Déjeuner', 'Dîner'] },
    4: { indexes: [0, 1, 2, 3], parts: [0.23, 0.34, 0.32, 0.11], types: ['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collation'] },
  };
  const structure = structures[mealsPerDay];
  const fallback = {
    source: 'fallback',
    days: names.map((day, i) => ({
      day,
      meals: structure.indexes.map((sourceIndex, j) => {
        const name = bases[i][sourceIndex];
        const part = structure.parts[j];
        return normalizePlanMeal({
          type: structure.types[j],
          name,
          kcal: Math.round(kcal * part),
          protein: Math.round(protein * part),
          carbs: Math.round(kcal * part * 0.45 / 4),
          fat: Math.round(kcal * part * 0.30 / 9),
          fiber: structure.types[j] === 'Collation' ? 3 : Math.max(7, Math.round(25 / structure.indexes.length)),
          ingredients: [{ name: name.split(',')[0], grams: 150 }],
          prep: structure.types[j] === 'Petit-déjeuner' || structure.types[j] === 'Collation' ? '10 min' : '20 min',
        });
      }),
    })),
    principles: ['Protéines réparties dans la journée', 'Légumes et fibres aux repas principaux', 'Portions ajustables selon faim et activité'],
    note: 'Plan indicatif à personnaliser selon vos préférences et votre faim.',
  };

  if (!OPENAI_API_KEY || !OPENAI_MODEL) return fallback;

  const input = `Crée un plan alimentaire français réaliste sur 7 jours pour un adulte visant une perte de poids progressive.
Cible indicative: ${Math.round(kcal)} kcal/j, ${Math.round(protein)} g protéines/j. Nombre de prises: exactement ${mealsPerDay}/jour.
Style: ${diet}. Allergies/à éviter: ${allergies}. Cuisine préférée: ${cuisine}. Budget: ${budget}. Temps cuisine: ${cooking}.
Le plan doit rester agréable, varié, faisable en France et ne doit pas recommander de restriction extrême.
Chaque journée doit contenir exactement ${mealsPerDay} repas. Chaque repas doit contenir kcal, protéines, glucides, lipides, fibres, temps et ingrédients avec grammes approximatifs.
Retourne UNIQUEMENT JSON: {"days":[{"day":"Lundi","meals":[{"type":"Petit-déjeuner","name":"...","kcal":350,"protein":25,"carbs":40,"fat":10,"fiber":7,"ingredients":[{"name":"Skyr","grams":200}],"prep":"10 min"}]}],"principles":["..."],"note":"..."}.`;
  const raw = await callAI(input, 4200);
  const days = Array.isArray(raw.days) ? raw.days.slice(0, 7).map((d, i) => ({
    day: safeText(d.day || names[i], 30),
    meals: Array.isArray(d.meals) ? d.meals.slice(0, mealsPerDay).map(normalizePlanMeal) : [],
  })) : [];
  if (days.length !== 7 || days.some((day) => day.meals.length !== mealsPerDay)) {
    return { ...fallback, source: 'fallback-validation', note: 'La réponse générée ne respectait pas la structure demandée; un plan complet et cohérent a été fourni.' };
  }
  return {
    source: 'ai',
    days,
    principles: Array.isArray(raw.principles) ? raw.principles.slice(0, 6).map((x) => safeText(x, 220)) : [],
    note: safeText(raw.note || '', 500),
  };
}

async function recipeDetail(body) {
  const name = safeText(body.name || 'Recette', 120);
  const kcal = finiteNumber(body.kcal, 450, 100, 1800);
  const diet = safeText(body.diet || 'balanced', 80);
  const allergies = safeText(body.allergies || 'aucune', 240);
  const cooking = safeText(body.cooking || '15-30 min', 80);

  if (!OPENAI_API_KEY || !OPENAI_MODEL) {
    return {
      source: 'fallback',
      name,
      servings: 1,
      prep: cooking,
      kcal: Math.round(kcal),
      protein: 35,
      carbs: 45,
      fat: 15,
      fiber: 8,
      ingredients: [
        { name: 'Source de protéines', grams: 150 },
        { name: 'Féculent cuit', grams: 130 },
        { name: 'Légumes', grams: 250 },
        { name: 'Huile d’olive', grams: 8 },
      ],
      steps: ['Préparez les ingrédients.', 'Cuisez la source de protéines et les légumes.', 'Ajoutez le féculent, assaisonnez et servez.'],
      tips: ['Ajustez les grammes selon votre budget calorique du jour.'],
    };
  }

  const input = `Crée une recette précise et simple appelée "${name}", pour 1 portion, autour de ${Math.round(kcal)} kcal, adaptée à une perte de poids progressive.
Style: ${diet}. Allergies/à éviter: ${allergies}. Temps visé: ${cooking}.
Donne des ingrédients avec grammes, étapes courtes et valeurs nutritionnelles estimées. Ne prétends pas à une précision médicale.
Retourne UNIQUEMENT JSON: {"name":"...","servings":1,"prep":"20 min","kcal":450,"protein":35,"carbs":45,"fat":15,"fiber":8,"ingredients":[{"name":"...","grams":150}],"steps":["..."],"tips":["..."]}.`;
  const raw = await callAI(input, 1900);
  return normalizeRecipe(raw, name, kcal);
}

function normalizeRecipe(raw = {}, fallbackName = 'Recette', fallbackKcal = 450) {
  return {
    source: safeText(raw.source || 'ai', 40),
    name: safeText(raw.name || fallbackName, 120),
    servings: Math.round(finiteNumber(raw.servings, 1, 1, 8)),
    prep: safeText(raw.prep || '20 min', 40),
    kcal: Math.round(finiteNumber(raw.kcal, fallbackKcal, 100, 2000)),
    protein: +finiteNumber(raw.protein, 30, 0, 200).toFixed(1),
    carbs: +finiteNumber(raw.carbs, 40, 0, 300).toFixed(1),
    fat: +finiteNumber(raw.fat, 15, 0, 150).toFixed(1),
    fiber: +finiteNumber(raw.fiber, 7, 0, 80).toFixed(1),
    ingredients: Array.isArray(raw.ingredients) ? raw.ingredients.slice(0, 20).map(normalizeIngredient).filter((x) => x.name) : [],
    steps: Array.isArray(raw.steps) ? raw.steps.slice(0, 12).map((x) => safeText(x, 300)) : [],
    tips: Array.isArray(raw.tips) ? raw.tips.slice(0, 6).map((x) => safeText(x, 250)) : [],
  };
}

async function smartSwap(body) {
  const meal = safeText(body.meal || '', 500);
  const remaining = finiteNumber(body.remaining, 500, 150, 1800);
  if (!meal) throw publicError('Repas à adapter manquant');
  if (!OPENAI_API_KEY || !OPENAI_MODEL) {
    return {
      source: 'fallback',
      original: meal,
      options: [
        { name: `${meal} — portion ajustée`, kcal: Math.min(remaining, 500), protein: 30, carbs: 48, fat: 18, fiber: 8, prep: '20 min', tip: 'Gardez le plat souhaité, ajustez légèrement la partie la plus énergétique et ajoutez des légumes.', ingredients: [{ name: meal, grams: 250 }, { name: 'Légumes', grams: 200 }] },
        { name: `${meal} — version protéinée`, kcal: Math.min(remaining, 480), protein: 38, carbs: 42, fat: 15, fiber: 8, prep: '20 min', tip: 'Ajoutez une source de protéines et simplifiez la sauce ou l’accompagnement.', ingredients: [{ name: meal, grams: 220 }, { name: 'Source de protéines', grams: 120 }, { name: 'Légumes', grams: 180 }] },
        { name: `${meal} — plaisir planifié`, kcal: Math.min(remaining, 550), protein: 25, carbs: 58, fat: 22, fiber: 7, prep: '20 min', tip: 'Conservez le repas plaisir et équilibrez le reste de la journée sans compensation excessive.', ingredients: [{ name: meal, grams: 280 }, { name: 'Salade ou légumes', grams: 150 }] },
      ].map((option) => ({ ...normalizePlanMeal({ type: 'Repas', ...option }), tip: option.tip })),
    };
  }
  const input = `L'utilisateur veut manger: ${meal}. Budget énergétique restant indicatif: ${Math.round(remaining)} kcal.
Propose 3 façons réalistes de garder l'envie tout en l'adaptant à la journée, sans culpabilisation ni restriction extrême.
Chaque option doit pouvoir remplacer concrètement un repas du plan et inclure les macros, le temps et des ingrédients avec grammes.
Retourne UNIQUEMENT JSON: {"original":"...","options":[{"name":"...","kcal":480,"protein":30,"carbs":45,"fat":16,"fiber":8,"prep":"20 min","tip":"...","ingredients":[{"name":"...","grams":150}]}]}.`;
  const raw = await callAI(input, 1300);
  return {
    source: 'ai',
    original: meal,
    options: (raw.options || []).slice(0, 3).map((x) => ({ ...normalizePlanMeal({ type: 'Repas', ...x }), tip: safeText(x.tip, 360) })),
  };
}

async function fridge(body) {
  const ingredients = safeText(body.ingredients || '', 900);
  const remaining = finiteNumber(body.remaining, 500, 180, 1800);
  const diet = safeText(body.diet || 'équilibré', 80);
  const allergies = safeText(body.allergies || 'aucune', 240);
  if (!ingredients) throw publicError('Ajoutez quelques ingrédients disponibles chez vous.');
  if (!OPENAI_API_KEY || !OPENAI_MODEL) {
    return { source: 'fallback', options: [
      normalizeOption({ name: 'Bowl anti-gaspi', kcal: Math.min(remaining, 480), protein: 32, carbs: 45, fat: 14, fiber: 9, prep: '15 min', ingredients: ingredients.split(',').slice(0, 5), why: 'Utilise en priorité ce que vous avez déjà.' }),
      normalizeOption({ name: 'Poêlée express', kcal: Math.min(remaining, 430), protein: 28, carbs: 35, fat: 15, fiber: 8, prep: '12 min', ingredients: ingredients.split(',').slice(0, 5), why: 'Rapide et flexible.' }),
      normalizeOption({ name: 'Assiette protéinée', kcal: Math.min(remaining, 500), protein: 38, carbs: 42, fat: 16, fiber: 7, prep: '20 min', ingredients: ingredients.split(',').slice(0, 5), why: 'Priorise la satiété et les protéines.' }),
    ] };
  }
  const input = `Ingrédients disponibles: ${ingredients}. Budget restant: environ ${Math.round(remaining)} kcal. Style alimentaire: ${diet}. Allergies/à éviter: ${allergies}.
Crée 3 idées de repas simples pour une perte de poids progressive en utilisant autant que possible ces ingrédients. Retourne UNIQUEMENT JSON au format {"options":[{"name":"...","kcal":450,"protein":30,"carbs":45,"fat":15,"fiber":8,"prep":"15 min","ingredients":["..."],"why":"..."}]}.`;
  const raw = await callAI(input, 1500);
  return { source: 'ai', options: (raw.options || []).slice(0, 3).map(normalizeOption) };
}

async function restaurant(body) {
  const context = safeText(body.context || '', 700);
  const remaining = finiteNumber(body.remaining, 600, 180, 2000);
  const diet = safeText(body.diet || 'équilibré', 80);
  const allergies = safeText(body.allergies || 'aucune', 240);
  if (!context) throw publicError('Indiquez le restaurant, le type de cuisine ou le plat qui vous tente.');
  if (!OPENAI_API_KEY || !OPENAI_MODEL) {
    return {
      source: 'fallback',
      headline: 'Gardez le restaurant, simplifiez la décision.',
      options: [
        { choice: 'Option équilibrée', why: 'Une source de protéines, un accompagnement simple et des légumes.', tip: 'Demandez la sauce à part si cela vous aide à doser.' },
        { choice: 'Option plaisir cadrée', why: 'Choisissez le plat qui vous fait envie et ajoutez une entrée légère ou une salade.', tip: 'Arrêtez-vous lorsque vous êtes rassasié.' },
        { choice: 'Option partage', why: 'Partagez un accompagnement très énergétique et gardez un plat principal complet.', tip: 'Pas besoin de compenser de façon agressive après.' },
      ],
    };
  }
  const input = `Contexte restaurant: ${context}. Budget énergétique restant indicatif: ${Math.round(remaining)} kcal. Style alimentaire: ${diet}. Allergies/à éviter: ${allergies}.
Propose 3 stratégies de choix simples et réalistes adaptées à une perte de poids progressive. Ne prétends pas connaître les calories exactes d'un plat sans données du restaurant. Pas de culpabilisation.
Retourne UNIQUEMENT JSON: {"headline":"...","options":[{"choice":"...","why":"...","tip":"..."}]}.`;
  const raw = await callAI(input, 1100);
  return {
    source: 'ai',
    headline: safeText(raw.headline || 'Au restaurant', 160),
    options: (raw.options || []).slice(0, 3).map((x) => ({
      choice: safeText(x.choice, 140),
      why: safeText(x.why, 300),
      tip: safeText(x.tip, 300),
    })),
  };
}

async function weeklyReview(body) {
  const context = JSON.stringify({
    goal: safeText(body.goal, 60),
    dailyKcal: finiteNumber(body.dailyKcal, 1700, 1000, 5000),
    protein: finiteNumber(body.protein, 110, 0, 300),
    days: Array.isArray(body.days) ? body.days.slice(-7) : [],
    checkins: Array.isArray(body.checkins) ? body.checkins.slice(-7) : [],
    weightTrend: Array.isArray(body.weightTrend) ? body.weightTrend.slice(-12) : [],
  }).slice(0, 16_000);

  if (!OPENAI_API_KEY || !OPENAI_MODEL) {
    return {
      source: 'fallback',
      headline: 'Votre semaine en bref',
      wins: ['Vous avez commencé à observer vos habitudes.'],
      focus: ['Visez la régularité des repas enregistrés.', 'Répartissez les protéines sur la journée.', 'Gardez une marge pour les repas plaisir.'],
      nextWeek: 'Choisissez une seule habitude simple à répéter pendant 7 jours.',
    };
  }
  const input = `Tu es un coach nutritionnel prudent. Analyse ces données de suivi sur 7 jours: ${context}.
Donne un bilan non médical, sans diagnostic, sans culpabilisation et sans recommander de déficit agressif.
Retourne UNIQUEMENT JSON: {"headline":"...","wins":["..."],"focus":["..."],"nextWeek":"..."}.`;
  const raw = await callAI(input, 1200);
  return {
    source: 'ai',
    headline: safeText(raw.headline, 180),
    wins: Array.isArray(raw.wins) ? raw.wins.slice(0, 4).map((x) => safeText(x, 280)) : [],
    focus: Array.isArray(raw.focus) ? raw.focus.slice(0, 4).map((x) => safeText(x, 280)) : [],
    nextWeek: safeText(raw.nextWeek, 500),
  };
}

async function barcode(code) {
  if (!/^\d{8,14}$/.test(code)) throw publicError('Code-barres invalide');
  const { response, data } = await fetchJson(
    `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=product_name,brands,nutriments,serving_size,image_front_small_url`,
    { headers: { 'User-Agent': 'NutriPilot/7.0 (support@atlasevermore.com)' } },
    12_000
  );
  if (!response.ok || !data?.product) throw publicError('Produit introuvable', 404);
  const n = data.product.nutriments || {};
  const item = normalizeFood({
    name: data.product.product_name || data.product.brands || 'Produit',
    grams: 100,
    kcal: n['energy-kcal_100g'] || 0,
    protein: n.proteins_100g || 0,
    carbs: n.carbohydrates_100g || 0,
    fat: n.fat_100g || 0,
    fiber: n.fiber_100g || 0,
    sugar: n.sugars_100g ?? null,
    satFat: n['saturated-fat_100g'] ?? null,
    salt: n.salt_100g ?? null,
    confidence: 0.96,
  });
  return {
    ...normalizeAnalysis({
      title: item.name,
      foods: [item],
      confidence: 0.96,
      assumptions: ['Valeurs pour 100 g selon les données disponibles dans Open Food Facts.'],
      note: 'Ajustez la quantité réellement consommée.',
      source: 'openfoodfacts',
    }),
    image: safeText(data.product.image_front_small_url || '', 500),
  };
}

function signAccessToken(email) {
  if (!ACCESS_TOKEN_SECRET || ACCESS_TOKEN_SECRET.length < 24) throw new Error('ACCESS_TOKEN_SECRET manquant ou trop court');
  const now = Math.floor(Date.now() / 1000);
  const payload = { email, iat: now, exp: now + 60 * 60 * 24 * 60 };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', ACCESS_TOKEN_SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifyAccessToken(token = '') {
  if (!ACCESS_TOKEN_SECRET || ACCESS_TOKEN_SECRET.length < 24) return null;
  const [body, sig] = String(token).split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', ACCESS_TOKEN_SECRET).update(body).digest('base64url');
  try {
    if (!safeTokenEqual(sig, expected)) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.email || Number(payload.exp || 0) < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function bearer(req) {
  const raw = String(req.headers.authorization || '').trim();
  return raw.toLowerCase().startsWith('bearer ') ? raw.slice(7).trim() : '';
}

async function premiumIdentity(req) {
  const payload = verifyAccessToken(bearer(req));
  if (!payload) return null;
  const entitlements = await loadEntitlements();
  const entitlement = entitlements[payload.email];
  if (entitlement?.status === 'active' && entitlement?.accessUntil && Date.now() > Number(entitlement.accessUntil)) {
    await mutateEntitlements((all) => {
      const entry = all[payload.email];
      if (entry?.status === 'active' && entry?.accessUntil && Date.now() > Number(entry.accessUntil)) {
        entry.status = 'revoked';
        entry.event = 'LOCAL_ACCESS_PERIOD_ENDED';
        entry.updatedAt = new Date().toISOString();
      }
    });
    return null;
  }
  if (!entitlement || entitlement.status !== 'active') return null;
  return { email: payload.email, plan: entitlement.plan || 'premium', entitlement };
}

async function requirePremium(req, res) {
  const identity = await premiumIdentity(req);
  if (!identity) {
    send(res, 401, { error: 'Accès Premium requis. Connectez-vous avec l’e-mail utilisé lors de votre achat.' });
    return null;
  }
  return identity;
}

function userFile(email) {
  return path.join(USERS_DIR, `${crypto.createHash('sha256').update(email).digest('hex')}.json`);
}

async function loadUserState(email) {
  await ensureData();
  try {
    return JSON.parse(await fs.readFile(userFile(email), 'utf8'));
  } catch {
    return null;
  }
}

async function saveUserState(email, data) {
  await ensureData();
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw publicError('État utilisateur invalide');
  const clean = { ...(data || {}) };
  delete clean.accessToken;
  delete clean.premium;
  delete clean.premiumEmail;
  const raw = JSON.stringify(clean);
  if (Buffer.byteLength(raw, 'utf8') > USER_STATE_LIMIT) throw publicError('Données utilisateur trop volumineuses', 413);
  await atomicWriteJson(userFile(email), clean);
}

async function deleteUserState(email) {
  try { await fs.unlink(userFile(email)); } catch (e) { if (e?.code !== 'ENOENT') throw e; }
}

async function sendAccessEmail(email, code) {
  if (!RESEND_API_KEY || !RESEND_FROM) return false;
  const { response } = await fetchJson('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [email],
      subject: `Votre code d’accès ${BRAND_NAME}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h2>${BRAND_NAME}</h2><p>Votre code d’accès est :</p><p style="font-size:30px;font-weight:800;letter-spacing:5px">${code}</p><p>Ce code expire dans 15 minutes.</p><p style="color:#6b756e">Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.</p></div>`,
    }),
  }, 15_000);
  return response.ok;
}

async function requestAccessCode(email) {
  const result = await mutateEntitlements(async (entitlements) => {
    const entry = entitlements[email];
    if (!entry || entry.status !== 'active') return { ok: false };
    const code = String(crypto.randomInt(100000, 1000000));
    entry.codeHash = crypto.createHash('sha256').update(code).digest('hex');
    entry.codeExpiresAt = Date.now() + 15 * 60 * 1000;
    entry.codeAttempts = 0;
    entry.updatedAt = new Date().toISOString();
    return { ok: true, code };
  });
  if (!result?.ok) return { ok: false };
  const mailed = await sendAccessEmail(email, result.code);
  if (!mailed && process.env.NODE_ENV !== 'development') {
    return { ok: true, mailed: false, emailUnavailable: true };
  }
  return { ok: true, mailed, devCode: process.env.NODE_ENV === 'development' && !mailed ? result.code : undefined };
}

async function verifyAccessCode(email, code) {
  return mutateEntitlements((entitlements) => {
    const entry = entitlements[email];
    if (!entry || entry.status !== 'active' || !entry.codeHash || Date.now() > Number(entry.codeExpiresAt || 0)) return false;
    entry.codeAttempts = Number(entry.codeAttempts || 0) + 1;
    if (entry.codeAttempts > 8) {
      delete entry.codeHash;
      delete entry.codeExpiresAt;
      return false;
    }
    const hash = crypto.createHash('sha256').update(String(code)).digest('hex');
    if (!safeTokenEqual(hash, entry.codeHash)) return false;
    delete entry.codeHash;
    delete entry.codeExpiresAt;
    delete entry.codeAttempts;
    entry.lastActivatedAt = new Date().toISOString();
    return true;
  });
}

function aiRateOk(req, email) {
  return rateLimit(`ai:${email}:${clientIp(req)}`, 80, 60 * 60 * 1000);
}

async function handleHotmart(req, res) {
  if (!verifyHotmartWebhook(req)) return send(res, 401, { error: 'Hottok Hotmart invalide.' });
  const raw = await readRaw(req);
  let payload = {};
  try { payload = raw ? JSON.parse(raw) : {}; } catch { return send(res, 400, { error: 'JSON invalide' }); }

  const event = eventName(payload);
  const email = buyerEmail(payload);
  if (!email) return send(res, 422, { error: 'Email acheteur introuvable dans le payload Hotmart' });

  const action = await mutateEntitlements((entitlements) => {
    if (APPROVED_EVENTS.has(event)) {
      const plan = planFrom(payload);
      entitlements[email] = {
        ...(entitlements[email] || {}),
        status: 'active',
        plan,
        orderId: orderId(payload),
        subscriberCode: subscriptionCode(payload),
        accessUntil: accessUntilFromHotmart(payload, plan),
        cancelAtPeriodEnd: false,
        paymentStatus: 'paid',
        event,
        updatedAt: new Date().toISOString(),
      };
      return 'granted';
    }
    if (event === 'SUBSCRIPTION_CANCELLATION') {
      const prev = entitlements[email] || {};
      const explicitUntil = Number(prev.accessUntil || nextChargeFromHotmart(payload) || 0);
      const activeUntilEnd = explicitUntil > Date.now();
      entitlements[email] = {
        ...prev,
        status: activeUntilEnd ? 'active' : 'revoked',
        accessUntil: explicitUntil || prev.accessUntil || null,
        cancelAtPeriodEnd: true,
        event,
        updatedAt: new Date().toISOString(),
      };
      return activeUntilEnd ? 'cancel_at_period_end' : 'revoked';
    }
    if (REVOKED_EVENTS.has(event)) {
      entitlements[email] = {
        ...(entitlements[email] || {}),
        status: 'revoked',
        event,
        updatedAt: new Date().toISOString(),
      };
      return 'revoked';
    }
    if (event === 'PURCHASE_DELAYED') {
      entitlements[email] = {
        ...(entitlements[email] || {}),
        status: 'revoked',
        paymentStatus: 'delayed',
        event,
        updatedAt: new Date().toISOString(),
      };
      return 'suspended_payment_delayed';
    }
    return 'ignored';
  });

  await atomicWriteJson(LAST_WEBHOOK_FILE, {
    receivedAt: new Date().toISOString(),
    event,
    action,
    buyerHash: crypto.createHash('sha256').update(email).digest('hex'),
    orderId: orderId(payload),
    payloadBytes: Buffer.byteLength(raw, 'utf8'),
    hottok: 'validated',
  });

  return send(res, 200, { ok: true, action, event });
}

async function dataDirectoryWritable() {
  const probe = path.join(DATA_DIR, `.health-${process.pid}-${Date.now()}.tmp`);
  try {
    await ensureData();
    await fs.writeFile(probe, 'ok', { encoding: 'utf8', flag: 'wx' });
    await fs.unlink(probe);
    return true;
  } catch {
    try { await fs.unlink(probe); } catch {}
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, APP_URL);

    if (url.pathname === '/api/config' && req.method === 'GET') {
      return send(res, 200, {
        brand: BRAND_NAME,
        locale: 'fr-FR',
        ai: Boolean(OPENAI_API_KEY && OPENAI_MODEL),
        supportEmail: SUPPORT_EMAIL,
        manageSubscriptionUrl: process.env.HOTMART_MANAGE_SUBSCRIPTION_URL || 'https://consumer.hotmart.com/',
        salesUrl: process.env.SALES_URL || 'https://atlasevermore.com/#tarifs',
        locked: true,
        legal: {
          company: process.env.LEGAL_COMPANY_NAME || '',
          address: process.env.LEGAL_COMPANY_ADDRESS || '',
          id: process.env.LEGAL_COMPANY_ID || '',
        },
      });
    }

    if (url.pathname === '/api/health') {
      const dataWritable = await dataDirectoryWritable();
      const hotmart = Boolean(process.env.HOTMART_HOTTOK);
      const email = Boolean(RESEND_API_KEY && RESEND_FROM);
      const accessSecret = Boolean(ACCESS_TOKEN_SECRET && ACCESS_TOKEN_SECRET.length >= 24);
      const ai = Boolean(OPENAI_API_KEY && OPENAI_MODEL);
      const persistentPath = path.resolve(DATA_DIR) === '/data';
      return send(res, 200, {
        ok: true,
        ready: hotmart && email && accessSecret && ai && persistentPath && dataWritable,
        version: '7.0.0',
        brand: BRAND_NAME,
        ai,
        hotmart,
        email,
        accessSecret,
        dataDir: DATA_DIR,
        persistence: { configured: persistentPath, writable: dataWritable },
      });
    }

    if (url.pathname === '/api/hotmart/webhook' && req.method === 'POST') return handleHotmart(req, res);

    if (url.pathname === '/api/access/request' && req.method === 'POST') {
      const body = await readJson(req);
      const email = safeEmail(body.email);
      if (!email) return send(res, 400, { error: 'Email invalide' });
      if (!rateLimit(`code:${clientIp(req)}:${email}`, 5, 15 * 60 * 1000)) return send(res, 429, { error: 'Trop de demandes. Réessayez dans quelques minutes.' });
      const result = await requestAccessCode(email);
      if (!result.ok) return send(res, 404, { error: 'Aucun achat actif trouvé pour cet e-mail.' });
      if (result.emailUnavailable) return send(res, 503, { error: `L’envoi d’e-mail n’est pas encore configuré. Contactez ${SUPPORT_EMAIL}.` });
      return send(res, 200, { ok: true, mailed: result.mailed, devCode: result.devCode });
    }

    if (url.pathname === '/api/access/verify' && req.method === 'POST') {
      const body = await readJson(req);
      const email = safeEmail(body.email);
      const code = String(body.code || '');
      if (!email || !/^\d{6}$/.test(code)) return send(res, 400, { error: 'Données invalides' });
      if (!rateLimit(`verify:${clientIp(req)}:${email}`, 12, 15 * 60 * 1000)) return send(res, 429, { error: 'Trop de tentatives. Demandez un nouveau code plus tard.' });
      const ok = await verifyAccessCode(email, code);
      if (!ok) return send(res, 401, { error: 'Code invalide ou expiré' });
      const entitlements = await loadEntitlements();
      return send(res, 200, {
        ok: true,
        premium: true,
        email,
        plan: entitlements[email]?.plan || 'premium',
        token: signAccessToken(email),
      });
    }

    if (url.pathname === '/api/access/status' && req.method === 'POST') {
      const body = await readJson(req);
      const payload = verifyAccessToken(body.token || '');
      if (!payload) return send(res, 401, { premium: false, error: 'Session Premium invalide ou expirée' });
      const entitlements = await loadEntitlements();
      const entry = entitlements[payload.email];
      if (entry?.status === 'active' && entry?.accessUntil && Date.now() > Number(entry.accessUntil)) {
        await mutateEntitlements((all) => {
          const current = all[payload.email];
          if (current) {
            current.status = 'revoked';
            current.event = 'LOCAL_ACCESS_PERIOD_ENDED';
            current.updatedAt = new Date().toISOString();
          }
        });
        return send(res, 200, { premium: false, email: payload.email, status: 'revoked' });
      }
      return send(res, 200, {
        premium: Boolean(entry && entry.status === 'active'),
        email: payload.email,
        plan: entry?.plan || '',
        status: entry?.status || 'missing',
        cancelAtPeriodEnd: Boolean(entry?.cancelAtPeriodEnd),
      });
    }

    if (url.pathname.startsWith('/api/')) {
      const identity = await requirePremium(req, res);
      if (!identity) return;

      if (['/api/analyze', '/api/compose', '/api/coach', '/api/barcode', '/api/week-plan', '/api/smart-swap', '/api/weekly-review', '/api/recipe', '/api/fridge', '/api/restaurant'].includes(url.pathname)) {
        if (!aiRateOk(req, identity.email)) return send(res, 429, { error: 'Trop de requêtes en peu de temps. Réessayez dans quelques minutes.' });
      }

      if (url.pathname === '/api/analyze' && req.method === 'POST') return send(res, 200, await aiAnalyze(await readJson(req)));
      if (url.pathname === '/api/compose' && req.method === 'POST') return send(res, 200, await compose(await readJson(req)));
      if (url.pathname === '/api/coach' && req.method === 'POST') return send(res, 200, await coach(await readJson(req)));
      if (url.pathname === '/api/barcode' && req.method === 'GET') return send(res, 200, await barcode(url.searchParams.get('code') || ''));
      if (url.pathname === '/api/week-plan' && req.method === 'POST') return send(res, 200, await weekPlan(await readJson(req)));
      if (url.pathname === '/api/recipe' && req.method === 'POST') return send(res, 200, await recipeDetail(await readJson(req)));
      if (url.pathname === '/api/smart-swap' && req.method === 'POST') return send(res, 200, await smartSwap(await readJson(req)));
      if (url.pathname === '/api/fridge' && req.method === 'POST') return send(res, 200, await fridge(await readJson(req)));
      if (url.pathname === '/api/restaurant' && req.method === 'POST') return send(res, 200, await restaurant(await readJson(req)));
      if (url.pathname === '/api/weekly-review' && req.method === 'POST') return send(res, 200, await weeklyReview(await readJson(req)));

      if (url.pathname === '/api/user/state' && req.method === 'GET') {
        return send(res, 200, { ok: true, state: await loadUserState(identity.email), plan: identity.plan });
      }
      if (url.pathname === '/api/user/state' && req.method === 'POST') {
        const body = await readJson(req);
        await saveUserState(identity.email, body.state || {});
        return send(res, 200, { ok: true, savedAt: new Date().toISOString() });
      }
      if (url.pathname === '/api/user/state' && req.method === 'DELETE') {
        await deleteUserState(identity.email);
        return send(res, 200, { ok: true });
      }

      return send(res, 404, { error: 'API introuvable' });
    }

    const requested = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    if (!STATIC_FILES.has(requested)) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    const resolved = path.resolve(__dirname, `.${requested}`);
    const root = `${path.resolve(__dirname)}${path.sep}`;
    if (resolved !== path.resolve(__dirname) && !resolved.startsWith(root)) return send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');

    try {
      let filePath = resolved;
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
      const buf = await fs.readFile(filePath);
      return send(res, 200, buf, TYPES[path.extname(filePath)] || 'application/octet-stream');
    } catch {
      return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    }
  } catch (err) {
    const statusCode = Number(err?.statusCode || 500);
    const logMessage = safeText(err?.internalMessage || err?.message || err?.name || 'unknown', 600);
    console.error(`[NutriPilot] ${req.method || 'REQUEST'} failed (${statusCode}): ${logMessage}`);
    const error = statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'Une erreur temporaire est survenue. Réessayez dans quelques instants.'
      : (err?.message || 'Erreur serveur');
    return send(res, statusCode, { error });
  }
});

await ensureData();
if (process.env.NODE_ENV === 'production' && (!ACCESS_TOKEN_SECRET || ACCESS_TOKEN_SECRET.length < 24)) {
  console.warn('[NutriPilot] ACCESS_TOKEN_SECRET est absent ou trop court. Les connexions Premium ne pourront pas être créées.');
}
server.listen(PORT, '0.0.0.0', () => console.log(`${BRAND_NAME} v7 Premium — ${APP_URL}`));

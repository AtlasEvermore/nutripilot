// Sign in with Apple and Google: verifies the identity token (RS256 JWT) against the provider's public keys.
// Works for tokens from the native apps (Capacitor plugins) and from the web redirect flows.
import crypto from 'node:crypto';

const PROVIDERS = {
  apple: {
    jwks: () => process.env.APPLE_JWKS_URL || 'https://appleid.apple.com/auth/keys',
    issuers: ['https://appleid.apple.com'],
    // Bundle id (iOS app) and Services ID (web), comma separated.
    audiences: () => String(process.env.APPLE_CLIENT_IDS || process.env.APPLE_SERVICE_ID || '').split(',').map((x) => x.trim()).filter(Boolean),
  },
  google: {
    jwks: () => process.env.GOOGLE_JWKS_URL || 'https://www.googleapis.com/oauth2/v3/certs',
    issuers: ['https://accounts.google.com', 'accounts.google.com'],
    // Web, Android and iOS OAuth client ids, comma separated.
    audiences: () => String(process.env.GOOGLE_CLIENT_IDS || process.env.GOOGLE_CLIENT_ID || '').split(',').map((x) => x.trim()).filter(Boolean),
  },
};

export function providerEnabled(name) {
  return Boolean(PROVIDERS[name]?.audiences().length);
}

const jwksCache = new Map();
async function keysFor(name, refresh = false) {
  const p = PROVIDERS[name];
  const cached = jwksCache.get(name);
  if (!refresh && cached && Date.now() - cached.at < 6 * 3600 * 1000) return cached.keys;
  const res = await fetch(p.jwks(), { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`jwks ${res.status}`);
  const data = await res.json();
  const keys = Array.isArray(data.keys) ? data.keys : [];
  jwksCache.set(name, { at: Date.now(), keys });
  return keys;
}

const b64json = (part) => JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));

// Returns the verified claims, or throws.
export async function verifyIdToken(name, token, { nonce } = {}) {
  const p = PROVIDERS[name];
  if (!p) throw new Error('provider');
  const audiences = p.audiences();
  if (!audiences.length) throw new Error('not configured');
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('format');
  const header = b64json(parts[0]);
  const claims = b64json(parts[1]);
  if (header.alg !== 'RS256' || !header.kid) throw new Error('alg');
  let jwk = (await keysFor(name)).find((k) => k.kid === header.kid);
  if (!jwk) jwk = (await keysFor(name, true)).find((k) => k.kid === header.kid);
  if (!jwk) throw new Error('kid');
  const key = crypto.createPublicKey({ key: jwk, format: 'jwk' });
  const ok = crypto.verify('RSA-SHA256', Buffer.from(`${parts[0]}.${parts[1]}`), key, Buffer.from(parts[2], 'base64url'));
  if (!ok) throw new Error('signature');
  const now = Math.floor(Date.now() / 1000);
  if (!p.issuers.includes(claims.iss)) throw new Error('iss');
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!aud.some((a) => audiences.includes(a))) throw new Error('aud');
  if (!claims.exp || Number(claims.exp) < now - 60) throw new Error('expired');
  if (claims.iat && Number(claims.iat) > now + 300) throw new Error('iat');
  if (nonce && claims.nonce && claims.nonce !== nonce && claims.nonce !== crypto.createHash('sha256').update(nonce).digest('hex')) throw new Error('nonce');
  if (!claims.sub) throw new Error('sub');
  return claims;
}

// The account key: the verified e-mail, or a stable private address when the provider hides it.
export function accountEmail(name, claims) {
  const email = String(claims.email || '').trim().toLowerCase();
  const verified = claims.email_verified === true || claims.email_verified === 'true' || name === 'apple';
  if (email && verified && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return email;
  const id = crypto.createHash('sha256').update(`${name}:${claims.sub}`).digest('hex').slice(0, 24);
  return `${name}-${id}@users.nutripilot.app`;
}

// Web redirect flows. Apple posts the identity token to our callback (form_post); Google returns a code
// exchanged server to server for the identity token.
export function appleAuthorizeUrl({ redirectUri, state, nonce }) {
  const clientId = process.env.APPLE_SERVICE_ID || '';
  const q = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: 'code id_token', response_mode: 'form_post', scope: 'name email', state, nonce });
  return `https://appleid.apple.com/auth/authorize?${q}`;
}
export function googleAuthorizeUrl({ redirectUri, state, nonce }) {
  const clientId = String(process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_IDS || '').split(',')[0].trim();
  const q = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: 'code', scope: 'openid email profile', state, nonce, prompt: 'select_account' });
  return `https://accounts.google.com/o/oauth2/v2/auth?${q}`;
}
export async function googleExchangeCode({ code, redirectUri }) {
  const clientId = String(process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_IDS || '').split(',')[0].trim();
  const res = await fetch(process.env.GOOGLE_TOKEN_URL || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: process.env.GOOGLE_CLIENT_SECRET || '', redirect_uri: redirectUri, grant_type: 'authorization_code' }),
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.id_token) throw new Error('google exchange');
  return data.id_token;
}
export const webFlowEnabled = {
  apple: () => Boolean(process.env.APPLE_SERVICE_ID),
  google: () => Boolean((process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_IDS) && process.env.GOOGLE_CLIENT_SECRET),
};

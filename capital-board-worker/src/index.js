// Capital Board — Cloudflare Worker
// Endpoints : POST /verify-pin | POST /send-otp | GET /yahoo

const CORS = {
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Hôtes Yahoo Finance autorisés pour /yahoo (évite l'open proxy).
const YAHOO_HOSTS = new Set([
  'query1.finance.yahoo.com',
  'query2.finance.yahoo.com',
]);

// ── Service account → access token ────────────────────────────────────────

function b64url(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function pemToBytes(pem) {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf;
}

async function makeServiceJWT(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header  = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    iss: sa.client_email, sub: sa.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/datastore',
  }));
  const sigInput = `${header}.${payload}`;
  const key = await crypto.subtle.importKey(
    'pkcs8', pemToBytes(sa.private_key).buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(sigInput));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return `${sigInput}.${sigB64}`;
}

let _accessToken = null, _accessTokenExpiry = 0;

async function getAccessToken(env) {
  const now = Date.now() / 1000;
  if (_accessToken && _accessTokenExpiry > now + 120) return _accessToken;
  const sa = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
  const jwt = await makeServiceJWT(sa);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Service account token error: ' + JSON.stringify(data));
  _accessToken = data.access_token;
  _accessTokenExpiry = now + (data.expires_in || 3600);
  return _accessToken;
}

// ── Firebase ID token verification (JWT direct, sans accounts:lookup) ────────

let _jwksCache = null, _jwksCacheAt = 0;

async function getGoogleJwks() {
  if (_jwksCache && Date.now() - _jwksCacheAt < 3600 * 1000) return _jwksCache;
  const res = await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com');
  _jwksCache = await res.json();
  _jwksCacheAt = Date.now();
  return _jwksCache;
}

function b64urlDecode(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64.padEnd(b64.length + (4 - b64.length % 4) % 4, '='));
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}

async function verifyIdToken(idToken, env) {
  const parts = idToken.split('.');
  if (parts.length !== 3) throw new Error('Token malformé');

  const header  = JSON.parse(new TextDecoder().decode(b64urlDecode(parts[0])));
  const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(parts[1])));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp < now)           throw new Error('Token expiré');
  if (payload.iat > now + 300)     throw new Error('Token émis dans le futur');
  if (payload.aud !== env.FIREBASE_PROJECT_ID) throw new Error('Token audience invalide');
  if (!payload.sub)                throw new Error('Token sub manquant');

  const jwks = await getGoogleJwks();
  const jwk  = jwks.keys?.find(k => k.kid === header.kid);
  if (!jwk) throw new Error('Clé publique introuvable');

  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const sigInput = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const sig      = b64urlDecode(parts[2]);
  const valid    = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, sig, sigInput);
  if (!valid) throw new Error('Signature invalide');

  return { localId: payload.sub, email: payload.email };
}

// ── Firestore REST ─────────────────────────────────────────────────────────

async function firestoreGet(path, env) {
  const token = await getAccessToken(env);
  const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${path}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Firestore ${res.status}: ${await res.text()}`);
  return res.json();
}

function fsStr(doc, field) {
  return doc.fields?.[field]?.stringValue ?? null;
}

// ── SHA-256 ────────────────────────────────────────────────────────────────

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Templates email (HTML) ─────────────────────────────────────────────────

const CSS_BASE = `
  body{font-family:sans-serif;background:#0f0f13;color:#e8eaf0;margin:0;padding:40px 20px}
  .card{max-width:480px;margin:0 auto;background:#1a1a24;border-radius:16px;padding:40px;border:1px solid #2a2a3a}
  .logo{font-size:20px;font-weight:700;color:#7c6df5;margin-bottom:32px}
  h2{margin:0 0 16px;font-size:22px;color:#e8eaf0}
  p{margin:0 0 16px;color:#8892a8;line-height:1.6;font-size:15px}
  .code{font-size:36px;font-weight:700;letter-spacing:12px;color:#7c6df5;text-align:center;
    background:#12121c;border-radius:12px;padding:20px;margin:24px 0;font-family:monospace}
  .info{background:#12121c;border-radius:10px;padding:16px;margin:16px 0;font-size:13px;color:#8892a8}
  .info span{display:block;margin:4px 0}
  .warn{color:#ff4d6a;font-size:13px;margin-top:16px}
  .footer{margin-top:32px;color:#4a5266;font-size:12px;text-align:center}
`;

function emailDelete(code) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><style>${CSS_BASE}</style></head><body>
<div class="card">
  <div class="logo">Capital Board</div>
  <h2>Suppression de votre compte</h2>
  <p>Vous avez demandé la suppression définitive de votre compte. Saisissez ce code pour confirmer :</p>
  <div class="code">${code}</div>
  <p>Ce code est valable <strong>10 minutes</strong>.</p>
  <p class="warn">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email — votre compte est en sécurité.</p>
  <div class="footer">Capital Board · Ne pas répondre à cet email.</div>
</div></body></html>`;
}

function email2fa(code, deviceLabel, location) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><style>${CSS_BASE}</style></head><body>
<div class="card">
  <div class="logo">Capital Board</div>
  <h2>Connexion depuis un nouvel appareil</h2>
  <p>Une connexion a été détectée depuis un appareil non reconnu. Saisissez ce code pour valider l'accès :</p>
  <div class="code">${code}</div>
  <div class="info">
    <span>Appareil : <strong style="color:#e8eaf0">${deviceLabel || 'Inconnu'}</strong></span>
    <span>Lieu : <strong style="color:#e8eaf0">${location || 'Inconnu'}</strong></span>
  </div>
  <p>Ce code est valable <strong>10 minutes</strong>.</p>
  <p class="warn">Si vous n'êtes pas à l'origine de cette connexion, changez immédiatement votre mot de passe.</p>
  <div class="footer">Capital Board · Ne pas répondre à cet email.</div>
</div></body></html>`;
}

// ── Resend sender ─────────────────────────────────────────────────────────

async function sendEmail(to, subject, html, env) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `Capital Board <noreply@capitalboard.fr>`,
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

// ── Turnstile verification ─────────────────────────────────────────────────

async function verifyTurnstile(token, env) {
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
  });
  const data = await res.json();
  return data.success === true;
}

// ── Earnings calendar (Finnhub → KV snapshot) ───────────────────────────────

const EARNINGS_KEY = 'snapshot';

// Récupère le calendrier earnings Finnhub sur [from, to] (dates YYYY-MM-DD).
async function fetchFinnhubEarnings(from, to, env) {
  const url = `https://finnhub.io/api/v1/calendar/earnings?from=${from}&to=${to}&token=${env.FINNHUB_API_KEY}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`Finnhub ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const cal = Array.isArray(data.earningsCalendar) ? data.earningsCalendar : [];
  // Normalisation : on ne garde que l'utile (snapshot léger).
  return cal.map(e => ({
    symbol: e.symbol,
    date:   e.date,                              // YYYY-MM-DD
    hour:   e.hour || '',                        // bmo | amc | dmh | ''
    epsEst: e.epsEstimate ?? null,
    epsAct: e.epsActual ?? null,
    revEst: e.revenueEstimate ?? null,
    revAct: e.revenueActual ?? null,
  })).filter(e => e.symbol && e.date);
}

// Rafraîchit le snapshot KV (auj → +70j). Appelé par le Cron Trigger 1×/jour.
async function refreshEarningsSnapshot(env) {
  const today = new Date();
  const from = today.toISOString().slice(0, 10);
  const to   = new Date(today.getTime() + 70 * 86400 * 1000).toISOString().slice(0, 10);
  const items = await fetchFinnhubEarnings(from, to, env);
  const snapshot = { updatedAt: Date.now(), from, to, items };
  await env.EARNINGS.put(EARNINGS_KEY, JSON.stringify(snapshot));
  return snapshot;
}

async function readEarningsSnapshot(env) {
  const raw = await env.EARNINGS.get(EARNINGS_KEY);
  return raw ? JSON.parse(raw) : null;
}

// ── Main handler ───────────────────────────────────────────────────────────

export default {
  // Cron Trigger quotidien : 1 appel Finnhub, snapshot stocké en KV.
  async scheduled(event, env, ctx) {
    ctx.waitUntil(refreshEarningsSnapshot(env).catch(e => console.error('earnings refresh:', e.message)));
  },

  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || 'https://capitalboard.fr';
    const corsHeaders = { ...CORS, 'Access-Control-Allow-Origin': origin === allowed ? origin : allowed };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });

    const url = new URL(request.url);
    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

    try {
      // ── POST /verify-pin ────────────────────────────────────────────────
      if (url.pathname === '/verify-pin' && request.method === 'POST') {
        const { idToken, pin } = await request.json();
        if (!idToken || !/^\d{6}$/.test(pin ?? '')) return json({ valid: false });

        const user = await verifyIdToken(idToken, env);
        const doc  = await firestoreGet(`users/${user.localId}/data/security`, env);
        const pinHash = fsStr(doc, 'pinHash');
        const pinSalt = fsStr(doc, 'pinSalt');
        if (!pinHash || !pinSalt) return json({ valid: false });

        const computed = await sha256(pinSalt + pin);
        return json({ valid: computed === pinHash });
      }

      // ── POST /send-otp ──────────────────────────────────────────────────
      if (url.pathname === '/send-otp' && request.method === 'POST') {
        const { idToken, type, code, deviceLabel, location, turnstileToken } = await request.json();
        if (!idToken || !code || !['delete', '2fa'].includes(type)) {
          return json({ ok: false, error: 'Paramètres invalides' }, 400);
        }
        // Turnstile requis pour suppression (hors session), optionnel pour 2FA (user déjà authentifié au login)
        if (type === 'delete') {
          const humanVerified = await verifyTurnstile(turnstileToken, env);
          if (!humanVerified) return json({ ok: false, error: 'Vérification humaine échouée' }, 403);
        }

        const user = await verifyIdToken(idToken, env);
        if (!user.email) return json({ ok: false, error: 'Email introuvable' }, 400);

        const [subject, html] = type === 'delete'
          ? ['Confirmation suppression de compte — Capital Board', emailDelete(code)]
          : ['Code de vérification — nouvel appareil Capital Board', email2fa(code, deviceLabel, location)];

        await sendEmail(user.email, subject, html, env);
        return json({ ok: true });
      }

      // ── POST /earnings/refresh ──────────────────────────────────────────
      // Force le rafraîchissement du snapshot (admin only). Utile au 1er déploiement
      // avant que le Cron Trigger n'ait tourné.
      if (url.pathname === '/earnings/refresh' && request.method === 'POST') {
        const { idToken } = await request.json().catch(() => ({}));
        if (!idToken) return json({ ok: false, error: 'idToken requis' }, 401);
        const user = await verifyIdToken(idToken, env);
        if (user.localId !== env.ADMIN_UID) return json({ ok: false, error: 'Réservé admin' }, 403);
        const snap = await refreshEarningsSnapshot(env);
        return json({ ok: true, count: snap.items.length, from: snap.from, to: snap.to });
      }

      // ── GET /earnings?symbols=A,B&from=&to= ─────────────────────────────
      // Lit le snapshot KV (rafraîchi 1×/jour par le cron). Filtre par symboles
      // (portefeuille/watchlist/abos/recherche) + plage de dates. Sans symbols
      // → snapshot complet (usage serveur : cron push). Cache CDN 1h.
      if (url.pathname === '/earnings' && request.method === 'GET') {
        const snap = await readEarningsSnapshot(env);
        if (!snap) {
          return new Response(JSON.stringify({ updatedAt: 0, items: [] }), {
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300', ...corsHeaders },
          });
        }
        const symbolsParam = url.searchParams.get('symbols');
        const from = url.searchParams.get('from');
        const to   = url.searchParams.get('to');
        let items = snap.items;
        if (symbolsParam) {
          const set = new Set(symbolsParam.split(',').map(s => s.trim().toUpperCase()).filter(Boolean));
          items = items.filter(e => set.has(e.symbol.toUpperCase()));
        }
        if (from) items = items.filter(e => e.date >= from);
        if (to)   items = items.filter(e => e.date <= to);
        return new Response(JSON.stringify({ updatedAt: snap.updatedAt, items }), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600', ...corsHeaders },
        });
      }

      // ── GET /yahoo?url=... ──────────────────────────────────────────────
      // Proxy Yahoo Finance côté serveur (pas de CORS, pas de crumb).
      // Remplace les proxies CORS gratuits morts (corsproxy.io / cors.eu.org).
      if (url.pathname === '/yahoo' && request.method === 'GET') {
        const target = url.searchParams.get('url');
        if (!target) return json({ error: 'url manquant' }, 400);
        let t;
        try { t = new URL(target); } catch { return json({ error: 'url invalide' }, 400); }
        if (t.protocol !== 'https:' || !YAHOO_HOSTS.has(t.hostname)) {
          return json({ error: 'hôte non autorisé' }, 403);
        }
        const yres = await fetch(t.toString(), {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(8000),
        });
        const body = await yres.text();
        // Cache CDN Cloudflare 30s pour les requêtes identiques (cours/courbe).
        return new Response(body, {
          status: yres.status,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=30',
            ...corsHeaders,
          },
        });
      }

      return json({ error: 'Not found' }, 404);

    } catch (e) {
      console.error(e.message);
      return json({ error: e.message }, 500);
    }
  },
};

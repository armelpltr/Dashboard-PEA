// Capital Board — Cloudflare Worker
// Endpoints : POST /verify-pin | POST /send-otp

const CORS = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

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

// ── Firebase ID token verification ────────────────────────────────────────

async function verifyIdToken(idToken, env) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${env.FIREBASE_WEB_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }) }
  );
  const data = await res.json();
  if (!res.ok || !data.users?.[0]) throw new Error('Token invalide');
  return data.users[0]; // { localId, email, ... }
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

// ── Main handler ───────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || 'https://armelpltr.github.io';
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

      return json({ error: 'Not found' }, 404);

    } catch (e) {
      console.error(e.message);
      return json({ error: e.message }, 500);
    }
  },
};

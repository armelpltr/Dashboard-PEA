# Cloudflare Worker — Setup

Remplace EmailJS + vérification PIN client-side par un Worker sécurisé.

## Ce que le Worker gère

1. **`POST /verify-pin`** — vérifie le PIN sans exposer pinHash/pinSalt au client
2. **`POST /send-email`** — envoie les emails OTP (2FA, suppression compte) via Brevo

## Prérequis

- Compte Cloudflare (gratuit) → https://cloudflare.com
- Compte Brevo (gratuit, 9000 mails/mois) → https://brevo.com
- Un domaine (optionnel mais recommandé pour `from: noreply@domaine`)

---

## Étape 1 — Firebase service account

1. Console Firebase → Paramètres projet → Comptes de service
2. Cliquer "Générer une nouvelle clé privée" → télécharge un JSON
3. Garder ce fichier, il sera mis en secret dans Cloudflare

---

## Étape 2 — Créer le Worker Cloudflare

```bash
npm install -g wrangler
wrangler login
wrangler init capital-board-worker
```

Structure du projet :
```
capital-board-worker/
  src/index.js
  wrangler.toml
```

### `wrangler.toml`
```toml
name = "capital-board-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGIN = "https://armelpltr.github.io"
```

### `src/index.js`
```javascript
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Secrets injectés via wrangler secret put
// FIREBASE_SERVICE_ACCOUNT, BREVO_API_KEY

const CORS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function verifyFirebaseToken(idToken, projectId) {
  // Vérif token via Firebase Auth REST
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_WEB_API_KEY}`,
    { method: 'POST', body: JSON.stringify({ idToken }) }
  );
  const data = await res.json();
  if (!res.ok || !data.users?.[0]) throw new Error('Token invalide');
  return data.users[0].localId; // uid
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    const url = new URL(request.url);
    const headers = { 'Content-Type': 'application/json', ...CORS };

    // ── POST /verify-pin ──────────────────────────────────────
    if (url.pathname === '/verify-pin' && request.method === 'POST') {
      try {
        const { idToken, pin } = await request.json();
        if (!/^\d{6}$/.test(pin)) return Response.json({ valid: false }, { headers });

        const uid = await verifyFirebaseToken(idToken, env);
        
        // Lire security doc via Firestore REST
        const secRes = await fetch(
          `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${uid}/data/security`,
          { headers: { Authorization: `Bearer ${await getAccessToken(env)}` } }
        );
        const secDoc = await secRes.json();
        const pinHash = secDoc.fields?.pinHash?.stringValue;
        const pinSalt = secDoc.fields?.pinSalt?.stringValue;
        if (!pinHash || !pinSalt) return Response.json({ valid: false }, { headers });

        const computed = await sha256(pinSalt + pin);
        return Response.json({ valid: computed === pinHash }, { headers });
      } catch(e) {
        return Response.json({ valid: false, error: e.message }, { status: 500, headers });
      }
    }

    // ── POST /send-email ──────────────────────────────────────
    if (url.pathname === '/send-email' && request.method === 'POST') {
      try {
        const { to, subject, html } = await request.json();
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: { name: 'Capital Board', email: 'noreply@ton-domaine.com' },
            to: [{ email: to }],
            subject,
            htmlContent: html,
          }),
        });
        return Response.json({ ok: res.ok }, { headers });
      } catch(e) {
        return Response.json({ ok: false, error: e.message }, { status: 500, headers });
      }
    }

    return new Response('Not found', { status: 404 });
  }
};
```

---

## Étape 3 — Ajouter les secrets

```bash
wrangler secret put FIREBASE_SERVICE_ACCOUNT   # coller le JSON service account
wrangler secret put BREVO_API_KEY
wrangler secret put FIREBASE_WEB_API_KEY       # clé web Firebase (pas service account)
```

---

## Étape 4 — Déployer

```bash
wrangler deploy
# → https://capital-board-worker.ton-compte.workers.dev
```

---

## Étape 5 — Migrer app.js

### `_verifyPin` → appel Worker
```javascript
async function _verifyPin(uid, pin) {
  const idToken = await fbAuth.currentUser.getIdToken();
  const res = await fetch('https://capital-board-worker.workers.dev/verify-pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, pin }),
  });
  const { valid } = await res.json();
  return valid;
}
```

### Remplacer les 3 appels `emailjs.send()` → Worker
```javascript
await fetch('https://capital-board-worker.workers.dev/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: email, subject: '...', html: '...' }),
});
```

Supprimer le SDK EmailJS de `app.html` et la constante `EMAILJS_CONFIG` de `app.js`.

---

## Firestore rules — durcir après migration

Une fois le Worker en place, interdire la lecture de `security` côté client :

```javascript
match /users/{uid}/data/security {
  allow read:  if false;  // lecture uniquement via Worker (service account)
  allow write: if request.auth.uid == uid && _isVerified();
}
```

---

## Résumé des gains

| Avant | Après |
|---|---|
| pinHash/pinSalt lisibles par le client | Jamais exposés |
| EmailJS (200 mails/mois, clé publique visible) | Brevo via Worker (9000/mois, clé secrète) |
| Vérification PIN bypassable en JS | Vérification server-side |
| Pas de rate limiting | Rate limiting possible (KV Cloudflare) |

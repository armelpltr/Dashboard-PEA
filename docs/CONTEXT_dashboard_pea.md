
# Capital Board — Contexte & Documentation complète

> Dernière mise à jour : 2026-06-06

---

## Sommaire

1. [Vue d'ensemble](#1-vue-densemble)
2. [Stack technique](#2-stack-technique)
3. [Architecture Firestore](#3-architecture-firestore)
4. [Workflow git](#4-workflow-git)
5. [Roadmap](#5-roadmap)
6. [Features à implémenter](#6-features-à-implémenter)
7. [Checklist avant lancement public](#7-checklist-avant-lancement-public)
8. [Setup Cloudflare Worker](#8-setup-cloudflare-worker)
9. [Setup Chat Support](#9-setup-chat-support)
10. [Historique des sessions](#10-historique-des-sessions)

---

## 1. Vue d'ensemble

**Capital Board** est une application web de suivi personnel de patrimoine financier (PEA, actions, ETF). Interface de type dashboard, hébergée sur GitHub Pages, avec Firebase pour l'auth et la base de données, et des GitHub Actions pour les crons.

- **URL prod** : https://capitalboard.fr
- **Repo** : https://github.com/arrmel-capitalboard/Capital-Board
- **Issues** : https://github.com/arrmel-capitalboard/Capital-Board/issues
- **Admin UID Firebase** : `A6nZQ8PcxdURytSesA17xK81I9T2`

---

## 2. Stack technique

| Couche | Techno |
|---|---|
| Auth | Firebase Auth |
| Database | Firestore (europe-west1) |
| IA | Mistral AI + Tavily Search |
| Données marché | Yahoo Finance API |
| Charts | Chart.js |
| Notifications | Web Push (VAPID / FCM) |
| Hosting | GitHub Pages |
| Cron jobs | GitHub Actions |
| Backend scripts | Python 3.11 |
| Email (actuel) | EmailJS (200/mois — à migrer) |
| Email (futur) | Cloudflare Worker → Brevo (9000/mois) |

### CORS Proxies Yahoo Finance (ordre de fallback)
`allorigins.win` → `corsproxy.io` → `cors.eu.org` → `codetabs.com`

### EmailJS — templates configurés
- `template_8qr2a3g` : OTP 2FA device + OTP suppression compte (variables : `to_email`, `code`, `app_name`)
- `template_l1uno1h` : OTP 2FA email dédié (variables : `email`, `code`, `device_label`, `location`, `app_name`)

### Système d'icônes SVG
- **Objet `IC`** dans `js/app.js` (top of file) : SVGs inline avec `stroke` hardcodé par couleur
- Couleurs : purple `#7c6df5`, blue `#5b8dee`, gold `#f5b731`, green `#00e09e`, muted `#8892a8`, red `#ff4d6a`
- **Ne pas réintroduire d'emojis** — utiliser `IC.*` ou SVG inline
- Icônes nav sidebar/mobile : `stroke` hardcodé directement dans le HTML (plus de `currentColor`)

---

## 3. Architecture Firestore

```
users/{uid}/
  data/
    portfolio        — lignes du portefeuille
    transactions     — historique transactions
    versements       — apports en capital
    watchlist        — liste de suivi
    dailyValues      — valeur jour par jour
    alerts           — alertes prix
    notifHistory     — historique notifications
    trCohort         — cohorte de transactions
    settings         — préférences utilisateur (avatarHue, pushRecap…)
    recap            — dernier récap quotidien IA
    weeklyRecap      — dernier récap hebdomadaire IA
    fcmTokens        — tokens push notifications
    security         — PIN : { pinHash, pinSalt, enabled, createdAt }
    trustedDevices   — 2FA : { devices: { [deviceId]: { label, firstSeen, lastSeen, expiresAt } } }
    deleteOtp        — OTP suppression : { code, expiresAt, attempts }
    deviceOtp        — OTP 2FA device : { code, expiresAt, attempts }

roles/{uid}          — { role: "superadmin" | "user" }
presence/{uid}       — présence temps réel
ideas/               — suggestions (root + messages)
supportChats/{uid}/messages/{msgId}   — { from, text, createdAt, authorUid, read }
supportThreads/{uid}                  — { lastMsg, lastAt, lastFrom, unreadAdmin, unreadUser, userEmail }
```

### Firestore Rules — points clés
- Helper `_isVerified()` : `request.auth.token.email_verified == true`
- Helper `_isAdmin()` : lecture doc `roles/{uid}` → `role == 'superadmin'`
- Writes gatés `_isVerified()` : `users/{uid}`, `ideas`, `presence`, `supportChats` create+update, `supportThreads`
- `roles` write **non gaté** (sinon signup casse)
- `config` : inchangé (superadmin déjà fiable)
- **Après migration Worker** : interdire lecture `users/{uid}/data/security` côté client (`allow read: if false`)

### Firebase Storage Rules
```
support-attachments/{uid}/{file}
  read:  auth.uid == userId || _isAdmin()
  write: (auth.uid == userId || _isAdmin()) && size < 5MB && contentType matches 'image/.*'
```

---

## 4. Workflow git

Le remote avance souvent (workflow GitHub Actions commite le JSON dividendes) :

```bash
git stash && git pull --rebase && git stash pop && git push
```

**Règle** : committer et pusher après chaque modification de code, sans attendre.

### Cache busting `app.js` + `style.css`
`<script src="js/app.js?v=YYYYMMDDx">` et `<link ... css/style.css?v=YYYYMMDDx>` dans `app.html` — à bumper à chaque release notable.
Actuel : `app.js?v=20260606b`, `style.css?v=20260605f`

---

## 5. Roadmap

### En cours / prochain chantier principal

#### Conversion démo → inscription avec migration dataset
Permettre à un utilisateur en mode démo (`?demo=1`) de s'inscrire et de garder/migrer le dataset démo enrichi vers son nouveau compte Firestore.

- CTA "Créer mon compte" visible en mode démo
- Au signup réussi depuis démo : copier `_localCache` démo → Firestore `users/{uid}/data/*`
- Bypass popup dividende auto pendant migration
- Confirmer succès + redirect dashboard

### À suivre (priorisé)

1. **Conversion démo → inscription** (migration dataset)
2. **Calculateur fiscal PEA** — exonération après 5 ans, simulation imposition
3. **Heatmap secteurs portfolio**
4. **Export PDF rapport mensuel**
5. **Migration EmailJS → Cloudflare Worker** — vire la limite 200/mois. Worker → Brevo (9000/mois gratuit). Remplacer les 3 appels `emailjs.send()` dans `js/app.js`. Dépend du domaine custom pour `from: noreply@domaine`.
6. **Tracking ETF automatique** — détection composition pour analyse risque sectoriel
7. **Multi-portefeuilles** — PEA + PEA-PME + CTO dans une même interface
8. **Alertes Telegram** — alternative aux push pour utilisateurs Telegram
9. **Export fiscal** — formulaire 2042 simplifié auto-généré
10. **Screenshots landing** — captures réelles du dashboard

### Livré récemment (par ordre antéchronologique)

- **Page "Résultats financiers"** (2026-06-05) — ⚠️ **WIP, bug à corriger** : nouvelle page Analyse (fondamentaux entreprises) via Yahoo `fundamentals-timeseries`. Recherche entreprise/ticker, KPI (CA/résultat net/marges/BPA/FCF), 2 charts (barres CA+net, lignes marges), table détaillée, toggle annuel/trimestriel. **Erreur en prod "Impossible de charger les résultats"** → problème couche proxy CORS (l'endpoint Yahoo répond 200 en direct ; `_fundFetch` ajouté avec timeouts 9-10s + allorigins/raw en 1er, mais pas encore validé navigateur). À débugger : récupérer le message d'erreur exact affiché (entre parenthèses) / log console `[fund]`.
- **SEO complet landing** (2026-06-04) — meta canonical/og:url/og:image absolu/Twitter Card, JSON-LD WebApplication + FAQPage, `robots.txt`, `sitemap.xml`, og-image 1200×630 générée (`assets/og-image.png`). Title ciblé "Suivi et analyse de portefeuille PEA gratuit".
- **4 guides SEO PEA** (2026-06-04) — `guides/analyser-son-pea`, `suivre-performance-pea`, `suivi-pea-gratuit`, `pea-vs-cto`. Contenu longue traîne + JSON-LD Article + CTA. Section "Guides" sur la landing (nav + footer). Ajoutés au sitemap.
- **Google Sign-In réactivé** (2026-06-04) — `doLoginGoogle` popup (desktop/Android) + fallback `signInWithRedirect` (iOS/PWA), `getRedirectResult` au démarrage. Boutons "Continuer avec Google" sur login + register, garde RGPD. Nouveau compte Google → auto-trust 1er device. **Requiert activation du provider Google dans Firebase Console.** Caveat iOS PWA (cookies cross-domain `firebaseapp.com`) non résolu.
- **Courbe instantanée (cache)** (2026-06-05) — cache localStorage de la courbe par uid, TTL 5min séance / 12h fermé, signature portefeuille+tx pour invalidation. Tip = valeur live du header (fix décalage courbe/chiffre). 1 seul rendu (pas de saut). Hauteur responsive (130→360px sur ultrawide), dégradé calé sur hauteur réelle, rouge si perf négative. NB : remplace l'approche revert 816dba4, validée par le user cette fois.
- **Dividendes auto-enregistrés** (2026-06-05) — `_autoLogDividends()` appelé au démarrage (`startApp`), scanne tous les titres et enregistre les dividendes versés (date ≤ today) sans ouvrir la page Dividendes. Plus de popup "reçu ?". Badge "DIVIDENDE" doré dans l'historique transactions (au lieu de "VENTE").
- **Modal "Gérer les versements"** (2026-06-05) — "Voir / modifier" du solde espèces ouvre un modal (liste + édition inline date/montant + suppression + total + bouton ajouter). Bouton solde espèces restylé (pill + icône œil).
- **Dropdown courtier custom** (2026-06-05) — onglet Performance : dropdown custom avec logos (favicon Google), Boursorama dispo, Fortuneo + Trade Republic "Dispo bientôt" (désactivés).
- **Code PIN 6 chiffres obligatoire** (2026-05-30) — app lock à chaque rechargement. SHA-256(salt+pin) dans `users/{uid}/data/security`. Vues : force setup, lock screen (6 dots + 5 tentatives max), modal change depuis Profil. Keypad 3x4 custom. Non désactivable.
- **Masquer le solde** (2026-05-30) — toggle œil header mobile + sidebar desktop. MutationObserver + WeakMap, remplace `€`/`%`/`$` par `•`. Throttle requestAnimationFrame. localStorage persistant.
- **2FA device-based améliorations** (2026-05-30) — IP IPv4 via ipify→ipapi.co, pays+drapeau FR, template EmailJS dédié, refonte CSS carte appareil, modal Capital Board pour révocation, révocation appareil courant autorisée.
- **2FA device-based obligatoire** (2026-05-30) — chaque nouvel appareil déclenche OTP email. `deviceId` UUID localStorage, trust 90j dans `trustedDevices`. Vue `#device-verify-view`. Auto-trust 1er device au signup. Section Profil "Appareils de confiance".
- **Page custom auth-action.html** (2026-05-26) — remplace UI Firebase défaut (verifyEmail, resetPassword, recoverEmail, signIn). À configurer : Console Firebase → Authentication → Templates → "Customize action URL".
- **Suppression compte OTP EmailJS** (2026-05-30) — OTP 6 chiffres via EmailJS (template `template_8qr2a3g`). Stocké Firestore TTL 10min max 5 tentatives. `delete-confirm.html` supprimé. Magic link abandonné (quota Spark 5/jour).
- **Vérification email à l'inscription** (2026-05-25) — `sendEmailVerification` au signup, gate `onAuthStateChanged`, vue `#verify-view` avec polling 4s + listeners focus/visibilitychange (clé PWA iPhone), throttle renvoi 60s.
- **Suppression compte complète Firebase** (2026-05-25) — modal stylé 2 étapes, `deleteAllUserData` nettoie tous les docs + storage.
- **Mode démo** (`?demo=1`) — dataset fictif PEA (9 lignes + 14 tx + 7 versements + récap IA), bandeau orange, bypass Firestore/Auth/Push, page Performance bloquée avec CTA.
- **Dividendes → solde espèces** (2026-05-22) — transactions `type:'dividend'` comptées dans le solde espèces. Dividendes auto-détectés Yahoo avec popup confirmation.
- **Tooltip graphique portefeuille** (2026-05-22) — tooltip HTML externe à la place du canvas Chart.js, avec icônes SVG.
- **Emojis → SVG** (2026-05-22) — tous les emojis remplacés par SVG dans tous les fichiers.
- **Notifications push & Récap IA** (2026-05-17) — migration Brevo email → FCM push, `daily-recap.js` (Mistral + Tavily), page Récap quotidien/hebdomadaire.

---

## 6. Features à implémenter

### Données réelles (priorité haute)
- Historique prix réel : graphique portefeuille généré aléatoirement → brancher Yahoo Finance History endpoint
- Dividendes auto-sync : `dividendes.json` statique → fetch API (financialmodelingprep ou similaire)
- Benchmark réel : indices CAC/MSCI/S&P hardcodés → données live

### Performance & calculs
- IRR (taux de rendement interne) — complète le TWR existant
- Frais de courtage — pas tracké du tout, fausse le P&L
- Yield on cost — dividendes / prix d'achat original
- DCA tracking — suivi du coût moyen automatique

### Alertes & notifications
- Alertes prix sur watchlist (acheter à X€, stop-loss à Y€)
- Push : chat + dividendes reçus + alertes prix

### Analyse avancée
- Monte Carlo projections — remplace CAGR constant par simulation stochastique
- Sharpe / Sortino / Calmar ratios sur page Performance
- Attribution de performance — contribution de chaque action
- Screener — filtrer actions par critères (PE, rendement, secteur)
- Style box — value/growth/blend pour ETFs

### UX & interface
- Sparklines réelles sur stat cards
- Mode hors-ligne — PWA complète avec service worker
- Import broker auto — Degiro/IBKR CSV recurring
- Historique modifications — audit log des changements

### Tech / perf
- Code splitting — `app.js` 370KB monolithique → modules lazy-loaded
- Cache invalidation intelligente — Firestore queries stales
- Chiffrement E2E pour le chat

---

## 7. Plan de lancement & professionnalisation

> Mis à jour : 2026-06-03

### 1. Domaine & infrastructure email

Domaine principal : **`capitalboard.fr`** (~7€/an sur OVH ou Gandi). Optionnels : `capital-board.com` (~12€/an), `capitalboard.app` (~15€/an).

Email professionnel : créer `contact@capitalboard.fr` via **Zoho Mail** (gratuit, 1 boîte, 5 Go). Configurer un forward vers l'adresse personnelle pour tout recevoir sur l'inbox habituelle. Configurer SPF + DKIM sur le domaine pour la délivrabilité des emails transactionnels.

### 2. Déploiement domaine sur GitHub Pages

Pointer `capitalboard.fr` sur GitHub Pages :

```
GitHub → Settings → Pages → Custom domain → capitalboard.fr → Enforce HTTPS
```

DNS à configurer chez le registrar :
```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  arrmel-capitalboard.github.io
```

Après propagation (15 min à 24h) :
- Firebase → Authentication → Authorized domains → ajouter `capitalboard.fr`
- Mettre à jour `ALLOWED_ORIGIN` dans le Cloudflare Worker (cf. section 8)
- Mettre à jour `auth-action.html` URL dans Console Firebase → Authentication → Templates → "Customize action URL" → `https://capitalboard.fr/auth-action.html`

### 3. Migration EmailJS → Cloudflare Worker

Dépend du domaine (pour `from: noreply@capitalboard.fr`). Déployer le Worker (cf. section 8), puis dans `app.js` :
- Remplacer les 3 appels `emailjs.send()` par `fetch(worker/send-email)`
- Supprimer SDK EmailJS de `app.html` et constante `EMAILJS_CONFIG`
- Durcir Firestore Rules : `users/{uid}/data/security` → `allow read: if false`

Gain : passe de 200 mails/mois (EmailJS) à 9000/mois (Brevo via Worker), clé API jamais exposée côté client.

### 4. Statut juridique

Créer une **auto-entreprise** (gratuit, 15 min) sur autoentrepreneur.urssaf.fr.
- Code APE : 6312Z (portail Internet) ou 6201Z (programmation)
- Le SIREN obtenu est à renseigner dans `mentions-legales.html`
- Obligatoire dès qu'une monétisation est envisagée ou pour limiter la responsabilité personnelle

### 5. RGPD & contenu légal

**`mentions-legales.html`** — compléter :
- SIREN/SIRET (après création auto-entreprise)
- Adresse postale (personnelle ou domiciliation)
- Hébergeur : GitHub Pages — GitHub Inc., 88 Colin P Kelly Jr Street, San Francisco, CA 94107, USA
- Backend : Google Cloud — Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA
- Directeur de publication : Armel Plantier

**`politique-confidentialite.html`** — enrichir :
- Liste sous-traitants : Firebase/Google (auth + BDD, USA), Mistral AI (analyse récap, France), Tavily (recherche web, USA), GitHub Pages (hébergement statique, USA)
- Mention transferts hors UE encadrés par les Clauses Contractuelles Types (CCT)
- Durée de conservation des données (ex. 3 ans d'inactivité)
- Droits RGPD : accès, rectification, suppression, portabilité, opposition, retrait du consentement

**`cgu.html`** — mettre à jour l'email avec `contact@capitalboard.fr`

### 6. Sécurité

- Vérifier qu'aucun secret n'est commité dans le repo (`.env`, `service-account.json`, clés Mistral/Tavily → uniquement GitHub Actions secrets)
- Vérifier les Firestore Rules : un user ne peut lire/écrire que ses propres docs
- Activer **Firebase App Check** (reCAPTCHA v3) — Console Firebase → App Check → enregistrer l'app web → ajouter le provider reCAPTCHA v3 → intégrer `initializeAppCheck` dans `app.js`
- Vérifier Firebase Security Rules pour Storage

### 7. Branding & open source

Renommage repo GitHub : `Dashboard-PEA` → `Capital-Board` ✓ (Settings → Repository name). À faire avant de passer public pour figer l'URL canonique.

Fichiers à créer à la racine :
- `LICENSE` — MIT (simple, permissif) ou AGPL-3.0 (force les forks hébergés à publier leur code, protège le SaaS)
- `README.md` — présentation, stack, captures réelles du dashboard, instructions install
- `CONTRIBUTING.md` — style de commits, process PR
- `SECURITY.md` — comment signaler une vulnérabilité
- `.github/ISSUE_TEMPLATE/` — templates bug report + feature request

Métadonnées GitHub :
- Description : "Capital Board — Suivi personnel de patrimoine financier (PEA, actions, ETF)"
- Topics : `finance`, `pea`, `portfolio`, `firebase`, `dashboard`, `french`, `fintech`

Logo/favicon : logo "C" violet actuel — peut être conservé tel quel ou remplacé au moment du passage public.

Renommage déjà effectué dans le code : "Capital View" → "Capital Board" ✓, "@capitalview.com" → "@capitalboard.fr" ✓

Passer le repo en **PUBLIC** une fois sécurité + légal validés.

### 8. Tests pré-lancement

Navigateurs : Chrome Desktop, Safari iOS (PWA installée + browser), Chrome Android, Firefox.

Fonctionnalités à vérifier :
- Push notifications (Web Push iOS + Android)
- Import CSV broker
- Récap quotidien (bouton "Générer maintenant")
- Récap hebdo (`workflow_dispatch` + `force_weekly=true`)
- RGPD checkbox bloquante à l'inscription
- Bandeau cookies
- 3 liens légaux (CGU, confidentialité, mentions)
- Bouton déconnexion mobile dans profil
- Création compte de zéro (email verif + 2FA device + PIN setup)
- Suppression de compte (Danger zone → OTP email)

Lighthouse (Chrome DevTools → Lighthouse) : Performance > 80, Accessibility > 90, SEO > 90, PWA installable.

### 9. Post-lancement

- Annoncer sur LinkedIn, Twitter/X, Reddit r/vosfinances, r/France
- Ouvrir un canal de support : Discord ou email `contact@capitalboard.fr`
- Analytics RGPD-friendly : **Plausible.io** (~9€/mois, sans cookie) ou **Goatcounter** (gratuit, open source)
- Suivi bugs : GitHub Issues
- Roadmap publique : GitHub Projects

---

## 8. Setup Cloudflare Worker

> Remplace EmailJS (200/mois, clé publique) + vérification PIN client-side par un Worker sécurisé.
> À faire quand le domaine custom est disponible.

### Ce que le Worker gère
1. **`POST /verify-pin`** — vérifie le PIN sans exposer `pinHash`/`pinSalt` au client
2. **`POST /send-email`** — envoie les emails OTP (2FA, suppression compte) via Brevo

### Prérequis
- Compte Cloudflare (gratuit)
- Compte Brevo (gratuit, 9000 mails/mois)
- Un domaine pour `from: noreply@domaine`

### Étape 1 — Firebase service account
Console Firebase → Paramètres projet → Comptes de service → "Générer une nouvelle clé privée" → JSON à mettre en secret Cloudflare.

### Étape 2 — Créer le Worker

```bash
npm install -g wrangler
wrangler login
wrangler init capital-board-worker
```

**`wrangler.toml`**
```toml
name = "capital-board-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGIN = "https://capitalboard.fr"
```

**`src/index.js`**
```javascript
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Secrets : FIREBASE_SERVICE_ACCOUNT, BREVO_API_KEY, FIREBASE_WEB_API_KEY

const CORS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function verifyFirebaseToken(idToken, env) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${env.FIREBASE_WEB_API_KEY}`,
    { method: 'POST', body: JSON.stringify({ idToken }) }
  );
  const data = await res.json();
  if (!res.ok || !data.users?.[0]) throw new Error('Token invalide');
  return data.users[0].localId;
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const url = new URL(request.url);
    const headers = { 'Content-Type': 'application/json', ...CORS };

    if (url.pathname === '/verify-pin' && request.method === 'POST') {
      try {
        const { idToken, pin } = await request.json();
        if (!/^\d{6}$/.test(pin)) return Response.json({ valid: false }, { headers });
        const uid = await verifyFirebaseToken(idToken, env);
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

### Étape 3 — Secrets
```bash
wrangler secret put FIREBASE_SERVICE_ACCOUNT
wrangler secret put BREVO_API_KEY
wrangler secret put FIREBASE_WEB_API_KEY
```

### Étape 4 — Déployer
```bash
wrangler deploy
# → https://capital-board-worker.ton-compte.workers.dev
```

### Étape 5 — Migrer app.js

**`_verifyPin` → appel Worker**
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

**Remplacer les 3 appels `emailjs.send()` → Worker**
```javascript
await fetch('https://capital-board-worker.workers.dev/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: email, subject: '...', html: '...' }),
});
```
Supprimer le SDK EmailJS de `app.html` et la constante `EMAILJS_CONFIG` de `app.js`.

### Firestore Rules — durcir après migration
```javascript
match /users/{uid}/data/security {
  allow read:  if false;  // lecture uniquement via Worker (service account)
  allow write: if request.auth.uid == uid && _isVerified();
}
```

### Bilan
| Avant | Après |
|---|---|
| pinHash/pinSalt lisibles par le client | Jamais exposés |
| EmailJS (200 mails/mois, clé publique visible) | Brevo via Worker (9000/mois, clé secrète) |
| Vérification PIN bypassable en JS | Vérification server-side |
| Pas de rate limiting | Rate limiting possible (KV Cloudflare) |

---

## 9. Setup Chat Support

### 1. ADMIN_UID configuré
`js/app.js` → `const ADMIN_UID = "A6nZQ8PcxdURytSesA17xK81I9T2"` ✓

### 2. Rôle superadmin dans Firestore
Console Firebase → Firestore → collection `roles` → doc `A6nZQ8PcxdURytSesA17xK81I9T2`
Champ requis : `role` = `"superadmin"` (string)

### 3. Règles Firestore (ajouter aux existantes)
```javascript
function _isAdmin() {
  return request.auth != null &&
    get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == 'superadmin';
}

match /supportChats/{userId}/messages/{msgId} {
  allow read:   if request.auth != null && (request.auth.uid == userId || _isAdmin());
  allow create: if request.auth != null && (
    (request.auth.uid == userId && request.resource.data.from in ['user','system']) ||
    (_isAdmin() && request.resource.data.from in ['admin','system'])
  );
  allow update: if request.auth != null
    && (request.auth.uid == userId || _isAdmin())
    && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read']);
  allow delete: if _isAdmin();
}

match /supportThreads/{userId} {
  allow read:  if request.auth != null && (request.auth.uid == userId || _isAdmin());
  allow write: if request.auth != null && (request.auth.uid == userId || _isAdmin());
}
```

### 4. Firebase Storage (pour images)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function _isAdmin() {
      return request.auth != null &&
        firestore.get(/databases/(default)/documents/roles/$(request.auth.uid)).data.role == 'superadmin';
    }
    match /support-attachments/{userId}/{file=**} {
      allow read:  if request.auth != null && (request.auth.uid == userId || _isAdmin());
      allow write: if request.auth != null && (request.auth.uid == userId || _isAdmin())
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 5. Test
- Compte user lambda : page Support → message → Envoyer
- Admin : page Support → liste threads à gauche → cliquer → répondre
- Badge unread rouge dans sidebar nav

---

## 10. Historique des sessions

### Session 2026-06-06 (suite) — Proxy Yahoo via Worker (fix lenteur iOS)

**Problème** : iPhone lent à l'ouverture alors que le web est rapide. Cause = sur iOS Safari/PWA le cache localStorage de la courbe (`pfcurve_`+uid) est évincé (ITP, storage script-writable capé ~7j, PWA standalone vidée plus vite) → cache miss fréquent → chemin froid bloque sur les proxies CORS gratuits **morts** (`corsproxy.io`/`cors.eu.org` → 403), timeouts cumulés ~14s/appel. Le web restait rapide car cache chaud.

**Fix (commit `4acc81c`)** :
- **Worker** : nouvel endpoint `GET /yahoo?url=...` (`capital-board-worker/src/index.js`) — fetch Yahoo direct côté serveur (pas de CORS, pas de crumb). Allowlist `YAHOO_HOSTS` = `query1`/`query2.finance.yahoo.com` (anti open-proxy → 403 sinon). `Cache-Control: public, max-age=30` (cache CDN Cloudflare). CORS Methods passé à `GET, POST, OPTIONS`.
- **app.js** : `fetchWithFallback` ajoute `tryWorker` en **Round 0 primaire** (`WORKER_URL + '/yahoo?url='`), proxies gratuits gardés en fallback Round 1/2. `_fundFetch` (page fondamentaux) ajoute le Worker en 1ère tentative.
- bump cache-bust `app.js?v=20260606c`.

**Déployé + validé curl 2026-06-06** : `/yahoo` chart EURUSD → 200 JSON ; fundamentals AAPL → 200 en 0.22s ; host non-Yahoo → 403. Déploiement = `npx wrangler deploy` (côté user ; ExecutionPolicy PowerShell à passer `RemoteSigned` CurrentUser, et `npx.cmd` si `.ps1` bloqué).

**→ Règle aussi** la page Résultats financiers (le bug "Impossible de charger les résultats" venait de la couche proxy CORS morte ; l'endpoint `fundamentals-timeseries` répondait déjà 200 en direct). **À valider navigateur/iPhone après ce déploiement.**

### À reprendre
- **Test iPhone post-déploiement** : vider cache PWA (réinstaller app écran d'accueil), ouvrir dashboard cache vide → courbe + cours doivent charger vite via le Worker.

### Session 2026-06-06

#### Perf dashboard — 1er rendu 9,2 s → 0,3 s (36×)
- **Instrumentation F12** : chrono `window._perfT0` posé en haut de `startApp`, helper `_perfMark(key, extra)` (logue 1× par cycle, violet `#7c6df5`). Marqueurs : `données chargées (Firestore)`, `chiffres affichés` (avant `renderPortfolioChart` dans `renderPortfolio`), `buildPortfolioHistory (Yahoo)` (orange, si pas de cache), `courbe affichée (cache|Yahoo)` (après `new Chart`), `FX chargé (arrière-plan)`.
- **Diagnostic** : le gate `_withTimeout(Promise.all([loadAllUserData, loadFxRates]), 12000)` attendait `loadFxRates` (2 fetchs EURUSD/EURGBP via proxies CORS morts) → ~9 s avant tout affichage. Or PEA ≈ 100 % EUR → FX inutile pour afficher.
- **Fix 1 (le gros)** : `startApp` ne bloque plus que sur `loadAllUserData` (Firestore, rapide). `loadFxRates()` lancé en arrière-plan `.then(() => renderPortfolio())` pour re-render les éventuelles lignes non-EUR. Mesuré : Firestore **256 ms**, chiffres 258 ms, courbe (cache) 280 ms, FX bg 2060 ms.
- **Fix 2** : `fetchWithFallback` réordonné — Round 1 = `Promise.any([tryCodetabs, tryAllorigins])` (course parallèle, 1er valide gagne) ; Round 2 = `corsproxy.io` + `cors.eu.org` en dernier recours (étaient en primaire alors qu'ils renvoient 403). `tryAllorigins` utilise `query2.` au lieu de `query1.`.
- **Limite restante** : cours live / dividendes / benchmark toujours cassés tant que les proxies gratuits sont down → vrai fix = endpoint `/yahoo` sur le Worker (cf. « À reprendre 2026-06-07 »). Le dashboard s'affiche vite car données **en cache** (peuvent être légèrement périmées).

### Session 2026-06-04 / 06-05

#### SEO landing + guides
- **Déploiement** : `.github/workflows/deploy.yml` copie `pages/{index,app,auth-action}.html` → racine, puis upload tout le repo (`path: '.'`). Donc `robots.txt`/`sitemap.xml`/`guides/` à la **racine repo** = servis sur `capitalboard.fr/`.
- **Meta** (`pages/index.html`) : canonical, og:url/site_name/locale, og:image **absolu** `https://capitalboard.fr/assets/og-image.png`, Twitter Card `summary_large_image`, JSON-LD `WebApplication` (FinanceApplication, gratuit) + `FAQPage` (6 Q/R reprises de la section FAQ).
- **og-image** : `assets/og-image.png` 1200×630, générée via Edge headless (`--headless --screenshot`) depuis un HTML temporaire (design "split + KPI", charte sombre). Pas d'ImageMagick (`convert` Windows = outil disque, pas IM).
- **robots.txt** : allow all, disallow `/app.html` + `/auth-action.html`, lien sitemap.
- **sitemap.xml** : landing (1.0) + 4 guides (0.8) + 3 pages légales (0.3).
- **Guides** (`guides/*.html`) : 4 pages autonomes (CSS inline, charte), contenu SEO + JSON-LD Article + CTA `https://capitalboard.fr/`. Section `#guides` sur la landing (4 cartes), liens nav desktop/mobile + footer. Liens relatifs `guides/...` (OK en prod racine ; cassés en `file://` local comme les liens `legal/...`).
- **À faire user** : Google Search Console (vérif domaine TXT DNS + soumettre sitemap + Inspection d'URL), backlinks (r/vosfinances, Product Hunt). "Impossible de lire le sitemap" GSC = faux positif transitoire (fichier 200 + XML valide vérifié).

#### Google Sign-In (réactivé)
- Était **codé puis désactivé** (PWA iOS cookies cross-domain). `doLoginGoogle` était un stub.
- `js/app.js` : `doLoginGoogle` → `signInWithPopup` (desktop/Android) sinon `signInWithRedirect` (`_shouldUseRedirectAuth()` : iOS ou standalone). `getRedirectResult` au démarrage (remplace le commentaire ligne ~184). Nouveau compte (`_tokenResponse.isNewUser`) → `localStorage.signup_auto_trust=1` → 1er device auto-trust. Garde `reg-rgpd` obligatoire si vue inscription.
- `pages/app.html` : boutons "Continuer avec Google" + séparateur OU sur `#login-view` et `#register-view` (SVG G 4 couleurs).
- **Requiert** : Firebase Console → Authentication → Sign-in method → Google → Enable ; Authorized domains inclut `capitalboard.fr`. Sinon `auth/operation-not-allowed`.

#### Courbe portefeuille — affichage instantané (cache)
- Objectif user : PIN tapé → dashboard complet (lignes + chiffres + **courbe**) d'un coup. Goulot = `buildPortfolioHistory` (Yahoo via proxies, ~7s).
- `renderPortfolioChart` : cache `localStorage['pfcurve_'+uid]` = `{ ts, sig, dataset }`. `sig` = tickers+qty + nb transactions + période → invalidé si modif. `_curveCacheTTL()` : 5min en séance (lun-ven 9-18h), 12h sinon. Cache frais → render instant sans Yahoo ; sinon fetch bloquant + spinner.
- **Tip live** : dernier point du dataset = `Σ qty×currentPrice` (même valeur que le header) → fix décalage courbe/chiffre (Défaut B).
- **1 seul rendu** (pas de re-dessin silencieux) → pas de saut visuel (Défaut A). Tolérance staleness "quelques minutes" acceptée par le user. Remplace l'approche revert 816dba4, **validée cette fois**.
- **Hauteur responsive** (`css/style.css` `.portf-canvas-wrap`) : 130px base, 230px ≥1500px, 300px ≥1920px, 360px ≥2400px (ultrawide écrasait la pente). Dégradé `backgroundColor` calé sur `chartArea` (était hardcodé 130px → coupé), 3 stops (0.34→0.12→0). Couleur courbe+fondu = `isUp` (vert ≥0, rouge <0).

#### Dividendes auto + badge
- `_autoLogDividends()` (js/app.js, avant `initDividendes`) : appelé dans `startApp` (setTimeout 1200ms, hors démo). Scanne `pf.filter(non-ETF)`, `fetchDivHistory` par ticker, log auto des dividendes `date ≤ today` pendant détention non déjà enregistrés (`logTransaction type:'dividend' source:'yahoo-auto'`). Plus de popup `_processDivPromptQueue` (la détection dans `initDividendes` enregistre aussi en auto désormais).
- `renderTxHistory` : badge 3-way — achat (vert ▲), **dividende (or ◆ DIVIDENDE)**, vente (rouge ▼).

#### Modal versements + dropdown courtier
- **Modal "Gérer les versements"** (`#versements-list-modal` app.html) : remplace la liste inline. `openVersementsListModal` / `renderVersementsModalList` (date FR, montant, modifier inline via `_versEditIdx` + `saveVersementEdit`, `deleteVersementFromModal`, total). Bouton "＋ Ajouter" → `openVersementModal`. Bouton "Voir / modifier" du solde espèces restylé `.btn-cash-edit` (pill + œil).
- **Dropdown courtier** (`#broker-dd` app.html, onglet Performance) : custom (remplace le libellé fixe Boursorama). `toggleBrokerDD`/`selectBroker`/`_closeBrokerDD`. Boursorama sélectionnable (check), Fortuneo + Trade Republic `.disabled` + badge `.broker-soon` "Dispo bientôt". Logos via `google.com/s2/favicons?domain=...`.

#### Page Résultats financiers (WIP — voir "À reprendre")
- Nouvelle page `page-fundamentals` (nav Analyse + drawer mobile, hook `showPage`/`showPageMobile` → `renderFundamentalsPage`). Source : Yahoo `fundamentals-timeseries` (seul endpoint fondamentaux **sans crumb** ; `quoteSummary` v10 et `v7/quote` = 401).
- Fonctions js/app.js : `renderFundamentalsPage` (puces titres détenus), `fundSearch` (ticker direct ou `fetchSuggestions` par nom), `fundLoad`, `fetchFundamentals(ticker,freq)`, `_fundFetch` (proxies dédiés), `renderFundamentals` (KPI + 2 Chart.js + table), `setFundFreq`, helpers `_fundFmtBig`/`_fundFmtPct`/`_curSym`/`_fundPeriodLabel`/`_fundDomainFromMeta`. Vars : `_fundChartMain`/`_fundChartMargin`/`_fundCurrent`/`_fundFreq`/`_fundData`.
- Types récupérés (`_FUND_TYPES`, préfixe `annual`/`quarterly`) : TotalRevenue, GrossProfit, OperatingIncome, NetIncome, EBITDA, BasicEPS, DilutedEPS, TotalAssets, TotalLiabilitiesNetMinorityInterest, StockholdersEquity, FreeCashFlow, OperatingCashFlow, TotalDebt.
- CSS : préfixe `.fund-*` dans style.css. **Statut : erreur proxy à débugger.**

### Session 2026-05-30

#### Code PIN 6 chiffres obligatoire (app lock)
- PIN **obligatoire** pour tous les users, demandé à **chaque rechargement** de page (refresh inclus). Non désactivable.
- Stockage Firestore : `users/{uid}/data/security` = `{ pinHash, pinSalt, enabled, createdAt }`. Hash `SHA-256(salt + pin)` via SubtleCrypto, salt random 16 bytes hex.
- 3 vues dans `login-screen` :
  - `#pin-setup-view` : force config 2 étapes (nouveau + confirmation) pour comptes sans PIN. Fallback = déconnexion.
  - `#pin-lock-view` : saisie code (6 dots indicateurs + shake animation si faux). 5 tentatives max → signOut forcé. Lien "Code oublié → Se déconnecter".
  - Modal `#pin-setup-modal` : changer PIN depuis Profil (2 étapes pareil).
- **Gate `onAuthStateChanged`** : après email verif + device trust → `_isPinEnabled()` check. Si false → `showPinSetupView`. Sinon → `showPinLockView` systématique (pas de skip session).
- **Profil → section "Code PIN"** : badge "Code PIN actif" + bouton "Changer le code". Si PIN non configuré → warning rouge + bouton "Configurer maintenant".
- **Keypad numérique custom** : grille 3x4 (1-9, vide, 0, ⌫). Inputs `type=password inputmode=none readonly caret-color:transparent -webkit-text-security:disc` → désactive clavier natif mobile. Auto-submit à 6 chiffres.
- Handlers : `_setupPin`, `_verifyPin`, `_isPinEnabled`, `_disablePin` (interne), `pinSetupSubmit`, `pinSetupViewSubmit`, `pinLockSubmit`, `pinLockLogout`, `openPinSetupModal`, `refreshPinStatus`, `_renderPinKeypad(keypadId, inputId, onComplete)`.
- Fail-open si Firestore down (évite lockout total).

#### Masquer le solde (toggle œil)
- Bouton œil dans **mobile header** (à côté burger) + **sidebar desktop** (au-dessus profil). Toggle persistant `localStorage.balance_hidden`.
- MutationObserver walk DOM, remplace les chiffres (`\d`) par `•` dans tous les text nodes contenant `€`/`%`/`$`/`£`/`¥`/`EUR`/`USD`. Original sauvegardé dans WeakMap pour restore au untoggle.
- Throttle `requestAnimationFrame` pour batch les re-masks. Skip si valeur déjà masquée.
- Skip vues `login`, `verify`, `device-verify`, `register`, `script`, `style`.

#### 2FA device-based : améliorations
- **IP + localisation** via chain `api.ipify.org` (force IPv4) → `ipapi.co/{ipv4}/json/`.
- Affichage Profil : pays uniquement + drapeau emoji depuis country_code. Traduction EN→FR (`_COUNTRY_FR` map).
- **Template EmailJS dédié 2FA** `template_l1uno1h` (remplacé confirmation post-suppression — quota 2 templates max plan gratuit).
- **Refonte CSS carte appareil** : header (icône device + label + badge CET APPAREIL pill) / grille 2 cols (IP, lieu, dates SVG) / footer expiration italique. Gradient fond pour current device.
- **Modal stylé Capital Board** (`showConfirmModal`) pour révocation.
- **Révocation appareil courant** autorisée : "Révoquer & déconnecter" → remove Firestore + signOut + stopApp.

#### 2FA device-based obligatoire
- 2FA **obligatoire** pour tous les users. Chaque nouvel appareil/navigateur déclenche un OTP email.
- `deviceId` UUID (`crypto.randomUUID()`) stocké `localStorage.device_id`.
- Trust persisté 90 jours (`DEVICE_TRUST_DAYS`), bumpé à chaque login.
- Stockage Firestore : `users/{uid}/data/trustedDevices` = `{ devices: { [deviceId]: { label, firstSeen, lastSeen, expiresAt } } }`.
- OTP : `users/{uid}/data/deviceOtp` (TTL 10min, max 5 tentatives), envoi via EmailJS `template_8qr2a3g`.
- Gate dans `onAuthStateChanged` après `emailVerified` check : si `_isDeviceTrusted()` false → `showDeviceVerifyView(email)`.
- Vue `#device-verify-view` : étape A (envoi code) + étape B (saisie 6 chiffres + bouton renvoyer throttle 60s + déconnexion).
- **Signup** : flag `localStorage.signup_auto_trust=1` → auto-add device trusted (skip 2FA pour 1er device).
- **Profil → "Appareils de confiance"** : liste devices, badge "CET APPAREIL", bouton Révoquer + "Révoquer tous les autres".
- Fail-open si Firestore down.
- Handlers : `dvSendOtp`, `dvVerifyOtp`, `dvResendOtp`, `dvLogout`.
- Helpers : `_getDeviceId`, `_getDeviceLabel`, `_getTrustedDevices`, `_isDeviceTrusted`, `_addTrustedDevice`, `_updateDeviceLastSeen`, `_revokeTrustedDevice`.

#### Refonte suppression compte — OTP custom EmailJS
- Magic link Firebase abandonné définitivement (quota Spark 5/jour). Remplacé par OTP 6 chiffres via EmailJS.
- Template EmailJS `template_8qr2a3g` (variables `to_email`, `code`, `app_name`).
- Flow modal : Étape 1 warning → Étape 2 preview email + "Envoyer le code" → Étape 4 input 6 chiffres + "Confirmer suppression" + "Renvoyer" (throttle 60s) → Étape 3 spinner suppression.
- `delFinalize` → génère code, write Firestore `users/{uid}/data/deleteOtp` `{code, expiresAt: now+10min, attempts: 0}`, envoie via EmailJS, bascule étape 4.
- `delVerifyOtp` → vérifs (existence, expiry, attempts<5, code match) → `deleteAllUserData` → `deleteUser`. Catch `auth/requires-recent-login` → signOut + msg.
- `delete-confirm.html` supprimé.

#### À reprendre (2026-05-30)
- Test end-to-end real env (vérif spam, vérif EmailJS quota 200/mois suffisant).
- Tester `auth-action.html` après config Console Firebase (action URL custom).
- Vérifier templates email FR appliqués Console Firebase.

---

### Session 2026-05-26

#### Page custom auth-action.html
- Gère 4 modes Firebase Auth : `verifyEmail`, `resetPassword`, `recoverEmail`, `verifyAndChangeEmail`. Theme Capital Board (dark, accent violet, Switzer/JetBrains Mono).
- Form mot de passe inline pour reset password (validation 6 char min + confirm). Mapping erreurs FR.
- **À faire Console Firebase** : Authentication → Templates → "Customize action URL" → `https://capitalboard.fr/auth-action.html`.

---

### Session 2026-05-25

#### Vérification email obligatoire à l'inscription
- `sendEmailVerification` envoyé automatiquement au signup.
- Gate `onAuthStateChanged` : si `!user.emailVerified` → `showVerifyView()` au lieu de `startApp()`.
- Vue `#verify-view` : email affiché, instructions 3 étapes, boutons "J'ai vérifié" + "Renvoyer le mail" (throttle 60s) + "Se déconnecter".
- Polling 4s + listeners `focus` + `visibilitychange` → `user.reload()` auto (clé pour PWA iPhone).
- Fonctions : `showVerifyView`, `startVerifyPolling`, `stopVerifyPolling`, `_veSilentCheck`, `veCheck`, `veResend`, `veLogout`.
- Bug centrage : `showVerifyView` doit set `login-screen.style.display = 'flex'` (pas `'block'`).

#### Firestore rules — gate `email_verified`
- Helper `_isVerified()` : `request.auth.token.email_verified == true`.
- Writes gatés : `users/{uid}`, `ideas`, `presence`, `supportChats` create+update, `supportThreads`.
- `roles` write **non gaté** (sinon signup casse). `config` inchangé.

#### Suppression compte — modal stylé + cleanup Firebase complet
- Modal 2 étapes `#delete-account-modal` (warning → mdp → supprimer). Provider Google → skip étape mdp.
- `deleteAllUserData(uid)` supprime : `users/{uid}/data/*` (portfolio, transactions, versements, watchlist, dailyValues, alerts, notifHistory, trCohort, settings, recap, weeklyRecap, fcmTokens), doc racine `users/{uid}`, `supportChats/{uid}/messages/*`, `supportThreads/{uid}`, `presence/{uid}`, `roles/{uid}`, Storage `support-attachments/{uid}/*`.
- Cleanup en `Promise.all` global (timeout 15s).

#### Checkboxes register — bug fix
- Bug : `<div onclick=".click()">` parent + click direct sur checkbox = double toggle.
- Fix : `onclick="event.stopPropagation()"` sur checkbox + guard sur parent.

---

### Session 2026-05-22

#### Dividendes → solde espèces
- Transactions `type:'dividend'` comptées dans le solde espèces (5 calculs : `stat-cash`, trophées, `cashResidual` live ×2, `cashAtDate`).
- Dividendes auto-détectés Yahoo (date versement passée) → popup confirmation "Dividende reçu ?" (Oui / Pas encore). Dédup ticker+date, file d'attente. Fonctions : `_processDivPromptQueue`, `_divPromptQueue`, `_divDeclined`.

#### Tooltip graphique portefeuille
- Tooltip canvas Chart.js remplacé par tooltip HTML externe (`portfolioChartTooltip`) avec icônes SVG.

#### Emojis → SVG (tous onglets)
- Tous les emojis remplacés par des icônes SVG dans `index.html`, `js/app.js`, `cgu.html`, `politique-confidentialite.html`, scripts cron.
- `showConfirmModal` et `_showChatToast` passés en `innerHTML` pour rendre du SVG. `showConfirmModal` accepte aussi `onCancel`, `okLabel`, `cancelLabel`.

#### UI toolbar / profil
- Bouton Auto-refresh retiré (refresh 60s reste actif au démarrage).
- Profil → Récap quotidien : `<select>` remplacé par 2 boutons Activé/Désactivé (`_paintRecapButtons`).

#### Historique des transactions
- Affiche les 10 transactions les plus récentes par défaut. Bouton "Afficher plus (N)" / "Afficher moins" (`toggleTxHistory`, `TX_HISTORY_LIMIT`).
- Scroll interne 400px retiré : page scrolle normalement.

---

### Session 2026-05-17 — Notifications push & Récap IA

#### Migration email → push
- Brevo email supprimé. Tout passe par FCM push.
- `scripts/daily-recap.js` : stocke récap dans `users/{uid}/data/recap` + envoie push courte.
- `scripts/price-alerts.js` : alertes prix par push FCM.
- Préférence renommée `emailRecap` → `pushRecap` (repli sur ancienne clé pour anciens users).

#### Service worker & PWA
- `firebase-messaging-sw.js` : service worker FCM (notifs arrière-plan).
- `manifest.json` : PWA installable (`display: standalone`) — prérequis Web Push iOS 16.4+.
- iOS : push fonctionne UNIQUEMENT si l'app est installée sur l'écran d'accueil.

#### Page Récap (`page-recap`)
- Switch Quotidien / Hebdomadaire.
- Quotidien : KPIs, meilleure/pire (% jour), analyse IA, détail des lignes. "Générer maintenant" = génération locale.
- Hebdomadaire : généré le vendredi 20h — KPIs semaine, meilleure/pire, dividendes à venir, rapport IA 6 sections.
- Données : `users/{uid}/data/recap` et `users/{uid}/data/weeklyRecap`.

#### Rapport IA (daily-recap.js)
- **Tavily** (`TAVILY_API_KEY`) : recherche web par ligne — gratuit 1000/mois.
- **Mistral** (`MISTRAL_API_KEY`) : rédige le rapport. Format imposé "Titre: corps", rendu par `_renderAiReport`.
- Gemini abandonné : free tier sans quota (429).

#### Workflow `daily-recap.yml`
- Cron `0 18 * * 1-5` (≈20h Paris). Vendredi génère aussi le rapport hebdo.
- `workflow_dispatch` : inputs `target_uid` + `force_weekly`.
- Secrets : `FIREBASE_SERVICE_ACCOUNT`, `MISTRAL_API_KEY`, `TAVILY_API_KEY`.

---

### Session 2026-05-15 — Watchlist inline chart
- Clic sur ligne watchlist → chart Chart.js inline avec boutons 1J/1S/1M/3M/6M/1A/Max.
- Prix converti en € via `toEur()`.
- Max = `period1=946886400` (jan 2000) + params Yahoo exacts.
- Fonctions : `loadWlChart()` dans `js/app.js` (~ligne 4410).

---

### État architecture dividendes (2026-05-14)

#### `data/dividendes.json`
- Patch layer JSON — contient uniquement `next` (prochain dividende annoncé) par ticker. Pas d'historique en dur.
- Historique dividendes passés : chargé dynamiquement via Yahoo Finance API.
- `fetchDivHistory` injecte l'entrée `next` du JSON dans l'historique Yahoo.

#### GitHub Actions (`dividendes.yml`)
- Tourne chaque lundi 6h UTC + `workflow_dispatch`.
- Scrape Boursorama : regex montant + date ex-div. Date paiement : parse `.c-event-card`.
- Merge strategy : préserve entrées `confirmed: true` avec date passée.

#### Tickers mappés Boursorama
```
AI.PA→1rPAI, TTE.PA→1rPTTE, BNP.PA→1rPBNP, ACA.PA→1rPACA, SAN.PA→1rPSAN,
OR.PA→1rPOR, MC.PA→1rPMC, ENGI.PA→1rPENGI, DG.PA→1rPDG, SU.PA→1rPSU,
RI.PA→1rPRI, CAP.PA→1rPCAP, KER.PA→1rPKER, SAF.PA→1rPSAF, CS.PA→1rPCS
```

#### Affichage dividendes (`renderDivHistory`)
- Table 7 colonnes : Date / Action / Montant total / Par action / Période / Statut / Source.
- Statut : `⏳ Annoncé · versement DATE` (annoncé), `✓ Reçu`.
- Filtre par défaut : dividendes pendant période de détention. Bouton "Avant achat (N)" pour le reste.

---

### Design (Trade Republic style — fusionné main 2026-05-14)
- Stat cards borderless : transparent bg, `border-right` séparateur, `border-radius:0`, no 3D hover.
- Section cards + table containers : transparent, no border, padding réduit.
- Mobile : stat-cards restaurées avec `var(--s1)` bg + border.
- `.stats-grid` : `gap:0`, `border-top/bottom`. `.stat-value` : `font-size: 24px`.

---

### Notes techniques diverses

#### Logo / Favicon
- `logo.png` : logo fond sombre — utilisé dans login, register, sidebar, mobile header, favicon, apple-touch-icon.
- Favicon : `<link rel="icon" type="image/png" href="logo.png">` + `<link rel="apple-touch-icon" href="logo.png">`.

#### Chart portfolio (`#portf-chart-card`)
- Plus-value latente dans header : `totalVal - totalInvested` calculé depuis données portfolio (PRU × qty).
- Subtitle cliquable `depuis le début` → toggle entre % et €.
- `renderPortfolioChart()` : `legend.display: false`, axes masqués, `beginAtZero: false`, gradient dynamique.

#### Avatar utilisateur
- Avatar = logo Capital Board recoloré par `hue-rotate`, teinte dérivée de l'uid.
- L'utilisateur choisit sa couleur (palette 12 teintes) → `avatarHue` dans settings.

#### Scripts utilitaires (ne pas relancer sans vérif)
- `fix_html_colors.py` : patchait `stroke="currentColor"` → stroke coloré dans HTML. Déjà appliqué (commit 883ec47). **Ne pas relancer.**

#### Vouvoiement UI
- Tous les textes user basculés en vouvoiement (`tu`→`vous`, `ton`→`votre`, etc.). Persisté.

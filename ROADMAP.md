# Roadmap Capital Board

État des chantiers du projet. À jour au 2026-05-26.

---

## Modifs dashboard en cours

Reprise des évolutions UX/UI du dashboard.

- [x] **Chat support 1-to-1 user ↔ admin** — Firestore temps réel, badge non-lu, vue admin avec liste threads. Setup: voir `SUPPORT_CHAT_SETUP.md` (config ADMIN_UID + règles Firestore requises).
- [x] **Page custom auth-action.html** (2026-05-26) — remplace UI Firebase défaut pour verifyEmail/resetPassword/recoverEmail/signIn, theme Capital Board. À configurer Console Firebase → "Customize action URL".
- [x] **Suppression compte via mail confirmation** (2026-05-30) — OTP 6 chiffres custom via EmailJS (publicKey + service Gmail). Code stocké Firestore `users/{uid}/data/deleteOtp` (TTL 10min, max 5 tentatives), envoi via template `template_8qr2a3g`. Mail confirmation post-suppression conservé (template `template_l1uno1h`). Magic link Firebase abandonné (quota Spark 5/jour). `delete-confirm.html` supprimé.

---

## Prochain chantier principal

### Conversion démo → inscription avec migration dataset

Permettre à un utilisateur en mode démo (`?demo=1`) de s'inscrire et de garder/migrer le dataset démo enrichi vers son nouveau compte Firestore.

**Sous-tâches:**
- [ ] CTA "Créer mon compte" visible en mode démo
- [ ] Au signup réussi depuis démo : copier `_localCache` démo → Firestore `users/{uid}/data/*`
- [ ] Bypass popup dividende auto pendant migration
- [ ] Confirmer succès + redirect dashboard

---

### À suivre

- Conversion démo → inscription avec migration dataset
- Calculateur fiscal PEA
- Heatmap secteurs portfolio
- Export PDF rapport mensuel
- **Migration envoi mail EmailJS → Cloudflare Worker** (quand domaine custom dispo) — vire la limite EmailJS 200/mois. Choix arrêté : **Cloudflare Worker** (100k req/j gratuit) garde la clé API secrète + relaie vers Brevo (9000 mail/mois gratuit) ou Resend (3000/mois, exige domaine vérifié). Navigateur → `fetch(worker.dev/send)` → Worker → API mail → user. Remplacer les 3 appels `emailjs.send()` dans `js/app.js` (OTP 2FA `template_8qr2a3g`, OTP suppression, confirmation `template_l1uno1h`). Le code Firestore OTP (stockage/TTL/vérif) ne change pas. Full gratuit hors coût domaine (~10€/an, pris par ailleurs). Dépend du domaine pour le `from: noreply@domaine`.

---

## Livré récemment

- **Code PIN 6 chiffres obligatoire** (2026-05-30) — app lock demandé à chaque rechargement de page. Stocké SHA-256(salt + pin) dans `users/{uid}/data/security`. Vues dédiées : force setup (comptes sans PIN), lock screen (6 dots + 5 tentatives max), modal change depuis Profil. Keypad numérique custom (grille 3x4 + backspace SVG) sous chaque input, désactive clavier natif mobile + masque chiffres saisis. Non désactivable.
- **Masquer le solde** (2026-05-30) — toggle œil dans header mobile + sidebar desktop, remplace tous les chiffres `€`/`%`/`$`/etc par `•` via MutationObserver + WeakMap. Throttle requestAnimationFrame pour perf. Persistant localStorage.
- **2FA améliorations** (2026-05-30) — IP publique IPv4 via chain ipify→ipapi.co, localisation pays uniquement (drapeau + nom FR traduit). Template EmailJS dédié 2FA (`template_l1uno1h`). Refonte CSS carte appareil (header + grille 2 cols + footer). Modal Capital Board pour révocation. Révocation appareil courant autorisée (Révoquer & déconnecter → 2FA redemande au prochain login).
- **2FA device-based obligatoire** (2026-05-30) — chaque nouvel appareil/navigateur déclenche un OTP email (template EmailJS `template_8qr2a3g`) avant accès app. `deviceId` UUID stocké localStorage, trust persisté 90 jours dans `users/{uid}/data/trustedDevices`. Vue dédiée `#device-verify-view`. Auto-trust 1er device au signup (skip 2FA pour éviter double mail). Section Profil "Appareils de confiance" avec liste + révocation individuelle + révoquer tous les autres.
- **Vérification email à l'inscription** (2026-05-25) — `sendEmailVerification` au signup, gate `onAuthStateChanged` bloque dashboard tant que `!emailVerified`, vue `#verify-view` dédiée avec polling 4s + listeners focus/visibilitychange pour unlock auto au retour sur PWA iPhone, throttle renvoi 60s. Firestore rules gatées via `request.auth.token.email_verified`.
- **Suppression compte complète Firebase** (2026-05-25) — modal stylé 2 étapes (warning + mdp), `deleteAllUserData` nettoie tous les docs `users/{uid}/data/*` + doc racine + supportChats messages + supportThreads + presence + roles + Storage `support-attachments/{uid}/*`. Mapping erreurs Auth en FR.
- **Mode démo sans inscription** (`?demo=1`) — dataset fictif PEA enrichi (9 lignes + 14 tx + 7 versements + recap IA), bandeau orange persistant, bypass Firestore/Auth/Push, page Performance bloquée avec CTA signup, popup dividende auto désactivé
- **PWA scope restreint** (`./app.html`) + hide liens externes en standalone iOS
- **Auto-redirect landing → app** si user authentifié (bypass via `?stay=1`)
- **Navbar landing** floating pill sticky avec ancres + burger mobile
- Analyse IA quotidienne (Mistral + Tavily)
- Alertes prix push (Web Push iOS/Android)
- Section comparatif vs concurrents (Yahoo Finance / Trade Republic / Finary)
- Section sécurité détaillée (8 garanties)
- FAQ (8 questions)
- Badge GitHub stars live
- Refonte bouton Accueil sidebar
- Bio créateur sur landing

---

## Stack technique

| Couche | Techno |
|---|---|
| Auth | Firebase Auth |
| Database | Firestore (europe-west1) |
| IA | Mistral AI + Tavily Search |
| Données marché | Yahoo Finance API |
| Charts | Chart.js |
| Notifications | Web Push (VAPID) |
| Hosting | GitHub Pages |
| Cron jobs | GitHub Actions |
| Backend scripts | Python 3.11 |

---

## Prévu (priorisé)

1. **Tracking ETF automatique** — détection composition pour analyse risque sectoriel
2. **Multi-portefeuilles** — PEA + PEA-PME + CTO dans une même interface
3. **Alertes Telegram** — alternative aux push pour utilisateurs Telegram
4. **Export fiscal** — formulaire 2042 simplifié auto-généré
5. **Screenshots landing** — captures réelles du dashboard à intégrer en section "Aperçu"

---

## Ouvert aux suggestions

Issues GitHub: https://github.com/armelpltr/Dashboard-PEA/issues

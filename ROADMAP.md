# Roadmap Capital Board

État des chantiers du projet. À jour au 2026-05-24.

---

## Modifs dashboard en cours

Reprise des évolutions UX/UI du dashboard.

- [x] **Chat support 1-to-1 user ↔ admin** — Firestore temps réel, badge non-lu, vue admin avec liste threads. Setup: voir `SUPPORT_CHAT_SETUP.md` (config ADMIN_UID + règles Firestore requises).

---

## Prochain chantier principal

### Vérification email à l'inscription

Envoyer un mail de vérification à l'inscription via Firebase Auth (`sendEmailVerification`). Bloquer l'accès à certaines features (ou tout l'app) tant que `user.emailVerified === false`.

**Sous-tâches:**
- [ ] Au signup réussi : `sendEmailVerification(user)` + écran "Vérifiez votre email"
- [ ] Bandeau persistant dans l'app si email non vérifié + bouton "Renvoyer le mail"
- [ ] (Optionnel) Bloquer accès Support / création tickets tant que non vérifié
- [ ] Page `verify-email.html` ou flow inline avec polling `user.reload()` pour détecter validation
- [ ] Personnaliser le template d'email dans Firebase Console (sujet, domaine d'action)

**Bloqueur:** aucun. Firebase Auth gère tout côté serveur (template + lien).

---

### À suivre

- Conversion démo → inscription avec migration dataset
- Calculateur fiscal PEA
- Heatmap secteurs portfolio
- Export PDF rapport mensuel

---

## Livré récemment

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

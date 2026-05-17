
# Contexte Dashboard PEA

## Notes de collaboration
- Ne pas hésiter à proposer l'utilisation de Claude Opus pour les tâches complexes (refactoring majeur, architecture, optimisation avancée).

## Notifications push & Récap (2026-05-17)

### Migration email → push
- Le système d'email (Brevo) est **supprimé**. Tout passe par les notifications push FCM.
- `scripts/daily-recap.js` : ne fait plus d'email. Stocke le récap dans Firestore `users/{uid}/data/recap` + envoie une push courte.
- `scripts/price-alerts.js` : alertes prix par push FCM (plus d'email).
- Préférence renommée `emailRecap` → `pushRecap` (repli sur l'ancienne clé pour anciens users).

### Service worker & PWA
- `firebase-messaging-sw.js` : service worker FCM (notifs en arrière-plan).
- `manifest.json` : PWA installable (`display: standalone`) — prérequis du Web Push iOS 16.4+.
- iOS : push fonctionne UNIQUEMENT si l'app est installée sur l'écran d'accueil (PWA standalone). Astuce affichée sur la page Notifications.
- L'attribution "from Capital View" dans la notif = imposée par l'OS, non masquable.

### Page Récap (`page-recap`)
- Switch **Quotidien / Hebdomadaire**.
- Quotidien : KPIs, meilleure/pire (% jour), analyse IA, détail des lignes. Bouton "⚡ Générer maintenant" = génération locale (pas d'IA, pas de push).
- Hebdomadaire : généré le vendredi 20h — KPIs semaine, meilleure/pire, dividendes à venir, rapport IA 6 sections, détail.
- Données : `users/{uid}/data/recap` et `users/{uid}/data/weeklyRecap`.

### Rapport IA (daily-recap.js)
- **Tavily** (`TAVILY_API_KEY`) : recherche web par ligne — gratuit 1000/mois.
- **Mistral** (`MISTRAL_API_KEY`) : rédige le rapport à partir des résultats Tavily uniquement (pas d'invention).
- Gemini abandonné : free tier sans quota (429).
- Format imposé "Titre: corps", rendu par `_renderAiReport` dans `js/app.js`.
- Dividendes à venir : `data/dividendes.json` (CAC40, confirmé) sinon estimation Yahoo `events=div` (fréquence extrapolée).

### Workflow `daily-recap.yml`
- Cron `0 18 * * 1-5` (≈20h Paris). Le vendredi génère aussi le rapport hebdo.
- `workflow_dispatch` : inputs `target_uid` + `force_weekly` (force le rapport hebdo hors vendredi, pour test).
- Secrets : `FIREBASE_SERVICE_ACCOUNT`, `MISTRAL_API_KEY`, `TAVILY_API_KEY`. (`BREVO_API_KEY` obsolète.)

### Avatar utilisateur
- Avatar = logo Capital View recoloré par `hue-rotate`, teinte par défaut dérivée de l'uid.
- L'utilisateur choisit sa couleur (palette 12 teintes dans le profil) → `avatarHue` dans settings.
- Import de photo et avatars prédéfinis supprimés.

## En cours (2026-05-15) — à reprendre

### Watchlist inline chart — ✅ Résolu (2026-05-15)
- Feature implémentée : clic sur ligne watchlist → chart Chart.js inline avec boutons 1J/1S/1M/3M/6M/1A/Max
- Prix converti en € via `toEur()` (Yahoo retourne parfois USD pour .PA via CORS proxy)
- Max = `period1=946886400` (jan 2000) + params Yahoo exacts, comme reverse-engineered depuis Network tab
- **% période calé sur Yahoo Finance** — problème résolu
- Fonctions concernées : `loadWlChart()` dans `js/app.js` (~ligne 4410)

## État du projet (2026-05-14)

### Architecture dividendes
- `data/dividendes.json` : patch layer JSON — contient uniquement `next` (prochain dividende annoncé) par ticker. Pas d'historique en dur.
- Historique dividendes passés : chargé dynamiquement via Yahoo Finance API (CORS proxies : allorigins.win, corsproxy.io, cors.eu.org, codetabs.com)
- `fetchDivHistory` injecte l'entrée `next` du JSON dans l'historique Yahoo. Si `next.date <= today` → `next: false` (traité comme reçu). Si futur → `next: true` (annoncé).

### GitHub Actions (`dividendes.yml`)
- Tourne chaque lundi 6h UTC + manuel (`workflow_dispatch`)
- Scrape Boursorama : `https://www.boursorama.com/cours/{bourso_id}/`
- Montant + date ex-div : regex `(\d+[,\.]\d+)\s*(?:EUR|€)\s*\((\d{2}/\d{2}/\d{2,4})\)`
- Date paiement : parse HTML `.c-event-card` où `.c-event-card__text` contient "paiement" → extrait `c-event-card__day` (ex: "20") + `c-event-card__month` (ex: "mai") → reconstruit date ISO
- Merge strategy : préserve entrées `confirmed: true` avec date passée (dividende détaché pas encore sur Yahoo)

### Tickers mappés
AI.PA→1rPAI, TTE.PA→1rPTTE, BNP.PA→1rPBNP, ACA.PA→1rPACA, SAN.PA→1rPSAN, OR.PA→1rPOR, MC.PA→1rPMC, ENGI.PA→1rPENGI, DG.PA→1rPDG, SU.PA→1rPSU, RI.PA→1rPRI, CAP.PA→1rPCAP, KER.PA→1rPKER, SAF.PA→1rPSAF, CS.PA→1rPCS

### Affichage dividendes (`js/app.js`)
- `renderDivHistory` : table 7 colonnes — Date / Action / Montant total / Par action / Période / Statut / Source
- Statut : `⏳ Annoncé · versement DATE` (annoncé), `✓ Reçu` (reçu-auto/reçu)
- Source : `Boursorama` (annoncé), `Yahoo Finance` (historique), `Manuel` (saisi)
- Filtre par défaut : dividendes pendant période de détention uniquement. Bouton "Avant achat (N)" pour afficher le reste.
- `_divAllEntries` / `_divShowAll` : vars module pour état filtre

### Problèmes connus / points d'attention
- 8 tickers (SAN, OR, MC, ENGI, DG, SU, RI, AXA) → `next: null` = dividendes 2026 déjà versés avant 14 mai. Normal.
- Yahoo indexe nouveaux dividendes avec ~4-6 semaines de délai → JSON sert de bridge pour cette fenêtre.
- Git push : remote avance souvent (workflow commit JSON). Toujours `git stash && git pull --rebase && git stash pop && git push`.

### Design (Trade Republic style — merged main 2026-05-14)
- Stat cards borderless : transparent bg, no border, `border-right` séparateur, `border-radius:0`, no 3D hover
- Section cards + table containers : transparent, no border, padding réduit
- Mobile : stat-cards restaurées avec `var(--s1)` bg + border
- `.stats-grid` : `gap:0`, `border-top/bottom`
- `.stat-value` : `font-size: 24px`

### Système d'icônes SVG colorées
- **IC object** dans `js/app.js` (top of file) : SVGs inline avec `stroke` hardcodé par couleur
- Couleurs : purple `#7c6df5`, blue `#5b8dee`, gold `#f5b731`, green `#00e09e`, muted `#8892a8`, red `#ff4d6a`
- Icônes JS : briefcase, eye, bell, target, compass, wallet, barchart, gift, trophy, trending, clock, zap, calendar, crown, user, message, dotGreen, dotRed
- **Icônes HTML** (`index.html`) : nav sidebar + mobile drawer — `stroke` hardcodé directement dans le SVG (plus de `stroke="currentColor"`)
  - briefcase/portfolio → `#7c6df5`
  - eye/watchlist → `#5b8dee`
  - bell/notifications → `#f5b731`
  - target/benchmark → `#5b8dee`
  - compass/projections → `#00e09e`
  - wallet/dividendes → `#00e09e`
  - barchart/performance → `#5b8dee`
  - message/chat → `#7c6df5`
  - crown/super admin → `#f5b731`
  - user/profil → `#8892a8`
  - power/déconnexion → `#ff4d6a`

### Logo / Favicon
- `logo.png` : logo fond sombre — utilisé dans login, register, sidebar, mobile header, favicon onglet, apple-touch-icon
- `Hero _ transparent.png` : logo transparent (disponible mais non utilisé en prod)
- Favicon : `<link rel="icon" type="image/png" href="logo.png">` + `<link rel="apple-touch-icon" href="logo.png">`

### Chart portfolio (`#portf-chart-card`)
- Plus-value latente affichée dans header : `totalVal - totalInvested` calculé depuis données portfolio (PRU × qty), pas depuis historique chart
- Subtitle cliquable `depuis le début` → toggle entre % et €
- `renderPortfolioChart()` : `legend.display: false`, axes X/Y masqués, `beginAtZero: false`, gradient + `borderColor` dynamique selon isUp/isDown

### Scripts utilitaires (ne pas relancer sans vérif)
- `fix_html_colors.py` : patchait `stroke="currentColor"` → stroke coloré dans HTML. Déjà appliqué (commit 883ec47). Ne pas relancer.

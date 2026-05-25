
# Contexte Dashboard PEA

## Notes de collaboration
- Ne pas hésiter à proposer l'utilisation de Claude Opus pour les tâches complexes (refactoring majeur, architecture, optimisation avancée).

## Session 2026-05-25

### Vérification email obligatoire à l'inscription
- `sendEmailVerification` envoyé automatiquement au signup (`doRegister` dans `js/app.js`).
- Gate dans `onAuthStateChanged` : si `!user.emailVerified` → `showVerifyView()` au lieu de `startApp()`.
- Nouvelle vue `#verify-view` dans `app.html` (carte login style) : email affiché, instructions 3 étapes, boutons "J'ai vérifié" + "Renvoyer le mail" (throttle 60s) + "Se déconnecter".
- Polling 4s + listeners `focus` + `visibilitychange` → `user.reload()` auto pour débloquer au retour sur l'app (clé pour PWA iPhone : user clique lien Gmail → Safari valide → reviens sur PWA → unlock).
- Fonctions : `showVerifyView`, `startVerifyPolling`, `stopVerifyPolling`, `_veSilentCheck`, `veCheck`, `veResend`, `veLogout`. Vars : `_veLastSent`, `_vePollTimer`.
- `showLoginView` / `showRegisterView` mises à jour pour cacher verify-view + stop polling.
- Bug centrage corrigé : `showVerifyView` doit set `login-screen.style.display = 'flex'` (pas `'block'`, sinon casse le flex centering).

### Firestore rules — gate `email_verified`
- Helper `_isVerified()` ajouté (check `request.auth.token.email_verified == true`).
- Writes gatés : `users/{uid}`, `ideas` (root + messages), `presence`, `supportChats` create+update, `supportThreads`.
- Reads laissés ouverts (sinon UI casse). `roles` write **non gaté** (sinon signup casse, user doit pouvoir créer son doc rôle). `config` inchangé (superadmin déjà fiable).
- Storage `support-attachments/{uid}/{file}` doit aussi gater write si activé.

### Suppression compte — modal stylé + cleanup Firebase complet
- Remplace `confirm()` + `prompt()` natifs par modal 2 étapes `#delete-account-modal` (icône poubelle rouge → warning → continuer → étape mot de passe avec input dédié → supprimer).
- Provider Google → skip étape mdp (réauth popup non gérée).
- `deleteAllUserData(uid)` étendu (`js/app.js` ~ligne 406) supprime :
  - Tous docs `users/{uid}/data/*` : portfolio, transactions, versements, watchlist, dailyValues, alerts, notifHistory, trCohort, settings, recap, weeklyRecap, fcmTokens.
  - Doc racine `users/{uid}` (email mapping pour gestion rôles).
  - `supportChats/{uid}/messages/*` (iter `getDocs` + `deleteDoc`) + `supportChats/{uid}` + `supportThreads/{uid}`.
  - `presence/{uid}` + `roles/{uid}`.
  - Storage : `support-attachments/{uid}/*` (import dynamique `listAll` + `deleteObject`).
- Mapping erreurs Firebase Auth en français inline (`wrong-password`, `requires-recent-login`, etc.).
- Fonctions : `confirmDeleteAccount` (ouvre modal), `closeDeleteAccountModal`, `delGoToStep2`, `delBackToStep1`, `delFinalize`.

### Checkboxes register — bug fix
- Bug : `<div onclick=".click()">` parent + click direct sur checkbox = double toggle = annule.
- Fix : `onclick="event.stopPropagation()"` sur checkbox + guard `if(event.target.id!=='reg-rgpd')` sur parent (idem reg-recap).

### Cache busting `app.js`
- `<script src="js/app.js?v=YYYYMMDDx">` dans `app.html` (ligne 1289) — bump à chaque release notable. Évite que GitHub Pages / browsers servent vieille version.
- Actuel : `?v=20260525b`.

### À faire côté Firebase Console (manuel)
- Authentication → Templates → Email verification → langue **French** + sujet "Confirme ton email Capital Board" + corps FR custom.
- (Optionnel) Custom domain `auth.capitalboard.app` pour réduire spam (templates → "Customize domain" → DNS CNAME).

## À reprendre (prochaine session)
- CSS mobile : revue générale à poursuivre.
- (Optionnel) Migration vers custom domain email Firebase pour éviter spam.
- Vérifier templates email FR appliqués dans Console Firebase (à faire manuellement).
- Prochain chantier ROADMAP : conversion démo → inscription avec migration dataset, calculateur fiscal PEA, heatmap secteurs, export PDF mensuel.

## Session 2026-05-22

### Dividendes → solde espèces
- Les transactions `type:'dividend'` sont désormais comptées dans le solde espèces (5 calculs : `stat-cash`, trophées, `cashResidual` live ×2, `cashAtDate`).
- Dividendes auto-détectés Yahoo (date de versement passée) → popup de confirmation "Dividende reçu ?" (Oui / Pas encore) avant enregistrement comme transaction `source:'yahoo-auto'`. Dédup ticker+date, file d'attente. Fonctions : `_processDivPromptQueue`, `_divPromptQueue`, `_divDeclined`.

### Tooltip graphique portefeuille
- Tooltip canvas Chart.js remplacé par tooltip HTML externe (`portfolioChartTooltip`) pour afficher des icônes SVG : calendrier (date), portefeuille (prix), pastille verte/rouge (achat/vente).
- La date du tooltip affiche l'année (`12 nov. 2029`). L'axe X est masqué → les labels ne servent qu'au tooltip.

### Emojis → SVG (tous onglets)
- Tous les emojis image remplacés par des icônes SVG dans `index.html`, `js/app.js`, `cgu.html`, `politique-confidentialite.html`.
- Emojis retirés des logs et titres de notifs des scripts cron (`daily-recap.js`, `price-alerts.js`).
- `showConfirmModal` (icône) et `_showChatToast` (icône) passés en `innerHTML` pour rendre du SVG. `showConfirmModal` accepte aussi `onCancel`, `okLabel`, `cancelLabel`.
- Symboles typographiques monochromes conservés (✓ ✕ → ↻ ▲ ✦ ☰ ⏻).

### UI toolbar / profil
- Bouton Auto-refresh retiré (le refresh 60s reste actif au démarrage via `startApp`).
- Emojis des boutons Importer/Export CSV, champ Filtrer, titre Historique → SVG.
- Profil → Récap quotidien : `<select>` remplacé par 2 boutons Activé/Désactivé (`_paintRecapButtons`).
- Bouton « Modifier » du portefeuille (ligne + détail mobile) : caractère `✏` → `IC.edit` (SVG).

### Historique des transactions
- Affiche les 10 transactions les plus récentes par défaut. Bouton « Afficher plus (N) » / « Afficher moins » (`toggleTxHistory`, `_txShowAll`, `TX_HISTORY_LIMIT`, conteneur `#tx-show-more-wrap`).
- Scroll interne 400px retiré : le tableau s'étend en pleine hauteur, la page scrolle (`overflow-x:auto` gardé pour mobile).

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
- Icônes JS (`IC`) : briefcase, bell, target, wallet, barchart, gift, trophy, trending, clock, zap, calendar, crown, user, message, list, trash, trendDown, bellOff, phone, mail, moon, inbox, scroll, checkCirc, square, lock, save, eye, coin, warning, dotGreen, dotRed, dotGold
- Tous les emojis image de l'app ont été remplacés par des SVG (session 2026-05-22) — ne pas réintroduire d'emoji, utiliser `IC.*` ou un SVG inline
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

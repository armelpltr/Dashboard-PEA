# Capital Board

**Suivi personnel de patrimoine financier — PEA, actions, ETF**

Capital Board est une application web gratuite et open source pour suivre son portefeuille boursier. Interface moderne, sécurisée, conçue pour les investisseurs particuliers français.

🌐 **[capitalboard.fr](https://capitalboard.fr)**

---

## Fonctionnalités

- **Portefeuille** — suivi des positions, PRU, plus-values latentes et réalisées
- **Dividendes** — historique, prochains versements, auto-détection Yahoo Finance
- **Récap IA** — analyse quotidienne et hebdomadaire (Mistral AI + Tavily)
- **Alertes prix** — notifications push sur cours cible
- **Benchmark** — comparaison vs CAC 40, MSCI World, S&P 500
- **Performance** — TWR, graphiques historiques, heatmap secteurs
- **Mode démo** — test sans inscription avec dataset fictif enrichi
- **Sécurité** — 2FA device-based, code PIN, vérification email, Cloudflare Turnstile

---

## Stack technique

| Couche | Technologie |
|---|---|
| Auth & Database | Firebase (Auth + Firestore) |
| IA | Mistral AI + Tavily Search |
| Données marché | Yahoo Finance API |
| Charts | Chart.js |
| Notifications | Web Push (FCM / VAPID) |
| Hosting | GitHub Pages |
| Backend API | Cloudflare Workers |
| Email transactionnel | Resend |
| Cron jobs | GitHub Actions |

---

## Installation

Ce projet est une application statique sans build step.

```bash
git clone https://github.com/arrmel-capitalboard/Capital-Board.git
cd Capital-Board
```

Ouvre `pages/index.html` dans un navigateur ou sers le dossier avec n'importe quel serveur HTTP.

### Prérequis pour l'hébergement complet

1. **Firebase** — créer un projet, activer Auth (email/password + Google) et Firestore
2. **Cloudflare Worker** — déployer `capital-board-worker/` avec `wrangler deploy`
3. **Resend** — créer un compte et vérifier ton domaine
4. **GitHub Actions secrets** — `FIREBASE_SERVICE_ACCOUNT`, `MISTRAL_API_KEY`, `TAVILY_API_KEY`

Voir `docs/CONTEXT_dashboard_pea.md` pour la documentation complète.

---

## Configuration

Remplace les valeurs dans `js/app.js` :

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  // ...
};

const WORKER_URL = 'https://ton-worker.workers.dev';
const TURNSTILE_SITEKEY = '...';
```

---

## Licence

[AGPL-3.0](LICENSE) — Armel Plantier, 2026

Si tu héberges une version modifiée de Capital Board comme service public, tu dois publier le code source modifié sous la même licence.

---

## Contribuer

Les issues et PR sont les bienvenues sur [GitHub](https://github.com/arrmel-capitalboard/Capital-Board/issues).

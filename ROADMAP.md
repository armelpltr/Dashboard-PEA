# Roadmap Capital Board

État des chantiers du projet. À jour au 2026-05-24.

---

## Prochain chantier principal

### Conversion démo → inscription avec migration dataset

Lors d'un signup depuis le mode démo, copier automatiquement le portefeuille démo dans le nouveau compte Firestore. Permet à l'user de garder ses ajustements faits pendant la démo.

**Bloqueur:** aucun

---

## Livré récemment

- **Mode démo sans inscription** (`?demo=1`) — dataset fictif PEA, bandeau persistant, bypass Firestore
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

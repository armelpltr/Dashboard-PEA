# Roadmap Capital Board

État des chantiers du projet. À jour au 2026-05-24.

---

## Prochain chantier principal

### Mode démo sans inscription

Permettre l'exploration complète du dashboard sans création de compte, avec un dataset fictif réaliste.

**Objectif:** réduire la friction de conversion sur la landing. Le visiteur clique "Voir la démo" et atterrit dans un dashboard préchargé.

**Sous-tâches:**
- [ ] Créer dataset fictif (`demo-portfolio.json`) — ~15 lignes, mix actions FR/US/ETF
- [ ] Bypass auth dans `app.html` quand `?demo=1` présent dans l'URL
- [ ] Désactiver les écritures Firestore en mode démo (read-only sur dataset local)
- [ ] Bandeau persistant "Mode démo — créer un compte pour sauvegarder"
- [ ] Bouton conversion démo → inscription qui copie le dataset démo dans le nouveau compte
- [ ] Lien "Voir la démo" sur landing (hero CTA + section À propos)

**Effort estimé:** ~90 min
**Bloqueur:** aucun

---

## Livré récemment

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

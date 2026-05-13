
# Contexte Dashboard PEA

## Notes de collaboration
- Ne pas hésiter à proposer l'utilisation de Claude Opus pour les tâches complexes (refactoring majeur, architecture, optimisation avancée).

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

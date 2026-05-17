// ─────────────────────────────────────────────────────────────
// daily-recap.js — Récap quotidien Capital View
// Lancé par GitHub Actions chaque jour ouvré à 20h (Paris)
//
// Ne fait plus d'email : envoie une notification push courte et
// stocke le récap complet dans Firestore pour l'espace "Récap" du
// dashboard.
// ─────────────────────────────────────────────────────────────

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore }        from 'firebase-admin/firestore';
import { getAuth }             from 'firebase-admin/auth';
import { getMessaging }        from 'firebase-admin/messaging';
import fetch                   from 'node-fetch';
import { Mistral }             from '@mistralai/mistralai';

// ─── CONFIG ──────────────────────────────────────────────────
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
const MISTRAL_KEY    = process.env.MISTRAL_API_KEY;

initializeApp({ credential: cert(serviceAccount) });
const db        = getFirestore();
const fbAuth    = getAuth();
const messaging = getMessaging();
const mistral   = new Mistral({ apiKey: MISTRAL_KEY });

// ─── HELPERS ─────────────────────────────────────────────────
const fmt  = n => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
const fmtp = n => (n >= 0 ? '+' : '') + n.toFixed(2) + '%';
const todayIso = new Date().toISOString().slice(0, 10);
const today    = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

// ─── RÉCUPÉRER LES UTILISATEURS FIREBASE ─────────────────────
async function getAllUsers() {
  const result = await fbAuth.listUsers();
  return result.users.map(u => ({
    uid:   u.uid,
    email: u.email,
    name:  u.displayName || u.email.split('@')[0],
  }));
}

// ─── RÉCUPÉRER LES SETTINGS FIRESTORE ───────────────────────
async function getUserSettings(uid) {
  const snap = await db.doc(`users/${uid}/data/settings`).get();
  return snap.exists ? snap.data() : {};
}

// La préférence de récap : pushRecap, avec repli sur l'ancien emailRecap.
function recapEnabled(settings) {
  if (settings.pushRecap !== undefined)  return settings.pushRecap !== false;
  if (settings.emailRecap !== undefined) return settings.emailRecap !== false;
  return true;
}

// ─── RÉCUPÉRER LE PORTFOLIO FIRESTORE ────────────────────────
async function getUserPortfolio(uid) {
  const snap = await db.doc(`users/${uid}/data/portfolio`).get();
  return snap.exists ? (snap.data().items || []) : [];
}

// ─── PRIX YAHOO FINANCE ──────────────────────────────────────
async function fetchPrice(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
  try {
    const res  = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(8000) });
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price = meta.regularMarketPrice;
    const prev  = meta.chartPreviousClose || meta.previousClose || price;
    const changePct = meta.regularMarketChangePercent !== undefined
      ? meta.regularMarketChangePercent
      : prev ? ((price - prev) / prev) * 100 : 0;
    return { price, prev, changePct, name: meta.shortName || meta.longName || ticker };
  } catch(e) {
    console.warn(`Prix non disponible pour ${ticker}:`, e.message);
    return null;
  }
}

// ─── MISTRAL — COMMENTAIRE IA ────────────────────────────────
// ─── ACTUALITÉS YAHOO FINANCE ────────────────────────────────
// Récupère les titres d'actualité récents (< 3 jours) pour un ticker.
async function fetchNews(ticker) {
  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(ticker)}&newsCount=6&quotesCount=0`;
  try {
    const res  = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(8000) });
    const json = await res.json();
    const now  = Date.now();
    return (json.news || [])
      .filter(n => n.title && n.providerPublishTime && (now - n.providerPublishTime * 1000) < 3 * 86400000)
      .slice(0, 5)
      .map(n => n.title.trim());
  } catch(e) {
    console.warn(`Actus indisponibles pour ${ticker}:`, e.message);
    return [];
  }
}

// ─── MISTRAL — RAPPORT QUOTIDIEN ─────────────────────────────
// Rapport ligne par ligne, ancré sur de vraies actualités (pas
// d'invention : si aucune actu, le modèle l'indique).
async function generateReport(lines, totalPct, newsByTicker) {
  const lineInfo = lines.map(l =>
    `- ${l.name} (${l.ticker}) : ${fmtp(l.changePct)} aujourd'hui`
  ).join('\n');

  const newsInfo = lines.map(l => {
    const h = newsByTicker[l.ticker] || [];
    return `${l.name} (${l.ticker}) :\n`
      + (h.length ? h.map(t => '  • ' + t).join('\n') : '  (aucune actualité récente trouvée)');
  }).join('\n\n');

  const prompt = `Tu es analyste financier. Rédige le rapport quotidien de ce portefeuille PEA (${today}).

Performance globale du jour : ${fmtp(totalPct)}

Lignes du portefeuille :
${lineInfo}

Actualités récentes par ligne (source Yahoo Finance) :
${newsInfo}

Consignes de rédaction :
- Commence par une section "**Synthèse**" : une phrase sur la tendance globale du jour.
- Ensuite, UNE section par ligne : titre en gras au format "**Nom de la ligne** (variation%)".
- Pour chaque ligne, 1 à 2 phrases expliquant le mouvement du jour.
- Appuie-toi UNIQUEMENT sur les actualités fournies. N'invente JAMAIS d'information, de chiffre ni d'événement.
- Si aucune actualité pertinente n'est fournie pour une ligne, écris exactement : "Rien de notable, mouvement lié à la tendance de marché."
- Français, factuel, concis. Aucun conseil d'achat ou de vente.
- Ne commence pas par une formule de politesse.`;

  try {
    const res = await mistral.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 900,
    });
    return res.choices[0].message.content.trim();
  } catch(e) {
    console.warn('Mistral error:', e.message);
    return 'Analyse IA indisponible aujourd\'hui.';
  }
}

// ─── ENVOYER PUSH FCM ────────────────────────────────────────
async function sendFcmPush(uid, title, body) {
  try {
    const roleSnap = await db.doc(`roles/${uid}`).get();
    const token = roleSnap.exists ? roleSnap.data().fcmToken : null;
    if (!token) { console.log(`  — Pas de token FCM pour ${uid}, push ignoré`); return; }
    await messaging.send({ token, notification: { title, body }, data: { type: 'daily_recap' } });
    console.log(`  📲 Push FCM envoyé à ${uid}`);
  } catch(e) {
    console.warn(`  ⚠️  Push FCM échoué pour ${uid}:`, e.message);
  }
}

// ─── STOCKER LE RÉCAP COMPLET DANS FIRESTORE ─────────────────
async function saveRecap(uid, recap) {
  await db.doc(`users/${uid}/data/recap`).set(recap);
  console.log(`  💾 Récap stocké pour ${uid}`);
}

// ─── LOG HISTORIQUE NOTIFS IN-APP ────────────────────────────
async function logNotifHistory(uid, type, title, body) {
  const snap = await db.doc(`users/${uid}/data/notifHistory`).get();
  const history = snap.exists ? (snap.data().items || []) : [];
  history.unshift({ id: Date.now(), type, title, body, timestamp: new Date().toISOString(), read: false });
  if (history.length > 50) history.splice(50);
  await db.doc(`users/${uid}/data/notifHistory`).set({ items: history });
}

// ─── MAIN ─────────────────────────────────────────────────────
async function main() {
  const targetUid = (process.env.TARGET_UID || '').trim();
  console.log(`\n🚀 Démarrage récap quotidien — ${today}`);
  if (targetUid) console.log(`🎯 Cible : ${targetUid}\n`);
  else console.log(`📢 Envoi à tous les utilisateurs\n`);

  // 1. Récupérer tous les utilisateurs
  let users = await getAllUsers();
  if (targetUid) users = users.filter(u => u.uid === targetUid);
  console.log(`👥 ${users.length} utilisateur(s) traité(s)`);

  for (const user of users) {
    console.log(`\n📊 Traitement de ${user.name} (${user.email})...`);

    // 2. Vérifier la préférence de l'utilisateur
    const settings = await getUserSettings(user.uid);
    if (!recapEnabled(settings)) {
      console.log(`  🔕 Récap désactivé pour ${user.name}, ignoré`);
      continue;
    }

    // 3. Récupérer le portfolio
    const portfolio = await getUserPortfolio(user.uid);
    if (!portfolio.length) {
      console.log(`  ⚠️  Portfolio vide, ignoré`);
      continue;
    }
    console.log(`  📋 ${portfolio.length} ligne(s) détectée(s)`);

    // 4. Récupérer les prix en parallèle
    const priceResults = await Promise.all(
      portfolio.map(async row => {
        const data = await fetchPrice(row.ticker);
        return { row, data };
      })
    );

    // 5. Construire les lignes enrichies
    const lines = priceResults
      .filter(({ data }) => data !== null)
      .map(({ row, data }) => ({
        ticker:    row.ticker,
        name:      data.name || row.name || row.ticker,
        qty:       row.qty,
        buyPrice:  row.buyPrice || 0,
        price:     data.price,
        prev:      data.prev,
        changePct: data.changePct,
        value:     row.qty * data.price,
        pnl:       row.qty * (data.price - (row.buyPrice || data.price)),
      }));

    if (!lines.length) {
      console.log(`  ⚠️  Aucun prix disponible, ignoré`);
      continue;
    }

    // 6. Calculer les totaux
    const totalValue     = lines.reduce((s, l) => s + l.value, 0);
    const totalInvested  = lines.reduce((s, l) => s + l.qty * l.buyPrice, 0);
    const totalPnl       = totalValue - totalInvested;
    const totalPnlPct    = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
    const totalDayChange = lines.reduce((s, l) => s + l.qty * (l.price - l.prev), 0);
    const prevValue      = lines.reduce((s, l) => s + l.qty * l.prev, 0);
    const totalDayPct    = prevValue > 0 ? (totalDayChange / prevValue) * 100 : 0;

    console.log(`  💰 Valeur: ${fmt(totalValue)} | Jour: ${fmtp(totalDayPct)}`);

    // 7. Récupérer les actualités par ligne, puis générer le rapport IA
    console.log(`  📰 Récupération des actualités...`);
    const uniqTickers = [...new Set(lines.map(l => l.ticker))];
    const newsPairs   = await Promise.all(uniqTickers.map(async t => [t, await fetchNews(t)]));
    const newsByTicker = Object.fromEntries(newsPairs);
    console.log(`  🤖 Génération du rapport Mistral...`);
    const aiComment = await generateReport(lines, totalDayPct, newsByTicker);

    // 8. Construire le récap complet (affiché dans le dashboard)
    const sorted = [...lines].sort((a, b) => b.changePct - a.changePct);
    const recap = {
      date:           todayIso,
      dateLabel:      today,
      generatedAt:    new Date().toISOString(),
      totalValue,
      totalInvested,
      totalPnl,
      totalPnlPct,
      totalDayChange,
      totalDayPct,
      lines,
      best:  sorted.length     ? { name: sorted[0].name, changePct: sorted[0].changePct } : null,
      worst: sorted.length > 1 ? { name: sorted[sorted.length-1].name, changePct: sorted[sorted.length-1].changePct } : null,
      aiComment,
    };

    // 9. Stocker le récap + envoyer push courte + logguer l'historique
    await saveRecap(user.uid, recap);

    const up      = totalDayPct >= 0;
    const emoji   = up ? '📈' : '📉';
    const title   = `Récap du jour : ${emoji} ${fmtp(totalDayPct)}`;
    const body    = 'Touchez pour voir le détail.';
    await sendFcmPush(user.uid, title, body);
    await logNotifHistory(user.uid, 'daily_recap', title, body);
  }

  console.log('\n✅ Récap quotidien terminé\n');
}

main().catch(err => {
  console.error('❌ Erreur fatale:', err);
  process.exit(1);
});

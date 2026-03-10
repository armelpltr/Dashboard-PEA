// ─────────────────────────────────────────────────────────────
// daily-recap.js — Récap quotidien PEA Dashboard
// Lancé par GitHub Actions chaque jour ouvré à 18h (Paris)
// ─────────────────────────────────────────────────────────────

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore }        from 'firebase-admin/firestore';
import { getAuth }             from 'firebase-admin/auth';
import fetch                   from 'node-fetch';
import { Mistral }             from '@mistralai/mistralai';

// ─── CONFIG ──────────────────────────────────────────────────
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
const BREVO_KEY      = process.env.BREVO_API_KEY;
const MISTRAL_KEY    = process.env.MISTRAL_API_KEY;

initializeApp({ credential: cert(serviceAccount) });
const db      = getFirestore();
const fbAuth  = getAuth();
const mistral = new Mistral({ apiKey: MISTRAL_KEY });

// ─── HELPERS ─────────────────────────────────────────────────
const fmt  = n => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
const fmtp = n => (n >= 0 ? '+' : '') + n.toFixed(2) + '%';
const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

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
  return snap.exists ? snap.data() : { emailRecap: true };
}

// ─── RÉCUPÉRER LE PORTFOLIO FIRESTORE ────────────────────────
async function getUserPortfolio(uid) {
  const snap = await db.doc(`users/${uid}/data/portfolio`).get();
  return snap.exists ? (snap.data().items || []) : [];
}

// ─── PRIX YAHOO FINANCE ──────────────────────────────────────
async function fetchPrice(ticker) {
  // Même appel que le dashboard (range=1d) pour avoir les mêmes valeurs
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
  try {
    const res  = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(8000) });
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price = meta.regularMarketPrice;
    const prev  = meta.chartPreviousClose || meta.previousClose || price;
    // Utiliser regularMarketChangePercent si dispo (plus fiable)
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
async function generateComment(lines, totalPct) {
  const summary = lines.map(l =>
    `${l.name} (${l.ticker}): ${fmtp(l.changePct)} aujourd'hui, ${l.qty} titres, valeur ${fmt(l.value)}`
  ).join('\n');

  const prompt = `Tu es un conseiller financier expert. Voici la performance du portefeuille PEA aujourd'hui (${today}) :

Performance globale : ${fmtp(totalPct)}

Détail des lignes :
${summary}

Rédige un commentaire synthétique de 3-4 phrases en français, professionnel mais accessible. 
Mentionne les points saillants (meilleure/pire performance), donne un contexte marché si pertinent, et termine par une perspective courte.
Ne commence pas par "Bonjour" ou formule de politesse. Va directement au contenu.`;

  try {
    const res = await mistral.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 300,
    });
    return res.choices[0].message.content.trim();
  } catch(e) {
    console.warn('Mistral error:', e.message);
    return 'Analyse IA indisponible aujourd\'hui.';
  }
}

// ─── TEMPLATE EMAIL HTML ─────────────────────────────────────
function buildEmailHtml({ userName, lines, totalValue, totalPnl, totalPnlPct, totalDayChange, totalDayPct, aiComment }) {

  const isPos     = totalDayChange >= 0;
  const isPosGlobal = totalPnl >= 0;
  const colorDay  = isPos ? '#00e09e' : '#ff4d6a';
  const colorGlob = isPosGlobal ? '#00e09e' : '#ff4d6a';
  const arrowDay  = isPos ? '▲' : '▼';

  const rows = lines.map(l => {
    const c = l.changePct >= 0 ? '#00e09e' : '#ff4d6a';
    const a = l.changePct >= 0 ? '▲' : '▼';
    const dayVal = l.qty * (l.price - l.prev);
    return `
      <tr style="border-bottom:1px solid #1e2130">
        <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#edf0f7">${l.name}</td>
        <td style="padding:12px 8px;font-size:11px;color:#8892a8;font-family:monospace">${l.ticker}</td>
        <td style="padding:12px 8px;font-size:12px;color:#edf0f7;font-family:monospace">${l.qty}</td>
        <td style="padding:12px 8px;font-size:12px;color:#edf0f7;font-family:monospace">${fmt(l.price)}</td>
        <td style="padding:12px 8px;font-size:12px;font-family:monospace;color:${c}">${a} ${fmtp(l.changePct)}</td>
        <td style="padding:12px 16px;font-size:12px;font-family:monospace;color:${c};text-align:right">${dayVal >= 0 ? '+' : ''}${fmt(dayVal)}</td>
      </tr>`;
  }).join('');

  // Sort for best/worst
  const sorted   = [...lines].sort((a, b) => b.changePct - a.changePct);
  const best     = sorted[0];
  const worst    = sorted[sorted.length - 1];

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Récap PEA — ${today}</title></head>
<body style="margin:0;padding:0;background:#04060b;font-family:'Helvetica Neue',Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:24px 16px">

  <!-- HEADER -->
  <div style="text-align:center;margin-bottom:28px">
    <div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#7c6df5,#5b8dee);display:inline-grid;place-items:center;font-size:24px;margin-bottom:14px">📈</div>
    <div style="font-size:22px;font-weight:800;color:#edf0f7;letter-spacing:-0.5px">PEA Dashboard</div>
    <div style="font-size:12px;color:#495068;margin-top:4px;text-transform:uppercase;letter-spacing:2px">Récap du ${today}</div>
  </div>

  <!-- SALUTATION -->
  <div style="font-size:15px;color:#8892a8;margin-bottom:20px">Bonjour <strong style="color:#edf0f7">${userName}</strong>,</div>

  <!-- KPIs -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
    <div style="background:#0a0c14;border:1px solid #1e2130;border-radius:12px;padding:16px 18px">
      <div style="font-size:10px;color:#495068;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px">Valeur totale</div>
      <div style="font-size:22px;font-weight:700;color:#edf0f7;font-family:monospace">${fmt(totalValue)}</div>
    </div>
    <div style="background:#0a0c14;border:1px solid #1e2130;border-radius:12px;padding:16px 18px">
      <div style="font-size:10px;color:#495068;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px">Variation du jour</div>
      <div style="font-size:22px;font-weight:700;color:${colorDay};font-family:monospace">${arrowDay} ${fmtp(totalDayPct)}</div>
      <div style="font-size:11px;color:${colorDay};margin-top:2px;font-family:monospace">${totalDayChange >= 0 ? '+' : ''}${fmt(totalDayChange)}</div>
    </div>
    <div style="background:#0a0c14;border:1px solid #1e2130;border-radius:12px;padding:16px 18px">
      <div style="font-size:10px;color:#495068;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px">+/- Value totale</div>
      <div style="font-size:18px;font-weight:700;color:${colorGlob};font-family:monospace">${isPosGlobal ? '+' : ''}${fmt(totalPnl)}</div>
      <div style="font-size:11px;color:${colorGlob};margin-top:2px;font-family:monospace">${fmtp(totalPnlPct)}</div>
    </div>
    <div style="background:#0a0c14;border:1px solid #1e2130;border-radius:12px;padding:16px 18px">
      <div style="font-size:10px;color:#495068;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px">Lignes</div>
      <div style="font-size:22px;font-weight:700;color:#edf0f7;font-family:monospace">${lines.length}</div>
      <div style="font-size:11px;color:#8892a8;margin-top:2px">${lines.filter(l => l.changePct > 0).length} en hausse · ${lines.filter(l => l.changePct < 0).length} en baisse</div>
    </div>
  </div>

  <!-- BEST / WORST -->
  ${best && worst && lines.length > 1 ? `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
    <div style="background:rgba(0,224,158,0.06);border:1px solid rgba(0,224,158,0.15);border-radius:12px;padding:14px 16px">
      <div style="font-size:10px;color:#00e09e;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px">🏆 Meilleure perf.</div>
      <div style="font-size:14px;font-weight:700;color:#edf0f7">${best.name}</div>
      <div style="font-size:13px;color:#00e09e;font-family:monospace;margin-top:2px">▲ ${fmtp(best.changePct)}</div>
    </div>
    <div style="background:rgba(255,77,106,0.06);border:1px solid rgba(255,77,106,0.15);border-radius:12px;padding:14px 16px">
      <div style="font-size:10px;color:#ff4d6a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px">📉 Moins bonne perf.</div>
      <div style="font-size:14px;font-weight:700;color:#edf0f7">${worst.name}</div>
      <div style="font-size:13px;color:#ff4d6a;font-family:monospace;margin-top:2px">▼ ${fmtp(Math.abs(worst.changePct))}</div>
    </div>
  </div>` : ''}

  <!-- COMMENTAIRE IA -->
  <div style="background:rgba(124,109,245,0.07);border:1px solid rgba(124,109,245,0.18);border-radius:12px;padding:18px 20px;margin-bottom:20px">
    <div style="font-size:10px;color:#7c6df5;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px">✦ Analyse IA</div>
    <div style="font-size:13px;color:#b8bfd0;line-height:1.7">${aiComment}</div>
  </div>

  <!-- TABLEAU DÉTAIL -->
  <div style="background:#0a0c14;border:1px solid #1e2130;border-radius:12px;overflow:hidden;margin-bottom:28px">
    <div style="padding:14px 16px;border-bottom:1px solid #1e2130">
      <div style="font-size:13px;font-weight:700;color:#edf0f7">Détail des lignes</div>
    </div>
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="background:rgba(255,255,255,0.015)">
          <th style="padding:10px 16px;text-align:left;font-size:9px;color:#495068;text-transform:uppercase;letter-spacing:1.4px;font-weight:600">Action</th>
          <th style="padding:10px 8px;text-align:left;font-size:9px;color:#495068;text-transform:uppercase;letter-spacing:1.4px;font-weight:600">Ticker</th>
          <th style="padding:10px 8px;text-align:left;font-size:9px;color:#495068;text-transform:uppercase;letter-spacing:1.4px;font-weight:600">Qté</th>
          <th style="padding:10px 8px;text-align:left;font-size:9px;color:#495068;text-transform:uppercase;letter-spacing:1.4px;font-weight:600">Cours</th>
          <th style="padding:10px 8px;text-align:left;font-size:9px;color:#495068;text-transform:uppercase;letter-spacing:1.4px;font-weight:600">Var. jour</th>
          <th style="padding:10px 16px;text-align:right;font-size:9px;color:#495068;text-transform:uppercase;letter-spacing:1.4px;font-weight:600">Impact €</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>

  <!-- FOOTER -->
  <div style="text-align:center;padding-top:16px;border-top:1px solid #1e2130">
    <div style="font-size:11px;color:#495068">
      PEA Dashboard · Récap automatique quotidien<br>
      <span style="font-size:10px">Les données sont issues de Yahoo Finance et peuvent présenter un léger décalage.</span>
    </div>
  </div>

</div>
</body>
</html>`;
}

// ─── ENVOYER AVEC BREVO ──────────────────────────────────────
async function sendEmail({ to, toName, subject, html }) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender:  { name: 'PEA Dashboard', email: 'armelpltr14@gmail.com' },
      to:      [{ email: to, name: toName }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo error: ${res.status} ${err}`);
  }
  console.log(`✅ Mail envoyé à ${to}`);
}

// ─── MAIN ─────────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀 Démarrage récap quotidien — ${today}\n`);

  // 1. Récupérer tous les utilisateurs
  const users = await getAllUsers();
  console.log(`👥 ${users.length} utilisateur(s) trouvé(s)`);

  for (const user of users) {
    console.log(`\n📊 Traitement de ${user.name} (${user.email})...`);

    // 2. Vérifier la préférence de l'utilisateur
    const settings = await getUserSettings(user.uid);
    if (settings.emailRecap === false) {
      console.log(`  🔕 Récap désactivé pour ${user.name}, mail ignoré`);
      continue;
    }

    // 3. Récupérer le portfolio
    const portfolio = await getUserPortfolio(user.uid);
    if (!portfolio.length) {
      console.log(`  ⚠️  Portfolio vide, mail ignoré`);
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
      console.log(`  ⚠️  Aucun prix disponible, mail ignoré`);
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

    // 7. Génération commentaire IA
    console.log(`  🤖 Génération commentaire Mistral...`);
    const aiComment = await generateComment(lines, totalDayPct);

    // 8. Build email
    const html = buildEmailHtml({
      userName: user.name,
      lines,
      totalValue,
      totalPnl,
      totalPnlPct,
      totalDayChange,
      totalDayPct,
      aiComment,
    });

    // 9. Envoyer
    const daySign   = totalDayPct >= 0 ? '▲' : '▼';
    const subject   = `${daySign} Récap PEA ${today} — ${fmtp(totalDayPct)}`;
    await sendEmail({ to: user.email, toName: user.name, subject, html });
  }

  console.log('\n✅ Récap quotidien terminé\n');
}

main().catch(err => {
  console.error('❌ Erreur fatale:', err);
  process.exit(1);
});

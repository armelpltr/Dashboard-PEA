// ─────────────────────────────────────────────────────────────
// price-alerts.js — Vérification alertes prix + email Brevo
// Lancé par GitHub Actions toutes les heures (jours ouvrés)
// ─────────────────────────────────────────────────────────────

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore }        from 'firebase-admin/firestore';
import { getAuth }             from 'firebase-admin/auth';
import fetch                   from 'node-fetch';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
const BREVO_KEY      = process.env.BREVO_API_KEY;

initializeApp({ credential: cert(serviceAccount) });
const db     = getFirestore();
const fbAuth = getAuth();

const fmt = n => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

async function getAllUsers() {
  const result = await fbAuth.listUsers();
  return result.users.map(u => ({ uid: u.uid, email: u.email, name: u.displayName || u.email.split('@')[0] }));
}

async function getUserAlerts(uid) {
  const snap = await db.doc(`users/${uid}/data/alerts`).get();
  return snap.exists ? (snap.data().items || []) : [];
}

async function saveUserAlerts(uid, alerts) {
  await db.doc(`users/${uid}/data/alerts`).set({ items: alerts });
}

async function getUserSettings(uid) {
  const snap = await db.doc(`users/${uid}/data/settings`).get();
  return snap.exists ? snap.data() : {};
}

async function logNotifHistory(uid, type, title, body) {
  const snap = await db.doc(`users/${uid}/data/notifHistory`).get();
  const history = snap.exists ? (snap.data().items || []) : [];
  history.unshift({ id: Date.now(), type, title, body, timestamp: new Date().toISOString(), read: false });
  if (history.length > 50) history.splice(50);
  await db.doc(`users/${uid}/data/notifHistory`).set({ items: history });
}

async function fetchPrice(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
  try {
    const res  = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(8000) });
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    return { price: meta.regularMarketPrice, name: meta.shortName || meta.longName || ticker };
  } catch(e) {
    console.warn(`Prix indisponible pour ${ticker}:`, e.message);
    return null;
  }
}

async function sendAlertEmail({ to, toName, alerts }) {
  const rows = alerts.map(a => {
    const dir = a.direction === 'above' ? '≥' : '≤';
    return `
      <tr style="border-bottom:1px solid #1e2130">
        <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#edf0f7">${a.name}</td>
        <td style="padding:12px 8px;font-size:11px;color:#8892a8;font-family:monospace">${a.ticker}</td>
        <td style="padding:12px 8px;font-size:12px;color:#edf0f7;font-family:monospace">Prix ${dir} ${a.targetPrice}€</td>
        <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#00e09e;font-family:monospace;text-align:right">${fmt(a.currentPrice)}</td>
      </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#04060b;font-family:'Helvetica Neue',Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:24px 16px">
  <div style="text-align:center;margin-bottom:28px">
    <div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#7c6df5,#5b8dee);display:inline-grid;place-items:center;font-size:24px;margin-bottom:14px">🎯</div>
    <div style="font-size:22px;font-weight:800;color:#edf0f7;letter-spacing:-0.5px">Capital View</div>
    <div style="font-size:12px;color:#495068;margin-top:4px;text-transform:uppercase;letter-spacing:2px">Alerte${alerts.length > 1 ? 's' : ''} prix déclenchée${alerts.length > 1 ? 's' : ''}</div>
  </div>
  <div style="font-size:15px;color:#8892a8;margin-bottom:20px">Bonjour <strong style="color:#edf0f7">${toName}</strong>,</div>
  <div style="font-size:14px;color:#b8bfd0;margin-bottom:20px">
    ${alerts.length === 1 ? 'Une alerte prix que vous avez configurée vient d\'être déclenchée.' : alerts.length + ' alertes prix que vous avez configurées viennent d\'être déclenchées.'}
  </div>
  <div style="background:#0a0c14;border:1px solid #1e2130;border-radius:12px;overflow:hidden;margin-bottom:28px">
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="background:rgba(255,255,255,0.015)">
          <th style="padding:10px 16px;text-align:left;font-size:9px;color:#495068;text-transform:uppercase;letter-spacing:1.4px;font-weight:600">Action</th>
          <th style="padding:10px 8px;text-align:left;font-size:9px;color:#495068;text-transform:uppercase;letter-spacing:1.4px;font-weight:600">Ticker</th>
          <th style="padding:10px 8px;text-align:left;font-size:9px;color:#495068;text-transform:uppercase;letter-spacing:1.4px;font-weight:600">Condition</th>
          <th style="padding:10px 16px;text-align:right;font-size:9px;color:#495068;text-transform:uppercase;letter-spacing:1.4px;font-weight:600">Cours actuel</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
  <div style="text-align:center;padding-top:16px;border-top:1px solid #1e2130">
    <div style="font-size:11px;color:#495068">
      Capital View · Alertes prix automatiques<br>
      <span style="font-size:10px">Les données sont issues de Yahoo Finance et peuvent présenter un léger décalage.</span>
    </div>
  </div>
</div>
</body>
</html>`;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender:      { name: 'Capital View', email: 'armelpltr14@gmail.com' },
      to:          [{ email: to, name: toName }],
      subject:     `🎯 Alerte prix — ${alerts.map(a => a.ticker).join(', ')}`,
      htmlContent: html,
    }),
  });
  if (!res.ok) throw new Error(`Brevo error: ${res.status} ${await res.text()}`);
  console.log(`  ✅ Mail alerte envoyé à ${to}`);
}

async function main() {
  console.log(`\n🎯 Vérification alertes prix — ${new Date().toISOString()}\n`);

  const users = await getAllUsers();
  console.log(`👥 ${users.length} utilisateur(s)`);

  for (const user of users) {
    console.log(`\n👤 ${user.name} (${user.email}) — uid: ${user.uid}`);
    const alerts = await getUserAlerts(user.uid);
    console.log(`  📋 ${alerts.length} alerte(s) totale(s) en Firestore`);
    alerts.forEach((a, i) => console.log(`     [${i}] ${a.ticker} ${a.direction === 'above' ? '>=' : '<='} ${a.targetPrice}€ | active=${a.active} | triggeredAt=${a.triggeredAt || 'null'}`));

    const active = alerts.filter(a => a.active && !a.triggeredAt);
    if (!active.length) { console.log(`  — Aucune alerte active, skip`); continue; }

    console.log(`  ✅ ${active.length} alerte(s) active(s)`);

    const settings = await getUserSettings(user.uid);
    console.log(`  ⚙️  notifSettings.priceAlerts = ${settings.notifSettings?.priceAlerts}`);
    if (settings.notifSettings?.priceAlerts === false) {
      console.log(`  🔕 Alertes prix désactivées`);
      continue;
    }

    // Fetch prix uniques
    const tickers = [...new Set(active.map(a => a.ticker))];
    console.log(`  🔍 Fetch prix pour: ${tickers.join(', ')}`);
    const prices = {};
    await Promise.all(tickers.map(async t => {
      const data = await fetchPrice(t);
      if (data) { prices[t] = data; console.log(`  💹 ${t} = ${data.price}€`); }
      else console.log(`  ⚠️  ${t} — prix indisponible`);
    }));

    const triggered = [];
    active.forEach(alert => {
      const data = prices[alert.ticker];
      if (!data) return;
      const hit = alert.direction === 'above'
        ? data.price >= alert.targetPrice
        : data.price <= alert.targetPrice;
      if (hit) {
        alert.triggeredAt  = new Date().toISOString();
        alert.active       = false;
        alert.currentPrice = data.price;
        alert.name         = data.name || alert.name;
        triggered.push(alert);
        console.log(`  🎯 ALERTE: ${alert.ticker} ${alert.direction === 'above' ? '>=' : '<='} ${alert.targetPrice}€ (cours: ${data.price}€)`);
      }
    });

    if (!triggered.length) {
      console.log(`  — Aucun seuil atteint`);
      continue;
    }

    // Sauvegarder alertes mises à jour
    await saveUserAlerts(user.uid, alerts);

    // Log historique in-app
    for (const a of triggered) {
      const dir = a.direction === 'above' ? '>=' : '<=';
      await logNotifHistory(user.uid, 'price_alert', '🎯 Alerte prix déclenchée',
        `${a.name} (${a.ticker}) ${dir} ${a.targetPrice}€ — cours : ${fmt(a.currentPrice)}`);
    }

    // Envoyer email
    await sendAlertEmail({ to: user.email, toName: user.name, alerts: triggered });
  }

  console.log('\n✅ Vérification alertes terminée\n');
}

main().catch(err => {
  console.error('❌ Erreur fatale:', err);
  process.exit(1);
});

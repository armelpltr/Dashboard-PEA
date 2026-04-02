// ─── FIREBASE AUTH ────────────────────────────────────
// ─── FIREBASE (chargement dynamique, compatible sans bundler) ─────
let fbApp, fbAuth, db,
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup,
    updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser,
    getFirestoreDoc, setFirestoreDoc, firestoreDoc, firestoreCollection, deleteFirestoreDoc, getDocs;

(async function initFirebase() {
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
  const auth = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");

  createUserWithEmailAndPassword = auth.createUserWithEmailAndPassword;
  signInWithEmailAndPassword     = auth.signInWithEmailAndPassword;
  signOut                        = auth.signOut;
  onAuthStateChanged             = auth.onAuthStateChanged;
  GoogleAuthProvider             = auth.GoogleAuthProvider;
  signInWithPopup                = auth.signInWithPopup;
  updateProfile                  = auth.updateProfile;
  updatePassword                 = auth.updatePassword;
  reauthenticateWithCredential   = auth.reauthenticateWithCredential;
  EmailAuthProvider              = auth.EmailAuthProvider;
  deleteUser                     = auth.deleteUser;

  const firestore = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
  getFirestoreDoc     = firestore.getDoc;
  setFirestoreDoc     = firestore.setDoc;
  firestoreDoc        = firestore.doc;
  firestoreCollection = firestore.collection;
  deleteFirestoreDoc  = firestore.deleteDoc;
  getDocs             = firestore.getDocs;

  fbApp  = initializeApp(firebaseConfig);
  fbAuth = auth.getAuth(fbApp);
  db     = firestore.getFirestore(fbApp);

  auth.onAuthStateChanged(fbAuth, user => {
    if (user) { startApp(user); } else { stopApp(); }
  });
})();

const firebaseConfig = {
  apiKey: "AIzaSyDvZ_0loJ9Lf_jhz-ZDGsydG9AE21CU5Uc",
  authDomain: "dashboard-pea.firebaseapp.com",
  projectId: "dashboard-pea",
  storageBucket: "dashboard-pea.firebasestorage.app",
  messagingSenderId: "1040263468997",
  appId: "1:1040263468997:web:ffbafd62cf9b672b1f9dac"
};


let currentUser = null;

// ─── COUCHE DONNÉES FIRESTORE (cache synchrone + sync arrière-plan) ──────
// Les lectures/écritures sont SYNCHRONES via un cache mémoire.
// Firestore est chargé au démarrage et écrit en arrière-plan.

const _localCache = {};

// Charge toutes les données depuis Firestore au démarrage
async function loadAllUserData(uid) {
  if (!uid || !db) return;
  const cols = ['portfolio', 'transactions', 'versements', 'watchlist'];
  await Promise.all(cols.map(async col => {
    try {
      const snap = await getFirestoreDoc(firestoreDoc(db, 'users', uid, 'data', col));
      _localCache[uid + '_' + col] = snap.exists() ? (snap.data().items || []) : [];
    } catch(e) {
      _localCache[uid + '_' + col] = [];
    }
  }));
  // Charger les settings
  try {
    const snap = await getFirestoreDoc(firestoreDoc(db, 'users', uid, 'data', 'settings'));
    _localCache[uid + '_settings'] = snap.exists() ? snap.data() : { emailRecap: true };
  } catch(e) {
    _localCache[uid + '_settings'] = { emailRecap: true };
  }
  // Appliquer préférence en attente (premier compte)
  if (window._pendingRecapPref !== undefined) {
    await saveUserSettings(uid, { emailRecap: window._pendingRecapPref });
    window._pendingRecapPref = undefined;
  }
}

function getUserSettings(uid) {
  return _localCache[(uid||currentUser) + '_settings'] || { emailRecap: true };
}

async function saveUserSettings(uid, settings) {
  const current = getUserSettings(uid);
  const merged  = { ...current, ...settings };
  _localCache[(uid||currentUser) + '_settings'] = merged;
  if (!db) return;
  await setFirestoreDoc(firestoreDoc(db, 'users', uid||currentUser, 'data', 'settings'), merged);
}

// Lecture synchrone depuis le cache
function getPortfolio(user)    { return _localCache[(user||currentUser) + '_portfolio']    || []; }
function getTransactions(user) { return _localCache[(user||currentUser) + '_transactions'] || []; }
function getVersements(user)   { return _localCache[(user||currentUser) + '_versements']   || []; }
function getWatchlist(user)    { return _localCache[(user||currentUser) + '_watchlist']    || []; }

// Écriture synchrone dans le cache + Firestore en arrière-plan
function savePortfolio(user, data)    { _fsWrite(user||currentUser, 'portfolio',    data); }
function saveTransactions(user, data) { _fsWrite(user||currentUser, 'transactions', data); }
function saveVersements(user, data)   { _fsWrite(user||currentUser, 'versements',   data); }
function saveWatchlist(user, data)    { _fsWrite(user||currentUser, 'watchlist',    data); }

function _fsWrite(uid, col, data) {
  _localCache[uid + '_' + col] = data;
  if (!db) return;
  setFirestoreDoc(firestoreDoc(db, 'users', uid, 'data', col), { items: data })
    .catch(e => console.warn('Firestore write error:', col, e));
}

// Suppression complète des données utilisateur
async function deleteAllUserData(uid) {
  const cols = ['portfolio', 'transactions', 'versements', 'watchlist'];
  await Promise.all(cols.map(col =>
    deleteFirestoreDoc(firestoreDoc(db, 'users', uid, 'data', col)).catch(() => {})
  ));
}

// logTransaction reste synchrone
function logTransaction(user, tx) {
  const txs = getTransactions(user);
  txs.push({ ...tx, id: Date.now() });
  saveTransactions(user, txs);
}

// ─── HELPERS ERREURS FIREBASE ─────────────────────────
function firebaseErrorMsg(code) {
  const msgs = {
    'auth/invalid-email':            'Adresse email invalide.',
    'auth/user-not-found':           'Aucun compte avec cet email.',
    'auth/wrong-password':           'Mot de passe incorrect.',
    'auth/email-already-in-use':     'Cet email est déjà utilisé.',
    'auth/weak-password':            'Mot de passe trop faible (6 caractères min).',
    'auth/too-many-requests':        'Trop de tentatives. Réessayez plus tard.',
    'auth/invalid-credential':       'Email ou mot de passe incorrect.',
  };
  return msgs[code] || 'Une erreur est survenue. Réessayez.';
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? 'Chargement…' : (btnId === 'btn-login-submit' ? 'Connexion' : 'Créer le compte');
}

// ─── NAVIGATION LOGIN / REGISTER ─────────────────────
window.showLoginView = function() {
  document.getElementById('login-view').style.display = 'block';
  document.getElementById('register-view').style.display = 'none';
  document.getElementById('login-error').textContent = '';
};
window.showRegisterView = function() {
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('register-view').style.display = 'block';
  document.getElementById('register-error').textContent = '';
};

// ─── LOGIN ────────────────────────────────────────────
window.doLogin = async function() {
  const email = document.getElementById('input-email').value.trim();
  const pass  = document.getElementById('input-pass').value;
  const err   = document.getElementById('login-error');
  err.textContent = '';
  if (!email || !pass) { err.textContent = 'Veuillez remplir tous les champs.'; err.style.display = 'block'; return; }
  setLoading('btn-login-submit', true);
  try {
    await signInWithEmailAndPassword(fbAuth, email, pass);
    // onAuthStateChanged prend le relai
  } catch(e) {
    err.textContent = firebaseErrorMsg(e.code);
    err.style.display = 'block';
    setLoading('btn-login-submit', false);
  }
};

// ─── REGISTER ─────────────────────────────────────────
window.doRegister = async function() {
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value;
  const pass2 = document.getElementById('reg-pass2').value;
  const err   = document.getElementById('register-error');
  err.textContent = '';
  if (!email || !pass || !pass2) { err.textContent = 'Veuillez remplir tous les champs.'; err.style.display = 'block'; return; }
  if (pass !== pass2) { err.textContent = 'Les mots de passe ne correspondent pas.'; err.style.display = 'block'; return; }
  if (pass.length < 6) { err.textContent = 'Mot de passe trop court (6 caractères min).'; err.style.display = 'block'; return; }
  setLoading('btn-register-submit', true);
  const wantsRecap = document.getElementById('reg-recap')?.checked !== false;
  try {
    await createUserWithEmailAndPassword(fbAuth, email, pass);
    // Sauvegarder préférence recap — onAuthStateChanged prend le relai ensuite
    // On sauvegarde après le login via startApp, mais on stocke en attendant
    window._pendingRecapPref = wantsRecap;
  } catch(e) {
    err.textContent = firebaseErrorMsg(e.code);
    err.style.display = 'block';
    setLoading('btn-register-submit', false);
  }
};

// ─── GOOGLE LOGIN ─────────────────────────────────────
window.doLoginGoogle = async function() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(fbAuth, provider);
    // onAuthStateChanged prend le relai
  } catch(e) {
    if (e.code === 'auth/popup-closed-by-user') return;
    const err = document.getElementById('login-error');
    err.textContent = firebaseErrorMsg(e.code);
  }
};

// ─── LOGOUT ───────────────────────────────────────────
window.doLogout = async function() {
  await signOut(fbAuth);
};

// ─── DÉMARRAGE APP ────────────────────────────────────
async function startApp(user) {
  currentUser = user.uid;
  window.currentUser = user.uid;
  const displayName = user.displayName || user.email.split('@')[0];
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('user-avatar').textContent = displayName[0].toUpperCase();
  document.getElementById('user-name-display').textContent = displayName;
  loadProfilePage(user);
  updateMobileAvatar(user);
  const d = new Date();
  document.getElementById('portfolio-date').textContent =
    'Mis à jour le ' + d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  // Charger toutes les données Firestore avant de rendre
  await loadAllUserData(user.uid);
  window.renderPortfolio();
  window.fetchAllLogos();
  if (!window.autoRefreshInterval) window.toggleAutoRefresh();
}

function stopApp() {
  currentUser = null;
  window.currentUser = null;
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('input-email').value = '';
  document.getElementById('input-pass').value = '';
  showLoginView();
}

// ─── OBSERVATEUR géré dans initFirebase() ─────

// ─── PROFIL ───────────────────────────────────────────
window.openProfilModal = function() {
  document.getElementById('profil-modal-overlay').classList.add('open');
  loadProfilePage(fbAuth.currentUser);
};
window.closeProfilModal = function() {
  document.getElementById('profil-modal-overlay').classList.remove('open');
};

window.toggleRecapSetting = async function() {
  const toggle   = document.getElementById('toggle-recap');
  const settings = getUserSettings(currentUser);
  const newVal   = settings.emailRecap === false; // flip
  toggle.classList.toggle('on', newVal);
  await saveUserSettings(currentUser, { emailRecap: newVal });
};

function loadProfilePage(user) {
  if (!user) return;

  // Avatar
  const letter = document.getElementById('profil-avatar-letter');
  const img    = document.getElementById('profil-avatar-img');
  const big    = document.getElementById('profil-avatar-big');
  if (user.photoURL) {
    img.src = user.photoURL;
    img.style.display = 'block';
    letter.style.display = 'none';
  } else {
    img.style.display = 'none';
    letter.style.display = 'block';
    letter.textContent = (user.displayName || user.email || '?')[0].toUpperCase();
  }

  // Nom & email
  const nameEl = document.getElementById('profil-display-name');
  const emailEl = document.getElementById('profil-email');
  const nameInput = document.getElementById('profil-name-input');
  nameEl.textContent = user.displayName || user.email.split('@')[0];
  emailEl.textContent = user.email;
  nameInput.value = user.displayName || '';

  // Badge fournisseur
  const badge = document.getElementById('profil-provider-badge');
  const isGoogle = user.providerData.some(p => p.providerId === 'google.com');
  badge.innerHTML = isGoogle
    ? '<span style="font-size:10px;background:rgba(66,133,244,0.12);color:#4285F4;border:1px solid rgba(66,133,244,0.25);padding:2px 8px;border-radius:4px;font-family:var(--mono)">Connecté via Google</span>'
    : '<span style="font-size:10px;background:var(--accent-d);color:var(--accent);border:1px solid rgba(124,109,245,0.2);padding:2px 8px;border-radius:4px;font-family:var(--mono)">Email / Mot de passe</span>';

  // Cacher section MDP si Google
  const passSection = document.getElementById('profil-password-section');
  if (passSection) passSection.style.display = isGoogle ? 'none' : 'block';

  // Toggle récap email
  const settings    = getUserSettings(user.uid);
  const toggleRecap = document.getElementById('toggle-recap');
  if (toggleRecap) {
    if (settings.emailRecap !== false) toggleRecap.classList.add('on');
    else toggleRecap.classList.remove('on');
  }
}

window.saveDisplayName = async function() {
  const user = fbAuth.currentUser;
  const name = document.getElementById('profil-name-input').value.trim();
  const status = document.getElementById('profil-name-status');
  if (!name) { status.textContent = 'Le nom ne peut pas être vide.'; status.style.color = 'var(--negative)'; return; }
  try {
    await updateProfile(user, { displayName: name });
    // Update sidebar
    document.getElementById('user-name-display').textContent = name;
    document.getElementById('user-avatar').textContent = name[0].toUpperCase();
    document.getElementById('profil-display-name').textContent = name;
    status.textContent = '✓ Nom mis à jour !';
    status.style.color = 'var(--positive)';
    setTimeout(() => { status.textContent = ''; }, 3000);
  } catch(e) {
    status.textContent = 'Erreur : ' + e.message;
    status.style.color = 'var(--negative)';
  }
};

window.saveNewPassword = async function() {
  const user = fbAuth.currentUser;
  const oldPass  = document.getElementById('profil-old-pass').value;
  const newPass  = document.getElementById('profil-new-pass').value;
  const newPass2 = document.getElementById('profil-new-pass2').value;
  const status   = document.getElementById('profil-pass-status');
  status.textContent = '';

  if (!oldPass || !newPass || !newPass2) { status.textContent = 'Remplissez tous les champs.'; status.style.color = 'var(--negative)'; return; }
  if (newPass !== newPass2) { status.textContent = 'Les mots de passe ne correspondent pas.'; status.style.color = 'var(--negative)'; return; }
  if (newPass.length < 6) { status.textContent = 'Mot de passe trop court (6 caractères min).'; status.style.color = 'var(--negative)'; return; }

  try {
    const cred = EmailAuthProvider.credential(user.email, oldPass);
    await reauthenticateWithCredential(user, cred);
    await updatePassword(user, newPass);
    document.getElementById('profil-old-pass').value = '';
    document.getElementById('profil-new-pass').value = '';
    document.getElementById('profil-new-pass2').value = '';
    status.textContent = '✓ Mot de passe mis à jour !';
    status.style.color = 'var(--positive)';
    setTimeout(() => { status.textContent = ''; }, 3000);
  } catch(e) {
    const msgs = {
      'auth/wrong-password': 'Mot de passe actuel incorrect.',
      'auth/weak-password':  'Nouveau mot de passe trop faible.',
      'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
    };
    status.textContent = msgs[e.code] || 'Erreur : ' + e.message;
    status.style.color = 'var(--negative)';
  }
};

window.confirmDeleteAccount = async function() {
  if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return;
  const user = fbAuth.currentUser;
  const isGoogle = user.providerData.some(p => p.providerId === 'google.com');
  try {
    if (!isGoogle) {
      const pass = prompt('Entrez votre mot de passe pour confirmer la suppression :');
      if (!pass) return;
      const cred = EmailAuthProvider.credential(user.email, pass);
      await reauthenticateWithCredential(user, cred);
    }
    // Supprimer toutes les données Firestore
    await deleteAllUserData(user.uid);
    await deleteUser(user);
    // onAuthStateChanged → stopApp()
  } catch(e) {
    alert('Erreur lors de la suppression : ' + e.message);
  }
};

// ─── ENTRÉE CLAVIER ───────────────────────────────────
document.getElementById('input-pass').addEventListener('keydown', e => { if (e.key === 'Enter') window.doLogin(); });
document.getElementById('input-email').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('input-pass').focus(); });
document.getElementById('reg-pass2').addEventListener('keydown', e => { if (e.key === 'Enter') window.doRegister(); });

// ─── NAVIGATION ──────────────────────────────────────

// Mobile drawer
window.openMobileDrawer = function() {
  document.getElementById('mobile-drawer-overlay').classList.add('open');
};
window.closeMobileDrawer = function() {
  document.getElementById('mobile-drawer-overlay').classList.remove('open');
};

// Sync active states across mobile nav + drawer
function syncMobileNav(id) {
  document.querySelectorAll('.mobile-nav-item[data-mob]').forEach(b => {
    b.classList.toggle('active', b.dataset.mob === id);
  });
  document.querySelectorAll('.mobile-drawer-item[data-mob]').forEach(b => {
    b.classList.toggle('active', b.dataset.mob === id);
  });
}

// Update mobile header avatar
function updateMobileAvatar(user) {
  const letter = document.getElementById('mobile-avatar-letter');
  if (!letter) return;
  if (user && user.photoURL) {
    letter.innerHTML = `<img src="${user.photoURL}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;">`;
  } else if (user) {
    letter.textContent = (user.displayName || user.email || '?')[0].toUpperCase();
  }
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  event.currentTarget.classList.add('active');
  // Sync mobile nav
  document.querySelectorAll('.mobile-nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.mob === id);
  });
  if (id === 'analyse')     { renderAnalysePortfolio(); }
  if (id === 'graphiques')  initCharts();
}

function showPageMobile(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  syncMobileNav(id);
  // Sync sidebar nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => {
    const onclick = n.getAttribute('onclick') || '';
    if (onclick.includes("'" + id + "'")) n.classList.add('active');
  });
  if (id === 'analyse')     { renderAnalysePortfolio(); }
  if (id === 'graphiques')  initCharts();
}

// ─── PORTFOLIO ────────────────────────────────────────
function fmt(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function renderPortfolio() {
  const data = getPortfolio(currentUser);
  const tbody = document.getElementById('portfolio-tbody');
  const empty = document.getElementById('empty-state');

  tbody.innerHTML = '';

  let totalVal = 0, totalInvested = 0;

  if (data.length === 0) {
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    data.forEach((row, i) => {
      const val = row.qty * row.currentPrice;
      const invested = row.qty * row.buyPrice;
      const pnl = val - invested;
      const pct = invested > 0 ? (pnl / invested) * 100 : 0;
      totalVal += val;
      totalInvested += invested;

      const abbr = (row.name || row.ticker || '?').substring(0, 3).toUpperCase();
      const isPos = pnl >= 0;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="ticker-cell">
            ${logoHtml(row.ticker, 26, 'ticker-icon')}
            <div>
              <div class="ticker-name">${row.name || row.ticker}<span class="${isETF(row.ticker) ? 'badge-etf' : 'badge-action'}">${isETF(row.ticker) ? 'ETF' : 'ACTION'}</span></div>
              <div class="ticker-sym">${row.ticker || ''}</div>
            </div>
          </div>
        </td>
        <td class="mono">${row.qty}</td>
        <td class="mono">${fmt(row.buyPrice)}</td>
        <td class="mono">${fmt(row.currentPrice)}</td>
        <td class="mono" style="font-weight:500">${fmt(val)}</td>
        <td>
          <span class="${isPos ? 'badge-pos' : 'badge-neg'}">
            ${isPos ? '▲' : '▼'} ${fmt(Math.abs(pnl))} (${isPos ? '+' : ''}${pct.toFixed(2)}%)
          </span>
        </td>
        <td>${(() => {
          const chg = row.changePct || 0;
          const dayVal = row.qty * row.currentPrice * chg / 100;
          const cls = chg >= 0 ? 'badge-pos' : 'badge-neg';
          return chg !== 0
            ? `<span class="${cls}">${chg >= 0 ? '▲ +' : '▼ '}${Math.abs(chg).toFixed(2)}% (${chg >= 0 ? '+' : ''}${dayVal.toFixed(2)} €)</span>`
            : `<span style="color:var(--text3);font-size:11px">—</span>`;
        })()}</td>
        <td style="display:flex;gap:6px;justify-content:flex-end;align-items:center">
          <button class="btn-edit" onclick="openEditModal(${i})" title="Modifier">✏</button>
          <button class="btn-del" onclick="deleteRow(${i})" title="Supprimer">✕</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  const totalPnl = totalVal - totalInvested;
  const totalPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  document.getElementById('stat-total').textContent = data.length ? fmt(totalVal) : '— €';
  document.getElementById('stat-invested').textContent = data.length ? fmt(totalInvested) : '— €';
  const pnlEl = document.getElementById('stat-pnl');
  pnlEl.textContent = data.length ? (totalPnl >= 0 ? '+' : '') + fmt(totalPnl) + ' (' + (totalPnl >= 0 ? '+' : '') + totalPct.toFixed(2) + '%)' : '— €';
  pnlEl.style.color = totalPnl >= 0 ? 'var(--positive)' : 'var(--negative)';
  document.getElementById('stat-pnl-pct').textContent = data.length && totalInvested > 0 ? (totalPnl >= 0 ? '+' : '') + (totalPnl / totalInvested * 100).toFixed(2) + '%' : '—';
  document.getElementById('stat-pnl-pct').style.color = totalPnl >= 0 ? 'var(--positive)' : 'var(--negative)';
  document.getElementById('stat-pnl-pct').className = '';

  // Calculate realized P&L from transaction history
  const txs = getTransactions(currentUser);
  let realizedTotal = 0;
  txs.forEach(tx => {
    if (tx.type === 'sell' && tx.realizedPnl != null) {
      realizedTotal += tx.realizedPnl;
    }
  });
  const realEl = document.getElementById('stat-realized');
  realEl.textContent = (realizedTotal >= 0 ? '+' : '') + fmt(realizedTotal);
  realEl.style.color = realizedTotal >= 0 ? 'var(--positive)' : 'var(--negative)';
  document.getElementById('stat-realized-sub').textContent = realizedTotal >= 0 ? 'Gains clôturés' : 'Pertes clôturées';
  document.getElementById('stat-realized-sub').className = 'stat-change ' + (realizedTotal >= 0 ? 'pos' : 'neg');

  // Versements & cash
  const versements = getVersements(currentUser);
  const totalVersements = versements.reduce((s, v) => s + v.amount, 0);
  document.getElementById('stat-versements').textContent = fmt(totalVersements);

  // Cash = versements - total achats + total ventes (from tx log)
  let totalAchats = 0, totalVentes = 0;
  txs.forEach(tx => {
    if (tx.type === 'buy') totalAchats += tx.qty * tx.price;
    if (tx.type === 'sell') totalVentes += tx.qty * tx.price;
  });
  const cash = totalVersements - totalAchats + totalVentes;
  const cashEl = document.getElementById('stat-cash');
  cashEl.textContent = fmt(cash);
  cashEl.style.color = cash >= 0 ? 'var(--positive)' : 'var(--negative)';

  // Render transaction history
  renderTxHistory();

  renderPortfolioChart();
}

function deleteRow(i) {
  const data = getPortfolio(currentUser);
  const row = data[i];
  data.splice(i, 1);
  if (row) {
    // If no other line with same ticker remains, purge all its transactions
    const stillHeld = data.some(r => r.ticker === row.ticker);
    if (!stillHeld) {
      const txs = getTransactions(currentUser);
      saveTransactions(currentUser, txs.filter(tx => tx.ticker !== row.ticker));
    }
  }
  savePortfolio(currentUser, data);
  renderPortfolio();
}

function renderTxHistory() {
  const txs = getTransactions(currentUser);
  const tbody = document.getElementById('tx-history-tbody');
  const empty = document.getElementById('tx-empty');
  const count = document.getElementById('tx-count');

  if (!txs.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    count.textContent = '0 opérations';
    return;
  }
  empty.style.display = 'none';
  // Sort by date descending (most recent first)
  const sorted = [...txs].sort((a,b) => (b.date || '').localeCompare(a.date || ''));
  count.textContent = sorted.length + ' opération' + (sorted.length > 1 ? 's' : '');

  tbody.innerHTML = sorted.map(tx => {
    const isBuy = tx.type === 'buy';
    const montant = (tx.qty * tx.price).toFixed(2);
    const dateStr = tx.date ? new Date(tx.date + 'T12:00:00').toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—';
    const pnlHtml = tx.type === 'sell' && tx.realizedPnl != null
      ? '<span style="color:' + (tx.realizedPnl >= 0 ? 'var(--positive)' : 'var(--negative)') + ';font-weight:600">' + (tx.realizedPnl >= 0 ? '+' : '') + tx.realizedPnl.toFixed(2) + ' €</span>'
      : '<span style="color:var(--text3)">—</span>';
    return '<tr>' +
      '<td class="mono" style="font-size:12px">' + dateStr + '</td>' +
      '<td><span class="' + (isBuy ? 'badge-pos' : 'badge-neg') + '" style="font-size:11px;padding:3px 10px">' + (isBuy ? '▲ ACHAT' : '▼ VENTE') + '</span></td>' +
      '<td style="font-size:12px">' + (tx.name || tx.ticker || '—') + '</td>' +
      '<td class="mono" style="font-size:12px">' + tx.qty + '</td>' +
      '<td class="mono" style="font-size:12px">' + tx.price.toFixed(2) + ' €</td>' +
      '<td class="mono" style="font-size:12px">' + montant + ' €</td>' +
      '<td class="mono" style="font-size:12px">' + pnlHtml + '</td>' +
      '</tr>';
  }).join('');
}
let editRowIndex = -1;
let editTab = 'buy';

function openEditModal(i) {
  const row = getPortfolio(currentUser)[i];
  editRowIndex = i;
  document.getElementById('edit-modal-title').textContent = row.name || row.ticker;
  document.getElementById('edit-modal-sub').textContent   = row.ticker;
  document.getElementById('edit-cur-qty').textContent     = row.qty;
  document.getElementById('edit-cur-pru').textContent     = fmt(row.buyPrice);
  document.getElementById('edit-cur-price').textContent   = fmt(row.currentPrice);
  var pnl = (row.currentPrice - row.buyPrice) * row.qty;
  var el  = document.getElementById('edit-cur-pnl');
  el.textContent = (pnl >= 0 ? '+' : '') + fmt(pnl);
  el.style.color = pnl >= 0 ? 'var(--positive)' : 'var(--negative)';
  document.getElementById('edit-qty').value   = '';
  document.getElementById('edit-price').value = '';
  setEditTab('buy');
  document.getElementById('edit-modal-overlay').classList.add('open');
}
function closeEditModal() {
  document.getElementById('edit-modal-overlay').classList.remove('open');
}
function closeEditModalOutside(e) {
  if (e.target === document.getElementById('edit-modal-overlay')) closeEditModal();
}
function setEditTab(tab) {
  editTab = tab;
  var row = getPortfolio(currentUser)[editRowIndex];
  document.getElementById('tab-buy').className  = 'edit-tab' + (tab === 'buy'  ? ' active-buy'  : '');
  document.getElementById('tab-sell').className = 'edit-tab' + (tab === 'sell' ? ' active-sell' : '');
  var btn = document.getElementById('btn-edit-confirm');
  var today = new Date().toISOString().slice(0,10);
  document.getElementById('edit-date').value = today;
  if (tab === 'buy') {
    document.getElementById('edit-qty-label').textContent = 'Quantite a acheter';
    document.getElementById('edit-price-group').style.display = 'block';
    document.getElementById('edit-sell-price-group').style.display = 'none';
    document.getElementById('edit-date-group').style.display = 'block';
    btn.textContent = 'Acheter';
    btn.style.background = 'var(--positive)';
    if (row) document.getElementById('edit-price').value = row.currentPrice.toFixed(2);
  } else {
    document.getElementById('edit-qty-label').textContent = 'Quantite a vendre (max ' + (row ? row.qty : '') + ')';
    document.getElementById('edit-price-group').style.display = 'none';
    document.getElementById('edit-sell-price-group').style.display = 'block';
    document.getElementById('edit-date-group').style.display = 'block';
    btn.textContent = 'Vendre';
    btn.style.background = 'var(--negative)';
    if (row) document.getElementById('edit-sell-price').value = row.currentPrice.toFixed(2);
  }
}
function confirmEdit() {
  var data = getPortfolio(currentUser);
  var row  = data[editRowIndex];
  var qty  = parseFloat(document.getElementById('edit-qty').value);
  if (!qty || qty <= 0) { alert('Quantite invalide.'); return; }
  var txDate = document.getElementById('edit-date').value;
  if (!txDate) { alert("Veuillez renseigner la date."); return; }
  if (editTab === 'buy') {
    var price = parseFloat(document.getElementById('edit-price').value);
    if (!price || price <= 0) { alert('Prix invalide.'); return; }
    var newQty = row.qty + qty;
    row.buyPrice = Math.round(((row.qty * row.buyPrice + qty * price) / newQty) * 10000) / 10000;
    row.qty      = Math.round(newQty * 10000) / 10000;
    logTransaction(currentUser, { type:'buy', ticker: row.ticker, name: row.name, qty, price, date: txDate });
  } else {
    if (qty > row.qty) { alert('Quantite superieure a la position.'); return; }
    var sellPrice = parseFloat(document.getElementById('edit-sell-price').value);
    if (!sellPrice || sellPrice <= 0) { alert('Prix de vente invalide.'); return; }
    ensureBuyTxExists(currentUser, row);
    // Calculate realized P&L for this sell
    var realizedPnl = (sellPrice - row.buyPrice) * qty;
    logTransaction(currentUser, { type:'sell', ticker: row.ticker, name: row.name, qty, price: sellPrice, date: txDate, buyPrice: row.buyPrice, realizedPnl: Math.round(realizedPnl * 100) / 100 });
    if (qty === row.qty) {
      data.splice(editRowIndex, 1);
      savePortfolio(currentUser, data);
      closeEditModal();
      renderPortfolio();
      return;
    }
    row.qty = Math.round((row.qty - qty) * 10000) / 10000;
  }
  savePortfolio(currentUser, data);
  closeEditModal();
  renderPortfolio();
}

// ─── MODAL ────────────────────────────────────────────
let searchTimer = null;
let foundPrice = null;
let foundName = null;
let foundTicker = null;

function openModal() {
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('modal-ticker').value = '';
  document.getElementById('modal-qty').value = '';
  document.getElementById('modal-buy-price').value = '';
  document.getElementById('search-result').classList.remove('visible');
  document.getElementById('search-status').innerHTML = '';
  document.getElementById('btn-confirm').disabled = true;
  document.getElementById('modal-buy-date').value = new Date().toISOString().slice(0,10);
  foundPrice = null; foundName = ''; foundTicker = '';
  foundQuoteType = 'EQUITY'; foundPE = null; foundBeta = null;
  foundDivYield = null; foundHasDividend = false;
  foundPrice = null; foundName = null; foundTicker = null;
  setTimeout(() => document.getElementById('modal-ticker').focus(), 100);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function onTickerInput() {
  clearTimeout(searchTimer);
  const val = document.getElementById('modal-ticker').value.trim();
  document.getElementById('search-result').classList.remove('visible');
  document.getElementById('btn-confirm').disabled = true;
  foundPrice = null;

  if (val.length < 2) {
    document.getElementById('search-status').innerHTML = '';
    return;
  }

  document.getElementById('search-status').innerHTML =
    '<div class="status-loading"><span class="loading-spinner"></span> Recherche du cours…</div>';

  searchTimer = setTimeout(() => fetchPrice(val), 700);
}

// ─── YAHOO FINANCE ───────────────────────────────────
function proxyUrl(url) {
  return 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
}

const ETF_DB = [
  { ticker:'PANX.PA', isin:'FR0013412285', name:'Amundi PEA Nasdaq 100', aliases:['amundi nasdaq','pea nasdaq','nasdaq 100 pea','panx'] },
  { ticker:'PCEU.PA', isin:'FR0013412269', name:'Amundi PEA Euro Stoxx 50', aliases:['amundi euro stoxx','pea euro stoxx','pceu'] },
  { ticker:'RS2K.PA', isin:'FR0011714066', name:'Amundi PEA Russell 2000', aliases:['amundi russell','pea russell','rs2k','russell 2000'] },
  { ticker:'PAEEM.PA',isin:'FR0013412020', name:'Amundi PEA MSCI Emerging Markets', aliases:['amundi emerging','pea emerging','pea émergents','paeem'] },
  { ticker:'MWRD.PA', isin:'LU1681045370', name:'Amundi MSCI World UCITS', aliases:['amundi world','mwrd','msci world amundi'] },
  { ticker:'CW8.PA',  isin:'LU1681043599', name:'Amundi MSCI World UCITS Acc', aliases:['cw8','amundi cw8','world amundi acc'] },
  { ticker:'ESE.PA',  isin:'FR0013311273', name:'BNP Paribas Easy S&P 500 UCITS', aliases:['bnp sp500','bnp s&p','ese','bnp paribas easy'] },
  { ticker:'WPEA.PA', isin:'IE0002XZSHO1', name:'Invesco MSCI World UCITS PEA', aliases:['invesco world pea','wpea'] },
  { ticker:'EWLD.PA', isin:'IE00B4L5Y983', name:'iShares Core MSCI World UCITS PEA', aliases:['ishares world pea','ewld'] },
  { ticker:'IWDA.AS', isin:'IE00B4L5Y983', name:'iShares Core MSCI World UCITS', aliases:['ishares world','iwda','msci world ishares'] },
  { ticker:'CSPX.AS', isin:'IE00B5BMR087', name:'iShares Core S&P 500 UCITS', aliases:['ishares sp500','cspx','s&p 500 ishares'] },
  { ticker:'EMIM.AS', isin:'IE00BKM4GZ66', name:'iShares Core MSCI EM IMI UCITS', aliases:['ishares emerging','emim'] },
  { ticker:'EIMI.AS', isin:'IE00BD45KH83', name:'iShares Core MSCI EM IMI UCITS USD', aliases:['ishares em','eimi'] },
  { ticker:'VWRL.AS', isin:'IE00B3RBWM25', name:'Vanguard FTSE All-World UCITS', aliases:['vanguard all world','vwrl','ftse all world'] },
  { ticker:'VWCE.AS', isin:'IE00BK5BQT80', name:'Vanguard FTSE All-World Acc UCITS', aliases:['vanguard world acc','vwce'] },
  { ticker:'VAGF.AS', isin:'IE00BG47KB92', name:'Vanguard Global Aggregate Bond UCITS', aliases:['vanguard bond','vagf'] },
  { ticker:'IUSQ.AS', isin:'IE00B4L5YX21', name:'iShares MSCI ACWI UCITS', aliases:['ishares acwi','iusq','acwi'] },
  { ticker:'SPPW.AS', isin:'IE00B7KQ7B66', name:'SPDR S&P 500 UCITS', aliases:['spdr sp500','sppw'] },
  { ticker:'SPY',     isin:'US78462F1030', name:'SPDR S&P 500 ETF Trust', aliases:['spy','s&p 500','spdr'] },
  { ticker:'QQQ',     isin:'US46090E1038', name:'Invesco QQQ Nasdaq 100', aliases:['qqq','nasdaq 100','invesco qqq'] },
  { ticker:'VTI',     isin:'US9229087690', name:'Vanguard Total Stock Market ETF', aliases:['vti','vanguard total'] },
  { ticker:'VT',      isin:'US9220427424', name:'Vanguard Total World Stock ETF', aliases:['vt','vanguard world'] },
  { ticker:'VOO',     isin:'US9229083632', name:'Vanguard S&P 500 ETF', aliases:['voo','vanguard sp500'] },
  { ticker:'ARKK',    isin:'US00214Q1040', name:'ARK Innovation ETF', aliases:['ark','arkk','ark innovation'] },
  { ticker:'GLD',     isin:'US78463V1070', name:'SPDR Gold Shares', aliases:['gld','gold','or'] },
  { ticker:'TLT',     isin:'US4642874329', name:'iShares 20+ Year Treasury Bond ETF', aliases:['tlt','treasury','obligations'] },
  { ticker:'SOXX',    isin:'US4642887412', name:'iShares Semiconductor ETF', aliases:['soxx','semiconducteurs','semi'] },
  { ticker:'SGLD.AS', isin:'IE00B579F325', name:'Invesco Physical Gold ETC', aliases:['invesco gold','sgld','or physique'] },
  { ticker:'XDWD.AS', isin:'IE00BJ0KDQ92', name:'Xtrackers MSCI World Swap UCITS', aliases:['xtrackers world','xdwd'] },
  { ticker:'BNKE.PA', isin:'LU1829219556', name:'Lyxor Euro Stoxx Banks UCITS', aliases:['lyxor banks','bnke','banques'] },
];

function searchETFLocal(query) {
  const q = query.toLowerCase().trim();
  const byIsin = ETF_DB.find(e => e.isin.toLowerCase() === q);
  if (byIsin) return byIsin;
  const byTicker = ETF_DB.find(e => e.ticker.toLowerCase() === q || e.ticker.toLowerCase().replace(/\.[a-z]+$/, '') === q);
  if (byTicker) return byTicker;
  const byName = ETF_DB.find(e =>
    e.name.toLowerCase().includes(q) ||
    e.aliases.some(a => a.includes(q))
  );
  return byName || null;
}

async function fetchWithFallback(url) {
  const attempts = [
    async (u) => {
      const r = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(u), {signal: AbortSignal.timeout(8000)});
      const j = await r.json();
      if (!j.contents || j.contents === 'null') throw new Error('empty');
      return j.contents;
    },
    async (u) => {
      const r = await fetch('https://corsproxy.io/?' + encodeURIComponent(u), {signal: AbortSignal.timeout(8000)});
      if (!r.ok) throw new Error('not ok');
      return await r.text();
    },
    async (u) => {
      const u2 = u.replace('query1.', 'query2.');
      const r = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(u2), {signal: AbortSignal.timeout(8000)});
      const j = await r.json();
      if (!j.contents || j.contents === 'null') throw new Error('empty');
      return j.contents;
    },
    async (u) => {
      const r = await fetch('https://cors.eu.org/' + u, {signal: AbortSignal.timeout(8000)});
      if (!r.ok) throw new Error('not ok');
      return await r.text();
    },
    async (u) => {
      const r = await fetch('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u), {signal: AbortSignal.timeout(8000)});
      if (!r.ok) throw new Error('not ok');
      return await r.text();
    },
  ];

  let lastErr = '';
  for (const attempt of attempts) {
    try {
      const raw = await attempt(url);
      const parsed = JSON.parse(raw);
      if (parsed.chart && parsed.chart.error && parsed.chart.error.code) continue;
      if (parsed.finance && parsed.finance.error) continue;
      return raw;
    } catch(e) {
      lastErr = e.message;
      continue;
    }
  }
  throw new Error('Service temporairement indisponible. Réessayez dans quelques secondes. (' + lastErr + ')');
}

const ISIN_MAP = {
  'FR0011871110': 'PUST.PA',
  'FR0013412285': 'MWRD.PA',
  'FR0011550185': 'PE500.PA',
  'FR0013412020': 'PAEEM.PA',
  'LU1681043599': 'CW8.PA',
  'IE00B4L5Y983': 'IWDA.AS',
  'IE00B52SFT06': 'CSPX.L',
  'IE00B3RBWM25': 'IWDA.AS',
  'FR0011871128': 'PVAL.PA',
  'LU0496786574': 'LYYA.PA',
  'FR0000131104': 'BNP.PA',
  'FR0000120271': 'AI.PA',
  'FR0000120073': 'AIR.PA',
  'FR0000120628': 'ACA.PA',
  'FR0000120172': 'OR.PA',
  'FR0000121014': 'MC.PA',
  'FR0000054900': 'EN.PA',
  'FR0000120321': 'SAN.PA',
  'FR0000131708': 'SGO.PA',
  'FR0000124711': 'SU.PA',
  'FR0000125486': 'VIE.PA',
  'FR0000120693': 'TTE.PA',
  'FR0000133308': 'DG.PA',
  'FR0010242511': 'DSY.PA',
  'FR0000052292': 'RMS.PA',
  'FR0000121261': 'BN.PA',
  'FR0000130809': 'CS.PA',
  'FR0000120503': 'RNO.PA',
  'FR0000130650': 'ORA.PA',
  'FR0000121667': 'VIV.PA',
  'FR0000121485': 'ML.PA',
  'FR0010208488': 'ENGI.PA',
  'FR0000120578': 'ATO.PA',
  'FR0000131906': 'FP.PA',
  'FR0000045072': 'CNA.PA',
  'FR0010307819': 'GLE.PA',
  'FR0000035081': 'AXA.PA',
  'FR0000073272': 'EDF.PA',
  'FR0000125338': 'FTE.PA',
  'FR0000131755': 'GBT.PA',
  'FR0000060303': 'HO.PA',
};

const LOGO_CACHE = {};
const ETF_TICKERS_GLOBAL = new Set(['WPEA.PA','ESEE.PA','ESE.PA','PUST.PA','PANX.PA','PAEEM.PA','ETZ.PA','EWLD.PA','CW8.PA','MWRD.PA','RS2K.PA','PCEU.PA','PE500.PA','IUSQ.AS','IWDA.AS','VWCE.AS','VWRL.AS','CSPX.AS','EMIM.AS','XDWD.AS','SPPW.AS','SPY','QQQ','VTI','VT','VOO','ARKK','GLD','TLT','SOXX','SGLD.AS','BNKE.PA']);
function isETF(ticker) { return ETF_TICKERS_GLOBAL.has(ticker) || /\.[A-Z]{2}$/.test(ticker) && /^(CW|MWRD|RS|PC|PA|PU|ET|EW|WP|ES|IU|IW|VC|VW|CS|EM|XD|SP|BN)/.test(ticker); }
const TICKER_TO_ISIN = Object.fromEntries(Object.entries(ISIN_MAP).map(([k,v]) => [v, k]));

// Resolve an ISIN or ticker to a Yahoo Finance ticker for API calls
function resolveToYahooTicker(ticker) {
  if (!ticker) return ticker;
  // If it's an ISIN in our map, return Yahoo ticker
  if (ISIN_MAP[ticker]) return ISIN_MAP[ticker];
  // If it's already a Yahoo ticker, return as-is
  return ticker;
}

// ── LOGO FETCHING ──────────────────────────────────────
// Persist logo cache to localStorage so logos survive reloads
function loadLogoCache() {
  try {
    const saved = JSON.parse(localStorage.getItem('pea_logos') || '{}');
    // Purge stale clearbit URLs (switched to Google favicons)
    for (const [k, v] of Object.entries(saved)) {
      if (v && !v.includes('clearbit')) LOGO_CACHE[k] = v;
    }
  } catch(e) {}
}
function saveLogoCache() {
  try { localStorage.setItem('pea_logos', JSON.stringify(LOGO_CACHE)); } catch(e) {}
}
loadLogoCache();

// Fetch logo URL for a ticker using multiple sources
async function fetchLogo(ticker) {
  if (LOGO_CACHE[ticker]) return LOGO_CACHE[ticker];

  // Known company domains for reliable logos
  const TICKER_DOMAINS = {
    'MC.PA':'lvmh.com','OR.PA':'loreal.com','AI.PA':'airbus.com','AIR.PA':'airbus.com',
    'BNP.PA':'bnpparibas.com','SAN.PA':'sanofi.com','TTE.PA':'totalenergies.com',
    'SU.PA':'se.com','DG.PA':'vinci.com','RMS.PA':'hermes.com','BN.PA':'danone.com',
    'ACA.PA':'credit-agricole.com','CS.PA':'axa.com','RNO.PA':'renault.com',
    'ORA.PA':'orange.com','SGO.PA':'saint-gobain.com','ENGI.PA':'engie.com',
    'GLE.PA':'societegenerale.com','VIE.PA':'veolia.com','DSY.PA':'3ds.com',
    'EN.PA':'bouygues.com','HO.PA':'thalesgroup.com','ML.PA':'michelin.com',
    'AAPL':'apple.com','MSFT':'microsoft.com','GOOGL':'google.com','GOOG':'google.com',
    'AMZN':'amazon.com','META':'meta.com','TSLA':'tesla.com','NVDA':'nvidia.com',
    'NFLX':'netflix.com','DIS':'disney.com','PYPL':'paypal.com','ADBE':'adobe.com',
    'CRM':'salesforce.com','INTC':'intel.com','AMD':'amd.com','CSCO':'cisco.com',
    'PANX.PA':'amundi.com','CW8.PA':'amundi.com','MWRD.PA':'amundi.com',
    'PAEEM.PA':'amundi.com','PCEU.PA':'amundi.com','RS2K.PA':'amundi.com',
    'PE500.PA':'amundi.com','ESE.PA':'bnpparibas-am.com',
    'IWDA.AS':'ishares.com','CSPX.AS':'ishares.com','EMIM.AS':'ishares.com',
    'VWRL.AS':'vanguard.com','VWCE.AS':'vanguard.com','VOO':'vanguard.com',
    'VTI':'vanguard.com','VT':'vanguard.com',
    'SPY':'ssga.com','QQQ':'invesco.com','WPEA.PA':'invesco.com',
    'ARKK':'ark-invest.com','GLD':'ssga.com','TLT':'ishares.com','SOXX':'ishares.com',
  };

  const ETF_LOGO = 'https://raw.githubusercontent.com/armelpltr/Dashboard-PEA/main/data/ETF-Database-Logo2-wPadding_RGB%20(1)%20square.png';

  const ETF_TICKERS_SET = new Set(['WPEA.PA','ESEE.PA','ESE.PA','PUST.PA','PANX.PA','PAEEM.PA','ETZ.PA','EWLD.PA','CW8.PA','MWRD.PA','RS2K.PA','PCEU.PA','PE500.PA','IUSQ.AS','IWDA.AS','VWCE.AS','VWRL.AS','CSPX.AS','EMIM.AS','XDWD.AS','SPPW.AS','SPY','QQQ','VTI','VT','VOO','ARKK','GLD','TLT','SOXX']);

  // ETF check first — priorité sur TICKER_DOMAINS
  if (ETF_TICKERS_SET.has(ticker)) {
    LOGO_CACHE[ticker] = ETF_LOGO;
    saveLogoCache();
    return ETF_LOGO;
  }

  const knownDomain = TICKER_DOMAINS[ticker];
  if (knownDomain) {
    // Use Google favicon — works without CORS, no file:/// issues
    const url = 'https://www.google.com/s2/favicons?domain=' + knownDomain + '&sz=128';
    LOGO_CACHE[ticker] = url;
    saveLogoCache();
    return url;
  }

  // Fallback: guess domain from ticker name
  const clean = ticker.replace(/\.[A-Z]+$/i, '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const url = 'https://www.google.com/s2/favicons?domain=' + clean + '.com&sz=128';
  LOGO_CACHE[ticker] = url;
  saveLogoCache();
  return url;
}

// Fetch logos for all portfolio tickers in background
let _logoFetchRunning = false;
async function fetchAllLogos() {
  if (!currentUser || _logoFetchRunning) return;
  _logoFetchRunning = true;
  const data = getPortfolio(currentUser);
  const tickers = [...new Set(data.map(r => r.ticker).filter(Boolean))];
  let anyNew = false;
  for (const ticker of tickers) {
    if (!LOGO_CACHE[ticker]) {
      await fetchLogo(ticker);
      anyNew = true;
    }
  }
  _logoFetchRunning = false;
  if (anyNew) renderPortfolio();
}

let foundISIN = null;

function logoHtml(ticker, size, cssClass) {
  const abbr = ticker.replace(/\.[A-Z]+$/, '').slice(0, 3).toUpperCase();
  const r    = Math.round(size * 0.25);
  const st   = 'width:' + size + 'px;height:' + size + 'px;border-radius:' + r + 'px;object-fit:contain';
  const url  = LOGO_CACHE[ticker] || null;

  if (!url) return '<div class="' + cssClass + '">' + abbr + '</div>';

  const onErr = 'var p=this.parentNode;p.textContent=\x22' + abbr + '\x22;p.classList.remove(\x22logo-wrap\x22)';
  return '<div class="' + cssClass + ' logo-wrap">' +
    '<img src="' + url + '" style="' + st + '" onerror="' + onErr + '">' +
    '</div>';
}

async function isinToTicker(isin) {
  if (ISIN_MAP[isin]) return ISIN_MAP[isin];
  try {
    const r = await fetch('https://api.openfigi.com/v3/mapping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ idType: 'ID_ISIN', idValue: isin }]),
      signal: AbortSignal.timeout(6000)
    });
    if (!r.ok) return null;
    const data = await r.json();
    const hits = data[0] && data[0].data;
    if (!hits || !hits.length) return null;
    const pref = hits.find(h => h.exchCode && ['EPA','XETRA','AMS','LSE','NYQ','NAS','PCX'].includes(h.exchCode));
    const hit  = pref || hits[0];
    const exchMap = { EPA: '.PA', XETRA: '.DE', AMS: '.AS', LSE: '.L', NYQ: '', NAS: '', PCX: '' };
    const suffix = exchMap[hit.exchCode] !== undefined ? exchMap[hit.exchCode] : '';
    return hit.ticker + suffix;
  } catch(e) { return null; }
}

async function smartSearch(query) {
  const q = query.trim();
  if (/^[A-Z]{2}[A-Z0-9]{10}$/i.test(q)) {
    const isinUpper = q.toUpperCase();
    const ticker = await isinToTicker(isinUpper);
    if (ticker) {
      foundISIN = isinUpper;
      return [{ symbol: ticker, longname: ticker, quoteType: ISIN_MAP[isinUpper] ? 'EQUITY' : 'EQUITY' }];
    }
    throw new Error('ISIN introuvable.');
  }
  foundISIN = null;
  const searchUrl = 'https://query1.finance.yahoo.com/v1/finance/search?q='
    + encodeURIComponent(q) + '&lang=fr&region=FR&quotesCount=8&newsCount=0';
  const raw = await fetchWithFallback(searchUrl);
  const sd  = JSON.parse(raw);
  const quotes = (sd.quotes || []).filter(q =>
    q.quoteType === 'EQUITY' || q.quoteType === 'ETF' || q.quoteType === 'MUTUALFUND'
  );
  if (quotes.length) return quotes;
  throw new Error('Aucun résultat. Essayez le ticker (ex: PANX.PA) ou l\'ISIN.');
}

async function fetchPrice(query) {
  const statusEl = document.getElementById('search-status');
  const resultEl = document.getElementById('search-result');
  resultEl.classList.remove('visible');
  document.getElementById('btn-confirm').disabled = true;
  foundPrice = null;

  try {
    statusEl.innerHTML = '<div class="status-loading"><span class="loading-spinner"></span> Recherche…</div>';

    const localETF = searchETFLocal(query);
    let best;
    if (localETF) {
      best = { symbol: localETF.ticker, longname: localETF.name, quoteType: 'ETF' };
    } else {
      const searchUrl = 'https://query1.finance.yahoo.com/v1/finance/search?q=' + encodeURIComponent(query) + '&lang=fr&region=FR&quotesCount=6&newsCount=0';
      const sraw = await fetchWithFallback(searchUrl);
      const sd = JSON.parse(sraw);
      if (!sd || sd.error) throw new Error('Réponse invalide.');
      const quotes = (sd.quotes || []).filter(q =>
        q.quoteType === 'EQUITY' || q.quoteType === 'ETF' || q.quoteType === 'MUTUALFUND'
      );
      if (!quotes.length) throw new Error('Introuvable. Essayez le ticker (ex: MC.PA, IWDA.AS, AAPL).');
      best = quotes[0];
    }

    statusEl.innerHTML = '<div class="status-loading"><span class="loading-spinner"></span> Récupération du cours…</div>';
    const chartUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(best.symbol) + '?interval=1d&range=5d';
    const qraw = await fetchWithFallback(chartUrl);
    const qd = JSON.parse(qraw);

    const result = qd.chart && qd.chart.result && qd.chart.result[0];
    if (!result) throw new Error('Cours non disponible pour ce symbole.');
    const meta = result.meta;

    foundPrice  = meta.regularMarketPrice;
    foundName   = best.longname || best.shortname || best.symbol;
    foundTicker = best.symbol;

    const prev = meta.chartPreviousClose || meta.previousClose || foundPrice;
    const changePct = prev ? ((foundPrice - prev) / prev) * 100 : 0;
    const isPos = changePct >= 0;

    document.getElementById('res-name').textContent  = foundName;
    document.getElementById('res-price').textContent =
      foundPrice.toFixed(2) + ' ' + (meta.currency || '');
    document.getElementById('res-info').textContent  =
      best.symbol + '  ·  ' + (meta.exchangeName || '') +
      '  ·  ' + (isPos ? '▲' : '▼') + ' ' + Math.abs(changePct).toFixed(2) + "% aujourd'hui";

    statusEl.innerHTML = '';
    resultEl.classList.add('visible');
    document.getElementById('btn-confirm').disabled = false;

    if (!document.getElementById('modal-buy-price').value) {
      document.getElementById('modal-buy-price').value = foundPrice.toFixed(2);
    }

  } catch (err) {
    statusEl.innerHTML = '<div class="status-error">⚠ ' + (err.message || 'Erreur inconnue.') + '</div>';
    console.error(err);
  }
}

function confirmAdd() {
  const qty     = parseFloat(document.getElementById('modal-qty').value);
  const buyPrice= parseFloat(document.getElementById('modal-buy-price').value);
  const buyDate = document.getElementById('modal-buy-date').value;

  if (!foundPrice || !qty || qty <= 0 || !buyPrice || buyPrice <= 0) {
    alert('Veuillez remplir tous les champs correctement.');
    return;
  }
  if (!buyDate) {
    alert("Veuillez renseigner la date d'achat.");
    return;
  }

  const data = getPortfolio(currentUser);
  data.push({
    name:         foundName || document.getElementById('modal-ticker').value,
    ticker:       foundTicker || '',
    isin:         foundISIN || TICKER_TO_ISIN[foundTicker] || null,
    qty:          qty,
    buyPrice:     buyPrice,
    buyDate:      buyDate,
    currentPrice: foundPrice,
    quoteType:    foundQuoteType || 'EQUITY',
    pe:           foundPE,
    beta:         foundBeta,
    dividendYield:foundDivYield,
    hasDividend:  foundHasDividend,
    addedAt:      new Date().toISOString()
  });
  // Log transaction for portfolio history
  logTransaction(currentUser, { type:'buy', ticker: foundTicker||'', name: foundName||'', qty, price: buyPrice, date: buyDate });
  savePortfolio(currentUser, data);
  closeModal();
  renderPortfolio();
  // Fetch logo for the new ticker in background
  if (foundTicker) fetchLogo(foundTicker).then(() => renderPortfolio());
}

// ─── ANALYSE PAGE — FULL DASHBOARD ───────────────────
let analyseTimer = null;
let currentAnalyseData = null;

function renderAnalysePortfolio() {
  const list = document.getElementById('analyse-portfolio-list');
  if (!list) return;
  const data = getPortfolio(currentUser);
  const emptyEl = document.getElementById('ana-empty');

  if (!data.length) {
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  list.innerHTML = data.map((row, i) => {
    const pct = row.currentPrice && row.buyPrice ? ((row.currentPrice - row.buyPrice) / row.buyPrice * 100) : 0;
    const isPos = pct >= 0;
    return '<div class="ana-picker-item" onclick="selectAnalyseStock(' + i + ')" id="asi-' + i + '">' +
      '<div style="display:flex;align-items:center;gap:8px">' +
        logoHtml(row.ticker, 24, 'ticker-icon') +
        '<div><div style="font-size:12px;font-weight:600">' + (row.name || row.ticker) + '</div>' +
        '<div style="font-size:10px;color:var(--text2);font-family:var(--mono)">' + row.ticker + '</div></div>' +
      '</div>' +
      '<div style="text-align:right">' +
        '<div style="font-size:11px;font-family:var(--mono)">' + (row.currentPrice ? row.currentPrice.toFixed(2) : '—') + '</div>' +
        '<div style="font-size:10px;font-family:var(--mono);color:' + (isPos ? 'var(--positive)' : 'var(--negative)') + '">' +
          (isPos ? '▲' : '▼') + ' ' + Math.abs(pct).toFixed(2) + '%</div>' +
      '</div></div>';
  }).join('');
}

function selectAnalyseStock(i) {
  document.querySelectorAll('.ana-picker-item').forEach(el => el.classList.remove('active'));
  const el = document.getElementById('asi-' + i);
  if (el) el.classList.add('active');
  const data = getPortfolio(currentUser);
  const row = data[i];
  if (!row) return;
  // Fetch full data from Yahoo for this ticker
  fetchFullAnalyse(row.ticker, row);
}

function onAnalyseInput() {
  clearTimeout(analyseTimer);
  const val = document.getElementById('analyse-search-input').value.trim();
  document.getElementById('analyse-search-status').innerHTML = '';
  if (val.length < 2) return;
  document.getElementById('analyse-search-status').innerHTML =
    '<div class="status-loading"><span class="loading-spinner"></span> Recherche...</div>';
  analyseTimer = setTimeout(function() { fetchAnalyseStock(val); }, 700);
}

async function fetchAnalyseStock(query) {
  const statusEl = document.getElementById('analyse-search-status');
  try {
    const localETF2 = searchETFLocal(query);
    let best;
    if (localETF2) {
      best = { symbol: localETF2.ticker, longname: localETF2.name, quoteType: 'ETF' };
    } else {
      const sraw2 = await fetchWithFallback('https://query1.finance.yahoo.com/v1/finance/search?q=' + encodeURIComponent(query) + '&lang=fr&region=FR&quotesCount=6&newsCount=0');
      const sd = JSON.parse(sraw2);
      const quotes = (sd.quotes || []).filter(q => q.quoteType === 'EQUITY' || q.quoteType === 'ETF' || q.quoteType === 'MUTUALFUND');
      if (!quotes.length) throw new Error('Action introuvable.');
      best = quotes[0];
    }
    statusEl.innerHTML = '';
    document.querySelectorAll('.ana-picker-item').forEach(el => el.classList.remove('active'));
    fetchFullAnalyse(best.symbol, null);
  } catch(err) {
    statusEl.innerHTML = '<div class="status-error">⚠ ' + (err.message || 'Erreur') + '</div>';
  }
}

// Core: fetch all Yahoo data and populate dashboard
async function fetchFullAnalyse(ticker, portfolioRow) {
  const emptyEl = document.getElementById('ana-empty');
  if (emptyEl) emptyEl.style.display = 'none';

  // Loading state
  document.getElementById('ana-name').textContent = 'Chargement…';
  document.getElementById('ana-ticker').textContent = ticker;
  document.getElementById('ana-price').textContent = '…';

  try {
    // ── 1. Cours + meta (v8/chart) ────────────────────────────────────────
    const cRaw = await fetchWithFallback('https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(resolveToYahooTicker(ticker)) + '?interval=1d&range=5d');
    const cd = JSON.parse(cRaw);
    const res = cd.chart && cd.chart.result && cd.chart.result[0];
    if (!res) throw new Error('Données indisponibles');
    const meta = res.meta;

    const price = meta.regularMarketPrice;
    const prev = meta.chartPreviousClose || meta.previousClose || price;
    const changePct = prev ? ((price - prev) / prev * 100) : 0;
    const high52 = meta.fiftyTwoWeekHigh || 0;
    const low52 = meta.fiftyTwoWeekLow || 0;

    // ── 2. Fondamentaux (quoteSummary) ────────────────────────────────────
    // modules : financialData + defaultKeyStatistics + summaryDetail
    let fund = {};
    try {
      const modules = 'financialData,defaultKeyStatistics,summaryDetail';
      const qsUrl = 'https://query1.finance.yahoo.com/v10/finance/quoteSummary/' +
        encodeURIComponent(resolveToYahooTicker(ticker)) + '?modules=' + modules;
      const qsRaw = await fetchWithFallback(qsUrl);
      const qs = JSON.parse(qsRaw);
      const r = qs && qs.quoteSummary && qs.quoteSummary.result && qs.quoteSummary.result[0];
      if (r) {
        const fd = r.financialData || {};
        const ks = r.defaultKeyStatistics || {};
        const sd = r.summaryDetail || {};
        fund = {
          // Valorisation
          pe:           meta.trailingPE || sd.trailingPE?.raw || null,
          forwardPe:    meta.forwardPE  || ks.forwardPE?.raw  || null,
          peg:          ks.pegRatio?.raw || null,
          pb:           ks.priceToBook?.raw || null,
          ps:           ks.priceToSalesTrailing12Months?.raw || null,
          evEbitda:     ks.enterpriseToEbitda?.raw || null,
          // Qualité
          roe:          fd.returnOnEquity?.raw || null,
          roa:          fd.returnOnAssets?.raw || null,
          profitMargin: fd.profitMargins?.raw  || null,
          grossMargin:  fd.grossMargins?.raw   || null,
          opMargin:     fd.operatingMargins?.raw || null,
          // Croissance
          revGrowth:    fd.revenueGrowth?.raw  || null,
          epsGrowth:    fd.earningsGrowth?.raw || null,
          eps:          ks.trailingEps?.raw    || null,
          fwdEps:       ks.forwardEps?.raw     || null,
          // Solidité
          totalDebt:    fd.totalDebt?.raw      || null,
          totalCash:    fd.totalCash?.raw      || null,
          ebitda:       fd.ebitda?.raw         || null,
          debtToEquity: fd.debtToEquity?.raw   || null,
          currentRatio: fd.currentRatio?.raw   || null,
          quickRatio:   fd.quickRatio?.raw     || null,
          fcf:          fd.freeCashflow?.raw   || null,
          // Dividende
          divYieldRaw:  sd.dividendYield?.raw  || null,
          divRate:      sd.dividendRate?.raw   || meta.trailingAnnualDividendRate || null,
          payoutRatio:  sd.payoutRatio?.raw    || null,
          sharesOutstanding: ks.sharesOutstanding?.raw || null,
          avg5yDivYield: sd.fiveYearAvgDividendYield?.raw || null,
          // Secteur
          sector:       portfolioRow?.sector   || null,
        };
      }
    } catch(e2) { console.warn('quoteSummary failed, scoring partiel:', e2.message); }

    // ── 3. Construction de l'objet d ─────────────────────────────────────
    const d = {
      name: portfolioRow ? (portfolioRow.name || ticker) : (meta.shortName || meta.longName || ticker),
      ticker, price,
      currency: meta.currency || 'EUR',
      exchange: meta.exchangeName || '',
      changePct, prev,
      high52, low52,
      pe:        fund.pe        || meta.trailingPE || null,
      forwardPe: fund.forwardPe || meta.forwardPE  || null,
      beta:      meta.beta      || null,
      divYield:  fund.divYieldRaw || (meta.trailingAnnualDividendRate > 0 ? meta.trailingAnnualDividendRate / price : null),
      divRate:   fund.divRate   || meta.trailingAnnualDividendRate || null,
      volume:    meta.regularMarketVolume || null,
      marketCap: meta.marketCap || null,
      buyPrice:  portfolioRow ? portfolioRow.buyPrice : null,
      qty:       portfolioRow ? portfolioRow.qty      : null,
      quoteType: portfolioRow ? portfolioRow.quoteType : (meta.instrumentType || 'EQUITY'),
      // Fondamentaux enrichis
      ...fund,
    };

    // ── 4. Score fondamental (algo Python porté en JS) ──────────────────
    d.fundamentalScore = computeFundamentalScore(d);

    currentAnalyseData = d;

    // Révéler le hero + tabs (était géré par setMistralContext)
    const heroEl   = document.getElementById('ana-hero');
    const tabsWrap = document.getElementById('ana-tabs-wrap');
    const emptyEl2 = document.getElementById('ana-empty');
    if (heroEl)   { heroEl.style.opacity = '1'; heroEl.style.pointerEvents = 'auto'; }
    if (tabsWrap) tabsWrap.style.display = 'block';
    if (emptyEl2) emptyEl2.style.display = 'none';

    populateHero(d);
    populateTabs(d);

  } catch(e) {
    document.getElementById('ana-name').textContent = 'Erreur';
    document.getElementById('ana-ticker').textContent = e.message;
    console.error('Analyse fetch error:', e);
  }
}

// ── Hero score ring ──────────────────────────────
function resetHeroScore() {
  const scoreEl   = document.getElementById('ana-score');
  const verdictEl = document.getElementById('ana-verdict');
  const progress  = document.getElementById('hero-ring-progress');
  if (scoreEl)   { scoreEl.textContent = '—'; scoreEl.style.color = 'var(--text3)'; }
  if (verdictEl) { verdictEl.textContent = '—'; verdictEl.style.color = 'var(--text3)'; }
  if (progress)  { progress.style.strokeDashoffset = '251.2'; progress.style.stroke = 'var(--border2)'; }
}

function updateHeroScore(score, verdict) {
  const scoreEl   = document.getElementById('ana-score');
  const verdictEl = document.getElementById('ana-verdict');
  const progress  = document.getElementById('hero-ring-progress');
  const isPos = verdict === 'ACHAT' || verdict === 'ACHAT PROGRESSIF';
  const isNeg = verdict === 'ÉVITER' || verdict === 'PRUDENCE';
  const color = isPos ? 'var(--positive)' : isNeg ? 'var(--negative)' : 'var(--gold)';
  const emoji = isPos ? '🟢' : isNeg ? '🔴' : '🟡';
  const offset = 251.2 - (score / 100) * 251.2;
  if (progress) { progress.style.stroke = color; progress.style.strokeDashoffset = offset; }
  if (scoreEl)  { scoreEl.textContent = score; scoreEl.style.color = color; }
  if (verdictEl){ verdictEl.textContent = emoji + ' ' + verdict; verdictEl.style.color = color; }
}

function populateHero(d) {
  document.getElementById('ana-name').textContent = d.name;
  document.getElementById('ana-ticker').textContent = d.ticker + (d.exchange ? ' · ' + d.exchange : '');
  document.getElementById('ana-price').textContent = d.price ? d.price.toFixed(2) + ' ' + d.currency : '—';

  const changeEl = document.getElementById('ana-change');
  const isPos = d.changePct >= 0;
  changeEl.textContent = (isPos ? '▲ +' : '▼ ') + Math.abs(d.changePct).toFixed(2) + '%';
  changeEl.className = 'ana-hero-change ' + (isPos ? 'pos' : 'neg');

  // 52w bar
  if (d.high52 && d.low52 && d.price) {
    const range52 = d.high52 - d.low52;
    const pctPos = range52 > 0 ? ((d.price - d.low52) / range52 * 100) : 50;
    document.getElementById('ana-52w').textContent = d.low52.toFixed(2) + ' — ' + d.price.toFixed(2) + ' — ' + d.high52.toFixed(2);
    document.getElementById('ana-52w-fill').style.width = pctPos + '%';
    document.getElementById('ana-52w-dot').style.left = pctPos + '%';
  }

  // Afficher le score fondamental immédiatement
  if (d.fundamentalScore) {
    const fs = d.fundamentalScore;
    updateHeroScore(fs.score100, fs.verdict);
    const sublabel = document.getElementById('hero-mistral-sublabel');
    if (sublabel) sublabel.textContent = '📊 ' + fs.total.toFixed(1) + '/25 · ' + fs.conviction;
  } else {
    resetHeroScore();
  }
}

// ═══════════════════════════════════════════════════
// SCORING FONDAMENTAL — porté depuis pea_analyzer.py
// Score total /25 = 5 dimensions × /5
// ═══════════════════════════════════════════════════

// Table PE de référence par secteur (médiane historique)
// ═══════════════════════════════════════════════════
// SCORING FONDAMENTAL — fidèle à pea_analyzer.py
// 5 dimensions × /5 = 25 pts → converti /100
// ═══════════════════════════════════════════════════

// ── Table PE sectorielle (médiane historique) ────
const SECTOR_PE_REF = {
  'technology': 28, 'communication services': 22,
  'consumer cyclical': 22, 'consumer defensive': 20,
  'healthcare': 22, 'industrials': 19, 'basic materials': 15,
  'energy': 12, 'utilities': 16, 'real estate': 30,
  'financial services': 13, 'financial': 13, 'banks': 11,
};

function getSectorPeRef(sector) {
  if (!sector) return 18;
  const s = sector.toLowerCase();
  for (const [k, v] of Object.entries(SECTOR_PE_REF)) {
    if (s.includes(k)) return v;
  }
  return 18;
}

function isFinancialSector(sector) {
  if (!sector) return false;
  const s = sector.toLowerCase();
  return s.includes('financial') || s.includes('bank') || s.includes('insurance');
}

// ── 1. Valorisation /5 ──────────────────────────
function scoreValorisationF(d) {
  let score = 0;
  const details = {};
  const sectorRef = getSectorPeRef(d.sector);

  const pe  = d.pe        ? parseFloat(d.pe)        : null;
  const peg = d.peg       ? parseFloat(d.peg)       : null;
  const pb  = d.pb        ? parseFloat(d.pb)        : null;
  const fpe = d.forwardPe ? parseFloat(d.forwardPe) : null;

  details['PE (TTM)']        = pe  ? pe.toFixed(1)        : 'N/A';
  details['PEG Ratio']       = peg ? peg.toFixed(2)       : 'N/A';
  details['Price/Book']      = pb  ? pb.toFixed(2)        : 'N/A';
  details['Forward PE']      = fpe ? fpe.toFixed(1)       : 'N/A';
  details['PE Ref. Secteur'] = sectorRef + 'x';

  if (pe) {
    const ratio = pe / sectorRef;
    details['PE vs Secteur'] = ratio.toFixed(2) + 'x (' + (pe < sectorRef ? 'sous-evalué' : 'sur-evalué') + ')';
    if      (ratio < 0.60) score += 2.0;
    else if (ratio < 0.80) score += 1.8;
    else if (ratio < 1.00) score += 1.5;
    else if (ratio < 1.20) score += 1.2;
    else if (ratio < 1.50) score += 0.8;
    else if (ratio < 2.00) score += 0.4;
    else                   score += 0.1;
  } else { score += 1.0; }

  if (peg) {
    if      (peg < 0.8) score += 2.0;
    else if (peg < 1.0) score += 1.8;
    else if (peg < 1.5) score += 1.2;
    else if (peg < 2.0) score += 0.8;
    else                score += 0.3;
  } else { score += 1.0; }

  if (pb) {
    if      (pb < 1.0) score += 1.0;
    else if (pb < 2.0) score += 0.8;
    else if (pb < 3.5) score += 0.6;
    else if (pb < 5.0) score += 0.4;
    else               score += 0.1;
  } else { score += 0.5; }

  return { score: Math.min(score, 5.0), details };
}

// ── 2. Qualité /5 ───────────────────────────────
function scoreQualiteF(d) {
  let score = 0;
  const details = {};

  const roe = d.roe          ? parseFloat(d.roe)          : null;
  const roa = d.roa          ? parseFloat(d.roa)          : null;
  const pm  = d.profitMargin ? parseFloat(d.profitMargin) : null;
  const gm  = d.grossMargin  ? parseFloat(d.grossMargin)  : null;
  const om  = d.opMargin     ? parseFloat(d.opMargin)     : null;

  details['ROE']          = roe ? (roe * 100).toFixed(1) + '%' : 'N/A';
  details['ROA']          = roa ? (roa * 100).toFixed(1) + '%' : 'N/A';
  details['Marge Nette']  = pm  ? (pm  * 100).toFixed(1) + '%' : 'N/A';
  details['Marge Brute']  = gm  ? (gm  * 100).toFixed(1) + '%' : 'N/A';
  details['Marge Operat'] = om  ? (om  * 100).toFixed(1) + '%' : 'N/A';

  if (roe) {
    const rp = roe * 100;
    if      (rp > 20) score += 2.0;
    else if (rp > 15) score += 1.8;
    else if (rp > 10) score += 1.4;
    else if (rp > 5)  score += 0.8;
    else              score += 0.3;
  } else { score += 1.0; }

  if (pm) {
    const p = pm * 100;
    if      (p > 20) score += 2.0;
    else if (p > 12) score += 1.6;
    else if (p > 7)  score += 1.2;
    else if (p > 3)  score += 0.8;
    else if (p > 0)  score += 0.4;
  } else { score += 1.0; }

  if (gm) {
    const g = gm * 100;
    if      (g > 50) score += 1.0;
    else if (g > 35) score += 0.8;
    else if (g > 20) score += 0.6;
    else             score += 0.3;
  } else { score += 0.5; }

  return { score: Math.min(score, 5.0), details };
}

// ── 3. Croissance /5 ────────────────────────────
function scoreCroissanceF(d) {
  let score = 0;
  const details = {};

  const revG = d.revGrowth ? parseFloat(d.revGrowth) * 100 : null;
  const epsG = d.epsGrowth ? parseFloat(d.epsGrowth) * 100 : null;
  const eps  = d.eps    ? parseFloat(d.eps)    : null;
  const feps = d.fwdEps ? parseFloat(d.fwdEps) : null;

  details['CAGR CA']       = revG !== null ? revG.toFixed(1) + '%' : 'N/A';
  details['Croiss. EPS']   = epsG !== null ? epsG.toFixed(1) + '%' : 'N/A';
  details['EPS (TTM)']     = eps  ? eps.toFixed(2)  : 'N/A';
  details['EPS (Forward)'] = feps ? feps.toFixed(2) : 'N/A';

  if (revG !== null) {
    if      (revG > 15) score += 2.5;
    else if (revG > 10) score += 2.0;
    else if (revG > 7)  score += 1.5;
    else if (revG > 3)  score += 1.0;
    else if (revG > 0)  score += 0.5;
    // revG <= 0 → 0 pts (comme Python)
  } else { score += 1.25; }

  if (epsG !== null) {
    if      (epsG > 15) score += 2.5;
    else if (epsG > 10) score += 2.0;
    else if (epsG > 7)  score += 1.5;
    else if (epsG > 3)  score += 1.0;
    else if (epsG > 0)  score += 0.5;
  } else { score += 1.25; }

  return { score: Math.min(score, 5.0), details };
}

// ── 4. Solidité /5 — avec Piotroski 9 critères ──
function scoreSoliditeF(d) {
  let score = 0;
  const details = {};

  if (isFinancialSector(d.sector)) {
    details['Note Secteur'] = 'Secteur financier : ratio dette ignore, ROE utilise';
    const roe = d.roe ? parseFloat(d.roe) : null;
    details['ROE (solidite)'] = roe ? (roe * 100).toFixed(1) + '%' : 'N/A';
    if (roe) {
      const rp = roe * 100;
      if      (rp > 15) score += 2.5;
      else if (rp > 12) score += 2.0;
      else if (rp > 8)  score += 1.5;
      else if (rp > 4)  score += 0.8;
      else              score += 0.2;
    } else { score += 1.0; }
  } else {
    const totalDebt = d.totalDebt ? parseFloat(d.totalDebt) : null;
    const cash      = d.totalCash ? parseFloat(d.totalCash) : null;
    const ebitda    = d.ebitda    ? parseFloat(d.ebitda)    : null;
    const netDebt   = (totalDebt !== null && cash !== null) ? totalDebt - cash : null;
    const ndEbitda  = (netDebt !== null && ebitda && ebitda > 0) ? netDebt / ebitda : null;

    details['Dette Nette/EBITDA'] = ndEbitda !== null ? ndEbitda.toFixed(2) + 'x' : 'N/A';
    details['Dette Totale'] = totalDebt ? (totalDebt / 1e9).toFixed(2) + ' Md' : 'N/A';
    details['Tresorerie']   = cash   ? (cash   / 1e9).toFixed(2) + ' Md' : 'N/A';
    details['EBITDA']       = ebitda ? (ebitda / 1e9).toFixed(2) + ' Md' : 'N/A';

    if (ndEbitda !== null) {
      if      (ndEbitda < 0) score += 2.5;
      else if (ndEbitda < 1) score += 2.3;
      else if (ndEbitda < 2) score += 2.0;
      else if (ndEbitda < 3) score += 1.4;
      else if (ndEbitda < 4) score += 0.8;
      else                   score += 0.2;
    } else { score += 1.0; }
  }

  // ── Piotroski F-Score 9 critères (fidèle Python) ─
  let fscore = 0;

  const roa = d.roa ? parseFloat(d.roa) : null;
  const f1 = roa && roa > 0;
  details['F1 ROA > 0']          = f1 ? 'oui' : 'non'; if (f1) fscore++;

  // F2 OCF > 0 — on utilise le FCF comme proxy (ocf non dispo via quoteSummary)
  const ocf = d.fcf ? parseFloat(d.fcf) : null;
  const f2 = ocf && ocf > 0;
  details['F2 OCF > 0']          = f2 ? 'oui' : 'non'; if (f2) fscore++;

  // F3 ΔROA > 0 — on utilise profitMargin > 0 comme proxy
  const f3 = d.profitMargin && parseFloat(d.profitMargin) > 0;
  details['F3 dROA > 0']         = f3 ? 'oui' : 'non'; if (f3) fscore++;

  // F4 OCF > Net Income
  const pm  = d.profitMargin ? parseFloat(d.profitMargin) : null;
  const f4 = ocf && pm && d.marketCap && (ocf > pm * parseFloat(d.marketCap));
  details['F4 OCF > Net Inc']    = f4 ? 'oui' : 'non'; if (f4) fscore++;

  // F5 Current Ratio > 1
  const cr = d.currentRatio ? parseFloat(d.currentRatio) : null;
  const f5 = cr && cr > 1;
  details['F5 Current Ratio > 1'] = f5 ? 'oui' : 'non'; if (f5) fscore++;

  // F6 Marge Brute > 0
  const gm = d.grossMargin ? parseFloat(d.grossMargin) : null;
  const f6 = gm && gm > 0;
  details['F6 Marge Brute > 0']  = f6 ? 'oui' : 'non'; if (f6) fscore++;

  // F7 Croissance CA > 0
  const f7 = d.revGrowth && parseFloat(d.revGrowth) > 0;
  details['F7 Croiss. CA > 0']   = f7 ? 'oui' : 'non'; if (f7) fscore++;

  // F8 D/E < 100
  const de = d.debtToEquity ? parseFloat(d.debtToEquity) : null;
  const f8 = de && de < 100;
  details['F8 D/E < 100']        = f8 ? 'oui' : 'non'; if (f8) fscore++;

  // F9 Quick Ratio > 1
  const qr = d.quickRatio ? parseFloat(d.quickRatio) : null;
  const f9 = qr && qr > 1;
  details['F9 Quick Ratio > 1']  = f9 ? 'oui' : 'non'; if (f9) fscore++;

  details['F-Score Piotroski'] = fscore + '/9';
  score += (fscore / 9) * 2.5;

  return { score: Math.min(score, 5.0), details };
}

// ── 5. Dividende /5 ─────────────────────────────
function scoreDividendeF(d) {
  let score = 0;
  const details = {};

  // Normaliser divYield → décimal (comme _safe_div_yield Python)
  let divYield = null;
  if (d.divYieldRaw !== null && d.divYieldRaw !== undefined) {
    const raw = parseFloat(d.divYieldRaw);
    if (raw > 0) divYield = raw > 1.0 ? raw / 100 : raw;
  }

  let payoutRatio = null;
  if (d.payoutRatio) {
    const raw = parseFloat(d.payoutRatio);
    if (raw > 0) payoutRatio = raw > 1.5 ? raw / 100 : raw;
  }

  const divRate = d.divRate ? parseFloat(d.divRate) : null;
  const fcf     = d.fcf     ? parseFloat(d.fcf)     : null;
  const shares  = d.sharesOutstanding ? parseFloat(d.sharesOutstanding) : null;

  details['Rendement Div.']   = divYield    ? (divYield * 100).toFixed(2) + '%'    : 'N/A';
  details['Dividende/Action'] = divRate     ? divRate.toFixed(2)                   : 'N/A';
  details['Payout Ratio']     = payoutRatio ? (payoutRatio * 100).toFixed(1) + '%' : 'N/A';
  details['FCF']              = fcf         ? (fcf / 1e9).toFixed(2) + ' Md'       : 'N/A';

  if (!divYield) {
    details['Note'] = 'Pas de dividende verse';
    const revG = d.revGrowth ? parseFloat(d.revGrowth) : 0;
    score = revG > 0.10 ? 3.0 : 2.0;
    if (revG > 0.10) details['Bonus Croissance'] = 'Reinvestissement (CA >10%)';
    return { score: Math.min(score, 5.0), details };
  }

  // Payout sur FCF (fidèle Python)
  let fcfPayout = null;
  if (fcf && fcf > 0 && divRate && shares) {
    fcfPayout = (divRate * shares / fcf) * 100;
  }
  details['Payout/FCF'] = fcfPayout !== null ? fcfPayout.toFixed(1) + '%' : 'N/A';

  if (fcfPayout !== null) {
    if      (fcfPayout < 30) score += 2.5;
    else if (fcfPayout < 60) score += 2.0;
    else if (fcfPayout < 75) score += 1.2;
    else if (fcfPayout < 90) score += 0.5;
    else                     score += 0.1;
  } else if (payoutRatio) {
    const pr = payoutRatio * 100;
    if      (pr < 30)  score += 2.5;
    else if (pr < 60)  score += 2.0;
    else if (pr < 75)  score += 1.2;
    else if (pr < 100) score += 0.5;
  } else { score += 1.25; }

  const dy = divYield * 100;
  if      (dy >= 2 && dy <= 5) score += 2.5;  // zone optimale
  else if (dy >= 1 && dy < 2)  score += 1.5;
  else if (dy > 5  && dy <= 8) score += 1.5;
  else if (dy > 8)             score += 0.5;  // trop élevé = risque
  else                         score += 0.5;

  return { score: Math.min(score, 5.0), details };
}

// ── Score global /25 → verdict + conviction ─────
function computeFundamentalScore(d) {
  const valo = scoreValorisationF(d);
  const qual = scoreQualiteF(d);
  const croi = scoreCroissanceF(d);
  const sold = scoreSoliditeF(d);
  const divd = scoreDividendeF(d);

  const total    = valo.score + qual.score + croi.score + sold.score + divd.score;
  const score100 = Math.round(total / 25 * 100);

  // Verdicts fidèles au Python (5 niveaux)
  let verdict, conviction, color;
  if (total >= 20) {
    verdict    = 'ACHAT';       conviction = '8/10'; color = 'var(--positive)';
  } else if (total >= 17) {
    verdict    = 'ACHAT PROGRESSIF'; conviction = '7/10'; color = 'var(--positive)';
  } else if (total >= 14) {
    verdict    = 'CONSERVER';   conviction = '5/10'; color = 'var(--gold)';
  } else if (total >= 10) {
    verdict    = 'PRUDENCE';    conviction = '4/10'; color = 'var(--gold)';
  } else {
    verdict    = 'ÉVITER';      conviction = '2/10'; color = 'var(--negative)';
  }

  // Diagnostic automatique (points forts / faibles)
  const scores = { Valorisation: valo.score, Qualite: qual.score, Croissance: croi.score, Solidite: sold.score, Dividende: divd.score };
  const strengths  = [];
  const weaknesses = [];
  for (const [cat, val] of Object.entries(scores)) {
    if (val >= 3.5) {
      const msgs = { Valorisation: 'Valorisation attractive', Qualite: 'Qualite des marges elevee', Croissance: 'Croissance soutenue', Solidite: 'Bilan financier robuste', Dividende: 'Politique de dividende saine' };
      strengths.push((msgs[cat] || cat) + ' (' + val.toFixed(1) + '/5)');
    }
    if (val < 2.5) {
      const msgs = { Valorisation: 'Valorisation tendue', Qualite: 'Marges sous pression ou ROE insuffisant', Croissance: 'Croissance faible ou en ralentissement', Solidite: 'Endettement eleve ou F-Score degrade', Dividende: 'Dividende absent, eleve ou peu soutenable' };
      weaknesses.push((msgs[cat] || cat) + ' (' + val.toFixed(1) + '/5)');
    }
  }

  return {
    total, score100, verdict, conviction, color,
    valo, qual, croi, sold, divd,
    strengths, weaknesses,
  };
}


function metricCard(label, value, sub, badge) {
  const badgeHtml = badge ? '<div class="metric-badge ' + badge.cls + '">' + badge.text + '</div>' : '';
  return '<div class="metric-card">' + badgeHtml +
    '<div class="metric-label">' + label + '</div>' +
    '<div class="metric-val">' + value + '</div>' +
    (sub ? '<div class="metric-sub">' + sub + '</div>' : '') + '</div>';
}
function rateBadge(val, goodMin, goodMax, midMin, midMax) {
  if (val == null || isNaN(val)) return null;
  if (val >= goodMin && val <= goodMax) return { cls: 'good', text: 'Bon' };
  if (val >= midMin && val <= midMax) return { cls: 'mid', text: 'Moyen' };
  return { cls: 'bad', text: 'Élevé' };
}

function populateTabs(d) {
  const na = '—';
  const f2 = v => v != null && !isNaN(v) ? parseFloat(v).toFixed(2) : na;
  const f1 = v => v != null && !isNaN(v) ? parseFloat(v).toFixed(1) : na;
  const pct = v => v != null && !isNaN(v) ? (parseFloat(v) * 100).toFixed(2) + '%' : na;
  const fs = d.fundamentalScore;

  // ── Helper : afficher un score de dimension avec détails ──
  function scoreBlock(label, scoreObj, color) {
    const s = scoreObj ? scoreObj.score : null;
    const c = s === null ? 'var(--text3)' : s >= 3.5 ? 'var(--positive)' : s >= 2.5 ? 'var(--gold)' : 'var(--negative)';
    const bar = s !== null ? Math.round(s / 5 * 100) : 0;
    let detailsHtml = '';
    if (scoreObj && scoreObj.details) {
      detailsHtml = Object.entries(scoreObj.details).map(([k, v]) =>
        '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);font-size:11px">' +
        '<span style="color:var(--text2)">' + k + '</span>' +
        '<span style="font-family:var(--mono);color:var(--text)">' + v + '</span></div>'
      ).join('');
    }
    return '<div class="metric-card" style="grid-column:span 2">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
        '<div class="metric-label">' + label + '</div>' +
        '<div style="font-family:var(--display);font-size:22px;font-weight:800;color:' + c + '">' + (s !== null ? s.toFixed(1) + '/5' : '—') + '</div>' +
      '</div>' +
      '<div style="height:4px;background:var(--s3);border-radius:2px;margin-bottom:12px">' +
        '<div style="width:' + bar + '%;height:100%;background:' + c + ';border-radius:2px;transition:width .6s ease"></div>' +
      '</div>' +
      detailsHtml +
    '</div>';
  }

  // ── VALORISATION ──
  document.getElementById('metrics-valuation').innerHTML =
    // Score block
    (fs ? scoreBlock('Score Valorisation', fs.valo, 'var(--accent)') : '') +
    // Métriques individuelles
    metricCard('P/E Ratio', f1(d.pe), d.pe ? (d.pe < 15 ? 'Sous-évalué' : d.pe < 25 ? 'Raisonnable' : 'Cher') : '', d.pe ? rateBadge(d.pe, 0, 15, 15, 25) : null) +
    metricCard('P/E Forward', f1(d.forwardPe), 'Estimé 12 mois', d.forwardPe ? rateBadge(d.forwardPe, 0, 18, 18, 30) : null) +
    metricCard('PEG Ratio', f2(d.peg), d.peg ? (d.peg < 1 ? 'Attractif' : d.peg < 2 ? 'Correct' : 'Élevé') : 'N/D', d.peg ? rateBadge(d.peg, 0, 1, 1, 2) : null) +
    metricCard('Price/Book', f2(d.pb), d.pb ? (d.pb < 1 ? 'Sous VNC' : d.pb < 3 ? 'Correct' : 'Premium') : 'N/D', null) +
    metricCard('Cap. boursière', d.marketCap ? (d.marketCap > 1e12 ? (d.marketCap/1e12).toFixed(1)+'T' : d.marketCap > 1e9 ? (d.marketCap/1e9).toFixed(1)+'Md' : (d.marketCap/1e6).toFixed(0)+'M') : na, d.currency, null) +
    (d.buyPrice ? metricCard('PRU portefeuille', f2(d.buyPrice) + ' ' + d.currency, '', null) : '') +
    (d.buyPrice && d.price ? metricCard('+/- Value unit.', (d.price - d.buyPrice >= 0 ? '+' : '') + f2(d.price - d.buyPrice), ((d.price - d.buyPrice) / d.buyPrice * 100).toFixed(2) + '%', d.price >= d.buyPrice ? { cls: 'good', text: 'Gain' } : { cls: 'bad', text: 'Perte' }) : '');

  // ── RENTABILITÉ ──
  document.getElementById('metrics-profit').innerHTML =
    (fs ? scoreBlock('Score Qualité', fs.qual, 'var(--accent2)') : '') +
    (fs ? scoreBlock('Score Croissance', fs.croi, 'var(--positive)') : '') +
    metricCard('ROE', d.roe ? (d.roe*100).toFixed(1)+'%' : na, 'Retour sur capitaux', d.roe ? rateBadge(d.roe*100, 15, 100, 8, 15) : null) +
    metricCard('ROA', d.roa ? (d.roa*100).toFixed(1)+'%' : na, 'Retour sur actifs', null) +
    metricCard('Marge Nette', d.profitMargin ? (d.profitMargin*100).toFixed(1)+'%' : na, '', d.profitMargin ? rateBadge(d.profitMargin*100, 12, 100, 5, 12) : null) +
    metricCard('Marge Brute',  d.grossMargin  ? (d.grossMargin*100).toFixed(1)+'%'  : na, '', null) +
    metricCard('Marge Opérat', d.opMargin     ? (d.opMargin*100).toFixed(1)+'%'     : na, '', null) +
    metricCard('Croiss. CA',   d.revGrowth    ? (d.revGrowth*100).toFixed(1)+'%'    : na, 'YoY', d.revGrowth ? rateBadge(d.revGrowth*100, 10, 100, 3, 10) : null) +
    metricCard('Croiss. EPS',  d.epsGrowth    ? (d.epsGrowth*100).toFixed(1)+'%'    : na, 'YoY', null) +
    metricCard('EPS (TTM)',    d.eps    ? f2(d.eps)    + ' ' + d.currency : na, '', null) +
    metricCard('EPS (Fwd)',    d.fwdEps ? f2(d.fwdEps) + ' ' + d.currency : na, '', null);

  // ── DIVIDENDES ──
  let dyDisplay = d.divYieldRaw ? parseFloat(d.divYieldRaw) : null;
  if (dyDisplay && dyDisplay > 1.0) dyDisplay = dyDisplay / 100;
  document.getElementById('metrics-dividends').innerHTML =
    (fs ? scoreBlock('Score Dividende', fs.divd, 'var(--gold)') : '') +
    metricCard('Rendement', dyDisplay ? (dyDisplay*100).toFixed(2)+'%' : na, 'Annuel', dyDisplay ? rateBadge(dyDisplay*100, 2, 5, 1, 2) : null) +
    metricCard('Dividende/action', d.divRate ? f2(d.divRate)+' '+d.currency : na, 'Trailing 12 mois', null) +
    metricCard('Payout Ratio', d.payoutRatio ? (parseFloat(d.payoutRatio) > 1 ? parseFloat(d.payoutRatio).toFixed(1) : (parseFloat(d.payoutRatio)*100).toFixed(1))+'%' : na, '', null) +
    (d.qty && d.divRate ? metricCard('Revenu annuel estimé', f2(d.qty * parseFloat(d.divRate))+' '+d.currency, d.qty+' actions', { cls:'good', text:'💰' }) : metricCard('Revenu annuel', na, 'Ajoutez au portefeuille', null)) +
    metricCard('Statut', dyDisplay && dyDisplay > 0 ? 'Distributeur' : 'Pas de dividende', '', dyDisplay && dyDisplay > 0 ? { cls:'good', text:'OUI' } : { cls:'mid', text:'NON' });

  // ── RISQUE / SOLIDITÉ ──
  const beta = d.beta ? parseFloat(d.beta) : null;
  document.getElementById('metrics-risk').innerHTML =
    (fs ? scoreBlock('Score Solidité', fs.sold, 'var(--accent)') : '') +
    metricCard('Bêta', beta ? beta.toFixed(2) : na, beta ? (beta < 0.8 ? 'Défensif' : beta > 1.2 ? 'Agressif' : 'Neutre') : '', beta ? rateBadge(beta, 0, 0.8, 0.8, 1.2) : null) +
    metricCard('D/E Ratio', d.debtToEquity ? parseFloat(d.debtToEquity).toFixed(1) : na, '', d.debtToEquity ? rateBadge(d.debtToEquity, 0, 50, 50, 100) : null) +
    metricCard('Current Ratio', d.currentRatio ? parseFloat(d.currentRatio).toFixed(2) : na, d.currentRatio ? (d.currentRatio > 1.5 ? 'Liquide' : d.currentRatio > 1 ? 'Correct' : 'Tendu') : '', null) +
    metricCard('Quick Ratio', d.quickRatio ? parseFloat(d.quickRatio).toFixed(2) : na, '', null) +
    metricCard('Dette Totale', d.totalDebt ? (d.totalDebt/1e9).toFixed(2)+'Md' : na, d.currency, null) +
    metricCard('Trésorerie', d.totalCash ? (d.totalCash/1e9).toFixed(2)+'Md' : na, d.currency, null) +
    metricCard('52w range', d.high52 && d.low52 ? ((d.high52-d.low52)/d.low52*100).toFixed(1)+'%' : na, 'Amplitude annuelle', null);

  // Peers comparison
  loadPeers(d);
}

// Peers: fetch a few tickers from same sector and compare
async function loadPeers(d) {
  const wrap = document.getElementById('peers-content');
  const sector = TICKER_SECTORS[d.ticker] || 'Autre';
  // Find peers in same sector
  const peers = Object.entries(TICKER_SECTORS).filter(([t, s]) => s === sector && t !== d.ticker).map(([t]) => t).slice(0, 4);
  if (!peers.length) { wrap.innerHTML = '<div style="color:var(--text3);font-size:12px;text-align:center;padding:32px 0">Aucun pair trouvé pour le secteur "' + sector + '"</div>'; return; }

  wrap.innerHTML = '<div style="color:var(--text3);font-size:12px;text-align:center;padding:20px 0"><span class="loading-spinner"></span> Chargement des pairs…</div>';

  const allData = [{ ticker: d.ticker, name: d.name, price: d.price, pe: d.pe, beta: d.beta, divYield: d.divYield, changePct: d.changePct, isCurrent: true }];

  await Promise.all(peers.map(async ticker => {
    try {
      const raw = await fetchWithFallback('https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(resolveToYahooTicker(ticker)) + '?interval=1d&range=5d');
      const cd = JSON.parse(raw);
      const meta = cd.chart.result[0].meta;
      const prev = meta.chartPreviousClose || meta.previousClose || meta.regularMarketPrice;
      allData.push({
        ticker, name: meta.shortName || meta.longName || ticker,
        price: meta.regularMarketPrice, pe: meta.trailingPE || null,
        beta: meta.beta || null,
        divYield: meta.trailingAnnualDividendRate > 0 ? (meta.trailingAnnualDividendRate / meta.regularMarketPrice) : null,
        changePct: prev ? ((meta.regularMarketPrice - prev) / prev * 100) : 0,
        isCurrent: false,
      });
    } catch(e) {}
  }));

  const f = v => v != null && !isNaN(v) ? parseFloat(v).toFixed(2) : '—';
  let html = '<table class="peers-table"><thead><tr><th>Action</th><th>Prix</th><th>P/E</th><th>Beta</th><th>Div. yield</th><th>Var. jour</th></tr></thead><tbody>';
  allData.forEach(p => {
    html += '<tr' + (p.isCurrent ? ' class="highlight"' : '') + '>';
    html += '<td style="font-weight:600">' + (p.isCurrent ? '→ ' : '') + p.ticker + '</td>';
    html += '<td>' + f(p.price) + '</td>';
    html += '<td>' + (p.pe ? parseFloat(p.pe).toFixed(1) : '—') + '</td>';
    html += '<td>' + (p.beta ? parseFloat(p.beta).toFixed(2) : '—') + '</td>';
    html += '<td>' + (p.divYield ? (p.divYield * 100).toFixed(2) + '%' : '—') + '</td>';
    html += '<td style="color:' + (p.changePct >= 0 ? 'var(--positive)' : 'var(--negative)') + '">' + (p.changePct >= 0 ? '+' : '') + p.changePct.toFixed(2) + '%</td>';
    html += '</tr>';
  });
  html += '</tbody></table>';
  wrap.innerHTML = html;
}

function setAnaTab(tab) {
  document.querySelectorAll('.ana-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ana-section').forEach(s => s.classList.remove('active'));
  event.currentTarget.classList.add('active');
  document.getElementById('ana-' + tab).classList.add('active');
}

// ─── GRAPHIQUES ──────────────────────────────────────────
let chartDonut = null;
let chartPerf  = null;
let chartHist  = null;

const CHART_COLORS = [
  '#7c6df5','#5b8dee','#00e09e','#f5b731','#ff4d6a',
  '#63b3ed','#68d391','#fc8181','#f6ad55','#76e4f7',
];

function initCharts() {
  const data = getPortfolio(currentUser);
  const empty = document.getElementById('charts-empty');
  const content = document.getElementById('charts-content');

  if (!data.length) {
    empty.style.display = 'block';
    content.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  content.style.display = 'block';

  renderDonutChart(data);
  renderPerfChart(data);
  populateHistSelect(data);
  renderHistChart();
}

function renderDonutChart(data) {
  const labels = data.map(r => r.ticker);
  const values = data.map(r => +(r.currentPrice * r.qty).toFixed(2));
  const ctx    = document.getElementById('chart-donut').getContext('2d');

  if (chartDonut) chartDonut.destroy();
  chartDonut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: CHART_COLORS.slice(0, data.length),
        borderColor: '#0a0c14',
        borderWidth: 3,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#8892a8',
            font: { family: 'JetBrains Mono', size: 11 },
            padding: 14,
            boxWidth: 12,
            boxHeight: 12,
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => ' ' + ctx.label + ' — ' + ctx.parsed.toLocaleString('fr-FR', {style:'currency',currency:'EUR'})
          },
          backgroundColor: '#10121c',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          titleColor: '#edf0f7',
          bodyColor: '#8892a8',
          padding: 12,
          cornerRadius: 8,
        }
      }
    }
  });
}

function renderPerfChart(data) {
  const labels = data.map(r => r.ticker);
  const values = data.map(r => +((r.currentPrice - r.buyPrice) / r.buyPrice * 100).toFixed(2));
  const colors = values.map(v => v >= 0 ? 'rgba(0,224,158,0.7)' : 'rgba(255,77,106,0.7)');
  const borders = values.map(v => v >= 0 ? '#00e09e' : '#ff4d6a');
  const ctx = document.getElementById('chart-perf').getContext('2d');

  if (chartPerf) chartPerf.destroy();
  chartPerf = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Performance (%)',
        data: values,
        backgroundColor: colors,
        borderColor: borders,
        borderWidth: 1,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ' ' + (ctx.parsed.x >= 0 ? '+' : '') + ctx.parsed.x + '%'
          },
          backgroundColor: '#10121c',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          titleColor: '#edf0f7',
          bodyColor: '#8892a8',
          padding: 12,
          cornerRadius: 8,
        }
      },
      scales: {
        x: {
          grid:  { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#495068', font: { family: 'JetBrains Mono', size: 10 },
                   callback: v => (v > 0 ? '+' : '') + v + '%' },
          border: { color: 'rgba(255,255,255,0.04)' }
        },
        y: {
          grid:  { display: false },
          ticks: { color: '#8892a8', font: { family: 'JetBrains Mono', size: 11 } },
          border: { color: 'rgba(255,255,255,0.04)' }
        }
      }
    }
  });
}

function populateHistSelect(data) {
  const sel = document.getElementById('chart-hist-select');
  sel.innerHTML = data.map((r,i) =>
    '<option value="' + i + '">' + r.ticker + ' — ' + (r.name || r.ticker) + '</option>'
  ).join('');
}

let currentPeriod = '1y';

const PERIOD_CONFIG = {
  '1d':  { range:'1d',   interval:'5m'  },
  '5d':  { range:'5d',   interval:'15m' },
  '1mo': { range:'1mo',  interval:'1d'  },
  '3mo': { range:'3mo',  interval:'1d'  },
  '6mo': { range:'6mo',  interval:'1wk' },
  '1y':  { range:'1y',   interval:'1wk' },
  '3y':  { range:'3y',   interval:'1wk' },
  '5y':  { range:'5y',   interval:'1mo' },
  '10y': { range:'10y',  interval:'1mo' },
  'max': { range:'max',  interval:'3mo' },
};

function setPeriod(p) {
  currentPeriod = p;
  document.querySelectorAll('.period-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.p === p);
  });
  renderHistChart();
}

async function renderHistChart() {
  const sel  = document.getElementById('chart-hist-select');
  const data = getPortfolio(currentUser);
  if (!data.length || sel.selectedIndex < 0) return;
  const row = data[parseInt(sel.value)];
  const ctx = document.getElementById('chart-hist').getContext('2d');
  const cfg = PERIOD_CONFIG[currentPeriod] || PERIOD_CONFIG['1y'];

  if (chartHist) { chartHist.destroy(); chartHist = null; }
  document.getElementById('hist-sub').textContent = 'Chargement…';

  try {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/'
      + encodeURIComponent(resolveToYahooTicker(row.ticker))
      + '?interval=' + cfg.interval + '&range=' + cfg.range;
    const raw = await fetchWithFallback(url);
    const d   = JSON.parse(raw);
    const res = d.chart && d.chart.result && d.chart.result[0];
    if (!res) throw new Error('Pas de données');

    const timestamps = res.timestamp;
    const closes     = res.indicators.quote[0].close;

    const labels = timestamps.map(t => {
      const dt = new Date(t * 1000);
      if (['1d','5d'].includes(currentPeriod))
        return dt.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
      if (['1mo','3mo'].includes(currentPeriod))
        return dt.toLocaleDateString('fr-FR', { day:'2-digit', month:'short' });
      return dt.toLocaleDateString('fr-FR', { month:'short', year:'2-digit' });
    });

    const values = closes.map(v => v ? +v.toFixed(2) : null);
    const first  = values.find(v => v !== null);
    const last   = [...values].reverse().find(v => v !== null);
    const isUp   = last >= first;
    const color  = isUp ? '#00e09e' : '#ff4d6a';
    const pct    = first ? ((last - first) / first * 100).toFixed(2) : 0;
    const sign   = pct >= 0 ? '+' : '';

    document.getElementById('hist-sub').textContent =
      row.name + ' · ' + sign + pct + '% sur la période';

    if (chartHist) chartHist.destroy();
    chartHist = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: row.ticker,
          data: values,
          borderColor: color,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: color,
          tension: 0.2,
          fill: true,
          backgroundColor: (ctx2) => {
            const g = ctx2.chart.ctx.createLinearGradient(0, 0, 0, 300);
            g.addColorStop(0, isUp ? 'rgba(0,224,158,0.12)' : 'rgba(255,77,106,0.12)');
            g.addColorStop(1, 'rgba(0,0,0,0)');
            return g;
          },
        }]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        animation: { duration: 1200, easing: "easeOutQuart" },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#10121c',
            borderColor: 'rgba(255,255,255,0.06)',
            borderWidth: 1,
            titleColor: '#8892a8',
            bodyColor: '#edf0f7',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: ctx => ' ' + (ctx.parsed.y !== null
                ? ctx.parsed.y.toLocaleString('fr-FR', {minimumFractionDigits:2})
                : '—') + ' ' + (row.currency || '')
            }
          }
        },
        scales: {
          x: {
            grid:  { color: 'rgba(255,255,255,0.03)' },
            ticks: { color: '#495068', font: { family:'JetBrains Mono', size:10 }, maxTicksLimit:10 },
            border: { color: 'rgba(255,255,255,0.04)' }
          },
          y: {
            position: 'right',
            grid:  { color: 'rgba(255,255,255,0.03)' },
            ticks: { color:'#8892a8', font:{ family:'JetBrains Mono', size:10 },
                     callback: v => v.toLocaleString('fr-FR', {minimumFractionDigits:2}) },
            border: { color: 'rgba(255,255,255,0.04)' }
          }
        }
      }
    });
  } catch(e) {
    document.getElementById('hist-sub').textContent = 'Données indisponibles pour cette période.';
    console.error('Hist chart error:', e);
  }
}

// ─── GRAPHIQUE ÉVOLUTION PORTEFEUILLE ────────────────────
let chartPortfolio    = null;
let portfolioPeriod   = '1y';

const PORTFOLIO_PERIOD_CONFIG = {
  '1d':  { range:'1d',   interval:'5m'  },
  '5d':  { range:'5d',   interval:'15m' },
  '1mo': { range:'1mo',  interval:'1d'  },
  '3mo': { range:'3mo',  interval:'1d'  },
  '6mo': { range:'6mo',  interval:'1wk' },
  '1y':  { range:'1y',   interval:'1wk' },
  '3y':  { range:'3y',   interval:'1wk' },
  '5y':  { range:'5y',   interval:'1mo' },
  'max': { range:'max',  interval:'1mo' },
};

function setPortfolioPeriod(p) {
  portfolioPeriod = p;
  document.querySelectorAll('[data-pp]').forEach(b => {
    b.classList.toggle('active', b.dataset.pp === p);
  });
  renderPortfolioChart();
}

// ─── TRANSACTION LOG ─────────────────────────────────
// Stores all buy/sell events so history can be reconstructed
// even after positions are fully sold
// getTransactions/saveTransactions → Firestore (définis dans couche données)


// ─── VERSEMENTS (cash deposits) ─────────────────────
// getVersements/saveVersements → Firestore (définis dans couche données)
function openVersementModal() {
  document.getElementById('versement-modal-overlay').classList.add('open');
  document.getElementById('versement-amount').value = '';
  document.getElementById('versement-date').value = new Date().toISOString().slice(0,10);
}
function closeVersementModal() {
  document.getElementById('versement-modal-overlay').classList.remove('open');
}
function confirmVersement() {
  const amount = parseFloat(document.getElementById('versement-amount').value);
  const date = document.getElementById('versement-date').value;
  if (!amount || amount <= 0) { alert('Montant invalide.'); return; }
  if (!date) { alert('Date requise.'); return; }
  const v = getVersements(currentUser);
  v.push({ amount, date });
  saveVersements(currentUser, v);
  closeVersementModal();
  renderPortfolio();
}

// ─── CSV IMPORT ─────────────────────────────────────
let pendingImportRows = [];

function importCSV(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) { alert('Fichier CSV vide ou invalide.'); return; }

    // Detect separator
    const sep = lines[0].includes(';') ? ';' : ',';
    const headers = lines[0].toLowerCase().replace(/"/g,'').split(sep).map(h => h.trim());

    // Try to map columns
    const colDate = headers.findIndex(h => h.includes('date'));
    const colType = headers.findIndex(h => h.includes('type') || h.includes('sens') || h.includes('operation') || h.includes('opération'));
    const colTicker = headers.findIndex(h => h.includes('ticker') || h.includes('symbole') || h.includes('isin') || h.includes('code'));
    const colName = headers.findIndex(h => h.includes('nom') || h.includes('name') || h.includes('libellé') || h.includes('libelle') || h.includes('valeur'));
    const colQty = headers.findIndex(h => h.includes('qté') || h.includes('quantité') || h.includes('quantite') || h.includes('qty') || h.includes('quantity'));
    const colPrice = headers.findIndex(h => h.includes('prix') || h.includes('price') || h.includes('cours') || h.includes('buying'));
    const colBuyPrice = headers.findIndex(h => h.includes('pru') || h.includes('buyingprice') || h.includes('buyingprice') || h.includes('prix achat') || h.includes('buy'));

    pendingImportRows = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].replace(/"/g,'').split(sep).map(v => v.trim());
      if (vals.length < 3) continue;

      const row = {
        date: colDate >= 0 ? vals[colDate] : '',
        type: colType >= 0 ? vals[colType].toLowerCase() : 'buy',
        ticker: colTicker >= 0 ? vals[colTicker] : '',
        name: colName >= 0 ? vals[colName] : '',
        qty: parseFloat((colQty >= 0 ? vals[colQty] : '0').replace(',','.')),
        price: parseFloat((colPrice >= 0 ? vals[colPrice] : (colBuyPrice >= 0 ? vals[colBuyPrice] : '0')).replace(',','.'))
      };

      // Normalize type
      if (row.type.includes('achat') || row.type.includes('buy')) row.type = 'buy';
      else if (row.type.includes('vente') || row.type.includes('sell')) row.type = 'sell';
      else if (row.type.includes('versement') || row.type.includes('virement') || row.type.includes('deposit')) row.type = 'versement';

      // Normalize date (dd/mm/yyyy → yyyy-mm-dd)
      if (row.date && row.date.includes('/')) {
        const parts = row.date.split('/');
        if (parts.length === 3) {
          row.date = (parts[2].length === 2 ? '20' + parts[2] : parts[2]) + '-' + parts[1].padStart(2,'0') + '-' + parts[0].padStart(2,'0');
        }
      }

      if (row.qty > 0 && row.price > 0) pendingImportRows.push(row);
      else if (row.type === 'versement' && row.price > 0) { row.qty = 0; pendingImportRows.push(row); }
    }

    if (!pendingImportRows.length) { alert('Aucune transaction valide détectée dans le CSV.\n\nColonnes attendues : date, type (achat/vente), ticker, nom, quantité, prix'); return; }

    // Show preview modal
    const tbody = document.getElementById('csv-preview-tbody');
    tbody.innerHTML = pendingImportRows.map(r => {
      const cls = r.type === 'buy' ? 'badge-pos' : r.type === 'sell' ? 'badge-neg' : '';
      const label = r.type === 'buy' ? 'ACHAT' : r.type === 'sell' ? 'VENTE' : 'VERSEMENT';
      return '<tr>' +
        '<td style="font-size:11px" class="mono">' + (r.date || '—') + '</td>' +
        '<td><span class="' + cls + '" style="font-size:9px;padding:2px 6px">' + label + '</span></td>' +
        '<td style="font-size:11px" class="mono">' + r.ticker + '</td>' +
        '<td style="font-size:11px">' + r.name + '</td>' +
        '<td style="font-size:11px" class="mono">' + r.qty + '</td>' +
        '<td style="font-size:11px" class="mono">' + r.price.toFixed(2) + ' €</td>' +
        '</tr>';
    }).join('');
    document.getElementById('csv-import-status').textContent = pendingImportRows.length + ' opérations détectées';
    document.getElementById('csv-import-modal').classList.add('open');
  };
  reader.readAsText(file);
  event.target.value = ''; // reset so same file can be re-imported
}

function closeImportModal() {
  document.getElementById('csv-import-modal').classList.remove('open');
  pendingImportRows = [];
}

function confirmImport() {
  if (!pendingImportRows.length) return;

  // Sort by date to process chronologically
  const sorted = [...pendingImportRows].sort((a,b) => (a.date||'').localeCompare(b.date||''));

  const data = getPortfolio(currentUser);

  sorted.forEach(row => {
    if (row.type === 'versement') {
      const v = getVersements(currentUser);
      v.push({ amount: row.price, date: row.date });
      saveVersements(currentUser, v);
      return;
    }

    if (row.type === 'buy') {
      // Check if ticker already exists in portfolio
      const existing = data.find(r => r.ticker === row.ticker);
      if (existing) {
        const newQty = existing.qty + row.qty;
        existing.buyPrice = Math.round(((existing.qty * existing.buyPrice + row.qty * row.price) / newQty) * 10000) / 10000;
        existing.qty = Math.round(newQty * 10000) / 10000;
      } else {
        data.push({
          name: row.name || row.ticker,
          ticker: row.ticker,
          qty: row.qty,
          buyPrice: row.price,
          buyDate: row.date,
          currentPrice: row.price, // will be updated on refresh
          quoteType: 'EQUITY',
          addedAt: new Date().toISOString()
        });
      }
      logTransaction(currentUser, { type:'buy', ticker: row.ticker, name: row.name, qty: row.qty, price: row.price, date: row.date });
    }

    if (row.type === 'sell') {
      const existing = data.find(r => r.ticker === row.ticker);
      const buyPrice = existing ? existing.buyPrice : row.price;
      const realizedPnl = Math.round((row.price - buyPrice) * row.qty * 100) / 100;
      logTransaction(currentUser, { type:'sell', ticker: row.ticker, name: row.name, qty: row.qty, price: row.price, date: row.date, buyPrice, realizedPnl });

      if (existing) {
        if (row.qty >= existing.qty) {
          const idx = data.indexOf(existing);
          data.splice(idx, 1);
        } else {
          existing.qty = Math.round((existing.qty - row.qty) * 10000) / 10000;
        }
      }
    }
  });

  savePortfolio(currentUser, data);
  closeImportModal();
  renderPortfolio();
  // Trigger price refresh for new tickers
  setTimeout(refreshPrices, 500);
  alert(sorted.length + ' opérations importées avec succès !');
}

// Backfill: if a portfolio row was added before the transaction log existed,
// inject a synthetic 'buy' so the history graph can reconstruct properly
function ensureBuyTxExists(user, row) {
  const txs = getTransactions(user);
  const hasBuy = txs.some(tx => tx.type === 'buy' && tx.ticker === row.ticker);
  if (!hasBuy) {
    const date = row.buyDate || row.addedAt?.slice(0,10) || new Date().toISOString().slice(0,10);
    txs.push({ type: 'buy', ticker: row.ticker, name: row.name || row.ticker, qty: row.qty, price: row.buyPrice, date });
    saveTransactions(user, txs);
  }
}

// Rebuild inventory at any date from transaction log
// Returns { ticker: qty } at given date
function inventoryAtDate(user, dateStr) {
  const txs = getTransactions(user);
  const inv = {};
  for (const tx of txs) {
    if (tx.date <= dateStr) {
      if (tx.type === 'buy') {
        inv[tx.ticker] = (inv[tx.ticker] || 0) + tx.qty;
      } else if (tx.type === 'sell') {
        inv[tx.ticker] = (inv[tx.ticker] || 0) - tx.qty;
        if (inv[tx.ticker] <= 0.0001) delete inv[tx.ticker];
      }
    }
  }
  return inv;
}

// Also build inventory from current portfolio data + buyDates as fallback
// (for users who had positions before transaction log existed)
function inventoryAtDateFallback(data, dayTs, graphStart) {
  const inv = {};
  data.forEach(row => {
    const buyTs = row.buyDate
      ? Math.floor(new Date(row.buyDate + 'T12:00:00').getTime() / 1000)
      : graphStart;
    if (buyTs <= dayTs) {
      inv[row.ticker] = (inv[row.ticker] || 0) + row.qty;
    }
  });
  return inv;
}

async function buildPortfolioHistory(data, graphStart, graphEnd) {
  // Collect all tickers: from current portfolio + from transaction history
  const txs = getTransactions(currentUser);
  const allTickers = new Set(data.map(r => r.ticker));
  txs.forEach(tx => allTickers.add(tx.ticker));
  const tickers = [...allTickers].filter(Boolean);

  if (!tickers.length) return [];

  const daysDuration = Math.ceil((graphEnd - graphStart) / 86400);
  let interval, range;
  if      (daysDuration <= 35)   { interval = '1d';  range = '1mo'; }
  else if (daysDuration <= 100)  { interval = '1d';  range = '3mo'; }
  else if (daysDuration <= 200)  { interval = '1d';  range = '6mo'; }
  else if (daysDuration <= 400)  { interval = '1d';  range = '1y';  }
  else if (daysDuration <= 1200) { interval = '1wk'; range = '3y';  }
  else if (daysDuration <= 2000) { interval = '1mo'; range = '5y';  }
  else                           { interval = '1mo'; range = 'max'; }

  const priceMap = {};
  await Promise.all(tickers.map(async ticker => {
    try {
      const yahooTicker = resolveToYahooTicker(ticker);
      const raw = await fetchWithFallback(
        'https://query1.finance.yahoo.com/v8/finance/chart/'
        + encodeURIComponent(yahooTicker)
        + '?interval=' + interval + '&range=' + range
      );
      const d   = JSON.parse(raw);
      const res = d.chart && d.chart.result && d.chart.result[0];
      if (!res) return;
      const ts     = res.timestamp;
      const closes = res.indicators.quote[0].close;
      priceMap[ticker] = ts.map((t, i) => ({ ts: t, close: closes[i] }))
                           .filter(p => p.close != null);
    } catch(e) { priceMap[ticker] = []; }
  }));

  // For short periods (intraday), use Yahoo timestamps directly instead of generating daily timeline
  const isIntraday = daysDuration <= 6;

  let timeline;
  if (isIntraday) {
    // Merge all timestamps from all tickers
    const allTs = new Set();
    for (const ticker of tickers) {
      (priceMap[ticker] || []).forEach(p => allTs.add(p.ts));
    }
    timeline = [...allTs].sort((a, b) => a - b).filter(t => t >= graphStart);
  } else {
    timeline = [];
    const cursor = new Date(graphStart * 1000);
    cursor.setHours(18, 0, 0, 0);
    const endDate = new Date(graphEnd * 1000);
    while (cursor <= endDate) {
      const dow = cursor.getDay();
      if (dow !== 0 && dow !== 6) {
        timeline.push(Math.floor(cursor.getTime() / 1000));
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  if (!timeline.length) return [];

  function getHistoricalClose(ticker, ts) {
    const prices = priceMap[ticker] || [];
    let last = null;
    for (const p of prices) {
      if (p.ts <= ts + 86400) last = p.close;
      else break;
    }
    return last;
  }

  const hasTxLog = txs.length > 0;

  const dataset = [];
  for (const dayTs of timeline) {
    let inventory;
    if (hasTxLog) {
      // Use transaction log: accurate with buy+sell history
      const dateStr = new Date(dayTs * 1000).toISOString().slice(0, 10);
      inventory = inventoryAtDate(currentUser, dateStr);
    } else {
      // Fallback: use current portfolio buyDate (legacy, no sell history)
      inventory = inventoryAtDateFallback(data, dayTs, graphStart);
    }

    let valeurTotale = 0;
    for (const [ticker, qty] of Object.entries(inventory)) {
      if (qty <= 0) continue;
      const close = getHistoricalClose(ticker, dayTs);
      if (close != null) {
        valeurTotale += qty * close;
      }
    }

    const dt = new Date(dayTs * 1000);
    dataset.push({
      date:         dt.toISOString().slice(0, 10),
      valeurTotale: +valeurTotale.toFixed(2),
      ts:           dayTs,
    });
  }

  return dataset;
}

async function renderPortfolioChart() {
  const data = getPortfolio(currentUser);
  const card = document.getElementById('portfolio-chart-card');
  // Always show the chart
  card.style.display = 'block';

  const sub = document.getElementById('portfolio-chart-sub');
  sub.textContent = 'Chargement…';

  try {
    const now = Math.floor(Date.now() / 1000);

    const periodOffsets = {
      '1d': 1*86400, '5d': 5*86400,
      '1mo': 30*86400, '3mo': 90*86400, '6mo': 180*86400,
      '1y': 365*86400, '3y': 3*365*86400, '5y': 5*365*86400, 'max': null
    };
    const offset = periodOffsets[portfolioPeriod];

    // Find oldest date from transactions or portfolio
    const txs = getTransactions(currentUser);
    let oldestTs = Infinity;
    txs.forEach(tx => {
      if (tx.date) {
        const ts = Math.floor(new Date(tx.date + 'T12:00:00').getTime() / 1000);
        if (ts < oldestTs) oldestTs = ts;
      }
    });
    data.forEach(row => {
      if (row.buyDate) {
        const ts = Math.floor(new Date(row.buyDate + 'T12:00:00').getTime() / 1000);
        if (ts < oldestTs) oldestTs = ts;
      }
    });
    if (oldestTs === Infinity) oldestTs = now - 30 * 86400; // default 1 month ago

    const periodStart = offset ? now - offset : oldestTs;
    const graphStart  = periodStart;

    const dataset = await buildPortfolioHistory(data, graphStart, now);

    if (!dataset.length) {
      sub.textContent = 'Aucune donnée sur cette période.';
      if (chartPortfolio) { chartPortfolio.destroy(); chartPortfolio = null; }
      // Show a flat zero line
      const ctx = document.getElementById('chart-portfolio').getContext('2d');
      chartPortfolio = new Chart(ctx, {
        type: 'line',
        data: { labels: ['Aujourd\'hui'], datasets: [{ data: [0], borderColor: '#495068', borderWidth: 1, pointRadius: 0 }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { min: 0, max: 100, ticks: { callback: v => v + ' €', color: '#495068' }, grid: { color: 'rgba(255,255,255,0.03)' } } } }
      });
      return;
    }

    const first = dataset[0].valeurTotale;
    const last  = dataset[dataset.length - 1].valeurTotale;
    const isUp  = last >= first;
    const pct   = first > 0 ? ((last - first) / first * 100).toFixed(2) : '0.00';
    const sign  = pct >= 0 ? '+' : '';
    const color = isUp ? '#00e09e' : '#ff4d6a';

    sub.textContent = 'Valeur totale · ' + sign + pct + '% sur la période · '
      + last.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

    const daysDuration = (now - graphStart) / 86400;
    const labels = dataset.map(p => {
      const dt = new Date(p.ts * 1000);
      if (daysDuration <= 1)
        return dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      if (daysDuration <= 6)
        return dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) + ' ' + dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      if (daysDuration <= 400)
        return dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      if (daysDuration <= 1500)
        return dt.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      return dt.getFullYear().toString();
    });

    const ctx = document.getElementById('chart-portfolio').getContext('2d');
    if (chartPortfolio) chartPortfolio.destroy();

    // Build buy/sell markers from transaction log
    const txMarkers = getTransactions(currentUser);
    const buyPoints = [];
    const sellPoints = [];
    txMarkers.forEach(tx => {
      if (!tx.date || (tx.type !== 'buy' && tx.type !== 'sell')) return;
      // Find closest index in dataset
      let bestIdx = -1, bestDist = Infinity;
      dataset.forEach((p, i) => {
        const dist = Math.abs(new Date(p.date).getTime() - new Date(tx.date).getTime());
        if (dist < bestDist) { bestDist = dist; bestIdx = i; }
      });
      if (bestIdx >= 0 && bestDist < 3 * 86400 * 1000) {
        if (tx.type === 'buy') buyPoints.push(bestIdx);
        else sellPoints.push(bestIdx);
      }
    });

    // Create point arrays: show colored dots only at buy/sell dates
    const dataValues = dataset.map(p => p.valeurTotale);
    const buyData = dataValues.map((v, i) => buyPoints.includes(i) ? v : null);
    const sellData = dataValues.map((v, i) => sellPoints.includes(i) ? v : null);

    chartPortfolio = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Portefeuille',
            data: dataValues,
            borderColor: 'rgba(124,109,245,0.9)',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: '#7c6df5',
            tension: 0.2,
            fill: true,
            spanGaps: true,
            backgroundColor: (ctx2) => {
              const g = ctx2.chart.ctx.createLinearGradient(0, 0, 0, 250);
              g.addColorStop(0, 'rgba(124,109,245,0.15)');
              g.addColorStop(1, 'rgba(0,0,0,0)');
              return g;
            },
          },
          {
            label: 'Achats',
            data: buyData,
            borderColor: 'transparent',
            backgroundColor: '#00e09e',
            pointRadius: buyData.map(v => v !== null ? 6 : 0),
            pointHoverRadius: 8,
            pointStyle: 'circle',
            pointBorderColor: '#04060b',
            pointBorderWidth: 2,
            showLine: false,
            fill: false,
          },
          {
            label: 'Ventes',
            data: sellData,
            borderColor: 'transparent',
            backgroundColor: '#ff4d6a',
            pointRadius: sellData.map(v => v !== null ? 6 : 0),
            pointHoverRadius: 8,
            pointStyle: 'circle',
            pointBorderColor: '#04060b',
            pointBorderWidth: 2,
            showLine: false,
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        animation: { duration: 1200, easing: "easeOutQuart" },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: '#8892a8',
              font: { family: 'JetBrains Mono', size: 10 },
              padding: 12,
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
              pointStyle: 'circle',
              filter: item => item.text !== 'Portefeuille'
            }
          },
          tooltip: {
            backgroundColor: '#10121c',
            borderColor: 'rgba(255,255,255,0.06)',
            borderWidth: 1,
            titleColor: '#8892a8',
            bodyColor: '#edf0f7',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(ctx) {
                if (ctx.datasetIndex === 0)
                  return ' ' + ctx.parsed.y.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
                if (ctx.parsed.y === null) return null;
                const label = ctx.datasetIndex === 1 ? '🟢 Achat' : '🔴 Vente';
                return ' ' + label + ' · ' + ctx.parsed.y.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
              }
            }
          }
        },
        scales: {
          x: {
            grid:   { color: 'rgba(255,255,255,0.03)' },
            ticks:  { color: '#495068', font: { family: 'JetBrains Mono', size: 10 }, maxTicksLimit: 10 },
            border: { color: 'rgba(255,255,255,0.04)' }
          },
          y: {
            position: 'right',
            beginAtZero: true,
            grid:   { color: 'rgba(255,255,255,0.03)' },
            ticks:  { color: '#8892a8', font: { family: 'JetBrains Mono', size: 10 },
                      callback: v => v.toLocaleString('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }) + ' €' },
            border: { color: 'rgba(255,255,255,0.04)' }
          }
        }
      }
    });

  } catch(e) {
    document.getElementById('portfolio-chart-sub').textContent = 'Données indisponibles pour cette période.';
    console.error('Portfolio chart error:', e);
  }
}

// ═══════════════════════════════════════════════════
// FEATURE: COLLAPSIBLE SIDEBAR
// ═══════════════════════════════════════════════════
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const btn = document.getElementById('sidebar-toggle');
  sb.classList.toggle('collapsed');
  document.body.classList.toggle('sb-collapsed');
  btn.textContent = sb.classList.contains('collapsed') ? '▶' : '◀';
  try { localStorage.setItem('pea_sb_collapsed', sb.classList.contains('collapsed') ? '1' : '0'); } catch(e) {}
}
(function(){
  try {
    if (localStorage.getItem('pea_sb_collapsed') === '1') {
      setTimeout(() => {
        const sb = document.getElementById('sidebar');
        if (sb) { sb.classList.add('collapsed'); document.body.classList.add('sb-collapsed'); document.getElementById('sidebar-toggle').textContent = '▶'; }
      }, 0);
    }
  } catch(e) {}
})();

// ═══════════════════════════════════════════════════
// FEATURE: SECTOR ALLOCATION
// ═══════════════════════════════════════════════════
const TICKER_SECTORS = {
  // CAC 40
  'MC.PA':'Luxe','OR.PA':'Luxe','RMS.PA':'Luxe','AI.PA':'Aéronautique','AIR.PA':'Aéronautique',
  'BNP.PA':'Finance','ACA.PA':'Finance','GLE.PA':'Finance','CS.PA':'Finance',
  'SAN.PA':'Santé','TTE.PA':'Énergie','ENGI.PA':'Énergie',
  'SU.PA':'Industrie','DG.PA':'Industrie','SGO.PA':'Industrie','EN.PA':'Industrie',
  'ORA.PA':'Telecom','VIV.PA':'Médias','BN.PA':'Agroalimentaire',
  'RNO.PA':'Automobile','ML.PA':'Automobile','HO.PA':'Défense',
  'DSY.PA':'Tech','VIE.PA':'Services',
  // US Tech
  'AAPL':'Tech','MSFT':'Tech','GOOGL':'Tech','GOOG':'Tech','META':'Tech',
  'AMZN':'E-commerce','TSLA':'Automobile','NVDA':'Tech','AMD':'Tech','INTC':'Tech',
  'NFLX':'Médias','DIS':'Médias','ADBE':'Tech','CRM':'Tech','CSCO':'Tech','PYPL':'Fintech',
  // ETFs
  'PANX.PA':'ETF','CW8.PA':'ETF','MWRD.PA':'ETF','PAEEM.PA':'ETF','RS2K.PA':'ETF',
  'PCEU.PA':'ETF','PE500.PA':'ETF','ESE.PA':'ETF','WPEA.PA':'ETF','EWLD.PA':'ETF',
  'IWDA.AS':'ETF','CSPX.AS':'ETF','VWRL.AS':'ETF','VWCE.AS':'ETF',
  'SPY':'ETF','QQQ':'ETF','VOO':'ETF','VTI':'ETF','VT':'ETF',
  'ARKK':'ETF','GLD':'Matières premières','TLT':'Obligations','SOXX':'ETF',
};
const SECTOR_COLORS = {
  'Tech':'#7c6df5','Luxe':'#f5b731','Finance':'#5b8dee','Santé':'#00e09e',
  'Énergie':'#ff4d6a','Industrie':'#63b3ed','ETF':'#68d391','Aéronautique':'#f6ad55',
  'Automobile':'#fc8181','Telecom':'#76e4f7','Médias':'#b794f4','Agroalimentaire':'#9ae6b4',
  'E-commerce':'#fbb6ce','Défense':'#a0aec0','Fintech':'#4fd1c5','Services':'#d6bcfa',
  'Matières premières':'#ecc94b','Obligations':'#90cdf4','Autre':'#4a5568',
};

let chartSector = null;
function renderSectorChart(data) {
  const sectors = {};
  data.forEach(r => {
    const s = TICKER_SECTORS[r.ticker] || 'Autre';
    sectors[s] = (sectors[s] || 0) + r.qty * r.currentPrice;
  });
  const labels = Object.keys(sectors);
  const values = Object.values(sectors).map(v => +v.toFixed(2));
  const colors = labels.map(l => SECTOR_COLORS[l] || '#4a5568');
  const ctx = document.getElementById('chart-sector').getContext('2d');
  if (chartSector) chartSector.destroy();
  chartSector = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data: values, backgroundColor: colors, borderColor: '#0a0c14', borderWidth: 3, hoverOffset: 8 }] },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: '62%',
      plugins: {
        legend: { position: 'bottom', labels: { color: '#8892a8', font: { family: 'JetBrains Mono', size: 10 }, padding: 10, boxWidth: 10, boxHeight: 10 } },
        tooltip: { callbacks: { label: ctx => ' ' + ctx.label + ' — ' + ctx.parsed.toLocaleString('fr-FR', {style:'currency',currency:'EUR'}) }, backgroundColor: '#10121c', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, titleColor: '#edf0f7', bodyColor: '#8892a8', padding: 10, cornerRadius: 8 }
      }
    }
  });
}

// ═══════════════════════════════════════════════════
// FEATURE: CORRELATION MATRIX
// ═══════════════════════════════════════════════════
async function renderCorrelationMatrix(data) {
  const wrap = document.getElementById('corr-matrix-wrap');
  if (data.length < 2) { wrap.innerHTML = '<div style="color:var(--text3);font-size:12px;text-align:center;padding:32px 0">Ajoutez au moins 2 positions.</div>'; return; }
  const tickers = data.map(r => r.ticker).slice(0, 8); // Max 8 for readability
  wrap.innerHTML = '<div style="color:var(--text3);font-size:12px;text-align:center;padding:20px 0"><span class="loading-spinner"></span> Calcul des corrélations…</div>';

  try {
    // Fetch 3mo daily returns for each ticker
    const returns = {};
    await Promise.all(tickers.map(async ticker => {
      try {
        const raw = await fetchWithFallback('https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(resolveToYahooTicker(ticker)) + '?interval=1d&range=3mo');
        const d = JSON.parse(raw);
        const closes = d.chart.result[0].indicators.quote[0].close.filter(v => v != null);
        const rets = [];
        for (let i = 1; i < closes.length; i++) rets.push((closes[i] - closes[i-1]) / closes[i-1]);
        returns[ticker] = rets;
      } catch(e) { returns[ticker] = []; }
    }));

    // Pearson correlation
    function pearson(a, b) {
      const n = Math.min(a.length, b.length);
      if (n < 5) return 0;
      const ax = a.slice(0, n), bx = b.slice(0, n);
      const ma = ax.reduce((s,v)=>s+v,0)/n, mb = bx.reduce((s,v)=>s+v,0)/n;
      let num = 0, da = 0, db = 0;
      for (let i = 0; i < n; i++) { num += (ax[i]-ma)*(bx[i]-mb); da += (ax[i]-ma)**2; db += (bx[i]-mb)**2; }
      return da && db ? num / Math.sqrt(da * db) : 0;
    }

    // Build HTML table
    const shortName = t => t.replace(/\.[A-Z]+$/,'').slice(0,6);
    let html = '<table class="corr-table"><tr><th></th>';
    tickers.forEach(t => html += '<th>' + shortName(t) + '</th>');
    html += '</tr>';
    tickers.forEach((t1, i) => {
      html += '<tr><th>' + shortName(t1) + '</th>';
      tickers.forEach((t2, j) => {
        const corr = i === j ? 1 : pearson(returns[t1] || [], returns[t2] || []);
        const v = corr.toFixed(2);
        // Color: green for positive, red for negative, intensity by magnitude
        const abs = Math.abs(corr);
        const bg = corr >= 0
          ? 'rgba(0,224,158,' + (abs * 0.4) + ')'
          : 'rgba(255,77,106,' + (abs * 0.4) + ')';
        html += '<td class="corr-cell" style="background:' + bg + '">' + v + '</td>';
      });
      html += '</tr>';
    });
    html += '</table>';
    wrap.innerHTML = html;
  } catch(e) {
    wrap.innerHTML = '<div style="color:var(--text3);font-size:12px;text-align:center;padding:32px 0">Erreur lors du calcul.</div>';
  }
}

// ═══════════════════════════════════════════════════
// FEATURE: BENCHMARK COMPARISON
// ═══════════════════════════════════════════════════
let chartBenchmark = null;
async function renderBenchmarkChart() {
  const data = getPortfolio(currentUser);
  if (!data.length) return;
  const benchTicker = document.getElementById('benchmark-select').value;
  const sub = document.getElementById('benchmark-sub');
  sub.textContent = 'Chargement…';
  const ctx = document.getElementById('chart-benchmark').getContext('2d');
  if (chartBenchmark) chartBenchmark.destroy();

  try {
    // Fetch benchmark 1y
    const bRaw = await fetchWithFallback('https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(benchTicker) + '?interval=1wk&range=1y');
    const bd = JSON.parse(bRaw);
    const bRes = bd.chart.result[0];
    const bTs = bRes.timestamp;
    const bCloses = bRes.indicators.quote[0].close;

    // Fetch portfolio history 1y
    const now = Math.floor(Date.now() / 1000);
    const start = now - 365 * 86400;
    const portfolio = await buildPortfolioHistory(data, start, now);

    // Normalize both to % change from start
    const bStart = bCloses.find(v => v != null);
    const benchNorm = bTs.map((t, i) => ({
      ts: t,
      val: bCloses[i] != null && bStart ? ((bCloses[i] / bStart - 1) * 100) : null
    })).filter(p => p.val !== null);

    const pStart = portfolio.length ? portfolio[0].valeurTotale : 1;
    const portNorm = portfolio.map(p => ({
      ts: p.ts,
      val: pStart > 0 ? ((p.valeurTotale / pStart - 1) * 100) : 0
    }));

    // Align on benchmark timestamps
    const labels = benchNorm.map(p => {
      const dt = new Date(p.ts * 1000);
      return dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    });

    // For portfolio, find closest value for each benchmark timestamp
    const portValues = benchNorm.map(bp => {
      const closest = portNorm.reduce((best, pp) => Math.abs(pp.ts - bp.ts) < Math.abs(best.ts - bp.ts) ? pp : best, portNorm[0] || {ts:0,val:0});
      return closest ? closest.val : null;
    });

    const benchLast = benchNorm[benchNorm.length-1]?.val || 0;
    const portLast = portValues[portValues.length-1] || 0;
    const benchName = {'%5EGSPC':'S&P 500','%5EFCHI':'CAC 40','%5ESTOXX50E':'Euro Stoxx 50','^GSPC':'S&P 500','^FCHI':'CAC 40','^STOXX50E':'Euro Stoxx 50'}[benchTicker] || benchTicker;
    sub.textContent = 'Portefeuille ' + (portLast >= 0 ? '+' : '') + portLast.toFixed(1) + '% vs ' + benchName + ' ' + (benchLast >= 0 ? '+' : '') + benchLast.toFixed(1) + '% sur 1 an';

    chartBenchmark = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Portefeuille', data: portValues,
            borderColor: '#7c6df5', borderWidth: 2, pointRadius: 0, tension: 0.2, fill: false,
          },
          {
            label: benchName, data: benchNorm.map(p => p.val),
            borderColor: '#5b8dee', borderWidth: 2, pointRadius: 0, tension: 0.2, borderDash: [5,3], fill: false,
          }
        ]
      },
      options: {
        responsive: true, interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: '#8892a8', font: { family: 'JetBrains Mono', size: 11 }, padding: 14 } },
          tooltip: { backgroundColor: '#10121c', borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, titleColor: '#8892a8', bodyColor: '#edf0f7', padding: 12, cornerRadius: 8, callbacks: { label: ctx => ' ' + ctx.dataset.label + ': ' + (ctx.parsed.y >= 0 ? '+' : '') + ctx.parsed.y.toFixed(2) + '%' } }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#495068', font: { family: 'JetBrains Mono', size: 10 }, maxTicksLimit: 10 }, border: { color: 'rgba(255,255,255,0.04)' } },
          y: { position: 'right', grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#8892a8', font: { family: 'JetBrains Mono', size: 10 }, callback: v => (v >= 0 ? '+' : '') + v + '%' }, border: { color: 'rgba(255,255,255,0.04)' } }
        }
      }
    });
  } catch(e) {
    sub.textContent = 'Données indisponibles.';
    console.error('Benchmark error:', e);
  }
}

// ═══════════════════════════════════════════════════
// FEATURE: PORTFOLIO BETA + VOLATILITY + DIVIDENDS
// ═══════════════════════════════════════════════════
async function computePortfolioIntel(data) {
  if (!data.length) return;
  const totalVal = data.reduce((s, r) => s + r.qty * r.currentPrice, 0);

  // Fetch 3mo daily data for beta + volatility calculation
  const allReturns = {};
  let benchReturns = [];
  try {
    // Benchmark = CAC40
    const bRaw = await fetchWithFallback('https://query1.finance.yahoo.com/v8/finance/chart/%5EFCHI?interval=1d&range=3mo');
    const bd = JSON.parse(bRaw);
    const bc = bd.chart.result[0].indicators.quote[0].close.filter(v => v != null);
    for (let i = 1; i < bc.length; i++) benchReturns.push((bc[i] - bc[i-1]) / bc[i-1]);
  } catch(e) {}

  await Promise.all(data.map(async r => {
    try {
      const raw = await fetchWithFallback('https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(resolveToYahooTicker(r.ticker)) + '?interval=1d&range=3mo');
      const d = JSON.parse(raw);
      const closes = d.chart.result[0].indicators.quote[0].close.filter(v => v != null);
      const rets = [];
      for (let i = 1; i < closes.length; i++) rets.push((closes[i] - closes[i-1]) / closes[i-1]);
      allReturns[r.ticker] = rets;
    } catch(e) { allReturns[r.ticker] = []; }
  }));

  // Weighted portfolio returns
  const n = benchReturns.length;
  if (n > 5) {
    const weights = data.map(r => (r.qty * r.currentPrice) / totalVal);
    const portReturns = [];
    for (let i = 0; i < n; i++) {
      let pr = 0;
      data.forEach((r, j) => {
        const rets = allReturns[r.ticker] || [];
        pr += (rets[i] || 0) * weights[j];
      });
      portReturns.push(pr);
    }

    // Beta = Cov(port, bench) / Var(bench)
    const mb = benchReturns.slice(0,n).reduce((s,v)=>s+v,0)/n;
    const mp = portReturns.reduce((s,v)=>s+v,0)/n;
    let cov = 0, varB = 0;
    for (let i = 0; i < n; i++) {
      cov += (portReturns[i] - mp) * (benchReturns[i] - mb);
      varB += (benchReturns[i] - mb) ** 2;
    }
    const beta = varB ? (cov / varB) : 1;

    // Volatility = annualized std dev of daily portfolio returns
    const varP = portReturns.reduce((s,v) => s + (v - mp) ** 2, 0) / n;
    const vol = Math.sqrt(varP) * Math.sqrt(252) * 100;

    document.getElementById('intel-beta').textContent = beta.toFixed(2);
    document.getElementById('intel-beta-sub').textContent = beta < 0.8 ? 'Défensif' : beta > 1.2 ? 'Agressif' : 'Neutre';
    document.getElementById('intel-beta-sub').style.color = beta < 0.8 ? 'var(--positive)' : beta > 1.2 ? 'var(--negative)' : 'var(--gold)';
    document.getElementById('intel-vol').textContent = vol.toFixed(1) + '%';
  }

  // Dividends
  let totalDivYield = 0;
  let totalDivAmount = 0;
  const divCards = [];
  data.forEach(r => {
    const yld = r.dividendYield || 0;
    const val = r.qty * r.currentPrice;
    const amount = val * yld;
    totalDivYield += yld * (val / totalVal);
    totalDivAmount += amount;
    if (yld > 0) {
      divCards.push({ name: r.name || r.ticker, ticker: r.ticker, yield: yld, amount });
    }
  });

  document.getElementById('intel-div-yield').textContent = (totalDivYield * 100).toFixed(2) + '%';
  document.getElementById('intel-div-sub').textContent = 'Moy. pondérée : ' + (totalDivYield * 100).toFixed(2) + '%';
  document.getElementById('intel-div-total').textContent = totalDivAmount.toFixed(2) + ' €';

  // Dividend cards
  const divGrid = document.getElementById('div-grid');
  if (divCards.length) {
    divGrid.innerHTML = divCards.map(d =>
      '<div class="div-card"><div class="div-ticker">' + d.name + '</div>' +
      '<div class="div-yield">' + (d.yield * 100).toFixed(2) + '%</div>' +
      '<div class="div-amount">~' + d.amount.toFixed(2) + ' €/an</div></div>'
    ).join('');
  } else {
    divGrid.innerHTML = '<div style="color:var(--text3);font-size:12px;grid-column:1/-1;text-align:center;padding:24px 0">Aucun dividende détecté</div>';
  }
}

// Patch initCharts to include new charts
const _origInitCharts = initCharts;
initCharts = function() {
  _origInitCharts();
  const data = getPortfolio(currentUser);
  if (data.length) {
    renderSectorChart(data);
    renderCorrelationMatrix(data);
    renderBenchmarkChart();
    computePortfolioIntel(data);
  }
};

function downloadHTML() {
  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'index.html';
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════
// ANIMATION: COUNT UP (ODOMETER)
// ═══════════════════════════════════════════════════
function countUp(el, target, duration, prefix, suffix) {
  prefix = prefix || '';
  suffix = suffix || '';
  const start = 0;
  const startTime = performance.now();
  const isNeg = target < 0;
  const absTarget = Math.abs(target);

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (absTarget - start) * eased;
    el.textContent = prefix + (isNeg ? '-' : '') + current.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Apply countUp to stat cards after render
function animateStatCards() {
  const totalEl = document.getElementById('stat-total');
  const invEl = document.getElementById('stat-invested');
  const pnlEl = document.getElementById('stat-pnl');

  const data = getPortfolio(currentUser);
  if (!data.length) return;

  let totalVal = 0, totalInv = 0;
  data.forEach(r => { totalVal += r.qty * r.currentPrice; totalInv += r.qty * r.buyPrice; });
  const pnl = totalVal - totalInv;

  countUp(totalEl, totalVal, 800, '', ' €');
  countUp(invEl, totalInv, 800, '', ' €');
  countUp(pnlEl, Math.abs(pnl), 800, pnl >= 0 ? '+' : '-', ' €');
}

// ═══════════════════════════════════════════════════
// ANIMATION: PROGRESSIVE RADAR CHART
// ═══════════════════════════════════════════════════
function drawRadarAnimated(axes, duration) {
  duration = duration || 800;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    // Create animated axes with scaled scores
    const animAxes = axes.map(a => ({ ...a, score: a.score * eased }));
    drawRadarChart(animAxes);

    if (progress < 1) requestAnimationFrame(tick);
    else drawRadarChart(axes); // Final exact render
  }
  requestAnimationFrame(tick);
}

// ═══════════════════════════════════════════════════
// ANIMATION: BADGE PULSE ON REFRESH
// ═══════════════════════════════════════════════════
function pulseBadges() {
  document.querySelectorAll('.badge-pos, .badge-neg').forEach(el => {
    el.classList.remove('badge-pulse');
    void el.offsetWidth; // Force reflow
    el.classList.add('badge-pulse');
  });
}

// ═══════════════════════════════════════════════════
// ANIMATION: 3D TILT ON MOUSE MOVE (stat cards)
// ═══════════════════════════════════════════════════
function initTiltCards() {
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'translateY(-3px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 6) + 'deg)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ═══════════════════════════════════════════════════
// FEATURE 1: LIGHT/DARK TOGGLE
// ═══════════════════════════════════════════════════
function toggleTheme() {
  const el = document.documentElement;
  const isLight = el.getAttribute('data-theme') === 'light';
  el.setAttribute('data-theme', isLight ? 'dark' : 'light');
  document.getElementById('toggle-theme').classList.toggle('on', !isLight);
  try { localStorage.setItem('pea_theme', isLight ? 'dark' : 'light'); } catch(e){}
}
// Restore on load
(function(){
  try {
    const t = localStorage.getItem('pea_theme');
    if (t === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      setTimeout(() => { const el = document.getElementById('toggle-theme'); if(el) el.classList.add('on'); }, 0);
    }
  } catch(e){}
})();

// ═══════════════════════════════════════════════════
// FEATURE 2: COLOR THEME
// ═══════════════════════════════════════════════════
function setColorTheme(color) {
  document.documentElement.setAttribute('data-color', color === 'violet' ? '' : color);
  if (color === 'violet') document.documentElement.removeAttribute('data-color');
  document.querySelectorAll('.color-dot').forEach(d => d.classList.toggle('active', d.dataset.c === color));
  try { localStorage.setItem('pea_color', color); } catch(e){}
}
(function(){
  try {
    const c = localStorage.getItem('pea_color');
    if (c && c !== 'violet') {
      document.documentElement.setAttribute('data-color', c);
      setTimeout(() => {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.toggle('active', d.dataset.c === c));
      }, 0);
    }
  } catch(e){}
})();

// ═══════════════════════════════════════════════════
// FEATURE 3: SPARKLINES
// ═══════════════════════════════════════════════════
function drawSparkline(canvasId, data, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !data || data.length < 2) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.parentElement.offsetWidth;
  const h = 32;
  canvas.width = w; canvas.height = h;
  ctx.clearRect(0, 0, w, h);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  data.forEach((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Fill gradient below
  const lastX = w;
  const lastY = h - ((data[data.length-1] - min) / range) * (h - 4) - 2;
  ctx.lineTo(lastX, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, color.replace(')', ',0.15)').replace('rgb', 'rgba'));
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fill();
}

// Sparkline data is generated from portfolio history
let sparkData = { total: [], invested: [], pnl: [] };
function updateSparklines() {
  const pos = getComputedStyle(document.documentElement).getPropertyValue('--positive').trim();
  const acc = getComputedStyle(document.documentElement).getPropertyValue('--accent2').trim();
  drawSparkline('spark-total', sparkData.total, pos || '#00e09e');
  drawSparkline('spark-invested', sparkData.invested, acc || '#5b8dee');
  const pnlColor = sparkData.pnl.length && sparkData.pnl[sparkData.pnl.length-1] >= 0 ? (pos || '#00e09e') : '#ff4d6a';
  drawSparkline('spark-pnl', sparkData.pnl, pnlColor);
}
// Generate fake sparkline data from random walk (until real history is available)
function generateSparkData(finalVal, points) {
  if (!finalVal || finalVal <= 0) return [];
  const data = [finalVal * (0.85 + Math.random() * 0.1)];
  for (let i = 1; i < points; i++) {
    data.push(data[i-1] * (0.98 + Math.random() * 0.04));
  }
  data[points - 1] = finalVal;
  return data;
}

// ═══════════════════════════════════════════════════
// FEATURE 4: SEARCH / FILTER TABLE
// ═══════════════════════════════════════════════════
function filterTable() {
  const q = (document.getElementById('table-search').value || '').toLowerCase();
  const rows = document.querySelectorAll('#portfolio-tbody tr');
  rows.forEach(tr => {
    const text = tr.textContent.toLowerCase();
    tr.style.display = text.includes(q) ? '' : 'none';
  });
}

// ═══════════════════════════════════════════════════
// FEATURE 5: SORT TABLE
// ═══════════════════════════════════════════════════
function sortTable() {
  const key = document.getElementById('table-sort').value;
  if (!key) { renderPortfolio(); return; }
  const data = getPortfolio(currentUser);
  const sorted = [...data];
  sorted.sort((a, b) => {
    switch(key) {
      case 'name-asc':  return (a.name || a.ticker).localeCompare(b.name || b.ticker);
      case 'name-desc': return (b.name || b.ticker).localeCompare(a.name || a.ticker);
      case 'val-desc':  return (b.qty * b.currentPrice) - (a.qty * a.currentPrice);
      case 'val-asc':   return (a.qty * a.currentPrice) - (b.qty * b.currentPrice);
      case 'perf-desc': return ((b.currentPrice-b.buyPrice)/b.buyPrice) - ((a.currentPrice-a.buyPrice)/a.buyPrice);
      case 'perf-asc':  return ((a.currentPrice-a.buyPrice)/a.buyPrice) - ((b.currentPrice-b.buyPrice)/b.buyPrice);
      default: return 0;
    }
  });
  // Temporarily replace, render, restore
  savePortfolio(currentUser, sorted);
  renderPortfolio();
}

// ═══════════════════════════════════════════════════
// FEATURE 6: EXPORT CSV
// ═══════════════════════════════════════════════════
function exportCSV() {
  const data = getPortfolio(currentUser);
  if (!data.length) { alert('Portefeuille vide.'); return; }
  const header = 'Action,Ticker,Quantité,Prix Achat,Prix Actuel,Valeur,+/- Value,% Perf\n';
  const rows = data.map(r => {
    const val = r.qty * r.currentPrice;
    const inv = r.qty * r.buyPrice;
    const pnl = val - inv;
    const pct = inv > 0 ? (pnl / inv * 100).toFixed(2) : '0';
    return [r.name, r.ticker, r.qty, r.buyPrice.toFixed(2), r.currentPrice.toFixed(2), val.toFixed(2), pnl.toFixed(2), pct].join(',');
  }).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'portefeuille_' + currentUser + '.csv';
  a.click(); URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════
// FEATURE 7: AUTO-REFRESH (60s)
// ═══════════════════════════════════════════════════
let autoRefreshInterval = null;
function toggleAutoRefresh() {
  const btn = document.getElementById('btn-auto-refresh');
  const badge = document.getElementById('refresh-badge');
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
    btn.classList.remove('active');
    badge.style.display = 'none';
  } else {
    autoRefreshInterval = setInterval(refreshPrices, 60000);
    btn.classList.add('active');
    badge.style.display = 'inline-flex';
    refreshPrices(); // immediate first refresh
  }
}

async function refreshPrices() {
  if (!currentUser) return;
  const data = getPortfolio(currentUser);
  if (!data.length) return;
  let changed = false;
  await Promise.all(data.map(async (row) => {
    try {
      const yahooTicker = resolveToYahooTicker(row.ticker);
      const url = 'https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(yahooTicker) + '?interval=1d&range=1d';
      const raw = await fetchWithFallback(url);
      const d = JSON.parse(raw);
      const res = d.chart && d.chart.result && d.chart.result[0];
      if (res && res.meta && res.meta.regularMarketPrice) {
        row.currentPrice = res.meta.regularMarketPrice;
        const prev = res.meta.chartPreviousClose || res.meta.previousClose || row.currentPrice;
        row.changePct = prev ? ((row.currentPrice - prev) / prev * 100) : 0;
        changed = true;
      }
    } catch(e) {}
  }));
  if (changed) {
    savePortfolio(currentUser, data);
    renderPortfolio();
    setTimeout(pulseBadges, 200);
    const d = new Date();
    document.getElementById('portfolio-date').textContent =
      'Mis à jour à ' + d.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  }
}

// ═══════════════════════════════════════════════════
// FEATURE 8: DRAG & DROP REORDER
// ═══════════════════════════════════════════════════
let dragSrcIdx = null;

function onDragStart(e, idx) {
  dragSrcIdx = idx;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', idx);
}
function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  document.querySelectorAll('#portfolio-tbody tr').forEach(tr => tr.classList.remove('drag-over'));
}
function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const tr = e.currentTarget;
  document.querySelectorAll('#portfolio-tbody tr').forEach(r => r.classList.remove('drag-over'));
  tr.classList.add('drag-over');
}
function onDrop(e, targetIdx) {
  e.preventDefault();
  document.querySelectorAll('#portfolio-tbody tr').forEach(tr => tr.classList.remove('drag-over'));
  if (dragSrcIdx === null || dragSrcIdx === targetIdx) return;
  const data = getPortfolio(currentUser);
  const [moved] = data.splice(dragSrcIdx, 1);
  data.splice(targetIdx, 0, moved);
  savePortfolio(currentUser, data);
  dragSrcIdx = null;
  renderPortfolio();
}

// ═══════════════════════════════════════════════════
// FEATURE 9: WATCHLIST
// ═══════════════════════════════════════════════════
// getWatchlist/saveWatchlist → Firestore (définis dans couche données)

let wlTimer = null, wlFoundTicker = null, wlFoundName = null, wlFoundPrice = null;

function openWatchlistModal() {
  document.getElementById('watchlist-modal-overlay').classList.add('open');
  document.getElementById('wl-ticker').value = '';
  document.getElementById('wl-result').classList.remove('visible');
  document.getElementById('wl-status').innerHTML = '';
  document.getElementById('btn-wl-confirm').disabled = true;
  wlFoundTicker = null; wlFoundName = null; wlFoundPrice = null;
  setTimeout(() => document.getElementById('wl-ticker').focus(), 100);
}
function closeWatchlistModal() {
  document.getElementById('watchlist-modal-overlay').classList.remove('open');
}
function onWlInput() {
  clearTimeout(wlTimer);
  const val = document.getElementById('wl-ticker').value.trim();
  document.getElementById('wl-result').classList.remove('visible');
  document.getElementById('btn-wl-confirm').disabled = true;
  wlFoundPrice = null;
  if (val.length < 2) { document.getElementById('wl-status').innerHTML = ''; return; }
  document.getElementById('wl-status').innerHTML = '<div class="status-loading"><span class="loading-spinner"></span> Recherche…</div>';
  wlTimer = setTimeout(async () => {
    try {
      const localETF = searchETFLocal(val);
      let best;
      if (localETF) { best = { symbol: localETF.ticker, longname: localETF.name }; }
      else {
        const url = 'https://query1.finance.yahoo.com/v1/finance/search?q=' + encodeURIComponent(val) + '&lang=fr&region=FR&quotesCount=6&newsCount=0';
        const raw = await fetchWithFallback(url);
        const sd = JSON.parse(raw);
        const quotes = (sd.quotes || []).filter(q => q.quoteType === 'EQUITY' || q.quoteType === 'ETF' || q.quoteType === 'MUTUALFUND');
        if (!quotes.length) throw new Error('Introuvable.');
        best = quotes[0];
      }
      const cUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(best.symbol) + '?interval=1d&range=5d';
      const cRaw = await fetchWithFallback(cUrl);
      const cd = JSON.parse(cRaw);
      const res = cd.chart && cd.chart.result && cd.chart.result[0];
      if (!res) throw new Error('Cours non disponible.');
      const meta = res.meta;
      wlFoundPrice = meta.regularMarketPrice;
      wlFoundName = best.longname || best.shortname || best.symbol;
      wlFoundTicker = best.symbol;
      const prev = meta.chartPreviousClose || meta.previousClose || wlFoundPrice;
      const pct = prev ? ((wlFoundPrice - prev) / prev * 100) : 0;
      document.getElementById('wl-res-name').textContent = wlFoundName;
      document.getElementById('wl-res-price').textContent = wlFoundPrice.toFixed(2) + ' ' + (meta.currency || '');
      document.getElementById('wl-res-info').textContent = best.symbol + ' · ' + (pct >= 0 ? '▲' : '▼') + ' ' + Math.abs(pct).toFixed(2) + '%';
      document.getElementById('wl-status').innerHTML = '';
      document.getElementById('wl-result').classList.add('visible');
      document.getElementById('btn-wl-confirm').disabled = false;
    } catch(err) {
      document.getElementById('wl-status').innerHTML = '<div class="status-error">⚠ ' + (err.message || 'Erreur') + '</div>';
    }
  }, 700);
}
function confirmWatchlistAdd() {
  if (!wlFoundTicker || !wlFoundPrice) return;
  const wl = getWatchlist(currentUser);
  if (wl.find(w => w.ticker === wlFoundTicker)) { alert('Déjà dans la watchlist.'); return; }
  wl.push({ name: wlFoundName, ticker: wlFoundTicker, price: wlFoundPrice, addedAt: new Date().toISOString() });
  saveWatchlist(currentUser, wl);
  closeWatchlistModal();
  renderWatchlist();
}
function removeFromWatchlist(i) {
  const wl = getWatchlist(currentUser);
  wl.splice(i, 1);
  saveWatchlist(currentUser, wl);
  renderWatchlist();
}
function renderWatchlist() {
  const wl = getWatchlist(currentUser);
  const tbody = document.getElementById('watchlist-tbody');
  const empty = document.getElementById('watchlist-empty');
  if (!wl.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  tbody.innerHTML = wl.map((w, i) => {
    return '<tr><td><div class="ticker-cell">' + logoHtml(w.ticker, 26, 'ticker-icon') +
      '<div><div class="ticker-name">' + (w.name || w.ticker) + '</div>' +
      '<div class="ticker-sym">' + w.ticker + '</div></div></div></td>' +
      '<td class="mono">' + (w.price ? w.price.toFixed(2) + ' €' : '—') + '</td>' +
      '<td class="mono" style="color:var(--text2)">—</td>' +
      '<td><button class="btn-del" onclick="removeFromWatchlist(' + i + ')" title="Retirer">✕</button></td></tr>';
  }).join('');
}

// ═══════════════════════════════════════════════════
// PATCH: renderPortfolio with stagger + drag handles
// ═══════════════════════════════════════════════════
const _origRenderPortfolio = renderPortfolio;
renderPortfolio = function() {
  _origRenderPortfolio();
  // Add stagger animations
  const rows = document.querySelectorAll('#portfolio-tbody tr');
  rows.forEach((tr, i) => {
    tr.classList.add('stagger-row');
    tr.style.animationDelay = (i * 0.04) + 's';
    // Add drag handle
    tr.setAttribute('draggable', 'true');
    tr.addEventListener('dragstart', e => onDragStart(e, i));
    tr.addEventListener('dragend', onDragEnd);
    tr.addEventListener('dragover', onDragOver);
    tr.addEventListener('drop', e => onDrop(e, i));
    // Prepend drag handle to first cell
    const firstTd = tr.querySelector('td');
    if (firstTd && !firstTd.querySelector('.drag-handle')) {
      const handle = document.createElement('span');
      handle.className = 'drag-handle';
      handle.textContent = '⠿';
      firstTd.querySelector('.ticker-cell').prepend(handle);
    }
  });
  // Update sparklines
  const data = getPortfolio(currentUser);
  let totalVal = 0, totalInv = 0;
  data.forEach(r => { totalVal += r.qty * r.currentPrice; totalInv += r.qty * r.buyPrice; });
  sparkData.total = generateSparkData(totalVal, 20);
  sparkData.invested = generateSparkData(totalInv, 20);
  sparkData.pnl = generateSparkData(totalVal - totalInv, 20);
  setTimeout(updateSparklines, 50);
  // Keep filter
  filterTable();
  // Trigger animations
  setTimeout(() => {
    animateStatCards();
    initTiltCards();
  }, 60);
};

// Initialize watchlist on page show
const _origShowPage = showPage;
showPage = function(id) {
  _origShowPage(id);
  if (id === 'watchlist') renderWatchlist();
};
const _origShowPageMobile = showPageMobile;
showPageMobile = function(id) {
  _origShowPageMobile(id);
  if (id === 'watchlist') renderWatchlist();
};
// ═══════════════════════════════════════════════════
//  BASE 100
// ═══════════════════════════════════════════════════
const B100_COLORS = ['#7c6df5','#f5b731','#00e09e','#ff4d6a','#5b8dee'];

// ── Prix mensuels historiques (clôture fin de mois) ──────────────────────────
// ESEE  = BNP Easy S&P 500 (ESE.PA)           FR0013311273
// PUST  = Amundi PEA Nasdaq 100 (PANX.PA)     FR0013412285  (ex-PUST, ticker utilisateur)
// WPEA  = Invesco MSCI World PEA (WPEA.PA)    IE0002XZSHO1
// PAEEM = Amundi PEA MSCI Emerging ESG (PAEEM.PA) FR0013412020
// ESE50 = BNP Easy Euro Stoxx 50 Cap (ESE.PA) FR0012739431  — ticker Euronext : EESE.PA / ESG50
const B100_PRICES = {
  ESEE:  {'2025-02':29.93,'2025-03':29.10,'2025-04':28.50,'2025-05':29.00,'2025-06':29.20,'2025-07':29.40,'2025-08':29.10,'2025-09':28.90,'2025-10':29.30,'2025-11':29.50,'2025-12':29.20,'2026-01':29.40,'2026-02':29.10,'2026-03':29.30},
  PUST:  {'2025-02':72.40,'2025-03':69.80,'2025-04':67.50,'2025-05':70.20,'2025-06':72.10,'2025-07':74.50,'2025-08':73.20,'2025-09':71.80,'2025-10':75.30,'2025-11':78.60,'2025-12':76.90,'2026-01':79.40,'2026-02':87.28,'2026-03':85.14},
  WPEA:  {'2025-02':5.33,'2025-03':5.86,'2025-04':5.394,'2025-05':5.22,'2025-06':5.421,'2025-07':5.508,'2025-08':5.648,'2025-09':5.744,'2025-10':5.95,'2025-11':6.168,'2025-12':6.10,'2026-01':6.145,'2026-02':6.18,'2026-03':6.202},
  PAEEM: {'2025-02':24.60,'2025-03':25.10,'2025-04':24.80,'2025-05':25.40,'2025-06':25.90,'2025-07':26.30,'2025-08':25.70,'2025-09':26.10,'2025-10':26.80,'2025-11':27.20,'2025-12':26.90,'2026-01':27.60,'2026-02':28.10,'2026-03':27.80},
  ESE50: {'2025-02':51.20,'2025-03':52.40,'2025-04':50.80,'2025-05':52.10,'2025-06':53.40,'2025-07':54.20,'2025-08':53.10,'2025-09':52.60,'2025-10':53.80,'2025-11':54.90,'2025-12':54.10,'2026-01':55.60,'2026-02':56.20,'2026-03':55.40},
};

// Cours actuels (mars 2026)
const B100_CURRENT = { ESEE:29.52, PUST:85.73, WPEA:6.14, PAEEM:27.95, ESE50:55.80 };
const B100_NAMES   = {
  ESEE:  'S&P 500 (ESEE)',
  PUST:  'Nasdaq 100 (PUST)',
  WPEA:  'MSCI World (WPEA)',
  PAEEM: 'MSCI Emerging ESG (PAEEM)',
  ESE50: 'Euro Stoxx 50 Cap (ESE50)',
};

let chartBase100 = null;

function getMonths(from, to) {
  const months = [];
  let d = new Date(from + '-01');
  const end = new Date(to + '-01');
  while (d <= end) {
    months.push(d.toISOString().slice(0,7));
    d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  }
  return months;
}

function initBase100() {
  const months = getMonths('2025-02', '2026-03');
  const livretMonthly = 0.025 / 12;
  const livretData = months.map((_, i) => parseFloat((100 * Math.pow(1 + livretMonthly, i)).toFixed(3)));

  const tickers = Object.keys(B100_PRICES);
  const datasets = [];

  tickers.forEach((t, i) => {
    const ph = B100_PRICES[t];
    const keys = Object.keys(ph).sort();
    if (!keys.length) return;
    const firstKey = keys[0];
    const firstPrice = ph[firstKey];

    const data = months.map(m => {
      if (m < firstKey) return null;
      const known = keys.filter(k => k <= m);
      if (!known.length) return null;
      const lastKey = known[known.length - 1];
      const price = (lastKey === keys[keys.length - 1] && B100_CURRENT[t]) ? B100_CURRENT[t] : ph[lastKey];
      return parseFloat(((price / firstPrice) * 100).toFixed(2));
    });

    datasets.push({
      label: t,
      data,
      borderColor: B100_COLORS[i % B100_COLORS.length],
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.3,
      spanGaps: false,
    });
  });

  // Livret A dataset
  datasets.unshift({
    label: 'Livret A',
    data: livretData,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderDash: [4, 3],
    pointRadius: 0,
    tension: 0.2,
  });

  const ctx = document.getElementById('chart-base100');
  if (!ctx) return;
  if (chartBase100) { chartBase100.destroy(); chartBase100 = null; }

  chartBase100 = new Chart(ctx, {
    type: 'line',
    data: { labels: months, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#12141f',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#8892a8',
          bodyColor: '#edf0f7',
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y !== null ? ctx.parsed.y.toFixed(1) : '—'}`,
          }
        }
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#495068', font: { size: 10 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#495068', font: { size: 10 } },
          afterDataLimits: axis => { axis.min = Math.min(axis.min, 95); }
        }
      },
      annotation: {},
    }
  });

  // Custom legend
  const legend = document.getElementById('b100-legend');
  if (legend) {
    legend.innerHTML = tickers.map((t, i) =>
      `<div style="display:flex;align-items:center;gap:5px">
        <span style="width:14px;height:3px;background:${B100_COLORS[i % B100_COLORS.length]};display:inline-block;border-radius:2px"></span>
        <span style="color:var(--text2)">${t}</span>
      </div>`
    ).join('');
  }

  // Table
  const tbody = document.getElementById('b100-tbody');
  if (!tbody) return;
  const livretNow = parseFloat((100 * Math.pow(1 + 0.025 / 12, months.length - 1)).toFixed(2));

  tbody.innerHTML = tickers.map((t, i) => {
    const ph = B100_PRICES[t];
    const keys = Object.keys(ph).sort();
    if (!keys.length) return '';
    const firstPrice = ph[keys[0]];
    const currentPrice = B100_CURRENT[t] || ph[keys[keys.length - 1]];
    const base100Now = parseFloat(((currentPrice / firstPrice) * 100).toFixed(2));
    const perf = ((currentPrice / firstPrice - 1) * 100);
    const vsLA = (base100Now - livretNow);
    const isPos = perf >= 0;
    const vPos = vsLA >= 0;
    return `<tr>
      <td><div style="display:flex;align-items:center;gap:8px">
        <span style="width:10px;height:10px;border-radius:50%;background:${B100_COLORS[i % B100_COLORS.length]};display:inline-block"></span>
        <span style="font-size:12px">${B100_NAMES[t]}</span>
      </div></td>
      <td class="mono" style="font-size:12px">${firstPrice.toFixed(3)} €</td>
      <td class="mono" style="font-size:12px">${currentPrice.toFixed(2)} €</td>
      <td class="mono" style="font-size:13px;font-weight:600">${base100Now.toFixed(1)}</td>
      <td><span class="${isPos ? 'badge-pos' : 'badge-neg'}">${isPos ? '▲' : '▼'} ${Math.abs(perf).toFixed(2)}%</span></td>
      <td class="mono" style="font-size:12px;color:${vPos ? 'var(--positive)' : 'var(--negative)'}">${vPos ? '+' : ''}${vsLA.toFixed(1)} pts</td>
    </tr>`;
  }).join('');
}

// ═══════════════════════════════════════════════════
//  PROJECTIONS
// ═══════════════════════════════════════════════════
let chartProj = null;

function calcProjections(base, monthly, cagrPct) {
  const mr = cagrPct / 100 / 12;
  const livretMr = 0.025 / 12;
  return [1, 5, 10, 15, 20, 25, 30, 35, 40].map(y => {
    const n = y * 12;
    const grown = base * Math.pow(1 + cagrPct / 100, y);
    const contrib = mr > 0 ? monthly * (Math.pow(1 + mr, n) - 1) / mr : monthly * n;
    const total = parseFloat((grown + contrib).toFixed(2));
    const apports = parseFloat((base + monthly * n).toFixed(2));
    const plusValues = parseFloat((total - apports).toFixed(2));
    const livretGrown = base * Math.pow(1 + 0.025, y);
    const livretContrib = livretMr > 0 ? monthly * (Math.pow(1 + livretMr, n) - 1) / livretMr : monthly * n;
    const livretA = parseFloat((livretGrown + livretContrib).toFixed(2));
    return { years: y, total, apports, plusValues, livretA };
  });
}

function fmtCompact(n) {
  const a = Math.abs(n);
  if (a >= 1e6) return (n / 1e6).toFixed(2) + ' M€';
  if (a >= 1e3) return (n / 1e3).toFixed(1) + ' k€';
  return n.toFixed(0) + ' €';
}

function renderProjections() {
  const base    = parseFloat(document.getElementById('proj-base')?.value) || 0;
  const monthly = parseFloat(document.getElementById('proj-monthly')?.value) || 0;
  const cagr    = parseFloat(document.getElementById('proj-cagr')?.value)    || 0;
  const data    = calcProjections(base, monthly, cagr);

  // Chart
  const ctx = document.getElementById('chart-projections');
  if (ctx) {
    if (chartProj) { chartProj.destroy(); chartProj = null; }
    chartProj = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.years + ' ans'),
        datasets: [
          { label: 'Patrimoine total', data: data.map(d => d.total),      borderColor: '#7c6df5', backgroundColor: 'rgba(124,109,245,0.08)', fill: true,  borderWidth: 2.5, pointRadius: 3, tension: 0.4 },
          { label: 'Apports cumulés', data: data.map(d => d.apports),    borderColor: '#f5b731', backgroundColor: 'transparent',               fill: false, borderWidth: 2,   pointRadius: 2, tension: 0.4, borderDash: [5,3] },
          { label: 'Plus-values',      data: data.map(d => d.plusValues), borderColor: '#00e09e', backgroundColor: 'transparent',               fill: false, borderWidth: 2,   pointRadius: 2, tension: 0.4 },
          { label: 'Livret A',         data: data.map(d => d.livretA),    borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'transparent', fill: false, borderWidth: 1.5, pointRadius: 0, tension: 0.4, borderDash: [3,2] },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: '#8892a8', font: { size: 11 } } },
          tooltip: {
            backgroundColor: '#12141f', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
            titleColor: '#8892a8', bodyColor: '#edf0f7',
            callbacks: { label: ctx => ` ${ctx.dataset.label}: ${fmtCompact(ctx.parsed.y)}` }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#495068', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#495068', font: { size: 10 }, callback: v => fmtCompact(v) } }
        }
      }
    });
  }

  // Table
  const tbody = document.getElementById('proj-tbody');
  if (!tbody) return;
  tbody.innerHTML = data.map((d, i) => {
    const avLA = (d.total - d.livretA);
    const ratioPct = d.apports > 0 ? Math.round(d.plusValues / d.apports * 100) : 0;
    return `<tr style="${i % 2 === 0 ? '' : 'background:var(--s2)'}">
      <td style="font-weight:700;color:var(--accent)">${d.years} ans</td>
      <td class="mono" style="font-weight:600">${fmtCompact(d.total)}</td>
      <td class="mono" style="color:var(--gold)">${fmtCompact(d.apports)}</td>
      <td class="mono" style="color:var(--positive);font-weight:600">${fmtCompact(d.plusValues)}</td>
      <td class="mono" style="color:var(--text2)">${ratioPct}%</td>
      <td class="mono" style="color:var(--text2)">${fmtCompact(d.livretA)}</td>
      <td class="mono" style="color:${avLA >= 0 ? 'var(--positive)' : 'var(--negative)'};font-weight:600">${avLA >= 0 ? '+' : ''}${fmtCompact(avLA)}</td>
    </tr>`;
  }).join('');
}

function initProjections() {
  // Pre-fill base with current portfolio value
  const pf = getPortfolio(currentUser);
  const totalVal = pf.reduce((s, r) => s + r.qty * r.currentPrice, 0);
  const el = document.getElementById('proj-base');
  if (el) el.value = totalVal.toFixed(2);
  renderProjections();
}

// ═══════════════════════════════════════════════════
//  BILAN ANNUEL — 100% dynamique depuis localStorage
// ═══════════════════════════════════════════════════
let chartBilan = null;

function computeBilanAnnuel() {
  const txs        = getTransactions(currentUser);
  const versements = getVersements(currentUser);
  const portfolio  = getPortfolio(currentUser);

  // Valeur actuelle totale des titres (cours live)
  const valeurActuelle = portfolio.reduce((s, r) => s + r.qty * r.currentPrice, 0);

  const years = {};

  // Versements par année
  versements.forEach(v => {
    if (!v.date) return;
    const y = new Date(v.date + 'T12:00:00').getFullYear();
    if (!years[y]) years[y] = { apport: 0, dividendes: 0, realizedPnl: 0, achats: 0, ventes: 0 };
    years[y].apport += v.amount;
  });

  // Si pas de versements, reconstruire depuis les achats
  if (!versements.length) {
    txs.filter(t => t.type === 'buy').forEach(t => {
      if (!t.date) return;
      const y = new Date(t.date + 'T12:00:00').getFullYear();
      if (!years[y]) years[y] = { apport: 0, dividendes: 0, realizedPnl: 0, achats: 0, ventes: 0 };
      years[y].apport += t.qty * t.price;
    });
  }

  // Achats, ventes, PnL réalisé, dividendes — par année
  txs.forEach(t => {
    if (!t.date) return;
    const y = new Date(t.date + 'T12:00:00').getFullYear();
    if (!years[y]) years[y] = { apport: 0, dividendes: 0, realizedPnl: 0, achats: 0, ventes: 0 };
    if (t.type === 'buy')  years[y].achats += t.qty * t.price;
    if (t.type === 'sell') {
      years[y].ventes += t.qty * t.price;
      if (t.realizedPnl != null) years[y].realizedPnl += t.realizedPnl;
    }
    if (t.type === 'dividend') years[y].dividendes += t.qty * t.price;
  });

  const sortedYears = Object.keys(years).map(Number).sort();
  const currentYear = new Date().getFullYear();

  let apportCumul       = 0;
  let achatsCumul       = 0;
  let ventesCumul       = 0;
  const LIVRET_A_RATE   = 0.025;

  return sortedYears.map(y => {
    const d      = years[y];
    const apport = d.apport;
    apportCumul += apport;
    achatsCumul += d.achats;
    ventesCumul += d.ventes;

    // Montant investi en titres à fin de cette année (cumulatif)
    const montantInvesti = Math.max(0, achatsCumul - ventesCumul);

    const apportCumulAvant = apportCumul - apport;
    const livretA = apportCumulAvant * (1 + LIVRET_A_RATE) + apport * (1 + LIVRET_A_RATE / 2);

    const isCurrentYear = (y === currentYear);

    // PV latente = valeur actuelle - montant investi cumulé jusqu'à cette année
    const pv      = montantInvesti > 0 ? valeurActuelle - montantInvesti : null;
    // Perf = PV latente / montant investi (comme Bourso)
    const perfPct = montantInvesti > 0 && pv !== null ? pv / montantInvesti : null;

    // Gains réalisés = uniquement ceux de cette année
    const realizedPnlAnnee = parseFloat(d.realizedPnl.toFixed(2));

    return {
      year:           y,
      label:          isCurrentYear ? y + ' YTD' : String(y),
      isYTD:          isCurrentYear,
      apport,                          // versements de l'année
      apportTotal:    apportCumul,     // versements cumulés
      montantInvesti,                  // achats - ventes cumulés jusqu'à cette année
      achatsAnnee:    d.achats,        // achats de l'année seulement
      ventesAnnee:    d.ventes,        // ventes de l'année seulement
      pv,                              // PV latente sur base investie cumulée
      perfPct,
      livretA:        parseFloat(livretA.toFixed(2)),
      realizedPnl:    realizedPnlAnnee, // PnL réalisé de l'année uniquement
      dividendes:     parseFloat(d.dividendes.toFixed(2)),
    };
  });
}

function initBilan() {
  const cards       = document.getElementById('bilan-cards');
  const data        = computeBilanAnnuel();
  const currentYear = new Date().getFullYear();

  if (!data.length) {
    if (cards) cards.innerHTML = '<div style="color:var(--text3);font-size:13px;padding:24px;text-align:center">Aucune donnée — ajoutez des transactions ou des versements.</div>';
    return;
  }

  // ── Cards ────────────────────────────────────────
  if (cards) {
    cards.innerHTML = data.map(y => {
      // Pour l'année en cours : valeur réelle vs Livret A
      // Pour les années passées : on compare les versements cumulés vs ce qu'aurait donné le Livret A
      const valeurPourLA = y.isYTD && y.pv !== null
        ? y.montantInvesti + y.pv   // valeur réelle du portefeuille
        : null;                      // pas de valeur historique disponible
      const avLA  = valeurPourLA !== null ? (valeurPourLA - y.livretA) : null;
      const avPos = avLA !== null && avLA >= 0;

      const rows = [
        { label: "Versements de l'année",    value: y.apport.toFixed(2) + ' €',        color: 'var(--text)' },
        { label: 'Versements cumulés',        value: y.apportTotal.toFixed(2) + ' €',   color: 'var(--text2)' },
        { label: 'Investi en titres (cumul)', value: y.montantInvesti.toFixed(2) + ' €', color: 'var(--text2)' },
        y.isYTD && y.pv !== null ? null : null,
        y.realizedPnl !== 0
          ? { label: 'Gains réalisés (' + y.year + ')', value: (y.realizedPnl >= 0 ? '+' : '') + y.realizedPnl.toFixed(2) + ' €', color: y.realizedPnl >= 0 ? 'var(--positive)' : 'var(--negative)' }
          : null,
        y.dividendes > 0
          ? { label: 'Dividendes reçus (' + y.year + ')', value: y.dividendes.toFixed(2) + ' €', color: 'var(--gold)' }
          : null,
      ].filter(Boolean);

      return `<div class="section-card">
        <div style="margin-bottom:14px">
          <div style="font-family:var(--display);font-size:20px;font-weight:700">${y.label}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:0">
          ${rows.map(row => `
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)">
            <span style="color:var(--text3);font-size:12px">${row.label}</span>
            <span style="color:${row.color};font-size:13px;font-weight:${row.bold ? 700 : 500};font-family:var(--mono)">${row.value}</span>
          </div>`).join('')}
        </div>
        <div style="margin-top:12px;background:var(--s3);border-radius:10px;padding:10px 14px;border:1px solid var(--border)">
          <div style="font-size:11px;color:var(--text3);font-weight:600;margin-bottom:8px">📊 vs Livret A 2,5%</div>
          ${(() => {
            if (y.isYTD && y.pv !== null) {
              // YTD : PV latente vs intérêts Livret A proratisés sur l'année en cours
              const now = new Date();
              const startOfYear = new Date(now.getFullYear(), 0, 1);
              const fractionAnnee = (now - startOfYear) / (365.25 * 24 * 3600 * 1000);
              const pvLivret   = y.montantInvesti * 0.025 * fractionAnnee;
              const avantage   = y.pv - pvLivret;
              const avantagePos = avantage >= 0;
              return '<div style="display:flex;justify-content:space-between;margin-bottom:6px">' +
                '<span style="color:var(--text2);font-size:12px">Ma plus-value latente</span>' +
                '<span style="font-family:var(--mono);font-size:13px;font-weight:700;color:' + (y.pv >= 0 ? 'var(--positive)' : 'var(--negative)') + '">' + (y.pv >= 0 ? '+' : '') + y.pv.toFixed(2) + ' €</span>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;margin-bottom:6px">' +
                '<span style="color:var(--text2);font-size:12px">PV Livret A équivalent</span>' +
                '<span style="font-family:var(--mono);font-size:12px;color:var(--text2)">+' + pvLivret.toFixed(2) + ' €</span>' +
              '</div>' +
              '<div style="height:1px;background:var(--border);margin:6px 0"></div>' +
              '<div style="display:flex;justify-content:space-between">' +
                '<span style="color:var(--text2);font-size:12px">Avantage portefeuille</span>' +
                '<span style="font-family:var(--mono);font-size:13px;font-weight:700;color:' + (avantagePos ? 'var(--positive)' : 'var(--negative)') + '">' + (avantagePos ? '+' : '') + avantage.toFixed(2) + ' €</span>' +
              '</div>';
            } else {
              // Années passées : gains réalisés vs intérêts Livret A sur l'année pleine
              const pvLivret   = y.montantInvesti * 0.025;
              const avantage   = y.realizedPnl - pvLivret;
              const avantagePos = avantage >= 0;
              return '<div style="display:flex;justify-content:space-between;margin-bottom:6px">' +
                '<span style="color:var(--text2);font-size:12px">Gains réalisés (' + y.year + ')</span>' +
                '<span style="font-family:var(--mono);font-size:13px;font-weight:700;color:' + (y.realizedPnl >= 0 ? 'var(--positive)' : 'var(--negative)') + '">' + (y.realizedPnl >= 0 ? '+' : '') + y.realizedPnl.toFixed(2) + ' €</span>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;margin-bottom:6px">' +
                '<span style="color:var(--text2);font-size:12px">PV Livret A équivalent</span>' +
                '<span style="font-family:var(--mono);font-size:12px;color:var(--text2)">+' + pvLivret.toFixed(2) + ' €</span>' +
              '</div>' +
              '<div style="height:1px;background:var(--border);margin:6px 0"></div>' +
              '<div style="display:flex;justify-content:space-between">' +
                '<span style="color:var(--text2);font-size:12px">Avantage portefeuille</span>' +
                '<span style="font-family:var(--mono);font-size:13px;font-weight:700;color:' + (avantagePos ? 'var(--positive)' : 'var(--negative)') + '">' + (avantagePos ? '+' : '') + avantage.toFixed(2) + ' €</span>' +
              '</div>';
            }
          })()}
        </div>
      </div>`;
    }).join('');
  }

  // ── Graphique ────────────────────────────────────
  const ctx = document.getElementById('chart-bilan');
  if (!ctx) return;
  if (chartBilan) { chartBilan.destroy(); chartBilan = null; }

  chartBilan = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(y => y.label),
      datasets: [
        {
          label: 'Portefeuille',
          data: data.map(y => y.isYTD && y.pv !== null ? y.montantInvesti + y.pv : null),
          backgroundColor: 'rgba(124,109,245,0.75)',
          borderColor: '#7c6df5',
          borderWidth: 1, borderRadius: 4,
        },
        {
          label: 'Livret A simulé',
          data: data.map(y => y.livretA),
          backgroundColor: 'rgba(255,77,106,0.75)',
          borderColor: '#ff4d6a',
          borderWidth: 1, borderRadius: 4,
        },
        {
          label: 'Apports cumulés',
          data: data.map(y => y.apportTotal),
          backgroundColor: 'rgba(245,183,49,0.75)',
          borderColor: '#f5b731',
          borderWidth: 1, borderRadius: 4,
        },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#8892a8', font: { size: 11 } } },
        tooltip: {
          backgroundColor: '#12141f', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
          titleColor: '#8892a8', bodyColor: '#edf0f7',
          callbacks: { label: c => ` ${c.dataset.label}: ${c.parsed.y != null ? c.parsed.y.toFixed(2) + ' €' : '—'}` }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#495068', font: { size: 12 } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#495068', font: { size: 10 }, callback: v => fmtCompact(v) } }
      }
    }
  });
}

// ═══════════════════════════════════════════════════
//  TROPHÉES
// ═══════════════════════════════════════════════════
const TROPHIES = {
  patrimoine: { label: '💼 Patrimoine',  key: 'patrimoine', paliers: [500,1000,1500,2000,2500,3000,3500,4000,4500,5000] },
  rendement:  { label: '📈 Plus-value',  key: 'rendement',  paliers: [50,100,150,200,250,300,350,400,450,500] },
  dividendes: { label: '🎁 Dividendes',  key: 'dividendes', paliers: [10,20,30,40,50,60,70,80,90,100] },
};

function initTrophees() {
  const pf   = getPortfolio(currentUser);
  const txs  = getTransactions(currentUser);

  const totalVal      = pf.reduce((s, r) => s + r.qty * r.currentPrice, 0);
  const totalInvested = pf.reduce((s, r) => s + r.qty * r.buyPrice, 0);
  const totalPnl      = totalVal - totalInvested;

  // Solde espèces = versements - achats + ventes
  const versements  = getVersements(currentUser);
  const totalVersements = versements.reduce((s, v) => s + v.amount, 0);
  let totalAchats = 0, totalVentes = 0;
  txs.forEach(tx => {
    if (tx.type === 'buy')  totalAchats += tx.qty * tx.price;
    if (tx.type === 'sell') totalVentes += tx.qty * tx.price;
  });
  const cash = Math.max(0, totalVersements - totalAchats + totalVentes);

  // Patrimoine total = titres + espèces
  const patrimoine = totalVal + cash;
  // Dividends: sum realizedPnl from 'dividend' type or estimate from known yields
  const divEstim = pf.reduce((s, r) => s + (r.dividendYield ? r.dividendYield * r.qty * r.currentPrice : 0), 0);

  const values = { patrimoine, rendement: totalPnl, dividendes: divEstim };

  // Summary
  const summary = document.getElementById('trophy-summary');
  if (summary) {
    const totalUnlocked = Object.values(TROPHIES).reduce((s, cat) => s + cat.paliers.filter(p => values[cat.key] >= p).length, 0);
    const totalPossible = Object.values(TROPHIES).reduce((s, cat) => s + cat.paliers.length, 0);
    const nextPatrimoine = TROPHIES.patrimoine.paliers.find(p => values.patrimoine < p) || TROPHIES.patrimoine.paliers[TROPHIES.patrimoine.paliers.length - 1];
    summary.innerHTML = `
      <div class="stat-card">
        <div class="stat-label">🏆 Total débloqués</div>
        <div class="stat-value" style="color:var(--gold)">${totalUnlocked} / ${totalPossible}</div>
        <div class="stat-change pos">Trophées obtenus</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">💼 Patrimoine</div>
        <div class="stat-value">${patrimoine.toFixed(0)} €</div>
        <div class="stat-change pos" style="font-size:10px">Titres ${totalVal.toFixed(0)} € + Espèces ${cash.toFixed(2)} €</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">📈 Plus-value latente</div>
        <div class="stat-value" style="color:${totalPnl >= 0 ? 'var(--positive)' : 'var(--negative)'}">${totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(0)} €</div>
        <div class="stat-change ${totalPnl >= 0 ? 'pos' : 'neg'}">${TROPHIES.rendement.paliers.filter(p => totalPnl >= p).length} / ${TROPHIES.rendement.paliers.length} paliers</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">🎯 Prochain palier</div>
        <div class="stat-value" style="color:var(--accent2)">${nextPatrimoine.toLocaleString('fr-FR')} €</div>
        <div class="stat-change">Patrimoine</div>
      </div>
    `;
  }

  // Categories
  const cats = document.getElementById('trophy-categories');
  if (!cats) return;
  cats.innerHTML = Object.values(TROPHIES).map(cat => {
    const current = values[cat.key];
    const unlocked = cat.paliers.filter(p => current >= p).length;
    return `<div class="section-card">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
        <div style="font-family:var(--display);font-size:16px;font-weight:700">${cat.label}</div>
        <div style="font-size:12px;color:var(--accent)">${unlocked} / ${cat.paliers.length}</div>
      </div>
      <div style="font-size:12px;color:var(--text3);margin-bottom:14px">Actuel : <span style="font-family:var(--mono);color:var(--text)">${current.toFixed(0)} €</span></div>
      <div style="display:flex;flex-direction:column;gap:9px">
        ${cat.paliers.map(s => {
          const ok  = current >= s;
          const pct = Math.min(100, (current / s) * 100).toFixed(0);
          return `<div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:14px;flex-shrink:0">${ok ? '✅' : '⬜'}</span>
            <div style="flex:1">
              <div style="display:flex;justify-content:space-between;margin-bottom:3px">
                <span style="font-size:11px;color:${ok ? 'var(--positive)' : 'var(--text3)'};font-weight:${ok ? 600 : 400}">${s.toLocaleString('fr-FR')} €</span>
                <span style="font-size:10px;color:var(--text3);font-family:var(--mono)">${pct}%</span>
              </div>
              <div style="height:3px;background:var(--s4);border-radius:2px;overflow:hidden">
                <div style="width:${pct}%;height:100%;background:${ok ? 'var(--positive)' : 'var(--accent)'};border-radius:2px;opacity:${ok ? 1 : 0.5};transition:width .5s ease"></div>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════
//  CALENDRIER
// ═══════════════════════════════════════════════════
let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth(); // 0-based

const CAL_DAYS_FR = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
const CAL_MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function getCalEvents() {
  const txs        = getTransactions(currentUser) || [];
  const versements = getVersements(currentUser)   || [];
  const events     = [];

  // Achats
  txs.filter(t => t.type === 'buy' && t.date).forEach(t => {
    events.push({
      date:   t.date,
      type:   'buy',
      label:  t.name || t.ticker || '—',
      detail: `${t.qty} × ${t.price.toFixed(2)} €`,
      amount: t.qty * t.price,
    });
  });

  // Dividendes reçus
  txs.filter(t => t.type === 'dividend' && t.date).forEach(t => {
    events.push({
      date:   t.date,
      type:   'dividend',
      label:  t.name || t.ticker || 'Dividende',
      detail: `${(t.qty * t.price).toFixed(2)} €`,
      amount: t.qty * t.price,
    });
  });

  // Versements
  versements.filter(v => v.date).forEach(v => {
    events.push({
      date:   v.date,
      type:   'deposit',
      label:  'Versement',
      detail: `${v.amount.toFixed(2)} €`,
      amount: v.amount,
    });
  });

  return events;
}

function calPrevMonth() {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendrier();
}
function calNextMonth() {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendrier();
}
function calGoToday() {
  const now = new Date();
  calYear  = now.getFullYear();
  calMonth = now.getMonth();
  renderCalendrier();
}

function renderCalendrier() {
  const label = document.getElementById('cal-month-label');
  if (label) label.textContent = CAL_MONTHS_FR[calMonth] + ' ' + calYear;

  const allEvents = getCalEvents();

  // ── Grille mensuelle ─────────────────────────────
  const grid = document.getElementById('cal-grid');
  if (!grid) return;

  // En-têtes jours
  let html = CAL_DAYS_FR.map(d =>
    `<div class="cal-day-header">${d}</div>`
  ).join('');

  // 1er jour du mois (0=dim → ajuster pour lundi=0)
  const firstDay = new Date(calYear, calMonth, 1);
  const lastDay  = new Date(calYear, calMonth + 1, 0);
  let startDow   = firstDay.getDay(); // 0=dim
  startDow = startDow === 0 ? 6 : startDow - 1; // lundi=0

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // Jours du mois précédent (padding)
  const prevLast = new Date(calYear, calMonth, 0).getDate();
  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevLast - i;
    html += `<div class="cal-day other-month"><div class="cal-day-num">${d}</div></div>`;
  }

  // Jours du mois courant
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = dateStr === todayStr;
    const dayEvents = allEvents.filter(e => e.date === dateStr);

    const dots = dayEvents.slice(0, 3).map(e =>
      `<div class="cal-dot ${e.type}">${e.type === 'buy' ? '▲ ' : e.type === 'dividend' ? '💰 ' : '➕ '}${e.label}</div>`
    ).join('');
    const more = dayEvents.length > 3
      ? `<div style="font-size:9px;color:var(--text3);margin-top:1px">+${dayEvents.length - 3} autres</div>` : '';

    html += `<div class="cal-day${isToday ? ' today' : ''}${dayEvents.length ? ' has-events' : ''}">
      <div class="cal-day-num">${d}</div>
      <div class="cal-dot-wrap">${dots}${more}</div>
    </div>`;
  }

  // Padding fin
  const totalCells = startDow + lastDay.getDate();
  const remainder  = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let d = 1; d <= remainder; d++) {
    html += `<div class="cal-day other-month"><div class="cal-day-num">${d}</div></div>`;
  }

  grid.innerHTML = html;

  // ── Liste événements du mois ──────────────────────
  const monthStr  = `${calYear}-${String(calMonth + 1).padStart(2,'0')}`;
  const monthEvts = allEvents
    .filter(e => e.date.startsWith(monthStr))
    .sort((a, b) => a.date.localeCompare(b.date));

  const countEl = document.getElementById('cal-event-count');
  if (countEl) countEl.textContent = `${monthEvts.length} événement${monthEvts.length !== 1 ? 's' : ''}`;

  const listEl = document.getElementById('cal-event-list');
  if (!listEl) return;

  if (!monthEvts.length) {
    listEl.innerHTML = '<div class="cal-empty">Aucun événement ce mois-ci</div>';
    return;
  }

  const typeLabel = { buy: 'ACHAT', deposit: 'VERSEMENT', dividend: 'DIVIDENDE' };
  const amountColor = { buy: 'var(--accent)', deposit: 'var(--positive)', dividend: 'var(--gold)' };

  listEl.innerHTML = monthEvts.map(e => {
    const day = new Date(e.date + 'T12:00:00').toLocaleDateString('fr-FR', { day:'2-digit', month:'short' });
    return `<div class="cal-event-item">
      <span class="cal-event-date">${day}</span>
      <span class="cal-event-badge ${e.type}">${typeLabel[e.type]}</span>
      <span class="cal-event-desc">${e.label}${e.detail && e.type !== 'deposit' ? ' — ' + e.detail : ''}</span>
      <span class="cal-event-amount" style="color:${amountColor[e.type]}">${e.type === 'buy' ? '−' : '+'}${e.amount.toFixed(2)} €</span>
    </div>`;
  }).join('');
}

function initCalendrier() {
  calYear  = new Date().getFullYear();
  calMonth = new Date().getMonth();
  renderCalendrier();
}

// ═══════════════════════════════════════════════════
//  DIVIDENDES
// ═══════════════════════════════════════════════════

const DIV_FREQ = {
  default:  { freq: 1, months: [5] },
  'MC.PA':  { freq: 2, months: [4, 12] },
  'TTE.PA': { freq: 4, months: [3, 6, 9, 12] },
  'BNP.PA': { freq: 1, months: [6] },
  'ACA.PA': { freq: 1, months: [6] },
  'ENGI.PA':{ freq: 1, months: [5] },
  'AI.PA':  { freq: 1, months: [6] },
  'SAN.PA': { freq: 2, months: [3, 9] },
};

function getNextDivDate(ticker) {
  const freq = DIV_FREQ[ticker] || DIV_FREQ['default'];
  const now  = new Date();
  const month = now.getMonth() + 1;
  const future = freq.months.find(m => m > month);
  const nextM  = future || freq.months[0];
  const nextY  = future ? now.getFullYear() : now.getFullYear() + 1;
  return new Date(nextY, nextM - 1, 15).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

let _divYieldCache = {};

async function refreshDividendes() {
  _divYieldCache = {};
  const btn = document.getElementById('btn-div-refresh');
  const icon = document.getElementById('div-refresh-icon');
  if (btn) btn.disabled = true;
  if (icon) icon.textContent = '⏳';
  await initDividendes();
  if (btn) btn.disabled = false;
  if (icon) icon.textContent = '↻';
}

// Cache dividendes fetchés automatiquement
// Cache dividendes depuis le fichier JSON généré par GitHub Actions
let _divHistoryCache = {};
let _divJsonLoaded   = false;
let _divJsonData     = {};

async function loadDivJson() {
  if (_divJsonLoaded) return;
  try {
    const res  = await fetch('data/dividendes.json');
    if (!res.ok) throw new Error('Fichier non trouvé');
    const json = await res.json();
    _divJsonData   = json.dividends || {};
    _divJsonLoaded = true;
    // Afficher la date de génération dans le sous-titre
    const subEl = document.querySelector('#page-dividendes .page-subtitle span');
    if (subEl && json.generated_at) subEl.textContent = '✦ Données Mistral AI · mis à jour le ' + new Date(json.generated_at).toLocaleDateString('fr-FR', {day:'2-digit', month:'short', year:'numeric'});
    console.log('✅ dividendes.json chargé (' + json.generated_at + ')');
  } catch(e) {
    console.warn('⚠️ dividendes.json non disponible, historique vide.', e);
    _divJsonLoaded = true;
  }
}

async function fetchDivHistory(ticker) {
  if (_divHistoryCache[ticker] !== undefined) return _divHistoryCache[ticker];
  await loadDivJson();
  const data = _divJsonData[ticker];
  if (!data || !data.history) { _divHistoryCache[ticker] = []; return []; }
  // Injecter le prochain dividende confirmé dans l'historique si présent
  let history = [...data.history];
  if (data.next && data.next.date) {
    const alreadyIn = history.find(h => h.date === data.next.date);
    if (!alreadyIn) {
      history.unshift({
        date:   data.next.date,
        amount: data.next.amount_estimated || 0,
        label:  data.next.confirmed ? 'Prochain (confirmé)' : 'Prochain (estimé)',
        next:   true,
      });
    }
  }
  history.sort((a, b) => b.date.localeCompare(a.date));
  _divHistoryCache[ticker] = history;
  return history;
}

function calcNextDivDate(history) {
  if (!history || history.length === 0) return '—';
  const today = new Date();
  const dates  = history.map(d => new Date(d.date)).sort((a, b) => b - a);
  // Si le dernier versement est dans le futur, on l'affiche directement
  if (dates[0] > today) {
    return dates[0].toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
  }
  if (dates.length === 1) {
    // Un seul point : suppose annuel
    const d = new Date(dates[0]);
    while (d <= today) d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
  }
  // Intervalle moyen réel entre versements
  let totalGap = 0;
  for (let i = 0; i < dates.length - 1; i++) totalGap += dates[i] - dates[i + 1];
  const avgGapMs = totalGap / (dates.length - 1);
  let next = new Date(dates[0]);
  while (next <= today) next = new Date(next.getTime() + avgGapMs);
  return next.toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
}

function initDividendes() {
  const pf  = getPortfolio(currentUser);
  const txs = getTransactions(currentUser) || [];

  const ETF_TICKERS = ['WPEA.PA','ESEE.PA','ESE.PA','PUST.PA','PANX.PA','PAEEM.PA','ETZ.PA','EWLD.PA','CW8.PA','MWRD.PA','RS2K.PA','PCEU.PA','IUSQ.AS','IWDA.AS','VWCE.AS','VWRL.AS','CSPX.AS','EMIM.AS','XDWD.AS','SPPW.AS','SPY','QQQ','VTI','VT','VOO','ARKK','GLD','TLT','SOXX'];
  const actions = pf.filter(r => r.quoteType !== 'ETF' && r.quoteType !== 'MUTUALFUND' && !ETF_TICKERS.includes(r.ticker));

  const divTxs   = txs.filter(t => t.type === 'dividend');
  const divRecus = divTxs.reduce((s, t) => s + t.qty * t.price, 0);

  // Afficher un état de chargement
  const tbody = document.getElementById('div-tbody');
  const histEl = document.getElementById('div-history');
  if (tbody)  tbody.innerHTML  = '<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:24px">⏳ Chargement des dividendes…</td></tr>';
  if (histEl) histEl.innerHTML = '<div class="cal-empty">⏳ Récupération de l\'historique…</div>';

  // KPIs immédiats
  const kpis = document.getElementById('div-kpis');
  if (kpis) kpis.innerHTML = `
    <div class="stat-card" id="div-kpi-recus">
      <div class="stat-label">🎁 Dividendes reçus</div>
      <div class="stat-value" style="color:var(--gold)">—</div>
      <div class="stat-change pos">Chargement…</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">📋 Actions suivies</div>
      <div class="stat-value">${actions.length}</div>
      <div class="stat-change">Dans le portefeuille</div>
    </div>
    <div class="stat-card" id="div-kpi-holding">
      <div class="stat-label">📅 Versements pendant détention</div>
      <div class="stat-value">—</div>
      <div class="stat-change">Chargement…</div>
    </div>
    <div class="stat-card" id="div-kpi-next">
      <div class="stat-label">⏰ Prochain versement</div>
      <div class="stat-value" style="font-size:16px">—</div>
      <div class="stat-change">Chargement…</div>
    </div>`;

  // Fetch async puis render
  Promise.all(actions.map(async r => {
    const history  = await fetchDivHistory(r.ticker);
    const buyDate  = r.buyDate || null;
    const today    = new Date().toISOString().slice(0, 10);

    // Dividendes manuellement enregistrés pour ce ticker
    const manualReceived = divTxs.filter(t => t.ticker === r.ticker);

    // Récupérer la date d'achat depuis le portfolio OU depuis les transactions
    const buyTxs    = txs.filter(t => t.type === 'buy' && t.ticker === r.ticker);
    const firstBuy  = buyDate || (buyTxs.length ? buyTxs.map(t=>t.date).sort()[0] : null);

    // Dividendes automatiquement détectés : versés pendant la détention, date passée, pas "next"
    const autoReceived = firstBuy
      ? history.filter(d =>
          !d.next &&
          d.date >= firstBuy &&
          d.date <= today
        )
      : [];

    // Fusionner manuel + auto (éviter doublons par date)
    const allReceived = [...manualReceived];
    autoReceived.forEach(d => {
      const alreadyManual = manualReceived.find(t => t.date === d.date);
      if (!alreadyManual) {
        allReceived.push({ ticker: r.ticker, name: r.name, date: d.date, qty: r.qty, price: d.amount, auto: true });
      }
    });

    const totalRecu     = allReceived.reduce((s, t) => s + t.qty * t.price, 0);
    const duringHolding = firstBuy ? history.filter(d => !d.next && d.date >= firstBuy && d.date <= today) : [];
    const nextEstim     = calcNextDivDate(history);
    const lastKnown     = history.find(d => !d.next) || null;
    return { r, history, buyDate: firstBuy, allReceived, totalRecu, duringHolding, nextEstim, lastKnown };
  })).then(rows => {
    // Mettre à jour KPIs dynamiques
    const totalHolding   = rows.reduce((s, x) => s + x.duringHolding.length, 0);
    const totalRecuAuto  = rows.reduce((s, x) => s + x.totalRecu, 0);
    const totalVersionts = rows.reduce((s, x) => s + x.allReceived.length, 0);
    const nextRows = rows.filter(x => x.nextEstim !== '—').sort((a, b) => a.nextEstim.localeCompare(b.nextEstim));
    const kpiRecus   = document.getElementById('div-kpi-recus');
    const kpiHolding = document.getElementById('div-kpi-holding');
    const kpiNext    = document.getElementById('div-kpi-next');
    if (kpiRecus) kpiRecus.innerHTML = `
      <div class="stat-label">🎁 Dividendes reçus</div>
      <div class="stat-value" style="color:var(--gold)">${totalRecuAuto.toFixed(2)} €</div>
      <div class="stat-change pos">${totalVersionts} versement(s) détecté(s)</div>`;
    if (kpiHolding) kpiHolding.innerHTML = `
      <div class="stat-label">📅 Versements pendant détention</div>
      <div class="stat-value">${totalHolding}</div>
      <div class="stat-change">Depuis date d'achat</div>`;
    if (kpiNext && nextRows.length) kpiNext.innerHTML = `
      <div class="stat-label">⏰ Prochain versement</div>
      <div class="stat-value" style="font-size:14px;color:var(--gold)">${nextRows[0].nextEstim}</div>
      <div class="stat-change">${nextRows[0].r.name || nextRows[0].r.ticker}</div>`;

    // Tableau
    if (tbody) tbody.innerHTML = !rows.length
      ? '<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:24px">Aucune action en portefeuille</td></tr>'
      : rows.map(({r, duringHolding, totalRecu, nextEstim, lastKnown}) => {
          const holdingBadge = duringHolding.length > 0
            ? `<span style="background:rgba(0,224,158,0.12);color:var(--positive);border-radius:5px;padding:2px 8px;font-size:10px;font-weight:600">✓ ${duringHolding.length} versement(s)</span>`
            : `<span style="background:var(--s3);color:var(--text3);border-radius:5px;padding:2px 8px;font-size:10px">Aucun depuis achat</span>`;
          const buyStr = r.buyDate ? new Date(r.buyDate+'T12:00:00').toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}) : '—';
          return `<tr>
            <td><div style="display:flex;align-items:center;gap:8px">
              ${logoHtml(r.ticker, 24, 'ticker-icon')}
              <div><div style="font-size:12px;font-weight:600">${r.name}</div>
              <div style="font-size:10px;color:var(--text2);font-family:var(--mono)">${r.ticker}</div></div>
            </div></td>
            <td class="mono" style="font-size:11px;color:var(--text3)">${buyStr}</td>
            <td class="mono">${r.qty}</td>
            <td class="mono" style="color:var(--gold);font-weight:600">${totalRecu > 0 ? totalRecu.toFixed(2)+' €' : '—'}</td>
            <td class="mono" style="color:var(--text2)">${lastKnown ? lastKnown.amount.toFixed(2)+' €/action' : '—'}</td>
            <td style="font-size:11px;color:var(--text2)">${nextEstim !== '—' ? nextEstim + ' <span style="color:var(--accent);font-size:9px">✦ IA</span>' : '—'}</td>
            <td>${holdingBadge}</td>
          </tr>`;
        }).join('');

    // Historique complet
    let allEntries = [];
    divTxs.forEach(t => {
      allEntries.push({ date: t.date||'', ticker: t.ticker, name: t.name||t.ticker, amount: t.qty*t.price, perShare: t.price, label: '', source: 'reçu', duringHolding: true });
    });
    rows.forEach(({r, history, buyDate, allReceived}) => {
      const today = new Date().toISOString().slice(0,10);
      const buyTxsFallback = txs.filter(t => t.type==='buy' && t.ticker===r.ticker);
      const firstBuyDate   = buyDate || (buyTxsFallback.length ? buyTxsFallback.map(t=>t.date).sort()[0] : null);
      (history||[]).forEach(d => {
        const alreadyManual = divTxs.find(t => t.ticker===r.ticker && t.date===d.date);
        if (alreadyManual) return;
        const during = firstBuyDate ? (d.date >= firstBuyDate && d.date <= today && !d.next) : false;
        const isAutoReceived = during;
        allEntries.push({
          date: d.date, ticker: r.ticker, name: r.name,
          amount: d.amount * r.qty, perShare: d.amount,
          label: d.label||'', source: isAutoReceived ? 'reçu-auto' : (d.next ? 'estimé' : 'référence'),
          duringHolding: during || (d.next && firstBuyDate && d.date >= firstBuyDate),
        });
      });
    });
    allEntries.sort((a,b) => b.date.localeCompare(a.date));

    if (histEl) {
      if (!allEntries.length) {
        histEl.innerHTML = '<div class="cal-empty">Aucun historique disponible.</div>';
      } else {
        histEl.innerHTML = `<table style="width:100%">
          <thead><tr>
            <th>Date</th><th style="text-align:left">Action</th>
            <th>Montant total</th><th>Par action</th><th>Période</th><th>Source</th>
          </tr></thead><tbody>
          ${allEntries.map(e => {
            const ds = e.date ? new Date(e.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}) : '—';
            const periodBadge = e.duringHolding
              ? '<span style="background:rgba(0,224,158,0.12);color:var(--positive);font-size:10px;padding:1px 7px;border-radius:4px">Pendant détention</span>'
              : '<span style="background:var(--s3);color:var(--text3);font-size:10px;padding:1px 7px;border-radius:4px">Avant achat</span>';
            const srcBadge = e.source==='reçu'
              ? '<span style="background:rgba(124,109,245,0.15);color:#a89cf7;font-size:10px;padding:1px 7px;border-radius:4px">✓ Saisi</span>'
              : e.source==='reçu-auto'
              ? '<span style="background:rgba(0,224,158,0.15);color:var(--positive);font-size:10px;padding:1px 7px;border-radius:4px" title="Calculé automatiquement par Mistral AI">✓ Reçu · ✦ IA</span>'
              : e.source==='estimé'
              ? '<span style="background:rgba(245,183,49,0.15);color:var(--gold);font-size:10px;padding:1px 7px;border-radius:4px" title="Estimé par Mistral AI">⏳ Estimé · ✦ IA</span>'
              : '<span style="background:var(--s2);color:var(--text3);font-size:10px;padding:1px 7px;border-radius:4px">Référence</span>';
            return `<tr>
              <td class="mono" style="font-size:12px;color:var(--text2)">${ds}</td>
              <td><div style="display:flex;align-items:center;gap:6px">${logoHtml(e.ticker||'',20,'ticker-icon')}
                <div><span style="font-size:12px">${e.name||e.ticker}</span>
                ${e.label?`<div style="font-size:10px;color:var(--text3)">${e.label}</div>`:''}</div></div></td>
              <td class="mono" style="font-weight:600;color:var(--gold)">${e.amount.toFixed(2)} €</td>
              <td class="mono" style="font-size:11px;color:var(--text3)">${e.perShare.toFixed(3)} €/action</td>
              <td>${periodBadge}</td>
              <td>${srcBadge}</td>
            </tr>`;
          }).join('')}
          </tbody></table>`;
      }
    }
  });
}

function openDivModal() {
  const pf  = getPortfolio(currentUser);
  const sel = document.getElementById('div-modal-ticker');
  if (sel) sel.innerHTML = pf.map(r => `<option value="${r.ticker}">${r.name||r.ticker}</option>`).join('');
  document.getElementById('div-modal-date').value   = new Date().toISOString().slice(0,10);
  document.getElementById('div-modal-amount').value = '';
  document.getElementById('div-modal-overlay').classList.add('open');
}
function closeDivModal() { document.getElementById('div-modal-overlay').classList.remove('open'); }
function closeDivModalOutside(e) { if (e.target===document.getElementById('div-modal-overlay')) closeDivModal(); }
function confirmDividende() {
  const ticker = document.getElementById('div-modal-ticker').value;
  const amount = parseFloat(document.getElementById('div-modal-amount').value);
  const date   = document.getElementById('div-modal-date').value;
  if (!ticker||!amount||amount<=0||!date) { alert('Veuillez remplir tous les champs.'); return; }
  const pf  = getPortfolio(currentUser);
  const row = pf.find(r => r.ticker === ticker);
  const qty = row ? row.qty : 1;
  logTransaction(currentUser, { type:'dividend', ticker, name: row?(row.name||ticker):ticker, qty, price: parseFloat((amount/qty).toFixed(6)), date });
  closeDivModal();
  initDividendes();
}

const _origShowPageAnalytique = showPage;
showPage = function(id) {
  _origShowPageAnalytique(id);
  if (id === 'base100')     initBase100();
  if (id === 'projections') initProjections();
  if (id === 'bilan')       initBilan();
  if (id === 'trophees')    initTrophees();
  if (id === 'calendrier')  initCalendrier();
  if (id === 'dividendes')  initDividendes();
};
const _origShowPageMobileAnalytique = showPageMobile;
showPageMobile = function(id) {
  _origShowPageMobileAnalytique(id);
  if (id === 'base100')     initBase100();
  if (id === 'projections') initProjections();
  if (id === 'bilan')       initBilan();
  if (id === 'trophees')    initTrophees();
  if (id === 'calendrier')  initCalendrier();
  if (id === 'dividendes')  initDividendes();
};

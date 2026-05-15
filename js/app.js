// ─── ICON SYSTEM (colored SVG) ─────────────────────────
const IC = {
  briefcase: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c6df5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
  bell:      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f5b731" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  target:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff9f43" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  wallet:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00cec9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/></svg>',
  barchart:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a29bfe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  gift:      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f5b731" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>',
  trophy:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f5b731" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H4v7a5 5 0 0 0 10 0V4H7z"/><path d="M17 4h3v7a5 5 0 0 1-5 5"/></svg>',
  trending:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e09e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  clock:     '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8892a8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  zap:       '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c6df5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  calendar:  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8892a8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  crown:     '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e17055" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="m4 20 4-12 4 7 4-10 4 15"/></svg>',
  user:      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8892a8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  message:   '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fd79a8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  dotGreen:  '<svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3.5" fill="#00e09e"/></svg>',
  dotRed:    '<svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3.5" fill="#ff4d6a"/></svg>',
};

// ─── FIREBASE AUTH ────────────────────────────────────
// ─── FIREBASE (chargement dynamique, compatible sans bundler) ─────
let fbApp, fbAuth, db,
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup,
    signInWithRedirect, getRedirectResult,
    updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser,
    getFirestoreDoc, setFirestoreDoc, firestoreDoc, firestoreCollection, deleteFirestoreDoc, getDocs,
    addFirestoreDoc, onSnapshot, firestoreQuery, firestoreWhere, firestoreOrderBy, serverTimestamp,
    firestoreArrayUnion, firestoreArrayRemove, firestoreOr, firestoreDeleteField;

let fcmMessaging = null, getFCMToken, onFCMMessage;
// VAPID key : Firebase Console → Project Settings → Cloud Messaging → Web Push certificates → Generate key pair
const VAPID_KEY = 'BONSSk6FlPyAEd9z8nSIk8DKDTvNfOWeE2jSRyoPhZj1x3uLV7yNNZFL_E_vNXI1EL2xQKA1Nr6tmKaSX5hcGJY';

(async function initFirebase() {
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
  const auth = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");

  createUserWithEmailAndPassword = auth.createUserWithEmailAndPassword;
  signInWithEmailAndPassword     = auth.signInWithEmailAndPassword;
  signOut                        = auth.signOut;
  onAuthStateChanged             = auth.onAuthStateChanged;
  GoogleAuthProvider             = auth.GoogleAuthProvider;
  signInWithPopup                = auth.signInWithPopup;
  signInWithRedirect             = auth.signInWithRedirect;
  getRedirectResult              = auth.getRedirectResult;
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
  addFirestoreDoc     = firestore.addDoc;
  onSnapshot          = firestore.onSnapshot;
  firestoreQuery      = firestore.query;
  firestoreWhere      = firestore.where;
  firestoreOrderBy    = firestore.orderBy;
  serverTimestamp     = firestore.serverTimestamp;
  firestoreArrayUnion  = firestore.arrayUnion;
  firestoreArrayRemove = firestore.arrayRemove;
  firestoreOr          = firestore.or;
  firestoreDeleteField = firestore.deleteField;

  fbApp  = initializeApp(firebaseConfig);
  fbAuth = auth.getAuth(fbApp);
  db     = firestore.getFirestore(fbApp);

  try {
    const msg = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js");
    getFCMToken  = msg.getToken;
    onFCMMessage = msg.onMessage;
    fcmMessaging = msg.getMessaging(fbApp);
  } catch(e) { console.warn('FCM unavailable:', e.message); }

  // Google Sign-In désactivé : plus besoin de gérer getRedirectResult.

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
let currentUserRole = 'user'; // 'user' | 'admin' | 'superadmin'

function isSuperAdmin(user) { return user && currentUserRole === 'superadmin'; }
function isAdmin(user)      { return currentUserRole === 'admin' || currentUserRole === 'superadmin'; }

// ─── COUCHE DONNÉES FIRESTORE (cache synchrone + sync arrière-plan) ──────
// Les lectures/écritures sont SYNCHRONES via un cache mémoire.
// Firestore est chargé au démarrage et écrit en arrière-plan.

const _localCache = {};

// Charge toutes les données depuis Firestore au démarrage
async function loadAllUserData(uid) {
  if (!uid || !db) return;
  // Enregistrer l'email pour la recherche par email (gestion des rôles)
  const _u = fbAuth.currentUser;
  if (_u) setFirestoreDoc(firestoreDoc(db, 'users', uid), { email: _u.email }, { merge: true }).catch(() => {});
  const cols = ['portfolio', 'transactions', 'versements', 'watchlist', 'dailyValues', 'alerts', 'notifHistory'];
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
function getDailyValues(user)  { return _localCache[(user||currentUser) + '_dailyValues']  || []; }

// Écriture synchrone dans le cache + Firestore en arrière-plan
function savePortfolio(user, data)    { _perfCache = null; _fsWrite(user||currentUser, 'portfolio',    data); }
function saveTransactions(user, data) { _perfCache = null; _fsWrite(user||currentUser, 'transactions', data); }
function saveVersements(user, data)   { _perfCache = null; _fsWrite(user||currentUser, 'versements',   data); }
function saveWatchlist(user, data)    { _fsWrite(user||currentUser, 'watchlist',    data); }
function saveDailyValues(user, data)  { _perfCache = null; _fsWrite(user||currentUser, 'dailyValues', data); }
function getAlerts(user)       { return _localCache[(user||currentUser) + '_alerts']       || []; }
function getNotifHistory(user) { return _localCache[(user||currentUser) + '_notifHistory']  || []; }
function saveAlerts(user, data)       { _fsWrite(user||currentUser, 'alerts',       data); }
function saveNotifHistory(user, data) { _fsWrite(user||currentUser, 'notifHistory',  data); }

// ─────────────────────────────────────────────────────────────────
//  EXPORT / IMPORT — sauvegarde complète d'un compte en JSON
//  Inclut : portfolio, transactions, versements, watchlist, dailyValues, settings.
//  N'inclut PAS : email ni mot de passe (gérés par Firebase Auth).
// ─────────────────────────────────────────────────────────────────
function exportAllUserData() {
  const uid = currentUser;
  if (!uid) { alert('Vous devez être connecté.'); return; }

  const payload = {
    _meta: {
      format: 'dashboard-pea-export',
      version: 1,
      exportedAt: new Date().toISOString(),
      uid: uid,
    },
    portfolio:    getPortfolio(uid),
    transactions: getTransactions(uid),
    versements:   getVersements(uid),
    watchlist:    getWatchlist(uid),
    dailyValues:  getDailyValues(uid),
    settings:     getUserSettings(uid),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const d = new Date();
  const stamp = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0')
              + '_' + String(d.getHours()).padStart(2,'0') + String(d.getMinutes()).padStart(2,'0');
  a.href = url;
  a.download = 'dashboard-pea-backup_' + stamp + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function importAllUserData(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = ''; // permettre de ré-importer le même fichier
  if (!file) return;
  const uid = currentUser;
  if (!uid) { alert('Vous devez être connecté.'); return; }

  // Lecture
  let payload;
  try {
    const txt = await file.text();
    payload = JSON.parse(txt);
  } catch(e) {
    alert('Fichier JSON invalide.');
    return;
  }

  // Validation minimale
  if (!payload || typeof payload !== 'object' || !payload._meta || payload._meta.format !== 'dashboard-pea-export') {
    alert('Ce fichier n\'est pas un export valide du Dashboard PEA.');
    return;
  }

  // Compter les items pour la confirmation
  const counts = {
    portfolio:    (payload.portfolio    || []).length,
    transactions: (payload.transactions || []).length,
    versements:   (payload.versements   || []).length,
    watchlist:    (payload.watchlist    || []).length,
    dailyValues:  (payload.dailyValues  || []).length,
  };
  const total = Object.values(counts).reduce((s,n) => s+n, 0);

  const msg = 'Importer l\'export suivant ?\n\n'
    + '• Portefeuille : ' + counts.portfolio + ' lignes\n'
    + '• Transactions : ' + counts.transactions + '\n'
    + '• Versements   : ' + counts.versements + '\n'
    + '• Watchlist    : ' + counts.watchlist + '\n'
    + '• Valorisations quotidiennes : ' + counts.dailyValues + '\n\n'
    + 'Exporté le : ' + (payload._meta.exportedAt || '?') + '\n\n'
    + '⚠️ Cela REMPLACE toutes les données actuelles de votre compte.';

  if (!confirm(msg)) return;

  // Application
  try {
    if (Array.isArray(payload.portfolio))    savePortfolio(uid, payload.portfolio);
    if (Array.isArray(payload.transactions)) saveTransactions(uid, payload.transactions);
    if (Array.isArray(payload.versements))   saveVersements(uid, payload.versements);
    if (Array.isArray(payload.watchlist))    saveWatchlist(uid, payload.watchlist);
    if (Array.isArray(payload.dailyValues))  saveDailyValues(uid, payload.dailyValues);
    if (payload.settings && typeof payload.settings === 'object') {
      await saveUserSettings(uid, payload.settings);
    }
  } catch(e) {
    alert('Erreur pendant l\'import : ' + (e.message || e));
    return;
  }

  alert('✓ Import réussi (' + total + ' éléments). La page va être rechargée.');
  location.reload();
}

window.exportAllUserData = exportAllUserData;
window.importAllUserData = importAllUserData;

function _fsWrite(uid, col, data) {
  _localCache[uid + '_' + col] = data;
  if (!db) return;
  setFirestoreDoc(firestoreDoc(db, 'users', uid, 'data', col), { items: data })
    .catch(e => console.warn('Firestore write error:', col, e));
}

// Suppression complète des données utilisateur
async function deleteAllUserData(uid) {
  const cols = ['portfolio', 'transactions', 'versements', 'watchlist', 'dailyValues'];
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
  const rgpdErr = document.getElementById('register-rgpd-error');
  err.textContent = ''; err.style.display = 'none';
  if (rgpdErr) rgpdErr.style.display = 'none';
  if (!email || !pass || !pass2) { err.textContent = 'Veuillez remplir tous les champs.'; err.style.display = 'block'; return; }
  if (pass !== pass2) { err.textContent = 'Les mots de passe ne correspondent pas.'; err.style.display = 'block'; return; }
  if (pass.length < 6) { err.textContent = 'Mot de passe trop court (6 caractères min).'; err.style.display = 'block'; return; }
  const rgpdChecked = document.getElementById('reg-rgpd')?.checked;
  if (!rgpdChecked) { if (rgpdErr) { rgpdErr.style.display = 'block'; } return; }
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
// En PWA iOS (écran d'accueil) ou sur mobile en général, signInWithPopup
// échoue silencieusement : iOS bloque les popups et casse le retour vers
// la webapp standalone. On détecte ces contextes et on bascule sur
// signInWithRedirect, qui fait une vraie navigation dans la même fenêtre.
function _shouldUseRedirectAuth() {
  try {
    // Mode standalone = app ajoutée à l'écran d'accueil (iOS ou Android)
    const isStandalone =
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true;
    // Safari iOS même en mode navigateur pose problème avec les popups
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    return isStandalone || isIOS;
  } catch (e) {
    return false;
  }
}

window.doLoginGoogle = async function() {
  // Google Sign-In désactivé : posait problème en PWA iOS (cookies cross-domain).
  // Connexion uniquement via email + mot de passe.
  const err = document.getElementById('login-error');
  if (err) err.textContent = 'Connexion Google désactivée. Utilisez email + mot de passe.';
};

// ─── LOGOUT ───────────────────────────────────────────
window.doLogout = async function() {
  await signOut(fbAuth);
};

// ─── DÉMARRAGE APP ────────────────────────────────────
async function startApp(user) {
  currentUser = user.uid;
  window.currentUser = user.uid;
  // Charger le rôle depuis Firestore
  try {
    const roleDoc = await getFirestoreDoc(firestoreDoc(db, 'roles', user.uid));
    const baseSync = { email: user.email, displayName: user.displayName || '' };
    if (user.photoURL) baseSync.photoURL = user.photoURL;
    await setFirestoreDoc(firestoreDoc(db, 'roles', user.uid), baseSync, { merge: true });
    if (!roleDoc.exists()) {
      await setFirestoreDoc(firestoreDoc(db, 'roles', user.uid), { role: 'user', email: user.email });
    }
    currentUserRole = roleDoc.exists() ? (roleDoc.data().role || 'user') : 'user';
  } catch(e) { console.error('🔑 role load error:', e); currentUserRole = 'user'; }
  updateRoleBadges();
  const displayName = user.displayName || user.email.split('@')[0];
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('user-avatar').textContent = displayName[0].toUpperCase();
  document.getElementById('user-name-display').textContent = displayName;
  const d = new Date();
  document.getElementById('portfolio-date').textContent =
    'Mis à jour le ' + d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  // Charger FX rates + données Firestore avant de rendre
  await Promise.all([loadAllUserData(user.uid), loadFxRates()]);
  // Avatar + sync roles APRÈS chargement des settings (avatarBase64 dispo)
  updateMobileAvatar(user);
  const _avatar = getUserSettings(user.uid).avatarBase64;
  if (_avatar) setFirestoreDoc(firestoreDoc(db, 'roles', user.uid), { avatarBase64: _avatar }, { merge: true }).catch(() => {});
  loadProfilePage(user);
  window.renderPortfolio();
  window.fetchAllLogos();
  if (!window.autoRefreshInterval) window.toggleAutoRefresh();
  setTimeout(initStatCardsScroll, 1500);
  // Badge idées en arrière-plan
  _listenThreads(user);
  _startPresenceHeartbeat(user);
  if (isAdmin(user)) _startPresenceListener();

  // Preload des données lourdes (Benchmark + Performance + Watchlist)
  // en arrière-plan, pour que les pages s'affichent instantanément quand
  // l'utilisateur clique dessus.
  // Ne bloque pas l'affichage : lancé après le rendu du portefeuille.
  setTimeout(() => { preloadAll().catch(e => console.warn('Preload:', e)); }, 200);
  _updateNotifBadge();
  _listenBroadcast();
  if (Notification.permission === 'granted') initPush(user.uid).catch(() => {});
}

function stopApp() {
  _stopPresenceHeartbeat(currentUser);
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
  const newVal   = settings.emailRecap === false;
  toggle.classList.toggle('on', newVal);
  await saveUserSettings(currentUser, { emailRecap: newVal });
};

window.saveRecapFreq = async function(value) {
  await saveUserSettings(currentUser, { emailRecapFreq: value });
  const st = document.getElementById('recap-freq-status');
  if (st) { st.textContent = '✓ Sauvegardé'; setTimeout(() => { st.textContent = ''; }, 2500); }
};

window.selectPresetAvatar = async function(el) {
  const img = new Image();
  img.onload = async function() {
    const canvas = document.createElement('canvas');
    canvas.width = 120; canvas.height = 120;
    canvas.getContext('2d').drawImage(img, 0, 0, 120, 120);
    const base64 = canvas.toDataURL('image/png');
    await saveUserSettings(currentUser, { avatarBase64: base64 });
    setFirestoreDoc(firestoreDoc(db, 'roles', currentUser), { avatarBase64: base64 }, { merge: true }).catch(() => {});
    const imgEl = document.getElementById('profil-avatar-img');
    const letEl = document.getElementById('profil-avatar-letter');
    imgEl.src = base64;
    imgEl.style.display = 'block';
    letEl.style.display = 'none';
    updateMobileAvatar(fbAuth.currentUser);
    document.querySelectorAll('.preset-avatar').forEach(e => {
      e.style.borderColor = e === el ? 'var(--accent)' : 'transparent';
    });
    const st = document.getElementById('avatar-status');
    if (st) { st.textContent = '✓ Photo mise à jour'; setTimeout(() => { st.textContent = ''; }, 2500); }
  };
  img.crossOrigin = 'anonymous';
  img.src = el.src;
};

window.uploadProfilAvatar = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async function(e) {
    const img = new Image();
    img.onload = async function() {
      const canvas = document.createElement('canvas');
      canvas.width = 120; canvas.height = 120;
      const ctx = canvas.getContext('2d');
      const size = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 120, 120);
      const base64 = canvas.toDataURL('image/jpeg', 0.85);
      await saveUserSettings(currentUser, { avatarBase64: base64 });
      setFirestoreDoc(firestoreDoc(db, 'roles', currentUser), { avatarBase64: base64 }, { merge: true }).catch(() => {});
      const imgEl = document.getElementById('profil-avatar-img');
      const letEl = document.getElementById('profil-avatar-letter');
      imgEl.src = base64;
      imgEl.style.display = 'block';
      letEl.style.display = 'none';
      updateMobileAvatar(fbAuth.currentUser);
      document.querySelectorAll('.preset-avatar').forEach(e => e.style.borderColor = 'transparent');
      const st = document.getElementById('avatar-status');
      if (st) { st.textContent = '✓ Photo mise à jour'; setTimeout(() => { st.textContent = ''; }, 2500); }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  event.target.value = '';
};

function loadProfilePage(user) {
  if (!user) return;
  updateRoleBadges();

  // Avatar
  const letter = document.getElementById('profil-avatar-letter');
  const img    = document.getElementById('profil-avatar-img');
  const big    = document.getElementById('profil-avatar-big');
  const settingsAvatar = getUserSettings(user.uid);
  const avatarSrc = settingsAvatar.avatarBase64 || user.photoURL;
  if (avatarSrc) {
    img.src = avatarSrc;
    img.style.display = 'block';
    letter.style.display = 'none';
  } else {
    img.style.display = 'none';
    letter.style.display = 'block';
    letter.textContent = (user.displayName || user.email || '?')[0].toUpperCase();
  }
  // Hover overlay
  big.onmouseenter = () => { document.getElementById('profil-avatar-overlay').style.opacity = '1'; };
  big.onmouseleave = () => { document.getElementById('profil-avatar-overlay').style.opacity = '0'; };

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

  // Fréquence récap email
  const settings    = getUserSettings(user.uid);
  const freqSelect  = document.getElementById('select-recap-freq');
  if (freqSelect) freqSelect.value = settings.emailRecapFreq || 'never';
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

function _roleBadgeHtml(role, size) {
  const s = size || '9px';
  const base = `display:inline-block;white-space:nowrap;font-size:${s};font-family:var(--mono);font-weight:700;padding:1px 7px;border-radius:4px;`;
  if (role === 'superadmin') return `<span style="${base}background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)">${IC.crown} Super Admin</span>`;
  if (role === 'admin')      return `<span style="${base}background:rgba(124,109,245,0.15);color:var(--accent);border:1px solid rgba(124,109,245,0.25)">${IC.zap} Admin</span>`;
  return `<span style="${base}background:var(--s3);color:var(--text3)">Utilisateur</span>`;
}

function updateRoleBadges() {
  const sb = document.getElementById('sidebar-role-badge');
  if (sb) { sb.style.display = 'block'; sb.innerHTML = _roleBadgeHtml(currentUserRole, '9px'); }
  const pb = document.getElementById('profil-role-badge');
  if (pb) pb.innerHTML = _roleBadgeHtml(currentUserRole, '10px');
  const ib = document.getElementById('ideas-role-badge');
  if (ib) { ib.style.display = 'inline'; ib.innerHTML = _roleBadgeHtml(currentUserRole, '9px'); }
  // Bouton Super Admin sidebar + mobile
  const isSA = isSuperAdmin(fbAuth.currentUser);
  const btnSA = document.getElementById('btn-superadmin');
  if (btnSA) btnSA.style.display = isSA ? 'flex' : 'none';
  const btnSAm = document.getElementById('btn-superadmin-mobile');
  if (btnSAm) btnSAm.style.display = isSA ? 'flex' : 'none';
}

window.openSuperAdminPanel = async function() {
  document.getElementById('superadmin-overlay').style.display = 'flex';
  await _saLoadAll();
};
window.closeSuperAdminPanel = function() {
  document.getElementById('superadmin-overlay').style.display = 'none';
};

// Update mobile header avatar
function updateMobileAvatar(user) {
  if (!user) return;
  const settings = getUserSettings(user.uid);
  const src = settings.avatarBase64 || user.photoURL;

  // Sidebar desktop
  const sidebarEl = document.getElementById('user-avatar');
  if (sidebarEl) {
    if (src) {
      sidebarEl.innerHTML = `<img src="${src}" style="width:100%;height:100%;border-radius:10px;object-fit:cover;display:block;">`;
    } else {
      sidebarEl.textContent = (user.displayName || user.email || '?')[0].toUpperCase();
    }
  }

  // Mobile
  const letter = document.getElementById('mobile-avatar-letter');
  if (!letter) return;
  if (src) {
    letter.innerHTML = `<img src="${src}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;">`;
  } else {
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

      const chg = row.changePct || 0;
      const dayVal = row.qty * row.currentPrice * chg / 100;
      const perfJourHtml = chg !== 0
        ? `<span class="perf-jour-cell ${chg >= 0 ? 'perf-pos' : 'perf-neg'}"
              data-pct="${chg >= 0 ? '+' : ''}${chg.toFixed(2)}%"
              data-eur="${chg >= 0 ? '+' : ''}${dayVal.toFixed(2)} €"
              onclick="togglePerfJourMode()"
              style="cursor:pointer">${chg >= 0 ? '+' : ''}${chg.toFixed(2)}%</span>`
        : `<span style="color:var(--text3);font-size:11px">—</span>`;

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
        <td class="mono hide-mobile">${row.qty}</td>
        <td class="mono hide-mobile">${fmt(row.buyPrice)}</td>
        <td class="mono hide-mobile">${fmt(row.currentPrice)}</td>
        <td class="mono">
          <div style="font-weight:500">${fmt(val)}</div>
          <div class="perf-total-sub ${isPos ? 'perf-pos' : 'perf-neg'}"
               data-pct="${isPos ? '+' : ''}${pct.toFixed(2)}%"
               data-eur="${isPos ? '+' : ''}${fmt(Math.abs(pnl))}"
               onclick="this.textContent=this.textContent===this.dataset.pct?this.dataset.eur:this.dataset.pct"
               style="cursor:pointer">${isPos ? '+' : ''}${pct.toFixed(2)}%</div>
        </td>
        <td class="hide-mobile">
          <span class="${isPos ? 'badge-pos' : 'badge-neg'}">
            ${isPos ? '▲' : '▼'} ${fmt(Math.abs(pnl))} (${isPos ? '+' : ''}${pct.toFixed(2)}%)
          </span>
        </td>
        <td>${perfJourHtml}</td>
        <td style="text-align:right;padding-right:18px;white-space:nowrap">
          <div class="btn-portfolio-actions" style="display:inline-flex;gap:6px;align-items:center">
            <button class="btn-edit" onclick="openEditModal(${i})" title="Modifier">✏</button>
            <button class="btn-del" onclick="deleteRow(${i})" title="Supprimer">✕</button>
          </div>
          <button class="btn-voir-plus" onclick="togglePortfolioDetail(${i})" title="Voir plus">▾</button>
        </td>
      `;
      tbody.appendChild(tr);

      const detailTr = document.createElement('tr');
      detailTr.className = 'mobile-detail-row';
      detailTr.id = 'portfolio-detail-' + i;
      detailTr.innerHTML = `
        <td colspan="8">
          <div class="portfolio-detail-content">
            <div class="portfolio-detail-grid">
              <span><label>Qté</label>${row.qty}</span>
              <span><label>PRU</label>${fmt(row.buyPrice)}</span>
              <span><label>Cours</label>${fmt(row.currentPrice)}</span>
              <span><label>+/- Value</label><span class="${isPos ? 'badge-pos' : 'badge-neg'}">${isPos ? '▲' : '▼'} ${fmt(Math.abs(pnl))} (${isPos ? '+' : ''}${pct.toFixed(2)}%)</span></span>
            </div>
            <div class="portfolio-detail-actions">
              <button class="btn-edit" onclick="openEditModal(${i})">✏ Modifier</button>
              <button class="btn-del" onclick="deleteRow(${i})">✕ Supprimer</button>
            </div>
          </div>
        </td>
      `;
      tbody.appendChild(detailTr);
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
    const _d = tx.date ? new Date(tx.date + 'T12:00:00') : null;
    const dateStr = _d ? String(_d.getDate()).padStart(2,'0') + '/' + String(_d.getMonth()+1).padStart(2,'0') + '/' + String(_d.getFullYear()).slice(-2) : '—';
    const pnlHtml = tx.type === 'sell' && tx.realizedPnl != null
      ? '<span style="color:' + (tx.realizedPnl >= 0 ? 'var(--positive)' : 'var(--negative)') + ';font-weight:600">' + (tx.realizedPnl >= 0 ? '+' : '') + tx.realizedPnl.toFixed(2) + ' €</span>'
      : '<span style="color:var(--text3)">—</span>';
    return '<tr>' +
      '<td class="mono" style="font-size:10px;white-space:nowrap">' + dateStr + '</td>' +
      '<td><span class="' + (isBuy ? 'badge-pos' : 'badge-neg') + '" style="font-size:11px;padding:3px 10px">' + (isBuy ? '▲ ACHAT' : '▼ VENTE') + '</span></td>' +
      '<td style="font-size:12px">' + (tx.name || tx.ticker || '—') + '</td>' +
      '<td class="mono" style="font-size:12px">' + tx.qty + '</td>' +
      '<td class="mono hide-mobile" style="font-size:12px">' + tx.price.toFixed(2) + ' €</td>' +
      '<td class="mono" style="font-size:12px;white-space:nowrap">' + montant + ' €</td>' +
      '<td class="mono hide-mobile" style="font-size:12px">' + pnlHtml + '</td>' +
      '</tr>';
  }).join('');
}
let editRowIndex = -1;
let _perfJourMode = 'pct';
function togglePerfJourMode() {
  _perfJourMode = _perfJourMode === 'pct' ? 'eur' : 'pct';
  document.querySelectorAll('.perf-jour-cell').forEach(el => {
    el.textContent = el.dataset[_perfJourMode];
  });
  const th = document.getElementById('th-perf-jour');
  if (th) th.textContent = _perfJourMode === 'pct' ? 'Perf. jour %' : 'Perf. jour €';
}

function togglePortfolioDetail(i) {
  const detail = document.getElementById('portfolio-detail-' + i);
  const btn = detail.previousElementSibling.querySelector('.btn-voir-plus');
  const open = detail.classList.toggle('open');
  if (btn) btn.textContent = open ? '▴' : '▾';
}

let _reorderTmp = [];
function openReorderModal() {
  _reorderTmp = getPortfolio(currentUser).map(r => ({ ticker: r.ticker, name: r.name }));
  renderReorderList();
  document.getElementById('reorder-modal-overlay').style.display = 'flex';
}
function closeReorderModal() {
  document.getElementById('reorder-modal-overlay').style.display = 'none';
}
function renderReorderList() {
  const list = document.getElementById('reorder-list');
  list.innerHTML = _reorderTmp.map((r, i) => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--s2);border-radius:8px;border:1px solid var(--s3)">
      <span style="flex:1;font-size:13px;font-weight:500">${r.name || r.ticker}</span>
      <button onclick="moveReorderItem(${i},-1)" ${i===0?'disabled':''} style="width:28px;height:28px;border-radius:6px;border:1px solid var(--s3);background:var(--s1);color:var(--text2);cursor:pointer;font-size:14px">▲</button>
      <button onclick="moveReorderItem(${i},1)" ${i===_reorderTmp.length-1?'disabled':''} style="width:28px;height:28px;border-radius:6px;border:1px solid var(--s3);background:var(--s1);color:var(--text2);cursor:pointer;font-size:14px">▼</button>
    </div>
  `).join('');
}
function moveReorderItem(idx, dir) {
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= _reorderTmp.length) return;
  [_reorderTmp[idx], _reorderTmp[newIdx]] = [_reorderTmp[newIdx], _reorderTmp[idx]];
  renderReorderList();
}
function saveReorder() {
  const data = getPortfolio(currentUser);
  const ordered = _reorderTmp.map(r => data.find(d => d.ticker === r.ticker)).filter(Boolean);
  savePortfolio(currentUser, ordered);
  renderPortfolio();
  closeReorderModal();
}

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

// ─── CACHE RECHERCHES ─────────────────────────────────
const SEARCH_CACHE = new Map(); // query → {suggestions, ts}
const PRICE_CACHE  = new Map(); // ticker → {price, name, meta, ts}
const CACHE_TTL    = 5 * 60 * 1000;

function getCachedSearch(q) {
  const e = SEARCH_CACHE.get(q.toLowerCase());
  if (!e || Date.now() - e.ts > CACHE_TTL) { SEARCH_CACHE.delete(q.toLowerCase()); return null; }
  return e.suggestions;
}
function setCachedSearch(q, suggestions) {
  SEARCH_CACHE.set(q.toLowerCase(), { suggestions, ts: Date.now() });
}
function getCachedPrice(ticker) {
  const e = PRICE_CACHE.get(ticker);
  if (!e || Date.now() - e.ts > CACHE_TTL) { PRICE_CACHE.delete(ticker); return null; }
  return e;
}
function setCachedPrice(ticker, data) {
  PRICE_CACHE.set(ticker, { ...data, ts: Date.now() });
}

// ─── FX RATES (EUR conversion) ────────────────────────
let _fxRates = { USD: null, GBP: null }; // EUR per 1 unit

async function loadFxRates() {
  try {
    const [usdRes, gbpRes] = await Promise.allSettled([
      fetchWithFallback('https://query1.finance.yahoo.com/v8/finance/chart/EURUSD%3DX?interval=1d&range=1d'),
      fetchWithFallback('https://query1.finance.yahoo.com/v8/finance/chart/EURGBP%3DX?interval=1d&range=1d'),
    ]);
    if (usdRes.status === 'fulfilled') {
      const rate = JSON.parse(usdRes.value).chart?.result?.[0]?.meta?.regularMarketPrice;
      if (rate) _fxRates.USD = 1 / rate; // 1 USD = 1/EURUSD EUR
    }
    if (gbpRes.status === 'fulfilled') {
      const rate = JSON.parse(gbpRes.value).chart?.result?.[0]?.meta?.regularMarketPrice;
      if (rate) _fxRates.GBP = 1 / rate; // 1 GBP = 1/EURGBP EUR
    }
  } catch(e) {}
}

function toEur(price, currency) {
  if (!price) return price;
  const cu = (currency || 'EUR').toUpperCase();
  if (cu === 'EUR') return price;
  if (cu === 'USD') return _fxRates.USD ? price * _fxRates.USD : price;
  if (cu === 'GBP') return _fxRates.GBP ? price * _fxRates.GBP : price;
  if (cu === 'GBX' || cu === 'GBp') return _fxRates.GBP ? (price / 100) * _fxRates.GBP : price / 100;
  return price;
}

// ─── AUTOCOMPLETE SHARED ──────────────────────────────
let _ddActiveIdx = -1;

const PEA_ELIGIBLE_SUFFIXES = new Set([
  '.PA','.AS','.BR','.DE','.F','.HM','.BE','.MI','.MC','.VI','.HE','.ST','.CO','.OL','.LS','.SW','.IR','.AT','.PR','.BO','.WAR'
]);
const PEA_ELIGIBLE_EXCHANGES = ['paris','euronext','amsterdam','brussels','frankfurt','milan','madrid','lisbon','vienna','helsinki','stockholm','oslo','copenhagen'];

function getPeaEligibility(symbol, exchange) {
  const sym = (symbol || '').toUpperCase();
  const exch = (exchange || '').toLowerCase();
  const suffix = sym.match(/(\.[A-Z]+)$/)?.[1] || '';
  if (PEA_ELIGIBLE_SUFFIXES.has(suffix)) return 'yes';
  if (PEA_ELIGIBLE_EXCHANGES.some(e => exch.includes(e))) return 'yes';
  // Ticker sans suffixe ou suffixe US → non éligible
  if (!suffix || suffix === '.US') return 'no';
  return 'unknown';
}

async function fetchSuggestions(query) {
  const cached = getCachedSearch(query);
  if (cached) return cached;
  const localETF = searchETFLocal(query);
  if (localETF) {
    const suggs = [{ symbol: localETF.ticker, name: localETF.name, exchange: 'ETF' }];
    setCachedSearch(query, suggs);
    return suggs;
  }
  if (/^[A-Z0-9]{1,6}\.[A-Z]{1,3}$/i.test(query.trim())) {
    const suggs = [{ symbol: query.trim().toUpperCase(), name: query.trim().toUpperCase(), exchange: '' }];
    setCachedSearch(query, suggs);
    return suggs;
  }
  try {
    const url = 'https://query1.finance.yahoo.com/v1/finance/search?q=' + encodeURIComponent(query) + '&lang=fr&region=FR&quotesCount=6&newsCount=0';
    const raw = await fetchWithFallback(url);
    const sd = JSON.parse(raw);
    const quotes = (sd.quotes || []).filter(q => q.quoteType === 'EQUITY' || q.quoteType === 'ETF' || q.quoteType === 'MUTUALFUND').slice(0, 5);
    const suggs = quotes.map(q => ({ symbol: q.symbol, name: q.longname || q.shortname || q.symbol, exchange: q.exchDisp || q.exchange || '' }));
    setCachedSearch(query, suggs);
    return suggs;
  } catch { return []; }
}

let _ddCallback = null; // callback courant du dropdown actif

function renderDropdown(ddId, suggestions, onSelect) {
  const dd = document.getElementById(ddId);
  if (!suggestions.length) { dd.classList.remove('open'); dd.innerHTML = ''; return; }
  _ddActiveIdx = -1;
  _ddCallback = onSelect;
  dd.innerHTML = suggestions.map((s, i) => {
    const logoStr = LOGO_CACHE[s.symbol]
      ? '<img src="' + LOGO_CACHE[s.symbol] + '" style="width:22px;height:22px;border-radius:5px;object-fit:contain;background:var(--s3)" onerror="this.style.display=\'none\'">'
      : '<div style="width:22px;height:22px;border-radius:5px;background:var(--s3);display:grid;place-items:center;font-size:8px;font-weight:700;color:var(--accent);font-family:var(--mono)">' + s.symbol.replace(/\.[A-Z]+$/, '').slice(0,3) + '</div>';
    // Prix depuis cache si disponible
    const cached = getCachedPrice(s.symbol);
    const priceStr = cached ? toEur(cached.price, cached.currency).toFixed(2) + ' €' : '';
    const pea = getPeaEligibility(s.symbol, s.exchange);
    const peaBadge = pea === 'yes'
      ? '<span class="pea-badge pea-yes">PEA ✓</span>'
      : pea === 'no'
        ? '<span class="pea-badge pea-no">PEA ✗</span>'
        : '';
    return '<div class="search-dropdown-item" data-symbol="' + s.symbol + '" data-name="' + (s.name || s.symbol).replace(/"/g, '&quot;') + '" data-idx="' + i + '">' +
      logoStr +
      '<div style="flex:1;min-width:0"><div class="sd-name">' + (s.name || s.symbol) + '</div>' +
      '<div class="sd-ticker">' + s.symbol + (s.exchange ? '  ·  ' + s.exchange : '') + '</div></div>' +
      '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">' +
      '<div class="sd-price" id="sdp-' + ddId + '-' + i + '">' + priceStr + '</div>' +
      peaBadge +
      '</div>' +
      '</div>';
  }).join('');
  // Délégation d'événement — pas d'inline onclick
  dd.querySelectorAll('.search-dropdown-item').forEach(el => {
    el.addEventListener('click', () => {
      if (_ddCallback) _ddCallback(el.dataset.symbol, el.dataset.name);
    });
  });
  dd.classList.add('open');
  // Fetch prix en arrière-plan pour les items sans prix
  prefetchSuggestionPrices(ddId, suggestions);
}

async function prefetchSuggestionPrices(ddId, suggestions) {
  await Promise.allSettled(suggestions.map(async (s, i) => {
    const el = document.getElementById('sdp-' + ddId + '-' + i);
    if (!el || el.textContent) return; // déjà rempli depuis cache
    try {
      const raw = await fetchWithFallback(
        'https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(s.symbol) + '?interval=1d&range=1d'
      );
      const meta = JSON.parse(raw).chart?.result?.[0]?.meta;
      if (!meta?.regularMarketPrice) return;
      const priceEur = toEur(meta.regularMarketPrice, meta.currency);
      setCachedPrice(s.symbol, {
        price: meta.regularMarketPrice,
        name: s.name || s.symbol,
        currency: meta.currency || 'EUR',
        exchange: meta.exchangeName || '',
        changePct: meta.chartPreviousClose ? ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose * 100) : 0,
      });
      const el2 = document.getElementById('sdp-' + ddId + '-' + i);
      if (el2) el2.textContent = priceEur.toFixed(2) + ' €';
    } catch(e) {}
  }));
}

function closeDropdown(ddId) {
  const dd = document.getElementById(ddId);
  if (dd) { dd.classList.remove('open'); dd.innerHTML = ''; }
  _ddActiveIdx = -1;
}

function navigateDropdown(ddId, direction) {
  const dd = document.getElementById(ddId);
  const items = dd.querySelectorAll('.search-dropdown-item');
  if (!items.length) return;
  items[_ddActiveIdx]?.classList.remove('active');
  _ddActiveIdx = Math.max(0, Math.min(items.length - 1, _ddActiveIdx + direction));
  items[_ddActiveIdx]?.classList.add('active');
  items[_ddActiveIdx]?.scrollIntoView({ block: 'nearest' });
}

function openModal() {
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('modal-ticker').value = '';
  document.getElementById('modal-qty').value = '';
  document.getElementById('modal-buy-price').value = '';
  document.getElementById('search-result').classList.remove('visible');
  document.getElementById('res-logo').innerHTML = '';
  document.getElementById('search-status').innerHTML = '';
  document.getElementById('btn-confirm').disabled = true;
  closeDropdown('search-dropdown');
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
    closeDropdown('search-dropdown');
    return;
  }

  searchTimer = setTimeout(async () => {
    const suggs = await fetchSuggestions(val);
    if (!suggs.length) {
      document.getElementById('search-status').innerHTML = '<div class="status-error">⚠ Introuvable.</div>';
      return;
    }
    renderDropdown('search-dropdown', suggs, selectPortfolioSuggestion);
    // Prefetch logo en arrière-plan
    suggs.forEach(s => { if (!LOGO_CACHE[s.symbol]) fetchLogo(s.symbol, s.name); });
  }, 350);
}

function onTickerKeydown(e) {
  const dd = document.getElementById('search-dropdown');
  if (!dd.classList.contains('open')) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); navigateDropdown('search-dropdown', 1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); navigateDropdown('search-dropdown', -1); }
  else if (e.key === 'Enter' && _ddActiveIdx >= 0) {
    e.preventDefault();
    dd.querySelectorAll('.search-dropdown-item')[_ddActiveIdx]?.click();
  } else if (e.key === 'Escape') closeDropdown('search-dropdown');
}

async function selectPortfolioSuggestion(symbol, name) {
  closeDropdown('search-dropdown');
  document.getElementById('modal-ticker').value = name || symbol;
  document.getElementById('search-status').innerHTML = '<div class="status-loading"><span class="loading-spinner"></span> Récupération du cours…</div>';
  await fetchPrice(symbol);
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
  function tryAllorigins(u) {
    return fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(u), {signal: AbortSignal.timeout(4000)})
      .then(r => r.json()).then(j => { if (!j.contents || j.contents === 'null') throw new Error('empty'); return j.contents; });
  }
  function tryCorsproxy(u) {
    return fetch('https://corsproxy.io/?' + encodeURIComponent(u), {signal: AbortSignal.timeout(4000)})
      .then(r => { if (!r.ok) throw new Error('not ok'); return r.text(); });
  }
  function tryCorsEu(u) {
    return fetch('https://cors.eu.org/' + u, {signal: AbortSignal.timeout(5000)})
      .then(r => { if (!r.ok) throw new Error('not ok'); return r.text(); });
  }
  function tryCodetabs(u) {
    return fetch('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u), {signal: AbortSignal.timeout(5000)})
      .then(r => { if (!r.ok) throw new Error('not ok'); return r.text(); });
  }

  function isValidRaw(raw) {
    try {
      const p = JSON.parse(raw);
      if (p.chart && p.chart.error && p.chart.error.code) return false;
      if (p.finance && p.finance.error) return false;
      return true;
    } catch { return false; }
  }

  // Round 1 : corsproxy en premier (allorigins trop souvent 429)
  try {
    const raw = await tryCorsproxy(url);
    if (isValidRaw(raw)) return raw;
  } catch {}

  // Round 2 : cors.eu.org + codetabs + allorigins en dernier recours
  const fallbacks = [
    () => tryCorsEu(url),
    () => tryCodetabs(url),
    () => tryAllorigins(url.replace('query1.', 'query2.')),
  ];
  for (const fn of fallbacks) {
    try {
      const raw = await fn();
      if (isValidRaw(raw)) return raw;
    } catch {}
  }
  throw new Error('Service temporairement indisponible. Réessayez dans quelques secondes.');
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
const TICKER_ALIASES = { 'CV9.PA': 'VAL.PA', 'TTE': 'TTE.PA' };
function resolveToYahooTicker(ticker) {
  if (!ticker) return ticker;
  if (TICKER_ALIASES[ticker]) return TICKER_ALIASES[ticker];
  if (ISIN_MAP[ticker]) return ISIN_MAP[ticker];
  return ticker;
}

// ── LOGO FETCHING ──────────────────────────────────────
// Persist logo cache to localStorage so logos survive reloads
const LOGO_CACHE_VERSION = 'v5'; // bump to purge stale hardcoded entries
function loadLogoCache() {
  try {
    if (localStorage.getItem('pea_logos_ver') !== LOGO_CACHE_VERSION) {
      localStorage.removeItem('pea_logos');
      localStorage.setItem('pea_logos_ver', LOGO_CACHE_VERSION);
      return;
    }
    const saved = JSON.parse(localStorage.getItem('pea_logos') || '{}');
    for (const [k, v] of Object.entries(saved)) {
      if (v && !v.includes('clearbit')) LOGO_CACHE[k] = v;
    }
  } catch(e) {}
}
function saveLogoCache() {
  try { localStorage.setItem('pea_logos', JSON.stringify(LOGO_CACHE)); } catch(e) {}
}
loadLogoCache();

// Domaines de secours pour tickers dont le nom ne suffit pas à deviner le domaine
const FALLBACK_DOMAINS = {
  'MC.PA':'lvmh.com','OR.PA':'loreal.com','AI.PA':'airliquide.com','AIR.PA':'airbus.com',
  'BNP.PA':'bnpparibas.com','SAN.PA':'sanofi.com','TTE.PA':'totalenergies.com','TTE':'totalenergies.com',
  'SU.PA':'se.com','DG.PA':'vinci.com','RMS.PA':'hermes.com','BN.PA':'danone.com',
  'ACA.PA':'credit-agricole.com','CS.PA':'axa.com','RNO.PA':'renault.com',
  'ORA.PA':'orange.com','SGO.PA':'saint-gobain.com','ENGI.PA':'engie.com',
  'GLE.PA':'societegenerale.com','VIE.PA':'veolia.com','DSY.PA':'3ds.com',
  'EN.PA':'bouygues.com','HO.PA':'thalesgroup.com','ML.PA':'michelin.com',
  'AAPL':'apple.com','MSFT':'microsoft.com','GOOGL':'google.com','GOOG':'google.com',
  'AMZN':'amazon.com','META':'meta.com','TSLA':'tesla.com','NVDA':'nvidia.com',
  'NFLX':'netflix.com','DIS':'disney.com','PYPL':'paypal.com','ADBE':'adobe.com',
};

// Dérive un domaine depuis le nom officiel de la société (zéro requête réseau)
function companyNameToDomain(name) {
  if (!name) return null;
  const clean = name
    .replace(/\b(S\.A\.|S\.A|SE|Inc\.|Inc|Corp\.|Corp|Ltd\.|Ltd|PLC|N\.V\.|NV|AG|GmbH|SAS|SA|LLC|Co\.|Co|Group|Holdings?|Holding|Société Anonyme|Moët Hennessy)\b/gi, '')
    .replace(/[''·\-,]/g, ' ')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
  return clean.length > 2 ? clean + '.com' : null;
}

// Fetch logo : nom société → domaine, fallback map, fallback ticker (aucun appel réseau extra)
function fetchLogo(ticker, companyName) {
  if (LOGO_CACHE[ticker]) return Promise.resolve(LOGO_CACHE[ticker]);

  const ETF_LOGO = 'https://raw.githubusercontent.com/armelpltr/Dashboard-PEA/main/data/ETF-Database-Logo2-wPadding_RGB%20(1)%20square.png';

  if (isETF(ticker)) {
    LOGO_CACHE[ticker] = ETF_LOGO;
    saveLogoCache();
    return Promise.resolve(ETF_LOGO);
  }

  // 1. Domaine de secours explicite (tickers dont le nom ne donne pas le bon domaine)
  const fallbackDomain = FALLBACK_DOMAINS[ticker];
  if (fallbackDomain) {
    const url = 'https://www.google.com/s2/favicons?domain=' + fallbackDomain + '&sz=128';
    LOGO_CACHE[ticker] = url;
    saveLogoCache();
    return Promise.resolve(url);
  }

  // 2. Domaine dérivé du nom officiel de la société
  const nameDomain = companyNameToDomain(companyName);
  if (nameDomain) {
    const url = 'https://www.google.com/s2/favicons?domain=' + nameDomain + '&sz=128';
    LOGO_CACHE[ticker] = url;
    saveLogoCache();
    return Promise.resolve(url);
  }

  // 3. Dernier recours : devine depuis le ticker (non caché → retente au prochain chargement)
  const clean = ticker.replace(/\.[A-Z]+$/i, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return Promise.resolve('https://www.google.com/s2/favicons?domain=' + clean + '.com&sz=128');
}

// Fetch logos for all portfolio + watchlist tickers in background
let _logoFetchRunning = false;
async function fetchAllLogos() {
  if (!currentUser || _logoFetchRunning) return;
  _logoFetchRunning = true;
  const portfolioItems  = getPortfolio(currentUser);
  const watchlistItems  = getWatchlist(currentUser);
  const portfolioTickers = portfolioItems.map(r => r.ticker);
  const watchlistTickers = watchlistItems.map(w => w.ticker);
  const nameMap = {};
  [...portfolioItems, ...watchlistItems].forEach(item => {
    if (item.ticker && item.name) nameMap[item.ticker] = item.name;
  });
  const tickers = [...new Set([...portfolioTickers, ...watchlistTickers].filter(Boolean))];
  let anyPortfolio = false;
  let anyWatchlist = false;
  for (const ticker of tickers) {
    if (!LOGO_CACHE[ticker]) {
      await fetchLogo(ticker, nameMap[ticker]);
      if (portfolioTickers.includes(ticker)) anyPortfolio = true;
      if (watchlistTickers.includes(ticker)) anyWatchlist = true;
    }
  }
  _logoFetchRunning = false;
  if (anyPortfolio) renderPortfolio();
  if (anyWatchlist) renderWatchlist();
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

// Version agrandie pour les modaux d'ajout (44px, sans padding parasite)
function logoHtmlModal(ticker) {
  const abbr = ticker.replace(/\.[A-Z]+$/, '').slice(0, 3).toUpperCase();
  const url  = LOGO_CACHE[ticker] || null;
  const base = 'width:44px;height:44px;border-radius:12px;flex-shrink:0;display:grid;place-items:center;';
  if (!url) {
    return '<div style="' + base + 'background:var(--s3);border:1px solid var(--border2);font-size:10px;font-weight:700;color:var(--accent);font-family:var(--mono)">' + abbr + '</div>';
  }
  const onErr = 'this.parentNode.innerHTML=\x22' + abbr + '\x22;this.parentNode.style.fontSize=\x2210px\x22';
  return '<div style="' + base + 'background:var(--s3);border:1px solid var(--border2);overflow:hidden">' +
    '<img src="' + url + '" style="width:32px;height:32px;object-fit:contain" onerror="' + onErr + '">' +
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
    statusEl.innerHTML = '<div class="status-loading"><span class="loading-spinner"></span> Récupération du cours…</div>';

    // Résolution du symbole Yahoo Finance
    let best;
    const localETF = searchETFLocal(query);
    if (localETF) {
      best = { symbol: localETF.ticker, longname: localETF.name, quoteType: 'ETF' };
    } else if (/^[A-Z0-9]{1,6}\.[A-Z]{1,3}$/i.test(query.trim()) || /^[A-Z]{2,6}$/.test(query.trim())) {
      // Ticker direct (avec ou sans suffixe exchange)
      best = { symbol: query.trim().toUpperCase(), longname: null, quoteType: 'EQUITY' };
    } else {
      // Recherche par nom — vérifie le cache d'abord
      const cached = getCachedSearch(query);
      const suggs = cached || await fetchSuggestions(query);
      if (!suggs.length) throw new Error('Introuvable. Essayez le ticker (ex: MC.PA, IWDA.AS, AAPL).');
      best = { symbol: suggs[0].symbol, longname: suggs[0].name, quoteType: 'EQUITY' };
    }

    // Cache prix
    const cachedPrice = getCachedPrice(best.symbol);
    if (cachedPrice) {
      foundPrice = cachedPrice.price; foundName = cachedPrice.name; foundTicker = best.symbol;
      document.getElementById('res-name').textContent  = foundName;
      document.getElementById('res-price').textContent = toEur(foundPrice, cachedPrice.currency).toFixed(2) + ' €';
      document.getElementById('res-info').textContent  = best.symbol + '  ·  ' + cachedPrice.exchange + '  ·  ' + (cachedPrice.changePct >= 0 ? '▲' : '▼') + ' ' + Math.abs(cachedPrice.changePct).toFixed(2) + "% aujourd'hui";
      const resLogoEl = document.getElementById('res-logo');
      resLogoEl.innerHTML = logoHtmlModal(foundTicker);
      if (!LOGO_CACHE[foundTicker]) fetchLogo(foundTicker, foundName).then(() => { resLogoEl.innerHTML = logoHtmlModal(foundTicker); });
      statusEl.innerHTML = ''; resultEl.classList.add('visible');
      document.getElementById('btn-confirm').disabled = false;
      if (!document.getElementById('modal-buy-price').value) document.getElementById('modal-buy-price').value = foundPrice.toFixed(2);
      return;
    }

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

    setCachedPrice(best.symbol, { price: foundPrice, name: foundName, currency: meta.currency || '', exchange: meta.exchangeName || '', changePct });

    document.getElementById('res-name').textContent  = foundName;
    document.getElementById('res-price').textContent =
      toEur(foundPrice, meta.currency).toFixed(2) + ' €';
    document.getElementById('res-info').textContent  =
      best.symbol + '  ·  ' + (meta.exchangeName || '') +
      '  ·  ' + (isPos ? '▲' : '▼') + ' ' + Math.abs(changePct).toFixed(2) + "% aujourd'hui";

    // Logo — affiche immédiatement (cache ou abbr), met à jour après fetch
    const resLogoEl = document.getElementById('res-logo');
    resLogoEl.innerHTML = logoHtmlModal(foundTicker);
    if (!LOGO_CACHE[foundTicker]) {
      fetchLogo(foundTicker, foundName).then(() => {
        resLogoEl.innerHTML = logoHtmlModal(foundTicker);
      });
    }

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
  if (foundTicker) fetchLogo(foundTicker, foundName).then(() => renderPortfolio());
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
      const qsBase = 'https://query1.finance.yahoo.com/v11/finance/quoteSummary/' +
        encodeURIComponent(resolveToYahooTicker(ticker)) + '?modules=' + modules;
      const qsUrl = qsBase;
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
    if (sublabel) sublabel.textContent = IC.barchart + ' ' + fs.total.toFixed(1) + '/25 · ' + fs.conviction;
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
let portfolioPeriod   = 'max';

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

function toggleVersementsList() {
  const el = document.getElementById('versements-list');
  if (el.style.display === 'none') {
    renderVersementsList();
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}

function renderVersementsList() {
  const v = getVersements(currentUser);
  const el = document.getElementById('versements-list');
  if (!v.length) {
    el.innerHTML = '<div style="color:var(--text3);font-size:11px">Aucun versement.</div>';
    return;
  }
  const sorted = v.map((x, i) => ({ ...x, _i: i })).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  el.innerHTML = sorted.map(x =>
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;border-bottom:1px solid var(--border);font-size:11px">' +
      '<span style="color:var(--text2)">' + (x.date || '?') + '</span>' +
      '<span style="font-family:var(--mono);color:var(--text)">' + x.amount.toFixed(2) + ' €</span>' +
      '<button onclick="deleteVersement(' + x._i + ')" style="background:none;border:none;color:var(--negative);cursor:pointer;font-size:13px;padding:2px 6px" title="Supprimer">✕</button>' +
    '</div>'
  ).join('');
}

function deleteVersement(index) {
  if (!confirm('Supprimer ce versement ?')) return;
  const v = getVersements(currentUser);
  v.splice(index, 1);
  saveVersements(currentUser, v);
  renderVersementsList();
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

    // Plus-value latente = valeur actuelle - coût de revient
    let totalVal = 0, totalInvested = 0;
    data.forEach(r => { totalVal += r.qty * r.currentPrice; totalInvested += r.qty * r.buyPrice; });
    const totalPnl = totalVal - totalInvested;
    const isUp  = totalPnl >= 0;
    const pct   = totalInvested > 0 ? (totalPnl / totalInvested * 100).toFixed(2) : '0.00';
    const sign  = totalPnl >= 0 ? '+' : '';
    const color = isUp ? '#00e09e' : '#ff4d6a';

    const pctEl = document.getElementById('portf-pct-display');
    if (pctEl) {
      pctEl.dataset.pct = sign + pct + '%';
      pctEl.dataset.eur = (totalPnl >= 0 ? '+' : '') + totalPnl.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
      pctEl.textContent = pctEl.dataset.pct;
      pctEl.style.color = color;
      pctEl.style.cursor = 'pointer';
      pctEl.onclick = () => { pctEl.textContent = pctEl.textContent === pctEl.dataset.pct ? pctEl.dataset.eur : pctEl.dataset.pct; };
    }

    // ── Tagline dynamique ────────────────────────────────────────────────────
    const taglineEl = document.getElementById('portf-tagline');
    if (taglineEl) {
      const nDays  = Math.round((now - oldestTs) / 86400);
      const xEur   = (totalPnl >= 0 ? '+' : '') + totalPnl.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
      const oldestDate = new Date(oldestTs * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      const positives = [
        `${xEur} générés en ${nDays} jours · patience récompensée`,
        `${nDays} jours investis · votre discipline paie`,
        `+${pct}% · vous faites mieux que la majorité des épargnants`,
        `${xEur} de plus · chaque jour investi compte`,
        `+${pct}% · votre PEA travaille pendant que vous dormez`,
        `${nDays} jours de cap maintenu · bravo`,
        `${xEur} · c'est ça, l'effet du temps en bourse`,
        `"Le risque vient de ne pas savoir ce qu'on fait" — Warren Buffett`,
        `"L'investissement est simple, mais pas facile" — Warren Buffett`,
        `"En bourse, le temps est votre meilleur ami" — Warren Buffett`,
      ];
      const negatives = [
        `Tout investisseur connaît des jours comme celui-ci`,
        `La patience est la première vertu de l'investisseur`,
        `Chaque grand portefeuille a traversé des tempêtes`,
        `Ce n'est qu'une étape · votre cap reste le bon`,
        `Le temps est le seul allié qui ne trahit jamais`,
        `Les plus belles hausses succèdent aux baisses`,
        `Même les meilleurs investisseurs ont connu ça`,
        `Rester investi, c'est déjà gagner sur le long terme`,
        `"La bourse transfère l'argent des impatients aux patients" — Warren Buffett`,
        `"Ne testez jamais la profondeur d'un fleuve avec les deux pieds" — W. Buffett`,
      ];
      const pool = isUp ? positives : negatives;
      // Phrase du jour — change chaque jour, stable dans la journée
      const dayIndex = Math.floor(Date.now() / 86400000) % pool.length;
      taglineEl.textContent = pool[dayIndex];
    }

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
    const dataValues = dataset.map(p => p.valeurTotale > 0 ? p.valeurTotale : null);
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
            borderColor: color,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: color,
            tension: 0.2,
            fill: true,
            spanGaps: true,
            backgroundColor: (ctx2) => {
              const g = ctx2.chart.ctx.createLinearGradient(0, 0, 0, 130);
              g.addColorStop(0, isUp ? 'rgba(0,224,158,0.18)' : 'rgba(255,77,106,0.18)');
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
        maintainAspectRatio: false,
        animation: { duration: 1200, easing: "easeOutQuart" },
        interaction: { mode: 'index', intersect: false },
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
              label: function(ctx) {
                if (ctx.datasetIndex === 0)
                  return ' ' + ctx.parsed.y.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
                if (ctx.parsed.y === null) return null;
                const label = ctx.datasetIndex === 1 ? IC.dotGreen + ' Achat' : IC.dotRed + ' Vente';
                return ' ' + label + ' · ' + ctx.parsed.y.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
              }
            }
          }
        },
        scales: {
          x: { display: false },
          y: { display: false, beginAtZero: false }
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

let _statScrollTimer = null;
function initStatCardsScroll() {
  if (_statScrollTimer) { clearInterval(_statScrollTimer); _statScrollTimer = null; }

  const grid = document.querySelector('.stats-scroll-wrap .stats-grid');
  if (!grid) return;

  let paused = false;

  grid.addEventListener('touchstart', () => { paused = true; }, { passive: true });
  grid.addEventListener('touchend',   () => { setTimeout(() => { paused = false; }, 2500); }, { passive: true });
  grid.addEventListener('mouseenter', () => { paused = true; });
  grid.addEventListener('mouseleave', () => { paused = false; });

  _statScrollTimer = setInterval(() => {
    if (paused) return;
    grid.scrollLeft += 1;
    if (grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 1) {
      grid.scrollLeft = 0;
    }
  }, 30);
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
// ═══════════════════════════════════════════════════
// FEATURE 1: LIGHT/DARK TOGGLE (désactivé — dark forcé)
// ═══════════════════════════════════════════════════
function toggleTheme() {
  // Fonction conservée pour compat, mais désactivée : on reste en dark.
}
// Force le mode sombre au chargement et nettoie toute pref
(function(){
  try {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('pea_theme');
  } catch(e){}
})();

// ═══════════════════════════════════════════════════
// FEATURE 2: COLOR THEME (désactivé — violet forcé)
// ═══════════════════════════════════════════════════
function setColorTheme(color) {
  // Fonction conservée pour compat, mais désactivée : on reste en violet.
}
(function(){
  try {
    document.documentElement.removeAttribute('data-color');
    localStorage.removeItem('pea_color');
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

function exportDebugData() {
  const portfolio = getPortfolio(currentUser);
  const txs = getTransactions(currentUser);
  const versements = getVersements(currentUser);
  const data = { portfolio, transactions: txs, versements };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'debug_pea_' + currentUser + '.json';
  a.click(); URL.revokeObjectURL(url);
}

function exportVersementsCSV() {
  const versements = getVersements(currentUser);
  if (!versements.length) { alert('Aucun versement.'); return; }
  const header = 'Date,Montant\n';
  const rows = versements.sort((a,b) => (a.date||'').localeCompare(b.date||'')).map(v => v.date + ',' + v.amount.toFixed(2)).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'versements_' + currentUser + '.csv'; a.click(); URL.revokeObjectURL(url);
}

function exportTransactionsCSV() {
  const txs = getTransactions(currentUser);
  if (!txs.length) { alert('Aucune transaction.'); return; }
  const header = 'Date,Type,Ticker,Nom,Quantité,Prix,Montant,PnL Réalisé\n';
  const rows = txs.sort((a,b) => (a.date||'').localeCompare(b.date||'')).map(t => {
    const montant = (t.qty * t.price).toFixed(2);
    const pnl = t.realizedPnl != null ? t.realizedPnl.toFixed(2) : '';
    return [t.date, t.type, t.ticker, (t.name||'').replace(/,/g,' '), t.qty, t.price.toFixed(2), montant, pnl].join(',');
  }).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'transactions_' + currentUser + '.csv'; a.click(); URL.revokeObjectURL(url);
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
      'Valorisation au ' + d.toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
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
  document.getElementById('wl-logo').innerHTML = '';
  document.getElementById('wl-status').innerHTML = '';
  document.getElementById('btn-wl-confirm').disabled = true;
  closeDropdown('wl-dropdown');
  wlFoundTicker = null; wlFoundName = null; wlFoundPrice = null;
  setTimeout(() => document.getElementById('wl-ticker').focus(), 100);
}
function closeWatchlistModal() {
  document.getElementById('watchlist-modal-overlay').classList.remove('open');
  closeDropdown('wl-dropdown');
}
function onWlInput() {
  clearTimeout(wlTimer);
  const val = document.getElementById('wl-ticker').value.trim();
  document.getElementById('wl-result').classList.remove('visible');
  document.getElementById('btn-wl-confirm').disabled = true;
  wlFoundPrice = null;
  if (val.length < 2) { document.getElementById('wl-status').innerHTML = ''; closeDropdown('wl-dropdown'); return; }
  wlTimer = setTimeout(async () => {
    const suggs = await fetchSuggestions(val);
    if (!suggs.length) { document.getElementById('wl-status').innerHTML = '<div class="status-error">⚠ Introuvable.</div>'; return; }
    renderDropdown('wl-dropdown', suggs, selectWatchlistSuggestion);
    suggs.forEach(s => { if (!LOGO_CACHE[s.symbol]) fetchLogo(s.symbol, s.name); });
  }, 350);
}
function onWlKeydown(e) {
  const dd = document.getElementById('wl-dropdown');
  if (!dd.classList.contains('open')) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); navigateDropdown('wl-dropdown', 1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); navigateDropdown('wl-dropdown', -1); }
  else if (e.key === 'Enter' && _ddActiveIdx >= 0) {
    e.preventDefault();
    dd.querySelectorAll('.search-dropdown-item')[_ddActiveIdx]?.click();
  } else if (e.key === 'Escape') closeDropdown('wl-dropdown');
}
async function selectWatchlistSuggestion(symbol, name) {
  closeDropdown('wl-dropdown');
  document.getElementById('wl-ticker').value = name || symbol;
  document.getElementById('wl-status').innerHTML = '<div class="status-loading"><span class="loading-spinner"></span> Récupération du cours…</div>';
  try {
    const cached = getCachedPrice(symbol);
    let price, currency, pct;
    if (cached) {
      price = cached.price; currency = cached.currency; pct = cached.changePct;
      wlFoundName = cached.name;
    } else {
      const cRaw = await fetchWithFallback('https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(symbol) + '?interval=1d&range=5d');
      const meta = JSON.parse(cRaw).chart.result[0].meta;
      price = meta.regularMarketPrice;
      currency = meta.currency || '';
      const prev = meta.chartPreviousClose || meta.previousClose || price;
      pct = prev ? ((price - prev) / prev * 100) : 0;
      wlFoundName = name || symbol;
      setCachedPrice(symbol, { price, name: wlFoundName, currency, exchange: meta.exchangeName || '', changePct: pct });
    }
    wlFoundPrice = price; wlFoundTicker = symbol;
    document.getElementById('wl-res-name').textContent  = wlFoundName;
    document.getElementById('wl-res-price').textContent = toEur(price, currency).toFixed(2) + ' €';
    document.getElementById('wl-res-info').textContent  = symbol + ' · ' + (pct >= 0 ? '▲' : '▼') + ' ' + Math.abs(pct).toFixed(2) + '%';
    const wlLogoEl = document.getElementById('wl-logo');
    wlLogoEl.innerHTML = logoHtmlModal(symbol);
    if (!LOGO_CACHE[symbol]) fetchLogo(symbol, wlFoundName).then(() => { wlLogoEl.innerHTML = logoHtmlModal(symbol); });
    document.getElementById('wl-status').innerHTML = '';
    document.getElementById('wl-result').classList.add('visible');
    document.getElementById('btn-wl-confirm').disabled = false;
  } catch(err) {
    document.getElementById('wl-status').innerHTML = '<div class="status-error">⚠ ' + (err.message || 'Erreur') + '</div>';
  }
}
function confirmWatchlistAdd() {
  if (!wlFoundTicker || !wlFoundPrice) return;
  const wl = getWatchlist(currentUser);
  if (wl.find(w => w.ticker === wlFoundTicker)) { alert('Déjà dans la watchlist.'); return; }
  wl.push({ name: wlFoundName, ticker: wlFoundTicker, price: wlFoundPrice, addedPrice: wlFoundPrice, addedAt: new Date().toISOString() });
  saveWatchlist(currentUser, wl);
  closeWatchlistModal();
  fetchLogo(wlFoundTicker, wlFoundName).then(() => renderWatchlist());
}
function removeFromWatchlist(i) {
  const wl = getWatchlist(currentUser);
  wl.splice(i, 1);
  saveWatchlist(currentUser, wl);
  renderWatchlist();
}
// ─────────────────────────────────────────────────────────────────
//  WATCHLIST enrichie : prix live, variation jour, sparkline 30j,
//  perf depuis ajout, dividend yield.
//
//  Stratégie : render immédiat avec placeholders, puis fetch Yahoo
//  en parallèle pour chaque ticker et maj progressive des cellules.
// ─────────────────────────────────────────────────────────────────
async function renderWatchlist() {
  const wl = getWatchlist(currentUser);
  const tbody = document.getElementById('watchlist-tbody');
  const empty = document.getElementById('watchlist-empty');
  if (!wl.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  const fmtPct = v => (v == null ? '—' : (v >= 0 ? '+' : '') + v.toFixed(2) + ' %');
  const col = v => v == null ? 'var(--text2)' : (v >= 0 ? 'var(--positive)' : 'var(--negative)');

  // Rendu initial avec placeholders "…"
  tbody.innerHTML = wl.map((w, i) => {
    const rowId = 'wl-row-' + i;
    const addedPrice = w.addedPrice || w.price; // compat données existantes
    return (
      '<tr id="' + rowId + '" class="wl-row-clickable" onclick="toggleWatchlistChart(' + i + ',\'' + w.ticker + '\')">' +
        '<td><div class="ticker-cell">' + logoHtml(w.ticker, 26, 'ticker-icon') +
          '<div><div class="ticker-name">' + (w.name || w.ticker) + '</div>' +
          '<div class="ticker-sym">' + w.ticker + '</div></div></div></td>' +
        '<td class="mono wl-price" style="text-align:right">…</td>' +
        '<td class="mono wl-daychg" style="text-align:right;color:var(--text2)">…</td>' +
        '<td class="wl-spark" style="min-width:120px;width:120px;padding:0 8px"><div style="height:30px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:10px">…</div></td>' +
        '<td class="mono wl-since" style="text-align:right;color:var(--text2)" title="Depuis le ' + (w.addedAt ? w.addedAt.slice(0,10) : '?') + ' @ ' + (addedPrice ? addedPrice.toFixed(2) + ' €' : '?') + '">…</td>' +
        '<td style="text-align:right"><button class="btn-del" onclick="event.stopPropagation();removeFromWatchlist(' + i + ')" title="Retirer">✕</button></td>' +
      '</tr>' +
      '<tr id="wl-chart-row-' + i + '" class="wl-chart-row" style="display:none">' +
        '<td colspan="6">' +
          '<div class="wl-chart-wrap">' +
            '<div class="wl-chart-header">' +
              '<div class="wl-chart-info">' +
                '<div class="wl-chart-price" id="wl-cprice-' + i + '">—</div>' +
                '<div class="wl-chart-change" id="wl-cchange-' + i + '"></div>' +
              '</div>' +
              '<div class="wl-period-bar" id="wl-pbar-' + i + '">' +
                ['1J','5J','1M','6M','AAJ','1A','5A','ALL'].map((p, pi) =>
                  '<button class="wl-period-btn' + (pi === 2 ? ' active' : '') + '" onclick="event.stopPropagation();wlSetPeriod(' + i + ',\'' + w.ticker + '\',\'' + p + '\',this)">' + p + '</button>'
                ).join('') +
              '</div>' +
            '</div>' +
            '<div class="wl-chart-canvas-wrap">' +
              '<div class="wl-chart-loading" id="wl-cloading-' + i + '">Chargement…</div>' +
              '<canvas id="wl-canvas-' + i + '" style="display:none"></canvas>' +
            '</div>' +
          '</div>' +
        '</td>' +
      '</tr>'
    );
  }).join('');

  // Fetch en parallèle pour chaque ticker
  wl.forEach((w, i) => enrichWatchlistRow(w, i));
}

// Cache 5 minutes pour les charts watchlist (prix live bougent)
const _wlChartCache = {};
const _WL_CACHE_TTL_MS = 5 * 60 * 1000;
async function fetchWatchlistChart(ticker) {
  const now = Date.now();
  const cached = _wlChartCache[ticker];
  if (cached && (now - cached.ts) < _WL_CACHE_TTL_MS) return cached.raw;
  const yt = resolveToYahooTicker(ticker);
  const raw = await fetchWithFallback(
    'https://query1.finance.yahoo.com/v8/finance/chart/'
    + encodeURIComponent(yt) + '?interval=1d&range=2mo'
  );
  _wlChartCache[ticker] = { ts: now, raw };
  return raw;
}

// ─── WATCHLIST INLINE CHART ───────────────────────
const _wlChartInstances = {};
const _wlChartPeriodCache = {};
const _WL_PERIOD_CACHE_TTL = 5 * 60 * 1000;

const WL_PERIODS = {
  '1J':  { range: '1d',  interval: '5m'  },
  '5J':  { range: '5d',  interval: '15m' },
  '1M':  { range: '1mo', interval: '1d'  },
  '6M':  { range: '6mo', interval: '1d'  },
  'AAJ': { range: 'ytd', interval: '1d'  },
  '1A':  { range: '1y',  interval: '1d'  },
  '5A':  { range: '5y',  interval: '1wk' },
  'ALL': { period1: 946886400,            interval: '1mo' },
};

function toggleWatchlistChart(i, ticker) {
  const chartRow = document.getElementById('wl-chart-row-' + i);
  const dataRow  = document.getElementById('wl-row-' + i);
  if (!chartRow) return;
  const isOpen = chartRow.style.display !== 'none';
  if (isOpen) {
    chartRow.style.display = 'none';
    dataRow.classList.remove('expanded');
  } else {
    chartRow.style.display = '';
    dataRow.classList.add('expanded');
    if (!_wlChartInstances[i]) {
      loadWlChart(i, ticker, '1M');
    }
  }
}

function wlSetPeriod(i, ticker, period, btn) {
  const bar = document.getElementById('wl-pbar-' + i);
  if (bar) bar.querySelectorAll('.wl-period-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  loadWlChart(i, ticker, period);
}

async function loadWlChart(i, ticker, period) {
  const canvas   = document.getElementById('wl-canvas-' + i);
  const loading  = document.getElementById('wl-cloading-' + i);
  const elPrice  = document.getElementById('wl-cprice-' + i);
  const elChange = document.getElementById('wl-cchange-' + i);
  if (!canvas) return;

  if (loading) { loading.style.display = 'flex'; canvas.style.display = 'none'; }

  const periodDef = WL_PERIODS[period] || WL_PERIODS['1M'];
  const { interval } = periodDef;
  const cacheKey = ticker + '_' + period;

  try {
    const now = Date.now();
    const cached = _wlChartPeriodCache[cacheKey];
    let raw = (cached && (now - cached.ts) < _WL_PERIOD_CACHE_TTL) ? cached.raw : null;
    if (!raw) {
      const yt = resolveToYahooTicker(ticker);
      let url;
      if (periodDef.period1) {
        const p2 = Math.floor(Date.now() / 1000);
        url = 'https://query1.finance.yahoo.com/v8/finance/chart/'
          + encodeURIComponent(yt) + '?period1=' + periodDef.period1 + '&period2=' + p2
          + '&interval=' + interval + '&includePrePost=true&events=div%7Csplit%7Cearn&lang=fr-FR&region=FR';
      } else {
        const cb = Math.floor(Date.now() / 300000); // change toutes les 5 min → bypass proxy cache
        url = 'https://query1.finance.yahoo.com/v8/finance/chart/'
          + encodeURIComponent(yt) + '?interval=' + interval + '&range=' + periodDef.range + '&_=' + cb;
      }
      raw = await fetchWithFallback(url);
      _wlChartPeriodCache[cacheKey] = { raw, ts: now };
    }

    const d = JSON.parse(raw);
    const res = d.chart && d.chart.result && d.chart.result[0];
    if (!res) throw new Error('no data');

    const meta   = res.meta || {};
    const ts     = res.timestamp || [];
    const quote  = res.indicators && res.indicators.quote && res.indicators.quote[0];
    const closes = (quote && quote.close) || [];
    const opens  = (quote && quote.open)  || [];

    const pts = [], labels = [];
    const isIntraday = interval === '5m'; // 5J (15m) n'est pas intraday : affiche perf 5 jours
    for (let k = 0; k < ts.length; k++) {
      if (closes[k] == null) continue;
      pts.push(closes[k]);
      const dt = new Date(ts[k] * 1000);
      labels.push((interval === '5m' || interval === '15m')
        ? dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        : dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
      );
    }

    const livePrice  = meta.regularMarketPrice;
    const prevClose  = meta.chartPreviousClose || meta.previousClose;
    const livePriceEur = livePrice != null ? toEur(livePrice, meta.currency) : null;

    // Pour 5J : référence = close d'exactement 5 jours de trading en arrière (pas dans range=5d)
    let ref5j = null;
    if (interval === '15m') {
      const yt5j = resolveToYahooTicker(ticker);
      const refKey = ticker + '_5J_ref';
      const refCached = _wlChartPeriodCache[refKey];
      let refRaw = (refCached && (Date.now() - refCached.ts) < _WL_PERIOD_CACHE_TTL) ? refCached.raw : null;
      if (!refRaw) {
        const cb5j = Math.floor(Date.now() / 300000);
        const refUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/'
          + encodeURIComponent(yt5j) + '?interval=1d&range=1mo&_=' + cb5j;
        refRaw = await fetchWithFallback(refUrl);
        _wlChartPeriodCache[refKey] = { raw: refRaw, ts: Date.now() };
      }
      const refD = JSON.parse(refRaw);
      const refRes = refD.chart?.result?.[0];
      if (refRes) {
        const refCloses = (refRes.indicators.quote[0].close || []).filter(Boolean);
        const idx = refCloses.length - 1 - 5;
        if (idx >= 0) ref5j = refCloses[idx];
      }
    }

    let displayPct = null;
    if (isIntraday) {
      displayPct = (livePrice != null && prevClose) ? ((livePrice / prevClose - 1) * 100) : null;
    } else if (pts.length >= 2) {
      const endPrice  = (interval === '5m' ? livePrice : null) || pts[pts.length - 1];
      const startPrice = interval === '15m'
        ? (ref5j || pts[0])                                 // 5J → close 5 jours de trading en arrière
        : periodDef.period1
          ? (opens[0] != null ? opens[0] : pts[0])         // ALL → open[0]
          : (meta.chartPreviousClose || opens[0] || pts[0]); // autres → chartPreviousClose
      displayPct = ((endPrice / startPrice) - 1) * 100;
    }

    const isUp      = pts.length >= 2 ? pts[pts.length - 1] >= pts[0] : true;
    const lineColor = isUp ? '#00e09e' : '#ff4d6a';

    if (elPrice) elPrice.textContent = livePriceEur != null ? livePriceEur.toFixed(2) + ' €' : '—';
    if (elChange && displayPct != null) {
      elChange.textContent = (displayPct >= 0 ? '+' : '') + displayPct.toFixed(2) + ' % sur la période';
      elChange.style.color = displayPct >= 0 ? 'var(--positive)' : 'var(--negative)';
    }

    if (_wlChartInstances[i]) { _wlChartInstances[i].destroy(); delete _wlChartInstances[i]; }

    if (loading) loading.style.display = 'none';
    canvas.style.display = 'block';

    const ctx = canvas.getContext('2d');
    _wlChartInstances[i] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: pts,
          borderColor: lineColor,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: lineColor,
          tension: 0.2,
          fill: true,
          spanGaps: true,
          backgroundColor: (ctx2) => {
            const g = ctx2.chart.ctx.createLinearGradient(0, 0, 0, 180);
            g.addColorStop(0, isUp ? 'rgba(0,224,158,0.15)' : 'rgba(255,77,106,0.15)');
            g.addColorStop(1, 'rgba(0,0,0,0)');
            return g;
          },
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600, easing: 'easeOutQuart' },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#10121c',
            borderColor: 'rgba(255,255,255,0.06)',
            borderWidth: 1,
            titleColor: '#8892a8',
            bodyColor: '#edf0f7',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: ctx2 => ' ' + toEur(ctx2.parsed.y, meta.currency).toFixed(2) + ' €',
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: '#495068',
              font: { family: "'JetBrains Mono', monospace", size: 10 },
              maxTicksLimit: 6,
              maxRotation: 0,
            }
          },
          y: {
            position: 'right',
            grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
            border: { display: false },
            ticks: {
              color: '#495068',
              font: { family: "'JetBrains Mono', monospace", size: 10 },
              maxTicksLimit: 5,
              callback: v => v.toFixed(2),
            }
          }
        }
      }
    });

  } catch(e) {
    if (loading) { loading.textContent = 'Données indisponibles'; loading.style.display = 'flex'; }
    canvas.style.display = 'none';
  }
}

async function enrichWatchlistRow(w, i) {
  const row = document.getElementById('wl-row-' + i);
  if (!row) return;
  const elPrice  = row.querySelector('.wl-price');
  const elDay    = row.querySelector('.wl-daychg');
  const elSpark  = row.querySelector('.wl-spark');
  const elSince  = row.querySelector('.wl-since');
  const setErr = el => { if (el) { el.textContent = '—'; el.style.color = 'var(--text3)'; } };

  try {
    const raw = await fetchWatchlistChart(w.ticker);
    const d = JSON.parse(raw);
    const res = d.chart && d.chart.result && d.chart.result[0];
    if (!res) throw new Error('no data');
    const meta = res.meta || {};
    const ts = res.timestamp || [];
    const closes = (res.indicators && res.indicators.quote && res.indicators.quote[0].close) || [];

    const livePrice = meta.regularMarketPrice;
    // closes[n-2] = close d'hier (chartPreviousClose = début du range 2mo, pas hier)
    const dailyCloses = closes.filter(Boolean);
    const prevClose = dailyCloses.length >= 2 ? dailyCloses[dailyCloses.length - 2]
                    : (meta.previousClose ?? meta.chartPreviousClose ?? null);
    const dayChgPct = (livePrice != null && prevClose) ? ((livePrice / prevClose - 1) * 100) : null;

    // Prix live converti en €
    if (elPrice) {
      const priceEur = livePrice != null ? toEur(livePrice, meta.currency) : null;
      elPrice.textContent = priceEur != null ? priceEur.toFixed(2) + ' €' : '—';
    }

    // Variation jour
    if (elDay) {
      if (dayChgPct == null) { setErr(elDay); }
      else {
        elDay.textContent = (dayChgPct >= 0 ? '+' : '') + dayChgPct.toFixed(2) + ' %';
        elDay.style.color = dayChgPct >= 0 ? 'var(--positive)' : 'var(--negative)';
      }
    }

    // Sparkline 30 derniers points
    if (elSpark) {
      const sparkPts = [];
      for (let k = 0; k < ts.length; k++) if (closes[k] != null) sparkPts.push(closes[k]);
      const points30 = sparkPts.slice(-30);
      if (points30.length >= 2) {
        elSpark.innerHTML = sparklineSVG(points30);
      } else {
        elSpark.innerHTML = '<div style="height:30px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:10px">—</div>';
      }
    }

    // Perf depuis ajout
    if (elSince) {
      const addedPrice = w.addedPrice || w.price;
      if (addedPrice && livePrice != null) {
        const pct = (livePrice / addedPrice - 1) * 100;
        elSince.textContent = (pct >= 0 ? '+' : '') + pct.toFixed(2) + ' %';
        elSince.style.color = pct >= 0 ? 'var(--positive)' : 'var(--negative)';
      } else setErr(elSince);
    }

  } catch (e) {
    setErr(elPrice); setErr(elDay); setErr(elSince);
    if (elSpark) elSpark.innerHTML = '<div style="height:30px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:10px">—</div>';
  }
}

// Mini sparkline SVG 120×30
function sparklineSVG(points) {
  if (!points || points.length < 2) return '';
  const w = 120, h = 30, pad = 2;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = (max - min) || 1;
  const xStep = (w - 2*pad) / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = pad + i * xStep;
    const y = pad + (h - 2*pad) * (1 - (p - min) / range);
    return x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ');
  const last = points[points.length - 1], first = points[0];
  const isUp = last >= first;
  const color = isUp ? '#00e09e' : '#ff4d6a';
  const areaFill = isUp ? 'rgba(0,224,158,0.12)' : 'rgba(255,77,106,0.12)';
  // zone remplie sous la courbe
  const areaCoords = coords + ' ' + (w - pad).toFixed(1) + ',' + (h - pad).toFixed(1) + ' ' + pad.toFixed(1) + ',' + (h - pad).toFixed(1);
  return (
    '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" style="display:block">' +
      '<polygon points="' + areaCoords + '" fill="' + areaFill + '"/>' +
      '<polyline points="' + coords + '" fill="none" stroke="' + color + '" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"/>' +
    '</svg>'
  );
}

// Cache pour dividendYield (évite de re-spammer Yahoo)
const _wlDivYieldCache = {};
async function fetchDividendYield(ticker) {
  if (ticker in _wlDivYieldCache) return _wlDivYieldCache[ticker];
  try {
    const yt = resolveToYahooTicker(ticker);
    const raw = await fetchWithFallback(
      'https://query1.finance.yahoo.com/v8/finance/chart/'
      + encodeURIComponent(yt)
      + '?interval=1d&range=1d'
    );
    const meta = JSON.parse(raw)?.chart?.result?.[0]?.meta;
    let dy = null;
    if (meta) {
      if (meta.trailingAnnualDividendYield != null) dy = meta.trailingAnnualDividendYield;
      else if (meta.trailingAnnualDividendRate && meta.regularMarketPrice)
        dy = meta.trailingAnnualDividendRate / meta.regularMarketPrice;
    }
    _wlDivYieldCache[ticker] = dy;
    return dy;
  } catch (e) {
    _wlDivYieldCache[ticker] = null;
    return null;
  }
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
    if (tr.classList.contains('mobile-detail-row')) return;
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
    const tickerCell = firstTd && firstTd.querySelector('.ticker-cell');
    if (tickerCell && !firstTd.querySelector('.drag-handle')) {
      const handle = document.createElement('span');
      handle.className = 'drag-handle';
      handle.textContent = '⠿';
      tickerCell.prepend(handle);
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
  setTimeout(initStatCardsScroll, 300);
};

// Initialize watchlist on page show
const _origShowPage = showPage;
showPage = function(id) {
  _origShowPage(id);
  if (id === 'watchlist')     renderWatchlist();
  if (id === 'notifications') renderNotificationsPage();
};
const _origShowPageMobile = showPageMobile;
showPageMobile = function(id) {
  _origShowPageMobile(id);
  if (id === 'watchlist')     renderWatchlist();
  if (id === 'notifications') renderNotificationsPage();
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

// ─────────────────────────────────────────────────────────────────
//  BENCHMARK PAGE
//  Compare le portefeuille réel (dailyValues broker) à un DCA fictif
//  sur un indice, en utilisant les mêmes dates et montants de versement.
//
//  Corrections appliquées pour une comparaison ÉQUITABLE :
//   - Utilisation des indices Total Return (dividendes réinvestis) quand dispo.
//     CAC 40 et Euro Stoxx 50 n'ont pas de TR sur Yahoo → approximation
//     via un rendement dividende annuel ajouté au prorata temporis.
//   - Conversion EUR/USD pour les indices libellés en USD, pour matcher
//     la base euro du PEA.
// ─────────────────────────────────────────────────────────────────
let benchmarkChart = null;
let _benchCache = {}; // { ticker: { prices, liveQuote, currency } }
let _fxCache = null;  // { dateStr: EUR->USD rate, live: latest }

// Config par indice :
//   - ticker    : symbole Yahoo à utiliser
//   - name      : libellé affiché
//   - divYield  : dividende annuel à ajouter si l'indice n'est PAS Total Return
//                 (0 = l'indice est déjà TR, pas d'ajustement)
const BENCH_CONFIG = {
  '^GSPC':    { ticker: '^SP500TR',   name: 'S&P 500 (TR)',        divYield: 0,      isUSD: true  },
  '^FCHI':    { ticker: '^FCHI',      name: 'CAC 40',              divYield: 0.032,  isUSD: false }, // ~3.2%/an dividendes CAC 40
  'URTH':     { ticker: 'URTH',       name: 'MSCI World',          divYield: 0,      isUSD: true  }, // ETF capitalisant
  '^STOXX50E':{ ticker: '^STOXX50E',  name: 'Euro Stoxx 50',       divYield: 0.030,  isUSD: false }, // ~3%/an dividendes
  '^NDX':     { ticker: '^NDX',      name: 'Nasdaq 100',          divYield: 0.011,  isUSD: true  }, // ~1.1%/an dividendes (^XNDX Yahoo n'a pas l'historique)
};

async function fetchIndexDaily(cfgKey, period1) {
  const cfg = BENCH_CONFIG[cfgKey] || BENCH_CONFIG['^GSPC'];
  const cacheKey = cfg.ticker;
  if (_benchCache[cacheKey]) return { ..._benchCache[cacheKey], cfg };

  const p1 = Math.floor(new Date(period1 + 'T00:00:00').getTime() / 1000);
  const p2 = Math.floor(Date.now() / 1000) + 86400;
  const raw = await fetchWithFallback(
    'https://query1.finance.yahoo.com/v8/finance/chart/'
    + encodeURIComponent(cfg.ticker)
    + '?interval=1d&period1=' + p1 + '&period2=' + p2
  );
  const d = JSON.parse(raw);
  const res = d.chart && d.chart.result && d.chart.result[0];
  if (!res || !res.timestamp) throw new Error('Pas de données Yahoo pour ' + cfg.ticker);
  const ts = res.timestamp;
  const closes = res.indicators.quote[0].close;
  const adjcloses = (res.indicators.adjclose && res.indicators.adjclose[0].adjclose) || closes;
  const prices = {};
  for (let i = 0; i < ts.length; i++) {
    if (closes[i] == null) continue;
    const key = new Date(ts[i] * 1000).toISOString().slice(0, 10);
    prices[key] = adjcloses[i] != null ? adjcloses[i] : closes[i];
  }
  const liveQuote = res.meta && res.meta.regularMarketPrice;
  const currency = res.meta && res.meta.currency;
  const data = { prices, liveQuote, currency };
  _benchCache[cacheKey] = data;
  return { ...data, cfg };
}

// Récupère les taux EUR/USD historiques (et live) pour convertir les indices USD
async function fetchEURUSD(period1) {
  if (_fxCache) return _fxCache;
  const p1 = Math.floor(new Date(period1 + 'T00:00:00').getTime() / 1000);
  const p2 = Math.floor(Date.now() / 1000) + 86400;
  const raw = await fetchWithFallback(
    'https://query1.finance.yahoo.com/v8/finance/chart/EURUSD%3DX'
    + '?interval=1d&period1=' + p1 + '&period2=' + p2
  );
  const d = JSON.parse(raw);
  const res = d.chart && d.chart.result && d.chart.result[0];
  if (!res || !res.timestamp) throw new Error('Pas de données EUR/USD');
  const ts = res.timestamp;
  const closes = res.indicators.quote[0].close;
  const rates = {};
  for (let i = 0; i < ts.length; i++) {
    if (closes[i] == null) continue;
    const key = new Date(ts[i] * 1000).toISOString().slice(0, 10);
    rates[key] = closes[i];
  }
  const live = res.meta && res.meta.regularMarketPrice;
  _fxCache = { rates, live };
  return _fxCache;
}

function getIndexPriceAt(prices, dateStr) {
  if (prices[dateStr] != null) return prices[dateStr];
  const keys = Object.keys(prices).sort();
  let last = null;
  for (const k of keys) {
    if (k > dateStr) break;
    last = prices[k];
  }
  return last;
}

function getFxAt(fx, dateStr) {
  if (fx.rates[dateStr] != null) return fx.rates[dateStr];
  const keys = Object.keys(fx.rates).sort();
  let last = null;
  for (const k of keys) {
    if (k > dateStr) break;
    last = fx.rates[k];
  }
  return last;
}

// Convertit un prix USD → EUR à une date donnée
// prixUSD / tauxEURUSD(date) = prixEUR
function toEUR(priceUSD, fx, dateStr, isLive) {
  const rate = isLive ? fx.live : getFxAt(fx, dateStr);
  if (!rate) return priceUSD; // fallback sans conversion
  return priceUSD / rate;
}

// Applique l'ajustement dividendes : pour un indice "price return" qui verse
// un dividende yield annuel, on fait pousser la valeur comme si on avait
// réinvesti les dividendes au prorata du temps écoulé.
// adjustedValue = rawValue × (1 + divYield × années_écoulées)
// C'est une approximation linéaire, largement suffisante pour une comparaison.
function applyDivYield(value, divYield, daysHeld) {
  if (!divYield || daysHeld <= 0) return value;
  const yearsHeld = daysHeld / 365.25;
  return value * (1 + divYield * yearsHeld);
}

// ─────────────────────────────────────────────────────────────────
//  REFRESH — vide tous les caches et relance le preload
//  Appelé par le bouton ↻ dans la sidebar.
// ─────────────────────────────────────────────────────────────────
async function refreshAll() {
  const btn = document.getElementById('btn-refresh-data');
  if (btn && btn.classList.contains('spinning')) return; // déjà en cours
  if (btn) { btn.classList.add('spinning'); btn.disabled = true; }

  try {
    // Vider tous les caches connus
    try { for (const k in _benchCache) delete _benchCache[k]; } catch(e){}
    try { _fxCache = null; } catch(e){}
    try { _perfCache = null; } catch(e){}
    try { for (const k in _wlChartCache) delete _wlChartCache[k]; } catch(e){}
    try { for (const k in _wlDivYieldCache) delete _wlDivYieldCache[k]; } catch(e){}

    // Relancer le preload
    await preloadAll();

    // Rafraîchir la page actuellement affichée
    const activePage = document.querySelector('.page.active');
    if (activePage) {
      const id = activePage.id.replace('page-', '');
      if (id === 'benchmark')    { try { initBenchmark(); }    catch(e){} }
      if (id === 'performance')  { try { initPerformance(); }  catch(e){} }
      if (id === 'watchlist')    { try { renderWatchlist(); }  catch(e){} }
      if (id === 'portfolio')    { try { renderPortfolio(); }  catch(e){} }
    }
    checkPriceAlerts();
  } finally {
    if (btn) { btn.classList.remove('spinning'); btn.disabled = false; }
  }
}

// ─────────────────────────────────────────────────────────────────
//  PRELOAD — lance tous les fetch lourds au login en arrière-plan
//  pour que les pages Benchmark, Performance et Watchlist s'affichent
//  instantanément quand l'utilisateur clique dessus.
// ─────────────────────────────────────────────────────────────────
async function preloadAll() {
  const tasks = [];

  // ── Benchmark : fetch EUR/USD + les 5 indices sur 10 ans ──
  // Remplit _benchCache et _fxCache. Quand l'utilisateur ouvre Benchmark,
  // plus aucun fetch n'est nécessaire pour les périodes ≤ 10 ans.
  const tenYearsAgo = new Date(Date.now() - 3650 * 86400000).toISOString().slice(0,10);
  tasks.push(fetchEURUSD(tenYearsAgo).catch(() => null));
  for (const t of ['^GSPC', '^FCHI', 'URTH', '^STOXX50E', '^NDX']) {
    tasks.push(fetchIndexDaily(t, tenYearsAgo).catch(() => null));
  }

  // ── Performance : précalcule le résultat si on peut ──
  // Si le CSV broker est importé (dailyValues non vide), c'est quasi-instantané
  // côté CPU. Sinon, on lance le gros fetch multi-tickers Yahoo.
  const portfolio = getPortfolio(currentUser);
  const txs = getTransactions(currentUser);
  if (portfolio.length || txs.length) {
    tasks.push(
      computeAnnualPerformance(portfolio, txs)
        .then(r => { _perfCache = r; })
        .catch(() => null)
    );
  }

  // ── Watchlist : enrichir chaque ligne (prix live + div yield) ──
  // Les fetch individuels remplissent leurs propres caches (chart + quoteSummary).
  // On ne rend pas le DOM ici (il n'existe peut-être pas encore), on fait juste
  // chauffer les caches Yahoo pour que renderWatchlist soit instantané au clic.
  const wl = getWatchlist(currentUser);
  for (const w of wl) {
    if (!w.ticker) continue;
    tasks.push(fetchWatchlistChart(w.ticker).catch(() => null));
    tasks.push(fetchDividendYield(w.ticker).catch(() => null));
  }

  // On attend tout en parallèle. Tout est non-bloquant pour l'UI principale.
  await Promise.allSettled(tasks);
}


//  Affiche une courbe par indice + PEA, normalisées en base 100.
//  Sélecteur de période : 1J, 1S, 1M, 3M, 6M, YTD, 1A, 3A, 5A, 10A, Max.
// ─────────────────────────────────────────────────────────────────

// État global
let _benchCurrentPeriod = '6M';

// Périodes : durée en jours depuis aujourd'hui, ou label spécial
const BENCH_PERIODS = {
  '1D':  { days: 1,    label: '1 jour' },
  '1W':  { days: 7,    label: '1 semaine' },
  '1M':  { days: 30,   label: '1 mois' },
  '3M':  { days: 90,   label: '3 mois' },
  '6M':  { days: 180,  label: '6 mois' },
  'YTD': { days: null, label: 'YTD' },
  '1Y':  { days: 365,  label: '1 an' },
  '3Y':  { days: 1095, label: '3 ans' },
  '5Y':  { days: 1825, label: '5 ans' },
  '10Y': { days: 3650, label: '10 ans' },
  'MAX': { days: null, label: 'Depuis 1er versement' },
};

// Couleurs assignées à chaque série (stable)
const BENCH_COLORS = {
  PEA:         '#00e09e',
  '^GSPC':     '#378ADD',
  '^FCHI':     '#F0997B',
  'URTH':      '#AFA9EC',
  '^STOXX50E': '#EF9F27',
  '^NDX':      '#ED93B1',
};

const BENCH_NAMES = {
  PEA:         'Mon PEA',
  '^GSPC':     'S&P 500',
  '^FCHI':     'CAC 40',
  'URTH':      'MSCI World',
  '^STOXX50E': 'Euro Stoxx 50',
  '^NDX':      'Nasdaq 100',
};

// Calcule la date de début pour une période donnée
function benchStartDateFor(period) {
  const today = new Date();
  today.setHours(0,0,0,0);
  if (period === 'YTD') return new Date(today.getFullYear(), 0, 1).toISOString().slice(0,10);
  if (period === 'MAX') {
    const vers = getVersements(currentUser);
    if (!vers.length) return today.toISOString().slice(0,10);
    return vers.reduce((min, v) => (v.date && v.date < min ? v.date : min), '9999-12-31');
  }
  const cfg = BENCH_PERIODS[period];
  if (!cfg || !cfg.days) return today.toISOString().slice(0,10);
  const d = new Date(today.getTime() - cfg.days * 86400000);
  return d.toISOString().slice(0,10);
}

// Bind des boutons de période (appelé une fois)
function bindBenchPeriodButtons() {
  const btns = document.querySelectorAll('.bench-period-btn');
  btns.forEach(btn => {
    btn.onclick = () => {
      const p = btn.dataset.p;
      _benchCurrentPeriod = p;
      btns.forEach(b => b.classList.toggle('active', b.dataset.p === p));
      initBenchmark();
    };
  });
  // Activer le bouton de la période courante
  btns.forEach(b => b.classList.toggle('active', b.dataset.p === _benchCurrentPeriod));
}

async function initBenchmark() {
  const kpiEl    = document.getElementById('bench-kpis');
  const statusEl = document.getElementById('bench-status');
  if (!kpiEl) return;

  // S'assurer que les boutons sont bindés
  if (!document.querySelector('.bench-period-btn.active')) bindBenchPeriodButtons();
  else bindBenchPeriodButtons(); // idempotent

  const dailyValues = getDailyValues(currentUser);
  const versements  = getVersements(currentUser);

  const period = _benchCurrentPeriod;
  const periodCfg = BENCH_PERIODS[period];
  const startDate = benchStartDateFor(period);
  const today = new Date().toISOString().slice(0,10);

  kpiEl.innerHTML = '<div class="stat-card"><div class="stat-label">Chargement…</div></div>';
  if (statusEl) statusEl.textContent = 'Période : ' + periodCfg.label;

  // Fetch les 5 indices + FX en parallèle
  const tickers = ['^GSPC', '^FCHI', 'URTH', '^STOXX50E', '^NDX'];
  // fetch la plus longue période nécessaire : on prend 11 ans pour couvrir "10A"
  const fetchFrom = period === 'MAX'
    ? (versements.length ? versements[0].date : today)
    : new Date(Date.now() - 3650 * 86400000).toISOString().slice(0,10);

  let fx = null;
  let indices = {};
  try {
    const results = await Promise.all([
      fetchEURUSD(fetchFrom),
      ...tickers.map(t => fetchIndexDaily(t, fetchFrom).catch(() => null)),
    ]);
    fx = results[0];
    for (let i = 0; i < tickers.length; i++) {
      if (results[i+1]) indices[tickers[i]] = results[i+1];
    }
  } catch (e) {
    kpiEl.innerHTML = '<div class="stat-card"><div class="stat-label" style="color:var(--negative)">Erreur Yahoo</div><div class="stat-sub">' + (e.message || 'Indisponible') + '</div></div>';
    return;
  }

  // ── Construire les séries base 100 pour chaque indice + le PEA ──
  const series = {};

  // Prix en EUR du jour J, après conversion FX et ajustement dividendes
  // Retourne { date -> valeur EUR ajustée }
  function buildEurSerie(ticker) {
    const data = indices[ticker];
    if (!data || !data.cfg) return null;
    const cfg = data.cfg;
    const prices = data.prices;
    const keys = Object.keys(prices).sort();
    const serie = {};
    // Pour l'ajustement dividendes, on prend la date de début de la série
    // comme référence : les valeurs plus tard sont ajustées par le prorata.
    const firstDate = keys[0];
    for (const k of keys) {
      let px = prices[k];
      if (cfg.isUSD && fx) {
        const r = getFxAt(fx, k);
        if (r) px = px / r;
      }
      if (cfg.divYield > 0) {
        const days = (new Date(k) - new Date(firstDate)) / 86400000;
        const years = days / 365.25;
        px = px * (1 + cfg.divYield * years);
      }
      serie[k] = px;
    }
    return serie;
  }

  for (const t of tickers) {
    const s = buildEurSerie(t);
    if (s) series[t] = s;
  }

  // Série PEA : à partir des dailyValues broker
  // Pour obtenir une "perf pure" (sans effet DCA), on chaîne les rendements
  // quotidiens en neutralisant les versements.
  // Résultat : une courbe "PEA base 100" qui ne grossit pas à chaque versement
  // mais reflète seulement la performance des actifs.
  if (dailyValues && dailyValues.length >= 2) {
    const peaSerie = {};
    const dvMap = {};
    for (const dv of dailyValues) dvMap[dv.date] = dv.value;
    const dvDates = Object.keys(dvMap).sort();

    const versByDate = {};
    for (const v of versements) {
      if (!v.date) continue;
      versByDate[v.date] = (versByDate[v.date] || 0) + v.amount;
    }

    // Chaînage TWR quotidien :
    //   twr(J) = twr(J-1) × V_J / (V_J-1 + vers_J)
    // On démarre à 100 au premier jour
    let twr = 100;
    let prevValue = null;
    for (let i = 0; i < dvDates.length; i++) {
      const d = dvDates[i];
      const val = dvMap[d];
      if (i === 0) {
        peaSerie[d] = twr;
        prevValue = val;
        continue;
      }
      const versJ = versByDate[d] || 0;
      const denom = prevValue + versJ;
      if (denom > 0.01) {
        twr *= val / denom;
      }
      peaSerie[d] = +twr.toFixed(4);
      prevValue = val;
    }
    series.PEA = peaSerie;
  }

  // ── Normaliser toutes les séries en base 100 sur la période sélectionnée ──
  // Pour chaque série, on prend la première valeur disponible dans [startDate, today]
  // comme "valeur de référence" → base 100.
  const datasets = [];
  const kpis = []; // { key, name, perfPct, color }

  const orderedKeys = ['PEA', '^GSPC', '^FCHI', 'URTH', '^STOXX50E', '^NDX'];

  for (const key of orderedKeys) {
    const serie = series[key];
    if (!serie) continue;
    const keys = Object.keys(serie).sort().filter(d => d >= startDate && d <= today);
    if (keys.length < 2) continue;
    const base = serie[keys[0]];
    if (!base || base <= 0) continue;

    const points = keys.map(d => ({ x: d, y: +((serie[d] / base) * 100 - 100).toFixed(3) }));
    const perfPct = points[points.length - 1].y;

    datasets.push({
      label: BENCH_NAMES[key],
      data: points,
      borderColor: BENCH_COLORS[key],
      backgroundColor: key === 'PEA' ? 'rgba(0,224,158,0.08)' : 'transparent',
      borderWidth: key === 'PEA' ? 2.5 : 1.5,
      fill: key === 'PEA',
      tension: 0.2,
      pointRadius: 0,
      pointHoverRadius: 3,
    });

    kpis.push({ key, name: BENCH_NAMES[key], perfPct, color: BENCH_COLORS[key] });
  }

  // ── KPI par indice (perf sur la période) ──
  // Tri du meilleur au pire, PEA toujours en premier
  const peaKpi = kpis.find(k => k.key === 'PEA');
  const otherKpis = kpis.filter(k => k.key !== 'PEA').sort((a, b) => b.perfPct - a.perfPct);
  const orderedKpis = peaKpi ? [peaKpi, ...otherKpis] : otherKpis;

  const col = v => v >= 0 ? 'var(--positive)' : 'var(--negative)';
  const sgn = v => v >= 0 ? '+' : '';

  if (!orderedKpis.length) {
    kpiEl.innerHTML = '<div class="stat-card"><div class="stat-label">Aucune donnée</div><div class="stat-sub">Pour la période ' + periodCfg.label + '</div></div>';
  } else {
    kpiEl.innerHTML = orderedKpis.map(k => {
      const isPEA = k.key === 'PEA';
      return '<div class="stat-card" style="border-left:3px solid ' + k.color + (isPEA ? ';background:rgba(0,224,158,0.04)' : '') + '">' +
        '<div class="stat-label">' + k.name.toUpperCase() + '</div>' +
        '<div class="stat-value" style="color:' + col(k.perfPct) + '">' + sgn(k.perfPct) + k.perfPct.toFixed(2) + ' %</div>' +
        '<div class="stat-sub">' + periodCfg.label + '</div>' +
      '</div>';
    }).join('');
  }

  if (statusEl) {
    const missing = [];
    if (!series.PEA) missing.push('PEA (importez le CSV broker)');
    statusEl.textContent = 'Période : ' + periodCfg.label + ' · ' + startDate + ' → ' + today
      + (missing.length ? ' · ' + missing.join(', ') : '');
  }

  // ── Render du graphique ──
  renderBenchmarkMultiChart(datasets);
}

function renderBenchmarkMultiChart(datasets) {
  const ctx = document.getElementById('chart-benchmark');
  if (!ctx) return;
  if (benchmarkChart) { benchmarkChart.destroy(); benchmarkChart = null; }

  // Chart.js type: 'time' nécessite un adapter de dates (pas chargé ici).
  // On convertit en axe catégoriel : on construit une liste unifiée de labels
  // (union de toutes les dates), et chaque dataset mappe ses valeurs dessus.
  const allDatesSet = new Set();
  for (const ds of datasets) {
    for (const pt of ds.data) allDatesSet.add(pt.x);
  }
  const labels = [...allDatesSet].sort();

  // Formatter d'affichage pour l'axe X : DD/MM
  const shortLabels = labels.map(d => {
    const [y, m, day] = d.split('-');
    return day + '/' + m;
  });

  // Densité des ticks : on ne met pas plus de ~10 labels visibles
  const maxTicks = 10;
  const step = Math.max(1, Math.ceil(labels.length / maxTicks));

  // Convertir chaque dataset : data = array aligné sur labels (null si absent)
  const normalizedDatasets = datasets.map(ds => {
    const byDate = {};
    for (const pt of ds.data) byDate[pt.x] = pt.y;
    return {
      ...ds,
      data: labels.map(d => byDate[d] != null ? byDate[d] : null),
      spanGaps: true,
    };
  });

  benchmarkChart = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: { labels: shortLabels, datasets: normalizedDatasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            color: '#edf0f7',
            font: { size: 11 },
            usePointStyle: true,
            pointStyle: 'line',
            boxWidth: 18,
            padding: 14,
          },
        },
        tooltip: {
          callbacks: {
            title: function(items) {
              if (!items.length) return '';
              return labels[items[0].dataIndex] || '';
            },
            label: function(ctx) {
              if (ctx.parsed.y == null) return null;
              const v = ctx.parsed.y;
              const sign = v >= 0 ? '+' : '';
              return ctx.dataset.label + ' : ' + sign + v.toFixed(2) + ' %';
            }
          }
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#8892a8',
            font: { size: 10 },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: maxTicks,
            callback: function(val, idx) {
              return idx % step === 0 ? shortLabels[idx] : '';
            },
          },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
        y: {
          ticks: {
            color: '#8892a8',
            font: { size: 10 },
            callback: v => (v >= 0 ? '+' : '') + v.toFixed(1) + ' %',
          },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
      },
    },
  });
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
  patrimoine: { label: IC.briefcase + ' Patrimoine',  key: 'patrimoine', paliers: [500,1000,1500,2000,2500,3000,3500,4000,4500,5000] },
  rendement:  { label: IC.trending + ' Plus-value',  key: 'rendement',  paliers: [50,100,150,200,250,300,350,400,450,500] },
  dividendes: { label: IC.gift + ' Dividendes',  key: 'dividendes', paliers: [10,20,30,40,50,60,70,80,90,100] },
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
      `<div class="cal-dot ${e.type}">${e.type === 'buy' ? '▲ ' : e.type === 'dividend' ? IC.wallet + ' ' : '➕ '}${e.label}</div>`
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
let _divHistoryCache  = {};
let _divJsonLoaded    = false;
let _divJsonData      = {};
let _divAllEntries    = [];
let _divShowAll       = false;

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
  } catch(e) {
    console.warn('⚠️ dividendes.json non disponible, historique vide.', e);
    _divJsonLoaded = true;
  }
}

async function fetchDivHistory(ticker) {
  if (_divHistoryCache[ticker] !== undefined) return _divHistoryCache[ticker];

  let history = [];

  // Fetch real dividend history from Yahoo Finance (exact amounts)
  try {
    const yahooTicker = resolveToYahooTicker(ticker);
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/' +
      encodeURIComponent(yahooTicker) + '?interval=1mo&range=10y&events=div';
    const raw = await fetchWithFallback(url);
    const json = JSON.parse(raw);
    const divEvents = json?.chart?.result?.[0]?.events?.dividends;
    if (divEvents) {
      history = Object.values(divEvents).map(d => ({
        date:   new Date(d.date * 1000).toISOString().slice(0, 10),
        amount: d.amount,
        label:  'Dividende',
      }));
    }
  } catch(e) {
    console.warn('fetchDivHistory Yahoo error for', ticker, e);
  }

  // Inject next dividend from JSON (estimated/confirmed) — Yahoo doesn't have future events
  await loadDivJson();
  const jsonData = _divJsonData[ticker];
  if (jsonData?.next?.date) {
    const alreadyIn = history.find(h => h.date === jsonData.next.date);
    const todayStr  = new Date().toISOString().slice(0, 10);
    const isPast    = jsonData.next.date <= todayStr;
    if (!alreadyIn) {
      history.unshift({
        date:   jsonData.next.date,
        amount: jsonData.next.amount_estimated || 0,
        label:  jsonData.next.confirmed ? 'Prochain (confirmé)' : (isPast ? 'Dividende' : 'Prochain (estimé)'),
        next:   !isPast,
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

function getQtyAtDate(txs, ticker, date) {
  let qty = 0;
  for (const t of txs) {
    if ((t.type === 'buy' || t.type === 'sell') && t.ticker === ticker && t.date <= date) {
      qty += t.type === 'buy' ? t.qty : -t.qty;
    }
  }
  return Math.max(0, qty);
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
  if (tbody)  tbody.innerHTML  = '<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:24px">Chargement des dividendes…</td></tr>';
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
        const qtyAtDate = getQtyAtDate(txs, r.ticker, d.date);
        allReceived.push({ ticker: r.ticker, name: r.name, date: d.date, qty: qtyAtDate, price: d.amount, auto: true });
      }
    });

    const totalRecu     = allReceived.reduce((s, t) => s + t.qty * t.price, 0);
    const duringHolding = firstBuy ? history.filter(d => !d.next && d.date >= firstBuy && d.date <= today) : [];
    const nextEntry     = history.find(d => d.next === true);
    const nextEstim     = nextEntry ? new Date(nextEntry.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}) : '—';
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
      <div class="stat-value" style="color:var(--gold);font-size:26px">${totalRecuAuto.toFixed(2)} €</div>
      ${totalVersionts > 0 ? `<div class="stat-change pos">${totalVersionts} versement(s) détecté(s)</div>` : ''}`;
    if (kpiHolding) kpiHolding.innerHTML = `
      <div class="stat-label">📅 Versements pendant détention</div>
      <div class="stat-value">${totalHolding}</div>
      <div class="stat-change">Depuis date d'achat</div>`;
    if (kpiNext && nextRows.length) kpiNext.innerHTML = `
      <div class="stat-label">⏰ Prochain versement</div>
      <div style="display:flex;align-items:center;gap:8px;margin:6px 0">
        ${logoHtml(nextRows[0].r.ticker, 26, 'ticker-icon')}
        <span style="font-size:13px;font-weight:600;color:var(--text1)">${nextRows[0].r.name || nextRows[0].r.ticker}</span>
      </div>
      <div class="stat-value" style="font-size:16px;color:var(--gold)">${nextRows[0].nextEstim}</div>`;

    // ── Projection dividendes annuels ────────────────────────────────────────
    const projEl = document.getElementById('div-projection-content');
    if (projEl) {
      const oneYearAgo = new Date(); oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const oneYearAgoStr = oneYearAgo.toISOString().slice(0, 10);
      const projRows = rows.map(({ r, history, lastKnown }) => {
        const nextEntry = history.find(d => d.next === true);
        const refDiv = nextEntry || lastKnown;
        if (!refDiv) return null;
        const freq = Math.max(history.filter(d => !d.next && d.date >= oneYearAgoStr).length, 1);
        const annual = refDiv.amount * r.qty * freq;
        return { ticker: r.ticker, name: r.name, amount: refDiv.amount, qty: r.qty, freq, annual, announced: !!nextEntry };
      }).filter(Boolean).sort((a, b) => b.annual - a.annual);

      const totalAnnual  = projRows.reduce((s, x) => s + x.annual, 0);
      const totalMonthly = totalAnnual / 12;
      const maxAnnual    = Math.max(...projRows.map(x => x.annual), 1);

      projEl.innerHTML = `
        <div style="display:flex;gap:32px;margin-bottom:20px;flex-wrap:wrap">
          <div>
            <div style="font-size:11px;color:var(--text3);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Annuel estimé</div>
            <div style="font-size:28px;font-weight:700;color:var(--gold);font-family:var(--mono)">${totalAnnual.toLocaleString('fr-FR', { minimumFractionDigits:2, maximumFractionDigits:2 })} €</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--text3);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Mensuel moyen</div>
            <div style="font-size:28px;font-weight:700;color:var(--positive);font-family:var(--mono)">${totalMonthly.toLocaleString('fr-FR', { minimumFractionDigits:2, maximumFractionDigits:2 })} €</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${projRows.map(p => `
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:130px;display:flex;align-items:center;gap:7px;min-width:0">${logoHtml(p.ticker, 22, 'ticker-icon')}<span style="font-size:12px;font-weight:600;color:var(--text1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</span></div>
              <div style="flex:1;background:var(--s2);border-radius:4px;height:6px;overflow:hidden">
                <div style="width:${(p.annual / maxAnnual * 100).toFixed(1)}%;height:100%;background:var(--gold);border-radius:4px;transition:width 0.4s"></div>
              </div>
              <div style="font-family:var(--mono);font-size:12px;color:var(--gold);font-weight:600;width:70px;text-align:right">${p.annual.toFixed(2)} €</div>
              <div style="font-size:10px;color:var(--text3);width:80px;text-align:right">${p.freq}×/an · ${p.amount.toFixed(2)}€/act${p.announced ? ' <span style="color:var(--gold)">·&nbsp;annoncé</span>' : ''}</div>
            </div>`).join('')}
        </div>`;
    }

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
            <td style="font-size:11px;color:var(--text2)">${nextEstim !== '—' ? nextEstim : '—'}</td>
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
        const qtyForAmount = during ? getQtyAtDate(txs, r.ticker, d.date) : r.qty;
        allEntries.push({
          date: d.date, ticker: r.ticker, name: r.name,
          amount: d.amount * qtyForAmount, perShare: d.amount,
          label: d.label||'', source: isAutoReceived ? 'reçu-auto' : (d.next ? 'annoncé' : 'référence'),
          duringHolding: during || (d.next && (!firstBuyDate || d.date >= firstBuyDate)),
        });
      });
    });
    allEntries.sort((a,b) => b.date.localeCompare(a.date));
    _divAllEntries = allEntries;
    _divShowAll    = false;

    if (histEl) renderDivHistory(histEl);
  }).catch(err => {
    console.error('initDividendes error:', err);
    if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--negative);padding:24px">⚠️ Erreur lors du chargement des dividendes</td></tr>';
    if (histEl) histEl.innerHTML = '<div class="cal-empty">⚠️ Erreur lors du chargement</div>';
  });
}

function renderDivHistory(histEl) {
  if (!histEl) return;
  const entries  = _divShowAll ? _divAllEntries : _divAllEntries.filter(e => e.duringHolding);
  const hiddenN  = _divAllEntries.filter(e => !e.duringHolding).length;
  if (!_divAllEntries.length) {
    histEl.innerHTML = '<div class="cal-empty">Aucun historique disponible.</div>';
    return;
  }
  const toggleBtn = hiddenN > 0
    ? `<button onclick="toggleDivHistory()" style="background:var(--s3);border:none;border-radius:6px;padding:4px 12px;font-size:11px;color:var(--text2);cursor:pointer;margin-bottom:8px">
        ${_divShowAll ? '▲ Masquer avant achat' : `▼ Avant achat (${hiddenN})`}
       </button>`
    : '';
  const rows = entries.map(e => {
    const ds = e.date ? new Date(e.date+'T12:00:00').toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}) : '—';
    const periodBadge = e.duringHolding
      ? '<span style="background:rgba(0,224,158,0.12);color:var(--positive);font-size:10px;padding:1px 7px;border-radius:4px">Pendant détention</span>'
      : '<span style="background:var(--s3);color:var(--text3);font-size:10px;padding:1px 7px;border-radius:4px">Avant achat</span>';
    const statutBadge = e.source==='annoncé'
      ? `<span style="background:rgba(245,183,49,0.12);color:var(--gold);font-size:10px;padding:1px 7px;border-radius:4px"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f5b731" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;margin-top:-1px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Versement annoncé le ${ds}</span>`
      : e.source==='reçu' || e.source==='reçu-auto'
      ? '<span style="background:rgba(0,224,158,0.15);color:var(--positive);font-size:10px;padding:1px 7px;border-radius:4px">✓ Reçu</span>'
      : '';
    const srcBadge = e.source==='reçu'
      ? '<span style="background:rgba(124,109,245,0.15);color:#a89cf7;font-size:10px;padding:1px 7px;border-radius:4px;display:inline-flex;align-items:center;gap:3px"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a89cf7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Manuel</span>'
      : e.source==='annoncé'
      ? '<span style="background:var(--s2);color:var(--text3);font-size:10px;padding:1px 7px;border-radius:4px;display:inline-flex;align-items:center;gap:3px"><img src="https://www.boursorama.com/favicon.ico" width="11" height="11" style="border-radius:2px;vertical-align:middle">Boursorama</span>'
      : '<span style="background:var(--s2);color:var(--text3);font-size:10px;padding:1px 7px;border-radius:4px;display:inline-flex;align-items:center;gap:3px"><img src="https://finance.yahoo.com/favicon.ico" width="11" height="11" style="border-radius:2px;vertical-align:middle">Yahoo Finance</span>';
    return `<tr>
      <td class="mono" style="font-size:12px;color:var(--text2)">${ds}</td>
      <td><div style="display:flex;align-items:center;gap:6px">${logoHtml(e.ticker||'',20,'ticker-icon')}
        <div><span style="font-size:12px">${e.name||e.ticker}</span>
        ${e.label?`<div style="font-size:10px;color:var(--text3)">${e.label}</div>`:''}</div></div></td>
      <td class="mono" style="font-weight:600;color:var(--gold)">${e.amount.toFixed(2)} €</td>
      <td class="mono" style="font-size:11px;color:var(--text3)">${e.perShare.toFixed(3)} €/action</td>
      <td>${periodBadge}</td>
      <td>${statutBadge}</td>
      <td>${srcBadge}</td>
    </tr>`;
  }).join('');
  const emptyMsg = !entries.length ? '<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:24px">Aucun dividende pendant la période de détention</td></tr>' : rows;
  histEl.innerHTML = `${toggleBtn}<table style="width:100%">
    <thead><tr>
      <th>Date</th><th style="text-align:left">Action</th>
      <th>Montant total</th><th>Par action</th><th>Période</th><th>Statut</th><th>Source</th>
    </tr></thead><tbody>${emptyMsg}</tbody></table>`;
}

function toggleDivHistory() {
  _divShowAll = !_divShowAll;
  renderDivHistory(document.getElementById('div-history'));
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
  if (id === 'benchmark')    initBenchmark();
  if (id === 'projections')  initProjections();
  if (id === 'bilan')        initBilan();
  if (id === 'dividendes')   initDividendes();
  if (id === 'performance')  initPerformance();
};
const _origShowPageMobileAnalytique = showPageMobile;
showPageMobile = function(id) {
  _origShowPageMobileAnalytique(id);
  if (id === 'benchmark')    initBenchmark();
  if (id === 'projections')  initProjections();
  if (id === 'bilan')        initBilan();
  if (id === 'dividendes')   initDividendes();
  if (id === 'performance')  initPerformance();
};

// ─── PERFORMANCE PAGE ─────────────────────────────────
let perfAnnualChart = null;
let _perfCache = null; // évite de refetch à chaque clic

// ─────────────────────────────────────────────────────────────────
//  Import du CSV de valorisation quotidienne du broker
//  Formats supportés (auto-détection) :
//    - Boursorama : "Date","Valorisation portefeuille","Perf période portefeuille","Perf cumulée portefeuille"
//    - Générique  : Date,Valeur (séparateur , ou ;)
// ─────────────────────────────────────────────────────────────────
function toggleBrokerDropdown() {
  const menu = document.getElementById('broker-menu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function selectBroker(el) {
  const value = el.dataset.value;
  const label = el.dataset.label;
  const logo  = el.dataset.logo;
  const operational = ['boursorama'];

  document.getElementById('broker-menu').style.display = 'none';

  if (!operational.includes(value)) {
    alert('Support ' + label + ' en cours de développement.\n\nSeul Boursorama est opérationnel pour le moment.');
    return;
  }

  document.getElementById('broker-select').value = value;
  document.getElementById('broker-trigger-label').textContent = label;
  const iconWrap = document.getElementById('broker-trigger-icon');
  document.getElementById('broker-trigger-img').src = logo;
  iconWrap.style.display = 'inline-flex';
  document.getElementById('broker-trigger').style.color = 'var(--text1)';

  const btn = document.getElementById('btn-import-csv');
  btn.style.opacity = '1'; btn.style.cursor = 'pointer'; btn.style.color = 'var(--text1)';
}

document.addEventListener('click', e => {
  const dd = document.getElementById('broker-dropdown');
  if (dd && !dd.contains(e.target)) {
    const menu = document.getElementById('broker-menu');
    if (menu) menu.style.display = 'none';
  }
});

function onBrokerSelectChange() {} // legacy no-op

function onImportCSVClick() {
  const sel = document.getElementById('broker-select');
  if (!sel.value) return;
  document.getElementById('input-daily-csv').click();
}

function importDailyValuesCSV(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      let text = e.target.result;
      // Strip BOM
      if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);

      // Détecter séparateur (, ou ;)
      const firstLine = text.split(/\r?\n/)[0];
      const sep = (firstLine.split(';').length > firstLine.split(',').length) ? ';' : ',';

      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) { alert('Le fichier semble vide ou invalide.'); return; }

      // Parser en tenant compte des guillemets
      function parseLine(line) {
        const out = []; let cur = ''; let inQ = false;
        for (let i = 0; i < line.length; i++) {
          const c = line[i];
          if (c === '"') { inQ = !inQ; continue; }
          if (c === sep && !inQ) { out.push(cur); cur = ''; continue; }
          cur += c;
        }
        out.push(cur);
        return out.map(s => s.trim());
      }

      const header = parseLine(lines[0]).map(h => h.toLowerCase());
      const idxDate = header.findIndex(h => h.includes('date'));
      const idxVal  = header.findIndex(h => h.includes('valorisation') || h.includes('valeur') || h.includes('value'));
      if (idxDate < 0 || idxVal < 0) {
        alert('Colonnes attendues introuvables.\n\nLe fichier doit contenir une colonne "Date" et une colonne "Valorisation" (ou "Valeur").');
        return;
      }

      const rows = [];
      const errors = [];
      for (let i = 1; i < lines.length; i++) {
        const cells = parseLine(lines[i]);
        if (cells.length <= Math.max(idxDate, idxVal)) continue;
        let dateStr = cells[idxDate];
        let valStr  = cells[idxVal];

        // Normalisation date : accepte YYYY-MM-DD ou DD/MM/YYYY
        let isoDate = null;
        const m1 = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        const m2 = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (m1) isoDate = dateStr;
        else if (m2) isoDate = m2[3] + '-' + m2[2] + '-' + m2[1];
        if (!isoDate) { errors.push('ligne ' + (i+1) + ' : date invalide "' + dateStr + '"'); continue; }

        // Normalisation valeur : accepte virgule décimale, espace milliers
        valStr = valStr.replace(/\s/g, '').replace(/\u00A0/g, '').replace(',', '.');
        const value = parseFloat(valStr);
        if (!isFinite(value) || value <= 0) { errors.push('ligne ' + (i+1) + ' : valeur invalide "' + cells[idxVal] + '"'); continue; }

        rows.push({ date: isoDate, value: value });
      }

      if (!rows.length) {
        alert('Aucune ligne valide trouvée.\n\n' + (errors.slice(0,3).join('\n') || ''));
        return;
      }

      // Dédupliquer (garder dernière occurrence) et trier
      const byDate = {};
      for (const r of rows) byDate[r.date] = r.value;
      const finalRows = Object.keys(byDate).sort().map(d => ({ date: d, value: byDate[d] }));

      saveDailyValues(currentUser, finalRows);
      _perfCache = null;

      let msg = '✓ ' + finalRows.length + ' valorisations importées (' + finalRows[0].date + ' → ' + finalRows[finalRows.length-1].date + ').\n\nLa performance annuelle utilisera désormais ces valeurs broker.';
      if (errors.length) msg += '\n\n' + errors.length + ' ligne(s) ignorée(s).';
      alert(msg);

      updateDailyStatus();
      // Recharger la page perf
      if (typeof initPerformance === 'function') initPerformance();
    } catch (err) {
      console.error('Erreur import CSV daily values:', err);
      alert('Erreur lors de la lecture du fichier : ' + err.message);
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

function clearDailyValues() {
  if (!confirm('Supprimer toutes les valorisations broker importées ?\n\nLa performance sera recalculée depuis Yahoo Finance.')) return;
  saveDailyValues(currentUser, []);
  _perfCache = null;
  updateDailyStatus();
  if (typeof initPerformance === 'function') initPerformance();
}

function updateDailyStatus() {
  const el = document.getElementById('daily-status');
  if (!el) return;
  const dv = getDailyValues(currentUser);
  if (dv && dv.length) {
    el.innerHTML = '<span style="color:var(--positive)">●</span> ' + dv.length + ' j (' + dv[0].date + ' → ' + dv[dv.length-1].date + ')';
  } else {
    el.innerHTML = '<span style="color:var(--text3)">○</span> aucune valeur broker — calcul Yahoo';
  }
}

async function initPerformance() {
  const portfolio   = getPortfolio(currentUser);
  const txs         = getTransactions(currentUser);
  const kpiEl       = document.getElementById('perf-kpis');
  const tbodyEl     = document.getElementById('perf-tbody');

  if (!portfolio.length && !txs.length) {
    kpiEl.innerHTML = '';
    tbodyEl.innerHTML =
      '<tr><td colspan="4" style="text-align:center;color:var(--text3);padding:32px">Aucune donnée disponible.</td></tr>';
    return;
  }

  kpiEl.innerHTML = '<div class="stat-card"><div class="stat-label">Chargement…</div></div>';
  tbodyEl.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text3);padding:24px">Récupération des prix historiques…</td></tr>';

  // Mettre à jour l'indicateur de statut "valeurs broker importées"
  if (typeof updateDailyStatus === 'function') updateDailyStatus();

  try {
    const result = _perfCache || await computeAnnualPerformance(portfolio, txs);
    _perfCache = result;
    renderPerformancePage(result, portfolio, txs);
  } catch (e) {
    console.error('Performance page error:', e);
    kpiEl.innerHTML = '';
    tbodyEl.innerHTML =
      '<tr><td colspan="4" style="text-align:center;color:var(--negative);padding:32px">Erreur lors du chargement des données.</td></tr>';
  }
}

// ─────────────────────────────────────────────────────────────────
//  Calcul de performance annuelle à partir des valeurs quotidiennes broker
//  (export "performance.csv" Boursorama, équivalent chez Fortuneo, etc.)
//
//  C'est la méthode privilégiée car elle donne EXACTEMENT le chiffre du broker.
// ─────────────────────────────────────────────────────────────────
function computeAnnualPerformanceFromDaily(dailyValues, versements, portfolio) {
  // Index dates -> valeur, trié
  const valByDate = {};
  for (const dv of dailyValues) {
    if (dv && dv.date && typeof dv.value === 'number' && isFinite(dv.value)) {
      valByDate[dv.date] = dv.value;
    }
  }
  const sortedDates = Object.keys(valByDate).sort();
  if (sortedDates.length < 2) return { years: [] };

  // Versements par date
  const versByDate = {};
  for (const v of versements) {
    if (!v || !v.date) continue;
    versByDate[v.date] = (versByDate[v.date] || 0) + v.amount;
  }

  // Valeur portefeuille LIVE (pour aujourd'hui si pas dans dailyValues)
  let liveValue = null;
  if (portfolio && portfolio.length) {
    let v = 0;
    for (const r of portfolio) {
      if (r && r.qty && r.currentPrice) v += r.qty * r.currentPrice;
    }
    if (v > 0) liveValue = v;
  }

  // Cash résiduel : versements totaux − (achats − ventes)
  // Permet d'aligner la valeur live sur la valeur broker (qui inclut le cash).
  // Sans ça on perd ~les centimes de cash → quelques bps d'écart sur la perf.
  const txs = getTransactions(currentUser);
  let cashResidual = 0;
  for (const v of versements) {
    if (v && typeof v.amount === 'number') cashResidual += v.amount;
  }
  for (const t of txs) {
    if (!t || !t.qty || !t.price) continue;
    if (t.type === 'buy')  cashResidual -= t.qty * t.price;
    if (t.type === 'sell') cashResidual += t.qty * t.price;
  }
  if (cashResidual > 0.001 && liveValue != null) {
    liveValue += cashResidual;
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  const firstDate = sortedDates[0];
  const firstYear = new Date(firstDate + 'T12:00:00').getFullYear();
  const lastDate = sortedDates[sortedDates.length - 1];
  const currentYear = new Date().getFullYear();

  const yearResults = [];

  for (let y = firstYear; y <= currentYear; y++) {
    const isYTD = (y === currentYear);
    const yearStart = y + '-01-01';
    const yearEnd   = y + '-12-31';

    // Versements de l'année
    const yearVers = versements.filter(v =>
      v && v.date && new Date(v.date + 'T12:00:00').getFullYear() === y
    );
    const totalVersYear = yearVers.reduce((s, v) => s + v.amount, 0);

    // V_début = dernière valeur connue strictement avant l'année (= 31/12 Y-1)
    //
    // Pour la PREMIÈRE année (= année d'ouverture du compte), on ne peut PAS
    // prendre la première valeur de l'historique comme V_début, car c'est en
    // général un versement initial (V_début = 0, pas la valeur du versement).
    // On démarre donc à 0 et on traite le premier versement comme un flux entrant
    // — la formule (1+r) = V_jour / (V_veille + vers_jour) gère ça nativement.
    let prevValue = null;
    if (y === firstYear) {
      prevValue = 0; // compte ouvert avec un solde nul
    } else {
      // Cherche la dernière date < yearStart
      for (let i = sortedDates.length - 1; i >= 0; i--) {
        if (sortedDates[i] < yearStart) { prevValue = valByDate[sortedDates[i]]; break; }
      }
      if (prevValue == null) continue; // pas de données pour cette année
    }

    // Collecte les dates de l'année + dates de versement
    const datesSet = new Set();
    for (const d of sortedDates) {
      if (d >= yearStart && d <= yearEnd) datesSet.add(d);
    }
    for (const v of yearVers) {
      if (v.date >= yearStart && v.date <= yearEnd) datesSet.add(v.date);
    }
    const yearDates = [...datesSet].sort();

    let twr = 1;
    let hasCapital = false;
    let valueEnd = prevValue;

    for (const d of yearDates) {
      const versToday = versByDate[d] || 0;
      // Si pas de valorisation broker pour ce jour, on garde la veille (jour férié)
      const valToday = (valByDate[d] != null) ? valByDate[d] : prevValue;
      const denom = prevValue + versToday;
      if (denom > 0.01) {
        hasCapital = true;
        twr *= valToday / denom;
      }
      prevValue = valToday;
      valueEnd = valToday;
    }

    // Pour le YTD : si la dernière dailyValue n'est pas d'aujourd'hui mais
    // qu'on a une valeur LIVE, on ajoute le ratio du jour
    if (isYTD && liveValue != null) {
      const lastBrokerDate = yearDates.length ? yearDates[yearDates.length - 1] : null;
      if (lastBrokerDate && lastBrokerDate < todayStr) {
        const versToday = versByDate[todayStr] || 0;
        const denom = prevValue + versToday;
        if (denom > 0.01) {
          hasCapital = true;
          twr *= liveValue / denom;
          valueEnd = liveValue;
        }
      }
    }

    const perfPct = hasCapital ? (twr - 1) * 100 : 0;

    // V_début de l'année pour la colonne "base"
    // V_début de l'année pour la colonne "base"
    const valueYearStart = (y === firstYear) ? 0 : (function(){
      for (let i = sortedDates.length - 1; i >= 0; i--) {
        if (sortedDates[i] < yearStart) return valByDate[sortedDates[i]];
      }
      return 0;
    })();
    const totalGain = valueEnd - valueYearStart - totalVersYear;

    yearResults.push({
      year: y,
      isYTD,
      base: +(valueYearStart + totalVersYear).toFixed(2),
      gain: +totalGain.toFixed(2),
      perfPct: +perfPct.toFixed(2),
    });
  }

  return { years: yearResults };
}

async function computeAnnualPerformance(portfolio, txs) {
  const versements = getVersements(currentUser);
  const dailyValues = getDailyValues(currentUser);

  // ── PATH PRIORITAIRE : si on a les valorisations quotidiennes du broker, ──
  //    on calcule directement la TWR à partir de ces valeurs (= EXACT broker).
  //    Pas besoin de Yahoo, pas d'écart, pas de bricolage.
  if (dailyValues && dailyValues.length >= 2) {
    return computeAnnualPerformanceFromDaily(dailyValues, versements, portfolio);
  }

  // ── PATH FALLBACK : reconstitution depuis prix Yahoo (méthode historique) ──

  // ── PATH PRIORITAIRE : si on a les valorisations quotidiennes du broker, ──
  //    on calcule directement la TWR à partir de ces valeurs (= EXACT broker).
  //    Pas besoin de Yahoo, pas d'écart, pas de bricolage.
  //
  //    Formule Boursorama (convention same_day) :
  //      (1 + perf_jour) = V_jour / (V_veille + versement_jour)
  //
  if (dailyValues && dailyValues.length >= 2) {
    return computeAnnualPerformanceFromDaily(dailyValues, versements, portfolio);
  }

  // ── PATH FALLBACK : reconstitution depuis prix Yahoo (méthode historique) ──

  // ── 1. Déterminer la plage de dates ──
  const allDates = [];
  txs.forEach(t => { if (t.date) allDates.push(t.date); });
  versements.forEach(v => { if (v.date) allDates.push(v.date); });
  portfolio.forEach(r => { if (r.buyDate) allDates.push(r.buyDate); });
  if (!allDates.length) return { years: [] };

  allDates.sort();
  const firstYear = new Date(allDates[0] + 'T12:00:00').getFullYear();
  const currentYear = new Date().getFullYear();

  // ── 2. Collecter tous les tickers ──
  const allTickers = new Set(portfolio.map(r => r.ticker));
  txs.forEach(tx => { if (tx.ticker) allTickers.add(tx.ticker); });
  const tickers = [...allTickers].filter(Boolean);

  // ── 3. Fetch prix DAILY pour tous les tickers sur toute la période ──
  const dailyPrices = {}; // { ticker: { 'YYYY-MM-DD': close } }

  if (tickers.length) {
    const p1 = Math.floor(new Date(firstYear + '-01-01T00:00:00').getTime() / 1000);
    const p2 = Math.floor(Date.now() / 1000) + 86400;

    await Promise.all(tickers.map(async ticker => {
      dailyPrices[ticker] = {};
      try {
        const yahooTicker = resolveToYahooTicker(ticker);
        const raw = await fetchWithFallback(
          'https://query1.finance.yahoo.com/v8/finance/chart/'
          + encodeURIComponent(yahooTicker)
          + '?interval=1d&period1=' + p1 + '&period2=' + p2
        );
        const d = JSON.parse(raw);
        const res = d.chart && d.chart.result && d.chart.result[0];
        if (!res || !res.timestamp) return;
        const timestamps = res.timestamp;
        const closes = res.indicators.quote[0].close;
        for (let i = 0; i < timestamps.length; i++) {
          if (closes[i] == null) continue;
          const key = new Date(timestamps[i] * 1000).toISOString().slice(0, 10);
          dailyPrices[ticker][key] = closes[i];
        }
      } catch (e) { /* skip */ }
    }));
  }

  // ── 4. Prix live ──
  const livePrice = {};
  portfolio.forEach(r => { livePrice[r.ticker] = r.currentPrice; });

  // ── 5. Helpers ──
  function getPriceAt(ticker, dateStr) {
    if (dailyPrices[ticker] && dailyPrices[ticker][dateStr]) return dailyPrices[ticker][dateStr];
    if (!dailyPrices[ticker]) return null;
    const keys = Object.keys(dailyPrices[ticker]).sort();
    let last = null;
    for (const k of keys) {
      if (k > dateStr) break;
      last = dailyPrices[ticker][k];
    }
    return last;
  }

  function inventoryAtDate(dateStr) {
    const inv = {};
    for (const tx of txs) {
      if (!tx.date || tx.date > dateStr) continue;
      if (tx.type === 'buy') inv[tx.ticker] = (inv[tx.ticker] || 0) + tx.qty;
      else if (tx.type === 'sell') {
        inv[tx.ticker] = (inv[tx.ticker] || 0) - tx.qty;
        if (inv[tx.ticker] <= 0.0001) delete inv[tx.ticker];
      }
    }
    return inv;
  }

  function cashAtDate(dateStr) {
    let cash = 0;
    versements.forEach(v => { if (v.date && v.date <= dateStr) cash += v.amount; });
    txs.forEach(t => {
      if (!t.date || t.date > dateStr) return;
      if (t.type === 'buy') cash -= t.qty * t.price;
      if (t.type === 'sell') cash += t.qty * t.price;
    });
    return Math.max(0, cash);
  }

  // Valeur totale (titres + cash) à une date
  function totalValueAt(dateStr, useLive) {
    const inv = inventoryAtDate(dateStr);
    let val = cashAtDate(dateStr);
    for (const [ticker, qty] of Object.entries(inv)) {
      if (qty <= 0.0001) continue;
      const p = useLive ? (livePrice[ticker] || getPriceAt(ticker, dateStr)) : getPriceAt(ticker, dateStr);
      if (p != null) val += qty * p;
    }
    return val;
  }

  // ── 6. Construire la liste triée de toutes les dates de trading ──
  const allTradingDatesSet = new Set();
  for (const ticker of tickers) {
    if (dailyPrices[ticker]) {
      for (const d of Object.keys(dailyPrices[ticker])) allTradingDatesSet.add(d);
    }
  }
  const allTradingDates = [...allTradingDatesSet].sort();

  // Grouper tous les versements par date
  const allVersByDate = {};
  for (const v of versements) {
    if (!v.date) continue;
    if (!allVersByDate[v.date]) allVersByDate[v.date] = 0;
    allVersByDate[v.date] += v.amount;
  }

  // ── 7. Calcul TWR par année (méthode TWR rigoureuse, alignée Boursorama) ──
  //
  // La formule naïve V_jour / (V_veille + versement_jour) souffre de deux biais :
  //   1) Quand le prix Yahoo d'un titre diffère du prix réel de la transaction
  //      (cas WPEA.PA acheté 5.54€ mais Yahoo cote 6.22€), Yahoo "voit" un gain
  //      artificiel le jour de l'achat → la perf TWR est gonflée.
  //   2) Convention "same_day" sur les versements : Bourso compte plutôt les
  //      versements en sortie de journée (J+1).
  //
  // Correction appliquée :
  //   - Neutralisation des écarts prix Yahoo / prix transaction comme flux extérieurs.
  //     Pour chaque transaction du jour : flux_tx += sign × qty × (prix_yahoo - prix_tx)
  //     (sign = +1 achat, -1 vente)
  //   - Convention next_day pour versements : (1+r) = (V_jour - vers_jour) / (V_veille + flux_tx)
  //
  // Perf annuelle = ∏(1 + perf_jour) - 1

  // Index : pour chaque (ticker, date), prix moyen pondéré des transactions de ce jour
  const txByDate = {};
  for (const tx of txs) {
    if (!tx.date || !tx.ticker) continue;
    if (!txByDate[tx.date]) txByDate[tx.date] = [];
    txByDate[tx.date].push(tx);
  }

  // Calcule le flux d'écart de valorisation pour les transactions d'un jour donné
  function txFluxAt(dateStr) {
    const txList = txByDate[dateStr];
    if (!txList) return 0;
    let flux = 0;
    for (const tx of txList) {
      const py = getPriceAt(tx.ticker, dateStr);
      if (py == null) continue;
      const sign = (tx.type === 'buy') ? 1 : -1;
      flux += sign * tx.qty * (py - tx.price);
    }
    return flux;
  }

  const yearResults = [];

  for (let y = firstYear; y <= currentYear; y++) {
    const isYTD = (y === currentYear);

    // Versements de l'année
    const yearVers = versements.filter(v => {
      if (!v.date) return false;
      return new Date(v.date + 'T12:00:00').getFullYear() === y;
    });

    // Valeur en début d'année (= valeur au 31/12 Y-1)
    let prevValue;
    if (y === firstYear) {
      prevValue = 0;
    } else {
      prevValue = totalValueAt((y - 1) + '-12-31', false);
    }

    // Filtrer les dates de trading de cette année
    const yearStart = y + '-01-01';
    const yearEnd = y + '-12-31';
    const todayStr = new Date().toISOString().slice(0, 10);

    // Collecter toutes les dates à traiter :
    // dates de trading Yahoo + dates de versement + dates de transaction
    // Pour le YTD : exclure aujourd'hui de la boucle (on utilise les prix live après)
    const yearDatesSet = new Set();
    for (const d of allTradingDates) {
      if (d >= yearStart && d <= yearEnd) {
        if (isYTD && d >= todayStr) continue;
        yearDatesSet.add(d);
      }
    }
    for (const v of yearVers) {
      if (v.date >= yearStart && v.date <= yearEnd) {
        if (isYTD && v.date >= todayStr) continue;
        yearDatesSet.add(v.date);
      }
    }
    // Ajouter aussi les dates de transaction (pour traiter le flux d'écart)
    for (const tx of txs) {
      if (!tx.date) continue;
      if (tx.date >= yearStart && tx.date <= yearEnd) {
        if (isYTD && tx.date >= todayStr) continue;
        yearDatesSet.add(tx.date);
      }
    }
    const yearDates = [...yearDatesSet].sort();

    let twrProduct = 1;
    let hasCapital = false;

    for (const d of yearDates) {
      const versToday = allVersByDate[d] || 0;
      const fluxTx    = txFluxAt(d);
      const valToday  = totalValueAt(d, false);

      // Convention next_day + neutralisation flux tx :
      //   (1+r) = (V_jour - vers_jour) / (V_veille + flux_tx)
      const denom = prevValue + fluxTx;
      if (denom > 0.01) {
        hasCapital = true;
        twrProduct *= (valToday - versToday) / denom;
      }

      prevValue = valToday;
    }

    // Dernière étape : valeur de fin
    let valueEnd;
    if (isYTD) {
      // Ajouter le rendement d'aujourd'hui avec les prix LIVE
      valueEnd = totalValueAt(todayStr, true);
      const versToday = allVersByDate[todayStr] || 0;
      const fluxTx    = txFluxAt(todayStr);
      const denom = prevValue + fluxTx;
      if (denom > 0.01) {
        hasCapital = true;
        twrProduct *= (valueEnd - versToday) / denom;
      }
    } else {
      valueEnd = totalValueAt(yearEnd, false);
      if (prevValue > 0.01) {
        const lastDate = yearDates.length ? yearDates[yearDates.length - 1] : null;
        if (lastDate && lastDate < yearEnd) {
          const denom = prevValue;
          if (denom > 0.01) {
            hasCapital = true;
            twrProduct *= (valueEnd / denom);
          }
        }
      }
    }

    const perfPct = hasCapital ? (twrProduct - 1) * 100 : 0;

    // Gain en € (pour affichage)
    const valueYearStart = (y === firstYear) ? 0 : totalValueAt((y - 1) + '-12-31', false);
    const totalVersYear = yearVers.reduce((s, v) => s + v.amount, 0);
    const totalGain = valueEnd - valueYearStart - totalVersYear;

    yearResults.push({
      year: y,
      isYTD,
      base: +(valueYearStart + totalVersYear).toFixed(2),
      gain: +totalGain.toFixed(2),
      perfPct: +perfPct.toFixed(2),
    });
  }

  return { years: yearResults };
}

// ─────────────────────────────────────────────────────────────────
//  Calcul de performances courtes (mois en cours, veille)
//  Utilise les dailyValues du broker en priorité, sinon retourne null.
//  Même formule TWR que la perf annuelle :
//    (1+r) = V_jour / (V_veille + vers_jour)
// ─────────────────────────────────────────────────────────────────
function computeShortPerf() {
  const dailyValues = getDailyValues(currentUser);
  const versements  = getVersements(currentUser);
  const portfolio   = getPortfolio(currentUser);
  const txs         = getTransactions(currentUser);

  if (!dailyValues || dailyValues.length < 2) {
    return { month: null, prevDay: null, monthLabel: null };
  }

  // Index date -> valeur, trié
  const valByDate = {};
  for (const dv of dailyValues) {
    if (dv && dv.date && typeof dv.value === 'number' && isFinite(dv.value)) {
      valByDate[dv.date] = dv.value;
    }
  }
  const sortedDates = Object.keys(valByDate).sort();
  if (sortedDates.length < 2) return { month: null, prevDay: null, monthLabel: null };

  // Versements par date
  const versByDate = {};
  for (const v of versements) {
    if (!v || !v.date) continue;
    versByDate[v.date] = (versByDate[v.date] || 0) + v.amount;
  }

  // liveValue = portefeuille actuel + cash résiduel
  let liveValue = null;
  if (portfolio && portfolio.length) {
    let v = 0;
    for (const r of portfolio) if (r && r.qty && r.currentPrice) v += r.qty * r.currentPrice;
    if (v > 0) liveValue = v;
  }
  let cashResidual = 0;
  for (const v of versements) if (v && typeof v.amount === 'number') cashResidual += v.amount;
  for (const t of txs) {
    if (!t || !t.qty || !t.price) continue;
    if (t.type === 'buy')  cashResidual -= t.qty * t.price;
    if (t.type === 'sell') cashResidual += t.qty * t.price;
  }
  if (cashResidual > 0.001 && liveValue != null) liveValue += cashResidual;

  const todayStr = new Date().toISOString().slice(0, 10);
  const lastDate = sortedDates[sortedDates.length - 1];

  // Valeur "courante" : si on a une valeur live, on l'utilise. Sinon dernière dailyValue.
  const valueNow = (liveValue != null) ? liveValue : valByDate[lastDate];
  // Dernière date "comptée" comme V_courante
  const dateNow = (liveValue != null && lastDate < todayStr) ? todayStr : lastDate;

  // ─── Perf de la veille ───
  // = dernier jour ouvré complet : ratio entre la valeur de la veille et l'avant-veille
  // Pour rester cohérent avec Bourso "ma performance de la veille" = perf du dernier
  // jour de cotation dans le CSV broker (pas le live).
  let prevDay = null;
  if (sortedDates.length >= 2) {
    const dLast = sortedDates[sortedDates.length - 1];
    const dPrev = sortedDates[sortedDates.length - 2];
    const versJ = versByDate[dLast] || 0;
    const denom = valByDate[dPrev] + versJ;
    if (denom > 0.01) {
      prevDay = (valByDate[dLast] / denom - 1) * 100;
    }
  }

  // ─── Perf du mois en cours ───
  // V_début mois = dernière valeur connue strictement avant le 1er du mois en cours
  const now = new Date();
  const monthStart = now.toISOString().slice(0, 7) + '-01'; // YYYY-MM-01
  const monthLabel = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  let prevValue = null;
  for (let i = sortedDates.length - 1; i >= 0; i--) {
    if (sortedDates[i] < monthStart) { prevValue = valByDate[sortedDates[i]]; break; }
  }
  // Si on a démarré ce mois (compte ouvert ce mois), V_début = 0
  if (prevValue == null) prevValue = 0;

  // Dates à enchaîner : toutes les dailyValues du mois + dates de versement du mois
  const monthDatesSet = new Set();
  for (const d of sortedDates) {
    if (d >= monthStart && d <= dateNow) monthDatesSet.add(d);
  }
  for (const d of Object.keys(versByDate)) {
    if (d >= monthStart && d <= dateNow) monthDatesSet.add(d);
  }
  const monthDates = [...monthDatesSet].sort();

  let twr = 1, hasCapital = false;
  let lastSeenValue = prevValue;
  for (const d of monthDates) {
    const versJ = versByDate[d] || 0;
    const valJ  = (valByDate[d] != null) ? valByDate[d] : lastSeenValue;
    const denom = prevValue + versJ;
    if (denom > 0.01) {
      hasCapital = true;
      twr *= valJ / denom;
    }
    prevValue = valJ;
    lastSeenValue = valJ;
  }

  // Étape live : si le dernier point du mois < aujourd'hui et qu'on a liveValue
  if (liveValue != null && monthDates.length && monthDates[monthDates.length - 1] < todayStr) {
    const versJ = versByDate[todayStr] || 0;
    const denom = prevValue + versJ;
    if (denom > 0.01) {
      hasCapital = true;
      twr *= liveValue / denom;
    }
  }

  const month = hasCapital ? (twr - 1) * 100 : null;

  return { month, prevDay, monthLabel };
}

function renderPerformancePage(result, portfolio, txs) {
  const rows = result.years;

  // ── KPIs globaux ──
  const totalInvested = portfolio.reduce((s, r) => s + r.qty * r.buyPrice, 0);
  const totalValue = portfolio.reduce((s, r) => s + r.qty * r.currentPrice, 0);
  const latentPnl = totalValue - totalInvested;
  const totalRealized = txs.filter(t => t.type === 'sell' && t.realizedPnl != null)
                            .reduce((s, t) => s + t.realizedPnl, 0);
  const totalPerfEur = totalRealized + latentPnl;
  const totalPerfPct = totalInvested > 0 ? (totalPerfEur / totalInvested * 100) : 0;

  // KPIs courts (mois en cours, veille) — calculés depuis dailyValues si dispo
  const shortPerf = computeShortPerf();
  const fmtPct = v => (v == null ? '—' : (v >= 0 ? '+' : '') + v.toFixed(2) + ' %');
  const colPct = v => v == null ? 'var(--text3)' : (v >= 0 ? 'var(--positive)' : 'var(--negative)');

  const kpiHtml = `
    <div class="stat-card">
      <div class="stat-label">PERF GLOBALE</div>
      <div class="stat-value" style="color:${totalPerfEur >= 0 ? 'var(--positive)' : 'var(--negative)'}">
        ${totalPerfEur >= 0 ? '+' : ''}${fmt(totalPerfEur)}
      </div>
      <div class="stat-sub">${totalPerfPct >= 0 ? '+' : ''}${totalPerfPct.toFixed(2)} %</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">PERF ${(shortPerf.monthLabel || 'MOIS EN COURS').toUpperCase()}</div>
      <div class="stat-value" style="color:${colPct(shortPerf.month)}">
        ${fmtPct(shortPerf.month)}
      </div>
      <div class="stat-sub">${shortPerf.month == null ? 'Importez le CSV broker' : 'Depuis le 1er du mois'}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">PERF DE LA VEILLE</div>
      <div class="stat-value" style="color:${colPct(shortPerf.prevDay)}">
        ${fmtPct(shortPerf.prevDay)}
      </div>
      <div class="stat-sub">${shortPerf.prevDay == null ? 'Importez le CSV broker' : 'Dernier jour de cotation'}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">PNL RÉALISÉ TOTAL</div>
      <div class="stat-value" style="color:${totalRealized >= 0 ? 'var(--positive)' : 'var(--negative)'}">
        ${totalRealized >= 0 ? '+' : ''}${fmt(totalRealized)}
      </div>
      <div class="stat-sub">Plus-values encaissées</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">PV LATENTE</div>
      <div class="stat-value" style="color:${latentPnl >= 0 ? 'var(--positive)' : 'var(--negative)'}">
        ${latentPnl >= 0 ? '+' : ''}${fmt(latentPnl)}
      </div>
      <div class="stat-sub">${totalInvested > 0 ? (latentPnl >= 0 ? '+' : '') + (latentPnl / totalInvested * 100).toFixed(2) + ' %' : '—'} · Non encaissée</div>
    </div>
  `;
  document.getElementById('perf-kpis').innerHTML = kpiHtml;

  // ── Tableau ──
  const tbody = document.getElementById('perf-tbody');
  tbody.innerHTML = rows.map(r => {
    const sign = v => v >= 0 ? '+' : '';
    const color = v => v >= 0 ? 'var(--positive)' : 'var(--negative)';
    const perfStr = `<span style="font-weight:600;color:${color(r.perfPct)}">${sign(r.perfPct)}${r.perfPct.toFixed(2)} %</span>`;
    return `<tr>
      <td style="font-weight:600">${r.isYTD ? r.year + ' <span style="font-size:10px;color:var(--text3)">YTD</span>' : r.year}</td>
      <td class="mono" style="text-align:right">${fmt(r.base)}</td>
      <td class="mono" style="text-align:right;color:${color(r.gain)}">${sign(r.gain)}${fmt(r.gain)}</td>
      <td class="mono" style="text-align:right">${perfStr}</td>
    </tr>`;
  }).join('');

  // ── Graphique barres ──
  const ctx = document.getElementById('chart-perf-annual');
  if (!ctx) return;
  if (perfAnnualChart) perfAnnualChart.destroy();

  perfAnnualChart = new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: rows.map(r => r.isYTD ? r.year + ' YTD' : String(r.year)),
      datasets: [{
        label: 'Performance',
        data: rows.map(r => r.perfPct),
        backgroundColor: rows.map(r => r.perfPct >= 0 ? 'rgba(0,224,158,0.7)' : 'rgba(255,77,106,0.7)'),
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: c => (c.raw >= 0 ? '+' : '') + c.raw.toFixed(2) + ' %'
          }
        }
      },
      scales: {
        x: { ticks: { color: '#8892a8' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: {
          ticks: { color: '#8892a8', callback: v => v + ' %' },
          grid: { color: 'rgba(255,255,255,0.04)' }
        }
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════
// CHAT IDÉES & SUGGESTIONS
// ═══════════════════════════════════════════════════════════

let _threadsUnsub  = null;
let _chatUnsub     = null;
let _threadDocUnsub = null;
let _activeThread  = null;
let _avatarCache   = {}; // email → avatarUrl
let _chatMsgCount  = 0;
let _replyTo       = null;
let _typingActive  = false;
let _presenceInterval = null;
let _presenceUnsub    = null;
let _presenceMap      = {}; // uid → { online, email }
let _typingTimer   = null;
let _searchQuery   = '';
let _lastThreadDocs = null;
let _lastThreadUser = null;
let _currentThreadUnreadCount  = 0;
let _currentThreadUnreadAdmin  = 0;
let _currentThreadUnreadUser   = 0;

function _escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function _escAttr(s) { return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'"); }
function _dateLabel(date) {
  const today = new Date(); today.setHours(0,0,0,0);
  const yest  = new Date(today); yest.setDate(today.getDate()-1);
  const d = new Date(date); d.setHours(0,0,0,0);
  if (+d === +today) return "Aujourd'hui";
  if (+d === +yest)  return 'Hier';
  return date.toLocaleDateString('fr-FR', {day:'numeric',month:'long',year:'numeric'});
}
const _baseTitle = document.title || 'CapitalView';
function _updateFavicon(count) {
  document.title = count > 0
    ? _baseTitle + ' — ' + count + ' message' + (count > 1 ? 's' : '') + ' non lu' + (count > 1 ? 's' : '')
    : _baseTitle;
  try {
    const canvas = document.createElement('canvas'); canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const img = new Image(); img.src = 'logo.png';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 32, 32);
      if (count > 0) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(24, 8, 9, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(count > 9 ? '9+' : String(count), 24, 8);
      }
      let link = document.querySelector("link[rel='icon']") || document.querySelector("link[rel='shortcut icon']");
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
      link.href = canvas.toDataURL();
    };
    img.onerror = () => {};
  } catch(e) {}
}
function _requestNotifPermission() {
  if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
}
function _showBrowserNotif(title, body, threadId) {
  if (!('Notification' in window) || Notification.permission !== 'granted' || !document.hidden) return;
  try {
    const n = new Notification('CapitalView — ' + title, { body, icon: 'logo.png' });
    n.onclick = () => { window.focus(); openIdeasPanel(); if (threadId) openThread(threadId); n.close(); };
    setTimeout(() => n.close(), 8000);
  } catch(e) {}
}

let _toastTimer   = null;
let _threadUnread = {}; // { [threadId]: unreadCount }
let _toastThreadId = null;

function _showChatToast({ icon = '💬', title, msg, threadId = null, duration = 5000 }) {
  const toast = document.getElementById('chat-toast');
  if (!toast) return;
  _toastThreadId = threadId;
  document.getElementById('chat-toast-icon').textContent  = icon;
  document.getElementById('chat-toast-title').textContent = title;
  document.getElementById('chat-toast-msg').textContent   = msg;
  const bar = document.getElementById('chat-toast-bar');
  bar.style.animation = 'none';
  bar.offsetHeight; // reflow
  bar.style.animation = `toast-bar ${duration}ms linear forwards`;
  toast.style.display = 'block';
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(_dismissChatToast, duration);
}

window._chatToastClick = function() {
  _dismissChatToast();
  if (_toastThreadId) { openIdeasPanel(); openThread(_toastThreadId); }
};

window._dismissChatToast = function() {
  const toast = document.getElementById('chat-toast');
  if (toast) toast.style.display = 'none';
  if (_toastTimer) { clearTimeout(_toastTimer); _toastTimer = null; }
};

function _playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const note = (freq, t, dur, vol = 0.1) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = freq;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t); osc.stop(t + dur);
    };
    const t = ctx.currentTime;
    if      (type === 'message') { note(880, t, 0.25); }
    else if (type === 'created') { note(523, t, 0.18); note(659, t + 0.1, 0.18); note(784, t + 0.2, 0.28); }
    else if (type === 'closed')  { note(523, t, 0.18); note(392, t + 0.13, 0.3); }
  } catch(e) {}
}

window.openIdeasPanel = function() {
  document.getElementById('ideas-overlay').style.display = 'flex';
  updateRoleBadges();
  _requestNotifPermission();
  const user = fbAuth.currentUser;
  document.getElementById('ideas-panel-subtitle').textContent = isAdmin(user)
    ? 'Toutes les conversations' : 'Envoyez un message ou une idée';
  document.getElementById('btn-new-thread').style.display = isAdmin(user) ? 'none' : 'inline-block';
  const searchZone = document.getElementById('chat-search-zone');
  if (searchZone) searchZone.style.display = isAdmin(user) ? 'block' : 'none';
  if (!_threadsUnsub) _listenThreads(user);
};

window.closeIdeasPanel = function() {
  document.getElementById('ideas-overlay').style.display = 'none';
  if (_chatUnsub)      { _chatUnsub();      _chatUnsub      = null; }
  if (_threadDocUnsub) { _threadDocUnsub(); _threadDocUnsub = null; }
  _clearTyping();
  clearReply();
  _searchQuery = '';
  const si = document.getElementById('chat-search-input');
  if (si) si.value = '';
  _activeThread = null;
};

// ─── PRÉSENCE ────────────────────────────────────────────
function _startPresenceHeartbeat(user) {
  const ref = firestoreDoc(db, 'presence', user.uid);
  const update = (online) => setFirestoreDoc(ref, {
    online,
    lastSeen: serverTimestamp(),
    email: user.email,
    name: user.displayName || user.email.split('@')[0],
  }, { merge: true }).catch(() => {});

  update(true);
  _presenceInterval = setInterval(() => update(true), 30000);

  document.addEventListener('visibilitychange', _onPresenceVisibility);
  window.addEventListener('beforeunload', () => update(false));
}

function _onPresenceVisibility() {
  if (!fbAuth.currentUser || !db) return;
  const ref = firestoreDoc(db, 'presence', fbAuth.currentUser.uid);
  setFirestoreDoc(ref, { online: !document.hidden, lastSeen: serverTimestamp() }, { merge: true }).catch(() => {});
}

function _stopPresenceHeartbeat(uid) {
  clearInterval(_presenceInterval);
  _presenceInterval = null;
  document.removeEventListener('visibilitychange', _onPresenceVisibility);
  if (uid && db) {
    setFirestoreDoc(firestoreDoc(db, 'presence', uid), { online: false }, { merge: true }).catch(() => {});
  }
  if (_presenceUnsub) { _presenceUnsub(); _presenceUnsub = null; }
  _presenceMap = {};
}

function _startPresenceListener() {
  if (_presenceUnsub) return;
  _presenceUnsub = onSnapshot(
    firestoreCollection(db, 'presence'),
    snap => {
      const now = Date.now();
      snap.docs.forEach(doc => {
        const d = doc.data();
        const lastSeen = d.lastSeen && d.lastSeen.toMillis ? d.lastSeen.toMillis() : 0;
        _presenceMap[doc.id] = { online: !!d.online && (now - lastSeen) < 90000, email: d.email || '' };
      });
      _updatePresenceDots();
    },
    err => console.warn('[presence] listener error — vérifie les règles Firestore:', err.message)
  );
}

function _isOnlineByEmail(email) {
  return Object.values(_presenceMap).some(p => p.email === email && p.online);
}

function _presenceDot(email) {
  const online = _isOnlineByEmail(email);
  return '<span data-presence-email="' + _escAttr(email) + '" title="' + (online ? 'En ligne' : 'Hors ligne') + '" style="width:8px;height:8px;border-radius:50%;flex-shrink:0;background:' + (online ? 'var(--positive)' : 'var(--text3)') + ';opacity:' + (online ? '1' : '0.4') + '"></span>';
}

function _updatePresenceDots() {
  const now = Date.now();
  // Rebuild online set
  Object.keys(_presenceMap).forEach(uid => {
    const p = _presenceMap[uid];
    if (p._lastSeen) p.online = p.online && (now - p._lastSeen) < 90000;
  });
  document.querySelectorAll('[data-presence-email]').forEach(el => {
    const email = el.dataset.presenceEmail;
    const online = _isOnlineByEmail(email);
    el.style.background = online ? 'var(--positive)' : 'var(--text3)';
    el.style.opacity    = online ? '1' : '0.4';
    el.title = online ? 'En ligne' : 'Hors ligne';
  });
}

async function _renderMembersPanel(d, threadId, el) {
  // Récupère photoURL depuis roles pour chaque email
  const emails = [d.userEmail, ...(d.memberEmails || [])].filter(Boolean);
  const photoMap = {};
  try {
    await Promise.all(emails.map(async e => {
      const snap = await getDocs(firestoreQuery(firestoreCollection(db, 'roles'), firestoreWhere('email', '==', e)));
      if (!snap.empty) {
        const rd = snap.docs[0].data();
        photoMap[e] = rd.avatarBase64 || rd.photoURL || null;
      }
    }));
  } catch(e) { /* ignore */ }

  const ownerEmail = d.userEmail || '';
  const ownerName  = d.userName  || ownerEmail.split('@')[0] || 'Utilisateur';
  let html = '<div style="padding:4px 12px 6px;font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Propriétaire</div>';
  html += _memberRow(ownerName, ownerEmail, 'user', threadId, false, photoMap[ownerEmail]);
  if (d.memberEmails && d.memberEmails.length) {
    html += '<div style="padding:10px 12px 6px;font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px">Invités</div>';
    html += d.memberEmails.map(e => {
      const role = (d.memberRoles && d.memberRoles[e]) || 'user';
      return _memberRow(e.split('@')[0], e, role, threadId, true, photoMap[e]);
    }).join('');
  }
  el.innerHTML = html;
}

function _memberRow(name, email, role, threadId, canRemove, photoURL) {
  const roleColor = role === 'superadmin' ? '#fbbf24' : role === 'admin' ? 'var(--accent)' : 'var(--text3)';
  const roleIcon  = role === 'superadmin' ? IC.crown : role === 'admin' ? IC.zap : IC.user;
  const initial   = (name || '?')[0].toUpperCase();
  const avatarEl  = photoURL
    ? '<img src="' + _escHtml(photoURL) + '" style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0">'
    : '<div style="width:28px;height:28px;border-radius:50%;background:var(--s3);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--text2);flex-shrink:0">' + _escHtml(initial) + '</div>';
  return '<div style="display:flex;align-items:center;gap:8px;padding:5px 12px;border-radius:6px;margin:0 4px" '
    + 'onmouseenter="this.style.background=\'var(--s2)\'" onmouseleave="this.style.background=\'\'">'
    + '<div style="position:relative;flex-shrink:0">'
    + avatarEl
    + '<span data-presence-email="' + _escAttr(email) + '" title="' + (_isOnlineByEmail(email) ? 'En ligne' : 'Hors ligne') + '" style="position:absolute;bottom:0;right:0;width:9px;height:9px;border-radius:50%;border:2px solid var(--s1);background:' + (_isOnlineByEmail(email) ? 'var(--positive)' : 'var(--text3)') + ';opacity:' + (_isOnlineByEmail(email) ? '1' : '0.4') + '"></span>'
    + '</div>'
    + '<div style="flex:1;min-width:0">'
    + '<div style="font-size:12px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + _escHtml(name) + '</div>'
    + '<div style="font-size:10px;color:' + roleColor + '">' + roleIcon + ' ' + role + '</div>'
    + '</div>'
    + (canRemove ? '<button onclick="removeMemberFromThread(\'' + threadId + '\',\'' + _escAttr(email) + '\')" style="background:none;border:none;color:var(--text3);cursor:pointer;font-size:12px;flex-shrink:0;transition:color .15s" onmouseenter="this.style.color=\'var(--negative)\'" onmouseleave="this.style.color=\'var(--text3)\'" title="Retirer">✕</button>' : '')
    + '</div>';
}

function _handleThreadsSnap(snap, user) {
  _cleanExpiredThreads(snap.docs);
  _renderThreads(snap.docs.filter(d => { const e = d.data().expiresAt; return !e || !e.toDate || e.toDate() > new Date(); }), user);
  const unreadField = isAdmin(user) ? 'unreadAdmin' : 'unreadUser';
  const totalUnread = snap.docs.reduce((sum, d) => sum + (d.data()[unreadField] || 0), 0);
  _updateFavicon(totalUnread);
  if (isAdmin(user)) {
    const unread = snap.docs.filter(d => d.data().unreadAdmin > 0).length;
    ['ideas-badge', 'ideas-badge-mobile'].forEach(id => {
      const b = document.getElementById(id);
      if (b) { b.textContent = unread || ''; b.style.display = unread ? 'inline-block' : 'none'; }
    });
  }
  snap.docChanges().forEach(change => {
    const d   = change.doc.data();
    const tid = change.doc.id;
    if (change.type === 'added' && isAdmin(user) && Object.keys(_threadUnread).length > 0) {
      _playSound('created');
      _showChatToast({ icon: '🆕', title: d.title || 'Nouvelle conversation', msg: d.userName || d.userEmail || '', threadId: tid });
      _showBrowserNotif(d.title || 'Nouvelle conversation', d.userName || d.userEmail || '', tid);
    }
    if (change.type !== 'modified') return;
    const prev = _threadUnread[tid] ?? 0;
    const cur  = d[unreadField] || 0;
    _threadUnread[tid] = cur;
    if (cur > prev) {
      if (_activeThread !== tid) {
        _playSound('message');
        const toastMsg = (d.lastSenderName ? d.lastSenderName + ' : ' : '') + (d.lastMessage || '📷 Photo');
        _showChatToast({ icon: IC.message, title: d.title || 'Nouveau message', msg: toastMsg, threadId: tid });
        _showBrowserNotif(d.title || 'Nouveau message', toastMsg, tid);
      }
    }
  });
  snap.docs.forEach(d => { _threadUnread[d.id] = _threadUnread[d.id] ?? (d.data()[unreadField] || 0); });
}

function _listenThreads(user) {
  if (_threadsUnsub) _threadsUnsub();
  const col = firestoreCollection(db, 'ideas');

  if (isAdmin(user)) {
    const q = firestoreQuery(col, firestoreOrderBy('updatedAt', 'desc'));
    _threadsUnsub = onSnapshot(q, snap => _handleThreadsSnap(snap, user));
    return;
  }

  // Non-admin : deux listeners séparés (évite index composite)
  let _ownDocs    = [];
  let _memberDocs = [];
  const qOwn    = firestoreQuery(col, firestoreWhere('uid', '==', user.uid), firestoreOrderBy('updatedAt', 'desc'));
  const qMember = firestoreQuery(col, firestoreWhere('memberEmails', 'array-contains', user.email));

  function _merge() {
    const map = new Map();
    [..._ownDocs, ..._memberDocs].forEach(d => map.set(d.id, d));
    const merged = [...map.values()].sort((a, b) => {
      const ta = a.data().updatedAt?.toMillis?.() || 0;
      const tb = b.data().updatedAt?.toMillis?.() || 0;
      return tb - ta;
    });
    _handleThreadsSnap({ docs: merged, docChanges: () => [] }, user);
  }

  const unsub1 = onSnapshot(qOwn,    snap => { _ownDocs    = snap.docs; _merge(); });
  const unsub2 = onSnapshot(qMember, snap => { _memberDocs = snap.docs; _merge(); });
  _threadsUnsub = () => { unsub1(); unsub2(); };
}

function _renderThreads(docs, user) {
  _lastThreadDocs = docs;
  _lastThreadUser = user;

  if (!_activeThread) {
    const saved = localStorage.getItem('chat_active_thread');
    const panelOpen = document.getElementById('ideas-overlay').style.display === 'flex';
    if (saved && panelOpen && docs.find(d => d.id === saved)) openThread(saved);
  }

  const filtered = _searchQuery
    ? docs.filter(doc => {
        const d = doc.data();
        return (d.title||'').toLowerCase().includes(_searchQuery)
          || (d.lastMessage||'').toLowerCase().includes(_searchQuery)
          || (d.userName||'').toLowerCase().includes(_searchQuery)
          || (d.userEmail||'').toLowerCase().includes(_searchQuery);
      })
    : docs;

  const el = document.getElementById('ideas-threads');
  if (!filtered.length) {
    el.innerHTML = '<div style="padding:20px 12px;font-size:12px;color:var(--text3)">' + (_searchQuery ? 'Aucun résultat.' : 'Aucune conversation.') + '</div>';
    return;
  }

  el.innerHTML = filtered.map(doc => {
    const d = doc.data();
    const unread = isAdmin(user) ? (d.unreadAdmin || 0) : (d.unreadUser || 0);
    const active = _activeThread === doc.id;
    const isClosed = d.status === 'closed';
    const statusDot = d.status === 'done'
      ? '<span style="width:6px;height:6px;border-radius:50%;background:var(--positive);flex-shrink:0;display:inline-block"></span>'
      : isClosed
      ? '<span style="width:6px;height:6px;border-radius:50%;background:var(--negative);flex-shrink:0;display:inline-block"></span>'
      : '';
    let closedLabel = '';
    if (isClosed && d.expiresAt && d.expiresAt.toDate) {
      const diff = Math.max(0, d.expiresAt.toDate() - new Date());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      closedLabel = '<span style="font-size:9px;color:var(--negative);margin-left:4px">🔒 ' + (h > 0 ? h + 'h ' + m + 'm' : m + 'm') + '</span>';
    }
    return '<div onclick="openThread(\'' + doc.id + '\')" style="padding:10px 12px;cursor:pointer;border-bottom:1px solid var(--border);background:' + (active ? 'var(--s2)' : 'transparent') + ';transition:background .1s">'
      + '<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px">'
      + statusDot
      + '<span style="font-size:12px;font-weight:600;color:' + (isClosed ? 'var(--text3)' : 'var(--text)') + ';flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + _escHtml(d.title || 'Sans titre') + '</span>'
      + closedLabel
      + (unread ? '<span style="background:var(--accent);color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:8px;flex-shrink:0">' + unread + '</span>' : '')
      + '</div>'
      + (isAdmin(user) ? '<div style="font-size:10px;color:var(--text3);display:flex;align-items:center;gap:4px">'
        + (isSuperAdmin(user) && d.userEmail ? '<span data-presence-email="' + _escAttr(d.userEmail) + '" title="' + (_isOnlineByEmail(d.userEmail) ? 'En ligne' : 'Hors ligne') + '" style="width:6px;height:6px;border-radius:50%;flex-shrink:0;background:' + (_isOnlineByEmail(d.userEmail) ? 'var(--positive)' : 'var(--text3)') + ';opacity:' + (_isOnlineByEmail(d.userEmail) ? '1' : '0.4') + '"></span>' : '')
        + _escHtml(d.userName || d.userEmail || '') + '</div>' : '')
      + '<div style="font-size:10px;color:var(--text3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + _escHtml(d.lastMessage || '—') + '</div>'
      + '</div>';
  }).join('');
}

window.openThread = async function(threadId) {
  _activeThread = threadId;
  _chatMsgCount = 0;
  clearReply();
  if (_toastThreadId === threadId) _dismissChatToast();
  localStorage.setItem('chat_active_thread', threadId);
  if (_chatUnsub)      { _chatUnsub();      _chatUnsub      = null; }
  if (_threadDocUnsub) { _threadDocUnsub(); _threadDocUnsub = null; }
  _clearTyping();
  const user = fbAuth.currentUser;

  document.getElementById('ideas-chat-empty').style.display = 'none';
  document.getElementById('ideas-chat-view').style.display = 'flex';

  // Get thread data BEFORE resetting unread (for scroll-to-unread)
  const docSnap = await getFirestoreDoc(firestoreDoc(db, 'ideas', threadId));
  const d = docSnap.data();
  _currentThreadUnreadAdmin = d.unreadAdmin || 0;
  _currentThreadUnreadUser  = d.unreadUser  || 0;
  _currentThreadUnreadCount = isAdmin(user) ? _currentThreadUnreadAdmin : _currentThreadUnreadUser;

  // Reset unread
  const unreadField = isAdmin(user) ? { unreadAdmin: 0 } : { unreadUser: 0 };
  setFirestoreDoc(firestoreDoc(db, 'ideas', threadId), unreadField, { merge: true }).catch(() => {});

  const isClosed = d.status === 'closed';
  const isSA = isSuperAdmin(fbAuth.currentUser);

  // Pré-charger avatars depuis roles (await avant render messages)
  _avatarCache = {};
  const me = fbAuth.currentUser;
  if (me) _avatarCache[me.email] = getUserSettings(me.uid).avatarBase64 || me.photoURL || null;
  try {
    const emails = [d.userEmail, ...(d.memberEmails || []), me && me.email].filter(Boolean);
    await Promise.all([...new Set(emails)].map(async email => {
      try {
        const snap = await getDocs(firestoreQuery(firestoreCollection(db, 'roles'), firestoreWhere('email', '==', email)));
        if (!snap.empty) {
          const rd = snap.docs[0].data();
          _avatarCache[email] = rd.avatarBase64 || rd.photoURL || _avatarCache[email] || null;
        }
      } catch(e) {}
    }));
  } catch(e) {}

  // Header
  document.getElementById('ideas-chat-header').innerHTML =
    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'
    + '<span style="font-weight:700">' + _escHtml(d.title || 'Conversation') + '</span>'
    + (isAdmin(user) ? '<span style="font-size:10px;color:var(--text3);font-weight:400">— ' + _escHtml(d.userName || d.userEmail || '') + '</span>' : '')
    + '<div style="margin-left:auto;display:flex;gap:6px">'
    + (!isClosed ? '<button onclick="closeThread(\'' + threadId + '\')" style="padding:3px 10px;background:var(--s3);border:1px solid var(--border);color:var(--text2);border-radius:6px;font-size:10px;cursor:pointer">Terminer la conversation</button>' : '')
    + (isClosed && isAdmin(user) ? '<button onclick="reopenThread(\'' + threadId + '\')" style="padding:3px 10px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);color:var(--positive);border-radius:6px;font-size:10px;cursor:pointer">Rouvrir</button>' : '')
    + (isSA ? '<button onclick="exportThread(\'' + threadId + '\')" style="padding:3px 10px;background:var(--s3);border:1px solid var(--border);color:var(--text2);border-radius:6px;font-size:10px;cursor:pointer">⬇ Exporter</button>' : '')
    + (isSA ? '<button onclick="deleteThread(\'' + threadId + '\')" style="padding:3px 10px;background:rgba(255,77,106,0.1);border:1px solid rgba(255,77,106,0.2);color:var(--negative);border-radius:6px;font-size:10px;cursor:pointer">🗑 Supprimer</button>' : '')
    + '</div></div>';

  // Panneau membres Discord-style (SA only)
  const membersPanel = document.getElementById('chat-members-panel');
  const membersList  = document.getElementById('chat-members-list');
  if (isSA && membersPanel && membersList) {
    membersPanel.style.display = 'flex';
    const btnAdd = document.getElementById('btn-add-member-panel');
    if (btnAdd) btnAdd.onclick = () => addMemberToThread(threadId);

    _renderMembersPanel(d, threadId, membersList);
  } else if (membersPanel) {
    membersPanel.style.display = 'none';
  }

  // Input zone
  const inputZone = document.getElementById('ideas-input-zone');
  if (isClosed) {
    let timeLeft = '';
    if (d.expiresAt && d.expiresAt.toDate) {
      const diff = Math.max(0, d.expiresAt.toDate() - new Date());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      timeLeft = h > 0 ? `${h}h ${m}m` : `${m}m`;
    }
    inputZone.innerHTML = '<div style="text-align:center;padding:10px 0;font-size:12px;color:var(--text3)">'
      + '🔒 Conversation terminée'
      + (timeLeft ? ' — suppression dans <span style="color:var(--negative);font-weight:600">' + timeLeft + '</span>' : '')
      + '</div>';
  } else {
    if (!document.getElementById('ideas-msg-input')) {
      inputZone.innerHTML = ''
        + '<div id="chat-img-preview" style="display:none;margin-bottom:8px;position:relative;width:fit-content">'
        + '<img id="chat-img-thumb" style="max-height:80px;border-radius:8px;border:1px solid var(--border)">'
        + '<button onclick="clearChatImage()" style="position:absolute;top:-6px;right:-6px;background:var(--negative);border:none;color:#fff;border-radius:50%;width:18px;height:18px;font-size:10px;cursor:pointer;line-height:18px;text-align:center">✕</button>'
        + '</div>'
        + '<div style="display:flex;gap:8px;align-items:flex-end">'
        + '<button onclick="toggleEmojiPicker()" style="background:none;border:none;font-size:20px;cursor:pointer;padding:6px;border-radius:8px;color:var(--text2);flex-shrink:0" title="Emoji">😊</button>'
        + '<label style="cursor:pointer;padding:6px;border-radius:8px;font-size:16px;color:var(--text2);flex-shrink:0" title="Photo">📎<input type="file" id="chat-img-input" accept="image/*" onchange="chatImageSelected(event)" style="display:none"></label>'
        + '<textarea id="ideas-msg-input" placeholder="Votre message…" rows="2" onkeydown="ideasMsgKeydown(event)" oninput="_onChatTyping()" style="flex:1;background:var(--s2);border:1px solid var(--border);color:var(--text);border-radius:10px;padding:9px 12px;font-size:13px;font-family:var(--sans);resize:none"></textarea>'
        + '<button onclick="sendChatMessage()" style="padding:0 16px;height:42px;background:var(--accent);border:none;color:#fff;border-radius:10px;font-size:18px;cursor:pointer;flex-shrink:0">↑</button>'
        + '</div>';
    }
  }

  // Thread doc listener (typing + read status live update)
  _threadDocUnsub = onSnapshot(firestoreDoc(db, 'ideas', threadId), snap => {
    if (!snap.exists()) return;
    const data = snap.data();
    _currentThreadUnreadAdmin = data.unreadAdmin || 0;
    _currentThreadUnreadUser  = data.unreadUser  || 0;

    // Update read indicator without full re-render
    const readEl = document.getElementById('chat-last-read');
    if (readEl) {
      const isRead = isAdmin(fbAuth.currentUser) ? (_currentThreadUnreadUser === 0) : (_currentThreadUnreadAdmin === 0);
      readEl.style.color = isRead ? 'var(--accent)' : 'var(--text3)';
      readEl.textContent  = isRead ? '✓✓' : '✓';
    }

    // Refresh panneau membres si memberEmails a changé
    const membersPanel = document.getElementById('chat-members-panel');
    if (membersPanel && membersPanel.style.display !== 'none' && isSuperAdmin(fbAuth.currentUser)) {
      const membersList = document.getElementById('chat-members-list');
      if (membersList) _renderMembersPanel(data, threadId, membersList);
    }

    // Typing indicator
    const uid = fbAuth.currentUser.uid;
    const now = Date.now();
    const isTyping = Object.keys(data)
      .filter(k => k.startsWith('typing_') && k !== 'typing_' + uid)
      .some(k => data[k] && data[k].toDate && (now - data[k].toDate()) < 4000);
    const typingEl = document.getElementById('chat-typing');
    if (typingEl) {
      if (isTyping) {
        const name = isAdmin(fbAuth.currentUser) ? (data.userName || 'Utilisateur') : 'Support';
        typingEl.textContent = name + ' est en train d\'écrire…';
        typingEl.style.display = 'block';
      } else {
        typingEl.style.display = 'none';
      }
    }
  });

  // Reset pill + attach scroll-to-read listener
  const msgsEl = document.getElementById('ideas-messages');
  if (msgsEl) {
    const pill = document.getElementById('chat-new-msg-pill');
    if (pill) pill.style.display = 'none';
    msgsEl.onscroll = () => {
      if (msgsEl.scrollHeight - msgsEl.scrollTop - msgsEl.clientHeight < 80) {
        _resetUnreadCurrent();
      }
    };
  }

  // Messages listener
  const msgCol = firestoreCollection(db, 'ideas', threadId, 'messages');
  const q = firestoreQuery(msgCol, firestoreOrderBy('createdAt', 'asc'));
  _chatUnsub = onSnapshot(q, snap => _renderMessages(snap.docs, user));
};

function _resetUnreadCurrent() {
  if (!_activeThread || !fbAuth.currentUser) return;
  const field = isAdmin(fbAuth.currentUser) ? { unreadAdmin: 0 } : { unreadUser: 0 };
  setFirestoreDoc(firestoreDoc(db, 'ideas', _activeThread), field, { merge: true }).catch(() => {});
  const pill = document.getElementById('chat-new-msg-pill');
  if (pill) pill.style.display = 'none';
}

window._scrollToNewMsg = function() {
  const el = document.getElementById('ideas-messages');
  if (el) el.scrollTop = el.scrollHeight;
  _resetUnreadCurrent();
};

function _renderMessages(docs, user) {
  const prevCount = _chatMsgCount;
  _chatMsgCount = docs.length;
  if (prevCount > 0 && docs.length > prevCount) {
    const last = docs[docs.length - 1].data();
    if (last.senderUid !== fbAuth.currentUser.uid) _playSound('message');
  }
  const el = document.getElementById('ideas-messages');
  if (!docs.length) {
    el.innerHTML = '<div style="color:var(--text3);font-size:12px;text-align:center">Début de la conversation.</div>';
    return;
  }

  const wasAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  const firstUnreadIdx = _currentThreadUnreadCount > 0 ? Math.max(0, docs.length - _currentThreadUnreadCount) : -1;
  const isRead = isAdmin(user) ? (_currentThreadUnreadUser === 0) : (_currentThreadUnreadAdmin === 0);
  const isSA = isSuperAdmin(fbAuth.currentUser);
  let lastDateLabel = null;
  let html = '';

  // Groupe les messages consécutifs du même expéditeur (fenêtre 3 min)
  const groups = [];
  docs.forEach((doc, idx) => {
    const d = doc.data();
    if (d.type === 'system') { groups.push({ system: true, doc, idx }); return; }
    const mine = d.senderUid === fbAuth.currentUser.uid;
    const prev = idx > 0 ? docs[idx - 1].data() : null;
    const tCur  = d.createdAt ? d.createdAt.toMillis() : 0;
    const tPrev = prev && prev.createdAt ? prev.createdAt.toMillis() : 0;
    const sameGroup = prev && !prev.type && prev.senderUid === d.senderUid && (tCur - tPrev) < 180000;
    if (sameGroup && groups.length && !groups[groups.length - 1].system) {
      groups[groups.length - 1].msgs.push({ doc, idx });
    } else {
      groups.push({ system: false, mine, msgs: [{ doc, idx }] });
    }
  });

  groups.forEach(group => {
    // Séparateur date
    const firstDoc = group.system ? group.doc : group.msgs[0].doc;
    const firstD   = firstDoc.data();
    const firstAt  = firstD.createdAt ? firstD.createdAt.toDate() : null;
    if (firstAt) {
      const dl = _dateLabel(firstAt);
      if (dl !== lastDateLabel) {
        lastDateLabel = dl;
        html += '<div style="display:flex;align-items:center;gap:10px;padding:14px 4px 10px">'
          + '<div style="flex:1;height:1px;background:linear-gradient(to right,transparent,var(--border2))"></div>'
          + '<span style="font-size:10px;color:var(--text3);font-weight:700;letter-spacing:1px;text-transform:uppercase;white-space:nowrap">' + _escHtml(dl) + '</span>'
          + '<div style="flex:1;height:1px;background:linear-gradient(to left,transparent,var(--border2))"></div>'
          + '</div>';
      }
    }

    // Séparateur non-lus
    if (group.msgs && group.msgs[0].idx === firstUnreadIdx && firstUnreadIdx > 0) {
      html += '<div data-unread-sep style="display:flex;align-items:center;gap:8px;padding:6px 0 10px">'
        + '<div style="flex:1;height:1px;background:linear-gradient(to right,transparent,rgba(124,109,245,0.4))"></div>'
        + '<span style="font-size:10px;color:var(--accent);font-weight:700;letter-spacing:.5px;background:rgba(124,109,245,0.1);border:1px solid rgba(124,109,245,0.2);border-radius:20px;padding:2px 10px">Nouveaux messages</span>'
        + '<div style="flex:1;height:1px;background:linear-gradient(to left,transparent,rgba(124,109,245,0.4))"></div>'
        + '</div>';
    }

    // Message système
    if (group.system) {
      const d = group.doc.data();
      let sysIcon = '💬';
      let sysText = '';
      if (d.subtype === 'member_added' || d.subtype === 'member_removed') {
        sysIcon = d.subtype === 'member_added' ? '👤' : '👋';
        const verb = d.subtype === 'member_added' ? 'a rejoint' : 'a quitté';
        if (isSA) {
          sysText = '<strong style="color:var(--text2)">' + _escHtml(d.memberName || '') + '</strong>'
            + ' <span style="color:var(--text3);font-size:10px">(' + _escHtml(d.memberEmail || '') + ' · ' + _escHtml(d.memberRole || 'user') + ')</span>'
            + ' ' + verb + ' la conv · par <strong style="color:var(--text2)">' + _escHtml(d.addedByName || '') + '</strong>'
            + ' <span style="color:var(--text3);font-size:10px">(' + _escHtml(d.addedByEmail || '') + ')</span>';
        } else {
          sysText = '<strong style="color:var(--text2)">' + _escHtml(d.memberName || '') + '</strong> ' + verb + ' la conversation';
        }
      } else {
        sysText = _escHtml(d.text || '');
      }
      const sysAt = firstD.createdAt ? firstD.createdAt.toDate().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';
      html += '<div style="display:flex;justify-content:center;padding:3px 0 10px">'
        + '<div style="display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,0.03);border:1px solid var(--border2);border-radius:20px;padding:4px 14px 4px 10px;font-size:11px;color:var(--text3);max-width:90%">'
        + '<span style="font-size:13px">' + sysIcon + '</span>'
        + '<span>' + sysText + '</span>'
        + (sysAt ? '<span style="font-size:10px;color:var(--text3);opacity:.6;margin-left:2px">' + sysAt + '</span>' : '')
        + '</div></div>';
      return;
    }

    // Groupe de messages normaux
    const { mine } = group;
    const d0 = group.msgs[0].doc.data();
    const senderAvatarSrc = (d0.senderEmail && _avatarCache[d0.senderEmail]) || d0.senderAvatar || null;
    const isSuperAdminMsg = d0.senderRole === 'superadmin';
    const isAdminMsg = d0.senderRole === 'admin' || isSuperAdminMsg;

    const roleBadge = '';

    // Avatar + nom en colonne (bottom-aligned), anneau pour admin
    const avatarRing = isAdminMsg
      ? ';outline:2px solid ' + (isSuperAdminMsg ? 'rgba(124,109,245,0.7)' : 'rgba(91,141,238,0.6)') + ';outline-offset:2px'
      : '';
    const avatarImg = senderAvatarSrc
      ? '<img src="' + _escHtml(senderAvatarSrc) + '" style="width:36px;height:36px;border-radius:50%;object-fit:cover' + avatarRing + '" title="' + _escHtml(d0.senderName || '') + '">'
      : '<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--s4),var(--muted2));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:var(--text2)' + avatarRing + '">' + _escHtml((d0.senderName||'?')[0].toUpperCase()) + '</div>';
    const presenceDotHtml = d0.senderEmail
      ? '<span data-presence-email="' + _escAttr(d0.senderEmail) + '" title="' + (_isOnlineByEmail(d0.senderEmail) ? 'En ligne' : 'Hors ligne') + '" style="position:absolute;bottom:0;right:0;width:9px;height:9px;border-radius:50%;border:2px solid var(--s1);background:' + (_isOnlineByEmail(d0.senderEmail) ? 'var(--positive)' : 'var(--text3)') + ';opacity:' + (_isOnlineByEmail(d0.senderEmail) ? '1' : '0.4') + '"></span>'
      : '';
    const avatarEl = '<div style="display:flex;flex-direction:column;align-items:center;align-self:flex-end;flex-shrink:0;min-width:36px;gap:2px">'
      + '<div style="position:relative;flex-shrink:0">' + avatarImg + presenceDotHtml + '</div>'
      + '<span style="font-size:10px;font-weight:600;color:' + (isAdminMsg ? 'var(--accent)' : 'var(--text2)') + ';white-space:nowrap;text-align:center">' + _escHtml(d0.senderName || '') + '</span>'
      + roleBadge
      + '</div>';

    // Bulles
    let bubblesHtml = '';
    group.msgs.forEach(({ doc: mDoc, idx: mIdx }, mPos) => {
      const d = mDoc.data();
      const isLastMsg = mPos === group.msgs.length - 1;
      const isOnlyMsg = group.msgs.length === 1;
      const isLastOfAll = mIdx === docs.length - 1;
      const createdAt = d.createdAt ? d.createdAt.toDate() : null;
      const time = createdAt ? createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';

      // Border-radius adaptatif
      let radius;
      if (isOnlyMsg) {
        radius = mine ? '18px 4px 18px 18px' : '4px 18px 18px 18px';
      } else if (mPos === 0) {
        radius = mine ? '18px 4px 4px 18px' : '4px 18px 18px 4px';
      } else if (isLastMsg) {
        radius = mine ? '18px 4px 18px 18px' : '4px 18px 18px 18px';
      } else {
        radius = mine ? '18px 4px 4px 18px' : '4px 18px 18px 4px';
      }

      const bubbleBg = mine
        ? 'background:linear-gradient(135deg,#7c6df5,#5b8dee);'
        : 'background:var(--s3);border:1px solid var(--border2);';
      const bubbleColor = mine ? 'color:#fff;' : 'color:var(--text);';
      const bubbleShadow = mine
        ? 'box-shadow:0 2px 12px rgba(124,109,245,0.22),0 1px 3px rgba(0,0,0,0.15);'
        : 'box-shadow:0 1px 4px rgba(0,0,0,0.1);';

      const replyHtml = d.replyTo
        ? '<div style="margin:8px 12px 0;' + (mine ? 'background:rgba(255,255,255,0.12);border-left:3px solid rgba(255,255,255,0.45);' : 'background:rgba(124,109,245,0.08);border-left:3px solid var(--accent);') + 'border-radius:4px;padding:5px 9px;font-size:11px">'
          + '<div style="font-weight:700;' + (mine ? 'color:rgba(255,255,255,0.85)' : 'color:var(--accent)') + ';margin-bottom:2px">' + _escHtml(d.replyTo.senderName || '') + '</div>'
          + '<div style="' + (mine ? 'color:rgba(255,255,255,0.65)' : 'color:var(--text2)') + '">' + _escHtml((d.replyTo.text || '📷 Photo').slice(0, 80)) + ((d.replyTo.text||'').length > 80 ? '…' : '') + '</div>'
          + '</div>'
        : '';

      const readHtml = (mine && isLastOfAll)
        ? '<span id="chat-last-read" style="font-size:10px;font-weight:600;color:' + (isRead ? 'var(--accent)' : 'var(--text3)') + '">' + (isRead ? '✓✓' : '✓') + '</span>'
        : '';

      // Bulle avec reply-btn en position absolute pour ne pas perturber le layout
      bubblesHtml += '<div class="chat-msg-wrap" id="msg-' + mDoc.id + '" style="position:relative;display:flex;flex-direction:column;align-items:' + (mine ? 'flex-end' : 'flex-start') + ';margin-bottom:2px;width:100%">'
        + '<div class="chat-bubble" style="max-width:75%;border-radius:' + radius + ';overflow:hidden;' + bubbleBg + bubbleShadow + 'transition:filter .12s">'
        + replyHtml
        + (d.image ? '<img src="' + d.image + '" onclick="openLightbox(this.src)" style="max-width:100%;display:block;cursor:zoom-in">' : '')
        + (d.text ? '<div style="padding:9px 14px;' + bubbleColor + 'font-size:13px;line-height:1.55;white-space:pre-wrap;word-break:break-word' + (replyHtml ? ';margin-top:6px' : '') + '">' + _escHtml(d.text) + '</div>' : '')
        + '</div>'
        + '<button class="reply-btn" onclick="setReply(\'' + mDoc.id + '\',\'' + _escAttr(d.senderName||'') + '\',\'' + _escAttr((d.text||'').slice(0,80)) + '\')" style="display:none;position:absolute;' + (mine ? 'left:-36px' : 'right:-36px') + ';top:50%;transform:translateY(-50%);background:var(--s3);border:1px solid var(--border2);color:var(--text3);cursor:pointer;font-size:12px;padding:3px 7px;border-radius:8px;white-space:nowrap" title="Répondre">↩</button>'
        + (isLastMsg ? '<div style="display:flex;align-items:center;gap:4px;margin-top:3px;' + (mine ? 'justify-content:flex-end' : '') + '">'
          + '<span style="font-size:10px;color:var(--text3)">' + time + '</span>'
          + readHtml
          + '</div>' : '')
        + '</div>';
    });

    html += '<div style="display:flex;align-items:flex-end;gap:10px;margin-bottom:14px' + (mine ? ';flex-direction:row-reverse' : '') + ';padding:0 6px">'
      + avatarEl
      + '<div style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:' + (mine ? 'flex-end' : 'flex-start') + '">'
      + (!mine && isSA && d0.senderEmail ? '<div style="font-size:10px;color:var(--text3);margin-bottom:3px">' + _escHtml(d0.senderEmail) + '</div>' : '')
      + bubblesHtml
      + '</div>'
      + '</div>';
  });

  el.innerHTML = html;

  // Hover: reply button (display toggle) + bulle brightness
  el.querySelectorAll('.chat-msg-wrap').forEach(wrap => {
    const btn = wrap.querySelector('.reply-btn');
    const bbl = wrap.querySelector('.chat-bubble');
    if (btn) {
      wrap.addEventListener('mouseenter', () => btn.style.display = 'block');
      wrap.addEventListener('mouseleave', () => btn.style.display = 'none');
    }
    if (bbl) {
      bbl.addEventListener('mouseenter', () => bbl.style.filter = 'brightness(1.08)');
      bbl.addEventListener('mouseleave', () => bbl.style.filter = '');
    }
  });

  // Scroll behavior
  if (firstUnreadIdx > 0 && prevCount === 0) {
    const sep = el.querySelector('[data-unread-sep]');
    if (sep) setTimeout(() => sep.scrollIntoView({ block: 'start', behavior: 'smooth' }), 50);
    else el.scrollTop = el.scrollHeight;
  } else if (wasAtBottom || prevCount === 0) {
    el.scrollTop = el.scrollHeight;
  }

  // Auto-read / pill logic for incoming messages while thread is open
  const isNewFromOther = prevCount > 0 && docs.length > prevCount
    && docs[docs.length - 1].data().senderUid !== fbAuth.currentUser.uid;

  if (isNewFromOther) {
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (atBottom) {
      _resetUnreadCurrent();
    } else {
      const pill = document.getElementById('chat-new-msg-pill');
      if (pill) pill.style.display = 'block';
    }
  }
}

// ── Lightbox ────────────────────────────────────────────────
window.openLightbox = function(src) {
  document.getElementById('chat-lightbox-img').src = src;
  const lb = document.getElementById('chat-lightbox');
  lb.style.display = 'flex';
};
window.closeLightbox = function() {
  document.getElementById('chat-lightbox').style.display = 'none';
  document.getElementById('chat-lightbox-img').src = '';
};
window.downloadLightboxImg = function() {
  const src = document.getElementById('chat-lightbox-img').src;
  const a = document.createElement('a');
  a.href = src;
  a.download = 'photo-chat.jpg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const lb = document.getElementById('chat-lightbox');
    if (lb && lb.style.display !== 'none') closeLightbox();
  }
});

// ── Emoji picker ───────────────────────────────────────────
const EMOJIS = ['😊','😂','👍','❤️','🔥','✅','💡','🚀','🎉','👀','🤔','😅','💪','🙏','⚡','💬','📊','📈','💰','🐂','🐻','💎','🛠️','🐛','❌','⚠️','📌','🔄','👏','😎'];

window.toggleEmojiPicker = function() {
  const el = document.getElementById('emoji-picker');
  if (!el) return;
  if (el.style.display === 'flex') { el.style.display = 'none'; return; }
  el.innerHTML = EMOJIS.map(e =>
    '<button onclick="insertEmoji(\'' + e + '\')" style="background:none;border:none;font-size:20px;cursor:pointer;padding:4px;border-radius:6px;line-height:1">' + e + '</button>'
  ).join('');
  el.style.display = 'flex';
};

window.insertEmoji = function(emoji) {
  const input = document.getElementById('ideas-msg-input');
  if (!input) return;
  const pos = input.selectionStart;
  input.value = input.value.slice(0, pos) + emoji + input.value.slice(pos);
  input.focus();
  input.selectionStart = input.selectionEnd = pos + emoji.length;
};

// ── Image upload dans le chat ───────────────────────────────
let _pendingChatImage = null;

window.chatImageSelected = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const MAX = 800;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width  = img.width  * ratio;
      canvas.height = img.height * ratio;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      _pendingChatImage = canvas.toDataURL('image/jpeg', 0.75);
      const thumb = document.getElementById('chat-img-thumb');
      const preview = document.getElementById('chat-img-preview');
      if (thumb) thumb.src = _pendingChatImage;
      if (preview) preview.style.display = 'block';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  event.target.value = '';
};

window.clearChatImage = function() {
  _pendingChatImage = null;
  const preview = document.getElementById('chat-img-preview');
  if (preview) preview.style.display = 'none';
};

// ── Envoi message ───────────────────────────────────────────
window.ideasMsgKeydown = function(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
};

window.sendChatMessage = async function() {
  if (!_activeThread) return;
  const user = fbAuth.currentUser;
  const input = document.getElementById('ideas-msg-input');
  const text = input.value.trim();
  if (!text && !_pendingChatImage) return;
  input.value = '';
  document.getElementById('emoji-picker').style.display = 'none';
  const msgData = {
    text:       text || '',
    image:      _pendingChatImage || null,
    senderUid:    user.uid,
    senderName:   user.displayName || user.email.split('@')[0],
    senderEmail:  user.email || '',
    senderRole:   currentUserRole,
    senderAvatar: getUserSettings(user.uid).avatarBase64 || user.photoURL || null,
    createdAt:  serverTimestamp(),
    replyTo:    _replyTo || null,
  };
  clearChatImage();
  clearReply();
  _clearTyping();
  const msgCol = firestoreCollection(db, 'ideas', _activeThread, 'messages');
  await addFirestoreDoc(msgCol, msgData);
  const unreadDoc = await getFirestoreDoc(firestoreDoc(db, 'ideas', _activeThread));
  const cur = unreadDoc.exists() ? unreadDoc.data() : {};
  const unreadField = isAdmin(user)
    ? { unreadUser:  (cur.unreadUser  || 0) + 1 }
    : { unreadAdmin: (cur.unreadAdmin || 0) + 1 };
  await setFirestoreDoc(firestoreDoc(db, 'ideas', _activeThread), {
    lastMessage:    text ? text.slice(0, 60) : '📷 Photo',
    lastSenderName: user.displayName || user.email.split('@')[0],
    updatedAt:      serverTimestamp(),
    ...unreadField,
  }, { merge: true });
};

// ── Nouveau thread — modal CSS ──────────────────────────────
window.newIdeasThread = function() {
  const overlay = document.getElementById('new-thread-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    setTimeout(() => { document.getElementById('new-thread-title').focus(); }, 100);
  }
};

window.closeNewThread = function() {
  const overlay = document.getElementById('new-thread-overlay');
  if (overlay) overlay.style.display = 'none';
  const input = document.getElementById('new-thread-title');
  if (input) input.value = '';
};

window.confirmNewThread = function() {
  const titleEl = document.getElementById('new-thread-title');
  const title = titleEl ? titleEl.value.trim() : '';
  if (!title) return;
  closeNewThread();
  _playSound('created');
  const user = fbAuth.currentUser;
  addFirestoreDoc(firestoreCollection(db, 'ideas'), {
    uid:         user.uid,
    userEmail:   user.email,
    userName:    user.displayName || user.email.split('@')[0],
    title,
    lastMessage: '',
    createdAt:   serverTimestamp(),
    updatedAt:   serverTimestamp(),
    status:      'open',
    unreadAdmin: 0,
    unreadUser:  0,
  }).then(ref => openThread(ref.id));
};

// ── Modal confirmation générique ────────────────────────────
let _confirmModalCallback = null;

function showConfirm({ icon, title, message, label, color, callback }) {
  document.getElementById('confirm-modal-icon').textContent  = icon;
  document.getElementById('confirm-modal-title').textContent = title;
  document.getElementById('confirm-modal-msg').textContent   = message;
  const btn = document.getElementById('confirm-modal-btn');
  btn.textContent       = label;
  btn.style.background  = color;
  _confirmModalCallback = callback;
  document.getElementById('confirm-modal').style.display = 'flex';
}

window._confirmModalOk = function() {
  document.getElementById('confirm-modal').style.display = 'none';
  if (_confirmModalCallback) _confirmModalCallback();
  _confirmModalCallback = null;
};

window._confirmModalCancel = function() {
  document.getElementById('confirm-modal').style.display = 'none';
  _confirmModalCallback = null;
};

// ── Recherche + rouvrir ─────────────────────────────────────
window._filterThreads = function(val) {
  _searchQuery = val.toLowerCase().trim();
  if (_lastThreadDocs && _lastThreadUser) _renderThreads(_lastThreadDocs, _lastThreadUser);
};

window.reopenThread = async function(threadId) {
  await setFirestoreDoc(firestoreDoc(db, 'ideas', threadId), { status: 'open', expiresAt: null }, { merge: true });
  openThread(threadId);
};

// ── Typing indicator ────────────────────────────────────────
window._onChatTyping = function() {
  if (!_activeThread || !fbAuth.currentUser) return;
  if (_typingTimer) clearTimeout(_typingTimer);
  if (!_typingActive) {
    _typingActive = true;
    setFirestoreDoc(firestoreDoc(db, 'ideas', _activeThread), {
      ['typing_' + fbAuth.currentUser.uid]: serverTimestamp(),
    }, { merge: true }).catch(() => {});
  }
  _typingTimer = setTimeout(() => { _typingActive = false; _clearTyping(); }, 3000);
};

function _clearTyping() {
  if (!fbAuth.currentUser) return;
  const tid = _activeThread;
  if (tid) {
    setFirestoreDoc(firestoreDoc(db, 'ideas', tid), {
      ['typing_' + fbAuth.currentUser.uid]: null,
    }, { merge: true }).catch(() => {});
  }
  if (_typingTimer) { clearTimeout(_typingTimer); _typingTimer = null; }
  _typingActive = false;
}

// ── Reply/quote ─────────────────────────────────────────────
window.setReply = function(messageId, senderName, text) {
  _replyTo = { messageId, senderName, text };
  const zone = document.getElementById('chat-reply-preview');
  if (zone) {
    zone.style.display = 'block';
    document.getElementById('chat-reply-name').textContent = senderName;
    document.getElementById('chat-reply-text').textContent = text || '📷 Photo';
  }
  const input = document.getElementById('ideas-msg-input');
  if (input) input.focus();
};

window.clearReply = function() {
  _replyTo = null;
  const zone = document.getElementById('chat-reply-preview');
  if (zone) zone.style.display = 'none';
};

// ── Terminer / supprimer thread ────────────────────────────
window.closeThread = function(threadId) {
  showConfirm({
    icon:     '💬',
    title:    'Terminer la conversation',
    message:  'Cette conversation sera clôturée et supprimée automatiquement après 48h.',
    label:    'Terminer la conversation',
    color:    'var(--accent)',
    callback: async () => {
      await setFirestoreDoc(firestoreDoc(db, 'ideas', threadId), {
        status: 'closed',
        expiresAt: new Date(Date.now() + 48 * 3600 * 1000),
      }, { merge: true });
      _playSound('closed');
      _activeThread = null;
      localStorage.removeItem('chat_active_thread');
      document.getElementById('ideas-chat-view').style.display = 'none';
      document.getElementById('ideas-chat-empty').style.display = 'flex';
    },
  });
};

window.deleteThread = function(threadId) {
  if (!isSuperAdmin(fbAuth.currentUser)) return;
  showConfirm({
    icon:     '🗑',
    title:    'Supprimer la conversation',
    message:  'Cette action est irréversible. La conversation et tous ses messages seront définitivement supprimés.',
    label:    'Supprimer',
    color:    'var(--negative)',
    callback: async () => {
      await deleteFirestoreDoc(firestoreDoc(db, 'ideas', threadId));
      _activeThread = null;
      localStorage.removeItem('chat_active_thread');
      document.getElementById('ideas-chat-view').style.display = 'none';
      document.getElementById('ideas-chat-empty').style.display = 'flex';
      _showChatToast({ icon: '🗑', title: 'Conversation supprimée', msg: 'La conversation a été supprimée.', threadId: null, duration: 3000 });
    },
  });
};

window.exportThread = async function(threadId) {
  if (!isSuperAdmin(fbAuth.currentUser)) return;
  try {
    const threadSnap = await getFirestoreDoc(firestoreDoc(db, 'ideas', threadId));
    const t = threadSnap.data();
    const msgSnap = await getDocs(firestoreQuery(
      firestoreCollection(db, 'ideas', threadId, 'messages'),
      firestoreOrderBy('createdAt', 'asc')
    ));

    const fmt = ts => ts && ts.toDate ? ts.toDate().toLocaleString('fr-FR') : '?';
    const sep = '─'.repeat(60);

    let txt = 'CONVERSATION EXPORTÉE — CapitalView\n'
      + sep + '\n'
      + 'Sujet    : ' + (t.title || '—') + '\n'
      + 'Utilisateur : ' + (t.userName || '') + ' <' + (t.userEmail || '') + '>\n'
      + 'Statut   : ' + (t.status || '?') + '\n'
      + 'Exporté  : ' + new Date().toLocaleString('fr-FR') + '\n'
      + sep + '\n\n';

    msgSnap.docs.forEach(doc => {
      const m = doc.data();
      if (m.type === 'system') {
        txt += '[' + fmt(m.createdAt) + '] 🔔 ' + (m.text || '') + '\n\n';
        return;
      }
      const who = (m.senderName || m.senderEmail || '?') + ' (' + (m.senderRole || 'user') + ')';
      txt += '[' + fmt(m.createdAt) + '] ' + who + '\n';
      if (m.text) txt += m.text + '\n';
      if (m.image) txt += '[image]\n';
      txt += '\n';
    });

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const slug = (t.title || threadId).replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 40);
    a.href     = url;
    a.download = 'conv-' + slug + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch(e) {
    alert('Erreur export : ' + e.message);
  }
};

// Nettoyage auto 48h côté client au chargement des threads
function _cleanExpiredThreads(docs) {
  const now = new Date();
  docs.forEach(doc => {
    const d = doc.data();
    if (d.expiresAt && d.expiresAt.toDate && d.expiresAt.toDate() < now) {
      deleteFirestoreDoc(firestoreDoc(db, 'ideas', doc.id)).catch(() => {});
    }
  });
}

// ── Gestion des rôles (superadmin) ─────────────────────────

window.grantAdmin  = async function() { await _setRoleByEmail('admin'); };
window.revokeAdmin = async function() { await _setRoleByEmail('user'); };

// ── Super Admin panel ───────────────────────────────────────

async function _saLoadAll() {
  document.getElementById('sa-subtitle').textContent = 'Chargement…';
  try {
    const [rolesSnap, presenceSnap] = await Promise.all([
      getDocs(firestoreCollection(db, 'roles')),
      getDocs(firestoreCollection(db, 'presence')),
    ]);

    const presence = {};
    presenceSnap.forEach(d => { presence[d.id] = d.data(); });

    const users = [];
    const portfolioFetches = rolesSnap.docs.map(async d => {
      const role = d.data();
      const uid  = d.id;
      const [portSnap, alertsSnap] = await Promise.all([
        getFirestoreDoc(firestoreDoc(db, 'users', uid, 'data', 'portfolio')).catch(() => null),
        getFirestoreDoc(firestoreDoc(db, 'users', uid, 'data', 'alerts')).catch(() => null),
      ]);
      const positions = portSnap?.exists() ? (portSnap.data().items || []).length : 0;
      const alerts    = alertsSnap?.exists() ? (alertsSnap.data().items || []).filter(a => a.active && !a.triggeredAt).length : 0;
      users.push({ uid, email: role.email || '', role: role.role || 'user', positions, alerts, presence: presence[uid] || null });
    });
    await Promise.all(portfolioFetches);

    const online = users.filter(u => u.presence?.online).length;
    const active7 = users.filter(u => {
      if (!u.presence?.lastSeen) return false;
      const d = u.presence.lastSeen.toDate ? u.presence.lastSeen.toDate() : new Date(u.presence.lastSeen);
      return (Date.now() - d.getTime()) < 7 * 24 * 3600 * 1000;
    }).length;
    const totalAlerts = users.reduce((s, u) => s + u.alerts, 0);
    const totalPos    = users.reduce((s, u) => s + u.positions, 0);

    document.getElementById('sa-subtitle').textContent = `${users.length} utilisateurs · ${online} en ligne`;
    document.getElementById('sa-online-count').textContent = `· ${online} en ligne`;

    // Stats cards
    const statsEl = document.getElementById('sa-stats');
    const stats = [
      { label: 'Utilisateurs', value: users.length, icon: '👥' },
      { label: 'Actifs 7j',    value: active7,       icon: IC.calendar },
      { label: 'En ligne',     value: online,         icon: IC.dotGreen },
      { label: 'Alertes actives', value: totalAlerts, icon: IC.target },
      { label: 'Positions totales', value: totalPos,  icon: IC.briefcase },
    ];
    statsEl.innerHTML = stats.map(s =>
      `<div style="background:var(--s2);border:1px solid var(--border);border-radius:10px;padding:12px 14px">
        <div style="font-size:18px;margin-bottom:4px">${s.icon}</div>
        <div style="font-size:22px;font-weight:700;color:var(--text);font-family:var(--mono)">${s.value}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">${s.label}</div>
      </div>`
    ).join('');

    // Users table
    users.sort((a, b) => (b.presence?.online ? 1 : 0) - (a.presence?.online ? 1 : 0));
    document.getElementById('sa-users-tbody').innerHTML = users.map(u => {
      const isOnline = u.presence?.online;
      const lastSeen = u.presence?.lastSeen ? (() => {
        const d = u.presence.lastSeen.toDate ? u.presence.lastSeen.toDate() : new Date(u.presence.lastSeen);
        return d.toLocaleDateString('fr-FR', { day:'2-digit', month:'short' }) + ' ' + d.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
      })() : '—';
      const roleColor = u.role === 'superadmin' ? '#fbbf24' : u.role === 'admin' ? 'var(--accent)' : 'var(--text3)';
      return `<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px 10px"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${isOnline ? 'var(--positive)' : 'var(--border2)'}" title="${isOnline ? 'En ligne' : 'Hors ligne'}"></span></td>
        <td style="padding:8px 10px;font-size:12px;color:var(--text)">${u.email}</td>
        <td style="padding:8px 10px;font-size:11px;color:${roleColor};font-weight:600">${u.role}</td>
        <td style="padding:8px 10px;font-size:12px;color:var(--text2);font-family:var(--mono);text-align:center">${u.positions}</td>
        <td style="padding:8px 10px;font-size:12px;color:${u.alerts > 0 ? 'var(--accent)' : 'var(--text3)'};font-family:var(--mono);text-align:center">${u.alerts}</td>
        <td style="padding:8px 10px;font-size:11px;color:var(--text3)">${lastSeen}</td>
        <td style="padding:8px 10px">
          <button onclick="saDeleteUser('${u.uid}','${u.email}')" style="background:none;border:1px solid rgba(255,77,106,0.3);color:var(--negative);border-radius:6px;padding:3px 8px;font-size:10px;cursor:pointer" title="Supprimer données">🗑</button>
        </td>
      </tr>`;
    }).join('');

    // Charger token GitHub depuis Firestore
    try {
      const tokSnap = await getFirestoreDoc(firestoreDoc(db, 'config', 'githubToken'));
      if (tokSnap.exists() && tokSnap.data().token) {
        document.getElementById('sa-github-token').value = tokSnap.data().token;
      }
    } catch(e) {}

    // Recap buttons
    document.getElementById('sa-recap-btns').innerHTML = users.map(u =>
      `<button onclick="saOpenConfirmRecap('${u.email}')" style="text-align:left;background:var(--s2);border:1px solid var(--border);color:var(--text2);border-radius:6px;padding:5px 10px;font-size:11px;cursor:pointer">▶ ${u.email}</button>`
    ).join('');

  } catch(e) {
    document.getElementById('sa-subtitle').textContent = 'Erreur : ' + e.message;
  }
}

async function saBroadcast() {
  const msg = document.getElementById('sa-broadcast-msg').value.trim();
  const st  = document.getElementById('sa-broadcast-status');
  if (!msg) return;
  try {
    await setFirestoreDoc(firestoreDoc(db, 'config', 'broadcast'), { message: msg, active: true, createdAt: serverTimestamp() });
    st.style.color = 'var(--positive)';
    st.textContent = '✓ Bandeau envoyé';
    document.getElementById('sa-broadcast-msg').value = '';
    setTimeout(() => { st.textContent = ''; }, 3000);
  } catch(e) { st.style.color = 'var(--negative)'; st.textContent = 'Erreur : ' + e.message; }
}

async function saClearBroadcast() {
  const st = document.getElementById('sa-broadcast-status');
  try {
    await setFirestoreDoc(firestoreDoc(db, 'config', 'broadcast'), { active: false, message: '' });
    st.style.color = 'var(--text3)';
    st.textContent = 'Bandeau effacé';
    setTimeout(() => { st.textContent = ''; }, 2000);
  } catch(e) { st.style.color = 'var(--negative)'; st.textContent = 'Erreur : ' + e.message; }
}

async function saSaveGithubToken() {
  const token = document.getElementById('sa-github-token').value.trim();
  const st    = document.getElementById('sa-recap-status');
  if (!token) return;
  try {
    await setFirestoreDoc(firestoreDoc(db, 'config', 'githubToken'), { token });
    st.style.color = 'var(--positive)'; st.textContent = '✓ Token sauvegardé';
    setTimeout(() => { st.textContent = ''; }, 2000);
  } catch(e) { st.style.color = 'var(--negative)'; st.textContent = 'Erreur : ' + e.message; }
}

let _saAllUsers = [];

function saFilterUsers(query) {
  const q = query.toLowerCase();
  const rows = document.querySelectorAll('#sa-users-tbody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = (!q || text.includes(q)) ? '' : 'none';
  });
}

let _saConfirmEmail = null;
function saOpenConfirmRecap(email) {
  _saConfirmEmail = email;
  document.getElementById('confirm-recap-email').textContent = email;
  document.getElementById('confirm-recap-overlay').style.display = 'flex';
}
function closeConfirmRecap() {
  document.getElementById('confirm-recap-overlay').style.display = 'none';
  _saConfirmEmail = null;
}
async function confirmRecapSend() {
  const email = _saConfirmEmail;
  closeConfirmRecap();
  if (email) await saForceRecap(email);
}

async function saForceRecap(email) {
  const st = document.getElementById('sa-recap-status');
  let token = document.getElementById('sa-github-token').value.trim();
  if (!token) {
    try {
      const snap = await getFirestoreDoc(firestoreDoc(db, 'config', 'githubToken'));
      token = snap.exists() ? snap.data().token : '';
    } catch(e) {}
  }
  if (!token) { st.style.color = 'var(--negative)'; st.textContent = 'Aucun GitHub PAT configuré'; return; }
  st.style.color = 'var(--text3)'; st.textContent = `Envoi recap pour ${email}…`;
  try {
    const res = await fetch('https://api.github.com/repos/armelpltr/Dashboard-PEA/actions/workflows/daily-recap.yml/dispatches', {
      method: 'POST',
      headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref: 'main', inputs: { target_email: email } }),
    });
    if (res.ok || res.status === 204) {
      st.style.color = 'var(--positive)'; st.textContent = `✓ Recap déclenché (tous les users recevront le mail)`;
    } else {
      const err = await res.text();
      st.style.color = 'var(--negative)'; st.textContent = `Erreur GitHub ${res.status}: ${err}`;
    }
  } catch(e) { st.style.color = 'var(--negative)'; st.textContent = 'Erreur : ' + e.message; }
}

async function saDeleteUser(uid, email) {
  if (!confirm(`Supprimer toutes les données de ${email} ?\n\nLe compte Auth reste actif mais le portfolio, transactions et paramètres seront effacés.`)) return;
  try {
    const cols = ['portfolio', 'transactions', 'versements', 'watchlist', 'dailyValues', 'alerts', 'notifHistory', 'settings'];
    await Promise.all(cols.map(c => deleteFirestoreDoc(firestoreDoc(db, 'users', uid, 'data', c)).catch(() => {})));
    await deleteFirestoreDoc(firestoreDoc(db, 'roles', uid)).catch(() => {});
    alert(`✓ Données de ${email} supprimées.`);
    await _saLoadAll();
  } catch(e) { alert('Erreur : ' + e.message); }
}

function _listenBroadcast() {
  onSnapshot(firestoreDoc(db, 'config', 'broadcast'), snap => {
    const banner = document.getElementById('broadcast-banner');
    if (!banner) return;
    const data = snap.exists() ? snap.data() : null;
    if (data?.active && data.message) {
      document.getElementById('broadcast-text').textContent = data.message;
      banner.style.display = 'flex';
      document.body.style.paddingTop = '44px';
    } else {
      banner.style.display = 'none';
      document.body.style.paddingTop = '';
    }
  });
}

function dismissBroadcast() {
  const banner = document.getElementById('broadcast-banner');
  if (banner) banner.style.display = 'none';
  document.body.style.paddingTop = '';
}

async function _setRoleByEmail(role) {
  const email = document.getElementById('input-admin-email').value.trim().toLowerCase();
  const st    = document.getElementById('admin-role-status');
  if (!email) return;
  try {
    const snap = await getDocs(firestoreQuery(firestoreCollection(db, 'users'), firestoreWhere('email', '==', email)));
    if (snap.empty) { st.style.color = 'var(--negative)'; st.textContent = 'Utilisateur introuvable.'; return; }
    const uid = snap.docs[0].id;
    await setFirestoreDoc(firestoreDoc(db, 'roles', uid), { role, email }, { merge: true });
    st.style.color   = 'var(--positive)';
    st.textContent   = role === 'admin' ? ('✓ ' + email + ' est admin') : ('✓ Droits retirés pour ' + email);
    document.getElementById('input-admin-email').value = '';
    setTimeout(() => { st.textContent = ''; }, 3000);
  } catch(e) {
    st.style.color = 'var(--negative)';
    st.textContent = 'Erreur : ' + e.message;
  }
}

// ── Ajouter un membre à une conversation (superadmin) ──────
let _addMemberThreadId = null;

window.addMemberToThread = function(threadId) {
  _addMemberThreadId = threadId;
  const overlay = document.getElementById('add-member-overlay');
  document.getElementById('add-member-email').value = '';
  document.getElementById('add-member-status').textContent = '';
  overlay.style.display = 'flex';
  setTimeout(() => document.getElementById('add-member-email').focus(), 80);
};

window.closeAddMember = function() {
  document.getElementById('add-member-overlay').style.display = 'none';
  _addMemberThreadId = null;
};

window.confirmAddMember = async function() {
  const email = document.getElementById('add-member-email').value.trim().toLowerCase();
  const st  = document.getElementById('add-member-status');
  const btn = document.getElementById('add-member-btn');
  if (!email) { st.style.color = 'var(--negative)'; st.textContent = 'Saisissez un email.'; return; }
  btn.disabled = true;
  btn.textContent = '…';
  st.textContent = '';
  try {
    // Lookup role
    let memberRole = 'user';
    try {
      const roleSnap = await getDocs(firestoreQuery(firestoreCollection(db, 'roles'), firestoreWhere('email', '==', email)));
      if (!roleSnap.empty) memberRole = roleSnap.docs[0].data().role || 'user';
    } catch(e) { /* règle non configurée, role reste 'user' */ }

    const threadRef = firestoreDoc(db, 'ideas', _addMemberThreadId);
    const roleUpdate = {};
    roleUpdate['memberRoles.' + email] = memberRole;
    await setFirestoreDoc(threadRef, { memberEmails: firestoreArrayUnion(email), ...roleUpdate }, { merge: true });

    // Message système
    const user = fbAuth.currentUser;
    const msgCol = firestoreCollection(db, 'ideas', _addMemberThreadId, 'messages');
    await addFirestoreDoc(msgCol, {
      type:          'system',
      subtype:       'member_added',
      memberEmail:   email,
      memberName:    email.split('@')[0],
      memberRole:    memberRole,
      addedByEmail:  user.email || '',
      addedByName:   user.displayName || user.email.split('@')[0],
      addedByRole:   currentUserRole,
      createdAt:     serverTimestamp(),
    });

    closeAddMember();
    openThread(_addMemberThreadId);
    _showChatToast({ icon: '👤', title: 'Membre ajouté', msg: email, duration: 3000 });
  } catch(e) {
    st.style.color = 'var(--negative)';
    st.textContent = 'Erreur : ' + e.message;
    btn.disabled = false; btn.textContent = 'Ajouter';
  }
};

// ── Retirer un membre (superadmin) ─────────────────────────
let _removeMemberThreadId = null;
let _removeMemberEmail    = null;

window.removeMemberFromThread = function(threadId, email) {
  _removeMemberThreadId = threadId;
  _removeMemberEmail    = email;
  document.getElementById('remove-member-subtitle').textContent = email;
  document.getElementById('remove-member-overlay').style.display = 'flex';
};

window.closeRemoveMember = function() {
  document.getElementById('remove-member-overlay').style.display = 'none';
  _removeMemberThreadId = null;
  _removeMemberEmail    = null;
};

window.confirmRemoveMember = async function() {
  const threadId = _removeMemberThreadId;
  const email    = _removeMemberEmail;
  if (!threadId || !email) return;
  document.getElementById('remove-member-btn').disabled = true;
  closeRemoveMember();
  try {
    const threadRef = firestoreDoc(db, 'ideas', threadId);
    const update = { memberEmails: firestoreArrayRemove(email) };
    update['memberRoles.' + email] = firestoreDeleteField();
    await setFirestoreDoc(threadRef, update, { merge: true });

    const user = fbAuth.currentUser;
    const msgCol = firestoreCollection(db, 'ideas', threadId, 'messages');
    await addFirestoreDoc(msgCol, {
      type:         'system',
      subtype:      'member_removed',
      memberEmail:  email,
      memberName:   email.split('@')[0],
      addedByEmail: user.email || '',
      addedByName:  user.displayName || user.email.split('@')[0],
      addedByRole:  currentUserRole,
      createdAt:    serverTimestamp(),
    });
    openThread(threadId);
  } catch(e) {
    document.getElementById('remove-member-btn').disabled = false;
    alert('Erreur : ' + e.message);
  }
};

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS — FCM, alertes prix, historique
// ═══════════════════════════════════════════════════════════════

async function initPush(uid) {
  if (!fcmMessaging || !('serviceWorker' in navigator) || VAPID_KEY === 'YOUR_VAPID_KEY_HERE') return;
  try {
    const swReg = await navigator.serviceWorker.register('firebase-messaging-sw.js');
    const token = await getFCMToken(fcmMessaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: swReg });
    if (token) setFirestoreDoc(firestoreDoc(db, 'roles', uid), { fcmToken: token }, { merge: true }).catch(() => {});
    onFCMMessage(fcmMessaging, payload => {
      const { title, body } = payload.notification || {};
      _logNotifHistory(payload.data?.type || 'push', title || 'CapitalView', body || '');
      _showChatToast({ icon: '🔔', title: title || 'CapitalView', msg: body || '' });
      renderNotificationsPage();
    });
  } catch(e) { console.warn('FCM init:', e.message); }
}

async function requestPushPermission() {
  const perm = await Notification.requestPermission();
  if (perm === 'granted') await initPush(currentUser);
  updatePushBtn();
}

function _logNotifHistory(type, title, body) {
  if (!currentUser) return;
  const history = getNotifHistory(currentUser);
  history.unshift({ id: Date.now(), type, title, body, timestamp: new Date().toISOString(), read: false });
  if (history.length > 50) history.splice(50);
  saveNotifHistory(currentUser, history);
  _updateNotifBadge();
}

function _updateNotifBadge() {
  const unread = currentUser ? getNotifHistory(currentUser).filter(n => !n.read).length : 0;
  ['notif-nav-badge', 'notif-drawer-badge'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = unread > 0 ? 'inline' : 'none';
    el.textContent = unread > 9 ? '9+' : String(unread);
  });
}

function checkPriceAlerts() {
  if (!currentUser) return;
  const settings = getUserSettings(currentUser);
  if (settings.notifSettings?.priceAlerts === false) return;
  const alerts = getAlerts(currentUser);
  if (!alerts.length) return;
  const allItems = [
    ...getPortfolio(currentUser).map(p => ({ ticker: p.ticker, price: p.currentPrice })),
    ...getWatchlist(currentUser).map(w => ({ ticker: w.ticker, price: w.price }))
  ];
  let changed = false;
  alerts.forEach(alert => {
    if (!alert.active || alert.triggeredAt) return;
    const item = allItems.find(i => i.ticker === alert.ticker);
    if (!item || !item.price) return;
    const hit = alert.direction === 'above' ? item.price >= alert.targetPrice : item.price <= alert.targetPrice;
    if (hit) {
      alert.triggeredAt = new Date().toISOString();
      alert.active = false;
      const dir = alert.direction === 'above' ? '>=' : '<=';
      const body = alert.name + ' (' + alert.ticker + ') ' + dir + ' ' + alert.targetPrice + 'EUR — cours : ' + item.price.toFixed(2) + 'EUR';
      _logNotifHistory('price_alert', 'Alerte prix declenchee', body);
      _showBrowserNotif('Alerte prix', body);
      changed = true;
    }
  });
  if (changed) {
    saveAlerts(currentUser, alerts);
    if (document.getElementById('page-notifications')?.classList.contains('active')) renderNotificationsPage();
  }
}

function renderNotificationsPage() {
  renderAlertsList();
  renderNotifSettings();
  renderNotifHistory();
  updatePushBtn();
}

function updatePushBtn() {
  const btn = document.getElementById('btn-enable-push');
  if (!btn) return;
  const perm = 'Notification' in window ? Notification.permission : 'denied';
  if (VAPID_KEY === 'YOUR_VAPID_KEY_HERE') {
    btn.textContent = 'Cle VAPID non configuree';
    btn.disabled = true;
  } else if (perm === 'granted') {
    btn.textContent = 'Push actives';
    btn.disabled = true;
  } else if (perm === 'denied') {
    btn.textContent = 'Push bloques (parametres navigateur)';
    btn.disabled = true;
  } else {
    btn.textContent = 'Activer les push';
    btn.disabled = false;
  }
}

function renderNotifSettings() {
  const el = document.getElementById('notif-settings-list');
  if (!el) return;
  const settings = getUserSettings(currentUser);
  const ns = settings.notifSettings || { chat: true, dividends: true, priceAlerts: true };
  const toggles = [
    { key: 'chat',        icon: IC.message, label: 'Messages chat support', sub: 'Notification a la reception d un message' },
    { key: 'dividends',   icon: IC.wallet, label: 'Dividendes recus',      sub: 'Notification lors de l enregistrement d un dividende' },
    { key: 'priceAlerts', icon: IC.target, label: 'Alertes prix',          sub: 'Notification quand un seuil de prix est atteint' },
  ];
  el.innerHTML = toggles.map(t => {
    const checked = ns[t.key] !== false;
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)">' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<span style="font-size:18px">' + t.icon + '</span>' +
        '<div>' +
          '<div style="font-size:13px;font-weight:600;color:var(--text)">' + t.label + '</div>' +
          '<div style="font-size:11px;color:var(--text3)">' + t.sub + '</div>' +
        '</div>' +
      '</div>' +
      '<div onclick="toggleNotifSetting(\'' + t.key + '\',' + !checked + ')" style="cursor:pointer;width:40px;height:22px;border-radius:22px;background:' + (checked ? 'var(--accent)' : 'var(--border2)') + ';position:relative;transition:background .2s;flex-shrink:0">' +
        '<div style="position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;top:3px;left:' + (checked ? '21px' : '3px') + ';transition:left .2s"></div>' +
      '</div>' +
    '</div>';
  }).join('');
}

async function toggleNotifSetting(key, value) {
  const settings = getUserSettings(currentUser);
  const ns = Object.assign({ chat: true, dividends: true, priceAlerts: true }, settings.notifSettings || {});
  ns[key] = value;
  await saveUserSettings(currentUser, { notifSettings: ns });
  renderNotifSettings();
}

function renderAlertsList() {
  const list = document.getElementById('alerts-list');
  const empty = document.getElementById('alerts-empty');
  if (!list) return;
  const alerts = getAlerts(currentUser);
  if (!alerts.length) { list.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
  if (empty) empty.style.display = 'none';
  list.innerHTML = alerts.map((a, i) => {
    const dir = a.direction === 'above' ? '>=' : '<=';
    const status = a.triggeredAt
      ? '<span style="color:var(--accent);font-size:11px">Declenchee</span>'
      : '<span style="color:var(--positive);font-size:11px">Active</span>';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">' +
      '<div>' +
        '<div style="font-size:13px;font-weight:600;color:var(--text)">' + a.name + ' <span style="color:var(--text3);font-weight:400">(' + a.ticker + ')</span></div>' +
        '<div style="font-size:12px;color:var(--text2);margin-top:2px">Prix ' + dir + ' ' + a.targetPrice + 'EUR &nbsp;&middot;&nbsp; ' + status + '</div>' +
      '</div>' +
      '<div style="display:flex;gap:6px;align-items:center">' +
        (a.triggeredAt ? '<button onclick="resetAlert(' + i + ')" style="background:none;border:1px solid var(--border2);color:var(--text3);border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer">Reactiver</button>' : '') +
        '<button onclick="deleteAlert(' + i + ')" style="background:none;border:1px solid rgba(255,77,106,0.3);color:var(--negative);border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer">Suppr.</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function renderNotifHistory() {
  const list = document.getElementById('notif-history-list');
  const empty = document.getElementById('notif-history-empty');
  if (!list) return;
  const history = getNotifHistory(currentUser);
  if (!history.length) { list.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
  if (empty) empty.style.display = 'none';
  let changed = false;
  history.forEach(n => { if (!n.read) { n.read = true; changed = true; } });
  if (changed) { saveNotifHistory(currentUser, history); _updateNotifBadge(); }
  list.innerHTML = history.slice(0, 30).map(n => {
    const d = new Date(n.timestamp);
    const dateStr = d.toLocaleDateString('fr-FR', { day:'2-digit', month:'short' }) + ' ' + d.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
    const icon = n.type === 'price_alert' ? IC.target : n.type === 'dividend' ? IC.wallet : IC.message;
    return '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">' +
      '<span style="font-size:18px;flex-shrink:0">' + icon + '</span>' +
      '<div style="flex:1;min-width:0">' +
        '<div style="font-size:13px;font-weight:600;color:var(--text)">' + n.title + '</div>' +
        '<div style="font-size:12px;color:var(--text2);margin-top:2px;word-break:break-word">' + n.body + '</div>' +
        '<div style="font-size:11px;color:var(--text3);margin-top:4px">' + dateStr + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function clearNotifHistory() {
  saveNotifHistory(currentUser, []);
  renderNotifHistory();
  _updateNotifBadge();
}

function openAddAlertModal() {
  const seen = new Set();
  const items = [];
  [...getPortfolio(currentUser), ...getWatchlist(currentUser)].forEach(r => {
    if (!seen.has(r.ticker)) { seen.add(r.ticker); items.push({ ticker: r.ticker, name: r.name || r.ticker }); }
  });
  if (!items.length) { alert('Ajoutez des actions au portefeuille ou a la watchlist.'); return; }
  const sel = document.getElementById('alert-ticker-select');
  sel.innerHTML = items.map(i => '<option value="' + i.ticker + '">' + i.name + ' (' + i.ticker + ')</option>').join('');
  document.getElementById('alert-price').value = '';
  document.getElementById('alert-direction').value = 'below';
  document.getElementById('alert-modal-overlay').classList.add('open');
}

function closeAlertModal() {
  document.getElementById('alert-modal-overlay').classList.remove('open');
}

function confirmAddAlert() {
  const sel = document.getElementById('alert-ticker-select');
  const ticker = sel.value;
  const name = (sel.options[sel.selectedIndex]?.text || ticker).split(' (')[0];
  const direction = document.getElementById('alert-direction').value;
  const targetPrice = parseFloat(document.getElementById('alert-price').value);
  if (!ticker || !targetPrice || targetPrice <= 0) { alert('Veuillez remplir tous les champs.'); return; }
  const alerts = getAlerts(currentUser);
  alerts.push({ id: Date.now(), ticker, name, direction, targetPrice, active: true, createdAt: new Date().toISOString() });
  saveAlerts(currentUser, alerts);
  closeAlertModal();
  renderAlertsList();
}

function deleteAlert(i) {
  const alerts = getAlerts(currentUser);
  alerts.splice(i, 1);
  saveAlerts(currentUser, alerts);
  renderAlertsList();
}

function resetAlert(i) {
  const alerts = getAlerts(currentUser);
  alerts[i].active = true;
  delete alerts[i].triggeredAt;
  saveAlerts(currentUser, alerts);
  renderAlertsList();
}

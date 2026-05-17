importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDvZ_0loJ9Lf_jhz-ZDGsydG9AE21CU5Uc",
  authDomain: "dashboard-pea.firebaseapp.com",
  projectId: "dashboard-pea",
  storageBucket: "dashboard-pea.firebasestorage.app",
  messagingSenderId: "1040263468997",
  appId: "1:1040263468997:web:ffbafd62cf9b672b1f9dac"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || 'Capital View';
  const body  = payload.notification?.body  || '';
  self.registration.showNotification(title, {
    body,
    icon:  '/Dashboard-PEA/logo.png',
    badge: '/Dashboard-PEA/logo.png',
    tag:   payload.data?.type || 'capitalview',
    data:  payload.data || {}
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
    for (const c of list) { if (c.url.includes(self.location.origin) && 'focus' in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow('/');
  }));
});

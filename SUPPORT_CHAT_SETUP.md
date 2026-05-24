# Setup chat support

## 1. Récupérer ton UID Firebase admin

1. Connecte-toi sur app.html avec ton compte
2. Console navigateur (F12) → exécute `firebase.auth().currentUser.uid`
3. Copie l'UID

## 2. Configurer ADMIN_UID

Dans `js/app.js`, remplacer:
```js
const ADMIN_UID = "REPLACE_WITH_YOUR_FIREBASE_UID";
```
par ton UID copié à l'étape 1.

## 3. Règles Firestore

Console Firebase → Firestore → Rules → ajouter:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ... règles existantes ...

    // Chat support : user voit/écrit son thread, admin voit tout
    function isAdmin() {
      return request.auth.uid == "A6nZQ8PcxdURytSesA17xK81I9T2";
    }

    match /supportChats/{userId}/messages/{msgId} {
      allow read:   if request.auth.uid == userId || isAdmin();
      allow create: if (request.auth.uid == userId && request.resource.data.from == "user")
                    || (isAdmin() && request.resource.data.from == "admin");
      allow update, delete: if isAdmin();
    }

    match /supportThreads/{userId} {
      allow read:   if request.auth.uid == userId || isAdmin();
      allow write:  if request.auth.uid == userId || isAdmin();
    }
  }
}
```

Remplacer `A6nZQ8PcxdURytSesA17xK81I9T2` par le même UID qu'à l'étape 2.

## 4. Test

- Compte user lambda: page Support → message → envoyer
- Toi (admin): page Support → vois la conversation dans liste gauche → clique → réponds
- Badge unread rouge dans sidebar nav

## Architecture

```
supportChats/{userUid}/messages/{msgId}
  { from: "user" | "admin", text, createdAt, authorUid }

supportThreads/{userUid}  (metadata pour liste admin)
  { lastMsg, lastAt, lastFrom, unreadAdmin, unreadUser, userEmail }
```

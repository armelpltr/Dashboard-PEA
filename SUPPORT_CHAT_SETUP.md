# Setup chat support

## 1. ADMIN_UID configuré

`js/app.js` → `const ADMIN_UID = "A6nZQ8PcxdURytSesA17xK81I9T2"` ✓

## 2. Rôle superadmin dans Firestore

Console Firebase → Firestore → collection `roles` → doc `A6nZQ8PcxdURytSesA17xK81I9T2`
Champ requis : `role` = `"superadmin"` (string)

Crée le doc si inexistant.

## 3. Règles Firestore (ajouter aux existantes)

Bloc à ajouter avant le dernier `}` qui ferme `match /databases/{database}/documents`:

```javascript
// ─── Chat support 1-to-1 user ↔ admin ───
function _isAdmin() {
  return request.auth != null &&
    get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == 'superadmin';
}

match /supportChats/{userId}/messages/{msgId} {
  allow read:   if request.auth != null && (request.auth.uid == userId || _isAdmin());
  allow create: if request.auth != null && (
    (request.auth.uid == userId && request.resource.data.from == 'user') ||
    (_isAdmin() && request.resource.data.from == 'admin')
  );
  allow update, delete: if _isAdmin();
}

match /supportThreads/{userId} {
  allow read:  if request.auth != null && (request.auth.uid == userId || _isAdmin());
  allow write: if request.auth != null && (request.auth.uid == userId || _isAdmin());
}
```

Console Firebase → Firestore Database → Rules → Publier.

## 4. Firebase Storage (pour images)

Console Firebase → Storage → Rules :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function _isAdmin() {
      return request.auth != null &&
        firestore.get(/databases/(default)/documents/roles/$(request.auth.uid)).data.role == 'superadmin';
    }
    match /support-attachments/{userId}/{file=**} {
      allow read:  if request.auth != null && (request.auth.uid == userId || _isAdmin());
      allow write: if request.auth != null && (request.auth.uid == userId || _isAdmin())
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 5. Test

- Compte user lambda : page Support → message → Envoyer
- Toi (admin) : page Support → vois conversation dans liste gauche → clique → réponds
- Badge unread rouge dans sidebar nav

## Architecture

```
supportChats/{userUid}/messages/{msgId}
  { from: "user" | "admin", text, createdAt, authorUid }

supportThreads/{userUid}  (metadata pour liste admin)
  { lastMsg, lastAt, lastFrom, unreadAdmin, unreadUser, userEmail }
```

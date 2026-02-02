# Database Design Document

This document defines the Firebase Firestore database structure, usage, and security rules for the Todo List web application.

---

## 1. Firebase Database Usage

### 1.1 Firebase Project Setup

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** (in test mode or apply the rules below).
3. Add a web app in the project settings and copy the `firebaseConfig`.

### 1.2 Firebase Initialization in the Project

```typescript
// src/lib/firebase.ts (example path)
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
```

### 1.3 Key Firestore API Usage Patterns

| Feature       | Method                                | Notes                  |
| ------------- | ------------------------------------- | ---------------------- |
| Add Todo      | `addDoc(collection(db, 'todos'), data)` | Document ID is auto-generated or uses UUID |
| Update Todo   | `updateDoc(doc(db, 'todos', id), data)` | Partial fields can be passed |
| Delete Todo   | `deleteDoc(doc(db, 'todos', id))`       | -                      |
| Real-time Sync| `onSnapshot(query(...), callback)`      | For real-time updates  |
| Single Fetch  | `getDoc(doc(db, 'todos', id))`          | -                      |

---

## 2. Database Structure

### 2.1 Collection: `todos`

Main collection for storing todo items.

| Field Name   | Type      | Required | Description |
| ------------ | --------- | -------- | ----------- |
| `id`         | string    | Yes      | Unique identifier (e.g., UUID) |
| `title`      | string    | Yes      | Todo content (recommended 1-500 characters) |
| `completed`  | boolean   | Yes      | Completion status (default: false) |
| `priority`   | string    | Yes      | Priority: `'high'` \| `'medium'` \| `'low'` |
| `createdAt`  | Timestamp | Yes      | Creation timestamp (server timestamp recommended) |
| `updatedAt`  | Timestamp | Yes      | Update timestamp |

### 2.2 Document Structure Example (JSON)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Organize project documents",
  "completed": false,
  "priority": "high",
  "createdAt": "2025-02-01T10:00:00.000Z",
  "updatedAt": "2025-02-01T10:00:00.000Z"
}
```

### 2.3 TypeScript Type Definitions (Reference)

```typescript
export type TodoPriority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 2.4 Recommended Indexes (Firestore)

- **Sorting/Filtering**: `completed` ASC + `priority` ASC + `createdAt` DESC  
  → Create a composite index for “Incomplete first, by priority, newest first” queries.
- Use the suggested index link in the Firestore console after running the first query.

---

## 3. Database Usage Rules

### 3.1 Writing Rules (Code/Operations)

1. **Document ID**
   - Use `uuid`(v4) for uniqueness when generated on the client.
   - Or sync the auto-generated ID from `addDoc` to the document's `id` field.

2. **Timestamps**
   - Use `serverTimestamp()` for `createdAt` and `updatedAt` to avoid client time discrepancies.

3. **Priority**
   - `priority` must be one of `'high'`, `'medium'`, or `'low'`.

4. **Title**
   - `title` must not be empty, and a maximum length limit (e.g., 500 characters) is recommended.

5. **Real-time Sync**
   - Use `onSnapshot` for the list view to reflect additions/updates/deletions immediately.

### 3.2 Firestore Security Rules (Rules)

The following rules are for **unauthenticated** single-app usage.  
When Firebase Auth is introduced, add user-specific access restrictions using `request.auth != null` and `request.auth.uid`.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // todos: Allow all reads/writes (for development/demo purposes)
    // Add domain restrictions or authentication conditions for production
    match /todos/{todoId} {
      allow read, write: if true;
    }
  }
}
```

**Production Recommendation (with Auth):**

```javascript
match /todos/{todoId} {
  allow read, write: if request.auth != null
    && request.resource.data.keys().hasAll(['id', 'title', 'completed', 'priority', 'createdAt', 'updatedAt'])
    && request.resource.data.title is string
    && request.resource.data.title.size() > 0
    && request.resource.data.title.size() <= 500
    && request.resource.data.completed is bool
    && request.resource.data.priority in ['high', 'medium', 'low'];
}
```

### 3.3 Summary

| Category    | Rule |
| ----------- | ---- |
| Document ID | Use UUID or Firestore auto-generated ID consistently |
| Timestamps  | Use `serverTimestamp()` |
| Priority    | Only allow `high` / `medium` / `low` |
| Title       | Mandatory, with length restrictions recommended |
| List View   | Use `onSnapshot` for real-time sync |
| Security    | Relax rules during development, add validation and authentication for production |

---

This document aligns with the features (add/edit/delete/complete tasks, set priority) and tech stack (Firebase, React, TypeScript, uuid) described in `documentation/prd.md`.
# Project Overview

This project is a Todo List web application that uses Firebase to store and manage data.

1. Users can add, edit, and delete tasks, with real-time synchronization of data stored in Firebase.
2. A simple and intuitive interface allows users to set task priorities and mark completed items.

---

# Core Functionalities

The main features of the Todo List are as follows:

1. **Add Task**: Users can add new tasks, which are saved in Firebase.
2. **Edit Task**: Existing tasks can be edited, and changes are automatically reflected in Firebase.
3. **Delete Task**: Unnecessary items can be removed, and they are deleted from Firebase.
4. **Mark Complete**: Completed items can be checked, and the information is updated in Firebase.
5. **Set Priority**: Tasks can be prioritized to manage important items first.

---

# Tech Stack

The technologies and tools used for this project are as follows:

1. **Front end**: React, TailwindCSS, TypeScript for UI and functionality.
2. **Backend**: Firebase (Firestore) for data storage and real-time synchronization.
3. **npm packages**:
   - `firebase` — Firebase integration
   - `react-icons` — Icons for an intuitive interface
   - `uuid` — Assign unique IDs to each todo item

---

# Development Checklist

The following checklist is based on the `documentation/prd.md` and `documentation/database.md`. Mark completed items with `[x]`.

## 1. Project Initialization

- [x] Create Vite + React + TypeScript project
- [x] Install and configure TailwindCSS
- [x] Install dependencies: `firebase`, `react-icons`, `uuid`
- [x] Set up environment variable files (`.env`, `.env.example`) for Firebase config

## 2. Firebase Integration

- [ ] Create Firebase project and enable Firestore (manual step)
- [x] Write `src/lib/firebase.ts` for Firebase app initialization and Firestore instance export
- [ ] Apply Firestore security rules (see Section 3.2 in `database.md`, apply manually in console)
- [x] (Optional) Create Firestore composite indexes — handle sorting on the client side, use default indexes

## 3. Types and Shared Code

- [x] Write `src/types/todo.ts` — Define `Todo` and `TodoPriority` types (see Section 2.3 in `database.md`)
- [ ] (Optional) Utility for Firestore `Timestamp` ↔ client conversion

## 4. Firestore CRUD and Real-time Sync

- [x] Real-time subscription to task list — Use `onSnapshot` to query the `todos` collection
- [x] Add task — Use `setDoc` + UUID, `serverTimestamp()`
- [x] Edit task — Use `updateDoc` (title, completion status, priority)
- [x] Delete task — Use `deleteDoc`
- [x] (Optional) Custom hook `useTodos` — Manage CRUD + real-time list state

## 5. UI Components

- [x] Task input form — Add new tasks (title, priority)
- [x] Task list — Render list, sort (incomplete/priority/newest)
- [x] Task item — Display title, completion checkbox, priority, edit/delete buttons
- [x] Completion checkbox — Update Firestore `completed` field on check
- [x] Priority display/change — Visual distinction for high/medium/low (using `react-icons`)
- [x] Loading/error state handling — Show loading during subscription, handle Firestore errors

## 6. Core Functionality Validation

- [x] Verify immediate reflection of added tasks in Firestore and UI
- [x] Verify real-time sync of edited tasks
- [x] Verify removal of deleted tasks from the list
- [x] Verify completion status updates
- [x] Verify priority changes and sorting behavior

## 7. Finalization

- [x] Remove unnecessary console logs
- [x] Write README with setup instructions and environment variable guide
- [ ] (Optional) Build and deploy (e.g., Firebase Hosting)

---

# File Structure

Recommended file structure based on Vite + React + TypeScript + Tailwind + Firestore.

```
todolist/
├── public/
│   └── favicon.ico
├── documentation/
│   ├── prd.md
│   └── database.md
├── src/
│   ├── main.tsx                 # App entry point
│   ├── App.tsx                  # Root component, routing (if needed)
│   ├── index.css                # Tailwind entry point
│   ├── lib/
│   │   └── firebase.ts          # Firebase initialization, db export
│   ├── types/
│   │   └── todo.ts              # Todo, TodoPriority types
│   ├── hooks/
│   │   └── useTodos.ts          # Firestore CRUD + onSnapshot list state
│   ├── components/
│   │   ├── TodoList.tsx         # Task list container
│   │   ├── TodoItem.tsx         # Individual task item (check, edit, delete, priority)
│   │   ├── TodoForm.tsx         # New task input form (title, priority)
│   │   └── PriorityBadge.tsx    # (Optional) Priority badge/icon
│   └── pages/
│       └── Home.tsx             # Main page (TodoForm + TodoList)
├── .env.example                 # Example environment variables (Firebase config)
├── .env                         # Actual values (excluded from git)
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Directory Roles Summary

| Path         | Role |
| ------------ | ---- |
| `src/lib/`   | Firebase and external service initialization |
| `src/types/` | Shared TypeScript types like Todo |
| `src/hooks/` | Firestore CRUD, add/edit/delete, real-time subscription logic |
| `src/components/` | Reusable UI components (TodoList, TodoItem, TodoForm, etc.) |
| `src/pages/` | Page-level compositions (currently only Home is needed) |

---

This checklist and file structure align with the database structure and usage rules described in `documentation/database.md`.
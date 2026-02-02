# My Todo App

This project is a Todo List web application built with React, TypeScript, and Firebase. It allows users to manage their tasks efficiently with features like adding, editing, deleting, and prioritizing tasks. The app also supports real-time synchronization using Firebase Firestore.

## Features

- Add, edit, and delete tasks
- Mark tasks as complete
- Set task priorities (High, Medium, Low)
- Real-time synchronization with Firebase Firestore
- Responsive and user-friendly interface

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Firebase Firestore
- **Other Tools**: Vite, React Icons, UUID

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd my-todo-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Copy the contents of `.env.example` and fill in your Firebase configuration.
5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
my-todo-app/
├── public/                # Static assets
├── src/                   # Source code
│   ├── components/        # Reusable components
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Firebase configuration
│   ├── pages/             # Page components
│   ├── types/             # TypeScript types
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── .env.example           # Example environment variables
├── package.json           # Project metadata and scripts
├── tailwind.config.js     # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Acknowledgments

This project was developed with the assistance of AI tools to streamline the coding process and improve productivity.

The `prd.md` file was initially created with only the **Project Overview** and **Core Functionalities** sections. Based on this, the `database.md` file was written to define the database structure. The entire codebase was then generated and refined using AI assistance.


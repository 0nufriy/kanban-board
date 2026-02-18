# 📋 Modern Kanban Board

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/State_Management-Zustand-orange?style=for-the-badge)

A fully functional, responsive Kanban task management application built with **Next.js (App Router)** and **TypeScript**. 
This project features a complex Drag-and-Drop interface utilizing `@dnd-kit` and robust state management with **Zustand**, including local storage persistence.

---

## 🚀 Features

- **Drag and Drop Interface:** Smooth drag-and-drop functionality for tasks and columns using `@dnd-kit`.
- **State Persistence:** Data is automatically saved to `localStorage` via Zustand middleware, ensuring tasks aren't lost on refresh.
- **Column Management:** Create, rename, and delete columns dynamically.
- **Task Management:** Add, edit, and remove tasks within columns.
- **Responsive Design:** Optimized for various screen sizes using Tailwind CSS.
- **Optimistic UI:** Instant visual updates for better user experience.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/) for strict type safety.
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (with persist middleware).
- **Drag & Drop:** [@dnd-kit](https://dndkit.com/) (Core, Sortable, Utilities).
- **Styling:** [Tailwind CSS](https://tailwindcss.com/).
- **Icons:** [Lucide React](https://lucide.dev/).
- **Utilities:** `uuid` for unique ID generation.

---

## 📂 Project Structure

```bash
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
│   ├── KanbanBoard.tsx   # Main board logic
│   ├── ColumnContainer.tsx # Column droppable area
│   └── TaskCard.tsx      # Draggable task item
├── store/            # Global state (Zustand)
│   └── useStore.ts   # Store configuration & actions
└── types/            # TypeScript interfaces & types
```

---

## ⚡ Getting Started

Follow these steps to run the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/kanban-board.git
   cd kanban-board
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.

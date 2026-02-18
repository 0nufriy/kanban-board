"use client";

import { useKanbanStore } from "@/store/useStore";
import { useShallow } from "zustand/react/shallow";

export default function Header() {
  const columnsCount = useKanbanStore(useShallow((state) => state.columns.length));
  const tasksCount = useKanbanStore(useShallow((state) => state.tasks.length));

  return (
    <header className="border-b border-white/10 bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-10 px-8 py-4 flex items-center gap-3">
      <div className="flex items-center gap-2.5">
        <h1 className="text-lg font-semibold tracking-tight text-white/90">
          Kanban Board
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-2 text-xs text-white/40">
        <span>{columnsCount} columns</span>
        <span>·</span>
        <span>{tasksCount} tasks</span>
      </div>
    </header>
  );
}

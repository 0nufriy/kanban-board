"use client";

import { useMemo, useState, useEffect } from "react";
import { useKanbanStore } from "@/store/useStore";
import { Column, Id, Task } from "@/types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

export default function KanbanBoard() {
  const columns = useKanbanStore(useShallow((state) => state.columns));
  const tasks = useKanbanStore(useShallow((state) => state.tasks));
  const actions = useKanbanStore(
    useShallow((state) => ({
      addColumn: state.addColumn,
      setColumns: state.setColumns,
      setTasks: state.setTasks,
    })),
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-[#0f1117] text-white">
      <header className="border-b border-white/10 bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-10 px-8 py-4 flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg font-semibold tracking-tight text-white/90">
            Kanban Board
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-white/40">
          <span>{columns.length} columns</span>
          <span>·</span>
          <span>{tasks.length} tasks</span>
        </div>
      </header>

      <section className="flex items-start overflow-x-auto overflow-y-hidden px-8 py-6 min-h-[calc(100vh-65px)]">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="flex gap-4 items-start">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer key={col.id} column={col} />
              ))}
            </SortableContext>

            <button
              onClick={() => actions.addColumn(`Column ${columns.length + 1}`)}
              className="group flex items-center gap-2 h-[52px] w-[300px] min-w-[300px] cursor-pointer rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white/50 hover:bg-white/10 hover:text-white/80 hover:border-white/20 transition-all duration-200"
            >
              <Plus
                size={16}
                className="text-white/40 group-hover:text-white/70 transition-colors"
              />
              Add column
            </button>
          </div>

          {createPortal(
            <DragOverlay>
              {activeColumn && <ColumnContainer column={activeColumn} />}
              {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      </section>
    </div>
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (isActiveAColumn) {
      actions.setColumns((columns: Column[]) => {
        const activeIndex = columns.findIndex((t) => t.id === activeId);
        const overIndex = columns.findIndex((t) => t.id === overId);
        return arrayMove(columns, activeIndex, overIndex);
      });
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      actions.setTasks((tasks: Task[]) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      actions.setTasks((tasks: Task[]) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Column, Task, Id } from "@/types";

interface KanbanState {
  columns: Column[];
  tasks: Task[];
  addColumn: (title: string) => Id;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  setColumns: (column: Column[] | ((column: Column[]) => Column[])) => void;
  addTask: (columnId: Id, content: string) => Id;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  setTasks: (tasks: Task[] | ((tasks: Task[]) => Task[])) => void;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set) => ({
      columns: [
        { id: "todo", title: "To Do" },
        { id: "doing", title: "In Progress" },
        { id: "done", title: "Done" },
      ],
      tasks: [],

      addColumn: (title) => {
        const newId = crypto.randomUUID();
        set((state) => ({
          columns: [...state.columns, { id: newId, title }],
        }));
        return newId;
      },

      deleteColumn: (id) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
          tasks: state.tasks.filter((task) => task.columnId !== id),
        })),
      updateColumn: (id, title) =>
        set((state) => ({
          columns: state.columns.map((column) =>
            column.id === id ? { ...column, title } : column,
          ),
        })),

      setColumns: (fnOrColumn) =>
        set((state) => {
          const newColumn =
            typeof fnOrColumn === "function"
              ? fnOrColumn(state.columns)
              : fnOrColumn;
          return { columns: newColumn };
        }),

      addTask: (columnId, content) => {
        const newId = crypto.randomUUID();
        set((state) => ({
          tasks: [...state.tasks, { id: newId, columnId, content }],
        }));
        return newId;
      },

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      updateTask: (id, content) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, content } : task,
          ),
        })),

      setTasks: (fnOrTasks) =>
        set((state) => {
          const newTasks =
            typeof fnOrTasks === "function"
              ? fnOrTasks(state.tasks)
              : fnOrTasks;
          return { tasks: newTasks };
        }),
    }),
    {
      name: "kanban-storage",
    },
  ),
);

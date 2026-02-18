import { memo, useEffect, useMemo, useState } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Id, Task } from "@/types";
import { Trash2, Plus, GripVertical } from "lucide-react";
import TaskCard from "./TaskCard";
import { useKanbanStore } from "@/store/useStore";
import { useShallow } from "zustand/react/shallow";

interface Props {
  column: Column;
}

function ColumnContainer(props: Props) {
  const { column } = props;

  const [editMode, setEditMode] = useState(false);
  const tasks = useKanbanStore(
    useShallow((state) => state.tasks.filter((t) => t.columnId === column.id)),
  );

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const actions = useKanbanStore(
    useShallow((state) => ({
      updateColumn: state.updateColumn,
      deleteColumn: state.deleteColumn,
      addTask: state.addTask,
    })),
  );
  const stopEditing = () => {
    setEditMode(false);
    if (localTitle.trim().length !== 0)
      actions.updateColumn(column.id, localTitle.trim());
    else setLocalTitle(column.title);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
    disabled: editMode,
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };
  const [localTitle, setLocalTitle] = useState(column.title);

  useEffect(() => {
    setLocalTitle(column.title);
  }, [column.title]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-[300px] h-[500px] max-h-[500px] rounded-xl flex flex-col opacity-30 border-2 border-indigo-500/60 bg-white/5"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[300px] max-h-[calc(100vh-130px)] rounded-xl flex flex-col bg-[#161b27] border border-white/8 shadow-xl shadow-black/30"
    >
      <div className="flex items-center gap-2 px-3 py-3 border-b border-white/8">
        <button
          {...attributes}
          {...listeners}
          className="text-white/20 hover:text-white/50 cursor-grab active:cursor-grabbing transition-colors p-0.5 rounded"
          aria-label="Drag column"
        >
          <GripVertical size={14} />
        </button>

        <div className="flex-1 min-w-0" onClick={() => setEditMode(true)}>
          {editMode ? (
            <input
              className="w-full bg-white/10 border border-white/20 rounded-md px-2 py-0.5 text-sm font-medium text-white outline-none focus:border-indigo-500/60 transition-colors"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.currentTarget.value)}
              autoFocus
              onBlur={stopEditing}
              onKeyDown={(e) => {
                if (e.key === "Enter") stopEditing();
              }}
            />
          ) : (
            <span className="text-sm font-semibold text-white/80 truncate block cursor-text hover:text-white transition-colors">
              {column.title}
            </span>
          )}
        </div>

        <span className="text-xs font-medium text-white/30 bg-white/8 rounded-full px-2 py-0.5 min-w-[24px] text-center">
          {tasks.length}
        </span>

        <button
          onClick={() => actions.deleteColumn(column.id)}
          className="text-white/20 hover:text-red-400 transition-colors p-0.5 rounded"
          aria-label="Delete column"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-2 p-2 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-8 text-xs text-white/20 select-none">
            No tasks yet
          </div>
        )}
      </div>

      <div className="p-2 border-t border-white/8">
        <button
          className="group w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/8 transition-all duration-150"
          onClick={() => actions.addTask(column.id, `Task ${tasks.length + 1}`)}
        >
          <Plus
            size={14}
            className="text-white/30 group-hover:text-indigo-400 transition-colors"
          />
          Add task
        </button>
      </div>
    </div>
  );
}

export default memo(ColumnContainer);

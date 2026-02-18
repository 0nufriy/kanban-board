import { memo, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, Id } from "@/types";
import { useKanbanStore } from "@/store/useStore";
import { useShallow } from "zustand/react/shallow";

interface Props {
  task: Task;
}

function TaskCard({ task }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [localContent, setLocalContent] = useState(task.content);
  const actions = useKanbanStore(
    useShallow((state) => ({
      deleteTask: state.deleteTask,
      updateTask: state.updateTask,
    })),
  );
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  const stopEditMode = () => {
    setEditMode(false);
    setMouseIsOver(false);
    if (localContent.trim().length !== 0)
      actions.updateTask(task.id, localContent.trim());
    else setLocalContent(task.content);
  };

  useEffect(() => {
    setLocalContent(task.content);
  }, [task.content]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-40 bg-indigo-500/10 border border-indigo-500/40 p-3 min-h-[80px] rounded-lg cursor-grabbing"
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-[#1e2333] border border-indigo-500/50 p-3 min-h-[80px] rounded-lg cursor-grab shadow-lg shadow-black/20"
      >
        <textarea
          className="w-full h-full min-h-[60px] resize-none bg-transparent text-sm text-white/90 placeholder-white/20 outline-none leading-relaxed"
          value={localContent}
          autoFocus
          placeholder="Task content here…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) return;
            if (e.key === "Enter") {
              stopEditMode();
            }
          }}
          onBlur={stopEditMode}
          onChange={(e) => setLocalContent(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="group relative bg-[#1a1f2e] hover:bg-[#1e2333] border border-white/8 hover:border-white/15 p-3 min-h-[80px] rounded-lg cursor-grab active:cursor-grabbing transition-all duration-150 shadow-sm shadow-black/20"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <p className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap overflow-hidden pr-6">
        {task.content}
      </p>

      {mouseIsOver && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            actions.deleteTask(task.id);
          }}
          className="absolute right-2.5 top-2.5 p-1.5 rounded-md text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
          aria-label="Delete task"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

export default memo(TaskCard);

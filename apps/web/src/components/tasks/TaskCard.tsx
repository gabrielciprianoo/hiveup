import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Task, TaskStatus } from "../../types";

interface TaskCardProps {
  task: Task;
  statusColor: string;
}

const statusColors: Record<TaskStatus, string> = {
  inProgress: "border-l-blue-500 bg-blue-50/50",
  underReview: "border-l-amber-500 bg-amber-50/50",
  pending: "border-l-gray-500 bg-gray-50/50",
  onHold: "border-l-red-500 bg-red-50/50",
  completed: "border-l-emerald-500 bg-emerald-50/50",
};

export default function TaskCard({ task, statusColor }: TaskCardProps) {
  const [popupPos, setPopupPos] = useState<{ top: number; right: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setPopupPos(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function openPopup(e: React.MouseEvent) {
    e.stopPropagation();
    if (popupPos) {
      setPopupPos(null);
      return;
    }
    const rect = buttonRef.current!.getBoundingClientRect();
    setPopupPos({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
  }

  return (
    <div
      className={`relative p-3 rounded-lg border-l-4 bg-white hover:shadow-md transition-all duration-150 cursor-pointer ${statusColors[task.status as TaskStatus] || statusColors.pending}`}
      style={{ borderLeftColor: statusColor }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-dark flex-1">{task.name}</p>
        <button
          ref={buttonRef}
          onClick={openPopup}
          className="p-1 rounded-md text-secondary hover:text-dark hover:bg-border/40 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-secondary mt-1 line-clamp-2">
          {task.description}
        </p>
      )}

      {popupPos && (
        <div
          ref={popupRef}
          className="fixed z-50 w-32 bg-surface rounded-lg border border-border/60 shadow-lg py-1"
          style={{ top: popupPos.top, right: popupPos.right }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPopupPos(null);
              navigate(`?editTask=${task._id}`);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-dark hover:bg-border/40 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPopupPos(null);
              navigate(`?deleteTask=${task._id}`);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

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
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative p-3 rounded-lg border-l-4 bg-white hover:shadow-md transition-all duration-150 cursor-pointer ${statusColors[task.status as TaskStatus] || statusColors.pending}`}
      style={{ borderLeftColor: statusColor }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-dark flex-1">{task.name}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPopup(!showPopup);
          }}
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

      {showPopup && (
        <div
          ref={popupRef}
          className="absolute right-2 top-8 z-10 w-32 bg-surface rounded-lg border border-border/60 shadow-lg py-1"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPopup(false);
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
              setShowPopup(false);
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

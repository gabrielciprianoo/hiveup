import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, CalendarPlus, RefreshCw, Check } from "lucide-react";
import type { Task, TaskStatus } from "../../types";
import { taskStatus } from "../../types";
import { updateTaskStatus } from "../../api/TaskAPI";
import { formatDate } from "../../utils/formatDate";
import { toastError } from "../../lib/toast-helpers";

type StatusMeta = {
  label: string;
  dot: string;
  bg: string;
  text: string;
  ring: string;
};

const statusMeta: Record<TaskStatus, StatusMeta> = {
  pending:     { label: "Pendiente",   dot: "bg-gray-400",    bg: "bg-gray-50",    text: "text-gray-600",   ring: "ring-gray-300" },
  onHold:      { label: "En espera",   dot: "bg-red-500",     bg: "bg-red-50",     text: "text-red-600",    ring: "ring-red-300" },
  inProgress:  { label: "En progreso", dot: "bg-blue-500",    bg: "bg-blue-50",    text: "text-blue-600",   ring: "ring-blue-300" },
  underReview: { label: "En revisión", dot: "bg-amber-500",   bg: "bg-amber-50",   text: "text-amber-600",  ring: "ring-amber-300" },
  completed:   { label: "Completada",  dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-300" },
};

const statusOrder: TaskStatus[] = [
  taskStatus.PENDING,
  taskStatus.ON_HOLD,
  taskStatus.IN_PROGRESS,
  taskStatus.UNDER_REVIEW,
  taskStatus.COMPLETED,
];

type ViewTaskModalProps = {
  task: Task;
  projectId: string;
};

export default function ViewTaskModal({ task, projectId }: ViewTaskModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const closeModal = () => navigate(location.pathname, { replace: true });

  const current = statusMeta[task.status as TaskStatus] ?? statusMeta.pending;

  const { mutate, isPending, variables } = useMutation({
    mutationFn: (status: TaskStatus) =>
      updateTaskStatus({ projectId, taskId: task._id, status }),
    onError: (error: Error) => {
      toastError("Error al actualizar estado", error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", task._id] });
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg bg-surface rounded-2xl border border-border/60 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border/50">
          <div className="flex items-start gap-3 min-w-0">
            <span className={`block w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${current.dot}`} />
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-dark leading-snug break-words">
                {task.name}
              </h2>
              <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.bg} ${current.text}`}>
                {current.label}
              </span>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="flex-shrink-0 p-1.5 rounded-lg text-secondary hover:text-dark hover:bg-border/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Description */}
          <div>
            <p className="text-xs font-medium text-secondary uppercase tracking-wider mb-2">
              Descripción
            </p>
            <p className="text-sm text-dark leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          </div>

          {/* Status selector */}
          <div>
            <p className="text-xs font-medium text-secondary uppercase tracking-wider mb-2">
              Cambiar estado
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {statusOrder.map((s) => {
                const meta = statusMeta[s];
                const isActive = task.status === s;
                const isLoading = isPending && variables === s;

                return (
                  <button
                    key={s}
                    disabled={isPending}
                    onClick={() => !isActive && mutate(s)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150
                      ${isActive
                        ? `${meta.bg} ${meta.text} border-transparent ring-2 ${meta.ring} cursor-default`
                        : "bg-background text-secondary border-border/50 hover:border-border hover:text-dark hover:bg-border/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      }`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} />
                    <span className="flex-1 text-left">{meta.label}</span>
                    {isActive && !isLoading && <Check className="w-3.5 h-3.5" />}
                    {isLoading && (
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-background border border-border/50">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CalendarPlus className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-secondary uppercase tracking-wider">
                  Creada
                </p>
                <p className="text-xs font-medium text-dark mt-0.5 leading-snug">
                  {formatDate(task.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-background border border-border/50">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-secondary uppercase tracking-wider">
                  Modificada
                </p>
                <p className="text-xs font-medium text-dark mt-0.5 leading-snug">
                  {formatDate(task.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={closeModal}
            className="w-full px-4 py-2.5 border border-border rounded-lg font-medium text-dark hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

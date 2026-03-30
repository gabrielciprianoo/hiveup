import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { deleteTask } from "../../api/TaskAPI";
import { toastSuccess, toastError } from "../../lib/toast-helpers";

type DeleteTaskModalProps = {
  projectId: string;
  taskId: string;
};

export default function DeleteTaskModal({ projectId, taskId }: DeleteTaskModalProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const closeModal = () => navigate(location.pathname, { replace: true });

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteTask({ projectId, taskId }),
    onError: (error: Error) => {
      toastError("Error al eliminar tarea", error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toastSuccess("Tarea eliminada", "La tarea se eliminó correctamente");
      closeModal();
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md bg-surface rounded-2xl border border-border/60 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-dark">Eliminar tarea</h2>
            <p className="mt-1.5 text-sm text-secondary">
              ¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 px-4 py-2.5 border border-border rounded-lg font-medium text-dark hover:border-primary/50 hover:bg-primary/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => mutate()}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isPending ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

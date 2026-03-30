import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, ListTodo } from "lucide-react";
import { createTask } from "../../api/TaskAPI";
import { toastSuccess, toastError } from "../../lib/toast-helpers";
import type { TaskFormData } from "../../types";

type AddTaskModalProps = {
  projectId: string;
  onClose: () => void;
};

export default function AddTaskModal({ projectId, onClose }: AddTaskModalProps) {
  const queryClient = useQueryClient();
  const initialValues: TaskFormData = {
    name: "",
    description: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: TaskFormData) => createTask({ projectId, formData }),
    onError: (error: Error) => {
      toastError("Error al crear tarea", error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toastSuccess("Tarea creada", "La tarea se ha registrado correctamente");
      onClose();
    },
  });

  const handleFormSubmit = (data: TaskFormData) => mutate(data);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg bg-surface rounded-2xl border border-border/60 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center">
              <ListTodo className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-base font-semibold text-dark">Nueva Tarea</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-dark hover:bg-border/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm font-medium text-dark">
              Nombre de la tarea
            </label>
            <input
              id="name"
              type="text"
              placeholder="Ej: Diseñar mockups"
              className="w-full px-4 py-2.5 bg-background border border-border/60 rounded-lg text-dark placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              {...register("name", {
                required: "El nombre es obligatorio",
                minLength: {
                  value: 4,
                  message: "Mínimo 4 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "Máximo 50 caracteres",
                },
              })}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-sm font-medium text-dark">
              Descripción
            </label>
            <textarea
              id="description"
              placeholder="Describe los detalles de la tarea..."
              rows={4}
              className="w-full px-4 py-2.5 bg-background border border-border/60 rounded-lg text-dark placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
              {...register("description", {
                required: "La descripción es obligatoria",
                minLength: {
                  value: 10,
                  message: "Mínimo 10 caracteres",
                },
                maxLength: {
                  value: 1000,
                  message: "Máximo 1000 caracteres",
                },
              })}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-lg font-medium text-dark hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-active disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isPending ? "Creando..." : "Crear Tarea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

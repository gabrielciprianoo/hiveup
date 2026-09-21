import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Users, FileText, FolderKanban } from "lucide-react";
import { ErrorMessage } from "..";
import type { ProjectFormData } from "../../types";

type ProjectFormType = {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
};

const inputClasses = `
  w-full px-3 sm:px-4 py-3 bg-background border border-border rounded-lg
  text-dark placeholder:text-secondary/60 text-base
  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
  transition-all duration-150
`;

const labelClasses = `
  block text-sm font-medium text-dark mb-2
`;

const labelWithIconClasses = `
  flex items-center gap-2
`;

export default function ProjectForm({ register, errors }: ProjectFormType) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <label htmlFor="projectName" className={labelClasses}>
          <span className={labelWithIconClasses}>
            <FolderKanban className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Nombre del Proyecto</span>
          </span>
        </label>
        <input
          id="projectName"
          className={inputClasses}
          type="text"
          placeholder="Ej: Redesign Website 2024"
          {...register("projectName", {
            required: "El nombre del proyecto es obligatorio",
            minLength: { value: 3, message: "Mínimo 3 caracteres" },
          })}
        />
        {errors.projectName && (
          <ErrorMessage>{errors.projectName.message}</ErrorMessage>
        )}
      </div>

      <div>
        <label htmlFor="clientName" className={labelClasses}>
          <span className={labelWithIconClasses}>
            <Users className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Cliente</span>
          </span>
        </label>
        <input
          id="clientName"
          className={inputClasses}
          type="text"
          placeholder="Ej: Acme Corporation"
          {...register("clientName", {
            required: "El nombre del cliente es obligatorio",
            minLength: { value: 3, message: "Mínimo 3 caracteres" },
          })}
        />
        {errors.clientName && (
          <ErrorMessage>{errors.clientName.message}</ErrorMessage>
        )}
      </div>

      <div>
        <label htmlFor="description" className={labelClasses}>
          <span className={labelWithIconClasses}>
            <FileText className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Descripción</span>
          </span>
        </label>
        <textarea
          id="description"
          className={`${inputClasses} min-h-[120px] sm:min-h-[140px] resize-y`}
          placeholder="Describe los objetivos, alcance y entregables del proyecto..."
          {...register("description", {
            required: "Una descripción del proyecto es obligatoria",
            minLength: { value: 10, message: "Mínimo 10 caracteres" },
          })}
        />
        {errors.description && (
          <ErrorMessage>{errors.description.message}</ErrorMessage>
        )}
      </div>
    </div>
  );
}

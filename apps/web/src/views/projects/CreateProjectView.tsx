import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { ProjectForm, ProjectTips } from "../../components";
import type { ProjectFormData } from "../../types";
import { createProject } from "../../api/ProjectAPI";
import { useMutation } from "@tanstack/react-query";
import { toastSuccess, toastError } from "../../lib/toast-helpers";
import { PROJECT_TIPS } from "./constants/projectTips";

export default function CreateProjectView() {
  const navigate = useNavigate();
  const initialValues: ProjectFormData = {
    projectName: "",
    clientName: "",
    description: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialValues,
  });

  const { mutate } = useMutation({
    mutationFn: createProject,
    onError: (error) => {
      toastError("Ocurrio un error", error.message);
    },
    onSuccess: () => {
      toastSuccess("Proyecto creado", "registraste un nuevo proyecto");
      navigate("/projects");
    },
  });

  const handleFormSubmit = async (data: ProjectFormData) => mutate(data);

  return (
    <div className="min-h-[85vh] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-background to-primary/[0.05]" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/[0.04] rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/[0.03] rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="order-2 lg:order-1">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-secondary hover:text-dark transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Volver a proyectos</span>
            </Link>

            <div className="bg-surface rounded-2xl border border-border/60 p-6 sm:p-8 shadow-sm">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-dark">
                  Crear Nuevo Proyecto
                </h1>
                <p className="text-secondary mt-1">
                  Completa los detalles para comenzar un nuevo proyecto
                </p>
              </div>

              <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                <ProjectForm register={register} errors={errors} />

                <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/projects"
                    className="sm:flex-1 px-6 py-3 text-center border border-border rounded-lg font-medium text-dark hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-active disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {isSubmitting ? (
                      "Creando..."
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Crear Proyecto
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <ProjectTips tips={PROJECT_TIPS} />
        </div>
      </div>
    </div>
  );
}

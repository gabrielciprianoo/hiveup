import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, FolderKanban, Lightbulb, Target } from "lucide-react";
import { ProjectForm } from "../../components";
import type { ProjectFormData } from "../../types";
import { createProject } from "../../api/ProjectAPI";
import { useMutation } from "@tanstack/react-query";
import { toastSuccess, toastError } from "../../lib/toast-helpers";

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
              to="/proyectos"
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
                    to="/proyectos"
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

          <div className="order-1 lg:order-2 hidden lg:block pt-16">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold text-dark mb-6">
                Consejos para tu proyecto
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-surface/60 rounded-xl border border-border/40">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FolderKanban className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-dark text-sm">
                      Nombre claro
                    </h3>
                    <p className="text-secondary text-sm mt-0.5">
                      Usa un nombre descriptivo que identifique facilmente el
                      proyecto
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-surface/60 rounded-xl border border-border/40">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-dark text-sm">
                      Cliente definido
                    </h3>
                    <p className="text-secondary text-sm mt-0.5">
                      Asigna el proyecto al cliente correcto para mejor
                      seguimiento
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-surface/60 rounded-xl border border-border/40">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-dark text-sm">
                      Descripción detallada
                    </h3>
                    <p className="text-secondary text-sm mt-0.5">
                      Incluye objetivos y entregables para mantener el enfoque
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

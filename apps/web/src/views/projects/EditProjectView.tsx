import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { getProjectById, updateProject } from "../../api/ProjectAPI";
import { ProjectForm, ProjectTips } from "../../components";
import { ArrowLeft, SaveAllIcon } from "lucide-react";
import { PROJECT_TIPS } from "./constants/projectTips";
import { useForm } from "react-hook-form";
import { toastError, toastSuccess } from "../../lib/toast-helpers";
import type { ProjectFormData } from "../../types";

export default function EditProjectView() {
  const params = useParams();
  const projectId = params.projectId!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["editProject", projectId],
    queryFn: () => getProjectById(projectId),
    retry: false,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    values: data,
  });

  const { mutate } = useMutation({
    mutationFn: updateProject,
    onError: (error) => {
      toastError("Ocurrio un error", error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
      toastSuccess(data!, "se actualizaron los detalles del proyecto");
      navigate("/projects");
    },
  });

  const handleFormSubmit = (formData: ProjectFormData) => {
    const updatedData = {
      formData,
      projectId,
    };
    mutate(updatedData);
  };

  if (isError) {
    return <Navigate to="/404" />;
  }
  if (isLoading) {
    return <div>Cargando...</div>;
  }
  if (data)
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
                    Editar El Proyecto
                  </h1>
                  <p className="text-secondary mt-1">
                    Cambia los detalles para actualizar el proyecto
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
                        "Actualizando..."
                      ) : (
                        <>
                          <SaveAllIcon className="w-5 h-5" />
                          Guardar Cambios
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

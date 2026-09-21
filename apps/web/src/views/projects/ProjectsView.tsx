import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, FolderOpen } from "lucide-react";
import { deleteProject, getProjects } from "../../api/ProjectAPI";
import type { Project } from "../../types";
import ProjectCard from "../../components/projects/ProjectCard";
import { toastError, toastSuccess } from "../../lib/toast-helpers";

function ProjectsGrid({ projects }: { projects: Project[] }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteProject,
    onError: (error) => {
      toastError("Ocurrio un error ", error.message);
    },
    onSuccess: (data) => {
      toastSuccess("Proyecto eliminado", data);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const onDeleteProject = (projecId: Project["_id"]) => {
    mutation.mutate(projecId);
  };
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onDelete={onDeleteProject}
        />
      ))}
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="p-6 bg-surface rounded-xl border border-border/40 animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-border/50 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 bg-border/50 rounded" />
              <div className="h-4 w-1/2 bg-border/30 rounded" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full bg-border/30 rounded" />
            <div className="h-4 w-2/3 bg-border/30 rounded" />
          </div>
          <div className="mt-4 pt-4 border-t border-border/40 flex justify-between">
            <div className="h-4 w-16 bg-border/30 rounded" />
            <div className="h-4 w-20 bg-border/30 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <FolderOpen className="w-12 h-12 text-primary" />
      </div>

      <h3 className="text-xl font-semibold text-dark mb-2">
        No hay proyectos aún
      </h3>
      <p className="text-secondary max-w-md mb-8">
        Crea tu primer proyecto para comenzar a organizar tu trabajo y colaborar
        con tu equipo.
      </p>

      <Link
        to="/projects/create"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-active transition-colors duration-150"
      >
        <Plus className="w-5 h-5" />
        Crear Proyecto
      </Link>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-dark">Proyectos</h1>
        <p className="text-secondary mt-1">Gestiona tus proyectos y clientes</p>
      </div>

      <Link
        to="/projects/create"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-active transition-colors duration-150"
      >
        <Plus className="w-5 h-5" />
        Nuevo Proyecto
      </Link>
    </div>
  );
}

function Background() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-background to-primary/[0.05]" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/[0.04] rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/[0.03] rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
    </>
  );
}

export default function ProjectsView() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  return (
    <div className="min-h-[85vh] relative overflow-hidden">
      <Background />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-10">
        <PageHeader />

        {isLoading && <ProjectsSkeleton />}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            Error al cargar los proyectos: {error.message}
          </div>
        )}

        {!isLoading && !error && data && data.length === 0 && <EmptyState />}

        {!isLoading && !error && data && data.length > 0 && (
          <ProjectsGrid projects={data} />
        )}
      </div>
    </div>
  );
}

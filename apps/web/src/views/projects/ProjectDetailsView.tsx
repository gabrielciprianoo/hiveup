import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getProjectById } from "../../api/ProjectAPI";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Folder, Pencil, ListTodo, Plus } from "lucide-react";
import { AddTaskModal, TasksList, EditTaskQuery, DeleteTaskModal, ViewTaskQuery } from "../../components";

function HeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-20 bg-border/40 rounded mb-5" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-border/40" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-border/50 rounded" />
            <div className="h-3.5 w-28 bg-border/30 rounded-full" />
          </div>
        </div>
        <div className="h-8 w-16 bg-border/30 rounded-lg" />
      </div>
      <div className="mt-4 h-3.5 w-96 bg-border/30 rounded" />
    </div>
  );
}

export default function ProjectDetailsView() {
  const params = useParams();
  const projectId = params.projectId;
  const navigate = useNavigate();
  const location = useLocation();

  const showModal = new URLSearchParams(location.search).get("newTask") === "true";
  const editTaskId = new URLSearchParams(location.search).get("editTask");
  const deleteTaskId = new URLSearchParams(location.search).get("deleteTask");
  const viewTaskId = new URLSearchParams(location.search).get("viewTask");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId!),
    retry: false,
  });

  useEffect(() => {
    if (isError) navigate("/404");
  }, [isError, navigate]);

  const clientInitials = data?.clientName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const openModal = () => navigate(`?newTask=true`);
  const closeModal = () => navigate(location.pathname, { replace: true });

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 pt-8 min-h-screen">
      {/* Page header */}
      <div className="pb-0">
        {isLoading && <HeaderSkeleton />}

        {data && (
          <>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-secondary hover:text-dark transition-colors group text-xs mb-5"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              Proyectos
            </Link>

            <div className="flex items-start justify-between gap-4">
              {/* Left: icon + name + client */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Folder className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-dark leading-tight truncate">
                    {data.projectName}
                  </h1>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
                      {clientInitials}
                    </div>
                    <span className="text-xs text-secondary">{data.clientName}</span>
                  </div>
                </div>
              </div>

              {/* Right: edit button */}
              <Link
                to={`/projects/${data._id}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 text-xs font-medium text-secondary hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-150 flex-shrink-0"
              >
                <Pencil className="w-3 h-3" />
                Editar
              </Link>
            </div>

            {/* Description */}
            <p className="mt-3 text-sm text-secondary leading-relaxed line-clamp-2 max-w-2xl pl-[52px]">
              {data.description}
            </p>
          </>
        )}
      </div>

      {/* Nav tabs + add button */}
      <div className="mt-5 flex items-center justify-between border-b border-border/60">
        <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary border-b-2 border-primary -mb-px">
          <ListTodo className="w-3.5 h-3.5" />
          Tareas
        </button>

        <button
          onClick={openModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-active transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar Tarea
        </button>
      </div>

      {data?.tasks && <TasksList tasks={data.tasks} />}

      {showModal && <AddTaskModal projectId={projectId!} onClose={closeModal} />}
      {editTaskId && <EditTaskQuery projectId={projectId!} taskId={editTaskId} />}
      {deleteTaskId && <DeleteTaskModal projectId={projectId!} taskId={deleteTaskId} />}
      {viewTaskId && <ViewTaskQuery projectId={projectId!} taskId={viewTaskId} />}
    </div>
  );
}

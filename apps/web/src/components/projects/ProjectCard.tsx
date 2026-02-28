import { useState } from "react";
import { Link } from "react-router-dom";
import { Folder, Pencil, Trash2, ArrowUpRight, MoreVertical } from "lucide-react";
import type { Project } from "../../types";

type ProjectCardProps = {
  project: Project;
  onDelete: ( projectId: Project['_id']) => void;
};

function ProjectPreview({ description }: { description: string }) {
  const highlights = description.split(" ").slice(0, 12).join(" ");
  const hasMore = description.split(" ").length > 12;

  return (
    <p className="text-secondary text-sm leading-relaxed line-clamp-2">
      {highlights}
      {hasMore && "..."}
    </p>
  );
}

function ProjectMeta({ client }: { client: string }) {
  const initials = client
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white text-xs font-semibold shadow-sm">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-dark truncate">{client}</p>
        <p className="text-xs text-secondary/70">Cliente</p>
      </div>
    </div>
  );
}

function CardGlow() {
  return (
    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent rounded-xl" />
    </div>
  );
}

function CardActions( {project, onDelete} : ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4">
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="p-1.5 rounded-lg bg-surface/80 backdrop-blur-sm border border-border/30 hover:bg-surface hover:border-primary/30 transition-all opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4 text-secondary" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-36 py-1 bg-surface rounded-lg border border-border/40 shadow-lg z-10">
            <Link
              to={`/projects/${project._id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-dark hover:bg-primary/5 transition-colors"
            >
              <Pencil className="w-4 h-4 text-secondary" />
              Editar
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project._id)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectCard({ project, onDelete}: ProjectCardProps) {
  return (
    <div className="group relative bg-surface rounded-xl border border-border/30 hover:border-primary/40 transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
      <CardGlow />
      <CardActions project={project} onDelete={onDelete} />

      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Folder className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-dark truncate group-hover:text-primary transition-colors">
              {project.projectName}
            </h3>
          </div>
        </div>

        <div className="mb-4">
          <ProjectPreview description={project.description} />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <ProjectMeta client={project.clientName} />
          
          <div className="flex items-center gap-1 text-primary/80 text-sm font-medium group-hover:translate-x-0.5 transition-transform">
            <span>Ver</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

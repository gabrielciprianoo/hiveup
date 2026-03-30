import { type Task, taskStatus, type TaskStatus } from "../../types";
import TaskCard from "./TaskCard";

interface TasksByStatus {
  pending: Task[];
  onHold: Task[];
  inProgress: Task[];
  underReview: Task[];
  completed: Task[];
}

const statusLabels: Record<TaskStatus, string> = {
  pending: "Pendientes",
  onHold: "En espera",
  inProgress: "En progreso",
  underReview: "En revisión",
  completed: "Completadas",
};

const statusColors: Record<TaskStatus, string> = {
  pending: "#6B7280",
  onHold: "#EF4444",
  inProgress: "#3B82F6",
  underReview: "#F59E0B",
  completed: "#10B981",
};

const statusOrder: TaskStatus[] = [
  taskStatus.IN_PROGRESS,
  taskStatus.UNDER_REVIEW,
  taskStatus.PENDING,
  taskStatus.ON_HOLD,
  taskStatus.COMPLETED,
];

interface TasksListProps {
  tasks: Task[];
}

export default function TasksList({ tasks }: TasksListProps) {
  const groupedTasks = tasks.reduce<TasksByStatus>(
    (acc, task) => {
      const status = task.status as TaskStatus;
      if (acc[status]) {
        acc[status].push(task);
      }
      return acc;
    },
    {
      pending: [],
      onHold: [],
      inProgress: [],
      underReview: [],
      completed: [],
    }
  );

  const hasTasks = tasks.length > 0;

  if (!hasTasks) {
    return (
      <div className="py-12 text-center text-secondary text-sm">
        No hay tareas todavía
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto pb-4 -mx-4 px-4">
      <div className="flex gap-4 min-w-max">
        {statusOrder.map((status) => {
          const tasksForStatus = groupedTasks[status];
          if (tasksForStatus.length === 0) return null;

          return (
            <div
              key={status}
              className="w-72 flex-shrink-0"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: statusColors[status] }}
                />
                <h3 className="text-xs font-medium text-secondary uppercase tracking-wider">
                  {statusLabels[status]} ({tasksForStatus.length})
                </h3>
              </div>
              <div className="space-y-2">
                {tasksForStatus.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    statusColor={statusColors[status]}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

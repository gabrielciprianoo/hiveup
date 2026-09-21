import { array, object, string, type InferOutput } from "valibot";

/* Projects */
export const projectSchema = object({
  _id: string(),
  projectName: string(),
  clientName: string(),
  description: string(),
});

export const ProjectsSchema = array(projectSchema);

export type Project = InferOutput<typeof projectSchema>;
export type ProjectFormData = Pick<
  Project,
  "projectName" | "clientName" | "description"
>;

/* Tasks */
export const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed",
} as const;

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export const taskSchema = object({
  _id: string(),
  name: string(),
  description: string(),
  project: string(),
  status: string(),
  createdAt: string(),
  updatedAt: string(),
});

export type Task = InferOutput<typeof taskSchema>;
export type TaskFormData = Pick<Task, "name" | "description">;

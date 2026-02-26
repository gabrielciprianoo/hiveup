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

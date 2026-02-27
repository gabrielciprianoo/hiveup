import { isAxiosError } from "axios";
import api from "../lib/axios";
import {
  projectSchema,
  ProjectsSchema,
  type Project,
  type ProjectFormData,
} from "../types";
import { safeParse } from "valibot";

export type CreateProjectResponse = {
  success: boolean;
  data?: ProjectFormData;
  error?: string;
};

export async function createProject(formData: ProjectFormData) {
  try {
    const { data } = await api.post("/projects", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
export async function getProjects() {
  try {
    const { data } = await api.get("/projects");
    const response = safeParse(ProjectsSchema, data);

    if (response.success) {
      return response.output;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjectById(projectId: Project["_id"]) {
  try {
    const { data } = await api.get(`/projects/${projectId}`);
    const response = safeParse(projectSchema, data);

    if (response.success) {
      return response.output;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

type updateProjectAPI = {
  projectId: Project["_id"];
  formData: ProjectFormData;
};
export async function updateProject({ projectId, formData }: updateProjectAPI) {
  try {
    const { data } = await api.put<string>(`/projects/${projectId}`, formData);
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

import api from "../lib/axios";
import type { ProjectFormData } from "../types";

export type CreateProjectResponse = {
  success: boolean;
  data?: ProjectFormData;
  error?: string;
};

export async function createProject(formData: ProjectFormData): Promise<CreateProjectResponse> {
  try {
    const { data } = await api.post("/projects", formData);
    return { success: true, data };
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { errors?: string[] } } };
    const errorMessage = axiosError.response?.data?.errors?.[0] 
      ?? "Error al crear el proyecto";
    return { success: false, error: errorMessage };
  }
}

import { isAxiosError } from "axios";
import api from "../lib/axios";
import type { ProjectFormData } from "../types";

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

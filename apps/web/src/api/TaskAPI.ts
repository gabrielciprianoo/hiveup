import { isAxiosError } from "axios";
import api from "../lib/axios";
import { type Task, type TaskFormData } from "../types";

export type TaskAPI = {
  projectId: Task["_id"];
  formData: TaskFormData;
};

export async function createTask({ projectId, formData }: TaskAPI) {
  try {
    const { data } = await api.post<Task>(
      `/projects/${projectId}/tasks`,
      formData,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getTasks(projectId: string) {
  try {
    const { data } = await api.get(`/projects/${projectId}/tasks`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

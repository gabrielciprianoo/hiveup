import { isAxiosError } from "axios";
import api from "../lib/axios";
import { type Task, type TaskFormData, type TaskStatus } from "../types";

export type TaskAPIParams = {
  projectId: Task["_id"];
  taskId: Task["_id"];
  formData: TaskFormData;
  status: TaskStatus;
};

export async function createTask({
  projectId,
  formData,
}: Pick<TaskAPIParams, "projectId" | "formData">) {
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

export async function getTaskById({
  projectId,
  taskId,
}: Pick<TaskAPIParams, "projectId" | "taskId">) {
  try {
    const { data } = await api.get<Task>(
      `/projects/${projectId}/tasks/${taskId}`,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function updateTask({
  projectId,
  taskId,
  formData,
}: Pick<TaskAPIParams, "projectId" | "taskId" | "formData">) {
  try {
    const { data } = await api.put<string>(
      `/projects/${projectId}/tasks/${taskId}`,
      formData,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function updateTaskStatus({
  projectId,
  taskId,
  status,
}: Pick<TaskAPIParams, "projectId" | "taskId" | "status">) {
  try {
    const { data } = await api.post<string>(
      `/projects/${projectId}/tasks/${taskId}/status`,
      { status },
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function deleteTask({
  projectId,
  taskId,
}: Pick<TaskAPIParams, "projectId" | "taskId">) {
  try {
    const { data } = await api.delete<string>(
      `/projects/${projectId}/tasks/${taskId}`,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

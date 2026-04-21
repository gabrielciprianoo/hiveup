import { isAxiosError } from "axios";
import api from "../lib/axios";
import type {
  ConfirmAccountFormData,
  LoginFormData,
  RegisterUserFormData,
  RequestCodeFormData,
} from "../types/auth";

function handleAxiosError(error: unknown): never {
  if (isAxiosError(error) && error.response) {
    throw new Error(error.response.data.error);
  }
  throw new Error("Error inesperado");
}

export async function CreateAccount(formData: RegisterUserFormData) {
  try {
    const { data } = await api.post<{ message: string }>(
      "/auth/create-account",
      formData,
    );
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function ConfirmAccount(formData: ConfirmAccountFormData) {
  try {
    const { data } = await api.post<{ message: string }>(
      "/auth/confirm-account",
      formData,
    );
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function RequestConfirmationCode(formData: RequestCodeFormData) {
  try {
    const { data } = await api.post<{ message: string }>(
      "/auth/request-confirmation-code",
      formData,
    );
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}
export async function AutenticateUser(formData: LoginFormData) {
  try {
    const { data } = await api.post<{ message: string }>(
      "/auth/login",
      formData,
    );
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
}

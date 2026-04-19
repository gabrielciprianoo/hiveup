import { object, string, pick, type InferOutput } from "valibot";

export const authSchema = object({
  name: string(),
  email: string(),
  password: string(),
  confirm_password: string(),
});

export const loginSchema = pick(authSchema, ["email", "password"]);
export const registerSchema = pick(authSchema, ["name", "email", "password", "confirm_password"]);

export type LoginFormData = InferOutput<typeof loginSchema>;
export type RegisterFormData = InferOutput<typeof registerSchema>;

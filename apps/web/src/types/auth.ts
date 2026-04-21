import { object, string, pick, type InferOutput } from "valibot";

export const authSchema = object({
  name: string(),
  email: string(),
  password: string(),
  token: string(),
});

export const loginSchema = pick(authSchema, ["email", "password"]);
export const registerSchema = pick(authSchema, ["name", "email", "password"]);
export const confirmAccountSchema = pick(authSchema, ["token"]);
export const requestCodeSchema = pick(authSchema, ["email"]);

export type LoginFormData = InferOutput<typeof loginSchema>;
export type RegisterUserFormData = InferOutput<typeof registerSchema> & {
  confirm_password: string;
};
export type ConfirmAccountFormData = InferOutput<typeof confirmAccountSchema>;
export type RequestCodeFormData = InferOutput<typeof requestCodeSchema>;

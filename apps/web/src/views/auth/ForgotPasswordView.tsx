import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { ErrorMessage } from "../../components";
import type { ForgotPasswordFormData } from "../../types/auth";
import { useMutation } from "@tanstack/react-query";
import { ForgotPassword } from "../../api/AuthAPI";
import { toastError, toastSuccess } from "../../lib/toast-helpers";

const inputClasses = `
  w-full px-3 py-3 bg-background border border-border rounded-lg
  text-dark placeholder:text-secondary/60 text-base
  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
  transition-all duration-150
`;

export default function ForgotPasswordView() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const { mutate, isPending } = useMutation({
    mutationFn: ForgotPassword,
    onError: (error) => toastError("Error", error.message),
    onSuccess: (data) => {
      toastSuccess("Código enviado", data!.message);
      navigate("/new-password");
    },
  });

  const handleFormSubmit = (data: ForgotPasswordFormData) => mutate(data);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Olvidé mi contraseña</h1>
        <p className="text-secondary mt-1">
          Ingresa tu email y te enviaremos un código para restablecer tu contraseña
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="email"
            className="flex items-center gap-2 text-sm font-medium text-dark mb-2"
          >
            <Mail className="w-4 h-4 text-primary" />
            Email
          </label>
          <input
            id="email"
            type="email"
            className={inputClasses}
            placeholder="tu@email.com"
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "El email no es válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-active transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Enviando código..." : "Enviar código"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-secondary">
        ¿Recordaste tu contraseña?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

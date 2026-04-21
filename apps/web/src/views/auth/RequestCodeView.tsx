import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage } from "../../components";
import type { RequestCodeFormData } from "../../types/auth";
import { RequestConfirmationCode } from "../../api/AuthAPI";
import { toastError, toastSuccess } from "../../lib/toast-helpers";

const inputClasses = `
  w-full px-3 py-3 bg-background border border-border rounded-lg
  text-dark placeholder:text-secondary/60 text-base
  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
  transition-all duration-150
`;

export default function RequestCodeView() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RequestCodeFormData>();

  const { mutate, isPending } = useMutation({
    mutationFn: RequestConfirmationCode,
    onError: (error) => toastError("Error", error.message),
    onSuccess: () => {
      toastSuccess("Código enviado", "Revisa tu bandeja de entrada");
      navigate("/confirm-account", { state: { email: getValues("email") } });
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Reenviar código</h1>
        <p className="text-secondary mt-1">
          Ingresa tu email y te enviaremos un nuevo código de confirmación.
        </p>
      </div>

      <form
        onSubmit={handleSubmit((data) => mutate(data))}
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
          {isPending ? "Enviando..." : "Enviar código"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-secondary">
        ¿Ya confirmaste tu cuenta?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Inicia sesión
        </Link>
      </p>

      <p className="mt-2 text-center text-sm text-secondary">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}

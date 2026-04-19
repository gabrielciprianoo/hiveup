import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ErrorMessage } from "../../components";
import type { LoginFormData } from "../../types/auth";

const inputClasses = `
  w-full px-3 py-3 bg-background border border-border rounded-lg
  text-dark placeholder:text-secondary/60 text-base
  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
  transition-all duration-150
`;

export default function LoginView() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const handleFormSubmit = (data: LoginFormData) => console.log(data);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Iniciar sesión</h1>
        <p className="text-secondary mt-1">Accede a tu cuenta para continuar</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-5">
        <div>
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-dark mb-2">
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
              pattern: { value: /\S+@\S+\.\S+/, message: "El email no es válido" },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <div>
          <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-dark mb-2">
            <Lock className="w-4 h-4 text-primary" />
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`${inputClasses} pr-11`}
              placeholder="••••••••"
              {...register("password", { required: "La contraseña es obligatoria" })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-dark transition-colors cursor-pointer"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-active transition-colors cursor-pointer"
        >
          Iniciar sesión
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-secondary">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}

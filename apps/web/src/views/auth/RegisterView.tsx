import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ErrorMessage } from "../../components";
import type { RegisterFormData } from "../../types/auth";

const inputClasses = `
  w-full px-3 py-3 bg-background border border-border rounded-lg
  text-dark placeholder:text-secondary/60 text-base
  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
  transition-all duration-150 
`;

export default function RegisterView() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const handleFormSubmit = (data: RegisterFormData) => console.log(data);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Crear cuenta</h1>
        <p className="text-secondary mt-1">Únete y empieza a organizar tus proyectos</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-5">
        <div>
          <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-dark mb-2">
            <User className="w-4 h-4 text-primary" />
            Nombre
          </label>
          <input
            id="name"
            type="text"
            className={inputClasses}
            placeholder="Tu nombre completo"
            {...register("name", {
              required: "El nombre es obligatorio",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
            })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

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
              placeholder="Mínimo 8 caracteres"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 8, message: "Mínimo 8 caracteres" },
              })}
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

        <div>
          <label htmlFor="confirm_password" className="flex items-center gap-2 text-sm font-medium text-dark mb-2">
            <Lock className="w-4 h-4 text-primary" />
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              id="confirm_password"
              type={showConfirm ? "text" : "password"}
              className={`${inputClasses} pr-11`}
              placeholder="Repite tu contraseña"
              {...register("confirm_password", {
                required: "Confirma tu contraseña",
                validate: (value) => value === watch("password") || "Las contraseñas no coinciden",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-dark transition-colors cursor-pointer"
              aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirm_password && <ErrorMessage>{errors.confirm_password.message}</ErrorMessage>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-active transition-colors cursor-pointer"
        >
          Crear cuenta
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-secondary">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

import { useState } from "react";
import { ChakraProvider, createSystem, defaultConfig, PinInput } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { ErrorMessage } from "../../components";
import type { ResetPasswordFormData } from "../../types/auth";
import { useMutation } from "@tanstack/react-query";
import { ValidateToken, ResetPassword } from "../../api/AuthAPI";
import { toastError, toastSuccess } from "../../lib/toast-helpers";

const noResetSystem = createSystem(defaultConfig, { preflight: false });

const pinInputClasses =
  "w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold " +
  "bg-background border border-border rounded-lg text-dark " +
  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150";

const inputClasses = `
  w-full px-3 py-3 bg-background border border-border rounded-lg
  text-dark placeholder:text-secondary/60 text-base
  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
  transition-all duration-150
`;

export default function NewPasswordView() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const { mutate: validateToken, isPending: isValidating } = useMutation({
    mutationFn: ValidateToken,
    onError: (error) => toastError("Token inválido", error.message),
    onSuccess: () => {setTokenValid(true); toastSuccess("Token válido", "Puedes ingresar tu nueva contraseña") },
  });

  const { mutate: resetPassword, isPending: isResetting } = useMutation({
    mutationFn: ResetPassword,
    onError: (error) => toastError("Error", error.message),
    onSuccess: (data) => {
      toastSuccess("Contraseña restablecida", data!.message);
      navigate("/login");
    },
  });

  const handleFormSubmit = (data: ResetPasswordFormData) => {
    resetPassword({ ...data, token });
  };

  return (
    <ChakraProvider value={noResetSystem}>
      <div>
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            {tokenValid ? (
              <KeyRound className="w-7 h-7 text-primary" />
            ) : (
              <Mail className="w-7 h-7 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-dark">
            {tokenValid ? "Nueva contraseña" : "Código de verificación"}
          </h1>
          <p className="text-secondary mt-2 text-sm leading-relaxed max-w-xs">
            {tokenValid
              ? "Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta"
              : "Ingresa el código de 6 dígitos que enviamos a tu email"}
          </p>
        </div>

        {!tokenValid ? (
          <>
            <PinInput.Root
              unstyled
              onValueComplete={(e) => {
                setToken(e.valueAsString);
                validateToken({ token: e.valueAsString });
              }}
            >
              <PinInput.Control className="flex justify-center gap-2 sm:gap-3 mb-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PinInput.Input key={i} index={i} className={pinInputClasses} />
                ))}
              </PinInput.Control>
            </PinInput.Root>

            {isValidating && (
              <div className="flex items-center justify-center gap-2 text-sm text-secondary mb-6">
                <span className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                Verificando código...
              </div>
            )}

            <div className="mt-2 pt-6 border-t border-border text-center text-sm text-secondary space-y-2">
              <p>¿No recibiste el código?</p>
              <Link
                to="/forgot-password"
                className="text-primary font-medium hover:underline"
              >
                Solicitar nuevo código
              </Link>
            </div>
          </>
        ) : (
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            noValidate
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-medium text-dark mb-2"
              >
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`${inputClasses} pr-11`}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 8,
                      message: "La contraseña debe tener al menos 8 caracteres",
                    },
                    pattern: {
                      value: /^\S+$/,
                      message: "La contraseña no puede contener espacios",
                    },
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
              {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="flex items-center gap-2 text-sm font-medium text-dark mb-2"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  className={`${inputClasses} pr-11`}
                  placeholder="••••••••"
                  {...register("confirm_password", {
                    required: "Confirma tu contraseña",
                    validate: (value) =>
                      value === watch("password") || "Las contraseñas no coinciden",
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
              {errors.confirm_password && (
                <ErrorMessage>{errors.confirm_password.message}</ErrorMessage>
              )}
            </div>

            <button
              type="submit"
              disabled={isResetting}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-active transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isResetting ? "Guardando..." : "Restablecer contraseña"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-secondary">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </ChakraProvider>
  );
}

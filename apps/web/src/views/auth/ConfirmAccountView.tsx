import { ChakraProvider, createSystem, defaultConfig, PinInput } from "@chakra-ui/react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { ConfirmAccount } from "../../api/AuthAPI";
import { toastError, toastSuccess } from "../../lib/toast-helpers";

const noResetSystem = createSystem(defaultConfig, { preflight: false });

const pinInputClasses =
  "w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold " +
  "bg-background border border-border rounded-lg text-dark " +
  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150";

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain || user.length < 2) return email;
  return `${user[0]}${"*".repeat(Math.max(user.length - 2, 2))}${user.slice(-1)}@${domain}`;
}

export default function ConfirmAccountView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");
  const email: string = location.state?.email ?? (ref ? atob(ref) : "");

  const { mutate: confirmAccount, isPending: isConfirming } = useMutation({
    mutationFn: ConfirmAccount,
    onError: (error) => toastError("Token inválido", error.message),
    onSuccess: () => {
      toastSuccess("Cuenta confirmada", "Ya puedes iniciar sesión");
      navigate("/login");
    },
  });


  return (
    <ChakraProvider value={noResetSystem}>
      <div>
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-dark">Confirma tu cuenta</h1>
          <p className="text-secondary mt-2 text-sm leading-relaxed max-w-xs">
            Enviamos un código de 6 dígitos a{" "}
            {email ? (
              <span className="text-dark font-medium">{maskEmail(email)}</span>
            ) : (
              "tu email"
            )}
            . Ingrésalo a continuación.
          </p>
        </div>

        <PinInput.Root
          unstyled
          onValueComplete={(e) => confirmAccount({ token: e.valueAsString })}
        >
          <PinInput.Control className="flex justify-center gap-2 sm:gap-3 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <PinInput.Input key={i} index={i} className={pinInputClasses} />
            ))}
          </PinInput.Control>
        </PinInput.Root>

        {isConfirming && (
          <div className="flex items-center justify-center gap-2 text-sm text-secondary mb-6">
            <span className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            Verificando código...
          </div>
        )}

        <div className="mt-2 pt-6 border-t border-border text-center text-sm text-secondary space-y-2">
          <p>¿No recibiste el código?</p>
          <Link
            to="/request-code"
            className="text-primary font-medium hover:underline"
          >
            Solicitar nuevo código
          </Link>
        </div>

        <p className="mt-4 text-center text-sm text-secondary">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </ChakraProvider>
  );
}

import { Link } from "react-router-dom";
import { X, Settings, User, LogOut } from "lucide-react";
import { NAV_ITEMS } from "./constants";
import { useActivePath } from "../../hooks/useActivePath";

interface MobileMenuProps {
  isOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

export function MobileMenu({ isOpen, menuRef, onClose }: MobileMenuProps) {
  const { isActive } = useActivePath();

  return (
    <>
      <div
        className={`fixed inset-0 bg-dark/20 backdrop-blur-sm z-40 transition-opacity duration-200 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        ref={menuRef}
        className={`fixed top-0 right-0 bottom-0 w-80 bg-surface z-50 shadow-2xl transform transition-transform duration-200 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-border/60">
            <img src="/logo_hiveup.svg" alt="HiveUp" className="h-7 w-auto" />
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-secondary hover:text-dark hover:bg-secondary/5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              <p className="px-3 py-2 text-xs font-semibold text-secondary uppercase tracking-wider">
                Navegacion
              </p>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                      isActive(item.to)
                        ? "bg-primary/10 text-primary"
                        : "text-secondary hover:bg-secondary/5 hover:text-dark"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 space-y-1">
              <p className="px-3 py-2 text-xs font-semibold text-secondary uppercase tracking-wider">
                Configuracion
              </p>
              <Link
                to="/ajustes"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-secondary hover:bg-secondary/5 hover:text-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Ajustes</span>
              </Link>
              <Link
                to="/perfil"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-secondary hover:bg-secondary/5 hover:text-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Mi Perfil</span>
              </Link>
            </div>
          </nav>

          <div className="p-4 border-t border-border/60">
            <button
              onClick={onClose}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesion</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

import { memo } from "react";
import { Link } from "react-router-dom";
import { Settings, User, Menu, X } from "lucide-react";
import { NAV_ITEMS, type NavItem } from "./constants";
import { useActivePath } from "../../hooks/useActivePath";

interface NavItemButtonProps {
  item: NavItem;
  isActive: boolean;
}

const NavItemButton = memo(function NavItemButton({ item, isActive }: NavItemButtonProps) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
        isActive ? "text-primary" : "text-secondary hover:text-dark"
      }`}
    >
      {isActive && <span className="absolute inset-0 bg-white rounded-lg shadow-sm" />}
      <Icon className="w-4 h-4 relative z-10" />
      <span className="relative z-10">{item.label}</span>
    </Link>
  );
});

interface HeaderProps {
  scrolled: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
}

export function Header({ scrolled, menuOpen, onToggleMenu }: HeaderProps) {
  const { isActive } = useActivePath();

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-surface/95 backdrop-blur-xl shadow-sm" : "bg-transparent"
      }`}
    >
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            <img src="/logo_hiveup.svg" alt="HiveUp" className="h-9 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-1 p-1 bg-secondary/[0.03] rounded-xl">
            {NAV_ITEMS.map((item) => (
              <NavItemButton key={item.to} item={item} isActive={isActive(item.to)} />
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/settings"
              className="p-2 rounded-lg text-secondary hover:text-dark hover:bg-secondary/5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              title="Ajustes"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <Link
              to="/profile"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 text-dark text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <User className="w-4 h-4 text-secondary group-hover:text-primary transition-colors duration-150" />
              <span>Cuenta</span>
            </Link>
          </div>

          <button
            onClick={onToggleMenu}
            className={`md:hidden p-2 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
              menuOpen ? "bg-primary text-white" : "text-dark hover:bg-secondary/5"
            }`}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}

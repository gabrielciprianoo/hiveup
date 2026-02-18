import { Outlet } from "react-router-dom";
import { useScrollState } from "../hooks/useScrollState";
import { useMenuState } from "../hooks/useMenuState";
import { Footer, Header, MobileMenu } from "../components";

export default function AppLayout() {
  const scrolled = useScrollState();
  const { menuOpen, menuRef, toggleMenu, closeMenu } = useMenuState();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, #FAFAF9 50%, rgba(249, 115, 22, 0.05) 100%)",
        }}
      />

      <Header
        scrolled={scrolled}
        menuOpen={menuOpen}
        onToggleMenu={toggleMenu}
      />

      <MobileMenu isOpen={menuOpen} menuRef={menuRef} onClose={closeMenu} />

      <main className="flex-1 relative">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

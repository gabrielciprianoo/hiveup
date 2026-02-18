export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/logo_hiveup.svg" alt="HiveUp" className="h-5 w-auto opacity-60" />

          <p className="text-secondary text-sm">
            &copy; {new Date().getFullYear()} HiveUp, Todos Los Derechos Reservados.
          </p>

          <a
            href="https://gabrielcipriano.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-secondary"
          >
            Created By <span className="hover:text-primary transition-colors duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">Gabriel Cipriano</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

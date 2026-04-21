import { Link, Outlet } from "react-router-dom";
import { Layers, Users, TrendingUp } from "lucide-react";

const FEATURES = [
  { icon: Layers, label: "Gestiona proyectos y visualiza el progreso en un solo lugar." },
  { icon: Users, label: "Colabora con tu equipo sin fricciones." },
  { icon: TrendingUp, label: "Impulsa tus ideas desde el concepto hasta la ejecución." },
];

function HeroPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-primary/10 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-primary/8 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10">
        <Link to="/" className="text-2xl font-bold tracking-tight text-white">
          Hive<span className="text-primary">Up</span>
        </Link>
      </div>

      <div className="relative z-10 space-y-8">
        <div>
          <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
            Organiza tu trabajo,<br />
            <span className="text-primary">amplifica tu impacto.</span>
          </h2>
          <p className="mt-4 text-white/60 text-lg leading-relaxed">
            La plataforma que conecta equipos con sus objetivos.
          </p>
        </div>

        <ul className="space-y-4">
          {FEATURES.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-white/70 leading-relaxed">{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-10 text-white/30 text-sm">© {new Date().getFullYear()} HiveUp</p>
    </div>
  );
}

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <HeroPanel />
      <div className="flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="text-2xl font-bold tracking-tight text-dark">
              Hive<span className="text-primary">Up</span>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

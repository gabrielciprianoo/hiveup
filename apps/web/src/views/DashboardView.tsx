import { memo } from "react";
import { Link } from "react-router-dom";
import { Plus, Layers, Users, TrendingUp, type LucideIcon } from "lucide-react";
import { useUser } from "../contexts";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Layers,
    title: "Gestiona",
    description: "Organiza proyectos y visualiza el progreso en un solo lugar.",
  },
  {
    icon: Users,
    title: "Colabora",
    description: "Trabaja en equipo sin fricciones y construye junto a otros.",
  },
  {
    icon: TrendingUp,
    title: "Crece",
    description: "Impulsa tus ideas desde el concepto hasta la ejecucion.",
  },
];

const FeatureCard = memo(function FeatureCard({
  feature,
}: {
  feature: Feature;
}) {
  const Icon = feature.icon;
  return (
    <div className="group p-8 lg:p-10 bg-surface rounded-xl border border-border/40 hover:border-primary/30 transition-colors duration-150">
      <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-dark mb-3">{feature.title}</h3>
      <p className="text-secondary leading-relaxed">{feature.description}</p>
    </div>
  );
});

function WelcomeBanner() {
  const { user } = useUser();

  return (
    <div className="text-center mb-20">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg mb-6">
        <span className="w-2 h-2 bg-primary rounded-full" />
        <span className="text-sm font-medium text-primary">
          Bienvenido, {user?.name ?? "Usuario"}
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-bold text-dark tracking-tight leading-none">
        Tu trabajo, <span className="text-primary">organizado.</span>
      </h1>

      <p className="mt-6 text-lg sm:text-xl text-secondary leading-relaxed max-w-2xl mx-auto">
        Gestiona proyectos, colabora con tu equipo e impulsa tus ideas hacia
        resultados extraordinarios.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/projects/create"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-active transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo proyecto
        </Link>
        <Link
          to="/proyectos"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface text-dark rounded-lg font-medium border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Ver proyectos
        </Link>
      </div>
    </div>
  );
}

function FeatureGrid() {
  return (
    <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {FEATURES.map((feature) => (
        <FeatureCard key={feature.title} feature={feature} />
      ))}
    </div>
  );
}

function Background() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-background to-primary/[0.05]" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/[0.04] rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/[0.03] rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
    </>
  );
}

export default function DashboardView() {
  return (
    <div className="min-h-[85vh] flex flex-col relative overflow-hidden">
      <Background />

      <div className="flex-1 flex items-center relative z-10">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <WelcomeBanner />
          <FeatureGrid />
        </div>
      </div>
    </div>
  );
}

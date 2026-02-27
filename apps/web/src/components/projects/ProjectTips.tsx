import type { LucideIcon } from "lucide-react";

type Tip = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type ProjectTipsProps = {
  title?: string;
  tips: Tip[];
};

export default function ProjectTips({
  title = "Consejos para tu proyecto",
  tips,
}: ProjectTipsProps) {
  return (
    <div className="order-1 lg:order-2 hidden lg:block pt-16">
      <div className="sticky top-24">
        <h2 className="text-lg font-semibold text-dark mb-6">{title}</h2>
        <div className="space-y-4">
          {tips.map(({ icon: Icon, title: tipTitle, description }) => (
            <div
              key={tipTitle}
              className="flex gap-4 p-4 bg-surface/60 rounded-xl border border-border/40"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-dark text-sm">{tipTitle}</h3>
                <p className="text-secondary text-sm mt-0.5">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

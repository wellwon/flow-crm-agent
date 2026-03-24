import { Activity, TrendingUp, FileCheck } from 'lucide-react';

export function TopToolbar() {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="glass-panel px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-node-active animate-pulse" />
          <h1 className="text-sm font-semibold text-foreground">
            ОБ Коломна — 3× УЗИ Mindray DC-70
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge icon={<TrendingUp className="w-3 h-3" />} label="6.2М ₽" variant="emerald" />
          <Badge icon={<Activity className="w-3 h-3" />} label="67% Win Rate" variant="amber" />
          <Badge icon={<FileCheck className="w-3 h-3" />} label="Тендер 44-ФЗ" variant="blue" />
        </div>
      </div>
    </div>
  );
}

function Badge({
  icon,
  label,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  variant: 'emerald' | 'amber' | 'blue';
}) {
  const variantClasses = {
    emerald: 'bg-node-completed/15 text-node-completed border-node-completed/20',
    amber: 'bg-node-active/15 text-node-active border-node-active/20',
    blue: 'bg-primary/15 text-primary border-primary/20',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
        text-[11px] font-mono font-medium border
        ${variantClasses[variant]}
      `}
    >
      {icon}
      {label}
    </span>
  );
}

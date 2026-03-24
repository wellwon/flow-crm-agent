import { Activity, TrendingUp, FileCheck, LayoutGrid, List, Columns3, GanttChart, Sun, Plus, Layers, BarChart3 } from 'lucide-react';
import type { ViewMode } from '@/types/pipeline';

interface TopToolbarProps {
  activeView?: ViewMode;
  onViewChange?: (view: ViewMode) => void;
  onBriefingOpen?: () => void;
  onTemplateOpen?: () => void;
  phasesVisible?: boolean;
  onTogglePhases?: () => void;
}

const views: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Дашборд', icon: BarChart3 },
  { id: 'graph', label: 'Граф', icon: LayoutGrid },
  { id: 'list', label: 'Список', icon: List },
  { id: 'kanban', label: 'Kanban', icon: Columns3 },
  { id: 'timeline', label: 'Timeline', icon: GanttChart },
];

export function TopToolbar({ activeView = 'graph', onViewChange, onBriefingOpen, onTemplateOpen, phasesVisible = true, onTogglePhases }: TopToolbarProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="glass-panel px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-node-active animate-pulse" />
          <h1 className="text-sm font-semibold text-foreground">
            ОБ Коломна — 3× УЗИ Mindray DC-70
          </h1>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1 bg-background/40 rounded-lg p-0.5">
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => onViewChange?.(v.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                activeView === v.id
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <v.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{v.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onTogglePhases && activeView === 'graph' && (
            <button
              onClick={onTogglePhases}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium border transition-colors ${
                phasesVisible
                  ? 'bg-[hsl(265_80%_65%)/0.15] text-[hsl(265_80%_65%)] border-[hsl(265_80%_65%)/0.2] hover:bg-[hsl(265_80%_65%)/0.25]'
                  : 'bg-muted/30 text-muted-foreground border-border/30 hover:bg-muted/50'
              }`}
            >
              <Layers className="w-3 h-3" />
              Фазы
            </button>
          )}
          {onTemplateOpen && (
            <button
              onClick={onTemplateOpen}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium border bg-primary/15 text-primary border-primary/20 hover:bg-primary/25 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Шаблон
            </button>
          )}
          {onBriefingOpen && (
            <button
              onClick={onBriefingOpen}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium border bg-node-active/15 text-node-active border-node-active/20 hover:bg-node-active/25 transition-colors"
            >
              <Sun className="w-3 h-3" />
              Брифинг
            </button>
          )}
          <Badge icon={<TrendingUp className="w-3 h-3" />} label="6.2М ₽" variant="emerald" />
          <Badge icon={<Activity className="w-3 h-3" />} label="67% Win" variant="amber" />
          <Badge icon={<FileCheck className="w-3 h-3" />} label="44-ФЗ" variant="blue" />
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, label, variant }: { icon: React.ReactNode; label: string; variant: 'emerald' | 'amber' | 'blue' }) {
  const variantClasses = {
    emerald: 'bg-node-completed/15 text-node-completed border-node-completed/20',
    amber: 'bg-node-active/15 text-node-active border-node-active/20',
    blue: 'bg-primary/15 text-primary border-primary/20',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium border ${variantClasses[variant]}`}>
      {icon}{label}
    </span>
  );
}

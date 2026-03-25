import { LayoutGrid, List, Columns3, GanttChart, Sun, Plus, Layers, BarChart3, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="glass-panel-dark px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Назад к сделкам"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-border" />
          <div className="w-2 h-2 rounded-full bg-node-active animate-pulse" />
          <h1 className="text-sm font-semibold text-foreground">
            ОБ Коломна — 3× УЗИ Mindray DC-70
          </h1>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1 bg-muted/30 rounded-[10px] p-0.5 border border-border">
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

        <div className="flex items-center gap-1.5 flex-wrap">
          {onTogglePhases && activeView === 'graph' && (
            <button
              onClick={onTogglePhases}
              className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 overflow-hidden ${
                phasesVisible
                  ? 'text-[hsl(265_80%_75%)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
                phasesVisible
                  ? 'opacity-100 bg-[hsl(265_80%_65%)/0.1] shadow-[inset_0_0_0_1px_hsl(265_80%_65%/0.25),0_0_12px_-4px_hsl(265_80%_65%/0.3)]'
                  : 'opacity-0 group-hover:opacity-100 bg-muted/20 shadow-[inset_0_0_0_1px_hsl(var(--border)/0.2)]'
              }`} />
              <Layers className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Фазы</span>
            </button>
          )}
          {onTemplateOpen && (
            <button
              onClick={onTemplateOpen}
              className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-primary/80 hover:text-primary transition-all duration-200 overflow-hidden"
            >
              <span className="absolute inset-0 rounded-lg bg-primary/5 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.15)] group-hover:bg-primary/10 group-hover:shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.3),0_0_12px_-4px_hsl(var(--primary)/0.25)] transition-all duration-200" />
              <Plus className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Шаблон</span>
            </button>
          )}
          {onBriefingOpen && (
            <button
              onClick={onBriefingOpen}
              className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-node-active/80 hover:text-node-active transition-all duration-200 overflow-hidden"
            >
              <span className="absolute inset-0 rounded-lg bg-node-active/5 shadow-[inset_0_0_0_1px_hsl(38_92%_50%/0.15)] group-hover:bg-node-active/10 group-hover:shadow-[inset_0_0_0_1px_hsl(38_92%_50%/0.3),0_0_12px_-4px_hsl(38_92%_50%/0.25)] transition-all duration-200" />
              <Sun className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Брифинг</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

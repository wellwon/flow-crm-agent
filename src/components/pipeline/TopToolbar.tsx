import { LayoutGrid, List, Columns3, GanttChart, Sun, Plus, Layers, BarChart3, ArrowLeft, FileText } from 'lucide-react';
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
  { id: 'dossier', label: 'Досье', icon: FileText },
  { id: 'dashboard', label: 'Дашборд', icon: BarChart3 },
  { id: 'graph', label: 'Граф', icon: LayoutGrid },
  { id: 'list', label: 'Список', icon: List },
  { id: 'kanban', label: 'Kanban', icon: Columns3 },
  { id: 'timeline', label: 'Timeline', icon: GanttChart },
];

export function TopToolbar({ activeView = 'graph', onViewChange, onBriefingOpen, onTemplateOpen, phasesVisible = true, onTogglePhases }: TopToolbarProps) {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border flex-shrink-0 relative">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-node-active to-primary" />
      <div className="px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-8 h-8 rounded-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
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
        <div className="flex items-center gap-0.5 bg-muted/30 p-1 rounded-[10px] border border-border">
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => onViewChange?.(v.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-all ${
                activeView === v.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/10 active:bg-primary/20'
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all ${
                phasesVisible
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Фазы</span>
            </button>
          )}
          {onTemplateOpen && (
            <button
              onClick={onTemplateOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Шаблон</span>
            </button>
          )}
          {onBriefingOpen && (
            <button
              onClick={onBriefingOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-medium text-node-active hover:bg-node-active/10 transition-all"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Брифинг</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

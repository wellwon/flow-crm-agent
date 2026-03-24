import { useState, useCallback, DragEvent } from 'react';
import {
  Play, Users, Phone, Mail, FileText, Search, Calculator, Truck,
  CheckCircle, GitFork, Target, Bot, Activity, Link, BarChart3,
  Timer, GitMerge, Bookmark, Flag, StickyNote, ChevronLeft, ChevronRight,
  MousePointer2, Hand, Trash2, ZoomIn, ZoomOut, Maximize2,
} from 'lucide-react';
import type { NodeType, NodeCategory } from '@/types/pipeline';

export type InteractionMode = 'select' | 'hand';

interface NodePaletteProps {
  onAddNode: (type: NodeType, position: { x: number; y: number }) => void;
  onAddSticky: (color: string, position: { x: number; y: number }) => void;
  interactionMode?: InteractionMode;
  onInteractionModeChange?: (mode: InteractionMode) => void;
  onDeleteSelected?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  hasSelection?: boolean;
}

interface PaletteItem {
  type: NodeType | 'sticky';
  label: string;
  icon: React.ElementType;
  category: NodeCategory | 'note';
}

const items: PaletteItem[] = [
  { type: 'meeting', label: 'Встреча', icon: Users, category: 'human_action' },
  { type: 'call', label: 'Звонок', icon: Phone, category: 'human_action' },
  { type: 'email', label: 'Письмо', icon: Mail, category: 'human_action' },
  { type: 'document', label: 'Документ', icon: FileText, category: 'human_action' },
  { type: 'research', label: 'Исследование', icon: Search, category: 'human_action' },
  { type: 'calculation', label: 'Расчёт', icon: Calculator, category: 'human_action' },
  { type: 'logistics', label: 'Логистика', icon: Truck, category: 'human_action' },
  { type: 'approval', label: 'Согласование', icon: CheckCircle, category: 'gate' },
  { type: 'decision-fork', label: 'Развилка', icon: GitFork, category: 'gate' },
  { type: 'milestone', label: 'Milestone', icon: Target, category: 'gate' },
  { type: 'ai-generate', label: 'AI Генерация', icon: Bot, category: 'ai_action' },
  { type: 'ai-monitor', label: 'AI Мониторинг', icon: Activity, category: 'ai_action' },
  { type: 'ai-enrich', label: 'AI Обогащение', icon: Link, category: 'ai_action' },
  { type: 'ai-analyze', label: 'AI Анализ', icon: BarChart3, category: 'ai_action' },
  { type: 'start', label: 'Старт', icon: Play, category: 'system' },
  { type: 'finish', label: 'Финиш', icon: Flag, category: 'system' },
  { type: 'wait', label: 'Ожидание', icon: Timer, category: 'system' },
  { type: 'parallel-split', label: 'Split', icon: GitFork, category: 'system' },
  { type: 'parallel-join', label: 'Join', icon: GitMerge, category: 'system' },
  { type: 'bookmark', label: 'Заметка', icon: Bookmark, category: 'system' },
  { type: 'sticky' as any, label: 'Стикер', icon: StickyNote, category: 'note' },
];

const categoryColors: Record<string, string> = {
  human_action: 'text-primary',
  gate: 'text-node-active',
  ai_action: 'text-[hsl(265_80%_65%)]',
  system: 'text-muted-foreground',
  note: 'text-[hsl(48_80%_55%)]',
};

const categoryLabels: Record<string, string> = {
  human_action: 'ДЕЙСТВИЯ',
  gate: 'ШЛЮЗЫ',
  ai_action: 'AI AGENT',
  system: 'СИСТЕМА',
  note: 'ЗАМЕТКИ',
};

export function NodePalette({
  onAddNode, onAddSticky,
  interactionMode = 'select', onInteractionModeChange,
  onDeleteSelected, onZoomIn, onZoomOut, onFitView,
  hasSelection = false,
}: NodePaletteProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleDragStart = useCallback((e: DragEvent, item: PaletteItem) => {
    e.dataTransfer.setData('application/reactflow-type', item.type);
    e.dataTransfer.setData('application/reactflow-label', item.label);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const groups = ['human_action', 'gate', 'ai_action', 'system', 'note'] as const;

  const toolBtn = (active: boolean, onClick: () => void, icon: React.ElementType, label: string, danger = false) => {
    const Icon = icon;
    return (
      <button
        key={label}
        onClick={onClick}
        title={label}
        className={`flex items-center justify-center w-full py-2 rounded-lg transition-all ${
          active
            ? 'bg-primary/20 text-primary'
            : danger
              ? 'text-node-error/60 hover:bg-node-error/10 hover:text-node-error'
              : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
        }`}
      >
        <Icon className="w-4 h-4" />
        {!collapsed && <span className="ml-2 text-[10px]">{label}</span>}
      </button>
    );
  };

  return (
    <div className={`absolute left-4 top-[84px] bottom-4 z-10 transition-all duration-300 ${collapsed ? 'w-10' : 'w-[160px]'}`}>
      <div className="h-full glass-panel-dense overflow-hidden flex flex-col">
        {/* Toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="p-2 flex items-center justify-center hover:bg-muted/30 transition-colors border-b border-border/30"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>

        {/* Interaction tools */}
        <div className="px-1.5 py-2 border-b border-border/30 space-y-0.5">
          {!collapsed && (
            <span className="text-[8px] font-mono uppercase tracking-[0.15em] px-1.5 mb-1 block text-muted-foreground">
              ИНСТРУМЕНТЫ
            </span>
          )}
          {toolBtn(
            interactionMode === 'select', () => onInteractionModeChange?.('select'),
            MousePointer2, 'Выделение',
          )}
          {toolBtn(
            interactionMode === 'hand', () => onInteractionModeChange?.('hand'),
            Hand, 'Рука',
          )}

          <div className="flex gap-0.5">
            <button
              onClick={onZoomIn}
              title="Приблизить"
              className="flex-1 flex items-center justify-center py-1.5 rounded-lg text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-all"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onZoomOut}
              title="Отдалить"
              className="flex-1 flex items-center justify-center py-1.5 rounded-lg text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-all"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onFitView}
              title="Вместить всё"
              className="flex-1 flex items-center justify-center py-1.5 rounded-lg text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-all"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {toolBtn(
            false, () => hasSelection && onDeleteSelected?.(),
            Trash2, 'Удалить',
            true,
          )}
        </div>

        {/* Node palette */}
        <div className="flex-1 overflow-y-auto py-2 px-1.5 space-y-3">
          {groups.map(cat => {
            const catItems = items.filter(i => i.category === cat);
            return (
              <div key={cat}>
                {!collapsed && (
                  <span className={`text-[8px] font-mono uppercase tracking-[0.15em] px-1.5 mb-1 block ${categoryColors[cat]}`}>
                    {categoryLabels[cat]}
                  </span>
                )}
                <div className="space-y-0.5">
                  {catItems.map(item => (
                    <div
                      key={item.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-grab active:cursor-grabbing hover:bg-muted/40 transition-colors group"
                      title={item.label}
                    >
                      <item.icon className={`w-3.5 h-3.5 shrink-0 ${categoryColors[item.category]} group-hover:scale-110 transition-transform`} />
                      {!collapsed && (
                        <span className="text-[10px] text-foreground/80 truncate">{item.label}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

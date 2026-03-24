import { memo } from 'react';
import {
  Play, Users, Phone, Mail, FileText, Search, Calculator, Truck,
  CheckCircle, GitFork, Target, Bot, Activity, Link, BarChart3,
  Timer, GitMerge, Bookmark, Flag, Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NodeType, NodeCategory } from '@/types/pipeline';

export interface ContextMenuPosition {
  x: number;
  y: number;
  flowX: number;
  flowY: number;
}

interface CanvasContextMenuProps {
  position: ContextMenuPosition | null;
  onClose: () => void;
  onAddNode: (type: NodeType, position: { x: number; y: number }) => void;
}

const nodeTypeIcon: Record<NodeType, React.ElementType> = {
  start: Play, finish: Flag, meeting: Users, call: Phone, email: Mail,
  document: FileText, research: Search, calculation: Calculator, logistics: Truck,
  approval: CheckCircle, 'decision-fork': GitFork, milestone: Target,
  'ai-generate': Bot, 'ai-monitor': Activity, 'ai-enrich': Link, 'ai-analyze': BarChart3,
  wait: Timer, 'parallel-split': GitFork, 'parallel-join': GitMerge, bookmark: Bookmark,
};

interface NodeTypeEntry { type: NodeType; label: string; }

const categories: { category: NodeCategory; label: string; color: string; items: NodeTypeEntry[] }[] = [
  {
    category: 'human_action', label: 'Действия', color: 'text-primary',
    items: [
      { type: 'meeting', label: 'Встреча' },
      { type: 'call', label: 'Звонок' },
      { type: 'email', label: 'Письмо' },
      { type: 'document', label: 'Документ' },
      { type: 'research', label: 'Исследование' },
      { type: 'calculation', label: 'Расчёт' },
      { type: 'logistics', label: 'Логистика' },
    ],
  },
  {
    category: 'gate', label: 'Шлюзы', color: 'text-node-active',
    items: [
      { type: 'approval', label: 'Согласование' },
      { type: 'decision-fork', label: 'Развилка' },
      { type: 'milestone', label: 'Milestone' },
    ],
  },
  {
    category: 'ai_action', label: 'AI Agent', color: 'text-[hsl(265_80%_65%)]',
    items: [
      { type: 'ai-generate', label: 'AI Генерация' },
      { type: 'ai-monitor', label: 'AI Мониторинг' },
      { type: 'ai-enrich', label: 'AI Обогащение' },
      { type: 'ai-analyze', label: 'AI Анализ' },
    ],
  },
  {
    category: 'system', label: 'Система', color: 'text-muted-foreground',
    items: [
      { type: 'start', label: 'Старт' },
      { type: 'finish', label: 'Финиш' },
      { type: 'wait', label: 'Ожидание' },
      { type: 'parallel-split', label: 'Параллельный старт' },
      { type: 'parallel-join', label: 'Синхронизация' },
      { type: 'bookmark', label: 'Закладка' },
    ],
  },
];

function CanvasContextMenuComponent({ position, onClose, onAddNode }: CanvasContextMenuProps) {
  if (!position) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="ctx-menu"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.12 }}
        className="fixed z-50 glass-panel-dense py-2 w-[240px] max-h-[70vh] overflow-y-auto"
        style={{ left: position.x, top: position.y }}
      >
        <div className="px-3 py-1.5 flex items-center gap-2 border-b border-border/30 mb-1">
          <Plus className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Добавить ноду</span>
        </div>

        {categories.map(cat => (
          <div key={cat.category}>
            <div className="px-3 pt-2 pb-1">
              <span className={`text-[9px] font-mono uppercase tracking-wider ${cat.color}`}>{cat.label}</span>
            </div>
            {cat.items.map(item => {
              const Icon = nodeTypeIcon[item.type];
              return (
                <button
                  key={item.type}
                  onClick={() => {
                    onAddNode(item.type, { x: position.flowX, y: position.flowY });
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left hover:bg-primary/10 transition-colors"
                >
                  <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                  <span className="text-[11px] text-foreground">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </motion.div>

      {/* Backdrop to catch clicks */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
    </AnimatePresence>
  );
}

export const CanvasContextMenu = memo(CanvasContextMenuComponent);

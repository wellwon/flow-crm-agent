import { memo } from 'react';
import {
  Play, Users, Phone, Mail, FileText, Search, Calculator, Truck,
  CheckCircle, GitFork, Target, Bot, Activity, Link, BarChart3,
  Timer, GitMerge, Bookmark, Flag, ArrowRightLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NodeType, NodeCategory } from '@/types/pipeline';

interface EdgeContextMenuProps {
  position: { x: number; y: number } | null;
  edgeId: string | null;
  onClose: () => void;
  onInsertNode: (edgeId: string, type: NodeType) => void;
}

const nodeTypeIcon: Record<NodeType, React.ElementType> = {
  start: Play, finish: Flag, meeting: Users, call: Phone, email: Mail,
  document: FileText, research: Search, calculation: Calculator, logistics: Truck,
  approval: CheckCircle, 'decision-fork': GitFork, milestone: Target,
  'ai-generate': Bot, 'ai-monitor': Activity, 'ai-enrich': Link, 'ai-analyze': BarChart3,
  wait: Timer, 'parallel-split': GitFork, 'parallel-join': GitMerge, bookmark: Bookmark,
};

const quickTypes: { type: NodeType; label: string; cat: NodeCategory }[] = [
  { type: 'approval', label: 'Согласование', cat: 'gate' },
  { type: 'document', label: 'Документ', cat: 'human_action' },
  { type: 'wait', label: 'Ожидание', cat: 'system' },
  { type: 'ai-generate', label: 'AI Генерация', cat: 'ai_action' },
  { type: 'meeting', label: 'Встреча', cat: 'human_action' },
  { type: 'call', label: 'Звонок', cat: 'human_action' },
  { type: 'milestone', label: 'Milestone', cat: 'gate' },
  { type: 'ai-monitor', label: 'AI Мониторинг', cat: 'ai_action' },
];

const catColor: Record<NodeCategory, string> = {
  human_action: 'text-primary',
  gate: 'text-node-active',
  ai_action: 'text-[hsl(265_80%_65%)]',
  system: 'text-muted-foreground',
};

function EdgeContextMenuComponent({ position, edgeId, onClose, onInsertNode }: EdgeContextMenuProps) {
  if (!position || !edgeId) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="edge-ctx"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.12 }}
        className="fixed z-50 glass-panel-dense py-2 w-[220px]"
        style={{ left: position.x, top: position.y }}
      >
        <div className="px-3 py-1.5 flex items-center gap-2 border-b border-border/30 mb-1">
          <ArrowRightLeft className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Вставить между</span>
        </div>

        {quickTypes.map(item => {
          const Icon = nodeTypeIcon[item.type];
          return (
            <button
              key={item.type}
              onClick={() => {
                onInsertNode(edgeId, item.type);
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left hover:bg-primary/10 transition-colors"
            >
              <Icon className={`w-3.5 h-3.5 ${catColor[item.cat]}`} />
              <span className="text-[11px] text-foreground">{item.label}</span>
            </button>
          );
        })}
      </motion.div>

      <div className="fixed inset-0 z-40" onClick={onClose} />
    </AnimatePresence>
  );
}

export const EdgeContextMenu = memo(EdgeContextMenuComponent);

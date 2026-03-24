import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import {
  Play, Users, Brain, GitFork, FileText, CheckCircle, Activity, Search,
  GitMerge, Phone, Mail, Calculator, Truck, Target, Timer, Bookmark,
  Flag, BarChart3, Link, Bot, Paperclip, User,
} from 'lucide-react';
import type { PipelineNodeData, NodeType, NodeStatus, NodeCategory } from '@/types/pipeline';
import { NODE_CATEGORIES } from '@/types/pipeline';

const iconMap: Record<NodeType, React.ElementType> = {
  start: Play, finish: Flag, meeting: Users, call: Phone, email: Mail,
  document: FileText, research: Search, calculation: Calculator, logistics: Truck,
  approval: CheckCircle, 'decision-fork': GitFork, milestone: Target,
  'ai-generate': Bot, 'ai-monitor': Activity, 'ai-enrich': Link, 'ai-analyze': BarChart3,
  wait: Timer, 'parallel-split': GitFork, 'parallel-join': GitMerge, bookmark: Bookmark,
};

const statusStyles: Record<NodeStatus, { border: string; glow: string; bar: string }> = {
  pending: { border: 'border-node-pending/40', glow: '', bar: 'bg-node-pending/40' },
  active: { border: 'border-node-active', glow: 'node-glow-active', bar: 'bg-node-active' },
  completed: { border: 'border-node-completed', glow: 'node-glow-completed', bar: 'bg-node-completed' },
  error: { border: 'border-node-error', glow: 'node-glow-error', bar: 'bg-node-error' },
  waiting: { border: 'border-primary', glow: 'node-glow-waiting', bar: 'bg-primary' },
  skipped: { border: 'border-node-pending/20', glow: '', bar: 'bg-node-pending/20' },
};

const statusLabelMap: Record<NodeStatus, string> = {
  pending: 'Ожидает', active: 'В работе', completed: 'Готово',
  error: 'Проблема', waiting: 'Ожидание', skipped: 'Пропущено',
};

const categoryIconBg: Record<NodeCategory, string> = {
  human_action: 'bg-primary/15', gate: 'bg-node-active/15',
  ai_action: 'bg-[hsl(265_80%_65%)/0.15]', system: 'bg-muted/60',
};

function HoloNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as PipelineNodeData;
  const Icon = iconMap[nodeData.type] || Activity;
  const style = statusStyles[nodeData.status];
  const category = NODE_CATEGORIES[nodeData.type];
  const isAI = category === 'ai_action';
  const docs = (nodeData as any).documents as string[] | undefined;
  const hasAvatar = !!nodeData.assigneeAvatar;

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative w-[220px] rounded-xl border backdrop-blur-md bg-secondary/80
        ${style.border} ${style.glow}
        ${selected ? 'ring-2 ring-primary/50' : ''}
        ${nodeData.status === 'skipped' ? 'opacity-50' : ''}
        cursor-pointer transition-shadow duration-300 group/node
      `}
    >
      <Handle type="target" position={Position.Left} className="!-left-[6px]" />
      <Handle type="source" position={Position.Right} className="!-right-[6px]" />

      {/* Category indicator strip */}
      <div className={`absolute top-0 left-3 right-3 h-[2px] rounded-b ${
        category === 'ai_action' ? 'bg-[hsl(265_80%_65%)]' :
        category === 'gate' ? 'bg-node-active' :
        category === 'human_action' ? 'bg-primary' : 'bg-muted-foreground/30'
      }`} />

      {/* Documents hover bar */}
      {docs && docs.length > 0 && (
        <div className="absolute -top-7 left-0 right-0 opacity-0 group-hover/node:opacity-100 transition-opacity flex gap-1 justify-center">
          {docs.map((doc, i) => (
            <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/90 backdrop-blur border border-border/40 text-[9px] text-foreground/70 cursor-pointer hover:border-primary/40 hover:text-primary transition-colors">
              <Paperclip className="w-2.5 h-2.5" />
              <span className="truncate max-w-[80px]">{doc}</span>
            </div>
          ))}
        </div>
      )}

      <div className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-start gap-2">
          <div className={`p-1.5 rounded-lg shrink-0 ${categoryIconBg[category]}`}>
            <Icon className={`w-4 h-4 ${
              category === 'ai_action' ? 'text-[hsl(265_80%_65%)]' :
              category === 'gate' ? 'text-node-active' :
              category === 'human_action' ? 'text-primary' : 'text-muted-foreground'
            }`} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-semibold text-foreground leading-tight truncate">{nodeData.label}</h3>
            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">{nodeData.summary}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className={`
            text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded
            ${nodeData.status === 'active' ? 'bg-node-active/15 text-node-active' : ''}
            ${nodeData.status === 'completed' ? 'bg-node-completed/15 text-node-completed' : ''}
            ${nodeData.status === 'pending' ? 'bg-muted text-muted-foreground' : ''}
            ${nodeData.status === 'error' ? 'bg-node-error/15 text-node-error' : ''}
            ${nodeData.status === 'waiting' ? 'bg-primary/15 text-primary' : ''}
            ${nodeData.status === 'skipped' ? 'bg-muted/50 text-muted-foreground/50' : ''}
          `}>
            {statusLabelMap[nodeData.status]}
          </span>
          <div className="flex items-center gap-1.5">
            {isAI && (
              <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-[hsl(265_80%_65%)/0.15] text-[hsl(265_80%_65%)]">AI</span>
            )}
            {nodeData.assignee && (
              <div className="flex items-center gap-1">
                {hasAvatar ? (
                  <img src={nodeData.assigneeAvatar} className="w-4 h-4 rounded-full ring-1 ring-border" alt={nodeData.assignee} />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-2.5 h-2.5 text-primary" />
                  </div>
                )}
                <span className="text-[9px] text-muted-foreground truncate max-w-[60px]">{nodeData.assignee}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[3px] w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${nodeData.progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${style.bar}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

export const HoloNode = memo(HoloNodeComponent);

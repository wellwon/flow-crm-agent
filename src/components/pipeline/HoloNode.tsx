import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import {
  Play,
  Users,
  Brain,
  GitFork,
  FileText,
  CheckCircle,
  Activity,
  Search,
  GitMerge,
} from 'lucide-react';
import type { PipelineNodeData, NodeType, NodeStatus } from '@/types/pipeline';

const iconMap: Record<NodeType, React.ElementType> = {
  start: Play,
  meeting: Users,
  'ai-enrich': Brain,
  'parallel-split': GitFork,
  'ai-generate': FileText,
  approval: CheckCircle,
  'ai-monitor': Activity,
  research: Search,
  'parallel-join': GitMerge,
};

const statusStyles: Record<NodeStatus, { border: string; glow: string; bar: string }> = {
  pending: {
    border: 'border-node-pending/40',
    glow: '',
    bar: 'bg-node-pending/40',
  },
  active: {
    border: 'border-node-active',
    glow: 'node-glow-active',
    bar: 'bg-node-active',
  },
  completed: {
    border: 'border-node-completed',
    glow: 'node-glow-completed',
    bar: 'bg-node-completed',
  },
  error: {
    border: 'border-node-error',
    glow: 'node-glow-error',
    bar: 'bg-node-error',
  },
};

const statusLabelMap: Record<NodeStatus, string> = {
  pending: 'Ожидает',
  active: 'В работе',
  completed: 'Готово',
  error: 'Проблема',
};

function HoloNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as PipelineNodeData;
  const Icon = iconMap[nodeData.type] || Activity;
  const style = statusStyles[nodeData.status];

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative w-[220px] rounded-xl border backdrop-blur-md
        bg-secondary/80
        ${style.border} ${style.glow}
        ${selected ? 'ring-2 ring-primary/50' : ''}
        cursor-pointer transition-shadow duration-300
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!-left-[6px]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!-right-[6px]"
      />

      <div className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-start gap-2">
          <div className="p-1.5 rounded-lg bg-background/60 shrink-0">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-semibold text-foreground leading-tight truncate">
              {nodeData.label}
            </h3>
            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">
              {nodeData.summary}
            </p>
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
          `}>
            {statusLabelMap[nodeData.status]}
          </span>
          {nodeData.assignee && (
            <span className="text-[9px] text-muted-foreground truncate max-w-[80px]">
              {nodeData.assignee}
            </span>
          )}
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

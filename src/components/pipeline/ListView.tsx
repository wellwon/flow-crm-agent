import { CheckCircle, Clock, AlertTriangle, Timer, Bot } from 'lucide-react';
import type { PipelineNodeData, NodeStatus } from '@/types/pipeline';
import { NODE_CATEGORIES } from '@/types/pipeline';
import { Node } from '@xyflow/react';

interface ListViewProps {
  nodes: Node<PipelineNodeData>[];
  onNodeSelect: (id: string, data: PipelineNodeData) => void;
}

const statusIcon: Record<NodeStatus, React.ElementType> = {
  completed: CheckCircle, active: Clock, pending: Timer, error: AlertTriangle, waiting: Clock, skipped: Timer,
};
const statusColor: Record<NodeStatus, string> = {
  completed: 'text-node-completed', active: 'text-node-active', pending: 'text-node-pending',
  error: 'text-node-error', waiting: 'text-primary', skipped: 'text-node-pending/50',
};

export function ListView({ nodes, onNodeSelect }: ListViewProps) {
  const phases = ['PRE-SALE', 'BIDDING', 'RESULT', 'EXECUTION', 'POST-SALE'];
  const grouped = phases.map(phase => ({
    phase,
    nodes: nodes.filter(n => (n.data as unknown as PipelineNodeData).phase === phase),
  })).filter(g => g.nodes.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {grouped.map(group => (
        <div key={group.phase}>
          <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary/40" />
            {group.phase}
            <span className="text-muted-foreground/50">({group.nodes.length})</span>
          </h2>
          <div className="space-y-1.5">
            {group.nodes.map(node => {
              const d = node.data as unknown as PipelineNodeData;
              const StatusIcon = statusIcon[d.status];
              const isAI = NODE_CATEGORIES[d.type] === 'ai_action';
              return (
                <div
                  key={node.id}
                  onClick={() => onNodeSelect(node.id, d)}
                  className="flex items-center gap-3 p-3 rounded-[14px] matte-glass cursor-pointer hover:border-primary/20 transition-all group"
                >
                  <StatusIcon className={`w-4 h-4 shrink-0 ${statusColor[d.status]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground truncate">{d.label}</span>
                      {isAI && <Bot className="w-3 h-3 text-[hsl(265_80%_65%)]" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{d.summary}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {d.assignee && <span className="text-[10px] text-muted-foreground">{d.assignee}</span>}
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${
                        d.status === 'completed' ? 'bg-node-completed' :
                        d.status === 'active' ? 'bg-node-active' : 'bg-muted-foreground/30'
                      }`} style={{ width: `${d.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{d.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

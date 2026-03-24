import { Bot } from 'lucide-react';
import type { PipelineNodeData, NodeStatus } from '@/types/pipeline';
import { NODE_CATEGORIES } from '@/types/pipeline';
import { Node } from '@xyflow/react';

interface KanbanViewProps {
  nodes: Node<PipelineNodeData>[];
  onNodeSelect: (id: string, data: PipelineNodeData) => void;
}

const columns: { status: NodeStatus; label: string; color: string }[] = [
  { status: 'pending', label: 'Ожидает', color: 'border-node-pending/40' },
  { status: 'waiting', label: 'Ожидание', color: 'border-primary/40' },
  { status: 'active', label: 'В работе', color: 'border-node-active' },
  { status: 'completed', label: 'Готово', color: 'border-node-completed' },
  { status: 'error', label: 'Проблема', color: 'border-node-error' },
];

export function KanbanView({ nodes, onNodeSelect }: KanbanViewProps) {
  return (
    <div className="absolute inset-0 top-[72px] overflow-x-auto p-6">
      <div className="flex gap-4 min-w-max h-full">
        {columns.map(col => {
          const colNodes = nodes.filter(n => (n.data as unknown as PipelineNodeData).status === col.status);
          return (
            <div key={col.status} className="w-[260px] flex flex-col">
              <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${col.color}`}>
                <h3 className="text-[11px] font-mono uppercase tracking-wider text-foreground">{col.label}</h3>
                <span className="text-[10px] font-mono text-muted-foreground">{colNodes.length}</span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {colNodes.map(node => {
                  const d = node.data as unknown as PipelineNodeData;
                  const isAI = NODE_CATEGORIES[d.type] === 'ai_action';
                  return (
                    <div
                      key={node.id}
                      onClick={() => onNodeSelect(node.id, d)}
                      className="p-3 rounded-xl glass-panel cursor-pointer hover:border-primary/20 transition-all"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-semibold text-foreground truncate">{d.label}</span>
                        {isAI && <Bot className="w-3 h-3 text-[hsl(265_80%_65%)] shrink-0" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 mb-2">{d.summary}</p>
                      <div className="flex items-center justify-between">
                        {d.phase && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{d.phase}</span>}
                        {d.assignee && <span className="text-[9px] text-muted-foreground">{d.assignee}</span>}
                      </div>
                      <div className="mt-2 h-[2px] w-full rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${
                          d.status === 'completed' ? 'bg-node-completed' :
                          d.status === 'active' ? 'bg-node-active' : 'bg-muted-foreground/30'
                        }`} style={{ width: `${d.progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

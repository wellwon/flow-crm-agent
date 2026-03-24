import type { PipelineNodeData } from '@/types/pipeline';
import { NODE_CATEGORIES } from '@/types/pipeline';
import { Node } from '@xyflow/react';
import { Bot } from 'lucide-react';

interface TimelineViewProps {
  nodes: Node<PipelineNodeData>[];
  onNodeSelect: (id: string, data: PipelineNodeData) => void;
}

export function TimelineView({ nodes, onNodeSelect }: TimelineViewProps) {
  const phases = ['PRE-SALE', 'BIDDING', 'RESULT', 'EXECUTION', 'POST-SALE'];

  return (
    <div className="absolute inset-0 top-[72px] overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        {/* Phase headers */}
        <div className="flex gap-0 mb-6">
          {phases.map((phase, i) => {
            const phaseNodes = nodes.filter(n => (n.data as unknown as PipelineNodeData).phase === phase);
            const completed = phaseNodes.filter(n => (n.data as unknown as PipelineNodeData).status === 'completed').length;
            const pct = phaseNodes.length > 0 ? Math.round((completed / phaseNodes.length) * 100) : 0;
            return (
              <div key={phase} className="flex-1 relative">
                <div className={`h-2 rounded-full mx-0.5 ${pct === 100 ? 'bg-node-completed' : pct > 0 ? 'bg-node-active' : 'bg-muted'}`}>
                  <div className={`h-full rounded-full ${pct === 100 ? 'bg-node-completed' : 'bg-node-active'}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">{phase}</span>
                  <span className="text-[9px] font-mono text-muted-foreground/60 block">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-border/50" />

          {nodes.map((node, i) => {
            const d = node.data as unknown as PipelineNodeData;
            const isAI = NODE_CATEGORIES[d.type] === 'ai_action';
            return (
              <div key={node.id} className="relative mb-2 group">
                <div className={`absolute left-[-18px] top-3 w-3 h-3 rounded-full border-2 ${
                  d.status === 'completed' ? 'bg-node-completed border-node-completed' :
                  d.status === 'active' ? 'bg-node-active border-node-active animate-pulse' :
                  d.status === 'waiting' ? 'bg-primary border-primary' :
                  'bg-muted border-muted-foreground/30'
                }`} />

                <div
                  onClick={() => onNodeSelect(node.id, d)}
                  className="ml-4 p-3 rounded-xl glass-panel cursor-pointer hover:border-primary/20 transition-all flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">{d.label}</span>
                      {isAI && <Bot className="w-3 h-3 text-[hsl(265_80%_65%)]" />}
                      {d.phase && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{d.phase}</span>}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{d.summary}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {d.assignee && <span className="text-[10px] text-muted-foreground">{d.assignee}</span>}
                    <span className="text-[10px] font-mono text-muted-foreground">{d.progress}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

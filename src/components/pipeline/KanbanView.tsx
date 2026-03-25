import { useState, useCallback } from 'react';
import { Bot, GripVertical } from 'lucide-react';
import type { PipelineNodeData, NodeStatus } from '@/types/pipeline';
import { NODE_CATEGORIES } from '@/types/pipeline';
import { Node } from '@xyflow/react';

interface KanbanViewProps {
  nodes: Node<PipelineNodeData>[];
  onNodeSelect: (id: string, data: PipelineNodeData) => void;
  onStatusChange?: (nodeId: string, newStatus: NodeStatus) => void;
}

const columns: { status: NodeStatus; label: string; color: string }[] = [
  { status: 'pending', label: 'Ожидает', color: 'border-node-pending/40' },
  { status: 'waiting', label: 'Ожидание', color: 'border-primary/40' },
  { status: 'active', label: 'В работе', color: 'border-node-active' },
  { status: 'completed', label: 'Готово', color: 'border-node-completed' },
  { status: 'error', label: 'Проблема', color: 'border-node-error' },
];

export function KanbanView({ nodes, onNodeSelect, onStatusChange }: KanbanViewProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<NodeStatus | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, nodeId: string) => {
    e.dataTransfer.setData('text/plain', nodeId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedId(nodeId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: NodeStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(status);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDropTarget(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, status: NodeStatus) => {
    e.preventDefault();
    const nodeId = e.dataTransfer.getData('text/plain');
    if (nodeId && onStatusChange) {
      onStatusChange(nodeId, status);
    }
    setDraggedId(null);
    setDropTarget(null);
  }, [onStatusChange]);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDropTarget(null);
  }, []);

  return (
    <div className="flex gap-4 min-w-max h-full">
      {columns.map(col => {
        const colNodes = nodes.filter(n => (n.data as unknown as PipelineNodeData).status === col.status);
        const isDropping = dropTarget === col.status;
        return (
          <div
            key={col.status}
            className={`w-[260px] flex flex-col rounded-[14px] transition-colors ${
              isDropping ? 'bg-primary/5 ring-1 ring-primary/20' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.status)}
          >
            <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${col.color} px-2`}>
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-foreground">{col.label}</h3>
              <span className="text-[10px] font-mono text-muted-foreground">{colNodes.length}</span>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto pr-1 px-1">
              {colNodes.map(node => {
                const d = node.data as unknown as PipelineNodeData;
                const isAI = NODE_CATEGORIES[d.type] === 'ai_action';
                const isDragging = draggedId === node.id;
                return (
                  <div
                    key={node.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, node.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onNodeSelect(node.id, d)}
                    className={`p-3 rounded-[14px] matte-glass cursor-grab active:cursor-grabbing hover:border-primary/20 transition-all group ${
                      isDragging ? 'opacity-40 scale-95' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <GripVertical className="w-3 h-3 text-muted-foreground/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
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

              {colNodes.length === 0 && (
                <div className="flex items-center justify-center h-20 rounded-[14px] border border-dashed border-border/30 text-[10px] text-muted-foreground/40">
                  Перетащите сюда
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

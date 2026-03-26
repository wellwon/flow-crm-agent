import { useState, useRef, useCallback } from 'react';
import { GlobalTask } from '@/data/mockTasks';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, GripVertical } from 'lucide-react';

interface Props {
  tasks: GlobalTask[];
}

type ColStatus = 'active' | 'pending' | 'completed';

const columns: { id: ColStatus; label: string; color: string }[] = [
  { id: 'active', label: 'Активные', color: 'bg-node-active' },
  { id: 'pending', label: 'Ожидают', color: 'bg-muted-foreground' },
  { id: 'completed', label: 'Завершённые', color: 'bg-node-completed' },
];

const priorityDot: Record<string, string> = {
  high: 'bg-node-error',
  medium: 'bg-node-active',
  low: 'bg-muted-foreground',
};

export function TasksKanbanView({ tasks }: Props) {
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<ColStatus | null>(null);
  const dragCounter = useRef<Record<string, number>>({});

  const handleDragStart = useCallback((e: React.DragEvent, id: number) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(id));
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = '0.5';
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedId(null);
    setDropTarget(null);
    dragCounter.current = {};
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = '1';
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, status: ColStatus) => {
    e.preventDefault();
    dragCounter.current[status] = (dragCounter.current[status] || 0) + 1;
    setDropTarget(status);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, status: ColStatus) => {
    e.preventDefault();
    dragCounter.current[status] = (dragCounter.current[status] || 0) - 1;
    if (dragCounter.current[status] <= 0) {
      dragCounter.current[status] = 0;
      if (dropTarget === status) setDropTarget(null);
    }
  }, [dropTarget]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);
        const isOver = dropTarget === col.id && draggedId !== null;

        return (
          <div
            key={col.id}
            className="flex-shrink-0 w-[320px] flex flex-col"
            onDragEnter={e => handleDragEnter(e, col.id)}
            onDragLeave={e => handleDragLeave(e, col.id)}
            onDragOver={handleDragOver}
            onDrop={e => { e.preventDefault(); setDraggedId(null); setDropTarget(null); }}
          >
            <div className="matte-glass px-3 py-2 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.color}`} />
                <span className="text-[13px] font-medium text-foreground">{col.label}</span>
                <span className="text-[11px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">{colTasks.length}</span>
              </div>
            </div>

            <div className={`flex-1 flex flex-col gap-2 rounded-[14px] p-1.5 transition-all ${
              isOver ? 'bg-primary/10 border-2 border-dashed border-primary/40' : 'border-2 border-transparent'
            }`}>
              {colTasks.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={e => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                  className={`matte-glass p-3 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-all group ${draggedId === task.id ? 'opacity-50 scale-95' : ''}`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 flex-1 mr-2">
                      {task.blocker && <AlertTriangle className="w-3.5 h-3.5 text-node-error flex-shrink-0" />}
                      <span className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors">{task.title}</span>
                    </div>
                    <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground flex-shrink-0" />
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <Badge variant="outline" className="text-[9px] px-1 py-0 bg-primary/5 text-primary border-primary/20">
                      {task.projectTitle.split('—')[0].trim()}
                    </Badge>
                    {task.dealTitle && (
                      <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{task.dealTitle.split('×')[0].trim()}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[task.priority]}`} />
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(task.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-[9px] bg-primary/10 text-primary border border-primary/20">
                        {task.assignee.split(' ').map(w => w[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ))}

              {colTasks.length === 0 && (
                <div className={`flex-1 flex items-center justify-center rounded-[14px] border border-dashed min-h-[80px] ${
                  isOver ? 'border-primary/40 bg-primary/5' : 'border-border'
                }`}>
                  <span className="text-[12px] text-muted-foreground">{isOver ? 'Отпустите здесь' : 'Нет задач'}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

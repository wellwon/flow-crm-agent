import { useState, useRef, useCallback } from 'react';
import { Deal, DealStatus, dealStatusLabels, dealStatusColors } from '@/data/mockDeals';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { GripVertical } from 'lucide-react';

interface Props {
  deals: Deal[];
  onOpenDeal: (id: string) => void;
  onMoveDeal?: (dealId: string, newStatus: DealStatus) => void;
}

const columns: DealStatus[] = ['new', 'qualification', 'proposal', 'negotiation', 'won', 'lost'];

export function DealsKanbanView({ deals, onOpenDeal, onMoveDeal }: Props) {
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DealStatus | null>(null);
  const dragCounter = useRef<Record<string, number>>({});

  const handleDragStart = useCallback((e: React.DragEvent, dealId: string) => {
    setDraggedDealId(dealId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dealId);
    // Make the drag image slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedDealId(null);
    setDropTarget(null);
    dragCounter.current = {};
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, status: DealStatus) => {
    e.preventDefault();
    dragCounter.current[status] = (dragCounter.current[status] || 0) + 1;
    setDropTarget(status);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, status: DealStatus) => {
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

  const handleDrop = useCallback((e: React.DragEvent, status: DealStatus) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    if (dealId && onMoveDeal) {
      onMoveDeal(dealId, status);
    }
    setDraggedDealId(null);
    setDropTarget(null);
    dragCounter.current = {};
  }, [onMoveDeal]);

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 min-h-[600px]">
      {columns.map((status) => {
        const colDeals = deals.filter((d) => d.status === status);
        const colTotal = colDeals.reduce((s, d) => s + d.amount, 0);
        const isOver = dropTarget === status && draggedDealId !== null;
        const draggedDealStatus = draggedDealId ? deals.find(d => d.id === draggedDealId)?.status : null;
        const isSameColumn = draggedDealStatus === status;

        return (
          <div
            key={status}
            className="flex-shrink-0 w-[270px] flex flex-col"
            onDragEnter={(e) => handleDragEnter(e, status)}
            onDragLeave={(e) => handleDragLeave(e, status)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            {/* Column header */}
            <div className="rounded-xl px-3 py-2 mb-2 flex items-center justify-between bg-muted/30 border border-border/20">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${dealStatusColors[status].split(' ')[0].replace('/20', '')}`} />
                <span className="text-sm font-medium text-foreground">{dealStatusLabels[status]}</span>
                <span className="text-[11px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">
                  {colDeals.length}
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {colTotal > 0 ? `${(colTotal / 1_000_000).toFixed(0)}M` : '—'}
              </span>
            </div>

            {/* Drop zone */}
            <div
              className={`flex-1 flex flex-col gap-2 rounded-xl p-1.5 transition-all ${
                isOver && !isSameColumn
                  ? 'bg-primary/10 border-2 border-dashed border-primary/40'
                  : 'border-2 border-transparent'
              }`}
            >
              {colDeals.map((deal) => (
                <div
                  key={deal.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onOpenDeal(deal.id)}
                  className={`bg-muted/20 border border-border/20 rounded-xl p-3 cursor-grab active:cursor-grabbing
                    hover:border-primary/30 hover:bg-muted/40 transition-all group
                    ${draggedDealId === deal.id ? 'opacity-50 scale-95' : ''}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors flex-1 mr-2">
                      {deal.title}
                    </div>
                    <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground flex-shrink-0 mt-0.5" />
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">{deal.company}</div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono text-foreground">
                      {(deal.amount / 1_000_000).toFixed(1)}M ₽
                    </span>
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-[9px] bg-primary/10 text-primary border border-primary/20">
                        {deal.manager.avatar}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <Progress value={deal.progress} className="h-1" />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                      {deal.nextStep}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{deal.progress}%</span>
                  </div>
                </div>
              ))}

              {/* Empty state drop hint */}
              {colDeals.length === 0 && (
                <div className={`flex-1 flex items-center justify-center rounded-xl border border-dashed transition-colors min-h-[100px] ${
                  isOver ? 'border-primary/40 bg-primary/5' : 'border-border/20'
                }`}>
                  <span className="text-xs text-muted-foreground">
                    {isOver ? 'Отпустите здесь' : 'Нет сделок'}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

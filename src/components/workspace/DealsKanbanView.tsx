import { Deal, DealStatus, dealStatusLabels, dealStatusColors } from '@/data/mockDeals';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface Props {
  deals: Deal[];
  onOpenDeal: (id: string) => void;
}

const columns: DealStatus[] = ['new', 'qualification', 'proposal', 'negotiation', 'won', 'lost'];

export function DealsKanbanView({ deals, onOpenDeal }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
      {columns.map((status) => {
        const colDeals = deals.filter((d) => d.status === status);
        const colTotal = colDeals.reduce((s, d) => s + d.amount, 0);

        return (
          <div key={status} className="flex-shrink-0 w-[280px] flex flex-col">
            {/* Column header */}
            <div className="glass-panel rounded-xl px-3 py-2 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${dealStatusColors[status].split(' ')[0].replace('/20', '')}`} />
                <span className="text-sm font-medium text-foreground">{dealStatusLabels[status]}</span>
                <span className="text-xs text-muted-foreground bg-primary/10 px-1.5 py-0.5 rounded-full">
                  {colDeals.length}
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {colTotal > 0 ? `${(colTotal / 1_000_000).toFixed(0)}M` : '—'}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 flex flex-col gap-2">
              {colDeals.map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => onOpenDeal(deal.id)}
                  className="glass-panel p-3.5 cursor-pointer hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)] transition-all group"
                >
                  <div className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                    {deal.title}
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
            </div>
          </div>
        );
      })}
    </div>
  );
}

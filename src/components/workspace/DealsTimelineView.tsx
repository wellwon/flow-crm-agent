import { Deal, dealStatusLabels, dealStatusColors } from '@/data/mockDeals';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Props {
  deals: Deal[];
  onOpenDeal: (id: string) => void;
}

export function DealsTimelineView({ deals, onOpenDeal }: Props) {
  const sorted = [...deals].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  const today = new Date();

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Vertical line with glow */}
      <div className="absolute left-[120px] top-0 bottom-0 w-px bg-primary/20 shadow-[0_0_8px_hsl(var(--primary)/0.15)]" />

      <div className="space-y-1">
        {sorted.map((deal) => {
          const deadline = new Date(deal.deadline);
          const daysLeft = differenceInDays(deadline, today);
          const overdue = daysLeft < 0;

          return (
            <div
              key={deal.id}
              onClick={() => onOpenDeal(deal.id)}
              className="flex items-center gap-6 py-3 px-3 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors group relative"
            >
              {/* Date column */}
              <div className="w-[96px] flex-shrink-0 text-right">
                <div className="text-sm font-medium text-foreground">
                  {format(deadline, 'd MMM', { locale: ru })}
                </div>
                <div className={`text-[10px] ${overdue ? 'text-node-error' : 'text-muted-foreground'}`}>
                  {overdue ? `просрочено ${Math.abs(daysLeft)}д` : `через ${daysLeft}д`}
                </div>
              </div>

              {/* Dot on the line */}
              <div className={`relative z-10 w-3 h-3 rounded-full border-2 border-primary bg-background flex-shrink-0 transition-all ${
                overdue 
                  ? 'border-node-error shadow-[0_0_8px_hsl(var(--node-error)/0.4)]' 
                  : 'group-hover:bg-primary group-hover:shadow-[0_0_12px_hsl(var(--primary)/0.4)]'
              }`} />

              {/* Card */}
              <div className="flex-1 glass-panel p-3 flex items-center gap-4 group-hover:border-primary/30 group-hover:shadow-[0_0_16px_hsl(var(--primary)/0.08)] transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {deal.title}
                    </span>
                    <Badge variant="outline" className={`text-[10px] border flex-shrink-0 ${dealStatusColors[deal.status]}`}>
                      {dealStatusLabels[deal.status]}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{deal.company} · {deal.nextStep}</div>
                </div>

                <span className="font-mono text-sm text-foreground flex-shrink-0">
                  {(deal.amount / 1_000_000).toFixed(1)}M ₽
                </span>

                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary border border-primary/20">
                    {deal.manager.avatar}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

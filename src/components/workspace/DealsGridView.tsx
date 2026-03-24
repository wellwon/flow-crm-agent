import { Deal, dealStatusLabels, dealStatusColors } from '@/data/mockDeals';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Props {
  deals: Deal[];
  onOpenDeal: (id: string) => void;
}

export function DealsGridView({ deals, onOpenDeal }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {deals.map((deal) => (
        <div
          key={deal.id}
          onClick={() => onOpenDeal(deal.id)}
          className="rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-5 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all group flex flex-col"
        >
          <div className="flex items-start justify-between mb-3">
            <Badge variant="outline" className={`text-[10px] border ${dealStatusColors[deal.status]}`}>
              {dealStatusLabels[deal.status]}
            </Badge>
            <span className="text-lg font-mono font-semibold text-foreground">
              {(deal.amount / 1_000_000).toFixed(1)}M
            </span>
          </div>

          <h3 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
            {deal.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">{deal.company}</p>

          <div className="mt-auto space-y-3">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Прогресс</span>
                <span>{deal.progress}%</span>
              </div>
              <Progress value={deal.progress} className="h-1.5" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/20">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-[10px] bg-secondary text-foreground">
                    {deal.manager.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{deal.manager.name}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {format(new Date(deal.deadline), 'd MMM', { locale: ru })}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ArrowRight className="w-3 h-3 text-primary" />
              <span className="truncate">{deal.nextStep}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

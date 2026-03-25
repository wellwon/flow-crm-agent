import { Deal, dealStatusLabels, dealStatusColors } from '@/data/mockDeals';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Props {
  deals: Deal[];
  onOpenDeal: (id: string) => void;
}

export function DealsTableView({ deals, onOpenDeal }: Props) {
  return (
    <div className="rounded-[14px] overflow-hidden border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent bg-muted/30">
            <TableHead className="text-muted-foreground font-medium text-[12px]">Сделка</TableHead>
            <TableHead className="text-muted-foreground font-medium text-[12px]">Статус</TableHead>
            <TableHead className="text-muted-foreground font-medium text-[12px] text-right">Сумма</TableHead>
            <TableHead className="text-muted-foreground font-medium text-[12px]">Прогресс</TableHead>
            <TableHead className="text-muted-foreground font-medium text-[12px]">Менеджер</TableHead>
            <TableHead className="text-muted-foreground font-medium text-[12px]">Дедлайн</TableHead>
            <TableHead className="text-muted-foreground font-medium text-[12px]">Следующий шаг</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal) => (
            <TableRow
              key={deal.id}
              onClick={() => onOpenDeal(deal.id)}
              className="border-border cursor-pointer hover:bg-muted/20 transition-colors group"
            >
              <TableCell>
                <div>
                  <div className="font-medium text-foreground text-[13px]">{deal.title}</div>
                  <div className="text-[12px] text-muted-foreground">{deal.company}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`text-[11px] border rounded-full ${dealStatusColors[deal.status]}`}>
                  {dealStatusLabels[deal.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono text-[13px]">
                {(deal.amount / 1_000_000).toFixed(1)}M ₽
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Progress value={deal.progress} className="h-1.5 flex-1" />
                  <span className="text-[12px] text-muted-foreground w-8">{deal.progress}%</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary border border-primary/20">
                      {deal.manager.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[13px]">{deal.manager.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-[13px] text-muted-foreground">
                {format(new Date(deal.deadline), 'd MMM', { locale: ru })}
              </TableCell>
              <TableCell className="text-[13px] text-muted-foreground max-w-[180px] truncate">
                {deal.nextStep}
              </TableCell>
              <TableCell>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { mockDeals, dealStatusColors } from '@/data/mockDeals';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function TimelineRibbon() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const { startDate, endDate, today, deals } = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 15);
    const end = new Date(now);
    end.setDate(end.getDate() + 75);
    const totalMs = end.getTime() - start.getTime();

    const mapped = mockDeals
      .filter(d => d.status !== 'won' && d.status !== 'lost')
      .map(d => {
        const dl = new Date(d.deadline);
        const pct = ((dl.getTime() - start.getTime()) / totalMs) * 100;
        const isOverdue = dl < now;
        return { ...d, deadlineDate: dl, pct: Math.max(0, Math.min(100, pct)), isOverdue };
      });

    const todayPct = ((now.getTime() - start.getTime()) / totalMs) * 100;

    return { startDate: start, endDate: end, today: todayPct, deals: mapped };
  }, []);

  // Generate month labels
  const months = useMemo(() => {
    const result: { label: string; pct: number }[] = [];
    const totalMs = endDate.getTime() - startDate.getTime();
    const d = new Date(startDate);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    while (d <= endDate) {
      const pct = ((d.getTime() - startDate.getTime()) / totalMs) * 100;
      if (pct >= 0 && pct <= 100) {
        result.push({ label: monthNames[d.getMonth()], pct });
      }
      d.setMonth(d.getMonth() + 1);
    }
    return result;
  }, [startDate, endDate]);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="mx-6 mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronDown className="w-3.5 h-3.5" />
        <span>Показать Timeline</span>
        <span className="text-primary font-medium">{deals.length} дедлайнов</span>
      </button>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="mx-6 mt-3 matte-glass p-3" ref={containerRef}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">Дедлайны</span>
            <span className="text-[11px] text-muted-foreground">{deals.length} активных</span>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded-[6px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timeline bar */}
        <div className="relative h-10">
          {/* Track */}
          <div className="absolute top-4 left-0 right-0 h-[2px] bg-border rounded-full" />

          {/* Today marker */}
          <div
            className="absolute top-1 w-[2px] h-8 bg-primary/60 rounded-full"
            style={{ left: `${today}%` }}
          >
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-primary font-medium whitespace-nowrap">
              Сегодня
            </span>
          </div>

          {/* Month labels */}
          {months.map((m, i) => (
            <div key={i} className="absolute top-7" style={{ left: `${m.pct}%` }}>
              <div className="w-[1px] h-2 bg-border/60 mb-0.5" />
              <span className="text-[9px] text-muted-foreground -ml-3">{m.label}</span>
            </div>
          ))}

          {/* Deal dots */}
          {deals.map((deal) => (
            <Tooltip key={deal.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate(`/project/${deal.id}`)}
                  className={`absolute top-2.5 w-3 h-3 rounded-full border-2 transition-all hover:scale-150 hover:z-10 ${
                    deal.isOverdue
                      ? 'bg-destructive border-destructive animate-pulse'
                      : 'bg-primary border-primary/60'
                  }`}
                  style={{ left: `${deal.pct}%`, transform: 'translateX(-50%)' }}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-card border-border rounded-[10px] p-3 max-w-[220px]">
                <p className="text-[13px] font-semibold text-foreground">{deal.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{deal.company}</p>
                <div className="flex items-center justify-between mt-1.5 text-[11px]">
                  <span className="text-muted-foreground">
                    {deal.deadlineDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-primary font-medium">
                    {(deal.amount / 1_000_000).toFixed(1)}M ₽
                  </span>
                </div>
                {deal.isOverdue && (
                  <p className="text-[10px] text-destructive mt-1 font-medium">⚠ Просрочен</p>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

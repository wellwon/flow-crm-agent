import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import type { Deal } from '@/data/mockDeals';

interface Props {
  deals: Deal[];
}

function calcHealth(deal: Deal): { score: number; color: string; label: string; bgClass: string } {
  if (deal.status === 'won') return { score: 100, color: 'hsl(var(--muted-foreground))', label: 'Выиграна', bgClass: 'bg-muted/40 border-border' };
  if (deal.status === 'lost') return { score: 0, color: 'hsl(var(--muted-foreground))', label: 'Проиграна', bgClass: 'bg-muted/20 border-border opacity-60' };

  const now = new Date();
  const dl = new Date(deal.deadline);
  const daysLeft = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Deadline score (0-40)
  let deadlineScore = 40;
  if (daysLeft < 0) deadlineScore = 0;
  else if (daysLeft < 7) deadlineScore = 10;
  else if (daysLeft < 14) deadlineScore = 25;

  // Progress score (0-40)
  const progressScore = (deal.progress / 100) * 40;

  // Priority penalty (0-20)
  const priorityScore = deal.priority === 'high' && daysLeft < 14 ? 0 : deal.priority === 'high' ? 10 : 20;

  const total = deadlineScore + progressScore + priorityScore;

  if (total >= 65) return { score: total, color: 'hsl(160 84% 39%)', label: 'Здорова', bgClass: 'border-emerald-500/30 bg-emerald-500/10' };
  if (total >= 40) return { score: total, color: 'hsl(38 92% 50%)', label: 'Риск', bgClass: 'border-amber-500/30 bg-amber-500/10' };
  return { score: total, color: 'hsl(350 89% 60%)', label: 'Критично', bgClass: 'border-destructive/30 bg-destructive/10' };
}

export function DealsHealthMap({ deals }: Props) {
  const navigate = useNavigate();

  const healthDeals = useMemo(() =>
    deals.map(d => ({ deal: d, health: calcHealth(d) }))
      .sort((a, b) => a.health.score - b.health.score),
    [deals]
  );

  const critical = healthDeals.filter(h => h.health.label === 'Критично').length;
  const atRisk = healthDeals.filter(h => h.health.label === 'Риск').length;
  const healthy = healthDeals.filter(h => h.health.label === 'Здорова').length;

  return (
    <TooltipProvider delayDuration={200}>
      <div>
        {/* Legend */}
        <div className="flex items-center gap-6 mb-4 text-[12px]">
          {[
            { label: 'Критично', count: critical, cls: 'bg-destructive' },
            { label: 'Риск', count: atRisk, cls: 'bg-amber-500' },
            { label: 'Здорова', count: healthy, cls: 'bg-emerald-500' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${l.cls}`} />
              <span className="text-muted-foreground">{l.label}:</span>
              <span className="font-medium text-foreground">{l.count}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {healthDeals.map(({ deal, health }) => (
            <Tooltip key={deal.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate(`/project/${deal.id}`)}
                  className={`matte-glass p-4 text-left transition-all hover:scale-[1.02] hover:border-primary/30 ${health.bgClass}`}
                  style={{ borderColor: undefined }}
                >
                  {/* Health indicator */}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: health.color }}
                    />
                    <span className="text-[10px] font-medium" style={{ color: health.color }}>
                      {health.label}
                    </span>
                  </div>

                  <p className="text-[13px] font-semibold text-foreground truncate">{deal.company}</p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">{deal.title}</p>

                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-primary font-medium">
                      {(deal.amount / 1_000_000).toFixed(1)}M ₽
                    </span>
                    <span className="text-muted-foreground">{deal.progress}%</span>
                  </div>
                  <Progress value={deal.progress} className="h-1 mt-1.5 bg-muted/50" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-card border-border rounded-[10px] p-3 max-w-[240px]">
                <p className="text-[13px] font-semibold text-foreground">{deal.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{deal.company}</p>
                <div className="mt-2 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Менеджер:</span>
                    <span className="text-foreground">{deal.manager.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Дедлайн:</span>
                    <span className="text-foreground">
                      {new Date(deal.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Следующий шаг:</span>
                    <span className="text-foreground">{deal.nextStep}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Здоровье:</span>
                    <span style={{ color: health.color }}>{health.score}/100</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

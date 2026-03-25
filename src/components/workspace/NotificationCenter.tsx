import { useState, useMemo } from 'react';
import { Bell, AlertTriangle, Clock, Info, X, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockDeals } from '@/data/mockDeals';

interface Notification {
  id: string;
  type: 'urgent' | 'today' | 'info';
  title: string;
  description: string;
  time: string;
}

export function NotificationCenter() {
  const notifications = useMemo<Notification[]>(() => {
    const now = new Date();
    const result: Notification[] = [];

    mockDeals.forEach(deal => {
      const dl = new Date(deal.deadline);
      const diffDays = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (deal.status === 'won') {
        result.push({
          id: `won-${deal.id}`, type: 'info',
          title: `Сделка выиграна: ${deal.company}`,
          description: deal.title, time: '2ч назад',
        });
      } else if (deal.status === 'lost') {
        result.push({
          id: `lost-${deal.id}`, type: 'info',
          title: `Сделка проиграна: ${deal.company}`,
          description: deal.title, time: '1д назад',
        });
      } else if (diffDays < 0) {
        result.push({
          id: `overdue-${deal.id}`, type: 'urgent',
          title: `Просрочен дедлайн: ${deal.company}`,
          description: `${deal.title} — ${Math.abs(diffDays)}д назад`,
          time: `${Math.abs(diffDays)}д`,
        });
      } else if (diffDays <= 3) {
        result.push({
          id: `soon-${deal.id}`, type: 'today',
          title: `Дедлайн через ${diffDays}д: ${deal.company}`,
          description: `${deal.title} — ${deal.nextStep}`,
          time: `${diffDays}д`,
        });
      } else if (diffDays <= 7) {
        result.push({
          id: `week-${deal.id}`, type: 'today',
          title: `Дедлайн на неделе: ${deal.company}`,
          description: deal.title, time: `${diffDays}д`,
        });
      }
    });

    return result.sort((a, b) => {
      const order = { urgent: 0, today: 1, info: 2 };
      return order[a.type] - order[b.type];
    });
  }, []);

  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visible = notifications.filter(n => !dismissed.has(n.id));
  const urgentCount = visible.filter(n => n.type === 'urgent').length;
  const todayCount = visible.filter(n => n.type === 'today').length;

  const dismiss = (id: string) => setDismissed(prev => new Set(prev).add(id));
  const dismissAll = () => setDismissed(new Set(notifications.map(n => n.id)));

  const iconMap = {
    urgent: <AlertTriangle className="w-3.5 h-3.5 text-destructive" />,
    today: <Clock className="w-3.5 h-3.5 text-amber-400" />,
    info: <Info className="w-3.5 h-3.5 text-muted-foreground" />,
  };

  const groupLabels = {
    urgent: 'Срочно',
    today: 'Сегодня',
    info: 'Информация',
  };

  const groups = (['urgent', 'today', 'info'] as const).map(type => ({
    type,
    label: groupLabels[type],
    items: visible.filter(n => n.type === type),
  })).filter(g => g.items.length > 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          <Bell className="w-4 h-4" />
          {visible.length > 0 && (
            <span className={`absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
              urgentCount > 0 ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'
            }`}>
              {visible.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 rounded-[14px] bg-card border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-[13px] font-semibold text-foreground">Уведомления</span>
          {visible.length > 0 && (
            <button
              onClick={dismissAll}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
            >
              <Check className="w-3 h-3" />
              Прочитать все
            </button>
          )}
        </div>

        {/* Content */}
        <div className="max-h-[360px] overflow-y-auto">
          {groups.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-muted-foreground">
              Нет новых уведомлений
            </div>
          ) : (
            groups.map(group => (
              <div key={group.type}>
                <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30">
                  {group.label}
                </div>
                {group.items.map(n => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="mt-0.5 flex-shrink-0">{iconMap[n.type]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-foreground leading-tight">{n.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{n.description}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                      <button
                        onClick={() => dismiss(n.id)}
                        className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

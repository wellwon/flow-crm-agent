import { useMemo, useState } from 'react';
import { GlobalTask } from '@/data/mockTasks';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

interface Props {
  tasks: GlobalTask[];
}

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTH_NAMES = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const priorityDot: Record<string, string> = { high: 'bg-node-error', medium: 'bg-node-active', low: 'bg-muted-foreground' };

export function TasksCalendarView({ tasks }: Props) {
  const today = new Date('2026-03-26');
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const tasksByDate = useMemo(() => {
    const map: Record<string, GlobalTask[]> = {};
    tasks.forEach(t => {
      const key = t.deadline.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const firstDay = new Date(year, month, 1);
  const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const todayStr = today.toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-4">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={prev} className="p-2 rounded-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">{MONTH_NAMES[month]} {year}</h2>
        <button onClick={next} className="p-2 rounded-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px rounded-[14px] overflow-hidden border border-border">
        {/* Header */}
        {DAY_NAMES.map(d => (
          <div key={d} className="bg-muted/40 text-center py-2 text-[11px] font-medium text-muted-foreground">{d}</div>
        ))}

        {/* Cells */}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} className="bg-card/50 min-h-[100px]" />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayTasks = tasksByDate[dateStr] || [];
          const isToday = dateStr === todayStr;
          const isPast = dateStr < todayStr;

          return (
            <div key={dateStr} className={`bg-card min-h-[100px] p-1.5 flex flex-col ${isToday ? 'ring-2 ring-primary/40 ring-inset' : ''}`}>
              <span className={`text-[12px] font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                isToday ? 'bg-primary text-primary-foreground' : isPast ? 'text-muted-foreground' : 'text-foreground'
              }`}>{day}</span>
              <div className="flex flex-col gap-0.5 overflow-hidden flex-1">
                {dayTasks.slice(0, 3).map(t => (
                  <div key={t.id} className={`flex items-center gap-1 px-1.5 py-0.5 rounded-[6px] text-[10px] truncate ${
                    (t.status as string) === 'completed' ? 'bg-node-completed/10 text-node-completed line-through'
                    : isPast && (t.status as string) !== 'completed' ? 'bg-node-error/10 text-node-error'
                    : 'bg-muted/50 text-foreground'
                  }`}>
                    {t.blocker && <AlertTriangle className="w-2.5 h-2.5 flex-shrink-0" />}
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDot[t.priority]}`} />
                    <span className="truncate">{t.title}</span>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <span className="text-[9px] text-muted-foreground px-1.5">+{dayTasks.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import { GlobalTask } from '@/data/mockTasks';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertTriangle, Zap, Clock, CheckCircle2, Brain, ArrowRight } from 'lucide-react';

interface Props {
  tasks: GlobalTask[];
}

const priorityLabel: Record<string, string> = { high: 'Высокий', medium: 'Средний', low: 'Низкий' };

export function TasksFocusView({ tasks }: Props) {
  const today = new Date('2026-03-26');

  const { blockers, urgent, normal } = useMemo(() => {
    const active = tasks.filter(t => t.status !== 'completed');
    const blockers = active.filter(t => t.blocker).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    const rest = active.filter(t => !t.blocker);
    const urgent = rest.filter(t => {
      const days = (new Date(t.deadline).getTime() - today.getTime()) / 86400000;
      return days <= 3 || t.priority === 'high';
    }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    const urgentIds = new Set(urgent.map(t => t.id));
    const normal = rest.filter(t => !urgentIds.has(t.id)).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    return { blockers, urgent, normal };
  }, [tasks]);

  const daysUntil = (d: string) => {
    const diff = Math.ceil((new Date(d).getTime() - today.getTime()) / 86400000);
    if (diff < 0) return `просрочено на ${Math.abs(diff)} дн.`;
    if (diff === 0) return 'сегодня';
    if (diff === 1) return 'завтра';
    return `через ${diff} дн.`;
  };

  const renderCard = (task: GlobalTask, accent: 'blocker' | 'urgent' | 'normal') => {
    const isOverdue = new Date(task.deadline) < today;
    const borderClass = accent === 'blocker' ? 'border-node-error/40' : accent === 'urgent' ? 'border-node-active/40' : 'border-border';

    return (
      <div key={task.id} className={`matte-glass p-4 border ${borderClass} hover:border-primary/30 transition-all`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 mr-3">
            {accent === 'blocker' && <AlertTriangle className="w-4 h-4 text-node-error flex-shrink-0" />}
            {accent === 'urgent' && <Zap className="w-4 h-4 text-node-active flex-shrink-0" />}
            <span className="text-[14px] font-semibold text-foreground">{task.title}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-[12px] font-medium ${isOverdue ? 'text-node-error' : 'text-muted-foreground'}`}>
              {daysUntil(task.deadline)}
            </span>
          </div>
        </div>

        {/* AI reason */}
        {task.aiReason && (
          <div className="flex items-start gap-2 mb-3 px-3 py-2 rounded-[10px] bg-[hsl(265_80%_65%)/0.08] border border-[hsl(265_80%_65%)/0.15]">
            <Brain className="w-3.5 h-3.5 text-[hsl(265,80%,65%)] flex-shrink-0 mt-0.5" />
            <span className="text-[12px] text-[hsl(265,80%,65%)]">{task.aiReason}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/5 text-primary border-primary/20">
              {task.projectTitle.split('—')[0].trim()}
            </Badge>
            {task.dealTitle && (
              <span className="text-[11px] text-muted-foreground">{task.dealTitle.split('×')[0].trim()}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="w-5 h-5">
              <AvatarFallback className="text-[9px] bg-primary/10 text-primary border border-primary/20">
                {task.assignee.split(' ').map(w => w[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-[11px] text-muted-foreground">{task.assignee}</span>
          </div>
        </div>
      </div>
    );
  };

  const Section = ({ title, icon, count, children, color }: { title: string; icon: React.ReactNode; count: number; children: React.ReactNode; color: string }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className={`text-[14px] font-semibold ${color}`}>{title}</h3>
        <span className="text-[11px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl">
      {/* AI summary */}
      <div className="matte-glass p-4 border border-[hsl(265_80%_65%)/0.2]">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-[hsl(265,80%,65%)]" />
          <span className="text-[14px] font-semibold text-foreground">JARVIS: Приоритеты на сегодня</span>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          У вас <strong className="text-node-error">{blockers.length} блокеров</strong> и <strong className="text-node-active">{urgent.length} срочных задач</strong>.
          Рекомендую начать с блокеров — они тормозят другие задачи. Аукцион по рентгену сегодня в 10:00!
        </p>
      </div>

      {blockers.length > 0 && (
        <Section title="Блокеры — решить немедленно" icon={<AlertTriangle className="w-4 h-4 text-node-error" />} count={blockers.length} color="text-node-error">
          {blockers.map(t => renderCard(t, 'blocker'))}
        </Section>
      )}

      {urgent.length > 0 && (
        <Section title="Срочные — сделать сегодня" icon={<Zap className="w-4 h-4 text-node-active" />} count={urgent.length} color="text-node-active">
          {urgent.map(t => renderCard(t, 'urgent'))}
        </Section>
      )}

      {normal.length > 0 && (
        <Section title="Плановые — можно позже" icon={<Clock className="w-4 h-4 text-muted-foreground" />} count={normal.length} color="text-muted-foreground">
          {normal.map(t => renderCard(t, 'normal'))}
        </Section>
      )}
    </div>
  );
}

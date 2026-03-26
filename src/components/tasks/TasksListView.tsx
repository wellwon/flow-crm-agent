import { useState, useMemo } from 'react';
import { GlobalTask } from '@/data/mockTasks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, Layers, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  tasks: GlobalTask[];
}

type SortKey = 'title' | 'deadline' | 'priority' | 'status' | 'assignee';
type SortDir = 'asc' | 'desc';
type GroupKey = 'none' | 'project' | 'deal' | 'assignee' | 'status';

const groupLabels: Record<GroupKey, string> = {
  none: 'Без группировки',
  project: 'По проектам',
  deal: 'По сделкам',
  assignee: 'По исполнителям',
  status: 'По статусу',
};

const statusIcon = (s: string) => {
  if (s === 'active') return <Clock className="w-3.5 h-3.5 text-node-active" />;
  if (s === 'completed') return <CheckCircle2 className="w-3.5 h-3.5 text-node-completed" />;
  return <Clock className="w-3.5 h-3.5 text-muted-foreground" />;
};

const statusLabel: Record<string, string> = { active: 'Активная', pending: 'Ожидает', completed: 'Завершена' };
const priorityLabel: Record<string, string> = { high: 'Высокий', medium: 'Средний', low: 'Низкий' };
const priorityColor: Record<string, string> = {
  high: 'bg-node-error/15 text-node-error border-node-error/30',
  medium: 'bg-node-active/15 text-node-active border-node-active/30',
  low: 'bg-muted text-muted-foreground border-border',
};

function getGroupValue(task: GlobalTask, key: GroupKey): string {
  switch (key) {
    case 'project': return task.projectTitle;
    case 'deal': return task.dealTitle || 'Проектный уровень';
    case 'assignee': return task.assignee;
    case 'status': return statusLabel[task.status] || task.status;
    default: return '';
  }
}

const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function TasksListView({ tasks }: Props) {
  const [sortKey, setSortKey] = useState<SortKey | null>('deadline');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [groupBy, setGroupBy] = useState<GroupKey>('none');
  const [groupMenuOpen, setGroupMenuOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return tasks;
    const m = sortDir === 'asc' ? 1 : -1;
    return [...tasks].sort((a, b) => {
      switch (sortKey) {
        case 'title': return m * a.title.localeCompare(b.title, 'ru');
        case 'deadline': return m * (new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        case 'priority': return m * ((priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1));
        case 'status': return m * a.status.localeCompare(b.status);
        case 'assignee': return m * a.assignee.localeCompare(b.assignee, 'ru');
        default: return 0;
      }
    });
  }, [tasks, sortKey, sortDir]);

  const grouped = useMemo(() => {
    if (groupBy === 'none') return null;
    const groups: Record<string, GlobalTask[]> = {};
    sorted.forEach(t => {
      const key = getGroupValue(t, groupBy);
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, 'ru'));
  }, [sorted, groupBy]);

  const toggleGroup = (g: string) => {
    setCollapsedGroups(prev => {
      const n = new Set(prev);
      n.has(g) ? n.delete(g) : n.add(g);
      return n;
    });
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />;
  };

  const isOverdue = (d: string) => new Date(d) < new Date('2026-03-26');

  const renderRow = (task: GlobalTask) => (
    <TableRow key={task.id} className="border-border hover:bg-muted/20 transition-colors">
      <TableCell>
        <div className="flex items-center gap-2">
          {task.blocker && <AlertTriangle className="w-3.5 h-3.5 text-node-error flex-shrink-0" />}
          <span className="text-[13px] font-medium text-foreground">{task.title}</span>
        </div>
      </TableCell>
      <TableCell className="text-[12px] text-muted-foreground max-w-[160px] truncate">{task.projectTitle.split('—')[0].trim()}</TableCell>
      <TableCell className="text-[12px] text-muted-foreground max-w-[140px] truncate">{task.dealTitle || '—'}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <Avatar className="w-5 h-5">
            <AvatarFallback className="text-[9px] bg-primary/10 text-primary border border-primary/20">
              {task.assignee.split(' ').map(w => w[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-[12px]">{task.assignee}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className={`text-[12px] ${isOverdue(task.deadline) && task.status !== 'completed' ? 'text-node-error font-medium' : 'text-muted-foreground'}`}>
          {new Date(task.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityColor[task.priority]}`}>
          {priorityLabel[task.priority]}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          {statusIcon(task.status)}
          <span className="text-[12px]">{statusLabel[task.status]}</span>
        </div>
      </TableCell>
    </TableRow>
  );

  const header = (
    <TableHeader>
      <TableRow className="border-border hover:bg-transparent bg-muted/30">
        {[
          { key: 'title' as SortKey, label: 'ЗАДАЧА' },
        ].map(c => (
          <TableHead key={c.key} className="text-muted-foreground font-medium text-[11px] cursor-pointer select-none" onClick={() => toggleSort(c.key)}>
            <div className="flex items-center gap-1">{c.label} <SortIcon col={c.key} /></div>
          </TableHead>
        ))}
        <TableHead className="text-muted-foreground font-medium text-[11px]">ПРОЕКТ</TableHead>
        <TableHead className="text-muted-foreground font-medium text-[11px]">СДЕЛКА</TableHead>
        <TableHead className="text-muted-foreground font-medium text-[11px] cursor-pointer select-none" onClick={() => toggleSort('assignee')}>
          <div className="flex items-center gap-1">ИСПОЛНИТЕЛЬ <SortIcon col="assignee" /></div>
        </TableHead>
        <TableHead className="text-muted-foreground font-medium text-[11px] cursor-pointer select-none" onClick={() => toggleSort('deadline')}>
          <div className="flex items-center gap-1">ДЕДЛАЙН <SortIcon col="deadline" /></div>
        </TableHead>
        <TableHead className="text-muted-foreground font-medium text-[11px] cursor-pointer select-none" onClick={() => toggleSort('priority')}>
          <div className="flex items-center gap-1">ПРИОРИТЕТ <SortIcon col="priority" /></div>
        </TableHead>
        <TableHead className="text-muted-foreground font-medium text-[11px] cursor-pointer select-none" onClick={() => toggleSort('status')}>
          <div className="flex items-center gap-1">СТАТУС <SortIcon col="status" /></div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="relative">
          <button onClick={() => setGroupMenuOpen(v => !v)} className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-muted/50 border border-border text-[12px] text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
            <Layers className="w-3.5 h-3.5" />
            {groupLabels[groupBy]}
            <ChevronDown className={`w-3 h-3 transition-transform ${groupMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {groupMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setGroupMenuOpen(false)} />
              <div className="absolute top-full left-0 mt-1 z-50 w-48 py-1 rounded-[10px] bg-card border border-border shadow-xl">
                {(Object.keys(groupLabels) as GroupKey[]).map(key => (
                  <button key={key} onClick={() => { setGroupBy(key); setGroupMenuOpen(false); setCollapsedGroups(new Set()); }}
                    className={`w-full text-left px-3 py-1.5 text-[12px] transition-colors ${groupBy === key ? 'text-primary bg-primary/5' : 'text-foreground hover:bg-muted/50'}`}>
                    {groupLabels[key]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {grouped ? (
        <div className="space-y-3">
          {grouped.map(([name, items]) => {
            const collapsed = collapsedGroups.has(name);
            return (
              <div key={name} className="rounded-[14px] overflow-hidden border border-border">
                <button onClick={() => toggleGroup(name)} className="w-full flex items-center gap-3 px-4 py-2.5 bg-muted/40 hover:bg-muted/60 transition-colors">
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${collapsed ? '-rotate-90' : ''}`} />
                  <span className="text-[13px] font-semibold text-foreground">{name}</span>
                  <span className="text-[11px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">{items.length}</span>
                </button>
                {!collapsed && (
                  <Table>{header}<TableBody>{items.map(renderRow)}</TableBody></Table>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[14px] overflow-hidden border border-border">
          <Table>{header}<TableBody>{sorted.map(renderRow)}</TableBody></Table>
        </div>
      )}
    </div>
  );
}

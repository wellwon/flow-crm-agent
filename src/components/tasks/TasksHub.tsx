import { useState, useMemo } from 'react';
import { List, Kanban, CalendarDays, Zap, Search, X, MapPin, User, Flag, ChevronDown, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { mockGlobalTasks, allProjects, allAssignees, allTaskStatuses, allPriorityOptions, type GlobalTask } from '@/data/mockTasks';
import { TasksListView } from './TasksListView';
import { TasksKanbanView } from './TasksKanbanView';
import { TasksCalendarView } from './TasksCalendarView';
import { TasksFocusView } from './TasksFocusView';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

type ViewMode = 'list' | 'kanban' | 'calendar' | 'focus';

const views: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: 'list', label: 'Список', icon: List },
  { id: 'kanban', label: 'Kanban', icon: Kanban },
  { id: 'calendar', label: 'Календарь', icon: CalendarDays },
  { id: 'focus', label: 'AI Фокус', icon: Zap },
];

interface FilterDropdownProps {
  icon: React.ElementType;
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  displayMap?: Record<string, string>;
}

function FilterDropdown({ icon: Icon, label, options, selected, onChange, displayMap }: FilterDropdownProps) {
  const count = selected.length;
  const toggle = (val: string) => onChange(selected.includes(val) ? selected.filter(s => s !== val) : [...selected, val]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all ${
          count > 0
            ? 'bg-primary/15 text-primary border border-primary/30'
            : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-transparent'
        }`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{label}</span>
          {count > 0 && <span className="bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{count}</span>}
          <ChevronDown className="w-3 h-3 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2 rounded-[14px] bg-card border-border">
        <div className="space-y-0.5 max-h-[240px] overflow-y-auto">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-2.5 px-2 py-1.5 rounded-[8px] hover:bg-muted/50 cursor-pointer text-[13px] transition-colors">
              <Checkbox checked={selected.includes(opt)} onCheckedChange={() => toggle(opt)} className="w-3.5 h-3.5 rounded-[5px]" />
              <span className="text-foreground">{displayMap?.[opt] ?? opt}</span>
            </label>
          ))}
        </div>
        {count > 0 && (
          <button onClick={() => onChange([])} className="w-full mt-1.5 pt-1.5 border-t border-border text-xs text-muted-foreground hover:text-primary text-center py-1 transition-colors">
            Сбросить
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function TasksHub() {
  const [view, setView] = useState<ViewMode>('focus');
  const [search, setSearch] = useState('');
  const [filterProject, setFilterProject] = useState<string[]>([]);
  const [filterAssignee, setFilterAssignee] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [filterBlockers, setFilterBlockers] = useState(false);

  const filtered = useMemo(() => {
    return mockGlobalTasks.filter(t => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterProject.length && !filterProject.includes(t.projectTitle)) return false;
      if (filterAssignee.length && !filterAssignee.includes(t.assignee)) return false;
      if (filterStatus.length && !filterStatus.includes(t.status)) return false;
      if (filterPriority.length && !filterPriority.includes(t.priority)) return false;
      if (filterBlockers && !t.blocker) return false;
      return true;
    });
  }, [search, filterProject, filterAssignee, filterStatus, filterPriority, filterBlockers]);

  const totalFilters = filterProject.length + filterAssignee.length + filterStatus.length + filterPriority.length + (filterBlockers ? 1 : 0);
  const clearAll = () => { setFilterProject([]); setFilterAssignee([]); setFilterStatus([]); setFilterPriority([]); setFilterBlockers(false); };

  const stats = useMemo(() => {
    const active = filtered.filter(t => t.status === 'active').length;
    const blockers = filtered.filter(t => t.blocker && t.status !== 'completed').length;
    const overdue = filtered.filter(t => t.status !== 'completed' && new Date(t.deadline) < new Date('2026-03-26')).length;
    return { total: filtered.length, active, blockers, overdue };
  }, [filtered]);

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* Filters */}
      <div className="px-6 pb-2 pt-1 flex items-center gap-2 flex-wrap">
        <FilterDropdown icon={MapPin} label="Проект" options={allProjects} selected={filterProject} onChange={setFilterProject} />
        <FilterDropdown icon={User} label="Исполнитель" options={allAssignees} selected={filterAssignee} onChange={setFilterAssignee} />
        <FilterDropdown
          icon={Flag} label="Статус"
          options={allTaskStatuses.map(s => s.value)} selected={filterStatus} onChange={setFilterStatus}
          displayMap={Object.fromEntries(allTaskStatuses.map(s => [s.value, s.label]))}
        />
        <FilterDropdown
          icon={Flag} label="Приоритет"
          options={allPriorityOptions.map(p => p.value)} selected={filterPriority} onChange={setFilterPriority}
          displayMap={Object.fromEntries(allPriorityOptions.map(p => [p.value, p.label]))}
        />
        <button
          onClick={() => setFilterBlockers(!filterBlockers)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all ${
            filterBlockers
              ? 'bg-node-error/15 text-node-error border border-node-error/30'
              : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-transparent'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Блокеры
        </button>

        {totalFilters > 0 && (
          <button onClick={clearAll} className="flex items-center gap-1 px-2 py-1.5 rounded-[10px] text-xs text-muted-foreground hover:text-primary transition-colors">
            <X className="w-3 h-3" /> Сбросить ({totalFilters})
          </button>
        )}
      </div>

      {/* Stats + View switcher */}
      <div className="px-6 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-6 text-[13px]">
          {[
            { label: 'Всего', value: stats.total, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            { label: 'Активных', value: stats.active },
            { label: 'Блокеров', value: stats.blockers, accent: stats.blockers > 0 },
            { label: 'Просрочено', value: stats.overdue, accent: stats.overdue > 0 },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className="text-muted-foreground">{s.label}:</span>
              <span className={`font-medium ${s.accent ? 'text-node-error' : 'text-foreground'}`}>{s.value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-0.5 bg-muted/30 p-1 rounded-[10px] border border-border">
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[13px] transition-all ${
                view === v.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/10 active:bg-primary/20'
              }`}
            >
              <v.icon className="w-4 h-4" />
              <span className="hidden md:inline">{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-auto">
        {view === 'list' && <TasksListView tasks={filtered} />}
        {view === 'kanban' && <TasksKanbanView tasks={filtered} />}
        {view === 'calendar' && <TasksCalendarView tasks={filtered} />}
        {view === 'focus' && <TasksFocusView tasks={filtered} />}
      </div>
    </div>
  );
}

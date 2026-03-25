import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Kanban, CalendarDays, Plus, Search, X, MapPin, Tag, User, Flag, ChevronDown } from 'lucide-react';
import { mockDeals, dealStatusLabels, type DealStatus } from '@/data/mockDeals';
import { DealsTableView } from './DealsTableView';
import { DealsKanbanView } from './DealsKanbanView';
import { DealsGridView } from './DealsGridView';
import { DealsTimelineView } from './DealsTimelineView';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

type ViewMode = 'table' | 'kanban' | 'grid' | 'timeline';

const views: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: 'table', label: 'Таблица', icon: List },
  { id: 'kanban', label: 'Kanban', icon: Kanban },
  { id: 'grid', label: 'Карточки', icon: LayoutGrid },
  { id: 'timeline', label: 'Timeline', icon: CalendarDays },
];

const allRegions = [...new Set(mockDeals.map((d) => d.region))].sort();
const allManagers = [...new Set(mockDeals.map((d) => d.manager.name))].sort();
const allCategories = [...new Set(mockDeals.map((d) => d.category))].sort();
const allStatuses: DealStatus[] = ['new', 'qualification', 'proposal', 'negotiation', 'won', 'lost'];
const allPriorities = [
  { value: 'high', label: 'Высокий' },
  { value: 'medium', label: 'Средний' },
  { value: 'low', label: 'Низкий' },
] as const;

interface FilterDropdownProps {
  icon: React.ElementType;
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  displayMap?: Record<string, string>;
}

function FilterDropdown({ icon: Icon, label, options, selected, onChange, displayMap }: FilterDropdownProps) {
  const activeCount = selected.length;

  const toggle = (val: string) => {
    onChange(
      selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val]
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-all backdrop-blur-sm ${
            activeCount > 0
              ? 'border-primary/40 bg-primary/10 text-primary shadow-[0_0_12px_hsl(var(--primary)/0.15)]'
              : 'border-border/20 bg-card/30 text-muted-foreground hover:text-foreground hover:bg-card/50 hover:border-border/40'
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{label}</span>
          {activeCount > 0 && (
            <span className="bg-primary/20 text-primary text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {activeCount}
            </span>
          )}
          <ChevronDown className="w-3 h-3 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-52 p-2 glass-panel-dense border-border/20">
        <div className="space-y-0.5 max-h-[240px] overflow-y-auto">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-primary/5 cursor-pointer text-sm transition-colors"
            >
              <Checkbox
                checked={selected.includes(opt)}
                onCheckedChange={() => toggle(opt)}
                className="w-3.5 h-3.5"
              />
              <span className="text-foreground">{displayMap?.[opt] ?? opt}</span>
            </label>
          ))}
        </div>
        {activeCount > 0 && (
          <button
            onClick={() => onChange([])}
            className="w-full mt-1.5 pt-1.5 border-t border-border/20 text-xs text-muted-foreground hover:text-primary text-center py-1 transition-colors"
          >
            Сбросить
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function WorkspacePage() {
  const [view, setView] = useState<ViewMode>('table');
  const [search, setSearch] = useState('');
  const [filterRegion, setFilterRegion] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterManager, setFilterManager] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const navigate = useNavigate();

  const filtered = mockDeals.filter((d) => {
    if (search && !(d.title.toLowerCase().includes(search.toLowerCase()) || d.company.toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterRegion.length && !filterRegion.includes(d.region)) return false;
    if (filterStatus.length && !filterStatus.includes(d.status)) return false;
    if (filterManager.length && !filterManager.includes(d.manager.name)) return false;
    if (filterCategory.length && !filterCategory.includes(d.category)) return false;
    if (filterPriority.length && !filterPriority.includes(d.priority)) return false;
    return true;
  });

  const handleOpenDeal = (id: string) => navigate(`/project/${id}`);

  const totalFilters = filterRegion.length + filterStatus.length + filterManager.length + filterCategory.length + filterPriority.length;

  const clearAll = () => {
    setFilterRegion([]);
    setFilterStatus([]);
    setFilterManager([]);
    setFilterCategory([]);
    setFilterPriority([]);
  };

  const totalAmount = filtered.reduce((s, d) => s + d.amount, 0);
  const activeDeals = filtered.filter((d) => !['won', 'lost'].includes(d.status)).length;
  const wonDeals = filtered.filter((d) => d.status === 'won').length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header — glass panel */}
      <header className="glass-panel-dense border-0 border-b border-border/20 rounded-none">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              WellWon
            </h1>
            <div className="w-px h-5 bg-border/30" />
            <span className="text-muted-foreground text-sm hidden md:inline">
              Управление сделками
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск сделок..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64 bg-card/30 border-border/20 h-9 backdrop-blur-sm focus:border-primary/40 focus:bg-card/50 transition-all"
              />
            </div>
            <Button size="sm" className="gap-1.5 h-9 shadow-[0_0_16px_hsl(var(--primary)/0.2)]">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Новая сделка</span>
            </Button>
          </div>
        </div>

        {/* Filters row */}
        <div className="px-6 pb-2 flex items-center gap-2 flex-wrap">
          <FilterDropdown
            icon={MapPin}
            label="Регион"
            options={allRegions}
            selected={filterRegion}
            onChange={setFilterRegion}
          />
          <FilterDropdown
            icon={Flag}
            label="Статус"
            options={allStatuses}
            selected={filterStatus}
            onChange={setFilterStatus}
            displayMap={dealStatusLabels}
          />
          <FilterDropdown
            icon={User}
            label="Менеджер"
            options={allManagers}
            selected={filterManager}
            onChange={setFilterManager}
          />
          <FilterDropdown
            icon={Tag}
            label="Категория"
            options={allCategories}
            selected={filterCategory}
            onChange={setFilterCategory}
          />
          <FilterDropdown
            icon={Flag}
            label="Приоритет"
            options={allPriorities.map((p) => p.value)}
            selected={filterPriority}
            onChange={setFilterPriority}
            displayMap={Object.fromEntries(allPriorities.map((p) => [p.value, p.label]))}
          />

          {totalFilters > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="w-3 h-3" />
              Сбросить всё ({totalFilters})
            </button>
          )}
        </div>

        {/* Stats + View Switcher */}
        <div className="px-6 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            {[
              { label: 'Найдено', value: filtered.length, color: 'text-foreground' },
              { label: 'Активных', value: activeDeals, color: 'text-foreground' },
              { label: 'Выиграно', value: wonDeals, color: 'text-node-completed' },
              { label: 'Воронка', value: `${(totalAmount / 1_000_000).toFixed(0)}M ₽`, color: 'text-foreground' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-muted-foreground">{stat.label}:</span>
                <span className={`font-medium ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-0.5 glass-panel p-1 rounded-xl border-border/20">
            {views.map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  view === v.id
                    ? 'bg-primary/15 text-primary shadow-[0_0_12px_hsl(var(--primary)/0.15)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/30'
                }`}
              >
                <v.icon className="w-4 h-4" />
                <span className="hidden md:inline">{v.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        {view === 'table' && <DealsTableView deals={filtered} onOpenDeal={handleOpenDeal} />}
        {view === 'kanban' && <DealsKanbanView deals={filtered} onOpenDeal={handleOpenDeal} />}
        {view === 'grid' && <DealsGridView deals={filtered} onOpenDeal={handleOpenDeal} />}
        {view === 'timeline' && <DealsTimelineView deals={filtered} onOpenDeal={handleOpenDeal} />}
      </main>
    </div>
  );
}

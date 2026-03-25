import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Kanban, CalendarDays, Plus, Search, X, MapPin, Tag, User, Flag, ChevronDown, Sun, Moon, Brain, Activity } from 'lucide-react';
import { mockDeals, dealStatusLabels, type DealStatus, type Deal } from '@/data/mockDeals';
import { DealsTableView } from './DealsTableView';
import { DealsKanbanView } from './DealsKanbanView';
import { DealsGridView } from './DealsGridView';
import { DealsTimelineView } from './DealsTimelineView';
import { DealsHealthMap } from './DealsHealthMap';
import { JarvisArchitecturePage } from './JarvisArchitecturePage';
import { TimelineRibbon } from './TimelineRibbon';
import { NotificationCenter } from './NotificationCenter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

type ViewMode = 'table' | 'kanban' | 'grid' | 'timeline' | 'health' | 'jarvis';

const views: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: 'table', label: 'Таблица', icon: List },
  { id: 'kanban', label: 'Kanban', icon: Kanban },
  { id: 'grid', label: 'Карточки', icon: LayoutGrid },
  { id: 'timeline', label: 'Timeline', icon: CalendarDays },
  { id: 'health', label: 'Health', icon: Activity },
  { id: 'jarvis', label: 'JARVIS', icon: Brain },
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all ${
            activeCount > 0
              ? 'bg-primary/15 text-primary border border-primary/30'
              : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-transparent'
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{label}</span>
          {activeCount > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {activeCount}
            </span>
          )}
          <ChevronDown className="w-3 h-3 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-52 p-2 rounded-[14px] bg-card border-border">
        <div className="space-y-0.5 max-h-[240px] overflow-y-auto">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-[8px] hover:bg-muted/50 cursor-pointer text-[13px] transition-colors"
            >
              <Checkbox
                checked={selected.includes(opt)}
                onCheckedChange={() => toggle(opt)}
                className="w-3.5 h-3.5 rounded-[5px]"
              />
              <span className="text-foreground">{displayMap?.[opt] ?? opt}</span>
            </label>
          ))}
        </div>
        {activeCount > 0 && (
          <button
            onClick={() => onChange([])}
            className="w-full mt-1.5 pt-1.5 border-t border-border text-xs text-muted-foreground hover:text-primary text-center py-1 transition-colors"
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
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [filterRegion, setFilterRegion] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterManager, setFilterManager] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const navigate = useNavigate();

  const filtered = deals.filter((d) => {
    if (search && !(d.title.toLowerCase().includes(search.toLowerCase()) || d.company.toLowerCase().includes(search.toLowerCase()))) return false;
    if (filterRegion.length && !filterRegion.includes(d.region)) return false;
    if (filterStatus.length && !filterStatus.includes(d.status)) return false;
    if (filterManager.length && !filterManager.includes(d.manager.name)) return false;
    if (filterCategory.length && !filterCategory.includes(d.category)) return false;
    if (filterPriority.length && !filterPriority.includes(d.priority)) return false;
    return true;
  });

  const handleOpenDeal = (id: string) => navigate(`/project/${id}`);

  const handleMoveDeal = useCallback((dealId: string, newStatus: DealStatus) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: newStatus } : d));
  }, []);

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

  const isJarvisView = view === 'jarvis';

  return (
    <div className="h-screen overflow-hidden flex flex-col relative">
      {/* Layer 0: Gradient background */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: 'var(--bg-gradient)' }}
      />

      {/* Layer 1: Content */}
      <div className="relative z-[1] h-screen flex flex-col p-3 gap-3 overflow-hidden">
        {/* Main content panel */}
        <div className="flex-1 flex flex-col main-content-panel overflow-hidden">
          {/* Header */}
          <header className="border-b border-border flex-shrink-0">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-foreground tracking-tight">
                  WellWon
                </h1>
                <div className="w-px h-5 bg-border" />
                <span className="text-muted-foreground text-[13px] hidden md:inline">
                  Управление сделками
                </span>
              </div>
              <div className="flex items-center gap-3">
                <NotificationCenter />
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  title={isDark ? 'Светлая тема' : 'Тёмная тема'}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                {!isJarvisView && (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Поиск сделок..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 w-64 bg-muted/30 border-border h-9 rounded-[10px] focus:border-primary/50 transition-all"
                      />
                    </div>
                    <Button size="sm" className="gap-1.5 h-9 rounded-[10px]">
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Новая сделка</span>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Filters row — only for deal views */}
            {!isJarvisView && (
              <div className="px-6 pb-2 flex items-center gap-2 flex-wrap">
                <FilterDropdown icon={MapPin} label="Регион" options={allRegions} selected={filterRegion} onChange={setFilterRegion} />
                <FilterDropdown icon={Flag} label="Статус" options={allStatuses} selected={filterStatus} onChange={setFilterStatus} displayMap={dealStatusLabels} />
                <FilterDropdown icon={User} label="Менеджер" options={allManagers} selected={filterManager} onChange={setFilterManager} />
                <FilterDropdown icon={Tag} label="Категория" options={allCategories} selected={filterCategory} onChange={setFilterCategory} />
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
                    className="flex items-center gap-1 px-2 py-1.5 rounded-[10px] text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Сбросить всё ({totalFilters})
                  </button>
                )}
              </div>
            )}

            {/* Stats + View Switcher */}
            <div className="px-6 pb-3 flex items-center justify-between">
              {!isJarvisView ? (
                <div className="flex items-center gap-6 text-[13px]">
                  {[
                    { label: 'Найдено', value: filtered.length },
                    { label: 'Активных', value: activeDeals },
                    { label: 'Выиграно', value: wonDeals, accent: true },
                    { label: 'Воронка', value: `${(totalAmount / 1_000_000).toFixed(0)}M ₽` },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <span className="text-muted-foreground">{stat.label}:</span>
                      <span className={`font-medium ${stat.accent ? 'text-primary' : 'text-foreground'}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[13px]">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-medium">JARVIS Memory Toolkit</span>
                  <span className="text-muted-foreground">— Plugin Architecture</span>
                </div>
              )}

              <div className="flex items-center gap-0.5 bg-muted/30 p-1 rounded-[10px] border border-border">
                {views.map((v) => (
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
          </header>

          {/* Timeline Ribbon */}
          {!isJarvisView && view !== 'health' && <TimelineRibbon />}

          {/* Content */}
          <main className="flex-1 p-6 overflow-auto">
            {view === 'table' && <DealsTableView deals={filtered} onOpenDeal={handleOpenDeal} />}
            {view === 'kanban' && <DealsKanbanView deals={filtered} onOpenDeal={handleOpenDeal} onMoveDeal={handleMoveDeal} />}
            {view === 'grid' && <DealsGridView deals={filtered} onOpenDeal={handleOpenDeal} />}
            {view === 'timeline' && <DealsTimelineView deals={filtered} onOpenDeal={handleOpenDeal} />}
            {view === 'health' && <DealsHealthMap deals={filtered} />}
            {view === 'jarvis' && <JarvisArchitecturePage />}
          </main>
        </div>
      </div>
    </div>
  );
}

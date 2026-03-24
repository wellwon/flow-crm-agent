import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Kanban, CalendarDays, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { mockDeals } from '@/data/mockDeals';
import { DealsTableView } from './DealsTableView';
import { DealsKanbanView } from './DealsKanbanView';
import { DealsGridView } from './DealsGridView';
import { DealsTimelineView } from './DealsTimelineView';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ViewMode = 'table' | 'kanban' | 'grid' | 'timeline';

const views: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: 'table', label: 'Таблица', icon: List },
  { id: 'kanban', label: 'Kanban', icon: Kanban },
  { id: 'grid', label: 'Карточки', icon: LayoutGrid },
  { id: 'timeline', label: 'Timeline', icon: CalendarDays },
];

export function WorkspacePage() {
  const [view, setView] = useState<ViewMode>('table');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = mockDeals.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDeal = (id: string) => navigate(`/project/${id}`);

  // Summary stats
  const totalAmount = mockDeals.reduce((s, d) => s + d.amount, 0);
  const activeDeals = mockDeals.filter((d) => !['won', 'lost'].includes(d.status)).length;
  const wonDeals = mockDeals.filter((d) => d.status === 'won').length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              WellWon
            </h1>
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
                className="pl-9 w-64 bg-secondary/50 border-border/30 h-9"
              />
            </div>
            <Button size="sm" className="gap-1.5 h-9">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Новая сделка</span>
            </Button>
          </div>
        </div>

        {/* Stats + View Switcher */}
        <div className="px-6 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Активных:</span>
              <span className="font-medium text-foreground">{activeDeals}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Выиграно:</span>
              <span className="font-medium text-emerald-400">{wonDeals}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Воронка:</span>
              <span className="font-medium text-foreground">
                {(totalAmount / 1_000_000).toFixed(0)}M ₽
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1 border border-border/30">
            {views.map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                  view === v.id
                    ? 'bg-primary/15 text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
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

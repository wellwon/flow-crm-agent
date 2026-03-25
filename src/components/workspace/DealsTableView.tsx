import { useState, useMemo } from 'react';
import { Deal, dealStatusLabels, dealStatusColors } from '@/data/mockDeals';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronDown, Layers } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Props {
  deals: Deal[];
  onOpenDeal: (id: string) => void;
}

type SortKey = 'title' | 'status' | 'amount' | 'progress' | 'manager' | 'deadline';
type SortDir = 'asc' | 'desc';
type GroupKey = 'none' | 'region' | 'manager' | 'status' | 'category' | 'priority';

const groupLabels: Record<GroupKey, string> = {
  none: 'Без группировки',
  region: 'По региону',
  manager: 'По менеджеру',
  status: 'По статусу',
  category: 'По категории',
  priority: 'По приоритету',
};

const priorityLabels: Record<string, string> = {
  high: '🔴 Высокий',
  medium: '🟡 Средний',
  low: '🟢 Низкий',
};

const PAGE_SIZE = 10;

function getGroupValue(deal: Deal, key: GroupKey): string {
  switch (key) {
    case 'region': return deal.region;
    case 'manager': return deal.manager.name;
    case 'status': return dealStatusLabels[deal.status];
    case 'category': return deal.category;
    case 'priority': return priorityLabels[deal.priority] || deal.priority;
    default: return '';
  }
}

export function DealsTableView({ deals, onOpenDeal }: Props) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(0);
  const [groupBy, setGroupBy] = useState<GroupKey>('none');
  const [groupMenuOpen, setGroupMenuOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      next.has(group) ? next.delete(group) : next.add(group);
      return next;
    });
  };

  const sorted = useMemo(() => {
    if (!sortKey) return deals;
    const mult = sortDir === 'asc' ? 1 : -1;
    return [...deals].sort((a, b) => {
      switch (sortKey) {
        case 'title': return mult * a.title.localeCompare(b.title, 'ru');
        case 'status': return mult * a.status.localeCompare(b.status);
        case 'amount': return mult * (a.amount - b.amount);
        case 'progress': return mult * (a.progress - b.progress);
        case 'manager': return mult * a.manager.name.localeCompare(b.manager.name, 'ru');
        case 'deadline': return mult * (new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        default: return 0;
      }
    });
  }, [deals, sortKey, sortDir]);

  const grouped = useMemo(() => {
    if (groupBy === 'none') return null;
    const groups: Record<string, Deal[]> = {};
    sorted.forEach(deal => {
      const key = getGroupValue(deal, groupBy);
      if (!groups[key]) groups[key] = [];
      groups[key].push(deal);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, 'ru'));
  }, [sorted, groupBy]);

  // For ungrouped: paginate
  const totalPages = grouped ? 1 : Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = grouped ? sorted : sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const from = page * PAGE_SIZE + 1;
  const to = Math.min((page + 1) * PAGE_SIZE, sorted.length);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3 text-primary" />
      : <ArrowDown className="w-3 h-3 text-primary" />;
  };

  const renderRow = (deal: Deal) => (
    <TableRow
      key={deal.id}
      onClick={() => onOpenDeal(deal.id)}
      className="border-border cursor-pointer hover:bg-muted/20 transition-colors group"
    >
      <TableCell>
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
            deal.status === 'won' ? 'bg-emerald-400' :
            deal.status === 'lost' ? 'bg-red-400' :
            deal.status === 'negotiation' ? 'bg-primary' :
            deal.status === 'proposal' ? 'bg-amber-400' :
            deal.status === 'qualification' ? 'bg-purple-400' :
            'bg-blue-400'
          }`} />
          <div>
            <div className="font-medium text-foreground text-[13px]">{deal.title}</div>
            <div className="text-[12px] text-muted-foreground">{deal.company}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${
            deal.status === 'won' ? 'bg-emerald-400' :
            deal.status === 'lost' ? 'bg-red-400' :
            'bg-primary'
          }`} />
          <span className="text-[13px] text-foreground">{dealStatusLabels[deal.status]}</span>
        </div>
      </TableCell>
      <TableCell className="text-right font-mono text-[13px]">
        {(deal.amount / 1_000_000).toFixed(1)}M ₽
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 min-w-[120px]">
          <Progress value={deal.progress} className="h-1.5 flex-1" />
          <span className="text-[12px] text-muted-foreground w-8">{deal.progress}%</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary border border-primary/20">
              {deal.manager.avatar}
            </AvatarFallback>
          </Avatar>
          <span className="text-[13px]">{deal.manager.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-[13px] text-muted-foreground">
        {format(new Date(deal.deadline), 'd MMM', { locale: ru })}
      </TableCell>
      <TableCell className="text-[13px] text-muted-foreground max-w-[180px] truncate">
        {deal.nextStep}
      </TableCell>
      <TableCell>
        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
      </TableCell>
    </TableRow>
  );

  const tableHeader = (
    <TableHeader>
      <TableRow className="border-border hover:bg-transparent bg-muted/30">
        <TableHead className="text-muted-foreground font-medium text-[12px] cursor-pointer select-none" onClick={() => toggleSort('title')}>
          <div className="flex items-center gap-1">НАЗВАНИЕ <SortIcon col="title" /></div>
        </TableHead>
        <TableHead className="text-muted-foreground font-medium text-[12px] cursor-pointer select-none" onClick={() => toggleSort('status')}>
          <div className="flex items-center gap-1">СТАТУС <SortIcon col="status" /></div>
        </TableHead>
        <TableHead className="text-muted-foreground font-medium text-[12px] text-right cursor-pointer select-none" onClick={() => toggleSort('amount')}>
          <div className="flex items-center gap-1 justify-end">СУММА <SortIcon col="amount" /></div>
        </TableHead>
        <TableHead className="text-muted-foreground font-medium text-[12px] cursor-pointer select-none" onClick={() => toggleSort('progress')}>
          <div className="flex items-center gap-1">ПРОГРЕСС <SortIcon col="progress" /></div>
        </TableHead>
        <TableHead className="text-muted-foreground font-medium text-[12px] cursor-pointer select-none" onClick={() => toggleSort('manager')}>
          <div className="flex items-center gap-1">МЕНЕДЖЕР <SortIcon col="manager" /></div>
        </TableHead>
        <TableHead className="text-muted-foreground font-medium text-[12px] cursor-pointer select-none" onClick={() => toggleSort('deadline')}>
          <div className="flex items-center gap-1">ДЕДЛАЙН <SortIcon col="deadline" /></div>
        </TableHead>
        <TableHead className="text-muted-foreground font-medium text-[12px]">СЛЕДУЮЩИЙ ШАГ</TableHead>
        <TableHead className="w-10" />
      </TableRow>
    </TableHeader>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Grouping control */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setGroupMenuOpen(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-muted/50 border border-border text-[12px] text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            {groupLabels[groupBy]}
            <ChevronDown className={`w-3 h-3 transition-transform ${groupMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {groupMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setGroupMenuOpen(false)} />
              <div className="absolute top-full left-0 mt-1 z-50 w-48 py-1 rounded-[10px] bg-card border border-border shadow-xl">
                {(Object.keys(groupLabels) as GroupKey[]).map(key => (
                  <button
                    key={key}
                    onClick={() => { setGroupBy(key); setGroupMenuOpen(false); setCollapsedGroups(new Set()); setPage(0); }}
                    className={`w-full text-left px-3 py-1.5 text-[12px] transition-colors ${
                      groupBy === key ? 'text-primary bg-primary/5' : 'text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {groupLabels[key]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {groupBy !== 'none' && (
          <span className="text-[11px] text-muted-foreground">
            {grouped?.length} {grouped?.length === 1 ? 'группа' : (grouped?.length ?? 0) < 5 ? 'группы' : 'групп'}
          </span>
        )}
      </div>

      {/* Table */}
      {grouped ? (
        <div className="space-y-3">
          {grouped.map(([groupName, groupDeals]) => {
            const isCollapsed = collapsedGroups.has(groupName);
            const totalAmount = groupDeals.reduce((s, d) => s + d.amount, 0);
            return (
              <div key={groupName} className="rounded-[14px] overflow-hidden border border-border">
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(groupName)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 bg-muted/40 hover:bg-muted/60 transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                  <span className="text-[13px] font-semibold text-foreground">{groupName}</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{groupDeals.length} сделок</span>
                  <span className="text-[11px] font-mono text-primary ml-auto">{(totalAmount / 1_000_000).toFixed(1)}M ₽</span>
                </button>
                {!isCollapsed && (
                  <Table>
                    {tableHeader}
                    <TableBody>
                      {groupDeals.map(renderRow)}
                    </TableBody>
                  </Table>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div className="rounded-[14px] overflow-hidden border border-border">
            <Table>
              {tableHeader}
              <TableBody>
                {paginated.map(renderRow)}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[13px] text-muted-foreground">
              Показано {from}–{to} из {sorted.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-[8px] text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-8 h-8 flex items-center justify-center rounded-[8px] text-[13px] font-medium transition-colors ${
                    page === i
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-[8px] text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

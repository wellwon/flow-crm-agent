import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Building2, User, Phone, Mail, MapPin, FileText, Bot, Clock,
  CheckCircle, AlertTriangle, Shield, ExternalLink,
  Calendar, DollarSign, Users, Zap, Eye,
  ChevronRight, ChevronDown, Paperclip, MessageSquare, Star,
  CircleDot, Send, ListChecks, ArrowRight, Sparkles,
  Package, Activity, ArrowLeft, Truck, Wrench, Scale, Briefcase,
  TrendingUp, CreditCard, Banknote, UserCheck,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QuickActionsBar } from './QuickActionsBar';
import {
  projectData, dealStatusLabels, dealStatusColors, fmt,
  type ProjectData, type ProjectDeal, type ProjectTask,
  type ProjectDocument, type TimelineEntry,
} from '@/data/mockProjectData';

/* ─── JARVIS chat messages ─── */
interface ChatMessage {
  id: number;
  role: 'user' | 'assistant' | 'system';
  text: string;
  ts?: string;
}

const initialMessages: ChatMessage[] = [
  { id: 1, role: 'system', text: 'Контекст проекта загружен. Я знаю всё о ЦРБ Коломна.' },
  { id: 2, role: 'assistant', text: '👋 Привет! Я слежу за проектом **ЦРБ Коломна**. Сейчас активно 7 сделок.\n\n🟡 **Главное:** завтра аукцион по рентгену (D-54), а ТЗ по УЗИ (D-52) ждёт утверждения.\n\n📦 Поставка мониторов N22 идёт по графику.\n\n💡 Что хочешь обсудить — проект в целом или конкретную сделку?', ts: '14:30' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

/* ═══════════════════════════════════════════ */
/* ═══ MAIN COMPONENT                      ═══ */
/* ═══════════════════════════════════════════ */

/* ═══ Hook: responsive panel state ═══ */
function useResponsivePanels() {
  const isNarrow = typeof window !== 'undefined' && window.innerWidth < 1600;
  const [leftOpen, setLeftOpen] = useState(!isNarrow);
  const [rightOpen, setRightOpen] = useState(!isNarrow);

  useEffect(() => {
    const onResize = () => {
      const narrow = window.innerWidth < 1600;
      if (narrow) {
        setLeftOpen(false);
        setRightOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { leftOpen, setLeftOpen, rightOpen, setRightOpen };
}

export function DealDossierView() {
  const d = projectData;
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const { leftOpen, setLeftOpen, rightOpen, setRightOpen } = useResponsivePanels();

  const selectedDeal = selectedDealId ? d.deals.find(dl => dl.id === selectedDealId) ?? null : null;

  return (
    <div className="flex gap-0 h-full">
      {/* ═══ LEFT: JARVIS CHAT (collapsible) ═══ */}
      <div className={`shrink-0 flex flex-col transition-all duration-300 ease-in-out ${leftOpen ? 'w-[340px] 2xl:w-[400px]' : 'w-[44px]'}`}>
        {leftOpen ? (
          <JarvisChat onCollapse={() => setLeftOpen(false)} />
        ) : (
          <CollapsedPanel side="left" onExpand={() => setLeftOpen(true)} icon={Bot} label="JARVIS" />
        )}
      </div>

      {/* ═══ CENTER: CONTENT ═══ */}
      <div className="flex-1 min-w-0 mx-2">
        <AnimatePresence mode="wait">
          {selectedDeal ? (
            <motion.div
              key={`deal-${selectedDeal.id}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="h-full pb-8 overflow-y-auto pr-1"
            >
              <DealScreen deal={selectedDeal} onBack={() => setSelectedDealId(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="project"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className="h-full pb-8 overflow-y-auto pr-1"
            >
              <ProjectScreen data={d} onSelectDeal={setSelectedDealId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ RIGHT: AGGREGATED SIDEBAR (collapsible) ═══ */}
      <div className={`shrink-0 flex flex-col transition-all duration-300 ease-in-out ${rightOpen ? 'w-[340px] 2xl:w-[400px]' : 'w-[44px]'}`}>
        {rightOpen ? (
          <AggregatedSidebar data={d} selectedDealId={selectedDealId} onCollapse={() => setRightOpen(false)} />
        ) : (
          <CollapsedPanel side="right" onExpand={() => setRightOpen(true)} icon={ListChecks} label="Задачи" />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* ═══ COLLAPSED PANEL STRIP              ═══ */
/* ═══════════════════════════════════════════ */

function CollapsedPanel({ side, onExpand, icon: Icon, label }: {
  side: 'left' | 'right'; onExpand: () => void; icon: React.ElementType; label: string;
}) {
  const ExpandIcon = side === 'left' ? PanelLeftOpen : PanelRightOpen;
  return (
    <div className="h-[calc(100vh-160px)] matte-glass flex flex-col items-center py-3 gap-3">
      <button
        onClick={onExpand}
        className="w-8 h-8 rounded-[8px] flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        title={`Открыть ${label}`}
      >
        <ExpandIcon className="w-4 h-4" />
      </button>
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-[9px] text-muted-foreground font-mono [writing-mode:vertical-lr] rotate-180 mt-2">{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* ═══ PROJECT SCREEN                      ═══ */
/* ═══════════════════════════════════════════ */

function ProjectScreen({ data: d, onSelectDeal }: { data: ProjectData; onSelectDeal: (id: string) => void }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      <QuickActionsBar />

      {/* ═══ PROJECT HERO HEADER ═══ */}
      <motion.div variants={item} className="matte-glass p-5 relative overflow-hidden">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">Проект #{d.project.id}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{d.project.region}</span>
              <span className="text-[10px] font-mono text-muted-foreground">•</span>
              <span className="text-[10px] font-mono text-muted-foreground">{d.project.category}</span>
            </div>
            <h1 className="text-xl font-bold text-foreground mb-0.5">🏥 {d.project.title}</h1>
            <p className="text-[12px] text-muted-foreground">{d.project.fullName}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] text-muted-foreground mb-1">Сделки</div>
            <div className="text-2xl font-bold text-foreground font-mono">{d.deals.length}</div>
            <div className="text-[10px] text-muted-foreground">
              {fmt(d.deals.reduce((s, deal) => s + deal.amount, 0))}
            </div>
          </div>
        </div>

        {/* Deal status summary */}
        <div className="flex gap-2 flex-wrap">
          {(['preparation', 'submitted', 'auction', 'won', 'execution', 'lost', 'completed'] as const).map(status => {
            const count = d.deals.filter(deal => deal.status === status).length;
            if (count === 0) return null;
            return (
              <div key={status} className={`text-[10px] px-2 py-1 rounded-full border ${dealStatusColors[status]}`}>
                {dealStatusLabels[status]}: {count}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ INFO CARDS GRID: Контрагент + Поставщики ═══ */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Контрагент */}
        <div className="matte-glass p-4">
          <SectionTitle icon={Building2} color="text-primary">Контрагент (заказчик)</SectionTitle>
          <div className="space-y-2.5">
            <div>
              <div className="text-xs font-medium text-foreground">{d.project.fullName}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">ИНН {d.project.inn} • ОГРН {d.project.ogrn}</div>
            </div>
            <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
              <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-muted-foreground/60" />
              <span>{d.project.address}</span>
            </div>
            <div className="border-t border-border pt-2 space-y-2">
              {d.project.contacts.map((c, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium text-foreground">{c.name}</span>
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                        c.role === 'ЛПР' ? 'bg-node-active/15 text-node-active' : 'bg-muted text-muted-foreground'
                      }`}>{c.role}</span>
                    </div>
                    <div className="text-[9px] text-muted-foreground">{c.position}</div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Phone className="w-3 h-3 text-muted-foreground/50 hover:text-primary cursor-pointer transition-colors" />
                    <Mail className="w-3 h-3 text-muted-foreground/50 hover:text-primary cursor-pointer transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Поставщики */}
        <div className="matte-glass p-4">
          <SectionTitle icon={Truck} color="text-primary">Поставщики / Вендоры</SectionTitle>
          <div className="space-y-2.5">
            {d.suppliers.map((s, i) => (
              <div key={i} className="p-2.5 rounded-[10px] bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-foreground">{s.name}</span>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                    s.role === 'Основной вендор' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>{s.role}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    <span>{s.contactPerson}</span>
                  </div>
                  {s.inn && <span className="font-mono text-[9px]">ИНН {s.inn}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══ ФИНАНСОВЫЙ БЛОК ═══ */}
      <motion.div variants={item} className="matte-glass p-4">
        <SectionTitle icon={TrendingUp} color="text-primary">Финансы проекта</SectionTitle>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'Общий бюджет', value: fmt(d.finances.totalBudget), icon: Briefcase },
            { label: 'Сумма сделок', value: fmt(d.finances.dealsTotal), icon: DollarSign },
            { label: 'Маржа', value: `${d.finances.marginPercent}%`, icon: TrendingUp },
            { label: 'Оплачено', value: fmt(d.finances.paidAmount), icon: CreditCard },
            { label: 'Ожидает оплаты', value: fmt(d.finances.pendingPayments), icon: Banknote },
          ].map((f, i) => (
            <div key={i} className="p-3 rounded-[10px] bg-muted/30 border border-border/50 text-center">
              <f.icon className="w-4 h-4 text-primary mx-auto mb-1.5" />
              <div className="text-sm font-bold text-foreground font-mono">{f.value}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">{f.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ═══ КОМАНДА + ЗАДАЧИ ═══ */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Команда */}
        <div className="matte-glass p-4">
          <SectionTitle icon={Users} color="text-primary">Команда проекта</SectionTitle>
          <div className="space-y-2">
            {d.team.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-[8px] bg-muted/30 border border-border/50">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-foreground">{m.name}</div>
                  <div className="text-[9px] text-muted-foreground">{m.role}</div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Phone className="w-3 h-3 text-muted-foreground/50 hover:text-primary cursor-pointer transition-colors" />
                  <Mail className="w-3 h-3 text-muted-foreground/50 hover:text-primary cursor-pointer transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Задачи проекта */}
        <div className="matte-glass p-4">
          <SectionTitle icon={ListChecks} color="text-node-active">Задачи проекта</SectionTitle>
          <TasksList tasks={d.tasks} />
        </div>
      </motion.div>

      {/* ═══ СДЕЛКИ МИНИ-ТАБЛИЦА ═══ */}
      <motion.div variants={item} className="matte-glass overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Сделки</span>
          <span className="text-[10px] text-muted-foreground ml-1">{d.deals.length} сделок • {fmt(d.deals.reduce((s, dl) => s + dl.amount, 0))}</span>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[1fr_100px_80px_70px_100px_32px] gap-3 px-4 py-2 border-b border-border text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
          <span>Сделка</span>
          <span className="text-right">Сумма</span>
          <span className="text-center">Статус</span>
          <span className="text-center">%</span>
          <span className="text-right">Дедлайн</span>
          <span />
        </div>

        {/* Table rows */}
        {d.deals.map(deal => (
          <div
            key={deal.id}
            onClick={() => onSelectDeal(deal.id)}
            className="grid grid-cols-[1fr_100px_80px_70px_100px_32px] gap-3 px-4 py-3 cursor-pointer transition-all border-b border-border/50 hover:bg-primary/5 group"
          >
            <div className="min-w-0">
              <div className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">{deal.title}</div>
              <div className="text-[10px] text-muted-foreground">{deal.id} • {deal.manager}</div>
            </div>
            <div className="flex items-center justify-end text-xs font-mono font-semibold text-foreground">
              {(deal.amount / 1_000_000).toFixed(1)}M
            </div>
            <div className="flex items-center justify-center">
              <Badge variant="outline" className={`text-[9px] border rounded-full px-2 py-0.5 ${dealStatusColors[deal.status]}`}>
                {dealStatusLabels[deal.status]}
              </Badge>
            </div>
            <div className="flex items-center justify-center gap-1">
              <div className="w-8 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${
                  deal.status === 'won' || deal.status === 'completed' ? 'bg-node-completed' :
                  deal.status === 'lost' ? 'bg-node-error' : 'bg-primary'
                }`} style={{ width: `${deal.progress}%` }} />
              </div>
              <span className="text-[9px] font-mono text-muted-foreground">{deal.progress}%</span>
            </div>
            <div className="flex items-center justify-end text-[10px] text-muted-foreground">{deal.deadline}</div>
            <div className="flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* ═══ ДОКУМЕНТЫ + ХРОНОЛОГИЯ ═══ */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="matte-glass p-4">
          <SectionTitle icon={FileText} color="text-primary">Документы проекта</SectionTitle>
          <DocumentsList documents={d.documents} />
        </div>
        <div className="matte-glass p-4">
          <SectionTitle icon={Clock} color="text-primary">Хронология проекта</SectionTitle>
          <TimelineList entries={d.timeline} />
        </div>
      </motion.div>

      {/* FOOTER */}
      <motion.div variants={item} className="flex items-center justify-between px-2 text-[10px] text-muted-foreground/60">
        <div className="flex items-center gap-4">
          <span>Обновлено: {d.project.lastUpdated}</span>
          <span>Автор: <span className="text-[hsl(265_80%_65%)]">JARVIS</span></span>
          <span>Ответственный: {d.project.manager}</span>
        </div>
        <button className="flex items-center gap-1 hover:text-primary transition-colors">
          <FileText className="w-3 h-3" />Экспорт
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════ */
/* ═══ DEAL SCREEN                         ═══ */
/* ═══════════════════════════════════════════ */

function DealScreen({ deal, onBack }: { deal: ProjectDeal; onBack: () => void }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {/* ═══ BACK + HEADER ═══ */}
      <motion.div variants={item} className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Назад к проекту</span>
        </button>
      </motion.div>

      {/* ═══ DEAL HERO ═══ */}
      <motion.div variants={item} className="matte-glass p-5 relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{deal.id}</span>
              <Badge variant="outline" className={`text-[9px] border rounded-full px-2 py-0.5 ${dealStatusColors[deal.status]}`}>
                {dealStatusLabels[deal.status]}
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-foreground mb-1">{deal.title}</h2>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><Scale className="w-3 h-3" />{deal.law}</span>
              <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" />{deal.platform}</span>
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{deal.manager}</span>
            </div>
          </div>
          <div className="text-right shrink-0 space-y-1">
            <div className="text-xl font-bold text-foreground font-mono">{fmt(deal.amount)}</div>
            <div className="text-[10px] text-muted-foreground">Дедлайн: {deal.deadline}</div>
            <div className="flex items-center gap-1.5 justify-end">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${
                  deal.status === 'won' || deal.status === 'completed' ? 'bg-node-completed' :
                  deal.status === 'lost' ? 'bg-node-error' : 'bg-primary'
                }`} style={{ width: `${deal.progress}%` }} />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{deal.progress}%</span>
            </div>
          </div>
        </div>

        {/* Equipment info */}
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Package className="w-3 h-3" />{deal.equipment}</span>
          <span>× {deal.quantity} шт</span>
        </div>
      </motion.div>

      {/* ═══ NEXT ACTIONS ═══ */}
      {deal.nextActions.length > 0 && (
        <motion.div variants={item} className="matte-glass p-4">
          <SectionTitle icon={ArrowRight} color="text-node-active">Что делать дальше</SectionTitle>
          <div className="space-y-2">
            {deal.nextActions.map((na, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-[8px] bg-muted/30 border border-border/50">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  na.urgency === 'urgent' ? 'bg-node-error animate-pulse' :
                  na.urgency === 'soon' ? 'bg-node-active' : 'bg-muted-foreground/40'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-foreground">{na.action}</p>
                  <span className="text-[10px] text-muted-foreground">{na.who}</span>
                </div>
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                  na.urgency === 'urgent' ? 'bg-node-error/15 text-node-error' :
                  na.urgency === 'soon' ? 'bg-node-active/15 text-node-active' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {na.urgency === 'urgent' ? 'СРОЧНО' : na.urgency === 'soon' ? 'СКОРО' : 'ПЛАН'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══ TASKS + RISKS ═══ */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="matte-glass p-4">
          <SectionTitle icon={ListChecks} color="text-primary">
            Задачи сделки
            <span className="text-[9px] font-mono text-muted-foreground/60 ml-1">
              {deal.tasks.filter(t => t.status === 'completed').length}/{deal.tasks.length}
            </span>
          </SectionTitle>
          <TasksList tasks={deal.tasks} />
        </div>

        {deal.risks.length > 0 && (
          <div className="matte-glass p-4">
            <SectionTitle icon={Shield} color="text-node-active">Риски</SectionTitle>
            <div className="space-y-2">
              {deal.risks.map((r, i) => (
                <div key={i} className={`flex items-start gap-2 p-2.5 rounded-[8px] border ${
                  r.level === 'warning' ? 'bg-node-active/5 border-node-active/20' : 'bg-node-completed/5 border-node-completed/20'
                }`}>
                  <span className="text-sm mt-0.5">{r.level === 'warning' ? '🟡' : '🟢'}</span>
                  <span className="text-[11px] text-foreground/90">{r.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* ═══ DOCUMENTS + TIMELINE ═══ */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="matte-glass p-4">
          <SectionTitle icon={FileText} color="text-primary">Документы</SectionTitle>
          <DocumentsList documents={deal.documents} />
        </div>
        <div className="matte-glass p-4">
          <SectionTitle icon={Clock} color="text-primary">Хронология</SectionTitle>
          <TimelineList entries={deal.timeline} />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════ */
/* ═══ REUSABLE LISTS                     ═══ */
/* ═══════════════════════════════════════════ */

function TasksList({ tasks, compact }: { tasks: ProjectTask[]; compact?: boolean }) {
  return (
    <div className="space-y-1.5">
      {tasks.map(task => (
        <div key={task.id} className={`flex items-center gap-2.5 p-2 rounded-[8px] border transition-all ${
          task.status === 'completed'
            ? 'bg-node-completed/5 border-node-completed/20'
            : task.blocker
              ? 'bg-node-error/5 border-node-error/20'
              : 'bg-muted/30 border-border/50'
        }`}>
          <div className="shrink-0">
            {task.status === 'completed' ? (
              <CheckCircle className="w-3.5 h-3.5 text-node-completed" />
            ) : task.status === 'active' ? (
              <CircleDot className="w-3.5 h-3.5 text-node-active" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-muted-foreground/40" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[11px] ${task.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {task.title}
              </span>
              {task.blocker && (
                <span className="text-[7px] font-mono px-1 py-0.5 rounded bg-node-error/15 text-node-error">БЛОКЕР</span>
              )}
            </div>
            {!compact && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {task.assignee === 'JARVIS' ? (
                    <Bot className="w-3 h-3 text-[hsl(265_80%_65%)]" />
                  ) : (
                    <User className="w-3 h-3 text-muted-foreground/60" />
                  )}
                  <span className="text-[9px] text-muted-foreground">{task.assignee}</span>
                </div>
                <span className="text-[9px] font-mono text-muted-foreground/60">{task.deadline}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DocumentsList({ documents }: { documents: ProjectDocument[] }) {
  return (
    <div className="space-y-1.5">
      {documents.map((doc, i) => (
        <div key={i} className="flex items-center gap-2 p-2 rounded-[8px] bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
          <Paperclip className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          <span className="text-[11px] text-foreground flex-1 truncate">{doc.name}</span>
          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
            doc.status === 'sent' ? 'bg-node-completed/15 text-node-completed' :
            doc.status === 'signed' ? 'bg-node-completed/15 text-node-completed' :
            doc.status === 'approved' ? 'bg-primary/15 text-primary' :
            doc.status === 'ai-draft' ? 'bg-[hsl(265_80%_65%)/0.15] text-[hsl(265_80%_65%)]' :
            'bg-muted text-muted-foreground'
          }`}>
            {doc.status === 'sent' ? '✅ Отправлено' :
             doc.status === 'signed' ? '✍️ Подписано' :
             doc.status === 'approved' ? '✅ Утверждён' :
             doc.status === 'ai-draft' ? '🤖 AI' : '⏳'}
          </span>
        </div>
      ))}
    </div>
  );
}

function TimelineList({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="space-y-2">
      {entries.map((ev, i) => {
        const IconEl = ev.icon === 'ai' ? Bot : ev.icon === 'system' ? Zap : MessageSquare;
        const iconColor = ev.icon === 'ai' ? 'text-[hsl(265_80%_65%)]' : ev.icon === 'system' ? 'text-node-active' : 'text-primary';
        return (
          <div key={i} className="flex items-start gap-2">
            <IconEl className={`w-3 h-3 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="flex-1">
              <p className="text-[10px] text-foreground/90">{ev.text}</p>
              <span className="text-[8px] font-mono text-muted-foreground/50">{ev.date}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* ═══ AGGREGATED SIDEBAR                 ═══ */
/* ═══════════════════════════════════════════ */

function AggregatedSidebar({ data, selectedDealId }: { data: ProjectData; selectedDealId: string | null }) {
  const [tab, setTab] = useState<'tasks' | 'timeline'>('tasks');

  const allTasks: (ProjectTask & { source: string })[] = [
    ...data.tasks.map(t => ({ ...t, source: 'Проект' })),
    ...data.deals.flatMap(deal => deal.tasks.map(t => ({ ...t, source: deal.id + ' ' + deal.title.slice(0, 20) }))),
  ];

  const allTimeline: (TimelineEntry & { source: string })[] = [
    ...data.timeline.map(t => ({ ...t, source: 'Проект' })),
    ...data.deals.flatMap(deal => deal.timeline.map(t => ({ ...t, source: deal.id }))),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const filteredTasks = selectedDealId
    ? allTasks.filter(t => t.dealId === selectedDealId || t.dealId === null)
    : allTasks;
  const filteredTimeline = selectedDealId
    ? allTimeline.filter(t => t.dealId === selectedDealId || t.dealId === null)
    : allTimeline;

  return (
    <div className="w-[456px] shrink-0 flex flex-col matte-glass overflow-hidden sticky top-0 h-[calc(100vh-160px)]">
      {/* Tabs */}
      <div className="px-3 pt-3 pb-0 flex gap-1">
        <button
          onClick={() => setTab('tasks')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-t-[10px] text-[11px] font-semibold transition-colors ${
            tab === 'tasks' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ListChecks className="w-3.5 h-3.5" />
          Все задачи
          <span className="text-[9px] font-mono text-muted-foreground/60 ml-0.5">
            {filteredTasks.filter(t => t.status === 'completed').length}/{filteredTasks.length}
          </span>
        </button>
        <button
          onClick={() => setTab('timeline')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-t-[10px] text-[11px] font-semibold transition-colors ${
            tab === 'timeline' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Хронология
        </button>
      </div>

      {/* Filter indicator */}
      {selectedDealId && (
        <div className="mx-3 mt-2 px-2.5 py-1.5 rounded-[8px] bg-primary/10 border border-primary/20 flex items-center gap-2">
          <Eye className="w-3 h-3 text-primary" />
          <span className="text-[10px] text-primary">Фильтр: {selectedDealId} + проект</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === 'tasks' ? (
            <motion.div key="tasks" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="px-3 py-3 space-y-3">
              <div>
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2 px-1">Активные и ожидающие</div>
                <div className="space-y-1.5">
                  {filteredTasks.filter(t => t.status !== 'completed').map(task => (
                    <div key={`${task.dealId}-${task.id}`} className={`flex items-start gap-3 p-3 rounded-[10px] border transition-all ${
                      task.blocker ? 'bg-node-error/5 border-node-error/20' : 'bg-muted/30 border-border/50'
                    }`}>
                      <div className="shrink-0 mt-0.5">
                        {task.status === 'active' ? (
                          <CircleDot className="w-4 h-4 text-node-active" />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-foreground">{task.title}</span>
                          {task.blocker && (
                            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-node-error/15 text-node-error">БЛОКЕР</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <div className="flex items-center gap-1">
                            {task.assignee === 'JARVIS' ? (
                              <Bot className="w-3 h-3 text-[hsl(265_80%_65%)]" />
                            ) : (
                              <User className="w-3 h-3 text-muted-foreground/60" />
                            )}
                            <span className="text-[10px] text-muted-foreground">{task.assignee}</span>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground/60">{task.deadline}</span>
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                            task.dealId ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                          }`}>
                            {task.dealId || 'Проект'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2 px-1">Выполнено</div>
                <div className="space-y-1.5">
                  {filteredTasks.filter(t => t.status === 'completed').map(task => (
                    <div key={`${task.dealId}-${task.id}`} className="flex items-center gap-3 p-2.5 rounded-[10px] bg-node-completed/5 border border-node-completed/20">
                      <CheckCircle className="w-3.5 h-3.5 text-node-completed shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-muted-foreground line-through">{task.title}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] text-muted-foreground/60">{task.assignee}</span>
                          <span className={`text-[8px] font-mono px-1 py-0.5 rounded ${
                            task.dealId ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                          }`}>
                            {task.dealId || 'Проект'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="timeline" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="px-3 py-3">
              <div className="relative pl-5 space-y-0">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                {filteredTimeline.map((ev, i) => {
                  const IconEl = ev.icon === 'ai' ? Bot : ev.icon === 'system' ? Zap : MessageSquare;
                  const iconColor = ev.icon === 'ai' ? 'text-[hsl(265_80%_65%)]' : ev.icon === 'system' ? 'text-node-active' : 'text-primary';
                  const bgColor = ev.icon === 'ai' ? 'bg-[hsl(265_80%_65%)/0.1]' : ev.icon === 'system' ? 'bg-node-active/10' : 'bg-primary/10';
                  return (
                    <div key={i} className="relative flex items-start gap-3 py-2">
                      <div className={`absolute left-[-13px] top-3 z-10 w-5 h-5 rounded-full ${bgColor} flex items-center justify-center`}>
                        <IconEl className={`w-3 h-3 ${iconColor}`} />
                      </div>
                      <div className="flex-1 p-2.5 rounded-[10px] bg-muted/30 border border-border/50">
                        <p className="text-[11px] text-foreground/90 leading-relaxed">{ev.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-mono text-muted-foreground/50">{ev.date}</span>
                          <span className={`text-[8px] font-mono px-1 py-0.5 rounded ${
                            ev.dealId ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                          }`}>
                            {ev.dealId || 'Проект'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* ═══ JARVIS CHAT                        ═══ */
/* ═══════════════════════════════════════════ */

function JarvisChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(10);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: nextId.current++, role: 'user', text: input, ts: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTimeout(() => {
      const response: ChatMessage = {
        id: nextId.current++, role: 'assistant',
        text: getJarvisResponse(input),
        ts: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(m => [...m, response]);
    }, 1200);
  };

  const quickActions = [
    { label: 'Обзор проекта', prompt: 'Кратко: какой сейчас статус проекта в целом?' },
    { label: 'Сделки', prompt: 'Какие сделки сейчас в работе?' },
    { label: 'Блокеры', prompt: 'Что сейчас блокирует?' },
    { label: 'Приоритеты', prompt: 'Какие приоритеты на эту неделю?' },
  ];

  return (
    <div className="w-[456px] shrink-0 flex flex-col matte-glass overflow-hidden sticky top-0 h-[calc(100vh-160px)]">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-[hsl(265_80%_65%)/0.15] flex items-center justify-center">
          <Bot className="w-4 h-4 text-[hsl(265_80%_65%)]" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            JARVIS
            <span className="w-1.5 h-1.5 rounded-full bg-node-completed animate-pulse" />
          </div>
          <div className="text-[9px] text-muted-foreground">Контекст: {projectData.project.customer} • {projectData.project.id}</div>
        </div>
        <Sparkles className="w-3.5 h-3.5 text-[hsl(265_80%_65%)]" />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-3 pb-2 flex flex-wrap gap-1.5">
        {quickActions.map((qa, i) => (
          <button key={i} onClick={() => setInput(qa.prompt)}
            className="text-[9px] px-2 py-1 rounded-full bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/50 transition-all">
            {qa.label}
          </button>
        ))}
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 p-2 rounded-[10px] bg-muted/40 border border-border">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Спроси JARVIS..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none" />
          <button onClick={handleSend} disabled={!input.trim()}
            className="p-1.5 rounded-[8px] bg-primary/15 hover:bg-primary/25 transition-colors disabled:opacity-30">
            <Send className="w-3.5 h-3.5 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  if (message.role === 'system') {
    return (
      <div className="flex items-center gap-2 py-1.5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[8px] font-mono text-muted-foreground/50 shrink-0">{message.text}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    );
  }
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-[hsl(265_80%_65%)/0.15] flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-3.5 h-3.5 text-[hsl(265_80%_65%)]" />
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? 'ml-auto' : ''}`}>
        <div className={`px-3 py-2 rounded-[12px] text-[11px] leading-relaxed ${
          isUser ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted/60 text-foreground border border-border/50 rounded-bl-sm'
        }`}>
          {message.text.split('\n').map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
              {line.split('**').map((part, j) =>
                j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part
              )}
            </p>
          ))}
        </div>
        {message.ts && (
          <div className={`text-[8px] font-mono text-muted-foreground/40 mt-0.5 ${isUser ? 'text-right' : ''}`}>{message.ts}</div>
        )}
      </div>
    </div>
  );
}

function getJarvisResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('статус') || lower.includes('обзор')) {
    return '📊 **Проект ЦРБ Коломна:**\n\n• Всего сделок: 7\n• Активных: 4 (подготовка, подана, торги, исполнение)\n• Выиграна: 1 (эндоскопы HD-580)\n• Проиграна: 1 (ИВЛ SV800 — демпинг)\n• Общая сумма воронки: ~62M₽\n\n🟡 Главные риски: завтра аукцион по рентгену, ТЗ по УЗИ не утверждено.';
  }
  if (lower.includes('сделк')) {
    return '📋 **Активные сделки:**\n\n1. **D-52** УЗИ DC-80 — подготовка (22%) ⚠️ ТЗ\n2. **D-53** КТ 520 Pro — заявка подана (45%)\n3. **D-54** Рентген DigiEye — торги завтра! (68%)\n4. **D-55** Эндоскоп HD-580 — выиграна, поставка (85%)\n5. **D-56** Мониторы N22 — исполнение (72%)\n6. **D-58** Наркоз EX-65 — ранняя подготовка (10%)\n\n❌ **D-57** ИВЛ SV800 — проиграна';
  }
  if (lower.includes('блокир')) {
    return '🚧 **Блокеры:**\n\n1. **D-52:** ТЗ не утверждено → блокирует НМЦК\n2. **D-54:** Аукцион завтра → нужна стратегия\n3. **Проект:** Бюджетные рамки не согласованы\n\nРекомендую начать с ТЗ по D-52 — это критический путь.';
  }
  if (lower.includes('приоритет')) {
    return '🎯 **Приоритеты на неделю:**\n\n1. 🔴 **Сегодня:** Подготовиться к аукциону D-54 (рентген)\n2. 🔴 **До 28 мар:** Утвердить ТЗ по D-52 (УЗИ)\n3. 🟡 **До 30 мар:** Собрать 3 КП для НМЦК D-52\n4. 🟢 **До 1 апр:** Контроль доставки мониторов D-56\n5. 🟢 **До 5 апр:** Согласовать бюджет проекта';
  }
  return '✨ Понял, работаю. Обновлю досье.\n\nЧто-нибудь ещё по проекту?';
}

/* ─── Sub-components ─── */

function SectionTitle({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
      <Icon className={`w-4 h-4 ${color}`} />
      {children}
    </h3>
  );
}

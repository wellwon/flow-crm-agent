import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import {
  Building2, User, Phone, Mail, MapPin, FileText, Bot, Clock,
  CheckCircle, AlertTriangle, Shield, ExternalLink,
  Calendar, DollarSign, Users, Zap, Eye,
  ChevronRight, ChevronDown, Paperclip, MessageSquare, Star,
  CircleDot, Send, ListChecks, ArrowRight, Sparkles,
  Package, Activity, ArrowLeft, Truck, Wrench, Scale, Briefcase,
  TrendingUp, CreditCard, Banknote, UserCheck,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { mockDeals } from '@/data/mockDeals';
import { Badge } from '@/components/ui/badge';
import { QuickActionsBar } from './QuickActionsBar';
import {
  projectData, dealStatusLabels, dealStatusColors, fmt,
  type ProjectData, type ProjectDeal, type ProjectTask,
  type ProjectDocument, type TimelineEntry,
} from '@/data/mockProjectData';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export function DealDossierView() {
  const d = projectData;
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const selectedDeal = selectedDealId ? d.deals.find(dl => dl.id === selectedDealId) ?? null : null;

  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        {selectedDeal ? (
          <motion.div
            key={`deal-${selectedDeal.id}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="h-full pb-2 overflow-y-auto pr-1"
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


/* ─── Sub-components ─── */


function SectionTitle({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
      <Icon className={`w-4 h-4 ${color}`} />
      {children}
    </h3>
  );
}

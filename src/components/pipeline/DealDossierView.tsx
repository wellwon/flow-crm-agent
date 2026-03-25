import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, User, Phone, Mail, MapPin, FileText, Bot, Clock,
  CheckCircle, AlertTriangle, TrendingUp, Shield, ExternalLink,
  Calendar, Package, DollarSign, Users, Activity, Zap, Eye,
  ChevronRight, Paperclip, MessageSquare, Star, CircleDot,
} from 'lucide-react';

/* ─── Mock dossier data ─── */
const dossierData = {
  deal: {
    title: 'УЗИ Mindray DC-80 × 2 шт',
    customer: 'ЦРБ Коломна',
    id: 'D-52',
    law: '44-ФЗ Электронный аукцион',
    amount: 6_000_000,
    stage: 'PRE-SALE',
    progress: 22,
    deadline: '15 апреля 2026',
    manager: 'Алексей М.',
    lastUpdated: '25 мар 2026, 14:35',
  },
  stages: [
    { name: 'Подготовка', done: true },
    { name: 'Торги', done: false },
    { name: 'Аукцион', done: false },
    { name: 'Контракт', done: false },
    { name: 'Поставка', done: false },
  ],
  counterparty: {
    name: 'ЦРБ Коломна',
    fullName: 'ОГБУЗ «Центральная районная больница г. Коломна»',
    inn: '5022012345',
    ogrn: '1025001234567',
    address: '140400, МО, г. Коломна, ул. Октябрьской Революции, 7',
    contacts: [
      { name: 'Иванов И.И.', role: 'ЛПР', position: 'Зам. главврача по закупкам', phone: '+7-916-xxx-xx-xx', email: 'ivanov@crb.ru' },
      { name: 'Петрова А.С.', role: 'Техн. спец.', position: 'Нач. отд. УЗД', phone: '+7-926-xxx-xx-xx', email: 'petrova@crb.ru' },
    ],
  },
  equipment: {
    name: 'Mindray DC-80',
    description: 'УЗИ-аппарат экспертного класса',
    ru: 'ФСЗ 2019/8765',
    ruExpiry: '2028-06-15',
    ktru: '26.60.12.199-00000001',
    okpd2: '26.60.12',
    nkmi: '260440',
    riskClass: '2а',
    priceUnit: 2_800_000,
    quantity: 2,
    competitors: [
      { name: 'GE Voluson E10', price: 3_200_000 },
      { name: 'Samsung HS70A', price: 2_500_000 },
    ],
  },
  pipeline: [
    { label: 'Первичный контакт', date: '12 мар', assignee: 'Иванов — встреча', status: 'completed' as const },
    { label: 'Уточнение потребности', date: '14 мар', assignee: '2 шт, DC-80', status: 'completed' as const },
    { label: 'Коммерческое предложение', date: '18 мар', assignee: 'Отправлено', status: 'completed' as const },
    { label: 'Подготовка ТЗ', date: '→ 28 мар', assignee: '🤖 AI сгенерировал', status: 'active' as const, warning: 'Ждёт одобрения менеджера' },
    { label: 'Расчёт НМЦК', date: '→ 30 мар', assignee: 'Нужны 3 КП', status: 'pending' as const },
    { label: 'Подготовка заявки', date: '→ 5 апр', assignee: '', status: 'pending' as const },
    { label: 'Подача на площадку', date: '→ 10 апр', assignee: '', status: 'pending' as const },
    { label: 'Электронный аукцион', date: '→ 15 апр', assignee: '', status: 'pending' as const },
    { label: 'Заключение контракта', date: '', assignee: '', status: 'future' as const },
    { label: 'Поставка и приёмка', date: '', assignee: '', status: 'future' as const },
    { label: 'Гарантийное сопровождение', date: '', assignee: '', status: 'future' as const },
  ],
  documents: [
    { name: 'КП_ЦРБ_Коломна_DC80.pdf', status: 'sent', date: '18 мар' },
    { name: 'ТЗ_УЗИ_DC80_draft.docx', status: 'ai-draft', date: '25 мар' },
    { name: 'НМЦК_расчёт.xlsx', status: 'pending', date: '' },
    { name: 'Заявка_аукцион.pdf', status: 'pending', date: '' },
  ],
  finances: {
    budget: 6_000_000,
    ourPrice: 5_600_000,
    margin: 400_000,
    marginPct: 7.1,
    nmck: 5_800_000,
    auctionReduction: '5-15%',
  },
  similarTenders: [
    { title: 'УЗИ Mindray — Казань', amount: 4_200_000, deadline: '15 апр', match: 89 },
    { title: 'УЗИ экспертн. — Самара', amount: 3_800_000, deadline: '20 апр', match: 76 },
    { title: 'УЗИ DC-80 — СПб', amount: 5_900_000, deadline: '1 мая', match: 95 },
  ],
  timeline: [
    { date: '25 мар 14:30', icon: 'ai' as const, text: 'AI сгенерировал черновик ТЗ' },
    { date: '25 мар 09:15', icon: 'human' as const, text: 'Менеджер обновил контакт Петровой' },
    { date: '22 мар 16:00', icon: 'system' as const, text: 'Монитор: найден похожий тендер в Казани' },
    { date: '18 мар 11:20', icon: 'human' as const, text: 'Отправлено КП Иванову' },
    { date: '14 мар 15:45', icon: 'human' as const, text: 'Встреча: уточнили 2 шт DC-80' },
    { date: '12 мар 10:00', icon: 'human' as const, text: 'Первый звонок, создана сделка' },
  ],
  risks: [
    { level: 'warning' as const, text: 'ТЗ ждёт одобрения — блокирует расчёт НМЦК' },
    { level: 'ok' as const, text: 'РУ действует до 2028 — ок' },
    { level: 'ok' as const, text: 'Контрагент — бюджетное учреждение, платит стабильно' },
    { level: 'warning' as const, text: 'Конкурент GE может дать цену ниже на аукционе' },
  ],
};

function fmt(n: number) {
  return new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export function DealDossierView() {
  const d = dossierData;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-5 pb-8">
      {/* ═══ HERO HEADER ═══ */}
      <motion.div variants={item} className="matte-glass p-6 relative overflow-hidden">
        {/* Accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-node-active to-primary rounded-t-[14px]" />

        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">Сделка #{d.deal.id}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{d.deal.law}</span>
            </div>
            <h1 className="text-xl font-bold text-foreground mb-0.5">
              🏥 {d.deal.title} — {d.deal.customer}
            </h1>
            <p className="text-lg font-semibold text-primary font-mono">{fmt(d.deal.amount)}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] text-muted-foreground mb-1">Дедлайн</div>
            <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-node-active" />
              {d.deal.deadline}
            </div>
          </div>
        </div>

        {/* Stage progress */}
        <div className="flex gap-1 mb-3">
          {d.stages.map((s, i) => (
            <div key={i} className="flex-1">
              <div className={`h-2 rounded-full ${s.done ? 'bg-primary' : 'bg-muted'} transition-all`} />
              <div className="text-[9px] text-center mt-1 text-muted-foreground font-mono">{s.name}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">Прогресс:</div>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${d.deal.progress}%` }} />
            </div>
            <span className="text-xs font-mono font-semibold text-foreground">{d.deal.progress}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="w-3.5 h-3.5" />
            {d.deal.manager}
          </div>
        </div>
      </motion.div>

      {/* ═══ TWO COLUMN: COUNTERPARTY + EQUIPMENT ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Counterparty */}
        <motion.div variants={item} className="matte-glass p-5">
          <SectionTitle icon={Building2} color="text-primary">Контрагент</SectionTitle>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-semibold text-foreground">{d.counterparty.name}</div>
              <div className="text-[11px] text-muted-foreground">{d.counterparty.fullName}</div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              <span className="text-muted-foreground">ИНН: <span className="text-foreground font-mono">{d.counterparty.inn}</span></span>
              <span className="text-muted-foreground">ОГРН: <span className="text-foreground font-mono">{d.counterparty.ogrn}</span></span>
            </div>
            <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {d.counterparty.address}
            </div>

            {/* Contacts */}
            <div className="border-t border-border pt-3 mt-3">
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2">👤 Контакты</div>
              <div className="space-y-2">
                {d.counterparty.contacts.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-[10px] bg-muted/40 border border-border/50">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{c.name}</span>
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                          c.role === 'ЛПР' ? 'bg-node-active/15 text-node-active' : 'bg-muted text-muted-foreground'
                        }`}>{c.role}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{c.position}</div>
                    </div>
                    <div className="text-right shrink-0 space-y-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Phone className="w-3 h-3" />{c.phone}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-primary">
                        <Mail className="w-3 h-3" />{c.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Equipment */}
        <motion.div variants={item} className="matte-glass p-5">
          <SectionTitle icon={Package} color="text-primary">Оборудование</SectionTitle>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-semibold text-foreground">{d.equipment.name}</div>
              <div className="text-[11px] text-muted-foreground">{d.equipment.description}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <InfoPill label="РУ" value={d.equipment.ru} />
              <InfoPill label="Действует до" value={d.equipment.ruExpiry} />
              <InfoPill label="КТРУ" value={d.equipment.ktru} />
              <InfoPill label="ОКПД2" value={d.equipment.okpd2} />
              <InfoPill label="НКМИ" value={d.equipment.nkmi} />
              <InfoPill label="Класс риска" value={d.equipment.riskClass} />
            </div>

            <div className="border-t border-border pt-3">
              <div className="text-xs text-foreground font-semibold mb-1">
                Цена: {fmt(d.equipment.priceUnit)} × {d.equipment.quantity} = {fmt(d.equipment.priceUnit * d.equipment.quantity)}
              </div>
              <div className="text-[10px] text-muted-foreground">(среднерыночная)</div>
            </div>

            <div className="border-t border-border pt-3">
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Конкуренты</div>
              <div className="space-y-1">
                {d.equipment.competitors.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] p-1.5 rounded-[8px] bg-muted/30">
                    <span className="text-foreground">{c.name}</span>
                    <span className="font-mono text-muted-foreground">{fmt(c.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ PIPELINE ═══ */}
      <motion.div variants={item} className="matte-glass p-5">
        <SectionTitle icon={Activity} color="text-primary">Пайплайн</SectionTitle>
        <div className="relative pl-6 space-y-0.5">
          <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
          {d.pipeline.map((step, i) => {
            const statusIcon = step.status === 'completed' ? (
              <CheckCircle className="w-4 h-4 text-node-completed" />
            ) : step.status === 'active' ? (
              <CircleDot className="w-4 h-4 text-node-active animate-pulse" />
            ) : step.status === 'pending' ? (
              <Clock className="w-4 h-4 text-muted-foreground/50" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/20" />
            );

            return (
              <div key={i} className="relative flex items-start gap-3 py-1.5">
                <div className="absolute left-[-18px] top-2.5 z-10 bg-card rounded-full">
                  {statusIcon}
                </div>
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <span className={`text-xs ${step.status === 'completed' ? 'text-foreground' : step.status === 'active' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                  {step.date && <span className="text-[10px] font-mono text-muted-foreground/70">{step.date}</span>}
                  {step.assignee && <span className="text-[10px] text-muted-foreground">{step.assignee}</span>}
                </div>
                {step.warning && (
                  <div className="flex items-center gap-1 text-[10px] text-node-active bg-node-active/10 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    {step.warning}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ TWO COLUMN: DOCUMENTS + FINANCES ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Documents */}
        <motion.div variants={item} className="matte-glass p-5">
          <SectionTitle icon={FileText} color="text-primary">Документы</SectionTitle>
          <div className="space-y-1.5">
            {d.documents.map((doc, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 rounded-[10px] bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                <Paperclip className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                <span className="text-xs text-foreground flex-1 truncate">{doc.name}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  doc.status === 'sent' ? 'bg-node-completed/15 text-node-completed' :
                  doc.status === 'ai-draft' ? 'bg-[hsl(265_80%_65%)/0.15] text-[hsl(265_80%_65%)]' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {doc.status === 'sent' ? '✅ Отправлено' : doc.status === 'ai-draft' ? '🤖 AI-черновик' : '⏳ Не готов'}
                </span>
                {doc.date && <span className="text-[9px] font-mono text-muted-foreground/60">{doc.date}</span>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Finances */}
        <motion.div variants={item} className="matte-glass p-5">
          <SectionTitle icon={DollarSign} color="text-primary">Финансы</SectionTitle>
          <div className="space-y-2.5">
            <FinRow label="Бюджет заказчика" value={fmt(d.finances.budget)} />
            <FinRow label={`Наша цена (${d.equipment.quantity} шт)`} value={fmt(d.finances.ourPrice)} />
            <FinRow label="Маржа" value={`~${fmt(d.finances.margin)} (${d.finances.marginPct}%)`} accent />
            <div className="border-t border-border pt-2" />
            <FinRow label="НМЦК (оценка)" value={fmt(d.finances.nmck)} />
            <FinRow label="Снижение на аукционе" value={`~${d.finances.auctionReduction}`} muted />
          </div>
        </motion.div>
      </div>

      {/* ═══ SIMILAR TENDERS ═══ */}
      <motion.div variants={item} className="matte-glass p-5">
        <SectionTitle icon={Eye} color="text-primary">
          Похожие тендеры
          <span className="text-[9px] font-mono text-muted-foreground/60 ml-2">(найдены автоматически)</span>
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {d.similarTenders.map((t, i) => (
            <div key={i} className="p-3 rounded-[10px] bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{t.title}</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-mono text-muted-foreground">{fmt(t.amount)}</span>
                <span className="text-muted-foreground">до {t.deadline}</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${t.match}%` }} />
                </div>
                <span className="text-[9px] font-mono text-primary font-semibold">{t.match}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ═══ TWO COLUMN: TIMELINE + RISKS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Timeline */}
        <motion.div variants={item} className="matte-glass p-5">
          <SectionTitle icon={Clock} color="text-primary">Хронология</SectionTitle>
          <div className="space-y-2.5">
            {d.timeline.map((ev, i) => {
              const IconEl = ev.icon === 'ai' ? Bot : ev.icon === 'system' ? Zap : MessageSquare;
              const iconColor = ev.icon === 'ai' ? 'text-[hsl(265_80%_65%)]' : ev.icon === 'system' ? 'text-node-active' : 'text-primary';
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <IconEl className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${iconColor}`} />
                  <div className="flex-1">
                    <p className="text-[11px] text-foreground/90">{ev.text}</p>
                    <span className="text-[9px] font-mono text-muted-foreground/60">{ev.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Risks */}
        <motion.div variants={item} className="matte-glass p-5">
          <SectionTitle icon={Shield} color="text-node-active">Риски и внимание</SectionTitle>
          <div className="space-y-2">
            {d.risks.map((r, i) => (
              <div key={i} className={`flex items-start gap-2 p-2.5 rounded-[10px] border ${
                r.level === 'warning' ? 'bg-node-active/5 border-node-active/20' : 'bg-node-completed/5 border-node-completed/20'
              }`}>
                <span className="text-sm mt-0.5">{r.level === 'warning' ? '🟡' : '🟢'}</span>
                <span className="text-[11px] text-foreground/90">{r.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <motion.div variants={item} className="flex items-center justify-between px-2 text-[10px] text-muted-foreground/60">
        <div className="flex items-center gap-4">
          <span>Последнее обновление: {d.deal.lastUpdated}</span>
          <span>Автор досье: <span className="text-[hsl(265_80%_65%)]">JARVIS</span></span>
          <span>Ответственный: {d.deal.manager}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 hover:text-primary transition-colors">
            <MessageSquare className="w-3 h-3" />Чат
          </button>
          <button className="flex items-center gap-1 hover:text-primary transition-colors">
            <FileText className="w-3 h-3" />Экспорт
          </button>
        </div>
      </motion.div>
    </motion.div>
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

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-1.5 rounded-[8px] bg-muted/40 border border-border/50">
      <div className="text-[8px] text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="text-[11px] font-mono text-foreground">{value}</div>
    </div>
  );
}

function FinRow({ label, value, accent, muted: isMuted }: { label: string; value: string; accent?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[11px] ${isMuted ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>{label}</span>
      <span className={`text-sm font-mono font-semibold ${accent ? 'text-primary' : isMuted ? 'text-muted-foreground' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}

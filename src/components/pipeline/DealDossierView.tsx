import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Building2, User, Phone, Mail, MapPin, FileText, Bot, Clock,
  CheckCircle, AlertTriangle, TrendingUp, Shield, ExternalLink,
  Calendar, Package, DollarSign, Users, Activity, Zap, Eye,
  ChevronRight, Paperclip, MessageSquare, Star, CircleDot,
  Send, ListChecks, Target, Flag, ArrowRight, Sparkles,
  CircleAlert, UserCheck, Mic, ArrowLeft, X,
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
  tasks: [
    { id: 1, title: 'Утвердить черновик ТЗ', assignee: 'Алексей М.', deadline: '28 мар', priority: 'high' as const, status: 'active' as const, blocker: true },
    { id: 2, title: 'Собрать 3 КП для НМЦК', assignee: 'Алексей М.', deadline: '30 мар', priority: 'high' as const, status: 'pending' as const, blocker: false },
    { id: 3, title: 'Уточнить комплектацию датчиков', assignee: 'Дмитрий В.', deadline: '27 мар', priority: 'medium' as const, status: 'active' as const, blocker: false },
    { id: 4, title: 'Согласовать логистику доставки', assignee: 'Ирина С.', deadline: '5 апр', priority: 'low' as const, status: 'pending' as const, blocker: false },
    { id: 5, title: 'Проверить лицензию на мед. деятельность', assignee: 'JARVIS', deadline: '26 мар', priority: 'medium' as const, status: 'completed' as const, blocker: false },
    { id: 6, title: 'Подготовить сравнительную таблицу DC-80 vs GE', assignee: 'JARVIS', deadline: '27 мар', priority: 'medium' as const, status: 'active' as const, blocker: false },
  ],
  team: [
    { name: 'Алексей М.', role: 'Менеджер сделки', avatar: 'АМ', tasks: 3, done: 1, zone: 'Переговоры, документация' },
    { name: 'Дмитрий В.', role: 'Продуктовый специалист', avatar: 'ДВ', tasks: 2, done: 1, zone: 'Техническая часть, демо' },
    { name: 'Ирина С.', role: 'Логист', avatar: 'ИС', tasks: 1, done: 0, zone: 'Доставка, монтаж' },
    { name: 'JARVIS', role: 'AI-ассистент', avatar: '🤖', tasks: 4, done: 2, zone: 'Документы, аналитика, мониторинг' },
  ],
  nextActions: [
    { action: 'Утвердить ТЗ и отправить на согласование заказчику', urgency: 'urgent' as const, who: 'Алексей М.' },
    { action: 'Запросить КП у 3 поставщиков для расчёта НМЦК', urgency: 'soon' as const, who: 'Алексей М.' },
    { action: 'Позвонить Петровой — уточнить требования по датчикам для кардиологии', urgency: 'soon' as const, who: 'Дмитрий В.' },
    { action: 'Подготовить презентацию для демо DC-80', urgency: 'planned' as const, who: 'Дмитрий В.' },
  ],
};

/* ─── JARVIS chat messages ─── */
const initialMessages: ChatMessage[] = [
  { id: 1, role: 'system', text: 'Контекст сделки загружен. Я знаю всё о ЦРБ Коломна и DC-80.' },
  { id: 2, role: 'assistant', text: '👋 Привет! Я слежу за этой сделкой. Вот что важно сейчас:\n\n🟡 **ТЗ ждёт утверждения** — это блокер для НМЦК.\n\n📋 Черновик я сгенерировал вчера, на основе тендерной документации. Проверь секцию «Требования к датчикам» — Петрова хотела кардиологический пакет.\n\n💡 Хочешь, подготовлю сравнительную таблицу DC-80 vs GE Voluson для переговоров?', ts: '14:30' },
  { id: 3, role: 'user', text: 'Да, подготовь сравнение. И напомни, когда дедлайн по НМЦК?', ts: '14:32' },
  { id: 4, role: 'assistant', text: '📊 **Сравнение готово** — добавил в документы как «Сравнение_DC80_vs_GE.pdf».\n\nПо НМЦК:\n• Дедлайн расчёта: **30 марта**\n• Нужны **3 коммерческих предложения** от разных поставщиков\n• Сейчас есть 0 из 3 КП\n\n⚠️ Если ТЗ не утвердишь до **28 марта**, НМЦК не успеем.\n\nМогу автоматически запросить КП у проверенных поставщиков из базы?', ts: '14:33' },
  { id: 5, role: 'user', text: 'Запроси КП автоматически', ts: '14:35' },
  { id: 6, role: 'assistant', text: '✅ Отправил запросы на КП трём поставщикам:\n\n1. **МедТехСнаб** (Москва) — ответ ожидаем до 27 мар\n2. **Альфа-Мед** (СПб) — до 28 мар\n3. **ДиагностПро** (Казань) — до 27 мар\n\nБуду мониторить ответы и обновлю досье автоматически. 🔔 Уведомлю, как только получу первое КП.', ts: '14:35' },
];

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant' | 'system';
  text: string;
  ts?: string;
}

function fmt(n: number) {
  return new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export function DealDossierView() {
  const d = dossierData;
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  return (
    <div className="flex gap-5 h-full">
      {/* ═══ LEFT: JARVIS CHAT ═══ */}
      <JarvisChat />

      {/* ═══ CENTER: DOSSIER CONTENT ═══ */}
      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 min-w-0 space-y-5 pb-8 overflow-y-auto pr-1">
        {/* HERO HEADER */}
        <motion.div variants={item} className="matte-glass p-6 relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">Сделка #{d.deal.id}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{d.deal.law}</span>
              </div>
              <h1 className="text-xl font-bold text-foreground mb-0.5">🏥 {d.deal.title} — {d.deal.customer}</h1>
              <p className="text-lg font-semibold text-primary font-mono">{fmt(d.deal.amount)}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] text-muted-foreground mb-1">Дедлайн</div>
              <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-node-active" />{d.deal.deadline}
              </div>
            </div>
          </div>
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
              <User className="w-3.5 h-3.5" />{d.deal.manager}
            </div>
          </div>
        </motion.div>

        {/* ═══ NEXT ACTIONS + RISKS — side by side ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div variants={item} className="matte-glass p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-node-active rounded-l-[14px]" />
            <SectionTitle icon={ArrowRight} color="text-node-active">Что делать дальше</SectionTitle>
            <div className="space-y-2">
              {d.nextActions.map((na, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-[10px] bg-muted/30 border border-border/50">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    na.urgency === 'urgent' ? 'bg-node-error animate-pulse' :
                    na.urgency === 'soon' ? 'bg-node-active' : 'bg-muted-foreground/40'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground">{na.action}</p>
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

        {/* ═══ TASKS (NEW) ═══ */}
        <motion.div variants={item} className="matte-glass p-5">
          <SectionTitle icon={ListChecks} color="text-primary">
            Задачи
            <span className="text-[9px] font-mono text-muted-foreground/60 ml-2">
              {d.tasks.filter(t => t.status === 'completed').length}/{d.tasks.length} выполнено
            </span>
          </SectionTitle>
          <div className="space-y-1.5">
            {d.tasks.map(task => (
              <div key={task.id} className={`flex items-center gap-3 p-2.5 rounded-[10px] border transition-all ${
                task.status === 'completed'
                  ? 'bg-node-completed/5 border-node-completed/20'
                  : task.blocker
                    ? 'bg-node-error/5 border-node-error/20'
                    : 'bg-muted/30 border-border/50'
              }`}>
                <div className="shrink-0">
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-node-completed" />
                  ) : task.status === 'active' ? (
                    <CircleDot className="w-4 h-4 text-node-active" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${task.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {task.title}
                    </span>
                    {task.blocker && (
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-node-error/15 text-node-error">БЛОКЕР</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1">
                    {task.assignee === 'JARVIS' ? (
                      <Bot className="w-3 h-3 text-[hsl(265_80%_65%)]" />
                    ) : (
                      <User className="w-3 h-3 text-muted-foreground/60" />
                    )}
                    <span className="text-[10px] text-muted-foreground">{task.assignee}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground/60">{task.deadline}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-node-error' :
                    task.priority === 'medium' ? 'bg-node-active' : 'bg-muted-foreground/30'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ═══ TEAM (NEW) ═══ */}
        <motion.div variants={item} className="matte-glass p-5">
          <SectionTitle icon={Users} color="text-primary">Команда проекта</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {d.team.map((member, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-[10px] bg-muted/30 border border-border/50">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                  member.name === 'JARVIS' ? 'bg-[hsl(265_80%_65%)/0.15]' : 'bg-primary/15 text-primary'
                }`}>
                  {member.name === 'JARVIS' ? '🤖' : member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{member.name}</span>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{member.role}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{member.zone}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${member.tasks > 0 ? (member.done / member.tasks) * 100 : 0}%` }} />
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground">{member.done}/{member.tasks}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* COUNTERPARTY + EQUIPMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />{d.counterparty.address}
              </div>
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
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><Phone className="w-3 h-3" />{c.phone}</div>
                        <div className="flex items-center gap-1 text-[10px] text-primary"><Mail className="w-3 h-3" />{c.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

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

        {/* PIPELINE */}
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
                <div key={i} className={`relative flex items-start gap-3 py-1.5 cursor-pointer rounded-[8px] px-2 -mx-2 transition-colors ${selectedStep === i ? 'bg-primary/10' : 'hover:bg-muted/30'}`} onClick={() => setSelectedStep(i)}>
                  <div className="absolute left-[-18px] top-2.5 z-10 bg-card rounded-full">{statusIcon}</div>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <span className={`text-xs ${step.status === 'completed' ? 'text-foreground' : step.status === 'active' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                    {step.date && <span className="text-[10px] font-mono text-muted-foreground/70">{step.date}</span>}
                    {step.assignee && <span className="text-[10px] text-muted-foreground">{step.assignee}</span>}
                  </div>
                  {step.warning && (
                    <div className="flex items-center gap-1 text-[10px] text-node-active bg-node-active/10 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-3 h-3" />{step.warning}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* DOCUMENTS + FINANCES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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

        {/* SIMILAR TENDERS */}
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

        {/* TIMELINE + RISKS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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

        {/* FOOTER */}
        <motion.div variants={item} className="flex items-center justify-between px-2 text-[10px] text-muted-foreground/60">
          <div className="flex items-center gap-4">
            <span>Обновлено: {d.deal.lastUpdated}</span>
            <span>Автор: <span className="text-[hsl(265_80%_65%)]">JARVIS</span></span>
            <span>Ответственный: {d.deal.manager}</span>
          </div>
          <button className="flex items-center gap-1 hover:text-primary transition-colors">
            <FileText className="w-3 h-3" />Экспорт
          </button>
        </motion.div>
      </motion.div>

      {/* ═══ RIGHT: TASKS + TIMELINE SIDEBAR ═══ */}
      <TasksTimelineSidebar data={d} />

      {/* ═══ STEP DETAIL POPUP (overlay on center) ═══ */}
      <AnimatePresence>
        {selectedStep !== null && stepDetails[selectedStep] && (
          <StepDetailPopup
            step={d.pipeline[selectedStep]}
            details={stepDetails[selectedStep]}
            onClose={() => setSelectedStep(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════ */
/* ═══ JARVIS CHAT PANEL                ═══ */
/* ═══════════════════════════════════════ */

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

    // Simulate JARVIS response
    setTimeout(() => {
      const response: ChatMessage = {
        id: nextId.current++,
        role: 'assistant',
        text: getJarvisResponse(input),
        ts: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(m => [...m, response]);
    }, 1200);
  };

  const quickActions = [
    { label: 'Статус сделки', prompt: 'Кратко: какой сейчас статус сделки?' },
    { label: 'Что блокирует?', prompt: 'Что сейчас блокирует продвижение сделки?' },
    { label: 'Подготовь к встрече', prompt: 'Подготовь меня к встрече по этой сделке' },
    { label: 'Сгенерируй ТЗ', prompt: 'Сгенерируй обновлённое ТЗ' },
  ];

  return (
    <div className="w-[456px] shrink-0 flex flex-col matte-glass overflow-hidden sticky top-0 h-[calc(100vh-160px)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-[hsl(265_80%_65%)/0.15] flex items-center justify-center">
          <Bot className="w-4 h-4 text-[hsl(265_80%_65%)]" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            JARVIS
            <span className="w-1.5 h-1.5 rounded-full bg-node-completed animate-pulse" />
          </div>
          <div className="text-[9px] text-muted-foreground">Контекст: {dossierData.deal.customer} • {dossierData.deal.id}</div>
        </div>
        <div className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[hsl(265_80%_65%)]" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div className="px-3 pb-2 flex flex-wrap gap-1.5">
        {quickActions.map((qa, i) => (
          <button
            key={i}
            onClick={() => { setInput(qa.prompt); }}
            className="text-[9px] px-2 py-1 rounded-full bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/50 transition-all"
          >
            {qa.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 p-2 rounded-[10px] bg-muted/40 border border-border">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Спроси JARVIS..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-1.5 rounded-[8px] bg-primary/15 hover:bg-primary/25 transition-colors disabled:opacity-30"
          >
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
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted/60 text-foreground border border-border/50 rounded-bl-sm'
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
          <div className={`text-[8px] font-mono text-muted-foreground/40 mt-0.5 ${isUser ? 'text-right' : ''}`}>
            {message.ts}
          </div>
        )}
      </div>
    </div>
  );
}

function getJarvisResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('статус')) {
    return '📊 **Текущий статус:**\n\n• Стадия: Подготовка (22%)\n• Активная задача: утверждение ТЗ\n• Блокер: ТЗ ждёт подписи\n• До дедлайна: 21 день\n\nОбщий прогноз: 🟡 средний риск. Если утвердишь ТЗ до 28-го, успеваем.';
  }
  if (lower.includes('блокир')) {
    return '🚧 **Блокеры:**\n\n1. **ТЗ не утверждено** — без него нельзя считать НМЦК\n   → Действие: открой черновик, проверь секцию датчиков\n\n2. **Нет КП для НМЦК** — нужны 3 штуки\n   → Я уже отправил запросы, ожидаем ответы 27-28 мар\n\nОстальное не блокирует, но следи за конкурентом GE.';
  }
  if (lower.includes('встреч')) {
    return '📋 **Подготовка к встрече:**\n\n**ЛПР:** Иванов И.И., зам. главврача\n**Техспец:** Петрова А.С., нач. УЗД\n\n**Ключевые моменты:**\n• Бюджет 6М утверждён\n• Конкурент GE — может дать ниже\n• Петрова хочет кардио-датчики — уточни\n• ТЗ готов, нужно согласовать\n\n💡 Рекомендую начать со сравнительной таблицы DC-80 vs GE — я уже подготовил.';
  }
  return '✨ Понял, работаю над этим. Обновлю досье когда будет готово.\n\nЧто-нибудь ещё по этой сделке?';
}

/* ═══ Step detail data ═══ */
const stepDetails: Record<number, { summary: string; details: string[]; documents?: string[]; contacts?: string[]; notes?: string[] }> = {
  0: {
    summary: 'Первый контакт с ЦРБ Коломна состоялся 12 марта. Встреча с зам. главврача Ивановым И.И.',
    details: ['Звонок от Иванова — запрос на УЗИ экспертного класса', 'Назначена очная встреча на 14 марта', 'Иванов подтвердил бюджет ~6М₽'],
    contacts: ['Иванов И.И. — ЛПР, зам. главврача по закупкам'],
    notes: ['Конкурент GE уже предлагал Voluson E10', 'Заказчик открыт к Mindray'],
  },
  1: {
    summary: 'Уточнение потребности: заказчику нужно 2 аппарата DC-80 для отделения УЗД.',
    details: ['Петрова А.С. уточнила: нужен кардиологический пакет датчиков', 'Объём: 2 шт Mindray DC-80', 'Размещение: кабинеты 201 и 205'],
    contacts: ['Петрова А.С. — нач. отд. УЗД, технический специалист'],
    notes: ['Петрова хочет демо DC-80 на месте', 'Текущее оборудование — устаревший Philips HD11'],
  },
  2: {
    summary: 'Коммерческое предложение отправлено 18 марта Иванову И.И.',
    details: ['КП на 5 600 000 ₽ за 2 аппарата', 'Включены: доставка, монтаж, обучение', 'Гарантия 3 года'],
    documents: ['КП_ЦРБ_Коломна_DC80.pdf — отправлено 18 мар'],
    notes: ['Цена ниже рынка на 7%', 'Иванов обещал рассмотреть до 22 марта'],
  },
  3: {
    summary: 'JARVIS автоматически сгенерировал черновик ТЗ на основе тендерной документации.',
    details: ['Черновик содержит 12 разделов', 'Секция «Датчики» требует проверки — Петрова просила кардио', '⚠️ Ждёт одобрения менеджера Алексея М.'],
    documents: ['ТЗ_УЗИ_DC80_draft.docx — AI-черновик, 25 мар'],
    notes: ['Блокер: без утверждённого ТЗ нельзя считать НМЦК', 'Дедлайн утверждения: 28 марта'],
  },
  4: {
    summary: 'Для расчёта НМЦК необходимо собрать 3 коммерческих предложения от разных поставщиков.',
    details: ['Запросы отправлены: МедТехСнаб, Альфа-Мед, ДиагностПро', 'Ожидаемые ответы: 27-28 марта', 'Дедлайн расчёта: 30 марта'],
    documents: ['НМЦК_расчёт.xlsx — ожидает данных'],
    notes: ['Без 3 КП НМЦК не пройдёт проверку', 'JARVIS мониторит почту на входящие КП'],
  },
  5: {
    summary: 'Подготовка заявки для подачи на электронную площадку.',
    details: ['Требуется: утверждённое ТЗ + НМЦК', 'Форма заявки — стандартная для 44-ФЗ', 'Планируемая дата: 5 апреля'],
    documents: ['Заявка_аукцион.pdf — не готово'],
  },
  6: {
    summary: 'Подача документов на электронную торговую площадку.',
    details: ['Площадка: РТС-тендер', 'Планируемая дата подачи: 10 апреля', 'Нужна ЭЦП руководителя'],
  },
  7: {
    summary: 'Электронный аукцион по 44-ФЗ.',
    details: ['Планируемая дата: 15 апреля', 'Стратегия: снижение до 5-15% от НМЦК', 'Основной конкурент: GE Healthcare'],
    notes: ['GE может демпинговать', 'Наше преимущество: сервис и гарантия'],
  },
};

/* ═══ STEP DETAIL POPUP ═══ */

function StepDetailPopup({ step, details, onClose }: {
  step: typeof dossierData.pipeline[0];
  details: { summary: string; details: string[]; documents?: string[]; contacts?: string[]; notes?: string[] };
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 w-[560px] max-h-[80vh] matte-glass shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <button onClick={onClose} className="w-7 h-7 rounded-[8px] bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {step.status === 'completed' ? (
                <CheckCircle className="w-4 h-4 text-node-completed" />
              ) : step.status === 'active' ? (
                <CircleDot className="w-4 h-4 text-node-active" />
              ) : (
                <Clock className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm font-semibold text-foreground">{step.label}</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              {step.date && <span className="text-[10px] font-mono text-muted-foreground">{step.date}</span>}
              {step.assignee && <span className="text-[10px] text-muted-foreground">{step.assignee}</span>}
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-[8px] bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="p-3 rounded-[10px] bg-primary/5 border border-primary/15">
            <p className="text-xs text-foreground leading-relaxed">{details.summary}</p>
          </div>

          <div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Детали</div>
            <div className="space-y-1.5">
              {details.details.map((d, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px]">
                  <ChevronRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {details.contacts && (
            <div>
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Контакты</div>
              <div className="space-y-1.5">
                {details.contacts.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-[8px] bg-muted/30 border border-border/50">
                    <User className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-[11px] text-foreground">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {details.documents && (
            <div>
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Документы</div>
              <div className="space-y-1.5">
                {details.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-[8px] bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                    <Paperclip className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="text-[11px] text-foreground">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {details.notes && (
            <div>
              <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Заметки</div>
              <div className="space-y-1.5">
                {details.notes.map((n, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-[8px] bg-node-active/5 border border-node-active/15">
                    <Star className="w-3 h-3 text-node-active shrink-0 mt-0.5" />
                    <span className="text-[11px] text-foreground/90">{n}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step.warning && (
            <div className="flex items-start gap-2 p-3 rounded-[10px] bg-node-active/10 border border-node-active/20">
              <AlertTriangle className="w-4 h-4 text-node-active shrink-0" />
              <span className="text-[11px] text-foreground">{step.warning}</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══ RIGHT SIDEBAR: TASKS + TIMELINE ═══ */

function TasksTimelineSidebar({ data }: { data: typeof dossierData }) {
  const d = data;
  const [tab, setTab] = useState<'tasks' | 'timeline'>('tasks');

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
          Задачи
          <span className="text-[9px] font-mono text-muted-foreground/60 ml-0.5">
            {d.tasks.filter(t => t.status === 'completed').length}/{d.tasks.length}
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

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === 'tasks' ? (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="px-3 py-3 space-y-3"
            >
              {/* Active / Pending tasks */}
              <div>
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2 px-1">Активные и ожидающие</div>
                <div className="space-y-1.5">
                  {d.tasks.filter(t => t.status !== 'completed').map(task => (
                    <div key={task.id} className={`flex items-start gap-3 p-3 rounded-[10px] border transition-all ${
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
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                            task.priority === 'high' ? 'bg-node-error/10 text-node-error' :
                            task.priority === 'medium' ? 'bg-node-active/10 text-node-active' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {task.priority === 'high' ? 'ВЫСОКИЙ' : task.priority === 'medium' ? 'СРЕДНИЙ' : 'НИЗКИЙ'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex items-center gap-1">
                            {task.assignee === 'JARVIS' ? (
                              <Bot className="w-3 h-3 text-[hsl(265_80%_65%)]" />
                            ) : (
                              <User className="w-3 h-3 text-muted-foreground/60" />
                            )}
                            <span className="text-[10px] text-muted-foreground">{task.assignee}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted-foreground/60" />
                            <span className="text-[10px] font-mono text-muted-foreground">{task.deadline}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed tasks */}
              <div>
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2 px-1">Выполнено</div>
                <div className="space-y-1.5">
                  {d.tasks.filter(t => t.status === 'completed').map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-[10px] bg-node-completed/5 border border-node-completed/20">
                      <CheckCircle className="w-4 h-4 text-node-completed shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-muted-foreground line-through">{task.title}</span>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            {task.assignee === 'JARVIS' ? (
                              <Bot className="w-3 h-3 text-[hsl(265_80%_65%)]" />
                            ) : (
                              <User className="w-3 h-3 text-muted-foreground/60" />
                            )}
                            <span className="text-[10px] text-muted-foreground">{task.assignee}</span>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground/60">{task.deadline}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="px-3 py-3"
            >
              <div className="relative pl-5 space-y-0">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                {d.timeline.map((ev, i) => {
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
                        <span className="text-[9px] font-mono text-muted-foreground/50 mt-1 block">{ev.date}</span>
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

/* ─── Project + Deals data model ─── */

export type DealStatus = 'preparation' | 'submitted' | 'auction' | 'won' | 'lost' | 'execution' | 'completed';
export type TaskStatus = 'active' | 'pending' | 'completed';
export type Priority = 'high' | 'medium' | 'low';
export type Urgency = 'urgent' | 'soon' | 'planned';
export type TimelineIcon = 'ai' | 'human' | 'system';
export type RiskLevel = 'warning' | 'ok';

export interface ProjectTask {
  id: number;
  title: string;
  assignee: string;
  deadline: string;
  priority: Priority;
  status: TaskStatus;
  blocker: boolean;
  /** null = project-level, string = deal id */
  dealId: string | null;
}

export interface ProjectDocument {
  name: string;
  status: 'sent' | 'ai-draft' | 'pending' | 'signed' | 'approved';
  date: string;
  dealId: string | null;
}

export interface TimelineEntry {
  date: string;
  icon: TimelineIcon;
  text: string;
  dealId: string | null;
}

export interface ProjectDeal {
  id: string;
  title: string;
  law: string;
  amount: number;
  status: DealStatus;
  progress: number;
  deadline: string;
  equipment: string;
  quantity: number;
  platform: string;
  manager: string;
  tasks: ProjectTask[];
  documents: ProjectDocument[];
  timeline: TimelineEntry[];
  risks: { level: RiskLevel; text: string }[];
  nextActions: { action: string; urgency: Urgency; who: string }[];
}

export interface ProjectData {
  project: {
    id: string;
    title: string;
    customer: string;
    fullName: string;
    inn: string;
    region: string;
    category: string;
    manager: string;
    lastUpdated: string;
    contacts: { name: string; role: string; position: string; phone: string; email: string }[];
  };
  /** Project-level tasks (before any deal) */
  tasks: ProjectTask[];
  documents: ProjectDocument[];
  timeline: TimelineEntry[];
  deals: ProjectDeal[];
}

function fmt(n: number) {
  return new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
}

export { fmt };

export const dealStatusLabels: Record<DealStatus, string> = {
  preparation: 'Подготовка',
  submitted: 'Подана',
  auction: 'Торги',
  won: 'Выиграна',
  lost: 'Проиграна',
  execution: 'Исполнение',
  completed: 'Завершена',
};

export const dealStatusColors: Record<DealStatus, string> = {
  preparation: 'bg-node-active/15 text-node-active border-node-active/30',
  submitted: 'bg-primary/15 text-primary border-primary/30',
  auction: 'bg-[hsl(265_80%_65%)/0.15] text-[hsl(265_80%_65%)] border-[hsl(265_80%_65%)/0.3]',
  won: 'bg-node-completed/15 text-node-completed border-node-completed/30',
  lost: 'bg-node-error/15 text-node-error border-node-error/30',
  execution: 'bg-primary/15 text-primary border-primary/30',
  completed: 'bg-muted text-muted-foreground border-border',
};

export const projectData: ProjectData = {
  project: {
    id: 'P-12',
    title: 'ЦРБ Коломна — модернизация УЗД',
    customer: 'ЦРБ Коломна',
    fullName: 'ОГБУЗ «Центральная районная больница г. Коломна»',
    inn: '5022012345',
    region: 'Московская область',
    category: 'УЗИ',
    manager: 'Алексей М.',
    lastUpdated: '25 мар 2026, 14:35',
    contacts: [
      { name: 'Иванов И.И.', role: 'ЛПР', position: 'Зам. главврача по закупкам', phone: '+7-916-xxx-xx-xx', email: 'ivanov@crb.ru' },
      { name: 'Петрова А.С.', role: 'Техн. спец.', position: 'Нач. отд. УЗД', phone: '+7-926-xxx-xx-xx', email: 'petrova@crb.ru' },
      { name: 'Сидоров В.М.', role: 'Финансы', position: 'Главный бухгалтер', phone: '+7-915-xxx-xx-xx', email: 'sidorov@crb.ru' },
    ],
  },

  // Project-level tasks (pre-deal phase)
  tasks: [
    { id: 100, title: 'Провести первичную встречу с заказчиком', assignee: 'Алексей М.', deadline: '12 мар', priority: 'high', status: 'completed', blocker: false, dealId: null },
    { id: 101, title: 'Уточнить потребности по оборудованию', assignee: 'Дмитрий В.', deadline: '14 мар', priority: 'high', status: 'completed', blocker: false, dealId: null },
    { id: 102, title: 'Подготовить общее коммерческое предложение', assignee: 'Алексей М.', deadline: '20 мар', priority: 'high', status: 'completed', blocker: false, dealId: null },
    { id: 103, title: 'Провести демонстрацию оборудования', assignee: 'Дмитрий В.', deadline: '1 апр', priority: 'medium', status: 'active', blocker: false, dealId: null },
    { id: 104, title: 'Согласовать бюджетные рамки', assignee: 'Алексей М.', deadline: '5 апр', priority: 'high', status: 'pending', blocker: true, dealId: null },
  ],

  documents: [
    { name: 'КП_общее_ЦРБ_Коломна.pdf', status: 'sent', date: '20 мар', dealId: null },
    { name: 'Протокол_встречи_12мар.docx', status: 'approved', date: '12 мар', dealId: null },
    { name: 'Презентация_оборудование.pptx', status: 'ai-draft', date: '22 мар', dealId: null },
  ],

  timeline: [
    { date: '25 мар 14:30', icon: 'ai', text: 'JARVIS обновил аналитику по всем сделкам проекта', dealId: null },
    { date: '22 мар 16:00', icon: 'system', text: 'Найдены 3 новых тендера, подходящих под проект', dealId: null },
    { date: '20 мар 11:00', icon: 'human', text: 'Отправлено общее КП заказчику', dealId: null },
    { date: '14 мар 15:45', icon: 'human', text: 'Встреча: уточнили потребности — 3 направления', dealId: null },
    { date: '12 мар 10:00', icon: 'human', text: 'Первый контакт, создан проект', dealId: null },
  ],

  deals: [
    {
      id: 'D-52',
      title: 'УЗИ Mindray DC-80 × 2 шт',
      law: '44-ФЗ Электронный аукцион',
      amount: 6_000_000,
      status: 'preparation',
      progress: 22,
      deadline: '15 апреля 2026',
      equipment: 'Mindray DC-80',
      quantity: 2,
      platform: 'РТС-тендер',
      manager: 'Алексей М.',
      tasks: [
        { id: 1, title: 'Утвердить черновик ТЗ', assignee: 'Алексей М.', deadline: '28 мар', priority: 'high', status: 'active', blocker: true, dealId: 'D-52' },
        { id: 2, title: 'Собрать 3 КП для НМЦК', assignee: 'Алексей М.', deadline: '30 мар', priority: 'high', status: 'pending', blocker: false, dealId: 'D-52' },
        { id: 3, title: 'Уточнить комплектацию датчиков', assignee: 'Дмитрий В.', deadline: '27 мар', priority: 'medium', status: 'active', blocker: false, dealId: 'D-52' },
        { id: 4, title: 'Подготовить заявку на ЭТП', assignee: 'Алексей М.', deadline: '5 апр', priority: 'medium', status: 'pending', blocker: false, dealId: 'D-52' },
      ],
      documents: [
        { name: 'ТЗ_УЗИ_DC80_draft.docx', status: 'ai-draft', date: '25 мар', dealId: 'D-52' },
        { name: 'НМЦК_расчёт_DC80.xlsx', status: 'pending', date: '', dealId: 'D-52' },
        { name: 'Заявка_аукцион_DC80.pdf', status: 'pending', date: '', dealId: 'D-52' },
      ],
      timeline: [
        { date: '25 мар 14:30', icon: 'ai', text: 'AI сгенерировал черновик ТЗ', dealId: 'D-52' },
        { date: '22 мар 16:00', icon: 'system', text: 'Тендер опубликован на РТС', dealId: 'D-52' },
      ],
      risks: [
        { level: 'warning', text: 'ТЗ ждёт одобрения — блокирует НМЦК' },
        { level: 'warning', text: 'Конкурент GE может дать цену ниже' },
        { level: 'ok', text: 'РУ действует до 2028' },
      ],
      nextActions: [
        { action: 'Утвердить ТЗ и отправить заказчику', urgency: 'urgent', who: 'Алексей М.' },
        { action: 'Собрать 3 КП для НМЦК', urgency: 'soon', who: 'Алексей М.' },
      ],
    },
    {
      id: 'D-53',
      title: 'КТ Mindray ScintCare CT 520 Pro',
      law: '44-ФЗ Конкурс',
      amount: 18_500_000,
      status: 'submitted',
      progress: 45,
      deadline: '20 апреля 2026',
      equipment: 'Mindray ScintCare CT 520 Pro',
      quantity: 1,
      platform: 'Сбербанк-АСТ',
      manager: 'Алексей М.',
      tasks: [
        { id: 10, title: 'Ожидать результаты рассмотрения заявки', assignee: 'Алексей М.', deadline: '10 апр', priority: 'high', status: 'active', blocker: false, dealId: 'D-53' },
        { id: 11, title: 'Подготовить презентацию для конкурсной комиссии', assignee: 'Дмитрий В.', deadline: '12 апр', priority: 'medium', status: 'pending', blocker: false, dealId: 'D-53' },
      ],
      documents: [
        { name: 'Заявка_конкурс_КТ520.pdf', status: 'sent', date: '18 мар', dealId: 'D-53' },
        { name: 'ТЗ_КТ520_v2.docx', status: 'approved', date: '15 мар', dealId: 'D-53' },
        { name: 'НМЦК_КТ520.xlsx', status: 'approved', date: '16 мар', dealId: 'D-53' },
      ],
      timeline: [
        { date: '18 мар 15:20', icon: 'human', text: 'Заявка подана на Сбербанк-АСТ', dealId: 'D-53' },
        { date: '16 мар 11:00', icon: 'ai', text: 'НМЦК рассчитана и утверждена', dealId: 'D-53' },
      ],
      risks: [
        { level: 'ok', text: 'Заявка подана вовремя' },
        { level: 'warning', text: 'Сильный конкурент — Siemens Healthineers' },
      ],
      nextActions: [
        { action: 'Ждать результат рассмотрения первых частей', urgency: 'soon', who: 'Алексей М.' },
      ],
    },
    {
      id: 'D-54',
      title: 'Рентген Mindray DigiEye 760 × 3',
      law: '223-ФЗ',
      amount: 9_200_000,
      status: 'auction',
      progress: 68,
      deadline: '28 марта 2026',
      equipment: 'Mindray DigiEye 760',
      quantity: 3,
      platform: 'ЕИС',
      manager: 'Ирина С.',
      tasks: [
        { id: 20, title: 'Участвовать в аукционе', assignee: 'Ирина С.', deadline: '28 мар', priority: 'high', status: 'active', blocker: true, dealId: 'D-54' },
        { id: 21, title: 'Подготовить ценовую стратегию', assignee: 'JARVIS', deadline: '27 мар', priority: 'high', status: 'completed', blocker: false, dealId: 'D-54' },
      ],
      documents: [
        { name: 'Заявка_рентген_760.pdf', status: 'sent', date: '20 мар', dealId: 'D-54' },
        { name: 'Стратегия_торгов.pdf', status: 'ai-draft', date: '27 мар', dealId: 'D-54' },
      ],
      timeline: [
        { date: '27 мар 09:00', icon: 'ai', text: 'JARVIS подготовил стратегию торгов', dealId: 'D-54' },
        { date: '20 мар 14:00', icon: 'human', text: 'Заявка подана на ЕИС', dealId: 'D-54' },
      ],
      risks: [
        { level: 'warning', text: 'Аукцион завтра — нужна готовность' },
        { level: 'ok', text: 'Ценовое преимущество 12%' },
      ],
      nextActions: [
        { action: 'Участвовать в аукционе 28 марта в 10:00', urgency: 'urgent', who: 'Ирина С.' },
      ],
    },
    {
      id: 'D-55',
      title: 'Эндоскоп Mindray HD-580',
      law: '44-ФЗ Электронный аукцион',
      amount: 4_800_000,
      status: 'won',
      progress: 85,
      deadline: '10 марта 2026',
      equipment: 'Mindray HD-580',
      quantity: 2,
      platform: 'РТС-тендер',
      manager: 'Алексей М.',
      tasks: [
        { id: 30, title: 'Подписать контракт', assignee: 'Алексей М.', deadline: '15 мар', priority: 'high', status: 'completed', blocker: false, dealId: 'D-55' },
        { id: 31, title: 'Заказать оборудование у вендора', assignee: 'Марина С.', deadline: '20 мар', priority: 'high', status: 'completed', blocker: false, dealId: 'D-55' },
        { id: 32, title: 'Организовать доставку', assignee: 'Ирина С.', deadline: '5 апр', priority: 'medium', status: 'active', blocker: false, dealId: 'D-55' },
        { id: 33, title: 'Провести монтаж и ПНР', assignee: 'Инженер', deadline: '15 апр', priority: 'medium', status: 'pending', blocker: false, dealId: 'D-55' },
      ],
      documents: [
        { name: 'Контракт_HD580.pdf', status: 'signed', date: '15 мар', dealId: 'D-55' },
        { name: 'Счёт_вендор_HD580.pdf', status: 'approved', date: '20 мар', dealId: 'D-55' },
      ],
      timeline: [
        { date: '20 мар 10:00', icon: 'human', text: 'Оборудование заказано у Mindray', dealId: 'D-55' },
        { date: '15 мар 14:00', icon: 'human', text: 'Контракт подписан', dealId: 'D-55' },
        { date: '10 мар 11:30', icon: 'system', text: 'Аукцион выигран, снижение 8%', dealId: 'D-55' },
      ],
      risks: [
        { level: 'ok', text: 'Контракт подписан, оборудование заказано' },
        { level: 'warning', text: 'Срок поставки — уточнить у вендора' },
      ],
      nextActions: [
        { action: 'Уточнить сроки поставки у Mindray', urgency: 'soon', who: 'Марина С.' },
        { action: 'Подготовить площадку у заказчика', urgency: 'planned', who: 'Ирина С.' },
      ],
    },
    {
      id: 'D-56',
      title: 'Мониторы Mindray BeneVision N22 × 10',
      law: '44-ФЗ Котировки',
      amount: 3_200_000,
      status: 'execution',
      progress: 72,
      deadline: '5 апреля 2026',
      equipment: 'Mindray BeneVision N22',
      quantity: 10,
      platform: 'ЕИС',
      manager: 'Ирина С.',
      tasks: [
        { id: 40, title: 'Доставка в ЦРБ', assignee: 'Логист', deadline: '1 апр', priority: 'high', status: 'active', blocker: false, dealId: 'D-56' },
        { id: 41, title: 'Приёмка и экспертиза', assignee: 'Заказчик', deadline: '5 апр', priority: 'high', status: 'pending', blocker: false, dealId: 'D-56' },
      ],
      documents: [
        { name: 'Контракт_N22.pdf', status: 'signed', date: '1 мар', dealId: 'D-56' },
        { name: 'Накладная_N22.pdf', status: 'pending', date: '', dealId: 'D-56' },
      ],
      timeline: [
        { date: '25 мар 09:00', icon: 'system', text: 'Оборудование отгружено со склада', dealId: 'D-56' },
        { date: '1 мар 16:00', icon: 'human', text: 'Контракт подписан', dealId: 'D-56' },
      ],
      risks: [
        { level: 'ok', text: 'Оборудование в пути' },
      ],
      nextActions: [
        { action: 'Контроль доставки — ETA 1 апреля', urgency: 'soon', who: 'Логист' },
      ],
    },
    {
      id: 'D-57',
      title: 'Аппарат ИВЛ Mindray SV800 × 5',
      law: '44-ФЗ Электронный аукцион',
      amount: 12_500_000,
      status: 'lost',
      progress: 100,
      deadline: '5 марта 2026',
      equipment: 'Mindray SV800',
      quantity: 5,
      platform: 'Сбербанк-АСТ',
      manager: 'Алексей М.',
      tasks: [
        { id: 50, title: 'Провести анализ проигрыша', assignee: 'JARVIS', deadline: '10 мар', priority: 'medium', status: 'completed', blocker: false, dealId: 'D-57' },
      ],
      documents: [
        { name: 'Анализ_проигрыша_SV800.pdf', status: 'ai-draft', date: '10 мар', dealId: 'D-57' },
      ],
      timeline: [
        { date: '10 мар 12:00', icon: 'ai', text: 'JARVIS сформировал отчёт по проигрышу', dealId: 'D-57' },
        { date: '5 мар 14:00', icon: 'system', text: 'Проигран аукцион — конкурент снизил на 22%', dealId: 'D-57' },
      ],
      risks: [
        { level: 'warning', text: 'Потеряна сделка на 12.5M — демпинг конкурента' },
      ],
      nextActions: [],
    },
    {
      id: 'D-58',
      title: 'Наркозный аппарат WATO EX-65 Pro',
      law: '223-ФЗ',
      amount: 7_800_000,
      status: 'preparation',
      progress: 10,
      deadline: '30 апреля 2026',
      equipment: 'Mindray WATO EX-65 Pro',
      quantity: 2,
      platform: 'B2B-Center',
      manager: 'Алексей М.',
      tasks: [
        { id: 60, title: 'Изучить требования ТЗ', assignee: 'JARVIS', deadline: '28 мар', priority: 'high', status: 'active', blocker: false, dealId: 'D-58' },
        { id: 61, title: 'Подготовить конфигурацию', assignee: 'Дмитрий В.', deadline: '2 апр', priority: 'medium', status: 'pending', blocker: false, dealId: 'D-58' },
      ],
      documents: [
        { name: 'Тендерная_документация_EX65.pdf', status: 'approved', date: '24 мар', dealId: 'D-58' },
      ],
      timeline: [
        { date: '24 мар 10:00', icon: 'system', text: 'Найден подходящий тендер на B2B-Center', dealId: 'D-58' },
      ],
      risks: [
        { level: 'ok', text: 'Нет прямых конкурентов по данной модели' },
      ],
      nextActions: [
        { action: 'Проанализировать ТЗ и подготовить ответ', urgency: 'soon', who: 'JARVIS' },
      ],
    },
  ],
};

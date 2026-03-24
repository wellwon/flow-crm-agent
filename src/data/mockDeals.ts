export type DealStatus = 'new' | 'qualification' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Deal {
  id: string;
  title: string;
  company: string;
  amount: number;
  status: DealStatus;
  progress: number;
  manager: { name: string; avatar: string };
  deadline: string;
  nextStep: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  region: string;
  category: string;
}

export const dealStatusLabels: Record<DealStatus, string> = {
  new: 'Новая',
  qualification: 'Квалификация',
  proposal: 'Предложение',
  negotiation: 'Переговоры',
  won: 'Выиграна',
  lost: 'Проиграна',
};

export const dealStatusColors: Record<DealStatus, string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  qualification: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  proposal: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  negotiation: 'bg-primary/20 text-primary border-primary/30',
  won: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  lost: 'bg-destructive/20 text-red-400 border-destructive/30',
};

export const mockDeals: Deal[] = [
  {
    id: '1', title: 'КТ-аппарат Siemens SOMATOM', company: 'ГКБ №1 им. Пирогова',
    amount: 45_000_000, status: 'negotiation', progress: 72,
    manager: { name: 'Алексей К.', avatar: 'АК' }, deadline: '2026-04-15',
    nextStep: 'Согласование спецификации', createdAt: '2026-01-10', priority: 'high',
    region: 'Москва', category: 'КТ',
  },
  {
    id: '2', title: 'МРТ GE SIGNA Premier', company: 'НМИЦ Кардиологии',
    amount: 78_000_000, status: 'proposal', progress: 45,
    manager: { name: 'Мария Л.', avatar: 'МЛ' }, deadline: '2026-05-01',
    nextStep: 'Подготовка КП', createdAt: '2026-02-05', priority: 'high',
    region: 'Москва', category: 'МРТ',
  },
  {
    id: '3', title: 'УЗИ Philips EPIQ Elite', company: 'Клиника «Медси»',
    amount: 12_500_000, status: 'qualification', progress: 25,
    manager: { name: 'Дмитрий В.', avatar: 'ДВ' }, deadline: '2026-04-28',
    nextStep: 'Демонстрация оборудования', createdAt: '2026-03-01', priority: 'medium',
    region: 'Санкт-Петербург', category: 'УЗИ',
  },
  {
    id: '4', title: 'Рентген-комплекс Carestream', company: 'Поликлиника №42',
    amount: 8_200_000, status: 'new', progress: 5,
    manager: { name: 'Алексей К.', avatar: 'АК' }, deadline: '2026-06-10',
    nextStep: 'Первичный контакт', createdAt: '2026-03-18', priority: 'low',
    region: 'Казань', category: 'Рентген',
  },
  {
    id: '5', title: 'Ангиограф Philips Azurion', company: 'ФЦССХ Астрахань',
    amount: 120_000_000, status: 'negotiation', progress: 85,
    manager: { name: 'Мария Л.', avatar: 'МЛ' }, deadline: '2026-04-05',
    nextStep: 'Финальное согласование цены', createdAt: '2025-11-20', priority: 'high',
    region: 'Астрахань', category: 'Ангиография',
  },
  {
    id: '6', title: 'Эндоскопическая стойка Olympus', company: 'ГКБ №31',
    amount: 6_800_000, status: 'won', progress: 100,
    manager: { name: 'Дмитрий В.', avatar: 'ДВ' }, deadline: '2026-03-20',
    nextStep: 'Поставка оборудования', createdAt: '2025-12-15', priority: 'medium',
    region: 'Москва', category: 'Эндоскопия',
  },
  {
    id: '7', title: 'Лабораторный анализатор Roche', company: 'Инвитро',
    amount: 15_400_000, status: 'proposal', progress: 50,
    manager: { name: 'Алексей К.', avatar: 'АК' }, deadline: '2026-05-15',
    nextStep: 'Ревизия ТЗ', createdAt: '2026-02-20', priority: 'medium',
    region: 'Новосибирск', category: 'Лаборатория',
  },
  {
    id: '8', title: 'Наркозный аппарат Dräger', company: 'РДКБ',
    amount: 3_200_000, status: 'lost', progress: 60,
    manager: { name: 'Мария Л.', avatar: 'МЛ' }, deadline: '2026-03-01',
    nextStep: '—', createdAt: '2026-01-05', priority: 'low',
    region: 'Москва', category: 'Анестезиология',
  },
];

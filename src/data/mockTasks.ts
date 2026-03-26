import { type TaskStatus, type Priority } from '@/data/mockProjectData';

export interface GlobalTask {
  id: number;
  title: string;
  assignee: string;
  deadline: string;
  priority: Priority;
  status: TaskStatus;
  blocker: boolean;
  projectId: string;
  projectTitle: string;
  dealId: string | null;
  dealTitle: string | null;
  createdAt: string;
  tags?: string[];
  aiReason?: string; // AI explanation for Focus view
}

export const mockGlobalTasks: GlobalTask[] = [
  // Project P-12: ЦРБ Коломна
  { id: 1, title: 'Утвердить черновик ТЗ', assignee: 'Алексей М.', deadline: '2026-03-28', priority: 'high', status: 'active', blocker: true, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: 'D-52', dealTitle: 'УЗИ Mindray DC-80 × 2 шт', createdAt: '2026-03-20', aiReason: 'Блокирует расчёт НМЦК и подачу заявки. Дедлайн через 2 дня.' },
  { id: 2, title: 'Собрать 3 КП для НМЦК', assignee: 'Алексей М.', deadline: '2026-03-30', priority: 'high', status: 'pending', blocker: false, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: 'D-52', dealTitle: 'УЗИ Mindray DC-80 × 2 шт', createdAt: '2026-03-20', aiReason: 'Зависит от утверждённого ТЗ.' },
  { id: 3, title: 'Уточнить комплектацию датчиков', assignee: 'Дмитрий В.', deadline: '2026-03-27', priority: 'medium', status: 'active', blocker: false, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: 'D-52', dealTitle: 'УЗИ Mindray DC-80 × 2 шт', createdAt: '2026-03-22' },
  { id: 4, title: 'Подготовить заявку на ЭТП', assignee: 'Алексей М.', deadline: '2026-04-05', priority: 'medium', status: 'pending', blocker: false, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: 'D-52', dealTitle: 'УЗИ Mindray DC-80 × 2 шт', createdAt: '2026-03-20' },
  { id: 10, title: 'Ожидать результаты рассмотрения заявки', assignee: 'Алексей М.', deadline: '2026-04-10', priority: 'high', status: 'active', blocker: false, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: 'D-53', dealTitle: 'КТ Mindray ScintCare CT 520 Pro', createdAt: '2026-03-18' },
  { id: 11, title: 'Подготовить презентацию для комиссии', assignee: 'Дмитрий В.', deadline: '2026-04-12', priority: 'medium', status: 'pending', blocker: false, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: 'D-53', dealTitle: 'КТ Mindray ScintCare CT 520 Pro', createdAt: '2026-03-19' },
  { id: 20, title: 'Участвовать в аукционе', assignee: 'Ирина С.', deadline: '2026-03-28', priority: 'high', status: 'active', blocker: true, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: 'D-54', dealTitle: 'Рентген Mindray DigiEye 760 × 3', createdAt: '2026-03-20', aiReason: 'Аукцион сегодня в 10:00! Критический дедлайн.' },
  { id: 21, title: 'Подготовить ценовую стратегию', assignee: 'JARVIS', deadline: '2026-03-27', priority: 'high', status: 'completed', blocker: false, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: 'D-54', dealTitle: 'Рентген Mindray DigiEye 760 × 3', createdAt: '2026-03-25' },
  { id: 32, title: 'Организовать доставку', assignee: 'Ирина С.', deadline: '2026-04-05', priority: 'medium', status: 'active', blocker: false, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: 'D-55', dealTitle: 'Эндоскоп Mindray HD-580', createdAt: '2026-03-20' },
  { id: 33, title: 'Провести монтаж и ПНР', assignee: 'Дмитрий В.', deadline: '2026-04-15', priority: 'medium', status: 'pending', blocker: false, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: 'D-55', dealTitle: 'Эндоскоп Mindray HD-580', createdAt: '2026-03-20' },
  { id: 40, title: 'Доставка в ЦРБ', assignee: 'Ирина С.', deadline: '2026-04-01', priority: 'high', status: 'active', blocker: false, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: 'D-56', dealTitle: 'Мониторы Mindray BeneVision N22 × 10', createdAt: '2026-03-25', aiReason: 'Оборудование уже отгружено. Контроль ETA.' },
  { id: 103, title: 'Провести демонстрацию оборудования', assignee: 'Дмитрий В.', deadline: '2026-04-01', priority: 'medium', status: 'active', blocker: false, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: null, dealTitle: null, createdAt: '2026-03-14' },
  { id: 104, title: 'Согласовать бюджетные рамки', assignee: 'Алексей М.', deadline: '2026-04-05', priority: 'high', status: 'pending', blocker: true, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: null, dealTitle: null, createdAt: '2026-03-14', aiReason: 'Без согласования бюджета невозможно запустить новые сделки.' },

  // Project P-15: ГКБ №7 Москва
  { id: 200, title: 'Подготовить ТЗ на МРТ', assignee: 'Алексей М.', deadline: '2026-04-02', priority: 'high', status: 'active', blocker: false, projectId: 'P-15', projectTitle: 'ГКБ №7 Москва — МРТ и КТ', dealId: 'D-60', dealTitle: 'МРТ Siemens MAGNETOM Free.Max', createdAt: '2026-03-22', aiReason: 'Дедлайн через неделю, ТЗ ещё не начато.' },
  { id: 201, title: 'Провести переговоры с Siemens', assignee: 'Марина С.', deadline: '2026-04-03', priority: 'high', status: 'pending', blocker: false, projectId: 'P-15', projectTitle: 'ГКБ №7 Москва — МРТ и КТ', dealId: 'D-60', dealTitle: 'МРТ Siemens MAGNETOM Free.Max', createdAt: '2026-03-22' },
  { id: 202, title: 'Оценить площадку для установки МРТ', assignee: 'Дмитрий В.', deadline: '2026-04-08', priority: 'medium', status: 'pending', blocker: false, projectId: 'P-15', projectTitle: 'ГКБ №7 Москва — МРТ и КТ', dealId: 'D-60', dealTitle: 'МРТ Siemens MAGNETOM Free.Max', createdAt: '2026-03-22' },
  { id: 210, title: 'Проверить РУ на оборудование', assignee: 'Марина С.', deadline: '2026-03-29', priority: 'high', status: 'active', blocker: true, projectId: 'P-15', projectTitle: 'ГКБ №7 Москва — МРТ и КТ', dealId: 'D-61', dealTitle: 'КТ Philips Incisive CT', createdAt: '2026-03-20', aiReason: 'Без РУ невозможна подача заявки. Срок — завтра!' },
  { id: 211, title: 'Согласовать логистику с ООО МедТранс', assignee: 'Ирина С.', deadline: '2026-04-10', priority: 'low', status: 'pending', blocker: false, projectId: 'P-15', projectTitle: 'ГКБ №7 Москва — МРТ и КТ', dealId: 'D-61', dealTitle: 'КТ Philips Incisive CT', createdAt: '2026-03-22' },

  // Project P-18: Областная клиника Казань
  { id: 300, title: 'Отправить КП заказчику', assignee: 'Алексей М.', deadline: '2026-03-26', priority: 'high', status: 'active', blocker: false, projectId: 'P-18', projectTitle: 'Областная клиника Казань — лаборатория', dealId: 'D-70', dealTitle: 'Анализаторы Mindray BC-6800 Plus × 4', createdAt: '2026-03-24', aiReason: 'Дедлайн сегодня! КП готово, нужна отправка.' },
  { id: 301, title: 'Запросить скидку у вендора', assignee: 'Марина С.', deadline: '2026-03-30', priority: 'medium', status: 'active', blocker: false, projectId: 'P-18', projectTitle: 'Областная клиника Казань — лаборатория', dealId: 'D-70', dealTitle: 'Анализаторы Mindray BC-6800 Plus × 4', createdAt: '2026-03-24' },
  { id: 302, title: 'Подготовить документацию для конкурса', assignee: 'Алексей М.', deadline: '2026-04-05', priority: 'high', status: 'pending', blocker: false, projectId: 'P-18', projectTitle: 'Областная клиника Казань — лаборатория', dealId: 'D-71', dealTitle: 'Центрифуги лабораторные × 8', createdAt: '2026-03-22' },
  { id: 303, title: 'Проверить сертификаты на центрифуги', assignee: 'Дмитрий В.', deadline: '2026-04-01', priority: 'medium', status: 'active', blocker: false, projectId: 'P-18', projectTitle: 'Областная клиника Казань — лаборатория', dealId: 'D-71', dealTitle: 'Центрифуги лабораторные × 8', createdAt: '2026-03-22' },

  // Completed tasks for variety
  { id: 100, title: 'Провести первичную встречу с заказчиком', assignee: 'Алексей М.', deadline: '2026-03-12', priority: 'high', status: 'completed', blocker: false, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: null, dealTitle: null, createdAt: '2026-03-10' },
  { id: 101, title: 'Уточнить потребности по оборудованию', assignee: 'Дмитрий В.', deadline: '2026-03-14', priority: 'high', status: 'completed', blocker: false, projectId: 'P-12', projectTitle: 'ЦРБ Коломна — модернизация УЗД', dealId: null, dealTitle: null, createdAt: '2026-03-10' },
];

// Helpers
export const allProjects = [...new Set(mockGlobalTasks.map(t => t.projectTitle))].sort();
export const allAssignees = [...new Set(mockGlobalTasks.map(t => t.assignee))].sort();
export const allTaskStatuses: Array<{ value: string; label: string }> = [
  { value: 'active', label: 'Активные' },
  { value: 'pending', label: 'Ожидают' },
  { value: 'completed', label: 'Завершённые' },
];
export const allPriorityOptions: Array<{ value: string; label: string }> = [
  { value: 'high', label: 'Высокий' },
  { value: 'medium', label: 'Средний' },
  { value: 'low', label: 'Низкий' },
];

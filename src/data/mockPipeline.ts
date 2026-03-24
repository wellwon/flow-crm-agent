import { Node, Edge } from '@xyflow/react';
import type { PipelineNodeData } from '@/types/pipeline';

// Full 44-FZ tender pipeline: 5 phases, 28+ nodes
export const initialNodes: Node<PipelineNodeData>[] = [
  // ═══ PHASE 1: PRE-SALE ═══
  {
    id: 'n-1', type: 'holoNode', position: { x: 0, y: 280 },
    data: { label: 'ОБ Коломна, 3× УЗИ', summary: 'Старт сделки — поставка оборудования', status: 'completed', type: 'start', progress: 100, assignee: 'Система', phase: 'PRE-SALE' },
  },
  {
    id: 'n-2', type: 'holoNode', position: { x: 280, y: 160 },
    data: { label: 'AI Парсинг тендера', summary: 'Автоматический разбор ТЗ тендера', status: 'completed', type: 'ai-enrich', progress: 100, assignee: 'JARVIS AI', phase: 'PRE-SALE' },
  },
  {
    id: 'n-3', type: 'holoNode', position: { x: 280, y: 400 },
    data: { label: 'Обогащение заказчика', summary: 'ИНН, бюджет, история закупок', status: 'completed', type: 'ai-enrich', progress: 100, assignee: 'JARVIS AI', phase: 'PRE-SALE' },
  },
  {
    id: 'n-4', type: 'holoNode', position: { x: 560, y: 280 },
    data: { label: 'Go/No-Go квалификация', summary: 'Решение об участии в тендере', status: 'completed', type: 'decision-fork', progress: 100, assignee: 'Иван Р.', phase: 'PRE-SALE' },
  },
  {
    id: 'n-5', type: 'holoNode', position: { x: 840, y: 100 },
    data: { label: 'Анализ конкурентов', summary: 'Сравнение позиций участников', status: 'completed', type: 'ai-analyze', progress: 100, assignee: 'JARVIS AI', phase: 'PRE-SALE' },
  },
  {
    id: 'n-6', type: 'holoNode', position: { x: 840, y: 280 },
    data: { label: 'Расчёт себестоимости', summary: 'Цены вендора + логистика + маржа', status: 'completed', type: 'calculation', progress: 100, assignee: 'Марина С.', phase: 'PRE-SALE' },
  },
  {
    id: 'n-7', type: 'holoNode', position: { x: 840, y: 460 },
    data: { label: 'Подготовка КП', summary: 'Коммерческое предложение заказчику', status: 'completed', type: 'document', progress: 100, assignee: 'Алексей М.', phase: 'PRE-SALE' },
  },
  {
    id: 'n-8', type: 'holoNode', position: { x: 1120, y: 460 },
    data: { label: 'Отправка КП', summary: 'Email с КП главврачу', status: 'completed', type: 'email', progress: 100, assignee: 'Алексей М.', phase: 'PRE-SALE' },
  },

  // ═══ PHASE 2: BIDDING ═══
  {
    id: 'n-9', type: 'holoNode', position: { x: 1120, y: 280 },
    data: {
      label: 'Compliance Check', summary: 'РУ + КТРУ + нацрежим + РНП', status: 'completed', type: 'approval', progress: 100, assignee: 'JARVIS AI', phase: 'BIDDING',
      complianceChecks: [
        { name: 'РУ действительно', passed: true, source: 'Реестр Росздравнадзора', critical: true },
        { name: 'КТРУ/ОКПД2 соответствие', passed: true, source: 'Справочник КТРУ', critical: true },
        { name: 'Нацрежим (ПП 102)', passed: true, source: 'Перечни Минпромторга', critical: true },
        { name: 'Отсутствие в РНП', passed: true, source: 'Реестр ФАС', critical: true },
        { name: 'ISO 13485', passed: true, source: 'Сертификат компании', critical: false },
        { name: 'Класс риска', passed: true, source: 'РУ + ТЗ', critical: true },
        { name: 'Лицензия ТОМИ', passed: null, source: 'Росздравнадзор', critical: false },
        { name: 'Санкционная доступность', passed: true, source: 'Вендор', critical: false },
        { name: 'Антидемпинг', passed: true, source: 'Расчёт от НМЦК', critical: false },
      ],
    },
  },
  {
    id: 'n-10', type: 'holoNode', position: { x: 1400, y: 280 },
    data: { label: 'Развилка задач', summary: 'Параллельные ветки подготовки', status: 'completed', type: 'parallel-split', progress: 100, assignee: 'Система', phase: 'BIDDING' },
  },
  // Branch 1: Documents
  {
    id: 'n-11', type: 'holoNode', position: { x: 1680, y: 40 },
    data: { label: 'Генерация ТЗ', summary: 'AI формирует техзадание из тендерной документации', status: 'completed', type: 'ai-generate', progress: 100, assignee: 'JARVIS AI', phase: 'BIDDING',
      aiOutput: ['> Сгенерировано ТЗ на основе тендера №44-ФЗ-2026-1847', '> Использовано 3 КТРУ-кода', '> Confidence: 96.1%', '> Версия: 2.1 (после правок)'],
    },
  },
  {
    id: 'n-12', type: 'holoNode', position: { x: 1960, y: 40 },
    data: { label: 'Согласование ТЗ', summary: 'Ожидает подпись руководителя', status: 'active', type: 'approval', progress: 65, assignee: 'Иван Р.', phase: 'BIDDING', dueDate: '2026-03-26' },
  },
  {
    id: 'n-13', type: 'holoNode', position: { x: 2240, y: 40 },
    data: { label: 'Генерация НМЦК', summary: 'Расчёт начальной максимальной цены', status: 'pending', type: 'ai-generate', progress: 0, assignee: 'JARVIS AI', phase: 'BIDDING' },
  },
  {
    id: 'n-14', type: 'holoNode', position: { x: 2520, y: 40 },
    data: { label: 'Согласование НМЦК', summary: 'Утверждение цены руководителем', status: 'pending', type: 'approval', progress: 0, assignee: 'Иван Р.', phase: 'BIDDING' },
  },
  {
    id: 'n-15', type: 'holoNode', position: { x: 2800, y: 40 },
    data: { label: 'Формирование заявки', summary: 'Полный пакет документов на ЭТП', status: 'pending', type: 'document', progress: 0, assignee: 'Алексей М.', phase: 'BIDDING' },
  },
  // Branch 2: Equipment
  {
    id: 'n-16', type: 'holoNode', position: { x: 1680, y: 220 },
    data: { label: 'Мониторинг РУ', summary: 'Проверка рег. удостоверений Mindray DC-70', status: 'completed', type: 'ai-monitor', progress: 100, assignee: 'JARVIS AI', phase: 'BIDDING' },
  },
  {
    id: 'n-17', type: 'holoNode', position: { x: 1960, y: 220 },
    data: { label: 'Подбор конфигурации', summary: 'Комплектация под требования ТЗ', status: 'active', type: 'research', progress: 40, assignee: 'Марина С.', phase: 'BIDDING' },
  },
  {
    id: 'n-18', type: 'holoNode', position: { x: 2240, y: 220 },
    data: { label: 'Расчёт логистики', summary: 'Стоимость доставки и монтажа', status: 'pending', type: 'calculation', progress: 0, assignee: 'Марина С.', phase: 'BIDDING' },
  },
  // Branch 3: Competitors
  {
    id: 'n-19', type: 'holoNode', position: { x: 1680, y: 400 },
    data: { label: 'Мониторинг конкурентов', summary: 'Отслеживание активности на ЭТП', status: 'active', type: 'ai-monitor', progress: 55, assignee: 'JARVIS AI', phase: 'BIDDING' },
  },
  {
    id: 'n-20', type: 'holoNode', position: { x: 1960, y: 400 },
    data: { label: 'AI Скоринг победы', summary: 'Вероятность выигрыша: 67%', status: 'active', type: 'ai-analyze', progress: 80, assignee: 'JARVIS AI', phase: 'BIDDING',
      aiOutput: ['> Win probability: 67.3%', '> Ценовое преимущество: -8% от средней', '> Конкуренты: 3 компании', '> Рекомендация: подавать заявку'],
    },
  },
  // Branch 4: Communication
  {
    id: 'n-21', type: 'holoNode', position: { x: 1680, y: 560 },
    data: { label: 'Контакт с заказчиком', summary: 'Звонок в приёмную главврача', status: 'completed', type: 'call', progress: 100, assignee: 'Алексей М.', phase: 'BIDDING' },
  },
  {
    id: 'n-22', type: 'holoNode', position: { x: 1960, y: 560 },
    data: { label: 'Запрос разъяснений', summary: 'Уточнение требований по ТЗ', status: 'waiting', type: 'email', progress: 50, assignee: 'Алексей М.', phase: 'BIDDING' },
  },

  // Sync
  {
    id: 'n-23', type: 'holoNode', position: { x: 3080, y: 280 },
    data: { label: 'Синхронизация', summary: 'Ожидание всех параллельных веток', status: 'pending', type: 'parallel-join', progress: 0, assignee: 'Система', phase: 'BIDDING' },
  },
  {
    id: 'n-24', type: 'holoNode', position: { x: 3360, y: 280 },
    data: { label: 'Готовность к подаче', summary: 'Milestone: все документы и проверки', status: 'pending', type: 'milestone', progress: 0, assignee: 'Иван Р.', phase: 'BIDDING' },
  },
  {
    id: 'n-25', type: 'holoNode', position: { x: 3640, y: 280 },
    data: { label: 'Обеспечение заявки', summary: 'Банковская гарантия / спецсчёт', status: 'pending', type: 'calculation', progress: 0, assignee: 'Бухгалтерия', phase: 'BIDDING' },
  },
  {
    id: 'n-26', type: 'holoNode', position: { x: 3920, y: 280 },
    data: { label: 'Подача заявки на ЭТП', summary: 'Загрузка документов на площадку', status: 'pending', type: 'document', progress: 0, assignee: 'Алексей М.', phase: 'BIDDING' },
  },
  {
    id: 'n-27', type: 'holoNode', position: { x: 4200, y: 280 },
    data: { label: 'Ожидание торгов', summary: 'Мониторинг площадки и конкурентов', status: 'pending', type: 'wait', progress: 0, assignee: 'JARVIS AI', phase: 'BIDDING' },
  },

  // ═══ PHASE 3: RESULT ═══
  {
    id: 'n-28', type: 'holoNode', position: { x: 4480, y: 280 },
    data: { label: 'Результат тендера', summary: 'Победа / Проигрыш / Переторжка', status: 'pending', type: 'decision-fork', progress: 0, assignee: 'Система', phase: 'RESULT' },
  },

  // ═══ PHASE 4: EXECUTION (Win branch) ═══
  {
    id: 'n-29', type: 'holoNode', position: { x: 4760, y: 160 },
    data: { label: 'Подписание контракта', summary: 'Протокол разногласий если нужно', status: 'pending', type: 'document', progress: 0, assignee: 'Юрист', phase: 'EXECUTION' },
  },
  {
    id: 'n-30', type: 'holoNode', position: { x: 5040, y: 40 },
    data: { label: 'Заказ у вендора', summary: 'Производство/закупка Mindray DC-70', status: 'pending', type: 'logistics', progress: 0, assignee: 'Марина С.', phase: 'EXECUTION' },
  },
  {
    id: 'n-31', type: 'holoNode', position: { x: 5040, y: 280 },
    data: { label: 'Подготовка площадки', summary: 'Электрика, вентиляция, экранирование', status: 'pending', type: 'document', progress: 0, assignee: 'Заказчик', phase: 'EXECUTION' },
  },
  {
    id: 'n-32', type: 'holoNode', position: { x: 5320, y: 160 },
    data: { label: 'Доставка', summary: 'Логистика 3× Mindray DC-70', status: 'pending', type: 'logistics', progress: 0, assignee: 'Логист', phase: 'EXECUTION' },
  },
  {
    id: 'n-33', type: 'holoNode', position: { x: 5600, y: 160 },
    data: { label: 'Монтаж и ПНР', summary: 'Сборка, подключение, наладка', status: 'pending', type: 'logistics', progress: 0, assignee: 'Инженер', phase: 'EXECUTION' },
  },
  {
    id: 'n-34', type: 'holoNode', position: { x: 5880, y: 60 },
    data: { label: 'Обучение персонала', summary: 'Обучение медперсонала + сертификаты', status: 'pending', type: 'meeting', progress: 0, assignee: 'Тренер', phase: 'EXECUTION' },
  },
  {
    id: 'n-35', type: 'holoNode', position: { x: 5880, y: 260 },
    data: { label: 'Приёмка и экспертиза', summary: 'Экспертиза заказчиком', status: 'pending', type: 'approval', progress: 0, assignee: 'Заказчик', phase: 'EXECUTION' },
  },
  {
    id: 'n-36', type: 'holoNode', position: { x: 6160, y: 160 },
    data: { label: 'Ввод в эксплуатацию', summary: 'Акт + регистрация в учётной системе', status: 'pending', type: 'milestone', progress: 0, assignee: 'Заказчик', phase: 'EXECUTION' },
  },
  {
    id: 'n-37', type: 'holoNode', position: { x: 6440, y: 160 },
    data: { label: 'Оплата', summary: 'Полная оплата по контракту', status: 'pending', type: 'calculation', progress: 0, assignee: 'Бухгалтерия', phase: 'EXECUTION' },
  },

  // ═══ PHASE 5: POST-SALE ═══
  {
    id: 'n-38', type: 'holoNode', position: { x: 6720, y: 160 },
    data: { label: 'Гарантийный мониторинг', summary: '24 мес: реагирование, ремонт, ТО', status: 'pending', type: 'ai-monitor', progress: 0, assignee: 'JARVIS AI', phase: 'POST-SALE' },
  },
  {
    id: 'n-39', type: 'holoNode', position: { x: 7000, y: 160 },
    data: { label: 'Завершение сделки', summary: 'WIN — итоги и lessons learned', status: 'pending', type: 'finish', progress: 0, assignee: 'Система', phase: 'POST-SALE' },
  },

  // Loss branch
  {
    id: 'n-40', type: 'holoNode', position: { x: 4760, y: 420 },
    data: { label: 'Анализ проигрыша', summary: 'Причины, выводы, рекомендации', status: 'pending', type: 'ai-analyze', progress: 0, assignee: 'JARVIS AI', phase: 'RESULT' },
  },
  {
    id: 'n-41', type: 'holoNode', position: { x: 5040, y: 420 },
    data: { label: 'Завершение (LOSS)', summary: 'Фиксация результата', status: 'pending', type: 'finish', progress: 0, assignee: 'Система', phase: 'RESULT' },
  },
];

export const initialEdges: Edge[] = [
  // Phase 1
  { id: 'e1-2', source: 'n-1', target: 'n-2', type: 'glowingEdge', data: { status: 'completed' } },
  { id: 'e1-3', source: 'n-1', target: 'n-3', type: 'glowingEdge', data: { status: 'completed' } },
  { id: 'e2-4', source: 'n-2', target: 'n-4', type: 'glowingEdge', data: { status: 'completed' } },
  { id: 'e3-4', source: 'n-3', target: 'n-4', type: 'glowingEdge', data: { status: 'completed' } },
  { id: 'e4-5', source: 'n-4', target: 'n-5', type: 'glowingEdge', data: { status: 'completed' } },
  { id: 'e4-6', source: 'n-4', target: 'n-6', type: 'glowingEdge', data: { status: 'completed' } },
  { id: 'e4-7', source: 'n-4', target: 'n-7', type: 'glowingEdge', data: { status: 'completed' } },
  { id: 'e7-8', source: 'n-7', target: 'n-8', type: 'glowingEdge', data: { status: 'completed' } },

  // Phase 1 → 2
  { id: 'e5-9', source: 'n-5', target: 'n-9', type: 'glowingEdge', data: { status: 'completed' } },
  { id: 'e6-9', source: 'n-6', target: 'n-9', type: 'glowingEdge', data: { status: 'completed' } },
  { id: 'e8-9', source: 'n-8', target: 'n-9', type: 'glowingEdge', data: { status: 'completed' } },

  // Phase 2: Split
  { id: 'e9-10', source: 'n-9', target: 'n-10', type: 'glowingEdge', data: { status: 'completed' } },
  { id: 'e10-11', source: 'n-10', target: 'n-11', type: 'glowingEdge', data: { status: 'completed' } },
  { id: 'e11-12', source: 'n-11', target: 'n-12', type: 'glowingEdge', data: { status: 'active' } },
  { id: 'e12-13', source: 'n-12', target: 'n-13', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e13-14', source: 'n-13', target: 'n-14', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e14-15', source: 'n-14', target: 'n-15', type: 'glowingEdge', data: { status: 'pending' } },

  { id: 'e10-16', source: 'n-10', target: 'n-16', type: 'glowingEdge', data: { status: 'completed' } },
  { id: 'e16-17', source: 'n-16', target: 'n-17', type: 'glowingEdge', data: { status: 'active' } },
  { id: 'e17-18', source: 'n-17', target: 'n-18', type: 'glowingEdge', data: { status: 'pending' } },

  { id: 'e10-19', source: 'n-10', target: 'n-19', type: 'glowingEdge', data: { status: 'active' } },
  { id: 'e19-20', source: 'n-19', target: 'n-20', type: 'glowingEdge', data: { status: 'active' } },

  { id: 'e10-21', source: 'n-10', target: 'n-21', type: 'glowingEdge', data: { status: 'completed' } },
  { id: 'e21-22', source: 'n-21', target: 'n-22', type: 'glowingEdge', data: { status: 'waiting' } },

  // Join
  { id: 'e15-23', source: 'n-15', target: 'n-23', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e18-23', source: 'n-18', target: 'n-23', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e20-23', source: 'n-20', target: 'n-23', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e22-23', source: 'n-22', target: 'n-23', type: 'glowingEdge', data: { status: 'pending' } },

  { id: 'e23-24', source: 'n-23', target: 'n-24', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e24-25', source: 'n-24', target: 'n-25', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e25-26', source: 'n-25', target: 'n-26', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e26-27', source: 'n-26', target: 'n-27', type: 'glowingEdge', data: { status: 'pending' } },

  // Phase 3
  { id: 'e27-28', source: 'n-27', target: 'n-28', type: 'glowingEdge', data: { status: 'pending' } },

  // Phase 4: Win
  { id: 'e28-29', source: 'n-28', target: 'n-29', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e29-30', source: 'n-29', target: 'n-30', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e29-31', source: 'n-29', target: 'n-31', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e30-32', source: 'n-30', target: 'n-32', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e31-32', source: 'n-31', target: 'n-32', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e32-33', source: 'n-32', target: 'n-33', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e33-34', source: 'n-33', target: 'n-34', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e33-35', source: 'n-33', target: 'n-35', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e34-36', source: 'n-34', target: 'n-36', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e35-36', source: 'n-35', target: 'n-36', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e36-37', source: 'n-36', target: 'n-37', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e37-38', source: 'n-37', target: 'n-38', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e38-39', source: 'n-38', target: 'n-39', type: 'glowingEdge', data: { status: 'pending' } },

  // Loss branch
  { id: 'e28-40', source: 'n-28', target: 'n-40', type: 'glowingEdge', data: { status: 'pending' } },
  { id: 'e40-41', source: 'n-40', target: 'n-41', type: 'glowingEdge', data: { status: 'pending' } },
];

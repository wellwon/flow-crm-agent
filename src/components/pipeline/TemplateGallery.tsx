import { useState } from 'react';
import { X, FileText, Scale, Handshake, FlaskConical, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Node, Edge } from '@xyflow/react';
import type { PipelineNodeData, NodeStatus } from '@/types/pipeline';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (nodes: Node<PipelineNodeData>[], edges: Edge[]) => void;
}

interface PipelineTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  nodeCount: number;
  duration: string;
  category: string;
}

const templates: PipelineTemplate[] = [
  {
    id: '44fz', name: 'Тендер 44-ФЗ', description: 'Электронный аукцион — полный цикл от парсинга тендера до поставки и гарантии',
    icon: Scale, color: 'text-primary', nodeCount: 28, duration: '3-6 мес', category: 'Госзакупки',
  },
  {
    id: '223fz', name: 'Тендер 223-ФЗ', description: 'Запрос котировок — упрощённая процедура с многоэтапной переторжкой',
    icon: FileText, color: 'text-node-active', nodeCount: 22, duration: '2-4 мес', category: 'Госзакупки',
  },
  {
    id: 'direct', name: 'Прямой договор', description: 'Без тендера — от первой встречи до поставки и ввода в эксплуатацию',
    icon: Handshake, color: 'text-node-completed', nodeCount: 16, duration: '1-3 мес', category: 'B2B',
  },
  {
    id: 'registration', name: 'Регистрация МИ', description: 'Регистрация медизделия — техдокументация, испытания, Росздравнадзор',
    icon: FlaskConical, color: 'text-[hsl(265_80%_65%)]', nodeCount: 18, duration: '6-12 мес', category: 'Регуляторика',
  },
];

function mk(id: string, x: number, y: number, data: Omit<PipelineNodeData, 'progress'> & { progress?: number }): Node<PipelineNodeData> {
  return { id, type: 'holoNode', position: { x, y }, data: { progress: 0, ...data } as PipelineNodeData };
}
function me(src: string, tgt: string, status: NodeStatus = 'pending'): Edge {
  return { id: `e-${src}-${tgt}`, source: src, target: tgt, type: 'glowingEdge', data: { status } };
}

function generate44FZ(): { nodes: Node<PipelineNodeData>[]; edges: Edge[] } {
  const n = [
    mk('t-1', 0, 280, { label: 'Старт сделки', summary: 'Создание из тендера', status: 'pending', type: 'start', phase: 'PRE-SALE' }),
    mk('t-2', 280, 160, { label: 'AI Парсинг тендера', summary: 'Разбор ТЗ тендера', status: 'pending', type: 'ai-enrich', phase: 'PRE-SALE', assignee: 'JARVIS AI' }),
    mk('t-3', 280, 400, { label: 'Обогащение заказчика', summary: 'ИНН, бюджет, история', status: 'pending', type: 'ai-enrich', phase: 'PRE-SALE', assignee: 'JARVIS AI' }),
    mk('t-4', 560, 280, { label: 'Go/No-Go', summary: 'Квалификация сделки', status: 'pending', type: 'decision-fork', phase: 'PRE-SALE' }),
    mk('t-5', 840, 160, { label: 'Анализ конкурентов', summary: 'Позиции участников', status: 'pending', type: 'ai-analyze', phase: 'PRE-SALE', assignee: 'JARVIS AI' }),
    mk('t-6', 840, 400, { label: 'Расчёт себестоимости', summary: 'Цены + логистика + маржа', status: 'pending', type: 'calculation', phase: 'PRE-SALE' }),
    mk('t-7', 1120, 280, { label: 'Compliance Check', summary: 'РУ + КТРУ + нацрежим', status: 'pending', type: 'approval', phase: 'BIDDING' }),
    mk('t-8', 1400, 280, { label: 'Параллельный старт', summary: 'Разделение на ветки', status: 'pending', type: 'parallel-split', phase: 'BIDDING' }),
    mk('t-9', 1680, 100, { label: 'Генерация ТЗ', summary: 'AI формирует ТЗ', status: 'pending', type: 'ai-generate', phase: 'BIDDING', assignee: 'JARVIS AI' }),
    mk('t-10', 1960, 100, { label: 'Согласование ТЗ', summary: 'Подпись руководителя', status: 'pending', type: 'approval', phase: 'BIDDING' }),
    mk('t-11', 1680, 300, { label: 'Подбор конфигурации', summary: 'Комплектация', status: 'pending', type: 'research', phase: 'BIDDING' }),
    mk('t-12', 1680, 460, { label: 'Контакт с заказчиком', summary: 'Звонок/встреча', status: 'pending', type: 'call', phase: 'BIDDING' }),
    mk('t-13', 2240, 280, { label: 'Синхронизация', summary: 'AND-gate', status: 'pending', type: 'parallel-join', phase: 'BIDDING' }),
    mk('t-14', 2520, 280, { label: 'Готовность к подаче', summary: 'Milestone', status: 'pending', type: 'milestone', phase: 'BIDDING' }),
    mk('t-15', 2800, 280, { label: 'Подача заявки', summary: 'ЭТП', status: 'pending', type: 'document', phase: 'BIDDING' }),
    mk('t-16', 3080, 280, { label: 'Ожидание торгов', summary: 'Мониторинг', status: 'pending', type: 'wait', phase: 'BIDDING' }),
    mk('t-17', 3360, 280, { label: 'Результат', summary: 'Победа / Проигрыш', status: 'pending', type: 'decision-fork', phase: 'RESULT' }),
    mk('t-18', 3640, 160, { label: 'Контракт', summary: 'Подписание', status: 'pending', type: 'document', phase: 'EXECUTION' }),
    mk('t-19', 3920, 160, { label: 'Поставка', summary: 'Логистика', status: 'pending', type: 'logistics', phase: 'EXECUTION' }),
    mk('t-20', 4200, 60, { label: 'Монтаж и ПНР', summary: 'Установка', status: 'pending', type: 'logistics', phase: 'EXECUTION' }),
    mk('t-21', 4200, 260, { label: 'Приёмка', summary: 'Экспертиза заказчиком', status: 'pending', type: 'approval', phase: 'EXECUTION' }),
    mk('t-22', 4480, 160, { label: 'Ввод в эксплуатацию', summary: 'Акт ввода', status: 'pending', type: 'milestone', phase: 'EXECUTION' }),
    mk('t-23', 4760, 160, { label: 'Гарантийный мониторинг', summary: '24 мес', status: 'pending', type: 'ai-monitor', phase: 'POST-SALE', assignee: 'JARVIS AI' }),
    mk('t-24', 5040, 160, { label: 'Финиш (WIN)', summary: 'Итоги сделки', status: 'pending', type: 'finish', phase: 'POST-SALE' }),
    mk('t-25', 3640, 400, { label: 'Анализ проигрыша', summary: 'Причины, выводы', status: 'pending', type: 'ai-analyze', phase: 'RESULT', assignee: 'JARVIS AI' }),
    mk('t-26', 3920, 400, { label: 'Финиш (LOSS)', summary: 'Фиксация', status: 'pending', type: 'finish', phase: 'RESULT' }),
  ];
  const e = [
    me('t-1','t-2'), me('t-1','t-3'), me('t-2','t-4'), me('t-3','t-4'),
    me('t-4','t-5'), me('t-4','t-6'), me('t-5','t-7'), me('t-6','t-7'),
    me('t-7','t-8'), me('t-8','t-9'), me('t-8','t-11'), me('t-8','t-12'),
    me('t-9','t-10'), me('t-10','t-13'), me('t-11','t-13'), me('t-12','t-13'),
    me('t-13','t-14'), me('t-14','t-15'), me('t-15','t-16'), me('t-16','t-17'),
    me('t-17','t-18'), me('t-18','t-19'), me('t-19','t-20'), me('t-19','t-21'),
    me('t-20','t-22'), me('t-21','t-22'), me('t-22','t-23'), me('t-23','t-24'),
    me('t-17','t-25'), me('t-25','t-26'),
  ];
  return { nodes: n, edges: e };
}

function generate223FZ(): { nodes: Node<PipelineNodeData>[]; edges: Edge[] } {
  const n = [
    mk('t-1', 0, 200, { label: 'Старт', summary: 'Запрос котировок', status: 'pending', type: 'start', phase: 'PRE-SALE' }),
    mk('t-2', 280, 200, { label: 'AI Обогащение', summary: 'Данные заказчика', status: 'pending', type: 'ai-enrich', phase: 'PRE-SALE', assignee: 'JARVIS AI' }),
    mk('t-3', 560, 200, { label: 'Подготовка КП', summary: 'Котировка', status: 'pending', type: 'document', phase: 'BIDDING' }),
    mk('t-4', 840, 200, { label: 'Согласование цены', summary: 'Утверждение', status: 'pending', type: 'approval', phase: 'BIDDING' }),
    mk('t-5', 1120, 200, { label: 'Подача котировки', summary: 'На площадку', status: 'pending', type: 'document', phase: 'BIDDING' }),
    mk('t-6', 1400, 200, { label: 'Ожидание', summary: 'Результат', status: 'pending', type: 'wait', phase: 'BIDDING' }),
    mk('t-7', 1680, 200, { label: 'Результат', summary: 'Решение', status: 'pending', type: 'decision-fork', phase: 'RESULT' }),
    mk('t-8', 1960, 100, { label: 'Договор', summary: 'Подписание', status: 'pending', type: 'document', phase: 'EXECUTION' }),
    mk('t-9', 2240, 100, { label: 'Поставка', summary: 'Логистика', status: 'pending', type: 'logistics', phase: 'EXECUTION' }),
    mk('t-10', 2520, 100, { label: 'Приёмка', summary: 'Экспертиза', status: 'pending', type: 'approval', phase: 'EXECUTION' }),
    mk('t-11', 2800, 100, { label: 'Финиш', summary: 'Завершение', status: 'pending', type: 'finish', phase: 'POST-SALE' }),
    mk('t-12', 1960, 320, { label: 'Переторжка', summary: 'Новая цена', status: 'pending', type: 'calculation', phase: 'BIDDING' }),
  ];
  const e = [
    me('t-1','t-2'), me('t-2','t-3'), me('t-3','t-4'), me('t-4','t-5'),
    me('t-5','t-6'), me('t-6','t-7'), me('t-7','t-8'), me('t-8','t-9'),
    me('t-9','t-10'), me('t-10','t-11'), me('t-7','t-12'), me('t-12','t-3'),
  ];
  return { nodes: n, edges: e };
}

function generateDirect(): { nodes: Node<PipelineNodeData>[]; edges: Edge[] } {
  const n = [
    mk('t-1', 0, 200, { label: 'Старт', summary: 'Первый контакт', status: 'pending', type: 'start', phase: 'PRE-SALE' }),
    mk('t-2', 280, 200, { label: 'Первая встреча', summary: 'Знакомство', status: 'pending', type: 'meeting', phase: 'PRE-SALE' }),
    mk('t-3', 560, 200, { label: 'AI Обогащение', summary: 'Данные', status: 'pending', type: 'ai-enrich', phase: 'PRE-SALE', assignee: 'JARVIS AI' }),
    mk('t-4', 840, 100, { label: 'Генерация КП', summary: 'AI', status: 'pending', type: 'ai-generate', phase: 'PRE-SALE', assignee: 'JARVIS AI' }),
    mk('t-5', 840, 320, { label: 'Проверка РУ', summary: 'Реестр', status: 'pending', type: 'ai-monitor', phase: 'PRE-SALE', assignee: 'JARVIS AI' }),
    mk('t-6', 1120, 100, { label: 'Согласование цены', summary: 'Утверждение', status: 'pending', type: 'approval', phase: 'CONTRACTING' }),
    mk('t-7', 1400, 200, { label: 'Отправка КП', summary: 'Email', status: 'pending', type: 'email', phase: 'CONTRACTING' }),
    mk('t-8', 1680, 200, { label: 'Ожидание решения', summary: 'Клиент', status: 'pending', type: 'wait', phase: 'CONTRACTING' }),
    mk('t-9', 1960, 200, { label: 'Решение', summary: 'Да/Нет/Торг', status: 'pending', type: 'decision-fork', phase: 'CONTRACTING' }),
    mk('t-10', 2240, 100, { label: 'Договор', summary: 'Подписание', status: 'pending', type: 'document', phase: 'EXECUTION' }),
    mk('t-11', 2520, 100, { label: 'Оплата', summary: 'Счёт', status: 'pending', type: 'calculation', phase: 'EXECUTION' }),
    mk('t-12', 2800, 100, { label: 'Поставка', summary: 'Логистика', status: 'pending', type: 'logistics', phase: 'EXECUTION' }),
    mk('t-13', 3080, 100, { label: 'Финиш', summary: 'WIN', status: 'pending', type: 'finish', phase: 'POST-SALE' }),
    mk('t-14', 2240, 320, { label: 'Отказ', summary: 'Анализ', status: 'pending', type: 'ai-analyze', phase: 'RESULT' }),
    mk('t-15', 2520, 320, { label: 'Финиш (LOSS)', summary: 'Фиксация', status: 'pending', type: 'finish', phase: 'RESULT' }),
  ];
  const e = [
    me('t-1','t-2'), me('t-2','t-3'), me('t-3','t-4'), me('t-3','t-5'),
    me('t-4','t-6'), me('t-5','t-7'), me('t-6','t-7'), me('t-7','t-8'),
    me('t-8','t-9'), me('t-9','t-10'), me('t-10','t-11'), me('t-11','t-12'),
    me('t-12','t-13'), me('t-9','t-14'), me('t-14','t-15'),
  ];
  return { nodes: n, edges: e };
}

function generateRegistration(): { nodes: Node<PipelineNodeData>[]; edges: Edge[] } {
  const n = [
    mk('t-1', 0, 200, { label: 'Старт', summary: 'Новое медизделие', status: 'pending', type: 'start', phase: 'PRE-SALE' }),
    mk('t-2', 280, 200, { label: 'Параллельный старт', summary: '3 ветки', status: 'pending', type: 'parallel-split', phase: 'PRE-SALE' }),
    mk('t-3', 560, 60, { label: 'Техдокументация', summary: 'Сбор', status: 'pending', type: 'document', phase: 'BIDDING' }),
    mk('t-4', 840, 60, { label: 'Перевод', summary: 'Если импорт', status: 'pending', type: 'document', phase: 'BIDDING' }),
    mk('t-5', 560, 200, { label: 'Протокол испытаний', summary: 'Подготовка', status: 'pending', type: 'document', phase: 'BIDDING' }),
    mk('t-6', 840, 200, { label: 'Проведение испытаний', summary: '1-3 мес', status: 'pending', type: 'wait', phase: 'BIDDING' }),
    mk('t-7', 560, 360, { label: 'Сертификация', summary: 'ISO 13485', status: 'pending', type: 'approval', phase: 'BIDDING' }),
    mk('t-8', 1120, 200, { label: 'Синхронизация', summary: 'Все ветки', status: 'pending', type: 'parallel-join', phase: 'CONTRACTING' }),
    mk('t-9', 1400, 200, { label: 'Регистрационное досье', summary: 'Формирование', status: 'pending', type: 'document', phase: 'CONTRACTING' }),
    mk('t-10', 1680, 200, { label: 'Подача в Росздравнадзор', summary: 'Отправка', status: 'pending', type: 'document', phase: 'EXECUTION' }),
    mk('t-11', 1960, 200, { label: 'Ожидание экспертизы', summary: '3-6 мес', status: 'pending', type: 'wait', phase: 'EXECUTION' }),
    mk('t-12', 2240, 200, { label: 'Решение', summary: 'Одобрено/Отказ', status: 'pending', type: 'decision-fork', phase: 'RESULT' }),
    mk('t-13', 2520, 100, { label: 'РУ получено', summary: 'Регистрация завершена', status: 'pending', type: 'finish', phase: 'POST-SALE' }),
    mk('t-14', 2520, 320, { label: 'Доработка', summary: 'По замечаниям', status: 'pending', type: 'document', phase: 'EXECUTION' }),
  ];
  const e = [
    me('t-1','t-2'), me('t-2','t-3'), me('t-2','t-5'), me('t-2','t-7'),
    me('t-3','t-4'), me('t-4','t-8'), me('t-5','t-6'), me('t-6','t-8'),
    me('t-7','t-8'), me('t-8','t-9'), me('t-9','t-10'), me('t-10','t-11'),
    me('t-11','t-12'), me('t-12','t-13'), me('t-12','t-14'), me('t-14','t-10'),
  ];
  return { nodes: n, edges: e };
}

const generators: Record<string, () => { nodes: Node<PipelineNodeData>[]; edges: Edge[] }> = {
  '44fz': generate44FZ,
  '223fz': generate223FZ,
  direct: generateDirect,
  registration: generateRegistration,
};

export function TemplateGallery({ isOpen, onClose, onApplyTemplate }: TemplateGalleryProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleApply = () => {
    if (!selected) return;
    const gen = generators[selected];
    if (!gen) return;
    const { nodes, edges } = gen();
    onApplyTemplate(nodes, edges);
    onClose();
    setSelected(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative glass-panel-dense w-full max-w-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Шаблоны пайплайнов</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">Выберите шаблон для новой сделки</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {templates.map(t => {
                const isSelected = selected === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelected(t.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                        : 'border-border/30 bg-background/40 hover:border-border/60 hover:bg-background/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <t.icon className={`w-5 h-5 ${t.color}`} />
                      <span className="text-xs font-semibold text-foreground">{t.name}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">{t.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t.nodeCount} нод</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t.duration}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
                Отмена
              </button>
              <button
                onClick={handleApply}
                disabled={!selected}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Создать пайплайн
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

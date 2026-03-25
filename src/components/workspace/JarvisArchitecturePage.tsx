import { useState } from 'react';
import { Brain, MessageSquare, FileText, Bell, Layers, ChevronRight, Clock, Search, Shield, Zap, Database, Eye, PenTool, RefreshCw, AlertTriangle, Calendar, BookOpen, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tool {
  name: string;
  type: 'READ' | 'WRITE-DRAFT';
  description: string;
  trigger: string;
}

interface ToolGroup {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  tools: Tool[];
}

const toolGroups: ToolGroup[] = [
  {
    id: 'interactions',
    title: 'Interactions',
    subtitle: 'Запись и поиск взаимодействий',
    icon: MessageSquare,
    color: 'text-blue-400',
    tools: [
      { name: 'mem_log_interaction', type: 'WRITE-DRAFT', description: 'Записать взаимодействие (звонок, встреча, бриф)', trigger: 'Менеджер наговорил результат встречи' },
      { name: 'mem_get_interactions', type: 'READ', description: 'Список взаимодействий по сделке/контрагенту', trigger: '"Что обсуждали с ГБУЗ?"' },
      { name: 'mem_get_interaction_detail', type: 'READ', description: 'Полная запись одного взаимодействия', trigger: '"Дай подробности встречи 15 марта"' },
      { name: 'mem_search_interactions', type: 'READ', description: 'Полнотекстовый поиск по всем взаимодействиям', trigger: '"Когда мы обсуждали отсрочку платежа?"' },
    ],
  },
  {
    id: 'dossier',
    title: 'Dossier',
    subtitle: 'Досье контрагентов',
    icon: FileText,
    color: 'text-emerald-400',
    tools: [
      { name: 'mem_get_dossier', type: 'READ', description: 'MD-сводка досье (~500 токенов)', trigger: 'Любой разговор где упомянут контрагент' },
      { name: 'mem_get_dossier_full', type: 'READ', description: 'Полный JSONB profile (key_people, preferences)', trigger: '"Расскажи всё про ГБУЗ-5"' },
      { name: 'mem_update_dossier', type: 'WRITE-DRAFT', description: 'Добавить/обновить факты в досье', trigger: 'После обработки нового interaction' },
      { name: 'mem_rebuild_dossier', type: 'WRITE-DRAFT', description: 'Пересобрать MD-сводку из всех фактов', trigger: 'Ночная консолидация или ручной запрос' },
    ],
  },
  {
    id: 'proactive',
    title: 'Proactive',
    subtitle: 'Триггеры и брифы',
    icon: Bell,
    color: 'text-amber-400',
    tools: [
      { name: 'mem_create_trigger', type: 'WRITE-DRAFT', description: 'Создать проактивный триггер', trigger: 'Извлечён дедлайн, новая сделка' },
      { name: 'mem_list_triggers', type: 'READ', description: 'Активные триггеры по сущности', trigger: '"Какие напоминания по этой сделке?"' },
      { name: 'mem_snooze_trigger', type: 'WRITE-DRAFT', description: 'Отложить триггер на N дней', trigger: '"Напомни на следующей неделе"' },
      { name: 'mem_get_alerts', type: 'READ', description: 'Сработавшие триггеры за сегодня', trigger: 'Утренний бриф, начало сессии' },
      { name: 'mem_generate_brief', type: 'READ', description: 'Сгенерировать бриф (встреча/день/руководитель)', trigger: 'Перед встречей, утром, по запросу' },
    ],
  },
  {
    id: 'context',
    title: 'Context',
    subtitle: 'Управление контекстом',
    icon: Layers,
    color: 'text-purple-400',
    tools: [
      { name: 'mem_get_deal_context', type: 'READ', description: 'Компактная MD-сводка по сделке', trigger: 'Любой разговор про сделку' },
      { name: 'mem_rebuild_deal_context', type: 'WRITE-DRAFT', description: 'Пересобрать deal_context_md', trigger: 'После значимых изменений в pipeline' },
      { name: 'mem_get_daily_digest', type: 'READ', description: 'Полная сводка дня для руководителя', trigger: '"Покажи итоги дня"' },
    ],
  },
];

const workflowSteps = [
  {
    time: '08:00',
    title: 'Утренний бриф',
    description: 'Менеджер открывает чат',
    calls: ['mem_get_alerts()'],
    result: '2 алерта: «КП для ГБУЗ-5 — дедлайн сегодня», «МедТех — нет контакта 14 дней»',
    icon: Clock,
  },
  {
    time: '09:30',
    title: 'Подготовка к встрече',
    description: '«Еду к Иванову в ГБУЗ, подготовь»',
    calls: ['mem_get_dossier()', 'mem_get_deal_context()', 'mem_get_interactions()', 'mem_generate_brief()'],
    result: 'Бриф: ключевые люди, открытые вопросы, рекомендации',
    icon: BookOpen,
  },
  {
    time: '11:00',
    title: 'Запись результата',
    description: 'Голосовой бриф о встрече',
    calls: ['mem_log_interaction()', 'mem_update_dossier()', 'mem_create_trigger()', 'mem_rebuild_deal_context()'],
    result: 'Досье обновлено, триггер на 5 апреля, контекст пересобран',
    icon: PenTool,
  },
  {
    time: '17:00',
    title: 'Итоги дня',
    description: '«Что по сделкам сегодня?»',
    calls: ['mem_get_daily_digest()'],
    result: 'Движение по сделкам, встречи, проблемные зоны',
    icon: Calendar,
  },
];

export function JarvisArchitecturePage() {
  const [expandedGroup, setExpandedGroup] = useState<string | null>('interactions');
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Philosophy */}
      <div className="matte-glass p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Plugin Architecture</h2>
            <p className="text-[13px] text-muted-foreground">Память — plugin, а не встроенная часть агента</p>
          </div>
        </div>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          JARVIS подключает Memory Toolkit так же, как подключает Registry Tools или Tender Tools.
          Каждый tool — атомарная операция. Агент сам комбинирует их для решения задач.
          <span className="text-primary font-medium"> 16 инструментов</span> в
          <span className="text-primary font-medium"> 4 группах</span>.
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
          {[
            { label: 'READ tools', value: '10', icon: Eye },
            { label: 'WRITE-DRAFT tools', value: '6', icon: Shield },
            { label: 'Группы', value: '4', icon: Database },
            { label: 'Бюджет контекста', value: '≤8K', icon: Zap },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <s.icon className="w-3.5 h-3.5 text-primary" />
              <span className="text-[12px] text-muted-foreground">{s.label}:</span>
              <span className="text-[13px] font-medium text-foreground">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tool Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {toolGroups.map((group) => {
          const isExpanded = expandedGroup === group.id;
          const Icon = group.icon;
          const readCount = group.tools.filter(t => t.type === 'READ').length;
          const writeCount = group.tools.filter(t => t.type === 'WRITE-DRAFT').length;

          return (
            <div
              key={group.id}
              className="matte-glass overflow-hidden cursor-pointer"
              onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-[10px] bg-muted/50 flex items-center justify-center ${group.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-semibold text-foreground">{group.title}</h3>
                      <span className="text-[11px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">
                        {group.tools.length} tools
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground">{group.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">{readCount}R</span>
                  {writeCount > 0 && <span className="text-[11px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full">{writeCount}W</span>}
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                      {group.tools.map((tool) => (
                        <div key={tool.name} className="flex items-start gap-3 p-2.5 rounded-[10px] bg-muted/20 hover:bg-muted/30 transition-colors">
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0 ${
                            tool.type === 'READ'
                              ? 'bg-emerald-400/10 text-emerald-400'
                              : 'bg-amber-400/10 text-amber-400'
                          }`}>
                            {tool.type}
                          </span>
                          <div className="flex-1 min-w-0">
                            <code className="text-[12px] font-mono text-primary">{tool.name}</code>
                            <p className="text-[12px] text-muted-foreground mt-0.5">{tool.description}</p>
                            <p className="text-[11px] text-muted-foreground/70 mt-1 italic">→ {tool.trigger}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Workflow Example */}
      <div className="matte-glass p-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Полный цикл рабочего дня</h2>
        <p className="text-[13px] text-muted-foreground mb-6">Как JARVIS использует Memory Toolkit в течение дня</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {workflowSteps.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = activeWorkflowStep === i;

            return (
              <div
                key={i}
                onClick={() => setActiveWorkflowStep(i)}
                className={`p-4 rounded-[14px] cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-muted/10 border-border hover:border-primary/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-primary/20' : 'bg-muted/30'
                  }`}>
                    <StepIcon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <span className="text-[12px] font-mono text-primary">{step.time}</span>
                </div>

                <h4 className="text-[14px] font-medium text-foreground mb-1">{step.title}</h4>
                <p className="text-[12px] text-muted-foreground mb-3">{step.description}</p>

                <div className="space-y-1 mb-3">
                  {step.calls.map((call, j) => (
                    <code key={j} className="block text-[11px] font-mono text-primary/80">
                      → {call}
                    </code>
                  ))}
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border pt-2">
                  {step.result}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* File Structure */}
      <div className="matte-glass p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Файловая структура plugin-а</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-[13px] font-medium text-foreground mb-2">Entry Point</h4>
            <div className="bg-muted/20 rounded-[10px] p-3 font-mono text-[12px] space-y-1">
              <div className="text-muted-foreground">server/modules/pm/tools/</div>
              <div className="text-primary pl-4">memory-tools.ts</div>
            </div>
          </div>
          <div>
            <h4 className="text-[13px] font-medium text-foreground mb-2">Модули</h4>
            <div className="bg-muted/20 rounded-[10px] p-3 font-mono text-[12px] space-y-1">
              <div className="text-muted-foreground">server/modules/pm/lib/memory/</div>
              {['interaction-actions.ts', 'dossier-actions.ts', 'trigger-actions.ts', 'brief-generator.ts', 'context-loader.ts', 'consolidation.ts', 'fact-extractor.ts'].map((f) => (
                <div key={f} className="text-primary pl-4">{f}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Registration code */}
        <div className="mt-4 bg-muted/20 rounded-[10px] p-4">
          <h4 className="text-[12px] font-medium text-muted-foreground mb-2">Регистрация (3 строки в chat.ts)</h4>
          <pre className="font-mono text-[12px] text-foreground">
{`import { registerMemoryTools } from '../modules/pm/tools/memory-tools.js';
registerMemoryTools(); // Регистрирует все 16 tools в JARVIS`}
          </pre>
        </div>

        {/* Permissions */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-emerald-400/5 border border-emerald-400/15 rounded-[10px] p-3">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[12px] font-medium text-emerald-400">READ — свободно</span>
            </div>
            <div className="font-mono text-[11px] text-muted-foreground space-y-0.5">
              {['mem_get_interactions', 'mem_get_interaction_detail', 'mem_search_interactions', 'mem_get_dossier', 'mem_get_dossier_full', 'mem_list_triggers', 'mem_get_alerts', 'mem_generate_brief', 'mem_get_deal_context', 'mem_get_daily_digest'].map((t) => (
                <div key={t}>{t}</div>
              ))}
            </div>
          </div>
          <div className="bg-amber-400/5 border border-amber-400/15 rounded-[10px] p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[12px] font-medium text-amber-400">WRITE-DRAFT — с подтверждением</span>
            </div>
            <div className="font-mono text-[11px] text-muted-foreground space-y-0.5">
              {['mem_log_interaction', 'mem_update_dossier', 'mem_rebuild_dossier', 'mem_create_trigger', 'mem_snooze_trigger', 'mem_rebuild_deal_context'].map((t) => (
                <div key={t}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

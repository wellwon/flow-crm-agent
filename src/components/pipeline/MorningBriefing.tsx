import { X, AlertTriangle, CheckCircle, Clock, Users, TrendingUp, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MorningBriefingProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MorningBriefing({ isOpen, onClose }: MorningBriefingProps) {
  const today = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative matte-glass w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-node-active uppercase tracking-wider">JARVIS · Утренний брифинг</span>
                </div>
                <h2 className="text-lg font-semibold text-foreground mt-1 capitalize">{today}</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted/50 transition-colors" aria-label="Close">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Urgent */}
              <BriefingSection title="СРОЧНО" icon={AlertTriangle} iconColor="text-node-error">
                <BriefingCard
                  title="Тендер «КТ Siemens» — подача документов СЕГОДНЯ"
                  items={['📎 ТЗ готов (сгенерирован ночью)', '📎 НМЦК готов (3 КП)', '⚠️ Не хватает: согласование цены от руководителя']}
                  actions={['Посмотреть документы', 'Запросить согласование']}
                />
                <BriefingCard
                  title="РУ аппарата Mindray DC-70 истекает через 28 дней"
                  items={['→ 2 активных сделки затронуты', '→ Найден аналог: Mindray DC-80 (РУ до 2029)']}
                  actions={['Переключить на DC-80', 'Игнорировать']}
                />
              </BriefingSection>

              {/* Tasks */}
              <BriefingSection title="ЗАДАЧИ НА ДЕНЬ" icon={CheckCircle} iconColor="text-node-completed" badge="6 штук · ~4.5 часа">
                <div className="space-y-2">
                  {[
                    { task: 'Подготовить КП для ЦРБ Коломна', time: '~45 мин', draft: true },
                    { task: 'Позвонить в Областную больницу №3', time: '~15 мин', draft: false },
                    { task: 'Проверить статус поставки по ETR-38', time: '~10 мин', draft: false },
                    { task: 'Обновить данные по 3 сделкам', time: '~30 мин', draft: true },
                    { task: 'Ревью документов от Сергея', time: '~20 мин', draft: false },
                    { task: 'Заполнить отчёт по встрече с ЦРБ', time: '~15 мин', draft: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted border border-border hover:border-primary/30 transition-colors cursor-pointer group">
                      <span className="text-[11px] text-foreground flex-1">{item.task}</span>
                      {item.draft && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[hsl(265_80%_65%)/0.15] text-[hsl(265_80%_65%)]">Черновик</span>}
                      <span className="text-[10px] text-muted-foreground font-mono">{item.time}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Агент подготовил черновики для пунктов 1, 4, 6</p>
              </BriefingSection>

              {/* Night monitoring */}
              <BriefingSection title="НОЧНОЙ МОНИТОРИНГ" icon={Search} iconColor="text-primary">
                <div className="space-y-2">
                  <p className="text-[11px] text-foreground">Найдено 3 новых тендера по вашим НКМИ-кодам:</p>
                  {[
                    { eq: 'УЗИ', city: 'Москва', amount: '4.2М ₽', deadline: '15 апр' },
                    { eq: 'Рентген', city: 'Казань', amount: '2.8М ₽', deadline: '10 апр' },
                    { eq: 'МРТ', city: 'С-Пб', amount: '12М ₽', deadline: '20 апр' },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted border border-border">
                      <span className="text-[11px] text-foreground">{t.eq} — {t.city}</span>
                      <span className="text-[10px] font-mono text-node-completed ml-auto">{t.amount}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">→ {t.deadline}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 italic">
                  Конкурент «МедТехСнаб» не участвовал в последних 5 тендерах в МО
                </p>
              </BriefingSection>

              {/* Team */}
              <BriefingSection title="КОМАНДА" icon={Users} iconColor="text-primary">
                <div className="space-y-2">
                  <TeamRow name="Иван" status="warning" detail="⚠️ 2 просроченных, перегружен (6 задач)" />
                  <TeamRow name="Мария" status="ok" detail="✅ Всё в срок, есть ресурс (3 задачи)" />
                  <TeamRow name="Сергей" status="blocked" detail="🔒 1 задача заблокирована (ждёт от Ивана)" />
                </div>
                <div className="mt-3 p-2.5 rounded-lg bg-node-active/10 border border-node-active/20">
                  <p className="text-[11px] text-node-active">💡 Рекомендация: переназначить ETR-51 с Ивана на Марию</p>
                </div>
              </BriefingSection>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex items-center gap-3">
              <button className="flex-1 py-2.5 rounded-xl bg-node-completed text-primary-foreground text-xs font-semibold hover:brightness-110 transition-all">
                Принять план дня
              </button>
              <button className="px-4 py-2.5 rounded-xl bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 transition-all">
                Изменить
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BriefingSection({ title, icon: Icon, iconColor, badge, children }: {
  title: string; icon: React.ElementType; iconColor: string; badge?: string; children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl bg-muted border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <h3 className="text-[10px] font-mono text-foreground uppercase tracking-wider">{title}</h3>
        {badge && <span className="text-[9px] text-muted-foreground font-mono ml-auto">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function BriefingCard({ title, items, actions }: { title: string; items: string[]; actions: string[] }) {
  return (
    <div className="p-3 rounded-lg bg-background/40 border border-node-error/20 mb-2">
      <p className="text-[11px] font-semibold text-foreground mb-2">{title}</p>
      {items.map((item, i) => (
        <p key={i} className="text-[10px] text-muted-foreground">{item}</p>
      ))}
      <div className="flex gap-2 mt-2">
        {actions.map((a, i) => (
          <button key={i} className="text-[10px] px-2 py-1 rounded bg-primary/15 text-primary hover:bg-primary/25 transition-colors">{a}</button>
        ))}
      </div>
    </div>
  );
}

function TeamRow({ name, status, detail }: { name: string; status: 'ok' | 'warning' | 'blocked'; detail: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-background/40 border border-border/20">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${
        status === 'ok' ? 'bg-node-completed/20 text-node-completed' :
        status === 'warning' ? 'bg-node-active/20 text-node-active' :
        'bg-node-error/20 text-node-error'
      }`}>
        {name[0]}
      </div>
      <span className="text-[11px] text-foreground flex-1">{detail}</span>
    </div>
  );
}

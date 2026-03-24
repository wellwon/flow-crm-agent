import { X, CheckCircle, Clock, User, MessageSquare, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PipelineNodeData } from '@/types/pipeline';

interface NodeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: PipelineNodeData | null;
  nodeId: string | null;
}

const activityLog = [
  { time: '14:32', text: 'JARVIS: ТЗ сгенерировано на основе встречи №2', icon: Zap },
  { time: '13:10', text: 'Алексей М. загрузил протокол встречи', icon: MessageSquare },
  { time: '11:45', text: 'Система: ИНН верифицирован через ФНС API', icon: CheckCircle },
  { time: '09:00', text: 'Сделка создана автоматически', icon: Clock },
];

export function NodeDrawer({ isOpen, onClose, data, nodeId }: NodeDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && data && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute top-0 right-0 bottom-0 w-[400px] z-20 glass-panel-dense rounded-none rounded-l-2xl overflow-hidden"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  NODE::{nodeId}
                </span>
                <h2 className="text-sm font-semibold text-foreground mt-0.5">
                  {data.label}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Status section */}
              <Section title="СТАТУС">
                <div className="flex items-center gap-2">
                  <StatusDot status={data.status} />
                  <span className="text-xs text-foreground capitalize">{data.status}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto font-mono">
                    {data.progress}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      data.status === 'completed'
                        ? 'bg-node-completed'
                        : data.status === 'active'
                        ? 'bg-node-active'
                        : 'bg-muted-foreground/30'
                    }`}
                    style={{ width: `${data.progress}%` }}
                  />
                </div>
              </Section>

              {/* Assignee */}
              <Section title="ИСПОЛНИТЕЛЬ">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-xs text-foreground">{data.assignee || '—'}</span>
                </div>
              </Section>

              {/* Description */}
              <Section title="ОПИСАНИЕ">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {data.summary}
                </p>
              </Section>

              {/* AI Terminal */}
              <Section title="JARVIS OUTPUT">
                <div className="bg-background/60 rounded-lg p-3 border border-border/30 font-mono text-[11px] text-node-completed space-y-1">
                  <p>{'>'} Анализ завершён.</p>
                  <p>{'>'} Релевантность: 94.2%</p>
                  <p>{'>'} Рекомендация: продолжить</p>
                  <p className="text-muted-foreground">{'>'} _</p>
                </div>
              </Section>

              {/* Activity log */}
              <Section title="АКТИВНОСТЬ">
                <div className="space-y-3">
                  {activityLog.map((log, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <log.icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[11px] text-foreground/80">{log.text}</p>
                        <span className="text-[9px] text-muted-foreground font-mono">
                          {log.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>

            {/* Footer */}
            {data.status === 'active' && (
              <div className="p-4 border-t border-border/50">
                <button className="w-full py-2.5 rounded-xl bg-node-completed text-primary-foreground text-xs font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Завершить шаг
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em] mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    completed: 'bg-node-completed',
    active: 'bg-node-active',
    pending: 'bg-node-pending',
    error: 'bg-node-error',
  };
  return (
    <span
      className={`w-2 h-2 rounded-full ${colorMap[status] || colorMap.pending} ${
        status === 'active' ? 'animate-pulse' : ''
      }`}
    />
  );
}

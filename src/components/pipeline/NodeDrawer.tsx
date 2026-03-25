import { useState } from 'react';
import { X, CheckCircle, Clock, User, MessageSquare, Zap, Bot, Shield, ShieldCheck, ShieldX, ShieldAlert, Calendar, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PipelineNodeData, NodeCategory } from '@/types/pipeline';
import { NODE_CATEGORIES } from '@/types/pipeline';

interface NodeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: PipelineNodeData | null;
  nodeId: string | null;
  onComplete?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
}

type DrawerTab = 'details' | 'activity' | 'ai' | 'compliance';

const defaultActivity = [
  { time: '14:32', text: 'JARVIS: ТЗ сгенерировано на основе тендера', type: 'ai' as const },
  { time: '13:10', text: 'Алексей М. загрузил протокол встречи', type: 'human' as const },
  { time: '11:45', text: 'Система: ИНН верифицирован через ФНС API', type: 'system' as const },
  { time: '09:00', text: 'Сделка создана автоматически', type: 'system' as const },
];

const categoryLabels: Record<NodeCategory, string> = {
  human_action: 'Действие',
  gate: 'Шлюз',
  ai_action: 'AI Agent',
  system: 'Система',
};

export function NodeDrawer({ isOpen, onClose, data, nodeId, onComplete, onDelete }: NodeDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('details');

  const tabs: { id: DrawerTab; label: string; show: boolean }[] = [
    { id: 'details', label: 'Детали', show: true },
    { id: 'activity', label: 'Лог', show: true },
    { id: 'ai', label: 'AI', show: !!data && NODE_CATEGORIES[data.type] === 'ai_action' },
    { id: 'compliance', label: 'Checks', show: !!data?.complianceChecks?.length },
  ];

  return (
    <AnimatePresence>
      {isOpen && data && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute top-0 right-0 bottom-0 w-[420px] z-20 bg-card border-l border-border overflow-hidden"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      NODE::{nodeId}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      NODE_CATEGORIES[data.type] === 'ai_action' ? 'bg-[hsl(265_80%_65%)/0.15] text-[hsl(265_80%_65%)]' :
                      NODE_CATEGORIES[data.type] === 'gate' ? 'bg-node-active/15 text-node-active' :
                      NODE_CATEGORIES[data.type] === 'human_action' ? 'bg-primary/15 text-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {categoryLabels[NODE_CATEGORIES[data.type]]}
                    </span>
                  </div>
                  <h2 className="text-sm font-semibold text-foreground mt-1">{data.label}</h2>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-[8px] hover:bg-muted/50 transition-colors" aria-label="Close drawer">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1">
                {tabs.filter(t => t.show).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-[8px] text-[11px] font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {activeTab === 'details' && <DetailsTab data={data} />}
              {activeTab === 'activity' && <ActivityTab data={data} />}
              {activeTab === 'ai' && <AITab data={data} />}
              {activeTab === 'compliance' && <ComplianceTab data={data} />}
            </div>

            {/* Footer */}
            {data.status !== 'completed' && nodeId && (
              <div className="p-4 border-t border-border flex gap-2">
                <button
                  onClick={() => onComplete?.(nodeId)}
                  className="flex-1 py-2.5 rounded-[14px] bg-node-completed text-primary-foreground text-xs font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Завершить шаг
                </button>
                <button
                  onClick={() => onDelete?.(nodeId)}
                  className="px-4 py-2.5 rounded-[14px] bg-node-error/15 text-node-error text-xs font-medium hover:bg-node-error/25 transition-all"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DetailsTab({ data }: { data: PipelineNodeData }) {
  return (
    <>
      <Section title="СТАТУС">
        <div className="flex items-center gap-2">
          <StatusDot status={data.status} />
          <span className="text-xs text-foreground capitalize">{data.status}</span>
          <span className="text-[10px] text-muted-foreground ml-auto font-mono">{data.progress}%</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              data.status === 'completed' ? 'bg-node-completed' :
              data.status === 'active' ? 'bg-node-active' :
              data.status === 'waiting' ? 'bg-primary' :
              'bg-muted-foreground/30'
            }`}
            style={{ width: `${data.progress}%` }}
          />
        </div>
      </Section>

      <Section title="ИСПОЛНИТЕЛЬ">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-xs text-foreground">{data.assignee || '—'}</span>
        </div>
      </Section>

      {data.phase && (
        <Section title="ФАЗА">
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-muted text-muted-foreground">{data.phase}</span>
        </Section>
      )}

      {data.dueDate && (
        <Section title="ДЕДЛАЙН">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-foreground font-mono">{data.dueDate}</span>
          </div>
        </Section>
      )}

      <Section title="ОПИСАНИЕ">
        <p className="text-xs text-muted-foreground leading-relaxed">{data.summary}</p>
      </Section>
    </>
  );
}

function ActivityTab({ data }: { data: PipelineNodeData }) {
  const logs = data.activityLog || defaultActivity;
  const iconMap = { ai: Bot, human: MessageSquare, system: Zap };
  const colorMap = { ai: 'text-[hsl(265_80%_65%)]', human: 'text-primary', system: 'text-muted-foreground' };

  return (
    <Section title="ХРОНОЛОГИЯ">
      <div className="space-y-3">
        {logs.map((log, i) => {
          const LogIcon = iconMap[log.type];
          return (
            <div key={i} className="flex items-start gap-2">
              <LogIcon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${colorMap[log.type]}`} />
              <div>
                <p className="text-[11px] text-foreground/80">{log.text}</p>
                <span className="text-[9px] text-muted-foreground font-mono">{log.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function AITab({ data }: { data: PipelineNodeData }) {
  const output = data.aiOutput || ['> Анализ завершён.', '> Релевантность: 94.2%', '> Рекомендация: продолжить', '> _'];
  return (
    <>
      <Section title="JARVIS OUTPUT">
        <div className="bg-muted rounded-[8px] p-3 border border-border font-mono text-[11px] text-node-completed space-y-1">
          {output.map((line, i) => (
            <p key={i} className={line === '> _' ? 'text-muted-foreground animate-pulse' : ''}>{line}</p>
          ))}
        </div>
      </Section>

      <Section title="МЕТРИКИ АГЕНТА">
        <div className="grid grid-cols-2 gap-2">
          <MetricCard label="Confidence" value="96.1%" />
          <MetricCard label="Время выполнения" value="2.4s" />
          <MetricCard label="Токены" value="1,247" />
          <MetricCard label="Версия" value="v2.1" />
        </div>
      </Section>
    </>
  );
}

function ComplianceTab({ data }: { data: PipelineNodeData }) {
  if (!data.complianceChecks) return null;

  const passed = data.complianceChecks.filter(c => c.passed === true).length;
  const failed = data.complianceChecks.filter(c => c.passed === false).length;
  const unchecked = data.complianceChecks.filter(c => c.passed === null).length;

  return (
    <>
      <Section title="COMPLIANCE SUMMARY">
        <div className="grid grid-cols-3 gap-2">
          <MetricCard label="Пройдено" value={String(passed)} color="text-node-completed" />
          <MetricCard label="Провалено" value={String(failed)} color="text-node-error" />
          <MetricCard label="Не проверено" value={String(unchecked)} color="text-muted-foreground" />
        </div>
      </Section>

      <Section title="ПРОВЕРКИ">
        <div className="space-y-2">
          {data.complianceChecks.map((check, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-[8px] bg-muted/50 border border-border">
              {check.passed === true && <ShieldCheck className="w-4 h-4 text-node-completed shrink-0" />}
              {check.passed === false && <ShieldX className="w-4 h-4 text-node-error shrink-0" />}
              {check.passed === null && <ShieldAlert className="w-4 h-4 text-muted-foreground shrink-0" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-foreground truncate">{check.name}</span>
                  {check.critical && <AlertTriangle className="w-3 h-3 text-node-active shrink-0" />}
                </div>
                <span className="text-[9px] text-muted-foreground">{check.source}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="p-2 rounded-[8px] bg-muted/50 border border-border">
      <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">{label}</span>
      <span className={`text-sm font-mono font-semibold ${color || 'text-foreground'}`}>{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em] mb-2">{title}</h3>
      {children}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    completed: 'bg-node-completed', active: 'bg-node-active', pending: 'bg-node-pending',
    error: 'bg-node-error', waiting: 'bg-primary', skipped: 'bg-node-pending/50',
  };
  return <span className={`w-2 h-2 rounded-full ${colorMap[status] || colorMap.pending} ${status === 'active' ? 'animate-pulse' : ''}`} />;
}

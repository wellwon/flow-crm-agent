import { useState } from 'react';
import {
  Image, FileText, Headphones, X, ChevronLeft,
  ListChecks, Clock, CircleDot, CheckCircle, Bot,
  User, Zap, MessageSquare, Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  projectData,
  type ProjectTask, type TimelineEntry,
} from '@/data/mockProjectData';

type PanelTab = 'tasks' | 'timeline' | 'media' | 'files' | 'audio';

const tabs: { key: PanelTab; label: string; icon: typeof Image }[] = [
  { key: 'tasks', label: 'Задачи', icon: ListChecks },
  { key: 'timeline', label: 'Хроно', icon: Clock },
  { key: 'media', label: 'Медиа', icon: Image },
  { key: 'files', label: 'Файлы', icon: FileText },
  { key: 'audio', label: 'Аудио', icon: Headphones },
];

const mockFiles = [
  { id: '1', name: 'КП_Mindray_DC70.pdf', type: 'files' as PanelTab, size: '2.4 MB', date: '18 мар' },
  { id: '2', name: 'ТЗ_УЗИ_черновик.docx', type: 'files' as PanelTab, size: '1.1 MB', date: '20 мар' },
  { id: '3', name: 'Протокол_встречи.pdf', type: 'files' as PanelTab, size: '340 KB', date: '15 мар' },
  { id: '4', name: 'Запись_звонка_Петрова.mp3', type: 'audio' as PanelTab, size: '8.2 MB', date: '22 мар' },
  { id: '5', name: 'Брифинг_утро.mp3', type: 'audio' as PanelTab, size: '3.1 MB', date: '25 мар' },
];

export function MediaFilesPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<PanelTab>('tasks');
  const d = projectData;

  const allTasks: (ProjectTask & { source: string })[] = [
    ...d.tasks.map(t => ({ ...t, source: 'Проект' })),
    ...d.deals.flatMap(deal => deal.tasks.map(t => ({ ...t, source: deal.id + ' ' + deal.title.slice(0, 20) }))),
  ];

  const allTimeline: (TimelineEntry & { source: string })[] = [
    ...d.timeline.map(t => ({ ...t, source: 'Проект' })),
    ...d.deals.flatMap(deal => deal.timeline.map(t => ({ ...t, source: deal.id }))),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const filteredFiles = mockFiles.filter(f => f.type === activeTab);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-[340px] 2xl:w-[380px] shrink-0 matte-glass border-l border-border flex flex-col h-full"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-[8px] flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-semibold text-foreground flex-1">Панель проекта</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-[8px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-2 pt-2 flex gap-0 border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 pb-2.5 text-[11px] font-medium transition-all relative flex items-center justify-center gap-1 ${
                activeTab === tab.key
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              <span className="hidden xl:inline">{tab.label}</span>
              {activeTab === tab.key && (
                <motion.div
                  layoutId="panel-tab-indicator"
                  className="absolute bottom-0 left-1 right-1 h-[2px] bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'tasks' && <TasksContent tasks={allTasks} />}
          {activeTab === 'timeline' && <TimelineContent timeline={allTimeline} />}
          {(activeTab === 'media' || activeTab === 'files' || activeTab === 'audio') && (
            <FilesContent files={filteredFiles} activeTab={activeTab} />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Tasks ─── */
function TasksContent({ tasks }: { tasks: (ProjectTask & { source: string })[] }) {
  const active = tasks.filter(t => t.status !== 'completed');
  const done = tasks.filter(t => t.status === 'completed');

  return (
    <div className="px-3 py-3 space-y-3">
      <div>
        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2 px-1">
          Активные и ожидающие ({active.length})
        </div>
        <div className="space-y-1.5">
          {active.map(task => (
            <div key={`${task.dealId}-${task.id}`} className={`flex items-start gap-3 p-3 rounded-[10px] border transition-all ${
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
                </div>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <div className="flex items-center gap-1">
                    {task.assignee === 'JARVIS' ? (
                      <Bot className="w-3 h-3 text-[hsl(265_80%_65%)]" />
                    ) : (
                      <User className="w-3 h-3 text-muted-foreground/60" />
                    )}
                    <span className="text-[10px] text-muted-foreground">{task.assignee}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground/60">{task.deadline}</span>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                    task.dealId ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {task.dealId || 'Проект'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2 px-1">Выполнено ({done.length})</div>
        <div className="space-y-1.5">
          {done.map(task => (
            <div key={`${task.dealId}-${task.id}`} className="flex items-center gap-3 p-2.5 rounded-[10px] bg-node-completed/5 border border-node-completed/20">
              <CheckCircle className="w-3.5 h-3.5 text-node-completed shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-muted-foreground line-through">{task.title}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-muted-foreground/60">{task.assignee}</span>
                  <span className={`text-[8px] font-mono px-1 py-0.5 rounded ${
                    task.dealId ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {task.dealId || 'Проект'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Timeline ─── */
function TimelineContent({ timeline }: { timeline: (TimelineEntry & { source: string })[] }) {
  return (
    <div className="px-3 py-3">
      <div className="relative pl-5 space-y-0">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
        {timeline.map((ev, i) => {
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
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-mono text-muted-foreground/50">{ev.date}</span>
                  <span className={`text-[8px] font-mono px-1 py-0.5 rounded ${
                    ev.dealId ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {ev.dealId || 'Проект'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Files / Media / Audio ─── */
function FilesContent({ files, activeTab }: { files: typeof mockFiles; activeTab: PanelTab }) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        {activeTab === 'media' && <Image className="w-10 h-10 mb-3 opacity-30" />}
        {activeTab === 'files' && <FileText className="w-10 h-10 mb-3 opacity-30" />}
        {activeTab === 'audio' && <Headphones className="w-10 h-10 mb-3 opacity-30" />}
        <span className="text-xs">
          {activeTab === 'media' && 'Нет медиа'}
          {activeTab === 'files' && 'Нет файлов'}
          {activeTab === 'audio' && 'Нет аудио'}
        </span>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {files.map(file => (
        <button
          key={file.id}
          className="w-full text-left p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              {file.type === 'audio' ? (
                <Headphones className="w-4 h-4 text-primary" />
              ) : (
                <FileText className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-foreground truncate">{file.name}</p>
              <p className="text-[10px] text-muted-foreground">{file.size} • {file.date}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import {
  Bot, Send, Sparkles, FileText, AlertTriangle, TrendingUp, Clock,
  MessageSquare, PanelLeftOpen, PanelLeftClose,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { mockDeals } from '@/data/mockDeals';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SidebarTab = 'jarvis' | 'chat' | 'timeline';

interface Message {
  id: string;
  role: 'user' | 'jarvis';
  text: string;
  time: string;
}

const initialJarvisMessages: Message[] = [
  { id: '1', role: 'jarvis', text: '👋 Привет! Я JARVIS — ваш ассистент по сделке. Задайте вопрос или используйте быстрые действия ниже.', time: '09:00' },
  { id: '2', role: 'jarvis', text: '⚠️ Напоминаю: ТЗ ждёт одобрения уже 2 дня. Это блокирует расчёт НМЦК.', time: '09:01' },
];

const initialChatMessages: Message[] = [
  { id: 'c1', role: 'jarvis', text: '💬 Командный чат по проекту. Здесь можно обсуждать задачи с коллегами.', time: '09:00' },
];

const quickActions = [
  { label: 'Статус', icon: TrendingUp },
  { label: 'Риски', icon: AlertTriangle },
  { label: 'Документы', icon: FileText },
  { label: 'Что дальше?', icon: Sparkles },
];

function getJarvisReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('статус')) return '📊 Сделка на этапе «Подготовка ТЗ» (22%). 4 из 11 шагов завершены. Ближайший дедлайн: 28 марта.';
  if (lower.includes('риск')) return '⚠️ 2 риска:\n• ТЗ ждёт одобрения — блокер для НМЦК\n• Конкурент GE может дать цену ниже на аукционе';
  if (lower.includes('документ')) return '📄 Готово: КП (отправлено 18 мар), ТЗ (черновик AI).\nНе готово: НМЦК, Заявка на аукцион.';
  if (lower.includes('дальше') || lower.includes('next')) return '🎯 Рекомендую:\n1. Согласовать ТЗ с руководителем\n2. Собрать 3 КП для расчёта НМЦК\n3. Уточнить спецификацию датчиков с Петровой';
  return '🤖 Понял. Анализирую данные по сделке... Могу помочь с документами, рисками или подготовкой к встрече.';
}

const tabsDef: { key: SidebarTab; label: string; icon: typeof Bot }[] = [
  { key: 'jarvis', label: 'JARVIS', icon: Bot },
  { key: 'chat', label: 'Чат', icon: MessageSquare },
  { key: 'timeline', label: 'Таймлайн', icon: Clock },
];

/* ─── Mini Timeline ─── */
function MiniTimeline() {
  const navigate = useNavigate();
  const now = new Date();
  const start = new Date(now); start.setDate(start.getDate() - 15);
  const end = new Date(now); end.setDate(end.getDate() + 75);
  const totalMs = end.getTime() - start.getTime();

  const deals = mockDeals
    .filter(d => d.status !== 'won' && d.status !== 'lost')
    .map(d => {
      const dl = new Date(d.deadline);
      const pct = ((dl.getTime() - start.getTime()) / totalMs) * 100;
      return { ...d, deadlineDate: dl, pct: Math.max(0, Math.min(100, pct)), isOverdue: dl < now };
    })
    .sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime());

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-2">Ближайшие дедлайны</p>
        {deals.map(deal => (
          <Tooltip key={deal.id}>
            <TooltipTrigger asChild>
              <button onClick={() => navigate(`/project/${deal.id}`)} className="w-full text-left p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${deal.isOverdue ? 'bg-destructive animate-pulse' : 'bg-primary'}`} />
                  <span className="text-[11px] font-medium text-foreground truncate">{deal.title}</span>
                </div>
                <div className="flex items-center justify-between pl-4">
                  <span className="text-[10px] text-muted-foreground">{deal.company}</span>
                  <span className={`text-[10px] font-medium ${deal.isOverdue ? 'text-destructive' : 'text-primary'}`}>
                    {deal.deadlineDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-card border-border rounded-[10px] p-3 max-w-[200px]">
              <p className="text-[11px] text-muted-foreground">{(deal.amount / 1_000_000).toFixed(1)}M ₽</p>
              {deal.isOverdue && <p className="text-[10px] text-destructive mt-1 font-medium">⚠ Просрочен</p>}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

/* ─── Chat content ─── */
function ChatContent({ messages, input, setInput, send, showQuickActions }: {
  messages: Message[]; input: string; setInput: (v: string) => void; send: (t: string) => void; showQuickActions: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-primary/10 border border-primary/20 text-foreground rounded-bl-sm'
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className={`text-[9px] mt-1 block ${msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{msg.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showQuickActions && (
        <div className="px-3 py-2 flex flex-wrap gap-1.5 border-t border-border/50">
          {quickActions.map(a => (
            <button key={a.label} onClick={() => send(a.label)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-primary/20 bg-primary/5 text-[10px] font-medium text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors">
              <a.icon className="w-3 h-3" />{a.label}
            </button>
          ))}
        </div>
      )}

      <div className="px-3 py-2.5 border-t border-border/50">
        <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex items-center gap-2 rounded-xl border border-border/50 bg-card px-3 py-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder={showQuickActions ? 'Спросить JARVIS...' : 'Написать сообщение...'}
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none" />
          <button type="submit" disabled={!input.trim()}
            className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center text-primary hover:bg-primary/25 transition-colors disabled:opacity-30">
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </>
  );
}

/* ─── Collapsed strip ─── */
function CollapsedStrip({ onExpand }: { onExpand: () => void }) {
  return (
    <div className="h-full w-[44px] matte-glass rounded-tl-none flex flex-col items-center py-3 gap-3">
      <button onClick={onExpand}
        className="w-8 h-8 rounded-[8px] flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
        <PanelLeftOpen className="w-4 h-4" />
      </button>
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <span className="text-[9px] text-muted-foreground font-mono [writing-mode:vertical-lr] rotate-180 mt-2">JARVIS</span>
    </div>
  );
}

/* ═══ Main exported sidebar ═══ */
export function JarvisChatSidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('jarvis');
  const [jarvisMessages, setJarvisMessages] = useState<Message[]>(initialJarvisMessages);
  const [chatMessages, setChatMessages] = useState<Message[]>(initialChatMessages);
  const [jarvisInput, setJarvisInput] = useState('');
  const [chatInput, setChatInput] = useState('');

  const sendJarvis = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setJarvisMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: text.trim(), time: now }]);
    setJarvisInput('');
    setTimeout(() => {
      setJarvisMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'jarvis', text: getJarvisReply(text),
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 600);
  };

  const sendChat = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: text.trim(), time: now }]);
    setChatInput('');
  };

  if (!isOpen) return <CollapsedStrip onExpand={onToggle} />;

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="w-[340px] 2xl:w-[380px] shrink-0 matte-glass rounded-tl-none rounded-br-none border-r border-border flex flex-col h-full"
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Bot className="w-3.5 h-3.5 text-primary" />
        </div>
        <h2 className="text-sm font-semibold text-foreground flex-1">JARVIS</h2>
        <button onClick={onToggle}
          className="w-7 h-7 rounded-[8px] flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Tab strip */}
      <div className="relative px-2 pt-2 flex gap-0 border-b border-border">
        {tabsDef.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 pb-2.5 text-[11px] font-medium transition-all relative flex items-center justify-center gap-1 ${
              activeTab === tab.key ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}>
            <tab.icon className="w-3 h-3" />
            <span className="hidden xl:inline">{tab.label}</span>
            {activeTab === tab.key && (
              <motion.div layoutId="left-tab-indicator" className="absolute bottom-0 left-1 right-1 h-[2px] bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'jarvis' && (
          <ChatContent messages={jarvisMessages} input={jarvisInput} setInput={setJarvisInput} send={sendJarvis} showQuickActions />
        )}
        {activeTab === 'chat' && (
          <ChatContent messages={chatMessages} input={chatInput} setInput={setChatInput} send={sendChat} showQuickActions={false} />
        )}
        {activeTab === 'timeline' && <MiniTimeline />}
      </div>
    </motion.div>
  );
}

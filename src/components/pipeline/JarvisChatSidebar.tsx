import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'jarvis';
  text: string;
  time: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'jarvis',
    text: '👋 Привет! Я JARVIS — ваш ассистент по сделке. Задайте вопрос или используйте быстрые действия ниже.',
    time: '09:00',
  },
  {
    id: '2',
    role: 'jarvis',
    text: '⚠️ Напоминаю: ТЗ ждёт одобрения уже 2 дня. Это блокирует расчёт НМЦК.',
    time: '09:01',
  },
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

export function JarvisChatSidebar() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim(), time: now };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'jarvis',
        text: getJarvisReply(text),
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    }, 600);
  };

  return (
    <div className="w-[300px] flex-shrink-0 border-r border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <span className="text-xs font-semibold text-foreground">JARVIS</span>
          <span className="text-[9px] text-muted-foreground ml-1.5 font-mono">онлайн</span>
        </div>
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-node-completed animate-pulse" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className={`text-[9px] mt-1 block ${
                  msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                }`}>
                  {msg.time}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick actions */}
      <div className="px-3 py-2 flex flex-wrap gap-1.5 border-t border-border">
        {quickActions.map(a => (
          <button
            key={a.label}
            onClick={() => send(a.label)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <a.icon className="w-3 h-3" />
            {a.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 py-2.5 border-t border-border">
        <form
          onSubmit={e => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2"
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Спросить JARVIS..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center text-primary hover:bg-primary/25 transition-colors disabled:opacity-30"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
}

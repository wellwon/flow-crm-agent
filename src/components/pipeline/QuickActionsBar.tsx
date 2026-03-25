import { FileText, Send, Phone, ListTodo, FileSearch, Brain } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const actions = [
  { icon: FileText, label: 'Сгенерировать ТЗ', msg: 'Генерация ТЗ запущена' },
  { icon: Send, label: 'Отправить КП', msg: 'КП подготовлено к отправке' },
  { icon: Phone, label: 'Запланировать звонок', msg: 'Звонок запланирован' },
  { icon: ListTodo, label: 'Создать задачу', msg: 'Задача создана' },
  { icon: FileSearch, label: 'Запросить документ', msg: 'Запрос документа отправлен' },
  { icon: Brain, label: 'AI-анализ', msg: 'AI-анализ запущен' },
];

export function QuickActionsBar() {
  return (
    <div className="matte-glass px-4 py-2 flex items-center gap-1 overflow-x-auto">
      {actions.map(a => (
        <button
          key={a.label}
          onClick={() => toast({ title: a.msg, description: 'Это демо-действие' })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all whitespace-nowrap"
        >
          <a.icon className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">{a.label}</span>
        </button>
      ))}
    </div>
  );
}

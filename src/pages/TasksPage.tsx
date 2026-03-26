import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, ArrowLeft } from 'lucide-react';
import { TasksHub } from '@/components/tasks/TasksHub';
import { NotificationCenter } from '@/components/workspace/NotificationCenter';
import { Input } from '@/components/ui/input';

export default function TasksPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    next ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col relative">
      <div className="fixed inset-0 z-0" style={{ background: 'var(--bg-gradient)' }} />
      <div className="relative z-[1] h-screen flex flex-col p-3 gap-3 overflow-hidden">
        <div className="flex-1 flex flex-col main-content-panel overflow-hidden">
          {/* Header */}
          <header className="border-b border-border flex-shrink-0">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-xl font-semibold text-foreground tracking-tight">Задачи</h1>
                <div className="w-px h-5 bg-border" />
                <span className="text-muted-foreground text-[13px] hidden md:inline">Управление задачами по всем проектам</span>
              </div>
              <div className="flex items-center gap-3">
                <NotificationCenter />
                <button onClick={toggleTheme} className="p-2 rounded-[10px] text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Поиск задач..." className="pl-9 w-64 bg-muted/30 border-border h-9 rounded-[10px] focus:border-primary/50 transition-all" />
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-hidden pt-2">
            <TasksHub />
          </main>
        </div>
      </div>
    </div>
  );
}

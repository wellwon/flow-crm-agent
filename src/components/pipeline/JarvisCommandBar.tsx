import { useState } from 'react';
import { Send, Mic } from 'lucide-react';

export function JarvisCommandBar() {
  const [value, setValue] = useState('');

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl px-4">
        <div className="glass-panel-dark flex items-center gap-2 px-4 py-2.5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Спроси JARVIS, напр. «Создай ТЗ»..."
            className="flex-1 bg-transparent text-xs text-slate-200 placeholder:text-slate-500 outline-none font-mono"
          />
          <button
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Voice input"
          >
            <Mic className="w-4 h-4 text-slate-400" />
        </button>
        <button
          className="p-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors"
          aria-label="Send"
        >
          <Send className="w-4 h-4 text-primary" />
        </button>
      </div>
    </div>
  );
}

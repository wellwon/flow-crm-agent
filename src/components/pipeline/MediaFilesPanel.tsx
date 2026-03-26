import { useState } from 'react';
import { Image, FileText, Headphones, X, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type MediaTab = 'media' | 'files' | 'audio';

const tabs: { key: MediaTab; label: string; icon: typeof Image }[] = [
  { key: 'media', label: 'Медиа', icon: Image },
  { key: 'files', label: 'Файлы', icon: FileText },
  { key: 'audio', label: 'Аудио', icon: Headphones },
];

const mockFiles = [
  { id: '1', name: 'КП_Mindray_DC70.pdf', type: 'files' as MediaTab, size: '2.4 MB', date: '18 мар' },
  { id: '2', name: 'ТЗ_УЗИ_черновик.docx', type: 'files' as MediaTab, size: '1.1 MB', date: '20 мар' },
  { id: '3', name: 'Протокол_встречи.pdf', type: 'files' as MediaTab, size: '340 KB', date: '15 мар' },
  { id: '4', name: 'Запись_звонка_Петрова.mp3', type: 'audio' as MediaTab, size: '8.2 MB', date: '22 мар' },
  { id: '5', name: 'Брифинг_утро.mp3', type: 'audio' as MediaTab, size: '3.1 MB', date: '25 мар' },
];

export function MediaFilesPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<MediaTab>('media');

  const filtered = mockFiles.filter(f => f.type === activeTab);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-[320px] shrink-0 matte-glass border-l border-border flex flex-col h-full"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-[8px] flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-semibold text-foreground flex-1">Медиа и файлы</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-[8px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-4 pt-2 flex gap-0 border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 pb-2.5 text-[12px] font-medium transition-all relative ${
                activeTab === tab.key
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="media-tab-indicator"
                  className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
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
          ) : (
            <div className="space-y-2">
              {filtered.map(file => (
                <button
                  key={file.id}
                  className="w-full text-left p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
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
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

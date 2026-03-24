import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, type NodeProps, NodeResizer } from '@xyflow/react';
import { GripVertical } from 'lucide-react';

export interface StickyNoteData {
  [key: string]: unknown;
  text: string;
  color: string;
}

const colorStyles: Record<string, { bg: string; border: string; text: string; resizer: string }> = {
  yellow: { bg: 'bg-[hsl(48_96%_89%)]', border: 'border-[hsl(45_90%_65%)]', text: 'text-[hsl(30_50%_20%)]', resizer: 'hsl(45,90%,65%)' },
  pink:   { bg: 'bg-[hsl(340_80%_92%)]', border: 'border-[hsl(340_60%_70%)]', text: 'text-[hsl(340_40%_25%)]', resizer: 'hsl(340,60%,70%)' },
  blue:   { bg: 'bg-[hsl(210_80%_92%)]', border: 'border-[hsl(210_60%_65%)]', text: 'text-[hsl(210_50%_20%)]', resizer: 'hsl(210,60%,65%)' },
  green:  { bg: 'bg-[hsl(140_60%_90%)]', border: 'border-[hsl(140_50%_55%)]', text: 'text-[hsl(140_40%_20%)]', resizer: 'hsl(140,50%,55%)' },
  purple: { bg: 'bg-[hsl(265_60%_92%)]', border: 'border-[hsl(265_50%_65%)]', text: 'text-[hsl(265_40%_25%)]', resizer: 'hsl(265,50%,65%)' },
};

function StickyNoteComponent({ data, id, selected }: NodeProps) {
  const noteData = data as unknown as StickyNoteData;
  const style = colorStyles[noteData.color] || colorStyles.yellow;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(noteData.text || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [editing]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setEditing(false);
    // Persist text back into node data
    (data as any).text = text;
  }, [data, text]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditing(false);
      (data as any).text = text;
    }
    // Stop propagation so React Flow doesn't handle it
    e.stopPropagation();
  }, [data, text]);

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={140}
        minHeight={80}
        lineStyle={{ borderColor: style.resizer, borderWidth: 1.5 }}
        handleStyle={{ background: style.resizer, width: 8, height: 8, borderRadius: 2 }}
      />
      <div
        className={`w-full h-full min-w-[140px] min-h-[80px] rounded-lg border-2 shadow-lg ${style.bg} ${style.border} p-3 cursor-grab active:cursor-grabbing`}
        style={{ boxShadow: '4px 4px 10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)' }}
        onDoubleClick={handleDoubleClick}
      >
        <Handle type="target" position={Position.Left} className="!opacity-0" />
        <Handle type="source" position={Position.Right} className="!opacity-0" />

        <div className="flex items-center justify-between mb-1.5">
          <GripVertical className={`w-3 h-3 opacity-30 ${style.text}`} />
          <span className="text-[8px] font-mono opacity-40">{id}</span>
        </div>

        {editing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`w-full h-full min-h-[60px] bg-transparent border-none outline-none resize-none text-[11px] leading-relaxed ${style.text} placeholder:opacity-40`}
            placeholder="Введите текст..."
          />
        ) : (
          <p className={`text-[11px] leading-relaxed whitespace-pre-wrap ${style.text} ${!text ? 'opacity-40 italic' : ''}`}>
            {text || 'Двойной клик для редактирования...'}
          </p>
        )}
      </div>
    </>
  );
}

export const StickyNote = memo(StickyNoteComponent);

import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, type NodeProps, NodeResizer, NodeResizeControl, useReactFlow } from '@xyflow/react';
import { GripVertical } from 'lucide-react';

export interface StickyNoteData {
  [key: string]: unknown;
  text: string;
  color: string;
}

const colorStyles: Record<string, { bg: string; border: string; text: string; resizer: string }> = {
  yellow: { bg: 'bg-[hsl(48_96%_89%)]', border: 'border-[hsl(45_90%_65%)]', text: 'text-[hsl(30_50%_20%)]', resizer: 'hsl(45,90%,65%)' },
  pink: { bg: 'bg-[hsl(340_80%_92%)]', border: 'border-[hsl(340_60%_70%)]', text: 'text-[hsl(340_40%_25%)]', resizer: 'hsl(340,60%,70%)' },
  blue: { bg: 'bg-[hsl(210_80%_92%)]', border: 'border-[hsl(210_60%_65%)]', text: 'text-[hsl(210_50%_20%)]', resizer: 'hsl(210,60%,65%)' },
  green: { bg: 'bg-[hsl(140_60%_90%)]', border: 'border-[hsl(140_50%_55%)]', text: 'text-[hsl(140_40%_20%)]', resizer: 'hsl(140,50%,55%)' },
  purple: { bg: 'bg-[hsl(265_60%_92%)]', border: 'border-[hsl(265_50%_65%)]', text: 'text-[hsl(265_40%_25%)]', resizer: 'hsl(265,50%,65%)' },
};

function StickyNoteComponent({ data, id, selected }: NodeProps) {
  const noteData = data as unknown as StickyNoteData;
  const style = colorStyles[noteData.color] || colorStyles.yellow;
  const { updateNodeData } = useReactFlow();

  const [editing, setEditing] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [text, setText] = useState(noteData.text || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(noteData.text || '');
  }, [noteData.text]);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [editing]);

  const commitText = useCallback((value: string) => {
    updateNodeData(id, { text: value });
  }, [id, updateNodeData]);

  const startEditing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(true);
  }, []);

  const stopEditing = useCallback(() => {
    setEditing(false);
    commitText(text);
  }, [commitText, text]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    if (e.key === 'Escape') stopEditing();
  }, [stopEditing]);

  const showResize = selected || hovered || editing;

  return (
    <>
      <NodeResizer
        isVisible={showResize}
        minWidth={140}
        minHeight={90}
        color={style.resizer}
        lineStyle={{ borderColor: style.resizer, borderWidth: 1.5 }}
        handleStyle={{ background: style.resizer, width: 10, height: 10, borderRadius: 2 }}
      />

      <NodeResizeControl
        position="bottom-right"
        minWidth={140}
        minHeight={90}
        className={`!w-3 !h-3 !rounded-sm !border transition-opacity ${showResize ? '!opacity-100' : '!opacity-0'}`}
        style={{ borderColor: style.resizer, background: style.resizer }}
      />

      <div
        className={`w-full h-full min-w-[140px] min-h-[90px] rounded-lg border-2 shadow-lg ${style.bg} ${style.border} p-3`}
        style={{ boxShadow: '4px 4px 10px hsl(var(--foreground) / 0.12), inset 0 1px 0 hsl(var(--background) / 0.15)' }}
        onDoubleClick={startEditing}
        onDoubleClickCapture={startEditing}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Handle type="target" position={Position.Left} className="!opacity-0" />
        <Handle type="source" position={Position.Right} className="!opacity-0" />

        <div className="sticky-drag-handle flex items-center justify-between mb-1.5 cursor-grab active:cursor-grabbing select-none">
          <GripVertical className={`w-3 h-3 opacity-30 ${style.text}`} />
          <span className="text-[8px] font-mono opacity-40">{id}</span>
        </div>

        {editing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={stopEditing}
            onKeyDown={handleKeyDown}
            onPointerDown={(e) => e.stopPropagation()}
            className={`nodrag nopan nowheel w-full h-[calc(100%-18px)] min-h-[60px] bg-transparent border-none outline-none resize-none text-[11px] leading-relaxed ${style.text}`}
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

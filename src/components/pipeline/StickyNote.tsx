import { memo, useState, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { GripVertical, X } from 'lucide-react';

export interface StickyNoteData {
  [key: string]: unknown;
  text: string;
  color: string; // 'yellow' | 'pink' | 'blue' | 'green' | 'purple'
}

const colorStyles: Record<string, { bg: string; border: string; text: string }> = {
  yellow: { bg: 'bg-[hsl(48_96%_89%)]', border: 'border-[hsl(45_90%_65%)]', text: 'text-[hsl(30_50%_20%)]' },
  pink:   { bg: 'bg-[hsl(340_80%_92%)]', border: 'border-[hsl(340_60%_70%)]', text: 'text-[hsl(340_40%_25%)]' },
  blue:   { bg: 'bg-[hsl(210_80%_92%)]', border: 'border-[hsl(210_60%_65%)]', text: 'text-[hsl(210_50%_20%)]' },
  green:  { bg: 'bg-[hsl(140_60%_90%)]', border: 'border-[hsl(140_50%_55%)]', text: 'text-[hsl(140_40%_20%)]' },
  purple: { bg: 'bg-[hsl(265_60%_92%)]', border: 'border-[hsl(265_50%_65%)]', text: 'text-[hsl(265_40%_25%)]' },
};

function StickyNoteComponent({ data, id }: NodeProps) {
  const noteData = data as unknown as StickyNoteData;
  const style = colorStyles[noteData.color] || colorStyles.yellow;

  return (
    <div className={`w-[180px] min-h-[120px] rounded-lg border-2 shadow-lg ${style.bg} ${style.border} p-3 cursor-grab active:cursor-grabbing`}
      style={{ boxShadow: '4px 4px 10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)' }}>
      <Handle type="target" position={Position.Left} className="!opacity-0" />
      <Handle type="source" position={Position.Right} className="!opacity-0" />
      
      <div className="flex items-center justify-between mb-1.5">
        <GripVertical className={`w-3 h-3 opacity-30 ${style.text}`} />
        <span className="text-[8px] font-mono opacity-40">{id}</span>
      </div>
      <p className={`text-[11px] leading-relaxed whitespace-pre-wrap ${style.text}`}>
        {noteData.text || 'Двойной клик для редактирования...'}
      </p>
    </div>
  );
}

export const StickyNote = memo(StickyNoteComponent);

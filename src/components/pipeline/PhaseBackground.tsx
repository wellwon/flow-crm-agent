import { memo } from 'react';
import { useStore } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import type { PipelineNodeData } from '@/types/pipeline';

interface PhaseBackgroundProps {
  nodes: Node<PipelineNodeData>[];
}

const phaseConfig: Record<string, { label: string; color: string; border: string }> = {
  'PRE-SALE':    { label: '① PRE-SALE',    color: 'hsl(174 55% 40% / 0.04)', border: 'hsl(174 55% 40% / 0.12)' },
  'BIDDING':     { label: '② BIDDING',     color: 'hsl(38 92% 50% / 0.04)',  border: 'hsl(38 92% 50% / 0.12)' },
  'RESULT':      { label: '③ RESULT',      color: 'hsl(265 80% 65% / 0.04)', border: 'hsl(265 80% 65% / 0.12)' },
  'CONTRACTING': { label: '③ CONTRACTING', color: 'hsl(210 60% 50% / 0.04)', border: 'hsl(210 60% 50% / 0.12)' },
  'EXECUTION':   { label: '④ EXECUTION',   color: 'hsl(160 84% 39% / 0.04)', border: 'hsl(160 84% 39% / 0.12)' },
  'POST-SALE':   { label: '⑤ POST-SALE',   color: 'hsl(350 89% 60% / 0.04)', border: 'hsl(350 89% 60% / 0.12)' },
  'CUSTOM':      { label: 'CUSTOM',        color: 'hsl(220 15% 50% / 0.03)', border: 'hsl(220 15% 50% / 0.1)' },
};

function PhaseBackgroundComponent({ nodes }: PhaseBackgroundProps) {
  const transform = useStore(s => s.transform);
  const [tx, ty, zoom] = transform;

  // Group nodes by phase
  const phases = new Map<string, { minX: number; minY: number; maxX: number; maxY: number }>();
  nodes.forEach(n => {
    const d = n.data as unknown as PipelineNodeData;
    if (!d.phase || n.type === 'stickyNote') return;
    const x = n.position?.x ?? 0;
    const y = n.position?.y ?? 0;
    const w = 220, h = 100;
    if (!phases.has(d.phase)) {
      phases.set(d.phase, { minX: x, minY: y, maxX: x + w, maxY: y + h });
    } else {
      const b = phases.get(d.phase)!;
      b.minX = Math.min(b.minX, x);
      b.minY = Math.min(b.minY, y);
      b.maxX = Math.max(b.maxX, x + w);
      b.maxY = Math.max(b.maxY, y + h);
    }
  });

  const pad = 50;

  return (
    <svg className="react-flow__phase-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      <g transform={`translate(${tx},${ty}) scale(${zoom})`}>
        {Array.from(phases.entries()).map(([phase, bounds]) => {
          const cfg = phaseConfig[phase];
          if (!cfg) return null;
          const x = bounds.minX - pad;
          const y = bounds.minY - pad;
          const w = bounds.maxX - bounds.minX + pad * 2;
          const h = bounds.maxY - bounds.minY + pad * 2;
          return (
            <g key={phase}>
              <rect x={x} y={y} width={w} height={h} rx={16} ry={16}
                fill={cfg.color} stroke={cfg.border} strokeWidth={1} strokeDasharray="8 4" />
              <text x={x + 14} y={y + 18} fill={cfg.border} fontSize={11}
                fontFamily="ui-monospace, monospace" fontWeight={600} letterSpacing="0.08em">
                {cfg.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export const PhaseBackground = memo(PhaseBackgroundComponent);

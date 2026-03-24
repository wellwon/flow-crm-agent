import { memo } from 'react';
import { getBezierPath, type EdgeProps } from '@xyflow/react';

function GlowingEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const status = (data?.status as string) || 'pending';

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const colorMap: Record<string, string> = {
    completed: 'hsl(160, 84%, 39%)',
    active: 'hsl(38, 92%, 50%)',
    pending: 'hsl(240, 4%, 36%)',
    error: 'hsl(350, 89%, 60%)',
  };

  const glowClass =
    status === 'active'
      ? 'edge-glow-active'
      : status === 'completed'
      ? 'edge-glow-completed'
      : '';

  const strokeColor = colorMap[status] || colorMap.pending;
  const strokeWidth = status === 'pending' ? 1.5 : 2.5;

  return (
    <g className={glowClass}>
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        className={status === 'active' ? 'edge-animated-dash' : ''}
        strokeLinecap="round"
      />
    </g>
  );
}

export const GlowingEdge = memo(GlowingEdgeComponent);

import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { HoloNode } from './HoloNode';
import { GlowingEdge } from './GlowingEdge';
import { TopToolbar } from './TopToolbar';
import { NodeDrawer } from './NodeDrawer';
import { JarvisCommandBar } from './JarvisCommandBar';
import { MorningBriefing } from './MorningBriefing';
import { ListView } from './ListView';
import { KanbanView } from './KanbanView';
import { TimelineView } from './TimelineView';
import { initialNodes, initialEdges } from '@/data/mockPipeline';
import type { PipelineNodeData, ViewMode } from '@/types/pipeline';

const nodeTypes = { holoNode: HoloNode };
const edgeTypes = { glowingEdge: GlowingEdge };

export function PipelinePage() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<{ id: string; data: PipelineNodeData } | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>('graph');
  const [briefingOpen, setBriefingOpen] = useState(false);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode({ id: node.id, data: node.data as unknown as PipelineNodeData });
  }, []);

  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  const handleNodeSelect = useCallback((id: string, data: PipelineNodeData) => {
    setSelectedNode({ id, data });
  }, []);

  return (
    <div className="w-screen h-screen bg-background relative overflow-hidden">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, hsl(200 60% 8%) 0%, hsl(222 15% 6%) 70%)',
        }}
      />

      <TopToolbar
        activeView={activeView}
        onViewChange={setActiveView}
        onBriefingOpen={() => setBriefingOpen(true)}
      />

      {activeView === 'graph' && (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.15}
          maxZoom={2}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="hsl(220 15% 20%)" />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(n) => {
              const d = n.data as unknown as PipelineNodeData;
              if (d.status === 'completed') return 'hsl(160 84% 39%)';
              if (d.status === 'active') return 'hsl(38 92% 50%)';
              if (d.status === 'error') return 'hsl(350 89% 60%)';
              if (d.status === 'waiting') return 'hsl(174 55% 40%)';
              return 'hsl(240 4% 46%)';
            }}
            style={{ background: 'hsl(222 20% 6% / 0.8)' }}
            maskColor="hsl(222 15% 6% / 0.7)"
          />
        </ReactFlow>
      )}

      {activeView === 'list' && <ListView nodes={nodes} onNodeSelect={handleNodeSelect} />}
      {activeView === 'kanban' && <KanbanView nodes={nodes} onNodeSelect={handleNodeSelect} />}
      {activeView === 'timeline' && <TimelineView nodes={nodes} onNodeSelect={handleNodeSelect} />}

      <NodeDrawer
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        data={selectedNode?.data ?? null}
        nodeId={selectedNode?.id ?? null}
      />

      <JarvisCommandBar />
      <MorningBriefing isOpen={briefingOpen} onClose={() => setBriefingOpen(false)} />
    </div>
  );
}

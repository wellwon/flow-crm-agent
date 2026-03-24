import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
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
import { initialNodes, initialEdges } from '@/data/mockPipeline';
import type { PipelineNodeData } from '@/types/pipeline';

const nodeTypes = { holoNode: HoloNode };
const edgeTypes = { glowingEdge: GlowingEdge };

export function PipelinePage() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    data: PipelineNodeData;
  } | null>(null);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode({ id: node.id, data: node.data as unknown as PipelineNodeData });
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="w-screen h-screen bg-background relative overflow-hidden">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, hsl(200 60% 8%) 0%, hsl(222 15% 6%) 70%)',
        }}
      />

      <TopToolbar />

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
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="hsl(220 15% 20%)" />
        <Controls showInteractive={false} />
      </ReactFlow>

      <NodeDrawer
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        data={selectedNode?.data ?? null}
        nodeId={selectedNode?.id ?? null}
      />

      <JarvisCommandBar />
    </div>
  );
}

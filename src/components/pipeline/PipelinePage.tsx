import { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type NodeMouseHandler,
  type EdgeMouseHandler,
  useReactFlow,
  ReactFlowProvider,
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
import { CanvasContextMenu, type ContextMenuPosition } from './CanvasContextMenu';
import { EdgeContextMenu } from './EdgeContextMenu';
import { initialNodes, initialEdges } from '@/data/mockPipeline';
import type { PipelineNodeData, ViewMode, NodeType, NodeStatus } from '@/types/pipeline';

const nodeTypes = { holoNode: HoloNode };
const edgeTypes = { glowingEdge: GlowingEdge };

const defaultLabels: Partial<Record<NodeType, string>> = {
  meeting: 'Новая встреча', call: 'Новый звонок', email: 'Новое письмо',
  document: 'Новый документ', research: 'Исследование', calculation: 'Расчёт',
  logistics: 'Логистика', approval: 'Согласование', 'decision-fork': 'Развилка',
  milestone: 'Milestone', 'ai-generate': 'AI Генерация', 'ai-monitor': 'AI Мониторинг',
  'ai-enrich': 'AI Обогащение', 'ai-analyze': 'AI Анализ', wait: 'Ожидание',
  'parallel-split': 'Параллельный старт', 'parallel-join': 'Синхронизация',
  bookmark: 'Заметка', start: 'Старт', finish: 'Финиш',
};

function PipelinePageInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<{ id: string; data: PipelineNodeData } | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>('graph');
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [edgeMenu, setEdgeMenu] = useState<{ x: number; y: number; edgeId: string } | null>(null);
  const nextIdRef = useRef(100);
  const { screenToFlowPosition } = useReactFlow();

  const generateId = useCallback(() => {
    nextIdRef.current += 1;
    return `n-new-${nextIdRef.current}`;
  }, []);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode({ id: node.id, data: node.data as unknown as PipelineNodeData });
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setContextMenu(null);
    setEdgeMenu(null);
  }, []);

  // Right-click on canvas
  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const flowPos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    setContextMenu({ x: event.clientX, y: event.clientY, flowX: flowPos.x, flowY: flowPos.y });
    setEdgeMenu(null);
  }, [screenToFlowPosition]);

  // Right-click on edge (or click)
  const onEdgeContextMenu: EdgeMouseHandler = useCallback((event, edge) => {
    event.preventDefault();
    setEdgeMenu({ x: event.clientX, y: event.clientY, edgeId: edge.id });
    setContextMenu(null);
  }, []);

  const onEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
    // Double-click to insert
    if (event.detail === 2) {
      setEdgeMenu({ x: event.clientX, y: event.clientY, edgeId: edge.id });
    }
  }, []);

  // Add a new node
  const addNode = useCallback((type: NodeType, position: { x: number; y: number }) => {
    const id = generateId();
    const newNode = {
      id,
      type: 'holoNode',
      position,
      data: {
        label: defaultLabels[type] || type,
        summary: 'Новый шаг сделки',
        status: 'pending' as NodeStatus,
        type,
        progress: 0,
        phase: 'CUSTOM',
      } satisfies PipelineNodeData,
    };
    setNodes(nds => [...nds, newNode]);
  }, [generateId, setNodes]);

  // Insert node into an edge (splits edge into 2)
  const insertNodeOnEdge = useCallback((edgeId: string, type: NodeType) => {
    const edge = edges.find(e => e.id === edgeId);
    if (!edge) return;

    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    if (!sourceNode || !targetNode) return;

    const midX = ((sourceNode.position?.x ?? 0) + (targetNode.position?.x ?? 0)) / 2;
    const midY = ((sourceNode.position?.y ?? 0) + (targetNode.position?.y ?? 0)) / 2;

    const newId = generateId();
    const newNode = {
      id: newId,
      type: 'holoNode',
      position: { x: midX, y: midY },
      data: {
        label: defaultLabels[type] || type,
        summary: 'Вставлен между шагами',
        status: 'pending' as NodeStatus,
        type,
        progress: 0,
        phase: (sourceNode.data as unknown as PipelineNodeData).phase || 'CUSTOM',
      } satisfies PipelineNodeData,
    };

    setNodes(nds => [...nds, newNode]);
    setEdges(eds => {
      const filtered = eds.filter(e => e.id !== edgeId);
      return [
        ...filtered,
        { id: `e-${edge.source}-${newId}`, source: edge.source, target: newId, type: 'glowingEdge', data: { status: 'pending' } },
        { id: `e-${newId}-${edge.target}`, source: newId, target: edge.target, type: 'glowingEdge', data: { status: 'pending' } },
      ];
    });
  }, [edges, nodes, generateId, setNodes, setEdges]);

  // Handle node select from other views
  const handleNodeSelect = useCallback((id: string, data: PipelineNodeData) => {
    setSelectedNode({ id, data });
  }, []);

  // Complete / update node from drawer
  const handleCompleteNode = useCallback((nodeId: string) => {
    setNodes(nds => nds.map(n => {
      if (n.id !== nodeId) return n;
      const d = n.data as unknown as PipelineNodeData;
      return { ...n, data: { ...d, status: 'completed' as NodeStatus, progress: 100 } };
    }));
    // Update edges from this node
    setEdges(eds => eds.map(e => {
      if (e.source === nodeId) return { ...e, data: { ...e.data, status: 'completed' } };
      return e;
    }));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  // Delete node
  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes(nds => nds.filter(n => n.id !== nodeId));
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  // Kanban status change
  const handleStatusChange = useCallback((nodeId: string, newStatus: NodeStatus) => {
    setNodes(nds => nds.map(n => {
      if (n.id !== nodeId) return n;
      const d = n.data as unknown as PipelineNodeData;
      const progress = newStatus === 'completed' ? 100 : newStatus === 'active' ? Math.max(d.progress, 10) : d.progress;
      return { ...n, data: { ...d, status: newStatus, progress } };
    }));
  }, [setNodes]);

  return (
    <div className="w-screen h-screen bg-background relative overflow-hidden">
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
          onPaneContextMenu={onPaneContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onEdgeClick={onEdgeClick}
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
      {activeView === 'kanban' && <KanbanView nodes={nodes} onNodeSelect={handleNodeSelect} onStatusChange={handleStatusChange} />}
      {activeView === 'timeline' && <TimelineView nodes={nodes} onNodeSelect={handleNodeSelect} />}

      <NodeDrawer
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        data={selectedNode?.data ?? null}
        nodeId={selectedNode?.id ?? null}
        onComplete={handleCompleteNode}
        onDelete={handleDeleteNode}
      />

      <CanvasContextMenu
        position={contextMenu}
        onClose={() => setContextMenu(null)}
        onAddNode={addNode}
      />

      <EdgeContextMenu
        position={edgeMenu ? { x: edgeMenu.x, y: edgeMenu.y } : null}
        edgeId={edgeMenu?.edgeId ?? null}
        onClose={() => setEdgeMenu(null)}
        onInsertNode={insertNodeOnEdge}
      />

      <JarvisCommandBar />
      <MorningBriefing isOpen={briefingOpen} onClose={() => setBriefingOpen(false)} />
    </div>
  );
}

export function PipelinePage() {
  return (
    <ReactFlowProvider>
      <PipelinePageInner />
    </ReactFlowProvider>
  );
}

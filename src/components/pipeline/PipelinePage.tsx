import { useCallback, useState, useRef, DragEvent } from 'react';
import {
  ReactFlow, Background, MiniMap,
  useNodesState, useEdgesState, BackgroundVariant, SelectionMode,
  type NodeMouseHandler, type EdgeMouseHandler,
  useReactFlow, ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { HoloNode } from './HoloNode';
import { StickyNote } from './StickyNote';
import { GlowingEdge } from './GlowingEdge';
import { TopToolbar } from './TopToolbar';
import { NodeDrawer } from './NodeDrawer';
import { JarvisCommandBar } from './JarvisCommandBar';
import { MorningBriefing } from './MorningBriefing';
import { ListView } from './ListView';
import { KanbanView } from './KanbanView';
import { DashboardView } from './DashboardView';
import { TimelineView } from './TimelineView';
import { CanvasContextMenu, type ContextMenuPosition } from './CanvasContextMenu';
import { EdgeContextMenu } from './EdgeContextMenu';
import { NodePalette, type InteractionMode } from './NodePalette';
import { TemplateGallery } from './TemplateGallery';
import { PhaseBackground } from './PhaseBackground';
import { initialNodes, initialEdges } from '@/data/mockPipeline';
import type { PipelineNodeData, ViewMode, NodeType, NodeStatus } from '@/types/pipeline';
import type { Node, Edge } from '@xyflow/react';

const nodeTypes = { holoNode: HoloNode, stickyNote: StickyNote };
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

const stickyColors = ['yellow', 'pink', 'blue', 'green', 'purple'];

function PipelinePageInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<{ id: string; data: PipelineNodeData } | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>('graph');
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [phasesVisible, setPhasesVisible] = useState(true);
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [edgeMenu, setEdgeMenu] = useState<{ x: number; y: number; edgeId: string } | null>(null);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('select');
  const nextIdRef = useRef(200);
  const { screenToFlowPosition, setViewport, fitView, zoomIn, zoomOut, getNodes } = useReactFlow();

  const generateId = useCallback(() => {
    nextIdRef.current += 1;
    return `n-new-${nextIdRef.current}`;
  }, []);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    if (node.type === 'stickyNote') return;
    setSelectedNode({ id: node.id, data: node.data as unknown as PipelineNodeData });
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setContextMenu(null);
    setEdgeMenu(null);
  }, []);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const flowPos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    setContextMenu({ x: event.clientX, y: event.clientY, flowX: flowPos.x, flowY: flowPos.y });
    setEdgeMenu(null);
  }, [screenToFlowPosition]);

  const onEdgeContextMenu: EdgeMouseHandler = useCallback((event, edge) => {
    event.preventDefault();
    setEdgeMenu({ x: event.clientX, y: event.clientY, edgeId: edge.id });
    setContextMenu(null);
  }, []);

  const onEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
    if (event.detail === 2) {
      setEdgeMenu({ x: event.clientX, y: event.clientY, edgeId: edge.id });
    }
  }, []);

  // Add node
  const addNode = useCallback((type: NodeType, position: { x: number; y: number }) => {
    const id = generateId();
    const newNode = {
      id, type: 'holoNode', position,
      data: {
        label: defaultLabels[type] || type, summary: 'Новый шаг сделки',
        status: 'pending' as NodeStatus, type, progress: 0, phase: 'CUSTOM',
      } satisfies PipelineNodeData,
    };
    setNodes(nds => [...nds, newNode]);
  }, [generateId, setNodes]);

  // Add sticky note
  const addSticky = useCallback((color: string, position: { x: number; y: number }) => {
    const id = `sticky-${nextIdRef.current++}`;
    setNodes(nds => [...nds, {
      id,
      type: 'stickyNote',
      position,
      dragHandle: '.sticky-drag-handle',
      style: { width: 220, height: 140 },
      data: { text: '', color } as any,
    }]);
  }, [setNodes]);

  // Insert node on edge
  const insertNodeOnEdge = useCallback((edgeId: string, type: NodeType) => {
    const edge = edges.find(e => e.id === edgeId);
    if (!edge) return;
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    if (!sourceNode || !targetNode) return;

    const midX = ((sourceNode.position?.x ?? 0) + (targetNode.position?.x ?? 0)) / 2;
    const midY = ((sourceNode.position?.y ?? 0) + (targetNode.position?.y ?? 0)) / 2;

    const newId = generateId();
    setNodes(nds => [...nds, {
      id: newId, type: 'holoNode', position: { x: midX, y: midY },
      data: {
        label: defaultLabels[type] || type, summary: 'Вставлен между шагами',
        status: 'pending' as NodeStatus, type, progress: 0,
        phase: (sourceNode.data as unknown as PipelineNodeData).phase || 'CUSTOM',
      } satisfies PipelineNodeData,
    }]);
    setEdges(eds => {
      const filtered = eds.filter(e => e.id !== edgeId);
      return [
        ...filtered,
        { id: `e-${edge.source}-${newId}`, source: edge.source, target: newId, type: 'glowingEdge', data: { status: 'pending' } },
        { id: `e-${newId}-${edge.target}`, source: newId, target: edge.target, type: 'glowingEdge', data: { status: 'pending' } },
      ];
    });
  }, [edges, nodes, generateId, setNodes, setEdges]);

  // Drag-drop from palette
  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow-type');
    if (!type) return;
    const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    if (type === 'sticky') {
      addSticky(stickyColors[Math.floor(Math.random() * stickyColors.length)], pos);
    } else {
      addNode(type as NodeType, pos);
    }
  }, [screenToFlowPosition, addNode, addSticky]);

  const handleNodeSelect = useCallback((id: string, data: PipelineNodeData) => {
    setSelectedNode({ id, data });
  }, []);

  const handleCompleteNode = useCallback((nodeId: string) => {
    setNodes(nds => nds.map(n => {
      if (n.id !== nodeId) return n;
      const d = n.data as unknown as PipelineNodeData;
      return { ...n, data: { ...d, status: 'completed' as NodeStatus, progress: 100 } };
    }));
    setEdges(eds => eds.map(e => {
      if (e.source === nodeId) return { ...e, data: { ...e.data, status: 'completed' } };
      return e;
    }));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes(nds => nds.filter(n => n.id !== nodeId));
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const handleStatusChange = useCallback((nodeId: string, newStatus: NodeStatus) => {
    setNodes(nds => nds.map(n => {
      if (n.id !== nodeId) return n;
      const d = n.data as unknown as PipelineNodeData;
      const progress = newStatus === 'completed' ? 100 : newStatus === 'active' ? Math.max(d.progress, 10) : d.progress;
      return { ...n, data: { ...d, status: newStatus, progress } };
    }));
  }, [setNodes]);

  // Apply template
  const handleApplyTemplate = useCallback((tplNodes: Node<PipelineNodeData>[], tplEdges: Edge[]) => {
    setNodes(tplNodes as any);
    setEdges(tplEdges);
    setTimeout(() => fitView({ padding: 0.2 }), 100);
  }, [setNodes, setEdges, fitView]);

  // Minimap click → navigate
  const handleMiniMapClick = useCallback((_: any, position: { x: number; y: number }) => {
    // Not directly supported — we use fitView on node click instead
  }, []);

  return (
    <div className="w-screen h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, hsl(200 60% 8%) 0%, hsl(222 15% 6%) 70%)' }}
      />

      <TopToolbar
        activeView={activeView}
        onViewChange={setActiveView}
        onBriefingOpen={() => setBriefingOpen(true)}
        onTemplateOpen={() => setTemplateOpen(true)}
        phasesVisible={phasesVisible}
        onTogglePhases={() => setPhasesVisible(v => !v)}
      />

      {activeView === 'graph' && (
        <>
          <NodePalette
            onAddNode={addNode}
            onAddSticky={addSticky}
            interactionMode={interactionMode}
            onInteractionModeChange={setInteractionMode}
          />
          <ReactFlow
            className="border border-border/20 rounded-xl"
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onPaneContextMenu={onPaneContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
            onEdgeClick={onEdgeClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            panOnDrag={interactionMode === 'hand' ? [0] : [1, 2]}
            selectionOnDrag={interactionMode === 'select'}
            selectionMode={SelectionMode.Partial}
            selectNodesOnDrag={interactionMode === 'select'}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
            minZoom={0.15}
            maxZoom={2}
            deleteKeyCode={['Backspace', 'Delete']}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="hsl(220 15% 20%)" />
            <MiniMap
              pannable
              zoomable
              nodeColor={(n) => {
                if (n.type === 'stickyNote') return 'hsl(48 96% 70%)';
                const d = n.data as unknown as PipelineNodeData;
                if (d.status === 'completed') return 'hsl(160 84% 39%)';
                if (d.status === 'active') return 'hsl(38 92% 50%)';
                if (d.status === 'error') return 'hsl(350 89% 60%)';
                if (d.status === 'waiting') return 'hsl(174 55% 40%)';
                return 'hsl(240 4% 46%)';
              }}
              className="!border !border-border/30 !rounded-t-2xl !rounded-b-none"
              style={{
                width: 200,
                height: 120,
                margin: 0,
                bottom: 44,
                right: 16,
                background: 'hsl(222 20% 6% / 0.85)',
                backdropFilter: 'blur(24px)',
              }}
              maskColor="hsl(222 15% 6% / 0.6)"
            />
            {/* Phase swim lanes */}
            {phasesVisible && <PhaseBackground nodes={nodes} />}
          </ReactFlow>

          {/* Zoom controls — visually attached below minimap */}
          <div
            className="absolute z-20 flex items-center justify-between border border-t-0 border-border/30 rounded-b-2xl px-2 py-1.5"
            style={{
              bottom: 16,
              right: 16,
              width: 200,
              background: 'hsl(222 20% 6% / 0.85)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <button
              onClick={() => zoomOut()}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors text-lg font-bold"
              title="Отдалить"
            >
              −
            </button>
            <button
              onClick={() => fitView({ padding: 0.2 })}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              title="Вместить всё"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="12" height="12" rx="2" /><path d="M4 7h6M7 4v6" /></svg>
            </button>
            <button
              onClick={() => zoomIn()}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors text-lg font-bold"
              title="Приблизить"
            >
              +
            </button>
          </div>
        </>
      )}

      {activeView === 'list' && <ListView nodes={nodes} onNodeSelect={handleNodeSelect} />}
      {activeView === 'kanban' && <KanbanView nodes={nodes} onNodeSelect={handleNodeSelect} onStatusChange={handleStatusChange} />}
      {activeView === 'timeline' && <TimelineView nodes={nodes} onNodeSelect={handleNodeSelect} />}
      {activeView === 'dashboard' && <DashboardView nodes={nodes} />}

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
      <TemplateGallery isOpen={templateOpen} onClose={() => setTemplateOpen(false)} onApplyTemplate={handleApplyTemplate} />
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

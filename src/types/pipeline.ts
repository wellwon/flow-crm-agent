export type NodeStatus = 'pending' | 'active' | 'completed' | 'error';

export type NodeType =
  | 'start'
  | 'meeting'
  | 'ai-enrich'
  | 'parallel-split'
  | 'ai-generate'
  | 'approval'
  | 'ai-monitor'
  | 'research'
  | 'parallel-join';

export interface PipelineNodeData {
  label: string;
  summary: string;
  status: NodeStatus;
  type: NodeType;
  progress: number; // 0-100
  assignee?: string;
  assigneeAvatar?: string;
}

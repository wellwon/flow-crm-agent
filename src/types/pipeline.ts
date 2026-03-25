export type NodeStatus = 'pending' | 'active' | 'completed' | 'error' | 'waiting' | 'skipped';

export type NodeCategory = 'human_action' | 'gate' | 'ai_action' | 'system';

export type NodeType =
  // Human Action (7)
  | 'meeting'
  | 'call'
  | 'email'
  | 'document'
  | 'research'
  | 'calculation'
  | 'logistics'
  // Gate (3)
  | 'approval'
  | 'decision-fork'
  | 'milestone'
  // AI Action (4)
  | 'ai-generate'
  | 'ai-monitor'
  | 'ai-enrich'
  | 'ai-analyze'
  // System (6)
  | 'wait'
  | 'parallel-split'
  | 'parallel-join'
  | 'bookmark'
  | 'start'
  | 'finish';

export const NODE_CATEGORIES: Record<NodeType, NodeCategory> = {
  meeting: 'human_action',
  call: 'human_action',
  email: 'human_action',
  document: 'human_action',
  research: 'human_action',
  calculation: 'human_action',
  logistics: 'human_action',
  approval: 'gate',
  'decision-fork': 'gate',
  milestone: 'gate',
  'ai-generate': 'ai_action',
  'ai-monitor': 'ai_action',
  'ai-enrich': 'ai_action',
  'ai-analyze': 'ai_action',
  wait: 'system',
  'parallel-split': 'system',
  'parallel-join': 'system',
  bookmark: 'system',
  start: 'system',
  finish: 'system',
};

export interface PipelineNodeData {
  [key: string]: unknown;
  label: string;
  summary: string;
  status: NodeStatus;
  type: NodeType;
  progress: number;
  assignee?: string;
  assigneeAvatar?: string;
  phase?: string;
  dueDate?: string;
  complianceChecks?: ComplianceCheck[];
  aiOutput?: string[];
  activityLog?: ActivityLogEntry[];
}

export interface ComplianceCheck {
  name: string;
  passed: boolean | null; // null = not checked yet
  source: string;
  critical: boolean;
}

export interface ActivityLogEntry {
  time: string;
  text: string;
  type: 'ai' | 'human' | 'system';
}

export type ViewMode = 'graph' | 'list' | 'kanban' | 'timeline' | 'dashboard' | 'dossier';

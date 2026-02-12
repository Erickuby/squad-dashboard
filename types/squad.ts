export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'waiting_approval' | 'completed' | 'failed';
  assigned_agent?: 'researcher' | 'builder' | 'copywriter' | 'marketer' | 'manager';
  created_at: string;
  updated_at: string;
  started_at?: string;
  completed_at?: string;
  parent_task_id?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  bounce_count: number;
  requires_approval: boolean;
  approved_by?: string;
  approval_comment?: string;
  project_id?: string;
  chat_history: ChatMessage[];
  checklist: ChecklistItem[];
  context_refs: string[];
  tags: string[];
  metadata: Record<string, any>;
}

export interface ChatMessage {
  author: string;
  role: 'manager' | 'agent' | 'human';
  message: string;
  timestamp: string;
}

export interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
  manager_agent: string;
  context_refs: string[];
  metadata: Record<string, any>;
}

export interface Context {
  id: string;
  name: string;
  type: 'brand_guideline' | 'sop' | 'document' | 'template';
  content: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export interface SOP {
  id: string;
  name: string;
  agent: 'researcher' | 'builder' | 'copywriter' | 'marketer';
  steps: ChecklistItem[];
  version: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export interface SquadMember {
  name: string;
  role: string;
  emoji: string;
  status: 'working' | 'available' | 'blocked' | 'review';
  currentTask?: string;
  taskId?: string;
  startedAt?: string;
  eta?: string;
  blockers: string[];
  sessionKey?: string;
}

export interface SquadState {
  lastUpdated: string;
  members: Record<string, SquadMember>;
  activityLog: ActivityLogEntry[];
}

export interface ActivityLogEntry {
  timestamp: string;
  member: string;
  action: string;
}

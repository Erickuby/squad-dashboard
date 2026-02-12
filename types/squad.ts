export type AgentStatus = 'available' | 'working' | 'blocked' | 'review';

export interface Agent {
  name: string;
  role: string;
  emoji: string;
  status: AgentStatus;
  currentTask: string | null;
  taskId: string | null;
  startedAt: string | null;
  eta: string | null;
  blockers: string[];
  sessionKey: string | null;
}

export interface SquadState {
  lastUpdated: string;
  members: {
    researcher: Agent;
    builder: Agent;
    copywriter: Agent;
    marketer: Agent;
  };
  activityLog: ActivityEntry[];
}

export interface ActivityEntry {
  timestamp: string;
  member: string;
  action: string;
}

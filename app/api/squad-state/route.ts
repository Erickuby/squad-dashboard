import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

// Version hash to force cache invalidation
const VERSION = '2026-02-12-v4';

const AGENT_ROLES = {
  researcher: {
    name: 'Researcher',
    role: 'Deep Dives & Viral Hunting',
    emoji: '🧪',
  },
  builder: {
    name: 'Builder',
    role: 'n8n Workflows & Coding',
    emoji: '⚡',
  },
  copywriter: {
    name: 'Copywriter',
    role: 'Sales Copy & Hooks',
    emoji: '✍️',
  },
  marketer: {
    name: 'Marketer',
    role: 'Growth Strategy & Distribution',
    emoji: '📈',
  },
};

export async function GET() {
  if (!supabase) {
    // Fall back to local file
    try {
      const statePath = path.join(process.cwd(), '..', 'squad-state.json');
      const stateData = fs.readFileSync(statePath, 'utf8');
      const state = JSON.parse(stateData);
      state.version = VERSION;
      return NextResponse.json(state);
    } catch (error) {
      console.error('Error reading squad state:', error);
      return NextResponse.json(
        { error: 'Could not load squad state' },
        { status: 500 }
      );
    }
  }

  try {
    // Fetch all tasks from Supabase
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (tasksError) throw tasksError;

    // Calculate agent status based on their tasks
    const members: Record<string, any> = {};
    const activityLog: any[] = [];

    // Initialize members with defaults
    Object.entries(AGENT_ROLES).forEach(([key, role]) => {
      members[key] = {
        ...role,
        status: 'available',
        currentTask: null,
        taskId: null,
        startedAt: null,
        eta: null,
        blockers: [],
        sessionKey: null,
      };
    });

    // Calculate status based on tasks
    tasks?.forEach(task => {
      if (!task.assigned_agent) return;

      const agent = task.assigned_agent;
      const agentTasks = tasks.filter(t => t.assigned_agent === agent);

      // Find active task (in_progress or waiting_approval)
      const activeTask = agentTasks.find(
        t => t.status === 'in_progress' || t.status === 'waiting_approval'
      );

      // Find blocked task (failed or 3+ bounces)
      const blockedTask = agentTasks.find(
        t => t.status === 'failed' || t.bounce_count >= 3
      );

      // Update agent status
      if (blockedTask) {
        members[agent].status = 'blocked';
        members[agent].currentTask = blockedTask.title;
        members[agent].taskId = blockedTask.id;
        members[agent].blockers = blockedTask.status === 'failed'
          ? ['Task failed, needs intervention']
          : ['Task stuck in loop, needs intervention'];
      } else if (activeTask) {
        if (activeTask.status === 'waiting_approval') {
          members[agent].status = 'review';
        } else {
          members[agent].status = 'working';
        }
        members[agent].currentTask = activeTask.title;
        members[agent].taskId = activeTask.id;
        members[agent].startedAt = activeTask.started_at || activeTask.created_at;
      } else if (agentTasks.some(t => t.status === 'todo')) {
        members[agent].status = 'available';
      }

      // Collect activity from chat history
      task.chat_history?.forEach((msg: any) => {
        activityLog.push({
          timestamp: msg.timestamp,
          member: msg.author,
          action: msg.message,
        });
      });
    });

    // Sort activity log by timestamp, keep last 50
    activityLog.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const state = {
      lastUpdated: new Date().toISOString(),
      version: VERSION,
      members,
      activityLog: activityLog.slice(0, 50),
    };

    return NextResponse.json(state, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'CDN-Cache-Control': 'no-store',
        'X-API-Version': VERSION,
      },
    });
  } catch (error) {
    console.error('Error fetching squad state:', error);

    // Fall back to local file on error
    try {
      const statePath = path.join(process.cwd(), '..', 'squad-state.json');
      const stateData = fs.readFileSync(statePath, 'utf8');
      const state = JSON.parse(stateData);
      return NextResponse.json(state);
    } catch (fallbackError) {
      console.error('Error reading fallback file:', fallbackError);
      return NextResponse.json(
        { error: 'Could not load squad state' },
        { status: 500 }
      );
    }
  }
}

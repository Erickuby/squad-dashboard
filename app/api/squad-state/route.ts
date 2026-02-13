import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Version hash to force cache invalidation
const VERSION = '2026-02-13-v6';

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
  manager: {
    name: 'Manager',
    role: 'Squad Lead',
    emoji: '👑',
  }
};

export async function GET() {
  // Initialize Supabase directly to ensure environment variables are picked up
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase Credentials in API');
    return NextResponse.json({ error: 'Configuration Error: Missing Supabase Credentials' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

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

      const agent = task.assigned_agent.toLowerCase();
      // Ensure agent exists in our members map (handle case mismatch or extra agents)
      if (!members[agent]) return;

      const agentTasks = tasks.filter(t => t.assigned_agent?.toLowerCase() === agent);

      // DEBUG: Log task processing
      console.log(`[DEBUG] Processing task: ${task.id} - "${task.title.substring(0, 50)}..."`);
      console.log(`[DEBUG]   Agent: ${agent}, Status: ${task.status}`);

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
        console.log(`[DEBUG] Agent ${agent} status set to: blocked`);
      } else if (activeTask) {
        if (activeTask.status === 'waiting_approval') {
          members[agent].status = 'review';
        } else {
          members[agent].status = 'working';
        }
        members[agent].currentTask = activeTask.title;
        members[agent].taskId = activeTask.id;
        members[agent].startedAt = activeTask.started_at || activeTask.created_at;
        console.log(`[DEBUG] Agent ${agent} status set to: ${members[agent].status}`);
      } else if (agentTasks.some(t => t.status === 'todo')) {
        // Stick with available, but maybe indicate queued work?
        // For now 'available' implies ready to work.
        members[agent].status = 'available';
        console.log(`[DEBUG] Agent ${agent} status set to: available`);
      }

      // Collect activity from chat history
      const history = typeof task.chat_history === 'string' ? JSON.parse(task.chat_history) : task.chat_history;
      if (Array.isArray(history)) {
        history.forEach((msg: any) => {
          activityLog.push({
            timestamp: msg.timestamp,
            member: msg.author,
            action: msg.message,
          });
        });
      }
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
  } catch (error: any) {
    console.error('Error fetching squad state:', error);
    return NextResponse.json(
      { error: 'Error calculating squad state', details: error.message },
      { status: 500 }
    );
  }
}

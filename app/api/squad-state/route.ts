import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export async function GET() {
  // Try Supabase first if configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('squad_state')
        .select('state_data, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        // Merge with updated_at from Supabase
        const state = data.state_data;
        state.lastUpdated = data.updated_at;
        return NextResponse.json(state);
      }
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
      // Fall through to local file
    }
  }

  // Fall back to local file
  try {
    const statePath = path.join(process.cwd(), '..', 'squad-state.json');
    const stateData = fs.readFileSync(statePath, 'utf8');
    const state = JSON.parse(stateData);
    return NextResponse.json(state);
  } catch (error) {
    console.error('Error reading squad state:', error);
    // Return empty state as last resort
    return NextResponse.json({
      lastUpdated: new Date().toISOString(),
      members: {
        researcher: {
          name: 'Researcher',
          role: 'Deep Dives & Viral Hunting',
          emoji: '🧪',
          status: 'available',
          currentTask: null,
          taskId: null,
          startedAt: null,
          eta: null,
          blockers: [],
          sessionKey: null,
        },
        builder: {
          name: 'Builder',
          role: 'n8n Workflows & Coding',
          emoji: '⚡',
          status: 'available',
          currentTask: null,
          taskId: null,
          startedAt: null,
          eta: null,
          blockers: [],
          sessionKey: null,
        },
        copywriter: {
          name: 'Copywriter',
          role: 'Sales Copy & Hooks',
          emoji: '✍️',
          status: 'available',
          currentTask: null,
          taskId: null,
          startedAt: null,
          eta: null,
          blockers: [],
          sessionKey: null,
        },
        marketer: {
          name: 'Marketer',
          role: 'Growth Strategy & Distribution',
          emoji: '📈',
          status: 'available',
          currentTask: null,
          taskId: null,
          startedAt: null,
          eta: null,
          blockers: [],
          sessionKey: null,
        },
      },
      activityLog: [],
    });
  }
}

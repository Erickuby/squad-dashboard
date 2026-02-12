import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// The squad-state.json is in the parent directory (workspace root)
export async function GET() {
  try {
    const statePath = path.join(process.cwd(), '..', 'squad-state.json');
    const stateData = fs.readFileSync(statePath, 'utf8');
    const state = JSON.parse(stateData);
    return NextResponse.json(state);
  } catch (error) {
    console.error('Error reading squad state:', error);
    // Return mock data if file doesn't exist
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

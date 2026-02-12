import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Paths
const ABS_STATE_PATH = 'C:\\Users\\ericc\\clawd\\squad-state.json';

const AUTO_COMPLETE_AFTER_MINUTES = 20;

// Supabase Init
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Or service key if needed, but let's try anon first if RLS allows
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dryRun = false } = body;

    console.log('[Auto-Complete] Checking Supabase for active tasks...');

    // 1. Fetch active tasks from Supabase (Source of Truth)
    // We look for tasks that are "in_progress"
    const { data: activeTasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'in_progress');

    if (error) throw error;

    const now = new Date();
    const tasksToComplete: any[] = [];

    // 2. Determine which tasks to complete
    for (const task of activeTasks || []) {
      // Calculate duration logic
      // If task has 'created_at' or 'updated_at', use that?
      // Actually, the original logic used squad-state 'startedAt'. 
      // Supabase tasks might not have 'started_at' field? check schema.
      // Step 737 output showed 'started_at': null for a completed task.
      // Let's use 'created_at' as a fallback if started_at is missing, or updated_at.

      const startTimeStr = task.started_at || task.created_at;
      if (!startTimeStr) continue;

      const startTime = new Date(startTimeStr);
      const minutesSinceStart = (now.getTime() - startTime.getTime()) / 60000;

      if (minutesSinceStart >= AUTO_COMPLETE_AFTER_MINUTES) {
        tasksToComplete.push({
          ...task,
          minutesSinceStart
        });
      }
    }

    if (tasksToComplete.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No tasks ready for auto-completion',
        tasksCompleted: 0,
      });
    }

    if (dryRun) {
      return NextResponse.json({
        success: true,
        message: 'Dry run complete',
        tasksToComplete
      });
    }

    // Apply updates
    console.log(`[Auto-Complete] Auto-completing ${tasksToComplete.length} task(s)...`);

    // 3. Update Supabase
    for (const task of tasksToComplete) {
      // Update status to waiting_approval
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          status: 'waiting_approval',
          updated_at: now.toISOString()
        })
        .eq('id', task.id);

      if (updateError) {
        console.error(`[Auto-Complete] Failed to update task ${task.id} in Supabase`, updateError);
        continue;
      }

      console.log(`[Auto-Complete] Updated Supabase task ${task.id} (${task.title})`);

      // 4. Update Local Squad State (Visuals)
      if (fs.existsSync(ABS_STATE_PATH)) {
        try {
          const state = JSON.parse(fs.readFileSync(ABS_STATE_PATH, 'utf-8'));
          const { members, activityLog } = state;

          // Find member by agent name/role mapping or if we stored it
          // Supabase task has 'assigned_agent' e.g. 'researcher'
          const agentKey = task.assigned_agent;

          if (agentKey && members[agentKey]) {
            members[agentKey].status = 'waiting_approval';

            // Add log entry
            activityLog.unshift({
              timestamp: now.toISOString(),
              member: 'System',
              action: `Auto-completed "${task.title}" for ${members[agentKey].name} (Inactive > ${Math.floor(task.minutesSinceStart)}m)`
            });

            fs.writeFileSync(ABS_STATE_PATH, JSON.stringify(state, null, 2));
            console.log(`[Auto-Complete] Updated local state for ${agentKey}`);
          }
        } catch (e) {
          console.error('[Auto-Complete] Error updating local state:', e);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Auto-completed ${tasksToComplete.length} task(s)`,
      tasksCompleted: tasksToComplete.length,
      tasks: tasksToComplete
    });

  } catch (error) {
    console.error('[Auto-Complete] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

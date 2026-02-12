/**
 * Auto-complete tasks that have been in progress too long
 *
 * POST /api/auto-complete-tasks
 * Moves tasks from "in_progress" to "waiting_approval" after 20-30 min of inactivity
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const AUTO_COMPLETE_AFTER_MINUTES = 20; // Auto-complete after 20 min of inactivity

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dryRun = false } = body;

    console.log('[Auto-Complete] Checking tasks for auto-completion...');

    // Fetch tasks in progress
    const { data: tasks, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'in_progress')
      .not('bounce_count', 3) // Don't auto-complete if task is stuck in loop
      .order('updated_at', { ascending: true });

    if (fetchError) {
      console.error('[Auto-Complete] Error fetching tasks:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch tasks' },
        { status: 500 }
      );
    }

    if (!tasks || tasks.length === 0) {
      console.log('[Auto-Complete] No tasks in progress to auto-complete');
      return NextResponse.json({
        success: true,
        message: 'No tasks in progress',
        tasksCompleted: 0,
      });
    }

    const now = new Date();
    const tasksToComplete: any[] = [];

    // Check each task
    for (const task of tasks) {
      if (!task.started_at) continue;

      const startTime = new Date(task.started_at);
      const minutesSinceStart = (now.getTime() - startTime.getTime()) / 60000;

      // Check if task should be auto-completed
      if (minutesSinceStart >= AUTO_COMPLETE_AFTER_MINUTES) {
        // Check if there's recent activity in chat_history
        const lastComment = task.chat_history?.[task.chat_history.length - 1];
        const lastCommentTime = lastComment ? new Date(lastComment.timestamp) : startTime;

        const minutesSinceLastComment = (now.getTime() - lastCommentTime.getTime()) / 60000;

        // Auto-complete if no activity for 20+ minutes
        if (minutesSinceLastComment >= AUTO_COMPLETE_AFTER_MINUTES) {
          tasksToComplete.push({
            taskId: task.id,
            title: task.title,
            assigned_agent: task.assigned_agent,
            minutesSinceStart,
            minutesSinceLastComment,
          });
        }
      }
    }

    if (dryRun) {
      console.log('[Auto-Complete] DRY RUN - No changes made');
      return NextResponse.json({
        success: true,
        message: 'Auto-complete check complete (dry run)',
        tasksFound: tasks.length,
        tasksToComplete: tasksToComplete.length,
        tasks: tasksToComplete,
      });
    }

    // Update tasks to waiting_approval
    if (tasksToComplete.length > 0) {
      console.log(`[Auto-Complete] Auto-completing ${tasksToComplete.length} task(s)...`);

      for (const task of tasksToComplete) {
        await supabase
          .from('tasks')
          .update({
            status: 'waiting_approval',
            updated_at: now.toISOString(),
          })
          .eq('id', task.taskId);

        console.log(`[Auto-Complete] Moved "${task.title}" to waiting_approval`);
      }

      return NextResponse.json({
        success: true,
        message: `Auto-completed ${tasksToComplete.length} task(s)`,
        tasksCompleted: tasksToComplete.length,
        tasks: tasksToComplete,
      });
    } else {
      console.log('[Auto-Complete] No tasks to auto-complete');
      return NextResponse.json({
        success: true,
        message: 'No tasks ready for auto-completion',
        tasksFound: tasks.length,
        tasksCompleted: 0,
      });
    }

  } catch (error) {
    console.error('[Auto-Complete] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

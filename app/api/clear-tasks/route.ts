import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent } = body; // Optional: Clear only for specific agent

    console.log('[Clear Tasks] Clearing active tasks...', agent ? `for agent: ${agent}` : 'for all agents');

    // Fetch both statuses separately
    const { data: tasksInProgress, error: error1 } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'in_progress');

    const { data: tasksWaiting, error: error2 } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'waiting_approval');

    if (error1 || error2) {
      const err = error1 || error2;
      throw err;
    }

    // Combine both lists
    let tasksToClear = [...(tasksInProgress || []), ...(tasksWaiting || [])];

    // Filter by agent if specified
    if (agent) {
      tasksToClear = tasksToClear.filter(t =>
        t.assigned_agent?.toLowerCase() === agent.toLowerCase()
      );
    }

    if (tasksToClear.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active tasks to clear',
        tasksCleared: 0,
      });
    }

    // Update all tasks to 'completed' - do individually to avoid issues
    const errors: any[] = [];
    let successCount = 0;

    for (const task of tasksToClear) {
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id);

      if (updateError) {
        errors.push({ taskId: task.id, title: task.title, error: updateError });
      } else {
        successCount++;
      }
    }

    console.log(`[Clear Tasks] Cleared ${successCount}/${tasksToClear.length} task(s)`);

    if (errors.length > 0) {
      console.error('[Clear Tasks] Some updates failed:', errors);
    }

    return NextResponse.json({
      success: true,
      message: `Cleared ${successCount} active task(s)${errors.length > 0 ? ` (${errors.length} failed)` : ''}`,
      tasksCleared: successCount,
      tasks: tasksToClear.map(t => ({
        id: t.id,
        title: t.title,
        agent: t.assigned_agent,
        status: t.status
      })),
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error: any) {
    console.error('[Clear Tasks] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to sync completed tasks to Notion
 *
 * POST /api/sync-notion
 * Body: { taskId: string }
 * Returns: { success: boolean, pageId?: string, pageUrl?: string, error?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { syncTaskToNotion } from '../../scripts/sync-notion';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: 'taskId is required' },
        { status: 400 }
      );
    }

    console.log(`[API] Syncing task ${taskId} to Notion...`);

    // Fetch task from Supabase
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (fetchError) {
      console.error('[API] Error fetching task:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch task' },
        { status: 500 }
      );
    }

    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    // Sync to Notion
    const result = await syncTaskToNotion(task);

    if (!result.success) {
      console.error('[API] Notion sync failed:', result.error);
      return NextResponse.json(
        { success: false, error: result.message || 'Failed to sync to Notion' },
        { status: 500 }
      );
    }

    console.log(`[API] Task synced to Notion: ${result.pageId}`);

    // Update task with Notion page ID
    await supabase
      .from('tasks')
      .update({
        notion_page_id: result.pageId,
        notion_page_url: result.pageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId);

    return NextResponse.json({
      success: true,
      pageId: result.pageId,
      pageUrl: result.pageUrl,
      message: 'Task synced to Notion successfully',
    });

  } catch (error) {
    console.error('[API] Error in sync-notion:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

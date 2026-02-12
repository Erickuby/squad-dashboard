import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// @ts-ignore
import { syncTaskToNotion } from '../../../scripts/sync-notion';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      );
    }

    console.log(`[Sync-Notion] Syncing task ${taskId}...`);

    // 1. Fetch Task from Supabase
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (fetchError || !task) {
      console.error(`[Sync-Notion] Task ${taskId} not found in Supabase`, fetchError);
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    // 2. Sync to Notion
    try {
      // syncTaskToNotion returns object with success, pageId, pageUrl
      const result = await syncTaskToNotion(task);

      if (!result.success) {
        throw new Error(result.error || 'Sync failed');
      }

      console.log(`[Sync-Notion] Successfully synced to Notion: ${result.pageId}`);

      // 3. Update Task with Notion URL/ID
      // Check if not already updated to avoid redundancy
      if (task.notion_page_id !== result.pageId) {
        const { error: updateError } = await supabase
          .from('tasks')
          .update({
            notion_page_id: result.pageId,
            notion_page_url: result.pageUrl,
          })
          .eq('id', taskId);

        if (updateError) {
          console.error('[Sync-Notion] Failed to update task with Notion ID:', updateError);
        }
      }

      return NextResponse.json({
        success: true,
        pageId: result.pageId,
        pageUrl: result.pageUrl,
        message: 'Task synced successfully',
      });
    } catch (syncError) {
      console.error('[Sync-Notion] Sync failed:', syncError);
      return NextResponse.json(
        { success: false, error: 'Failed to sync to Notion: ' + syncError },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Sync-Notion] Internal error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

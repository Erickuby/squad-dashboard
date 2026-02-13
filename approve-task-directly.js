/**
 * Approve YouTube Script Task Directly
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TASK_ID = '434b5685-5948-41a6-b827-9a508a43c7bf';

console.log('\n' + '='.repeat(60));
console.log('  Approving YouTube Script Task');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function approveTask() {
  try {
    // Fetch current task
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', TASK_ID)
      .single();

    if (fetchError) throw fetchError;

    if (!task) {
      console.error('❌ Task not found');
      process.exit(1);
    }

    console.log('Current Task:');
    console.log('  Title:', task.title);
    console.log('  Status:', task.status);
    console.log('  Agent:', task.assigned_agent);
    console.log('  Priority:', task.priority);
    console.log('');

    // Update task to completed
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        status: 'completed',
        approved_by: 'eric',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', TASK_ID);

    if (updateError) throw updateError;

    console.log('✅ Task Approved Successfully!');
    console.log('='.repeat(60) + '\n');
    console.log('  Task ID:', TASK_ID);
    console.log('  New Status: completed');
    console.log('  Approved by: eric');
    console.log('  Completed at:', new Date().toLocaleString('en-GB'));
    console.log('');
    console.log('Task Details:');
    console.log('  - 10-minute YouTube script');
    console.log('  - 1,780 words');
    console.log('  - 3 core techniques explained');
    console.log('  - BTNE-relevant throughout');
    console.log('  - Strong hook with 250% growth statistic');
    console.log('  - Human-sounding, conversational tone');
    console.log('');
    console.log('What Happens Next:');
    console.log('─'.repeat(60));
    console.log('  1. Task moved to "Completed" column');
    console.log('  2. Copywriter shows "Available" in Squad view');
    console.log('  3. Notion sync (next approval will include this)');
    console.log('  4. 🎬 Script ready for YouTube recording!');
    console.log('');
    console.log('🎉 YouTube script approved! Go record your video! 🎬\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

approveTask();

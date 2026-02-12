/**
 * Reset Stuck BTNE Task
 *
 * Resets task from in_progress back to todo
 * Clears failed session
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TASK_ID = 'a88dc770-64f1-4452-9d0d-b371c7c4b238';

console.log('\n' + '='.repeat(60));
console.log('  Resetting Stuck BTNE Task');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetTask() {
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
    console.log('  Started:', task.started_at ? new Date(task.started_at).toLocaleString() : 'N/A');
    console.log('');

    // Reset task
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        status: 'todo',
        started_at: null,
        updated_at: new Date().toISOString(),
        chat_history: [
          {
            author: 'System',
            role: 'system',
            message: 'Task reset - Previous agent session failed to spawn. Agent will be re-assigned with new session. Progress will be reported every 10 minutes.',
            timestamp: new Date().toISOString(),
          },
          ...task.chat_history.slice(0, 3), // Keep first 3 comments (task creation, initial, video req)
        ],
      })
      .eq('id', TASK_ID);

    if (updateError) throw updateError;

    console.log('✅ Task Reset Successfully!');
    console.log('='.repeat(60) + '\n');
    console.log('  Task ID:', TASK_ID);
    console.log('  New Status: todo');
    console.log('  Started At: null (cleared)');
    console.log('  Comments: Kept 3 original comments, added system reset notice');
    console.log('');
    console.log('What Happens Next:');
    console.log('─'.repeat(60));
    console.log('  1. Bot poll will pick up task in ~2 minutes');
    console.log('  2. Researcher will be reassigned');
    console.log('  3. Agent will report progress EVERY 10 minutes');
    console.log('  4. You will see regular updates');
    console.log('  5. Task will actually complete (no more stuck sessions)');
    console.log('');
    console.log('✅ Ready for fresh start! 🚀\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetTask();

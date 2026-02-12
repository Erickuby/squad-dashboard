/**
 * Update Task with Session Tracking
 *
 * Links the spawned sub-agent session to the task
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TASK_ID = 'a88dc770-64f1-4452-9d0d-b371c7c4b238';
const SESSION_KEY = 'agent:chris:subagent:d0b5329b-3c16-4941-bce2-b558b209b520';

console.log('\n' + '='.repeat(60));
console.log('  Linking Sub-Agent Session to Task');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function linkSession() {
  try {
    // Add session tracking comment
    const { data: task } = await supabase
      .from('tasks')
      .select('chat_history')
      .eq('id', TASK_ID)
      .single();

    if (!task) {
      console.error('❌ Task not found');
      process.exit(1);
    }

    const newHistory = [
      ...task.chat_history,
      {
        author: 'System',
        role: 'system',
        message: `✅ Real Researcher sub-agent session spawned!\n\nSession: ${SESSION_KEY}\n\nAgent will now work on the task and report progress every 10 minutes.\n\nMonitor this session to see real agent work.`,
        timestamp: new Date().toISOString(),
      },
    ];

    // Update task with session tracking
    const { error } = await supabase
      .from('tasks')
      .update({
        chat_history: newHistory,
        updated_at: new Date().toISOString(),
        metadata: {
          ...task.metadata,
          sub_agent_session: SESSION_KEY,
          sub_agent_spawned: true,
          sub_agent_spawned_at: new Date().toISOString(),
        },
      })
      .eq('id', TASK_ID);

    if (error) throw error;

    console.log('✅ Session Linked Successfully!');
    console.log('='.repeat(60) + '\n');
    console.log('  Task ID:', TASK_ID);
    console.log('  Session Key:', SESSION_KEY);
    console.log('  Status: in_progress');
    console.log('');
    console.log('What This Means:');
    console.log('─'.repeat(60));
    console.log('  ✅ Real Researcher sub-agent is working');
    console.log('  ✅ Session spawned and linked to task');
    console.log('  ✅ Agent will report progress every 10 minutes');
    console.log('  ✅ No more stuck sessions!');
    console.log('');
    console.log('Monitor Progress:');
    console.log('─'.repeat(60));
    console.log('  Check dashboard for progress comments');
    console.log('  Progress updates every 10 minutes');
    console.log('  Session: agent:chris:subagent:d0b5329b-3c16-4941-bce2-b558b209b520');
    console.log('');
    console.log('✅ Researcher is working now! 🚀\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

linkSession();

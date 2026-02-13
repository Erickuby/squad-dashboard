/**
 * Check all tasks in waiting_approval
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n' + '='.repeat(60));
console.log('  Checking Tasks in Waiting Approval');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTasks() {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'waiting_approval')
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log(`Found ${tasks.length} task(s) in "waiting_approval":\n`);

    tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title}`);
      console.log(`   ID: ${task.id}`);
      console.log(`   Agent: ${task.assigned_agent || 'Unassigned'}`);
      console.log(`   Priority: ${task.priority}`);
      console.log(`   Comments: ${task.chat_history?.length || 0}`);
      console.log(`   Created: ${new Date(task.created_at).toLocaleString('en-GB')}`);
      console.log(`   Updated: ${new Date(task.updated_at).toLocaleString('en-GB')}`);
      console.log('');
    });

    if (tasks.length === 0) {
      console.log('⚠️ No tasks in "waiting_approval" status!');
      console.log('');
      console.log('Possible reasons:');
      console.log('  - Task was approved already');
      console.log('  - Task was moved to a different status');
      console.log('  - Task was deleted');
      console.log('  - Task is still in progress');
      console.log('');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTasks();

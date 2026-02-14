/**
 * Check Tasks in Dashboard's Supabase
 *
 * Uses the correct Supabase credentials from .env.local
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n' + '='.repeat(60));
console.log('  Checking Supabase Tasks');
console.log('='.repeat(60) + '\n');

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey.substring(0, 20) + '...');
console.log('');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTasks() {
  try {
    // Fetch all tasks
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching tasks:', error);
      process.exit(1);
    }

    if (!tasks || tasks.length === 0) {
      console.log('⚠️  No tasks found in database!');
      console.log('');
      console.log('Possible reasons:');
      console.log('  1. Task not created successfully');
      console.log('  2. Wrong Supabase project');
      console.log('  3. Table permissions issue');
      console.log('  4. Database name mismatch');
      return;
    }

    console.log(`Found ${tasks.length} task(s):\n`);

    tasks.forEach((task, i) => {
      const created = new Date(task.created_at);
      const updated = new Date(task.updated_at);

      console.log(`  ${i + 1}. ${task.title}`);
      console.log(`     ID: ${task.id}`);
      console.log(`     Status: ${task.status}`);
      console.log(`     Agent: ${task.assigned_agent || 'Unassigned'}`);
      console.log(`     Priority: ${task.priority || 'none'}`);
      console.log(`     Created: ${created.toLocaleString()}`);
      console.log(`     Updated: ${updated.toLocaleString()}`);
      console.log('');
    });

    // Count by status
    const byStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    console.log('Status Summary:');
    console.log('  To Do:', byStatus.todo || 0);
    console.log('  In Progress:', byStatus.in_progress || 0);
    console.log('  Waiting Approval:', byStatus.waiting_approval || 0);
    console.log('  Completed:', byStatus.completed || 0);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTasks();

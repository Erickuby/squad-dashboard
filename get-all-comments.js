/**
 * Get all task comments to find the 6-minute script
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TASK_ID = '434b5685-5948-41a6-b827-9a508a43c7bf';

console.log('\n' + '='.repeat(60));
console.log('  Getting All Task Comments');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllComments() {
  try {
    // Fetch task
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

    const history = typeof task.chat_history === 'string'
      ? JSON.parse(task.chat_history)
      : task.chat_history || [];

    console.log('Task Found:');
    console.log('  Title:', task.title);
    console.log('  Status:', task.status);
    console.log('  Comments:', history.length);
    console.log('');
    console.log('='.repeat(60));
    console.log('  All Comments');
    console.log('='.repeat(60) + '\n');

    history.forEach((entry, index) => {
      console.log(`\n[${index + 1}] ${entry.author} (${entry.role})`);
      console.log(`Timestamp: ${entry.timestamp}`);
      console.log('Message:');
      console.log('---');
      console.log(entry.message);
      console.log('---');
      console.log('');
    });

    console.log('\n' + '='.repeat(60) + '\n');
    console.log('Look through the comments above to find the original 6-minute script.');
    console.log('It should be a comment from Copywriter with the full script content.');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getAllComments();

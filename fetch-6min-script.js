/**
 * Fetch original 6-minute script from Squad Dashboard task
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TASK_ID = '434b5685-5948-41a6-b827-9a508a43c7bf';

console.log('\n' + '='.repeat(60));
console.log('  Fetching 6-Minute Script from Task');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchScript() {
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

    console.log('Searching for script in comments...');
    console.log('');

    // Find the script content
    let scriptContent = null;
    let scriptAuthor = null;

    for (const entry of history) {
      if (entry.message && entry.message.includes('Script:')) {
        scriptContent = entry.message;
        scriptAuthor = entry.author;
        break;
      }
      if (entry.message && entry.message.includes('###')) {
        // Might be a script block
        scriptContent = entry.message;
        scriptAuthor = entry.author;
      }
    }

    if (!scriptContent) {
      console.error('❌ No script found in task comments');
      process.exit(1);
    }

    console.log('✅ Script Found!');
    console.log('  Author:', scriptAuthor);
    console.log('  Length:', scriptContent.length, 'characters');
    console.log('');
    console.log('--- SCRIPT CONTENT ---');
    console.log('');
    console.log(scriptContent);
    console.log('');
    console.log('--- END SCRIPT ---');
    console.log('');
    console.log('Copy this script and save it to a file, then I can add it to Notion.');
    console.log('');
    console.log('💡 Command to save to file:');
    console.log('  node fetch-6min-script.js > youtube-script-6min.md');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fetchScript();

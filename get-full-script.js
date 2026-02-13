/**
 * Get full script from Supabase task comments
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TASK_ID = '434b5685-5948-41a6-b827-9a508a43c7bf';

console.log('\n' + '='.repeat(60));
console.log('  Getting Full Script from Supabase');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getScript() {
  try {
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', TASK_ID)
      .single();

    if (error) throw error;

    if (!task) {
      console.error('❌ Task not found');
      process.exit(1);
    }

    console.log('Task:');
    console.log('  Title:', task.title);
    console.log('  Comments:', task.chat_history?.length || 0);
    console.log('');

    // Find Copywriter comment with script
    const scriptComment = task.chat_history.find(msg =>
      msg.author === 'Copywriter' &&
      msg.message.includes('# YouTube Video Script')
    );

    if (!scriptComment) {
      console.error('❌ Script not found in comments!');
      console.log('');
      console.log('All comments:');
      task.chat_history.forEach((comment, index) => {
        console.log(`\n${index + 1}. ${comment.author} (${comment.role})`);
        console.log(`   Length: ${comment.message.length} chars`);
        console.log(`   First 100 chars: ${comment.message.substring(0, 100)}`);
      });
      process.exit(1);
    }

    console.log('✅ Script found in Copywriter comment!');
    console.log('');
    console.log('Full Script:');
    console.log('='.repeat(60));
    console.log('');
    console.log(scriptComment.message);
    console.log('');
    console.log('='.repeat(60));
    console.log('');
    console.log('Script Length:', scriptComment.message.length, 'characters');
    console.log('Estimated Words:', Math.floor(scriptComment.message.length / 5));
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getScript();

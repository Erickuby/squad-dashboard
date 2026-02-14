/**
 * Check Copywriter Task Status
 *
 * Checks the YouTube script task status in database
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n' + '='.repeat(60));
console.log('  Checking Copywriter Task Status');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCopywriterTask() {
  try {
    // Fetch Copywriter task
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('assigned_agent', 'copywriter')
      .eq('status', 'in_progress')
      .single();

    if (error) {
      console.error('❌ Error fetching task:', error);
      process.exit(1);
    }

    if (!task) {
      console.log('⚠️  No Copywriter task in "in_progress" status');
      console.log('');
      console.log('Checking all Copywriter tasks...');

      const { data: allCopywriterTasks } = await supabase
        .from('tasks')
        .select('id, title, status, assigned_agent, started_at, updated_at')
        .eq('assigned_agent', 'copywriter')
        .order('created_at', { ascending: false })
        .limit(5);

      if (allCopywriterTasks && allCopywriterTasks.length > 0) {
        console.log('\nAll Copywriter Tasks:');
        console.log('─'.repeat(60));

        allCopywriterTasks.forEach((t, i) => {
          const started = t.started_at ? new Date(t.started_at) : null;
          const updated = new Date(t.updated_at);

          console.log(`  ${i + 1}. ${t.title}`);
          console.log(`     ID: ${t.id}`);
          console.log(`     Status: ${t.status}`);
          console.log(`     Agent: ${t.assigned_agent}`);
          console.log(`     Started: ${started ? started.toLocaleString() : 'N/A'}`);
          console.log(`     Updated: ${updated.toLocaleString()}`);
          console.log('');
        });
      } else {
        console.log('No Copywriter tasks found at all!');
      }

      return;
    }

    console.log('✅ Found Copywriter task in progress:');
    console.log('');
    console.log('Task Details:');
    console.log('─'.repeat(60));
    console.log('  Title:', task.title);
    console.log('  ID:', task.id);
    console.log('  Status:', task.status);
    console.log('  Agent:', task.assigned_agent);
    console.log('  Priority:', task.priority);
    console.log('  Started:', task.started_at ? new Date(task.started_at).toLocaleString() : 'N/A');
    console.log('  Updated:', new Date(task.updated_at).toLocaleString());
    console.log('');

    // Check chat history
    const history = typeof task.chat_history === 'string'
      ? JSON.parse(task.chat_history)
      : task.chat_history;

    if (history && history.length > 0) {
      console.log('Chat History (' + history.length + ' comments):');
      console.log('─'.repeat(60));

      history.forEach((comment, i) => {
        const commentTime = new Date(comment.timestamp);
        const minutesAgo = (Date.now() - commentTime.getTime()) / 60000;

        console.log(`  ${i + 1}. ${comment.author} (${comment.role})`);
        console.log(`     ${commentTime.toLocaleString()} (${Math.round(minutesAgo)} min ago)`);
        console.log('');
        console.log(`     ${comment.message.substring(0, 200)}${comment.message.length > 200 ? '...' : ''}`);
        console.log('');
      });
    } else {
      console.log('No comments yet.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkCopywriterTask();

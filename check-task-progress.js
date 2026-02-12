/**
 * Check Task Progress
 *
 * Fetches detailed task info including chat history
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TASK_ID = 'a88dc770-64f1-4452-9d0d-b371c7c4b238';

console.log('\n' + '='.repeat(60));
console.log('  BTNE Task Progress Check');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProgress() {
  try {
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', TASK_ID)
      .single();

    if (error) {
      console.error('❌ Error fetching task:', error);
      process.exit(1);
    }

    if (!task) {
      console.error('❌ Task not found');
      process.exit(1);
    }

    const created = new Date(task.created_at);
    const started = task.started_at ? new Date(task.started_at) : created;
    const updated = new Date(task.updated_at);
    const now = new Date();

    const elapsedSinceStart = (now.getTime() - started.getTime()) / 60000;
    const elapsedSinceUpdate = (now.getTime() - updated.getTime()) / 60000;

    console.log('Task Details:');
    console.log('─'.repeat(60));
    console.log('Title:', task.title);
    console.log('Status:', task.status);
    console.log('Agent:', task.assigned_agent);
    console.log('Priority:', task.priority);
    console.log('Created:', created.toLocaleString());
    console.log('Started:', started.toLocaleString());
    console.log('Last Updated:', updated.toLocaleString());
    console.log('');
    console.log('Time Elapsed:');
    console.log('  Since started:', Math.round(elapsedSinceStart), 'minutes');
    console.log('  Since last update:', Math.round(elapsedSinceUpdate), 'minutes');
    console.log('');

    // Chat history
    const history = typeof task.chat_history === 'string'
      ? JSON.parse(task.chat_history)
      : task.chat_history;

    if (!history || history.length === 0) {
      console.log('⚠️  No comments yet - Researcher may still be initializing');
    } else {
      console.log('Chat History (' + history.length + ' comments):');
      console.log('─'.repeat(60));

      history.forEach((comment, i) => {
        const commentTime = new Date(comment.timestamp);
        const minutesAgo = (now.getTime() - commentTime.getTime()) / 60000;

        console.log(`\n  ${i + 1}. ${comment.author} (${comment.role})`);
        console.log(`     ${commentTime.toLocaleString()} (${Math.round(minutesAgo)} min ago)`);
        console.log('');
        console.log(`     ${comment.message.substring(0, 150)}${comment.message.length > 150 ? '...' : ''}`);
      });
    }

    console.log('\n' + '─'.repeat(60));
    console.log('Estimated Completion:');
    console.log('─'.repeat(60));
    console.log('  Estimated time: 8 hours');
    console.log('  Time elapsed:', Math.round(elapsedSinceStart / 60), 'hours');
    console.log('  Time remaining: ~' + Math.round(8 - (elapsedSinceStart / 60)), 'hours');
    console.log('');
    console.log('  Expected completion:', new Date(started.getTime() + 8 * 60 * 60 * 1000).toLocaleString());
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkProgress();

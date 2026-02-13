/**
 * Extract script from approved task
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TASK_ID = '434b5685-5948-41a6-b827-9a508a43c7bf';

console.log('\n' + '='.repeat(60));
console.log('  Extracting Script from Task');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function extractScript() {
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

    console.log('Task Found:');
    console.log('  Title:', task.title);
    console.log('  Status:', task.status);
    console.log('  Comments:', task.chat_history?.length || 0);
    console.log('');

    console.log('Searching for script in comments...\n');

    // Find Copywriter comments
    const copywriterComments = task.chat_history.filter(msg =>
      msg.author === 'Copywriter' || msg.role === 'agent'
    );

    console.log(`Found ${copywriterComments.length} Copywriter comments:\n`);

    // Combine all Copywriter comments
    let scriptContent = '';
    copywriterComments.forEach((comment, index) => {
      console.log(`\n--- Comment ${index + 1} ---`);
      console.log(`Author: ${comment.author}`);
      console.log(`Role: ${comment.role}`);
      console.log(`Time: ${new Date(comment.timestamp).toLocaleString('en-GB')}`);
      console.log(`\nContent Preview (first 200 chars):`);
      console.log(comment.message.substring(0, 200) + '...');
      console.log('');

      if (comment.message.length > 500) {
        scriptContent += comment.message + '\n\n';
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log('  Extracted Content');
    console.log('='.repeat(60));
    console.log(`Total script length: ${scriptContent.length} characters`);
    console.log(`Estimated words: ${Math.floor(scriptContent.length / 5)}`);
    console.log('');

    if (scriptContent.length > 100) {
      console.log('✅ Found script content!\n');
      console.log('Saving to file: youtube-script-final.md\n');

      fs.writeFileSync(
        path.join(__dirname, 'youtube-script-final.md'),
        scriptContent,
        'utf-8'
      );

      console.log('✅ Script saved successfully!');
      console.log('');
      console.log('File location: squad-dashboard/youtube-script-final.md');
      console.log('');
      console.log('You can now open this file to view the full script!');
    } else {
      console.log('⚠️ Script content not found in comments.');
      console.log('');
      console.log('Available comments:');
      task.chat_history.forEach((comment, index) => {
        console.log(`\n${index + 1}. ${comment.author} (${comment.role})`);
        console.log(`   Length: ${comment.message.length} chars`);
        console.log(`   Preview: ${comment.message.substring(0, 100)}...`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

extractScript();

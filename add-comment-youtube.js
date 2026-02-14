/**
 * Add Comment to BTNE Task
 *
 * Adds a comment about creating YouTube video script
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n' + '='.repeat(60));
console.log('  Adding Comment to BTNE Task');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TASK_ID = 'a88dc770-64f1-4452-9d0d-b371c7c4b238';

async function addComment() {
  try {
    // Fetch current task
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('chat_history')
      .eq('id', TASK_ID)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching task:', fetchError);
      process.exit(1);
    }

    if (!task) {
      console.error('❌ Task not found');
      process.exit(1);
    }

    const existingComments = task.chat_history || [];

    // Add new comment
    const newComment = {
      author: 'eric',
      role: 'human',
      message: `After this research is complete and approved, Copywriter will create a 10-minute YouTube video script based on the A-Z guide.

**Video Script Requirements:**
- 10-minute script (1,600-1,800 words)
- VERY STRONG HOOK - First 30 seconds must grab attention
- Interesting storyline that flows naturally
- Human-sounding (NOT AI robotic or academic)
- BTNE-relevant examples throughout
- Clear CTA at the end

**Hook Strategy:**
- Start with pain point or surprising stat
- Make it relatable to BTNE community
- Promise transformation or value

**Storyline Structure:**
- Problem → Solution → Results
- Real examples from your research
- Emotional connection
- Clear progression

**Tone:**
- Conversational, not academic
- Authentic voice
- BTNE community language
- Natural transitions

**Video Structure:**
- 0:00-0:30 - Hook (must be powerful!)
- 0:30-2:00 - Problem/intro
- 2:00-6:00 - Main content (A-Z guide highlights)
- 6:00-8:00 - Practical examples
- 8:00-9:30 - Action steps
- 9:30-10:00 - CTA

Please structure your research findings to support this video script. Focus on:
1. Powerful statistics for the hook
2. BTNE-specific pain points
3. Real examples that translate well to video
4. Clear action steps that viewers can implement
5. Emotional touch points for storytelling`,
      timestamp: new Date().toISOString(),
    };

    const updatedComments = [...existingComments, newComment];

    // Update task with new comment
    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update({ chat_history: updatedComments })
      .eq('id', TASK_ID)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error adding comment:', updateError);
      process.exit(1);
    }

    if (!updatedTask) {
      console.error('❌ Update failed - no data returned');
      process.exit(1);
    }

    console.log('\n✅ Comment Added Successfully!');
    console.log('='.repeat(60) + '\n');
    console.log('  Task ID:', TASK_ID);
    console.log('  Title:', updatedTask.title);
    console.log('  Status:', updatedTask.status);
    console.log('  Total Comments:', updatedTask.chat_history.length);
    console.log('');
    console.log('Comment Added:');
    console.log('─'.repeat(60));
    console.log('  Author: Eric');
    console.log('  Role: Human');
    console.log('  Time:', new Date().toLocaleString());
    console.log('─'.repeat(60));
    console.log(newComment.message);
    console.log('─'.repeat(60));
    console.log('');
    console.log('✅ Researcher will now structure research for video script!');
    console.log('✅ After research is approved, Copywriter will create the script.');
    console.log('✅ Everything aligned for YouTube video creation! 🎬\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addComment();

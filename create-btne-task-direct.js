/**
 * Create BTNE Task Directly in Supabase
 *
 * Uses the dashboard's Supabase credentials
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n' + '='.repeat(60));
console.log('  Creating BTNE Prompt Engineering Task');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTask() {
  try {
    // First, check if BTNE task already exists
    const { data: existingTasks } = await supabase
      .from('tasks')
      .select('*')
      .ilike('title', '%prompt engineering%');

    if (existingTasks && existingTasks.length > 0) {
      console.log('⚠️  BTNE task already exists!');
      console.log('\nFound task:', existingTasks[0].title);
      console.log('Status:', existingTasks[0].status);
      console.log('Agent:', existingTasks[0].assigned_agent);
      console.log('');
      console.log('No need to create a new one.');
      return;
    }

    // Create the task
    const { data: task, error } = await supabase
      .from('tasks')
      .insert([
        {
          title: 'Comprehensive Prompt Engineering Research for BTNE Community',
          description: `Research and create an A-Z guide on Prompt Engineering for The Black Tech Community (BTNE).

This is a high-demand topic from the BTNE community.

**Research Requirements:**
1. Prompt Engineering Fundamentals
2. BTNE Community Context
3. Best Practices & Patterns
4. Tools & Platforms
5. Practical Applications for BTNE
6. A-Z Guide Structure

**Deliverables:**
- A-Z guide (10,000+ words)
- Code snippets and examples
- Templates for common scenarios
- Quick-reference cheat sheet`,
          status: 'todo',
          assigned_agent: 'researcher',
          priority: 'urgent',
          requires_approval: true,
          tags: ['btne', 'prompt-engineering', 'research', 'a-z-guide'],
          checklist: [],
          chat_history: [
            {
              author: 'eric',
              role: 'human',
              message: 'Task created: Research prompt engineering for BTNE community demand',
              timestamp: new Date().toISOString(),
            },
          ],
          metadata: {
            reason: 'High demand topic from BTNE community',
            estimated_hours: 8,
            deliverable: 'A-Z guide with code examples',
            priority_reason: 'Community demand, time-sensitive',
          },
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating task:', error);
      console.error('\nDetails:', error.details);
      process.exit(1);
    }

    if (!task) {
      console.error('❌ Task creation failed - no data returned');
      process.exit(1);
    }

    console.log('\n✅ Task Created Successfully!');
    console.log('='.repeat(60) + '\n');
    console.log('  Task ID:', task.id);
    console.log('  Title:', task.title);
    console.log('  Status:', task.status);
    console.log('  Agent:', task.assigned_agent);
    console.log('  Priority:', task.priority);
    console.log('  Created:', new Date(task.created_at).toLocaleString());
    console.log('\n' + '─'.repeat(60));
    console.log('  What Happens Next:');
    console.log('─'.repeat(60) + '\n');
    console.log('  1. Task is in "To Do" column');
    console.log('  2. Bot poll will pick it up in ~2 minutes');
    console.log('  3. Researcher will start working');
    console.log('  4. Check dashboard in 5-10 minutes');
    console.log('  5. Task will be in "In Progress"');
    console.log('─'.repeat(60));
    console.log('  Ready! Check dashboard now. 🚀\n');

    // Verify task was created
    const { data: verify } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', task.id)
      .single();

    if (verify) {
      console.log('\n✅ Verified: Task exists in database');
      console.log('   Status:', verify.status);
      console.log('   Agent:', verify.assigned_agent);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTask();

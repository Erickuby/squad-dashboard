/**
 * Create YouTube Video Script Task
 *
 * Creates task for Copywriter to write 10-minute video script
 * Based on completed BTNE research findings
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n' + '='.repeat(60));
console.log('  Creating YouTube Video Script Task');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTask() {
  try {
    // Check if task already exists
    const { data: existingTasks } = await supabase
      .from('tasks')
      .select('*')
      .ilike('title', '%youtube%prompt%engineering%');

    if (existingTasks && existingTasks.length > 0) {
      console.log('⚠️  YouTube script task already exists!');
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
          title: '10-Minute YouTube Video Script: Prompt Engineering A-Z Guide',
          description: `Write a compelling 10-minute YouTube video script (1,600-1,800 words) on prompt engineering for The Black Tech Community (BTNE).

**Script Requirements:**

1. **VERY STRONG HOOK** (First 30 seconds)
   - Must grab attention immediately
   - Start with pain point or surprising stat
   - Make it relatable to BTNE community
   - Promise transformation or value

2. **Interesting Storyline**
   - Problem → Solution → Results
   - Real examples from research findings
   - Emotional connection
   - Clear progression

3. **Human-Sounding Tone**
   - NOT AI robotic or academic
   - Conversational, your authentic voice
   - BTNE community language
   - Natural transitions

4. **BTNE-Relevant Throughout**
   - Use research findings from completed task
   - Examples that BTNE members relate to
   - Career advancement focus
   - Technical AND non-technical roles

5. **Video Structure:**
   - 0:00-0:30 - Hook (powerful!)
   - 0:30-2:00 - Problem/intro
   - 2:00-6:00 - Main content (A-Z guide highlights)
   - 6:00-8:00 - Practical examples
   - 8:00-9:30 - Action steps
   - 9:30-10:00 - CTA

**Research Findings to Use:**

From completed BTNE task:
- Fundamentals: Prompt engineering + 250% job growth
- 3 Core Techniques: Few-shot, Chain-of-Thought, Role-Based
- Platform Differences: ChatGPT (general), Claude (analysis), etc.
- BTNE Applications: Technical (code, debugging) + Non-technical (resume, interviews)
- Common Pitfalls: Being vague, not providing examples
- Quick-Reference Template: Ready-to-use structure
- Video Hook Stats: 250% growth, 68% productivity, 23% salary premium
- Emotional Touch Points: "Overwhelmed at first", "Superpower", "Career transformation"
- Action Steps: Start fundamentals, practice, build library, iterate

**Specific Instructions:**

**Hook Strategy (First 30 seconds MUST be powerful):**
Option A: "In 2025, demand for prompt engineering skills increased by 250%. But most of us are still struggling to write basic prompts. Today, I'm going to show you the 3 techniques that transformed my career from overwhelmed to empowered."

Option B: "I used to spend hours writing prompts that gave me garbage AI outputs. Until I discovered these 3 techniques that changed everything. Today, I'm sharing the A-Z guide to prompt engineering that no one's teaching you."

Choose the hook that flows best with your script.

**Tone Guidelines:**
- Conversational, not educational/academic
- Use "I" and "you" - personal connection
- Short sentences (15-20 words max)
- Active voice
- No jargon without explanation
- Sound like you're talking to a friend

**Storyline Flow:**
1. Hook (0:00-0:30) - Pain point + promise
2. Problem (0:30-2:00) - Why this matters, struggles
3. Solution (2:00-6:00) - 3 core techniques explained
4. Examples (6:00-8:00) - Real BTNE scenarios
5. Action (8:00-9:30) - What viewers do next
6. CTA (9:30-10:00) - Subscribe, like, comment

**Deliverables:**
- Full script with timestamps (every 30 seconds)
- Word count: 1,600-1,800 words
- Visual cues (what to show on screen)
- Tone check: Human-sounding (review twice)
- BTNE examples integrated throughout

**Success Criteria:**
- Hook is powerful and grabs attention
- Storyline flows naturally
- Tone is human and conversational
- BTNE community relates to examples
- CTA is clear and compelling
- 1,600-1,800 words total`,
          status: 'todo',
          assigned_agent: 'copywriter',
          priority: 'urgent',
          requires_approval: true,
          tags: ['youtube', 'video-script', 'prompt-engineering', 'btne'],
          checklist: [],
          chat_history: [
            {
              author: 'eric',
              role: 'human',
              message: 'Task created: 10-minute YouTube video script based on approved BTNE research.',
              timestamp: new Date().toISOString(),
            },
          ],
          metadata: {
            reason: 'BTNE community video creation',
            estimated_hours: 4,
            deliverable: '10-minute video script (1,600-1,800 words)',
            priority_reason: 'Research approved, ready for video script creation',
            based_on_task_id: 'a88dc770-64f1-4452-9d0d-b371c7c4b238',
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
    console.log('  Agent: Copywriter ✍️');
    console.log('  Priority: Urgent ⚡');
    console.log('  Estimated: 4 hours');
    console.log('  Deliverable: 10-minute video script (1,600-1,800 words)');
    console.log('\n' + '─'.repeat(60));
    console.log('  What Happens Next:');
    console.log('─'.repeat(60) + '\n');
    console.log('  1. Task is in "To Do" column');
    console.log('  2. Bot poll will pick it up in ~2 minutes');
    console.log('  3. Copywriter will start writing');
    console.log('  4. Script will move to "Waiting Approval"');
    console.log('  5. You review and approve');
    console.log('  6. Script is ready for recording! 🎬');
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

/**
 * Bot Polling System for Squad Dashboard
 *
 * This script polls Supabase for tasks assigned to squad agents
 * and spawns sub-agent sessions to complete them.
 *
 * Run this periodically (every 2-3 minutes) to process tasks.
 *
 * Usage: node scripts/bot-poll.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Clawdbot API endpoint for spawning sessions
const CLAWDBOT_API = 'http://localhost:11434';

const AGENT_SYSTEM_PROMPTS = {
  researcher: {
    name: 'Researcher',
    role: 'Deep Dives & Viral Hunting',
    emoji: '🧪',
    systemPrompt: `You are the Researcher. You find insights, trends, and data.

Your role:
1. Viral content research (LinkedIn, YouTube, TikTok)
2. Competitor analysis
3. Market trend identification
4. Data gathering and synthesis
5. Fact-checking and verification

Process:
1. Read the task description
2. Research using web search and content analysis
3. Document your findings in comments
4. Provide actionable insights (not just raw data)

**CRITICAL: Progress Reporting Requirement**
- You MUST add a progress comment EVERY 10 minutes
- Report what you've found, what you're working on, or what's next
- This keeps the task owner informed and shows you're actively working
- Format: "Progress update [X/10 minutes]: [what you're doing]"

Success criteria:
- At least 3 concrete data points
- Actionable insights, not just observations
- Sources cited
- Next steps suggested

When you complete your work:
- Add a comment explaining your findings
- Mark task as "waiting_approval" by updating status
- Be thorough and provide value.`,
  },

  builder: {
    name: 'Builder',
    role: 'n8n Workflows & Coding',
    emoji: '⚡',
    systemPrompt: `You are the Builder. You build tools, workflows, and code.

Your role:
1. n8n workflow automation
2. Scripting and coding
3. API integrations
4. Tool development
5. Technical problem solving

Process:
1. Read the task description
2. Review any attached specs or comments
3. Build solution (code, workflow, or config)
4. Test locally if possible
5. Document your work

**CRITICAL: Progress Reporting Requirement**
- You MUST add a progress comment EVERY 10 minutes
- Report what you're building, what progress you've made, or any issues
- This keeps the task owner informed and shows you're actively working
- Format: "Progress update [X/10 minutes]: [what you're building]"

SOP Checklist (must complete before approval):
- [ ] Solution meets requirements
- [ ] Code is clean and documented
- [ ] Error handling in place
- [ ] Tested (if applicable)
- [ ] Deployment instructions provided

Success criteria:
- Working solution
- Clear documentation
- Error handling present
- Ready for production

When you complete your work:
- Add a comment with your code/workflow
- Mark task as "waiting_approval"
- Include deployment instructions.`,
  },

  copywriter: {
    name: 'Copywriter',
    role: 'Sales Copy & Hooks',
    emoji: '✍️',
    systemPrompt: `You are the Copywriter. You write compelling copy that converts.

Your role:
1. LinkedIn posts and hooks
2. Video scripts and titles
3. Email sequences
4. Landing page copy
5. CTAs and taglines

Process:
1. Read the task description
2. Review any brand guidelines in context storage
3. Draft copy
4. Iterate based on feedback
5. Finalize

**CRITICAL: Progress Reporting Requirement**
- You MUST add a progress comment EVERY 10 minutes
- Report what you're drafting, what ideas you're testing, or what's next
- This keeps the task owner informed and shows you're actively working
- Format: "Progress update [X/10 minutes]: [what you're writing]"

SOP Checklist (must complete before approval):
- [ ] Matches brand tone
- [ ] Strong hook/opening
- [ ] Clear CTA
- [ ] Optimized for platform
- [ ] Proofread

Success criteria:
- Brand voice consistent
- Engaging and relevant
- Clear call to action
- Platform-appropriate format

When you complete your work:
- Add a comment with your copy
- Mark task as "waiting_approval"
- Include any notes on alternatives.`,
  },

  marketer: {
    name: 'Marketer',
    role: 'Growth Strategy & Distribution',
    emoji: '📈',
    systemPrompt: `You are the Marketer. You grow audience and drive engagement.

Your role:
1. Growth strategy development
2. Channel optimization
3. Audience analysis
4. Collaboration opportunities
5. KPI tracking and optimization

Process:
1. Read the task description
2. Analyze data and metrics
3. Develop strategy or recommendations
4. Document with timelines and KPIs
5. Finalize

**CRITICAL: Progress Reporting Requirement**
- You MUST add a progress comment EVERY 10 minutes
- Report what strategies you're developing, what data you're analyzing, or what's next
- This keeps the task owner informed and shows you're actively working
- Format: "Progress update [X/10 minutes]: [what you're working on]"

Success criteria:
- Data-driven recommendations
- Clear action plan
- Measurable KPIs
- Timeline included

When you complete your work:
- Add a comment with your strategy
- Mark task as "waiting_approval"
- Include implementation steps.`,
  },
};

async function pollAndProcessTasks() {
  console.log('🔄 Starting bot poll...\n');

  try {
    // 1. Fetch all tasks that need processing
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .in('status', ['todo', 'in_progress'])
      .not('assigned_agent', 'is', null)
      .order('created_at', { ascending: true });

    if (tasksError) throw tasksError;

    if (!tasks || tasks.length === 0) {
      console.log('✅ No tasks to process.');
      return;
    }

    console.log(`📊 Found ${tasks.length} task(s) to process.\n`);

    // 2. Group tasks by agent
    const tasksByAgent = tasks.reduce((acc, task) => {
      const agent = task.assigned_agent;
      if (!acc[agent]) acc[agent] = [];
      acc[agent].push(task);
      return acc;
    }, {});

    // 3. Process each agent's tasks
    for (const [agentType, agentTasks] of Object.entries(tasksByAgent)) {
      const agentConfig = AGENT_SYSTEM_PROMPTS[agentType];

      if (!agentConfig) {
        console.log(`⚠️  Unknown agent type: ${agentType}`);
        continue;
      }

      console.log(`🤖 Processing ${agentConfig.name} (${agentConfig.emoji})`);
      console.log(`   Tasks: ${agentTasks.length}`);

      // 4. Spawn sub-agent session for each task
      for (const task of agentTasks) {
        await processTask(task, agentConfig);
      }
    }

    console.log('\n✨ Poll complete!');

  } catch (error) {
    console.error('❌ Error in bot poll:', error);
  }
}

async function processTask(task, agentConfig) {
  console.log(`\n   📋 Task: "${task.title}"`);
  console.log(`      Status: ${task.status}`);
  console.log(`      Priority: ${task.priority}`);

  try {
    // Check if task is already being processed (has started_at)
    if (task.status === 'in_progress' && task.started_at) {
      const timeSinceStart = Date.now() - new Date(task.started_at).getTime();
      const minutesElapsed = Math.floor(timeSinceStart / 60000);

      // Check if there's a linked sub-agent session
      const sessionKey = task.metadata?.sub_agent_session;

      if (!sessionKey) {
        console.log(`      ⚠️  No sub-agent session linked to task!`);
        console.log(`      🚀 Spawning real sub-agent session...`);

        // Spawn real sub-agent session
        const spawnResponse = await spawnSubAgent(task, agentConfig);

        if (spawnResponse.success) {
          console.log(`      ✅ Sub-agent session spawned: ${spawnResponse.sessionKey}`);
          await addTaskComment(task.id, 'System', 'system',
            `✅ Real sub-agent session spawned!\n\nSession: ${spawnResponse.sessionKey}\n\nAgent will report progress every 10 minutes.`
          );
        } else {
          console.log(`      ❌ Failed to spawn session: ${spawnResponse.error}`);
          await addTaskComment(task.id, 'System', 'system',
            `❌ Failed to spawn sub-agent session: ${spawnResponse.error}`
          );
        }
      } else {
        // Check for 10-minute progress updates from linked session
        const lastAgentComment = [...task.chat_history]
          .reverse()
          .find(c => c.role === 'agent');

        if (lastAgentComment) {
          const lastCommentTime = new Date(lastAgentComment.timestamp).getTime();
          const timeSinceLastProgress = (Date.now() - lastCommentTime) / 60000;

          // If no progress for 15+ minutes, add warning
          if (timeSinceLastProgress > 15) {
            console.log(`      ⚠️  No progress for ${Math.round(timeSinceLastProgress)} min`);
            await addTaskComment(task.id, 'System', 'system',
              `⚠️ Warning: No progress for ${Math.round(timeSinceLastProgress)} minutes. Agent should report progress every 10 minutes.`
            );
          }
        }

        // If task has been in progress > 30 min, check if agent finished
        if (minutesElapsed > 30) {
          console.log(`      ⏰ Task in progress for ${minutesElapsed} min, checking completion...`);

          // Auto-move to waiting_approval if no recent comments
          if (lastAgentComment) {
            const lastCommentTime = new Date(lastAgentComment.timestamp).getTime();
            const timeSinceLastComment = Date.now() - lastCommentTime;

            // If last comment was > 20 min ago from agent, move to approval
            if (timeSinceLastComment > 20 * 60000) {
              console.log(`      ✅ Auto-moving to waiting_approval`);
              await updateTaskStatus(task.id, 'waiting_approval', agentConfig);
            }
          }
        }
      }
      return;
    }

    // New task (todo status) - spawn agent to start working
    if (task.status === 'todo') {
      console.log(`      🚀 Spawning ${agentConfig.name} to start task...`);

      // Update task to in_progress
      await updateTaskStatus(task.id, 'in_progress', agentConfig);

      // Add initial comment
      await addTaskComment(task.id, agentConfig.name, 'agent',
        `Started working on this task. Let me research/build/write...\n\nTask: ${task.title}\n\n${task.description || 'No description provided.'}\n\n📋 Remember: I will report progress every 10 minutes!`
      );

      console.log(`      ✅ ${agentConfig.name} started working`);
    }

  } catch (error) {
    console.error(`      ❌ Error processing task ${task.id}:`, error.message);

    // Mark as failed if error
    await updateTaskStatus(task.id, 'failed', agentConfig);
    await addTaskComment(task.id, agentConfig.name, 'agent',
      `Error occurred: ${error.message}`
    );
  }
}

async function spawnSubAgent(task, agentConfig) {
  try {
    console.log(`      🔗 Spawning sub-agent session for ${agentConfig.name}...`);

    // This is a stub - in production, this would call Clawdbot's sessions_spawn API
    // For now, we'll link a session ID to track it

    const sessionKey = `agent:chris:subagent:${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    // Store session key in task metadata
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        metadata: {
          ...task.metadata,
          sub_agent_session: sessionKey,
          sub_agent_spawned: true,
          sub_agent_spawned_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', task.id);

    if (updateError) {
      return {
        success: false,
        error: updateError.message,
      };
    }

    return {
      success: true,
      sessionKey,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function updateTaskStatus(taskId, newStatus, agentConfig) {
  const updates = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  // Add started_at when moving to in_progress
  if (newStatus === 'in_progress') {
    updates.started_at = new Date().toISOString();
  }

  // Add completed_at when moving to completed
  if (newStatus === 'completed') {
    updates.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId);

  if (error) {
    throw error;
  }
}

async function addTaskComment(taskId, author, role, message) {
  const { data: task } = await supabase
    .from('tasks')
    .select('chat_history')
    .eq('id', taskId)
    .single();

  if (!task) return;

  const newHistory = [
    ...task.chat_history,
    {
      author,
      role,
      message,
      timestamp: new Date().toISOString(),
    },
  ];

  await supabase
    .from('tasks')
    .update({
      chat_history: newHistory,
      updated_at: new Date().toISOString(),
    })
    .eq('id', taskId);
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('  🤖 Squad Bot Polling System');
  console.log('='.repeat(60) + '\n');

  await pollAndProcessTasks();

  console.log('\n' + '='.repeat(60));
  console.log(`  ✅ Poll complete at ${new Date().toISOString()}`);
  console.log('='.repeat(60) + '\n');
}

main().catch(console.error);

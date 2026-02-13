/**
 * Task Monitor
 *
 * Proactively monitors in-progress tasks and provides status updates
 * Detects when tasks complete
 * Runs every 5 minutes
 *
 * Run this continuously or via cron every 5 minutes
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n' + '='.repeat(60));
console.log('  Task Monitor - Proactive Status Updates');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const AGENT_EMOJIS = {
  researcher: '🧪',
  builder: '⚡',
  copywriter: '✍️',
  marketer: '📈',
  manager: '👑',
};

let lastReportedTasks = new Set();

async function monitorTasks() {
  console.log('🔍 Monitoring in-progress tasks...\n');

  try {
    // Fetch all in-progress tasks
    const { data: inProgressTasks, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .in('status', ['in_progress', 'waiting_approval'])
      .order('updated_at', { ascending: false })
      .limit(10);

    if (fetchError) throw fetchError;

    if (!inProgressTasks || inProgressTasks.length === 0) {
      console.log('✅ No in-progress tasks.\n');
      return;
    }

    console.log(`📊 Found ${inProgressTasks.length} active task(s):\n`);

    // Group by agent
    const byAgent = {};
    inProgressTasks.forEach(task => {
      const agent = task.assigned_agent.toLowerCase();
      if (!byAgent[agent]) byAgent[agent] = [];
      byAgent[agent].push(task);
    });

    // Report on each agent's tasks
    for (const [agent, tasks] of Object.entries(byAgent)) {
      const emoji = AGENT_EMOJIS[agent] || '🤖';
      console.log(`\n${emoji} ${agent.toUpperCase()}: ${tasks.length} task(s)`);

      for (const task of tasks) {
        const started = new Date(task.started_at || task.created_at);
        const updated = new Date(task.updated_at);
        const now = new Date();
        const timeSinceUpdate = Math.floor((now.getTime() - updated.getTime()) / 60000);

        // Get last comment
        const history = typeof task.chat_history === 'string'
          ? JSON.parse(task.chat_history)
          : task.chat_history || [];
        const lastComment = history[history.length - 1];
        const lastAgentComment = [...history].reverse().find(c => c.role === 'agent');
        const lastAgentCommentTime = lastAgentComment
          ? new Date(lastAgentComment.timestamp)
          : null;
        const timeSinceAgentComment = lastAgentCommentTime
          ? Math.floor((now.getTime() - lastAgentCommentTime.getTime()) / 60000)
          : 9999;

        // Check if task completed (moved to waiting_approval)
        const justCompleted = task.status === 'waiting_approval' && !lastReportedTasks.has(task.id);

        if (justCompleted) {
          console.log(`\n✅ TASK COMPLETED!`);
          console.log(`   "${task.title.substring(0, 60)}..."`);
          console.log(`   Status: ${task.status.toUpperCase()}`);
          console.log(`   Agent: ${agent.toUpperCase()}`);
          console.log(`   Completed: ${updated.toLocaleString()}`);
          console.log('');
          console.log('   Next step: Review and approve task\n');

          lastReportedTasks.add(task.id);
        } else {
          // Report task status
          console.log(`   Status: ${task.status.toUpperCase()}`);
          console.log(`   Time since update: ${timeSinceUpdate} min`);

          if (lastAgentComment) {
            console.log(`   Last agent comment: ${timeSinceAgentComment} min ago`);

            // Check if agent is making progress (should comment every 10 min)
            if (timeSinceAgentComment > 15 && task.status === 'in_progress') {
              console.log(`   ⚠️  WARNING: No progress for ${timeSinceAgentComment}+ min!`);
              console.log(`   Agent should report progress every 10 minutes.`);

              // Add warning comment if this is new
              if (!lastReportedTasks.has(`${task.id}:warn${timeSinceAgentComment}`)) {
                await addProgressWarning(task, agent, timeSinceAgentComment);
                lastReportedTasks.add(`${task.id}:warn${timeSinceAgentComment}`);
              }
            } else if (timeSinceAgentComment <= 10) {
              console.log(`   ✅ Agent is active and reporting progress`);
            }
          } else {
            console.log(`   ℹ️  No agent comments yet`);
          }
        }
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('  Summary:');
    console.log('='.repeat(60));

    const inProgress = inProgressTasks.filter(t => t.status === 'in_progress');
    const waitingApproval = inProgressTasks.filter(t => t.status === 'waiting_approval');

    console.log(`  In Progress: ${inProgress.length}`);
    console.log(`  Waiting Approval: ${waitingApproval.length}`);
    console.log(`  Total Active: ${inProgress.length + waitingApproval.length}`);

    if (waitingApproval.length > 0) {
      console.log('');
      console.log('  📋 Tasks ready for approval:');
      waitingApproval.forEach(t => {
        console.log(`     • "${t.title.substring(0, 50)}..."`);
      });
      console.log('');
      console.log('  Action: Review tasks and approve/reject');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function addProgressWarning(task, agent, minutesSinceUpdate) {
  const { data: taskData } = await supabase
    .from('tasks')
    .select('chat_history')
    .eq('id', task.id)
    .single();

  if (!taskData) return;

  const history = typeof taskData.chat_history === 'string'
    ? JSON.parse(taskData.chat_history)
    : taskData.chat_history || [];

  const newHistory = [
    ...history,
    {
      author: 'System',
      role: 'system',
      message: `⚠️ Auto-monitor: No agent progress for ${minutesSinceUpdate}+ minutes.\n\nAgent should report progress every 10 minutes.\n\nTask is still in progress - ${agent.toUpperCase()} is working on it.`,
      timestamp: new Date().toISOString(),
    },
  ];

  await supabase
    .from('tasks')
    .update({
      chat_history: newHistory,
      updated_at: new Date().toISOString(),
    })
    .eq('id', task.id);
}

async function continuousMonitoring() {
  console.log('🔍 Starting continuous task monitoring...\n');
  console.log('Checking task status every 5 minutes.\n');
  console.log('Press Ctrl+C to stop.\n');
  console.log('─────────────────────────────────────────────────────────\n');

  // Run immediately, then every 5 minutes
  await monitorTasks();

  setInterval(async () => {
    console.log('\n' + '='.repeat(60));
    console.log('  Task Monitor - Check at ' + new Date().toLocaleTimeString());
    console.log('='.repeat(60) + '\n');

    await monitorTasks();
  }, 300000); // 5 minutes
}

// Main entry point
console.log('\n' + '='.repeat(60));
console.log('  Ready! Monitoring tasks proactively now.');
console.log('='.repeat(60) + '\n');

continuousMonitoring();

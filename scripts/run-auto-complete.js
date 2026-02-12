/**
 * Auto-Complete Runner
 *
 * Runs auto-complete-tasks API every 5 minutes
 * Automatically moves "in_progress" tasks to "waiting_approval" after inactivity
 *
 * Usage: node scripts/run-auto-complete.js
 */

const API_URL = 'http://localhost:3000';
const POLL_INTERVAL_MINUTES = 5;

console.log('\n' + '='.repeat(60));
console.log('  🤖 Squad Auto-Complete Runner');
console.log('='.repeat(60) + '\n');
console.log(`  Polling ${API_URL}/api/auto-complete-tasks`);
console.log(`  Interval: Every ${POLL_INTERVAL_MINUTES} minutes`);
console.log('  Press Ctrl+C to stop.\n');

let pollCount = 0;

async function runPoll() {
  pollCount++;

  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  🔄 Poll #${pollCount} | ${timestamp}`);
  console.log('─'.repeat(60));

  try {
    const response = await fetch(`${API_URL}/api/auto-complete-tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dryRun: false }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success) {
      console.log(`\n✅ ${data.message}`);
      console.log(`   Tasks found: ${data.tasksFound}`);
      console.log(`   Tasks completed: ${data.tasksCompleted}`);

      if (data.tasksCompleted > 0 && data.tasks) {
        console.log('\n   Tasks moved to "Waiting Approval":\n');
        data.tasks.forEach((task, i) => {
          const emoji = {
            researcher: '🧪',
            builder: '⚡',
            copywriter: '✍️',
            marketer: '📈',
          }[task.assigned_agent] || '📋';

          console.log(`   ${i + 1}. ${emoji} ${task.title}`);
          console.log(`      Agent: ${task.assigned_agent}`);
          console.log(`      Inactive: ${Math.round(task.minutesSinceLastComment)} minutes`);
        });
      } else if (data.tasksCompleted === 0) {
        console.log('\n   ℹ️  No tasks ready for auto-completion');
      }
    } else {
      console.log(`\n❌ Error: ${data.error}`);
    }

    // Wait before next poll
    console.log(`\n   ⏰ Next poll in ${POLL_INTERVAL_MINUTES} minutes...`);

  } catch (error) {
    console.error('\n❌ Error in poll:', error.message);
  }

  // Schedule next poll
  setTimeout(runPoll, POLL_INTERVAL_MINUTES * 60 * 1000);
}

// Start polling
runPoll();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n' + '='.repeat(60));
  console.log('  🛑 Stopping Auto-Complete Runner');
  console.log('='.repeat(60));
  console.log(`\n  Total polls completed: ${pollCount}`);
  console.log('  Goodbye! 👋\n');

  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n' + '='.repeat(60));
  console.log('  🛑 Stopping Auto-Complete Runner');
  console.log('='.repeat(60));
  console.log(`\n  Total polls completed: ${pollCount}`);
  console.log('  Goodbye! 👋\n');

  process.exit(0);
});

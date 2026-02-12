/**
 * Start Bot Polling System Continuously
 *
 * Wrapper script to run bot-poll in a loop.
 * Use this to keep the squad agents processing tasks.
 *
 * Usage: node scripts/start-bot.js
 */

const { spawn } = require('child_process');

const POLL_INTERVAL_SECONDS = 120; // 2 minutes

console.log('\n🚀 Starting Squad Bot Polling System...');
console.log(`⏰ Polling every ${POLL_INTERVAL_SECONDS} seconds...\n`);
console.log('Press Ctrl+C to stop.\n');

let pollCount = 0;

function runPoll() {
  pollCount++;

  const timestamp = new Date().toISOString();
  const timeStr = new Date().toLocaleTimeString();

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  🔄 Poll #${pollCount} | ${timeStr}`);
  console.log('─'.repeat(60));

  const child = spawn('npm', ['run', 'bot-poll'], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`\n❌ Poll #${pollCount} failed with code ${code}`);
    }
  });
}

// Run first poll immediately
runPoll();

// Set up interval for continuous polling
const intervalId = setInterval(() => {
  runPoll();
}, POLL_INTERVAL_SECONDS * 1000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping bot polling system...');
  clearInterval(intervalId);
  console.log(`\n✅ Total polls completed: ${pollCount}`);
  console.log('Goodbye! 👋\n');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Stopping bot polling system...');
  clearInterval(intervalId);
  console.log(`\n✅ Total polls completed: ${pollCount}`);
  console.log('Goodbye! 👋\n');
  process.exit(0);
});

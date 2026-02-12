/**
 * Start Bot Polling System Continuously (Node.js version)
 *
 * Simple wrapper to run bot-poll in a loop.
 * Use this to keep squad agents processing tasks.
 *
 * Usage: node scripts/start-bot-node.js
 */

const { spawn } = require('child_process');

const POLL_INTERVAL_SECONDS = 120; // 2 minutes

console.log('');
console.log('='.repeat(60));
console.log('  Starting Squad Bot Polling System');
console.log('='.repeat(60));
console.log(`  Polling every ${POLL_INTERVAL_SECONDS} seconds...`);
console.log('  Press Ctrl+C to stop.');
console.log('');

let pollCount = 0;

function runPoll() {
  pollCount++;

  const timestamp = new Date().toISOString();
  const timeStr = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  console.log('');
  console.log('-'.repeat(60));
  console.log(`  Poll #${pollCount} | ${timeStr}`);
  console.log('-'.repeat(60));

  const child = spawn('npm', ['run', 'bot-poll'], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('close', (code) => {
    if (code !== 0) {
      console.error('');
      console.error(`  Poll #${pollCount} failed with code ${code}`);
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
function shutdown() {
  console.log('');
  console.log('');
  console.log('  Stopping bot polling system...');
  clearInterval(intervalId);
  console.log(`  Total polls completed: ${pollCount}`);
  console.log('  Goodbye!');
  console.log('');
  console.log('='.repeat(60));
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Keep process running
console.log('');
console.log('Bot is running... Waiting for next poll in 2 minutes.');
console.log('');

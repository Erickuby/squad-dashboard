/**
 * Test Squad State API with Curl
 *
 * Tests the squad-state API endpoint directly
 */

async function testSquadState() {
  console.log('\n' + '='.repeat(60));
  console.log('  Testing Squad State API (Direct)');
  console.log('='.repeat(60) + '\n');

  try {
    const response = await fetch('http://localhost:3000/api/squad-state?t=' + Date.now(), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, response.statusText);
      process.exit(1);
    }

    const data = await response.json();

    console.log('API Response:');
    console.log('─'.repeat(60));
    console.log('Last Updated:', data.lastUpdated);
    console.log('Version:', data.version);
    console.log('');

    console.log('Agent Status:');
    console.log('─'.repeat(60));

    Object.entries(data.members).forEach(([key, agent]) => {
      console.log(`\n${agent.emoji} ${agent.name}`);
      console.log(`   Role: ${agent.role}`);
      console.log(`   Status: ${agent.status.toUpperCase()}`);
      if (agent.currentTask) {
        console.log(`   Current Task: ${agent.currentTask}`);
      }
      if (agent.taskId) {
        console.log(`   Task ID: ${agent.taskId}`);
      }
      if (agent.sessionKey) {
        console.log(`   Session Key: ${agent.sessionKey}`);
      }
      if (agent.blockers && agent.blockers.length > 0) {
        console.log(`   Blockers: ${agent.blockers.join(', ')}`);
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log('  Summary:');
    console.log('='.repeat(60));

    const working = Object.values(data.members).filter(a => a.status === 'working');
    const available = Object.values(data.members).filter(a => a.status === 'available');
    const blocked = Object.values(data.members).filter(a => a.status === 'blocked');
    const review = Object.values(data.members).filter(a => a.status === 'review');

    console.log(`  Working: ${working.length} (${working.map(a => a.name).join(', ') || 'none'})`);
    console.log(`  Available: ${available.length} (${available.map(a => a.name).join(', ')})`);
    console.log(`  Blocked: ${blocked.length} (${blocked.map(a => a.name).join(', ') || 'none'})`);
    console.log(`  Review: ${review.length} (${review.map(a => a.name).join(', ') || 'none'})`);
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSquadState();

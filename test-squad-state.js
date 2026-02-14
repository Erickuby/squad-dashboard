/**
 * Test Squad State API
 *
 * Checks what the API is returning
 */

async function testSquadState() {
  console.log('\n' + '='.repeat(60));
  console.log('  Testing Squad State API');
  console.log('='.repeat(60) + '\n');

  try {
    // Add timestamp to bust cache
    const response = await fetch('http://localhost:3000/api/squad-state?t=' + Date.now(), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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

    if (working.length === 0) {
      console.log('⚠️  WARNING: No agents showing as "working"');
      console.log('    But we know Researcher has a task "in_progress"!');
      console.log('    This indicates an API or caching issue.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSquadState();

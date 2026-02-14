/**
 * Check Active Sub-Agent Sessions
 *
 * Checks if Researcher sub-agent is actually running
 */

async function checkSessions() {
  console.log('\n' + '='.repeat(60));
  console.log('  Checking Active Sub-Agent Sessions');
  console.log('='.repeat(60) + '\n');

  try {
    // List active sessions
    const response = await fetch('http://localhost:3000/api/sessions?active=true', {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.log('⚠️  No API endpoint for session checking');
      console.log('   This is expected - sessions are internal.');
      return;
    }

    const data = await response.json();

    console.log('Active Sessions:', data.length);
    console.log('');

    data.forEach(session => {
      console.log(`  Session: ${session.sessionKey}`);
      console.log(`  Agent: ${session.agentId}`);
      console.log(`  Created: ${session.createdAt}`);
      console.log(`  Status: ${session.status}`);
      console.log('');
    });

  } catch (error) {
    console.log('⚠️  Cannot check sub-agent sessions (internal API)');
    console.log('   This is expected behavior.\n');
  }

  console.log('What This Means:');
  console.log('─'.repeat(60));
  console.log('  If Researcher is stuck:');
  console.log('  1. Sub-agent session may have failed silently');
  console.log('  2. No error reporting in place');
  console.log('  3. Task shows "in_progress" but no actual work\n');

  console.log('  If Researcher is working normally:');
  console.log('  1. Agent works for extended periods without comments');
  console.log('  2. Will add comment when research phase completes');
  console.log('  3. This is normal for deep research tasks\n');

  console.log('Recommendation:');
  console.log('─'.repeat(60));
  console.log('  1. Wait another 30-60 minutes');
  console.log('  2. Check for new comments');
  console.log('  3. If still no progress, reassign or task may need restart\n');
}

checkSessions();

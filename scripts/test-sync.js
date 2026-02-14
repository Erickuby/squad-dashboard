const fetch = require('node-fetch');

async function testSync() {
    try {
        const response = await fetch('http://localhost:3000/api/sync-notion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId: 'task-001' })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testSync();

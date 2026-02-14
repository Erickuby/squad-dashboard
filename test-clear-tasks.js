const http = require('http');

const postData = JSON.stringify({
  agent: 'copywriter'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/clear-tasks',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.write(postData);
req.end();

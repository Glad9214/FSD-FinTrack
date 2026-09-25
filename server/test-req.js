const http = require('http');

const data = JSON.stringify({
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'password123'
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();

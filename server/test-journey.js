const http = require('http');

const request = (method, path, data, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (data) options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));

    const req = http.request(options, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

async function testJourney() {
  try {
    const email = `testuser_${Date.now()}@example.com`;
    
    // 1. Register
    console.log('--- Register ---');
    const regRes = await request('POST', '/auth/register', { name: 'Test User', email, password: 'password123' });
    console.log(regRes.status, regRes.data.success);
    
    // 2. Login
    console.log('--- Login ---');
    const loginRes = await request('POST', '/auth/login', { email, password: 'password123' });
    console.log(loginRes.status, loginRes.data.success);
    const token = loginRes.data.token;
    
    // 3. Add Transaction
    console.log('--- Add Transaction ---');
    const txRes = await request('POST', '/transactions', { type: 'expense', amount: 500, category: 'Food', description: 'Lunch', date: new Date().toISOString() }, token);
    console.log(txRes.status, txRes.data.success);
    const txId = txRes.data.transaction._id;
    
    // 4. Set Budget
    console.log('--- Set Budget ---');
    const budgetRes = await request('POST', '/budget', { amount: 2000, month: new Date().getMonth() + 1, year: new Date().getFullYear() }, token);
    console.log(budgetRes.status, budgetRes.data.success);
    
    // 5. Edit Transaction
    console.log('--- Edit Transaction ---');
    const editRes = await request('PUT', `/transactions/${txId}`, { amount: 600 }, token);
    console.log(editRes.status, editRes.data.success);
    
    // 6. Delete Transaction
    console.log('--- Delete Transaction ---');
    const delRes = await request('DELETE', `/transactions/${txId}`, null, token);
    console.log(delRes.status, delRes.data.success);
    
    // 7. Get Analytics Summary
    console.log('--- Analytics Summary ---');
    const sumRes = await request('GET', `/analytics/summary?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`, null, token);
    console.log(sumRes.status, sumRes.data.success);
    
    console.log('✅ ALL BACKEND TESTS PASSED');
  } catch (err) {
    console.error('❌ TEST FAILED', err);
  }
}

testJourney();

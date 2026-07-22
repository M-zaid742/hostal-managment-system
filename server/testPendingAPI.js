import fetch from 'node-fetch';

const testPendingAPI = async () => {
  try {
    // First get token
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin7173@gmail.com', password: 'zaid1234' })
    });
    
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    console.log('✅ Got token');
    
    // Now test pending endpoint
    const pendingRes = await fetch('http://localhost:5000/api/admin/hostels/pending', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Pending response status:', pendingRes.status);
    
    const textBody = await pendingRes.text();
    console.log('Response body:', textBody);
    
    if (textBody) {
      const parsed = JSON.parse(textBody);
      console.log('Parsed response:', JSON.stringify(parsed, null, 2));
      console.log('Count:', Array.isArray(parsed) ? parsed.length : '(not an array)');
    }
    
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
};

testPendingAPI();

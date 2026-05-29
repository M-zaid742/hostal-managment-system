import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const jwtSecret = 'dev_secret';

// Create admin JWT token
const token = jwt.sign(
  { id: 1, role: 'admin', email: 'admin7173@gmail.com' },
  jwtSecret,
  { expiresIn: '7d' }
);

console.log('Testing admin endpoints...\n');

async function testEndpoints() {
  try {
    // Test approved hostels
    console.log('Testing GET /api/admin/hostels/approved...');
    const approvedRes = await fetch('http://localhost:5000/api/admin/hostels/approved', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (approvedRes.ok) {
      const data = await approvedRes.json();
      console.log(`✅ Got ${data.length} approved hostels\n`);
      if (data.length > 0) {
        console.log('Sample hostel:', JSON.stringify(data[0], null, 2));
      }
    } else {
      console.log(`❌ Error: ${approvedRes.status} ${approvedRes.statusText}`);
      const error = await approvedRes.text();
      console.log('Response:', error);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testEndpoints();

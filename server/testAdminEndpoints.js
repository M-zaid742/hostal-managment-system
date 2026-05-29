import fetch from 'node-fetch';

// First, get the admin token
const loginRes = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin7173@gmail.com', password: 'zaid1234' })
});

const loginData = await loginRes.json();
const token = loginData.token;

console.log('✅ Got token:', token ? 'Success' : 'Failed');

// Now test the admin endpoints
const pendingRes = await fetch('http://localhost:5000/api/admin/hostels/pending', {
  headers: { 'Authorization': `Bearer ${token}` }
});

console.log('Pending response status:', pendingRes.status);
console.log('Pending response:', await pendingRes.json());

const approvedRes = await fetch('http://localhost:5000/api/admin/hostels/approved', {
  headers: { 'Authorization': `Bearer ${token}` }
});

console.log('Approved response status:', approvedRes.status);
console.log('Approved response:', await approvedRes.json());

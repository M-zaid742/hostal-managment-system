import fetch from 'node-fetch';

const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin7173@gmail.com', password: 'zaid1234' })
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.log('Error:', err.message);
  }
};

testLogin();

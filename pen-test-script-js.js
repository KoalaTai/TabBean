const axios = require('axios');

const API_URL = 'http://localhost:3000/api'; // Replace with your actual API URL

async function runPenTest() {
  console.log('Starting penetration test...');

  // Test 1: Attempt to access protected route without authentication
  try {
    await axios.get(`${API_URL}/tabs`);
    console.log('❌ Unauthenticated access to protected route possible');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Protected route properly secured');
    } else {
      console.log('❌ Unexpected error when accessing protected route:', error.message);
    }
  }

  // Test 2: SQL Injection attempt
  try {
    await axios.post(`${API_URL}/tabs`, {
      url: "'; DROP TABLE users; --",
      title: 'Malicious Title'
    });
    console.log('❌ Potential SQL injection vulnerability');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ SQL injection attempt blocked');
    } else {
      console.log('❌ Unexpected error during SQL injection test:', error.message);
    }
  }

  // Test 3: XSS attempt
  try {
    await axios.post(`${API_URL}/knowledge-base`, {
      title: '<script>alert("XSS")</script>',
      content: 'Malicious content'
    });
    console.log('❌ Potential XSS vulnerability');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ XSS attempt blocked');
    } else {
      console.log('❌ Unexpected error during XSS test:', error.message);
    }
  }

  // Test 4: Brute force login attempt
  const attempts = 10;
  let blocked = false;
  for (let i = 0; i < attempts; i++) {
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'wrong_password'
      });
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log('✅ Brute force attempt blocked after', i + 1, 'attempts');
        blocked = true;
        break;
      }
    }
  }
  if (!blocked) {
    console.log('❌ No protection against brute force attacks detected');
  }

  console.log('Penetration test completed.');
}

runPenTest();

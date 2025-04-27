import fetch from 'node-fetch';

async function testAdminLogin() {
  try {
    console.log('Testing admin login API...');
    
    const response = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'jefe',
        password: 'instacabo'
      })
    });
    
    console.log('Status:', response.status);
    
    if (response.ok) {
      const userData = await response.json();
      console.log('Login successful!');
      console.log('User data:', userData);
    } else {
      let errorText = 'Login failed';
      try {
        const errorData = await response.json();
        errorText = errorData.message || errorText;
      } catch (e) {
        // If we can't parse JSON
        errorText = await response.text();
      }
      console.error('Login error:', errorText);
    }
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

testAdminLogin();
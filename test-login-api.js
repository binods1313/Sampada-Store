// Direct test of the verify-admin endpoint
const fetch = require('node-fetch');

async function testLogin() {
  console.log('Testing admin login...\n');
  
  const email = 'admin@sampada.com';
  const password = 'admin123';
  
  console.log('Credentials:');
  console.log('  Email:', email);
  console.log('  Password:', password);
  console.log();
  
  try {
    const response = await fetch('http://localhost:3000/api/verify-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ LOGIN SUCCESSFUL!');
    } else {
      console.log('\n❌ LOGIN FAILED!');
      if (data.debug) {
        console.log('\nDebug info:');
        console.log('  emailMatch:', data.debug.emailMatch);
        console.log('  passwordMatch:', data.debug.passwordMatch);
        console.log('  envEmail:', data.debug.envEmail);
        console.log('  envHashLength:', data.debug.envHashLength);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();

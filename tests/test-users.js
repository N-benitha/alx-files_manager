// Test script for POST /users endpoint
const baseURL = 'http://localhost:5000';

async function testCreateUser() {
  console.log('🧪 Testing POST /users endpoint...\n');

  // Test 1: Valid user creation
  console.log('1️⃣  Testing valid user creation:');
  try {
    const response = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    console.log('✅ Should return status 201 with id and email\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test 2: Missing email
  console.log('2️⃣  Testing missing email:');
  try {
    const response = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: 'password123'
      }),
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    console.log('✅ Should return status 400 with "Missing email"\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test 3: Missing password
  console.log('3️⃣  Testing missing password:');
  try {
    const response = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test2@example.com'
      }),
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    console.log('✅ Should return status 400 with "Missing password"\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test 4: Duplicate user
  console.log('4️⃣  Testing duplicate user:');
  try {
    const response = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com', // Same email as test 1
        password: 'password456'
      }),
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    console.log('✅ Should return status 400 with "Already exist"\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run tests
testCreateUser();

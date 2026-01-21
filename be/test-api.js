// Simple test without external dependencies
const http = require('http');

function testLogin() {
  const postData = JSON.stringify({
    username: 'admin',
    password: 'admin123',
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  console.log('Testing login endpoint...');
  console.log('Request data:', postData);

  const req = http.request(options, res => {
    let data = '';

    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    res.on('data', chunk => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('\nResponse:');
      try {
        const jsonData = JSON.parse(data);
        console.log(JSON.stringify(jsonData, null, 2));
      } catch (e) {
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', error => {
    console.error('Error:', error.message);
  });

  req.write(postData);
  req.end();
}

// Test GET endpoint juga
function testGetDivisions() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/divisions',
    method: 'GET',
  };

  console.log('\nTesting GET divisions endpoint...');

  const req = http.request(options, res => {
    let data = '';

    console.log(`Status Code: ${res.statusCode}`);

    res.on('data', chunk => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('\nResponse:');
      try {
        const jsonData = JSON.parse(data);
        console.log(`Found ${jsonData.data?.length || 0} divisions`);
      } catch (e) {
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', error => {
    console.error('Error:', error.message);
  });

  req.end();
}

// Run tests
console.log('='.repeat(50));
console.log('Starting API Tests');
console.log('='.repeat(50));

testLogin();

setTimeout(() => {
  testGetDivisions();
}, 1000);

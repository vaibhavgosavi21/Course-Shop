const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testBackend() {
  console.log('🧪 Testing Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health Check:', health.data);
    console.log('');

    // Test 2: Register Student
    console.log('2️⃣ Testing Student Registration...');
    const registerData = {
      name: 'Test Student',
      email: `test${Date.now()}@example.com`,
      mobile: '9876543210',
      password: 'test123',
      role: 'student'
    };
    
    try {
      const register = await axios.post(`${API_URL}/auth/register`, registerData);
      console.log('✅ Registration Success:', {
        token: register.data.token ? 'Token received' : 'No token',
        user: register.data.user
      });
      console.log('');

      // Test 3: Login
      console.log('3️⃣ Testing Login...');
      const login = await axios.post(`${API_URL}/auth/login`, {
        email: registerData.email,
        password: registerData.password,
        role: 'student'
      });
      console.log('✅ Login Success:', {
        token: login.data.token ? 'Token received' : 'No token',
        user: login.data.user
      });
      console.log('');

    } catch (error) {
      console.log('❌ Registration/Login Error:', error.response?.data || error.message);
      console.log('');
    }

    // Test 4: Admin Login
    console.log('4️⃣ Testing Admin Login...');
    try {
      const adminLogin = await axios.post(`${API_URL}/auth/login`, {
        email: 'admin@courseplatform.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin Login Success:', {
        token: adminLogin.data.token ? 'Token received' : 'No token',
        user: adminLogin.data.user
      });
    } catch (error) {
      console.log('❌ Admin Login Error:', error.response?.data?.message || error.message);
      console.log('💡 Run: node createAdmin.js to create admin user');
    }
    console.log('');

    console.log('✅ All tests completed!');

  } catch (error) {
    console.log('❌ Backend Test Failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure backend server is running: npm run dev');
    console.log('2. Check if MongoDB is connected');
    console.log('3. Verify .env file exists with correct values');
    console.log('4. Check if port 5001 is available');
  }
}

testBackend();

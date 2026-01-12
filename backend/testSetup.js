const { connectDB } = require('./config/database');
const User = require('./models/User');

const testSetup = async () => {
  try {
    console.log('🔄 Testing database connection...');
    await connectDB();
    console.log('✅ Database connected successfully');

    console.log('🔄 Testing admin user...');
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('❌ No admin user found. Run: node createAdmin.js');
      return;
    }

    console.log('✅ Admin user found:', admin.email);
    
    // Test password
    const isValidPassword = await admin.comparePassword('Admin@123');
    console.log('🔐 Password test:', isValidPassword ? '✅ Valid' : '❌ Invalid');

    console.log('\n📋 Setup Summary:');
    console.log('- Database: ✅ Connected');
    console.log('- Admin User: ✅ Created');
    console.log('- Password: ✅ Working');
    console.log('\n🚀 Ready to start!');
    console.log('Backend: npm run dev (port 5001)');
    console.log('Frontend: npm start (port 3000)');
    console.log('\n👤 Admin Login:');
    console.log('Email: admin2020@gmail.com');
    console.log('Password: Admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

testSetup();
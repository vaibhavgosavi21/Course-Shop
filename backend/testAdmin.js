const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const testAdminLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ No admin user found');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Name:', admin.name);

    // Test password
    const testPassword = 'Admin@123';
    const isPasswordValid = await admin.comparePassword(testPassword);
    console.log('Password test result:', isPasswordValid ? '✅ Valid' : '❌ Invalid');

    if (!isPasswordValid) {
      console.log('🔧 Updating admin password...');
      admin.password = testPassword;
      await admin.save();
      console.log('✅ Password updated successfully');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testAdminLogin();
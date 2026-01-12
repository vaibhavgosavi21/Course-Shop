const { connectDB } = require('./config/database');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to database');

    await User.deleteOne({ role: 'admin' });
    console.log('🗑️ Deleted existing admin');

    const admin = new User({
      name: 'Admin User',
      email: 'admin@courseplatform.com',
      mobile: '9876543210',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin created successfully');
    console.log('📧 Email: admin@courseplatform.com');
    console.log('🔑 Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
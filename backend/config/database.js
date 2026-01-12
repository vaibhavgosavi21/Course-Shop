const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    console.log('\n🔧 Fix MongoDB Atlas Connection:');
    console.log('1. Go to https://cloud.mongodb.com/');
    console.log('2. Navigate to Network Access');
    console.log('3. Click "Add IP Address"');
    console.log('4. Add your current IP or use 0.0.0.0/0 for all IPs');
    console.log('5. Restart the server\n');
    process.exit(1);
  }
};

module.exports = { connectDB };
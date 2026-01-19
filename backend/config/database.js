const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    console.log('\n🔄 Trying local MongoDB...');
    
    try {
      const localConn = await mongoose.connect('mongodb://localhost:27017/course-platform', {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`✅ Local MongoDB Connected: ${localConn.connection.host}`);
    } catch (localError) {
      console.error('❌ Local MongoDB also failed:', localError.message);
      console.log('\n🔧 Fix Options:');
      console.log('\nOption 1 - Fix MongoDB Atlas:');
      console.log('1. Go to https://cloud.mongodb.com/');
      console.log('2. Navigate to Network Access');
      console.log('3. Click "Add IP Address"');
      console.log('4. Add 0.0.0.0/0 (Allow from anywhere)');
      console.log('5. Wait 2-3 minutes and restart server\n');
      console.log('Option 2 - Use Local MongoDB:');
      console.log('1. Install MongoDB Community: https://www.mongodb.com/try/download/community');
      console.log('2. Start MongoDB service');
      console.log('3. Restart this server\n');
      process.exit(1);
    }
  }
};

module.exports = { connectDB };
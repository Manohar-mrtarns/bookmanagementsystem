import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('\n📝 Setup Instructions:');
    console.error('1. Install MongoDB locally OR create MongoDB Atlas account');
    console.error('2. Update MONGODB_URI in server/.env');
    console.error('3. See server/MONGODB_SETUP.md for detailed instructions');
    console.error('\nServer will continue running but API calls will fail until MongoDB is connected.\n');
    
    // Don't exit - allow server to run for development
    // This gives users time to set up MongoDB
    return null;
  }
};

export default connectDB;

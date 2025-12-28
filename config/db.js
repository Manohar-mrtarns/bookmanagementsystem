import mongoose from 'mongoose';

const getMongoUri = () =>
  process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGODB_URL;

const cached = globalThis.__mongooseConn || { conn: null, promise: null };
globalThis.__mongooseConn = cached;

const connectDB = async () => {
  try {
    const mongoUri = getMongoUri();
    if (!mongoUri) {
      console.error('❌ MongoDB Connection Error: Missing MongoDB connection string');
      console.error('Set MONGODB_URI (or MONGO_URI) in environment variables');
      return null;
    }

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      cached.promise = mongoose
        .connect(mongoUri, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        })
        .then((m) => m);
    }

    cached.conn = await cached.promise;
    console.log(`✅ MongoDB Connected: ${cached.conn.connection.host}`);
    return cached.conn;
  } catch (error) {
    cached.conn = null;
    cached.promise = null;
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

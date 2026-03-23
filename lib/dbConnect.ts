import mongoose from "mongoose";

let isConnected = false;

const dbConnect = async () => {
  if (isConnected) {
    console.log('MongoDB already connected');
    return;
  }

  // Use environment variable or fallback to localhost
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';

  try {
    console.log('Attempting MongoDB connection...');
    await mongoose.connect(mongoUri, {
      dbName: "onixtest",
    });

    isConnected = true;
    console.log('✅ MongoDB connected successfully to onix database');
  } catch (error) {
    // Always log connection errors - this is critical
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ MongoDB connection error:', errorMessage);
    console.error('MongoDB URI (masked):', mongoUri.replace(/\/\/.*@/, '//<credentials>@'));

    // Re-throw the error so API routes know the connection failed
    throw new Error(`Database connection failed: ${errorMessage}`);
  }
};

export default dbConnect;

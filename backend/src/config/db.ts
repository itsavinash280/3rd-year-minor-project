import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const isMongoConnected = (): boolean => mongoose.connection.readyState === 1;

export const connectDB = async (): Promise<void> => {
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/asraverse';
  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`[MongoDB] Running in fallback in-memory mode (DB unavailable: ${error?.message || error})`);
  }
};

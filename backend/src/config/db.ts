import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const isMongoConnected = (): boolean => mongoose.connection.readyState === 1;

let isConnecting = false;

export const connectDB = async (): Promise<void> => {
  // Return early if already connected or connecting
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  if (isConnecting) {
    return;
  }

  const connUri = process.env.MONGODB_URI;

  // On Vercel serverless, don't attempt to connect to localhost if MONGODB_URI is not configured
  if (!connUri || connUri.includes('127.0.0.1') || connUri.includes('localhost')) {
    if (process.env.VERCEL) {
      console.warn('[MongoDB] No cloud MONGODB_URI configured for Vercel. Running in serverless resilient mode with Supabase fallback.');
      return;
    }
  }

  const targetUri = connUri || 'mongodb://127.0.0.1:27017/asraverse';

  try {
    isConnecting = true;
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`[MongoDB] Running in fallback mode (DB unavailable: ${error?.message || error})`);
  } finally {
    isConnecting = false;
  }
};

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const connectDB = async () => {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/asraverse';
    try {
        const conn = await mongoose.connect(connUri);
        console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    }
    catch (error) {
        console.warn(`[MongoDB] Connection warning (running in fallback in-memory mode if DB unavailable):`, error);
    }
};

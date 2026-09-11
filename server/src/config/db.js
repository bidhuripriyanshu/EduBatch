import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  // Reuse existing database connection in serverless environments (e.g. Vercel)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[MongoDB Atlas Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
  }
};

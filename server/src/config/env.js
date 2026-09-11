import dotenv from 'dotenv';
import path from 'path';

// Load .env from root server directory or src directory
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'src/.env') });

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/edubatch',
  jwtSecret: process.env.JWT_SECRET || 'edubatch_access_secret_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'edubatch_refresh_secret_key_2026',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};

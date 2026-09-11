import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import { errorHandler } from './middleware/error.js';
import { AppError } from './utils/AppError.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import batchRoutes from './routes/batchRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

// 1. Helmet Security Middleware for HTTP Headers
app.use(helmet());

// 2. Flexible CORS Configuration for Production & Development
const rawClientUrl = config.clientUrl ? config.clientUrl.replace(/\/$/, '') : '';
const allowedOrigins = [
  rawClientUrl,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, postman, curl) or matching origins
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        config.nodeEnv === 'development'
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Error: Origin ${origin} not allowed by CORS policy.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Body & Cookie Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// 4. Root Welcome Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '🚀 EduBatch LMS Express API Backend Server is running successfully!',
    version: '1.0.0',
    documentation: {
      healthCheck: '/api/health',
      apiBase: '/api/v1',
    },
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 5. Rate Limiting for API Endpoints
app.use('/api/v1', apiLimiter);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/batches', batchRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/enrollments', enrollmentRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/notices', noticeRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Unhandled Route Handler (Express 5 compatible wildcard)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;

import { z } from 'zod';

// Auth Validation Schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'teacher', 'admin']).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// Batch Validation Schemas
export const createBatchSchema = z.object({
  name: z.string().min(3, 'Batch name is required'),
  subject: z.string().min(2, 'Subject is required'),
  fee: z.number().positive('Fee must be a positive number').or(z.string().regex(/^\d+$/).transform(Number)),
  teacherId: z.string().min(1, 'Teacher ID is required').optional(),
  description: z.string().optional(),
  capacity: z.number().optional(),
  category: z.string().optional(),
  schedule: z.object({
    days: z.array(z.string()).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }).optional(),
});

// Notice Validation Schemas
export const createNoticeSchema = z.object({
  title: z.string().min(3, 'Notice title is required'),
  body: z.string().min(5, 'Notice body content is required'),
  batchId: z.string().nullable().optional(),
  pinned: z.boolean().optional(),
  sendEmail: z.boolean().optional(),
});

// Payment Validation Schemas
export const createOrderSchema = z.object({
  enrollmentId: z.string().optional(),
  batchId: z.string().optional(),
  amount: z.number().positive('Amount must be greater than 0').optional(),
});

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1, 'razorpayOrderId is required'),
  razorpayPaymentId: z.string().min(1, 'razorpayPaymentId is required'),
  razorpaySignature: z.string().min(1, 'razorpaySignature is required'),
  enrollmentId: z.string().optional(),
});

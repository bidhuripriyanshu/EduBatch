import express from 'express';
import { 
  register, 
  login, 
  refresh, 
  logout,
  forgotPassword, 
  resetPassword, 
  updatePassword,
  getMe 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} from '../validators/schemas.js';

const router = express.Router();

// Optional auth middleware so register can detect if an admin is creating the account
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

// Rate limited & Zod validated Auth Routes
router.post('/register', authLimiter, optionalAuth, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', validate(refreshSchema), refresh);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.patch('/update-password', protect, validate(updatePasswordSchema), updatePassword);

export default router;

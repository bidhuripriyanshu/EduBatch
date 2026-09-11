import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { config } from '../config/env.js';
import { sendEmail } from '../services/emailService.js';

// Helper to sign Access & Refresh Tokens
const signTokens = (id) => {
  const accessToken = jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn, // Short-lived (15m)
  });

  const refreshToken = jwt.sign({ id }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn, // Longer-lived (7d)
  });

  return { accessToken, refreshToken };
};

// Helper to send HTTP-Only Secure Cookie for Refresh Token
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// 1. POST /auth/register
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, phone, avatar } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email is already registered', 400));
  }

  // Force role to 'student' unless an admin creates the user
  let assignedRole = 'student';
  if (req.user && req.user.role === 'admin' && role) {
    assignedRole = role;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: assignedRole,
    phone,
    avatar,
  });

  const tokens = signTokens(user._id);

  // Save refresh token to user document and set HTTP-only cookie
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  setRefreshTokenCookie(res, tokens.refreshToken);

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    },
  });
});

// 2. POST /auth/login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 403));
  }

  const tokens = signTokens(user._id);

  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  setRefreshTokenCookie(res, tokens.refreshToken);

  res.status(200).json({
    status: 'success',
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    },
  });
});

// 3. POST /auth/refresh - Refresh & Token Rotation
export const refresh = asyncHandler(async (req, res, next) => {
  // Read token from httpOnly cookie or request body fallback
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    return next(new AppError('Refresh token is required', 400));
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
  } catch (err) {
    return next(new AppError('Invalid or expired refresh token. Please log in again.', 401));
  }

  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || user.refreshToken !== refreshToken) {
    return next(new AppError('Invalid refresh token session', 401));
  }

  // Token Rotation: Generate NEW access and NEW refresh tokens
  const newTokens = signTokens(user._id);

  // Update stored refresh token in DB
  user.refreshToken = newTokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  // Update httpOnly cookie with newly rotated refresh token
  setRefreshTokenCookie(res, newTokens.refreshToken);

  res.status(200).json({
    status: 'success',
    data: {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    },
  });
});

// 4. POST /auth/logout
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });
      }
    } catch (e) {
      // Ignore token verification errors during logout
    }
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

// 5. POST /auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Please provide an email address', 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('No user found with that email address', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${config.clientUrl}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'EduBatch Password Reset Token',
      body: `Forgot your password? Submit your new password using this token: ${resetToken} or URL: ${resetURL}`,
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to email!',
      resetToken, // Included for development/testing convenience
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Error sending reset email. Try again later.', 500));
  }
});

// 6. POST /auth/reset-password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return next(new AppError('Reset token and new password are required', 400));
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const tokens = signTokens(user._id);
  setRefreshTokenCookie(res, tokens.refreshToken);

  res.status(200).json({
    status: 'success',
    message: 'Password successfully reset!',
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
  });
});

// 7. PATCH /auth/update-password
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide currentPassword and newPassword', 400));
  }

  if (newPassword.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user || !(await user.comparePassword(currentPassword, user.password))) {
    return next(new AppError('Your current password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save(); // Triggers bcrypt pre-save hook with 12 salt rounds

  const tokens = signTokens(user._id);
  setRefreshTokenCookie(res, tokens.refreshToken);

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully!',
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
  });
});

// 8. GET /auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

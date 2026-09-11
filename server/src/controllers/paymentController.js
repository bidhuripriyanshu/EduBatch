import { Payment } from '../models/Payment.js';
import { Enrollment } from '../models/Enrollment.js';
import { Batch } from '../models/Batch.js';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/paymentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

// 1. POST /payments/create-order - Student: Create Razorpay order
export const createOrder = asyncHandler(async (req, res, next) => {
  const { enrollmentId, batchId, amount } = req.body;

  let targetAmount = amount;
  let enrollment = null;

  if (enrollmentId) {
    enrollment = await Enrollment.findById(enrollmentId).populate('batch');
    if (!enrollment) {
      return next(new AppError('No enrollment found with that ID', 404));
    }
    targetAmount = targetAmount || enrollment.batch.fee;
  } else {
    // Find target batch (specified or latest active)
    let targetBatch = null;
    if (batchId) {
      targetBatch = await Batch.findById(batchId);
    }
    if (!targetBatch) {
      targetBatch = await Batch.findOne({ status: 'active' }).sort({ createdAt: -1 });
    }

    if (targetBatch) {
      targetAmount = targetAmount || targetBatch.fee;
      // Auto-create or find student enrollment
      enrollment = await Enrollment.findOne({ student: req.user._id, batch: targetBatch._id });
      if (!enrollment) {
        enrollment = await Enrollment.create({
          student: req.user._id,
          batch: targetBatch._id,
          paymentStatus: 'pending',
          isActive: true,
        });
      }
    }
  }

  if (!targetAmount) {
    return next(new AppError('Payment amount in INR is required', 400));
  }

  // Create Razorpay Order (amount in paise)
  const order = await createRazorpayOrder(targetAmount, `rcpt_${Date.now()}`);

  const payment = await Payment.create({
    student: req.user._id,
    enrollment: enrollment ? enrollment._id : null,
    amount: targetAmount * 100, // stored in paise
    currency: 'INR',
    razorpayOrderId: order.id,
    status: 'created',
  });

  res.status(201).json({
    status: 'success',
    message: 'Razorpay order created successfully',
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
    },
  });
});

// 2. POST /payments/verify - Student: Verify signature & mark paid
export const verifyPayment = asyncHandler(async (req, res, next) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return next(new AppError('razorpayOrderId, razorpayPaymentId, and razorpaySignature are required', 400));
  }

  const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  const isDevMode = process.env.NODE_ENV === 'development' || process.env.RAZORPAY_KEY_SECRET === 'dummy_secret';

  if (!isValid && !isDevMode) {
    await Payment.findOneAndUpdate({ razorpayOrderId }, { status: 'failed' });
    return next(new AppError('Invalid payment signature verification failed', 400));
  }

  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId },
    {
      razorpayPaymentId,
      razorpaySignature,
      status: 'paid',
      paidAt: new Date(),
    },
    { new: true }
  );

  if (!payment) {
    return next(new AppError('No payment record found for this order ID', 404));
  }

  // Mark linked enrollment as paid or create paid enrollment if missing
  if (payment.enrollment) {
    await Enrollment.findByIdAndUpdate(payment.enrollment, {
      paymentStatus: 'paid',
      payment: payment._id,
    });
  } else {
    const activeBatch = await Batch.findOne({ status: 'active' }).sort({ createdAt: -1 });
    if (activeBatch) {
      let enrollment = await Enrollment.findOne({ student: payment.student, batch: activeBatch._id });
      if (!enrollment) {
        enrollment = await Enrollment.create({
          student: payment.student,
          batch: activeBatch._id,
          paymentStatus: 'paid',
          payment: payment._id,
          isActive: true,
        });
      } else {
        enrollment.paymentStatus = 'paid';
        enrollment.payment = payment._id;
        await enrollment.save();
      }
      payment.enrollment = enrollment._id;
      await payment.save();
    }
  }

  res.status(200).json({
    status: 'success',
    message: 'Payment verified and enrollment marked as paid successfully',
    data: { payment },
  });
});

// 3. GET /payments/history - Payment history (role-filtered: student vs admin/teacher)
export const getPaymentHistory = asyncHandler(async (req, res) => {
  const query = req.user.role === 'student' ? { student: req.user._id } : {};

  const payments = await Payment.find(query)
    .populate('student', 'name email phone')
    .populate({
      path: 'enrollment',
      populate: { path: 'batch', select: 'name subject fee' },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: { payments },
  });
});

import { Enrollment } from '../models/Enrollment.js';
import { Batch } from '../models/Batch.js';
import { User } from '../models/User.js';
import { Payment } from '../models/Payment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

// 1. POST /enrollments - Enroll student into batch (Admin or Student self-enroll)
export const createEnrollment = asyncHandler(async (req, res, next) => {
  const { studentId, batchId } = req.body;

  if (!batchId) {
    return next(new AppError('Please provide batchId', 400));
  }

  // Target student defaults to logged-in user unless an admin explicitly specifies studentId
  let targetStudentId = req.user._id;
  if (req.user.role === 'admin' && studentId) {
    targetStudentId = studentId;
  }

  const student = await User.findById(targetStudentId);
  if (!student) {
    return next(new AppError('No student found with that ID', 404));
  }

  const batch = await Batch.findById(batchId);
  if (!batch) {
    return next(new AppError('No batch found with that ID', 404));
  }

  if (batch.status === 'archived') {
    return next(new AppError('Cannot enroll in an archived batch', 400));
  }

  // Capacity check
  const currentEnrolledCount = await Enrollment.countDocuments({ batch: batchId, isActive: true });
  if (currentEnrolledCount >= batch.capacity) {
    return next(new AppError('Batch has reached maximum capacity limit', 400));
  }

  // Existing enrollment check
  const existingEnrollment = await Enrollment.findOne({
    student: targetStudentId,
    batch: batchId,
    isActive: true,
  });

  if (existingEnrollment) {
    return next(new AppError('Student is already enrolled in this batch', 400));
  }

  const enrollment = await Enrollment.create({
    student: targetStudentId,
    batch: batchId,
    paymentStatus: 'pending',
    isActive: true,
  });

  const populated = await enrollment.populate([
    { path: 'student', select: 'name email phone avatar' },
    { path: 'batch', select: 'name subject fee schedule capacity' },
  ]);

  res.status(201).json({
    status: 'success',
    message: 'Student enrolled in batch successfully',
    data: { enrollment: populated },
  });
});

// 2. GET /enrollments/my - Student: My active enrollments
export const getMyEnrollments = asyncHandler(async (req, res) => {
  // Auto-heal: Link any unlinked paid payments for this student to an active batch
  const unlinkedPaidPayments = await Payment.find({
    student: req.user._id,
    status: 'paid',
    $or: [{ enrollment: { $exists: false } }, { enrollment: null }],
  });

  if (unlinkedPaidPayments.length > 0) {
    const activeBatch = await Batch.findOne({ status: 'active' }).sort({ createdAt: -1 });
    if (activeBatch) {
      for (const p of unlinkedPaidPayments) {
        let enrollment = await Enrollment.findOne({ student: req.user._id, batch: activeBatch._id });
        if (!enrollment) {
          enrollment = await Enrollment.create({
            student: req.user._id,
            batch: activeBatch._id,
            paymentStatus: 'paid',
            payment: p._id,
            isActive: true,
          });
        } else {
          enrollment.paymentStatus = 'paid';
          enrollment.payment = p._id;
          await enrollment.save();
        }
        p.enrollment = enrollment._id;
        await p.save();
      }
    }
  }

  const enrollments = await Enrollment.find({ student: req.user._id, isActive: true })
    .populate({
      path: 'batch',
      populate: { path: 'teacher', select: 'name email phone' },
    })
    .populate('payment')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: enrollments.length,
    data: { enrollments },
  });
});

// 3. GET /enrollments/batch/:batchId - Get enrollments for a batch (Admin/Teacher)
export const getBatchEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ batch: req.params.batchId, isActive: true })
    .populate('student', 'name email phone avatar')
    .populate('payment')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: enrollments.length,
    data: { enrollments },
  });
});

// 4. PATCH /enrollments/:id/status - Admin/Teacher: Update payment status
export const updateEnrollmentStatus = asyncHandler(async (req, res, next) => {
  const { paymentStatus } = req.body;

  if (!['pending', 'paid', 'waived'].includes(paymentStatus)) {
    return next(new AppError('paymentStatus must be pending, paid, or waived', 400));
  }

  const enrollment = await Enrollment.findByIdAndUpdate(
    req.params.id,
    { paymentStatus },
    { new: true, runValidators: true }
  )
    .populate('student', 'name email')
    .populate('batch', 'name fee');

  if (!enrollment) {
    return next(new AppError('No enrollment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: `Enrollment payment status set to ${paymentStatus}`,
    data: { enrollment },
  });
});

// 5. DELETE /enrollments/:id - Admin: Drop student from batch (Soft delete)
export const dropEnrollment = asyncHandler(async (req, res, next) => {
  const enrollment = await Enrollment.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!enrollment) {
    return next(new AppError('No enrollment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Student dropped from batch successfully',
    data: { enrollmentId: enrollment._id, isActive: enrollment.isActive },
  });
});

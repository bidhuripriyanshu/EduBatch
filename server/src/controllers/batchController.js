import { Batch } from '../models/Batch.js';
import { Enrollment } from '../models/Enrollment.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

// 1. GET /batches - List batches (filtered by status, teacher, subject, search query)
export const getAllBatches = asyncHandler(async (req, res) => {
  const { status, teacher, subject, search } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (teacher) {
    query.teacher = teacher;
  }

  if (subject) {
    query.subject = { $regex: subject, $options: 'i' };
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const batches = await Batch.find(query)
    .populate('teacher', 'name email phone avatar')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  // Calculate enrolled count for each batch dynamically
  const batchesWithCounts = await Promise.all(
    batches.map(async (batch) => {
      const enrolledCount = await Enrollment.countDocuments({
        batch: batch._id,
        isActive: true,
      });
      return {
        ...batch.toObject(),
        enrolledCount,
        availableSeats: Math.max(0, batch.capacity - enrolledCount),
      };
    })
  );

  res.status(200).json({
    status: 'success',
    results: batchesWithCounts.length,
    data: {
      batches: batchesWithCounts,
    },
  });
});

// 2. GET /batches/:id - Single batch details + enrolled count
export const getBatchById = asyncHandler(async (req, res, next) => {
  const batch = await Batch.findById(req.params.id)
    .populate('teacher', 'name email phone avatar')
    .populate('createdBy', 'name email');

  if (!batch) {
    return next(new AppError('No batch found with that ID', 404));
  }

  const enrolledCount = await Enrollment.countDocuments({
    batch: batch._id,
    isActive: true,
  });

  const enrollments = await Enrollment.find({ batch: batch._id, isActive: true })
    .populate('student', 'name email phone avatar')
    .populate('payment');

  res.status(200).json({
    status: 'success',
    data: {
      batch: {
        ...batch.toObject(),
        enrolledCount,
        availableSeats: Math.max(0, batch.capacity - enrolledCount),
      },
      students: enrollments.map((e) => ({
        enrollmentId: e._id,
        student: e.student,
        enrolledAt: e.enrolledAt,
        paymentStatus: e.paymentStatus,
      })),
    },
  });
});

// 3. POST /batches - Admin: Create batch
export const createBatch = asyncHandler(async (req, res, next) => {
  const { name, subject, description, startDate, endDate, schedule, capacity, fee, teacher, status, category, image, rating, oldPrice } = req.body;

  if (!name || !subject || !fee || !teacher) {
    return next(new AppError('Please provide name, subject, fee, and assigned teacher ID', 400));
  }

  // Verify teacher exists
  const teacherUser = await User.findById(teacher);
  if (!teacherUser || (teacherUser.role !== 'teacher' && teacherUser.role !== 'admin')) {
    return next(new AppError('Assigned user must exist and have role of teacher or admin', 400));
  }

  const newBatch = await Batch.create({
    name,
    subject,
    description,
    startDate,
    endDate,
    schedule,
    capacity: capacity || 30,
    fee,
    teacher,
    category: category || 'JEE & NEET Prep',
    image: image || '',
    rating: rating || 4.9,
    oldPrice: oldPrice || Math.round(fee * 1.4),
    status: status || 'upcoming',
    createdBy: req.user._id,
  });

  const populatedBatch = await newBatch.populate('teacher', 'name email phone');

  res.status(201).json({
    status: 'success',
    message: 'Batch created successfully',
    data: {
      batch: populatedBatch,
    },
  });
});

// 4. PUT /batches/:id - Admin: Update batch
export const updateBatch = asyncHandler(async (req, res, next) => {
  const updatedBatch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('teacher', 'name email phone');

  if (!updatedBatch) {
    return next(new AppError('No batch found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Batch updated successfully',
    data: {
      batch: updatedBatch,
    },
  });
});

// 5. PATCH /batches/:id/status - Admin: Change status
export const changeBatchStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!['upcoming', 'active', 'archived'].includes(status)) {
    return next(new AppError('Status must be upcoming, active, or archived', 400));
  }

  const batch = await Batch.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate('teacher', 'name email');

  if (!batch) {
    return next(new AppError('No batch found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: `Batch status changed to ${status}`,
    data: {
      batch,
    },
  });
});

// 6. DELETE /batches/:id - Admin: Soft archive
export const softArchiveBatch = asyncHandler(async (req, res, next) => {
  const batch = await Batch.findByIdAndUpdate(
    req.params.id,
    { status: 'archived' },
    { new: true }
  );

  if (!batch) {
    return next(new AppError('No batch found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Batch successfully soft archived',
    data: {
      batchId: batch._id,
      status: batch.status,
    },
  });
});

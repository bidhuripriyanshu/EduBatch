import { Notice } from '../models/Notice.js';
import { Batch } from '../models/Batch.js';
import { User } from '../models/User.js';
import { Enrollment } from '../models/Enrollment.js';
import { sendBroadcastEmail } from '../services/emailService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

// 1. POST /notices - Teacher+: Create notice
export const createNotice = asyncHandler(async (req, res, next) => {
  const { title, body, batchId, pinned, sendEmail } = req.body;

  if (!title || !body) {
    return next(new AppError('Title and body content are required', 400));
  }

  let batchObj = null;
  if (batchId) {
    batchObj = await Batch.findById(batchId);
    if (!batchObj) {
      return next(new AppError('No batch found with that ID', 404));
    }
  }

  const notice = await Notice.create({
    title,
    body,
    batch: batchId || null,
    createdBy: req.user._id,
    pinned: pinned || false,
  });

  const populated = await notice.populate([
    { path: 'createdBy', select: 'name email role avatar' },
    { path: 'batch', select: 'name subject' }
  ]);

  // Gather target recipient emails for SMTP Email Broadcast
  let recipientEmails = [];
  if (batchId) {
    const enrollments = await Enrollment.find({ batch: batchId, isActive: true }).populate('student', 'email');
    recipientEmails = enrollments.map((e) => e.student?.email).filter(Boolean);
  } else {
    const users = await User.find({ role: { $in: ['student', 'teacher'] } }).select('email');
    recipientEmails = users.map((u) => u.email).filter(Boolean);
  }

  recipientEmails = [...new Set(recipientEmails)];

  let emailResult = { recipientCount: recipientEmails.length, success: false };
  if (recipientEmails.length > 0 && sendEmail !== false) {
    emailResult = await sendBroadcastEmail({
      toEmails: recipientEmails,
      title,
      body,
      batchName: batchObj ? batchObj.name : null,
      createdByName: req.user.name,
    });
  }

  res.status(201).json({
    success: true,
    message: `Notice published successfully! ${recipientEmails.length > 0 ? `Broadcasted via SMTP email to ${recipientEmails.length} recipient(s).` : ''}`,
    data: {
      notice: populated,
      broadcastStats: {
        recipientCount: recipientEmails.length,
        emailSent: emailResult.success,
      },
    },
  });
});

// 2. GET /notices - Yes: List notices (filtered by batch)
export const getNotices = asyncHandler(async (req, res) => {
  const { batchId } = req.query;

  const query = {};
  if (batchId) {
    query.$or = [{ batch: batchId }, { batch: null }]; // Batch notices + global notices
  }

  const notices = await Notice.find(query)
    .populate('createdBy', 'name email role avatar')
    .populate('batch', 'name subject')
    .sort({ pinned: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Notices retrieved successfully',
    data: { notices },
  });
});

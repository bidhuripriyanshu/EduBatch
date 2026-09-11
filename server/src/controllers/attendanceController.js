import { Attendance } from '../models/Attendance.js';
import { Batch } from '../models/Batch.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

// 1. POST /attendance - Teacher+: Mark attendance for a date
export const markAttendance = asyncHandler(async (req, res, next) => {
  const { batchId, date, records } = req.body;

  if (!batchId || !records || !Array.isArray(records)) {
    return next(new AppError('Please provide batchId and records array', 400));
  }

  const batch = await Batch.findById(batchId);
  if (!batch) {
    return next(new AppError('No batch found with that ID', 404));
  }

  // Normalize date to start of day
  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  // Check if attendance already marked for this batch on targetDate
  let attendance = await Attendance.findOne({ batch: batchId, date: targetDate });

  if (attendance) {
    attendance.records = records;
    attendance.markedBy = req.user._id;
    await attendance.save();
  } else {
    attendance = await Attendance.create({
      batch: batchId,
      date: targetDate,
      records,
      markedBy: req.user._id,
    });
  }

  const populated = await attendance.populate([
    { path: 'batch', select: 'name subject' },
    { path: 'records.student', select: 'name email avatar' },
    { path: 'markedBy', select: 'name email role' }
  ]);

  res.status(200).json({
    success: true,
    message: 'Attendance marked successfully',
    data: { attendance: populated },
  });
});

// 2. GET /attendance/batch/:id - Yes: Attendance records for batch
export const getBatchAttendance = asyncHandler(async (req, res, next) => {
  const batchId = req.params.id || req.params.batchId;

  const records = await Attendance.find({ batch: batchId })
    .populate('records.student', 'name email phone avatar')
    .populate('markedBy', 'name email role')
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    message: 'Batch attendance retrieved successfully',
    data: { records },
  });
});

// 3. GET /attendance/my - Student: Own attendance summary
export const getMyAttendance = asyncHandler(async (req, res) => {
  const logs = await Attendance.find({ 'records.student': req.user._id })
    .populate('batch', 'name subject schedule')
    .sort({ date: -1 });

  const studentLogs = logs.map((log) => {
    const studentRecord = log.records.find(
      (r) => r.student.toString() === req.user._id.toString()
    );
    return {
      attendanceId: log._id,
      batch: log.batch,
      date: log.date,
      status: studentRecord ? studentRecord.status : 'absent',
    };
  });

  const totalClasses = studentLogs.length;
  const presentCount = studentLogs.filter((l) => l.status === 'present').length;
  const absentCount = studentLogs.filter((l) => l.status === 'absent').length;
  const lateCount = studentLogs.filter((l) => l.status === 'late').length;
  const percentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : '0.0';

  res.status(200).json({
    success: true,
    message: 'Student attendance summary retrieved successfully',
    data: {
      stats: {
        totalClasses,
        presentCount,
        absentCount,
        lateCount,
        attendancePercentage: `${percentage}%`,
      },
      records: studentLogs,
    },
  });
});

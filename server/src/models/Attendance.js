import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: [true, 'Batch reference is required'],
    },
    date: {
      type: Date,
      required: [true, 'Attendance date is required'],
    },
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        status: {
          type: String,
          enum: ['present', 'absent', 'late'],
          default: 'present',
        },
      },
    ],
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'MarkedBy teacher/user reference is required'],
    },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model('Attendance', attendanceSchema);

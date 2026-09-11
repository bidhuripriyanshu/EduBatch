import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Batch name is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    schedule: {
      days: [{ type: String }], // e.g. ['Mon', 'Wed', 'Fri']
      startTime: { type: String }, // e.g. '09:00 AM'
      endTime: { type: String },   // e.g. '11:00 AM'
    },
    capacity: {
      type: Number,
      default: 30,
    },
    fee: {
      type: Number,
      required: [true, 'Batch fee in INR is required'],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assigned teacher is required'],
    },
    category: {
      type: String,
      enum: ['JEE & NEET Prep', 'Board Exams', 'Coding Bootcamps', 'Language Institutes', 'School Foundation'],
      default: 'JEE & NEET Prep',
    },
    image: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    oldPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'archived'],
      default: 'upcoming',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Batch = mongoose.model('Batch', batchSchema);

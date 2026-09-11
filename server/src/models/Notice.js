import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      default: null, // Nullable for global notices
    },
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Notice body content is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author/Creator user reference is required'],
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notice = mongoose.model('Notice', noticeSchema);

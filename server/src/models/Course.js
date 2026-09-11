import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'JEE & NEET Prep',
        'Board Exams',
        'Coding Bootcamps',
        'Language Institutes',
        'School Foundation'
      ],
    },
    description: String,
    instructor: String,
    price: {
      type: Number,
      required: true,
    },
    oldPrice: Number,
    duration: String,
    level: String,
    image: String,
    rating: {
      type: Number,
      default: 4.8,
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model('Course', courseSchema);

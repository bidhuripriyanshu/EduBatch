import { Course } from '../models/Course.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find();
  res.status(200).json({ status: 'success', results: courses.length, data: { courses } });
});

export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json({ status: 'success', data: { course } });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!course) {
    return res.status(404).json({ status: 'fail', message: 'No course found with that ID' });
  }
  res.status(200).json({ status: 'success', data: { course } });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return res.status(404).json({ status: 'fail', message: 'No course found with that ID' });
  }
  res.status(204).json({ status: 'success', data: null });
});


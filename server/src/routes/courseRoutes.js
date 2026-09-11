import express from 'express';
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';

const router = express.Router();

router.route('/')
  .get(getAllCourses)
  .post(protect, restrictTo('admin'), createCourse);

router.route('/:id')
  .put(protect, restrictTo('admin'), updateCourse)
  .delete(protect, restrictTo('admin'), deleteCourse);

export default router;


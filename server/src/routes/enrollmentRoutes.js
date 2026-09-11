import express from 'express';
import {
  createEnrollment,
  getMyEnrollments,
  getBatchEnrollments,
  updateEnrollmentStatus,
  dropEnrollment,
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

// 7.3 Enrollments Endpoints
router.post('/', validate(['batchId']), createEnrollment);
router.get('/my', getMyEnrollments);
router.get('/batch/:batchId', restrictTo('admin', 'teacher'), getBatchEnrollments);
router.patch('/:id/status', restrictTo('admin', 'teacher'), validate(['paymentStatus']), updateEnrollmentStatus);
router.delete('/:id', restrictTo('admin'), dropEnrollment);

export default router;

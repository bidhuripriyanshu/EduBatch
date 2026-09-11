import express from 'express';
import { 
  markAttendance, 
  getBatchAttendance, 
  getMyAttendance 
} from '../controllers/attendanceController.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

// 7.4 Attendance Endpoints
router.post('/', restrictTo('teacher', 'admin'), validate(['batchId', 'records']), markAttendance);
router.get('/batch/:id', getBatchAttendance);
router.get('/my', getMyAttendance);

export default router;

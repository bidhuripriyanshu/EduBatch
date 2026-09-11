import express from 'express';
import { createNotice, getNotices } from '../controllers/noticeController.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { createNoticeSchema } from '../validators/schemas.js';

const router = express.Router();

router.use(protect);

// 7.4 Notices Endpoints
router.post('/', restrictTo('teacher', 'admin'), validate(createNoticeSchema), createNotice);
router.get('/', getNotices);

export default router;


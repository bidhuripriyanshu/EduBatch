import express from 'express';
import { 
  getAllBatches, 
  getBatchById, 
  createBatch, 
  updateBatch, 
  changeBatchStatus, 
  softArchiveBatch 
} from '../controllers/batchController.js';
import { protect } from '../middleware/auth.js';
import { restrictTo } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

import { createBatchSchema } from '../validators/schemas.js';

// 7.2 Batches Endpoints (GET endpoints are public for browsing active batches)
router.route('/')
  .get(getAllBatches)
  .post(protect, restrictTo('admin'), validate(createBatchSchema), createBatch);

router.route('/:id')
  .get(getBatchById)
  .put(protect, restrictTo('admin'), updateBatch)
  .delete(protect, restrictTo('admin'), softArchiveBatch);

router.patch('/:id/status', protect, restrictTo('admin'), validate(['status']), changeBatchStatus);

export default router;


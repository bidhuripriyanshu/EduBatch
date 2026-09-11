import express from 'express';
import { 
  createOrder, 
  verifyPayment, 
  getPaymentHistory 
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, verifyPaymentSchema } from '../validators/schemas.js';

const router = express.Router();

router.use(protect);

// 7.3 Enrollments & Payments Endpoints
router.post('/create-order', validate(createOrderSchema), createOrder);
router.post('/verify', validate(verifyPaymentSchema), verifyPayment);
router.get('/history', getPaymentHistory);
router.get('/my', getPaymentHistory); // Alias for student my payments

export default router;


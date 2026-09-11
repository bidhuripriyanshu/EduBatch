import { razorpayInstance } from '../config/razorpay.js';
import crypto from 'crypto';
import { config } from '../config/env.js';

export const createRazorpayOrder = async (amount, receiptId) => {
  const options = {
    amount: amount * 100, // amount in paise
    currency: 'INR',
    receipt: receiptId,
  };
  return await razorpayInstance.orders.create(options);
};

export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const generatedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};

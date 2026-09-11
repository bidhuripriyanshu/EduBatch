import { client } from './client';

export const paymentApi = {
  createOrder: (data) => client.post('/payments/create-order', data),
  verifyPayment: (data) => client.post('/payments/verify', data),
  getPaymentHistory: () => client.get('/payments/history'),
};

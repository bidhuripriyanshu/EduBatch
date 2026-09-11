import { client } from './client';

export const enrollmentApi = {
  enrollStudent: (data) => client.post('/enrollments', data),
  getMyEnrollments: () => client.get('/enrollments/my'),
  getBatchEnrollments: (batchId) => client.get(`/enrollments/batch/${batchId}`),
  updateStatus: (id, paymentStatus) => client.patch(`/enrollments/${id}/status`, { paymentStatus }),
  dropEnrollment: (id) => client.delete(`/enrollments/${id}`),
};

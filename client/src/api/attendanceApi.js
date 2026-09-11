import { client } from './client';

export const attendanceApi = {
  markAttendance: (data) => client.post('/attendance', data),
  getBatchAttendance: (batchId) => client.get(`/attendance/batch/${batchId}`),
  getMyAttendance: () => client.get('/attendance/my'),
};

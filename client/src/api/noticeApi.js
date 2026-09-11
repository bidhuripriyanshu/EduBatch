import { client } from './client';

export const noticeApi = {
  createNotice: (data) => client.post('/notices', data),
  getNotices: (batchId) => client.get('/notices', { params: batchId ? { batchId } : {} }),
};

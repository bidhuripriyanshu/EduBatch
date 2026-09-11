import { client } from './client';

const batchCacheMap = new Map();
const pendingBatchPromises = new Map();
const CACHE_DURATION_MS = 60000;

export const batchApi = {
  getBatches: async (params = {}) => {
    const key = JSON.stringify(params || {});
    const now = Date.now();
    const cached = batchCacheMap.get(key);

    if (cached && (now - cached.time < CACHE_DURATION_MS)) {
      return cached.data;
    }

    if (pendingBatchPromises.has(key)) {
      return pendingBatchPromises.get(key);
    }

    const promise = client.get('/batches', { params })
      .then((data) => {
        batchCacheMap.set(key, { data, time: Date.now() });
        pendingBatchPromises.delete(key);
        return data;
      })
      .catch((err) => {
        pendingBatchPromises.delete(key);
        throw err;
      });

    pendingBatchPromises.set(key, promise);
    return promise;
  },

  createBatch: async (data) => {
    const res = await client.post('/batches', data);
    batchCacheMap.clear();
    return res;
  },

  getBatchById: (id) => client.get(`/batches/${id}`),

  updateBatch: async (id, data) => {
    const res = await client.put(`/batches/${id}`, data);
    batchCacheMap.clear();
    return res;
  },

  changeBatchStatus: async (id, status) => {
    const res = await client.patch(`/batches/${id}/status`, { status });
    batchCacheMap.clear();
    return res;
  },

  archiveBatch: async (id) => {
    const res = await client.delete(`/batches/${id}`);
    batchCacheMap.clear();
    return res;
  },

  clearCache: () => {
    batchCacheMap.clear();
  }
};


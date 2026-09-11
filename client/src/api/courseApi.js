import { client } from './client';

let courseCache = null;
let cacheTime = 0;
let pendingCoursePromise = null;
const CACHE_DURATION_MS = 60000;

export const courseApi = {
  getCourses: async (options = {}) => {
    const forceRefresh = options?.forceRefresh;
    const now = Date.now();

    if (!forceRefresh && courseCache && (now - cacheTime < CACHE_DURATION_MS)) {
      return courseCache;
    }

    if (pendingCoursePromise && !forceRefresh) {
      return pendingCoursePromise;
    }

    pendingCoursePromise = client.get('/courses')
      .then((data) => {
        courseCache = data;
        cacheTime = Date.now();
        pendingCoursePromise = null;
        return data;
      })
      .catch((err) => {
        pendingCoursePromise = null;
        throw err;
      });

    return pendingCoursePromise;
  },

  createCourse: async (data) => {
    const res = await client.post('/courses', data);
    courseCache = null;
    return res;
  },

  updateCourse: async (id, data) => {
    const res = await client.put(`/courses/${id}`, data);
    courseCache = null;
    return res;
  },

  deleteCourse: async (id) => {
    const res = await client.delete(`/courses/${id}`);
    courseCache = null;
    return res;
  },

  clearCache: () => {
    courseCache = null;
    cacheTime = 0;
  }
};


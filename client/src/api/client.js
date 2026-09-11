import axios from 'axios';

// Sanitize Base URL by stripping trailing slashes
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://edubatch-backend.vercel.app/api/v1';
const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

// Diagnostic check: Alert developer if API URL accidentally points to frontend Vercel URL
if (typeof window !== 'undefined' && API_BASE_URL.includes(window.location.host)) {
  console.error(
    `🚨 [EduBatch Error]: VITE_API_BASE_URL ("${API_BASE_URL}") is pointing to the FRONTEND domain! ` +
    `API requests will fail with 405 Method Not Allowed. ` +
    `Please set VITE_API_BASE_URL in Vercel to your BACKEND domain (e.g. https://your-backend-app.vercel.app/api/v1) and REDEPLOY.`
  );
}

export const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto Refresh Token on 401
client.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (storedRefreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: storedRefreshToken,
          }, { withCredentials: true });

          const { accessToken, refreshToken: newRefreshToken } = res.data.data;
          localStorage.setItem('accessToken', accessToken);
          if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return client(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

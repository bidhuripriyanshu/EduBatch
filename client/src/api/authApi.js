import { client } from './client';

export const authApi = {
  register: (data) => client.post('/auth/register', data),
  login: (credentials) => client.post('/auth/login', credentials),
  getMe: () => client.get('/auth/me'),
  refresh: (refreshToken) => client.post('/auth/refresh', { refreshToken }),
  forgotPassword: (email) => client.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => client.post('/auth/reset-password', { token, password }),
};

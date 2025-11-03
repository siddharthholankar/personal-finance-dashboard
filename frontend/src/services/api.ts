import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Accounts API
export const accountsAPI = {
  getAll: () => api.get('/accounts'),
  create: (data: { accountName: string; accountType: string; balance: number }) =>
    api.post('/accounts', data),
  getById: (id: number) => api.get(`/accounts/${id}`),
};

// Transactions API
export const transactionsAPI = {
  getAll: (params?: any) => api.get('/transactions', { params }),
  create: (data: any) => api.post('/transactions', data),
  update: (id: number, data: any) => api.put(`/transactions/${id}`, data),
  delete: (id: number) => api.delete(`/transactions/${id}`),
};

// Portfolio API
export const portfolioAPI = {
  getAll: () => api.get('/portfolio'),
  create: (data: any) => api.post('/portfolio', data),
  update: (id: number, data: any) => api.put(`/portfolio/${id}`, data),
  delete: (id: number) => api.delete(`/portfolio/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getMonthlySummary: (params?: any) => api.get('/analytics/monthly-summary', { params }),
  getCategoryBreakdown: (params?: any) => api.get('/analytics/category-breakdown', { params }),
  getRecentSummary: () => api.get('/analytics/recent-summary'),
  getPortfolioSummary: () => api.get('/analytics/portfolio-summary'),
};

export default api;


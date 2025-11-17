import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  getProfile: () =>
    api.get('/auth/profile'),
};

// Products APIs
export const productsAPI = {
  getAll: (params?: any) =>
    api.get('/products', { params }),

  getById: (id: string) =>
    api.get(`/products/${id}`),

  create: (data: any) =>
    api.post('/products', data),

  update: (id: string, data: any) =>
    api.put(`/products/${id}`, data),

  delete: (id: string) =>
    api.delete(`/products/${id}`),

  getCategories: () =>
    api.get('/products/categories/list'),
};

// Orders APIs
export const ordersAPI = {
  getAll: () =>
    api.get('/orders/admin/all'),

  getById: (id: string) =>
    api.get(`/orders/${id}`),

  updateStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { orderStatus: status }),

  // Tracking methods
  syncTracking: (id: string) =>
    api.post(`/orders/${id}/sync-tracking`),

  printLabel: (id: string) =>
    api.get(`/orders/${id}/label`),

  // Manual shipment creation
  createShipment: (id: string) =>
    api.post(`/orders/${id}/create-shipment`),
};

// Users APIs (if you have user management endpoints)
export const usersAPI = {
  getAll: () =>
    api.get('/users'),

  getById: (id: string) =>
    api.get(`/users/${id}`),

  update: (id: string, data: any) =>
    api.put(`/users/${id}`, data),

  delete: (id: string) =>
    api.delete(`/users/${id}`),
};

// Dashboard/Analytics APIs
export const dashboardAPI = {
  getStats: () =>
    api.get('/dashboard/stats'),

  getSalesData: (period?: string) =>
    api.get('/dashboard/sales', { params: { period } }),
};

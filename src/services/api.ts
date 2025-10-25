import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (data: any) =>
    api.put('/auth/profile', data),
  
  addAddress: (data: any) =>
    api.post('/auth/address', data),
  
  updateAddress: (addressId: string, data: any) =>
    api.put(`/auth/address/${addressId}`, data),
  
  deleteAddress: (addressId: string) =>
    api.delete(`/auth/address/${addressId}`),
};

// Products API
export const productsAPI = {
  getAll: (params?: { category?: string; search?: string; sort?: string; page?: number; limit?: number }) =>
    api.get('/products', { params }),
  
  getById: (id: string) =>
    api.get(`/products/${id}`),
  
  getCategories: () =>
    api.get('/products/categories/list'),
  
  // Admin only
  create: (data: any) =>
    api.post('/products', data),
  
  update: (id: string, data: any) =>
    api.put(`/products/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  get: () =>
    api.get('/cart'),
  
  add: (data: { productId: string; quantity: number; pack?: string; packPrice?: number }) =>
    api.post('/cart/add', data),
  
  update: (productId: string, quantity: number, pack?: string) =>
    api.put(`/cart/update/${productId}`, { quantity, pack }),
  
  remove: (productId: string, pack?: string) =>
    api.delete(`/cart/remove/${productId}${pack ? `?pack=${pack}` : ''}`),
  
  clear: () =>
    api.delete('/cart/clear'),
};

// Payment API
export const paymentAPI = {
  getKey: () =>
    api.get('/payment/key'),
  
  // Verify payment and update existing order (Step 3)
  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;  // Our database order ID
  }) =>
    api.post('/payment/verify', data),
};

// Wishlist API
export const wishlistAPI = {
  get: () =>
    api.get('/wishlist'),
  
  add: (productId: string) =>
    api.post('/wishlist/add', { productId }),
  
  toggle: (productId: string) =>
    api.post(`/wishlist/toggle/${productId}`),
  
  remove: (productId: string) =>
    api.delete(`/wishlist/remove/${productId}`),
  
  clear: () =>
    api.delete('/wishlist/clear'),
};

// Orders API
export const ordersAPI = {
  // Create unpaid order from cart (Step 1)
  createFromCart: () =>
    api.post('/orders/create-from-cart'),
  
  // Update order with shipping address (Step 2)
  updateAddress: (orderId: string, shippingAddress: any) =>
    api.put(`/orders/${orderId}/address`, { shippingAddress }),
  
  getAll: () =>
    api.get('/orders'),
  
  getById: (id: string) =>
    api.get(`/orders/${id}`),
  
  markAsPaid: (id: string, transactionId: string) =>
    api.put(`/orders/${id}/pay`, { transactionId }),
  
  cancel: (id: string) =>
    api.put(`/orders/${id}/cancel`),
  
  // Admin only
  getAllAdmin: () =>
    api.get('/orders/admin/all'),
  
  updateStatus: (id: string, orderStatus: string) =>
    api.put(`/orders/${id}/status`, { orderStatus }),
};

// Health check
export const healthCheck = () =>
  api.get('/health');

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
};

// Looks API
export const looksAPI = {
  getAll: (params) => api.get('/looks', { params }),
  getOne: (id) => api.get(`/looks/${id}`),
  create: (data) => api.post('/looks', data),
  update: (id, data) => api.put(`/looks/${id}`, data),
  delete: (id) => api.delete(`/looks/${id}`),
  like: (id) => api.post(`/looks/${id}/like`),
  unlike: (id) => api.delete(`/looks/${id}/like`),
  addComment: (id, data) => api.post(`/looks/${id}/comments`, data),
};

// Virtual Try-On API
export const virtualTryOnAPI = {
  tryOn: (image, productType, productColor) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('productType', productType);
    formData.append('productColor', productColor);
    return api.post('/virtual-try-on/try-on', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getSupportedTypes: () => api.get('/virtual-try-on/supported-types'),
};

// Analytics API
export const analyticsAPI = {
  trackActivity: (data) => api.post('/analytics/track', data),
  getProductAnalytics: (productId, period) => 
    api.get(`/analytics/product/${productId}`, { params: { period } }),
  getLookAnalytics: (lookId, period) => 
    api.get(`/analytics/look/${lookId}`, { params: { period } }),
  getTrending: () => api.get('/analytics/trending'),
};

// Search API
export const searchAPI = {
  global: (query) => api.get('/search', { params: { query } }),
  products: (query) => api.get('/search/products', { params: { query } }),
  looks: (query) => api.get('/search/looks', { params: { query } }),
};

export default api;

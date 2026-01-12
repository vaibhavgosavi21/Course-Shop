import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getInstructors: () => api.get('/admin/instructors'),
  getStudents: () => api.get('/admin/students'),
  getPendingCourses: () => api.get('/admin/courses/pending'),
  approveCourse: (courseId) => api.put(`/admin/courses/${courseId}/approve`),
  rejectCourse: (courseId, reason) => api.put(`/admin/courses/${courseId}/reject`, { reason }),
  removeCourse: (courseId) => api.delete(`/admin/courses/${courseId}`),
  getTransactions: () => api.get('/admin/transactions'),
};

// Instructor API
export const instructorAPI = {
  addCourse: (formData) => api.post('/instructor/courses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyCourses: () => api.get('/instructor/courses'),
  updateCourse: (courseId, formData) => api.put(`/instructor/courses/${courseId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getNotifications: () => api.get('/instructor/notifications'),
  markNotificationRead: (notificationId) => api.put(`/instructor/notifications/${notificationId}/read`),
};

// Student API
export const studentAPI = {
  getCourses: (search = '') => api.get(`/student/courses?search=${search}`),
  createPaymentIntent: (courseId) => api.post('/student/payment/create-intent', { courseId }),
  confirmPayment: (paymentIntentId) => api.post('/student/payment/confirm', { paymentIntentId }),
  getPurchaseHistory: () => api.get('/student/purchases'),
};

export default api;
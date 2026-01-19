import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
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
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

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
  getAllCourses: (search = '') => api.get(`/admin/courses/all?search=${encodeURIComponent(search)}`),
  approveCourse: (courseId) => api.put(`/admin/courses/${courseId}/approve`),
  rejectCourse: (courseId, reason) => api.put(`/admin/courses/${courseId}/reject`, { reason }),
  removeCourse: (courseId) => api.delete(`/admin/courses/${courseId}`),
  getTransactions: () => api.get('/admin/transactions'),
  addInstructor: (data) => api.post('/admin/instructors', data),
  removeInstructor: (instructorId) => api.delete(`/admin/instructors/${instructorId}`),
  updateStudent: (studentId, data) => api.put(`/admin/students/${studentId}`, data),
  removeStudent: (studentId) => api.delete(`/admin/students/${studentId}`),
  getCourseContent: (courseId) => api.get(`/admin/courses/${courseId}/content`),
};

// Instructor API
export const instructorAPI = {
  addCourse: (formData) => api.post('/instructor/courses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyCourses: () => api.get('/instructor/courses'),
  getMyApprovedCourses: () => api.get('/instructor/courses/approved'),
  getMyPendingCourses: () => api.get('/instructor/courses/pending'),
  getAllCourses: (search = '') => api.get(`/instructor/courses/all?search=${encodeURIComponent(search)}`),
  updateCourse: (courseId, formData) => api.put(`/instructor/courses/${courseId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteCourse: (courseId) => api.delete(`/instructor/courses/${courseId}`),
  getNotifications: () => api.get('/instructor/notifications'),
  markNotificationRead: (notificationId) => api.put(`/instructor/notifications/${notificationId}/read`),
  getCourseContent: (courseId) => api.get(`/instructor/courses/${courseId}/content`),
};

// Student API
export const studentAPI = {
  getCourses: (search = '') => api.get(`/student/courses?search=${encodeURIComponent(search)}`),
  getAllCourses: (search = '') => api.get(`/student/courses/all?search=${encodeURIComponent(search)}`),
  createPaymentIntent: (courseId) => api.post('/student/payment/create-intent', { courseId }),
  confirmPayment: (paymentIntentId) => api.post('/student/payment/confirm', { paymentIntentId }),
  directPurchase: (courseId) => api.post('/student/purchase', { courseId }),
  getPurchaseHistory: () => api.get('/student/purchases'),
  getCourseContent: (courseId) => api.get(`/student/courses/${courseId}/content`),
};

export default api;
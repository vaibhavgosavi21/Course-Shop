import axios from 'axios';
import { API_ENDPOINTS } from '../shared/constants';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  login: (credentials: any) => api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get(API_ENDPOINTS.ADMIN.DASHBOARD),
  getInstructors: () => api.get(API_ENDPOINTS.ADMIN.INSTRUCTORS),
  getStudents: () => api.get(API_ENDPOINTS.ADMIN.STUDENTS),
  getPendingCourses: () => api.get(API_ENDPOINTS.ADMIN.COURSES_PENDING),
  getAllCourses: (search = '') => api.get(`${API_ENDPOINTS.ADMIN.COURSES_ALL}?search=${encodeURIComponent(search)}`),
  approveCourse: (courseId: string) => api.put(`/admin/courses/${courseId}/approve`),
  rejectCourse: (courseId: string, reason: string) => api.put(`/admin/courses/${courseId}/reject`, { reason }),
  removeCourse: (courseId: string) => api.delete(`/admin/courses/${courseId}`),
  getTransactions: () => api.get(API_ENDPOINTS.ADMIN.TRANSACTIONS),
};

// Instructor API
export const instructorAPI = {
  addCourse: (formData: FormData) => api.post(API_ENDPOINTS.INSTRUCTOR.COURSES, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyCourses: () => api.get(API_ENDPOINTS.INSTRUCTOR.COURSES),
  getAllCourses: (search = '') => api.get(`${API_ENDPOINTS.INSTRUCTOR.COURSES_ALL}?search=${encodeURIComponent(search)}`),
  updateCourse: (courseId: string, formData: FormData) => api.put(`/instructor/courses/${courseId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getNotifications: () => api.get(API_ENDPOINTS.INSTRUCTOR.NOTIFICATIONS),
  markNotificationRead: (notificationId: string) => api.put(`/instructor/notifications/${notificationId}/read`),
};

// Student API
export const studentAPI = {
  getCourses: (search = '') => api.get(`${API_ENDPOINTS.STUDENT.COURSES}?search=${encodeURIComponent(search)}`),
  getAllCourses: (search = '') => api.get(`${API_ENDPOINTS.STUDENT.COURSES_ALL}?search=${encodeURIComponent(search)}`),
  createPaymentIntent: (courseId: string) => api.post(`${API_ENDPOINTS.STUDENT.PAYMENT}/create-intent`, { courseId }),
  confirmPayment: (paymentIntentId: string) => api.post(`${API_ENDPOINTS.STUDENT.PAYMENT}/confirm`, { paymentIntentId }),
  getPurchaseHistory: () => api.get(API_ENDPOINTS.STUDENT.PURCHASES),
};

export default api;
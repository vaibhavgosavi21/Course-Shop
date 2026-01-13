export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    INSTRUCTORS: '/admin/instructors',
    STUDENTS: '/admin/students',
    COURSES_PENDING: '/admin/courses/pending',
    COURSES_ALL: '/admin/courses/all',
    TRANSACTIONS: '/admin/transactions',
  },
  INSTRUCTOR: {
    COURSES: '/instructor/courses',
    COURSES_ALL: '/instructor/courses/all',
    NOTIFICATIONS: '/instructor/notifications',
  },
  STUDENT: {
    COURSES: '/student/courses',
    COURSES_ALL: '/student/courses/all',
    PAYMENT: '/student/payment',
    PURCHASES: '/student/purchases',
  },
};

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth/:role',
  ADMIN_DASHBOARD: '/admin/dashboard',
  INSTRUCTOR_DASHBOARD: '/instructor/dashboard',
  STUDENT_DASHBOARD: '/student/dashboard',
};

export const ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student',
} as const;
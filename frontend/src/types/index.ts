export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'admin' | 'instructor' | 'student';
}

export interface Course {
  _id: string;
  courseName: string;
  price: number;
  imageUrl: string;
  instructorId: {
    _id: string;
    name: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  studentId: string;
  courseId: Course;
  paymentId: string;
  amount: number;
  status: 'success' | 'failed';
  createdAt: string;
}

export interface Notification {
  _id: string;
  instructorId: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
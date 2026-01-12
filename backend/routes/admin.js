const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllInstructors,
  getAllStudents,
  getPendingCourses,
  approveCourse,
  rejectCourse,
  removeCourse,
  getAllTransactions
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/instructors', getAllInstructors);
router.get('/students', getAllStudents);
router.get('/courses/pending', getPendingCourses);
router.put('/courses/:courseId/approve', approveCourse);
router.put('/courses/:courseId/reject', rejectCourse);
router.delete('/courses/:courseId', removeCourse);
router.get('/transactions', getAllTransactions);

module.exports = router;
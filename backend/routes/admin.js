const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllInstructors,
  getAllStudents,
  getPendingCourses,
  getAllCourses,
  approveCourse,
  rejectCourse,
  removeCourse,
  getAllTransactions,
  getCourseContent
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/instructors', getAllInstructors);
router.get('/students', getAllStudents);
router.get('/courses/all', getAllCourses);
router.get('/courses/pending', getPendingCourses);
router.get('/courses/:courseId/content', getCourseContent);
router.put('/courses/:courseId/approve', approveCourse);
router.put('/courses/:courseId/reject', rejectCourse);
router.delete('/courses/:courseId', removeCourse);
router.get('/transactions', getAllTransactions);

module.exports = router;
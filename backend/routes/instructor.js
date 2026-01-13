const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../utils/upload');
const {
  addCourse,
  getMyCourses,
  updateCourse,
  deleteCourse,
  getNotifications,
  markNotificationRead,
  getAllCourses,
  getCourseContent
} = require('../controllers/instructorController');

const router = express.Router();

// All instructor routes require authentication and instructor role
router.use(auth, authorize('instructor'));

router.post('/courses', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'courseContent', maxCount: 1 }]), addCourse);
router.get('/courses/all', getAllCourses);
router.delete('/courses/:courseId', deleteCourse);
router.get('/courses', getMyCourses);
router.put('/courses/:courseId', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'courseContent', maxCount: 1 }]), updateCourse);
router.get('/courses/:courseId/content', getCourseContent);
router.get('/notifications', getNotifications);
router.put('/notifications/:notificationId/read', markNotificationRead);

module.exports = router;
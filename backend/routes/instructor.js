const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../utils/upload');
const {
  addCourse,
  getMyCourses,
  updateCourse,
  getNotifications,
  markNotificationRead
} = require('../controllers/instructorController');

const router = express.Router();

// All instructor routes require authentication and instructor role
router.use(auth, authorize('instructor'));

router.post('/courses', upload.single('image'), addCourse);
router.get('/courses', getMyCourses);
router.put('/courses/:courseId', upload.single('image'), updateCourse);
router.get('/notifications', getNotifications);
router.put('/notifications/:notificationId/read', markNotificationRead);

module.exports = router;
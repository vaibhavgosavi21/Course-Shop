const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  getApprovedCourses,
  getAllCourses,
  createPaymentIntent,
  confirmPayment,
  directPurchase,
  getPurchaseHistory
} = require('../controllers/studentController');

const router = express.Router();

// All student routes require authentication and student role
router.use(auth, authorize('student'));

router.get('/courses', getApprovedCourses);
router.get('/courses/all', getAllCourses);
router.get('/courses/:courseId/content', require('../controllers/instructorController').getCourseContent);
router.post('/payment/create-intent', createPaymentIntent);
router.post('/payment/confirm', confirmPayment);
router.post('/purchase', directPurchase);
router.get('/purchases', getPurchaseHistory);

module.exports = router;
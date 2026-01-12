const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  getApprovedCourses,
  createPaymentIntent,
  confirmPayment,
  getPurchaseHistory
} = require('../controllers/studentController');

const router = express.Router();

// All student routes require authentication and student role
router.use(auth, authorize('student'));

router.get('/courses', getApprovedCourses);
router.post('/payment/create-intent', createPaymentIntent);
router.post('/payment/confirm', confirmPayment);
router.get('/purchases', getPurchaseHistory);

module.exports = router;
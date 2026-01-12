const Course = require('../models/Course');
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getApprovedCourses = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { status: 'approved' };
    
    if (search) {
      query.courseName = { $regex: search, $options: 'i' };
    }

    const courses = await Course.find(query)
      .populate('instructorId', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPaymentIntent = async (req, res) => {
  try {
    const { courseId } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course || course.status !== 'approved') {
      return res.status(404).json({ message: 'Course not found or not available' });
    }

    // Check if student already purchased this course
    const existingOrder = await Order.findOne({
      studentId: req.user._id,
      courseId: courseId,
      status: 'success'
    });

    if (existingOrder) {
      return res.status(400).json({ message: 'You have already purchased this course' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.price * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        courseId: courseId.toString(),
        studentId: req.user._id.toString()
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    const order = await Order.create({
      studentId: req.user._id,
      courseId: paymentIntent.metadata.courseId,
      paymentId: paymentIntentId,
      amount: paymentIntent.amount / 100,
      status: paymentIntent.status === 'succeeded' ? 'success' : 'failed'
    });

    res.json({
      success: true,
      message: paymentIntent.status === 'succeeded' ? 'Payment successful' : 'Payment failed',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPurchaseHistory = async (req, res) => {
  try {
    const orders = await Order.find({ 
      studentId: req.user._id,
      status: 'success'
    })
    .populate('courseId', 'courseName price imageUrl')
    .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getApprovedCourses,
  createPaymentIntent,
  confirmPayment,
  getPurchaseHistory
};
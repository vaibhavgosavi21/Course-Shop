const Course = require('../models/Course');
const Order = require('../models/Order');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendPurchaseEmail } = require('../utils/emailService');

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

const getAllCourses = async (req, res) => {
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
    .populate('courseId', 'courseName price imageUrl courseContentUrl')
    .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const directPurchase = async (req, res) => {
  try {
    const { courseId } = req.body;
    
    const course = await Course.findById(courseId).populate('instructorId', 'name');
    if (!course || course.status !== 'approved') {
      return res.status(404).json({ message: 'Course not found or not available' });
    }

    const existingOrder = await Order.findOne({
      studentId: req.user._id,
      courseId: courseId,
      status: 'success'
    });

    if (existingOrder) {
      return res.status(400).json({ message: 'You have already purchased this course' });
    }

    const order = await Order.create({
      studentId: req.user._id,
      courseId: courseId,
      paymentId: 'direct_' + Date.now(),
      amount: course.price,
      status: 'success'
    });

    // Send purchase confirmation email
    try {
      await sendPurchaseEmail(req.user.email, req.user.name, course.courseName, course.price);
    } catch (emailError) {
      console.error('Email send failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Course purchased successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getApprovedCourses,
  getAllCourses,
  createPaymentIntent,
  confirmPayment,
  directPurchase,
  getPurchaseHistory
};
const User = require('../models/User');
const Course = require('../models/Course');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { sendCourseApprovalEmail, sendCourseRejectionEmail } = require('../utils/emailService');

const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const totalTransactions = await Order.countDocuments();

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalInstructors,
        totalCourses,
        totalTransactions
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' }).select('-password');
    res.json({ success: true, instructors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingCourses = async (req, res) => {
  try {
    const pendingCourses = await Course.find({ status: 'pending' })
      .populate('instructorId', 'name email');
    res.json({ success: true, courses: pendingCourses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByIdAndUpdate(
      courseId,
      { status: 'approved' },
      { new: true }
    ).populate('instructorId', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await Notification.create({
      instructorId: course.instructorId._id,
      message: `Your course "${course.courseName}" has been approved and is now live!`
    });

    // Send approval email
    try {
      await sendCourseApprovalEmail(course.instructorId.email, course.instructorId.name, course.courseName);
    } catch (emailError) {
      console.error('Email send failed:', emailError);
    }

    res.json({ success: true, message: 'Course approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { reason } = req.body;
    
    const course = await Course.findByIdAndUpdate(
      courseId,
      { status: 'rejected' },
      { new: true }
    ).populate('instructorId', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await Notification.create({
      instructorId: course.instructorId._id,
      message: `Your course "${course.courseName}" has been rejected. Reason: ${reason || 'No reason provided'}`
    });

    // Send rejection email
    try {
      await sendCourseRejectionEmail(course.instructorId.email, course.instructorId.name, course.courseName, reason);
    } catch (emailError) {
      console.error('Email send failed:', emailError);
    }

    res.json({ success: true, message: 'Course rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ success: true, message: 'Course removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Order.find()
      .populate('studentId', 'name email')
      .populate('courseId', 'courseName price')
      .sort({ createdAt: -1 });

    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseContent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Admin has full access to all course content
    res.json({ success: true, contentUrl: course.courseContentUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addInstructor = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const instructor = await User.create({
      name,
      email,
      mobile,
      password,
      role: 'instructor'
    });

    res.status(201).json({
      success: true,
      message: 'Instructor added successfully',
      instructor: { _id: instructor._id, name: instructor.name, email: instructor.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    
    const instructor = await User.findOneAndDelete({ _id: instructorId, role: 'instructor' });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.json({ success: true, message: 'Instructor removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { name, email, mobile } = req.body;
    
    const student = await User.findOneAndUpdate(
      { _id: studentId, role: 'student' },
      { name, email, mobile },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await User.findOneAndDelete({ _id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
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

module.exports = {
  getDashboardStats,
  getAllInstructors,
  getAllStudents,
  getPendingCourses,
  getAllCourses,
  approveCourse,
  rejectCourse,
  removeCourse,
  getAllTransactions,
  getCourseContent,
  addInstructor,
  removeInstructor,
  updateStudent,
  removeStudent
};
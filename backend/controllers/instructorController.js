const Course = require('../models/Course');
const Notification = require('../models/Notification');

const addCourse = async (req, res) => {
  try {
    const { courseName, price } = req.body;
    
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'Course image is required' });
    }

    const courseData = {
      courseName,
      price,
      imageUrl: `/uploads/${req.files.image[0].filename}`,
      instructorId: req.user._id
    };

    if (req.files.courseContent) {
      courseData.courseContentUrl = `/uploads/${req.files.courseContent[0].filename}`;
    }

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      message: 'Course submitted for approval',
      course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.user._id });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { courseName, price } = req.body;

    const course = await Course.findOne({ 
      _id: courseId, 
      instructorId: req.user._id 
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const updateData = { courseName, price };
    if (req.files) {
      if (req.files.image) {
        updateData.imageUrl = `/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.courseContent) {
        updateData.courseContentUrl = `/uploads/${req.files.courseContent[0].filename}`;
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      instructorId: req.user._id 
    }).sort({ createdAt: -1 });

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await Notification.findByIdAndUpdate(
      notificationId,
      { status: 'read' }
    );

    res.json({ success: true, message: 'Notification marked as read' });
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

const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findOneAndDelete({
      _id: courseId,
      instructorId: req.user._id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }

    res.json({ success: true, message: 'Course deleted successfully' });
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

    // Check if user is the instructor of this course
    if (course.instructorId.toString() === req.user._id.toString()) {
      return res.json({ success: true, contentUrl: course.courseContentUrl });
    }

    // Check if student has purchased this course
    if (req.user.role === 'student') {
      const Order = require('../models/Order');
      const purchase = await Order.findOne({
        studentId: req.user._id,
        courseId: courseId,
        status: 'success'
      });

      if (purchase) {
        return res.json({ success: true, contentUrl: course.courseContentUrl });
      }
    }

    res.status(403).json({ message: 'Access denied. Purchase required.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addCourse,
  getMyCourses,
  updateCourse,
  deleteCourse,
  getNotifications,
  markNotificationRead,
  getAllCourses,
  getCourseContent
};
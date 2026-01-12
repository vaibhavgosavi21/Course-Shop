const Course = require('../models/Course');
const Notification = require('../models/Notification');

const addCourse = async (req, res) => {
  try {
    const { courseName, price } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Course image is required' });
    }

    const course = await Course.create({
      courseName,
      price,
      imageUrl: `/uploads/${req.file.filename}`,
      instructorId: req.user._id
    });

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
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
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

module.exports = {
  addCourse,
  getMyCourses,
  updateCourse,
  getNotifications,
  markNotificationRead
};
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { instructorAPI } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('mycourses');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseName: '',
    price: '',
    image: null,
    courseContent: null
  });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, course: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesRes, allCoursesRes, notificationsRes] = await Promise.all([
        instructorAPI.getMyCourses(),
        instructorAPI.getAllCourses(),
        instructorAPI.getNotifications()
      ]);

      setCourses(coursesRes.data.courses);
      setAllCourses(allCoursesRes.data.courses);
      setNotifications(notificationsRes.data.notifications);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'image' || e.target.name === 'courseContent') {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('courseName', formData.courseName);
    data.append('price', formData.price);
    if (formData.image) {
      data.append('image', formData.image);
    }
    if (formData.courseContent) {
      data.append('courseContent', formData.courseContent);
    }

    try {
      if (editingCourse) {
        await instructorAPI.updateCourse(editingCourse._id, data);
        toast.success('Course updated successfully');
      } else {
        await instructorAPI.addCourse(data);
        toast.success('Course submitted for approval');
      }

      setFormData({ courseName: '', price: '', image: null, courseContent: null });
      setShowAddForm(false);
      setEditingCourse(null);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      courseName: course.courseName,
      price: course.price,
      image: null,
      courseContent: null
    });
    setShowAddForm(true);
  };

  const handleDelete = async (course) => {
    setConfirmModal({ isOpen: true, course });
  };

  const handleAccessContent = async (courseId) => {
    try {
      const response = await instructorAPI.getCourseContent(courseId);
      if (response.data.success && response.data.contentUrl) {
        window.open(`http://localhost:5001${response.data.contentUrl}`, '_blank');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Access denied');
    }
  };

  const confirmDelete = async () => {
    try {
      await instructorAPI.deleteCourse(confirmModal.course._id);
      toast.success('Course deleted successfully');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    } finally {
      setConfirmModal({ isOpen: false, course: null });
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await instructorAPI.markNotificationRead(notificationId);
      loadData();
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div className="instructor-dashboard">
      <header className="dashboard-header">
        <h1>Educator Dashboard</h1>
        <div className="header-actions">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'mycourses' ? 'active' : ''}
          onClick={() => setActiveTab('mycourses')}
        >
          My Courses
        </button>
        <button 
          className={activeTab === 'allcourses' ? 'active' : ''}
          onClick={() => setActiveTab('allcourses')}
        >
          Browse Courses
        </button>
        <button 
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications ({notifications.filter(n => n.status === 'unread').length})
        </button>
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'mycourses' && (
          <div className="courses-section">
            <div className="section-header">
              <h2>My Courses</h2>
              <button 
                onClick={() => setShowAddForm(true)}
                className="add-course-btn"
              >
                Add New Course
              </button>
            </div>

            {showAddForm && (
              <div className="course-form-overlay">
                <div className="course-form">
                  <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="courseName"
                      placeholder="Course Name"
                      value={formData.courseName}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="number"
                      name="price"
                      placeholder="Course Price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleInputChange}
                      required={!editingCourse}
                    />
                    <div className="file-input-group">
                      <label>Course Content (PDF, Video, ZIP):</label>
                      <input
                        type="file"
                        name="courseContent"
                        accept=".pdf,.mp4,.avi,.mov,.zip"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit">
                        {editingCourse ? 'Update Course' : 'Add Course'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingCourse(null);
                          setFormData({ courseName: '', price: '', image: null, courseContent: null });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="courses-grid">
              {courses.map(course => (
                <div key={course._id} className="course-card">
                  <img src={`http://localhost:5001${course.imageUrl}`} alt={course.courseName} />
                  <div className="course-info">
                    <h3>{course.courseName}</h3>
                    <p className="price">${course.price}</p>
                    <p 
                      className="status"
                      style={{ color: getStatusColor(course.status) }}
                    >
                      Status: {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </p>
                    <div className="course-actions">
                      <button 
                        onClick={() => handleEdit(course)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(course)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                      {course.courseContentUrl && (
                        <button 
                          onClick={() => handleAccessContent(course._id)}
                          className="access-btn"
                        >
                          Access Content
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'allcourses' && (
          <div className="courses-section">
            <div className="section-header">
              <h2>Browse Courses</h2>
            </div>

            <div className="courses-grid">
              {allCourses.map(course => (
                <div key={course._id} className="course-card">
                  <img src={`http://localhost:5001${course.imageUrl}`} alt={course.courseName} />
                  <div className="course-info">
                    <h3>{course.courseName}</h3>
                    <p className="instructor">By: {course.instructorId.name}</p>
                    <p className="price">${course.price}</p>
                    <p 
                      className="status"
                      style={{ color: getStatusColor(course.status) }}
                    >
                      Status: {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="notifications-section">
            <h2>Notifications</h2>
            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div 
                    key={notification._id} 
                    className={`notification ${notification.status}`}
                    onClick={() => markNotificationRead(notification._id)}
                  >
                    <p>{notification.message}</p>
                    <small>{new Date(notification.createdAt).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Educator Profile</h2>
            <div className="profile-card">
              <div className="profile-info">
                <h3>Personal Information</h3>
                <div className="info-row">
                  <label>Name:</label>
                  <span>{user?.name}</span>
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <span>{user?.email}</span>
                </div>
                <div className="info-row">
                  <label>Role:</label>
                  <span className="role-badge instructor">Educator</span>
                </div>
                <div className="info-row">
                  <label>Total Courses:</label>
                  <span>{courses.length}</span>
                </div>
                <div className="info-row">
                  <label>Approved Courses:</label>
                  <span>{courses.filter(c => c.status === 'approved').length}</span>
                </div>
                <div className="info-row">
                  <label>Account Status:</label>
                  <span className="status-badge active">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Course"
        message={`Are you sure you want to delete "${confirmModal.course?.courseName}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, course: null })}
      />
    </div>
  );
};

export default InstructorDashboard;
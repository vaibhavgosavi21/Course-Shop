import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { instructorAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseName: '',
    price: '',
    image: null,
    courseContent: null
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesRes, notificationsRes] = await Promise.all([
        instructorAPI.getMyCourses(),
        instructorAPI.getNotifications()
      ]);

      setCourses(coursesRes.data.courses);
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
    <DashboardLayout title="INSTRUCTOR DASHBOARD" userRole="Instructor">
      <nav className="nav-tabs">
        <button 
          className={activeTab === 'courses' ? 'active' : ''}
          onClick={() => setActiveTab('courses')}
        >
          My Courses
        </button>
        <button 
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications ({notifications.filter(n => n.status === 'unread').length})
        </button>
      </nav>

      <main className="main-section">
        {activeTab === 'courses' && (
          <div className="courses-section">
            <div className="section-header">
              <h2>My Courses</h2>
              <button 
                onClick={() => setShowAddForm(true)}
                className="add-btn"
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
                    <div className="file-input-group">
                      <label>Course Profile Image:</label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleInputChange}
                        required={!editingCourse}
                      />
                    </div>
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

            <div className="course-grid">
              {courses.map(course => (
                <div key={course._id} className="course-item">
                  <img src={`http://localhost:5001${course.imageUrl}`} alt={course.courseName} />
                  <div className="course-details">
                    <h3>{course.courseName}</h3>
                    <p className="price">${course.price}</p>
                    <p 
                      className="status"
                      style={{ color: getStatusColor(course.status) }}
                    >
                      Status: {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </p>
                    <button 
                      onClick={() => handleEdit(course)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
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
      </main>
    </DashboardLayout>
  );
};

export default InstructorDashboard;
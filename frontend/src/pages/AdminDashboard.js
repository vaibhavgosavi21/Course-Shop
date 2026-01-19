import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import ContentViewer from '../components/ContentViewer';
import Footer from '../components/Footer';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({});
  const [pendingCourses, setPendingCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, courseId: null, courseName: '' });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, courseId: null, reason: '' });
  const [addInstructorModal, setAddInstructorModal] = useState(false);
  const [instructorForm, setInstructorForm] = useState({ name: '', email: '', mobile: '', password: '' });
  const [viewingContent, setViewingContent] = useState(null);
  const [editStudentModal, setEditStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, coursesRes, allCoursesRes, instructorsRes, studentsRes, transactionsRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getPendingCourses(),
        adminAPI.getAllCourses(),
        adminAPI.getInstructors(),
        adminAPI.getStudents(),
        adminAPI.getTransactions()
      ]);

      setStats(statsRes.data.stats);
      setPendingCourses(coursesRes.data.courses);
      setAllCourses(allCoursesRes.data.courses);
      setInstructors(instructorsRes.data.instructors);
      setStudents(studentsRes.data.students);
      setTransactions(transactionsRes.data.transactions);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  };

  const handleApproveCourse = async (courseId) => {
    try {
      await adminAPI.approveCourse(courseId);
      toast.success('Course approved successfully');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to approve course');
    }
  };

  const handleRejectCourse = async (courseId) => {
    setRejectModal({ isOpen: true, courseId, reason: '' });
  };

  const confirmRejectCourse = async () => {
    if (!rejectModal.reason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }

    try {
      await adminAPI.rejectCourse(rejectModal.courseId, rejectModal.reason);
      toast.success('Course rejected successfully');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to reject course');
    } finally {
      setRejectModal({ isOpen: false, courseId: null, reason: '' });
    }
  };

  const handleAccessContent = async (courseId, contentUrl) => {
    if (contentUrl) {
      setViewingContent(contentUrl);
    } else {
      toast.info('No course content available');
    }
  };

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addInstructor(instructorForm);
      toast.success('Instructor added successfully');
      setAddInstructorModal(false);
      setInstructorForm({ name: '', email: '', mobile: '', password: '' });
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add instructor');
    }
  };

  const handleRemoveInstructor = async (instructorId) => {
    if (window.confirm('Are you sure you want to remove this instructor?')) {
      try {
        await adminAPI.removeInstructor(instructorId);
        toast.success('Instructor removed successfully');
        loadDashboardData();
      } catch (error) {
        toast.error('Failed to remove instructor');
      }
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setEditStudentModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateStudent(editingStudent._id, {
        name: editingStudent.name,
        email: editingStudent.email,
        mobile: editingStudent.mobile
      });
      toast.success('Student updated successfully');
      setEditStudentModal(false);
      setEditingStudent(null);
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update student');
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      try {
        await adminAPI.removeStudent(studentId);
        toast.success('Student removed successfully');
        loadDashboardData();
      } catch (error) {
        toast.error('Failed to remove student');
      }
    }
  };

  const handleRemoveCourse = async (courseId, courseName) => {
    setConfirmModal({ isOpen: true, courseId, courseName });
  };

  const confirmRemoveCourse = async () => {
    try {
      await adminAPI.removeCourse(confirmModal.courseId);
      toast.success('Course removed successfully');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to remove course');
    } finally {
      setConfirmModal({ isOpen: false, courseId: null, courseName: '' });
    }
  };

  return (
    <div className="page-container">
      <div className="nav-header">
        <div className="nav-container">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <div className="header-actions">
            <span className="text-secondary">Welcome, {user?.name}</span>
            <button onClick={logout} className="btn btn-outline">Logout</button>
          </div>
        </div>
      </div>

      <div className="content-wrapper" style={{paddingTop: '100px'}}>
        <nav className="dashboard-nav mb-3">
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('courses')}
          >
            Pending Courses
          </button>
          <button 
            className={`btn ${activeTab === 'allcourses' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('allcourses')}
          >
            All Courses
          </button>
          <button 
            className={`btn ${activeTab === 'instructors' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('instructors')}
          >
            Educators
          </button>
          <button 
            className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button 
            className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button 
            className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </nav>

        <main className="dashboard-content">
          {activeTab === 'dashboard' && (
            <div className="grid grid-4">
              <div className="stat-card">
                <div className="stat-number">{stats.totalStudents || 0}</div>
                <div className="stat-label">Total Students</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.totalInstructors || 0}</div>
                <div className="stat-label">Total Educators</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.totalCourses || 0}</div>
                <div className="stat-label">Total Courses</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.totalTransactions || 0}</div>
                <div className="stat-label">Total Transactions</div>
              </div>
            </div>
          )}

        {activeTab === 'courses' && (
          <div className="courses-section">
            <h2>Pending Course Approvals</h2>
            {pendingCourses.length === 0 ? (
              <div className="no-courses-message">
                <p>No pending courses.</p>
              </div>
            ) : (
              <div className="courses-grid">
                {pendingCourses.map(course => (
                  <div key={course._id} className="course-card">
                    <img src={`http://localhost:5001${course.imageUrl}`} alt={course.courseName} />
                    <h3>{course.courseName}</h3>
                    <p>Price: ${course.price}</p>
                    <p>Educator: {course.instructorId.name}</p>
                    <div className="course-actions">
                      <button 
                        onClick={() => handleApproveCourse(course._id)}
                        className="approve-btn"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleRejectCourse(course._id)}
                        className="reject-btn"
                      >
                        Reject
                      </button>
                      {course.courseContentUrl && (
                        <button 
                          onClick={() => handleAccessContent(course._id, course.courseContentUrl)}
                          className="access-btn"
                        >
                          View Content
                        </button>
                      )}
                      <button 
                        onClick={() => handleRemoveCourse(course._id, course.courseName)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'allcourses' && (
          <div className="courses-section">
            <h2>All Courses</h2>
            {allCourses.length === 0 ? (
              <p>No courses found</p>
            ) : (
              <div className="courses-grid">
                {allCourses.map(course => (
                  <div key={course._id} className="course-card">
                    <img src={`http://localhost:5001${course.imageUrl}`} alt={course.courseName} />
                    <h3>{course.courseName}</h3>
                    <p>Price: ${course.price}</p>
                    <p>Educator: {course.instructorId.name}</p>
                    <p className={`status ${course.status}`}>Status: {course.status}</p>
                    <div className="course-actions">
                      {course.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveCourse(course._id)}
                            className="approve-btn"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectCourse(course._id)}
                            className="reject-btn"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {course.courseContentUrl && (
                        <button 
                          onClick={() => handleAccessContent(course._id, course.courseContentUrl)}
                          className="access-btn"
                        >
                          View Content
                        </button>
                      )}
                      <button 
                        onClick={() => handleRemoveCourse(course._id, course.courseName)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'instructors' && (
          <div className="users-section">
            <div className="section-header">
              <h2>All Educators</h2>
              <button onClick={() => setAddInstructorModal(true)} className="add-btn">
                Add Educator
              </button>
            </div>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map(instructor => (
                    <tr key={instructor._id}>
                      <td>{instructor.name}</td>
                      <td>{instructor.email}</td>
                      <td>{instructor.mobile}</td>
                      <td>{new Date(instructor.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button 
                          onClick={() => handleRemoveInstructor(instructor._id)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="users-section">
            <h2>All Students</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.mobile}</td>
                      <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button 
                          onClick={() => handleEditStudent(student)}
                          className="edit-btn"
                          style={{marginRight: '0.5rem'}}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleRemoveStudent(student._id)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-section">
            <h2>All Transactions</h2>
            <div className="transactions-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction._id}>
                      <td>{transaction.studentId.name}</td>
                      <td>{transaction.courseId.courseName}</td>
                      <td>${transaction.amount}</td>
                      <td className={`status ${transaction.status}`}>
                        {transaction.status}
                      </td>
                      <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Admin Profile</h2>
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
                  <span className="role-badge admin">Administrator</span>
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
      </div>
      <Footer />
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Remove Course"
        message={`Are you sure you want to remove "${confirmModal.courseName}"? This action cannot be undone.`}
        onConfirm={confirmRemoveCourse}
        onCancel={() => setConfirmModal({ isOpen: false, courseId: null, courseName: '' })}
      />
      
      {rejectModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reject Course</h3>
            <p>Please provide a reason for rejecting this course:</p>
            <textarea
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              placeholder="Enter rejection reason..."
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={confirmRejectCourse} className="confirm-btn">
                Reject Course
              </button>
              <button 
                onClick={() => setRejectModal({ isOpen: false, courseId: null, reason: '' })}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {addInstructorModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Educator</h3>
            <form onSubmit={handleAddInstructor}>
              <input
                type="text"
                placeholder="Name"
                value={instructorForm.name}
                onChange={(e) => setInstructorForm({...instructorForm, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={instructorForm.email}
                onChange={(e) => setInstructorForm({...instructorForm, email: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Mobile (10 digits)"
                value={instructorForm.mobile}
                onChange={(e) => setInstructorForm({...instructorForm, mobile: e.target.value})}
                required
                pattern="[0-9]{10}"
              />
              <input
                type="password"
                placeholder="Password"
                value={instructorForm.password}
                onChange={(e) => setInstructorForm({...instructorForm, password: e.target.value})}
                required
                minLength="6"
              />
              <div className="modal-actions">
                <button type="submit" className="confirm-btn">Add Educator</button>
                <button 
                  type="button" 
                  onClick={() => setAddInstructorModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {editStudentModal && editingStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Student</h3>
            <form onSubmit={handleUpdateStudent}>
              <input
                type="text"
                placeholder="Name"
                value={editingStudent.name}
                onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={editingStudent.email}
                onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Mobile (10 digits)"
                value={editingStudent.mobile}
                onChange={(e) => setEditingStudent({...editingStudent, mobile: e.target.value})}
                required
                pattern="[0-9]{10}"
              />
              <div className="modal-actions">
                <button type="submit" className="confirm-btn">Update Student</button>
                <button 
                  type="button" 
                  onClick={() => {
                    setEditStudentModal(false);
                    setEditingStudent(null);
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {viewingContent && (
        <ContentViewer
          contentUrl={viewingContent}
          onClose={() => setViewingContent(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
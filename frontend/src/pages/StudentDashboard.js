import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import scannerImage from '../assets/images/Scanner.jfif';
import linkLogo from '../assets/logos/linklogo.png';
import ContentViewer from '../components/ContentViewer';
import Footer from '../components/Footer';
import './StudentDashboard.css';

const PaymentForm = ({ course, onSuccess, onCancel }) => {
  const [processing, setProcessing] = useState(false);

  const handleQRPayment = async () => {
    setProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      toast.success('Payment successful! Course purchased.');
      onSuccess();
      setProcessing(false);
    }, 1000);
  };

  return (
    <div className="payment-form-overlay">
      <div className="payment-form">
        <h3>Purchase Course</h3>
        <div className="course-summary">
          <h4>{course.courseName}</h4>
          <p>Price: ${course.price}</p>
        </div>
        
        <div className="qr-payment">
          <h4>Scan to Pay</h4>
          <div className="qr-code">
            <img src={scannerImage} alt="Payment QR Code" />
            <p>Scan this QR code with your mobile payment app</p>
          </div>
          
          <div className="payment-actions">
            <button 
              onClick={handleQRPayment}
              disabled={processing}
              className="pay-btn"
            >
              {processing ? 'Processing Payment...' : `Confirm Payment $${course.price}`}
            </button>
            <button 
              onClick={onCancel}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewingContent, setViewingContent] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const delayedSearch = setTimeout(() => {
        loadCourses(searchTerm);
      }, 500);
      return () => clearTimeout(delayedSearch);
    } else {
      loadCourses();
    }
  }, [searchTerm]);

  const loadData = async () => {
    try {
      const [coursesRes, purchasesRes] = await Promise.all([
        studentAPI.getCourses(),
        studentAPI.getPurchaseHistory()
      ]);

      setCourses(coursesRes.data.courses);
      setPurchases(purchasesRes.data.orders);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const loadCourses = async (search = '') => {
    try {
      const response = await studentAPI.getCourses(search);
      setCourses(response.data.courses);
    } catch (error) {
      toast.error('Failed to load courses');
    }
  };

  const handleAccessContent = async (contentUrl) => {
    if (contentUrl) {
      setViewingContent(contentUrl);
    } else {
      toast.info('No course content available');
    }
  };

  const handlePurchaseSuccess = async () => {
    try {
      const response = await studentAPI.directPurchase(selectedCourse._id);
      if (response.data.success) {
        toast.success('Course purchased successfully!');
        loadData();
        setSelectedCourse(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed');
    }
  };

  const isPurchased = (courseId) => {
    return purchases.some(purchase => purchase.courseId._id === courseId);
  };

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <img src={linkLogo} alt="LinkCode" className="logo-image" />
          </div>
          <h1>STUDENT DASHBOARD</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">Student</span>
          </div>
          <div className="user-avatar">{user?.name?.charAt(0)}</div>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'courses' ? 'active' : ''}
          onClick={() => setActiveTab('courses')}
        >
          Browse Courses
        </button>
        <button 
          className={activeTab === 'purchases' ? 'active' : ''}
          onClick={() => setActiveTab('purchases')}
        >
          My Purchases
        </button>
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'courses' && (
          <div className="courses-section">
            <div className="search-section">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="courses-grid">
              {courses.length === 0 ? (
                <div className="no-courses-message">
                  {searchTerm ? (
                    <p>No courses found for "{searchTerm}". Try a different search term.</p>
                  ) : (
                    <p>No courses available at the moment.</p>
                  )}
                </div>
              ) : (
                courses.map(course => (
                  <div key={course._id} className="course-card">
                    <img src={getImageUrl(course.imageUrl)} alt={course.courseName} />
                    <div className="course-info">
                      <h3>{course.courseName}</h3>
                      <p className="instructor">By: {course.instructorId.name}</p>
                      <p className="price">${course.price}</p>
                      
                      {isPurchased(course._id) ? (
                        <button className="purchased-btn" disabled>
                          Already Purchased
                        </button>
                      ) : (
                        <button 
                          onClick={() => setSelectedCourse(course)}
                          className="buy-btn"
                        >
                          Buy Now
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="purchases-section">
            <h2>My Purchases</h2>
            {purchases.length === 0 ? (
              <p>No purchases yet</p>
            ) : (
              <div className="purchases-grid">
                {purchases.map(purchase => (
                  <div key={purchase._id} className="purchase-card">
                    <img 
                      src={getImageUrl(purchase.courseId.imageUrl)} 
                      alt={purchase.courseId.courseName} 
                    />
                    <div className="purchase-info">
                      <h3>{purchase.courseId.courseName}</h3>
                      <p className="amount">Paid: ${purchase.amount}</p>
                      <p className="date">
                        Purchased: {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                      {purchase.courseId.courseContentUrl && (
                        <button 
                          onClick={() => handleAccessContent(purchase.courseId.courseContentUrl)}
                          className="access-btn"
                        >
                          Access Content
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Student Profile</h2>
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
                  <span className="role-badge student">Student</span>
                </div>
                <div className="info-row">
                  <label>Courses Purchased:</label>
                  <span>{purchases.length}</span>
                </div>
                <div className="info-row">
                  <label>Account Status:</label>
                  <span className="status-badge active">Active</span>
                </div>
              </div>
              
              <div className="profile-info" style={{marginTop: '2rem'}}>
                <h3>Purchase History</h3>
                {purchases.length === 0 ? (
                  <p style={{textAlign: 'center', color: '#718096', padding: '2rem'}}>No purchases yet</p>
                ) : (
                  <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                    {purchases.map(purchase => (
                      <div key={purchase._id} className="info-row" style={{flexDirection: 'column', alignItems: 'flex-start', padding: '1rem 0'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '0.5rem'}}>
                          <strong>{purchase.courseId.courseName}</strong>
                          <span style={{color: '#4facfe', fontWeight: 'bold'}}>${purchase.amount}</span>
                        </div>
                        <small style={{color: '#718096'}}>{new Date(purchase.createdAt).toLocaleDateString()}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {selectedCourse && (
        <PaymentForm
          course={selectedCourse}
          onSuccess={handlePurchaseSuccess}
          onCancel={() => setSelectedCourse(null)}
        />
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

export default StudentDashboard;
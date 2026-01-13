import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import './StudentDashboard.css';

const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');

const PaymentForm = ({ course, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // Create payment intent
      const { data } = await studentAPI.createPaymentIntent(course._id);
      
      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        // Confirm payment on backend
        await studentAPI.confirmPayment(result.paymentIntent.id);
        toast.success('Payment successful! Course purchased.');
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    }

    setProcessing(false);
  };

  return (
    <div className="payment-form-overlay">
      <div className="payment-form">
        <h3>Purchase Course</h3>
        <div className="course-summary">
          <h4>{course.courseName}</h4>
          <p>Price: ${course.price}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="card-element">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
          
          <div className="payment-actions">
            <button 
              type="submit" 
              disabled={!stripe || processing}
              className="pay-btn"
            >
              {processing ? 'Processing...' : `Pay $${course.price}`}
            </button>
            <button 
              type="button" 
              onClick={onCancel}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

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

  const handlePurchaseSuccess = () => {
    setSelectedCourse(null);
    loadData();
  };

  const isPurchased = (courseId) => {
    return purchases.some(purchase => purchase.courseId._id === courseId);
  };

  return (
    <DashboardLayout title="STUDENT DASHBOARD" userRole="Student">
      <nav className="nav-tabs">
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
      </nav>

      <main className="main-section">
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

            <div className="course-grid">
              {courses.map(course => (
                <div key={course._id} className="course-item">
                  <img src={`http://localhost:5000${course.imageUrl}`} alt={course.courseName} />
                  <div className="course-details">
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
              ))}
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="purchases-section">
            <h2>My Purchases</h2>
            {purchases.length === 0 ? (
              <p>No purchases yet</p>
            ) : (
              <div className="purchase-grid">
                {purchases.map(purchase => (
                  <div key={purchase._id} className="purchase-item">
                    <img 
                      src={`http://localhost:5000${purchase.courseId.imageUrl}`} 
                      alt={purchase.courseId.courseName} 
                    />
                    <div className="purchase-details">
                      <h3>{purchase.courseId.courseName}</h3>
                      <p className="amount">Paid: ${purchase.amount}</p>
                      <p className="date">
                        Purchased: {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                      <button className="access-btn">
                        Access Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {selectedCourse && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            course={selectedCourse}
            onSuccess={handlePurchaseSuccess}
            onCancel={() => setSelectedCourse(null)}
          />
        </Elements>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
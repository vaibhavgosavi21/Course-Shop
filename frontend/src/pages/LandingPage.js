import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/auth/${role}`);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">The Course Shop</span>
          </div>
          <nav className="nav-menu">
            <a href="#home">Home</a>
            <a href="#about">About us</a>
            <a href="#help">Help</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <h1>Welcome to Our Course Shop</h1>
          <p>Choose your role to access the platform</p>

          <div className="role-cards">
            <div className="role-card admin-card">
              <div className="icon-circle">
                <span className="icon">🛡️</span>
              </div>
              <h3>ADMIN</h3>
              <p>Manage courses, users, and platform settings</p>
              <button onClick={() => handleRoleSelect('admin')} className="login-btn">
                Login →
              </button>
            </div>

            <div className="role-card educator-card">
              <div className="icon-circle">
                <span className="icon">📖</span>
              </div>
              <h3>EDUCATOR</h3>
              <p>Create and manage your courses and students</p>
              <button onClick={() => handleRoleSelect('instructor')} className="login-btn">
                Login →
              </button>
            </div>

            <div className="role-card student-card">
              <div className="icon-circle">
                <span className="icon">👤</span>
              </div>
              <h3>STUDENT</h3>
              <p>Access your enrolled courses and materials</p>
              <button onClick={() => handleRoleSelect('student')} className="login-btn">
                Login →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🎓 CourseShop</h3>
            <p>Professional IT training & placement institute helping students build successful careers.</p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <a href="/">Home</a>
            <a href="#courses">Courses</a>
            <a href="#about">About Us</a>
            <a href="#help">Help</a>
          </div>

          <div className="footer-section">
            <h3>Contact Info</h3>
            <p>📧 info@courseshop.com</p>
            <p>📞 +91 9876543210</p>
            <p>📍 Mumbai, India</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 CourseShop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
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
            <span> The Course </span><span className="logo-accent">Shop</span>
          </div>
          <nav className="nav-menu">
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#help">Help</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <h1>The Course Shop</h1>
          <p>Choose your role to continue</p>

          <div className="role-cards">
            <div className="role-card">
              <h3>Admin</h3>
              <p>Manage courses and users</p>
              <button onClick={() => handleRoleSelect('admin')} className="enter-btn">
                Enter
              </button>
            </div>

            <div className="role-card">
              <h3>Educator</h3>
              <p>Create and sell courses</p>
              <button onClick={() => handleRoleSelect('instructor')} className="enter-btn">
                Enter
              </button>
            </div>

            <div className="role-card">
              <h3>Student</h3>
              <p>Browse and buy courses</p>
              <button onClick={() => handleRoleSelect('student')} className="enter-btn">
                Enter
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>CourseShop</h4>
            <p>Professional IT training & placement institute helping students build successful careers.</p>
            <button className="footer-enter-btn">Enter</button>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#courses">Courses</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#help">Help</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-item">
              <span>📧</span>
              <span>info@courseshop.com</span>
            </div>
            <div className="contact-item">
              <span>📞</span>
              <span>+91 9876543210</span>
            </div>
            <div className="contact-item">
              <span>📍</span>
              <span>Mumbai, India</span>
            </div>
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
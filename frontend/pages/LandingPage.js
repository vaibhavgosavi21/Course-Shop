import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/auth/${role}`);
  };

  return (
    <div className="landing-page">
      <Navbar />
      <header className="header">
        <div className="container">
          <div className="logo">CourseShop</div>
          <nav className="nav">
            <a href="#">Home</a>
            <a href="#">Courses</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </header>

      <main className="hero">
        <div className="hero-content">
          <h1>Learn. Teach. Grow.</h1>
          <p>Join thousands of students and instructors on our platform</p>
          <div className="role-cards">
            <div className="role-card" onClick={() => handleRoleSelect('student')}>
              <div className="card-icon">👨‍🎓</div>
              <h3>Student</h3>
              <p>Discover and learn from expert courses</p>
            </div>
            <div className="role-card" onClick={() => handleRoleSelect('instructor')}>
              <div className="card-icon">👨‍🏫</div>
              <h3>Instructor</h3>
              <p>Share your knowledge and earn money</p>
            </div>
            <div className="role-card" onClick={() => handleRoleSelect('admin')}>
              <div className="card-icon">⚙️</div>
              <h3>Admin</h3>
              <p>Manage platform and users</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>CourseShop</h4>
              <p>Empowering education through technology</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#">About Us</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>support@courseshop.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 CourseShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
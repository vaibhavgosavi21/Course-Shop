import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-box">
          <h3>🎓 CourseShop</h3>
          <p>Professional IT training & placement institute helping students build successful careers.</p>
        </div>

        <div className="footer-box">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="#courses">Courses</a>
          <a href="#about">About Us</a>
          <a href="#help">Help</a>
        </div>

        <div className="footer-box">
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
  );
};

export default Footer;
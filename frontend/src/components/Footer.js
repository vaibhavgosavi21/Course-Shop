import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-box">
          <h3>Linkcode</h3>
          <p>Professional IT training & placement institute helping students build successful careers.</p>
        </div>

        <div className="footer-box">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/courses">Courses</a>
          <a href="/about">About Us</a>
          <a href="/help">Help</a>
        </div>

        <div className="footer-box">
          <h3>Contact Info</h3>
          <p>Email: info@linkcode.com</p>
          <p>Phone: +91 9876543210</p>
          <p>Address: Mumbai, India</p>
        </div>

        <div className="footer-box">
          <h3>Follow Us</h3>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Linkcode. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
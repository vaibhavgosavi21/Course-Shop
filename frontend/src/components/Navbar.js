import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          LINK&gt;code
        </div>
        <div className="navbar-menu">
          <a href="#home" className="navbar-link">Home</a>
          <a href="#about" className="navbar-link">About Us</a>
          <a href="#help" className="navbar-link">Help</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
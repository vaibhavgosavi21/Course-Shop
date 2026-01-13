import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/auth/${role}`);
  };

  return (
    <div className="landing-page">
      <Navbar />
      <div className="landing-content">
        <div className="container">
          <h1>The Course Shop</h1>
          <p>Choose your role to continue</p>
          
          <div className="role-cards">
            <div className="role-card" onClick={() => handleRoleSelect('admin')}>
              <h3>Admin</h3>
              <p>Manage courses and users</p>
            </div>
            
            <div className="role-card" onClick={() => handleRoleSelect('instructor')}>
              <h3>Educator</h3>
              <p>Create and sell courses</p>
            </div>
            
            <div className="role-card" onClick={() => handleRoleSelect('student')}>
              <h3>Student</h3>
              <p>Browse and buy courses</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
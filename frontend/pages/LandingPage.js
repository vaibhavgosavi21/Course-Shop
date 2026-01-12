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
      <div className="container">
        <h1>Course Selling Platform</h1>
        <p>Choose your role to continue</p>
        
        <div className="role-cards">
          <div className="role-card" onClick={() => handleRoleSelect('admin')}>
            <h3>Admin</h3>
            <p>Manage courses and users</p>
          </div>
          
          <div className="role-card" onClick={() => handleRoleSelect('instructor')}>
            <h3>Instructor</h3>
            <p>Create and sell courses</p>
          </div>
          
          <div className="role-card" onClick={() => handleRoleSelect('student')}>
            <h3>Student</h3>
            <p>Browse and buy courses</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
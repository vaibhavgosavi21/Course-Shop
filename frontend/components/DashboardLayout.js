import React from 'react';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = ({ children, title, userRole }) => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-layout">
      {/* Blue Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <h1>CourseShop</h1>
        </div>
        <div className="nav-user">
          <span>Hello, {user?.name} ({userRole})</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* White Body */}
      <main className="main-body">
        <div className="page-header">
          <h2>{title}</h2>
        </div>
        <div className="content">
          {children}
        </div>
      </main>

      {/* Blue Footer */}
      <footer className="footer">
        <p>&copy; 2024 CourseShop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DashboardLayout;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ showSearch = false, onSearch }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleSearch = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')}>
        Link<span>code</span>
      </div>

      {showSearch && (
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search courses..." 
            onChange={handleSearch}
          />
        </div>
      )}

      <ul className="nav-links">
        <li><button className="nav-button" onClick={() => navigate('/')}>Home</button></li>
        {isAuthenticated ? (
          <>
            <li><span style={{color: '#7CFC00'}}>Welcome, {user?.name}</span></li>
            <li><button className="nav-button" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><button className="nav-button" onClick={() => navigate('/auth/student')}>Courses</button></li>
            <li><button className="nav-button">About</button></li>
            <li><button className="nav-button">Help</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
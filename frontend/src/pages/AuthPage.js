import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import linkLogo from '../assets/logos/linklogo.png';
import './AuthPage.css';

const AuthPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    role: role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = isLogin 
        ? await authAPI.login({ email: formData.email, password: formData.password, role })
        : await authAPI.register(formData);

      if (response.data.success) {
        login(response.data.token, response.data.user);
        toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
        
        // Redirect based on role
        const redirectPath = {
          admin: '/admin/dashboard',
          instructor: '/instructor/dashboard',
          student: '/student/dashboard'
        }[role] || '/';
        
        navigate(redirectPath);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="nav-header">
        <div className="nav-container">
          <img src={linkLogo} alt="Linkcode" className="nav-logo" />
          <button className="btn btn-outline" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
      
      <div className="auth-content">
        <div className="auth-container">
          <div className="card">
            <div className="card-header text-center">
              <h2 className="card-title">
                {role === 'instructor' ? 'Educator' : role.charAt(0).toUpperCase() + role.slice(1)} 
                {isLogin ? ' Login' : ' Register'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      className="form-input"
                      placeholder="Enter 10-digit mobile number"
                      value={formData.mobile}
                      onChange={handleChange}
                      pattern="[0-9]{10}"
                      maxLength="10"
                      required
                    />
                  </div>
                </>
              )}
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
                {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
              </button>
            </form>
            
            {role !== 'admin' && (
              <div className="text-center mt-2">
                <p className="text-secondary">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <span 
                    className="toggle-link text-primary" 
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setFormData({ name: '', email: '', mobile: '', password: '', role });
                    }}
                    style={{cursor: 'pointer', textDecoration: 'underline'}}
                  >
                    {isLogin ? 'Register' : 'Login'}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
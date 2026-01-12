import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
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
      <div className="auth-container">
        <h2>
          {role === 'instructor' ? 'Educator' : role.charAt(0).toUpperCase() + role.slice(1)} 
          {isLogin ? ' Login' : ' Register'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number (10 digits)"
                value={formData.mobile}
                onChange={handleChange}
                pattern="[6-9][0-9]{9}"
                required
              />
            </>
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            minLength="6"
            required
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        
        {role !== 'admin' && (
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              className="toggle-link" 
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', mobile: '', password: '', role });
              }}
            >
              {isLogin ? 'Register' : 'Login'}
            </span>
          </p>
        )}
        
        <button className="back-btn" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import linkLogo from '../assets/logos/linklogo.png';
import bannerImg from '../assets/images/banner_img.png';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRoleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGetStarted = () => {
    navigate('/auth/student');
  };

  const handleRoleSelect = (role) => {
    setShowRoleDropdown(false);
    navigate(`/auth/${role}`);
  };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <div className="logo">
            <img src={linkLogo} alt="Linkcode" className="logo-image" />
          </div>
          <nav className="nav-menu">
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#training">Training</a>
            <a href="#courses">Courses</a>
            <a href="#placements">Placements</a>
            <a href="#resources">Resources</a>
            <a href="#contact">Contact Us</a>
          </nav>
          <div className="nav-actions" ref={dropdownRef}>
            <button 
              className="login-signup-btn" 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              Login/Signup
            </button>
            {showRoleDropdown && (
              <div className="role-dropdown">
                <button onClick={() => handleRoleSelect('admin')} className="role-option">
                  Admin
                </button>
                <button onClick={() => handleRoleSelect('instructor')} className="role-option">
                  Educator
                </button>
                <button onClick={() => handleRoleSelect('student')} className="role-option">
                  Student
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">100% Placement Assistance</div>
            <h1>
              Leading <span className="highlight">IT Training Institute</span> in India, 
              Assured job placement in top MNC's
            </h1>
            <p>
              As India's leading IT training institute, we provide industry-relevant 
              courses designed to enhance your technical skills. With assured job 
              placement in top MNCs, we help you secure a successful career in the 
              IT industry.
            </p>
            <div className="hero-actions">
              <button className="explore-btn" onClick={handleGetStarted}>
                EXPLORE COURSES
              </button>
              <div className="contact-info">
                <span className="phone-icon">{/* Add phone icon here */}</span>
                <div>
                  <small>Have any Question?</small>
                  <strong>950-443-0453</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="student-image">
              <img src={bannerImg} alt="Student" className="banner-image" />
              <div className="stat-card total-students">
                <div className="stat-icon"></div>
                <div>
                  <small>Total Students</small>
                  <strong>16K</strong>
                </div>
              </div>
              <div className="stat-card complete-graduation">
                <div className="stat-icon"></div>
                <div>
                  <small>Complete Graduation</small>
                  <strong>34K</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3>15+</h3>
            <p>Years</p>
          </div>
          <div className="stat-item green">
            <h3>20K+</h3>
            <p>Students Trained</p>
          </div>
          <div className="stat-item">
            <h3>60LPA+</h3>
            <p>Highest Package Received</p>
          </div>
          <div className="stat-item green">
            <h3>5K+</h3>
            <p>Students Placed</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-container">
          <div className="about-images">
            <div className="experience-badge">
              <strong>15+</strong>
              <span>Years of Experience</span>
            </div>
            <div className="team-image">
              {/* Add team image here */}
            </div>
            <div className="instructor-image">
              {/* Add instructor image here */}
            </div>
          </div>
          <div className="about-content">
            <div className="section-header">
              <small>Get To Know About Us</small>
              <h2>India's Best Professional <span className="highlight">IT Training Institute</span></h2>
            </div>
            <p>
              The faculties and the staff members here at Linkcode 
              Technologies are committed to providing top-tier education and 
              career support for aspiring IT professionals.
            </p>
            <div className="features">
              <div className="feature">
                <span className="feature-icon">{/* Add icon here */}</span>
                <div>
                  <strong>100% Placement Assistance</strong>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">{/* Add icon here */}</span>
                <div>
                  <strong>Industry Oriented Hands-On Training</strong>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">{/* Add icon here */}</span>
                <div>
                  <strong>Work on the Live Projects</strong>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">{/* Add icon here */}</span>
                <div>
                  <strong>Online Live Training with Recorded Sessions</strong>
                </div>
              </div>
            </div>
            <button className="discover-btn">DISCOVER MORE</button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <h2>Why To Choose <span className="highlight">Linkcode IT Training Institute</span> in India</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨🏫</div>
              <h4>Experienced and Certified Trainers</h4>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h4>Internship Opportunities with real clients</h4>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h4>Support and Career guidance</h4>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛠️</div>
              <h4>Hands-on projects from Day one</h4>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h4>Interview on Live Projects</h4>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏗️</div>
              <h4>Build Your Own Projects</h4>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👑</div>
              <h4>Soft Skill Training</h4>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏢</div>
              <h4>Get Placed in Top MNCs</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <small>Our Testimonials</small>
            <h2>What's Our <span className="highlight">Student</span> Think</h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="rating">⭐⭐⭐⭐⭐</div>
              <p>
                "I have been placed in a MNC with Package of 8.5 LPA. I am grateful to Linkcode for his 
                guidance. I strongly recommend anyone considering him to learn to enhance your 
                communication. These skills help you to excel the interview in every aspect. Highly 
                recommended if you want to enter IT industry but have no knowledge about it. Personally 
                speaking, Linkcode sir is really a amazing person with a vision."
              </p>
              <strong>Avinash Samrit</strong>
            </div>
            <div className="testimonial-card">
              <div className="rating">⭐⭐⭐⭐⭐</div>
              <p>
                "Linkcode Technologies has been instrumental in my software development training. The sir 
                is expert in the field and makes the complex concepts easy to understand, with interactive mentorship 
                and teaching every concept from the very basics. Thanks to the excellent guidance and 
                teaching, I secured a well-paying job on and off campus. I'm always grateful for the 
                mentorship that has shaped my entire career path. Highly recommended!"
              </p>
              <strong>Saurabh Asmare</strong>
            </div>
            <div className="testimonial-card">
              <div className="rating">⭐⭐⭐⭐⭐</div>
              <p>
                "Linkcode sir is really great teacher. I joined class to learn C, C++, Python, Java and HTML, CSS and 
                JS. The way he made his language understandable for me to learn is amazing. Along with 
                programming languages we also learnt alot from guest lectures from sir prior students who are 
                placed in very good companies in India and in abroad as well. If you are looking to learn 
                programming language and also what happens in corporate world this class is BEST."
              </p>
              <strong>Gaurav Barthal</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Placement Section */}
      <section className="placement-section">
        <div className="container">
          <div className="section-header">
            <small>Worldwide Our Achievement</small>
            <h2>Our Students <span className="highlight">Placed</span> AT</h2>
          </div>
          <div className="companies-grid">
            <div className="company-logo">{/* Add company logo here */}</div>
            <div className="company-logo">{/* Add company logo here */}</div>
            <div className="company-logo">{/* Add company logo here */}</div>
            <div className="company-logo">{/* Add company logo here */}</div>
            <div className="company-logo">{/* Add company logo here */}</div>
            <div className="company-logo">{/* Add company logo here */}</div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="contact-container">
          <div className="contact-content">
            <h2>Contact Us For More Information</h2>
            <p>
              Have questions about our courses, admissions, or academic programs? Our 
              team is here to assist you. Get in touch with us for detailed information, 
              guidance, and support to help you make the right educational choices.
            </p>
          </div>
          <div className="contact-form">
            <h3>Contact Us</h3>
            <form>
              <input type="text" placeholder="Name" required />
              <input type="email" placeholder="Email" required />
              <input type="tel" placeholder="Phone Number" required />
              <textarea placeholder="Description" rows="4" required></textarea>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-logo">
              <img src={linkLogo} alt="Linkcode" className="footer-logo-image" />
            </div>
            <p>
              Linkcode Technologies is India's No. 1 IT 
              training and placement institute 
              committed to shaping careers and 
              bridging the gap between talent and 
              opportunity.
            </p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#about">About Us</a>
            <a href="#contact">Contact Us</a>
            <a href="#courses">Technical Training</a>
            <a href="#ldp">LDP Program</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#policy">Policy Events</a>
            <a href="#placements">Placements</a>
          </div>
          <div className="footer-section">
            <h4>Courses</h4>
            <a href="#java">Java Full Stack</a>
            <a href="#python">Python Full Stack</a>
            <a href="#mean">MEAN / MERN Stack</a>
            <a href="#mobile">Mobile App Development</a>
            <a href="#devops">DevOps Development</a>
            <a href="#explore">Explore More</a>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>OFFICE NO 12, 3RD FLOOR, SARVE MEMORIAL COMPLEX, OPPOSITE TO PANCHALI HOTEL, JM ROAD, SHIVAJINAGAR, PUNE, 411005</p>
            <p>📞 +91 9004340438 📞 +91 7057310919</p>
            <div className="social-links">
              <span className="social-placeholder">{/* Add social icon here */}</span>
              <span className="social-placeholder">{/* Add social icon here */}</span>
              <span className="social-placeholder">{/* Add social icon here */}</span>
              <span className="social-placeholder">{/* Add social icon here */}</span>
              <span className="social-placeholder">{/* Add social icon here */}</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Copyright © 2024 Linkcode. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
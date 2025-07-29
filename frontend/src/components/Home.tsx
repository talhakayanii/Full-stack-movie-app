import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import checkGif from '../assests/images/check.gif';
import '../styles/Home.css';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What makes this movie app special?",
      answer: "Our app offers unlimited browsing with no restrictions, and contains details about all the movies in efficient manner that are listed on TMDB"
    },
    {
      question: "How often is new content added?",
      answer: "As soon as data gets updated on TMDB"
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! We use industry-standard encryption and never share your personal information with third parties. Your privacy and security are our top priorities."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="fullscreen-container">
      <div className="content-wrapper">
        {/* Hero Section with GIF */}
        <div className="hero-section">
          <div className="gif-container">
            <img src={checkGif} alt="Movie Experience" className="hero-gif" />
            <div className="gif-overlay">
              <div className="hero-content">
                <h1 className="hero-title">CineX</h1>
                <div className="taglines">
                  <p className="tagline primary">Browse Without Limits</p>
                  
                  
                </div>
                
                {user ? (
                  <div className="authenticated-user">
                    <div className="user-info">
                      <h2 className="user-greeting">Welcome back, {user.name}!</h2>
                      <p className="user-status">Ready to continue your movie journey?</p>
                    </div>
                    <Link to="/dashboard" className="action-button primary-action">
                      Go to Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="auth-section">
                    <div className="auth-buttons-container">
                      <Link to="/login" className="auth-button login-button">
                        Login
                      </Link>
                      <Link to="/register" className="auth-button signup-button">
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎬</div>
              <h3>Unlimited Access</h3>
              <p>Explore thousands of movies and TV shows without any restrictions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Multi-Device</h3>
              <p>Works seamlessly across all your devices - phone, tablet, TV, and laptop</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>High Security</h3>
              <p>Good security using JWT tokens</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <div className="faq-container">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button 
                    className={`faq-question ${openFaqIndex === index ? 'active' : ''}`}
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    <span className={`faq-icon ${openFaqIndex === index ? 'rotate' : ''}`}>
                      ▼
                    </span>
                  </button>
                  <div className={`faq-answer ${openFaqIndex === index ? 'open' : ''}`}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
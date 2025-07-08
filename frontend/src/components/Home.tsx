import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Full Stack Auth App</h1>
        <p>A complete authentication system built with React, Node.js, Express, and MongoDB.</p>
        
        {user ? (
          <div className="user-welcome">
            <h2>Hello, {user.name}!</h2>
            <p>You are logged in.</p>
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="auth-links">
            <h2>Get Started</h2>
            <p>Please log in or create an account to continue.</p>
            <div className="button-group">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Sign Up
              </Link>
            </div>
          </div>
        )}

        <div className="features">
          <h2>Features</h2>
          <div className="features-list">
            <div className="feature">
              <h3>🔐 Secure Authentication</h3>
              <p>JWT-based authentication with password hashing</p>
            </div>
            <div className="feature">
              <h3>🛡️ Protected Routes</h3>
              <p>Route protection for authenticated users only</p>
            </div>
            <div className="feature">
              <h3>📱 Responsive Design</h3>
              <p>Works seamlessly on desktop and mobile devices</p>
            </div>
            <div className="feature">
              <h3>⚡ Fast & Efficient</h3>
              <p>Built with modern technologies for optimal performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
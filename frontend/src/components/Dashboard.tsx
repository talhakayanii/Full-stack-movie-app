import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="user-info">
          <h2>User Information</h2>
          <div className="info-card">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>ID:</strong> {user?.id}</p>
          </div>
        </div>

        <div className="dashboard-features">
          <h2>Dashboard Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Profile Management</h3>
              <p>Manage your profile information and settings.</p>
            </div>
            <div className="feature-card">
              <h3>Security</h3>
              <p>Update your password and security preferences.</p>
            </div>
            <div className="feature-card">
              <h3>Activity</h3>
              <p>View your recent activity and login history.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
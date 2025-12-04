import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ZordonPage.css';

function ZordonPage() {
  const navigate = useNavigate();

  return (
    <div className="zordon-page">
      <div className="space-background"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="zordon-container">
        <div className="page-header">
          <h1 className="page-title">ZORDON ACCESS</h1>
          <p className="page-subtitle">Specialized Access Center</p>
        </div>

        <div className="content-panel">
          <div className="welcome-message">
            <h2>Welcome, Zordon</h2>
            <p>Access your personalized dashboard and specialized features.</p>
          </div>

          <div className="action-grid">
            <div className="action-card">
              <h3>Personal Dashboard</h3>
              <p>View your activity and stats</p>
            </div>
            <div className="action-card">
              <h3>Notifications</h3>
              <p>Check alerts and messages</p>
            </div>
            <div className="action-card">
              <h3>Settings</h3>
              <p>Manage your preferences</p>
            </div>
            <div className="action-card">
              <h3>Reports</h3>
              <p>Generate and view reports</p>
            </div>
          </div>

          <button className="back-button" onClick={() => navigate('/welcome')}>
            <span>← BACK TO PORTAL SELECTION</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ZordonPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorPage.css';

function DoctorPage() {
  const navigate = useNavigate();

  return (
    <div className="doctor-page">
      <div className="space-background"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="doctor-container">
        <div className="page-header">
          <h1 className="page-title">DOCTOR PORTAL</h1>
          <p className="page-subtitle">Medical Professional Access</p>
        </div>

        <div className="content-panel">
          <div className="welcome-message">
            <h2>Welcome, Doctor</h2>
            <p>Access patient records, medical history, and treatment protocols.</p>
          </div>

          <div className="action-grid">
            <div className="action-card">
              <h3>Patient Records</h3>
              <p>View and manage patient information</p>
            </div>
            <div className="action-card">
              <h3>Prescriptions</h3>
              <p>Create and review prescriptions</p>
            </div>
            <div className="action-card">
              <h3>Lab Results</h3>
              <p>Access laboratory reports</p>
            </div>
            <div className="action-card">
              <h3>Appointments</h3>
              <p>Schedule and manage appointments</p>
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

export default DoctorPage;

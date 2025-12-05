/**
 * Doctor Login Component
 * Professional Medical Portal Authentication
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorLogin.css';

function DoctorLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    licenseNumber: '', 
    password: '',
    specialty: 'general'
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const specialties = [
    { id: 'general', name: 'General Practice', icon: '🏥' },
    { id: 'cardiology', name: 'Cardiology', icon: '❤️' },
    { id: 'neurology', name: 'Neurology', icon: '🧠' },
    { id: 'pediatrics', name: 'Pediatrics', icon: '👶' },
    { id: 'surgery', name: 'Surgery', icon: '⚕️' },
    { id: 'emergency', name: 'Emergency Medicine', icon: '🚑' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (form.licenseNumber && form.password) {
      setIsAuthenticating(true);
      
      // Simulate authentication
      setTimeout(() => {
        const specialty = specialties.find(s => s.id === form.specialty);
        
        // Store doctor info (in real app, this would come from backend)
        localStorage.setItem('doctorAuth', JSON.stringify({
          licenseNumber: form.licenseNumber,
          specialty: specialty.name,
          specialtyId: form.specialty,
          loginTime: new Date().toISOString()
        }));
        
        navigate('/doctor/dashboard');
      }, 2000);
    } else {
      alert('Please enter both Medical License Number and Password');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBackToWelcome = () => {
    navigate('/');
  };

  return (
    <div className="doctor-login-container">
      {isAuthenticating && (
        <div className="auth-overlay">
          <div className="auth-spinner"></div>
          <div className="auth-text">Authenticating Medical Credentials...</div>
          <div className="auth-pulse"></div>
        </div>
      )}

      {/* Medical Background */}
      <div className="medical-background">
        <div className="medical-grid"></div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* ECG Line Animation */}
      <div className="ecg-container">
        <svg className="ecg-line" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M0,50 L200,50 L220,30 L230,70 L240,50 L260,50 L270,20 L280,80 L290,50 L1000,50" 
                stroke="#22c55e" 
                strokeWidth="2" 
                fill="none"
                className="ecg-path" />
        </svg>
      </div>

      {/* Header */}
      <div className="doctor-login-header">
        <div className="medical-cross">
          <div className="cross-horizontal"></div>
          <div className="cross-vertical"></div>
        </div>
        <div className="header-content">
          <h1 className="medical-title">MEDICAL PORTAL</h1>
          <p className="medical-subtitle">Healthcare Professional Access System</p>
          <div className="system-status">
            <span className="status-dot"></span>
            <span className="status-text">System Online • Secure Connection</span>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="doctor-login-card">
        <div className="card-header">
          <h2>🩺 Doctor Authentication</h2>
          <p>Enter your medical credentials to access the patient dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* License Number */}
          <div className="form-group">
            <label htmlFor="licenseNumber">
              <span className="label-icon">🆔</span>
              Medical License Number
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder="e.g., MD-123456"
                className="form-input"
                autoComplete="username"
              />
              <div className="input-glow"></div>
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              <span className="label-icon">🔒</span>
              Password
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="form-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
              <div className="input-glow"></div>
            </div>
          </div>

          {/* Specialty Selection */}
          <div className="form-group">
            <label htmlFor="specialty">
              <span className="label-icon">⚕️</span>
              Medical Specialty
            </label>
            <div className="specialty-grid">
              {specialties.map(specialty => (
                <div
                  key={specialty.id}
                  className={`specialty-option ${form.specialty === specialty.id ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, specialty: specialty.id })}
                >
                  <span className="specialty-icon">{specialty.icon}</span>
                  <span className="specialty-name">{specialty.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span className="checkbox-custom"></span>
              <span>Remember this device</span>
            </label>
            <a href="#forgot" className="forgot-link">Forgot Password?</a>
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-button">
            <span className="button-icon">🔐</span>
            <span className="button-text">Access Medical Portal</span>
            <div className="button-glow"></div>
          </button>
        </form>

        {/* Footer Links */}
        <div className="card-footer">
          <button onClick={handleBackToWelcome} className="back-button">
            ← Back to Welcome
          </button>
          <div className="footer-info">
            <span className="info-icon">ℹ️</span>
            <span>Secure HIPAA-Compliant System</span>
          </div>
        </div>
      </div>

      {/* Side Panel - Stats */}
      <div className="side-panel">
        <div className="panel-section">
          <h3>System Status</h3>
          <div className="status-item">
            <span className="status-label">Active Users</span>
            <span className="status-value green">42</span>
          </div>
          <div className="status-item">
            <span className="status-label">System Uptime</span>
            <span className="status-value blue">99.9%</span>
          </div>
          <div className="status-item">
            <span className="status-label">Security Level</span>
            <span className="status-value green">High</span>
          </div>
        </div>

        <div className="panel-section">
          <h3>Quick Access</h3>
          <div className="quick-links">
            <a href="#guidelines" className="quick-link">📋 Clinical Guidelines</a>
            <a href="#protocols" className="quick-link">📊 Emergency Protocols</a>
            <a href="#support" className="quick-link">💬 IT Support</a>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="version-info">
        MorphSync Medical Portal v2.1.0 | © 2025 | HIPAA Compliant
      </div>
    </div>
  );
}

export default DoctorLogin;

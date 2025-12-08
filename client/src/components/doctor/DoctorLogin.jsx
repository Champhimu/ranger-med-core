/**
 * Doctor Login Component
 * Professional Medical Portal Authentication
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from '../shared/Icon';
import './DoctorLogin.css';

function DoctorLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    licenseNumber: '', 
    password: ''
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!form.licenseNumber.trim()) {
      toast.error('Email or Username is required!', {
        style: {
          background: '#0a1f35',
          border: '2px solid #ef4444',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
        }
      });
      return false;
    }

    if (form.licenseNumber.length < 3) {
      toast.error('Email or Username must be at least 3 characters!', {
        style: {
          background: '#0a1f35',
          border: '2px solid #ef4444',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
        }
      });
      return false;
    }

    if (!form.password.trim()) {
      toast.error('Password is required!', {
        icon: <Icon name="lock" size={20} />,
        style: {
          background: '#0a1f35',
          border: '2px solid #ef4444',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
        }
      });
      return false;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters!', {
        icon: <Icon name="lock" size={20} />,
        style: {
          background: '#0a1f35',
          border: '2px solid #ef4444',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
        }
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsAuthenticating(true);
    toast.loading('Authenticating Medical Credentials...', { 
      id: 'doctor-auth',
      icon: <Icon name="unlock" size={20} />
    });
    
    // Simulate authentication
    setTimeout(() => {
      // Store doctor info (in real app, this would come from backend)
      localStorage.setItem('doctorAuth', JSON.stringify({
        licenseNumber: form.licenseNumber,
        loginTime: new Date().toISOString()
      }));
      
      toast.success(`Welcome Dr. ${form.licenseNumber}`, {
        id: 'doctor-auth',
        duration: 2000,
        icon: <Icon name="checkCircle" size={20} />,
        style: {
          background: '#0a1f35',
          border: '2px solid #22c55e',
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)',
        }
      });
      
      setTimeout(() => {
        navigate('/doctor/dashboard');
      }, 1000);
    }, 2000);
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
          <h2>
            <Icon name="stethoscope" size={24} className="title-icon" />
            Doctor Authentication
          </h2>
          <p>Enter your medical credentials to access the patient dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email or Username */}
          <div className="form-group">
            <label htmlFor="licenseNumber">
              <Icon name="mail" size={18} className="label-icon" />
              Email or Username
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder="e.g., doctor@hospital.com or username"
                className="form-input"
                autoComplete="username"
              />
              <div className="input-glow"></div>
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              <Icon name="lock" size={18} className="label-icon" />
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
                <Icon name={showPassword ? "eye" : "eyeOff"} size={18} />
              </button>
              <div className="input-glow"></div>
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
            <Icon name="unlock" size={20} className="button-icon" />
            <span className="button-text">Access Medical Portal</span>
            <div className="button-glow"></div>
          </button>
        </form>

        {/* Footer Links */}
        <div className="card-footer">
          <button onClick={handleBackToWelcome} className="back-button">
            <Icon name="arrowLeft" size={16} /> Back to Welcome
          </button>
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
            <a href="#guidelines" className="quick-link">
              <Icon name="clipboardList" size={16} /> Clinical Guidelines
            </a>
            <a href="#protocols" className="quick-link">
              <Icon name="chartBar" size={16} /> Emergency Protocols
            </a>
            <a href="#support" className="quick-link">
              <Icon name="message" size={16} /> IT Support
            </a>
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

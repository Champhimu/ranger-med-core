import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = React.useState(null);

  const roles = [
    {
      id: 'ranger',
      title: '🚀 RANGER OPERATIVE',
      description: 'Overdrive Ranger Health Management',
      subtitle: 'Manage capsules, track health, stay powered up',
      color: '#ff0000',
      icon: '⚡',
      path: '/login'
    },
    {
      id: 'doctor',
      title: '👨‍⚕️ DOCTOR PORTAL',
      description: 'Medical Professional Dashboard',
      subtitle: 'Patient management and health analytics',
      color: '#0066ff',
      icon: '🏥',
      path: '/doctor'
    },
    {
      id: 'admin',
      title: '🤖 ZORDON ADMIN',
      description: 'System Administration Center',
      subtitle: 'AI models, predictions, and system control',
      color: '#c0c0c0',
      icon: '⚙️',
      path: '/zordon'
    }
  ];

  const handleRoleSelect = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    setSelectedRole(roleId);
    setTimeout(() => {
      navigate(role.path);
    }, 500);
  };

  return (
    <div className="welcome-container">
      <div className="space-background">
        {[...Array(3)].map((_, i) => <div key={i} className={`stars stars${i + 1}`} />)}
      </div>

      <div className="helmet-background">
        {[...Array(3)].map((_, i) => <div key={i} className={`helmet helmet-${i + 1}`} />)}
      </div>

      <div className="welcome-header">
        <div className="logo-section">
          <h1 className="main-title">MORPHSYNC MED-STATION</h1>
          <p className="main-subtitle">MORPHSYNC OPERATION OVERDRIVE</p>
          <p className="tagline">Command Center for Health & Power</p>
        </div>
      </div>

      <div className="welcome-content">
        <div className="role-selector">
          {roles.map(role => (
            <div
              key={role.id}
              className={`role-card ${selectedRole === role.id ? 'active' : ''}`}
              style={{ '--role-color': role.color }}
              onClick={() => handleRoleSelect(role.id)}
            >
              <div className="role-card-inner">
                <div className="role-icon">{role.icon}</div>
                <h2 className="role-title">{role.title}</h2>
                <p className="role-description">{role.description}</p>
                <p className="role-subtitle">{role.subtitle}</p>
                <div className="role-button">
                  {role.id === 'ranger' ? 'LOGIN / REGISTER' : 'ACCESS PORTAL'}
                </div>
              </div>
              <div className="card-glow"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="welcome-footer">
        <div className="features-bar">
          <div className="feature-item">
            <span className="feature-icon">💊</span>
            <span className="feature-text">Capsule Management</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <span className="feature-text">AI Assistant</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span className="feature-text">Health Analytics</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <span className="feature-text">Dose Alerts</span>
          </div>
        </div>
        <div className="footer-text">
          <p>OVERDRIVE STATUS: READY • MORPHSYNC SYSTEMS: ONLINE</p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('ranger');

  const roles = [
    { id: 'ranger', name: 'RANGER', color: '#ff0000', path: '/login', description: 'Power Ranger Login / Registration' },
    { id: 'doctor', name: 'DOCTOR', color: '#00ff00', path: '/doctor', description: 'Doctor Login Portal' },
    { id: 'zordon', name: 'ZORDON (ADMIN)', color: '#ffcc00', path: '/zordon', description: 'Admin Access Center' }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role.id);
    setTimeout(() => {
      navigate(role.path);
    }, 300);
  };

  const Heartbeat = () => (
    <svg className="heartbeat" viewBox="0 0 300 100" preserveAspectRatio="none">
      <polyline
        points="0,50 30,50 40,20 50,80 60,30 70,70 80,50 300,50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );

  return (
    <div className="welcome-container" data-role={selectedRole}>
      {/* Background Elements */}
      <div className="space-background"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Helmet Background */}
      <div className="helmet-background">
        <div className="helmet helmet-1"></div>
        <div className="helmet helmet-2"></div>
        <div className="helmet helmet-3"></div>
      </div>

      {/* Planet */}
      <div className="planet-container">
        <div className="planet-glow"></div>
        <div className="planet"></div>
      </div>

      {/* Header */}
      <div className="power-rangers-header">
        <div className="pr-logo">
          <div className="pr-power">MORPHSYNC</div>
          <div className="pr-rangers">MED-STATION</div>
        </div>
        <div className="welcome-subtitle">OPERATION OVERDRIVE - SELECT YOUR MISSION</div>
      </div>

      {/* Main Content - Role Selection Cards */}
      <div className="role-selection-container">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`role-card ${selectedRole === role.id ? 'active' : ''}`}
            style={{ '--role-color': role.color }}
            onClick={() => handleRoleSelect(role)}
          >
            <div className="card-glow"></div>
            <div className="card-header">
              <div className="role-icon">
                <div className="icon-inner"></div>
              </div>
            </div>
            <div className="card-body">
              <h2 className="role-name">{role.name}</h2>
              <p className="role-description">{role.description}</p>
              <button className="access-button">
                <span className="button-text">ACCESS PORTAL</span>
                <div className="button-shine"></div>
              </button>
            </div>
            <div className="card-corners">
              <div className="corner corner-tl"></div>
              <div className="corner corner-tr"></div>
              <div className="corner corner-bl"></div>
              <div className="corner corner-br"></div>
            </div>
          </div>
        ))}
      </div>

      {/* HUD Panels */}
      <div className="hud-panel hud-left">
        <div className="panel-header">SYSTEM STATUS</div>
        <div className="vital-chart">
          <Heartbeat />
        </div>
        <div className="vital-stats">
          <div className="stat-item">
            <span className="stat-label">PORTALS</span>
            <span className="stat-value">3 ACTIVE</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">SECURITY</span>
            <span className="stat-value">OPTIMAL</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">UPTIME</span>
            <span className="stat-value">99.9%</span>
          </div>
        </div>
      </div>

      <div className="hud-panel hud-right">
        <div className="panel-header">MISSION CONTROL</div>
        <div className="power-circle">
          <svg width="120" height="120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgba(0, 255, 255, 0.2)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="var(--role-color)"
              strokeWidth="8"
              strokeDasharray="314"
              strokeDashoffset="78.5"
              className="power-progress"
            />
          </svg>
          <div className="power-text">100</div>
        </div>
        <div className="power-label">SYSTEM READY</div>
      </div>

      {/* Bottom HUD */}
      <div className="bottom-hud">
        <div className="bottom-panel">
          <div className="mini-display">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </div>
        <div className="hex-button">
          <div className="hexagon">
            <span>DEPLOY</span>
          </div>
        </div>
        <div className="bottom-panel">
          <div className="radar-display">
            <div className="radar-ping"></div>
          </div>
        </div>
      </div>

      {/* Cockpit Frame */}
      <div className="cockpit-frame"></div>
    </div>
  );
}

export default Welcome;

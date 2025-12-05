import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RangerDashboard.css';
import { logoutRanger } from '../api/auth';

function RangerDashboard({ selectedRanger = 'red' }) {
  const navigate = useNavigate();

  // Ranger color mapping
  const rangerColors = {
    red: '#ff0000',
    blue: '#0066ff',
    yellow: '#ffcc00',
    pink: '#ff69b4',
    black: '#1a1a1a',
    mercury: '#c0c0c0'
  };

  const rangerNames = {
    red: 'Mack Hartford',
    blue: 'Dax Lo',
    yellow: 'Ronny Robinson',
    pink: 'Rose Ortiz',
    black: 'Will Aston',
    mercury: 'Tyzonn'
  };

  const rangerTitles = {
    red: 'Red Ranger',
    blue: 'Blue Ranger',
    yellow: 'Yellow Ranger',
    pink: 'Pink Ranger',
    black: 'Black Ranger',
    mercury: 'Mercury Ranger'
  };

  // Mock data - would come from API
  const rangerData = {
    name: rangerNames[selectedRanger] || 'Mack Hartford',
    rangerColor: rangerTitles[selectedRanger] || 'Red Ranger',
    healthScore: 92,
    symptoms: [
      { id: 1, symptom: 'Headache', severity: 'mild', date: '2025-12-03', time: '14:30' },
      { id: 2, symptom: 'Fatigue', severity: 'moderate', date: '2025-12-02', time: '09:15' },
      { id: 3, symptom: 'Muscle soreness', severity: 'mild', date: '2025-12-01', time: '18:45' }
    ],
    capsules: [
      { id: 1, name: 'Overdrive Accelerator', dosage: '500mg', frequency: 'Twice Daily', lastTaken: '2025-12-04 08:00', nextDue: '2025-12-04 20:00', status: 'active' },
      { id: 2, name: 'Zord Energy Capsule', dosage: '250mg', frequency: 'Once Daily', lastTaken: '2025-12-04 07:30', nextDue: '2025-12-05 07:30', status: 'active' },
      { id: 3, name: 'Morphin Grid Stabilizer', dosage: '100mg', frequency: 'As Needed', lastTaken: '2025-12-03 15:00', nextDue: 'PRN', status: 'prn' }
    ],
    appointments: [
      { id: 1, type: 'Check-up', doctor: 'Dr. Andrew Hartford', date: '2025-12-10', time: '10:00 AM', status: 'confirmed' },
      { id: 2, type: 'Physical Therapy', doctor: 'Dr. Spencer', date: '2025-12-15', time: '02:00 PM', status: 'pending' }
    ],
    wellnessTip: 'Remember to stay hydrated during missions! Rangers need at least 8 glasses of water daily to maintain peak performance.',
    vitals: {
      heartRate: 72,
      bloodPressure: '120/80',
      temperature: 98.6,
      oxygen: 99
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      mild: '#00ff00',
      moderate: '#ffcc00',
      severe: '#ff0000'
    };
    return colors[severity] || '#00ffff';
  };

  const Heartbeat = () => (
    <svg className="heartbeat-svg" viewBox="0 0 300 100" preserveAspectRatio="none">
      <polyline
        points="0,50 30,50 40,20 50,80 60,30 70,70 80,50 300,50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );

  const handleLogout = async() => {
    const refreshToken = localStorage.getItem("refreshToken");
    const res = await logoutRanger({
      refreshToken
    });

    if (res.status == 500) {
      return alert("Something went wrong! Unable to logout");
    }
    
    // Clear everything
    localStorage.clear();

    navigate('/welcome'); // Redirect to welcome/login page
  };


  return (
    <div className="ranger-dashboard" data-ranger={selectedRanger}>
      {/* Background Elements */}
      <div className="space-background"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Header */}
      <div className="dashboard-header">
        <div className="hq-logo">
          <div className="logo-text">OPERATION OVERDRIVE</div>
          <div className="logo-subtitle">HEADQUARTERS - MEDICAL BAY</div>
        </div>
        <div className="ranger-info" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <div className="ranger-avatar"></div>
          <div className="ranger-details">
            <h2>{rangerData.name}</h2>
            <p>{rangerData.rangerColor}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        
        {/* Left Column */}
        <div className="left-column">
          
          {/* Health Summary */}
          <div className="dash-panel health-summary">
            <div className="panel-header">
              <span className="header-icon">❤️</span>
              <h3>HEALTH SUMMARY</h3>
            </div>
            <div className="panel-body">
              <div className="health-score-container">
                <div className="health-score-circle">
                  <svg width="160" height="160">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="rgba(0, 255, 255, 0.2)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="var(--ranger-glow)"
                      strokeWidth="10"
                      strokeDasharray="440"
                      strokeDashoffset={440 - (440 * rangerData.healthScore) / 100}
                      className="health-progress"
                    />
                  </svg>
                  <div className="health-score-text">
                    <span className="score">{rangerData.healthScore}</span>
                    <span className="label">HEALTH</span>
                  </div>
                </div>
              </div>
              
              <div className="vitals-grid">
                <div className="vital-item">
                  <div className="vital-icon">💓</div>
                  <div className="vital-info">
                    <span className="vital-label">Heart Rate</span>
                    <span className="vital-value">{rangerData.vitals.heartRate} BPM</span>
                  </div>
                </div>
                <div className="vital-item">
                  <div className="vital-icon">🩺</div>
                  <div className="vital-info">
                    <span className="vital-label">Blood Pressure</span>
                    <span className="vital-value">{rangerData.vitals.bloodPressure}</span>
                  </div>
                </div>
                <div className="vital-item">
                  <div className="vital-icon">🌡️</div>
                  <div className="vital-info">
                    <span className="vital-label">Temperature</span>
                    <span className="vital-value">{rangerData.vitals.temperature}°F</span>
                  </div>
                </div>
                <div className="vital-item">
                  <div className="vital-icon">💨</div>
                  <div className="vital-info">
                    <span className="vital-label">Oxygen</span>
                    <span className="vital-value">{rangerData.vitals.oxygen}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Symptoms */}
          <div className="dash-panel recent-symptoms">
            <div className="panel-header">
              <span className="header-icon">📋</span>
              <h3>RECENT SYMPTOMS LOGGED</h3>
            </div>
            <div className="panel-body">
              <div className="symptoms-list">
                {rangerData.symptoms.map(symptom => (
                  <div key={symptom.id} className="symptom-item">
                    <div 
                      className="severity-indicator" 
                      style={{ backgroundColor: getSeverityColor(symptom.severity) }}
                    ></div>
                    <div className="symptom-content">
                      <div className="symptom-name">{symptom.symptom}</div>
                      <div className="symptom-meta">
                        <span className="symptom-severity" style={{ color: getSeverityColor(symptom.severity) }}>
                          {symptom.severity.toUpperCase()}
                        </span>
                        <span className="symptom-date">{symptom.date} at {symptom.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="view-all-btn" onClick={() => navigate('/symptoms')}>View All Symptoms →</button>
            </div>
          </div>

          {/* Capsules */}
          <div className="dash-panel power-boosts">
            <div className="panel-header">
              <span className="header-icon">💊</span>
              <h3>CAPSULES</h3>
            </div>
            <div className="panel-body">
              <div className="capsules-list">
                {rangerData.capsules.map(capsule => (
                  <div key={capsule.id} className="capsule-item">
                    <div className="capsule-icon">⚡</div>
                    <div className="capsule-content">
                      <div className="capsule-name">{capsule.name}</div>
                      <div className="capsule-details">
                        <span className="capsule-dosage">{capsule.dosage}</span>
                        <span className="capsule-frequency">• {capsule.frequency}</span>
                      </div>
                      <div className="capsule-schedule">
                        <span className="last-taken">Last: {capsule.lastTaken}</span>
                        <span className="next-due">Next: {capsule.nextDue}</span>
                      </div>
                    </div>
                    <div className={`capsule-status status-${capsule.status}`}>
                      {capsule.status === 'active' ? '✓ ACTIVE' : 'PRN'}
                    </div>
                  </div>
                ))}
              </div>
              <button className="view-all-btn" onClick={() => navigate('/capsules')}>Manage Capsules →</button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          
          {/* Quick Actions */}
          <div className="dash-panel quick-actions">
            <div className="panel-header">
              <span className="header-icon">⚡</span>
              <h3>QUICK ACTIONS</h3>
            </div>
            <div className="panel-body">
              <div className="action-buttons">
                <button className="action-btn add-symptom" onClick={() => navigate('/symptoms')}>
                  <div className="btn-icon">📝</div>
                  <div className="btn-text">
                    <span className="btn-title">Add Symptom</span>
                    <span className="btn-subtitle">Log new symptom</span>
                  </div>
                </button>
                <button className="action-btn symptom-checker" onClick={() => navigate('/symptom-checker')}>
                  <div className="btn-icon">🩺</div>
                  <div className="btn-text">
                    <span className="btn-title">Symptom Checker</span>
                    <span className="btn-subtitle">AI analysis</span>
                  </div>
                </button>
                <button className="action-btn book-appointment" onClick={() => navigate('/appointments')}>
                  <div className="btn-icon">📅</div>
                  <div className="btn-text">
                    <span className="btn-title">Book Appointment</span>
                    <span className="btn-subtitle">Schedule with doctor</span>
                  </div>
                </button>
                <button className="action-btn view-calendar" onClick={() => navigate('/calendar')}>
                  <div className="btn-icon">📆</div>
                  <div className="btn-text">
                    <span className="btn-title">View Calendar</span>
                    <span className="btn-subtitle">Schedule overview</span>
                  </div>
                </button>
                <button className="action-btn chat-ai" onClick={() => navigate('/rangerbot')}>
                  <div className="btn-icon">🤖</div>
                  <div className="btn-text">
                    <span className="btn-title">RangerBot AI</span>
                    <span className="btn-subtitle">Chat assistant</span>
                  </div>
                </button>
                <button className="action-btn capsules" onClick={() => navigate('/capsules')}>
                  <div className="btn-icon">�</div>
                  <div className="btn-text">
                    <span className="btn-title">Capsules</span>
                    <span className="btn-subtitle">Medications</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="dash-panel upcoming-appointments">
            <div className="panel-header">
              <span className="header-icon">📅</span>
              <h3>UPCOMING APPOINTMENTS</h3>
            </div>
            <div className="panel-body">
              <div className="appointments-list">
                {rangerData.appointments.map(appointment => (
                  <div key={appointment.id} className="appointment-card">
                    <div className="appointment-date">
                      <div className="date-day">{new Date(appointment.date).getDate()}</div>
                      <div className="date-month">{new Date(appointment.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                    </div>
                    <div className="appointment-details">
                      <div className="appointment-type">{appointment.type}</div>
                      <div className="appointment-doctor">Dr. {appointment.doctor}</div>
                      <div className="appointment-time">⏰ {appointment.time}</div>
                    </div>
                    <div className={`appointment-status status-${appointment.status}`}>
                      {appointment.status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
              <button className="view-all-btn" onClick={() => navigate('/appointments')}>View All Appointments →</button>
            </div>
          </div>

          {/* Wellness Tip */}
          <div className="dash-panel wellness-tip">
            <div className="panel-header">
              <span className="header-icon">💡</span>
              <h3>WELLNESS TIP OF THE DAY</h3>
            </div>
            <div className="panel-body">
              <div className="tip-content">
                <div className="tip-icon">🌟</div>
                <p className="tip-text">{rangerData.wellnessTip}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="bottom-hud-dashboard">
        <div className="hud-item">
          <Heartbeat />
          <span className="hud-label">VITALS MONITOR</span>
        </div>
        <div className="hud-item">
          <div className="mission-status">
            <span className="status-dot"></span>
            <span className="status-text">MISSION READY</span>
          </div>
        </div>
        <div className="hud-item">
          <button className="logout-btn" onClick={handleLogout}>
            <span> LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Cockpit Frame */}
      <div className="cockpit-frame"></div>
    </div>
  );
}

export default RangerDashboard;

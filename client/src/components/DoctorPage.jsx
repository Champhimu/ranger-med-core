import React from 'react';

function DoctorPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#00ffff',
      fontFamily: 'Arial, sans-serif',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', textShadow: '0 0 20px #00ffff' }}>
        👨‍⚕️ DOCTOR DASHBOARD 👨‍⚕️
      </h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
        Medical Professional Control Center
      </p>
      <div style={{
        marginTop: '2rem',
        padding: '2rem',
        border: '2px solid #00ffff',
        borderRadius: '8px',
        backgroundColor: 'rgba(0, 255, 255, 0.05)',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h2>Doctor Portal Features</h2>
        <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
          <li>👥 Patient Management</li>
          <li>📋 Medical Records Review</li>
          <li>💊 Prescription Management</li>
          <li>📊 Health Analytics</li>
          <li>🔔 Alerts & Notifications</li>
        </ul>
      </div>
    </div>
  );
}

export default DoctorPage;

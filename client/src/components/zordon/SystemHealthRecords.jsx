
import React, { useState } from 'react';
import '../zordon/ZordonDashboard.css';
import './SystemHealthRecords.css';

function SystemHealthRecords() {
  const [activeTab, setActiveTab] = useState('records');

  return (
    <div className="zordon-dashboard">
      <div className="overdrive-background">
        <div className="overdrive-grid"></div>
        <div className="overdrive-particles"></div>
      </div>
      <div className="zordon-header">
        <div className="header-left">
          <div className="zordon-logo" style={{fontSize: 32, color: '#00d4ff'}}>🩺</div>
          <div className="header-info">
            <h1>SYSTEM HEALTH RECORDS</h1>
            <p>ELECTRONIC HEALTH RECORDS • ADMIN CONTROL</p>
          </div>
        </div>
        <div className="header-right">
          <div className="system-status">
            <span className="status-indicator"></span>
            <span>SECURE MODE</span>
          </div>
        </div>
      </div>
      <div className="zordon-content">
        <div className="shr-stats">
          <div className="shr-stat-card">
            <div className="shr-stat-icon">📁</div>
            <div className="shr-stat-value">1,245</div>
            <div className="shr-stat-label">Total Records</div>
          </div>
          <div className="shr-stat-card">
            <div className="shr-stat-icon">🔒</div>
            <div className="shr-stat-value">256-bit</div>
            <div className="shr-stat-label">Encryption</div>
          </div>
          <div className="shr-stat-card">
            <div className="shr-stat-icon">👨‍⚕️</div>
            <div className="shr-stat-value">8</div>
            <div className="shr-stat-label">Doctors</div>
          </div>
          <div className="shr-stat-card">
            <div className="shr-stat-icon">🛡️</div>
            <div className="shr-stat-value">99.9%</div>
            <div className="shr-stat-label">Uptime</div>
          </div>
        </div>
        <div className="dashboard-grid">
          <div className="dashboard-section health-section" style={{width: '100%'}}>
            <div className="shr-section-header">
              <h2>RECORDS MANAGEMENT</h2>
              <div className="shr-tabs">
                <button className={activeTab === 'records' ? 'active' : ''} onClick={() => setActiveTab('records')}>All Records</button>
                <button className={activeTab === 'storage' ? 'active' : ''} onClick={() => setActiveTab('storage')}>Secure Storage</button>
                <button className={activeTab === 'doctor' ? 'active' : ''} onClick={() => setActiveTab('doctor')}>Doctor Entries</button>
                <button className={activeTab === 'corrections' ? 'active' : ''} onClick={() => setActiveTab('corrections')}>Corrections</button>
              </div>
            </div>
            <div style={{marginTop: 24}}>
              {activeTab === 'records' && (
                <div>
                  <h3>All Health Records</h3>
                  <p>View and oversee all patient health records in the system. (Table/list placeholder)</p>
                  <div className="placeholder-panel">[Records Table Here]</div>
                </div>
              )}
              {activeTab === 'storage' && (
                <div>
                  <h3>Secure Record Storage</h3>
                  <p>Records are encrypted and securely stored. (Encryption status, backup info, etc.)</p>
                  <div className="placeholder-panel">[Storage Security Details Here]</div>
                </div>
              )}
              {activeTab === 'doctor' && (
                <div>
                  <h3>Doctor Entry Approval</h3>
                  <p>Approve or review new doctor entries and updates to records. (Approval workflow placeholder)</p>
                  <div className="placeholder-panel">[Doctor Entry Approval List Here]</div>
                </div>
              )}
              {activeTab === 'corrections' && (
                <div>
                  <h3>Data Corrections</h3>
                  <p>Handle requests for corrections to health records. (Correction request workflow placeholder)</p>
                  <div className="placeholder-panel">[Correction Requests Here]</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemHealthRecords;

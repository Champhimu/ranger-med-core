/**
 * User Management Hub - Operation Overdrive Administration
 * Central Hub for Patient & Doctor Management
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../shared/Icon';
import './UserManagement.css';

const UserManagement = () => {
  const navigate = useNavigate();

  const managementOptions = [
    {
      title: 'Patient Management',
      description: 'Manage patient accounts, health records, and risk levels',
      icon: 'users',
      color: '#00d4ff',
      path: '/zordon/users/patients',
      stats: [
        { label: 'Total Patients', value: '6' },
        { label: 'High Risk', value: '2' },
        { label: 'Active', value: '5' }
      ]
    },
    {
      title: 'Doctor Management',
      description: 'Manage doctor credentials, permissions, and specialties',
      icon: 'doctor',
      color: '#00ff88',
      path: '/zordon/users/doctors',
      stats: [
        { label: 'Total Doctors', value: '6' },
        { label: 'Verified', value: '5' },
        { label: 'Active', value: '5' }
      ]
    }
  ];

  return (
    <div className="user-management-hub">
      {/* Header */}
      <div className="umh-header">
        <div className="umh-header-left">
          <button className="back-btn" onClick={() => navigate('/zordon/dashboard')}>
            <Icon name="arrowLeft" size={20} />
          </button>
          <div className="umh-title-section">
            <h1>USER MANAGEMENT</h1>
            <p>Operation Overdrive • Account Administration</p>
          </div>
        </div>
      </div>

      {/* Management Cards */}
      <div className="umh-cards-grid">
        {managementOptions.map((option, index) => (
          <div 
            key={index}
            className="umh-card"
            onClick={() => navigate(option.path)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="umh-card-header">
              <div className="umh-card-icon" style={{ backgroundColor: `${option.color}20` }}>
                <Icon name={option.icon} size={48} color={option.color} />
              </div>
              <div className="umh-card-title">
                <h2>{option.title}</h2>
                <p>{option.description}</p>
              </div>
            </div>

            <div className="umh-card-stats">
              {option.stats.map((stat, idx) => (
                <div key={idx} className="umh-stat">
                  <span className="stat-value" style={{ color: option.color }}>{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="umh-card-footer">
              <span>Manage {option.title.split(' ')[0]}s</span>
              <Icon name="arrowRight" size={20} color={option.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="umh-quick-actions">
        <h3>Quick Actions</h3>
        <div className="umh-actions-grid">
          <button className="umh-action-btn" onClick={() => navigate('/zordon/users/patients')}>
            <Icon name="plus" size={20} />
            <span>Add New Patient</span>
          </button>
          <button className="umh-action-btn" onClick={() => navigate('/zordon/users/doctors')}>
            <Icon name="plus" size={20} />
            <span>Add New Doctor</span>
          </button>
          <button className="umh-action-btn" onClick={() => navigate('/zordon/users/patients')}>
            <Icon name="alertCircle" size={20} />
            <span>View High-Risk Patients</span>
          </button>
          <button className="umh-action-btn" onClick={() => navigate('/zordon/users/doctors')}>
            <Icon name="shieldCheck" size={20} />
            <span>Verify Doctor Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

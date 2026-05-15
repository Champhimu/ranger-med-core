import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = ({ ranger = 'red' }) => {
  const navigate = useNavigate();

  const rangerColors = {
    red: '#FF0000',
    blue: '#0066FF',
    yellow: '#FFD700',
    black: '#000000',
    pink: '#FF69B4',
    mercury: '#C0C0C0'
  };

  const rangerNames = {
    red: 'Mack Hartford',
    blue: 'Dax Lo',
    yellow: 'Ronny Robinson',
    pink: 'Rose Ortiz',
    black: 'Will Aston',
    mercury: 'Tyzonn'
  };

  const currentColor = rangerColors[ranger] || rangerColors.red;
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // Personal Information
    fullName: rangerNames[ranger] || 'Mack Hartford',
    rangerColor: ranger,
    email: 'mack.hartford@overdrive.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1995-03-15',
    age: 30,
    gender: 'Male',
    bloodType: 'O+',
    
    // Address
    address: '123 Overdrive Lane',
    city: 'San Angeles',
    state: 'California',
    zipCode: '90210',
    country: 'USA',
    
    // Emergency Contact
    emergencyContactName: 'Andrew Hartford',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '+1 (555) 987-6543',
    
    // Medical Information
    height: '5\'11"',
    weight: '175 lbs',
    allergies: 'None',
    chronicConditions: 'None',
    currentMedications: 'Morphinium-12, Neural-Sync Plus',
    
    // Insurance
    insuranceProvider: 'Hartford Medical Group',
    insurancePolicy: 'HMG-2025-RANGER-001',
    
    // Additional
    occupation: 'Power Ranger - Operation Overdrive',
    preferredLanguage: 'English',
    notifications: true,
    shareDataWithDoctor: true
  });

  const [editData, setEditData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
    // TODO: Save to backend/API
    alert('Profile updated successfully! ✓');
  };

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const displayData = isEditing ? editData : profileData;

  return (
    <div className="profile-page">
      <div className="space-background"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Header */}
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← DASHBOARD
        </button>
        <div className="header-content">
          <h1>RANGER PROFILE</h1>
          <p>PERSONAL INFORMATION SYSTEM</p>
        </div>
        {!isEditing ? (
          <button 
            className="edit-btn" 
            onClick={handleEdit}
            style={{ borderColor: currentColor, color: currentColor }}
          >
            ✎ EDIT PROFILE
          </button>
        ) : (
          <div className="edit-actions">
            <button className="cancel-edit-btn" onClick={handleCancel}>
              ✕ CANCEL
            </button>
            <button 
              className="save-btn" 
              onClick={handleSave}
              style={{ background: currentColor }}
            >
              ✓ SAVE
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="profile-container">
        {/* Left Section - Avatar and Quick Stats */}
        <div className="profile-sidebar">
          <div className="profile-card">
            <div 
              className="profile-avatar-large"
              style={{ 
                background: `linear-gradient(135deg, ${currentColor} 0%, ${currentColor}88 100%)`,
                boxShadow: `0 0 40px ${currentColor}88`
              }}
            >
              <div className="avatar-ranger-initial">
                {displayData.fullName.charAt(0)}
              </div>
            </div>
            <h2>{displayData.fullName}</h2>
            <p className="ranger-title" style={{ color: currentColor }}>
              {ranger.charAt(0).toUpperCase() + ranger.slice(1)} Ranger
            </p>
            
            <div className="quick-stats">
              <div className="stat-box">
                <div className="stat-icon">🎂</div>
                <div className="stat-info">
                  <span className="stat-label">Age</span>
                  <span className="stat-value">{calculateAge(displayData.dateOfBirth)}</span>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">🩸</div>
                <div className="stat-info">
                  <span className="stat-label">Blood Type</span>
                  <span className="stat-value">{displayData.bloodType}</span>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">📏</div>
                <div className="stat-info">
                  <span className="stat-label">Height</span>
                  <span className="stat-value">{displayData.height}</span>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">⚖️</div>
                <div className="stat-info">
                  <span className="stat-label">Weight</span>
                  <span className="stat-value">{displayData.weight}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-card settings-card">
            <h3>SETTINGS</h3>
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={displayData.notifications}
                  onChange={(e) => isEditing && handleChange('notifications', e.target.checked)}
                  disabled={!isEditing}
                />
                Enable Notifications
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={displayData.shareDataWithDoctor}
                  onChange={(e) => isEditing && handleChange('shareDataWithDoctor', e.target.checked)}
                  disabled={!isEditing}
                />
                Share Data with Doctor
              </label>
            </div>
          </div>
        </div>

        {/* Right Section - Detailed Information */}
        <div className="profile-main">
          {/* Personal Information */}
          <div className="info-section">
            <h3 className="section-title" style={{ borderLeftColor: currentColor }}>
              <span className="section-icon">👤</span>
              PERSONAL INFORMATION
            </h3>
            <div className="info-grid">
              <div className="info-field">
                <label>Full Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.fullName}</div>
                )}
              </div>
              <div className="info-field">
                <label>Email Address</label>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={editData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.email}</div>
                )}
              </div>
              <div className="info-field">
                <label>Phone Number</label>
                {isEditing ? (
                  <input 
                    type="tel" 
                    value={editData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.phone}</div>
                )}
              </div>
              <div className="info-field">
                <label>Date of Birth</label>
                {isEditing ? (
                  <input 
                    type="date" 
                    value={editData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{new Date(displayData.dateOfBirth).toLocaleDateString()}</div>
                )}
              </div>
              <div className="info-field">
                <label>Gender</label>
                {isEditing ? (
                  <select 
                    value={editData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                ) : (
                  <div className="info-value">{displayData.gender}</div>
                )}
              </div>
              <div className="info-field">
                <label>Blood Type</label>
                {isEditing ? (
                  <select 
                    value={editData.bloodType}
                    onChange={(e) => handleChange('bloodType', e.target.value)}
                  >
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                ) : (
                  <div className="info-value">{displayData.bloodType}</div>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="info-section">
            <h3 className="section-title" style={{ borderLeftColor: currentColor }}>
              <span className="section-icon">🏠</span>
              ADDRESS
            </h3>
            <div className="info-grid">
              <div className="info-field full-width">
                <label>Street Address</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.address}</div>
                )}
              </div>
              <div className="info-field">
                <label>City</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.city}</div>
                )}
              </div>
              <div className="info-field">
                <label>State</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.state}</div>
                )}
              </div>
              <div className="info-field">
                <label>ZIP Code</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.zipCode}
                    onChange={(e) => handleChange('zipCode', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.zipCode}</div>
                )}
              </div>
              <div className="info-field">
                <label>Country</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.country}</div>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="info-section">
            <h3 className="section-title" style={{ borderLeftColor: currentColor }}>
              <span className="section-icon">🚨</span>
              EMERGENCY CONTACT
            </h3>
            <div className="info-grid">
              <div className="info-field">
                <label>Contact Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.emergencyContactName}
                    onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.emergencyContactName}</div>
                )}
              </div>
              <div className="info-field">
                <label>Relationship</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.emergencyContactRelation}
                    onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.emergencyContactRelation}</div>
                )}
              </div>
              <div className="info-field">
                <label>Phone Number</label>
                {isEditing ? (
                  <input 
                    type="tel" 
                    value={editData.emergencyContactPhone}
                    onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.emergencyContactPhone}</div>
                )}
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="info-section">
            <h3 className="section-title" style={{ borderLeftColor: currentColor }}>
              <span className="section-icon">⚕️</span>
              MEDICAL INFORMATION
            </h3>
            <div className="info-grid">
              <div className="info-field">
                <label>Height</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.height}</div>
                )}
              </div>
              <div className="info-field">
                <label>Weight</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.weight}</div>
                )}
              </div>
              <div className="info-field full-width">
                <label>Allergies</label>
                {isEditing ? (
                  <textarea 
                    value={editData.allergies}
                    onChange={(e) => handleChange('allergies', e.target.value)}
                    rows="2"
                  />
                ) : (
                  <div className="info-value">{displayData.allergies}</div>
                )}
              </div>
              <div className="info-field full-width">
                <label>Chronic Conditions</label>
                {isEditing ? (
                  <textarea 
                    value={editData.chronicConditions}
                    onChange={(e) => handleChange('chronicConditions', e.target.value)}
                    rows="2"
                  />
                ) : (
                  <div className="info-value">{displayData.chronicConditions}</div>
                )}
              </div>
              <div className="info-field full-width">
                <label>Current Medications</label>
                {isEditing ? (
                  <textarea 
                    value={editData.currentMedications}
                    onChange={(e) => handleChange('currentMedications', e.target.value)}
                    rows="2"
                  />
                ) : (
                  <div className="info-value">{displayData.currentMedications}</div>
                )}
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          <div className="info-section">
            <h3 className="section-title" style={{ borderLeftColor: currentColor }}>
              <span className="section-icon">🛡️</span>
              INSURANCE INFORMATION
            </h3>
            <div className="info-grid">
              <div className="info-field">
                <label>Insurance Provider</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.insuranceProvider}
                    onChange={(e) => handleChange('insuranceProvider', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.insuranceProvider}</div>
                )}
              </div>
              <div className="info-field">
                <label>Policy Number</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.insurancePolicy}
                    onChange={(e) => handleChange('insurancePolicy', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.insurancePolicy}</div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="info-section">
            <h3 className="section-title" style={{ borderLeftColor: currentColor }}>
              <span className="section-icon">📋</span>
              ADDITIONAL INFORMATION
            </h3>
            <div className="info-grid">
              <div className="info-field">
                <label>Occupation</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.occupation}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                  />
                ) : (
                  <div className="info-value">{displayData.occupation}</div>
                )}
              </div>
              <div className="info-field">
                <label>Preferred Language</label>
                {isEditing ? (
                  <select 
                    value={editData.preferredLanguage}
                    onChange={(e) => handleChange('preferredLanguage', e.target.value)}
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>Chinese</option>
                    <option>Japanese</option>
                  </select>
                ) : (
                  <div className="info-value">{displayData.preferredLanguage}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

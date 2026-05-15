/**
 * Doctor Management - Operation Overdrive Administration
 * Doctor Account Management & Credential Verification
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from '../shared/Icon';
import './DoctorManagement.css';

const DoctorManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'

  // Mock doctor data
  const [doctors, setDoctors] = useState([
    {
      id: 'D001',
      name: 'Dr. Sarah Mitchell',
      email: 'sarah.mitchell@hospital.com',
      licenseNumber: 'MD-2024-001',
      specialty: 'Cardiology',
      status: 'active',
      verified: true,
      patients: 45,
      experience: '12 years',
      permissions: ['prescribe', 'diagnose', 'surgery'],
      joinedDate: '2024-01-10',
      phone: '+1-555-0101'
    },
    {
      id: 'D002',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@hospital.com',
      licenseNumber: 'MD-2024-002',
      specialty: 'Neurology',
      status: 'active',
      verified: true,
      patients: 38,
      experience: '8 years',
      permissions: ['prescribe', 'diagnose'],
      joinedDate: '2024-02-15',
      phone: '+1-555-0102'
    },
    {
      id: 'D003',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@hospital.com',
      licenseNumber: 'MD-2024-003',
      specialty: 'Pediatrics',
      status: 'active',
      verified: true,
      patients: 52,
      experience: '15 years',
      permissions: ['prescribe', 'diagnose', 'emergency'],
      joinedDate: '2024-01-20',
      phone: '+1-555-0103'
    },
    {
      id: 'D004',
      name: 'Dr. James Patterson',
      email: 'james.patterson@hospital.com',
      licenseNumber: 'MD-2024-004',
      specialty: 'Orthopedics',
      status: 'inactive',
      verified: true,
      patients: 0,
      experience: '10 years',
      permissions: ['prescribe', 'diagnose'],
      joinedDate: '2024-03-01',
      phone: '+1-555-0104'
    },
    {
      id: 'D005',
      name: 'Dr. Lisa Thompson',
      email: 'lisa.thompson@hospital.com',
      licenseNumber: 'MD-2024-005',
      specialty: 'General Medicine',
      status: 'active',
      verified: false,
      patients: 12,
      experience: '3 years',
      permissions: ['prescribe'],
      joinedDate: '2024-11-15',
      phone: '+1-555-0105'
    },
    {
      id: 'D006',
      name: 'Dr. Robert Kumar',
      email: 'robert.kumar@hospital.com',
      licenseNumber: 'MD-2024-006',
      specialty: 'Dermatology',
      status: 'active',
      verified: true,
      patients: 29,
      experience: '7 years',
      permissions: ['prescribe', 'diagnose'],
      joinedDate: '2024-04-10',
      phone: '+1-555-0106'
    }
  ]);

  // Form state
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    licenseNumber: '',
    specialty: '',
    experience: '',
    phone: '',
    permissions: []
  });

  // Filter and search logic
  const getFilteredDoctors = () => {
    return doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || doctor.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  };

  // Doctor actions
  const handleAddDoctor = () => {
    if (!doctorForm.name || !doctorForm.email || !doctorForm.licenseNumber || !doctorForm.specialty) {
      toast.error('Please fill all required fields');
      return;
    }

    const newDoctor = {
      id: `D${String(doctors.length + 1).padStart(3, '0')}`,
      ...doctorForm,
      status: 'active',
      verified: false,
      patients: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setDoctors([...doctors, newDoctor]);
    setShowAddModal(false);
    setDoctorForm({ name: '', email: '', licenseNumber: '', specialty: '', experience: '', phone: '', permissions: [] });
    toast.success(`Doctor ${newDoctor.name} added successfully`);
  };

  const handleEditDoctor = () => {
    if (!doctorForm.name || !doctorForm.email || !doctorForm.licenseNumber || !doctorForm.specialty) {
      toast.error('Please fill all required fields');
      return;
    }

    setDoctors(doctors.map(d => 
      d.id === selectedDoctor.id 
        ? { ...d, ...doctorForm }
        : d
    ));
    setShowEditModal(false);
    setSelectedDoctor(null);
    toast.success('Doctor updated successfully');
  };

  const handleDeleteDoctor = (doctor) => {
    if (window.confirm(`Are you sure you want to delete doctor ${doctor.name}?`)) {
      setDoctors(doctors.filter(d => d.id !== doctor.id));
      toast.success(`Doctor ${doctor.name} deleted`);
    }
  };

  const handleToggleDoctorStatus = (doctor) => {
    setDoctors(doctors.map(d => 
      d.id === doctor.id 
        ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' }
        : d
    ));
    toast.success(`Doctor ${doctor.name} ${doctor.status === 'active' ? 'deactivated' : 'activated'}`);
  };

  const handleVerifyDoctor = (doctor) => {
    setDoctors(doctors.map(d => 
      d.id === doctor.id 
        ? { ...d, verified: !d.verified }
        : d
    ));
    toast.success(`Doctor ${doctor.name} ${doctor.verified ? 'unverified' : 'verified'}`);
  };

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setDoctorForm({
      name: doctor.name,
      email: doctor.email,
      licenseNumber: doctor.licenseNumber,
      specialty: doctor.specialty,
      experience: doctor.experience,
      phone: doctor.phone,
      permissions: doctor.permissions
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#00ff88' : '#666';
  };

  return (
    <div className="doctor-management">
      {/* Header */}
      <div className="dm-header">
        <div className="dm-header-left">
          <button className="back-btn" onClick={() => navigate('/zordon/users')}>
            <Icon name="arrowLeft" size={20} />
          </button>
          <div className="dm-title-section">
            <h1>DOCTOR MANAGEMENT</h1>
            <p>Operation Overdrive • Doctor Account Administration</p>
          </div>
        </div>
        <div className="dm-stats">
          <div className="dm-stat">
            <Icon name="doctor" size={24} color="#00ff88" />
            <div>
              <span className="stat-value">{doctors.filter(d => d.status === 'active').length}</span>
              <span className="stat-label">Active Doctors</span>
            </div>
          </div>
          <div className="dm-stat">
            <Icon name="shieldCheck" size={24} color="#00d4ff" />
            <div>
              <span className="stat-value">{doctors.filter(d => d.verified).length}</span>
              <span className="stat-label">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="dm-controls">
        <div className="dm-search">
          <Icon name="search" size={20} />
          <input 
            type="text"
            placeholder="Search doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="dm-filters">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
        <button className="dm-add-btn" onClick={() => setShowAddModal(true)}>
          <Icon name="plus" size={20} />
          <span>Add Doctor</span>
        </button>
      </div>

      {/* Table */}
      <div className="dm-table-container">
        <table className="dm-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor Name</th>
              <th>Email</th>
              <th>License</th>
              <th>Specialty</th>
              <th>Experience</th>
              <th>Patients</th>
              <th>Verified</th>
              <th>Permissions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredDoctors().map(doctor => (
              <tr key={doctor.id} className={doctor.status === 'inactive' ? 'inactive-row' : ''}>
                <td className="id-cell">{doctor.id}</td>
                <td className="name-cell">
                  <div className="name-info">
                    <Icon name="doctor" size={18} color="#00ff88" />
                    <span>{doctor.name}</span>
                  </div>
                </td>
                <td>{doctor.email}</td>
                <td className="license-cell">{doctor.licenseNumber}</td>
                <td>
                  <span className="specialty-badge">{doctor.specialty}</span>
                </td>
                <td>{doctor.experience}</td>
                <td className="patients-cell">{doctor.patients}</td>
                <td>
                  <span 
                    className="verified-badge"
                    style={{ 
                      backgroundColor: doctor.verified ? '#00ff8820' : '#ffaa0020',
                      color: doctor.verified ? '#00ff88' : '#ffaa00',
                      border: `1px solid ${doctor.verified ? '#00ff88' : '#ffaa00'}`
                    }}
                  >
                    {doctor.verified ? '✓ VERIFIED' : '⚠ PENDING'}
                  </span>
                </td>
                <td>
                  <div className="permissions-list">
                    {doctor.permissions.map(perm => (
                      <span key={perm} className="permission-tag">{perm}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ color: getStatusColor(doctor.status) }}
                  >
                    {doctor.status.toUpperCase()}
                  </span>
                </td>
                <td className="actions-cell">
                  <button 
                    className="action-btn verify-btn"
                    onClick={() => handleVerifyDoctor(doctor)}
                    title={doctor.verified ? 'Unverify' : 'Verify Credentials'}
                    style={{ 
                      backgroundColor: doctor.verified ? '#ffaa0020' : '#00ff8820',
                      color: doctor.verified ? '#ffaa00' : '#00ff88'
                    }}
                  >
                    <Icon name={doctor.verified ? 'shield' : 'shieldCheck'} size={16} />
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => openEditModal(doctor)}
                    title="Edit Doctor"
                  >
                    <Icon name="edit" size={16} />
                  </button>
                  <button 
                    className="action-btn toggle-btn"
                    onClick={() => handleToggleDoctorStatus(doctor)}
                    title={doctor.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    <Icon name={doctor.status === 'active' ? 'userX' : 'userCheck'} size={16} />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteDoctor(doctor)}
                    title="Delete Doctor"
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {getFilteredDoctors().length === 0 && (
          <div className="no-results">
            <Icon name="search" size={48} color="#666" />
            <p>No doctors found</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Doctor</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <Icon name="x" size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                    placeholder="doctor@hospital.com"
                  />
                </div>
                <div className="form-group">
                  <label>License Number *</label>
                  <input 
                    type="text"
                    value={doctorForm.licenseNumber}
                    onChange={(e) => setDoctorForm({...doctorForm, licenseNumber: e.target.value})}
                    placeholder="MD-2024-XXX"
                  />
                </div>
                <div className="form-group">
                  <label>Specialty *</label>
                  <input 
                    type="text"
                    value={doctorForm.specialty}
                    onChange={(e) => setDoctorForm({...doctorForm, specialty: e.target.value})}
                    placeholder="e.g., Cardiology"
                  />
                </div>
                <div className="form-group">
                  <label>Experience</label>
                  <input 
                    type="text"
                    value={doctorForm.experience}
                    onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
                    placeholder="e.g., 10 years"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel"
                    value={doctorForm.phone}
                    onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                    placeholder="+1-555-0000"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Permissions</label>
                  <div className="permission-checkboxes">
                    {['prescribe', 'diagnose', 'surgery', 'emergency'].map(perm => (
                      <label key={perm} className="checkbox-label">
                        <input 
                          type="checkbox"
                          checked={doctorForm.permissions.includes(perm)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDoctorForm({...doctorForm, permissions: [...doctorForm.permissions, perm]});
                            } else {
                              setDoctorForm({...doctorForm, permissions: doctorForm.permissions.filter(p => p !== perm)});
                            }
                          }}
                        />
                        <span>{perm.charAt(0).toUpperCase() + perm.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="modal-btn save-btn" onClick={handleAddDoctor}>
                <Icon name="plus" size={18} />
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedDoctor && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Doctor</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <Icon name="x" size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>License Number *</label>
                  <input 
                    type="text"
                    value={doctorForm.licenseNumber}
                    onChange={(e) => setDoctorForm({...doctorForm, licenseNumber: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Specialty *</label>
                  <input 
                    type="text"
                    value={doctorForm.specialty}
                    onChange={(e) => setDoctorForm({...doctorForm, specialty: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Experience</label>
                  <input 
                    type="text"
                    value={doctorForm.experience}
                    onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel"
                    value={doctorForm.phone}
                    onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Permissions</label>
                  <div className="permission-checkboxes">
                    {['prescribe', 'diagnose', 'surgery', 'emergency'].map(perm => (
                      <label key={perm} className="checkbox-label">
                        <input 
                          type="checkbox"
                          checked={doctorForm.permissions.includes(perm)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDoctorForm({...doctorForm, permissions: [...doctorForm.permissions, perm]});
                            } else {
                              setDoctorForm({...doctorForm, permissions: doctorForm.permissions.filter(p => p !== perm)});
                            }
                          }}
                        />
                        <span>{perm.charAt(0).toUpperCase() + perm.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="modal-btn save-btn" onClick={handleEditDoctor}>
                <Icon name="save" size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;

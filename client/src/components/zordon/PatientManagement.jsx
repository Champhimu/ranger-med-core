/**
 * Patient Management - Operation Overdrive Administration
 * Patient Account Management
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from '../shared/Icon';
import './PatientManagement.css';

const PatientManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive', 'high-risk'

  // Mock patient data
  const [patients, setPatients] = useState([
    {
      id: 'P001',
      name: 'Jason Lee Scott',
      email: 'jason@rangers.com',
      age: 28,
      team: 'Red Ranger',
      status: 'active',
      riskLevel: 'low',
      lastVisit: '2025-12-05',
      conditions: ['Hypertension'],
      medications: 3,
      registeredDate: '2024-01-15'
    },
    {
      id: 'P002',
      name: 'Kimberly Hart',
      email: 'kimberly@rangers.com',
      age: 27,
      team: 'Pink Ranger',
      status: 'active',
      riskLevel: 'high',
      lastVisit: '2025-12-06',
      conditions: ['Diabetes Type 2', 'Asthma'],
      medications: 5,
      registeredDate: '2024-02-20'
    },
    {
      id: 'P003',
      name: 'Billy Cranston',
      email: 'billy@rangers.com',
      age: 26,
      team: 'Blue Ranger',
      status: 'active',
      riskLevel: 'medium',
      lastVisit: '2025-12-04',
      conditions: ['Allergies'],
      medications: 2,
      registeredDate: '2024-01-20'
    },
    {
      id: 'P004',
      name: 'Trini Kwan',
      email: 'trini@rangers.com',
      age: 27,
      team: 'Yellow Ranger',
      status: 'active',
      riskLevel: 'low',
      lastVisit: '2025-12-03',
      conditions: [],
      medications: 1,
      registeredDate: '2024-03-10'
    },
    {
      id: 'P005',
      name: 'Zack Taylor',
      email: 'zack@rangers.com',
      age: 28,
      team: 'Black Ranger',
      status: 'inactive',
      riskLevel: 'low',
      lastVisit: '2025-11-15',
      conditions: [],
      medications: 0,
      registeredDate: '2024-01-25'
    },
    {
      id: 'P006',
      name: 'Tommy Oliver',
      email: 'tommy@rangers.com',
      age: 29,
      team: 'Green Ranger',
      status: 'active',
      riskLevel: 'high',
      lastVisit: '2025-12-07',
      conditions: ['Heart Disease', 'High Cholesterol'],
      medications: 6,
      registeredDate: '2024-02-01'
    }
  ]);

  // Form state
  const [patientForm, setPatientForm] = useState({
    name: '',
    email: '',
    age: '',
    team: '',
    riskLevel: 'low',
    conditions: '',
    medications: 0
  });

  // Filter and search logic
  const getFilteredPatients = () => {
    return patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           patient.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'high-risk' ? patient.riskLevel === 'high' : patient.status === filterStatus);
      
      return matchesSearch && matchesFilter;
    });
  };

  // Patient actions
  const handleAddPatient = () => {
    if (!patientForm.name || !patientForm.email || !patientForm.age) {
      toast.error('Please fill all required fields');
      return;
    }

    const newPatient = {
      id: `P${String(patients.length + 1).padStart(3, '0')}`,
      ...patientForm,
      status: 'active',
      lastVisit: new Date().toISOString().split('T')[0],
      conditions: patientForm.conditions.split(',').map(c => c.trim()).filter(c => c),
      registeredDate: new Date().toISOString().split('T')[0]
    };

    setPatients([...patients, newPatient]);
    setShowAddModal(false);
    setPatientForm({ name: '', email: '', age: '', team: '', riskLevel: 'low', conditions: '', medications: 0 });
    toast.success(`Patient ${newPatient.name} added successfully`);
  };

  const handleEditPatient = () => {
    if (!patientForm.name || !patientForm.email || !patientForm.age) {
      toast.error('Please fill all required fields');
      return;
    }

    setPatients(patients.map(p => 
      p.id === selectedPatient.id 
        ? { 
            ...p, 
            ...patientForm,
            conditions: patientForm.conditions.split(',').map(c => c.trim()).filter(c => c)
          }
        : p
    ));
    setShowEditModal(false);
    setSelectedPatient(null);
    toast.success('Patient updated successfully');
  };

  const handleDeletePatient = (patient) => {
    if (window.confirm(`Are you sure you want to delete patient ${patient.name}?`)) {
      setPatients(patients.filter(p => p.id !== patient.id));
      toast.success(`Patient ${patient.name} deleted`);
    }
  };

  const handleTogglePatientStatus = (patient) => {
    setPatients(patients.map(p => 
      p.id === patient.id 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ));
    toast.success(`Patient ${patient.name} ${patient.status === 'active' ? 'deactivated' : 'activated'}`);
  };

  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setPatientForm({
      name: patient.name,
      email: patient.email,
      age: patient.age,
      team: patient.team,
      riskLevel: patient.riskLevel,
      conditions: patient.conditions.join(', '),
      medications: patient.medications
    });
    setShowEditModal(true);
  };

  const getRiskLevelColor = (level) => {
    switch(level) {
      case 'high': return '#ff0044';
      case 'medium': return '#ffaa00';
      case 'low': return '#00ff88';
      default: return '#0088ff';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#00ff88' : '#666';
  };

  return (
    <div className="patient-management">
      {/* Header */}
      <div className="pm-header">
        <div className="pm-header-left">
          <button className="back-btn" onClick={() => navigate('/zordon/users')}>
            <Icon name="arrowLeft" size={20} />
          </button>
          <div className="pm-title-section">
            <h1>PATIENT MANAGEMENT</h1>
            <p>Operation Overdrive • Patient Account Administration</p>
          </div>
        </div>
        <div className="pm-stats">
          <div className="pm-stat">
            <Icon name="users" size={24} color="#00d4ff" />
            <div>
              <span className="stat-value">{patients.filter(p => p.status === 'active').length}</span>
              <span className="stat-label">Active Patients</span>
            </div>
          </div>
          <div className="pm-stat">
            <Icon name="alertCircle" size={24} color="#ff0044" />
            <div>
              <span className="stat-value">{patients.filter(p => p.riskLevel === 'high').length}</span>
              <span className="stat-label">High Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="pm-controls">
        <div className="pm-search">
          <Icon name="search" size={20} />
          <input 
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="pm-filters">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="high-risk">High Risk Only</option>
          </select>
        </div>
        <button className="pm-add-btn" onClick={() => setShowAddModal(true)}>
          <Icon name="plus" size={20} />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Table */}
      <div className="pm-table-container">
        <table className="pm-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Team</th>
              <th>Risk Level</th>
              <th>Conditions</th>
              <th>Medications</th>
              <th>Last Visit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredPatients().map(patient => (
              <tr key={patient.id} className={patient.status === 'inactive' ? 'inactive-row' : ''}>
                <td className="id-cell">{patient.id}</td>
                <td className="name-cell">
                  <div className="name-info">
                    <Icon name="user" size={18} color="#00d4ff" />
                    <span>{patient.name}</span>
                  </div>
                </td>
                <td>{patient.email}</td>
                <td>{patient.age}</td>
                <td>
                  <span className="team-badge">{patient.team}</span>
                </td>
                <td>
                  <span 
                    className="risk-badge"
                    style={{ 
                      backgroundColor: `${getRiskLevelColor(patient.riskLevel)}20`,
                      color: getRiskLevelColor(patient.riskLevel),
                      border: `1px solid ${getRiskLevelColor(patient.riskLevel)}`
                    }}
                  >
                    {patient.riskLevel.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className="conditions-list">
                    {patient.conditions.length > 0 ? patient.conditions.join(', ') : 'None'}
                  </span>
                </td>
                <td className="meds-cell">{patient.medications}</td>
                <td>{patient.lastVisit}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ color: getStatusColor(patient.status) }}
                  >
                    {patient.status.toUpperCase()}
                  </span>
                </td>
                <td className="actions-cell">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => toast.success(`Viewing ${patient.name}'s health records`)}
                    title="View Health Records"
                  >
                    <Icon name="fileText" size={16} />
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => openEditModal(patient)}
                    title="Edit Patient"
                  >
                    <Icon name="edit" size={16} />
                  </button>
                  <button 
                    className="action-btn toggle-btn"
                    onClick={() => handleTogglePatientStatus(patient)}
                    title={patient.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    <Icon name={patient.status === 'active' ? 'userX' : 'userCheck'} size={16} />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeletePatient(patient)}
                    title="Delete Patient"
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {getFilteredPatients().length === 0 && (
          <div className="no-results">
            <Icon name="search" size={48} color="#666" />
            <p>No patients found</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Patient</h2>
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
                    value={patientForm.name}
                    onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email"
                    value={patientForm.email}
                    onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
                    placeholder="patient@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input 
                    type="number"
                    value={patientForm.age}
                    onChange={(e) => setPatientForm({...patientForm, age: e.target.value})}
                    placeholder="Age"
                  />
                </div>
                <div className="form-group">
                  <label>Team/Role</label>
                  <input 
                    type="text"
                    value={patientForm.team}
                    onChange={(e) => setPatientForm({...patientForm, team: e.target.value})}
                    placeholder="e.g., Red Ranger"
                  />
                </div>
                <div className="form-group">
                  <label>Risk Level</label>
                  <select 
                    value={patientForm.riskLevel}
                    onChange={(e) => setPatientForm({...patientForm, riskLevel: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Number of Medications</label>
                  <input 
                    type="number"
                    value={patientForm.medications}
                    onChange={(e) => setPatientForm({...patientForm, medications: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Medical Conditions (comma-separated)</label>
                  <input 
                    type="text"
                    value={patientForm.conditions}
                    onChange={(e) => setPatientForm({...patientForm, conditions: e.target.value})}
                    placeholder="e.g., Hypertension, Diabetes"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="modal-btn save-btn" onClick={handleAddPatient}>
                <Icon name="plus" size={18} />
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPatient && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Patient</h2>
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
                    value={patientForm.name}
                    onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email"
                    value={patientForm.email}
                    onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input 
                    type="number"
                    value={patientForm.age}
                    onChange={(e) => setPatientForm({...patientForm, age: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Team/Role</label>
                  <input 
                    type="text"
                    value={patientForm.team}
                    onChange={(e) => setPatientForm({...patientForm, team: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Risk Level</label>
                  <select 
                    value={patientForm.riskLevel}
                    onChange={(e) => setPatientForm({...patientForm, riskLevel: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Number of Medications</label>
                  <input 
                    type="number"
                    value={patientForm.medications}
                    onChange={(e) => setPatientForm({...patientForm, medications: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Medical Conditions (comma-separated)</label>
                  <input 
                    type="text"
                    value={patientForm.conditions}
                    onChange={(e) => setPatientForm({...patientForm, conditions: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="modal-btn save-btn" onClick={handleEditPatient}>
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

export default PatientManagement;

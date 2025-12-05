import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Capsules.css';

const Capsules = ({ ranger = 'red' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('current');
  const [showAddForm, setShowAddForm] = useState(false);
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Morphinium-12',
      dosage: '500mg',
      frequency: 'Twice Daily',
      time: ['08:00', '20:00'],
      stock: 45,
      refillDate: '2025-02-15',
      prescribedBy: 'Dr. Hartley',
      condition: 'Core Energy Stabilization',
      lastTaken: '2025-01-25 08:00',
      status: 'active',
      sideEffects: 'May cause mild drowsiness',
      instructions: 'Take with food'
    },
    {
      id: 2,
      name: 'Neural-Sync Plus',
      dosage: '250mg',
      frequency: 'Once Daily',
      time: ['09:00'],
      stock: 12,
      refillDate: '2025-01-30',
      prescribedBy: 'Dr. Spencer',
      condition: 'Enhanced Cognitive Function',
      lastTaken: '2025-01-25 09:00',
      status: 'low-stock',
      sideEffects: 'None reported',
      instructions: 'Take in the morning'
    },
    {
      id: 3,
      name: 'Ranger Vitamins Complex',
      dosage: '1 Tablet',
      frequency: 'Once Daily',
      time: ['07:00'],
      stock: 60,
      refillDate: '2025-03-01',
      prescribedBy: 'Dr. Hartley',
      condition: 'General Health Maintenance',
      lastTaken: '2025-01-25 07:00',
      status: 'active',
      sideEffects: 'None',
      instructions: 'Take before breakfast'
    }
  ]);

  const [medicationHistory] = useState([
    {
      id: 101,
      name: 'Bio-Sync Capsules',
      dosage: '100mg',
      period: '2024-06 to 2024-12',
      reason: 'Completed treatment cycle',
      prescribedBy: 'Dr. Hartley'
    },
    {
      id: 102,
      name: 'Power Stabilizer-X',
      dosage: '300mg',
      period: '2024-03 to 2024-08',
      reason: 'Switched to newer formula',
      prescribedBy: 'Dr. Spencer'
    }
  ]);

  const [reminders] = useState([
    {
      id: 1,
      medication: 'Morphinium-12',
      time: '08:00',
      status: 'pending',
      date: '2025-01-26'
    },
    {
      id: 2,
      medication: 'Neural-Sync Plus',
      time: '09:00',
      status: 'pending',
      date: '2025-01-26'
    },
    {
      id: 3,
      medication: 'Ranger Vitamins Complex',
      time: '07:00',
      status: 'upcoming',
      date: '2025-01-26'
    }
  ]);

  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'Once Daily',
    time: '',
    stock: '',
    prescribedBy: '',
    condition: '',
    instructions: '',
    sideEffects: ''
  });

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      const medication = {
        id: medications.length + 1,
        ...newMedication,
        time: newMedication.time.split(',').map(t => t.trim()),
        stock: parseInt(newMedication.stock),
        refillDate: calculateRefillDate(parseInt(newMedication.stock), newMedication.frequency),
        lastTaken: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'active'
      };
      setMedications([...medications, medication]);
      setShowAddForm(false);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: 'Once Daily',
        time: '',
        stock: '',
        prescribedBy: '',
        condition: '',
        instructions: '',
        sideEffects: ''
      });
    }
  };

  const calculateRefillDate = (stock, frequency) => {
    const daysPerPill = frequency === 'Once Daily' ? 1 : frequency === 'Twice Daily' ? 0.5 : 0.33;
    const daysLeft = stock * daysPerPill;
    const refillDate = new Date();
    refillDate.setDate(refillDate.getDate() + daysLeft);
    return refillDate.toISOString().split('T')[0];
  };

  const handleMarkTaken = (medId) => {
    setMedications(medications.map(med => 
      med.id === medId 
        ? { ...med, lastTaken: new Date().toISOString().slice(0, 16).replace('T', ' '), stock: med.stock - 1 }
        : med
    ));
  };

  const getStockStatus = (stock, frequency) => {
    const daysLeft = frequency === 'Once Daily' ? stock : frequency === 'Twice Daily' ? stock / 2 : stock / 3;
    if (daysLeft <= 7) return 'critical';
    if (daysLeft <= 14) return 'low';
    return 'good';
  };

  const rangerColors = {
    red: '#FF0000',
    blue: '#0066FF',
    yellow: '#FFD700',
    black: '#000000',
    pink: '#FF69B4',
    mercury: '#C0C0C0'
  };

  const currentColor = rangerColors[ranger] || rangerColors.red;

  return (
    <div className="capsules-page">
      <div className="space-background"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="capsules-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← DASHBOARD
        </button>
        <div className="header-content">
          <h1>CAPSULES MANAGEMENT</h1>
          <p>MEDICATION TRACKING SYSTEM</p>
        </div>
        <button 
          className="add-med-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ borderColor: currentColor, color: currentColor }}
        >
          {showAddForm ? '✕ CANCEL' : '+ ADD MEDICATION'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-medication-modal">
          <div className="modal-content">
            <h2>Add New Medication</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Medication Name *</label>
                <input
                  type="text"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  placeholder="e.g., Morphinium-12"
                />
              </div>
              <div className="form-group">
                <label>Dosage *</label>
                <input
                  type="text"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  placeholder="e.g., 500mg"
                />
              </div>
              <div className="form-group">
                <label>Frequency</label>
                <select
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                >
                  <option>Once Daily</option>
                  <option>Twice Daily</option>
                  <option>Three Times Daily</option>
                </select>
              </div>
              <div className="form-group">
                <label>Time(s) (comma-separated)</label>
                <input
                  type="text"
                  value={newMedication.time}
                  onChange={(e) => setNewMedication({...newMedication, time: e.target.value})}
                  placeholder="e.g., 08:00, 20:00"
                />
              </div>
              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  value={newMedication.stock}
                  onChange={(e) => setNewMedication({...newMedication, stock: e.target.value})}
                  placeholder="Number of pills"
                />
              </div>
              <div className="form-group">
                <label>Prescribed By</label>
                <input
                  type="text"
                  value={newMedication.prescribedBy}
                  onChange={(e) => setNewMedication({...newMedication, prescribedBy: e.target.value})}
                  placeholder="Doctor name"
                />
              </div>
              <div className="form-group full-width">
                <label>Condition/Purpose</label>
                <input
                  type="text"
                  value={newMedication.condition}
                  onChange={(e) => setNewMedication({...newMedication, condition: e.target.value})}
                  placeholder="What is this medication for?"
                />
              </div>
              <div className="form-group full-width">
                <label>Instructions</label>
                <textarea
                  value={newMedication.instructions}
                  onChange={(e) => setNewMedication({...newMedication, instructions: e.target.value})}
                  placeholder="Special instructions..."
                  rows="2"
                />
              </div>
              <div className="form-group full-width">
                <label>Side Effects</label>
                <textarea
                  value={newMedication.sideEffects}
                  onChange={(e) => setNewMedication({...newMedication, sideEffects: e.target.value})}
                  placeholder="Known side effects..."
                  rows="2"
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button 
                className="submit-btn" 
                onClick={handleAddMedication}
                style={{ background: currentColor }}
              >
                Add Medication
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="capsules-container">
        <div className="main-content">
          <div className="tabs-container">
            <button
              className={`tab ${activeTab === 'current' ? 'active' : ''}`}
              onClick={() => setActiveTab('current')}
              style={activeTab === 'current' ? { borderBottomColor: currentColor, color: currentColor } : {}}
            >
              Current Medications
            </button>
            <button
              className={`tab ${activeTab === 'reminders' ? 'active' : ''}`}
              onClick={() => setActiveTab('reminders')}
              style={activeTab === 'reminders' ? { borderBottomColor: currentColor, color: currentColor } : {}}
            >
              Reminders
            </button>
            <button
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
              style={activeTab === 'history' ? { borderBottomColor: currentColor, color: currentColor } : {}}
            >
              History
            </button>
          </div>

          {activeTab === 'current' && (
            <div className="medications-grid">
              {medications.map(med => {
                const stockStatus = getStockStatus(med.stock, med.frequency);
                return (
                  <div key={med.id} className="medication-card">
                    <div className="med-header">
                      <div className="pill-icon" style={{ background: currentColor }}>💊</div>
                      <div className="med-title">
                        <h3>{med.name}</h3>
                        <span className="dosage">{med.dosage}</span>
                      </div>
                      <div className={`stock-badge ${stockStatus}`}>
                        {med.stock} pills
                      </div>
                    </div>
                    <div className="med-details">
                      <div className="detail-row">
                        <span className="label">Frequency:</span>
                        <span className="value">{med.frequency}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Schedule:</span>
                        <span className="value">{med.time.join(', ')}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Prescribed by:</span>
                        <span className="value">{med.prescribedBy}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Condition:</span>
                        <span className="value">{med.condition}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Refill by:</span>
                        <span className="value">{new Date(med.refillDate).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Last taken:</span>
                        <span className="value">{med.lastTaken}</span>
                      </div>
                    </div>
                    <div className="med-notes">
                      <p><strong>Instructions:</strong> {med.instructions}</p>
                      <p><strong>Side Effects:</strong> {med.sideEffects}</p>
                    </div>
                    <button 
                      className="mark-taken-btn"
                      onClick={() => handleMarkTaken(med.id)}
                      style={{ background: currentColor }}
                    >
                      ✓ Mark as Taken
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'reminders' && (
            <div className="reminders-section">
              <div className="reminders-header">
                <h2>Today's Medication Schedule</h2>
                <p>Stay on track with your health routine</p>
              </div>
              <div className="reminders-list">
                {reminders
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(reminder => (
                    <div key={reminder.id} className={`reminder-card ${reminder.status}`}>
                      <div className="time-badge" style={{ borderColor: currentColor }}>
                        {reminder.time}
                      </div>
                      <div className="reminder-content">
                        <h4>{reminder.medication}</h4>
                        <p>{medications.find(m => m.name === reminder.medication)?.dosage}</p>
                      </div>
                      <div className={`status-indicator ${reminder.status}`}>
                        {reminder.status === 'pending' ? '⏰ Pending' : '🕐 Upcoming'}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-section">
              <h2>Medication History</h2>
              <div className="history-timeline">
                {medicationHistory.map(item => (
                  <div key={item.id} className="history-card">
                    <div className="timeline-dot" style={{ background: currentColor }}></div>
                    <div className="history-content">
                      <h3>{item.name}</h3>
                      <div className="history-details">
                        <p><strong>Dosage:</strong> {item.dosage}</p>
                        <p><strong>Period:</strong> {item.period}</p>
                        <p><strong>Prescribed by:</strong> {item.prescribedBy}</p>
                        <p><strong>Reason for discontinuation:</strong> {item.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="alerts-panel">
          <div className="panel-section refill-alerts">
            <h3>⚠️ Refill Alerts</h3>
            <div className="alerts-list">
              {medications
                .filter(med => getStockStatus(med.stock, med.frequency) !== 'good')
                .map(med => (
                  <div key={med.id} className={`alert-card ${getStockStatus(med.stock, med.frequency)}`}>
                    <div className="alert-icon">
                      {getStockStatus(med.stock, med.frequency) === 'critical' ? '🚨' : '⚠️'}
                    </div>
                    <div className="alert-content">
                      <h4>{med.name}</h4>
                      <p>{med.stock} pills left</p>
                      <p className="refill-date">Refill by: {new Date(med.refillDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              {medications.filter(med => getStockStatus(med.stock, med.frequency) !== 'good').length === 0 && (
                <p className="no-alerts">All medications well-stocked ✓</p>
              )}
            </div>
          </div>

          <div className="panel-section stats">
            <h3>📊 Statistics</h3>
            <div className="stat-item">
              <span className="stat-label">Active Medications</span>
              <span className="stat-value" style={{ color: currentColor }}>{medications.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Daily Doses</span>
              <span className="stat-value" style={{ color: currentColor }}>
                {medications.reduce((sum, med) => sum + med.time.length, 0)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Low Stock Items</span>
              <span className="stat-value" style={{ color: currentColor }}>
                {medications.filter(med => getStockStatus(med.stock, med.frequency) !== 'good').length}
              </span>
            </div>
          </div>

          <div className="panel-section tips">
            <h3>💡 Health Tips</h3>
            <div className="tip">
              <p>💊 Take medications at the same time each day</p>
            </div>
            <div className="tip">
              <p>💧 Stay hydrated when taking medications</p>
            </div>
            <div className="tip">
              <p>📝 Keep track of any side effects</p>
            </div>
            <div className="tip">
              <p>👨‍⚕️ Consult your doctor before stopping any medication</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cockpit-frame"></div>
    </div>
  );
};

export default Capsules;

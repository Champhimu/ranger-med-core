import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from './Icon';
import './Capsules.css';

const Capsules = ({ ranger = 'red' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('current');
  const [showAddForm, setShowAddForm] = useState(false);
  const [capsuleDoses, setCapsuleDoses] = useState({}); // Track which doses are taken
  const [snoozedCapsules, setSnoozedCapsules] = useState({}); // Track snoozed capsules
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Morphinium-12',
      dosage: '500mg',
      frequency: 'Twice Daily',
      timesPerDay: 2,
      prescribedByDoctor: true,
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
      frequency: 'Thrice Daily',
      timesPerDay: 3,
      prescribedByDoctor: true,
      time: ['09:00', '15:00', '21:00'],
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
      timesPerDay: 1,
      prescribedByDoctor: true,
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

  // Handler for taking capsule dose
  const handleTakeDose = (medId, doseNumber) => {
    const medication = medications.find(med => med.id === medId);
    if (!medication) return;

    if (medication.stock <= 0) {
      toast.error('⚠️ No stock available! Please refill medication.', {
        icon: '📦',
      });
      return;
    }

    setCapsuleDoses(prev => ({
      ...prev,
      [medId]: [...(prev[medId] || []), doseNumber]
    }));

    // Update stock
    setMedications(medications.map(med => 
      med.id === medId 
        ? { ...med, lastTaken: new Date().toISOString().slice(0, 16).replace('T', ' '), stock: med.stock - 1 }
        : med
    ));

    toast.success(`✅ Dose ${doseNumber} of ${medication.name} taken!`, {
      icon: '💊',
      duration: 2000,
    });

    // Check for low stock warning
    const newStock = medication.stock - 1;
    if (newStock <= 10 && newStock > 0) {
      setTimeout(() => {
        toast.warning(`⚠️ Low stock alert for ${medication.name}! Only ${newStock} left.`, {
          duration: 3000,
          icon: '📦',
        });
      }, 500);
    }
  };

  // Handler for snoozing capsule
  const handleSnoozeCapsule = (medId) => {
    setSnoozedCapsules(prev => ({
      ...prev,
      [medId]: true
    }));
    
    const medication = medications.find(med => med.id === medId);
    toast.success(`🔕 ${medication?.name} snoozed for 10 minutes`, {
      duration: 2000,
    });

    // Auto-unsnooze after 10 minutes (600000 milliseconds)
    setTimeout(() => {
      setSnoozedCapsules(prev => ({
        ...prev,
        [medId]: false
      }));
      toast.info(`🔔 ${medication?.name} reminder is back!`, {
        duration: 2000,
      });
    }, 600000); // 10 minutes
  };

  // Check if all doses are taken for a medication
  const allDosesTaken = (medId, timesPerDay) => {
    const takenDoses = capsuleDoses[medId] || [];
    return takenDoses.length >= timesPerDay;
  };

  // Smart Reminders: Track dose history and patterns
  const [doseHistory] = useState([
    { medication: 'Morphinium-12', scheduledTime: '08:00', actualTime: '08:05', date: '2025-01-24' },
    { medication: 'Morphinium-12', scheduledTime: '08:00', actualTime: '08:12', date: '2025-01-23' },
    { medication: 'Morphinium-12', scheduledTime: '08:00', actualTime: '07:58', date: '2025-01-22' },
    { medication: 'Morphinium-12', scheduledTime: '08:00', actualTime: '08:20', date: '2025-01-21' },
    { medication: 'Neural-Sync Plus', scheduledTime: '09:00', actualTime: '09:15', date: '2025-01-24' },
    { medication: 'Neural-Sync Plus', scheduledTime: '09:00', actualTime: '09:10', date: '2025-01-23' },
    { medication: 'Ranger Vitamins Complex', scheduledTime: '07:00', actualTime: '07:05', date: '2025-01-24' },
    { medication: 'Ranger Vitamins Complex', scheduledTime: '07:00', actualTime: '07:02', date: '2025-01-23' }
  ]);

  // Calculate smart reminder timing based on user patterns
  const calculateSmartReminderTime = (medication) => {
    const medHistory = doseHistory.filter(d => d.medication === medication);
    
    if (medHistory.length < 3) {
      // Not enough data, use scheduled time
      const med = medications.find(m => m.name === medication);
      return med?.time[0] || '08:00';
    }

    // Calculate average actual taking time
    const totalMinutes = medHistory.reduce((sum, dose) => {
      const [hours, mins] = dose.actualTime.split(':').map(Number);
      return sum + (hours * 60 + mins);
    }, 0);
    
    const avgMinutes = Math.round(totalMinutes / medHistory.length);
    const avgHours = Math.floor(avgMinutes / 60);
    const avgMins = avgMinutes % 60;
    
    // Suggest reminder 10 minutes before average time
    const reminderMinutes = avgMinutes - 10;
    const reminderHours = Math.floor(reminderMinutes / 60);
    const reminderMins = reminderMinutes % 60;
    
    return `${String(reminderHours).padStart(2, '0')}:${String(reminderMins).padStart(2, '0')}`;
  };

  // Analyze adherence patterns
  const analyzeAdherencePattern = (medication) => {
    const medHistory = doseHistory.filter(d => d.medication === medication);
    
    if (medHistory.length < 3) {
      return { pattern: 'insufficient-data', avgDelay: 0, consistency: 'unknown' };
    }

    const delays = medHistory.map(dose => {
      const [schedHours, schedMins] = dose.scheduledTime.split(':').map(Number);
      const [actualHours, actualMins] = dose.actualTime.split(':').map(Number);
      const scheduledMinutes = schedHours * 60 + schedMins;
      const actualMinutes = actualHours * 60 + actualMins;
      return actualMinutes - scheduledMinutes;
    });

    const avgDelay = Math.round(delays.reduce((sum, d) => sum + d, 0) / delays.length);
    const variance = delays.reduce((sum, d) => sum + Math.pow(d - avgDelay, 2), 0) / delays.length;
    const stdDev = Math.sqrt(variance);

    let consistency = 'excellent';
    if (stdDev > 15) consistency = 'poor';
    else if (stdDev > 10) consistency = 'fair';
    else if (stdDev > 5) consistency = 'good';

    let pattern = 'on-time';
    if (avgDelay > 10) pattern = 'consistently-late';
    else if (avgDelay < -10) pattern = 'consistently-early';

    return { pattern, avgDelay, consistency, stdDev: Math.round(stdDev) };
  };

  // Generate smart recommendations
  const getSmartRecommendations = () => {
    const recommendations = [];

    medications.forEach(med => {
      const analysis = analyzeAdherencePattern(med.name);
      const smartTime = calculateSmartReminderTime(med.name);
      const scheduledTime = med.time[0];

      if (analysis.pattern === 'consistently-late' && analysis.avgDelay > 15) {
        recommendations.push({
          medication: med.name,
          type: 'timing-adjustment',
          priority: 'high',
          message: `You typically take ${med.name} ${analysis.avgDelay} minutes late. Consider setting reminder for ${smartTime} instead of ${scheduledTime}.`,
          suggestedTime: smartTime,
          confidence: 85
        });
      }

      if (analysis.consistency === 'poor') {
        recommendations.push({
          medication: med.name,
          type: 'consistency-alert',
          priority: 'medium',
          message: `Your ${med.name} timing varies by ±${analysis.stdDev} minutes. Try setting multiple reminders to improve consistency.`,
          suggestedAction: 'Enable snooze reminders every 5 minutes',
          confidence: 78
        });
      }

      if (med.status === 'low-stock') {
        const daysLeft = med.frequency === 'Once Daily' ? med.stock : med.stock / 2;
        recommendations.push({
          medication: med.name,
          type: 'refill-alert',
          priority: 'high',
          message: `Only ${daysLeft} days of ${med.name} remaining. Order refill soon.`,
          suggestedAction: `Contact ${med.prescribedBy} before ${med.refillDate}`,
          confidence: 100
        });
      }
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const smartRecommendations = getSmartRecommendations();

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
    // Validation
    if (!newMedication.name.trim()) {
      toast.error('💊 Medication name is required!');
      return;
    }

    if (!newMedication.dosage.trim()) {
      toast.error('💊 Dosage is required!');
      return;
    }

    if (!newMedication.time.trim()) {
      toast.error('⏰ Time schedule is required!');
      return;
    }

    if (!newMedication.stock || parseInt(newMedication.stock) <= 0) {
      toast.error('📦 Stock quantity must be greater than 0!');
      return;
    }

    if (!newMedication.prescribedBy.trim()) {
      toast.error('👨‍⚕️ Prescribing doctor is required!');
      return;
    }

    if (!newMedication.condition.trim()) {
      toast.error('🩺 Medical condition is required!');
      return;
    }

    // Create medication
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
    
    // Reset form
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

    toast.success(`✅ ${medication.name} added successfully!`, {
      icon: '💊',
      style: {
        border: '2px solid #00ff00',
        boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
      }
    });
  };

  const calculateRefillDate = (stock, frequency) => {
    const daysPerPill = frequency === 'Once Daily' ? 1 : frequency === 'Twice Daily' ? 0.5 : 0.33;
    const daysLeft = stock * daysPerPill;
    const refillDate = new Date();
    refillDate.setDate(refillDate.getDate() + daysLeft);
    return refillDate.toISOString().split('T')[0];
  };

  const handleMarkTaken = (medId) => {
    const medication = medications.find(med => med.id === medId);
    if (!medication) return;

    if (medication.stock <= 0) {
      toast.error('⚠️ No stock available! Please refill medication.', {
        icon: '📦',
      });
      return;
    }

    setMedications(medications.map(med => 
      med.id === medId 
        ? { ...med, lastTaken: new Date().toISOString().slice(0, 16).replace('T', ' '), stock: med.stock - 1 }
        : med
    ));

    toast.success(`✅ ${medication.name} marked as taken!`, {
      icon: '💊',
      duration: 2000,
    });

    // Check for low stock warning
    const newStock = medication.stock - 1;
    if (newStock <= 10 && newStock > 0) {
      setTimeout(() => {
        toast.warning(`⚠️ Low stock alert for ${medication.name}! Only ${newStock} left.`, {
          duration: 3000,
          icon: '📦',
        });
      }, 500);
    }
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
                    
                    {/* Dose tracking and snooze controls */}
                    <div className="capsule-controls">
                      {(() => {
                        const isSnoozed = snoozedCapsules[med.id];
                        const takenDoses = capsuleDoses[med.id] || [];
                        
                        return (
                          <>
                            {/* Dose tracking buttons for multiple daily doses */}
                            {med.timesPerDay >= 2 && !isSnoozed && !allDosesTaken(med.id, med.timesPerDay) && (
                              <div className="dose-buttons">
                                {Array.from({length: med.timesPerDay}, (_, i) => i + 1).map(doseNum => (
                                  <button
                                    key={doseNum}
                                    className={`dose-btn ${takenDoses.includes(doseNum) ? 'taken' : ''}`}
                                    onClick={() => handleTakeDose(med.id, doseNum)}
                                    disabled={takenDoses.includes(doseNum)}
                                    style={!takenDoses.includes(doseNum) ? { borderColor: currentColor, color: currentColor } : {}}
                                  >
                                    <Icon name={takenDoses.includes(doseNum) ? "check" : "pill"} size={14} />
                                    Dose {doseNum}
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {/* Single dose button for once-daily medications */}
                            {med.timesPerDay === 1 && !isSnoozed && !allDosesTaken(med.id, med.timesPerDay) && (
                              <button 
                                className="mark-taken-btn"
                                onClick={() => handleTakeDose(med.id, 1)}
                                style={{ background: currentColor }}
                              >
                                <Icon name="check" size={16} />
                                Mark as Taken
                              </button>
                            )}
                            
                            {/* Snooze button */}
                            {!allDosesTaken(med.id, med.timesPerDay) && (
                              <button 
                                className="snooze-btn"
                                onClick={() => handleSnoozeCapsule(med.id)}
                                disabled={isSnoozed}
                                style={!isSnoozed ? { borderColor: '#ffaa00', color: '#ffaa00' } : {}}
                              >
                                <Icon name="bell" size={14} color={isSnoozed ? '#999' : '#ffaa00'} />
                                {isSnoozed ? 'Snoozed (10min)' : 'Snooze'}
                              </button>
                            )}
                            
                            {/* Completed indicator */}
                            {allDosesTaken(med.id, med.timesPerDay) && (
                              <div className="all-doses-taken">
                                <Icon name="check" size={20} color="#00d26a" />
                                <span>All doses taken today!</span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
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

              {/* Smart Recommendations Section */}
              {smartRecommendations.length > 0 && (
                <div className="smart-recommendations">
                  <div className="recommendations-header">
                    <h3>🤖 AI-Powered Smart Insights</h3>
                    <p>Personalized recommendations based on your medication patterns</p>
                  </div>
                  <div className="recommendations-list">
                    {smartRecommendations.map((rec, idx) => (
                      <div key={idx} className={`recommendation-card priority-${rec.priority}`}>
                        <div className="rec-header">
                          <div className="rec-type">
                            {rec.type === 'timing-adjustment' && '⏰'}
                            {rec.type === 'consistency-alert' && '📊'}
                            {rec.type === 'refill-alert' && '💊'}
                            <span className="rec-label">
                              {rec.type.replace(/-/g, ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className={`rec-priority ${rec.priority}`}>
                            {rec.priority.toUpperCase()}
                          </div>
                        </div>
                        <div className="rec-content">
                          <h4>{rec.medication}</h4>
                          <p className="rec-message">{rec.message}</p>
                          {rec.suggestedTime && (
                            <div className="rec-suggestion">
                              <strong>Suggested Time:</strong> {rec.suggestedTime}
                            </div>
                          )}
                          {rec.suggestedAction && (
                            <div className="rec-suggestion">
                              <strong>Suggested Action:</strong> {rec.suggestedAction}
                            </div>
                          )}
                        </div>
                        <div className="rec-footer">
                          <div className="confidence-indicator">
                            <span className="confidence-label">AI Confidence:</span>
                            <div className="confidence-bar">
                              <div 
                                className="confidence-fill" 
                                style={{ 
                                  width: `${rec.confidence}%`,
                                  background: currentColor
                                }}
                              ></div>
                            </div>
                            <span className="confidence-value">{rec.confidence}%</span>
                          </div>
                          <button 
                            className="apply-recommendation-btn"
                            style={{ borderColor: currentColor, color: currentColor }}
                          >
                            Apply Suggestion
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Adherence Analytics */}
                  <div className="adherence-analytics">
                    <h3>📈 Your Medication Patterns</h3>
                    <div className="analytics-grid">
                      {medications.map(med => {
                        const analysis = analyzeAdherencePattern(med.name);
                        return (
                          <div key={med.id} className="analytics-card">
                            <h4>{med.name}</h4>
                            <div className="analytics-stats">
                              <div className="stat">
                                <span className="stat-label">Pattern:</span>
                                <span className={`stat-value pattern-${analysis.pattern}`}>
                                  {analysis.pattern.replace(/-/g, ' ')}
                                </span>
                              </div>
                              <div className="stat">
                                <span className="stat-label">Avg Delay:</span>
                                <span className="stat-value">
                                  {analysis.avgDelay > 0 ? '+' : ''}{analysis.avgDelay} min
                                </span>
                              </div>
                              <div className="stat">
                                <span className="stat-label">Consistency:</span>
                                <span className={`stat-value consistency-${analysis.consistency}`}>
                                  {analysis.consistency}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
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

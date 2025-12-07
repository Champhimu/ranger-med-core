/**
 * Symptoms Page - MorphSync Med-Station
 * Operation Overdrive Medical Tracking System
 * Features: Log New Symptom, View History, Track Progress
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import './Symptoms.css';
import {
  fetchSymptomsThunk,
  addSymptomThunk,
  updateSymptomThunk,
  deleteSymptomThunk,
  fetchProgressThunk
} from '../store/symptomSlice';

function Symptoms({ selectedRanger = 'red' }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('log'); // 'log', 'history', 'progress'
  const [showLogForm, setShowLogForm] = useState(false);
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  // const dispatch = useDispatch();
  //  const { list: symptomHistory, progress: symptomProgress, loading, error } = useSelector(state => state.symptoms);

  const dispatch = useDispatch();

  const { symptoms: symptomHistory, progress: symptomProgress, loading, error } = useSelector(
    (state) => state.symptoms
  );

  const rangerColors = {
    red: '#FF0000',
    blue: '#0066FF',
    yellow: '#FFD700',
    black: '#000000',
    pink: '#FF69B4',
    mercury: '#C0C0C0'
  };

  const currentColor = rangerColors[selectedRanger] || rangerColors.red;

  // Form state
  const [newSymptom, setNewSymptom] = useState({
    symptomName: '',
    severity: 'mild',
    bodyPart: '',
    description: '',
    duration: '',
    triggers: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5)
  });

  useEffect(() => {
    let filtered = symptomHistory || [];

    if (severityFilter !== "All") {
      filtered = filtered.filter(
        (s) => s.severity.toLowerCase() === severityFilter.toLowerCase()
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (s) => s.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredSymptoms(filtered);
  }, [symptomHistory, severityFilter, statusFilter]);

  useEffect(() => {
    console.log("This is running...")
    dispatch(fetchSymptomsThunk());
    dispatch(fetchProgressThunk());
  }, [dispatch]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

  // Mock symptom history data
  // const symptomHistory = [
  //   {
  //     id: 1,
  //     symptom: 'Headache',
  //     severity: 'moderate',
  //     bodyPart: 'Head',
  //     description: 'Throbbing pain in temples, started after mission',
  //     duration: '2 hours',
  //     triggers: 'Loud explosions during battle',
  //     date: '2025-12-04',
  //     time: '14:30',
  //     status: 'active'
  //   },
  //   {
  //     id: 2,
  //     symptom: 'Muscle Soreness',
  //     severity: 'mild',
  //     bodyPart: 'Legs',
  //     description: 'General soreness in quadriceps and calves',
  //     duration: '1 day',
  //     triggers: 'Intense training session',
  //     date: '2025-12-03',
  //     time: '09:15',
  //     status: 'resolved'
  //   },
  //   {
  //     id: 3,
  //     symptom: 'Fatigue',
  //     severity: 'moderate',
  //     bodyPart: 'General',
  //     description: 'Overall tiredness and low energy levels',
  //     duration: '3 days',
  //     triggers: 'Multiple missions, lack of sleep',
  //     date: '2025-12-02',
  //     time: '18:45',
  //     status: 'active'
  //   },
  //   {
  //     id: 4,
  //     symptom: 'Joint Pain',
  //     severity: 'severe',
  //     bodyPart: 'Knees',
  //     description: 'Sharp pain when bending knees',
  //     duration: '4 hours',
  //     triggers: 'High-impact landing from Zord',
  //     date: '2025-12-01',
  //     time: '16:20',
  //     status: 'resolved'
  //   },
  //   {
  //     id: 5,
  //     symptom: 'Dizziness',
  //     severity: 'mild',
  //     bodyPart: 'Head',
  //     description: 'Slight vertigo when standing up quickly',
  //     duration: '30 minutes',
  //     triggers: 'Rapid morphing sequence',
  //     date: '2025-11-30',
  //     time: '11:00',
  //     status: 'resolved'
  //   },
  //   {
  //     id: 6,
  //     symptom: 'Nausea',
  //     severity: 'moderate',
  //     bodyPart: 'Stomach',
  //     description: 'Feeling of sickness after teleportation',
  //     duration: '1 hour',
  //     triggers: 'Multiple rapid teleports',
  //     date: '2025-11-29',
  //     time: '15:30',
  //     status: 'resolved'
  //   }
  // ];

  // Symptom progress tracking data
  // const symptomProgress = {
  //   'Headache': [
  //     { date: '2025-11-25', severity: 'mild', count: 1 },
  //     { date: '2025-11-28', severity: 'moderate', count: 1 },
  //     { date: '2025-12-01', severity: 'mild', count: 1 },
  //     { date: '2025-12-04', severity: 'moderate', count: 1 }
  //   ],
  //   'Fatigue': [
  //     { date: '2025-11-26', severity: 'mild', count: 1 },
  //     { date: '2025-11-29', severity: 'moderate', count: 1 },
  //     { date: '2025-12-02', severity: 'moderate', count: 1 }
  //   ],
  //   'Muscle Soreness': [
  //     { date: '2025-11-27', severity: 'mild', count: 2 },
  //     { date: '2025-11-30', severity: 'moderate', count: 1 },
  //     { date: '2025-12-03', severity: 'mild', count: 1 }
  //   ]
  // };

  const symptomOptions = [
    { emoji: "😫", name: "Headache" },
    { emoji: "😴", name: "Fatigue" },
    { emoji: "💪", name: "Muscle Pain" },
    { emoji: "🤢", name: "Nausea" },
    { emoji: "😵", name: "Dizziness" },
    { emoji: "🦴", name: "Joint Pain" },
  ];


  // Statistics
  const stats = {
    totalSymptoms: symptomHistory?.length,
    activeSymptoms: symptomHistory?.filter(s => s.status === 'active').length,
    resolvedSymptoms: symptomHistory?.filter(s => s.status === 'resolved').length,
    mostCommon: 'Headache',
    avgSeverity: 'Moderate'
  };

  const getSeverityColor = (severity) => {
    const colors = {
      mild: '#00ff00',
      moderate: '#ffcc00',
      severe: '#ff0000'
    };
    return colors[severity] || '#00ffff';
  };

  const getSeverityLevel = (severity) => {
    const levels = { mild: 1, moderate: 2, severe: 3 };
    return levels[severity] || 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSymptom(p => ({ ...p, [name]: value }));
  };

  const handleSubmitSymptom = (e) => {
    e.preventDefault();

    // Validation
    if (!newSymptom.symptomName.trim()) return toast.error("Symptom name required");
    if (!newSymptom.bodyPart.trim()) return toast.error("Body part required");
    if (!newSymptom.description.trim()) return toast.error("Description required");
    if (!newSymptom.duration.trim()) return toast.error('Duration is required!');

    console.log('New symptom logged:', newSymptom);
    // Here you would send to API
    dispatch(addSymptomThunk(newSymptom))
      .unwrap()
      .then(() => {
        toast.success(`Symptom "${newSymptom.symptomName}" logged successfully!`, {
          duration: 3000,
          style: {
            border: '2px solid #00ff00',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
          }
        });
        setShowLogForm(false);
      })
      .catch(() => toast.error("Failed to submit"));

    setNewSymptom({
      symptomName: '',
      severity: 'mild',
      bodyPart: '',
      description: '',
      duration: '',
      triggers: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5)
    });
  };

  // DELETE HANDLER
  const handleDelete = (id) => {
    dispatch(deleteSymptomThunk(id));
    toast.success("Deleted symptom");
  };

  // UPDATE STATUS HANDLER
  const toggleStatus = (sym) => {
    dispatch(updateSymptomThunk({
      id: sym._id,
      updates: { status: sym.status === "active" ? "resolved" : "active" }
    }));
  };

  const renderLogSymptomTab = () => (
    <div className="symptoms-log-section">
      <div className="quick-log-actions">
        <button className="quick-log-btn" onClick={() => setShowLogForm(true)} style={{ borderColor: currentColor, color: currentColor }}>
          <span className="btn-icon">➕</span>
          <span className="btn-text" style={{ color: "white" }}>Log New Symptom</span>
        </button>

        <div className="common-symptoms">
          <h4>Quick Log Common Symptoms:</h4>
          <div className="symptom-chips-container">
            {symptomOptions.map((symptom) => (
              <button
                key={symptom.name}
                className="symptom-chip"
                onClick={() => {
                  setShowLogForm(true);
                  setNewSymptom((prev) => ({
                    ...prev,
                    symptomName: symptom.name,
                  }));
                }}
              >
                {symptom.emoji} {symptom.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showLogForm && (
        <div className="log-symptom-modal-overlay" onClick={() => setShowLogForm(false)}>
          <div className="log-symptom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔬 LOG NEW SYMPTOM</h2>
              <button className="close-modal-btn" onClick={() => setShowLogForm(false)}>✕</button>
            </div>

            <form className="symptom-log-form" onSubmit={handleSubmitSymptom}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="symptomName">Symptom Name *</label>
                  <input
                    type="text"
                    id="symptomName"
                    name="symptomName"
                    value={newSymptom.symptomName}
                    onChange={handleInputChange}
                    placeholder="e.g., Headache, Fatigue, Muscle Pain"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="severity">Severity Level *</label>
                  <select
                    id="severity"
                    name="severity"
                    value={newSymptom.severity}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="mild">🟢 Mild - Noticeable but manageable</option>
                    <option value="moderate">🟡 Moderate - Affecting daily activities</option>
                    <option value="severe">🔴 Severe - Requires immediate attention</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bodyPart">Body Part/Area</label>
                  <input
                    type="text"
                    id="bodyPart"
                    name="bodyPart"
                    value={newSymptom.bodyPart}
                    onChange={handleInputChange}
                    placeholder="e.g., Head, Legs, Chest"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duration</label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={newSymptom.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 hours, 1 day"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newSymptom.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Time</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={newSymptom.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newSymptom.description}
                  onChange={handleInputChange}
                  placeholder="Describe the symptom in detail..."
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group full-width">
                <label htmlFor="triggers">Possible Triggers</label>
                <textarea
                  id="triggers"
                  name="triggers"
                  value={newSymptom.triggers}
                  onChange={handleInputChange}
                  placeholder="What might have caused this? (e.g., mission, training, medication)"
                  rows="2"
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowLogForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" style={{ background: currentColor }}>
                  <span>🔬 Log Symptom</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="recent-symptoms-preview">
        <h3>Recently Logged Symptoms</h3>
        <div className="symptoms-preview-list">
          {symptomHistory?.length > 0 ? (
            symptomHistory.slice(0, 3).map((symptom) => (
              <div key={symptom._id} className="symptom-preview-card">
                <div className="symptom-preview-header">
                  <span className="symptom-name">{symptom.symptomName}</span>
                  <span
                    className="symptom-severity-badge"
                    style={{
                      backgroundColor: getSeverityColor(symptom.severity) + "20",
                      color: getSeverityColor(symptom.severity),
                      border: `1px solid ${getSeverityColor(symptom.severity)}`
                    }}
                  >
                    {symptom.severity.toUpperCase()}
                  </span>
                </div>

                <div className="symptom-preview-body">
                  <span className="symptom-date">
                    📅 {symptom.date} at {symptom.time}
                  </span>
                  <span className="symptom-body-part">📍 {symptom.bodyPart}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-symptoms">No recent symptoms added.</p>
          )}

        </div>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="symptoms-history-section">
      <div className="history-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalSymptoms}</span>
            <span className="stat-label">Total Logged</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <span className="stat-value">{stats.activeSymptoms}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-value">{stats.resolvedSymptoms}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <span className="stat-value">{stats.mostCommon}</span>
            <span className="stat-label">Most Common</span>
          </div>
        </div>
      </div>

      <div className="history-filters">
        <div className="filter-group">
          <label>Filter by Severity:</label>
          <div className="filter-buttons">
            {["All", "Mild", "Moderate", "Severe"].map((level) => (
              <button
                key={level}
                className={`filter-btn ${severityFilter === level ? "active" : ""}`}
                onClick={() => setSeverityFilter(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label>Filter by Status:</label>
          <div className="filter-buttons">
            {["All", "Active", "Resolved"].map((status) => (
              <button
                key={status}
                className={`filter-btn ${statusFilter === status ? "active" : ""}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="symptoms-history-list">
        {filteredSymptoms && filteredSymptoms?.length > 0 ? (
          filteredSymptoms.map((symptom) => (
            <div key={symptom._id} className="symptom-history-card">
              <div className="symptom-card-header">
                <div className="symptom-title-section">
                  <h4 className="symptom-title">{symptom.symptom}</h4>
                  <div className="symptom-badges">
                    <span
                      className="severity-badge"
                      style={{
                        backgroundColor: getSeverityColor(symptom.severity) + "20",
                        color: getSeverityColor(symptom.severity),
                        border: `1px solid ${getSeverityColor(symptom.severity)}`
                      }}
                    >
                      {symptom.severity.toUpperCase()}
                    </span>
                    <span
                      className={`status-badge status-${symptom.status}`}
                      style={{ marginTop: "0px" }}
                    >
                      {symptom.status === "active" ? "⚠️ ACTIVE" : "✅ RESOLVED"}
                    </span>
                  </div>
                </div>
                <div className="symptom-severity-bar">
                  <div
                    className="severity-fill"
                    style={{
                      width: `${(getSeverityLevel(symptom.severity) / 3) * 100}%`,
                      backgroundColor: getSeverityColor(symptom.severity)
                    }}
                  ></div>
                </div>
              </div>

              <div className="symptom-card-body">
                <div className="symptom-info-row">
                  <div className="info-item">
                    <span className="info-icon">📅</span>
                    <span className="info-text">
                      {symptom.date} at {symptom.time}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <span className="info-text">{symptom.bodyPart}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">⏱️</span>
                    <span className="info-text">{symptom.duration}</span>
                  </div>
                </div>

                <div className="symptom-description">
                  <strong>Description:</strong>
                  <p>{symptom.description}</p>
                </div>

                {symptom.triggers && (
                  <div className="symptom-triggers">
                    <strong>Possible Triggers:</strong>
                    <p>{symptom.triggers}</p>
                  </div>
                )}
              </div>

              <div className="symptom-card-actions">
                <button
                  className="action-btn-small"
                  onClick={() => toggleStatus(symptom)}
                >
                  {symptom.status === "active" ? "Mark Resolved" : "Mark Active"}
                </button>
                <button
                  className="action-btn-small"
                  onClick={() => handleDelete(symptom._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data-message">
            No data found based on filter. Add a symptom to get started!
          </div>
        )}

      </div>
    </div>
  );

  const renderProgressTab = () => (
    <div className="symptoms-progress-section">
      <div className="progress-header">
        <h3>📈 Symptom Progress Tracking</h3>
        <p>Monitor how your symptoms change over time</p>
      </div>

      {Object.keys(symptomProgress).length > 0 ? (
        Object.entries(symptomProgress).map(([symptomName, records]) => (
          <div key={symptomName} className="progress-chart-container">
            <div className="progress-chart-header">
              <h4>{symptomName}</h4>
              <span className="occurrence-count">{records.length} occurrences</span>
            </div>

            <div className="progress-timeline">
              {records.map((record, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-date">{record.date}</div>
                  <div
                    className="timeline-marker"
                    style={{ backgroundColor: getSeverityColor(record.severity) }}
                  ></div>
                  <div className="timeline-content">
                    <span
                      className="timeline-severity"
                      style={{ color: getSeverityColor(record.severity) }}
                    >
                      {record.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="progress-chart">
              <div className="chart-bars">
                {records.map((record, index) => (
                  <div key={index} className="chart-bar-wrapper">
                    <div
                      className="chart-bar"
                      style={{
                        height: `${(getSeverityLevel(record.severity) / 3) * 100}%`,
                        backgroundColor: getSeverityColor(record.severity),
                      }}
                    ></div>
                    <div className="chart-label">{record.date.split("-")[2]}</div>
                  </div>
                ))}
              </div>
              <div className="chart-y-axis">
                <span>Severe</span>
                <span>Moderate</span>
                <span>Mild</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-data-message">
          No data, add symptoms to start tracking
        </div>
      )}


      <div className="progress-insights">
        <h4>📊 Insights & Recommendations</h4>
        <div className="insights-list">
          <div className="insight-item">
            <span className="insight-icon">⬆️</span>
            <p>Headache frequency has increased by 25% in the past week. Consider consulting Dr. Hartford.</p>
          </div>
          <div className="insight-item">
            <span className="insight-icon">⬇️</span>
            <p>Muscle Soreness severity is decreasing. Your recovery protocol is working well!</p>
          </div>
          <div className="insight-item">
            <span className="insight-icon">💡</span>
            <p>Most symptoms occur after 2 PM. Try scheduling rest periods during this time.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="symptoms-page" data-ranger={selectedRanger}>
      {/* Background Elements */}
      <div className="space-background"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Header */}
      <div className="symptoms-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <div className="header-content">
          <h1>🔬 SYMPTOM TRACKER</h1>
          <p>OPERATION OVERDRIVE - MEDICAL MONITORING SYSTEM</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="symptoms-tabs">
        <button
          className={`tab-btn ${activeTab === 'log' ? 'active' : ''}`}
          onClick={() => setActiveTab('log')}
          style={activeTab === 'log' ? { borderBottomColor: currentColor, color: currentColor } : {}}
        >
          <span className="tab-icon">➕</span>
          <span className="tab-text">Log Symptom</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          style={activeTab === 'history' ? { borderBottomColor: currentColor, color: currentColor } : {}}
        >
          <span className="tab-icon">📋</span>
          <span className="tab-text">Symptom History</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
          style={activeTab === 'progress' ? { borderBottomColor: currentColor, color: currentColor } : {}}
        >
          <span className="tab-icon">📈</span>
          <span className="tab-text">Track Progress</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="symptoms-content">
        {activeTab === 'log' && renderLogSymptomTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'progress' && renderProgressTab()}
      </div>
    </div>
  );
}

export default Symptoms;

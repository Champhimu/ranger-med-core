/**
 * Medical Report - PDF Generator Page
 * Provides data preview, section toggles, and PDF download
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Icon from '../shared/Icon';
import { fetchCapsulesThunk } from '../../store/capsulesSlice';
import { fetchSymptomsThunk } from '../../store/symptomSlice';
import { fetchAppointmentsThunk } from '../../store/appointmentsSlice';
import { generateReport } from '../../api/report';
import './MedicalReport.css';

function MedicalReport({ selectedRanger = 'red' }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { capsules } = useSelector((state) => state.capsules);
  const { symptoms } = useSelector((state) => state.symptoms);
  const { upcoming: upcomingAppointments, past: pastAppointments } = useSelector((state) => state.appointments);

  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState({
    medications: true,
    adherence: true,
    symptoms: true,
    appointments: true,
    insights: true,
  });

  const rangerColors = {
    red: '#FF0000',
    blue: '#0066FF',
    yellow: '#FFD700',
    pink: '#FF69B4',
    black: '#ffffff',
    mercury: '#C0C0C0',
  };

  const currentColor = rangerColors[selectedRanger] || rangerColors.red;

  useEffect(() => {
    dispatch(fetchCapsulesThunk());
    dispatch(fetchSymptomsThunk());
    dispatch(fetchAppointmentsThunk());
  }, [dispatch]);

  const allAppointments = [...(upcomingAppointments || []), ...(pastAppointments || [])];

  // Compute dose stats from capsules' todaysDoses
  const allDoses = capsules?.flatMap((c) => c.todaysDoses || []) || [];
  const totalDoses = allDoses.length;
  const takenDoses = allDoses.filter((d) => d.status === 'taken').length;
  const missedDoses = allDoses.filter((d) => d.status === 'missed').length;
  const adherenceRate = totalDoses > 0 ? ((takenDoses / totalDoses) * 100).toFixed(1) : 'N/A';

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const response = await generateReport();
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Medical_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Medical report downloaded!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const sectionConfig = [
    { key: 'medications', label: 'MEDICATIONS', icon: 'pill' },
    { key: 'adherence', label: 'ADHERENCE', icon: 'chart' },
    { key: 'symptoms', label: 'SYMPTOMS', icon: 'activity' },
    { key: 'appointments', label: 'APPOINTMENTS', icon: 'calendar' },
    { key: 'insights', label: 'INSIGHTS', icon: 'lightbulb' },
  ];

  return (
    <div className="report-page" data-ranger={selectedRanger}>
      {/* Background */}
      <div className="space-background"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="report-loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">GENERATING REPORT...</div>
        </div>
      )}

      {/* Header */}
      <div className="report-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <Icon name="arrowLeft" size={16} /> DASHBOARD
        </button>
        <div className="header-content">
          <h1>MEDICAL REPORT</h1>
          <p>COMPREHENSIVE HEALTH DATA EXPORT - OPERATION OVERDRIVE</p>
        </div>
        <button
          className={`download-btn ${isGenerating ? 'generating' : ''}`}
          onClick={handleDownload}
          disabled={isGenerating}
          style={{ borderColor: currentColor, color: currentColor }}
        >
          <Icon name="fileText" size={18} color={currentColor} />
          {isGenerating ? 'GENERATING...' : 'DOWNLOAD PDF'}
        </button>
      </div>

      <div className="report-container">
        {/* Report Info Bar */}
        <div className="report-info-bar">
          <div className="report-meta">
            <div className="report-meta-item">
              <span className="meta-label">Report Date</span>
              <span className="meta-value">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="report-meta-item">
              <span className="meta-label">Data Sections</span>
              <span className="meta-value">{Object.values(sections).filter(Boolean).length} / {Object.keys(sections).length}</span>
            </div>
            <div className="report-meta-item">
              <span className="meta-label">Total Records</span>
              <span className="meta-value">{(capsules?.length || 0) + (symptoms?.length || 0) + allAppointments.length}</span>
            </div>
          </div>
          <div className="report-badge">
            <Icon name="shield" size={14} color="#00ced1" />
            ENCRYPTED EXPORT
          </div>
        </div>

        {/* Section Toggles */}
        <div className="section-toggles">
          {sectionConfig.map((sec) => (
            <div
              key={sec.key}
              className={`toggle-chip ${sections[sec.key] ? 'active' : ''}`}
              onClick={() => toggleSection(sec.key)}
            >
              <span className="toggle-indicator"></span>
              <Icon name={sec.icon} size={14} color={sections[sec.key] ? '#00ffff' : 'rgba(255,255,255,0.4)'} />
              {sec.label}
            </div>
          ))}
        </div>

        {/* Preview Sections */}
        <div className="report-preview">

          {/* Medications */}
          {sections.medications && (
            <div className="preview-section">
              <div className="section-title-bar">
                <div className="section-icon">
                  <Icon name="pill" size={20} color="#00ced1" />
                </div>
                <h3>CURRENT MEDICATIONS</h3>
                <span className="section-count">{capsules?.length || 0}</span>
              </div>
              <div className="section-body">
                {capsules && capsules.length > 0 ? (
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Medication</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Time Slots</th>
                        <th>Condition</th>
                        <th>Start Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {capsules.map((cap) => (
                        <tr key={cap._id}>
                          <td>{cap.name || '--'}</td>
                          <td>{cap.doseAmount && cap.doseUnit ? `${cap.doseAmount} ${cap.doseUnit}` : cap.dosage || '--'}</td>
                          <td>{cap.frequency || '--'}</td>
                          <td>{cap.timeSlots?.join(', ') || '--'}</td>
                          <td>{cap.condition || '--'}</td>
                          <td>{formatDate(cap.startDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-section">
                    <div className="empty-icon"><Icon name="pill" size={36} color="rgba(255,255,255,0.2)" /></div>
                    <p>No medications recorded</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dose Adherence */}
          {sections.adherence && (
            <div className="preview-section">
              <div className="section-title-bar">
                <div className="section-icon">
                  <Icon name="chart" size={20} color="#00ced1" />
                </div>
                <h3>DOSE ADHERENCE</h3>
                <span className="section-count">Today</span>
              </div>
              <div className="section-body">
                <div className="stats-grid">
                  <div className="stat-tile">
                    <div className="stat-number">{totalDoses}</div>
                    <div className="stat-label">Total Doses</div>
                    <div className="stat-sublabel">scheduled</div>
                  </div>
                  <div className="stat-tile">
                    <div className="stat-number" style={{ color: '#10b981' }}>{takenDoses}</div>
                    <div className="stat-label">Taken</div>
                    <div className="stat-sublabel">on time</div>
                  </div>
                  <div className="stat-tile">
                    <div className="stat-number" style={{ color: '#ef4444' }}>{missedDoses}</div>
                    <div className="stat-label">Missed</div>
                    <div className="stat-sublabel">skipped</div>
                  </div>
                  <div className="stat-tile">
                    <div className="stat-number" style={{ color: currentColor }}>{adherenceRate}{adherenceRate !== 'N/A' ? '%' : ''}</div>
                    <div className="stat-label">Adherence</div>
                    <div className="stat-sublabel">rate</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Symptoms */}
          {sections.symptoms && (
            <div className="preview-section">
              <div className="section-title-bar">
                <div className="section-icon">
                  <Icon name="activity" size={20} color="#00ced1" />
                </div>
                <h3>SYMPTOM LOG</h3>
                <span className="section-count">{symptoms?.length || 0}</span>
              </div>
              <div className="section-body">
                {symptoms && symptoms.length > 0 ? (
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Symptom</th>
                        <th>Severity</th>
                        <th>Body Part</th>
                        <th>Duration</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {symptoms.map((sym) => (
                        <tr key={sym._id}>
                          <td>{sym.symptomName || '--'}</td>
                          <td><span className={`severity-pill ${sym.severity}`}>{(sym.severity || '--').toUpperCase()}</span></td>
                          <td>{sym.bodyPart || '--'}</td>
                          <td>{sym.duration || '--'}</td>
                          <td>{sym.date ? `${sym.date} ${sym.time || ''}`.trim() : '--'}</td>
                          <td><span className={`status-pill ${sym.status}`}>{(sym.status || 'active').toUpperCase()}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-section">
                    <div className="empty-icon"><Icon name="activity" size={36} color="rgba(255,255,255,0.2)" /></div>
                    <p>No symptoms recorded</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appointments */}
          {sections.appointments && (
            <div className="preview-section">
              <div className="section-title-bar">
                <div className="section-icon">
                  <Icon name="calendar" size={20} color="#00ced1" />
                </div>
                <h3>APPOINTMENTS</h3>
                <span className="section-count">{allAppointments.length}</span>
              </div>
              <div className="section-body">
                {allAppointments.length > 0 ? (
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAppointments.map((appt) => (
                        <tr key={appt._id}>
                          <td>{appt.type || '--'}</td>
                          <td>{appt.doctor?.name || '--'}</td>
                          <td>{formatDate(appt.date)}</td>
                          <td>{appt.time || '--'}</td>
                          <td>{appt.reason || '--'}</td>
                          <td><span className={`status-pill ${appt.status}`}>{(appt.status || 'pending').toUpperCase()}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-section">
                    <div className="empty-icon"><Icon name="calendar" size={36} color="rgba(255,255,255,0.2)" /></div>
                    <p>No appointments recorded</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Weekly Insights placeholder */}
          {sections.insights && (
            <div className="preview-section">
              <div className="section-title-bar">
                <div className="section-icon">
                  <Icon name="lightbulb" size={20} color="#00ced1" />
                </div>
                <h3>WEEKLY HEALTH INSIGHTS</h3>
                <span className="section-count">AI</span>
              </div>
              <div className="section-body">
                <div className="insight-summary-card">
                  <div className="insight-label">AI-Generated Summary</div>
                  <div className="insight-text">
                    The downloaded PDF report will include your latest weekly health insight summary, health scores
                    (overall, medication, symptoms), adherence metrics, and AI-generated recommendations from the
                    Zordon Medical AI system.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default MedicalReport;

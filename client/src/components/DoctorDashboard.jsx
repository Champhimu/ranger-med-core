/**
 * Doctor Dashboard - Complete Medical Professional Interface
 * All 10 Features Implemented
 * Blue & Green Theme - Operation Overdrive Medical System
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  
  // Get doctor info from localStorage
  const doctorAuth = JSON.parse(localStorage.getItem('doctorAuth') || '{}');
  
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationMode, setConsultationMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock doctor data
  const doctorInfo = {
    name: 'Dr. Sarah Johnson',
    specialty: doctorAuth.specialty || 'General Medicine',
    license: doctorAuth.licenseNumber || 'MD-2024-5678',
    patients: 156,
    appointments: 24,
    avatar: '👩‍⚕️'
  };

  // Mock data
  const [todayAppointments, setTodayAppointments] = useState([
    { id: 1, patient: 'Mack Hartford', patientId: 1, time: '09:00 AM', type: 'Check-up', status: 'confirmed', urgency: 'normal', duration: '30 min' },
    { id: 2, patient: 'Will Aston', patientId: 2, time: '10:30 AM', type: 'Follow-up', status: 'confirmed', urgency: 'normal', duration: '20 min' },
    { id: 3, patient: 'Dax Lo', patientId: 3, time: '11:00 AM', type: 'Emergency', status: 'pending', urgency: 'high', duration: '45 min' },
    { id: 4, patient: 'Rose Ortiz', patientId: 4, time: '02:00 PM', type: 'Consultation', status: 'confirmed', urgency: 'normal', duration: '30 min' },
    { id: 5, patient: 'Tyzonn', patientId: 5, time: '03:30 PM', type: 'Prescription', status: 'pending', urgency: 'low', duration: '15 min' }
  ]);

  const [patients] = useState([
    {
      id: 1,
      name: 'Mack Hartford',
      age: 28,
      gender: 'Male',
      lastVisit: '2025-12-01',
      condition: 'Morphin Grid Energy Imbalance',
      status: 'stable',
      medications: ['Morphinium-12', 'Neural-Sync Plus'],
      upcomingAppointment: '2025-12-05 09:00 AM',
      riskLevel: 'low',
      recentSymptoms: ['Headache', 'Fatigue'],
      vitals: { bp: '120/80', temp: '98.6°F', pulse: '72 bpm' },
      email: 'mack@overdrive.com',
      phone: '555-0101',
      emergencyContact: 'Andrew Hartford - 555-0100'
    },
    {
      id: 2,
      name: 'Will Aston',
      age: 26,
      gender: 'Male',
      lastVisit: '2025-11-28',
      condition: 'Post-Mission Recovery',
      status: 'improving',
      medications: ['Power Stabilizer-X'],
      upcomingAppointment: '2025-12-05 10:30 AM',
      riskLevel: 'low',
      recentSymptoms: ['Muscle soreness'],
      vitals: { bp: '118/78', temp: '98.4°F', pulse: '68 bpm' },
      email: 'will@overdrive.com',
      phone: '555-0102',
      emergencyContact: 'Spencer - 555-0103'
    },
    {
      id: 3,
      name: 'Dax Lo',
      age: 27,
      gender: 'Male',
      lastVisit: '2025-12-03',
      condition: 'Severe Headaches - Investigation',
      status: 'critical',
      medications: ['Morphinium-12', 'Pain Relief Plus'],
      upcomingAppointment: '2025-12-05 11:00 AM',
      riskLevel: 'high',
      recentSymptoms: ['Severe headache', 'Dizziness', 'Nausea'],
      vitals: { bp: '135/90', temp: '99.2°F', pulse: '85 bpm' },
      email: 'dax@overdrive.com',
      phone: '555-0104',
      emergencyContact: 'Miratrix - 555-0105'
    },
    {
      id: 4,
      name: 'Rose Ortiz',
      age: 25,
      gender: 'Female',
      lastVisit: '2025-11-25',
      condition: 'Routine Health Maintenance',
      status: 'stable',
      medications: ['Ranger Vitamins Complex'],
      upcomingAppointment: '2025-12-05 02:00 PM',
      riskLevel: 'low',
      recentSymptoms: [],
      vitals: { bp: '115/75', temp: '98.6°F', pulse: '70 bpm' },
      email: 'rose@overdrive.com',
      phone: '555-0106',
      emergencyContact: 'Mother - 555-0107'
    }
  ]);

  const [alerts] = useState([
    { id: 1, type: 'critical', patient: 'Dax Lo', message: 'Severe headache reported - BP elevated', time: '2 hours ago', patientId: 3 },
    { id: 2, type: 'warning', patient: 'Mack Hartford', message: 'Missed medication dose yesterday', time: '5 hours ago', patientId: 1 },
    { id: 3, type: 'info', patient: 'Will Aston', message: 'Lab results available for review', time: '1 day ago', patientId: 2 }
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review lab results for Will Aston', priority: 'high', dueDate: '2025-12-05', status: 'pending', category: 'lab-review' },
    { id: 2, title: 'Follow-up call to Mack Hartford', priority: 'medium', dueDate: '2025-12-06', status: 'pending', category: 'follow-up' },
    { id: 3, title: 'Referral to neurologist for Dax Lo', priority: 'high', dueDate: '2025-12-05', status: 'in-progress', category: 'referral' },
    { id: 4, title: 'Update treatment plan for Rose', priority: 'low', dueDate: '2025-12-08', status: 'pending', category: 'treatment' },
    { id: 5, title: 'Medication refill approval - Mack', priority: 'medium', dueDate: '2025-12-07', status: 'completed', category: 'medication' }
  ]);

  const [messages] = useState([
    { id: 1, from: 'Mack Hartford', subject: 'Question about medication', time: '1 hour ago', read: false, priority: 'normal' },
    { id: 2, from: 'Rose Ortiz', subject: 'Appointment reschedule', time: '3 hours ago', read: false, priority: 'high' },
    { id: 3, from: 'Admin', subject: 'Monthly report due', time: '1 day ago', read: true, priority: 'low' }
  ]);

  // AI Suggestions State
  const [aiSuggestions, setAiSuggestions] = useState({
    diagnosis: [],
    prescription: [],
    notes: '',
    riskFactors: []
  });

  // Prescription State
  const [prescription, setPrescription] = useState({
    medications: [],
    instructions: '',
    duration: '',
    followUp: ''
  });

  // Consultation State
  const [consultationNotes, setConsultationNotes] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  const [prescriptionHistory] = useState([
    { id: 1, date: '2025-11-28', patient: 'Mack Hartford', medications: ['Morphinium-12'], doctor: 'Dr. Johnson' },
    { id: 2, date: '2025-11-25', patient: 'Will Aston', medications: ['Power Stabilizer-X'], doctor: 'Dr. Johnson' },
    { id: 3, date: '2025-12-03', patient: 'Dax Lo', medications: ['Pain Relief Plus', 'Morphinium-12'], doctor: 'Dr. Johnson' }
  ]);

  // Analytics Data
  const [analyticsData] = useState({
    appointmentStats: {
      total: 156,
      completed: 142,
      cancelled: 8,
      noShow: 6
    },
    patientOutcomes: {
      improved: 78,
      stable: 65,
      deteriorated: 13
    },
    treatmentSuccess: 91.2,
    avgConsultationTime: 28,
    patientSatisfaction: 4.7
  });

  // Functions
  const handleLogout = () => {
    localStorage.removeItem('doctorAuth');
    navigate('/doctor/login');
  };

  const handleAIAnalysis = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    const suggestions = {
      diagnosis: [
        { condition: 'Morphin Grid Energy Imbalance', probability: 85, confidence: 'high', evidence: 'Patient history, vitals' },
        { condition: 'Stress-induced headache', probability: 65, confidence: 'medium', evidence: 'Symptom pattern' },
        { condition: 'Dehydration', probability: 45, confidence: 'low', evidence: 'Secondary symptoms' }
      ],
      prescription: patient.medications.map(med => ({
        name: med,
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '7 days'
      })),
      notes: `Patient ${patient.name} presents with ${patient.recentSymptoms.join(', ')}. Current medications appear effective. Consider stress management and hydration counseling.`,
      riskFactors: [
        { factor: 'High stress levels', risk: 'moderate', recommendation: 'Stress management counseling' },
        { factor: 'Irregular sleep pattern', risk: 'low', recommendation: 'Sleep hygiene education' }
      ]
    };

    setAiSuggestions(suggestions);
  };

  const handleGenerateSOAP = () => {
    const soap = {
      subjective: 'Patient reports moderate headaches and fatigue post-mission activities. Pain level 6/10.',
      objective: `Vitals: BP 120/80, Temp 98.6°F, Pulse 72 bpm. Alert and oriented. No acute distress observed. Neuro exam normal.`,
      assessment: 'Morphin Grid Energy Imbalance with associated symptoms. Stable condition with good treatment response.',
      plan: 'Continue current medication regimen. Follow-up in 1 week. Advise rest, hydration, and stress management. Monitor symptoms.'
    };
    setConsultationNotes(soap);
  };

  const handlePrescribe = (medication) => {
    setPrescription(prev => ({
      ...prev,
      medications: [...prev.medications, medication]
    }));
  };

  const handleApproveAppointment = (id) => {
    setTodayAppointments(prev =>
      prev.map(apt => apt.id === id ? { ...apt, status: 'confirmed' } : apt)
    );
  };

  const handleCancelAppointment = (id) => {
    setTodayAppointments(prev =>
      prev.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt)
    );
  };

  const handleStartConsultation = (patient) => {
    setSelectedPatient(patient);
    setConsultationMode(true);
    handleAIAnalysis(patient.id);
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(task => task.id === taskId ? { ...task, status: newStatus } : task)
    );
  };

  // Render Functions
  const renderDashboard = () => (
    <div className="doctor-main-content">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Icon name="calendar" size={24} color="#ff00ff" /></div>
          <div className="stat-info">
            <h3>Today's Appointments</h3>
            <div className="stat-value">{todayAppointments.length}</div>
            <p className="stat-detail">{todayAppointments.filter(a => a.status === 'pending').length} pending confirmation</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><Icon name="users" size={24} color="#ff00ff" /></div>
          <div className="stat-info">
            <h3>Total Patients</h3>
            <div className="stat-value">{doctorInfo.patients}</div>
            <p className="stat-detail">{tasks.filter(t => t.status === 'pending').length} pending tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><Icon name="alert" size={24} color="#ff00ff" /></div>
          <div className="stat-info">
            <h3>Critical Alerts</h3>
            <div className="stat-value">{alerts.filter(a => a.type === 'critical').length}</div>
            <p className="stat-detail">Requires immediate attention</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><Icon name="message" size={24} color="#ff00ff" /></div>
          <div className="stat-info">
            <h3>Messages</h3>
            <div className="stat-value">{messages.filter(m => !m.read).length}</div>
            <p className="stat-detail">Unread messages</p>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Today's Appointments */}
        <div className="dashboard-section">
          <h2><Icon name="calendar" size={20} color="#ff00ff" /> Today's Schedule</h2>
          <div className="appointments-list">
            {todayAppointments.map(apt => (
              <div key={apt.id} className={`appointment-card ${apt.urgency}`}>
                <div className="apt-time">{apt.time}</div>
                <div className="apt-details">
                  <h4>{apt.patient}</h4>
                  <p>{apt.type} • {apt.duration}</p>
                  <span className={`status-badge ${apt.status}`}>{apt.status}</span>
                </div>
                <button className="apt-action-btn" onClick={() => handleStartConsultation(patients.find(p => p.id === apt.patientId))}>
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="dashboard-section">
          <h2><Icon name="alert" size={20} color="#ff00ff" /> Alerts & Notifications</h2>
          <div className="alerts-list">
            {alerts.map(alert => (
              <div key={alert.id} className={`alert-card ${alert.type}`}>
                <div className="alert-icon">
                  {alert.type === 'critical' ? '🔴' : alert.type === 'warning' ? '🟡' : '🔵'}
                </div>
                <div className="alert-content">
                  <h4>{alert.patient}</h4>
                  <p>{alert.message}</p>
                  <span className="alert-time">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="dashboard-section">
          <h2><Icon name="check" size={20} color="#ff00ff" /> Pending Tasks</h2>
          <div className="tasks-preview">
            {tasks.filter(t => t.status !== 'completed').slice(0, 5).map(task => (
              <div key={task.id} className="task-item-preview">
                <span className={`task-priority ${task.priority}`}>{task.priority}</span>
                <span className="task-title">{task.title}</span>
                <span className="task-due">{task.dueDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="doctor-main-content">
      <div className="section-header">
        <h2><Icon name="users" size={20} color="#ff00ff" /> Patient Management</h2>
        <input type="text" className="search-input" placeholder="Search patients..." />
      </div>

      <div className="patients-grid">
        {patients.map(patient => (
          <div key={patient.id} className={`patient-card ${patient.riskLevel === 'high' ? 'risk-high' : ''}`}>
            <div className="patient-header">
              <div className="patient-avatar"><Icon name="users" size={24} color="#ff00ff" /></div>
              <div className="patient-basic">
                <h3>{patient.name}</h3>
                <p>{patient.age} years • {patient.gender}</p>
              </div>
              <span className={`risk-badge ${patient.riskLevel}`}>{patient.riskLevel} risk</span>
            </div>

            <div className="patient-vitals">
              <div className="vital">
                <span className="vital-label">BP</span>
                <span className="vital-value">{patient.vitals.bp}</span>
              </div>
              <div className="vital">
                <span className="vital-label">Temp</span>
                <span className="vital-value">{patient.vitals.temp}</span>
              </div>
              <div className="vital">
                <span className="vital-label">Pulse</span>
                <span className="vital-value">{patient.vitals.pulse}</span>
              </div>
            </div>

            <div className="patient-info">
              <p><strong>Condition:</strong> {patient.condition}</p>
              <p><strong>Status:</strong> <span className={`status-${patient.status}`}>{patient.status}</span></p>
              <p><strong>Last Visit:</strong> {patient.lastVisit}</p>
              <p><strong>Next:</strong> {patient.upcomingAppointment}</p>
            </div>

            <div className="patient-medications">
              <strong>Medications:</strong>
              <div className="med-list">
                {patient.medications.map((med, idx) => (
                  <span key={idx} className="med-tag">{med}</span>
                ))}
              </div>
            </div>

            <div className="patient-actions">
              <button className="action-btn view-btn">View History</button>
              <button className="action-btn consult-btn" onClick={() => handleStartConsultation(patient)}>
                Start Consultation
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="doctor-main-content">
      <div className="section-header">
        <h2><Icon name="calendar" size={20} color="#ff00ff" /> Appointment Management</h2>
        <input type="date" className="date-selector" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      <div className="appointments-manager">
        <div className="calendar-view">
          <h3>Weekly Schedule</h3>
          <div className="week-grid">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => (
              <div key={idx} className="day-column">
                <div className="day-header">{day}</div>
                <div className="time-slots">
                  {['09:00', '10:00', '11:00', '14:00', '15:00'].map((time, tIdx) => (
                    <div key={tIdx} className="time-slot">
                      {time}
                      {todayAppointments[idx]?.time.includes(time.split(':')[0]) && (
                        <div className="slot-appointment">
                          {todayAppointments[idx].patient}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="appointment-details">
          <h3>Appointment Requests</h3>
          {todayAppointments.filter(a => a.status === 'pending').map(apt => (
            <div key={apt.id} className="apt-request">
              <div className="apt-request-info">
                <h4>{apt.patient}</h4>
                <p>{apt.type} • {apt.time} • {apt.duration}</p>
              </div>
              <div className="apt-request-actions">
                <button className="approve-btn" onClick={() => handleApproveAppointment(apt.id)}>
                  <Icon name="check" size={16} color="#22c55e" /> Approve
                </button>
                <button className="cancel-btn" onClick={() => handleCancelAppointment(apt.id)}>
                  <Icon name="x" size={16} color="#ef4444" /> Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="doctor-main-content">
      <div className="section-header">
        <h2><Icon name="chart" size={20} color="#ff00ff" /> Reports & Analytics</h2>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Appointment Statistics</h3>
          <div className="stats-chart">
            <div className="stat-bar">
              <span>Completed</span>
              <div className="bar"><div className="bar-fill" style={{width: `${(analyticsData.appointmentStats.completed / analyticsData.appointmentStats.total) * 100}%`}}></div></div>
              <span>{analyticsData.appointmentStats.completed}</span>
            </div>
            <div className="stat-bar">
              <span>Cancelled</span>
              <div className="bar"><div className="bar-fill cancelled" style={{width: `${(analyticsData.appointmentStats.cancelled / analyticsData.appointmentStats.total) * 100}%`}}></div></div>
              <span>{analyticsData.appointmentStats.cancelled}</span>
            </div>
            <div className="stat-bar">
              <span>No Show</span>
              <div className="bar"><div className="bar-fill noshow" style={{width: `${(analyticsData.appointmentStats.noShow / analyticsData.appointmentStats.total) * 100}%`}}></div></div>
              <span>{analyticsData.appointmentStats.noShow}</span>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Patient Outcomes</h3>
          <div className="outcome-chart">
            <div className="outcome-item">
              <span className="outcome-label">Improved</span>
              <span className="outcome-value green">{analyticsData.patientOutcomes.improved}</span>
            </div>
            <div className="outcome-item">
              <span className="outcome-label">Stable</span>
              <span className="outcome-value blue">{analyticsData.patientOutcomes.stable}</span>
            </div>
            <div className="outcome-item">
              <span className="outcome-label">Deteriorated</span>
              <span className="outcome-value red">{analyticsData.patientOutcomes.deteriorated}</span>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Performance Metrics</h3>
          <div className="metrics-list">
            <div className="metric-item">
              <span>Treatment Success Rate</span>
              <span className="metric-value">{analyticsData.treatmentSuccess}%</span>
            </div>
            <div className="metric-item">
              <span>Avg Consultation Time</span>
              <span className="metric-value">{analyticsData.avgConsultationTime} min</span>
            </div>
            <div className="metric-item">
              <span>Patient Satisfaction</span>
              <span className="metric-value">{analyticsData.patientSatisfaction}/5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="doctor-main-content">
      <div className="section-header">
        <h2><Icon name="check" size={20} color="#ff00ff" /> Tasks & Reminders</h2>
        <button className="add-task-btn">+ New Task</button>
      </div>

      <div className="tasks-grid">
        {tasks.map(task => (
          <div key={task.id} className={`task-card ${task.priority}`}>
            <div className="task-header">
              <span className={`task-status ${task.status}`}>{task.status}</span>
              <span className={`task-priority-badge ${task.priority}`}>{task.priority}</span>
            </div>
            <h4>{task.title}</h4>
            <p className="task-category">Category: {task.category}</p>
            <p className="task-due-date">Due: {task.dueDate}</p>
            <div className="task-actions">
              {task.status !== 'completed' && (
                <>
                  <button onClick={() => handleTaskStatusChange(task.id, 'in-progress')}>Start</button>
                  <button onClick={() => handleTaskStatusChange(task.id, 'completed')}>Complete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div className="doctor-main-content">
      <div className="section-header">
        <h2><Icon name="message" size={20} color="#ff00ff" /> Communication Center</h2>
      </div>

      <div className="communication-grid">
        <div className="messages-panel">
          <h3>Messages</h3>
          {messages.map(msg => (
            <div key={msg.id} className={`message-item ${msg.read ? 'read' : 'unread'}`}>
              <div className="message-header">
                <strong>{msg.from}</strong>
                <span className="message-time">{msg.time}</span>
              </div>
              <p>{msg.subject}</p>
              <span className={`message-priority ${msg.priority}`}>{msg.priority}</span>
            </div>
          ))}
        </div>

        <div className="video-call-panel">
          <h3>Video Consultations</h3>
          <button className="video-call-btn">Start Video Call</button>
          <div className="upcoming-calls">
            <p>No upcoming video calls scheduled</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="doctor-main-content">
      <div className="section-header">
        <h2><Icon name="users" size={20} color="#ff00ff" /> Doctor Profile & Settings</h2>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-avatar-large"><Icon name="users" size={48} color="#ff00ff" /></div>
          <h2>{doctorInfo.name}</h2>
          <p>{doctorInfo.specialty}</p>
          <p className="license-number">License: {doctorInfo.license}</p>
        </div>

        <div className="profile-details">
          <h3>Professional Information</h3>
          <div className="profile-field">
            <label>Specialty</label>
            <input type="text" value={doctorInfo.specialty} readOnly />
          </div>
          <div className="profile-field">
            <label>License Number</label>
            <input type="text" value={doctorInfo.license} readOnly />
          </div>
          <div className="profile-field">
            <label>Digital Signature</label>
            <button className="signature-btn">Upload Signature</button>
          </div>
        </div>

        <div className="availability-settings">
          <h3>Availability Settings</h3>
          <div className="availability-grid">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
              <div key={day} className="day-availability">
                <label>
                  <input type="checkbox" defaultChecked />
                  {day}
                </label>
                <input type="time" defaultValue="09:00" />
                <span>to</span>
                <input type="time" defaultValue="17:00" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrescriptionHistory = () => (
    <div className="doctor-main-content">
      <div className="section-header">
        <h2><Icon name="pill" size={20} color="#ff00ff" /> Prescription History</h2>
        <input type="text" className="search-input" placeholder="Search prescriptions..." />
      </div>

      <div className="prescription-history-list">
        {prescriptionHistory.map(presc => (
          <div key={presc.id} className="prescription-history-item">
            <div className="presc-date">{presc.date}</div>
            <div className="presc-patient">
              <h4>{presc.patient}</h4>
              <p>Prescribed by: {presc.doctor}</p>
            </div>
            <div className="presc-meds">
              {presc.medications.map((med, idx) => (
                <span key={idx} className="med-badge">{med}</span>
              ))}
            </div>
            <button className="view-presc-btn">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConsultation = () => {
    if (!selectedPatient) return null;

    return (
      <div className="consultation-mode">
        <div className="consultation-header">
          <div className="patient-quick-info">
            <h2>{selectedPatient.name}</h2>
            <p>{selectedPatient.age} years • {selectedPatient.gender} • {selectedPatient.condition}</p>
          </div>
          <button className="close-consultation-btn" onClick={() => {
            setConsultationMode(false);
            setSelectedPatient(null);
          }}>
            <Icon name="x" size={16} color="#ef4444" /> Close Consultation
          </button>
        </div>

        <div className="consultation-grid">
          {/* AI Assistant Panel */}
          <div className="consultation-panel">
            <h3><Icon name="lightbulb" size={20} color="#ff00ff" /> AI Assistant (RangerMD)</h3>
            <button className="ai-btn" onClick={() => handleAIAnalysis(selectedPatient.id)}>
              Run AI Analysis
            </button>
            <button className="ai-btn" onClick={handleGenerateSOAP}>
              Generate SOAP Notes
            </button>

            {aiSuggestions.diagnosis.length > 0 && (
              <div className="ai-results">
                <h4>Diagnosis Suggestions</h4>
                {aiSuggestions.diagnosis.map((diag, idx) => (
                  <div key={idx} className="diagnosis-suggestion">
                    <span className="diag-name">{diag.condition}</span>
                    <span className="diag-prob">{diag.probability}%</span>
                    <span className={`diag-confidence ${diag.confidence}`}>{diag.confidence}</span>
                  </div>
                ))}

                <h4 style={{marginTop: '20px'}}>Risk Factors</h4>
                {aiSuggestions.riskFactors.map((risk, idx) => (
                  <div key={idx} className="risk-factor">
                    <span>{risk.factor}</span>
                    <span className={`risk-level ${risk.risk}`}>{risk.risk}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SOAP Notes Panel */}
          <div className="consultation-panel">
            <h3><Icon name="info" size={20} color="#ff00ff" /> SOAP Notes</h3>
            {['subjective', 'objective', 'assessment', 'plan'].map(section => (
              <div key={section} className="soap-section">
                <label>{section.charAt(0).toUpperCase() + section.slice(1)}</label>
                <textarea
                  value={consultationNotes[section]}
                  onChange={(e) => setConsultationNotes({...consultationNotes, [section]: e.target.value})}
                  rows={3}
                />
              </div>
            ))}
            <button className="save-notes-btn">Save Notes</button>
          </div>

          {/* E-Prescription Panel */}
          <div className="consultation-panel">
            <h3><Icon name="pill" size={20} color="#ff00ff" /> E-Prescription</h3>
            
            {aiSuggestions.prescription.length > 0 && (
              <div className="ai-prescription-suggestions">
                <h4>AI Suggestions</h4>
                {aiSuggestions.prescription.map((med, idx) => (
                  <div key={idx} className="med-suggestion">
                    <div className="med-details">
                      <strong>{med.name}</strong>
                      <p>{med.dosage} • {med.frequency} • {med.duration}</p>
                    </div>
                    <button className="add-med-btn" onClick={() => handlePrescribe(med)}>
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="prescription-form">
              <h4>Current Prescription</h4>
              {prescription.medications.map((med, idx) => (
                <div key={idx} className="prescribed-med">
                  <span>{med.name} - {med.dosage}</span>
                  <button onClick={() => setPrescription({...prescription, medications: prescription.medications.filter((_, i) => i !== idx)})}>
                    ✗
                  </button>
                </div>
              ))}

              <textarea
                placeholder="Special instructions..."
                value={prescription.instructions}
                onChange={(e) => setPrescription({...prescription, instructions: e.target.value})}
              />

              <button className="save-prescription-btn">💾 Save Prescription</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="doctor-dashboard">
      <div className="medical-background">
        <div className="particles"></div>
      </div>

      {/* Header */}
      <header className="doctor-header">
        <div className="header-left">
          <div className="doctor-avatar">{doctorInfo.avatar}</div>
          <div className="doctor-info">
            <h1>{doctorInfo.name}</h1>
            <p>{doctorInfo.specialty} • License: {doctorInfo.license}</p>
          </div>
        </div>

        <div className="header-right">
          <button className="header-btn">
            📧 Messages
            <span className="badge">{messages.filter(m => !m.read).length}</span>
          </button>
          <button className="header-btn">
            📹 Video
          </button>
          <button className="header-btn">
            🔔 Notifications
            <span className="badge">{alerts.length}</span>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="doctor-layout">
        {/* Sidebar */}
        <div className="doctor-sidebar">
          <nav className="doctor-nav">
            <button
              className={`nav-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('dashboard');
                setConsultationMode(false);
              }}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </button>
            
            <button
              className={`nav-btn ${activeSection === 'patients' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('patients');
                setConsultationMode(false);
              }}
            >
              <span className="nav-icon">👥</span>
              Patients
            </button>
            
            <button
              className={`nav-btn ${activeSection === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveSection('appointments')}
            >
              <span className="nav-icon">📅</span>
              Appointments
            </button>
            
            <button
              className={`nav-btn ${activeSection === 'prescriptions' ? 'active' : ''}`}
              onClick={() => setActiveSection('prescriptions')}
            >
              <span className="nav-icon">💊</span>
              Prescriptions
            </button>
            
            <button
              className={`nav-btn ${activeSection === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveSection('analytics')}
            >
              <span className="nav-icon">📊</span>
              Analytics
            </button>
            
            <button
              className={`nav-btn ${activeSection === 'communication' ? 'active' : ''}`}
              onClick={() => setActiveSection('communication')}
            >
              <span className="nav-icon">💬</span>
              Communication
            </button>
            
            <button
              className={`nav-btn ${activeSection === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveSection('tasks')}
            >
              <span className="nav-icon">✓</span>
              Tasks
            </button>
            
            <button
              className={`nav-btn ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              <span className="nav-icon">👤</span>
              Profile
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="doctor-content">
          {consultationMode ? renderConsultation() : 
           activeSection === 'dashboard' ? renderDashboard() :
           activeSection === 'patients' ? renderPatients() :
           activeSection === 'appointments' ? renderAppointments() :
           activeSection === 'prescriptions' ? renderPrescriptionHistory() :
           activeSection === 'analytics' ? renderAnalytics() :
           activeSection === 'communication' ? renderCommunication() :
           activeSection === 'tasks' ? renderTasks() :
           activeSection === 'profile' ? renderProfile() :
           <div className="coming-soon">
             <h2>🚧 Coming Soon</h2>
             <p>This section is under development</p>
           </div>
          }
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

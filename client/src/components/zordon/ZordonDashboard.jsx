/**
 * Zordon Dashboard - Operation Overdrive Headquarters Command Center
 * System-wide Analytics & Administrative Control
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../shared/Icon';
import './ZordonDashboard.css';

function ZordonDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('overview'); // overview, analytics, alerts, reports

  // Mock System-wide Data
  const systemStats = {
    totalRangers: 24,
    activeRangers: 18,
    inactiveRangers: 6,
    totalDoctors: 8,
    activeDoctors: 6,
    inactiveDoctors: 2,
    newSignups: {
      today: 3,
      week: 15,
      month: 42
    },
    systemHealth: 94,
    serverUptime: 99.8,
    databaseHealth: 98,
    apiResponseTime: 145 // ms
  };

  // Active Rangers List
  const activeRangers = [
    { id: 1, name: 'Mack Hartford', color: 'Red', team: 'Operation Overdrive', status: 'On Mission', lastActive: '5 min ago', healthScore: 96 },
    { id: 2, name: 'Rose Ortiz', color: 'Pink', team: 'Operation Overdrive', status: 'Available', lastActive: '12 min ago', healthScore: 94 },
    { id: 3, name: 'Dax Lo', color: 'Blue', team: 'Operation Overdrive', status: 'Available', lastActive: '18 min ago', healthScore: 98 },
    { id: 4, name: 'Will Aston', color: 'Black', team: 'Operation Overdrive', status: 'In Training', lastActive: '25 min ago', healthScore: 92 },
    { id: 5, name: 'Ronny Robinson', color: 'Yellow', team: 'Operation Overdrive', status: 'Available', lastActive: '30 min ago', healthScore: 95 },
    { id: 6, name: 'Tyzonn', color: 'Mercury', team: 'Operation Overdrive', status: 'On Mission', lastActive: '8 min ago', healthScore: 97 },
  ];

  // Active Doctors List
  const activeDoctors = [
    { id: 1, name: 'Dr. Andrew Hartford', specialty: 'General Medicine', patients: 28, status: 'Available', lastActive: '3 min ago', workload: 75 },
    { id: 2, name: 'Dr. Emily Chen', specialty: 'Cardiology', patients: 24, status: 'In Consultation', lastActive: '1 min ago', workload: 82 },
    { id: 3, name: 'Dr. Katherine Manx', specialty: 'Emergency Medicine', patients: 32, status: 'Available', lastActive: '10 min ago', workload: 88 },
    { id: 4, name: 'Dr. Spencer Mitchell', specialty: 'Sports Medicine', patients: 26, status: 'Available', lastActive: '15 min ago', workload: 70 },
    { id: 5, name: 'Dr. Sarah Thompson', specialty: 'Neurology', patients: 22, status: 'Off Duty', lastActive: '2 hours ago', workload: 65 },
    { id: 6, name: 'Dr. James Wilson', specialty: 'Orthopedics', patients: 30, status: 'In Consultation', lastActive: '5 min ago', workload: 85 },
  ];

  // Recent Sign-ups (Extended)
  const recentSignups = [
    { id: 1, name: 'Tyzonn', role: 'Ranger', color: 'Mercury', team: 'Operation Overdrive', date: '2025-12-07', time: '08:30 AM', status: 'pending-verification' },
    { id: 2, name: 'Dr. Emily Chen', role: 'Doctor', specialty: 'Cardiology', license: 'MD-2025-8901', date: '2025-12-07', time: '09:15 AM', status: 'verified' },
    { id: 3, name: 'Spencer', role: 'Ranger', color: 'Green', team: 'Operation Overdrive', date: '2025-12-06', time: '04:20 PM', status: 'verified' },
    { id: 4, name: 'Dr. Maria Rodriguez', role: 'Doctor', specialty: 'Pediatrics', license: 'MD-2025-8902', date: '2025-12-06', time: '02:45 PM', status: 'pending-verification' },
    { id: 5, name: 'Alex Parker', role: 'Ranger', color: 'Silver', team: 'Space Patrol Delta', date: '2025-12-06', time: '11:30 AM', status: 'verified' },
    { id: 6, name: 'Dr. Robert Kim', role: 'Doctor', specialty: 'Psychiatry', license: 'MD-2025-8903', date: '2025-12-05', time: '03:15 PM', status: 'verified' },
  ];

  // AI Health Trend Reports
  const aiHealthReports = [
    {
      id: 1,
      category: 'Overall Health',
      trend: 'improving',
      percentage: 8,
      insight: 'Average ranger health scores increased by 8% this week',
      recommendation: 'Continue current wellness protocols'
    },
    {
      id: 2,
      category: 'Medication Adherence',
      trend: 'stable',
      percentage: 2,
      insight: '92% medication adherence rate across all rangers',
      recommendation: 'Send reminders to 3 rangers with missed doses'
    },
    {
      id: 3,
      category: 'Symptom Patterns',
      trend: 'declining',
      percentage: -12,
      insight: 'Fatigue symptoms down 12%, headaches down 8%',
      recommendation: 'Reduced mission intensity showing positive effects'
    },
    {
      id: 4,
      category: 'Mission Readiness',
      trend: 'improving',
      percentage: 15,
      insight: 'Physical fitness scores up 15% after training updates',
      recommendation: 'Expand training program to all teams'
    },
    {
      id: 5,
      category: 'Doctor Workload',
      trend: 'stable',
      percentage: 0,
      insight: 'Average 18 appointments per doctor daily',
      recommendation: 'Workload balanced, no action needed'
    }
  ];

  // System Activity (Last 24 hours)
  const systemActivity = {
    appointmentsBooked: 23,
    prescriptionsIssued: 15,
    symptomsLogged: 34,
    aiConsultations: 12,
    emergencyAlerts: 2,
    systemUptime: 99.8
  };

  const handleLogout = () => {
    localStorage.removeItem('zordonAuth');
    navigate('/zordon');
  };

  // System Health Metrics
  const systemHealthMetrics = [
    { id: 1, name: 'Server Uptime', value: systemStats.serverUptime, unit: '%', status: 'excellent', icon: 'activity' },
    { id: 2, name: 'Database Health', value: systemStats.databaseHealth, unit: '%', status: 'good', icon: 'heart' },
    { id: 3, name: 'API Response Time', value: systemStats.apiResponseTime, unit: 'ms', status: 'good', icon: 'zap' },
    { id: 4, name: 'Active Connections', value: 142, unit: '', status: 'excellent', icon: 'users' },
    { id: 5, name: 'Storage Used', value: 68, unit: '%', status: 'warning', icon: 'hospital' },
    { id: 6, name: 'Memory Usage', value: 72, unit: '%', status: 'good', icon: 'chart' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'excellent': return '#00ff88';
      case 'good': return '#00d4ff';
      case 'warning': return '#ffaa00';
      case 'critical': return '#ff0044';
      default: return '#ffffff';
    }
  };

  const getRangerStatusColor = (status) => {
    switch(status) {
      case 'On Mission': return '#ff0044';
      case 'Available': return '#00ff88';
      case 'In Training': return '#0088ff';
      case 'Off Duty': return '#888888';
      default: return '#ffffff';
    }
  };

  const getDoctorStatusColor = (status) => {
    switch(status) {
      case 'In Consultation': return '#ff0088';
      case 'Available': return '#00ff88';
      case 'Off Duty': return '#888888';
      default: return '#ffffff';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return 'trendingUp';
    if (trend === 'declining') return 'trendingDown';
    return 'minus';
  };

  const getTrendColor = (trend) => {
    if (trend === 'improving') return '#00ff00';
    if (trend === 'declining') return '#ff0044';
    return '#00d4ff';
  };

  return (
    <div className="zordon-dashboard">
      {/* Operation Overdrive Background Effects */}
      <div className="overdrive-background">
        <div className="overdrive-grid"></div>
        <div className="overdrive-particles"></div>
      </div>

      {/* Header */}
      <div className="zordon-header">
        <div className="header-left">
          <div className="zordon-logo"><Icon name="zap" size={40} color="#00d4ff" /></div>
          <div className="header-info">
            <h1>ZORDON COMMAND CENTER</h1>
            <p>OPERATION OVERDRIVE HEADQUARTERS • SYSTEM ADMINISTRATION</p>
          </div>
        </div>
        <div className="header-right">
          <div className="system-status">
            <span className="status-indicator"></span>
            <span>SYSTEM OPERATIONAL</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <Icon name="x" size={18} />
            LOGOUT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="zordon-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><Icon name="users" size={40} color="#00d4ff" /></div>
            <div className="stat-info">
              <div className="stat-value">{systemStats.activeRangers}/{systemStats.totalRangers}</div>
              <div className="stat-label">Active Rangers</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><Icon name="doctor" size={40} color="#00ff88" /></div>
            <div className="stat-info">
              <div className="stat-value">{systemStats.activeDoctors}/{systemStats.totalDoctors}</div>
              <div className="stat-label">Active Doctors</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><Icon name="sparkles" size={40} color="#ffaa00" /></div>
            <div className="stat-info">
              <div className="stat-value">{systemStats.newSignups.today}</div>
              <div className="stat-label">New Registrations Today</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><Icon name="activity" size={40} color="#00d4ff" /></div>
            <div className="stat-info">
              <div className="stat-value">{systemStats.serverUptime}%</div>
              <div className="stat-label">Server Uptime</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><Icon name="heart" size={40} color="#00ff88" /></div>
            <div className="stat-info">
              <div className="stat-value">{systemStats.systemHealth}%</div>
              <div className="stat-label">System Health</div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Active Rangers */}
          <div className="dashboard-section rangers-section">
            <div className="section-header">
              <h2>
                <Icon name="shield" size={24} color="#0088ff" />
                ACTIVE RANGERS
              </h2>
              <span className="section-count">{systemStats.activeRangers} online</span>
            </div>
            <div className="rangers-list">
              {activeRangers.map(ranger => (
                <div key={ranger.id} className="ranger-item">
                  <div className="ranger-avatar">
                    <Icon name="shield" size={28} color="#0088ff" />
                  </div>
                  <div className="ranger-info">
                    <div className="ranger-name">{ranger.name}</div>
                    <div className="ranger-meta">
                      <span className="ranger-color-badge" style={{ background: getRangerStatusColor(ranger.status) }}>
                        {ranger.color}
                      </span>
                      <span className="ranger-team">{ranger.team}</span>
                    </div>
                  </div>
                  <div className="ranger-status">
                    <div className="status-indicator" style={{ background: getRangerStatusColor(ranger.status) }}></div>
                    <span style={{ color: getRangerStatusColor(ranger.status) }}>{ranger.status}</span>
                  </div>
                  <div className="ranger-health">
                    <div className="health-score">{ranger.healthScore}%</div>
                    <div className="health-label">Health</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Doctors */}
          <div className="dashboard-section doctors-section">
            <div className="section-header">
              <h2>
                <Icon name="doctor" size={24} color="#00ff88" />
                ACTIVE DOCTORS
              </h2>
              <span className="section-count">{systemStats.activeDoctors} online</span>
            </div>
            <div className="doctors-list">
              {activeDoctors.map(doctor => (
                <div key={doctor.id} className="doctor-item">
                  <div className="doctor-avatar">
                    <Icon name="doctor" size={28} color="#00ff88" />
                  </div>
                  <div className="doctor-info">
                    <div className="doctor-name">{doctor.name}</div>
                    <div className="doctor-meta">
                      <span className="doctor-specialty">{doctor.specialty}</span>
                      <span className="doctor-patients">{doctor.patients} patients</span>
                    </div>
                  </div>
                  <div className="doctor-status">
                    <div className="status-indicator" style={{ background: getDoctorStatusColor(doctor.status) }}></div>
                    <span style={{ color: getDoctorStatusColor(doctor.status) }}>{doctor.status}</span>
                  </div>
                  <div className="doctor-workload">
                    <div className="workload-bar">
                      <div className="workload-fill" style={{ 
                        width: `${doctor.workload}%`,
                        background: doctor.workload > 85 ? '#ff0044' : doctor.workload > 70 ? '#ffaa00' : '#00ff88'
                      }}></div>
                    </div>
                    <div className="workload-label">{doctor.workload}% Load</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sign-ups */}
          <div className="dashboard-section signups-section">
            <div className="section-header">
              <h2>
                <Icon name="sparkles" size={24} color="#ffaa00" />
                NEW REGISTRATIONS
              </h2>
              <span className="section-count">{systemStats.newSignups.today} today • {systemStats.newSignups.week} this week</span>
            </div>
            <div className="signups-list">
              {recentSignups.map(signup => (
                <div key={signup.id} className="signup-item">
                  <div className="signup-avatar">
                    {signup.role === 'Ranger' ? 
                      <Icon name="shield" size={32} color="#0088ff" /> : 
                      <Icon name="doctor" size={32} color="#00ff88" />
                    }
                  </div>
                  <div className="signup-info">
                    <div className="signup-name">{signup.name}</div>
                    <div className="signup-meta">
                      {signup.role === 'Ranger' ? (
                        <>
                          <span className="ranger-badge">{signup.color} Ranger</span>
                          <span className="team-badge">{signup.team}</span>
                        </>
                      ) : (
                        <>
                          <span className="doctor-badge">{signup.specialty}</span>
                          <span className="license-badge">{signup.license}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="signup-status">
                    <span className={`status-badge ${signup.status}`}>
                      {signup.status === 'verified' ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="signup-time">
                    <div>{signup.time}</div>
                    <div className="signup-date">{signup.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="dashboard-section health-section">
            <div className="section-header">
              <h2>
                <Icon name="heart" size={24} color="#00ff88" />
                SYSTEM HEALTH
              </h2>
              <span className="section-count">{systemStats.systemHealth}% overall</span>
            </div>
            <div className="health-metrics-grid">
              {systemHealthMetrics.map(metric => (
                <div key={metric.id} className="health-metric">
                  <div className="metric-icon">
                    <Icon name={metric.icon} size={24} color={getStatusColor(metric.status)} />
                  </div>
                  <div className="metric-info">
                    <div className="metric-name">{metric.name}</div>
                    <div className="metric-value" style={{ color: getStatusColor(metric.status) }}>
                      {metric.value}{metric.unit}
                    </div>
                  </div>
                  <div className="metric-status">
                    <div 
                      className="status-dot" 
                      style={{ background: getStatusColor(metric.status) }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Health Trends */}
          <div className="dashboard-section trends-section">
            <div className="section-header">
              <h2>
                <Icon name="chart" size={24} color="#ffaa00" />
                AI HEALTH TRENDS
              </h2>
              <span className="section-count">Last 7 days</span>
            </div>
            <div className="trends-list">
              {aiHealthReports.map(report => (
                <div key={report.id} className="trend-item">
                  <div className="trend-header">
                    <div className="trend-category">{report.category}</div>
                    <div className="trend-badge" style={{ color: getTrendColor(report.trend) }}>
                      <Icon name={getTrendIcon(report.trend)} size={16} color={getTrendColor(report.trend)} />
                      {report.percentage !== 0 && (
                        <span>{report.percentage > 0 ? '+' : ''}{report.percentage}%</span>
                      )}
                    </div>
                  </div>
                  <div className="trend-insight">{report.insight}</div>
                  <div className="trend-recommendation">
                    <Icon name="lightbulb" size={14} color="#ffaa00" />
                    {report.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Activity */}
          <div className="dashboard-section activity-section">
            <div className="section-header">
              <h2>
                <Icon name="zap" size={24} color="#00d4ff" />
                SYSTEM ACTIVITY (24H)
              </h2>
              <span className="section-count">{systemActivity.systemUptime}% uptime</span>
            </div>
            <div className="activity-grid">
              <div className="activity-item">
                <div className="activity-icon"><Icon name="calendar" size={32} color="#0088ff" /></div>
                <div className="activity-value">{systemActivity.appointmentsBooked}</div>
                <div className="activity-label">Appointments Booked</div>
              </div>
              <div className="activity-item">
                <div className="activity-icon"><Icon name="pill" size={32} color="#ff0088" /></div>
                <div className="activity-value">{systemActivity.prescriptionsIssued}</div>
                <div className="activity-label">Prescriptions Issued</div>
              </div>
              <div className="activity-item">
                <div className="activity-icon"><Icon name="fileText" size={32} color="#00ff88" /></div>
                <div className="activity-value">{systemActivity.symptomsLogged}</div>
                <div className="activity-label">Symptoms Logged</div>
              </div>
              <div className="activity-item">
                <div className="activity-icon"><Icon name="bot" size={32} color="#00d4ff" /></div>
                <div className="activity-value">{systemActivity.aiConsultations}</div>
                <div className="activity-label">AI Consultations</div>
              </div>
              <div className="activity-item">
                <div className="activity-icon"><Icon name="bell" size={32} color="#ff0044" /></div>
                <div className="activity-value">{systemActivity.emergencyAlerts}</div>
                <div className="activity-label">Emergency Alerts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ZordonDashboard;

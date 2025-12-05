/**
 * Health Timeline - Unified Health Journey
 * Combines Capsules, Symptoms, and Appointments in chronological order
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './HealthTimeline.css';

function HealthTimeline({ selectedRanger = 'red' }) {
  const navigate = useNavigate();
  
  const rangerColors = {
    red: '#FF0000',
    blue: '#0066FF',
    yellow: '#FFD700',
    pink: '#FF69B4',
    black: '#ffffff',
    mercury: '#C0C0C0'
  };

  const currentColor = rangerColors[selectedRanger] || rangerColors.red;

  // Mock data - In real app, this would come from backend/state
  const [timelineEvents] = useState([
    // Medications
    { id: 1, type: 'medication', date: '2025-12-05', time: '08:00', title: 'Morphinium-12 Taken', description: '500mg - Morning dose', status: 'completed', icon: '💊' },
    { id: 2, type: 'medication', date: '2025-12-04', time: '20:00', title: 'Morphinium-12 Missed', description: '500mg - Evening dose', status: 'missed', icon: '⚠️' },
    { id: 3, type: 'medication', date: '2025-12-04', time: '08:00', title: 'Morphinium-12 Taken', description: '500mg - Morning dose', status: 'completed', icon: '💊' },
    
    // Symptoms
    { id: 4, type: 'symptom', date: '2025-12-04', time: '21:30', title: 'Headache Logged', description: 'Severity: 7/10 - Post-mission fatigue', status: 'logged', icon: '🤕' },
    { id: 5, type: 'symptom', date: '2025-12-03', time: '14:00', title: 'Muscle Soreness', description: 'Severity: 5/10 - Training recovery', status: 'logged', icon: '💪' },
    { id: 6, type: 'symptom', date: '2025-12-02', time: '10:00', title: 'Fatigue', description: 'Severity: 4/10 - Improved from yesterday', status: 'logged', icon: '😴' },
    
    // Appointments
    { id: 7, type: 'appointment', date: '2025-12-10', time: '10:30', title: 'Check-up with Dr. Hartford', description: 'General Medicine - Routine health check', status: 'upcoming', icon: '👨‍⚕️' },
    { id: 8, type: 'appointment', date: '2025-12-03', time: '14:30', title: 'Physical Therapy', description: 'Dr. Spencer - Post-mission recovery', status: 'completed', icon: '🏥' },
    { id: 9, type: 'appointment', date: '2025-11-28', time: '09:00', title: 'Morphin Grid Analysis', description: 'Dr. Manx - Energy level assessment', status: 'completed', icon: '⚡' },
    
    // Additional events for context
    { id: 10, type: 'medication', date: '2025-12-03', time: '09:00', title: 'Neural-Sync Plus Taken', description: '250mg - Morning dose', status: 'completed', icon: '💊' },
    { id: 11, type: 'symptom', date: '2025-12-01', time: '16:00', title: 'Dizziness', description: 'Severity: 6/10 - After morphing sequence', status: 'logged', icon: '🌀' },
    { id: 12, type: 'appointment', date: '2025-11-25', time: '11:00', title: 'Lab Work', description: 'Dr. Hartford - Blood work and vitals', status: 'completed', icon: '🔬' },
  ]);

  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('week'); // week, month, all

  // Sort and filter timeline events
  const filteredEvents = useMemo(() => {
    let events = [...timelineEvents];

    // Filter by type
    if (filterType !== 'all') {
      events = events.filter(event => event.type === filterType);
    }

    // Filter by date range
    const now = new Date();
    if (dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      events = events.filter(event => new Date(event.date) >= weekAgo);
    } else if (dateRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      events = events.filter(event => new Date(event.date) >= monthAgo);
    }

    // Sort by date and time (newest first)
    events.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB - dateA;
    });

    return events;
  }, [timelineEvents, filterType, dateRange]);

  const getEventColor = (type, status) => {
    const colors = {
      medication: {
        completed: '#32cd32',
        missed: '#ff4500',
        default: '#00ffff'
      },
      symptom: {
        logged: '#ffa500',
        default: '#ffa500'
      },
      appointment: {
        upcoming: '#00bfff',
        completed: '#32cd32',
        default: '#00ffff'
      }
    };
    return colors[type]?.[status] || colors[type]?.default || currentColor;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStats = () => {
    const stats = {
      medications: { total: 0, completed: 0, missed: 0 },
      symptoms: { total: 0 },
      appointments: { total: 0, upcoming: 0, completed: 0 }
    };

    filteredEvents.forEach(event => {
      if (event.type === 'medication') {
        stats.medications.total++;
        if (event.status === 'completed') stats.medications.completed++;
        if (event.status === 'missed') stats.medications.missed++;
      } else if (event.type === 'symptom') {
        stats.symptoms.total++;
      } else if (event.type === 'appointment') {
        stats.appointments.total++;
        if (event.status === 'upcoming') stats.appointments.upcoming++;
        if (event.status === 'completed') stats.appointments.completed++;
      }
    });

    return stats;
  };

  const stats = getStats();

  return (
    <div className="timeline-page" data-ranger={selectedRanger}>
      {/* Background */}
      <div className="space-background"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Header */}
      <div className="timeline-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← DASHBOARD
        </button>
        <div className="header-content">
          <h1>HEALTH TIMELINE</h1>
          <p>UNIFIED HEALTH JOURNEY - OPERATION OVERDRIVE</p>
        </div>
      </div>

      <div className="timeline-container">
        {/* Filters and Stats Panel */}
        <div className="timeline-sidebar">
          <div className="filter-section">
            <h3>📅 Time Range</h3>
            <div className="filter-buttons">
              <button 
                className={dateRange === 'week' ? 'active' : ''}
                onClick={() => setDateRange('week')}
                style={dateRange === 'week' ? { borderColor: currentColor, color: currentColor } : {}}
              >
                Last Week
              </button>
              <button 
                className={dateRange === 'month' ? 'active' : ''}
                onClick={() => setDateRange('month')}
                style={dateRange === 'month' ? { borderColor: currentColor, color: currentColor } : {}}
              >
                Last Month
              </button>
              <button 
                className={dateRange === 'all' ? 'active' : ''}
                onClick={() => setDateRange('all')}
                style={dateRange === 'all' ? { borderColor: currentColor, color: currentColor } : {}}
              >
                All Time
              </button>
            </div>
          </div>

          <div className="filter-section">
            <h3>🔍 Filter Events</h3>
            <div className="filter-buttons">
              <button 
                className={filterType === 'all' ? 'active' : ''}
                onClick={() => setFilterType('all')}
                style={filterType === 'all' ? { borderColor: currentColor, color: currentColor } : {}}
              >
                All Events
              </button>
              <button 
                className={filterType === 'medication' ? 'active' : ''}
                onClick={() => setFilterType('medication')}
                style={filterType === 'medication' ? { borderColor: '#32cd32', color: '#32cd32' } : {}}
              >
                💊 Medications
              </button>
              <button 
                className={filterType === 'symptom' ? 'active' : ''}
                onClick={() => setFilterType('symptom')}
                style={filterType === 'symptom' ? { borderColor: '#ffa500', color: '#ffa500' } : {}}
              >
                🤕 Symptoms
              </button>
              <button 
                className={filterType === 'appointment' ? 'active' : ''}
                onClick={() => setFilterType('appointment')}
                style={filterType === 'appointment' ? { borderColor: '#00bfff', color: '#00bfff' } : {}}
              >
                👨‍⚕️ Appointments
              </button>
            </div>
          </div>

          <div className="stats-section">
            <h3>📊 Statistics</h3>
            <div className="stat-card">
              <div className="stat-icon">💊</div>
              <div className="stat-details">
                <div className="stat-label">Medications</div>
                <div className="stat-value">{stats.medications.completed}/{stats.medications.total}</div>
                <div className="stat-sublabel">{stats.medications.missed} missed</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🤕</div>
              <div className="stat-details">
                <div className="stat-label">Symptoms Logged</div>
                <div className="stat-value">{stats.symptoms.total}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👨‍⚕️</div>
              <div className="stat-details">
                <div className="stat-label">Appointments</div>
                <div className="stat-value">{stats.appointments.total}</div>
                <div className="stat-sublabel">{stats.appointments.upcoming} upcoming</div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Events */}
        <div className="timeline-main">
          <div className="timeline-track">
            {filteredEvents.map((event, index) => {
              const showDate = index === 0 || filteredEvents[index - 1].date !== event.date;
              
              return (
                <React.Fragment key={event.id}>
                  {showDate && (
                    <div className="timeline-date-separator">
                      <span className="date-label">{formatDate(event.date)}</span>
                    </div>
                  )}
                  
                  <div className={`timeline-event ${event.type} ${event.status}`}>
                    <div 
                      className="event-marker"
                      style={{ backgroundColor: getEventColor(event.type, event.status) }}
                    >
                      {event.icon}
                    </div>
                    
                    <div className="event-content">
                      <div className="event-header">
                        <h4>{event.title}</h4>
                        <span className="event-time">{event.time}</span>
                      </div>
                      <p className="event-description">{event.description}</p>
                      <div className="event-footer">
                        <span 
                          className={`event-badge ${event.type}`}
                          style={{ 
                            backgroundColor: getEventColor(event.type, event.status) + '20',
                            borderColor: getEventColor(event.type, event.status),
                            color: getEventColor(event.type, event.status)
                          }}
                        >
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                        <span 
                          className={`status-badge ${event.status}`}
                          style={{ 
                            backgroundColor: getEventColor(event.type, event.status) + '20',
                            borderColor: getEventColor(event.type, event.status),
                            color: getEventColor(event.type, event.status)
                          }}
                        >
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="no-events">
              <div className="no-events-icon">📭</div>
              <h3>No Events Found</h3>
              <p>Try adjusting your filters to see more events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HealthTimeline;

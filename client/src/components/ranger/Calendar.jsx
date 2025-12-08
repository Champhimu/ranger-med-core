import React, { useState, useEffect , useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';
import { useDispatch, useSelector } from "react-redux";
import { fetchCalendarByDate } from '../../store/calendarSlice';

function Calendar({ selectedRanger = 'red' }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector((state) => state.calendar);
  
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 4)); // December 4, 2025
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const fileInputRef = useRef(null);

  const rangerColors = {
    red: '#FF0000',
    blue: '#0066FF',
    yellow: '#FFD700',
    black: '#000000',
    pink: '#FF69B4',
    mercury: '#C0C0C0'
  };

  useEffect(() => {
    if (selectedDate) {
      const dateString = formatDateToString(selectedDate);
      dispatch(fetchCalendarByDate(dateString));
    }
    console.log("SELECTED",selectedDate);
  }, [selectedDate]);

  const currentColor = rangerColors[selectedRanger] || rangerColors.red;

  // Mock data for calendar events
  const events = {
    appointments: [
      { date: '2025-12-10', time: '10:00 AM', title: 'Annual Check-up', doctor: 'Dr. Hartford', type: 'appointment' },
      { date: '2025-12-15', time: '02:00 PM', title: 'Physical Therapy', doctor: 'Dr. Spencer', type: 'appointment' },
      { date: '2025-12-18', time: '09:30 AM', title: 'Morphin Grid Analysis', doctor: 'Dr. Manx', type: 'appointment' }
    ],
    medications: [
      { date: '2025-12-04', time: '08:00 AM', title: 'Overdrive Accelerator', dosage: '500mg', type: 'medication' },
      { date: '2025-12-04', time: '08:00 PM', title: 'Overdrive Accelerator', dosage: '500mg', type: 'medication' },
      { date: '2025-12-05', time: '07:30 AM', title: 'Zord Energy Capsule', dosage: '250mg', type: 'medication' },
      { date: '2025-12-06', time: '08:00 AM', title: 'Overdrive Accelerator', dosage: '500mg', type: 'medication' }
    ],
    reminders: [
      // { date: '2025-12-05', time: '09:00 AM', title: 'Hydration Check', description: 'Drink 8 glasses today', type: 'reminder' },
      // { date: '2025-12-07', time: '06:00 PM', title: 'Training Session', description: 'Combat practice at HQ', type: 'reminder' },
      // { date: '2025-12-12', time: '08:00 AM', title: 'Health Assessment', description: 'Monthly vitals review', type: 'reminder' }
    ],
    symptoms: [
      { date: '2025-12-03', time: '02:30 PM', title: 'Headache', severity: 'mild', type: 'symptom' },
      { date: '2025-12-02', time: '09:15 AM', title: 'Fatigue', severity: 'moderate', type: 'symptom' },
      { date: '2025-12-01', time: '06:45 PM', title: 'Muscle soreness', severity: 'mild', type: 'symptom' }
    ]
  };

  // Combine all events
  const allEvents = [
    ...events.appointments,
    ...events.medications,
    ...events.reminders,
    ...events.symptoms
  ];

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = formatDateToString(date);
    return allEvents.filter(event => event.date === dateStr);
  };

  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ==================== CALENDAR EXPORT/IMPORT FUNCTIONS ====================
  
  const generateICS = () => {
    // ICS (iCalendar) format generator
    const icsEvents = allEvents.map(event => {
      const eventDate = new Date(`${event.date} ${event.time || '00:00'}`);
      const startDate = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      let description = '';
      if (event.doctor) description += `Doctor: ${event.doctor}\\n`;
      if (event.dosage) description += `Dosage: ${event.dosage}\\n`;
      if (event.description) description += event.description;
      if (event.severity) description += `Severity: ${event.severity}`;
      
      return [
        'BEGIN:VEVENT',
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${event.title}`,
        description ? `DESCRIPTION:${description}` : '',
        `CATEGORIES:${event.type.toUpperCase()}`,
        `STATUS:CONFIRMED`,
        `UID:${event.date}-${event.title.replace(/\s/g, '-')}@ranger-med-core.app`,
        'END:VEVENT'
      ].filter(Boolean).join('\r\n');
    }).join('\r\n');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Ranger Med-Core//NONSGML v1.0//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Ranger Health Calendar',
      'X-WR-TIMEZONE:UTC',
      'X-WR-CALDESC:Medical appointments, medications, and health tracking',
      icsEvents,
      'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
  };

  const handleExportCalendar = () => {
    const icsContent = generateICS();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ranger-health-calendar-${formatDateToString(new Date())}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('Calendar exported successfully! You can now import this file into Google Calendar, Apple Calendar, Outlook, or any other calendar app.');
  };

  const handleImportCalendar = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const icsContent = e.target.result;
      parseICS(icsContent);
    };
    reader.readAsText(file);
  };

  const parseICS = (icsContent) => {
    // Basic ICS parser - In production, use a library like ical.js
    const lines = icsContent.split(/\r\n|\n|\r/);
    let importedCount = 0;
    
    lines.forEach((line, index) => {
      if (line.startsWith('SUMMARY:')) {
        const summary = line.substring(8);
        const dateLineBefore = lines.slice(0, index).reverse().find(l => l.startsWith('DTSTART'));
        
        if (dateLineBefore) {
          importedCount++;
        }
      }
    });

    alert(`Successfully imported ${importedCount} events from calendar file!\n\nNote: In a production app, these would be saved to your account.`);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSyncGoogleCalendar = () => {
    // In production, this would use Google Calendar API
    alert('Google Calendar Sync\n\nTo enable sync:\n1. Connect your Google account\n2. Grant calendar permissions\n3. Choose sync direction (one-way or two-way)\n\nThis feature requires backend API integration.');
  };

  const handleAddToPhoneCalendar = (event) => {
    // Generate a single event ICS for quick add
    const eventDate = new Date(`${event.date} ${event.time || '00:00'}`);
    const startDate = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Ranger Med-Core//NONSGML v1.0//EN',
      'BEGIN:VEVENT',
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || event.doctor || event.dosage || ''}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/\s/g, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==================== END EXPORT/IMPORT FUNCTIONS ====================

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    const today = new Date();
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateEvents = getEventsForDate(date);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dateEvents.length > 0 ? 'has-events' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="day-number">{day}</div>
          {dateEvents.length > 0 && (
            <div className="event-indicators">
              {dateEvents.slice(0, 3).map((event, idx) => (
                <div key={idx} className={`event-dot ${event.type}`}></div>
              ))}
              {dateEvents.length > 3 && <span className="more-events">+{dateEvents.length - 3}</span>}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const changeMonth = (delta) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    setSelectedDate(null);
  };

  const getEventIcon = (type) => {
    const icons = {
      appointment: '📅',
      medication: '💊',
      reminder: '🔔',
      symptom: '📋'
    };
    return icons[type] || '•';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      mild: '#00ff00',
      moderate: '#ffcc00',
      severe: '#ff0000'
    };
    return colors[severity] || '#00ffff';
  };

  return (
    <div className="calendar-page" data-ranger={selectedRanger}>
      {/* Backgrounds */}
      <div className="space-background"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Header */}
      <div className="calendar-header">
        <button className="back-to-dashboard" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <div className="header-content">
          <h1 className="page-title">MISSION CALENDAR</h1>
          <p className="page-subtitle">OPERATION OVERDRIVE - SCHEDULE OVERVIEW</p>
        </div>
        
        {/* Calendar Sync Buttons */}
        <div className="calendar-sync-buttons">
          <button 
            className="sync-btn export-btn"
            onClick={handleExportCalendar}
            title="Export to ICS file"
            style={{ borderColor: currentColor, color: currentColor }}
          >
            📤 Export
          </button>
          <button 
            className="sync-btn import-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Import from ICS file"
            style={{ borderColor: currentColor, color: currentColor }}
          >
            📥 Import
          </button>
          <button 
            className="sync-btn google-btn"
            onClick={handleSyncGoogleCalendar}
            title="Sync with Google Calendar"
            style={{ borderColor: currentColor, color: currentColor }}
          >
            🔗 Sync
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".ics,.ical"
            onChange={handleImportCalendar}
            style={{ display: 'none' }}
          />
        </div>
        
        <div className="view-mode-toggle">
          <button 
            className={viewMode === 'month' ? 'active' : ''} 
            onClick={() => setViewMode('month')}
            style={viewMode === 'month' ? { background: currentColor } : {}}
          >
            Month
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="calendar-container">
        
        {/* Left Panel - Calendar */}
        <div className="calendar-section">
          <div className="calendar-controls">
            <button className="month-nav" onClick={() => changeMonth(-1)}>◄</button>
            <h2 className="current-month">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button className="month-nav" onClick={() => changeMonth(1)}>►</button>
          </div>

          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            <div className="calendar-days">
              {renderCalendar()}
            </div>
          </div>

          {/* Legend */}
          <div className="calendar-legend">
            <h3>Legend</h3>
            <div className="legend-items">
              <div className="legend-item">
                <div className="event-dot appointment"></div>
                <span>Appointments</span>
              </div>
              <div className="legend-item">
                <div className="event-dot medication"></div>
                <span>Medications</span>
              </div>
              <div className="legend-item">
                <div className="event-dot reminder"></div>
                <span>Reminders</span>
              </div>
              <div className="legend-item">
                <div className="event-dot symptom"></div>
                <span>Symptoms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Event Details */}
        <div className="events-section">
          <h2 className="section-title">
            {selectedDate 
              ? `Events for ${selectedDate.toLocaleDateString('default', { month: 'long', day: 'numeric' })}`
              : 'All Upcoming Events'}
          </h2>

          {/* Event Categories */}
          <div className="event-categories">
            
            {/* Appointments */}
            <div className="event-category">
              <div className="category-header">
                <span className="category-icon">📅</span>
                <h3>Appointments</h3>
                <span className="event-count">
                  {data?.appointments.length || 0}
                </span>
              </div>
              <div className="event-list">
                {console.log("DATA",data)};
                {data?.appointments.map((event, idx) => (
                  <div key={idx} className="event-item appointment-event">
                    <div className="event-time">{event.time}</div>
                    <div className="event-content">
                      <div className="event-title">{event.type}</div>
                      <div className="event-detail">{event.doctor.name}</div>
                    </div>
                    {/* <button 
                      className="add-to-cal-btn"
                      onClick={() => handleAddToPhoneCalendar(event)}
                      title="Add to your calendar"
                    >
                      📲
                    </button> */}
                  </div>
                ))}
                {data?.appointments.length === 0 && (
                  <div className="no-events">No appointments scheduled</div>
                )}
              </div>
            </div>

            {/* Medications */}
            <div className="event-category">
              <div className="category-header">
                <span className="category-icon">💊</span>
                <h3>Medication Schedule</h3>
                <span className="event-count">
                  {data?.doses.length}
                </span>
              </div>
              <div className="event-list">
                {data?.doses.map((event) => (
                  <div key={event._id} className="event-item medication-event">
                    <div className="event-time">{event.time}</div>
                    <div className="event-content">
                      <div className="event-title">{event.capsule.name}</div>
                      <div className="event-detail">{`${event.capsule.doseAmount} ${event.capsule.doseUnit}`}</div>
                    </div>
                    {/* <button 
                      className="add-to-cal-btn"
                      onClick={() => handleAddToPhoneCalendar(event)}
                      title="Add to your calendar"
                    >
                      📲
                    </button> */}
                  </div>
                ))}
                {data?.doses.length === 0 && (
                  <div className="no-events">No medications scheduled</div>
                )}
              </div>
            </div>

            {/* Health Reminders */}
            <div className="event-category">
              <div className="category-header">
                <span className="category-icon">🔔</span>
                <h3>Health Reminders</h3>
                <span className="event-count">
                  {selectedDate 
                    ? getEventsForDate(selectedDate).filter(e => e.type === 'reminder').length
                    : events.reminders.length}
                </span>
              </div>
              <div className="event-list">
                {(selectedDate 
                  ? getEventsForDate(selectedDate).filter(e => e.type === 'reminder')
                  : events.reminders
                ).map((event, idx) => (
                  <div key={idx} className="event-item reminder-event">
                    <div className="event-time">{event.time}</div>
                    <div className="event-content">
                      <div className="event-title">{event.title}</div>
                      <div className="event-detail">{event.description}</div>
                    </div>
                  </div>
                ))}
                {(selectedDate 
                  ? getEventsForDate(selectedDate).filter(e => e.type === 'reminder')
                  : events.reminders
                ).length === 0 && (
                  <div className="no-events">No reminders set</div>
                )}
              </div>
            </div>

            {/* Symptom Logs */}
            <div className="event-category">
              <div className="category-header">
                <span className="category-icon">📋</span>
                <h3>Symptom Logs</h3>
                <span className="event-count">
                  {data?.symptoms.length}
                </span>
              </div>
              <div className="event-list">
                {data?.symptoms.map((event, idx) => (
                  <div key={idx} className="event-item symptom-event">
                    <div className="event-time">{event.time}</div>
                    <div className="event-content">
                      <div className="event-title">{event.symptomName}</div>
                      <div 
                        className="event-detail severity-badge"
                        style={{ color: getSeverityColor(event.severity), padding: "0px" }}
                      >
                        {event.severity.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
                {data?.symptoms.length === 0 && (
                  <div className="no-events">No symptoms logged</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Cockpit Frame */}
      <div className="cockpit-frame"></div>
    </div>
  );
}

export default Calendar;

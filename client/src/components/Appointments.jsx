import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Appointments.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentsThunk, addAppointmentThunk, cancelAppointmentThunk, updateAppointmentThunk } from '../store/appointmentsSlice';
import { fetchDoctorsThunk } from '../store/doctorSlice';

function Appointments({ selectedRanger = 'red' }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { doctors, loading: doctorsLoading, error: doctorsError } = useSelector((state) => state.doctor);
  const { upcoming: upcomingAppointments, past: pastAppointments, loading: appointmentsLoading, error: appointmentsError } = useSelector((state) => state.appointments);

  const [activeTab, setActiveTab] = useState('upcoming');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    type: '',
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });

  
  useEffect(() => {
    dispatch(fetchDoctorsThunk());
    dispatch(fetchAppointmentsThunk());
  }, [dispatch]);


  const rangerColors = {
    red: '#FF0000',
    blue: '#0066FF',
    yellow: '#FFD700',
    black: '#000000',
    pink: '#FF69B4',
    mercury: '#C0C0C0'
  };

  const currentColor = rangerColors[selectedRanger] || rangerColors.red;

  // Mock data
  // const upcomingAppointments = [
  //   { 
  //     id: 1, 
  //     type: 'Annual Check-up', 
  //     doctor: 'Dr. Andrew Hartford', 
  //     specialty: 'General Practitioner',
  //     date: '2025-12-10', 
  //     time: '10:00 AM', 
  //     status: 'confirmed',
  //     location: 'Operation Overdrive Medical Bay',
  //     notes: 'Bring previous health records'
  //   },
  //   { 
  //     id: 2, 
  //     type: 'Physical Therapy', 
  //     doctor: 'Dr. Spencer', 
  //     specialty: 'Sports Medicine',
  //     date: '2025-12-15', 
  //     time: '02:00 PM', 
  //     status: 'pending',
  //     location: 'Rehabilitation Center',
  //     notes: 'Post-mission recovery session'
  //   },
  //   { 
  //     id: 3, 
  //     type: 'Morphin Grid Analysis', 
  //     doctor: 'Dr. Katherine Manx', 
  //     specialty: 'Ranger Specialist',
  //     date: '2025-12-18', 
  //     time: '09:30 AM', 
  //     status: 'confirmed',
  //     location: 'Zord Command Center',
  //     notes: 'Energy level assessment'
  //   }
  // ];

  // const pastAppointments = [
  //   { 
  //     id: 4, 
  //     type: 'Injury Assessment', 
  //     doctor: 'Dr. Hartford', 
  //     specialty: 'Emergency Medicine',
  //     date: '2025-11-28', 
  //     time: '03:00 PM', 
  //     status: 'completed',
  //     location: 'Medical Bay',
  //     notes: 'Combat training injury - fully recovered'
  //   },
  //   { 
  //     id: 5, 
  //     type: 'Routine Blood Work', 
  //     doctor: 'Dr. Spencer', 
  //     specialty: 'Laboratory',
  //     date: '2025-11-15', 
  //     time: '11:00 AM', 
  //     status: 'completed',
  //     location: 'Medical Laboratory',
  //     notes: 'All results normal'
  //   }
  // ];

  // const doctors = [
  //   { id: 1, name: 'Dr. Andrew Hartford', specialty: 'General Practitioner' },
  //   { id: 2, name: 'Dr. Spencer', specialty: 'Sports Medicine' },
  //   { id: 3, name: 'Dr. Katherine Manx', specialty: 'Ranger Specialist' },
  //   { id: 4, name: 'Dr. William Mitchell', specialty: 'Psychiatry' }
  // ];

  const appointmentTypes = [
    'Annual Check-up',
    'Physical Therapy',
    'Mental Health Consultation',
    'Morphin Grid Analysis',
    'Injury Assessment',
    'Routine Blood Work',
    'Emergency Visit'
  ];

  if (appointmentsLoading) return <p>Loading...</p>;
  if (appointmentsError) return <p>Error: {appointmentsError}</p>;

  const handleBookAppointment = async(e) => {
    e.preventDefault();

    // Validation
    if (!bookingData.type) {
      toast.error('📋 Please select an appointment type!');
      return;
    }

    if (!bookingData.doctor) {
      toast.error('👨‍⚕️ Please select a doctor!');
      return;
    }

    if (!bookingData.date) {
      toast.error('📅 Please select a date!');
      return;
    }

    if (!bookingData.time) {
      toast.error('⏰ Please select a time!');
      return;
    }

    if (!bookingData.reason.trim()) {
      toast.error('📝 Please provide a reason for visit!');
      return;
    }

    // Handle booking logic here
    toast.loading('Sending appointment request...', { id: 'booking' });
    
    // Call API
    try{
      await dispatch(addAppointmentThunk(bookingData)).unwrap();
      
      setTimeout(() => {
        toast.success('Appointment booking request sent! You will receive confirmation shortly.', {
          id: 'booking',
          duration: 4000,
          icon: '📅',
          style: {
            border: '2px solid #00ff00',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
          }
        });
        
        setShowBookingForm(false);
        setBookingData({
          type: '',
          doctor: '',
          date: '',
          time: '',
          reason: ''
        });
      }, 1500);
    }catch (error) {
      toast.error(error.message || "Something went wrong!", {
        id: "booking",
      });
    }
    
  };

  const handleCancel = async (id) => {
    // alert(id);
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    toast.loading("Cancelling appointment...", { id: "cancel" });

    try {
      await dispatch(updateAppointmentThunk({ 
        id, 
        data: { status: "cancelled" } 
      })).unwrap();


      toast.success("Appointment cancelled successfully!", { id: "cancel" });
    } catch (err) {
      toast.error(err?.message || "Failed to cancel appointment.", { id: "cancel" });
    }
  };

  return (
    <div className="appointments-page" data-ranger={selectedRanger}>
      {/* Backgrounds */}
      <div className="space-background"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Header */}
      <div className="appointments-header">
        <button className="back-to-dashboard" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <div className="header-content">
          <h1 className="page-title">APPOINTMENT CENTER</h1>
          <p className="page-subtitle">OPERATION OVERDRIVE - MEDICAL SCHEDULING</p>
        </div>
        <button className="book-new-btn" onClick={() => setShowBookingForm(true)} style={{ borderColor: currentColor, color: "white" }}>
          Book New Appointment
        </button>
      </div>

      {/* Main Content */}
      <div className="appointments-container">
        
        {/* Tabs */}
        <div className="appointment-tabs">
          <button 
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
            style={activeTab === 'upcoming' ? { borderBottomColor: currentColor, color: currentColor } : {}}
          >
            <span className="tab-icon">📅</span>
            <span className="tab-label">Upcoming Appointments</span>
            <span className="tab-count">{upcomingAppointments.length}</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
            style={activeTab === 'past' ? { borderBottomColor: currentColor, color: currentColor } : {}}
          >
            <span className="tab-icon">📋</span>
            <span className="tab-label">Past Appointments</span>
            <span className="tab-count">{pastAppointments.length}</span>
          </button>
        </div>

        {/* Appointments List */}
        <div className="appointments-content">
          {activeTab === 'upcoming' ? (
            <div className="appointments-grid">
              {upcomingAppointments.map(appointment => (
                <div key={appointment._id} className="appointment-detail-card">
                  <div className="card-header">
                    <div className="appointment-date-large">
                      <div className="day">{new Date(appointment.date).getDate()}</div>
                      <div className="month">{new Date(appointment.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                    </div>
                    <div className={`status-badge status-${appointment.status}`}>
                      {appointment.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h3 className="appointment-type">{appointment.type}</h3>
                    <div className="appointment-info">
                      <div className="info-row">
                        <span className="info-icon">👨‍⚕️</span>
                        <div className="info-text">
                          <div className="info-label">Doctor</div>
                          <div className="info-value">{appointment.doctor.name}</div>
                          <div className="info-sub">{appointment.doctor.specialty}</div>
                        </div>
                      </div>
                      <div className="info-row">
                        <span className="info-icon">⏰</span>
                        <div className="info-text">
                          <div className="info-label">Time</div>
                          <div className="info-value">{appointment.time}</div>
                        </div>
                      </div>
                      <div className="info-row">
                        <span className="info-icon">📍</span>
                        <div className="info-text">
                          <div className="info-label">Location</div>
                          <div className="info-value">{appointment.doctor.location}</div>
                        </div>
                      </div>
                      {appointment.notes && (
                        <div className="info-row notes-row">
                          <span className="info-icon">📝</span>
                          <div className="info-text">
                            <div className="info-label">Notes</div>
                            <div className="info-value">{appointment.notes}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-footer">
                    <button className="action-link chat-btn">
                      💬 Chat with Doctor
                    </button>
                    <button className="action-link call-btn">
                      📞 Schedule Call
                    </button>
                    <button className="action-link cancel-btn" style={{padding: "7px 30px"}} onClick={() => handleCancel(appointment._id)}>
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="appointments-grid">
              {pastAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-detail-card past">
                  <div className="card-header">
                    <div className="appointment-date-large">
                      <div className="day">{new Date(appointment.date).getDate()}</div>
                      <div className="month">{new Date(appointment.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                    </div>
                    <div className={`status-badge status-${appointment.status}`}>
                      {appointment.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h3 className="appointment-type">{appointment.type}</h3>
                    <div className="appointment-info">
                      <div className="info-row">
                        <span className="info-icon">👨‍⚕️</span>
                        <div className="info-text">
                          <div className="info-label">Doctor</div>
                          <div className="info-value">{appointment.doctor.name}</div>
                          <div className="info-sub">{appointment.doctor.specialty}</div>
                        </div>
                      </div>
                      <div className="info-row">
                        <span className="info-icon">⏰</span>
                        <div className="info-text">
                          <div className="info-label">Time</div>
                          <div className="info-value">{appointment.time}</div>
                        </div>
                      </div>
                      {appointment.notes && (
                        <div className="info-row notes-row">
                          <span className="info-icon">📝</span>
                          <div className="info-text">
                            <div className="info-label">Notes</div>
                            <div className="info-value">{appointment.notes}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                    
                  {
                    appointment.status !== 'cancelled' && (
                  <div className="card-footer">
                    <button className="action-link">View Summary</button>
                    <button className="action-link">Book Follow-up</button>
                  </div>
                    )
                  }
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="booking-modal-overlay" onClick={() => setShowBookingForm(false)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>BOOK NEW APPOINTMENT</h2>
              <button className="close-modal" onClick={() => setShowBookingForm(false)}>✕</button>
            </div>
            
            <form onSubmit={handleBookAppointment} className="booking-form">
              <div className="form-group">
                <label>Appointment Type</label>
                <select 
                  required 
                  value={bookingData.type}
                  onChange={(e) => setBookingData({...bookingData, type: e.target.value})}
                >
                  <option value="">Select appointment type</option>
                  {appointmentTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Doctor</label>
                <select 
                  required
                  value={bookingData.doctor}
                  onChange={(e) => setBookingData({...bookingData, doctor: e.target.value})}
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input 
                    type="date" 
                    required 
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Time</label>
                  <input 
                    type="time" 
                    required
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason for Visit</label>
                <textarea 
                  rows="4" 
                  placeholder="Describe your symptoms or reason for the appointment..." 
                  required
                  value={bookingData.reason}
                  onChange={(e) => setBookingData({...bookingData, reason: e.target.value})}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Additional Notes (Optional)</label>
                <textarea 
                  rows="3" 
                  placeholder="Any specific requirements or information..."
                  value={bookingData.notes || ''}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-form-btn" onClick={() => setShowBookingForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-form-btn" style={{ background: currentColor }}>
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Appointments;

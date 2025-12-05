/**
 * MorphSync Med-Station - Main Application Component
 * Operation Overdrive Medical Tracking System
 */

// ==================== React & Router Imports ====================
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Welcome from './components/Welcome.jsx';
import DoctorPage from './components/DoctorPage.jsx';
import ZordonPage from './components/ZordonPage.jsx';
import RangerDashboard from './components/RangerDashboard';
import Appointments from './components/Appointments';
import Calendar from './components/Calendar';
import Symptoms from './components/Symptoms';
import SymptomChecker from './components/SymptomChecker';
import RangerBot from './components/RangerBot';
import Capsules from './components/Capsules';
import Profile from './components/Profile';
import HealthTimeline from './components/HealthTimeline';
import WeeklyInsights from './components/WeeklyInsights';

// ==================== Helper Components ====================

/**
 * LoginPage - Wrapper component for Login/Register flow
 * Handles navigation between login and registration forms
 */
function LoginPage({ onLoginSuccess, showRegister, onRegister, onBackToLogin }) {
  const navigate = useNavigate();

  const handleLoginSuccess = (rangerData) => {
    onLoginSuccess(rangerData);
    navigate('/dashboard');
  };

  return showRegister ? (
    <Register onBack={onBackToLogin} />
  ) : (
    <Login onLoginSuccess={handleLoginSuccess} onRegister={onRegister} />
  );
}

/**
 * ProtectedRoute - Wrapper for authenticated routes
 * Redirects to login if user is not authenticated
 */
function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// ==================== Main App Component ====================

function App() {
  // ==================== State Management ====================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedRanger, setSelectedRanger] = useState('red');

  // ==================== Authentication Handlers ====================
  const handleLoginSuccess = (rangerData) => {
    setIsAuthenticated(true);
    if (rangerData?.rangerId) {
      setSelectedRanger(rangerData.rangerId);
    }
  };

  const handleRegister = () => {
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  // ==================== Render ====================
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ==================== Public Routes ==================== */}
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/doctor" element={<DoctorPage />} />
          <Route path="/zordon" element={<ZordonPage />} />

          {/* ==================== Authentication Routes ==================== */}
          <Route 
            path="/login" 
            element={
              <LoginPage 
                onLoginSuccess={handleLoginSuccess}
                showRegister={showRegister}
                onRegister={handleRegister}
                onBackToLogin={handleBackToLogin}
              />
            } 
          />

          {/* ==================== Protected Routes ==================== */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <RangerDashboard selectedRanger={selectedRanger} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/appointments" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Appointments selectedRanger={selectedRanger} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Calendar selectedRanger={selectedRanger} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/symptoms" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Symptoms selectedRanger={selectedRanger} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/symptom-checker" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SymptomChecker ranger={selectedRanger} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/rangerbot" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <RangerBot ranger={selectedRanger} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/capsules" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Capsules ranger={selectedRanger} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile ranger={selectedRanger} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/timeline" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <HealthTimeline selectedRanger={selectedRanger} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/insights" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <WeeklyInsights selectedRanger={selectedRanger} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

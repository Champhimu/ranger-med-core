/**
 * MorphSync Med-Station - Main Application Component
 * Operation Overdrive Medical Tracking System
 */

// ==================== React & Router Imports ====================
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ==================== Components ====================

// ==================== Ranger Components ====================
import Login from "./components/ranger/Login.jsx";
import Register from "./components/ranger/Register.jsx";
import RangerDashboard from "./components/ranger/RangerDashboard";

import Appointments from "./components/ranger/Appointments";
import Calendar from "./components/ranger/Calendar";

import Symptoms from './components/ranger/Symptoms';
import SymptomChecker from "./components/ranger/SymptomChecker";
import RangerBot from "./components/ranger/RangerBot";
import Capsules from "./components/ranger/Capsules";
import Profile from "./components/ranger/Profile";
import HealthTimeline from "./components/ranger/HealthTimeline";
import WeeklyInsights from "./components/ranger/WeeklyInsights";

// ==================== Doctor Components ====================
import DoctorLogin from "./components/doctor/DoctorLogin.jsx";
import DoctorDashboard from './components/doctor/DoctorDashboard.jsx';

// ==================== Zordon Components ====================
import ZordonLogin from "./components/zordon/ZordonLogin.jsx";
import ZordonDashboard from "./components/zordon/ZordonDashboard.jsx";
import UserManagement from "./components/zordon/UserManagement.jsx";
import PatientManagement from "./components/zordon/PatientManagement.jsx";
import DoctorManagement from './components/zordon/DoctorManagement.jsx';

// ==================== Shared Components ====================
import Welcome from "./components/shared/Welcome.jsx";

// ==================== Helper Components ====================

/**
 * LoginPage - Handles switching between Login and Registration UI
 */
function LoginPage({ onLoginSuccess, showRegister, onRegister, onBackToLogin }) {
  const navigate = useNavigate();

  const handleLoginSuccess = (rangerData) => {
    onLoginSuccess(rangerData);
    navigate("/dashboard");
  };

  return showRegister ? (
    <Register onBack={onBackToLogin} />
  ) : (
    <Login onLoginSuccess={handleLoginSuccess} onRegister={onRegister} />
  );
}

/**
 * ProtectedRoute - Token-based protection for ranger routes
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

/**
 * DoctorProtectedRoute - Separate authentication for doctors
 */
function DoctorProtectedRoute({ children }) {
  const doctorAuth = localStorage.getItem("doctorAuth");
  if (!doctorAuth) return <Navigate to="/doctor/login" replace />;
  return children;
}

/**
 * LoggedInRedirect - If already logged in, skip login page
 */
function LoggedInRedirect({ children }) {
  const token = localStorage.getItem("accessToken");
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

// ==================== Main Application ====================

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [selectedRanger, setSelectedRanger] = useState("red");

  const handleLoginSuccess = (rangerData) => {
    if (rangerData?.rangerId) {
      setSelectedRanger(rangerData.rangerId);
    }
  };

  return (
    <Router>
      <div className="App">
        {/* ==================== Toast System ==================== */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1a1f3a",
              color: "#fff",
              border: "1px solid #00ffff",
              borderRadius: "10px",
              padding: "16px",
              fontSize: "14px",
              fontFamily: "Orbitron, monospace",
            },
            success: {
              duration: 3000,
              iconTheme: { primary: "#00ff00", secondary: "#000" },
              style: { border: "1px solid #00ff00" },
            },
            error: {
              duration: 4000,
              iconTheme: { primary: "#ff0000", secondary: "#fff" },
              style: { border: "1px solid #ff0000" },
            },
            loading: {
              iconTheme: { primary: "#00ffff", secondary: "#000" },
            },
          }}
        />

        {/* ==================== Routes ==================== */}
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/zordon" element={<ZordonLogin />} />
          <Route path="/zordon/dashboard" element={<ZordonDashboard />} />
          <Route path="/zordon/users" element={<UserManagement />} />
          <Route path="/zordon/users/patients" element={<PatientManagement />} />
          <Route path="/zordon/users/doctors" element={<DoctorManagement />} />

          {/* Doctor Authentication */}
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route
            path="/doctor/dashboard"
            element={
              <DoctorProtectedRoute>
                <DoctorDashboard />
              </DoctorProtectedRoute>
            }
          />

          {/* Login / Register */}
          <Route
            path="/login"
            element={
              <LoggedInRedirect>
                <LoginPage
                  onLoginSuccess={handleLoginSuccess}
                  showRegister={showRegister}
                  onRegister={() => setShowRegister(true)}
                  onBackToLogin={() => setShowRegister(false)}
                />
              </LoggedInRedirect>
            }
          />

          {/* Ranger Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RangerDashboard selectedRanger={selectedRanger} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments selectedRanger={selectedRanger} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar selectedRanger={selectedRanger} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/symptoms"
            element={
              <ProtectedRoute>
                <Symptoms selectedRanger={selectedRanger} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/symptom-checker"
            element={
              <ProtectedRoute>
                <SymptomChecker ranger={selectedRanger} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rangerbot"
            element={
              <ProtectedRoute>
                <RangerBot ranger={selectedRanger} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/capsules"
            element={
              <ProtectedRoute>
                <Capsules ranger={selectedRanger} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile ranger={selectedRanger} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/timeline"
            element={
              <ProtectedRoute>
                <HealthTimeline selectedRanger={selectedRanger} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/insights"
            element={
              <ProtectedRoute>
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

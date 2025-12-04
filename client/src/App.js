import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Welcome from './components/Welcome';
import DoctorPage from './components/DoctorPage';
import ZordonPage from './components/ZordonPage';
import RangerDashboard from './components/RangerDashboard';

function LoginPage({ onLoginSuccess, showRegister, onRegister, onBackToLogin }) {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    onLoginSuccess();
    navigate('/dashboard');
  };

  return showRegister ? (
    <Register onBack={onBackToLogin} />
  ) : (
    <Login onLoginSuccess={handleLoginSuccess} onRegister={onRegister} />
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleRegister = () => {
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
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
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/doctor" element={<DoctorPage />} />
          <Route path="/zordon" element={<ZordonPage />} />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <RangerDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Welcome from './components/Welcome.jsx';
import DoctorPage from './components/DoctorPage.jsx';
import ZordonPage from './components/ZordonPage.jsx';

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
                <div style={{ 
                  height: '100vh', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
                  color: '#00ffff',
                  fontFamily: 'Arial, sans-serif'
                }}>
                  <h1 style={{ fontSize: '3rem', textShadow: '0 0 20px #00ffff', marginBottom: '1rem' }}>
                    🤖 MORPHSYNC MED-STATION DASHBOARD 🚀
                  </h1>
                  <p style={{ fontSize: '1.5rem', textShadow: '0 0 10px #00ffff' }}>
                    Welcome, Ranger! You are now logged in.
                  </p>
                  <p style={{ marginTop: '2rem', opacity: 0.8 }}>
                    OVERDRIVE STATUS: ACTIVE
                  </p>
                </div>
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

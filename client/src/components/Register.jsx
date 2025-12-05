import { useState } from 'react';
import toast from 'react-hot-toast';
import './Register.css';

function Register({ onBack }) {
  const [form, setForm] = useState({
    fullName: '',
    operatorId: '',
    email: '',
    accessCode: '',
    confirmCode: '',
    rangerDesignation: 'red'
  });
  const [selectedRanger, setSelectedRanger] = useState('red');
  const [isRegistering, setIsRegistering] = useState(false);

  const rangers = [
    { id: 'red', name: 'RED RANGER', color: '#ff0000', vehicle: 'Drive Max Megazord', power: 'Leadership' },
    { id: 'blue', name: 'BLUE RANGER', color: '#0066ff', vehicle: 'Gyro Driver', power: 'Strategy' },
    { id: 'yellow', name: 'YELLOW RANGER', color: '#ffcc00', vehicle: 'Dozer Driver', power: 'Strength' },
    { id: 'pink', name: 'PINK RANGER', color: '#ff69b4', vehicle: 'Sub Driver', power: 'Agility' },
    { id: 'black', name: 'BLACK RANGER', color: '#666666', vehicle: 'Drill Driver', power: 'Precision' },
    { id: 'mercury', name: 'MERCURY RANGER', color: '#c0c0c0', vehicle: 'Flash Point Megazord', power: 'Speed' }
  ];

  const currentRanger = rangers.find(r => r.id === selectedRanger);

  const validateForm = () => {
    if (!form.fullName.trim()) {
      toast.error('⚠️ Full Name is required!');
      return false;
    }

    if (form.fullName.trim().length < 3) {
      toast.error('⚠️ Full Name must be at least 3 characters!');
      return false;
    }

    if (!form.operatorId.trim()) {
      toast.error('⚠️ Operator ID is required!');
      return false;
    }

    if (form.operatorId.length < 3) {
      toast.error('⚠️ Operator ID must be at least 3 characters!');
      return false;
    }

    if (!form.email.trim()) {
      toast.error('⚠️ Email is required!');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('⚠️ Please enter a valid email address!');
      return false;
    }

    if (!form.accessCode.trim()) {
      toast.error('⚠️ Access Code is required!');
      return false;
    }

    if (form.accessCode.length < 6) {
      toast.error('⚠️ Access Code must be at least 6 characters!');
      return false;
    }

    if (!form.confirmCode.trim()) {
      toast.error('⚠️ Please confirm your Access Code!');
      return false;
    }

    if (form.accessCode !== form.confirmCode) {
      toast.error('⚠️ Access Codes do not match!', {
        style: {
          border: '2px solid #ff0000',
          boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
        }
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsRegistering(true);
    toast.loading('🔄 Initializing Ranger Registration...', { id: 'register' });
    
    setTimeout(() => {
      setIsRegistering(false);
      toast.success(`✨ Welcome to Operation Overdrive, ${currentRanger.name}!`, {
        id: 'register',
        duration: 3000,
        style: {
          border: `2px solid ${currentRanger.color}`,
          boxShadow: `0 0 30px ${currentRanger.color}`,
        }
      });
      
      setTimeout(() => {
        onBack?.();
      }, 1000);
    }, 2000);
  };

  const handleRangerSelect = (rangerId) => {
    setSelectedRanger(rangerId);
    setForm({ ...form, rangerDesignation: rangerId });
  };

  const Heartbeat = ({ delay = 0 }) => (
    <svg className="heartbeat" viewBox="0 0 100 30" style={{ animationDelay: `${delay}s` }}>
      <polyline points="0,15 20,15 25,5 30,25 35,10 40,20 45,15 100,15" stroke="var(--ranger-glow)" strokeWidth="2" fill="none" />
    </svg>
  );

  return (
    <div className="register-container" data-ranger={selectedRanger}>
      <div className="space-background">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <div className="helmet-background">
        <div className="helmet helmet-1"></div>
        <div className="helmet helmet-2"></div>
        <div className="helmet helmet-3"></div>
      </div>

      <div className="planet-container">
        <div className="planet">
          <div className="planet-glow"></div>
        </div>
      </div>

      <div className="power-rangers-header">
        <div className="pr-logo">
          <div className="pr-power">POWER</div>
          <div className="pr-rangers">RANGERS</div>
        </div>
      </div>

      <div className="recruitment-subtitle">OPERATION OVERDRIVE RECRUITMENT</div>

      <div className="ranger-selector">
        {rangers.map((ranger) => (
          <div
            key={ranger.id}
            className={`ranger-badge ${selectedRanger === ranger.id ? 'active' : ''}`}
            style={{ '--ranger-color': ranger.color }}
            onClick={() => handleRangerSelect(ranger.id)}
          >
            <div className="badge-inner"></div>
          </div>
        ))}
      </div>

      {isRegistering && (
        <div className="morph-overlay">
          <div className="morph-flash"></div>
          <div className="morph-text">RANGER ACTIVATED!</div>
          <div className="ranger-symbol"></div>
        </div>
      )}

      <div className="hud-panel hud-left">
        <div className="panel-header">SYSTEM DIAGNOSTICS</div>
        <div className="vital-chart">
          <Heartbeat delay={0} />
          <Heartbeat delay={0.5} />
          <Heartbeat delay={1} />
        </div>
        <div className="vital-stats">
          <div className="stat-item">
            <span className="stat-label">NETWORK</span>
            <span className="stat-value" style={{ color: currentRanger.color, textShadow: `0 0 8px ${currentRanger.color}` }}>
              SECURE
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">ENCRYPTION</span>
            <span className="stat-value" style={{ color: currentRanger.color, textShadow: `0 0 8px ${currentRanger.color}` }}>
              ACTIVE
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">STATUS</span>
            <span className="stat-value" style={{ color: currentRanger.color, textShadow: `0 0 8px ${currentRanger.color}` }}>
              READY
            </span>
          </div>
        </div>
      </div>

      <div className="hud-panel hud-right">
        <div className="panel-header">RANGER DESIGNATION</div>
        <div className="power-circle">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,255,255,0.1)" strokeWidth="8" />
            <circle className="power-progress" cx="60" cy="60" r="54" fill="none" stroke="var(--ranger-glow)" strokeWidth="8" strokeDasharray="339.292" strokeDashoffset="0" />
          </svg>
          <div className="power-text" style={{ color: currentRanger.color, textShadow: `0 0 10px ${currentRanger.color}` }}>100%</div>
        </div>
        <div className="power-label" style={{ color: currentRanger.color, textShadow: `0 0 10px ${currentRanger.color}` }}>
          {currentRanger?.power.toUpperCase()} CORE
        </div>
      </div>

      <div className="register-panel">
        <div className="panel-corners">
          {['tl', 'tr', 'bl', 'br'].map(pos => <div key={pos} className={`corner corner-${pos}`}></div>)}
        </div>
        <div className="panel-glow"></div>

        <div className="register-header">
          <h1 className="register-title">RECRUIT</h1>
          <p className="register-subtitle">OPERATOR REGISTRATION</p>
          <div className="ranger-info" style={{ color: currentRanger?.color }}>
            <span>{currentRanger?.name}</span>
            <span className="vehicle-name">{currentRanger?.vehicle}</span>
          </div>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">FULL NAME</label>
            <input
              id="fullName"
              className="cyber-input"
              type="text"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="operatorId">OPERATOR ID</label>
            <input
              id="operatorId"
              className="cyber-input"
              type="text"
              placeholder="Create operator ID"
              value={form.operatorId}
              onChange={(e) => setForm({ ...form, operatorId: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">COMM LINK (EMAIL)</label>
            <input
              id="email"
              className="cyber-input"
              type="email"
              placeholder="your.email@overdrive.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="accessCode">ACCESS CODE</label>
            <input
              id="accessCode"
              className="cyber-input"
              type="password"
              placeholder="Create secure access code"
              value={form.accessCode}
              onChange={(e) => setForm({ ...form, accessCode: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmCode">CONFIRM ACCESS CODE</label>
            <input
              id="confirmCode"
              className="cyber-input"
              type="password"
              placeholder="Re-enter access code"
              value={form.confirmCode}
              onChange={(e) => setForm({ ...form, confirmCode: e.target.value })}
              required
            />
          </div>

          <button type="submit" className={`register-button ${isRegistering ? 'morph-button' : ''}`}>
            <span className="button-text">{isRegistering ? 'ACTIVATING...' : 'ACTIVATE RANGER'}</span>
            <div className="button-shine"></div>
          </button>
        </form>

        <div className="back-link">
          <span>Already registered?</span>
          <a href="#" onClick={(e) => { e.preventDefault(); onBack?.(); }}>RETURN TO LOGIN</a>
        </div>
      </div>

      <div className="bottom-hud">
        <div className="bottom-panel">
          <div className="mini-display">
            {[...Array(4)].map((_, i) => <div key={i} className="line"></div>)}
          </div>
        </div>
        <div className="hex-button">
          <div className="hexagon">
            <span>RECRUIT</span>
          </div>
        </div>
        <div className="bottom-panel">
          <div className="radar-display">
            <div className="radar-ping"></div>
          </div>
        </div>
      </div>

      <div className="cockpit-frame"></div>
    </div>
  );
}

export default Register;

import { useState } from 'react'
import './Login.css'

function Login({ onLoginSuccess, onRegister }) {
  const [form, setForm] = useState({ operatorId: '', accessCode: '' })
  const [selectedRanger, setSelectedRanger] = useState('red')
  const [isMorphing, setIsMorphing] = useState(false)

  const rangers = [
    { id: 'red', name: 'Red Overdrive Ranger', color: '#ff0000', power: 'DriveMax Megazord' },
    { id: 'blue', name: 'Blue Overdrive Ranger', color: '#0066ff', power: 'Hovertek Cycle' },
    { id: 'yellow', name: 'Yellow Overdrive Ranger', color: '#ffcc00', power: 'Gyro Driver' },
    { id: 'pink', name: 'Pink Overdrive Ranger', color: '#ff69b4', power: 'Cement Driver' },
    { id: 'black', name: 'Black Overdrive Ranger', color: '#1a1a1a', power: 'Drill Driver' },
    { id: 'mercury', name: 'Mercury Ranger', color: '#c0c0c0', power: 'Flash Point Megazord' }
  ]

  const currentRanger = rangers.find(r => r.id === selectedRanger)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.operatorId && form.accessCode) {
      setIsMorphing(true)
      setTimeout(() => {
        alert(`OVERDRIVE ACCELERATE! ${currentRanger.name} - KICK INTO OVERDRIVE!`)
        onLoginSuccess?.({ 
          rangerId: selectedRanger, 
          rangerName: currentRanger.name,
          rangerColor: currentRanger.color 
        })
      }, 2000)
    } else {
      alert('Please enter both Operator ID and Access Code')
    }
  }

  const Heartbeat = ({ delay = 0 }) => (
    <svg className="heartbeat" viewBox="0 0 200 60" style={{animationDelay: `${delay}s`}}>
      <polyline fill="none" stroke="var(--ranger-glow)" strokeWidth="2"
        points="0,30 10,30 15,15 20,45 25,20 30,30 200,30" />
    </svg>
  )

  return (
    <div className={`login-container ${isMorphing ? 'morphing' : ''}`} data-ranger={selectedRanger}>
      {isMorphing && (
        <div className="morph-overlay">
          <div className="morph-flash"></div>
          <div className="morph-text">OVERDRIVE ACCELERATE!</div>
          <div className="ranger-symbol"></div>
        </div>
      )}

      <div className="space-background">
        {[...Array(3)].map((_, i) => <div key={i} className={`stars stars${i+1}`} />)}
      </div>

      <div className="helmet-background">
        {[...Array(3)].map((_, i) => <div key={i} className={`helmet helmet-${i+1}`} />)}
      </div>

      <div className="planet-container">
        <div className="planet"></div>
        <div className="planet-glow"></div>
      </div>

      <div className="power-rangers-header">
        <div className="pr-logo">
          <span className="pr-power">OPERATION</span>
          <span className="pr-rangers">OVERDRIVE</span>
        </div>
        <div className="pr-subtitle">MORPHSYNC MED-STATION</div>
      </div>

      <div className="ranger-selector">
        {rangers.map(r => (
          <div key={r.id} className={`ranger-badge ${selectedRanger === r.id ? 'active' : ''}`}
            style={{ '--ranger-color': r.color }} onClick={() => setSelectedRanger(r.id)}>
            <div className="badge-inner"></div>
          </div>
        ))}
      </div>

      <div className="hud-panel hud-left">
        <div className="panel-header">RANGER STATUS</div>
        <div className="vital-chart">
          <Heartbeat />
          <Heartbeat delay={0.5} />
        </div>
        <div className="vital-stats">
          <div className="stat-item">
            <span className="stat-label">RANGER</span>
            <span className="stat-value" style={{ color: currentRanger.color, textShadow: `0 0 8px ${currentRanger.color}` }}>
              {currentRanger.name.toUpperCase()}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">VEHICLE</span>
            <span className="stat-value" style={{ color: currentRanger.color, textShadow: `0 0 8px ${currentRanger.color}` }}>
              {currentRanger.power.toUpperCase()}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">OVERDRIVE ENERGY</span>
            <span className="stat-value" style={{ color: currentRanger.color, textShadow: `0 0 8px ${currentRanger.color}` }}>
              100%
            </span>
          </div>
        </div>
      </div>

      <div className="hud-panel hud-right">
        <div className="panel-header">RANGER POWER</div>
        <div className="power-circle">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#1a3a4a" strokeWidth="8" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--ranger-glow)" 
              strokeWidth="8" strokeDasharray="314" strokeDashoffset="125" 
              strokeLinecap="round" className="power-progress" />
          </svg>
          <div className="power-text">100%</div>
        </div>
        <div className="power-bars">
          <div className="bar-row">
            {[70, 85, 60, 90, 75, 80, 65].map((h, i) => (
              <div key={i} className="bar ranger-bar" style={{height: `${h}%`}} />
            ))}
          </div>
        </div>
        <div className="power-label">HEALTH TRACKER STATUS</div>
      </div>

      <div className="login-panel">
        <div className="panel-corners">
          {['tl', 'tr', 'bl', 'br'].map(pos => <div key={pos} className={`corner corner-${pos}`} />)}
        </div>

        <div className="login-header">
          <h1 className="login-title">OVERDRIVE</h1>
          <p className="login-subtitle">COMMAND CENTER</p>
          <div className="ranger-info">
            <span style={{ color: currentRanger.color }}>{currentRanger.name}</span>
            <span className="zord-name">// {currentRanger.power}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {[
            { id: 'operatorId', label: 'OPERATOR ID', type: 'text', placeholder: 'Enter Operator ID' },
            { id: 'accessCode', label: 'ACCESS CODE', type: 'password', placeholder: 'Enter Access Code' }
          ].map(field => (
            <div key={field.id} className="form-group">
              <label htmlFor={field.id}>{field.label}</label>
              <input type={field.type} id={field.id} 
                value={form[field.id]} 
                onChange={(e) => setForm({...form, [field.id]: e.target.value})}
                className="cyber-input" placeholder={field.placeholder} autoComplete="off" />
            </div>
          ))}

          <button type="submit" className="login-button morph-button">
            <span className="button-text">OVERDRIVE ACCELERATE!</span>
            <span className="button-shine"></span>
          </button>

          <div className="register-link">
            <span>New Ranger? </span>
            <a href="#" onClick={(e) => { e.preventDefault(); onRegister?.(); }}>
              REGISTER HERE
            </a>
          </div>
        </form>
        <div className="panel-glow"></div>
      </div>

      <div className="bottom-hud">
        <div className="bottom-panel">
          <div className="mini-display">
            {[...Array(4)].map((_, i) => <div key={i} className="line" />)}
          </div>
        </div>
        <div className="bottom-center">
          <div className="hex-button">
            <div className="hexagon"><span>LOGIN</span></div>
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
  )
}

export default Login

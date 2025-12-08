import { useState } from "react";
import toast from "react-hot-toast";
import "./Register.css";
import { registerRanger } from "../../api/auth";

function Register({ onBack }) {
  const [form, setForm] = useState({
    fullName: "",
    operatorId: "",
    email: "",
    accessCode: "",
    confirmCode: "",
    rangerDesignation: "red",
  });
  const [selectedRanger, setSelectedRanger] = useState("red");
  const [isRegistering, setIsRegistering] = useState(false);

  const rangers = [
    { id: "red", name: "RED RANGER", color: "#ff0000", vehicle: "Drive Max Megazord", power: "Leadership" },
    { id: "blue", name: "BLUE RANGER", color: "#0066ff", vehicle: "Gyro Driver", power: "Strategy" },
    { id: "yellow", name: "YELLOW RANGER", color: "#ffcc00", vehicle: "Dozer Driver", power: "Strength" },
    { id: "pink", name: "PINK RANGER", color: "#ff69b4", vehicle: "Sub Driver", power: "Agility" },
    { id: "black", name: "BLACK RANGER", color: "#666666", vehicle: "Drill Driver", power: "Precision" },
    { id: "mercury", name: "MERCURY RANGER", color: "#c0c0c0", vehicle: "Flash Point Megazord", power: "Speed" },
  ];

  const currentRanger = rangers.find((r) => r.id === selectedRanger);

  // Validation
  const validateForm = () => {
    if (!form.fullName.trim()) {
      toast.error('Full Name is required!');
      return false;
    }

    if (form.fullName.trim().length < 3) {
      toast.error('Full Name must be at least 3 characters!');
      return false;
    }

    if (!form.operatorId.trim()) {
      toast.error('Operator ID is required!');
      return false;
    }

    if (form.operatorId.length < 3) {
      toast.error('Operator ID must be at least 3 characters!');
      return false;
    }

    if (!form.email.trim()) {
      toast.error('Email is required!');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email address!');
      return false;
    }

    if (!form.accessCode.trim()) {
      toast.error('Access Code is required!');
      return false;
    }

    if (form.accessCode.length < 6) {
      toast.error('Access Code must be at least 6 characters!');
      return false;
    }

    if (!form.confirmCode.trim()) {
      toast.error('Please confirm your Access Code!');
      return false;
    }

    if (form.accessCode !== form.confirmCode) {
      toast.error('Access Codes do not match!', {
        style: {
          border: '2px solid #ff0000',
          boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
        }
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsRegistering(true);

    toast.loading("Registering Ranger...", { id: "register" });

    const payload = {
      name: form.fullName,
      username: form.operatorId,
      email: form.email,
      password: form.accessCode,
      role: "ranger",
    };

    try {
      const res = await registerRanger(payload);

      if (res.error || res.message === "Email already exists" || res.message === "Username already exists") {
        setIsRegistering(false);
        return toast.error(res.error || res.message, { id: "register" });
      }

      // SUCCESS — show morph immediately, no waiting
      toast.success(`Welcome to Operation Overdrive, ${currentRanger.name}!`, {
        id: "register",
        style: {
          border: `2px solid ${currentRanger.color}`,
          boxShadow: `0 0 30px ${currentRanger.color}`,
        },
      });

      // Immediately stop animation (API already took time)
      setIsRegistering(false);

      // Immediately go back to login
      onBack?.();
    } catch (err) {
      console.error(err);
      setIsRegistering(false);
      toast.error("Something went wrong!");
    }
  };

  const handleRangerSelect = (id) => {
    setSelectedRanger(id);
    setForm({ ...form, rangerDesignation: id });
  };

  const Heartbeat = ({ delay = 0 }) => (
    <svg className="heartbeat" viewBox="0 0 100 30" style={{ animationDelay: `${delay}s` }}>
      <polyline
        points="0,15 20,15 25,5 30,25 35,10 40,20 45,15 100,15"
        stroke="var(--ranger-glow)"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );

  return (
    <div className="register-container" data-ranger={selectedRanger}>
      {/* Background */}
      <div className="space-background"><div className="stars"></div><div className="stars2"></div><div className="stars3"></div></div>
      <div className="helmet-background"><div className="helmet helmet-1"></div><div className="helmet helmet-2"></div><div className="helmet helmet-3"></div></div>
      <div className="planet-container"><div className="planet"><div className="planet-glow"></div></div></div>

      {/* Header */}
      <div className="power-rangers-header">
        <div className="pr-logo"><div className="pr-power">POWER</div><div className="pr-rangers">RANGERS</div></div>
      </div>

      <div className="recruitment-subtitle">OPERATION OVERDRIVE RECRUITMENT</div>

      {/* Ranger selection */}
      <div className="ranger-selector">
        {rangers.map((r) => (
          <div
            key={r.id}
            className={`ranger-badge ${selectedRanger === r.id ? "active" : ""}`}
            style={{ "--ranger-color": r.color }}
            onClick={() => handleRangerSelect(r.id)}
          >
            <div className="badge-inner"></div>
          </div>
        ))}
      </div>

      {/* morph animation */}
      {isRegistering && (
        <div className="morph-overlay">
          <div className="morph-flash"></div>
          <div className="morph-text">RANGER ACTIVATED!</div>
          <div className="ranger-symbol"></div>
        </div>
      )}

      {/* HUD Panels */}
      <div className="hud-panel hud-left">
        <div className="panel-header">SYSTEM DIAGNOSTICS</div>
        <div className="vital-chart"><Heartbeat delay={0} /><Heartbeat delay={0.5} /><Heartbeat delay={1} /></div>
        <div className="vital-stats">
          <div className="stat-item"><span className="stat-label">NETWORK</span><span className="stat-value" style={{ color: currentRanger.color }}>SECURE</span></div>
          <div className="stat-item"><span className="stat-label">ENCRYPTION</span><span className="stat-value" style={{ color: currentRanger.color }}>ACTIVE</span></div>
          <div className="stat-item"><span className="stat-label">STATUS</span><span className="stat-value" style={{ color: currentRanger.color }}>READY</span></div>
        </div>
      </div>

      <div className="hud-panel hud-right">
        <div className="panel-header">RANGER DESIGNATION</div>
        <div className="power-circle">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,255,255,0.1)" strokeWidth="8" />
            <circle className="power-progress" cx="60" cy="60" r="54" fill="none" stroke="var(--ranger-glow)" strokeWidth="8" strokeDasharray="339.292" strokeDashoffset="0" />
          </svg>
          <div className="power-text" style={{ color: currentRanger.color }}>100%</div>
        </div>
        <div className="power-label" style={{ color: currentRanger.color }}>{currentRanger.power.toUpperCase()} CORE</div>
      </div>

      {/* Form */}
      <div className="register-panel">
        <div className="panel-corners">{["tl","tr","bl","br"].map((c) => <div key={c} className={`corner corner-${c}`} />)}</div>
        <div className="panel-glow"></div>

        <div className="register-header">
          <h1 className="register-title">RECRUIT</h1>
          <p className="register-subtitle">OPERATOR REGISTRATION</p>
          <div className="ranger-info" style={{ color: currentRanger.color }}>
            <span>{currentRanger.name}</span>
            <span className="vehicle-name">// {currentRanger.vehicle}</span>
          </div>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group"><label>FULL NAME</label><input className="cyber-input" type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></div>
          <div className="form-group"><label>OPERATOR ID</label><input className="cyber-input" type="text" value={form.operatorId} onChange={(e) => setForm({ ...form, operatorId: e.target.value })} required /></div>
          <div className="form-group"><label>COMM LINK (EMAIL)</label><input className="cyber-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div className="form-group"><label>ACCESS CODE</label><input className="cyber-input" type="password" value={form.accessCode} onChange={(e) => setForm({ ...form, accessCode: e.target.value })} required /></div>
          <div className="form-group"><label>CONFIRM ACCESS CODE</label><input className="cyber-input" type="password" value={form.confirmCode} onChange={(e) => setForm({ ...form, confirmCode: e.target.value })} required /></div>

          <button className={`register-button ${isRegistering ? "morph-button" : ""}`} type="submit">
            <span className="button-text">{isRegistering ? "ACTIVATING..." : "ACTIVATE RANGER"}</span>
            <div className="button-shine"></div>
          </button>
        </form>

        <div className="back-link">
          <span>Already registered?</span>
          <a href="#" onClick={(e) => { e.preventDefault(); onBack?.(); }}>RETURN TO LOGIN</a>
        </div>
      </div>

      {/* HUD bottom */}
      <div className="bottom-hud">
        <div className="bottom-panel"><div className="mini-display">{[...Array(4)].map((_, i) => <div key={i} className="line"></div>)}</div></div>
        <div className="hex-button"><div className="hexagon"><span>RECRUIT</span></div></div>
        <div className="bottom-panel"><div className="radar-display"><div className="radar-ping"></div></div></div>
      </div>

      <div className="cockpit-frame"></div>
    </div>
  );
}

export default Register;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Icon from "../shared/Icon.jsx";
import "./ZordonLogin.css";

function ZordonLogin({ onAdminSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ adminId: "", secretKey: "" });
  const [isActivating, setIsActivating] = useState(false);

  const validateForm = () => {
    if (!form.adminId.trim()) {
      toast.error("Admin ID required!");
      return false;
    }
    if (!form.secretKey.trim()) {
      toast.error("Secret Key required!");
      return false;
    }
    if (form.adminId.length < 4) {
      toast.error("Admin ID must be at least 4 chars!");
      return false;
    }
    if (form.secretKey.length < 6) {
      toast.error("Secret Key must be at least 6 chars!");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsActivating(true);
    toast.loading("Contacting ZORDON...", { id: "zordon" });

    setTimeout(() => {
      toast.success("ZORDON LINK ESTABLISHED", {
        id: "zordon",
        duration: 2000,
        style: {
          border: "2px solid #00eaff",
          boxShadow: "0 0 30px #00eaff",
        },
      });

      const adminData = {
        role: "admin",
        name: "Zordon",
        access: "full",
      };
      
      localStorage.setItem('zordonAuth', JSON.stringify(adminData));
      onAdminSuccess?.(adminData);
      
      setTimeout(() => {
        navigate('/zordon/dashboard');
      }, 500);
    }, 1500);
  };

  return (
    <div className={`zordon-container ${isActivating ? "activating" : ""}`}>
      {isActivating && (
        <div className="zordon-activation">
          <div className="energy-pulse"></div>
          <div className="zordon-text">OverDrive LINK ESTABLISHING…</div>
        </div>
      )}

      <div className="zordon-crystal"></div>

      <div className="zordon-title">
        <h1 className="z-title">ZORDON</h1>
        <p className="z-subtitle">OverDrive HEADQUARTERS • COMMAND ACCESS</p>
      </div>

      <div className="zordon-panel">
        <form onSubmit={handleSubmit} className="z-form">
          <div className="form-group">
            <label htmlFor="adminId">◆ ADMIN IDENTIFICATION</label>
            <input
              id="adminId"
              type="text"
              value={form.adminId}
              onChange={(e) =>
                setForm({ ...form, adminId: e.target.value })
              }
              placeholder="Enter OverDrive Admin ID"
              className="z-input"
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="secretKey">◆ SECURITY CLEARANCE</label>
            <input
              id="secretKey"
              type="password"
              value={form.secretKey}
              onChange={(e) =>
                setForm({ ...form, secretKey: e.target.value })
              }
              placeholder="Enter Clearance Code"
              className="z-input"
              autoComplete="off"
            />
          </div>

          <button type="submit" className="zordon-button">
            <Icon name="zap" size={20} />
            <span>INITIATE ACCESS</span>
            <Icon name="zap" size={20} />
          </button>
        </form>
      </div>

      <div className="zordon-orbital"></div>
    </div>
  );
}

export default ZordonLogin;

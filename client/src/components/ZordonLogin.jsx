import { useState } from "react";
import toast from "react-hot-toast";
import "./ZordonLogin.css";

function ZordonLogin({ onAdminSuccess }) {
  const [form, setForm] = useState({ adminId: "", secretKey: "" });
  const [isActivating, setIsActivating] = useState(false);

  const validateForm = () => {
    if (!form.adminId.trim()) {
      toast.error("⚠️ Admin ID required!");
      return false;
    }
    if (!form.secretKey.trim()) {
      toast.error("⚠️ Secret Key required!");
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
      toast.success("ZORDON LINK ESTABLISHED ⚡", {
        id: "zordon",
        duration: 2000,
        style: {
          border: "2px solid #00eaff",
          boxShadow: "0 0 30px #00eaff",
        },
      });

      onAdminSuccess?.({
        role: "admin",
        name: "Zordon",
        access: "full",
      });
    }, 1500);
  };

  return (
    <div className={`zordon-container ${isActivating ? "activating" : ""}`}>
      {isActivating && (
        <div className="zordon-activation">
          <div className="energy-pulse"></div>
          <div className="zordon-text">CONNECTING…</div>
        </div>
      )}

      <div className="zordon-crystal"></div>

      <div className="zordon-title">
        <h1 className="z-title">ZORDON</h1>
        <p className="z-subtitle">COMMAND ACCESS PORTAL</p>
      </div>

      <div className="zordon-panel">
        <form onSubmit={handleSubmit} className="z-form">
          <div className="form-group">
            <label htmlFor="adminId">ADMIN ID</label>
            <input
              id="adminId"
              type="text"
              value={form.adminId}
              onChange={(e) =>
                setForm({ ...form, adminId: e.target.value })
              }
              placeholder="Enter Zordon Admin ID"
              className="z-input"
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="secretKey">SECRET KEY</label>
            <input
              id="secretKey"
              type="password"
              value={form.secretKey}
              onChange={(e) =>
                setForm({ ...form, secretKey: e.target.value })
              }
              placeholder="Enter Secret Key"
              className="z-input"
              autoComplete="off"
            />
          </div>

          <button type="submit" className="zordon-button">
            <span>ESTABLISH LINK</span>
          </button>
        </form>
      </div>

      <div className="zordon-orbital"></div>
    </div>
  );
}

export default ZordonLogin;

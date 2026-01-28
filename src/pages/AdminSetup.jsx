import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AdminSetup() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/setup-super-admin", { fullName, password });
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to start setup.";
      setError(msg);
      alert("Error: " + msg); // Added for visibility
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/verify-super-admin-otp", { otp });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      alert("Success! Account verified."); 
      navigate("/");
    } catch (err) {
       const msg = err.response?.data?.message || "Failed to verify OTP.";
       setError(msg);
       alert("Verification Error: " + msg); // Added for visibility
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>Super Admin Setup</h1>
        {step === 1 ? (
          <form onSubmit={handleSetup}>
            <p style={styles.subtitle}>Create the first admin account.</p>
            <input
              type="text"
              placeholder="Your Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={styles.input}
              required
            />
            <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Choose a Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
                <span 
                    style={styles.eyeIcon} 
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <p style={styles.subtitle}>
              An OTP has been sent to the super admin email. Please enter it
              below.
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Verifying..." : "Create Account & Login"}
            </button>
          </form>
        )}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f7f8fc",
  },
  loginBox: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "350px",
    textAlign: "center",
  },
  title: { margin: 0, fontSize: "24px" },
  subtitle: { color: "#8A8A8E", marginTop: "5px", marginBottom: "30px" },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#FFD700",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: '15px',
    top: '38%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#8A8A8E',
    fontSize: '20px',
  },
  error: {
    color: "#DC3545",
    fontSize: "14px",
    marginTop: "-5px",
    marginBottom: "10px",
  },
};

export default AdminSetup;

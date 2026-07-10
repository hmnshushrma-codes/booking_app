import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config.js";
import { login, isLoggedIn } from "../../api/admin.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [secretKey, setSecretKey] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (isLoggedIn()) {
    navigate("/admin/dashboard", { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!secretKey || !email || !password) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    const result = await login(secretKey, email, password);
    setLoading(false);
    if (result.success) {
      navigate("/admin/dashboard");
    } else {
      setError(result.error || "Invalid credentials");
    }
  }

  const inputStyle = {
    width: "100%", padding: "14px 16px",
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, color: "#fff", fontSize: 14,
    fontFamily: "inherit", outline: "none",
  };

  return (
    <div style={{
      backgroundColor: "#0a0a0a", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{ maxWidth: 380, width: "100%" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, marginBottom: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>
              {config.brand}
            </span>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              backgroundColor: config.accent, display: "inline-block",
              marginLeft: 2,
            }} />
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Admin Panel</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: "12px 16px", marginBottom: 20,
            backgroundColor: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 12, fontSize: 13, color: "#ef4444", textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
              Secret Key
            </label>
            <input
              type="password" value={secretKey} onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter admin secret key" autoComplete="off"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
              Email
            </label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com" autoComplete="email"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password" autoComplete="current-password"
              style={inputStyle}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "16px",
              backgroundColor: config.accent, color: "#0a0a0a",
              border: "none", borderRadius: 50, fontSize: 15,
              fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", minHeight: 52,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 18, height: 18, border: "2px solid rgba(0,0,0,0.2)",
                  borderTopColor: "#0a0a0a", borderRadius: "50%",
                  display: "inline-block", animation: "spin 0.8s linear infinite",
                }} />
                Logging in...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </>
            ) : "Log In"}
          </button>
        </form>

        {/* Forgot password */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={() => navigate("/admin/forgot")}
            style={{
              background: "none", border: "none",
              color: "rgba(255,255,255,0.4)", fontSize: 13,
              cursor: "pointer", fontFamily: "inherit",
              textDecoration: "underline", textUnderlineOffset: 3,
            }}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}

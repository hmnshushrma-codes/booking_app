import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config.js";
import { forgotPassword, verifyOtp, resetPassword } from "../../api/admin.js";

export default function AdminForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0=email, 1=otp, 2=newPassword
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);

  // Step 0: Send OTP
  async function handleSendOtp(e) {
    e.preventDefault();
    if (!email) { setError("Email is required"); return; }
    setError("");
    setLoading(true);
    await forgotPassword(email);
    setLoading(false);
    setStep(1);
    startResendTimer();
  }

  function startResendTimer() {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    if (resendTimer > 0) return;
    setLoading(true);
    await forgotPassword(email);
    setLoading(false);
    startResendTimer();
  }

  // OTP input handling
  function handleOtpChange(index, value) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
      e.preventDefault();
    }
  }

  // Step 1: Verify OTP
  async function handleVerifyOtp(e) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) { setError("Enter all 6 digits"); return; }
    setError("");
    setLoading(true);
    const result = await verifyOtp(email, code);
    setLoading(false);
    if (result.success) {
      setResetToken(result.resetToken);
      setStep(2);
    } else {
      setError(result.error || "Invalid or expired code");
    }
  }

  // Step 2: Reset password
  async function handleResetPassword(e) {
    e.preventDefault();
    if (newPassword.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (!/[a-z]/.test(newPassword)) { setError("Must contain a lowercase letter"); return; }
    if (!/[A-Z]/.test(newPassword)) { setError("Must contain an uppercase letter"); return; }
    if (!/\d/.test(newPassword)) { setError("Must contain a number"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords don't match"); return; }
    setError("");
    setLoading(true);
    const result = await resetPassword(resetToken, newPassword);
    setLoading(false);
    if (result.success) {
      navigate("/admin", { state: { resetSuccess: true } });
    } else {
      setError(result.error || "Reset failed. Request a new code.");
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
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ maxWidth: 380, width: "100%" }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            {step === 0 && "Reset Password"}
            {step === 1 && "Enter Code"}
            {step === 2 && "New Password"}
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            {step === 0 && "Enter your admin email address"}
            {step === 1 && `Enter the 6-digit code sent to ${email}`}
            {step === 2 && "Set your new password"}
          </p>
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

        {/* Step 0: Email */}
        {step === 0 && (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
                Email
              </label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com" autoComplete="email" style={inputStyle}
              />
            </div>
            <SubmitButton loading={loading} text="Send Code" />
          </form>
        )}

        {/* Step 1: OTP */}
        {step === 1 && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{
              display: "flex", gap: 8, justifyContent: "center", marginBottom: 24,
            }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text" inputMode="numeric" maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={i === 0 ? handleOtpPaste : undefined}
                  style={{
                    width: 48, height: 56, textAlign: "center",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: digit ? `1px solid ${config.accent}` : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12, color: "#fff", fontSize: 22,
                    fontWeight: 700, fontFamily: "inherit", outline: "none",
                  }}
                />
              ))}
            </div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <button
                type="button" onClick={handleResend} disabled={resendTimer > 0}
                style={{
                  background: "none", border: "none", fontSize: 13,
                  color: resendTimer > 0 ? "rgba(255,255,255,0.3)" : config.accent,
                  cursor: resendTimer > 0 ? "default" : "pointer", fontFamily: "inherit",
                }}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
              </button>
            </div>
            <SubmitButton loading={loading} text="Verify" />
          </form>
        )}

        {/* Step 2: New password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
                New Password
              </label>
              <input
                type="password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 chars, upper + lower + number"
                autoComplete="new-password" style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
                Confirm Password
              </label>
              <input
                type="password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                autoComplete="new-password" style={inputStyle}
              />
            </div>
            <SubmitButton loading={loading} text="Reset Password" />
          </form>
        )}

        {/* Back to login */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={() => step === 0 ? navigate("/admin") : setStep(step - 1)}
            style={{
              background: "none", border: "none",
              color: "rgba(255,255,255,0.4)", fontSize: 13,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            &larr; {step === 0 ? "Back to Login" : "Back"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SubmitButton({ loading, text }) {
  return (
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
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      ) : text}
    </button>
  );
}

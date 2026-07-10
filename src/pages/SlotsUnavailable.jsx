import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../config.js";
import { formatDate } from "../utils/slots.js";
import { joinWaitlist } from "../api/bookings.js";

export default function SlotsUnavailable() {
  const location = useLocation();
  const navigate = useNavigate();
  const info = location.state || {};

  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // If no state, redirect to booking
  if (!info.service) {
    return (
      <div style={{
        backgroundColor: "#0a0a0a", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
            No service selected.
          </p>
          <button
            onClick={() => navigate("/book")}
            style={{
              padding: "14px 28px", backgroundColor: config.accent,
              color: "#0a0a0a", border: "none", borderRadius: 50,
              fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Go to Booking
          </button>
        </div>
      </div>
    );
  }

  const dateStr = typeof info.date === "string" ? info.date : info.date?.toISOString?.().split("T")[0];

  function validate() {
    const e = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Name is required (min 2 chars)";
    if (/\d/.test(name)) e.name = "Name cannot contain numbers";
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim())) e.phone = "Valid 10-digit phone required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleWaitlistSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await joinWaitlist({
      serviceId: info.service.id,
      date: dateStr,
      name: name.trim(),
      phone: phone.trim(),
      turnstileToken: "dev-bypass",
    });
    setLoading(false);
    setWaitlistDone(true);
  }

  return (
    <div style={{
      backgroundColor: "#0a0a0a", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
    }}>
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>&#x1F5D3;&#xFE0F;</div>

        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10, letterSpacing: "-0.5px" }}>
          No slots available
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 36, lineHeight: 1.5 }}>
          All slots for <strong style={{ color: "#fff" }}>{info.service.name}</strong> on{" "}
          <strong style={{ color: "#fff" }}>{formatDate(new Date(dateStr + "T00:00:00"))}</strong> are booked.
        </p>

        {!showWaitlist && !waitlistDone && (
          <>
            <button
              onClick={() => navigate(`/book?service=${info.service.id}`)}
              style={{
                width: "100%", padding: "16px", backgroundColor: config.accent,
                color: "#0a0a0a", border: "none", borderRadius: 50,
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit", minHeight: 52, marginBottom: 12,
              }}
            >
              Try another date
            </button>
            <button
              onClick={() => setShowWaitlist(true)}
              style={{
                width: "100%", padding: "16px",
                backgroundColor: "rgba(255,255,255,0.06)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 50,
                fontSize: 15, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", minHeight: 52, marginBottom: 24,
              }}
            >
              Join waitlist
            </button>
          </>
        )}

        {showWaitlist && !waitlistDone && (
          <form onSubmit={handleWaitlistSubmit} style={{ textAlign: "left", marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
                Full Name <span style={{ color: config.accent }}>*</span>
              </label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Raj Kumar"
                style={{
                  width: "100%", padding: "14px 16px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: errors.name ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12, color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none",
                }}
              />
              {errors.name && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 6 }}>{errors.name}</p>}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
                Phone <span style={{ color: config.accent }}>*</span>
              </label>
              <div style={{
                display: "flex", alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.06)",
                border: errors.phone ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, overflow: "hidden",
              }}>
                <span style={{ padding: "14px 0 14px 16px", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>+91</span>
                <input
                  type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  style={{
                    flex: 1, padding: "14px 16px 14px 8px",
                    backgroundColor: "transparent", border: "none",
                    color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none",
                  }}
                />
              </div>
              {errors.phone && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 6 }}>{errors.phone}</p>}
            </div>
            <button type="submit" disabled={loading}
              style={{
                width: "100%", padding: "16px", backgroundColor: config.accent,
                color: "#0a0a0a", border: "none", borderRadius: 50,
                fontSize: 15, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
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
                  Joining...
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </>
              ) : "Join Waitlist"}
            </button>
          </form>
        )}

        {waitlistDone && (
          <div style={{
            padding: 24, borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)", marginBottom: 24,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>&#x2705;</div>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>You're on the waitlist!</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>We'll notify you if a slot opens.</p>
          </div>
        )}

        <button
          onClick={() => navigate("/book")}
          style={{
            background: "none", border: "none", color: config.accent,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 4,
          }}
        >
          Choose a different service
        </button>
      </div>
    </div>
  );
}

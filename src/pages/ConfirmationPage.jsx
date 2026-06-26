import config from "../config.js";
import Footer from "../components/Footer.jsx";
import { formatDate, formatSlotDisplay } from "../utils/slots.js";

export default function ConfirmationPage({ booking, onBookAnother }) {
  const shareText = `Just booked ${booking.service.name} at ${config.brand} via oye.nino.\nZero investment mein apna booking site: https://book.oyenino.com`;

  function downloadICS() {
    const [h, m] = booking.time.split(":").map(Number);
    const start = new Date(booking.date);
    start.setHours(h, m, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + booking.service.duration);

    const fmt = (d) =>
      d.getFullYear() +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0") +
      "T" +
      String(d.getHours()).padStart(2, "0") +
      String(d.getMinutes()).padStart(2, "0") +
      "00";

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${booking.service.name} at ${config.brand}`,
      `LOCATION:${config.location}`,
      `DESCRIPTION:Booking ID: ${booking.bookingId}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${booking.bookingId}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  }

  function copyLink() {
    navigator.clipboard.writeText(shareText);
  }

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "48px 24px" }}>

        {/* Animated checkmark */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            backgroundColor: config.accentSoft,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
            animation: "popIn 0.5s ease",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={config.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" style={{
                strokeDasharray: 30,
                strokeDashoffset: 0,
                animation: "drawCheck 0.6s ease 0.3s both",
              }} />
            </svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.5px" }}>
            Booking Confirmed!
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
            We'll see you soon.
          </p>
        </div>

        {/* Summary card */}
        <div style={{
          padding: 24,
          borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: 20,
        }}>
          <Row label="Service" value={`${booking.service.name} — ₹${booking.service.price}`} />
          <Row label="Date" value={formatDate(booking.date)} />
          <Row label="Time" value={formatSlotDisplay(booking.time)} />
          <Row label="Name" value={booking.name} />
          <Row label="Phone" value={`+91 ${booking.phone}`} />
          <Row label="Booking ID" value={booking.bookingId} accent />
        </div>

        {/* Add to calendar */}
        <button
          onClick={downloadICS}
          style={{
            width: "100%", padding: "14px",
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "#fff", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 50, fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", minHeight: 48,
            marginBottom: 32,
          }}
        >
          📅 Add to Calendar
        </button>

        {/* Divider */}
        <div style={{
          textAlign: "center",
          margin: "8px 0 28px",
          fontSize: 13,
          color: "rgba(255,255,255,0.3)",
        }}>
          Loved the experience?
        </div>

        {/* Social CTA block */}
        <div style={{
          padding: 24,
          borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: 24,
        }}>
          <a
            href={config.instagram}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              width: "100%", padding: "14px",
              background: "linear-gradient(135deg, #f59e0b, #ec4899)",
              color: "#fff", border: "none",
              borderRadius: 50, fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              textAlign: "center", textDecoration: "none",
              minHeight: 48, lineHeight: "20px",
              marginBottom: 12,
            }}
          >
            Follow @oye.nino on Instagram
          </a>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={shareWhatsApp}
              style={{
                flex: 1, padding: "12px 8px",
                backgroundColor: "#25D366",
                color: "#fff", border: "none",
                borderRadius: 50, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", minHeight: 44,
              }}
            >
              Share on WhatsApp
            </button>
            <button
              onClick={copyLink}
              style={{
                flex: 1, padding: "12px 8px",
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#fff", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 50, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", minHeight: 44,
              }}
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Book another */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={onBookAnother}
            style={{
              background: "none", border: "none",
              color: config.accent, fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            Book another service
          </button>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck {
          0% { stroke-dashoffset: 30; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{label}</span>
      <span style={{
        fontSize: 13, fontWeight: 600,
        color: accent ? config.accent : "#fff",
        textAlign: "right",
        maxWidth: "60%",
      }}>
        {value}
      </span>
    </div>
  );
}

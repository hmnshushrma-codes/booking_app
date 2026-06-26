import config from "../config.js";

export default function Navbar({ onBookNow }) {
  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 24px",
      backgroundColor: "rgba(10,10,10,0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px" }}>
          {config.brand}
        </span>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          backgroundColor: config.accent, display: "inline-block",
          marginLeft: 2, marginBottom: -2,
        }} />
      </div>
      <button
        onClick={onBookNow}
        style={{
          padding: "10px 22px",
          backgroundColor: config.accent,
          color: "#0a0a0a",
          border: "none",
          borderRadius: 50,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          minHeight: 44,
        }}
      >
        Book Now
      </button>
    </nav>
  );
}

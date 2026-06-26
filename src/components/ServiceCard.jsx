import config from "../config.js";

export default function ServiceCard({ service, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "20px",
        borderRadius: 16,
        border: selected
          ? `2px solid ${config.accent}`
          : "2px solid rgba(255,255,255,0.08)",
        backgroundColor: selected ? config.accentSoft : "rgba(255,255,255,0.04)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        color: selected ? "#0a0a0a" : "#ffffff",
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
          {service.name}
        </h3>
        <span style={{
          fontSize: 15,
          fontWeight: 700,
          color: selected ? config.accentDark : config.accent,
          whiteSpace: "nowrap",
          marginLeft: 12,
        }}>
          ₹{service.price}
        </span>
      </div>
      <p style={{
        fontSize: 13,
        margin: 0,
        color: selected ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.4)",
      }}>
        {service.duration} min
      </p>
    </div>
  );
}

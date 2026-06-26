import config from "../config.js";

export default function Footer() {
  return (
    <footer style={{
      padding: "48px 24px 32px",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      maxWidth: 480,
      margin: "0 auto",
    }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 800 }}>{config.brand}</span>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            backgroundColor: config.accent, display: "inline-block",
          }} />
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
          {config.location}
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
          {config.phone}
        </p>
        <a
          href={config.instagram}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 13, color: config.accent, textDecoration: "none" }}
        >
          @oye.nino
        </a>
      </div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 20,
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.2)",
          fontFamily: "ui-monospace, monospace",
        }}>
          built with oye.nino.
        </span>
        <span style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.15)",
        }}>
          Photos by Pexels
        </span>
      </div>
    </footer>
  );
}

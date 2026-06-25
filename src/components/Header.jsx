import ProgressBar from "./ui/ProgressBar.jsx";

export default function Header({ config, step, totalSteps }) {
  const initial = config.brand[0].toUpperCase();

  return (
    <div style={{
      backgroundColor: config.accent,
      padding: "28px 24px 24px",
      color: "white",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 52, height: 52,
          borderRadius: 12,
          backgroundColor: "rgba(255,255,255,0.22)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 700, flexShrink: 0,
        }}>
          {initial}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>
            {config.brand}
          </h1>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.82 }}>
            {config.tagline}
          </p>
        </div>
      </div>
      <ProgressBar step={step} total={totalSteps} accent={config.accent} />
    </div>
  );
}

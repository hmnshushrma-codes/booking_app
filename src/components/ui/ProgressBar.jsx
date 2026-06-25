export default function ProgressBar({ step, total, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, flex: i === 0 ? 1.3 : 1 }}>
          <span style={{
            fontSize: 9,
            fontWeight: 600,
            color: "white",
            opacity: i <= step ? 1 : 0.45,
            letterSpacing: "0.05em",
          }}>
            0{i + 1}
          </span>
          <div style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor: "white",
            opacity: i <= step ? 1 : 0.3,
          }} />
        </div>
      ))}
    </div>
  );
}

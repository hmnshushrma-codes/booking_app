export default function ServiceStep({ config, selected, onSelect }) {
  return (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#18181b", margin: "0 0 4px" }}>
        Choose a service
      </h2>
      <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 20px" }}>
        {config.providerLabel}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {config.services.map((svc) => {
          const isActive = selected?.id === svc.id;
          return (
            <button
              key={svc.id}
              onClick={() => onSelect(svc)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px",
                border: `${isActive ? 2 : 1}px solid ${isActive ? config.accent : "#e4e4e7"}`,
                borderRadius: 14,
                backgroundColor: isActive ? config.accentSoft : "#ffffff",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#18181b" }}>
                  {svc.name}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "#71717a" }}>
                  {svc.meta}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: config.accent }}>
                  {svc.price}
                </span>
                <span style={{ fontSize: 18, color: "#d4d4d8" }}>→</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

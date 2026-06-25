const FLOW_OPTIONS = [
  { key: "clinic",   label: "Doctor",   icon: "🩺" },
  { key: "barber",   label: "Saloon",   icon: "💈" },
  { key: "homestay", label: "Homestay", icon: "🏡" },
  { key: "hotel",    label: "Hotel",    icon: "🏨" },
];

export default function ConfigSwitcher({ active, onChange }) {
  return (
    <div style={{
      display: "flex",
      gap: 8,
      justifyContent: "center",
      flexWrap: "wrap",
    }}>
      {FLOW_OPTIONS.map(({ key, label, icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: isActive ? "2px solid #18181b" : "2px solid #e4e4e7",
              backgroundColor: isActive ? "#18181b" : "#ffffff",
              color: isActive ? "#ffffff" : "#52525b",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: 15 }}>{icon}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function DetailsStep({ config, name, phone, onChange, onSubmit }) {
  return (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#18181b", margin: "0 0 4px" }}>
        Your details
      </h2>
      <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 20px" }}>
        Almost done
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field
          label="Full name"
          icon="👤"
          value={name}
          placeholder="Raj Kumar"
          onChange={(v) => onChange("name", v)}
        />
        <Field
          label="Phone number"
          icon="📱"
          value={phone}
          placeholder="+91 98765 43210"
          type="tel"
          onChange={(v) => onChange("phone", v)}
        />
      </div>

      <button
        disabled={!name || !phone}
        onClick={onSubmit}
        style={{
          width: "100%",
          marginTop: 20,
          padding: "14px",
          backgroundColor: config.accent,
          color: "white",
          border: "none",
          borderRadius: 16,
          fontSize: 15,
          fontWeight: 600,
          cursor: name && phone ? "pointer" : "not-allowed",
          opacity: name && phone ? 1 : 0.45,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontFamily: "inherit",
          transition: "opacity 0.15s ease",
        }}
      >
        Confirm booking →
      </button>
    </div>
  );
}

function Field({ label, icon, value, placeholder, type = "text", onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 16px",
      border: "1px solid #e4e4e7",
      borderRadius: 14,
      backgroundColor: "#ffffff",
      transition: "border-color 0.15s",
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1, border: "none", outline: "none",
          fontSize: 14, color: "#18181b",
          fontFamily: "inherit",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}

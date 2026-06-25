export default function ConfirmStep({ config, booking, onReset }) {
  const { service, slot, name, phone, guests } = booking;
  const isDate = config.slotType === "date";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 8 }}>
      {/* Success icon */}
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        backgroundColor: config.accentSoft,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, marginBottom: 16,
      }}>
        ✓
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#18181b", margin: "0 0 4px" }}>
        Booking confirmed!
      </h2>
      <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 24px" }}>
        {config.brand} · {config.providerLabel}
      </p>

      {/* Summary card */}
      <div style={{
        width: "100%",
        backgroundColor: "#fafafa",
        borderRadius: 16,
        padding: "16px",
        textAlign: "left",
        marginBottom: 20,
      }}>
        <Row label="Service"                value={service?.name} />
        <Row label={isDate ? "Dates" : "Time"} value={slot} />
        {isDate && guests && <Row label="Guests" value={`${guests} guest${guests > 1 ? "s" : ""}`} />}
        <Row label="Name"                   value={name} />
        <Row label="Phone"                  value={phone} />
        <Row label="Price"                  value={service?.price} accent />
      </div>

      <p style={{ fontSize: 12, color: "#a1a1aa", margin: "0 0 16px" }}>
        We'll reach out to confirm your booking shortly.
      </p>

      <button
        onClick={onReset}
        style={{
          fontSize: 13, fontWeight: 600, color: "#71717a",
          background: "none", border: "none", cursor: "pointer",
          textDecoration: "underline", textUnderlineOffset: 3,
          fontFamily: "inherit",
        }}
      >
        Book again
      </button>
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      padding: "7px 0",
      borderBottom: "1px solid #f0f0f0",
    }}>
      <span style={{ fontSize: 13, color: "#71717a" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: accent ? "#18181b" : "#18181b" }}>
        {value}
      </span>
    </div>
  );
}

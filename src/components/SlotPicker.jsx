import config from "../config.js";
import { formatSlotDisplay, isPastSlot, formatDate } from "../utils/slots.js";

export default function SlotPicker({ date, onDateChange, slots, selectedSlot, onSelect, loading }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function changeDate(delta) {
    const next = new Date(date);
    next.setDate(next.getDate() + delta);
    if (next >= today) onDateChange(next);
  }

  const isPrevDisabled = date.toDateString() === today.toDateString();

  return (
    <div>
      {/* Date navigator */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        padding: "12px 16px",
        backgroundColor: "rgba(255,255,255,0.04)",
        borderRadius: 12,
      }}>
        <button
          onClick={() => changeDate(-1)}
          disabled={isPrevDisabled}
          style={{
            width: 36, height: 36, borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "transparent",
            color: isPrevDisabled ? "rgba(255,255,255,0.15)" : "#fff",
            fontSize: 16, cursor: isPrevDisabled ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "inherit",
          }}
        >
          ←
        </button>
        <span style={{ fontSize: 14, fontWeight: 600 }}>
          {formatDate(date)}
        </span>
        <button
          onClick={() => changeDate(1)}
          style={{
            width: 36, height: 36, borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "transparent",
            color: "#fff", fontSize: 16, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "inherit",
          }}
        >
          →
        </button>
      </div>

      {/* Slots grid */}
      {loading ? (
        <div style={{
          textAlign: "center", padding: "40px 0",
          color: "rgba(255,255,255,0.4)", fontSize: 14,
        }}>
          <div style={{
            width: 28, height: 28, border: "3px solid rgba(255,255,255,0.1)",
            borderTopColor: config.accent, borderRadius: "50%",
            margin: "0 auto 12px",
            animation: "spin 0.8s linear infinite",
          }} />
          Loading slots...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}>
          {slots.map(({ time, available }) => {
            const past = isPastSlot(time, date);
            const booked = !available;
            const isSelected = selectedSlot === time;
            const disabled = past || booked;

            let bg = "rgba(255,255,255,0.06)";
            let color = "#ffffff";
            let border = "1px solid rgba(255,255,255,0.08)";
            let opacity = 1;

            if (isSelected) {
              bg = config.accent;
              color = "#0a0a0a";
              border = `1px solid ${config.accent}`;
            } else if (disabled) {
              opacity = 0.35;
            }

            return (
              <button
                key={time}
                onClick={() => !disabled && onSelect(time)}
                disabled={disabled}
                style={{
                  padding: "12px 8px",
                  borderRadius: 12,
                  border,
                  backgroundColor: bg,
                  color,
                  opacity,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: disabled ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  minHeight: 44,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {formatSlotDisplay(time)}
                {booked && !past && (
                  <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.7 }}>Booked</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

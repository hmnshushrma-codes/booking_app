import { useState } from "react";

export default function SlotStep({ config, service, selected, guests, onSelect, onGuestsChange }) {
  const isDate = config.slotType === "date";

  return (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#18181b", margin: "0 0 4px" }}>
        {isDate ? "Select dates" : "Pick a time"}
      </h2>
      <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 20px" }}>
        {service?.name}
      </p>

      {/* Slot grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24,
      }}>
        {config.slots.map((slot) => {
          const isActive = selected === slot;
          return (
            <button
              key={slot}
              onClick={() => onSelect(slot)}
              style={{
                padding: "10px 12px",
                border: `${isActive ? 2 : 1}px solid ${isActive ? config.accent : "#e4e4e7"}`,
                borderRadius: 12,
                backgroundColor: isActive ? config.accentSoft : "#fafafa",
                color: isActive ? config.accent : "#52525b",
                fontWeight: isActive ? 600 : 400,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.15s ease",
                fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <span style={{ fontSize: 14 }}>{isDate ? "📅" : "🕐"}</span>
              {slot}
            </button>
          );
        })}
      </div>

      {/* Guest counter — only for date type */}
      {isDate && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#18181b", margin: "0 0 12px" }}>
            Number of guests
          </h3>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 8px",
            border: "1px solid #e4e4e7",
            borderRadius: 14,
            backgroundColor: "#fafafa",
          }}>
            <button
              onClick={() => onGuestsChange(Math.max(1, guests - 1))}
              style={{
                width: 40, height: 40, borderRadius: 10,
                border: "1px solid #e4e4e7",
                backgroundColor: "#ffffff",
                cursor: "pointer", fontSize: 20, fontWeight: 700, color: "#71717a",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "inherit",
              }}
            >
              −
            </button>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#18181b" }}>
              {guests}
            </span>
            <button
              onClick={() => onGuestsChange(Math.min(service?.maxGuests ?? 10, guests + 1))}
              style={{
                width: 40, height: 40, borderRadius: 10,
                border: "none",
                backgroundColor: config.accent,
                cursor: "pointer", fontSize: 20, fontWeight: 700, color: "#ffffff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "inherit",
              }}
            >
              +
            </button>
          </div>
          {service?.maxGuests && (
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "8px 0 0 4px" }}>
              {service.name}: max {service.maxGuests} guests
            </p>
          )}
        </div>
      )}
    </div>
  );
}

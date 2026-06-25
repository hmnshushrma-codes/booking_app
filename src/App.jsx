import { useState } from "react";
import BookingFlow from "./components/BookingFlow.jsx";
import ConfigSwitcher from "./components/ConfigSwitcher.jsx";
import { clinic, barber, homestay, hotel } from "./configs/index.js";

const CONFIGS = { clinic, barber, homestay, hotel };

function getInitialType() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  return CONFIGS[type] ? type : "clinic";
}

export default function App() {
  const [activeType, setActiveType] = useState(getInitialType);
  const [flowKey, setFlowKey] = useState(0);

  function handleSwitch(type) {
    setActiveType(type);
    setFlowKey((k) => k + 1); // remount BookingFlow to reset state
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f4f4f5",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
    }}>
      {/* Config Switcher — above the booking card */}
      <div style={{
        width: "100%",
        maxWidth: 400,
        marginBottom: 16,
        padding: "14px 8px",
        backgroundColor: "#ffffff",
        borderRadius: 20,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}>
        <p style={{
          textAlign: "center",
          margin: "0 0 10px",
          fontSize: 12,
          fontWeight: 600,
          color: "#a1a1aa",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}>
          Switch Booking Flow
        </p>
        <ConfigSwitcher active={activeType} onChange={handleSwitch} />
      </div>

      {/* Booking Card */}
      <BookingFlow key={flowKey} config={CONFIGS[activeType]} />
    </div>
  );
}

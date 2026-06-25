import { useState } from "react";
import Header from "./Header.jsx";
import ServiceStep from "./steps/ServiceStep.jsx";
import SlotStep from "./steps/SlotStep.jsx";
import DetailsStep from "./steps/DetailsStep.jsx";
import ConfirmStep from "./steps/ConfirmStep.jsx";

const STEPS = ["service", "slot", "details", "confirm"];

export default function BookingFlow({ config }) {
  const [step, setStep]       = useState(0);
  const [service, setService] = useState(null);
  const [slot, setSlot]       = useState(null);
  const [guests, setGuests]   = useState(1);
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");

  function reset() {
    setStep(0); setService(null); setSlot(null);
    setGuests(1); setName(""); setPhone("");
  }

  function handleServiceSelect(svc) {
    setService(svc);
    setStep(1);
  }

  function handleSlotSelect(s) {
    setSlot(s);
    // auto-advance only if not date type (date type has guest picker below)
    if (config.slotType !== "date") setStep(2);
  }

  function handleSlotNext() {
    if (!slot) return;
    setStep(2);
  }

  function handleDetailsChange(field, value) {
    if (field === "name") setName(value);
    if (field === "phone") setPhone(value);
  }

  function handleConfirm() {
    setStep(3);
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f4f4f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#ffffff",
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
      }}>
        {/* Header */}
        <Header config={config} step={step} totalSteps={STEPS.length} />

        {/* Body */}
        <div style={{ padding: "24px 24px 32px" }}>
          {step === 0 && (
            <ServiceStep
              config={config}
              selected={service}
              onSelect={handleServiceSelect}
            />
          )}
          {step === 1 && (
            <>
              <SlotStep
                config={config}
                service={service}
                selected={slot}
                guests={guests}
                onSelect={handleSlotSelect}
                onGuestsChange={setGuests}
              />
              {config.slotType === "date" && (
                <button
                  disabled={!slot}
                  onClick={handleSlotNext}
                  style={{
                    width: "100%", marginTop: 20, padding: "13px",
                    backgroundColor: config.accent,
                    color: "white", border: "none", borderRadius: 16,
                    fontSize: 15, fontWeight: 600,
                    cursor: slot ? "pointer" : "not-allowed",
                    opacity: slot ? 1 : 0.45,
                    fontFamily: "inherit",
                  }}
                >
                  Continue →
                </button>
              )}
            </>
          )}
          {step === 2 && (
            <DetailsStep
              config={config}
              name={name}
              phone={phone}
              onChange={handleDetailsChange}
              onSubmit={handleConfirm}
            />
          )}
          {step === 3 && (
            <ConfirmStep
              config={config}
              booking={{ service, slot, name, phone, guests }}
              onReset={reset}
            />
          )}
        </div>

        {/* Back button */}
        {step > 0 && step < 3 && (
          <button
            onClick={() => setStep(step - 1)}
            style={{
              width: "100%", padding: "12px",
              borderTop: "1px solid #f4f4f5",
              backgroundColor: "transparent", border: "none",
              color: "#a1a1aa", fontSize: 13, fontWeight: 500,
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", gap: 4,
              fontFamily: "inherit",
            }}
          >
            ← Back
          </button>
        )}

        {/* Footer */}
        <div style={{
          textAlign: "center", padding: "8px 0 12px",
          fontSize: 10, color: "#d4d4d8",
          fontFamily: "ui-monospace, monospace",
        }}>
          oye.nino. · hono + cloudflare d1
        </div>
      </div>
    </div>
  );
}

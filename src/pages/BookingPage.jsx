import { useState, useEffect } from "react";
import config from "../config.js";
import ServiceCard from "../components/ServiceCard.jsx";
import SlotPicker from "../components/SlotPicker.jsx";
import BookingForm from "../components/BookingForm.jsx";
import { getAvailableSlots, createBooking } from "../api/bookings.js";
import { formatDate } from "../utils/slots.js";

const STEP_LABELS = ["Choose Service", "Pick a Slot", "Your Details"];

export default function BookingPage({ preSelectedService, onBack, onConfirm, onSlotsUnavailable }) {
  const [step, setStep] = useState(preSelectedService ? 1 : 0);
  const [selectedService, setSelectedService] = useState(preSelectedService);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch slots when service or date changes (on step 1)
  useEffect(() => {
    if (step !== 1 || !selectedService) return;
    let cancelled = false;
    setLoadingSlots(true);
    setSelectedSlot(null);
    getAvailableSlots(selectedService.id, selectedDate).then((res) => {
      if (cancelled) return;
      setSlots(res.slots);
      setLoadingSlots(false);
      // Check if all slots are booked
      if (res.slots.every((s) => !s.available)) {
        onSlotsUnavailable({ service: selectedService, date: selectedDate });
      }
    });
    return () => { cancelled = true; };
  }, [step, selectedService, selectedDate]);

  function handleServiceSelect(svc) {
    setSelectedService(svc);
    setStep(1);
  }

  function handleSlotSelect(time) {
    setSelectedSlot(time);
    setStep(2);
  }

  function handleDateChange(newDate) {
    setSelectedDate(newDate);
  }

  async function handleFormSubmit(formData) {
    setSubmitting(true);
    // BACKEND: This payload will be sent to the real API
    const payload = {
      serviceId: selectedService.id,
      date: selectedDate.toISOString().split("T")[0],
      time: selectedSlot,
      ...formData,
    };
    const result = await createBooking(payload);
    setSubmitting(false);
    if (result.success) {
      onConfirm({
        service: selectedService,
        date: selectedDate,
        time: selectedSlot,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
        bookingId: result.bookingId,
      });
    }
  }

  function goBack() {
    if (step === 0) { onBack(); return; }
    if (step === 2) { setStep(1); return; }
    setStep(step - 1);
  }

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        maxWidth: 480,
        margin: "0 auto",
      }}>
        <button
          onClick={goBack}
          style={{
            width: 40, height: 40, borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "transparent",
            color: "#fff", fontSize: 16, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "inherit", flexShrink: 0,
          }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{config.brand}</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            Step {step + 1} of 3
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        maxWidth: 480, margin: "0 auto", padding: "0 24px 8px",
      }}>
        <div style={{
          height: 3,
          backgroundColor: "rgba(255,255,255,0.06)",
          borderRadius: 2,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${((step + 1) / 3) * 100}%`,
            backgroundColor: config.accent,
            borderRadius: 2,
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 24px 48px" }}>
        {/* Step label */}
        <h2 style={{
          fontSize: 22, fontWeight: 800, marginBottom: 6,
          letterSpacing: "-0.5px",
        }}>
          {STEP_LABELS[step]}
        </h2>
        <p style={{
          fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 28,
        }}>
          {step === 0 && "What would you like today?"}
          {step === 1 && `${selectedService.name} — ₹${selectedService.price}`}
          {step === 2 && `${selectedService.name} · ${formatDate(selectedDate)} · ${formatSlotDisplayInline(selectedSlot)}`}
        </p>

        {/* Step 0 — Choose Service */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {config.services.map((svc) => (
              <ServiceCard
                key={svc.id}
                service={svc}
                selected={selectedService?.id === svc.id}
                onClick={() => handleServiceSelect(svc)}
              />
            ))}
          </div>
        )}

        {/* Step 1 — Pick a Slot */}
        {step === 1 && (
          <SlotPicker
            date={selectedDate}
            onDateChange={handleDateChange}
            slots={slots}
            selectedSlot={selectedSlot}
            onSelect={handleSlotSelect}
            loading={loadingSlots}
          />
        )}

        {/* Step 2 — Your Details */}
        {step === 2 && (
          <BookingForm
            onSubmit={handleFormSubmit}
            loading={submitting}
          />
        )}
      </div>
    </div>
  );
}

function formatSlotDisplayInline(time) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${displayH}:${String(m).padStart(2, "0")} ${suffix}`;
}

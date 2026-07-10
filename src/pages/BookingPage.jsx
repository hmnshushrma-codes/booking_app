import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import config from "../config.js";
import ServiceCard from "../components/ServiceCard.jsx";
import SlotPicker from "../components/SlotPicker.jsx";
import BookingForm from "../components/BookingForm.jsx";
import { getAvailableSlots, createBooking } from "../api/bookings.js";
import { formatDate } from "../utils/slots.js";
import {
  saveBookingState,
  loadBookingState,
  clearBookingState,
  saveBookingReceipt,
  hasExistingBooking,
  generateIdempotencyKey,
} from "../utils/bookingSession.js";

const STEP_LABELS = ["Choose Service", "Pick a Slot", "Your Details"];

export default function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-select service from query param
  const preServiceId = searchParams.get("service");
  const preService = preServiceId
    ? config.services.find((s) => s.id === preServiceId)
    : null;

  const [step, setStep] = useState(preService ? 1 : 0);
  const [selectedService, setSelectedService] = useState(preService || null);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState(null);

  // Restore session on mount (only if no query param override)
  useEffect(() => {
    if (preService) return;
    const saved = loadBookingState();
    if (saved) {
      setStep(saved.step);
      setSelectedService(saved.selectedService);
      if (saved.selectedDate) setSelectedDate(new Date(saved.selectedDate));
      setSelectedSlot(saved.selectedSlot);
      if (saved.formData) setFormData(saved.formData);
    }
  }, []);

  // Persist state on changes
  useEffect(() => {
    saveBookingState({
      step,
      selectedService,
      selectedDate: selectedDate?.toISOString?.() || null,
      selectedSlot,
      formData,
    });
  }, [step, selectedService, selectedDate, selectedSlot, formData]);

  // Fetch slots when service or date changes (on step 1)
  useEffect(() => {
    if (step !== 1 || !selectedService) return;
    let cancelled = false;
    setLoadingSlots(true);
    setSelectedSlot(null);
    getAvailableSlots(selectedService.id, selectedDate)
      .then((res) => {
        if (cancelled) return;
        setSlots(res.slots);
        setLoadingSlots(false);
        if (res.slots.every((s) => !s.available)) {
          navigate("/slots-unavailable", {
            state: { service: selectedService, date: selectedDate.toISOString().split("T")[0] },
          });
        }
      })
      .catch(() => {
        if (!cancelled) setLoadingSlots(false);
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

  async function handleFormSubmit(form) {
    setFormData(form);
    setSubmitError("");

    const dateStr = selectedDate.toISOString().split("T")[0];

    // Client-side duplicate check
    if (hasExistingBooking(dateStr, form.phone, form.email)) {
      setSubmitError("You already have a booking for this date.");
      return;
    }

    setSubmitting(true);
    const payload = {
      serviceId: selectedService.id,
      date: dateStr,
      time: selectedSlot,
      name: form.name,
      phone: form.phone,
      email: form.email || "",
      notes: form.notes || "",
      turnstileToken: form.turnstileToken || "dev-bypass",
      idempotencyKey: generateIdempotencyKey(),
    };

    const result = await createBooking(payload);
    setSubmitting(false);

    if (result.success) {
      saveBookingReceipt({
        bookingId: result.bookingId,
        date: dateStr,
        phone: form.phone,
        email: form.email || "",
      });
      clearBookingState();
      navigate(`/confirmation/${result.bookingId}`, {
        state: {
          service: selectedService,
          date: selectedDate.toISOString(),
          time: selectedSlot,
          name: form.name,
          phone: form.phone,
          email: form.email,
          notes: form.notes,
          bookingId: result.bookingId,
        },
      });
    } else {
      setSubmitError(result.error || "Booking failed. Please try again.");
    }
  }

  function goBack() {
    if (step === 0) { navigate("/"); return; }
    if (step === 2) { setStep(1); return; }
    setStep(step - 1);
  }

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{
        padding: "16px 24px",
        display: "flex", alignItems: "center", gap: 16,
        maxWidth: 480, margin: "0 auto",
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
          &larr;
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{config.brand}</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            Step {step + 1} of 3
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 24px 8px" }}>
        <div style={{
          height: 3, backgroundColor: "rgba(255,255,255,0.06)",
          borderRadius: 2, overflow: "hidden",
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
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.5px" }}>
          {STEP_LABELS[step]}
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 28 }}>
          {step === 0 && "What would you like today?"}
          {step === 1 && `${selectedService.name} \u2014 \u20B9${selectedService.price}`}
          {step === 2 && `${selectedService.name} \u00B7 ${formatDate(selectedDate)} \u00B7 ${formatSlotDisplayInline(selectedSlot)}`}
        </p>

        {/* Error banner */}
        {submitError && (
          <div style={{
            padding: "12px 16px", marginBottom: 20,
            backgroundColor: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 12, fontSize: 13, color: "#ef4444",
          }}>
            {submitError}
          </div>
        )}

        {/* Step 0 */}
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

        {/* Step 1 */}
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

        {/* Step 2 */}
        {step === 2 && (
          <BookingForm
            onSubmit={handleFormSubmit}
            loading={submitting}
            initialData={formData}
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

const SESSION_KEY = "bookingFlowState";
const RECEIPT_KEY = "bookingReceipts";
const SESSION_TTL = 30 * 60 * 1000; // 30 minutes
const RECEIPT_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

// ── Session storage (booking flow state — survives refresh, clears on tab close) ──

export function saveBookingState(state) {
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        step: state.step,
        selectedService: state.selectedService,
        selectedDate: state.selectedDate,
        selectedSlot: state.selectedSlot,
        formData: state.formData,
        savedAt: new Date().toISOString(),
      })
    );
  } catch {}
}

export function loadBookingState() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const state = JSON.parse(raw);

    // Expire after 30 minutes
    if (Date.now() - new Date(state.savedAt).getTime() > SESSION_TTL) {
      clearBookingState();
      return null;
    }

    // Don't resume if the saved date is now in the past
    if (state.selectedDate) {
      const saved = new Date(state.selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (saved < today) {
        clearBookingState();
        return null;
      }
    }

    return state;
  } catch {
    clearBookingState();
    return null;
  }
}

export function clearBookingState() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

// ── Local storage receipts (duplicate prevention — persists across sessions) ──

export function saveBookingReceipt(booking) {
  try {
    const receipts = JSON.parse(localStorage.getItem(RECEIPT_KEY) || "[]");
    receipts.push({
      bookingId: booking.bookingId,
      date: booking.date,
      phone: booking.phone,
      email: booking.email || "",
      bookedAt: new Date().toISOString(),
    });

    // Cleanup old receipts
    const cutoff = Date.now() - RECEIPT_TTL;
    const filtered = receipts.filter(
      (r) => new Date(r.bookedAt).getTime() > cutoff
    );
    localStorage.setItem(RECEIPT_KEY, JSON.stringify(filtered));
  } catch {}
}

export function hasExistingBooking(date, phone, email) {
  try {
    const receipts = JSON.parse(localStorage.getItem(RECEIPT_KEY) || "[]");
    return receipts.some(
      (r) =>
        r.date === date &&
        (r.phone === phone || (email && r.email && r.email === email))
    );
  } catch {
    return false;
  }
}

// ── Idempotency key ──

export function generateIdempotencyKey() {
  return crypto.randomUUID();
}

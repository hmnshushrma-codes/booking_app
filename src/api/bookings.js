const API_BASE = import.meta.env.VITE_API_BASE || "https://api.book.oyenino.com";

export async function getAvailableSlots(serviceId, date) {
  const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : date;
  const res = await fetch(`${API_BASE}/slots/${serviceId}/${dateStr}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch slots");
  }
  return res.json();
}

export async function getBookingById(bookingId) {
  const res = await fetch(`${API_BASE}/bookings/${bookingId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Booking not found");
  }
  return res.json();
}

export async function createBooking(payload) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: data.error || "Booking failed" };
  }
  return data;
}

export async function joinWaitlist(payload) {
  const res = await fetch(`${API_BASE}/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: data.error || "Failed to join waitlist" };
  }
  return data;
}

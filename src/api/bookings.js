import config from "../config.js";
import { generateSlots } from "../utils/slots.js";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// BACKEND: Replace mock implementations with:
// const BASE_URL = "https://api.yourdomain.workers.dev";
// return fetch(`${BASE_URL}/slots?serviceId=${serviceId}&date=${date}`).then(r => r.json());
// Hono + Cloudflare D1 backend — coming in Episode 3

function hashDate(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export async function getAvailableSlots(serviceId, date) {
  await delay(800);
  const allSlots = generateSlots(config.workingHours, config.slotIntervalMinutes);
  const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : date;
  const seed = hashDate(dateStr + serviceId);

  // Mock: mark 3–4 random slots as booked (deterministic per date+service)
  const bookedCount = 3 + (seed % 2);
  const bookedIndices = new Set();
  let s = seed;
  while (bookedIndices.size < bookedCount && bookedIndices.size < allSlots.length) {
    s = (s * 9301 + 49297) % 233280;
    bookedIndices.add(s % allSlots.length);
  }

  const slots = allSlots.map((time, i) => ({
    time,
    available: !bookedIndices.has(i),
  }));

  return { slots };
}

export async function createBooking(payload) {
  // BACKEND: return fetch(`${BASE_URL}/bookings`, { method: "POST", body: JSON.stringify(payload) }).then(r => r.json());
  await delay(800);
  const bookingId = "NR-" + String(Math.floor(100000 + Math.random() * 900000));
  return { success: true, bookingId };
}

export async function joinWaitlist(payload) {
  // BACKEND: return fetch(`${BASE_URL}/waitlist`, { method: "POST", body: JSON.stringify(payload) }).then(r => r.json());
  await delay(800);
  return { success: true };
}

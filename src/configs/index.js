// ─────────────────────────────────────────────────────────────
// CLINIC CONFIG
// ─────────────────────────────────────────────────────────────
export const clinic = {
  type: "clinic",
  brand: "Sharma Clinic",
  tagline: "Book your consultation",
  providerLabel: "with Dr. Sharma",
  accent: "#14b8a6",
  accentSoft: "#ecfdf5",
  slotType: "time", // "time" | "date"
  services: [
    { id: "c1", name: "General Consultation", meta: "30 min", price: "₹500" },
    { id: "c2", name: "Follow-up Visit",       meta: "15 min", price: "₹300" },
    { id: "c3", name: "Health Check-up",       meta: "45 min", price: "₹900" },
  ],
  slots: ["10:00 AM", "11:30 AM", "2:00 PM", "4:00 PM", "5:30 PM", "6:00 PM"],
};

// ─────────────────────────────────────────────────────────────
// BARBER CONFIG
// ─────────────────────────────────────────────────────────────
export const barber = {
  type: "barber",
  brand: "Fade Factory",
  tagline: "Grab your chair",
  providerLabel: "with Arjun",
  accent: "#f59e0b",
  accentSoft: "#fffbeb",
  slotType: "time",
  services: [
    { id: "b1", name: "Haircut",           meta: "45 min", price: "₹250" },
    { id: "b2", name: "Beard Trim",        meta: "20 min", price: "₹150" },
    { id: "b3", name: "Cut + Beard Combo", meta: "60 min", price: "₹350" },
  ],
  slots: ["11:00 AM", "12:00 PM", "1:00 PM", "3:30 PM", "5:00 PM", "7:00 PM"],
};

// ─────────────────────────────────────────────────────────────
// HOMESTAY CONFIG
// ─────────────────────────────────────────────────────────────
export const homestay = {
  type: "homestay",
  brand: "Pine View Homestay",
  tagline: "Reserve your stay",
  providerLabel: "Manali, Himachal Pradesh",
  accent: "#a78bfa",
  accentSoft: "#f5f3ff",
  slotType: "date",
  services: [
    { id: "h1", name: "Deluxe Room",      meta: "Max 2 guests", price: "₹2,400/night", maxGuests: 2 },
    { id: "h2", name: "Family Suite",     meta: "Max 4 guests", price: "₹3,800/night", maxGuests: 4 },
    { id: "h3", name: "Mountain Cottage", meta: "Max 6 guests", price: "₹5,500/night", maxGuests: 6 },
  ],
  slots: ["Jun 27–28", "Jun 28–30", "Jul 1–3", "Jul 4–6", "Jul 10–12", "Jul 15–18"],
};

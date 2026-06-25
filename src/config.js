// ─────────────────────────────────────────────────────────────
//  YOUR BUSINESS CONFIG
//  This is the only file you need to change.
//  Swap this object to change the entire booking platform.
// ─────────────────────────────────────────────────────────────

const config = {
  type: "clinic",              // clinic | barber | homestay | hotel
  brand: "Sharma Clinic",      // Your business name
  tagline: "Book your consultation", // One-line tagline
  providerLabel: "with Dr. Sharma",  // Who is providing the service
  accent: "#14b8a6",           // Your brand color (hex)
  accentSoft: "#ecfdf5",       // Light version of brand color
  slotType: "time",            // "time" for clinics/salons, "date" for stays

  // List your services
  services: [
    { id: "s1", name: "General Consultation", meta: "30 min", price: "₹500" },
    { id: "s2", name: "Follow-up Visit",       meta: "15 min", price: "₹300" },
    { id: "s3", name: "Health Check-up",       meta: "45 min", price: "₹900" },
  ],

  // Your available time slots (or date ranges for stays)
  slots: ["10:00 AM", "11:30 AM", "2:00 PM", "4:00 PM", "5:30 PM", "6:00 PM"],
};

export default config;

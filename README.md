# Booking Platform

> **One skeleton. Any business.**
> Config-driven booking platform — clinic, salon, homestay, hotel. Built with oye.nino.

Live demo: [book.oyenino.com](https://book.oyenino.com)

---

## What is this?

A booking platform where **one codebase** powers any business — just swap the config. No rewriting, no duplicate code. Clinic, barber, homestay, or anything else.

The magic is in `src/config.js`. That's the only file you need to change.

---

## Quick start

```bash
npm install
npm run dev
```

---

## Make it yours — edit `src/config.js`

```js
const config = {
  type: "clinic",
  brand: "Sharma Clinic",
  tagline: "Book your consultation",
  providerLabel: "with Dr. Sharma",
  accent: "#14b8a6",       // your brand color
  accentSoft: "#ecfdf5",   // light version
  slotType: "time",        // "time" or "date"

  services: [
    { id: "s1", name: "General Consultation", meta: "30 min", price: "₹500" },
    { id: "s2", name: "Follow-up Visit",       meta: "15 min", price: "₹300" },
  ],

  slots: ["10:00 AM", "11:30 AM", "2:00 PM", "4:00 PM"],
};
```

---

## Demo — switch businesses via URL

```
/?type=clinic    → Sharma Clinic (teal)
/?type=barber    → Fade Factory (amber)
/?type=homestay  → Pine View Homestay (purple)
```

---

## Series roadmap

This frontend is **Episode 2** of the oye.nino Zero Investment series.

| Episode | What we build |
|---------|---------------|
| Ep 0    | Introduction + problem framing |
| Ep 1    | Design — skeleton, feel, UX |
| **Ep 2**| **Frontend — this repo** |
| Ep 3    | Backend — Hono + Cloudflare D1 |
| Ep 4    | Admin page |
| Ep 5    | Google Sheets integration |
| Ep 6    | Deploy live, free |

---

## Stack

- React 18 + Vite
- Zero external UI libraries
- Config-driven theming
- Coming next: Hono + Cloudflare D1 backend

---

## Deploy

### Cloudflare Pages (free)

```bash
npm run build
# Upload dist/ to Cloudflare Pages
```

### Vercel / Netlify

```bash
npm run build
# Deploy dist/ folder
```

---

## License

MIT — fork it, use it, build your business.

---

*Built with oye.nino · [oyenino.com](https://oyenino.com) · Making tech simple.*

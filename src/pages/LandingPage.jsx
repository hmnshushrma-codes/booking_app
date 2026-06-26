import { useEffect, useRef, useState } from "react";
import config from "../config.js";
import Navbar from "../components/Navbar.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import Footer from "../components/Footer.jsx";

const HERO_IMG = "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750";
const GALLERY = [
  "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg?auto=compress&cs=tinysrgb&w=600",
];

const USPS = [
  { icon: "⚡", title: "Instant Booking", desc: "Pick a slot, confirm — done in 30 seconds." },
  { icon: "✂️", title: "Expert Stylists", desc: "Trained professionals who know their craft." },
  { icon: "💰", title: "Transparent Pricing", desc: "No hidden charges. What you see is what you pay." },
];

function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

function FadeSection({ children, style }) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ number, label }) {
  return (
    <p style={{
      fontSize: 12,
      fontWeight: 500,
      color: "rgba(255,255,255,0.3)",
      letterSpacing: "1px",
      marginBottom: 24,
      fontFamily: "ui-monospace, monospace",
      textTransform: "uppercase",
    }}>
      {number} / {label}
    </p>
  );
}

export default function LandingPage({ onBookNow, onServiceSelect }) {
  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar onBookNow={onBookNow} />

      {/* ── Hero ── */}
      <section style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundColor: "rgba(0,0,0,0.65)",
        }} />
        <div style={{
          position: "relative", zIndex: 1,
          textAlign: "center",
          padding: "0 24px",
          maxWidth: 480,
        }}>
          <h1 style={{
            fontSize: 42,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 16,
            letterSpacing: "-1px",
          }}>
            {config.brand}
          </h1>
          <p style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 36,
            lineHeight: 1.5,
          }}>
            {config.tagline}
          </p>
          <button
            onClick={onBookNow}
            style={{
              padding: "16px 36px",
              backgroundColor: config.accent,
              color: "#0a0a0a",
              border: "none",
              borderRadius: 50,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              minHeight: 52,
            }}
          >
            Book your slot →
          </button>
        </div>
      </section>

      {/* ── Services ── */}
      <section style={{ padding: "80px 24px", maxWidth: 480, margin: "0 auto" }}>
        <FadeSection>
          <SectionLabel number="01" label="services" />
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.5px" }}>
            Our Services
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 28, lineHeight: 1.5 }}>
            Tap a service to book directly.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {config.services.map((svc) => (
              <ServiceCard
                key={svc.id}
                service={svc}
                selected={false}
                onClick={() => onServiceSelect(svc)}
              />
            ))}
          </div>
        </FadeSection>
      </section>

      {/* ── Gallery ── */}
      <section style={{ padding: "40px 24px 80px", maxWidth: 480, margin: "0 auto" }}>
        <FadeSection>
          <SectionLabel number="02" label="our work" />
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24, letterSpacing: "-0.5px" }}>
            Gallery
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}>
            {GALLERY.map((src, i) => (
              <div key={i} style={{
                borderRadius: 16,
                overflow: "hidden",
                aspectRatio: "1",
                backgroundColor: "rgba(255,255,255,0.04)",
              }}>
                <img
                  src={src}
                  alt={`Salon work ${i + 1}`}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* ── Why Us ── */}
      <section style={{ padding: "40px 24px 80px", maxWidth: 480, margin: "0 auto" }}>
        <FadeSection>
          <SectionLabel number="03" label="why us" />
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28, letterSpacing: "-0.5px" }}>
            Why Noir Salon?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {USPS.map((usp, i) => (
              <div key={i} style={{
                padding: 20,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{usp.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{usp.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, margin: 0 }}>
                  {usp.desc}
                </p>
              </div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ padding: "40px 24px 80px", maxWidth: 480, margin: "0 auto" }}>
        <FadeSection>
          <div style={{
            textAlign: "center",
            padding: "48px 24px",
            borderRadius: 24,
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
              Ready for your new look?
            </h2>
            <p style={{
              fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 28,
            }}>
              Book in seconds. No calls needed.
            </p>
            <button
              onClick={onBookNow}
              style={{
                padding: "16px 36px",
                backgroundColor: config.accent,
                color: "#0a0a0a",
                border: "none",
                borderRadius: 50,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                minHeight: 52,
              }}
            >
              Book your slot →
            </button>
          </div>
        </FadeSection>
      </section>

      <Footer />
    </div>
  );
}

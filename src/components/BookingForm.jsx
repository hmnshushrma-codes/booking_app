import { useState } from "react";
import config from "../config.js";

const VALIDATORS = {
  name: (v) => {
    if (!v.trim()) return "Name is required";
    if (v.trim().length < 2) return "Min 2 characters";
    if (/\d/.test(v)) return "Name cannot contain numbers";
    return "";
  },
  phone: (v) => {
    if (!v.trim()) return "Phone is required";
    if (!/^\d{10}$/.test(v.trim())) return "Must be 10 digits";
    if (!/^[6-9]/.test(v.trim())) return "Must start with 6, 7, 8, or 9";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "Invalid email format";
    return "";
  },
  notes: (v) => {
    if (v.length > 200) return "Max 200 characters";
    return "";
  },
};

export default function BookingForm({ onSubmit, loading, initialData }) {
  const [form, setForm] = useState(initialData || { name: "", phone: "", email: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(field, value) {
    if (field === "notes" && value.length > 200) return;
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) {
      setErrors((e) => ({ ...e, [field]: VALIDATORS[field](value) }));
    }
  }

  function handleBlur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: VALIDATORS[field](form[field]) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    for (const field of Object.keys(VALIDATORS)) {
      newErrors[field] = VALIDATORS[field](form[field]);
    }
    setErrors(newErrors);
    setTouched({ name: true, phone: true, email: true, notes: true });
    if (Object.values(newErrors).some((e) => e)) return;
    onSubmit(form);
  }

  const isValid = !VALIDATORS.name(form.name) && !VALIDATORS.phone(form.phone) && !VALIDATORS.email(form.email);

  return (
    <form onSubmit={handleSubmit}>
      <Field
        label="Full Name"
        value={form.name}
        onChange={(v) => handleChange("name", v)}
        onBlur={() => handleBlur("name")}
        error={touched.name && errors.name}
        placeholder="Raj Kumar"
        required
      />
      <Field
        label="Phone Number"
        value={form.phone}
        onChange={(v) => handleChange("phone", v)}
        onBlur={() => handleBlur("phone")}
        error={touched.phone && errors.phone}
        placeholder="98765 43210"
        type="tel"
        prefix="+91"
        required
      />
      <Field
        label="Email"
        value={form.email}
        onChange={(v) => handleChange("email", v)}
        onBlur={() => handleBlur("email")}
        error={touched.email && errors.email}
        placeholder="raj@example.com"
        type="email"
        optional
      />
      <div style={{ marginBottom: 20 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 8,
        }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
            Notes / Special Requests
            <span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.3)", marginLeft: 6 }}>
              optional
            </span>
          </label>
          <span style={{
            fontSize: 11, color: form.notes.length > 180 ? config.accent : "rgba(255,255,255,0.3)",
          }}>
            {form.notes.length}/200
          </span>
        </div>
        <textarea
          value={form.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          onBlur={() => handleBlur("notes")}
          placeholder="Any special requests..."
          rows={3}
          style={{
            width: "100%",
            padding: "14px 16px",
            backgroundColor: "rgba(255,255,255,0.06)",
            border: errors.notes ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            color: "#ffffff",
            fontSize: 14,
            fontFamily: "inherit",
            resize: "vertical",
            outline: "none",
          }}
        />
        {touched.notes && errors.notes && (
          <p style={{ fontSize: 12, color: "#ef4444", margin: "6px 0 0" }}>{errors.notes}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        style={{
          width: "100%",
          padding: "16px",
          backgroundColor: isValid && !loading ? config.accent : "rgba(255,255,255,0.08)",
          color: isValid && !loading ? "#0a0a0a" : "rgba(255,255,255,0.3)",
          border: "none",
          borderRadius: 50,
          fontSize: 15,
          fontWeight: 700,
          cursor: isValid && !loading ? "pointer" : "not-allowed",
          fontFamily: "inherit",
          minHeight: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {loading ? (
          <>
            <span style={{
              width: 18, height: 18, border: "2px solid rgba(0,0,0,0.2)",
              borderTopColor: "#0a0a0a", borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.8s linear infinite",
            }} />
            Confirming...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        ) : (
          "Confirm Booking"
        )}
      </button>
    </form>
  );
}

function Field({ label, value, onChange, onBlur, error, placeholder, type = "text", prefix, required, optional }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
        {label}
        {required && <span style={{ color: config.accent, marginLeft: 3 }}>*</span>}
        {optional && (
          <span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.3)", marginLeft: 6 }}>
            optional
          </span>
        )}
      </label>
      <div style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.06)",
        border: error ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        overflow: "hidden",
      }}>
        {prefix && (
          <span style={{
            padding: "14px 0 14px 16px",
            fontSize: 14,
            color: "rgba(255,255,255,0.4)",
            fontWeight: 500,
          }}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: prefix ? "14px 16px 14px 8px" : "14px 16px",
            backgroundColor: "transparent",
            border: "none",
            color: "#ffffff",
            fontSize: 14,
            fontFamily: "inherit",
            outline: "none",
          }}
        />
      </div>
      {error && (
        <p style={{ fontSize: 12, color: "#ef4444", margin: "6px 0 0" }}>{error}</p>
      )}
    </div>
  );
}

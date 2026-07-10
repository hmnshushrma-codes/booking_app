import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config.js";
import {
  getTodayBookings,
  getWeekBookings,
  getBookingsByDate,
  cancelBooking,
  apiLogout,
  getAdminUser,
} from "../../api/admin.js";

const TABS = ["Today", "Weekly", "Day-wise"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const admin = getAdminUser();
  const [tab, setTab] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickedDate, setPickedDate] = useState(todayStr());
  const [cancelling, setCancelling] = useState(null);

  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  // Fetch data on tab change
  useEffect(() => {
    setLoading(true);
    setData(null);
    const fetchData = async () => {
      try {
        let result;
        if (tab === 0) result = await getTodayBookings();
        else if (tab === 1) result = await getWeekBookings();
        else result = await getBookingsByDate(pickedDate);
        setData(result);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, [tab, pickedDate]);

  async function handleCancel(id) {
    if (!confirm("Cancel this booking? The slot will be freed up.")) return;
    setCancelling(id);
    const result = await cancelBooking(id);
    setCancelling(null);
    if (result.success) {
      // Refresh current view
      setLoading(true);
      let result2;
      if (tab === 0) result2 = await getTodayBookings();
      else if (tab === 1) result2 = await getWeekBookings();
      else result2 = await getBookingsByDate(pickedDate);
      setData(result2);
      setLoading(false);
    }
  }

  async function handleLogout() {
    await apiLogout();
    navigate("/admin");
  }

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: 600, margin: "0 auto",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 16, fontWeight: 800 }}>{config.brand}</span>
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              backgroundColor: config.accent, display: "inline-block", marginLeft: 2,
            }} />
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            Admin {admin?.name ? `\u2014 ${admin.name}` : ""}
          </p>
        </div>
        <button onClick={handleLogout}
          style={{
            padding: "8px 16px", backgroundColor: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 8, padding: "16px 24px",
        maxWidth: 600, margin: "0 auto",
      }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            style={{
              padding: "10px 16px", borderRadius: 50, fontSize: 13, fontWeight: 600,
              fontFamily: "inherit", cursor: "pointer", border: "none",
              backgroundColor: tab === i ? config.accent : "rgba(255,255,255,0.06)",
              color: tab === i ? "#0a0a0a" : "rgba(255,255,255,0.6)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Date picker for day-wise */}
      {tab === 2 && (
        <div style={{ padding: "0 24px 8px", maxWidth: 600, margin: "0 auto" }}>
          <input
            type="date" value={pickedDate}
            onChange={(e) => setPickedDate(e.target.value)}
            style={{
              padding: "10px 14px", backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
              color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none",
              colorScheme: "dark",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "16px 24px 48px", maxWidth: 600, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{
              width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)",
              borderTopColor: config.accent, borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : tab === 1 && data?.days ? (
          <WeekView data={data} onCancel={handleCancel} cancelling={cancelling} />
        ) : data?.bookings ? (
          <DayView
            date={data.date}
            bookings={data.bookings}
            summary={data.summary}
            onCancel={handleCancel}
            cancelling={cancelling}
          />
        ) : (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 48 }}>
            No data available
          </p>
        )}
      </div>
    </div>
  );
}

// ── Day View ──

function DayView({ date, bookings, summary, onCancel, cancelling }) {
  const dateObj = new Date(date + "T00:00:00");
  const dayName = dateObj.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{dayName}</h2>
      <SummaryBar summary={summary} />

      {bookings.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, textAlign: "center", padding: 40 }}>
          No bookings for this day
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bookings.map((b) => (
            <BookingCard key={b.id} booking={b} onCancel={onCancel} cancelling={cancelling} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Week View ──

function WeekView({ data, onCancel, cancelling }) {
  const [expandedDay, setExpandedDay] = useState(null);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
        Week: {formatShortDate(data.weekStart)} &ndash; {formatShortDate(data.weekEnd)}
      </h2>
      <SummaryBar summary={data.weekSummary} />

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
        {data.days.map((day) => {
          const isExpanded = expandedDay === day.date;
          const maxBookings = Math.max(...data.days.map((d) => d.summary.total), 1);
          const barWidth = (day.summary.total / maxBookings) * 100;
          const isToday = day.date === new Date().toISOString().split("T")[0];

          return (
            <div key={day.date}>
              <button
                onClick={() => setExpandedDay(isExpanded ? null : day.date)}
                style={{
                  width: "100%", padding: "14px 16px", textAlign: "left",
                  backgroundColor: isExpanded ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                  border: isToday ? `1px solid ${config.accent}40` : "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
                    {day.dayName.slice(0, 3)} {day.date.slice(8)}
                    {isToday && (
                      <span style={{
                        fontSize: 10, backgroundColor: config.accent, color: "#0a0a0a",
                        padding: "2px 6px", borderRadius: 4, marginLeft: 8, fontWeight: 700,
                      }}>
                        TODAY
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    {day.summary.total} bookings &middot; &#x20B9;{day.summary.revenue.toLocaleString("en-IN")}
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{
                  height: 4, backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: 2, overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", width: `${barWidth}%`,
                    backgroundColor: day.summary.total > 0 ? config.accent : "transparent",
                    borderRadius: 2, transition: "width 0.3s ease",
                  }} />
                </div>
              </button>

              {/* Expanded bookings */}
              {isExpanded && day.bookings.length > 0 && (
                <div style={{
                  marginTop: 4, marginLeft: 12, marginBottom: 4,
                  display: "flex", flexDirection: "column", gap: 8,
                }}>
                  {day.bookings.map((b) => (
                    <BookingCard key={b.id} booking={b} onCancel={onCancel} cancelling={cancelling} compact />
                  ))}
                </div>
              )}
              {isExpanded && day.bookings.length === 0 && (
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginLeft: 12, marginTop: 4 }}>
                  No bookings
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Summary Bar ──

function SummaryBar({ summary }) {
  return (
    <div style={{
      display: "flex", gap: 12, marginBottom: 20, marginTop: 8,
      flexWrap: "wrap",
    }}>
      <Stat label="Total" value={summary.total} />
      <Stat label="Confirmed" value={summary.confirmed} color="#22c55e" />
      <Stat label="Cancelled" value={summary.cancelled} color="#ef4444" />
      <Stat label="Revenue" value={`\u20B9${summary.revenue.toLocaleString("en-IN")}`} color={config.accent} />
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{
      padding: "10px 14px", borderRadius: 10,
      backgroundColor: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0, marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 16, fontWeight: 700, margin: 0, color: color || "#fff" }}>{value}</p>
    </div>
  );
}

// ── Booking Card ──

function BookingCard({ booking, onCancel, cancelling, compact }) {
  const b = booking;
  const isCancelled = b.status === "cancelled";
  const time = formatTime(b.time);

  return (
    <div style={{
      padding: compact ? "12px 14px" : "16px",
      borderRadius: 12,
      backgroundColor: isCancelled ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.04)",
      border: isCancelled ? "1px solid rgba(239,68,68,0.1)" : "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: compact ? 12 : 13, fontWeight: 700, color: config.accent,
              minWidth: 70,
            }}>
              {time}
            </span>
            <span style={{ fontSize: compact ? 12 : 13, fontWeight: 600, color: "#fff" }}>
              {b.name}
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            <span>{b.serviceName}</span>
            <span>&#x260E; {b.phone}</span>
            {b.email && <span>{b.email}</span>}
          </div>
          {b.notes && (
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "6px 0 0", fontStyle: "italic" }}>
              "{b.notes}"
            </p>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
            backgroundColor: isCancelled ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
            color: isCancelled ? "#ef4444" : "#22c55e",
            textTransform: "uppercase",
          }}>
            {b.status}
          </span>
          {!isCancelled && (
            <button
              onClick={() => onCancel(b.id)}
              disabled={cancelling === b.id}
              style={{
                padding: "4px 10px", fontSize: 11, fontWeight: 600,
                backgroundColor: "transparent",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444", borderRadius: 6,
                cursor: cancelling === b.id ? "not-allowed" : "pointer",
                fontFamily: "inherit", opacity: cancelling === b.id ? 0.5 : 1,
              }}
            >
              {cancelling === b.id ? "..." : "Cancel"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──

function formatTime(time) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${displayH}:${String(m).padStart(2, "0")} ${suffix}`;
}

function formatShortDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

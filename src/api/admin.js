const API_BASE = import.meta.env.VITE_API_BASE || "https://api.book.oyenino.com";

// All admin requests include credentials so the HttpOnly cookie is sent
const FETCH_OPTS = { credentials: "include" };

function handleAuthError(res) {
  if (res.status === 401) {
    localStorage.removeItem("adminUser");
    window.location.href = "/admin";
    throw new Error("Unauthorized");
  }
}

export async function login(secretKey, email, password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Key": secretKey,
    },
    body: JSON.stringify({ email, password }),
    ...FETCH_OPTS,
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error || "Login failed" };
  // Only store admin display info (JWT is in HttpOnly cookie)
  localStorage.setItem("adminUser", JSON.stringify(data.admin));
  return { success: true, admin: data.admin };
}

export async function apiLogout() {
  await fetch(`${API_BASE}/admin/logout`, {
    method: "POST",
    ...FETCH_OPTS,
  });
  localStorage.removeItem("adminUser");
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_BASE}/admin/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    ...FETCH_OPTS,
  });
  return res.json();
}

export async function verifyOtp(email, code) {
  const res = await fetch(`${API_BASE}/admin/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
    ...FETCH_OPTS,
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error || "Verification failed" };
  return { success: true, resetToken: data.resetToken };
}

export async function resetPassword(resetToken, newPassword) {
  const res = await fetch(`${API_BASE}/admin/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resetToken, newPassword }),
    ...FETCH_OPTS,
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error || "Reset failed" };
  return { success: true };
}

export async function getTodayBookings() {
  const res = await fetch(`${API_BASE}/admin/bookings/today`, FETCH_OPTS);
  handleAuthError(res);
  return res.json();
}

export async function getWeekBookings() {
  const res = await fetch(`${API_BASE}/admin/bookings/week`, FETCH_OPTS);
  handleAuthError(res);
  return res.json();
}

export async function getBookingsByDate(date) {
  const res = await fetch(`${API_BASE}/admin/bookings/${date}`, FETCH_OPTS);
  handleAuthError(res);
  return res.json();
}

export async function cancelBooking(id) {
  const res = await fetch(`${API_BASE}/admin/bookings/${id}/cancel`, {
    method: "PATCH",
    ...FETCH_OPTS,
  });
  handleAuthError(res);
  return res.json();
}

export function getAdminUser() {
  try {
    return JSON.parse(localStorage.getItem("adminUser"));
  } catch {
    return null;
  }
}

// Check if admin session likely exists (cookie is HttpOnly so we can't read it,
// but we keep adminUser in localStorage as a hint — real auth check happens server-side)
export function isLoggedIn() {
  return !!localStorage.getItem("adminUser");
}

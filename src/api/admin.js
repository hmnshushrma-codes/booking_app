const API_BASE = import.meta.env.VITE_API_BASE || "https://api.book.oyenino.com";

function authHeaders() {
  const token = localStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function handleAuthError(res) {
  if (res.status === 401) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin";
    throw new Error("Unauthorized");
  }
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error || "Login failed" };
  // Store token and admin info
  localStorage.setItem("adminToken", data.token);
  localStorage.setItem("adminUser", JSON.stringify(data.admin));
  return { success: true, admin: data.admin };
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_BASE}/admin/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function verifyOtp(email, code) {
  const res = await fetch(`${API_BASE}/admin/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
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
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error || "Reset failed" };
  return { success: true };
}

export async function getTodayBookings() {
  const res = await fetch(`${API_BASE}/admin/bookings/today`, {
    headers: authHeaders(),
  });
  handleAuthError(res);
  return res.json();
}

export async function getWeekBookings() {
  const res = await fetch(`${API_BASE}/admin/bookings/week`, {
    headers: authHeaders(),
  });
  handleAuthError(res);
  return res.json();
}

export async function getBookingsByDate(date) {
  const res = await fetch(`${API_BASE}/admin/bookings/${date}`, {
    headers: authHeaders(),
  });
  handleAuthError(res);
  return res.json();
}

export async function cancelBooking(id) {
  const res = await fetch(`${API_BASE}/admin/bookings/${id}/cancel`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  handleAuthError(res);
  return res.json();
}

export function logout() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
}

export function getAdminUser() {
  try {
    return JSON.parse(localStorage.getItem("adminUser"));
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  const token = localStorage.getItem("adminToken");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

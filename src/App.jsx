import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import ConfirmationPage from "./pages/ConfirmationPage.jsx";
import SlotsUnavailable from "./pages/SlotsUnavailable.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminGuard from "./components/AdminGuard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
        <Route path="/slots-unavailable" element={<SlotsUnavailable />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/forgot" element={<AdminForgotPassword />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

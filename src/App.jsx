import { useState } from "react";
import LandingPage from "./pages/LandingPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import ConfirmationPage from "./pages/ConfirmationPage.jsx";
import SlotsUnavailable from "./pages/SlotsUnavailable.jsx";

export default function App() {
  const [page, setPage] = useState("landing");
  const [preSelectedService, setPreSelectedService] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [unavailableInfo, setUnavailableInfo] = useState(null);

  function goToBooking(service) {
    setPreSelectedService(service || null);
    setPage("booking");
    window.scrollTo(0, 0);
  }

  function goToConfirmation(data) {
    setBookingResult(data);
    setPage("confirmation");
    window.scrollTo(0, 0);
  }

  function goToSlotsUnavailable(info) {
    setUnavailableInfo(info);
    setPage("slotsUnavailable");
    window.scrollTo(0, 0);
  }

  function goToLanding() {
    setPage("landing");
    window.scrollTo(0, 0);
  }

  if (page === "landing") {
    return (
      <LandingPage
        onBookNow={() => goToBooking()}
        onServiceSelect={(svc) => goToBooking(svc)}
      />
    );
  }

  if (page === "booking") {
    return (
      <BookingPage
        preSelectedService={preSelectedService}
        onBack={goToLanding}
        onConfirm={goToConfirmation}
        onSlotsUnavailable={goToSlotsUnavailable}
      />
    );
  }

  if (page === "confirmation") {
    return (
      <ConfirmationPage
        booking={bookingResult}
        onBookAnother={() => goToBooking()}
      />
    );
  }

  if (page === "slotsUnavailable") {
    return (
      <SlotsUnavailable
        info={unavailableInfo}
        onTryAnother={() => goToBooking(unavailableInfo.service)}
        onChooseDifferent={() => goToBooking()}
      />
    );
  }

  return null;
}

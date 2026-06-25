import BookingFlow from "./components/BookingFlow.jsx";
import defaultConfig from "./config.js";
import { clinic, barber, homestay } from "./configs/index.js";

// URL param switcher — for demo: ?type=clinic | barber | homestay
// In production, just export your config from config.js and remove this
const CONFIGS = { clinic, barber, homestay };

function getConfig() {
  const params = new URLSearchParams(window.location.search);
  const type   = params.get("type");
  return CONFIGS[type] ?? defaultConfig;
}

export default function App() {
  const config = getConfig();
  return <BookingFlow config={config} />;
}

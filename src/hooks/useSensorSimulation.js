
import { useEffect, useState } from "react";

const MAX_HISTORY = 20;

// Rumus THI sementara untuk demonstrasi UI.
// Sesuaikan dengan rumus dari tim hardware.
function calculateTHI(temp, humidity) {
  return temp - (0.55 - 0.0055 * humidity) * (temp - 14.5);
}

// Ambang sementara untuk simulasi UI.
const DEMO_THRESHOLDS = {
  thi: 29,
  ammonia: 15,
};

function generateReading() {
  const temperature = +(27 + Math.random() * 6).toFixed(1);
  const humidity = Math.round(60 + Math.random() * 22);
  const ammonia = +(5 + Math.random() * 18).toFixed(1);

  const thi = +calculateTHI(
    temperature,
    humidity
  ).toFixed(1);

  // Simulasi keputusan aktuator.
  const fanOn = thi > DEMO_THRESHOLDS.thi;
  const nozzleOn = ammonia > DEMO_THRESHOLDS.ammonia;

  return {
    timestamp: Date.now(),

    time: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),

    temperature,
    humidity,
    thi,
    ammonia,

    // Status aktuator saat data dibaca.
    fanOn,
    nozzleOn,
  };
}

export default function useSensorSimulation() {
  const [history, setHistory] = useState(() => [
    generateReading(),
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory((previous) => [
        ...previous.slice(-(MAX_HISTORY - 1)),
        generateReading(),
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const latest = history[history.length - 1];

  return {
    latest,
    history,
    thresholds: DEMO_THRESHOLDS,
    fanOn: latest.fanOn,
    nozzleOn: latest.nozzleOn,
  };
}

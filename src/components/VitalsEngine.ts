import { useState, useEffect } from "react";

export interface Vitals {
  heartRate: number;
  bloodPressure: string;
  respiration: number;
  brainActivity: number;
  oxygen: number;
}

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const useMockVitals = () => {
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 75,
    bloodPressure: "120/80",
    respiration: 16,
    brainActivity: 80,
    oxygen: 98,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals({
        heartRate: random(60, 90),
        bloodPressure: `${random(110,130)}/${random(70,90)}`,
        respiration: random(12, 20),
        brainActivity: random(70, 100),
        oxygen: random(95, 100),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return vitals;
};

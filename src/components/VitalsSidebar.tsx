import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface VitalsSidebarProps {
  vitals: {
    heartRate?: number;
    bloodPressure?: string;
    respiration?: number;
    brainActivity?: number;
    oxygen?: number;
  } | null;
}

export const VitalsSidebar: React.FC<VitalsSidebarProps> = ({ vitals }) => {
  if (!vitals) return null;
  return (
    <Card className="shadow-xl rounded-xl bg-gradient-to-br from-blue-900/80 to-purple-900/80 border border-blue-400/30 text-white backdrop-blur-md" style={{ minWidth: 220 }}>
      <CardHeader>
        <CardTitle className="font-headline text-lg text-cyan-300">Vitals Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div><span className="font-bold text-red-400">❤️ Heart Rate:</span> {vitals.heartRate} bpm</div>
        <div><span className="font-bold text-purple-400">🩸 Blood Pressure:</span> {vitals.bloodPressure}</div>
        <div><span className="font-bold text-blue-400">💨 Respiration:</span> {vitals.respiration} rpm</div>
        <div><span className="font-bold text-pink-400">🧠 Brain Activity:</span> {vitals.brainActivity} μV</div>
        <div><span className="font-bold text-cyan-400">🩸 SpO2:</span> {vitals.oxygen} %</div>
      </CardContent>
    </Card>
  );
};

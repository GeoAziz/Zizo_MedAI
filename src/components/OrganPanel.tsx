import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OrganPanelProps {
  organ: string;
  vitals: any;
  onClose: () => void;
}

export const OrganPanel: React.FC<OrganPanelProps> = ({ organ, vitals, onClose }) => {
  // Mock metrics and AI summary
  type OrganKey = "heart" | "lungs" | "brain" | "liver";
  type OrganMetric = {
    trend: (number | string)[];
    summary: string;
  };
  const metrics: Record<OrganKey, OrganMetric> = {
    heart: {
      trend: [72, 75, 78, 80, 76],
      summary: "Mild arrhythmia detected. No immediate risk."
    },
    lungs: {
      trend: [98, 97, 99, 98, 97],
      summary: "Oxygen levels stable."
    },
    brain: {
      trend: [80, 82, 78, 85, 83],
      summary: "Normal EEG activity."
    },
    liver: {
      trend: ["ALT: 32", "ALT: 30", "ALT: 31"],
      summary: "No signs of inflammation."
    }
  };
  const organKey = organ.toLowerCase() as OrganKey;
  const organMetrics: OrganMetric = metrics[organKey] || { trend: [], summary: "No data." };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-[400px] shadow-2xl rounded-xl bg-gradient-to-br from-blue-900/90 to-purple-900/90 border border-blue-400/30 text-white">
        <CardHeader>
          <CardTitle className="text-cyan-300">{organ} Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <strong>Trend:</strong> {organMetrics.trend.join(", ")}
          </div>
          <div className="mb-4">
            <strong>AI Summary:</strong> {organMetrics.summary}
          </div>
          <Button variant="outline" className="w-full mt-2" onClick={onClose}>Close</Button>
        </CardContent>
      </Card>
    </div>
  );
};

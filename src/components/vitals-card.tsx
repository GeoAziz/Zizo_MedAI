import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Thermometer, Wind, Droplets } from "lucide-react"; // Added Droplets for O2

interface VitalSignProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  colorClass: string;
}

function VitalSign({ icon: Icon, label, value, unit, colorClass }: VitalSignProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className={`rounded-full p-2 ${colorClass} bg-opacity-10`}>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-foreground">
          {value} <span className="text-xs text-muted-foreground">{unit}</span>
        </p>
      </div>
    </div>
  );
}

interface Vitals {
  heartRate: { value: string; unit: string };
  temperature: { value: string; unit: string };
  oxygen: { value: string; unit: string };
  // Add more vitals as needed
}

interface VitalsCardProps {
  vitals: Vitals;
  title?: string;
}

export function VitalsCard({ vitals, title = "Current Vitals" }: VitalsCardProps) {
  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <VitalSign
          icon={Heart}
          label="Heart Rate"
          value={vitals.heartRate.value}
          unit={vitals.heartRate.unit}
          colorClass="text-red-500"
        />
        <VitalSign
          icon={Thermometer}
          label="Temperature"
          value={vitals.temperature.value}
          unit={vitals.temperature.unit}
          colorClass="text-orange-500"
        />
        <VitalSign
          icon={Droplets} // Using Droplets as a proxy for Oxygen/SpO2
          label="Oxygen Sat."
          value={vitals.oxygen.value}
          unit={vitals.oxygen.unit}
          colorClass="text-blue-500"
        />
      </CardContent>
    </Card>
  );
}

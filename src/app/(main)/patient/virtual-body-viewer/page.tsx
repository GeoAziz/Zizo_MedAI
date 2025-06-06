import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scan, Activity, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function VirtualBodyViewerPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Virtual Body Viewer" description="Explore your health in an interactive 3D space." icon={Scan} />

      <Card className="shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
            <Scan className="w-7 h-7" /> Zizo_BioScan Interface
          </CardTitle>
          <CardDescription>Your personalized holographic health display.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col items-center justify-center bg-secondary/30 p-6 rounded-lg shadow-inner">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Holographic Body Display" 
              width={600} 
              height={400} 
              className="rounded-md shadow-lg"
              data-ai-hint="hologram body scan" 
            />
            <p className="mt-4 text-sm text-muted-foreground text-center">Interactive 3D Holographic Body Display (Conceptual)</p>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2"><Activity className="text-accent w-5 h-5"/>Real-time Vitals</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Heart Rate: 72 bpm</li>
                <li>Oxygen Saturation: 98%</li>
                <li>Body Temperature: 36.8°C</li>
                <li>Stress Level: Low</li>
              </ul>
              <p className="mt-2 text-xs text-accent">Syncs with linked wearables.</p>
            </div>
            <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2"><AlertCircle className="text-orange-500 w-5 h-5"/>Stress Zones & Alerts</h3>
              <p className="text-sm text-muted-foreground">Identifies areas of concern based on biometric data. No active alerts.</p>
            </div>
             <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-2">Smart Overlay Feature</h3>
              <p className="text-sm text-muted-foreground">Tap to zoom into organs, highlight risk regions, and view detailed information (Feature in development).</p>
            </div>
          </div>
        </CardContent>
      </Card>
       <p className="text-center text-sm text-muted-foreground">
        Note: The Virtual Body Viewer is a conceptual feature. Data shown is for illustrative purposes only.
      </p>
    </div>
  );
}

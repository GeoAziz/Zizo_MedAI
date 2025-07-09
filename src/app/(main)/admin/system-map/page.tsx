
"use client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Network, Wifi, ServerCrash, MapPin } from "lucide-react";
import Image from "next/image";

export default function AdminSystemMapPage() {
  const mockNodeStats = [
    { id: "node-01", name: "Zizo General Hospital", status: "Online", region: "City Center", load: "Normal", type: "Hospital" },
    { id: "node-02", name: "MediAI Clinic North", status: "Online", region: "North Suburbs", load: "Low", type: "Clinic" },
    { id: "node-03", name: "BioScan Diagnostics West", status: "Degraded", region: "West Tech Park", load: "High", type: "Diagnostics" },
    { id: "node-04", name: "Zizo Southpoint Clinic", status: "Offline", region: "South District", load: "N/A", type: "Clinic" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="System Map" description="Real-time visualization of all Zizo_MediAI interconnected nodes." icon={Map} />
      
      <Card className="shadow-xl rounded-xl">
        <CardHeader className="bg-primary/5">
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Network className="w-6 h-6" />Live Network Visualization</CardTitle>
          <CardDescription>Interactive map showing status, load, and connectivity of all facilities. (Map is a placeholder)</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex flex-col lg:flex-row items-stretch justify-center bg-secondary/30 p-4 gap-4">
           <div className="lg:w-2/3 flex items-center justify-center p-4 bg-background rounded-lg shadow-inner">
             <Image src="https://placehold.co/800x500.png" alt="System Map Placeholder" width={800} height={500} className="rounded-md shadow-md object-cover" data-ai-hint="network diagram city map" />
           </div>
           <div className="lg:w-1/3 space-y-3 p-4 bg-card rounded-lg shadow">
            <h3 className="font-semibold text-lg text-foreground border-b pb-2 mb-2">Node Status Overview</h3>
            {mockNodeStats.map(node => (
              <div key={node.id} className="p-3 border border-border rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-foreground flex items-center gap-1"><MapPin className="w-4 h-4 text-primary"/>{node.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    node.status === "Online" ? "bg-green-100 text-green-700" :
                    node.status === "Degraded" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>{node.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">{node.type} - {node.region}</p>
                <p className="text-xs text-muted-foreground">Load: <span className={`font-medium ${node.load === "High" ? "text-orange-500" : "text-foreground"}`}>{node.load}</span></p>
              </div>
            ))}
           </div>
        </CardContent>
      </Card>
       <p className="text-center text-sm text-muted-foreground">
        This system map is conceptual. In a real deployment, it would integrate with live monitoring data.
      </p>
    </div>
  );
}

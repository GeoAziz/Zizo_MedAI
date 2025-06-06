"use client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Hospital, Users, Hourglass, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";

interface QueueStatus {
  facilityName: string;
  currentWaitTime: number; // in minutes
  patientsInQueue: number;
  trend: 'stable' | 'increasing' | 'decreasing';
  lastUpdated: string;
  departments?: { name: string; waitTime: number; patients: number }[];
}

const mockQueueData: QueueStatus[] = [
  {
    facilityName: "Zizo General Hospital",
    currentWaitTime: 25,
    patientsInQueue: 12,
    trend: 'stable',
    lastUpdated: new Date().toLocaleTimeString(),
    departments: [
      { name: "Emergency", waitTime: 45, patients: 5 },
      { name: "General Practice", waitTime: 15, patients: 7 },
    ]
  },
  {
    facilityName: "MediAI Clinic North",
    currentWaitTime: 10,
    patientsInQueue: 3,
    trend: 'decreasing',
    lastUpdated: new Date().toLocaleTimeString(),
     departments: [
      { name: "Family Care", waitTime: 10, patients: 3 },
    ]
  },
  {
    facilityName: "BioScan Diagnostics Hub",
    currentWaitTime: 5,
    patientsInQueue: 2,
    trend: 'stable',
    lastUpdated: new Date().toLocaleTimeString(),
  },
];

export default function QueueStatusPage() {
  const [selectedFacility, setSelectedFacility] = useState<QueueStatus | null>(mockQueueData[0]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      // In a real app, you'd fetch new data here
    }, 5000); // Update time every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const handleFacilityChange = (facilityName: string) => {
    const facility = mockQueueData.find(f => f.facilityName === facilityName);
    setSelectedFacility(facility || null);
  };

  const getTrendIcon = (trend: 'stable' | 'increasing' | 'decreasing') => {
    if (trend === 'increasing') return <TrendingUp className="h-5 w-5 text-red-500" />;
    if (trend === 'decreasing') return <TrendingDown className="h-5 w-5 text-green-500" />;
    return <Hourglass className="h-5 w-5 text-yellow-500" />; // For stable
  };
  
  return (
    <div className="space-y-6">
      <PageHeader title="Live Queue Status" description="Real-time waiting times and facility load." icon={Clock} />

      <Card className="shadow-xl rounded-xl">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center bg-primary/5">
          <div>
            <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Hospital className="w-6 h-6"/>Select Facility</CardTitle>
            <CardDescription>View live queue information for a specific facility.</CardDescription>
          </div>
          <Select onValueChange={handleFacilityChange} defaultValue={selectedFacility?.facilityName}>
            <SelectTrigger className="w-full md:w-[300px] bg-input focus:ring-primary mt-4 md:mt-0">
              <SelectValue placeholder="Choose a facility" />
            </SelectTrigger>
            <SelectContent>
              {mockQueueData.map(f => (
                <SelectItem key={f.facilityName} value={f.facilityName}>{f.facilityName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        
        {selectedFacility ? (
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-6 bg-secondary/30 rounded-lg text-center shadow-md">
                <Clock className="h-10 w-10 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Current Wait Time</p>
                <p className="text-4xl font-bold text-primary">{selectedFacility.currentWaitTime} <span className="text-lg">min</span></p>
              </div>
              <div className="p-6 bg-secondary/30 rounded-lg text-center shadow-md">
                <Users className="h-10 w-10 text-accent mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Patients in Queue</p>
                <p className="text-4xl font-bold text-accent">{selectedFacility.patientsInQueue}</p>
              </div>
              <div className="p-6 bg-secondary/30 rounded-lg text-center shadow-md">
                <div className="mx-auto mb-2">{getTrendIcon(selectedFacility.trend)}</div>
                <p className="text-sm text-muted-foreground">Wait Time Trend</p>
                <p className="text-2xl font-semibold text-foreground capitalize">{selectedFacility.trend}</p>
              </div>
            </div>

            {selectedFacility.departments && selectedFacility.departments.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold font-headline text-foreground mb-3">Department Status</h3>
                <div className="space-y-3">
                  {selectedFacility.departments.map(dept => (
                    <div key={dept.name} className="p-4 border border-border rounded-lg flex justify-between items-center bg-card hover:bg-secondary/20 transition-colors">
                      <p className="font-medium text-foreground">{dept.name}</p>
                      <div className="text-right">
                        <p className="text-primary">{dept.waitTime} min wait</p>
                        <p className="text-xs text-muted-foreground">{dept.patients} patients</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center mt-6">Last updated: {selectedFacility.lastUpdated} (System time: {currentTime})</p>
          </CardContent>
        ) : (
          <CardContent className="p-6 text-center text-muted-foreground">
            <p>Please select a facility to view its queue status.</p>
          </CardContent>
        )}
      </Card>
      <p className="text-center text-sm text-muted-foreground">
        Queue times are estimates and can change. For urgent medical attention, please contact emergency services.
      </p>
    </div>
  );
}

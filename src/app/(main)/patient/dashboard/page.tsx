
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { VitalsCard } from "@/components/vitals-card";
import { LayoutDashboard, Bot, CalendarDays, ClipboardList, FlaskConical, FileText, Target, ScanSearch, ActivitySquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const mockVitals = {
  heartRate: { value: "72", unit: "bpm" },
  temperature: { value: "36.8", unit: "°C" },
  oxygen: { value: "98", unit: "%" },
};

const mockAppointments = [
  { id: 1, doctor: "Dr. Eva Core", type: "Check-up", time: "Tomorrow, 10:00 AM", status: "Upcoming" },
  { id: 2, doctor: "Dr. AI Zizo", type: "AI Consultation", time: "Yesterday, 02:30 PM", status: "Completed" },
];

const mockPrescriptions = [
  { id: 1, name: "Amoxicillin", dosage: "250mg, 3 times a day", status: "Active" },
  { id: 2, name: "Vitamin D3", dosage: "1000IU, once a day", status: "Active" },
];

export default function PatientDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Patient Dashboard" description="Your personal health overview and quick actions." icon={LayoutDashboard} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Health Overview & Vitals */}
        <Card className="lg:col-span-2 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2 text-primary"><ActivitySquare className="w-6 h-6"/>Health Overview</CardTitle>
            <CardDescription>Real-time vitals and a glimpse of your holographic scan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <VitalsCard vitals={mockVitals} />
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Holographic Scan Display (Placeholder)</p>
              <Image src="https://placehold.co/600x300.png" alt="Holographic Scan Placeholder" width={600} height={300} className="rounded-md mx-auto shadow-md" data-ai-hint="hologram body" />
            </div>
          </CardContent>
        </Card>

        {/* AI Consult */}
        <Card className="shadow-lg rounded-xl flex flex-col justify-between bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2"><Bot className="w-6 h-6"/>AI Consultation</CardTitle>
            <CardDescription className="text-primary-foreground/80">Chat with Zizo_MediAI for insights and advice.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">Get instant medical advice, symptom analysis, and more from our advanced AI.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full bg-background/20 hover:bg-background/30 border-primary-foreground text-primary-foreground hover:text-primary-foreground">
              <Link href="/patient/ai-consult">Start AI Consult</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointments */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><CalendarDays className="w-5 h-5"/>Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {mockAppointments.length > 0 ? (
              <ul className="space-y-3">
                {mockAppointments.map(appt => (
                  <li key={appt.id} className="p-3 bg-secondary/30 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-foreground">{appt.type} with {appt.doctor}</p>
                      <p className="text-sm text-muted-foreground">{appt.time}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${appt.status === "Upcoming" ? "bg-green-500/20 text-green-700" : "bg-gray-500/20 text-gray-700"}`}>{appt.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No appointments scheduled.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full">View All Appointments</Button>
          </CardFooter>
        </Card>

        {/* Prescriptions */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><ClipboardList className="w-5 h-5"/>Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
             {mockPrescriptions.length > 0 ? (
              <ul className="space-y-3">
                {mockPrescriptions.map(rx => (
                  <li key={rx.id} className="p-3 bg-secondary/30 rounded-md">
                    <p className="font-semibold text-foreground">{rx.name}</p>
                    <p className="text-sm text-muted-foreground">{rx.dosage} - <span className="text-accent">{rx.status}</span></p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No active prescriptions.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full">View All Prescriptions</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><FlaskConical className="w-5 h-5"/>Lab Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No new lab results available.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full">View Lab Results</Button>
          </CardFooter>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><FileText className="w-5 h-5"/>Medical Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Access your encrypted MediChain records.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full">View Records</Button>
          </CardFooter>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Target className="w-5 h-5"/>Health Missions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Gamified health goals coming soon!</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full">View Missions</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { PageHeader } from "@/components/page-header";
import { LayoutDashboard, Bot, CalendarDays, ClipboardList, FlaskConical, FileText, Target, ScanSearch, ActivitySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from "react";
import PatientDashboardLoading from "./loading";
import Image from "next/image";
import { getPatientDashboardData } from '@/services/patient';
import type { Appointment } from '@/services/appointments';
import type { Prescription } from '@/services/prescriptions';
import { VitalsCard } from "@/components/vitals-card";
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DashboardData {
  vitals: {
    heartRate: { value: any; unit: string };
    temperature: { value: any; unit: string };
    oxygen: { value: any; unit: string };
  };
  appointments: Appointment[];
  prescriptions: Prescription[];
  charts: any[];
  surgeries: any[];
  labResults: any[];
  records: any[];
}

export default function PatientDashboardPage() {
  const { user, isLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [missions, setMissions] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && user) {
      setDataLoading(true);
      getPatientDashboardData().then((data: DashboardData) => {
        setDashboardData(data);
        setDataLoading(false);
      }).catch(() => {
        setDataLoading(false);
      });
      // Fetch health missions from Firestore
      const fetchMissions = async () => {
        const missionsRef = collection(doc(collection(db, 'users'), user.uid), 'missions');
        const missionsSnap = await getDocs(missionsRef);
        setMissions(missionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      fetchMissions();
    }
  }, [user, isLoading]);

  if (isLoading || dataLoading) {
    return <PatientDashboardLoading />;
  }
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Please log in to view your dashboard.</div>;
  }

  if (!dashboardData) {
    return <div className="flex items-center justify-center min-h-screen">Unable to load dashboard data.</div>;
  }

  const { vitals, appointments, prescriptions, labResults = [], records = [] } = dashboardData;

  // Ensure vitals values are strings for VitalsCard
  const vitalsForCard = {
    heartRate: {
      value: String(vitals.heartRate.value),
      unit: vitals.heartRate.unit,
    },
    temperature: {
      value: String(vitals.temperature.value),
      unit: vitals.temperature.unit,
    },
    oxygen: {
      value: String(vitals.oxygen.value),
      unit: vitals.oxygen.unit,
    },
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 bg-background">
      <PageHeader title="Patient Dashboard" description="Your personal health overview and quick actions." icon={LayoutDashboard} />
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Health Overview & Vitals */}
          <Card className="lg:col-span-2 shadow-lg rounded-xl w-full">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2 text-primary"><ActivitySquare className="w-6 h-6"/>Health Overview</CardTitle>
              <CardDescription>Real-time vitals and a glimpse of your holographic scan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* VitalsCard is assumed to be implemented elsewhere */}
              <VitalsCard vitals={vitalsForCard} />
              <div className="mt-4 p-4 bg-secondary/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Holographic Scan Display (Placeholder)</p>
                <Image src="https://placehold.co/600x300.png" alt="Holographic Scan Placeholder" width={600} height={300} className="rounded-md mx-auto shadow-md" data-ai-hint="hologram body" />
              </div>
            </CardContent>
          </Card>

          {/* AI Consult */}
          <Card className="shadow-lg rounded-xl flex flex-col justify-between bg-gradient-to-br from-primary to-accent text-primary-foreground w-full">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2"><Bot className="w-6 h-6"/>AI Consultation</CardTitle>
              <CardDescription className="text-primary-foreground/80">Chat with Zizo_MediAI for insights and advice.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">Get instant medical advice, symptom analysis, and more from our advanced AI.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full bg-background/20 hover:bg-background/30 border-primary-foreground text-primary-foreground hover:text-primary-foreground">
                <Link href="/main/patient/ai-consult">Start AI Consult</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Appointments */}
          <Card className="shadow-lg rounded-xl w-full">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><CalendarDays className="w-5 h-5"/>Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <ul className="space-y-3">
                  {appointments.slice(0, 2).map((appt: Appointment) => (
                    <li key={appt.id} className="p-3 bg-secondary/30 rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground">{appt.type} with {appt.doctor}</p>
                        <p className="text-sm text-muted-foreground">{appt.date} @ {appt.time}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${appt.status === "Confirmed" ? "bg-green-500/20 text-green-700" : "bg-yellow-500/20 text-yellow-700"}`}>{appt.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No upcoming appointments scheduled.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/main/patient/appointments">View All Appointments</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Prescriptions */}
          <Card className="shadow-lg rounded-xl w-full">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><ClipboardList className="w-5 h-5"/>Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              {prescriptions.length > 0 ? (
                <ul className="space-y-3">
                  {prescriptions.slice(0, 2).map((rx: Prescription) => (
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
              <Button asChild variant="outline" className="w-full">
                <Link href="/main/patient/prescriptions">View All Prescriptions</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Lab Results */}
          <Card className="shadow-lg rounded-xl w-full">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><FlaskConical className="w-5 h-5"/>Lab Results</CardTitle>
            </CardHeader>
            <CardContent>
              {labResults.length > 0 ? (
                <ul className="space-y-3">
                  {labResults.slice(0, 2).map((result: any) => (
                    <li key={result.id} className="p-3 bg-secondary/30 rounded-md">
                      <p className="font-semibold text-foreground">{result.testName}</p>
                      <p className="text-sm text-muted-foreground">{result.date} - <span className="text-accent">{result.status}</span></p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No new lab results available.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/main/patient/lab-results">View Lab Results</Link>
              </Button>
            </CardFooter>
          </Card>
          {/* Medical Records */}
          <Card className="shadow-lg rounded-xl w-full">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><FileText className="w-5 h-5"/>Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              {records.length > 0 ? (
                <ul className="space-y-3">
                  {records.slice(0, 2).map((record: any) => (
                    <li key={record.id} className="p-3 bg-secondary/30 rounded-md">
                      <p className="font-semibold text-foreground">{record.title}</p>
                      <p className="text-sm text-muted-foreground">{record.date} - <span className="text-accent">{record.type}</span></p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Access your encrypted MediChain records.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/main/patient/records">View Records</Link>
              </Button>
            </CardFooter>
          </Card>
          {/* Health Missions */}
          <Card className="shadow-lg rounded-xl w-full">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Target className="w-5 h-5"/>Health Missions</CardTitle>
            </CardHeader>
            <CardContent>
              {missions.length > 0 ? (
                <ul className="space-y-3">
                  {missions.slice(0, 2).map((mission: any) => (
                    <li key={mission.id} className="p-3 bg-secondary/30 rounded-md">
                      <p className="font-semibold text-foreground">{mission.title}</p>
                      <p className="text-sm text-muted-foreground">Goal: {mission.goal} {mission.unit} - <span className="text-accent">{mission.status}</span></p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Gamified health goals coming soon!</p>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full" disabled={missions.length === 0}>
                <Link href="/main/patient/missions">View Missions</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}

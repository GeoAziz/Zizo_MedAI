
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutDashboard, Users, Bot, AlertTriangle, CalendarClock, FileEdit, ClipboardPlus } from "lucide-react";
import Link from "next/link";
import { getPatients } from "@/services/users";
import type { PatientRecord } from "@/services/users";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface PatientWithDetails extends PatientRecord {
  status: string;
  lastVisit: string;
  alerts: number;
}

// Augment fetched patient data with mock details for the UI
function addMockDetailsToPatients(patients: PatientRecord[]): PatientWithDetails[] {
  const statuses = ["Stable", "Critical", "Improving", "Stable"];
  return patients.map((patient, index) => ({
    ...patient,
    status: statuses[index % statuses.length],
    lastVisit: `2024-07-${15 + (index % 5)}`,
    alerts: patient.name.includes("Jane") ? 2 : 0, // Give Jane Smith a critical alert for demo
  }));
}

export default function DoctorDashboardPage() {
  const [patientsWithDetails, setPatientsWithDetails] = useState<PatientWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const realPatients = await getPatients();
        const augmentedPatients = addMockDetailsToPatients(realPatients);
        setPatientsWithDetails(augmentedPatients);
      } catch (error) {
        console.error("Failed to fetch patients for dashboard:", error);
        toast({
          title: "Could Not Load Patients",
          description: "There was an error fetching the patient list. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast]);


  return (
    <div className="space-y-6">
      <PageHeader title="Doctor Dashboard" description="Manage patients, consultations, and schedules." icon={LayoutDashboard} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Users className="w-5 h-5" />Patient Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
              <p className="text-foreground">Total Patients:</p>
              {isLoading ? <Skeleton className="h-6 w-8" /> : <p className="font-bold text-lg text-primary">{patientsWithDetails.length}</p>}
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
              <p className="text-foreground">Critical Alerts:</p>
              <p className="font-bold text-lg text-destructive">1</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
              <p className="text-foreground">Upcoming Appointments:</p>
              <p className="font-bold text-lg text-accent">7</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2"><Bot className="w-5 h-5" />AI-Augmented Consults</CardTitle>
            <CardDescription className="text-primary-foreground/80">Leverage Zizo_MediAI for enhanced diagnostics.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">Start AI-assisted sessions, access advanced diagnostic tools, and streamline your workflow.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full bg-background/20 hover:bg-background/30 border-primary-foreground text-primary-foreground hover:text-primary-foreground">
              <Link href="/doctor/live-consults">Start New Consult</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><CalendarClock className="w-5 h-5" />Surgery Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No surgeries scheduled for today.</p>
            <p className="text-xs text-muted-foreground mt-1">AI-assisted scheduling coming soon.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/doctor/surgery-schedule">View Full Schedule</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Users className="w-5 h-5" />Patient List</CardTitle>
            <Input placeholder="Search patients..." className="max-w-xs bg-input" disabled/>
          </div>
          <CardDescription>Quick access to your real patient records from the database.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-7 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientsWithDetails.map((patient) => (
                  <TableRow key={patient.uid}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        patient.status === "Critical" ? "bg-red-500/20 text-red-700" :
                        patient.status === "Improving" ? "bg-yellow-500/20 text-yellow-700" :
                        "bg-green-500/20 text-green-700"
                      }`}>
                        {patient.status}
                        {patient.alerts > 0 && <AlertTriangle className="inline-block ml-1 h-3 w-3 text-red-500" />}
                      </span>
                    </TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                         <Link href={`/doctor/prescribe?patientId=${patient.uid}`}>Prescribe</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/doctor/patient-list">View All Patients</Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><FileEdit className="w-5 h-5" />Digital Charts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Annotate patient records, upload imaging, and manage charts digitally.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/doctor/charts">Access Charting System</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><ClipboardPlus className="w-5 h-5" />Prescribe Module</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Create e-Prescriptions and integrate with pharmacy systems.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/doctor/prescribe">Create New e-Rx</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

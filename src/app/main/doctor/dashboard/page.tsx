"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutDashboard, Users, Bot, AlertTriangle, CalendarClock, FileEdit, ClipboardPlus } from "lucide-react";
import { UserCircle, CalendarDays } from 'lucide-react';
import Link from "next/link";
import { getPatients } from "@/services/users";
import type { PatientRecord } from "@/services/users";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { getAppointments } from '@/services/appointments';
import { getPrescriptions } from '@/services/prescriptions';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";
import { PieChart, BarChartHorizontal, Bell, MessageSquare, Stethoscope } from "lucide-react";

export default function DoctorDashboardPage() {
  interface PatientWithDetails extends PatientRecord {
    status: string;
    lastVisit: string;
    alerts: number;
  }
  
  // Augment fetched patient data with mock details for the UI
  const addMockDetailsToPatients = (patients: PatientRecord[]): PatientWithDetails[] => {
    const statuses = ["Stable", "Critical", "Improving", "Stable"];
    return patients.map((patient, index) => ({
      ...patient,
      status: statuses[index % statuses.length],
      lastVisit: `2024-07-${15 + (index % 5)}`,
      alerts: patient.name.includes("Jane") ? 2 : 0, // Give Jane Smith a critical alert for demo
    }));
  }

  const [patientsWithDetails, setPatientsWithDetails] = useState<PatientWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<PatientWithDetails[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState<number>(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState<number>(0);

  // Personalization
  const doctorName = user?.name || 'Doctor';
  const doctorAvatar = user?.photoURL || '';

  // Live updates for patients
  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    const q = query(collection(db, "users"), where("role", "==", "patient"), where("assignedDoctorId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snap) => {
      const patients = snap.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          name: data.name ?? "",
          email: data.email ?? "",
          status: data.status ?? "Stable",
          lastVisit: data.lastVisit ?? "2024-07-15",
          alerts: data.alerts ?? 0,
          ...data
        };
      });
      setPatientsWithDetails(patients);
      setPatients(patients);
      setIsLoading(false);
    }, (err) => {
      setError("Could not load patients");
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // Search & filter patients
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPatients(patientsWithDetails);
    } else {
      setFilteredPatients(
        patientsWithDetails.filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, patientsWithDetails]);

  // Fetch recent activity (appointments, prescriptions)
  useEffect(() => {
    if (!user) return;
    async function fetchRecentActivity() {
      const activities: Array<{ patient: string; type: string; detail: string; date: string }> = [];
      for (const patient of patientsWithDetails.slice(0, 5)) {
        // Fetch appointments
        try {
          const appts = await getAppointments(patient.uid);
          appts.slice(0, 2).forEach(appt => {
            activities.push({
              patient: patient.name,
              type: 'Appointment',
              detail: `${appt.type} with ${appt.doctor}`,
              date: appt.date + ' ' + appt.time
            });
          });
        } catch {}
        // Fetch prescriptions
        try {
          const rx = await getPrescriptions(patient.uid);
          rx.slice(0, 2).forEach(presc => {
            activities.push({
              patient: patient.name,
              type: 'Prescription',
              detail: `${presc.name} (${presc.dosage})`,
              date: presc.date
            });
          });
        } catch {}
      }
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivity(activities.slice(0, 5));
    }
    fetchRecentActivity();
  }, [patientsWithDetails, user]);

  // Calculate critical alerts and upcoming appointments
  useEffect(() => {
    const alerts = patientsWithDetails.filter(p => p.status === "Critical").length;
    setCriticalAlerts(alerts);
    const now = new Date();
    const upcoming = patientsWithDetails.filter(p => {
      const visitDate = new Date(p.lastVisit);
      return visitDate > now && (visitDate.getTime() - now.getTime()) < 7 * 24 * 60 * 60 * 1000;
    }).length;
    setUpcomingAppointments(upcoming);
  }, [patientsWithDetails]);

  // Patient status chart data
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    patientsWithDetails.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return counts;
  }, [patientsWithDetails]);

  // Upcoming appointments timeline data
  const upcomingAppts = useMemo(() => {
    return patientsWithDetails
      .filter(p => {
        const visitDate = new Date(p.lastVisit);
        const now = new Date();
        return visitDate > now && (visitDate.getTime() - now.getTime()) < 7 * 24 * 60 * 60 * 1000;
      })
      .map(p => ({ name: p.name, date: p.lastVisit }));
  }, [patientsWithDetails]);

  // Alerts feed (mock)
  const alertsFeed = useMemo(() => {
    return patientsWithDetails.filter(p => p.alerts > 0).map(p => ({
      patient: p.name,
      message: `${p.name} has ${p.alerts} critical alert(s).`,
      date: p.lastVisit
    }));
  }, [patientsWithDetails]);

  // Quick actions
  const quickActions = [
    { label: "Start Consult", icon: Bot, href: "/main/doctor/live-consults" },
    { label: "Add Note", icon: MessageSquare, href: "/main/doctor/charts" },
    { label: "Order Test", icon: Stethoscope, href: "/main/doctor/patient-list" },
  ];

  return (
    <main className="flex-1 p-4 md:p-8 bg-background">
      <div className="mb-8 flex items-center gap-4">
        <Avatar>
          {doctorAvatar ? <AvatarImage src={doctorAvatar} alt={doctorName} /> : <AvatarFallback>{doctorName[0]}</AvatarFallback>}
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">Welcome, {doctorName}</h1>
          <p className="text-muted-foreground">Here is your up-to-date dashboard.</p>
        </div>
      </div>
      {/* Interactive Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 w-full">
        {/* Patient Status Pie Chart */}
        <Card className="w-full flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PieChart className="w-5 h-5" />Patient Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap justify-center">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex flex-col items-center mx-2">
                  <span className="font-semibold text-sm">{status}</span>
                  <span className="text-lg">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Upcoming Appointments Timeline */}
        <Card className="w-full flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChartHorizontal className="w-5 h-5" />Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {upcomingAppts.length === 0 ? <li className="text-muted-foreground">No upcoming appointments</li> : upcomingAppts.map((a, i) => (
                <li key={i} className="text-sm">{a.name}: <span className="font-semibold">{a.date}</span></li>
              ))}
            </ul>
          </CardContent>
        </Card>
        {/* Alerts Feed */}
        <Card className="w-full flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-destructive" />Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {alertsFeed.length === 0 ? <li className="text-muted-foreground">No critical alerts</li> : alertsFeed.map((a, i) => (
                <li key={i} className="text-sm">{a.message} <span className="ml-2 text-xs text-muted-foreground">{a.date}</span></li>
              ))}
            </ul>
          </CardContent>
        </Card>
        {/* Quick Actions Panel */}
        <Card className="w-full flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5" />Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 w-full">
              {quickActions.map((action, i) => (
                <Button key={i} variant="outline" asChild className="w-full flex items-center gap-2">
                  <Link href={action.href}><action.icon className="w-4 h-4 mr-2" />{action.label}</Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
        {/* Cards will now stretch full width on small screens */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Patient Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2"><UserCircle className="w-5 h-5" />Total Patients: {isLoading ? <Skeleton className="w-8 h-4" /> : patientsWithDetails.length}</div>
              <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" />Critical Alerts: {criticalAlerts}</div>
              <div className="flex items-center gap-2"><CalendarDays className="w-5 h-5 text-accent" />Upcoming Appointments: {upcomingAppointments}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>AI-Augmented Consults</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Leverage Zizo_MediAI for enhanced diagnostics.</p>
            <Button variant="outline" asChild><Link href="/main/doctor/live-consults">Start New Consult</Link></Button>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Surgery Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No surgeries scheduled for today.</p>
            <Button variant="outline" asChild><Link href="/main/doctor/surgery-schedule">View Full Schedule</Link></Button>
          </CardContent>
        </Card>
      </div>
      <div className="mb-8 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            {isLoading ? (
              <Skeleton className="w-full h-32" />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Last Visit</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.slice(0, 5).map(patient => (
                    <tr key={patient.uid}>
                      <td>{patient.name}</td>
                      <td>{patient.email}</td>
                      <td>{patient.status}</td>
                      <td>{patient.lastVisit}</td>
                      <td>
                        <Button variant="outline" size="sm" asChild><Link href={`/main/doctor/prescribe?patient=${patient.uid}`}>Prescribe</Link></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-2 text-right">
              <Button variant="link" asChild><Link href="/main/doctor/patient-list">View All Patients</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Digital Charts</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Annotate patient records, upload imaging, and manage charts digitally.</p>
            <Button variant="outline" asChild><Link href="/main/doctor/charts">Access Charting System</Link></Button>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Prescribe Module</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Create e-Prescriptions and integrate with pharmacy systems.</p>
            <Button variant="outline" asChild><Link href="/main/doctor/prescribe">Create New e-Rx</Link></Button>
          </CardContent>
        </Card>
      </div>
      <div className="mb-8 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground">No recent activity yet.</p>
            ) : (
              <ul className="space-y-2">
                {recentActivity.map((activity, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">{activity.patient}</span>
                    <span className="px-2 py-1 rounded bg-secondary/30 text-xs">{activity.type}</span>
                    <span>{activity.detail}</span>
                    <span className="text-muted-foreground ml-auto">{activity.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

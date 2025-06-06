
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, PlusCircle, Filter } from "lucide-react";
import Link from "next/link";

const mockAppointments = [
  { id: "A001", doctor: "Dr. Eva Core", specialty: "Cardiology", date: "2024-08-15", time: "10:00 AM", type: "Follow-up", status: "Confirmed" },
  { id: "A002", doctor: "Dr. Lee Min", specialty: "Pediatrics", date: "2024-08-20", time: "02:30 PM", type: "Annual Check-up", status: "Confirmed" },
  { id: "A003", doctor: "Zizo_MediAI", specialty: "AI Consultation", date: "2024-08-10", time: "N/A", type: "Symptom Analysis", status: "Completed" },
  { id: "A004", doctor: "Dr. Sarah Woods", specialty: "Dermatology", date: "2024-09-01", time: "11:00 AM", type: "Initial Consultation", status: "Pending" },
];

export default function PatientAppointmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Appointments" 
        description="Manage your upcoming and past appointments." 
        icon={CalendarDays}
        actions={
          <div className="flex gap-2">
            <Button disabled><Filter className="mr-2 h-4 w-4" />Filter Appointments</Button>
            <Button asChild>
              <Link href="/facilities/booking">
                <PlusCircle className="mr-2 h-4 w-4" /> Book New Appointment
              </Link>
            </Button>
          </div>
        }
      />
      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Appointments Overview</CardTitle>
          <CardDescription>Here is a list of your scheduled and past appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockAppointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Doctor / Service</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAppointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell className="font-medium">{appt.id}</TableCell>
                    <TableCell>{appt.doctor}</TableCell>
                    <TableCell>{appt.specialty}</TableCell>
                    <TableCell>{appt.date}</TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>{appt.type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        appt.status === "Confirmed" ? "bg-green-500/20 text-green-700" :
                        appt.status === "Completed" ? "bg-blue-500/20 text-blue-700" :
                        appt.status === "Pending" ? "bg-yellow-500/20 text-yellow-700" :
                        "bg-gray-500/20 text-gray-700"
                      }`}>
                        {appt.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
              <CalendarDays className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">You have no appointments scheduled.</p>
              <Button asChild className="mt-4">
                <Link href="/facilities/booking">Book an Appointment</Link>
              </Button>
            </div>
          )}
        </CardContent>
        {mockAppointments.length > 0 && (
          <CardFooter className="flex justify-center">
            <Button variant="outline" disabled>Load More Appointments</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, PlusCircle, Filter } from "lucide-react";
import Link from "next/link";
import { getAppointments, type Appointment } from '@/services/appointments';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    async function fetchAppointments() {
      setIsLoading(true);
      try {
        const data = await getAppointments(user.uid);
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        toast({
          title: "Error",
          description: "Could not fetch your appointments. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAppointments();
  }, [user, toast]);


  const renderContent = () => {
    if (isLoading) {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Doctor / Service</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    
    if (appointments.length === 0) {
      return (
        <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
          <CalendarDays className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">You have no appointments scheduled.</p>
          <Button asChild className="mt-4">
            <Link href="/facilities/booking">Book an Appointment</Link>
          </Button>
        </div>
      );
    }

    return (
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
          {appointments.map((appt) => (
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
    );
  }

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
          {renderContent()}
        </CardContent>
        {!isLoading && appointments.length > 0 && (
          <CardFooter className="flex justify-center">
            <Button variant="outline" disabled>Load More Appointments</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

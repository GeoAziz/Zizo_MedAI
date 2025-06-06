
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Bot, Stethoscope, Clock, Users, PlusCircle, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";


const mockSurgeries = [
  { id: "S001", patientName: "Robert Johnson", patientId: "P004", procedure: "Knee Arthroscopy", surgeon: "Dr. Anya Sharma", or: "OR 1", date: "2024-08-10", time: "09:00 AM", duration: "2 hours", status: "Scheduled", aiAssist: true },
  { id: "S002", patientName: "Alice Brown", patientId: "P003", procedure: "Appendectomy (Robotic)", surgeon: "Dr. Ken Miles", or: "OR 3 (Robotics)", date: "2024-08-10", time: "01:00 PM", duration: "1.5 hours", status: "Scheduled", aiAssist: true },
  { id: "S003", patientName: "David Lee", patientId: "P007", procedure: "Cataract Surgery", surgeon: "Dr. Emily Carter", or: "OR 2", date: "2024-08-11", time: "11:00 AM", duration: "1 hour", status: "Scheduled", aiAssist: false },
  { id: "S004", patientName: "Sophia Miller", patientId: "P008", procedure: "Gallbladder Removal", surgeon: "Dr. Anya Sharma", or: "OR 1", date: "2024-08-12", time: "08:00 AM", duration: "2.5 hours", status: "Pending Confirmation", aiAssist: true },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Scheduled": return "bg-green-500/20 text-green-700";
    case "Pending Confirmation": return "bg-yellow-500/20 text-yellow-700";
    case "Completed": return "bg-blue-500/20 text-blue-700";
    case "Cancelled": return "bg-red-500/20 text-red-700";
    default: return "bg-gray-500/20 text-gray-700";
  }
};

export default function DoctorSurgerySchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2024-08-10"));

  const filteredSurgeries = selectedDate 
    ? mockSurgeries.filter(surgery => surgery.date === format(selectedDate, "yyyy-MM-dd"))
    : mockSurgeries;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Surgery Schedule" 
        description="View and manage upcoming robotic/AI-assisted surgeries." 
        icon={CalendarDays}
        actions={
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Button disabled><Filter className="mr-2 h-4 w-4"/>Filter</Button>
            <Button disabled><PlusCircle className="mr-2 h-4 w-4"/>New Surgery</Button>
          </div>
        }
      />
      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Surgeries for {selectedDate ? format(selectedDate, "PPP") : "All Dates"}</CardTitle>
          <CardDescription>Overview of scheduled surgical procedures. AI-assisted logging and pre-op planning features are conceptual.</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSurgeries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Surgeon</TableHead>
                  <TableHead>OR</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>AI Assist</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSurgeries.map((surgery) => (
                  <TableRow key={surgery.id}>
                    <TableCell className="font-medium">{surgery.id}</TableCell>
                    <TableCell>{surgery.patientName} ({surgery.patientId})</TableCell>
                    <TableCell>{surgery.procedure}</TableCell>
                    <TableCell>{surgery.surgeon}</TableCell>
                    <TableCell>{surgery.or}</TableCell>
                    <TableCell>{surgery.time}</TableCell>
                    <TableCell>{surgery.duration}</TableCell>
                    <TableCell className="text-center">
                      {surgery.aiAssist && <Bot className="h-5 w-5 text-primary inline-block" title="AI-Assisted"/>}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(surgery.status)}>{surgery.status}</Badge>
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
              <p className="text-muted-foreground">No surgeries scheduled for {selectedDate ? format(selectedDate, "PPP") : "the selected criteria"}.</p>
            </div>
          )}
        </CardContent>
         {mockSurgeries.length > 0 && (
          <CardFooter className="flex justify-center">
            <Button variant="outline" disabled>Load More Surgeries</Button>
          </CardFooter>
        )}
      </Card>
      <Card className="shadow-lg rounded-xl bg-gradient-to-br from-primary/80 to-accent/80 text-primary-foreground">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2"><Bot className="w-5 h-5" />AI Pre-Op Planner (Conceptual)</CardTitle>
            <CardDescription className="text-primary-foreground/80">AI algorithms analyze patient data to suggest optimal surgical plans, identify risks, and simulate outcomes.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm mb-4">This tool is under development and aims to enhance surgical precision and patient safety.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full bg-background/20 hover:bg-background/30 border-primary-foreground text-primary-foreground hover:text-primary-foreground">Access AI Planner</Button>
          </CardFooter>
        </Card>
    </div>
  );
}

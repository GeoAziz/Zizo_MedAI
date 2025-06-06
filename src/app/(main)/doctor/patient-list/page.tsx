
"use client";

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Filter, UserPlus, AlertTriangle, Eye, MessageCircle, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const mockPatientsData = [
  { id: "P001", name: "Johnathan P. Doe", age: 38, gender: "Male", lastVisit: "2024-07-15", condition: "Hypertension", status: "Stable", alerts: 0, nextAppointment: "2024-09-01" },
  { id: "P002", name: "Jane A. Smith", age: 45, gender: "Female", lastVisit: "2024-07-20", condition: "Diabetes Type 2", status: "Critical", alerts: 2, nextAppointment: "2024-08-05 (Urgent)" },
  { id: "P003", name: "Alice B. Brown", age: 29, gender: "Female", lastVisit: "2024-07-18", condition: "Asthma", status: "Improving", alerts: 0, nextAppointment: "2024-10-15" },
  { id: "P004", name: "Robert C. Johnson", age: 62, gender: "Male", lastVisit: "2024-07-19", condition: "Arthritis", status: "Stable", alerts: 0, nextAppointment: "2024-09-20" },
  { id: "P005", name: "Emily K. Davis", age: 55, gender: "Female", lastVisit: "2024-06-30", condition: "Post-Op Recovery", status: "Stable", alerts: 0, nextAppointment: "2024-08-10" },
  { id: "P006", name: "Michael P. Wilson", age: 70, gender: "Male", lastVisit: "2024-07-22", condition: "Heart Failure", status: "Monitor", alerts: 1, nextAppointment: "2024-08-01" },
];

const getStatusClass = (status: string) => {
  switch (status) {
    case "Critical": return "bg-red-500/20 text-red-700";
    case "Monitor": return "bg-orange-500/20 text-orange-700";
    case "Improving": return "bg-yellow-500/20 text-yellow-700";
    case "Stable": return "bg-green-500/20 text-green-700";
    default: return "bg-gray-500/20 text-gray-700";
  }
};

export default function DoctorPatientListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPatients = mockPatientsData.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || patient.status.toLowerCase() === statusFilter)
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Patient List" 
        description="Search, filter, and manage your patient roster." 
        icon={Users}
        actions={
          <div className="flex gap-2">
            <Button disabled><UserPlus className="mr-2 h-4 w-4" /> Add New Patient</Button>
          </div>
        }
      />
      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="font-headline text-xl">Comprehensive Patient Roster</CardTitle>
              <CardDescription>Access detailed patient information and quick actions.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name..." 
                  className="pl-10 bg-input w-full" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-input">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="improving">Improving</SelectItem>
                  <SelectItem value="monitor">Monitor</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Primary Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Appointment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>{patient.condition}</TableCell>
                    <TableCell>
                      <Badge className={getStatusClass(patient.status)}>
                        {patient.alerts > 0 && <AlertTriangle className="inline-block mr-1 h-3 w-3" />}
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.nextAppointment}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/doctor/charts?patientId=${patient.id}`} title="View Chart">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/doctor/live-consults?patientId=${patient.id}`} title="Start Consult">
                          <MessageCircle className="h-4 w-4" />
                        </Link>
                      </Button>
                       <Button variant="ghost" size="icon" asChild>
                        <Link href={`/doctor/prescribe?patientId=${patient.id}`} title="New Prescription">
                          <FileText className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
              <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No patients match your current filters.</p>
            </div>
          )}
        </CardContent>
        {filteredPatients.length > 0 && (
          <CardFooter className="flex justify-center">
            <Button variant="outline" disabled>Load More Patients</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

    
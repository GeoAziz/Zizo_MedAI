
"use client";

import { useState, useMemo } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Filter, UserPlus, AlertTriangle, Eye, MessageCircle, FileText, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  condition: string;
  status: 'Stable' | 'Critical' | 'Improving' | 'Monitor';
  alerts: number;
  nextAppointment: string;
  medications: string[];
  activeDiagnoses: string[];
};


const mockPatientsData: Patient[] = [
  { id: "P001", name: "Johnathan P. Doe", age: 38, gender: "Male", lastVisit: "2024-07-15", condition: "Hypertension", status: "Stable", alerts: 0, nextAppointment: "2024-09-01", medications: ["Lisinopril 10mg"], activeDiagnoses: ["Hypertension"] },
  { id: "P002", name: "Jane A. Smith", age: 45, gender: "Female", lastVisit: "2024-07-20", condition: "Diabetes Type 2", status: "Critical", alerts: 2, nextAppointment: "2024-08-05 (Urgent)", medications: ["Metformin 1000mg", "Insulin Glargine"], activeDiagnoses: ["Type 2 Diabetes", "Diabetic Neuropathy"] },
  { id: "P003", name: "Alice B. Brown", age: 29, gender: "Female", lastVisit: "2024-07-18", condition: "Asthma", status: "Improving", alerts: 0, nextAppointment: "2024-10-15", medications: ["Albuterol Inhaler"], activeDiagnoses: ["Asthma"] },
  { id: "P004", name: "Robert C. Johnson", age: 62, gender: "Male", lastVisit: "2024-07-19", condition: "Arthritis", status: "Stable", alerts: 0, nextAppointment: "2024-09-20", medications: ["Celecoxib 200mg"], activeDiagnoses: ["Osteoarthritis"] },
  { id: "P005", name: "Emily K. Davis", age: 55, gender: "Female", lastVisit: "2024-06-30", condition: "Post-Op Recovery", status: "Stable", alerts: 0, nextAppointment: "2024-08-10", medications: ["Oxycodone 5mg (PRN)"], activeDiagnoses: ["Post-Cataract Surgery"] },
  { id: "P006", name: "Michael P. Wilson", age: 70, gender: "Male", lastVisit: "2024-07-22", condition: "Heart Failure", status: "Monitor", alerts: 1, nextAppointment: "2024-08-01", medications: ["Furosemide 40mg", "Carvedilol 12.5mg"], activeDiagnoses: ["Congestive Heart Failure"] },
];

type SortKey = keyof Patient;

export default function DoctorPatientListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Critical": return "bg-red-500/20 text-red-700";
      case "Monitor": return "bg-orange-500/20 text-orange-700";
      case "Improving": return "bg-yellow-500/20 text-yellow-700";
      case "Stable": return "bg-green-500/20 text-green-700";
      default: return "bg-gray-500/20 text-gray-700";
    }
  };

  const sortedAndFilteredPatients = useMemo(() => {
    let filterablePatients = [...mockPatientsData];

    if (searchTerm) {
        filterablePatients = filterablePatients.filter(patient =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (statusFilter !== 'all') {
        filterablePatients = filterablePatients.filter(patient =>
            patient.status.toLowerCase() === statusFilter
        );
    }

    if (sortConfig !== null) {
        filterablePatients.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }

    return filterablePatients;
  }, [searchTerm, statusFilter, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
        return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />;
    }
    // You could use different icons for ascending/descending
    return <ArrowUpDown className="ml-2 h-3 w-3 text-primary" />;
  };

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
                  placeholder="Search by name or ID..." 
                  className="pl-10 bg-input w-full" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-input">
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
          {sortedAndFilteredPatients.length > 0 ? (
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('name')} className="px-1 text-xs sm:text-sm">
                            Name {getSortIcon('name')}
                        </Button>
                    </TableHead>
                    <TableHead>
                         <Button variant="ghost" onClick={() => requestSort('age')} className="px-1 text-xs sm:text-sm">
                            Age {getSortIcon('age')}
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('lastVisit')} className="px-1 text-xs sm:text-sm">
                            Last Visit {getSortIcon('lastVisit')}
                        </Button>
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm">Primary Condition</TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('status')} className="px-1 text-xs sm:text-sm">
                            Status {getSortIcon('status')}
                        </Button>
                    </TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedAndFilteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name} <span className="text-muted-foreground text-xs hidden sm:inline">({patient.id})</span></TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell>{patient.condition}</TableCell>
                        <TableCell>
                        <Badge className={getStatusClass(patient.status)}>
                            {patient.alerts > 0 && <AlertTriangle className="inline-block mr-1 h-3 w-3" />}
                            {patient.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" title="View Patient Summary">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">{patient.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {patient.age}y.o. {patient.gender} - {patient.id}
                                            </p>
                                        </div>
                                        <div className="grid gap-2 text-sm">
                                            <p><strong className="font-medium text-foreground">Diagnoses:</strong> {patient.activeDiagnoses.join(', ')}</p>
                                            <p><strong className="font-medium text-foreground">Meds:</strong> {patient.medications.join(', ')}</p>
                                            <p><strong className="font-medium text-foreground">Next Appt:</strong> {patient.nextAppointment}</p>
                                        </div>
                                        <Button asChild className="w-full">
                                            <Link href={`/doctor/charts?patientId=${patient.id}`}>View Full Chart</Link>
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
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
            </div>
          ) : (
            <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
              <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No patients match your current filters.</p>
            </div>
          )}
        </CardContent>
        {sortedAndFilteredPatients.length > 0 && (
          <CardFooter className="flex justify-center">
            <Button variant="outline" disabled>Load More Patients</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

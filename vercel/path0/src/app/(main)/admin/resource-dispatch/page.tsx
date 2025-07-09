
"use client";

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Waypoints, CheckCircle, Send, AlertTriangle, Orbit, Ambulance, UserCheck, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { Label } from '@/components/ui/label';

interface Resource {
  id: string;
  type: 'Drone' | 'Ambulance' | 'Medical Staff';
  name: string;
  status: 'Available' | 'En Route' | 'On Scene' | 'Returning';
  location: string; // Could be coordinates or area name
  assignedTo?: string; // Incident ID or location
}

interface Incident {
  id: string;
  type: 'Medical Emergency' | 'Mass Casualty' | 'Outbreak Response';
  location: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Active' | 'Resolved';
}

const mockResources: Resource[] = [
  { id: "DRN-001", type: "Drone", name: "MediDrone Alpha", status: "Available", location: "Central Hub" },
  { id: "AMB-003", type: "Ambulance", name: "Rescue Unit 3", status: "En Route", location: "North Sector", assignedTo: "INC-078" },
  { id: "STAFF-DRL", type: "Medical Staff", name: "Dr. R. Lee (Paramedic)", status: "Available", location: "South Clinic" },
  { id: "DRN-002", type: "Drone", name: "MediDrone Beta", status: "On Scene", location: "Downtown Plaza", assignedTo: "INC-077" },
  { id: "AMB-001", type: "Ambulance", name: "LifeLine One", status: "Available", location: "East Depot" },
];

const mockIncidents: Incident[] = [
  { id: "INC-078", type: "Medical Emergency", location: "123 Maple St", priority: "High", status: "Active" },
  { id: "INC-077", type: "Outbreak Response", location: "Downtown Plaza", priority: "Medium", status: "Active" },
  { id: "INC-079", type: "Medical Emergency", location: "456 Oak Ave", priority: "Medium", status: "Pending" },
];

export default function AdminResourceDispatchPage() {
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  const getResourceIcon = (type: Resource['type']) => {
    if (type === "Drone") return <Orbit className="h-5 w-5 text-primary" />;
    if (type === "Ambulance") return <Ambulance className="h-5 w-5 text-red-500" />;
    if (type === "Medical Staff") return <UserCheck className="h-5 w-5 text-green-600" />;
    return null;
  };

  const handleDispatch = () => {
    if (selectedResource && selectedIncident) {
      alert(`Dispatching ${mockResources.find(r=>r.id === selectedResource)?.name} to incident ${selectedIncident}. (Mock action)`);
      // Here you would update backend state
    } else {
      alert("Please select a resource and an incident to dispatch.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Resource Dispatch Control" 
        description="Manage and assign Zizo_MediFleet drones, ambulances, and staff to active incidents." 
        icon={Waypoints}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispatch Panel */}
        <Card className="lg:col-span-1 shadow-xl rounded-xl">
          <CardHeader className="bg-primary/5">
            <CardTitle className="font-headline text-xl text-primary">Dispatch Assignment</CardTitle>
            <CardDescription>Select resource and incident for dispatch.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="font-semibold text-sm">Select Resource</Label>
              <Select onValueChange={setSelectedResource}>
                <SelectTrigger className="w-full bg-input mt-1">
                  <SelectValue placeholder="Choose available resource" />
                </SelectTrigger>
                <SelectContent>
                  {mockResources.filter(r => r.status === 'Available').map(r => (
                    <SelectItem key={r.id} value={r.id}>{r.name} ({r.type})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-semibold text-sm">Assign to Incident</Label>
              <Select onValueChange={setSelectedIncident}>
                <SelectTrigger className="w-full bg-input mt-1">
                  <SelectValue placeholder="Choose active/pending incident" />
                </SelectTrigger>
                <SelectContent>
                  {mockIncidents.filter(i => i.status === 'Active' || i.status === 'Pending').map(i => (
                    <SelectItem key={i.id} value={i.id}>{i.type} at {i.location} ({i.id})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleDispatch} disabled={!selectedResource || !selectedIncident}>
              <Send className="mr-2 h-4 w-4" /> Dispatch Resource
            </Button>
          </CardContent>
           <CardFooter className="flex items-center p-3 bg-yellow-500/10 border-t border-yellow-500/30 rounded-b-xl text-sm text-yellow-700">
                <AlertTriangle className="h-8 w-8 mr-2 shrink-0" />
                <p>Automated AI dispatch suggestions based on incident severity and resource proximity are conceptual.</p>
            </CardFooter>
        </Card>

        {/* Resource List */}
        <Card className="lg:col-span-2 shadow-xl rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Available & Deployed Resources</CardTitle>
            <CardDescription>Real-time status of all dispatchable units.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location / Assignment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockResources.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell className="font-medium">{res.id}</TableCell>
                    <TableCell>{getResourceIcon(res.type)}</TableCell>
                    <TableCell>{res.name}</TableCell>
                    <TableCell>
                      <Badge variant={res.status === "Available" ? "default" : res.status === "En Route" ? "secondary" : "outline"}
                       className={`${res.status === "Available" ? "bg-green-500/80 text-white" : res.status === "En Route" ? "bg-blue-500/80 text-white" : ""}`}
                      >
                        {res.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{res.assignedTo ? `To: ${res.assignedTo}` : res.location}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>Track</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center gap-2"><MapPin className="w-5 h-5"/>Incident Map (Conceptual)</CardTitle>
          <CardDescription>Visual overview of active incidents and resource deployment. This is a placeholder.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center bg-secondary/30 p-6 rounded-b-lg">
          <Image src="https://placehold.co/800x300.png" alt="Incident Map Placeholder" width={800} height={300} className="rounded-md shadow-md" data-ai-hint="city map incidents" />
        </CardContent>
      </Card>
    </div>
  );
}

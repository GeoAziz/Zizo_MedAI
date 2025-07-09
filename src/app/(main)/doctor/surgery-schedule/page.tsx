
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Bot, Stethoscope, Clock, Users, PlusCircle, Filter, Edit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';


interface Surgery {
  id: string;
  patientName: string;
  patientId: string;
  procedure: string;
  surgeon: string;
  or: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  duration: string;
  status: 'Scheduled' | 'Pending Confirmation' | 'Completed' | 'Cancelled' | 'In Progress';
  aiAssist: boolean;
  notes?: string;
}

const mockInitialSurgeries: Surgery[] = [
  { id: "S001", patientName: "Robert C. Johnson", patientId: "P004", procedure: "Knee Arthroscopy (Right)", surgeon: "Dr. Anya Sharma", or: "OR 1", date: "2024-08-10", time: "09:00 AM", duration: "2 hours", status: "Scheduled", aiAssist: true, notes: "Standard procedure, no complications expected." },
  { id: "S002", patientName: "Alice B. Brown", patientId: "P003", procedure: "Appendectomy (Robotic)", surgeon: "Dr. Ken Miles", or: "OR 3 (Robotics)", date: "2024-08-10", time: "01:00 PM", duration: "1.5 hours", status: "Scheduled", aiAssist: true, notes: "Patient has mild asthma, monitor post-op breathing." },
  { id: "S003", patientName: "David L. Lee", patientId: "P007", procedure: "Cataract Surgery (Left Eye)", surgeon: "Dr. Emily Carter", or: "OR 2", date: "2024-08-11", time: "11:00 AM", duration: "1 hour", status: "Scheduled", aiAssist: false },
  { id: "S004", patientName: "Sophia T. Miller", patientId: "P008", procedure: "Gallbladder Removal (Laparoscopic)", surgeon: "Dr. Anya Sharma", or: "OR 1", date: "2024-08-12", time: "08:00 AM", duration: "2.5 hours", status: "Pending Confirmation", aiAssist: true },
  { id: "S005", patientName: "Michael P. Wilson", patientId: "P006", procedure: "Coronary Artery Bypass Graft (CABG x3)", surgeon: "Dr. Eva Core", or: "OR 4 (Cardiac)", date: "2024-08-12", time: "12:00 PM", duration: "5 hours", status: "Scheduled", aiAssist: true, notes: "High-risk patient due to comorbidities." },
  { id: "S006", patientName: "Jane A. Smith", patientId: "P002", procedure: "Diabetic Foot Debridement", surgeon: "Dr. Ken Miles", or: "OR 2", date: "2024-08-10", time: "04:00 PM", duration: "45 mins", status: "Completed", aiAssist: false, notes: "Wound healing well." },
];

export default function DoctorSurgerySchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2024-08-10T00:00:00"));
  const [surgeries, setSurgeries] = useState<Surgery[]>(mockInitialSurgeries);
  const [selectedSurgery, setSelectedSurgery] = useState<Surgery | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Surgery>>({});

  const getStatusBadge = (status: Surgery['status']) => {
    switch (status) {
      case "Scheduled": return "bg-blue-500/20 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300";
      case "Pending Confirmation": return "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300";
      case "Completed": return "bg-green-500/20 text-green-700 dark:bg-green-700/30 dark:text-green-300";
      case "Cancelled": return "bg-red-500/20 text-red-700 dark:bg-red-700/30 dark:text-red-300";
      case "In Progress": return "bg-purple-500/20 text-purple-700 dark:bg-purple-700/30 dark:text-purple-300 animate-pulse";
      default: return "bg-gray-500/20 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300";
    }
  };
  
  const filteredSurgeries = selectedDate 
    ? surgeries.filter(surgery => surgery.date === format(selectedDate, "yyyy-MM-dd")).sort((a,b) => a.time.localeCompare(b.time))
    : surgeries.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time));

  const openEditModal = (surgery: Surgery) => {
    setSelectedSurgery(surgery);
    setEditFormData({ ...surgery });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };
   const handleEditFormSelectChange = (name: keyof Surgery, value: string | boolean) => {
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    if (selectedSurgery) {
      // Mock save action
      setSurgeries(prevSurgeries => 
        prevSurgeries.map(s => s.id === selectedSurgery.id ? { ...s, ...editFormData } as Surgery : s)
      );
      setIsEditModalOpen(false);
      setSelectedSurgery(null);
    }
  };

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
                <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal bg-card", !selectedDate && "text-muted-foreground")}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Button disabled variant="outline"><Filter className="mr-2 h-4 w-4"/>Filter</Button>
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
                  <TableHead>Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Surgeon</TableHead>
                  <TableHead>OR</TableHead>
                  <TableHead>AI Assist</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSurgeries.map((surgery) => (
                  <TableRow key={surgery.id}>
                    <TableCell className="font-medium">{surgery.id}</TableCell>
                    <TableCell>{surgery.time}</TableCell>
                    <TableCell>{surgery.patientName} ({surgery.patientId})</TableCell>
                    <TableCell>{surgery.procedure}</TableCell>
                    <TableCell>{surgery.surgeon}</TableCell>
                    <TableCell>{surgery.or}</TableCell>
                    <TableCell className="text-center">
                      {surgery.aiAssist ? <Bot className="h-5 w-5 text-primary inline-block" title="AI-Assisted"/> : <Stethoscope className="h-5 w-5 text-muted-foreground inline-block" title="Conventional"/>}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(surgery.status)}>{surgery.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                           <Button variant="ghost" size="icon" title="View Details"><Eye className="h-4 w-4" /></Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                            <DialogTitle>Surgery Details: {surgery.id}</DialogTitle>
                            <DialogDescription>Procedure: {surgery.procedure}</DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-3">
                            <p><strong>Patient:</strong> {surgery.patientName} ({surgery.patientId})</p>
                            <p><strong>Surgeon:</strong> {surgery.surgeon}</p>
                            <p><strong>Date & Time:</strong> {surgery.date} at {surgery.time}</p>
                            <p><strong>Operating Room:</strong> {surgery.or}</p>
                            <p><strong>Expected Duration:</strong> {surgery.duration}</p>
                            <p><strong>AI Assisted:</strong> {surgery.aiAssist ? 'Yes' : 'No'}</p>
                            <p><strong>Status:</strong> <Badge className={getStatusBadge(surgery.status)}>{surgery.status}</Badge></p>
                            {surgery.notes && <p><strong>Notes:</strong> {surgery.notes}</p>}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
                            </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(surgery)} title="Edit Surgery" disabled={surgery.status === 'Completed' || surgery.status === 'Cancelled'}><Edit className="h-4 w-4" /></Button>
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
         {surgeries.length > 0 && (
          <CardFooter className="flex justify-center">
            <Button variant="outline" disabled>Load More Surgeries</Button>
          </CardFooter>
        )}
      </Card>
      <Card className="shadow-lg rounded-xl bg-gradient-to-br from-primary/80 to-accent/80 text-primary-foreground">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2"><Bot className="w-5 h-5" />AI Pre-Op Planner (Conceptual)</CardTitle>
            <CardDescription className="text-primary-foreground/80">AI algorithms analyze patient data to suggest optimal surgical plans, identify risks, and simulate outcomes.</CardDescription>
          </Header>
          <CardContent>
             <p className="text-sm mb-4">This tool is under development and aims to enhance surgical precision and patient safety.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full bg-background/20 hover:bg-background/30 border-primary-foreground text-primary-foreground hover:text-primary-foreground">Access AI Planner</Button>
          </CardFooter>
        </Card>
      
      {/* Edit Surgery Modal */}
      {selectedSurgery && (
         <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Surgery: {selectedSurgery.id}</DialogTitle>
                    <DialogDescription>Modify details for {selectedSurgery.procedure}.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-procedure">Procedure</Label>
                        <Input id="edit-procedure" name="procedure" value={editFormData?.procedure || ''} onChange={handleEditFormChange} className="bg-input" />
                    </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="edit-surgeon">Surgeon</Label>
                        <Input id="edit-surgeon" name="surgeon" value={editFormData?.surgeon || ''} onChange={handleEditFormChange} className="bg-input" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-or">Operating Room</Label>
                            <Input id="edit-or" name="or" value={editFormData?.or || ''} onChange={handleEditFormChange} className="bg-input" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-time">Time</Label>
                            <Input id="edit-time" name="time" type="time" value={editFormData?.time ? format(new Date(`1970-01-01T${editFormData.time.replace(/( AM| PM)/, '')}`), 'HH:mm') : ''} onChange={handleEditFormChange} className="bg-input" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-status">Status</Label>
                         <Select name="status" value={editFormData?.status || ''} onValueChange={(value) => handleEditFormSelectChange('status', value)}>
                            <SelectTrigger className="w-full bg-input"><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Scheduled">Scheduled</SelectItem>
                                <SelectItem value="Pending Confirmation">Pending Confirmation</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="edit-aiAssist">AI Assisted</Label>
                         <Select name="aiAssist" value={editFormData?.aiAssist ? "true" : "false"} onValueChange={(value) => handleEditFormSelectChange('aiAssist', value === "true")}>
                            <SelectTrigger className="w-full bg-input"><SelectValue placeholder="AI Assistance" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Yes</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Textarea id="edit-notes" name="notes" value={editFormData?.notes || ''} onChange={handleEditFormChange} className="bg-input" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                    <Button type="button" onClick={handleSaveChanges}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
         </Dialog>
      )}
    </div>
  );
}

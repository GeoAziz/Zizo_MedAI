
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, Repeat, AlertCircle } from "lucide-react";

const mockPrescriptions = [
  { id: "RX001", name: "Lisinopril 10mg", prescribedBy: "Dr. Eva Core", date: "2024-07-01", dosage: "1 tablet daily", quantity: 30, refillsLeft: 2, status: "Active" },
  { id: "RX002", name: "Amoxicillin 250mg", prescribedBy: "Dr. Lee Min", date: "2024-06-15", dosage: "1 capsule 3 times daily for 7 days", quantity: 21, refillsLeft: 0, status: "Completed" },
  { id: "RX003", name: "Ventolin Inhaler", prescribedBy: "Dr. Eva Core", date: "2024-05-20", dosage: "2 puffs as needed", quantity: 1, refillsLeft: 5, status: "Active" },
  { id: "RX004", name: "Metformin 500mg", prescribedBy: "Dr. Eva Core", date: "2024-07-10", dosage: "1 tablet twice daily", quantity: 60, refillsLeft: 1, status: "Needs Refill" },
];

export default function PatientPrescriptionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Prescriptions" 
        description="View your current medications, refill requests, and instructions." 
        icon={ClipboardList}
        actions={<Button disabled><Repeat className="mr-2 h-4 w-4" /> Request Refills</Button>}
      />
      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Prescriptions Overview</CardTitle>
          <CardDescription>List of your current and past medications. Contact your pharmacy for refills if automated requests are unavailable.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockPrescriptions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Prescribed By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Refills Left</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPrescriptions.map((rx) => (
                  <TableRow key={rx.id} className={rx.status === "Needs Refill" ? "bg-yellow-500/10" : ""}>
                    <TableCell className="font-medium">{rx.id}</TableCell>
                    <TableCell>{rx.name}</TableCell>
                    <TableCell>{rx.prescribedBy}</TableCell>
                    <TableCell>{rx.date}</TableCell>
                    <TableCell>{rx.dosage}</TableCell>
                    <TableCell className="text-center">{rx.refillsLeft}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        rx.status === "Active" ? "bg-green-500/20 text-green-700" :
                        rx.status === "Completed" ? "bg-blue-500/20 text-blue-700" :
                        rx.status === "Needs Refill" ? "bg-yellow-500/20 text-yellow-700 font-semibold" :
                        "bg-gray-500/20 text-gray-700"
                      }`}>
                        {rx.status === "Needs Refill" && <AlertCircle className="inline-block mr-1 h-3 w-3" />}
                        {rx.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
              <ClipboardList className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">You have no prescriptions on file.</p>
            </div>
          )}
        </CardContent>
        {mockPrescriptions.length > 0 && (
          <CardFooter className="flex justify-center">
            <Button variant="outline" disabled>Load More Prescriptions</Button>
          </CardFooter>
        )}
      </Card>
       <Card className="bg-accent/10 border-accent/30 shadow-lg rounded-xl">
        <CardContent className="p-6 text-center text-accent">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">
            Always follow your doctor's instructions for medication usage. If you have questions, consult your healthcare provider or pharmacist.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

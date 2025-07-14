"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, Repeat, AlertCircle } from "lucide-react";
import { useAuth } from '@/context/auth-context';
import { getPrescriptions, type Prescription } from '@/services/prescriptions';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    async function fetchPrescriptions() {
      setIsLoading(true);
      try {
        if (!user) return;
        const data = await getPrescriptions(user.uid);
        setPrescriptions(data);
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
        toast({
          title: "Error",
          description: "Could not fetch your prescriptions. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPrescriptions();
  }, [user, toast]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Prescribed By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    
    if (prescriptions.length === 0) {
      return (
        <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
          <ClipboardList className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">You have no prescriptions on file.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medication</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Prescribed By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.map((rx) => (
            <TableRow key={rx.id} className={rx.status === "Needs Refill" ? "bg-yellow-500/10" : ""}>
              <TableCell className="font-medium">{rx.name}</TableCell>
              <TableCell>{rx.dosage}</TableCell>
              <TableCell>{rx.prescribedBy}</TableCell>
              <TableCell>{rx.date}</TableCell>
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
                <Button variant="ghost" size="sm" disabled>Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };


  return (
    <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 bg-background">
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
            {renderContent()}
          </CardContent>
          {!isLoading && prescriptions.length > 0 && (
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
    </main>
  );
}

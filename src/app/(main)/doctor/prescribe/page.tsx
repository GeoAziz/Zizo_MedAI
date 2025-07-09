
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, UserSearch, Pill, Repeat, Send, AlertTriangle, CheckCircle, Search, Activity } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getPatients, type PatientRecord } from '@/services/users';
import { useAuth } from '@/context/auth-context';
import { createPrescriptionAction, type PrescriptionFormValues } from '@/actions/prescribeActions';

export default function DoctorPrescribePage() {
  const commonDrugs = ["Lisinopril 10mg Tablet", "Amoxicillin 250mg Capsule", "Metformin 500mg Tablet", "Atorvastatin 20mg Tablet", "Albuterol Inhaler 90mcg/actuation", "Sertraline 50mg Tablet", "Omeprazole 20mg Capsule", "Ibuprofen 200mg Tablet", "Paracetamol 500mg Tablet"];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const patientIdFromQuery = searchParams.get('patientId');
  const { user } = useAuth();
  
  const prescriptionSchema = z.object({
    patientId: z.string().min(1, "Please select a patient."),
    drugName: z.string().min(1, "Drug name is required."),
    dosage: z.string().min(1, "Dosage is required."),
    frequency: z.string().min(1, "Frequency is required."),
    duration: z.string().optional(),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1.").optional(),
    refills: z.coerce.number().min(0, "Refills cannot be negative.").default(0),
    notes: z.string().optional(),
  });

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: patientIdFromQuery || "",
      drugName: "",
      dosage: "",
      frequency: "",
      duration: "",
      quantity: undefined,
      refills: 0,
      notes: "",
    }
  });

  useEffect(() => {
    async function fetchPatients() {
        setIsLoadingPatients(true);
        try {
            const fetchedPatients = await getPatients();
            setPatients(fetchedPatients);
        } catch (error) {
            console.error("Failed to fetch patients:", error);
            toast({
                title: "Error fetching patients",
                description: "Could not retrieve the patient list from the database. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setIsLoadingPatients(false);
        }
    }
    fetchPatients();
  }, [toast]);
  
  useEffect(() => {
    if (patientIdFromQuery && patients.some(p => p.uid === patientIdFromQuery)) {
      form.setValue('patientId', patientIdFromQuery);
    }
  }, [patientIdFromQuery, patients, form]);


  const onSubmit: SubmitHandler<PrescriptionFormValues> = async (data) => {
    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to prescribe.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    const result = await createPrescriptionAction(data, user.uid);
    setIsSubmitting(false);

    if (result.success) {
        const patientName = patients.find(p => p.uid === data.patientId)?.name || data.patientId;
        toast({
          title: "e-Prescription Sent!",
          description: `Prescription for ${data.drugName} for patient ${patientName} has been submitted.`,
          variant: 'default',
        });
        setIsSubmitted(true);
    } else {
        toast({
            title: "Submission Failed",
            description: result.error || "An unknown error occurred.",
            variant: "destructive",
        });
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="space-y-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <CheckCircle className="w-24 h-24 text-green-500 mb-4" />
        <PageHeader title="e-Prescription Submitted!" description="The prescription has been successfully saved to the database." />
        <div className="flex gap-4 mt-6">
            <Button onClick={() => { setIsSubmitted(false); form.reset({ patientId: "", drugName: "", dosage: "", frequency: "", duration: "", quantity: undefined, refills: 0, notes: "" }); }}>
                Create Another Prescription
            </Button>
            <Button variant="outline" asChild>
                <Link href="/doctor/dashboard">Back to Dashboard</Link>
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="e-Prescription Module" 
        description="Create and manage electronic prescriptions securely." 
        icon={ClipboardList}
      />

      <Card className="max-w-3xl mx-auto shadow-xl rounded-xl">
        <CardHeader className="bg-primary/5">
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Pill className="w-6 h-6"/>Create New e-Rx</CardTitle>
          <CardDescription>Fill patient and medication details. This form writes directly to the Firestore database.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Patient</FormLabel>
                     <div className="flex gap-2 items-center">
                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingPatients || patients.length === 0}>
                            <FormControl>
                                <SelectTrigger className="bg-input focus:ring-primary flex-1">
                                    <UserSearch className="mr-2 h-4 w-4 text-muted-foreground"/> 
                                    <SelectValue placeholder={isLoadingPatients ? "Loading patients..." : "Select patient"} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                { !isLoadingPatients && patients.length === 0 ? (
                                    <div className="text-center p-4 text-sm text-muted-foreground">No patients found.</div>
                                ) : (
                                    patients.map(p => <SelectItem key={p.uid} value={p.uid}>{p.name} ({p.uid.substring(0, 6)}...)</SelectItem>)
                                )}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" disabled type="button"><Search className="h-4 w-4"/></Button>
                     </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="drugName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Drug Name</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger className="bg-input focus:ring-primary"><Pill className="mr-2 h-4 w-4 text-muted-foreground"/> <SelectValue placeholder="Select or type drug" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {commonDrugs.map(drug => <SelectItem key={drug} value={drug}>{drug}</SelectItem>)}
                            </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Dosage & Strength</FormLabel>
                      <Input {...field} placeholder="e.g., 1 tablet, 10ml" className="bg-input focus:ring-primary"/>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Frequency</FormLabel>
                      <Input {...field} placeholder="e.g., Twice daily, QID" className="bg-input focus:ring-primary"/>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Duration (Optional)</FormLabel>
                      <Input {...field} placeholder="e.g., 7 days, For 1 month" className="bg-input focus:ring-primary"/>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Quantity</FormLabel>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="e.g., 30" 
                        className="bg-input focus:ring-primary" 
                        value={field.value === undefined ? '' : field.value}
                        onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} 
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="refills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Refills</FormLabel>
                    <Select 
                        onValueChange={(value) => field.onChange(value === '' ? undefined : parseInt(value,10))} 
                        value={field.value === undefined ? '' : field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-input focus:ring-primary w-full md:w-[200px]"><Repeat className="mr-2 h-4 w-4 text-muted-foreground"/> <SelectValue placeholder="Number of refills" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(6).keys()].map(i => <SelectItem key={i} value={i.toString()}>{i}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Additional Notes for Pharmacist (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Dispense in original packaging, check for allergies..."
                        className="min-h-[100px] bg-input focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-start p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md text-sm text-yellow-700 dark:text-yellow-300 dark:bg-yellow-700/20">
                <AlertTriangle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                <p>Please double-check all prescription details for accuracy before submission. This form is connected to a live database.</p>
              </div>

              <Button type="submit" className="w-full text-lg py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md" disabled={isSubmitting || isLoadingPatients}>
                {isSubmitting ? <><Activity className="mr-2 h-4 w-4 animate-spin"/>Submitting...</> : <><Send className="mr-2 h-4 w-4" /> Send e-Prescription</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

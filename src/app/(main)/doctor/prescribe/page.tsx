
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, UserSearch, Pill, Repeat, Send, AlertTriangle, Search } from "lucide-react";

const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Please select a patient."),
  drugName: z.string().min(1, "Drug name is required."),
  dosage: z.string().min(1, "Dosage is required."),
  frequency: z.string().min(1, "Frequency is required."),
  duration: z.string().optional(),
  quantity: z.string().min(1, "Quantity is required."),
  refills: z.string().min(1, "Number of refills is required."),
  notes: z.string().optional(),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

const mockPatientsForPrescribe = [
  { id: "P001", name: "John Doe" },
  { id: "P002", name: "Jane Smith" },
  { id: "P003", name: "Alice Brown" },
];

const commonDrugs = ["Lisinopril", "Amoxicillin", "Metformin", "Atorvastatin", "Albuterol Inhaler"];

export default function DoctorPrescribePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      refills: "0",
    }
  });

  const onSubmit: SubmitHandler<PrescriptionFormValues> = async (data) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Prescription Data:", data);
    toast({
      title: "e-Prescription Sent!",
      description: `Prescription for ${data.drugName} for patient ID ${data.patientId} has been submitted.`,
    });
    setIsSubmitting(false);
    form.reset({ refills: "0" });
  };

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
          <CardDescription>Fill patient and medication details. Ensure accuracy before submitting.</CardDescription>
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
                     <div className="flex gap-2">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="bg-input focus:ring-primary flex-1"><UserSearch className="mr-2 h-4 w-4 text-muted-foreground"/> <SelectValue placeholder="Select patient" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {mockPatientsForPrescribe.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.id})</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" disabled><Search className="h-4 w-4"/></Button>
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
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="bg-input focus:ring-primary"><Pill className="mr-2 h-4 w-4 text-muted-foreground"/> <SelectValue placeholder="Select or type drug" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {commonDrugs.map(drug => <SelectItem key={drug} value={drug}>{drug}</SelectItem>)}
                                <SelectItem value="Other">Other (Type Manually)</SelectItem>
                            </SelectContent>
                        </Select>
                      {/* Fallback input if needed */}
                      {/* <Input {...field} placeholder="e.g., Amoxicillin 250mg" className="bg-input focus:ring-primary"/> */}
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
                      <Input {...field} placeholder="e.g., 250mg, 1 tablet" className="bg-input focus:ring-primary"/>
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
                      <Input {...field} placeholder="e.g., Twice daily" className="bg-input focus:ring-primary"/>
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
                      <Input {...field} type="number" placeholder="e.g., 30" className="bg-input focus:ring-primary"/>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              
              <div className="flex items-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md text-sm text-yellow-700">
                <AlertTriangle className="h-5 w-5 mr-2 shrink-0" />
                <p>Please double-check all prescription details for accuracy before submission. This system is for demonstration purposes.</p>
              </div>

              <Button type="submit" className="w-full text-lg py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : <><Send className="mr-2 h-4 w-4" /> Send e-Prescription</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


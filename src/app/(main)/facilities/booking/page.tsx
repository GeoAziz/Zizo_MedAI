
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Clock, Hospital, UserCheck, CheckCircle, AlertTriangle, Activity } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/auth-context';
import { createBookingAction } from '@/actions/bookingActions';
import { useSearchParams } from 'next/navigation';

const bookingSchema = z.object({
  facilityId: z.string().min(1, "Please select a facility."),
  service: z.string().min(1, "Please select a service."),
  date: z.date({ required_error: "Please select a date." }),
  time: z.string().min(1, "Please select a time slot."),
  reason: z.string().min(10, "Please provide a brief reason for your visit (min. 10 characters).").optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function FacilityBookingPage() {
  const availableTimes = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];
  const facilities = [
      { id: "F001", name: "Zizo General Hospital" },
      { id: "F002", name: "MediAI Clinic North" },
      { id: "F003", name: "BioScan Diagnostics Hub" },
  ];
  const services = [
      { id: "S001", name: "General Check-up" },
      { id: "S002", name: "Specialist Consultation" },
      { id: "S003", name: "Diagnostic Test" },
      { id: "S004", name: "Vaccination" },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const facilityIdFromQuery = searchParams.get('facilityId');

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      facilityId: facilityIdFromQuery || "",
      service: "",
      time: "",
      reason: "",
    }
  });

  const onSubmit: SubmitHandler<BookingFormValues> = async (data) => {
    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to book an appointment.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    const result = await createBookingAction(data, user.uid);
    setIsSubmitting(false);

    if (result.success) {
        toast({
          title: "Booking Request Submitted!",
          description: `Your appointment request has been sent and is pending confirmation.`,
          variant: 'default',
        });
        setBookingConfirmed(true);
        form.reset();
    } else {
        toast({
            title: "Submission Failed",
            description: result.error || "An unknown error occurred.",
            variant: "destructive",
        });
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="space-y-6 flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)]">
         <CheckCircle className="w-24 h-24 text-green-500 mb-4" />
        <PageHeader title="Booking Submitted!" description="Your appointment request has been successfully recorded." />
        <p className="text-muted-foreground max-w-md">
            You will receive a notification once your appointment is confirmed. 
            You can manage your appointments from your dashboard.
        </p>
        <Button onClick={() => setBookingConfirmed(false)} className="mt-6">
          Book Another Appointment
        </Button>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <PageHeader title="Book a Visit" description="Schedule your appointment with our smart AI-powered scheduler." icon={CalendarIcon} />

      <Card className="max-w-2xl mx-auto shadow-xl rounded-xl">
        <CardHeader className="bg-primary/5">
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><UserCheck className="w-6 h-6"/>Smart Scheduler</CardTitle>
          <CardDescription>Fill in the details below. This form writes directly to your patient record in Firestore.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="facilityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Facility</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input focus:ring-primary"><Hospital className="mr-2 h-4 w-4 text-muted-foreground"/> <SelectValue placeholder="Select a facility" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {facilities.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Service</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input focus:ring-primary"><UserCheck className="mr-2 h-4 w-4 text-muted-foreground"/> <SelectValue placeholder="Select a service" /></SelectValue>
                      </FormControl>
                      <SelectContent>
                        {services.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-semibold">Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-input hover:bg-input/90 focus:ring-primary",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input focus:ring-primary"><Clock className="mr-2 h-4 w-4 text-muted-foreground"/> <SelectValue placeholder="Select a time slot" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableTimes.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Reason for Visit (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe the reason for your appointment..."
                        className="min-h-[100px] bg-input focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center p-3 bg-accent/10 border border-accent/30 rounded-md text-sm text-accent">
                <AlertTriangle className="h-5 w-5 mr-2 shrink-0" />
                <p>AI-powered slot suggestions are coming soon to help you find the best appointment times!</p>
              </div>

              <Button type="submit" className="w-full text-lg py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md" disabled={isSubmitting}>
                {isSubmitting ? <><Activity className="mr-2 h-4 w-4 animate-spin"/>Submitting Request...</> : "Request Booking"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

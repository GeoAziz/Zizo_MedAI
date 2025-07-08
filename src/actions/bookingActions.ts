
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { format } from "date-fns";

const bookingSchema = z.object({
  facilityId: z.string().min(1, "Facility is required."),
  service: z.string().min(1, "Service is required."),
  date: z.date({ required_error: "A valid date is required." }),
  time: z.string().min(1, "Time slot is required."),
  reason: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

const facilities = [
    { id: "F001", name: "Zizo General Hospital" },
    { id: "F002", name: "MediAI Clinic North" },
    { id: "F003", name: "BioScan Diagnostics Hub" },
];

export async function createBookingAction(
    data: BookingFormValues, 
    patientId: string
) {
    // 1. Validate data on the server
    const validationResult = bookingSchema.safeParse(data);

    if (!validationResult.success) {
        console.error("Server-side validation failed:", validationResult.error);
        return { success: false, error: "Invalid data provided." };
    }

    if (!patientId) {
         return { success: false, error: "Patient not authenticated." };
    }
    
    const facilityName = facilities.find(f => f.id === data.facilityId)?.name || "Unknown Facility";

    // 2. Add validated and enriched data to Firestore
    try {
        const appointmentsCollectionRef = collection(db, 'users', patientId, 'appointments');
        await addDoc(appointmentsCollectionRef, {
            patientId: patientId,
            facilityId: data.facilityId,
            facilityName: facilityName, 
            service: data.service,
            // Store date as a simple string for easy display, and timestamp for querying
            date: format(data.date, "yyyy-MM-dd"),
            time: data.time,
            reason: data.reason || "",
            status: 'Pending', // All new bookings are pending confirmation
            createdAt: serverTimestamp(),
            // In a real app, you'd assign a doctor based on service and availability
            doctor: facilityName, 
            type: data.service,
            specialty: data.service,
        });
        
        return { success: true };
    } catch (error) {
        console.error("Error creating appointment: ", error);
        return { success: false, error: "Failed to create appointment in the database." };
    }
}

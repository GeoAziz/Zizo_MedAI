
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Re-define schema on the server for validation. This is a security best practice.
const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required."),
  drugName: z.string().min(1, "Drug name is required."),
  dosage: z.string().min(1, "Dosage is required."),
  frequency: z.string().min(1, "Frequency is required."),
  duration: z.string().optional(),
  quantity: z.coerce.number().min(1).optional(),
  refills: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

export type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

export async function createPrescriptionAction(
    data: PrescriptionFormValues, 
    doctorId: string
) {
    // 1. Validate data on the server
    const validationResult = prescriptionSchema.safeParse(data);

    if (!validationResult.success) {
        console.error("Server-side validation failed:", validationResult.error);
        return { success: false, error: "Invalid data provided." };
    }

    if (!doctorId) {
         return { success: false, error: "Doctor not authenticated." };
    }

    // 2. Add validated data to Firestore
    try {
        const prescriptionsCollectionRef = collection(db, 'users', data.patientId, 'prescriptions');
        await addDoc(prescriptionsCollectionRef, {
            ...data,
            doctorId: doctorId,
            status: 'Active',
            prescribedAt: serverTimestamp(),
        });
        
        return { success: true };
    } catch (error) {
        console.error("Error creating prescription: ", error);
        // In a real app, you might want to log this error to a monitoring service.
        return { success: false, error: "Failed to create prescription in the database." };
    }
}

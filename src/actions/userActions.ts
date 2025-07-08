
'use server';

import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(['patient', 'doctor'], "Role must be either 'patient' or 'doctor'."),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export async function createUserAction(data: CreateUserFormValues) {
  // 1. Validate data on the server
  const validationResult = createUserSchema.safeParse(data);

  if (!validationResult.success) {
    console.error("Server-side validation failed:", validationResult.error.flatten());
    return { success: false, error: "Invalid data provided. Please check the form and try again." };
  }

  const { email, password, name, role } = validationResult.data;

  try {
    // 2. Create user in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 3. Create user document in Firestore
    const userDocRef = adminDb.collection('users').doc(userRecord.uid);
    await userDocRef.set({
      uid: userRecord.uid,
      name,
      email,
      role,
      createdAt: FieldValue.serverTimestamp(),
    });

    return { success: true, userId: userRecord.uid };

  } catch (error: any) {
    console.error("Error creating user:", error);

    // Provide more specific error messages
    if (error.code === 'auth/email-already-exists') {
      return { success: false, error: 'This email address is already in use by another account.' };
    }
    if (error.code === 'auth/invalid-password') {
        return { success: false, error: 'The password must be a string with at least six characters.' };
    }
    
    // In a real app, you might want to log this error to a monitoring service.
    return { success: false, error: 'An unexpected error occurred while creating the user.' };
  }
}


// src/services/appointments.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: "Confirmed" | "Completed" | "Pending" | "Cancelled";
}

export async function getAppointments(userId: string): Promise<Appointment[]> {
  if (!userId) {
    console.warn("getAppointments called without a userId.");
    return [];
  }
  
  try {
    const appointmentsCollectionRef = collection(db, 'users', userId, 'appointments');
    const q = query(appointmentsCollectionRef, orderBy('createdAt', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);

    const appointments = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            doctor: data.doctor || 'N/A',
            specialty: data.specialty || 'N/A',
            date: data.date, // Assumes date is stored as 'YYYY-MM-DD'
            time: data.time,
            type: data.type || 'N/A',
            status: data.status || 'Pending'
        } as Appointment;
    });
    
    return appointments;
  } catch (error) {
    console.error(`Error fetching appointments for user ${userId}:`, error);
    // In a real app, you might want to throw the error to be handled by the UI component
    throw new Error("Failed to fetch appointments from the database.");
  }
}

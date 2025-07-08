
// src/services/prescriptions.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';

export interface Prescription {
  id: string;
  name: string;
  dosage: string;
  status: "Active" | "Completed" | "Needs Refill";
  prescribedBy: string;
  date: string;
}

export async function getPrescriptions(userId: string): Promise<Prescription[]> {
  if (!userId) {
    console.warn("getPrescriptions called without a userId.");
    return [];
  }
  
  try {
    const prescriptionsCollectionRef = collection(db, 'users', userId, 'prescriptions');
    const q = query(prescriptionsCollectionRef, orderBy('prescribedAt', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);

    const prescriptions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const prescribedAt = data.prescribedAt as Timestamp;

        return {
            id: doc.id,
            name: data.drugName || 'N/A',
            dosage: data.dosage || 'N/A',
            status: data.status || 'Active',
            prescribedBy: "Dr. Mock", // This should be fetched from the doctor's record
            date: prescribedAt ? prescribedAt.toDate().toLocaleDateString() : 'N/A',
        } as Prescription;
    });
    
    return prescriptions;
  } catch (error) {
    console.error(`Error fetching prescriptions for user ${userId}:`, error);
    throw new Error("Failed to fetch prescriptions from the database.");
  }
}

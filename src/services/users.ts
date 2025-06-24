
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export interface PatientRecord {
  uid: string;
  name: string;
  email: string;
}

export async function getPatients(): Promise<PatientRecord[]> {
  try {
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where('role', '==', 'patient'));
    const querySnapshot = await getDocs(q);
    
    const patients = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            uid: doc.id,
            name: data.name || 'Unnamed Patient',
            email: data.email || 'No Email'
        } as PatientRecord;
    });

    return patients;
  } catch (error) {
    console.error("Error fetching patients: ", error);
    // In a real app, you'd want more robust error handling.
    // For the prototype, returning an empty array is fine.
    return [];
  }
}

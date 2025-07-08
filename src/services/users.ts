
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export interface UserRecord {
  uid: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
}

export interface PatientRecord {
  uid: string;
  name: string;
  email: string;
}

// Function to get all users for the admin dashboard
export async function getUsers(): Promise<UserRecord[]> {
  try {
    const usersCollectionRef = collection(db, 'users');
    // Order by creation time to show newest users first
    const q = query(usersCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const users = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            uid: doc.id,
            name: data.name || 'Unnamed User',
            email: data.email || 'No Email',
            role: data.role || 'patient' // Default to patient if role is missing
        } as UserRecord;
    });

    return users;
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw new Error("Failed to fetch user list from the database.");
  }
}

// Function specifically to get only patients, for doctor-facing features
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

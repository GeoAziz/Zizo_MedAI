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
  assignedDoctorId?: string;
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
            email: data.email || 'No Email',
            assignedDoctorId: data.assignedDoctorId || ''
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

export async function getPatientsForDoctor(doctorUid: string): Promise<PatientRecord[]> {
  const patients: PatientRecord[] = [];

  const usersCollectionRef = collection(db, 'users');
  const q1 = query(
    usersCollectionRef,
    where('role', '==', 'patient'),
    where('assignedDoctorId', '==', doctorUid)
  );
  const q2 = query(
    usersCollectionRef,
    where('role', '==', 'patient'),
    where('doctorId', '==', doctorUid)
  );

  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
  snap1.forEach(doc => patients.push({
    uid: doc.id,
    name: doc.data().name || 'Unnamed Patient',
    email: doc.data().email || 'No Email',
    assignedDoctorId: doc.data().assignedDoctorId || ''
  }));
  snap2.forEach(doc => {
    if (!patients.find(p => p.uid === doc.id)) {
      patients.push({
        uid: doc.id,
        name: doc.data().name || 'Unnamed Patient',
        email: doc.data().email || 'No Email',
        assignedDoctorId: doc.data().assignedDoctorId || ''
      });
    }
  });
  return patients;
}

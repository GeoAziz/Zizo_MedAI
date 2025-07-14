// src/services/records.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface MedicalRecord {
    id: string;
    date: string;
    type: string;
    title: string;
    summary: string;
    tags: string[];
}

export async function getMedicalRecords(userId: string): Promise<MedicalRecord[]> {
  if (!userId) {
    console.warn("getMedicalRecords called without a userId.");
    return [];
  }
  try {
    const recordsCollectionRef = collection(db, 'users', userId, 'records');
    const q = query(recordsCollectionRef, orderBy('createdAt', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    const records = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date || 'N/A',
        type: data.type || 'N/A',
        title: data.title || 'N/A',
        summary: data.summary || '',
        tags: data.tags || [],
      } as MedicalRecord;
    });
    return records;
  } catch (error) {
    console.error(`Error fetching medical records for user ${userId}:`, error);
    throw new Error("Failed to fetch medical records from the database.");
  }
}

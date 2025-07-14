// src/services/labs.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface LabResult {
    id: string;
    testName: string;
    date: string;
    status: "Normal" | "Action Required" | "Monitor";
    reportUrl: string;
    trend: "stable" | "increasing" | "decreasing";
}

export async function getLabResults(userId: string): Promise<LabResult[]> {
  if (!userId) {
    console.warn("getLabResults called without a userId.");
    return [];
  }
  try {
    const labResultsCollectionRef = collection(db, 'users', userId, 'lab_results');
    const q = query(labResultsCollectionRef, orderBy('createdAt', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    const labResults = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        testName: data.testName || 'N/A',
        date: data.date || 'N/A',
        status: data.status || 'Normal',
        reportUrl: data.reportUrl || '#',
        trend: data.trend || 'stable',
      } as LabResult;
    });
    return labResults;
  } catch (error) {
    console.error(`Error fetching lab results for user ${userId}:`, error);
    throw new Error("Failed to fetch lab results from the database.");
  }
}

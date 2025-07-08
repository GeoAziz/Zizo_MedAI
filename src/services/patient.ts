
// This file simulates a service that fetches data for a patient.
// In a real application, this would make a call to a database like Firestore.
import { getAppointments, type Appointment } from './appointments';
import { getPrescriptions, type Prescription } from './prescriptions';
import { getCurrentUser } from './auth';

// A short delay to simulate network latency
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getPatientDashboardData() {
  await sleep(1000); // Simulate a network call
  
  const user = await getCurrentUser();
  if (!user) {
    // This case should be handled by redirects, but as a fallback:
    throw new Error("User not authenticated");
  }

  // Fetch real data for appointments and prescriptions
  const [appointments, prescriptions] = await Promise.all([
    getAppointments(user.uid),
    getPrescriptions(user.uid)
  ]);

  const mockData = {
    vitals: {
      heartRate: { value: "72", unit: "bpm" },
      temperature: { value: "36.8", unit: "°C" },
      oxygen: { value: "98", unit: "%" },
    },
    appointments: appointments,
    prescriptions: prescriptions,
  };

  return mockData;
}

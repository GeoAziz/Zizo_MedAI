// src/services/appointments.ts

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: "Confirmed" | "Completed" | "Pending" | "Cancelled";
}

const mockAppointments: Appointment[] = [
  { id: "A001", doctor: "Dr. Eva Core", specialty: "Cardiology", date: "2024-08-15", time: "10:00 AM", type: "Follow-up", status: "Confirmed" },
  { id: "A002", doctor: "Dr. Lee Min", specialty: "Pediatrics", date: "2024-08-20", time: "02:30 PM", type: "Annual Check-up", status: "Confirmed" },
  { id: "A003", doctor: "Zizo_MediAI", specialty: "AI Consultation", date: "2024-08-10", time: "N/A", type: "Symptom Analysis", status: "Completed" },
  { id: "A004", doctor: "Dr. Sarah Woods", specialty: "Dermatology", date: "2024-09-01", time: "11:00 AM", type: "Initial Consultation", status: "Pending" },
];


export async function getAppointments(userId: string): Promise<Appointment[]> {
  console.log(`Fetching appointments for user: ${userId}`);
  await sleep(700); // Simulate network delay
  // In a real app, you would fetch this from Firestore based on the userId
  return mockAppointments;
}

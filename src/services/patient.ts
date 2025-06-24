// This file simulates a service that fetches data for a patient.
// In a real application, this would make a call to a database like Firestore.

// A short delay to simulate network latency
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getPatientDashboardData() {
  await sleep(500); // Simulate a network call

  const mockData = {
    vitals: {
      heartRate: { value: "72", unit: "bpm" },
      temperature: { value: "36.8", unit: "°C" },
      oxygen: { value: "98", unit: "%" },
    },
    appointments: [
      { id: 1, doctor: "Dr. Eva Core", type: "Check-up", time: "Tomorrow, 10:00 AM", status: "Upcoming" },
      { id: 2, doctor: "Zizo_MediAI", type: "AI Consultation", time: "Yesterday, 02:30 PM", status: "Completed" },
    ],
    prescriptions: [
      { id: 1, name: "Amoxicillin", dosage: "250mg, 3 times a day", status: "Active" },
      { id: 2, name: "Vitamin D3", dosage: "1000IU, once a day", status: "Active" },
    ],
  };

  return mockData;
}

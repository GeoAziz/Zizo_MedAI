// src/services/records.ts

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface MedicalRecord {
    id: string;
    date: string;
    type: string;
    title: string;
    summary: string;
    tags: string[];
}

const mockMedicalRecords: MedicalRecord[] = [
  {
    id: "REC001",
    date: "2024-07-15",
    type: "Doctor's Visit",
    title: "Follow-up with Dr. Eva Core",
    summary: "Discussed ongoing hypertension management. Blood pressure readings stable. Medication adherence confirmed. Advised continued lifestyle modifications.",
    tags: ["Cardiology", "Hypertension", "Check-up"]
  },
  {
    id: "REC002",
    date: "2024-06-20",
    type: "Lab Report",
    title: "Lipid Panel Results",
    summary: "Total Cholesterol: 220 mg/dL (High). LDL: 150 mg/dL (High). HDL: 40 mg/dL (Low). Triglycerides: 180 mg/dL (High). Advised dietary changes and follow-up.",
    tags: ["Lab Results", "Cholesterol"]
  },
  {
    id: "REC003",
    date: "2024-05-05",
    type: "AI Consultation",
    title: "Symptom Analysis: Persistent Cough",
    summary: "Patient reported persistent cough and fatigue. AI suggested potential viral infection or allergies. Recommended RICE protocol and monitoring. Advised to see a doctor if symptoms worsen.",
    tags: ["AI Consult", "Respiratory"]
  },
  {
    id: "REC004",
    date: "2023-11-10",
    type: "Hospital Admission",
    title: "Asthma Exacerbation",
    summary: "Admitted for severe asthma attack. Treated with nebulizers and corticosteroids. Discharged after 2 days with updated action plan.",
    tags: ["Emergency", "Asthma", "Hospitalization"]
  }
];

export async function getMedicalRecords(userId: string): Promise<MedicalRecord[]> {
  console.log(`Fetching medical records for user: ${userId}`);
  await sleep(900); // Simulate network delay
  // In a real app, you would fetch this from a secure collection in Firestore
  return mockMedicalRecords;
}

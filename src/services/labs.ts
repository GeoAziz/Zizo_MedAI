// src/services/labs.ts

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface LabResult {
    id: string;
    testName: string;
    date: string;
    status: "Normal" | "Action Required" | "Monitor";
    reportUrl: string;
    trend: "stable" | "increasing" | "decreasing";
}

const mockLabResults: LabResult[] = [
  { id: "L001", testName: "Complete Blood Count (CBC)", date: "2024-07-20", status: "Normal", reportUrl: "#", trend: "stable" },
  { id: "L002", testName: "Lipid Panel", date: "2024-07-20", status: "Action Required", reportUrl: "#", trend: "increasing" },
  { id: "L003", testName: "Thyroid Stimulating Hormone (TSH)", date: "2024-06-15", status: "Normal", reportUrl: "#", trend: "stable" },
  { id: "L004", testName: "Glucose, Plasma", date: "2024-07-20", status: "Monitor", reportUrl: "#", trend: "decreasing" },
  { id: "L005", testName: "Urinalysis", date: "2024-05-10", status: "Normal", reportUrl: "#", trend: "stable" },
];

export async function getLabResults(userId: string): Promise<LabResult[]> {
  console.log(`Fetching lab results for user: ${userId}`);
  await sleep(1100); // Simulate network delay
  // In a real app, you would fetch this from Firestore
  return mockLabResults;
}

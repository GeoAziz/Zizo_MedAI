import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Example: Sync patient record to external EHR/EMR (FHIR, HL7, etc.)
    const { patientRecord } = req.body;
    // Replace with real API call
    // await fetch('https://ehr.example.com/api/patient', { method: 'POST', body: JSON.stringify(patientRecord) });
    res.status(200).json({ success: true, message: 'Patient record synced to EHR/EMR.' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
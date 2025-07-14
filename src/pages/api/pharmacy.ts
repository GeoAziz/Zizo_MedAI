import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Example: Send prescription data to external pharmacy API (FHIR, HL7, etc.)
    const { prescription } = req.body;
    // Replace with real API call
    // await fetch('https://pharmacy.example.com/api/prescriptions', { method: 'POST', body: JSON.stringify(prescription) });
    res.status(200).json({ success: true, message: 'Prescription sent to pharmacy network.' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
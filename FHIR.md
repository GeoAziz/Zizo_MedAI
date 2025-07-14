# FHIR Integration Documentation

## What is FHIR?
FHIR (Fast Healthcare Interoperability Resources) is a standard for exchanging healthcare data electronically. It enables interoperability between healthcare systems, allowing apps and hospitals to share medical records, lab results, prescriptions, and more.

## Role in This Project
- The UI was designed to fetch patient lab results and medical records from Firestore first.
- If Firestore had no data, the code would attempt to fetch from an external FHIR server (e.g., `https://fhir.zizomed.ai/Patient/{userId}/Observation?category=laboratory`).
- This fallback allows integration with hospital systems or national health databases that use FHIR.

## Why is FHIR Disabled?
- Due to project funding limits, there is no active FHIR backend available.
- The fallback fetch logic is commented out in `src/services/patient.ts`.
- All demo and test data is seeded directly into Firestore using `scripts/seed.js`.

## What Data is Seeded?
- The `scripts/seed.js` file seeds:
  - Lab results (CBC, Lipid Panel, TSH, Glucose, Urinalysis)
  - Medical records (doctor visits, lab reports, AI consultations, hospital admissions)
  - Appointments, prescriptions, and more
- This ensures the UI works fully without needing FHIR.

## Recommendations
- For demo and development, rely on Firestore and seeded data.
- If you need real FHIR integration in the future:
  - Set up a working FHIR backend
  - Uncomment the FHIR fetch logic in `src/services/patient.ts`
  - Upgrade Firebase to a paid plan for secure backend calls
- Document any changes to FHIR integration here.

## How the UI Uses FHIR (when enabled)
- If Firestore returns no lab results or medical records, the UI would fetch from the FHIR server.
- Data from FHIR would be mapped to the same format as Firestore for display in the dashboard.

## How to Re-enable FHIR
- Uncomment the relevant code blocks in `src/services/patient.ts`.
- Ensure the FHIR server endpoint is correct and reachable.
- Test the integration with real patient data.

---
For questions or future integration, contact the project maintainer.

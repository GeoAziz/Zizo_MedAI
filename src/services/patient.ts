// This file simulates a service that fetches data for a patient.
// In a real application, this would make a call to a database like Firestore.
import { getAppointments, type Appointment } from './appointments';
import { getPrescriptions, type Prescription } from './prescriptions';
import { getCurrentUser } from './auth';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, addDoc, Timestamp } from 'firebase/firestore';

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
  // Fetch live chart notes and annotations from Firestore
  const chartsRef = collection(doc(collection(db, 'users'), user.uid), 'charts');
  const chartsSnap = await getDocs(chartsRef);
  const charts = chartsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Fetch live surgery schedule from Firestore
  const surgeriesRef = collection(doc(collection(db, 'users'), user.uid), 'surgeries');
  const surgeriesSnap = await getDocs(surgeriesRef);
  const surgeries = surgeriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // --- Lab Results: Live Firestore Query, full FHIR server integration ---
  type LabResult = { id: string; [key: string]: any };
  let labResults: LabResult[] = [];
  let fetchedLabResultsFromFHIR = false;
  try {
    const labResultsRef = collection(doc(collection(db, 'users'), user.uid), 'lab_results');
    const labResultsSnap = await getDocs(labResultsRef);
    labResults = labResultsSnap.docs.map(doc => ({ ...(doc.data() as LabResult), id: doc.id }));
    if (!labResults.length) throw new Error('No Firestore lab results');
  } catch (e) {
    // FHIR integration is commented out due to project funding limits.
    // To re-enable, uncomment the code below and ensure a working FHIR backend is available.
    /*
    try {
      const fhirRes = await fetch(`https://fhir.zizomed.ai/Patient/${user.uid}/Observation?category=laboratory`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (fhirRes.ok) {
        const fhirData = await fhirRes.json();
        labResults = (fhirData.entry || []).map((entry: any) => {
          const obs = entry.resource;
          return {
            id: obs.id || '',
            testName: obs.code?.text || 'Unknown Test',
            date: obs.effectiveDateTime || obs.issued || 'N/A',
            status: obs.status || 'Unknown',
            reportUrl: '#',
            trend: 'stable',
            value: obs.valueQuantity?.value || obs.valueString || '',
            unit: obs.valueQuantity?.unit || '',
          };
        });
        fetchedLabResultsFromFHIR = true;
      }
    } catch (fhirErr) {
      console.error('Error fetching lab results from FHIR server:', fhirErr);
      labResults = [];
    }
    */
  }

  // --- Medical Records: Live Firestore Query, full FHIR server integration ---
  type MedicalRecord = { id: string; [key: string]: any };
  let records: MedicalRecord[] = [];
  let fetchedFromFHIR = false;
  try {
    const recordsRef = collection(doc(collection(db, 'users'), user.uid), 'records');
    const recordsSnap = await getDocs(recordsRef);
    records = recordsSnap.docs.map(doc => ({ ...(doc.data() as MedicalRecord), id: doc.id }));
    if (!records.length) throw new Error('No Firestore records');
  } catch (e) {
    // FHIR integration is commented out due to project funding limits.
    // To re-enable, uncomment the code below and ensure a working FHIR backend is available.
    /*
    try {
      const fhirRes = await fetch(`https://fhir.zizomed.ai/Patient/${user.uid}/DocumentReference`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (fhirRes.ok) {
        const fhirData = await fhirRes.json();
        records = (fhirData.entry || []).map((entry: any) => {
          const doc = entry.resource;
          return {
            id: doc.id || '',
            date: doc.date || doc.created || 'N/A',
            type: doc.type?.text || 'Medical Record',
            title: doc.description || doc.type?.text || 'Untitled',
            summary: doc.content?.[0]?.attachment?.title || '',
            tags: doc.category?.map((cat: any) => cat.text) || [],
            url: doc.content?.[0]?.attachment?.url || '',
          };
        });
        fetchedFromFHIR = true;
      }
    } catch (fhirErr) {
      console.error('Error fetching medical records from FHIR server:', fhirErr);
      records = [];
    }
    */
  }

  // --- Live Vitals Integration ---
  // 1. Try Firestore (wearable uploads)
  // 2. If missing, try HealthKit/Google Fit API (mocked for now)
  type VitalsData = {
    heartRate?: number;
    temperature?: number;
    oxygen?: number;
    bloodPressure?: string;
    respiration?: number;
    timestamp?: string;
    source?: string;
    createdAt?: { toMillis: () => number };
  };

  type VitalsCardData = {
    heartRate: { value: number | string; unit: string };
    temperature: { value: number | string; unit: string };
    oxygen: { value: number | string; unit: string };
    bloodPressure?: { value: string; unit: string };
    respiration?: { value: number | string; unit: string };
    source?: string;
    timestamp?: string;
  };
  let vitals: VitalsCardData = {
    heartRate: { value: "-", unit: "bpm" },
    temperature: { value: "-", unit: "°C" },
    oxygen: { value: "-", unit: "%" },
    bloodPressure: { value: "-", unit: "mmHg" },
    respiration: { value: "-", unit: "rpm" },
  };

  let foundLiveVitals = false;
  try {
    const vitalsRef = collection(doc(collection(db, 'users'), user.uid), 'vitals');
    const vitalsSnap = await getDocs(vitalsRef);
    let latest: VitalsData | null = null;
    vitalsSnap.forEach((doc) => {
      const data = doc.data() as VitalsData;
      if (!latest || (data.createdAt && data.createdAt.toMillis() > (latest.createdAt?.toMillis?.() ?? 0))) {
        latest = data;
      }
    });
    // Use a type guard to ensure latest is VitalsData
    if (
      latest !== null &&
      typeof (latest as VitalsData).heartRate === "number" &&
      typeof (latest as VitalsData).temperature === "number" &&
      typeof (latest as VitalsData).oxygen === "number"
    ) {
      const safeLatest = latest as VitalsData;
      vitals = {
        heartRate: { value: safeLatest.heartRate ?? "-", unit: "bpm" },
        temperature: { value: safeLatest.temperature ?? "-", unit: "°C" },
        oxygen: { value: safeLatest.oxygen ?? "-", unit: "%" },
        bloodPressure: { value: safeLatest.bloodPressure ?? "-", unit: "mmHg" },
        respiration: { value: typeof safeLatest.respiration === "number" ? safeLatest.respiration : "-", unit: "rpm" },
        source: safeLatest.source ?? "wearable-upload",
        timestamp: safeLatest.timestamp ?? undefined,
      };
      foundLiveVitals = true;
    }
  } catch (e) {
    // fallback to next source
  }

  // --- Fallback: HealthKit/Google Fit API (mocked) ---
  if (!foundLiveVitals) {
    // Simulate fetching from HealthKit/Google Fit
    // In production, replace with real API integration
    // Example: fetch('/api/healthkit/vitals?uid=' + user.uid)
    const wearableApiResponse: VitalsData | null = await mockFetchWearableVitals(user.uid);
    if (wearableApiResponse) {
      vitals = {
        heartRate: { value: typeof wearableApiResponse.heartRate === "number" ? wearableApiResponse.heartRate : "-", unit: "bpm" },
        temperature: { value: typeof wearableApiResponse.temperature === "number" ? wearableApiResponse.temperature : "-", unit: "°C" },
        oxygen: { value: typeof wearableApiResponse.oxygen === "number" ? wearableApiResponse.oxygen : "-", unit: "%" },
        bloodPressure: { value: wearableApiResponse.bloodPressure ?? "-", unit: "mmHg" },
        respiration: { value: typeof wearableApiResponse.respiration === "number" ? wearableApiResponse.respiration : "-", unit: "rpm" },
        source: wearableApiResponse.source ?? "HealthKit/GoogleFit",
        timestamp: wearableApiResponse.timestamp ?? undefined,
      };
    }
  }

  // --- End Live Vitals Integration ---

  // Helper: Simulate HealthKit/Google Fit API
  async function mockFetchWearableVitals(uid: string): Promise<VitalsData | null> {
    // Simulate a network call
    await sleep(500);
    // Return mock data (replace with real API call in production)
    return {
      heartRate: 76,
      temperature: 36.7,
      oxygen: 98,
      bloodPressure: "120/80",
      respiration: 16,
      source: "HealthKit/GoogleFit",
      timestamp: new Date().toISOString(),
    };
  }
  // --- Notifications & Engagement ---
  // Push notifications for appointments and critical alerts
  // Uses Firebase Cloud Messaging (FCM) via Admin SDK
  // Helper: Send push notification using API route
  async function sendPushNotification(userId: string, title: string, body: string) {
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title, body }),
    });
  }

  // Example: Send notification for upcoming appointment
  if (appointments && appointments.length) {
    const upcoming = appointments.find(a => a.status === 'Confirmed');
    if (upcoming) {
      await sendPushNotification(user.uid, 'Upcoming Appointment', `You have an appointment with ${upcoming.doctor} on ${upcoming.date} at ${upcoming.time}.`);
    }
  }

  // Example: Send notification for critical vitals
  if (vitals.heartRate.value !== '-' && typeof vitals.heartRate.value === 'number' && vitals.heartRate.value > 120) {
    await sendPushNotification(user.uid, 'Critical Alert', 'Your heart rate is above normal. Please consult your doctor.');
  }

  // --- Health Missions: Live Firestore Query ---
  let missions: any[] = [];
  try {
    const missionsRef = collection(doc(collection(db, 'users'), user.uid), 'missions');
    const missionsSnap = await getDocs(missionsRef);
    missions = missionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    missions = [];
  }

  // --- Personalized Health Insights (AI) ---
  async function getPersonalizedHealthInsights(userId: string, vitals: any, records: any[]) {
    // In production, this would call a Genkit/AI backend API
    const response = await fetch('/api/genkit/health-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, vitals, records })
    });
    if (response.ok) {
      const data = await response.json();
      return {
        insights: data.insights || [],
        missions: data.missions || [], // Gamified health missions from AI backend
      };
    }
    return { insights: [], missions: [] };
  }

  const { insights: healthInsights } = await getPersonalizedHealthInsights(user.uid, vitals, records);

  return {
    vitals,
    appointments,
    prescriptions,
    charts,
    surgeries,
    labResults,
    records,
    healthInsights,
    missions, // Use missions from Firestore for dashboard
  };
}

// Integration: Send real wearable vitals to Firestore
export async function sendWearableVitalsToFirestore(userId: string, vitals: {
  heartRate?: number;
  temperature?: number;
  oxygen?: number;
  bloodPressure?: string;
  respiration?: number;
  source?: string;
}) {
  const vitalsRef = collection(doc(collection(db, 'users'), userId), 'vitals');
  await addDoc(vitalsRef, {
    ...vitals,
    createdAt: Timestamp.now(),
    timestamp: new Date().toISOString(),
  });
}

// Example usage in prescription logic:
async function sendPrescriptionToPharmacy(prescription: any) {
  await fetch('/api/pharmacy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prescription })
  });
}

// Example usage in patient record sync:
async function syncPatientRecordToEHR(patientRecord: any) {
  await fetch('/api/ehr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientRecord })
  });
}

// Example Genkit AI flow for automated SOAP note generation
export async function generateSoapNoteFromConsult(consultTranscript: string) {
  // Simulate Genkit AI call
  const response = await fetch('/api/genkit/soap-note', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript: consultTranscript })
  });
  const data = await response.json();
  return data.soapNote;
}

// Example Genkit AI flow for pre-op planning
export async function generatePreOpPlan(patientId: string, surgeryDetails: any) {
  // Simulate Genkit AI call
  const response = await fetch('/api/genkit/preop-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId, surgeryDetails })
  });
  const data = await response.json();
  return data.preOpPlan;
}

// --- Emergency Tracking: Real-Time Ambulance Location (Google Maps API) ---
export async function getAmbulanceLocation(incidentId: string): Promise<{ lat: number; lng: number; status: string; eta: string }> {
  // In production, fetch from backend or Google Maps API
  // Example: fetch(`/api/ambulance-location?incidentId=${incidentId}`)
  // Mocked response for demo
  await sleep(500);
  return {
    lat: 10.001 + Math.random() * 0.01,
    lng: 10.001 + Math.random() * 0.01,
    status: "En Route",
    eta: "5 min",
  };
}

// --- Telehealth Video Calls: WebRTC Integration ---
export async function startTelehealthSession(patientId: string, doctorId: string): Promise<{ roomId: string; signalingUrl: string }> {
  // In production, create a room and return signaling info
  // Example: fetch('/api/webrtc/session', { method: 'POST', ... })
  await sleep(500);
  return {
    roomId: `room-${patientId}-${doctorId}-${Date.now()}`,
    signalingUrl: "wss://webrtc-signaling.zizomed.ai/session",
  };
}

# Wearable Vitals API Integration

This document describes the API and data structure for integrating wearable devices to provide live vitals for patients in Zizo_MedAI.

---

## Firestore Data Structure

Vitals are stored in a subcollection under each patient:

```
/users/{patientId}/vitals/{vitalId}
```

Each vital document contains:
- `timestamp`: ISO string or Firestore Timestamp
- `heartRate`: number (bpm)
- `temperature`: number (°C)
- `oxygen`: number (%)
- (optional) `bloodPressure`: string (e.g., "120/80")
- (optional) `source`: string (e.g., "Fitbit", "Apple Watch")

---

## API Endpoints (Example)

### 1. Upload Vitals (from wearable)
`POST /api/patient/{patientId}/vitals`

**Body:**
```
{
  "heartRate": 72,
  "temperature": 36.8,
  "oxygen": 98,
  "timestamp": "2024-07-25T10:00:00Z",
  "source": "Fitbit"
}
```

### 2. Get Latest Vitals
`GET /api/patient/{patientId}/vitals/latest`

**Response:**
```
{
  "heartRate": 72,
  "temperature": 36.8,
  "oxygen": 98,
  "timestamp": "2024-07-25T10:00:00Z",
  "source": "Fitbit"
}
```

---

## Integration Steps
1. Wearable device or backend pushes vitals to Firestore using the above structure.
2. Patient service file fetches latest vitals from `/users/{patientId}/vitals`.
3. Dashboard UI displays real-time vitals.

---

## Security & Privacy
- Only authenticated patients and their assigned doctors can read vitals.
- All data is encrypted in transit and at rest.

---

## Extensibility
- Add more fields as needed (e.g., ECG, steps, sleep).
- Support multiple sources/devices.

---

## Example Firestore Document
```
/users/patient_john_doe/vitals/2024-07-25T10:00:00Z
{
  heartRate: 72,
  temperature: 36.8,
  oxygen: 98,
  timestamp: "2024-07-25T10:00:00Z",
  source: "Fitbit"
}
```

---

For questions or integration support, contact the Zizo_MedAI backend team.

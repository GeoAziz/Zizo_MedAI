// scripts/seed.js
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid'); // To generate unique IDs

// IMPORTANT: Instructions to get this file are in the README.md in this directory.
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

// --- MOCK DATA DEFINITIONS ---

const usersToCreate = [
  // Doctors
  { uid: 'doc_eva_core', email: 'eva.core@zizomed.ai', password: 'password123', name: 'Dr. Eva Core', role: 'doctor' },
  { uid: 'doc_ken_miles', email: 'ken.miles@zizomed.ai', password: 'password123', name: 'Dr. Ken Miles', role: 'doctor' },
  { uid: 'doc_anya_sharma', email: 'anya.sharma@zizomed.ai', password: 'password123', name: 'Dr. Anya Sharma', role: 'doctor' },
  { uid: 'doc_lee_min', email: 'lee.min@zizomed.ai', password: 'password123', name: 'Dr. Lee Min', role: 'doctor' },
  { uid: 'doc_emily_carter', email: 'emily.carter@zizomed.ai', password: 'password123', name: 'Dr. Emily Carter', role: 'doctor' },
  { uid: 'doc_omar_hassan', email: 'omar.hassan@zizomed.ai', password: 'password123', name: 'Dr. Omar Hassan', role: 'doctor' },
  { uid: 'doc_sarah_woods', email: 'sarah.woods@zizomed.ai', password: 'password123', name: 'Dr. Sarah Woods', role: 'doctor' },
  
  // Patients
  { uid: 'patient_john_doe', email: 'john.doe@example.com', password: 'password123', name: 'Johnathan P. Doe', role: 'patient' },
  { uid: 'patient_jane_smith', email: 'jane.smith@example.com', password: 'password123', name: 'Jane A. Smith', role: 'patient' },
  { uid: 'patient_alice_b', email: 'alice.b@example.com', password: 'password123', name: 'Alice B. Brown', role: 'patient' },
  { uid: 'patient_robert_c', email: 'robert.c@example.com', password: 'password123', name: 'Robert C. Johnson', role: 'patient' },
  { uid: 'patient_emily_d', email: 'emily.d@example.com', password: 'password123', name: 'Emily K. Davis', role: 'patient' },
  { uid: 'patient_michael_w', email: 'michael.w@example.com', password: 'password123', name: 'Michael P. Wilson', role: 'patient' },
  { uid: 'patient_david_l', email: 'david.l@example.com', password: 'password123', name: 'David L. Lee', role: 'patient' },
  { uid: 'patient_sophia_m', email: 'sophia.m@example.com', password: 'password123', name: 'Sophia T. Miller', role: 'patient' },

  // Admin
  { uid: 'admin_main', email: 'admin@zizomed.ai', password: 'password123', name: 'Main Admin', role: 'admin' },
];

const patientData = {
  'patient_john_doe': {
    prescriptions: [
      { drugName: 'Lisinopril 10mg', dosage: '1 tablet daily', frequency: 'Once daily', status: 'Active', doctorId: 'doc_eva_core' },
      { drugName: 'Ventolin Inhaler', dosage: '2 puffs as needed', frequency: 'As needed for asthma', status: 'Active', doctorId: 'doc_eva_core' },
    ],
    appointments: [
      { facilityId: 'F001', facilityName: 'Zizo General Hospital', service: 'Cardiology Check-up', date: '2024-08-15', time: '10:00 AM', doctor: 'Dr. Eva Core', specialty: 'Cardiology', type: 'Check-up', status: 'Confirmed' },
      { facilityId: 'F002', facilityName: 'MediAI Clinic North', service: 'General Follow-up', date: '2024-07-20', time: '02:30 PM', doctor: 'Dr. Ken Miles', specialty: 'Family Medicine', type: 'Follow-up', status: 'Completed' },
      { facilityId: 'F002', facilityName: 'MediAI Clinic North', service: 'Dermatology Consult', date: '2024-09-05', time: '01:00 PM', doctor: 'Dr. Sarah Woods', specialty: 'Dermatology', type: 'Consultation', status: 'Confirmed' },
    ]
  },
  'patient_jane_smith': {
    prescriptions: [
      { drugName: 'Metformin 500mg', dosage: '1 tablet twice daily', frequency: 'Twice daily with meals', status: 'Active', doctorId: 'doc_eva_core' },
    ],
    appointments: [
      { facilityId: 'F001', facilityName: 'Zizo General Hospital', service: 'Endocrinology Consultation', date: '2024-08-22', time: '11:00 AM', doctor: 'Dr. Eva Core', specialty: 'Endocrinology', type: 'Consultation', status: 'Confirmed' },
      { facilityId: 'F001', facilityName: 'Zizo General Hospital', service: 'Diabetes Follow-up', date: '2024-09-18', time: '11:30 AM', doctor: 'Dr. Eva Core', specialty: 'Endocrinology', type: 'Follow-up', status: 'Confirmed' },
    ]
  },
  'patient_alice_b': {
    prescriptions: [],
    appointments: [
        { facilityId: 'F003', facilityName: 'BioScan Diagnostics Hub', service: 'MRI Scan', date: '2024-09-01', time: '09:00 AM', doctor: 'Dr. Omar Hassan', specialty: 'Radiology', type: 'Diagnostic', status: 'Confirmed' },
    ]
  },
  'patient_robert_c': {
    prescriptions: [
      { drugName: 'Celecoxib 200mg', dosage: '1 capsule daily', frequency: 'Once daily', status: 'Active', doctorId: 'doc_anya_sharma' }
    ],
    appointments: [
      { facilityId: 'F001', facilityName: 'Zizo General Hospital', service: 'Orthopedics Follow-up', date: '2024-09-10', time: '03:00 PM', doctor: 'Dr. Anya Sharma', specialty: 'Orthopedics', type: 'Follow-up', status: 'Confirmed'}
    ]
  },
  'patient_emily_d': {
    prescriptions: [
      { drugName: 'Oxycodone 5mg', dosage: '1 tablet every 6 hours as needed for pain', frequency: 'PRN', status: 'Completed', doctorId: 'doc_emily_carter' }
    ],
    appointments: [
      { facilityId: 'F002', facilityName: 'MediAI Clinic North', service: 'Post-Op Check-up', date: '2024-08-20', time: '10:30 AM', doctor: 'Dr. Emily Carter', specialty: 'Ophthalmology', type: 'Check-up', status: 'Completed'}
    ]
  },
  'patient_michael_w': {
    prescriptions: [
      { drugName: 'Furosemide 40mg', dosage: '1 tablet daily', frequency: 'Once daily', status: 'Active', doctorId: 'doc_eva_core' },
      { drugName: 'Carvedilol 12.5mg', dosage: '1 tablet twice daily', frequency: 'BID', status: 'Active', doctorId: 'doc_eva_core' }
    ],
    appointments: [
      { facilityId: 'F001', facilityName: 'Zizo General Hospital', service: 'Cardiology Follow-up', date: '2024-09-05', time: '02:00 PM', doctor: 'Dr. Eva Core', specialty: 'Cardiology', type: 'Follow-up', status: 'Confirmed'}
    ]
  },
  'patient_david_l': {
    prescriptions: [],
    appointments: [
      { facilityId: 'F003', facilityName: 'BioScan Diagnostics Hub', service: 'Pre-Op Eye Exam', date: '2024-08-25', time: '09:30 AM', doctor: 'Dr. Emily Carter', specialty: 'Ophthalmology', type: 'Diagnostic', status: 'Confirmed' }
    ]
  },
  'patient_sophia_m': {
    prescriptions: [],
    appointments: [
      { facilityId: 'F001', facilityName: 'Zizo General Hospital', service: 'Surgical Consultation', date: '2024-08-18', time: '04:00 PM', doctor: 'Dr. Anya Sharma', specialty: 'General Surgery', type: 'Consultation', status: 'Confirmed' }
    ]
  }
};

const doctorsToCreate = [
  { uid: 'doc_eva_core', name: 'Dr. Eva Core', specialty: 'Cardiology' },
  { uid: 'doc_ken_miles', name: 'Dr. Ken Miles', specialty: 'Family Medicine' },
  { uid: 'doc_anya_sharma', name: 'Dr. Anya Sharma', specialty: 'General Surgery' },
  { uid: 'doc_lee_min', name: 'Dr. Lee Min', specialty: 'Pediatrics' },
  { uid: 'doc_emily_carter', name: 'Dr. Emily Carter', specialty: 'Ophthalmology' },
  { uid: 'doc_omar_hassan', name: 'Dr. Omar Hassan', specialty: 'Radiology' },
  { uid: 'doc_sarah_woods', name: 'Dr. Sarah Woods', specialty: 'Dermatology' },
];

const facilitiesToCreate = [
  { id: 'F001', name: 'Zizo General Hospital', type: 'Hospital', status: 'Online', region: 'City Center', load: 'Normal', coordinates: { lat: 10, lng: 10 } },
  { id: 'F002', name: 'MediAI Clinic North', type: 'Clinic', status: 'Online', region: 'North Suburbs', load: 'Busy', coordinates: { lat: 20, lng: 20 } },
  { id: 'F003', name: 'BioScan Diagnostics Hub', type: 'Diagnostics', status: 'Online', region: 'Tech Park', load: 'Normal', coordinates: { lat: 30, lng: 30 } },
];

// Assign patients to doctors (for demo, distribute evenly)
const doctorPatientMap = {
  'doc_eva_core': ['patient_john_doe', 'patient_jane_smith', 'patient_michael_w'],
  'doc_ken_miles': ['patient_alice_b', 'patient_jane_smith'],
  'doc_anya_sharma': ['patient_robert_c', 'patient_sophia_m'],
  'doc_emily_carter': ['patient_emily_d', 'patient_david_l'],
  'doc_lee_min': ['patient_john_doe', 'patient_alice_b'], // Assign patients to previously empty doctors
  'doc_omar_hassan': ['patient_robert_c', 'patient_emily_d'],
  'doc_sarah_woods': ['patient_michael_w', 'patient_sophia_m'],
};

// --- SCRIPT LOGIC ---

async function seedDatabase() {
  console.log('Starting database seed...');

  // 1. Create Auth users
  console.log('Creating authentication entries...');
  const userCreationPromises = usersToCreate.map(user => 
    auth.createUser({
      uid: user.uid,
      email: user.email,
      password: user.password,
      displayName: user.name,
    }).catch(error => {
      // If user already exists, just log it and continue.
      if (error.code === 'auth/uid-already-exists' || error.code === 'auth/email-already-exists') {
        console.log(`User with email ${user.email} or UID ${user.uid} already exists. Skipping creation.`);
        return null; // Don't throw, just skip.
      }
      throw error; // Throw other errors
    })
  );
  await Promise.all(userCreationPromises);
  console.log('Authentication entries created or verified.');

  // 2. Create Firestore documents for users
  console.log('Creating user documents in Firestore...');
  const userDocPromises = usersToCreate.map(user => {
    const userDocRef = db.collection('users').doc(user.uid);
    return userDocRef.set({
      uid: user.uid,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true }); // Use merge to avoid overwriting existing user docs completely
  });
  await Promise.all(userDocPromises);
  console.log('User documents created.');

  // 3. Create sub-collection data for patients
  console.log('Creating patient sub-collection data (prescriptions, appointments, lab results, records)...');
  const subCollectionPromises = [];

  // Example lab results and medical records for seeding
  const exampleLabResults = [
    { testName: 'Complete Blood Count (CBC)', date: '2024-07-20', status: 'Normal', reportUrl: '#', trend: 'stable' },
    { testName: 'Lipid Panel', date: '2024-07-20', status: 'Action Required', reportUrl: '#', trend: 'increasing' },
    { testName: 'Thyroid Stimulating Hormone (TSH)', date: '2024-06-15', status: 'Normal', reportUrl: '#', trend: 'stable' },
    { testName: 'Glucose, Plasma', date: '2024-07-20', status: 'Monitor', reportUrl: '#', trend: 'decreasing' },
    { testName: 'Urinalysis', date: '2024-05-10', status: 'Normal', reportUrl: '#', trend: 'stable' },
  ];
  const exampleMedicalRecords = [
    {
      date: '2024-07-15',
      type: "Doctor's Visit",
      title: 'Follow-up with Dr. Eva Core',
      summary: 'Discussed ongoing hypertension management. Blood pressure readings stable. Medication adherence confirmed. Advised continued lifestyle modifications.',
      tags: ['Cardiology', 'Hypertension', 'Check-up']
    },
    {
      date: '2024-06-20',
      type: 'Lab Report',
      title: 'Lipid Panel Results',
      summary: 'Total Cholesterol: 220 mg/dL (High). LDL: 150 mg/dL (High). HDL: 40 mg/dL (Low). Triglycerides: 180 mg/dL (High). Advised dietary changes and follow-up.',
      tags: ['Lab Results', 'Cholesterol']
    },
    {
      date: '2024-05-05',
      type: 'AI Consultation',
      title: 'Symptom Analysis: Persistent Cough',
      summary: 'Patient reported persistent cough and fatigue. AI suggested potential viral infection or allergies. Recommended RICE protocol and monitoring. Advised to see a doctor if symptoms worsen.',
      tags: ['AI Consult', 'Respiratory']
    },
    {
      date: '2023-11-10',
      type: 'Hospital Admission',
      title: 'Asthma Exacerbation',
      summary: 'Admitted for severe asthma attack. Treated with nebulizers and corticosteroids. Discharged after 2 days with updated action plan.',
      tags: ['Emergency', 'Asthma', 'Hospitalization']
    }
  ];

  // Example vitals data for seeding
  const exampleVitals = [
    {
      heartRate: 72,
      temperature: 36.8,
      oxygen: 98,
      bloodPressure: "120/80",
      respiration: 16,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      heartRate: 80,
      temperature: 37.0,
      oxygen: 97,
      bloodPressure: "125/82",
      respiration: 18,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }
  ];

  // Example health missions for seeding
  const exampleMissions = [
    {
      title: "Walk 10,000 steps",
      description: "Achieve 10,000 steps in a day to boost your cardiovascular health.",
      goal: 10000,
      unit: "steps",
      progress: 0,
      status: "active",
      reward: "Bronze Badge",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      title: "Drink 2L of water",
      description: "Stay hydrated by drinking at least 2 liters of water today.",
      goal: 2,
      unit: "liters",
      progress: 0,
      status: "active",
      reward: "Hydration Star",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      title: "Sleep 8 hours",
      description: "Get a full 8 hours of sleep for optimal recovery.",
      goal: 8,
      unit: "hours",
      progress: 0,
      status: "active",
      reward: "Rest Champion",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }
  ];

  for (const patientUid in patientData) {
    if (patientData.hasOwnProperty(patientUid)) {
      // Prescriptions
      patientData[patientUid].prescriptions.forEach((prescription) => {
        const promise = db.collection('users').doc(patientUid).collection('prescriptions').add({
          ...prescription,
          prescribedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        subCollectionPromises.push(promise);
      });
      // Appointments
      patientData[patientUid].appointments.forEach((appointment) => {
        const promise = db.collection('users').doc(patientUid).collection('appointments').add({
          ...appointment,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        subCollectionPromises.push(promise);
      });
      // Lab Results
      exampleLabResults.forEach((labResult, idx) => {
        const promise = db.collection('users').doc(patientUid).collection('lab_results').add({
          ...labResult,
          id: `L${idx+1}`,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        subCollectionPromises.push(promise);
      });
      // Medical Records
      exampleMedicalRecords.forEach((record, idx) => {
        const promise = db.collection('users').doc(patientUid).collection('records').add({
          ...record,
          id: `REC${idx+1}`,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        subCollectionPromises.push(promise);
      });
      // Vitals
      exampleVitals.forEach((vitals) => {
        const promise = db.collection('users').doc(patientUid).collection('vitals').add({
          ...vitals,
          source: "seed-script"
        });
        subCollectionPromises.push(promise);
      });
      // Health Missions
      exampleMissions.forEach((mission) => {
        const promise = db.collection('users').doc(patientUid).collection('missions').add(mission);
        subCollectionPromises.push(promise);
      });
    }
  }

  for (const patientUid in patientData) {
    if (patientData.hasOwnProperty(patientUid)) {
      const data = patientData[patientUid];
      
      // Seed prescriptions
      if (data.prescriptions.length > 0) {
        data.prescriptions.forEach(rx => {
          const promise = db.collection('users').doc(patientUid).collection('prescriptions').add({
            ...rx,
            prescribedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          subCollectionPromises.push(promise);
        });
      }

      // Seed appointments
      if (data.appointments.length > 0) {
        data.appointments.forEach(appt => {
            const promise = db.collection('users').doc(patientUid).collection('appointments').add({
            ...appt,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          subCollectionPromises.push(promise);
        });
      }

      // Seed lab results
      exampleLabResults.forEach((lab, idx) => {
        const promise = db.collection('users').doc(patientUid).collection('lab_results').add({
          ...lab,
          id: `L${idx+1}`,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        subCollectionPromises.push(promise);
      });
      // Seed medical records
      exampleMedicalRecords.forEach((record, idx) => {
        const promise = db.collection('users').doc(patientUid).collection('records').add({
          ...record,
          id: `REC${idx+1}`,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        subCollectionPromises.push(promise);
      });
      // Seed vitals (NEW: ensures dashboard is dynamic)
      const vitalsData = {
        heartRate: 72 + Math.floor(Math.random() * 10),
        temperature: 36.5 + Math.random(),
        oxygen: 97 + Math.floor(Math.random() * 3),
        bloodPressure: "120/80",
        respiration: 16 + Math.floor(Math.random() * 3),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        source: "seed-script"
      };
      const vitalsPromise = db.collection('users').doc(patientUid).collection('vitals').add(vitalsData);
      subCollectionPromises.push(vitalsPromise);
    }
  }

  await Promise.all(subCollectionPromises);
  console.log('Patient sub-collection data created.');

  // 4. Create doctor records in 'doctors' collection
  console.log('Creating doctor records in Firestore...');
  const doctorDocPromises = doctorsToCreate.map(doctor => {
    return db.collection('doctors').doc(doctor.uid).set({
      uid: doctor.uid,
      name: doctor.name,
      specialty: doctor.specialty,
      patients: doctorPatientMap[doctor.uid] || [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  });
  await Promise.all(doctorDocPromises);
  console.log('Doctor records created.');

  // 5. Create patient records and link to doctors
  console.log('Linking patients to doctors...');
  // Ensure every doctor has at least one patient
  const doctorUids = Object.keys(doctorPatientMap);
  let doctorIndex = 0;
  for (const [patientUid, pdata] of Object.entries(patientData)) {
    // Find assigned doctor for this patient
    let assignedDoctorId = null;
    for (const [docId, patientList] of Object.entries(doctorPatientMap)) {
      if (patientList.includes(patientUid)) {
        assignedDoctorId = docId;
        break;
      }
    }
    // If not assigned, round-robin assign to a doctor
    if (!assignedDoctorId) {
      assignedDoctorId = doctorUids[doctorIndex % doctorUids.length];
      doctorIndex++;
      // Also update doctorPatientMap for consistency
      doctorPatientMap[assignedDoctorId] = doctorPatientMap[assignedDoctorId] || [];
      doctorPatientMap[assignedDoctorId].push(patientUid);
    }
    await db.collection('users').doc(patientUid).set({
      uid: patientUid,
      name: usersToCreate.find(u => u.uid === patientUid)?.name || '',
      email: usersToCreate.find(u => u.uid === patientUid)?.email || '',
      role: 'patient',
      assignedDoctorId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  }
  console.log('Patients linked to doctors.');

  // 6. Seed system status
  console.log('Seeding system status...');
  await db.collection('system_status').doc('main').set({
    totalUsers: usersToCreate.length,
    totalDoctors: doctorsToCreate.length,
    totalPatients: usersToCreate.filter(u => u.role === 'patient').length,
    apiLatencyMs: 120,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log('System status seeded.');

  // 7. Seed facilities
  console.log('Seeding facilities...');
  const facilityPromises = facilitiesToCreate.map(facility =>
    db.collection('facilities').doc(facility.id).set({
      ...facility,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true })
  );
  await Promise.all(facilityPromises);
  console.log('Facilities seeded.');

  // 8. Seed resources
  console.log('Seeding resources...');
  const resourcesToCreate = [
    { id: 'DRN-001', type: 'Drone', name: 'MediDrone Alpha', status: 'Available', location: 'Central Hub' },
    { id: 'AMB-003', type: 'Ambulance', name: 'Rescue Unit 3', status: 'En Route', location: 'North Sector', assignedTo: 'INC-078' },
    { id: 'STAFF-DRL', type: 'Medical Staff', name: 'Dr. R. Lee (Paramedic)', status: 'Available', location: 'South Clinic' },
    { id: 'DRN-002', type: 'Drone', name: 'MediDrone Beta', status: 'On Scene', location: 'Downtown Plaza', assignedTo: 'INC-077' },
    { id: 'AMB-001', type: 'Ambulance', name: 'LifeLine One', status: 'Available', location: 'East Depot' },
  ];
  const resourcePromises = resourcesToCreate.map(resource =>
    db.collection('resources').doc(resource.id).set({
      ...resource,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true })
  );
  await Promise.all(resourcePromises);
  console.log('Resources seeded.');

  // 9. Seed incidents
  console.log('Seeding incidents...');
  const incidentsToCreate = [
    { id: 'INC-078', type: 'Medical Emergency', location: '123 Maple St', priority: 'High', status: 'Active' },
    { id: 'INC-077', type: 'Outbreak Response', location: 'Downtown Plaza', priority: 'Medium', status: 'Active' },
    { id: 'INC-079', type: 'Medical Emergency', location: '456 Oak Ave', priority: 'Medium', status: 'Pending' },
  ];
  const incidentPromises = incidentsToCreate.map(incident =>
    db.collection('incidents').doc(incident.id).set({
      ...incident,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true })
  );
  await Promise.all(incidentPromises);
  console.log('Incidents seeded.');

  // 10. Seed AI logs
  console.log('Seeding AI logs...');
  const aiLogsToCreate = [
    { id: 'LOG001', timestamp: '2024-07-28 10:30:15', flowName: 'suggestDiagnosisFlow', userId: 'P001', status: 'Success', durationMs: 1250, inputPayload: {symptoms: 'headache, fever'}, outputPayload: {diagnosis: 'Common Cold'} },
    { id: 'LOG002', timestamp: '2024-07-28 10:25:05', flowName: 'summarizeMedicalHistoryFlow', userId: 'D002', status: 'Success', durationMs: 850, inputPayload: {history: 'Long text...'}, outputPayload: {summary: 'Short text...'} },
    { id: 'LOG003', timestamp: '2024-07-28 10:20:00', flowName: 'imageAnalysisFlow_retinalScan', userId: 'D001', status: 'Failure', durationMs: 3500, inputPayload: {imageDataUri: '...'}, errorMessage: 'Image resolution too low.' },
    { id: 'LOG004', timestamp: '2024-07-28 10:15:45', flowName: 'suggestDiagnosisFlow', userId: 'P005', status: 'Warning', durationMs: 1500, inputPayload: {symptoms: 'fatigue'}, outputPayload: {diagnosis: 'Non-specific symptoms'}, errorMessage: 'Low confidence in diagnosis due to limited input.' },
    { id: 'LOG005', timestamp: '2024-07-28 10:10:12', flowName: 'outbreakPredictionModel_run', userId: 'SYS_ADMIN', status: 'Running', durationMs: 120000, inputPayload: {region: 'All'}},
  ];
  const aiLogPromises = aiLogsToCreate.map(log =>
    db.collection('ai_logs').doc(log.id).set({
      ...log,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true })
  );
  await Promise.all(aiLogPromises);
  console.log('AI logs seeded.');

  // --- Add summary docs for dashboard ---
  // Resource Dispatch Stats
  const available = resourcesToCreate.filter(r => r.status === 'Available').length;
  const enRoute = resourcesToCreate.filter(r => r.status === 'En Route').length;
  const onScene = resourcesToCreate.filter(r => r.status === 'On Scene').length;
  await db.collection('resource_dispatch').doc('stats').set({
    available,
    enRoute,
    onScene,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  console.log('Resource dispatch stats seeded.');

  // AI Logs Stats
  const totalLogs = aiLogsToCreate.length;
  const successLogs = aiLogsToCreate.filter(log => log.status === 'Success').length;
  const successRate = totalLogs > 0 ? Math.round((successLogs / totalLogs) * 100) : 0;
  const lastLogTime = aiLogsToCreate[0]?.timestamp || '';
  await db.collection('ai_logs').doc('stats').set({
    totalLogs,
    successRate,
    lastLogTime,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  console.log('AI logs stats seeded.');

  console.log('\nDatabase seeding completed successfully!');
}

seedDatabase().catch(error => {
  console.error('Error seeding database:', error);
  process.exit(1);
});

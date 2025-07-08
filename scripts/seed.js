// scripts/seed.js
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid'); // To generate unique IDs

// IMPORTANT: Instructions to get this file are in the README.md in this directory.
const serviceAccount = require('./serviceAccountKey.json');

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
  console.log('Creating patient sub-collection data (prescriptions, appointments)...');
  const subCollectionPromises = [];

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
    }
  }

  await Promise.all(subCollectionPromises);
  console.log('Patient sub-collection data created.');
  
  console.log('\nDatabase seeding completed successfully!');
}

seedDatabase().catch(error => {
  console.error('Error seeding database:', error);
  process.exit(1);
});

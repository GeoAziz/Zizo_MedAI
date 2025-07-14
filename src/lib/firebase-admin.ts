// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// This is a server-side only file.
// It uses the service account to get admin privileges to Firestore and Auth.

if (!admin.apps.length) {
  try {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
    } else {
      // Fallback: read from local file
      const keyPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
      serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

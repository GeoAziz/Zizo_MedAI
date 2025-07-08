
// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

// This is a server-side only file. 
// It uses the service account to get admin privileges to Firestore and Auth.

if (!admin.apps.length) {
  try {
    // The service account key is stored in an environment variable for security.
    // In your development environment (like this IDE), you might need to
    // set this environment variable. For production, you'd set it in your hosting provider's settings.
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

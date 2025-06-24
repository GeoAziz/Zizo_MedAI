// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2gkvOcejtfNxgVNp7XlE0HRLdDiaar2Q", // This is public and safe to expose
  authDomain: "bioscan-3d0hd.firebaseapp.com",
  projectId: "bioscan-3d0hd",
  storageBucket: "bioscan-3d0hd.appspot.com",
  messagingSenderId: "76112007916",
  appId: "1:76112007916:web:4677b30b4e30d205484bc9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

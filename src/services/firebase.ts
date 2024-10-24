// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDiLxE0ioJNWuYPDSaV4PNi7NuzYOyaVxU",
  authDomain: "easy-budget-438713.firebaseapp.com",
  projectId: "easy-budget-438713",
  storageBucket: "easy-budget-438713.appspot.com",
  messagingSenderId: "120093131153",
  appId: "1:120093131153:web:1ed50cf803103925f25a30",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiLxE0ioJNWuYPDSaV4PNi7NuzYOyaVxU",
  authDomain: "easy-budget-438713.firebaseapp.com",
  projectId: "easy-budget-438713",
  storageBucket: "easy-budget-438713.appspot.com",
  messagingSenderId: "120093131153",
  appId: "1:120093131153:web:1ed50cf803103925f25a30",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

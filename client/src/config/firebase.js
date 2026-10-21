import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBQYk3Iuwv1-JGxWy94U1Fcr7s8grUId5Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fintracker-8b26a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fintracker-8b26a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fintracker-8b26a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "447967857984",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:447967857984:web:2a40121c7b088cbdd67ea5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YBFBR5BHLC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

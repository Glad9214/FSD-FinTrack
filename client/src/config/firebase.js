import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQYk3Iuwv1-JGxWy94U1Fcr7s8grUId5Q",
  authDomain: "fintracker-8b26a.firebaseapp.com",
  projectId: "fintracker-8b26a",
  storageBucket: "fintracker-8b26a.firebasestorage.app",
  messagingSenderId: "447967857984",
  appId: "1:447967857984:web:2a40121c7b088cbdd67ea5",
  measurementId: "G-YBFBR5BHLC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

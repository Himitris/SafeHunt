import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Vos clés de configuration Firebase
  apiKey: "AIzaSyD30VEB4cFks8TrZ_j3ZumGJVLZ1RftzG8",
  authDomain: "zones-chasse-e8162.firebaseapp.com",
  projectId: "zones-chasse-e8162",
  storageBucket: "zones-chasse-e8162.firebasestorage.app",
  messagingSenderId: "690107355765",
  appId: "1:690107355765:web:34bf196f7514acc9071e3c",
  measurementId: "G-9XNTKC77ZF",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

// lib/firebase/index.ts
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { FirebaseApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFUnZawPtqy-omTStRpTR7sB-paCwdzXU",
  authDomain: "horizon-blogs-memberspace.firebaseapp.com",
  projectId: "horizon-blogs-memberspace",
  storageBucket: "horizon-blogs-memberspace.firebasestorage.app",
  messagingSenderId: "124316497411",
  appId: "1:124316497411:web:94c4403cf23c95a8260036",
  measurementId: "G-20RXBEYN6K"
};
// Initialize safely
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app as firebaseApp, auth as firebaseAuth, db as firebaseDb };

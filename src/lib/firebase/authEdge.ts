// lib/firebase/edge-auth.ts
import { getFirebaseAuth } from "next-firebase-auth-edge";

export const { verifyIdToken } = getFirebaseAuth({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  serviceAccount: {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!,
  },
});

import * as admin from 'firebase-admin';
import { sendPasswordResetEmail } from 'firebase/auth';
import { firebaseAuth } from './config';
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: privateKey!,
      }),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export const adminAuth = admin.apps.length > 0 ? admin.auth() : null;
export const adminDb = admin.apps.length > 0 ? admin.firestore() : null;

export async function verifySessionToken(token: string) {
  if (!adminAuth) throw new Error('Admin SDK not initialized');
  return adminAuth.verifyIdToken(token);
}

export async function setUserRole(uid: string, role: string) {
  if (!adminAuth) throw new Error('Admin SDK not initialized');
  return adminAuth.setCustomUserClaims(uid, { role });
}

export async function createUser(email: string, name: string) {
  if (!adminAuth) throw new Error('Admin SDK not initialized');
  try {
  const user = await adminAuth.createUser({ email, displayName:name});
  const defaultRole = 'member';
  await adminAuth.setCustomUserClaims(user.uid, { role: defaultRole });
  await sendPasswordResetEmail(firebaseAuth , email);
  return user;
  } catch (error) {
    throw error;
  }
}
import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged as _onAuthStateChanged,
  signOut as _signOut,
  updateProfile,
  getAuth
} from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase/config';

export function onAuthStateChanged(callback: (user: User | null) => void) {
  if (!firebaseAuth) return () => {};
  return _onAuthStateChanged(firebaseAuth, callback);
}
const authInstance = getAuth();
export async function signInWithGoogle(): Promise<User> {
  if (!firebaseAuth) throw new Error('Firebase not initialized');

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  const result = await signInWithPopup(firebaseAuth, provider);
  if (!result?.user) throw new Error('Google sign in failed');
  return result.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  
  const result = await signInWithEmailAndPassword(authInstance, email, password);
  console.log("signInWithEmail result:", result);
  return result.user;
}

export async function signUpWithEmail(
  email: string, 
  password: string, 
  displayName?: string
): Promise<User> {
  if (!firebaseAuth) throw new Error('Firebase not initialized');

  const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);

  if (displayName && result.user) {
    await updateProfile(result.user, { displayName });
  }

  return result.user;
}

export async function signOut(): Promise<void> {
  if (!firebaseAuth) throw new Error('Firebase not initialized');
  return _signOut(firebaseAuth);
}

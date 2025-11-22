// src/actions/auth-action.ts
'use server';

import { cookies } from 'next/headers';

const SESSION_COOKIE = 'session_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};

export async function createSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, COOKIE_OPTIONS);
  try {
    // Debug: confirm server action ran and token length (no secrets logged)
    console.log('createSession: set cookie, token length=', token?.length ?? 0);
  } catch (err) {
    // swallow logging errors in edge environment
  }
  return { ok: true };
}

export async function removeSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  try {
    console.log('removeSession: deleted session cookie');
  } catch (err) {}
  return { ok: true };
}

export async function getSession() {
  const cookieStore = await cookies();
  // const verificationToken =adminAuth ? await adminAuth.verifyIdToken(cookieStore.get(SESSION_COOKIE)?.value || '') : null;
  // if (!verificationToken) {
  //   return null;
  // }
  return cookieStore.get(SESSION_COOKIE)?.value || null;
}

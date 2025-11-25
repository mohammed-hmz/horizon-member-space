// src/actions/auth-action.ts
'use server';

import { cookies } from 'next/headers';

const ID_COOKIE = 'id_token';
const REFRESH_COOKIE = 'refresh_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};

export async function createSession(idToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  // Short-lived ID token cookie
  cookieStore.set(ID_COOKIE, idToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60, // 1 hour (ID token lifetime)
  });

  // Long-lived refresh token cookie
  cookieStore.set(REFRESH_COOKIE, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function removeSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ID_COOKIE);
    cookieStore.delete(REFRESH_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  // const verificationToken =adminAuth ? await adminAuth.verifyIdToken(cookieStore.get(SESSION_COOKIE)?.value || '') : null;
  // if (!verificationToken) {
  //   return null;
  // }
  return cookieStore.get(ID_COOKIE)?.value || null;
}

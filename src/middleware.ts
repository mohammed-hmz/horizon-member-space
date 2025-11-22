import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, importX509 } from 'jose';

const GOOGLE_X509_URL =
  'https://www.googleapis.com/service_accounts/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID; // Replace with actual project ID
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let publicKeys : any = null;
// eslint-enable-next-line @typescript-eslint/no-explicit-any
async function getPublicKeys() {
  if (publicKeys) return publicKeys;
  const res = await fetch(GOOGLE_X509_URL);
  publicKeys = await res.json();
  return publicKeys;
}

async function verifyFirebaseJwt(firebaseJwt: string) {
  const publicKeys = await getPublicKeys();

  const {  payload} = await jwtVerify(firebaseJwt, async (header) => {
    const x509Cert = publicKeys[header.kid!];
    if (!x509Cert) throw new Error('Unknown key ID');
    return importX509(x509Cert, 'RS256');
  }, {
    issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
    audience: FIREBASE_PROJECT_ID,
    algorithms: ['RS256'],
  });
  // Now you have verifiedToken.payload
  return payload;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (['/signin', '/signup'].includes(pathname)) {
    return NextResponse.next();
  }

  // Option 1: JWT via Authorization header — for API endpoints
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.substring('bearer '.length);
    try {
      // Checks JWT validity
      await verifyFirebaseJwt(token);
    } catch (err) {
        console.error('JWT verification error:', err);
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    return NextResponse.next();
  }
  
  // Option 2: Session cookie for browser sessions
  const session = request.cookies.get('session_token')?.value;
  if (!session) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  try {
    await verifyFirebaseJwt(session);
  } catch (err) {
      console.error('JWT verification error:', err);
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If token/cookie is valid:
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|signin|signup).*)'],
};

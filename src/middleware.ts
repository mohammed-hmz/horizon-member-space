// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/authEdge";

const PUBLIC_ROUTES = ["/signin","/reset-password"];
const ROLE_PROTECTED_ROUTES: Record<string, string[]> = {
  admin: ["/admin"],
  user: ["/dashboard"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;


  // 2. Get your custom session cookie
  const token = req.cookies.get("session_token")?.value;
  // 1. Public routes -> always allowed
  if (PUBLIC_ROUTES.includes(pathname) && !token) {
    return NextResponse.next();
  }

  // Not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    // 3. Verify session cookie using next-firebase-auth-edge
    const decoded = await verifyIdToken(token);

    // 4. Role-based rules
    const userRole = decoded.role;
 if (PUBLIC_ROUTES.includes(pathname)&&userRole) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Check each role
    for (const role in ROLE_PROTECTED_ROUTES) {
      const protectedPaths = ROLE_PROTECTED_ROUTES[role];

      for (const protectedPath of protectedPaths) {
        if (pathname.startsWith(protectedPath)) {
          if (userRole !== role) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
          }
        }
      }
    }

    // 5. Authenticated user should NOT access login/register pages
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Invalid cookie token:", err);
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|public|api/public).*)",
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};

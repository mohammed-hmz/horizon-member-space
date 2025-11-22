import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase/authEdge";

const PUBLIC_ROUTES = ["/signin", "/reset-password"];

const ROLE_PROTECTED_ROUTES: Record<string, string[]> = {
  admin: ["/admin"],
  user: ["/dashboard"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("session_token")?.value;

  // 🚨 If user is logged in but tries to access /signin → redirect to home
  if (token && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🚨 Public route and NOT logged in → allow it
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // 🚨 Protected route but no token → redirect to signin
  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    // 🔐 Verify Firebase token
    const decoded = await verifyIdToken(token);
    const userRole = decoded.role;

    // 🎯 Role-based protection
    for (const role in ROLE_PROTECTED_ROUTES) {
      for (const protectedPath of ROLE_PROTECTED_ROUTES[role]) {
        if (pathname.startsWith(protectedPath)) {
          if (userRole !== role) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
          }
        }
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Invalid Firebase cookie:", err);
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

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAndRefreshExpiredIdToken } from "@/lib/firebase/authEdge";

const PUBLIC_PATHS = ["/signin", "/unauthorized", "/reset-password"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow public routes
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  // 2. Get tokens from cookies
  const idToken = req.cookies.get("id_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!idToken || !refreshToken) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    // 3. Verify the ID token and refresh if expired
    const result = await verifyAndRefreshExpiredIdToken(
      { idToken, refreshToken, metadata: {} }
    );

    const res = NextResponse.next();

    // 4. Update cookies if new tokens returned
    if (result.idToken) {
      res.cookies.set("id_token", result.idToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    if (result.refreshToken) {
      res.cookies.set("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    // 5. Set headers with user info for role-based logic


    return res;
  } catch (err) {
    console.error("Auth error:", err);
    const res = NextResponse.redirect(new URL("/signin", req.url));
    res.cookies.delete("id_token");
    res.cookies.delete("refresh_token");
    return res;
  }
}

export const config = {
  matcher: [
    // Match all routes except _next, api, and static files
    "/((?!_next|.*\\..*|api).*)",
  ],
};

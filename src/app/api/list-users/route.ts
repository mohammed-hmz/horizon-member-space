import { adminAuth } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const idToken = authHeader.replace("Bearer ", "");
  let decoded;
  try {
    decoded = await adminAuth?.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  // Only admins can fetch users
  if (decoded?.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const list = await adminAuth?.listUsers(1000);

  // Map users and include role from custom claims
  const users = list?.users.map(u => ({
    uid: u.uid,
    email: u.email,
    displayName: u.displayName || u.email?.split("@")[0] || "User",
    role: (u.customClaims?.role as string) || "member", // default role
    createdAt: u.metadata.creationTime
  }));

  return NextResponse.json({ users });
}

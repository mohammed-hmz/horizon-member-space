import { adminAuth} from "@/lib/firebase/admin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const idToken = authHeader.replace("Bearer ", "");
console.log("ID Token:", idToken);
  let decoded;
  try {
    decoded = await adminAuth?.verifyIdToken(idToken);
    console.log("Decoded Token:", decoded);
  } catch {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

//   if (decoded?.role !== "admin") {
//     return NextResponse.json({ error: "forbidden" }, { status: 403 });
//   }

  // admin allowed
  const users = await adminAuth?.listUsers(1000);
  return NextResponse.json({ users: users?.users || [] });
}

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await adminAuth.getUserByEmail(email.trim().toLowerCase());

    // Get role from Firestore
    const snap = await adminDb.collection("users").doc(user.uid).get();
    const role = snap.exists ? (snap.data()?.role ?? "user") : "user";

    const token = await adminAuth.createCustomToken(user.uid, { role });
    return NextResponse.json({ token });
  } catch (err: any) {
    console.error("custom-token error:", err.message);
    return NextResponse.json({ error: "Failed to create token" }, { status: 500 });
  }
}
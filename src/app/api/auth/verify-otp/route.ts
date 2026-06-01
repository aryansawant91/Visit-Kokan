import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, purpose } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
    }

    const now = new Date().toISOString();

    // Find matching unused OTP
    const snap = await adminDb
      .collection("otps")
      .where("email",   "==", email.trim().toLowerCase())
      .where("otp",     "==", otp.trim())
      .where("purpose", "==", purpose)
      .where("used",    "==", false)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 });
    }

    const record = snap.docs[0].data();

    // Check expiry
    if (record.expiresAt < now) {
      return NextResponse.json({ error: "OTP has expired. Request a new one." }, { status: 400 });
    }

    // Mark as used
    await adminDb.collection("otps").doc(snap.docs[0].id).update({ used: true });

    // Mark email as verified in users collection
    const userSnap = await adminDb
      .collection("users")
      .where("email", "==", email.trim().toLowerCase())
      .limit(1)
      .get();

    if (!userSnap.empty) {
      await adminDb
        .collection("users")
        .doc(userSnap.docs[0].id)
        .update({ emailVerified: true, updatedAt: now });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("verify-otp error:", err.message);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
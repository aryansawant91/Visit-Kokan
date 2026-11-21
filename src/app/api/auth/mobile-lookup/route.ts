import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json();

    const cleanMobile = typeof mobile === "string" ? mobile.trim().replace(/[^0-9+]/g, "") : "";
    if (!cleanMobile || cleanMobile.length < 10) {
      return NextResponse.json({ error: "Valid 10-digit mobile number required" }, { status: 400 });
    }

    const snap = await adminDb
      .collection("users")
      .where("phone", "==", cleanMobile)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ error: "No account found with this mobile number." }, { status: 404 });
    }

    const user = snap.docs[0].data();
    return NextResponse.json({ email: user.email });
  } catch (err: any) {
    console.error("mobile-lookup error:", err.message);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}

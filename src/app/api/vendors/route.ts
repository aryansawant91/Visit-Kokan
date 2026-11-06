import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snap = await adminDb.collection("users").where("role", "==", "vendor").get();
    const vendors = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        ...data,
      };
    }).sort((a: any, b: any) => {
      const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
      const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return NextResponse.json(vendors);
  } catch (err: any) {
    console.error("Vendors GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { uid, status } = await req.json();
    if (!uid || !status) {
      return NextResponse.json({ error: "uid and status are required" }, { status: 400 });
    }

    await adminDb.collection("users").doc(uid).update({
      vendorStatus: status,
      updatedAt: new Date().toISOString(),
    });

    if (status === "approved") {
      try {
        await adminAuth.setCustomUserClaims(uid, { role: "vendor", vendorStatus: "approved" });
      } catch (authErr) {
        console.warn("Failed to set custom claim on user:", authErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Vendors PATCH error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";
export async function GET() {
  try {
    const snap = await db
      .collection("products")
      .orderBy("createdAt", "desc")
      .get();
    const products = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, action } = await req.json();
    const approved = action === "approve";
    const status = approved ? "approved" : "rejected";

    await db.collection("products").doc(id).update({
      approved,
      status,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
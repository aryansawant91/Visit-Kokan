import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snap = await db
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get();
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(orders);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 ADMIN ORDERS ERROR:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    await db.collection("orders").doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 ADMIN ORDERS PATCH ERROR:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
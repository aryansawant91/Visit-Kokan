import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";
import { isAuthorizedAdmin } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

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
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, orderIds, status, batchName, batchId, trekDate, whatsappGroupLink } = body;
    
    const targetIds: string[] = Array.isArray(orderIds) && orderIds.length > 0 
      ? orderIds 
      : id ? [id] : [];

    if (targetIds.length === 0) {
      return NextResponse.json({ error: "Missing order id or orderIds" }, { status: 400 });
    }

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
    if (status !== undefined) updates.status = status;
    if (batchName !== undefined) updates.batchName = batchName;
    if (batchId !== undefined) updates.batchId = batchId;
    if (trekDate !== undefined) updates.trekDate = trekDate;
    if (whatsappGroupLink !== undefined) updates.whatsappGroupLink = whatsappGroupLink;

    const batch = db.batch();
    for (const orderId of targetIds) {
      batch.update(db.collection("orders").doc(orderId), updates);
    }
    await batch.commit();

    return NextResponse.json({ success: true, updatedCount: targetIds.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 ADMIN ORDERS PATCH ERROR:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await db.collection("orders").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

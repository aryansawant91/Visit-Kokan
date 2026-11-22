import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";
import { isAuthorizedAdmin } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    let snap;
    try {
      snap = await db
        .collection("orders")
        .orderBy("createdAt", "desc")
        .get();
    } catch {
      snap = await db.collection("orders").get();
    }

    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Memory sort ensures fast, index-free reliability across all date formats
    orders.sort((a: any, b: any) => {
      const tA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const tB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return tB - tA;
    });

    // Automatically enrich any orders missing a phone number by looking up the registered user document
    const missingUserIds: string[] = Array.from(
      new Set(
        orders
          .filter((o: any) => !o.userPhone && !o.phone && typeof o.userId === "string" && o.userId.trim() !== "")
          .map((o: any) => String(o.userId))
      )
    );

    if (missingUserIds.length > 0) {
      const userPhoneMap: Record<string, string> = {};
      await Promise.all(
        missingUserIds.map(async (uid: string) => {
          try {
            const uDoc = await db.collection("users").doc(uid).get();
            if (uDoc.exists) {
              const uData = uDoc.data();
              const p = uData?.phone || uData?.phoneNumber || uData?.mobile || "";
              if (p) userPhoneMap[uid] = String(p);
            }
          } catch {}
        })
      );

      orders.forEach((o: any) => {
        if (!o.userPhone && !o.phone && o.userId && userPhoneMap[String(o.userId)]) {
          o.userPhone = userPhoneMap[String(o.userId)];
          o.phone = userPhoneMap[String(o.userId)];
        }
      });
    }

    return NextResponse.json(orders, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
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
    const {
      id,
      orderIds,
      ordersUpdates,
      status,
      batchName,
      batchId,
      batchStatus,
      trekDate,
      whatsappGroupLink,
      discount,
      advancePaid,
      remainingCash,
      totalAmount,
      cashCollected,
      boarded,
      boardedAt,
      userPhone,
    } = body;

    // Support individual/bulk updates per order
    if (Array.isArray(ordersUpdates) && ordersUpdates.length > 0) {
      const batch = db.batch();
      let count = 0;
      for (const item of ordersUpdates) {
        if (!item || !item.id) continue;
        const { id: itemId, ...itemFields } = item;
        const itemUpdates: Record<string, any> = {
          updatedAt: new Date().toISOString(),
        };
        if (itemFields.status !== undefined) itemUpdates.status = itemFields.status;
        if (itemFields.batchName !== undefined) itemUpdates.batchName = itemFields.batchName;
        if (itemFields.batchId !== undefined) itemUpdates.batchId = itemFields.batchId;
        if (itemFields.batchStatus !== undefined) itemUpdates.batchStatus = String(itemFields.batchStatus).trim();
        if (itemFields.trekDate !== undefined) itemUpdates.trekDate = itemFields.trekDate;
        if (itemFields.whatsappGroupLink !== undefined) itemUpdates.whatsappGroupLink = itemFields.whatsappGroupLink;
        if (itemFields.discount !== undefined) itemUpdates.discount = Number(itemFields.discount);
        if (itemFields.advancePaid !== undefined) itemUpdates.advancePaid = Number(itemFields.advancePaid);
        if (itemFields.remainingCash !== undefined) itemUpdates.remainingCash = Number(itemFields.remainingCash);
        if (itemFields.totalAmount !== undefined) itemUpdates.totalAmount = Number(itemFields.totalAmount);
        if (itemFields.cashCollected !== undefined) itemUpdates.cashCollected = Boolean(itemFields.cashCollected);
        if (itemFields.boarded !== undefined) itemUpdates.boarded = Boolean(itemFields.boarded);
        if (itemFields.boardedAt !== undefined) itemUpdates.boardedAt = itemFields.boardedAt;
        if (itemFields.userPhone !== undefined) itemUpdates.userPhone = String(itemFields.userPhone).trim();

        batch.update(db.collection("orders").doc(itemId), itemUpdates);
        count++;
      }
      await batch.commit();
      return NextResponse.json({ success: true, updatedCount: count });
    }
    
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
    if (batchStatus !== undefined) updates.batchStatus = String(batchStatus).trim();
    if (trekDate !== undefined) updates.trekDate = trekDate;
    if (whatsappGroupLink !== undefined) updates.whatsappGroupLink = whatsappGroupLink;
    if (discount !== undefined) updates.discount = Number(discount);
    if (advancePaid !== undefined) updates.advancePaid = Number(advancePaid);
    if (remainingCash !== undefined) updates.remainingCash = Number(remainingCash);
    if (totalAmount !== undefined) updates.totalAmount = Number(totalAmount);
    if (cashCollected !== undefined) updates.cashCollected = Boolean(cashCollected);
    if (boarded !== undefined) updates.boarded = Boolean(boarded);
    if (boardedAt !== undefined) updates.boardedAt = boardedAt;
    if (userPhone !== undefined) updates.userPhone = String(userPhone).trim();

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
    const body = await req.json();
    const { id, ids } = body;
    const targetIds: string[] = Array.isArray(ids) && ids.length > 0 ? ids : id ? [id] : [];

    if (targetIds.length === 0) {
      return NextResponse.json({ error: "Missing id or ids" }, { status: 400 });
    }

    const batch = db.batch();
    for (const orderId of targetIds) {
      batch.delete(db.collection("orders").doc(orderId));
    }
    await batch.commit();

    return NextResponse.json({ success: true, deletedCount: targetIds.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";
import { isAuthorizedAdmin, getSession, isValidUid } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  const userId    = req.nextUrl.searchParams.get("userId");
  const orderId   = req.nextUrl.searchParams.get("id");
  const orderType = req.nextUrl.searchParams.get("orderType");

  const session = getSession(req);

  try {
    if (orderId) {
      const snap = await db.collection("orders").doc(orderId).get();
      if (!snap.exists) return NextResponse.json(null, { status: 404 });
      const data = snap.data();
      // If user is logged in, ensure non-admins can only read their own orders
      if (session?.uid && session.role !== "admin" && data?.userId && data.userId !== session.uid) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.json({ id: snap.id, ...data });
    }

    if (userId) {
      if (!isValidUid(userId)) return NextResponse.json([], { status: 400 });
      // Non-admins can only query their own orders
      if (session?.uid && session.role !== "admin" && session.uid !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const snap = await db
        .collection("orders")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();
      const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return NextResponse.json(orders);
    }

    if (orderType) {
      // Admin-only query for finance and management dashboards
      if (!isAuthorizedAdmin(req)) {
        return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
      }

      const snap = await db
        .collection("orders")
        .where("orderType", "==", orderType)
        .get();
      const orders = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return NextResponse.json(orders);
    }

    return NextResponse.json({ error: "Missing userId, id, or orderType" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await db.collection("orders").doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

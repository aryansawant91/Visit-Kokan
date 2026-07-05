import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId, userEmail, userName,
      items, deliveryAddress, amount, giftTotal,
    } = body;

    const now = new Date().toISOString();

    const orderRef = await adminDb.collection("orders").add({
      userId, userEmail, userName,
      items,
      deliveryAddress,
      orderType: "product",
      paymentMethod: "cod",
      paymentStatus: "pending", // collected at delivery
      status: "confirmed",       // order is confirmed, payment pending
      amount,
      giftTotal: giftTotal ?? 0,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ success: true, orderId: orderRef.id });
  } catch (err: any) {
    console.error("create-cod-order error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
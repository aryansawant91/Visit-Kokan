import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderType, userId, userEmail, userName,
      trekId, trekName, trekSlug, whatsappGroupLink,
      couponCode, couponDiscount, totalAmount, persons,
    } = body;

    const cleanData = (obj: any) =>
      Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null));

    const now = new Date().toISOString();

    const orderData: any = {
      orderType,
      userId, userEmail, userName,
      totalAmount,
      status: "pending_verification",
      paymentVerified: false,
      paymentType: "offline",
      advancePaid: 0,
      remainingCash: totalAmount,
      cashCollected: false,
      offlineVerified: false,
      createdAt: now,
      updatedAt: now,
    };

    if (orderType === "trek") {
      orderData.trekId = trekId;
      orderData.trekName = trekName;
      orderData.trekSlug = trekSlug;
      orderData.whatsappGroupLink = whatsappGroupLink ?? null;
      orderData.persons = persons;
      orderData.couponCode = couponCode ?? null;
      orderData.couponDiscount = couponDiscount ?? 0;
    }

    const ref = await db.collection("orders").add(cleanData(orderData));
    return NextResponse.json({ success: true, orderId: ref.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Create offline order error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
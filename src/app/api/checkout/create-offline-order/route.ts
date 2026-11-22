import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderType, userId, userEmail, userName, userPhone, phone, pickupLocation,
      trekId, trekName, trekDate, trekSlug, whatsappGroupLink,
      couponCode, couponDiscount, totalAmount, persons,
    } = body;

    const numAmount = Number(totalAmount);
    if (!numAmount || isNaN(numAmount) || numAmount < 1) {
      return NextResponse.json({ error: "Invalid order amount" }, { status: 400 });
    }

    if (orderType === "trek" && trekId) {
      const trekDoc = await db.collection("treks").doc(trekId).get();
      if (trekDoc.exists) {
        const trekData = trekDoc.data();
        const basePrice = Number(trekData?.price || 0);
        const personCount = Array.isArray(persons) ? persons.length : 1;
        const minAllowable = Math.max(50, Math.floor(basePrice * personCount * 0.4));
        if (numAmount < minAllowable) {
          return NextResponse.json({ error: "Amount tampering detected" }, { status: 400 });
        }
      }
    }

    const cleanData = (obj: any) =>
      Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null));

    const now = new Date().toISOString();

    const resolvedPhone = userPhone || phone || null;

    const orderData: any = {
      orderType,
      userId: userId || null,
      userEmail: userEmail || null,
      userName: userName || null,
      userPhone: resolvedPhone,
      phone: resolvedPhone,
      contactPhone: resolvedPhone,
      pickupLocation: pickupLocation || null,
      totalAmount: numAmount,
      status: "pending_verification",
      paymentVerified: false,
      paymentType: "offline",
      advancePaid: 0,
      remainingCash: numAmount,
      cashCollected: false,
      offlineVerified: false,
      createdAt: now,
      updatedAt: now,
    };

    if (orderType === "trek") {
      orderData.trekId = trekId;
      orderData.trekName = trekName;
      orderData.trekDate = trekDate || null;
      orderData.trekSlug = trekSlug;
      if (whatsappGroupLink && typeof whatsappGroupLink === "string" && whatsappGroupLink.startsWith("https://chat.whatsapp.com/")) {
        orderData.whatsappGroupLink = whatsappGroupLink;
      }
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

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { adminDb as db } from "@/lib/firebaseAdmin";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, orderType, userId, userEmail, userName, items, deliveryAddress, trekId, trekName, trekDate, persons, trekSlug } = body;

    // Strip undefined values from Firestore document
    const cleanData = (obj: any): any => {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null)
        );
    };

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const now = new Date().toISOString();

    // Save pending order to Firestore
    const orderData: any = {
      orderType,
      userId,
      userEmail,
      userName,
      totalAmount: amount,
      status: "pending",
      razorpayOrderId: razorpayOrder.id,
      paymentVerified: false,
      createdAt: now,
      updatedAt: now,
    };

    if (orderType === "product") {
      orderData.items = items;
      orderData.deliveryAddress = deliveryAddress;
    } else if (orderType === "trek") {
      orderData.trekId = trekId;
      orderData.trekName = trekName;
      orderData.trekDate = trekDate;
      orderData.persons = persons;
      orderData.trekSlug = trekSlug;
    }

    const ref = await db.collection("orders").add(cleanData(orderData));

    return NextResponse.json({
      orderId: ref.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Create order error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
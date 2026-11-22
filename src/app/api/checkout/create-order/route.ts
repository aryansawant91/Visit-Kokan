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
    const {
      amount,
      orderType,
      userId,
      userEmail,
      userName,
      userPhone,
      phone,
      pickupLocation,
      paymentType,
      advancePaid,
      remainingCash,
      couponCode,
      couponDiscount,
      items,
      deliveryAddress,
      trekId,
      trekName,
      trekDate,
      persons,
      trekSlug,
      whatsappGroupLink,
    } = body;

    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount) || numAmount < 1) {
      return NextResponse.json({ error: "Invalid order amount" }, { status: 400 });
    }

    // Basic price validation: prevent ₹1 or zero amount tampering
    if (orderType === "trek") {
      if (!trekId) {
        return NextResponse.json({ error: "Missing trekId" }, { status: 400 });
      }
      const trekDoc = await db.collection("treks").doc(trekId).get();
      if (trekDoc.exists) {
        const trekData = trekDoc.data();
        const basePrice = Number(trekData?.price || 0);
        const personCount = Array.isArray(persons) ? persons.length : 1;
        // Even with max coupons, total amount cannot be less than 40% of standard base price
        const minAllowable = Math.max(50, Math.floor(basePrice * personCount * 0.4));
        if (numAmount < minAllowable) {
          return NextResponse.json({ error: "Amount tampering detected" }, { status: 400 });
        }
      }
    }

    // Strip undefined values from Firestore document
    const cleanData = (obj: any): any => {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null)
      );
    };

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(numAmount * 100), // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const now = new Date().toISOString();

    const resolvedPhone = userPhone || phone || deliveryAddress?.phone || null;

    // Save pending order to Firestore
    const orderData: any = {
      orderType,
      userId: userId || null,
      userEmail: userEmail || null,
      userName: userName || null,
      userPhone: resolvedPhone,
      phone: resolvedPhone,
      contactPhone: resolvedPhone,
      pickupLocation: pickupLocation || null,
      paymentType: paymentType || "full",
      advancePaid: advancePaid !== undefined ? Number(advancePaid) : numAmount,
      remainingCash: remainingCash !== undefined ? Number(remainingCash) : 0,
      couponCode: couponCode || null,
      couponDiscount: couponDiscount ? Number(couponDiscount) : 0,
      totalAmount: numAmount,
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
      // Sanitize whatsappGroupLink to avoid phishing links
      if (whatsappGroupLink && typeof whatsappGroupLink === "string" && whatsappGroupLink.startsWith("https://chat.whatsapp.com/")) {
        orderData.whatsappGroupLink = whatsappGroupLink;
      }
    }

    const docRef = await db.collection("orders").add(cleanData(orderData));

    return NextResponse.json({
      orderId: docRef.id,
      razorpayOrderId: razorpayOrder.id,
      amount: numAmount,
      currency: "INR",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Create order error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

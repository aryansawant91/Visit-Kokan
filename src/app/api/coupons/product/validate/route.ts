import { NextRequest, NextResponse } from "next/server";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const { code, amount } = await req.json();
    if (!code) return NextResponse.json({ valid: false, error: "No code provided" });

    const q = query(
      collection(db, "productCoupons"),
      where("code", "==", code.trim().toUpperCase()),
      where("isActive", "==", true),
    );
    const snap = await getDocs(q);
    if (snap.empty) return NextResponse.json({ valid: false, error: "Invalid coupon code" });

    const data = snap.docs[0].data();

    if (data.expiresAt) {
      const expiry = (data.expiresAt as Timestamp).toDate();
      if (expiry < new Date()) {
        return NextResponse.json({ valid: false, error: "Coupon has expired" });
      }
    }
    if (data.usageLimit !== null && data.usedCount >= data.usageLimit) {
      return NextResponse.json({ valid: false, error: "Coupon usage limit reached" });
    }
    if (data.minAmount > 0 && amount < data.minAmount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order of ₹${data.minAmount} required`,
      });
    }

    return NextResponse.json({
      valid: true,
      code: data.code,
      discount: data.discount,
      discountType: data.discountType ?? "flat",
      description: data.description,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Server error" });
  }
}
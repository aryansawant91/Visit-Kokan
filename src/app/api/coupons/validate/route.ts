import { NextRequest, NextResponse } from "next/server";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const { code, amount, type = "trek" } = await req.json();
    if (!code) return NextResponse.json({ valid: false, error: "No code provided" });

    const q = query(
      collection(db, "coupons"),
      where("code", "==", code.trim().toUpperCase()),
      where("isActive", "==", true),
    );
    const snap = await getDocs(q);
    if (snap.empty) return NextResponse.json({ valid: false, error: "Invalid coupon code" });

    const data = snap.docs[0].data();

    // Type check
    if (data.type !== "all" && data.type !== type) {
      return NextResponse.json({ valid: false, error: "Coupon not valid for this booking type" });
    }
    // Expiry check
    if (data.expiresAt) {
      const expiry = (data.expiresAt as Timestamp).toDate();
      if (expiry < new Date()) {
        return NextResponse.json({ valid: false, error: "Coupon has expired" });
      }
    }
    // Usage limit check
    if (data.usageLimit !== null && data.usedCount >= data.usageLimit) {
      return NextResponse.json({ valid: false, error: "Coupon usage limit reached" });
    }
    // Min amount check
    if (data.minAmount > 0 && amount < data.minAmount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum booking of ₹${data.minAmount} required`,
      });
    }

    return NextResponse.json({
      valid: true,
      discount: data.discount,
      description: data.description,
      code: data.code,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Server error" });
  }
}
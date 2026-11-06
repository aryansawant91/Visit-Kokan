import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

const trekCoupons = [
  {
    code: "TREK100",
    discount: 100,
    discountType: "flat",
    description: "Flat ₹100 Off on Sahyadri & Konkan Trek Expeditions",
    label: "₹100 Off",
    type: "trek",
    isActive: true,
    showOnWidget: true,
    minAmount: 0,
    usedCount: 0,
    usageLimit: null,
    createdAt: new Date().toISOString(),
  },
  {
    code: "TREK200",
    discount: 200,
    discountType: "flat",
    description: "₹200 Off for Group Bookings (Min. ₹2,500)",
    label: "₹200 Off",
    type: "trek",
    isActive: true,
    showOnWidget: true,
    minAmount: 2500,
    usedCount: 0,
    usageLimit: null,
    createdAt: new Date().toISOString(),
  },
  {
    code: "WELCOME50",
    discount: 50,
    discountType: "flat",
    description: "Flat ₹50 Off for First-time Kokan Explorers",
    label: "₹50 Off",
    type: "all",
    isActive: true,
    showOnWidget: true,
    minAmount: 0,
    usedCount: 0,
    usageLimit: null,
    createdAt: new Date().toISOString(),
  },
];

const productCoupons = [
  {
    code: "KOKAN10",
    discount: 10,
    discountType: "percent",
    description: "10% Off on Authentic Local Spices & Groceries",
    label: "10% Off",
    isActive: true,
    showOnWidget: true,
    minAmount: 299,
    usedCount: 0,
    usageLimit: null,
    createdAt: new Date().toISOString(),
  },
  {
    code: "MASALA50",
    discount: 50,
    discountType: "flat",
    description: "Flat ₹50 Off on orders above ₹499",
    label: "₹50 Off",
    isActive: true,
    showOnWidget: true,
    minAmount: 499,
    usedCount: 0,
    usageLimit: null,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const results: string[] = [];

    for (const c of trekCoupons) {
      const snap = await adminDb.collection("coupons").where("code", "==", c.code).get();
      if (!snap.empty) {
        await adminDb.collection("coupons").doc(snap.docs[0].id).set(c, { merge: true });
        results.push(`Updated ${c.code}`);
      } else {
        await adminDb.collection("coupons").add(c);
        results.push(`Created ${c.code}`);
      }
    }

    for (const c of productCoupons) {
      const snap = await adminDb.collection("productCoupons").where("code", "==", c.code).get();
      if (!snap.empty) {
        await adminDb.collection("productCoupons").doc(snap.docs[0].id).set(c, { merge: true });
        results.push(`Updated ${c.code}`);
      } else {
        await adminDb.collection("productCoupons").add(c);
        results.push(`Created ${c.code}`);
      }
    }

    return NextResponse.json({ success: true, seeded: results });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

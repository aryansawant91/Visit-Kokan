import { NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const q = query(
      collection(db, "productCoupons"),
      where("isActive", "==", true),
    );
    const snap = await getDocs(q);
    const now  = Date.now();

    const all = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((c: any) => {
        if (c.expiresAt?.toDate && c.expiresAt.toDate().getTime() < now) return false;
        if (c.usageLimit !== null && c.usedCount >= c.usageLimit) return false;
        return true;
      });

    const visible = all.filter((c: any) => c.showOnWidget).slice(0, 2);

    return NextResponse.json({
      visible: visible.map((c: any) => ({
        code:        c.code,
        discount:    c.discount,
        discountType: c.discountType ?? "flat",
        description: c.description,
        minAmount:   c.minAmount ?? 0,
        label:       c.label ?? `₹${c.discount} Off`,
      })),
    });
  } catch {
    return NextResponse.json({ visible: [] });
  }
}
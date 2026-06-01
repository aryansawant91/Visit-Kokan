import { NextResponse } from "next/server";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const q = query(
      collection(db, "coupons"),
      where("isActive", "==", true),
      where("type", "in", ["trek", "all"]),
    );
    const snap = await getDocs(q);
    const now = Date.now();

    const all = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((c: any) => {
        // Filter expired
        if (c.expiresAt?.toDate) {
          if (c.expiresAt.toDate().getTime() < now) return false;
        }
        // Filter exhausted
        if (c.usageLimit !== null && c.usedCount >= c.usageLimit) return false;
        return true;
      });

    const visible = all.filter((c: any) => c.showOnWidget).slice(0, 2);

    return NextResponse.json({
      // Only 2 displayed — admin-curated
      visible: visible.map((c: any) => ({
        code: c.code,
        discount: c.discount,
        description: c.description,
        minAmount: c.minAmount ?? 0,
        label: c.label ?? `₹${c.discount} Off`,
      })),
      // All active codes (for server-side validation on apply)
      // Don't expose to client — used only in validate endpoint
    });
  } catch {
    return NextResponse.json({ visible: [] });
  }
}
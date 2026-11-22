import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";
import { isAuthorizedAdmin } from "@/lib/apiAuth";

export interface UniqueTrekker {
  id: string;
  name: string;
  phone: string;
  email: string;
  userId: string;
  totalTreksCount: number;
  totalTrekkersBooked: number;
  totalSpent: number;
  treks: string[];
  lastTrekName: string;
  lastTrekDate: string;
  lastOrderCreatedAt: string;
  daysSinceLastTrek: number;
  pickupLocations: string[];
  segment: "vip" | "active" | "lapsed" | "cold" | "new";
  latestOrderId: string;
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    // 1. Fetch all trek orders
    let snap;
    try {
      snap = await db
        .collection("orders")
        .where("orderType", "==", "trek")
        .get();
    } catch {
      snap = await db.collection("orders").get();
    }

    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
    const trekOrders = docs.filter(
      (o: any) => (o.orderType === "trek" || (!o.orderType && o.trekName)) && o.status !== "cancelled"
    );

    // 2. Identify missing user phones to enrich from users collection
    const missingUserIds: string[] = Array.from(
      new Set(
        trekOrders
          .filter((o: any) => !o.userPhone && !o.phone && typeof o.userId === "string" && o.userId.trim() !== "")
          .map((o: any) => String(o.userId))
      )
    );

    const userPhoneMap: Record<string, string> = {};
    if (missingUserIds.length > 0) {
      await Promise.all(
        missingUserIds.map(async (uid: string) => {
          try {
            const uDoc = await db.collection("users").doc(uid).get();
            if (uDoc.exists) {
              const uData = uDoc.data();
              const p = uData?.phone || uData?.phoneNumber || uData?.mobile || "";
              if (p) userPhoneMap[uid] = String(p);
            }
          } catch {}
        })
      );
    }

    // 3. Deduplicate and group by unique user identity (phone is preferred, then email, then userId)
    const trekkerMap: Record<string, UniqueTrekker> = {};
    const nowMs = Date.now();

    for (const o of trekOrders) {
      const resolvedPhone = String(
        o.userPhone ||
        o.phone ||
        o.contactPhone ||
        o.deliveryAddress?.phone ||
        (o.userId && userPhoneMap[o.userId]) ||
        ""
      ).trim();

      const resolvedEmail = String(o.userEmail || "").trim();
      const resolvedUserId = String(o.userId || "").trim();
      const resolvedName = String(o.userName || "Traveler").trim();

      // Normalize 10-digit phone if possible
      const cleanPhoneDigits = resolvedPhone.replace(/\D/g, "");
      const normalizedPhone =
        cleanPhoneDigits.length === 10
          ? cleanPhoneDigits
          : cleanPhoneDigits.length === 12 && cleanPhoneDigits.startsWith("91")
          ? cleanPhoneDigits.slice(2)
          : resolvedPhone;

      // Group key: unique phone is highest priority, then email, then userId, then orderId
      const groupKey = normalizedPhone
        ? `ph_${normalizedPhone}`
        : resolvedEmail
        ? `em_${resolvedEmail.toLowerCase()}`
        : resolvedUserId
        ? `uid_${resolvedUserId}`
        : `ord_${o.id}`;

      const trekTitle = o.trekName || "Scenic Kokan Trek";
      const trekDateStr = o.trekDate || "Recent Date";
      const orderAmount = Number(o.totalAmount || 0);
      const personsCount = Array.isArray(o.persons) && o.persons.length > 0 ? o.persons.length : 1;
      const orderCreatedAt = o.createdAt?.toDate ? o.createdAt.toDate().toISOString() : String(o.createdAt || new Date().toISOString());
      const orderCreatedMs = new Date(orderCreatedAt).getTime() || nowMs;

      if (!trekkerMap[groupKey]) {
        trekkerMap[groupKey] = {
          id: groupKey,
          name: resolvedName,
          phone: normalizedPhone,
          email: resolvedEmail,
          userId: resolvedUserId,
          totalTreksCount: 1,
          totalTrekkersBooked: personsCount,
          totalSpent: orderAmount,
          treks: [trekTitle],
          lastTrekName: trekTitle,
          lastTrekDate: trekDateStr,
          lastOrderCreatedAt: orderCreatedAt,
          daysSinceLastTrek: Math.max(0, Math.floor((nowMs - orderCreatedMs) / (1000 * 60 * 60 * 24))),
          pickupLocations: o.pickupLocation ? [o.pickupLocation] : [],
          segment: "new",
          latestOrderId: o.id,
        };
      } else {
        const item = trekkerMap[groupKey];
        item.totalTreksCount += 1;
        item.totalTrekkersBooked += personsCount;
        item.totalSpent += orderAmount;
        if (!item.treks.includes(trekTitle)) {
          item.treks.push(trekTitle);
        }
        if (o.pickupLocation && !item.pickupLocations.includes(o.pickupLocation)) {
          item.pickupLocations.push(o.pickupLocation);
        }
        if (resolvedName && resolvedName !== "Traveler" && item.name === "Traveler") {
          item.name = resolvedName;
        }
        if (!item.phone && normalizedPhone) {
          item.phone = normalizedPhone;
        }
        if (!item.email && resolvedEmail) {
          item.email = resolvedEmail;
        }

        // Check if this order is more recent than existing
        const prevOrderMs = new Date(item.lastOrderCreatedAt).getTime() || 0;
        if (orderCreatedMs > prevOrderMs) {
          item.lastTrekName = trekTitle;
          item.lastTrekDate = trekDateStr;
          item.lastOrderCreatedAt = orderCreatedAt;
          item.daysSinceLastTrek = Math.max(0, Math.floor((nowMs - orderCreatedMs) / (1000 * 60 * 60 * 24)));
          item.latestOrderId = o.id;
        }
      }
    }

    // 4. Compute Engagement Segments for each trekker
    const allTrekkers = Object.values(trekkerMap);
    allTrekkers.forEach((t) => {
      if (t.totalTreksCount >= 3 || t.totalSpent >= 5000) {
        t.segment = "vip";
      } else if (t.daysSinceLastTrek <= 60) {
        t.segment = t.totalTreksCount === 1 ? "new" : "active";
      } else if (t.daysSinceLastTrek <= 150) {
        t.segment = "lapsed"; // Target for re-engagement message!
      } else {
        t.segment = "cold";
      }
    });

    // Sort by recency (most recently active first)
    allTrekkers.sort((a, b) => {
      const tA = new Date(a.lastOrderCreatedAt).getTime() || 0;
      const tB = new Date(b.lastOrderCreatedAt).getTime() || 0;
      return tB - tA;
    });

    // 5. Aggregate statistics for quick marketing overview
    const stats = {
      totalUniqueTrekkers: allTrekkers.length,
      withPhoneCount: allTrekkers.filter((t) => Boolean(t.phone)).length,
      vipCount: allTrekkers.filter((t) => t.segment === "vip").length,
      activeCount: allTrekkers.filter((t) => t.segment === "active" || t.segment === "new").length,
      lapsedCount: allTrekkers.filter((t) => t.segment === "lapsed").length,
      coldCount: allTrekkers.filter((t) => t.segment === "cold").length,
      totalRevenueGenerated: allTrekkers.reduce((sum, t) => sum + t.totalSpent, 0),
    };

    return NextResponse.json({
      success: true,
      stats,
      trekkers: allTrekkers,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 MARKETING TREKKERS API ERROR:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

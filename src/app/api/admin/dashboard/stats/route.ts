import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";
import { isAuthorizedAdmin } from "@/lib/apiAuth";

// In-memory cache to make repeated dashboard visits sub-10ms
let cachedPayload: any = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 20_000; // 20 seconds

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  const now = Date.now();
  if (cachedPayload && now - lastCacheTime < CACHE_TTL_MS) {
    return NextResponse.json(cachedPayload, {
      headers: {
        "Cache-Control": "private, s-maxage=20, stale-while-revalidate=40",
      },
    });
  }

  try {
    const [
      usersCountSnap,
      vendorsCountSnap,
      pendingVendorsCountSnap,
      productsCountSnap,
      pendingProductsCountSnap,
      publishedBlogsCountSnap,
      pendingBlogsCountSnap,
      ordersSnap,
      expensesSnap,
      enquiriesCountSnap,
      recentUsersSnap,
      recentVendorAppsSnap,
      recentProductsSnap,
    ] = await Promise.all([
      db.collection("users").count().get(),
      db.collection("users").where("role", "==", "vendor").where("vendorStatus", "==", "approved").count().get(),
      db.collection("users").where("vendorStatus", "==", "pending").count().get(),
      db.collection("products").where("approved", "==", true).count().get(),
      db.collection("products").where("approved", "==", false).count().get(),
      db.collection("blogs").where("published", "==", true).count().get(),
      db.collection("blogs").where("published", "==", false).count().get(),
      db.collection("orders").get(),
      db.collection("expenses").get().catch(() => ({ docs: [] })),
      db.collection("trek_enquiries").count().get().catch(() => ({ data: () => ({ count: 0 }) })),
      db.collection("users").orderBy("createdAt", "desc").limit(3).get().catch(() => db.collection("users").limit(3).get()),
      db.collection("users").where("vendorStatus", "==", "pending").limit(3).get(),
      db.collection("products").where("approved", "==", false).limit(3).get(),
    ]);

    const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
    const expenses = expensesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));

    const totalUsers = usersCountSnap.data().count;
    const activeVendors = vendorsCountSnap.data().count;
    const pendingVendors = pendingVendorsCountSnap.data().count;
    const productsListed = productsCountSnap.data().count;
    const productsAwaitingReview = pendingProductsCountSnap.data().count;
    const publishedBlogs = publishedBlogsCountSnap.data().count;
    const pendingBlogs = pendingBlogsCountSnap.data().count;
    const totalEnquiries = (enquiriesCountSnap as any).data().count || 0;

    // Date boundaries for period comparison
    const nowDate = new Date();
    const currentMonthStart = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1).getTime();
    const previousMonthStart = new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, 1).getTime();
    const previousMonthEnd = currentMonthStart;

    let totalRevenue = 0;
    let trekRevenue = 0;
    let productRevenue = 0;
    let totalTrekkers = 0;
    let pendingOrders = 0;
    let confirmedOrders = 0;
    let totalCashDue = 0;

    let curMonthRev = 0;
    let prevMonthRev = 0;
    let curMonthOrdersCount = 0;
    let prevMonthOrdersCount = 0;
    let curMonthTrekkersCount = 0;
    let prevMonthTrekkersCount = 0;

    // Daily breakdown for last 14 days
    const dailyMap: Record<string, { date: string; label: string; revenue: number; orders: number; trekkers: number }> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(nowDate.getTime() - i * 86400000);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      dailyMap[key] = { date: key, label, revenue: 0, orders: 0, trekkers: 0 };
    }

    // Trek Popularity Tracking
    const trekPopularity: Record<string, { name: string; bookings: number; trekkers: number; revenue: number }> = {};

    // Traveler Retention Tracking (New vs. Returning Trekkers)
    const trekkerTracker: Record<
      string,
      {
        name: string;
        phone: string;
        email: string;
        ordersCount: number;
        totalTrekkers: number;
        totalSpent: number;
        lastTrek: string;
        lastOrderMs: number;
      }
    > = {};

    orders.forEach((o: any) => {
      const isCancelled = o.status === "cancelled";
      const amt = Number(o.totalAmount || 0);
      const isTrek = o.orderType === "trek" || (!o.orderType && o.trekName);
      const trekkersCount = Array.isArray(o.persons) && o.persons.length > 0 ? o.persons.length : (isTrek ? 1 : 0);

      if (o.status === "pending" || o.status === "pending_verification") {
        pendingOrders++;
      }
      if (o.status === "confirmed" || o.status === "delivered") {
        confirmedOrders++;
      }

      const due = Number(o.remainingCash !== undefined ? o.remainingCash : (o.paymentType === "offline" ? amt : 0));
      totalCashDue += Math.max(0, due);

      if (!isCancelled) {
        totalRevenue += amt;
        const oDateMs = o.createdAt?.toDate ? o.createdAt.toDate().getTime() : new Date(o.createdAt || 0).getTime();

        if (isTrek) {
          trekRevenue += amt;
          totalTrekkers += trekkersCount;

          const tName = String(o.trekName || "Other Trek").trim();
          if (!trekPopularity[tName]) {
            trekPopularity[tName] = { name: tName, bookings: 0, trekkers: 0, revenue: 0 };
          }
          trekPopularity[tName].bookings += 1;
          trekPopularity[tName].trekkers += trekkersCount;
          trekPopularity[tName].revenue += amt;

          // Track unique trekker profiles for retention analysis
          const phone = String(o.userPhone || o.phone || o.contactPhone || o.deliveryAddress?.phone || "").trim();
          const email = String(o.userEmail || "").trim().toLowerCase();
          const uid = String(o.userId || "").trim();
          const name = String(o.userName || "Traveler").trim();

          const cleanDigits = phone.replace(/\D/g, "");
          const normPhone = cleanDigits.length === 10 ? cleanDigits : (cleanDigits.length === 12 && cleanDigits.startsWith("91") ? cleanDigits.slice(2) : cleanDigits);
          const trekkerKey = normPhone ? `ph_${normPhone}` : email ? `em_${email}` : uid ? `uid_${uid}` : `ord_${o.id}`;

          if (!trekkerTracker[trekkerKey]) {
            trekkerTracker[trekkerKey] = {
              name,
              phone: normPhone,
              email,
              ordersCount: 1,
              totalTrekkers: trekkersCount,
              totalSpent: amt,
              lastTrek: tName,
              lastOrderMs: oDateMs,
            };
          } else {
            const t = trekkerTracker[trekkerKey];
            t.ordersCount += 1;
            t.totalTrekkers += trekkersCount;
            t.totalSpent += amt;
            if (name && name !== "Traveler" && t.name === "Traveler") t.name = name;
            if (!t.phone && normPhone) t.phone = normPhone;
            if (oDateMs > t.lastOrderMs) {
              t.lastTrek = tName;
              t.lastOrderMs = oDateMs;
            }
          }
        } else {
          productRevenue += amt;
        }

        if (oDateMs >= currentMonthStart) {
          curMonthRev += amt;
          curMonthOrdersCount += 1;
          if (isTrek) curMonthTrekkersCount += trekkersCount;
        } else if (oDateMs >= previousMonthStart && oDateMs < previousMonthEnd) {
          prevMonthRev += amt;
          prevMonthOrdersCount += 1;
          if (isTrek) prevMonthTrekkersCount += trekkersCount;
        }

        const dateKey = o.createdAt?.toDate
          ? o.createdAt.toDate().toISOString().split("T")[0]
          : typeof o.createdAt === "string"
          ? o.createdAt.split("T")[0]
          : "";

        if (dateKey && dailyMap[dateKey]) {
          dailyMap[dateKey].revenue += amt;
          dailyMap[dateKey].orders += 1;
          if (isTrek) dailyMap[dateKey].trekkers += trekkersCount;
        }
      }
    });

    // Compute Traveler Retention & Loyalty Metrics
    const allTrekkerProfiles = Object.values(trekkerTracker);
    const totalUniqueTrekkers = allTrekkerProfiles.length;
    const returningTrekkers = allTrekkerProfiles.filter((t) => t.ordersCount >= 2);
    const newTrekkers = allTrekkerProfiles.filter((t) => t.ordersCount === 1);

    const returningTrekkersCount = returningTrekkers.length;
    const newTrekkersCount = newTrekkers.length;

    const returningTrekkersPercent = totalUniqueTrekkers > 0
      ? Number(((returningTrekkersCount / totalUniqueTrekkers) * 100).toFixed(1))
      : 0;
    const newTrekkersPercent = totalUniqueTrekkers > 0
      ? Number(((newTrekkersCount / totalUniqueTrekkers) * 100).toFixed(1))
      : 0;

    const revenueFromReturning = returningTrekkers.reduce((sum, t) => sum + t.totalSpent, 0);
    const revenueFromNew = newTrekkers.reduce((sum, t) => sum + t.totalSpent, 0);

    const avgSpendReturning = returningTrekkersCount > 0 ? Math.round(revenueFromReturning / returningTrekkersCount) : 0;
    const avgSpendNew = newTrekkersCount > 0 ? Math.round(revenueFromNew / newTrekkersCount) : 0;

    const repeatBookingRate = totalUniqueTrekkers > 0
      ? Number(((returningTrekkersCount / totalUniqueTrekkers) * 100).toFixed(1))
      : 0;

    const topReturningTrekkers = returningTrekkers
      .sort((a, b) => b.ordersCount !== a.ordersCount ? b.ordersCount - a.ordersCount : b.totalSpent - a.totalSpent)
      .slice(0, 4)
      .map((t) => ({
        name: t.name,
        phone: t.phone,
        ordersCount: t.ordersCount,
        totalTrekkers: t.totalTrekkers,
        totalSpent: t.totalSpent,
        lastTrek: t.lastTrek,
      }));

    const retention = {
      totalUniqueTrekkers,
      newTrekkersCount,
      returningTrekkersCount,
      newTrekkersPercent,
      returningTrekkersPercent,
      repeatBookingRate,
      revenueFromNew,
      revenueFromReturning,
      avgSpendNew,
      avgSpendReturning,
      topReturningTrekkers,
    };

    // Expenses & Profit
    const totalExpenses = expenses.reduce((acc: number, exp: any) => acc + Number(exp.amount || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? Number(((netProfit / totalRevenue) * 100).toFixed(1)) : 0;

    // Percentage changes
    const calcChange = (cur: number, prev: number) => {
      if (prev === 0) return cur > 0 ? 100 : 0;
      return Number((((cur - prev) / prev) * 100).toFixed(1));
    };

    const revChange = calcChange(curMonthRev, prevMonthRev);
    const ordersChange = calcChange(curMonthOrdersCount, prevMonthOrdersCount);
    const trekkersChange = calcChange(curMonthTrekkersCount, prevMonthTrekkersCount);

    // Top 5 Treks sorted by revenue
    const topTreks = Object.values(trekPopularity)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Timeline array
    const timeline = Object.values(dailyMap);

    const stats = {
      totalUsers,
      activeVendors,
      pendingVendors,
      productsListed,
      productsAwaitingReview,
      publishedBlogs,
      pendingBlogs,
      pendingOrders,
      confirmedOrders,
      totalOrders: orders.length,
      totalRevenue,
      trekRevenue,
      productRevenue,
      totalTrekkers,
      totalExpenses,
      netProfit,
      profitMargin,
      totalCashDue,
      totalEnquiries,
      comparisons: {
        revenue: { current: curMonthRev, previous: prevMonthRev, changePercent: revChange },
        orders: { current: curMonthOrdersCount, previous: prevMonthOrdersCount, changePercent: ordersChange },
        trekkers: { current: curMonthTrekkersCount, previous: prevMonthTrekkersCount, changePercent: trekkersChange },
      },
      categorySplit: {
        treksRevenue: trekRevenue,
        productsRevenue: productRevenue,
        treksPercent: totalRevenue > 0 ? Number(((trekRevenue / totalRevenue) * 100).toFixed(1)) : 0,
        productsPercent: totalRevenue > 0 ? Number(((productRevenue / totalRevenue) * 100).toFixed(1)) : 0,
      },
      topTreks,
      timeline,
      retention,
    };

    const getMs = (val: any): number => {
      if (!val) return 0;
      if (val.toDate) return val.toDate().getTime();
      if (typeof val === "string") return new Date(val).getTime();
      if (typeof val === "number") return val;
      return 0;
    };

    const items: any[] = [];

    recentUsersSnap.docs.forEach((d) => {
      const data = d.data();
      items.push({
        action: "New user registered",
        name: data.displayName || data.email || "Unknown",
        status: "new",
        createdAt: getMs(data.createdAt),
      });
    });

    recentVendorAppsSnap.docs.forEach((d) => {
      const data = d.data();
      items.push({
        action: "Vendor application submitted",
        name: data.businessName || data.displayName || "Unknown",
        status: "pending",
        createdAt: getMs(data.createdAt),
      });
    });

    recentProductsSnap.docs.forEach((d) => {
      const data = d.data();
      items.push({
        action: "Product submitted for review",
        name: data.name || "Unnamed product",
        status: "pending",
        createdAt: getMs(data.createdAt),
      });
    });

    orders.slice(0, 6).forEach((data: any) => {
      items.push({
        action: data.status === "cancelled" ? "Order cancelled" : "New booking confirmed",
        name: data.trekName ?? data.items?.[0]?.name ?? `Order #${(data.id || "").slice(0, 6)}`,
        status: data.status === "cancelled" ? "rejected" : "approved",
        createdAt: getMs(data.createdAt),
      });
    });

    items.sort((a, b) => b.createdAt - a.createdAt);
    const top8 = items.slice(0, 8);

    const payload = { stats, activity: top8 };
    cachedPayload = payload;
    lastCacheTime = now;

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "private, s-maxage=20, stale-while-revalidate=40",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Dashboard stats API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

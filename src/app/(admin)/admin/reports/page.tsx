"use client";

import { useEffect, useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Mountain,
  ShoppingBag,
  Calendar,
  Download,
  Printer,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  PieChart,
  Layers,
  MapPin,
  Clock,
  Sparkles,
  Award,
  Wallet,
  IndianRupee,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Bus,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Person {
  name: string;
  age?: number;
  gender?: string;
  pickupLocation?: string;
}

interface OrderRecord {
  id: string;
  orderType?: string;
  trekId?: string;
  trekName?: string;
  trekDate?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  phone?: string;
  userId?: string;
  totalAmount?: number;
  advancePaid?: number;
  remainingCash?: number;
  cashCollected?: boolean;
  paymentType?: "full" | "advance" | "offline";
  status?: string;
  persons?: Person[];
  pickupLocation?: string;
  pickupPoint?: string;
  boardingPoint?: string;
  createdAt?: any;
}

interface ExpenseRecord {
  id: string;
  description: string;
  amount: number;
  category: string;
  trekId?: string | null;
  trekName?: string | null;
  date: string;
  createdAt?: any;
}

type PeriodFilter = "30d" | "90d" | "1y" | "all";

// Helper to reliably extract timestamp in ms from various Firestore date formats
const getOrderTimestamp = (order: OrderRecord): number => {
  if (!order) return 0;
  if (order.createdAt?.toDate && typeof order.createdAt.toDate === "function") {
    return order.createdAt.toDate().getTime();
  }
  if (order.createdAt?.seconds) {
    return order.createdAt.seconds * 1000;
  }
  if (typeof order.createdAt === "string") {
    const t = new Date(order.createdAt).getTime();
    if (!isNaN(t)) return t;
  }
  if (order.trekDate) {
    const t = new Date(order.trekDate).getTime();
    if (!isNaN(t)) return t;
  }
  return 0;
};

const getExpenseTimestamp = (expense: ExpenseRecord): number => {
  if (!expense) return 0;
  if (expense.date) {
    const t = new Date(expense.date).getTime();
    if (!isNaN(t)) return t;
  }
  if (expense.createdAt?.toDate && typeof expense.createdAt.toDate === "function") {
    return expense.createdAt.toDate().getTime();
  }
  if (typeof expense.createdAt === "string") {
    const t = new Date(expense.createdAt).getTime();
    if (!isNaN(t)) return t;
  }
  return 0;
};

export default function AdminReportsPage() {
  const [allOrders, setAllOrders] = useState<OrderRecord[]>([]);
  const [allExpenses, setAllExpenses] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<PeriodFilter>("30d");

  // Load 100% Live Raw Data from Firestore APIs
  const fetchLiveData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const now = Date.now();
      const [ordersRes, expensesRes] = await Promise.all([
        fetch(`/api/admin/orders?_t=${now}`),
        fetch(`/api/expenses?_t=${now}`).catch(() => null),
      ]);

      if (!ordersRes.ok) throw new Error("Failed to load live orders");
      const ordersData = await ordersRes.json();
      const expensesData = expensesRes && expensesRes.ok ? await expensesRes.json() : [];

      setAllOrders(Array.isArray(ordersData) ? ordersData : []);
      setAllExpenses(Array.isArray(expensesData) ? expensesData : []);

      if (isManual) {
        toast.success(`Loaded ${ordersData.length} live orders & ${expensesData.length} expenses.`);
      }
    } catch (err) {
      console.error("Error loading live reports data:", err);
      toast.error("Failed to fetch live database records. Please retry.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  // Compute date boundary for selected period
  const dateRange = useMemo(() => {
    const now = new Date();
    const nowMs = now.getTime();

    let startMs = 0;
    let prevStartMs = 0;
    let prevEndMs = 0;

    if (period === "30d") {
      startMs = nowMs - 30 * 86400000;
      prevStartMs = nowMs - 60 * 86400000;
      prevEndMs = startMs;
    } else if (period === "90d") {
      startMs = nowMs - 90 * 86400000;
      prevStartMs = nowMs - 180 * 86400000;
      prevEndMs = startMs;
    } else if (period === "1y") {
      startMs = nowMs - 365 * 86400000;
      prevStartMs = nowMs - 730 * 86400000;
      prevEndMs = startMs;
    } else {
      // "all"
      startMs = 0;
      prevStartMs = 0;
      prevEndMs = 0;
    }

    return { startMs, endMs: nowMs, prevStartMs, prevEndMs };
  }, [period]);

  // Filter live orders & live expenses strictly by timestamp
  const { filteredOrders, previousPeriodOrders, filteredExpenses } = useMemo(() => {
    const { startMs, endMs, prevStartMs, prevEndMs } = dateRange;

    const filtered = allOrders.filter((o) => {
      const t = getOrderTimestamp(o);
      if (startMs === 0) return true; // all time
      return t >= startMs && t <= endMs;
    });

    const previous =
      prevStartMs > 0
        ? allOrders.filter((o) => {
            const t = getOrderTimestamp(o);
            return t >= prevStartMs && t < prevEndMs;
          })
        : [];

    const expFiltered = allExpenses.filter((e) => {
      const t = getExpenseTimestamp(e);
      if (startMs === 0) return true;
      return t >= startMs && t <= endMs;
    });

    return {
      filteredOrders: filtered,
      previousPeriodOrders: previous,
      filteredExpenses: expFiltered,
    };
  }, [allOrders, allExpenses, dateRange]);

  // Compute 100% Real, Dynamic Metrics from Filtered Records
  const metrics = useMemo(() => {
    let grossVolume = 0;
    let trekRevenue = 0;
    let productRevenue = 0;
    let onlineAdvanceRealized = 0;
    let cashCollectedRealized = 0;
    let cashDue = 0;
    let totalTrekkers = 0;
    let confirmedCount = 0;
    let pendingCount = 0;
    let cancelledCount = 0;

    const trekStatsMap: Record<
      string,
      {
        name: string;
        bookings: number;
        trekkers: number;
        revenue: number;
        advancePaid: number;
        cashCollected: number;
      }
    > = {};

    const pickupPointsMap: Record<string, number> = {};
    const customerTracker: Record<string, { count: number; spend: number }> = {};

    filteredOrders.forEach((o) => {
      const isCancelled = o.status === "cancelled";
      const amt = Number(o.totalAmount || 0);
      const isTrek = o.orderType === "trek" || Boolean(o.trekName);
      const personsCount =
        Array.isArray(o.persons) && o.persons.length > 0 ? o.persons.length : isTrek ? 1 : 0;

      if (isCancelled) {
        cancelledCount++;
        return; // Don't count revenue from cancelled bookings
      }

      if (o.status === "pending" || o.status === "pending_verification") {
        pendingCount++;
      } else {
        confirmedCount++;
      }

      grossVolume += amt;

      const advance = Number(
        o.advancePaid !== undefined
          ? o.advancePaid
          : o.paymentType === "full"
          ? amt
          : 0
      );
      onlineAdvanceRealized += Math.max(0, advance);

      const remaining = Number(
        o.remainingCash !== undefined
          ? o.remainingCash
          : o.paymentType === "offline"
          ? amt
          : Math.max(0, amt - advance)
      );

      if (o.cashCollected) {
        cashCollectedRealized += remaining;
      } else {
        cashDue += remaining;
      }

      if (isTrek) {
        trekRevenue += amt;
        totalTrekkers += personsCount;

        const trekName = (o.trekName || "Sahyadri Trail").trim();
        if (!trekStatsMap[trekName]) {
          trekStatsMap[trekName] = {
            name: trekName,
            bookings: 0,
            trekkers: 0,
            revenue: 0,
            advancePaid: 0,
            cashCollected: 0,
          };
        }
        trekStatsMap[trekName].bookings += 1;
        trekStatsMap[trekName].trekkers += personsCount;
        trekStatsMap[trekName].revenue += amt;
        trekStatsMap[trekName].advancePaid += advance;
        if (o.cashCollected) {
          trekStatsMap[trekName].cashCollected += remaining;
        }

        // Track Pickup Locations
        const rawLoc =
          o.pickupLocation || o.pickupPoint || o.boardingPoint || "Direct / Base Village";
        const cleanLoc = rawLoc.split("-")[0].split(",")[0].trim();
        if (cleanLoc) {
          pickupPointsMap[cleanLoc] = (pickupPointsMap[cleanLoc] || 0) + personsCount;
        }
      } else {
        productRevenue += amt;
      }

      // Customer retention tracking (by phone, email, or user ID)
      const phone = (o.userPhone || o.phone || "").replace(/\D/g, "");
      const email = (o.userEmail || "").trim().toLowerCase();
      const customerKey = phone ? `ph_${phone}` : email ? `em_${email}` : `uid_${o.userId || o.id}`;

      if (!customerTracker[customerKey]) {
        customerTracker[customerKey] = { count: 1, spend: amt };
      } else {
        customerTracker[customerKey].count += 1;
        customerTracker[customerKey].spend += amt;
      }
    });

    // Expenses computation
    let totalExpenses = 0;
    const expenseCategoryMap: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      const amt = Number(e.amount || 0);
      totalExpenses += amt;
      const cat = (e.category || "General").toLowerCase();
      expenseCategoryMap[cat] = (expenseCategoryMap[cat] || 0) + amt;
    });

    // Net Realized Receipts = actual cash in hand (Advance Paid + Cash Collected + Product Sales)
    const totalRealizedReceipts = onlineAdvanceRealized + cashCollectedRealized + productRevenue;
    const netProfit = totalRealizedReceipts - totalExpenses;
    const operatingMarginPercent =
      totalRealizedReceipts > 0 ? Math.round((netProfit / totalRealizedReceipts) * 100) : 0;

    const totalValidOrders = confirmedCount + pendingCount;
    const averageOrderValue = totalValidOrders > 0 ? Math.round(grossVolume / totalValidOrders) : 0;

    // Previous period comparison for authentic growth rates
    const prevGross = previousPeriodOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    let growthPercent = 0;
    if (prevGross > 0) {
      growthPercent = Math.round(((grossVolume - prevGross) / prevGross) * 100);
    } else if (grossVolume > 0 && previousPeriodOrders.length > 0) {
      growthPercent = 100;
    }

    // Top treks sorted by revenue
    const topTreks = Object.values(trekStatsMap).sort((a, b) => b.revenue - a.revenue);

    // Customer loyalty & retention
    const customerProfiles = Object.values(customerTracker);
    const totalUniqueCustomers = customerProfiles.length;
    const returningCustomers = customerProfiles.filter((c) => c.count >= 2).length;
    const newCustomers = customerProfiles.filter((c) => c.count === 1).length;
    const repeatRate =
      totalUniqueCustomers > 0 ? Math.round((returningCustomers / totalUniqueCustomers) * 100) : 0;

    // Top Pickup Locations sorted
    const topPickupLocations = Object.entries(pickupPointsMap)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      grossVolume,
      trekRevenue,
      productRevenue,
      onlineAdvanceRealized,
      cashCollectedRealized,
      cashDue,
      totalRealizedReceipts,
      totalTrekkers,
      confirmedCount,
      pendingCount,
      cancelledCount,
      totalExpenses,
      netProfit,
      operatingMarginPercent,
      averageOrderValue,
      growthPercent,
      prevGross,
      topTreks,
      expenseCategoryMap,
      totalUniqueCustomers,
      returningCustomers,
      newCustomers,
      repeatRate,
      topPickupLocations,
    };
  }, [filteredOrders, previousPeriodOrders, filteredExpenses]);

  // Dynamic Trend Bars calculated from live timestamps in this period
  const trendBars = useMemo(() => {
    const buckets: { label: string; revenue: number; trekkers: number; orders: number }[] = [];
    const now = new Date();

    if (period === "30d") {
      // 14 trailing days
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 86400000);
        const dayKey = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

        let dayRev = 0;
        let dayTrekkers = 0;
        let dayOrders = 0;

        filteredOrders.forEach((o) => {
          if (o.status === "cancelled") return;
          const t = getOrderTimestamp(o);
          if (t > 0) {
            const oKey = new Date(t).toISOString().split("T")[0];
            if (oKey === dayKey) {
              dayRev += Number(o.totalAmount || 0);
              dayOrders += 1;
              const isTrek = o.orderType === "trek" || Boolean(o.trekName);
              const pax =
                Array.isArray(o.persons) && o.persons.length > 0 ? o.persons.length : isTrek ? 1 : 0;
              dayTrekkers += pax;
            }
          }
        });

        buckets.push({ label, revenue: dayRev, trekkers: dayTrekkers, orders: dayOrders });
      }
    } else if (period === "90d") {
      // 12 weeks
      for (let w = 11; w >= 0; w--) {
        const start = new Date(now.getTime() - (w + 1) * 7 * 86400000).getTime();
        const end = new Date(now.getTime() - w * 7 * 86400000).getTime();
        const label = `Wk ${12 - w}`;

        let weekRev = 0;
        let weekTrekkers = 0;
        let weekOrders = 0;

        filteredOrders.forEach((o) => {
          if (o.status === "cancelled") return;
          const t = getOrderTimestamp(o);
          if (t >= start && t < end) {
            weekRev += Number(o.totalAmount || 0);
            weekOrders += 1;
            const isTrek = o.orderType === "trek" || Boolean(o.trekName);
            const pax =
              Array.isArray(o.persons) && o.persons.length > 0 ? o.persons.length : isTrek ? 1 : 0;
            weekTrekkers += pax;
          }
        });

        buckets.push({ label, revenue: weekRev, trekkers: weekTrekkers, orders: weekOrders });
      }
    } else {
      // 12 months for 1y and all-time
      for (let m = 11; m >= 0; m--) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
        const y = targetDate.getFullYear();
        const mon = targetDate.getMonth();
        const start = new Date(y, mon, 1).getTime();
        const end = new Date(y, mon + 1, 1).getTime();
        const label = targetDate.toLocaleDateString("en-IN", { month: "short" });

        let mRev = 0;
        let mTrekkers = 0;
        let mOrders = 0;

        filteredOrders.forEach((o) => {
          if (o.status === "cancelled") return;
          const t = getOrderTimestamp(o);
          if (t >= start && t < end) {
            mRev += Number(o.totalAmount || 0);
            mOrders += 1;
            const isTrek = o.orderType === "trek" || Boolean(o.trekName);
            const pax =
              Array.isArray(o.persons) && o.persons.length > 0 ? o.persons.length : isTrek ? 1 : 0;
            mTrekkers += pax;
          }
        });

        buckets.push({ label, revenue: mRev, trekkers: mTrekkers, orders: mOrders });
      }
    }

    return buckets;
  }, [filteredOrders, period]);

  // One-click CSV Export of authentic live records
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error("No live data to export in the selected period.");
      return;
    }

    let csv = `VISIT KOKAN - LIVE EXECUTIVE BUSINESS & EXPEDITIONS REPORT\n`;
    csv += `Export Generated:,${new Date().toLocaleString("en-IN")},Selected Timeframe:,${period.toUpperCase()}\n`;
    csv += `Live Orders Evaluated:,${filteredOrders.length},Live Expense Records:,${filteredExpenses.length}\n\n`;

    csv += `1. EXECUTIVE KPI SUMMARY (LIVE DATA)\n`;
    csv += `Metric,Live Value (INR)\n`;
    csv += `Gross Booking Volume,${metrics.grossVolume}\n`;
    csv += `Trek Expeditions Revenue,${metrics.trekRevenue}\n`;
    csv += `Artisan Shop Revenue,${metrics.productRevenue}\n`;
    csv += `Online Advance Realized (Razorpay/UPI),${metrics.onlineAdvanceRealized}\n`;
    csv += `Base Village Cash Realized,${metrics.cashCollectedRealized}\n`;
    csv += `Cash Remaining / Outstanding,${metrics.cashDue}\n`;
    csv += `Total Net Realized Receipts,${metrics.totalRealizedReceipts}\n`;
    csv += `Total Live Expenses,${metrics.totalExpenses}\n`;
    csv += `Net Operating Profit,${metrics.netProfit}\n`;
    csv += `Operating Margin (%),${metrics.operatingMarginPercent}%\n`;
    csv += `Total Trekkers Hosted (Pax),${metrics.totalTrekkers}\n`;
    csv += `Confirmed Paid Orders,${metrics.confirmedCount}\n`;
    csv += `Average Order Value,${metrics.averageOrderValue}\n`;
    csv += `Repeat Trekker Loyalty Rate,${metrics.repeatRate}%\n\n`;

    csv += `2. TREK EXPEDITIONS PERFORMANCE LEADERBOARD\n`;
    csv += `Rank,Trek Name,Bookings,Trekkers (Pax),Gross Revenue (INR),Online Advance (INR),Cash Collected (INR),Avg Price/Pax (INR)\n`;
    metrics.topTreks.forEach((t, i) => {
      const avg = t.trekkers > 0 ? Math.round(t.revenue / t.trekkers) : 0;
      csv += `${i + 1},"${t.name}",${t.bookings},${t.trekkers},${t.revenue},${t.advancePaid},${t.cashCollected},${avg}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `VisitKokan_Live_Report_${period}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Live Executive Report exported to CSV! 📊");
  };

  const handlePrint = () => {
    window.print();
  };

  const maxTrendRev = Math.max(...trendBars.map((b) => b.revenue), 100);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto print:p-0 print:bg-white print:text-black">
      <Toaster position="top-right" />

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#2ecc71]/10 text-[#2ecc71]">
              <BarChart3 size={20} />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Reports &amp; Analytics</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Database
              </span>
            </h1>
          </div>
          <p className="text-white/40 text-xs mt-1">
            Real-time financial analytics calculated directly from {allOrders.length} live orders and {allExpenses.length} operational expenses.
          </p>
        </div>

        {/* Period Selector & Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-[#141414] border border-white/10 rounded-xl p-1 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setPeriod("30d")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                period === "30d"
                  ? "bg-[#2ecc71] text-black shadow-xs"
                  : "text-white/60 hover:text-white"
              }`}
            >
              30 Days
            </button>
            <button
              type="button"
              onClick={() => setPeriod("90d")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                period === "90d"
                  ? "bg-[#2ecc71] text-black shadow-xs"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Quarter (90d)
            </button>
            <button
              type="button"
              onClick={() => setPeriod("1y")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                period === "1y"
                  ? "bg-[#2ecc71] text-black shadow-xs"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Past Year
            </button>
            <button
              type="button"
              onClick={() => setPeriod("all")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                period === "all"
                  ? "bg-[#2ecc71] text-black shadow-xs"
                  : "text-white/60 hover:text-white"
              }`}
            >
              All Time
            </button>
          </div>

          <button
            type="button"
            onClick={() => fetchLiveData(true)}
            disabled={refreshing || loading}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh analytics data directly from database"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Print or Save PDF"
          >
            <Printer size={14} />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-black font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[#2ecc71]/20"
          >
            <FileSpreadsheet size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center bg-[#141414] border border-white/5 rounded-2xl space-y-2">
          <RefreshCw size={24} className="animate-spin text-[#2ecc71] mx-auto" />
          <p className="text-white/60 text-sm font-semibold">Aggregating live Firestore orders &amp; expenses...</p>
          <p className="text-white/30 text-xs">Computing authentic revenue, margin, and trek leaderboards.</p>
        </div>
      ) : allOrders.length === 0 ? (
        <div className="p-16 text-center bg-[#141414] border border-white/5 rounded-2xl space-y-2">
          <AlertCircle size={32} className="text-white/30 mx-auto" />
          <p className="text-white/70 text-sm font-bold">No orders found in database</p>
          <p className="text-white/40 text-xs">Create or confirm a trek booking to populate live analytics.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ── Key Executive KPI Cards (100% Live) ────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Gross Volume */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">
                <span>Gross Volume</span>
                <IndianRupee size={12} className="text-[#2ecc71]" />
              </div>
              <div className="text-2xl font-black text-white">
                ₹{metrics.grossVolume.toLocaleString("en-IN")}
              </div>
              <div className="text-[10px] flex items-center gap-1 mt-1 font-semibold">
                {metrics.growthPercent >= 0 ? (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp size={11} /> +{metrics.growthPercent}% vs prior
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-0.5">
                    <TrendingDown size={11} /> {metrics.growthPercent}% vs prior
                  </span>
                )}
              </div>
            </div>

            {/* Total Trekkers Hosted */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">
                <span>Total Trekkers</span>
                <Users size={12} className="text-[#2ecc71]" />
              </div>
              <div className="text-2xl font-black text-white">
                {metrics.totalTrekkers.toLocaleString("en-IN")}
              </div>
              <p className="text-[10px] text-white/40 mt-1">
                From {filteredOrders.length} bookings ({period.toUpperCase()})
              </p>
            </div>

            {/* Confirmed Orders */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">
                <span>Paid Orders</span>
                <CheckCircle2 size={12} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {metrics.confirmedCount}
              </div>
              <p className="text-[10px] text-white/40 mt-1">
                {metrics.pendingCount > 0 ? `${metrics.pendingCount} pending verification` : "All verified"}
              </p>
            </div>

            {/* Average Order Value */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">
                <span>Avg Order Value</span>
                <Wallet size={12} className="text-[#2ecc71]" />
              </div>
              <div className="text-2xl font-black text-white">
                ₹{metrics.averageOrderValue.toLocaleString("en-IN")}
              </div>
              <p className="text-[10px] text-white/40 mt-1">Actual live transaction mean</p>
            </div>

            {/* Total Real Expenses */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">
                <span>Total Expenses</span>
                <TrendingDown size={12} className="text-red-400" />
              </div>
              <div className="text-2xl font-black text-red-400">
                ₹{metrics.totalExpenses.toLocaleString("en-IN")}
              </div>
              <p className="text-[10px] text-white/40 mt-1">
                From {filteredExpenses.length} expense entries
              </p>
            </div>

            {/* Net Operating Profit */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">
                <span>Operating Profit</span>
                <Award size={12} className="text-[#2ecc71]" />
              </div>
              <div
                className={`text-2xl font-black ${
                  metrics.netProfit >= 0 ? "text-[#2ecc71]" : "text-amber-400"
                }`}
              >
                ₹{metrics.netProfit.toLocaleString("en-IN")}
              </div>
              <p className="text-[10px] text-white/40 mt-1 font-semibold">
                {metrics.operatingMarginPercent}% net receipts margin
              </p>
            </div>
          </div>

          {/* ── Revenue Channels & Daily Velocity Section ─────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Real Revenue Stream Channels (5 cols) */}
            <div className="lg:col-span-5 bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">Revenue Channels</h3>
                  <p className="text-white/40 text-[11px]">Real breakdown between treks &amp; e-commerce</p>
                </div>
                <PieChart size={16} className="text-[#2ecc71]" />
              </div>

              {/* Real Proportion Bar */}
              <div className="space-y-3 pt-2">
                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden flex">
                  <div
                    className="bg-[#2ecc71] h-full"
                    style={{
                      width: `${
                        metrics.grossVolume > 0
                          ? Math.round((metrics.trekRevenue / metrics.grossVolume) * 100)
                          : 100
                      }%`,
                    }}
                    title="Trek Expeditions"
                  />
                  <div
                    className="bg-amber-400 h-full"
                    style={{
                      width: `${
                        metrics.grossVolume > 0
                          ? Math.round((metrics.productRevenue / metrics.grossVolume) * 100)
                          : 0
                      }%`,
                    }}
                    title="E-Commerce Products"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2ecc71]" />
                      <span>Trek Expeditions</span>
                    </div>
                    <div className="text-lg font-black text-[#2ecc71]">
                      ₹{metrics.trekRevenue.toLocaleString("en-IN")}
                    </div>
                    <p className="text-[10px] text-white/40">
                      {metrics.grossVolume > 0
                        ? `${Math.round((metrics.trekRevenue / metrics.grossVolume) * 100)}% of gross volume`
                        : "0%"}
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span>Artisan Products</span>
                    </div>
                    <div className="text-lg font-black text-amber-400">
                      ₹{metrics.productRevenue.toLocaleString("en-IN")}
                    </div>
                    <p className="text-[10px] text-white/40">
                      {metrics.grossVolume > 0
                        ? `${Math.round((metrics.productRevenue / metrics.grossVolume) * 100)}% of gross volume`
                        : "0%"}
                    </p>
                  </div>
                </div>

                {/* Loyalty & Retention Card (100% Live) */}
                <div className="p-3.5 bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                      <Sparkles size={13} />
                      <span>Traveler Loyalty (Repeat Rate)</span>
                    </div>
                    <div className="text-[11px] text-white/50 mt-0.5">
                      {metrics.returningCustomers} returning explorers · {metrics.newCustomers} first-time travelers
                    </div>
                  </div>
                  <div className="text-xl font-black text-purple-400">
                    {metrics.repeatRate}%
                  </div>
                </div>

                {/* Top Pickup Locations */}
                {metrics.topPickupLocations.length > 0 && (
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1.5">
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider flex items-center gap-1">
                      <MapPin size={11} className="text-[#2ecc71]" />
                      <span>Top Pickup Points</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {metrics.topPickupLocations.map((p) => (
                        <span
                          key={p.location}
                          className="text-[10px] bg-white/5 border border-white/10 text-white/80 px-2 py-0.5 rounded-md"
                        >
                          {p.location}: <strong className="text-white">{p.count} pax</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Real Booking Velocity Trends (7 cols) */}
            <div className="lg:col-span-7 bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm">Booking Velocity Trends</h3>
                  <p className="text-white/40 text-[11px]">
                    Real daily/weekly distribution from actual order timestamps ({period.toUpperCase()})
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#2ecc71] bg-[#2ecc71]/10 px-2 py-0.5 rounded-md">
                  Live Feed
                </span>
              </div>

              {/* Dynamic Bars */}
              <div className="space-y-2 pt-2">
                <div className="h-44 flex items-end gap-1.5 pt-4 pb-2 border-b border-white/5">
                  {trendBars.map((b) => {
                    const pct =
                      maxTrendRev > 0 && b.revenue > 0
                        ? Math.max(Math.round((b.revenue / maxTrendRev) * 100), 10)
                        : 3;

                    return (
                      <div
                        key={b.label}
                        className="flex-1 flex flex-col items-center gap-1.5 group relative h-full justify-end"
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/20 text-white text-[10px] px-2 py-1 rounded-md pointer-events-none whitespace-nowrap z-20 shadow-lg">
                          <span className="font-bold">{b.label}:</span> ₹{b.revenue.toLocaleString("en-IN")}{" "}
                          ({b.trekkers} pax, {b.orders} orders)
                        </div>

                        <div
                          className={`w-full rounded-t-md transition-all ${
                            b.revenue > 0
                              ? "bg-gradient-to-t from-[#2ecc71]/40 to-[#2ecc71] group-hover:from-[#2ecc71] group-hover:to-[#27ae60]"
                              : "bg-white/5"
                          }`}
                          style={{ height: `${pct}%` }}
                        />
                        <span className="text-[9px] text-white/30 truncate max-w-full font-mono">
                          {b.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
                  <span>Actual Timeframe Activity</span>
                  <span>Hover column to inspect day details</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Trek Performance Leaderboard (100% Live) ───────────── */}
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <Mountain size={16} className="text-[#2ecc71]" />
                  <span>Trek &amp; Expedition Performance Leaderboard</span>
                </h3>
                <p className="text-white/40 text-[11px]">
                  Aggregated from actual bookings, participants, and cash/online payments in this period.
                </p>
              </div>

              <span className="text-white/40 text-xs font-mono">
                {metrics.topTreks.length} routes with bookings
              </span>
            </div>

            {metrics.topTreks.length === 0 ? (
              <div className="p-8 text-center text-white/40 text-xs">
                No trek bookings recorded for this period timeframe. Try selecting &quot;All Time&quot;.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-white/40 uppercase text-[10px] font-bold tracking-wider">
                      <th className="py-2.5 px-3"># Rank</th>
                      <th className="py-2.5 px-3">Trek Route</th>
                      <th className="py-2.5 px-3">Bookings</th>
                      <th className="py-2.5 px-3">Trekkers (Pax)</th>
                      <th className="py-2.5 px-3">Gross Revenue</th>
                      <th className="py-2.5 px-3">Online Advance</th>
                      <th className="py-2.5 px-3">Base Village Cash</th>
                      <th className="py-2.5 px-3">Avg Ticket / Pax</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {metrics.topTreks.map((t, index) => {
                      const avgPrice = t.trekkers > 0 ? Math.round(t.revenue / t.trekkers) : 0;
                      const isTop3 = index < 3;

                      return (
                        <tr key={t.name} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-white/50">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                          </td>
                          <td className="py-3 px-3 font-bold text-white">
                            <div className="flex items-center gap-1.5">
                              <span>{t.name}</span>
                              {isTop3 && (
                                <span className="text-[9px] bg-[#2ecc71]/15 text-[#2ecc71] px-1.5 py-0.2 rounded font-sans">
                                  Top Route
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-white/70">{t.bookings} bookings</td>
                          <td className="py-3 px-3 font-mono font-bold text-white">
                            {t.trekkers} pax
                          </td>
                          <td className="py-3 px-3 font-mono font-black text-[#2ecc71]">
                            ₹{t.revenue.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-3 font-mono text-emerald-400">
                            ₹{t.advancePaid.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-3 font-mono text-amber-400">
                            ₹{t.cashCollected.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-3 font-mono text-white/60">
                            ₹{avgPrice.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Real Financial P&L Statement (Receipts vs Expenses) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Real Receipts Side */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-[#2ecc71]" />
                  <span>Realized Cash &amp; Digital Receipts</span>
                </h4>
                <span className="font-mono font-black text-[#2ecc71]">
                  ₹{metrics.totalRealizedReceipts.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="text-white/60">Online Advance (Razorpay / UPI Direct)</span>
                  <span className="font-mono text-white font-bold">
                    ₹{metrics.onlineAdvanceRealized.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-white/60">Cash Collected at Base Village</span>
                  <span className="font-mono text-white font-bold">
                    ₹{metrics.cashCollectedRealized.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-white/60">Artisan E-Commerce Receipts</span>
                  <span className="font-mono text-white font-bold">
                    ₹{metrics.productRevenue.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 pt-2 border-t border-white/5 text-amber-400/80">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Cash Due / Outstanding at Base Village</span>
                  </span>
                  <span className="font-mono font-bold">
                    ₹{metrics.cashDue.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Real Expenses Side */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <TrendingDown size={14} className="text-red-400" />
                  <span>Actual Operational Expenses</span>
                </h4>
                <span className="font-mono font-black text-red-400">
                  ₹{metrics.totalExpenses.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {Object.keys(metrics.expenseCategoryMap).length === 0 ? (
                  <div className="text-white/30 text-xs py-3 text-center">
                    No expense records logged in this timeframe.
                  </div>
                ) : (
                  Object.entries(metrics.expenseCategoryMap).map(([category, amt]) => (
                    <div key={category} className="flex items-center justify-between py-1">
                      <span className="text-white/60 capitalize">{category} Operations</span>
                      <span className="font-mono text-white font-bold">
                        ₹{amt.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))
                )}
                <div className="flex items-center justify-between py-1.5 pt-2 border-t border-white/5 text-[#2ecc71]">
                  <span className="font-bold">Net Operating Profit</span>
                  <span className="font-mono font-black text-sm">
                    ₹{metrics.netProfit.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

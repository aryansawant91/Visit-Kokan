"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Store,
  Package,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  RefreshCw,
  Mountain,
  ShoppingBag,
  IndianRupee,
  Calendar,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Send,
  CalendarDays,
  Tag,
  DollarSign,
  ChevronRight,
  Layers,
  RotateCcw,
  MessageCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ComparisonMetric {
  current: number;
  previous: number;
  changePercent: number;
}

interface TimelinePoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
  trekkers: number;
}

interface TopTrek {
  name: string;
  bookings: number;
  trekkers: number;
  revenue: number;
}

interface RetentionStats {
  totalUniqueTrekkers: number;
  newTrekkersCount: number;
  returningTrekkersCount: number;
  newTrekkersPercent: number;
  returningTrekkersPercent: number;
  repeatBookingRate: number;
  revenueFromNew: number;
  revenueFromReturning: number;
  avgSpendNew: number;
  avgSpendReturning: number;
  topReturningTrekkers: {
    name: string;
    phone: string;
    ordersCount: number;
    totalTrekkers: number;
    totalSpent: number;
    lastTrek: string;
  }[];
}

interface DashStats {
  totalUsers: number;
  activeVendors: number;
  pendingVendors: number;
  productsListed: number;
  productsAwaitingReview: number;
  publishedBlogs: number;
  pendingBlogs: number;
  pendingOrders: number;
  confirmedOrders: number;
  totalOrders: number;
  totalRevenue: number;
  trekRevenue: number;
  productRevenue: number;
  totalTrekkers: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  totalCashDue: number;
  totalEnquiries: number;
  comparisons: {
    revenue: ComparisonMetric;
    orders: ComparisonMetric;
    trekkers: ComparisonMetric;
  };
  categorySplit: {
    treksRevenue: number;
    productsRevenue: number;
    treksPercent: number;
    productsPercent: number;
  };
  topTreks: TopTrek[];
  timeline: TimelinePoint[];
  retention?: RetentionStats;
}

interface ActivityItem {
  action: string;
  name: string;
  time: string;
  status: "new" | "pending" | "approved" | "rejected" | "alert";
  createdAt: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(ts: number): string {
  if (!ts) return "recently";
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    new: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    approved: "bg-[#2ecc71]/10 text-[#2ecc71] border border-[#2ecc71]/20",
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
    alert: "bg-red-500/10 text-red-400 border border-red-500/20",
  };
  return map[status] ?? "bg-white/5 text-white/40 border border-white/10";
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashStats | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("vk_dash_stats_v2");
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activity, setActivity] = useState<ActivityItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("vk_dash_activity_v2");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("vk_dash_stats_v2");
    }
    return true;
  });

  const [refreshing, setRefreshing] = useState(false);
  const [chartMetric, setChartMetric] = useState<"revenue" | "orders">("revenue");
  const [hoveredPoint, setHoveredPoint] = useState<TimelinePoint | null>(null);

  const loadStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else if (!stats) setLoading(true);

    try {
      const res = await fetch("/api/admin/dashboard/stats");
      if (!res.ok) throw new Error("Failed to load dashboard statistics");
      const data = await res.json();

      if (data?.stats) {
        setStats(data.stats);
        const actWithTime = (data.activity || []).map((a: any) => ({
          ...a,
          time: timeAgo(a.createdAt),
        }));
        setActivity(actWithTime);

        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("vk_dash_stats_v2", JSON.stringify(data.stats));
            sessionStorage.setItem("vk_dash_activity_v2", JSON.stringify(actWithTime));
          } catch {}
        }
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // ── SVG Area Chart Coordinates Generator ──────────────────────────────────
  const chartData = useMemo(() => {
    if (!stats?.timeline || stats.timeline.length === 0) return null;

    const values = stats.timeline.map((p) =>
      chartMetric === "revenue" ? p.revenue : p.orders
    );
    const maxVal = Math.max(...values, chartMetric === "revenue" ? 5000 : 5);
    const width = 600;
    const height = 180;
    const paddingX = 20;
    const paddingY = 25;

    const points = stats.timeline.map((p, idx) => {
      const val = chartMetric === "revenue" ? p.revenue : p.orders;
      const x = paddingX + (idx / (stats.timeline.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - (val / maxVal) * (height - 2 * paddingY);
      return { x, y, val, point: p };
    });

    // Generate smooth SVG path
    const pathD = points.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      const prev = arr[idx - 1];
      const cx = (prev.x + curr.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }, "");

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    const totalInPeriod = values.reduce((a, b) => a + b, 0);
    const avgInPeriod = Math.round(totalInPeriod / values.length);

    return {
      width,
      height,
      points,
      pathD,
      areaD,
      maxVal,
      totalInPeriod,
      avgInPeriod,
    };
  }, [stats?.timeline, chartMetric]);

  // Loading skeleton
  if (loading && !stats) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="h-8 w-64 bg-white/5 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#141414] border border-white/5 rounded-2xl p-5 h-36 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[#141414] border border-white/5 rounded-2xl h-80 animate-pulse" />
          <div className="bg-[#141414] border border-white/5 rounded-2xl h-80 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Dashboard Header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#2ecc71]/10 text-[#2ecc71]">
              <TrendingUp size={20} />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Executive Overview &amp; Analytics
            </h1>
          </div>
          <p className="text-white/40 text-xs mt-1">
            Real-time platform performance, trek bookings volume, financial margins &amp; operational metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => loadStats(true)}
            disabled={refreshing}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/orders"
            className="px-3.5 py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-black font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <ShoppingBag size={14} />
            <span>View Orders &amp; Batches</span>
          </Link>
        </div>
      </div>

      {/* ── Top Comparison Stat Cards ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Revenue */}
        <div className="bg-[#141414] border border-white/5 hover:border-white/15 rounded-2xl p-5 space-y-3 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Total Gross Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-[#2ecc71] flex items-center justify-center">
              <IndianRupee size={15} />
            </div>
          </div>

          <div>
            <div className="text-2xl font-black text-white">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              {stats.comparisons.revenue.changePercent >= 0 ? (
                <span className="text-emerald-400 font-bold flex items-center">
                  <ArrowUpRight size={14} />
                  +{stats.comparisons.revenue.changePercent}%
                </span>
              ) : (
                <span className="text-red-400 font-bold flex items-center">
                  <ArrowDownRight size={14} />
                  {stats.comparisons.revenue.changePercent}%
                </span>
              )}
              <span className="text-white/30 text-[11px]">vs prior month</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
            <span>This Month: ₹{stats.comparisons.revenue.current.toLocaleString("en-IN")}</span>
            <span className="text-emerald-400/80 font-mono">
              ₹{stats.totalCashDue > 0 ? `₹${stats.totalCashDue.toLocaleString("en-IN")} due` : "Fully Paid"}
            </span>
          </div>
        </div>

        {/* Card 2: Trek Bookings & Trekkers */}
        <div className="bg-[#141414] border border-white/5 hover:border-white/15 rounded-2xl p-5 space-y-3 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Trek Participants
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Mountain size={15} />
            </div>
          </div>

          <div>
            <div className="text-2xl font-black text-white">
              {stats.totalTrekkers}
              <span className="text-white/40 text-xs font-normal ml-1">travelers</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              {stats.comparisons.trekkers.changePercent >= 0 ? (
                <span className="text-emerald-400 font-bold flex items-center">
                  <ArrowUpRight size={14} />
                  +{stats.comparisons.trekkers.changePercent}%
                </span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center">
                  <ArrowDownRight size={14} />
                  {stats.comparisons.trekkers.changePercent}%
                </span>
              )}
              <span className="text-white/30 text-[11px]">in expeditions</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
            <span>Confirmed: {stats.confirmedOrders} bookings</span>
            <span className="text-blue-400 font-mono">{stats.totalOrders} total</span>
          </div>
        </div>

        {/* Card 3: Operating Net Profit */}
        <div className="bg-[#141414] border border-white/5 hover:border-white/15 rounded-2xl p-5 space-y-3 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Net Operating Profit
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp size={15} />
            </div>
          </div>

          <div>
            <div className={`text-2xl font-black ${stats.netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {stats.netProfit >= 0 ? "+" : ""}₹{stats.netProfit.toLocaleString("en-IN")}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-purple-400 font-bold">
                {stats.profitMargin}% margin
              </span>
              <span className="text-white/30 text-[11px]">after expenses</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
            <span>Expenses: ₹{stats.totalExpenses.toLocaleString("en-IN")}</span>
            <Link href="/admin/finance" className="text-purple-400 hover:underline">
              P&amp;L Details &rarr;
            </Link>
          </div>
        </div>

        {/* Card 4: Registered Users & Community */}
        <div className="bg-[#141414] border border-white/5 hover:border-white/15 rounded-2xl p-5 space-y-3 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Platform Users
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Users size={15} />
            </div>
          </div>

          <div>
            <div className="text-2xl font-black text-white">
              {stats.totalUsers.toLocaleString("en-IN")}
              <span className="text-white/40 text-xs font-normal ml-1">accounts</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-emerald-400 font-bold flex items-center">
                <CheckCircle2 size={13} className="mr-0.5" />
                {stats.activeVendors} active vendors
              </span>
              {stats.pendingVendors > 0 && (
                <span className="text-amber-400 font-bold">
                  ({stats.pendingVendors} pending)
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
            <span>Enquiries: {stats.totalEnquiries} leads</span>
            <Link href="/admin/users" className="text-amber-400 hover:underline">
              Manage &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ── Middle Row: 14-Day Trend Graph & Category Split ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Graph (8 cols): 14-Day Dynamic Area Chart */}
        <div className="lg:col-span-8 bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <span>14-Day Performance Trend</span>
                <span className="text-[10px] font-mono text-[#2ecc71] bg-[#2ecc71]/10 px-2 py-0.5 rounded-md">
                  Live
                </span>
              </h2>
              <p className="text-white/40 text-xs mt-0.5">
                Daily trajectory of {chartMetric === "revenue" ? "sales volume (INR)" : "booking orders count"}.
              </p>
            </div>

            {/* Toggle: Revenue vs Orders */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setChartMetric("revenue")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  chartMetric === "revenue"
                    ? "bg-[#2ecc71] text-black shadow-sm"
                    : "text-white/50 hover:text-white"
                }`}
              >
                Revenue (₹)
              </button>
              <button
                type="button"
                onClick={() => setChartMetric("orders")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  chartMetric === "orders"
                    ? "bg-[#2ecc71] text-black shadow-sm"
                    : "text-white/50 hover:text-white"
                }`}
              >
                Orders Count
              </button>
            </div>
          </div>

          {/* SVG Area Chart */}
          {chartData ? (
            <div className="space-y-2">
              <div className="relative w-full overflow-hidden bg-black/20 rounded-xl border border-white/5 pt-4 pb-2">
                <svg
                  viewBox={`0 0 ${chartData.width} ${chartData.height}`}
                  className="w-full h-44 overflow-visible"
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2ecc71" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#2ecc71" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guide Grid Lines */}
                  <line
                    x1="20"
                    y1={chartData.height - 25}
                    x2={chartData.width - 20}
                    y2={chartData.height - 25}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                  <line
                    x1="20"
                    y1={(chartData.height - 25) / 2}
                    x2={chartData.width - 20}
                    y2={(chartData.height - 25) / 2}
                    stroke="rgba(255,255,255,0.04)"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />

                  {/* Filled Area */}
                  <path d={chartData.areaD} fill="url(#areaGradient)" />

                  {/* Line Stroke */}
                  <path
                    d={chartData.pathD}
                    fill="none"
                    stroke="#2ecc71"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  {chartData.points.map((pt, i) => (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="3.5"
                        fill="#141414"
                        stroke="#2ecc71"
                        strokeWidth="2"
                        className="cursor-pointer hover:r-5 transition-all"
                        onMouseEnter={() => setHoveredPoint(pt.point)}
                      />
                    </g>
                  ))}
                </svg>

                {/* X-Axis Date Labels */}
                <div className="flex justify-between px-5 text-[10px] text-white/30 font-mono">
                  {stats.timeline
                    .filter((_, idx) => idx % 2 === 0 || idx === stats.timeline.length - 1)
                    .map((p) => (
                      <span key={p.date}>{p.label}</span>
                    ))}
                </div>
              </div>

              {/* Hover Tooltip / Stats Banner */}
              <div className="flex items-center justify-between text-xs bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                {hoveredPoint ? (
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white">📅 {hoveredPoint.label}</span>
                    <span className="text-[#2ecc71] font-bold">
                      ₹{hoveredPoint.revenue.toLocaleString("en-IN")}
                    </span>
                    <span className="text-white/40">
                      ({hoveredPoint.orders} order{hoveredPoint.orders > 1 ? "s" : ""}, {hoveredPoint.trekkers} trekkers)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-white/50">
                    <span>14-Day Total: <strong className="text-white">
                      {chartMetric === "revenue"
                        ? `₹${chartData.totalInPeriod.toLocaleString("en-IN")}`
                        : `${chartData.totalInPeriod} bookings`}
                    </strong></span>
                    <span>&bull;</span>
                    <span>Daily Avg: <strong className="text-[#2ecc71]">
                      {chartMetric === "revenue"
                        ? `₹${chartData.avgInPeriod.toLocaleString("en-IN")}/day`
                        : `${chartData.avgInPeriod} /day`}
                    </strong></span>
                  </div>
                )}
                <span className="text-[10px] text-white/30 hidden sm:inline">
                  Hover over points to inspect individual dates
                </span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-white/30 text-xs">No activity in period</div>
          )}
        </div>

        {/* Category Revenue Split (4 cols) */}
        <div className="lg:col-span-4 bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-white text-base">Category Distribution</h2>
            <p className="text-white/40 text-xs mt-0.5">Revenue breakdown by product type.</p>
          </div>

          <div className="space-y-4">
            {/* Visual Bar Distribution */}
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${stats.categorySplit.treksPercent}%` }}
                className="bg-[#2ecc71] h-full transition-all"
                title={`Treks: ${stats.categorySplit.treksPercent}%`}
              />
              <div
                style={{ width: `${stats.categorySplit.productsPercent}%` }}
                className="bg-amber-400 h-full transition-all"
                title={`Products: ${stats.categorySplit.productsPercent}%`}
              />
            </div>

            {/* Treks Legend */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2ecc71]" />
                <div>
                  <span className="font-bold text-white text-xs block">Trek Expeditions</span>
                  <span className="text-[10px] text-white/40">{stats.totalTrekkers} participants</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-white text-xs block">
                  ₹{stats.categorySplit.treksRevenue.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-[#2ecc71] font-bold">
                  {stats.categorySplit.treksPercent}%
                </span>
              </div>
            </div>

            {/* Products Legend */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div>
                  <span className="font-bold text-white text-xs block">Kokan Products &amp; Goods</span>
                  <span className="text-[10px] text-white/40">{stats.productsListed} listed items</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-white text-xs block">
                  ₹{stats.categorySplit.productsRevenue.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-amber-400 font-bold">
                  {stats.categorySplit.productsPercent}%
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/admin/reports"
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Full Financial Breakdown</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── Traveler Retention & Community Loyalty (New vs. Returning) ─── */}
      {stats.retention && (
        <div className="bg-[#141414] border border-white/5 hover:border-white/10 rounded-2xl p-5 space-y-4 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-[#2ecc71]">
                  <RotateCcw size={16} />
                </span>
                <h2 className="font-bold text-white text-base">
                  Traveler Retention: New vs. Returning Trekkers
                </h2>
                <span className="text-[10px] font-bold text-[#2ecc71] bg-[#2ecc71]/10 px-2.5 py-0.5 rounded-md border border-[#2ecc71]/20">
                  {stats.retention.repeatBookingRate}% Repeat Rate
                </span>
              </div>
              <p className="text-white/40 text-xs mt-0.5">
                Loyalty breakdown of {stats.retention.totalUniqueTrekkers} unique travelers who have explored with Visit Kokan.
              </p>
            </div>

            <Link
              href="/admin/marketing/messages"
              className="text-xs text-[#2ecc71] hover:underline flex items-center gap-1 font-semibold self-start sm:self-auto"
            >
              <span>Engage Alumni in Marketing Suite</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Dual Segment Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${stats.retention.returningTrekkersPercent}%` }}
                className="bg-gradient-to-r from-[#2ecc71] to-emerald-400 h-full transition-all flex items-center justify-end pr-2 text-[9px] font-black text-black"
                title={`Returning Alumni: ${stats.retention.returningTrekkersPercent}%`}
              >
                {stats.retention.returningTrekkersPercent > 12 && `${stats.retention.returningTrekkersPercent}%`}
              </div>
              <div
                style={{ width: `${stats.retention.newTrekkersPercent}%` }}
                className="bg-gradient-to-r from-sky-400 to-blue-500 h-full transition-all flex items-center justify-start pl-2 text-[9px] font-black text-black"
                title={`New Explorers: ${stats.retention.newTrekkersPercent}%`}
              >
                {stats.retention.newTrekkersPercent > 12 && `${stats.retention.newTrekkersPercent}%`}
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-white/40 px-1 flex-wrap gap-2">
              <span className="text-[#2ecc71] font-bold">
                ● Returning Trekkers: {stats.retention.returningTrekkersCount} alumni ({stats.retention.returningTrekkersPercent}%)
              </span>
              <span className="text-sky-400 font-bold">
                ● First-Time Trekkers: {stats.retention.newTrekkersCount} explorers ({stats.retention.newTrekkersPercent}%)
              </span>
            </div>
          </div>

          {/* 2 Comparative Column Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Returning Alumni Card */}
            <div className="bg-white/[0.02] border border-[#2ecc71]/20 rounded-xl p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2ecc71] flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>Returning Trekkers (Alumni)</span>
                </span>
                <span className="text-[10px] font-bold text-[#2ecc71] bg-[#2ecc71]/15 px-2 py-0.5 rounded-md">
                  High LTV Customer Base
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 bg-black/20 rounded-lg border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Trekkers</span>
                  <span className="text-white font-black text-sm">{stats.retention.returningTrekkersCount}</span>
                </div>
                <div className="p-2 bg-black/20 rounded-lg border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Revenue</span>
                  <span className="text-[#2ecc71] font-black text-sm">
                    ₹{stats.retention.revenueFromReturning.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-2 bg-black/20 rounded-lg border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Avg Spend</span>
                  <span className="text-white font-black text-sm">
                    ₹{stats.retention.avgSpendReturning.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-white/50 leading-relaxed">
                Participants who joined 2 or more expeditions. Retaining alumni drives profitable weekend departures with near-zero customer acquisition cost.
              </p>
            </div>

            {/* New First-Time Trekkers Card */}
            <div className="bg-white/[0.02] border border-sky-500/20 rounded-xl p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <Users size={13} />
                  <span>First-Time Trekkers (New Explorers)</span>
                </span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/15 px-2 py-0.5 rounded-md">
                  Top of Funnel Discovery
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 bg-black/20 rounded-lg border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Trekkers</span>
                  <span className="text-white font-black text-sm">{stats.retention.newTrekkersCount}</span>
                </div>
                <div className="p-2 bg-black/20 rounded-lg border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Revenue</span>
                  <span className="text-sky-400 font-black text-sm">
                    ₹{stats.retention.revenueFromNew.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-2 bg-black/20 rounded-lg border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Avg Spend</span>
                  <span className="text-white font-black text-sm">
                    ₹{stats.retention.avgSpendNew.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-white/50 leading-relaxed">
                First-time adventurers on their debut trek. Prime candidates for automated 30-day comeback discounts to convert them into repeat alumni.
              </p>
            </div>
          </div>

          {/* Top Loyal Trekkers Spotlight Mini-Roster */}
          {stats.retention.topReturningTrekkers.length > 0 && (
            <div className="pt-2 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-white/40 flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-400" />
                  <span>Top Returning Alumni Spotlight</span>
                </span>
                <span className="text-[10px] text-white/30 font-mono">
                  Most active expedition participants
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {stats.retention.topReturningTrekkers.map((alumnus) => {
                  const cleanPhone = alumnus.phone?.replace(/\D/g, "");
                  const fullPhone = cleanPhone?.length === 10 ? `91${cleanPhone}` : cleanPhone;
                  const waText = encodeURIComponent(
                    `Hi ${alumnus.name.split(" ")[0]}! 👋 Thank you for conquering ${alumnus.ordersCount} treks with Visit Kokan. As our VIP trekker, we have early batch slots open this weekend!`
                  );

                  return (
                    <div
                      key={alumnus.name + alumnus.phone}
                      className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-white truncate">{alumnus.name}</strong>
                          <span className="text-[9px] font-bold text-[#2ecc71] bg-[#2ecc71]/10 px-1 rounded font-mono">
                            {alumnus.ordersCount}x
                          </span>
                        </div>
                        <span className="text-[10px] text-white/40 truncate block mt-0.5">
                          ₹{alumnus.totalSpent.toLocaleString("en-IN")} · {alumnus.lastTrek}
                        </span>
                      </div>

                      {alumnus.phone && (
                        <a
                          href={`https://wa.me/${fullPhone}?text=${waText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] rounded-lg transition-colors shrink-0"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle size={13} />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Bottom Row: Top Treks Leaderboard & Recent Activity ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Top Expeditions Comparison (6 cols) */}
        <div className="lg:col-span-6 bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <Mountain size={16} className="text-[#2ecc71]" />
                <span>Top Treks by Demand</span>
              </h2>
              <p className="text-white/40 text-xs mt-0.5">Most popular trails by booking revenue.</p>
            </div>
            <Link
              href="/admin/treks"
              className="text-xs text-[#2ecc71] hover:underline flex items-center gap-1 font-medium"
            >
              <span>All Treks</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          {stats.topTreks.length === 0 ? (
            <div className="py-8 text-center text-white/30 text-xs">No trek bookings recorded yet</div>
          ) : (
            <div className="space-y-3">
              {stats.topTreks.map((t, idx) => {
                const maxRev = stats.topTreks[0]?.revenue || 1;
                const pct = Math.round((t.revenue / maxRev) * 100);

                return (
                  <div key={t.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-2">
                        <span className="text-[10px] font-mono text-white/30">#{idx + 1}</span>
                        <span className="truncate max-w-[200px]">{t.name}</span>
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-white/40 text-[11px] font-mono">
                          {t.trekkers} trekkers
                        </span>
                        <strong className="text-white font-mono">
                          ₹{t.revenue.toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>
                    {/* Relative Bar */}
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="bg-gradient-to-r from-[#2ecc71] to-emerald-400 h-full rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Platform Activity (6 cols) */}
        <div className="lg:col-span-6 bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <Clock size={16} className="text-white/40" />
                <span>Live Activity Stream</span>
              </h2>
              <p className="text-white/40 text-xs mt-0.5">Recent orders, registrations &amp; reviews.</p>
            </div>
            <span className="text-[10px] text-white/40 font-mono">Automated Feed</span>
          </div>

          {activity.length === 0 ? (
            <div className="py-8 text-center text-white/30 text-xs">No recent activity</div>
          ) : (
            <div className="space-y-2">
              {activity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 transition-all text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white truncate">{item.action}</div>
                    <div className="text-white/40 text-[11px] truncate mt-0.5">{item.name}</div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0 ml-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${statusBadge(item.status)}`}>
                      {item.status}
                    </span>
                    <span className="text-white/30 font-mono text-[10px]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Growth Action Shortcuts Strip ───────────────── */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-white/60">
          <Sparkles size={15} className="text-[#2ecc71]" />
          <span className="font-bold text-white">Quick Shortcuts:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/orders"
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag size={13} />
            <span>Trip Batches</span>
          </Link>

          <Link
            href="/admin/marketing/messages"
            className="px-3 py-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] rounded-xl font-semibold transition-colors flex items-center gap-1.5"
          >
            <Send size={13} />
            <span>Send Trek Messages</span>
          </Link>

          <Link
            href="/admin/marketing/content-calendar"
            className="px-3 py-1.5 bg-pink-500/15 hover:bg-pink-500/25 text-pink-400 rounded-xl font-semibold transition-colors flex items-center gap-1.5"
          >
            <CalendarDays size={13} />
            <span>Content Calendar</span>
          </Link>

          <Link
            href="/admin/coupons"
            className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 rounded-xl font-semibold transition-colors flex items-center gap-1.5"
          >
            <Tag size={13} />
            <span>Create Coupon</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

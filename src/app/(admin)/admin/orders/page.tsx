"use client";

import { useEffect, useState, useMemo } from "react";
import { Order, OrderStatus } from "@/types/order";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
  Users,
  Calendar,
  MapPin,
  Utensils,
  Copy,
  Printer,
  Plus,
  Phone,
  Mail,
  MessageCircle,
  Check,
  Loader2,
  Filter,
  Compass,
  AlertCircle,
  Layers,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: "pending", label: "Pending", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  { value: "pending_verification", label: "Pending Verification", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { value: "confirmed", label: "Confirmed", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { value: "out_for_delivery", label: "Out for Delivery", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  { value: "delivered", label: "Delivered", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  { value: "cancelled", label: "Cancelled", color: "text-red-400 bg-red-500/10 border-red-500/20" },
];

const statusIcon: Partial<Record<OrderStatus, JSX.Element>> = {
  pending: <Clock className="w-3.5 h-3.5" />,
  pending_verification: <Clock className="w-3.5 h-3.5" />,
  confirmed: <CheckCircle className="w-3.5 h-3.5" />,
  out_for_delivery: <Truck className="w-3.5 h-3.5" />,
  delivered: <CheckCircle className="w-3.5 h-3.5" />,
  cancelled: <X className="w-3.5 h-3.5" />,
};

type ViewMode = "orders" | "batches";
type SortOption =
  | "newest"
  | "oldest"
  | "trek_name_asc"
  | "trek_name_desc"
  | "trek_date_asc"
  | "trek_date_desc"
  | "persons_desc"
  | "amount_desc"
  | "amount_asc";

interface TripBatchGroup {
  batchKey: string;
  trekName: string;
  trekDate: string;
  batchName: string;
  orders: Order[];
  totalTrekkers: number;
  totalAmount: number;
  totalCashDue: number;
  totalAdvancePaid: number;
  vegCount: number;
  nonVegCount: number;
  pickupLocations: Record<string, number>;
  whatsappGroupLink?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("orders");
  const [statusTab, setStatusTab] = useState<"all" | OrderStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "trek" | "product">("all");
  const [selectedTrek, setSelectedTrek] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Multi-selection state for batch assignment
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Batch Creation / Assignment Modal State
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [newBatchName, setNewBatchName] = useState("");
  const [newBatchDate, setNewBatchDate] = useState("");
  const [newBatchTrek, setNewBatchTrek] = useState("");
  const [newBatchWhatsapp, setNewBatchWhatsapp] = useState("");
  const [assigningBatch, setAssigningBatch] = useState(false);

  // Manifest View Modal for a Specific Batch
  const [manifestBatch, setManifestBatch] = useState<TripBatchGroup | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Status update failed");
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  // Distinct Trek names from all existing orders
  const distinctTreks = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      if (o.orderType === "trek" && o.trekName) {
        set.add(o.trekName);
      }
    });
    return Array.from(set).sort();
  }, [orders]);

  // Distinct batch names from all existing orders
  const distinctBatches = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      if (o.batchName) set.add(o.batchName);
    });
    return Array.from(set).sort();
  }, [orders]);

  // Handle assigning batch to selected orders or a single order
  const handleAssignBatch = async (
    targetOrderIds: string[],
    batchName: string,
    trekDate?: string,
    whatsappGroupLink?: string
  ) => {
    if (targetOrderIds.length === 0) {
      toast.error("Please select at least one booking");
      return;
    }
    setAssigningBatch(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds: targetOrderIds,
          batchName,
          ...(trekDate ? { trekDate } : {}),
          ...(whatsappGroupLink ? { whatsappGroupLink } : {}),
        }),
      });
      if (!res.ok) throw new Error("Batch update failed");
      const data = await res.json();

      setOrders((prev) =>
        prev.map((o) =>
          targetOrderIds.includes(o.id)
            ? {
                ...o,
                batchName,
                ...(trekDate ? { trekDate } : {}),
                ...(whatsappGroupLink ? { whatsappGroupLink } : {}),
              }
            : o
        )
      );

      toast.success(
        `Successfully assigned ${data.updatedCount || targetOrderIds.length} booking(s) to "${batchName}"`
      );
      setSelectedOrderIds([]);
      setBatchModalOpen(false);
      setNewBatchName("");
      setNewBatchDate("");
      setNewBatchWhatsapp("");
    } catch {
      toast.error("Failed to assign batch");
    } finally {
      setAssigningBatch(false);
    }
  };

  // Filter & Sort Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status filter
      if (statusTab !== "all" && o.status !== statusTab) return false;

      // Type filter
      if (typeFilter !== "all" && o.orderType !== typeFilter) return false;

      // Trek filter
      if (selectedTrek !== "all" && o.trekName !== selectedTrek) return false;

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = o.userName?.toLowerCase().includes(q);
        const matchesEmail = o.userEmail?.toLowerCase().includes(q);
        const matchesTrek = o.trekName?.toLowerCase().includes(q);
        const matchesId = o.id?.toLowerCase().includes(q);
        const matchesBatch = o.batchName?.toLowerCase().includes(q);
        const matchesPhone = o.userPhone?.toLowerCase().includes(q);
        const matchesPersons = o.persons?.some((p) => p.name?.toLowerCase().includes(q));

        if (
          !matchesName &&
          !matchesEmail &&
          !matchesTrek &&
          !matchesId &&
          !matchesBatch &&
          !matchesPhone &&
          !matchesPersons
        ) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusTab, typeFilter, selectedTrek, search]);

  const sortedOrders = useMemo(() => {
    const list = [...filteredOrders];
    list.sort((a, b) => {
      switch (sortBy) {
        case "trek_name_asc":
          return (a.trekName || "").localeCompare(b.trekName || "");
        case "trek_name_desc":
          return (b.trekName || "").localeCompare(a.trekName || "");
        case "trek_date_asc":
          return (a.trekDate || "9999").localeCompare(b.trekDate || "9999");
        case "trek_date_desc":
          return (b.trekDate || "0000").localeCompare(a.trekDate || "0000");
        case "persons_desc":
          return (b.persons?.length || 0) - (a.persons?.length || 0);
        case "amount_desc":
          return b.totalAmount - a.totalAmount;
        case "amount_asc":
          return a.totalAmount - b.totalAmount;
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return list;
  }, [filteredOrders, sortBy]);

  // Group Trek Bookings into Trip Batches
  const tripBatches = useMemo(() => {
    const groups: Record<string, TripBatchGroup> = {};

    orders
      .filter((o) => o.orderType === "trek")
      .forEach((order) => {
        const trekTitle = order.trekName || "Unnamed Trek";
        const dateKey = order.trekDate || "Unscheduled Date";
        const batchTag = order.batchName || "Standard Batch";
        const key = `${trekTitle}___${dateKey}___${batchTag}`;

        if (!groups[key]) {
          groups[key] = {
            batchKey: key,
            trekName: trekTitle,
            trekDate: dateKey,
            batchName: batchTag,
            orders: [],
            totalTrekkers: 0,
            totalAmount: 0,
            totalCashDue: 0,
            totalAdvancePaid: 0,
            vegCount: 0,
            nonVegCount: 0,
            pickupLocations: {},
            whatsappGroupLink: order.whatsappGroupLink || undefined,
          };
        }

        const g = groups[key];
        g.orders.push(order);
        const personCount = Array.isArray(order.persons) && order.persons.length > 0 ? order.persons.length : 1;
        g.totalTrekkers += personCount;
        g.totalAmount += order.totalAmount || 0;
        g.totalCashDue += order.remainingCash || (order.paymentType === "offline" ? order.totalAmount : 0);
        g.totalAdvancePaid += order.advancePaid || (order.paymentType !== "offline" ? order.totalAmount : 0);

        if (order.persons && Array.isArray(order.persons)) {
          order.persons.forEach((p) => {
            if (p.foodPreference === "non-veg") g.nonVegCount++;
            else g.vegCount++;
          });
        }

        const pickup = order.pickupLocation || "Standard Basepoint";
        g.pickupLocations[pickup] = (g.pickupLocations[pickup] || 0) + personCount;

        if (order.whatsappGroupLink && !g.whatsappGroupLink) {
          g.whatsappGroupLink = order.whatsappGroupLink;
        }
      });

    const result = Object.values(groups);
    // Sort batches by upcoming date
    result.sort((a, b) => a.trekDate.localeCompare(b.trekDate));
    return result;
  }, [orders]);

  // Generate clean WhatsApp Roster text for copy
  const copyWhatsAppRoster = (b: TripBatchGroup) => {
    let text = `📋 *VISIT KOKAN — OFFICIAL TRIP ROSTER*\n`;
    text += `🧗 *Trek:* ${b.trekName}\n`;
    text += `📅 *Date:* ${b.trekDate}\n`;
    text += `🏷️ *Batch:* ${b.batchName}\n`;
    text += `👥 *Total Confirmed Trekkers:* ${b.totalTrekkers}\n`;
    text += `🥗 *Meals:* ${b.vegCount} Veg | ${b.nonVegCount} Non-Veg\n`;
    text += `------------------------------------\n\n`;

    let counter = 1;
    b.orders.forEach((order) => {
      const orderLeader = order.userName || "Traveler";
      const phone = order.userPhone || "N/A";
      const pickup = order.pickupLocation || "Basepoint";
      const cashDue = order.remainingCash || (order.paymentType === "offline" ? order.totalAmount : 0);

      text += `*Booking #${order.id.slice(0, 6)}* (${orderLeader} - ${phone})\n`;
      text += `📍 Pickup: ${pickup}\n`;
      if (cashDue > 0) {
        text += `💵 Cash Due: ₹${cashDue.toLocaleString("en-IN")}\n`;
      } else {
        text += `✅ Payment: Verified / Paid Online\n`;
      }

      if (order.persons && order.persons.length > 0) {
        order.persons.forEach((p) => {
          text += `  ${counter++}. ${p.name || orderLeader} (${p.age || "?"}y, ${p.gender || "-"}, ${p.foodPreference || "Veg"})\n`;
        });
      } else {
        text += `  ${counter++}. ${orderLeader} (1 person)\n`;
      }
      text += `\n`;
    });

    if (b.whatsappGroupLink) {
      text += `📲 *Private Batch Group:* ${b.whatsappGroupLink}\n`;
    }

    navigator.clipboard.writeText(text);
    toast.success("Batch manifest copied! Ready to paste into WhatsApp.");
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  };

  // Status Counts
  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s.value] = orders.filter((o) => o.status === s.value).length;
    return acc;
  }, {} as Record<OrderStatus, number>);

  const trekOrdersCount = orders.filter((o) => o.orderType === "trek").length;
  const totalTrekkersSum = orders
    .filter((o) => o.orderType === "trek")
    .reduce((sum, o) => sum + (o.persons?.length || 1), 0);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* ── Top Header & Tab Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Orders &amp; Trip Batches</h1>
          <p className="text-white/40 text-xs sm:text-sm mt-0.5">
            Manage all platform bookings, sort by trek, and organize travelers into trip batches &amp; rosters.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("orders")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "orders" ? "bg-[#2ecc71] text-black shadow-xs font-bold" : "text-white/60 hover:text-white"
            }`}
          >
            <Package size={14} />
            <span>All Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("batches")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "batches" ? "bg-[#2ecc71] text-black shadow-xs font-bold" : "text-white/60 hover:text-white"
            }`}
          >
            <Users size={14} />
            <span>Trek Trip Batches ({tripBatches.length})</span>
          </button>
        </div>
      </div>

      {/* ── Metric Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-white/40 text-xs mb-1">
            <span>Total Orders</span>
            <Package size={14} />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{orders.length}</div>
          <div className="text-[11px] text-white/30 mt-0.5">{orders.length - trekOrdersCount} Products · {trekOrdersCount} Treks</div>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-emerald-400 text-xs mb-1">
            <span>Total Trekkers</span>
            <Users size={14} />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{totalTrekkersSum}</div>
          <div className="text-[11px] text-emerald-400/70 mt-0.5">Across {trekOrdersCount} trek booking(s)</div>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-blue-400 text-xs mb-1">
            <span>Active Trip Batches</span>
            <Compass size={14} />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{tripBatches.length}</div>
          <div className="text-[11px] text-blue-400/70 mt-0.5">{distinctTreks.length} Destinations/Forts</div>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-amber-400 text-xs mb-1">
            <span>Needs Verification</span>
            <AlertCircle size={14} />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{counts.pending_verification || 0}</div>
          <div className="text-[11px] text-amber-400/70 mt-0.5">Offline bookings to confirm</div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MODE 1: ALL ORDERS VIEW (WITH TREK SORTING & FILTERING)
         ══════════════════════════════════════════════════════════════ */}
      {viewMode === "orders" && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Trek Selector, Order Type, Sort */}
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by customer, email, trek name, phone, order ID..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]/40"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Trek Filter Dropdown */}
              <div className="relative min-w-[200px]">
                <select
                  value={selectedTrek}
                  onChange={(e) => setSelectedTrek(e.target.value)}
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-2 pr-8 text-xs text-white focus:outline-none focus:border-[#2ecc71]/40 cursor-pointer"
                >
                  <option value="all" className="bg-[#141414]">All Treks ({distinctTreks.length})</option>
                  {distinctTreks.map((t) => (
                    <option key={t} value={t} className="bg-[#141414]">
                      🧗 {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
              </div>

              {/* Order Type Toggle */}
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setTypeFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    typeFilter === "all" ? "bg-white/10 text-white font-bold" : "text-white/40 hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter("trek")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    typeFilter === "trek" ? "bg-[#2ecc71]/20 text-[#2ecc71] font-bold" : "text-white/40 hover:text-white"
                  }`}
                >
                  🧗 Treks
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter("product")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    typeFilter === "product" ? "bg-white/10 text-white font-bold" : "text-white/40 hover:text-white"
                  }`}
                >
                  📦 Products
                </button>
              </div>

              {/* Trek-wise Sorting Selector */}
              <div className="relative min-w-[190px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-2 pr-8 text-xs text-white font-medium focus:outline-none focus:border-[#2ecc71]/40 cursor-pointer"
                >
                  <option value="newest" className="bg-[#141414]">🕒 Newest Orders First</option>
                  <option value="oldest" className="bg-[#141414]">🕒 Oldest Orders First</option>
                  <option value="trek_name_asc" className="bg-[#141414]">🧗 Sort by Trek Name (A → Z)</option>
                  <option value="trek_name_desc" className="bg-[#141414]">🧗 Sort by Trek Name (Z → A)</option>
                  <option value="trek_date_asc" className="bg-[#141414]">📅 Trip Date (Upcoming First)</option>
                  <option value="trek_date_desc" className="bg-[#141414]">📅 Trip Date (Furthest)</option>
                  <option value="persons_desc" className="bg-[#141414]">👥 Most Trekkers First</option>
                  <option value="amount_desc" className="bg-[#141414]">💰 Highest Amount</option>
                </select>
                <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
              </div>
            </div>

            {/* Status Tabs Strip */}
            <div className="flex gap-1.5 flex-wrap pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setStatusTab("all")}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  statusTab === "all" ? "bg-white/15 text-white font-bold" : "text-white/40 hover:text-white"
                }`}
              >
                All ({orders.length})
              </button>
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatusTab(s.value)}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
                    statusTab === s.value ? "bg-white/15 text-white font-bold" : "text-white/40 hover:text-white"
                  }`}
                >
                  <span>{s.label}</span>
                  <span className="text-[10px] opacity-60">({counts[s.value] ?? 0})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Batch Assignment Bar (appears when 1 or more orders are selected) */}
          {selectedOrderIds.length > 0 && (
            <div className="bg-[#1d3527] border border-[#2ecc71]/40 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2ecc71] text-black font-black text-xs flex items-center justify-center">
                  {selectedOrderIds.length}
                </span>
                <span className="text-white text-xs font-semibold">
                  {selectedOrderIds.length} booking(s) selected
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const firstOrder = orders.find((o) => selectedOrderIds.includes(o.id));
                    setNewBatchTrek(firstOrder?.trekName || "");
                    setNewBatchDate(firstOrder?.trekDate || "");
                    setBatchModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-[#2ecc71] text-black rounded-xl text-xs font-bold hover:bg-[#27ae60] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Users size={13} />
                  <span>Create / Assign Trip Batch</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOrderIds([])}
                  className="px-3 py-1.5 bg-white/10 text-white/70 hover:text-white rounded-xl text-xs transition-colors"
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}

          {/* Select all bar */}
          <div className="flex items-center justify-between px-1 text-xs text-white/40">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length}
                onChange={selectAllFiltered}
                className="rounded border-white/20 bg-white/5 text-[#2ecc71] focus:ring-0 cursor-pointer"
              />
              <span>Select all visible ({sortedOrders.length})</span>
            </label>
            <span>Showing {sortedOrders.length} order(s)</span>
          </div>

          {/* Orders Listing */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#141414] border border-white/5 rounded-2xl h-28 animate-pulse" />
              ))}
            </div>
          ) : sortedOrders.length === 0 ? (
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-12 text-center space-y-2">
              <Package className="w-10 h-10 text-white/10 mx-auto" />
              <p className="text-white/40 text-sm font-semibold">No matching orders found</p>
              <p className="text-white/20 text-xs">Try adjusting your trek filter, search query, or status tab.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedOrders.map((order) => {
                const statusCfg = STATUS_OPTIONS.find((s) => s.value === order.status);
                const isSelected = selectedOrderIds.includes(order.id);
                const isTrek = order.orderType === "trek";

                return (
                  <div
                    key={order.id}
                    className={`bg-[#141414] border rounded-2xl p-4 sm:p-5 transition-all ${
                      isSelected ? "border-[#2ecc71]/60 bg-[#162119]" : "border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Selection checkbox */}
                      {isTrek && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOrder(order.id)}
                          className="mt-1 rounded border-white/20 bg-white/5 text-[#2ecc71] focus:ring-0 cursor-pointer"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        {/* Title Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-bold text-sm sm:text-base">
                              {isTrek ? `🧗 ${order.trekName}` : `📦 Product Order (${order.items?.length || 1} items)`}
                            </span>

                            {/* Batch Tag */}
                            {isTrek && (
                              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#2ecc71]/15 text-[#2ecc71] border border-[#2ecc71]/30">
                                {order.batchName || "Standard Batch"}
                              </span>
                            )}

                            {/* Status Tag */}
                            <span
                              className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                                statusCfg?.color
                              }`}
                            >
                              {statusIcon[order.status]} {statusCfg?.label}
                            </span>
                          </div>

                          {/* Quick Status Dropdown */}
                          <div className="relative self-start sm:self-auto">
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                              disabled={actionLoading === order.id}
                              className="appearance-none bg-white/5 border border-white/10 text-white/70 text-xs rounded-xl px-3 py-1.5 pr-7 focus:outline-none focus:border-[#2ecc71]/40 cursor-pointer disabled:opacity-50"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value} className="bg-[#141414]">
                                  {s.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
                          <span className="text-white/80 font-medium">{order.userName || "Guest"}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Mail size={12} /> {order.userEmail}
                          </span>
                          {order.userPhone && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Phone size={12} /> {order.userPhone}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span className="font-mono text-[11px]">ID: {order.id.slice(0, 8)}</span>
                        </div>

                        {/* Trek Specific Logistics: Dates, Persons, Pickups */}
                        {isTrek && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs">
                            <div>
                              <span className="text-white/30 block text-[10px] uppercase font-bold">Departure Date</span>
                              <span className="text-white/80 font-medium flex items-center gap-1 mt-0.5">
                                <Calendar size={12} className="text-[#2ecc71]" />
                                {order.trekDate || "Not Set"}
                              </span>
                            </div>

                            <div>
                              <span className="text-white/30 block text-[10px] uppercase font-bold">Trekkers Count</span>
                              <span className="text-white/80 font-medium flex items-center gap-1 mt-0.5">
                                <Users size={12} className="text-[#2ecc71]" />
                                {order.persons?.length || 1} Person(s)
                              </span>
                            </div>

                            <div>
                              <span className="text-white/30 block text-[10px] uppercase font-bold">Pickup Location</span>
                              <span className="text-white/80 font-medium truncate block mt-0.5">
                                {order.pickupLocation || "Standard Basepoint"}
                              </span>
                            </div>

                            <div>
                              <span className="text-white/30 block text-[10px] uppercase font-bold">Payment Status</span>
                              <span className="text-white/80 font-medium block mt-0.5">
                                {order.paymentType === "offline" ? (
                                  <span className="text-amber-400">💵 ₹{order.remainingCash || order.totalAmount} Due at Trek</span>
                                ) : (
                                  <span className="text-emerald-400">✅ Paid Online (₹{order.totalAmount})</span>
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Trekkers List Accordion (if multiple people) */}
                        {isTrek && order.persons && order.persons.length > 0 && (
                          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] text-white/30 font-semibold mr-1">Roster:</span>
                            {order.persons.map((p, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] bg-white/5 border border-white/10 text-white/70 px-2 py-0.5 rounded-md flex items-center gap-1"
                              >
                                <span>{p.name || `Person ${idx + 1}`}</span>
                                <span className="text-white/30">({p.age || "?"}y, {p.foodPreference || "Veg"})</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Assign / Change Batch Action */}
                        {isTrek && (
                          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-white/40 text-[11px]">Trip Batch:</span>
                              <select
                                value={order.batchName || ""}
                                onChange={(e) => handleAssignBatch([order.id], e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-[#2ecc71] font-semibold focus:outline-none cursor-pointer"
                              >
                                <option value="" className="bg-[#141414]">Assign to Batch...</option>
                                {distinctBatches.map((b) => (
                                  <option key={b} value={b} className="bg-[#141414]">
                                    {b}
                                  </option>
                                ))}
                                <option value="Batch 1 - Morning Departure" className="bg-[#141414]">+ Batch 1 - Morning Departure</option>
                                <option value="Batch 2 - Afternoon Departure" className="bg-[#141414]">+ Batch 2 - Afternoon Departure</option>
                              </select>
                            </div>

                            <span className="text-white/20 text-[11px]">
                              Booked {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODE 2: TREK TRIP BATCHES & ROSTER VIEW
         ══════════════════════════════════════════════════════════════ */}
      {viewMode === "batches" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#141414] border border-white/5 rounded-2xl p-4">
            <div>
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                <Compass className="text-[#2ecc71]" size={18} />
                <span>Trip Batches &amp; Passenger Manifests</span>
              </h2>
              <p className="text-white/40 text-xs mt-0.5">
                Every confirmed participant grouped by trip and batch, complete with food counts, emergency contacts &amp; pickup points.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setNewBatchTrek(distinctTreks[0] || "");
                setBatchModalOpen(true);
              }}
              className="px-4 py-2 bg-[#2ecc71] text-black font-bold text-xs rounded-xl hover:bg-[#27ae60] transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus size={14} />
              <span>Create New Trip Batch</span>
            </button>
          </div>

          {tripBatches.length === 0 ? (
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-12 text-center space-y-2">
              <Users className="w-10 h-10 text-white/10 mx-auto" />
              <p className="text-white/40 text-sm font-semibold">No Trek Batches Active</p>
              <p className="text-white/20 text-xs">When users book treks, they will be organized here by trip and departure date.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tripBatches.map((b) => (
                <div
                  key={b.batchKey}
                  className="bg-[#141414] border border-white/5 hover:border-white/15 rounded-2xl p-5 space-y-4 transition-all"
                >
                  {/* Batch Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2ecc71] bg-[#2ecc71]/10 px-2 py-0.5 rounded-md">
                        {b.batchName}
                      </span>
                      <h3 className="text-white font-bold text-base mt-1.5">
                        🧗 {b.trekName}
                      </h3>
                      <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                        <Calendar size={12} className="text-[#2ecc71]" />
                        <span>Departure Date: <strong className="text-white/80">{b.trekDate}</strong></span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-white">{b.totalTrekkers}</span>
                      <span className="text-white/40 text-xs block">Trekkers</span>
                    </div>
                  </div>

                  {/* Operational Logistics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Meal Preferences */}
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="text-white/40 block text-[10px] font-bold uppercase mb-1">
                        Meal Requirements
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-bold">🥗 {b.vegCount} Veg</span>
                        <span className="text-amber-400 font-bold">🍗 {b.nonVegCount} Non-Veg</span>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="text-white/40 block text-[10px] font-bold uppercase mb-1">
                        Cash to Collect
                      </span>
                      <div className="text-white font-bold">
                        {b.totalCashDue > 0 ? (
                          <span className="text-amber-400">₹{b.totalCashDue.toLocaleString("en-IN")} Due</span>
                        ) : (
                          <span className="text-emerald-400">All Paid Online</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pickup Points Summary */}
                  <div>
                    <span className="text-white/40 text-[10px] font-bold uppercase block mb-1.5">
                      Bus Pickup Distribution
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {Object.entries(b.pickupLocations).map(([loc, count]) => (
                        <span
                          key={loc}
                          className="text-[11px] bg-white/5 border border-white/10 text-white/80 px-2 py-0.5 rounded-lg flex items-center gap-1"
                        >
                          <MapPin size={11} className="text-[#2ecc71]" />
                          <span>{loc}</span>
                          <strong className="text-[#2ecc71]">({count})</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons: View Manifest, Copy WhatsApp List */}
                  <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setManifestBatch(b)}
                      className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Users size={13} />
                      <span>View Manifest ({b.totalTrekkers})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyWhatsAppRoster(b)}
                      title="Copy complete roster formatted for WhatsApp group"
                      className="py-2 px-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy size={13} />
                      <span>WhatsApp List</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: PASSENGER MANIFEST & PRINT ROSTER
         ══════════════════════════════════════════════════════════════ */}
      {manifestBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2ecc71] bg-[#2ecc71]/10 px-2 py-0.5 rounded-md">
                  {manifestBatch.batchName}
                </span>
                <h3 className="text-white text-lg font-bold mt-1">
                  🧗 {manifestBatch.trekName} — Passenger Manifest
                </h3>
                <p className="text-white/40 text-xs">
                  Date: {manifestBatch.trekDate} · {manifestBatch.totalTrekkers} Trekkers ({manifestBatch.vegCount} Veg, {manifestBatch.nonVegCount} Non-Veg)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 text-white/60 hover:text-white bg-white/5 rounded-xl transition-colors cursor-pointer"
                  title="Print Manifest"
                >
                  <Printer size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setManifestBatch(null)}
                  className="p-2 text-white/60 hover:text-white bg-white/5 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Manifest Table */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-white/5 text-white/40 uppercase font-mono text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Passenger Name</th>
                    <th className="py-2.5 px-3">Age / Gender</th>
                    <th className="py-2.5 px-3">Food</th>
                    <th className="py-2.5 px-3">Pickup Location</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Payment</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(() => {
                    let counter = 1;
                    return manifestBatch.orders.flatMap((order) => {
                      const persons = order.persons && order.persons.length > 0
                        ? order.persons
                        : [{ name: order.userName || "Traveler", age: undefined, gender: undefined, foodPreference: "veg" as const }];

                      return persons.map((p, idx) => (
                        <tr key={`${order.id}-${idx}`} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-3 font-mono text-white/30">{counter++}</td>
                          <td className="py-3 px-3 font-bold text-white">
                            {p.name || order.userName}
                            {idx === 0 && persons.length > 1 && (
                              <span className="block text-[10px] text-white/30 font-normal">Primary Booker</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-white/60">
                            {p.age ? `${p.age}y` : "?"} · {p.gender || "-"}
                          </td>
                          <td className="py-3 px-3 font-semibold">
                            {p.foodPreference === "non-veg" ? (
                              <span className="text-amber-400">🍗 Non-Veg</span>
                            ) : (
                              <span className="text-emerald-400">🥗 Veg</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-white/60 truncate max-w-[150px]">
                            {order.pickupLocation || "Basepoint"}
                          </td>
                          <td className="py-3 px-3">
                            <span className="block text-white/80">{order.userPhone || "-"}</span>
                            <span className="text-[10px] text-white/30 block truncate max-w-[120px]">{order.userEmail}</span>
                          </td>
                          <td className="py-3 px-3">
                            {order.paymentType === "offline" ? (
                              <span className="text-amber-400 font-semibold">₹{order.remainingCash || order.totalAmount} Due</span>
                            ) : (
                              <span className="text-emerald-400 font-semibold">Paid Online</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ));
                    });
                  })()}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
              <span className="text-xs text-white/40">
                Trip Manifest ready for bus coordinators &amp; trek leads.
              </span>
              <button
                type="button"
                onClick={() => copyWhatsAppRoster(manifestBatch)}
                className="px-4 py-2 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:bg-[#20bd5a] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Copy size={13} />
                <span>Copy WhatsApp Roster</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: CREATE / ASSIGN NEW TRIP BATCH
         ══════════════════════════════════════════════════════════════ */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <Users className="text-[#2ecc71]" size={18} />
                <span>Create / Assign Trip Batch</span>
              </h3>
              <button
                type="button"
                onClick={() => setBatchModalOpen(false)}
                className="text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-white/40 text-xs leading-relaxed">
              Organize selected travelers into a dedicated batch for their trip. They will be grouped together on the manifest.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-white/70 block mb-1 font-semibold">Trek Expedition</label>
                <input
                  value={newBatchTrek}
                  onChange={(e) => setNewBatchTrek(e.target.value)}
                  placeholder="e.g. Torna Fort Monsoon Trek"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]/40"
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-semibold">Trip / Batch Name</label>
                <input
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  placeholder="e.g. Batch 1 - Swargate Bus (5:00 AM)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]/40"
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-semibold">Departure Date</label>
                <input
                  type="date"
                  value={newBatchDate}
                  onChange={(e) => setNewBatchDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#2ecc71]/40"
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-semibold">WhatsApp Batch Group Link (Optional)</label>
                <input
                  value={newBatchWhatsapp}
                  onChange={(e) => setNewBatchWhatsapp(e.target.value)}
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]/40"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setBatchModalOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={assigningBatch || !newBatchName.trim()}
                onClick={() =>
                  handleAssignBatch(
                    selectedOrderIds,
                    newBatchName.trim(),
                    newBatchDate || undefined,
                    newBatchWhatsapp.trim() || undefined
                  )
                }
                className="px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-black rounded-xl text-xs font-bold disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {assigningBatch && <Loader2 size={13} className="animate-spin" />}
                <span>Assign to Batch</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

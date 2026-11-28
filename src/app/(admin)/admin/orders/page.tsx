"use client";

import { useEffect, useState, useMemo } from "react";
import { Order, OrderStatus } from "@/types/order";
import { Banner } from "@/types/banner";
import { FALLBACK_DESTINATION_IMAGE } from "@/lib/imageUtils";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  ChevronDown,
  Search,
  ArrowUpDown,
  Users,
  Calendar,
  MapPin,
  Copy,
  Printer,
  Plus,
  Phone,
  Mail,
  Loader2,
  Compass,
  AlertCircle,
  Layers,
  UserPlus,
  Trash2,
  UserMinus,
  Download,
  FileSpreadsheet,
  IndianRupee,
  Pencil,
  Receipt,
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  Tag,
  SlidersHorizontal,
  CheckSquare,
  Square,
  MessageCircle,
  CheckCheck,
  CheckCircle2,
  RotateCcw,
  Ticket,
  CalendarDays,
  Bus,
  Repeat,
  FileDown,
  Send,
  Megaphone,
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
  isClosed?: boolean;
  status?: "live" | "closed";
}

interface BatchExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  batchKey?: string;
  batchName?: string;
  trekName?: string;
  date: string;
}

const EXPENSE_CATEGORIES = [
  { value: "transport", label: "🚌 Bus & Transport" },
  { value: "food", label: "🍲 Food & Meals" },
  { value: "guide", label: "🧗 Guide & Trek Leader" },
  { value: "entry_fees", label: "🎟️ Forest / Fort Entry" },
  { value: "equipment", label: "⛺ Tents & Camps" },
  { value: "misc", label: "📦 Miscellaneous & Tolls" },
];

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

  // Standalone custom created batches
  const [customBatches, setCustomBatches] = useState<TripBatchGroup[]>([]);

  // Live vs Closed Batches Filter & Persistence State
  const [closedBatchKeys, setClosedBatchKeys] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("vk_closed_batch_keys");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [batchTabFilter, setBatchTabFilter] = useState<"live" | "closed" | "all">("live");

  // Batch Creation / Assignment Modal State
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [newBatchName, setNewBatchName] = useState("");
  const [newBatchDate, setNewBatchDate] = useState("");
  const [newBatchTrek, setNewBatchTrek] = useState("");
  const [newBatchWhatsapp, setNewBatchWhatsapp] = useState("");
  const [assigningBatch, setAssigningBatch] = useState(false);

  // Front Page Banner Promotion State (Create Batch Modal & Batch Cards)
  const [promoteToBanner, setPromoteToBanner] = useState(false);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerCtaType, setBannerCtaType] = useState<"trek" | "whatsapp" | "custom">("trek");
  const [bannerCtaText, setBannerCtaText] = useState("Book Seat Now");
  const [bannerCtaLink, setBannerCtaLink] = useState("/treks");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [bannerSeatsLeft, setBannerSeatsLeft] = useState("");
  const [trekCatalog, setTrekCatalog] = useState<Array<{ name: string; slug: string; images?: string[] }>>([]);
  const [batchBanners, setBatchBanners] = useState<Banner[]>([]);
  const [bannerToggleLoadingKey, setBannerToggleLoadingKey] = useState<string | null>(null);
  const [renamingBatchKey, setRenamingBatchKey] = useState<string | null>(null);
  const [renameBatchValue, setRenameBatchValue] = useState("");
  const [renamingBatchLoading, setRenamingBatchLoading] = useState(false);

  // Modal internal booking search & filters
  const [modalSearch, setModalSearch] = useState("");
  const [modalBookingFilter, setModalBookingFilter] = useState<"all" | "unassigned">("all");

  // Manifest View Modal for a Specific Batch
  const [manifestBatch, setManifestBatch] = useState<TripBatchGroup | null>(null);

  // ── Expenses Management State ───────────────────────────────────────────────
  const [expenses, setExpenses] = useState<BatchExpense[]>([]);
  const [expenseModalBatch, setExpenseModalBatch] = useState<TripBatchGroup | null>(null);
  const [newExpDesc, setNewExpDesc] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");
  const [newExpCategory, setNewExpCategory] = useState("transport");
  const [newExpDate, setNewExpDate] = useState("");
  const [expSubmitting, setExpSubmitting] = useState(false);

  // Helper to safely extract customer phone from all order schemas
  const getCustomerPhone = (o?: Order | null): string => {
    if (!o) return "";
    return o.userPhone || o.deliveryAddress?.phone || (o as any).phone || (o as any).contactPhone || "";
  };

  // ── Booking-wise Financials Customization State ──────────────────────────────
  const [financialsModalOrder, setFinancialsModalOrder] = useState<Order | null>(null);
  const [finDiscount, setFinDiscount] = useState<number>(0);
  const [finAdvancePaid, setFinAdvancePaid] = useState<number>(0);
  const [finRemainingCash, setFinRemainingCash] = useState<number>(0);
  const [finTotalAmount, setFinTotalAmount] = useState<number>(0);
  const [finUserPhone, setFinUserPhone] = useState<string>("");
  const [finCashCollected, setFinCashCollected] = useState<boolean>(false);
  const [finSaving, setFinSaving] = useState(false);

  // ── Batch Bulk Financials State (Multi-Select Names & Fill Data) ───────────
  const [bulkFinBatch, setBulkFinBatch] = useState<TripBatchGroup | null>(null);
  const [bulkFinSelectedOrderIds, setBulkFinSelectedOrderIds] = useState<string[]>([]);
  const [bulkFinSearch, setBulkFinSearch] = useState<string>("");
  const [bulkApplyDiscount, setBulkApplyDiscount] = useState<boolean>(false);
  const [bulkDiscountValue, setBulkDiscountValue] = useState<number>(0);
  const [bulkApplyTotal, setBulkApplyTotal] = useState<boolean>(false);
  const [bulkTotalValue, setBulkTotalValue] = useState<number>(0);
  const [bulkApplyPaid, setBulkApplyPaid] = useState<boolean>(false);
  const [bulkPaidValue, setBulkPaidValue] = useState<number>(0);
  const [bulkApplyRemaining, setBulkApplyRemaining] = useState<boolean>(false);
  const [bulkRemainingMode, setBulkRemainingMode] = useState<"auto" | "fixed">("auto");
  const [bulkRemainingValue, setBulkRemainingValue] = useState<number>(0);
  const [bulkApplyStatus, setBulkApplyStatus] = useState<boolean>(false);
  const [bulkStatusValue, setBulkStatusValue] = useState<OrderStatus>("confirmed");
  const [bulkApplyCashCollected, setBulkApplyCashCollected] = useState<boolean>(false);
  const [bulkCashCollectedValue, setBulkCashCollectedValue] = useState<boolean>(false);
  const [bulkFinSaving, setBulkFinSaving] = useState<boolean>(false);

  // ── WhatsApp Direct Dialog State ──────────────────────────────────────────
  const [whatsappModalOrder, setWhatsappModalOrder] = useState<Order | null>(null);
  const [whatsappTemplate, setWhatsappTemplate] = useState<"reminder" | "confirmation" | "group_invite" | "pickup" | "custom">("reminder");
  const [whatsappMessage, setWhatsappMessage] = useState<string>("");

  // ── Printable Voucher State ───────────────────────────────────────────────
  const [voucherModalOrder, setVoucherModalOrder] = useState<Order | null>(null);

  // ── Shift Batch Modal State ───────────────────────────────────────────────
  const [shiftBatchOrder, setShiftBatchOrder] = useState<Order | null>(null);
  const [shiftTargetBatchName, setShiftTargetBatchName] = useState<string>("");
  const [shiftTargetDate, setShiftTargetDate] = useState<string>("");
  const [shiftSaving, setShiftSaving] = useState<boolean>(false);

  // ── Weekend & Date Range Filter State ─────────────────────────────────────
  const [quickDateFilter, setQuickDateFilter] = useState<"all" | "this_weekend" | "next_weekend" | "this_month" | "custom">("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  // ── Manifest Pickup Stop Filter ───────────────────────────────────────────
  const [manifestPickupFilter, setManifestPickupFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
    fetchExpenses();
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

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch {
      setExpenses([]);
    }
  };

  const fetchBannersAndTreks = async () => {
    try {
      const [bRes, tRes] = await Promise.all([
        fetch("/api/banners?all=true"),
        fetch("/api/treks"),
      ]);
      if (bRes.ok) {
        const bData = await bRes.json();
        setBatchBanners(Array.isArray(bData) ? bData : []);
      }
      if (tRes.ok) {
        const tData = await tRes.json();
        setTrekCatalog(Array.isArray(tData) ? tData : []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchBannersAndTreks();
  }, []);

  const findTrekInfo = (trekName: string) => {
    const lower = (trekName || "").toLowerCase();
    return (
      trekCatalog.find((t) => t.name.toLowerCase() === lower) ||
      trekCatalog.find((t) => lower && t.name.toLowerCase().includes(lower)) ||
      null
    );
  };

  const buildDefaultCtaLink = (
    ctaType: "trek" | "whatsapp" | "custom",
    trekName: string,
    batchName: string,
    customUrl?: string
  ) => {
    if (ctaType === "whatsapp") {
      return `https://wa.me/918432587706?text=${encodeURIComponent(
        `Hello Visit Kokan! I want to join the "${batchName}" (${trekName || "Trek Batch"}). Please share seat availability!`
      )}`;
    }
    if (ctaType === "custom") {
      return customUrl || "/treks";
    }
    const matched = findTrekInfo(trekName);
    return matched?.slug ? `/treks/${matched.slug}` : "/treks";
  };

  const handleToggleBatchBanner = async (b: TripBatchGroup) => {
    const existing = batchBanners.find((bn) => bn.batchKey === b.batchKey);
    const isCurrentlyLive = Boolean(existing && existing.active);
    setBannerToggleLoadingKey(b.batchKey);

    try {
      if (isCurrentlyLive && existing) {
        const res = await fetch("/api/banners", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: existing.id, active: false }),
        });
        if (!res.ok) throw new Error("Failed to hide banner");
        setBatchBanners((prev) =>
          prev.map((bn) => (bn.id === existing.id ? { ...bn, active: false } : bn))
        );
        toast.success("Removed batch from Front Page Banner");
      } else {
        const matchedTrek = findTrekInfo(b.trekName);
        const formattedDate =
          b.trekDate && b.trekDate !== "Upcoming Date"
            ? new Date(b.trekDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
            : "Upcoming";
        const parsedTrekDate = b.trekDate && b.trekDate !== "Upcoming Date" ? new Date(b.trekDate) : null;
        const futureExpiresAt =
          parsedTrekDate &&
            !Number.isNaN(parsedTrekDate.getTime()) &&
            parsedTrekDate.getTime() >= Date.now() - 86_400_000
            ? new Date(parsedTrekDate.getTime() + 86_400_000).toISOString()
            : null;
        const payload = {
          batchKey: b.batchKey,
          title: existing?.title || `${b.trekName} — ${b.batchName}`,
          subtitle:
            existing?.subtitle ||
            `Join our verified Konkan batch departing ${formattedDate}. Limited group seats!`,
          ctaText: existing?.ctaText || "Book Seat Now",
          ctaLink:
            existing?.ctaLink ||
            (matchedTrek?.slug ? `/treks/${matchedTrek.slug}` : "/treks"),
          imageUrl:
            existing?.imageUrl ||
            matchedTrek?.images?.[0] ||
            FALLBACK_DESTINATION_IMAGE,
          badgeText: `UPCOMING BATCH · ${formattedDate.toUpperCase()}`,
          expiresAt: futureExpiresAt,
          active: true,
        };
        const res = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to publish banner");
        const saved = await res.json();
        setBatchBanners((prev) => {
          const rest = prev.filter((bn) => bn.batchKey !== b.batchKey);
          return [...rest, saved];
        });
        toast.success(`"${b.batchName}" is now LIVE on Front Page Banner!`);
      }
    } catch {
      toast.error("Could not update Front Page Banner");
    } finally {
      setBannerToggleLoadingKey(null);
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

  // ── Delete a single order / trek booking ───────────────────────────────────
  const handleDeleteOrder = async (orderId: string, label: string) => {
    if (!confirm(`Are you sure you want to delete ${label}? This cannot be undone.`)) return;
    setActionLoading(orderId + "-delete");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId));
      toast.success("Record deleted successfully");
    } catch {
      toast.error("Failed to delete record");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Bulk delete selected orders / bookings ─────────────────────────────────
  const handleBulkDelete = async () => {
    if (selectedOrderIds.length === 0) return;
    if (
      !confirm(
        `Are you sure you want to permanently delete all ${selectedOrderIds.length} selected record(s)? This cannot be undone.`
      )
    ) {
      return;
    }
    setAssigningBatch(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedOrderIds }),
      });
      if (!res.ok) throw new Error("Bulk delete failed");
      const data = await res.json();
      setOrders((prev) => prev.filter((o) => !selectedOrderIds.includes(o.id)));
      toast.success(`Deleted ${data.deletedCount || selectedOrderIds.length} record(s)`);
      setSelectedOrderIds([]);
    } catch {
      toast.error("Failed to delete selected records");
    } finally {
      setAssigningBatch(false);
    }
  };

  // ── Delete / dissolve a trip batch ─────────────────────────────────────────
  const handleDeleteBatch = async (batch: TripBatchGroup) => {
    const hasOrders = batch.orders.length > 0;
    const msg = hasOrders
      ? `Dissolve & delete batch "${batch.batchName}"? All ${batch.orders.length} booking(s) will be unassigned and returned to the unassigned bookings pool.`
      : `Delete empty batch "${batch.batchName}"?`;

    if (!confirm(msg)) return;

    try {
      if (hasOrders) {
        const orderIds = batch.orders.map((o) => o.id);
        const res = await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderIds,
            batchName: "",
          }),
        });
        if (!res.ok) throw new Error("Failed to unassign batch orders");
        setOrders((prev) =>
          prev.map((o) => (orderIds.includes(o.id) ? { ...o, batchName: "" } : o))
        );
      }

      setCustomBatches((prev) =>
        prev.filter((b) => b.batchKey !== batch.batchKey && b.batchName !== batch.batchName)
      );
      if (batchBanners.some((bn) => bn.batchKey === batch.batchKey)) {
        await fetch("/api/banners", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchKey: batch.batchKey }),
        }).catch(() => { });
        setBatchBanners((prev) => prev.filter((bn) => bn.batchKey !== batch.batchKey));
      }
      if (manifestBatch?.batchKey === batch.batchKey) {
        setManifestBatch(null);
      }
      toast.success(`Batch "${batch.batchName}" dissolved and removed`);
    } catch {
      toast.error("Failed to delete batch");
    }
  };

  // ── Rename a trip batch (orders, custom batch, and linked banner) ──────────
  const handleRenameBatch = async (batch: TripBatchGroup) => {
    const trimmedNewName = renameBatchValue.trim();
    if (!trimmedNewName) {
      toast.error("Batch name cannot be empty");
      return;
    }
    if (trimmedNewName === batch.batchName) {
      setRenamingBatchKey(null);
      return;
    }

    const parts = batch.batchKey.split("___");
    const newBatchKey =
      parts.length >= 3
        ? `${parts[0]}___${parts[1]}___${trimmedNewName}`
        : `${batch.trekName}___${batch.trekDate}___${trimmedNewName}`;

    setRenamingBatchLoading(true);
    try {
      if (batch.orders.length > 0) {
        const orderIds = batch.orders.map((o) => o.id);
        const res = await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderIds,
            batchName: trimmedNewName,
          }),
        });
        if (!res.ok) throw new Error("Failed to rename batch orders");
        setOrders((prev) =>
          prev.map((o) => (orderIds.includes(o.id) ? { ...o, batchName: trimmedNewName } : o))
        );
      }

      setCustomBatches((prev) =>
        prev.map((cb) =>
          cb.batchKey === batch.batchKey || cb.batchName === batch.batchName
            ? { ...cb, batchName: trimmedNewName, batchKey: newBatchKey }
            : cb
        )
      );

      setClosedBatchKeys((prev) => {
        if (!prev.includes(batch.batchKey)) return prev;
        const updated = prev.map((k) => (k === batch.batchKey ? newBatchKey : k));
        if (typeof window !== "undefined") {
          localStorage.setItem("vk_closed_batch_keys", JSON.stringify(updated));
        }
        return updated;
      });

      const linkedBanner = batchBanners.find((bn) => bn.batchKey === batch.batchKey);
      if (linkedBanner) {
        const updatedTitle = linkedBanner.title?.includes(batch.batchName)
          ? linkedBanner.title.replace(batch.batchName, trimmedNewName)
          : `${batch.trekName} — ${trimmedNewName}`;
        const bannerRes = await fetch("/api/banners", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: linkedBanner.id,
            batchKey: newBatchKey,
            title: updatedTitle,
          }),
        });
        if (bannerRes.ok) {
          setBatchBanners((prev) =>
            prev.map((bn) =>
              bn.id === linkedBanner.id
                ? { ...bn, batchKey: newBatchKey, title: updatedTitle }
                : bn
            )
          );
        }
      }

      if (manifestBatch?.batchKey === batch.batchKey) {
        setManifestBatch({ ...manifestBatch, batchName: trimmedNewName, batchKey: newBatchKey });
      }

      setRenamingBatchKey(null);
      toast.success(`Batch renamed to "${trimmedNewName}"`);
    } catch {
      toast.error("Failed to rename batch");
    } finally {
      setRenamingBatchLoading(false);
    }
  };

  // ── Remove a single booking from a batch (unassign) ────────────────────────
  const handleRemoveOrderFromBatch = async (orderId: string) => {
    if (!confirm("Unassign this booking from the current batch?")) return;
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds: [orderId],
          batchName: "",
        }),
      });
      if (!res.ok) throw new Error("Failed to unassign booking");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, batchName: "" } : o))
      );
      setManifestBatch((prev) => {
        if (!prev) return null;
        const remaining = prev.orders.filter((o) => o.id !== orderId);
        return {
          ...prev,
          orders: remaining,
          totalTrekkers: remaining.reduce((s, o) => s + (o.persons?.length || 1), 0),
        };
      });
      toast.success("Booking unassigned from batch");
    } catch {
      toast.error("Failed to remove booking");
    }
  };

  // ── Expense Helpers & Handlers ─────────────────────────────────────────────
  const getBatchExpenses = (batchKey: string, batchName: string) => {
    return expenses.filter(
      (e) => e.batchKey === batchKey || (e.batchName && e.batchName === batchName)
    );
  };

  const getBatchTotalExpenses = (batchKey: string, batchName: string) => {
    return getBatchExpenses(batchKey, batchName).reduce((sum, e) => sum + (e.amount || 0), 0);
  };

  const getBatchNetProfit = (b: TripBatchGroup) => {
    const totalExp = getBatchTotalExpenses(b.batchKey, b.batchName);
    return b.totalAmount - totalExp;
  };

  const handleAddExpense = async (batch: TripBatchGroup) => {
    if (!newExpDesc.trim()) {
      toast.error("Please enter an expense description");
      return;
    }
    const amt = Number(newExpAmount);
    if (!amt || amt <= 0) {
      toast.error("Please enter a valid expense amount");
      return;
    }

    setExpSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: newExpDesc.trim(),
          amount: amt,
          category: newExpCategory,
          batchKey: batch.batchKey,
          batchName: batch.batchName,
          trekName: batch.trekName,
          date: newExpDate || new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to add expense");
      const savedExp: BatchExpense = await res.json();
      setExpenses((prev) => [savedExp, ...prev]);
      setNewExpDesc("");
      setNewExpAmount("");
      toast.success("Expense recorded for batch");
    } catch {
      toast.error("Failed to record expense");
    } finally {
      setExpSubmitting(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm("Are you sure you want to delete this expense record?")) return;
    try {
      const res = await fetch("/api/expenses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: expenseId }),
      });
      if (!res.ok) throw new Error("Failed to delete expense");
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
      toast.success("Expense record removed");
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  // ── Booking-wise Financials Customization (Discount, Paid, Remaining, Mobile) ─
  const openFinancialsModal = (o: Order) => {
    setFinancialsModalOrder(o);
    const disc = o.discount ?? o.couponDiscount ?? 0;
    const paid = o.advancePaid !== undefined ? o.advancePaid : (o.paymentType !== "offline" ? o.totalAmount : 0);
    const remaining = o.remainingCash !== undefined ? o.remainingCash : (o.paymentType === "offline" ? o.totalAmount : 0);
    setFinDiscount(disc);
    setFinAdvancePaid(paid);
    setFinRemainingCash(remaining);
    setFinTotalAmount(o.totalAmount || 0);
    setFinUserPhone(getCustomerPhone(o));
    setFinCashCollected(Boolean(o.cashCollected));
  };

  const handleSaveFinancials = async () => {
    if (!financialsModalOrder) return;
    setFinSaving(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: financialsModalOrder.id,
          totalAmount: Number(finTotalAmount),
          discount: Number(finDiscount),
          advancePaid: Number(finAdvancePaid),
          remainingCash: Number(finRemainingCash),
          userPhone: finUserPhone.trim(),
          cashCollected: Boolean(finCashCollected),
        }),
      });
      if (!res.ok) throw new Error("Financials update failed");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === financialsModalOrder.id
            ? {
              ...o,
              totalAmount: Number(finTotalAmount),
              discount: Number(finDiscount),
              advancePaid: Number(finAdvancePaid),
              remainingCash: Number(finRemainingCash),
              userPhone: finUserPhone.trim(),
              cashCollected: Boolean(finCashCollected),
            }
            : o
        )
      );

      if (manifestBatch) {
        setManifestBatch((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            orders: prev.orders.map((o) =>
              o.id === financialsModalOrder.id
                ? {
                  ...o,
                  totalAmount: Number(finTotalAmount),
                  discount: Number(finDiscount),
                  advancePaid: Number(finAdvancePaid),
                  remainingCash: Number(finRemainingCash),
                  userPhone: finUserPhone.trim(),
                  cashCollected: Boolean(finCashCollected),
                }
                : o
            ),
          };
        });
      }

      toast.success("Booking payment details updated");
      setFinancialsModalOrder(null);
    } catch {
      toast.error("Failed to update booking financials");
    } finally {
      setFinSaving(false);
    }
  };

  // ── Bulk Financials for Batch Bookings ─────────────────────────────────────
  const openBulkFinancialsModal = (b: TripBatchGroup) => {
    setBulkFinBatch(b);
    setBulkFinSelectedOrderIds(b.orders.map((o) => o.id));
    setBulkFinSearch("");
    setBulkApplyDiscount(false);
    setBulkDiscountValue(0);
    setBulkApplyTotal(false);
    setBulkTotalValue(0);
    setBulkApplyPaid(false);
    setBulkPaidValue(0);
    setBulkApplyRemaining(false);
    setBulkRemainingMode("auto");
    setBulkRemainingValue(0);
    setBulkApplyStatus(false);
    setBulkStatusValue("confirmed");
    setBulkApplyCashCollected(false);
    setBulkCashCollectedValue(false);
  };

  const toggleSelectAllBulkOrders = (orderList: Order[]) => {
    const listIds = orderList.map((o) => o.id);
    const allSelected = listIds.length > 0 && listIds.every((id) => bulkFinSelectedOrderIds.includes(id));
    if (allSelected) {
      setBulkFinSelectedOrderIds((prev) => prev.filter((id) => !listIds.includes(id)));
    } else {
      setBulkFinSelectedOrderIds((prev) => Array.from(new Set([...prev, ...listIds])));
    }
  };

  const toggleSelectBulkOrder = (orderId: string) => {
    setBulkFinSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleApplyBulkFinancials = async () => {
    if (!bulkFinBatch || bulkFinSelectedOrderIds.length === 0) {
      toast.error("Please select at least one booking name to update");
      return;
    }

    if (
      !bulkApplyDiscount &&
      !bulkApplyTotal &&
      !bulkApplyPaid &&
      !bulkApplyRemaining &&
      !bulkApplyStatus &&
      !bulkApplyCashCollected
    ) {
      toast.error("Please check at least one field to fill & update (e.g. Discount, Paid, or Remaining)");
      return;
    }

    setBulkFinSaving(true);
    try {
      const updatesList: Array<{ id: string;[key: string]: any }> = [];

      for (const orderId of bulkFinSelectedOrderIds) {
        const order = bulkFinBatch.orders.find((o) => o.id === orderId);
        if (!order) continue;

        const currentTotal = order.totalAmount || 0;
        const currentDiscount = order.discount ?? order.couponDiscount ?? 0;
        const currentPaid =
          order.advancePaid !== undefined
            ? order.advancePaid
            : order.paymentType !== "offline"
              ? currentTotal
              : 0;

        const newTotal = bulkApplyTotal ? Number(bulkTotalValue) : currentTotal;
        const newDiscount = bulkApplyDiscount ? Number(bulkDiscountValue) : currentDiscount;
        const newPaid = bulkApplyPaid ? Number(bulkPaidValue) : currentPaid;

        let newRemaining: number;
        if (bulkApplyRemaining) {
          if (bulkRemainingMode === "auto") {
            newRemaining = Math.max(0, newTotal - newDiscount - newPaid);
          } else {
            newRemaining = Number(bulkRemainingValue);
          }
        } else {
          newRemaining =
            order.remainingCash !== undefined
              ? order.remainingCash
              : order.paymentType === "offline"
                ? currentTotal
                : 0;
        }

        const updateObj: { id: string;[key: string]: any } = { id: orderId };
        if (bulkApplyTotal) updateObj.totalAmount = newTotal;
        if (bulkApplyDiscount) updateObj.discount = newDiscount;
        if (bulkApplyPaid) updateObj.advancePaid = newPaid;
        if (bulkApplyRemaining) updateObj.remainingCash = newRemaining;
        if (bulkApplyStatus) updateObj.status = bulkStatusValue;
        if (bulkApplyCashCollected) updateObj.cashCollected = bulkCashCollectedValue;

        updatesList.push(updateObj);
      }

      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ordersUpdates: updatesList }),
      });

      if (!res.ok) throw new Error("Bulk update failed");

      const updatesMap = new Map(updatesList.map((u) => [u.id, u]));

      setOrders((prev) =>
        prev.map((o) => {
          const u = updatesMap.get(o.id);
          if (!u) return o;
          return {
            ...o,
            ...(u.totalAmount !== undefined && { totalAmount: u.totalAmount }),
            ...(u.discount !== undefined && { discount: u.discount }),
            ...(u.advancePaid !== undefined && { advancePaid: u.advancePaid }),
            ...(u.remainingCash !== undefined && { remainingCash: u.remainingCash }),
            ...(u.status !== undefined && { status: u.status }),
            ...(u.cashCollected !== undefined && { cashCollected: u.cashCollected }),
          };
        })
      );

      if (manifestBatch) {
        setManifestBatch((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            orders: prev.orders.map((o) => {
              const u = updatesMap.get(o.id);
              if (!u) return o;
              return {
                ...o,
                ...(u.totalAmount !== undefined && { totalAmount: u.totalAmount }),
                ...(u.discount !== undefined && { discount: u.discount }),
                ...(u.advancePaid !== undefined && { advancePaid: u.advancePaid }),
                ...(u.remainingCash !== undefined && { remainingCash: u.remainingCash }),
                ...(u.status !== undefined && { status: u.status }),
                ...(u.cashCollected !== undefined && { cashCollected: u.cashCollected }),
              };
            }),
          };
        });
      }

      toast.success(`Updated financials for ${updatesList.length} booking(s) in ${bulkFinBatch.batchName}`);
      setBulkFinBatch(null);
    } catch {
      toast.error("Failed to update bulk financials");
    } finally {
      setBulkFinSaving(false);
    }
  };

  // ── Excel / CSV Report Download Utilities ──────────────────────────────────
  const downloadCsv = (filename: string, csvContent: string) => {
    // \uFEFF is UTF-8 Byte Order Mark (BOM) so Excel opens UTF-8 text perfectly
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  const escapeCsv = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`;

  // 1. Food Preference Report (Excel)
  const downloadFoodPreferenceReport = (b: TripBatchGroup) => {
    let csv = `VISIT KOKAN - TRIP BATCH FOOD PREFERENCE REPORT\n`;
    csv += `Trek Expedition:,${escapeCsv(b.trekName)},Trip Batch:,${escapeCsv(b.batchName)},Departure Date:,${escapeCsv(b.trekDate)}\n`;
    csv += `Total Confirmed Trekkers:,${b.totalTrekkers},Total Veg Meals:,${b.vegCount},Total Non-Veg Meals:,${b.nonVegCount}\n`;
    csv += `Report Generated:,${escapeCsv(new Date().toLocaleString("en-IN"))}\n\n`;

    csv += `#,"Passenger Name","Age","Gender","Food Preference","Pickup Location","Primary Booker","Mobile Number","Email Address","Booking ID"\n`;

    let counter = 1;
    b.orders.forEach((o) => {
      const persons = o.persons && o.persons.length > 0
        ? o.persons
        : [{ name: o.userName || "Traveler", age: undefined, gender: undefined, foodPreference: "veg" as const }];

      persons.forEach((p) => {
        csv += `${counter++},${escapeCsv(p.name || o.userName)},${p.age || "-"},${escapeCsv(p.gender || "-")},${escapeCsv(p.foodPreference === "non-veg" ? "Non-Veg" : "Veg")},${escapeCsv(o.pickupLocation || "Basepoint")},${escapeCsv(o.userName || "Customer")},${escapeCsv(getCustomerPhone(o) || "N/A")},${escapeCsv(o.userEmail || "N/A")},${escapeCsv(o.id.slice(0, 8))}\n`;
      });
    });

    csv += `\nSUMMARY MEAL REQUIREMENTS:\n`;
    csv += `Vegetarian (Veg) Meals Required:,${b.vegCount}\n`;
    csv += `Non-Vegetarian (Non-Veg) Meals Required:,${b.nonVegCount}\n`;
    csv += `Total Trekkers Count:,${b.totalTrekkers}\n`;

    const safeName = `Food_Preference_Report_${b.trekName}_${b.batchName}`.replace(/[^a-zA-Z0-9_\-]/g, "_");
    downloadCsv(`${safeName}.csv`, csv);
  };

  // 2. Contact & Trekkers Report (Excel)
  const downloadContactRosterReport = (b: TripBatchGroup) => {
    let csv = `VISIT KOKAN - BATCH CONTACT & TREKKERS ROSTER\n`;
    csv += `Trek Expedition:,${escapeCsv(b.trekName)},Trip Batch:,${escapeCsv(b.batchName)},Departure Date:,${escapeCsv(b.trekDate)}\n`;
    csv += `Total Confirmed Trekkers:,${b.totalTrekkers},Total Bookings:,${b.orders.length}\n`;
    csv += `Report Generated:,${escapeCsv(new Date().toLocaleString("en-IN"))}\n\n`;

    csv += `#,"Primary Booker Name","Contact Mobile No","Email Address","Trekkers Count","Pickup Location","Payment Status","Total Amount (INR)","Discount (INR)","Paid Amount (INR)","Balance Due (INR)","Booking ID"\n`;

    let counter = 1;
    let sumTotal = 0;
    let sumDiscount = 0;
    let sumPaid = 0;
    let sumDue = 0;

    b.orders.forEach((o) => {
      const trekkers = o.persons?.length || 1;
      const discount = o.discount ?? o.couponDiscount ?? 0;
      const paid = o.advancePaid !== undefined ? o.advancePaid : (o.paymentType !== "offline" ? o.totalAmount : 0);
      const due = o.remainingCash !== undefined ? o.remainingCash : (o.paymentType === "offline" ? o.totalAmount : 0);
      sumTotal += o.totalAmount || 0;
      sumDiscount += discount;
      sumPaid += paid;
      sumDue += due;

      csv += `${counter++},${escapeCsv(o.userName || "Guest")},${escapeCsv(getCustomerPhone(o) || "N/A")},${escapeCsv(o.userEmail || "N/A")},${trekkers},${escapeCsv(o.pickupLocation || "Basepoint")},${escapeCsv(o.status)},${o.totalAmount || 0},${discount},${paid},${due},${escapeCsv(o.id)}\n`;
    });

    csv += `\nTOTALS:,${escapeCsv(b.orders.length + " Bookings")},,,${b.totalTrekkers},,${sumTotal},${sumDiscount},${sumPaid},${sumDue}\n`;

    const safeName = `Contact_Report_${b.trekName}_${b.batchName}`.replace(/[^a-zA-Z0-9_\-]/g, "_");
    downloadCsv(`${safeName}.csv`, csv);
  };

  // 3. Profit & Loss Statement (Excel)
  const downloadProfitLossStatement = (b: TripBatchGroup) => {
    const batchExps = getBatchExpenses(b.batchKey, b.batchName);
    const totalExp = getBatchTotalExpenses(b.batchKey, b.batchName);
    const grossRev = b.totalAmount || 0;
    const netProfit = grossRev - totalExp;
    const margin = grossRev > 0 ? ((netProfit / grossRev) * 100).toFixed(2) : "0.00";

    let csv = `VISIT KOKAN - TRIP BATCH PROFIT & LOSS STATEMENT\n`;
    csv += `Trek Expedition:,${escapeCsv(b.trekName)}\n`;
    csv += `Trip Batch:,${escapeCsv(b.batchName)}\n`;
    csv += `Departure Date:,${escapeCsv(b.trekDate)}\n`;
    csv += `Total Confirmed Trekkers:,${b.totalTrekkers}\n`;
    csv += `Report Generated:,${escapeCsv(new Date().toLocaleString("en-IN"))}\n\n`;

    csv += `SECTION 1: REVENUE FROM CONFIRMED BOOKINGS\n`;
    csv += `#,"Booker Name","Contact Mobile","Trekkers","Booking Total (INR)","Discount (INR)","Paid Amount (INR)","Balance Cash Due (INR)","Booking ID"\n`;

    let totalDiscounts = 0;
    let totalPaid = 0;
    let totalDue = 0;

    b.orders.forEach((o, i) => {
      const discount = o.discount ?? o.couponDiscount ?? 0;
      const paid = o.advancePaid !== undefined ? o.advancePaid : (o.paymentType !== "offline" ? o.totalAmount : 0);
      const due = o.remainingCash !== undefined ? o.remainingCash : (o.paymentType === "offline" ? o.totalAmount : 0);
      totalDiscounts += discount;
      totalPaid += paid;
      totalDue += due;

      csv += `${i + 1},${escapeCsv(o.userName || "Traveler")},${escapeCsv(getCustomerPhone(o) || "N/A")},${o.persons?.length || 1},${o.totalAmount || 0},${discount},${paid},${due},${escapeCsv(o.id.slice(0, 8))}\n`;
    });

    csv += `SUBTOTAL REVENUE (A):,,,,,${grossRev},Discounts:,${totalDiscounts},Paid:,${totalPaid},Due:,${totalDue}\n\n`;

    csv += `SECTION 2: ITEMIZED BATCH EXPENSES\n`;
    csv += `#,"Expense Date","Category","Description","Amount (INR)"\n`;
    if (batchExps.length === 0) {
      csv += `1,-,General,No expenses logged yet for this batch,0\n`;
    } else {
      batchExps.forEach((e, i) => {
        csv += `${i + 1},${escapeCsv(e.date ? new Date(e.date).toLocaleDateString("en-IN") : "-")},${escapeCsv(e.category)},${escapeCsv(e.description)},${e.amount}\n`;
      });
    }
    csv += `SUBTOTAL EXPENSES (B):,,,,${totalExp}\n\n`;

    csv += `SECTION 3: PROFIT & LOSS SUMMARY\n`;
    csv += `Total Gross Revenue (A):,INR ${grossRev.toLocaleString("en-IN")}\n`;
    csv += `Total Batch Expenses (B):,INR ${totalExp.toLocaleString("en-IN")}\n`;
    csv += `NET ${netProfit >= 0 ? "PROFIT" : "LOSS"} (A - B):,INR ${netProfit.toLocaleString("en-IN")}\n`;
    csv += `Net Profit Margin:,${margin}%\n`;

    const safeName = `Profit_and_Loss_Statement_${b.trekName}_${b.batchName}`.replace(/[^a-zA-Z0-9_\-]/g, "_");
    downloadCsv(`${safeName}.csv`, csv);
  };

  // ── 4. Master Excel Export for All Orders (For Accounting & CA) ───────────
  const downloadMasterOrdersExport = () => {
    const listToExport = sortedOrders.length > 0 ? sortedOrders : orders;
    if (listToExport.length === 0) {
      toast.error("No orders to export");
      return;
    }

    let csv = `VISIT KOKAN - MASTER ORDERS & FINANCIALS EXPORT\n`;
    csv += `Export Generated:,${escapeCsv(new Date().toLocaleString("en-IN"))},Total Orders:,${listToExport.length}\n`;
    csv += `Filter Applied:,${escapeCsv(quickDateFilter.toUpperCase())},Status Filter:,${escapeCsv(statusTab)}\n\n`;

    csv += `#,"Order ID","Order Date","Type","Customer Name","Mobile Phone","Email Address","City / Address","Item / Trek Name","Trekkers","Pickup Stop","Departure Date","Batch Name","Base Amount (INR)","Discount (INR)","Paid Amount (INR)","Balance Due (INR)","Payment Mode","Status","Cash Collected","Razorpay ID"\n`;

    let sumTotal = 0;
    let sumDiscount = 0;
    let sumPaid = 0;
    let sumDue = 0;
    let sumTrekkers = 0;

    listToExport.forEach((o, idx) => {
      const discount = o.discount ?? o.couponDiscount ?? 0;
      const paid = o.advancePaid !== undefined ? o.advancePaid : (o.paymentType !== "offline" ? o.totalAmount : 0);
      const due = o.remainingCash !== undefined ? o.remainingCash : (o.paymentType === "offline" ? o.totalAmount : 0);
      const trekkers = o.orderType === "trek" ? (o.persons?.length || 1) : 1;
      const itemName = o.orderType === "trek" ? (o.trekName || "Trek") : (o.items?.map(it => `${it.name} (x${it.quantity})`).join("; ") || "Product");
      const city = o.deliveryAddress ? `${o.deliveryAddress.city}, ${o.deliveryAddress.state} - ${o.deliveryAddress.pincode}` : "N/A";
      const orderDate = o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "-";

      sumTotal += o.totalAmount || 0;
      sumDiscount += discount;
      sumPaid += paid;
      sumDue += due;
      sumTrekkers += trekkers;

      csv += `${idx + 1},${escapeCsv(o.id)},${escapeCsv(orderDate)},${escapeCsv(o.orderType)},${escapeCsv(o.userName || "Customer")},${escapeCsv(getCustomerPhone(o) || "N/A")},${escapeCsv(o.userEmail || "N/A")},${escapeCsv(city)},${escapeCsv(itemName)},${trekkers},${escapeCsv(o.pickupLocation || "-")},${escapeCsv(o.trekDate || "-")},${escapeCsv(o.batchName || "-")},${o.totalAmount || 0},${discount},${paid},${due},${escapeCsv(o.paymentType || "online")},${escapeCsv(o.status)},${escapeCsv(o.cashCollected ? "YES" : "NO")},${escapeCsv(o.razorpayPaymentId || o.razorpayOrderId || "-")}\n`;
    });

    csv += `\nTOTALS:,${escapeCsv(listToExport.length + " Orders")},,,,,,,${sumTrekkers} Trekkers,,,,${sumTotal},${sumDiscount},${sumPaid},${sumDue}\n`;

    const filename = `Visit_Kokan_Master_Orders_${new Date().toISOString().split("T")[0]}.csv`;
    downloadCsv(filename, csv);
  };

  // ── Weekend & Quick Date Helper ───────────────────────────────────────────
  const getUpcomingWeekendDates = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sunday, 6 is Saturday
    let diff = 6 - currentDay;
    if (currentDay === 0) {
      diff = -1; // Include yesterday (Sat) & today (Sun)
    } else if (diff === 0 && now.getHours() >= 22) {
      diff = 7;
    }
    const thisSaturday = new Date(now);
    thisSaturday.setDate(now.getDate() + diff);
    thisSaturday.setHours(0, 0, 0, 0);

    const thisSunday = new Date(thisSaturday);
    thisSunday.setDate(thisSaturday.getDate() + 1);
    thisSunday.setHours(23, 59, 59, 999);

    const nextSaturday = new Date(thisSaturday);
    nextSaturday.setDate(thisSaturday.getDate() + 7);
    nextSaturday.setHours(0, 0, 0, 0);

    const nextSunday = new Date(nextSaturday);
    nextSunday.setDate(nextSaturday.getDate() + 1);
    nextSunday.setHours(23, 59, 59, 999);

    return { thisSaturday, thisSunday, nextSaturday, nextSunday };
  };

  // ── WhatsApp Quick Template Generator ─────────────────────────────────────
  const openWhatsAppModal = (order: Order, defaultType: "reminder" | "confirmation" | "group_invite" | "pickup" = "reminder") => {
    setWhatsappModalOrder(order);
    setWhatsappTemplate(defaultType);

    const name = order.userName || "Traveler";
    const trek = order.trekName || "Expedition";
    const date = order.trekDate || "Upcoming Date";
    const pickup = order.pickupLocation || "Basepoint";
    const count = order.persons?.length || 1;
    const due = order.remainingCash !== undefined ? order.remainingCash : (order.paymentType === "offline" ? order.totalAmount : 0);

    let msg = "";
    if (defaultType === "reminder") {
      msg = `Namaskar ${name}! 🙏\nThis is Visit Kokan. A friendly reminder that a balance payment of ₹${due.toLocaleString("en-IN")} is pending for your booking for ${trek} (${date}).\nPlease clear it prior to departure. For questions, reply to this message.\n\nThank you!\nVisit Kokan Team 🌄`;
    } else if (defaultType === "confirmation") {
      msg = `Namaskar ${name}! 🧗\nYour booking for *${trek}* is confirmed!\n\n📅 Date: ${date}\n📍 Pickup: ${pickup}\n👥 Trekkers: ${count} Person(s)\n🔖 Booking ID: #${order.id.slice(0, 8)}\n\nGet ready for an amazing journey with Visit Kokan! 🌿`;
    } else if (defaultType === "group_invite") {
      msg = `Namaskar ${name}! 🎒\nPlease join the official traveler group for your upcoming trek *${trek}* (${order.batchName || "Batch"}):\n${order.whatsappGroupLink || "https://chat.whatsapp.com/..."}\n\nAll live pickup updates and trek lead instructions will be shared here! 📲`;
    } else if (defaultType === "pickup") {
      msg = `Namaskar ${name}! 🚌\nQuick reminder: Please report to your pickup point (*${pickup}*) 15 minutes before the departure time for ${trek} (${date}).\nRemember to carry 2L water and trekking shoes. See you soon! - Visit Kokan`;
    }
    setWhatsappMessage(msg);
  };

  const handleTemplateChange = (type: "reminder" | "confirmation" | "group_invite" | "pickup" | "custom") => {
    setWhatsappTemplate(type);
    if (!whatsappModalOrder || type === "custom") return;

    const name = whatsappModalOrder.userName || "Traveler";
    const trek = whatsappModalOrder.trekName || "Expedition";
    const date = whatsappModalOrder.trekDate || "Upcoming Date";
    const pickup = whatsappModalOrder.pickupLocation || "Basepoint";
    const count = whatsappModalOrder.persons?.length || 1;
    const due = whatsappModalOrder.remainingCash !== undefined ? whatsappModalOrder.remainingCash : (whatsappModalOrder.paymentType === "offline" ? whatsappModalOrder.totalAmount : 0);

    if (type === "reminder") {
      setWhatsappMessage(`Namaskar ${name}! 🙏\nThis is Visit Kokan. A friendly reminder that a balance payment of ₹${due.toLocaleString("en-IN")} is pending for your booking for ${trek} (${date}).\nPlease clear it prior to departure. For questions, reply to this message.\n\nThank you!\nVisit Kokan Team 🌄`);
    } else if (type === "confirmation") {
      setWhatsappMessage(`Namaskar ${name}! 🧗\nYour booking for *${trek}* is confirmed!\n\n📅 Date: ${date}\n📍 Pickup: ${pickup}\n👥 Trekkers: ${count} Person(s)\n🔖 Booking ID: #${whatsappModalOrder.id.slice(0, 8)}\n\nGet ready for an amazing journey with Visit Kokan! 🌿`);
    } else if (type === "group_invite") {
      setWhatsappMessage(`Namaskar ${name}! 🎒\nPlease join the official traveler group for your upcoming trek *${trek}* (${whatsappModalOrder.batchName || "Batch"}):\n${whatsappModalOrder.whatsappGroupLink || "https://chat.whatsapp.com/..."}\n\nAll live pickup updates and trek lead instructions will be shared here! 📲`);
    } else if (type === "pickup") {
      setWhatsappMessage(`Namaskar ${name}! 🚌\nQuick reminder: Please report to your pickup point (*${pickup}*) 15 minutes before the departure time for ${trek} (${date}).\nRemember to carry 2L water and trekking shoes. See you soon! - Visit Kokan`);
    }
  };

  const handleSendWhatsApp = () => {
    if (!whatsappModalOrder) return;
    const cleanPhone = getCustomerPhone(whatsappModalOrder).replace(/[^0-9]/g, "");
    if (!cleanPhone) {
      toast.error("Customer has no phone number recorded");
      return;
    }
    const targetPhone = cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone;
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
    toast.success("Opening WhatsApp chat...");
    setWhatsappModalOrder(null);
  };

  // ── 1-Click Quick Cash Settlement ──────────────────────────────────────────
  const handleQuickCollectCash = async (order: Order) => {
    const due = order.remainingCash !== undefined ? order.remainingCash : (order.paymentType === "offline" ? order.totalAmount : 0);
    if (due <= 0) {
      toast.error("This booking has zero pending balance");
      return;
    }
    if (!confirm(`Confirm collecting ₹${due.toLocaleString("en-IN")} cash in hand from ${order.userName || "Traveler"}? This marks the booking fully settled.`)) return;

    setActionLoading(order.id + "-collect");
    try {
      const currentPaid = order.advancePaid !== undefined ? order.advancePaid : (order.paymentType !== "offline" ? order.totalAmount : 0);
      const newAdvancePaid = currentPaid + due;
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          advancePaid: newAdvancePaid,
          remainingCash: 0,
          cashCollected: true,
          status: "confirmed",
        }),
      });
      if (!res.ok) throw new Error("Cash collection update failed");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
              ...o,
              advancePaid: newAdvancePaid,
              remainingCash: 0,
              cashCollected: true,
              status: "confirmed",
            }
            : o
        )
      );

      if (manifestBatch) {
        setManifestBatch((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            orders: prev.orders.map((o) =>
              o.id === order.id
                ? {
                  ...o,
                  advancePaid: newAdvancePaid,
                  remainingCash: 0,
                  cashCollected: true,
                  status: "confirmed",
                }
                : o
            ),
          };
        });
      }

      toast.success(`Collected ₹${due.toLocaleString("en-IN")} cash from ${order.userName || "Customer"}! Balance settled.`);
    } catch {
      toast.error("Failed to record cash collection");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Bus Pickup & Boarding Attendance ──────────────────────────────────────
  const handleToggleBoarding = async (orderId: string, currentBoarded: boolean | undefined) => {
    const newBoarded = !currentBoarded;
    const newBoardedAt = newBoarded ? new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          boarded: newBoarded,
          boardedAt: newBoardedAt,
        }),
      });
      if (!res.ok) throw new Error("Boarding update failed");

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, boarded: newBoarded, boardedAt: newBoardedAt } : o))
      );

      if (manifestBatch) {
        setManifestBatch((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            orders: prev.orders.map((o) =>
              o.id === orderId ? { ...o, boarded: newBoarded, boardedAt: newBoardedAt } : o
            ),
          };
        });
      }
      toast.success(newBoarded ? "Marked as Boarded ✓" : "Unmarked Boarded");
    } catch {
      toast.error("Failed to update boarding status");
    }
  };

  const handleMarkAllVisibleBoarded = async (visibleOrders: Order[]) => {
    const unboarded = visibleOrders.filter((o) => !o.boarded);
    if (unboarded.length === 0) {
      toast("All visible passengers already marked boarded", { icon: "ℹ️" });
      return;
    }
    const timestamp = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const orderUpdates = unboarded.map((o) => ({
      id: o.id,
      boarded: true,
      boardedAt: timestamp,
    }));

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ordersUpdates: orderUpdates }),
      });
      if (!res.ok) throw new Error("Failed to mark all boarded");

      const updateIds = new Set(unboarded.map((o) => o.id));
      setOrders((prev) =>
        prev.map((o) => (updateIds.has(o.id) ? { ...o, boarded: true, boardedAt: timestamp } : o))
      );
      if (manifestBatch) {
        setManifestBatch((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            orders: prev.orders.map((o) =>
              updateIds.has(o.id) ? { ...o, boarded: true, boardedAt: timestamp } : o
            ),
          };
        });
      }
      toast.success(`Marked ${unboarded.length} passengers as Boarded ✓`);
    } catch {
      toast.error("Failed to update attendance");
    }
  };

  // ── Reschedule / Shift Batch ──────────────────────────────────────────────
  const openShiftBatchModal = (order: Order) => {
    setShiftBatchOrder(order);
    setShiftTargetBatchName(order.batchName || "");
    setShiftTargetDate(order.trekDate || "");
  };

  const handleConfirmShiftBatch = async () => {
    if (!shiftBatchOrder) return;
    if (!shiftTargetBatchName.trim()) {
      toast.error("Please select or enter target batch name");
      return;
    }

    setShiftSaving(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: shiftBatchOrder.id,
          batchName: shiftTargetBatchName.trim(),
          trekDate: shiftTargetDate.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("Shift batch failed");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === shiftBatchOrder.id
            ? {
              ...o,
              batchName: shiftTargetBatchName.trim(),
              ...(shiftTargetDate.trim() && { trekDate: shiftTargetDate.trim() }),
            }
            : o
        )
      );

      if (manifestBatch) {
        setManifestBatch((prev) => {
          if (!prev) return null;
          // If moved out of current manifest batch, remove it
          if (manifestBatch.batchName !== shiftTargetBatchName.trim()) {
            const rem = prev.orders.filter((o) => o.id !== shiftBatchOrder.id);
            return {
              ...prev,
              orders: rem,
              totalTrekkers: rem.reduce((s, o) => s + (o.persons?.length || 1), 0),
            };
          }
          return prev;
        });
      }

      toast.success(`Transferred booking #${shiftBatchOrder.id.slice(0, 6)} to ${shiftTargetBatchName}`);
      setShiftBatchOrder(null);
    } catch {
      toast.error("Failed to reschedule batch");
    } finally {
      setShiftSaving(false);
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

  // Distinct batch names from all existing orders + custom created batches
  const distinctBatches = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      if (o.batchName) set.add(o.batchName);
    });
    customBatches.forEach((cb) => {
      if (cb.batchName) set.add(cb.batchName);
    });
    return Array.from(set).sort();
  }, [orders, customBatches]);

  // Handle assigning batch to selected orders or creating a batch template
  const handleAssignBatch = async (
    targetOrderIds: string[],
    batchName: string,
    trekDate?: string,
    whatsappGroupLink?: string
  ) => {
    const trimmedName = batchName.trim();
    if (!trimmedName) {
      toast.error("Please enter a batch name");
      return;
    }

    const resetBatchModalFields = () => {
      setBatchModalOpen(false);
      setNewBatchName("");
      setNewBatchDate("");
      setNewBatchWhatsapp("");
      setPromoteToBanner(false);
      setBannerTitle("");
      setBannerSubtitle("");
      setBannerCtaType("trek");
      setBannerCtaText("Book Seat Now");
      setBannerCtaLink("");
      setBannerImageUrl("");
      setBannerSeatsLeft("");
    };

    const publishBatchBannerFromModal = async (
      batchKey: string,
      resolvedTrekName: string,
      resolvedDate: string,
      batchName: string
    ) => {
      if (!promoteToBanner) return;
      const matchedTrek = findTrekInfo(resolvedTrekName);
      const formattedDate =
        resolvedDate && resolvedDate !== "Upcoming Date"
          ? new Date(resolvedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
          : "Upcoming";
      const parsedDate = resolvedDate && resolvedDate !== "Upcoming Date" ? new Date(resolvedDate) : null;
      const expiresAt =
        parsedDate && !isNaN(parsedDate.getTime())
          ? new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000).toISOString()
          : undefined;

      const payload = {
        batchKey,
        title: bannerTitle.trim() || `${resolvedTrekName} — ${batchName}`,
        subtitle:
          bannerSubtitle.trim() ||
          `Join our verified Konkan batch departing ${formattedDate}. Limited group seats!`,
        ctaText: bannerCtaText.trim() || (bannerCtaType === "whatsapp" ? "Enquire on WhatsApp" : "Book Seat Now"),
        ctaLink: bannerCtaLink.trim() || buildDefaultCtaLink(bannerCtaType, resolvedTrekName, batchName),
        imageUrl: bannerImageUrl.trim() || matchedTrek?.images?.[0] || FALLBACK_DESTINATION_IMAGE,
        badgeText: formattedDate !== "Upcoming" ? `Batch: ${formattedDate}` : "Upcoming Batch",
        seatsLeft: bannerSeatsLeft ? Number(bannerSeatsLeft) : undefined,
        expiresAt,
        active: true,
      };

      try {
        const bannerRes = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (bannerRes.ok) {
          const savedBanner = await bannerRes.json();
          setBatchBanners((prev) => [savedBanner, ...prev.filter((bn) => bn.batchKey !== batchKey)]);
          toast.success("Batch pushed live to Front Page Banner!");
        }
      } catch {
        toast.error("Batch saved, but failed to publish Front Page Banner");
      }
    };

    // If 0 bookings are selected, create empty batch definition in customBatches
    if (targetOrderIds.length === 0) {
      const resolvedTrekName = newBatchTrek || "Expedition Batch";
      const resolvedDate = trekDate || "Upcoming Date";
      const key = `${newBatchTrek || "General"}___${resolvedDate}___${trimmedName}`;
      setCustomBatches((prev) => {
        if (prev.some((b) => b.batchName === trimmedName)) return prev;
        return [
          ...prev,
          {
            batchKey: key,
            trekName: resolvedTrekName,
            trekDate: resolvedDate,
            batchName: trimmedName,
            orders: [],
            totalTrekkers: 0,
            totalAmount: 0,
            totalCashDue: 0,
            totalAdvancePaid: 0,
            vegCount: 0,
            nonVegCount: 0,
            pickupLocations: {},
            whatsappGroupLink: whatsappGroupLink || undefined,
          },
        ];
      });

      await publishBatchBannerFromModal(key, resolvedTrekName, resolvedDate, trimmedName);
      toast.success(`Trip Batch "${trimmedName}" created! You can now select bookings to assign to it.`);
      resetBatchModalFields();
      return;
    }

    setAssigningBatch(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds: targetOrderIds,
          batchName: trimmedName,
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
              batchName: trimmedName,
              ...(trekDate ? { trekDate } : {}),
              ...(whatsappGroupLink ? { whatsappGroupLink } : {}),
            }
            : o
        )
      );

      const firstMatchedOrder = orders.find((o) => targetOrderIds.includes(o.id));
      const resolvedTrekName =
        newBatchTrek || firstMatchedOrder?.items?.[0]?.name || "General";
      const resolvedDate = trekDate || firstMatchedOrder?.trekDate || "Upcoming Date";
      const batchKey = `${resolvedTrekName}___${resolvedDate}___${trimmedName}`;
      await publishBatchBannerFromModal(batchKey, resolvedTrekName, resolvedDate, trimmedName);

      toast.success(
        `Successfully assigned ${data.updatedCount || targetOrderIds.length} booking(s) to "${trimmedName}"`
      );
      setSelectedOrderIds([]);
      resetBatchModalFields();
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
        const matchesPhone = getCustomerPhone(o).toLowerCase().includes(q);
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

      // Quick Date Filter
      if (quickDateFilter !== "all") {
        const orderDateStr = o.trekDate || o.createdAt;
        const orderDate = orderDateStr ? new Date(orderDateStr) : null;
        if (!orderDate || isNaN(orderDate.getTime())) return false;

        if (quickDateFilter === "this_weekend") {
          const { thisSaturday, thisSunday } = getUpcomingWeekendDates();
          if (orderDate < thisSaturday || orderDate > thisSunday) return false;
        } else if (quickDateFilter === "next_weekend") {
          const { nextSaturday, nextSunday } = getUpcomingWeekendDates();
          if (orderDate < nextSaturday || orderDate > nextSunday) return false;
        } else if (quickDateFilter === "this_month") {
          const now = new Date();
          if (
            orderDate.getFullYear() !== now.getFullYear() ||
            orderDate.getMonth() !== now.getMonth()
          ) {
            return false;
          }
        } else if (quickDateFilter === "custom") {
          if (customStartDate) {
            const start = new Date(customStartDate);
            start.setHours(0, 0, 0, 0);
            if (orderDate < start) return false;
          }
          if (customEndDate) {
            const end = new Date(customEndDate);
            end.setHours(23, 59, 59, 999);
            if (orderDate > end) return false;
          }
        }
      }

      return true;
    });
  }, [orders, statusTab, typeFilter, selectedTrek, search, quickDateFilter, customStartDate, customEndDate]);

  const weekendCounts = useMemo(() => {
    const { thisSaturday, thisSunday, nextSaturday, nextSunday } = getUpcomingWeekendDates();
    const now = new Date();
    let thisWk = 0;
    let nextWk = 0;
    let thisMo = 0;

    orders.forEach((o) => {
      const dStr = o.trekDate || o.createdAt;
      const d = dStr ? new Date(dStr) : null;
      if (!d || isNaN(d.getTime())) return;

      if (d >= thisSaturday && d <= thisSunday) thisWk++;
      if (d >= nextSaturday && d <= nextSunday) nextWk++;
      if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) thisMo++;
    });

    return { thisWk, nextWk, thisMo };
  }, [orders]);

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

  // Group Trek Bookings into Trip Batches (including any created customBatches)
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
            isClosed: false,
            status: "live",
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

    // Mark batches as closed based on stored closedBatchKeys or orders having batchStatus === "closed"
    Object.values(groups).forEach((g) => {
      const isClosed =
        closedBatchKeys.includes(g.batchKey) ||
        (g.orders.length > 0 && g.orders.every((o) => o.batchStatus === "closed"));
      g.isClosed = isClosed;
      g.status = isClosed ? "closed" : "live";
    });

    // Merge in any custom batches that have 0 orders
    customBatches.forEach((cb) => {
      if (!groups[cb.batchKey]) {
        const isClosed = closedBatchKeys.includes(cb.batchKey);
        groups[cb.batchKey] = {
          ...cb,
          isClosed,
          status: isClosed ? "closed" : "live",
        };
      }
    });

    const result = Object.values(groups);
    // Sort batches by upcoming date
    result.sort((a, b) => a.trekDate.localeCompare(b.trekDate));
    return result;
  }, [orders, customBatches, closedBatchKeys]);

  const liveBatchesCount = useMemo(() => tripBatches.filter((b) => !b.isClosed).length, [tripBatches]);
  const closedBatchesCount = useMemo(() => tripBatches.filter((b) => b.isClosed).length, [tripBatches]);

  const displayedTripBatches = useMemo(() => {
    if (batchTabFilter === "live") return tripBatches.filter((b) => !b.isClosed);
    if (batchTabFilter === "closed") return tripBatches.filter((b) => b.isClosed);
    return tripBatches;
  }, [tripBatches, batchTabFilter]);

  const handleToggleBatchClosed = async (b: TripBatchGroup, shouldClose: boolean) => {
    const newStatus = shouldClose ? "closed" : "live";
    const targetOrderIds = b.orders.map((o) => o.id);

    setClosedBatchKeys((prev) => {
      const updated = shouldClose
        ? Array.from(new Set([...prev, b.batchKey]))
        : prev.filter((k) => k !== b.batchKey);
      if (typeof window !== "undefined") {
        localStorage.setItem("vk_closed_batch_keys", JSON.stringify(updated));
      }
      return updated;
    });

    setOrders((prev) =>
      prev.map((o) => (targetOrderIds.includes(o.id) ? { ...o, batchStatus: newStatus } : o))
    );

    if (shouldClose && batchBanners.some((bn) => bn.batchKey === b.batchKey && bn.active)) {
      fetch("/api/banners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchKey: b.batchKey, active: false }),
      })
        .then((res) => {
          if (res.ok) {
            setBatchBanners((prev) =>
              prev.map((bn) => (bn.batchKey === b.batchKey ? { ...bn, active: false } : bn))
            );
          }
        })
        .catch(() => { });
    }

    if (targetOrderIds.length > 0) {
      try {
        await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderIds: targetOrderIds,
            batchStatus: newStatus,
          }),
        });
      } catch (err) {
        console.error("Failed to persist batch status to server:", err);
      }
    }

    if (shouldClose) {
      toast.success(`Batch "${b.batchName}" marked as Closed / Completed ✅`);
    } else {
      toast.success(`Batch "${b.batchName}" reopened and set to Live 🟢`);
    }
  };

  // Bookings eligible to be chosen inside the batch assignment modal
  const modalEligibleOrders = useMemo(() => {
    return orders.filter((o) => {
      if (o.orderType !== "trek") return false;
      if (
        newBatchTrek.trim() &&
        newBatchTrek !== "all" &&
        o.trekName &&
        !o.trekName.toLowerCase().includes(newBatchTrek.trim().toLowerCase())
      ) {
        return false;
      }
      if (modalBookingFilter === "unassigned") {
        if (o.batchName && o.batchName !== "Standard Batch") return false;
      }
      if (modalSearch.trim()) {
        const q = modalSearch.toLowerCase();
        const matchesName = o.userName?.toLowerCase().includes(q);
        const matchesPhone = getCustomerPhone(o).toLowerCase().includes(q);
        const matchesTrek = o.trekName?.toLowerCase().includes(q);
        const matchesId = o.id?.toLowerCase().includes(q);
        return Boolean(matchesName || matchesPhone || matchesTrek || matchesId);
      }
      return true;
    });
  }, [orders, newBatchTrek, modalBookingFilter, modalSearch]);

  const selectedTrekkersCount = useMemo(() => {
    return orders
      .filter((o) => selectedOrderIds.includes(o.id))
      .reduce((sum, o) => sum + (o.persons?.length || 1), 0);
  }, [orders, selectedOrderIds]);

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
      const phone = getCustomerPhone(order) || "N/A";
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
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === "orders" ? "bg-[#2ecc71] text-black shadow-xs font-bold" : "text-white/60 hover:text-white"
              }`}
          >
            <Package size={14} />
            <span>All Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("batches")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === "batches" ? "bg-[#2ecc71] text-black shadow-xs font-bold" : "text-white/60 hover:text-white"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${typeFilter === "all" ? "bg-white/10 text-white font-bold" : "text-white/40 hover:text-white"
                    }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter("trek")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${typeFilter === "trek" ? "bg-[#2ecc71]/20 text-[#2ecc71] font-bold" : "text-white/40 hover:text-white"
                    }`}
                >
                  🧗 Treks
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter("product")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${typeFilter === "product" ? "bg-white/10 text-white font-bold" : "text-white/40 hover:text-white"
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

              {/* Master Excel Export Button */}
              <button
                type="button"
                onClick={downloadMasterOrdersExport}
                className="px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-[#2ecc71] border border-[#2ecc71]/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="Export all filtered orders to Excel (.csv)"
              >
                <FileSpreadsheet size={13} />
                <span>Export Master Excel</span>
              </button>
            </div>

            {/* Status Tabs Strip */}
            <div className="flex gap-1.5 flex-wrap pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setStatusTab("all")}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${statusTab === "all" ? "bg-white/15 text-white font-bold" : "text-white/40 hover:text-white"
                  }`}
              >
                All ({orders.length})
              </button>
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatusTab(s.value)}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${statusTab === s.value ? "bg-white/15 text-white font-bold" : "text-white/40 hover:text-white"
                    }`}
                >
                  <span>{s.label}</span>
                  <span className="text-[10px] opacity-60">({counts[s.value] ?? 0})</span>
                </button>
              ))}
            </div>

            {/* Quick Date Filters Strip */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-white/5 text-xs">
              <span className="text-white/40 text-[11px] flex items-center gap-1 mr-1">
                <CalendarDays size={12} className="text-[#2ecc71]" />
                <span>Date:</span>
              </span>
              <button
                type="button"
                onClick={() => setQuickDateFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${quickDateFilter === "all" ? "bg-white/15 text-white font-bold" : "text-white/40 hover:text-white"
                  }`}
              >
                All Dates
              </button>
              <button
                type="button"
                onClick={() => setQuickDateFilter("this_weekend")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${quickDateFilter === "this_weekend" ? "bg-emerald-500/20 text-[#2ecc71] font-bold border border-[#2ecc71]/30" : "text-white/40 hover:text-white"
                  }`}
              >
                <span>📅 This Weekend</span>
                <span className="text-[10px] opacity-70">({weekendCounts.thisWk})</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickDateFilter("next_weekend")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${quickDateFilter === "next_weekend" ? "bg-emerald-500/20 text-[#2ecc71] font-bold border border-[#2ecc71]/30" : "text-white/40 hover:text-white"
                  }`}
              >
                <span>📅 Next Weekend</span>
                <span className="text-[10px] opacity-70">({weekendCounts.nextWk})</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickDateFilter("this_month")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${quickDateFilter === "this_month" ? "bg-emerald-500/20 text-[#2ecc71] font-bold border border-[#2ecc71]/30" : "text-white/40 hover:text-white"
                  }`}
              >
                <span>🗓️ This Month</span>
                <span className="text-[10px] opacity-70">({weekendCounts.thisMo})</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickDateFilter("custom")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${quickDateFilter === "custom" ? "bg-white/15 text-white font-bold" : "text-white/40 hover:text-white"
                  }`}
              >
                Custom Range
              </button>

              {quickDateFilter === "custom" && (
                <div className="flex items-center gap-1.5 ml-2">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 text-[11px] text-white focus:outline-none"
                  />
                  <span className="text-white/30 text-[10px]">to</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 text-[11px] text-white focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bulk Batch Assignment Bar */}
          {selectedOrderIds.length > 0 && (
            <div className="bg-[#1d3527] border border-[#2ecc71]/40 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2ecc71] text-black font-black text-xs flex items-center justify-center">
                  {selectedOrderIds.length}
                </span>
                <span className="text-white text-xs font-semibold">
                  {selectedOrderIds.length} booking(s) selected ({selectedTrekkersCount} trekkers)
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
                  onClick={handleBulkDelete}
                  className="px-3.5 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Delete all selected bookings/orders permanently"
                >
                  <Trash2 size={13} />
                  <span>Delete Selected ({selectedOrderIds.length})</span>
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
                    className={`bg-[#141414] border rounded-2xl p-4 sm:p-5 transition-all ${isSelected ? "border-[#2ecc71]/60 bg-[#162119]" : "border-white/5 hover:border-white/15"
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
                              className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusCfg?.color
                                }`}
                            >
                              {statusIcon[order.status]} {statusCfg?.label}
                            </span>
                          </div>

                          {/* Quick Status Dropdown, Financials & Actions */}
                          <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
                            {/* 1-Click Collect Cash button if balance due */}
                            {(() => {
                              const due = order.remainingCash !== undefined ? order.remainingCash : (order.paymentType === "offline" ? order.totalAmount : 0);
                              if (due <= 0) return null;
                              return (
                                <button
                                  type="button"
                                  onClick={() => handleQuickCollectCash(order)}
                                  disabled={actionLoading === order.id + "-collect"}
                                  title={`1-Click: Collect ₹${due.toLocaleString("en-IN")} cash & mark booking settled`}
                                  className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  {actionLoading === order.id + "-collect" ? (
                                    <Loader2 size={12} className="animate-spin text-emerald-400" />
                                  ) : (
                                    <IndianRupee size={12} />
                                  )}
                                  <span>Collect ₹{due.toLocaleString("en-IN")}</span>
                                </button>
                              );
                            })()}

                            <button
                              type="button"
                              onClick={() => openFinancialsModal(order)}
                              title="Edit Discount, Paid Amount & Remaining Balance Due"
                              className="px-2.5 py-1.5 bg-white/5 hover:bg-[#2ecc71]/20 text-white/70 hover:text-[#2ecc71] border border-white/10 hover:border-[#2ecc71]/30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <IndianRupee size={12} />
                              <span>Financials</span>
                            </button>

                            {/* View & Print Customer Ticket / Voucher */}
                            <button
                              type="button"
                              onClick={() => setVoucherModalOrder(order)}
                              title="View & Print Customer Booking Ticket / Voucher"
                              className="px-2.5 py-1.5 bg-white/5 hover:bg-blue-500/20 text-white/70 hover:text-blue-400 border border-white/10 hover:border-blue-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Ticket size={12} />
                              <span>Ticket</span>
                            </button>

                            {/* Shift / Reschedule Batch (Trek Bookings) */}
                            {isTrek && (
                              <button
                                type="button"
                                onClick={() => openShiftBatchModal(order)}
                                title="Reschedule / Shift to another Batch"
                                className="px-2.5 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Repeat size={12} />
                                <span>Shift</span>
                              </button>
                            )}

                            <div className="relative">
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

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteOrder(
                                  order.id,
                                  isTrek
                                    ? `Booking #${order.id.slice(0, 8)} (${order.userName || "Customer"}) for ${order.trekName}`
                                    : `Order #${order.id.slice(0, 8)} (${order.userName || "Customer"})`
                                )
                              }
                              disabled={actionLoading === order.id + "-delete"}
                              title="Delete this order/booking record permanently"
                              className="p-1.5 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl transition-colors cursor-pointer"
                            >
                              {actionLoading === order.id + "-delete" ? (
                                <Loader2 size={14} className="animate-spin text-red-400" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
                          <span className="text-white/80 font-medium">{order.userName || "Guest"}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Mail size={12} /> {order.userEmail}
                          </span>
                          <span>•</span>
                          {getCustomerPhone(order) ? (
                            <div className="flex items-center gap-1.5">
                              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                                <Phone size={12} /> {getCustomerPhone(order)}
                              </span>
                              <button
                                type="button"
                                onClick={() => openWhatsAppModal(order)}
                                className="px-1.5 py-0.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 rounded-md text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                title="Send WhatsApp Message / Templates"
                              >
                                <MessageCircle size={10} />
                                <span>WhatsApp</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openFinancialsModal(order)}
                              className="text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 font-medium cursor-pointer"
                              title="Customer phone missing. Click to add phone number."
                            >
                              <Phone size={11} className="text-amber-400/70" /> + Add Mobile
                            </button>
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
                              <span className="text-white/30 block text-[10px] uppercase font-bold">Payment &amp; Financials</span>
                              <div className="mt-0.5 space-y-0.5">
                                <span className="text-white/90 font-semibold block">
                                  ₹{order.totalAmount.toLocaleString("en-IN")}
                                </span>
                                {(order.discount || order.couponDiscount) ? (
                                  <span className="text-orange-400 block text-[10px]">
                                    🏷️ Disc: -₹{(order.discount || order.couponDiscount)?.toLocaleString("en-IN")}
                                  </span>
                                ) : null}
                                <span className="text-emerald-400 block text-[10px]">
                                  Paid: ₹{(order.advancePaid !== undefined ? order.advancePaid : (order.paymentType !== "offline" ? order.totalAmount : 0)).toLocaleString("en-IN")}
                                </span>
                                {(order.remainingCash !== undefined ? order.remainingCash : (order.paymentType === "offline" ? order.totalAmount : 0)) > 0 ? (
                                  <span className="text-amber-400 block text-[10px] font-bold">
                                    💵 Due: ₹{(order.remainingCash !== undefined ? order.remainingCash : (order.paymentType === "offline" ? order.totalAmount : 0)).toLocaleString("en-IN")}
                                  </span>
                                ) : (
                                  <span className="text-emerald-400/80 block text-[10px]">✓ Fully Paid</span>
                                )}
                              </div>
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
                setNewBatchName("");
                setNewBatchDate("");
                setNewBatchWhatsapp("");
                setSelectedOrderIds([]);
                setBatchModalOpen(true);
              }}
              className="px-4 py-2 bg-[#2ecc71] text-black font-bold text-xs rounded-xl hover:bg-[#27ae60] transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus size={14} />
              <span>Create New Trip Batch</span>
            </button>
          </div>

          {/* Live vs Closed Batches Tab Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#141414] border border-white/5 p-2 rounded-xl">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setBatchTabFilter("live")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${batchTabFilter === "live"
                    ? "bg-[#2ecc71] text-black shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Batches ({liveBatchesCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setBatchTabFilter("closed")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${batchTabFilter === "closed"
                    ? "bg-amber-400 text-black shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
              >
                <span>🏁 Closed Batches ({closedBatchesCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setBatchTabFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${batchTabFilter === "all"
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
              >
                <span>All ({tripBatches.length})</span>
              </button>
            </div>

            <div className="text-[11px] text-white/40 px-2 font-mono">
              Showing {displayedTripBatches.length} of {tripBatches.length} batch(es)
            </div>
          </div>

          {displayedTripBatches.length === 0 ? (
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-12 text-center space-y-2">
              <Users className="w-10 h-10 text-white/10 mx-auto" />
              <p className="text-white/40 text-sm font-semibold">
                {batchTabFilter === "closed"
                  ? "No Closed / Completed Batches"
                  : batchTabFilter === "live"
                    ? "No Active Live Trek Batches"
                    : "No Trek Batches Active"}
              </p>
              <p className="text-white/20 text-xs">
                {batchTabFilter === "closed"
                  ? "Batches you mark as 'Close Batch' after the trek is finished will appear here."
                  : "When users book treks or you create batches, they will appear here."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedTripBatches.map((b) => {
                const batchExps = getBatchExpenses(b.batchKey, b.batchName);
                const totalBatchExp = getBatchTotalExpenses(b.batchKey, b.batchName);
                const netProfit = b.totalAmount - totalBatchExp;
                const margin = b.totalAmount > 0 ? ((netProfit / b.totalAmount) * 100).toFixed(1) : "0";

                return (
                  <div
                    key={b.batchKey}
                    className={`bg-[#141414] border rounded-2xl p-5 space-y-4 transition-all ${b.isClosed
                        ? "border-amber-500/20 bg-gradient-to-b from-amber-500/[0.02] to-transparent opacity-95"
                        : "border-white/5 hover:border-white/15"
                      }`}
                  >
                    {/* Batch Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {renamingBatchKey === b.batchKey ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={renameBatchValue}
                                onChange={(e) => setRenameBatchValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleRenameBatch(b);
                                  if (e.key === "Escape") setRenamingBatchKey(null);
                                }}
                                autoFocus
                                disabled={renamingBatchLoading}
                                placeholder="New batch name..."
                                className="bg-white/10 border border-[#2ecc71]/50 rounded-md px-2 py-0.5 text-xs font-mono font-bold text-white focus:outline-none w-48"
                              />
                              <button
                                type="button"
                                disabled={renamingBatchLoading}
                                onClick={() => handleRenameBatch(b)}
                                title="Save new batch name"
                                className="p-1 rounded-md bg-[#2ecc71]/20 hover:bg-[#2ecc71]/30 text-[#2ecc71] border border-[#2ecc71]/30 cursor-pointer disabled:opacity-50"
                              >
                                {renamingBatchLoading ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                              </button>
                              <button
                                type="button"
                                disabled={renamingBatchLoading}
                                onClick={() => setRenamingBatchKey(null)}
                                title="Cancel rename"
                                className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-white/60 border border-white/10 cursor-pointer"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2ecc71] bg-[#2ecc71]/10 px-2 py-0.5 rounded-md">
                                {b.batchName}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setRenamingBatchKey(b.batchKey);
                                  setRenameBatchValue(b.batchName);
                                }}
                                title="Rename this batch"
                                className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-white/50 hover:text-white transition-colors cursor-pointer"
                              >
                                <Pencil size={11} />
                              </button>
                            </div>
                          )}
                          {b.isClosed ? (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span>🏁 Completed / Closed</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Live Trek</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-white font-bold text-base mt-1.5">
                          🧗 {b.trekName}
                        </h3>
                        <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                          <Calendar size={12} className="text-[#2ecc71]" />
                          <span>Departure Date: <strong className="text-white/80">{b.trekDate}</strong></span>
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="text-right">
                          <span className="text-2xl font-black text-white">{b.totalTrekkers}</span>
                          <span className="text-white/40 text-xs block">Trekkers</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteBatch(b)}
                          title="Dissolve and delete this trip batch"
                          className="p-2 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl transition-colors cursor-pointer mt-0.5"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Operational Logistics & Financials Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {/* Meal Preferences */}
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <span className="text-white/40 block text-[10px] font-bold uppercase mb-1">
                          Meals Count
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-emerald-400 font-bold">🥗 {b.vegCount} Veg</span>
                          <span className="text-amber-400 font-bold">🍗 {b.nonVegCount} Non</span>
                        </div>
                      </div>

                      {/* Cash to Collect */}
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <span className="text-white/40 block text-[10px] font-bold uppercase mb-1">
                          Cash Balance
                        </span>
                        <div className="text-white font-bold">
                          {b.totalCashDue > 0 ? (
                            <span className="text-amber-400">₹{b.totalCashDue.toLocaleString("en-IN")} Due</span>
                          ) : (
                            <span className="text-emerald-400">Fully Paid</span>
                          )}
                        </div>
                      </div>

                      {/* Batch Expenses */}
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase mb-1">
                          <span>Expenses</span>
                          <Receipt size={11} className="text-orange-400" />
                        </div>
                        <div className="text-orange-400 font-bold">
                          ₹{totalBatchExp.toLocaleString("en-IN")}
                          <span className="text-white/30 text-[10px] font-normal ml-1">({batchExps.length})</span>
                        </div>
                      </div>

                      {/* Profit & Loss */}
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase mb-1">
                          <span>Net P&amp;L</span>
                          {netProfit >= 0 ? <TrendingUp size={11} className="text-emerald-400" /> : <TrendingDown size={11} className="text-red-400" />}
                        </div>
                        <div className={`font-bold ${netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {netProfit >= 0 ? "+" : ""}₹{netProfit.toLocaleString("en-IN")}
                          <span className="text-[10px] font-normal opacity-70 ml-1">({margin}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Pickup Points Summary */}
                    <div>
                      <span className="text-white/40 text-[10px] font-bold uppercase block mb-1.5">
                        Bus Pickup Distribution
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {Object.keys(b.pickupLocations).length === 0 ? (
                          <span className="text-[11px] text-white/30 italic">No pickups assigned yet</span>
                        ) : (
                          Object.entries(b.pickupLocations).map(([loc, count]) => (
                            <span
                              key={loc}
                              className="text-[11px] bg-white/5 border border-white/10 text-white/80 px-2 py-0.5 rounded-lg flex items-center gap-1"
                            >
                              <MapPin size={11} className="text-[#2ecc71]" />
                              <span>{loc}</span>
                              <strong className="text-[#2ecc71]">({count})</strong>
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Batch Confirmed Bookings & Contact Mobiles */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-white/40 text-[10px] font-bold uppercase flex items-center gap-1.5">
                          <Phone size={11} className="text-[#2ecc71]" />
                          <span>Bookings &amp; Contact Mobiles ({b.orders.length})</span>
                        </span>
                        <span className="text-[10px] text-white/30 font-mono">
                          From Contact Details (Phone *)
                        </span>
                      </div>

                      <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 divide-y divide-white/5 bg-black/20 p-2.5 rounded-xl border border-white/5">
                        {b.orders.length === 0 ? (
                          <div className="py-3 text-center text-white/30 text-xs italic">
                            No bookings assigned yet. Click &ldquo;Assign&rdquo; to add bookings to this batch.
                          </div>
                        ) : (
                          b.orders.map((o) => {
                            const phone = getCustomerPhone(o);
                            const due = o.remainingCash !== undefined ? o.remainingCash : (o.paymentType === "offline" ? o.totalAmount : 0);
                            return (
                              <div
                                key={o.id}
                                className="pt-1.5 first:pt-0 flex items-center justify-between gap-2 text-xs"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-white text-xs truncate">
                                      {o.userName || "Traveler"}
                                    </span>
                                    <span className="text-[10px] text-white/30 font-mono">
                                      #{o.id.slice(0, 6)}
                                    </span>
                                    <span className="text-[10px] bg-white/5 text-white/60 px-1.5 py-0.2 rounded font-mono">
                                      👥 {o.persons?.length || 1}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 mt-0.5 text-[11px] flex-wrap">
                                    {phone ? (
                                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                        <Phone size={11} className="text-emerald-400/80" />
                                        <a
                                          href={`tel:${phone}`}
                                          className="hover:underline font-mono"
                                          title="Call traveler"
                                        >
                                          {phone}
                                        </a>
                                        <button
                                          type="button"
                                          onClick={() => openWhatsAppModal(o)}
                                          className="px-1.5 py-0.2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 rounded text-[10px] font-bold transition-colors cursor-pointer"
                                          title="Message on WhatsApp"
                                        >
                                          WhatsApp
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => openFinancialsModal(o)}
                                        className="text-[11px] text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 font-medium cursor-pointer"
                                        title="Click to enter phone number"
                                      >
                                        <Phone size={10} /> + Add Mobile
                                      </button>
                                    )}
                                    <span className="text-white/20">&bull;</span>
                                    <span className="text-white/40 text-[10px] truncate max-w-[110px]">
                                      📍 {o.pickupLocation || "Basepoint"}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="font-bold text-white block text-[11px]">
                                    ₹{(o.totalAmount || 0).toLocaleString("en-IN")}
                                  </span>
                                  {due > 0 ? (
                                    <span className="text-[10px] text-amber-400 font-semibold block">
                                      Due: ₹{due.toLocaleString("en-IN")}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-emerald-400 block font-medium">
                                      Paid ✓
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: View Manifest, Expenses, Add Travelers, WhatsApp */}
                    <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setManifestBatch(b)}
                        className="flex-1 min-w-[110px] py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Users size={13} />
                        <span>Manifest ({b.totalTrekkers})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpenseModalBatch(b)}
                        className="py-2 px-3 bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 border border-orange-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Manage expenses & see P&L for this batch"
                      >
                        <Receipt size={13} />
                        <span>Expenses ({batchExps.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openBulkFinancialsModal(b)}
                        className="py-2 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 text-[#2ecc71] border border-[#2ecc71]/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Bulk update discount, paid amount, remaining balance & totals for selected bookings"
                      >
                        <SlidersHorizontal size={13} />
                        <span>Bulk Financials</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setNewBatchName(b.batchName);
                          setNewBatchTrek(b.trekName);
                          setNewBatchDate(b.trekDate !== "Unscheduled Date" && b.trekDate !== "Upcoming Date" ? b.trekDate : "");
                          setNewBatchWhatsapp(b.whatsappGroupLink || "");
                          setSelectedOrderIds(b.orders.map((o) => o.id));
                          setBatchModalOpen(true);
                        }}
                        className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Add or remove bookings assigned to this batch"
                      >
                        <UserPlus size={13} />
                        <span>Assign</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => copyWhatsAppRoster(b)}
                        title="Copy complete roster formatted for WhatsApp group"
                        className="py-2 px-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Copy size={13} />
                        <span>WhatsApp</span>
                      </button>

                      {(() => {
                        const existingBanner = batchBanners.find((bn) => bn.batchKey === b.batchKey);
                        const isBannerLive = Boolean(existingBanner && existingBanner.active);
                        const isToggling = bannerToggleLoadingKey === b.batchKey;
                        return (
                          <button
                            type="button"
                            disabled={isToggling || b.isClosed}
                            onClick={() => handleToggleBatchBanner(b)}
                            title={
                              b.isClosed
                                ? "Reopen batch to promote on Home Banner"
                                : isBannerLive
                                  ? "Click to remove from Front Page Banner"
                                  : "Push this batch to Front Page Banner"
                            }
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${isBannerLive
                                ? "bg-[#b8dc26]/15 hover:bg-[#b8dc26]/25 border-[#b8dc26]/40 text-[#b8dc26]"
                                : "bg-white/5 hover:bg-white/10 border-white/15 text-white/75"
                              }`}
                          >
                            {isToggling ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Megaphone size={13} />
                            )}
                            <span>{isBannerLive ? "Home Banner: LIVE" : "Push to Home Banner"}</span>
                          </button>
                        );
                      })()}

                      {b.isClosed ? (
                        <button
                          type="button"
                          onClick={() => handleToggleBatchClosed(b, false)}
                          className="py-2 px-3 bg-white/10 hover:bg-emerald-500/20 text-white hover:text-emerald-400 border border-white/10 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Reopen this batch and mark as live"
                        >
                          <RotateCcw size={13} />
                          <span>Reopen Live</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleBatchClosed(b, true)}
                          className="py-2 px-3 bg-white/5 hover:bg-amber-500/20 text-white/60 hover:text-amber-400 border border-white/10 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Close this batch (trek completed)"
                        >
                          <CheckCircle2 size={13} />
                          <span>Close Batch</span>
                        </button>
                      )}
                    </div>

                    {/* Excel Reports Quick Download Strip */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 flex-wrap text-xs">
                      <span className="text-[11px] text-white/40 flex items-center gap-1">
                        <FileSpreadsheet size={12} className="text-[#2ecc71]" />
                        <span>Excel Reports:</span>
                      </span>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => downloadFoodPreferenceReport(b)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-white/10 hover:border-emerald-500/30 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          title="Download Food Preference Report (.csv Excel)"
                        >
                          <Download size={11} />
                          <span>Food Pref</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => downloadContactRosterReport(b)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-blue-500/20 text-blue-400 border border-white/10 hover:border-blue-500/30 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          title="Download Contact Roster Report with Mobiles (.csv Excel)"
                        >
                          <Download size={11} />
                          <span>Contacts</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => downloadProfitLossStatement(b)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-amber-500/20 text-amber-400 border border-white/10 hover:border-amber-500/30 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          title="Download Profit & Loss Statement (.csv Excel)"
                        >
                          <Receipt size={11} />
                          <span>P&amp;L Statement</span>
                        </button>
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

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => downloadFoodPreferenceReport(manifestBatch)}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                  title="Download Food Preference Report (.csv Excel)"
                >
                  <FileSpreadsheet size={12} />
                  <span>Food Pref</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadContactRosterReport(manifestBatch)}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                  title="Download Contact Roster Report with Mobiles (.csv Excel)"
                >
                  <Download size={12} />
                  <span>Contacts</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadProfitLossStatement(manifestBatch)}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                  title="Download Profit & Loss Statement (.csv Excel)"
                >
                  <Receipt size={12} />
                  <span>P&amp;L Statement</span>
                </button>
                <button
                  type="button"
                  onClick={() => openBulkFinancialsModal(manifestBatch)}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-[#2ecc71] bg-[#2ecc71]/10 hover:bg-[#2ecc71]/20 border border-[#2ecc71]/20 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                  title="Bulk update discount, paid amount, remaining balance & totals for selected bookings"
                >
                  <SlidersHorizontal size={12} />
                  <span>Bulk Financials</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-1.5 text-white/60 hover:text-white bg-white/5 rounded-xl transition-colors cursor-pointer"
                  title="Print Manifest"
                >
                  <Printer size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setManifestBatch(null)}
                  className="p-1.5 text-white/60 hover:text-white bg-white/5 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Manifest Table */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Pickup Stop Filter & Live Boarding Attendance Tracker */}
              {(() => {
                const totalTrekkers = manifestBatch.totalTrekkers || 1;
                const boardedCount = manifestBatch.orders
                  .filter((o) => o.boarded)
                  .reduce((sum, o) => sum + (o.persons?.length || 1), 0);
                const pct = Math.round((boardedCount / totalTrekkers) * 100);

                const currentPickupOrders =
                  manifestPickupFilter === "all"
                    ? manifestBatch.orders
                    : manifestBatch.orders.filter(
                      (o) => (o.pickupLocation || "Basepoint") === manifestPickupFilter
                    );

                return (
                  <div className="space-y-2.5 pb-3 border-b border-white/5">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Bus size={14} className="text-[#2ecc71]" />
                          <span>Boarding Attendance:</span>
                        </span>
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${pct === 100
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                        >
                          {boardedCount} / {totalTrekkers} Boarded ({pct}%)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleMarkAllVisibleBoarded(currentPickupOrders)}
                        className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Mark all currently visible passengers as boarded"
                      >
                        <CheckCheck size={13} />
                        <span>Mark Visible Boarded</span>
                      </button>
                    </div>

                    {/* Pickup Stops Filter Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
                      <span className="text-[11px] text-white/40 flex items-center gap-1 mr-1">
                        <MapPin size={11} className="text-[#2ecc71]" />
                        <span>Filter Stop:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setManifestPickupFilter("all")}
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-colors ${manifestPickupFilter === "all"
                            ? "bg-white/20 text-white font-bold"
                            : "text-white/40 hover:text-white"
                          }`}
                      >
                        All Stops ({manifestBatch.totalTrekkers})
                      </button>
                      {Object.entries(manifestBatch.pickupLocations).map(([loc, cnt]) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setManifestPickupFilter(loc)}
                          className={`px-2.5 py-0.5 rounded-lg text-[11px] transition-colors flex items-center gap-1 ${manifestPickupFilter === loc
                              ? "bg-[#2ecc71]/20 text-[#2ecc71] font-bold border border-[#2ecc71]/40"
                              : "text-white/40 hover:text-white"
                            }`}
                        >
                          <span>{loc}</span>
                          <span className="text-[10px] opacity-70">({cnt})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-white/5 text-white/40 uppercase font-mono text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Passenger Name</th>
                    <th className="py-2.5 px-3">Age / Gender</th>
                    <th className="py-2.5 px-3">Food</th>
                    <th className="py-2.5 px-3">Boarding</th>
                    <th className="py-2.5 px-3">Pickup Location</th>
                    <th className="py-2.5 px-3">Contact Mobile (Phone *)</th>
                    <th className="py-2.5 px-3">Payment</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {manifestBatch.orders.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-white/30 italic">
                        No travelers assigned to this batch yet. Click &ldquo;Assign Bookings&rdquo; to add travelers.
                      </td>
                    </tr>
                  ) : (
                    (() => {
                      let counter = 1;
                      const displayedOrders = manifestBatch.orders.filter((o) => {
                        if (manifestPickupFilter === "all") return true;
                        return (o.pickupLocation || "Basepoint") === manifestPickupFilter;
                      });

                      if (displayedOrders.length === 0) {
                        return (
                          <tr>
                            <td colSpan={10} className="py-8 text-center text-white/30 italic">
                              No passengers boarding at stop &ldquo;{manifestPickupFilter}&rdquo;.
                            </td>
                          </tr>
                        );
                      }

                      return displayedOrders.flatMap((order) => {
                        const persons = order.persons && order.persons.length > 0
                          ? order.persons
                          : [{ name: order.userName || "Traveler", age: undefined, gender: undefined, foodPreference: "veg" as const }];

                        const due = order.remainingCash !== undefined ? order.remainingCash : (order.paymentType === "offline" ? order.totalAmount : 0);

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
                            <td className="py-3 px-3">
                              {idx === 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleBoarding(order.id, order.boarded)}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border ${order.boarded
                                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                      : "bg-white/5 text-white/40 hover:text-white border-white/10"
                                    }`}
                                  title="Click to toggle boarding check-in"
                                >
                                  {order.boarded ? <CheckCheck size={11} /> : <Square size={11} />}
                                  <span>{order.boarded ? `Boarded ${order.boardedAt ? `(${order.boardedAt})` : "✓"}` : "Check-in"}</span>
                                </button>
                              )}
                            </td>
                            <td className="py-3 px-3 text-white/60 truncate max-w-[150px]">
                              {order.pickupLocation || "Basepoint"}
                            </td>
                            <td className="py-3 px-3">
                              {getCustomerPhone(order) ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-white/80 font-medium">{getCustomerPhone(order)}</span>
                                  <button
                                    type="button"
                                    onClick={() => openWhatsAppModal(order)}
                                    className="p-1 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 rounded-md transition-colors cursor-pointer"
                                    title="Send WhatsApp Message"
                                  >
                                    <MessageCircle size={10} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => openFinancialsModal(order)}
                                  className="text-[11px] text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 font-medium cursor-pointer"
                                  title="Customer phone missing. Click to add phone number."
                                >
                                  <Phone size={10} /> + Add Mobile
                                </button>
                              )}
                              <span className="text-[10px] text-white/30 block truncate max-w-[120px]">{order.userEmail}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="block text-white font-medium">₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                              {(order.discount || order.couponDiscount) ? (
                                <span className="block text-[10px] text-orange-400">🏷️ Disc: -₹{(order.discount || order.couponDiscount)?.toLocaleString("en-IN")}</span>
                              ) : null}
                              <span className="block text-[10px] text-emerald-400">
                                Paid: ₹{(order.advancePaid !== undefined ? order.advancePaid : (order.paymentType !== "offline" ? order.totalAmount : 0)).toLocaleString("en-IN")}
                              </span>
                              {due > 0 ? (
                                <div className="space-y-1 mt-0.5">
                                  <span className="block text-[10px] text-amber-400 font-bold">
                                    Due: ₹{due.toLocaleString("en-IN")}
                                  </span>
                                  {idx === 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleQuickCollectCash(order)}
                                      disabled={actionLoading === order.id + "-collect"}
                                      className="px-1.5 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-md text-[10px] font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
                                      title={`Collect ₹${due} cash and mark settled`}
                                    >
                                      <IndianRupee size={9} />
                                      <span>Collect ₹{due}</span>
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <span className="block text-[10px] text-white/30">Settled</span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {idx === 0 && (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setVoucherModalOrder(order)}
                                    title="View & Print Passenger Ticket / Booking Voucher"
                                    className="p-1.5 bg-white/5 hover:bg-blue-500/20 text-white/40 hover:text-blue-400 border border-white/10 hover:border-blue-500/30 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Ticket size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => openShiftBatchModal(order)}
                                    title="Shift / Reschedule traveler to another batch"
                                    className="p-1.5 bg-white/5 hover:bg-purple-500/20 text-white/40 hover:text-purple-400 border border-white/10 hover:border-purple-500/30 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Repeat size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => openFinancialsModal(order)}
                                    title="Edit Discount, Paid Amount & Remaining Balance Due"
                                    className="p-1.5 bg-white/5 hover:bg-[#2ecc71]/20 text-white/40 hover:text-[#2ecc71] border border-white/10 hover:border-[#2ecc71]/30 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <IndianRupee size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveOrderFromBatch(order.id)}
                                    title="Unassign this booking from batch"
                                    className="p-1.5 bg-white/5 hover:bg-amber-500/20 text-white/40 hover:text-amber-400 border border-white/10 hover:border-amber-500/30 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <UserMinus size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleDeleteOrder(
                                        order.id,
                                        `Booking #${order.id.slice(0, 8)} (${order.userName})`
                                      );
                                      setManifestBatch((prev) => {
                                        if (!prev) return null;
                                        const remaining = prev.orders.filter((o) => o.id !== order.id);
                                        return {
                                          ...prev,
                                          orders: remaining,
                                          totalTrekkers: remaining.reduce((s, o) => s + (o.persons?.length || 1), 0),
                                        };
                                      });
                                    }}
                                    title="Delete booking permanently"
                                    className="p-1.5 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ));
                      });
                    })()
                  )}
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
          MODAL: CREATE / ASSIGN NEW TRIP BATCH (WITH BOOKING SELECTOR)
         ══════════════════════════════════════════════════════════════ */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col p-6 space-y-4 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <Users className="text-[#2ecc71]" size={18} />
                  <span>Create / Assign Trip Batch</span>
                </h3>
                <p className="text-white/40 text-xs mt-0.5">
                  Set batch details and pick which bookings belong to this expedition trip.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBatchModalOpen(false)}
                className="text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Batch Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-white/70 block mb-1 font-semibold">Trek Expedition</label>
                  <div className="flex gap-1.5">
                    <select
                      value={newBatchTrek}
                      onChange={(e) => setNewBatchTrek(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#2ecc71]/40 cursor-pointer"
                    >
                      <option value="" className="bg-[#141414]">Choose a Trek...</option>
                      {distinctTreks.map((t) => (
                        <option key={t} value={t} className="bg-[#141414]">
                          🧗 {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-white/70 block mb-1 font-semibold">Trip / Batch Name *</label>
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
                  <label className="text-white/70 block mb-1 font-semibold">WhatsApp Group Link (Optional)</label>
                  <input
                    value={newBatchWhatsapp}
                    onChange={(e) => setNewBatchWhatsapp(e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]/40"
                  />
                </div>
              </div>

              {/* ── Front Page Banner Promotion ── */}
              <div className="rounded-2xl border border-[#b8dc26]/20 bg-[#b8dc26]/[0.04] p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={promoteToBanner}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setPromoteToBanner(checked);
                        if (checked) {
                          const matched = findTrekInfo(newBatchTrek);
                          if (!bannerTitle && (newBatchTrek || newBatchName)) {
                            setBannerTitle(
                              newBatchTrek && newBatchName
                                ? `${newBatchTrek} — ${newBatchName}`
                                : newBatchTrek || newBatchName
                            );
                          }
                          if (!bannerImageUrl && matched?.images?.[0]) {
                            setBannerImageUrl(matched.images[0]);
                          }
                          if (!bannerCtaLink) {
                            setBannerCtaLink(
                              buildDefaultCtaLink(bannerCtaType, newBatchTrek, newBatchName || "Upcoming Batch")
                            );
                          }
                        }
                      }}
                      className="w-4 h-4 accent-[#b8dc26] rounded cursor-pointer"
                    />
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#b8dc26]">
                      <Megaphone size={14} />
                      Show this Batch on Front Page Banner &amp; CTA
                    </span>
                  </label>

                  {promoteToBanner && newBatchTrek && (
                    <button
                      type="button"
                      onClick={() => {
                        const matched = findTrekInfo(newBatchTrek);
                        const formattedDate = newBatchDate
                          ? new Date(newBatchDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                          : "Upcoming";
                        setBannerTitle(newBatchName ? `${newBatchTrek} — ${newBatchName}` : newBatchTrek);
                        setBannerSubtitle(
                          `Join our verified Konkan batch departing ${formattedDate}. Limited group seats!`
                        );
                        if (matched?.images?.[0]) setBannerImageUrl(matched.images[0]);
                        setBannerCtaLink(
                          buildDefaultCtaLink(bannerCtaType, newBatchTrek, newBatchName || "Upcoming Batch")
                        );
                      }}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#b8dc26]/15 hover:bg-[#b8dc26]/25 text-[#b8dc26] border border-[#b8dc26]/30 transition-colors cursor-pointer"
                    >
                      Auto-fill from Trek
                    </button>
                  )}
                </div>

                {promoteToBanner && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="sm:col-span-2">
                      <label className="text-white/70 block mb-1 font-semibold">Banner Headline</label>
                      <input
                        value={bannerTitle}
                        onChange={(e) => setBannerTitle(e.target.value)}
                        placeholder="e.g. Kalsubai Night Trek — Swargate Bus Batch"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#b8dc26]/40"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-white/70 block mb-1 font-semibold">Banner Subtitle</label>
                      <input
                        value={bannerSubtitle}
                        onChange={(e) => setBannerSubtitle(e.target.value)}
                        placeholder="e.g. Join our verified Konkan batch departing 14 Dec. Limited group seats!"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#b8dc26]/40"
                      />
                    </div>

                    <div>
                      <label className="text-white/70 block mb-1 font-semibold">CTA Destination Type</label>
                      <select
                        value={bannerCtaType}
                        onChange={(e) => {
                          const nextType = e.target.value as "trek" | "whatsapp" | "custom";
                          setBannerCtaType(nextType);
                          if (nextType !== "custom") {
                            setBannerCtaLink(
                              buildDefaultCtaLink(nextType, newBatchTrek, newBatchName || "Upcoming Batch")
                            );
                          }
                          if (nextType === "whatsapp" && bannerCtaText === "Book Seat Now") {
                            setBannerCtaText("Enquire on WhatsApp");
                          } else if (nextType === "trek" && bannerCtaText === "Enquire on WhatsApp") {
                            setBannerCtaText("Book Seat Now");
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#b8dc26]/40 cursor-pointer"
                      >
                        <option value="trek" className="bg-[#141414]">Trek Booking Page (/treks/...)</option>
                        <option value="whatsapp" className="bg-[#141414]">Direct WhatsApp Enquiry</option>
                        <option value="custom" className="bg-[#141414]">Custom URL</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-white/70 block mb-1 font-semibold">CTA Button Text</label>
                      <input
                        value={bannerCtaText}
                        onChange={(e) => setBannerCtaText(e.target.value)}
                        placeholder="Book Seat Now"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#b8dc26]/40"
                      />
                    </div>

                    <div>
                      <label className="text-white/70 block mb-1 font-semibold">CTA Target Link</label>
                      <input
                        value={bannerCtaLink}
                        onChange={(e) => setBannerCtaLink(e.target.value)}
                        placeholder="/treks/kalsubai or https://..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#b8dc26]/40"
                      />
                    </div>

                    <div>
                      <label className="text-white/70 block mb-1 font-semibold">Seats Left Urgency (Optional)</label>
                      <input
                        type="number"
                        min={1}
                        value={bannerSeatsLeft}
                        onChange={(e) => setBannerSeatsLeft(e.target.value)}
                        placeholder="e.g. 6"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#b8dc26]/40"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-white/70 block mb-1 font-semibold">Banner Cover Image URL (Optional)</label>
                      <input
                        value={bannerImageUrl}
                        onChange={(e) => setBannerImageUrl(e.target.value)}
                        placeholder="Auto-filled from trek or paste custom image URL"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#b8dc26]/40"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ── Interactive Booking Picker ── */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-white font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-[#2ecc71]" />
                      <span>Select Bookings to Assign ({selectedOrderIds.length} Selected)</span>
                    </label>
                    <span className="text-[11px] text-white/40 block">
                      Check which travelers belong to this trip batch:
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#2ecc71] bg-[#2ecc71]/10 px-2.5 py-0.5 rounded-full border border-[#2ecc71]/30">
                      {selectedTrekkersCount} Total Trekkers
                    </span>
                  </div>
                </div>

                {/* Filter & Search inside modal */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                    <input
                      value={modalSearch}
                      onChange={(e) => setModalSearch(e.target.value)}
                      placeholder="Search bookings by customer name, phone, order ID..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]/40"
                    />
                  </div>

                  <div className="flex items-center gap-1 p-0.5 bg-white/5 border border-white/10 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setModalBookingFilter("all")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${modalBookingFilter === "all" ? "bg-white/15 text-white font-bold" : "text-white/40 hover:text-white"
                        }`}
                    >
                      All ({orders.filter((o) => o.orderType === "trek").length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalBookingFilter("unassigned")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${modalBookingFilter === "unassigned" ? "bg-[#2ecc71]/20 text-[#2ecc71] font-bold" : "text-white/40 hover:text-white"
                        }`}
                    >
                      Unassigned ({orders.filter((o) => o.orderType === "trek" && (!o.batchName || o.batchName === "Standard Batch")).length})
                    </button>
                  </div>
                </div>

                {/* Select All / Clear helper buttons */}
                <div className="flex items-center justify-between text-[11px] px-1 text-white/40">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const visibleIds = modalEligibleOrders.map((o) => o.id);
                        setSelectedOrderIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
                      }}
                      className="text-[#2ecc71] hover:underline cursor-pointer font-medium"
                    >
                      Select All Visible ({modalEligibleOrders.length})
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setSelectedOrderIds([])}
                      className="hover:underline text-white/50 cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  </div>
                  <span>Showing {modalEligibleOrders.length} bookings</span>
                </div>

                {/* Checklist Container */}
                <div className="max-h-56 overflow-y-auto border border-white/10 rounded-2xl p-1.5 space-y-1 bg-black/30 divide-y divide-white/5">
                  {modalEligibleOrders.length === 0 ? (
                    <div className="p-6 text-center text-white/30 text-xs">
                      No trek bookings match the selected criteria.
                    </div>
                  ) : (
                    modalEligibleOrders.map((o) => {
                      const isChecked = selectedOrderIds.includes(o.id);
                      const persons = o.persons?.length || 1;
                      return (
                        <div
                          key={o.id}
                          onClick={() => toggleSelectOrder(o.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${isChecked ? "bg-[#2ecc71]/15 border border-[#2ecc71]/40" : "hover:bg-white/5 border border-transparent"
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => { }} // Handled by parent container click
                              className="rounded border-white/30 bg-white/10 text-[#2ecc71] focus:ring-0 cursor-pointer pointer-events-none"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-xs text-white truncate">{o.userName || "Guest"}</span>
                                <span className="text-[10px] text-white/30 font-mono">#{o.id.slice(0, 6)}</span>
                                {o.batchName ? (
                                  <span className="text-[10px] bg-white/10 text-white/60 px-1.5 py-0.2 rounded font-mono">
                                    {o.batchName}
                                  </span>
                                ) : (
                                  <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.2 rounded">
                                    Unassigned
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-white/40 flex items-center gap-2 truncate mt-0.5">
                                <span>🧗 {o.trekName}</span>
                                {o.trekDate && <span>📅 {o.trekDate}</span>}
                                {getCustomerPhone(o) && <span>📞 {getCustomerPhone(o)}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0 ml-3">
                            <span className="text-xs font-bold text-[#2ecc71] block">
                              {persons} {persons === 1 ? "Trekker" : "Trekkers"}
                            </span>
                            <span className="text-[10px] text-white/40">
                              ₹{o.totalAmount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10">
              <span className="text-[11px] text-white/40">
                {selectedOrderIds.length > 0
                  ? `${selectedOrderIds.length} booking(s) will be grouped into "${newBatchName.trim() || "Batch"}"`
                  : "Creating batch without bookings for now"}
              </span>

              <div className="flex items-center gap-2 self-end sm:self-auto">
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
                  className="px-5 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-black rounded-xl text-xs font-bold disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {assigningBatch && <Loader2 size={13} className="animate-spin" />}
                  <span>
                    {selectedOrderIds.length > 0
                      ? `Assign ${selectedOrderIds.length} Booking(s) to Batch`
                      : "Create Trip Batch"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: TRIP BATCH EXPENSES & P&L MANAGER
         ══════════════════════════════════════════════════════════════ */}
      {expenseModalBatch && (() => {
        const batchExps = getBatchExpenses(expenseModalBatch.batchKey, expenseModalBatch.batchName);
        const totalExp = getBatchTotalExpenses(expenseModalBatch.batchKey, expenseModalBatch.batchName);
        const grossRev = expenseModalBatch.totalAmount || 0;
        const netProfit = grossRev - totalExp;
        const margin = grossRev > 0 ? ((netProfit / grossRev) * 100).toFixed(1) : "0";

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
            <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col p-6 space-y-4 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2ecc71] bg-[#2ecc71]/10 px-2 py-0.5 rounded-md">
                      {expenseModalBatch.batchName}
                    </span>
                    <span className="text-white/40 text-xs">📅 {expenseModalBatch.trekDate}</span>
                  </div>
                  <h3 className="text-white font-bold text-base mt-1 flex items-center gap-2">
                    <Receipt className="text-orange-400" size={18} />
                    <span>Trip Expenses &amp; Profit / Loss</span>
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setExpenseModalBatch(null)}
                  className="text-white/40 hover:text-white p-1 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>

              {/* P&L Snapshot Metrics */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Gross Revenue</span>
                  <span className="text-white font-bold text-sm block mt-0.5">
                    ₹{grossRev.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-white/30">{expenseModalBatch.totalTrekkers} trekkers</span>
                </div>

                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Total Expenses</span>
                  <span className="text-orange-400 font-bold text-sm block mt-0.5">
                    ₹{totalExp.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-white/30">{batchExps.length} logged item(s)</span>
                </div>

                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Net Profit / Loss</span>
                  <span className={`font-bold text-sm block mt-0.5 ${netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {netProfit >= 0 ? "+" : ""}₹{netProfit.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] opacity-70">Margin: {margin}%</span>
                </div>
              </div>

              {/* Scrollable Container: Add Expense Form & Logged Expenses */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {/* Add Expense Box */}
                <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5">
                    <Plus size={13} className="text-[#2ecc71]" />
                    <span>Record New Expense for this Batch</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-white/50 block text-[10px] font-semibold mb-1">Expense Description *</label>
                      <input
                        value={newExpDesc}
                        onChange={(e) => setNewExpDesc(e.target.value)}
                        placeholder="e.g. Swargate Private Bus Hire"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]/40 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-white/50 block text-[10px] font-semibold mb-1">Amount (₹) *</label>
                      <input
                        type="number"
                        value={newExpAmount}
                        onChange={(e) => setNewExpAmount(e.target.value)}
                        placeholder="e.g. 8500"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]/40 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-white/50 block text-[10px] font-semibold mb-1">Category</label>
                      <select
                        value={newExpCategory}
                        onChange={(e) => setNewExpCategory(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#2ecc71]/40 cursor-pointer"
                      >
                        {EXPENSE_CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value} className="bg-[#141414]">
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-white/50 block text-[10px] font-semibold mb-1">Date</label>
                      <input
                        type="date"
                        value={newExpDate}
                        onChange={(e) => setNewExpDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#2ecc71]/40"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={expSubmitting || !newExpDesc.trim() || !newExpAmount}
                      onClick={() => handleAddExpense(expenseModalBatch)}
                      className="px-4 py-1.5 bg-[#2ecc71] hover:bg-[#27ae60] text-black rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      {expSubmitting && <Loader2 size={12} className="animate-spin" />}
                      <span>Add Expense</span>
                    </button>
                  </div>
                </div>

                {/* Logged Expenses List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/50 px-1">
                    <span className="font-bold text-white/70">Logged Expenses ({batchExps.length})</span>
                    <span>Total: ₹{totalExp.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="max-h-56 overflow-y-auto border border-white/10 rounded-2xl divide-y divide-white/5 bg-black/20">
                    {batchExps.length === 0 ? (
                      <div className="p-6 text-center text-white/30 text-xs italic">
                        No expenses recorded yet. Use the form above to log transport, meals, permits or guide costs.
                      </div>
                    ) : (
                      batchExps.map((exp) => (
                        <div key={exp.id} className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-white/[0.02]">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{exp.description}</span>
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/60">
                                {exp.category}
                              </span>
                            </div>
                            <span className="text-[10px] text-white/40 block mt-0.5">
                              {exp.date ? new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Today"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-bold text-orange-400">
                              ₹{exp.amount.toLocaleString("en-IN")}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteExpense(exp.id)}
                              title="Delete this expense"
                              className="p-1 text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => downloadProfitLossStatement(expenseModalBatch)}
                  className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet size={13} />
                  <span>Download P&amp;L Report (.csv)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExpenseModalBatch(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: BOOKING FINANCIALS (DISCOUNT, PAID, REMAINING)
         ══════════════════════════════════════════════════════════════ */}
      {financialsModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2ecc71] bg-[#2ecc71]/10 px-2 py-0.5 rounded-md">
                  Booking #{financialsModalOrder.id.slice(0, 8)}
                </span>
                <h3 className="text-white font-bold text-base mt-1 flex items-center gap-2">
                  <IndianRupee className="text-[#2ecc71]" size={18} />
                  <span>Edit Booking Financials</span>
                </h3>
                <p className="text-white/40 text-xs">
                  {financialsModalOrder.userName || "Traveler"} · {financialsModalOrder.trekName || "Platform Booking"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFinancialsModalOrder(null)}
                className="text-white/40 hover:text-white p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-white/70 block mb-1 font-semibold">Total Base Booking Amount (₹) *</label>
                <input
                  type="number"
                  value={finTotalAmount}
                  onChange={(e) => {
                    const total = Number(e.target.value);
                    setFinTotalAmount(total);
                    setFinRemainingCash(Math.max(0, total - finDiscount - finAdvancePaid));
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#2ecc71]/40"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-white/70 font-semibold">Discount Concession (₹)</label>
                  <span className="text-[10px] text-orange-400">Deducted from balance</span>
                </div>
                <input
                  type="number"
                  value={finDiscount}
                  onChange={(e) => {
                    const d = Number(e.target.value);
                    setFinDiscount(d);
                    setFinRemainingCash(Math.max(0, finTotalAmount - d - finAdvancePaid));
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-orange-400 font-mono focus:outline-none focus:border-[#2ecc71]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 block mb-1 font-semibold">Paid Amount (₹)</label>
                  <input
                    type="number"
                    value={finAdvancePaid}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      setFinAdvancePaid(p);
                      setFinRemainingCash(Math.max(0, finTotalAmount - finDiscount - p));
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-emerald-400 font-mono focus:outline-none focus:border-[#2ecc71]/40"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-1 font-semibold">Remaining Balance Due (₹)</label>
                  <input
                    type="number"
                    value={finRemainingCash}
                    onChange={(e) => setFinRemainingCash(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-amber-400 font-mono focus:outline-none focus:border-[#2ecc71]/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-semibold">Customer Mobile Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={finUserPhone}
                  onChange={(e) => setFinUserPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#2ecc71]/40"
                />
                <span className="text-[10px] text-white/40 mt-0.5 block">
                  Used for WhatsApp rosters, ticket vouchers, and trek coordinator communication.
                </span>
              </div>

              {/* Quick Math Shortcuts */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setFinAdvancePaid(Math.max(0, finTotalAmount - finDiscount));
                    setFinRemainingCash(0);
                    setFinCashCollected(true);
                  }}
                  className="px-2.5 py-1 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-white/10 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  ✓ Mark Fully Paid
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFinRemainingCash(Math.max(0, finTotalAmount - finDiscount - finAdvancePaid));
                  }}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-lg text-[11px] transition-colors cursor-pointer"
                >
                  Recalculate Due
                </button>
              </div>

              {/* Cash Collected Checkbox */}
              <label className="flex items-center gap-2 pt-2 border-t border-white/10 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={finCashCollected}
                  onChange={(e) => setFinCashCollected(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-[#2ecc71] focus:ring-0 cursor-pointer"
                />
                <span className="text-white/80 text-xs">Cash payment collected &amp; confirmed</span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFinancialsModalOrder(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={finSaving}
                onClick={handleSaveFinancials}
                className="px-5 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-black rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {finSaving && <Loader2 size={13} className="animate-spin" />}
                <span>Save Financials</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: BATCH BULK EDIT FINANCIALS (MULTI-SELECT NAMES & FILL DATA)
         ══════════════════════════════════════════════════════════════ */}
      {bulkFinBatch && (() => {
        const filteredBatchOrders = bulkFinBatch.orders.filter((o) => {
          if (!bulkFinSearch.trim()) return true;
          const q = bulkFinSearch.toLowerCase();
          return (
            (o.userName || "").toLowerCase().includes(q) ||
            getCustomerPhone(o).includes(q) ||
            (o.id || "").toLowerCase().includes(q)
          );
        });

        const allFilteredSelected =
          filteredBatchOrders.length > 0 &&
          filteredBatchOrders.every((o) => bulkFinSelectedOrderIds.includes(o.id));

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in">
            <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-white/[0.01]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2ecc71] bg-[#2ecc71]/10 px-2 py-0.5 rounded-md">
                      {bulkFinBatch.batchName}
                    </span>
                    <span className="text-[11px] text-white/40 font-medium">
                      {bulkFinBatch.trekName}
                    </span>
                  </div>
                  <h3 className="text-white text-base sm:text-lg font-bold mt-1 flex items-center gap-2">
                    <SlidersHorizontal className="text-[#2ecc71]" size={18} />
                    <span>Bulk Update Batch Bookings &amp; Financials</span>
                  </h3>
                  <p className="text-white/40 text-xs">
                    Select booking names, then choose what data to fill (Discount, Paid Amount, Remaining Balance, or Total).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBulkFinBatch(null)}
                  className="text-white/40 hover:text-white p-1 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body: Two Column / Responsive Layout */}
              <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Column 1: Select Booking Names (Multi-Select) */}
                <div className="md:col-span-6 flex flex-col space-y-3 border border-white/10 rounded-2xl p-4 bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
                        <Users size={14} className="text-[#2ecc71]" />
                        <span>1. Select Booking Names</span>
                      </h4>
                      <span className="text-[11px] text-white/40">
                        {bulkFinSelectedOrderIds.length} of {bulkFinBatch.orders.length} bookings selected
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleSelectAllBulkOrders(filteredBatchOrders)}
                        className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg text-[11px] font-medium border border-white/10 transition-colors cursor-pointer"
                      >
                        {allFilteredSelected ? "Deselect All" : "Select All"}
                      </button>
                    </div>
                  </div>

                  {/* Search Filter */}
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      placeholder="Search booking name or mobile..."
                      value={bulkFinSearch}
                      onChange={(e) => setBulkFinSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]/40"
                    />
                  </div>

                  {/* Multi-select Bookings List */}
                  <div className="flex-1 max-h-[380px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-white/5">
                    {filteredBatchOrders.length === 0 ? (
                      <div className="py-8 text-center text-white/30 text-xs italic">
                        No bookings match your search.
                      </div>
                    ) : (
                      filteredBatchOrders.map((o) => {
                        const isSelected = bulkFinSelectedOrderIds.includes(o.id);
                        const discount = o.discount ?? o.couponDiscount ?? 0;
                        const paid =
                          o.advancePaid !== undefined
                            ? o.advancePaid
                            : o.paymentType !== "offline"
                              ? o.totalAmount
                              : 0;
                        const due =
                          o.remainingCash !== undefined
                            ? o.remainingCash
                            : o.paymentType === "offline"
                              ? o.totalAmount
                              : 0;

                        return (
                          <div
                            key={o.id}
                            onClick={() => toggleSelectBulkOrder(o.id)}
                            className={`pt-2 pb-2 px-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-2.5 ${isSelected
                                ? "bg-[#2ecc71]/10 border border-[#2ecc71]/30 text-white"
                                : "hover:bg-white/[0.03] text-white/70 border border-transparent"
                              }`}
                          >
                            <div className="mt-0.5">
                              {isSelected ? (
                                <CheckSquare size={16} className="text-[#2ecc71]" />
                              ) : (
                                <Square size={16} className="text-white/30" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs text-white truncate">
                                  {o.userName || "Guest Traveler"}
                                </span>
                                <span className="text-[10px] font-mono text-white/30">
                                  #{o.id.slice(0, 6)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-white/40 mt-0.5">
                                <span>📞 {getCustomerPhone(o) || "No Phone"}</span>
                                <span>·</span>
                                <span>👥 {o.persons?.length || 1} Trekkers</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-[10px] font-mono">
                                <span className="text-white/60">Total: ₹{o.totalAmount}</span>
                                {discount > 0 && <span className="text-orange-400">Disc: -₹{discount}</span>}
                                <span className="text-emerald-400">Paid: ₹{paid}</span>
                                <span className={due > 0 ? "text-amber-400 font-bold" : "text-white/30"}>
                                  Due: ₹{due}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Column 2: What Data to Fill / Update */}
                <div className="md:col-span-6 flex flex-col space-y-3 border border-white/10 rounded-2xl p-4 bg-white/[0.02]">
                  <div>
                    <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
                      <Tag size={14} className="text-[#2ecc71]" />
                      <span>2. Select Data Fields to Fill &amp; Update</span>
                    </h4>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      Check the box for each field you want to apply to all selected bookings.
                    </p>
                  </div>

                  <div className="space-y-3.5 text-xs overflow-y-auto max-h-[420px] pr-1">
                    {/* Field 1: Discount */}
                    <div className={`p-3 rounded-xl border transition-all ${bulkApplyDiscount ? "bg-orange-500/10 border-orange-500/30" : "bg-white/[0.02] border-white/5"}`}>
                      <label className="flex items-center gap-2 font-semibold text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={bulkApplyDiscount}
                          onChange={(e) => setBulkApplyDiscount(e.target.checked)}
                          className="rounded border-white/20 bg-white/5 text-orange-400 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-orange-400">🏷️ Apply Discount (₹)</span>
                      </label>
                      {bulkApplyDiscount && (
                        <div className="mt-2 pl-6">
                          <input
                            type="number"
                            placeholder="e.g. 500"
                            value={bulkDiscountValue || ""}
                            onChange={(e) => setBulkDiscountValue(Number(e.target.value))}
                            className="w-full bg-black/40 border border-orange-500/30 rounded-xl px-3 py-1.5 text-white font-mono focus:outline-none focus:border-orange-400 text-xs"
                          />
                          <span className="text-[10px] text-white/40 mt-1 block">
                            Sets this discount concession on all selected bookings.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Field 2: Paid Amount */}
                    <div className={`p-3 rounded-xl border transition-all ${bulkApplyPaid ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/[0.02] border-white/5"}`}>
                      <label className="flex items-center gap-2 font-semibold text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={bulkApplyPaid}
                          onChange={(e) => setBulkApplyPaid(e.target.checked)}
                          className="rounded border-white/20 bg-white/5 text-[#2ecc71] focus:ring-0 cursor-pointer"
                        />
                        <span className="text-emerald-400">💵 Set Paid / Advance Amount (₹)</span>
                      </label>
                      {bulkApplyPaid && (
                        <div className="mt-2 pl-6">
                          <input
                            type="number"
                            placeholder="e.g. 1000"
                            value={bulkPaidValue || ""}
                            onChange={(e) => setBulkPaidValue(Number(e.target.value))}
                            className="w-full bg-black/40 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-white font-mono focus:outline-none focus:border-emerald-400 text-xs"
                          />
                          <span className="text-[10px] text-white/40 mt-1 block">
                            Sets amount collected / advance paid across selected bookings.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Field 3: Remaining Balance Due */}
                    <div className={`p-3 rounded-xl border transition-all ${bulkApplyRemaining ? "bg-amber-500/10 border-amber-500/30" : "bg-white/[0.02] border-white/5"}`}>
                      <label className="flex items-center gap-2 font-semibold text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={bulkApplyRemaining}
                          onChange={(e) => setBulkApplyRemaining(e.target.checked)}
                          className="rounded border-white/20 bg-white/5 text-amber-400 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-amber-400">💰 Update Remaining Balance Due (₹)</span>
                      </label>
                      {bulkApplyRemaining && (
                        <div className="mt-2 pl-6 space-y-2">
                          <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                            <input
                              type="radio"
                              name="remainingMode"
                              checked={bulkRemainingMode === "auto"}
                              onChange={() => setBulkRemainingMode("auto")}
                              className="text-amber-400 focus:ring-0 cursor-pointer"
                            />
                            <span className="font-medium text-[11px]">
                              Auto-calculate: Total − Discount − Paid (Per Booking)
                            </span>
                          </label>
                          <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                            <input
                              type="radio"
                              name="remainingMode"
                              checked={bulkRemainingMode === "fixed"}
                              onChange={() => setBulkRemainingMode("fixed")}
                              className="text-amber-400 focus:ring-0 cursor-pointer"
                            />
                            <span className="font-medium text-[11px]">Fixed Balance Amount (₹)</span>
                          </label>
                          {bulkRemainingMode === "fixed" && (
                            <input
                              type="number"
                              placeholder="e.g. 0 (Fully settled) or 500"
                              value={bulkRemainingValue || ""}
                              onChange={(e) => setBulkRemainingValue(Number(e.target.value))}
                              className="w-full bg-black/40 border border-amber-500/30 rounded-xl px-3 py-1.5 text-white font-mono focus:outline-none focus:border-amber-400 text-xs"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Field 4: Total Amount */}
                    <div className={`p-3 rounded-xl border transition-all ${bulkApplyTotal ? "bg-blue-500/10 border-blue-500/30" : "bg-white/[0.02] border-white/5"}`}>
                      <label className="flex items-center gap-2 font-semibold text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={bulkApplyTotal}
                          onChange={(e) => setBulkApplyTotal(e.target.checked)}
                          className="rounded border-white/20 bg-white/5 text-blue-400 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-blue-400">💳 Override Total Base Amount (₹)</span>
                      </label>
                      {bulkApplyTotal && (
                        <div className="mt-2 pl-6">
                          <input
                            type="number"
                            placeholder="e.g. 2500"
                            value={bulkTotalValue || ""}
                            onChange={(e) => setBulkTotalValue(Number(e.target.value))}
                            className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-3 py-1.5 text-white font-mono focus:outline-none focus:border-blue-400 text-xs"
                          />
                          <span className="text-[10px] text-white/40 mt-1 block">
                            Sets the base total fare for all selected bookings.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Field 5: Payment Status */}
                    <div className={`p-3 rounded-xl border transition-all ${bulkApplyStatus ? "bg-purple-500/10 border-purple-500/30" : "bg-white/[0.02] border-white/5"}`}>
                      <label className="flex items-center gap-2 font-semibold text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={bulkApplyStatus}
                          onChange={(e) => setBulkApplyStatus(e.target.checked)}
                          className="rounded border-white/20 bg-white/5 text-purple-400 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-purple-400">📌 Update Booking Status</span>
                      </label>
                      {bulkApplyStatus && (
                        <div className="mt-2 pl-6">
                          <select
                            value={bulkStatusValue}
                            onChange={(e) => setBulkStatusValue(e.target.value as OrderStatus)}
                            className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-purple-400"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="delivered">Delivered / Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Field 6: Cash Collected */}
                    <div className={`p-3 rounded-xl border transition-all ${bulkApplyCashCollected ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/[0.02] border-white/5"}`}>
                      <label className="flex items-center gap-2 font-semibold text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={bulkApplyCashCollected}
                          onChange={(e) => setBulkApplyCashCollected(e.target.checked)}
                          className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-cyan-400">🤝 Cash Collected in Hand</span>
                      </label>
                      {bulkApplyCashCollected && (
                        <div className="mt-2 pl-6">
                          <label className="flex items-center gap-2 text-white cursor-pointer">
                            <input
                              type="checkbox"
                              checked={bulkCashCollectedValue}
                              onChange={(e) => setBulkCashCollectedValue(e.target.checked)}
                              className="rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0 cursor-pointer"
                            />
                            <span className="text-[11px] text-white/80">Mark as collected in hand</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
                <div className="text-xs text-white/40">
                  <span className="font-semibold text-white/80">
                    {bulkFinSelectedOrderIds.length} booking(s)
                  </span>{" "}
                  selected to be updated.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBulkFinBatch(null)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={bulkFinSaving || bulkFinSelectedOrderIds.length === 0}
                    onClick={handleApplyBulkFinancials}
                    className="px-5 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-black font-bold rounded-xl text-xs transition-colors disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                  >
                    {bulkFinSaving && <Loader2 size={13} className="animate-spin" />}
                    <span>Update {bulkFinSelectedOrderIds.length} Selected Bookings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: WHATSAPP DIRECT MESSAGE & AUTO TEMPLATES
         ══════════════════════════════════════════════════════════════ */}
      {whatsappModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">WhatsApp Communication</h3>
                  <p className="text-white/40 text-xs">
                    To: <strong className="text-white/80">{whatsappModalOrder.userName || "Customer"}</strong> ({getCustomerPhone(whatsappModalOrder) || "No Phone"})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWhatsappModalOrder(null)}
                className="text-white/40 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Template Selection Pills */}
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-semibold block">Select Template:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleTemplateChange("reminder")}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${whatsappTemplate === "reminder"
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-400 font-bold"
                      : "bg-white/5 border-white/10 text-white/70 hover:text-white"
                    }`}
                >
                  <span className="block text-[11px]">💰 Payment Due Reminder</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTemplateChange("confirmation")}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${whatsappTemplate === "confirmation"
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold"
                      : "bg-white/5 border-white/10 text-white/70 hover:text-white"
                    }`}
                >
                  <span className="block text-[11px]">🎫 Booking Confirmation</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTemplateChange("group_invite")}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${whatsappTemplate === "group_invite"
                      ? "bg-blue-500/15 border-blue-500/40 text-blue-400 font-bold"
                      : "bg-white/5 border-white/10 text-white/70 hover:text-white"
                    }`}
                >
                  <span className="block text-[11px]">👥 Group Invite Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTemplateChange("pickup")}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${whatsappTemplate === "pickup"
                      ? "bg-purple-500/15 border-purple-500/40 text-purple-400 font-bold"
                      : "bg-white/5 border-white/10 text-white/70 hover:text-white"
                    }`}
                >
                  <span className="block text-[11px]">🚌 Pickup &amp; Timing Alert</span>
                </button>
              </div>
            </div>

            {/* Editable Message Box */}
            <div className="space-y-1">
              <label className="text-white/60 text-xs font-semibold block">Message Preview (Editable):</label>
              <textarea
                rows={6}
                value={whatsappMessage}
                onChange={(e) => {
                  setWhatsappMessage(e.target.value);
                  setWhatsappTemplate("custom");
                }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-[#25D366]/50 resize-none leading-relaxed"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-[11px] text-white/30">Opens WhatsApp app or web directly</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWhatsappModalOrder(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="px-5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#25D366]/20"
                >
                  <Send size={13} />
                  <span>Send on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: CUSTOMER PRINTABLE BOOKING VOUCHER / TICKET
         ══════════════════════════════════════════════════════════════ */}
      {voucherModalOrder && (() => {
        const o = voucherModalOrder;
        const discount = o.discount ?? o.couponDiscount ?? 0;
        const paid = o.advancePaid !== undefined ? o.advancePaid : (o.paymentType !== "offline" ? o.totalAmount : 0);
        const due = o.remainingCash !== undefined ? o.remainingCash : (o.paymentType === "offline" ? o.totalAmount : 0);
        const persons = o.persons && o.persons.length > 0
          ? o.persons
          : [{ name: o.userName || "Traveler", age: undefined, gender: undefined, foodPreference: "veg" as const }];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in overflow-y-auto">
            <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
              {/* Header Toolbar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 no-print">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2ecc71] bg-[#2ecc71]/10 px-2.5 py-0.5 rounded-md">
                    Official Travel Voucher
                  </span>
                  <span className="text-white/40 text-xs">#{o.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 bg-[#2ecc71] hover:bg-[#27ae60] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>Print Ticket / Voucher</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoucherModalOrder(null)}
                    className="text-white/40 hover:text-white p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Printable Voucher Paper Box */}
              <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-5 text-white">
                {/* Brand Header */}
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                      <Compass className="text-[#2ecc71]" size={20} />
                      <span>VISIT KOKAN EXPEDITIONS</span>
                    </h2>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      Government Recognized Adventure Tourism &amp; Eco Tours
                    </p>
                    <p className="text-[10px] text-white/40">
                      Helpline: +91 98765 43210 · help@visitkokan.in · visitkokan.in
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs text-white/40 block">Booking Reference</span>
                    <strong className="text-sm text-[#2ecc71] tracking-wider">#{o.id.slice(0, 8).toUpperCase()}</strong>
                    <span className="text-[10px] text-white/30 block mt-0.5">
                      Issued: {new Date().toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Trip Details Card */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-white/[0.03] border border-white/5 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/40 block">Trek Expedition</span>
                    <strong className="text-white block mt-0.5">{o.trekName || "Expedition"}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/40 block">Departure Date</span>
                    <strong className="text-[#2ecc71] block mt-0.5">{o.trekDate || "Upcoming Date"}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/40 block">Trip Batch</span>
                    <span className="text-white/80 block mt-0.5">{o.batchName || "Standard Batch"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/40 block">Boarding Point</span>
                    <strong className="text-amber-400 block mt-0.5">{o.pickupLocation || "Basepoint"}</strong>
                  </div>
                </div>

                {/* Travelers Manifest Roster */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-white/60 text-[11px]">
                      Confirmed Travelers Roster ({persons.length} Persons)
                    </span>
                    <span className="text-white/40 text-[11px]">
                      Booker: {o.userName} ({getCustomerPhone(o) || "N/A"})
                    </span>
                  </div>

                  <table className="w-full text-left text-xs border border-white/10 rounded-xl overflow-hidden">
                    <thead className="bg-white/5 text-white/40 text-[10px] uppercase font-mono">
                      <tr>
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">Passenger Name</th>
                        <th className="py-2 px-3">Age / Gender</th>
                        <th className="py-2 px-3">Meal Preference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {persons.map((p, idx) => (
                        <tr key={idx} className="bg-white/[0.01]">
                          <td className="py-2 px-3 font-mono text-white/30">{idx + 1}</td>
                          <td className="py-2 px-3 font-semibold text-white">{p.name || `Traveler ${idx + 1}`}</td>
                          <td className="py-2 px-3 text-white/60">{p.age ? `${p.age} yrs` : "-"} · {p.gender || "-"}</td>
                          <td className="py-2 px-3 font-medium">
                            {p.foodPreference === "non-veg" ? "🍗 Non-Veg" : "🥗 Vegetarian"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Breakdown Receipt */}
                <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-bold">Payment Status</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`font-bold uppercase tracking-wider text-[11px] ${due <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                        {due <= 0 ? "✓ FULLY PAID" : "⚠️ BALANCE PENDING"}
                      </span>
                      <span className="text-white/30 text-[11px]">({o.paymentType || "online"})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-white/40 block">Total Fare</span>
                      <span className="text-white font-bold">₹{o.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                    {discount > 0 && (
                      <div>
                        <span className="text-[10px] text-orange-400 block">Discount</span>
                        <span className="text-orange-400 font-bold">-₹{discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] text-emerald-400 block">Amount Paid</span>
                      <span className="text-emerald-400 font-bold">₹{paid.toLocaleString("en-IN")}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 block">Balance Due</span>
                      <span className="text-amber-400 font-bold">₹{due.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Instructions & Guidelines */}
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-[10px] text-white/50 space-y-1">
                  <strong className="text-white/70 block uppercase">Important Traveler Instructions:</strong>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Please report at your pickup stop 15 minutes before the scheduled bus departure.</li>
                    <li>Carry this ticket voucher (digital copy or printout) along with a valid Govt. ID card.</li>
                    <li>Pack 2L drinking water, trekking shoes with good grip, and light rain/wind gear.</li>
                    <li>Strict eco-rule: Plastic littering is prohibited in Kokan ecological reserves.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: RESCHEDULE / SHIFT TO ANOTHER BATCH
         ══════════════════════════════════════════════════════════════ */}
      {shiftBatchOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Repeat size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Reschedule / Shift Batch</h3>
                  <p className="text-white/40 text-xs">
                    Booking #{shiftBatchOrder.id.slice(0, 8)} ({shiftBatchOrder.userName || "Customer"})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShiftBatchOrder(null)}
                className="text-white/40 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Current Batch Info */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs space-y-1">
              <span className="text-[10px] text-white/40 uppercase font-bold block">Current Assignment</span>
              <div className="text-white font-semibold">
                🧗 {shiftBatchOrder.trekName || "Expedition"}
              </div>
              <div className="text-white/60 text-[11px]">
                Batch: <span className="text-emerald-400">{shiftBatchOrder.batchName || "Unassigned"}</span> · Date: {shiftBatchOrder.trekDate || "Not Set"}
              </div>
            </div>

            {/* Target Batch Selector */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-white/70 block mb-1 font-semibold">Select Destination Batch *</label>
                <select
                  value={shiftTargetBatchName}
                  onChange={(e) => setShiftTargetBatchName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400 cursor-pointer"
                >
                  <option value="" className="bg-[#141414]">Choose an existing batch...</option>
                  {distinctBatches.map((b) => (
                    <option key={b} value={b} className="bg-[#141414]">
                      {b}
                    </option>
                  ))}
                  <option value="Batch 1 - Morning Departure" className="bg-[#141414]">+ Batch 1 - Morning Departure</option>
                  <option value="Batch 2 - Afternoon Departure" className="bg-[#141414]">+ Batch 2 - Afternoon Departure</option>
                  <option value="Next Weekend Batch" className="bg-[#141414]">+ Next Weekend Batch</option>
                </select>
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-semibold">Or Enter Custom Batch Name</label>
                <input
                  type="text"
                  placeholder="e.g. Batch 3 - Special Holiday Departure"
                  value={shiftTargetBatchName}
                  onChange={(e) => setShiftTargetBatchName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-semibold">New Trip Departure Date</label>
                <input
                  type="date"
                  value={shiftTargetDate}
                  onChange={(e) => setShiftTargetDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShiftBatchOrder(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={shiftSaving || !shiftTargetBatchName.trim()}
                onClick={handleConfirmShiftBatch}
                className="px-5 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
              >
                {shiftSaving && <Loader2 size={13} className="animate-spin" />}
                <span>Confirm Batch Transfer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

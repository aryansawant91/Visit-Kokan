"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Send,
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  Copy,
  ExternalLink,
  Calendar,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Clock,
  ArrowUpDown,
  Tag,
  Mountain,
  RefreshCw,
  SlidersHorizontal,
  Check,
  CheckSquare,
  Square,
  X,
  FileSpreadsheet,
  Play,
  SkipForward,
  RotateCcw,
  CheckCheck,
  Flame,
  Info,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface UniqueTrekker {
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

interface StatsData {
  totalUniqueTrekkers: number;
  withPhoneCount: number;
  vipCount: number;
  activeCount: number;
  lapsedCount: number;
  coldCount: number;
  totalRevenueGenerated: number;
}

interface CampaignQueueItem {
  id: string;
  name: string;
  phone: string;
  lastTrekName: string;
  daysSinceLastTrek: number;
  trekker: UniqueTrekker;
  status: "pending" | "sent" | "skipped";
}

type SegmentFilter = "all" | "lapsed" | "active" | "vip" | "cold" | "has_phone";
type TemplateType =
  | "welcome_back"
  | "weekend_alert"
  | "season_launch"
  | "review_request"
  | "custom";

const DEFAULT_CUSTOM_MESSAGE = `Hey {name}! 🏔️
We're gearing up for an unforgettable weekend expedition with Visit Kokan.
Because you loved conquering {lastTrek} with us, we wanted to offer you early batch access!

🎁 Use promo code *{code}* to unlock *{discount}* on your booking!
⚡ Check live weekend batches: {link}

See you on the trail! 🥾`;

export default function TrekkerMarketingMessagesPage() {
  const [trekkers, setTrekkers] = useState<UniqueTrekker[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<SegmentFilter>("all");
  const [selectedTrekFilter, setSelectedTrekFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"recency" | "treks" | "spend" | "name">("recency");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selection for bulk broadcast / export
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // WhatsApp Campaign Modal & Queue
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerTrekker, setComposerTrekker] = useState<UniqueTrekker | null>(null);
  const [campaignQueue, setCampaignQueue] = useState<CampaignQueueItem[]>([]);
  const [activeQueueIndex, setActiveQueueIndex] = useState(0);

  // Template Options
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("welcome_back");
  const [customPromoCode, setCustomPromoCode] = useState("TREK10");
  const [customDiscountText, setCustomDiscountText] = useState("10% OFF");
  const [customTrekMention, setCustomTrekMention] = useState("");
  const [customMessageBody, setCustomMessageBody] = useState(DEFAULT_CUSTOM_MESSAGE);

  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/admin/marketing/trekkers");
      if (!res.ok) throw new Error("Failed to load trekker audience");
      const data = await res.json();
      if (data.success) {
        setTrekkers(data.trekkers || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error("Error loading trekker marketing audience:", err);
      toast.error("Failed to load trekker data. Please retry.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Distinct list of all treks from all unique trekkers
  const distinctTreks = useMemo(() => {
    const set = new Set<string>();
    trekkers.forEach((t) => t.treks.forEach((trek) => set.add(trek)));
    return Array.from(set).sort();
  }, [trekkers]);

  // Filtered & sorted trekker audience
  const filteredTrekkers = useMemo(() => {
    return trekkers
      .filter((t) => {
        // Segment filter
        if (selectedSegment === "lapsed" && t.segment !== "lapsed") return false;
        if (selectedSegment === "active" && t.segment !== "active" && t.segment !== "new") return false;
        if (selectedSegment === "vip" && t.segment !== "vip") return false;
        if (selectedSegment === "cold" && t.segment !== "cold") return false;
        if (selectedSegment === "has_phone" && !t.phone) return false;

        // Trek filter
        if (selectedTrekFilter !== "all" && !t.treks.includes(selectedTrekFilter)) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = t.name.toLowerCase().includes(q);
          const matchPhone = t.phone.toLowerCase().includes(q);
          const matchEmail = t.email.toLowerCase().includes(q);
          const matchTrek = t.treks.some((trek) => trek.toLowerCase().includes(q));
          if (!matchName && !matchPhone && !matchEmail && !matchTrek) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === "recency") {
          comparison = a.daysSinceLastTrek - b.daysSinceLastTrek; // lower days = more recent
        } else if (sortBy === "treks") {
          comparison = b.totalTreksCount - a.totalTreksCount;
        } else if (sortBy === "spend") {
          comparison = b.totalSpent - a.totalSpent;
        } else if (sortBy === "name") {
          comparison = a.name.localeCompare(b.name);
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [trekkers, selectedSegment, selectedTrekFilter, searchQuery, sortBy, sortOrder]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredTrekkers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTrekkers.map((t) => t.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Helper to format clean Indian mobile
  const formatPhoneDisplay = (phone: string) => {
    if (!phone) return "";
    const clean = phone.replace(/\D/g, "");
    if (clean.length === 10) {
      return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
    }
    return phone;
  };

  // Build personalized WhatsApp text for a specific trekker
  const buildPersonalizedMessage = (t: UniqueTrekker) => {
    const firstName = (t.name || "Explorer").trim().split(" ")[0] || "Explorer";
    const trekName = customTrekMention.trim() || t.lastTrekName || "Sahyadri Trek";
    const daysAgo = t.daysSinceLastTrek;
    const promo = customPromoCode.trim() || "TREK10";
    const discount = customDiscountText.trim() || "10% OFF";
    const websiteLink = "https://visitkokan.com/treks";

    if (selectedTemplate === "welcome_back") {
      return `Hey ${firstName}! 🏔️ It's been ${daysAgo} days since your memorable trek to *${t.lastTrekName || "the Sahyadris"}* with Visit Kokan.

We miss having you on the trails! The weather is prime and new batches are now open for booking.

🎁 As our returning trekker, take *${discount}* on your next trek with code: *${promo}*
Check this weekend's live batches: ${websiteLink}

See you in the Sahyadris soon! 🥾`;
    }

    if (selectedTemplate === "weekend_alert") {
      return `Hi ${firstName}! 🎒 Are you ready for your next weekend escape?

Our upcoming expedition to *${trekName}* is departing this Saturday night! We only have a few seats remaining on the AC bus.

⚡ Pickup Points: Borivali, Andheri, Sion, Chembur, Vashi & Panvel.
🍛 Hot local village meals & trek guide included.

Lock your slot now before the batch closes: ${websiteLink}
Or reply directly here if you have questions! 👋`;
    }

    if (selectedTemplate === "season_launch") {
      return `Hello ${firstName}! 🌿 The Sahyadri hills are alive with misty summits, roaring waterfalls & lush valleys!

As a valued member of our Visit Kokan trekking community, here is early access to our seasonal trail calendar:
• Sunrise Peaks: Kalsubai, Harishchandragad
• Hidden Waterfalls: Devkund, Secret Forest Cascades
• Cliff Forts: Harihar & Rajmachi

Grab your group slots early: ${websiteLink}
Let us know which trail you want to conquer next! 🧗‍♂️`;
    }

    if (selectedTemplate === "review_request") {
      return `Hey ${firstName}! ⭐ Hope you had an extraordinary adventure on *${t.lastTrekName || "your trek"}* with our trek leads and fellow participants!

Your feedback helps us make every weekend trek even better. Could you take 30 seconds to share your review and favorite photo from the trip?
Review link: ${websiteLink}

Thank you for trekking with Visit Kokan! 💚`;
    }

    // Custom template
    const body = customMessageBody.trim() || DEFAULT_CUSTOM_MESSAGE;
    return body
      .replace(/{name}/g, firstName)
      .replace(/{fullName}/g, t.name || firstName)
      .replace(/{lastTrek}/g, t.lastTrekName || "Sahyadri Trek")
      .replace(/{days}/g, String(daysAgo))
      .replace(/{phone}/g, t.phone || "")
      .replace(/{code}/g, promo)
      .replace(/{discount}/g, discount)
      .replace(/{link}/g, websiteLink);
  };

  // Open Campaign Queue Modal (for selected users, all filtered, or individual)
  const handleOpenCampaignModal = (singleTrekker?: UniqueTrekker) => {
    let targets: UniqueTrekker[] = [];

    if (singleTrekker) {
      targets = [singleTrekker];
    } else if (selectedIds.length > 0) {
      targets = trekkers.filter((t) => selectedIds.includes(t.id));
    } else {
      targets = filteredTrekkers;
    }

    const validTargets = targets.filter((t) => {
      const clean = (t.phone || "").replace(/\D/g, "");
      return clean.length >= 10;
    });

    if (validTargets.length === 0) {
      toast.error("No travelers with valid phone numbers found in selection.");
      return;
    }

    if (validTargets.length < targets.length) {
      const omitted = targets.length - validTargets.length;
      toast(`${omitted} traveler(s) without phone numbers were excluded from queue.`, {
        icon: "ℹ️",
      });
    }

    const queue: CampaignQueueItem[] = validTargets.map((t) => ({
      id: t.id,
      name: t.name,
      phone: t.phone,
      lastTrekName: t.lastTrekName,
      daysSinceLastTrek: t.daysSinceLastTrek,
      trekker: t,
      status: "pending",
    }));

    setCampaignQueue(queue);
    setActiveQueueIndex(0);
    setComposerTrekker(queue[0].trekker);
    setComposerOpen(true);
  };

  // Launch WhatsApp directly for a single trekker (from table row)
  const handleLaunchDirectWhatsApp = (t: UniqueTrekker) => {
    const rawDigits = (t.phone || "").replace(/\D/g, "");
    if (rawDigits.length < 10) {
      toast.error("Invalid phone number");
      return;
    }
    const fullPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
    const text = encodeURIComponent(buildPersonalizedMessage(t));
    const url = `https://wa.me/${fullPhone}?text=${text}`;
    window.open(url, "_blank");
  };

  // Send WhatsApp to an item in the campaign queue
  const handleSendQueueItem = (index: number) => {
    const item = campaignQueue[index];
    if (!item) return;

    const rawDigits = item.phone.replace(/\D/g, "");
    if (rawDigits.length < 10) {
      toast.error(`Invalid mobile number for ${item.name}`);
      return;
    }

    const fullPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
    const text = encodeURIComponent(buildPersonalizedMessage(item.trekker));
    const url = `https://wa.me/${fullPhone}?text=${text}`;

    // Open WhatsApp Web/App
    window.open(url, "_blank");

    // Mark as sent in queue
    setCampaignQueue((prev) =>
      prev.map((q, idx) => (idx === index ? { ...q, status: "sent" } : q))
    );
    toast.success(`Opened WhatsApp for ${item.name}! 💬`);

    // Auto-advance to next pending item if one exists
    const nextPending = campaignQueue.findIndex(
      (q, idx) => idx > index && q.status === "pending"
    );
    if (nextPending !== -1) {
      setActiveQueueIndex(nextPending);
      setComposerTrekker(campaignQueue[nextPending].trekker);
    } else {
      const anyPending = campaignQueue.findIndex((q) => q.status === "pending");
      if (anyPending !== -1 && anyPending !== index) {
        setActiveQueueIndex(anyPending);
        setComposerTrekker(campaignQueue[anyPending].trekker);
      }
    }
  };

  // Skip queue item without opening
  const handleSkipQueueItem = (index: number) => {
    setCampaignQueue((prev) =>
      prev.map((q, idx) => (idx === index ? { ...q, status: "skipped" } : q))
    );
    const nextPending = campaignQueue.findIndex(
      (q, idx) => idx > index && q.status === "pending"
    );
    if (nextPending !== -1) {
      setActiveQueueIndex(nextPending);
      setComposerTrekker(campaignQueue[nextPending].trekker);
    }
  };

  // Mark all as sent
  const handleMarkAllSent = () => {
    setCampaignQueue((prev) => prev.map((q) => ({ ...q, status: "sent" })));
    toast.success("Marked all recipients as Sent.");
  };

  // Reset queue
  const handleResetQueue = () => {
    setCampaignQueue((prev) => prev.map((q) => ({ ...q, status: "pending" })));
    setActiveQueueIndex(0);
    if (campaignQueue[0]) {
      setComposerTrekker(campaignQueue[0].trekker);
    }
    toast.success("Queue reset to pending.");
  };

  // Insert variable tag into custom message body
  const handleInsertTag = (tag: string) => {
    setCustomMessageBody((prev) => {
      if (!prev) return tag;
      return `${prev} ${tag}`;
    });
    toast.success(`Inserted ${tag}`);
  };

  // Copy broadcast numbers (comma-separated or lines)
  const handleCopyPhoneNumbers = (format: "comma" | "lines" = "comma") => {
    const targetTrekkers =
      selectedIds.length > 0
        ? trekkers.filter((t) => selectedIds.includes(t.id) && t.phone)
        : filteredTrekkers.filter((t) => t.phone);

    if (targetTrekkers.length === 0) {
      toast.error("No valid phone numbers found in current selection.");
      return;
    }

    const numbers = targetTrekkers.map((t) => {
      const clean = t.phone.replace(/\D/g, "");
      return clean.length === 10 ? `+91${clean}` : clean;
    });

    const textToCopy = format === "comma" ? numbers.join(", ") : numbers.join("\n");
    navigator.clipboard.writeText(textToCopy);
    toast.success(`Copied ${numbers.length} phone numbers to clipboard! 📋`);
  };

  // Export audience CSV
  const handleExportCSV = () => {
    const target =
      selectedIds.length > 0
        ? trekkers.filter((t) => selectedIds.includes(t.id))
        : filteredTrekkers;

    if (target.length === 0) {
      toast.error("No trekkers to export.");
      return;
    }

    let csv = `VISIT KOKAN - UNIQUE TREKKERS MARKETING AUDIENCE\n`;
    csv += `Export Generated:,${new Date().toLocaleString("en-IN")},Total Records:,${target.length}\n\n`;
    csv += `#,"Name","Contact Mobile","Email","Engagement Segment","Total Treks","Trekkers Booked","Total Amount Spent (INR)","Last Trek Joined","Last Trek Date","Days Since Last Trek","All Treks History"\n`;

    target.forEach((t, idx) => {
      const escape = (val: any) => `"${String(val || "").replace(/"/g, '""')}"`;
      csv += `${idx + 1},${escape(t.name)},${escape(t.phone ? `'${t.phone}` : "N/A")},${escape(t.email || "N/A")},${escape(t.segment.toUpperCase())},${t.totalTreksCount},${t.totalTrekkersBooked},${t.totalSpent},${escape(t.lastTrekName)},${escape(t.lastTrekDate)},${t.daysSinceLastTrek},${escape(t.treks.join(" | "))}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `VisitKokan_Trekker_Audience_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Trekker audience exported to CSV! 📊");
  };

  // Queue stats
  const sentCount = campaignQueue.filter((q) => q.status === "sent").length;
  const pendingCount = campaignQueue.filter((q) => q.status === "pending").length;
  const currentRecipient = campaignQueue[activeQueueIndex] || null;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#2ecc71]/10 text-[#2ecc71]">
              <Send size={20} />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Trekker Marketing &amp; Engagement
            </h1>
          </div>
          <p className="text-white/40 text-xs mt-1">
            Connect with unique travelers who joined past treks. Send targeted WhatsApp messages, announce new batches, and re-engage alumni.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing || loading}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh trekker data"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => handleCopyPhoneNumbers("comma")}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Copy numbers formatted for WhatsApp Broadcast or bulk SMS"
          >
            <Copy size={13} />
            <span>Copy Numbers ({selectedIds.length > 0 ? selectedIds.length : filteredTrekkers.length})</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet size={13} />
            <span>Export CSV</span>
          </button>

          {/* Primary Campaign Button */}
          <button
            type="button"
            onClick={() => handleOpenCampaignModal()}
            className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#25D366]/20"
          >
            <MessageCircle size={15} />
            <span>
              Send WhatsApp Campaign (
              {selectedIds.length > 0
                ? selectedIds.length
                : filteredTrekkers.filter((t) => t.phone).length}
              )
            </span>
          </button>
        </div>
      </div>

      {/* ── Key Metrics Cards ──────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Total Trekkers</span>
              <Users size={12} className="text-[#2ecc71]" />
            </div>
            <div className="text-2xl font-black text-white">{stats.totalUniqueTrekkers}</div>
            <p className="text-[10px] text-white/40 mt-0.5">Unique alumni accounts</p>
          </div>

          <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>WhatsApp Ready</span>
              <MessageCircle size={12} className="text-[#25D366]" />
            </div>
            <div className="text-2xl font-black text-[#25D366]">{stats.withPhoneCount}</div>
            <p className="text-[10px] text-white/40 mt-0.5">
              {stats.totalUniqueTrekkers > 0
                ? `${Math.round((stats.withPhoneCount / stats.totalUniqueTrekkers) * 100)}% verified mobile`
                : "0%"}
            </p>
          </div>

          <div
            onClick={() => setSelectedSegment(selectedSegment === "lapsed" ? "all" : "lapsed")}
            className={`border rounded-2xl p-4 cursor-pointer transition-all ${
              selectedSegment === "lapsed"
                ? "bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/40"
                : "bg-[#141414] border-white/5 hover:border-amber-500/30"
            }`}
          >
            <div className="flex items-center justify-between text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Needs Engagement</span>
              <AlertCircle size={12} />
            </div>
            <div className="text-2xl font-black text-amber-400">{stats.lapsedCount}</div>
            <p className="text-[10px] text-white/40 mt-0.5">Trekked 60-150d ago</p>
          </div>

          <div
            onClick={() => setSelectedSegment(selectedSegment === "active" ? "all" : "active")}
            className={`border rounded-2xl p-4 cursor-pointer transition-all ${
              selectedSegment === "active"
                ? "bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/40"
                : "bg-[#141414] border-white/5 hover:border-emerald-500/30"
            }`}
          >
            <div className="flex items-center justify-between text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Active Trekkers</span>
              <CheckCircle2 size={12} />
            </div>
            <div className="text-2xl font-black text-emerald-400">{stats.activeCount}</div>
            <p className="text-[10px] text-white/40 mt-0.5">&lt;60 days recent</p>
          </div>

          <div
            onClick={() => setSelectedSegment(selectedSegment === "vip" ? "all" : "vip")}
            className={`border rounded-2xl p-4 cursor-pointer transition-all ${
              selectedSegment === "vip"
                ? "bg-purple-500/10 border-purple-500/40 ring-1 ring-purple-500/40"
                : "bg-[#141414] border-white/5 hover:border-purple-500/30"
            }`}
          >
            <div className="flex items-center justify-between text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>VIP Explorers</span>
              <Sparkles size={12} />
            </div>
            <div className="text-2xl font-black text-purple-400">{stats.vipCount}</div>
            <p className="text-[10px] text-white/40 mt-0.5">3+ treks or ₹5k+</p>
          </div>

          <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Trek Bookings Revenue</span>
              <Tag size={12} className="text-[#2ecc71]" />
            </div>
            <div className="text-2xl font-black text-white">
              ₹{Math.round(stats.totalRevenueGenerated).toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] text-white/40 mt-0.5">Total lifetime value</p>
          </div>
        </div>
      )}

      {/* ── Filters & Controls Bar ─────────────────────────────── */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 space-y-3">
        {/* Row 1: Segment Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-white/40 text-[11px] font-bold uppercase mr-1 flex items-center gap-1">
            <Filter size={11} /> Audience:
          </span>

          <button
            type="button"
            onClick={() => setSelectedSegment("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedSegment === "all"
                ? "bg-white/15 text-white shadow-sm"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            All Trekkers ({trekkers.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedSegment("lapsed")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedSegment === "lapsed"
                ? "bg-amber-400 text-black shadow-sm"
                : "text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/10"
            }`}
          >
            <span>🔔 Needs Re-engagement ({stats?.lapsedCount ?? 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSegment("active")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedSegment === "active"
                ? "bg-emerald-400 text-black shadow-sm"
                : "text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Trekkers ({stats?.activeCount ?? 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSegment("vip")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedSegment === "vip"
                ? "bg-purple-500 text-white shadow-sm"
                : "text-purple-400/70 hover:text-purple-400 hover:bg-purple-500/10"
            }`}
          >
            <span>⭐ VIP Explorers ({stats?.vipCount ?? 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSegment("has_phone")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedSegment === "has_phone"
                ? "bg-[#25D366] text-black shadow-sm"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>📱 Has Mobile ({stats?.withPhoneCount ?? 0})</span>
          </button>
        </div>

        {/* Row 2: Search, Trek Filter & Sort Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-white/5">
          {/* Search */}
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-3 top-2.5 text-white/30" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, email, or trek..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-white/30 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Trek dropdown filter */}
          <div className="sm:col-span-4">
            <select
              value={selectedTrekFilter}
              onChange={(e) => setSelectedTrekFilter(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-white/10 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#2ecc71]/50 cursor-pointer"
            >
              <option value="all">All Treks Joined ({distinctTreks.length} trails)</option>
              {distinctTreks.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-3 flex items-center gap-1.5">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#1e1e1e] border border-white/10 text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#2ecc71]/50 cursor-pointer"
            >
              <option value="recency">Sort: Days Ago (Recency)</option>
              <option value="treks">Sort: Treks Joined Count</option>
              <option value="spend">Sort: Total Spent (₹)</option>
              <option value="name">Sort: Traveler Name</option>
            </select>

            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white transition-colors cursor-pointer"
              title={`Switch to ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              <ArrowUpDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Selection Toolbar (When Items Selected) ────────────── */}
      <div className="flex items-center justify-between gap-3 bg-[#141414] border border-white/5 p-3 rounded-2xl text-xs flex-wrap">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-white/70 hover:text-white font-medium cursor-pointer"
          >
            {selectedIds.length > 0 && selectedIds.length === filteredTrekkers.length ? (
              <CheckSquare size={16} className="text-[#2ecc71]" />
            ) : selectedIds.length > 0 ? (
              <div className="w-4 h-4 rounded bg-[#2ecc71]/30 border border-[#2ecc71] flex items-center justify-center text-[10px] font-bold text-[#2ecc71]">
                -
              </div>
            ) : (
              <Square size={16} className="text-white/40" />
            )}
            <span>
              {selectedIds.length > 0
                ? `${selectedIds.length} of ${filteredTrekkers.length} selected`
                : `Select All (${filteredTrekkers.length})`}
            </span>
          </button>

          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-white/40 hover:text-white underline text-[11px]"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/40 text-[11px] hidden sm:inline">
            Showing {filteredTrekkers.length} unique travelers
          </span>

          {selectedIds.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => handleCopyPhoneNumbers("lines")}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                title="Copy selected phone numbers on separate lines"
              >
                <Copy size={12} />
                <span>Copy Numbers ({selectedIds.length})</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenCampaignModal()}
                className="px-3.5 py-1.5 bg-[#25D366] text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 hover:bg-[#20ba59] transition-all cursor-pointer shadow-md shadow-[#25D366]/20"
              >
                <MessageCircle size={14} />
                <span>Send WhatsApp to Selected ({selectedIds.length})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Trekker Audience Roster ────────────────────────────── */}
      {loading ? (
        <div className="p-16 text-center bg-[#141414] border border-white/5 rounded-2xl space-y-2">
          <RefreshCw size={24} className="animate-spin text-[#2ecc71] mx-auto" />
          <p className="text-white/60 text-sm font-semibold">Aggregating unique trek participants...</p>
          <p className="text-white/30 text-xs">Matching contacts across orders and user profiles.</p>
        </div>
      ) : filteredTrekkers.length === 0 ? (
        <div className="p-16 text-center bg-[#141414] border border-white/5 rounded-2xl space-y-2">
          <Users size={32} className="text-white/20 mx-auto" />
          <p className="text-white/60 text-sm font-semibold">No trek participants match your current filter</p>
          <p className="text-white/30 text-xs">Try resetting search keywords or changing the audience segment tab.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTrekkers.map((t) => {
            const isSelected = selectedIds.includes(t.id);
            const isLapsed = t.segment === "lapsed";
            const isVip = t.segment === "vip";
            const hasPhone = Boolean(t.phone && t.phone.replace(/\D/g, "").length >= 10);

            return (
              <div
                key={t.id}
                className={`bg-[#141414] border rounded-2xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected
                    ? "border-[#2ecc71]/40 bg-[#2ecc71]/[0.02]"
                    : isLapsed
                    ? "border-amber-500/20 hover:border-amber-500/35"
                    : "border-white/5 hover:border-white/15"
                }`}
              >
                {/* Left: Checkbox + Avatar + Info */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => handleToggleSelect(t.id)}
                    className="mt-1 cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckSquare size={18} className="text-[#2ecc71]" />
                    ) : (
                      <Square size={18} className="text-white/30 hover:text-white" />
                    )}
                  </button>

                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {t.name?.[0]?.toUpperCase() || "T"}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white text-sm truncate">{t.name}</h3>

                      {/* Segment Tag */}
                      {isVip && (
                        <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Sparkles size={10} /> VIP Trekker
                        </span>
                      )}
                      {isLapsed && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <AlertCircle size={10} /> Needs Re-engagement
                        </span>
                      )}
                      {t.segment === "active" && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          🟢 Active Trekker
                        </span>
                      )}
                      {t.segment === "cold" && (
                        <span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-md">
                          ❄️ Lapsed &gt;150d
                        </span>
                      )}
                      {t.segment === "new" && (
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                          🆕 First Trek
                        </span>
                      )}

                      <span className="text-[11px] bg-white/5 text-white/60 px-2 py-0.5 rounded-md font-mono">
                        {t.totalTreksCount} trek{t.totalTreksCount > 1 ? "s" : ""} joined ({t.totalTrekkersBooked} pax)
                      </span>
                    </div>

                    {/* Contact details */}
                    <div className="flex items-center gap-3 text-xs text-white/50 flex-wrap">
                      {hasPhone ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-medium">
                          <Phone size={12} className="text-emerald-400/80" />
                          <a href={`tel:${t.phone}`} className="hover:underline">
                            {formatPhoneDisplay(t.phone)}
                          </a>
                          <span className="text-[10px] bg-[#25D366]/20 text-[#25D366] px-1.5 py-0.2 rounded font-sans">
                            WhatsApp Ready ✓
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-400/80 text-[11px] italic">No phone recorded</span>
                      )}

                      {t.email && (
                        <div className="flex items-center gap-1">
                          <Mail size={12} />
                          <span className="truncate max-w-[200px]">{t.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Treks History Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] text-white/30 uppercase font-bold mr-1">Trails:</span>
                      {t.treks.map((tr) => (
                        <span
                          key={tr}
                          className="text-[10px] bg-white/5 border border-white/10 text-white/80 px-2 py-0.5 rounded-md flex items-center gap-1"
                        >
                          <Mountain size={9} className="text-[#2ecc71]" />
                          <span>{tr}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Financials + Recency + Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                  {/* Recency & Spend */}
                  <div className="text-left md:text-right">
                    <div className="text-white font-bold text-xs">
                      ₹{t.totalSpent.toLocaleString("en-IN")}
                      <span className="text-white/40 text-[10px] font-normal ml-1">total</span>
                    </div>

                    <div className="text-[11px] mt-0.5 flex items-center md:justify-end gap-1">
                      <Clock size={11} className={isLapsed ? "text-amber-400" : "text-white/30"} />
                      <span className={isLapsed ? "text-amber-400 font-semibold" : "text-white/40"}>
                        {t.daysSinceLastTrek === 0 ? "Today" : `${t.daysSinceLastTrek} days ago`}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/30 block truncate max-w-[150px]">
                      {t.lastTrekName}
                    </span>
                  </div>

                  {/* WhatsApp Message Buttons */}
                  <div className="flex items-center gap-1.5">
                    {hasPhone ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleLaunchDirectWhatsApp(t)}
                          className="px-3 py-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                          title="Instant 1-Click WhatsApp Send"
                        >
                          <MessageCircle size={14} />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenCampaignModal(t)}
                          className="p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-xl transition-colors cursor-pointer"
                          title="Customize template & message"
                        >
                          <SlidersHorizontal size={14} />
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-white/20 italic">No contact phone</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: BULK WHATSAPP CAMPAIGN & RAPID DISPATCH QUEUE
         ══════════════════════════════════════════════════════════════ */}
      {composerOpen && composerTrekker && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-[#25D366]/20 text-[#25D366] rounded-2xl shadow-inner">
                  <MessageCircle size={22} />
                </span>
                <div>
                  <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                    <span>WhatsApp Campaign Sender</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30">
                      {campaignQueue.length} {campaignQueue.length === 1 ? "Recipient" : "Recipients in Queue"}
                    </span>
                  </h3>
                  <p className="text-white/40 text-xs mt-0.5">
                    Select a template or write a custom message, then dispatch to travelers one-by-one with automatic tracking.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="p-2 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Main Content: Split Pane */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              {/* LEFT COLUMN: Message Template Selector & Customizer (7 cols) */}
              <div className="lg:col-span-7 p-4 sm:p-5 space-y-4">
                {/* Step 1: Template Selection */}
                <div>
                  <label className="text-white/60 font-bold block mb-2 uppercase text-[10px] tracking-wider flex items-center justify-between">
                    <span>1. Choose Message Template</span>
                    {selectedTemplate === "custom" && (
                      <span className="text-[#2ecc71] font-semibold text-[10px]">
                        Dynamic Variables Enabled ✓
                      </span>
                    )}
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTemplate("welcome_back")}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedTemplate === "welcome_back"
                          ? "bg-[#2ecc71]/15 border-[#2ecc71] text-white shadow-sm ring-1 ring-[#2ecc71]/50"
                          : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="font-bold block text-xs">🏔️ Comeback Offer</span>
                      <span className="text-[10px] text-white/40">Coupon &amp; discount</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTemplate("weekend_alert")}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedTemplate === "weekend_alert"
                          ? "bg-[#2ecc71]/15 border-[#2ecc71] text-white shadow-sm ring-1 ring-[#2ecc71]/50"
                          : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="font-bold block text-xs">⚡ Weekend Batch</span>
                      <span className="text-[10px] text-white/40">Upcoming Saturday</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTemplate("season_launch")}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedTemplate === "season_launch"
                          ? "bg-[#2ecc71]/15 border-[#2ecc71] text-white shadow-sm ring-1 ring-[#2ecc71]/50"
                          : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="font-bold block text-xs">🌿 Season Launch</span>
                      <span className="text-[10px] text-white/40">New trail calendar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTemplate("review_request")}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedTemplate === "review_request"
                          ? "bg-[#2ecc71]/15 border-[#2ecc71] text-white shadow-sm ring-1 ring-[#2ecc71]/50"
                          : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="font-bold block text-xs">⭐ Review &amp; Photo</span>
                      <span className="text-[10px] text-white/40">Post-trek feedback</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTemplate("custom")}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer col-span-2 sm:col-span-2 ${
                        selectedTemplate === "custom"
                          ? "bg-[#25D366]/20 border-[#25D366] text-white shadow-sm ring-1 ring-[#25D366]/50"
                          : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="font-bold block text-xs flex items-center gap-1.5 text-white">
                        <Flame size={12} className="text-[#25D366]" />
                        <span>✍️ Custom Message (Any Text)</span>
                      </span>
                      <span className="text-[10px] text-white/40">
                        Type any custom announcement with auto-replacing tags
                      </span>
                    </button>
                  </div>
                </div>

                {/* Step 2: Custom Message or Template Parameters */}
                {selectedTemplate === "custom" ? (
                  <div className="space-y-2 bg-white/[0.02] border border-white/10 p-3.5 rounded-2xl">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[10px] font-bold text-white/60 uppercase">
                        Insert Dynamic Tags (Click to add):
                      </span>
                      <span className="text-[10px] text-[#2ecc71]">Auto-replaced per trekker</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleInsertTag("{name}")}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-mono transition-colors cursor-pointer"
                        title="First name of traveler"
                      >
                        + &#123;name&#125;
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertTag("{fullName}")}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-mono transition-colors cursor-pointer"
                        title="Full name of traveler"
                      >
                        + &#123;fullName&#125;
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertTag("{lastTrek}")}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-mono transition-colors cursor-pointer"
                        title="Name of their previous trek"
                      >
                        + &#123;lastTrek&#125;
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertTag("{days}")}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-mono transition-colors cursor-pointer"
                        title="Days since last trek"
                      >
                        + &#123;days&#125;
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertTag("{code}")}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-mono transition-colors cursor-pointer"
                        title="Promo discount code"
                      >
                        + &#123;code&#125;
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertTag("{discount}")}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-mono transition-colors cursor-pointer"
                        title="Discount value"
                      >
                        + &#123;discount&#125;
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertTag("{link}")}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-mono transition-colors cursor-pointer"
                        title="Website trek link"
                      >
                        + &#123;link&#125;
                      </button>
                    </div>

                    <textarea
                      rows={5}
                      value={customMessageBody}
                      onChange={(e) => setCustomMessageBody(e.target.value)}
                      placeholder="Type your WhatsApp message here. Use {name}, {lastTrek}, {code}, etc."
                      className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71] font-sans leading-relaxed"
                    />

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] text-white/40 font-bold uppercase block mb-1">
                          Promo Code (for &#123;code&#125;)
                        </label>
                        <input
                          type="text"
                          value={customPromoCode}
                          onChange={(e) => setCustomPromoCode(e.target.value.toUpperCase())}
                          placeholder="TREK10"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-[#2ecc71]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/40 font-bold uppercase block mb-1">
                          Discount (for &#123;discount&#125;)
                        </label>
                        <input
                          type="text"
                          value={customDiscountText}
                          onChange={(e) => setCustomDiscountText(e.target.value)}
                          placeholder="10% OFF"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#2ecc71]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Template Customizer Fields */}
                    {selectedTemplate === "welcome_back" && (
                      <div className="grid grid-cols-2 gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div>
                          <label className="text-[10px] font-bold text-white/40 uppercase block mb-1">
                            Promo Coupon Code
                          </label>
                          <input
                            type="text"
                            value={customPromoCode}
                            onChange={(e) => setCustomPromoCode(e.target.value.toUpperCase())}
                            placeholder="TREK10"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-[#2ecc71]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-white/40 uppercase block mb-1">
                            Discount Value
                          </label>
                          <input
                            type="text"
                            value={customDiscountText}
                            onChange={(e) => setCustomDiscountText(e.target.value)}
                            placeholder="10% OFF"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#2ecc71]"
                          />
                        </div>
                      </div>
                    )}

                    {selectedTemplate === "weekend_alert" && (
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <label className="text-[10px] font-bold text-white/40 uppercase block mb-1">
                          Featured Destination / Trek
                        </label>
                        <input
                          type="text"
                          value={customTrekMention}
                          onChange={(e) => setCustomTrekMention(e.target.value)}
                          placeholder={composerTrekker.lastTrekName || "Kalsubai Sunrise Trek"}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Step 3: Live Preview Box */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-white/60 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                      <span>Message Preview</span>
                      <span className="text-white/40 text-[10px] font-normal">
                        (for: <strong className="text-white">{composerTrekker.name}</strong>)
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(buildPersonalizedMessage(composerTrekker));
                        toast.success("Message preview copied to clipboard!");
                      }}
                      className="text-[11px] text-[#2ecc71] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy size={11} />
                      <span>Copy Text</span>
                    </button>
                  </div>

                  <div className="bg-[#0b141a] border border-[#202c33] rounded-2xl p-4 space-y-2 relative shadow-inner">
                    <div className="flex items-center justify-between text-[11px] text-white/40 pb-2 border-b border-white/5">
                      <span className="flex items-center gap-1 text-[#25D366]">
                        <MessageCircle size={12} /> WhatsApp Web Format
                      </span>
                      <span className="font-mono text-emerald-400">
                        {composerTrekker.phone ? formatPhoneDisplay(composerTrekker.phone) : "No Mobile"}
                      </span>
                    </div>

                    <div className="bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tr-none text-xs leading-relaxed max-w-xl ml-auto whitespace-pre-wrap shadow-md selection:bg-emerald-400 selection:text-black">
                      {buildPersonalizedMessage(composerTrekker)}
                    </div>

                    <div className="text-[10px] text-white/30 text-right pt-1">
                      Includes official Visit Kokan links and personalized recipient tags
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Rapid Dispatch Queue (5 cols) */}
              <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col space-y-4 bg-black/20">
                {/* Queue Summary Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-white/80 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                      <span>2. Campaign Dispatch Queue</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-white">
                      {sentCount} / {campaignQueue.length} Sent
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#2ecc71] to-[#25D366] h-full transition-all duration-300"
                      style={{
                        width: `${
                          campaignQueue.length > 0
                            ? Math.round((sentCount / campaignQueue.length) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Primary Action Button: Send Next */}
                {currentRecipient && (
                  <div className="bg-gradient-to-b from-[#25D366]/15 to-[#2ecc71]/5 border border-[#25D366]/30 p-3.5 rounded-2xl space-y-2 shadow-lg">
                    <div className="text-[11px] text-white/60 flex items-center justify-between">
                      <span>Ready to Send:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {currentRecipient.phone ? formatPhoneDisplay(currentRecipient.phone) : ""}
                      </span>
                    </div>

                    <div className="font-black text-white text-base truncate">
                      {currentRecipient.name}
                    </div>

                    <div className="text-[11px] text-white/40 truncate">
                      Last Trek: {currentRecipient.lastTrekName || "Sahyadri Trail"} ({currentRecipient.daysSinceLastTrek}d ago)
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSendQueueItem(activeQueueIndex)}
                        className="flex-1 py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#25D366]/30"
                      >
                        <Play size={14} className="fill-black" />
                        <span>Send WhatsApp Now</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSkipQueueItem(activeQueueIndex)}
                        className="py-2.5 px-3 bg-white/10 hover:bg-white/15 text-white/70 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        title="Skip to next recipient"
                      >
                        <SkipForward size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Queue Tools & Actions */}
                <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyPhoneNumbers("comma")}
                      className="text-[11px] text-white/60 hover:text-white flex items-center gap-1 cursor-pointer hover:underline"
                      title="Copy all queue numbers for WhatsApp Broadcast"
                    >
                      <Copy size={11} />
                      <span>Copy Numbers</span>
                    </button>

                    <span className="text-white/20">·</span>

                    <button
                      type="button"
                      onClick={handleMarkAllSent}
                      className="text-[11px] text-white/60 hover:text-white flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <CheckCheck size={11} className="text-[#2ecc71]" />
                      <span>Mark All Sent</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetQueue}
                    className="text-[11px] text-white/40 hover:text-white flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <RotateCcw size={11} />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Scrollable Recipients List */}
                <div className="flex-1 max-h-[300px] sm:max-h-[360px] overflow-y-auto space-y-1.5 pr-1">
                  {campaignQueue.map((item, idx) => {
                    const isActive = idx === activeQueueIndex;
                    const isSent = item.status === "sent";
                    const isSkipped = item.status === "skipped";

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setActiveQueueIndex(idx);
                          setComposerTrekker(item.trekker);
                        }}
                        className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isActive
                            ? "bg-white/10 border-[#2ecc71] shadow-sm ring-1 ring-[#2ecc71]/40"
                            : isSent
                            ? "bg-[#25D366]/5 border-[#25D366]/20 opacity-80"
                            : isSkipped
                            ? "bg-white/[0.02] border-white/5 opacity-50"
                            : "bg-white/[0.03] border-white/5 hover:border-white/15"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {/* Status Icon */}
                          {isSent ? (
                            <CheckCircle2 size={16} className="text-[#25D366] shrink-0" />
                          ) : isSkipped ? (
                            <span className="text-[10px] text-white/40 shrink-0">⏭️</span>
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center shrink-0 text-[9px] text-white/40">
                              {idx + 1}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-white truncate flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {isActive && (
                                <span className="text-[9px] bg-[#2ecc71]/20 text-[#2ecc71] px-1 py-0.2 rounded font-mono">
                                  Previewing
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-white/40 font-mono truncate">
                              {item.phone ? formatPhoneDisplay(item.phone) : "No Mobile"} · {item.lastTrekName || "Trek"}
                            </div>
                          </div>
                        </div>

                        {/* Row Action */}
                        <div className="shrink-0 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendQueueItem(idx);
                            }}
                            className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                              isSent
                                ? "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                                : "bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black"
                            }`}
                            title="Send WhatsApp to this traveler"
                          >
                            <Send size={11} />
                            <span>{isSent ? "Resend" : "Send"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between gap-3 bg-black/40">
              <div className="text-white/40 text-xs hidden sm:block">
                Tip: Clicking <strong className="text-[#25D366]">Send WhatsApp Now</strong> will open WhatsApp in a new tab with your pre-filled message and advance automatically.
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="px-4 py-2 text-white/60 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Done / Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

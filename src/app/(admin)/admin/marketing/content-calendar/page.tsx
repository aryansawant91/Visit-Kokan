"use client";

import { useEffect, useState, useMemo } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Copy,
  Check,
  Trash2,
  Edit3,
  ExternalLink,
  Clock,
  Sparkles,
  Mountain,
  Share2,
  X,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Layers,
  MessageCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export interface SocialMediaPost {
  id: string;
  title: string;
  platform: "instagram" | "facebook" | "youtube" | "whatsapp" | "other";
  postType: "reel" | "post" | "carousel" | "story" | "video" | "status";
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  caption: string;
  hashtags: string;
  mediaUrl?: string;
  status: "draft" | "scheduled" | "published";
  targetTrek?: string;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const PLATFORM_CONFIG: Record<
  string,
  { label: string; icon: string; color: string; badge: string }
> = {
  instagram: {
    label: "Instagram",
    icon: "📸",
    color: "from-pink-500 to-rose-600",
    badge: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  facebook: {
    label: "Facebook",
    icon: "📘",
    color: "from-blue-600 to-blue-700",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  youtube: {
    label: "YouTube",
    icon: "🎥",
    color: "from-red-600 to-red-700",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: "💬",
    color: "from-emerald-500 to-green-600",
    badge: "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20",
  },
  other: {
    label: "Other Channel",
    icon: "📢",
    color: "from-gray-500 to-slate-600",
    badge: "bg-white/10 text-white/70 border-white/20",
  },
};

const SUGGESTED_HASHTAGS = [
  "#VisitKokan",
  "#SahyadriTreks",
  "#MaharashtraTreks",
  "#KalsubaiSunrise",
  "#DevkundWaterfall",
  "#HariharFort",
  "#WeekendEscape",
  "#MonsoonTreks",
  "#MumbaiTrekkers",
  "#PuneTrekkers",
];

export default function SocialMediaContentCalendarPage() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialMediaPost | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formPlatform, setFormPlatform] = useState<SocialMediaPost["platform"]>("instagram");
  const [formPostType, setFormPostType] = useState<SocialMediaPost["postType"]>("reel");
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [formTime, setFormTime] = useState("18:00");
  const [formCaption, setFormCaption] = useState("");
  const [formHashtags, setFormHashtags] = useState("");
  const [formMediaUrl, setFormMediaUrl] = useState("");
  const [formTargetTrek, setFormTargetTrek] = useState("");
  const [formStatus, setFormStatus] = useState<SocialMediaPost["status"]>("scheduled");

  const loadPosts = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/admin/marketing/calendar");
      if (!res.ok) throw new Error("Failed to load content calendar");
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error("Error loading social media calendar:", err);
      toast.error("Could not load calendar posts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openNewModal = () => {
    setEditingPost(null);
    setFormTitle("");
    setFormPlatform("instagram");
    setFormPostType("reel");
    setFormDate(new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]);
    setFormTime("18:00");
    setFormCaption("");
    setFormHashtags("#SahyadriTreks #VisitKokan #WeekendGetaway #MaharashtraTourism");
    setFormMediaUrl("");
    setFormTargetTrek("");
    setFormStatus("scheduled");
    setModalOpen(true);
  };

  const openEditModal = (p: SocialMediaPost) => {
    setEditingPost(p);
    setFormTitle(p.title);
    setFormPlatform(p.platform);
    setFormPostType(p.postType);
    setFormDate(p.scheduledDate);
    setFormTime(p.scheduledTime || "12:00");
    setFormCaption(p.caption || "");
    setFormHashtags(p.hashtags || "");
    setFormMediaUrl(p.mediaUrl || "");
    setFormTargetTrek(p.targetTrek || "");
    setFormStatus(p.status || "scheduled");
    setModalOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate) {
      toast.error("Title and Scheduled Date are required");
      return;
    }

    setSaving(true);
    try {
      if (editingPost) {
        // Update
        const res = await fetch("/api/admin/marketing/calendar", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingPost.id,
            title: formTitle,
            platform: formPlatform,
            postType: formPostType,
            scheduledDate: formDate,
            scheduledTime: formTime,
            caption: formCaption,
            hashtags: formHashtags,
            mediaUrl: formMediaUrl,
            targetTrek: formTargetTrek,
            status: formStatus,
          }),
        });
        if (!res.ok) throw new Error("Update failed");
        setPosts((prev) =>
          prev.map((p) =>
            p.id === editingPost.id
              ? {
                  ...p,
                  title: formTitle,
                  platform: formPlatform,
                  postType: formPostType,
                  scheduledDate: formDate,
                  scheduledTime: formTime,
                  caption: formCaption,
                  hashtags: formHashtags,
                  mediaUrl: formMediaUrl,
                  targetTrek: formTargetTrek,
                  status: formStatus,
                  updatedAt: new Date().toISOString(),
                }
              : p
          )
        );
        toast.success("Post updated successfully! ✨");
      } else {
        // Create
        const res = await fetch("/api/admin/marketing/calendar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            platform: formPlatform,
            postType: formPostType,
            scheduledDate: formDate,
            scheduledTime: formTime,
            caption: formCaption,
            hashtags: formHashtags,
            mediaUrl: formMediaUrl,
            targetTrek: formTargetTrek,
            status: formStatus,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error("Create failed");
        setPosts((prev) => [...prev, data.post]);
        toast.success("Post scheduled on calendar! 📅");
      }
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete post "${title}"?`)) return;
    try {
      await fetch(`/api/admin/marketing/calendar?id=${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post removed from calendar");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handleTogglePublished = async (p: SocialMediaPost) => {
    const nextStatus = p.status === "published" ? "scheduled" : "published";
    try {
      await fetch("/api/admin/marketing/calendar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, status: nextStatus }),
      });
      setPosts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, status: nextStatus } : item))
      );
      toast.success(
        nextStatus === "published" ? "Marked as Published! 🚀" : "Moved back to Scheduled 📅"
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleCopyCaption = (p: SocialMediaPost) => {
    const fullText = `${p.caption || ""}\n\n${p.hashtags || ""}`.trim();
    navigator.clipboard.writeText(fullText);
    toast.success("Caption & hashtags copied to clipboard! 📋");
  };

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (selectedPlatform !== "all" && p.platform !== selectedPlatform) return false;
      if (selectedStatus !== "all" && p.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchCaption = (p.caption || "").toLowerCase().includes(q);
        const matchTrek = (p.targetTrek || "").toLowerCase().includes(q);
        if (!matchTitle && !matchCaption && !matchTrek) return false;
      }
      return true;
    });
  }, [posts, selectedPlatform, selectedStatus, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: posts.length,
      scheduled: posts.filter((p) => p.status === "scheduled").length,
      published: posts.filter((p) => p.status === "published").length,
      drafts: posts.filter((p) => p.status === "draft").length,
      instagram: posts.filter((p) => p.platform === "instagram").length,
      whatsapp: posts.filter((p) => p.platform === "whatsapp").length,
    };
  }, [posts]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <CalendarDays size={20} />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Social Media Content Calendar
            </h1>
          </div>
          <p className="text-white/40 text-xs mt-1">
            Plan, organize, and execute marketing posts across Instagram, Facebook, YouTube &amp; WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => loadPosts(true)}
            disabled={refreshing || loading}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={openNewModal}
            className="px-4 py-2.5 bg-[#2ecc71] text-black font-bold text-xs rounded-xl hover:bg-[#27ae60] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus size={15} />
            <span>Schedule New Post</span>
          </button>
        </div>
      </div>

      {/* ── Key Metrics Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
          <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">
            Total Content
          </div>
          <div className="text-2xl font-black text-white">{stats.total}</div>
          <p className="text-[10px] text-white/40 mt-0.5">Campaign pieces</p>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
          <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            Scheduled
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.scheduled}</div>
          <p className="text-[10px] text-white/40 mt-0.5">Ready for release</p>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
          <div className="text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            Published
          </div>
          <div className="text-2xl font-black text-blue-400">{stats.published}</div>
          <p className="text-[10px] text-white/40 mt-0.5">Live on socials</p>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
          <div className="text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            Drafts
          </div>
          <div className="text-2xl font-black text-amber-400">{stats.drafts}</div>
          <p className="text-[10px] text-white/40 mt-0.5">In ideation</p>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
          <div className="text-pink-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            Instagram
          </div>
          <div className="text-2xl font-black text-pink-400">{stats.instagram}</div>
          <p className="text-[10px] text-white/40 mt-0.5">Reels &amp; posts</p>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
          <div className="text-[#25D366] text-[10px] font-bold uppercase tracking-wider mb-1">
            WhatsApp
          </div>
          <div className="text-2xl font-black text-[#25D366]">{stats.whatsapp}</div>
          <p className="text-[10px] text-white/40 mt-0.5">Status &amp; alerts</p>
        </div>
      </div>

      {/* ── Filters Bar ────────────────────────────────────────── */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Platform Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-white/40 text-[11px] font-bold uppercase mr-1">Platform:</span>
            {["all", "instagram", "facebook", "youtube", "whatsapp"].map((pl) => (
              <button
                key={pl}
                type="button"
                onClick={() => setSelectedPlatform(pl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPlatform === pl
                    ? "bg-[#2ecc71] text-black shadow-sm"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {pl === "all"
                  ? "All Platforms"
                  : `${PLATFORM_CONFIG[pl]?.icon} ${PLATFORM_CONFIG[pl]?.label}`}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-white/40 text-[11px] font-bold uppercase mr-1">Status:</span>
            {["all", "scheduled", "published", "draft"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  selectedStatus === st
                    ? "bg-white/20 text-white"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search & View Mode */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-white/30" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts by title, caption or trek..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]"
            />
          </div>

          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewMode === "cards" ? "bg-[#2ecc71] text-black" : "text-white/40 hover:text-white"
              }`}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewMode === "table" ? "bg-[#2ecc71] text-black" : "text-white/40 hover:text-white"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* ── Content Grid / List ────────────────────────────────── */}
      {loading ? (
        <div className="p-16 text-center bg-[#141414] border border-white/5 rounded-2xl space-y-2">
          <RefreshCw size={24} className="animate-spin text-[#2ecc71] mx-auto" />
          <p className="text-white/60 text-sm font-semibold">Loading content calendar...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-16 text-center bg-[#141414] border border-white/5 rounded-2xl space-y-3">
          <CalendarDays size={32} className="text-white/20 mx-auto" />
          <p className="text-white/60 text-sm font-semibold">No social media posts match the filter</p>
          <button
            type="button"
            onClick={openNewModal}
            className="px-4 py-2 bg-[#2ecc71] text-black font-bold text-xs rounded-xl hover:bg-[#27ae60] transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus size={14} /> Schedule First Post
          </button>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((p) => {
            const config = PLATFORM_CONFIG[p.platform] || PLATFORM_CONFIG.other;
            const isPublished = p.status === "published";
            const isScheduled = p.status === "scheduled";

            return (
              <div
                key={p.id}
                className={`bg-[#141414] border rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all ${
                  isPublished
                    ? "border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.02] to-transparent"
                    : isScheduled
                    ? "border-white/10 hover:border-white/20"
                    : "border-white/5 opacity-80"
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header: Platform + Post Type + Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${config.badge}`}>
                        <span>{config.icon}</span>
                        <span>{config.label}</span>
                      </span>

                      <span className="text-[10px] font-mono uppercase bg-white/5 text-white/50 px-2 py-0.5 rounded-md">
                        {p.postType}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePublished(p)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                        isPublished
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : isScheduled
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-emerald-500/20 hover:text-emerald-400"
                          : "bg-white/5 text-white/40 border-white/10"
                      }`}
                      title="Click to toggle status between Published and Scheduled"
                    >
                      {isPublished ? "✓ Published" : isScheduled ? "📅 Scheduled" : "📝 Draft"}
                    </button>
                  </div>

                  {/* Title & Scheduled Date */}
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">{p.title}</h3>
                    <p className="text-white/40 text-xs flex items-center gap-1.5 mt-1 font-mono">
                      <Clock size={12} className="text-[#2ecc71]" />
                      <span>{p.scheduledDate}</span>
                      {p.scheduledTime && <span>at {p.scheduledTime}</span>}
                    </p>
                  </div>

                  {/* Target Trek tag */}
                  {p.targetTrek && (
                    <div className="flex items-center gap-1 text-[11px] text-[#2ecc71] bg-[#2ecc71]/10 px-2.5 py-1 rounded-lg w-fit">
                      <Mountain size={11} />
                      <span className="font-medium truncate max-w-[240px]">{p.targetTrek}</span>
                    </div>
                  )}

                  {/* Caption snippet */}
                  {p.caption && (
                    <p className="text-white/70 text-xs line-clamp-3 bg-black/30 p-2.5 rounded-xl border border-white/5 italic">
                      &ldquo;{p.caption}&rdquo;
                    </p>
                  )}

                  {/* Hashtags */}
                  {p.hashtags && (
                    <div className="text-[11px] text-pink-400/80 font-mono line-clamp-1">
                      {p.hashtags}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCaption(p)}
                    className="px-2.5 py-1.5 bg-white/5 hover:bg-white/15 text-white/80 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Copy caption and hashtags for Instagram/Facebook"
                  >
                    <Copy size={12} />
                    <span>Copy Text</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      title="Edit Post"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePost(p.id, p.title)}
                      className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Post"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/5 text-white/40 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Platform</th>
                  <th className="p-3">Post Title</th>
                  <th className="p-3">Date &amp; Time</th>
                  <th className="p-3">Target Trek</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPosts.map((p) => {
                  const config = PLATFORM_CONFIG[p.platform] || PLATFORM_CONFIG.other;
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${config.badge}`}>
                          {config.icon} {config.label} ({p.postType})
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-white text-xs">{p.title}</div>
                        {p.caption && (
                          <div className="text-[11px] text-white/40 truncate max-w-xs">{p.caption}</div>
                        )}
                      </td>
                      <td className="p-3 font-mono text-white/60 whitespace-nowrap">
                        {p.scheduledDate} {p.scheduledTime}
                      </td>
                      <td className="p-3 text-white/60">{p.targetTrek || "-"}</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                            p.status === "published"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : p.status === "scheduled"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-white/10 text-white/50"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap space-x-1">
                        <button
                          type="button"
                          onClick={() => handleCopyCaption(p)}
                          className="p-1.5 text-white/40 hover:text-white"
                          title="Copy Caption"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-white/40 hover:text-white"
                          title="Edit"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePost(p.id, p.title)}
                          className="p-1.5 text-white/40 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: ADD / EDIT SOCIAL MEDIA POST
         ══════════════════════════════════════════════════════════════ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-pink-500/20 text-pink-400 rounded-xl">
                  <CalendarDays size={18} />
                </span>
                <h3 className="font-bold text-white text-base">
                  {editingPost ? "Edit Social Post" : "Schedule New Social Post"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 text-white/40 hover:text-white rounded-xl hover:bg-white/5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSavePost} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase block mb-1">
                  Post Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Kalsubai Sunrise Batch Announcement Reel"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase block mb-1">
                    Platform *
                  </label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value as any)}
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ecc71] cursor-pointer"
                  >
                    <option value="instagram">📸 Instagram</option>
                    <option value="facebook">📘 Facebook</option>
                    <option value="youtube">🎥 YouTube</option>
                    <option value="whatsapp">💬 WhatsApp Status</option>
                    <option value="other">📢 Other Platform</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase block mb-1">
                    Content Format
                  </label>
                  <select
                    value={formPostType}
                    onChange={(e) => setFormPostType(e.target.value as any)}
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ecc71] cursor-pointer"
                  >
                    <option value="reel">Reel (Vertical Video)</option>
                    <option value="carousel">Carousel (Multi-photo)</option>
                    <option value="post">Single Photo Post</option>
                    <option value="story">Story</option>
                    <option value="video">Long Video</option>
                    <option value="status">Status / Broadcast</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase block mb-1">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ecc71] font-mono cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase block mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ecc71] font-mono cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase block mb-1">
                  Target Trek / Expedition
                </label>
                <input
                  type="text"
                  value={formTargetTrek}
                  onChange={(e) => setFormTargetTrek(e.target.value)}
                  placeholder="e.g. Kalsubai Peak Sunrise Trek"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase block mb-1">
                  Caption &amp; Copy
                </label>
                <textarea
                  rows={3}
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  placeholder="Write the engaging hook, trek highlights, bus pickup points & call-to-action..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ecc71] leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-white/40 uppercase">
                    Hashtags
                  </label>
                  <span className="text-[10px] text-white/30">Click to append:</span>
                </div>
                <input
                  type="text"
                  value={formHashtags}
                  onChange={(e) => setFormHashtags(e.target.value)}
                  placeholder="#VisitKokan #SahyadriTreks..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-pink-400 font-mono focus:outline-none focus:border-[#2ecc71]"
                />
                <div className="flex items-center gap-1 flex-wrap mt-1.5">
                  {SUGGESTED_HASHTAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!formHashtags.includes(tag)) {
                          setFormHashtags((prev) => (prev ? `${prev} ${tag}` : tag));
                        }
                      }}
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-white/50 hover:text-white px-2 py-0.5 rounded cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase block mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ecc71] cursor-pointer"
                  >
                    <option value="scheduled">📅 Scheduled</option>
                    <option value="published">🚀 Published</option>
                    <option value="draft">📝 Draft</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase block mb-1">
                    Media / Asset Link
                  </label>
                  <input
                    type="url"
                    value={formMediaUrl}
                    onChange={(e) => setFormMediaUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-white/60 hover:text-white text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-black font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingPost ? "Save Changes" : "Schedule Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

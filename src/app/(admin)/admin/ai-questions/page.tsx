"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Sparkles,
  MessageSquare,
  Search,
  RefreshCw,
  Trash2,
  MapPin,
  Clock,
  Route,
  HelpCircle,
} from "lucide-react";

interface AIChatLog {
  id: string;
  question: string;
  pathname: string;
  pageContext?: string;
  isItinerary: boolean;
  replyPreview?: string;
  createdAt: string;
}

export default function AdminAIQuestionsPage() {
  const [logs, setLogs] = useState<AIChatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "itinerary" | "qa">("all");

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ai-logs");
      if (!res.ok) throw new Error("Failed to load AI question logs");
      const data = await res.json();
      setLogs(Array.isArray(data.logs) ? data.logs : []);
    } catch (err: any) {
      setError(err.message || "Error loading logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/ai-logs?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLogs((prev) => prev.filter((l) => l.id !== id));
      }
    } catch {
      // ignore
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (filterType === "itinerary" && !log.isItinerary) return false;
      if (filterType === "qa" && log.isItinerary) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.question?.toLowerCase().includes(q) ||
          log.pathname?.toLowerCase().includes(q) ||
          log.replyPreview?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, filterType, searchQuery]);

  const stats = useMemo(() => {
    const itineraryCount = logs.filter((l) => l.isItinerary).length;
    const qaCount = logs.length - itineraryCount;
    const uniquePages = new Set(logs.map((l) => l.pathname || "/")).size;
    return {
      total: logs.length,
      itineraryCount,
      qaCount,
      uniquePages,
    };
  }, [logs]);

  const formatDateTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#f7faf6] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0f2416] flex items-center gap-2">
            <Sparkles size={22} className="text-emerald-700" />
            <span>Konkan Mitra AI — User Questions Log</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#526b58]">
            See real questions, trip requests, and destinations visitors ask Konkan Mitra AI
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-white hover:bg-[#edf3eb] border border-[#cadbc7] text-xs font-bold text-[#142e1b] flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#526b58]">
            Total Questions
          </span>
          <p className="text-2xl font-black text-[#0f2416] mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Trip Plans Requested
          </span>
          <p className="text-2xl font-black text-emerald-900 mt-1">{stats.itineraryCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
            General Q&amp;A
          </span>
          <p className="text-2xl font-black text-sky-900 mt-1">{stats.qaCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Unique Pages
          </span>
          <p className="text-2xl font-black text-amber-900 mt-1">{stats.uniquePages}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#d6e2d4] shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, places, or page path (e.g. Raigad, Tarkarli, ferry)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#cadbc7] text-xs sm:text-sm outline-none focus:border-emerald-700"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#edf3eb] p-1 rounded-xl">
          {(
            [
              { id: "all", label: "All" },
              { id: "itinerary", label: "Trip Plans" },
              { id: "qa", label: "General Q&A" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                filterType === tab.id
                  ? "bg-[#113822] text-white shadow-xs"
                  : "text-[#334637] hover:bg-white/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Logs List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-[#d6e2d4] animate-pulse" />
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-[#d6e2d4] text-center space-y-2">
          <MessageSquare size={32} className="mx-auto text-emerald-700/40" />
          <p className="text-sm font-black text-[#0f2416]">No AI questions recorded yet</p>
          <p className="text-xs text-[#526b58]">
            New questions asked to Konkan Mitra AI (chat widget or /trip-planner) will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-2xl p-4 border border-[#d6e2d4] shadow-2xs hover:border-emerald-400 transition-colors space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      log.isItinerary
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-sky-100 text-sky-900"
                    }`}
                  >
                    {log.isItinerary ? <Route size={11} /> : <HelpCircle size={11} />}
                    <span>{log.isItinerary ? "Trip Plan" : "Q&A"}</span>
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#edf3eb] text-[#2D6A4F] text-[10px] font-bold flex items-center gap-1">
                    <MapPin size={10} />
                    <span>{log.pathname || "/"}</span>
                  </span>

                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <Clock size={11} />
                    <span>{formatDateTime(log.createdAt)}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(log.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer shrink-0"
                  title="Delete log"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <p className="text-sm font-bold text-[#0f2416] leading-snug">
                &ldquo;{log.question}&rdquo;
              </p>

              {log.replyPreview && (
                <p className="text-xs text-[#526b58] bg-[#f8faf7] p-2.5 rounded-xl border border-[#e6efe5] line-clamp-2">
                  <span className="font-bold text-[#2D6A4F]">AI Reply: </span>
                  {log.replyPreview}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Users,
  Search,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Mountain,
  RefreshCw,
  ExternalLink,
  Copy,
  Calendar,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface TrekLead {
  id: string;
  name: string;
  phone: string;
  trekId?: string;
  trekName?: string;
  trekSlug?: string;
  groupSize?: string;
  preferredMonth?: string;
  status: "pending" | "contacted" | "converted" | "closed";
  notes?: string;
  createdAt: string;
}

export default function TrekLeadsNurturingPage() {
  const [leads, setLeads] = useState<TrekLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadLeads = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/admin/marketing/leads");
      if (!res.ok) throw new Error("Failed to load trek inquiries");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Error loading leads:", err);
      toast.error("Could not load trek leads");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch("/api/admin/marketing/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus as any } : l))
      );
      toast.success(`Lead marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update lead status");
    }
  };

  const handleWhatsAppLead = (lead: TrekLead) => {
    const rawDigits = lead.phone.replace(/\D/g, "");
    if (!rawDigits) {
      toast.error("Invalid phone number");
      return;
    }
    const fullPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
    const trek = lead.trekName || "Sahyadri Trek";
    const group = lead.groupSize || "your group";
    const text = encodeURIComponent(
      `Hello ${lead.name}! 👋 Thank you for inquiring about the *${trek}* expedition with Visit Kokan for ${group}.

We would be delighted to organize your upcoming trek! Could you please confirm your preferred dates and pickup location (Mumbai / Pune)?

Looking forward to hosting your group in the Western Ghats! 🏔️`
    );
    window.open(`https://wa.me/${fullPhone}?text=${text}`, "_blank");
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = l.name.toLowerCase().includes(q);
        const matchPhone = l.phone.toLowerCase().includes(q);
        const matchTrek = (l.trekName || "").toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchTrek) return false;
      }
      return true;
    });
  }, [leads, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      pending: leads.filter((l) => !l.status || l.status === "pending").length,
      contacted: leads.filter((l) => l.status === "contacted").length,
      converted: leads.filter((l) => l.status === "converted").length,
    };
  }, [leads]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users size={20} />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Trek Enquiries &amp; Group Leads
            </h1>
          </div>
          <p className="text-white/40 text-xs mt-1">
            Follow up with travelers and corporate groups who submitted website inquiries for custom trek schedules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadLeads(true)}
          disabled={refreshing || loading}
          className="p-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 self-start md:self-auto"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ── Stats Strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
          <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">
            Total Inquiries
          </div>
          <div className="text-2xl font-black text-white">{stats.total}</div>
          <p className="text-[10px] text-white/40 mt-0.5">Website leads</p>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
          <div className="text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            Action Needed
          </div>
          <div className="text-2xl font-black text-amber-400">{stats.pending}</div>
          <p className="text-[10px] text-white/40 mt-0.5">Pending follow-up</p>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
          <div className="text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            Contacted
          </div>
          <div className="text-2xl font-black text-blue-400">{stats.contacted}</div>
          <p className="text-[10px] text-white/40 mt-0.5">In conversation</p>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-2xl p-4">
          <div className="text-[#2ecc71] text-[10px] font-bold uppercase tracking-wider mb-1">
            Converted
          </div>
          <div className="text-2xl font-black text-[#2ecc71]">{stats.converted}</div>
          <p className="text-[10px] text-white/40 mt-0.5">Joined expedition</p>
        </div>
      </div>

      {/* ── Filters Bar ────────────────────────────────────────── */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {["all", "pending", "contacted", "converted", "closed"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-[#2ecc71] text-black shadow-sm"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 text-white/30" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#2ecc71]"
          />
        </div>
      </div>

      {/* ── Leads Roster ───────────────────────────────────────── */}
      {loading ? (
        <div className="p-16 text-center bg-[#141414] border border-white/5 rounded-2xl space-y-2">
          <RefreshCw size={24} className="animate-spin text-[#2ecc71] mx-auto" />
          <p className="text-white/60 text-sm font-semibold">Loading trek inquiries...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="p-16 text-center bg-[#141414] border border-white/5 rounded-2xl space-y-2">
          <Users size={32} className="text-white/20 mx-auto" />
          <p className="text-white/60 text-sm font-semibold">No trek enquiries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLeads.map((lead) => {
            return (
              <div
                key={lead.id}
                className="bg-[#141414] border border-white/5 hover:border-white/15 rounded-2xl p-5 space-y-3 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-base">{lead.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-emerald-400 font-mono text-xs font-semibold flex items-center gap-1">
                        <Phone size={12} />
                        <a href={`tel:${lead.phone}`} className="hover:underline">
                          {lead.phone}
                        </a>
                      </span>
                    </div>
                  </div>

                  <select
                    value={lead.status || "pending"}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className="bg-[#1e1e1e] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white capitalize focus:outline-none focus:border-[#2ecc71] cursor-pointer"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="contacted">💬 Contacted</option>
                    <option value="converted">✅ Converted</option>
                    <option value="closed">❌ Closed</option>
                  </select>
                </div>

                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-white/70">
                    <span className="text-white/40">Trek Requested:</span>
                    <strong className="text-white flex items-center gap-1">
                      <Mountain size={11} className="text-[#2ecc71]" />
                      {lead.trekName || "Custom Expedition"}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-white/70">
                    <span className="text-white/40">Group Size:</span>
                    <span className="text-white font-medium">{lead.groupSize || "2-4 persons"}</span>
                  </div>

                  {lead.preferredMonth && (
                    <div className="flex items-center justify-between text-white/70">
                      <span className="text-white/40">Preferred Timing:</span>
                      <span className="text-white font-medium">{lead.preferredMonth}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-white/40 text-[11px] pt-1 border-t border-white/5">
                    <span>Inquiry Received:</span>
                    <span className="font-mono">{new Date(lead.createdAt).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(lead.phone);
                      toast.success("Phone copied!");
                    }}
                    className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Copy size={12} />
                    <span>Copy Phone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWhatsAppLead(lead)}
                    className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp Lead</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

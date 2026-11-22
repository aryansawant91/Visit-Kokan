"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Send,
  CalendarDays,
  Users,
  Tag,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Mountain,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function MarketingHubOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [calendarPosts, setCalendarPosts] = useState<any[]>([]);
  const [lapsedTrekkers, setLapsedTrekkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const [trekkersRes, calendarRes] = await Promise.all([
          fetch("/api/admin/marketing/trekkers"),
          fetch("/api/admin/marketing/calendar"),
        ]);

        if (trekkersRes.ok) {
          const tData = await trekkersRes.json();
          if (tData.success) {
            setStats(tData.stats);
            // Grab first 4 lapsed trekkers needing engagement
            const lapsed = (tData.trekkers || []).filter((t: any) => t.segment === "lapsed" && t.phone);
            setLapsedTrekkers(lapsed.slice(0, 4));
          }
        }

        if (calendarRes.ok) {
          const cData = await calendarRes.json();
          if (cData.success) {
            setCalendarPosts((cData.posts || []).slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Marketing overview load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#2ecc71]/10 text-[#2ecc71]">
              <Sparkles size={20} />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Marketing &amp; Growth Hub
            </h1>
          </div>
          <p className="text-white/40 text-xs mt-1">
            Re-engage past trekkers, plan social media content calendars, and nurture expedition leads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/marketing/messages"
            className="px-4 py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-black font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Send size={14} />
            <span>Send Trek Messages</span>
          </Link>
        </div>
      </div>

      {/* ── Core Navigation Modules ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Module 1: Send Marketing Messages */}
        <Link
          href="/admin/marketing/messages"
          className="group bg-[#141414] border border-white/5 hover:border-[#2ecc71]/40 rounded-2xl p-5 space-y-3 transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#2ecc71]/10 text-[#2ecc71] group-hover:scale-110 transition-transform">
              <Send size={18} />
            </div>
            <ArrowRight size={16} className="text-white/20 group-hover:text-[#2ecc71] transition-colors" />
          </div>

          <div>
            <h3 className="font-bold text-white text-base group-hover:text-[#2ecc71] transition-colors">
              Send Trek Messages
            </h3>
            <p className="text-white/40 text-xs mt-1 leading-relaxed">
              Target unique travelers who joined past treks. Send personalized WhatsApp engagement templates.
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-white/40">Audience:</span>
            <strong className="text-white font-mono">{stats?.totalUniqueTrekkers ?? "..."} Trekkers</strong>
          </div>
        </Link>

        {/* Module 2: Content Calendar */}
        <Link
          href="/admin/marketing/content-calendar"
          className="group bg-[#141414] border border-white/5 hover:border-pink-500/40 rounded-2xl p-5 space-y-3 transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
              <CalendarDays size={18} />
            </div>
            <ArrowRight size={16} className="text-white/20 group-hover:text-pink-400 transition-colors" />
          </div>

          <div>
            <h3 className="font-bold text-white text-base group-hover:text-pink-400 transition-colors">
              Content Calendar
            </h3>
            <p className="text-white/40 text-xs mt-1 leading-relaxed">
              Schedule reels, stories &amp; posts across Instagram, Facebook, YouTube &amp; WhatsApp.
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-white/40">Scheduled:</span>
            <strong className="text-pink-400 font-mono">{calendarPosts.length} Upcoming</strong>
          </div>
        </Link>

        {/* Module 3: Trek Enquiries / Leads */}
        <Link
          href="/admin/marketing/leads"
          className="group bg-[#141414] border border-white/5 hover:border-blue-500/40 rounded-2xl p-5 space-y-3 transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <Users size={18} />
            </div>
            <ArrowRight size={16} className="text-white/20 group-hover:text-blue-400 transition-colors" />
          </div>

          <div>
            <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
              Trek Enquiries &amp; Leads
            </h3>
            <p className="text-white/40 text-xs mt-1 leading-relaxed">
              Follow up with group leads and corporate inquiries submitted on the website via WhatsApp.
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-white/40">Group Leads:</span>
            <strong className="text-blue-400 font-mono">Priority CRM</strong>
          </div>
        </Link>

        {/* Module 4: Coupons & Deals */}
        <Link
          href="/admin/coupons"
          className="group bg-[#141414] border border-white/5 hover:border-amber-500/40 rounded-2xl p-5 space-y-3 transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Tag size={18} />
            </div>
            <ArrowRight size={16} className="text-white/20 group-hover:text-amber-400 transition-colors" />
          </div>

          <div>
            <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
              Coupons &amp; Deals
            </h3>
            <p className="text-white/40 text-xs mt-1 leading-relaxed">
              Create discount promo codes for returning trekkers and promotional festival campaigns.
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-white/40">Offers:</span>
            <strong className="text-amber-400 font-mono">Discount Codes</strong>
          </div>
        </Link>
      </div>

      {/* ── Two Column Preview Section ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Lapsed Trekkers Ready for Engagement */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                <AlertCircle size={15} className="text-amber-400" />
                <span>Trekkers Ready for Re-engagement</span>
              </h2>
              <p className="text-white/40 text-[11px] mt-0.5">
                Past participants who haven&apos;t joined a trek in 60–150 days.
              </p>
            </div>

            <Link
              href="/admin/marketing/messages?segment=lapsed"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>View all ({stats?.lapsedCount ?? 0})</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-white/30 text-xs">Loading audience...</div>
          ) : lapsedTrekkers.length === 0 ? (
            <div className="py-8 text-center text-white/30 text-xs">
              All trekkers are currently active or no lapsed contacts recorded yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {lapsedTrekkers.map((t: any) => {
                const rawDigits = t.phone.replace(/\D/g, "");
                const fullPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
                const message = encodeURIComponent(
                  `Hey ${t.name.split(" ")[0]}! 🏔️ It's been ${t.daysSinceLastTrek} days since your trek to *${t.lastTrekName}* with Visit Kokan. We have exciting new batches live this weekend! Check them out: https://visitkokan.com/treks`
                );

                return (
                  <div
                    key={t.id}
                    className="p-3 bg-white/[0.02] border border-white/5 hover:border-amber-500/20 rounded-xl flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <strong className="text-white truncate">{t.name}</strong>
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded font-mono">
                          {t.daysSinceLastTrek}d ago
                        </span>
                      </div>
                      <p className="text-white/40 text-[11px] mt-0.5 truncate">
                        Last: {t.lastTrekName} · 📞 {t.phone}
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/${fullPhone}?text=${message}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 shrink-0"
                    >
                      <MessageCircle size={12} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Column 2: Upcoming Social Posts */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                <CalendarDays size={15} className="text-pink-400" />
                <span>Upcoming Social Media Content</span>
              </h2>
              <p className="text-white/40 text-[11px] mt-0.5">
                Scheduled posts ready for publishing on Instagram &amp; YouTube.
              </p>
            </div>

            <Link
              href="/admin/marketing/content-calendar"
              className="text-xs text-pink-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Open Calendar</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-white/30 text-xs">Loading calendar...</div>
          ) : calendarPosts.length === 0 ? (
            <div className="py-8 text-center text-white/30 text-xs">
              No social media posts scheduled yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {calendarPosts.map((p: any) => (
                <div
                  key={p.id}
                  className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-white truncate">{p.title}</strong>
                    <span className="text-[10px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded font-mono uppercase">
                      {p.platform} · {p.postType}
                    </span>
                  </div>

                  <p className="text-white/50 text-[11px] line-clamp-2 italic">
                    &ldquo;{p.caption}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-white/30 font-mono pt-1 border-t border-white/5">
                    <span>Target Date: {p.scheduledDate} {p.scheduledTime}</span>
                    <span className="capitalize text-white/50">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

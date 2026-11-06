"use client";

import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  Sparkles,
  MapPin,
  Compass,
} from "lucide-react";

export default function VendorAnalyticsPage() {
  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="text-[#2ecc71]" size={24} />
          <span>Host Performance &amp; Tourist Trends</span>
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Traveler insights, seasonal tourist patterns, and feeder market demand for the Konkan coast
        </p>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#141414] rounded-2xl p-5 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>Platform Impressions</span>
            <Eye size={16} className="text-[#2ecc71]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">4,850+</div>
          <p className="text-[11px] text-[#2ecc71] font-semibold flex items-center gap-1">
            <TrendingUp size={12} /> Monthly travelers visiting region
          </p>
        </div>

        <div className="bg-[#141414] rounded-2xl p-5 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>Average Group Size</span>
            <Users size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">4–6 Guests</div>
          <p className="text-[11px] text-white/40">
            Predominantly families &amp; weekend friend groups
          </p>
        </div>

        <div className="bg-[#141414] rounded-2xl p-5 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-white/50 text-xs">
            <span>Average Stay Duration</span>
            <Calendar size={16} className="text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">2.4 Nights</div>
          <p className="text-[11px] text-white/40">
            Friday evening to Sunday afternoon departures
          </p>
        </div>
      </div>

      {/* ── Feeder Markets ── */}
      <div className="bg-[#141414] rounded-3xl p-6 sm:p-7 border border-white/5 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Compass size={18} className="text-[#2ecc71]" />
          <span>Top Traveler Feeder Markets for Konkan Stays</span>
        </h2>
        <p className="text-xs text-white/40">
          Where tourists looking at Sindhudurg, Ratnagiri, and Raigad originate from:
        </p>

        <div className="space-y-3 pt-2">
          <div>
            <div className="flex justify-between text-xs font-semibold text-white mb-1.5">
              <span>Mumbai Metropolitan Region (Thane, Navi Mumbai, Borivali, Dadar)</span>
              <span className="text-[#2ecc71] font-bold">54%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="bg-[#2ecc71] h-full rounded-full" style={{ width: "54%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-white mb-1.5">
              <span>Pune Region (Kothrud, Hinjewadi, Wakad, Baner)</span>
              <span className="text-blue-400 font-bold">32%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: "32%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-white mb-1.5">
              <span>Kolhapur, Satara &amp; Western Maharashtra</span>
              <span className="text-amber-400 font-bold">14%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: "14%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Seasonality Guide ── */}
      <div className="bg-[#141414] rounded-3xl p-6 sm:p-7 border border-white/5 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles size={18} className="text-amber-400" />
          <span>Konkan Tourist Seasons &amp; Pricing Guidance</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="bg-[#1a1a1a] p-4.5 rounded-2xl border border-white/5 space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full inline-block">
              Peak Tourist Season
            </span>
            <h3 className="font-bold text-sm text-white">October — February</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Dolphin safaris, water sports at Tarkarli, scuba diving at Malvan, and winter beach tourists. Optimal time to set premium weekend room tariffs.
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-4.5 rounded-2xl border border-white/5 space-y-2">
            <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full inline-block">
              Summer &amp; Mango Season
            </span>
            <h3 className="font-bold text-sm text-white">March — May</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Family summer holidays and Devgad/Ratnagiri Hapus mango tourism. Offer organic mango-tasting and village experiences to attract families.
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-4.5 rounded-2xl border border-white/5 space-y-2">
            <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full inline-block">
              Monsoon &amp; Waterfall Season
            </span>
            <h3 className="font-bold text-sm text-white">June — September</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Lush green Sahyadri waterfalls, Amboli mist, and heritage fort trekking. Promote hot Solkadhi and traditional Surmai/Pomfret meals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

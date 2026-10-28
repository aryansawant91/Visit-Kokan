"use client";

import { useEffect, useState } from "react";
import { Waves, Clock, AlertTriangle, Ship, Compass, ShieldCheck } from "lucide-react";
import { getFortTideStatus, TideInfo } from "@/lib/tides/konkanTides";

interface TideStatusCardProps {
  fortSlugOrName: string;
  className?: string;
}

export default function TideStatusCard({ fortSlugOrName, className = "" }: TideStatusCardProps) {
  const [tide, setTide] = useState<TideInfo | null>(null);

  useEffect(() => {
    const info = getFortTideStatus(fortSlugOrName);
    setTide(info);

    // Refresh tide status every 5 minutes
    const interval = setInterval(() => {
      setTide(getFortTideStatus(fortSlugOrName));
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fortSlugOrName]);

  if (!tide) return null;

  return (
    <div className={`bg-gradient-to-br from-[#f0f7f3] to-white rounded-2xl border border-[#cfe1d6] p-4 sm:p-5 shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-teal-100/80 flex items-center justify-center text-teal-800 shrink-0">
            <Waves className="w-5 h-5 animate-pulse text-[#2D6A4F]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2D6A4F] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Live Fort Access
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h3 className="text-sm font-bold text-[#142e1b] mt-0.5">
              Tide & Jetty Tracker
            </h3>
          </div>
        </div>

        {/* Current status pill */}
        <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${tide.statusBadgeColor} shrink-0 text-center`}>
          {tide.statusTitle}
        </span>
      </div>

      {/* Monsoon Alert Banner */}
      {tide.isMonsoonClosed && (
        <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <span className="font-bold">Monsoon Alert: </span>
            Ferry and boat transfers across open sea may be restricted by port authorities during high swell.
          </p>
        </div>
      )}

      {/* Grid: Tide Timing Details */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
        <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-[#dce7dd]">
          <span className="text-[10px] font-semibold text-gray-500 block mb-0.5 uppercase tracking-wide">
            🌊 Next Low Tide
          </span>
          <span className="text-sm font-black text-emerald-700 block">
            {tide.nextLowTide}
          </span>
          <span className="text-[10px] text-gray-400">Walkway / calm window</span>
        </div>

        <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-[#dce7dd]">
          <span className="text-[10px] font-semibold text-gray-500 block mb-0.5 uppercase tracking-wide">
            🌊 Next High Tide
          </span>
          <span className="text-sm font-black text-blue-700 block">
            {tide.nextHighTide}
          </span>
          <span className="text-[10px] text-gray-400">Deep water / submerged</span>
        </div>
      </div>

      {/* Key Access Windows */}
      <div className="space-y-2 text-xs text-gray-700 mb-3 bg-white/80 rounded-xl p-3 border border-[#dce7dd]">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-medium text-gray-600">
            <Clock className="w-3.5 h-3.5 text-[#2D6A4F]" /> Safe Visit Window:
          </span>
          <span className="font-bold text-[#142e1b]">
            {tide.safeWindow}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-medium text-gray-600">
            <Ship className="w-3.5 h-3.5 text-[#2D6A4F]" /> Jetty Timings:
          </span>
          <span className="font-bold text-[#142e1b]">
            {tide.jettyTimings}
          </span>
        </div>
      </div>

      {/* Safety Guideline */}
      <div className="bg-[#f2faf5] border border-[#d0e9db] rounded-xl p-2.5 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#22442c] leading-relaxed">
          <span className="font-bold">Local Rule: </span>
          {tide.safetyTip}
        </p>
      </div>
    </div>
  );
}

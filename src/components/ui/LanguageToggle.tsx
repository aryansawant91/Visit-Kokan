"use client";

import React from "react";
import { Sparkles, Languages, Check } from "lucide-react";

interface Props {
  isMarathi: boolean;
  onToggle: () => void;
  loading?: boolean;
  variant?: "pill" | "banner" | "compact";
  className?: string;
}

export default function LanguageToggle({
  isMarathi,
  onToggle,
  loading = false,
  variant = "pill",
  className = "",
}: Props) {
  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={onToggle}
        title={isMarathi ? "Switch to English" : "वाचा मराठीत (Read in Marathi)"}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer border shadow-2xs ${
          isMarathi
            ? "bg-gradient-to-r from-amber-700 to-orange-800 text-white border-amber-600 shadow-sm"
            : "bg-white/90 hover:bg-white text-[#1b3d26] border-[#cadbc7]"
        } ${className}`}
      >
        <span className="text-[12px]">{isMarathi ? "🚩" : "🌐"}</span>
        <span>{isMarathi ? "मराठी" : "English / मराठी"}</span>
        {loading && (
          <span className="w-2.5 h-2.5 rounded-full border-2 border-white border-t-transparent animate-spin ml-0.5" />
        )}
      </button>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
          isMarathi
            ? "bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 border-amber-200/80 text-amber-950"
            : "bg-[#edf3eb] border-[#cadbc7] text-[#142e1b]"
        } ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-sm shadow-2xs border border-[#cadbc7]">
            {isMarathi ? "🚩" : "📖"}
          </span>
          <div>
            <p className="text-xs font-black">
              {isMarathi ? "माहिती मराठी भाषेत उपलब्ध आहे" : "Read Information in Marathi"}
            </p>
            <p className="text-[11px] opacity-75">
              {isMarathi
                ? "इतिहास, मार्ग व माहिती शुद्ध मराठीत वाचत आहात."
                : "Switch language anytime to read history & guides in Marathi."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs ${
            isMarathi
              ? "bg-amber-800 hover:bg-amber-900 text-white"
              : "bg-[#1E4D38] hover:bg-[#163829] text-white"
          }`}
        >
          {loading ? (
            <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <span>{isMarathi ? "English मध्ये वाचा" : "🚩 मराठीत वाचा"}</span>
          )}
        </button>
      </div>
    );
  }

  // Default "pill" variant
  return (
    <div
      className={`inline-flex items-center p-1 bg-[#edf3eb] rounded-2xl border border-[#cadbc7] shadow-2xs ${className}`}
    >
      <button
        type="button"
        onClick={() => {
          if (isMarathi) onToggle();
        }}
        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
          !isMarathi
            ? "bg-white text-[#102416] shadow-sm border border-[#cadbc7]"
            : "text-[#526b58] hover:text-[#0f2416]"
        }`}
      >
        <span>🇬🇧</span>
        <span>English</span>
      </button>

      <button
        type="button"
        onClick={() => {
          if (!isMarathi) onToggle();
        }}
        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
          isMarathi
            ? "bg-gradient-to-r from-amber-800 to-orange-800 text-white shadow-sm"
            : "text-[#526b58] hover:text-[#0f2416]"
        }`}
      >
        <span>🚩</span>
        <span>मराठी</span>
        {loading && (
          <span className="w-2.5 h-2.5 rounded-full border-2 border-white border-t-transparent animate-spin ml-0.5" />
        )}
      </button>
    </div>
  );
}

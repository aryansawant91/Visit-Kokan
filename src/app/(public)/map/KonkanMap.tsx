"use client";

import dynamic from "next/dynamic";

const KonkanMapExplorer = dynamic(
  () => import("@/components/map/KonkanMapExplorer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[calc(100vh-64px)] min-h-[600px] bg-[#e5ebe3] flex flex-col items-center justify-center text-[#113822] space-y-3">
        <div className="w-12 h-12 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-emerald-900">
          Loading Interactive Konkan Coastal Map...
        </p>
      </div>
    ),
  }
);

export default function KonkanMap() {
  return <KonkanMapExplorer />;
}

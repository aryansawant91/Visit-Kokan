export default function DestinationLoading() {
  return (
    <div className="min-h-screen bg-[#dce5da] sm:py-6 sm:px-4 lg:py-8 lg:px-8 flex justify-center items-start">
      {/* ── Outer Canvas Frame (Phone canvas on mobile, luxury 12-col desktop layout on lg+) ── */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-7xl min-h-screen sm:min-h-0 bg-[#edf3eb] lg:bg-transparent relative sm:rounded-[44px] lg:rounded-none sm:shadow-2xl lg:shadow-none sm:overflow-hidden lg:overflow-visible sm:border sm:border-black/10 lg:border-0 pb-28 lg:pb-16 animate-pulse">
        
        {/* ── DUAL-COLUMN GRID FOR DESKTOP / SINGLE COLUMN FOR MOBILE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ════ LEFT COLUMN: Hero & Main Content Skeleton (7-8 cols on lg+) ════ */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">

            {/* 1. Curved Bottom Hero Skeleton */}
            <div className="lg:rounded-[36px] overflow-hidden lg:shadow-xl lg:border lg:border-[#cadbc7]/70 bg-white">
              <div className="relative w-full h-[52vh] min-h-[380px] max-h-[480px] lg:h-[460px] bg-[#142607]/25 rounded-b-[42px] lg:rounded-[36px] overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Top Floating Glass Buttons */}
                <div className="absolute top-5 inset-x-0 px-4 flex items-center justify-between">
                  <div className="w-11 h-11 rounded-full bg-white/30 backdrop-blur-md" />
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-full bg-white/30 backdrop-blur-md" />
                    <div className="w-11 h-11 rounded-full bg-white/30 backdrop-blur-md" />
                  </div>
                </div>

                {/* Star Action Button Skeleton */}
                <div className="absolute bottom-4 right-6 w-12 h-12 rounded-full bg-white/30 backdrop-blur-md" />

                {/* Bottom Title & Pill */}
                <div className="absolute bottom-11 inset-x-0 px-5 sm:px-6 space-y-2">
                  <div className="h-3.5 w-32 bg-white/40 rounded-full" />
                  <div className="h-8 w-2/3 bg-white/70 rounded-xl" />
                </div>

                {/* Carousel Dots Capsule */}
                <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 w-16 h-5 rounded-full bg-white/25" />
              </div>
            </div>

            {/* 2. Content Skeleton */}
            <div className="px-5 pt-7 lg:px-0 lg:pt-0 space-y-5">
              {/* Title & Info Card */}
              <div className="lg:bg-white lg:rounded-3xl lg:p-7 lg:border lg:border-[#cadbc7] lg:shadow-sm space-y-4">
                <div className="space-y-2">
                  <div className="h-3.5 w-36 bg-[#dce7db] rounded" />
                  <div className="h-8 w-2/3 bg-[#142607]/20 rounded-xl" />
                  <div className="h-4 w-1/2 bg-[#dce7db] rounded" />
                  <div className="h-3.5 w-full bg-[#dce7db] rounded mt-2" />
                  <div className="h-3.5 w-5/6 bg-[#dce7db] rounded" />
                </div>

                {/* Key Info Pills */}
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="h-8 w-28 bg-white lg:bg-[#edf3eb] rounded-full shrink-0 border border-[#d6e2d4]" />
                  <div className="h-8 w-24 bg-white lg:bg-[#edf3eb] rounded-full shrink-0 border border-[#d6e2d4]" />
                  <div className="h-8 w-28 bg-white lg:bg-[#edf3eb] rounded-full shrink-0 border border-[#d6e2d4]" />
                </div>
              </div>

              {/* Tab Switcher Strip */}
              <div className="flex items-center gap-2 p-1.5 bg-[#dbe7da] rounded-2xl overflow-hidden">
                <div className="h-9 flex-1 bg-white rounded-xl shadow-xs" />
                <div className="h-9 flex-1 bg-white/40 rounded-xl" />
                <div className="h-9 flex-1 bg-white/40 rounded-xl" />
                <div className="h-9 flex-1 bg-white/40 rounded-xl" />
              </div>

              {/* Tab Content Card */}
              <div className="bg-white rounded-2xl p-5 border border-[#cadbc7] shadow-xs space-y-3">
                <div className="h-4 w-40 bg-[#dce7db] rounded" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full bg-[#edf3eb] rounded" />
                  <div className="h-3.5 w-full bg-[#edf3eb] rounded" />
                  <div className="h-3.5 w-4/5 bg-[#edf3eb] rounded" />
                </div>
              </div>

              {/* Nearby Card */}
              <div className="bg-white rounded-2xl p-5 border border-[#cadbc7] shadow-xs space-y-3">
                <div className="h-4 w-48 bg-[#dce7db] rounded" />
                <div className="space-y-2.5">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-3 bg-[#f8faf7] rounded-xl border border-[#e0e9df] flex justify-between items-center">
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 w-32 bg-[#edf3eb] rounded" />
                        <div className="h-2.5 w-48 bg-[#edf3eb] rounded" />
                      </div>
                      <div className="h-7 w-16 bg-[#142607]/20 rounded-lg shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ════ RIGHT COLUMN: Desktop Sticky Planning Panel Skeleton (lg+ only) ════ */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-5">
            <div className="bg-white rounded-3xl border-2 border-[#2D6A4F]/25 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-[#122c1b] via-[#1a442a] to-[#245838] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-white/30 rounded-full" />
                  <div className="h-4 w-24 bg-white/30 rounded-full" />
                </div>
                <div className="h-7 w-3/4 bg-white/50 rounded-xl" />
                <div className="h-3 w-1/2 bg-white/30 rounded" />
                <div className="h-16 w-full bg-black/25 rounded-2xl border border-white/10" />
              </div>

              {/* Action Buttons */}
              <div className="p-5 space-y-3 bg-[#f8faf7] border-b border-[#e2ede0]">
                <div className="h-12 w-full bg-[#b8dc26]/50 rounded-2xl" />
                <div className="h-10 w-full bg-white rounded-xl border border-[#cadbc7]" />
              </div>

              {/* Highlights Skeleton */}
              <div className="p-5 space-y-2.5">
                <div className="h-3 w-28 bg-[#dce7db] rounded" />
                <div className="flex flex-wrap gap-1.5">
                  <div className="h-6 w-20 bg-[#edf3eb] rounded-lg" />
                  <div className="h-6 w-24 bg-[#edf3eb] rounded-lg" />
                  <div className="h-6 w-16 bg-[#edf3eb] rounded-lg" />
                </div>
              </div>
            </div>

            {/* Assistance Card Skeleton */}
            <div className="bg-white rounded-2xl p-4 border border-[#cadbc7] shadow-xs flex items-center justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-28 bg-[#dce7db] rounded" />
                <div className="h-2.5 w-44 bg-[#edf3eb] rounded" />
              </div>
              <div className="h-9 w-28 bg-emerald-100 rounded-xl" />
            </div>
          </div>

        </div>

        {/* ── Sticky Bottom Dual Action Bar (Mobile Only: lg:hidden) ── */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#d6e2d4] py-2.5 px-4 shadow-lg lg:hidden">
          <div className="max-w-md sm:max-w-lg mx-auto flex items-center gap-3">
            <div className="flex-1 h-10 bg-[#edf3eb] rounded-xl border border-[#cfddce]" />
            <div className="flex-1 h-10 bg-[#b8dc26]/40 rounded-xl" />
          </div>
        </div>

      </div>
    </div>
  );
}

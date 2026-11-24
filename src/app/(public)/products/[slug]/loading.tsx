export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-[#dce5da] sm:py-6 sm:px-4 lg:py-8 lg:px-8 flex justify-center items-start">
      {/* ── Outer Canvas Frame (Phone canvas on mobile, luxury 12-col desktop layout on lg+) ── */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-7xl min-h-screen sm:min-h-0 bg-[#edf3eb] lg:bg-transparent relative sm:rounded-[44px] lg:rounded-none sm:shadow-2xl lg:shadow-none sm:overflow-hidden lg:overflow-visible sm:border sm:border-black/10 lg:border-0 pb-28 lg:pb-16 animate-pulse">
        
        {/* ── DUAL-COLUMN GRID FOR DESKTOP / SINGLE COLUMN FOR MOBILE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ════ LEFT COLUMN: Product Visuals & Main Details Skeleton (7-8 cols on lg+) ════ */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">

            {/* 1. Curved Bottom Hero Carousel Skeleton */}
            <div className="lg:rounded-[36px] overflow-hidden lg:shadow-xl lg:border lg:border-[#cadbc7]/70 bg-white">
              <div className="relative w-full h-[340px] sm:h-[390px] lg:h-[480px] bg-[#142607]/25 rounded-b-[36px] sm:rounded-b-[44px] lg:rounded-[36px] overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Top Floating Glass Buttons */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md" />
                    <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md" />
                  </div>
                </div>

                {/* Bottom Floating Info Capsule */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between">
                  <div className="h-6 w-32 bg-white/30 rounded-full" />
                  <div className="h-5 w-16 bg-white/25 rounded-full" />
                  <div className="h-6 w-14 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>

            {/* 2. Content Section */}
            <div className="px-5 pt-6 lg:px-0 lg:pt-0 space-y-5">
              {/* Eyebrow & Name Title Card */}
              <div className="lg:bg-white lg:rounded-3xl lg:p-7 lg:border lg:border-[#cadbc7] lg:shadow-sm space-y-4">
                <div className="space-y-2">
                  <div className="h-3.5 w-36 bg-[#dce7db] rounded" />
                  <div className="h-8 w-4/5 bg-[#142607]/20 rounded-xl" />
                  <div className="h-4 w-1/2 bg-[#dce7db] rounded" />
                </div>

                {/* Key Info Pills */}
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="h-8 w-28 bg-white lg:bg-[#edf3eb] rounded-full shrink-0 border border-[#d6e2d4]" />
                  <div className="h-8 w-20 bg-white lg:bg-[#edf3eb] rounded-full shrink-0 border border-[#d6e2d4]" />
                  <div className="h-8 w-28 bg-white lg:bg-[#edf3eb] rounded-full shrink-0 border border-[#d6e2d4]" />
                  <div className="h-8 w-28 bg-white lg:bg-[#edf3eb] rounded-full shrink-0 border border-[#d6e2d4]" />
                </div>
              </div>

              {/* Tab Switcher Strip */}
              <div className="flex items-center gap-1 p-1 bg-[#dbe7da] rounded-2xl overflow-hidden">
                <div className="h-8 flex-1 bg-white rounded-xl shadow-xs" />
                <div className="h-8 flex-1 bg-white/30 rounded-xl" />
                <div className="h-8 flex-1 bg-white/30 rounded-xl" />
                <div className="h-8 flex-1 bg-white/30 rounded-xl" />
              </div>

              {/* Tab Content Box */}
              <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#dce7db] space-y-4">
                <div className="h-4 w-32 bg-[#dce7db] rounded" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full bg-[#edf3eb] rounded" />
                  <div className="h-3.5 w-full bg-[#edf3eb] rounded" />
                  <div className="h-3.5 w-3/4 bg-[#edf3eb] rounded" />
                </div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="h-12 bg-[#edf3eb] rounded-xl" />
                  <div className="h-12 bg-[#edf3eb] rounded-xl" />
                  <div className="h-12 bg-[#edf3eb] rounded-xl" />
                  <div className="h-12 bg-[#edf3eb] rounded-xl" />
                </div>
              </div>
            </div>

          </div>

          {/* ════ RIGHT COLUMN: Desktop Sticky Order & Trust Panel (lg+ only) ════ */}
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
                <div className="h-14 w-full bg-black/25 rounded-2xl border border-white/10" />
              </div>

              {/* Action Buttons */}
              <div className="p-5 space-y-3 bg-[#f8faf7] border-b border-[#e2ede0]">
                <div className="h-12 w-full bg-[#25D366]/40 rounded-2xl" />
                <div className="h-3 w-3/4 mx-auto bg-[#dce7db] rounded" />
              </div>

              {/* Trust Guarantees Skeleton */}
              <div className="p-5 space-y-2.5">
                <div className="h-3 w-32 bg-[#dce7db] rounded" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full bg-[#edf3eb] rounded" />
                  <div className="h-3.5 w-5/6 bg-[#edf3eb] rounded" />
                  <div className="h-3.5 w-4/5 bg-[#edf3eb] rounded" />
                </div>
              </div>
            </div>

            {/* Support Card Skeleton */}
            <div className="bg-white rounded-2xl p-4 border border-[#cadbc7] shadow-xs flex items-center justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-28 bg-[#dce7db] rounded" />
                <div className="h-2.5 w-44 bg-[#edf3eb] rounded" />
              </div>
              <div className="h-7 w-20 bg-emerald-100 rounded-xl" />
            </div>
          </div>

        </div>

        {/* 3. Sticky Bottom Action Bar (Mobile Only: lg:hidden) */}
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#d6e2d4] py-3 px-4 shadow-lg lg:hidden">
          <div className="max-w-md sm:max-w-lg mx-auto">
            <div className="h-11 bg-[#25D366]/40 rounded-xl" />
          </div>
        </div>

      </div>
    </div>
  );
}

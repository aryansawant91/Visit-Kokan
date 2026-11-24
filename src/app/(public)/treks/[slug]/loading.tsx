export default function TrekDetailLoading() {
  return (
    <div className="min-h-screen bg-[#dce5da]">
      {/* Top Brand Sticky Navbar Shimmer */}
      <div className="sticky top-0 z-40 bg-[#1b4332] border-b border-emerald-900/30 px-4 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
          <div className="h-5 w-32 bg-white/25 rounded-md animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
        </div>
      </div>

      {/* Main Dual-Column Content */}
      <div className="w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ════ LEFT COLUMN: Hero + Guide Shimmer ════ */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            
            {/* 1. Hero Carousel Skeleton */}
            <div className="h-72 sm:h-[420px] bg-[#1b3d26]/25 sm:rounded-[36px] relative overflow-hidden animate-pulse border-0 sm:border sm:border-[#cadbc7]/70 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              
              {/* Top Badges Shimmer */}
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="h-6 w-24 bg-white/30 rounded-full" />
                <div className="h-6 w-20 bg-white/30 rounded-full" />
              </div>

              {/* Bottom Title & Specs Shimmer */}
              <div className="absolute bottom-6 left-5 right-5 space-y-2.5">
                <div className="h-4 w-32 bg-white/40 rounded-md" />
                <div className="h-8 sm:h-10 w-3/4 bg-white/70 rounded-xl" />
                <div className="h-4 w-1/2 bg-white/40 rounded-md" />
              </div>
            </div>

            {/* Content Cards */}
            <div className="space-y-5 px-4 sm:px-0">
              
              {/* 2. Quick Specs & Highlights Shimmer Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cadbc7] shadow-sm space-y-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-44 bg-[#dce7da] rounded-md" />
                  <div className="h-5 w-28 bg-emerald-100/80 rounded-full" />
                </div>

                {/* Specs Pills */}
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="h-8 w-28 bg-[#edf3eb] rounded-full shrink-0" />
                  <div className="h-8 w-24 bg-[#edf3eb] rounded-full shrink-0" />
                  <div className="h-8 w-24 bg-[#edf3eb] rounded-full shrink-0" />
                  <div className="h-8 w-28 bg-[#edf3eb] rounded-full shrink-0" />
                </div>

                {/* Trail Highlights Horizontal Row */}
                <div className="pt-3 border-t border-[#edf3eb] space-y-2.5">
                  <div className="h-3 w-28 bg-[#dce7da] rounded" />
                  <div className="flex gap-3 overflow-hidden">
                    <div className="h-20 w-32 bg-[#dce7da] rounded-2xl shrink-0" />
                    <div className="h-20 w-32 bg-[#dce7da] rounded-2xl shrink-0" />
                    <div className="h-20 w-32 bg-[#dce7da] rounded-2xl shrink-0" />
                    <div className="h-20 w-32 bg-[#dce7da] rounded-2xl shrink-0" />
                  </div>
                </div>
              </div>

              {/* 3. Durg Guide Shimmer Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cadbc7] shadow-sm space-y-4 animate-pulse">
                <div className="flex gap-2 pb-3 border-b border-[#edf3eb]">
                  <div className="h-8 w-24 bg-[#1b4332]/25 rounded-xl" />
                  <div className="h-8 w-24 bg-[#edf3eb] rounded-xl" />
                  <div className="h-8 w-24 bg-[#edf3eb] rounded-xl" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-[#edf3eb] rounded-md" />
                  <div className="h-4 w-5/6 bg-[#edf3eb] rounded-md" />
                  <div className="h-4 w-4/6 bg-[#edf3eb] rounded-md" />
                </div>
                <div className="h-44 bg-[#edf3eb] rounded-2xl" />
              </div>

              {/* 4. Expedition Itinerary Shimmer Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cadbc7] shadow-sm space-y-4 animate-pulse">
                <div className="h-4 w-48 bg-[#dce7da] rounded-md" />
                <div className="space-y-3 pt-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1b3d26]/20 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 bg-[#edf3eb] rounded-md" />
                        <div className="h-3.5 w-full bg-[#edf3eb] rounded-md" />
                        <div className="h-3.5 w-4/5 bg-[#edf3eb] rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Packing Checklist Shimmer Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cadbc7] shadow-sm space-y-3 animate-pulse">
                <div className="h-4 w-44 bg-[#dce7da] rounded-md" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 bg-[#edf3eb] rounded-xl" />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ════ RIGHT COLUMN: Sticky Booking Card Skeleton (lg+) ════ */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-3xl border-2 border-[#2D6A4F]/25 shadow-xl overflow-hidden animate-pulse">
              
              {/* Header */}
              <div className="bg-gradient-to-br from-[#122c1b] via-[#1a442a] to-[#245838] p-5 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-28 bg-white/20 rounded-full" />
                  <div className="h-4 w-24 bg-white/20 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-white/30 rounded-lg" />
                <div className="h-4 w-1/2 bg-white/20 rounded-md" />
                <div className="h-16 bg-black/25 rounded-2xl" />
              </div>

              {/* Inclusions & Form Skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-4 w-40 bg-[#edf3eb] rounded-md" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-6 bg-[#edf3eb] rounded-md" />
                  <div className="h-6 bg-[#edf3eb] rounded-md" />
                  <div className="h-6 bg-[#edf3eb] rounded-md" />
                  <div className="h-6 bg-[#edf3eb] rounded-md" />
                </div>

                <div className="pt-3 border-t border-[#edf3eb] space-y-2.5">
                  <div className="h-10 bg-[#edf3eb] rounded-xl" />
                  <div className="h-10 bg-[#edf3eb] rounded-xl" />
                  <div className="h-12 bg-[#2D6A4F]/35 rounded-xl" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

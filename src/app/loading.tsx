export default function Loading() {
  return (
    <div className="min-h-screen bg-[#fdf8f3] p-4 sm:p-8 space-y-6 max-w-5xl mx-auto animate-pulse">
      {/* Top Header Shimmer */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e8d5bc]/60">
        <div className="h-7 w-36 bg-[#e8d5bc]/60 rounded-full" />
        <div className="h-8 w-24 bg-[#e8d5bc]/60 rounded-full" />
      </div>

      {/* Hero Banner Shimmer */}
      <div className="h-44 sm:h-64 bg-[#e8d5bc]/40 rounded-3xl overflow-hidden relative" />

      {/* Shimmer Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-white rounded-2xl border border-[#e8d5bc]/60 p-4 space-y-3">
            <div className="h-24 bg-[#e8d5bc]/30 rounded-xl" />
            <div className="h-3.5 w-3/4 bg-[#e8d5bc]/50 rounded" />
            <div className="h-3 w-1/2 bg-[#e8d5bc]/30 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

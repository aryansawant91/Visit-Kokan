export default function DestinationLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <div className="h-[70vh] bg-gray-200 animate-pulse" />

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="h-10 bg-gray-200 rounded-2xl w-1/2 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded-xl w-full animate-pulse" />
        <div className="h-4 bg-gray-100 rounded-xl w-5/6 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded-xl w-4/6 animate-pulse" />

        <div className="grid grid-cols-3 gap-4 pt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Destination } from "@/types/destination";
import { DESTINATION_CATEGORIES } from "@/constants/destinationConstants";
import { Star, Trash2, MapPin, Clock } from "lucide-react";
import Image from "next/image";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { fetchDestinations(); }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    const res = await fetch("/api/destinations?all=true");
    const data = await res.json();
    setDestinations(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    setActionLoading(id);
    await fetch("/api/destinations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, featured: !featured }),
    });
    await fetchDestinations();
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this destination? This cannot be undone.")) return;
    setActionLoading(id);
    await fetch("/api/destinations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchDestinations();
    setActionLoading(null);
  };

  return (
    <div className="min-h-screen bg-kokan-cream/30 p-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-kokan-earth font-playfair">
            Destinations
          </h1>
          <p className="text-kokan-earth/50 text-sm mt-0.5">
            All destinations added by admin — live immediately
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-kokan-sand/30">
            <Clock className="w-12 h-12 text-kokan-sand mx-auto mb-3" />
            <p className="text-kokan-earth/50">No destinations yet</p>
            <p className="text-kokan-earth/30 text-sm mt-1">
              Use the Add Destination button to add your first one
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {destinations.map((dest) => {
              const category = DESTINATION_CATEGORIES.find(
                (c) => c.value === dest.category
              );
              return (
                <div
                  key={dest.id}
                  className="bg-white rounded-2xl p-4 border border-kokan-sand/30 flex items-center gap-4"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-kokan-sand/20 flex-shrink-0">
                    {dest.images?.[0] ? (
                      <Image
                        src={dest.images[0]}
                        alt={dest.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {category?.emoji ?? "📍"}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-kokan-earth truncate">
                        {dest.name}
                      </h3>
                      <span className="text-xs bg-kokan-sand/30 text-kokan-earth/60 px-2 py-0.5 rounded-full flex-shrink-0">
                        {category?.emoji} {category?.label}
                      </span>
                      {dest.featured && (
                        <span className="text-xs bg-yellow-50 text-yellow-600 border border-yellow-200 px-2 py-0.5 rounded-full flex-shrink-0 font-medium">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-kokan-earth/50 mt-0.5 truncate">
                      {dest.description}
                    </p>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-kokan-earth/40">
                        <MapPin className="w-3 h-3" /> {dest.region}
                      </span>
                      <span className="text-xs text-kokan-earth/40">
                        Best: {dest.bestSeason}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleFeatured(dest.id, dest.featured)}
                      disabled={actionLoading === dest.id}
                      title={dest.featured ? "Unfeature" : "Feature"}
                      className={`p-2 rounded-xl border transition-colors disabled:opacity-50 ${
                        dest.featured
                          ? "border-yellow-200 bg-yellow-50 text-yellow-500"
                          : "border-kokan-sand/40 hover:bg-yellow-50 hover:border-yellow-200 text-kokan-earth/40"
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(dest.id)}
                      disabled={actionLoading === dest.id}
                      title="Delete"
                      className="p-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-400 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Trek } from "@/types/trek";
import { TREK_CATEGORIES } from "@/constants/trekConstants";
import TrekDifficultyBadge from "@/components/trek/TrekDifficultyBadge";
import { Star, Trash2, Clock, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminTreksPage() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { fetchTreks(); }, []);

  const fetchTreks = async () => {
    setLoading(true);
    const res = await fetch("/api/treks?all=true");
    const data = await res.json();
    setTreks(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    setActionLoading(id);
    await fetch("/api/treks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, featured: !featured }),
    });
    await fetchTreks();
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this trek? This cannot be undone.")) return;
    setActionLoading(id);
    await fetch("/api/treks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchTreks();
    setActionLoading(null);
  };

  return (
    <div className="min-h-screen bg-kokan-cream/30 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-kokan-earth font-playfair">Treks</h1>
          <p className="text-kokan-earth/50 text-sm mt-0.5">All treks — live immediately</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />)}
          </div>
        ) : treks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-kokan-sand/30">
            <Clock className="w-12 h-12 text-kokan-sand mx-auto mb-3" />
            <p className="text-kokan-earth/50">No treks yet. Run the seed script to add treks.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {treks.map((trek) => {
              const category = TREK_CATEGORIES.find((c) => c.value === trek.category);
              return (
                <div key={trek.id} className="bg-white rounded-2xl p-4 border border-kokan-sand/30 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-kokan-sand/20 flex-shrink-0">
                    {trek.images?.[0] ? (
                      <Image src={trek.images[0]} alt={trek.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {category?.emoji ?? "🥾"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-kokan-earth truncate">{trek.name}</h3>
                      <TrekDifficultyBadge difficulty={trek.difficulty} size="sm" />
                      {trek.featured && (
                        <span className="text-xs bg-yellow-50 text-yellow-600 border border-yellow-200 px-2 py-0.5 rounded-full font-medium">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-kokan-earth/50 mt-0.5 truncate">{trek.description}</p>
                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      <span className="text-xs text-kokan-earth/40">{trek.region}</span>
                      <span className="text-xs text-kokan-earth/40">⏱ {trek.duration}</span>
                      <span className="text-xs text-kokan-earth/40">📍 {trek.distance}</span>
                      {trek.price && (
                        <span className="text-xs text-kokan-green font-semibold">
                          ₹{trek.price.toLocaleString("en-IN")}/person
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/treks/${trek.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl border border-kokan-sand/40 hover:bg-kokan-sand/10 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-kokan-earth/60" />
                    </Link>
                    <button
                      onClick={() => toggleFeatured(trek.id, trek.featured)}
                      disabled={actionLoading === trek.id}
                      className={`p-2 rounded-xl border transition-colors disabled:opacity-50 ${
                        trek.featured
                          ? "border-yellow-200 bg-yellow-50 text-yellow-500"
                          : "border-kokan-sand/40 hover:bg-yellow-50 text-kokan-earth/40"
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(trek.id)}
                      disabled={actionLoading === trek.id}
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
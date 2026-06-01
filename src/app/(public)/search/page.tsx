"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Package, BookOpen, Mountain, Loader2 } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  href: string;
  type: "destination" | "product" | "blog" | "trek";
  emoji: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQ) doSearch(initialQ);
  }, [initialQ]);

  const doSearch = async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const [destinations, products, blogs, treks] = await Promise.all([
        fetch("/api/destinations").then((r) => r.json()).catch(() => []),
        fetch("/api/products").then((r) => r.json()).catch(() => []),
        fetch("/api/blogs").then((r) => r.json()).catch(() => []),
        fetch("/api/treks").then((r) => r.json()).catch(() => []),
      ]);

      const lower = q.toLowerCase();
      const all: SearchResult[] = [
        ...((Array.isArray(destinations) ? destinations : []).filter((d: any) =>
          d.name?.toLowerCase().includes(lower) || d.region?.toLowerCase().includes(lower)
        ).map((d: any) => ({
          id: d.id, title: d.name, subtitle: `${d.region}, Maharashtra`,
          image: d.images?.[0], href: `/destinations/${d.slug}`,
          type: "destination" as const, emoji: "🏖️",
        }))),
        ...((Array.isArray(products) ? products : []).filter((p: any) =>
          p.name?.toLowerCase().includes(lower)
        ).map((p: any) => ({
          id: p.id, title: p.name, subtitle: `₹${p.price} ${p.unit}`,
          image: p.images?.[0], href: `/products/${p.slug}`,
          type: "product" as const, emoji: "🛍️",
        }))),
        ...((Array.isArray(blogs) ? blogs : []).filter((b: any) =>
          b.title?.toLowerCase().includes(lower)
        ).map((b: any) => ({
          id: b.id, title: b.title, subtitle: b.excerpt?.slice(0, 60) + "...",
          image: b.coverImage, href: `/blogs/${b.slug}`,
          type: "blog" as const, emoji: "📝",
        }))),
        ...((Array.isArray(treks) ? treks : []).filter((t: any) =>
          t.name?.toLowerCase().includes(lower)
        ).map((t: any) => ({
          id: t.id, title: t.name, subtitle: `${t.region} · ${t.duration}`,
          image: t.images?.[0], href: `/treks/${t.slug}`,
          type: "trek" as const, emoji: "🧗",
        }))),
      ];

      setResults(all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  const grouped = {
    destination: results.filter((r) => r.type === "destination"),
    trek: results.filter((r) => r.type === "trek"),
    product: results.filter((r) => r.type === "product"),
    blog: results.filter((r) => r.type === "blog"),
  };

  const typeLabels = {
    destination: { label: "Destinations", icon: <MapPin className="w-4 h-4" /> },
    trek: { label: "Treks", icon: <Mountain className="w-4 h-4" /> },
    product: { label: "Products", icon: <Package className="w-4 h-4" /> },
    blog: { label: "Blogs", icon: <BookOpen className="w-4 h-4" /> },
  };

  return (
    <div className="min-h-screen bg-kokan-cream/20">
      {/* Search hero */}
      <div className="bg-kokan-green py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-playfair text-2xl font-bold text-white mb-4 text-center">
            Search Visit Kokan
          </h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 flex items-center bg-white rounded-xl overflow-hidden shadow-sm">
              <Search className="w-4 h-4 text-kokan-earth/40 ml-4 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, treks, products, blogs..."
                className="flex-1 px-3 py-3 text-sm text-kokan-earth outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-kokan-sand text-white rounded-xl font-semibold text-sm hover:bg-kokan-earth transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-kokan-green animate-spin" />
          </div>
        ) : query && results.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold text-kokan-earth mb-1">No results for "{query}"</p>
            <p className="text-sm text-kokan-earth/50">Try different keywords</p>
          </div>
        ) : !query ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌊</div>
            <p className="text-kokan-earth/50">Search for destinations, treks, products and blogs</p>
          </div>
        ) : (
          <div className="space-y-8">
            <p className="text-sm text-kokan-earth/50">{results.length} results for "{query}"</p>
            {(Object.entries(grouped) as [keyof typeof grouped, SearchResult[]][])
              .filter(([, items]) => items.length > 0)
              .map(([type, items]) => (
                <div key={type}>
                  <h2 className="flex items-center gap-2 font-semibold text-kokan-earth mb-4">
                    {typeLabels[type].icon}
                    {typeLabels[type].label}
                    <span className="text-xs text-kokan-earth/40 font-normal">({items.length})</span>
                  </h2>
                  <div className="space-y-3">
                    {items.map((result) => (
                      <Link key={result.id} href={result.href}>
                        <div className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-kokan-sand/30 hover:border-kokan-green/30 hover:shadow-sm transition-all">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-kokan-sand/20 flex-shrink-0">
                            {result.image ? (
                              <Image src={result.image} alt={result.title} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                {result.emoji}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-kokan-earth truncate">{result.title}</p>
                            <p className="text-xs text-kokan-earth/50 truncate mt-0.5">{result.subtitle}</p>
                          </div>
                          <span className="text-xs bg-kokan-sand/20 text-kokan-earth/60 px-2 py-1 rounded-full flex-shrink-0">
                            {result.emoji} {typeLabels[type].label.slice(0, -1)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
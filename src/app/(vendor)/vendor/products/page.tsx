"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Package,
  ExternalLink,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function VendorProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.uid) return;
    fetchProducts();
  }, [user?.uid]);

  const fetchProducts = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products?vendorId=${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load vendor products:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.region?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Package className="text-amber-400" size={24} />
            <span>Regional Products &amp; Delicacies</span>
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Sell authentic Alphonso mangoes, Sindhudurg cashews, Kokum agal, and Konkani spices
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchProducts}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            title="Refresh products"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <Link
            href="/vendor/products/new"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="bg-[#141414] p-3 rounded-2xl border border-white/5 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or category…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
          />
        </div>
        <div className="text-xs text-white/40 hidden sm:block">
          Total Products: {products.length}
        </div>
      </div>

      {/* ── Content Grid ── */}
      {loading ? (
        <div className="py-20 text-center text-white/40 text-sm">
          Loading your product catalog…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#141414] border border-white/5 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-3xl">
            🥭
          </div>
          <h3 className="text-base font-bold text-white">
            {search ? "No products match your search" : "No Regional Products Listed Yet"}
          </h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            {search
              ? "Try another keyword or clear the search input."
              : "Expand your business by offering farm-fresh produce and artisanal foods to tourists across Maharashtra."}
          </p>
          {!search && (
            <Link
              href="/vendor/products/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors"
            >
              <Plus size={15} /> Add First Product
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => {
            const isLive = product.approved || product.status === "approved";
            return (
              <div
                key={product.id}
                className="bg-[#141414] rounded-3xl overflow-hidden border border-white/5 hover:border-white/15 transition-all flex flex-col group shadow-lg"
              >
                <div className="relative h-44 w-full bg-black/40">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🥭
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-md backdrop-blur-md ${
                        isLive
                          ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/40"
                          : "bg-amber-950/90 text-amber-300 border-amber-500/40"
                      }`}
                    >
                      {isLive ? "🟢 Live" : "🟡 In Review"}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      {product.category || "Produce"} • {product.region || "Sindhudurg"}
                    </div>
                    <h3 className="font-extrabold text-base text-white tracking-tight mt-0.5 truncate">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-white/50 line-clamp-2 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-white">
                          ₹{product.price?.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-white/50 font-medium">
                          /{product.unit || "unit"}
                        </span>
                      </div>
                      {product.stock !== undefined && (
                        <span className="text-[11px] text-white/40">
                          Stock: <strong className="text-white">{product.stock}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-white/40">
                      Visit Kokan Verified
                    </span>
                    {product.slug && isLive && (
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/20 text-amber-400 text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Eye size={13} />
                        <span>View</span>
                        <ExternalLink size={11} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

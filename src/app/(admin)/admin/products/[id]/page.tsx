"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { Check, X, Eye, Clock, Plus } from "lucide-react";
import Image from "next/image";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";
import Link from "next/link";

type Tab = "pending" | "approved" | "rejected";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    await fetchProducts();
    setActionLoading(null);
  };

  const filtered = products.filter((p) => p.status === tab);
  const counts = {
    pending: products.filter((p) => p.status === "pending").length,
    approved: products.filter((p) => p.status === "approved").length,
    rejected: products.filter((p) => p.status === "rejected").length,
  };

  const TABS: { key: Tab; label: string; color: string }[] = [
    { key: "pending", label: "Pending", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
    { key: "approved", label: "Approved", color: "text-green-600 bg-green-50 border-green-200" },
    { key: "rejected", label: "Rejected", color: "text-red-500 bg-red-50 border-red-200" },
  ];

  return (
    <div className="min-h-screen bg-kokan-cream/30 p-6">
      <div className="max-w-6xl mx-auto">

        {/* ← CHANGED: heading row now has Add Product button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-kokan-earth font-playfair">
              Product Approvals
            </h1>
            <p className="text-kokan-earth/50 text-sm mt-0.5">
              Review vendor submissions or add your own products
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-kokan-green text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-kokan-green/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                tab === t.key ? t.color : "bg-white text-kokan-earth/50 border-kokan-sand/30"
              }`}
            >
              {t.label}
              <span className="ml-2 bg-black/10 px-1.5 py-0.5 rounded-full text-xs">
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-kokan-sand/30">
            <Clock className="w-12 h-12 text-kokan-sand mx-auto mb-3" />
            <p className="text-kokan-earth/50">No {tab} products</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((product) => {
              const category = PRODUCT_CATEGORIES.find((c) => c.value === product.category);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 border border-kokan-sand/30 flex items-center gap-4"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-kokan-sand/20 flex-shrink-0">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {category?.emoji ?? "📦"}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-kokan-earth truncate">{product.name}</h3>
                      <span className="text-xs bg-kokan-sand/30 text-kokan-earth/60 px-2 py-0.5 rounded-full flex-shrink-0">
                        {category?.emoji} {category?.label}
                      </span>
                      {/* ← NEW: badge for admin-added products */}
                      {product.addedByAdmin && (
                        <span className="text-xs bg-kokan-green/10 text-kokan-green px-2 py-0.5 rounded-full flex-shrink-0 font-medium">
                          Admin Added
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-kokan-earth/50 mt-0.5 truncate">{product.description}</p>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="text-kokan-green font-semibold text-sm">
                        ₹{product.price.toLocaleString("en-IN")}{" "}
                        <span className="font-normal text-kokan-earth/40">{product.unit}</span>
                      </span>
                      <span className="text-xs text-kokan-earth/40">{product.region}</span>
                      <span className="text-xs text-kokan-earth/40">
                        by {product.vendorName ?? "Visit Kokan Team"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/products/${product.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl border border-kokan-sand/40 hover:bg-kokan-sand/10 transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4 text-kokan-earth/60" />
                    </Link>

                    {tab === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(product.id, "reject")}
                          disabled={actionLoading === product.id}
                          className="p-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                        <button
                          onClick={() => handleAction(product.id, "approve")}
                          disabled={actionLoading === product.id}
                          className="p-2 rounded-xl border border-green-200 hover:bg-green-50 transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          {actionLoading === product.id ? (
                            <div className="w-4 h-4 border-2 border-kokan-green border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                        </button>
                      </>
                    )}

                    {tab === "approved" && (
                      <button
                        onClick={() => handleAction(product.id, "reject")}
                        disabled={actionLoading === product.id}
                        className="px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-500 text-xs font-medium transition-colors"
                      >
                        Revoke
                      </button>
                    )}

                    {tab === "rejected" && (
                      <button
                        onClick={() => handleAction(product.id, "approve")}
                        disabled={actionLoading === product.id}
                        className="px-3 py-1.5 rounded-xl border border-green-200 hover:bg-green-50 text-green-600 text-xs font-medium transition-colors"
                      >
                        Approve
                      </button>
                    )}
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
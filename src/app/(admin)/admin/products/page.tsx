"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { Check, X, Trash2, Pencil, Loader2, PauseCircle, PlayCircle } from "lucide-react";
import Image from "next/image";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";

type Tab = "pending" | "approved" | "rejected";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts]         = useState<Product[]>([]);
  const [loading, setLoading]           = useState(true);
  const [tab, setTab]                   = useState<Tab>("pending");
  const [rejectReason, setRejectReason] = useState<{ [id: string]: string }>({});
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null);
  const [actionLoading, setActionLoading]     = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products/admin")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); });
  }, []);

  const filtered = products.filter((p) => {
    if (tab === "pending")  return p.status === "pending";
    if (tab === "approved") return p.status === "approved";
    if (tab === "rejected") return p.status === "rejected";
    return true;
  });

  const counts = {
    pending:  products.filter((p) => p.status === "pending").length,
    approved: products.filter((p) => p.status === "approved").length,
    rejected: products.filter((p) => p.status === "rejected").length,
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setActionLoading(id);
    try {
      await fetch(`/api/products/admin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    } finally {
      setActionLoading(null);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product permanently?")) return;
    setActionLoading(id);
    try {
      await fetch(`/api/products/admin`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = (id: string) =>
    updateProduct(id, { status: "approved", approved: true, isActive: true });

  const handleReject = (id: string) => {
    updateProduct(id, { status: "rejected", approved: false });
    setShowRejectInput(null);
    setRejectReason((prev) => ({ ...prev, [id]: "" }));
  };

  const handleToggleActive = (product: Product) => {
    const next = product.isActive === false ? true : false;
    updateProduct(product.id, { isActive: next });
  };

  const category = (val: string) =>
    PRODUCT_CATEGORIES.find((c) => c.value === val);

  return (
    <div className="min-h-screen bg-kokan-cream/30 py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-kokan-earth font-playfair">
            Product Approvals
          </h1>
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium text-sm">
            {counts.pending} pending
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-kokan-sand/30 rounded-xl p-1 mb-6 w-fit">
          {(["pending", "approved", "rejected"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-kokan-green text-white"
                  : "text-kokan-earth/60 hover:text-kokan-earth"
              }`}
            >
              {t} ({counts[t]})
            </button>
          ))}
        </div>

        {/* Product List */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-kokan-green" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-kokan-earth/40">
            No {tab} products
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((product) => {
              const cat       = category(product.category);
              const isLoading = actionLoading === product.id;
              const isPaused  = product.isActive === false;

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl border p-5 transition-all ${
                    isPaused
                      ? "border-orange-200 bg-orange-50/30"
                      : "border-kokan-sand/30"
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 ${
                      isPaused ? "bg-kokan-sand/30 opacity-60" : "bg-kokan-sand/20"
                    }`}>
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          {cat?.emoji ?? "📦"}
                        </div>
                      )}
                      {isPaused && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl">
                          <PauseCircle className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold ${isPaused ? "text-kokan-earth/50" : "text-kokan-earth"}`}>
                              {product.name}
                            </h3>
                            {isPaused && (
                              <span className="text-[10px] bg-orange-100 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full font-semibold">
                                Selling Paused
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-kokan-earth/50 mt-0.5">
                            {cat?.emoji} {cat?.label} · {product.region}
                          </p>
                          <p className="text-xs text-kokan-earth/40 mt-0.5">
                            By{" "}
                            <span className="font-medium text-kokan-earth/60">
                              {product.vendorName}
                            </span>
                            {" · "}Vendor ID:{" "}
                            <span className="font-mono">
                              {product.vendorId?.slice(0, 8)}...
                            </span>
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-kokan-green font-bold">
                            ₹{product.price.toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-kokan-earth/40">{product.unit}</p>
                          <p className="text-xs text-kokan-earth/40 mt-1">
                            Stock: {product.stock}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-kokan-earth/60 mt-2 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Reject reason input */}
                      {showRejectInput === product.id && (
                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            value={rejectReason[product.id] ?? ""}
                            onChange={(e) =>
                              setRejectReason((prev) => ({
                                ...prev,
                                [product.id]: e.target.value,
                              }))
                            }
                            placeholder="Reason for rejection (optional)"
                            className="flex-1 border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                          />
                          <button
                            onClick={() => handleReject(product.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                          >
                            Confirm
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-kokan-sand/30 flex-wrap">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-kokan-green" />
                    ) : (
                      <>
                        {tab === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(product.id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-kokan-green text-white rounded-xl text-sm font-medium hover:bg-kokan-green/90 transition-colors"
                            >
                              <Check className="w-4 h-4" /> Approve
                            </button>
                            <button
                              onClick={() =>
                                setShowRejectInput(
                                  showRejectInput === product.id ? null : product.id
                                )
                              }
                              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-500 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                            >
                              <X className="w-4 h-4" /> Reject
                            </button>
                          </>
                        )}

                        {tab === "approved" && (
                          <>
                            <button
                              onClick={() => handleToggleActive(product)}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                isPaused
                                  ? "bg-kokan-green/10 text-kokan-green hover:bg-kokan-green/20"
                                  : "bg-orange-50 text-orange-500 hover:bg-orange-100"
                              }`}
                            >
                              {isPaused ? (
                                <><PlayCircle className="w-4 h-4" /> Resume Selling</>
                              ) : (
                                <><PauseCircle className="w-4 h-4" /> Pause Selling</>
                              )}
                            </button>

                            {!isPaused && (
                              <span className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-full font-medium">
                                ✓ Live on site
                              </span>
                            )}
                          </>
                        )}

                        {tab === "rejected" && (
                          <button
                            onClick={() => handleApprove(product.id)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-kokan-green/10 text-kokan-green rounded-xl text-sm font-medium hover:bg-kokan-green/20 transition-colors"
                          >
                            <Check className="w-4 h-4" /> Re-approve
                          </button>
                        )}

                        {/* Edit — navigates to dedicated edit page */}
                        <button
                          onClick={() => router.push(`/admin/products/${product.id}`)}
                          className="flex items-center gap-1.5 px-4 py-2 border border-kokan-sand rounded-xl text-sm text-kokan-earth/70 hover:bg-kokan-sand/20 transition-colors"
                        >
                          <Pencil className="w-4 h-4" /> Edit
                        </button>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-400 rounded-xl text-sm hover:bg-red-50 transition-colors ml-auto"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </>
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
"use client";

import { useState } from "react";
import {
  Sparkles,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
  Star,
  MapPin,
  Clock,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
} from "lucide-react";
import { Product } from "@/types/product";
import ProductCouponWidget from "@/components/products/ProductCouponWidget";
import ProductReviews from "@/components/products/ProductReviews";

interface ProductTabsProps {
  product: Product;
  quantity: number;
  setQuantity: (q: number) => void;
  similarProducts?: Product[];
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  inCart?: boolean;
  justAdded?: boolean;
}

export default function ProductTabs({
  product,
  quantity,
  setQuantity,
  similarProducts = [],
  onAddToCart,
  onBuyNow,
  inCart = false,
  justAdded = false,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "features" | "specs" | "reviews">("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: Sparkles },
    { id: "features", label: "Features & Taste", icon: Layers },
    { id: "specs", label: "Specifications", icon: Award },
    { id: "reviews", label: `Reviews (${product.reviewCount || 0})`, icon: Star },
  ] as const;

  return (
    <div className="space-y-4">
      {/* ── Pill Tab Switcher (Matches DestinationTabs) ── */}
      <div className="flex items-center gap-1 p-1 bg-[#dbe7da] rounded-2xl overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[76px] py-2 px-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
                isActive
                  ? "bg-white text-[#142607] shadow-xs"
                  : "text-[#3d5343] hover:text-[#142607] hover:bg-white/40"
              }`}
            >
              <Icon size={12} className={isActive ? "text-[#2D6A4F]" : "text-[#3d5343]"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tab Content Canvas ── */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#dce7db] space-y-5">
        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Quantity Stepper */}
            <div className="flex items-center justify-between p-3.5 bg-[#f4f8f3] rounded-2xl border border-[#d6e4d5]">
              <div>
                <p className="text-xs font-bold text-[#142607]">Select Quantity</p>
                <p className="text-[11px] text-[#4d6653]">Order more to save on shipping</p>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-[#cfdfce] shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg bg-[#edf4ec] hover:bg-[#dce7db] active:scale-95 disabled:opacity-40 text-sm font-black flex items-center justify-center text-[#142607] transition-all"
                >
                  -
                </button>
                <span className="w-8 text-center font-black text-sm text-[#142607]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="w-8 h-8 rounded-lg bg-[#edf4ec] hover:bg-[#dce7db] active:scale-95 text-sm font-black flex items-center justify-center text-[#142607] transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Inline Action Buttons: Add to Cart & Buy Now */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onAddToCart}
                className={`flex-1 py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                  justAdded || inCart
                    ? "bg-emerald-50 border-emerald-300 text-kokan-green shadow-xs"
                    : "bg-white hover:bg-[#f7faf6] border-[#cfddce] text-[#142607] shadow-2xs"
                }`}
              >
                <ShoppingCart size={15} className={inCart ? "text-kokan-green" : "text-[#2D6A4F]"} />
                <span>
                  {justAdded ? "Added ✓" : inCart ? "In Cart (Add +)" : "Add to Cart"}
                </span>
              </button>

              <button
                type="button"
                onClick={onBuyNow}
                className="flex-1 py-3 px-3 rounded-2xl font-black text-xs sm:text-sm bg-[#b8dc26] hover:bg-[#aed422] text-[#142607] shadow-md shadow-[#b8dc26]/30 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <span>
                  Buy Now · ₹{(product.price * quantity).toLocaleString("en-IN")}
                </span>
                <Sparkles size={14} className="text-[#142607]" />
              </button>
            </div>

            {/* Description Paragraph */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F] mb-1.5 flex items-center gap-1.5">
                <Sparkles size={13} /> The Konkan Heritage Story
              </h3>
              <p className="text-xs sm:text-[13px] text-[#334638] leading-relaxed whitespace-pre-line">
                {product.description ||
                  "Handcrafted with authentic traditional Konkani recipes passed through generations, made with zero chemical preservatives and freshly sourced local ingredients."}
              </p>
            </div>

            {/* Konkan Direct Trust Highlights Grid */}
            <div>
              <h4 className="text-xs font-extrabold text-[#142607] mb-2.5">Authenticity & Quality Guarantee</h4>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    icon: ShieldCheck,
                    title: "100% GI-Certified",
                    desc: "Authentic Konkan provenance guaranteed",
                  },
                  {
                    icon: Truck,
                    title: "Farmer Direct",
                    desc: "Sourced straight from local orchards",
                  },
                  {
                    icon: Award,
                    title: "Chemical Free",
                    desc: "No artificial dyes or preservatives",
                  },
                  {
                    icon: RotateCcw,
                    title: "Freshly Packed",
                    desc: "Small-batch hygienic artisan packing",
                  },
                ].map((h, i) => {
                  const Icon = h.icon;
                  return (
                    <div
                      key={i}
                      className="p-3 bg-[#f7faf6] rounded-2xl border border-[#e1ece0] flex items-start gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#b8dc26]/30 text-[#142607] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={14} className="text-[#2D6A4F]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#142607] leading-tight">{h.title}</p>
                        <p className="text-[10px] text-[#4d6653] leading-snug mt-0.5">{h.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Product Coupons Widget (if available) */}
            <ProductCouponWidget
              price={product.price * quantity}
              onApply={() => {}}
            />
          </div>
        )}

        {/* 2. FEATURES & TASTE TAB */}
        {activeTab === "features" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Highlights List */}
            {product.features && product.features.length > 0 ? (
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F] mb-3">
                  Key Highlights & Benefits
                </h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#2c3f30]">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-4 bg-[#f8faf7] rounded-2xl border border-[#e1ece0]">
                <h4 className="text-xs font-bold text-[#142607] mb-1">Traditional Konkan Delicacy</h4>
                <p className="text-xs text-[#435948] leading-relaxed">
                  Naturally sun-ripened and preserved using centuries-old coastal techniques without any artificial colors or synthetic flavoring.
                </p>
              </div>
            )}

            {/* Culinary Uses */}
            <div className="p-4 bg-[#fdfbf6] rounded-2xl border border-[#ebd8bf]">
              <h4 className="text-xs font-extrabold text-[#744210] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>🍽️</span> Serving & Culinary Tips
              </h4>
              <p className="text-xs text-[#5f4327] leading-relaxed">
                Enjoy with traditional warm steamed rice, hot rotis, or refreshing kokum soda. Best savored fresh after opening. Store in a cool, dry place away from direct sunlight.
              </p>
            </div>
          </div>
        )}

        {/* 3. SPECIFICATIONS TAB */}
        {activeTab === "specs" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F] mb-2">
              Product Specifications
            </h3>
            <div className="rounded-2xl border border-[#d6e4d5] overflow-hidden text-xs">
              {[
                { label: "Origin Region", val: `${product.region || "Sindhudurg"}, Konkan, Maharashtra` },
                { label: "Packaging Unit", val: product.unit || "Pack" },
                { label: "Category", val: product.category },
                { label: "FSSAI / GI Tag", val: "Approved Traditional Origin" },
                { label: "Shelf Life", val: "6 - 12 Months from packing" },
                { label: "Preservatives", val: "100% Chemical Free & Natural" },
                ...(product.specifications
                  ? Object.entries(product.specifications).map(([k, v]) => ({ label: k, val: v }))
                  : []),
              ].map((row, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 ${
                    i % 2 === 0 ? "bg-[#f8faf7]" : "bg-white"
                  }`}
                >
                  <span className="font-semibold text-[#48634f]">{row.label}</span>
                  <span className="font-bold text-[#142607] text-right capitalize">{row.val}</span>
                </div>
              ))}
            </div>

            {/* Vendor Profile card */}
            {product.vendorName && (
              <div className="p-3.5 bg-[#f4f8f3] rounded-2xl border border-[#d6e4d5] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-kokan-green text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {product.vendorName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#142607]">{product.vendorName}</p>
                  <p className="text-[11px] text-[#4d6653]">Verified Konkan Local Vendor</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1ece0]">
              <div>
                <div className="flex items-center gap-1.5">
                  <Star size={18} className="fill-amber-400 text-amber-400" />
                  <span className="text-xl font-black text-[#142607]">
                    {product.rating ? product.rating.toFixed(1) : "4.8"}
                  </span>
                  <span className="text-xs text-[#526c57] font-medium">/ 5.0</span>
                </div>
                <p className="text-[11px] text-[#526c57] mt-0.5">
                  Based on {product.reviewCount || 12} authentic customer ratings
                </p>
              </div>
            </div>

            <ProductReviews
              productId={product.id}
              rating={product.rating || 4.8}
              reviewCount={product.reviewCount || 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import {
  ShoppingCart,
  Check,
  Star,
  MapPin,
  Sparkles,
  Package,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";
import ProductHeroCarousel from "@/components/products/ProductHeroCarousel";
import ProductTabs from "@/components/products/ProductTabs";
import ProductDetailLoading from "./loading";
import { trackGAEvent } from "@/lib/analytics";

const RECENTLY_VIEWED_KEY = "kokan_recently_viewed";

function saveRecentlyViewed(productId: string) {
  try {
    const existing: string[] = JSON.parse(
      localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]"
    );
    const updated = [productId, ...existing.filter((id) => id !== productId)].slice(0, 10);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch {}
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart, isInCart, updateQuantity, items } = useCart();
  const { user } = useAuth();
  const track = useTrackEvent();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const fromPage = searchParams.get("fromPage") || searchParams.get("page") || undefined;
  const backHref = fromPage ? `/products?page=${fromPage}` : "/products";

  const inCart = product ? isInCart(product.id) : false;
  const cartItem = product ? items.find((i) => i.product.id === product.id) : null;

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(`vk_prod_${slug}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.id) {
          setProduct(parsed);
          setLoading(false);
        }
      }
    } catch {}

    fetch(`/api/products?slug=${slug}`)
      .then((r) => r.json())
      .then((data: Product) => {
        setProduct(data);
        setLoading(false);
        if (data?.id) {
          saveRecentlyViewed(data.id);
          track(data.id, "view");
          try {
            sessionStorage.setItem(`vk_prod_${slug}`, JSON.stringify(data));
          } catch {}
        }
      })
      .catch(() => setLoading(false));
  }, [slug]); // eslint-disable-line

  const handleAddToCart = () => {
    if (!product || product.isComingSoon) return;
    if (!user) {
      router.push("/login");
      return;
    }
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    toast.success(`Added ${quantity} ${product.unit || "item"} to cart! 🛒`, {
      style: {
        borderRadius: "9999px",
        background: "#122617",
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
      },
    });
    track(product.id, "add_to_cart");
  };

  const handleBuyNow = () => {
    if (!product || product.isComingSoon) return;

    if (!user) {
      sessionStorage.setItem(
        "vk_buynow_intent",
        JSON.stringify({ productId: product.id, quantity, slug })
      );
      router.push("/login?redirect=/checkout");
      return;
    }

    if (inCart) {
      updateQuantity(product.id, (cartItem?.quantity ?? 0) + quantity);
    } else {
      addToCart(product, quantity);
    }

    router.push("/checkout");
  };

  const category = PRODUCT_CATEGORIES.find((c) => c.value === product?.category);
  const allImages = product?.images ?? [];

  // ── Loading state ──
  if (loading) {
    return <ProductDetailLoading />;
  }

  // ── Not found state ──
  if (!product) {
    return (
      <div className="min-h-screen bg-[#dce5da] sm:py-6 sm:px-4 flex justify-center items-start">
        <div className="w-full max-w-md sm:max-w-lg min-h-screen sm:min-h-[500px] bg-[#edf3eb] relative sm:rounded-[44px] p-8 flex flex-col items-center justify-center text-center gap-4">
          <div className="text-5xl">🥥</div>
          <h2 className="text-xl font-black text-[#142607]">Product Not Found</h2>
          <p className="text-xs text-[#4d6653]">
            This delicacy might be out of season or currently being prepared.
          </p>
          <Link
            href="/products"
            className="px-6 py-2.5 bg-[#2D6A4F] text-white rounded-full text-xs font-bold hover:bg-emerald-800 transition-colors shadow-sm"
          >
            Explore All Products
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="min-h-screen bg-[#dce5da] sm:py-6 sm:px-4 lg:py-8 lg:px-8 flex justify-center items-start">
      <Toaster position="top-center" />

      {/* ── Outer App-Style Canvas Frame (Phone canvas on mobile, luxury 12-col desktop layout on lg+) ── */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-7xl min-h-screen sm:min-h-0 bg-[#edf3eb] lg:bg-transparent relative sm:rounded-[44px] lg:rounded-none sm:shadow-2xl lg:shadow-none sm:overflow-hidden lg:overflow-visible sm:border sm:border-black/10 lg:border-0 pb-28 lg:pb-16">
        
        {/* ── DUAL-COLUMN GRID FOR DESKTOP / SINGLE COLUMN CANVAS FOR MOBILE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ════ LEFT COLUMN: Product Visuals & Main Details (7-8 cols on lg+) ════ */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">

            {/* 1. Curved Bottom Hero Carousel on mobile, Luxury rounded card on desktop */}
            <div className="lg:rounded-[36px] overflow-hidden lg:shadow-xl lg:border lg:border-[#cadbc7]/70 bg-white">
              <ProductHeroCarousel
                images={allImages}
                name={product.name}
                backHref={backHref}
                fromPage={fromPage}
                category={category}
                region={product.region || "Sindhudurg"}
                slug={product.slug}
                rating={product.rating || 4.8}
              />
            </div>

            {/* 2. Content Section */}
            <div id="product-details" className="px-5 pt-6 lg:px-0 lg:pt-0 space-y-5">
              
              {/* Product Title & Info Card on Desktop, natural flow on mobile */}
              <div className="lg:bg-white lg:rounded-3xl lg:p-7 lg:border lg:border-[#cadbc7] lg:shadow-sm space-y-4">
                {/* Eyebrow: Region · Category */}
                <div>
                  <div className="flex items-center gap-1.5 text-[#1f422b] text-[11px] font-extrabold tracking-[0.2em] uppercase mb-1">
                    <Package size={13} className="text-[#2D6A4F]" />
                    <span>
                      {product.region || "Konkan"}, MH · {category?.label || "Local Specialty"}
                    </span>
                  </div>

                  {/* Product Name Title */}
                  <h1 className="text-2xl sm:text-[28px] lg:text-3xl font-black text-[#0f2416] tracking-tight leading-tight">
                    {product.name}
                  </h1>

                  {/* Short Description / Tagline Quote */}
                  {product.shortDescription && (
                    <p className="text-[12px] font-semibold text-[#2D6A4F] italic mt-2 leading-snug flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#B7895A] shrink-0" />
                      <span>&ldquo;{product.shortDescription}&rdquo;</span>
                    </p>
                  )}
                </div>

                {/* Key Info Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white lg:bg-[#edf3eb] rounded-full text-xs font-bold text-[#142e1b] shadow-2xs border border-[#d6e2d4] shrink-0">
                    <MapPin size={13} className="text-[#2D6A4F]" /> {product.region || "Sindhudurg"}, MH
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white lg:bg-[#edf3eb] rounded-full text-xs font-bold text-[#142e1b] shadow-2xs border border-[#d6e2d4] shrink-0">
                    <Package size={13} className="text-[#2D6A4F]" /> {product.unit || "500g"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white lg:bg-[#edf3eb] rounded-full text-xs font-bold text-[#142e1b] shadow-2xs border border-[#d6e2d4] shrink-0">
                    <ShieldCheck size={13} className="text-[#2D6A4F]" /> 100% Authentic GI
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white lg:bg-[#edf3eb] rounded-full text-xs font-bold text-[#142e1b] shadow-2xs border border-[#d6e2d4] shrink-0">
                    <Truck size={13} className="text-[#2D6A4F]" /> Fresh Farm Direct
                  </span>
                </div>
              </div>

              {/* 3. Managed Interactive Tabs */}
              <ProductTabs
                product={product}
                quantity={quantity}
                setQuantity={setQuantity}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                inCart={inCart}
                justAdded={justAdded}
              />
            </div>

          </div>

          {/* ════ RIGHT COLUMN: Sticky Order, Enquiry & Trust Panel (Desktop / Laptop Only) ════ */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-5">
            
            {/* Quick Order & Enquiry Card */}
            <div className="bg-white rounded-3xl border-2 border-[#2D6A4F]/25 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-[#122c1b] via-[#1a442a] to-[#245838] p-5 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-400/30">
                    {category?.label || "Konkan Specialty"}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-200 flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-300" /> Kokan Verified GI
                  </span>
                </div>

                <h2 className="text-2xl font-black tracking-tight leading-tight">
                  {product.name}
                </h2>

                <p className="text-xs text-emerald-100/80 mt-1 flex items-center gap-1.5">
                  <MapPin size={12} className="text-emerald-300 shrink-0" />
                  <span>Harvested & Prepared in {product.region || "Sindhudurg"}, Konkan</span>
                </p>

                {/* Rating & GI Badge Capsule */}
                <div className="mt-4 p-3.5 bg-black/25 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="fill-[#facc15] text-[#facc15]" />
                    <span className="text-sm font-black text-white">
                      {(product.rating || 4.8).toFixed(1)}
                    </span>
                    <span className="text-xs text-white/70">
                      ({product.reviewCount || 12} reviews)
                    </span>
                  </div>
                  <div className="text-right border-l border-white/15 pl-4">
                    <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                      Authenticity
                    </span>
                    <span className="text-xs font-black text-[#b8dc26] mt-0.5 block">
                      100% Pure & Fresh
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 space-y-3 bg-[#f8faf7] border-b border-[#e2ede0]">
                <a
                  href={`https://wa.me/918432587706?text=${encodeURIComponent(
                    `Hello Visit Kokan! I would like to enquire about ordering "${product.name}". Please share availability, pricing, and dispatch details.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackGAEvent("whatsapp_enquiry_click", {
                      source: "product_desktop",
                      item_name: product.name,
                      region: product.region || "Konkan",
                    })
                  }
                  className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md shadow-[#25D366]/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <MessageCircle size={18} className="fill-white text-transparent shrink-0" />
                  <span>Enquire & Order via WhatsApp</span>
                </a>

                <p className="text-[11px] text-center text-[#526b58] font-medium">
                  Direct connection with local Kokan producers · Fast response
                </p>
              </div>

              {/* Trust Guarantees */}
              <div className="p-5 space-y-3">
                <p className="text-[11px] font-black uppercase tracking-wider text-[#2D6A4F]">
                  The Kokan Authenticity Promise
                </p>
                <div className="space-y-2 text-xs text-[#283d2e]">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>100% Authentic Geographical Indication (GI) products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>Direct dispatch from smallholder farmers & self-help groups</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>Zero chemical preservatives or artificial coloring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>Secure doorstep delivery across India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Support & Rural Empowerment Card */}
            <div className="bg-white rounded-2xl p-4 border border-[#cadbc7] shadow-xs flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#0f2416]">Supporting Kokan Farmers</p>
                <p className="text-[11px] text-[#526b58]">Orders directly empower rural women&apos;s self-help groups (बचत गट)</p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shrink-0">
                100% Local
              </div>
            </div>

          </div>

        </div>

        {/* ── 4. Sticky Bottom Action Bar (Mobile Only: lg:hidden) ── */}
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#d6e2d4] py-3 px-4 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] lg:hidden">
          <div className="max-w-md sm:max-w-lg mx-auto flex items-center gap-3">
            <a
              href={`https://wa.me/918432587706?text=${encodeURIComponent(
                `Hello Visit Kokan! I would like to enquire about "${product.name}". Please share availability and ordering details.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackGAEvent("whatsapp_enquiry_click", {
                  source: "product_mobile",
                  item_name: product.name,
                  region: product.region || "Konkan",
                })
              }
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md shadow-[#25D366]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <MessageCircle size={16} className="fill-white text-transparent shrink-0" />
              <span>Enquire via WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

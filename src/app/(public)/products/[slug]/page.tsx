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
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";
import ProductHeroCarousel from "@/components/products/ProductHeroCarousel";
import ProductTabs from "@/components/products/ProductTabs";

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
    fetch(`/api/products?slug=${slug}`)
      .then((r) => r.json())
      .then((data: Product) => {
        setProduct(data);
        setLoading(false);
        if (data?.id) {
          saveRecentlyViewed(data.id);
          track(data.id, "view");
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
    return (
      <div className="min-h-screen bg-[#dce5da] sm:py-6 sm:px-4 flex justify-center items-start">
        <div className="w-full max-w-md sm:max-w-lg min-h-screen sm:min-h-[600px] bg-[#edf3eb] relative sm:rounded-[44px] p-8 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#142607] tracking-wider uppercase">
            Loading Fresh Konkan Delicacies...
          </p>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-[#dce5da] sm:py-6 sm:px-4 flex justify-center items-start">
      <Toaster position="top-center" />

      {/* ── Outer App-Style Canvas Frame (Identical to Single Destination UI) ── */}
      <div className="w-full max-w-md sm:max-w-lg min-h-screen sm:min-h-0 bg-[#edf3eb] relative sm:rounded-[44px] sm:shadow-2xl sm:overflow-hidden sm:border sm:border-black/10 pb-28">
        {/* 1. Curved Bottom Hero Carousel with Floating Badges */}
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

        {/* 2. Content Section (Below hero curve with soft mint background) */}
        <div id="product-details" className="px-5 pt-6 space-y-4">
          {/* Eyebrow: Region · Category */}
          <div>
            <div className="flex items-center gap-1.5 text-[#1f422b] text-[11px] font-extrabold tracking-[0.2em] uppercase mb-1">
              <Package size={13} className="text-[#2D6A4F]" />
              <span>
                {product.region || "Konkan"}, MH · {category?.label || "Local Specialty"}
              </span>
            </div>

            {/* Product Name Title */}
            <h1 className="text-2xl sm:text-[28px] font-black text-[#0f2416] tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-black text-[#2D6A4F]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-semibold text-[#48634f]">
                / {product.unit || "pack"}
              </span>

              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xs text-gray-400 line-through ml-1">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                  {discountPercent && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full shadow-2xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Short Description / Tagline Quote */}
            {product.shortDescription && (
              <p className="text-[12px] font-semibold text-[#2D6A4F] italic mt-2 leading-snug flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#B7895A] shrink-0" />
                <span>&ldquo;{product.shortDescription}&rdquo;</span>
              </p>
            )}
          </div>

          {/* Key Info Pills (Row of rounded white pill badges with subtle border) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-2xs border border-[#d6e2d4] shrink-0">
              <MapPin size={13} className="text-[#2D6A4F]" /> {product.region || "Sindhudurg"}, MH
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-2xs border border-[#d6e2d4] shrink-0">
              <Package size={13} className="text-[#2D6A4F]" /> {product.unit || "500g"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-2xs border border-[#d6e2d4] shrink-0">
              <ShieldCheck size={13} className="text-[#2D6A4F]" /> 100% Authentic GI
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-[#142e1b] shadow-2xs border border-[#d6e2d4] shrink-0">
              <Truck size={13} className="text-[#2D6A4F]" /> Fresh Farm Direct
            </span>
          </div>

          {/* 3. Managed Interactive Tabs (Eliminates excessive downward scroll) */}
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

        {/* 4. Sticky Bottom Action Bar (App Dual Action Bar - Always On Top) */}
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#d6e2d4] py-3 px-4 shadow-[0_-4px_25px_rgba(0,0,0,0.12)]">
          <div className="max-w-md sm:max-w-lg mx-auto flex items-center gap-3">
            {/* Button 1: Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
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

            {/* Button 2: Buy Now */}
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 px-3 rounded-xl font-black text-xs sm:text-sm bg-[#b8dc26] hover:bg-[#aed422] text-[#142607] shadow-md shadow-[#b8dc26]/30 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <span>
                Buy Now · ₹{(product.price * quantity).toLocaleString("en-IN")}
              </span>
              <Sparkles size={14} className="text-[#142607]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product, ProductCoupon } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import {
  ShoppingCart, Check, Star, ArrowLeft, MapPin,
  Heart, Share2, Shield, Truck, RotateCcw, Zap,
  ZoomIn, X, ChevronLeft, ChevronRight, Play,
  Package, MessageCircle, Copy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";
import CartIcon from "@/components/cart/CartIcon";
import ProductReviews from "@/components/products/ProductReviews";
import ProductCoupons from "@/components/products/ProductCoupons";
import ProductCard from "@/components/products/ProductCard";
import RecommendedProducts from '@/components/RecommendedProducts';

const RECENTLY_VIEWED_KEY = "kokan_recently_viewed";

function saveRecentlyViewed(productId: string) {
  try {
    const existing: string[] = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]");
    const updated = [productId, ...existing.filter((id) => id !== productId)].slice(0, 10);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch {}
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart, isInCart, updateQuantity, items } = useCart();
  const { user } = useAuth();
  const track = useTrackEvent();

  const [product, setProduct]             = useState<Product | null>(null);
  const [similar, setSimilar]             = useState<Product[]>([]);
  const [loading, setLoading]             = useState(true);
  const [activeImage, setActiveImage]     = useState(0);
  const [quantity, setQuantity]           = useState(1);
  const [wishlist, setWishlist]           = useState(false);
  const [lightbox, setLightbox]           = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<ProductCoupon | null>(null);
  const [shareOpen, setShareOpen]         = useState(false);
  const [copied, setCopied]               = useState(false);
  const [showVideo, setShowVideo]         = useState(false);
  const [tab, setTab]                     = useState<"description" | "features" | "specs">("description");

  const inCart   = product ? isInCart(product.id) : false;
  const cartItem = product ? items.find((i) => i.product.id === product.id) : null;

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then((r) => r.json())
      .then(async (data: Product) => {
        setProduct(data);
        setLoading(false);
        if (data?.id) {
          saveRecentlyViewed(data.id);
          track(data.id, "view");
        }
        if (data?.category) {
          const res = await fetch("/api/products");
          const all: Product[] = await res.json();
          setSimilar(all.filter((p) => p.id !== data.id && p.category === data.category).slice(0, 4));
        }
      })
      .catch(() => setLoading(false));
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!lightbox || !product) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActiveImage((i) => (i + 1) % product.images.length);
      if (e.key === "ArrowLeft")  setActiveImage((i) => (i - 1 + product.images.length) % product.images.length);
      if (e.key === "Escape")     setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, product]);

  const handleAddToCart = () => {
    if (!user) { router.push("/login"); return; }
    if (!product) return;
    if (inCart) {
      updateQuantity(product.id, (cartItem?.quantity ?? 0) + quantity);
    } else {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleShare = (platform: string) => {
    const url  = window.location.href;
    const text = `Check out ${product?.name} on Visit Kokan!`;
    if (platform === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const discountPercent = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const finalPrice = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? product!.price - Math.round(product!.price * appliedCoupon.discount / 100)
      : product!.price - appliedCoupon.discount
    : product?.price ?? 0;

  const category  = PRODUCT_CATEGORIES.find((c) => c.value === product?.category);
  const allImages = product?.images ?? [];

  if (loading) {
    return (
      <div className="min-h-screen bg-kokan-cream/30 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-kokan-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-kokan-earth/60">Product not found</p>
        <Link href="/products" className="text-kokan-green underline text-sm">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kokan-cream/20">

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 p-2 text-white/60 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActiveImage((i) => (i - 1 + allImages.length) % allImages.length)}
            className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-3xl h-[80vh] px-16">
            <Image src={allImages[activeImage]} alt={product.name} fill className="object-contain" />
          </div>
          <button
            onClick={() => setActiveImage((i) => (i + 1) % allImages.length)}
            className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 flex gap-2">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === activeImage ? "bg-white" : "bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6 pb-28 lg:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── LEFT: Media ── */}
          <div className="space-y-3">
            <div
              className="relative rounded-2xl overflow-hidden bg-white border border-kokan-sand/30 cursor-zoom-in group shadow-sm"
              style={{ height: "420px" }}
              onClick={() => !showVideo && setLightbox(true)}
            >
              {showVideo && product.videoUrl ? (
                <iframe src={product.videoUrl} className="w-full h-full" allow="autoplay" allowFullScreen />
              ) : allImages[activeImage] ? (
                <Image
                  src={allImages[activeImage]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl bg-kokan-cream/30">
                  {category?.emoji ?? "📦"}
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                <ZoomIn className="w-4 h-4 text-kokan-earth" />
              </div>
              {product.stock <= 10 && product.stock > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                  Only {product.stock} left!
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
                  <span className="text-white font-bold text-xl bg-black/60 px-6 py-3 rounded-xl">Out of Stock</span>
                </div>
              )}
              {discountPercent > 0 && (
                <div className="absolute bottom-3 left-3 bg-kokan-green text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveImage(i); setShowVideo(false); }}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImage === i && !showVideo
                      ? "border-kokan-green shadow-md"
                      : "border-kokan-sand/40 hover:border-kokan-green/50"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
              {product.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 bg-kokan-earth flex items-center justify-center transition-all ${
                    showVideo ? "border-kokan-green" : "border-kokan-sand/40"
                  }`}
                >
                  <Play className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="space-y-5">
            <div>
              <span className="text-xs bg-kokan-green/10 text-kokan-green px-2.5 py-1 rounded-full font-medium border border-kokan-green/20">
                {category?.emoji} {category?.label}
              </span>
              <h1 className="font-playfair text-2xl lg:text-3xl font-bold text-kokan-earth mt-3 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-1 bg-kokan-green px-2 py-1 rounded-lg">
                  <span className="text-white text-sm font-bold">{product.rating.toFixed(1)}</span>
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                </div>
                <span className="text-sm text-kokan-earth/50">{product.reviewCount.toLocaleString()} ratings</span>
                <span className="text-kokan-earth/20">|</span>
                <div className="flex items-center gap-1 text-sm text-kokan-earth/50">
                  <MapPin className="w-3.5 h-3.5" /> {product.region}
                </div>
                {product.stock > 0 ? (
                  <span className="text-xs text-kokan-green font-semibold bg-kokan-green/10 px-2 py-0.5 rounded-full border border-kokan-green/20">
                    ✓ In Stock
                  </span>
                ) : (
                  <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-kokan-sand/30 shadow-sm">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-kokan-earth">
                  ₹{finalPrice.toLocaleString("en-IN")}
                </span>
                {(appliedCoupon || product.originalPrice) && (
                  <span className="text-lg text-kokan-earth/40 line-through">
                    ₹{(appliedCoupon ? product.price : product.originalPrice)?.toLocaleString("en-IN")}
                  </span>
                )}
                {discountPercent > 0 && !appliedCoupon && (
                  <span className="text-sm text-kokan-green font-bold">{discountPercent}% off</span>
                )}
                <span className="text-sm text-kokan-earth/50">{product.unit}</span>
              </div>
              {appliedCoupon && (
                <p className="text-sm text-kokan-green font-medium mt-1">
                  🎉 Coupon applied! You save ₹{(product.price - finalPrice).toLocaleString("en-IN")}
                </p>
              )}
              <p className="text-xs text-kokan-earth/40 mt-2">Inclusive of all taxes</p>
            </div>

            {product.coupons && product.coupons.length > 0 && (
              <ProductCoupons coupons={product.coupons} price={product.price} onApply={setAppliedCoupon} />
            )}

            <div className="flex items-center gap-3 bg-kokan-cream/50 rounded-xl px-4 py-3 border border-kokan-sand/20">
              <Truck className="w-4 h-4 text-kokan-green flex-shrink-0" />
              <p className="text-sm text-kokan-earth/70">
                <span className="font-semibold text-kokan-earth">Free delivery</span> — estimated 5-7 business days
              </p>
            </div>

            <div className="bg-white rounded-xl border border-kokan-sand/30 overflow-hidden shadow-sm">
              <div className="flex border-b border-kokan-sand/30">
                {(["description", "features", "specs"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                      tab === t
                        ? "border-kokan-green text-kokan-green bg-kokan-green/5"
                        : "border-transparent text-kokan-earth/50 hover:text-kokan-earth"
                    }`}
                  >
                    {t === "specs" ? "Specs" : t}
                  </button>
                ))}
              </div>
              <div className="p-4">
                {tab === "description" && (
                  <p className="text-sm text-kokan-earth/70 leading-relaxed">{product.description}</p>
                )}
                {tab === "features" && (
                  <ul className="space-y-2">
                    {product.features && product.features.length > 0 ? (
                      product.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-kokan-earth/70">
                          <Check className="w-4 h-4 text-kokan-green flex-shrink-0 mt-0.5" /> {f}
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-kokan-earth/40 italic">No features listed</p>
                    )}
                  </ul>
                )}
                {tab === "specs" && (
                  <div className="space-y-2">
                    {product.specifications && Object.keys(product.specifications).length > 0 ? (
                      Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="flex gap-4 py-2 border-b border-kokan-sand/20 last:border-0">
                          <span className="text-sm text-kokan-earth/50 w-32 flex-shrink-0">{key}</span>
                          <span className="text-sm text-kokan-earth font-medium">{val}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-kokan-earth/40 italic">No specifications listed</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-kokan-earth/50">
              Sold by <span className="font-semibold text-kokan-earth">{product.vendorName ?? "Visit Kokan"}</span>
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-kokan-sand/50 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock === 0}
                  className="px-4 py-2.5 hover:bg-kokan-cream/40 text-kokan-earth transition-colors disabled:opacity-40 text-lg font-medium"
                >−</button>
                <span className="px-5 py-2.5 font-bold text-kokan-earth min-w-[3rem] text-center border-x border-kokan-sand/30">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={product.stock === 0}
                  className="px-4 py-2.5 hover:bg-kokan-cream/40 text-kokan-earth transition-colors disabled:opacity-40 text-lg font-medium"
                >+</button>
              </div>
              <span className="text-xs text-kokan-earth/40">{product.stock} available</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-sm ${
                  inCart
                    ? "bg-kokan-green/10 text-kokan-green border-2 border-kokan-green/30"
                    : "border-2 border-kokan-green text-kokan-green hover:bg-kokan-green/5"
                }`}
              >
                {inCart ? <><Check className="w-5 h-5" /> In Cart</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold bg-kokan-green text-white hover:bg-kokan-green/90 transition-all disabled:opacity-50 shadow-md"
              >
                <Zap className="w-5 h-5" /> Buy Now
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: <Shield className="w-4 h-4 text-kokan-green" />, label: "Secure Payment" },
                { icon: <RotateCcw className="w-4 h-4 text-kokan-green" />, label: "Easy Returns" },
                { icon: <Package className="w-4 h-4 text-kokan-green" />, label: "Quality Assured" },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center gap-1.5 bg-white rounded-xl py-3 px-2 border border-kokan-sand/30 shadow-sm">
                  {badge.icon}
                  <span className="text-xs text-kokan-earth/60 text-center leading-tight">{badge.label}</span>
                </div>
              ))}
            </div>

            {!user && (
              <p className="text-xs text-kokan-earth/40 text-center">
                <Link href="/login" className="text-kokan-green underline font-medium">Login</Link> required before checkout
              </p>
            )}
          </div>
        </div>

        {/* ── Recommended Products ── */}
        <RecommendedProducts productId={product.id} />

        <div className="mt-16">
          <ProductReviews productId={product.id} rating={product.rating} reviewCount={product.reviewCount} />
        </div>
      </div>

      {/* Sticky bottom bar mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-kokan-sand/30 p-3 flex gap-3 lg:hidden z-30 shadow-lg">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${
            inCart
              ? "bg-kokan-green/10 text-kokan-green border-2 border-kokan-green/30"
              : "border-2 border-kokan-green text-kokan-green"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {inCart ? "In Cart" : "Add to Cart"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-kokan-green text-white hover:bg-kokan-green/90 disabled:opacity-50 shadow-md"
        >
          <Zap className="w-4 h-4" /> Buy Now
        </button>
      </div>
    </div>
  );
}
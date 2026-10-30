"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, ChevronRight, ArrowRight, Flame, Tag,Clock ,Lock} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";

const BANNERS = [
  {
    title: "Alphonso Mangoes",
    sub: "Ratnagiri GI-Certified Hapus",
    cta: "Shop Fruits",
    href: "/products?category=fruits",
    image: "/images/banners/alphonso-mangoes.jpg",
  },
  {
    title: "Pure Kokum Sherbet",
    sub: "Fresh Sindhudurg Agal & Drinks",
    cta: "Shop Beverages",
    href: "/products?category=beverages",
    image: "/images/banners/kokum-sherbet.jpg",
  },
  {
    title: "Konkan Cashews",
    sub: "Jumbo Roasted & Salted Kaju",
    cta: "Shop Nuts",
    href: "/products?category=nuts",
    image: "/images/banners/konkan-cashews.jpg",
  },
];

function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
      style={{ scrollbarWidth: "none" }}
    >
      {children}
    </div>
  );
}

function ProductMiniCard({ product }: { product: Product }) {
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [imgErr, setImgErr] = useState(false);
  const inCart = isInCart(product.id);
  const category = PRODUCT_CATEGORIES.find((c) => c.value === product.category);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.isComingSoon) return;
    if (!user) { router.push("/login"); return; }
    addToCart(product);
  };

   const maskPrice = (price: number) => {
  const str = Math.round(price).toString();
  if (str.length <= 1) return `₹${str}`;
  return `₹${"*".repeat(str.length - 1)}${str.slice(-1)}`;
};

  const hasImg = !imgErr && Boolean(product.images?.[0]);

  return (
    <Link href={`/products/${product.slug}`} className="flex-shrink-0 snap-start">
      <div className="w-36 sm:w-40 bg-white rounded-2xl border border-kokan-sand/30 overflow-hidden hover:shadow-md transition-all">
        <div className="relative h-32 bg-kokan-sand/10">
          {hasImg ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 144px, 160px"
              unoptimized={product.images[0].includes("wikimedia.org") || product.images[0].includes("unsplash.com")}
              onError={() => setImgErr(true)}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {category?.emoji ?? "📦"}
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white/90 text-xs font-bold text-yellow-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
            {product.rating.toFixed(1)}
          </div>
          {product.isComingSoon && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              <Clock className="w-2.5 h-2.5" /> Soon
            </div>
          )}
        </div>
        <div className="p-2.5">
          <p className="text-xs font-semibold text-kokan-earth line-clamp-2 leading-tight mb-1">{product.name}</p>
          <p className="text-xs text-kokan-earth/40 mb-2">{product.unit}</p>
          <div className="flex items-center justify-between">


            {product.hidePrice ? (
                <span className="flex items-center gap-1 text-kokan-earth/40 font-bold text-base leading-none tracking-wider">
                  <Lock className="w-3 h-3" />
                  {maskPrice(product.price)}
                </span>
              ) : (
                <span className="text-kokan-earth font-bold text-base leading-none">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              )}
              
            {product.isComingSoon ? (
              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium bg-amber-50 text-amber-600 border border-amber-200">
                <Clock className="w-3 h-3" /> Soon
              </span>
            ) : (
              <button
                onClick={handleAdd}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium transition-colors ${
                  inCart
                    ? "bg-kokan-green/10 text-kokan-green"
                    : "bg-kokan-green text-white hover:bg-kokan-green/90"
                }`}
              >
                <ShoppingCart className="w-3 h-3" />
                {inCart ? "Added" : "Add"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); });

    // Auto-rotate banner
    const timer = setInterval(() => setActiveBanner((i) => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const byCategory = (cat: string) =>
    products.filter((p) => cat === "all" || p.category === cat).slice(0, 10);

  const RECENTLY_VIEWED_KEY = "kokan_recently_viewed";
  const recentIds: string[] = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]")
    : [];
  const recentProducts = products.filter((p) => recentIds.includes(p.id)).slice(0, 6);

  return (
    <div className="bg-kokan-cream/20">
      {/* Category pills */}
      <div className="bg-white border-b border-kokan-sand/20 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-kokan-green text-white"
                : "bg-kokan-sand/20 text-kokan-earth/70 hover:bg-kokan-sand/30"
            }`}
          >
            🛍️ All
          </button>
          {PRODUCT_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setActiveCategory(c.value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                activeCategory === c.value
                  ? "bg-kokan-green text-white"
                  : "bg-kokan-sand/20 text-kokan-earth/70 hover:bg-kokan-sand/30"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5 space-y-8">
        {/* Banner */}
        <div>
          <div className="relative h-48 sm:h-56 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
            {BANNERS.map((banner, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  i === activeBanner ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Background image */}
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={i === 0}
                  className="object-cover"
                />

                {/* Left gradient overlay — keeps text readable while product photo stays vibrant */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                {/* Content: Name on left side top, Explore button at bottom */}
                <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between items-start max-w-[70%] sm:max-w-sm">
                  {/* Left Top */}
                  <div>
                    <span className="text-amber-300/95 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] drop-shadow-sm block mb-1">
                      {banner.sub}
                    </span>
                    <h3 className="text-white font-display font-bold text-xl sm:text-3xl leading-[1.15] drop-shadow-md tracking-tight">
                      {banner.title}
                    </h3>
                  </div>

                  {/* Left Bottom: Frosted transparent explore button */}
                  <Link
                    href={banner.href}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/35 shadow-sm transition-all hover:scale-105 active:scale-95"
                  >
                    {banner.cta} <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Banner dots */}
          <div className="flex justify-center items-center gap-1.5 mt-2.5">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === activeBanner ? "w-5 h-1.5 bg-kokan-green" : "w-1.5 h-1.5 bg-kokan-sand/40 hover:bg-kokan-sand/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trending now */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-kokan-earth flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" /> Trending Now
            </h2>
            <Link href="/products" className="text-xs text-kokan-green flex items-center gap-1 font-medium">
              See all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-36 h-48 bg-white rounded-2xl animate-pulse flex-shrink-0" />
              ))}
            </div>
          ) : (
            <HorizontalScroll>
              {byCategory(activeCategory).map((p) => (
                <ProductMiniCard key={p.id} product={p} />
              ))}
            </HorizontalScroll>
          )}
        </div>

        {/* Category sections */}
        {PRODUCT_CATEGORIES.filter((c) =>
          products.some((p) => p.category === c.value)
        ).map((cat) => (
          <div key={cat.value}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-kokan-earth">
                {cat.emoji} {cat.label}
              </h2>
              <Link
                href={`/products?category=${cat.value}`}
                className="text-xs text-kokan-green flex items-center gap-1 font-medium"
              >
                See all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <HorizontalScroll>
              {products
                .filter((p) => p.category === cat.value)
                .slice(0, 8)
                .map((p) => (
                  <ProductMiniCard key={p.id} product={p} />
                ))}
            </HorizontalScroll>
          </div>
        ))}

        {/* Recently viewed */}
        {recentProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-kokan-earth flex items-center gap-2">
                🕐 Recently Viewed
              </h2>
            </div>
            <HorizontalScroll>
              {recentProducts.map((p) => (
                <ProductMiniCard key={p.id} product={p} />
              ))}
            </HorizontalScroll>
          </div>
        )}

        {/* Offers section */}
        <div className="bg-kokan-green/5 border border-kokan-green/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-kokan-green" />
            <h2 className="font-semibold text-kokan-earth">Today&apos;s Offers</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Free delivery on orders above ₹500", emoji: "🚚" },
              { label: "Fresh harvest — limited stock", emoji: "🌿" },
              { label: "GI certified Konkan products", emoji: "✅" },
              { label: "Direct from farmers", emoji: "🧑‍🌾" },
            ].map((offer) => (
              <div key={offer.label} className="flex items-start gap-2 bg-white rounded-xl p-3 border border-kokan-sand/30">
                <span className="text-xl">{offer.emoji}</span>
                <p className="text-xs text-kokan-earth/70 leading-tight">{offer.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* View all CTA */}
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 w-full py-3 border-2 border-kokan-green text-kokan-green rounded-2xl font-semibold text-sm hover:bg-kokan-green hover:text-white transition-colors"
        >
          View All Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, ChevronRight, ArrowRight, Flame, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";

const BANNERS = [
  {
    title: "Limited Season Offer",
    highlight: "Pure Kokum Sherbet",
    sub: "Straight from Sindhudurg farms",
    cta: "Shop Beverages →",
    href: "/products?category=beverages",
    bg: "from-kokan-green to-emerald-700",
    emoji: "🍹",
  },
  {
    title: "Harvest Special",
    highlight: "Alphonso Mangoes",
    sub: "Ratnagiri GI certified Hapus",
    cta: "Shop Fruits →",
    href: "/products?category=fruits",
    bg: "from-amber-500 to-orange-600",
    emoji: "🥭",
  },
  {
    title: "Monsoon Sale",
    highlight: "Konkan Cashews",
    sub: "Fresh this season from Goa border",
    cta: "Shop Nuts →",
    href: "/products?category=nuts",
    bg: "from-kokan-earth to-amber-800",
    emoji: "🥜",
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
  const inCart = isInCart(product.id);
  const category = PRODUCT_CATEGORIES.find((c) => c.value === product.category);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    addToCart(product);
  };

  return (
    <Link href={`/products/${product.slug}`} className="flex-shrink-0 snap-start">
      <div className="w-36 sm:w-40 bg-white rounded-2xl border border-kokan-sand/30 overflow-hidden hover:shadow-md transition-all">
        <div className="relative h-32 bg-kokan-sand/10">
          {product.images?.[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {category?.emoji ?? "📦"}
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white/90 text-xs font-bold text-yellow-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
            {product.rating.toFixed(1)}
          </div>
        </div>
        <div className="p-2.5">
          <p className="text-xs font-semibold text-kokan-earth line-clamp-2 leading-tight mb-1">{product.name}</p>
          <p className="text-xs text-kokan-earth/40 mb-2">{product.unit}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-kokan-green">₹{product.price}</span>
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
        <div className="relative rounded-2xl overflow-hidden">
          {BANNERS.map((banner, i) => (
            <div
              key={i}
              className={`transition-all duration-500 ${i === activeBanner ? "block" : "hidden"}`}
            >
              <div className={`bg-gradient-to-r ${banner.bg} p-6 rounded-2xl flex items-center justify-between`}>
                <div>
                  <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">{banner.title}</p>
                  <h3 className="text-white font-playfair font-bold text-xl mb-2">{banner.highlight}</h3>
                  <p className="text-white/70 text-xs mb-3">{banner.sub}</p>
                  <Link
                    href={banner.href}
                    className="inline-block bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                  >
                    {banner.cta}
                  </Link>
                </div>
                <div className="text-6xl">{banner.emoji}</div>
              </div>
            </div>
          ))}
          {/* Banner dots */}
          <div className="flex justify-center gap-1.5 mt-2">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className={`rounded-full transition-all ${i === activeBanner ? "w-5 h-1.5 bg-kokan-green" : "w-1.5 h-1.5 bg-kokan-sand/40"}`}
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
            <h2 className="font-semibold text-kokan-earth">Today's Offers</h2>
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
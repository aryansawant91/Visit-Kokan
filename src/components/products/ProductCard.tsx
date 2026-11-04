"use client";

import { useState } from "react";
import { ShoppingCart, Star, Check, Clock, Lock, MapPin, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";
import { useTrackEvent } from "@/hooks/useTrackEvent";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  page?: number;
  onCardClick?: () => void;
}

export default function ProductCard({
  product,
  featured = false,
  page = 1,
  onCardClick,
}: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const track = useTrackEvent();
  const inCart = isInCart(product.id);
  const category = PRODUCT_CATEGORIES.find((c) => c.value === product.category);
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.isComingSoon) return;
    if (!user) {
      router.push("/login");
      return;
    }
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    track(product.id, "add_to_cart");
  };

  const maskPrice = (price: number) => {
    const str = Math.round(price).toString();
    if (str.length <= 1) return `₹${str}`;
    return `₹${"*".repeat(str.length - 1)}${str.slice(-1)}`;
  };

  const hasImage = !imgError && Boolean(product.images?.[0]);

  // If featured card (like in Featured Destinations carousel)
  if (featured) {
    return (
      <Link
        href={`/products/${product.slug}?fromPage=${page}`}
        onClick={() => {
          track(product.id, "click");
          onCardClick?.();
        }}
        className="block group"
      >
        <div className="relative rounded-2xl overflow-hidden shadow-sm h-52 sm:h-64 border border-kokan-sand/20 bg-emerald-950/20">
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 70vw, 280px"
              unoptimized={Boolean(product.images[0] && !product.images[0].startsWith("/"))}
              onError={() => setImgError(true)}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-[#081C15] flex items-center justify-center text-4xl">
              {category?.emoji ?? "🥥"}
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
              ⭐ Featured
            </span>
            {product.isComingSoon && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" /> Soon
              </span>
            )}
          </div>

          <div className="absolute top-2.5 right-2.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/30 flex items-center gap-1">
            <span>{category?.emoji ?? "🥥"}</span>
            <span>{category?.label ?? product.category}</span>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-bold text-sm sm:text-base leading-tight line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center justify-between gap-2 mt-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5 text-white/75 text-[11px]">
                  <MapPin className="w-3 h-3" /> {product.region || "Sindhudurg"}
                </span>
                <span className="flex items-center gap-0.5 text-white/75 text-[11px]">
                  <Package className="w-3 h-3" /> {product.unit || "Pack"}
                </span>
              </div>
              {product.rating > 0 && (
                <div className="flex items-center gap-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                  {product.rating.toFixed(1)}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/15">
              <span className="text-white font-black text-sm">
                ₹{product.price?.toLocaleString("en-IN")}
                <span className="text-[11px] text-white/60 font-normal"> / {product.unit || "pack"}</span>
              </span>
              <button
                type="button"
                onClick={handleAddToCart}
                className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                  justAdded || inCart
                    ? "bg-white text-kokan-green shadow-sm"
                    : "bg-kokan-green text-white hover:bg-emerald-600 shadow-sm"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3 h-3" /> Added
                  </>
                ) : inCart ? (
                  <>
                    <ShoppingCart className="w-3 h-3" /> In Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3 h-3" /> Add
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Standard Grid Product Card
  return (
    <Link
      href={`/products/${product.slug}?fromPage=${page}`}
      onClick={() => {
        track(product.id, "click");
        onCardClick?.();
      }}
      className="block group h-full"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-kokan-sand/30 shadow-xs hover:shadow-md hover:border-kokan-green/30 transition-all duration-300 flex flex-col justify-between h-full">
        {/* Image Container */}
        <div className="relative h-36 sm:h-44 bg-[#fbf8f3] overflow-hidden">
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized={Boolean(product.images[0] && !product.images[0].startsWith("/"))}
              onError={() => setImgError(true)}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50/50 text-kokan-green">
              <span className="text-4xl">{category?.emoji ?? "📦"}</span>
              <span className="text-[11px] font-semibold text-emerald-800/60 mt-1 px-2 text-center line-clamp-1">
                {product.name}
              </span>
            </div>
          )}

          {/* Category Pill Tag */}
          <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-kokan-earth text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs border border-gray-100 flex items-center gap-1">
            <span>{category?.emoji ?? "🥥"}</span>
            <span className="capitalize">{category?.label ?? product.category}</span>
          </span>

          {/* Rating Badge */}
          {product.rating > 0 && (
            <span className="absolute top-2 right-2 flex items-center gap-0.5 bg-white/90 text-yellow-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-2xs">
              <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
              {product.rating.toFixed(1)}
            </span>
          )}

          {/* Coming soon badge */}
          {product.isComingSoon && (
            <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              <Clock className="w-2.5 h-2.5" /> Soon
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="p-3 flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-semibold text-gray-800 text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2.4rem] group-hover:text-kokan-green transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-kokan-green" /> {product.region || "Sindhudurg"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <Package className="w-3 h-3 text-gray-400" /> {product.unit || "Pack"}
              </span>
            </div>
          </div>

          {/* Bottom Action / Price Row */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-kokan-sand/20 gap-1.5">
            <div className="flex flex-col min-w-0">
              {product.hidePrice ? (
                <span className="flex items-center gap-1 text-gray-400 font-bold text-sm leading-none tracking-wider">
                  <Lock className="w-3 h-3" />
                  {maskPrice(product.price)}
                </span>
              ) : (
                <span className="text-kokan-green font-bold text-sm leading-none">
                  ₹{product.price?.toLocaleString("en-IN")}
                  <span className="text-[10px] text-gray-400 font-normal"> / {product.unit || "unit"}</span>
                </span>
              )}
            </div>

            {product.isComingSoon ? (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                Soon
              </span>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  justAdded || inCart
                    ? "bg-kokan-green text-white shadow-xs"
                    : "bg-kokan-green/10 text-kokan-green hover:bg-kokan-green hover:text-white"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3 h-3" /> Added
                  </>
                ) : inCart ? (
                  <>
                    <ShoppingCart className="w-3 h-3" /> In Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3 h-3" /> Add
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

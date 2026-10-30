"use client";

import { useState } from "react";
import { ShoppingCart, Star, Check, Clock, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";
import { useTrackEvent } from "@/hooks/useTrackEvent";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const track = useTrackEvent();
  const inCart = isInCart(product.id);
  const category = PRODUCT_CATEGORIES.find((c) => c.value === product.category);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.isComingSoon) return;
    if (!user) { router.push("/login"); return; }
    addToCart(product);
    track(product.id, "add_to_cart");
  };

  const maskPrice = (price: number) => {
    const str = Math.round(price).toString();
    if (str.length <= 1) return `₹${str}`;
    return `₹${"*".repeat(str.length - 1)}${str.slice(-1)}`;
  };

  const hasImage = !imgError && Boolean(product.images?.[0]);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="block"
      onClick={() => track(product.id, "click")}
    >
      <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-700/20 transition-all duration-200 active:scale-[0.99] flex flex-col h-full">
        <div className="relative bg-[#fdf8f3] overflow-hidden" style={{ paddingBottom: "100%" }}>
          <div className="absolute inset-0">
            {hasImage ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                unoptimized={
                  product.images[0].includes("wikimedia.org") ||
                  product.images[0].includes("unsplash.com")
                }
                onError={() => setImgError(true)}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50/40 text-kokan-green">
                <span className="text-4xl">{category?.emoji ?? "📦"}</span>
                <span className="text-[11px] font-semibold text-emerald-800/60 mt-1 px-2 text-center line-clamp-1">
                  {product.name}
                </span>
              </div>
            )}
          </div>
          <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-kokan-earth text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs border border-gray-100">
            {category?.emoji} {category?.label}
          </span>
          {product.rating > 0 && (
            <span className="absolute top-2 right-2 flex items-center gap-0.5 bg-kokan-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-2xs">
              {product.rating.toFixed(1)} <Star className="w-2.5 h-2.5 fill-white" />
            </span>
          )}
          {product.isComingSoon && (
            <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-xs">
              <Clock className="w-2.5 h-2.5" /> Coming Soon
            </span>
          )}
        </div>
        <div className="p-3 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-kokan-green transition-colors">
              {product.name}
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">{product.region}, Konkan</p>
            {product.reviewCount > 0 && (
              <p className="text-[10px] text-gray-400 mt-0.5">{product.reviewCount.toLocaleString()} reviews</p>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 gap-1.5">
            <div className="flex flex-col min-w-0">
              {product.hidePrice ? (
                <span className="flex items-center gap-1 text-gray-400 font-bold text-sm leading-none tracking-wider">
                  <Lock className="w-3 h-3" />
                  {maskPrice(product.price)}
                </span>
              ) : (
                <span className="text-gray-900 font-bold text-base leading-none">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-[10px] text-gray-400 mt-0.5 truncate">{product.unit}</span>
            </div>

            {product.isComingSoon ? (
              <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 flex-shrink-0">
                <Clock className="w-3.5 h-3.5" /> Soon
              </span>
            ) : (
              <button
                onClick={handleAddToCart}
                aria-label={inCart ? "In Cart" : "Add to Cart"}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 shadow-2xs ${
                  inCart
                    ? "bg-emerald-50 text-kokan-green border border-emerald-300"
                    : "bg-kokan-green text-white hover:bg-emerald-800 active:scale-95"
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" /> Add
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

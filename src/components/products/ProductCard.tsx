"use client";

import { ShoppingCart, Star, Check, Clock,Lock } from "lucide-react";
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.isComingSoon) return;
    if (!user) { router.push("/login"); return; }
    addToCart(product);
    track(product.id, 'add_to_cart');
  };

  const maskPrice = (price: number) => {
  const str = Math.round(price).toString();
  if (str.length <= 1) return `₹${str}`;
  return `₹${"*".repeat(str.length - 1)}${str.slice(-1)}`;
};



  return (
    <Link
      href={`/products/${product.slug}`}
      className="block"
      onClick={() => track(product.id, 'click')}
    >
      <div className="group bg-white rounded-xl overflow-hidden border border-kokan-sand/30 hover:shadow-md transition-all duration-200 active:scale-[0.98]">
        <div className="relative bg-kokan-cream/30 overflow-hidden" style={{ paddingBottom: "100%" }}>
          <div className="absolute inset-0">
            {product.images?.[0] ? (
              <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">{category?.emoji ?? "📦"}</div>
            )}
          </div>
          <span className="absolute top-2 left-2 bg-white/95 text-kokan-earth text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
            {category?.emoji} {category?.label}
          </span>
          {product.rating > 0 && (
            <span className="absolute top-2 right-2 flex items-center gap-0.5 bg-kokan-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {product.rating.toFixed(1)} <Star className="w-2.5 h-2.5 fill-white" />
            </span>
          )}
          {product.isComingSoon && (
            <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
              <Clock className="w-2.5 h-2.5" /> Coming Soon
            </span>
          )}
        </div>
        <div className="p-2.5 sm:p-3">
          <h3 className="font-semibold text-kokan-earth text-sm leading-tight line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
          <p className="text-[11px] text-kokan-earth/50 mt-0.5 truncate">{product.region}</p>
          {product.reviewCount > 0 && (
            <p className="text-[10px] text-kokan-earth/40 mt-0.5">{product.reviewCount.toLocaleString()} reviews</p>
          )}
          <div className="flex items-center justify-between mt-2 gap-1">
            <div className="flex flex-col min-w-0">
            <div className="flex flex-col min-w-0">
             
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
              
              <span className="text-[10px] text-kokan-earth/40 mt-0.5 truncate">{product.unit}</span>
            </div>
              <span className="text-[10px] text-kokan-earth/40 mt-0.5 truncate">{product.unit}</span>
            </div>
            {product.isComingSoon ? (
              <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 flex-shrink-0">
                <Clock className="w-3.5 h-3.5" /> Coming Soon
              </span>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                  inCart
                    ? "bg-kokan-green/10 text-kokan-green border border-kokan-green/30"
                    : "bg-kokan-green text-white hover:bg-kokan-green/90 active:scale-95"
                }`}
              >
                {inCart ? <><Check className="w-3.5 h-3.5" /> Added</> : <><ShoppingCart className="w-3.5 h-3.5" /> Add</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
"use client";

import { ShoppingCart, Star, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const inCart = isInCart(product.id);

  const category = PRODUCT_CATEGORIES.find((c) => c.value === product.category);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    addToCart(product);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-kokan-sand/30">
        {/* Image */}
        <div className="relative h-48 bg-kokan-sand/20 overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              {category?.emoji ?? "📦"}
            </div>
          )}
          <span className="absolute top-3 left-3 bg-white/90 text-kokan-earth text-xs font-medium px-2 py-1 rounded-full">
            {category?.emoji} {category?.label}
          </span>
        </div>

        {/* Details */}
        <div className="p-4">
          <h3 className="font-semibold text-kokan-earth truncate">{product.name}</h3>
          <p className="text-xs text-kokan-earth/50 mt-0.5">{product.region}</p>

          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-kokan-earth">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-kokan-earth/40">({product.reviewCount})</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-kokan-green font-bold text-lg">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-kokan-earth/50 ml-1">{product.unit}</span>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                inCart
                  ? "bg-kokan-green/10 text-kokan-green"
                  : "bg-kokan-green text-white hover:bg-kokan-green/90"
              }`}
            >
              {inCart ? <><Check className="w-4 h-4" /> Added</> : <><ShoppingCart className="w-4 h-4" /> Add</>}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
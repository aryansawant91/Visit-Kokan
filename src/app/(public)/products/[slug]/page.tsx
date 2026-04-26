"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, Check, Star, ArrowLeft, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";
import CartIcon from "@/components/cart/CartIcon";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart, isInCart, updateQuantity, items } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const inCart = product ? isInCart(product.id) : false;
  const cartItem = product ? items.find((i) => i.product.id === product.id) : null;

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => { setProduct(data); setLoading(false); });
  }, [slug]);

  const handleAddToCart = () => {
    if (!user) { router.push("/login"); return; }
    if (!product) return;
    if (inCart) {
      updateQuantity(product.id, (cartItem?.quantity ?? 0) + quantity);
    } else {
      addToCart(product, quantity);
    }
  };

  const category = PRODUCT_CATEGORIES.find((c) => c.value === product?.category);

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
    <div className="min-h-screen bg-kokan-cream/30">
      {/* Topbar */}
      <div className="bg-white border-b border-kokan-sand/40 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-kokan-earth/70 hover:text-kokan-earth text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <CartIcon />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden bg-kokan-sand/20">
            {product.images?.[activeImage] ? (
              <Image src={product.images[activeImage]} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl">
                {category?.emoji ?? "📦"}
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === i ? "border-kokan-green" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <span className="text-xs bg-kokan-green/10 text-kokan-green px-2 py-1 rounded-full font-medium">
              {category?.emoji} {category?.label}
            </span>
            <h1 className="text-3xl font-bold text-kokan-earth font-playfair mt-3">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-kokan-earth/40">({product.reviewCount} reviews)</span>
              </div>
              <span className="text-kokan-earth/30">•</span>
              <div className="flex items-center gap-1 text-sm text-kokan-earth/60">
                <MapPin className="w-3.5 h-3.5" /> {product.region}
              </div>
            </div>
          </div>

          <p className="text-kokan-earth/70 leading-relaxed">{product.description}</p>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-kokan-green">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="text-kokan-earth/50 text-sm">{product.unit}</span>
          </div>

          <p className="text-sm text-kokan-earth/50">
            By <span className="font-medium text-kokan-earth">{product.vendorName}</span>
          </p>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-kokan-sand rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-kokan-sand/20 text-kokan-earth transition-colors"
              >−</button>
              <span className="px-4 py-2 font-medium text-kokan-earth">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-kokan-sand/20 text-kokan-earth transition-colors"
              >+</button>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors ${
                inCart
                  ? "bg-kokan-green/10 text-kokan-green"
                  : "bg-kokan-green text-white hover:bg-kokan-green/90"
              }`}
            >
              {inCart ? <><Check className="w-5 h-5" /> In Cart</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
            </button>
          </div>

          {!user && (
            <p className="text-xs text-kokan-earth/50 text-center">
              You'll be asked to{" "}
              <Link href="/login" className="text-kokan-green underline">login</Link>{" "}
              before checkout
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
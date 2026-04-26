"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Check, ArrowRight } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";

function ProductCard({ product }: { product: Product }) {
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
              {inCart
                ? <><Check className="w-4 h-4" /> Added</>
                : <><ShoppingCart className="w-4 h-4" /> Add</>
              }
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setProducts(list.slice(0, 3)); // show only 3 on homepage
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null; // hide section if no products yet

  return (
    <section className="py-16 px-4 bg-kokan-cream/40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-kokan-sand font-medium text-sm tracking-widest uppercase mb-2">
              Fresh from the Coast
            </p>
            <h2 className="text-4xl font-display font-bold text-kokan-earth">
              Kokan Products
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-kokan-green font-medium hover:gap-3 transition-all"
          >
            All products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
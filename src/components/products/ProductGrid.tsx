"use client";

import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { PackageOpen } from "lucide-react";

export default function ProductGrid({ products }: { products: Product[] }) {
  const safeProducts = Array.isArray(products) ? products : [];

  if (safeProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <PackageOpen className="w-16 h-16 text-kokan-sand" />
        <p className="text-kokan-earth/60 font-medium">No products found</p>
        <p className="text-sm text-kokan-earth/40">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {safeProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
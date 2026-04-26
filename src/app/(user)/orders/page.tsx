"use client";

import { Package, ShoppingCart, ArrowRight, Truck } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function OrdersPage() {
  const { items, totalPrice, totalItems } = useCart();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-kokan-earth">My Orders</h1>
        <p className="text-kokan-earth/50 text-sm mt-1">Your product order history</p>
      </div>

      {/* Cart summary if items exist */}
      {items.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-kokan-green/30 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-kokan-earth flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-kokan-green" />
              Current Cart ({totalItems} items)
            </h2>
            <span className="font-bold text-kokan-green">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 py-2 border-b border-kokan-sand/20 last:border-0">
                <div className="w-10 h-10 bg-kokan-sand/20 rounded-xl flex items-center justify-center text-xl">
                  🥭
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-kokan-earth truncate">{item.product.name}</p>
                  <p className="text-xs text-kokan-earth/50">
                    {item.quantity} × ₹{item.product.price.toLocaleString("en-IN")} {item.product.unit}
                  </p>
                </div>
                <p className="text-sm font-semibold text-kokan-earth flex-shrink-0">
                  ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 w-full py-3 bg-kokan-green text-white rounded-xl text-sm font-semibold hover:bg-kokan-green/90 transition-colors"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Past orders empty state */}
      <div className="bg-white rounded-2xl p-12 border border-kokan-sand/30 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 bg-kokan-sand/20 rounded-full flex items-center justify-center">
          <Package className="w-8 h-8 text-kokan-sand" />
        </div>
        <div>
          <p className="font-semibold text-kokan-earth mb-1">No past orders</p>
          <p className="text-sm text-kokan-earth/50">
            Order authentic Kokan products — mangoes, cashews, kokum and more
          </p>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-2 px-4 py-2 bg-kokan-green text-white rounded-xl text-sm font-medium hover:bg-kokan-green/90 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" /> Shop Products
        </Link>
      </div>

      {/* Delivery info */}
      <div className="bg-kokan-sand/10 border border-kokan-sand/30 rounded-2xl p-5 flex items-start gap-3">
        <Truck className="w-5 h-5 text-kokan-earth/40 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-kokan-earth">Delivery tracking coming soon</p>
          <p className="text-xs text-kokan-earth/50 mt-1">
            Once checkout with Razorpay is live, your order history and delivery tracking will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
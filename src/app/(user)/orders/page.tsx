"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Order } from "@/types/order";
import { Package, ShoppingCart, ArrowRight, Truck, CheckCircle, Clock, X } from "lucide-react";
import Link from "next/link";

const statusConfig = {
  pending: { icon: <Clock className="w-3.5 h-3.5" />, color: "text-yellow-600 bg-yellow-50", label: "Pending" },
  confirmed: { icon: <CheckCircle className="w-3.5 h-3.5" />, color: "text-blue-600 bg-blue-50", label: "Confirmed" },
  out_for_delivery: { icon: <Truck className="w-3.5 h-3.5" />, color: "text-orange-600 bg-orange-50", label: "Out for Delivery" },
  delivered: { icon: <CheckCircle className="w-3.5 h-3.5" />, color: "text-green-600 bg-green-50", label: "Delivered" },
  cancelled: { icon: <X className="w-3.5 h-3.5" />, color: "text-red-500 bg-red-50", label: "Cancelled" },
};

export default function OrdersPage() {
  const { profile } = useAuth();
  const { items, totalPrice } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.uid) return;
    fetch(`/api/orders?userId=${profile.uid}`)
      .then((r) => r.json())
      .then((data) => { setOrders(Array.isArray(data) ? data : []); setLoading(false); });
  }, [profile]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-kokan-earth">My Orders</h1>
        <p className="text-kokan-earth/50 text-sm mt-1">{orders.length} orders placed</p>
      </div>

      {/* Cart summary */}
      {items.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-kokan-green/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-kokan-earth flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-kokan-green" />
              Cart ({items.length} items)
            </h2>
            <span className="font-bold text-kokan-green">₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 w-full py-3 bg-kokan-green text-white rounded-xl text-sm font-semibold hover:bg-kokan-green/90 transition-colors"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Orders list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-kokan-sand/30" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-kokan-sand/30 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-kokan-sand/20 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-kokan-sand" />
          </div>
          <div>
            <p className="font-semibold text-kokan-earth mb-1">No orders yet</p>
            <p className="text-sm text-kokan-earth/50">Order authentic Kokan products or book a trek</p>
          </div>
          <div className="flex gap-3">
            <Link href="/products" className="px-4 py-2 bg-kokan-green text-white rounded-xl text-sm font-medium">
              Shop Products
            </Link>
            <Link href="/treks" className="px-4 py-2 border border-kokan-sand rounded-xl text-sm text-kokan-earth/60">
              Browse Treks
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = statusConfig[order.status] ?? statusConfig.pending;
            return (
              <div key={order.id} className="bg-white rounded-2xl p-5 border border-kokan-sand/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-kokan-earth text-sm">
                        {order.orderType === "trek" ? `🧗 ${order.trekName}` : `📦 ${order.items?.length} product(s)`}
                      </p>
                      <span className={`flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-kokan-earth/40">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    {order.orderType === "product" && order.items && (
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {order.items.map((item, i) => (
                          <span key={i} className="text-xs bg-kokan-sand/20 text-kokan-earth/60 px-2 py-0.5 rounded-lg">
                            {item.name} × {item.quantity}
                          </span>
                        ))}
                      </div>
                    )}
                    {order.orderType === "trek" && (
                      <p className="text-xs text-kokan-earth/50 mt-1">
                        📅 {order.trekDate} · {order.persons?.length} person(s)
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-kokan-green">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </p>
                    <Link
                      href={`/order-confirmation/${order.id}`}
                      className="text-xs text-kokan-earth/40 hover:text-kokan-green transition-colors mt-1 block"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
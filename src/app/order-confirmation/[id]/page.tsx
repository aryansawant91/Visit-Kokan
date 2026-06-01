"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Order } from "@/types/order";
import { CheckCircle, Package, MapPin, Calendar, Users, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders?id=${id}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (!loading && order) {
      const timer = setTimeout(() => router.push("/"), 10000);
      return () => clearTimeout(timer);
    }
  }, [loading, order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-kokan-cream/20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-kokan-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-kokan-cream/20 flex flex-col items-center justify-center gap-4">
        <p className="text-kokan-earth/60">Order not found</p>
        <Link href="/" className="text-kokan-green underline text-sm">Go home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kokan-cream/20 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Success header */}
        <div className="bg-white rounded-2xl p-8 border border-kokan-sand/30 text-center">
          <div className="w-20 h-20 bg-kokan-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-kokan-green" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-kokan-earth mb-2">
            {order.orderType === "trek" ? "Trek Booked!" : "Order Confirmed!"}
          </h1>
          <p className="text-kokan-earth/50 text-sm mb-2">
            A confirmation email has been sent to {order.userEmail}
          </p>
          <p className="text-xs text-kokan-earth/30">
            You'll be redirected to homepage in 10 seconds
          </p>
        </div>

        {/* Order details */}
        <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-kokan-earth">Order Details</h2>
            <span className="text-xs bg-kokan-green/10 text-kokan-green px-2.5 py-1 rounded-full font-medium capitalize">
              {order.status}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-kokan-earth/60">
              <span>Order ID</span>
              <span className="font-medium text-kokan-earth text-xs">{order.id}</span>
            </div>
            <div className="flex justify-between text-kokan-earth/60">
              <span>Payment ID</span>
              <span className="font-medium text-kokan-earth text-xs">{order.razorpayPaymentId}</span>
            </div>
            <div className="flex justify-between text-kokan-earth/60">
              <span>Amount Paid</span>
              <span className="font-bold text-kokan-green text-base">₹{order.totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Product order details */}
          {order.orderType === "product" && order.items && (
            <div className="border-t border-kokan-sand/30 pt-4">
              <p className="text-xs font-medium text-kokan-earth/50 mb-3 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Items Ordered
              </p>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1.5">
                  <span className="text-kokan-earth">{item.name} × {item.quantity}</span>
                  <span className="text-kokan-earth font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
              {order.deliveryAddress && (
                <div className="mt-3 pt-3 border-t border-kokan-sand/20">
                  <p className="text-xs font-medium text-kokan-earth/50 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Delivering to
                  </p>
                  <p className="text-sm text-kokan-earth">{order.deliveryAddress.fullName}</p>
                  <p className="text-xs text-kokan-earth/50">{order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
                </div>
              )}
            </div>
          )}

          {/* Trek order details */}
          {order.orderType === "trek" && (
            <div className="border-t border-kokan-sand/30 pt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-kokan-earth">
                <Calendar className="w-4 h-4 text-kokan-green" />
                <span className="font-medium">{order.trekName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-kokan-earth/60">
                <Calendar className="w-4 h-4" />
                <span>{order.trekDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-kokan-earth/60">
                <Users className="w-4 h-4" />
                <span>{order.persons?.length} person(s)</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-kokan-green text-white rounded-2xl font-semibold text-sm hover:bg-kokan-green/90 transition-colors"
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
          <Link
            href="/orders"
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-kokan-sand rounded-2xl text-sm text-kokan-earth/60 hover:bg-kokan-sand/10 transition-colors"
          >
            <Package className="w-4 h-4" /> View Orders <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
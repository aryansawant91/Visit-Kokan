"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ShoppingBag, MapPin, CreditCard, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"address" | "payment">("address");

  const [address, setAddress] = useState<Address>({
    fullName: profile?.displayName ?? "",
    phone: profile?.phone ?? "",
    street: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
  });

  useEffect(() => {
    if (!user) router.replace("/login?redirect=/checkout");
    if (items.length === 0) router.replace("/products");
  }, [user, items]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const setAddr = (key: keyof Address, value: string) =>
    setAddress((prev) => ({ ...prev, [key]: value }));

  const validateAddress = () => {
    return (
      address.fullName.trim() &&
      address.phone.trim() &&
      address.street.trim() &&
      address.city.trim() &&
      address.pincode.trim()
    );
  };

  const handlePayment = async () => {
    if (!validateAddress()) {
      alert("Please fill all address fields.");
      return;
    }

    setLoading(true);
    try {
      // Create order
      const orderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          orderType: "product",
          userId: user!.uid,
          userEmail: user!.email,
          userName: profile?.displayName ?? user?.email ?? "Guest",
          items: items.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            unit: i.product.unit,
            image: i.product.images?.[0] ?? "",
          })),
          deliveryAddress: address,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.razorpayOrderId) throw new Error("Failed to create order");

      // Open Razorpay
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: "Visit Kokan",
        description: `${items.length} product(s)`,
        image: "/icons/icon-192.png",
        prefill: {
          name: profile?.displayName,
          email: user!.email,
          contact: address.phone,
        },
        theme: { color: "#2d7a4f" },
        handler: async (response: any) => {
          // Verify payment
          const verifyRes = await fetch("/api/checkout/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: orderData.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            router.replace(`/order-confirmation/${orderData.orderId}`);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-kokan-cream/20 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products" className="p-2 rounded-xl border border-kokan-sand hover:bg-kokan-sand/10 transition-colors">
            <ArrowLeft className="w-4 h-4 text-kokan-earth" />
          </Link>
          <h1 className="font-playfair text-2xl font-bold text-kokan-earth">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Address + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step indicator */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${step === "address" ? "bg-kokan-green text-white" : "bg-kokan-green/10 text-kokan-green"}`}>
                <MapPin className="w-4 h-4" /> Delivery Address
              </div>
              <div className="h-px flex-1 bg-kokan-sand/40" />
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${step === "payment" ? "bg-kokan-green text-white" : "bg-kokan-sand/20 text-kokan-earth/40"}`}>
                <CreditCard className="w-4 h-4" /> Payment
              </div>
            </div>

            {/* Address form */}
            <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30 space-y-4">
              <h2 className="font-semibold text-kokan-earth flex items-center gap-2">
                <MapPin className="w-4 h-4 text-kokan-green" /> Delivery Address
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Full Name</label>
                  <input
                    value={address.fullName}
                    onChange={(e) => setAddr("fullName", e.target.value)}
                    placeholder="Rohan Sawant"
                    className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddr("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Street Address</label>
                  <input
                    value={address.street}
                    onChange={(e) => setAddr("street", e.target.value)}
                    placeholder="House no., Street name, Area"
                    className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">City</label>
                  <input
                    value={address.city}
                    onChange={(e) => setAddr("city", e.target.value)}
                    placeholder="Mumbai"
                    className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Pincode</label>
                  <input
                    value={address.pincode}
                    onChange={(e) => setAddr("pincode", e.target.value)}
                    placeholder="400001"
                    className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">State</label>
                  <select
                    value={address.state}
                    onChange={(e) => setAddr("state", e.target.value)}
                    className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  >
                    {["Maharashtra", "Goa", "Karnataka", "Gujarat", "Delhi", "Other"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-kokan-green text-white rounded-2xl font-bold text-base hover:bg-kokan-green/90 transition-colors disabled:opacity-60 shadow-lg shadow-kokan-green/20"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <><CreditCard className="w-5 h-5" /> Pay ₹{totalPrice.toLocaleString("en-IN")}</>
              )}
            </button>

            <p className="text-center text-xs text-kokan-earth/40">
              🔒 Secured by Razorpay · UPI, Cards, Net Banking accepted
            </p>
          </div>

          {/* Right — Order summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-kokan-sand/30">
              <h2 className="font-semibold text-kokan-earth mb-4 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-kokan-green" /> Order Summary
              </h2>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-kokan-sand/20 flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🥭</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-kokan-earth truncate">{item.product.name}</p>
                      <p className="text-xs text-kokan-earth/50">× {item.quantity} {item.product.unit}</p>
                    </div>
                    <p className="text-sm font-semibold text-kokan-earth flex-shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-kokan-sand/40 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-kokan-earth/60">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm text-kokan-earth/60">
                  <span>Delivery</span>
                  <span className="text-kokan-green font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-kokan-earth text-base pt-2 border-t border-kokan-sand/40">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
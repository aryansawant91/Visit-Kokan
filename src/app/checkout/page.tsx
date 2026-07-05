"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, MapPin, CreditCard,
  Loader2, ArrowLeft, Gift, Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AddressPicker from "@/components/checkout/AddressPicker";
import PaymentMethodPicker from "@/components/checkout/PaymentMethodPicker";

declare global { interface Window { Razorpay: any } }

interface Address {
  id?: string;
  fullName: string; phone: string;
  street: string; city: string;
  state: string; pincode: string;
  isDefault?: boolean;
}

interface GiftSummary {
  isGift: boolean;
  recipientName: string;
  message: string;
  boxType: string;
  giftBoxPrice: number;
}

const blank = (): Address => ({
  fullName: "", phone: "", street: "",
  city: "", state: "Maharashtra", pincode: "",
});

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, hydrated } = useCart();
  const { user, profile, loading: authLoading }    = useAuth();
  const router = useRouter();

  const [loading, setLoading]   = useState(false);
  const [address, setAddress]   = useState<Address>(blank());
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [giftSummaries, setGiftSummaries] = useState<Record<string, GiftSummary>>({});

  // ── All cart items must have COD available for COD option to show ─────────
  const codAvailable = items.length > 0 && items.every(
    i => i.product.codAvailable !== false
  );

  // ── Guard ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (authLoading || !hydrated) return;
    if (!user) { router.replace("/login?redirect=/checkout"); return; }
    if (items.length === 0) router.replace("/products");
  }, [authLoading, hydrated, user, items.length]); // eslint-disable-line

  // ── Gift options ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    const summaries: Record<string, GiftSummary> = {};
    items.forEach(item => {
      try {
        const raw = sessionStorage.getItem(`gift_${item.product.id}`);
        if (raw) summaries[item.product.id] = JSON.parse(raw);
      } catch {}
    });
    setGiftSummaries(summaries);
  }, [hydrated, items]);

  // ── Razorpay script ────────────────────────────────────────────────────────
  useEffect(() => {
    const s = document.createElement("script");
    s.src   = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { try { document.body.removeChild(s); } catch {} };
  }, []);

  // ── Reset to online if COD becomes unavailable ─────────────────────────────
  useEffect(() => {
    if (!codAvailable && paymentMethod === "cod") setPaymentMethod("online");
  }, [codAvailable]); // eslint-disable-line

  const giftTotal  = Object.values(giftSummaries).reduce(
    (sum, g) => sum + (g.isGift ? g.giftBoxPrice : 0), 0
  );
  const grandTotal = totalPrice + giftTotal;

  // ── Online payment ─────────────────────────────────────────────────────────
  const handleOnlinePayment = async () => {
    setLoading(true);
    try {
      const orderRes = await fetch("/api/checkout/create-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount:    grandTotal,
          orderType: "product",
          userId:    user!.uid,
          userEmail: user!.email,
          userName:  profile?.displayName ?? user?.email ?? "Guest",
          items: items.map(i => ({
            productId:   i.product.id,
            name:        i.product.name,
            price:       i.product.price,
            quantity:    i.quantity,
            unit:        i.product.unit,
            image:       i.product.images?.[0] ?? "",
            giftOptions: giftSummaries[i.product.id] ?? null,
          })),
          deliveryAddress: address,
          giftTotal,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.razorpayOrderId) throw new Error("Failed to create order");

      const rzp = new window.Razorpay({
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      orderData.amount,
        currency:    orderData.currency,
        order_id:    orderData.razorpayOrderId,
        name:        "Visit Kokan",
        description: `${items.length} product(s)`,
        image:       "/icons/icon-192.png",
        prefill: {
          name:    profile?.displayName,
          email:   user!.email,
          contact: address.phone,
        },
        theme: { color: "#2d7a4f" },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/checkout/verify-payment", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId:           orderData.orderId,
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            items.forEach(i => sessionStorage.removeItem(`gift_${i.product.id}`));
            clearCart();
            router.replace(`/order-confirmation/${orderData.orderId}`);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ── COD order ──────────────────────────────────────────────────────────────
  const handleCODOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/create-cod-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId:    user!.uid,
          userEmail: user!.email,
          userName:  profile?.displayName ?? user?.email ?? "Guest",
          items: items.map(i => ({
            productId:   i.product.id,
            name:        i.product.name,
            price:       i.product.price,
            quantity:    i.quantity,
            unit:        i.product.unit,
            image:       i.product.images?.[0] ?? "",
            giftOptions: giftSummaries[i.product.id] ?? null,
          })),
          deliveryAddress: address,
          amount: grandTotal,
          giftTotal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        items.forEach(i => sessionStorage.removeItem(`gift_${i.product.id}`));
        clearCart();
        router.replace(`/order-confirmation/${data.orderId}`);
      } else {
        alert("Failed to place order. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.pincode) {
      alert("Please select or fill a delivery address.");
      return;
    }
    if (paymentMethod === "cod") {
      handleCODOrder();
    } else {
      handleOnlinePayment();
    }
  };

  if (authLoading || !hydrated) {
    return (
      <div className="min-h-screen bg-kokan-cream/20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-kokan-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || items.length === 0) return null;

  const hasGifts = Object.values(giftSummaries).some(g => g.isGift);

  return (
    <div className="min-h-screen bg-kokan-cream/20 py-6 pb-28 lg:pb-8">
      <div className="max-w-5xl mx-auto px-4">

        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/products"
            className="p-2 rounded-xl border border-kokan-sand hover:bg-kokan-sand/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-kokan-earth" />
          </Link>
          <h1 className="font-playfair text-2xl font-bold text-kokan-earth">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-5">

            {/* Address */}
            <div className="bg-white rounded-2xl p-5 border border-kokan-sand/30 shadow-sm">
              <h2 className="font-bold text-kokan-earth flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-kokan-green" /> Delivery Address
              </h2>
              <AddressPicker uid={user.uid} selected={address} onSelect={setAddress} />
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl p-5 border border-kokan-sand/30 shadow-sm">
              <h2 className="font-bold text-kokan-earth flex items-center gap-2 mb-4">
                <Wallet className="w-4 h-4 text-kokan-green" /> Payment Method
              </h2>
              <PaymentMethodPicker
                selected={paymentMethod}
                onSelect={setPaymentMethod}
                codAvailable={codAvailable}
              />
              {!codAvailable && (
                <p className="text-xs text-amber-600 mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  ⚠ One or more items in your cart don&apos;t support Cash on Delivery
                </p>
              )}
            </div>

            {/* Gift summaries */}
            {hasGifts && (
              <div className="bg-pink-50 border border-pink-100 rounded-2xl p-5 space-y-3">
                <h2 className="font-bold text-kokan-earth flex items-center gap-2">
                  <Gift className="w-4 h-4 text-pink-500" /> Gift Details
                </h2>
                {items.map(item => {
                  const g = giftSummaries[item.product.id];
                  if (!g?.isGift) return null;
                  return (
                    <div key={item.product.id} className="bg-white rounded-xl p-3.5 border border-pink-100">
                      <p className="text-xs font-bold text-kokan-earth/50 uppercase tracking-wider mb-1.5">
                        {item.product.name}
                      </p>
                      {g.recipientName && (
                        <p className="text-sm text-kokan-earth">
                          <span className="font-semibold">To:</span> {g.recipientName}
                        </p>
                      )}
                      {g.message && (
                        <p className="text-sm text-kokan-earth/70 italic mt-0.5">&quot;{g.message}&quot;</p>
                      )}
                      <p className="text-xs text-kokan-earth/50 mt-1.5 capitalize">
                        📦 {g.boxType === "none" ? "Standard packaging" : `${g.boxType} gift box`}
                        {g.giftBoxPrice > 0 && ` · +₹${g.giftBoxPrice}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Place order */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !address.street}
              className="w-full flex items-center justify-center gap-3 py-4 bg-kokan-green
                text-white rounded-2xl font-bold text-base hover:bg-kokan-green/90
                transition-colors disabled:opacity-60 shadow-lg shadow-kokan-green/20"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
              ) : paymentMethod === "cod" ? (
                <><Wallet className="w-5 h-5" /> Place Order · Pay ₹{grandTotal.toLocaleString("en-IN")} on Delivery</>
              ) : (
                <><CreditCard className="w-5 h-5" /> Pay ₹{grandTotal.toLocaleString("en-IN")}</>
              )}
            </button>

            <p className="text-center text-xs text-kokan-earth/40">
              {paymentMethod === "cod"
                ? "💵 Keep exact change ready for the delivery agent"
                : "🔒 Secured by Razorpay · UPI, Cards, Net Banking accepted"}
            </p>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-2xl p-5 border border-kokan-sand/30 shadow-sm">
              <h2 className="font-bold text-kokan-earth mb-4 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-kokan-green" /> Order Summary
              </h2>

              <div className="space-y-3">
                {items.map(item => {
                  const g = giftSummaries[item.product.id];
                  return (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-kokan-sand/20 flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🥭</div>
                        )}
                        {g?.isGift && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-[8px]">🎁</span>
                          </div>
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
                  );
                })}
              </div>

              <div className="border-t border-kokan-sand/40 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-kokan-earth/60">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                {giftTotal > 0 && (
                  <div className="flex justify-between text-sm text-pink-600">
                    <span>🎁 Gift packaging</span>
                    <span>+₹{giftTotal}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-kokan-earth/60">
                  <span>Delivery</span>
                  <span className="text-kokan-green font-medium">Free</span>
                </div>
                {paymentMethod === "cod" && (
                  <div className="flex justify-between text-sm text-amber-600 font-medium">
                    <span>Payment</span>
                    <span>Cash on Delivery</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-kokan-earth text-base pt-2 border-t border-kokan-sand/40">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
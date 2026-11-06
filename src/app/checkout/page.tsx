"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, MapPin, CreditCard,
  Loader2, ArrowLeft, Gift, Wallet,
  Tag, Check, X,
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

  // ── Coupons ───────────────────────────────────────────────────────────────
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    discountType: "flat" | "percent";
    description?: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/coupons/product")
      .then((r) => r.json())
      .then((d) => setAvailableCoupons(d?.visible ?? []))
      .catch(() => {});
  }, []);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply ?? couponCode).trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/product/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, amount: totalPrice }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({
          code: data.code,
          discount: data.discount,
          discountType: data.discountType,
          description: data.description,
        });
        setCouponCode(data.code);
      } else {
        setCouponError(data.error || "Invalid coupon code");
      }
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const couponDiscount = appliedCoupon
    ? appliedCoupon.discountType === "percent"
      ? Math.round((totalPrice * appliedCoupon.discount) / 100)
      : Math.min(appliedCoupon.discount, totalPrice)
    : 0;

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
  const grandTotal = Math.max(0, totalPrice - couponDiscount) + giftTotal;

  // ── Online payment ─────────────────────────────────────────────────────────
  const handleOnlinePayment = async () => {
    setLoading(true);
    try {
      const orderRes = await fetch("/api/checkout/create-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount:    grandTotal,
          couponCode: appliedCoupon?.code ?? null,
          couponDiscount: couponDiscount,
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
          couponCode: appliedCoupon?.code ?? null,
          couponDiscount: couponDiscount,
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

              {/* Coupon Code Section */}
              <div className="mt-4 pt-4 border-t border-kokan-sand/40">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold tracking-wide">{appliedCoupon.code}</span> applied:
                        <span className="font-semibold text-emerald-700 ml-1">
                          {appliedCoupon.discountType === "percent"
                            ? `${appliedCoupon.discount}% OFF`
                            : `₹${appliedCoupon.discount} OFF`}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-700 font-semibold text-xs ml-2 cursor-pointer flex items-center gap-0.5"
                    >
                      <X className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError("");
                        }}
                        placeholder="Coupon code (e.g. KOKAN10)"
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-kokan-sand/50 bg-kokan-sand/10 focus:outline-none focus:border-kokan-green uppercase font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-3 py-1.5 bg-kokan-green text-white text-xs font-semibold rounded-xl hover:bg-kokan-green/90 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {couponLoading ? "Applying…" : "Apply"}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                    )}

                    {availableCoupons.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[11px] text-kokan-earth/50 self-center">Available:</span>
                        {availableCoupons.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => handleApplyCoupon(c.code)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono hover:bg-emerald-100 transition-colors cursor-pointer"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {c.code}
                            <span className="text-[10px] text-emerald-600">
                              ({c.discountType === "percent" ? `${c.discount}%` : `₹${c.discount}`})
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-kokan-sand/40 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-kokan-earth/60">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-700 font-medium">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
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
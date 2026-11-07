"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Order } from "@/types/order";
import {
  CheckCircle,
  Package,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Home,
  MessageCircle,
  Phone,
  Copy,
  Check,
  Pause,
  Play,
  Share2,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const CONCIERGE_PHONE = "+918432587706";
const CONCIERGE_PHONE_DISPLAY = "+91 84325 87706";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [autoRedirectPaused, setAutoRedirectPaused] = useState(false);

  useEffect(() => {
    fetch(`/api/orders?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (loading || !order || autoRedirectPaused) return;

    if (secondsLeft <= 0) {
      router.push("/");
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, order, secondsLeft, autoRedirectPaused, router]);

  const copyOrderId = () => {
    if (!order?.id) return;
    navigator.clipboard.writeText(order.id);
    setCopiedId(true);
    toast.success("Order ID copied to clipboard!");
    setTimeout(() => setCopiedId(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-kokan-cream/20 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-kokan-green border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-kokan-earth/60">Fetching confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-kokan-cream/20 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xl">
          ✕
        </div>
        <h2 className="text-xl font-bold text-kokan-earth">Order Not Found</h2>
        <p className="text-xs text-kokan-earth/60 max-w-sm">
          We couldn&apos;t retrieve this booking. If you completed payment, please check your email or contact our support team.
        </p>
        <div className="flex gap-3">
          <Link href="/" className="px-5 py-2.5 bg-kokan-green text-white text-xs font-bold rounded-xl">
            Go Home
          </Link>
          <a
            href={`https://wa.me/918432587706?text=${encodeURIComponent("Hi Support, I need help finding my booking confirmation.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl bg-white"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    );
  }

  const conciergeWaMessage = encodeURIComponent(
    `Hi Visit Kokan Concierge! 🌊\n\nI just confirmed my booking on visitkokan.in:\n• Order ID: ${order.id}\n• Type: ${order.orderType === "trek" ? `Trek (${order.trekName || "Expedition"})` : "Kokan Products"}\n• Amount Paid: ₹${order.totalAmount.toLocaleString("en-IN")}\n• Email: ${order.userEmail || "Traveler"}\n\nPlease share batch departure details & WhatsApp updates.`
  );

  return (
    <div className="min-h-screen bg-kokan-cream/20 flex items-center justify-center py-10 px-4">
      <div className="max-w-lg w-full space-y-5">
        {/* ── Success Header ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-kokan-sand/40 text-center shadow-xs">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
            <CheckCircle className="w-9 h-9 text-emerald-600" />
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-black text-kokan-earth mb-1.5">
            {order.orderType === "trek" ? "Trek Booking Confirmed! 🥾" : "Order Confirmed! 📦"}
          </h1>
          <p className="text-kokan-earth/65 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            Your booking details have been verified and emailed to{" "}
            <span className="font-semibold text-kokan-earth">{order.userEmail}</span>
          </p>

          {/* Auto Redirect Banner */}
          <div className="mt-4 pt-4 border-t border-kokan-sand/30 flex items-center justify-between text-xs text-kokan-earth/60">
            <div className="flex items-center gap-1.5">
              <span>
                {autoRedirectPaused
                  ? "Auto-redirect paused"
                  : `Redirecting to homepage in ${secondsLeft}s`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAutoRedirectPaused((p) => !p)}
              className="text-kokan-green hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              {autoRedirectPaused ? (
                <>
                  <Play size={12} /> Resume
                </>
              ) : (
                <>
                  <Pause size={12} /> Stay on page
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── WhatsApp Concierge & Instant Notification Card ── */}
        <div className="bg-gradient-to-br from-emerald-50 via-[#f0f8f2] to-teal-50 rounded-3xl p-5 border border-emerald-200/80 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-xs shrink-0">
                <MessageCircle className="w-5 h-5 fill-white text-transparent" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0f2d19]">
                  Instant WhatsApp Concierge
                </h3>
                <p className="text-[11px] text-[#2d583b]">
                  Live booking desk &amp; travel coordinator
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-950 border border-emerald-300 shrink-0">
              Active Support
            </span>
          </div>

          <p className="text-xs text-[#2c4e36] leading-relaxed">
            Have questions regarding pickup spots, luggage packing, custom homestay requests, or GST receipts? Connect directly with our team on WhatsApp.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <a
              href={`https://wa.me/918432587706?text=${conciergeWaMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white rounded-2xl font-bold text-xs shadow-md shadow-[#25D366]/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-transparent shrink-0" />
              <span>Chat Concierge</span>
            </a>

            <a
              href={`tel:${CONCIERGE_PHONE}`}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-emerald-50 active:scale-[0.98] text-[#1a4427] rounded-2xl font-bold text-xs border border-emerald-200 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Call {CONCIERGE_PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>

        {/* ── Order Details Card ── */}
        <div className="bg-white rounded-3xl p-6 border border-kokan-sand/30 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm sm:text-base text-kokan-earth">Booking Receipt</h2>
            <span
              className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                order.status === "confirmed"
                  ? "bg-emerald-100 text-emerald-800"
                  : order.status === "pending_verification"
                  ? "bg-amber-100 text-amber-900 border border-amber-200"
                  : "bg-kokan-green/10 text-kokan-green"
              }`}
            >
              {order.status === "pending_verification"
                ? "Pending Verification"
                : order.status || "Confirmed"}
            </span>
          </div>

          {order.status === "pending_verification" && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 leading-relaxed space-y-1">
              <p className="font-bold">⏳ Cash on Meetup Verification Required</p>
              <p className="text-amber-800/90 text-[11px]">
                Please keep ₹{order.totalAmount.toLocaleString("en-IN")} ready before vehicle boarding. Our team will verify and seal your slot at pickup.
              </p>
            </div>
          )}

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-kokan-earth/70">
              <span>Order Reference ID</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-kokan-earth text-xs">
                  {order.id}
                </span>
                <button
                  type="button"
                  onClick={copyOrderId}
                  title="Copy Order ID"
                  className="p-1 rounded-md hover:bg-gray-100 text-kokan-earth/60 hover:text-kokan-earth cursor-pointer"
                >
                  {copiedId ? (
                    <Check size={13} className="text-emerald-600" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>
            </div>

            {order.razorpayPaymentId && (
              <div className="flex items-center justify-between text-kokan-earth/70">
                <span>Razorpay Payment ID</span>
                <span className="font-mono text-kokan-earth text-xs">
                  {order.razorpayPaymentId}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-kokan-earth/70 pt-1 border-t border-kokan-sand/20">
              <span className="font-semibold text-kokan-earth">Total Amount Paid</span>
              <span className="font-black text-kokan-green text-base">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Product order details */}
          {order.orderType === "product" && order.items && (
            <div className="border-t border-kokan-sand/30 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-kokan-earth/50 mb-3 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Items Ordered ({order.items.length})
              </p>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-xs py-1.5 px-2.5 bg-gray-50 rounded-xl"
                  >
                    <span className="text-kokan-earth font-medium">
                      {item.name} <span className="text-kokan-earth/50">× {item.quantity}</span>
                    </span>
                    <span className="text-kokan-earth font-bold">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {order.deliveryAddress && (
                <div className="mt-3.5 pt-3 border-t border-kokan-sand/20">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-kokan-earth/50 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Delivery Address
                  </p>
                  <p className="text-xs text-kokan-earth font-semibold">
                    {order.deliveryAddress.fullName}
                  </p>
                  <p className="text-xs text-kokan-earth/60">
                    {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                    {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Trek order details */}
          {order.orderType === "trek" && (
            <div className="border-t border-kokan-sand/30 pt-4 space-y-3">
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-kokan-earth">
                  <Calendar className="w-4 h-4 text-kokan-green shrink-0" />
                  <span className="font-bold text-[#112d1b]">{order.trekName || "Sahyadri Fort Expedition"}</span>
                </div>
                {order.trekDate && (
                  <div className="flex items-center gap-2 text-xs text-kokan-earth/75">
                    <span className="font-medium text-[11px] text-[#2c5237]">Batch Date:</span>
                    <span className="font-bold">{order.trekDate}</span>
                  </div>
                )}
                {order.persons && (
                  <div className="flex items-center gap-2 text-xs text-kokan-earth/75">
                    <Users className="w-3.5 h-3.5 text-kokan-green shrink-0" />
                    <span>{order.persons.length} Trekker slot(s) reserved</span>
                  </div>
                )}
              </div>

              {order.whatsappGroupLink && (
                <a
                  href={order.whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-bold text-xs shadow-md shadow-[#25D366]/20 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                  <span>Join Trek WhatsApp Batch Group</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* ── Action Navigation ── */}
        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-kokan-green hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-kokan-green/20 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
          <Link
            href="/orders"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-[#cadbc7] bg-white hover:bg-gray-50 rounded-2xl text-xs sm:text-sm font-bold text-kokan-earth transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4" /> View All Orders <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

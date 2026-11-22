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
  Printer,
  Download,
  Lock,
  Sparkles,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

import { SUPPORT_PHONE } from "@/constants/contact";

const BookingPassModal = dynamic(
  () => import("@/components/booking/BookingPassModal"),
  { ssr: false }
);

const CONCIERGE_PHONE = SUPPORT_PHONE;
const CONCIERGE_PHONE_DISPLAY = SUPPORT_PHONE.startsWith("+91") && SUPPORT_PHONE.length === 13
  ? `+91 ${SUPPORT_PHONE.slice(3, 8)} ${SUPPORT_PHONE.slice(8)}`
  : SUPPORT_PHONE;

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);

  // Progressive Step Flow States
  const [hasJoinedWhatsapp, setHasJoinedWhatsapp] = useState(false);
  const [hasDownloadedTicket, setHasDownloadedTicket] = useState(false);
  const [passOpen, setPassOpen] = useState(false);

  // Redirect countdown: ONLY runs after the ticket has been viewed/downloaded
  const [redirectSeconds, setRedirectSeconds] = useState(15);
  const [autoRedirectPaused, setAutoRedirectPaused] = useState(false);

  useEffect(() => {
    fetch(`/api/orders?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);

        // Restore persisted flow state if previously completed
        if (typeof window !== "undefined" && data?.id) {
          const waKey = `vk_wa_joined_${data.id}`;
          const ticketKey = `vk_ticket_done_${data.id}`;
          if (sessionStorage.getItem(waKey) === "true" || data.orderType === "product") {
            setHasJoinedWhatsapp(true);
          }
          if (sessionStorage.getItem(ticketKey) === "true") {
            setHasDownloadedTicket(true);
          }
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Clean, non-rushed countdown redirect: starts ONLY when ticket step is completed
  useEffect(() => {
    if (!hasDownloadedTicket || autoRedirectPaused) return;

    if (redirectSeconds <= 0) {
      router.push("/");
      return;
    }

    const interval = setInterval(() => {
      setRedirectSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [hasDownloadedTicket, autoRedirectPaused, redirectSeconds, router]);

  const copyOrderId = () => {
    if (!order?.id) return;
    navigator.clipboard.writeText(order.id);
    setCopiedId(true);
    toast.success("Booking Reference ID copied!");
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleJoinWhatsapp = () => {
    setHasJoinedWhatsapp(true);
    if (typeof window !== "undefined" && order?.id) {
      sessionStorage.setItem(`vk_wa_joined_${order.id}`, "true");
    }
  };

  const handleTicketDownloaded = () => {
    setHasDownloadedTicket(true);
    if (typeof window !== "undefined" && order?.id) {
      sessionStorage.setItem(`vk_ticket_done_${order.id}`, "true");
    }
    toast.success("Boarding pass ready! Keep it saved on your phone.", { icon: "🎟️" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-kokan-cream/20 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-kokan-green border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-kokan-earth/60">Fetching confirmation pass...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-kokan-cream/20 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xl">
          ✕
        </div>
        <h2 className="text-xl font-bold text-kokan-earth">Booking Not Found</h2>
        <p className="text-xs text-kokan-earth/60 max-w-sm">
          We couldn&apos;t retrieve this booking. If you completed payment, please check your email or contact our support team.
        </p>
        <div className="flex gap-3">
          <Link href="/" className="px-5 py-2.5 bg-kokan-green text-white text-xs font-bold rounded-xl">
            Go Home
          </Link>
          <a
            href={`https://wa.me/918432587706?text=${encodeURIComponent(
              "Hi Support, I need help finding my booking confirmation."
            )}`}
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

  const isTrek = order.orderType === "trek";
  const conciergeWaMessage = encodeURIComponent(
    `Hi Visit Kokan Concierge! 🌊\n\nI just confirmed my booking on visitkokan.in:\n• Order ID: ${order.id}\n• Type: ${isTrek ? `Trek (${order.trekName || "Expedition"})` : "Kokan Products"
    }\n• Amount Paid: ₹${order.totalAmount.toLocaleString("en-IN")}\n• Email: ${order.userEmail || "Traveler"
    }\n\nPlease share batch departure details & WhatsApp updates.`
  );

  const whatsappGroupUrl =
    order.whatsappGroupLink && order.whatsappGroupLink.startsWith("http")
      ? order.whatsappGroupLink
      : `https://wa.me/918432587706?text=${conciergeWaMessage}`;

  return (
    <div className="min-h-screen bg-kokan-cream/20 flex items-center justify-center py-8 sm:py-12 px-3 sm:px-4">
      <div className="max-w-xl w-full space-y-5">
        {/* ── Success Header ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-kokan-sand/40 text-center shadow-xs">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
            <CheckCircle className="w-9 h-9 text-emerald-600" />
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-black text-kokan-earth mb-1.5">
            {isTrek ? "Trek Booking Confirmed! 🥾" : "Order Confirmed! 📦"}
          </h1>
          <p className="text-kokan-earth/70 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Your booking has been registered &amp; confirmed. Confirmation receipt sent to{" "}
            <span className="font-semibold text-kokan-earth underline decoration-emerald-300">
              {order.userEmail}
            </span>
          </p>

          <div className="mt-4 pt-3 border-t border-kokan-sand/30 flex items-center justify-center gap-2">
            <span className="text-xs text-kokan-earth/60">Booking ID:</span>
            <span className="font-mono font-bold text-xs text-[#113822] bg-gray-100 px-2.5 py-1 rounded-lg">
              {order.id}
            </span>
            <button
              type="button"
              onClick={copyOrderId}
              title="Copy Booking ID"
              className="p-1 text-gray-500 hover:text-emerald-700 rounded-md cursor-pointer transition-colors"
            >
              {copiedId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            STEP-BY-STEP USER JOURNEY (PROFESSIONAL FLOW)
            Step 1: Join WhatsApp Batch Group
            Step 2: View & Download PDF Ticket with QR
            Step 3: Return to Homepage
           ══════════════════════════════════════════════════════════════ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-kokan-earth/60">
              Your Booking Next Steps
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {!hasJoinedWhatsapp
                ? "Step 1 of 2 Pending"
                : !hasDownloadedTicket
                  ? "Step 2 of 2 Pending"
                  : "All Steps Completed ✅"}
            </span>
          </div>

          {/* ── STEP 1: Join WhatsApp Batch Group ── */}
          <div
            className={`rounded-3xl p-5 border transition-all ${hasJoinedWhatsapp
              ? "bg-emerald-50/80 border-emerald-300/80 shadow-xs"
              : "bg-gradient-to-br from-[#f0faf2] to-white border-emerald-300 shadow-sm ring-2 ring-emerald-500/20"
              }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${hasJoinedWhatsapp ? "bg-emerald-600 text-white" : "bg-[#25D366] text-white shadow-xs"
                    }`}
                >
                  <MessageCircle className="w-5 h-5 fill-white text-transparent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-200/80 text-emerald-950 font-mono">
                      STEP 1
                    </span>
                    <h3 className="font-bold text-sm text-[#0f2d19]">
                      {isTrek ? "Join Trek WhatsApp Batch Group" : "Join WhatsApp Concierge Desk"}
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#2d583b] mt-0.5">
                    {isTrek
                      ? "Get live coach location, reporting time & coordinator contact"
                      : "Direct updates for delivery tracking & order support"}
                  </p>
                </div>
              </div>

              {hasJoinedWhatsapp && (
                <span className="text-[11px] font-black text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-300 shrink-0 flex items-center gap-1">
                  <Check size={12} className="stroke-[3]" /> Joined
                </span>
              )}
            </div>

            <p className="text-xs text-[#2c4e36] leading-relaxed mb-3">
              {isTrek
                ? "All registered trekkers, trek leaders, and bus coordinators communicate live inside this private batch group."
                : "Connect with our Konkan dispatch desk for fast delivery notifications and order assistance."}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <a
                href={whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleJoinWhatsapp}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white rounded-2xl font-bold text-xs shadow-md shadow-[#25D366]/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent shrink-0" />
                <span>
                  {hasJoinedWhatsapp
                    ? "Open WhatsApp Group Again"
                    : isTrek
                      ? "Join WhatsApp Batch Group Now"
                      : "Connect on WhatsApp"}
                </span>
                <ExternalLink size={12} />
              </a>

              {!hasJoinedWhatsapp && (
                <button
                  type="button"
                  onClick={handleJoinWhatsapp}
                  className="w-full sm:w-auto px-4 py-3 text-emerald-800 hover:text-emerald-950 text-xs font-semibold hover:bg-emerald-100/60 rounded-2xl transition-colors cursor-pointer text-center"
                >
                  I&apos;ve Already Joined →
                </button>
              )}
            </div>
          </div>

          {/* ── STEP 2: Official Boarding Pass & PDF Ticket (Unlocked after Step 1) ── */}
          <div
            className={`rounded-3xl p-5 border transition-all ${!hasJoinedWhatsapp
              ? "bg-gray-50/80 border-gray-200 opacity-75"
              : "bg-gradient-to-r from-emerald-900 via-[#1b4332] to-[#122e20] text-white shadow-lg border-emerald-500/40 ring-2 ring-emerald-400/25"
              }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${!hasJoinedWhatsapp
                    ? "bg-gray-200 text-gray-500"
                    : "bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 shadow-inner"
                    }`}
                >
                  {!hasJoinedWhatsapp ? <Lock className="w-5 h-5" /> : <Download className="w-6 h-6 text-emerald-300" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${!hasJoinedWhatsapp
                        ? "bg-gray-200 text-gray-600"
                        : "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                        }`}
                    >
                      STEP 2
                    </span>
                    <span
                      className={`text-xs font-bold ${!hasJoinedWhatsapp ? "text-gray-500" : "text-emerald-200"
                        }`}
                    >
                      {isTrek ? "Official Boarding Pass & QR Ticket" : "Official Invoice & QR Receipt"}
                    </span>
                  </div>

                  <p
                    className={`text-sm font-bold mt-0.5 ${!hasJoinedWhatsapp ? "text-gray-700" : "text-white"
                      }`}
                  >
                    {isTrek ? "Download Offline Boarding Ticket" : "Download Official Invoice"}
                  </p>
                  <p
                    className={`text-[11px] ${!hasJoinedWhatsapp ? "text-gray-500" : "text-emerald-100/75"
                      }`}
                  >
                    {!hasJoinedWhatsapp
                      ? "Complete Step 1 above to unlock your scannable boarding pass"
                      : "Includes offline QR code, Mumbai pickup schedule & passenger roster"}
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
                {!hasJoinedWhatsapp ? (
                  <button
                    type="button"
                    onClick={() => {
                      setHasJoinedWhatsapp(true);
                      setPassOpen(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Unlock &amp; View Pass →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPassOpen(true)}
                    className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-[#b8dc26] to-[#a3c61d] hover:brightness-105 active:scale-95 text-emerald-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <Printer size={15} />
                    <span>View &amp; Save PDF Pass</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── STEP 3: Auto-Redirect to Homepage (Active ONLY after Ticket Step) ── */}
          {hasDownloadedTicket && (
            <div className="bg-gradient-to-r from-emerald-500/15 via-emerald-100/50 to-teal-50 border-2 border-emerald-400 rounded-3xl p-5 shadow-sm space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  <div>
                    <h3 className="font-black text-sm text-[#0f2d19]">
                      You&apos;re All Set for Kokan!
                    </h3>
                    <p className="text-[11px] text-emerald-800">
                      Your ticket is saved and confirmed. Returning to homepage shortly.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAutoRedirectPaused((p) => !p)}
                  className="text-[11px] text-emerald-900 font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-300 hover:bg-emerald-50 cursor-pointer flex items-center gap-1"
                >
                  {autoRedirectPaused ? (
                    <>
                      <Play size={11} /> Resume Timer
                    </>
                  ) : (
                    <>
                      <Pause size={11} /> Stay on Page
                    </>
                  )}
                </button>
              </div>

              {/* Countdown bar */}
              {!autoRedirectPaused && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-emerald-800 font-bold">
                    <span>Redirecting to homepage...</span>
                    <span>{redirectSeconds}s</span>
                  </div>
                  <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-kokan-green transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${(redirectSeconds / 15) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-kokan-green hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
                >
                  <Home size={14} /> Return to Homepage Now
                </Link>
                <button
                  type="button"
                  onClick={() => setPassOpen(true)}
                  className="px-4 py-2.5 border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-900 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  View Ticket Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Order Summary Card ── */}
        <div className="bg-white rounded-3xl p-6 border border-kokan-sand/30 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm sm:text-base text-kokan-earth">Booking Details</h2>
            <span
              className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${order.status === "confirmed"
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

          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-kokan-earth/70">
              <span>Order Reference ID</span>
              <span className="font-mono font-bold text-kokan-earth text-xs">{order.id}</span>
            </div>

            {order.razorpayPaymentId && (
              <div className="flex items-center justify-between text-kokan-earth/70">
                <span>Payment Reference</span>
                <span className="font-mono text-kokan-earth text-xs">{order.razorpayPaymentId}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-kokan-earth/70 pt-2 border-t border-kokan-sand/20">
              <span className="font-semibold text-kokan-earth">Total Amount Paid</span>
              <span className="font-black text-kokan-green text-base">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Trek order highlights */}
          {isTrek && (
            <div className="border-t border-kokan-sand/30 pt-3.5 space-y-2">
              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#112d1b]">
                  <Calendar className="w-4 h-4 text-kokan-green shrink-0" />
                  <span>{order.trekName || "Sahyadri Fort Expedition"}</span>
                </div>
                {order.trekDate && (
                  <div className="flex items-center gap-2 text-kokan-earth/80">
                    <span className="text-[11px] text-[#2c5237]">Batch Date:</span>
                    <span className="font-bold">{order.trekDate}</span>
                  </div>
                )}
                {order.persons && (
                  <div className="flex items-center gap-2 text-kokan-earth/80">
                    <Users className="w-3.5 h-3.5 text-kokan-green shrink-0" />
                    <span>{order.persons.length} Reserved Trekker Slot(s)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Product order items */}
          {order.orderType === "product" && order.items && (
            <div className="border-t border-kokan-sand/30 pt-3.5 space-y-2 text-xs">
              <p className="font-bold text-kokan-earth/60 uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Package className="w-3.5 h-3.5" /> Items Ordered ({order.items.length})
              </p>
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-1.5 px-2.5 bg-gray-50 rounded-xl"
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
          )}
        </div>

        {/* ── Bottom Quick Links ── */}
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
            <Package className="w-4 h-4" /> View All Bookings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Official Boarding Pass Modal ── */}
        <BookingPassModal
          order={order}
          isOpen={passOpen}
          onClose={() => {
            setPassOpen(false);
            // Mark ticket as viewed/downloaded so user can cleanly finish & return
            handleTicketDownloaded();
          }}
          onDownloaded={handleTicketDownloaded}
        />
      </div>
    </div>
  );
}

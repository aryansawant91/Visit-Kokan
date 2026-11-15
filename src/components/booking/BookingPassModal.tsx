"use client";

import { useEffect, useRef, useState } from "react";
import { Order } from "@/types/order";
import QRCode from "qrcode";
import {
  Printer,
  Download,
  X,
  Share2,
  ShieldCheck,
  Clock,
  Users,
  Bus,
  AlertTriangle,
  Phone,
  Mail,
} from "lucide-react";

interface Props {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onDownloaded?: () => void;
}

export default function BookingPassModal({ order, isOpen, onClose, onDownloaded }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Generate high-resolution scannable QR code on mount
  useEffect(() => {
    if (!order?.id) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://visitkokan.in";
    const verificationUrl = `${origin}/order-confirmation/${order.id}`;

    QRCode.toDataURL(verificationUrl, {
      width: 260,
      margin: 1,
      color: {
        dark: "#0f2d19",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => {
        console.error("QR generation error:", err);
        setQrDataUrl(
          `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
            verificationUrl
          )}`
        );
      });
  }, [order.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isTrek = order.orderType === "trek";
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const originUrl = typeof window !== "undefined" ? window.location.origin : "https://visitkokan.in";
  const verificationLink = `${originUrl}/order-confirmation/${order.id}`;

  const whatsappShareText = encodeURIComponent(
    `🎟️ *My Visit Kokan Official Booking Pass*\n\n` +
      `• *Order ID:* ${order.id}\n` +
      `• *Trip:* ${order.trekName || "Kokan Expedition"}\n` +
      `• *Batch Date:* ${order.trekDate || formattedDate}\n` +
      `• *Status:* ${order.status === "confirmed" ? "Confirmed ✅" : "Verified"}\n` +
      `• *Amount Paid:* ₹${order.totalAmount.toLocaleString("en-IN")}\n\n` +
      `👉 View & Verify Official Pass:\n${verificationLink}`
  );

  /**
   * Ultra-reliable 1-Page Print/PDF function:
   * Uses an isolated hidden print iframe containing ONLY the ticket HTML.
   * This guarantees ZERO empty pages, starts directly on Page 1, and fits perfectly on 1 standard A4 sheet!
   */
  const handlePrint = () => {
    const ticketElem = document.getElementById("printable-ticket");
    if (!ticketElem) {
      window.print();
      return;
    }

    // Clean up any existing print iframe
    const oldIframe = document.getElementById("vk-print-iframe");
    if (oldIframe) oldIframe.remove();

    const iframe = document.createElement("iframe");
    iframe.id = "vk-print-iframe";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Visit Kokan - Ticket ${order.id}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 6mm 8mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              background: #ffffff !important;
              color: #12261a !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              font-size: 11px;
              line-height: 1.3;
              width: 100%;
              height: auto;
            }
            .ticket-wrap {
              width: 100%;
              max-width: 100%;
              margin: 0 auto;
              background: #ffffff;
              border: 1.5px solid #113822;
              border-radius: 12px;
              padding: 16px 20px;
              page-break-inside: avoid;
            }
            .brand-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-bottom: 10px;
              border-bottom: 1.5px solid #d1fae5;
              margin-bottom: 12px;
            }
            .logo-title {
              font-size: 22px;
              font-weight: 900;
              color: #113822;
              letter-spacing: -0.5px;
            }
            .logo-accent {
              color: #c18c47;
            }
            .tagline {
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #065f46;
              font-weight: 700;
              margin-top: 2px;
            }
            .ref-box {
              text-align: right;
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 8px;
              padding: 6px 10px;
            }
            .ref-id {
              font-family: monospace;
              font-weight: 800;
              font-size: 13px;
              color: #113822;
              display: block;
            }
            .hero-card {
              background: linear-gradient(135deg, #122c1b 0%, #1a442a 100%);
              color: #ffffff;
              border-radius: 10px;
              padding: 12px 14px;
              margin-bottom: 10px;
            }
            .hero-badge-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 6px;
            }
            .badge-cat {
              font-size: 9px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #6ee7b7;
            }
            .badge-status {
              background: #34d399;
              color: #064e3b;
              font-size: 9px;
              font-weight: 900;
              padding: 2px 8px;
              border-radius: 20px;
            }
            .trip-name {
              font-size: 17px;
              font-weight: 800;
              color: #ffffff;
              line-height: 1.2;
              margin-bottom: 4px;
            }
            .batch-date {
              font-size: 11px;
              color: #d1fae5;
              margin-bottom: 8px;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 8px;
              padding-top: 8px;
              border-top: 1px solid rgba(255, 255, 255, 0.2);
              font-size: 10px;
            }
            .summary-label {
              font-size: 8px;
              text-transform: uppercase;
              color: rgba(255, 255, 255, 0.65);
              display: block;
            }
            .summary-val {
              font-weight: 700;
              color: #ffffff;
              display: block;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .section-box {
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 8px 12px;
              margin-bottom: 8px;
            }
            .section-title {
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #113822;
              margin-bottom: 6px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .pickup-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 6px;
            }
            .pickup-item {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 5px 7px;
              font-size: 9.5px;
            }
            .pickup-time {
              font-weight: 800;
              color: #113822;
              display: block;
            }
            .pickup-loc {
              color: #475569;
              display: block;
              font-size: 8.5px;
            }
            .roster-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 5px;
            }
            .roster-item {
              background: #f0fdf4;
              border: 1px solid #dcfce7;
              border-radius: 6px;
              padding: 5px 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 9.5px;
            }
            .meal-badge {
              font-size: 8px;
              font-weight: 700;
              padding: 1px 6px;
              border-radius: 4px;
            }
            .meal-veg { background: #dcfce7; color: #166534; }
            .meal-nonveg { background: #ffe4e6; color: #9f1239; }
            .cash-alert {
              background: #fffbeb;
              border: 1px solid #fde68a;
              color: #78350f;
              border-radius: 6px;
              padding: 6px 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 9.5px;
              margin-bottom: 8px;
            }
            .bottom-grid {
              display: grid;
              grid-template-columns: 120px 1fr;
              gap: 10px;
              align-items: stretch;
              margin-bottom: 8px;
            }
            .qr-box {
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-radius: 8px;
              padding: 6px;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .qr-img {
              width: 90px;
              height: 90px;
              display: block;
              object-fit: contain;
            }
            .qr-sub {
              font-size: 8px;
              font-weight: 800;
              color: #113822;
              text-transform: uppercase;
              margin-top: 2px;
            }
            .qr-desc {
              font-size: 7.5px;
              color: #64748b;
            }
            .rules-col {
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
            .rules-box {
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 6px;
              padding: 6px 8px;
              font-size: 9px;
              color: #064e3b;
            }
            .checklist-box {
              background: #fffbeb;
              border: 1px solid #fef3c7;
              border-radius: 6px;
              padding: 6px 8px;
              font-size: 9px;
              color: #78350f;
            }
            .box-heading {
              font-size: 8.5px;
              font-weight: 800;
              text-transform: uppercase;
              margin-bottom: 2px;
              display: block;
            }
            .footer-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-top: 8px;
              border-top: 1px solid #e2e8f0;
              font-size: 9px;
              color: #64748b;
            }
            .footer-contact {
              font-weight: 700;
              color: #113822;
            }
          </style>
        </head>
        <body>
          <div class="ticket-wrap">
            <!-- Header -->
            <div class="brand-header">
              <div>
                <div class="logo-title">Visit<span class="logo-accent">Kokan</span></div>
                <div class="tagline">Official Boarding Pass &amp; Expedition Ticket</div>
              </div>
              <div class="ref-box">
                <span style="font-size: 8px; color: #64748b; text-transform: uppercase; font-weight: 700;">Booking Reference ID</span>
                <span class="ref-id">${order.id}</span>
                <span style="font-size: 8px; color: #64748b;">Issued: ${formattedDate}</span>
              </div>
            </div>

            <!-- Hero Capsule -->
            <div class="hero-card">
              <div class="hero-badge-row">
                <span class="badge-cat">${isTrek ? "Sahyadri Fort Weekend Expedition" : "Authentic Konkan Products"}</span>
                <span class="badge-status">${order.status === "confirmed" ? "STATUS: SEAT CONFIRMED ✅" : "STATUS: PENDING VERIFICATION ⏳"}</span>
              </div>
              <div class="trip-name">${order.trekName || (isTrek ? "Sahyadri Fort Expedition" : "Konkan Products Order")}</div>
              ${isTrek ? `<div class="batch-date">📅 Scheduled Batch Departure: <strong>${order.trekDate || "Every Saturday 10:00 PM"}</strong></div>` : ""}

              <div class="summary-grid">
                <div>
                  <span class="summary-label">Lead Guest</span>
                  <span class="summary-val">${order.userName || order.userEmail.split("@")[0]}</span>
                </div>
                <div>
                  <span class="summary-label">Reserved Slots</span>
                  <span class="summary-val">${isTrek ? `${order.persons?.length || 1} Trekker Slot(s)` : `${order.items?.length || 1} Item(s)`}</span>
                </div>
                <div>
                  <span class="summary-label">Paid Online</span>
                  <span class="summary-val" style="color: #b8dc26; font-size: 11px;">₹${order.totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span class="summary-label">Payment ID</span>
                  <span class="summary-val" style="font-family: monospace;">${order.razorpayPaymentId || "CASH-ON-MEETUP"}</span>
                </div>
              </div>
            </div>

            <!-- Pickups Schedule (Trek only) -->
            ${
              isTrek
                ? `
            <div class="section-box">
              <div class="section-title">
                <span>🚌 Mumbai 10:00 PM Saturday Pickup Schedule</span>
                <span style="font-size: 8.5px; color: #047857; background: #ecfdf5; padding: 1px 6px; border-radius: 4px;">AC Push-back Coach</span>
              </div>
              <div class="pickup-grid">
                <div class="pickup-item">
                  <span class="pickup-time">10:00 PM</span>
                  <span class="pickup-loc">Borivali (National Park Gate)</span>
                </div>
                <div class="pickup-item">
                  <span class="pickup-time">10:25 PM</span>
                  <span class="pickup-loc">Andheri (Bisleri WEH)</span>
                </div>
                <div class="pickup-item">
                  <span class="pickup-time">10:50 PM</span>
                  <span class="pickup-loc">Sion Circle (Cineplanet)</span>
                </div>
                <div class="pickup-item">
                  <span class="pickup-time">11:10 PM</span>
                  <span class="pickup-loc">Chembur (Kalaniketan)</span>
                </div>
                <div class="pickup-item">
                  <span class="pickup-time">11:35 PM</span>
                  <span class="pickup-loc">Vashi (Toll Plaza)</span>
                </div>
                <div class="pickup-item">
                  <span class="pickup-time">11:55 PM</span>
                  <span class="pickup-loc">Panvel (Kalamboli Circle)</span>
                </div>
              </div>
            </div>
            `
                : ""
            }

            <!-- Registered Passenger Roster (Trek only) -->
            ${
              isTrek && order.persons && order.persons.length > 0
                ? `
            <div class="section-box">
              <div class="section-title">
                <span>👥 Registered Passengers (${order.persons.length})</span>
                <span style="font-size: 8px; color: #64748b;">Official Manifest</span>
              </div>
              <div class="roster-grid">
                ${order.persons
                  .map(
                    (p, idx) => `
                  <div class="roster-item">
                    <span><strong>${idx + 1}. ${p.name}</strong> <span style="color:#64748b; font-size:8.5px;">(${p.age ? p.age + "y" : ""}${p.gender ? ", " + p.gender[0].toUpperCase() : ""})</span></span>
                    <span class="meal-badge ${p.foodPreference === "non-veg" ? "meal-nonveg" : "meal-veg"}">
                      ${p.foodPreference === "non-veg" ? "Non-Veg" : "Veg"}
                    </span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
            `
                : ""
            }

            <!-- Balance Due if applicable -->
            ${
              order.remainingCash && order.remainingCash > 0
                ? `
            <div class="cash-alert">
              <span><strong>💵 Balance Payable at Boarding:</strong> Keep ready in cash for trek leader at pickup</span>
              <strong style="font-size: 11px;">₹${order.remainingCash.toLocaleString("en-IN")}</strong>
            </div>
            `
                : ""
            }

            <!-- Bottom QR + Inclusions + Checklist -->
            <div class="bottom-grid">
              <div class="qr-box">
                <img src="${qrDataUrl}" alt="QR" class="qr-img" />
                <div class="qr-sub">Scan to Verify</div>
                <div class="qr-desc">Scan with phone camera</div>
                <div style="font-size: 7.5px; font-family: monospace; color: #065f46; margin-top: 2px;">VK-PASS-${order.id.slice(0, 8).toUpperCase()}</div>
              </div>

              <div class="rules-col">
                <div class="rules-box">
                  <span class="box-heading">🛡️ Inclusions Covered</span>
                  ${
                    isTrek
                      ? "Private AC bus transit (Mumbai ⇄ Base ⇄ Mumbai), hot morning breakfast, herbal masala chai, traditional Konkani feast lunch, certified first-aid trek leaders, and forest/fort entry permits."
                      : "Authentic, cold-processed Konkan coastal products securely packaged with transit tracking."
                  }
                </div>
                <div class="checklist-box">
                  <span class="box-heading">⚠️ Mandatory Checklist</span>
                  Carry Government Photo ID (Aadhaar / DL), sturdy trekking shoes with lug grip, minimum 2L drinking water, and personal medications.
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer-row">
              <div>
                Emergency Desk / Trek Lead: <span class="footer-contact">+91 84325 87706</span> | <span class="footer-contact">konkanvisit@gmail.com</span>
              </div>
              <div style="font-weight: 700;">visitkokan.in · Official Tourism Gateway</div>
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Trigger print from the clean, 1-page iframe!
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      if (onDownloaded) onDownloaded();
      setTimeout(() => {
        try {
          iframe.remove();
        } catch {}
      }, 3000);
    }, 250);
  };

  return (
    <div className="booking-pass-backdrop fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-5">
      {/* Modal Card */}
      <div
        ref={modalRef}
        className="booking-pass-card relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-900/10 overflow-hidden my-auto"
      >
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-[#0f2a1a] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Official E-Pass &amp; Boarding Ticket
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Print or Save as 1-Page PDF"
            >
              <Printer size={13} />
              <span>Print / Save PDF</span>
            </button>

            <a
              href={`https://wa.me/?text=${whatsappShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all cursor-pointer"
              title="Share on WhatsApp"
            >
              <Share2 size={13} />
              <span className="hidden sm:inline">Share</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            PRINTABLE TICKET SECTION (Visible on screen and in print)
           ══════════════════════════════════════════════════════════════ */}
        <div id="printable-ticket" className="p-4 sm:p-6 bg-[#fafcf9] text-[#12261a] space-y-3.5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b-2 border-emerald-800/15 gap-2">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xl sm:text-2xl font-black font-playfair tracking-tight text-[#113822]">
                  Visit<span className="text-[#c18c47]">Kokan</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[9px] font-black uppercase tracking-wider border border-emerald-300">
                  Verified Pass
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-emerald-900/70">
                Official Tourism &amp; Sahyadri Expedition Gateway
              </p>
            </div>

            <div className="text-left sm:text-right bg-emerald-50/70 px-2.5 py-1.5 rounded-xl border border-emerald-100">
              <span className="text-[9px] uppercase font-bold text-gray-500 block">
                Booking Reference ID
              </span>
              <span className="font-mono text-xs sm:text-sm font-black text-[#113822] tracking-wider block">
                {order.id}
              </span>
              <span className="text-[9px] text-gray-500 block">Booked: {formattedDate}</span>
            </div>
          </div>

          {/* Trip Hero Capsule */}
          <div className="bg-gradient-to-br from-[#122c1b] via-[#1a442a] to-[#255e39] text-white p-4 rounded-2xl shadow-sm space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-300">
                {isTrek ? "Sahyadri Fort Weekend Expedition" : "Authentic Konkan Products"}
              </span>
              <span
                className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                  order.status === "confirmed"
                    ? "bg-emerald-400 text-emerald-950 font-black"
                    : "bg-amber-400 text-amber-950 font-black"
                }`}
              >
                {order.status === "confirmed"
                  ? "STATUS: SEAT CONFIRMED ✅"
                  : "STATUS: PENDING PICKUP VERIFICATION ⏳"}
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
                {order.trekName || (isTrek ? "Sahyadri Fort Expedition" : "Authentic Konkan Products Order")}
              </h2>
              {isTrek && (
                <p className="text-xs text-emerald-100/90 mt-0.5 flex items-center gap-1.5">
                  <Clock size={12} className="text-emerald-300 shrink-0" />
                  <span>
                    Scheduled Batch Departure:{" "}
                    <strong className="text-white underline decoration-emerald-400 underline-offset-2">
                      {order.trekDate || "Every Saturday 10:00 PM"}
                    </strong>
                  </span>
                </p>
              )}
            </div>

            {/* Quick Summary Grid */}
            <div className="pt-2 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[9px] text-white/60 block uppercase font-medium">Lead Guest</span>
                <span className="font-bold text-white truncate block text-[11px]">
                  {order.userName || order.userEmail.split("@")[0]}
                </span>
                <span className="text-[9px] text-white/70 truncate block">{order.userEmail}</span>
              </div>
              <div>
                <span className="text-[9px] text-white/60 block uppercase font-medium">Reserved Slots</span>
                <span className="font-bold text-white text-[11px]">
                  {isTrek
                    ? `${order.persons?.length || 1} Trekker Slot(s)`
                    : `${order.items?.length || 1} Item(s)`}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-white/60 block uppercase font-medium">Paid Online</span>
                <span className="font-bold text-[#b8dc26] text-xs">
                  ₹{order.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-white/60 block uppercase font-medium">Payment ID</span>
                <span className="font-mono font-bold text-white text-[10px] truncate block">
                  {order.razorpayPaymentId || "CASH-ON-MEETUP"}
                </span>
              </div>
            </div>
          </div>

          {/* Mumbai Pickups & Boarding Details (Trek Only) */}
          {isTrek && (
            <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-[#123822] flex items-center gap-1">
                  <Bus size={13} className="text-emerald-700" /> Mumbai 10:00 PM Saturday Pickup Schedule
                </h3>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  AC Push-back Coach
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs text-[#253f2c]">
                <div className="p-1.5 bg-[#f6f9f5] rounded-lg border border-[#e1ece0]">
                  <span className="font-bold text-[#113822] block text-[10px]">10:00 PM</span>
                  <span className="text-[9px] text-gray-600">Borivali (National Park Gate)</span>
                </div>
                <div className="p-1.5 bg-[#f6f9f5] rounded-lg border border-[#e1ece0]">
                  <span className="font-bold text-[#113822] block text-[10px]">10:25 PM</span>
                  <span className="text-[9px] text-gray-600">Andheri (Bisleri WEH)</span>
                </div>
                <div className="p-1.5 bg-[#f6f9f5] rounded-lg border border-[#e1ece0]">
                  <span className="font-bold text-[#113822] block text-[10px]">10:50 PM</span>
                  <span className="text-[9px] text-gray-600">Sion Circle (Cineplanet)</span>
                </div>
                <div className="p-1.5 bg-[#f6f9f5] rounded-lg border border-[#e1ece0]">
                  <span className="font-bold text-[#113822] block text-[10px]">11:10 PM</span>
                  <span className="text-[9px] text-gray-600">Chembur (Kalaniketan)</span>
                </div>
                <div className="p-1.5 bg-[#f6f9f5] rounded-lg border border-[#e1ece0]">
                  <span className="font-bold text-[#113822] block text-[10px]">11:35 PM</span>
                  <span className="text-[9px] text-gray-600">Vashi (Toll Plaza)</span>
                </div>
                <div className="p-1.5 bg-[#f6f9f5] rounded-lg border border-[#e1ece0]">
                  <span className="font-bold text-[#113822] block text-[10px]">11:55 PM</span>
                  <span className="text-[9px] text-gray-600">Panvel (Kalamboli Circle)</span>
                </div>
              </div>
            </div>
          )}

          {/* Registered Passenger Roster (Trek Only) */}
          {isTrek && order.persons && order.persons.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-2.5 space-y-1.5">
              <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#123822] flex items-center gap-1">
                  <Users size={12} className="text-emerald-700" /> Registered Passengers ({order.persons.length})
                </span>
                <span className="text-[9px] text-gray-400">Official Passenger Manifest</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                {order.persons.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 bg-[#f7faf6] rounded-lg border border-emerald-100 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-kokan-earth block text-[10px]">
                        {idx + 1}. {p.name}
                      </span>
                      <span className="text-[9px] text-gray-500">
                        {p.gender ? `${p.gender.toUpperCase()} · ` : ""}
                        {p.age ? `${p.age} yrs` : ""}
                      </span>
                    </div>
                    <span
                      className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
                        p.foodPreference === "non-veg"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {p.foodPreference === "non-veg" ? "Non-Veg" : "Veg Meal"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Balance Payment Notice if applicable */}
          {order.remainingCash && order.remainingCash > 0 ? (
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
              <div>
                <span className="font-bold block text-[10px]">💵 Balance Due at Boarding</span>
                <span className="text-[9px] text-amber-900/80">
                  Please keep this exact amount ready in cash for your trek leader at pickup.
                </span>
              </div>
              <span className="font-black text-amber-900 text-xs ml-2">
                ₹{order.remainingCash.toLocaleString("en-IN")}
              </span>
            </div>
          ) : null}

          {/* QR Code + Inclusions + Mandatory Checklist (Compact Side-by-side) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-0.5 items-stretch">
            {/* Scannable QR Code */}
            <div className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-emerald-900/20 text-center shadow-2xs">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt={`Booking QR Code - ${order.id}`}
                  className="w-24 h-24 object-contain rounded-md"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                  Loading QR...
                </div>
              )}
              <span className="text-[9px] font-black uppercase tracking-wider text-[#113822] mt-1 block">
                Official Boarding QR
              </span>
              <span className="text-[8px] text-gray-500 block leading-tight">
                Scan with camera to verify pass
              </span>
              <span className="text-[7.5px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-full mt-0.5 border border-emerald-200">
                VK-PASS-{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            {/* Inclusions & Rules */}
            <div className="sm:col-span-2 space-y-1.5 text-xs flex flex-col justify-between">
              <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-100 text-[#173a24]">
                <p className="font-bold text-[9.5px] uppercase tracking-wider text-emerald-900 mb-0.5 flex items-center gap-1">
                  <ShieldCheck size={11} className="text-emerald-700" /> Inclusions Covered
                </p>
                <p className="text-[9px] leading-relaxed text-emerald-950/80">
                  {isTrek
                    ? "Private AC bus transit (Mumbai ⇄ Base ⇄ Mumbai), morning hot breakfast, masala chai, traditional Konkani feast lunch, certified first-aid trek leaders, and forest/fort entry permits."
                    : "Authentic, cold-processed Konkan coastal products securely packaged with transit tracking."}
                </p>
              </div>

              <div className="p-2 bg-amber-50/70 rounded-lg border border-amber-200 text-[#422d0d]">
                <p className="font-bold text-[9.5px] uppercase tracking-wider text-amber-900 mb-0.5 flex items-center gap-1">
                  <AlertTriangle size={11} className="text-amber-700" /> Mandatory Checklist
                </p>
                <p className="text-[9px] leading-relaxed text-amber-950/80">
                  Carry Government Photo ID (Aadhaar / Driving License), sturdy trekking shoes with lug grip, minimum 2L drinking water, and personal medications.
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Helpline & Footer */}
          <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-600 gap-1.5">
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-[#113822] font-semibold">
                <Phone size={11} className="text-emerald-700" /> +91 84325 87706
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <Mail size={11} className="text-gray-400" /> konkanvisit@gmail.com
              </span>
            </div>
            <div className="text-[9px] text-gray-400 font-medium">
              visitkokan.in · Official Tourism &amp; Trekking Gateway
            </div>
          </div>
        </div>

        {/* Modal Bottom Buttons (Hidden on Print) */}
        <div className="no-print bg-gray-50 border-t border-gray-200 px-5 py-3.5 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500 hidden sm:block">
            Tip: In the print dialog, choose &quot;Save as PDF&quot; to download this single-page pass.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 bg-kokan-green hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-kokan-green/20 transition-all cursor-pointer"
            >
              <Download size={13} />
              <span>Download 1-Page PDF Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          FALLBACK CSS FOR DIRECT WINDOW PRINTING (NO BLANK PAGES)
         ══════════════════════════════════════════════════════════════ */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            overflow: visible !important;
            height: auto !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body > * {
            display: none !important;
          }
          body > *:has(#printable-ticket),
          body > div:has(#printable-ticket) {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .booking-pass-backdrop {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            display: block !important;
            overflow: visible !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .booking-pass-card {
            position: static !important;
            display: block !important;
            overflow: visible !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #printable-ticket {
            display: block !important;
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            background: #ffffff !important;
            color: #12261a !important;
            border: 1.5px solid #113822 !important;
            border-radius: 12px !important;
            padding: 16px 20px !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-ticket * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print,
          .no-print * {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
